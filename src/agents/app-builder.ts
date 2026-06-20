import { createAgent, type AgentRouteHandler } from "@flue/runtime";

// AI App Builder agent (Phase 1, work in progress).
//
// Minimal for now: this validates the Flue build and the generated Durable
// Object class on the Cloudflare target. Next steps attach the container
// sandbox (cloudflareSandbox(getSandbox(env.Sandbox, id))) and the
// build-and-ship tools (write files, npm install, wrangler deploy --temporary).
//
// Exposing route lets the shell stream the agent at GET /agents/app-builder/:id.
export const route: AgentRouteHandler = async (_c, next) => next();

export default createAgent(() => ({
  // Keyless: the cloudflare/... provider runs through the Worker's AI binding
  // (billed to the account, with a free daily allocation). No API key needed.
  model: "cloudflare/@cf/meta/llama-3.3-70b-instruct-fp8-fast",
  instructions:
    "You are the AI App Builder. You scaffold a small Cloudflare Worker app, " +
    "build it, and deploy it to a temporary Cloudflare account, then report the " +
    "live URL and claim URL. (Tools are wired in a later step.)",
}));
