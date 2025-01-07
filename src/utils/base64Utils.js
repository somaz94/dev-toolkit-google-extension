export function encodeBase64(input) {
  try {
    return btoa(input);
  } catch (e) {
    return "Invalid input for Base64 encoding";
  }
}

export function decodeBase64(input) {
  try {
    return atob(input);
  } catch (e) {
    return "Invalid Base64 string";
  }
}
