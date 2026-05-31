import { useMemo, useState } from "react";
import ArcCard from "./components/ArcCard.jsx";
import CatchUpPanel from "./components/CatchUpPanel.jsx";
import OverallProgress from "./components/OverallProgress.jsx";
import { useProgress } from "./hooks/useProgress.js";
import "./App.css";

export default function App() {
  const {
    arcs,
    totalEpisodes,
    progress,
    overall,
    catchup,
    saving,
    updateArc,
    updateCurrentEpisode,
    setTargetDate,
  } = useProgress();

  const [filter, setFilter] = useState("");
  const [showIncompleteOnly, setShowIncompleteOnly] = useState(false);

  const filteredArcs = useMemo(() => {
    if (!progress) return [];
    const q = filter.trim().toLowerCase();
    return arcs.filter((arc) => {
      const watched = progress.arcProgress[arc.id] ?? 0;
      const total = arc.end - arc.start + 1;
      const incomplete = watched < total;

      if (showIncompleteOnly && !incomplete) return false;
      if (!q) return true;
      return arc.name.toLowerCase().includes(q) || String(arc.start).includes(q);
    });
  }, [arcs, filter, progress, showIncompleteOnly]);

  if (!progress) {
    return (
      <div className="app loading">
        <p>Loading your voyage log...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <OverallProgress
        overall={overall}
        currentEpisode={progress.currentEpisode}
        totalEpisodes={totalEpisodes}
        onCurrentEpisodeChange={updateCurrentEpisode}
      />

      <CatchUpPanel
        targetDate={progress.targetDate}
        catchup={catchup}
        remaining={overall?.remaining ?? 0}
        onTargetDateChange={setTargetDate}
      />

      <section className="arcs-section">
        <div className="arcs-toolbar">
          <h2>Arcs</h2>
          {saving && <span className="saving">Saving…</span>}
        </div>

        <div className="toolbar-row">
          <input
            type="search"
            placeholder="Search arcs…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <label className="checkbox">
            <input
              type="checkbox"
              checked={showIncompleteOnly}
              onChange={(e) => setShowIncompleteOnly(e.target.checked)}
            />
            Incomplete only
          </label>
        </div>

        <div className="arc-list">
          {filteredArcs.map((arc) => (
            <ArcCard
              key={arc.id}
              arc={arc}
              arcProgress={progress.arcProgress}
              onChange={(id, watched) => updateArc(id, watched)}
            />
          ))}
          {filteredArcs.length === 0 && (
            <p className="muted empty">No arcs match your filters.</p>
          )}
        </div>
      </section>
    </div>
  );
}
