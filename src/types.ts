/**
 * Type definitions for the Creatify MCP Server
 */

export interface CreatifyConfig {
  apiId: string;
  apiKey: string;
}

export interface VideoCreationOptions {
  waitForCompletion?: boolean;
  webhookUrl?: string;
}

export interface AvatarVideoParams extends VideoCreationOptions {
  text: string;
  avatarId: string;
  aspectRatio: "16:9" | "9:16" | "1:1";
  voiceId?: string;
  name?: string;
  greenScreen?: boolean;
  noCaptions?: boolean;
  noMusic?: boolean;
}

export interface UrlToVideoParams extends VideoCreationOptions {
  url: string;
  visualStyle?: string;
  scriptStyle?: string;
  aspectRatio?: "16:9" | "9:16" | "1:1";
  language?: string;
  videoLength?: number;
  targetAudience?: string;
  targetPlatform?: string;
}

export interface TextToSpeechParams extends VideoCreationOptions {
  text: string;
  voiceId: string;
  name?: string;
}

export interface ConversationPart {
  avatarId: string;
  text: string;
  voiceId?: string;
  backgroundUrl?: string;
}

export interface MultiAvatarConversationParams extends VideoCreationOptions {
  conversation: ConversationPart[];
  aspectRatio: "16:9" | "9:16" | "1:1";
}

export interface CustomTemplateVideoParams extends VideoCreationOptions {
  templateId: string;
  data: Record<string, any>;
  aspectRatio?: "16:9" | "9:16" | "1:1";
}

export interface AiEditingParams extends VideoCreationOptions {
  videoUrl: string;
  editingStyle: string;
  name?: string;
}

export interface VideoStatusParams {
  videoId: string;
  videoType: "lipsync" | "url-to-video" | "text-to-speech" | "multi-avatar" | "ai-editing" | "custom-template";
}

export interface McpToolResult {
  content: Array<{
    type: "text";
    text: string;
  }>;
  isError?: boolean;
}

export interface McpResourceResult {
  contents: Array<{
    uri: string;
    mimeType: string;
    text: string;
  }>;
}
