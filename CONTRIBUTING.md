# Contributing

Thanks for your interest in cf-agentic-launchpad.

## Before you start

1. Read [`AGENTS.md`](./AGENTS.md). It is the source of truth for conventions,
   the locked stack, and the house rules. It applies to humans and AI agents
   alike.
2. Enable the git hooks once after cloning:

   ```bash
   bash scripts/setup-hooks.sh
   ```

## House rules

- **No em-dashes.** The long dash character (U+2014) is blocked in file content
  and commit messages by the git hooks. Use a regular hyphen or rephrase.
- **No secrets in the repo.** Use `.env.example` / `.dev.vars` for placeholders only.
- **Module scope.** Add demo modules only when `PROJECTPLAN.md` scopes them, and
  only if they pass the module admission criteria in `AGENTS.md`.
- **Styling.** Define design tokens as plain CSS variables in
  `src/shell/tokens.css` (not Tailwind `@theme`, which tree-shakes tokens used
  only via `var()`), and do not use the CSS `light-dark()` function (the build
  minifier rewrites it into a fragile polyfill). See `AGENTS.md`.

## Workflow

Use Node 22 (see `.nvmrc`).

```bash
npm install
bash scripts/setup-hooks.sh   # one-time: enable the em-dash guard
npm run dev                   # Flue dev server (Worker + agents), port 3583
npm run dev:client            # or: the React shell via Vite
npm run typecheck             # type checks
npm run build                 # vite build (client) + flue build (Worker) + patch
```

Commit and push to `main`. Cloudflare Workers Builds builds and deploys
automatically (it deploys Flue's generated config). Do not run `wrangler deploy`
by hand.

## Commit messages

Use clear, imperative subjects (for example: "Add Worker entry"). Messages must
be em-dash free.
