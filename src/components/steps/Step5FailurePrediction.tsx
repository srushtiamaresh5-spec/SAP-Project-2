import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  RefreshCw, 
  Truck, 
  MapPin, 
  FileCheck, 
  TrendingUp, 
  Leaf, 
  IndianRupee, 
  Clock, 
  Cpu,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { BatchItem, RecoveryActionPlan } from '../../types/supplyChain';

interface Step5Props {
  activeBatch: BatchItem;
  onExecuteRecovery: () => void;
  onProceedToStep6: () => void;
}

export const Step5FailurePrediction: React.FC<Step5Props> = ({
  activeBatch,
  onExecuteRecovery,
  onProceedToStep6,
}) => {
  const plan = activeBatch.recoveryPlan;
  const isAnomaly = plan.anomalyDetected;
  const [executionStage, setExecutionStage] = useState<number>(plan.recoveryStep === 'completed' ? 4 : 0);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  // Multi-stage autonomous recovery execution simulation
  const handleStartRecovery = () => {
    setIsExecuting(true);
    setExecutionStage(1);

    setTimeout(() => {
      setExecutionStage(2);
      setTimeout(() => {
        setExecutionStage(3);
        setTimeout(() => {
          setExecutionStage(4);
          setIsExecuting(false);
          onExecuteRecovery();
        }, 800);
      }, 800);
    }, 800);
  };

  const isCompleted = executionStage === 4;

  // Freshness margin calculations
  const remainingLife = plan.remainingShelfLifeHours;
  const eta = plan.destinationEtaHours;
  const margin = remainingLife - eta;
  const isCriticalDeficit = margin < 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
              STEP 05 OF 06
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-xs text-slate-400">Autonomous Anomaly Resolution Engine</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
            Failure Prediction & Autonomous SAP Recovery Action
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Correlates thermal degradation velocity against destination travel time. 
            When decay outpaces ETA, the system autonomously reroutes cargo to local B2B processors 
            and initiates a fresh stock replenishment from reserve warehouses.
          </p>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl shrink-0">
          <Cpu className={`w-4 h-4 ${isCompleted ? 'text-emerald-400' : isAnomaly ? 'text-rose-400' : 'text-emerald-400'}`} />
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">Protocol Status</span>
            <span className={`text-xs font-bold font-mono ${isCompleted ? 'text-emerald-400' : isAnomaly ? 'text-rose-400' : 'text-emerald-300'}`}>
              {isCompleted ? 'Autonomous Recovery Completed' : isAnomaly ? 'Action Required' : 'Nominal Monitoring'}
            </span>
          </div>
        </div>
      </div>

      {/* Anomaly Diagnostic & Freshness Deficit Assessment */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Predictive Anomaly Diagnosis (6 Cols) */}
        <div className="lg:col-span-6 space-y-5">
          <div
            className={`rounded-2xl border p-5 transition-all ${
              isCriticalDeficit
                ? 'bg-rose-950/40 border-rose-500/60'
                : 'bg-slate-900 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <AlertTriangle className={`w-5 h-5 ${isCriticalDeficit ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`} />
                <h3 className="text-base font-bold text-white">{plan.diagnosticTitle}</h3>
              </div>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold ${
                isCriticalDeficit ? 'bg-rose-900 text-rose-200 border border-rose-700' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
              }`}>
                {isCriticalDeficit ? 'CRITICAL RISK' : 'STABLE MARGIN'}
              </span>
            </div>

            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              {plan.diagnosticDetails}
            </p>

            {/* Freshness Margin Math Breakdown */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Decay Velocity (dT/dt):</span>
                <span className={`font-mono font-bold ${isCriticalDeficit ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {plan.thermalDecayVelocity}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Projected Usable Life:</span>
                <span className="font-mono text-white font-bold">{remainingLife.toFixed(1)} hours</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Primary Hub Destination ETA:</span>
                <span className="font-mono text-white font-bold">{eta.toFixed(1)} hours</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-800/60">
                <span className="font-semibold text-white">Net Freshness Margin (Life - ETA):</span>
                <span className={`font-mono font-black text-sm tabular-nums ${isCriticalDeficit ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {margin >= 0 ? `+${margin.toFixed(1)} hrs (Safe)` : `${margin.toFixed(1)} hrs (SPOILAGE BEFORE ARRIVAL)`}
                </span>
              </div>
            </div>

            {/* Impact Warning */}
            {isCriticalDeficit && (
              <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-rose-900/60 text-xs text-rose-200">
                <strong>Without Automated Intervention:</strong> 100% of batch {activeBatch.batchNumber} (
                {activeBatch.quantityKg.toLocaleString()} kg) will rot in transit, causing{' '}
                <span className="font-bold text-white">₹{activeBatch.invoiceValueInr.toLocaleString()}</span> financial scrap loss, 
                and emitting 4.58 tons of Scope 3 CO2e in landfills.
              </div>
            )}
          </div>

          {/* Autonomous Recovery Action Execution Box */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Autonomous SAP Recovery Protocol</h3>
              </div>
              <span className="text-xs text-emerald-400 font-mono">Zero-Loss Algorithm</span>
            </div>

            {/* 4 Execution Steps */}
            <div className="space-y-3">
              {/* Step 1: GPS Dynamic Reroute */}
              <div className={`p-3 rounded-xl border flex items-start gap-3 transition-colors ${
                executionStage >= 1 ? 'bg-emerald-950/40 border-emerald-600/50 text-white' : 'bg-slate-950/50 border-slate-800 text-slate-400'
              }`}>
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs font-mono font-bold ${
                  executionStage >= 1 ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  1
                </div>
                <div className="flex-1 text-xs">
                  <div className="font-bold text-slate-200">Dynamic Waypoint Reroute</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    Divert truck to <strong className="text-emerald-300">{plan.rerouteDestination.hubName}</strong> ({plan.rerouteDestination.distanceKm} km / {plan.rerouteDestination.travelTimeHours}h ETA).
                  </div>
                </div>
                {executionStage >= 1 && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />}
              </div>

              {/* Step 2: B2B Spot Offload */}
              <div className={`p-3 rounded-xl border flex items-start gap-3 transition-colors ${
                executionStage >= 2 ? 'bg-emerald-950/40 border-emerald-600/50 text-white' : 'bg-slate-950/50 border-slate-800 text-slate-400'
              }`}>
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs font-mono font-bold ${
                  executionStage >= 2 ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  2
                </div>
                <div className="flex-1 text-xs">
                  <div className="font-bold text-slate-200">Spot Market Auction Salvage</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    Offload batch at dynamic spot price <strong className="text-white">₹{plan.rerouteDestination.offloadPricePerKg}/kg</strong>. 
                    Salvages <strong className="text-emerald-400">₹{plan.rerouteDestination.salvagedValueInr.toLocaleString()}</strong> (71% invoice value).
                  </div>
                </div>
                {executionStage >= 2 && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />}
              </div>

              {/* Step 3: SAP Stock Transfer Order */}
              <div className={`p-3 rounded-xl border flex items-start gap-3 transition-colors ${
                executionStage >= 3 ? 'bg-emerald-950/40 border-emerald-600/50 text-white' : 'bg-slate-950/50 border-slate-800 text-slate-400'
              }`}>
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs font-mono font-bold ${
                  executionStage >= 3 ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  3
                </div>
                <div className="flex-1 text-xs">
                  <div className="font-bold text-slate-200">SAP S/4HANA Stock Transfer Order (STO)</div>
                  <div className="text-slate-400 text-[11px] mt-0.5 font-mono">
                    {plan.replacementDispatch.poNumber} · Dispatches fresh Grade A stock from {plan.replacementDispatch.originWarehouse}.
                  </div>
                </div>
                {executionStage >= 3 && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />}
              </div>

              {/* Step 4: Transportation Management Sync */}
              <div className={`p-3 rounded-xl border flex items-start gap-3 transition-colors ${
                executionStage >= 4 ? 'bg-emerald-950/40 border-emerald-600/50 text-white' : 'bg-slate-950/50 border-slate-800 text-slate-400'
              }`}>
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs font-mono font-bold ${
                  executionStage >= 4 ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  4
                </div>
                <div className="flex-1 text-xs">
                  <div className="font-bold text-slate-200">SAP TM Sync & Buyer Notification</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    Original buyer receives on-time delivery with zero SLA breach penalty.
                  </div>
                </div>
                {executionStage >= 4 && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />}
              </div>
            </div>

            {/* Execute Recovery Button */}
            {!isCompleted ? (
              <button
                onClick={handleStartRecovery}
                disabled={isExecuting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 cursor-pointer disabled:opacity-60"
              >
                {isExecuting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Executing SAP Autonomous Recovery Protocol...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Execute Autonomous SAP Recovery Protocol</span>
                  </>
                )}
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-600/50 text-xs text-emerald-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold">Recovery Successfully Executed & Certified in SAP S/4HANA</span>
                </div>
                <button
                  onClick={() => setExecutionStage(0)}
                  className="text-[11px] underline text-slate-400 hover:text-white"
                >
                  Re-test
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Before vs After Impact Comparison (6 Cols) */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Resilience ROI: Before vs After Recovery</span>
              </h3>
              <span className="text-xs text-slate-400">Impact Analysis</span>
            </div>

            {/* Comparison Cards */}
            <div className="grid grid-cols-2 gap-4">
              {/* Without AI (Traditional Supply Chain Failure) */}
              <div className="bg-rose-950/20 border border-rose-900/50 rounded-xl p-4 space-y-3">
                <div className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                  Without Green Resilience AI
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Physical Outcome</span>
                    <span className="font-bold text-rose-300">100% Spoilage in Transit</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Financial Scrap Loss</span>
                    <span className="font-mono font-bold text-rose-400">
                      -₹{activeBatch.invoiceValueInr.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Food Discarded</span>
                    <span className="font-mono text-slate-300 font-semibold">
                      {activeBatch.quantityKg.toLocaleString()} kg to Landfill
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Scope 3 Carbon Dump</span>
                    <span className="font-mono text-rose-300 font-semibold">+4.58 MT CO2e</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Buyer SLA Fulfillment</span>
                    <span className="font-bold text-rose-400">Breached (-15% Penalty)</span>
                  </div>
                </div>
              </div>

              {/* With AI Recovery (Autonomous Resilience Protocol) */}
              <div className="bg-emerald-950/30 border border-emerald-600/50 rounded-xl p-4 space-y-3">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  With Autonomous Protocol
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Physical Outcome</span>
                    <span className="font-bold text-emerald-300">100% Repurposed to B2B</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Financial Capital Salvaged</span>
                    <span className="font-mono font-bold text-emerald-400">
                      +₹{plan.rerouteDestination.salvagedValueInr.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Food Waste Prevented</span>
                    <span className="font-mono text-emerald-300 font-semibold">
                      {plan.rerouteDestination.wastePreventedKg.toLocaleString()} kg Saved
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Carbon Emissions Avoided</span>
                    <span className="font-mono text-emerald-300 font-semibold">4.58 MT CO2e</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Buyer SLA Fulfillment</span>
                    <span className="font-bold text-emerald-400">100% (Reserve STO Sent)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SAP S/4HANA Certified Audit Stamp */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1 font-mono">
              <div className="flex justify-between items-center text-slate-400 text-[11px]">
                <span>SAP MATERIAL DOC:</span>
                <span className="text-emerald-400 font-semibold">{plan.replacementDispatch.sapMaterialDoc}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400 text-[11px]">
                <span>REPLACEMENT PO:</span>
                <span className="text-white font-semibold">{plan.replacementDispatch.poNumber}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400 text-[11px]">
                <span>BUFFER ORIGIN:</span>
                <span className="text-slate-300 truncate max-w-[220px]">{plan.replacementDispatch.originWarehouse}</span>
              </div>
            </div>
          </div>

          {/* Proceed to Dashboard CTA */}
          <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-white">Aggregated Supply Chain Impact</div>
              <div className="text-[11px] text-slate-400">
                View fleet-wide food waste prevented & Scope 3 carbon metrics.
              </div>
            </div>
            <button
              onClick={onProceedToStep6}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40"
            >
              <span>View Sustainability & Impact Dashboard (Step 6)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
