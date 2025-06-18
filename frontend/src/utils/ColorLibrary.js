class ColorLibrary {

  static genderToColor(gender, opacity = 180) {
    if (gender === "female") {
        // Pastel pink
        return [255, 157, 167, opacity]; // light pink (RGB for LightPink)
    } else {
        // Pastel blue
        return [78, 121, 167, opacity]; // light blue (RGB for LightBlue)
    }
  }

  static ageToColor(age, gender) {
    if (age >65 ) {
        return [202, 156, 50, 0]; 
    } else {
        return this.genderToColor(gender, 0);
    }
  }

  static countToColor(count, maxCount = 50) {
    const logCount = Math.log10(count + 1); // +1 to avoid log(0)
    const logMax = Math.log10(maxCount + 1);
    const t = Math.min(logCount / logMax, 1);
    const gray = Math.round(t * 255);
    return [gray, gray, gray, 255];
  }
}

export default ColorLibrary;