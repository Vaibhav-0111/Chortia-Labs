import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

// Plain, self-contained Vite config — no external platform tooling required.
export default defineConfig(async ({ command }) => {
  const plugins = [
    tailwindcss(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackStart({
      // TanStack Start's server entry is routed through src/server.ts,
      // which wraps SSR errors in a plain error page instead of a raw 500.
      server: { entry: "server" },
      importProtection: {
        behavior: "error",
        client: { files: ["**/server/**"], specifiers: ["server-only"] },
      },
    }),
    viteReact(),
  ];

  // Nitro packages the server build for deployment; only needed at build time.
  // Swap the preset below (e.g. "node-server", "vercel", "netlify") to target
  // a different host — see https://nitro.build/deploy for the full list.
  if (command === "build") {
    const { nitro } = await import("nitro/vite");
    plugins.push(nitro({ preset: "cloudflare-module" }));
  }

  return {
    resolve: {
      alias: { "@": new URL("./src", import.meta.url).pathname },
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },
    optimizeDeps: {
      include: ["react", "react-dom", "react-dom/client", "react/jsx-runtime", "react/jsx-dev-runtime"],
    },
    plugins,
  };
});
