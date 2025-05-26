#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CreatifyMcpServer } from "./server.js";

/**
 * Main entry point for the Creatify MCP Server
 */
async function main() {
  // Get API credentials from environment variables
  const apiId = process.env.CREATIFY_API_ID;
  const apiKey = process.env.CREATIFY_API_KEY;

  if (!apiId || !apiKey) {
    console.error("Error: CREATIFY_API_ID and CREATIFY_API_KEY environment variables are required");
    console.error("Please set these environment variables with your Creatify API credentials");
    console.error("You can get these from your Creatify account settings");
    process.exit(1);
  }

  try {
    // Create the MCP server
    const server = new McpServer({
      name: "creatify-mcp",
      version: "1.0.0",
    });

    // Initialize the Creatify MCP server with tools and resources
    const creatifyServer = new CreatifyMcpServer(apiId, apiKey);
    await creatifyServer.setupServer(server);

    // Create stdio transport
    const transport = new StdioServerTransport();
    
    // Connect and start the server
    await server.connect(transport);
    
    console.error("Creatify MCP Server started successfully");
  } catch (error) {
    console.error("Failed to start Creatify MCP Server:", error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.error("Received SIGINT, shutting down gracefully");
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.error("Received SIGTERM, shutting down gracefully");
  process.exit(0);
});

// Start the server
main().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});
