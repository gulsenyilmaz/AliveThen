
export function computeBounds(locations, detailMode = false) {
  if (!locations.length) return { centerLon: 0, centerLat: 0, zoom: 1 };

  const lons = locations.map(loc => loc.lon);
  const lats = locations.map(loc => loc.lat);

  const minLon = Math.min(...lons);
  const maxLon = Math.max(...lons);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);

  const lonDiff = maxLon - minLon;
  const latDiff = maxLat - minLat;
  const maxDiff = Math.max(lonDiff, latDiff);

  let zoom = 6;
  if (maxDiff > 150) zoom = 1.7;
  else if (maxDiff > 80) zoom = 2;
  else if (maxDiff > 30) zoom = 3;
  else if (maxDiff > 15) zoom = 4;
  else if (maxDiff > 8) zoom = 5;
  else zoom = 5.5;

  const centerLon = (minLon + maxLon) / 2 - (detailMode? 40/zoom : 0); 
  const centerLat = (minLat + maxLat) / 2 ; 
  console.log("Computed bounds:", {maxDiff, centerLon, centerLat, zoom });

  return { centerLon, centerLat, zoom };
}
