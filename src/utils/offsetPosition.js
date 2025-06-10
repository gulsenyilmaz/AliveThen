
export function offsetFibonacciPosition(baseLon, baseLat, index) {
    const goldenAngle = 2.39996; // ~137.5° in radians
    const radius = 0.25 * Math.sqrt(index);  // sqrt büyüme ile gevşek spiral
    const angle = index * goldenAngle;
  
    const lon = baseLon + Math.cos(angle) * radius;
    const lat = baseLat + Math.sin(angle) * radius * 1.2; // en-boy farkı için biraz dikey esneme
  
    return [lon, lat];
  }

  /*export function offsetSpiralPosition(baseLon, baseLat, index) {
    const angle = index * 0.5; // dönüş hızı
    const radius = 0.01* index; // lineer büyüyen spiral
  
    const lon = baseLon + Math.cos(angle) * radius;
    const lat = baseLat + Math.sin(angle) * radius*1.2;
  
    return [lon, lat];
  }*/