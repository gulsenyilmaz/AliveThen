import React from 'react';
import './TimeSlider.css';

function TimeSlider({ selectedYear, setSelectedYear, minYear = 1700, maxYear = 2025 }) {
  const start = minYear;
  const end = maxYear;
  
  return (
    <div className="time-container">
      <div className="time-slider">
        <div className="year-labels">
          {Array.from({ length: Math.floor((end - start) / 10) + 1 }, (_, index) => {
            const year = start + index * 10;
            return (
              <span key={year} className={`year-label ${(selectedYear - year) >= 0 && (selectedYear - year) < 10 ? 'active' : ''}`}>
                {year}
              </span>
            );
          })}
        </div>

        <input
          type="range"
          min={minYear}
          max={maxYear}
          step="1"
          value={selectedYear}
          onChange={e => setSelectedYear(Number(e.target.value))}
        />

        <hr className="divider" />
        <div className="time-slider-info">
          Explore the geographic presence of artists who were alive in a given year. Scroll through time, uncover patterns, and see the rise and fall of artistic generations.
        </div>
      </div>
    </div>
  );
}

export default TimeSlider;
