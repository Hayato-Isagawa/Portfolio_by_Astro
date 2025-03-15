import { useEffect, useRef } from "react";
import Canvas from "./Setting01";

const ThreeCanvas04 = () => {
  const containerRef = useRef(null);
  const canvasInstance = useRef(null);

  useEffect(() => {
    if (!containerRef.current) {
      console.error("ThreeCanvas04: containerRef is null.");
      return;
    }

    if (!canvasInstance.current) {
      canvasInstance.current = new Canvas(containerRef.current);
    }

    window.addEventListener("mousemove", (e) => {
      canvasInstance.current.mouseMove(e.clientX, e.clientY);
    });

    return () => {
      if (canvasInstance.current) {
        canvasInstance.current.dispose();
        canvasInstance.current = null; // インスタンスをクリア
      }
    };
  }, []);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100vh" }}></div>
  );
};

export default ThreeCanvas04;
