import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  Thermometer, 
  Droplets, 
  Gauge, 
  Radio, 
  Battery, 
  MapPin, 
  AlertTriangle, 
  ArrowRight, 
  Play, 
  Pause, 
  Clock, 
  ShieldAlert, 
  Activity, 
  Compass, 
  Flame,
  Terminal,
  Zap
} from 'lucide-react';
import { BatchItem, IncidentType, TruckTelemetry } from '../../types/supplyChain';

interface Step4Props {
  activeBatch: BatchItem;
  onSimulateIncident: (incident: IncidentType) => void;
  onProceedToStep5: () => void;
  isSimulating: boolean;
  onToggleSimulation: () => void;
}

export const Step4TruckTelemetry: React.FC<Step4Props> = ({
  activeBatch,
  onSimulateIncident,
  onProceedToStep5,
  isSimulating,
  onToggleSimulation,
}) => {
  const telemetry = activeBatch.truckTelemetry;
  const currentIncident = activeBatch.recoveryPlan.incidentType;

  // Selected telemetry view tab
  const [activeTab, setActiveTab] = useState<'gauges' | 'packet'>('gauges');
  const [copied, setCopied] = useState(false);

  // Formatted ESP32 payload
  const rawPacket = {
    device_id: `ESP32-COLD-${telemetry.truckId.slice(-4)}`,
    mac_address: '24:0A:C4:88:FE:19',
    firmware_version: 'v2.8.4-BLE-MESH-SAP',
    timestamp_epoch: Math.floor(Date.now() / 1000),
    gps: {
      latitude: telemetry.currentCoords.lat,
      longitude: telemetry.currentCoords.lng,
      altitude_m: 892.4,
      lock_status: telemetry.gpsStatus,
    },
    sensors: {
      cargo_temp_c: telemetry.temperatureC,
      relative_humidity_pct: telemetry.humidityPct,
      triaxial_vibration_g: telemetry.vibrationG,
      reefer_compressor: telemetry.coolingStatus,
      battery_soc_pct: telemetry.batteryPct,
      door_seal_contact: 'Closed & Sealed',
    },
    telematics: {
      vehicle_speed_kmh: telemetry.speedKmh,
      traffic_congestion: telemetry.trafficStatus,
      destination_eta_hrs: telemetry.currentEtaHours,
    },
  };

  const handleCopyPacket = () => {
    navigator.clipboard?.writeText(JSON.stringify(rawPacket, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isExcursion = telemetry.temperatureC > 7.0 || telemetry.coolingStatus === 'Compressor Fault';
  const isTrafficDelay = telemetry.trafficStatus.includes('Gridlock');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-bold">
              STEP 04 OF 06
            </span>
            <span className="text-slate-500">·</span>
            <span className="text-xs text-slate-400">Reefer Truck IoT Telematics</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
            Truck Telemetry & In-Transit IoT Monitoring
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Simulates onboard ESP32 multi-sensor telemetry gateway streaming cargo temperature, 
            humidity, vibration shocks, and vehicle ETA over highway corridor NH-75.
          </p>
        </div>

        {/* Live Packet Streaming Pulse */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl shrink-0">
          <Radio className={`w-4 h-4 ${isSimulating ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">IoT Gateway</span>
            <span className="text-xs font-mono font-bold text-white">
              {telemetry.truckId} · {isSimulating ? 'Streaming (2.5s)' : 'Paused'}
            </span>
          </div>
        </div>
      </div>

      {/* Transit Event Simulator Toolbar */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Transit Incident Simulator
            </span>
          </div>
          <span className="text-xs text-slate-400">
            Trigger real-time cold-chain anomalies to test automated resilience actions
          </span>
        </div>

        {/* 4 Interactive Transit Simulation Buttons */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
          {/* Normal Transit */}
          <button
            onClick={() => onSimulateIncident('normal')}
            className={`p-3 rounded-xl border text-left transition-all ${
              currentIncident === 'normal'
                ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-md shadow-emerald-950/40'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span className="text-emerald-400">1. Normal Transit</span>
              {currentIncident === 'normal' && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
            </div>
            <p className="text-[11px] text-slate-400">
              Stable 4°C, Nominal compressor, smooth highway speed.
            </p>
          </button>

          {/* Temperature Excursion */}
          <button
            onClick={() => onSimulateIncident('temp_excursion')}
            className={`p-3 rounded-xl border text-left transition-all ${
              currentIncident === 'temp_excursion'
                ? 'bg-rose-950/60 border-rose-500 text-white shadow-md shadow-rose-950/40'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span className="text-rose-400">2. Temp Excursion</span>
              {currentIncident === 'temp_excursion' && <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />}
            </div>
            <p className="text-[11px] text-slate-400">
              Reefer compressor trip! Temperature spikes to 12.8°C.
            </p>
          </button>

          {/* Traffic Gridlock Delay */}
          <button
            onClick={() => onSimulateIncident('traffic_gridlock')}
            className={`p-3 rounded-xl border text-left transition-all ${
              currentIncident === 'traffic_gridlock'
                ? 'bg-amber-950/60 border-amber-500 text-white shadow-md shadow-amber-950/40'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span className="text-amber-400">3. Traffic Gridlock</span>
              {currentIncident === 'traffic_gridlock' && <span className="w-2 h-2 rounded-full bg-amber-400" />}
            </div>
            <p className="text-[11px] text-slate-400">
              Accident on NH-48. Speed 5 km/h, ETA surges by +4.5h.
            </p>
          </button>

          {/* GPS Signal Drift */}
          <button
            onClick={() => onSimulateIncident('gps_drift')}
            className={`p-3 rounded-xl border text-left transition-all ${
              currentIncident === 'gps_drift'
                ? 'bg-sky-950/60 border-sky-500 text-white shadow-md shadow-sky-950/40'
                : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold mb-1">
              <span className="text-sky-400">4. GPS Signal Drift</span>
              {currentIncident === 'gps_drift' && <span className="w-2 h-2 rounded-full bg-sky-400" />}
            </div>
            <p className="text-[11px] text-slate-400">
              Multipath refraction. Inertial dead-reckoning failover.
            </p>
          </button>
        </div>
      </div>

      {/* Anomaly Callout Banner (Appears if excursion or delay is active) */}
      {(isExcursion || isTrafficDelay) && (
        <div className="bg-rose-950/50 border border-rose-500/60 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg shadow-rose-950/30">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-rose-600 text-white shrink-0">
              <AlertTriangle className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                CRITICAL IN-TRANSIT ANOMALY DETECTED
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-900 text-rose-200 border border-rose-700">
                  {isExcursion ? 'Thermal Excursion' : 'Severe Delay'}
                </span>
              </h4>
              <p className="text-xs text-rose-200 mt-1 max-w-2xl">
                {isExcursion && `Cargo temperature (${telemetry.temperatureC}°C) breached maximum threshold (4.0°C). Accelerated decay indicates product will spoil before reaching primary destination.`}
                {isTrafficDelay && `Heavy gridlock increased destination ETA to ${telemetry.currentEtaHours} hours. Remaining shelf life is insufficient.`}
              </p>
            </div>
          </div>

          <button
            onClick={onProceedToStep5}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shrink-0 shadow-lg shadow-rose-900/40"
          >
            <span>Launch Failure Prediction & Auto-Recovery (Step 5)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Grid: Live Telemetry Gauges (6 Cols) vs Telemetry History / JSON Stream (6 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 4 Live Sensor Gauges (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Gauge 1: Cargo Temperature */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 relative overflow-hidden">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-slate-400">Cargo Temperature</span>
                <Thermometer className={`w-4 h-4 ${isExcursion ? 'text-rose-400' : 'text-emerald-400'}`} />
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className={`text-3xl font-black font-mono tabular-nums ${isExcursion ? 'text-rose-400' : 'text-white'}`}>
                  {telemetry.temperatureC.toFixed(1)}
                </span>
                <span className="text-sm font-semibold text-slate-400">°C</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-400 flex justify-between">
                <span>Safe Range: 2.0°C - 5.0°C</span>
                <span className={isExcursion ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                  {isExcursion ? 'EXCURSION' : 'NOMINAL'}
                </span>
              </div>
            </div>

            {/* Gauge 2: Relative Humidity */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-slate-400">Reefer Humidity</span>
                <Droplets className="w-4 h-4 text-teal-400" />
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-3xl font-black font-mono text-white tabular-nums">
                  {telemetry.humidityPct}
                </span>
                <span className="text-sm font-semibold text-slate-400">%</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-400 flex justify-between">
                <span>Target: 85% - 90%</span>
                <span className="text-emerald-400">Controlled</span>
              </div>
            </div>

            {/* Gauge 3: Vehicle Speed & Vibration */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-slate-400">Ground Speed</span>
                <Gauge className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className={`text-3xl font-black font-mono tabular-nums ${telemetry.speedKmh < 10 ? 'text-amber-400' : 'text-white'}`}>
                  {telemetry.speedKmh}
                </span>
                <span className="text-sm font-semibold text-slate-400">km/h</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-400 flex justify-between">
                <span>Vibration: {telemetry.vibrationG}g</span>
                <span className="font-mono text-slate-300">{telemetry.trafficStatus.split(' ')[0]}</span>
              </div>
            </div>

            {/* Gauge 4: Destination ETA Countdown */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4">
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-slate-400">Destination ETA</span>
                <Clock className={`w-4 h-4 ${telemetry.currentEtaHours > 4.5 ? 'text-amber-400' : 'text-emerald-400'}`} />
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className={`text-3xl font-black font-mono tabular-nums ${telemetry.currentEtaHours > 4.5 ? 'text-amber-400' : 'text-white'}`}>
                  {telemetry.currentEtaHours.toFixed(1)}
                </span>
                <span className="text-sm font-semibold text-slate-400">hours</span>
              </div>
              <div className="mt-2 text-[11px] text-slate-400 flex justify-between">
                <span>Driver: {telemetry.driverName.split(' ')[0]}</span>
                <span className="font-mono text-emerald-400">On Track</span>
              </div>
            </div>
          </div>

          {/* Truck Hardware Spec Box */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 text-xs space-y-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-white">{telemetry.truckId} · {telemetry.licensePlate}</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-300">
                <Battery className="w-3.5 h-3.5 text-emerald-400" />
                <span>{telemetry.batteryPct}% SoC</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-slate-400">
              <div>
                <span>Location:</span>{' '}
                <span className="text-slate-200 font-medium">{telemetry.currentLocationName}</span>
              </div>
              <div>
                <span>Cooling Unit:</span>{' '}
                <span className={`font-semibold ${telemetry.coolingStatus === 'Nominal' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {telemetry.reeferUnitModel} ({telemetry.coolingStatus})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Time-Series Chart & Raw ESP32 Feed (6 Cols) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5">
            {/* View Switcher Tabs */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">In-Transit Telemetry History</h3>
              </div>

              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => setActiveTab('gauges')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                    activeTab === 'gauges' ? 'bg-emerald-800 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Thermal Curve
                </button>
                <button
                  onClick={() => setActiveTab('packet')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                    activeTab === 'packet' ? 'bg-emerald-800 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Raw JSON Feed
                </button>
              </div>
            </div>

            {/* Tab 1: Time Series Temperature History */}
            {activeTab === 'gauges' ? (
              <div className="mt-4 space-y-4">
                <div className="h-44 w-full bg-slate-950 rounded-xl p-3 border border-slate-800 relative">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 320 120" preserveAspectRatio="none">
                    {/* Upper Alarm threshold line (6°C) */}
                    <line x1="0" y1="40" x2="320" y2="40" stroke="#f43f5e" strokeWidth="1" strokeDasharray="3 3" />
                    <text x="315" y="36" fill="#f43f5e" fontSize="8" textAnchor="end" fontFamily="monospace">
                      Max Threshold (6.0°C)
                    </text>

                    {/* Lower threshold line (2°C) */}
                    <line x1="0" y1="95" x2="320" y2="95" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 3" />
                    <text x="315" y="91" fill="#38bdf8" fontSize="8" textAnchor="end" fontFamily="monospace">
                      Min Threshold (2.0°C)
                    </text>

                    {/* Historical Temperature Line */}
                    {telemetry.history.length > 1 && (
                      <polyline
                        fill="none"
                        stroke={isExcursion ? '#f43f5e' : '#10b981'}
                        strokeWidth="3"
                        points={telemetry.history
                          .map((pt, i) => {
                            const x = (i / (telemetry.history.length - 1)) * 320;
                            // scale 0°C to 16°C
                            const y = 120 - ((pt.temperatureC / 16) * 120);
                            return `${x},${Math.max(10, Math.min(115, y))}`;
                          })
                          .join(' ')}
                      />
                    )}

                    {/* Current Dot */}
                    <circle
                      cx="320"
                      cy={120 - ((telemetry.temperatureC / 16) * 120)}
                      r="5"
                      fill={isExcursion ? '#f43f5e' : '#10b981'}
                      className="animate-ping"
                    />
                  </svg>

                  <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1 font-mono">
                    <span>18:00</span>
                    <span>18:30</span>
                    <span>19:00</span>
                    <span>19:30</span>
                    <span className="text-white font-bold">Now ({telemetry.temperatureC.toFixed(1)}°C)</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex justify-between items-center">
                  <span className="text-slate-400">Sampling Rate:</span>
                  <span className="font-mono text-emerald-400">100 ms ADC / 2.5s MQTT Publish</span>
                </div>
              </div>
            ) : (
              /* Tab 2: Raw ESP32 JSON Stream Viewer */
              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-center text-[11px] text-slate-400">
                  <span className="font-mono">MQTT Topic: /iot/reefer/{telemetry.truckId}/telemetry</span>
                  <button
                    onClick={handleCopyPacket}
                    className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
                  >
                    {copied ? 'Copied!' : 'Copy JSON'}
                  </button>
                </div>
                <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 font-mono text-[11px] text-emerald-400 max-h-48 overflow-y-auto leading-relaxed">
                  <pre>{JSON.stringify(rawPacket, null, 2)}</pre>
                </div>
              </div>
            )}

            {/* Next Step CTA */}
            <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Predictive failover engine standby.
              </span>
              <button
                onClick={onProceedToStep5}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/30"
              >
                <span>Evaluate Failure & Recovery (Step 5)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
