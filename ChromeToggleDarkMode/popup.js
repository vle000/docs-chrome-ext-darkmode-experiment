const toggle = document.getElementById("toggle");

chrome.storage.sync.get(["darkEnabled"], (result) => {
  toggle.checked = result.darkEnabled || false;
});

toggle.addEventListener("change", () => {
    chrome.storage.sync.set({ darkEnabled: toggle.checked });

    chrome.runtime.sendMessage({
        action: "toggle-dark",
        enabled: toggle.checked
    });
});
