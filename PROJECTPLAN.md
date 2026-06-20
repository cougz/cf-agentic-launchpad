# Project Plan: cf-agentic-launchpad

**Working name:** cf-agentic-launchpad
**Display name:** Agentic Launchpad
**Document status:** Draft v3 (public · skeleton scope)
**Date:** June 2026

---

## 1. Overview

### 1.1 What this is
An open-source foundation for building demos on the **Cloudflare agentic stack**. The initial milestone is the **skeleton only** - a thin shell, a Worker backend, design tokens, agent-readiness scaffolding, and a one-push deploy pipeline. Capability modules are explicitly **out of scope** for this phase; they are added later, on top of the foundation.

### 1.2 The core idea
A single, well-designed shell that is *ready* to host capability modules as self-contained, extractable units - but ships first as a clean, deployable foundation. The project is built on the **publicly advocated three-layer stack**:

```
Framework   ->  Flue           (agents are built here)
Harness     ->  Pi             (Flue wraps this)
Runtime     ->  Agents SDK     (becomes a Durable Object on Cloudflare)
```

The application is built on exactly the stack it advocates - it dogfoods its own message.

---

## 2. Goals & Non-Goals

### 2.1 Goals (this phase)
1. **Establish** a clean, deployable foundation on the Cloudflare agentic stack.
2. **Lock** the stack, conventions, and design tokens so future work is consistent.
3. **Be agent-buildable**: an AI coding agent pointed at the repo should understand conventions and extend it.
4. **Prove** the git-push deploy pipeline end to end.

### 2.2 Non-Goals
- **No demo modules** in this phase - the skeleton is the deliverable.
- Not a production SaaS product - it is a public foundation/reference.
- Not a private/internal tool - everything ships in the open.
- Not dependent on any private packages or registries.

---

## 3. Audience & Use Cases

| Audience | Use case |
|----------|----------|
| **Developers** | A clean, readable foundation to build agentic demos on. |
| **The open community** | A canonical starting point for building on the Cloudflare agentic stack. |
| **AI coding agents** | Read `AGENTS.md` + `llms.txt`, then extend the foundation against its conventions. |

---

## 4. The Stack (locked decisions)

| Layer | Choice | Notes |
|-------|--------|-------|
| Agent framework | **Flue** (`@flue/runtime`) | The foundation for any future agent. Pinned version. |
| Agent -> UI streaming | **`@flue/react`** | Streams state, tool calls, live messages. |
| Build | **Flue owns the Worker build** | `flue build --target cloudflare` generates the entry, DO classes, and deploy config. |
| Harness | **Pi** (via Flue) | Inherited through Flue. |
| Runtime | **Agents SDK** (`agents` 0.14.x) | Underneath Flue; each agent -> Durable Object. |
| Models | **Workers AI binding (keyless)** | `cloudflare/...` provider via the `AI` binding. No API key. |
| Container sandbox | **`@cloudflare/sandbox`** | For the App Builder; exported from `src/cloudflare.ts`. |
| Web shell | **React 19 + TanStack Router + Vite** | Built to `dist/client`, served via `ASSETS`. |
| Visual layer | **Tailwind CSS v4 + self-contained design tokens** | Clean canvas, orange accent, OKLCH, automatic light/dark. |
| HTTP/backend | **Hono in `src/app.ts`** | Our routes mounted with `flue()`. |
| Deploy | **Workers Builds** (git-push) | Deploys Flue's generated config. |

---

## 5. Architecture

### 5.1 Shape - Flue-built Worker (src layout)
```
cf-agentic-launchpad/
|- AGENTS.md                # conventions for AI coding agents (source of truth)
|- LICENSE                  # open-source license (MIT)
|- index.html               # Vite client entry
|- vite.config.ts           # client build (React + Tailwind) -> dist/client
|- wrangler.jsonc           # source config Flue reads (bindings, migrations, container, assets)
|- Dockerfile               # container image for the Sandbox module
|- src/                     # Flue source dir
|  |- app.ts                # Hono: agent-ready endpoints + sandbox API + flue()
|  |- cloudflare.ts         # Cloudflare-only exports (export Sandbox)
|  |- agents/app-builder.ts # the App Builder Flue agent
|  |- routes/sandbox.ts     # plain Hono sub-app (sandbox exec/run/files)
|  |- shell/                # React + TanStack Router + Tailwind tokens (client)
|- dist/                    # GENERATED: dist/client + dist/cf_agentic_launchpad (gitignored)
```

### 5.2 Key principles
- **Built on Flue:** Flue owns the Worker build; the launchpad is itself proof of the stack.
- **One unified Worker:** gallery shell + agents + sandbox + custom routes, all in one Flue-built Worker.
- **Display vs. logic split:** Flue owns agent logic; React + Tailwind is only chrome.
- **Keyless:** models via the Workers AI binding; no external API keys.
- **No private dependencies:** everything resolvable from public registries.

---

## 6. Scope

**Done (Phase 0):** the walking skeleton - shell, Worker, design tokens, agent-readiness scaffolding, and the git-push deploy pipeline. Deployed and live.

**In scope (Phase 1):** the first demo module, **Sandbox**, built on `@cloudflare/sandbox`. A Flue agent drives a container-backed Durable Object that executes code and commands in an isolated Linux environment, streamed into the shell. This module also establishes the reusable per-module pattern (`demos/<name>/`) that later modules copy.

**Out of scope (deferred):** all other modules (AI Gateway, MCP server, Containers app, Zero Trust, multi-channel). They are defined in a later revision once the Sandbox pattern is proven.

---

## 7. Agent-Readiness Scaffolding

The skeleton establishes the discovery surface so future modules inherit it:

- `/llms.txt`
- `/robots.txt`, `/sitemap.xml`
- `Link: </llms.txt>` + `Content-Signal: ai-input=yes` headers
- `Accept: text/markdown` negotiation on `/`
- `AGENTS.md` at the repo root

Reference: [isitagentready.com](https://isitagentready.com)

---

## 8. Risks & Mitigations

| ID | Risk | Mitigation |
|----|------|-----------|
| R1 | Flue is an early beta; API churn | Pin exact versions; keep the skeleton free of deep Flue coupling until modules are scoped. |
| R2 | Design tokens drift from Cloudflare's public look over time | Tokens are self-contained and versioned in-repo; update deliberately. |
| R3 | Secrets committed to a public repo | `.env.example` only; secrets via Workers Builds env; secret scanning enabled. |
| R4 | Sandbox needs Cloudflare Containers (paid plan) and Docker at deploy | Documented in the README deploy section; Workers Builds provides Docker; the foundation stays deployable without the module if Containers are unavailable. |
| R5 | Container build adds time and a Docker dependency to deploys | `lite` instance and a lean Dockerfile; image tag pinned to the SDK version. |

---

## 9. Delivery Plan

### Phase 0 - Skeleton (complete)
**Exit criteria:** a clean foundation deploys via git push and is agent-buildable.
- Public GitHub repo; MIT license; secret-scanning + `.env.example`. Done.
- Workers Builds connected; deploys on push. Done.
- Public design-token set (Tailwind v4). Done.
- React + TanStack + Hono shell; empty gallery surface; deployed. Done.
- Agent-readiness scaffolding and `AGENTS.md`. Done.

### Phase 1 - Sandbox module: AI App Builder (in progress)
**Experience:** a Flue agent takes a prompt ("build a landing page for X"), and
inside a sandbox it scaffolds a small Worker app, installs dependencies, and
deploys it to a real but temporary Cloudflare account with
`wrangler deploy --temporary`. The agent curls its own deployment to verify it.
The UI shows the agent's tool-call stream (Flue + `@flue/react`), the build and
deploy logs, a live iframe of the deployed `workers.dev` URL, and a prominent
"Claim this app" button (the claim URL) so the visitor can keep it.

**Why this use case (and not simple code execution):** it needs a persistent
Linux container to run `npm` and the Wrangler CLI and to deploy. Dynamic Workers
/ codemode cannot run Wrangler or install packages, so it genuinely justifies
`@cloudflare/sandbox`. It showcases three SOTA features at once: Flue (the
agent), the Sandbox SDK (the build environment), and Temporary Accounts (the
frictionless real deploy). It is keyless (temporary accounts need no
credentials; Workers AI powers the model) and Flue-agent-driven, so it proves
the project thesis. See "Module admission criteria" in AGENTS.md.

**Exit criteria:** a working App Builder, Flue-agent-driven, that deploys the
generated app to a temporary account, surfaces the live URL and claim URL,
deploys via git push, and is extractable as the per-module template.

Build order (de-risked, riskiest integration validated early):

1. **Sandbox primitives (done):** `@cloudflare/sandbox` wired into the Worker as
   a container-backed Durable Object; exec, run, and file read/write/list under
   `/demos/sandbox/api`; Dockerfile and container config. Deployed and verified
   live (exec and JS/TS interpreter work).
2. **Flue build + minimal agent + deploy (done):** restructured to Flue's
   Cloudflare build (`flue build --target cloudflare`). `src/app.ts` mounts
   `flue()` plus our routes; `src/cloudflare.ts` exports the Sandbox class;
   `src/agents/app-builder.ts` is a minimal keyless agent (Workers AI binding,
   `cloudflare/...` provider). Client builds to `dist/client`, served via
   `ASSETS`. **Deployed live** at `https://cf-agentic-launchpad.timcf.workers.dev`
   (verified: `/llms.txt`, shell, robots, sitemap). Styling fixed (plain CSS
   tokens; see Known issues). A post-build patch
   (`scripts/patch-flue-bundle.mjs`) guards a Flue-beta `createRequire` startup
   crash. The `app-builder` agent is still a stub (no tools/UI yet).
3. **App Builder backend (next):** attach the container sandbox to the agent
   (`cloudflareSandbox(getSandbox(env.Sandbox, id))`) and its build-and-ship
   tools: write project files, install dependencies, run
   `npx wrangler deploy --temporary`, and parse the live URL and claim URL from
   the output. Stream logs back to the UI.
4. **App Builder UI:** prompt box, tool-call timeline, log pane, live iframe of
   the deployed app, and a "Claim this app" button; design tokens; registered as
   the first gallery tile.
5. **Template + agent-readiness:** extract `demos/_template/`, add a per-module
   `SKILL.md`, and confirm the module is extractable into its own repo.

Notes:
- Model via Workers AI; deploy via Temporary Accounts. No external keys.
- Requires Wrangler 4.102.0 or later in the container (use `npx wrangler@latest`
  or pin `>= 4.102`). Do not pass any Cloudflare credentials into the container:
  `--temporary` errors if the CLI is already authenticated.
- Temporary deployments live for 60 minutes; the same temp account is reused for
  redeploys within that window. Cloudflare applies a proof-of-work step and rate
  limits on account creation, so space out repeated demos.
- Output target is a Worker (a static-assets site or a small Hono app). Temporary
  accounts support Workers + Static Assets (up to 1,000 files, 5 MiB each), which
  is plenty for generated demos. The stock `@cloudflare/sandbox` image (Node) is
  enough; Python is not required for this module.

### Future (not yet scoped)
Additional modules and launch/enablement work are defined in a later revision
once the Sandbox pattern is proven.

---

## 10. Repo & CI/CD Strategy
- **Public remote:** GitHub (`cougz/cf-agentic-launchpad`).
- **Mirror remote:** GitLab (`tim.seiffert/cf-agentic-launchpad`) via dual-push.
- **Workers Builds** auto-deploys on push to `main`. Build command `npm run build` (client + `flue build`); deploy command `npx wrangler deploy --config dist/cf_agentic_launchpad/wrangler.json` (Flue's generated config).
- `wrangler.jsonc` carries the bindings (Sandbox DO, AI, assets) and migrations; Flue merges its generated agent DO bindings at build time.
- Public-repo hygiene: secret scanning, `.env.example`, no committed credentials.

---

## 11. Success Metrics (this phase)
- **Deployable:** the skeleton builds and deploys via a single git push.
- **Consistent:** design tokens and conventions are defined and documented.
- **Agent-buildable:** an AI agent pointed at the repo understands the conventions from `AGENTS.md` + `llms.txt`.
- **Clean:** no private dependencies, no committed secrets.

---

## 12. Open Decisions
1. **License** - resolved: MIT (`LICENSE`).
2. **Ownership** - who owns the repo and the contribution process.

---

## 13. Known issues and workarounds

Captured in `AGENTS.md` ("Known workarounds and gotchas"); summary:

- **`createRequire` startup crash (Flue beta):** patched post-build by
  `scripts/patch-flue-bundle.mjs`. `wrangler --dry-run` does not catch startup
  errors; validate with `wrangler dev` or a real deploy.
- **Styling:** define tokens as plain `:root` CSS vars (not Tailwind `@theme`,
  which tree-shakes `var()`-only tokens) and avoid `light-dark()` (minifier
  polyfill). This caused the serif-font regression, now fixed.
- **Container app conflict on deploy:** if "already an application ... different
  durable object namespace", delete the stale container app
  (`wrangler containers delete cf-agentic-launchpad-sandbox`) and redeploy.
- **Large bundle:** Flue bundles many provider SDKs (~1.6 MiB gzip); fine on
  paid, a future trim opportunity.

---

## 14. Handoff: next session

State at handoff: the foundation is deployed and live; the shell renders
correctly (kumo styling, dark/light, orange accent); the `app-builder` agent is
a stub. Repo, GitHub, and GitLab are in sync; Workers Builds deploys on push.

Next is **Phase 1 step 3 + 4 (App Builder)**:

1. **Wire the agent to the sandbox.** In `src/agents/app-builder.ts`, set
   `sandbox: cloudflareSandbox(getSandbox(env.Sandbox, id))` (import
   `cloudflareSandbox` from `@flue/runtime/cloudflare`). Give the agent tools to
   scaffold files, run `npm install`, run `npx wrangler deploy --temporary` in
   the container, and parse the live URL + claim URL from stdout.
   - The container has Node + git; ensure Wrangler >= 4.102 inside it
     (`npx wrangler@latest`). Do NOT inject Cloudflare credentials into the
     container (`--temporary` errors if authenticated).
2. **Build the UI.** Add `@flue/react`; create a Sandbox/App-Builder route in
   `src/shell` with a prompt box, the agent tool-call/log stream
   (`GET /agents/app-builder/:id`), a live iframe of the deployed app, and a
   "Claim this app" button. Register it as the first gallery tile on the Home
   page (replace the "No modules yet" empty state with a tile grid).
3. **Verify** end to end against the live deploy. Use `wrangler dev` for fast
   local startup checks (not just `--dry-run`). A real agent prompt should call
   Workers AI (free allocation) and stream tool calls.
4. **Extract the template** (`demos/_template` or a documented "copy this agent")
   and add a per-module `SKILL.md`.

How to run / validate (Node 22):
`npm install` -> `npm run build` (vite + flue + patch) ->
`npx wrangler deploy --config dist/cf_agentic_launchpad/wrangler.json`, or just
`git push` (Workers Builds). Wrangler is already authenticated in the working
environment as `tim.seiffert@cloudflare.com`.

Reference docs to read first: `npx flue docs read ecosystem/deploy/cloudflare`,
`guide/react`, `guide/tools`; and `https://developers.cloudflare.com/workers/platform/claim-deployments/`.

---

## Appendix A - Phase 0 Tickets

- **CFAL-1 Repo bootstrap & OSS hygiene** - public repo, license, `.gitignore`, `.env.example`, secret scanning, `CONTRIBUTING.md` stub.
- **CFAL-2 Pin the stack** - exact versions for Flue, `@flue/react`, `agents`, `@cloudflare/codemode`, `@cloudflare/shell`, React, TanStack, Vite, Hono, Tailwind; lockfile committed; `.nvmrc`.
- **CFAL-3 Worker + Workers Builds wiring** - `wrangler.jsonc` with DO/AI/KV/assets bindings; Hono placeholder; Builds connected; live URL returns 200.
- **CFAL-4 Design tokens** - `src/shell/tokens.css`; Tailwind consumes tokens; light/dark via `light-dark()`; no external dependency.
- **CFAL-5 Shell scaffold** - React 19 + TanStack Router; empty gallery surface; deployed.
- **CFAL-6 Agent-buildable docs & scaffolding** - `AGENTS.md`, `/llms.txt`, `/robots.txt`, `/sitemap.xml`, discovery headers, markdown negotiation on `/`.
