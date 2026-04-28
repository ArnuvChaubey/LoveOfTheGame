const locations = [
  ["Adyar", 13.0067, 80.2572],
  ["T. Nagar", 13.0418, 80.2341],
  ["Anna Nagar", 13.0878, 80.2102],
  ["Mylapore", 13.0341, 80.2683],
  ["Velachery", 12.975, 80.2212],
  ["Tambaram", 12.9249, 80.1],
  ["Guindy", 13.0105, 80.2209],
  ["Nungambakkam", 13.0604, 80.2496],
  ["Besant Nagar", 13.0003, 80.2668],
  ["Thiruvanmiyur", 12.983, 80.2594],
  ["Porur", 13.0385, 80.1548],
  ["Chromepet", 12.9516, 80.1462],
  ["Sholinganallur", 12.8996, 80.2269],
  ["OMR", 12.9165, 80.2292],
  ["ECR", 12.95, 80.26],
  ["Kodambakkam", 13.0524, 80.2211],
];

const mins = (m) => new Date(Date.now() + m * 60000).toISOString();
const minsAgo = (m) => new Date(Date.now() - m * 60000).toISOString();

function venueName(i) {
  const names = [
    "Saravana Bhavan T. Nagar",
    "Wedding Hall Adyar",
    "Hotel Raintree",
    "Corporate Canteen Guindy",
    "Zomato Kitchen OMR",
  ];
  return names[i % names.length];
}

export const foodRequests = Array.from({ length: 25 }).map((_, i) => {
  const [locationName, lat, lng] = locations[i % locations.length];
  const urgencyTier = i < 5 ? "CRITICAL" : i < 13 ? "URGENT" : i < 23 ? "PLANNED" : "INFORMATIONAL";
  const foodType = i < 13 ? "cooked_meal" : i < 18 ? "raw_ingredients" : i < 23 ? "packaged_food" : "beverages";
  const dietaryCategory = i < 15 ? "vegetarian" : i < 21 ? "non-vegetarian" : i < 24 ? "vegan" : "jain";
  const statuses = [...Array(15).fill("PENDING"), ...Array(5).fill("MATCHED"), ...Array(3).fill("IN_TRANSIT"), ...Array(2).fill("DELIVERED")];
  const deadlineOffsets = i < 5 ? 20 + i * 8 : i < 13 ? 90 + i * 10 : i < 23 ? 220 + i * 12 : 360 + i * 10;
  return {
    id: `food_req_${i + 1}`,
    rawText: `${10 + i * 5} plates ${foodType.replace("_", " ")} available at ${venueName(i)}, ${locationName}. Pickup before ${new Date(Date.now() + deadlineOffsets * 60000).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false })}. Contact 98${String(76543210 + i).slice(-8)}`,
    foodType,
    resourceType: foodType,
    foodDescription: i % 2 === 0 ? "Biryani + sides" : "Idli / meals combo",
    quantity: 20 + (i % 8) * 10,
    quantityUnit: i % 3 === 0 ? "kg" : "servings",
    dietaryCategory,
    lat,
    lng,
    locationName,
    availableUntil: mins(deadlineOffsets),
    createdAt: minsAgo([5, 10, 15, 20, 30, 45, 60, 90, 120][i % 9]),
    status: statuses[i],
    sourceType: ["verified_restaurant", "registered_ngo", "known_donor", "unverified"][i % 4],
    urgencyTier,
    contactNumber: `98765${String(40000 + i).slice(-5)}`,
  };
});

export const foodProviders = [
  "Blue Cross Night Shelter",
  "Banyan Academy Shelter",
  "Corporation Night Shelter Triplicane",
  "Missionaries of Charity Nungambakkam",
  "Salvation Army Shelter Egmore",
  "CHAD Community Kitchen CMC Vellore",
  "Feeding India Hub Velachery",
  "Robin Hood Army Depot Anna Nagar",
  "Agaram Community Kitchen",
  "Noon Meal Center Mylapore",
  "Hope Shelter Tambaram",
  "Urban Relief Center Guindy",
  "People Care Depot Porur",
  "Care Bridge Sholinganallur",
  "Anbu Shelter Kodambakkam",
].map((name, i) => {
  const [locationName, lat, lng] = locations[(i + 2) % locations.length];
  return {
    id: `food_provider_${i + 1}`,
    name,
    lat,
    lng,
    type: i % 3 === 0 ? "shelter" : i % 3 === 1 ? "community_kitchen" : "ngo_depot",
    acceptedDiets: ["vegetarian", "vegan", ...(i % 2 ? ["non-vegetarian"] : []), ...(i % 5 ? [] : ["jain"])],
    currentCapacity: 60 + i * 10,
    maxCapacity: 150 + i * 20,
    reliability: 0.55 + (i % 6) * 0.07,
    status: i % 8 === 0 ? "full" : i % 11 === 0 ? "closed" : "available",
    contactName: `Coordinator ${i + 1}`,
    contactNumber: `90000${String(10000 + i).slice(-5)}`,
    locationName,
  };
});

export const volunteers = Array.from({ length: 10 }).map((_, i) => {
  const [locationName, lat, lng] = locations[(i + 4) % locations.length];
  const vehicleType = ["bike", "car", "van", null][i % 4];
  return {
    id: `vol_${i + 1}`,
    name: `Volunteer ${i + 1}`,
    lat,
    lng,
    hasVehicle: Boolean(vehicleType),
    vehicleType,
    status: ["available", "busy", "offline"][i % 3],
    reliability: 0.6 + (i % 5) * 0.08,
    lastActiveAt: minsAgo(5 + i * 7),
    locationName,
  };
});

export const bloodRequests = Array.from({ length: 10 }).map((_, i) => {
  const [locationName, lat, lng] = locations[i % locations.length];
  return {
    id: `blood_req_${i + 1}`,
    resourceType: ["whole_blood", "plasma", "platelets"][i % 3],
    bloodGroup: ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+", "O-", "A+"][i],
    quantity: 1 + (i % 3),
    quantityUnit: "units",
    locationName,
    lat,
    lng,
    availableUntil: mins(60 + i * 40),
    createdAt: minsAgo(8 + i * 12),
    status: i < 6 ? "PENDING" : i < 8 ? "MATCHED" : "DELIVERED",
    sourceType: ["verified_hospital", "registered_ngo", "known_user", "unverified"][i % 4],
    urgencyTier: i < 3 ? "CRITICAL" : i < 7 ? "URGENT" : "PLANNED",
    contactNumber: `90123${String(11111 + i).slice(-5)}`,
    rawText: `Need ${1 + (i % 3)} units ${["O-", "A+", "B-", "AB+"][i % 4]} at ${locationName} hospital within ${2 + i} hours.`,
  };
});

export const bloodProviders = Array.from({ length: 8 }).map((_, i) => {
  const [locationName, lat, lng] = locations[(i + 3) % locations.length];
  return {
    id: `blood_provider_${i + 1}`,
    name: `Donor ${i + 1}`,
    bloodGroup: ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"][i],
    lat,
    lng,
    status: i % 6 === 0 ? "busy" : "available",
    reliability: 0.65 + (i % 4) * 0.08,
    currentCapacity: 1,
    locationName,
  };
});

export const disasterRequests = Array.from({ length: 10 }).map((_, i) => {
  const [locationName, lat, lng] = locations[(i + 5) % locations.length];
  const resourceType = ["drinking_water", "food_packets", "medicine", "shelter", "clothing"][i % 5];
  return {
    id: `disaster_req_${i + 1}`,
    resourceType,
    quantity: 20 + i * 8,
    quantityUnit: resourceType === "drinking_water" ? "liters" : "packets",
    locationName,
    lat,
    lng,
    availableUntil: mins(180 + i * 60),
    createdAt: minsAgo(20 + i * 10),
    status: i < 7 ? "PENDING" : i < 9 ? "IN_TRANSIT" : "DELIVERED",
    sourceType: ["verified_government", "registered_ngo", "field_worker", "unverified"][i % 4],
    urgencyTier: i < 3 ? "CRITICAL" : i < 8 ? "URGENT" : "PLANNED",
    contactNumber: `91234${String(22222 + i).slice(-5)}`,
    rawText: `Flood relief needed in ${locationName}. Need ${20 + i * 8} ${resourceType.replace("_", " ")} urgently.`,
  };
});

export const disasterProviders = Array.from({ length: 8 }).map((_, i) => {
  const [locationName, lat, lng] = locations[(i + 1) % locations.length];
  return {
    id: `disaster_provider_${i + 1}`,
    name: `Relief Team ${i + 1}`,
    lat,
    lng,
    status: i % 7 === 0 ? "full" : "available",
    reliability: 0.68 + (i % 5) * 0.06,
    currentCapacity: 120 + i * 20,
    resourceTypes: ["drinking_water", "food_packets", "medicine", "shelter", "clothing"].filter((_, idx) => (idx + i) % 2 === 0),
    locationName,
  };
});

export const moduleSeed = {
  food_rescue: { requests: foodRequests, providers: foodProviders, volunteers },
  blood_donation: { requests: bloodRequests, providers: bloodProviders, volunteers },
  disaster_relief: { requests: disasterRequests, providers: disasterProviders, volunteers },
};
