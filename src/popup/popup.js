import { formatJSON } from '../utils/jsonFormatter.js';
import { encodeBase64, decodeBase64 } from '../utils/base64Utils.js';
import { decodeJWT } from '../utils/jwtDecoder.js';
import { encodeURL, decodeURL } from '../utils/urlEncoder.js';

document.addEventListener('DOMContentLoaded', () => {
  const inputArea = document.getElementById('input');
  const outputArea = document.getElementById('output');
  const formatBtn = document.getElementById('format');
  const clearBtn = document.getElementById('clear');
  const tabs = document.querySelectorAll('.tab-btn');
  
  let currentTab = 'json';

  // 탭 전환 처리
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentTab = tab.dataset.tab;
      
      // 탭에 따라 버튼 텍스트 변경
      switch (currentTab) {
        case 'json':
          formatBtn.textContent = 'Format JSON';
          break;
        case 'base64':
          formatBtn.textContent = 'Encode Base64';
          break;
        case 'jwt':
          formatBtn.textContent = 'Decode JWT';
          break;
        case 'url':
          formatBtn.textContent = 'Encode URL';
          break;
      }
      
      // 입력값 초기화
      clearFields();
    });
  });

  // Format/Encode 버튼 클릭 처리
  formatBtn.addEventListener('click', () => {
    const input = inputArea.value;
    
    if (!input.trim()) {
      outputArea.value = '';
      return;
    }

    switch (currentTab) {
      case 'json':
        outputArea.value = formatJSON(input);
        break;
      case 'base64':
        if (formatBtn.textContent === 'Encode Base64') {
          outputArea.value = encodeBase64(input);
          formatBtn.textContent = 'Decode Base64';
        } else {
          outputArea.value = decodeBase64(input);
          formatBtn.textContent = 'Encode Base64';
        }
        break;
      case 'jwt':
        const decoded = decodeJWT(input);
        if (decoded.error) {
          outputArea.value = decoded.error;
        } else {
          outputArea.value = 'Header:\n' + decoded.header + 
                           '\n\nPayload:\n' + decoded.payload + 
                           '\n\nSignature:\n' + decoded.signature;
        }
        break;
        case 'url':
          if (formatBtn.textContent === 'Encode URL') {
            outputArea.value = encodeURL(input);
            formatBtn.textContent = 'Decode URL';
          } else {
            outputArea.value = decodeURL(input);
            formatBtn.textContent = 'Encode URL';
          }
          break;
    }
  });

  // Clear 버튼 클릭 처리
  clearBtn.addEventListener('click', clearFields);

  function clearFields() {
    inputArea.value = '';
    outputArea.value = '';
    // 현재 탭에 따라 버튼 텍스트 초기화
    switch (currentTab) {
      case 'json':
        formatBtn.textContent = 'Format JSON';
        break;
      case 'base64':
        formatBtn.textContent = 'Encode Base64';
        break;
      case 'jwt':
        formatBtn.textContent = 'Decode JWT';
        break;
      case 'url':
        formatBtn.textContent = 'Encode URL';
        break;
    }
  }
});