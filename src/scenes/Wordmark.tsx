import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY } from "../lib/brand";

export const Wordmark: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [durationInFrames - 6, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Wordmark drops in from above with spring bounce
  const wordmarkSpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 100, mass: 1 },
  });
  const wordmarkY = interpolate(wordmarkSpring, [0, 1], [-300, 0]);

  // Tagline fades in 20 frames later
  const taglineOpacity = spring({
    frame: frame - 20,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  // Hashtags fade in 35 frames later
  const hashtagOpacity = spring({
    frame: frame - 35,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(ellipse 80% 60% at 50% 50%, ${COLORS.orange}22 0%, ${COLORS.teal} 65%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
        opacity: fadeIn * fadeOut,
      }}
    >
      {/* AgentCamp wordmark */}
      <div
        style={{
          transform: `translateY(${wordmarkY}px)`,
          fontFamily: FONT_FAMILY,
          fontSize: 136,
          fontWeight: 900,
          color: COLORS.sand,
          textShadow: `4px 6px 0px ${COLORS.orange}`,
          letterSpacing: -2,
          lineHeight: 1,
          textAlign: "center",
        }}
      >
        AgentCamp
      </div>

      {/* Tagline */}
      <div
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: 42,
          fontWeight: 400,
          color: COLORS.sand,
          opacity: taglineOpacity * 0.8,
          textAlign: "center",
          padding: "0 80px",
          lineHeight: 1.4,
        }}
      >
        A day to build, ship &amp; learn AI agents.
      </div>

      {/* Hashtags */}
      <div
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: 32,
          fontWeight: 500,
          color: COLORS.orange,
          opacity: hashtagOpacity,
          textAlign: "center",
          letterSpacing: 0.5,
        }}
      >
        #AgentCamp &nbsp;&nbsp; #GlobalAICommunity
      </div>
    </div>
  );
};
