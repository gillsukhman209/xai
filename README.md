# 🤖 AI Tweet Detector

A Chrome extension that detects AI-generated content on Twitter/X in real-time using machine learning.

## 🚀 Features

- **Real-time Detection**: Automatically analyzes tweets as you scroll through your timeline
- **Visual Indicators**: Clear badges and color coding to identify AI-generated content
- **Confidence Scores**: Shows how confident the model is in its predictions
- **Customizable Settings**: Adjust detection sensitivity and toggle features
- **Privacy-First**: All processing happens locally in your browser
- **Performance Optimized**: Uses MutationObserver for efficient tweet detection

## 📦 Installation

### Development Mode

1. Clone this repository or download the source code
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory
5. The extension should now appear in your browser toolbar

### Production Mode

_Coming soon to Chrome Web Store_

## 🎯 How It Works

1. **Tweet Detection**: Uses MutationObserver to detect new tweets in real-time
2. **Text Extraction**: Extracts tweet content from Twitter's DOM structure
3. **AI Analysis**: Runs text through a TensorFlow.js model (currently mock data for MVP)
4. **Visual Feedback**: Applies badges and styling based on AI confidence scores

## ⚙️ Settings

Access settings by clicking the extension icon in your browser toolbar:

- **Enable Detection**: Toggle the extension on/off
- **Confidence Threshold**: Set minimum confidence (50%-90%) for AI detection
- **Show Confidence Scores**: Display confidence percentages on hover
- **Session Stats**: View how many tweets have been analyzed

## 🎨 Visual Indicators

### AI-Generated Content

- **Red border** around the tweet
- **"AI" badge** in the top-right corner
- **Subtle glow effect** for attention
- **Confidence tooltip** on hover (if enabled)

### Human Content

- **Green border** (subtle indication)
- No badge or special highlighting

### Loading State

- **Spinning indicator** while analyzing

## 🔧 Development

### Project Structure

```
xai/
├── manifest.json       # Chrome extension configuration
├── content.js          # Main content script
├── content.css         # Styling for tweet indicators
├── popup.html          # Settings popup interface
├── popup.js            # Popup functionality
├── popup.css           # Popup styling
├── icons/              # Extension icons
└── README.md           # This file
```

### Current Implementation Status

#### ✅ Phase 1: Core Extension Structure

- [x] Chrome extension manifest
- [x] Content script foundation
- [x] Settings popup interface
- [x] Visual styling system
- [x] Tweet detection with MutationObserver
- [x] Mock AI analysis pipeline

#### 🚧 Phase 2: AI Model Integration (Next)

- [ ] TensorFlow.js setup
- [ ] DistilBERT model integration
- [ ] Real AI text analysis
- [ ] Model optimization

#### 📋 Phase 3: Advanced Features (Future)

- [ ] Reply/comment detection
- [ ] Performance optimizations
- [ ] Advanced visual indicators
- [ ] Export/import settings

### Development Setup

1. Make changes to the source files
2. Go to `chrome://extensions/`
3. Click the refresh button on the extension card
4. Reload any Twitter/X tabs to see changes

### Testing

Currently uses mock AI predictions for testing. To test:

1. Load the extension in development mode
2. Navigate to Twitter/X
3. Scroll through your timeline
4. Look for tweets with red borders and "AI" badges
5. Check the popup for stats and settings

## 🔬 Technical Details

### Tweet Detection Strategy

- Uses `MutationObserver` to watch for DOM changes
- Targets Twitter's `[data-testid="tweet"]` elements
- Prevents duplicate processing with unique tweet IDs
- Gracefully handles Twitter's dynamic loading

### AI Model (Planned)

- **Model**: DistilBERT-based AI text classifier
- **Size**: ~25MB (optimized for browser)
- **Accuracy**: Target 85%+ on AI vs human text
- **Performance**: Sub-second analysis per tweet

### Browser Compatibility

- Chrome 88+ (Manifest V3)
- Edge 88+
- Other Chromium-based browsers

## 📊 Privacy & Data

- **Local Processing**: All AI analysis happens in your browser
- **No Data Collection**: No tweet content is sent to external servers
- **Minimal Permissions**: Only requires access to Twitter/X domains
- **Storage**: Settings and stats stored locally using Chrome's storage API

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📜 License

MIT License - see LICENSE file for details

## 🐛 Known Issues

- Mock AI predictions (real model coming in Phase 2)
- May need selector updates if Twitter/X changes their DOM structure
- Performance optimization needed for very long sessions

## 📮 Support

For issues, feature requests, or questions, please open an issue on GitHub.

---

_Built with ❤️ for a more transparent social media experience_
