import { formatExpiry, formatTimeAgo } from "../utils/helpers";

const dietaryColors = {
  vegetarian: "bg-green-100 text-green-700",
  "non-vegetarian": "bg-red-100 text-red-700",
  vegan: "bg-purple-100 text-purple-700",
  jain: "bg-orange-100 text-orange-700",
  halal: "bg-blue-100 text-blue-700",
};

const statusColors = {
  PENDING: "bg-gray-100 text-gray-700",
  MATCHED: "bg-green-100 text-green-700",
  IN_TRANSIT: "bg-blue-100 text-blue-700",
  DELIVERED: "bg-green-100 text-green-700",
  EXPIRED: "bg-gray-300 text-gray-700",
};

function scoreColor(score) {
  if (score > 0.7) return "bg-red-500";
  if (score > 0.4) return "bg-orange-500";
  return "bg-green-500";
}

export default function RequestCard({ request, config, now, onFindMatch, onFocus }) {
  const resource = config.resourceTypes.find((x) => x.id === (request.resourceType || request.foodType));
  return (
    <div
      className={`rounded-xl border border-gray-100 bg-white p-3 shadow-sm transition-all duration-500 ${request.status === "MATCHED" ? "ring-2 ring-green-200" : ""}`}
      onClick={() => onFocus(request)}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <p className="line-clamp-2 text-sm font-semibold text-gray-800">
          {resource?.icon || "📍"} {request.foodDescription || request.resourceType} - {request.quantity} {request.quantityUnit || "units"}
        </p>
        <span className={`rounded-lg px-2 py-1 text-lg font-bold text-white transition-colors duration-500 ${scoreColor(request.urgencyScore || 0)}`}>
          {(request.urgencyScore || 0).toFixed(2)}
        </span>
      </div>
      <div className="mb-2 flex flex-wrap gap-2">
        {request.dietaryCategory && (
          <span className={`rounded-full px-2 py-1 text-xs font-semibold ${dietaryColors[request.dietaryCategory] || "bg-gray-100 text-gray-700"}`}>
            {request.dietaryCategory.toUpperCase()}
          </span>
        )}
        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusColors[request.status] || "bg-gray-100"}`}>
          {request.status}
        </span>
      </div>
      <p className={`text-xs font-semibold ${formatExpiry(request.availableUntil, now) === "EXPIRED" ? "text-red-600" : "text-gray-600"}`}>
        {formatExpiry(request.availableUntil, now)}
      </p>
      <p className="truncate text-xs text-gray-500">{request.locationName}</p>
      <p className="mt-1 text-xs text-gray-500">{formatTimeAgo(request.createdAt, now)}</p>
      {request.status === "PENDING" && (
        <button
          className="mt-3 w-full rounded-lg px-3 py-2 text-sm font-semibold text-white"
          style={{ backgroundColor: "var(--accent)" }}
          onClick={(e) => {
            e.stopPropagation();
            onFindMatch(request);
          }}
        >
          Find Match
        </button>
      )}
    </div>
  );
}
