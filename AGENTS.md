# AGENTS.md

A README for coding agents. This file gives AI agents (OpenCode, Codex, Cursor,
Claude Code, Gemini CLI, and others) the context and rules needed to work in
this repository. Human-facing docs live in README.md; agent-facing rules live
here. Treat this as living documentation and keep it up to date.

Precedence note: the closest AGENTS.md to an edited file wins, and explicit user
instructions in chat override this file.

## Project overview

cf-agentic-launchpad is an open-source agentic launchpad built on the Cloudflare
agentic stack: Flue (framework) over Pi (harness) over the Agents SDK (runtime).
It is a gallery shell that hosts Flue-agent demo modules. Phase 1 builds the
first module, the AI App Builder. See PROJECTPLAN.md for the full plan and the
module admission criteria below.

Important: on Cloudflare, **Flue owns the Worker build**. `flue build --target
cloudflare` generates the Worker entry, the agent Durable Object classes, and a
deployable `dist/cf_agentic_launchpad/wrangler.json`. You deploy that generated
config, not the source-root `wrangler.jsonc`.

## Setup commands

Use Node 22 (see `.nvmrc`).

```bash
# One-time after cloning: enable the repo git hooks (em-dash guard)
bash scripts/setup-hooks.sh

# Install dependencies
npm install

# Local dev of the Worker + agents (Flue dev server, port 3583)
npm run dev

# Local dev of just the React shell (Vite dev server)
npm run dev:client
```

## Testing and verification

Before finishing any task, run the checks that apply and fix all failures:

- **Em-dash guard (always):** committing runs `.githooks/pre-commit` and
  `.githooks/commit-msg`. Both block any em-dash (U+2014). If a commit is
  blocked, replace the em-dash with a hyphen or rephrase, then retry.
- **Typecheck and build:** run `npm run typecheck`, then `npm run build`.
  `build` runs the client build (`vite build` to `dist/client`) followed by the
  Flue Worker build (`flue build --target cloudflare`). Both must pass.
- **Deploy dry-run (optional):** `npx wrangler deploy --dry-run --config
  dist/cf_agentic_launchpad/wrangler.json` validates the generated Worker.
  A lint script is not set up yet; add one and update this section when it exists.

## Code style

- **No em-dashes anywhere.** Never use the long dash character (U+2014) in code,
  comments, docs, or commit messages. Use a regular hyphen '-' or rephrase. This
  is enforced by the git hooks described above.
- Prefer plain ASCII in prose. Existing arrows and separators in the docs are
  fine; do not introduce em-dashes.
- TypeScript with strict mode (enabled in `tsconfig.json`). Use `.ts` extensions
  in intra-project imports (Flue's build expects them).
- Styling uses only the in-repo design tokens (`src/shell/tokens.css`). Never
  use raw hex values and never add a second styling system.

## Security considerations

- Never commit secrets. Use `.env.example` / `.dev.vars` for placeholders only.
  Real secrets are set in the Workers Builds environment or via `wrangler secret`.
- This is a public repository. Do not add private packages, internal URLs, or
  internal product names.
- Secret scanning and push protection are expected to stay enabled on the repo.

## Commit and PR guidelines

- Commit messages must be em-dash free (the commit-msg hook enforces this).
- Write clear, imperative commit subjects (for example: "Add app-builder agent").
- Do not deploy by hand. Commit and push to `main`; Cloudflare Workers Builds
  builds and deploys automatically.
- Remotes: GitHub (`cougz/cf-agentic-launchpad`) is primary and drives Workers
  Builds; GitLab (`tim.seiffert/cf-agentic-launchpad`) is a dual-push mirror. A
  plain `git push` writes to both.

## The stack (do not substitute)

- Build: **Flue owns the Worker build** (`flue build --target cloudflare`).
- Agent framework: Flue (`@flue/runtime`, `@flue/cli`). Agents live in
  `src/agents/<name>.ts` and default-export `createAgent(...)`.
- Harness: Pi (inherited via Flue). Runtime: Cloudflare Agents SDK (`agents`,
  pinned to 0.14.x). Each agent becomes a Durable Object.
- Models: keyless via the Workers AI binding using the `cloudflare/...` provider
  (for example `cloudflare/@cf/meta/llama-3.3-70b-instruct-fp8-fast`). Requires
  the `AI` binding. Do not use `cloudflare-workers-ai/...` (that path needs an
  API token).
- Container sandbox: `@cloudflare/sandbox` for the App Builder module. The
  `Sandbox` class is exported from `src/cloudflare.ts`.
- HTTP: Hono in `src/app.ts`, which mounts `flue()` plus our own routes.
- Web shell: React 19 + TanStack Router + Vite, built to `dist/client` and
  served by the Worker via the `ASSETS` binding.
- Styling: Tailwind CSS v4 + in-repo design tokens. No external design package.
- Deploy: Cloudflare Workers Builds on git push (deploys the generated config).

## Repository structure (src layout)

```
AGENTS.md          # this file: rules for coding agents
README.md          # human overview
PROJECTPLAN.md     # plan, scope, phases
index.html         # Vite client entry
vite.config.ts     # client build (React + Tailwind) -> dist/client
wrangler.jsonc     # source config Flue reads (bindings, migrations, container, assets)
Dockerfile         # container image for the Sandbox module
tsconfig.json      # TypeScript config (strict)
.githooks/         # em-dash guard hooks (pre-commit, commit-msg)
scripts/           # setup-hooks.sh and future helpers
src/               # Flue source dir (Flue discovers app.ts, cloudflare.ts, agents/)
  app.ts           # Hono app: agent-ready endpoints + sandbox API + flue()
  cloudflare.ts    # Cloudflare-only Worker exports (export Sandbox)
  agents/          # Flue agents (one per module): app-builder.ts
  routes/          # plain Hono sub-apps imported by app.ts (sandbox.ts)
  shell/           # React + TanStack Router + Tailwind tokens (the client)
dist/client/       # GENERATED client build (gitignored)
dist/cf_agentic_launchpad/  # GENERATED Flue Worker + deployable wrangler.json
```

Note: `/llms.txt`, `/robots.txt`, `/sitemap.xml` are served by the Worker from
`src/app.ts` (listed in `assets.run_worker_first`), not as static files.

## Scope guardrails

- Implement demo capabilities only when PROJECTPLAN.md scopes them.
- A module is a Flue agent in `src/agents/<name>.ts` plus its UI route in
  `src/shell` and any bindings it needs. It must be extractable into its own
  minimal Flue app.

## Module admission criteria

Every module must pass all of these before it is built. They keep modules
aligned with the reason this project exists: showcasing the Cloudflare agentic
stack (Flue over Pi over the Agents SDK). If a proposed module fails any of
these, do not build it; propose a better-fitting one.

1. **Flue agent first.** The module's primary actor is a Flue agent, with its
   activity streamed to the UI via `@flue/react` (the agent stream is at
   `GET /agents/<name>/:id`). A passive capability behind a button does not
   qualify.
2. **Justify the primitive.** Use a Cloudflare capability that simpler
   primitives cannot provide. In particular, use `@cloudflare/sandbox` only when
   a persistent Linux container is genuinely required (long-running processes,
   PTY terminals, package installs, live exposed services). If Dynamic Workers
   or codemode would suffice, use those instead.
3. **Keyless when possible.** Prefer the Workers AI binding (`cloudflare/...`)
   so the one-click deploy works with no external keys. If a key is unavoidable,
   state it clearly and degrade gracefully.
4. **Self-contained and extractable.** A Flue agent plus its UI, liftable into
   its own minimal Flue app.
5. **Agent-ready.** Ships the discovery surface and a `SKILL.md`.
6. **On-brand.** Uses only the in-repo design tokens; no parallel styling.

## Agent-readiness scaffolding

- `/llms.txt`, `/robots.txt`, `/sitemap.xml` (served from `src/app.ts`)
- `Link: </llms.txt>` and `Content-Signal: ai-input=yes` response headers
- Flue's native agent stream at `GET /agents/<name>/:id`
- this `AGENTS.md` at the repo root

Reference: https://isitagentready.com

## Flue docs (offline, version-matched)

Flue is a beta. Prefer its offline docs over memory:

- `npx flue docs` lists pages, `npx flue docs read <path>`, `npx flue docs search <q>`.
- Cloudflare target details: `npx flue docs read guide/targets/cloudflare`.
