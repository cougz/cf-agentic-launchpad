import { flue } from "@flue/runtime/routing";
import { Hono } from "hono";
import { sandboxRoutes } from "./routes/sandbox.ts";

// Custom HTTP application composed with Flue. Flue owns the Worker build on
// Cloudflare; this Hono app adds our own routes and then mounts flue() so the
// generated Worker serves our agents, workflows, and run/stream routes too.
//
// The React shell is served by the ASSETS binding (see wrangler.jsonc). Only
// the prefixes listed in assets.run_worker_first reach this Worker; everything
// else is served as a static asset with single-page-application fallback.

const LINK_HEADER = '</llms.txt>; rel="llms"';
const CONTENT_SIGNAL_HEADER = "ai-input=yes";

const LLMS_TXT = `# cf-agentic-launchpad

> An open-source agentic launchpad built on the Cloudflare agentic stack,
> Flue (framework) over Pi (harness) over the Agents SDK (runtime). The Worker
> is built by Flue. The first module is the AI App Builder.

## Stack
- Flue (@flue/runtime, @flue/cli) builds the Worker (flue build --target cloudflare)
- Cloudflare Agents SDK (each agent is a Durable Object)
- @cloudflare/sandbox (container) for the App Builder module
- React 19 + Vite + Tailwind v4 shell, served via the ASSETS binding
- Hono routes composed with flue(); Workers Builds for deploy

## Endpoints
- GET /llms.txt, /robots.txt, /sitemap.xml
- POST /demos/sandbox/api/exec | /run, GET/POST /demos/sandbox/api/file(s)
- Flue routes under /agents/:name/:id and /workflows/:name

## For agents building here
- Read /AGENTS.md for conventions and the module admission criteria.
- House rule: no em-dashes anywhere (enforced by git hooks).
- Do not run wrangler deploy by hand; push to main and Workers Builds deploys.

## Links
- Flue: https://flueframework.com
- Agents SDK: https://developers.cloudflare.com/agents/
- Agent-readiness checks: https://isitagentready.com
`;

const ROBOTS_TXT = `User-agent: *
Allow: /

Sitemap: /sitemap.xml
`;

const SITEMAP_XML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>/</loc></url>
  <url><loc>/llms.txt</loc></url>
</urlset>
`;

function text(body: string, contentType: string): Response {
  return new Response(body, {
    headers: {
      "content-type": contentType,
      Link: LINK_HEADER,
      "Content-Signal": CONTENT_SIGNAL_HEADER,
    },
  });
}

const app = new Hono();

// Agent-readiness endpoints (listed in assets.run_worker_first).
app.get("/llms.txt", () => text(LLMS_TXT, "text/plain; charset=utf-8"));
app.get("/robots.txt", () => text(ROBOTS_TXT, "text/plain; charset=utf-8"));
app.get("/sitemap.xml", () => text(SITEMAP_XML, "application/xml; charset=utf-8"));

// Sandbox module low-level API (container-backed exec, run, files).
app.route("/demos/sandbox/api", sandboxRoutes);

// Mount Flue: serves exposed agents, workflows, run reads, and channels.
app.route("/", flue());

export default app;
