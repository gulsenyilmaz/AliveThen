import React, { useState, useEffect} from 'react';

import './FilterDescription.css';
import "react-widgets/styles.css";


function FilterDescription({ 
                selectedMovement,
                selectedOccupation,
                selectedGender,
                selectedNationality,
                selectedYear,
                selectedLocation,
                onClearFilter
     }) {

        const parts = [];

        if (selectedNationality) parts.push(selectedNationality.name);
        if (selectedGender) parts.push(selectedGender.name.toLowerCase());
        if (selectedOccupation) parts.push(selectedOccupation.name.toLowerCase());

        const main = parts.length > 0
            ? `You are viewing ${parts.join(", ")}.`
            : `You are viewing all individuals.`;

        const movementPart = selectedMovement ? ` Affiliated with ${selectedMovement.name}.` : "";

        const descriptionText =  main + movementPart;


        const tags = [];

        if (selectedNationality) {
            tags.push({
            label: selectedNationality.name,
            key: "nationality",
            });
        }

        if (selectedGender) {
            tags.push({
            label: selectedGender.name.toLowerCase(),
            key: "gender",
            });
        }

        if (selectedOccupation) {
            tags.push({
            label: selectedOccupation.name.toLowerCase(),
            key: "occupation",
            });
        }

        if (selectedMovement) {
            tags.push({
            label: selectedMovement.name,
            key: "movement",
            });
        }

        if (selectedLocation) {
            tags.push({
            label: selectedLocation.name,
            key: "location",
            });
        }



  return (
    <>
        <div className="filter-tags-container">
            {tags.map((tag) => (
                <span className="filter-tag" key={tag.key}>
                {tag.label}
                <button
                    className="remove-btn"
                    onClick={() => onClearFilter(tag.key)}
                    title="Remove"
                >
                    ×
                </button>
                </span>
            ))}
        </div>
        <div className="filter-description">
                {descriptionText}
        </div>
    </>
  );
}

export default FilterDescription;