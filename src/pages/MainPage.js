import React, { useState, useEffect } from "react";
import { DndContext, useSensor, useSensors, PointerSensor, KeyboardSensor } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import axios from "axios";

import { GoogleSearch } from "../components";
import BgImageUpload from "../components/BgImageUpload";
import HomepageGrid from "../components/HomepageGrid";
import ToDoList from '../components/ToDoList';

import storageComunicator from "../utils/storageComunication";
import { endpoints } from "../utils/endpoints";

import bgHomepage from "../images/bg-homepage.jpg";
import "../css/MainPage.css";
import "../css/HideShow.css";

const MainPage = () => {
  const [windows, setWindows] = useState([]);
  const [nonEmbeddableUrls, setNonEmbeddableUrls] = useState([]);
  const [newUrl, setNewUrl] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState(bgHomepage);
  const [showBackgroundSelector, setShowBackgroundSelector] = useState(false);
  const [isIconBarVisible, setIsIconBarVisible] = useState(false);
  const [bgImages, setBgImages] = useState([]);
  const [showToDoList, setShowToDoList] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setWindows((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleAddNewWindow = () => {
    if (!newUrl) return;
    let modifiedUrl = newUrl.startsWith("http://") || newUrl.startsWith("https://") ? newUrl : `https://${newUrl}`;
    if (windows.some(window => window.url === modifiedUrl)) {
      alert("URL already added.");
      return;
    }
    setWindows([...windows, { id: `window-${windows.length + 1}`, title: `Window ${windows.length + 1}`, url: modifiedUrl }]);
    setShowInput(false);
    setNewUrl("");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleAddNewWindow();
  };

  const handleToggleInput = () => setShowInput(!showInput);
  const handleToggleEditMode = () => setIsEditMode(!isEditMode);
  const removeWindowHandler = id => setWindows(windows.filter(window => window.id !== id));
  const removeIconHandler = url => setNonEmbeddableUrls(nonEmbeddableUrls.filter(u => u !== url));

  const fetchImages = async () => {
    try {
      const response = await axios.get(endpoints.home_page.get_bg_images, {
        headers: { 'Authorization': `Bearer ${storageComunicator.authToken.get().access}` }
      });
      setBgImages(response.data);
    } catch (error) {
      console.error('Error getting images:', error);
    }
  };

  const removeImage = async (imageId) => {
    if (bgImages.length === 1) return;
    try {
      const response = await axios.post(endpoints.home_page.remove_bg_image, { image_id: imageId }, {
        headers: { 'Authorization': `Bearer ${storageComunicator.authToken.get().access}` }
      });
      setBgImages(response.data);
    } catch (error) {
      console.error('Error removing image:', error);
    }
  };

  useEffect(() => {
    const fetchAndSetImages = async () => {
      const imagesData = await fetchImages();
      setBgImages(imagesData);
    };

    fetchAndSetImages();
  }, []);

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="root" style={{ backgroundImage: `url(${selectedBackground})` }}>
        <div className="header">
          <div className="header-actions">
            <button className="highlighted-button add-btn" onClick={handleToggleInput}>+</button>
            <button className={`highlighted-button ${nonEmbeddableUrls.length === 0 && windows.length === 0 ? "disabled-btn" : ""}`} disabled={nonEmbeddableUrls.length === 0 && windows.length === 0} onClick={handleToggleEditMode}>Edit</button>
            <button className="highlighted-button" onClick={() => setShowBackgroundSelector(!showBackgroundSelector)}>⚙️</button>
            <button className="highlighted-button" onClick={() => setShowToDoList(!showToDoList)}>Open ToDo List</button>
            {showInput && (
              <div className="add-new-url-popup">
                <input className="add-new-url-input form-control" type="text" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} onKeyDown={handleKeyPress} placeholder="Introduceți URL-ul site-ului" autoFocus />
              </div>
            )}
          </div>
          <GoogleSearch />
        </div>

        {showToDoList && <ToDoList />}

        <HomepageGrid windows={windows} handleRemoveWindow={removeWindowHandler} isEditMode={isEditMode} />

        <div className="bottom-part">
          <div>
            <input
              type="checkbox"
              id="Toggle"
              onChange={() => setIsIconBarVisible(!isIconBarVisible)}
              style={{ display: "none" }}
            />
            <label htmlFor="Toggle">
              <div className="Menu-container">
                <div className="line" id="active"></div>
              </div>
            </label>
          </div>
          {isIconBarVisible && (
            <div className="non-embeddable-bar">
              <div className="icon-container">
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
          )}
          {showBackgroundSelector && (
            <div className="background-selector-popup">
              {/* {[bgHomepage, bg1, bg2, bg3].map((bgImage, index) => ( */}
              {bgImages.map((bgImage, index) => (
                <div
                  key={index}
                  className={`background-option relative ${
                    selectedBackground === bgImage ? "selected" : ""
                  }`}
                  onClick={() => setSelectedBackground(bgImage.image)}
                >
                  <button className="absolute -top-10 p-0.5 px-2 bg-red-500 rounded-full text-white" onClick={() => {removeImage(bgImage.id)}}>X</button>
                  <img src={bgImage.image} alt={`Background ${index}`} />
                </div>
              ))}
              <button
                className="ok-button"
                onClick={() => setShowBackgroundSelector(false)}
              >
                OK
              </button>

              <BgImageUpload setBgImages={[bgImages,setBgImages]}  />
            </div>
          )}
        </div>
      </div>
    </DndContext>
  );
  
};

export default MainPage;