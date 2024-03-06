import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
// import { Resizable } from "react-resizable";

import "../css/Window.css";

const Window = ({ id, title, url, onClose, isEditMode }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id.toString(), disabled: !isEditMode });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    touchAction: "none",
  };

  const removeWindowHandler = (event) => {
    console.log("removeWindowHandler");
    event.preventDefault();
    onClose(id);
  };

  return (
    <div className="widget-card">
      {isEditMode && !isDragging && (
        <button className="close-button" onClick={removeWindowHandler}>
          X
        </button>
      )}
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="window-content"
      >
        <div className={`title-bar ${isEditMode ? "title-bar-draggable" : ""}`}>
          <p>{title}</p>
        </div>
        <div className="content">
          <iframe
            src={url}
            title={title}
            width="100%"
            height="100%"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Window;
