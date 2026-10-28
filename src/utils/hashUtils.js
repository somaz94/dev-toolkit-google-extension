// Web Crypto has no MD5, so only the SHA family is offered.
const ALGORITHMS = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];

async function digest(algorithm, text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function generateHash(input) {
  const results = [];
  for (const algorithm of ALGORITHMS) {
    results.push(`${algorithm}:\n${await digest(algorithm, input)}`);
  }
  return results.join('\n\n');
}
