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

    window.addEventListener('mousemove', e => {
      canvasInstance.current.mouseMoved(e.clientX, e.clientY)
    })

    window.addEventListener('mousedown', e => {
      canvasInstance.current.mousePressed(e.clientX, e.clientY)
    })

    window.addEventListener('mouseup', e => {
      canvasInstance.current.mouseReleased(e.clientX, e.clientY)
    })

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
