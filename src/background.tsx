chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get(['translationEnabled'], (result) => {
      if (result.translationEnabled === undefined) {
        chrome.storage.local.set({ translationEnabled: true })
      }
    })
  })