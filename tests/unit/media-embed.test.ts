import { describe, expect, it } from "vitest";
import { isPlayableAudioUrl, parseVideoUrl } from "@/lib/media-embed";

const ID = "dQw4w9WgXcQ";

describe("parseVideoUrl", () => {
  it.each([
    `https://www.youtube.com/watch?v=${ID}`,
    `https://youtube.com/watch?v=${ID}&t=42`,
    `https://m.youtube.com/watch?v=${ID}`,
    `https://youtu.be/${ID}`,
    `https://www.youtube.com/live/${ID}?si=abc`,
    `https://www.youtube.com/shorts/${ID}`,
    `https://www.youtube-nocookie.com/embed/${ID}`,
  ])("recognises YouTube URL %s", (url) => {
    const video = parseVideoUrl(url);
    expect(video?.provider).toBe("youtube");
    expect(video?.id).toBe(ID);
    // Privacy-enhanced mode: no tracking cookies until the visitor plays the video.
    expect(video?.embedUrl).toMatch(/^https:\/\/www\.youtube-nocookie\.com\/embed\//);
  });

  it("recognises Vimeo and disables tracking", () => {
    const video = parseVideoUrl("https://vimeo.com/123456789");
    expect(video).toMatchObject({ provider: "vimeo", id: "123456789", thumbnailUrl: null });
    expect(video?.embedUrl).toContain("dnt=1");
  });

  it.each([
    null,
    "",
    "not a url",
    "javascript:alert(1)",
    `https://evil.example/watch?v=${ID}`,
    "https://www.youtube.com/watch?v=too-short",
    `https://www.youtube.com/watch?v=${ID}"><script>`,
    "https://vimeo.com/channels/staffpicks",
  ])("rejects %j", (url) => {
    expect(parseVideoUrl(url)).toBeNull();
  });
});

describe("isPlayableAudioUrl", () => {
  it("accepts direct https audio files only", () => {
    expect(isPlayableAudioUrl("https://cdn.example.org/sermon.mp3")).toBe(true);
    expect(isPlayableAudioUrl("https://cdn.example.org/sermon.M4A")).toBe(true);
    expect(isPlayableAudioUrl("http://cdn.example.org/sermon.mp3")).toBe(false);
    expect(isPlayableAudioUrl("https://soundcloud.com/ministry/sermon")).toBe(false);
    expect(isPlayableAudioUrl(null)).toBe(false);
  });
});
