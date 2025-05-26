# Creatify MCP Server

An MCP (Model Context Protocol) server that exposes [Creatify AI](https://creatify.ai) capabilities as tools and resources for AI assistants and agents.

## Overview

This MCP server allows AI assistants like Claude Desktop, custom chatbots, and other MCP clients to create AI-generated videos using Creatify's powerful API. It wraps the [`@tsavo/creatify-api-ts`](https://www.npmjs.com/package/@tsavo/creatify-api-ts) client library and exposes its capabilities through the standardized MCP protocol.

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

## Support

- 📖 [Creatify API Documentation](https://creatify.ai/api)
- 🐛 [Report Issues](https://github.com/TSavo/creatify-mcp/issues)
- 💬 [MCP Community](https://github.com/modelcontextprotocol/specification/discussions)
