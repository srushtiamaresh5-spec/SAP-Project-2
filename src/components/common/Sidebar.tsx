import React from 'react';
import { 
  Scan, 
  Clock, 
  Compass, 
  Truck, 
  AlertTriangle, 
  BarChart3, 
  CheckCircle2, 
  Cpu, 
  Server
} from 'lucide-react';
import { BatchItem } from '../../types/supplyChain';

interface SidebarProps {
  currentStep: number;
  onSelectStep: (stepNumber: number) => void;
  activeBatch: BatchItem;
}

interface StepItem {
  number: number;
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STEPS: StepItem[] = [
  {
    number: 1,
    id: 'inspection',
    title: 'Quality Inspection',
    subtitle: 'Visual & Physical Multi-Product AI',
    icon: Scan,
  },
  {
    number: 2,
    id: 'remaining-life',
    title: 'Remaining-Life Engine',
    subtitle: 'FEFO Urgency & Decay Kinetics',
    icon: Clock,
  },
  {
    number: 3,
    id: 'destination',
    title: 'Smart Destination',
    subtitle: 'Hub Matrix & Margin Optimization',
    icon: Compass,
  },
  {
    number: 4,
    id: 'telemetry',
    title: 'Truck Telemetry',
    subtitle: 'ESP32 In-Transit Monitoring',
    icon: Truck,
  },
  {
    number: 5,
    id: 'failure-recovery',
    title: 'Failure & Recovery',
    subtitle: 'Anomaly Detection & Auto-Reroute',
    icon: AlertTriangle,
  },
  {
    number: 6,
    id: 'sustainability',
    title: 'Impact Dashboard',
    subtitle: 'Scope 3 Carbon & Waste Prevented',
    icon: BarChart3,
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  currentStep,
  onSelectStep,
  activeBatch,
}) => {
  // Determine if anomaly is currently active on the truck
  const hasAnomaly = activeBatch.recoveryPlan.anomalyDetected;

  return (
    <aside className="w-full lg:w-72 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0">
      {/* Pipeline Navigation Header */}
      <div className="p-4 border-b border-slate-800/80">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span className="font-semibold tracking-wider uppercase text-[11px] text-emerald-400">
            Supply Chain Pipeline
          </span>
          <span className="font-mono text-slate-300">
            Step {currentStep} of 6
          </span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${(currentStep / 6) * 100}%` }}
          />
        </div>
      </div>

      {/* Steps List */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        {STEPS.map((step) => {
          const isActive = currentStep === step.number;
          const isPassed = currentStep > step.number;
          const Icon = step.icon;

          // Special indicator if Step 5 has anomaly
          const isAlertStep = step.number === 5 && hasAnomaly;

          return (
            <button
              key={step.id}
              onClick={() => onSelectStep(step.number)}
              className={`w-full text-left p-3 rounded-xl transition-all flex items-start gap-3 group relative border ${
                isActive
                  ? 'bg-emerald-950/40 border-emerald-500/50 shadow-sm'
                  : isAlertStep
                  ? 'bg-rose-950/20 border-rose-500/40 hover:bg-rose-950/30'
                  : 'bg-transparent border-transparent hover:bg-slate-800/60 hover:border-slate-800'
              }`}
            >
              {/* Step indicator circle / icon */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-mono font-bold transition-colors ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-700/30'
                    : isAlertStep
                    ? 'bg-rose-600 text-white animate-pulse'
                    : isPassed
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                    : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                }`}
              >
                {isPassed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <span>0{step.number}</span>
                )}
              </div>

              {/* Title & Subtitle */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span
                    className={`text-xs font-semibold truncate ${
                      isActive
                        ? 'text-white'
                        : isAlertStep
                        ? 'text-rose-300'
                        : 'text-slate-300 group-hover:text-white'
                    }`}
                  >
                    {step.title}
                  </span>
                  {isAlertStep && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" title="Anomaly Detected" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  {step.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Active Batch Summary Card */}
      <div className="p-3 m-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
        <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800/70">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-300 font-bold">Batch Dossier</span>
          <span className="font-mono text-emerald-400 font-semibold">{activeBatch.batchNumber}</span>
        </div>
        <div className="mt-2 space-y-1.5 text-slate-400">
          <div className="flex justify-between items-center">
            <span>Product:</span>
            <span className="text-white font-medium truncate max-w-[130px]">{activeBatch.productName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Volume:</span>
            <span className="text-white font-mono">{activeBatch.quantityKg.toLocaleString()} kg</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Quality Score:</span>
            <span className="font-mono font-bold text-emerald-400">{activeBatch.qualityScore}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Usable Shelf Life:</span>
            <span className={`font-mono font-bold ${
              activeBatch.urgencyTier === 'Green' ? 'text-emerald-400' :
              activeBatch.urgencyTier === 'Yellow' ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {activeBatch.remainingHours.toFixed(1)} hrs
            </span>
          </div>
        </div>
      </div>

      {/* Telemetry & System Status Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-[11px] text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Server className="w-3.5 h-3.5 text-emerald-400" />
          <span>SAP S/4HANA</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-emerald-400" />
          <span>ESP32 Fleet Sync</span>
        </div>
      </div>
    </aside>
  );
};
