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


import TopPanel from './components/TopPanel';
import Dashboard from "./components/Dashborad";
import TimeSlider from "./components/TimeSlider";
import DetailBox from "./components/DetailBox";
import FilterList from "./components/FilterList";
import FilterDescription from "./components/FilterDescription";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

console.log("🔍 VITE_BACKEND_URL =", import.meta.env.VITE_BACKEND_URL);

const INITIAL_VIEW_STATE = {
  latitude: 20,
  longitude: 0, 
  zoom: 1.7,
  pitch: 0,
  bearing: 0
};
const theYear = (new Date()).getFullYear();


function App() {

  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [selectedYear, setSelectedYear] = useState(theYear);

  const [allHumans, setAllHumans] = useState([]); // tüm veri
  const [filteredHumans, setFilteredHumans] = useState([]); // selectedYear'a göre filtrelenmiş

  const [detailMode, setDetailMode] = useState(false);

  const [selectedPerson, setSelectedPerson] = useState(null);
  const [personDetails, setPersonDetails] = useState(null);
  const [works, setWorks] = useState([]);
  const [selectedPersonLocations, setSelectedPersonLocations] = useState([]); // tüm veri
  const [filteredSelectedPersonLocations, setFilteredSelectedPersonLocations] = useState([]); // tüm veri
  
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationDetails, setLocationDetails] = useState(null);

  const [movements, setMovements] = useState(null);
  const [selectedMovement, setSelectedMovement] = useState('');
  const [movementDetails, setMovementDetails] = useState(null);

  const [occupations, setOccupations] = useState(null);
  const [selectedOccupation, setSelectedOccupation] = useState('');

  const [genders, setGenders] = useState(null);
  const [selectedGender, setSelectedGender] = useState('');

  const [nationalities, setNationalities] = useState(null);
  const [selectedNationality, setSelectedNationality] = useState('');
  

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  
  const [distinctDates, setDistinctDates] = useState([]);

  const [nationalityTrends, setNationalityTrends] = useState([]);

   // useEffect(() => {
  //   fetch(`http://127.0.0.1:8000/nationality-trend?start_year=1700&end_year=${theYear}&step=10`)
  //     .then(res => res.json())
  //     .then(data => {setNationalityTrends(data);})  
  //     .catch(err => console.error("API error:", err));
  // }, [])
  useEffect(() => {
    const queryParams = new URLSearchParams();

    if (selectedOccupation) queryParams.append("occupation_id", selectedOccupation.id);
    if (selectedGender) queryParams.append("gender_id", selectedGender.id);
    if (selectedNationality) queryParams.append("nationality_id", selectedNationality.id);
    if (selectedMovement) queryParams.append("movement_id", selectedMovement.id);

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
      .then(data => {
        const dataNormalizedHumans = data.humans.map(h => {

          const age = selectedYear - h.birth_date;
          
          const [lonOffset, latOffset] = offsetFibonacciPosition(h.lon, h.lat, h.city_index,viewState.zoom );
          return {
              name: h.name,
              id:h.id,
              qid:h.qid,
              nationality: h.nationality,
              city: h.city,
              birth_date: h.birth_date,
              death_date: h.death_date,
              num_of_identifiers:h.num_of_identifiers,
              lat:h.lat,
              lon:h.lon,
              gender:h.gender,
              tooltip_text:h.name+"\nAge: "+age+"\nNationality:"+h.nationality+"\nCity: "+h.city,
              position: [lonOffset, latOffset],
              tposition: [lonOffset+Math.random()*10, latOffset+Math.random()*10],
              entity_type: "human",
              city_index: h.city_index
            };
        });
    
        setAllHumans(dataNormalizedHumans)
      })
      .catch(err => console.error("API error:", err));

  }, [selectedLocation, selectedOccupation, selectedGender, selectedNationality, selectedMovement]);


  
  useEffect(() => {
    
    if (searchTerm.length < 2) {
      setSearchResults([]); 
      return;
    }
    else
    {
      fetch(`${backendUrl}/search?q=${encodeURIComponent(searchTerm)}`)
        .then(res => res.json())
        .then(data => {
          
          setSearchResults(data); // backend tarafında hem humans hem locations döndür
        });
      }
  }, [searchTerm]);

  useEffect(() => {

    fetch(`${backendUrl}/movements/`)
      .then(res => res.json())
      .then(data => {
        setMovements(data.movements);  // 👈 dikkat!
      });
  }, []);

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
   
      fetch(`${backendUrl}/works/${selectedPerson.id}`)
        .then(res => res.json())
        .then(data => {
          const uniqueDates = Array.from(
                                          new Set(data.map((work) => work.date).filter(Boolean))
                                        ).sort(); 
          setDistinctDates(uniqueDates);
          setWorks(data);
          setDetailMode(true);
        })
        .catch(err => console.error("Works fetch error:", err));

      // Kişisel detayları getir
      fetch(`${backendUrl}/person/${selectedPerson.id}`)
        .then(res => res.json())
        .then(data => {
          setPersonDetails(data);
          
          const allLocations = Object.values(data.locations || {}).flat();
          const filtered = allLocations.filter(l => l.relationship_type_name !== "has_works_in");

          setSelectedPersonLocations(allLocations);
          setFilteredSelectedPersonLocations(filtered);

          const { centerLon, centerLat, zoom } = computeBounds(filtered, detailMode);

          setViewState({
            ...viewState,
            longitude: centerLon,
            latitude: centerLat,
            zoom: zoom,
            transitionInterpolator: new FlyToInterpolator({ speed: 1 }),
            transitionDuration: 'auto',
          });
        })
        .catch(err => console.error("Person details fetch error:", err));
  
      } else {
        setWorks([]);
        setPersonDetails(null);
        setDistinctDates([]);
        setSelectedPersonLocations([]);
        setFilteredSelectedPersonLocations([]);
      }
  }, [selectedPerson]);


  useEffect(() => {
    if( !selectedPerson) {
      const uniqueDates = Array.from(
                                      new Set(allHumans.map((human) => human.birth_date).filter(Boolean))
                                    ).sort(); // string olarak sıralar, parseInt() istersen numerik sırayla olur
      setDistinctDates(uniqueDates);
      const { centerLon, centerLat, zoom } = computeBounds(allHumans, detailMode);

      setViewState({
        ...viewState,
        longitude: centerLon,
        latitude: centerLat,
        zoom: zoom,
        transitionInterpolator: new FlyToInterpolator({ speed: 1 }),
        transitionDuration: 'auto',
      });
    }
  }, [selectedPerson, allHumans]);
        
  useEffect(() => {
    const filteredHumans = allHumans.filter(h =>
      h.birth_date <= selectedYear &&
      (!h.death_date || h.death_date >= selectedYear)
    );
    setFilteredHumans(filteredHumans);
      
  }, [selectedYear, allHumans]);                
  

  const filteredData = selectedPerson
  ? filteredHumans.filter(d => d.id === selectedPerson.id)
  : filteredHumans;

  const scatterLayer = new ScatterplotLayer({
        id: 'personal_locations',
        data:selectedLocation?[selectedLocation]:filteredSelectedPersonLocations,
        getPosition: d => [d.lon, d.lat],
        getFillColor: d=> ColorLibrary.getLocationColorByType(d.relationship_type_name),
        getRadius: 50,
        radiusMinPixels: 10,
        pickable: true
      })
 
  const arcLayer = new ArcLayer({
    id: 'artist-boxes__',
    data: filteredData.filter(d => viewState.zoom < 3.5 && selectedPerson== null && selectedLocation== null) ,
    getSourcePosition: d => d.position,                
    getTargetPosition: d => d.tposition,  
    getSourceColor:  d => ColorLibrary.genderToColor(d.gender,255-viewState.zoom*40),
    getTargetColor: d => ColorLibrary.ageToColor(selectedYear - d.birth_date, d.gender),
    getWidth: 5,
    pickable: true,
  })

  const textLayer = new TextLayer({
    id: 'artist-names',
    data: filteredData.filter(d => viewState.zoom > 2.8 || selectedPerson || selectedLocation),

    characterSet: 'auto',
    fontSettings: {
      buffer: 8
    },
    getPosition: d => d.position,
    getText: d => d.name,
    getSize: d => 10 + (d.num_of_identifiers / 15) ,
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
            <FilterList
              selectedMovement={selectedMovement}
              movements={movements}
              setSelectedMovement={setSelectedMovement}
              selectedOccupation={selectedOccupation}
              occupations={occupations}
              setSelectedOccupation={setSelectedOccupation}
              genders={genders}
              selectedGender={selectedGender}
              setSelectedGender={setSelectedGender}
              nationalities={nationalities}
              selectedNationality={selectedNationality}
              setSelectedNationality={setSelectedNationality}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              searchResults={searchResults}
              setSearchResults={setSearchResults}
              setSelectedPerson={setSelectedPerson}
              setSelectedLocation={setSelectedLocation}
             
            />
          
            <DetailBox
                detailMode={detailMode}
                setDetailMode={setDetailMode}
                selectedYear={selectedYear}
                selectedPerson={selectedPerson}
                selectedLocation={selectedLocation}
                personDetails={personDetails}
                locationDetails={locationDetails}
                onClose={() => {
                    setSelectedPerson(null);
                    setSelectedLocation(null);
                    setDetailMode(false);
                  }
                }
            />
        </div>

        <div className="right-panel-container">
          <div className="top-works-bar">
             <TopPanel
                selectedPerson={selectedPerson}
                works={works}
                selectedYear={selectedYear}
                onClose={() => {
                  // setSelectedPerson(null);
              }}
            /> 
          </div>
          {!selectedPerson && (<div className="top-filter_description-bar ">
            <FilterDescription
              selectedMovement={selectedMovement}
              selectedOccupation={selectedOccupation}
              selectedGender={selectedGender}
              selectedNationality={selectedNationality}
              selectedYear={selectedYear}
              selectedLocation={selectedLocation}
              onClearFilter={(key) => {
                console.log("Clearing filter for key:", key);
                switch (key) {
                  case "nationality": setSelectedNationality(null); break;
                  case "gender": setSelectedGender(null); break;
                  case "occupation": setSelectedOccupation(null); break;
                  case "movement": setSelectedMovement(null); break;
                  case "location": setSelectedLocation(null); break;
                  default: break;
                }
              }}
            />
          </div>)}
          
          
          <div className="top-dashboard-bar">
            <Dashboard
              humans={filteredHumans}
              nationalityTrends={nationalityTrends}
              selectedYear={selectedYear}
              selectedPerson={selectedPerson}
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
                  text: `${object.tooltip_text? object.tooltip_text : object.name }`,
                  style: { fontSize: "14px", color: "white" }
                } : null
              }
              onClick={({ object }) => {
                if (object) {
                   if (object.entity_type == "human") {
                    setSelectedLocation(null);
                    setSelectedPerson(object);
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
          </div>

          <div className={`bottom-bar ${detailMode ? "squeezed" : ""}`}>
           <TimeSlider
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              distinctDates={distinctDates}
              minYear={selectedPerson?.birth_date || 1700}
              maxYear={(selectedPerson?.death_date && selectedPerson.death_date <= theYear) ? selectedPerson.death_date : theYear}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;