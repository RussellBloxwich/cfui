import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

// CFUI_ROOT can override the package location for an external gallery checkout.
const packageRoot = process.env.CFUI_ROOT ? resolve(process.env.CFUI_ROOT) : fileURLToPath(new URL("../", import.meta.url));
const galleryRoot = fileURLToPath(new URL("./", import.meta.url));

export default defineConfig({
  root: galleryRoot,
  resolve: {
    alias: [
      { find: "cfui/styles.css", replacement: resolve(packageRoot, "src/styles.css") },
      { find: "cfui", replacement: resolve(packageRoot, "src/index.ts") },
    ],
    dedupe: ["react", "react-dom"],
  },
  server: { host: "127.0.0.1", port: 8795, strictPort: true, fs: { allow: [packageRoot, galleryRoot] } },
  build: { outDir: resolve(packageRoot, "gallery-dist"), emptyOutDir: true },
});
