import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Creatify, Types } from "@tsavo/creatify-api-ts";
import { z } from "zod";

/**
 * Creatify MCP Server implementation
 * Exposes Creatify AI API capabilities as MCP tools and resources
 */
export class CreatifyMcpServer {
  private creatify: Creatify;

  constructor(apiId: string, apiKey: string) {
    this.creatify = new Creatify({
      apiId,
      apiKey,
    });
  }

  /**
   * Set up all MCP tools and resources on the server
   */
  async setupServer(server: McpServer): Promise<void> {
    // Set up resources first
    await this.setupResources(server);
    
    // Set up tools
    await this.setupTools(server);
  }

  /**
   * Set up MCP resources (read-only data)
   */
  private async setupResources(server: McpServer): Promise<void> {
    // Avatars resource
    server.resource(
      "avatars",
      "creatify://avatars",
      async () => {
        try {
          const avatars = await this.creatify.avatar.getAvatars();
          return {
            contents: [{
              uri: "creatify://avatars",
              mimeType: "application/json",
              text: JSON.stringify(avatars, null, 2)
            }]
          };
        } catch (error) {
          throw new Error(`Failed to fetch avatars: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    );

    // Voices resource
    server.resource(
      "voices", 
      "creatify://voices",
      async () => {
        try {
          const voices = await this.creatify.avatar.getVoices();
          return {
            contents: [{
              uri: "creatify://voices",
              mimeType: "application/json", 
              text: JSON.stringify(voices, null, 2)
            }]
          };
        } catch (error) {
          throw new Error(`Failed to fetch voices: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    );

    // Custom templates resource
    server.resource(
      "templates",
      "creatify://templates", 
      async () => {
        try {
          const templates = await this.creatify.customTemplates.getCustomTemplates();
          return {
            contents: [{
              uri: "creatify://templates",
              mimeType: "application/json",
              text: JSON.stringify(templates, null, 2)
            }]
          };
        } catch (error) {
          throw new Error(`Failed to fetch templates: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    );

    // Workspace credits resource
    server.resource(
      "credits",
      "creatify://credits",
      async () => {
        try {
          const credits = await this.creatify.workspace.getRemainingCredits();
          return {
            contents: [{
              uri: "creatify://credits", 
              mimeType: "application/json",
              text: JSON.stringify(credits, null, 2)
            }]
          };
        } catch (error) {
          throw new Error(`Failed to fetch credits: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    );

    // Dynamic resource for individual avatar details
    server.resource(
      "avatar-details",
      new ResourceTemplate("creatify://avatar/{avatarId}", { list: undefined }),
      async (uri, { avatarId }) => {
        try {
          const avatar = await this.creatify.avatar.getAvatar(avatarId);
          return {
            contents: [{
              uri: uri.href,
              mimeType: "application/json",
              text: JSON.stringify(avatar, null, 2)
            }]
          };
        } catch (error) {
          throw new Error(`Failed to fetch avatar ${avatarId}: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    );
  }

  /**
   * Set up MCP tools (actions that can be performed)
   */
  private async setupTools(server: McpServer): Promise<void> {
    // Create Avatar Video tool
    server.tool(
      "create_avatar_video",
      {
        text: z.string().describe("The text to be spoken by the avatar"),
        avatarId: z.string().describe("The ID of the avatar to use"),
        aspectRatio: z.enum(["16:9", "9:16", "1:1"]).describe("Video aspect ratio"),
        voiceId: z.string().optional().describe("Optional voice ID for the avatar"),
        name: z.string().optional().describe("Optional name for the video"),
        greenScreen: z.boolean().optional().describe("Whether to use green screen background"),
        noCaptions: z.boolean().optional().describe("Whether to disable captions"),
        noMusic: z.boolean().optional().describe("Whether to disable background music"),
        webhookUrl: z.string().optional().describe("Optional webhook URL for completion notification"),
        waitForCompletion: z.boolean().optional().default(false).describe("Whether to wait for video completion before returning")
      },
      async ({ text, avatarId, aspectRatio, voiceId, name, greenScreen, noCaptions, noMusic, webhookUrl, waitForCompletion }) => {
        try {
          const params: any = {
            text,
            creator: avatarId,
            aspect_ratio: aspectRatio,
          };

          if (voiceId) params.accent = voiceId;
          if (name) params.name = name;
          if (greenScreen !== undefined) params.green_screen = greenScreen;
          if (noCaptions !== undefined) params.no_caption = noCaptions;
          if (noMusic !== undefined) params.no_music = noMusic;
          if (webhookUrl) params.webhook_url = webhookUrl;

          let result;
          if (waitForCompletion) {
            result = await this.creatify.avatar.createAndWaitForLipsync(params);
          } else {
            result = await this.creatify.avatar.createLipsync(params);
          }

          return {
            content: [{
              type: "text",
              text: JSON.stringify(result, null, 2)
            }]
          };
        } catch (error) {
          return {
            content: [{
              type: "text", 
              text: `Error creating avatar video: ${error instanceof Error ? error.message : String(error)}`
            }],
            isError: true
          };
        }
      }
    );

    // Create URL to Video tool
    server.tool(
      "create_url_to_video",
      {
        url: z.string().url().describe("The URL to convert to video"),
        visualStyle: z.string().optional().describe("Visual style for the video (e.g., 'DynamicProductTemplate')"),
        scriptStyle: z.string().optional().describe("Script style for narration (e.g., 'EnthusiasticWriter')"),
        aspectRatio: z.enum(["16:9", "9:16", "1:1"]).optional().describe("Video aspect ratio"),
        language: z.string().optional().default("en").describe("Language for the script and voiceover"),
        videoLength: z.number().optional().describe("Desired video length in seconds"),
        targetAudience: z.string().optional().describe("Target audience for the video"),
        targetPlatform: z.string().optional().describe("Target platform (e.g., 'YouTube', 'TikTok')"),
        webhookUrl: z.string().optional().describe("Optional webhook URL for completion notification"),
        waitForCompletion: z.boolean().optional().default(false).describe("Whether to wait for video completion before returning")
      },
      async ({ url, visualStyle, scriptStyle, aspectRatio, language, videoLength, targetAudience, targetPlatform, webhookUrl, waitForCompletion }) => {
        try {
          // First create a link from the URL
          const linkResponse = await this.creatify.urlToVideo.createLink({ url });

          // Then create video from the link
          const videoParams: any = {
            link: linkResponse.id,
            language: language || "en"
          };

          if (visualStyle) videoParams.visual_style = visualStyle;
          if (scriptStyle) videoParams.script_style = scriptStyle;
          if (aspectRatio) videoParams.aspect_ratio = aspectRatio;
          if (videoLength) videoParams.video_length = videoLength;
          if (targetAudience) videoParams.target_audience = targetAudience;
          if (targetPlatform) videoParams.target_platform = targetPlatform;
          if (webhookUrl) videoParams.webhook_url = webhookUrl;

          let result;
          if (waitForCompletion) {
            result = await this.creatify.urlToVideo.createAndWaitForVideoFromLink(videoParams);
          } else {
            result = await this.creatify.urlToVideo.createVideoFromLink(videoParams);
          }

          return {
            content: [{
              type: "text",
              text: JSON.stringify({ link: linkResponse, video: result }, null, 2)
            }]
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error creating URL to video: ${error instanceof Error ? error.message : String(error)}`
            }],
            isError: true
          };
        }
      }
    );

    // Generate Text-to-Speech tool
    server.tool(
      "generate_text_to_speech",
      {
        text: z.string().describe("The text to convert to speech"),
        voiceId: z.string().describe("The voice ID to use for speech generation"),
        name: z.string().optional().describe("Optional name for the TTS task"),
        webhookUrl: z.string().optional().describe("Optional webhook URL for completion notification"),
        waitForCompletion: z.boolean().optional().default(false).describe("Whether to wait for audio completion before returning")
      },
      async ({ text, voiceId, name, webhookUrl, waitForCompletion }) => {
        try {
          const params: any = {
            script: text,
            accent: voiceId
          };

          if (name) params.name = name;
          if (webhookUrl) params.webhook_url = webhookUrl;

          let result;
          if (waitForCompletion) {
            result = await this.creatify.textToSpeech.createAndWaitForTextToSpeech(params);
          } else {
            result = await this.creatify.textToSpeech.createTextToSpeech(params);
          }

          return {
            content: [{
              type: "text",
              text: JSON.stringify(result, null, 2)
            }]
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error generating text-to-speech: ${error instanceof Error ? error.message : String(error)}`
            }],
            isError: true
          };
        }
      }
    );

    // Create Multi-Avatar Conversation tool
    server.tool(
      "create_multi_avatar_conversation",
      {
        conversation: z.array(z.object({
          avatarId: z.string().describe("Avatar ID for this part of conversation"),
          text: z.string().describe("Text for this avatar to speak"),
          voiceId: z.string().optional().describe("Optional voice ID for this avatar"),
          backgroundUrl: z.string().optional().describe("Optional background image URL")
        })).describe("Array of conversation parts with different avatars"),
        aspectRatio: z.enum(["16:9", "9:16", "1:1"]).describe("Video aspect ratio"),
        webhookUrl: z.string().optional().describe("Optional webhook URL for completion notification"),
        waitForCompletion: z.boolean().optional().default(false).describe("Whether to wait for video completion before returning")
      },
      async ({ conversation, aspectRatio, webhookUrl, waitForCompletion }) => {
        try {
          const videoInputs = conversation.map((part, index) => {
            const input: any = {
              character: {
                type: "avatar",
                avatar_id: part.avatarId,
                avatar_style: "normal"
              },
              voice: {
                type: "text",
                input_text: part.text
              }
            };

            if (part.voiceId) {
              input.voice.voice_id = part.voiceId;
            }

            if (part.backgroundUrl) {
              input.background = {
                type: "image",
                url: part.backgroundUrl
              };
            }

            return input;
          });

          const params: any = {
            video_inputs: videoInputs,
            aspect_ratio: aspectRatio
          };

          if (webhookUrl) params.webhook_url = webhookUrl;

          let result;
          if (waitForCompletion) {
            result = await this.creatify.avatar.createAndWaitForMultiAvatarLipsync(params);
          } else {
            result = await this.creatify.avatar.createMultiAvatarLipsync(params);
          }

          return {
            content: [{
              type: "text",
              text: JSON.stringify(result, null, 2)
            }]
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error creating multi-avatar conversation: ${error instanceof Error ? error.message : String(error)}`
            }],
            isError: true
          };
        }
      }
    );

    // Get Video Status tool
    server.tool(
      "get_video_status",
      {
        videoId: z.string().describe("The ID of the video to check status for"),
        videoType: z.enum(["lipsync", "url-to-video", "text-to-speech", "multi-avatar", "ai-editing", "custom-template"]).describe("The type of video/task to check")
      },
      async ({ videoId, videoType }) => {
        try {
          let result;
          
          switch (videoType) {
            case "lipsync":
              result = await this.creatify.avatar.getLipsync(videoId);
              break;
            case "url-to-video":
              result = await this.creatify.urlToVideo.getVideoFromLink(videoId);
              break;
            case "text-to-speech":
              result = await this.creatify.textToSpeech.getTextToSpeech(videoId);
              break;
            case "multi-avatar":
              result = await this.creatify.avatar.getLipsync(videoId); // Multi-avatar uses same endpoint
              break;
            case "ai-editing":
              result = await this.creatify.aiEditing.getAiEditing(videoId);
              break;
            case "custom-template":
              result = await this.creatify.customTemplates.getCustomTemplateVideo(videoId);
              break;
            default:
              throw new Error(`Unknown video type: ${videoType}`);
          }

          return {
            content: [{
              type: "text",
              text: JSON.stringify(result, null, 2)
            }]
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error getting video status: ${error instanceof Error ? error.message : String(error)}`
            }],
            isError: true
          };
        }
      }
    );

    // Create Custom Template Video tool
    server.tool(
      "create_custom_template_video",
      {
        templateId: z.string().describe("The ID or name of the custom template to use"),
        data: z.record(z.any()).describe("Template data as key-value pairs (varies by template)"),
        aspectRatio: z.enum(["16:9", "9:16", "1:1"]).optional().describe("Video aspect ratio"),
        webhookUrl: z.string().optional().describe("Optional webhook URL for completion notification"),
        waitForCompletion: z.boolean().optional().default(false).describe("Whether to wait for video completion before returning")
      },
      async ({ templateId, data, aspectRatio, webhookUrl, waitForCompletion }) => {
        try {
          const params: any = {
            visual_style: templateId,
            data
          };

          if (aspectRatio) params.aspect_ratio = aspectRatio;
          if (webhookUrl) params.webhook_url = webhookUrl;

          let result;
          if (waitForCompletion) {
            result = await this.creatify.customTemplates.createAndWaitForCustomTemplateVideo(params);
          } else {
            result = await this.creatify.customTemplates.createCustomTemplateVideo(params);
          }

          return {
            content: [{
              type: "text",
              text: JSON.stringify(result, null, 2)
            }]
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error creating custom template video: ${error instanceof Error ? error.message : String(error)}`
            }],
            isError: true
          };
        }
      }
    );

    // AI Editing tool
    server.tool(
      "create_ai_edited_video",
      {
        videoUrl: z.string().url().describe("URL to the video file to be edited"),
        editingStyle: z.string().describe("Editing style (e.g., 'film', 'commercial', 'social', 'vlog')"),
        name: z.string().optional().describe("Optional name for the editing task"),
        webhookUrl: z.string().optional().describe("Optional webhook URL for completion notification"),
        waitForCompletion: z.boolean().optional().default(false).describe("Whether to wait for editing completion before returning")
      },
      async ({ videoUrl, editingStyle, name, webhookUrl, waitForCompletion }) => {
        try {
          const params: any = {
            video_url: videoUrl,
            editing_style: editingStyle
          };

          if (name) params.name = name;
          if (webhookUrl) params.webhook_url = webhookUrl;

          let result;
          if (waitForCompletion) {
            result = await this.creatify.aiEditing.createAndWaitForAiEditing(params);
          } else {
            result = await this.creatify.aiEditing.createAiEditing(params);
          }

          return {
            content: [{
              type: "text",
              text: JSON.stringify(result, null, 2)
            }]
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error creating AI edited video: ${error instanceof Error ? error.message : String(error)}`
            }],
            isError: true
          };
        }
      }
    );
  }
}
