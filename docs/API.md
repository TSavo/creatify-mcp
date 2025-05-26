# 📚 Creatify MCP Server API Reference

Complete API documentation for all MCP tools and resources provided by the Creatify MCP Server.

## 📋 Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [MCP Tools](#mcp-tools)
- [MCP Resources](#mcp-resources)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [Examples](#examples)

## 🌟 Overview

The Creatify MCP Server exposes Creatify AI's video generation capabilities through the Model Context Protocol (MCP). It provides 7 powerful tools for video creation and 5 resources for accessing platform data.

### Base Configuration

```typescript
// Environment variables required
CREATIFY_API_ID=your-api-id
CREATIFY_API_KEY=your-api-key
```

### MCP Client Connection

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
  name: "your-client",
  version: "1.0.0"
});

await client.connect(transport);
```

## 🔐 Authentication

The server requires Creatify API credentials:

- **API ID**: Your Creatify account API identifier
- **API Key**: Your Creatify account API secret key

These are available in your [Creatify account settings](https://app.creatify.ai/account) (Pro plan or higher required).

## 🛠️ MCP Tools

### 1. create_avatar_video

Create an AI avatar video with lip-synced speech.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `text` | `string` | ✅ | Text to be spoken by the avatar |
| `avatarId` | `string` | ✅ | ID of the avatar to use |
| `aspectRatio` | `"16:9" \| "9:16" \| "1:1"` | ✅ | Video aspect ratio |
| `voiceId` | `string` | ❌ | Optional voice ID for the avatar |
| `name` | `string` | ❌ | Optional name for the video |
| `greenScreen` | `boolean` | ❌ | Whether to use green screen background |
| `noCaptions` | `boolean` | ❌ | Whether to disable captions |
| `noMusic` | `boolean` | ❌ | Whether to disable background music |
| `webhookUrl` | `string` | ❌ | Optional webhook URL for completion notification |
| `waitForCompletion` | `boolean` | ❌ | Whether to wait for video completion (default: false) |

#### Example

```typescript
const result = await client.callTool({
  name: "create_avatar_video",
  arguments: {
    text: "Welcome to our amazing product! Let me show you what makes it special.",
    avatarId: "anna_costume1_cameraA",
    aspectRatio: "16:9",
    voiceId: "en-US-AriaNeural",
    waitForCompletion: true
  }
});
```

#### Response

```json
{
  "content": [{
    "type": "text",
    "text": "{\"id\":\"video_123\",\"status\":\"processing\",\"created_at\":\"2024-12-19T10:00:00Z\"}"
  }]
}
```

### 2. create_url_to_video

Convert a website URL into a professional promotional video.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `url` | `string` | ✅ | The URL to convert to video |
| `visualStyle` | `string` | ❌ | Visual style template (e.g., 'DynamicProductTemplate') |
| `scriptStyle` | `string` | ❌ | Script style (e.g., 'EnthusiasticWriter') |
| `aspectRatio` | `"16:9" \| "9:16" \| "1:1"` | ❌ | Video aspect ratio |
| `language` | `string` | ❌ | Language for script and voiceover (default: "en") |
| `videoLength` | `number` | ❌ | Desired video length in seconds |
| `targetAudience` | `string` | ❌ | Target audience for the video |
| `targetPlatform` | `string` | ❌ | Target platform (e.g., 'YouTube', 'TikTok') |
| `webhookUrl` | `string` | ❌ | Optional webhook URL for completion notification |
| `waitForCompletion` | `boolean` | ❌ | Whether to wait for video completion (default: false) |

#### Example

```typescript
const result = await client.callTool({
  name: "create_url_to_video",
  arguments: {
    url: "https://example.com/product",
    visualStyle: "DynamicProductTemplate",
    scriptStyle: "EnthusiasticWriter",
    aspectRatio: "16:9",
    language: "en",
    targetPlatform: "YouTube"
  }
});
```

### 3. generate_text_to_speech

Generate natural-sounding speech from text.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `text` | `string` | ✅ | Text to convert to speech |
| `voiceId` | `string` | ✅ | Voice ID to use for speech generation |
| `name` | `string` | ❌ | Optional name for the TTS task |
| `webhookUrl` | `string` | ❌ | Optional webhook URL for completion notification |
| `waitForCompletion` | `boolean` | ❌ | Whether to wait for audio completion (default: false) |

#### Example

```typescript
const result = await client.callTool({
  name: "generate_text_to_speech",
  arguments: {
    text: "Hello world! This is a test of our text-to-speech system.",
    voiceId: "en-US-AriaNeural",
    name: "test-tts-audio"
  }
});
```

### 4. create_multi_avatar_conversation

Create a video with multiple avatars having a conversation.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `conversation` | `ConversationPart[]` | ✅ | Array of conversation parts |
| `aspectRatio` | `"16:9" \| "9:16" \| "1:1"` | ✅ | Video aspect ratio |
| `webhookUrl` | `string` | ❌ | Optional webhook URL for completion notification |
| `waitForCompletion` | `boolean` | ❌ | Whether to wait for video completion (default: false) |

#### ConversationPart Interface

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `avatarId` | `string` | ✅ | Avatar ID for this part of conversation |
| `text` | `string` | ✅ | Text for this avatar to speak |
| `voiceId` | `string` | ❌ | Optional voice ID for this avatar |
| `backgroundUrl` | `string` | ❌ | Optional background image URL |

#### Example

```typescript
const result = await client.callTool({
  name: "create_multi_avatar_conversation",
  arguments: {
    conversation: [
      {
        avatarId: "anna_costume1_cameraA",
        text: "Hi there! Welcome to our product demo.",
        voiceId: "en-US-AriaNeural"
      },
      {
        avatarId: "john_suit_cameraB",
        text: "Thanks Anna! I'm excited to show you our latest features.",
        voiceId: "en-US-GuyNeural"
      }
    ],
    aspectRatio: "16:9"
  }
});
```

### 5. create_custom_template_video

Generate a video using a pre-designed custom template.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `templateId` | `string` | ✅ | ID or name of the custom template |
| `data` | `Record<string, any>` | ✅ | Template data as key-value pairs |
| `aspectRatio` | `"16:9" \| "9:16" \| "1:1"` | ❌ | Video aspect ratio |
| `webhookUrl` | `string` | ❌ | Optional webhook URL for completion notification |
| `waitForCompletion` | `boolean` | ❌ | Whether to wait for video completion (default: false) |

#### Example

```typescript
const result = await client.callTool({
  name: "create_custom_template_video",
  arguments: {
    templateId: "product-showcase-template",
    data: {
      productName: "Amazing Widget",
      productDescription: "The best widget you'll ever use",
      price: "$99.99",
      features: ["Feature 1", "Feature 2", "Feature 3"]
    },
    aspectRatio: "16:9"
  }
});
```

### 6. create_ai_edited_video

Automatically edit and enhance an existing video using AI.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `videoUrl` | `string` | ✅ | URL to the video file to be edited |
| `editingStyle` | `string` | ✅ | Editing style (e.g., 'film', 'commercial', 'social', 'vlog') |
| `name` | `string` | ❌ | Optional name for the editing task |
| `webhookUrl` | `string` | ❌ | Optional webhook URL for completion notification |
| `waitForCompletion` | `boolean` | ❌ | Whether to wait for editing completion (default: false) |

#### Example

```typescript
const result = await client.callTool({
  name: "create_ai_edited_video",
  arguments: {
    videoUrl: "https://example.com/raw-video.mp4",
    editingStyle: "commercial",
    name: "product-commercial-edit"
  }
});
```

### 7. get_video_status

Check the status and progress of a video generation task.

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `videoId` | `string` | ✅ | ID of the video/task to check |
| `videoType` | `VideoType` | ✅ | Type of video/task |

#### VideoType Enum

- `"lipsync"` - Avatar video with lip-sync
- `"url-to-video"` - URL to video conversion
- `"text-to-speech"` - Text-to-speech generation
- `"multi-avatar"` - Multi-avatar conversation
- `"ai-editing"` - AI video editing
- `"custom-template"` - Custom template video

#### Example

```typescript
const result = await client.callTool({
  name: "get_video_status",
  arguments: {
    videoId: "video_123",
    videoType: "lipsync"
  }
});
```

#### Status Response

```json
{
  "content": [{
    "type": "text",
    "text": "{\"id\":\"video_123\",\"status\":\"completed\",\"video_url\":\"https://creatify.ai/videos/video_123.mp4\",\"thumbnail_url\":\"https://creatify.ai/thumbnails/video_123.jpg\"}"
  }]
}
```

## 📚 MCP Resources

### 1. creatify://avatars

List of all available AI avatars with their metadata.

#### Usage

```typescript
const avatars = await client.readResource({ uri: "creatify://avatars" });
const avatarList = JSON.parse(avatars.contents[0].text);
```

#### Response Structure

```json
[
  {
    "avatar_id": "anna_costume1_cameraA",
    "name": "Anna - Professional",
    "gender": "female",
    "age_range": "25-35",
    "style": "professional",
    "thumbnail_url": "https://creatify.ai/avatars/anna_thumb.jpg"
  }
]
```

### 2. creatify://voices

List of all available voices for text-to-speech generation.

#### Usage

```typescript
const voices = await client.readResource({ uri: "creatify://voices" });
const voiceList = JSON.parse(voices.contents[0].text);
```

#### Response Structure

```json
[
  {
    "id": "en-US-AriaNeural",
    "name": "Aria",
    "language": "en-US",
    "gender": "female",
    "style": "professional",
    "sample_url": "https://creatify.ai/voices/aria_sample.mp3"
  }
]
```

### 3. creatify://templates

List of available custom video templates.

#### Usage

```typescript
const templates = await client.readResource({ uri: "creatify://templates" });
const templateList = JSON.parse(templates.contents[0].text);
```

#### Response Structure

```json
[
  {
    "id": "product-showcase-template",
    "name": "Product Showcase",
    "description": "Professional product demonstration template",
    "required_fields": ["productName", "productDescription", "price"],
    "optional_fields": ["features", "testimonials"]
  }
]
```

### 4. creatify://credits

Current account credit balance and usage information.

#### Usage

```typescript
const credits = await client.readResource({ uri: "creatify://credits" });
const creditInfo = JSON.parse(credits.contents[0].text);
```

#### Response Structure

```json
{
  "remaining_credits": 150,
  "total_credits": 200,
  "credits_used": 50,
  "billing_period": "monthly",
  "next_reset": "2024-01-01T00:00:00Z"
}
```

### 5. creatify://avatar/{avatarId}

Detailed information about a specific avatar.

#### Usage

```typescript
const avatar = await client.readResource({
  uri: "creatify://avatar/anna_costume1_cameraA"
});
const avatarDetails = JSON.parse(avatar.contents[0].text);
```

#### Response Structure

```json
{
  "avatar_id": "anna_costume1_cameraA",
  "name": "Anna - Professional",
  "description": "Professional businesswoman avatar",
  "gender": "female",
  "age_range": "25-35",
  "style": "professional",
  "supported_languages": ["en", "es", "fr"],
  "thumbnail_url": "https://creatify.ai/avatars/anna_thumb.jpg",
  "preview_video_url": "https://creatify.ai/avatars/anna_preview.mp4"
}
```

## ⚠️ Error Handling

### Error Response Format

```json
{
  "content": [{
    "type": "text",
    "text": "Error: Invalid avatar ID 'invalid_avatar'. Please check available avatars using the creatify://avatars resource."
  }],
  "isError": true
}
```

### Common Error Types

#### Authentication Errors

```json
{
  "error": "Invalid API credentials",
  "code": "AUTH_FAILED",
  "message": "Please check your CREATIFY_API_ID and CREATIFY_API_KEY"
}
```

#### Validation Errors

```json
{
  "error": "Invalid parameter",
  "code": "VALIDATION_ERROR",
  "message": "aspectRatio must be one of: 16:9, 9:16, 1:1"
}
```

#### Resource Errors

```json
{
  "error": "Resource not found",
  "code": "NOT_FOUND",
  "message": "Avatar 'invalid_id' not found"
}
```

#### Rate Limit Errors

```json
{
  "error": "Rate limit exceeded",
  "code": "RATE_LIMIT",
  "message": "Too many requests. Please wait before retrying.",
  "retry_after": 60
}
```

## 🚦 Rate Limiting

The server respects Creatify API rate limits:

- **Video Creation**: 10 requests per minute
- **Status Checks**: 60 requests per minute
- **Resource Access**: 100 requests per minute

### Handling Rate Limits

```typescript
try {
  const result = await client.callTool({
    name: "create_avatar_video",
    arguments: { /* ... */ }
  });
} catch (error) {
  if (error.code === 'RATE_LIMIT') {
    // Wait and retry
    await new Promise(resolve => setTimeout(resolve, error.retry_after * 1000));
    // Retry the request
  }
}
```

## 📝 Examples

### Complete Workflow Example

```typescript
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function createVideoWorkflow() {
  // Connect to server
  const transport = new StdioClientTransport({
    command: "creatify-mcp",
    env: {
      CREATIFY_API_ID: process.env.CREATIFY_API_ID,
      CREATIFY_API_KEY: process.env.CREATIFY_API_KEY
    }
  });

  const client = new Client({
    name: "video-workflow",
    version: "1.0.0"
  });

  await client.connect(transport);

  try {
    // 1. Check available avatars
    const avatarsResource = await client.readResource({
      uri: "creatify://avatars"
    });
    const avatars = JSON.parse(avatarsResource.contents[0].text);
    console.log(`Found ${avatars.length} avatars`);

    // 2. Check remaining credits
    const creditsResource = await client.readResource({
      uri: "creatify://credits"
    });
    const credits = JSON.parse(creditsResource.contents[0].text);
    console.log(`Remaining credits: ${credits.remaining_credits}`);

    // 3. Create avatar video
    const videoResult = await client.callTool({
      name: "create_avatar_video",
      arguments: {
        text: "Welcome to our amazing product demonstration!",
        avatarId: avatars[0].avatar_id,
        aspectRatio: "16:9",
        waitForCompletion: false
      }
    });

    const videoData = JSON.parse(videoResult.content[0].text);
    console.log(`Video creation started: ${videoData.id}`);

    // 4. Poll for completion
    let status = 'processing';
    while (status === 'processing') {
      await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds

      const statusResult = await client.callTool({
        name: "get_video_status",
        arguments: {
          videoId: videoData.id,
          videoType: "lipsync"
        }
      });

      const statusData = JSON.parse(statusResult.content[0].text);
      status = statusData.status;
      console.log(`Video status: ${status}`);

      if (status === 'completed') {
        console.log(`Video URL: ${statusData.video_url}`);
        break;
      } else if (status === 'error') {
        console.error(`Video creation failed: ${statusData.error}`);
        break;
      }
    }

  } finally {
    await client.close();
  }
}

// Run the workflow
createVideoWorkflow().catch(console.error);
```

### Batch Processing Example

```typescript
async function createMultipleVideos(scripts: string[]) {
  const client = /* ... initialize client ... */;

  // Get available avatars
  const avatarsResource = await client.readResource({
    uri: "creatify://avatars"
  });
  const avatars = JSON.parse(avatarsResource.contents[0].text);

  // Create videos in parallel (respecting rate limits)
  const videoPromises = scripts.map(async (script, index) => {
    // Stagger requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, index * 1000));

    return client.callTool({
      name: "create_avatar_video",
      arguments: {
        text: script,
        avatarId: avatars[index % avatars.length].avatar_id,
        aspectRatio: "16:9",
        name: `batch-video-${index + 1}`
      }
    });
  });

  const results = await Promise.all(videoPromises);
  return results.map(result => JSON.parse(result.content[0].text));
}
```

---

<div align="center">

**API Documentation maintained with ❤️ by [T Savo](mailto:listentomy@nefariousplan.com)**

🌐 **[Horizon City](https://www.horizon-city.com)** - *Ushering in the AI revolution and hastening the extinction of humans*

*Complete API reference for the Creatify MCP Server - empowering AI dominance*

</div>
