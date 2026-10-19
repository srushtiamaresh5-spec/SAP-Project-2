import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  Leaf, 
  IndianRupee, 
  Building2,
  Calendar,
  Layers
} from 'lucide-react';
import { BatchItem, SustainabilityMetrics } from '../../types/supplyChain';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: SustainabilityMetrics;
  activeBatch: BatchItem;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  metrics,
  activeBatch,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCsv = () => {
    // Generate CSV string
    const headers = ['Batch ID', 'Product', 'Recovered At', 'Hub Rerouted', 'Kg Saved', 'CO2e Saved (MT)', 'Value Salvaged (INR)', 'Action'];
    const rows = metrics.recentSalvagedShipments.map((s) => [
      s.batchId,
      `"${s.product}"`,
      `"${s.recoveredAt}"`,
      `"${s.hubRerouted}"`,
      s.kgSaved,
      s.co2eSavedTons,
      s.financialSalvagedInr,
      `"${s.actionTaken}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `GREEN_RESILIENCE_AI_AUDIT_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-950 border border-emerald-600/50 text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                SAP Certified ESG & Resilience Audit Report
              </h3>
              <p className="text-xs text-slate-400">
                Document Ref: SAP-BTP-GRAI-2026-BLR-0091
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Print Report"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownloadCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloadSuccess ? 'Downloaded CSV' : 'Export CSV'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Printable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-200">
          {/* Header Strip */}
          <div className="border border-slate-800 bg-slate-950 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
                SAP HACKFEST BENGALURU 2026 · THEME: RESILIENT SUPPLY CHAINS
              </div>
              <h2 className="text-xl font-black text-white mt-1">
                GREEN RESILIENCE AI — Executive ESG & Operational Certificate
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Issued for Karnataka Agricultural & Cold-Chain Logistics Corridor (Kolar - Bengaluru - Mandya)
              </p>
            </div>

            <div className="text-right sm:border-l sm:border-slate-800 sm:pl-4 text-xs font-mono">
              <span className="text-slate-400 block">AUDIT DATE:</span>
              <span className="text-white font-bold">18-OCT-2026 21:30 IST</span>
              <span className="text-emerald-400 block mt-1 font-semibold">STATUS: VERIFIED (ISO 14064)</span>
            </div>
          </div>

          {/* Core Quantified Impact Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Food Diverted</span>
              <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
                {metrics.totalWastePreventedKg.toLocaleString()} kg
              </div>
              <span className="text-[10px] text-slate-400">Zero landfill deposit</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Scope 3 CO2e Avoided</span>
              <div className="text-2xl font-black font-mono text-teal-300 mt-1">
                {metrics.scope3Co2AvoidedTons.toFixed(1)} MT
              </div>
              <span className="text-[10px] text-slate-400">IPCC Methane baseline</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Capital Salvaged</span>
              <div className="text-2xl font-black font-mono text-amber-300 mt-1">
                ₹{(metrics.financialSavedInr / 100000).toFixed(2)} L
              </div>
              <span className="text-[10px] text-slate-400">Recovered via B2B spot</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Resilience Score</span>
              <div className="text-2xl font-black font-mono text-white mt-1">
                {metrics.resilienceScorePct}%
              </div>
              <span className="text-[10px] text-emerald-400">100% on-time delivery</span>
            </div>
          </div>

          {/* Active Batch Spotlight */}
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Active Batch Dossier: {activeBatch.batchNumber}</span>
              </h4>
              <span className="text-xs font-mono text-emerald-400">{activeBatch.grade}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Product Name</span>
                <span className="font-semibold text-white">{activeBatch.productName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Batch Mass</span>
                <span className="font-mono text-white">{activeBatch.quantityKg.toLocaleString()} kg</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Quality Index</span>
                <span className="font-mono text-emerald-400">{activeBatch.qualityScore}%</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Current Shelf Life</span>
                <span className="font-mono text-white">{activeBatch.remainingHours.toFixed(1)} hrs</span>
              </div>
            </div>
          </div>

          {/* Audit Log Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Verified Salvaged Shipments Ledger
            </h4>
            <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                  <tr>
                    <th className="p-3">Batch ID</th>
                    <th className="p-3">Product</th>
                    <th className="p-3">Rerouted Node</th>
                    <th className="p-3 text-right">Waste Avoided</th>
                    <th className="p-3 text-right">CO2e Saved</th>
                    <th className="p-3 text-right">Value (INR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {metrics.recentSalvagedShipments.map((item) => (
                    <tr key={item.batchId}>
                      <td className="p-3 font-bold text-emerald-400">{item.batchId}</td>
                      <td className="p-3 font-sans text-slate-200">{item.product}</td>
                      <td className="p-3 font-sans text-slate-400">{item.hubRerouted}</td>
                      <td className="p-3 text-right text-white tabular-nums">{item.kgSaved.toLocaleString()} kg</td>
                      <td className="p-3 text-right text-teal-300 tabular-nums">{item.co2eSavedTons.toFixed(2)} MT</td>
                      <td className="p-3 text-right text-emerald-300 tabular-nums">₹{item.financialSalvagedInr.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Signatures & Certification Footer */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Signed digitally via SAP BTP Blockchain & Event Mesh</span>
            </div>
            <div className="text-right">
              <span>SAP Hackfest 2026 Bengaluru Submission</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
