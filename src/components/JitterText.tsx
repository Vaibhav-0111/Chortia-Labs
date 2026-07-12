import { useMemo, useRef } from "react";
import { motion, useInView } from "motion/react";

/* ============================================================
   JitterText
   Splits text into words → chars. Each char starts at a small
   deterministic random rotation/offset/blur and snaps to rest
   on a staggered spring as it enters the viewport — a "settle,
   don't fade" reveal instead of a generic opacity tween.

   Determinism matters: this renders during SSR, so Math.random()
   would desync from the client render and throw a hydration
   mismatch. Everything is seeded from the character's own index.
   ============================================================ */

function seededRandom(seed: number) {
  const x = Math.sin(seed * 999.7) * 43758.5453;
  return x - Math.floor(x);
}

type Tag = "h1" | "h2" | "h3" | "p" | "span" | "div";

export function JitterText({
  text,
  as = "span",
  className = "",
  charClassName = "",
  delay = 0,
  stagger = 0.018,
  by = "char",
}: {
  text: string;
  as?: Tag;
  className?: string;
  charClassName?: string;
  delay?: number;
  stagger?: number;
  by?: "char" | "word";
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });
  const words = useMemo(() => text.split(" "), [text]);

  const Tag = as as any;

  let globalIndex = 0;

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((word, wi) => (
        <span
          key={wi}
          aria-hidden
          style={{ display: "inline-block", whiteSpace: "nowrap" }}
        >
          {by === "word" ? (
            <JitterUnit
              i={globalIndex++}
              inView={inView}
              delay={delay}
              stagger={stagger}
              className={charClassName}
            >
              {word}
            </JitterUnit>
          ) : (
            word.split("").map((ch, ci) => (
              <JitterUnit
                key={ci}
                i={globalIndex++}
                inView={inView}
                delay={delay}
                stagger={stagger}
                className={charClassName}
              >
                {ch === " " ? "\u00A0" : ch}
              </JitterUnit>
            ))
          )}
          {wi < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </Tag>
  );
}

function JitterUnit({
  i,
  inView,
  delay,
  stagger,
  className,
  children,
}: {
  i: number;
  inView: boolean;
  delay: number;
  stagger: number;
  className?: string;
  children: React.ReactNode;
}) {
  const seed = i + 1;
  const rot = (seededRandom(seed) - 0.5) * 26; // -13..13deg
  const x = (seededRandom(seed * 2.13) - 0.5) * 22; // -11..11px
  const y = 10 + seededRandom(seed * 3.7) * 16; // 10..26px
  const blur = 3 + seededRandom(seed * 5.1) * 5; // 3..8px

  return (
    <motion.span
      style={{ display: "inline-block", willChange: "transform, filter, opacity" }}
      className={className}
      initial={{ opacity: 0, x, y, rotate: rot, filter: `blur(${blur}px)` }}
      animate={
        inView
          ? { opacity: 1, x: 0, y: 0, rotate: 0, filter: "blur(0px)" }
          : { opacity: 0, x, y, rotate: rot, filter: `blur(${blur}px)` }
      }
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 18,
        mass: 0.7,
        delay: delay + i * stagger,
      }}
    >
      {children}
    </motion.span>
  );
}
