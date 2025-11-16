// src/components/AuraCanvas.tsx
// NOTE: TypeScript-safe version using `any` for p5 (industry-acceptable for p5)

import React, { useRef } from "react";
import ReactP5 from "react-p5";
import { useSentimentStore } from "../store/useSentimentStore";

const AuraCanvas: React.FC = () => {
  // Zustand sentiment values
  const sentimentScore = useSentimentStore((s) => s.sentimentScore ?? 0.5);
  const sentimentLabel = useSentimentStore((s) => s.sentimentLabel ?? "neutral");

  // Animated lerp refs for smooth transitions
  const hueRef = useRef(200);
  const scaleRef = useRef(0.002);
  const speedRef = useRef(0.003);
  const brightRef = useRef(80);

  // Emotional color palettes
  const palettes: Record<string, { base: number; spread: number }> = {
    negative: { base: 220, spread: 40 }, // blues/purples
    neutral: { base: 180, spread: 20 },  // teal/cyan
    positive: { base: 48, spread: 60 },  // gold/warm
  };

  const getAuraParams = () => {
    const p = palettes[sentimentLabel] ?? palettes.neutral;
    const hue = p.base + (sentimentScore - 0.5) * p.spread;

    return {
      hue,
      noiseScale: 0.0015 + sentimentScore * 0.001,
      speed: 0.002 + sentimentScore * 0.008,
      brightness: sentimentLabel === "negative"
        ? 65
        : sentimentLabel === "neutral"
        ? 85
        : 100
    };
  };

  // p5 setup
  const setup = (p5: any, canvasParentRef: Element) => {
    const canvas = p5
      .createCanvas(window.innerWidth, window.innerHeight)
      .parent(canvasParentRef);

    canvas.style("position", "fixed");
    canvas.style("top", "0");
    canvas.style("left", "0");
    canvas.style("z-index", "-1");

    p5.colorMode(p5.HSB, 360, 100, 100, 100);
    p5.noStroke();
  };

  // p5 draw
  const draw = (p5: any) => {
    const { hue, noiseScale, speed, brightness } = getAuraParams();

    // Smooth transitions with lerp
    hueRef.current = p5.lerp(hueRef.current, hue, 0.04);
    scaleRef.current = p5.lerp(scaleRef.current, noiseScale, 0.03);
    speedRef.current = p5.lerp(speedRef.current, speed, 0.05);
    brightRef.current = p5.lerp(brightRef.current, brightness, 0.05);

    const H = hueRef.current;
    const NS = scaleRef.current;
    const SPD = speedRef.current;
    const B = brightRef.current;

    // Subtle fading background (trail effect)
    p5.fill(0, 0, 0, 12);
    p5.rect(0, 0, p5.width, p5.height);

    const step = 28;
    const t = p5.millis() * SPD;

    // Flow field drawing
    for (let x = 0; x < p5.width; x += step) {
      for (let y = 0; y < p5.height; y += step) {
        const n = p5.noise(x * NS, y * NS, t * 0.0003); // turbulence

        const angle = n * p5.TWO_PI * 2;
        const localHue = H + (n - 0.5) * 40;

        p5.push();
        p5.translate(x, y);
        p5.rotate(angle);

        // Color with soft opacity
        const alpha = 28 + n * 40;
        p5.fill(localHue, 55, B * 0.85, alpha * 0.55);



        // Flow stroke (small rectangles)
        p5.rect(0, 0, step * 0.75, 2.2);

        p5.pop();
      }
    }

    // Emotional energy pulse
    const pulse =
      Math.sin(p5.frameCount * (0.05 + sentimentScore * 0.07)) * 30;

    p5.fill(H, 80, B, 6 + sentimentScore * 10);
    p5.ellipse(
      p5.width / 2,
      p5.height / 2,
      700 + pulse * 8,
      700 + pulse * 8
    );
  };

  const windowResized = (p5: any) => {
    p5.resizeCanvas(window.innerWidth, window.innerHeight);
  };

  return (
    <ReactP5
      setup={setup}
      draw={draw}
      windowResized={windowResized}
      style={{ position: "fixed", inset: 0, zIndex: -1 }}
    />
  );
};

export default AuraCanvas;
