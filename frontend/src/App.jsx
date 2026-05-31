import { useMemo, useState } from "react";
import { getArcsForSaga, SAGA_TABS } from "@backend/data/sagas.js";
import ArcCard from "./components/ArcCard.jsx";
import DashboardHeader from "./components/DashboardHeader.jsx";
import SagaTabs from "./components/SagaTabs.jsx";
import { useProgress } from "./hooks/useProgress.js";
import "./App.css";

export default function App() {
  const {
    totalEpisodes,
    progress,
    overall,
    catchup,
    saving,
    updateArc,
    updateCurrentEpisode,
    setTargetDate,
  } = useProgress();

  const [activeSaga, setActiveSaga] = useState("all");
  const [expandedArcId, setExpandedArcId] = useState(null);

  const visibleArcs = useMemo(() => getArcsForSaga(activeSaga), [activeSaga]);

  const activeSagaName = SAGA_TABS.find((t) => t.id === activeSaga)?.name ?? "Arcs";

  const handleIncrementEpisode = (delta) => {
    const next = Math.min(totalEpisodes, Math.max(0, (progress?.currentEpisode ?? 0) + delta));
    updateCurrentEpisode(next);
  };

  if (!progress) {
    return (
      <div className="app loading">
        <p>Loading your voyage log...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <DashboardHeader
        overall={overall}
        totalEpisodes={totalEpisodes}
        currentEpisode={progress.currentEpisode}
        targetDate={progress.targetDate}
        catchup={catchup}
        onSaveEpisode={updateCurrentEpisode}
        onIncrementEpisode={handleIncrementEpisode}
        onTargetDateChange={setTargetDate}
      />

      <SagaTabs
        tabs={SAGA_TABS}
        activeId={activeSaga}
        onSelect={(id) => {
          setActiveSaga(id);
          setExpandedArcId(null);
        }}
      />

      <section className="arcs-section">
        <div className="arcs-section-header">
          <h2>{activeSagaName}</h2>
          {saving && <span className="saving">Saving…</span>}
        </div>

        <div className="arc-grid">
          {visibleArcs.map((arc) => (
            <ArcCard
              key={arc.id}
              arc={arc}
              arcProgress={progress.arcProgress}
              expanded={expandedArcId === arc.id}
              onToggle={(id) => setExpandedArcId((prev) => (prev === id ? null : id))}
              onChange={(id, watched) => updateArc(id, watched)}
            />
          ))}
        </div>

        {visibleArcs.length === 0 && <p className="empty">No arcs in this saga.</p>}
      </section>
    </div>
  );
}
