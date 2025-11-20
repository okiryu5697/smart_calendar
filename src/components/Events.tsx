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

				const sorted = data
					.filter((e) => {
						const start = new Date(e.start?.dateTime || e.start?.date);
						return start >= new Date();
					})
					.sort((a, b) => {
						const aTime = new Date(
							a.start?.dateTime || a.start?.date
						).getTime();
						const bTime = new Date(
							b.start?.dateTime || b.start?.date
						).getTime();
						return aTime - bTime;
					});

				setEvents(sorted);
			} catch (err) {
				console.error("Error fetching events:", err);
			}
		}

		load();
		const interval = setInterval(load, 30 * 60 * 1000);
		return () => clearInterval(interval);
	}, []);

	// ---- Group by date ----
	const grouped = events.reduce((acc: Record<string, any[]>, e) => {
		const start = e.start?.dateTime || e.start?.date;
		const dateKey = dayjs(start).format("YYYY-MM-DD");
		if (!acc[dateKey]) acc[dateKey] = [];
		acc[dateKey].push(e);
		return acc;
	}, {});

	const dateKeys = Object.keys(grouped);

	return (
<div
  style={{
    fontFamily: "sans-serif",
    padding: 20,
    height: "100vh",
    width: "95%",
    overflowY: "auto",
    color: "#fff",
    position: "relative",
    borderRadius: 16,
    // Base gradient for night sky
    background: "linear-gradient(180deg, #0b1e3d, #2c3e50, #115748)",
  }}
>
  {/* Star of Bethlehem / light rays overlay */}
  <svg
    viewBox="0 0 400 400"
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "none",
      zIndex: 0,
    }}
    xmlns="http://www.w3.org/2000/svg"
  >
    {[...Array(40)].map((_, i) => (
      <circle
        key={i}
        cx={Math.random() * 400}
        cy={Math.random() * 400}
        r={Math.random() * 2 + 0.5}
        fill="white"
        fillOpacity={Math.random() * 0.5 + 0.3}
      />
    ))}
  </svg>

  {dateKeys.length === 0 && (
    <p style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
      No upcoming events
    </p>
  )}

  {dateKeys.map((date) => {
    const readable = dayjs(date).format("YYYY-MM-DD (ddd)");

    return (
      <div key={date} style={{ marginBottom: 30, position: "relative", zIndex: 1 }}>
        {/* Date header */}
        <h2 style={{ marginBottom: 10, color: "#ffd700" }}>{readable}</h2>

        {/* Cards grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "15px",
          }}
        >
          {grouped[date].map((e) => {
            const startTime = e.start?.dateTime
              ? e.start.dateTime.substring(11, 16)
              : "ALL DAY";
            const endTime = e.end?.dateTime ? e.end.dateTime.substring(11, 16) : "";

            return (
              <div
                key={e.id}
                style={{
                  padding: "15px",
                  background: "rgba(0,0,0,0.8)", // semi-transparent to see background
                  borderRadius: 12,
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
                }}
              >
                <div style={{ marginTop: 8, color: "#ffd700" }}>
                  {e.organizer?.displayName || e.organizer?.email}
                </div>
                <strong style={{ fontSize: "1.1rem" }}>{e.summary}</strong>

                <div style={{ marginTop: 6, color: "#eee" }}>
                  {startTime}{endTime ? ` – ${endTime}` : ""}
                </div>

                {e.location && (
                  <div style={{ marginTop: 6, color: "#ccc" }}>{e.location}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  })}
</div>

	);
}
