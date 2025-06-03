/**
 * Returns a box color based on the artist's age.
 * Younger artists → vivid green
 * Older artists → pale yellow
 */
export function ageToColor(age, maxAge = 100) {
    const clampedAge = Math.min(age, maxAge);
    const t = clampedAge / maxAge;  // 0 → genç, 1 → yaşlı

    const r = Math.round((1 - t) * 80 + t * 50);
    const g = Math.round((1 - t) * 220 + t * 50);
    const b = Math.round((1 - t) * 120 + t * 50);

    return [r, g, b];
  }