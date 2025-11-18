import { useEffect, useState } from "react";
import DisplayItem from "./DisplayItem";

type Item = { type: "photo" | "text"; content: string };

export default function DigitalFrame({ intervalMs = 8000 }: { intervalMs?: number }) {
  const [items, setItems] = useState<Item[]>([]);
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    async function loadItems() {
      try {
        // Load text items
        const resText = await fetch("/text.txt");
        const versesText = await resText.text();
        const verses = versesText
          .split("\n")
          .filter((line) => line.trim())
          .map<Item>((v) => ({ type: "text", content: v }));

        // Load photo items from JSON
        const resPhotos = await fetch("/photos.json");
        const photos: string[] = await resPhotos.json();
        const photoItems = photos.map<Item>((p) => ({ type: "photo", content: p }));

        let allItems = [...photoItems, ...verses];

        // Shuffle the array
        for (let i = allItems.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [allItems[i], allItems[j]] = [allItems[j], allItems[i]];
        }

        setItems(allItems)
      } catch (err) {
        console.error("Failed to load items:", err);
      }
    }

    loadItems();
  }, []);

useEffect(() => {
  if (!items.length) return;

  let fadeTimeout: number;

  const interval = setInterval(() => {
    setFade(true);

    fadeTimeout = setTimeout(() => {
      setIndex((prev) => (prev + 1) % items.length);
      setFade(false);
    }, 500); // fade duration
  }, intervalMs);

  return () => {
    clearInterval(interval);
    clearTimeout(fadeTimeout);
  };
}, [items, intervalMs]);

    if (!items.length) return null;


  // Find last photo for background blur
  const lastPhoto = items
    .slice(0, index + 1)
    .reverse()
    .find((item) => item.type === "photo")?.content;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <DisplayItem {...items[index]} background={lastPhoto} fade={fade}/>
    </div>
  );
}
