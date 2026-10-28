import { applyTranslations, t } from '../i18n.js';
import { createHistory, historyLabel } from '../lib/history.js';
import { inputError, labelsFor, runTool } from '../lib/run.js';
import { shortcutFor } from '../lib/shortcuts.js';
import { createState } from '../lib/state.js';
import { createThemer, themeIcon, themeTitle } from '../lib/theme.js';
import { getTool, TOOLS } from '../tools/index.js';
import { minifyJSON } from '../utils/jsonFormatter.js';

const $ = (id) => document.getElementById(id);

const ui = {
  input: $('input'),
  output: $('output'),
  run: $('format'),
  copy: $('copy'),
  clear: $('clear'),
  useOutput: $('use-output'),
  history: $('history'),
  theme: $('theme-toggle'),
  modeSelector: document.querySelector('.mode-selector'),
  minify: $('minify'),
};
const tabs = [...document.querySelectorAll('.tab-btn')];
const modeButtons = [...document.querySelectorAll('.mode-btn')];
const panels = [...document.querySelectorAll('.tool-options')];

const history = createHistory();
const state = createState(TOOLS.map((each) => each.id));
const themer = createThemer(document);
let tool = TOOLS[0];
let mode = 'encode';

function renderLabels() {
  const labels = labelsFor(tool, mode);
  ui.run.textContent = labels.action;
  ui.input.placeholder = labels.placeholder;
  ui.modeSelector.classList.toggle('visible', Boolean(labels.modes));
  if (labels.modes) for (const button of modeButtons) button.textContent = labels.modes[button.dataset.mode];
  for (const panel of panels) panel.hidden = panel.dataset.tool !== tool.id;
}

const optionInputs = (id) => [...(panels.find((panel) => panel.dataset.tool === id)?.querySelectorAll('[data-option]') ?? [])];

function optionsOf(id) {
  return Object.fromEntries(optionInputs(id).map((input) => [input.dataset.option, input.type === 'checkbox' ? input.checked : input.value]));
}

function applyOptions(id, values) {
  for (const input of optionInputs(id)) {
    const value = values[input.dataset.option];
    if (value === undefined) continue;
    if (input.type === 'checkbox') input.checked = Boolean(value);
    // A value the select no longer offers leaves its default.
    else if (input.tagName !== 'SELECT' || [...input.options].some((option) => option.value === value)) input.value = value;
  }
}

function showError(message) {
  ui.output.value = t('errorLine', message);
  ui.output.classList.add('error');
  ui.useOutput.disabled = true;
}

function showOutput(value) {
  ui.output.value = value;
  ui.output.classList.remove('error');
  ui.useOutput.disabled = !value;
}

function renderHistory() {
  const entries = history.load(tool.id);
  const placeholder = new Option(t('historyLabel'), '');
  placeholder.disabled = true;
  ui.history.replaceChildren(placeholder, ...entries.map((entry, index) => new Option(historyLabel(entry), String(index))));
  ui.history.value = '';
  ui.history.hidden = entries.length === 0;
}

function resetFields(restoreHistory) {
  ui.input.value = restoreHistory ? history.last(tool.id) : '';
  showOutput('');
}

function selectTab(tab) {
  for (const other of tabs) other.classList.toggle('active', other === tab);
  tool = getTool(tab.dataset.tab);
  state.save({ tool: tool.id });
  renderLabels();
  resetFields(true);
  renderHistory();
}

function selectMode(next) {
  mode = next;
  for (const button of modeButtons) button.classList.toggle('active', button.dataset.mode === mode);
  state.save({ mode });
  renderLabels();
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
  renderHistory();
  const result = await runTool(tool, input, { mode, options: optionsOf(tool.id) });
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

for (const button of modeButtons) button.addEventListener('click', () => selectMode(button.dataset.mode));

for (const panel of panels) panel.addEventListener('change', () => state.saveOptions(panel.dataset.tool, optionsOf(panel.dataset.tool)));

ui.run.addEventListener('click', run);
ui.copy.addEventListener('click', copy);
ui.clear.addEventListener('click', () => resetFields(false));

ui.useOutput.addEventListener('click', () => {
  ui.input.value = ui.output.value;
  showOutput('');
  ui.input.focus();
});

ui.history.addEventListener('change', () => {
  const entry = history.load(tool.id)[Number(ui.history.value)];
  if (entry !== undefined) {
    ui.input.value = entry;
    showOutput('');
  }
  ui.history.value = '';
  ui.input.focus();
});

ui.minify.addEventListener('click', () => {
  if (!ui.input.value.trim()) return showError(t('errorEmpty'));
  showOutput(minifyJSON(ui.input.value));
});

function renderTheme(setting) {
  ui.theme.textContent = themeIcon(setting);
  ui.theme.title = t(themeTitle(setting));
  ui.theme.setAttribute('aria-label', ui.theme.title);
}

ui.theme.addEventListener('click', () => renderTheme(themer.toggle()));

document.addEventListener('keydown', (event) => {
  const shortcut = shortcutFor(event, tabs.length);
  if (!shortcut) return;
  event.preventDefault();
  if (shortcut.action === 'run') run();
  else if (shortcut.action === 'copy') copy();
  else selectTab(tabs[shortcut.index]);
});

applyTranslations();
renderTheme(themer.current());
const saved = state.load();
for (const [id, values] of Object.entries(saved.options)) applyOptions(id, values);
selectMode(saved.mode);
selectTab(tabs.find((tab) => tab.dataset.tab === saved.tool) ?? tabs[0]);
