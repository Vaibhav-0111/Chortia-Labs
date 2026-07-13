import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useScroll, useTransform, useInView, useSpring } from "motion/react";

/* ============================================================
   MoodSVG — Floating animated SVG shapes that drift across
   the viewport. Each shape has its own orbit, rotation, and
   parallax depth, creating an organic atmospheric layer.
   ============================================================ */

function useIsBrowser() {
  const [ok, setOk] = useState(false);
  useEffect(() => setOk(true), []);
  return ok;
}

/* A single drifting SVG shape */
function FloatingShape({
  shape,
  size,
  x,
  y,
  duration,
  delay,
  opacity,
  color,
}: {
  shape: "circle" | "hex" | "tri" | "diamond" | "ring" | "cross";
  size: number;
  x: string;
  y: string;
  duration: number;
  delay: number;
  opacity: number;
  color: string;
}) {
  const paths: Record<string, ReactNode> = {
    circle: (
      <circle cx="50" cy="50" r="40" stroke={color} strokeWidth="0.8" fill="none" opacity={opacity} />
    ),
    hex: (
      <polygon
        points="50,10 90,30 90,70 50,90 10,70 10,30"
        stroke={color}
        strokeWidth="0.6"
        fill="none"
        opacity={opacity}
      />
    ),
    tri: (
      <polygon
        points="50,10 90,85 10,85"
        stroke={color}
        strokeWidth="0.7"
        fill="none"
        opacity={opacity}
      />
    ),
    diamond: (
      <polygon
        points="50,5 95,50 50,95 5,50"
        stroke={color}
        strokeWidth="0.6"
        fill="none"
        opacity={opacity}
      />
    ),
    ring: (
      <>
        <circle cx="50" cy="50" r="40" stroke={color} strokeWidth="0.5" fill="none" opacity={opacity} />
        <circle cx="50" cy="50" r="28" stroke={color} strokeWidth="0.4" fill="none" opacity={opacity * 0.7} />
        <circle cx="50" cy="50" r="16" stroke={color} strokeWidth="0.3" fill="none" opacity={opacity * 0.5} />
      </>
    ),
    cross: (
      <>
        <line x1="50" y1="10" x2="50" y2="90" stroke={color} strokeWidth="0.6" opacity={opacity} />
        <line x1="10" y1="50" x2="90" y2="50" stroke={color} strokeWidth="0.6" opacity={opacity} />
      </>
    ),
  };

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, top: y, width: size, height: size }}
      animate={{
        y: [0, -30, 10, -20, 0],
        x: [0, 15, -10, 20, 0],
        rotate: [0, 90, 180, 270, 360],
        scale: [1, 1.05, 0.95, 1.02, 1],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full">
        {paths[shape]}
      </svg>
    </motion.div>
  );
}

/* Constellation of floating shapes behind sections */
function MoodSVGLayer() {
  const isBrowser = useIsBrowser();
  if (!isBrowser) return null;

  const shapes: Array<{
    shape: "circle" | "hex" | "tri" | "diamond" | "ring" | "cross";
    size: number;
    x: string;
    y: string;
    duration: number;
    delay: number;
    opacity: number;
    color: string;
  }> = [
    { shape: "hex", size: 100, x: "8%", y: "15%", duration: 50, delay: 0, opacity: 0.08, color: "oklch(0.78 0.16 65)" },
    { shape: "tri", size: 70, x: "85%", y: "10%", duration: 45, delay: 0, opacity: 0.06, color: "oklch(0.85 0.18 70)" },
    { shape: "ring", size: 120, x: "75%", y: "55%", duration: 60, delay: 0, opacity: 0.06, color: "oklch(0.78 0.16 65)" },
    { shape: "diamond", size: 80, x: "5%", y: "50%", duration: 55, delay: 0, opacity: 0.05, color: "oklch(0.94 0.012 80)" },
    { shape: "circle", size: 60, x: "50%", y: "80%", duration: 50, delay: 0, opacity: 0.05, color: "oklch(0.85 0.18 70)" },
  ];

  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden" aria-hidden>
      {shapes.map((s, i) => (
        <FloatingShape key={i} {...s} />
      ))}
    </div>
  );
}

/* ============================================================
   Animated SVG dividers between sections — flowing lines
   that pulse with amber energy
   ============================================================ */
function SectionDivider({ variant = "wave" }: { variant?: "wave" | "pulse" | "dots" }) {
  if (variant === "dots") {
    return (
      <div className="relative h-16 flex items-center justify-center overflow-hidden">
        <svg width="300" height="10" viewBox="0 0 300 10" className="opacity-30">
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.circle
              key={i}
              cx={10 + i * 20}
              cy="5"
              r="1.5"
              fill="oklch(0.78 0.16 65)"
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.3, 0.8] }}
              transition={{ duration: 2, delay: i * 0.12, repeat: Infinity }}
            />
          ))}
        </svg>
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div className="relative h-8 flex items-center justify-center overflow-hidden">
        <motion.div
          className="h-px bg-gradient-to-r from-transparent via-[oklch(0.78_0.16_65/0.5)] to-transparent"
          style={{ width: "60%" }}
          animate={{ opacity: [0.3, 0.8, 0.3], scaleX: [0.8, 1, 0.8] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </div>
    );
  }

  return (
    <div className="relative h-20 flex items-center overflow-hidden">
      <svg width="100%" height="40" viewBox="0 0 1200 40" preserveAspectRatio="none" className="opacity-20">
        <motion.path
          d="M0,20 Q150,5 300,20 T600,20 T900,20 T1200,20"
          stroke="oklch(0.78 0.16 65)"
          strokeWidth="1"
          fill="none"
          animate={{
            d: [
              "M0,20 Q150,5 300,20 T600,20 T900,20 T1200,20",
              "M0,20 Q150,35 300,20 T600,20 T900,20 T1200,20",
              "M0,20 Q150,5 300,20 T600,20 T900,20 T1200,20",
            ],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}

/* ============================================================
   StickySection — Wraps a section in a sticky container
   with scroll-driven parallax and reveal animations
   ============================================================ */
function StickySection({
  children,
  className = "",
  height = "200vh",
  fadeOut = true,
}: {
  children: ReactNode;
  className?: string;
  height?: string;
  fadeOut?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(
    scrollYProgress,
    fadeOut ? [0, 0.05, 0.75, 1] : [0, 0.05, 1, 1],
    fadeOut ? [0, 1, 1, 0] : [0, 1, 1, 1],
  );
  const scale = useTransform(scrollYProgress, [0, 0.05, 0.85, 1], [0.98, 1, 1, 0.99]);
  const y = useTransform(scrollYProgress, [0.85, 1], [0, -40]);

  const smoothOpacity = useSpring(opacity, { stiffness: 200, damping: 30 });
  const smoothScale = useSpring(scale, { stiffness: 200, damping: 30 });

  return (
    <div ref={containerRef} style={{ height }} className="relative">
      <motion.div
        className={`sticky top-0 min-h-screen flex items-center ${className}`}
        style={{ opacity: smoothOpacity, scale: smoothScale, y }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ============================================================
   RevealOnScroll — Animates children in on scroll
   ============================================================ */
function RevealOnScroll({
  children,
  direction = "up",
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  direction?: "up" | "left" | "right";
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-8% 0px" });

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === "up" ? 30 : 0,
      x: direction === "left" ? -30 : direction === "right" ? 30 : 0,
      filter: "blur(4px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      filter: "blur(0px)",
    },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={variants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{
        duration: 0.5,
        delay: delay * 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

/* ============================================================
   AnimatedCounter — Numbers that count up when in view
   ============================================================ */
function AnimatedCounter({ target, suffix = "" }: { target: string; suffix?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const numericPart = parseInt(target.replace(/\D/g, ""), 10);
  const prefix = target.match(/^[^\d]*/)?.[0] || "";
  const suffixPart = target.match(/[^\d]*$/)?.[0] || "";
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let frame: number;
    const duration = 1800;
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * numericPart));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [inView, numericPart]);

  return (
    <span ref={ref}>
      {prefix}{inView ? count : 0}{suffixPart}{suffix}
    </span>
  );
}

/* ============================================================
   Animated SVG Logo with drawing effect
   ============================================================ */
function AnimatedLogo({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <motion.circle
        cx="11"
        cy="11"
        r="10"
        stroke="currentColor"
        strokeOpacity="0.5"
        strokeDasharray="63"
        initial={{ strokeDashoffset: 63 }}
        animate={{ strokeDashoffset: 0 }}
        transition={{ duration: 2, ease: "easeOut" }}
      />
      <motion.circle
        cx="11"
        cy="11"
        r="4"
        fill="var(--color-primary)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, delay: 1.5, type: "spring" }}
      />
      <motion.circle
        cx="11"
        cy="11"
        r="7"
        stroke="var(--color-primary)"
        strokeWidth="0.5"
        strokeOpacity="0.3"
        fill="none"
        animate={{ r: [7, 8, 7], strokeOpacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </svg>
  );
}

/* ============================================================
   Exports
   ============================================================ */
export {
  MoodSVGLayer,
  SectionDivider,
  StickySection,
  RevealOnScroll,
  AnimatedCounter,
  AnimatedLogo,
  FloatingShape,
  useIsBrowser,
};
