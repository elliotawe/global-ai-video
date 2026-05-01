import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY } from "../lib/brand";

const WORDS = "What if your code could think for itself?".split(" ");
const STAGGER = 4; // frames between each word

export const HookText: React.FC<{ fadeOut?: boolean }> = ({ fadeOut }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const sceneOpacity = fadeOut
    ? interpolate(frame, [durationInFrames - 6, durationInFrames], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  const fadeInOpacity = interpolate(frame, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Blinking cursor at 2 Hz — alternates every (fps/2) frames
  const halfPeriod = Math.round(fps / 4);
  const cursorVisible = Math.floor(frame / halfPeriod) % 2 === 0;
  const lastWordEndFrame = WORDS.length * STAGGER + 8;
  const showCursor = frame >= lastWordEndFrame;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: COLORS.teal,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: sceneOpacity * fadeInOpacity,
      }}
    >
      <div
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: 64,
          fontWeight: 500,
          color: COLORS.sand,
          textAlign: "center",
          padding: "0 80px",
          lineHeight: 1.3,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0 16px",
          rowGap: 8,
        }}
      >
        {WORDS.map((word, i) => {
          const wordFrame = i * STAGGER;
          const wordOpacity = spring({
            frame: frame - wordFrame,
            fps,
            config: { damping: 14, stiffness: 120, mass: 1 },
          });
          const wordY = interpolate(wordOpacity, [0, 1], [20, 0]);

          return (
            <span
              key={i}
              style={{
                opacity: wordOpacity,
                transform: `translateY(${wordY}px)`,
                display: "inline-block",
              }}
            >
              {word}
            </span>
          );
        })}
        {showCursor && (
          <span
            style={{
              color: COLORS.orange,
              opacity: cursorVisible ? 1 : 0,
              display: "inline-block",
            }}
          >
            |
          </span>
        )}
      </div>
    </div>
  );
};
