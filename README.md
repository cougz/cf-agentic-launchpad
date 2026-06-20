# cf-agentic-launchpad

> An open-source foundation for building demos on the Cloudflare agentic stack - built on the very stack it advocates. A thin, well-designed shell that is ready to host self-contained capability modules you can clone, extract, and deploy.

[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com)
[![Flue](https://img.shields.io/badge/framework-Flue-FF5E1F)](https://flueframework.com)
[![Status](https://img.shields.io/badge/status-Phase%201%20·%20App%20Builder-blue)]()

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cougz/cf-agentic-launchpad)

---

## What this is

**cf-agentic-launchpad** is a demo gallery on Cloudflare's agentic platform. It is built on the **publicly advocated three-layer agentic stack**, and it dogfoods its own message: on Cloudflare, **Flue builds the Worker itself**.

```
Framework   →  Flue           ← agents are built here; Flue builds the Worker
Harness     →  Pi             ← Flue wraps this
Runtime     →  Agents SDK     ← each agent becomes a Durable Object on Cloudflare
```

The foundation (shell, design tokens, agent-readiness, git-push deploy) is in place. Phase 1 builds the first module, the **AI App Builder**: a Flue agent that scaffolds a small app inside a `@cloudflare/sandbox` container and ships it to a real **temporary Cloudflare account**, returning a live URL and a claim link.

## The stack

| Layer | Choice |
|-------|--------|
| Build | [Flue](https://flueframework.com) owns the Worker build (`flue build --target cloudflare`) |
| Agent framework | Flue (`@flue/runtime`, `@flue/cli`); agents in `src/agents/` |
| Agent → UI streaming | `@flue/react` (agent stream at `GET /agents/<name>/:id`) |
| Harness / Runtime | Pi (via Flue) over the [Cloudflare Agents SDK](https://developers.cloudflare.com/agents/); each agent is a Durable Object |
| Models | Workers AI binding, keyless (`cloudflare/...` provider) |
| Container sandbox | [`@cloudflare/sandbox`](https://developers.cloudflare.com/sandbox/) (App Builder module) |
| HTTP | [Hono](https://hono.dev) in `src/app.ts`, mounting `flue()` |
| Web shell | React 19 + TanStack Router + Vite, served via the `ASSETS` binding |
| Styling | Tailwind CSS v4 + self-contained design tokens (clean canvas, orange accent, OKLCH, automatic light/dark) |
| Deploy | [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/) (git push), deploying Flue's generated config |

## Current scope

- Foundation (done, deployed live): Flue-built Worker, React shell served via
  `ASSETS` with on-brand kumo styling (dark/light, orange accent), agent-ready
  endpoints, container sandbox wired in, keyless Workers AI agent, git-push
  deploy. Verified live.
- Phase 1 (in progress): the **AI App Builder** module. The Flue agent is a
  stub today; the next steps attach the sandbox build-and-ship tools
  (`wrangler deploy --temporary`) and the streaming UI.

See [`PROJECTPLAN.md`](./PROJECTPLAN.md) for the full plan, known issues, and the
**Handoff: next session** section that tells the next contributor exactly where
to pick up.

## Quick start

```bash
git clone git@github.com:cougz/cf-agentic-launchpad.git
cd cf-agentic-launchpad
npm install
bash scripts/setup-hooks.sh   # enable the em-dash guard hooks
npm run dev                   # Flue dev server (Worker + agents), port 3583
npm run dev:client            # or: the React shell via Vite
```

Requires Node 22 (see `.nvmrc`) and, for the container sandbox, Docker locally.

## Deployment

### One-click

Use the button at the top of this README, or this link:

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cougz/cf-agentic-launchpad)

This forks the repo into your account, provisions the Worker, and connects
Cloudflare Workers Builds so every push to `main` redeploys automatically.

### Connect manually

If you already have the repo, connect Workers Builds once in the dashboard:

1. Cloudflare dashboard, then Workers & Pages, then Create, then Connect to Git.
2. Select your fork of `cf-agentic-launchpad`.
3. Build command: `npm run build` (runs `vite build` then `flue build --target cloudflare`)
4. Deploy command: `npx wrangler deploy --config dist/cf_agentic_launchpad/wrangler.json`

The deploy command must target Flue's **generated** config, not the source-root
`wrangler.jsonc` (Flue generates the Worker entry and bindings at build time).
After that, deployment is git-driven: push to `main` and it builds and deploys.

Notes:

- The build runs on Node 22 (see `.nvmrc`). Workers Builds auto-detects it.
- The Sandbox module uses Cloudflare Containers, so a **Workers Paid plan** and
  Docker (in the build environment) are required.
- `workers_dev` and `preview_urls` are set, so the deploy serves on a
  `*.workers.dev` URL with per-version preview URLs.
- The agent uses the keyless Workers AI binding, so no model API key is needed.

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
