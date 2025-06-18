import React, { useRef, useEffect } from "react";
import Plot from "react-plotly.js";
import "./Trends.css";

const Trends = ({ nationalityTrends,selectedYear }) => {
  if (!nationalityTrends || Object.keys(nationalityTrends).length === 0) return null;

  const decades = Object.values(nationalityTrends)[0]
  ? Object.keys(Object.values(nationalityTrends)[0])
      .map(d => parseInt(d))
      .filter(d => d <= selectedYear)
  : [];

const traces = Object.entries(nationalityTrends).map(([nationality, data]) => ({
  x: decades.map(d => d.toString()),
  y: decades.map(decade => data[decade.toString()] || 0),
  type: "scatter",
  mode: "lines",
  name: nationality
}));

// const allDecades = Object.keys(Object.values(nationalityTrends)[0]);

// const start = parseInt(allDecades[0]);
// const end = parseInt(allDecades[allDecades.length - 1]);
// const widthPercent = ((selectedYear - start) * 100) / (end - start);
// const widthPercentString = widthPercent+"%";

// const plotRef = useRef(null);
// useEffect(() => {
//   if (plotRef.current) {
//     // Plotly.resize çağrısı
//     window.dispatchEvent(new Event("resize"));
//   }
// }, [selectedYear]);

  return (
    <div className="trends-panel">
        <div className="trends-chart">
            {/* <div className="trends-chart" style={{ width: widthPercentString, height: "100%" }}> */}
      
            <Plot
            // ref={plotRef}
            data={traces}
            layout={{
                showlegend: false,
                margin: { t: 0, l: 0, r: 0, b: 0 },
                hovermode: 'x unified',
                dragmode: false,  // Zoom'u engeller
                xaxis: {
                showspikes: true,
                showgrid: false,
                spikemode: 'across+toaxis',
                spikesnap: 'cursor',
                spikedash: 'solid',
                spikecolor: '#4682B4',
                spikethickness: 4,
                tickfont: {
                                    color: "gray"
                                },
                },
                spikedistance: -1,
                hoverdistance: 20,
                yaxis: {
                  showticklabels: false,
                  showgrid: false,
                  showline: false,
                  zeroline: false,
                },
                hoverlabel: {
                  font: { color: "white" },
                  bgcolor: "rgba(0, 0, 0, 0.6)",
                  bordercolor: "transparent"
                },
                paper_bgcolor: 'rgba(0, 0, 0, 0)',
                plot_bgcolor: 'rgba(0, 0, 0, 0)'
            }}
            config={{
                displayModeBar: false,
                staticPlot: false   // tüm etkileşimleri devre dışı bırakır (zoom/pan)
            }}
            useResizeHandler={false}
            style={{ width: "100%", height: "100%" }}
            />
        </div>
    </div>
  );
};

export default Trends;
