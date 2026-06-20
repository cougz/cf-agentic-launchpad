import { Hono } from "hono";
import { getSandbox } from "@cloudflare/sandbox";

// Bindings the Sandbox module needs. Sandbox is the container-backed Durable
// Object namespace (typed from the SDK helper to avoid pulling in extra
// global type packages).
type Bindings = {
  Sandbox: Parameters<typeof getSandbox>[0];
};

// One shared sandbox for the public showcase. For multi-user apps, derive the
// id from an authenticated user or per-session identifier instead.
const SANDBOX_ID = "showcase";

async function readJson<T>(c: { req: { json: () => Promise<unknown> } }): Promise<Partial<T>> {
  try {
    return (await c.req.json()) as Partial<T>;
  } catch {
    return {};
  }
}

export const sandboxRoutes = new Hono<{ Bindings: Bindings }>();

// Turn thrown errors into informative JSON instead of an opaque 500.
sandboxRoutes.onError((err, c) => {
  return c.json(
    { error: "sandbox_error", message: err instanceof Error ? err.message : String(err) },
    500,
  );
});

// Run a shell command in the sandbox.
sandboxRoutes.post("/exec", async (c) => {
  const { command } = await readJson<{ command: string }>(c);
  const cmd = command?.trim();
  if (!cmd) {
    return c.json({ error: "Missing 'command'." }, 400);
  }
  const sandbox = getSandbox(c.env.Sandbox, SANDBOX_ID);
  const result = await sandbox.exec(cmd);
  return c.json({
    stdout: result.stdout,
    stderr: result.stderr,
    exitCode: result.exitCode,
    success: result.success,
  });
});

// Run code via the code interpreter (rich outputs, state per context).
// Note: the stock @cloudflare/sandbox image ships Node only, so the default is
// JavaScript. JavaScript and TypeScript work out of the box. Python requires
// extending the Dockerfile to install it.
sandboxRoutes.post("/run", async (c) => {
  const { code, language } = await readJson<{
    code: string;
    language: "python" | "javascript" | "typescript";
  }>(c);
  if (!code) {
    return c.json({ error: "Missing 'code'." }, 400);
  }
  const sandbox = getSandbox(c.env.Sandbox, SANDBOX_ID);
  const result = await sandbox.runCode(code, { language: language ?? "javascript" });
  return c.json(result);
});

// List files in a directory.
sandboxRoutes.get("/files", async (c) => {
  const path = c.req.query("path") ?? "/workspace";
  const sandbox = getSandbox(c.env.Sandbox, SANDBOX_ID);
  const files = await sandbox.listFiles(path);
  return c.json(files);
});

// Read a single file.
sandboxRoutes.get("/file", async (c) => {
  const path = c.req.query("path");
  if (!path) {
    return c.json({ error: "Missing 'path' query parameter." }, 400);
  }
  const sandbox = getSandbox(c.env.Sandbox, SANDBOX_ID);
  const file = await sandbox.readFile(path);
  return c.json(file);
});

// Write a single file.
sandboxRoutes.post("/file", async (c) => {
  const { path, content } = await readJson<{ path: string; content: string }>(c);
  if (!path || content === undefined) {
    return c.json({ error: "Missing 'path' or 'content'." }, 400);
  }
  const sandbox = getSandbox(c.env.Sandbox, SANDBOX_ID);
  await sandbox.writeFile(path, content);
  return c.json({ ok: true, path });
});
