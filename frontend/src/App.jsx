import { useEffect, useMemo, useReducer, useState } from "react";
import ModuleSwitcher from "./components/ModuleSwitcher";
import MapView from "./components/MapView";
import PriorityQueue from "./components/PriorityQueue";
import NLPInput from "./components/NLPInput";
import Analytics from "./components/Analytics";
import MatchPanel from "./components/MatchPanel";
import foodConfig from "./config/food_rescue.json";
import bloodConfig from "./config/blood_donation.json";
import disasterConfig from "./config/disaster_relief.json";
import { moduleSeed } from "./data/seed";
import { withUpdatedScores } from "./engine/prioritization";
import { findBestMatch } from "./engine/matching";

const configs = {
  food_rescue: foodConfig,
  blood_donation: bloodConfig,
  disaster_relief: disasterConfig,
};

function initState() {
  return {
    activeModule: "food_rescue",
    modules: Object.fromEntries(
      Object.entries(moduleSeed).map(([id, data]) => [
        id,
        { ...data, requests: withUpdatedScores(data.requests, configs[id], data.providers) },
      ])
    ),
    matchInfo: null,
  };
}

function reducer(state, action) {
  if (action.type === "SWITCH_MODULE") return { ...state, activeModule: action.moduleId, matchInfo: null };
  if (action.type === "ADD_REQUEST") {
    const current = state.modules[state.activeModule];
    return {
      ...state,
      modules: {
        ...state.modules,
        [state.activeModule]: {
          ...current,
          requests: withUpdatedScores([action.request, ...current.requests], configs[state.activeModule], current.providers),
        },
      },
    };
  }
  if (action.type === "UPDATE_SCORES") {
    const current = state.modules[state.activeModule];
    return {
      ...state,
      modules: {
        ...state.modules,
        [state.activeModule]: {
          ...current,
          requests: withUpdatedScores(current.requests, configs[state.activeModule], current.providers),
        },
      },
    };
  }
  if (action.type === "MATCH_REQUEST") {
    const current = state.modules[state.activeModule];
    const nextRequests = current.requests.map((r) => (r.id === action.requestId ? { ...r, status: "MATCHED" } : r));
    const nextProviders = current.providers.map((p) =>
      p.id === action.provider.id ? { ...p, currentCapacity: Math.max(0, (p.currentCapacity || 0) - (action.quantity || 0)) } : p
    );
    return {
      ...state,
      matchInfo: action.matchInfo,
      modules: {
        ...state.modules,
        [state.activeModule]: {
          ...current,
          requests: withUpdatedScores(nextRequests, configs[state.activeModule], nextProviders),
          providers: nextProviders,
        },
      },
    };
  }
  return state;
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, undefined, initState);
  const [now, setNow] = useState(0);
  const [queueFilter, setQueueFilter] = useState("All");
  const [toast, setToast] = useState("");
  const activeConfig = configs[state.activeModule];
  const moduleData = state.modules[state.activeModule];

  useEffect(() => {
    document.documentElement.style.setProperty("--accent", activeConfig.accentColor);
  }, [activeConfig.accentColor]);

  useEffect(() => {
    const scoreTicker = setInterval(() => dispatch({ type: "UPDATE_SCORES" }), 10000);
    const secondTicker = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      clearInterval(scoreTicker);
      clearInterval(secondTicker);
    };
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const handleAddRequest = (form, rawText) => {
    dispatch({
      type: "ADD_REQUEST",
      request: {
        id: `${state.activeModule}_new_${Date.now()}`,
        ...form,
        rawText,
        status: "PENDING",
        urgencyTier: "URGENT",
        createdAt: new Date().toISOString(),
      },
    });
  };

  const handleFindMatch = (request) => {
    const best = findBestMatch(request, moduleData.providers, activeConfig);
    if (!best) return setToast(`No eligible ${activeConfig.entityLabels.provider} within ${activeConfig.maxMatchRadiusKm} km`);
    dispatch({ type: "MATCH_REQUEST", requestId: request.id, provider: best, quantity: request.quantity, matchInfo: { request, provider: best } });
  };

  const label = useMemo(() => activeConfig.entityLabels, [activeConfig.entityLabels]);

  return (
    <div className="h-screen overflow-hidden bg-gray-50">
      <header className="flex h-14 items-center justify-between bg-gray-900 px-4 text-white">
        <div className="flex items-center gap-2">
          <span style={{ color: "var(--accent)" }}>⬤</span>
          <p className="text-xl font-bold">LifeLink</p>
          <span className="text-sm text-gray-300">{activeConfig.name}</span>
        </div>
        <ModuleSwitcher activeModule={state.activeModule} onSwitch={(moduleId) => dispatch({ type: "SWITCH_MODULE", moduleId })} />
      </header>

      <main className="grid h-[calc(100vh-3.5rem)] grid-rows-[1fr_auto] gap-3 p-3">
        <section className="grid grid-cols-[20%_50%_30%] gap-3">
          <NLPInput config={activeConfig} onAddRequest={handleAddRequest} toast={setToast} />
          <div className="rounded-xl border border-gray-100 bg-white p-2 shadow-sm">
            <MapView requests={moduleData.requests} providers={moduleData.providers} matchInfo={state.matchInfo} />
          </div>
          <PriorityQueue
            requests={moduleData.requests}
            config={activeConfig}
            now={now}
            onFindMatch={handleFindMatch}
            onFocusRequest={() => {}}
            filter={queueFilter}
            setFilter={setQueueFilter}
          />
        </section>
        <Analytics requests={moduleData.requests} config={activeConfig} />
      </main>

      <MatchPanel
        matchInfo={state.matchInfo}
        onViewMap={() => setToast("Centered on map")}
        onNotify={() => setToast(`Notification sent to ${moduleData.volunteers.find((v) => v.status === "available")?.name || "volunteer"}`)}
      />

      {toast && <div className="fixed right-4 top-16 rounded bg-gray-900 px-3 py-2 text-sm text-white">{toast}</div>}
      <div className="fixed bottom-3 left-3 rounded bg-white/90 px-2 py-1 text-xs text-gray-600">{label.request} dashboard live</div>
    </div>
  );
}
