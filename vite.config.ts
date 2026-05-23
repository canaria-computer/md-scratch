import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";
import { defineConfig, type Plugin } from "vite";
import { VitePWA } from "vite-plugin-pwa";

import { cloudflare } from "@cloudflare/vite-plugin";

import csp from "vite-plugin-csp-guard";
import { definePolicy, self } from "csp-toolkit";

let resolvedCspHeader = "";

const createAppTypePatch = (): { patch: Plugin; restore: Plugin } => {
  let originalAppType: string = "custom";
  let originalSsr: boolean | string | undefined = undefined;

  const patch: Plugin = {
    name: "force-apptype-spa",
    enforce: "post",
    configResolved(config) {
      originalAppType = config.appType as string;
      originalSsr = config.build.ssr as boolean | string | undefined;
      (config as any).appType = "spa";
      (config as any).build = { ...config.build, ssr: false };
    },
  };

  const restore: Plugin = {
    name: "restore-apptype",
    enforce: "post",
    configResolved(config) {
      (config as any).appType = originalAppType;
      (config as any).build = { ...config.build, ssr: originalSsr };
    },
  };

  return { patch, restore };
};

const cspToHeaders = (): Plugin => ({
  name: "csp-to-headers",
  enforce: "post",
  closeBundle() {
    if (!resolvedCspHeader) return;

    const headersPath = resolve(__dirname, "dist/_headers");

    if (!existsSync(headersPath)) {
      console.warn("[csp-to-headers] dist/_headers not found, skipping");
      return;
    }

    const existing = readFileSync(headersPath, "utf-8");
    const placeholder = "  # [csp-inject-do-not-remove]";

    if (!existing.includes(placeholder)) {
      console.warn(
        "[csp-to-headers] placeholder '# [csp-inject-do-not-remove]' not found in dist/_headers, skipping",
      );
      return;
    }

    const updated = existing.replace(
      placeholder,
      `  Content-Security-Policy: ${resolvedCspHeader}`,
    );

    writeFileSync(headersPath, updated, "utf-8");
    console.log("[csp-to-headers] CSP injected into dist/_headers");
  },
});

const { patch, restore } = createAppTypePatch();

// https://vitejs.dev/config/
export default defineConfig({
  appType: "spa",
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",

      pwaAssets: {
        disabled: false,
        config: true,
      },

      manifest: {
        name: "md-scratch",
        short_name: "md-scratch",
        description: "Simple Markdown Memo Tool",
        theme_color: "#0d1117",
      },

      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
      },

      devOptions: {
        enabled: false,
        navigateFallback: "index.html",
        suppressWarnings: true,
        type: "module",
      },
    }),
    cloudflare(),
    patch,
    csp({
      algorithm: "sha384",
      dev: {
        run: false,
        override: false,
      },
      build: {
        sri: true,
        override: true,
      },
      policy: definePolicy({
        upgradeInsecureRequests: [],
        defaultSrc: ["none"],
        imgSrc: [self, "data:"],
        scriptSrc: [self],
        styleSrc: [self, "https://fonts.googleapis.com"],
        fontSrc: [self, "https://fonts.gstatic.com"],
        baseUri: ["none"],
        trustedTypes: ["default"],
        reportUri: ["https://csp.2pc.nexus/csp-report"],
        reportTo: ["https://csp.2pc.nexus/csp-report"],
        manifestSrc: [self],
        connectSrc: [self],
      }),
      transformPolicy: (cspString) => {
        resolvedCspHeader = cspString;
        console.log("[csp]", resolvedCspHeader);
        return cspString;
      },
    }),
    restore,
    cspToHeaders(),
  ],
});
