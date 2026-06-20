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
- **No secrets in the repo.** Use `.env.example` for placeholders only.
- **Skeleton scope.** Do not add demo modules until `PROJECTPLAN.md` expands the
  scope.

## Workflow

```bash
npm install
npm run dev        # local dev server
npm run typecheck  # type checks
npm run build      # production build
```

Commit and push to `main`. Cloudflare Workers Builds builds and deploys
automatically. Do not run `wrangler deploy` by hand.

## Commit messages

Use clear, imperative subjects (for example: "Add Worker entry"). Messages must
be em-dash free.
