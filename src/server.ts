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
          const templates = await this.creatify.customTemplates.getCustomTemplateList();
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

    // Music library resource
    server.resource(
      "music",
      "creatify://music",
      async () => {
        try {
          const music = await this.creatify.musics.getMusics();
          return {
            contents: [{
              uri: "creatify://music",
              mimeType: "application/json",
              text: JSON.stringify(music, null, 2)
            }]
          };
        } catch (error) {
          throw new Error(`Failed to fetch music: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    );

    // Dynamic resource for individual avatar details
    server.resource(
      "avatar-details",
      new ResourceTemplate("creatify://avatar/{avatarId}", { list: undefined }),
      async (uri, { avatarId }) => {
        try {
          // Note: Individual avatar details not available in current API
          // Return basic info that avatar exists
          const avatars = await this.creatify.avatar.getAvatars();
          const avatar = avatars.find(a => a.avatar_id === avatarId);
          if (!avatar) {
            throw new Error(`Avatar ${avatarId} not found`);
          }
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
          result = await this.creatify.urlToVideo.createVideoFromLink(videoParams);

          if (waitForCompletion) {
            // Poll for completion
            let attempts = 0;
            const maxAttempts = 120; // 10 minutes
            while (attempts < maxAttempts && result.status !== 'done' && result.status !== 'error') {
              await new Promise(resolve => setTimeout(resolve, 5000));
              result = await this.creatify.urlToVideo.getVideo(result.id);
              attempts++;
            }
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
          result = await this.creatify.avatar.createMultiAvatarLipsync(params);

          if (waitForCompletion) {
            // Poll for completion
            let attempts = 0;
            const maxAttempts = 120; // 10 minutes
            while (attempts < maxAttempts && result.status !== 'done' && result.status !== 'error') {
              await new Promise(resolve => setTimeout(resolve, 5000));
              result = await this.creatify.avatar.getLipsync(result.id);
              attempts++;
            }
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
              result = await this.creatify.urlToVideo.getVideo(videoId);
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
              result = await this.creatify.customTemplates.getCustomTemplate(videoId);
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
            result = await this.creatify.customTemplates.createAndWaitForCustomTemplate(params);
          } else {
            result = await this.creatify.customTemplates.createCustomTemplate(params);
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

    // How to Use tool - AI can call this to understand parameters better
    server.tool(
      "how_to_use",
      {
        toolName: z.string().describe("Name of the tool to get usage information for"),
        includeExamples: z.boolean().optional().default(true).describe("Whether to include usage examples")
      },
      async ({ toolName, includeExamples }) => {
        try {
          const toolGuides = {
            "create_avatar_video": {
              description: "Create AI avatar videos with lip-sync technology",
              requiredParams: {
                text: "Text for the avatar to speak (max 1000 characters)",
                avatarId: "ID of avatar (get from creatify://avatars resource)",
                aspectRatio: "Video format: '16:9' (landscape), '9:16' (portrait), '1:1' (square)"
              },
              optionalParams: {
                voiceId: "Voice ID (get from creatify://voices resource)",
                name: "Custom name for the video",
                greenScreen: "true/false - use green screen background",
                noCaptions: "true/false - disable captions",
                noMusic: "true/false - disable background music",
                waitForCompletion: "true/false - wait for video to complete before returning"
              },
              examples: includeExamples ? [
                {
                  description: "Simple avatar video",
                  code: `{
  "text": "Hello! Welcome to our product demo.",
  "avatarId": "anna_costume1_cameraA",
  "aspectRatio": "16:9"
}`
                },
                {
                  description: "Avatar video with custom voice and green screen",
                  code: `{
  "text": "This is a professional presentation.",
  "avatarId": "john_suit_cameraB",
  "aspectRatio": "16:9",
  "voiceId": "en-US-GuyNeural",
  "greenScreen": true,
  "waitForCompletion": true
}`
                }
              ] : []
            },
            "create_url_to_video": {
              description: "Convert websites into professional promotional videos",
              requiredParams: {
                url: "Website URL to convert (must be publicly accessible)"
              },
              optionalParams: {
                visualStyle: "Template style (e.g., 'DynamicProductTemplate', 'MinimalClean')",
                scriptStyle: "Narration style (e.g., 'EnthusiasticWriter', 'ProfessionalNarrator')",
                aspectRatio: "Video format: '16:9', '9:16', '1:1'",
                language: "Language code (default: 'en')",
                videoLength: "Desired length in seconds",
                targetAudience: "Target audience description",
                targetPlatform: "Platform optimization ('YouTube', 'TikTok', 'Instagram')"
              },
              examples: includeExamples ? [
                {
                  description: "Convert product page to YouTube video",
                  code: `{
  "url": "https://example.com/product",
  "visualStyle": "DynamicProductTemplate",
  "targetPlatform": "YouTube",
  "aspectRatio": "16:9"
}`
                }
              ] : []
            },
            "generate_text_to_speech": {
              description: "Generate natural-sounding speech from text",
              requiredParams: {
                text: "Text to convert to speech",
                voiceId: "Voice ID (get from creatify://voices resource)"
              },
              optionalParams: {
                name: "Custom name for the audio file",
                waitForCompletion: "true/false - wait for audio to complete"
              },
              examples: includeExamples ? [
                {
                  description: "Generate professional narration",
                  code: `{
  "text": "Welcome to our comprehensive guide.",
  "voiceId": "en-US-AriaNeural",
  "name": "intro-narration"
}`
                }
              ] : []
            },
            "create_multi_avatar_conversation": {
              description: "Create videos with multiple avatars having conversations",
              requiredParams: {
                conversation: "Array of conversation parts with avatarId and text",
                aspectRatio: "Video format: '16:9', '9:16', '1:1'"
              },
              optionalParams: {
                waitForCompletion: "true/false - wait for video to complete"
              },
              examples: includeExamples ? [
                {
                  description: "Two-person conversation",
                  code: `{
  "conversation": [
    {
      "avatarId": "anna_costume1_cameraA",
      "text": "Hi! Let me introduce our new feature.",
      "voiceId": "en-US-AriaNeural"
    },
    {
      "avatarId": "john_suit_cameraB",
      "text": "That sounds amazing! Tell me more.",
      "voiceId": "en-US-GuyNeural"
    }
  ],
  "aspectRatio": "16:9"
}`
                }
              ] : []
            },
            "create_custom_template_video": {
              description: "Generate videos using pre-designed custom templates",
              requiredParams: {
                templateId: "Template ID (get from creatify://templates resource)",
                data: "Template data as key-value pairs (varies by template)"
              },
              optionalParams: {
                aspectRatio: "Video format override",
                waitForCompletion: "true/false - wait for video to complete"
              },
              examples: includeExamples ? [
                {
                  description: "Product showcase template",
                  code: `{
  "templateId": "product-showcase-template",
  "data": {
    "productName": "Amazing Widget",
    "productDescription": "Revolutionary new widget",
    "price": "$99.99",
    "features": ["Feature 1", "Feature 2"]
  }
}`
                }
              ] : []
            },
            "create_ai_edited_video": {
              description: "Automatically edit and enhance existing videos using AI",
              requiredParams: {
                videoUrl: "URL to video file to be edited",
                editingStyle: "Editing style ('film', 'commercial', 'social', 'vlog')"
              },
              optionalParams: {
                name: "Custom name for the edited video",
                waitForCompletion: "true/false - wait for editing to complete"
              },
              examples: includeExamples ? [
                {
                  description: "Edit raw footage into commercial",
                  code: `{
  "videoUrl": "https://example.com/raw-footage.mp4",
  "editingStyle": "commercial",
  "name": "product-commercial"
}`
                }
              ] : []
            },
            "get_video_status": {
              description: "Check status and progress of video generation tasks",
              requiredParams: {
                videoId: "ID of the video/task to check",
                videoType: "Type: 'lipsync', 'url-to-video', 'text-to-speech', 'multi-avatar', 'ai-editing', 'custom-template'"
              },
              examples: includeExamples ? [
                {
                  description: "Check avatar video status",
                  code: `{
  "videoId": "video_abc123",
  "videoType": "lipsync"
}`
                }
              ] : []
            },
            "create_ai_shorts": {
              description: "Create short-form videos using AI (perfect for TikTok, Instagram Reels, YouTube Shorts)",
              requiredParams: {
                prompt: "Text prompt describing the short video content"
              },
              optionalParams: {
                aspectRatio: "Video format (default: '9:16' for shorts)",
                duration: "Duration in seconds (typically 15-60 for shorts)",
                style: "Visual style for the video",
                waitForCompletion: "true/false - wait for video completion"
              },
              examples: includeExamples ? [
                {
                  description: "Create a TikTok-style short",
                  code: `{
  "prompt": "A quick tutorial on making coffee with energetic music",
  "aspectRatio": "9:16",
  "duration": 30,
  "style": "energetic"
}`
                }
              ] : []
            },
            "generate_ai_script": {
              description: "Generate AI-powered scripts for videos",
              requiredParams: {
                topic: "Topic or subject for the script"
              },
              optionalParams: {
                scriptType: "Type of script ('commercial', 'educational', 'entertainment')",
                duration: "Target duration in seconds",
                tone: "Tone of script ('professional', 'casual', 'enthusiastic')",
                targetAudience: "Target audience description",
                waitForCompletion: "true/false - wait for script completion"
              },
              examples: includeExamples ? [
                {
                  description: "Generate educational script",
                  code: `{
  "topic": "Introduction to renewable energy",
  "scriptType": "educational",
  "duration": 120,
  "tone": "professional",
  "targetAudience": "college students"
}`
                }
              ] : []
            },
            "create_custom_avatar": {
              description: "Design and create your own custom avatar (DYOA - Design Your Own Avatar)",
              requiredParams: {
                description: "Detailed description of the avatar to create"
              },
              optionalParams: {
                gender: "Gender ('male', 'female', 'non-binary')",
                ageRange: "Age range (e.g., '20-30', '40-50')",
                ethnicity: "Ethnicity or appearance description",
                clothing: "Clothing style description",
                background: "Background setting description",
                waitForCompletion: "true/false - wait for avatar creation"
              },
              examples: includeExamples ? [
                {
                  description: "Create professional business avatar",
                  code: `{
  "description": "Professional businesswoman with confident demeanor",
  "gender": "female",
  "ageRange": "30-40",
  "clothing": "Navy blue business suit",
  "background": "Modern office setting"
}`
                }
              ] : []
            },
            "manage_music": {
              description: "Manage music files for video backgrounds",
              requiredParams: {
                action: "Action to perform ('list', 'upload', 'delete', 'get')"
              },
              optionalParams: {
                musicId: "Music ID (required for 'delete' and 'get' actions)",
                musicUrl: "URL to music file (required for 'upload' action)",
                name: "Name for the music (optional for 'upload' action)"
              },
              examples: includeExamples ? [
                {
                  description: "List all available music",
                  code: `{
  "action": "list"
}`
                },
                {
                  description: "Upload new background music",
                  code: `{
  "action": "upload",
  "musicUrl": "https://example.com/background-music.mp3",
  "name": "Upbeat Background Track"
}`
                }
              ] : []
            },
            "create_advanced_lipsync": {
              description: "Create advanced lip-sync videos with enhanced emotion and gesture control",
              requiredParams: {
                text: "Text to be spoken by the avatar",
                avatarId: "ID of the avatar to use",
                voiceId: "Voice ID for the avatar",
                aspectRatio: "Video aspect ratio"
              },
              optionalParams: {
                emotionIntensity: "Emotion intensity (0-1)",
                gestureIntensity: "Gesture intensity (0-1)",
                backgroundMusic: "Background music ID",
                name: "Custom name for the video",
                waitForCompletion: "true/false - wait for video completion"
              },
              examples: includeExamples ? [
                {
                  description: "Create expressive avatar video",
                  code: `{
  "text": "I'm so excited to share this amazing news with you!",
  "avatarId": "anna_costume1_cameraA",
  "voiceId": "en-US-AriaNeural",
  "aspectRatio": "16:9",
  "emotionIntensity": 0.8,
  "gestureIntensity": 0.7
}`
                }
              ] : []
            }
          };

          const guide = toolGuides[toolName as keyof typeof toolGuides];
          if (!guide) {
            return {
              content: [{
                type: "text",
                text: `Tool '${toolName}' not found. Available tools: ${Object.keys(toolGuides).join(', ')}`
              }],
              isError: true
            };
          }

          let response = `# ${toolName}\n\n${guide.description}\n\n`;

          response += "## Required Parameters:\n";
          for (const [param, desc] of Object.entries(guide.requiredParams)) {
            response += `- **${param}**: ${desc}\n`;
          }

          if (Object.keys(guide.optionalParams).length > 0) {
            response += "\n## Optional Parameters:\n";
            for (const [param, desc] of Object.entries(guide.optionalParams)) {
              response += `- **${param}**: ${desc}\n`;
            }
          }

          if (includeExamples && guide.examples && guide.examples.length > 0) {
            response += "\n## Examples:\n";
            guide.examples.forEach((example, index) => {
              response += `\n### ${example.description}:\n\`\`\`json\n${example.code}\n\`\`\`\n`;
            });
          }

          response += "\n## Tips:\n";
          response += "- Use creatify://avatars resource to get available avatar IDs\n";
          response += "- Use creatify://voices resource to get available voice IDs\n";
          response += "- Use creatify://credits resource to check remaining credits\n";
          response += "- Set waitForCompletion=true for synchronous operation\n";
          response += "- Use get_video_status to monitor long-running tasks\n";

          return {
            content: [{
              type: "text",
              text: response
            }]
          };
        } catch (error) {
          return {
            content: [{
              type: "text",
              text: `Error getting usage information: ${error instanceof Error ? error.message : String(error)}`
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

    // AI Shorts tool
    server.tool(
      "create_ai_shorts",
      {
        prompt: z.string().describe("Text prompt describing the short video to create"),
        aspectRatio: z.enum(["16:9", "9:16", "1:1"]).optional().default("9:16").describe("Video aspect ratio (shorts are typically 9:16)"),
        duration: z.number().optional().describe("Desired duration in seconds (typically 15-60 for shorts)"),
        style: z.string().optional().describe("Visual style for the short video"),
        webhookUrl: z.string().optional().describe("Optional webhook URL for completion notification"),
        waitForCompletion: z.boolean().optional().default(false).describe("Whether to wait for video completion before returning")
      },
      async ({ prompt, aspectRatio, duration, style, webhookUrl, waitForCompletion }) => {
        try {
          const params: any = {
            prompt,
            aspect_ratio: aspectRatio
          };

          if (duration) params.duration = duration;
          if (style) params.style = style;
          if (webhookUrl) params.webhook_url = webhookUrl;

          let result;
          if (waitForCompletion) {
            result = await this.creatify.aiShorts.createAndWaitForAiShorts(params);
          } else {
            result = await this.creatify.aiShorts.createAiShorts(params);
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
              text: `Error creating AI shorts: ${error instanceof Error ? error.message : String(error)}`
            }],
            isError: true
          };
        }
      }
    );

    // AI Scripts tool
    server.tool(
      "generate_ai_script",
      {
        topic: z.string().describe("Topic or subject for the script"),
        scriptType: z.string().optional().describe("Type of script (e.g., 'commercial', 'educational', 'entertainment')"),
        duration: z.number().optional().describe("Target duration in seconds"),
        tone: z.string().optional().describe("Tone of the script (e.g., 'professional', 'casual', 'enthusiastic')"),
        targetAudience: z.string().optional().describe("Target audience for the script"),
        webhookUrl: z.string().optional().describe("Optional webhook URL for completion notification"),
        waitForCompletion: z.boolean().optional().default(false).describe("Whether to wait for script completion before returning")
      },
      async ({ topic, scriptType, duration, tone, targetAudience, webhookUrl, waitForCompletion }) => {
        try {
          const params: any = {
            topic
          };

          if (scriptType) params.script_type = scriptType;
          if (duration) params.duration = duration;
          if (tone) params.tone = tone;
          if (targetAudience) params.target_audience = targetAudience;
          if (webhookUrl) params.webhook_url = webhookUrl;

          let result;
          if (waitForCompletion) {
            result = await this.creatify.aiScripts.createAndWaitForAiScript(params);
          } else {
            result = await this.creatify.aiScripts.createAiScript(params);
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
              text: `Error generating AI script: ${error instanceof Error ? error.message : String(error)}`
            }],
            isError: true
          };
        }
      }
    );

    // Design Your Own Avatar (DYOA) tool
    server.tool(
      "create_custom_avatar",
      {
        description: z.string().describe("Description of the avatar to create"),
        gender: z.enum(["male", "female", "non-binary"]).optional().describe("Gender of the avatar"),
        ageRange: z.string().optional().describe("Age range (e.g., '20-30', '40-50')"),
        ethnicity: z.string().optional().describe("Ethnicity or appearance description"),
        clothing: z.string().optional().describe("Clothing style description"),
        background: z.string().optional().describe("Background setting description"),
        webhookUrl: z.string().optional().describe("Optional webhook URL for completion notification"),
        waitForCompletion: z.boolean().optional().default(false).describe("Whether to wait for avatar creation before returning")
      },
      async ({ description, gender, ageRange, ethnicity, clothing, background, webhookUrl, waitForCompletion }) => {
        try {
          const params: any = {
            description
          };

          if (gender) params.gender = gender;
          if (ageRange) params.age_range = ageRange;
          if (ethnicity) params.ethnicity = ethnicity;
          if (clothing) params.clothing = clothing;
          if (background) params.background = background;
          if (webhookUrl) params.webhook_url = webhookUrl;

          let result;
          if (waitForCompletion) {
            result = await this.creatify.dyoa.createAndWaitForDyoa(params);
          } else {
            result = await this.creatify.dyoa.createDyoa(params);
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
              text: `Error creating custom avatar: ${error instanceof Error ? error.message : String(error)}`
            }],
            isError: true
          };
        }
      }
    );

    // Music Management tool
    server.tool(
      "manage_music",
      {
        action: z.enum(["list", "upload", "delete", "get"]).describe("Action to perform: list, upload, delete, or get music"),
        musicId: z.string().optional().describe("Music ID (required for delete and get actions)"),
        musicUrl: z.string().optional().describe("URL to music file (required for upload action)"),
        name: z.string().optional().describe("Name for the music (optional for upload action)")
      },
      async ({ action, musicId, musicUrl, name }) => {
        try {
          let result;

          switch (action) {
            case "list":
              result = await this.creatify.musics.getMusics();
              break;
            case "upload":
              if (!musicUrl) {
                throw new Error("musicUrl is required for upload action");
              }
              const uploadParams: any = { music_url: musicUrl };
              if (name) uploadParams.name = name;
              result = await this.creatify.musics.createMusic(uploadParams);
              break;
            case "delete":
              if (!musicId) {
                throw new Error("musicId is required for delete action");
              }
              result = await this.creatify.musics.deleteMusic(musicId);
              break;
            case "get":
              if (!musicId) {
                throw new Error("musicId is required for get action");
              }
              result = await this.creatify.musics.getMusic(musicId);
              break;
            default:
              throw new Error(`Unknown action: ${action}`);
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
              text: `Error managing music: ${error instanceof Error ? error.message : String(error)}`
            }],
            isError: true
          };
        }
      }
    );

    // Advanced Lipsync V2 tool
    server.tool(
      "create_advanced_lipsync",
      {
        text: z.string().describe("Text to be spoken by the avatar"),
        avatarId: z.string().describe("ID of the avatar to use"),
        voiceId: z.string().describe("Voice ID for the avatar"),
        aspectRatio: z.enum(["16:9", "9:16", "1:1"]).describe("Video aspect ratio"),
        emotionIntensity: z.number().optional().describe("Emotion intensity (0-1)"),
        gestureIntensity: z.number().optional().describe("Gesture intensity (0-1)"),
        backgroundMusic: z.string().optional().describe("Background music ID"),
        name: z.string().optional().describe("Optional name for the video"),
        webhookUrl: z.string().optional().describe("Optional webhook URL for completion notification"),
        waitForCompletion: z.boolean().optional().default(false).describe("Whether to wait for video completion before returning")
      },
      async ({ text, avatarId, voiceId, aspectRatio, emotionIntensity, gestureIntensity, backgroundMusic, name, webhookUrl, waitForCompletion }) => {
        try {
          const params: any = {
            text,
            avatar_id: avatarId,
            voice_id: voiceId,
            aspect_ratio: aspectRatio
          };

          if (emotionIntensity !== undefined) params.emotion_intensity = emotionIntensity;
          if (gestureIntensity !== undefined) params.gesture_intensity = gestureIntensity;
          if (backgroundMusic) params.background_music = backgroundMusic;
          if (name) params.name = name;
          if (webhookUrl) params.webhook_url = webhookUrl;

          let result;
          if (waitForCompletion) {
            result = await this.creatify.lipsyncV2.createAndWaitForLipsyncV2(params);
          } else {
            result = await this.creatify.lipsyncV2.createLipsyncV2(params);
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
              text: `Error creating advanced lipsync: ${error instanceof Error ? error.message : String(error)}`
            }],
            isError: true
          };
        }
      }
    );
  }
}
