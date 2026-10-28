import { describe, test, expect } from '@jest/globals';
import { readFileSync } from 'node:fs';
import { forMode, getTool, messageKeys, TOOLS } from '../src/tools/index.js';

const en = JSON.parse(readFileSync(new URL('../_locales/en/messages.json', import.meta.url), 'utf8'));
const html = readFileSync(new URL('../src/popup/popup.html', import.meta.url), 'utf8');
const modeButtons = [...html.matchAll(/class="mode-btn[^"]*" data-mode="(\w+)"/g)].map((match) => match[1]);

describe('tools', () => {
  test('ids are unique and getTool finds each one', () => {
    expect(new Set(TOOLS.map((tool) => tool.id)).size).toBe(TOOLS.length);
    for (const tool of TOOLS) expect(getTool(tool.id)).toBe(tool);
    expect(getTool('nope')).toBeUndefined();
  });

  test('the popup has one tab per tool, in registry order, the first one active', () => {
    const tabs = [...html.matchAll(/<button class="tab-btn( active)?" data-tab="(\w+)"/g)];
    expect(tabs.map((match) => match[2])).toEqual(TOOLS.map((tool) => tool.id));
    expect(tabs.filter((match) => match[1]).map((match) => match[2])).toEqual([TOOLS[0].id]);
  });

  test('Alt+1-9 reaches every tab', () => {
    expect(TOOLS.length).toBeLessThanOrEqual(9);
  });

  test.each(TOOLS.map((tool) => [tool.id, tool]))('%s names only existing messages, one per mode button', (id, tool) => {
    expect(typeof tool.run).toBe('function');
    for (const key of messageKeys(tool)) expect({ id, key, exists: key in en }).toEqual({ id, key, exists: true });
    if (!tool.modes) return;
    expect(Object.keys(tool.modes)).toEqual(modeButtons);
    for (const mode of modeButtons) {
      expect(forMode(tool.action, mode)).toBeDefined();
      expect(forMode(tool.placeholder, mode)).toBeDefined();
    }
  });

  test('a tool without modes names one action and one placeholder', () => {
    for (const tool of TOOLS.filter((t) => !t.modes)) {
      expect(typeof tool.action).toBe('string');
      expect(typeof tool.placeholder).toBe('string');
    }
  });
});
