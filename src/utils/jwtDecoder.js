export function decodeJWT(token) {
  try {
    // JWT 토큰 파트 분리
    const [headerB64, payloadB64, signature] = token.split('.');

    // Base64Url을 일반 텍스트로 디코딩
    const header = JSON.parse(base64UrlDecode(headerB64));
    const payload = JSON.parse(base64UrlDecode(payloadB64));

    return {
      header: JSON.stringify(header, null, 2),
      payload: JSON.stringify(payload, null, 2),
      signature: signature
    };
  } catch (e) {
    return {
      error: "Invalid JWT token"
    };
  }
}

// Base64Url 디코딩 함수
function base64UrlDecode(input) {
  // Base64Url을 Base64로 변환
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  // Padding 추가
  const pad = base64.length % 4;
  const padded = pad ? base64 + '='.repeat(4 - pad) : base64;
  
  // Base64 디코딩
  return decodeURIComponent(atob(padded).split('')
    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
    .join(''));
}
