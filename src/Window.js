// Window.js
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
  isEditMode, // Această prop trebuie să fie pasată componentei Window
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeHandle, setResizeHandle] = useState(null);

  const handleMouseMove = useCallback(
    (e) => {
      if (isDragging) {
        onMove(id, e.clientX - dragOffset.x, e.clientY - dragOffset.y);
      } else if (resizeHandle) {
        const dx = e.clientX - dragOffset.x;
        const dy = e.clientY - dragOffset.y;

        let newWidth = width;
        let newHeight = height;
        let newX = x;
        let newY = y;

        if (resizeHandle.includes("right")) {
          newWidth = Math.max(100, width + dx);
        } else if (resizeHandle.includes("left")) {
          newWidth = Math.max(100, width - dx);
          newX = width > 100 ? x + dx : x;
        }

        if (resizeHandle.includes("bottom")) {
          newHeight = Math.max(100, height + dy);
        } else if (resizeHandle.includes("top")) {
          newHeight = Math.max(100, height - dy);
          newY = height > 100 ? y + dy : y;
        }

        onResize(id, newWidth, newHeight, newX, newY);
        setDragOffset({ x: e.clientX, y: e.clientY });
      }
    },
    [
      id,
      isDragging,
      dragOffset,
      onMove,
      resizeHandle,
      width,
      height,
      x,
      y,
      onResize,
    ]
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

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div
      className="window"
      style={{ left: x, top: y, width: width, height: height }}
    >
      <div className="title-bar" onMouseDown={handleMouseDown}>
        {title}
        {isEditMode && (
          <button
            className="close-button"
            onClick={() => onClose(id)}
            style={{ position: "absolute", right: "5px", top: "5px" }}
          >
            X
          </button>
        )}
      </div>
      <div className="content">
        <iframe
          src={url}
          title={title}
          width="100%"
          height="100%"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}

export default Window;
