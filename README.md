<div align="center">
    <h1>🤖 AuraMate</h1>
    <p>Supercharge your Discord experience with AI-powered enhancements</p>

[![License](https://img.shields.io/badge/License-GPL--3.0-blue.svg)](LICENSE)
[![Made for Vencord](https://img.shields.io/badge/For-Vencord-7289da.svg)](https://github.com/Vendicated/Vencord)
</div>

> ⚗️ **EXPERIMENTAL:**
>
> This plugin is in early development and may contain bugs or incomplete features. Use at your own risk.

> ⚠️ **Disclaimers:**
> - This plugin uses external AI APIs. Any text you send while enabled will be processed by third-party services. Please review the privacy policies of your selected provider before use.
> - This plugin is not affiliated with any AI service providers.
> - This plugin is not affiliated with Discord.
> - This plugin is not affiliated with Vencord.

## ✨ Features

🎯 **Smart Enhancement Options**
- 📝 **Spelling & Grammar** - Automatically fix typos and improve your writing
- 📋 **Summarize** - Create concise summaries of long messages or entire channels
- 📈 **Expand** - Elaborate on ideas with AI-powered suggestions
- 📚 **More to come!** - Stay tuned for new features and enhancements, we are already working on it

🔌 **Supported AI Providers**
- [Anthropic](https://anthropic.com) - Claude models
- [Amazon Bedrock](https://aws.amazon.com/bedrock) - AWS AI services
- [DeepSeek](https://deepseek.ai) - DeepSeek Chat models
- [Google Gemini](https://gemini.google.com/) - Google's AI models
- [LM Studio](https://lmstudio.ai) - Local model inference
- [Mistral AI](https://mistral.ai) - Mistral's language models
- [Ollama](https://ollama.ai) - Run models locally
- [OpenAI](https://platform.openai.com/) - OpenAI's models
- [OpenRouter](https://openrouter.ai) - Access to multiple models
- [Vertex AI](https://cloud.google.com/vertex-ai) - Google Cloud's AI platform

## 🚀 Getting Started

### Installation
Since this is an unofficial plugin, you'll need to build Vencord from source.

1. Follow the [Custom Plugins Guide](https://docs.vencord.dev/installing/custom-plugins/) to set up your development environment
2. Navigate to your userplugins folder:
   ```bash
   cd src/userplugins
   ```
3. Clone this repository:
   ```bash
   git clone https://github.com/UnlimitedBytes/AuraMate
   ```
4. Build and inject Vencord:
   ```bash
   pnpm install
   pnpm build
   pnpm inject
   ```

### Updating
To update the plugin:
1. Navigate to the plugin directory:
   ```bash
   cd src/userplugins/AuraMate
   ```
2. Pull the latest changes:
   ```bash
   git pull
   ```
3. Rebuild and reinject Vencord:
   ```bash
   pnpm install
   pnpm build
   pnpm inject
   ```

### Using the Plugin
1. Enable the plugin in Vencord settings
2. Setup your AI provider and API key in plugin settings
3. Choose your preferred AI model
4. Start enhancing your messages!

## ⚙️ Configuration

### Provider Settings
| Setting | Description |
|---------|-------------|
| Provider | Select your AI service provider |
| API Key | Your provider's API key/credentials |
| Model | Choose the AI model to use |

### Enhancement Settings
| Setting | Description | Default |
|---------|-------------|---------|
| Enhance before sending | Auto-enhance messages | false |
| Show AI button | Toggle AI button visibility | true |
| Enhancement alert | Show enhancement notifications | true |
| Enhancement tooltip | Display helpful tooltips | true |

### Feature Toggles
- ✍️ Spelling correction
- 📝 Text summarization
- 📈 Message expansion

## 🛠️ API Key Setup

<details>
<summary>OpenAI Setup</summary>

1. Visit [OpenAI API Keys](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy and paste into plugin settings
</details>

<details>
<summary>Google AI Setup</summary>

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikeys)
2. Generate an API key
3. Copy and paste into plugin settings
</details>

<details>
<summary>Vertex AI Setup</summary>

1. Create a Google Cloud project
2. Enable Vertex AI API
3. Use format: `project-id:region`
</details>

<details>
<summary>Local Providers</summary>

### Ollama
- Default endpoint: `http://localhost:11434`
- Customize host in API key field

### LM Studio
- Default port: `1234`
- Set custom port in API key field
</details>

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## 📝 License

This project is licensed under the [GNU General Public License v3.0](LICENSE).
