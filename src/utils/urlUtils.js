export function encodeURL(input) {
  try {
    return encodeURIComponent(input);
  } catch (e) {
    return "Invalid input for URL encoding";
  }
}

export function decodeURL(input) {
  try {
    return decodeURIComponent(input);
  } catch (e) {
    return "Invalid URL encoded string";
  }
}