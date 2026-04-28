const CHENNAI_FALLBACK = {
  adyar: [13.0067, 80.2572],
  "t. nagar": [13.0418, 80.2341],
  "anna nagar": [13.0878, 80.2102],
  mylapore: [13.0341, 80.2683],
  velachery: [12.975, 80.2212],
  tambaram: [12.9249, 80.1000],
  guindy: [13.0105, 80.2209],
  nungambakkam: [13.0604, 80.2496],
  "besant nagar": [13.0003, 80.2668],
  thiruvanmiyur: [12.983, 80.2594],
  porur: [13.0385, 80.1548],
  chromepet: [12.9516, 80.1462],
  sholinganallur: [12.8996, 80.2269],
  omr: [12.9165, 80.2292],
  ecr: [12.95, 80.26],
  kodambakkam: [13.0524, 80.2211],
};

export async function geocodeLocation(locationText) {
  if (!locationText) return { lat: 13.0827, lng: 80.2707 };
  const text = locationText.toLowerCase();
  const key = Object.keys(CHENNAI_FALLBACK).find((k) => text.includes(k));
  if (key) {
    const [lat, lng] = CHENNAI_FALLBACK[key];
    return { lat, lng };
  }
  return { lat: 13.0827 + Math.random() * 0.08, lng: 80.2707 + Math.random() * 0.08 };
}
