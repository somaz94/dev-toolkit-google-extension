#!/usr/bin/env node
// Regenerates the Chrome Web Store images in store/: loads the extension into Chrome for Testing (branded
// Chrome ignores --load-extension), runs four tools in the popup in each language, and lays the captures out
// with hack/store-slide.html as 1280x800 screenshots plus the 440x280 small promo tile. Needs Node 22+ and
// network access the first time, to download Chrome for Testing; DEV_TOOLKIT_CHROME skips the download.
import { execFileSync, spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';

const ROOT = realpathSync(join(dirname(fileURLToPath(import.meta.url)), '..'));
const CACHE = join(process.env.XDG_CACHE_HOME ?? join(homedir(), '.cache'), 'dev-toolkit-store');
const SEND_TIMEOUT = 20000;

// The local-time line in the timestamp shot shows this zone.
const LANGUAGES = { en: 'America/New_York', ko: 'Asia/Seoul' };

// One popup capture per slide, in slide order. The mode is shared by every tab, as in the popup.
const SHOTS = [
  { tab: 'json', input: '{"name":"Dev Toolkit","offline":true,"permissions":[]}' },
  {
    tab: 'jwt',
    mode: 'decode',
    input: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  },
  { tab: 'timestamp', mode: 'decode', input: '1711270800' },
  { tab: 'diff', theme: 'dark', input: 'apple\nbanana\ncherry\n---\napple\nblueberry\ncherry\ndate' },
];

function chromeBinary() {
  if (process.env.DEV_TOOLKIT_CHROME) return process.env.DEV_TOOLKIT_CHROME;
  const out = execFileSync('npx', ['--yes', '@puppeteer/browsers', 'install', 'chrome@stable', '--path', CACHE], { encoding: 'utf8' });
  return /^chrome@\S+ (.+)$/m.exec(out)[1].trim();
}

// Chrome on macOS takes its UI language from AppleLanguages and ignores --lang. Headless Chrome reads the
// `(ko)` value as the one page to open, so it replaces about:blank there instead of joining it.
const languageArgs = (language) => (process.platform === 'darwin' ? ['-AppleLanguages', `(${language})`] : [`--lang=${language}`, 'about:blank']);

async function connect(work, language) {
  const profile = join(work, `profile-${language}`);
  const chrome = spawn(chromeBinary(), [
    '--headless=new', `--user-data-dir=${profile}`, '--remote-debugging-port=0',
    `--load-extension=${ROOT}`, `--disable-extensions-except=${ROOT}`, '--no-first-run', '--no-default-browser-check',
    '--disable-gpu', '--use-mock-keychain', '--password-store=basic', '--hide-scrollbars', '--allow-file-access-from-files',
    ...languageArgs(language),
  ], { stdio: 'ignore', env: { ...process.env, TZ: LANGUAGES[language], LANG: `${language}.UTF-8`, LANGUAGE: language } });

  const portFile = join(profile, 'DevToolsActivePort');
  const readPort = () => (existsSync(portFile) ? readFileSync(portFile, 'utf8').trim().split('\n') : []);
  for (let i = 0; i < 100 && readPort().length < 2; i += 1) await sleep(100);
  const [port, path] = readPort();
  const ws = new WebSocket(`ws://127.0.0.1:${port}${path}`);
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true });
    ws.addEventListener('error', reject, { once: true });
  });

  let nextId = 0;
  const pending = new Map();
  ws.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    const call = message.id && pending.get(message.id);
    if (!call) return;
    pending.delete(message.id);
    clearTimeout(call.timer);
    if (message.error) call.reject(new Error(message.error.message));
    else call.resolve(message.result);
  });
  // A Chrome that stops answering fails the run instead of hanging it.
  const send = (method, params = {}, sessionId = undefined) => new Promise((resolve, reject) => {
    nextId += 1;
    const id = nextId;
    const timer = setTimeout(() => {
      pending.delete(id);
      reject(new Error(`${method}: no answer in ${SEND_TIMEOUT} ms`));
    }, SEND_TIMEOUT);
    pending.set(id, { resolve, reject, timer });
    ws.send(JSON.stringify({ id, method, params, sessionId }));
  });

  async function open(url, width, height, scale) {
    const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
    await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: scale, mobile: false }, sessionId);
    await send('Page.navigate', { url }, sessionId);
    const evaluate = async (expression) => {
      const { result, exceptionDetails } = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }, sessionId);
      if (exceptionDetails) throw new Error(exceptionDetails.exception?.description ?? exceptionDetails.text);
      return result.value;
    };
    const ready = async () => {
      for (let i = 0; i < 100; i += 1) {
        try {
          if (await evaluate('document.readyState === "complete"')) return;
        } catch {
          // Still navigating.
        }
        await sleep(100);
      }
    };
    await ready();
    const shoot = async (file, selector = null) => {
      const clip = selector
        ? await evaluate(`(() => { const r = document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect(); return { x: r.x, y: r.y + scrollY, width: r.width, height: r.height, scale: 1 }; })()`)
        : { x: 0, y: 0, width, height, scale: 1 };
      const { data } = await send('Page.captureScreenshot', { format: 'png', clip, captureBeyondViewport: true }, sessionId);
      writeFileSync(file, Buffer.from(data, 'base64'));
    };
    return { evaluate, ready, shoot, close: () => send('Target.closeTarget', { targetId }) };
  }

  return {
    open,
    async close() {
      ws.close();
      chrome.kill();
      await sleep(300);
    },
  };
}

// An unpacked extension's id is the SHA-256 of its path, hex digits mapped onto a-p.
const id = [...createHash('sha256').update(ROOT).digest('hex').slice(0, 32)].map((c) => String.fromCharCode(97 + parseInt(c, 16))).join('');
const popupUrl = `chrome-extension://${id}/src/popup/popup.html`;

const work = mkdtempSync(join(tmpdir(), 'dev-toolkit-store-'));
try {
  for (const language of Object.keys(LANGUAGES)) {
    const browser = await connect(work, language);
    try {
      await sleep(1000);
      const dir = join(work, language);
      mkdirSync(dir);
      for (const [index, shot] of SHOTS.entries()) {
        const popup = await browser.open(popupUrl, 552, 700, 2);
        await popup.evaluate(`localStorage.clear(); localStorage.setItem('theme', ${JSON.stringify(shot.theme ?? 'light')}); location.reload()`);
        await sleep(300);
        await popup.ready();
        await popup.evaluate(`(() => {
          document.querySelector('[data-tab=${JSON.stringify(shot.tab)}]').click();
          document.querySelector('[data-mode=${JSON.stringify(shot.mode ?? 'encode')}]').click();
          document.getElementById('input').value = ${JSON.stringify(shot.input)};
          document.getElementById('format').click();
        })()`);
        await sleep(500);
        await popup.shoot(join(dir, `popup-${index + 1}.png`), 'body');
        await popup.close();
      }

      copyFileSync(join(ROOT, 'hack', 'store-slide.html'), join(dir, 'slide.html'));
      copyFileSync(join(ROOT, 'icons', 'icon128.png'), join(dir, 'icon.png'));
      const out = join(ROOT, 'store', 'screenshots', language);
      mkdirSync(out, { recursive: true });
      for (let n = 0; n < SHOTS.length; n += 1) {
        const slide = await browser.open(`file://${join(dir, 'slide.html')}?lang=${language}&n=${n}`, 1280, 800, 1);
        await sleep(500);
        await slide.shoot(join(out, `${n + 1}.png`));
        await slide.close();
      }
      const promoDir = join(ROOT, 'store', 'promo');
      mkdirSync(promoDir, { recursive: true });
      const promo = await browser.open(`file://${join(dir, 'slide.html')}?lang=${language}&promo`, 440, 280, 1);
      await sleep(500);
      await promo.shoot(join(promoDir, `small-${language}.png`));
      await promo.close();
      console.log(`store/screenshots/${language}: ${SHOTS.length} screenshots, store/promo/small-${language}.png`);
    } finally {
      await browser.close();
    }
  }
} finally {
  rmSync(work, { recursive: true, force: true });
}
