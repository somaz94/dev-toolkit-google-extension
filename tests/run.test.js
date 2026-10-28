import { describe, test, expect } from '@jest/globals';
import { inputError, labelsFor, MAX_INPUT_LENGTH, runTool } from '../src/lib/run.js';
import { getTool } from '../src/tools/index.js';

describe('inputError', () => {
  test('refuses empty input unless the tool allows it', () => {
    expect(inputError(getTool('json'), '  ')).toBe('Input is empty.');
    expect(inputError(getTool('uuid'), '')).toBeNull();
  });

  test('refuses input over the size limit', () => {
    expect(inputError(getTool('json'), 'x'.repeat(MAX_INPUT_LENGTH + 1))).toMatch(/too large/i);
  });

  test('accepts anything else', () => {
    expect(inputError(getTool('json'), '{}')).toBeNull();
  });
});

describe('labelsFor', () => {
  test('a tool without modes has no mode labels', () => {
    expect(labelsFor(getTool('hash'), 'encode')).toEqual({
      action: 'Generate Hash',
      placeholder: expect.any(String),
      modes: null,
    });
  });

  test('labels follow the mode', () => {
    const encode = labelsFor(getTool('timestamp'), 'encode');
    const decode = labelsFor(getTool('timestamp'), 'decode');
    expect(encode.action).not.toBe(decode.action);
    expect(encode.placeholder).not.toBe(decode.placeholder);
    expect(Object.keys(encode.modes)).toEqual(['encode', 'decode']);
  });
});

describe('runTool', () => {
  test('formats JSON with the chosen indent', async () => {
    expect(await runTool(getTool('json'), '{"a":1}', { indent: 4 })).toEqual({ output: '{\n    "a": 1\n}' });
    expect(await runTool(getTool('json'), '{"a":1}', { indent: 'tab' })).toEqual({ output: '{\n\t"a": 1\n}' });
  });

  test('stops at validation', async () => {
    expect((await runTool(getTool('json'), '{bad'))).toEqual({ error: expect.stringContaining('Invalid JSON') });
    expect((await runTool(getTool('base64'), '!!', { mode: 'decode' })).error).toBeDefined();
  });

  test('skips validation the mode does not need', async () => {
    expect(await runTool(getTool('base64'), 'Hello', { mode: 'encode' })).toEqual({ output: 'SGVsbG8=' });
    expect(await runTool(getTool('url'), 'a%20b', { mode: 'decode' })).toEqual({ output: 'a b' });
    expect(await runTool(getTool('url'), 'a b', { mode: 'encode' })).toEqual({ output: 'a%20b' });
  });

  test('round-trips a JWT and reports a bad one as an error', async () => {
    const { output: token } = await runTool(getTool('jwt'), '{"sub":"1"}\nkey', { mode: 'encode' });
    const { output } = await runTool(getTool('jwt'), token, { mode: 'decode' });
    expect(output).toMatch(/^Header:\n[\s\S]*"HS256"[\s\S]*\n\nPayload:\n[\s\S]*"sub": "1"[\s\S]*\n\nSignature:\n\S+$/);
    expect(await runTool(getTool('jwt'), 'abc.def.ghi', { mode: 'decode' })).toEqual({ error: 'Invalid JWT token' });
  });

  test('encodes a payload whose values contain dots', async () => {
    const { output } = await runTool(getTool('jwt'), '{"email":"a@b.com"}', { mode: 'encode' });
    expect(output.split('.')).toHaveLength(3);
  });

  test('passes an encoder error through', async () => {
    const tool = { run: async () => ({ error: 'nope' }) };
    expect(await runTool(tool, 'x')).toEqual({ error: 'nope' });
  });

  test('wraps a thrown error', async () => {
    expect(await runTool(getTool('color'), 'not a color')).toEqual({ error: expect.stringMatching(/^An error occurred: /) });
  });

  test('runs the remaining tools', async () => {
    expect((await runTool(getTool('timestamp'), '0', { mode: 'decode' })).output).toContain('1970-01-01');
    expect((await runTool(getTool('timestamp'), '1970-01-01T00:00:00Z', { mode: 'encode' })).output).toContain('0');
    expect((await runTool(getTool('hash'), 'a')).output).toMatch(/^SHA-1:/);
    expect((await runTool(getTool('uuid'), '2')).output.split('\n')).toHaveLength(2);
    expect((await runTool(getTool('diff'), 'a\n---\nb')).output).toContain('+ b');
  });
});
