import { MapContainer, TileLayer, CircleMarker, Popup, Polyline } from "react-leaflet";
import { formatExpiry } from "../utils/helpers";

const requestColors = {
  CRITICAL: "#ef4444",
  URGENT: "#f97316",
  PLANNED: "#eab308",
  MATCHED: "#22c55e",
  IN_TRANSIT: "#3b82f6",
  DELIVERED: "#9ca3af",
  EXPIRED: "#4b5563",
};

export default function MapView({ requests, providers, matchInfo }) {
  return (
    <MapContainer center={[13.0827, 80.2707]} zoom={12} className="h-full w-full rounded-xl">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {requests.map((request) => (
        <CircleMarker
          key={request.id}
          center={[request.lat, request.lng]}
          pathOptions={{ color: requestColors[request.status] || requestColors[request.urgencyTier] || "#eab308" }}
          radius={request.urgencyTier === "CRITICAL" ? 10 : 8}
        >
          <Popup>
            <div className="space-y-1">
              <p className="font-semibold">{request.foodDescription || request.resourceType}</p>
              <p>{request.quantity} {request.quantityUnit || "units"} | {request.dietaryCategory || request.bloodGroup || "general"}</p>
              <p>Urgency: {(request.urgencyScore || 0).toFixed(2)}</p>
              <p>{formatExpiry(request.availableUntil)}</p>
              <p>{request.locationName}</p>
              <p>Status: {request.status}</p>
            </div>
          </Popup>
        </CircleMarker>
      ))}
      {providers.map((provider) => (
        <CircleMarker
          key={provider.id}
          center={[provider.lat, provider.lng]}
          pathOptions={{ color: "#14b8a6" }}
          radius={7}
        >
          <Popup>
            <p className="font-semibold">{provider.name}</p>
          </Popup>
        </CircleMarker>
      ))}
      {matchInfo && (
        <Polyline
          positions={[
            [matchInfo.request.lat, matchInfo.request.lng],
            [matchInfo.provider.lat, matchInfo.provider.lng],
          ]}
          pathOptions={{ color: "#22c55e", className: "dash-flow" }}
        />
      )}
    </MapContainer>
  );
}
