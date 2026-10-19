import React, { useState } from 'react';
import { 
  BarChart3, 
  Leaf, 
  IndianRupee, 
  ShieldCheck, 
  TrendingUp, 
  FileText, 
  Download, 
  ExternalLink, 
  Layers, 
  Server,
  Award,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { SustainabilityMetrics } from '../../types/supplyChain';

interface Step6Props {
  metrics: SustainabilityMetrics;
  onOpenReport: () => void;
  onJumpToStep: (stepNumber: number) => void;
}

export const Step6SustainabilityDashboard: React.FC<Step6Props> = ({
  metrics,
  onOpenReport,
  onJumpToStep,
}) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'all' | 'q3' | 'q4'>('all');

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
              STEP 06 OF 06
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-xs text-slate-400">Executive ESG & Resilience Analytics</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
            Sustainability & Supply Chain Resilience Dashboard
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Real-time ESG accounting measuring total food waste diverted from landfills, 
            Scope 3 greenhouse gas avoidance, and capital preservation across Karnataka cold chain corridors.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenReport}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-950/40 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Export SAP ESG Audit Report</span>
          </button>
        </div>
      </div>

      {/* 4 Executive KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Food Waste Prevented */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 relative overflow-hidden group hover:border-emerald-500/50 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Food Waste Diverted
            </span>
            <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-700/50 text-emerald-400">
              <Leaf className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-1.5">
            <span className="text-3xl font-black font-mono text-white tabular-nums">
              {metrics.totalWastePreventedKg.toLocaleString()}
            </span>
            <span className="text-sm font-bold text-emerald-400">kg</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>+2,400 kg from recent reroute</span>
          </div>
        </div>

        {/* KPI 2: Scope 3 Carbon Emissions Avoided */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 relative overflow-hidden group hover:border-emerald-500/50 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Scope 3 CO2e Avoided
            </span>
            <div className="p-2 rounded-xl bg-teal-950/80 border border-teal-700/50 text-teal-400">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-1.5">
            <span className="text-3xl font-black font-mono text-white tabular-nums">
              {metrics.scope3Co2AvoidedTons.toFixed(1)}
            </span>
            <span className="text-sm font-bold text-teal-400">Tons CO2e</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            <span>Factor: 1.91 kg CO2e / kg waste (FAO)</span>
          </div>
        </div>

        {/* KPI 3: Financial Capital Saved */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 relative overflow-hidden group hover:border-emerald-500/50 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Financial Capital Saved
            </span>
            <div className="p-2 rounded-xl bg-amber-950/80 border border-amber-700/50 text-amber-400">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-3xl font-black font-mono text-white tabular-nums">
              ₹{(metrics.financialSavedInr / 100000).toFixed(2)}
            </span>
            <span className="text-sm font-bold text-amber-400">Lakh INR</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400">
            <span>Direct invoice value salvaged</span>
          </div>
        </div>

        {/* KPI 4: Supply Chain Resilience Score */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 relative overflow-hidden group hover:border-emerald-500/50 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Resilience Score
            </span>
            <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-700/50 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-3xl font-black font-mono text-white tabular-nums">
              {metrics.resilienceScorePct}%
            </span>
            <span className="text-sm font-bold text-emerald-400">Uptime</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
            <span>19 / 19 Anomalies Resolved</span>
            <span className="text-emerald-400 font-bold">100% SLA</span>
          </div>
        </div>
      </div>

      {/* Charts Section: Category Breakdown + Monthly Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Category Waste Avoided (6 Cols) */}
        <div className="lg:col-span-6 bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Food Waste Avoidance by Category</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">14,850 kg Total</span>
          </div>

          <div className="space-y-3.5 pt-1">
            {metrics.categoryWasteAvoided.map((cat) => {
              const pct = Math.round((cat.kg / metrics.totalWastePreventedKg) * 100);
              return (
                <div key={cat.category} className="space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 font-medium">{cat.category}</span>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-white font-bold">{cat.kg.toLocaleString()} kg</span>
                      <span className="text-slate-400">({pct}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>CO2e Abated: {cat.co2eTons} MT</span>
                    <span>Value Salvaged: ₹{cat.inrSaved.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Monthly Sustainability & Abatement Trend (6 Cols) */}
        <div className="lg:col-span-6 bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Monthly Waste Prevention Trajectory (2026)</h3>
            </div>
            <span className="text-xs text-slate-400">May - Oct 2026</span>
          </div>

          {/* Bar Chart Representation */}
          <div className="h-44 w-full bg-slate-950 rounded-xl p-4 border border-slate-800 flex items-end justify-between gap-3">
            {metrics.monthlyTrends.map((trend) => {
              const maxKg = 3500;
              const heightPct = Math.round((trend.wastePreventedKg / maxKg) * 100);
              return (
                <div key={trend.month} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <div className="text-[10px] font-mono text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    {trend.wastePreventedKg}kg
                  </div>
                  <div className="w-full bg-slate-800 rounded-t-lg relative overflow-hidden flex items-end" style={{ height: '70%' }}>
                    <div
                      className="w-full bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t-lg transition-all duration-500"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium truncate">
                    {trend.month.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex justify-between items-center text-slate-300">
            <span>Average Abatement Velocity:</span>
            <span className="font-mono text-emerald-400 font-bold">~2,475 kg / month</span>
          </div>
        </div>
      </div>

      {/* Recent Salvaged Shipments Audit Trail */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Real-Time Salvaged Shipments Audit Trail</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified autonomous reroutes authenticated into SAP S/4HANA Sustainability Footprint Management
            </p>
          </div>
          <button
            onClick={onOpenReport}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>View Full Log</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="pb-2.5 font-semibold">Batch ID</th>
                <th className="pb-2.5 font-semibold">Product Description</th>
                <th className="pb-2.5 font-semibold">Rerouted Destination Node</th>
                <th className="pb-2.5 font-semibold text-right">Waste Avoided</th>
                <th className="pb-2.5 font-semibold text-right">CO2e Saved</th>
                <th className="pb-2.5 font-semibold text-right">Capital Salvaged</th>
                <th className="pb-2.5 font-semibold text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {metrics.recentSalvagedShipments.map((shipment) => (
                <tr key={shipment.batchId} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 font-mono font-bold text-emerald-400">
                    {shipment.batchId}
                  </td>
                  <td className="py-3 font-medium text-slate-200">
                    {shipment.product}
                  </td>
                  <td className="py-3 text-slate-400">
                    {shipment.hubRerouted}
                  </td>
                  <td className="py-3 text-right font-mono font-bold text-white tabular-nums">
                    {shipment.kgSaved.toLocaleString()} kg
                  </td>
                  <td className="py-3 text-right font-mono font-semibold text-teal-300 tabular-nums">
                    {shipment.co2eSavedTons.toFixed(2)} MT
                  </td>
                  <td className="py-3 text-right font-mono font-bold text-emerald-300 tabular-nums">
                    ₹{shipment.financialSalvagedInr.toLocaleString()}
                  </td>
                  <td className="py-3 text-right text-slate-400 text-[11px]">
                    {shipment.recoveredAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SAP Hackfest 2026 Architectural Summary */}
      <div className="bg-slate-900 rounded-2xl border border-emerald-900/40 p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-emerald-400" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            SAP S/4HANA & BTP Ecosystem Architecture (Bengaluru 2026)
          </h4>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Green Resilience AI operates as a cloud-native side-by-side extension to <strong>SAP S/4HANA</strong>. 
          Incoming sensory data from ESP32 edge gateways connects via <strong>SAP Integration Suite</strong> to trigger 
          automated Material Management (MM) inspection lots, Transportation Management (TM) dynamic rerouting, 
          and Sustainability Footprint Management for automated Scope 3 ESG compliance.
        </p>

        <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono">
          <span className="px-2.5 py-1 rounded bg-slate-950 text-slate-300 border border-slate-800">
            SAP TM: Freight Order Reroute
          </span>
          <span className="px-2.5 py-1 rounded bg-slate-950 text-slate-300 border border-slate-800">
            SAP QM: Automated Inspection Lots
          </span>
          <span className="px-2.5 py-1 rounded bg-slate-950 text-slate-300 border border-slate-800">
            SAP MM: STO Buffer Allocation
          </span>
          <span className="px-2.5 py-1 rounded bg-slate-950 text-slate-300 border border-slate-800">
            SAP BTP: Event Mesh & AI Core
          </span>
        </div>
      </div>
    </div>
  );
};
