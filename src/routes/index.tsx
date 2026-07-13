import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "motion/react";
import { SignatureField } from "../components/SignatureField";
import { CursorHalo } from "../components/CursorHalo";
import { JitterText } from "../components/JitterText";
import { pulseSignatureField } from "../lib/signature-field-signal";
import {
  MoodSVGLayer,
  SectionDivider,
  StickySection,
  RevealOnScroll,
  AnimatedCounter,
  AnimatedLogo,
} from "../components/MoodAnimations";

export const Route = createFileRoute("/")(  {
  component: CohortiaSite,
});

/* ============================================================
   Cohortia Labs — startup website.

   Visual identity: one continuous WebGL2 signature field
   (see SignatureField.tsx) rendered once, fixed behind every
   section from the first pixel of the hero to the footer. It
   never restarts — scroll position and interaction just feed
   uniforms into the same running shader. Sections themselves
   stay mostly transparent "glass" so it reads through, with
   glass-panel used only where dense copy needs contrast.

   Enhanced with:
   - Floating SVG mood shapes (MoodSVGLayer)
   - Sticky scroll sections with parallax
   - Scroll-driven reveal animations
   - Animated SVG dividers between sections
   - Animated counters
   ============================================================ */

function CohortiaSite() {
  return (
    <>
      <SignatureField />
      <CursorHalo />
      <MoodSVGLayer />
      <div className="grain-layer" />
      <main className="relative z-10 min-h-screen text-foreground antialiased">
        <Nav />
        <StickySection height="120vh" fadeOut>
          <Hero />
        </StickySection>
        <SectionDivider variant="wave" />
        <Trusted />
        <SectionDivider variant="dots" />
        <StickySection height="120vh" fadeOut>
          <What />
        </StickySection>
        <SectionDivider variant="pulse" />
        <Services />
        <SectionDivider variant="wave" />
        <StickySection height="120vh" fadeOut>
          <ProblemSolution />
        </StickySection>
        <SectionDivider variant="dots" />
        <Process />
        <SectionDivider variant="pulse" />
        <Contact />
        <Footer />
      </main>
    </>
  );
}

/* ---------------- Nav ---------------- */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const navLinks = [
    { href: "#services", label: "Services" },
    { href: "#problem", label: "Approach" },
    { href: "#process", label: "Process" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-panel border-b border-border" : ""
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a
          href="#top"
          className="flex items-center gap-2"
          onMouseEnter={() => pulseSignatureField(0.5)}
        >
          <AnimatedLogo />
          <motion.span
            className="font-display text-lg italic"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            Cohortia Labs
          </motion.span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          {navLinks.map((l, i) => (
            <motion.a
              key={l.href}
              href={l.href}
              className="editorial-link hover:text-foreground transition"
              onMouseEnter={() => pulseSignatureField(0.7)}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 + i * 0.06 }}
            >
              {l.label}
            </motion.a>
          ))}
        </nav>
        <motion.a
          href="#contact"
          onMouseEnter={() => pulseSignatureField(1)}
          className="rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:opacity-90 transition"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.3, type: "spring" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start a project
        </motion.a>
      </div>
    </motion.header>
  );
}

/* ---------------- Hero ---------------- */
function Hero() {
  return (
    <section id="top" className="relative isolate min-h-[100svh] w-full flex items-center overflow-hidden">
      {/* oversized ghost numeral — editorial chapter marker */}
      <motion.span
        className="ghost-numeral hidden md:block"
        style={{ fontSize: "42vw", left: "-4vw", top: "-8vw" }}
        initial={{ opacity: 0, scale: 1.2 }}
        animate={{ opacity: 0.05, scale: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        01
      </motion.span>

      {/* Decorative SVG orbit rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden>
        <motion.svg
          width="800" height="800" viewBox="0 0 800 800"
          className="opacity-[0.04]"
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        >
          <circle cx="400" cy="400" r="300" stroke="oklch(0.78 0.16 65)" strokeWidth="0.5" fill="none" />
          <circle cx="400" cy="400" r="250" stroke="oklch(0.78 0.16 65)" strokeWidth="0.3" fill="none" strokeDasharray="8 12" />
          <circle cx="400" cy="400" r="350" stroke="oklch(0.94 0.012 80)" strokeWidth="0.3" fill="none" strokeDasharray="4 16" />
        </motion.svg>
      </div>

      <div className="relative mx-auto max-w-7xl w-full px-6 pt-36 pb-24">
        <RevealOnScroll>
          <div className="max-w-3xl glass-panel rounded-sm px-6 py-8 -ml-6 md:px-8 md:py-10 md:-ml-8">
            <motion.p
              className="font-mono-label text-primary/80 mb-6 -rotate-1 origin-left"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              Cohortia Labs · Engineering studio
            </motion.p>
            <JitterText
              as="h1"
              text="We build the intelligent systems ambitious teams can't buy off the shelf."
              className="font-display italic text-5xl md:text-7xl leading-[1.05] tracking-tight"
            />
            <motion.p
              className="mt-8 text-lg text-muted-foreground max-w-xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Cohortia Labs is a small engineering studio designing AI-native software, internal platforms, and applied research prototypes — end to end, from problem framing to production.
            </motion.p>
            <motion.div
              className="mt-10 flex flex-wrap items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <motion.a
                href="#contact"
                onMouseEnter={() => pulseSignatureField(1.1)}
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
                whileHover={{ scale: 1.05, boxShadow: "0 0 30px oklch(0.78 0.16 65 / 0.3)" }}
                whileTap={{ scale: 0.95 }}
              >
                Start a project
                <motion.span
                  className="inline-block"
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </motion.a>
              <a
                href="#services"
                onMouseEnter={() => pulseSignatureField(0.6)}
                className="editorial-link text-sm text-muted-foreground hover:text-foreground"
              >
                See what we build
              </a>
            </motion.div>
          </div>
        </RevealOnScroll>
      </div>

      {/* editorial corner meta — like a magazine masthead */}
      <motion.div
        className="pointer-events-none absolute inset-x-6 top-24 hidden md:flex items-start justify-between font-mono-label text-muted-foreground/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <span>N° 001 — Bangalore / Remote</span>
        <span>Vol. {new Date().getFullYear()}  ·  Rendered live, on scroll</span>
      </motion.div>

      {/* Animated scroll indicator */}
      <motion.div
        className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <span className="font-mono-label text-muted-foreground/50 text-[10px]">SCROLL</span>
        <motion.svg
          width="20" height="30" viewBox="0 0 20 30"
          className="text-muted-foreground/40"
        >
          <rect x="1" y="1" width="18" height="28" rx="9" stroke="currentColor" strokeWidth="1" fill="none" />
          <motion.circle
            cx="10" cy="8" r="2" fill="currentColor"
            animate={{ cy: [8, 18, 8] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.svg>
      </motion.div>
    </section>
  );
}

/* ---------------- Trusted / stats strip ---------------- */
const MARQUEE_ITEMS = [
  "AI-NATIVE ENGINEERING",
  "APPLIED RESEARCH",
  "SYSTEMS THAT SHIP",
  "ZERO VENDOR THEATRE",
  "PRODUCTION FROM DAY ONE",
];

function Trusted() {
  const loopItems = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <section className="border-y border-border overflow-hidden">
      <div className="py-3 border-b border-border/60">
        <div className="marquee-track">
          {loopItems.map((item, i) => (
            <span
              key={i}
              className="font-mono-label text-muted-foreground/60 px-6 shrink-0"
            >
              {item} <span className="text-primary/60">·</span>
            </span>
          ))}
        </div>
      </div>
      <div className="mx-auto max-w-7xl grid grid-cols-2 md:grid-cols-4 divide-x divide-border glass-panel">
        {([
          ["12+", "Products shipped"],
          ["6", "Applied-research prototypes"],
          ["4", "Continents served"],
          ["48h", "From brief to prototype"],
        ] as const).map(([n, l], i) => (
          <RevealOnScroll key={l} delay={i * 0.1}>
            <div className="px-6 py-8">
              <div className="font-display italic text-3xl">
                <AnimatedCounter target={n} />
              </div>
              <div className="mt-1 text-xs text-muted-foreground uppercase tracking-widest">{l}</div>
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}

/* ---------------- What we do ---------------- */
function What() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-32 w-full overflow-hidden">
      <motion.span
        className="ghost-numeral hidden md:block"
        style={{ fontSize: "22vw", right: "-2vw", bottom: "-10vw", left: "auto" }}
        animate={{ opacity: [0.03, 0.06, 0.03] }}
        transition={{ duration: 8, repeat: Infinity }}
      >
        01
      </motion.span>
      <div className="relative grid md:grid-cols-12 gap-12 items-start">
        <RevealOnScroll className="md:col-span-7 space-y-6 text-lg text-muted-foreground leading-relaxed order-2 md:order-1">
          <p>
            We partner with founders and operating teams to ship the systems their business actually runs on — not decks, not prototypes that quietly die in a Figma file.
          </p>
          <p className="text-foreground">
            Every engagement is led by the same people who write the code. No middle layer, no hand-offs, no vendor theatre.
          </p>
        </RevealOnScroll>
        <RevealOnScroll direction="right" className="md:col-span-4 md:col-start-9 text-right order-1 md:order-2">
          <p className="font-mono-label text-primary">01 · What we do</p>
          <JitterText
            as="h2"
            text="A studio, not an agency."
            className="mt-4 font-display italic text-4xl md:text-5xl leading-tight"
          />
        </RevealOnScroll>
      </div>
    </section>
  );
}

/* ---------------- Services ---------------- */
const SERVICES = [
  {
    n: "01",
    title: "AI-native product engineering",
    desc: "Full-stack products with LLMs, retrieval, and agents at the core — designed to stay reliable in production.",
    tags: ["LLMs", "RAG", "Agents", "Evals"],
    icon: (
      <svg viewBox="0 0 48 48" className="w-12 h-12" fill="none">
        <motion.path
          d="M24 4L4 14v20l20 10 20-10V14L24 4z"
          stroke="oklch(0.78 0.16 65)"
          strokeWidth="1.5"
          animate={{ strokeDashoffset: [180, 0] }}
          transition={{ duration: 3, delay: 0.5 }}
          strokeDasharray="180"
        />
        <motion.circle cx="24" cy="24" r="6" fill="oklch(0.78 0.16 65)" fillOpacity="0.15"
          animate={{ r: [6, 8, 6] }} transition={{ duration: 3, repeat: Infinity }} />
        <circle cx="24" cy="24" r="3" fill="oklch(0.78 0.16 65)" fillOpacity="0.4" />
      </svg>
    ),
  },
  {
    n: "02",
    title: "Internal platforms & tooling",
    desc: "Dashboards, workflow tools, and back-office systems that make your operators 10× more effective.",
    tags: ["Dashboards", "Automations", "APIs"],
    icon: (
      <svg viewBox="0 0 48 48" className="w-12 h-12" fill="none">
        <motion.rect x="8" y="8" width="32" height="32" rx="4" stroke="oklch(0.78 0.16 65)" strokeWidth="1.5"
          animate={{ strokeDashoffset: [128, 0] }} transition={{ duration: 2.5, delay: 0.8 }} strokeDasharray="128" />
        <line x1="8" y1="18" x2="40" y2="18" stroke="oklch(0.78 0.16 65)" strokeWidth="1" strokeOpacity="0.4" />
        <motion.rect x="14" y="24" width="8" height="3" rx="1" fill="oklch(0.78 0.16 65)" fillOpacity="0.3"
          animate={{ width: [8, 12, 8] }} transition={{ duration: 2, repeat: Infinity }} />
        <rect x="14" y="30" width="20" height="3" rx="1" fill="oklch(0.78 0.16 65)" fillOpacity="0.15" />
      </svg>
    ),
  },
  {
    n: "03",
    title: "Applied research prototypes",
    desc: "Fast, well-instrumented prototypes to validate a hypothesis before you commit six months of roadmap.",
    tags: ["Vision", "NLP", "Simulation"],
    icon: (
      <svg viewBox="0 0 48 48" className="w-12 h-12" fill="none">
        <motion.path d="M24 8 L16 20 L24 32 L32 20 Z" stroke="oklch(0.78 0.16 65)" strokeWidth="1.5"
          animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "24px 20px" }} />
        <motion.circle cx="24" cy="38" r="4" stroke="oklch(0.78 0.16 65)" strokeWidth="1" fill="none"
          animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
        <line x1="24" y1="32" x2="24" y2="34" stroke="oklch(0.78 0.16 65)" strokeWidth="1" strokeOpacity="0.4" />
      </svg>
    ),
  },
  {
    n: "04",
    title: "Founding-team engineering",
    desc: "We embed as a fractional founding engineering team for early-stage companies — from 0 to shipped product.",
    tags: ["0→1", "Architecture", "Hiring"],
    icon: (
      <svg viewBox="0 0 48 48" className="w-12 h-12" fill="none">
        <motion.path d="M12 36 L24 12 L36 36" stroke="oklch(0.78 0.16 65)" strokeWidth="1.5"
          animate={{ strokeDashoffset: [60, 0] }} transition={{ duration: 2, delay: 1.2 }} strokeDasharray="60" />
        <motion.line x1="18" y1="28" x2="30" y2="28" stroke="oklch(0.78 0.16 65)" strokeWidth="1" strokeOpacity="0.5"
          animate={{ x1: [18, 16, 18], x2: [30, 32, 30] }} transition={{ duration: 3, repeat: Infinity }} />
        <circle cx="24" cy="12" r="2" fill="oklch(0.78 0.16 65)" fillOpacity="0.4" />
      </svg>
    ),
  },
];

function Services() {
  return (
    <section id="services" className="relative border-t border-border overflow-hidden">
      <motion.span
        className="ghost-numeral hidden md:block"
        style={{ fontSize: "20vw", left: "-2vw", top: "4vw" }}
        animate={{ opacity: [0.03, 0.06, 0.03] }}
        transition={{ duration: 8, repeat: Infinity, delay: 2 }}
      >
        02
      </motion.span>
      <div className="relative mx-auto max-w-7xl px-6 py-32">
        <RevealOnScroll>
          <div className="flex items-end justify-between mb-16 flex-wrap gap-6">
            <div>
              <p className="font-mono-label text-primary">02 · Services</p>
              <JitterText as="h2" text="Four ways we work." className="mt-4 font-display italic text-4xl md:text-5xl" />
            </div>
            <p className="max-w-md text-muted-foreground">
              Every engagement is scoped to a clear outcome, on a fixed timeline, with a single point of ownership.
            </p>
          </div>
        </RevealOnScroll>
        <ul className="divide-y divide-border border-y border-border glass-panel">
          {SERVICES.map((s, i) => (
            <RevealOnScroll key={s.n} delay={i * 0.1}>
              <motion.li
                onMouseEnter={() => pulseSignatureField(0.4)}
                className="group grid grid-cols-12 gap-6 py-10 md:py-14 items-start hover:bg-card/40 transition-colors px-2"
                whileHover={{ x: 6 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="col-span-12 md:col-span-1 flex items-center justify-center md:justify-start">
                  {s.icon}
                </div>
                <div className="col-span-12 md:col-span-1 font-display text-5xl md:text-6xl text-muted-foreground group-hover:text-primary transition-colors">
                  {s.n}
                </div>
                <div className="col-span-12 md:col-span-6 min-w-0">
                  <h3 className="font-display text-2xl md:text-4xl leading-tight tracking-tight">
                    {s.title}
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {s.tags.map((t) => (
                      <motion.span
                        key={t}
                        className="font-mono-label text-muted-foreground border border-border px-2.5 py-1 rounded-sm"
                        whileHover={{ borderColor: "oklch(0.78 0.16 65)", color: "oklch(0.78 0.16 65)" }}
                      >
                        {t}
                      </motion.span>
                    ))}
                  </div>
                </div>
                <p className="col-span-12 md:col-span-4 text-muted-foreground leading-relaxed">
                  {s.desc}
                </p>
              </motion.li>
            </RevealOnScroll>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------------- Problem → Solution ---------------- */
function ProblemSolution() {
  return (
    <section id="problem" className="relative border-t border-border overflow-hidden w-full">
      <motion.span
        className="ghost-numeral hidden md:block"
        style={{ fontSize: "20vw", right: "-2vw", top: "-4vw", left: "auto" }}
        animate={{ opacity: [0.03, 0.06, 0.03] }}
        transition={{ duration: 8, repeat: Infinity, delay: 4 }}
      >
        03
      </motion.span>
      <div className="relative mx-auto max-w-7xl px-6 py-32">
        <RevealOnScroll>
          <p className="font-mono-label text-primary">03 · Approach</p>
          <JitterText
            as="h2"
            text="Most software projects fail in translation, not code."
            className="mt-4 font-display italic text-4xl md:text-5xl max-w-3xl"
          />
        </RevealOnScroll>

        <div className="mt-16 grid md:grid-cols-2 gap-px bg-border">
          <RevealOnScroll direction="left">
            <div className="glass-panel p-10 h-full">
              <div className="font-mono-label text-destructive/80">Common failure</div>
              {/* Animated X icons */}
              <ul className="mt-6 space-y-4 text-muted-foreground">
                {[
                  "Vague brief → shiny demo → nothing that survives Monday morning.",
                  "Layers of PMs and vendors between the person with the problem and the person writing the code.",
                  "AI features bolted onto products with no evaluation, no guardrails, no plan for failure.",
                  "Prototypes that can't be iterated on because nobody understands the codebase.",
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    className="flex gap-3 items-start"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                  >
                    <svg className="w-4 h-4 mt-1 shrink-0 text-destructive/60" viewBox="0 0 16 16" fill="none">
                      <motion.path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5"
                        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
                        viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }} />
                    </svg>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </RevealOnScroll>
          <RevealOnScroll direction="right">
            <div className="glass-panel p-10 border-l-2 border-primary h-full">
              <div className="font-mono-label text-primary">How we work</div>
              {/* Animated check icons */}
              <ul className="mt-6 space-y-4 text-foreground">
                {[
                  "Start with the operating reality, not the wireframe. We sit in on real work first.",
                  "One senior engineer owns the outcome end to end. No hand-offs.",
                  "Ship in weeks, not quarters. Every milestone is production-usable, not a demo.",
                  "Code you can read, extend, and hire against — with docs, tests, and evals from day one.",
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    className="flex gap-3 items-start"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                  >
                    <svg className="w-4 h-4 mt-1 shrink-0 text-primary" viewBox="0 0 16 16" fill="none">
                      <motion.path d="M3 8L7 12L13 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }}
                        viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }} />
                    </svg>
                    <span>{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Process ---------------- */
const STEPS = [
  { n: "01", t: "Discovery", d: "One week. We sit with your team, map the workflow, and write the brief you wish you'd received.", icon: "🔍" },
  { n: "02", t: "Prototype", d: "Two–three weeks. A working slice of the system, in your environment, with real data.", icon: "⚡" },
  { n: "03", t: "Build", d: "Four–eight weeks. We ship the production system, with tests, docs, and evaluations.", icon: "🔨" },
  { n: "04", t: "Handover", d: "You get a codebase your future team can own — plus a month of support included.", icon: "🚀" },
];

function Process() {
  return (
    <section id="process" className="relative border-t border-border overflow-hidden">
      <motion.span
        className="ghost-numeral hidden md:block"
        style={{ fontSize: "20vw", left: "-2vw", bottom: "-8vw" }}
        animate={{ opacity: [0.03, 0.06, 0.03] }}
        transition={{ duration: 8, repeat: Infinity, delay: 6 }}
      >
        04
      </motion.span>
      <div className="relative mx-auto max-w-7xl px-6 py-32">
        <RevealOnScroll>
          <p className="font-mono-label text-primary">04 · Process</p>
          <JitterText
            as="h2"
            text="From ambiguous brief to running system, in weeks."
            className="mt-4 font-display italic text-4xl md:text-5xl max-w-3xl"
          />
        </RevealOnScroll>

        {/* Animated connecting line */}
        <div className="hidden md:block absolute left-1/2 top-[240px] bottom-[80px] w-px">
          <motion.div
            className="w-full h-full bg-gradient-to-b from-primary/40 via-primary/20 to-transparent"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
            style={{ transformOrigin: "top" }}
          />
        </div>

        <ol className="mt-16 grid md:grid-cols-4 gap-px bg-border">
          {STEPS.map((s, i) => (
            <RevealOnScroll key={s.n} delay={i * 0.15}>
              <motion.li
                className="glass-panel p-8 relative"
                onMouseEnter={() => pulseSignatureField(0.3)}
                whileHover={{
                  y: -4,
                  boxShadow: "0 20px 40px oklch(0 0 0 / 0.3)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                {/* Animated step indicator */}
                <motion.div
                  className="absolute -top-3 left-8 w-6 h-6 rounded-full bg-background border border-primary flex items-center justify-center"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.15, type: "spring" }}
                >
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </motion.div>

                <div className="font-mono-label text-muted-foreground">{s.n}</div>
                <div className="mt-4 font-display text-2xl">{s.t}</div>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{s.d}</p>
              </motion.li>
            </RevealOnScroll>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------------- Contact ---------------- */
type FormState = {
  name: string;
  email: string;
  company: string;
  budget: string;
  message: string;
};
type Errors = Partial<Record<keyof FormState, string>>;

function Contact() {
  const [form, setForm] = useState<FormState>({ name: "", email: "", company: "", budget: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validate = (f: FormState) => {
    const e: Errors = {};
    if (!f.name.trim()) e.name = "Please enter your name.";
    if (!f.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "That doesn't look like a valid email.";
    if (!f.message.trim() || f.message.trim().length < 12) e.message = "Tell us a little more (12+ characters).";
    if (!f.budget) e.budget = "Pick a rough range so we can respond usefully.";
    return e;
  };

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => {
    setForm((prev) => {
      const next = { ...prev, [k]: v };
      if (errors[k]) {
        const nextErrors = validate(next);
        setErrors(nextErrors);
      }
      return next;
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const eObj = validate(form);
    setErrors(eObj);
    if (Object.keys(eObj).length) return;

    setStatus("sending");
    setSubmitError(null);

    const accessKey = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;
    if (!accessKey) {
      setStatus("error");
      setSubmitError(
        "Form isn't connected yet — add your Web3Forms access key as VITE_WEB3FORMS_KEY (see README)."
      );
      return;
    }

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `New enquiry from ${form.name} — Cohortia Labs`,
          from_name: "Cohortia Labs website",
          name: form.name,
          email: form.email,
          company: form.company || "—",
          budget: form.budget,
          message: form.message,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("sent");
      } else {
        setStatus("error");
        setSubmitError(data.message || "Something went wrong sending that. Please try again.");
      }
    } catch {
      setStatus("error");
      setSubmitError("Couldn't reach the form service — check your connection and try again.");
    }
  };

  return (
    <section id="contact" className="border-t border-border relative overflow-hidden">
      {/* Decorative SVG background for contact */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <motion.svg
          className="absolute right-0 top-0 w-[500px] h-[500px] opacity-[0.03]"
          viewBox="0 0 500 500"
          animate={{ rotate: -360 }}
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
        >
          <circle cx="250" cy="250" r="200" stroke="oklch(0.78 0.16 65)" strokeWidth="0.5" fill="none" />
          <circle cx="250" cy="250" r="150" stroke="oklch(0.78 0.16 65)" strokeWidth="0.3" fill="none" strokeDasharray="10 15" />
          <circle cx="250" cy="250" r="100" stroke="oklch(0.78 0.16 65)" strokeWidth="0.3" fill="none" strokeDasharray="5 20" />
        </motion.svg>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-32 grid md:grid-cols-12 gap-12">
        <RevealOnScroll className="md:col-span-5">
          <p className="font-mono-label text-primary">05 · Start a project</p>
          <JitterText
            as="h2"
            text="Tell us what you're trying to build."
            className="mt-4 font-display italic text-4xl md:text-5xl leading-tight"
          />
          <p className="mt-6 text-muted-foreground leading-relaxed">
            We reply to every serious enquiry within 48 hours, from a real engineer — not a form-response bot. If we're not the right fit, we'll tell you and point you somewhere better.
          </p>
          <div className="mt-10 space-y-3 text-sm">
            <div className="flex items-center gap-3 text-muted-foreground"><span className="h-px w-6 bg-primary" />hello@cohortialabs.com</div>
            <div className="flex items-center gap-3 text-muted-foreground"><span className="h-px w-6 bg-primary" />Bangalore · Remote-first</div>
          </div>
        </RevealOnScroll>

        <RevealOnScroll direction="right" className="md:col-span-7">
          {status === "sent" ? (
            <motion.div
              className="rounded-lg border border-primary/30 bg-primary/5 p-10"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring" }}
            >
              <div className="font-mono-label text-primary">Message received</div>
              <h3 className="mt-4 font-display text-3xl">Thanks, {form.name.split(" ")[0] || "there"}.</h3>
              <p className="mt-4 text-muted-foreground">
                We've got your note. Expect a real reply from a Cohortia engineer within 48 hours.
              </p>
              <button
                onClick={() => { setStatus("idle"); setForm({ name: "", email: "", company: "", budget: "", message: "" }); }}
                className="mt-8 text-sm text-primary editorial-link"
              >
                Send another
              </button>
            </motion.div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="grid gap-6 glass-panel rounded-sm p-8">
              <Field label="Your name" error={errors.name}>
                <input className="field" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Ada Lovelace" />
              </Field>
              <div className="grid md:grid-cols-2 gap-6">
                <Field label="Email" error={errors.email}>
                  <input type="email" className="field" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="ada@company.com" />
                </Field>
                <Field label="Company (optional)">
                  <input className="field" value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="Analytical Engines Ltd." />
                </Field>
              </div>
              <Field label="Budget range" error={errors.budget}>
                <div className="flex flex-wrap gap-2">
                  {["< $10k", "$10–25k", "$25–75k", "$75k+"].map((b) => (
                    <motion.button
                      key={b}
                      type="button"
                      onClick={() => set("budget", b)}
                      className={`rounded-full border px-4 py-2 text-sm transition ${
                        form.budget === b
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:text-foreground"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {b}
                    </motion.button>
                  ))}
                </div>
              </Field>
              <Field label="What are you trying to build?" error={errors.message}>
                <textarea
                  rows={5}
                  className="field resize-none"
                  value={form.message}
                  onChange={(e) => set("message", e.target.value)}
                  placeholder="A short description of the problem, who it's for, and any timeline you have in mind."
                />
              </Field>
              {status === "error" && submitError && (
                <motion.div
                  className="rounded-sm border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {submitError}
                </motion.div>
              )}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-muted-foreground">We reply within 48 hours.</span>
                <motion.button
                  type="submit"
                  disabled={status === "sending"}
                  onMouseEnter={() => pulseSignatureField(1.2)}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition disabled:opacity-60"
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px oklch(0.78 0.16 65 / 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  {status === "sending" ? "Sending…" : status === "error" ? "Try again" : "Send enquiry"}
                  <span>→</span>
                </motion.button>
              </div>
            </form>
          )}
        </RevealOnScroll>
      </div>
    </section>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="font-mono-label text-muted-foreground mb-2">{label}</div>
      {children}
      {error && (
        <motion.div
          className="mt-2 text-xs text-destructive"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.div>
      )}
    </label>
  );
}

/* ---------------- Footer ---------------- */
function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-10 flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <AnimatedLogo size={18} />
          <span>© {new Date().getFullYear()} Cohortia Labs</span>
        </div>
        <div className="flex gap-6">
          <a href="#services" className="hover:text-foreground transition">Services</a>
          <a href="#process" className="hover:text-foreground transition">Process</a>
          <a href="#contact" className="hover:text-foreground transition">Contact</a>
        </div>
      </div>
    </footer>
  );
}
