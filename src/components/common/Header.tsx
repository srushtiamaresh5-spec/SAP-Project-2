import React from 'react';
import { 
  Leaf, 
  Activity, 
  Play, 
  Pause, 
  FileText, 
  RotateCcw,
  Boxes
} from 'lucide-react';
import { BatchItem } from '../../types/supplyChain';

interface HeaderProps {
  batches: BatchItem[];
  selectedBatchId: string;
  onSelectBatch: (batchId: string) => void;
  isSimulating: boolean;
  onToggleSimulation: () => void;
  onResetSimulation: () => void;
  onOpenReport: () => void;
  currentStep: number;
}

export const Header: React.FC<HeaderProps> = ({
  batches,
  selectedBatchId,
  onSelectBatch,
  isSimulating,
  onToggleSimulation,
  onResetSimulation,
  onOpenReport,
  currentStep,
}) => {
  const currentBatch = batches.find((b) => b.id === selectedBatchId) || batches[0];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-6 py-3 transition-colors">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Brand & Hackfest Context */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-900/20 shrink-0 border border-emerald-500/30">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                GREEN RESILIENCE AI
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  SAP Hackfest 2026
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              Smart Sorting · Safer Storage · Resilient Supply Chains · Bengaluru Node
            </p>
          </div>
        </div>

        {/* Center: Active Batch Quick Selector */}
        <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-lg shadow-inner">
          <Boxes className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-xs text-slate-400 font-medium shrink-0">Active Batch:</span>
          <select
            value={selectedBatchId}
            onChange={(e) => onSelectBatch(e.target.value)}
            className="bg-transparent text-xs font-mono font-semibold text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded py-0.5 cursor-pointer"
          >
            {batches.map((batch) => (
              <option key={batch.id} value={batch.id} className="bg-slate-900 text-slate-100">
                {batch.batchNumber} — {batch.productName} ({batch.grade})
              </option>
            ))}
          </select>
        </div>

        {/* Right: Controls & Status Badges */}
        <div className="flex items-center gap-2 shrink-0 self-end lg:self-auto">
          {/* Live Simulator Status Toggle */}
          <button
            onClick={onToggleSimulation}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isSimulating
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/50 hover:bg-emerald-900/60'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
            title="Toggle simulated IoT sensor updates"
          >
            <Activity className={`w-3.5 h-3.5 ${isSimulating ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}`} />
            <span>{isSimulating ? 'Live Simulation Active' : 'Simulation Paused'}</span>
            {isSimulating ? (
              <Pause className="w-3 h-3 ml-1 text-emerald-400" />
            ) : (
              <Play className="w-3 h-3 ml-1 text-slate-300" />
            )}
          </button>

          {/* Reset button */}
          <button
            onClick={onResetSimulation}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
            title="Reset active batch simulation state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* ESG Audit Report Button */}
          <button
            onClick={onOpenReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-600 border border-emerald-600 transition-colors shadow-sm"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>ESG Report</span>
          </button>
        </div>
      </div>
    </header>
  );
};
