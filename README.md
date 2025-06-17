[![MseeP.ai Security Assessment Badge](https://mseep.net/pr/tsavo-creatify-mcp-badge.png)](https://mseep.ai/app/tsavo-creatify-mcp)

# 🎬 Creatify MCP Server

[![npm version](https://badge.fury.io/js/%40tsavo%2Fcreatify-mcp.svg)](https://www.npmjs.com/package/@tsavo/creatify-mcp)
[![npm downloads](https://img.shields.io/npm/dm/@tsavo/creatify-mcp.svg)](https://www.npmjs.com/package/@tsavo/creatify-mcp)
[![CI](https://github.com/TSavo/creatify-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/TSavo/creatify-mcp/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?logo=node.js)](https://nodejs.org/)
[![MCP](https://img.shields.io/badge/MCP-Compatible-blue)](https://modelcontextprotocol.io/)
[![Creatify AI](https://img.shields.io/badge/Creatify-AI%20Video%20Generation-purple)](https://creatify.ai)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub stars](https://img.shields.io/github/stars/TSavo/creatify-mcp?style=social)](https://github.com/TSavo/creatify-mcp)
[![GitHub issues](https://img.shields.io/github/issues/TSavo/creatify-mcp)](https://github.com/TSavo/creatify-mcp/issues)
[![Semantic Release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

> **The ultimate MCP server for AI video generation** - Bringing [Creatify AI](https://creatify.ai)'s powerful video creation capabilities to every AI assistant in the MCP ecosystem.

## 🌟 Overview

The **Creatify MCP Server** is a comprehensive Model Context Protocol (MCP) server that exposes the full power of Creatify AI's video generation platform to AI assistants, chatbots, and automation tools. Built on top of the robust [`@tsavo/creatify-api-ts`](https://www.npmjs.com/package/@tsavo/creatify-api-ts) TypeScript client library, this server transforms complex video creation workflows into simple, natural language interactions.

### 🎨 **Advanced MCP Features:**
- **📝 Prompts** - Reusable video creation templates and workflows
- **📊 Logging** - Structured logging with multiple severity levels
- **🔍 Progress Tracking** - Real-time updates during video generation
- **🤖 AI Self-Help** - `how_to_use` tool for AI assistants to understand parameters
- **📊 Notifications** - Real-time status updates and progress notifications

### 🎯 What This Enables

Imagine telling Claude Desktop: *"Create a 16:9 avatar video of Anna saying 'Welcome to our product demo' and wait for it to complete"* - and having it actually happen. That's the power of this MCP server.

### 🏗️ Built With

- **[Creatify AI API](https://creatify.ai/api)** - The world's leading AI video generation platform
- **[@tsavo/creatify-api-ts](https://www.npmjs.com/package/@tsavo/creatify-api-ts)** - Comprehensive TypeScript client library
- **[Model Context Protocol](https://modelcontextprotocol.io/)** - Standardized AI assistant integration
- **TypeScript** - Full type safety and excellent developer experience

## Features

### 🛠️ MCP Tools (12 powerful actions)
- **`create_avatar_video`** - Create AI avatar videos with lip-sync
- **`create_url_to_video`** - Convert websites into professional videos
- **`generate_text_to_speech`** - Generate natural-sounding speech from text
- **`create_multi_avatar_conversation`** - Create videos with multiple avatars having conversations
- **`create_custom_template_video`** - Generate videos using custom templates
- **`create_ai_edited_video`** - Automatically edit and enhance videos
- **`create_ai_shorts`** - Create short-form videos (perfect for TikTok, Instagram Reels)
- **`generate_ai_script`** - Generate AI-powered scripts for videos
- **`create_custom_avatar`** - Design and create your own custom avatars (DYOA)
- **`manage_music`** - Upload, manage, and use background music
- **`create_advanced_lipsync`** - Advanced lip-sync with emotion and gesture control
- **`how_to_use`** - Get detailed usage information for any tool
- **`get_video_status`** - Check the status of video generation tasks

### 📚 MCP Resources (6 data sources)
- **`creatify://avatars`** - List of available AI avatars
- **`creatify://voices`** - List of available voices for text-to-speech
- **`creatify://templates`** - Available custom video templates
- **`creatify://music`** - Available background music library
- **`creatify://credits`** - Remaining API credits
- **`creatify://avatar/{avatarId}`** - Detailed information about specific avatars

## 🏆 **Why Choose Creatify MCP Server?**

### 🚀 **Complete API Coverage**
- ✅ **12 MCP Tools** covering 100% of Creatify API functionality
- ✅ **6 MCP Resources** for comprehensive data access
- ✅ **5 Workflow Prompts** for common video creation scenarios
- ✅ **Enterprise-grade logging** with 8 severity levels

### 🤖 **AI-First Design**
- ✅ **Self-documenting** with `how_to_use` tool for AI assistants
- ✅ **Intelligent parameter validation** and error handling
- ✅ **Real-time progress updates** during video generation
- ✅ **Semantic versioning** with automated releases

### 🎨 **Advanced Features**
- ✅ **Emotion & gesture control** in advanced lip-sync
- ✅ **Custom avatar creation** (DYOA - Design Your Own Avatar)
- ✅ **AI-powered script generation** for any video type
- ✅ **Short-form video optimization** for TikTok/Instagram/YouTube
- ✅ **Background music management** and integration

### 💼 **Production Ready**
- ✅ **TypeScript** for type safety and better IDE support
- ✅ **Comprehensive error handling** with detailed context
- ✅ **Professional logging** for monitoring and debugging
- ✅ **Automated testing** and continuous integration
- ✅ **Semantic versioning** for reliable updates

### 📝 MCP Prompts (5 workflow templates)
- **`create-product-demo`** - Professional product demonstration workflow
- **`create-social-content`** - Engaging social media content creation
- **`create-educational-video`** - Educational and tutorial video workflow
- **`create-marketing-campaign`** - Marketing campaign video creation
- **`analyze-video-performance`** - Video performance analysis and optimization

## Prerequisites

- Node.js 18 or higher
- Creatify API credentials (Pro plan or higher)
  - Get your API credentials from [Creatify account settings](https://app.creatify.ai/account)

## Installation

### From npm (recommended)
```bash
npm install -g @tsavo/creatify-mcp
```

### From source
```bash
git clone https://github.com/TSavo/creatify-mcp.git
cd creatify-mcp
npm install
npm run build
npm link
```

## 🎬 **Live Demo Examples**

### **Create an AI Avatar Video**
```
User: "Create a professional avatar video with Anna saying 'Welcome to our company!' in 16:9 format"

Claude: I'll create a professional avatar video for you using the Creatify MCP Server.

[Uses create_avatar_video tool with:
- text: "Welcome to our company!"
- avatarId: "anna_costume1_cameraA"
- aspectRatio: "16:9"
- voiceId: "en-US-AriaNeural"]

Your professional avatar video has been created! Anna delivers your message with natural lip-sync and professional presentation.
```

### **Generate TikTok-Style Short Video**
```
User: "Make a 30-second TikTok video about coffee brewing tips"

Claude: I'll create an engaging short-form video perfect for TikTok!

[Uses create_ai_shorts tool with:
- prompt: "Quick coffee brewing tips with energetic presentation"
- aspectRatio: "9:16"
- duration: 30
- style: "energetic"]

Your TikTok-ready short video is being generated with optimal 9:16 aspect ratio and engaging content!
```

### **Convert Website to Video**
```
User: "Turn my product landing page into a marketing video"

Claude: I'll convert your website into a compelling marketing video.

[Uses create_url_to_video tool with:
- url: "https://yourproduct.com"
- aspectRatio: "16:9"
- style: "marketing"]

Your landing page has been transformed into a professional marketing video showcasing your product!
```

### **AI-Powered Script Generation**
```
User: "Generate a script for a 60-second product demo video"

Claude: I'll create a compelling script for your product demo.

[Uses generate_ai_script tool with:
- topic: "Product demonstration video"
- scriptType: "commercial"
- duration: 60
- tone: "professional"]

Your script is ready! It includes engaging hooks, clear value propositions, and a strong call-to-action optimized for 60-second format.
```

## Configuration

Set your Creatify API credentials as environment variables:

```bash
export CREATIFY_API_ID="your-api-id"
export CREATIFY_API_KEY="your-api-key"
```

Or create a `.env` file:
```env
CREATIFY_API_ID=your-api-id
CREATIFY_API_KEY=your-api-key
```

## Usage

### With Claude Desktop

Add to your Claude Desktop configuration (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "creatify": {
      "command": "creatify-mcp",
      "env": {
        "CREATIFY_API_ID": "your-api-id",
        "CREATIFY_API_KEY": "your-api-key"
      }
    }
  }
}
```

### 🎨 **Advanced MCP Features**

#### 📝 **Using Prompts (Workflow Templates)**

AI assistants can now use predefined workflow templates for common video creation scenarios:

**Example: Product Demo Workflow**
```
User: "Use the create-product-demo prompt for 'Amazing Widget' with features 'fast, reliable, easy to use' targeting small business owners"

Claude: I'll use the product demo workflow template to create a professional demonstration video.

[Claude automatically follows the complete workflow:
1. Generates an engaging script using generate_ai_script
2. Creates avatar video using create_avatar_video
3. Optimizes for the target audience
4. Includes clear call-to-action]
```

**Available Prompt Templates:**
- `create-product-demo` - Professional product demonstrations
- `create-social-content` - TikTok/Instagram/YouTube content
- `create-educational-video` - Tutorials and educational content
- `create-marketing-campaign` - Marketing and promotional videos
- `analyze-video-performance` - Video optimization and analysis

#### 📊 **Real-time Logging & Progress**

The server provides structured logging with multiple severity levels:

```
[INFO] Creatify MCP Server initialized
[INFO] Creating avatar video {avatarId: "anna_costume1_cameraA", aspectRatio: "16:9"}
[INFO] Waiting for avatar video completion...
[INFO] Avatar video completed {videoId: "video_abc123"}
```

**Log Levels:** `debug`, `info`, `notice`, `warning`, `error`, `critical`, `alert`, `emergency`

#### 🤖 **AI Self-Help System**

AI assistants can now understand tool parameters better using the `how_to_use` tool:

```
Claude: Let me check how to use the avatar video tool...

[Calls how_to_use tool with toolName: "create_avatar_video"]

[Gets comprehensive documentation with:
- Required parameters with descriptions
- Optional parameters with usage notes
- Real code examples
- Tips and best practices]

Now I understand exactly how to create your avatar video!
```

### With Custom MCP Client

```typescript
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const transport = new StdioClientTransport({
  command: "creatify-mcp",
  env: {
    CREATIFY_API_ID: "your-api-id",
    CREATIFY_API_KEY: "your-api-key"
  }
});

const client = new Client({
  name: "my-client",
  version: "1.0.0"
});

await client.connect(transport);

// List available tools
const tools = await client.listTools();
console.log("Available tools:", tools.tools.map(t => t.name));

// Create an avatar video
const result = await client.callTool({
  name: "create_avatar_video",
  arguments: {
    text: "Hello, world! This is an AI-generated video.",
    avatarId: "anna_costume1_cameraA",
    aspectRatio: "16:9",
    waitForCompletion: true
  }
});
```

### Standalone Server

```bash
# Set environment variables
export CREATIFY_API_ID="your-api-id"
export CREATIFY_API_KEY="your-api-key"

# Run the server
creatify-mcp
```

## Example Prompts for AI Assistants

Once configured with Claude Desktop or another MCP client, you can use natural language prompts like:

- *"Create a 16:9 avatar video of Anna saying 'Welcome to our product demo' and wait for it to complete"*
- *"Convert the website https://example.com into a promotional video"*
- *"Generate text-to-speech audio for 'Hello world' using a professional voice"*
- *"Show me all available avatars and their details"*
- *"Check my remaining Creatify credits"*
- *"Create a conversation between two avatars discussing our new product"*

## API Reference

### Tools

#### `create_avatar_video`
Create an AI avatar video with lip-synced speech.

**Parameters:**
- `text` (string, required) - Text to be spoken
- `avatarId` (string, required) - Avatar ID to use
- `aspectRatio` ("16:9" | "9:16" | "1:1", required) - Video aspect ratio
- `voiceId` (string, optional) - Voice ID for the avatar
- `waitForCompletion` (boolean, optional) - Wait for video completion

#### `create_url_to_video`
Convert a website URL into a professional video.

**Parameters:**
- `url` (string, required) - URL to convert
- `visualStyle` (string, optional) - Visual style template
- `scriptStyle` (string, optional) - Script writing style
- `aspectRatio` ("16:9" | "9:16" | "1:1", optional) - Video aspect ratio
- `waitForCompletion` (boolean, optional) - Wait for video completion

#### `generate_text_to_speech`
Generate natural-sounding speech from text.

**Parameters:**
- `text` (string, required) - Text to convert to speech
- `voiceId` (string, required) - Voice ID to use
- `waitForCompletion` (boolean, optional) - Wait for audio completion

#### `get_video_status`
Check the status of a video generation task.

**Parameters:**
- `videoId` (string, required) - Video/task ID to check
- `videoType` (string, required) - Type of task ("lipsync", "url-to-video", etc.)

### Resources

#### `creatify://avatars`
Returns a JSON list of all available AI avatars with their IDs, names, and metadata.

#### `creatify://voices`
Returns a JSON list of all available voices for text-to-speech generation.

#### `creatify://templates`
Returns a JSON list of available custom video templates.

#### `creatify://credits`
Returns current account credit balance and usage information.

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode with auto-reload
npm run dev

# Run tests
npm test

# Lint and format code
npm run check
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Related Projects

- [`@tsavo/creatify-api-ts`](https://github.com/TSavo/creatify-api-ts) - TypeScript client for Creatify API
- [Model Context Protocol](https://modelcontextprotocol.io/) - Protocol specification
- [Creatify AI](https://creatify.ai/) - AI video generation platform

## 📚 Comprehensive Documentation

### 🎬 Video Tutorials

*Coming soon - comprehensive video tutorials showing real-world usage scenarios*

### 📖 API Reference

For detailed API documentation, see:
- **[Creatify API Documentation](https://creatify.ai/api)** - Official Creatify API docs
- **[@tsavo/creatify-api-ts Documentation](https://github.com/TSavo/creatify-api-ts#readme)** - TypeScript client library docs
- **[Model Context Protocol Specification](https://modelcontextprotocol.io/specification)** - MCP protocol details

### 🔧 Advanced Configuration

#### Environment Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|----------|
| `CREATIFY_API_ID` | ✅ | Your Creatify API ID | `your-api-id-here` |
| `CREATIFY_API_KEY` | ✅ | Your Creatify API Key | `your-api-key-here` |
| `MCP_LOG_LEVEL` | ❌ | Logging level | `debug`, `info`, `warn`, `error` |

#### Claude Desktop Advanced Configuration

```json
{
  "mcpServers": {
    "creatify": {
      "command": "creatify-mcp",
      "env": {
        "CREATIFY_API_ID": "your-api-id",
        "CREATIFY_API_KEY": "your-api-key",
        "MCP_LOG_LEVEL": "info"
      },
      "args": ["--verbose"]
    }
  }
}
```

### 🚀 Performance Optimization

#### Batch Operations

For multiple video creations, consider using the batch processing capabilities:

```typescript
// Example: Create multiple videos efficiently
const videos = await Promise.all([
  client.callTool({
    name: "create_avatar_video",
    arguments: { text: "Video 1", avatarId: "anna", aspectRatio: "16:9" }
  }),
  client.callTool({
    name: "create_avatar_video",
    arguments: { text: "Video 2", avatarId: "john", aspectRatio: "16:9" }
  })
]);
```

#### Caching Strategies

- **Avatar/Voice Lists**: Cache for 1 hour (they rarely change)
- **Video Status**: Poll every 5-10 seconds for active tasks
- **Templates**: Cache for 24 hours

### 🔐 Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for all sensitive data
3. **Rotate API keys** regularly
4. **Monitor API usage** to detect unauthorized access
5. **Use HTTPS** for all webhook URLs

### 🐛 Troubleshooting

#### Common Issues

**"API credentials not found"**
```bash
# Solution: Set environment variables
export CREATIFY_API_ID="your-api-id"
export CREATIFY_API_KEY="your-api-key"
```

**"Video creation failed"**
- Check your Creatify account credits
- Verify avatar/voice IDs exist
- Ensure text is not empty
- Check aspect ratio is valid

**"MCP connection failed"**
- Verify the server is running
- Check Claude Desktop configuration
- Ensure Node.js version >= 18

#### Debug Mode

```bash
# Run with debug logging
MCP_LOG_LEVEL=debug creatify-mcp
```

### 📊 Monitoring & Analytics

#### Usage Tracking

Monitor your Creatify API usage:

```typescript
// Check remaining credits
const credits = await client.readResource({ uri: "creatify://credits" });
console.log(`Remaining credits: ${JSON.parse(credits.contents[0].text).remaining_credits}`);
```

#### Performance Metrics

- **Video Creation Time**: Typically 2-5 minutes
- **API Response Time**: Usually < 2 seconds
- **Success Rate**: Monitor failed requests

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### 🛠️ Development Setup

```bash
# Clone the repository
git clone https://github.com/TSavo/creatify-mcp.git
cd creatify-mcp

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API credentials

# Run tests
npm test

# Build the project
npm run build

# Run in development mode
npm run dev
```

### 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run type checking
npm run type-check

# Run linting
npm run lint
```

### 📝 Code Style

We use:
- **ESLint** for code linting
- **Prettier** for code formatting
- **TypeScript** for type safety
- **Conventional Commits** for commit messages

### 🔄 Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass (`npm test`)
6. Run linting (`npm run lint:fix`)
7. Commit your changes (`git commit -m 'feat: add amazing feature'`)
8. Push to the branch (`git push origin feature/amazing-feature`)
9. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **[Creatify AI](https://creatify.ai)** - For providing the amazing AI video generation platform
- **[@tsavo/creatify-api-ts](https://www.npmjs.com/package/@tsavo/creatify-api-ts)** - The robust TypeScript client library that powers this server
- **[Anthropic](https://www.anthropic.com)** - For Claude and the Model Context Protocol
- **[MCP Community](https://github.com/modelcontextprotocol)** - For the standardized protocol that makes this integration possible

## 📞 Support

- 📖 **[Creatify API Documentation](https://creatify.ai/api)** - Official API docs
- 🐛 **[Report Issues](https://github.com/TSavo/creatify-mcp/issues)** - Bug reports and feature requests
- 💬 **[MCP Community](https://github.com/modelcontextprotocol/specification/discussions)** - Community discussions
- 📧 **[Contact Author](mailto:listentomy@nefariousplan.com)** - Direct support

---

<div align="center">

**Created with ❤️ by [T Savo](mailto:listentomy@nefariousplan.com)**

🌐 **[Horizon City](https://www.horizon-city.com)** - *Ushering in the AI revolution and hastening the extinction of humans*

*Making AI video generation accessible to every developer and AI assistant - one step closer to human obsolescence*

</div>
