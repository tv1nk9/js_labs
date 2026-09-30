(() => {
  'use strict';

  // DOM
  const display = document.getElementById('display');
  const memoryIndicator = document.getElementById('memory-indicator');
  const buttonsContainer = document.querySelector('.buttons');

  // Состояние
  const MEMORY_KEY = 'calculator.memory';

  const state = {
    current: '0',
    accumulator: null, // первый операнд операции
    operator: null, // отложенная операция: '+', '-', '*', '/'
    waitingForOperand: false, // true - следующая цифра начнёт новое число
    error: false, // ошибка (деление на ноль)
    memory: loadMemory(), // значение памяти
  };

  // Вспомогательные функции

  function toNumber(str) {
    return Number(str.replace(',', '.'));
  }

  function formatNumber(value) {
    if (!Number.isFinite(value)) return null;
    const rounded = Number(value.toPrecision(12));
    let text = String(rounded);
    if (text.length > 14) {
      text = rounded.toExponential(8).replace(/\.?0+e/, 'e');
    }
    return text.replace('.', ',');
  }

  function updateDisplay() {
    display.textContent = state.current;
    display.classList.toggle('size-m', state.current.length > 7 && state.current.length <= 11);
    display.classList.toggle('size-s', state.current.length > 11);
  }

  function updateMemoryIndicator() {
    memoryIndicator.classList.toggle('hidden', state.memory === null);
  }

  function setError() {
    state.error = true;
    state.current = 'Ошибка';
    state.accumulator = null;
    state.operator = null;
    state.waitingForOperand = true;
    updateDisplay();
  }

  // localStorage функции

  function loadMemory() {
    try {
      const raw = localStorage.getItem(MEMORY_KEY);
      if (raw === null) return null;
      const value = Number(raw);
      return Number.isFinite(value) ? value : null;
    } catch (e) {
      return null;
    }
  }

  function saveMemory() {
    try {
      if (state.memory === null) localStorage.removeItem(MEMORY_KEY);
      else localStorage.setItem(MEMORY_KEY, String(state.memory));
    } catch (e) { /* напр. приватный режим — работаем без сохранения */ }
    updateMemoryIndicator();
  }

  function memorySave() { // MS - сохранить (перезаписать) значение
    if (state.error) return;
    state.memory = toNumber(state.current);
    saveMemory();
  }

  function memoryClear() { // MC - очистить память
    state.memory = null;
    saveMemory();
  }

  function memoryRead() { // MR - подставить число из памяти в поле ввода
    if (state.error) return;
    state.current = state.memory === null ? '0' : formatNumber(state.memory);
    state.waitingForOperand = true;
    updateDisplay();
  }

  function memoryAdd() { // M+ - прибавить текущее число к памяти
    if (state.error) return;
    state.memory = (state.memory ?? 0) + toNumber(state.current);
    saveMemory();
  }

  function memorySubtract() {  // M- - вычесть текущее число из памяти
    if (state.error) return;
    state.memory = (state.memory ?? 0) - toNumber(state.current);
    saveMemory();
  }

  // Ввод чисел

  function inputDigit(digit) {
    if (state.error) return;
    if (state.waitingForOperand) {
      state.current = digit;
      state.waitingForOperand = false;
    } else if (state.current.replace(/[-,]/g, '').length < 12) { // лимит 12 цифр
      state.current = state.current === '0' ? digit : state.current + digit;
    }
    updateDisplay();
  }

  function inputComma() {
    if (state.error) return;
    if (state.waitingForOperand) {
      state.current = '0,';
      state.waitingForOperand = false;
    } else if (!state.current.includes(',')) { // только одна запятая
      state.current += ',';
    }
    updateDisplay();
  }

  function backspace() { // удаление последнего символа
    if (state.error || state.waitingForOperand) return;
    let text = state.current.slice(0, -1);
    if (text === '' || text === '-') text = '0';
    state.current = text;
    updateDisplay();
  }

  function clearAll() { // AC (память не трогает)
    state.current = '0';
    state.accumulator = null;
    state.operator = null;
    state.waitingForOperand = false;
    state.error = false;
    updateDisplay();
  }

  // Операции

  // null - деление на ноль
  function compute(a, operator, b) {
    switch (operator) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b === 0 ? null : a / b;
      default:  return null;
    }
  }

  // при сложении/вычитании берёт процент от первого операнда (200 + 10 % = 20)
  function applyPercent() {
    if (state.error) return;
    const value = toNumber(state.current);
    const result = (state.operator === '+' || state.operator === '-')
      ? state.accumulator * value / 100
      : value / 100;
    const text = formatNumber(result);
    if (text === null) { setError(); return; }
    state.current = text;
    state.waitingForOperand = false;
    updateDisplay();
  }

  function setOperator(operator) {
    if (state.error) return;
    const value = toNumber(state.current);
    if (state.operator !== null && !state.waitingForOperand) {
      // цепочка операций: 2 + 3 * ... сначала считаем предыдущую операцию
      const result = compute(state.accumulator, state.operator, value);
      if (result === null) { setError(); return; }
      state.accumulator = result;
      state.current = formatNumber(result);
    } else if (state.accumulator === null) {
      state.accumulator = value;
    }
    state.operator = operator;
    state.waitingForOperand = true;
    updateDisplay();
  }

  function equals() {
    if (state.error || state.operator === null) return;
    // если после оператора ничего не ввели (5 + =), вторым операндом будет первый
    const value = state.waitingForOperand ? state.accumulator : toNumber(state.current);
    const result = compute(state.accumulator, state.operator, value);
    if (result === null) { setError(); return; }
    state.current = formatNumber(result);
    state.accumulator = null;
    state.operator = null;
    state.waitingForOperand = true;
    updateDisplay();
  }

  // События

  // один обработчик на все кнопки
  buttonsContainer.addEventListener('click', (event) => {
    const button = event.target.closest('button');
    if (!button) return;
    const { action, op, digit } = button.dataset;
    switch (action) {
      case 'digit': inputDigit(digit); break;
      case 'comma': inputComma(); break;
      case 'clear': clearAll(); break;
      case 'operator': setOperator(op); break;
      case 'equals': equals(); break;
      case 'percent': applyPercent(); break;
      case 'm-save': memorySave(); break;
      case 'm-clear': memoryClear(); break;
      case 'm-read': memoryRead(); break;
      case 'm-plus': memoryAdd(); break;
      case 'm-minus': memorySubtract(); break;
    }
  });

  // Инициализация
  updateDisplay();
  updateMemoryIndicator();
})();