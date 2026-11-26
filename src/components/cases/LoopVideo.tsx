"use client";

import { useEffect, useRef } from "react";

/**
 * Clip corto, mudo y en bucle. Solo se descarga y reproduce cuando está en
 * pantalla (preload="none" + IntersectionObserver), y se pausa al salir.
 * Con "reducir movimiento" activado se queda quieto en el póster.
 */
export function LoopVideo({ src, poster, label }: { src: string; poster: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {
            /* Si el navegador bloquea la reproducción, queda el póster. */
          });
        } else {
          video.pause();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
      className="h-full w-full object-cover"
    />
  );
}
