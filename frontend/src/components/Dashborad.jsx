import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import './Dashboard.css';
import Trends from "./Trends";

function Dashboard({humans,nationalityTrends, selectedYear}) {
  const aliveCount = humans.length;
  let femaleCount = humans.filter(h => h.gender === 'female').length;
  const femalePct = aliveCount ? ((femaleCount / aliveCount) * 100).toFixed(1) : 0;

  const nationalityCounter = {};
  const cityCounter = {};
  const genderCounter = {};

  for (const h of humans) {
    if (h.nationality) {
      nationalityCounter[h.nationality] = (nationalityCounter[h.nationality] || 0) + 1;
    }

    if (h.city) {
      cityCounter[h.city] = (cityCounter[h.city] || 0) + 1;
    }

    if (h.gender) {
      genderCounter[h.gender] = (genderCounter[h.gender] || 0) + 1;
    }
  }

  // En çoktan aza sırala
  const nationalities = Object.entries(nationalityCounter).sort((a, b) => b[1] - a[1]);
  const topNationalities = nationalities.slice(0, 10);
  const cities = Object.entries(cityCounter).sort((a, b) => b[1] - a[1]);
  const topCities = cities.slice(0, 10);
  const genders = Object.entries(genderCounter).sort((a, b) => b[1] - a[1]);

  // Bar chart verisi için labels ve values
  const nationalityLabels = topNationalities.map(item => item[0]);
  const nationalityValues = topNationalities.map(item => item[1]);

  const citiesLabels = topCities.map(item => item[0]);
  const citiesValues = topCities.map(item => item[1]);

  const genderLabels = genders.map(item => item[0]);
  const genderValues = genders.map(item => item[1]);

  const colorPalette = [
    '#4e79a7', // blue
  '#f28e2c', // orange
  '#e15759', // red
  '#76b7b2', // teal
  '#59a14f', // green
  '#edc949', // yellow
  '#af7aa1', // purple
  '#ff9da7', // pink
  '#9c755f', // brown
  '#bab0ab', // gray-beige

  // Eklenecek 5 yeni pastel uyumlu renk:
  '#8cd17d', // soft lime green
  '#b6992d', // ochre gold
  '#d37295', // rose pink
  '#5b5f97', // muted indigo
  '#009fb7'  // strong cyan-blue
  ];

  // Basit string hash fonksiyonu
  function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
      hash = hash & hash; // Convert to 32bit int
    }
    return Math.abs(hash);
  }

  function getColorForNationality(nationality) {
    const index = hashString(nationality) % colorPalette.length;
  
    return colorPalette[index];
  }


  return (
    <>
       
        <div className='stats-row'>
          <div className="chart-box-title"><strong>NATIONALITIES</strong></div>
            <div className="chart-box">
              <Plot
                  data={[
                    {
                      x: nationalityValues,
                      y: nationalityLabels,
                      type: 'bar',
                      orientation: 'h',
                      marker: {
                        color: nationalityLabels.map(label => getColorForNationality(label))
                      }
                    }
                  ]}
                  layout={{
                
                    yaxis: {
                      color: "gray",
                      autorange: "reversed",
                      tickfont: {
                        color: "gray"
                      },
                      title: {
                        font: { color: "gray" }
                      }
                    },
                    xaxis: {
                      
                      showticklabels: false,
                      showgrid: false,
                      showline: false,
                      zeroline: false,
                    },
                    margin: { t: 30, l: 90, r: 5, b: 10 },
                    paper_bgcolor: 'rgba(0, 0, 0, 0)',
                    plot_bgcolor: 'rgba(0, 0, 0, 0)',
                    font: {
                      color: "white"
                    }
                  }}
            config={{
                displayModeBar: false,
                staticPlot: false   // tüm etkileşimleri devre dışı bırakır (zoom/pan)
            }}
            useResizeHandler={false}
              style={{ width: "100%", height: "100%" }}
            />
           
          {/* <Trends
              nationalityTrends={nationalityTrends}
              selectedYear={selectedYear}
            /> */}
            </div>
          </div>
       
        {/* Bar chart */}
        <div className='stats-row'>
          
          <div className="chart-box">
            
                <Plot
                  data={[
                    {
                      x: citiesValues,
                      y: citiesLabels,
                      type: 'bar',
                      orientation: 'h',
                      marker: { color: '#76b7b2' }
                    }
                  ]}
                  layout={{
                
                    yaxis: {
                      color: "gray",
                      autorange: "reversed",
                      tickfont: {
                        color: "gray"
                      },
                      title: {
                        font: { color: "gray" }
                      }
                    },
                    xaxis: {
                      
                      showticklabels: false,
                      showgrid: false,
                      showline: false,
                      zeroline: false,
                    },
                    margin: { t: 30, l: 90, r: 5, b: 10 },
                    paper_bgcolor: 'rgba(0, 0, 0, 0)',
                    plot_bgcolor: 'rgba(0, 0, 0, 0)',
                    font: {
                      color: "white"
                    }
                  }}
            config={{
                displayModeBar: false,
                staticPlot: false   // tüm etkileşimleri devre dışı bırakır (zoom/pan)
            }}
            useResizeHandler={false}
              style={{ width: "100%", height: "100%" }}
            />
            
          </div>
          <div className="chart-box-title"><strong>CITIES</strong></div>
          </div>
          
          <div className='stats-row'>
            
            <div className="chart-box-title"><strong>GENDER</strong></div>
            <div className="stats-box">
              <div><strong>Female: </strong> {femaleCount} ({femalePct}%)</div>
              <div><strong>Artists alive: </strong> {aliveCount}</div>
              <div><strong>Nationalities: </strong>{nationalities.length} </div>
            </div>
            <div className="chart-box">
              
              <Plot
                  data={[
                    {
                      values: [femaleCount, aliveCount - femaleCount],
                      labels: ["Female","Male"],
                      type: "pie",
                      hole: 0.5,
                      textinfo: "label+percent",
                      textposition: "inside",
                      marker: {
                        colors: ["rgb(255,157,167)", "rgb(78,121,167)"],
                        line: {
                          color: "#fff",
                          width: 2
                        }
                      }
                    }
                  ]}
                  layout={{
                    title: "Gender Distribution",
                    showlegend: false,
                    margin: { t: 5, l: 0, r: 0, b: 0 },
                    paper_bgcolor: 'rgba(0, 0, 0, 0)',
                    plot_bgcolor: 'rgba(0, 0, 0, 0)',
                  }}
                  config={{
                      displayModeBar: false,
                      staticPlot: false   
                  }}
                  useResizeHandler
                  style={{ width: "90%", height: "90%" }}
                />
            </div>
            
            
          </div>
         
          {/* <div className='stats-row'>
            
          </div> 
          <div className='stats-row'>
            <div className="info-box">
              Explore the geographic presence of artists who were alive in a given year. Scroll through time, uncover patterns, and see the rise and fall of artistic generations.
            </div>
          </div>  */}
          
      
      {/* <div className="cornerbar"></div> */}
    </>
  );
}

export default Dashboard;