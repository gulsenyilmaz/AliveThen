import React, { useState, useEffect } from "react";
import { DeckGL } from "@deck.gl/react";
import { ColumnLayer } from "@deck.gl/layers";
import Map from "react-map-gl";
import artists from "./data/Artists.json";
import { ageToColor } from "./utils/colorScale";
import { useDebounce } from "use-debounce";
import countryCoords from './data/country_coords.json';

const INITIAL_VIEW_STATE = {
  latitude: 30,
  longitude: 0, 
  zoom: 1.5,
  pitch: 20,
  bearing: 0
};

const elevationFactor = 10000;

const offsetPosition = (baseLon, baseLat, index) => {
  const angle = index * 1.2;
  const radius = 0.4 + 0.005 * index; // derece (~50km)
  return [
    baseLon + Math.cos(angle) * radius,
    baseLat + Math.sin(angle) * radius*1.1
  ];
};


function App() {
  const [selectedYear, setSelectedYear] = useState(1940);
  const [debouncedYear] = useDebounce(selectedYear, 20);

  const [humans, setHumans] = useState([]);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/humans?year=${debouncedYear}`)
      .then(res => res.json())
      .then(data => setHumans(data))
      .catch(err => console.error("API error:", err));
  }, [debouncedYear]);

  const counters = {};

  const data = humans.map(h => {
    const nationality = h.Nationality || "Unknown";
    const base = countryCoords[nationality] || [0, 0];

    if (!counters[nationality]) counters[nationality] = 0;

    const [lon, lat] = base;
    const [lonOffset, latOffset] = offsetPosition(lon, lat, counters[nationality]);
    counters[nationality]++;

    const age = debouncedYear - h.BirthYear;

    return {
      name: h.DisplayName,
      position: [latOffset, lonOffset],
      elevation: age * elevationFactor,
      fillColor: ageToColor(age)
    };
  });

  const columnLayer = new ColumnLayer({
    id: "artist-boxes",
    data,
    diskResolution: 12,
    radius: 10000,
    extruded: true,
    pickable: true,
    elevationScale: 1,
    getPosition: d => d.position,
    getElevation: d => d.elevation,
    getFillColor: d => d.fillColor
  });

  return (
    <div>
      {/* Slider - Üstte, sabit pozisyon */}
      <div style={{
        position: "absolute",
        top: 20,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 10,
        backgroundColor: "rgba(179, 163, 61, 0.67)",
        padding: "0.5rem 1rem",
        borderRadius: "8px"
      }}>
        <label><strong>Year: {selectedYear}</strong></label>
        <br />
        <input
          type="range"
          min="1700"
          max="2025"
          step="1"
          value={selectedYear}
          onChange={e => setSelectedYear(Number(e.target.value))}
         
          style={{ width: "300px", color: "#007bff" }}
        />
      </div>
      {/* Harita */}
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={[columnLayer]}
        getTooltip={({ object }) =>
          object ? {
            text: `${object.name}\nAge: ${object.elevation / elevationFactor}`,
            style: { fontSize: "14px", color: "white" }
          } : null
        }
      >
        <Map
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
          mapStyle="mapbox://styles/mapbox/light-v11"
        />
      </DeckGL>
    </div>
  );
}

export default App;