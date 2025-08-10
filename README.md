# Prompt MultiSearch Chrome Extension

A powerful Chrome extension that allows you to simultaneously search across multiple AI language models with a single prompt. Compare responses from ChatGPT (OpenAI), Gemini (Google), Claude (Anthropic), and Mistral AI in real-time.

## Features

- **Multi-Model Search**: Query 4 different AI models simultaneously
- **Real-time Results**: See responses from all models in a clean, organized interface
- **API Key Management**: Secure storage and management of your API keys
- **Connection Testing**: Test your API connections before using
- **Modern UI**: Clean, responsive design with smooth animations
- **Error Handling**: Comprehensive error messages and fallback states

## Supported AI Models

1. **OpenAI ChatGPT** (GPT-3.5-turbo)
2. **Google Gemini** (Gemini Pro)
3. **Anthropic Claude** (Claude 3 Haiku)
4. **Mistral AI** (Mistral Tiny)

## Installation

### Method 1: Load Unpacked Extension (Development)

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the extension folder
5. The extension icon should appear in your Chrome toolbar

### Method 2: Chrome Web Store (Coming Soon)

The extension will be available on the Chrome Web Store for easy installation.

## Setup

1. **Click the extension icon** in your Chrome toolbar
2. **Click the settings gear icon** (⚙️) in the popup
3. **Configure your API keys**:
   - **OpenAI**: Get your key from [OpenAI Platform](https://platform.openai.com/api-keys)
   - **Gemini**: Get your key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - **Claude**: Get your key from [Anthropic Console](https://console.anthropic.com/)
   - **Mistral**: Get your key from [Mistral Console](https://console.mistral.ai/)
4. **Test your connections** using the "Test All Connections" button
5. **Save your keys** and you're ready to use!

## Usage

1. **Click the extension icon** to open the popup
2. **Enter your prompt** in the text area
3. **Click "Search All LLMs"** or press `Ctrl+Enter`
4. **View results** from all configured AI models in the grid layout
5. **Compare responses** side by side

## Security & Privacy

- **Local Storage**: All API keys are stored securely in your browser's local storage
- **No Third-party Tracking**: Your prompts and responses are only sent to the respective AI providers
- **Direct Communication**: The extension communicates directly with AI APIs, no intermediate servers

## Cost Considerations

- Each API call may incur costs based on your provider's pricing
- Be mindful of rate limits to avoid errors
- Monitor your usage through your respective AI provider dashboards

## Troubleshooting

### Common Issues

1. **"API key missing" error**:
   - Go to settings and ensure your API key is saved
   - Check that the key format is correct

2. **"Connection failed" error**:
   - Verify your API key is valid
   - Check your internet connection
   - Ensure you have sufficient credits/quota

3. **Extension not loading**:
   - Make sure you're using Chrome browser
   - Check that Developer mode is enabled
   - Try reloading the extension

### API Key Formats

- **OpenAI**: `sk-` followed by 48+ characters
- **Gemini**: `AIza` followed by 35 characters
- **Claude**: `sk-ant-` followed by alphanumeric characters
- **Mistral**: 32+ alphanumeric characters

## Development

### Project Structure

```
Prompt MultiSearch/
├── manifest.json          # Extension configuration
├── popup.html             # Main popup interface
├── popup.js               # Popup functionality
├── popup.css              # Popup styling
├── background.js          # Background service worker
├── options.html           # Settings page
├── options.js             # Settings functionality
├── options.css            # Settings styling
└── icons/                 # Extension icons
    ├── icon16.png
    ├── icon32.png
    └── icon48.png
```

### Building

1. Make changes to the source code
2. Reload the extension in `chrome://extensions/`
3. Test your changes

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions, please open an issue on the GitHub repository.
