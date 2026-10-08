const storage = {
  setItem(key, value) {
    const v = typeof value === 'string' ? value : JSON.stringify(value);
    try { localStorage.setItem(key, v); }
    catch (err) { console.error('storage.setItem:', err); }
  },
  getItem(key) {
    try { return localStorage.getItem(key); }
    catch (err) { console.error('storage.getItem:', err); return null; }
  },
  removeItem(key) {
    try { localStorage.removeItem(key); }
    catch (err) { console.error('storage.removeItem:', err); }
  }
};

// Состояние приложения
const TASKS_KEY = 'todolist.tasks';
let tasks = []; // массив записей { id, text, done, createdAt }
let editingId = null; // id редактируемой задачи (null - создание)

const ICON_CHECK = '<svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">'
  + '<path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4Z" fill="#fff"/></svg>';

const ICON_EDIT = '<svg width="18" height="18" viewBox="0 0 24 24" fill="#1a1a1a" aria-hidden="true">'
  + '<path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Z"/>'
  + '<path d="M20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83Z"/></svg>';

const ICON_DELETE = '<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">'
  + '<circle cx="12" cy="12" r="10" fill="#F01F1F"/>'
  + '<path d="m15.2 8.8-6.4 6.4M8.8 8.8l6.4 6.4" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>';

const els = {
  list: document.getElementById('todoList'),
  empty: document.getElementById('emptyState'),
  modal: document.getElementById('modalScreen'),
  input: document.getElementById('taskInput'),
  add: document.getElementById('addBtn'),
  back: document.getElementById('backBtn'),
  save: document.getElementById('saveBtn'),
};

// Работа с хранилищем
function loadTasks() {
  const raw = storage.getItem(TASKS_KEY);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) tasks = parsed;
  } catch (e) {
    console.warn('Данные повреждены, ключ удалён');
    storage.removeItem(TASKS_KEY);
  }
}

function saveTasks() {
  storage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// Требуемые функции

// Отображение экрана создания (или редактирования, если передан id)
function openModal(id = null) {
  editingId = id;
  if (id !== null) {
    const task = tasks.find(t => t.id === id);
    els.input.value = task ? task.text : '';
  } else {
    els.input.value = '';
  }
  els.modal.hidden = false;
  els.input.focus();
}

// Скрытие экрана создания/редактирования
function closeModal() {
  els.modal.hidden = true;
  editingId = null;
  els.input.value = '';
}

function createTask() {
  const text = els.input.value.trim();
  if (!text) { els.input.focus(); return; }

  tasks.push({
    id: generateId(),
    text,
    done: false,
    createdAt: Date.now()
  });
  saveTasks();
  els.input.value = '';   // очистка поля ввода
  closeModal();           // скрытие экрана создания
  renderTodoList();
}

function deleteItem(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTodoList();
}

// Переключение статуса выполнено/не выполнено
function setDone(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  task.done = !task.done;
  saveTasks();
  renderTodoList();
}

// Отрисовка списка задач
function renderTodoList() {
  els.list.innerHTML = '';
  els.empty.hidden = tasks.length > 0;

  for (const task of tasks) {
    const li = document.createElement('li');
    li.className = 'task' + (task.done ? ' done' : '');

    const checkBtn = document.createElement('button');
    checkBtn.type = 'button';
    checkBtn.className = 'task-check';
    checkBtn.title = task.done ? 'Отметить невыполненной' : 'Отметить выполненной';
    checkBtn.innerHTML = ICON_CHECK;
    checkBtn.addEventListener('click', () => setDone(task.id));

    const text = document.createElement('span');
    text.className = 'task-text';
    text.textContent = task.text;

    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'icon-action';
    editBtn.title = 'Редактировать';
    editBtn.innerHTML = ICON_EDIT;
    editBtn.addEventListener('click', () => openModal(task.id));

    const delBtn = document.createElement('button');
    delBtn.type = 'button';
    delBtn.className = 'icon-action';
    delBtn.title = 'Удалить';
    delBtn.innerHTML = ICON_DELETE;
    delBtn.addEventListener('click', () => deleteItem(task.id));

    actions.append(editBtn, delBtn);
    li.append(checkBtn, text, actions);
    els.list.append(li);
  }
}

// Сохраняет новую задачу либо отредактированную
function saveFromModal() {
  if (editingId !== null) {
    const task = tasks.find(t => t.id === editingId);
    const text = els.input.value.trim();
    if (!task) { closeModal(); return; }
    if (!text) { els.input.focus(); return; }
    task.text = text;
    saveTasks();
    closeModal();
    renderTodoList();
  } else {
    createTask();
  }
}

// Привязка событий
els.add.addEventListener('click', () => openModal());
els.back.addEventListener('click', () => closeModal());
els.save.addEventListener('click', () => saveFromModal());

document.addEventListener('keydown', (e) => {
  if (els.modal.hidden) return;
  if (e.key === 'Escape') closeModal();
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) saveFromModal();
});

loadTasks();
renderTodoList();
