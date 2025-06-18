// Popup script for XAI Chrome Extension
document.addEventListener("DOMContentLoaded", function () {
  const enableToggle = document.getElementById("enableToggle");
  const sensitivitySlider = document.getElementById("sensitivity");
  const sensitivityValue = document.getElementById("sensitivityValue");
  const status = document.getElementById("status");

  // Load saved settings
  chrome.storage.sync.get(["enabled", "sensitivity"], function (result) {
    enableToggle.checked = result.enabled !== false; // default to true
    sensitivitySlider.value = result.sensitivity || 70;
    sensitivityValue.textContent = (result.sensitivity || 70) + "%";
    updateStatus();
  });

  // Handle enable/disable toggle
  enableToggle.addEventListener("change", function () {
    const enabled = enableToggle.checked;
    chrome.storage.sync.set({ enabled: enabled });
    updateStatus();

    // Send message to content script
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "toggleDetection",
        enabled: enabled,
      });
    });
  });

  // Handle sensitivity slider
  sensitivitySlider.addEventListener("input", function () {
    const value = parseInt(sensitivitySlider.value);
    sensitivityValue.textContent = value + "%";
    chrome.storage.sync.set({ sensitivity: value });

    // Send message to content script
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "updateSensitivity",
        sensitivity: value / 100, // Convert to decimal
      });
    });
  });

  function updateStatus() {
    if (enableToggle.checked) {
      status.textContent = "Detection Active";
      status.className = "status enabled";
    } else {
      status.textContent = "Detection Disabled";
      status.className = "status disabled";
    }
  }
});
