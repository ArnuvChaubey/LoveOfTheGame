import { motion, AnimatePresence } from "framer-motion";

export default function MatchPanel({ matchInfo, onViewMap, onNotify }) {
  return (
    <AnimatePresence>
      {matchInfo && (
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          className="fixed bottom-4 left-1/2 z-[1000] w-[820px] -translate-x-1/2 rounded-xl border border-gray-200 bg-white p-4 shadow-2xl"
        >
          <div className="flex items-center justify-between">
            <p className="font-bold text-gray-900">Match Found</p>
            <p className="text-sm text-gray-600">{matchInfo.provider.distance} km away</p>
          </div>
          <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div className="rounded-lg bg-gray-50 p-3 text-sm">{matchInfo.request.locationName}</div>
            <div className="text-2xl text-green-600">→</div>
            <div className="rounded-lg bg-gray-50 p-3 text-sm">{matchInfo.provider.name}</div>
          </div>
          <div className="mt-3 flex gap-2">
            <button className="rounded bg-gray-900 px-3 py-2 text-sm text-white" onClick={onNotify}>
              Notify Volunteer
            </button>
            <button className="rounded border px-3 py-2 text-sm" onClick={onViewMap}>
              View on Map
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
