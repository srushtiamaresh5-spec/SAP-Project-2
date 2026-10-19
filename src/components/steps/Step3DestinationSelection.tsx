import React, { useState } from 'react';
import { 
  Compass, 
  MapPin, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  TrendingUp, 
  AlertCircle,
  Truck,
  IndianRupee,
  Navigation
} from 'lucide-react';
import { BatchItem, CandidateDestination } from '../../types/supplyChain';

interface Step3Props {
  activeBatch: BatchItem;
  onSelectDestination: (destId: string) => void;
  onProceedToStep4: () => void;
}

export const Step3DestinationSelection: React.FC<Step3Props> = ({
  activeBatch,
  onSelectDestination,
  onProceedToStep4,
}) => {
  const [selectedId, setSelectedId] = useState<string>(activeBatch.selectedDestinationId);

  // Recalculate dynamic margins for candidate hubs against current batch's remaining hours
  const destinations = activeBatch.candidateDestinations.map((hub) => {
    const margin = activeBatch.remainingHours - hub.travelTimeHours;
    // Feasibility calculation:
    // If margin > 24h and high price -> highest feasibility
    // If margin is tight (<10h) on long route -> severely penalized
    let feasibility = 85;
    if (margin < 0) {
      feasibility = 10;
    } else if (margin < 12) {
      feasibility = 45;
    } else if (activeBatch.grade === 'Grade B (Near Expiry)' && hub.type === 'B2B Food Processor') {
      feasibility = 98; // B2B is optimal for Grade B!
    } else if (activeBatch.grade === 'Grade A (Fresh)' && hub.type === 'Central Mega DC') {
      feasibility = 95;
    } else {
      feasibility = Math.min(92, Math.round(70 + (margin / 10) + (hub.purchasePricePerKg / 5)));
    }

    return {
      ...hub,
      freshnessMarginHours: Math.max(0, Number(margin.toFixed(1))),
      feasibilityScore: feasibility,
    };
  });

  // Sort by feasibility score descending
  const sortedDestinations = [...destinations].sort((a, b) => b.feasibilityScore - a.feasibilityScore);

  const currentSelectedHub = sortedDestinations.find((h) => h.id === selectedId) || sortedDestinations[0];

  const handleSelect = (id: string) => {
    setSelectedId(id);
    onSelectDestination(id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
              STEP 03 OF 06
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-xs text-slate-400">Algorithmic Logistics Allocation</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
            Smart Destination Selection & Route Optimization
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Optimizes fulfillment nodes against remaining biological shelf life, transit distance, 
            market demand pricing, and salvage value retention.
          </p>
        </div>

        {/* Selected Hub Quick Badge */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl shrink-0">
          <MapPin className="w-4 h-4 text-emerald-400" />
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">Target Node</span>
            <span className="text-xs font-bold text-white truncate max-w-[200px] block">
              {currentSelectedHub.name}
            </span>
          </div>
        </div>
      </div>

      {/* Main Layout: Hub Topology Diagram + Optimization Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Hub Network Schematic (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Karnataka Regional Hub Topology</h3>
              </div>
              <span className="text-[11px] font-mono text-emerald-400">Active Routing</span>
            </div>

            {/* Interactive SVG Route Map */}
            <div className="mt-4 h-64 w-full bg-slate-950 rounded-xl p-3 border border-slate-800 relative overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 320 220">
                {/* Background Grid Accent */}
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#0f172a" strokeWidth="0.5" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Connecting Route Lines */}
                {/* Route 1: Origin to Central Mega DC (Nelamangala) */}
                <line
                  x1="45" y1="110" x2="250" y2="40"
                  stroke={selectedId === 'dest-blr-central' ? '#10b981' : '#334155'}
                  strokeWidth={selectedId === 'dest-blr-central' ? '3' : '1.5'}
                  strokeDasharray={selectedId === 'dest-blr-central' ? 'none' : '4 4'}
                />
                {/* Route 2: Origin to Local Retail (Whitefield) */}
                <line
                  x1="45" y1="110" x2="190" y2="100"
                  stroke={selectedId === 'dest-local-retail' ? '#10b981' : '#334155'}
                  strokeWidth={selectedId === 'dest-local-retail' ? '3' : '1.5'}
                  strokeDasharray={selectedId === 'dest-local-retail' ? 'none' : '4 4'}
                />
                {/* Route 3: Origin to B2B Processor (Hoskote) */}
                <line
                  x1="45" y1="110" x2="140" y2="160"
                  stroke={selectedId === 'dest-b2b-processor' || selectedId === 'dest-meat-b2b' ? '#10b981' : '#334155'}
                  strokeWidth={selectedId === 'dest-b2b-processor' || selectedId === 'dest-meat-b2b' ? '3' : '1.5'}
                  strokeDasharray={selectedId === 'dest-b2b-processor' || selectedId === 'dest-meat-b2b' ? 'none' : '4 4'}
                />
                {/* Route 4: Origin to Quick-Commerce Dark Store */}
                <line
                  x1="45" y1="110" x2="210" y2="180"
                  stroke={selectedId === 'dest-quick-commerce' ? '#10b981' : '#334155'}
                  strokeWidth={selectedId === 'dest-quick-commerce' ? '3' : '1.5'}
                  strokeDasharray={selectedId === 'dest-quick-commerce' ? 'none' : '4 4'}
                />

                {/* Node: Origin (Kolar / Source) */}
                <circle cx="45" cy="110" r="8" fill="#047857" stroke="#10b981" strokeWidth="2" />
                <text x="45" y="132" fill="#e2e8f0" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                  Origin (Kolar)
                </text>

                {/* Node: Central Mega DC */}
                <circle
                  cx="250" cy="40" r="7"
                  fill={selectedId === 'dest-blr-central' ? '#10b981' : '#1e293b'}
                  stroke={selectedId === 'dest-blr-central' ? '#ffffff' : '#64748b'}
                  strokeWidth="2"
                  className="cursor-pointer"
                  onClick={() => handleSelect('dest-blr-central')}
                />
                <text x="250" y="30" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="sans-serif">
                  Nelamangala Mega DC
                </text>

                {/* Node: Local Retail Outlets */}
                <circle
                  cx="190" cy="100" r="6"
                  fill={selectedId === 'dest-local-retail' ? '#10b981' : '#1e293b'}
                  stroke={selectedId === 'dest-local-retail' ? '#ffffff' : '#64748b'}
                  strokeWidth="2"
                  className="cursor-pointer"
                  onClick={() => handleSelect('dest-local-retail')}
                />
                <text x="200" y="104" fill="#94a3b8" fontSize="8" textAnchor="start" fontFamily="sans-serif">
                  Whitefield Supermarkets
                </text>

                {/* Node: B2B Agro Processor */}
                <circle
                  cx="140" cy="160" r="7"
                  fill={selectedId === 'dest-b2b-processor' || selectedId === 'dest-meat-b2b' ? '#10b981' : '#1e293b'}
                  stroke={selectedId === 'dest-b2b-processor' || selectedId === 'dest-meat-b2b' ? '#ffffff' : '#64748b'}
                  strokeWidth="2"
                  className="cursor-pointer"
                  onClick={() => handleSelect('dest-b2b-processor')}
                />
                <text x="140" y="180" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="sans-serif">
                  Hoskote B2B Plant
                </text>

                {/* Node: Quick Commerce Dark Store */}
                <circle
                  cx="210" cy="180" r="6"
                  fill={selectedId === 'dest-quick-commerce' ? '#10b981' : '#1e293b'}
                  stroke={selectedId === 'dest-quick-commerce' ? '#ffffff' : '#64748b'}
                  strokeWidth="2"
                  className="cursor-pointer"
                  onClick={() => handleSelect('dest-quick-commerce')}
                />
                <text x="210" y="200" fill="#94a3b8" fontSize="8" textAnchor="middle" fontFamily="sans-serif">
                  BTM Dark Store
                </text>
              </svg>
            </div>

            {/* AI Decision Rationale Card */}
            <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">AI Dispatch Rationale</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentSelectedHub.aiRationale}
              </p>
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>Net Freshness Buffer:</span>
                <span className="font-mono font-bold text-emerald-400">
                  +{currentSelectedHub.freshnessMarginHours} hrs remaining upon dock delivery
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Candidate Destination Optimization Matrix (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>Fulfillment Hub Matrix Ranking</span>
            </h3>
            <span className="text-xs text-slate-400">Ranked by Net Feasibility & Waste Prevention</span>
          </div>

          {/* Hub Comparison Cards */}
          <div className="space-y-3">
            {sortedDestinations.map((hub, idx) => {
              const isSelected = hub.id === selectedId;
              const isTopRanked = idx === 0;

              return (
                <div
                  key={hub.id}
                  onClick={() => handleSelect(hub.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-slate-900 border-emerald-500 shadow-lg shadow-emerald-950/20'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="flex items-start gap-3">
                      {/* Radio / Selection Indicator */}
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-500 text-white'
                            : 'border-slate-600 bg-slate-950'
                        }`}
                      >
                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{hub.name}</h4>
                          {isTopRanked && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/50">
                              Top AI Pick
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{hub.location}</p>
                      </div>
                    </div>

                    {/* Feasibility Score */}
                    <div className="sm:text-right shrink-0">
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                        Feasibility Match
                      </div>
                      <div className="text-base font-black font-mono text-emerald-400 tabular-nums">
                        {hub.feasibilityScore}%
                      </div>
                    </div>
                  </div>

                  {/* Metrics Row */}
                  <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Transit Distance</span>
                      <span className="font-mono text-slate-200 font-semibold">{hub.distanceKm} km</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Est. Travel Time</span>
                      <span className="font-mono text-slate-200 font-semibold">{hub.travelTimeHours} hrs</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Purchase Price</span>
                      <span className="font-mono text-emerald-300 font-semibold">₹{hub.purchasePricePerKg}/kg</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Freshness Margin</span>
                      <span className={`font-mono font-bold ${hub.freshnessMarginHours < 12 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        +{hub.freshnessMarginHours} hrs
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Confirm & Proceed Button */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-400">
              Assigned to truck telematics & SAP Transportation Management (TM).
            </div>
            <button
              onClick={onProceedToStep4}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30"
            >
              <span>Confirm Dispatch Plan & Monitor Telemetry (Step 4)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
