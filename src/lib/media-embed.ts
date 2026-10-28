export type VideoEmbed =
  | { provider: "youtube"; id: string; embedUrl: string; thumbnailUrl: string; watchUrl: string }
  | { provider: "vimeo"; id: string; embedUrl: string; thumbnailUrl: null; watchUrl: string };

const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;

/**
 * Parses a YouTube or Vimeo URL into privacy-conscious embed details.
 * YouTube uses youtube-nocookie.com; Vimeo uses dnt=1. Returns null for anything else.
 */
export function parseVideoUrl(raw: string | null | undefined): VideoEmbed | null {
  if (!raw) return null;
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  const host = url.hostname.replace(/^www\.|^m\./, "");

  let youtubeId: string | null = null;
  if (host === "youtu.be") youtubeId = url.pathname.slice(1).split("/")[0] ?? null;
  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (url.pathname === "/watch") youtubeId = url.searchParams.get("v");
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts[0] && ["embed", "live", "shorts", "v"].includes(parts[0])) youtubeId = parts[1] ?? null;
  }
  if (youtubeId && YOUTUBE_ID.test(youtubeId)) {
    return {
      provider: "youtube",
      id: youtubeId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1&autoplay=1`,
      thumbnailUrl: `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`,
      watchUrl: `https://www.youtube.com/watch?v=${youtubeId}`,
    };
  }

  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const id = url.pathname.split("/").filter(Boolean).find((part) => /^\d{6,12}$/.test(part));
    if (id) {
      return {
        provider: "vimeo",
        id,
        embedUrl: `https://player.vimeo.com/video/${id}?dnt=1&autoplay=1`,
        thumbnailUrl: null,
        watchUrl: `https://vimeo.com/${id}`,
      };
    }
  }
  return null;
}

/** Accepts only direct https audio file links that a native <audio> element can play. */
export function isPlayableAudioUrl(raw: string | null | undefined): boolean {
  if (!raw) return false;
  try {
    const url = new URL(raw);
    return url.protocol === "https:" && /\.(mp3|m4a|aac|ogg|oga|wav|opus)$/i.test(url.pathname);
  } catch {
    return false;
  }
}
