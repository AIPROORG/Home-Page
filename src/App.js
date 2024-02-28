import React, { useState } from "react";
import Window from "./Window";

function App() {
  const [windows, setWindows] = useState([
    {
      id: 1,
      title: "Exemplu Site",
      x: 50,
      y: 50,
      width: 800,
      height: 600,
      url: "https://area4u.ro/",
    },
  ]);
  const [newUrl, setNewUrl] = useState("");

  const addNewWindow = () => {
    const newWindow = {
      id: windows.length ? windows[windows.length - 1].id + 1 : 1,
      title: `Fereastra ${windows.length + 1}`,
      x: 50 * (windows.length + 1),
      y: 50 * (windows.length + 1),
      width: 800,
      height: 600,
      url: newUrl,
    };
    setWindows((prevWindows) => [...prevWindows, newWindow]);
    setNewUrl("");
  };

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

  const onCloseWindow = (id) => {
    setWindows((prevWindows) =>
      prevWindows.filter((window) => window.id !== id)
    );
  };

  return (
    <div className="app">
      <input
        type="text"
        value={newUrl}
        onChange={(e) => setNewUrl(e.target.value)}
        placeholder="Introduceți URL-ul site-ului"
      />
      <button onClick={addNewWindow}>Adaugă Site</button>
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
          onClose={() => onCloseWindow(window.id)}
        />
      ))}
    </div>
  );
}

export default App;
