(function () {
  const HISTORY_KEY = 'soloAiChatHistoryV1';
  const MAX_HISTORY = 10;

  const form = document.querySelector('[data-ai-form]');
  const input = document.querySelector('[data-ai-input]');
  const log = document.querySelector('[data-ai-log]');
  const typing = document.querySelector('[data-ai-typing]');
  const clearBtn = document.querySelector('[data-ai-clear]');
  const newChatBtn = document.querySelector('[data-ai-new]');

  if (!form || !input || !log || !typing) return;

  let history = [];
  let psychSignalWords = null;

  const STOP_WORDS = new Set([
    'что', 'такое', 'кто', 'это', 'как', 'почему', 'какой', 'какая', 'какие', 'какое', 'каков',
    'где', 'когда', 'зачем', 'чем', 'ли', 'бы', 'же', 'и', 'а', 'но', 'или', 'в', 'во', 'на',
    'с', 'со', 'по', 'о', 'об', 'про', 'для', 'у', 'к', 'от', 'из', 'за', 'я', 'ты', 'он', 'она',
    'мы', 'вы', 'они', 'мне', 'тебе', 'ему', 'ей', 'нам', 'вам', 'их', 'мой', 'твой'
  ]);

  const GREETING_ROOTS = [
    'привет', 'здравств', 'добр', 'hello', 'hi', 'hey', 'йо', 'ку', 'салют', 'хай'
  ];

  const GREETING_RESPONSES = [
    'Добрый день, по какому вопросу вы здесь?',
    'Привет! Есть какой-нибудь вопрос о психологии?',
    'Здравствуйте. Могу помочь с темами психологии, эффектов или поведения.',
    'Привет! Спрашивайте, разберем вопрос спокойно и по делу.',
    'Добрый день. О чем хотите поговорить: эмоции, решения, отношения?',
    'Приветствую! Какой психологический вопрос вас интересует?',
    'Рад вас видеть. Начнем с вашего вопроса по психологии?',
    'Здравствуйте! Могу объяснить термины и привести примеры из жизни.',
    'Привет! Давайте разберем ваш вопрос без лишней теории.',
    'Добрый день. Что хотите понять в первую очередь?',
    'Привет! Могу помочь с когнитивными искажениями, тревогой и решениями.',
    'Здравствуйте. Сформулируйте вопрос, и разберем его по шагам.',
    'Привет! Есть тема, которая сейчас волнует больше всего?',
    'Добрый день, слушаю вас. Что именно хотите уточнить?',
    'Приветствую! Готов помочь по психологии и темной психологии.',
    'Здравствуйте. Какой вопрос хотите разобрать первым?',
    'Привет! Могу дать понятный разбор и практический пример.',
    'Добрый день. Идем в теорию или сразу в практику?',
    'Привет! В чем нужна помощь: эмоции, характер, мышление?',
    'Здравствуйте! Готов к вашему вопросу.',
    'Привет! Что хотите понять о себе или о поведении людей?',
    'Добрый день. Можем разобрать ваш запрос кратко или глубоко.',
    'Приветствую! С какого вопроса начнем?',
    'Здравствуйте. Пишите вопрос — отвечу простым языком.',
    'Привет! Готов помочь, задавайте тему.',
    'Добрый день. Какой аспект психологии интересует вас сегодня?',
    'Привет! Могу объяснить эффект, термин или поведение на примере.',
    'Здравствуйте! Есть вопрос по темпераменту, тревоге или отношениям?',
    'Привет! Что именно хотите прояснить?',
    'Добрый день. Давайте разберем ваш запрос без воды.',
    'Приветствую! Ваша тема — искажения, эмоции или коммуникация?',
    'Здравствуйте. Задайте вопрос, и начнем разбор.',
    'Привет! Чем могу быть полезен по психологии?',
    'Добрый день. Хотите теорию, примеры или практические шаги?',
    'Привет! Пишите, разберемся вместе.',
    'Здравствуйте. Могу дать структурный ответ с понятными примерами.',
    'Приветствую! О каком явлении хотите узнать подробнее?',
    'Добрый день, я на связи. Какой ваш вопрос?',
    'Привет! Готов помочь с объяснением и практикой.',
    'Здравствуйте! Начнем с вашего конкретного запроса.',
    'Привет! Есть вопрос о психологии, который хотите прояснить?',
    'Добрый день. Что сейчас самое важное для вас в этой теме?',
    'Приветствую! Давайте уточним вопрос и разберем его детально.',
    'Здравствуйте. Могу помочь разобраться без сложных терминов.',
    'Привет! Если хотите, дам ответ с примерами из жизни.',
    'Добрый день. Сформулируйте вопрос, и пойдем по сути.',
    'Привет! Можем обсудить и эффекты, и темперамент, и поведение.',
    'Здравствуйте! Какой вопрос хотите разобрать в первую очередь?',
    'Привет! Я здесь, чтобы помочь — задавайте.',
    'Добрый день. О чем хотите поговорить прямо сейчас?'
  ];

  function normalizeText(text) {
    return (text || '')
      .toLowerCase()
      .replace(/ё/g, 'е')
      .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function tokenize(text) {
    return normalizeText(text).split(' ').filter(function (w) { return w.length > 1; });
  }

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function buildPsychSignalWords() {
    if (psychSignalWords) return psychSignalWords;
    const set = new Set([
      'психология', 'психологический', 'эффект', 'искажение', 'темперамент', 'флегматик',
      'сангвиник', 'холерик', 'меланхолик', 'тревога', 'депрессия', 'паника', 'прокрастинация',
      'самооценка', 'конформизм', 'манипуляция', 'газлайтинг', 'эмпатия', 'отношения'
    ]);
    const db = Array.isArray(window.psychologyDatabase) ? window.psychologyDatabase : [];
    db.forEach(function (entry) {
      (entry.keywords || []).forEach(function (kw) {
        tokenize(kw).forEach(function (part) {
          if (part.length >= 4) set.add(part);
        });
      });
    });
    psychSignalWords = set;
    return set;
  }

  function commonPrefixLength(a, b) {
    const len = Math.min(a.length, b.length);
    let i = 0;
    while (i < len && a.charAt(i) === b.charAt(i)) i += 1;
    return i;
  }

  function wordsSimilar(a, b) {
    if (!a || !b) return false;
    if (a === b) return true;
    if (a.length >= 4 && b.length >= 4 && (a.includes(b) || b.includes(a))) return true;
    return commonPrefixLength(a, b) >= 5;
  }

  function saveHistory() {
    const trimmed = history.slice(-MAX_HISTORY);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  }

  function loadHistory() {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(function (m) {
        return m && (m.role === 'ai' || m.role === 'user') && typeof m.text === 'string';
      });
    } catch (e) {
      return [];
    }
  }

  function scrollToBottom() {
    log.scrollTop = log.scrollHeight;
  }

  function renderMessage(role, text) {
    const wrap = document.createElement('div');
    wrap.className = 'chat-msg ' + role;
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.textContent = text;
    wrap.appendChild(bubble);
    log.appendChild(wrap);
    scrollToBottom();
    return bubble;
  }

  function pushHistory(role, text) {
    history.push({ role: role, text: text, at: Date.now() });
    history = history.slice(-MAX_HISTORY);
    saveHistory();
  }

  function addMessage(role, text) {
    pushHistory(role, text);
    renderMessage(role, text);
  }

  function resetChatWithGreeting() {
    history = [];
    log.innerHTML = '';
    const greeting = 'Привет. Я ИИ-помощник по психологии SOLO UNDERGROUND. Задайте вопрос по темам платформы.';
    addMessage('ai', greeting);
  }

  function getEntryScore(entry, normalizedQuestion, tokens) {
    let score = 0;
    const keywords = (entry.keywords || []).map(normalizeText);

    keywords.forEach(function (kw) {
      if (!kw) return;
      if (normalizedQuestion.includes(kw)) {
        score += kw.includes(' ') ? 6 : 3;
      }
      const kwParts = tokenize(kw);
      tokens.forEach(function (token) {
        if (token.length < 3 || STOP_WORDS.has(token)) return;
        if (kw.includes(token)) {
          score += 1;
          return;
        }
        kwParts.forEach(function (part) {
          if (STOP_WORDS.has(part)) return;
          if (wordsSimilar(token, part)) score += 1;
        });
      });
    });

    return score;
  }

  function isGreetingLike(tokens) {
    return tokens.some(function (token) {
      return GREETING_ROOTS.some(function (root) {
        return token.startsWith(root) || token.includes(root);
      });
    });
  }

  function hasPsychContext(tokens) {
    const signals = buildPsychSignalWords();
    return tokens.some(function (token) {
      if (signals.has(token)) return true;
      return Array.from(signals).some(function (s) {
        return wordsSimilar(token, s);
      });
    });
  }

  function shouldRespondWithGreeting(question) {
    const normalized = normalizeText(question);
    const tokens = tokenize(question);
    if (!tokens.length) return false;

    const greetingLike = isGreetingLike(tokens);
    const psychContext = hasPsychContext(tokens);
    const hasQuestionMark = question.indexOf('?') !== -1;

    if (greetingLike && !psychContext) return true;
    if (!psychContext && tokens.length <= 2) return true;
    if (!psychContext && tokens.length <= 3 && !hasQuestionMark && normalized.length <= 18) return true;
    return false;
  }

  function chooseResponse(entry) {
    const variants = Array.isArray(entry.responses)
      ? entry.responses
      : (entry.response ? [entry.response] : []);
    if (!variants.length) return window.psychologyFallbackResponse;
    const idx = Math.floor(Math.random() * variants.length);
    return variants[idx];
  }

  function findResponse(question) {
    if (shouldRespondWithGreeting(question)) {
      return pickRandom(GREETING_RESPONSES);
    }

    const normalizedQuestion = normalizeText(question);
    const tokens = tokenize(question);
    const db = Array.isArray(window.psychologyDatabase) ? window.psychologyDatabase : [];

    let maxScore = 0;
    let best = [];

    db.forEach(function (entry) {
      const score = getEntryScore(entry, normalizedQuestion, tokens);
      if (score > maxScore) {
        maxScore = score;
        best = [entry];
      } else if (score > 0 && score === maxScore) {
        best.push(entry);
      }
    });

    if (!best.length || maxScore < 2) {
      return window.psychologyFallbackResponse;
    }

    const selected = best[Math.floor(Math.random() * best.length)];
    return chooseResponse(selected);
  }

  function setTyping(active) {
    typing.classList.toggle('active', active);
    if (active) scrollToBottom();
  }

  function askAssistant(question) {
    addMessage('user', question);
    setTyping(true);

    const delay = 450 + Math.floor(Math.random() * 550);
    window.setTimeout(function () {
      const answer = findResponse(question);
      const bubble = renderMessage('ai', '');
      setTyping(false);

      let i = 0;
      const minStep = 9;
      const maxStep = 24;
      function typeNext() {
        if (i >= answer.length) {
          pushHistory('ai', answer);
          return;
        }
        bubble.textContent += answer.charAt(i);
        i += 1;
        scrollToBottom();
        const speed = minStep + Math.floor(Math.random() * (maxStep - minStep));
        window.setTimeout(typeNext, speed);
      }
      typeNext();
    }, delay);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    askAssistant(text);
  });

  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      form.requestSubmit();
    }
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      localStorage.removeItem(HISTORY_KEY);
      resetChatWithGreeting();
    });
  }

  if (newChatBtn) {
    newChatBtn.addEventListener('click', function () {
      const ok = window.confirm('Текущий диалог будет стерт. Создать новый чат?');
      if (!ok) return;
      localStorage.removeItem(HISTORY_KEY);
      resetChatWithGreeting();
    });
  }

  history = loadHistory();
  if (!history.length) {
    resetChatWithGreeting();
  } else {
    history.forEach(function (msg) {
      renderMessage(msg.role, msg.text);
    });
    saveHistory();
  }
})();
