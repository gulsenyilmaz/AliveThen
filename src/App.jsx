import React, { useState } from "react";
import { DeckGL } from "@deck.gl/react";
import { ColumnLayer } from "@deck.gl/layers";
import Map from "react-map-gl";
import artists from "./data/Artists.json";
import { ageToColor } from "./utils/colorScale";

const INITIAL_VIEW_STATE = {
  latitude: 30,
  longitude: 0,
  zoom: 1.5,
  pitch: 20,
  bearing: 0
};

const elevationFactor = 10000;


const offsetPosition = (baseLon, baseLat, index) => {
  const angle = index * 0.8;
  const radius = 0.4 + 0.005 * index; // derece (~50km)
  return [
    baseLon + Math.cos(angle) * radius,
    baseLat + Math.sin(angle) * radius
  ];
};



function App() {
  const [selectedYear, setSelectedYear] = useState(1940);

  const country_coords = {
    "American": [37.0902, -95.7129],
    "Spanish": [40.4637, -3.7492],
    "Danish": [56.2639, 9.5018],
    "Italian": [41.8719, 12.5674],
    "French": [46.6034, 1.8883],
    "Estonian": [58.5953, 25.0136],
    "Mexican": [23.6345, -102.5528],
    "Swedish": [60.1282, 18.6435],
    "Israeli": [31.0461, 34.8516],
    "British": [55.3781, -3.4360],
    "Finnish": [61.9241, 25.7482],
    "Polish": [51.9194, 19.1451],
    "Palestinian": [31.9522, 35.2332],
    "Japanese": [36.2048, 138.2529],
    "Guatemalan": [15.7835, -90.2308],
    "Colombian": [4.5709, -74.2973],
    "Romanian": [45.9432, 24.9668],
    "Russian": [61.5240, 105.3188],
    "German": [51.1657, 10.4515],
    "Argentine": [-38.4161, -63.6167],
    "Argentinian": [-38.4161, -63.6167],
    "Kuwaiti": [29.3117, 47.4818],
    "Belgian": [50.5039, 4.4699],
    "Dutch": [52.1326, 5.2913],
    "Norwegian": [60.4720, 8.4689],
    "Chilean": [-35.6751, -71.5430],
    "Swiss": [46.8182, 8.2275],
    "Costa Rican": [9.7489, -83.7534],
    "Czech": [49.8175, 15.4730],
    "Brazilian": [-14.2350, -51.9253],
    "Austrian": [47.5162, 14.5501],
    "Canadian": [56.1304, -106.3468],
    "Australian": [-25.2744, 133.7751],
    "Ukrainian": [48.3794, 31.1656],
    "Hungarian": [47.1625, 19.5033],
    "Haitian": [18.9712, -72.2852],
    "Congolese": [-4.0383, 21.7587],
    "Bolivian": [-16.2902, -63.5887],
    "Cuban": [21.5218, -77.7812],
    "Slovenian": [46.1512, 14.9955],
    "Portuguese": [39.3999, -8.2245],
    "Indian": [20.5937, 78.9629],
    "Peruvian": [-9.1899, -75.0152],
    "Icelandic": [64.9631, -19.0208],
    "Irish": [53.4129, -8.2439],
    "Croatian": [45.1000, 15.2000],
    "Uruguayan": [-32.5228, -55.7658],
    "Slovak": [48.6690, 19.6990],
    "Greek": [39.0742, 21.8243],
    "Serbian": [44.0165, 21.0059],
    "Chinese": [35.8617, 104.1954],
    "Venezuelan": [6.4238, -66.5897],
    "Native American": [39.8283, -98.5795],
    "Turkish": [38.9637, 35.2433],
    "Panamanian": [8.5380, -80.7821],
    "Algerian": [28.0339, 1.6596],
    "Ecuadorian": [-1.8312, -78.1834],
    "South African": [-30.5595, 22.9375],
    "Iranian": [32.4279, 53.6880],
    "Puerto Rican": [18.2208, -66.5901],
    "Korean": [36.5, 127.5],
    "Canadian Inuit": [66.0, -96.0],
    "Paraguayan": [-23.4425, -58.4438],
    "Luxembourger": [49.8153, 6.1296],
    "Nicaraguan": [12.8654, -85.2072],
    "Zimbabwean": [-19.0154, 29.1549],
    "Moroccan": [31.7917, -7.0926],
    "Tanzanian": [-6.3690, 34.8888],
    "Bulgarian": [42.7339, 25.4858],
    "Tunisian": [33.8869, 9.5375],
    "Sudanese": [12.8628, 30.2176],
    "Taiwanese": [23.6978, 120.9605],
    "Ethiopian": [9.1450, 40.4897],
    "Yugoslavian": [44.0, 21.0],
    "Scottish": [56.4907, -4.2026],
    "Latvian": [56.8796, 24.6032],
    "Uzbekistani": [41.3775, 64.5853],
    "Azerbaijani": [40.1431, 47.5769],
    "Senegalese": [14.4974, -14.4524],
    "Thai": [15.8700, 100.9925],
    "New Zealander": [-40.9006, 174.8860],
    "Lithuanian": [55.1694, 23.8813],
    "Pakistani": [30.3753, 69.3451],
    "Jamaican": [18.1096, -77.2975],
    "Bahamian": [25.0343, -77.3963],
    "Bosnian": [43.9159, 17.6791],
    "Malian": [17.5707, -3.9962],
    "Czechoslovakian": [49.8175, 15.4730],
    "Georgian": [42.3154, 43.3569],
    "Egyptian": [26.8206, 30.8025],
    "Kenyan": [0.0236, 37.9062],
    "Emirati": [23.4241, 53.8478],
    "Nigerian": [9.0820, 8.6753],
    "Cypriot": [35.1264, 33.4299],
    "Albanian": [41.1533, 20.1683],
    "Ivorian": [7.5399, -5.5471],
    "Malaysian": [4.2105, 101.9758],
    "Singaporean": [1.3521, 103.8198],
    "Namibian": [-22.9576, 18.4904],
    "Cambodian": [12.5657, 104.9910],
    "Ghanaian": [7.9465, -1.0232],
    "Afghan": [33.9391, 67.7100],
    "Lebanese": [33.8547, 35.8623],
    "Kyrgyz": [41.2044, 74.7661],
    "English": [52.3555, -1.1743],
    "Vietnamese": [14.0583, 108.2772],
    "Anmatyerr [Australian]": [-25.2744, 133.7751],
    "Ugandan": [1.3733, 32.2903],
    "Cameroonian": [7.3697, 12.3547],
    "Welsh": [52.1307, -3.7837],
    "Catalan": [41.5912, 1.5209],
    "Filipino": [12.8797, 121.7740],
    "South Korean": [35.9078, 127.7669],
    "Macedonian": [41.6086, 21.7453],
    "Sahrawi": [24.2155, -12.8858],
    "Syrian": [34.8021, 38.9968],
    "Mozambican": [-18.6657, 35.5296],
    "Bangladeshi": [23.6850, 90.3563],
    "Coptic": [26.8206, 30.8025],
    "Persian": [32.4279, 53.6880],
    "Burkinabé": [12.2383, -1.5616],
    "Beninese": [9.3077, 2.3158],
    "Sierra Leonean": [8.4606, -11.7799],
    "Sri Lankan": [7.8731, 80.7718],
    "Salvadoran": [13.7942, -88.8965],
    "Iraqi": [33.2232, 43.6793],
    "Trinidad and Tobagonian": [10.6918, -61.2225],
    "Indonesian": [-0.7893, 113.9213],
    "Ivatan": [20.9292, 121.9514],
    "Nepali": [28.3949, 84.1240],
    "Oneida": [43.0786, -75.7697],
    "Caribbean": [16.9724, -62.1256],
    "Spirit Lake Dakota/Cheyenne River Lakota": [46.0, -100.5],
    "Member of Wood Mountain Lakota First Nations": [49.5, -107.5],
    "American, born Mexico.": [37.0902, -95.7129],
    "American, born Eritrea": [37.0902, -95.7129]
};
  const counters = {};

  // Yıla göre yaşayan sanatçılar
  const data = artists
  .filter(a => selectedYear >= a.BeginDate && selectedYear <= a.EndDate && a.BeginDate !=0)
  .map(a => {
    const nationality = a.Nationality || "Unknown";
    const base = country_coords[nationality] || [0, 0];

    if (!counters[nationality]) counters[nationality] = 0;

    const [lon, lat] = base;
    const [lonOffset, latOffset] = offsetPosition(lon, lat, counters[nationality]);
    counters[nationality]++;

    return {
      name: a.DisplayName,
      position: [latOffset, lonOffset],
      elevation: (selectedYear - a.BeginDate) * elevationFactor
    };
  });

  const columnLayer = new ColumnLayer({
    id: "artist-boxes",
    data,
    diskResolution: 12,
    radius: 10000,
    extruded: true,
    pickable: true,
    elevationScale: 1,
    getPosition: d => d.position,
    getElevation: d => d.elevation,
    getFillColor: d => ageToColor(d.elevation / elevationFactor)
  });

  return (
    <div>
      {/* Slider - Üstte, sabit pozisyon */}
      <div style={{
        position: "absolute",
        top: 20,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 10,
        backgroundColor: "rgba(30, 43, 36, 0.67)",
        padding: "0.5rem 1rem",
        borderRadius: "8px"
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
          style={{ width: "300px", color: "#007bff" }}
        />
      </div>
      {/* Harita */}
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={[columnLayer]}
        getTooltip={({ object }) =>
          object ? {
            text: `${object.name}\nAge: ${object.elevation / elevationFactor}`,
            style: { fontSize: "14px", color: "white" }
          } : null
        }
      >
        <Map
          mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
          mapStyle="mapbox://styles/mapbox/light-v11"
        />
      </DeckGL>
    </div>
  );
}

export default App;