import React, { useState } from 'react';
import { 
  Clock, 
  Thermometer, 
  Droplets, 
  Wind, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  AlertCircle,
  TrendingDown,
  ArrowUpDown,
  Zap,
  BarChart2
} from 'lucide-react';
import { BatchItem, UrgencyTier } from '../../types/supplyChain';

interface Step2Props {
  activeBatch: BatchItem;
  allBatches: BatchItem[];
  onUpdateStorageConditions: (tempC: number, humidityPct: number, remainingHours: number, tier: UrgencyTier) => void;
  onProceedToStep3: () => void;
  onSelectBatch: (batchId: string) => void;
}

export const Step2RemainingLife: React.FC<Step2Props> = ({
  activeBatch,
  allBatches,
  onUpdateStorageConditions,
  onProceedToStep3,
  onSelectBatch,
}) => {
  const [storageTemp, setStorageTemp] = useState<number>(activeBatch.currentStorageTempC);
  const [humidity, setHumidity] = useState<number>(activeBatch.ambientHumidityPct);
  const [ethyleneScrubber, setEthyleneScrubber] = useState<boolean>(true);

  // Dynamic Arrhenius kinetic calculation of usable shelf life
  // Base shelf life at optimal temperature (4°C) for Grade A is ~168 hours (7 days) for tomatoes, 120h for milk, 72h for meat
  const getBaseHours = (type: string) => {
    switch (type) {
      case 'tomatoes': return 168;
      case 'milk': return 120;
      case 'meat': return 72;
      case 'pharma': return 720;
      default: return 240;
    }
  };

  const calculateDynamicShelfLife = (temp: number, hum: number, scrubber: boolean) => {
    const base = getBaseHours(activeBatch.productType);
    const qualityFactor = Math.pow(activeBatch.qualityScore / 100, 1.4);
    
    // Q10 temperature acceleration factor (biological decay doubles every 10°C rise)
    const tempDelta = Math.max(0, temp - activeBatch.targetTempC);
    const q10 = 2.2;
    const thermalDecayFactor = Math.pow(q10, tempDelta / 10);

    // Humidity penalty if too dry or too damp
    const humidityDelta = Math.abs(hum - 85);
    const humidityFactor = 1 - (humidityDelta * 0.003);

    // Ethylene scrubber benefit for tomatoes/produce
    const ethyleneFactor = scrubber ? 1.0 : (activeBatch.ethyleneSensitivity === 'High' ? 0.65 : 0.9);

    const calculatedHours = Math.max(4, Math.round((base * qualityFactor * humidityFactor * ethyleneFactor) / thermalDecayFactor));
    
    let tier: UrgencyTier = 'Green';
    if (calculatedHours > 120) {
      tier = 'Green';
    } else if (calculatedHours >= 48) {
      tier = 'Yellow';
    } else {
      tier = 'Red';
    }

    return { hours: calculatedHours, tier, days: (calculatedHours / 24).toFixed(1) };
  };

  const dynamicLife = calculateDynamicShelfLife(storageTemp, humidity, ethyleneScrubber);

  const handleTempChange = (newTemp: number) => {
    setStorageTemp(newTemp);
    const res = calculateDynamicShelfLife(newTemp, humidity, ethyleneScrubber);
    onUpdateStorageConditions(newTemp, humidity, res.hours, res.tier);
  };

  const handleHumidityChange = (newHum: number) => {
    setHumidity(newHum);
    const res = calculateDynamicShelfLife(storageTemp, newHum, ethyleneScrubber);
    onUpdateStorageConditions(storageTemp, newHum, res.hours, res.tier);
  };

  const handleEthyleneToggle = () => {
    const nextScrubber = !ethyleneScrubber;
    setEthyleneScrubber(nextScrubber);
    const res = calculateDynamicShelfLife(storageTemp, humidity, nextScrubber);
    onUpdateStorageConditions(storageTemp, humidity, res.hours, res.tier);
  };

  // Sort all batches for FEFO queue
  const fefoSortedBatches = [...allBatches].sort((a, b) => a.remainingHours - b.remainingHours);

  // Generate decay curve coordinates
  const timeSteps = [0, 24, 48, 72, 96, 120, 144, 168];
  const nominalCurve = timeSteps.map((t) => Math.max(0, 100 - (t / 168) * 60));
  const currentCurve = timeSteps.map((t) => {
    const decayRate = dynamicLife.hours > 0 ? (100 / dynamicLife.hours) : 1;
    return Math.max(0, Math.round(100 - (t * decayRate)));
  });

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
              STEP 02 OF 06
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-xs text-slate-400">Biological Decay & Shelf-Life Engine</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
            Remaining-Life Prediction & FEFO Prioritization
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Calculates kinetic degradation using Arrhenius thermal coefficients and quality score. 
            Automates First-Expired, First-Out (FEFO) warehouse sequencing to eradicate inventory aging.
          </p>
        </div>

        {/* Current Urgency Tier Badge */}
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl shrink-0">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">FEFO Urgency Tier</span>
            <span className="text-xs font-bold text-white">
              {dynamicLife.tier === 'Green' ? 'Standard Transit (>5 Days)' :
               dynamicLife.tier === 'Yellow' ? 'Urgent Priority (2-4 Days)' : 'Emergency Reroute (<24h)'}
            </span>
          </div>
          <div
            className={`w-4 h-4 rounded-full flex items-center justify-center ${
              dynamicLife.tier === 'Green' ? 'bg-emerald-500 shadow-md shadow-emerald-500/50' :
              dynamicLife.tier === 'Yellow' ? 'bg-amber-500 shadow-md shadow-amber-500/50' :
              'bg-rose-500 shadow-md shadow-rose-500/50 animate-pulse'
            }`}
          />
        </div>
      </div>

      {/* Main Grid: Storage Condition Sliders vs Decay Kinetic Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Storage Ambient Controller (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Urgency Highlight Card */}
          <div
            className={`rounded-2xl border p-5 transition-all ${
              dynamicLife.tier === 'Green'
                ? 'bg-emerald-950/30 border-emerald-500/40'
                : dynamicLife.tier === 'Yellow'
                ? 'bg-amber-950/30 border-amber-500/40'
                : 'bg-rose-950/30 border-rose-500/40'
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Remaining Usable Shelf Life
                </span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-4xl font-black font-mono text-white tabular-nums">
                    {dynamicLife.hours}
                  </span>
                  <span className="text-sm font-semibold text-slate-300">hours ({dynamicLife.days} days)</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60">
                <Clock className={`w-6 h-6 ${
                  dynamicLife.tier === 'Green' ? 'text-emerald-400' :
                  dynamicLife.tier === 'Yellow' ? 'text-amber-400' : 'text-rose-400'
                }`} />
              </div>
            </div>

            {/* Urgency Description */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-300 flex items-center gap-2">
              {dynamicLife.tier === 'Green' && (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Optimal stability. Eligible for full-distance retail hub distribution.</span>
                </>
              )}
              {dynamicLife.tier === 'Yellow' && (
                <>
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Accelerated decay. Must be prioritized in FEFO dispatch queue immediately.</span>
                </>
              )}
              {dynamicLife.tier === 'Red' && (
                <>
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 animate-bounce" />
                  <span>Critical threshold! Immediate short-haul diversion or B2B processing required.</span>
                </>
              )}
            </div>
          </div>

          {/* Environmental Controls */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-emerald-400" />
              <span>Cold-Chain Chamber Microclimate</span>
            </h3>

            {/* Storage Temperature Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300">Chamber Temperature</span>
                <span className={`font-mono font-bold tabular-nums ${storageTemp > 8 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {storageTemp.toFixed(1)}°C {storageTemp > 8 ? '(Thermal Abuse)' : '(Optimal)'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="0.5"
                value={storageTemp}
                onChange={(e) => handleTempChange(Number(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0°C (Deep Chill)</span>
                <span>Target: {activeBatch.targetTempC}°C</span>
                <span>25°C (Ambient Heat)</span>
              </div>
            </div>

            {/* Relative Humidity Slider */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300">Relative Humidity (RH)</span>
                <span className="font-mono text-white font-bold tabular-nums">{humidity}%</span>
              </div>
              <input
                type="range"
                min="40"
                max="98"
                value={humidity}
                onChange={(e) => handleHumidityChange(Number(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>40% (Dehydration Risk)</span>
                <span>85% - 90% (Fresh Balance)</span>
                <span>98% (Condensation)</span>
              </div>
            </div>

            {/* Ethylene Scrubber Active Toggle */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wind className="w-4 h-4 text-teal-400" />
                <div>
                  <div className="text-xs font-semibold text-white">Ethylene Gas Scrubber</div>
                  <div className="text-[11px] text-slate-400">Potassium permanganate filter system</div>
                </div>
              </div>
              <button
                onClick={handleEthyleneToggle}
                className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                  ethyleneScrubber
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-600/50'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {ethyleneScrubber ? 'Active (Filtered)' : 'Bypassed (High Gas)'}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Decay Curve Visualizer & Kinetic Modeling (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Decay Kinetic Chart */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Arrhenius Decay Curve (Quality Index vs Time)</h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">Q10 Kinetics Model</span>
            </div>

            {/* SVG Decay Chart */}
            <div className="mt-4 h-48 w-full bg-slate-950 rounded-xl p-3 border border-slate-800/80 relative">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 400 140" preserveAspectRatio="none">
                {/* Grid Lines */}
                <line x1="0" y1="35" x2="400" y2="35" stroke="#1e293b" strokeDasharray="3 3" />
                <line x1="0" y1="70" x2="400" y2="70" stroke="#1e293b" strokeDasharray="3 3" />
                <line x1="0" y1="105" x2="400" y2="105" stroke="#1e293b" strokeDasharray="3 3" />

                {/* Critical Expiry Threshold (50% quality mark) */}
                <line x1="0" y1="70" x2="400" y2="70" stroke="#f43f5e" strokeWidth="1" strokeDasharray="4 4" />
                <text x="395" y="66" fill="#f43f5e" fontSize="9" textAnchor="end" fontFamily="monospace">
                  Expiry Threshold (50%)
                </text>

                {/* Optimal Cold Chain Curve (Green Dotted) */}
                <path
                  d={`M 0,${140 - (nominalCurve[0] * 1.3)} 
                      C 100,${140 - (nominalCurve[2] * 1.3)} 
                        250,${140 - (nominalCurve[5] * 1.3)} 
                        400,${140 - (nominalCurve[7] * 1.3)}`}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  opacity="0.6"
                />

                {/* Current Simulated Storage Curve (Solid) */}
                <path
                  d={`M 0,${140 - (currentCurve[0] * 1.3)} 
                      C 100,${140 - (currentCurve[2] * 1.3)} 
                        250,${140 - (currentCurve[5] * 1.3)} 
                        400,${140 - (currentCurve[7] * 1.3)}`}
                  fill="none"
                  stroke={dynamicLife.tier === 'Green' ? '#10b981' : dynamicLife.tier === 'Yellow' ? '#f59e0b' : '#ef4444'}
                  strokeWidth="3"
                />
              </svg>

              {/* Chart Legend */}
              <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2 px-1 font-mono">
                <span>0h (Arrival)</span>
                <span>48h</span>
                <span>96h</span>
                <span>144h</span>
                <span>168h (Day 7)</span>
              </div>
            </div>

            <div className="flex items-center gap-6 mt-3 text-[11px] text-slate-400 px-1">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 bg-emerald-500 stroke-dash" />
                <span>Reference Standard (4°C Reefer)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className={`w-3 h-1 rounded ${
                  dynamicLife.tier === 'Green' ? 'bg-emerald-400' :
                  dynamicLife.tier === 'Yellow' ? 'bg-amber-400' : 'bg-rose-500'
                }`} />
                <span className="text-white font-medium">Current Storage Profile</span>
              </div>
            </div>
          </div>

          {/* FEFO Dispatch Priority Queue Table */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">FEFO Warehouse Dispatch Queue</h3>
              </div>
              <span className="text-xs text-slate-400">Auto-Sorted by Expiry Velocity</span>
            </div>

            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                    <th className="pb-2 font-semibold">Priority</th>
                    <th className="pb-2 font-semibold">Batch Code</th>
                    <th className="pb-2 font-semibold">Product</th>
                    <th className="pb-2 font-semibold text-right">Remaining Life</th>
                    <th className="pb-2 font-semibold text-right">Urgency Tier</th>
                    <th className="pb-2 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {fefoSortedBatches.map((item, index) => {
                    const isCurrent = item.id === activeBatch.id;
                    return (
                      <tr
                        key={item.id}
                        className={`transition-colors ${
                          isCurrent ? 'bg-emerald-950/40 text-white' : 'text-slate-300 hover:bg-slate-800/40'
                        }`}
                      >
                        <td className="py-2.5 font-mono font-bold text-slate-400">
                          #{index + 1}
                        </td>
                        <td className="py-2.5 font-mono font-semibold text-emerald-300">
                          {item.batchNumber}
                        </td>
                        <td className="py-2.5 font-medium truncate max-w-[140px]">
                          {item.productName}
                        </td>
                        <td className="py-2.5 text-right font-mono font-bold tabular-nums">
                          {isCurrent ? dynamicLife.hours : item.remainingHours}h
                        </td>
                        <td className="py-2.5 text-right">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              (isCurrent ? dynamicLife.tier : item.urgencyTier) === 'Green'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/40'
                                : (isCurrent ? dynamicLife.tier : item.urgencyTier) === 'Yellow'
                                ? 'bg-amber-950 text-amber-300 border border-amber-800/40'
                                : 'bg-rose-950 text-rose-300 border border-rose-800/40'
                            }`}
                          >
                            {isCurrent ? dynamicLife.tier : item.urgencyTier}
                          </span>
                        </td>
                        <td className="py-2.5 text-right">
                          {isCurrent ? (
                            <span className="text-[11px] text-emerald-400 font-semibold">Selected</span>
                          ) : (
                            <button
                              onClick={() => onSelectBatch(item.id)}
                              className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
                            >
                              Inspect
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Step 3 Transition CTA */}
            <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                FEFO sequencing logged to SAP Warehouse Management (WM).
              </span>
              <button
                onClick={onProceedToStep3}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/30"
              >
                <span>Optimize Destination Hub (Step 3)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
