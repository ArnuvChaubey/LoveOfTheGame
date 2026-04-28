import { clamp, haversineDistance } from "../utils/helpers";

export function calculateTimeDecay(request) {
  const deadline = new Date(request.availableUntil).getTime();
  const createdAt = new Date(request.createdAt).getTime();
  const totalMs = Math.max(deadline - createdAt, 1);
  const remainingMs = deadline - Date.now();
  const ratio = Math.max(0, remainingMs / totalMs);
  const k = 3.0;
  return Math.min(1, Math.exp(k * (1 - ratio)) / Math.exp(k));
}

export function findNearestProviderDistance(location, providers) {
  if (!providers?.length) return Infinity;
  const { lat, lng } = location;
  return providers.reduce((best, provider) => {
    const dist = haversineDistance(lat, lng, provider.lat, provider.lng);
    return Math.min(best, dist);
  }, Infinity);
}

export function calculateIsolation(request, providers, maxRadius) {
  const nearestDistance = findNearestProviderDistance(
    { lat: request.lat, lng: request.lng },
    providers.filter((p) => p.status === "available")
  );
  if (!Number.isFinite(nearestDistance)) return 1;
  return clamp(nearestDistance / maxRadius);
}

export function calculateMatchFailure(request) {
  const minutesUnmatched = (Date.now() - new Date(request.createdAt).getTime()) / 60000;
  const escalationCeiling = 120;
  return clamp(minutesUnmatched / escalationCeiling);
}
