
import React from "react";
import "./WorksTimeline.css";

const WorksTimeline = ({ selectedPerson, works, selectedYear }) => {
  if (!selectedPerson) return null;

  return (
    <div className="works-timeline">
      <div className="works-timeline-header">
        <h3>{selectedPerson.name} was {selectedYear - selectedPerson.bYear} years old in {selectedYear}</h3>
      </div>

      {works.length > 0 ? (
        <div className="works-strip">
          {works.map(a => (
            <div key={a.ObjectID} className="work-item">
              {a.ImageURL && (
                <a href={a.URL} target="_blank" rel="noreferrer">
                  <img
                    src={a.ImageURL}
                    alt={a.Title}
                    className="work-item-img"
                  />
                </a>
              )}
              <a href={a.URL} target="_blank" rel="noreferrer" className="work-item-title">
                <strong>{a.Title}</strong>
              </a>
              <div className="work-item-meta">{a.Date} · {a.Medium}</div>
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