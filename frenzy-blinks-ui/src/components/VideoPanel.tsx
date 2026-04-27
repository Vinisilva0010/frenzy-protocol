"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

// Tipos mínimos para a Iframe API (só o que a gente usa aqui)
type YouTubePlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  mute: () => void;
  destroy: () => void;
};

type YouTubePlayerEvent = {
  target: YouTubePlayer;
};

type YouTubePlayerOptions = {
  videoId: string;
  playerVars?: Record<string, any>;
  events?: {
    onReady?: (event: YouTubePlayerEvent) => void;
  };
};

type YouTubeNamespace = {
  Player: new (elementId: string, options: YouTubePlayerOptions) => YouTubePlayer;
};

// Tipo local para window, sem poluir global
type ExtendedWindow = Window &
  typeof globalThis & {
    YT?: YouTubeNamespace;
    onYouTubeIframeAPIReady?: () => void;
  };

export default function VideoPanel() {
  const containerRef = useRef<HTMLElement>(null);
  const videoSectionRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  // Mapeia o scroll na seção (150vh é o tamanho ideal para o efeito de subida)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // O fundo dá um leve zoom out para dar profundidade
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);

  // O painel vem lá de baixo e para no centro exato da tela
  const panelY = useTransform(scrollYProgress, [0, 1], ["50vh", "0vh"]);
  const panelScale = useTransform(scrollYProgress, [0, 1], [0.85, 1]);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;

    const initPlayer = () => {
      const w = window as ExtendedWindow;

      if (!w.YT || !w.YT.Player || playerRef.current) return;

      playerRef.current = new w.YT.Player("youtube-player", {
        videoId: "QVtV_r97h4Y",
        playerVars: {
          autoplay: 0,
          controls: 1,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          mute: 1,
        },
        events: {
          onReady: (event: YouTubePlayerEvent) => {
            event.target.mute();
            setIsPlayerReady(true);

            observer = new IntersectionObserver(
              ([entry]) => {
                if (!playerRef.current) return;

                if (entry.isIntersecting) {
                  playerRef.current.playVideo();
                } else {
                  playerRef.current.pauseVideo();
                }
              },
              {
                threshold: 0.5,
              }
            );

            if (videoSectionRef.current) {
              observer.observe(videoSectionRef.current);
            }
          },
        },
      });
    };

    if (typeof window !== "undefined") {
      const w = window as ExtendedWindow;

      if (w.YT && w.YT.Player) {
        initPlayer();
      } else {
        const existingScript = document.querySelector(
          'script[src="https://www.youtube.com/iframe_api"]'
        );

        if (!existingScript) {
          const tag = document.createElement("script");
          tag.src = "https://www.youtube.com/iframe_api";
          document.body.appendChild(tag);
        }

        w.onYouTubeIframeAPIReady = () => {
          initPlayer();
        };
      }
    }

    return () => {
      if (observer) observer.disconnect();

      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }

      if (typeof window !== "undefined") {
        const w = window as ExtendedWindow;
        w.onYouTubeIframeAPIReady = undefined;
      }
    };
  }, []);

  return (
    <section ref={containerRef} className="relative h-[150vh] w-full bg-[#0A0A0A]">
      {/* Sticky trava a tela enquanto o scroll acontece */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* 1. O BACKGROUND LIMPO */}
        {/* LAYER 1: BACKGROUND ANIMADO (DRIFT & BREATHING) */}
        <motion.div
          style={{ scale: bgScale }}
          className="absolute inset-0 z-[1] pointer-events-none select-none opacity-40 overflow-hidden"
        >
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              x: ["0%", "1%", "-1%", "0%"],
              y: ["0%", "-1%", "1%", "0%"],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative w-full h-full"
          >
            <Image
              src="/alien-bg.webp"
              alt="Alien Tech Background"
              fill
              className="object-cover scale-110"
              priority
            />
          </motion.div>
        </motion.div>

        {/* 2. O PAINEL DE VÍDEO CONSTRUÍDO EM CSS (BULLETPROOF) */}
        <motion.div
          style={{ y: panelY, scale: panelScale }}
          className="relative z-[10] w-[90%] md:w-[70%] max-w-[1200px] border-[6px] md:border-[8px] border-black bg-[#9945FF] p-2 md:p-6 rounded-xl shadow-[15px_15px_0px_0px_#000]"
        >
          {/* Estética do topo do painel (Luzes e título) */}
          <div className="flex justify-between items-center mb-4 px-2">
            <div className="flex gap-3">
              <div className="w-4 h-4 rounded-full bg-[#14F195] border-2 border-black animate-pulse"></div>
              <div className="w-4 h-4 rounded-full bg-black"></div>
              <div className="w-4 h-4 rounded-full bg-black"></div>
            </div>
            <h3
              className="text-black font-black uppercase tracking-widest text-sm md:text-xl"
              style={{ fontFamily: "var(--font-fira)" }}
            >
              // STRATA CORE BRIEFING
            </h3>
          </div>

          {/* 3. O CONTAINER DO VÍDEO */}
          <div
            ref={videoSectionRef}
            className="relative w-full aspect-video border-[6px] border-black bg-zinc-900 overflow-hidden"
          >
            {!isPlayerReady && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0A0A0A] z-[1]">
                <h4
                  className="text-[#14F195] font-black text-2xl md:text-4xl uppercase tracking-tighter"
                  style={{ fontFamily: "var(--font-bebas)" }}
                >
                  AWAITING UPLOAD
                </h4>
                <p className="text-zinc-500 font-mono text-sm mt-2">
                  SYSTEM READY. WAITING FOR VIDEO ID.
                </p>
              </div>
            )}

            <div id="youtube-player" className="relative z-[2] w-full h-full" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}