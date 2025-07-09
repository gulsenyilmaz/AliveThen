import React from 'react';
import './TimeSlider.css';

function TimeSlider({ selectedYear, setSelectedYear, distinctDates, minYear = 1700, maxYear = 2025 }) {
  const totalRange = maxYear - minYear;

  const getLeftPercent = (year) => ((year - minYear) / totalRange) * 100;

  return (
    <div className="time-container">
      <div className="time-slider">
        <div className="year-labels">
          {Array.from({ length: Math.floor((maxYear - minYear) / 10) + 1 }, (_, index) => {
            const year = minYear + index * 10;
            return (
              <span key={year} className={`year-label ${(selectedYear - year) >= 0 && (selectedYear - year) < 10 ? 'active' : ''}`}>
                {year}
              </span>
            );
          })}
        </div>

        <div className="slider-wrapper">
          <input
            type="range"
            min={minYear}
            max={maxYear}
            step="1"
            value={selectedYear}
            onChange={e => setSelectedYear(Number(e.target.value))}
          />

          {/* Distinct milestone markers */}
          {/* Distinct milestone markers below the slider */}
          <div className="milestone-markers bottom">
            {distinctDates?.map((year, idx) => {
              const left = getLeftPercent(parseInt(year));
              return (
                <div
                  key={idx}
                  className="milestone"
                  style={{ left: `${left}%` }}
                  title={`Jump to ${year}`}
                  onClick={() => setSelectedYear(Number(year))}
                >
                  ▲
                </div>
              );
            })}
          </div>

        </div>

        <hr className="divider" />
        <div className="time-slider-info">
          Explore the geographic presence of artists who were alive in a given year. Scroll through time, uncover patterns, and see the rise and fall of artistic generations.
        </div>
      </div>
    </div>
  );
}

export default TimeSlider;
