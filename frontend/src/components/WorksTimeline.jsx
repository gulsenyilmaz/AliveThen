
import React from "react";
import "./WorksTimeline.css";

const WorksTimeline = ({ selectedPerson, works, selectedYear }) => {

  if (!selectedPerson) return null;
  selectedPerson.dYear = !selectedPerson.dYear?3000:selectedPerson.dYear;
  const updated_age = selectedYear - selectedPerson.bYear
  let title_text = "";
  if (updated_age>0 && selectedYear - selectedPerson.dYear<0){
    title_text = `${selectedPerson.name}  was  ${updated_age} years old in ${selectedYear} and had ${works.length} works`;
  
  }
  else if (updated_age<0){
    title_text = `${selectedPerson.name}   was not yet born in ${selectedYear}`;
  }
  else if (selectedYear - selectedPerson.dYear>=0){
    
    title_text = `${selectedPerson.name} had already passed away by ${selectedYear}, leaving behind ${works.length} works`;
  }
  else{
    title_text = `${selectedPerson.name} `;
  }
    


  return (
    <div className="works-timeline">
     <div className="works-timeline-header">
      {updated_age > 0 && selectedYear - selectedPerson.dYear < 0 ? (
        <>
          <strong className="person-name">{selectedPerson.name}</strong>  was {updated_age} years old in {selectedYear} and had {works.length} works
        </>
      ) : updated_age < 0 ? (
        <>
          <strong className="person-name">{selectedPerson.name}</strong>  was not yet born in {selectedYear}
        </>
      ) : selectedYear - selectedPerson.dYear >= 0 ? (
        <>
          <strong className="person-name">{selectedPerson.name}</strong>  had already passed away by {selectedYear}, leaving behind {works.length} works
        </>
      ) : (
        <strong className="person-name">{selectedPerson.name}</strong>
      )}
    </div>

      {works.length > 0 ? (
        <div className="works-strip">
          {works.map(a => (
            <div key={a.id} className="work-item">
              {a.image_url && (
                <a href={a.url} target="_blank" rel="noreferrer">
                  <img
                    src={a.image_url}
                    alt={a.title}
                    className="work-item-img"
                  />
                </a>
              )}
              <a href={a.url} target="_blank" rel="noreferrer" className="work-item-title">
                <strong>{a.title}</strong>
              </a>
              <div className="work-item-meta">{a.date} · {a.description}</div>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-works">No works found.</p>
      )}
    </div>
  );
};

export default WorksTimeline;