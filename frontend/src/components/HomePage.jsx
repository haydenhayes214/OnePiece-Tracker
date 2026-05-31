export default function HomePage({ busy, error, onSignIn }) {
  return (
    <div className="home-page">
      <section className="home-page-card">
        <h2>Welcome to One Piece Tracker</h2>
        <p>
          Sign in with Google to save your episode progress and continue from any device.
          After signing in, you'll be taken straight to your main tracker page.
        </p>
        <button type="button" className="auth-btn auth-btn--primary" onClick={onSignIn} disabled={busy}>
          {busy ? "Signing in…" : "Sign in with Google"}
        </button>
        {error && <p className="auth-error">{error}</p>}
      </section>
    </div>
  );
}
