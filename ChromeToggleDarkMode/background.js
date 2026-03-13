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

function isGoogleDocs(url) {
  return url && url.startsWith("https://docs.google.com/document/u/");
}

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.action !== "toggle-dark") return;

  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    if (!tab?.id || !isGoogleDocs(tab.url)) return;
    applyDarkMode(tab.id, message.enabled);
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete") return;
  if (!isGoogleDocs(tab.url)) return;

  chrome.storage.sync.get("darkEnabled", ({ darkEnabled }) => {
    if (darkEnabled) {
      applyDarkMode(tabId, true);
    }
  });
});