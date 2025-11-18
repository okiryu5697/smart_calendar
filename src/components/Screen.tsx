import { useState, useEffect } from "react";
import Events from "./Events";
import DigitalFrame from "./DigitalFrame";

export default function Screen() {
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    function checkTime() {
      const now = new Date();
      const minutes = now.getMinutes();

      // Show calendar for 2 minutes at :00 or :30
      const show = (minutes >= 0 && minutes < 2) || (minutes >= 15 && minutes < 17)  || (minutes >= 30 && minutes < 32)  || (minutes >= 45 && minutes < 47);
      setShowCalendar(show);
    }

    checkTime(); // initial check
    const interval = setInterval(checkTime, 10 * 1000); // check every 10 seconds
    return () => clearInterval(interval);
  }, []);

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
        justifyContent: "center",
        alignItems: "center",
        background: "orange",
        color: "#fff",
        overflow: "hidden",     // prevent scrollbars
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: 20 }}>DEKIRU DEKIRU NANNDEMO DEKIRU</h1>
      {/* <Events />  */}
      {showCalendar ? (
        <Events />
      ) : (
        <DigitalFrame intervalMs={8000} />
      )}
    </div>
  );
}
