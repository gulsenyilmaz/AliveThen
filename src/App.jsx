import React, { useState, useEffect } from "react";
import Plot from 'react-plotly.js';
import { DeckGL } from "@deck.gl/react";
import { ColumnLayer } from "@deck.gl/layers";
import { ArcLayer } from "@deck.gl/layers";
import Map from "react-map-gl";
//import {GeoJsonLayer} from '@deck.gl/layers';
import artists from "./data/Artists.json";
import { ageToColor } from "./utils/colorScale";
//import { countToColor } from "./utils/countToColor";
import { offsetFibonacciPosition } from "./utils/offsetPosition";
import { useDebounce } from "use-debounce";
import countryCoords from './data/country_coords.json';
import isoToNationality from './data/iso_to_nationality.json';



const INITIAL_VIEW_STATE = {
  latitude: 40,
  longitude: 20, 
  zoom: 1.5,
  pitch: 0,
  bearing: 0
};

const elevationFactor = 0.2;

function App() {
  const [selectedYear, setSelectedYear] = useState(1940);
  const [debouncedYear] = useDebounce(selectedYear, 100);
  
  const [humans, setHumans] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [artworks, setArtworks] = useState([]);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/humans?year=${debouncedYear}`)
      .then(res => res.json())
      .then(data => setHumans(data))
      .catch(err => console.error("API error:", err));
  }, [debouncedYear]);

  useEffect(() => {
    if (selectedArtist) {
      fetch(`http://127.0.0.1:8000/artworks/${selectedArtist.id}?year=${debouncedYear}`)
        .then(res => res.json())
        .then(data => setArtworks(data))
        .catch(err => console.error("Artworks fetch error:", err));
    } else {
      setArtworks([]);
    }
  }, [selectedArtist]);
  

  
  
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
      fillColor: ageToColor(age, h.Gender, h.DeathYear-debouncedYear)
    };
  });

  const aliveCount = humans.length;
  const femaleCount = humans.filter(a => a.Gender === "female").length;
  const femalePct = aliveCount ? ((femaleCount / aliveCount) * 100).toFixed(1) : 0;
  const sorted = Object.entries(nationalityCounts)
    .sort((a, b) => b[1] - a[1])        // Çoktan aza sırala
    .slice(0, 15);                      // En çok görünen ilk 10 ülke

  const nationalityLabels = sorted.map(([nat]) => nat);
  const nationalityValues = sorted.map(([, count]) => count);

  const arcLayer = new ArcLayer({
    id: 'artist-boxes',
    data: data ,
    getSourcePosition: d => d.position,                // yer seviyesi
    getTargetPosition: d => d.tposition,      // yükseğe doğru
    getSourceColor:  d => d.fillColor,
    getTargetColor: [70, 130, 180, 0],
    getWidth: d => d.age * elevationFactor,
    pickable: true,
  })

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Header - Başlık + Açıklama + Slider + İstatistik */}
      <div style={{
        position: "fixed",
        top: "0.5rem",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "rgba(91, 90, 90, 0.31)",
        color: "#fff",
        padding: "1rem 2rem",
        borderRadius: "8px",
        textAlign: "center",
        fontFamily: "Helvetica, serif",
        zIndex: 110
      }}>
        <p style={{ fontSize: "1.1rem", margin: 0 }}>
          Explore the geographic presence of artists who were alive in a given year.  
          Scroll through time, uncover patterns, and see the rise and fall of artistic generations.
        </p>
      </div>
      <div style={{
        position: "absolute",
        top: "1rem",
        right: "1rem",
        width: "15vw",
        backgroundColor: "rgba(84, 83, 83, 0.40)",
        padding: "0.5rem 1rem",
        borderRadius: "8px",
        fontSize: "2rem",
        textAlign: "center",
        zIndex: 1000
      }}>
        <label style={{ color: "#fff" }}><strong>Year: {selectedYear}</strong></label>
        <br />
        <input
          type="range"
          min="1700"
          max="2025"
          step="1"
          value={selectedYear}
          onChange={e => setSelectedYear(Number(e.target.value))}
          style={{ width: "100%", marginTop: "0.5rem" }}
        />
      </div>
      
      {/* İstatistik kutucuğu */}
        <div style={{
          width: "15vw",
          backgroundColor: "rgba(84, 83, 83, 0.40)",
          padding: "0.75rem 1rem",
          marginTop: "1rem",
          marginLeft: "1rem",
          borderRadius: "8px",
          fontSize: "2rem",
          lineHeight: 1.4,
          display: "inline-block",
          zIndex: 11
        }}>
          <div><strong>Artists alive:</strong> {aliveCount}</div>
        </div>
         <div style={{
          width: "15vw",
          backgroundColor: "rgba(84, 83, 83, 0.40)",
          padding: "0.75rem 1rem",
          marginTop: "1rem",
          marginLeft: "1rem",
          borderRadius: "8px",
          fontSize: "2rem",
          lineHeight: 1.4,
          display: "inline-block",
          zIndex: 11
        }}>
          <div><strong>Female:</strong> {femaleCount} ({femalePct}%)</div>
        </div>
         <div style={{
          width: "15vw",
          backgroundColor: "rgba(84, 83, 83, 0.40)",
          padding: "0.75rem 1rem",
          marginTop: "1rem",
          marginLeft: "1rem",
          borderRadius: "8px",
          fontSize: "2rem",
          lineHeight: 1.4,
          display: "inline-block",
          zIndex: 11
        }}>
          <div><strong>Countries:</strong> {Object.keys(nationalityCounts).length}</div>
        </div>
      
      
       

      {/* Bar chart */}
      <div style={{
        width: "15vw",
        backgroundColor: "rgba(84, 83, 83, 0.40)",
        padding: "0.75rem 1rem",
        marginTop: "1rem",
        marginLeft: "1rem",
        borderRadius: "8px",
        borderTop: "1px solid #ccc",
        zIndex: 10
      }}>
            <Plot
              data={[
                {
                  x: nationalityValues,
                  y: nationalityLabels,
                  type: 'bar',
                  orientation: 'h',
                  marker: { color: 'steelblue' }
                }
              ]}
              layout={{
              
                title: {
                  text: `Top 10 Nationalities in ${selectedYear}`,
                  font: {
                    color: "white"
                  }
                },
                xaxis: {
                  tickangle: -45,
                  color: "white",
                  tickfont: {
                    color: "white"
                  },
                  title: {
                    font: { color: "white" }
                  }
                },
                yaxis: {
                  color: "white",
                  autorange: "reversed",
                  tickfont: {
                    color: "white"
                  },
                  title: {
                    font: { color: "white" }
                  }
                },
                margin: { t: 40, l: 60, r: 20, b: 30 },
                paper_bgcolor: 'rgba(0, 0, 0, 0)',
                plot_bgcolor: 'rgba(0, 0, 0, 0)',
                font: {
                  color: "white"
                }
              }}
          useResizeHandler={true}
          style={{ width: "100%" }}
        />
      </div>
      {/* Harita */}
      <div style={{ flexGrow: 1 }}>
        <DeckGL
          initialViewState={INITIAL_VIEW_STATE}
          controller={true}
          layers={[arcLayer]}
          getTooltip={({ object }) =>
            object ? {
              text: `${object.name}\nAge: ${object.age}\nNationality: ${object.nationality}`,
              style: { fontSize: "14px", color: "white" }
            } : null
          }
          onClick={({ object }) => {
            if (object) {
              setSelectedArtist({
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
            mapStyle="mapbox://styles/mapbox/light-v11"
          />
        </DeckGL>
      </div>
  
      {/* Artist detay kutusu */}
      {selectedArtist && (
      <div style={{
        position: "absolute",
        bottom: 10,
        left: 10,
        right: 10,
        minHeight: "20vh",
        maxHeight: "35vh",
        maxWidth: "100vw",
        overflowX: "auto",
        backgroundColor: "rgba(9, 9, 9, 0.85)",
        padding: "1rem",
        borderRadius: "10px",
        zIndex: 20
      }}>
        <div style={{
          position: "sticky",
          top: 0,
          backgroundColor: "rgba(25, 24, 24, 0.95)",
          paddingBottom: "0.5rem",
          marginBottom: "0.5rem",
          borderBottom: "1px solid #ccc",
          zIndex: 1
        }}>
          <h3 style={{ margin: 0 }}>{selectedArtist.name} was {selectedYear-selectedArtist.bYear} years old in {selectedYear}</h3>
        </div>

        {artworks.length > 0 ? (
          <div style={{
            position: "sticky",
            display: "flex",
            flexDirection: "row",
            gap: "1rem",
            overflowX: "auto",
            paddingBottom: "0.5rem"
          }}>
            {artworks.map(a => (
              <div key={a.ObjectID} style={{
                minWidth: "100px",
                maxWidth: "150px",
                flexShrink: 0,
                color: "white"
              }}>
                
                {a.ImageURL && (
                  <a href={a.URL} target="_blank" rel="noreferrer" >
                  <img
                    src={a.ImageURL}
                    alt={a.Title}
                    style={{ width: "100%", marginTop: "0.25rem", borderRadius: "6px" }}
                  />
                  </a>
                )}
                <a href={a.URL} target="_blank" rel="noreferrer" style={{ fontSize: "0.7em", color: "#fff", textDecoration: "none" }}>
                  <strong>{a.Title}</strong>
                </a>
                <div style={{ fontSize: "0.7em" }}>{a.Date} · {a.Medium}</div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: "#ccc" }}>No artworks found.</p>
        )}
      </div>
    )}

    </div>
  );
  
}

export default App;