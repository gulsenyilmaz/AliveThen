import "./App.css"; // Import your CSS file
import React, { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";

import Plot from 'react-plotly.js';

import { DeckGL } from "@deck.gl/react";
import { ArcLayer } from "@deck.gl/layers";
import { TextLayer } from '@deck.gl/layers';
import Map from "react-map-gl";


import ColorLibrary from "./utils/ColorLibrary"; // Eğer ColorLibrary kullanacaksanız
import { offsetFibonacciPosition } from "./utils/offsetPosition";

import countryCoords from './data/country_coords.json';
import BottomPanel from './components/BottomPanel';
import FilterPanel from "./components/FilterPanel";
import Dashboard from "./components/Dashborad";


const INITIAL_VIEW_STATE = {
  latitude: 40,
  longitude: 20, 
  zoom: 1.5,
  pitch: 0,
  bearing: 0
};

const elevationFactor = 0.2;

function App() {

  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [selectedYear, setSelectedYear] = useState(1940);
  const [debouncedYear] = useDebounce(selectedYear, 100);

  const [selectedPerson, setSelectedPerson] = useState(null);
  
  const [humans, setHumans] = useState([]);
  const [works, setWorks] = useState([]);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/humans?year=${debouncedYear}`)
      .then(res => res.json())
      .then(data => setHumans(data))
      .catch(err => console.error("API error:", err));
  }, [debouncedYear]);

  useEffect(() => {
  if (selectedPerson) {
    fetch(`http://127.0.0.1:8000/works/${selectedPerson.id}?year=${debouncedYear}`)
      .then(res => res.json())
      .then(data => setWorks(data))
      .catch(err => console.error("Works fetch error:", err));
      } else {
        setWorks([]);
      }
    }, [selectedPerson, debouncedYear]);  // 🔄 debouncedYear'ı da ekledim
  
  
  const nationalityCounts = {};

  const data = humans.map(h => {
    const nationality = h.Nationality || "Unknown";
    const base = countryCoords[nationality] || [0, 0];

    if (!nationalityCounts[nationality]) nationalityCounts[nationality] = 0;
    const [lon, lat] = base;
    const [lonOffset, latOffset] = offsetFibonacciPosition(lon, lat, nationalityCounts[nationality]);
    nationalityCounts[nationality]++;

    const age = debouncedYear - h.BirthYear;
               

    return {
      name: h.DisplayName,
      cId:h.ConstituentID,
      nationality: h.Nationality,
      bYear: h.BirthYear,
      dYear: h.DeathYear,
      age:age,
      position: [latOffset, lonOffset],
      tposition: [latOffset+Math.random()*10, lonOffset+Math.random()*10],
      fillColor: ColorLibrary.genderToColor(h.Gender, h.DeathYear-debouncedYear),
      fillTColor: ColorLibrary.ageToColor(age, h.DeathYear-debouncedYear)
    };
  });

  
  const arcLayer = new ArcLayer({
    id: 'artist-boxes',
    data: data ,
    getSourcePosition: d => d.position,                // yer seviyesi
    getTargetPosition: d => d.tposition,      // yükseğe doğru
    getSourceColor:  d => d.fillColor,
    getTargetColor: d => d.fillTColor,
    getWidth: d => d.age * elevationFactor,
    pickable: true,
  })

  const textLayer = new TextLayer({
    id: 'artist-names',
    data: data.filter(d => viewState.zoom > 5), // Zoom > 3 olanlar görünsün
    getPosition: d => d.position,
    getText: d => d.name,
    getSize: 14,
    getColor: [255, 255, 255],
    sizeMinPixels: 10,
    sizeMaxPixels: 30,
    getTextAnchor: 'middle',
    getAlignmentBaseline: 'top',
    background: true,
    backgroundPadding: [2, 1],
    getBackgroundColor: [0, 0, 0, 160],
    pickable: false
  });

  return (
    <div className="app-container">
      <div className="year-slider">
        <label><strong>Year: {selectedYear}</strong></label>
        <input
          type="range"
          min="1700"
          max="2025"
          step="1"
          value={selectedYear}
          onChange={e => setSelectedYear(Number(e.target.value))}
        />
      </div>
      <FilterPanel/>
      
      <BottomPanel
        selectedPerson={selectedPerson}
        works={works}
        selectedYear={selectedYear}
      />
      <Dashboard
        humans={humans}
        nationalityCounts={nationalityCounts}
        selectedYear={selectedYear}
      />

      
      {/* Harita */}
      <div style={{ flexGrow: 1 }}>
        <DeckGL
          initialViewState={INITIAL_VIEW_STATE}
          controller={true}
          onViewStateChange={({ viewState }) => setViewState(viewState)}
          layers={[arcLayer, textLayer]}
          getTooltip={({ object }) =>
            object ? {
              text: `${object.name}\nAge: ${object.age}\nNationality: ${object.nationality}`,
              style: { fontSize: "14px", color: "white" }
            } : null
          }
          onClick={({ object }) => {
            if (object) {
              setSelectedPerson({
                id: object.cId,
                name: object.name,
                bYear:object.bYear,
                age: object.age
              });
            }
          }}
        >
          <Map
            mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
            mapStyle="mapbox://styles/mapbox/dark-v11"
          />
        </DeckGL>
      </div>

       {/* <div className="header-description">
        <p className="header-description p">
          Explore the geographic presence of artists who were alive in a given year.  
          Scroll through time, uncover patterns, and see the rise and fall of artistic generations.
        </p>
      </div> */}

    
    </div>
  );
  
}

export default App;