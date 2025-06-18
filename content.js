// XAI Content Script - AI Tweet Detection
console.log("🤖 XAI Extension loaded on:", window.location.href);

// Extension state
let isEnabled = true;
let sensitivityThreshold = 0.7;
let processedTweets = new Set(); // Track processed tweets to avoid duplicates
let tweetCounter = 0; // For dummy highlighting logic

// Main class for AI tweet detection
class AITweetDetector {
  constructor() {
    this.init();
  }

  async init() {
    console.log("🚀 Initializing AI Tweet Detector...");

    // Load settings from storage
    await this.loadSettings();

    // Step 2: Verify we're on Twitter/X
    if (!this.isTwitterPage()) {
      console.log("❌ Not on Twitter/X, extension will not run");
      return;
    }

    console.log("✅ Twitter page detected, starting detection...");

    // Step 3: Set up MutationObserver for new tweets
    this.setupMutationObserver();

    // Process existing tweets on page load
    this.processExistingTweets();

    // Listen for messages from popup
    this.setupMessageListener();
  }

  // Step 2: Twitter Page Detection
  isTwitterPage() {
    const hostname = window.location.hostname;
    return hostname.includes("twitter.com") || hostname.includes("x.com");
  }

  async loadSettings() {
    try {
      const result = await chrome.storage.sync.get(["enabled", "sensitivity"]);
      isEnabled = result.enabled !== false;
      sensitivityThreshold = (result.sensitivity || 70) / 100;
      console.log("⚙️ Settings loaded:", { isEnabled, sensitivityThreshold });
    } catch (error) {
      console.log("⚠️ Could not load settings, using defaults");
    }
  }

  // Step 3: MutationObserver Setup
  setupMutationObserver() {
    const observer = new MutationObserver((mutations) => {
      if (!isEnabled) return;

      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Look for tweet containers in the added nodes
            const tweets = this.findTweets(node);
            tweets.forEach((tweet) => this.processTweet(tweet));
          }
        });
      });
    });

    // Start observing the timeline container
    const timelineContainer =
      document.querySelector('[data-testid="primaryColumn"]') || document.body;
    observer.observe(timelineContainer, {
      childList: true,
      subtree: true,
    });

    console.log("👀 MutationObserver active, watching for new tweets...");
  }

  processExistingTweets() {
    console.log("🔍 Processing existing tweets on page...");
    const existingTweets = this.findTweets(document);
    existingTweets.forEach((tweet) => this.processTweet(tweet));
    console.log(`📊 Found ${existingTweets.length} existing tweets`);
  }

  // Step 3 & 4: Find and identify tweet elements
  findTweets(container) {
    // Twitter/X uses various selectors for tweets
    const tweetSelectors = [
      '[data-testid="tweet"]',
      '[data-testid="tweetText"]',
      'article[data-testid="tweet"]',
      'div[data-testid="cellInnerDiv"]',
    ];

    let tweets = [];
    tweetSelectors.forEach((selector) => {
      const elements = container.querySelectorAll
        ? container.querySelectorAll(selector)
        : container.nodeType === Node.ELEMENT_NODE &&
          container.matches(selector)
        ? [container]
        : [];

      tweets = tweets.concat(Array.from(elements));
    });

    // Filter out already processed tweets
    return tweets.filter((tweet) => {
      const tweetId = this.getTweetId(tweet);
      return tweetId && !processedTweets.has(tweetId);
    });
  }

  getTweetId(tweetElement) {
    // Generate a unique ID for the tweet based on its content or position
    const textContent = this.extractTweetText(tweetElement);
    if (!textContent) return null;

    // Use first 50 chars + element position as unique ID
    const id =
      textContent.substring(0, 50) + tweetElement.getBoundingClientRect().top;
    return btoa(id).substring(0, 20); // Base64 encode and truncate
  }

  // Step 4: Tweet Text Extraction
  extractTweetText(tweetElement) {
    // Multiple selectors to find tweet text content
    const textSelectors = [
      '[data-testid="tweetText"]',
      ".tweet-text",
      ".js-tweet-text",
      ".TweetTextSize",
      "div[lang]", // Tweet text often has lang attribute
      "span",
    ];

    for (const selector of textSelectors) {
      const textElement = tweetElement.querySelector(selector);
      if (textElement && textElement.textContent.trim().length > 10) {
        return textElement.textContent.trim();
      }
    }

    // Fallback: get all text content and filter
    const allText = tweetElement.textContent.trim();
    if (allText.length > 20 && allText.length < 1000) {
      return allText;
    }

    return null;
  }

  // Main tweet processing function
  async processTweet(tweetElement) {
    if (!isEnabled) return;

    const tweetId = this.getTweetId(tweetElement);
    if (!tweetId || processedTweets.has(tweetId)) return;

    const tweetText = this.extractTweetText(tweetElement);
    if (!tweetText) return;

    // Mark as processed
    processedTweets.add(tweetId);
    tweetCounter++;

    console.log(
      `📝 Processing Tweet #${tweetCounter}:`,
      tweetText.substring(0, 100) + "..."
    );

    // Step 5: Basic Visual Highlighting (Dummy Logic for MVP)
    // For now, we'll highlight every 3rd tweet as "AI-detected"
    const isAIDetected = this.dummyAIDetection(tweetText, tweetCounter);

    if (isAIDetected) {
      this.highlightTweet(
        tweetElement,
        isAIDetected.confidence,
        isAIDetected.type
      );
    }
  }

  // Step 5: Dummy AI Detection Logic (for testing)
  dummyAIDetection(text, counter) {
    // Dummy logic: Mark every 3rd tweet as AI with varying confidence
    if (counter % 3 === 0) {
      const confidence = 0.8 + Math.random() * 0.15; // 80-95% confidence
      return {
        confidence: confidence,
        type: confidence > 0.85 ? "high" : "medium",
      };
    }

    // Also detect tweets with certain AI-like patterns (for demo)
    const aiPatterns = [
      /as an ai/i,
      /i'm an ai/i,
      /artificial intelligence/i,
      /machine learning/i,
      /generated.*content/i,
    ];

    for (const pattern of aiPatterns) {
      if (pattern.test(text)) {
        return {
          confidence: 0.9,
          type: "high",
        };
      }
    }

    return null;
  }

  // Step 5: Visual Highlighting System
  highlightTweet(tweetElement, confidence, type) {
    console.log(
      `🚨 AI Detected! Confidence: ${(confidence * 100).toFixed(1)}% (${type})`
    );

    // Remove any existing highlights
    this.removeHighlight(tweetElement);

    // Apply border color based on confidence
    const borderColor = type === "high" ? "#ff4444" : "#ffbb33"; // Red for high, Yellow for medium
    const confidencePercent = Math.round(confidence * 100);

    // Apply styling
    tweetElement.style.border = `2px solid ${borderColor}`;
    tweetElement.style.borderRadius = "8px";
    tweetElement.style.position = "relative";

    // Add confidence badge
    const badge = document.createElement("div");
    badge.className = "xai-detection-badge";
    badge.innerHTML = `🤖 ${confidencePercent}% AI`;
    badge.style.cssText = `
      position: absolute;
      top: 8px;
      right: 8px;
      background: ${borderColor};
      color: white;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: bold;
      z-index: 1000;
      pointer-events: none;
    `;

    tweetElement.appendChild(badge);
    tweetElement.setAttribute("data-xai-detected", "true");
  }

  removeHighlight(tweetElement) {
    tweetElement.style.border = "";
    tweetElement.style.borderRadius = "";
    const existingBadge = tweetElement.querySelector(".xai-detection-badge");
    if (existingBadge) {
      existingBadge.remove();
    }
    tweetElement.removeAttribute("data-xai-detected");
  }

  // Message listener for popup communication
  setupMessageListener() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      switch (message.action) {
        case "toggleDetection":
          isEnabled = message.enabled;
          console.log("🔄 Detection toggled:", isEnabled ? "ON" : "OFF");

          if (!isEnabled) {
            // Remove all existing highlights
            document
              .querySelectorAll('[data-xai-detected="true"]')
              .forEach((tweet) => {
                this.removeHighlight(tweet);
              });
          } else {
            // Re-process visible tweets
            this.processExistingTweets();
          }
          break;

        case "updateSensitivity":
          sensitivityThreshold = message.sensitivity;
          console.log("🎛️ Sensitivity updated:", sensitivityThreshold);
          break;
      }

      sendResponse({ success: true });
    });
  }
}

// Initialize the detector when the page loads
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    new AITweetDetector();
  });
} else {
  new AITweetDetector();
}
