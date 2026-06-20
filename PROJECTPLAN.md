# Project Plan: cf-agentic-launchpad

**Working name:** cf-agentic-launchpad
**Display name:** Agentic Launchpad
**Document status:** Draft v2 (public)
**Date:** June 2026

---

## 1. Overview

### 1.1 What this is
An open-source, public web application that demonstrates the **Cloudflare agentic stack** in action, and doubles as a **launchpad**: a clone-and-go starting point developers and partners use to build their own demos (AI Gateway, Sandbox, Containers, Zero Trust agents, MCP servers, and more).

### 1.2 The core idea
A single, well-designed shell hosting many capability modules — a "demo gallery." Each module is a self-contained, extractable agent built on the **publicly advocated three-layer stack**:

```
Framework   ->  Flue           (every agent is built here)
Harness     ->  Pi             (Flue wraps this)
Runtime     ->  Agents SDK     (becomes a Durable Object on Cloudflare)
```

The application is built on exactly the stack it advocates — it dogfoods its own message.

---

## 2. Goals & Non-Goals

### 2.1 Goals
1. **Demonstrate** the full Cloudflare agentic stack in one coherent, live application.
2. **Educate** developers on the advocated stack (Flue -> Pi -> Agents SDK) by *being* built on it.
3. **Accelerate** builders: cloning the repo and extracting a module should take minutes, not days.
4. **Standardize** the look (shared design tokens) and the agent-readiness pattern across every module.
5. **Be agent-buildable**: an AI coding agent pointed at the repo should understand conventions and extend it.

### 2.2 Non-Goals
- Not a production SaaS product — it is a public showcase/reference, optimized for clarity over completeness.
- Not a private/internal tool — everything ships in the open.
- Not dependent on any private packages or registries.

---

## 3. Audience & Use Cases

| Audience | Use case |
|----------|----------|
| **Developers** | See working, readable reference implementations of each capability and fork them. |
| **Partners** | Show a customer the stack live; then clone a module to build a bespoke POC. |
| **The open community** | A canonical example of building on the Cloudflare agentic stack. |
| **AI coding agents** | Read `AGENTS.md` + `llms.txt`, scaffold a new module against the conventions. |

---

## 4. The Stack (locked decisions)

| Layer | Choice | Notes |
|-------|--------|-------|
| Agent framework | **Flue** (`@flue/runtime`) | Foundation for every agent module. Pinned version. |
| Agent -> UI streaming | **`@flue/react`** | Streams state, tool calls, live messages. |
| Harness | **Pi** (via Flue) | Inherited through Flue. |
| Runtime | **Agents SDK** | Underneath Flue; each agent -> Durable Object. |
| Code execution | **`@cloudflare/codemode`** | Sandboxed dynamic Workers. |
| Filesystem | **`@cloudflare/shell`** | Durable virtual FS in the DO. |
| Heavy compute | **Cloudflare Containers** | For modules needing a full OS. |
| Web shell | **React 19 + TanStack Router + Vite** | Thin chrome only. |
| Visual layer | **Tailwind CSS + self-contained design tokens** | Clean canvas, orange accent, OKLCH, automatic light/dark. Defined in-repo; no external dependency. |
| HTTP/backend | **Hono on Workers** | Router + API surface + MCP mount. |
| State/storage | **Durable Objects + KV** | Per-agent isolation. |
| Deploy | **Workers Builds** (git-push) | No manual `wrangler deploy`. |

---

## 5. Architecture

### 5.1 Shape — gallery shell + modules
```
cf-agentic-launchpad/
|- AGENTS.md                # conventions for AI coding agents (single source of truth)
|- llms.txt                 # machine-readable project spec
|- LICENSE                  # open-source license
|- wrangler.jsonc           # Workers Builds reads this; DO/AI/KV bindings pre-wired
|- src/
|  |- shell/                # React + TanStack Router + Tailwind tokens — gallery & nav
|  |- agents/               # Flue agents (one per module) — the foundation
|  |- worker/               # Hono router + MCP mount + agent-ready endpoints
|- demos/
   |- ai-gateway/           # module #1 — routing, cache, spend limits, fallback
   |- sandbox/              # codemode + shell
   |- containers/           # escalation to a full container
   |- mcp-server/           # expose & consume MCP
   |- zero-trust-agent/     # Access-protected agent
   |- multi-channel/        # flue add channel slack/github/linear
```

### 5.2 Key principles
- **Uniform agent layer:** every module is a Flue agent -> cloning any one teaches the pattern for all.
- **Isolated modules:** each demo is self-contained and extractable into its own repo.
- **Display vs. logic split:** Flue owns agent logic; React + Tailwind is only chrome.
- **Dogfooding:** the showcase is built on exactly the stack it advocates.
- **No private dependencies:** everything resolvable from public registries.

---

## 6. Scope — Demo Modules

| # | Module | Capability shown | Priority |
|---|--------|------------------|----------|
| 1 | **AI Gateway** | Routing, cache, spend limits, fallback, feedback, logs | P0 |
| 2 | **Sandbox** | `codemode` + `shell` — agent writes & runs code on a durable FS | P0 |
| 3 | **MCP Server** | Agent exposes + consumes MCP tools | P0 |
| 4 | **Containers** | Escalate from Worker isolate to full OS | P1 |
| 5 | **Zero Trust Agent** | Access-gated, identity-aware agent | P1 |
| 6 | **Multi-channel** | One Flue agent across Slack/GitHub/Linear | P2 |
| 7 | **Raw vs. Flue** | Side-by-side: same agent, raw Agents SDK vs. ~25-line Flue | P2 (narrative centerpiece) |

---

## 7. Agent-Readiness Standard (every module)

- `/llms.txt` + `/llms-full.txt`
- `/.well-known/mcp`, `/.well-known/agent.json` (A2A), `/.well-known/api-catalog`
- `/openapi.json`, `/robots.txt`, `/sitemap.xml`
- `Link: </llms.txt>` + `Content-Signal: ai-input=yes` headers
- `Accept: text/markdown` negotiation on `/`
- `SKILL.md` per module

Reference: [isitagentready.com](https://isitagentready.com)

---

## 8. Risks & Mitigations

| ID | Risk | Mitigation |
|----|------|-----------|
| R1 | Flue is an early beta; API churn | Pin exact versions; isolate module business logic from harness wiring; Agents SDK escape hatch always available. |
| R2 | Design tokens drift from Cloudflare's public look over time | Tokens are self-contained and versioned in-repo; update deliberately. |
| R3 | Scope creep (too many modules) | P0/P1/P2 gating; ship 3 modules before adding more. |
| R4 | Module extraction harder than promised | Each module self-contained from day 1; extraction tested in Phase 4. |
| R5 | Secrets committed to a public repo | `.env.example` only; secrets via Workers Builds env; pre-commit secret scanning. |

---

## 9. Phased Delivery Plan

### Phase 0 — Foundations (walking skeleton)
**Exit criteria:** stack validated, public repo live, shell scaffolds and deploys.
- Pin Flue + Agents SDK versions.
- Public GitHub repo; OSS license; secret-scanning + `.env.example`.
- Connect Workers Builds.
- Define the public design-token set (Tailwind config).
- Scaffold the React + TanStack + Hono shell; deploy an empty gallery.
- Write `AGENTS.md` + `llms.txt` skeletons.

### Phase 1 — Shell + First Module (proof of pattern)
**Exit criteria:** AI Gateway module live on the stack, fully agent-ready.
- Build the gallery home screen with the design tokens.
- Implement the AI Gateway module as a Flue agent with `@flue/react` streaming into the UI.
- Establish the reusable agent-ready endpoint set.
- Establish the per-module template (`demos/_template/`).

### Phase 2 — Core Module Set
**Exit criteria:** 3-4 modules live, all uniform.
- Sandbox (`codemode` + `shell`).
- MCP Server.
- Containers (P1).

### Phase 3 — Differentiated Modules
**Exit criteria:** the narrative centerpiece works.
- Zero Trust agent.
- Multi-channel agent.
- Raw-vs-Flue side-by-side (the stack story).

### Phase 4 — Launchpad
**Exit criteria:** a builder can extract a module and deploy their own in <30 min.
- "Use this template" flow + extraction docs per module.
- Per-module `SKILL.md` blueprints an AI agent can read and modify.
- "Deploy your own" path (Workers Builds connect guide; optional Temporary Accounts for agent self-deploy).
- End-to-end dry run.

### Phase 5 — Launch
**Exit criteria:** generally available.
- README + walkthrough video.
- Public docs site (served by the showcase itself).
- Open contribution guide for new modules.

---

## 10. Repo & CI/CD Strategy
- **Public remote:** GitHub (`cougz/cf-agentic-launchpad`).
- **Mirror remote:** GitLab (`tim.seiffert/cf-agentic-launchpad`) via dual-push.
- **Workers Builds** auto-deploys on push to `main`; secrets configured in the Builds environment.
- `wrangler.jsonc` carries all bindings (DO, AI, KV) so Builds needs zero manual config.
- Public-repo hygiene: secret scanning, `.env.example`, no committed credentials.

---

## 11. Workstreams
1. **Platform/Shell** — gallery, routing, Worker, bindings.
2. **Agent Foundation** — Flue base, `@flue/react` integration, DO wiring.
3. **Demo Modules** — the capability tiles.
4. **Agent-Readiness** — the discovery-endpoint standard.
5. **Design** — token set, visual consistency.
6. **Launchpad DevEx** — extraction, blueprints, deploy-your-own.
7. **Docs** — `AGENTS.md`, `llms.txt`, README, contribution guide.

---

## 12. Success Metrics
- **Coverage:** >=5 capability modules live, all on the uniform Flue stack.
- **Consistency:** 100% of modules pass the agent-readiness checklist and use the shared tokens.
- **Time-to-clone:** a builder extracts a module and deploys their own in <30 min.
- **Agent-buildable:** an AI agent pointed at the repo scaffolds a valid new module unaided.
- **Adoption:** GitHub stars/forks and # of community-derived modules.

---

## 13. Open Decisions
1. **License** — Apache-2.0 vs. MIT.
2. **Bundled gallery vs. runtime-loaded modules** — recommend bundled to start.
3. **Ownership** — who owns the repo and the contribution process post-launch.

---

## 14. Immediate Next Steps
1. Confirm OSS license.
2. Connect Workers Builds to the GitHub repo.
3. Scaffold the shell and ship an empty deployed gallery (Phase 0 walking skeleton).
4. Build the AI Gateway module as the Phase 1 proof-of-pattern.

---

## Appendix A — Phase 0 & Phase 1 Tickets

### Phase 0
- **CFAL-1 Repo bootstrap & OSS hygiene** — public repo, license, `.gitignore`, `.env.example`, secret scanning, `CONTRIBUTING.md` stub.
- **CFAL-2 Pin the stack** — exact versions for Flue, `@flue/react`, `agents`, `@cloudflare/codemode`, `@cloudflare/shell`, React, TanStack, Vite, Hono, Tailwind; lockfile committed; `.nvmrc`.
- **CFAL-3 Worker + Workers Builds wiring** — `wrangler.jsonc` with DO/AI/KV/assets bindings; Hono placeholder; Builds connected; live URL returns 200.
- **CFAL-4 Design tokens** — `src/shell/tokens.css`; Tailwind consumes tokens; light/dark via `light-dark()`; no external dependency.
- **CFAL-5 Shell scaffold** — React 19 + TanStack Router; empty gallery grid from a registry array; deployed.
- **CFAL-6 Agent-buildable docs** — `AGENTS.md`, `/llms.txt`, module inventory table.

### Phase 1
- **CFAL-7 Flue agent base** — shared base on the Agents SDK target; agent -> DO; `runFiber`/`stash` durable-execution verified across a simulated restart.
- **CFAL-8 `@flue/react` streaming** — state/tool-calls/messages stream into a token-styled component; reconnect/resume works.
- **CFAL-9 Per-module template** — `demos/_template/` with a Flue agent, UI panel, `SKILL.md`, agent-ready endpoints; copy + register yields a working module.
- **CFAL-10 Agent-readiness endpoint set** — full discovery surface; passes isitagentready.com checks.
- **CFAL-11 AI Gateway module** — Flue agent showing routing, cache, spend limits, fallback, feedback, logs; `@flue/react` chat UI; MCP tools at `/mcp`; self-contained.
- **CFAL-12 Module extraction smoke test** — `demos/ai-gateway/` copied to a fresh repo deploys via Workers Builds with only env changes; documented.
