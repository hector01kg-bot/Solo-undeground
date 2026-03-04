(function () {
  const APP_VERSION = '2026.02.27.5';
  const STORAGE_KEY = 'soloUndergroundState';
  const defaultState = {
    theme: 'light',
    lang: 'ru',
    readArticles: [],
    tests: {},
    counters: {
      articlesRead: 0,
      testsDone: 0
    }
  };
  const uiText = {
    theme: {
      ru: { light: 'Тёмная тема', dark: 'Светлая тема' },
      en: { light: 'Dark Theme', dark: 'Light Theme' }
    },
    quizResult: {
      ru: function (c, t, p) { return 'Результат: ' + c + ' из ' + t + ' (' + p + '%).'; },
      en: function (c, t, p) { return 'Result: ' + c + ' out of ' + t + ' (' + p + '%).'; }
    }
  };

  function normalizeLang(value) {
    return value === 'en' ? 'en' : 'ru';
  }

  function normalizeTheme(value) {
    return value === 'dark' ? 'dark' : 'light';
  }

  function getState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...defaultState };
      const parsed = JSON.parse(raw);
      const next = {
        ...defaultState,
        ...parsed,
        lang: normalizeLang(parsed.lang),
        theme: normalizeTheme(parsed.theme),
        counters: { ...defaultState.counters, ...(parsed.counters || {}) },
        readArticles: Array.isArray(parsed.readArticles) ? parsed.readArticles : []
      };
      return next;
    } catch (e) {
      return { ...defaultState };
    }
  }

  function setState(nextState) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
  }

  function getProjectRootUrl() {
    const match = Array.from(document.querySelectorAll('script[src]')).find(function (s) {
      const src = s.getAttribute('src') || '';
      return /(?:^|\/)script\.js(?:\?|$)/i.test(src);
    });

    if (match) {
      return new URL('./', new URL(match.getAttribute('src'), document.baseURI)).toString();
    }
    return new URL('./', document.baseURI).toString();
  }

  const PROJECT_ROOT_URL = getProjectRootUrl();

  function resolveProjectUrl(path) {
    const safePath = (path || '').replace(/^\/+/, '');
    return new URL(safePath, PROJECT_ROOT_URL).toString();
  }

  function ensurePsychEffectsMenuLink() {
    document.querySelectorAll('[data-menu-panel]').forEach(function (panel) {
      const existing = panel.querySelector('[data-nav-link="psychological-effects.html"]');
      if (existing) return;

      const link = document.createElement('a');
      link.className = 'dropdown-link';
      link.setAttribute('data-nav-link', 'psychological-effects.html');
      link.setAttribute('href', resolveProjectUrl('psychological-effects.html'));
      link.innerHTML = '<span data-lang="ru">Психологические эффекты</span><span data-lang="en">Psychological Effects</span>';
      panel.appendChild(link);
    });
  }

  function ensureCoursesMenuLink() {
    document.querySelectorAll('[data-menu-panel]').forEach(function (panel) {
      const existing = panel.querySelector('[data-nav-link="courses.html"], a[href*="courses.html"], a[href*="encyclopedia/index.html"]');
      if (existing) return;

      const link = document.createElement('a');
      link.className = 'dropdown-link';
      link.setAttribute('data-nav-link', 'courses.html');
      link.setAttribute('href', resolveProjectUrl('courses.html'));
      link.innerHTML = '<span data-lang="ru">Курсы</span><span data-lang="en">Courses</span>';
      panel.appendChild(link);
    });
  }

  function ensureAiAssistantMenuLink() {
    document.querySelectorAll('[data-menu-panel]').forEach(function (panel) {
      const existing = panel.querySelector('[data-nav-link="ai-chat.html"]');
      if (existing) {
        existing.classList.add('ai-menu-link');
        existing.setAttribute('data-ai-assistant-link', '1');
        return;
      }

      const link = document.createElement('a');
      link.className = 'dropdown-link ai-menu-link';
      link.setAttribute('data-nav-link', 'ai-chat.html');
      link.setAttribute('data-ai-assistant-link', '1');
      link.setAttribute('href', resolveProjectUrl('ai-chat.html'));
      link.innerHTML = '<span data-lang="ru">ИИ-помощник</span><span data-lang="en">AI Assistant</span>';
      panel.appendChild(link);
    });
  }

  function addVersion(url) {
    if (!url || /^(mailto:|tel:|javascript:|#)/i.test(url)) return url;
    try {
      const abs = new URL(url, document.baseURI);
      abs.searchParams.set('v', APP_VERSION);
      return abs.toString();
    } catch (e) {
      return url;
    }
  }

  function applyNavLinks() {
    document.querySelectorAll('[data-nav-link]').forEach(function (link) {
      const path = link.getAttribute('data-nav-link') || '';
      link.setAttribute('href', addVersion(resolveProjectUrl(path)));
    });
  }

  function versionizePlainLinks() {
    document.querySelectorAll('a[href]').forEach(function (link) {
      if (link.hasAttribute('data-nav-link')) return;
      const href = link.getAttribute('href');
      if (!href) return;
      if (/^(https?:|mailto:|tel:|javascript:|#)/i.test(href)) return;
      if (!/\.html(\?|#|$)/i.test(href)) return;
      link.setAttribute('href', addVersion(href));
    });
  }

  function replaceLegacyEncyclopediaLinks() {
    document.querySelectorAll('[data-nav-link="encyclopedia/index.html"]').forEach(function (link) {
      link.setAttribute('data-nav-link', 'courses.html');
      if (link.querySelector('[data-lang="ru"]') && link.querySelector('[data-lang="en"]')) {
        link.querySelector('[data-lang="ru"]').textContent = 'Курсы';
        link.querySelector('[data-lang="en"]').textContent = 'Courses';
      }
    });

    document.querySelectorAll('a[href*="encyclopedia/index.html"]').forEach(function (link) {
      if (!link.hasAttribute('data-nav-link')) {
        link.setAttribute('href', addVersion(resolveProjectUrl('courses.html')));
        if (link.querySelector('[data-lang="ru"]') && link.querySelector('[data-lang="en"]')) {
          link.querySelector('[data-lang="ru"]').textContent = 'Курсы';
          link.querySelector('[data-lang="en"]').textContent = 'Courses';
        }
      }
    });
  }

  function applyLanguageBlocks(lang) {
    const safeLang = normalizeLang(lang);
    document.documentElement.setAttribute('lang', safeLang);
    document.documentElement.setAttribute('data-lang-active', safeLang);

    document.querySelectorAll('[data-lang]').forEach(function (el) {
      if (el.getAttribute('data-lang') === safeLang) {
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    });

    document.querySelectorAll('[data-i18n-placeholder-ru]').forEach(function (el) {
      const value = safeLang === 'en' ? el.getAttribute('data-i18n-placeholder-en') : el.getAttribute('data-i18n-placeholder-ru');
      if (value) el.setAttribute('placeholder', value);
    });

    const langToggle = document.querySelector('[data-lang-toggle]');
    if (langToggle) langToggle.textContent = 'ENG / RUS';

    // Safety fallback: if content language is missing in <main>, force Russian.
    const mainLangBlocks = document.querySelectorAll('main [data-lang]');
    const visibleInMain = document.querySelectorAll('main [data-lang="' + safeLang + '"]:not(.hidden)');
    if (mainLangBlocks.length && !visibleInMain.length && safeLang !== 'ru') {
      document.querySelectorAll('[data-lang]').forEach(function (el) {
        if (el.getAttribute('data-lang') === 'ru') el.classList.remove('hidden');
        else el.classList.add('hidden');
      });
      const state = getState();
      state.lang = 'ru';
      setState(state);
      document.documentElement.setAttribute('lang', 'ru');
      document.documentElement.setAttribute('data-lang-active', 'ru');
    }
  }

  function applyTheme(theme) {
    const state = getState();
    const lang = normalizeLang(state.lang);
    const safeTheme = normalizeTheme(theme);
    document.documentElement.setAttribute('data-theme', safeTheme);
    const btn = document.querySelector('[data-theme-toggle]');
    if (btn) {
      const key = safeTheme === 'dark' ? 'dark' : 'light';
      btn.textContent = uiText.theme[lang][key];
    }
  }

  function applyLanguage(lang) {
    const safeLang = normalizeLang(lang);
    applyLanguageBlocks(safeLang);
    const state = getState();
    applyTheme(state.theme || 'light');
    refreshReadButtonText();
    refreshActiveMapPanel();
    document.dispatchEvent(new CustomEvent('solo:langchange', { detail: { lang: safeLang } }));
  }

  function initThemeAndLang() {
    const state = getState();
    setState(state);
    applyLanguage(state.lang || 'ru');
    applyTheme(state.theme || 'light');

    const themeBtn = document.querySelector('[data-theme-toggle]');
    if (themeBtn) {
      themeBtn.addEventListener('click', function () {
        const current = getState();
        current.theme = current.theme === 'dark' ? 'light' : 'dark';
        setState(current);
        applyTheme(current.theme);
      });
    }

    const langBtn = document.querySelector('[data-lang-toggle]');
    if (langBtn) {
      langBtn.addEventListener('click', function () {
        const current = getState();
        current.lang = current.lang === 'en' ? 'ru' : 'en';
        setState(current);
        applyLanguage(current.lang);
      });
    }
  }

  function getCurrentLang() {
    const state = getState();
    return normalizeLang(state.lang);
  }

  function renderCounters() {
    const state = getState();
    const values = {
      articlesRead: state.readArticles.length,
      testsDone: state.counters.testsDone
    };

    Object.keys(values).forEach(function (id) {
      const el = document.querySelector('[data-counter="' + id + '"]');
      if (el) el.textContent = values[id];
    });
  }

  function setReadButtonText(btn, done) {
    const lang = getCurrentLang();
    const label = done
      ? (lang === 'en' ? (btn.getAttribute('data-done-en') || 'Read') : (btn.getAttribute('data-done-ru') || 'Прочитано'))
      : (lang === 'en' ? (btn.getAttribute('data-read-en') || 'Mark as read') : (btn.getAttribute('data-read-ru') || 'Отметить как прочитанное'));
    btn.textContent = label;
  }

  function refreshReadButtonText() {
    const btn = document.querySelector('[data-mark-read]');
    if (!btn) return;
    const articleId = btn.getAttribute('data-article-id');
    const state = getState();
    setReadButtonText(btn, state.readArticles.includes(articleId));
  }

  function initArticleButtons() {
    const btn = document.querySelector('[data-mark-read]');
    if (!btn) return;

    const articleId = btn.getAttribute('data-article-id');
    const state = getState();
    const done = state.readArticles.includes(articleId);
    setReadButtonText(btn, done);
    if (done) btn.disabled = true;

    btn.addEventListener('click', function () {
      const current = getState();
      if (!current.readArticles.includes(articleId)) {
        current.readArticles.push(articleId);
        current.counters.articlesRead = current.readArticles.length;
        setState(current);
      }
      setReadButtonText(btn, true);
      btn.disabled = true;
      renderCounters();
    });
  }

  function initQuiz() {
    const wrap = document.querySelector('[data-quiz]');
    if (!wrap) return;

    const submit = document.querySelector('[data-quiz-submit]');
    const result = document.querySelector('[data-quiz-result]');
    if (!submit || !result) return;

    submit.addEventListener('click', function () {
      const questions = Array.from(wrap.querySelectorAll('.quiz-question'));
      let correct = 0;
      questions.forEach(function (q) {
        const right = q.getAttribute('data-answer');
        const checked = q.querySelector('input[type="radio"]:checked');
        if (checked && checked.value === right) correct += 1;
      });

      const total = questions.length;
      const percent = Math.round((correct / total) * 100);
      const lang = getCurrentLang();
      result.textContent = uiText.quizResult[lang](correct, total, percent);
      result.classList.remove('hidden');

      const state = getState();
      const quizId = wrap.getAttribute('data-quiz-id') || 'quiz';
      if (!state.tests[quizId]) {
        state.counters.testsDone += 1;
      }
      state.tests[quizId] = { correct: correct, total: total, percent: percent, completedAt: Date.now() };
      setState(state);
      renderCounters();
    });
  }

  function refreshActiveMapPanel() {
    const panel = document.querySelector('[data-bias-panel]');
    const active = document.querySelector('.map-item.active');
    if (!panel || !active) return;
    const lang = getCurrentLang();
    const title = lang === 'en' ? active.getAttribute('data-title-en') : active.getAttribute('data-title-ru');
    const desc = lang === 'en' ? active.getAttribute('data-desc-en') : active.getAttribute('data-desc-ru');
    panel.innerHTML = '<h3>' + title + '</h3><p>' + desc + '</p>';
  }

  function initBiasMap() {
    const map = document.querySelector('[data-bias-map]');
    if (!map) return;

    const items = Array.from(map.querySelectorAll('.map-item'));
    const panel = document.querySelector('[data-bias-panel]');

    items.forEach(function (item) {
      item.addEventListener('click', function () {
        items.forEach(function (x) { x.classList.remove('active'); });
        item.classList.add('active');

        if (panel) {
          const lang = getCurrentLang();
          const title = lang === 'en' ? item.getAttribute('data-title-en') : item.getAttribute('data-title-ru');
          const desc = lang === 'en' ? item.getAttribute('data-desc-en') : item.getAttribute('data-desc-ru');
          panel.innerHTML = '<h3>' + title + '</h3><p>' + desc + '</p>';
        }
      });
    });
  }

  function initSimulator() {
    const blocks = Array.from(document.querySelectorAll('[data-scenario]'));
    if (!blocks.length) return;

    blocks.forEach(function (block) {
      block.addEventListener('click', function (e) {
        const target = e.target.closest('[data-choice]');
        if (!target) return;
        const lang = getCurrentLang();
        const analysis = lang === 'en'
          ? target.getAttribute('data-analysis-en')
          : target.getAttribute('data-analysis-ru');

        const result = block.querySelector('[data-scenario-result]');
        if (result) {
          result.textContent = analysis;
          result.classList.remove('hidden');
        }
      });
    });
  }

  function initMenu() {
    const toggle = document.querySelector('[data-menu-toggle]');
    const panel = document.querySelector('[data-menu-panel]');
    if (!toggle || !panel) return;

    toggle.addEventListener('click', function () {
      panel.classList.toggle('active');
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest('.menu-wrap')) {
        panel.classList.remove('active');
      }
    });
  }

  function initReveal() {
    const targets = document.querySelectorAll('.card, .panel, .article-content h1, .article-content h2, .article-content p, .article-content ul, .article-content ol, .case-box, .exercise-box, .section-title, .hero h1, .hero p, .hero .btn');
    if (!targets.length) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    targets.forEach(function (el) {
      el.classList.add('reveal');
      observer.observe(el);
    });
  }

  function initPageTransitions() {
    requestAnimationFrame(function () {
      document.body.classList.add('page-ready');
    });

    document.addEventListener('click', function (e) {
      const link = e.target.closest('a[href]');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      if (link.target === '_blank' || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;

      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin) return;
      if (!url.pathname.endsWith('.html')) return;
      if (url.href === location.href) return;

      e.preventDefault();
      document.body.classList.add('page-leaving');
      setTimeout(function () {
        location.href = url.href;
      }, 180);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    console.log('[solo] init', {
      page: location.pathname,
      baseURI: document.baseURI,
      projectRoot: PROJECT_ROOT_URL
    });
    ensurePsychEffectsMenuLink();
    ensureAiAssistantMenuLink();
    ensureCoursesMenuLink();
    replaceLegacyEncyclopediaLinks();
    applyNavLinks();
    versionizePlainLinks();
    initThemeAndLang();
    renderCounters();
    initArticleButtons();
    initQuiz();
    initBiasMap();
    initSimulator();
    initMenu();
    initReveal();
    initPageTransitions();
  });
})();










