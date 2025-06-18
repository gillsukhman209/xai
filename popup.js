// Popup functionality for AI Tweet Detector extension

document.addEventListener("DOMContentLoaded", async () => {
  // Get DOM elements
  const enableDetection = document.getElementById("enableDetection");
  const confidenceThreshold = document.getElementById("confidenceThreshold");
  const thresholdValue = document.getElementById("thresholdValue");
  const showConfidence = document.getElementById("showConfidence");
  const tweetsAnalyzed = document.getElementById("tweetsAnalyzed");
  const aiDetected = document.getElementById("aiDetected");
  const resetStats = document.getElementById("resetStats");

  // Load saved settings
  const settings = await chrome.storage.sync.get({
    enabled: true,
    threshold: 70,
    showConfidence: true,
  });

  // Load stats
  const stats = await chrome.storage.local.get({
    tweetsAnalyzed: 0,
    aiDetected: 0,
  });

  // Initialize UI with saved values
  enableDetection.checked = settings.enabled;
  confidenceThreshold.value = settings.threshold;
  thresholdValue.textContent = settings.threshold + "%";
  showConfidence.checked = settings.showConfidence;
  tweetsAnalyzed.textContent = stats.tweetsAnalyzed;
  aiDetected.textContent = stats.aiDetected;

  // Save settings when changed
  enableDetection.addEventListener("change", async () => {
    await chrome.storage.sync.set({ enabled: enableDetection.checked });
    notifyContentScript();
  });

  confidenceThreshold.addEventListener("input", async () => {
    const value = parseInt(confidenceThreshold.value);
    thresholdValue.textContent = value + "%";
    await chrome.storage.sync.set({ threshold: value });
    notifyContentScript();
  });

  showConfidence.addEventListener("change", async () => {
    await chrome.storage.sync.set({ showConfidence: showConfidence.checked });
    notifyContentScript();
  });

  // Reset stats
  resetStats.addEventListener("click", async () => {
    await chrome.storage.local.set({
      tweetsAnalyzed: 0,
      aiDetected: 0,
    });
    tweetsAnalyzed.textContent = "0";
    aiDetected.textContent = "0";
    notifyContentScript();
  });

  // Update stats in real-time
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === "local") {
      if (changes.tweetsAnalyzed) {
        tweetsAnalyzed.textContent = changes.tweetsAnalyzed.newValue;
      }
      if (changes.aiDetected) {
        aiDetected.textContent = changes.aiDetected.newValue;
      }
    }
  });

  // Notify content script of settings changes
  async function notifyContentScript() {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      if (
        tab &&
        (tab.url.includes("twitter.com") || tab.url.includes("x.com"))
      ) {
        chrome.tabs.sendMessage(tab.id, {
          type: "SETTINGS_UPDATED",
          settings: await chrome.storage.sync.get([
            "enabled",
            "threshold",
            "showConfidence",
          ]),
        });
      }
    } catch (error) {
      console.log("Content script not ready:", error);
    }
  }
});
