export default function SagaTabs({ tabs, activeId, onSelect }) {
  return (
    <nav className="saga-tabs" aria-label="Saga filters">
      <div className="saga-tabs-track">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`saga-tab ${tab.id === activeId ? "active" : ""}`}
            onClick={() => onSelect(tab.id)}
            aria-pressed={tab.id === activeId}
          >
            {tab.name}
          </button>
        ))}
      </div>
    </nav>
  );
}
