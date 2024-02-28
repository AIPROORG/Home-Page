// WindowContainer.js
import React from "react";
import Window from "./Window";

function WindowContainer({ windows, onWindowMove, onWindowResize }) {
  return (
    <div>
      {windows.map((window) => (
        <Window
          key={window.id}
          id={window.id}
          title={window.title}
          x={window.x}
          y={window.y}
          width={window.width}
          height={window.height}
          onMove={onWindowMove}
          onResize={onWindowResize}
        />
      ))}
    </div>
  );
}

export default WindowContainer;
