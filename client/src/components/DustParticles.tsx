
import { motion } from "framer-motion";

const particles = Array.from({ length: 28 }, () => ({
  id: Math.random().toString(36),
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 2 + Math.random() * 2,
  delay: Math.random() * 3
}));

const DustParticles = () => {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 3,
      }}
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 0.6, y: -40 }}
          transition={{
            repeat: Infinity,
            duration: 6 + Math.random() * 4,
            delay: p.delay,
            ease: "easeInOut",
          }}
          style={{
            position: "absolute",
            top: `${p.y}%`,
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            background: "rgba(255,255,255,0.35)",
            borderRadius: "50%",
            boxShadow: "0 0 10px rgba(255,255,255,0.45)",
          }}
        />
      ))}
    </div>
  );
};

export default DustParticles;
