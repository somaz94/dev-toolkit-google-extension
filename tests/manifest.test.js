import { describe, test, expect } from '@jest/globals';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const read = (path) => readFileSync(join(ROOT, path), 'utf8');
const manifest = JSON.parse(read('manifest.json'));
const pkg = JSON.parse(read('package.json'));

describe('manifest', () => {
  test('version matches package.json', () => {
    expect(manifest.version).toBe(pkg.version);
  });

  test('description fits the Chrome Web Store limit in every language', () => {
    const [, key] = manifest.description.match(/^__MSG_(\w+)__$/);
    for (const locale of readdirSync(join(ROOT, '_locales'))) {
      const { message } = JSON.parse(read(`_locales/${locale}/messages.json`))[key];
      expect({ locale, fits: [...message].length <= 132 }).toEqual({ locale, fits: true });
    }
  });

  test('asks for no permissions', () => {
    expect(manifest.permissions).toEqual([]);
    expect(manifest.host_permissions).toBeUndefined();
  });

  test('every referenced file exists', () => {
    const files = [manifest.action.default_popup, ...Object.values(manifest.icons), ...Object.values(manifest.action.default_icon)];
    for (const file of files) expect({ file, exists: existsSync(join(ROOT, file)) }).toEqual({ file, exists: true });
  });

  test('both packaging paths ship _locales', () => {
    expect(read('Makefile')).toMatch(/zip -r \$\(PACKAGE\) manifest\.json _locales\//);
    expect(read('.github/workflows/release.yml')).toMatch(/manifest\.json \\\n\s+_locales\/ \\/);
  });
});
