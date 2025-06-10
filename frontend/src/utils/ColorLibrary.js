class ColorLibrary {

  static genderToColor(gender, timeSinceDeath = 0) {
    if (gender === "female") {
    // Pastel pink
        return [255, 105, 180, 150+timeSinceDeath]; // light pink (RGB for LightPink)
    } else {
        // Pastel blue
        return [70, 130, 180, 150+timeSinceDeath]; // light blue (RGB for LightBlue)
    }
  }

  static ageToColor(age, timeSinceDeath = 0) {
    if (age >70  || timeSinceDeath <10) {
    // Pastel pink
        return [202, 156, 50, 0]; // light pink (RGB for LightPink)
    } else {
        // Pastel blue
        return [70, 130, 180, 0]; // light blue (RGB for LightBlue)
    }
  }

  static countToColor(count) {
    // başka bir renk fonksiyonu
  }
}

export default ColorLibrary;