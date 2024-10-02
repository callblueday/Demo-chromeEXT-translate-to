import { useState, useEffect } from "react"
import { Storage } from "@plasmohq/storage"

export function Main() {
  const [isEnabled, setIsEnabled] = useState(true)
  const storage = new Storage()

  useEffect(() => {
    storage.get("translationEnabled").then((value) => {
      setIsEnabled(value !== undefined ? value : true)
    })

    document.addEventListener("mouseup", handleSelection)
    document.addEventListener("click", handleClickOutside)
    return () => {
      document.removeEventListener("mouseup", handleSelection)
      document.removeEventListener("click", handleClickOutside)
    }
  }, [])

  const handleSelection = async () => {
    if (!isEnabled) return
    const selectedText = window.getSelection().toString().trim()
    if (selectedText) {
      const translation = await translateText(selectedText)
      showTranslationPopup(translation)
    }
  }

  const translateText = async (text) => {
    // 这里应该实现实际的翻译逻辑
    // 现在我们只返回一个模拟的翻译结果
    return `翻译: ${text}`
  }

  const showTranslationPopup = (translation) => {
    const selection = window.getSelection()
    const range = selection.getRangeAt(0)
    const rect = range.getBoundingClientRect()

    const popup = document.createElement('div')
    popup.textContent = translation
    popup.style.position = 'absolute'
    popup.style.left = `${rect.left + window.scrollX}px`
    popup.style.top = `${rect.top + window.scrollY - 30}px`
    popup.style.backgroundColor = 'white'
    popup.style.border = '1px solid black'
    popup.style.padding = '5px'
    popup.style.borderRadius = '3px'
    popup.style.zIndex = '10000'

    document.body.appendChild(popup)

    // 3秒后移除弹窗
    setTimeout(() => {
      document.body.removeChild(popup)
    }, 3000)
  }

  const handleClickOutside = (event) => {
    const popups = document.querySelectorAll('div[style*="position: absolute"]')
    popups.forEach(popup => {
      if (!popup.contains(event.target)) {
        document.body.removeChild(popup)
      }
    })
  }

  const toggleTranslation = () => {
    const newValue = !isEnabled
    setIsEnabled(newValue)
    storage.set("translationEnabled", newValue)
  }

  return (
    <div className="popup-container">
      <h1 className="title">划词翻译扩展</h1>
      <div className="content">
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={toggleTranslation}
            className="toggle-input"
          />
          <span className="toggle-slider"></span>
          启用划词翻译
        </label>
        <p className="description">
          选中文本后自动翻译，轻松获取多语言内容的含义。
        </p>
      </div>
      <style jsx>{`
        .popup-container {
          width: 300px;
          padding: 20px;
          font-family: Arial, sans-serif;
          background-color: #f0f0f0;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .title {
          font-size: 24px;
          color: #333;
          margin-bottom: 20px;
          text-align: center;
        }
        .content {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .toggle-label {
          display: flex;
          align-items: center;
          cursor: pointer;
          font-size: 16px;
        }
        .toggle-input {
          display: none;
        }
        .toggle-slider {
          width: 50px;
          height: 24px;
          background-color: #ccc;
          border-radius: 34px;
          margin-right: 10px;
          position: relative;
          transition: 0.4s;
        }
        .toggle-slider:before {
          content: "";
          position: absolute;
          height: 20px;
          width: 20px;
          left: 2px;
          bottom: 2px;
          background-color: white;
          border-radius: 50%;
          transition: 0.4s;
        }
        .toggle-input:checked + .toggle-slider {
          background-color: #2196F3;
        }
        .toggle-input:checked + .toggle-slider:before {
          transform: translateX(26px);
        }
        .description {
          margin-top: 20px;
          text-align: center;
          color: #666;
          font-size: 14px;
        }
      `}</style>
    </div>
  )
}
