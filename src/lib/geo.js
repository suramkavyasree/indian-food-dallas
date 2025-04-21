export function isWithinRadius(userCoords, targetCoords, radiusMiles = 10) {
    const toRad = (value) => (value * Math.PI) / 180;
    const [lat1, lon1] = userCoords;
    const [lat2, lon2] = targetCoords;
    const R = 3958.8; // Earth radius in miles
  
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
  
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance <= radiusMiles;
  }