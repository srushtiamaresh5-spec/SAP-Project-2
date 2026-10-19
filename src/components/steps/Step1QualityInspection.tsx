import React, { useState } from 'react';
import { 
  Scan, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Sliders, 
  ArrowRight, 
  Thermometer, 
  Layers, 
  Award, 
  Sparkles,
  Info
} from 'lucide-react';
import { BatchItem, InspectionParameters, ProductType, QualityGrade } from '../../types/supplyChain';

interface Step1Props {
  activeBatch: BatchItem;
  onUpdateBatchParams: (params: InspectionParameters) => void;
  onProceedToStep2: () => void;
}

export const Step1QualityInspection: React.FC<Step1Props> = ({
  activeBatch,
  onUpdateBatchParams,
  onProceedToStep2,
}) => {
  const [params, setParams] = useState<InspectionParameters>(activeBatch.inspectionParams);

  // Helper to compute quality score and grade on the fly
  const computeScore = (p: InspectionParameters, type: ProductType): { score: number; grade: QualityGrade } => {
    // Weighted formula:
    // Color uniformity (25%), Spots inverted (20%), Surface damage inverted (20%), Packaging (15%), Physical firmness/pH (20%)
    const colorWeight = p.colorRipe * 0.25;
    const spotPenalty = (100 - p.spotBlemish) * 0.20;
    const damagePenalty = (100 - p.surfaceDamage) * 0.20;
    const pkgWeight = p.packagingIntegrity * 0.15;
    const physicalWeight = p.firmnessShore * 0.20;

    let total = Math.round(colorWeight + spotPenalty + damagePenalty + pkgWeight + physicalWeight);
    if (total > 100) total = 100;
    if (total < 0) total = 0;

    let grade: QualityGrade = 'Grade A (Fresh)';
    if (total >= 80) {
      grade = 'Grade A (Fresh)';
    } else if (total >= 50) {
      grade = 'Grade B (Near Expiry)';
    } else {
      grade = 'Rejected';
    }

    return { score: total, grade };
  };

  const currentResult = computeScore(params, activeBatch.productType);

  const handleSliderChange = (key: keyof InspectionParameters, value: number) => {
    const updated = { ...params, [key]: value };
    setParams(updated);
    onUpdateBatchParams(updated);
  };

  // Preset quick adjustments
  const applyPreset = (mode: 'pristine' | 'aging' | 'damaged') => {
    let newP: InspectionParameters;
    if (mode === 'pristine') {
      newP = {
        colorRipe: 95,
        spotBlemish: 4,
        surfaceDamage: 2,
        packagingIntegrity: 98,
        firmnessShore: 88,
        phOrBrix: activeBatch.productType === 'milk' ? 6.7 : 5.8,
        coreTempC: activeBatch.targetTempC,
      };
    } else if (mode === 'aging') {
      newP = {
        colorRipe: 74,
        spotBlemish: 24,
        surfaceDamage: 18,
        packagingIntegrity: 82,
        firmnessShore: 62,
        phOrBrix: activeBatch.productType === 'milk' ? 6.3 : 4.9,
        coreTempC: activeBatch.targetTempC + 2.5,
      };
    } else {
      newP = {
        colorRipe: 45,
        spotBlemish: 68,
        surfaceDamage: 55,
        packagingIntegrity: 40,
        firmnessShore: 30,
        phOrBrix: activeBatch.productType === 'milk' ? 5.8 : 3.8,
        coreTempC: activeBatch.targetTempC + 6.0,
      };
    }
    setParams(newP);
    onUpdateBatchParams(newP);
  };

  return (
    <div className="space-y-6">
      {/* Top Section Intro */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
              STEP 01 OF 06
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-xs text-slate-400">Incoming Dock Quality Gate</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
            Multi-Product Quality Inspection Engine
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Computer vision surface grading & calibrated sensor probes classify incoming perishable batches 
            into Grade A, Grade B, or Rejection quarantine prior to warehouse bin allocation.
          </p>
        </div>

        {/* Quick Simulation Presets */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-lg shrink-0">
          <span className="text-[11px] text-slate-400 px-2 font-medium">Quick Sim:</span>
          <button
            onClick={() => applyPreset('pristine')}
            className="px-2.5 py-1 text-xs font-medium rounded-md bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 hover:bg-emerald-900/60 transition-colors"
          >
            Pristine (Grade A)
          </button>
          <button
            onClick={() => applyPreset('aging')}
            className="px-2.5 py-1 text-xs font-medium rounded-md bg-amber-950/60 text-amber-300 border border-amber-800/40 hover:bg-amber-900/60 transition-colors"
          >
            Near-Expiry (Grade B)
          </button>
          <button
            onClick={() => applyPreset('damaged')}
            className="px-2.5 py-1 text-xs font-medium rounded-md bg-rose-950/60 text-rose-300 border border-rose-800/40 hover:bg-rose-900/60 transition-colors"
          >
            Damaged (Reject)
          </button>
        </div>
      </div>

      {/* Main Grid: Visual Preview vs Parameter Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual Preview & Live Score Gauge (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Product Visual Card */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
            <div className="relative aspect-[4/3] bg-slate-950">
              <img
                src={activeBatch.imagePath}
                alt={activeBatch.productName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback container if image fails
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              
              {/* Overlay Tag */}
              <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-slate-700/60 rounded-lg px-2.5 py-1 text-xs text-white flex items-center gap-1.5">
                <Scan className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-mono">{activeBatch.batchNumber}</span>
              </div>

              {/* Classification Banner */}
              <div className="absolute bottom-3 right-3">
                <div
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg backdrop-blur-md border flex items-center gap-1.5 ${
                    currentResult.grade === 'Grade A (Fresh)'
                      ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50'
                      : currentResult.grade === 'Grade B (Near Expiry)'
                      ? 'bg-amber-950/90 text-amber-300 border-amber-500/50'
                      : 'bg-rose-950/90 text-rose-300 border-rose-500/50'
                  }`}
                >
                  {currentResult.grade === 'Grade A (Fresh)' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  {currentResult.grade === 'Grade B (Near Expiry)' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                  {currentResult.grade === 'Rejected' && <XCircle className="w-4 h-4 text-rose-400" />}
                  <span>{currentResult.grade}</span>
                </div>
              </div>
            </div>

            {/* Product Details Header */}
            <div className="p-4 border-t border-slate-800/80">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-bold text-white">{activeBatch.productName}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{activeBatch.categoryLabel}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400">Total Lot Volume</span>
                  <div className="text-sm font-mono font-bold text-white">{activeBatch.quantityKg.toLocaleString()} kg</div>
                </div>
              </div>
              
              <div className="mt-3 pt-3 border-t border-slate-800/60 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400">Origin Node:</span>
                  <p className="text-slate-200 truncate font-medium">{activeBatch.originHub}</p>
                </div>
                <div>
                  <span className="text-slate-400">Inbound Value:</span>
                  <p className="text-emerald-400 font-mono font-semibold">₹{activeBatch.invoiceValueInr.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quality Score Meter */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Computed Quality Index
                </span>
              </div>
              <span className="font-mono text-2xl font-black text-white tabular-nums">
                {currentResult.score}%
              </span>
            </div>

            {/* Animated Progress Bar */}
            <div className="w-full bg-slate-950 rounded-full h-3 p-0.5 border border-slate-800 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ease-out ${
                  currentResult.score >= 80
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                    : currentResult.score >= 50
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                    : 'bg-gradient-to-r from-rose-600 to-red-500'
                }`}
                style={{ width: `${currentResult.score}%` }}
              />
            </div>

            {/* Threshold Legend */}
            <div className="flex justify-between items-center text-[11px] text-slate-400 mt-2 font-mono">
              <span className="text-rose-400">0% Rejection</span>
              <span className="text-amber-400">50% Grade B</span>
              <span className="text-emerald-400">80% Grade A (Fresh)</span>
              <span>100%</span>
            </div>

            {/* SAP Lot Classification Note */}
            <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white">SAP Quality Management (QM):</span>{' '}
                Inspection Lot <span className="font-mono text-emerald-300">04-2026-90214</span> automatically 
                tagged as <strong className="text-white">{currentResult.grade}</strong>. 
                {currentResult.grade === 'Grade A (Fresh)' && ' Approved for long-distance cold-chain transit.'}
                {currentResult.grade === 'Grade B (Near Expiry)' && ' Flagged for priority FEFO routing to avoid markdown waste.'}
                {currentResult.grade === 'Rejected' && ' Barred from human consumption logistics. Route to bio-conversion.'}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Visual & Physical Inspection Sliders (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Inspection Parameter Sliders</h3>
              </div>
              <span className="text-xs text-slate-400">Computer Vision & Lab Probes</span>
            </div>

            {/* Section 1: Surface & Optical Parameters */}
            <div className="mt-5 space-y-4">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Surface & Optical Characteristics
              </h4>

              {/* Parameter 1: Skin & Color Uniformity */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-medium">Color Uniformity & Ripeness Maturity</span>
                  <span className="font-mono text-white font-semibold tabular-nums">{params.colorRipe}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={params.colorRipe}
                  onChange={(e) => handleSliderChange('colorRipe', Number(e.target.value))}
                  className="w-full accent-emerald-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Mottled / Discolored</span>
                  <span>Optimal Spectral Uniformity</span>
                </div>
              </div>

              {/* Parameter 2: Surface Spots & Blemishes */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-medium">Surface Spots & Black Blemish Ratio</span>
                  <span className={`font-mono font-semibold tabular-nums ${params.spotBlemish > 30 ? 'text-rose-400' : 'text-slate-300'}`}>
                    {params.spotBlemish}% (Defect)
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="80"
                  value={params.spotBlemish}
                  onChange={(e) => handleSliderChange('spotBlemish', Number(e.target.value))}
                  className="w-full accent-emerald-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Zero Lesions (0%)</span>
                  <span>Heavy Blight & Spotting (80%)</span>
                </div>
              </div>

              {/* Parameter 3: Mechanical Surface Damage */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-medium">Mechanical Cracks / Cuts / Bruising</span>
                  <span className={`font-mono font-semibold tabular-nums ${params.surfaceDamage > 25 ? 'text-rose-400' : 'text-slate-300'}`}>
                    {params.surfaceDamage}% (Damage)
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="70"
                  value={params.surfaceDamage}
                  onChange={(e) => handleSliderChange('surfaceDamage', Number(e.target.value))}
                  className="w-full accent-emerald-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Unblemished Skin (0%)</span>
                  <span>Severe Transit Bruising (70%)</span>
                </div>
              </div>

              {/* Parameter 4: Packaging & Seal Integrity */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-medium">Packaging Hermetic Seal & Tamper Seal</span>
                  <span className="font-mono text-white font-semibold tabular-nums">{params.packagingIntegrity}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={params.packagingIntegrity}
                  onChange={(e) => handleSliderChange('packagingIntegrity', Number(e.target.value))}
                  className="w-full accent-emerald-500 h-1.5 bg-slate-950 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Punctured / Breached</span>
                  <span>100% Hermetically Sealed</span>
                </div>
              </div>
            </div>

            {/* Section 2: Physical & Chemical Laboratory Checks */}
            <div className="mt-6 pt-5 border-t border-slate-800 space-y-4">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-emerald-400" />
                Physical & Bio-Chemical Sensor Checks
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Physical Firmness / Density */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">
                      {activeBatch.productType === 'tomatoes' ? 'Firmness (Durofel/Shore)' :
                       activeBatch.productType === 'milk' ? 'Fat/SNF Viscosity' :
                       activeBatch.productType === 'meat' ? 'Shear Force Rigor' : 'Vial Clarity'}
                    </span>
                    <span className="font-mono font-bold text-white">{params.firmnessShore}/100</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={params.firmnessShore}
                    onChange={(e) => handleSliderChange('firmnessShore', Number(e.target.value))}
                    className="w-full accent-emerald-500 h-1.5 bg-slate-900 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Chemical Index (Brix for Fruit, pH for Dairy/Meat) */}
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">
                      {activeBatch.productType === 'tomatoes' ? 'Sugar Content (°Brix)' :
                       activeBatch.productType === 'milk' ? 'Acidity Level (pH)' :
                       activeBatch.productType === 'meat' ? 'Muscle pH' : 'Osmolality Index'}
                    </span>
                    <span className="font-mono font-bold text-white">{params.phOrBrix}</span>
                  </div>
                  <input
                    type="range"
                    min="3.0"
                    max="9.0"
                    step="0.1"
                    value={params.phOrBrix}
                    onChange={(e) => handleSliderChange('phOrBrix', Number(e.target.value))}
                    className="w-full accent-emerald-500 h-1.5 bg-slate-900 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-400">
                Quality Grade confirmed by <strong className="text-emerald-400">ISO/IEC 17025</strong> protocol.
              </div>
              <button
                onClick={onProceedToStep2}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30"
              >
                <span>Commit & Predict Remaining Shelf Life (Step 2)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
