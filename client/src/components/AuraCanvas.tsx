// src/components/AuraCanvas.tsx (LIGHTWEIGHT CLEAN VERSION)

import React, { useRef } from "react";
import ReactP5 from "react-p5";
import { useSentimentStore } from "../store/useSentimentStore";

const AuraCanvas: React.FC = () => {
  const sentimentScore = useSentimentStore((s) => s.sentimentScore ?? 0.5);
  const sentimentLabel = useSentimentStore((s) => s.sentimentLabel ?? "neutral");

  const hueRef = useRef(180);
  const noiseScaleRef = useRef(0.001);
  const speedRef = useRef(0.001);

  const palette = {
    positive: 45,     // warm gold
    neutral: 180,     // cyan / teal
    negative: 250,    // blue/purple
  };

  const setup = (p5: any, parent: any) => {
    const canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight);
    canvas.parent(parent);

    canvas.style("position", "fixed");
    canvas.style("top", 0);
    canvas.style("left", 0);
    canvas.style("z-index", "-2");

    p5.colorMode(p5.HSB, 360, 100, 100, 100);
    p5.noStroke();
  };

  const draw = (p5: any) => {
    const targetHue = palette[sentimentLabel];
    hueRef.current = p5.lerp(hueRef.current, targetHue, 0.02);

    noiseScaleRef.current = p5.lerp(
      noiseScaleRef.current,
      0.0006 + sentimentScore * 0.001,
      0.03
    );

    speedRef.current = p5.lerp(
      speedRef.current,
      0.0005 + sentimentScore * 0.002,
      0.03
    );

    const ns = noiseScaleRef.current;
    const t = p5.millis() * speedRef.current;

    // very light fading
    p5.fill(0, 0, 0, 5);
    p5.rect(0, 0, p5.width, p5.height);

    const step = 42; // <-- BIGGER SPACING = airy look

    for (let x = 0; x < p5.width; x += step) {
      for (let y = 0; y < p5.height; y += step) {
        const n = p5.noise(x * ns, y * ns, t);
        const angle = n * p5.TWO_PI * 1.5;

        const hue = (hueRef.current + n * 25) % 360;

        p5.push();
        p5.translate(x, y);
        p5.rotate(angle);

        p5.fill(hue, 50, 85, 45);
        p5.rect(0, 0, 60, 2); // thin, spaced-out ribbons

        p5.pop();
      }
    }
  };

  const windowResized = (p5: any) => {
    p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
  };

  return (
    <ReactP5
      setup={setup}
      draw={draw}
      windowResized={windowResized}
      style={{ position: "fixed", inset: 0, zIndex: -2 }}
    />
  );
};

export default AuraCanvas;
