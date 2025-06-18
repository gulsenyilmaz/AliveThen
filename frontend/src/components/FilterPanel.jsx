import React, { useState } from 'react';
import './FilterPanel.css';

function FilterPanel() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Toggle Button */}
      {/* <button className="toggle-button" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Close Filters' : 'Open Filters'}
      </button> */}

      {/* Panel */}
      <div className={`filter-panel ${isOpen ? "open" : ""}`}>
        <div className="filter-tab" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? "⟨" : "⟩"}
        </div>
        {isOpen && (
            <div className="filter-content">
            {/* Buraya filtre içeriği */}
            </div>
        )}
      </div>
    </>
  );
}

export default FilterPanel;