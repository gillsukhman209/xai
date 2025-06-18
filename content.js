// AI Tweet Detector - Content Script
// Detects AI-generated content on Twitter in real-time

class AITweetDetector {
  constructor() {
    this.settings = {
      enabled: true,
      threshold: 70,
      showConfidence: true,
    };
    this.stats = {
      tweetsAnalyzed: 0,
      aiDetected: 0,
    };
    this.processedTweets = new Set();
    this.observer = null;
    this.isInitialized = false;

    this.init();
  }

  async init() {
    console.log("🤖 AI Tweet Detector initializing...");

    // Load settings and stats
    await this.loadSettings();
    await this.loadStats();

    // Wait for page to be ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.start());
    } else {
      this.start();
    }

    // Listen for messages from popup
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === "SETTINGS_UPDATED") {
        this.settings = message.settings;
        this.updateUIState();
      }
    });

    this.isInitialized = true;
  }

  async loadSettings() {
    const stored = await chrome.storage.sync.get({
      enabled: true,
      threshold: 70,
      showConfidence: true,
    });
    this.settings = stored;
  }

  async loadStats() {
    const stored = await chrome.storage.local.get({
      tweetsAnalyzed: 0,
      aiDetected: 0,
    });
    this.stats = stored;
  }

  start() {
    console.log("🚀 Starting AI Tweet Detector...");

    // Set up mutation observer to watch for new tweets
    this.setupMutationObserver();

    // Process existing tweets on page
    this.processExistingTweets();

    // Update UI based on current settings
    this.updateUIState();

    console.log("✅ AI Tweet Detector started successfully");
  }

  setupMutationObserver() {
    // Clean up existing observer
    if (this.observer) {
      this.observer.disconnect();
    }

    this.observer = new MutationObserver((mutations) => {
      if (!this.settings.enabled) return;

      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Look for tweet containers
            const tweets = this.findTweetsInNode(node);
            tweets.forEach((tweet) => this.processTweet(tweet));
          }
        });
      });
    });

    // Start observing
    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  findTweetsInNode(node) {
    const tweets = [];

    // Twitter/X uses various selectors for tweets
    const tweetSelectors = [
      '[data-testid="tweet"]',
      'article[data-testid="tweet"]',
      '[data-testid="tweetText"]',
    ];

    tweetSelectors.forEach((selector) => {
      // Check if the node itself is a tweet
      if (node.matches && node.matches(selector)) {
        tweets.push(node);
      }
      // Find tweets within the node
      const foundTweets = node.querySelectorAll
        ? node.querySelectorAll(selector)
        : [];
      tweets.push(...foundTweets);
    });

    return tweets;
  }

  processExistingTweets() {
    const tweets = this.findTweetsInNode(document);
    console.log(`📝 Found ${tweets.length} existing tweets to process`);
    tweets.forEach((tweet) => this.processTweet(tweet));
  }

  async processTweet(tweetElement) {
    // Generate unique ID for tweet
    const tweetId = this.getTweetId(tweetElement);
    if (!tweetId || this.processedTweets.has(tweetId)) {
      return;
    }

    this.processedTweets.add(tweetId);

    // Extract tweet text
    const tweetText = this.extractTweetText(tweetElement);
    if (!tweetText || tweetText.length < 10) {
      return; // Skip very short tweets
    }

    console.log(`🔍 Processing tweet: "${tweetText.substring(0, 50)}..."`);

    // Add analyzing state
    this.addAnalyzingState(tweetElement);

    try {
      // TODO: Replace with actual AI model prediction
      const prediction = await this.analyzeWithAI(tweetText);

      // Update stats
      await this.updateStats("analyzed");

      // Apply visual indicators based on prediction
      if (prediction.isAI && prediction.confidence >= this.settings.threshold) {
        this.markAsAI(tweetElement, prediction.confidence);
        await this.updateStats("aiDetected");
      } else {
        this.markAsHuman(tweetElement, prediction.confidence);
      }
    } catch (error) {
      console.error("❌ Error analyzing tweet:", error);
    } finally {
      this.removeAnalyzingState(tweetElement);
    }
  }

  getTweetId(tweetElement) {
    // Try to get tweet ID from various attributes
    const link = tweetElement.querySelector('a[href*="/status/"]');
    if (link) {
      const match = link.href.match(/\/status\/(\d+)/);
      if (match) return match[1];
    }

    // Fallback: use text content hash
    const text = this.extractTweetText(tweetElement);
    return text ? this.hashCode(text) : null;
  }

  extractTweetText(tweetElement) {
    // Look for tweet text in various selectors
    const textSelectors = [
      '[data-testid="tweetText"]',
      ".tweet-text",
      ".js-tweet-text",
      ".TweetTextSize",
    ];

    for (const selector of textSelectors) {
      const textElement = tweetElement.querySelector(selector);
      if (textElement) {
        return textElement.textContent.trim();
      }
    }

    return null;
  }

  async analyzeWithAI(text) {
    // TODO: Implement actual TensorFlow.js model prediction
    // For now, return mock prediction for testing
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate processing time

    // Mock prediction logic (replace with real model)
    const mockConfidence = Math.random() * 100;
    const isAI = mockConfidence > 60; // Mock threshold

    return {
      isAI,
      confidence: mockConfidence,
    };
  }

  markAsAI(tweetElement, confidence) {
    console.log(
      `🤖 Marking tweet as AI-generated (${confidence.toFixed(1)}% confidence)`
    );

    // Add AI detection classes
    tweetElement.classList.add("ai-detected-tweet");

    // Add AI badge
    this.addAIBadge(tweetElement, confidence);
  }

  markAsHuman(tweetElement, confidence) {
    console.log(
      `👤 Tweet marked as human (${confidence.toFixed(1)}% confidence)`
    );
    tweetElement.classList.add("human-detected-tweet");
  }

  addAIBadge(tweetElement, confidence) {
    // Remove existing badge
    const existingBadge = tweetElement.querySelector(".ai-detector-badge");
    if (existingBadge) existingBadge.remove();

    // Create new badge
    const badge = document.createElement("div");
    badge.className = "ai-detector-badge new-detection";
    badge.textContent = "AI";

    // Add confidence tooltip if enabled
    if (this.settings.showConfidence) {
      badge.addEventListener("mouseenter", (e) => {
        this.showConfidenceTooltip(e.target, confidence);
      });
      badge.addEventListener("mouseleave", () => {
        this.hideConfidenceTooltip();
      });
    }

    // Insert badge
    tweetElement.style.position = "relative";
    tweetElement.appendChild(badge);
  }

  addAnalyzingState(tweetElement) {
    tweetElement.classList.add("ai-analyzing");
  }

  removeAnalyzingState(tweetElement) {
    tweetElement.classList.remove("ai-analyzing");
  }

  showConfidenceTooltip(badgeElement, confidence) {
    // Remove existing tooltip
    this.hideConfidenceTooltip();

    const tooltip = document.createElement("div");
    tooltip.className = "ai-confidence-tooltip";
    tooltip.textContent = `${confidence.toFixed(
      1
    )}% confident this is AI-generated`;

    document.body.appendChild(tooltip);

    // Position tooltip
    const badgeRect = badgeElement.getBoundingClientRect();
    tooltip.style.left =
      badgeRect.left + badgeRect.width / 2 - tooltip.offsetWidth / 2 + "px";
    tooltip.style.top = badgeRect.top - tooltip.offsetHeight - 10 + "px";

    // Show tooltip
    setTimeout(() => tooltip.classList.add("show"), 10);

    this.currentTooltip = tooltip;
  }

  hideConfidenceTooltip() {
    if (this.currentTooltip) {
      this.currentTooltip.remove();
      this.currentTooltip = null;
    }
  }

  async updateStats(type) {
    if (type === "analyzed") {
      this.stats.tweetsAnalyzed++;
    } else if (type === "aiDetected") {
      this.stats.aiDetected++;
    }

    await chrome.storage.local.set(this.stats);
  }

  updateUIState() {
    // Toggle extension state on page
    if (this.settings.enabled) {
      document.body.classList.remove("ai-detector-disabled");
    } else {
      document.body.classList.add("ai-detector-disabled");
    }
  }

  hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.hideConfidenceTooltip();
    console.log("🛑 AI Tweet Detector destroyed");
  }
}

// Initialize the detector when script loads
let detector;

if (
  window.location.hostname.includes("twitter.com") ||
  window.location.hostname.includes("x.com")
) {
  detector = new AITweetDetector();
}

// Clean up on page unload
window.addEventListener("beforeunload", () => {
  if (detector) {
    detector.destroy();
  }
});
