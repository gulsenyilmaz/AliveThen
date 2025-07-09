class ColorLibrary {

  static genderToColor(gender, opacity = 255) {
 

    switch (gender) {
      case 'female'||'q6581072':
        return [255, 157, 167, opacity];
      case 'male' || 'q6581097':
        return [78, 121, 167, opacity];
      case 'gender non-conforming' || 'non-binary':
        return [50, 50, 60, opacity];
      case 'transgender woman' || 'female (transwoman)':
        return [231, 76, 60, opacity];
      default:
        return [150, 150, 150, opacity];
    }
  }

  static ageToColor(age, gender) {
    if (age >65 ) {
        return [202, 156, 50, 0]; 
    } else {
        return this.genderToColor(gender, 0);
    }
  }

  static getLocationColorByType(type){
   
    
   switch (type) {
    case 'birth_place':
      return [39, 174, 96, 180];       // ✔ Yeşil (#27AE60)
    case 'death_place':
      return [240, 57, 43, 180];       // ✔ Kırmızı (#C0392B)
    case 'educated_at':
      return [138, 43, 226, 180];      // ✔ Mor (#9B59B6)
    case 'residence':
      return [52, 152, 219, 180];      // ✔ Mavi (#3498DB)
    case 'work_location':
      return [243, 156, 18, 180];       // ✔ Turuncu (#F39C12)
    case 'has_works_in':
      return [243, 156, 18, 180];      // ✔ Turuncu (#F39C12)
    default:
      return [75, 75, 75, 180];     // Gri (bilinmeyen)
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