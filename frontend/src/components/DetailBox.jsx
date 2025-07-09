import React, { useState, useEffect} from 'react';

import './DetailBox.css';


function DetailBox({ detailMode, setDetailMode, selectedYear, selectedPerson, selectedLocation, personDetails, locationDetails, onClose }) {
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
    const newOpenState = !detailMode;
    setIsOpen(newOpenState);
    if (!newOpenState && onClose) {
      onClose(); 
    }
  };

  return (
    <>
      <div className={`detail-box ${detailMode ? "open" : ""}`}>
        
        <div className="year-box">
          <label><strong>{selectedYear}</strong></label>
        </div>
        <div className="detail-tab" onClick={handleToggle}>
            {detailMode ? "⟨" : "⟩"}
        </div>
        {detailMode && (
          selectedPerson && (
            <div className="detail-content">
              {/* <h2>{selectedPerson.name}</h2> */}
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
                    <p><h3><i>{personDetails.description}</i></h3></p>
                    
                    <p><strong>Occupations:</strong> {personDetails.occupations.join(", ")}</p>
                    {personDetails.movements && personDetails.movements.length > 0 && (
                    <p><strong>Movements:</strong> {personDetails.movements.join(", ")}</p>)}
                    <h3><i>Curriculum Vitae</i></h3>
                    {/* <h4>Locations:</h4> */}
                    {/* <ul>
                    {personDetails.locations.map((loc, idx) => (
                        <li key={idx}>
                        
                        {loc.start_date && ` (${loc.start_date.slice(0, 4)} - ${loc.end_date?.slice(0, 4) || "..."})`}
                        <strong>{loc.relationship_type_name}:</strong> {loc.name}
                        </li>
                    ))}
                    </ul> */}
                    
                        <ul>
                          {personDetails.locations.birth_place && personDetails.locations.birth_place.map((loc, idx) => (
                            <li key={idx}>
                              {loc.start_date && ` ${loc.start_date.slice(0, 4)} - `}
                              {loc.name} -- <bp>was born here</bp> 
                            </li>
                          ))}
                        </ul>
                        <ul>
                          {personDetails.locations.educated_at && personDetails.locations.educated_at.map((loc, idx) => (
                            <li key={idx}>
                              {loc.start_date && ` ${loc.start_date.slice(0, 4)} - ${loc.end_date?.slice(0, 4) || "..."}  `}
                              {loc.name} -- <ea>was educated here</ea> 
                            </li>
                          ))}
                        </ul>
                         <ul>
                          {personDetails.locations.residence && personDetails.locations.residence.map((loc, idx) => (
                            <li key={idx}>
                              {loc.start_date && ` ${loc.start_date.slice(0, 4)} - ${loc.end_date?.slice(0, 4) || "..."}  `}
                              {loc.name} -- <re>lived here</re> 
                            </li>
                          ))}
                        </ul>
                        <ul>
                          {personDetails.locations.work_location && personDetails.locations.work_location.map((loc, idx) => (
                            <li key={idx}>
                              {loc.start_date && ` ${loc.start_date.slice(0, 4)} - ${loc.end_date?.slice(0, 4) || "..."}  `}
                              {loc.name} -- <wl>worked here</wl>
                            </li>
                          ))}
                        </ul>
                         <ul>
                          {personDetails.locations.death_place&&personDetails.locations.death_place.map((loc, idx) => (
                            <li key={idx}>
                              {loc.start_date && ` ${loc.start_date.slice(0, 4)} - `}
                              {loc.name} -- <dp>passed away here</dp> 
                            </li>
                          ))}
                        </ul>
                     
                  
                   
                </div>
                )}
                
            </div>)
         )}
         {detailMode && (
          selectedLocation && (
            <div className="detail-content">
              <h2>{selectedLocation.name}</h2>
                {locationDetails && (
                <div className="person-details">
                  {locationDetails.logo_url && (
                    <img src={locationDetails.logo_url} alt="portrait" className="portrait" />
                    )}
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