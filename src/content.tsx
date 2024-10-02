import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

// 翻译文本的函数（需要实现）
const translateText = async (text: string): Promise<string> => {
  const apiKey = process.env.PLASMO_PUBLIC_GOOGLE_API_KEY;
  
  if (!apiKey) {
    console.error('API key is not set');
    return '翻译失败：API 密钥未设置';
  }

  const targetLanguage = 'zh'; // 目标语言，这里设置为中文

  const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        target: targetLanguage,
      }),
    });

    if (!response.ok) {
      throw new Error(`Translation request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.data.translations[0].translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return '翻译失败，请稍后再试。';
  }
};

// 创建样式
const createStyle = () => {
  const style = document.createElement('style')
  style.textContent = `
    .translation-popup {
      position: fixed;
      z-index: 9999;
      background-color: #ffffff;
      border-radius: 0.375rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
      font-size: 0.8125rem;
      width: 18rem;
      color: #374151;
      display: flex;
      flex-direction: column;
    }
    .translation-content {
      padding: 0.75rem 1rem;
      min-height: 2.5rem;
      max-height: 10rem;
      overflow-y: auto;
      line-height: 1.5;
    }
    .translation-actions {
      padding: 0.5rem;
      border-top: 1px solid #e5e7eb;
      display: flex;
      justify-content: flex-end;
    }
    .copy-button {
      background-color: #f3f4f6;
      color: #6b7280;
      padding: 0.25rem 0.75rem;
      font-size: 0.75rem;
      font-weight: 500;
      border-radius: 0.25rem;
      cursor: pointer;
      transition: background-color 150ms ease-in-out, color 150ms ease-in-out;
      border: none;
      outline: none;
    }
    .copy-button:hover {
      background-color: #e5e7eb;
      color: #4b5563;
    }
    .translation-popup .loading {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 2.5rem;
    }
    .translation-popup .loading::after {
      content: '';
      width: 1.25rem;
      height: 1.25rem;
      border: 2px solid #e5e7eb;
      border-top: 2px solid #9ca3af;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `
  document.head.appendChild(style)
}

// 显示翻译弹窗
const showTranslationPopup = async (text: string, x: number, y: number) => {
  // 移除现有的弹窗
  const existingPopup = document.querySelector('.translation-popup')
  if (existingPopup) {
    existingPopup.remove()
  }

  const popup = document.createElement('div')
  popup.className = 'translation-popup'
  
  const contentDiv = document.createElement('div')
  contentDiv.className = 'translation-content'
  
  const loadingDiv = document.createElement('div')
  loadingDiv.className = 'loading'
  contentDiv.appendChild(loadingDiv)
  
  const actionsDiv = document.createElement('div')
  actionsDiv.className = 'translation-actions'
  
  const copyButton = document.createElement('button')
  copyButton.className = 'copy-button'
  copyButton.textContent = '复制'
  actionsDiv.appendChild(copyButton)
  
  popup.appendChild(contentDiv)
  popup.appendChild(actionsDiv)
  
  document.body.appendChild(popup)

  // 计算弹窗位置
  const popupRect = popup.getBoundingClientRect()
  const leftPosition = Math.min(x, window.innerWidth - popupRect.width)
  const topPosition = Math.min(y + 10, window.innerHeight - popupRect.height)
  popup.style.left = `${leftPosition}px`
  popup.style.top = `${topPosition}px`

  const translatedText = await translateText(text)
  contentDiv.textContent = translatedText

  // 复制功能
  copyButton.addEventListener('click', () => {
    navigator.clipboard.writeText(translatedText).then(() => {
      copyButton.textContent = '已复制'
      setTimeout(() => {
        copyButton.textContent = '复制'
      }, 2000)
    })
  })

  // 阻止弹窗内的选择事件冒泡
  popup.addEventListener('mouseup', (e) => {
    e.stopPropagation()
  })

  // 添加点击事件监听器来关闭弹窗
  const closePopup = (e: MouseEvent) => {
    if (!popup.contains(e.target as Node)) {
      popup.remove()
      document.removeEventListener('mousedown', closePopup)
    }
  }
  
  // 延添加事件监听器，以防止弹窗立即关闭
  setTimeout(() => {
    document.addEventListener('mousedown', closePopup)
  }, 0)
}

const ContentScript = () => {
  const [enabled, setEnabled] = useState<boolean | null>(null)

  useEffect(() => {
    const loadSettings = () => {
      chrome.storage.local.get(['translationEnabled'], (result) => {
        setEnabled(result.translationEnabled !== false)
      })
    }

    loadSettings()
    
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'local' && 'translationEnabled' in changes) {
        setEnabled(changes.translationEnabled.newValue !== false)
      }
    })
  }, [])

  useEffect(() => {
    if (enabled === null || !enabled) return

    createStyle()

    const handleMouseUp = (event: MouseEvent) => {
      const selection = window.getSelection()
      const selectedText = selection?.toString().trim()
      if (selectedText) {
        const range = selection?.getRangeAt(0)
        const rect = range?.getBoundingClientRect()
        if (rect) {
          showTranslationPopup(selectedText, rect.left, rect.bottom)
        }
      }
    }

    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [enabled])

  return null
}

export default ContentScript