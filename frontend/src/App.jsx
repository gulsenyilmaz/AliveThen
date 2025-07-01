import "./App.css"; // Import your CSS file
import React, { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";

import Plot from 'react-plotly.js';
import { FlyToInterpolator } from '@deck.gl/core';
import { DeckGL } from "@deck.gl/react";
import { ArcLayer } from "@deck.gl/layers";
import { TextLayer } from '@deck.gl/layers';
import {LineLayer} from '@deck.gl/layers';
import {ScatterplotLayer, PathLayer} from '@deck.gl/layers';
import { CollisionFilterExtension } from '@deck.gl/extensions';
import Map from "react-map-gl";


import { computeBounds } from "./utils/locationUtils";
import ColorLibrary from "./utils/ColorLibrary"; 
import { offsetFibonacciPosition } from "./utils/offsetPosition";


import BottomPanel from './components/BottomPanel';
import Dashboard from "./components/Dashborad";
import TimeSlider from "./components/TimeSlider";
import DetailBox from "./components/DetailBox";
import FilterList from "./components/FilterList";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

console.log("🔍 VITE_BACKEND_URL =", import.meta.env.VITE_BACKEND_URL);

const INITIAL_VIEW_STATE = {
  latitude: 20,
  longitude: -40, 
  zoom: 1.7,
  pitch: 0,
  bearing: 0
};
const theYear = (new Date()).getFullYear();
const elevationFactor = 0.1;

function App() {

  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [selectedYear, setSelectedYear] = useState(theYear);
  const [debouncedYear] = useDebounce(selectedYear, 100);

  const [selectedPerson, setSelectedPerson] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedOccupation, setSelectedOccupation] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [selectedNationality, setSelectedNationality] = useState('');

  const [personDetails, setPersonDetails] = useState(null);
  const [locationDetails, setLocationDetails] = useState(null);

  const [genders, setGenders] = useState(null);
  const [nationalities, setNationalities] = useState(null);
  const [occupations, setOccupations] = useState(null);
  const [allHumans, setAllHumans] = useState([]); // tüm veri
  const [filteredHumans, setFilteredHumans] = useState([]); // selectedYear'a göre filtrelenmiş
  const [nationalityTrends, setNationalityTrends] = useState([]);
  const [works, setWorks] = useState([]);


  useEffect(() => {
  const queryParams = new URLSearchParams();

  if (selectedOccupation) queryParams.append("occupation_id", selectedOccupation.id);
  if (selectedGender) queryParams.append("gender_id", selectedGender.id);
  if (selectedNationality) queryParams.append("nationality_id", selectedNationality.id);

  if (selectedLocation) {
    queryParams.append("location_id", selectedLocation.id);
    if (selectedLocation.relationship_type_id) {
      queryParams.append("relationship_type_id", selectedLocation.relationship_type_id);
    }


    // Location detaylarını ayrı getir
    fetch(`${backendUrl}/location/${selectedLocation.id}`)
      .then(res => res.json())
      .then(data => setLocationDetails(data.details))
      .catch(err => console.error("Location details fetch error:", err));
    } else {
      setLocationDetails(null);
    }

    // Tüm human verilerini filtrelere göre getir
    fetch(`${backendUrl}/allhumans?${queryParams.toString()}`)
      .then(res => res.json())
      .then(data => setAllHumans(data.humans))
      .catch(err => console.error("API error:", err));

}, [selectedLocation, selectedOccupation, selectedGender, selectedNationality]);


   // useEffect(() => {
  //   fetch(`http://127.0.0.1:8000/nationality-trend?start_year=1700&end_year=${theYear}&step=10`)
  //     .then(res => res.json())
  //     .then(data => {setNationalityTrends(data);})  
  //     .catch(err => console.error("API error:", err));
  // }, [])

  useEffect(() => {

    fetch(`${backendUrl}/occupations/`)
      .then(res => res.json())
      .then(data => {
        setOccupations(data.occupations);  // 👈 dikkat!
      });
  }, []);

  useEffect(() => {

    fetch(`${backendUrl}/genders/`)
      .then(res => res.json())
      .then(data => {
        setGenders(data.genders);  // 👈 dikkat!
      });
  }, []);

   useEffect(() => {

    fetch(`${backendUrl}/nationalities/`)
      .then(res => res.json())
      .then(data => {
        setNationalities(data.nationalities);  // 👈 dikkat!
      });
  }, []);


  useEffect(() => {
    if (selectedPerson) {
      // Eserleri getir
    
      fetch(`${backendUrl}/works/${selectedPerson.id}?year=${selectedYear}`)
        .then(res => res.json())
        .then(data => setWorks(data))
        .catch(err => console.error("Works fetch error:", err));

      // Kişisel detayları getir
      fetch(`${backendUrl}/person/${selectedPerson.id}`)
        .then(res => res.json())
        .then(data => setPersonDetails(data))
        .catch(err => console.error("Person details fetch error:", err));
      
  
      } else {
        setWorks([]);
        setPersonDetails(null);
      }
    }, [selectedPerson, selectedYear]);

  useEffect(() => {
    if (personDetails?.locations?.length > 0) {
      const { centerLon, centerLat, zoom } = computeBounds(personDetails.locations);

      setViewState({
        ...viewState,
        longitude: centerLon,
        latitude: centerLat,
        zoom: zoom,
        transitionInterpolator: new FlyToInterpolator({ speed: 1 }),
        transitionDuration: 'auto',
      });
    }
  }, [personDetails]);

  useEffect(() => {
      const filtered = allHumans.filter(h =>
        h.birth_date <= selectedYear &&
        (!h.death_date || h.death_date >= selectedYear)
      );

      const filteredNormalized = filtered.map(h => {
    
      const age = selectedYear - h.birth_date;
      
      const [lonOffset, latOffset] = offsetFibonacciPosition(h.lon, h.lat, h.city_index);
      return {
          name: h.name,
          id:h.id,
          nationality: h.nationality,
          city: h.city,
          birth_date: h.birth_date,
          death_date: h.death_date,
          num_of_identifiers:h.num_of_identifiers,
          lat:h.lat,
          lon:h.lon,
          age:age,
          gender:h.gender,
          tooltip_text:h.name+"\nAge: "+age+"\nNationality:"+h.nationality+"\nCity: "+h.city,
          position: [lonOffset, latOffset],
          tposition: [lonOffset+Math.random()*20/viewState.zoom, latOffset+Math.random()*20/viewState.zoom],
          fillColor: ColorLibrary.genderToColor(h.gender,200-viewState.zoom*20),
          fillTColor: ColorLibrary.ageToColor(age, h.gender),
          arcWitdh:age * viewState.zoom/50,
          entity_type: "human"
        };
      });

      setFilteredHumans(filteredNormalized);
      
    }, [selectedYear, allHumans]);
  

 
  
 
  const filteredData = selectedPerson
  ? filteredHumans.filter(d => d.id === selectedPerson.id)
  : filteredHumans;

  const personal_locations = personDetails
  ? personDetails.locations : selectedLocation? [selectedLocation]: []; 
  
  const scatterLayer = new ScatterplotLayer({
        id: 'personal_locations',
        data:personal_locations,
        getPosition: d => [d.lon, d.lat],
        getFillColor: d=> ColorLibrary.getLocationColorByType(d.relationship_type_name),
        getRadius: 50,
        radiusMinPixels: 10,
        pickable: true
      })
 
  const arcLayer = new ArcLayer({
    id: 'artist-boxes__',
    data: filteredData.filter(d => viewState.zoom < 2.3 && selectedPerson== null && selectedLocation== null) ,
    getSourcePosition: d => d.position,                
    getTargetPosition: d => d.tposition,  
    getSourceColor:  d => d.fillColor,
    getTargetColor: d => d.fillTColor,
    getWidth: d => d.arcWitdh,
    pickable: true,
  })

  const textLayer = new TextLayer({
    id: 'artist-names',
    data: filteredData.filter(d => viewState.zoom > 2.3 || selectedPerson || selectedLocation),

    characterSet: 'auto',
    fontSettings: {
      buffer: 8
    },
    getPosition: d => d.position,
    getText: d => d.name,
    getSize: d => 10 + (d.num_of_identifiers / 20) ,
    getColor: [48, 48, 48],
    sizeMinPixels: 10,
    sizeMaxPixels: 30,
    getTextAnchor: 'middle',
    getAlignmentBaseline: 'top',
    background: true,
    backgroundPadding: [2, 1],
    getBackgroundColor: [0, 0, 0, 0],
    pickable: true,

    extensions: [new CollisionFilterExtension()],
    collisionEnabled: true, 
    collisionTestProps: {
      size: true, 
      text: true
    },
    getCollisionPriority: d => d.num_of_identifiers
  });

  return (
    <div className="app-container">
      <div className="main-content">
        <div className="left-panel-container">
          
            <DetailBox
                selectedYear={selectedYear}
                selectedPerson={selectedPerson}
                selectedLocation={selectedLocation}
                personDetails={personDetails}
                locationDetails={locationDetails}
                onClose={() => {
                  setSelectedPerson(null);
                  setSelectedLocation(null);
                  console.log("DetailBox onClose")
                  const newView = {
                    ...viewState,
                    longitude: INITIAL_VIEW_STATE.longitude,
                    latitude: INITIAL_VIEW_STATE.latitude,
                    zoom: INITIAL_VIEW_STATE.zoom,
                    pitch: INITIAL_VIEW_STATE.pitch,
                    bearing: INITIAL_VIEW_STATE.bearing,
                    transitionInterpolator: new FlyToInterpolator({ speed: 1 }),
                    transitionDuration: 'auto',
                  };

                  setViewState(newView);
              }}
            />
            
            
            {/* <div className="info-box">
              Explore the geographic presence of artists who were alive in a given year. Scroll through time, uncover patterns, and see the rise and fall of artistic generations.
            </div> */}
        </div>
        <div className="right-panel-container">
          
          <div className="top-bar">
            <FilterList
              selectedOccupation ={selectedOccupation}
              occupations = {occupations}
              setSelectedOccupation = {setSelectedOccupation}
              selectedGender = {selectedGender}
              genders = {genders}
              setSelectedGender = {setSelectedGender}
              selectedNationality = {selectedNationality}
              nationalities = {nationalities}
              setSelectedNationality = {setSelectedNationality}
              
              />
            <Dashboard
              humans={filteredHumans}
              nationalityTrends={nationalityTrends}
              selectedYear={selectedYear}
            />
            
          </div>
          <div className="scene">
            <DeckGL
              initialViewState={viewState}
              controller={true}
              onViewStateChange={({ viewState }, interactionState) => {
                  setViewState(viewState);
              }}
              layers={[scatterLayer, textLayer, arcLayer]}
              getTooltip={({ object }) =>
                object ? {
                  text: `${object.tooltip_text}`,
                  style: { fontSize: "14px", color: "white" }
                } : null
              }
              onClick={({ object }) => {
                if (object) {
                   if (object.entity_type == "human") {
                    setSelectedLocation(null);
                    setSelectedPerson({
                      id: object.id,
                      name: object.name,
                      birth_date:object.birth_date,
                      death_date:object.death_date,
                      age: object.age
                    });
                  }
                  else if(object.entity_type == "location"){
                     setSelectedPerson(null);
                     setSelectedLocation(object);
                  }
                }
              }}
            >
            <Map
              mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
              mapStyle="mapbox://styles/mapbox/light-v11"
            />
            </DeckGL>
            {/* <FilterPanel/> */}
          </div>
          <div className="bottom-bar">
           <TimeSlider
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              minYear={selectedPerson?.birth_date || 1700}
              maxYear={(selectedPerson?.death_date && selectedPerson.death_date <= theYear) ? selectedPerson.death_date : theYear}
            />

            
            <BottomPanel
              selectedPerson={selectedPerson}
              works={works}
              selectedYear={selectedYear}
              onClose={() => {
                // setSelectedPerson(null);

                // const newView = {
                //   ...viewState,
                //   longitude: INITIAL_VIEW_STATE.longitude,
                //   latitude: INITIAL_VIEW_STATE.latitude,
                //   zoom: INITIAL_VIEW_STATE.zoom,
                //   pitch: INITIAL_VIEW_STATE.pitch,
                //   bearing: INITIAL_VIEW_STATE.bearing,
                //   transitionInterpolator: new FlyToInterpolator({ speed: 1 }),
                //   transitionDuration: 'auto',
                // };

                // setViewState(newView);
              }}
            /> 
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;