import base64 from './base64.js';
import color from './color.js';
import diff from './diff.js';
import hash from './hash.js';
import json from './json.js';
import jwt from './jwt.js';
import timestamp from './timestamp.js';
import url from './url.js';
import uuid from './uuid.js';

// The popup's tab order; Alt+1-9 follows it.
export const TOOLS = Object.freeze([json, base64, jwt, url, timestamp, hash, uuid, color, diff]);

export const getTool = (id) => TOOLS.find((tool) => tool.id === id);

/** A message key that is either one key or one per mode. */
export const forMode = (keys, mode) => (typeof keys === 'string' ? keys : keys[mode]);

/** Every message key a tool names, for the catalog checks. */
export function messageKeys(tool) {
  const values = (keys) => (typeof keys === 'string' ? [keys] : Object.values(keys ?? {}));
  return [...values(tool.modes), ...values(tool.action), ...values(tool.placeholder)];
}
