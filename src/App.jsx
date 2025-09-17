import React from "react";
import ProgressTracker from "./ProgressTracker";
import strawHat from "./strawhat.png";

function App() {
  return (
    <div style={{
      minHeight: "100vh",
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      padding: "2rem",
      background: "#f0f8ff",
      fontFamily: "'Luckiest Guy', cursive",
    }}>
      {/* Main Card */}
      <div style={{
        background: "linear-gradient(145deg, #fff7e6, #ffe6b3)",
        borderRadius: "20px",
        padding: "2rem",
        boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
        maxWidth: "900px",
        width: "100%",
        position: "relative",
      }}>
        {/* Watermark */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "180px",
          height: "180px",
          backgroundImage: `url(${strawHat})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          opacity: 0.08,
          pointerEvents: "none",
          zIndex: 0
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>
            One Piece Tracker 🏴‍☠️
          </h1>

          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "2rem",
            justifyContent: "center"
          }}>
            {/* Anime */}
            <div style={{ flex: "1 1 300px" }}>
              <h2 style={{ marginBottom: "1rem", color: "#333" }}>One Piece Anime 🎬</h2>
              <ProgressTracker
                title="Anime"
                totalCount={1110}
                unitLabel="Episodes Watched"
                accentGradient="linear-gradient(90deg, #0070f3, #00cfff)"
              />
            </div>

            {/* Manga */}
            <div style={{ flex: "1 1 300px" }}>
              <h2 style={{ marginBottom: "1rem", color: "#333" }}>One Piece Manga 📖</h2>
              <ProgressTracker
                title="Manga"
                totalCount={1119}
                unitLabel="Chapters Read"
                accentGradient="linear-gradient(90deg, #f9d342, #fbc531)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
