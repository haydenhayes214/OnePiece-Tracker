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
  const [activeMedium, setActiveMedium] = useState("anime");
  const {
    arcs,
    totalItems,
    progress,
    activeArcProgress,
    activeTargetDate,
    activeCurrentItem,
    overall,
    catchup,
    saving,
    ready,
    episodeMeta,
    episodeSyncing,
    watchReminder,
    refreshEpisodeMeta,
    reloadProgress,
    updateArc,
    updateCurrentItem,
    setTargetDate,
    setWatchReminderEnabled,
  } = useProgress(activeMedium);

  const auth = useAuth({
    onSyncComplete: () => reloadProgress(),
  });

  const [activeSaga, setActiveSaga] = useState("all");
  const [expandedArcId, setExpandedArcId] = useState(null);
  const arcGridRef = useRef(null);

  const visibleArcs = useMemo(() => getArcsForSaga(activeSaga, activeMedium), [activeSaga, activeMedium, arcs]);

  useEffect(() => {
    arcGridRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeSaga]);

  const activeSagaName = SAGA_TABS.find((t) => t.id === activeSaga)?.name ?? "Arcs";

  const handleIncrementItem = (delta) => {
    const next = Math.min(totalItems, Math.max(0, activeCurrentItem + delta));
    updateCurrentItem(next);
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

      {activeMedium === "anime" && (
        <EpisodeSyncBanner
          meta={episodeMeta}
          syncing={episodeSyncing}
          onRefresh={() => refreshEpisodeMeta({ force: true })}
        />
      )}

      <nav className="media-switch" aria-label="Tracker type">
        <button
          type="button"
          className={activeMedium === "anime" ? "active" : ""}
          aria-pressed={activeMedium === "anime"}
          onClick={() => {
            setActiveMedium("anime");
            setExpandedArcId(null);
          }}
        >
          Anime
        </button>
        <button
          type="button"
          className={activeMedium === "manga" ? "active" : ""}
          aria-pressed={activeMedium === "manga"}
          onClick={() => {
            setActiveMedium("manga");
            setExpandedArcId(null);
          }}
        >
          Manga
        </button>
      </nav>

      <DashboardHeader
        overall={overall}
        totalItems={totalItems}
        currentItem={activeCurrentItem}
        targetDate={activeTargetDate}
        catchup={catchup}
        medium={activeMedium}
        watchReminder={watchReminder}
        onSaveItem={updateCurrentItem}
        onIncrementItem={handleIncrementItem}
        onTargetDateChange={setTargetDate}
        onWatchReminderChange={setWatchReminderEnabled}
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
                arcProgress={activeArcProgress}
                medium={activeMedium}
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
