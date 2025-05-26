import { describe, it, expect, vi, beforeEach } from "vitest";
import { CreatifyMcpServer } from "../src/server.js";

// Mock the Creatify client
vi.mock("@tsavo/creatify-api-ts", () => ({
  Creatify: vi.fn().mockImplementation(() => ({
    avatar: {
      getAvatars: vi.fn().mockResolvedValue([
        { id: "avatar1", name: "Test Avatar 1" },
        { id: "avatar2", name: "Test Avatar 2" }
      ]),
      getVoices: vi.fn().mockResolvedValue([
        { id: "voice1", name: "Test Voice 1", language: "en" },
        { id: "voice2", name: "Test Voice 2", language: "en" }
      ]),
      createLipsync: vi.fn().mockResolvedValue({
        id: "video123",
        status: "processing"
      }),
      getLipsync: vi.fn().mockResolvedValue({
        id: "video123",
        status: "completed",
        video_url: "https://example.com/video.mp4"
      })
    },
    workspace: {
      getRemainingCredits: vi.fn().mockResolvedValue({
        remaining_credits: 100
      })
    },
    customTemplates: {
      getCustomTemplates: vi.fn().mockResolvedValue([
        { id: "template1", name: "Test Template 1" }
      ])
    }
  }))
}));

describe("CreatifyMcpServer", () => {
  let server: CreatifyMcpServer;

  beforeEach(() => {
    server = new CreatifyMcpServer("test-api-id", "test-api-key");
  });

  it("should create server instance", () => {
    expect(server).toBeInstanceOf(CreatifyMcpServer);
  });

  it("should initialize with API credentials", () => {
    expect(server).toBeDefined();
  });
});
