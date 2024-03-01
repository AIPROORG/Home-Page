import React, { useState } from "react";
import Window from "./Window";
import "./App.css";

function App() {
  const [windows, setWindows] = useState([]);
  const [nonEmbeddableUrls, setNonEmbeddableUrls] = useState([]);
  const [newUrl, setNewUrl] = useState("");
  const [showInput, setShowInput] = useState(false);

  const addNewWindow = async () => {
    if (!newUrl) return;

    const newId = windows.length + nonEmbeddableUrls.length + 1;
    try {
      const response = await fetch(
        `http://localhost:3001/proxy?urlTocheck=${encodeURIComponent(newUrl)}`
      );
      if (response.ok) {
        const newWindow = {
          id: newId,
          title: `Fereastra ${newId}`,
          x: 0,
          y: 0,
          width: 300,
          height: 200,
          url: newUrl,
        };
        setWindows([...windows, newWindow]);
      } else {
        setNonEmbeddableUrls([...nonEmbeddableUrls, newUrl]);
      }
    } catch (error) {
      console.error("Error checking URL embeddability:", error);
      setNonEmbeddableUrls([...nonEmbeddableUrls, newUrl]);
    }
    setShowInput(false);
    setNewUrl("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addNewWindow();
    }
  };

  const toggleInput = () => {
    setShowInput(!showInput);
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
      <div className="add-url-container">
        <button className="add-url-button" onClick={toggleInput}>
          +
        </button>
        {showInput && (
          <div className="url-input-popup">
            <input
              type="text"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Introduceți URL-ul site-ului"
              autoFocus
            />
          </div>
        )}
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
          <a key={index} href={url} target="_blank">
            <img src={'https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=' +url+ '&size=64'} alt="" style={{ height: '3rem', width: '3rem', marginRight: '5px'}}/>
          </a>
        ))}
      </div>
    </div>
  );
}

export default App;
