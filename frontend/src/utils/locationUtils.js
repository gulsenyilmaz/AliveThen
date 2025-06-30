
export function computeBounds(locations) {
  if (!locations.length) return { centerLon: 0, centerLat: 0, zoom: 1 };

  const lons = locations.map(loc => loc.lon);
  const lats = locations.map(loc => loc.lat);

  const minLon = Math.min(...lons);
  const maxLon = Math.max(...lons);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);

  const centerLon = (minLon + maxLon) / 2;
  const centerLat = (minLat + maxLat) / 2;

  const lonDiff = maxLon - minLon;
  const latDiff = maxLat - minLat;
  const maxDiff = Math.max(lonDiff, latDiff);

  let zoom = 6;
  if (maxDiff > 60) zoom = 2;
  else if (maxDiff > 30) zoom = 3;
  else if (maxDiff > 15) zoom = 4;
  else if (maxDiff > 8) zoom = 5;
  else if (maxDiff > 4) zoom = 6;
  else if (maxDiff > 2) zoom = 7;
  else zoom = 8;

  return { centerLon, centerLat, zoom };
}
