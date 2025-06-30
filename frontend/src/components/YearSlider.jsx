import React, { useState } from "react";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import "react-horizontal-scrolling-menu/dist/styles.css";
import "./YearSlider.css";

const years = Array.from({ length: 2026 - 1000 }, (_, i) => 1000 + i);

function YearCard({ year, selectedYear, onSelect }) {
  const isSelected = year === selectedYear;
  return (
    <div
      className={`year-card ${isSelected ? "selected" : ""}`}
      onClick={() => onSelect(year)}
    >
      {year}
    </div>
  );
}

function YearSlider({ selectedYear, setSelectedYear }) {
  return (
    <div className="year-slider">
      <ScrollMenu>
        {years.map((year) => (
          <YearCard
            key={year}
            year={year}
            selectedYear={selectedYear}
            onSelect={setSelectedYear}
          />
        ))}
      </ScrollMenu>
    </div>
  );
}

export default YearSlider;
