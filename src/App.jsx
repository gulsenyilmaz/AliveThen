import React, { useState, useEffect } from "react";
import Plot from 'react-plotly.js';
import { DeckGL } from "@deck.gl/react";
import { ColumnLayer } from "@deck.gl/layers";
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
  latitude: 30,
  longitude: 0, 
  zoom: 2,
  pitch: 20,
  bearing: 0
};

const elevationFactor = 10000;

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
      fetch(`http://127.0.0.1:8000/artworks/${selectedArtist.id}`)
        .then(res => res.json())
        .then(data => setArtworks(data))
        .catch(err => console.error("Artworks fetch error:", err));
    } else {
      setArtworks([]);
    }
  }, [selectedArtist]);
  
  const aliveCount = humans.length;
  const femaleCount = humans.filter(a => a.Gender === "female").length;
  const femalePct = aliveCount ? ((femaleCount / aliveCount) * 100).toFixed(1) : 0;
  
  
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
      bio: `( ${h.BirthYear} - ${h.DeathYear} )`,
      numOfArtworks: h.NumOfArtworks,
      position: [latOffset, lonOffset],
      elevation: age * elevationFactor,
      fillColor: ageToColor(age, h.Gender, h.DeathYear-debouncedYear)
    };
  });

  const sorted = Object.entries(nationalityCounts)
    .sort((a, b) => b[1] - a[1])        // Çoktan aza sırala
    .slice(0, 30);                      // En çok görünen ilk 10 ülke

  const nationalityLabels = sorted.map(([nat]) => nat);
  const nationalityValues = sorted.map(([, count]) => count);
  
  /*const countryLayer = new GeoJsonLayer({
    id: `country-layer-${selectedYear}`,
    data: 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson',
    stroked: true,
    filled: true,
    getFillColor: (feature) => {
      const code = feature.properties["ISO3166-1-Alpha-3"];
      const nationality = isoToNationality[code] = isoToNationality[code] || "Undefined";
      const count = nationalityCounts[nationality] || 0;
      console.log("selectedYear:",selectedYear);
      return countToColor(count);
    },
    getLineColor: [180, 180, 180],
    lineWidthMinPixels: 1,
  });*/

  const columnLayer = new ColumnLayer({
    id: "artist-boxes",
    data,
    diskResolution: 20,
    radius: 8000,
    extruded: true,
    pickable: true,
    elevationScale: 1,
    getPosition: d => d.position,
    getElevation: d => d.elevation,
    getFillColor: d => d.fillColor
    
  });

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
  
      {/* Header - Başlık + Açıklama + Slider + İstatistik */}
      <div style={{
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        color: "#fff",
        padding: "1rem",
        textAlign: "center",
        fontFamily: "Georgia, serif",
        zIndex: 11
      }}>
        <h1 style={{ margin: 0, fontSize: "2rem" }}>Alive Then</h1>
        <p style={{ fontSize: "1.1rem", marginTop: "0.5rem" }}>
          Explore the geographic presence of artists who were alive in a given year.
          Scroll through time, uncover patterns, and see the rise and fall of artistic generations.
        </p>
  
        {/* Slider */}
        <div style={{
          backgroundColor: "rgba(31, 31, 31, 0.56)",
          padding: "0.5rem 1rem",
          borderRadius: "8px",
          marginTop: "1rem",
          display: "inline-block"
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
            style={{ width: "300px" }}
          />
        </div>
  
        {/* İstatistik kutucuğu */}
        <div style={{
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          padding: "0.75rem 1rem",
          marginTop: "1rem",
          borderRadius: "8px",
          fontSize: "1rem",
          lineHeight: 1.4,
          display: "inline-block"
        }}>
          <div><strong>Artists alive:</strong> {aliveCount}</div>
          <div><strong>Female:</strong> {femaleCount} ({femalePct}%)</div>
          <div><strong>Countries:</strong> {Object.keys(nationalityCounts).length}</div>
        </div>
      </div>
  
      {/* Harita */}
      <div style={{ flexGrow: 1 }}>
        <DeckGL
          initialViewState={INITIAL_VIEW_STATE}
          controller={true}
          layers={[columnLayer]}
          getTooltip={({ object }) =>
            object ? {
              text: `${object.name}\nAge: ${object.elevation / elevationFactor}\nNationality: ${object.nationality}`,
              style: { fontSize: "14px", color: "white" }
            } : null
          }
          onClick={({ object }) => {
            if (object) {
              setSelectedArtist({
                id: object.cId,
                name: object.name,
                bio: object.bio
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
  
      {/* Bar chart */}
      <div style={{
        padding: "1rem",
        backgroundColor: "rgba(231, 214, 213, 0.6)",
        borderTop: "1px solid #ccc"
      }}>
        <Plot
          data={[
            {
              x: nationalityLabels,
              y: nationalityValues,
              type: 'bar',
              marker: { color: 'steelblue' }
            }
          ]}
          layout={{
            width: "100%",
            height: 350,
            xaxis: {
              tickangle: -45
            },
            title: {
              text: `Top 10 Nationalities in ${selectedYear}`,
            },
            margin: { t: 30, l: 40, r: 20, b: 100 },
            paper_bgcolor: 'rgba(255, 255, 255, 0.5)',
            plot_bgcolor: 'rgba(255, 255, 255, 0.5)'
          }}
          useResizeHandler={true}
          style={{ width: "100%" }}
        />
      </div>
  
      {/* Artist detay kutusu */}
      {selectedArtist && (
        <div style={{
          position: "absolute",
          bottom: 10,
          right: 10,
          width: "300px",
          maxHeight: "90vh",
          overflowY: "auto",
          backgroundColor: "rgba(9, 9, 9, 0.95)",
          padding: "1rem",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
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
            <h3 style={{ margin: 0 }}>{selectedArtist.name} / {selectedArtist.bio}</h3>
          </div>
  
          {artworks.length > 0 ? (
            artworks.map(a => (
              <div key={a.ObjectID} style={{ marginBottom: "1rem" }}>
                <a href={a.URL} target="_blank" rel="noreferrer">
                  <strong>{a.Title}</strong>
                </a>
                <div style={{ fontSize: "0.9em" }}>{a.Date} · {a.Medium}</div>
                {a.ImageURL && (
                  <img
                    src={a.ImageURL}
                    alt={a.Title}
                    style={{ width: "100%", marginTop: "0.25rem", borderRadius: "6px" }}
                  />
                )}
              </div>
            ))
          ) : (
            <p>No artworks found.</p>
          )}
        </div>
      )}
    </div>
  );
  
}

export default App;