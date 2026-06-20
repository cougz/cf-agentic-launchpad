import { Hono } from "hono";
import { getSandbox } from "@cloudflare/sandbox";
import { sandboxRoutes } from "../../demos/sandbox/routes";

// The Sandbox module's container-backed Durable Object. The class must be
// re-exported from the Worker entry for the runtime to find it.
export { Sandbox } from "@cloudflare/sandbox";

// Binding surface. ASSETS serves the built React shell. Sandbox is the
// container-backed Durable Object namespace used by the Sandbox module.
interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
  Sandbox: Parameters<typeof getSandbox>[0];
}

// Agent-readiness response headers applied to every response. See
// https://isitagentready.com for the conventions.
const LINK_HEADER = '</llms.txt>; rel="llms"';
const CONTENT_SIGNAL_HEADER = "ai-input=yes";

// Single source of truth for the machine-readable project summary, served at
// /llms.txt and returned for markdown content negotiation on /.
const LLMS_TXT = `# cf-agentic-launchpad

> An open-source foundation for building demos on the Cloudflare agentic stack,
> built on the stack it advocates: Flue (framework) over Pi (harness) over the
> Agents SDK (runtime). Current scope is the skeleton only; demo modules are a
> later effort.

## Stack
- Flue (@flue/runtime) + @flue/react (for future agent modules)
- Cloudflare Agents SDK (each agent becomes a Durable Object)
- @cloudflare/codemode, @cloudflare/shell, Cloudflare Containers
- React 19 + TanStack Router + Vite + Tailwind v4 (in-repo design tokens)
- Hono on Cloudflare Workers; Workers Builds for deploy

## Scope
- Skeleton only: shell, Worker, design tokens, agent-readiness scaffolding,
  and a git-push deploy pipeline. No demo modules yet.

## For agents building here
- Read /AGENTS.md for conventions and rules.
- House rule: no em-dashes anywhere (enforced by git hooks).
- Do not run wrangler deploy; push to main and Workers Builds deploys.

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

const app = new Hono<{ Bindings: Env }>();

function text(body: string, contentType: string): Response {
  return new Response(body, {
    headers: {
      "content-type": contentType,
      "Link": LINK_HEADER,
      "Content-Signal": CONTENT_SIGNAL_HEADER,
    },
  });
}

// Serve a built asset (or the SPA fallback) and attach agent-readiness headers.
async function serveAsset(env: Env, request: Request): Promise<Response> {
  const res = await env.ASSETS.fetch(request);
  const out = new Response(res.body, res);
  out.headers.set("Link", LINK_HEADER);
  out.headers.set("Content-Signal", CONTENT_SIGNAL_HEADER);
  return out;
}

// Agent-readiness endpoints.
app.get("/llms.txt", () => text(LLMS_TXT, "text/plain; charset=utf-8"));
app.get("/robots.txt", () => text(ROBOTS_TXT, "text/plain; charset=utf-8"));
app.get("/sitemap.xml", () => text(SITEMAP_XML, "application/xml; charset=utf-8"));

// Sandbox module backend (container-backed code execution).
app.route("/demos/sandbox/api", sandboxRoutes);

// Markdown content negotiation on the root.
app.get("/", (c) => {
  const accept = c.req.header("accept") ?? "";
  if (accept.includes("text/markdown")) {
    return text(LLMS_TXT, "text/markdown; charset=utf-8");
  }
  return serveAsset(c.env, c.req.raw);
});

// Everything else: serve the React shell (SPA fallback handles client routes).
app.get("*", (c) => serveAsset(c.env, c.req.raw));

export default app;
