import React from "react";
import { useCurrentFrame, spring, useVideoConfig } from "remotion";
import { COLORS, FONT_FAMILY } from "../lib/brand";

export const Signoff: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const makeOpacity = (delay: number) =>
    spring({
      frame: frame - delay,
      fps,
      config: { damping: 14, stiffness: 80 },
    });

  const op0 = makeOpacity(0);
  const op1 = makeOpacity(4);
  const op2 = makeOpacity(8);
  const op3 = makeOpacity(14);

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
        gap: 16,
        padding: "0 60px",
      }}
    >
      <div
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: 36,
          fontWeight: 400,
          color: COLORS.sand,
          opacity: op0 * 0.7,
          textAlign: "center",
        }}
      >
        Brought to you by
      </div>

      <div
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: 72,
          fontWeight: 700,
          color: COLORS.orange,
          opacity: op1,
          textAlign: "center",
          lineHeight: 1.1,
        }}
      >
        Global AI Accra
      </div>

      <div
        style={{
          fontFamily: FONT_FAMILY,
          fontSize: 36,
          fontWeight: 500,
          color: COLORS.sand,
          opacity: op2,
          textAlign: "center",
          letterSpacing: 0.5,
        }}
      >
        @globalaiaccra
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: FONT_FAMILY,
          fontSize: 28,
          fontWeight: 400,
          color: COLORS.sand,
          opacity: op3 * 0.6,
          letterSpacing: 0.3,
        }}
      >
        globalai.community/chapters/accra
      </div>
    </div>
  );
};
