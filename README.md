# Cohortia Labs — website

A TanStack Start (React 19) site with a single WebGL2 shader running as the
site's continuous background identity (`src/components/SignatureField.tsx`),
scroll- and hover-reactive, plus a jitter-reveal text system
(`src/components/JitterText.tsx`). No third-party platform tooling required —
this runs with plain Vite.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL.

## Contact form (Web3Forms)

The contact form posts to [Web3Forms](https://web3forms.com) so enquiries
land in your inbox with no backend of your own:

1. Go to web3forms.com, enter the email you want enquiries sent to, and
   create a free access key (no account needed).
2. Copy `.env.example` to `.env.local` and paste the key in:
   ```
   VITE_WEB3FORMS_KEY=your-access-key-here
   ```
3. Restart the dev server (env files are only read on startup).

Without a key set, the form fails gracefully with an on-screen message
instead of pretending to succeed.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build (outputs to `.output/`) |
| `npm run preview` | Preview a production build locally |
| `npm run lint` | ESLint |
| `npm run format` | Prettier, write mode |

## Deployment

The build targets Cloudflare Workers by default via Nitro
(`vite.config.ts` → `nitro({ preset: "cloudflare-module" })`). To target
something else (Node, Vercel, Netlify, etc.), change that one preset string —
see the [Nitro deploy docs](https://nitro.build/deploy) for the full list of
presets, then deploy `.output/` per that target's instructions.

## Project structure

```
src/
  routes/          # TanStack Start file-based routes — see routes/README.md
  components/      # SignatureField (bg shader), JitterText, CursorHalo, ui/ (shadcn)
  lib/              # utils, error handling, the signature-field pulse signal
  styles.css        # design tokens (colors, fonts) + custom utilities
```
