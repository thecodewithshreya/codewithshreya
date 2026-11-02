const KEY = 'bloomTasks';
const list = document.getElementById('taskList');
const input = document.getElementById('taskInput');
const form = document.getElementById('taskForm');
let tasks = [];
let filter = 'all';

document.getElementById('date').textContent = new Intl.DateTimeFormat('en', { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date());

// Uses chrome.storage when running as the browser extension, localStorage as an app.
const hasChrome = typeof chrome !== "undefined" && chrome.storage && chrome.storage.local;
async function load() {
  if (hasChrome) return (await chrome.storage.local.get(KEY))[KEY];
  try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; }
}
async function save() {
  if (hasChrome) return chrome.storage.local.set({ [KEY]: tasks });
  try { localStorage.setItem(KEY, JSON.stringify(tasks)); } catch {}
}
function render() {
  const done = tasks.filter(t => t.done).length;
  document.getElementById('progressText').textContent = `${done} of ${tasks.length} done`;
  document.getElementById('progressBar').style.width = `${tasks.length ? done / tasks.length * 100 : 0}%`;
  document.getElementById('count').textContent = tasks.length;
  document.getElementById('encouragement').textContent = tasks.length && done === tasks.length ? 'You did it! Enjoy your moment 🌸' : 'Every little step counts 🌷';
  const visible = tasks.filter(t => filter === 'all' || (filter === 'done' ? t.done : !t.done));
  list.replaceChildren();
  document.getElementById('empty').hidden = visible.length > 0;
  for (const task of visible) {
    const li = document.createElement('li'); li.className = `task${task.done ? ' done' : ''}`;
    const label = document.createElement('label');
    const check = document.createElement('input'); check.type = 'checkbox'; check.checked = task.done;
    check.addEventListener('change', async () => { task.done = check.checked; await save(); render(); });
    const title = document.createElement('span'); title.textContent = task.text;
    label.append(check, title);
    const del = document.createElement('button'); del.className = 'delete'; del.type = 'button'; del.textContent = '×'; del.setAttribute('aria-label', `Delete ${task.text}`);
    del.addEventListener('click', async () => { tasks = tasks.filter(t => t.id !== task.id); await save(); render(); });
    li.append(label, del); list.append(li);
  }
}
form.addEventListener('submit', async event => {
  event.preventDefault(); const value = input.value.trim(); if (!value) return;
  tasks.unshift({ id: (crypto.randomUUID ? crypto.randomUUID() : Date.now() + "-" + Math.random()), text: value, done: false }); input.value = ''; await save(); render(); input.focus();
});
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  filter = button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(b => b.classList.toggle('active', b === button)); render();
}));
document.getElementById('clearDone').addEventListener('click', async () => { tasks = tasks.filter(t => !t.done); await save(); render(); });
(async () => { const data = await load(); tasks = Array.isArray(data) ? data : []; render(); })();
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("sw.js");
