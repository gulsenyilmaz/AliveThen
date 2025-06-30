import React, { useState, useEffect} from 'react';

import './DetailBox.css';


function DetailBox({ selectedYear, selectedPerson, selectedLocation, personDetails, locationDetails, onClose }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (selectedPerson || selectedLocation) {
      setIsOpen(true);
    }
    else{
       setIsOpen(false);
    };
  }, [selectedPerson,selectedLocation]);

  const handleToggle = () => {
    const newOpenState = !isOpen;
    setIsOpen(newOpenState);
    if (!newOpenState && onClose) {
      onClose(); 
    }
  };

  return (
    <>
      <div className={`detail-box ${isOpen ? "open" : ""}`}>
        
        <div className="year-box">
                  <label><strong>{selectedYear}</strong></label>
                </div>
        <div className="detail-tab" onClick={handleToggle}>
            {isOpen ? "⟨" : "⟩"}
        </div>
        {isOpen && (
          selectedPerson && (
            <div className="detail-content">
              <h2>{selectedPerson.name}</h2>
                {personDetails && (
                <div className="person-details">
                    {personDetails.img_url && (
                    <img src={personDetails.img_url} alt="portrait" className="portrait" />
                    )}
                     {personDetails.signature_url && (
                    <img
                      src={personDetails.signature_url}
                      alt="signature"
                      className="signature-image"
                    />
                    )}
                    <p>{personDetails.description}</p>
                    <p><strong>Occupations:</strong> {personDetails.occupations.join(", ")}</p>
                    {/* <h4>Locations:</h4> */}
                    <ul>
                    {personDetails.locations.map((loc, idx) => (
                        <li key={idx}>
                        <strong>{loc.relationship_type_name}:</strong> {loc.name}
                        {loc.start_date && ` (${loc.start_date.slice(0, 4)} - ${loc.end_date?.slice(0, 4) || "..."})`}
                        </li>
                    ))}
                    </ul>
                </div>
                )}
                
            </div>)
         )}
         {isOpen && (
          selectedLocation && (
            <div className="detail-content">
              <h2>{selectedLocation.name}</h2>
                {locationDetails && (
                <div className="person-details">
                    {locationDetails.img_url && (
                    <img src={locationDetails.img_url} alt="portrait" className="portrait" />
                    )}
                    <p>{locationDetails.description}</p>
                   
                </div>
                )}
                
            </div>)
         )}
      </div> 
    </>
  );
}

export default DetailBox;