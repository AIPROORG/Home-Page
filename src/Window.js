import React, { useState, useEffect, useCallback } from "react";
import "./Window.css";

function Window({ id, title, x, y, width, height, onMove, onResize, url }) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizeHandle, setResizeHandle] = useState(null);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState({ width: 0, height: 0 });

  const [isValid, setIsValid] = useState(null);

  const handleMouseMove = useCallback(
    (e) => {
      if (isDragging) {
        onMove(id, e.clientX - dragOffset.x, e.clientY - dragOffset.y);
      } else if (resizeHandle) {
        const dx = e.clientX - startPosition.x;
        const dy = e.clientY - startPosition.y;
        let newWidth = startSize.width;
        let newHeight = startSize.height;

        if (resizeHandle.includes("right"))
          newWidth = Math.max(100, startSize.width + dx);
        if (resizeHandle.includes("bottom"))
          newHeight = Math.max(100, startSize.height + dy);
        if (resizeHandle.includes("left")) {
          newWidth = Math.max(100, startSize.width - dx);
          if (newWidth > 100) onMove(id, startPosition.x + dx, y);
        }
        if (resizeHandle.includes("top")) {
          newHeight = Math.max(100, startSize.height - dy);
          if (newHeight > 100) onMove(id, x, startPosition.y + dy);
        }

        onResize(id, newWidth, newHeight);
      }
    },
    [
      dragOffset,
      id,
      isDragging,
      onMove,
      onResize,
      resizeHandle,
      startPosition,
      startSize,
      x,
      y,
    ]
  );

  const handleMouseUp = () => {
    setIsDragging(false);
    setResizeHandle(null);
  };

  const handleMouseDown = (e, isResize = false) => {
    e.preventDefault();
    if (!isResize) {
      setIsDragging(true);
      setDragOffset({ x: e.clientX - x, y: e.clientY - y });
    }
  };

  const handleResizeMouseDown = (e, handle) => {
    e.preventDefault();
    setResizeHandle(handle);
    setStartPosition({ x: e.clientX, y: e.clientY });
    setStartSize({ width, height });
    handleMouseDown(e, true);
  };

  const checkURL = useCallback(async (url) => {
    try {
      const isValid = await fetch(
        `http://localhost:3001/proxy?urlTocheck=${url}`
      );

      setIsValid(isValid.status === 200);
    } catch (e) {
      setIsValid(false);
    }
  }, []);

  useEffect(() => {
    if (url != null && url !== "") {
      checkURL(url).then();
    }
  }, [url, checkURL]);

  useEffect(() => {
    if (isDragging || resizeHandle) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    isDragging,
    resizeHandle,
    dragOffset,
    startPosition,
    startSize,
    x,
    y,
    width,
    height,
    onMove,
    onResize,
    id,
    handleMouseMove,
  ]);

  return (
    <div
      className="window"
      style={{ left: x, top: y, width: width, height: height }}
    >
      <div className="title-bar" onMouseDown={handleMouseDown}>
        {title}
      </div>
      <div className="content">
        {isValid === null ? (
          <p>Check URL...</p>
        ) : isValid ? (
          <iframe
            src={url}
            title={title}
            width="100%"
            height="100%"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        ) : (
          <p>Invalid URL...</p>
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
        ></div>
      ))}
    </div>
  );
}

export default Window;
