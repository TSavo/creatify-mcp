#!/usr/bin/env node

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

/**
 * Example MCP client that connects to the Creatify MCP server
 */
async function main() {
  // Create transport to connect to the Creatify MCP server
  const transport = new StdioClientTransport({
    command: "creatify-mcp",
    env: {
      CREATIFY_API_ID: process.env.CREATIFY_API_ID || "your-api-id",
      CREATIFY_API_KEY: process.env.CREATIFY_API_KEY || "your-api-key"
    }
  });

  // Create MCP client
  const client = new Client({
    name: "creatify-example-client",
    version: "1.0.0"
  });

  try {
    // Connect to the server
    console.log("Connecting to Creatify MCP server...");
    await client.connect(transport);
    console.log("Connected successfully!");

    // List available tools
    console.log("\n📋 Available tools:");
    const tools = await client.listTools();
    tools.tools.forEach(tool => {
      console.log(`  - ${tool.name}: ${tool.description}`);
    });

    // List available resources
    console.log("\n📚 Available resources:");
    const resources = await client.listResources();
    resources.resources.forEach(resource => {
      console.log(`  - ${resource.uri}: ${resource.description || resource.name}`);
    });

    // Example: Get available avatars
    console.log("\n🎭 Fetching available avatars...");
    const avatarsResource = await client.readResource({ uri: "creatify://avatars" });
    const avatars = JSON.parse(avatarsResource.contents[0].text);
    console.log(`Found ${avatars.length} avatars:`);
    avatars.slice(0, 3).forEach((avatar: any) => {
      console.log(`  - ${avatar.id}: ${avatar.name}`);
    });

    // Example: Get available voices
    console.log("\n🎤 Fetching available voices...");
    const voicesResource = await client.readResource({ uri: "creatify://voices" });
    const voices = JSON.parse(voicesResource.contents[0].text);
    console.log(`Found ${voices.length} voices:`);
    voices.slice(0, 3).forEach((voice: any) => {
      console.log(`  - ${voice.id}: ${voice.name} (${voice.language})`);
    });

    // Example: Create a simple avatar video
    console.log("\n🎬 Creating avatar video...");
    const videoResult = await client.callTool({
      name: "create_avatar_video",
      arguments: {
        text: "Hello! This is a test video created using the Creatify MCP server.",
        avatarId: avatars[0].id, // Use first available avatar
        aspectRatio: "16:9",
        waitForCompletion: false // Don't wait for completion in this example
      }
    });

    const videoData = JSON.parse(videoResult.content[0].text);
    console.log(`Video creation started! ID: ${videoData.id}`);
    console.log(`Status: ${videoData.status}`);

    // Example: Check video status
    console.log("\n📊 Checking video status...");
    const statusResult = await client.callTool({
      name: "get_video_status",
      arguments: {
        videoId: videoData.id,
        videoType: "lipsync"
      }
    });

    const statusData = JSON.parse(statusResult.content[0].text);
    console.log(`Current status: ${statusData.status}`);
    if (statusData.video_url) {
      console.log(`Video URL: ${statusData.video_url}`);
    }

    // Example: Check remaining credits
    console.log("\n💳 Checking remaining credits...");
    const creditsResource = await client.readResource({ uri: "creatify://credits" });
    const credits = JSON.parse(creditsResource.contents[0].text);
    console.log(`Remaining credits: ${credits.remaining_credits}`);

  } catch (error) {
    console.error("Error:", error);
  } finally {
    // Clean up
    await client.close();
    console.log("\n✅ Disconnected from server");
  }
}

// Run the example
main().catch(console.error);
