// AgentCamp 2026 brand tokens
export const COLORS = {
  teal: "#10403c",
  orange: "#fe821e",
  sand: "#f5cd7c",
  brick: "#973618",
  olive: "#837749",
} as const;

// TODO: swap Inter for self-hosted Lufga once a .woff2 is available.
// To do that: place lufga.woff2 in public/fonts/, then replace the
// @remotion/google-fonts import in src/lib/fonts.ts with:
//   import { loadFont } from "@remotion/fonts";
//   loadFont({ family: "Lufga", url: staticFile("fonts/lufga.woff2"), weight: "400" });
// and update FONT_FAMILY to "Lufga".
export const FONT_FAMILY = "Inter, sans-serif";

export const SPRING = { damping: 12, stiffness: 100 } as const;
