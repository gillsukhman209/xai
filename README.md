# XAI - AI Content Detector (Steps 1-5 Complete)

Chrome extension that detects AI-generated content on Twitter/X in real-time.

## 🚀 Features Implemented (Steps 1-5)

✅ **Step 1: Basic Chrome Extension Setup**

- Chrome extension manifest v3
- Background service worker
- Settings popup interface

✅ **Step 2: Twitter Page Detection & Injection**

- Content script runs only on Twitter/X domains
- Automatic injection when visiting twitter.com or x.com

✅ **Step 3: Tweet Detection with MutationObserver**

- Real-time detection of new tweets as they load
- Processes existing tweets on page load
- Avoids duplicate processing

✅ **Step 4: Tweet Text Extraction**

- Extracts text content from various tweet formats
- Handles different Twitter DOM structures
- Filters out non-tweet content

✅ **Step 5: Basic Visual Highlighting**

- **Red border + badge** for high confidence AI detection (>85%)
- **Yellow border + badge** for medium confidence AI detection (70-85%)
- Dummy logic: Every 3rd tweet + AI-related keywords

## 🧪 How to Test

### 1. Load Extension in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select this `xai` folder
5. Extension should appear in your extensions list

### 2. Test on Twitter

1. Go to [twitter.com](https://twitter.com) or [x.com](https://x.com)
2. Open Developer Console (F12)
3. Look for console messages starting with 🤖
4. You should see tweets being processed as you scroll

### 3. Test Visual Highlighting

- Every 3rd tweet should get highlighted with red/yellow border
- Tweets containing "AI", "artificial intelligence", etc. should be highlighted
- Look for 🤖 badges showing confidence percentages

### 4. Test Settings Popup

1. Click the extension icon in Chrome toolbar
2. Toggle "Enable Detection" on/off
3. Adjust sensitivity slider
4. Watch console for setting changes

## 🎯 Expected Behavior

**Console Output:**

```
🤖 XAI Extension loaded on: https://twitter.com/home
🚀 Initializing AI Tweet Detector...
✅ Twitter page detected, starting detection...
👀 MutationObserver active, watching for new tweets...
📝 Processing Tweet #1: This is a sample tweet...
📝 Processing Tweet #2: Another tweet here...
🚨 AI Detected! Confidence: 87.3% (high)
```

**Visual Changes:**

- Red bordered tweets with "🤖 87% AI" badges
- Yellow bordered tweets with "🤖 73% AI" badges

## 🔧 Current Limitations (MVP)

- Uses dummy AI detection logic (every 3rd tweet)
- No real TensorFlow.js model yet
- Only works on main timeline (not replies/comments)
- Basic tweet text extraction

## 📁 File Structure

```
xai/
├── manifest.json          # Extension configuration
├── background.js          # Service worker
├── content.js            # Main detection logic
├── popup/
│   ├── popup.html        # Settings UI
│   └── popup.js          # Settings logic
└── README.md            # This file
```

Ready for Steps 6-10! 🎉
