import { useEffect, useState } from "react";

type DisplayItemProps = {
  type: "photo" | "text";
  content: string;
  background?: string;
  fade?: boolean; // new prop to trigger fade
};

export default function DisplayItem({ type, content, background, fade }: DisplayItemProps) {
  const [transform, setTransform] = useState({
    scale: 1,
    x: 0,
    y: 0,
    rotate: 0,
  });

  useEffect(() => {
    const scale = 1 + Math.random() * 0.2;
    const x = (Math.random() - 0.5) * 20;
    const y = (Math.random() - 0.5) * 20;
    const rotate = (Math.random() - 0.5) * 4;
    setTransform({ scale, x, y, rotate });
  }, [content]);

  const transitionStyle = {
    transition: "transform 8s ease-in-out, opacity 1s ease-in-out",
    transform: `scale(${transform.scale}) translate(${transform.x}px, ${transform.y}px) rotate(${transform.rotate}deg)`,
    opacity: fade ? 0 : 1,
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {background && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: `url(${background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(10px) brightness(0.5)",
            zIndex: 0,
            ...transitionStyle,
          }}
        />
      )}

      {type === "photo" ? (
        <img
          src={content}
          alt="Display"
          style={{
            width: "50%",
            height: "auto",
            borderRadius: 10,
            zIndex: 1,
            boxShadow: "0 0 20px rgba(0,0,0,0.5)",
            ...transitionStyle,
          }}
        />
      ) : (
        <div
          style={{
            position: "relative",
            width: "80%",
            minHeight: "65%",
            padding: "20px 40px",
            borderRadius: 15,
            backgroundColor: "rgba(173,216,230,0.9)",
            zIndex: 1,
            textAlign: "center",
            fontSize: 32,
            fontWeight: "bold",
            fontFamily: "sans-serif"
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
}
