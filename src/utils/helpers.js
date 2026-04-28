export function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatTimeAgo(timestamp, now = Date.now()) {
  const value = Math.max(0, now - new Date(timestamp).getTime());
  const min = Math.floor(value / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  return `${Math.floor(min / 60)}h ${min % 60}m ago`;
}

export function formatExpiry(target, now = Date.now()) {
  const diff = new Date(target).getTime() - now;
  if (diff <= 0) return "EXPIRED";
  const min = Math.floor(diff / 60000);
  const sec = Math.floor((diff % 60000) / 1000);
  if (min >= 60) return `Expires in ${Math.floor(min / 60)}h ${min % 60}m`;
  return `Expires in ${min}m ${sec}s`;
}

export function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}
