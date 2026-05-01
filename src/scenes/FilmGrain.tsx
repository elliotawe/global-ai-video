import React from "react";
import { useCurrentFrame } from "remotion";

// Animated film-grain noise overlay — shifts every 2 frames for a flickery feel
export const FilmGrain: React.FC = () => {
  const frame = useCurrentFrame();
  // Offset the noise pattern each frame to simulate grain movement
  const seed = Math.floor(frame / 2);

  return (
    <svg
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        opacity: 0.045,
        pointerEvents: "none",
        mixBlendMode: "screen",
      }}
    >
      <filter id={`grain-${seed}`}>
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.75"
          numOctaves="4"
          seed={seed}
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect
        width="100%"
        height="100%"
        filter={`url(#grain-${seed})`}
        fill="white"
      />
    </svg>
  );
};
