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
    sourcemap: false,
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('recharts') || id.includes('d3-')) return 'charts';
            if (id.includes('three') || id.includes('@react-three')) return 'three';
            if (id.includes('framer-motion')) return 'motion';
            if (id.includes('leaflet') || id.includes('mapbox')) return 'maps';
            if (id.includes('jspdf') || id.includes('html2canvas') || id.includes('pdfjs')) return 'pdf';
            if (id.includes('jszip')) return 'zip';
            if (id.includes('@radix-ui')) return 'radix';
          }
        },
      },
    },
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