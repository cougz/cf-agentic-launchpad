import type { ReactNode } from "react";

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="shell">
      <header className="shell-header">
        <a href="/" className="shell-brand">
          <span className="dot" />
          <span>cf-agentic-launchpad</span>
          <span className="sub">Agentic Launchpad</span>
        </a>
        <nav className="shell-nav">// skeleton</nav>
      </header>

      <main className="shell-main">{children}</main>

      <footer className="shell-footer">
        Built on{" "}
        <a href="https://flueframework.com" target="_blank" rel="noreferrer">
          Flue
        </a>
        {" "}and the{" "}
        <a
          href="https://developers.cloudflare.com/agents/"
          target="_blank"
          rel="noreferrer"
        >
          Cloudflare Agents SDK
        </a>
        .
      </footer>
    </div>
  );
}
