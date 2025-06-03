/**
 * Returns a box color based on the artist's age.
 * Younger artists → vivid green
 * Older artists → pale yellow
 */
export function ageToColor(age, maxAge = 100) {
    const clampedAge = Math.min(age, maxAge);
  
    const r = 50 + clampedAge * 1.9;   // 50 → 240
    const g = 200 - clampedAge * 0.7;  // 200 → 130
    const b = 50 + clampedAge * 0.5;   // 50 → 100
  
    return [Math.round(r), Math.round(g), Math.round(b)];
  }