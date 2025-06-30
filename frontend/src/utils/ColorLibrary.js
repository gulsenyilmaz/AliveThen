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
      case 'residence':
        return [78, 121, 167, 180];
      case 'work_location':
        return [46, 204, 113, 180];
      case 'educated_at':
        return [231, 76, 60, 180];
      case 'has_works_in':
        return [231, 159, 120, 180];
      case 'birth_place':
        return [50, 76, 70, 180];
      case 'death_place':
        return [0, 0, 0, 180];
      default:
        return [150, 150, 150, 180];
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