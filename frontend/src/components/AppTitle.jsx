function AnchorIcon() {
  return (
    <svg
      className="app-title-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="5" r="2" />
      <line x1="12" y1="7" x2="12" y2="21" />
      <path d="M5 12c0-3.87 3.13-7 7-7s7 3.13 7 7" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export default function AppTitle() {
  return (
    <header className="app-title">
      <AnchorIcon />
      <div className="app-title-text">
        <h1>One Piece Progress Tracker</h1>
        <p>Track your journey through the Grand Line, one episode at a time</p>
      </div>
    </header>
  );
}
