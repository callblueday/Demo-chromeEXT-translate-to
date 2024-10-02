import { useState, useEffect } from "react"
import "./style.css" // 我们将在后面创建这个文件

function IndexPopup() {
  const [enabled, setEnabled] = useState<boolean | null>(null)

  useEffect(() => {
    chrome.storage.local.get(['translationEnabled'], (result) => {
      setEnabled(result.translationEnabled !== false)
    })
  }, [])

  const handleToggle = () => {
    const newValue = !enabled
    setEnabled(newValue)
    chrome.storage.local.set({ translationEnabled: newValue })
  }

  if (enabled === null) {
    return <div className="loading">加载中...</div>
  }

  return (
    <div className="popup-container">
      <h1 className="title">划词翻译扩展</h1>
      <div className="toggle-container">
        <label className="toggle">
          <input
            type="checkbox"
            checked={enabled}
            onChange={handleToggle}
          />
          <span className="slider"></span>
        </label>
        <span className="toggle-label">启用划词翻译</span>
      </div>
      <p className="description">
        选中文本后自动翻译，轻松获取多语言内容的含义。
      </p>
    </div>
  )
}

export default IndexPopup
