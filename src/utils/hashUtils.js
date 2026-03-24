/**
 * Generate hash using Web Crypto API
 * Supports: MD5 (via manual), SHA-1, SHA-256, SHA-384, SHA-512
 */

async function digest(algorithm, text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function generateHash(input) {
  const results = [];

  const algorithms = [
    { name: 'SHA-1', id: 'SHA-1' },
    { name: 'SHA-256', id: 'SHA-256' },
    { name: 'SHA-384', id: 'SHA-384' },
    { name: 'SHA-512', id: 'SHA-512' },
  ];

  for (const algo of algorithms) {
    const hash = await digest(algo.id, input);
    results.push(`${algo.name}:\n${hash}`);
  }

  return results.join('\n\n');
}
