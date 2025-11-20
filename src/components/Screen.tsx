import { useState, useEffect, useRef } from "react";
import Events from "./Events";
import DigitalFrame from "./DigitalFrame";

export default function Screen() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [forceEvents, setForceEvents] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);



  // ---- Time-based switching logic ----
  useEffect(() => {
    function checkTime() {
      const now = new Date();
      const minutes = now.getMinutes();

      const show =
        (minutes >= 0 && minutes < 2) ||
        (minutes >= 15 && minutes < 17) ||
        (minutes >= 30 && minutes < 32) ||
        (minutes >= 45 && minutes < 47);

      setShowCalendar(show);
    }

    checkTime();
    const interval = setInterval(checkTime, 10 * 1000);
    return () => clearInterval(interval);
  }, []);

  // ---- Mouse movement listener ----
  useEffect(() => {
    function handleMouseMove() {
      // Trigger Events view
      setForceEvents(true);

      // Reset 3-minute timer
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setForceEvents(false);
      }, 3 * 60 * 1000); // 3 minutes
    }

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // ---- Which view to show ----
  const shouldShowEvents = forceEvents || showCalendar;

  return (
<div
  style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    background: "#111", // dark background for content
    color: "#fff",
    overflow: "hidden",
  }}
>
  {/* Christmas Banner */}
  <div style={{ width: "100%", position: "relative", height: "180px" }}>
    {/* Gradient background with brightness from left side */}
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "linear-gradient(135deg, #115748, #228B22, #ff4d4d)",
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: -2,
      }}
    />
    
    {/* Wave overlay for festive curves */}
    <svg
      viewBox="0 0 1440 180"
      style={{ display: "block", width: "100%", height: "100%", zIndex: -1 }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="rgba(255,255,255,0.15)"
        d="M0,96L60,112C120,128,240,160,360,149.3C480,139,600,85,720,80C840,75,960,117,1080,144C1200,171,1320,181,1380,186.7L1440,192L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
      ></path>
      {/* Sparkle dots */}
      <circle cx="10%" cy="30" r="2" fill="white" />
      <circle cx="30%" cy="50" r="2.5" fill="white" />
      <circle cx="70%" cy="40" r="1.8" fill="white" />
      <circle cx="90%" cy="60" r="2" fill="white" />
    </svg>

    {/* Header Text */}
    <h1
      style={{
        textAlign: "center",
        margin: "20px 0",
        position: "absolute",
        width: "100%",
        top: "50%",
        transform: "translateY(-50%)",
        color: "#fff",
        zIndex: 1,
        fontSize: "4rem",
        textShadow: "0 0 10px rgba(255,255,255,0.5)", // subtle glow
      }}
    >
      KOMESU EVENTS
    </h1>
  </div>

  {/* Main content */}
  <div style={{ flex: 1, width: "100%", display: "flex", justifyContent: "center" }}>
    {shouldShowEvents ? (
      <Events />
    ) : (
      <DigitalFrame intervalMs={8000} />
    )}
  </div>
</div>


  );
}
