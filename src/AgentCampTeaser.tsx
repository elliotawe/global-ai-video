import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { HookText } from "./scenes/HookText";
import { TerminalBurst } from "./scenes/TerminalBurst";
import { AccraReveal } from "./scenes/AccraReveal";
import { Wordmark } from "./scenes/Wordmark";
import { DateCard } from "./scenes/DateCard";
import { Signoff } from "./scenes/Signoff";
import { FilmGrain } from "./scenes/FilmGrain";

// Scene boundaries (frames at 30fps)
// S1 HookText:     0–45    → Sequence 0–51   (6 frame fade-out overlap)
// S2 TerminalBurst: 45–120 → Sequence 39–126  (6 frame crossfade each side)
// S3 AccraReveal:  120–225 → Sequence 114–231
// S4 Wordmark:     225–330 → Sequence 219–336
// S5 DateCard:     330–420 → Sequence 324–426 (slam-in, no fade-in)
// S6 Signoff:      420–450 → Sequence 414–450

export const AgentCampTeaser: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#10403c" }}>
      {/* Scene 1 — HookText */}
      <Sequence from={0} durationInFrames={51}>
        <HookText fadeOut />
      </Sequence>

      {/* Scene 2 — TerminalBurst */}
      <Sequence from={39} durationInFrames={87}>
        <TerminalBurst />
      </Sequence>

      {/* Scene 3 — AccraReveal */}
      <Sequence from={114} durationInFrames={117}>
        <AccraReveal />
      </Sequence>

      {/* Scene 4 — Wordmark */}
      <Sequence from={219} durationInFrames={117}>
        <Wordmark />
      </Sequence>

      {/* Scene 5 — DateCard (slam-in) */}
      <Sequence from={324} durationInFrames={102}>
        <DateCard />
      </Sequence>

      {/* Scene 6 — Signoff */}
      <Sequence from={414} durationInFrames={36}>
        <Signoff />
      </Sequence>

      {/* Global film-grain overlay — sits above all scenes */}
      <FilmGrain />
    </AbsoluteFill>
  );
};
