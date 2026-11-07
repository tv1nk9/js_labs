(() => {
  'use strict';

  // Набор русскоязычных текстов для генерации тестов.
  const textPool = [
    'Задача организации, в особенности же рамки и место обучения кадров в значительной степени обуславливает создание направлений прогрессивного развития. Таким образом постоянное информационное обеспечение нашей деятельности играет важную роль в формировании новых предложений. С другой стороны постоянный количественный рост и сфера нашей активности требуют определения и уточнения новых задач.',
    'Утром город постепенно просыпался. На улицах появлялись первые прохожие, открывались небольшие кофейни, а солнечный свет отражался в окнах домов. Казалось, что впереди целый день, наполненный интересными встречами и неожиданными событиями.',
    'Хорошая привычка формируется не за один день. Небольшие регулярные действия помогают двигаться вперёд, даже когда результат пока не заметен. Главное — выбрать понятную цель, разделить её на шаги и сохранять последовательность.',
    'Программирование учит разбивать сложные задачи на простые части. Сначала важно понять условие, затем определить необходимые данные и продумать последовательность действий. После этого решение можно реализовать, проверить и постепенно улучшить.',
    'Чтение помогает лучше понимать окружающий мир и находить новые идеи. Иногда одна удачная мысль меняет привычный взгляд на проблему, а знакомая история открывается совершенно с другой стороны. Поэтому стоит оставлять время для книг каждый день.',
    'Команда достигает хороших результатов, когда участники понимают общую цель и умеют договариваться. Важно не только распределить обязанности, но и поддерживать открытое общение, делиться знаниями и вовремя обсуждать трудности.',
    'Внимание к деталям часто определяет качество всей работы. Аккуратная проверка, понятные названия и последовательная структура экономят время в будущем. Даже небольшие улучшения способны заметно упростить повседневные процессы.',
    'Путешествие начинается задолго до отправления. Можно изучить маршрут, выбрать интересные места и узнать немного об истории региона. Но иногда самые яркие впечатления появляются благодаря случайной прогулке без точного плана.',
    'Цифровые инструменты помогают быстрее обмениваться информацией и совместно решать задачи. Однако технологии приносят пользу только тогда, когда они отвечают реальным потребностям людей и не усложняют привычные процессы.',
    'Вечером шум постепенно стихает, и город выглядит совсем иначе. В витринах загорается свет, транспорт движется спокойнее, а прохладный воздух напоминает о приближении ночи. Самое время закончить дела и немного отдохнуть.'
  ];

  const state = {
    mode: 'time',
    duration: 30,
    wordCount: 25,
    text: '',
    typed: '',
    status: 'idle', // idle | ready | running | finished
    startedAt: null,
    endedAt: null,
    timerId: null,
    finishTimeoutId: null,
    lastInputAt: null,
    lastSourceIndex: -1
  };

  const $ = (id) => document.getElementById(id);
  const timeModeBtn = $('time-mode');
  const wordsModeBtn = $('words-mode');
  const timeOptions = $('time-options');
  const wordsOptions = $('words-options');
  const typingZone = $('typing-zone');
  const typingText = $('typing-text');
  const captureInput = $('capture-input');
  const placeholder = $('typing-placeholder');
  const metaMode = $('meta-mode');
  const metaValue = $('meta-value');
  const metaStatus = $('meta-status');
  const startBtn = $('start-test');
  const restartBtn = $('restart-test');
  const testActions = $('test-actions');
  const resultView = $('result-view');
  const helper = $('helper');

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[char]);
  }

  function randomTextIndex() {
    if (textPool.length < 2) return 0;
    let index = Math.floor(Math.random() * textPool.length);
    while (index === state.lastSourceIndex) index = Math.floor(Math.random() * textPool.length);
    state.lastSourceIndex = index;
    return index;
  }

  function buildText(wordLimit) {
    const first = textPool[randomTextIndex()];
    let words = first.trim().split(/\s+/);
    let attempts = 0;
    while (words.length < wordLimit && attempts < 20) {
      const extra = textPool[randomTextIndex()].trim().split(/\s+/);
      words = words.concat(extra);
      attempts += 1;
    }
    return words.slice(0, wordLimit).join(' ');
  }

  function wordsForDuration(seconds) {
    return Math.max(100, Math.ceil(seconds * 4.5));
  }

  function makeNewText() {
    const amount = state.mode === 'words' ? state.wordCount : wordsForDuration(state.duration);
    state.text = buildText(amount);
    state.typed = '';
    captureInput.value = '';
    renderTypingText();
    updateMeta();
  }

  function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return '0';
    return `${Math.max(0, Math.ceil(seconds))}с`;
  }

  function updateMeta() {
    metaMode.textContent = state.mode === 'time' ? 'Время' : 'Слова';
    metaValue.textContent = state.mode === 'time' ? `${state.duration} с` : `${state.wordCount} слов`;

    if (state.status === 'running' && state.mode === 'time') {
      const elapsed = (performance.now() - state.startedAt) / 1000;
      metaStatus.textContent = `осталось ${formatTime(state.duration - elapsed)}`;
    } else if (state.status === 'running') {
      const completed = Math.min(state.wordCount, state.typed.trim().split(/\s+/).filter(Boolean).length);
      metaStatus.textContent = `${completed} / ${state.wordCount}`;
    } else if (state.status === 'ready') {
      metaStatus.textContent = 'готово';
    } else if (state.status === 'finished') {
      metaStatus.textContent = 'завершён';
    } else {
      metaStatus.textContent = 'ожидание';
    }
  }

  function cursorMarkup() { return '<span class="caret" aria-hidden="true"></span>'; }

  function charMarkup(targetChar, typedChar, index, isExtra = false, isCursor = false) {
    const cursorClass = isCursor ? ' cursor' : '';
    if (isExtra) {
      const shown = typedChar === ' ' ? '␣' : typedChar;
      return `<span class="char extra${typedChar === ' ' ? ' extra-space' : ''}${cursorClass}">${escapeHtml(shown)}</span>`;
    }
    if (typedChar === undefined) {
      return `<span class="char${cursorClass}">${targetChar === ' ' ? '&nbsp;' : escapeHtml(targetChar)}</span>`;
    }
    if (typedChar === targetChar) {
      return `<span class="char correct${cursorClass}">${targetChar === ' ' ? '&nbsp;' : escapeHtml(targetChar)}</span>`;
    }
    // Если символ неверный, отображаем ЦЕЛЕВОЙ символ красным
    return `<span class="char incorrect${cursorClass}">${targetChar === ' ' ? '␣' : escapeHtml(targetChar)}</span>`;
  }

  function renderTypingText() {
    const typed = state.typed;
    const targetWords = state.text.split(' ');
    const typedWords = typed.split(' ');
    const maxWords = Math.max(targetWords.length, typedWords.length);

    let html = '';

    for (let w = 0; w < maxWords; w++) {
      const targetWord = targetWords[w];
      const typedWord = typedWords[w];
      const isLastWord = w === typedWords.length - 1;

      if (targetWord === undefined) {
        // Если пользователь ввел больше слов, чем есть в тексте
        let wordHtml = '';
        for (let c = 0; c < typedWord.length; c++) {
          const typedChar = typedWord[c];
          wordHtml += charMarkup('', typedChar, 0, true, false);
        }
        if (isLastWord) {
          wordHtml += cursorMarkup();
        }
        html += `<span class="word word-error">${wordHtml}</span>`;
      } else {
        // Обычное слово
        let wordHtml = '';
        let hasError = false;

        if (typedWord === undefined) {
          // Слово еще не начато
          for (const char of targetWord) {
            wordHtml += charMarkup(char, undefined, 0, false, false);
          }
        } else {
          // Посимвольное сравнение внутри слова
          for (let c = 0; c < targetWord.length; c++) {
            const targetChar = targetWord[c];
            const typedChar = typedWord[c];
            const isCursor = isLastWord && c === typedWord.length;

            if (typedChar === undefined) {
              wordHtml += charMarkup(targetChar, undefined, 0, false, isCursor);
            } else if (typedChar === targetChar) {
              wordHtml += charMarkup(targetChar, typedChar, 0, false, isCursor);
            } else {
              hasError = true;
              wordHtml += charMarkup(targetChar, typedChar, 0, false, isCursor);
            }
          }

          // Если введено больше символов, чем в слове, они накапливаются в конце и отодвигают следующее слово
          if (typedWord.length > targetWord.length) {
            hasError = true;
            for (let c = targetWord.length; c < typedWord.length; c++) {
              const typedChar = typedWord[c];
              wordHtml += charMarkup('', typedChar, 0, true, false);
            }
          }

          // Курсор в конце слова (если оно полностью набрано)
          if (isLastWord && typedWord.length >= targetWord.length) {
            wordHtml += cursorMarkup();
          }

          // Если нажат пробел раньше времени (слово не допечатано, но уже есть следующее)
          if (typedWord.length < targetWord.length && w < typedWords.length - 1) {
            hasError = true;
          }
        }

        html += `<span class="word${hasError ? ' word-error' : ''}">${wordHtml}</span>`;
      }

      // Пробел между словами
      if (w < maxWords - 1) {
        html += ' ';
      }
    }

    typingText.innerHTML = html;
    placeholder.classList.toggle('hidden', state.status === 'running' || state.status === 'ready' || typed.length > 0);

    const caret = typingText.querySelector('.char.cursor, .caret');
    if (caret && state.status !== 'idle' && state.status !== 'finished') {
      requestAnimationFrame(() => {
        caret.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      });
    }
  }

  function setMode(mode) {
    if (state.mode === mode) return;
    state.mode = mode;
    timeModeBtn.classList.toggle('active', mode === 'time');
    wordsModeBtn.classList.toggle('active', mode === 'words');
    timeModeBtn.setAttribute('aria-pressed', String(mode === 'time'));
    wordsModeBtn.setAttribute('aria-pressed', String(mode === 'words'));
    timeOptions.classList.toggle('hidden', mode !== 'time');
    wordsOptions.classList.toggle('hidden', mode !== 'words');
    resetTest(false);
    updateOptionButtons();
  }

  function updateOptionButtons() {
    timeOptions.querySelectorAll('[data-value]').forEach((button) => {
      const active = Number(button.dataset.value) === state.duration;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    wordsOptions.querySelectorAll('[data-value]').forEach((button) => {
      const active = Number(button.dataset.value) === state.wordCount;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  function setAmount(value) {
    if (state.mode === 'time') state.duration = value;
    else state.wordCount = value;
    resetTest(false);
    updateOptionButtons();
  }

  function focusInput() {
    captureInput.focus({ preventScroll: true });
  }

  function armTest() {
    if (state.status === 'finished') return;
    state.status = 'ready';
    startBtn.classList.add('hidden');
    restartBtn.classList.remove('hidden');
    placeholder.classList.add('hidden');
    typingZone.classList.add('is-active');
    updateMeta();
    focusInput();
  }

  function beginTimer() {
    if (state.status === 'running' || state.status === 'finished') return;
    state.status = 'running';
    state.startedAt = performance.now();
    updateMeta();
    state.timerId = window.setInterval(() => {
      updateMeta();
      if (state.mode === 'time') {
        const elapsed = (performance.now() - state.startedAt) / 1000;
        if (elapsed >= state.duration) finishTest();
      }
    }, 100);
  }

  function calculateStats() {
    let correct = 0;
    const limit = Math.min(state.typed.length, state.text.length);
    for (let i = 0; i < limit; i += 1) {
      if (state.typed[i] === state.text[i]) correct += 1;
    }
    const total = state.typed.length;
    const errors = total - correct;
    const elapsed = state.startedAt === null
      ? 0
      : Math.max(0.001, ((state.endedAt ?? performance.now()) - state.startedAt) / 1000);
    const wpm = elapsed > 0 ? Math.round((correct / 5) / (elapsed / 60)) : 0;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    return { correct, total, errors, elapsed, wpm, accuracy };
  }

  function finishTest() {
    if (state.status === 'finished') return;
    if (state.timerId !== null) {
      clearInterval(state.timerId);
      state.timerId = null;
    }
    if (state.finishTimeoutId !== null) {
      clearTimeout(state.finishTimeoutId);
      state.finishTimeoutId = null;
    }
    state.status = 'finished';
    state.endedAt = state.mode === 'words' && state.lastInputAt !== null
      ? state.lastInputAt
      : performance.now();
    const stats = calculateStats();
    $('result-wpm').textContent = String(stats.wpm);
    $('result-accuracy').textContent = `${stats.accuracy}%`;
    $('result-chars').textContent = String(stats.total);
    $('result-errors').textContent = String(stats.errors);
    $('result-time').textContent = formatTime(stats.elapsed);
    $('result-note').textContent = stats.errors === 0
      ? 'Отличная работа — ошибок не было.'
      : `Правильно введено ${stats.correct} из ${stats.total} символов.`;

    typingZone.classList.add('hidden');
    $('test-meta').classList.add('hidden');
    testActions.classList.add('hidden');
    resultView.classList.remove('hidden');
    helper.classList.add('hidden');
    captureInput.blur();
  }

  function resetTest(keepText = false) {
    if (state.timerId !== null) {
      clearInterval(state.timerId);
      state.timerId = null;
    }
    if (state.finishTimeoutId !== null) {
      clearTimeout(state.finishTimeoutId);
      state.finishTimeoutId = null;
    }
    state.status = 'idle';
    state.startedAt = null;
    state.endedAt = null;
    state.lastInputAt = null;
    state.typed = '';
    captureInput.value = '';
    if (!keepText || !state.text) makeNewText();
    else {
      renderTypingText();
      updateMeta();
    }

    resultView.classList.add('hidden');
    typingZone.classList.remove('hidden');
    typingZone.classList.remove('is-active');
    $('test-meta').classList.remove('hidden');
    testActions.classList.remove('hidden');
    helper.classList.remove('hidden');
    startBtn.classList.remove('hidden');
    restartBtn.classList.add('hidden');
    placeholder.classList.remove('hidden');
    updateMeta();
  }

  function nextTest() {
    resetTest(false);
  }

  function onInput() {
    if (state.status === 'finished') return;
    const value = captureInput.value.replace(/[\r\n]/g, ' ');
    if (value !== captureInput.value) captureInput.value = value;
    state.typed = value;
    if (value.length > 0) state.lastInputAt = performance.now();
    if (state.status === 'idle') armTest();
    if (state.status === 'ready' && state.typed.length > 0) beginTimer();
    renderTypingText();
    updateMeta();

    if (state.mode === 'words' && state.typed.length >= state.text.length) {
      if (state.finishTimeoutId !== null) clearTimeout(state.finishTimeoutId);
      state.finishTimeoutId = window.setTimeout(finishTest, 650);
    } else if (state.finishTimeoutId !== null) {
      clearTimeout(state.finishTimeoutId);
      state.finishTimeoutId = null;
    }
  }

  timeModeBtn.addEventListener('click', () => setMode('time'));
  wordsModeBtn.addEventListener('click', () => setMode('words'));
  timeOptions.addEventListener('click', (event) => {
    const button = event.target.closest('[data-value]');
    if (button) setAmount(Number(button.dataset.value));
  });
  wordsOptions.addEventListener('click', (event) => {
    const button = event.target.closest('[data-value]');
    if (button) setAmount(Number(button.dataset.value));
  });

  startBtn.addEventListener('click', armTest);
  restartBtn.addEventListener('click', () => resetTest(true));
  $('restart-result').addEventListener('click', () => resetTest(true));
  $('next-test').addEventListener('click', nextTest);
  typingZone.addEventListener('click', focusInput);
  captureInput.addEventListener('input', onInput);
  captureInput.addEventListener('paste', (event) => event.preventDefault());

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      resetTest(true);
      return;
    }
  });

  makeNewText();
  updateOptionButtons();
})();