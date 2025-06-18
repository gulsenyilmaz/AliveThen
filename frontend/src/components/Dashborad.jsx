import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import './Dashboard.css';
import Trends from "./Trends";

function Dashboard({humans, cities, genders, nationalities, nationalityTrends, selectedYear}) {
  const aliveCount = humans.length;
  const femaleCount = genders.female ? genders.female:0;
  const femalePct = aliveCount ? ((femaleCount / aliveCount) * 100).toFixed(1) : 0;
  
  const nationalityLabels = nationalities.map(item => item[0]);
  const nationalityValues = nationalities.map(item => item[1]);

  const citiesLabels = cities.map(item => item[0]);
  const citiesValues = cities.map(item => item[1]);



  return (
    <>
      <div className="sidebar">
        <div className="year-box">
          <label><strong>{selectedYear}</strong></label>
        </div>
        
        <div className='stats-row'>
          <div className="chart-box">
            <div className="chart-box-title"><strong>NATIONALITIES</strong></div>
          <Trends
              nationalityTrends={nationalityTrends}
              selectedYear={selectedYear}
            />
          </div>
        </div>
        <hr className="divider" />
        {/* Bar chart */}
        <div className='stats-row'>
          <div className="chart-box">
            <div className="chart-box-title"><strong>CITIES</strong></div>
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
                    margin: { t: 10, l: 85, r: 10, b: 20 },
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
              style={{ width: "100%", height: "20vh" }}
            />
            
          </div>
          </div>
          <hr className="divider" />
          <div className='stats-row'>
            <div className="stats-box">
              <div><strong>Female: </strong> {femaleCount} ({femalePct}%)</div>
              <div><strong>Artists alive: </strong> {aliveCount}</div>
              <div><strong>Nationalities: </strong>{nationalities.length} </div>
            </div>
            
            <div className="chart-box">
              <div className="chart-box-title"><strong>GENDER</strong></div>
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
                      staticPlot: false   // tüm etkileşimleri devre dışı bırakır (zoom/pan)
                  }}
                  useResizeHandler
                  style={{ width: "80%", height: "80%" }}
                />
            </div>
            
            
          </div>
          <hr className="divider" />
          <div className='stats-row'>
            <div className="info-box">
              Explore the geographic presence of artists who were alive in a given year. Scroll through time, uncover patterns, and see the rise and fall of artistic generations.
            </div>
          </div> 
          {/* <div className='stats-row'>
            <div className="info-box">
              Explore the geographic presence of artists who were alive in a given year. Scroll through time, uncover patterns, and see the rise and fall of artistic generations.
            </div>
          </div>  */}
          
      </div>
      {/* <div className="cornerbar"></div> */}
    </>
  );
}

export default Dashboard;