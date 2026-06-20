import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Client-only build. Flue owns the Worker build (flue build --target
// cloudflare); this Vite build produces the React shell into dist/client,
// which the generated Worker serves via the ASSETS binding.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "dist/client",
    emptyOutDir: true,
  },
});
