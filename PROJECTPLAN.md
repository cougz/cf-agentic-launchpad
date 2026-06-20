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
| Harness | **Pi** (via Flue) | Inherited through Flue. |
| Runtime | **Agents SDK** | Underneath Flue; each agent -> Durable Object. |
| Code execution | **`@cloudflare/codemode`** | Sandboxed dynamic Workers. |
| Filesystem | **`@cloudflare/shell`** | Durable virtual FS in the DO. |
| Heavy compute | **Cloudflare Containers** | For future work needing a full OS. |
| Web shell | **React 19 + TanStack Router + Vite** | Thin chrome only. |
| Visual layer | **Tailwind CSS + self-contained design tokens** | Clean canvas, orange accent, OKLCH, automatic light/dark. Defined in-repo; no external dependency. |
| HTTP/backend | **Hono on Workers** | Router + API surface. |
| State/storage | **Durable Objects + KV** | Pre-wired bindings. |
| Deploy | **Workers Builds** (git-push) | No manual `wrangler deploy`. |

---

## 5. Architecture

### 5.1 Shape - skeleton + a ready (empty) module surface
```
cf-agentic-launchpad/
|- AGENTS.md                # conventions for AI coding agents (single source of truth)
|- llms.txt                 # machine-readable project spec
|- LICENSE                  # open-source license
|- wrangler.jsonc           # Workers Builds reads this; DO/AI/KV bindings pre-wired
|- src/
|  |- shell/                # React + TanStack Router + Tailwind tokens - gallery & nav
|  |- worker/               # Hono router + agent-ready endpoints
|- demos/                   # empty - modules are a future effort
```

### 5.2 Key principles
- **Skeleton first:** ship a clean, deployable foundation before any module work.
- **Ready to extend:** `demos/` exists as the future home for self-contained modules.
- **Display vs. logic split:** when modules arrive, Flue owns agent logic; React + Tailwind is only chrome.
- **Dogfooding:** the foundation uses exactly the stack it advocates.
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
2. **Flue validation (next):** install `@flue/runtime` + `@flue/react`; wire a
   minimal Flue agent on Workers AI that streams to the UI, with no sandbox, to
   prove the beta integration on the smallest possible surface.
3. **App Builder backend:** the Flue agent's build-and-ship tools running in the
   sandbox: write project files, install dependencies, run
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
- **Workers Builds** auto-deploys on push to `main`; secrets configured in the Builds environment.
- `wrangler.jsonc` carries all bindings (DO, AI, KV) so Builds needs zero manual config.
- Public-repo hygiene: secret scanning, `.env.example`, no committed credentials.

---

## 11. Success Metrics (this phase)
- **Deployable:** the skeleton builds and deploys via a single git push.
- **Consistent:** design tokens and conventions are defined and documented.
- **Agent-buildable:** an AI agent pointed at the repo understands the conventions from `AGENTS.md` + `llms.txt`.
- **Clean:** no private dependencies, no committed secrets.

---

## 12. Open Decisions
1. **License** - Apache-2.0 vs. MIT.
2. **Ownership** - who owns the repo and the contribution process.

---

## 13. Immediate Next Steps
1. Confirm OSS license.
2. Connect Workers Builds to the GitHub repo.
3. Scaffold the shell and ship an empty deployed gallery surface (the walking skeleton).

---

## Appendix A - Phase 0 Tickets

- **CFAL-1 Repo bootstrap & OSS hygiene** - public repo, license, `.gitignore`, `.env.example`, secret scanning, `CONTRIBUTING.md` stub.
- **CFAL-2 Pin the stack** - exact versions for Flue, `@flue/react`, `agents`, `@cloudflare/codemode`, `@cloudflare/shell`, React, TanStack, Vite, Hono, Tailwind; lockfile committed; `.nvmrc`.
- **CFAL-3 Worker + Workers Builds wiring** - `wrangler.jsonc` with DO/AI/KV/assets bindings; Hono placeholder; Builds connected; live URL returns 200.
- **CFAL-4 Design tokens** - `src/shell/tokens.css`; Tailwind consumes tokens; light/dark via `light-dark()`; no external dependency.
- **CFAL-5 Shell scaffold** - React 19 + TanStack Router; empty gallery surface; deployed.
- **CFAL-6 Agent-buildable docs & scaffolding** - `AGENTS.md`, `/llms.txt`, `/robots.txt`, `/sitemap.xml`, discovery headers, markdown negotiation on `/`.
