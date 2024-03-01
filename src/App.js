import React, { useState } from "react";
import Window from "./Window";
import "./App.css"; // Asigură-te că ai acest fișier CSS pentru stilizarea aplicației

function App() {
  const [windows, setWindows] = useState([
    {
      id: 1,
      title: "Exemplu Site",
      x: 50,
      y: 50,
      width: 800,
      height: 600,
      url: "https://www.smartbill.ro/",
    },
  ]);
  const [newUrl, setNewUrl] = useState("");

  const addNewWindow = () => {
    const newId = windows.length ? windows[windows.length - 1].id + 1 : 1;
    const newWindow = {
      id: newId,
      title: `Fereastra ${newId}`,
      x: 50 * (windows.length + 1),
      y: 50 * (windows.length + 1),
      width: 800,
      height: 600,
      url: newUrl,
    };
    console.log(newWindow);
    setWindows([...windows, newWindow]);
    setNewUrl(""); // Resetează câmpul de intrare după adăugare
  };

  const onWindowMove = (id, newX, newY) => {
    setWindows(
      windows.map((window) =>
        window.id === id ? { ...window, x: newX, y: newY } : window
      )
    );
  };

  const onWindowResize = (id, newWidth, newHeight, newX, newY) => {
    setWindows(
      windows.map((window) =>
        window.id === id
          ? { ...window, width: newWidth, height: newHeight, x: newX, y: newY }
          : window
      )
    );
  };

  const onCloseWindow = (id) => {
    setWindows(windows.filter((window) => window.id !== id));
  };

  return (
    <div className="app">
      <div className="url-input-container">
        <input
          type="text"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          placeholder="Introduceți URL-ul site-ului"
        />
        <button onClick={addNewWindow}>Adaugă Site</button>
      </div>
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
