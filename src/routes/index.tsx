import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SignatureField } from "../components/SignatureField";
import { CursorHalo } from "../components/CursorHalo";
import { JitterText } from "../components/JitterText";
import { pulseSignatureField } from "../lib/signature-field-signal";

export const Route = createFileRoute("/")({
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
   ============================================================ */

function CohortiaSite() {
  return (
    <>
      <SignatureField />
      <CursorHalo />
      <div className="grain-layer" />
      <main className="relative z-10 min-h-screen text-foreground antialiased">
        <Nav />
        <Hero />
        <Trusted />
        <What />
        <Services />
        <ProblemSolution />
        <Process />
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
    <header
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
          <Logo />
          <span className="font-display text-lg italic">Cohortia Labs</span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="editorial-link hover:text-foreground transition"
              onMouseEnter={() => pulseSignatureField(0.7)}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          onMouseEnter={() => pulseSignatureField(1)}
          className="rounded-full bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:opacity-90 transition"
        >
          Start a project
        </a>
      </div>
    </header>
  );
}

function Logo() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="11" r="10" stroke="currentColor" strokeOpacity="0.5" />
      <circle cx="11" cy="11" r="4" fill="var(--color-primary)" />
    </svg>
  );
}

/* ---------------- Hero ---------------- */
function Hero() {
  return (
    <section id="top" className="relative isolate min-h-[100svh] flex items-center overflow-hidden">
      {/* oversized ghost numeral — editorial chapter marker, not a stock icon */}
      <span
        className="ghost-numeral hidden md:block"
        style={{ fontSize: "42vw", left: "-4vw", top: "-8vw" }}
      >
        01
      </span>

      <div className="relative mx-auto max-w-7xl w-full px-6 pt-36 pb-24">
        <div className="max-w-3xl glass-panel rounded-sm px-6 py-8 -ml-6 md:px-8 md:py-10 md:-ml-8">
          <p className="font-mono-label text-primary/80 mb-6 -rotate-1 origin-left">
            Cohortia Labs · Engineering studio
          </p>
          <JitterText
            as="h1"
            text="We build the intelligent systems ambitious teams can't buy off the shelf."
            className="font-display italic text-5xl md:text-7xl leading-[1.05] tracking-tight"
          />
          <p className="mt-8 text-lg text-muted-foreground max-w-xl leading-relaxed">
            Cohortia Labs is a small engineering studio designing AI-native software, internal platforms, and applied research prototypes — end to end, from problem framing to production.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#contact"
              onMouseEnter={() => pulseSignatureField(1.1)}
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition"
            >
              Start a project
              <span className="transition group-hover:translate-x-1">→</span>
            </a>
            <a
              href="#services"
              onMouseEnter={() => pulseSignatureField(0.6)}
              className="editorial-link text-sm text-muted-foreground hover:text-foreground"
            >
              See what we build
            </a>
          </div>
        </div>
      </div>

      {/* editorial corner meta — like a magazine masthead */}
      <div className="pointer-events-none absolute inset-x-6 top-24 hidden md:flex items-start justify-between font-mono-label text-muted-foreground/70">
        <span>N° 001 — Bangalore / Remote</span>
        <span>Vol. {new Date().getFullYear()}  ·  Rendered live, on scroll</span>
      </div>
      <div className="pointer-events-none absolute bottom-6 left-6 right-6 flex items-end justify-between font-mono-label text-muted-foreground/70">
        <span>An engineering studio</span>
        <span className="hidden sm:inline">Scroll to evolve ↓</span>
      </div>
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
        {[
          ["12+", "Products shipped"],
          ["6", "Applied-research prototypes"],
          ["4", "Continents served"],
          ["48h", "From brief to prototype"],
        ].map(([n, l]) => (
          <div key={l} className="px-6 py-8">
            <div className="font-display italic text-3xl">{n}</div>
            <div className="mt-1 text-xs text-muted-foreground uppercase tracking-widest">{l}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- What we do ---------------- */
function What() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-32 overflow-hidden">
      <span className="ghost-numeral hidden md:block" style={{ fontSize: "22vw", right: "-2vw", bottom: "-10vw", left: "auto" }}>
        01
      </span>
      <div className="relative grid md:grid-cols-12 gap-12 items-start">
        <div className="md:col-span-7 space-y-6 text-lg text-muted-foreground leading-relaxed order-2 md:order-1">
          <p>
            We partner with founders and operating teams to ship the systems their business actually runs on — not decks, not prototypes that quietly die in a Figma file.
          </p>
          <p className="text-foreground">
            Every engagement is led by the same people who write the code. No middle layer, no hand-offs, no vendor theatre.
          </p>
        </div>
        <div className="md:col-span-4 md:col-start-9 text-right order-1 md:order-2">
          <p className="font-mono-label text-primary">01 · What we do</p>
          <JitterText
            as="h2"
            text="A studio, not an agency."
            className="mt-4 font-display italic text-4xl md:text-5xl leading-tight"
          />
        </div>
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
  },
  {
    n: "02",
    title: "Internal platforms & tooling",
    desc: "Dashboards, workflow tools, and back-office systems that make your operators 10× more effective.",
    tags: ["Dashboards", "Automations", "APIs"],
  },
  {
    n: "03",
    title: "Applied research prototypes",
    desc: "Fast, well-instrumented prototypes to validate a hypothesis before you commit six months of roadmap.",
    tags: ["Vision", "NLP", "Simulation"],
  },
  {
    n: "04",
    title: "Founding-team engineering",
    desc: "We embed as a fractional founding engineering team for early-stage companies — from 0 to shipped product.",
    tags: ["0→1", "Architecture", "Hiring"],
  },
];

function Services() {
  return (
    <section id="services" className="relative border-t border-border overflow-hidden">
      <span className="ghost-numeral hidden md:block" style={{ fontSize: "20vw", left: "-2vw", top: "4vw" }}>
        02
      </span>
      <div className="relative mx-auto max-w-7xl px-6 py-32">
        <div className="flex items-end justify-between mb-16 flex-wrap gap-6">
          <div>
            <p className="font-mono-label text-primary">02 · Services</p>
            <JitterText as="h2" text="Four ways we work." className="mt-4 font-display italic text-4xl md:text-5xl" />
          </div>
          <p className="max-w-md text-muted-foreground">
            Every engagement is scoped to a clear outcome, on a fixed timeline, with a single point of ownership.
          </p>
        </div>
        <ul className="divide-y divide-border border-y border-border glass-panel">
          {SERVICES.map((s) => (
            <li
              key={s.n}
              onMouseEnter={() => pulseSignatureField(0.4)}
              className="group grid grid-cols-12 gap-6 py-10 md:py-14 items-start hover:bg-card/40 transition-colors px-2"
            >
              <div className="col-span-12 md:col-span-2 font-display text-5xl md:text-6xl text-muted-foreground group-hover:text-primary transition-colors">
                {s.n}
              </div>
              <div className="col-span-12 md:col-span-6 min-w-0">
                <h3 className="font-display text-2xl md:text-4xl leading-tight tracking-tight">
                  {s.title}
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {s.tags.map((t) => (
                    <span key={t} className="font-mono-label text-muted-foreground border border-border px-2.5 py-1 rounded-sm">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <p className="col-span-12 md:col-span-4 text-muted-foreground leading-relaxed">
                {s.desc}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ---------------- Problem → Solution ---------------- */
function ProblemSolution() {
  return (
    <section id="problem" className="relative border-t border-border overflow-hidden">
      <span className="ghost-numeral hidden md:block" style={{ fontSize: "20vw", right: "-2vw", top: "-4vw", left: "auto" }}>
        03
      </span>
      <div className="relative mx-auto max-w-7xl px-6 py-32">
        <p className="font-mono-label text-primary">03 · Approach</p>
        <JitterText
          as="h2"
          text="Most software projects fail in translation, not code."
          className="mt-4 font-display italic text-4xl md:text-5xl max-w-3xl"
        />

        <div className="mt-16 grid md:grid-cols-2 gap-px bg-border">
          <div className="glass-panel p-10">
            <div className="font-mono-label text-destructive/80">Common failure</div>
            <ul className="mt-6 space-y-4 text-muted-foreground">
              <li>Vague brief → shiny demo → nothing that survives Monday morning.</li>
              <li>Layers of PMs and vendors between the person with the problem and the person writing the code.</li>
              <li>AI features bolted onto products with no evaluation, no guardrails, no plan for failure.</li>
              <li>Prototypes that can't be iterated on because nobody understands the codebase.</li>
            </ul>
          </div>
          <div className="glass-panel p-10 border-l-2 border-primary">
            <div className="font-mono-label text-primary">How we work</div>
            <ul className="mt-6 space-y-4 text-foreground">
              <li>Start with the operating reality, not the wireframe. We sit in on real work first.</li>
              <li>One senior engineer owns the outcome end to end. No hand-offs.</li>
              <li>Ship in weeks, not quarters. Every milestone is production-usable, not a demo.</li>
              <li>Code you can read, extend, and hire against — with docs, tests, and evals from day one.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Process ---------------- */
const STEPS = [
  { n: "01", t: "Discovery", d: "One week. We sit with your team, map the workflow, and write the brief you wish you'd received." },
  { n: "02", t: "Prototype", d: "Two–three weeks. A working slice of the system, in your environment, with real data." },
  { n: "03", t: "Build", d: "Four–eight weeks. We ship the production system, with tests, docs, and evaluations." },
  { n: "04", t: "Handover", d: "You get a codebase your future team can own — plus a month of support included." },
];

function Process() {
  return (
    <section id="process" className="relative border-t border-border overflow-hidden">
      <span className="ghost-numeral hidden md:block" style={{ fontSize: "20vw", left: "-2vw", bottom: "-8vw" }}>
        04
      </span>
      <div className="relative mx-auto max-w-7xl px-6 py-32">
        <p className="font-mono-label text-primary">04 · Process</p>
        <JitterText
          as="h2"
          text="From ambiguous brief to running system, in weeks."
          className="mt-4 font-display italic text-4xl md:text-5xl max-w-3xl"
        />
        <ol className="mt-16 grid md:grid-cols-4 gap-px bg-border">
          {STEPS.map((s) => (
            <li key={s.n} className="glass-panel p-8" onMouseEnter={() => pulseSignatureField(0.3)}>
              <div className="font-mono-label text-muted-foreground">{s.n}</div>
              <div className="mt-4 font-display text-2xl">{s.t}</div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{s.d}</p>
            </li>
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
      <div className="mx-auto max-w-7xl px-6 py-32 grid md:grid-cols-12 gap-12">
        <div className="md:col-span-5">
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
        </div>

        <div className="md:col-span-7">
          {status === "sent" ? (
            <div className="rounded-lg border border-primary/30 bg-primary/5 p-10">
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
            </div>
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
                    <button
                      key={b}
                      type="button"
                      onClick={() => set("budget", b)}
                      className={`rounded-full border px-4 py-2 text-sm transition ${
                        form.budget === b
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {b}
                    </button>
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
                <div className="rounded-sm border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {submitError}
                </div>
              )}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-muted-foreground">We reply within 48 hours.</span>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  onMouseEnter={() => pulseSignatureField(1.2)}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition disabled:opacity-60"
                >
                  {status === "sending" ? "Sending…" : status === "error" ? "Try again" : "Send enquiry"}
                  <span>→</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="font-mono-label text-muted-foreground mb-2">{label}</div>
      {children}
      {error && <div className="mt-2 text-xs text-destructive">{error}</div>}
    </label>
  );
}

/* ---------------- Footer ---------------- */
function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-10 flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Logo />
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
