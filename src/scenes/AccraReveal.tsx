import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY } from "../lib/brand";

// Each landmark assembles from below with a spring, staggered by 8 frames
function useLandmarkY(frame: number, fps: number, delay: number) {
  const s = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 100, mass: 1 },
  });
  return interpolate(s, [0, 1], [180, 0]);
}

const SunRise: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const s = spring({ frame: frame - 10, fps, config: { damping: 14, stiffness: 80 } });
  const y = interpolate(s, [0, 1], [200, 0]);
  const opacity = interpolate(s, [0, 0.3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <circle
      cx="540"
      cy={540 + y}
      r="180"
      fill={COLORS.sand}
      opacity={opacity * 0.35}
    />
  );
};

const IndependenceArch: React.FC<{ y: number }> = ({ y }) => (
  <g transform={`translate(0, ${y})`}>
    {/* Left pillar */}
    <rect x="160" y="900" width="60" height="280" fill={COLORS.brick} />
    {/* Right pillar */}
    <rect x="300" y="900" width="60" height="280" fill={COLORS.brick} />
    {/* Arch */}
    <path
      d="M160 900 Q190 800 320 900"
      fill="none"
      stroke={COLORS.orange}
      strokeWidth="50"
      strokeLinecap="round"
    />
    {/* Star on top */}
    <polygon
      points="220,780 228,800 248,800 233,812 239,832 220,820 201,832 207,812 192,800 212,800"
      fill={COLORS.sand}
    />
  </g>
);

const DomBuilding: React.FC<{ y: number }> = ({ y }) => (
  <g transform={`translate(0, ${y})`}>
    {/* Main body */}
    <rect x="680" y="980" width="200" height="200" fill={COLORS.olive} />
    {/* Dome */}
    <ellipse cx="780" cy="980" rx="120" ry="80" fill={COLORS.brick} />
    {/* Dome top cap */}
    <ellipse cx="780" cy="905" rx="40" ry="28" fill={COLORS.orange} />
    {/* Columns */}
    {[700, 730, 760, 790, 820, 850].map((x) => (
      <rect key={x} x={x} y="930" width="16" height="50" fill={COLORS.sand} opacity={0.6} />
    ))}
  </g>
);

const PalmTree: React.FC<{ x: number; y: number; scale?: number }> = ({
  x,
  y,
  scale = 1,
}) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`}>
    {/* Trunk */}
    <path
      d={`M0,0 Q8,-60 0,-140`}
      stroke={COLORS.olive}
      strokeWidth="14"
      fill="none"
      strokeLinecap="round"
    />
    {/* Fronds */}
    {[-40, -20, 0, 20, 40].map((angle, i) => (
      <path
        key={i}
        d={`M0,-140 Q${angle * 1.5},-170 ${angle * 2.5},-145`}
        stroke={COLORS.olive}
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
        opacity={0.85}
      />
    ))}
  </g>
);

export const AccraReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Wipe transition: sand-yellow strip sweeps left to right over 15 frames
  const wipeProgress = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const fadeOut = interpolate(frame, [durationInFrames - 6, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const archY = useLandmarkY(frame, fps, 18);
  const domeY = useLandmarkY(frame, fps, 26);
  const palmLeftY = useLandmarkY(frame, fps, 12);
  const palmRightY = useLandmarkY(frame, fps, 22);

  const subtitleOpacity = interpolate(frame, [55, 75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: COLORS.teal,
        overflow: "hidden",
        opacity: fadeOut,
      }}
    >
      {/* Sand wipe overlay — reveals scene by sliding off to the right */}
      {wipeProgress < 1 && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${(1 - wipeProgress) * 100}%`,
            height: "100%",
            background: COLORS.sand,
            zIndex: 10,
          }}
        />
      )}

      {/* SVG landmark scene */}
      <svg
        viewBox="0 0 1080 1920"
        width="1080"
        height="1920"
        style={{ position: "absolute", inset: 0 }}
      >
        {/* Rising sun */}
        <SunRise frame={frame} fps={fps} />

        {/* Ground line */}
        <rect x="0" y="1180" width="1080" height="740" fill={COLORS.olive} opacity={0.25} />

        {/* Palm trees */}
        <g transform={`translate(0, ${palmLeftY})`}>
          <PalmTree x={80} y={1180} scale={1.1} />
          <PalmTree x={160} y={1200} scale={0.85} />
        </g>
        <g transform={`translate(0, ${palmRightY})`}>
          <PalmTree x={940} y={1180} scale={1.0} />
          <PalmTree x={1010} y={1200} scale={0.8} />
        </g>

        {/* Landmarks */}
        <IndependenceArch y={archY} />
        <DomBuilding y={domeY} />

        {/* Horizon glow */}
        <rect
          x="0"
          y="1100"
          width="1080"
          height="80"
          fill={COLORS.orange}
          opacity={0.12}
        />
      </svg>

      {/* Subtitle */}
      <div
        style={{
          position: "absolute",
          bottom: 180,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONT_FAMILY,
          fontSize: 48,
          fontWeight: 400,
          color: COLORS.sand,
          opacity: subtitleOpacity,
          letterSpacing: 1,
        }}
      >
        Accra is hosting.
      </div>
    </div>
  );
};
