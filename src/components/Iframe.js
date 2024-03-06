import React from 'react';
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from '@dnd-kit/utilities';

const Iframe = ({ id, title, url, onClose, isEditMode }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: id,
    disabled: !isEditMode,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: '100%',
    height: '100%',
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)',
    margin: '0.5rem',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="widget-card">
      {isEditMode && (
        <button className="close-button" onClick={() => onClose(id)} style={{ cursor: 'pointer', position: 'absolute', top: 10, right: 10 }}>X</button>
      )}
      <div className="window-content">
        <div className={`title-bar ${isEditMode ? "title-bar-draggable" : ""}`}>
          <p>{title}</p>
        </div>
        <iframe
          src={url}
          frameBorder="0"
          title={title}
          width="100%"
          height="100%"
        ></iframe>
      </div>
    </div>
  );
};

export default Iframe;
