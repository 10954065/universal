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
      <div className="relative aspect-video w-full overflow-hidden rounded-tile bg-navy-950">
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
            {posterUrl && (
              <Image
                src={posterUrl}
                alt=""
                fill
                sizes="(min-width: 1024px) 70vw, 100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02] motion-reduce:transition-none"
              />
            )}
            <span aria-hidden="true" className="absolute inset-0 bg-black/25 transition-colors group-hover:bg-black/15" />
            <span className="relative inline-flex h-20 w-20 items-center justify-center rounded-full bg-white/90 text-navy-900 shadow-[0_8px_30px_rgb(0_0_0/0.25)] backdrop-blur-md transition-transform duration-300 ease-out group-hover:scale-105 group-active:scale-95">
              <Play aria-hidden="true" className="ml-1 h-7 w-7 fill-current" />
              <span className="sr-only">Play sermon: {title}</span>
            </span>
          </button>
        )}
        <p className="sr-only">Video loads from {video.provider === "youtube" ? "YouTube" : "Vimeo"} when you press play.</p>
      </div>
    );
  }

  if (audio) {
    return (
      <div className="rounded-card bg-sand p-6">
        <p className="eyebrow text-muted">Listen</p>
        <audio controls preload="none" src={audio} className="mt-4 w-full" onPlay={() => track("Sermon Play", { provider: "audio" })}>
          Your browser does not support audio playback. <a href={audio}>Download the recording</a>.
        </audio>
      </div>
    );
  }

  return (
    <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-tile bg-navy-900 p-8 text-center">
      {posterUrl && <Image src={posterUrl} alt="" fill sizes="(min-width: 1024px) 70vw, 100vw" className="object-cover opacity-30" />}
      <p className="relative max-w-sm text-xl font-semibold tracking-[-0.015em] text-ivory">A recording of this message is not yet available.</p>
    </div>
  );
}
