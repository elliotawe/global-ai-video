import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY } from "../lib/brand";

export const DateCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const fadeOut = interpolate(frame, [durationInFrames - 6, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Date slams in: scale 1.4 → 1.0 with a fast spring
  const slamSpring = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 200, mass: 1 },
  });
  const dateScale = interpolate(slamSpring, [0, 1], [1.4, 1.0]);

  // Vertical shake on landing — only first ~8 frames after slam settles
  const shakeDecay = interpolate(frame, [4, 12], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shake = Math.sin(frame * 2.8) * 3 * shakeDecay;

  // Time fades in 12 frames later
  const timeOpacity = spring({
    frame: frame - 12,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  // Location text fades in 22 frames later
  const locationOpacity = spring({
    frame: frame - 22,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  // Pulsing dot
  const dotPulse = Math.abs(Math.sin((frame / fps) * Math.PI * 1.5));

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: COLORS.teal,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 28,
        opacity: fadeOut,
      }}
    >
      {/* Date stamp */}
      <div
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: 120,
          fontWeight: 900,
          color: COLORS.sand,
          letterSpacing: -3,
          lineHeight: 1,
          textAlign: "center",
          transform: `scale(${dateScale}) translateY(${shake}px)`,
        }}
      >
        MAY 30, 2026
      </div>

      {/* Time */}
      <div
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: 56,
          fontWeight: 500,
          color: COLORS.orange,
          opacity: timeOpacity,
          letterSpacing: 1,
        }}
      >
        10 AM – 3 PM
      </div>

      {/* Location dropping soon */}
      <div
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: 36,
          fontWeight: 400,
          color: COLORS.sand,
          opacity: locationOpacity * 0.7,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: COLORS.orange,
            display: "inline-block",
            opacity: 0.5 + dotPulse * 0.5,
            transform: `scale(${0.85 + dotPulse * 0.3})`,
          }}
        />
        Location dropping soon
      </div>
    </div>
  );
};
