export default function AuthBar({ user, configured, busy, error, onSignIn, onSignOut }) {
  if (!configured) {
    return (
      <div className="auth-bar auth-bar--info">
        <p>
          Cloud save is optional. Add Firebase keys to <code>frontend/.env</code> and rebuild — see{" "}
          <code>docs/CLOUD_SETUP.md</code>.
        </p>
      </div>
    );
  }

  return (
    <div className="auth-bar">
      {user ? (
        <div className="auth-signed-in">
          {user.photoURL && (
            <img className="auth-avatar" src={user.photoURL} alt="" referrerPolicy="no-referrer" />
          )}
          <div className="auth-user-text">
            <span className="auth-name">{user.displayName ?? user.email}</span>
            <span className="auth-hint">Progress synced to cloud</span>
          </div>
          <button type="button" className="auth-btn auth-btn--outline" onClick={onSignOut} disabled={busy}>
            {busy ? "…" : "Sign out"}
          </button>
        </div>
      ) : (
        <div className="auth-signed-out">
          <p>Sign in to save progress across devices</p>
          <button type="button" className="auth-btn auth-btn--primary" onClick={onSignIn} disabled={busy}>
            {busy ? "Signing in…" : "Sign in with Google"}
          </button>
        </div>
      )}
      {error && <p className="auth-error">{error}</p>}
    </div>
  );
}
