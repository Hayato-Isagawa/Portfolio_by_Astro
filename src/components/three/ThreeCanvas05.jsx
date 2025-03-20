import { useEffect, useRef } from "react";
import Canvas from "./class/Setting02";

const ThreeCanvas05 = () => {
  const containerRef = useRef(null);
  const canvasInstance = useRef(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    if (!canvasInstance.current) {
      canvasInstance.current = new Canvas(containerRef.current);
    }

    return () => {
      if (canvasInstance.current) {
        canvasInstance.current.dispose();
        canvasInstance.current = null;
      }
    };
  }, []);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100vh" }}></div>
  );
};

export default ThreeCanvas05;
