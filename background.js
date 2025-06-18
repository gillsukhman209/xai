// Background service worker for XAI Chrome Extension
console.log("XAI Background Service Worker loaded");

// Initialize extension settings
chrome.runtime.onInstalled.addListener(() => {
  console.log("XAI Extension installed");

  // Set default settings
  chrome.storage.sync.set({
    enabled: true,
    sensitivity: 0.7, // 70% confidence threshold
  });
});

// Handle extension icon click (if needed)
chrome.action.onClicked.addListener((tab) => {
  console.log("XAI Extension icon clicked", tab.url);
});
