// src/components/AuraCanvas.tsx (ULTRA LIGHT BRUSH STROKES)
import React, { useRef } from "react";
import ReactP5 from "react-p5";
import { useSentimentStore } from "../store/useSentimentStore";
import { useTranscriptionStore } from "../store/useTranscriptionStore";

const AuraCanvas: React.FC = () => {
  const sentimentScore = useSentimentStore((s) => s.sentimentScore ?? 0.5);
  const sentimentLabel = useSentimentStore((s) => s.sentimentLabel ?? "neutral");
  const isRecording = useTranscriptionStore((s) => s.isRecording);

  //  ULTRA LIGHT: Only essential refs
  const hueRef = useRef(180);
  const timeRef = useRef(0);

  const setup = (p5: any, parent: any) => {
    const canvas = p5.createCanvas(p5.windowWidth, p5.windowHeight);
    canvas.parent(parent);
    canvas.style("position", "fixed");
    canvas.style("top", "0");
    canvas.style("left", "0");
    canvas.style("z-index", "-2");
    p5.colorMode(p5.HSB, 360, 100, 100, 100);
  };

 const draw = (p5: any) => {
    //  ETHEREAL: Very subtle fade for rich trailing effect
    p5.fill(0, 0, 0, isRecording ? 2 : 1);
    p5.rect(0, 0, p5.width, p5.height);

    //  COLOR: Smooth transitions
    const targetHue = sentimentLabel === "positive" ? 60 : 
                     sentimentLabel === "negative" ? 270 : 180;
    hueRef.current = p5.lerp(hueRef.current, targetHue, 0.02);
    timeRef.current += 0.018;

    const H = hueRef.current;
    const t = timeRef.current;

    // OPTIMIZED FLOW FIELD: Dense look, light performance
    const numParticles = 250; // Balanced amount
    
    for (let i = 0; i < numParticles; i++) {
      const seed = i * 123.456;
      
      // Particle position
      let x = p5.width * p5.noise(seed, t * 0.08);
      let y = p5.height * p5.noise(seed + 1000, t * 0.08);
      
      p5.noFill();
      
      const steps = 25; // Moderate length
      const stepSize = 5; // Bigger steps = fewer calculations
      
      // Pre-calculate some values outside the loop
      const baseHueShift = p5.noise(seed * 0.1, t * 0.1) * 50 - 25;
      const baseSat = 50 + p5.noise(seed, t * 0.05) * 30;
      
      for (let step = 0; step < steps; step++) {
        // Simple single noise for angle
        const angle = p5.noise(x * 0.004, y * 0.004, t + seed * 0.001) * Math.PI * 6;
        
        const nx = x + Math.cos(angle) * stepSize;
        const ny = y + Math.sin(angle) * stepSize;
        
        const fadeFactor = 1 - (step / steps);
        const alpha = (isRecording ? 18 : 10) * fadeFactor;
        
        // Single thick stroke instead of multiple layers
        const thickness = 2 + p5.noise(seed, step * 0.1) * 2.5;
        
        p5.stroke(H + baseHueShift, baseSat, 75, alpha);
        p5.strokeWeight(thickness);
        p5.line(x, y, nx, ny);
        
        x = nx;
        y = ny;
        
        // Keep particles on screen
        if (x < 0 || x > p5.width || y < 0 || y > p5.height) break;
      }
    }

    //  SIMPLE AMBIENT GLOW
    if (isRecording) {
      const pulse = Math.sin(t * 1.5) * 0.5 + 0.5;
      p5.noStroke();
      p5.fill(H, 25, 90, 2 + pulse * 3);
      p5.circle(p5.width/2, p5.height/2, 200 + sentimentScore * 100 + pulse * 40);
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