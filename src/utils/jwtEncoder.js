export function encodeJWT(input) {
  try {
    // JSON 문자열을 객체로 파싱
    const payload = JSON.parse(input);
    
    // 기본 헤더
    const header = {
      alg: "HS256",
      typ: "JWT"
    };

    // Base64Url 인코딩
    const encodedHeader = btoa(JSON.stringify(header))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
    
    const encodedPayload = btoa(JSON.stringify(payload))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    // 테스트용 서명 (실제로는 서버에서 비밀키로 생성해야 함)
    const signature = 'DEMO_SIGNATURE';
    
    return `${encodedHeader}.${encodedPayload}.${signature}`;
  } catch (e) {
    return { error: 'Failed to encode JWT: ' + e.message };
  }
}
