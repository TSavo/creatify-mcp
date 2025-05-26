# 🎬 Creatify MCP Server

[![npm version](https://badge.fury.io/js/@tsavo/creatify-mcp.svg)](https://badge.fury.io/js/@tsavo/creatify-mcp)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MCP](https://img.shields.io/badge/MCP-Compatible-blue)](https://modelcontextprotocol.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **The ultimate MCP server for AI video generation** - Bringing [Creatify AI](https://creatify.ai)'s powerful video creation capabilities to every AI assistant in the MCP ecosystem.

## 🌟 Overview

The **Creatify MCP Server** is a comprehensive Model Context Protocol (MCP) server that exposes the full power of Creatify AI's video generation platform to AI assistants, chatbots, and automation tools. Built on top of the robust [`@tsavo/creatify-api-ts`](https://www.npmjs.com/package/@tsavo/creatify-api-ts) TypeScript client library, this server transforms complex video creation workflows into simple, natural language interactions.

### 🎯 What This Enables

Imagine telling Claude Desktop: *"Create a 16:9 avatar video of Anna saying 'Welcome to our product demo' and wait for it to complete"* - and having it actually happen. That's the power of this MCP server.

### 🏗️ Built With

- **[Creatify AI API](https://creatify.ai/api)** - The world's leading AI video generation platform
- **[@tsavo/creatify-api-ts](https://www.npmjs.com/package/@tsavo/creatify-api-ts)** - Comprehensive TypeScript client library
- **[Model Context Protocol](https://modelcontextprotocol.io/)** - Standardized AI assistant integration
- **TypeScript** - Full type safety and excellent developer experience

## Features

### 🛠️ MCP Tools (Actions)
- **`create_avatar_video`** - Create AI avatar videos with lip-sync
- **`create_url_to_video`** - Convert websites into professional videos
- **`generate_text_to_speech`** - Generate natural-sounding speech from text
- **`create_multi_avatar_conversation`** - Create videos with multiple avatars having conversations
- **`create_custom_template_video`** - Generate videos using custom templates
- **`create_ai_edited_video`** - Automatically edit and enhance videos
- **`get_video_status`** - Check the status of video generation tasks

### 📚 MCP Resources (Read-only data)
- **`creatify://avatars`** - List of available AI avatars
- **`creatify://voices`** - List of available voices for text-to-speech
- **`creatify://templates`** - Available custom video templates
- **`creatify://credits`** - Remaining API credits
- **`creatify://avatar/{avatarId}`** - Detailed information about specific avatars

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
