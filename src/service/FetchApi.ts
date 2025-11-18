// src/service/FetchApi.ts
import dayjs from "dayjs";

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_GOOGLE_CLIENT_SECRET;
const REFRESH_TOKEN = import.meta.env.VITE_GOOGLE_REFRESH_TOKEN;
const CALENDAR_ID = import.meta.env.VITE_CALENDAR_ID;

// Get new access token from refresh token
async function getAccessToken() {
  const params = new URLSearchParams();
  params.append("client_id", CLIENT_ID);
  params.append("client_secret", CLIENT_SECRET);
  params.append("refresh_token", REFRESH_TOKEN);
  params.append("grant_type", "refresh_token");

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    body: params,
  });
  const data = await res.json();
  return data.access_token;
}


export async function fetchGoogleCalendarEvents(): Promise<any[]> {
  const token = await getAccessToken()
  // 1️⃣ Get the list of subscribed/accessible calendars
  const calendarsRes = await fetch("https://www.googleapis.com/calendar/v3/users/me/calendarList", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!calendarsRes.ok) {
    throw new Error(`Failed to fetch calendar list: ${calendarsRes.statusText}`);
  }

  const calendarsData = await calendarsRes.json();
  const allEvents: any[] = [];

  const now = new Date().toISOString();
  const twoWeeksLater = dayjs().add(2, "week").toISOString();

  // 2️⃣ Loop through each calendar and fetch events
  for (const cal of calendarsData.items) {
    const calendarId = cal.id;

    const eventsUrl = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      calendarId
    )}/events?orderBy=startTime&singleEvents=true&timeMin=${now}&timeMax=${twoWeeksLater}`;

    const eventsRes = await fetch(eventsUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!eventsRes.ok) {
      console.warn(`Failed to fetch events for ${calendarId}: ${eventsRes.statusText}`);
      continue;
    }

    const eventsData = await eventsRes.json();
    if (eventsData.items) {
      allEvents.push(...eventsData.items);
    }
  }

  // 3️⃣ Sort all events by start time
  allEvents.sort((a, b) => {
    const aTime = new Date(a.start?.dateTime || a.start?.date).getTime();
    const bTime = new Date(b.start?.dateTime || b.start?.date).getTime();
    return aTime - bTime;
  });

  return allEvents;
}
