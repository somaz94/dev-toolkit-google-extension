#!/usr/bin/env node
// Drives the real popup in Chrome for Testing: what the unit tests cannot see, from Chrome accepting the
// manifest to the DOM glue in src/popup/ that sits outside the coverage gate.
import { setTimeout as sleep } from 'node:timers/promises';
import { launch, ORIGIN } from '../../hack/chrome.mjs';

const POPUP = `${ORIGIN}/src/popup/popup.html`;
let failures = 0;

function check(name, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failures += 1;
  console.log(ok ? `  ✓ ${name}` : `  ✗ ${name}\n      expected ${JSON.stringify(expected)}\n      actual   ${JSON.stringify(actual)}`);
}

/** Picks `tab` and `mode`, sets the options panel and the input, runs, and returns what the output shows. */
const runTool = (popup, { tab, mode, input, options = {} }) => popup.evaluate(`(async () => {
  document.querySelector('[data-tab=${JSON.stringify(tab)}]').click();
  ${mode ? `document.querySelector('[data-mode=${JSON.stringify(mode)}]').click();` : ''}
  for (const [name, value] of Object.entries(${JSON.stringify(options)})) {
    const field = document.querySelector('.tool-options:not([hidden]) [data-option="' + name + '"]');
    if (field.type === 'checkbox') field.checked = value;
    else field.value = value;
  }
  const output = document.getElementById('output');
  output.value = '';
  document.getElementById('input').value = ${JSON.stringify(input)};
  document.getElementById('format').click();
  for (let i = 0; i < 50 && !output.value; i += 1) await new Promise((resolve) => setTimeout(resolve, 50));
  return { output: output.value, error: output.classList.contains('error') };
})()`);

const state = (popup) => popup.evaluate(`({
  tab: document.querySelector('.tab-btn.active').dataset.tab,
  mode: document.querySelector('.mode-btn.active').dataset.mode,
  input: document.getElementById('input').value,
  theme: document.documentElement.dataset.theme ?? document.documentElement.getAttribute('data-theme'),
  panels: [...document.querySelectorAll('.tool-options:not([hidden])')].map((panel) => panel.dataset.tool),
  modes: document.querySelector('.mode-selector').classList.contains('visible'),
  history: [...document.querySelectorAll('#history option')].slice(1).map((option) => option.textContent),
})`);

const key = (popup, init) => popup.evaluate(`document.dispatchEvent(new KeyboardEvent('keydown', ${JSON.stringify({ bubbles: true, ...init })}))`);

async function tools(popup) {
  console.log('tools');
  const json = await runTool(popup, { tab: 'json', input: '{"a":1}', options: { indent: '4' } });
  check('JSON formats with the chosen indent', json, { output: '{\n    "a": 1\n}', error: false });
  await popup.evaluate(`document.getElementById('minify').click()`);
  check('Minify puts JSON on one line', await popup.evaluate(`document.getElementById('output').value`), '{"a":1}');
  const bad = await runTool(popup, { tab: 'json', input: '{bad' });
  check('invalid JSON shows as an error', [bad.error, bad.output.startsWith('❌ Error: Invalid JSON')], [true, true]);

  check('Base64 encodes UTF-8', (await runTool(popup, { tab: 'base64', mode: 'encode', input: '한글' })).output, '7ZWc6riA');
  check('Base64 encodes URL-safe', (await runTool(popup, { tab: 'base64', mode: 'encode', input: '??>', options: { urlSafe: true } })).output, 'Pz8-');
  check('Base64 decodes URL-safe input', (await runTool(popup, { tab: 'base64', mode: 'decode', input: '8J-YgA' })).output, '😀');

  const { output: token } = await runTool(popup, { tab: 'jwt', mode: 'encode', input: '{"sub":"1","name":"홍길동"}\nk' });
  check('JWT encodes a signed token', token.split('.').length, 3);
  const decoded = await runTool(popup, { tab: 'jwt', mode: 'decode', input: `${token}\nk` });
  check('JWT decode shows the payload and checks the signature', [decoded.output.includes('"name": "홍길동"'), decoded.output.includes('✓ Valid HS256')], [true, true]);

  check('URL encodes', (await runTool(popup, { tab: 'url', mode: 'encode', input: 'a b' })).output, 'a%20b');
  check('Timestamp to date', (await runTool(popup, { tab: 'timestamp', mode: 'decode', input: '0' })).output.includes('1970-01-01 00:00:00.000 UTC'), true);
  check('Hash', (await runTool(popup, { tab: 'hash', input: 'a' })).output.split('\n').slice(0, 2), ['SHA-1:', '86f7e437faa5a7fce15d1ddcb9eaeaea377667b8']);
  const uuids = (await runTool(popup, { tab: 'uuid', input: '3' })).output.split('\n');
  check('UUID batch', uuids.map((uuid) => /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(uuid)), [true, true, true]);
  check('Color', (await runTool(popup, { tab: 'color', input: '#ff6347' })).output.split('\n')[1], 'RGB: rgb(255, 99, 71)');
  check('Diff aligns lines', (await runTool(popup, { tab: 'diff', input: 'a\nb\n---\nx\na\nb' })).output.split('\n').slice(2), ['+ x', '  a', '  b']);
}

async function panels(popup) {
  console.log('panels and modes');
  await popup.evaluate(`document.querySelector('[data-tab="json"]').click()`);
  check('JSON shows its options and no modes', await state(popup).then(({ panels: shown, modes }) => ({ shown, modes })), { shown: ['json'], modes: false });
  await popup.evaluate(`document.querySelector('[data-tab="base64"]').click()`);
  check('Base64 shows its options and modes', await state(popup).then(({ panels: shown, modes }) => ({ shown, modes })), { shown: ['base64'], modes: true });
  await popup.evaluate(`document.querySelector('[data-tab="hash"]').click()`);
  check('Hash shows neither', await state(popup).then(({ panels: shown, modes }) => ({ shown, modes })), { shown: [], modes: false });
}

async function history(popup) {
  console.log('history');
  await runTool(popup, { tab: 'json', input: '{"first":1}' });
  await runTool(popup, { tab: 'json', input: '{"second":2}' });
  await popup.evaluate(`document.querySelector('[data-tab="url"]').click()`);
  await popup.evaluate(`document.querySelector('[data-tab="json"]').click()`);
  const shown = await state(popup);
  check('switching back restores the latest input', shown.input, '{"second":2}');
  check('the recent list holds every input, newest first', shown.history.slice(0, 2), ['{"second":2}', '{"first":1}']);
  await popup.evaluate(`(() => { const list = document.getElementById('history'); list.value = '1'; list.dispatchEvent(new Event('change')); })()`);
  check('picking a recent input puts it back', (await state(popup)).input, '{"first":1}');
}

async function useOutput(popup) {
  console.log('use as input');
  const disabled = () => popup.evaluate(`document.getElementById('use-output').disabled`);
  await runTool(popup, { tab: 'base64', mode: 'decode', input: 'eyJhIjoxfQ==' });
  check('a result can be used as input', await disabled(), false);
  await popup.evaluate(`document.getElementById('use-output').click()`);
  check('it moves the result into the input and clears the output', await popup.evaluate(`[document.getElementById('input').value, document.getElementById('output').value]`), ['{"a":1}', '']);
  check('and turns itself off until there is a new result', await disabled(), true);
  await popup.evaluate(`document.querySelector('[data-tab="json"]').click()`);
  check('the next tool takes the moved result instead of its own last input', (await state(popup)).input, '{"a":1}');
  await popup.evaluate(`document.querySelector('[data-option="indent"]').value = '2'; document.getElementById('format').click()`);
  await popup.evaluate('new Promise((resolve) => setTimeout(resolve, 200))');
  check('and runs on it', await popup.evaluate(`document.getElementById('output').value`), '{\n  "a": 1\n}');
  await popup.evaluate(`document.querySelector('[data-tab="url"]').click()`);
  check('once used, switching tools restores each tool\'s last input again', (await state(popup)).input, 'a b');
  await runTool(popup, { tab: 'json', input: '{bad' });
  check('an error cannot be used as input', await disabled(), true);
}

async function keyboard(popup) {
  console.log('keyboard');
  await key(popup, { key: '2', altKey: true });
  check('Alt+2 switches to the second tool', (await state(popup)).tab, 'base64');
  await popup.evaluate(`document.querySelector('[data-mode="encode"]').click(); document.querySelector('[data-option="urlSafe"]').checked = false; document.getElementById('input').value = 'hi'; document.getElementById('output').value = ''`);
  await key(popup, { key: 'Enter', ctrlKey: true });
  await popup.evaluate('new Promise((resolve) => setTimeout(resolve, 200))');
  check('Ctrl+Enter runs the tool', await popup.evaluate(`document.getElementById('output').value`), 'aGk=');
}

async function theme(popup) {
  console.log('theme');
  const look = () => popup.evaluate(`[document.documentElement.getAttribute('data-theme'), document.getElementById('theme-toggle').title]`);
  // The headless browser otherwise follows the appearance of the machine running the test.
  await popup.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'light' }] });
  await popup.evaluate('new Promise((resolve) => setTimeout(resolve, 200))');
  check('a new user follows the system', await look(), ['light', 'Theme: follow the system (click for light)']);
  await popup.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'dark' }] });
  // The media query's change event arrives after the emulation call returns.
  await popup.evaluate('new Promise((resolve) => setTimeout(resolve, 200))');
  check('and the page turns dark with it', (await look())[0], 'dark');
  await popup.evaluate(`document.getElementById('theme-toggle').click()`);
  check('the toggle picks light over a dark system', await look(), ['light', 'Theme: light (click for dark)']);
  await popup.evaluate(`document.getElementById('theme-toggle').click()`);
  await popup.reload();
  check('dark survives a reload', await look(), ['dark', 'Theme: dark (click to follow the system)']);
  await popup.send('Emulation.setEmulatedMedia', { features: [] });
}

async function remembers(popup) {
  console.log('remembered state');
  await runTool(popup, { tab: 'json', input: '{}', options: { indent: 'tab' } });
  await popup.evaluate(`document.querySelector('[data-option="indent"]').dispatchEvent(new Event('change', { bubbles: true }))`);
  await popup.evaluate(`document.querySelector('[data-tab="timestamp"]').click(); document.querySelector('[data-mode="decode"]').click()`);
  await popup.reload();
  const shown = await state(popup);
  check('the popup reopens on the last tool and mode', [shown.tab, shown.mode], ['timestamp', 'decode']);
  check('and keeps each tool\'s options', await popup.evaluate(`document.querySelector('[data-option="indent"]').value`), 'tab');
}

// A wrapped tab row pushes the last tool onto a second line, which the 520px popup has no room for.
const oneRowOfTabs = (popup) => popup.evaluate(`document.querySelector('.tabs').getBoundingClientRect().height < 40`);

const browser = await launch({ language: 'en', timeZone: 'UTC' });
try {
  const popup = await browser.open(POPUP);
  check('the popup loads with one tab per tool', await popup.evaluate(`document.querySelectorAll('.tab-btn').length`), 9);
  check('the tabs fit on one row', await oneRowOfTabs(popup), true);
  await tools(popup);
  await panels(popup);
  await history(popup);
  await useOutput(popup);
  await keyboard(popup);
  await theme(popup);
  await remembers(popup);
  check('no uncaught errors or console errors', popup.problems(), []);
  await openInTab(browser, popup);
} finally {
  await browser.close();
}

async function openInTab(browser, popup) {
  console.log('open in a tab');
  // The click closes the page it runs in, as it closes the popup, so it is queued and awaited from here.
  await popup.evaluate(`setTimeout(() => document.getElementById('open-tab').click(), 0)`);
  await sleep(500);
  const url = `${POPUP}?page`;
  const urls = await browser.pageUrls();
  check('the button opens the page in a tab and closes the popup', [urls.includes(url), urls.includes(POPUP)], [true, false]);
  const page = await browser.open(url, { width: 1200, height: 900 });
  const layout = await page.evaluate(`[document.body.classList.contains('page'), document.getElementById('open-tab').hidden, document.body.getBoundingClientRect().width > 600]`);
  check('the tab uses the wide layout and has no open button of its own', layout, [true, true, true]);
  check('the tab runs tools like the popup', (await runTool(page, { tab: 'url', mode: 'encode', input: 'a b' })).output, 'a%20b');
  check('no errors in the tab', page.problems(), []);
}

const korean = await launch({ language: 'ko' });
try {
  console.log('korean');
  const popup = await korean.open(POPUP);
  check('the popup follows the browser language', await popup.evaluate(`[document.documentElement.lang, document.querySelector('[data-tab="timestamp"]').textContent]`), ['ko', '시간']);
  check('the Korean tabs fit on one row too', await oneRowOfTabs(popup), true);
} finally {
  await korean.close();
}

console.log(failures ? `\n${failures} check(s) failed` : '\nall checks passed');
process.exitCode = failures ? 1 : 0;
