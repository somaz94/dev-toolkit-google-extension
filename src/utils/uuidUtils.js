/**
 * Generate UUID v4 using crypto.randomUUID()
 * Also supports generating multiple UUIDs at once
 */

export function generateUUID(input) {
  const trimmed = input.trim();
  let count = 1;

  if (trimmed) {
    count = parseInt(trimmed, 10);
    if (isNaN(count) || count < 1) {
      throw new Error('Enter a number (1-100) for how many UUIDs to generate.');
    }
    if (count > 100) {
      throw new Error('Maximum 100 UUIDs at a time.');
    }
  }

  const uuids = [];
  for (let i = 0; i < count; i++) {
    uuids.push(crypto.randomUUID());
  }

  return uuids.join('\n');
}
