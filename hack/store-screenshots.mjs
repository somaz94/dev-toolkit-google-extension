#!/usr/bin/env node
// Regenerates the Chrome Web Store images in store/: runs four tools in the popup in each language and lays
// the captures out with hack/store-slide.html as 1280x800 screenshots plus the 440x280 small promo tile.
import { copyFileSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import { launch, ORIGIN, ROOT } from './chrome.mjs';

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

const work = mkdtempSync(join(tmpdir(), 'dev-toolkit-store-'));
try {
  for (const [language, timeZone] of Object.entries(LANGUAGES)) {
    const browser = await launch({ language, timeZone });
    try {
      const dir = join(work, language);
      mkdirSync(dir);
      for (const [index, shot] of SHOTS.entries()) {
        const popup = await browser.open(`${ORIGIN}/src/popup/popup.html`, { width: 552, height: 700, scale: 2 });
        await popup.evaluate(`localStorage.clear(); localStorage.setItem('theme', ${JSON.stringify(shot.theme ?? 'light')})`);
        await popup.reload();
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
        const slide = await browser.open(`file://${join(dir, 'slide.html')}?lang=${language}&n=${n}`, { width: 1280, height: 800 });
        await sleep(500);
        await slide.shoot(join(out, `${n + 1}.png`));
        await slide.close();
      }
      const promoDir = join(ROOT, 'store', 'promo');
      mkdirSync(promoDir, { recursive: true });
      const promo = await browser.open(`file://${join(dir, 'slide.html')}?lang=${language}&promo`, { width: 440, height: 280 });
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
