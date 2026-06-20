# cf-agentic-launchpad

> An open-source showcase of the Cloudflare agentic stack — built on the very stack it advocates. A gallery of self-contained demo modules you can explore live, then clone, extract, and deploy as your own.

[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com)
[![Flue](https://img.shields.io/badge/framework-Flue-FF5E1F)](https://flueframework.com)
[![Status](https://img.shields.io/badge/status-Phase%200-blue)]()

---

## What this is

**cf-agentic-launchpad** demonstrates what you can build on Cloudflare's agentic platform, in one coherent application. It is structured as a **demo gallery**: a thin shell hosting many self-contained capability modules — AI Gateway, Sandbox, Containers, Zero Trust agents, MCP servers, and more.

It doubles as a **launchpad**. Every module is isolated and extractable, so you can clone the repo, lift out a module, and deploy your own demo in minutes.

The project is built on the **publicly advocated three-layer agentic stack** — it dogfoods its own message:

```
Framework   →  Flue           ← every agent is built here
Harness     →  Pi             ← Flue wraps this
Runtime     →  Agents SDK     ← becomes a Durable Object on Cloudflare
```

## The stack

| Layer | Choice |
|-------|--------|
| Agent framework | [Flue](https://flueframework.com) (`@flue/runtime`) |
| Agent → UI streaming | `@flue/react` |
| Harness | Pi (via Flue) |
| Runtime | [Cloudflare Agents SDK](https://developers.cloudflare.com/agents/) — each agent is a Durable Object |
| Code execution | `@cloudflare/codemode` |
| Filesystem | `@cloudflare/shell` |
| Heavy compute | [Cloudflare Containers](https://developers.cloudflare.com/containers/) |
| Web shell | React 19 + TanStack Router + Vite |
| Styling | Tailwind CSS + self-contained design tokens (clean canvas, orange accent, OKLCH, automatic light/dark) |
| Backend | [Hono](https://hono.dev) on Cloudflare Workers |
| State | Durable Objects + KV |
| Deploy | [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/) (git push) |

## Modules

| Module | Capability | Status |
|--------|-----------|--------|
| **AI Gateway** | Dynamic routing, cache, spend limits, multi-provider fallback, feedback, logs | Planned (P0) |
| **Sandbox** | Agent writes and runs code on a durable filesystem (`codemode` + `shell`) | Planned (P0) |
| **MCP Server** | Agent exposes and consumes MCP tools | Planned (P0) |
| **Containers** | Escalate from a Worker isolate to a full OS | Planned (P1) |
| **Zero Trust Agent** | Identity-aware, Access-gated agent | Planned (P1) |
| **Multi-channel** | One agent across Slack, GitHub, and Linear | Planned (P2) |

See [`PROJECTPLAN.md`](./PROJECTPLAN.md) for the full plan, phases, and scope.

## Quick start

```bash
git clone git@github.com:cougz/cf-agentic-launchpad.git
cd cf-agentic-launchpad
npm install
npm run dev
```

> The application is under active construction (Phase 0). Commands and structure will land as the walking skeleton is built.

## Deployment

Deployment is fully git-driven via **Cloudflare Workers Builds** — push to `main` and the application builds and deploys automatically. There is no manual `wrangler deploy` step.

## Build your own

Every module under `demos/` is self-contained and extractable:

1. Copy a module directory into a fresh repo.
2. Set your environment variables / secrets.
3. Connect Workers Builds and push.

Each module ships agent-readiness endpoints (`llms.txt`, `/openapi.json`, `/.well-known/mcp`, an A2A agent card, and a `SKILL.md`) so AI coding agents can discover and extend it. See [`AGENTS.md`](./AGENTS.md) for the conventions an AI agent should follow when building here.

## License

See [`LICENSE`](./LICENSE).

---

_Built on [Flue](https://flueframework.com), the [Cloudflare Agents SDK](https://developers.cloudflare.com/agents/), and [Cloudflare Workers](https://workers.cloudflare.com)._
