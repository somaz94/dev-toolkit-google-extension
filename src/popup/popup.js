import { formatJSON, minifyJSON } from '../utils/jsonFormatter.js';
import { encodeBase64, decodeBase64 } from '../utils/base64Utils.js';
import { decodeJWT } from '../utils/jwtDecoder.js';
import { encodeJWT } from '../utils/jwtEncoder.js';
import { encodeURL, decodeURL } from '../utils/urlUtils.js';
import { timestampToDate, dateToTimestamp } from '../utils/timestampUtils.js';
import { generateHash } from '../utils/hashUtils.js';
import { generateUUID } from '../utils/uuidUtils.js';
import { convertColor } from '../utils/colorUtils.js';
import { computeDiff } from '../utils/diffUtils.js';
import { validateInput } from '../utils/validator.js';
import { applyTranslations, t } from '../i18n.js';

document.addEventListener('DOMContentLoaded', () => {
  applyTranslations();

  const inputArea = document.getElementById('input');
  const outputArea = document.getElementById('output');
  const formatBtn = document.getElementById('format');
  const copyBtn = document.getElementById('copy');
  const clearBtn = document.getElementById('clear');
  const tabs = document.querySelectorAll('.tab-btn');
  const themeToggle = document.getElementById('theme-toggle');
  const modeSelector = document.querySelector('.mode-selector');
  const modeBtns = document.querySelectorAll('.mode-btn');
  const jsonOptions = document.querySelector('.json-options');
  const jsonIndent = document.getElementById('json-indent');
  const minifyBtn = document.getElementById('minify');

  let currentTab = 'json';
  let currentMode = 'encode';
  const MAX_HISTORY = 5;

  // 히스토리 저장
  function saveHistory(tab, input) {
    if (!input.trim()) return;
    const key = `history_${tab}`;
    let history = JSON.parse(localStorage.getItem(key) || '[]');
    // 중복 제거 후 앞에 추가
    history = history.filter(h => h !== input);
    history.unshift(input);
    if (history.length > MAX_HISTORY) history = history.slice(0, MAX_HISTORY);
    localStorage.setItem(key, JSON.stringify(history));
  }

  // 마지막 입력 복원
  function loadLastInput(tab) {
    const key = `history_${tab}`;
    const history = JSON.parse(localStorage.getItem(key) || '[]');
    return history.length > 0 ? history[0] : '';
  }

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
      tabs.forEach(other => other.classList.remove('active'));
      tab.classList.add('active');
      currentTab = tab.dataset.tab;
      
      // JSON 탭일 때는 모드 선택기 숨기기
      // JSON 옵션 표시/숨김
      jsonOptions.style.display = currentTab === 'json' ? 'flex' : 'none';

      if (currentTab === 'json') {
        modeSelector.classList.remove('visible');
        formatBtn.textContent = t('actionFormatJson');
      } else if (currentTab === 'hash') {
        modeSelector.classList.remove('visible');
        formatBtn.textContent = t('actionGenerateHash');
      } else if (currentTab === 'uuid') {
        modeSelector.classList.remove('visible');
        formatBtn.textContent = t('actionGenerateUuid');
      } else if (currentTab === 'color') {
        modeSelector.classList.remove('visible');
        formatBtn.textContent = t('actionConvertColor');
      } else if (currentTab === 'diff') {
        modeSelector.classList.remove('visible');
        formatBtn.textContent = t('actionCompare');
      } else if (currentTab === 'timestamp') {
        modeSelector.classList.add('visible');
        // timestamp 탭: encode = Date→Timestamp, decode = Timestamp→Date
        modeBtns[0].textContent = t('modeToTimestamp');
        modeBtns[1].textContent = t('modeToDate');
        updateButtonText();
      } else {
        modeSelector.classList.add('visible');
        modeBtns[0].textContent = t('modeEncode');
        modeBtns[1].textContent = t('modeDecode');
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
      updatePlaceholder();
    });
  });

  // Format/Encode 버튼 클릭 처리
  formatBtn.addEventListener('click', async () => {
    const input = inputArea.value;
    
    if (!input.trim() && currentTab !== 'uuid') {
      showError(t('errorEmpty'));
      return;
    }

    // 대용량 입력 제한 (5MB)
    if (input.length > 5 * 1024 * 1024) {
      showError(t('errorTooLarge'));
      return;
    }

    // 히스토리 저장
    if (input.trim()) saveHistory(currentTab, input);

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
        case 'json': {
          const indent = jsonIndent.value === 'tab' ? 'tab' : parseInt(jsonIndent.value);
          outputArea.value = formatJSON(input, indent);
          break;
        }
        case 'base64':
          outputArea.value = currentMode === 'encode' ? encodeBase64(input) : decodeBase64(input);
          break;
        case 'jwt':
          if (currentMode === 'encode') {
            const encoded = await encodeJWT(input);
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
        case 'timestamp':
          outputArea.value = currentMode === 'encode' ? dateToTimestamp(input) : timestampToDate(input);
          break;
        case 'hash':
          outputArea.value = await generateHash(input);
          break;
        case 'uuid':
          outputArea.value = generateUUID(input);
          break;
        case 'color':
          outputArea.value = convertColor(input);
          break;
        case 'diff':
          outputArea.value = computeDiff(input);
          break;
      }
      clearError();
    } catch (error) {
      showError(t('errorUnexpected', error.message));
    }
  });

  // Copy 버튼 클릭 처리
  copyBtn.addEventListener('click', async () => {
    const textToCopy = outputArea.value;
    if (!textToCopy) return;

    try {
      await navigator.clipboard.writeText(textToCopy);
      showToast(t('copied'));
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  });

  // Minify 버튼 클릭 처리
  minifyBtn.addEventListener('click', () => {
    const input = inputArea.value;
    if (!input.trim()) {
      showError(t('errorEmpty'));
      return;
    }
    try {
      outputArea.value = minifyJSON(input);
      clearError();
    } catch (e) {
      showError(e.message);
    }
  });

  // Clear 버튼 클릭 처리
  clearBtn.addEventListener('click', () => clearFields(false));

  // 키보드 단축키
  document.addEventListener('keydown', (e) => {
    // Ctrl+Enter or Cmd+Enter: 변환 실행
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      formatBtn.click();
    }
    // Ctrl+Shift+C: 결과 복사
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
      e.preventDefault();
      copyBtn.click();
    }
    // Alt+1~9: 탭 전환
    if (e.altKey && e.key >= '1' && e.key <= '9') {
      e.preventDefault();
      const idx = parseInt(e.key) - 1;
      if (idx < tabs.length) {
        tabs[idx].click();
      }
    }
  });

  function updateButtonText() {
    switch (currentTab) {
      case 'base64':
        formatBtn.textContent = currentMode === 'encode' ? t('actionEncodeBase64') : t('actionDecodeBase64');
        break;
      case 'jwt':
        formatBtn.textContent = currentMode === 'encode' ? t('actionEncodeJwt') : t('actionDecodeJwt');
        break;
      case 'url':
        formatBtn.textContent = currentMode === 'encode' ? t('actionEncodeUrl') : t('actionDecodeUrl');
        break;
      case 'timestamp':
        formatBtn.textContent = currentMode === 'encode' ? t('actionDateToTimestamp') : t('actionTimestampToDate');
        break;
    }
  }

  function clearFields(restoreHistory = true) {
    inputArea.value = restoreHistory ? loadLastInput(currentTab) : '';
    outputArea.value = '';
    updateButtonText();
    updatePlaceholder();
  }

  function updatePlaceholder() {
    if (currentTab === 'timestamp') {
      inputArea.placeholder = currentMode === 'encode' ? t('placeholderDate') : t('placeholderTimestamp');
    } else if (currentTab === 'hash') {
      inputArea.placeholder = t('placeholderHash');
    } else if (currentTab === 'uuid') {
      inputArea.placeholder = t('placeholderUuid');
    } else if (currentTab === 'color') {
      inputArea.placeholder = t('placeholderColor');
    } else if (currentTab === 'diff') {
      inputArea.placeholder = t('placeholderDiff');
    } else {
      inputArea.placeholder = t('inputPlaceholder');
    }
  }

  function showError(message) {
    outputArea.value = t('errorLine', message);
    outputArea.classList.add('error');
  }

  function clearError() {
    outputArea.classList.remove('error');
  }

  function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.querySelector('.container').appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 1500);
  }
});