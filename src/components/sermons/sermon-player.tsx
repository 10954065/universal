"use client";

import Image from "next/image";
import { useState } from "react";
import { Play } from "lucide-react";
import { parseVideoUrl, isPlayableAudioUrl } from "@/lib/media-embed";
import { track } from "@/lib/analytics";

interface SermonPlayerProps {
  title: string;
  videoUrl: string | null;
  audioUrl: string | null;
  poster: { url: string; alt: string } | null;
}

/**
 * Click-to-load player. No third-party video code (or cookies) loads until the
 * visitor presses play; YouTube uses the privacy-enhanced nocookie domain.
 */
export function SermonPlayer({ title, videoUrl, audioUrl, poster }: SermonPlayerProps) {
  const [playing, setPlaying] = useState(false);
  const video = parseVideoUrl(videoUrl);
  const audio = isPlayableAudioUrl(audioUrl) ? audioUrl : null;
  const posterUrl = poster?.url ?? video?.thumbnailUrl ?? null;

  if (video) {
    return (
      <div className="relative aspect-video w-full overflow-hidden bg-navy-950">
        {playing ? (
          <iframe
            src={video.embedUrl}
            title={`Video: ${title}`}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              setPlaying(true);
              track("Sermon Play", { provider: video.provider });
            }}
            className="group absolute inset-0 flex h-full w-full items-center justify-center"
          >
            {posterUrl && <Image src={posterUrl} alt="" fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover opacity-80 transition-opacity group-hover:opacity-90" />}
            <span aria-hidden="true" className="absolute inset-0 bg-navy-950/35" />
            <span className="relative inline-flex items-center gap-4 bg-ivory px-6 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-navy-900 transition-transform duration-300 group-hover:scale-[1.03]">
              <Play aria-hidden="true" className="h-4 w-4 fill-current" />
              Play sermon<span className="sr-only">: {title}</span>
            </span>
          </button>
        )}
        <p className="sr-only">Video loads from {video.provider === "youtube" ? "YouTube" : "Vimeo"} when you press play.</p>
      </div>
    );
  }

  if (audio) {
    return (
      <div className="border border-line bg-ivory-100 p-6">
        <p className="eyebrow text-gold-ink">Listen</p>
        <audio controls preload="none" src={audio} className="mt-4 w-full" onPlay={() => track("Sermon Play", { provider: "audio" })}>
          Your browser does not support audio playback. <a href={audio}>Download the recording</a>.
        </audio>
      </div>
    );
  }

  return (
    <div className="grain relative flex aspect-video w-full items-center justify-center overflow-hidden bg-navy-900 p-8 text-center">
      {posterUrl && <Image src={posterUrl} alt="" fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover opacity-30" />}
      <p className="relative max-w-sm font-display text-2xl italic text-ivory">A recording of this message is not yet available.</p>
    </div>
  );
}
