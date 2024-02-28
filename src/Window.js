import React, { useState, useEffect, useCallback } from "react";
import "./Window.css";

function Window({
  id,
  title,
  x,
  y,
  width,
  height,
  onMove,
  onResize,
  url,
  onClose,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeHandle, setResizeHandle] = useState(null);
  const [isValid, setIsValid] = useState(null); // Starea pentru validarea URL-ului

  const handleMouseMove = useCallback(
    (e) => {
      if (isDragging) {
        onMove(id, e.clientX - dragOffset.x, e.clientY - dragOffset.y);
      } else if (resizeHandle) {
        const dx = e.clientX - dragOffset.x;
        const dy = e.clientY - dragOffset.y;
        let newWidth = width + dx;
        let newHeight = height + dy;

        if (resizeHandle.includes("right") || resizeHandle.includes("left")) {
          onResize(id, Math.max(100, newWidth), height);
        }
        if (resizeHandle.includes("bottom") || resizeHandle.includes("top")) {
          onResize(id, width, Math.max(100, newHeight));
        }
      }
    },
    [id, isDragging, dragOffset, onMove, resizeHandle, width, height, onResize]
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging || resizeHandle) {
      setIsDragging(false);
      setResizeHandle(null);
    }
  }, [isDragging, resizeHandle]);

  const handleMouseDown = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(true);
      setDragOffset({ x: e.clientX - x, y: e.clientY - y });
    },
    [x, y]
  );

  const handleResizeMouseDown = useCallback(
    (e, handle) => {
      e.preventDefault();
      setResizeHandle(handle);
      setIsDragging(true); // Considerăm începerea redimensionării ca un drag
      setDragOffset({ x: e.clientX - width, y: e.clientY - height });
    },
    [width, height]
  );

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  // Funcția pentru verificarea URL-ului
  const checkURL = useCallback(async (url) => {
    try {
      const response = await fetch(
        `http://localhost:3001/proxy?urlTocheck=${encodeURIComponent(url)}`
      );
      if (response.ok) {
        setIsValid(true);
      } else {
        setIsValid("restricted");
      }
    } catch (error) {
      console.error("Error fetching URL status:", error);
      setIsValid(false);
    }
  }, []);

  useEffect(() => {
    if (url) {
      checkURL(url);
    }
  }, [url, checkURL]);

  return (
    <div
      className="window"
      style={{ left: x, top: y, width: width, height: height }}
    >
      <div className="title-bar" onMouseDown={handleMouseDown}>
        {title}
        <button className="close-button" onClick={onClose}>
          X
        </button>
      </div>
      <div className="content">
        {isValid === null ? (
          <p>Verific URL...</p>
        ) : isValid === true ? (
          <iframe
            src={url}
            title={title}
            width="100%"
            height="100%"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        ) : (
          <p>
            URL-ul nu poate fi încărcat sau este restricționat pentru afișare în
            iframe.
          </p>
        )}
      </div>
      {[
        "top",
        "bottom",
        "left",
        "right",
        "top-left",
        "top-right",
        "bottom-left",
        "bottom-right",
      ].map((handle) => (
        <div
          key={handle}
          className={`window-resize window-resize-${handle}`}
          onMouseDown={(e) => handleResizeMouseDown(e, handle)}
        />
      ))}
    </div>
  );
}

export default Window;
