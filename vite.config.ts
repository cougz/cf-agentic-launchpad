import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";

// React shell + Cloudflare Worker (Hono) + Tailwind v4.
// The Cloudflare plugin reads wrangler.jsonc for the Worker entry and assets.
export default defineConfig({
  plugins: [react(), cloudflare(), tailwindcss()],
});
