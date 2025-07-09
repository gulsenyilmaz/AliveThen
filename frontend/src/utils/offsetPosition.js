
export function offsetFibonacciPosition(lon, lat, index,  zoom = 1.5) {
  const angle = index * 2.39996;
  const radius = 0.05 * Math.sqrt(index);
  const spreadFactor = Math.min(0.3, 1.5 / 10);

  const zoomFactor = Math.max(1, 2 * zoom); // daha yakınsa daha az yay
  const newLon = lon + radius * spreadFactor * zoomFactor * Math.cos(angle);
  const newLat = lat + radius * spreadFactor * zoomFactor * Math.sin(angle);

  return [newLon, newLat];
}

export function offsetStackedCentered(lon, lat, index, total = 1, direction = 'vertical') {
  const spacing = 0.04;
  const offset = (index - (total - 1) / 2) * spacing;

  if (direction === 'vertical') {
    return [lon, lat - offset];
  } else {
    return [lon + offset, lat];
  }
}

  /*export function offsetSpiralPosition(baseLon, baseLat, index) {
    const angle = index * 0.5; // dönüş hızı
    const radius = 0.01* index; // lineer büyüyen spiral
  
    const lon = baseLon + Math.cos(angle) * radius;
    const lat = baseLat + Math.sin(angle) * radius*1.2;
  
    return [lon, lat];
  }*/