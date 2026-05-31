import { useEffect, useMemo, useRef, useState } from "react";
import { getArcsForSaga, SAGA_TABS } from "@backend/data/sagas.js";
import AppTitle from "./components/AppTitle.jsx";
import ArcCard from "./components/ArcCard.jsx";
import AuthBar from "./components/AuthBar.jsx";
import DashboardHeader from "./components/DashboardHeader.jsx";
import EpisodeSyncBanner from "./components/EpisodeSyncBanner.jsx";
import HomePage from "./components/HomePage.jsx";
import SagaTabs from "./components/SagaTabs.jsx";
import { useAuth } from "./hooks/useAuth.js";
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
    ready,
    episodeMeta,
    episodeSyncing,
    refreshEpisodeMeta,
    reloadProgress,
    updateArc,
    updateCurrentEpisode,
    setTargetDate,
  } = useProgress();

  const auth = useAuth({
    onSyncComplete: () => reloadProgress(),
  });

  const [activeSaga, setActiveSaga] = useState("all");
  const [expandedArcId, setExpandedArcId] = useState(null);
  const arcGridRef = useRef(null);

  const visibleArcs = useMemo(() => getArcsForSaga(activeSaga), [activeSaga, arcs]);

  useEffect(() => {
    arcGridRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeSaga]);

  const activeSagaName = SAGA_TABS.find((t) => t.id === activeSaga)?.name ?? "Arcs";

  const handleIncrementEpisode = (delta) => {
    const next = Math.min(totalEpisodes, Math.max(0, (progress?.currentEpisode ?? 0) + delta));
    updateCurrentEpisode(next);
  };

  if (!ready || !progress) {
    return (
      <div className="app loading">
        <p>Loading your voyage log...</p>
      </div>
    );
  }

  const showHome = !auth.authLoading && !auth.user && auth.configured;

  if (showHome) {
    return (
      <div className="app">
        <AppTitle />
        <HomePage busy={auth.busy} error={auth.error} onSignIn={auth.signIn} />
      </div>
    );
  }

  return (
    <div className="app">
      <AppTitle />

      <AuthBar
        user={auth.user}
        configured={auth.configured}
        busy={auth.busy}
        error={auth.error}
        onSignIn={auth.signIn}
        onSignOut={auth.signOut}
      />

      <EpisodeSyncBanner
        meta={episodeMeta}
        syncing={episodeSyncing}
        onRefresh={() => refreshEpisodeMeta({ force: true })}
      />

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

      <main className="app-main">
        <SagaTabs
          tabs={SAGA_TABS}
          activeId={activeSaga}
          onSelect={(id) => {
            setActiveSaga(id);
            setExpandedArcId(null);
          }}
        />

        <section className="arcs-section" aria-label={`${activeSagaName} arcs`}>
          <div className="arcs-section-header">
            <h2>{activeSagaName}</h2>
            <span className="arc-count">{visibleArcs.length} arcs</span>
            {saving && <span className="saving">Saving…</span>}
          </div>

          <div className="arc-grid" ref={arcGridRef}>
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
            {visibleArcs.length === 0 && <p className="empty">No arcs in this saga.</p>}
          </div>
        </section>
      </main>
    </div>
  );
}
