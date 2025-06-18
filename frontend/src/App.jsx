import "./App.css"; // Import your CSS file
import React, { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";

import Plot from 'react-plotly.js';

import { DeckGL } from "@deck.gl/react";
import { ArcLayer } from "@deck.gl/layers";
import { TextLayer } from '@deck.gl/layers';
import Map from "react-map-gl";


import ColorLibrary from "./utils/ColorLibrary"; 
import { offsetFibonacciPosition } from "./utils/offsetPosition";

import countryCoords from './data/country_coords.json';
import BottomPanel from './components/BottomPanel';
import FilterPanel from "./components/FilterPanel";
import Dashboard from "./components/Dashborad";
import TimeSlider from "./components/TimeSlider";
import Trends from "./components/Trends";


const INITIAL_VIEW_STATE = {
  latitude: 20,
  longitude: -40, 
  zoom: 1.7,
  pitch: 0,
  bearing: 0
};

const elevationFactor = 0.1;

function App() {

  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [selectedYear, setSelectedYear] = useState(2025);
  const [debouncedYear] = useDebounce(selectedYear, 100);

  const [selectedPerson, setSelectedPerson] = useState(null);
  
  const [humans, setHumans] = useState([]);
  const [cities, setCities] = useState([]);
  const [genders, setGenders] = useState({});
  const [nationalities, setNationalities] = useState([]);
  const [nationalityTrends, setNationalityTrends] = useState([]);
  const [works, setWorks] = useState([]);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/humans?year=${debouncedYear}`)
      .then(res => res.json())
      .then(data => {
                      setHumans(data.humans);
                      setNationalities(data.summary.nationalities);  
                      setCities(data.summary.cities); 
                      setGenders(data.summary.genders);
                    })  
      .catch(err => console.error("API error:", err));
  }, [debouncedYear]);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/nationality-trend?start_year=1700&end_year=2025&step=10`)
      .then(res => res.json())
      .then(data => {setNationalityTrends(data);})  
      .catch(err => console.error("API error:", err));
  }, [])

  useEffect(() => {
  if (selectedPerson) {
    fetch(`http://127.0.0.1:8000/works/${selectedPerson.id}?year=${debouncedYear}`)
      .then(res => res.json())
      .then(data => setWorks(data))
      .catch(err => console.error("Works fetch error:", err));
      } else {
        setWorks([]);
      }
    }, [selectedPerson, debouncedYear]);  
  
  const data = humans.map(h => {

    const age = debouncedYear - h.birth_date;
    const lat = h.lat || 0;
    const lon = h.lon || 0;
    
    
    const [lonOffset, latOffset] = offsetFibonacciPosition(lon, lat, h.city_index);
  
    return {
      name: h.name,
      id:h.id,
      nationality: h.nationality,
      city: h.city,
      bYear: h.birth_date,
      dYear: h.death_date,
      age:age,
      position: [lonOffset, latOffset],
      tposition: [lonOffset+Math.random()*20/viewState.zoom, latOffset+Math.random()*20/viewState.zoom],
      fillColor: ColorLibrary.genderToColor(h.gender,200-viewState.zoom*20),
      fillTColor: ColorLibrary.ageToColor(age, h.gender),
      arcWitdh:age * viewState.zoom/50,
    };
  });
  
  
  const arcLayer = new ArcLayer({
    id: 'artist-boxes',
    data: data.filter(d => viewState.zoom < 8) ,
    getSourcePosition: d => d.position,                
    getTargetPosition: d => d.tposition,      
    getSourceColor:  d => d.fillColor,
    getTargetColor: d => d.fillTColor,
    getWidth: d => d.arcWitdh,
    pickable: true,
  })

  const textLayer = new TextLayer({
    id: 'artist-names',
    data: data.filter(d => viewState.zoom > 5.5), 
    getPosition: d => d.position,
    getText: d => d.name,
    getSize: d => 8+d.age/5,
    getColor: [48, 48, 48],
    sizeMinPixels: 10,
    sizeMaxPixels: 30,
    getTextAnchor: 'middle',
    getAlignmentBaseline: 'top',
    background: true,
    backgroundPadding: [2, 1],
    getBackgroundColor: [0, 0, 0, 0],
    pickable: true
  });

  return (
    <div className="app-container">
      <div className="main-content">
        <div className="left-panel-container">
          <div className="left-panel">
            <Dashboard
              humans={humans}
              cities={cities}
              genders={genders}
              nationalities={nationalities}
              nationalityTrends={nationalityTrends}
              selectedYear={selectedYear}
            />
          </div>
          <div className="leftcorner-panel">
          </div>
        </div>
        <div className="right-panel-container">
          <div className="scene">
            <DeckGL
              initialViewState={INITIAL_VIEW_STATE}
              controller={true}
              onViewStateChange={({ viewState }) => setViewState(viewState)}
              layers={[arcLayer, textLayer]}
              getTooltip={({ object }) =>
                object ? {
                  text: `${object.name}\nAge: ${object.age}\nNationality: ${object.nationality}\nCity: ${object.city}`,
                  style: { fontSize: "14px", color: "white" }
                } : null
              }
              onClick={({ object }) => {
                if (object) {
                  setSelectedPerson({
                    id: object.id,
                    name: object.name,
                    bYear:object.bYear,
                    dYear:object.dYear,
                    age: object.age
                  });
                }
              }}
            >
            <Map
              mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
              mapStyle="mapbox://styles/mapbox/light-v11"
            />
            </DeckGL>
            <FilterPanel/>
          </div>
          <div className="bottom-bar">
            <TimeSlider
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
            />
            <BottomPanel
              selectedPerson={selectedPerson}
              works={works}
              selectedYear={selectedYear}
            /> 
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;