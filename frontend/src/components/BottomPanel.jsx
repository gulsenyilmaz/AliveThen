import React, { useState, useEffect} from 'react';

import './BottomPanel.css';

import WorksTimeline from './WorksTimeline';

function BottomPanel({ selectedPerson, works, selectedYear, onClose }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (selectedPerson) {
      setIsOpen(true);
    }
    else{
       setIsOpen(false);
    };
  }, [selectedPerson]);

  const handleToggle = () => {
    const newOpenState = !isOpen;
    setIsOpen(newOpenState);
    if (!newOpenState && onClose) {
      onClose(); // panel kapanıyorsa dışarıya bildir
    }
  };

  return (
    <>
      <div className={`bottom-panel ${isOpen ? "open" : ""}`}>
        <div className="bottom-tab" onClick={handleToggle}>
            {isOpen ? "▼" : "▲"}
        </div>
        {isOpen && (
            <div className="bottom-content">
            {selectedPerson && (
              
                <WorksTimeline
                  selectedPerson={selectedPerson}
                  works={works}
                  selectedYear={selectedYear}
                />
            )}
            </div>
        )}
      </div>
    </>
  );
}

export default BottomPanel;