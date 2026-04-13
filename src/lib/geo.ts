/**
 * Calculate distance between two GPS coordinates using the Haversine formula
 * Returns distance in kilometers
 */
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Estimate delivery price based on distance
 * Base: 500 FCFA + 200 FCFA/km
 */
export function estimateDeliveryPrice(distanceKm: number): number {
  const base = 500;
  const perKm = 200;
  return Math.round(base + distanceKm * perKm);
}

/**
 * Estimate delivery time in minutes based on distance
 * Average speed: 25 km/h in urban areas
 */
export function estimateDeliveryTime(distanceKm: number): number {
  const avgSpeedKmh = 25;
  return Math.round((distanceKm / avgSpeedKmh) * 60) + 10; // +10 min for pickup
}
