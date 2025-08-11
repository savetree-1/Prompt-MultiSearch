# Prompt MultiSearch Chrome Extension

A powerful Chrome extension that allows you to simultaneously search across multiple free AI language models with a single prompt. Compare responses from Hugging Face, Cohere, AI21 Labs, and Groq in real-time with a beautiful, premium glassmorphism interface.

## ✨ Features

- **Multi-Model Search**: Query 4 different free AI models simultaneously
- **Real-time Results**: See responses from all models in a clean, organized interface
- **Premium UI**: Beautiful glassmorphism design with smooth animations and transitions
- **Free APIs**: All supported models offer generous free tiers - no premium subscriptions required
- **API Key Management**: Secure storage and management of your API keys
- **Connection Testing**: Test your API connections before using
- **Modern Design**: Premium glassmorphism interface with backdrop blur effects
- **Responsive Layout**: Works perfectly on all screen sizes
- **Enhanced UX**: Loading skeleton screens, status indicators, and error handling

## 🤖 Supported Free AI Models

1. **Hugging Face** - DialoGPT-medium model for conversational AI
2. **Cohere** - Command-light model with 100 free requests/month
3. **AI21 Labs** - J2-light model with 10,000 free tokens/month
4. **Groq** - Llama3-8b-8192 model with fast inference and generous free tier

## 🚀 Installation

### Method 1: Load Unpacked Extension (Development)

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension folder
5. The extension icon should appear in your Chrome toolbar

### Method 2: Chrome Web Store (Coming Soon)

The extension will be available on the Chrome Web Store for easy installation.

## ⚙️ Setup

1. **Click the extension icon** in your Chrome toolbar
2. **Click the settings gear icon** (⚙️) in the popup
3. **Configure your free API keys**:
   - **Hugging Face**: Get your free key from [Hugging Face Tokens](https://huggingface.co/settings/tokens)
   - **Cohere**: Get your free key from [Cohere Dashboard](https://dashboard.cohere.ai/api-keys)
   - **AI21 Labs**: Get your free key from [AI21 Studio](https://studio.ai21.com/account/account)
   - **Groq**: Get your free key from [Groq Console](https://console.groq.com/keys)
4. **Test your connections** using the "Test All Connections" button
5. **Save your keys** and you're ready to use!

## 🎯 Usage

1. **Click the extension icon** to open the popup
2. **Enter your prompt** in the text area
3. **Click "Search All Free LLMs"** or press `Ctrl+Enter`
4. **View results** from all configured AI models in the premium grid layout
5. **Compare responses** side by side with beautiful animations

## 🎨 Premium Design Features

- **Glassmorphism UI**: Modern frosted glass effect with backdrop blur
- **Smooth Animations**: Staggered card animations and hover effects
- **Premium Gradients**: Beautiful color gradients for each AI provider
- **Loading States**: Skeleton shimmer effects during API calls
- **Status Indicators**: Glowing status dots with success/error states
- **Responsive Design**: Adapts beautifully to different screen sizes
- **Accessibility**: Focus states and keyboard navigation support

## 🔒 Security & Privacy

- **Local Storage**: All API keys are stored securely in your browser's local storage
- **No Third-party Tracking**: Your prompts and responses are only sent to the respective AI providers
- **Direct Communication**: The extension communicates directly with AI APIs, no intermediate servers
- **Free Tier Privacy**: All providers offer privacy-respecting free tiers

## 💰 Cost Considerations

- **100% Free**: All supported AI models offer generous free tiers
- **No Subscriptions**: No premium API subscriptions required
- **Rate Limits**: Free tiers have reasonable rate limits for testing and development
- **Transparent Usage**: Monitor your usage through respective provider dashboards

## 🛠️ Troubleshooting

### Common Issues

1. **"API key missing" error**:
   - Go to settings and ensure your API key is saved
   - Check that the key format is correct for each provider

2. **"Connection failed" error**:
   - Verify your API key is valid and active
   - Check your internet connection
   - Ensure you haven't exceeded free tier limits

3. **Extension not loading**:
   - Make sure you're using Chrome browser
   - Check that Developer mode is enabled
   - Try reloading the extension

### API Key Formats

- **Hugging Face**: `hf_` followed by 32+ characters
- **Cohere**: 40+ alphanumeric characters with dashes/underscores
- **AI21 Labs**: 32+ alphanumeric characters
- **Groq**: `gsk_` followed by exactly 52 characters

## 🏗️ Development

### Project Structure

```
Prompt MultiSearch/
├── manifest.json          # Extension configuration
├── popup.html             # Main popup interface
├── popup.js               # Popup functionality
├── popup.css              # Premium glassmorphism styling
├── background.js          # Background service worker with free APIs
├── options.html           # Settings page
├── options.js             # Settings functionality
├── options.css            # Premium settings styling
└── icons/                 # Extension icons
    ├── icon16.png
    ├── icon32.png
    └── icon48.png
```

### Building

1. Make changes to the source code
2. Reload the extension in `chrome://extensions/`
3. Test your changes

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 💬 Support

If you encounter any issues or have questions, please open an issue on the GitHub repository.

## 🎉 What's New

- ✨ **Premium Glassmorphism UI**: Beautiful frosted glass design with backdrop blur effects
- 🆓 **100% Free APIs**: Replaced all premium APIs with generous free alternatives
- 🚀 **Enhanced Performance**: Optimized API calls and response handling
- 📱 **Improved Responsiveness**: Better mobile and small screen support
- 🎨 **Modern Animations**: Smooth transitions and loading states
- 🔧 **Better Error Handling**: Comprehensive error messages and recovery
- 📊 **Status Indicators**: Real-time connection status with visual feedback
