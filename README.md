# cf-agentic-launchpad

> An open-source foundation for building demos on the Cloudflare agentic stack - built on the very stack it advocates. A thin, well-designed shell that is ready to host self-contained capability modules you can clone, extract, and deploy.

[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com)
[![Flue](https://img.shields.io/badge/framework-Flue-FF5E1F)](https://flueframework.com)
[![Status](https://img.shields.io/badge/status-Phase%200%20·%20Skeleton-blue)]()

---

## What this is

**cf-agentic-launchpad** is the foundation for a demo gallery on Cloudflare's agentic platform. The initial milestone is the **skeleton only**: a thin shell, a Worker backend, design tokens, agent-readiness scaffolding, and a one-push deploy pipeline. Capability modules are intentionally **out of scope for now** - the skeleton comes first.

Once the foundation is in place, modules can be added as self-contained, extractable units. The project is built on the **publicly advocated three-layer agentic stack** - it dogfoods its own message:

```
Framework   →  Flue           ← agents are built here
Harness     →  Pi             ← Flue wraps this
Runtime     →  Agents SDK     ← becomes a Durable Object on Cloudflare
```

## The stack

| Layer | Choice |
|-------|--------|
| Agent framework | [Flue](https://flueframework.com) (`@flue/runtime`) |
| Agent → UI streaming | `@flue/react` |
| Harness | Pi (via Flue) |
| Runtime | [Cloudflare Agents SDK](https://developers.cloudflare.com/agents/) - each agent is a Durable Object |
| Code execution | `@cloudflare/codemode` |
| Filesystem | `@cloudflare/shell` |
| Heavy compute | [Cloudflare Containers](https://developers.cloudflare.com/containers/) |
| Web shell | React 19 + TanStack Router + Vite |
| Styling | Tailwind CSS + self-contained design tokens (clean canvas, orange accent, OKLCH, automatic light/dark) |
| Backend | [Hono](https://hono.dev) on Cloudflare Workers |
| State | Durable Objects + KV |
| Deploy | [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/) (git push) |

## Current scope

The first deliverable is the **walking skeleton**:

- Thin React + TanStack Router shell with an (empty) gallery surface
- Hono Worker backend with bindings pre-wired
- Self-contained design-token set
- Agent-readiness scaffolding (`llms.txt`, `AGENTS.md`)
- Git-push deploy via Workers Builds

There are **no demo modules yet** - they are a later effort, added on top of this foundation.

See [`PROJECTPLAN.md`](./PROJECTPLAN.md) for the full plan and Phase 0 tickets.

## Quick start

```bash
git clone git@github.com:cougz/cf-agentic-launchpad.git
cd cf-agentic-launchpad
npm install
npm run dev
```

> The application is under active construction (Phase 0). Commands and structure will land as the walking skeleton is built.

## Deployment

Deployment is fully git-driven via **Cloudflare Workers Builds** - push to `main` and the application builds and deploys automatically. There is no manual `wrangler deploy` step.

## Development

After cloning, enable the repo git hooks once:

```bash
bash scripts/setup-hooks.sh
```

This points git at `.githooks/`, which enforces a house style rule: commits are
blocked if any staged file or the commit message contains an em-dash (the long
dash). Use a regular hyphen or rephrase instead.

## License

See [`LICENSE`](./LICENSE).

---

_Built on [Flue](https://flueframework.com), the [Cloudflare Agents SDK](https://developers.cloudflare.com/agents/), and [Cloudflare Workers](https://workers.cloudflare.com)._
