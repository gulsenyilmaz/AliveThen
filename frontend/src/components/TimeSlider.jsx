import React, { useState } from 'react';
import './TimeSlider.css';

const startYear = 1750;

function TimeSlider({selectedYear, setSelectedYear }) {
 

  return (
    <>
    <div className="time-container">
      <div className="time-slider">
           <div className="year-labels">
            {Array.from({ length: Math.floor((2025 - startYear) / 10) + 1 }, (_, index) => {
                const year = startYear + index * 10;
                return (
                <span key={year} className={`year-label ${(selectedYear-year)>=0&& (selectedYear-year)<9 ? 'active' : ''}`}>
                    {year}
                </span>
                );
            })}
          </div>
          <input
            type="range"
            min="1750"
            max="2025"
            step="1"
            value={selectedYear}
            onChange={e => setSelectedYear(Number(e.target.value))}
          />
          <hr className="divider" />
          <div className="time-slider-info">Explore the geographic presence of artists who were alive in a given year. Scroll through time, uncover patterns, and see the rise and fall of artistic generations.
          </div>
        
      </div>
    </div>
      
    </>
  );
}

export default TimeSlider;