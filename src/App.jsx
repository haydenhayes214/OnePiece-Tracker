import React, { useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import strawhat from "./strawhat.png"; // Make sure PNG is in src/

// Login Page Component
function LoginPage({ onLogin }) {
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
        background: "linear-gradient(135deg, #1e3c72, #2a5298)",
        fontFamily: "'Luckiest Guy', cursive",
        boxSizing: "border-box",
        margin: 0,
        position: "relative",
      }}
    >
      {/* Floating Straw Hat Images */}
      <img src={strawhat} alt="floating" style={{
        position: "absolute",
        top: "10%",
        left: "10%",
        width: "120px",
        height: "120px",
        opacity: 0.1,
        animation: "float 6s ease-in-out infinite"
      }} />
      <img src={strawhat} alt="floating" style={{
        position: "absolute",
        top: "20%",
        right: "15%",
        width: "80px",
        height: "80px",
        opacity: 0.05,
        animation: "float 4s ease-in-out infinite reverse"
      }} />
      <img src={strawhat} alt="floating" style={{
        position: "absolute",
        bottom: "15%",
        left: "20%",
        width: "100px",
        height: "100px",
        opacity: 0.08,
        animation: "float 5s ease-in-out infinite"
      }} />

      {/* Login card */}
      <div style={{
        background: "rgba(255, 255, 255, 0.95)",
        borderRadius: "24px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
        padding: "3rem",
        textAlign: "center",
        maxWidth: "400px",
        width: "100%",
        position: "relative",
        backdropFilter: "blur(10px)"
      }}>
        {/* Main Straw Hat Icon on Login */}
        <div style={{
          width: "160px",
          height: "160px",
          margin: "0 auto 2rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))"
        }}>
          <img 
            src={strawhat} 
            alt="Straw Hat Icon" 
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        </div>

        <h1 style={{
          fontSize: "2.5rem",
          color: "#333",
          marginBottom: "1rem",
          textShadow: "2px 2px 4px rgba(0,0,0,0.1)"
        }}>
          One Piece Tracker
        </h1>

        <p style={{
          fontSize: "1.1rem",
          color: "#666",
          marginBottom: "2rem",
          fontFamily: "Arial, sans-serif",
          lineHeight: "1.5"
        }}>
          Track your journey through the Grand Line!<br />
          Sign in to save your progress across devices.
        </p>

        <div style={{ transform: "scale(1.1)", marginBottom: "1.5rem" }}>
          <button
            onClick={onLogin}
            style={{
              background: "linear-gradient(135deg, #4285f4, #34a853)",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "500",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              margin: "0 auto",
              transition: "transform 0.2s, box-shadow 0.2s",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
            }}
          >
            Sign in with Google
          </button>
        </div>

        <p style={{
          fontSize: "0.9rem",
          color: "#888",
          fontFamily: "Arial, sans-serif"
        }}>
          Your progress will be securely saved to the cloud
        </p>
      </div>

      {/* Animated CSS */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}

// Progress Tracker Component
function ProgressTracker({ title, totalCount, unitLabel, accentGradient }) {
  const [progress, setProgress] = useState("");
  const [targetDate, setTargetDate] = useState("");

  const progressNum = Number(progress) || 0;
  const percentage = ((progressNum / totalCount) * 100).toFixed(1);

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
      <div style={{
        position: "absolute",
        top: "10px",
        left: "10px",
        width: "80px",
        height: "80px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: 0.2,
        pointerEvents: "none",
        zIndex: 0
      }}>
        <img src={strawhat} alt="icon" style={{ width: "100%", height: "100%" }} />
      </div>

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

// Main App Component
function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("onePieceUser");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("onePieceUser");
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = () => {
    const userData = {
      id: "demo_user_123",
      name: "Monkey D. Luffy",
      email: "future.pirate.king@grandline.com",
      picture: strawhat,
      loginTime: new Date().toISOString(),
    };
    localStorage.setItem("onePieceUser", JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("onePieceUser");
    setUser(null);
  };

  if (isLoading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #1e3c72, #2a5298)",
        color: "white",
        fontSize: "1.5rem"
      }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div style={{
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
    }}>
      {/* Header */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        zIndex: 1000
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            border: "2px solid #ff6600",
            background: "linear-gradient(135deg, #ff6600, #ff9900)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            overflow: "hidden"
          }}>
            <img src={strawhat} alt="icon" style={{ width: "100%", height: "100%" }} />
          </div>
          <span style={{ fontFamily: "Arial, sans-serif", fontWeight: "500", color: "#333" }}>
            Welcome back, {user.name}!
          </span>
        </div>

        <button onClick={handleLogout} style={{
          padding: "0.5rem 1rem",
          borderRadius: "8px",
          border: "none",
          backgroundColor: "#ff3c3c",
          color: "white",
          fontWeight: "bold",
          cursor: "pointer",
          fontFamily: "Arial, sans-serif"
        }}>Logout</button>
      </div>

      <h1 style={{
        textAlign: "center",
        marginBottom: "2rem",
        marginTop: "5rem",
        fontSize: "3rem",
        color: "#333",
        textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
        width: "100%",
      }}>One Piece Tracker</h1>

      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "2rem",
        justifyContent: "center",
        alignItems: "center",
        maxWidth: "1200px",
        width: "100%",
      }}>
        <ProgressTracker
          title="One Piece Anime"
          totalCount={1110}
          unitLabel="Episodes Watched"
          accentGradient="linear-gradient(90deg, #a75b15ff, #be902cff)"
        />
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
