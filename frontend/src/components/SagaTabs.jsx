import { getSagaTheme } from "@backend/data/sagaThemes.js";

export default function SagaTabs({ tabs, activeId, onSelect }) {
  return (
    <nav className="saga-tabs" aria-label="Saga filters">
      <div className="saga-tabs-track">
        {tabs.map((tab) => {
          const theme = getSagaTheme(tab.id);
          const isActive = tab.id === activeId;
          const style =
            theme && isActive
              ? {
                  "--tab-accent": theme.primary,
                  "--tab-light": theme.light,
                  "--tab-text": theme.pillText,
                }
              : undefined;

          return (
            <button
              key={tab.id}
              type="button"
              className={`saga-tab ${isActive ? "active" : ""} ${theme ? "saga-tab--themed" : ""}`}
              style={style}
              onClick={() => onSelect(tab.id)}
              aria-pressed={isActive}
            >
              {theme && <span className="saga-tab-dot" aria-hidden />}
              {tab.name}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
