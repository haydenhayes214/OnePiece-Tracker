import React from "react";
import ProgressTracker from "./ProgressTracker";
import { GoogleLogin } from "@react-oauth/google";

function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
        background: "#f0f8ff",
        fontFamily: "'Luckiest Guy', cursive",
        boxSizing: "border-box",
        margin: 0,
      }}
    >
      {/* Title */}
      <h1
        style={{
          textAlign: "center",
          marginBottom: "2rem",
          fontSize: "3rem",
          color: "#333",
          textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
          width: "100%",
        }}
      >
        One Piece Tracker 🏴‍☠️
      </h1>

      {/* Google Login Button */}
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          console.log("Login Success:", credentialResponse);
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />

      {/* Main container for the trackers */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "2rem",
          justifyContent: "center",
          alignItems: "center",
          maxWidth: "1200px",
          width: "100%",
        }}
      >
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
