import React, { useState, useEffect} from 'react';

import './BottomPanel.css';

import WorksTimeline from './WorksTimeline';

function BottomPanel({ selectedPerson, works, selectedYear }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (selectedPerson) {
      setIsOpen(true);
    }
  }, [selectedPerson]);

  return (
    <>
      <div className={`bottom-panel ${isOpen ? "open" : ""}`}>
        <div className="bottom-tab" onClick={() => setIsOpen(!isOpen)}>
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