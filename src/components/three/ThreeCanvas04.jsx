import { useEffect, useRef } from "react";
import Canvas from "./class/Setting01";

const ThreeCanvas04 = ({elementId}) => {
  const containerRef = useRef(null);
  const canvasInstance = useRef(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    if (!canvasInstance.current) {
      canvasInstance.current = new Canvas(
        containerRef.current,
        elementId
      );
    }

    window.addEventListener("mousemove", (e) => {
      canvasInstance.current.mouseMoved(e.clientX, e.clientY);
    });

    window.addEventListener("scroll", (e) => {
      canvasInstance.current.scrolled(window.scrollY);
    });

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

export default ThreeCanvas04;
