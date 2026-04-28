import { motion, AnimatePresence } from "framer-motion";
import RequestCard from "./RequestCard";

export default function PriorityQueue({
  requests,
  config,
  now,
  onFindMatch,
  onFocusRequest,
  filter,
  setFilter,
}) {
  const filtered = requests.filter((r) => {
    if (filter === "Critical") return r.urgencyTier === "CRITICAL";
    if (filter === "Urgent") return r.urgencyTier === "URGENT";
    if (filter === "Matched") return r.status === "MATCHED";
    return true;
  });

  return (
    <div className="flex h-full flex-col rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className="border-b border-gray-100 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Priority Queue</h2>
          <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold">{filtered.length}</span>
        </div>
        <div className="mt-3 flex gap-2 text-xs">
          {["All", "Critical", "Urgent", "Matched"].map((tab) => (
            <button
              key={tab}
              className={`rounded-full px-2 py-1 ${filter === tab ? "text-white" : "bg-gray-100 text-gray-700"}`}
              style={filter === tab ? { backgroundColor: "var(--accent)" } : {}}
              onClick={() => setFilter(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {!filtered.length && <p className="py-12 text-center text-sm text-gray-500">No active requests</p>}
        <AnimatePresence>
          {filtered.map((request) => (
            <motion.div key={request.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <RequestCard
                request={request}
                config={config}
                now={now}
                onFindMatch={onFindMatch}
                onFocus={onFocusRequest}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
