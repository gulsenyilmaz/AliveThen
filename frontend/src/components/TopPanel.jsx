import React, { useState, useEffect} from 'react';

import './TopPanel.css';

import WorksTimeline from './WorksTimeline';

function TopPanel({ selectedPerson, works, selectedYear, onClose }) {
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

   
  
    
  const filteredWorks = works.filter(w => w.date == selectedYear);

   if (!selectedPerson) return null;
  selectedPerson.death_date = !selectedPerson.death_date?3000:selectedPerson.death_date;

  const updated_age = selectedYear - selectedPerson.birth_date
  

  return (
    <>
      <div className={`top-panel ${isOpen ? "open" : ""}`}>
        <div className="top-tab" onClick={handleToggle}>
            {isOpen ?  "⟨":"⟩" }
        </div>
        {selectedPerson && (
            <div className="top-content">
              <div className="works-timeline">
                {isOpen && (
                  <WorksTimeline
                    selectedPerson={selectedPerson}
                    works={filteredWorks}
                    selectedYear={selectedYear}
                  />
              )}
              </div>
              

             <div className="works-timeline-header">
                {updated_age > 0 && selectedYear - selectedPerson.death_date < 0 ? (
                  <>
                    <strong className="person-name">{selectedPerson.name} </strong>  was {updated_age} years old and had {filteredWorks.length} works in {selectedYear} 
                  </>
                )  : selectedYear - selectedPerson.death_date >= 0 ? (
                  <>
                    <strong className="person-name">{selectedPerson.name}</strong>  had passed away by {selectedYear}, leaving behind {works.length} works
                  </>
                ) : (
                   <>
                  <strong className="person-name">{selectedPerson.name}</strong> was born in {selectedYear}
                  </>
                )}
              </div>
            </div>
        )}
      </div>
    </>
  );
}

export default TopPanel;