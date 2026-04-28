import { haversineDistance } from "../utils/helpers";

export function findBestMatch(request, providers, config) {
  let eligible = providers.filter((p) => {
    if (p.status !== "available") return false;
    const distance = haversineDistance(request.lat, request.lng, p.lat, p.lng);
    if (distance > config.maxMatchRadiusKm) return false;

    if (config.id === "food_rescue") {
      if (!p.acceptedDiets?.includes(request.dietaryCategory)) return false;
      if ((p.currentCapacity || 0) < (request.quantity || 0)) return false;
    }

    if (config.id === "blood_donation") {
      const donorCanGiveTo = config.bloodCompatibility[p.bloodGroup] || [];
      if (!donorCanGiveTo.includes(request.bloodGroup)) return false;
    }

    if (config.id === "disaster_relief") {
      if (p.resourceTypes && !p.resourceTypes.includes(request.resourceType)) return false;
      if ((p.currentCapacity || 0) < (request.quantity || 0)) return false;
    }
    return true;
  });

  eligible = eligible.map((p) => {
    const distance = haversineDistance(request.lat, request.lng, p.lat, p.lng);
    const proximityScore = 1 - distance / config.maxMatchRadiusKm;
    const reliabilityScore = p.reliability || 0.5;
    const capacityScore =
      config.id === "food_rescue" || config.id === "disaster_relief"
        ? Math.min((p.currentCapacity || 0) / Math.max(request.quantity || 1, 1), 1)
        : 1;

    const matchScore = 0.4 * proximityScore + 0.3 * capacityScore + 0.3 * reliabilityScore;
    return { ...p, matchScore, distance: Number(distance.toFixed(1)) };
  });

  eligible.sort((a, b) => b.matchScore - a.matchScore);
  return eligible[0] || null;
}
