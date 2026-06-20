# AGENTS.md - cf-agentic-launchpad

This file is the single source of truth for AI coding agents and contributors.
Read it fully before generating or modifying code.

## What this project is

An open-source foundation for building demos on the Cloudflare agentic stack.
The current scope is the **skeleton only**: a thin shell, a Worker backend,
design tokens, agent-readiness scaffolding, and a git-push deploy pipeline.
There are **no demo modules yet**; they are a later effort. Do not add modules
unless the scope is explicitly expanded in PROJECTPLAN.md.

## House style (enforced)

- **No em-dashes.** Never use the long dash character (U+2014) anywhere: not in
  code, comments, docs, or commit messages. Use a regular hyphen '-' or
  rephrase. Committed git hooks in `.githooks/` block any commit that violates
  this. Run `bash scripts/setup-hooks.sh` once after cloning to enable them.
- Prefer plain ASCII in prose. Arrows and separators already in the docs are
  acceptable, but do not introduce em-dashes.

## The stack (do not substitute)

- Agent framework: Flue (`@flue/runtime`). Any future agent is a Flue agent.
- Agent to UI streaming: `@flue/react`.
- Harness: Pi (inherited via Flue).
- Runtime: Cloudflare Agents SDK. Each agent becomes a Durable Object.
- Code execution: `@cloudflare/codemode`. Filesystem: `@cloudflare/shell`.
- Heavy compute: Cloudflare Containers (only when a full OS is required).
- Web shell: React 19 + TanStack Router + Vite (thin chrome only).
- Styling: Tailwind CSS + the in-repo design tokens. Never invent new colors;
  use the tokens. No external or private design package.
- Backend: Hono on Cloudflare Workers.
- State: Durable Objects + KV.
- Deploy: Workers Builds on git push. NEVER run `wrangler deploy` manually.

## Rules

1. Skeleton first. Keep the foundation clean and deployable; do not add demo
   capabilities until PROJECTPLAN.md scopes them.
2. No private packages, no internal URLs, no internal product names. This is a
   public repository.
3. No committed secrets. Use `.env.example` only. Real secrets are configured
   in the Workers Builds environment.
4. UI uses only the design tokens. No raw hex values, no parallel styling
   systems.
5. Deploy is git-driven. Commit and push to `main`; Workers Builds builds and
   deploys. Do not deploy by hand.
6. Keep `demos/` empty until modules are scoped. When modules arrive, each one
   lives in `demos/<name>/`, is self-contained, and is extractable into its own
   repo.

## Repository layout

```
AGENTS.md          # this file
README.md          # human overview
PROJECTPLAN.md     # plan, scope, phases, tickets
llms.txt           # machine-readable project spec (planned)
wrangler.jsonc     # Worker config and bindings (planned)
.githooks/         # em-dash guard hooks
scripts/           # setup-hooks.sh and future helpers
src/
  shell/           # React + TanStack Router + Tailwind tokens (planned)
  worker/          # Hono router + agent-ready endpoints (planned)
demos/             # empty; future home for modules
```

## Agent-readiness scaffolding

The skeleton establishes a discovery surface that future modules inherit:

- `/llms.txt`
- `/robots.txt`, `/sitemap.xml`
- `Link: </llms.txt>` and `Content-Signal: ai-input=yes` response headers
- `Accept: text/markdown` negotiation on `/`
- this `AGENTS.md` at the repo root

Reference: https://isitagentready.com

## Git and deploy

- Remotes: GitHub (`cougz/cf-agentic-launchpad`) is primary; GitLab
  (`tim.seiffert/cf-agentic-launchpad`) is a dual-push mirror. A plain
  `git push` writes to both.
- Commit messages must be em-dash free (the commit-msg hook enforces this).
- Push to `main`; Workers Builds handles deployment.
