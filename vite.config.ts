import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Generate build timestamp for cache busting
const buildTimestamp = Date.now().toString();

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    headers: {
      "Cross-Origin-Opener-Policy": "unsafe-none",
    },
  },
  build: {
    sourcemap: true,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    // Inject build timestamp into index.html
    {
      name: 'html-build-version',
      transformIndexHtml(html: string) {
        return html.replace(
          '</head>',
          `  <meta name="build-version" data-build-version="${buildTimestamp}" />\n  </head>`
        );
      },
    },
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));