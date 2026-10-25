// Данные из currencyData.txt
const currencyList = [
  { CharCode: 'RUB', ID: 'R01014F', Name: 'Российский рубль', Nominal: 1, NumCode: '643', Value: 1 },
  { ID: "R01010", NumCode: "036", CharCode: "AUD", Nominal: 1, Name: "Австралийский доллар", Value: 63.4192 },
  { ID: "R01020A", NumCode: "944", CharCode: "AZN", Nominal: 1, Name: "Азербайджанский манат", Value: 54.3573 },
  { ID: "R01035", NumCode: "826", CharCode: "GBP", Nominal: 1, Name: "Фунт стерлингов Соединенного королевства", Value: 123.5949 },
  { ID: "R01060", NumCode: "051", CharCode: "AMD", Nominal: 100, Name: "Армянских драмов", Value: 23.8501 },
  { ID: "R01090B", NumCode: "933", CharCode: "BYN", Nominal: 1, Name: "Белорусский рубль", Value: 28.7865 },
  { ID: "R01100", NumCode: "975", CharCode: "BGN", Nominal: 1, Name: "Болгарский лев", Value: 52.8885 },
  { ID: "R01115", NumCode: "986", CharCode: "BRL", Nominal: 1, Name: "Бразильский реал", Value: 16.8833 },
  { ID: "R01135", NumCode: "348", CharCode: "HUF", Nominal: 100, Name: "Венгерских форинтов", Value: 26.0017 },
  { ID: "R01150", NumCode: "704", CharCode: "VND", Nominal: 10000, Name: "Вьетнамских донгов", Value: 38.3354 },
  { ID: "R01200", NumCode: "344", CharCode: "HKD", Nominal: 1, Name: "Гонконгский доллар", Value: 11.9005 },
  { ID: "R01210", NumCode: "981", CharCode: "GEL", Nominal: 1, Name: "Грузинский лари", Value: 33.8873 },
  { ID: "R01215", NumCode: "208", CharCode: "DKK", Nominal: 1, Name: "Датская крона", Value: 13.8706 },
  { ID: "R01230", NumCode: "784", CharCode: "AED", Nominal: 1, Name: "Дирхам ОАЭ", Value: 25.162 },
  { ID: "R01235", NumCode: "840", CharCode: "USD", Nominal: 1, Name: "Доллар США", Value: 92.4074 },
  { ID: "R01239", NumCode: "978", CharCode: "EUR", Nominal: 1, Name: "Евро", Value: 103.1931 },
  { ID: "R01240", NumCode: "818", CharCode: "EGP", Nominal: 10, Name: "Египетских фунтов", Value: 19.1099 },
  { ID: "R01270", NumCode: "356", CharCode: "INR", Nominal: 10, Name: "Индийских рупий", Value: 11.0402 },
  { ID: "R01280", NumCode: "360", CharCode: "IDR", Nominal: 10000, Name: "Индонезийских рупий", Value: 61.2294 },
  { ID: "R01335", NumCode: "398", CharCode: "KZT", Nominal: 100, Name: "Казахстанских тенге", Value: 19.3256 },
  { ID: "R01350", NumCode: "124", CharCode: "CAD", Nominal: 1, Name: "Канадский доллар", Value: 68.6431 },
  { ID: "R01355", NumCode: "634", CharCode: "QAR", Nominal: 1, Name: "Катарский риал", Value: 25.3866 },
  { ID: "R01370", NumCode: "417", CharCode: "KGS", Nominal: 10, Name: "Киргизских сомов", Value: 10.9748 },
  { ID: "R01375", NumCode: "156", CharCode: "CNY", Nominal: 1, Name: "Китайский юань", Value: 13.1451 },
  { ID: "R01500", NumCode: "498", CharCode: "MDL", Nominal: 10, Name: "Молдавских леев", Value: 52.9513 },
  { ID: "R01530", NumCode: "554", CharCode: "NZD", Nominal: 1, Name: "Новозеландский доллар", Value: 57.8979 },
  { ID: "R01535", NumCode: "578", CharCode: "NOK", Nominal: 10, Name: "Норвежских крон", Value: 88.5323 },
  { ID: "R01565", NumCode: "985", CharCode: "PLN", Nominal: 1, Name: "Польский злотый", Value: 24.131 },
  { ID: "R01585F", NumCode: "946", CharCode: "RON", Nominal: 1, Name: "Румынский лей", Value: 20.7057 },
  { ID: "R01589", NumCode: "960", CharCode: "XDR", Nominal: 1, Name: "СДР (специальные права заимствования)", Value: 125.1298 },
  { ID: "R01625", NumCode: "702", CharCode: "SGD", Nominal: 1, Name: "Сингапурский доллар", Value: 71.7783 },
  { ID: "R01670", NumCode: "972", CharCode: "TJS", Nominal: 10, Name: "Таджикских сомони", Value: 86.8001 },
  { ID: "R01675", NumCode: "764", CharCode: "THB", Nominal: 10, Name: "Таиландских батов", Value: 28.2738 },
  { ID: "R01700J", NumCode: "949", CharCode: "TRY", Nominal: 10, Name: "Турецких лир", Value: 27.083 },
  { ID: "R01710A", NumCode: "934", CharCode: "TMT", Nominal: 1, Name: "Новый туркменский манат", Value: 26.4021 },
  { ID: "R01717", NumCode: "860", CharCode: "UZS", Nominal: 10000, Name: "Узбекских сумов", Value: 72.4329 },
  { ID: "R01720", NumCode: "980", CharCode: "UAH", Nominal: 10, Name: "Украинских гривен", Value: 22.3938 },
  { ID: "R01760", NumCode: "203", CharCode: "CZK", Nominal: 10, Name: "Чешских крон", Value: 40.9789 },
  { ID: "R01770", NumCode: "752", CharCode: "SEK", Nominal: 10, Name: "Шведских крон", Value: 91.4515 },
  { ID: "R01775", NumCode: "756", CharCode: "CHF", Nominal: 1, Name: "Швейцарский франк", Value: 108.7402 },
  { ID: "R01805F", NumCode: "941", CharCode: "RSD", Nominal: 100, Name: "Сербских динаров", Value: 87.9615 },
  { ID: "R01810", NumCode: "710", CharCode: "ZAR", Nominal: 10, Name: "Южноафриканских рэндов", Value: 53.769 },
  { ID: "R01815", NumCode: "410", CharCode: "KRW", Nominal: 1000, Name: "Вон Республики Корея", Value: 69.5629 },
  { ID: "R01820", NumCode: "392", CharCode: "JPY", Nominal: 100, Name: "Японских иен", Value: 63.9188 },
];

const SYMBOLS = { RUB: '₽', USD: '$', EUR: '€', GBP: '£', JPY: '¥', CHF: '₣', KRW: '₩',
                  TRY: '₺', INR: '₹', CNY: '¥', VND: '₫', THB: '฿', BRL: 'R$', PLN: 'zł' };

const state = {
  from: 'RUB',
  to: 'USD',
  values: { from: '9261', to: '100' },
  active: 'from',        // какое поле ввода активно (зелёное)
  editingSlot: 'from',   // какую валюту меняем на 2-м экране
};

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const getCur = code => currencyList.find(c => c.CharCode === code);
const sym = code => SYMBOLS[code] || code;
const rate = code => { const c = getCur(code); return c.Value / c.Nominal; }; // ₽ за 1 ед.
const parseRaw = raw => { const n = parseFloat(String(raw).replace(',', '.')); return isFinite(n) ? n : 0; };
const formatNum = n => { if (!isFinite(n)) return '0';
                            return String(Math.round(n * 10000) / 10000).replace('.', ','); };
const convert = (amount, from, to) => amount * rate(from) / rate(to);
const other = s => s === 'from' ? 'to' : 'from';

function showScreen(name) {
  $('#screen-main').classList.toggle('active', name === 'main');
  $('#screen-choose').classList.toggle('active', name === 'choose');
}

function renderMain() {
  ['from', 'to'].forEach(slot => {
    const cur = getCur(state[slot]);
    const card = $('#card-' + slot);
    card.querySelector('.cur-code').textContent = cur.CharCode;
    card.querySelector('.cur-name').textContent = cur.Name;
    card.querySelector('.value').textContent = (state.values[slot] || '0') + sym(cur.CharCode);
    card.querySelector('.value-field').classList.toggle('active', state.active === slot);
  });
}

function recalcFromActive() {
  const a = state.active, b = other(a);
  state.values[b] = formatNum(convert(parseRaw(state.values[a]), state[a], state[b]));
}

function pressKey(d) {
  let raw = state.values[state.active] || '';
  if (d === ',') { if (raw.includes(',')) return; if (raw === '') raw = '0'; }
  state.values[state.active] = (raw + d).slice(0, 15);
  recalcFromActive();
  renderMain();
}

$$('.key[data-digit]').forEach(b => b.addEventListener('click', () => pressKey(b.dataset.digit)));

// очестка активного поля
$('#key-ac').addEventListener('click', () => {
  state.values[state.active] = '';
  state.values[other(state.active)] = '0';
  renderMain();
});

// удалить последний символ
$('#key-back').addEventListener('click', () => {
  state.values[state.active] = (state.values[state.active] || '').slice(0, -1);
  recalcFromActive();
  renderMain();
});

// сделать поле активным
$$('.value-field').forEach(f => f.addEventListener('click', () => {
  state.active = f.dataset.slot;
  renderMain();
}));

// клик по шапке карточки - экран выбора валюты
$$('.cur-head').forEach(h => h.addEventListener('click', () => {
  state.editingSlot = h.dataset.slot;
  showScreen('choose');
  renderList($('#search-input').value);
}));
$('#btn-back').addEventListener('click', () => showScreen('main'));


const searchInput = $('#search-input');

function renderList(query) {
  const q = (query || '').trim().toLowerCase();
  const filtered = currencyList.filter(c =>
    c.CharCode.toLowerCase().includes(q) || c.Name.toLowerCase().includes(q)
  );
  const list = $('#currency-list');
  list.innerHTML = '';
  if (!filtered.length) {
    list.innerHTML = '<li class="empty">Ничего не найдено</li>';
    return;
  }
  filtered.forEach(c => {
    const li = document.createElement('li');
    li.className = 'cur-item';
    const selected = state.from === c.CharCode || state.to === c.CharCode;
    li.innerHTML =
      `<div><div class="cur-code">${c.CharCode}</div>
       <div class="cur-name">${c.Name}</div></div>` +
      (selected ? '<span class="check">✓</span>' : '');
    li.addEventListener('click', () => selectCurrency(c.CharCode));
    list.appendChild(li);
  });
}

// Фильтрация после каждого изменения поля ввода
searchInput.addEventListener('input', (e) => { renderList(e.target.value); }); // live-поиск при наборе

$('#clear-search').addEventListener('click', () => {
  searchInput.value = '';
  renderList('');
  searchInput.focus();
});

function selectCurrency(code) {
  const slot = state.editingSlot, o = other(slot);
  if (state[o] === code) state[o] = state[slot]; // не даём дублировать валюту
  state[slot] = code;
  recalcFromActive();
  showScreen('main');
  renderMain();
}

renderMain();
renderList('');