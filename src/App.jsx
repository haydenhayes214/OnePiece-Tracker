import React from "react";
import ProgressTracker from "./ProgressTracker";

function App() {
  return (
    <div style={{
      minHeight: "100vh",
      width: "100vw", // Force full viewport width
      display: "flex",
      flexDirection: "column",
      justifyContent: "center", // Center vertically
      alignItems: "center", // Center horizontally
      padding: "2rem",
      background: "#f0f8ff",
      fontFamily: "'Luckiest Guy', cursive",
      boxSizing: "border-box",
      margin: 0 // Remove any default margins
    }}>
      {/* Title */}
      <h1 style={{ 
        textAlign: "center", 
        marginBottom: "2rem",
        fontSize: "3rem",
        color: "#333",
        textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
        width: "100%" // Ensure title takes full width
      }}>
        One Piece Tracker 🏴‍☠️
      </h1>

      {/* Main container for the trackers */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "2rem",
        justifyContent: "center",
        alignItems: "center", // Changed from flex-start
        maxWidth: "1200px",
        width: "100%"
      }}>
        {/* Anime Tracker */}
        <ProgressTracker
          title="One Piece Anime"
          totalCount={1110}
          unitLabel="Episodes Watched"
          accentGradient="linear-gradient(90deg, #a75b15ff, #be902cff)"
        />

        {/* Manga Tracker */}
        <ProgressTracker
          title="One Piece Manga"
          totalCount={1119}
          unitLabel="Chapters Read"
          accentGradient="linear-gradient(90deg, #f9d342, #fbc531)"
        />
      </div>
    </div>
  );
}

export default App;