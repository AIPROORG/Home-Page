import React, { useState } from "react";
import Window from "./Window";
import "./App.css";

function App() {
  const [windows, setWindows] = useState([]);
  const [nonEmbeddableUrls, setNonEmbeddableUrls] = useState([]);
  const [newUrl, setNewUrl] = useState("");

  const addNewWindow = async () => {
    const newId = windows.length + nonEmbeddableUrls.length + 1;

    try {
      const response = await fetch(
        `http://localhost:3001/proxy?urlTocheck=${encodeURIComponent(newUrl)}`
      );
      if (response.ok) {
        const newWindow = {
          id: newId,
          title: `Fereastra ${newId}`,
          x: 0, // x și y vor fi ajustate dinamic în CSS
          y: 0,
          width: 300, // Dimensiunea inițială a ferestrei
          height: 200,
          url: newUrl,
        };
        setWindows([...windows, newWindow]);
      } else {
        setNonEmbeddableUrls([...nonEmbeddableUrls, newUrl]);
      }
    } catch (error) {
      console.error("Error checking URL embeddability:", error);
      // Tratează erorile de rețea sau de server tratând URL-ul ca non-embeddable
      setNonEmbeddableUrls([...nonEmbeddableUrls, newUrl]);
    }

    setNewUrl("");
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
      <div className="iframe-grid-container">
        <div className="windows-container">
          {windows.map((window) => (
            <div className="window-wrapper" key={window.id}>
              <Window
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
            </div>
          ))}
        </div>
      </div>
      <div className="non-embeddable-bar">
        {nonEmbeddableUrls.map((url, index) => (
          <button key={index} onClick={() => window.open(url, "_blank")}>
            {url}
          </button>
        ))}
      </div>
    </div>
  );
}

export default App;
