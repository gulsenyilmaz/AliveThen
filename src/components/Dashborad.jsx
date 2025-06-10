import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import './Dashboard.css';

function Dashboard({humans, nationalityCounts, selectedYear}) {
  const aliveCount = humans.length;
  const femaleCount = humans.filter(a => a.Gender === "female").length;
  const femalePct = aliveCount ? ((femaleCount / aliveCount) * 100).toFixed(1) : 0;
  const sorted = Object.entries(nationalityCounts)
    .sort((a, b) => b[1] - a[1])        // Çoktan aza sırala
    .slice(0, 15);                      // En çok görünen ilk 10 ülke

  const nationalityLabels = sorted.map(([nat]) => nat);
  const nationalityValues = sorted.map(([, count]) => count);

  return (
    <>
      <div className="sidebar">
          {/* İstatistik kutucuğu */}
          <div className="stats-box">
            <div><strong>Artists alive:</strong> {aliveCount}</div>
          </div>
          <div className="stats-box">
            <div><strong>Female:</strong> {femaleCount} ({femalePct}%)</div>
          </div>
          <div className="stats-box">
            <div><strong>Countries:</strong> {Object.keys(nationalityCounts).length}</div>
          </div>
      
          {/* Bar chart */}
          <div className="stats-box">
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
      </div>
    </>
  );
}

export default Dashboard;