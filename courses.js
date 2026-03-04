(function () {
  const APP_VERSION = '2026.02.27.2';

  const LEVELS = {
    beginner: {
      prefix: '1',
      slugs: [
        'introduction-to-psychology', 'history-of-psychology', 'general-psychology', 'developmental-psychology',
        'child-psychology', 'adolescent-psychology', 'adult-psychology', 'personality-psychology', 'temperaments',
        'individual-differences', 'social-psychology', 'communication-psychology', 'emotion-psychology',
        'motivation-psychology', 'learning-psychology', 'self-regulation', 'positive-psychology', 'health-psychology',
        'family-couple-psychology', 'conflict-psychology', 'group-psychology', 'influence-psychology',
        'attention-psychology', 'perception-psychology'
      ]
    },
    advanced: {
      prefix: '2',
      slugs: [
        'memory-psychology', 'thinking-psychology', 'cognitive-psychology', 'decision-psychology', 'cognitive-biases',
        'behavioral-economics', 'leadership-psychology', 'power-psychology', 'cross-cultural-psychology',
        'organizational-psychology', 'occupational-psychology', 'marketing-psychology', 'educational-psychology',
        'sports-psychology', 'legal-psychology', 'community-psychology', 'media-psychology', 'environmental-psychology',
        'identity-psychology', 'morality-psychology', 'stress-psychology', 'counseling-psychology', 'aging-psychology',
        'differential-psychology'
      ]
    },
    professional: {
      prefix: '3',
      slugs: [
        'clinical-psychology', 'psychopathology', 'neuropsychology', 'psychophysiology', 'biological-psychology',
        'neuroscience', 'research-methodology', 'psychometrics', 'quantitative-psychology', 'comparative-psychology',
        'psycholinguistics', 'cyberpsychology', 'political-psychology', 'religion-psychology', 'military-psychology',
        'behaviorism', 'cbt-models', 'humanistic-psychology', 'psychoanalysis', 'existential-psychology',
        'evolutionary-psychology', 'consciousness-psychology', 'metacognition'
      ]
    }
  };

  let courseData = window.psychologyCoursesData || null;

  function addVersion(url) {
    if (!url || /^(https?:|mailto:|tel:|javascript:|#)/i.test(url)) return url;
    const hashIndex = url.indexOf('#');
    const hash = hashIndex >= 0 ? url.slice(hashIndex) : '';
    const noHash = hashIndex >= 0 ? url.slice(0, hashIndex) : url;
    const qIndex = noHash.indexOf('?');
    const base = qIndex >= 0 ? noHash.slice(0, qIndex) : noHash;
    const query = qIndex >= 0 ? noHash.slice(qIndex + 1).split('&').filter(Boolean) : [];
    const filtered = query.filter(function (p) { return !/^v=/.test(p); });
    filtered.push('v=' + APP_VERSION);
    return base + '?' + filtered.join('&') + hash;
  }

  function moduleUrl(slug) {
    return addVersion('./encyclopedia/' + slug + '/index.html');
  }

  function toTitleFromSlug(slug) {
    return slug.split('-').map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(' ');
  }

  function hasRenderableData(data) {
    return data &&
      Array.isArray(data.beginner) && data.beginner.length &&
      Array.isArray(data.advanced) && data.advanced.length &&
      Array.isArray(data.professional) && data.professional.length;
  }

  function normalizeModule(module, fallbackSlug) {
    const slug = module && module.slug ? module.slug : fallbackSlug;
    const titleEn = module && module.titleEn ? module.titleEn : toTitleFromSlug(slug);
    const titleRu = module && module.titleRu ? module.titleRu : titleEn;
    return {
      slug: slug,
      titleRu: titleRu,
      titleEn: titleEn,
      categoryRu: module && module.categoryRu ? module.categoryRu : 'Раздел курса',
      categoryEn: module && module.categoryEn ? module.categoryEn : 'Course Section',
      summaryRu: module && module.summaryRu ? module.summaryRu : 'Последовательный модуль для изучения темы с базой, практикой и критическим блоком.',
      summaryEn: module && module.summaryEn ? module.summaryEn : 'Structured module covering foundations, practical use, and critical understanding.',
      articleCount: module && module.articleCount ? module.articleCount : 5
    };
  }

  function buildCourseDataFromMap(map) {
    const sections = map && Array.isArray(map.sections) ? map.sections : [];
    const bySlug = {};
    sections.forEach(function (s) { bySlug[s.slug] = s; });

    const out = {};
    Object.keys(LEVELS).forEach(function (levelKey) {
      out[levelKey] = LEVELS[levelKey].slugs.map(function (slug) {
        return normalizeModule(bySlug[slug], slug);
      });
    });
    return out;
  }

  function buildMinimalFallbackData() {
    const out = {};
    Object.keys(LEVELS).forEach(function (levelKey) {
      out[levelKey] = LEVELS[levelKey].slugs.map(function (slug) {
        return normalizeModule(null, slug);
      });
    });
    return out;
  }

  function loadCourseData() {
    if (hasRenderableData(courseData)) {
      return Promise.resolve(courseData);
    }

    return fetch(addVersion('./data/psychology-map.json'))
      .then(function (res) {
        if (!res.ok) throw new Error('map fetch failed');
        return res.json();
      })
      .then(function (map) {
        courseData = buildCourseDataFromMap(map);
        return courseData;
      })
      .catch(function () {
        courseData = buildMinimalFallbackData();
        return courseData;
      });
  }

  function cleanSummaryRu(text) {
    return (text || '')
      .replace('Энциклопедический раздел по теме «', 'Модуль курса по теме «')
      .replace('» с системными материалами от базовых понятий до практики и критики.', '» с последовательным разбором от базовых понятий до практического и критического уровня.');
  }

  function cleanSummaryEn(text) {
    return (text || '')
      .replace('An encyclopedic section on ', 'A course module on ')
      .replace(' with structured materials from fundamentals to practice and critique.', ' with a structured path from fundamentals to applied and critical understanding.');
  }

  function renderList(items, className) {
    return (items || []).map(function (text) {
      return '<li class="' + className + '">' + text + '</li>';
    }).join('');
  }

  function renderModules(modules, levelPrefix) {
    return (modules || []).map(function (module, index) {
      const number = levelPrefix + '.' + (index + 1);
      const next = modules[index + 1];
      const nextRu = next ? ('Следующий модуль: ' + levelPrefix + '.' + (index + 2) + ' — ' + next.titleRu) : 'Это финальный модуль уровня.';
      const nextEn = next ? ('Next module: ' + levelPrefix + '.' + (index + 2) + ' — ' + next.titleEn) : 'This is the final module of the level.';

      return (
        '<a class="card course-module course-module-link" href="' + moduleUrl(module.slug) + '">' +
          '<p class="course-num">' + number + '</p>' +
          '<h3 data-lang="ru">' + module.titleRu + '</h3>' +
          '<h3 data-lang="en">' + module.titleEn + '</h3>' +
          '<p class="meta" data-lang="ru">' + module.categoryRu + ' · ' + module.articleCount + ' материалов</p>' +
          '<p class="meta" data-lang="en">' + module.categoryEn + ' · ' + module.articleCount + ' materials</p>' +
          '<p data-lang="ru">' + cleanSummaryRu(module.summaryRu) + '</p>' +
          '<p data-lang="en">' + cleanSummaryEn(module.summaryEn) + '</p>' +
          '<p class="course-next meta" data-lang="ru">' + nextRu + '</p>' +
          '<p class="course-next meta" data-lang="en">' + nextEn + '</p>' +
        '</a>'
      );
    }).join('');
  }

  function renderRoute(modules, levelPrefix, lang) {
    return (modules || []).map(function (module, index) {
      const number = levelPrefix + '.' + (index + 1);
      const title = lang === 'en' ? module.titleEn : module.titleRu;
      return (
        '<li class="course-route-item">' +
          '<a href="' + moduleUrl(module.slug) + '">' +
            '<span class="course-num-inline">' + number + '</span> ' + title +
          '</a>' +
        '</li>'
      );
    }).join('');
  }

  function applyStartButton(root, modules, levelPrefix) {
    const startBtn = root.querySelector('[data-course-start]');
    if (!startBtn || !modules.length) return;
    startBtn.setAttribute('href', moduleUrl(modules[0].slug));

    const ru = startBtn.querySelector('[data-lang="ru"]');
    const en = startBtn.querySelector('[data-lang="en"]');
    if (ru) ru.textContent = 'Начать с ' + levelPrefix + '.1';
    if (en) en.textContent = 'Start from ' + levelPrefix + '.1';
  }

  function renderCourseLevel(levelKey, config) {
    const root = document.querySelector('[data-course-level="' + levelKey + '"]');
    if (!root) return;

    const modules = Array.isArray(courseData[levelKey]) ? courseData[levelKey] : [];
    const levelPrefix = LEVELS[levelKey].prefix;

    const total = root.querySelector('[data-course-total]');
    const grid = root.querySelector('[data-course-grid]');
    const ruList = root.querySelector('[data-course-skills-ru]');
    const enList = root.querySelector('[data-course-skills-en]');
    const routeRu = root.querySelector('[data-course-route-ru]');
    const routeEn = root.querySelector('[data-course-route-en]');

    if (total) {
      const lastNumber = modules.length ? (levelPrefix + '.' + modules.length) : '-';
      total.innerHTML =
        '<span data-lang="ru">Модулей: ' + modules.length + ' · Диапазон: ' + levelPrefix + '.1 - ' + lastNumber + '</span>' +
        '<span data-lang="en">Modules: ' + modules.length + ' · Range: ' + levelPrefix + '.1 - ' + lastNumber + '</span>';
    }

    if (grid) grid.innerHTML = renderModules(modules, levelPrefix);
    if (ruList) ruList.innerHTML = renderList(config.skillsRu, 'course-skill');
    if (enList) enList.innerHTML = renderList(config.skillsEn, 'course-skill');
    if (routeRu) routeRu.innerHTML = renderRoute(modules, levelPrefix, 'ru');
    if (routeEn) routeEn.innerHTML = renderRoute(modules, levelPrefix, 'en');
    applyStartButton(root, modules, levelPrefix);
  }

  function initCoursePage() {
    const levels = {
      beginner: {
        skillsRu: [
          'Понимание базовых терминов психологии без перегруза академическим языком.',
          'Разбор мотивации, эмоций, общения и социальных механизмов в повседневной жизни.',
          'Формирование устойчивой базы: поведение, мышление, саморегуляция, адаптация.',
          'Умение замечать когнитивные ошибки в личных решениях и коммуникации.',
          'Переход от популярной психологии к научно обоснованному пониманию.'
        ],
        skillsEn: [
          'Clear understanding of core psychology concepts without heavy academic overload.',
          'Practical analysis of motivation, emotions, communication, and social mechanisms.',
          'Stable foundation in behavior, cognition, self-regulation, and adaptation.',
          'Ability to detect cognitive errors in personal decisions and interactions.',
          'Transition from pop-psychology assumptions to evidence-based thinking.'
        ]
      },
      advanced: {
        skillsRu: [
          'Системная работа с когнитивными процессами: память, мышление, внимание, решения.',
          'Глубокий анализ межкультурных, организационных и прикладных контекстов.',
          'Связка теории с практикой: образование, карьера, лидерство, стресс и конфликты.',
          'Навык критической интерпретации поведенческих данных и моделей влияния.',
          'Подготовка к чтению профессиональных материалов и сложных исследований.'
        ],
        skillsEn: [
          'Systematic work with memory, thinking, attention, and decision processes.',
          'Deeper analysis of cross-cultural, organizational, and applied contexts.',
          'Strong theory-to-practice bridge: education, career, leadership, stress, conflict.',
          'Critical interpretation of behavioral models and influence mechanisms.',
          'Preparation for professional literature and higher-complexity research.'
        ]
      },
      professional: {
        skillsRu: [
          'Освоение клинических, нейронаучных и методологических направлений на экспертном уровне.',
          'Работа со сложной терминологией, дискуссионными теориями и междисциплинарными моделями.',
          'Понимание ограничений исследований: дизайн, валидность, репликация, статистика.',
          'Навык построения академических обзоров и критической научной аргументации.',
          'Готовность к профессиональному диалогу в исследовательской и практической среде.'
        ],
        skillsEn: [
          'Expert-level exposure to clinical, neuroscientific, and methodological branches.',
          'Confident work with advanced terminology, debated theories, and mixed models.',
          'Strong understanding of design limits, validity, replication, and statistics.',
          'Ability to produce academic reviews and evidence-based critical arguments.',
          'Readiness for professional dialogue in research and advanced practice settings.'
        ]
      }
    };

    loadCourseData().then(function () {
      renderCourseLevel('beginner', levels.beginner);
      renderCourseLevel('advanced', levels.advanced);
      renderCourseLevel('professional', levels.professional);
    });
  }

  document.addEventListener('DOMContentLoaded', initCoursePage);
})();
