/**
 * Returns a color based on gender.
 * Female → pastel pink
 * All others → pastel blue
 */
export function ageToColor(age, gender = "Unknown", timeSinceDeath = 0) {
  if (gender === "female") {
    // Pastel pink
    return [255, 105, 180, 150+timeSinceDeath]; // light pink (RGB for LightPink)
  } else {
    // Pastel blue
    return [70, 130, 180, 150+timeSinceDeath]; // light blue (RGB for LightBlue)
  }
}