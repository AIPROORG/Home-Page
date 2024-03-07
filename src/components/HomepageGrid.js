import React from 'react';
import { SortableContext } from '@dnd-kit/sortable';

const HomepageGrid = ({ windows, handleRemoveWindow, isEditMode }) => {
  if (!windows || windows.length === 0) {
    return <div>No windows to display.</div>;
  }

  return (
    <SortableContext items={windows.map(window => window.id)}>
      <div className="grid-container">
        {windows.map((window, index) => (
          <div key={window.id} className="grid-item">
            {/* Aici poți adăuga conținutul fiecărei ferestre, exemplu: */}
            <div className="window-header">
              {window.title}
              {isEditMode && (
                <button onClick={() => handleRemoveWindow(window.id)} className="remove-window-btn">
                  Close
                </button>
              )}
            </div>
            {/* Conținutul efectiv al ferestrei, poți utiliza window.content dacă fiecare fereastră stochează conținutul său */}
            <div className="window-content">
              {/* Adaugă conținutul aici, de exemplu, o pagină web sau altceva relevant pentru aplicația ta */}
              <iframe src={window.url} title={window.title} width="100%" height="100%"></iframe>
            </div>
          </div>
        ))}
      </div>
    </SortableContext>
  );
};

export default HomepageGrid;
