import React, { useState, useEffect } from "react";
import strawHat from "./strawhat.png"; // Make sure PNG is in src/

function ProgressTracker({ title, totalCount, unitLabel, accentGradient }) {
  const [progress, setProgress] = useState(""); // start empty
  const [targetDate, setTargetDate] = useState("");

  const progressNum = Number(progress) || 0;
  const percentage = ((progressNum / totalCount) * 100).toFixed(1);

  // Calculate daily needed
  let dailyNeeded = null;
  if (targetDate) {
    const today = new Date();
    const end = new Date(targetDate);
    const diffDays = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
    if (diffDays > 0) {
      dailyNeeded = Math.ceil((totalCount - progressNum) / diffDays);
    }
  }

  return (
    <div style={{
      background: "linear-gradient(145deg, #fff7e6, #ffe6b3)",
      borderRadius: "16px",
      boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
      flex: "1 1 320px",
      maxWidth: "500px",
      textAlign: "center",
      padding: "2rem",
      marginBottom: "1.5rem",
      fontFamily: "'Luckiest Guy', cursive",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Straw Hat watermark */}
      <div style={{
        position: "absolute",
        top: "10px",
        left: "10px",
        width: "100px",
        height: "100px",
        backgroundImage: `url(${strawHat})`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        opacity: 0.2,
        pointerEvents: "none",
        zIndex: 0
      }} />

      {/* Card content */}
      <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
        <h2 style={{ marginBottom: "1rem", fontSize: "1.6rem", color: "#333" }}>
          {title} {unitLabel.includes("Episodes") ? "🎬" : "📖"}
        </h2>

        <label style={{ display: "block", marginBottom: "1rem", fontWeight: "500" }}>
          {unitLabel}:{" "}
          <input
            type="number"
            placeholder="0"
            value={progress}
            onChange={(e) => {
              let val = e.target.value;
              if (val === "") setProgress("");
              else {
                val = Number(val);
                if (val < 0) val = 0;
                if (val > totalCount) val = totalCount;
                setProgress(val);
              }
            }}
            min="0"
            max={totalCount}
            style={{
              marginLeft: "0.5rem",
              padding: "0.5rem 0.7rem",
              borderRadius: "8px",
              border: `2px solid transparent`,
              backgroundClip: "padding-box",
              width: "80px",
              textAlign: "center",
              fontWeight: "bold",
            }}
          />

          {/* Decrement Button */}
          <button
            onClick={() => setProgress(Math.max(progressNum - 1, 0))}
            style={{
              marginLeft: "0.5rem",
              padding: "0.5rem 0.7rem",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#ff3c3c",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            -1
          </button>

          {/* Increment Button */}
          <button
            onClick={() => setProgress(Math.min(progressNum + 1, totalCount))}
            style={{
              marginLeft: "0.5rem",
              padding: "0.5rem 0.7rem",
              borderRadius: "8px",
              border: "none",
              backgroundColor: "#ff6600",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            +1
          </button>
        </label>

        <label style={{ display: "block", marginBottom: "1rem", fontWeight: "500" }}>
          Target catch-up date:{" "}
          <input
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            style={{
              marginLeft: "0.5rem",
              padding: "0.5rem 0.7rem",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
        </label>

        {/* Gradient Progress Bar */}
        <div style={{ position: "relative", marginBottom: "0.5rem", height: "25px", borderRadius: "12px", background: "#eee" }}>
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "25px",
            width: `${percentage}%`,
            background: accentGradient,
            borderRadius: "12px",
            transition: "width 0.3s"
          }}></div>
        </div>

        <p style={{ margin: "0.5rem 0", fontWeight: "500" }}>{percentage}% complete</p>

        {dailyNeeded !== null && (
          <p style={{ fontWeight: "bold", color: "#ff6600" }}>
            You need to {unitLabel === "Episodes Watched" ? "watch" : "read"} about {dailyNeeded} {unitLabel.toLowerCase().includes("episode") ? "episodes" : "chapters"} per day ⏱️
          </p>
        )}
      </div>
    </div>
  );
}

export default ProgressTracker;