import { formatJSON } from '../utils/jsonFormatter.js';
import { encodeBase64, decodeBase64 } from '../utils/base64Utils.js';
import { decodeJWT } from '../utils/jwtDecoder.js';
import { encodeJWT } from '../utils/jwtEncoder.js';
import { encodeURL, decodeURL } from '../utils/urlUtils.js';
import { validateInput } from '../utils/validator.js';

document.addEventListener('DOMContentLoaded', () => {
  const inputArea = document.getElementById('input');
  const outputArea = document.getElementById('output');
  const formatBtn = document.getElementById('format');
  const copyBtn = document.getElementById('copy');
  const clearBtn = document.getElementById('clear');
  const tabs = document.querySelectorAll('.tab-btn');
  const themeToggle = document.getElementById('theme-toggle');
  const modeSelector = document.querySelector('.mode-selector');
  const modeBtns = document.querySelectorAll('.mode-btn');
  
  let currentTab = 'json';
  let currentMode = 'encode';

  // 테마 설정 불러오기
  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  themeToggle.textContent = currentTheme === 'light' ? '🌙' : '☀️';

  // 테마 토글 처리
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeToggle.textContent = newTheme === 'light' ? '🌙' : '☀️';
  });

  // 탭 전환 처리
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentTab = tab.dataset.tab;
      
      // JSON 탭일 때는 모드 선택기 숨기기
      if (currentTab === 'json') {
        modeSelector.classList.remove('visible');
        formatBtn.textContent = 'Format JSON';
      } else {
        modeSelector.classList.add('visible');
        updateButtonText();
      }
      
      clearFields();
    });
  });

  // 모드 전환 처리
  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentMode = btn.dataset.mode;
      updateButtonText();
    });
  });

  // Format/Encode 버튼 클릭 처리
  formatBtn.addEventListener('click', () => {
    const input = inputArea.value;
    
    if (!input.trim()) {
      showError('Input is empty.');
      return;
    }

    // 입력값 유효성 검사
    if (currentTab === 'base64' && currentMode === 'decode') {
      const validation = validateInput(input, 'base64');
      if (!validation.isValid) {
        showError(validation.error);
        return;
      }
    } else if (currentTab === 'jwt') {
      const validation = validateInput(input, 'jwt');
      if (!validation.isValid) {
        showError(validation.error);
        return;
      }
    } else if (currentTab === 'json') {
      const validation = validateInput(input, 'json');
      if (!validation.isValid) {
        showError(validation.error);
        return;
      }
    } else if (currentTab === 'url' && currentMode === 'encode') {
      const validation = validateInput(input, 'url');
      if (!validation.isValid) {
        showError(validation.error);
        return;
      }
    }

    try {
      switch (currentTab) {
        case 'json':
          outputArea.value = formatJSON(input);
          break;
        case 'base64':
          outputArea.value = currentMode === 'encode' ? encodeBase64(input) : decodeBase64(input);
          break;
        case 'jwt':
          if (currentMode === 'encode') {
            const encoded = encodeJWT(input);
            if (encoded.error) {
              showError(encoded.error);
            } else {
              outputArea.value = encoded;
            }
          } else {
            const decoded = decodeJWT(input);
            if (decoded.error) {
              outputArea.value = decoded.error;
            } else {
              outputArea.value = 'Header:\n' + decoded.header + 
                               '\n\nPayload:\n' + decoded.payload + 
                               '\n\nSignature:\n' + decoded.signature;
            }
          }
          break;
        case 'url':
          outputArea.value = currentMode === 'encode' ? encodeURL(input) : decodeURL(input);
          break;
      }
      clearError();
    } catch (error) {
      showError(`An error occurred: ${error.message}`);
    }
  });

  // Copy 버튼 클릭 처리
  copyBtn.addEventListener('click', async () => {
    const textToCopy = outputArea.value;
    if (!textToCopy) return;

    try {
      await navigator.clipboard.writeText(textToCopy);
      
      // 복사 성공 표시
      const originalText = copyBtn.textContent;
      copyBtn.textContent = 'Copied!';
      copyBtn.classList.add('success');
      
      // 1초 후 원래 텍스트로 복귀
      setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.classList.remove('success');
      }, 1000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  });

  // Clear 버튼 클릭 처리
  clearBtn.addEventListener('click', clearFields);

  function updateButtonText() {
    switch (currentTab) {
      case 'base64':
        formatBtn.textContent = currentMode === 'encode' ? 'Encode Base64' : 'Decode Base64';
        break;
      case 'jwt':
        formatBtn.textContent = currentMode === 'encode' ? 'Encode JWT' : 'Decode JWT';
        break;
      case 'url':
        formatBtn.textContent = currentMode === 'encode' ? 'Encode URL' : 'Decode URL';
        break;
    }
  }

  function clearFields() {
    inputArea.value = '';
    outputArea.value = '';
    updateButtonText();
  }

  function showError(message) {
    outputArea.value = `❌ Error: ${message}`;
    outputArea.classList.add('error');
  }

  function clearError() {
    outputArea.classList.remove('error');
  }
});