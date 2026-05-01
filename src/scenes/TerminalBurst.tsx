import React from "react";
import { useCurrentFrame, interpolate, useVideoConfig } from "remotion";
import { COLORS } from "../lib/brand";

const LINES = [
  { text: "agent.run()", accent: false, hold: 10 },
  { text: "tool_call → success", accent: false, hold: 10 },
  { text: "mcp.connect('accra')", accent: false, hold: 10 },
  { text: "// ship it", accent: true, hold: 18 },
];

// Each line: type-in over 14 frames, hold, then clear over 4 frames (except last)
const TYPE_FRAMES = 14;
const CLEAR_FRAMES = 4;

function getLineSchedule() {
  let cursor = 0;
  return LINES.map((line, i) => {
    const start = cursor;
    const typeEnd = start + TYPE_FRAMES;
    const holdEnd = typeEnd + line.hold;
    const clearEnd = i < LINES.length - 1 ? holdEnd + CLEAR_FRAMES : holdEnd + 60;
    cursor = holdEnd; // next line starts when this one begins clearing
    return { start, typeEnd, holdEnd, clearEnd, ...line };
  });
}

const schedule = getLineSchedule();

export const TerminalBurst: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [durationInFrames - 6, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // CRT flicker — very subtle brightness pulse
  const flickerSeed = Math.floor(frame * 1.7);
  const flicker =
    Math.sin(flickerSeed * 2.3) * Math.cos(flickerSeed * 1.1) * 0.015;

  // Find which line to show (the most recent active one)
  let activeLine = null;
  let charProgress = 0;
  for (const seg of schedule) {
    if (frame >= seg.start) {
      activeLine = seg;
      if (frame < seg.typeEnd) {
        charProgress = interpolate(frame, [seg.start, seg.typeEnd], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
      } else if (frame < seg.holdEnd) {
        charProgress = 1;
      } else if (frame < seg.clearEnd) {
        charProgress = interpolate(frame, [seg.holdEnd, seg.clearEnd], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
      } else {
        charProgress = 0;
        activeLine = null;
      }
    }
  }

  const visibleText = activeLine
    ? activeLine.text.slice(0, Math.round(activeLine.text.length * charProgress))
    : "";

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `rgba(16,64,60,${1 + flicker})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: fadeIn * fadeOut,
      }}
    >
      {/* Subtle scanline CRT effect */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          fontFamily: "'Courier New', 'Courier', monospace",
          fontSize: 58,
          fontWeight: 700,
          color: activeLine?.accent ? COLORS.orange : COLORS.sand,
          textAlign: "center",
          letterSpacing: 2,
          padding: "0 60px",
          minHeight: 80,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textShadow: activeLine?.accent
            ? `0 0 32px ${COLORS.orange}88`
            : `0 0 20px ${COLORS.sand}44`,
          transition: "none",
        }}
      >
        {visibleText}
        <span
          style={{
            display: "inline-block",
            width: 4,
            height: "1em",
            background: activeLine?.accent ? COLORS.orange : COLORS.sand,
            marginLeft: 6,
            opacity: Math.round(frame / 8) % 2 === 0 ? 1 : 0,
            verticalAlign: "middle",
          }}
        />
      </div>
    </div>
  );
};
