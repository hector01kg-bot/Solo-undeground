(function () {
  const APP_VERSION = '2026.02.27.5';
  const STORAGE_KEY = 'soloUndergroundState';

  const STATIC_SEARCH_INDEX = [
    {
      title: { ru: 'Тёмная психология', en: 'Dark Psychology' },
      section: { ru: 'Раздел', en: 'Section' },
      keywords: 'тёмная психология dark psychology triad narcissism manipulation',
      url: '/sections/dark-psychology/index.html'
    },
    {
      title: { ru: 'Тёмная триада', en: 'Dark Triad' },
      section: { ru: 'Статья', en: 'Article' },
      keywords: 'нарциссизм макиавеллизм психопатия narcissism machiavellianism psychopathy',
      url: '/sections/dark-psychology/dark-triad.html'
    },
    {
      title: { ru: 'Газлайтинг и лавбомбинг', en: 'Gaslighting and Love Bombing' },
      section: { ru: 'Статья', en: 'Article' },
      keywords: 'газлайтинг лавбомбинг boundaries manipulation abuse',
      url: '/sections/dark-psychology/manipulation.html'
    },
    {
      title: { ru: 'Нарциссизм: глубокий разбор', en: 'Narcissism: Deep Review' },
      section: { ru: 'Статья', en: 'Article' },
      keywords: 'нарциссизм grandiose vulnerable narcissism',
      url: '/sections/dark-psychology/narcissism.html'
    },
    {
      title: { ru: 'Тест по тёмной психологии', en: 'Dark Psychology Test' },
      section: { ru: 'Тест', en: 'Test' },
      keywords: 'тест quiz dark psychology',
      url: '/sections/dark-psychology/test.html'
    },
    {
      title: { ru: 'Когнитивные искажения', en: 'Cognitive Biases' },
      section: { ru: 'Раздел', en: 'Section' },
      keywords: 'biases heuristics cognition',
      url: '/sections/cognitive-biases/index.html'
    },
    {
      title: { ru: 'Что такое когнитивные искажения', en: 'What Are Cognitive Biases' },
      section: { ru: 'Статья', en: 'Article' },
      keywords: 'эвристики heuristics thinking errors',
      url: '/sections/cognitive-biases/what-are-biases.html'
    },
    {
      title: { ru: 'Топ-5 искажений', en: 'Top 5 Biases' },
      section: { ru: 'Статья', en: 'Article' },
      keywords: 'dunning kruger barnum anchoring confirmation hindsight',
      url: '/sections/cognitive-biases/top5-biases.html'
    },
    {
      title: { ru: 'Искажения в жизни', en: 'Biases in Real Life' },
      section: { ru: 'Статья', en: 'Article' },
      keywords: 'career relations finance choices',
      url: '/sections/cognitive-biases/biases-in-life.html'
    },
    {
      title: { ru: 'Карта искажений', en: 'Bias Map' },
      section: { ru: 'Интерактив', en: 'Interactive' },
      keywords: 'map scheme cognitive biases',
      url: '/sections/cognitive-biases/scheme.html'
    },
    {
      title: { ru: 'Принятие решений', en: 'Decision Making' },
      section: { ru: 'Раздел', en: 'Section' },
      keywords: 'решения decisions system 1 system 2',
      url: '/sections/decisions/index.html'
    },
    {
      title: { ru: 'Система 1 и Система 2', en: 'System 1 and System 2' },
      section: { ru: 'Статья', en: 'Article' },
      keywords: 'kanheman fast slow thinking',
      url: '/sections/decisions/system1-2.html'
    },
    {
      title: { ru: 'Почему мы принимаем плохие решения', en: 'Why We Make Bad Decisions' },
      section: { ru: 'Статья', en: 'Article' },
      keywords: 'stress fatigue emotions risk',
      url: '/sections/decisions/bad-decisions.html'
    },
    {
      title: { ru: 'Симулятор решений', en: 'Decision Simulator' },
      section: { ru: 'Интерактив', en: 'Interactive' },
      keywords: 'simulator scenarios choice',
      url: '/sections/decisions/simulator.html'
    },
    {
      title: { ru: 'Социальная психология', en: 'Social Psychology' },
      section: { ru: 'Раздел', en: 'Section' },
      keywords: 'social psychology conformity obedience',
      url: '/sections/social/index.html'
    },
    {
      title: { ru: 'Конформизм и подчинение', en: 'Conformity and Obedience' },
      section: { ru: 'Статья', en: 'Article' },
      keywords: 'asch milgram authority group pressure',
      url: '/sections/social/conformity.html'
    },
    {
      title: { ru: 'Саморазвитие', en: 'Self Development' },
      section: { ru: 'Раздел', en: 'Section' },
      keywords: 'self development habits growth',
      url: '/sections/self-dev/index.html'
    },
    {
      title: { ru: 'Как формировать привычки', en: 'How to Build Habits' },
      section: { ru: 'Статья', en: 'Article' },
      keywords: 'habit loop routine discipline',
      url: '/sections/self-dev/habits.html'
    },
    {
      title: { ru: 'Психология', en: 'Psychology' },
      section: { ru: 'Раздел', en: 'Section' },
      keywords: 'психология база знаний cognitive decisions social self development',
      url: '/knowledge-base.html'
    },
    {
      title: { ru: 'Виды личностей', en: 'Personality Types' },
      section: { ru: 'Раздел', en: 'Section' },
      keywords: 'виды личностей personality types temperament big five сангвиник холерик флегматик меланхолик',
      url: '/encyclopedia/personality-psychology/index.html'
    },
    {
      title: { ru: 'Темпераменты', en: 'Temperaments' },
      section: { ru: 'Тема', en: 'Topic' },
      keywords: 'temperaments сангвиник холерик флегматик меланхолик тип темперамента',
      url: '/encyclopedia/temperaments/index.html'
    },
    {
      title: { ru: 'Индивидуальные различия', en: 'Individual Differences' },
      section: { ru: 'Тема', en: 'Topic' },
      keywords: 'individual differences personality traits big five differences',
      url: '/encyclopedia/individual-differences/index.html'
    },
    {
      title: { ru: 'Темная психология', en: 'Dark Psychology' },
      section: { ru: 'Раздел', en: 'Section' },
      keywords: 'тёмная психология dark psychology manipulation dark triad narcissism',
      url: '/dark-knowledge-base.html'
    },
    {
      title: { ru: 'Психологические эффекты', en: 'Psychological Effects' },
      section: { ru: 'Раздел', en: 'Section' },
      keywords: 'психологические эффекты даннинг крюгер барнум форер якорь ореол',
      url: '/psychological-effects.html'
    },
    {
      title: { ru: 'Курсы психологии', en: 'Psychology Courses' },
      section: { ru: 'Раздел', en: 'Section' },
      keywords: 'курсы психология уровни начинающий продвинутый профессиональный courses psychology levels',
      url: '/courses.html'
    },
    {
      title: { ru: 'ИИ-помощник', en: 'AI Assistant' },
      section: { ru: 'Раздел', en: 'Section' },
      keywords: 'чат ai помощник психология question answer',
      url: '/ai-chat.html'
    }
  ];

  let dynamicIndex = [];

  function getLang() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return 'ru';
      const state = JSON.parse(raw);
      return state.lang || 'ru';
    } catch (e) {
      return 'ru';
    }
  }

  function getProjectRootUrl() {
    const match = Array.from(document.querySelectorAll('script[src]')).find(function (s) {
      const src = s.getAttribute('src') || '';
      return /(?:^|\/)search\.js(?:\?|$)/i.test(src);
    });

    if (match) {
      return new URL('./', new URL(match.getAttribute('src'), document.baseURI)).toString();
    }
    return new URL('./', document.baseURI).toString();
  }

  const PROJECT_ROOT_URL = getProjectRootUrl();

  function normalizeProjectPath(path) {
    const safe = (path || '').replace(/^\/+/, '');
    if (safe === 'sections/dark-psychology/index.html') {
      return 'dark-knowledge-base.html';
    }
    return safe;
  }

  function resolveUrl(url) {
    const safe = normalizeProjectPath(url);
    return addVersion(new URL(safe, PROJECT_ROOT_URL).toString());
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

  function buildDynamicIndex(mapJson) {
    const entries = [];
    if (!mapJson || !Array.isArray(mapJson.sections)) return entries;

    mapJson.sections.forEach(function (section) {
      entries.push({
        title: { ru: section.titleRu, en: section.titleEn },
        section: { ru: 'Курс', en: 'Course' },
        keywords: [
          section.titleRu,
          section.titleEn,
          section.categoryRu,
          section.categoryEn,
          (section.tagsRu || []).join(' '),
          (section.tagsEn || []).join(' ')
        ].join(' '),
        url: '/' + section.path.replace(/^\//, '')
      });

      (section.articles || []).forEach(function (article) {
        entries.push({
          title: { ru: article.titleRu, en: article.titleEn },
          section: { ru: 'Статья', en: 'Article' },
          keywords: [
            section.titleRu,
            section.titleEn,
            article.titleRu,
            article.titleEn
          ].join(' '),
          url: '/' + article.path.replace(/^\//, '')
        });
      });
    });

    return entries;
  }

  function initSearch() {
    const input = document.querySelector('[data-search-input]');
    const results = document.querySelector('[data-search-results]');
    if (!input || !results) return;

    const mapUrl = resolveUrl('data/psychology-map.json');
    console.log('[search] loading map', mapUrl);
    fetch(mapUrl)
      .then(function (res) { return res.json(); })
      .then(function (data) {
        dynamicIndex = buildDynamicIndex(data);
        console.log('[search] map loaded', {
          sections: Array.isArray(data.sections) ? data.sections.length : 0,
          indexedItems: dynamicIndex.length
        });
      })
      .catch(function (err) {
        dynamicIndex = [];
        console.error('[search] map load failed', err);
      });

    input.addEventListener('input', function () {
      const query = input.value.trim().toLowerCase();
      const lang = getLang();
      if (query.length < 3) {
        results.innerHTML = '';
        results.classList.remove('active');
        return;
      }

      const fullIndex = STATIC_SEARCH_INDEX.concat(dynamicIndex);
      const found = fullIndex.filter(function (item) {
        const hay = (
          item.title.ru + ' ' + item.title.en + ' ' + item.section.ru + ' ' + item.section.en + ' ' + item.keywords
        ).toLowerCase();
        return hay.includes(query);
      }).slice(0, 12);

      if (!found.length) {
        results.innerHTML = '<div class="result-item">' + (lang === 'en' ? 'No results' : 'Ничего не найдено') + '</div>';
        results.classList.add('active');
        return;
      }

      results.innerHTML = found.map(function (item) {
        return '<a class="result-item" href="' + resolveUrl(item.url) + '"><strong>' + item.title[lang] + '</strong><div class="meta">' + item.section[lang] + '</div></a>';
      }).join('');

      results.classList.add('active');
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest('.search-wrap')) {
        results.classList.remove('active');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', initSearch);
})();


