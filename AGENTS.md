# AGENTS.md

A README for coding agents. This file gives AI agents (OpenCode, Codex, Cursor,
Claude Code, Gemini CLI, and others) the context and rules needed to work in
this repository. Human-facing docs live in README.md; agent-facing rules live
here. Treat this as living documentation and keep it up to date.

Precedence note: the closest AGENTS.md to an edited file wins, and explicit user
instructions in chat override this file.

## Project overview

cf-agentic-launchpad is an open-source foundation for building demos on the
Cloudflare agentic stack. The current scope is the **skeleton only**: a thin
shell, a Worker backend, design tokens, agent-readiness scaffolding, and a
git-push deploy pipeline. There are no demo modules yet. Do not add modules
until PROJECTPLAN.md expands the scope. See PROJECTPLAN.md for the full plan.

## Setup commands

Use Node 22 (see `.nvmrc`).

```bash
# One-time after cloning: enable the repo git hooks (em-dash guard)
bash scripts/setup-hooks.sh

# Install dependencies
npm install

# Local dev server (Vite + the Worker via @cloudflare/vite-plugin)
npm run dev
```

## Testing and verification

Before finishing any task, run the checks that apply and fix all failures:

- **Em-dash guard (always):** committing runs `.githooks/pre-commit` and
  `.githooks/commit-msg`. Both block any em-dash (U+2014). If a commit is
  blocked, replace the em-dash with a hyphen or rephrase, then retry.
- **Typecheck and build:** run `npm run typecheck` and `npm run build` and
  ensure both pass before declaring a task done. A lint script is not set up
  yet; add one and update this section when it exists.

## Code style

- **No em-dashes anywhere.** Never use the long dash character (U+2014) in code,
  comments, docs, or commit messages. Use a regular hyphen '-' or rephrase. This
  is enforced by the git hooks described above.
- Prefer plain ASCII in prose. Existing arrows and separators in the docs are
  fine; do not introduce em-dashes.
- TypeScript with strict mode (enabled in `tsconfig.json`).
- Styling uses only the in-repo design tokens (`src/shell/tokens.css`). Never
  use raw hex values and never add a second styling system.

## Security considerations

- Never commit secrets. Use `.env.example` for placeholders only. Real secrets
  are set in the Cloudflare Workers Builds environment.
- This is a public repository. Do not add private packages, internal URLs, or
  internal product names.
- Secret scanning and push protection are expected to stay enabled on the repo.

## Commit and PR guidelines

- Commit messages must be em-dash free (the commit-msg hook enforces this).
- Write clear, imperative commit subjects (for example: "Add Worker entry").
- Do not deploy by hand. Commit and push to `main`; Cloudflare Workers Builds
  builds and deploys automatically. Never run `wrangler deploy`.
- Remotes: GitHub (`cougz/cf-agentic-launchpad`) is primary and drives Workers
  Builds; GitLab (`tim.seiffert/cf-agentic-launchpad`) is a dual-push mirror. A
  plain `git push` writes to both.

## The stack (do not substitute)

- Agent framework: Flue (`@flue/runtime`). Any future agent is a Flue agent.
- Agent to UI streaming: `@flue/react`.
- Harness: Pi (inherited via Flue).
- Runtime: Cloudflare Agents SDK. Each agent becomes a Durable Object.
- Code execution: `@cloudflare/codemode`. Filesystem: `@cloudflare/shell`.
- Heavy compute: Cloudflare Containers (only when a full OS is required).
- Web shell: React 19 + TanStack Router + Vite (thin chrome only).
- Styling: Tailwind CSS + in-repo design tokens. No external design package.
- Backend: Hono on Cloudflare Workers.
- State: Durable Objects + KV.
- Deploy: Cloudflare Workers Builds on git push.

## Repository structure

```
AGENTS.md          # this file: rules for coding agents
README.md          # human overview
PROJECTPLAN.md     # plan, scope, phases, tickets
index.html         # Vite client entry
vite.config.ts     # Vite + React + Cloudflare + Tailwind plugins
wrangler.jsonc     # Worker config and bindings
tsconfig.json      # TypeScript config (strict)
.githooks/         # em-dash guard hooks (pre-commit, commit-msg)
scripts/           # setup-hooks.sh and future helpers
src/
  shell/           # React + TanStack Router + Tailwind tokens
    routes/        # route components
  worker/          # Hono router + agent-ready endpoints (serves /llms.txt)
demos/
  sandbox/         # Sandbox module (Phase 1): @cloudflare/sandbox backend routes
Dockerfile         # container image for the Sandbox module
```

Note: `llms.txt` is served by the Worker at `/llms.txt` (its source lives in
`src/worker/index.ts`); it is not a standalone file in the repo.

## Scope guardrails

- Skeleton first. Keep the foundation clean and deployable. Do not implement
  demo capabilities until PROJECTPLAN.md scopes them.
- When modules are eventually added, each lives in `demos/<name>/`, is
  self-contained, and is extractable into its own repo.

## Agent-readiness scaffolding

The skeleton establishes a discovery surface that future modules inherit:

- `/llms.txt`
- `/robots.txt`, `/sitemap.xml`
- `Link: </llms.txt>` and `Content-Signal: ai-input=yes` response headers
- `Accept: text/markdown` negotiation on `/`
- this `AGENTS.md` at the repo root

Reference: https://isitagentready.com

## Nested AGENTS.md (future)

When `demos/` gains modules, add a dedicated `AGENTS.md` inside each module
directory. Agents read the nearest file first, so each module can carry tailored
instructions while this root file holds the shared rules.
