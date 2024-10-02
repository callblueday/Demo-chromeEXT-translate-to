import { useState, useEffect } from "react"
import { Storage } from "@plasmohq/storage"

const storage = new Storage()

function OptionsPage() {
  const [enabled, setEnabled] = useState(true)

  useEffect(() => {
    storage.get("translationEnabled").then((value) => {
      setEnabled(value !== false)
    })
  }, [])

  const handleToggle = async () => {
    const newValue = !enabled
    setEnabled(newValue)
    await storage.set("translationEnabled", newValue)
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">划词翻译设置</h1>
      <label className="flex items-center cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            className="sr-only"
            checked={enabled}
            onChange={handleToggle}
          />
          <div className={`block w-14 h-8 rounded-full ${enabled ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
          <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition ${enabled ? 'transform translate-x-6' : ''}`}></div>
        </div>
        <div className="ml-3 font-medium">
          启用划词翻译
        </div>
      </label>
    </div>
  )
}

export default OptionsPage