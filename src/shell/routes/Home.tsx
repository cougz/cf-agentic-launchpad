export function Home() {
  return (
    <section>
      <p className="hero-eyebrow">// Cloudflare agentic stack</p>
      <h1 className="hero-title">A launchpad for building agentic demos.</h1>
      <p className="hero-lead">
        This is the foundation: a thin shell on the Cloudflare agentic stack
        (Flue over Pi over the Agents SDK), with design tokens, agent-readiness
        scaffolding, and a git-push deploy pipeline. Demo modules arrive on top
        of this foundation in a later phase.
      </p>

      <div className="gallery-empty">
        <strong>No modules yet.</strong>
        <div style={{ marginTop: 8 }}>
          The gallery is intentionally empty while the skeleton is in place.
        </div>
      </div>
    </section>
  );
}
