import { calculateIsolation, calculateMatchFailure, calculateTimeDecay } from "./scoring";

export function calculateUrgencyScore(request, config, providers) {
  const weights = config.urgencyWeights;
  const td = calculateTimeDecay(request);
  const scarcityKey = request.resourceType || request.foodType || request.bloodGroup;
  const si = config.scarcityMap[scarcityKey] || 0.5;
  const iso = calculateIsolation(request, providers, config.maxMatchRadiusKm);
  const mfe = calculateMatchFailure(request);
  const st = config.sourceTrustLevels[request.sourceType] || 0.4;

  return (
    weights.time_decay * td +
    weights.scarcity * si +
    weights.isolation * iso +
    weights.match_failure * mfe +
    weights.source_trust * st
  );
}

export function withUpdatedScores(requests, config, providers) {
  return requests
    .map((request) => {
      const expired = new Date(request.availableUntil).getTime() < Date.now();
      const score = expired ? 0 : calculateUrgencyScore(request, config, providers);
      return {
        ...request,
        status: expired && request.status !== "DELIVERED" ? "EXPIRED" : request.status,
        urgencyScore: Number(score.toFixed(3)),
      };
    })
    .sort((a, b) => {
      if (a.status === "EXPIRED" && b.status !== "EXPIRED") return 1;
      if (b.status === "EXPIRED" && a.status !== "EXPIRED") return -1;
      return b.urgencyScore - a.urgencyScore;
    });
}
