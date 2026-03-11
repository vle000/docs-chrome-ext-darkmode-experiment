function applyDarkMode(tabId, enabled) {
  if (!tabId) return;

  if (enabled) {
    chrome.scripting.insertCSS({
      target: { tabId },
      files: ["dark.css"]
    });
  } else {
    chrome.scripting.removeCSS({
      target: { tabId },
      files: ["dark.css"]
    });
  }
}

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.action !== "toggle-dark") return;

  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    if (!tab?.id) return;
    applyDarkMode(tab.id, message.enabled);
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status !== "complete") return;

  chrome.storage.sync.get("darkEnabled", ({ darkEnabled }) => {
    if (darkEnabled) {
      applyDarkMode(tabId, true);
    }
  });
});