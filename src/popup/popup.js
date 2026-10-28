import { applyTranslations, t } from '../i18n.js';
import { createHistory } from '../lib/history.js';
import { inputError, labelsFor, runTool } from '../lib/run.js';
import { shortcutFor } from '../lib/shortcuts.js';
import { createThemer, themeIcon } from '../lib/theme.js';
import { getTool, TOOLS } from '../tools/index.js';
import { minifyJSON } from '../utils/jsonFormatter.js';

const $ = (id) => document.getElementById(id);

const ui = {
  input: $('input'),
  output: $('output'),
  run: $('format'),
  copy: $('copy'),
  clear: $('clear'),
  theme: $('theme-toggle'),
  modeSelector: document.querySelector('.mode-selector'),
  jsonOptions: document.querySelector('.json-options'),
  indent: $('json-indent'),
  minify: $('minify'),
};
const tabs = [...document.querySelectorAll('.tab-btn')];
const modeButtons = [...document.querySelectorAll('.mode-btn')];

const history = createHistory();
const themer = createThemer(document);
let tool = TOOLS[0];
let mode = 'encode';

function renderLabels() {
  const labels = labelsFor(tool, mode);
  ui.run.textContent = labels.action;
  ui.input.placeholder = labels.placeholder;
  ui.modeSelector.classList.toggle('visible', Boolean(labels.modes));
  if (labels.modes) for (const button of modeButtons) button.textContent = labels.modes[button.dataset.mode];
  ui.jsonOptions.hidden = !tool.indentOptions;
}

function showError(message) {
  ui.output.value = t('errorLine', message);
  ui.output.classList.add('error');
}

function showOutput(value) {
  ui.output.value = value;
  ui.output.classList.remove('error');
}

function resetFields(restoreHistory) {
  ui.input.value = restoreHistory ? history.last(tool.id) : '';
  showOutput('');
}

function selectTab(tab) {
  for (const other of tabs) other.classList.toggle('active', other === tab);
  tool = getTool(tab.dataset.tab);
  renderLabels();
  resetFields(true);
}

function showToast(message) {
  document.querySelector('.toast')?.remove();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.querySelector('.container').appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 1500);
}

async function run() {
  const input = ui.input.value;
  const rejected = inputError(tool, input);
  if (rejected) return showError(rejected);
  history.save(tool.id, input);
  const indent = ui.indent.value === 'tab' ? 'tab' : Number(ui.indent.value);
  const result = await runTool(tool, input, { mode, indent });
  if (result.error) showError(result.error);
  else showOutput(result.output);
}

async function copy() {
  if (!ui.output.value) return;
  try {
    await navigator.clipboard.writeText(ui.output.value);
    showToast(t('copied'));
  } catch (error) {
    console.error('Failed to copy text: ', error);
  }
}

for (const tab of tabs) tab.addEventListener('click', () => selectTab(tab));

for (const button of modeButtons) {
  button.addEventListener('click', () => {
    for (const other of modeButtons) other.classList.toggle('active', other === button);
    mode = button.dataset.mode;
    renderLabels();
  });
}

ui.run.addEventListener('click', run);
ui.copy.addEventListener('click', copy);
ui.clear.addEventListener('click', () => resetFields(false));

ui.minify.addEventListener('click', () => {
  if (!ui.input.value.trim()) return showError(t('errorEmpty'));
  showOutput(minifyJSON(ui.input.value));
});

ui.theme.addEventListener('click', () => {
  ui.theme.textContent = themeIcon(themer.toggle());
});

document.addEventListener('keydown', (event) => {
  const shortcut = shortcutFor(event, tabs.length);
  if (!shortcut) return;
  event.preventDefault();
  if (shortcut.action === 'run') run();
  else if (shortcut.action === 'copy') copy();
  else selectTab(tabs[shortcut.index]);
});

applyTranslations();
ui.theme.textContent = themeIcon(themer.current());
selectTab(tabs.find((tab) => tab.classList.contains('active')) ?? tabs[0]);
