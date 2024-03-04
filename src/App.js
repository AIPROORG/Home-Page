import React, { useState } from "react";
import Window from "./Window";
import "./App.css";
import GoogleSearch from "./GoogleSearch";

function App() {
  const [windows, setWindows] = useState([]);
  const [nonEmbeddableUrls, setNonEmbeddableUrls] = useState([]);
  const [newUrl, setNewUrl] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const addNewWindow = async () => {
    if (!newUrl) return;

    const urlExists =
      windows.some((window) => window.url === newUrl) ||
      nonEmbeddableUrls.includes(newUrl);
    if (urlExists) {
      alert("Acest URL a fost deja adăugat.");
      return;
    }

    const newId = windows.length + nonEmbeddableUrls.length + 1;
    try {
      const response = await fetch(
        `http://localhost:3001/proxy?urlTocheck=${encodeURIComponent(newUrl)}`
      );
      if (response.ok) {
        const newWindow = {
          id: newId,
          title: `Fereastra ${newId}`,
          width: 300,
          height: 200,
          url: newUrl,
        };
        setWindows([...windows, newWindow]);
      } else {
        if (!nonEmbeddableUrls.includes(newUrl)) {
          setNonEmbeddableUrls([...nonEmbeddableUrls, newUrl]);
        }
      }
    } catch (error) {
      console.error("Error checking URL embeddability:", error);
      if (!nonEmbeddableUrls.includes(newUrl)) {
        setNonEmbeddableUrls([...nonEmbeddableUrls, newUrl]);
      }
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

  const toggleEditMode = (e) => {
    e.preventDefault();
    setIsEditMode(!isEditMode);
  };

  const onWindowClose = (id) => {
    setWindows(windows.filter((window) => window.id !== id));
  };

  const onIconClose = (url) => {
    setNonEmbeddableUrls(nonEmbeddableUrls.filter((u) => u !== url));
  };

  return (
    <div className="app" onContextMenu={toggleEditMode}>
      <div className="top-part">
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
        <GoogleSearch />
      </div>
      <div className="iframe-grid-container">
        <div className="windows-container">
          {windows.map((window) => (
            <Window
              key={window.id}
              id={window.id}
              title={window.title}
              width={window.width}
              height={window.height}
              url={window.url}
              onClose={onWindowClose}
              isEditMode={isEditMode}
            />
          ))}
        </div>
      </div>
      <div className="bottom-part">
        <div className="non-embeddable-bar">
          {nonEmbeddableUrls.map((url, index) => (
            <div key={index} className="non-embeddable-item">
              <a href={url} target="_blank" rel="noopener noreferrer">
                <img
                  src={`https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url}&size=64`}
                  alt=""
                  style={{ height: "3rem", width: "3rem", marginRight: "5px" }}
                />
              </a>
              {isEditMode && (
                <button onClick={() => onIconClose(url)}>X</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
