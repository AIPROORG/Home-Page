import React, { useMemo, useState } from "react";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { Window, GoogleSearch } from "../components";

import "../css/MainPage.css";

const MainPage = () => {
  const [windows, setWindows] = useState([]);
  const [nonEmbeddableUrls, setNonEmbeddableUrls] = useState([]);
  const [newUrl, setNewUrl] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const windowsIds = useMemo(
    () => windows.map((window) => window.id),
    [windows]
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setWindows((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleAddNewWindow = async () => {
    if (!newUrl) return;

    let modifiedUrl = newUrl;

    // Check if the newUrl already has http:// or https://
    if (!modifiedUrl.startsWith("http://") && !modifiedUrl.startsWith("https://")) {
        // If not, prepend "https://"
        modifiedUrl = "https://" + modifiedUrl;
    }

    const urlExists =
        windows.some((window) => window.url === modifiedUrl) ||
        nonEmbeddableUrls.includes(modifiedUrl);
    if (urlExists) {
        alert("Acest URL a fost deja adăugat.");
        return;
    }

    const newId = windows.length + nonEmbeddableUrls.length + 1;
    try {
        const response = await fetch(
            `http://localhost:3001/proxy?urlTocheck=${encodeURIComponent(modifiedUrl)}`
        );
        if (response.ok) {
            const newWindow = {
                id: newId.toString(),
                title: `Fereastra ${newId}`,
                width: 300,
                height: 200,
                url: modifiedUrl,
            };
            setWindows([...windows, newWindow]);
        } else {
            if (!nonEmbeddableUrls.includes(modifiedUrl)) {
                setNonEmbeddableUrls([...nonEmbeddableUrls, modifiedUrl]);
            }
        }
    } catch (error) {
        console.error("Error checking URL embeddability:", error);
        if (!nonEmbeddableUrls.includes(modifiedUrl)) {
            setNonEmbeddableUrls([...nonEmbeddableUrls, modifiedUrl]);
        }
    }
    setShowInput(false);
    setNewUrl("");
};


  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAddNewWindow();
    }
  };

  const handleToggleInput = () => {
    setShowInput(!showInput);
  };

  const handleToggleEditMode = (e) => {
    e.preventDefault();
    setIsEditMode(!isEditMode);
  };

  const removeWindowHandler = (id) => {
    setWindows((prevWindows) =>
      prevWindows.filter((window) => window.id !== id)
    );
  };

  const removeIconHandler = (url) => {
    setNonEmbeddableUrls((prevIcons) => prevIcons.filter((u) => u !== url));
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="root">
        <div className="header">
          <div className="header-actions">
            <button
              className="highlighted-button add-btn"
              onClick={handleToggleInput}
            >
              +
            </button>
            <button
              className={`highlighted-button ${
                nonEmbeddableUrls.length === 0 && windows.length === 0
                  ? "disabled-btn"
                  : ""
              }`}
              disabled={nonEmbeddableUrls.length === 0 && windows.length === 0}
              onClick={handleToggleEditMode}
            >
              Edit
            </button>
            {showInput && (
              <div className="add-new-url-popup">
                <label htmlFor="" className="form-label text-white fw-bold">Adaugă un shortcut sau o fereastră nouă</label>
                <input
                    className="add-new-url-input form-control"
                    type="text"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Introduceți URL-ul site-ului"
                    autoFocus
                />

                <div className="row mt-1">
                  <div className="col-md-1">
                    <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
                      <img
                        src={`https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://www.youtube.com&size=64`}
                        alt=""
                        style={{
                          height: "3rem",
                          width: "3rem",
                          marginRight: "5px",
                        }}
                      />
                    </a>
                  </div>
                  <div className="col-md-1">
                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                      <img
                        src={`https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://www.facebook.com&size=64`}
                        alt=""
                        style={{
                          height: "3rem",
                          width: "3rem",
                          marginRight: "5px",
                        }}
                      />
                    </a>
                  </div>
                  <div className="col-md-1">
                    <a href="https://www.netflix.com" target="_blank" rel="noopener noreferrer">
                      <img
                        src={`https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://www.netflix.com&size=64`}
                        alt=""
                        style={{
                          height: "3rem",
                          width: "3rem",
                          marginRight: "5px",
                        }}
                      />
                    </a>
                  </div>
                  <div className="col-md-1">
                    <a href="https://www.aipro.ro" target="_blank" rel="noopener noreferrer">
                      <img
                        src={`https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://aipro.ro&size=64`}
                        alt=""
                        style={{
                          height: "3rem",
                          width: "3rem",
                          marginRight: "5px",
                        }}
                      />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
          <GoogleSearch />
        </div>
        <SortableContext items={windowsIds}>
          <div className="widgets-container">
            <div className="windows-container">
              {windows.map((window) => (
                <Window
                  key={window.id}
                  id={window.id}
                  title={window.title}
                  width={window.width}
                  height={window.height}
                  url={window.url}
                  onClose={removeWindowHandler}
                  isEditMode={isEditMode}
                />
              ))}
            </div>
          </div>
        </SortableContext>
        <div className="bottom-part">
          <div className="non-embeddable-bar">
            {nonEmbeddableUrls.map((url, index) => (
              <div key={index} className="non-embeddable-item">
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <img
                    src={`https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${url}&size=64`}
                    alt=""
                    style={{
                      height: "3rem",
                      width: "3rem",
                      marginRight: "5px",
                    }}
                  />
                </a>
                {isEditMode && (
                  <button onClick={() => removeIconHandler(url)}>X</button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </DndContext>
  );
};

export default MainPage;
