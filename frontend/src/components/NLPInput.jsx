import { useMemo, useState } from "react";
import { extractWithGemini } from "../utils/gemini";
import { geocodeLocation } from "../utils/geocoding";

const examplesByModule = {
  food_rescue: [
    "50 plates chicken biryani left over from wedding reception at Kalyana Mandapam, Adyar. Closing by 11 PM. Contact 9876543210",
    "Saravana Bhavan T Nagar has 30 plates idli sambar and 20 plates dosa available. Can keep warm till 10:30 PM. Veg only.",
    "URGENT: 200 meals from corporate event at Tidel Park, OMR. Mix veg and non-veg. Must be picked up by 9 PM sharp or will be thrown away.",
  ],
  blood_donation: [
    "Need O- blood urgently in Apollo Greams Road, within 2 hours. Contact 9876543210",
    "3 units A+ needed for surgery in Velachery hospital by tonight.",
    "Platelets donor needed in Mylapore in next 6 hours.",
  ],
  disaster_relief: [
    "Need drinking water in Tambaram flood zone, 300 liters urgently.",
    "Food packets required in Chromepet camp for 60 families.",
    "Medicine kits needed in ECR shelter before midnight.",
  ],
};

export default function NLPInput({ config, onAddRequest, toast }) {
  const [rawText, setRawText] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(null);

  const examples = useMemo(() => examplesByModule[config.id] || [], [config.id]);

  const process = async () => {
    setLoading(true);
    try {
      const extracted = await extractWithGemini(rawText, config);
      const loc = await geocodeLocation(extracted.location_text || extracted.hospital);
      setForm({
        resourceType: extracted.food_type || extracted.resource_type || "cooked_meal",
        foodDescription: extracted.food_description || extracted.hospital || extracted.resource_type,
        quantity: extracted.quantity || extracted.units_needed || 10,
        quantityUnit: extracted.quantity_unit || "servings",
        dietaryCategory: extracted.dietary_category || "vegetarian",
        locationName: extracted.location_text || extracted.hospital || "Chennai",
        availableUntil: new Date(Date.now() + (extracted.deadline_hours ? extracted.deadline_hours * 3600000 : 2 * 3600000)).toISOString(),
        sourceType: Object.keys(config.sourceTrustLevels)[0],
        contactNumber: extracted.contact || "",
        lat: loc.lat,
        lng: loc.lng,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown Gemini error";
      toast(`Gemini failed: ${message}`);
      setForm({
        resourceType: config.resourceTypes[0].id,
        foodDescription: "",
        quantity: 10,
        quantityUnit: "servings",
        dietaryCategory: config.dietaryCategories?.[0] || "vegetarian",
        locationName: "Chennai",
        availableUntil: new Date(Date.now() + 2 * 3600000).toISOString(),
        sourceType: Object.keys(config.sourceTrustLevels)[0],
        contactNumber: "",
        lat: 13.0827,
        lng: 80.2707,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-bold text-gray-900">NLP Intake</h2>
      <textarea
        className="mt-3 h-28 w-full rounded-lg border border-gray-200 p-2 text-sm"
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
        placeholder="Paste a WhatsApp message, SMS, or any text describing surplus food..."
      />
      <button
        className="mt-3 w-full rounded-lg px-3 py-2 text-sm font-semibold text-white"
        style={{ backgroundColor: "var(--accent)" }}
        onClick={process}
        disabled={!rawText || loading}
      >
        {loading ? "Processing..." : "Process with Gemini"}
      </button>
      <div className="mt-3 space-y-2">
        {examples.map((example) => (
          <button key={example} className="w-full rounded border border-gray-200 p-2 text-left text-xs" onClick={() => setRawText(example)}>
            {example}
          </button>
        ))}
      </div>
      {form && (
        <div className="mt-4 space-y-2 text-sm">
          <input className="w-full rounded border p-2" value={form.foodDescription} onChange={(e) => setForm((x) => ({ ...x, foodDescription: e.target.value }))} />
          <div className="flex gap-2">
            <input className="w-1/2 rounded border p-2" type="number" value={form.quantity} onChange={(e) => setForm((x) => ({ ...x, quantity: Number(e.target.value) }))} />
            <input className="w-1/2 rounded border p-2" value={form.quantityUnit} onChange={(e) => setForm((x) => ({ ...x, quantityUnit: e.target.value }))} />
          </div>
          <button
            className="w-full rounded-lg bg-gray-900 px-3 py-2 text-white"
            onClick={() => onAddRequest(form, rawText)}
          >
            Confirm & Add to Queue
          </button>
        </div>
      )}
    </div>
  );
}
