import React, { useMemo, useState, useEffect } from "react";
import { DndContext, useSensor, useSensors, PointerSensor, KeyboardSensor } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import Iframe from "../components/Iframe"; // Adjust the path as necessary
import { GoogleSearch } from "../components";
import Pagination from "../components/Pagination";
import storageComunicator from "../utils/storageComunication";
import axios from "axios";
import "../css/MainPage.css";
import "../css/HideShow.css";
import { endpoints } from "../utils/endpoints";
import BgImageUpload from "../components/BgImageUpload";

const MainPage = () => {
  const [windows, setWindows] = useState(() => {
    const savedWindows = localStorage.getItem("windows");
    return savedWindows ? JSON.parse(savedWindows) : [];
  });
  const [nonEmbeddableUrls, setNonEmbeddableUrls] = useState([]);
  const [newUrl, setNewUrl] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedBackground, setSelectedBackground] = useState();
  const [showBackgroundSelector, setShowBackgroundSelector] = useState(false);
  const [isIconBarVisible, setIsIconBarVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [bgImages, setBgImages] = useState([]);
  const iframesPerPage = 2;
  const totalPages = Math.ceil(windows.length / iframesPerPage);

  const indexOfLastIframe = currentPage * iframesPerPage;
  const indexOfFirstIframe = indexOfLastIframe - iframesPerPage;
  const currentIframes = windows.slice(indexOfFirstIframe, indexOfLastIframe);

  const windowsIds = useMemo(() => windows.map((window) => window.id), [windows]);
  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor));

  useEffect(() => {
    localStorage.setItem("windows", JSON.stringify(windows));
  }, [windows]);

  useEffect(async () => {
    let images_data = await fetchImages(axios);
    console.log('imagesData:', images_data);
    setBgImages(images_data);
    if (images_data.length > 0) {
      setSelectedBackground(images_data[0].image);
    }
  }, []);

  const fetchImages = async (axios) => {
    try {
      const response = await axios.get(endpoints.home_page.get_bg_images, {
        headers: {
          'Authorization':'Bearer ' + String(storageComunicator.authToken.get().access)
        }
      });
      console.log(response.data)
      return response.data;
    } catch (error) {
      console.error('Error getting images:', error);
    }
  };

  const removeImage = async (imageId) => {
    if (bgImages.length === 1) return;

    try {
      const response = await axios.post(endpoints.home_page.remove_bg_image, {
        image_id: imageId
      }, {
        headers: {
          'Authorization':'Bearer ' + String(storageComunicator.authToken.get().access)
        }
      });
      console.log('remove image successful:', response.data);
      setBgImages(response.data);
      if (response.data.length > 0) {
        setSelectedBackground(response.data[0].image);
      } else {
        setSelectedBackground(null);
      }
      return response.data;
    } catch (error) {
      console.error('Error removing image:', error);
    }
  };

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

  const handleAddNewWindow = () => {
    if (!newUrl) return;
    let modifiedUrl = newUrl;
    if (!modifiedUrl.startsWith("http://") && !modifiedUrl.startsWith("https://")) {
      modifiedUrl = "https://" + modifiedUrl;
    }
    const urlExists = windows.some(window => window.url === modifiedUrl);
    if (urlExists) {
      alert("URL already added.");
      return;
    }
    const newWindow = {
      id: `window-${windows.length + 1}`,
      title: `Window ${windows.length + 1}`,
      width: 300,
      height: 200,
      url: modifiedUrl,
    };
    setWindows([...windows, newWindow]);
    setShowInput(false);
    setNewUrl("");
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddNewWindow();
    }
  };

  const handleToggleInput = () => {
    setShowInput(!showInput);
  };

  const handleToggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const removeWindowHandler = (id) => {
    setWindows(windows.filter(window => window.id !== id));
  };

  const removeIconHandler = (url) => {
    setNonEmbeddableUrls(nonEmbeddableUrls.filter(u => u !== url));
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="root" style={{ backgroundImage: `url(${selectedBackground})` }}>
        <div className="header">
          <div className="header-actions">
            <button className="highlighted-button add-btn" onClick={handleToggleInput}>+</button>
            <button className={`highlighted-button ${nonEmbeddableUrls.length === 0 && windows.length === 0 ? "disabled-btn" : ""}`} disabled={nonEmbeddableUrls.length === 0 && windows.length === 0} onClick={handleToggleEditMode}>Edit</button>
            <button className="highlighted-button" onClick={() => setShowBackgroundSelector(!showBackgroundSelector)}>⚙️</button>
            {showInput && (
              <div className="add-new-url-popup">
                <input className="add-new-url-input form-control" type="text" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} onKeyDown={handleKeyPress} placeholder="Introduceți URL-ul site-ului" autoFocus />
              </div>
            )}
          </div>
          <GoogleSearch />
        </div>
        <SortableContext items={windowsIds}>
          <div className="widgets-container">
            <div className="windows-container">
              {currentIframes.map((window) => (
                <Iframe
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
            <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
          </div>
        </SortableContext>
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
              {bgImages.map((bgImage, index) => (
                <div
                  key={index}
                  className={`background-option relative ${
                    selectedBackground === bgImage.image ? "selected" : ""
                  }`}
                  onClick={() => setSelectedBackground(bgImage.image)}
                >
                  <button className="absolute -top-10 p-0.5 px-2 bg-red-500 rounded-full text-white" onClick={() => removeImage(bgImage.id)}>X</button>
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
