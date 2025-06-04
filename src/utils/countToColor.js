export function countToColor(count, maxCount = 50) {
    const logCount = Math.log10(count + 1); // +1 to avoid log(0)
    const logMax = Math.log10(maxCount + 1);
    const t = Math.min(logCount / logMax, 1);
    const gray = Math.round(t * 255);
    return [gray, gray, gray, 255];
  }