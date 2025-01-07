export function formatJSON(input) {
  try {
    // 입력이 비어있는 경우
    if (!input.trim()) {
      return '';
    }
    
    // JSON 파싱 및 포맷팅
    const parsed = JSON.parse(input);
    return JSON.stringify(parsed, null, 2);
  } catch (e) {
    return `Error: ${e.message}`;
  }
}

export function minifyJSON(input) {
  try {
    if (!input.trim()) {
      return '';
    }
    const parsed = JSON.parse(input);
    return JSON.stringify(parsed);
  } catch (e) {
    return `Error: ${e.message}`;
  }
}

export function validateJSON(input) {
  try {
    JSON.parse(input);
    return true;
  } catch {
    return false;
  }
}
