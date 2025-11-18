import { useEffect, useState } from "react";
import { fetchGoogleCalendarEvents } from "../service/FetchApi";
import dayjs from "dayjs";

import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export default function Events() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchGoogleCalendarEvents();
        setEvents(
          data
            .filter((e) => {
              // Only upcoming events
              const start = new Date(e.start?.dateTime || e.start?.date);
              return start >= new Date();
            })
            .sort((a, b) => {
              const aTime = new Date(a.start?.dateTime || a.start?.date).getTime();
              const bTime = new Date(b.start?.dateTime || b.start?.date).getTime();
              return aTime - bTime;
            })
        );
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    }

    load();

    const interval = setInterval(load, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        fontFamily: "sans-serif",
        padding: 20,
        background: "#111",
        color: "#fff",
        height: "100vh",
        width: "95%",
        overflowY: "auto",
      }}
    >

      {events.length === 0 && <p style={{ textAlign: "center" }}>No upcoming events</p>}

      {events.map((e) => {
        const start = e.start?.dateTime || e.start?.date;
        const end = e.end?.dateTime || e.end?.date;

        return (
          <div
            key={e.id}
            style={{
              margin: "10px 0",
              padding: "15px",
              background: "#222",
              borderRadius: 8,
            }}
          >
            <strong>{e.summary}</strong>
            <div>
              {start?.substring(0, 10)} {start?.substring(11, 16)} – {end?.substring(11, 16)}     
            </div>
            {e.location && <div>{e.location}</div>}
          </div>
        );
      })}

    </div>
  );
}
