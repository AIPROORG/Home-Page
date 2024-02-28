// App.js
import React, { useState } from "react";
import Window from "./Window";

function App() {
  const [windows, setWindows] = useState([
    {
      id: 1,
      title: "YouTube",
      x: 50,
      y: 50,
      width: 800,
      height: 600,
      // url: "https://area4u.ro/",
      url: "https://www.youtube.com/",
    },
  ]);

  const onWindowMove = (id, newX, newY) => {
    setWindows((prevWindows) =>
      prevWindows.map((window) =>
        window.id === id ? { ...window, x: newX, y: newY } : window
      )
    );
  };

  const onWindowResize = (id, newWidth, newHeight) => {
    setWindows((prevWindows) =>
      prevWindows.map((window) =>
        window.id === id
          ? { ...window, width: newWidth, height: newHeight }
          : window
      )
    );
  };

  return (
    <div className="app">
      {windows.map((window) => (
        <Window
          key={window.id}
          id={window.id}
          title={window.title}
          x={window.x}
          y={window.y}
          width={window.width}
          height={window.height}
          url={window.url}
          onMove={onWindowMove}
          onResize={onWindowResize}
        />
      ))}
    </div>
  );
}

export default App;
