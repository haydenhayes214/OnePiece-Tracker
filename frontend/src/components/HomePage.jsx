export default function HomePage({ busy, error, onSignIn }) {
  return (
    <div className="home-page">
      <section className="home-page-card">
        <h2>Welcome to Log Pose</h2>
        <p>
          Save your voyage, sync your progress, and pick up your Grand Line journey from any device.
        </p>
        <button type="button" className="auth-btn auth-btn--primary" onClick={onSignIn} disabled={busy}>
          {busy ? "Signing in…" : "Sign in with Google"}
        </button>
        {error && <p className="auth-error">{error}</p>}
      </section>
    </div>
  );
}
