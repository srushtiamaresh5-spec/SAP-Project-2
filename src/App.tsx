/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { INITIAL_BATCHES, INITIAL_SUSTAINABILITY_METRICS } from './data/mockData';
import { 
  BatchItem, 
  InspectionParameters, 
  IncidentType, 
  UrgencyTier, 
  SustainabilityMetrics 
} from './types/supplyChain';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { Step1QualityInspection } from './components/steps/Step1QualityInspection';
import { Step2RemainingLife } from './components/steps/Step2RemainingLife';
import { Step3DestinationSelection } from './components/steps/Step3DestinationSelection';
import { Step4TruckTelemetry } from './components/steps/Step4TruckTelemetry';
import { Step5FailurePrediction } from './components/steps/Step5FailurePrediction';
import { Step6SustainabilityDashboard } from './components/steps/Step6SustainabilityDashboard';
import { ReportModal } from './components/common/ReportModal';

export default function App() {
  const [batches, setBatches] = useState<BatchItem[]>(INITIAL_BATCHES);
  const [selectedBatchId, setSelectedBatchId] = useState<string>('BAT-TOM-991');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [metrics, setMetrics] = useState<SustainabilityMetrics>(INITIAL_SUSTAINABILITY_METRICS);

  // Active batch selector
  const activeBatch = batches.find((b) => b.id === selectedBatchId) || batches[0];

  // Live simulation tick (simulating IoT ESP32 sensor transmission every 2.5s)
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setBatches((prevBatches) =>
        prevBatches.map((b) => {
          if (b.id !== selectedBatchId) return b;

          const currentTemp = b.truckTelemetry.temperatureC;
          const currentIncident = b.recoveryPlan.incidentType;

          // Micro-fluctuation
          let newTemp = currentTemp;
          if (currentIncident === 'normal') {
            // Jitter around target ±0.15°C
            const delta = (Math.random() - 0.5) * 0.2;
            newTemp = Number(Math.max(2.5, Math.min(5.2, currentTemp + delta)).toFixed(1));
          } else if (currentIncident === 'temp_excursion') {
            // Excursion drift upward
            if (currentTemp < 13.8) {
              newTemp = Number((currentTemp + 0.1).toFixed(1));
            }
          }

          const currentHum = b.truckTelemetry.humidityPct;
          const newHum = Math.min(96, Math.max(70, currentHum + Math.floor((Math.random() - 0.5) * 2)));

          const currentSpeed = b.truckTelemetry.speedKmh;
          const newSpeed = currentIncident === 'traffic_gridlock' 
            ? Math.max(3, Math.min(10, currentSpeed + Math.floor((Math.random() - 0.5) * 2)))
            : Math.max(45, Math.min(68, currentSpeed + Math.floor((Math.random() - 0.5) * 3)));

          const newTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

          const newHistory = [
            ...b.truckTelemetry.history.slice(-8),
            {
              timestamp: newTimestamp,
              temperatureC: newTemp,
              humidityPct: newHum,
              speedKmh: newSpeed,
              vibrationG: Number((0.15 + Math.random() * 0.08).toFixed(2)),
            },
          ];

          return {
            ...b,
            truckTelemetry: {
              ...b.truckTelemetry,
              temperatureC: newTemp,
              humidityPct: newHum,
              speedKmh: newSpeed,
              history: newHistory,
            },
          };
        })
      );
    }, 2500);

    return () => clearInterval(interval);
  }, [isSimulating, selectedBatchId]);

  // Step 1: Update batch inspection parameters
  const handleUpdateBatchParams = (params: InspectionParameters) => {
    // Weighted score recalculation
    const colorWeight = params.colorRipe * 0.25;
    const spotPenalty = (100 - params.spotBlemish) * 0.20;
    const damagePenalty = (100 - params.surfaceDamage) * 0.20;
    const pkgWeight = params.packagingIntegrity * 0.15;
    const physicalWeight = params.firmnessShore * 0.20;

    let score = Math.round(colorWeight + spotPenalty + damagePenalty + pkgWeight + physicalWeight);
    if (score > 100) score = 100;
    if (score < 0) score = 0;

    const grade = score >= 80 ? 'Grade A (Fresh)' : score >= 50 ? 'Grade B (Near Expiry)' : 'Rejected';

    setBatches((prev) =>
      prev.map((b) => (b.id === selectedBatchId ? { ...b, inspectionParams: params, qualityScore: score, grade } : b))
    );
  };

  // Step 2: Update storage conditions & remaining shelf life
  const handleUpdateStorageConditions = (tempC: number, humidityPct: number, remainingHours: number, tier: UrgencyTier) => {
    setBatches((prev) =>
      prev.map((b) => {
        if (b.id !== selectedBatchId) return b;
        return {
          ...b,
          currentStorageTempC: tempC,
          ambientHumidityPct: humidityPct,
          remainingHours,
          urgencyTier: tier,
          shelfLifeDays: Number((remainingHours / 24).toFixed(1)),
        };
      })
    );
  };

  // Step 3: Destination selection
  const handleSelectDestination = (destId: string) => {
    setBatches((prev) =>
      prev.map((b) => {
        if (b.id !== selectedBatchId) return b;
        const dest = b.candidateDestinations.find((d) => d.id === destId);
        return {
          ...b,
          selectedDestinationId: destId,
          targetDestination: dest ? dest.name : b.targetDestination,
        };
      })
    );
  };

  // Step 4: Transit incident simulation
  const handleSimulateIncident = (incident: IncidentType) => {
    setBatches((prev) =>
      prev.map((b) => {
        if (b.id !== selectedBatchId) return b;

        if (incident === 'normal') {
          return {
            ...b,
            truckTelemetry: {
              ...b.truckTelemetry,
              temperatureC: 4.8,
              coolingStatus: 'Nominal',
              speedKmh: 56,
              trafficStatus: 'Clear',
              currentEtaHours: 2.6,
            },
            recoveryPlan: {
              ...b.recoveryPlan,
              anomalyDetected: false,
              incidentType: 'normal',
              diagnosticTitle: 'Nominal Cold-Chain Operation',
              diagnosticDetails: 'Cargo temperature and humidity are tightly bounded within optimal envelope. Positive freshness margin: +141.4 hours.',
              thermalDecayVelocity: '+0.05°C / hr (Nominal)',
              remainingShelfLifeHours: 144,
              destinationEtaHours: 2.6,
              freshnessMarginHours: 141.4,
              isFailurePredicted: false,
              recoveryStep: 'idle',
            },
          };
        } else if (incident === 'temp_excursion') {
          return {
            ...b,
            truckTelemetry: {
              ...b.truckTelemetry,
              temperatureC: 12.8,
              coolingStatus: 'Compressor Fault',
              speedKmh: 58,
              trafficStatus: 'Clear',
              currentEtaHours: 4.8,
            },
            recoveryPlan: {
              ...b.recoveryPlan,
              anomalyDetected: true,
              incidentType: 'temp_excursion',
              diagnosticTitle: 'Critical Reefer Compressor Failure & Thermal Excursion',
              diagnosticDetails: 'Cargo temperature spiked to 12.8°C (Threshold 4.0°C). Accelerated microbial kinetics indicates tomato batch will reach unmarketable rot stage in 3.1 hours, but primary Nelamangala DC ETA is 4.8 hours!',
              thermalDecayVelocity: '+1.85°C / hr (Severe Decay Velocity)',
              remainingShelfLifeHours: 3.1,
              destinationEtaHours: 4.8,
              freshnessMarginHours: -1.7, // Negative Freshness Margin!
              isFailurePredicted: true,
              recoveryStep: 'analyzing',
            },
          };
        } else if (incident === 'traffic_gridlock') {
          return {
            ...b,
            truckTelemetry: {
              ...b.truckTelemetry,
              temperatureC: 5.6,
              coolingStatus: 'Nominal',
              speedKmh: 5,
              trafficStatus: 'Heavy Gridlock (+4.5h)',
              currentEtaHours: 7.1,
            },
            recoveryPlan: {
              ...b.recoveryPlan,
              anomalyDetected: true,
              incidentType: 'traffic_gridlock',
              diagnosticTitle: 'NH-48 Traffic Gridlock Incident & Extended Exposure',
              diagnosticDetails: 'Major accident on Bangalore Outer Ring Road stalled reefer truck. ETA surged from 2.6 hours to 7.1 hours. Extended engine idling limits reefer battery reserves.',
              thermalDecayVelocity: '+0.45°C / hr',
              remainingShelfLifeHours: 5.4,
              destinationEtaHours: 7.1,
              freshnessMarginHours: -1.7,
              isFailurePredicted: true,
              recoveryStep: 'analyzing',
            },
          };
        } else {
          // GPS drift
          return {
            ...b,
            truckTelemetry: {
              ...b.truckTelemetry,
              gpsStatus: 'Multipath Drift',
            },
            recoveryPlan: {
              ...b.recoveryPlan,
              anomalyDetected: false,
              incidentType: 'gps_drift',
              diagnosticTitle: 'GPS Multipath Signal Drift (Tunnels/Hilly Corridor)',
              diagnosticDetails: 'Dead-reckoning inertial sensors engaged. Waypoint lock maintained via cellular triangulation.',
              thermalDecayVelocity: '+0.05°C / hr',
              remainingShelfLifeHours: b.remainingHours,
              destinationEtaHours: b.truckTelemetry.currentEtaHours,
              freshnessMarginHours: b.remainingHours - b.truckTelemetry.currentEtaHours,
              isFailurePredicted: false,
              recoveryStep: 'idle',
            },
          };
        }
      })
    );
  };

  // Step 5: Execute Autonomous SAP Recovery Protocol
  const handleExecuteRecovery = () => {
    setBatches((prev) =>
      prev.map((b) => {
        if (b.id !== selectedBatchId) return b;
        return {
          ...b,
          recoveryPlan: {
            ...b.recoveryPlan,
            recoveryStep: 'completed',
            anomalyDetected: false,
          },
          targetDestination: b.recoveryPlan.rerouteDestination.hubName,
          truckTelemetry: {
            ...b.truckTelemetry,
            currentLocationName: 'Hoskote Industrial Bypass - Diverted to Kissan Plant',
            currentEtaHours: 0.7,
            trafficStatus: 'Clear (Rerouted)',
          },
        };
      })
    );

    // Update sustainability metrics dynamically
    setMetrics((prev) => ({
      ...prev,
      totalWastePreventedKg: prev.totalWastePreventedKg + 2400,
      scope3Co2AvoidedTons: Number((prev.scope3Co2AvoidedTons + 4.58).toFixed(2)),
      financialSavedInr: prev.financialSavedInr + 76800,
      anomaliesAutoResolved: prev.anomaliesAutoResolved + 1,
      resilienceScorePct: 98.4,
    }));
  };

  // Reset current batch simulation state
  const handleResetSimulation = () => {
    setBatches(INITIAL_BATCHES);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Banner / Header */}
      <Header
        batches={batches}
        selectedBatchId={selectedBatchId}
        onSelectBatch={(id) => setSelectedBatchId(id)}
        isSimulating={isSimulating}
        onToggleSimulation={() => setIsSimulating(!isSimulating)}
        onResetSimulation={handleResetSimulation}
        onOpenReport={() => setIsReportOpen(true)}
        currentStep={currentStep}
      />

      {/* Main Workspace: Sidebar + 6-Step Content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Persistent 6-Step Left Sidebar Navigation */}
        <Sidebar
          currentStep={currentStep}
          onSelectStep={(step) => setCurrentStep(step)}
          activeBatch={activeBatch}
        />

        {/* Viewport: Active Step Screen */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto max-w-7xl">
          {currentStep === 1 && (
            <Step1QualityInspection
              activeBatch={activeBatch}
              onUpdateBatchParams={handleUpdateBatchParams}
              onProceedToStep2={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 2 && (
            <Step2RemainingLife
              activeBatch={activeBatch}
              allBatches={batches}
              onUpdateStorageConditions={handleUpdateStorageConditions}
              onProceedToStep3={() => setCurrentStep(3)}
              onSelectBatch={(id) => setSelectedBatchId(id)}
            />
          )}

          {currentStep === 3 && (
            <Step3DestinationSelection
              activeBatch={activeBatch}
              onSelectDestination={handleSelectDestination}
              onProceedToStep4={() => setCurrentStep(4)}
            />
          )}

          {currentStep === 4 && (
            <Step4TruckTelemetry
              activeBatch={activeBatch}
              onSimulateIncident={handleSimulateIncident}
              onProceedToStep5={() => setCurrentStep(5)}
              isSimulating={isSimulating}
              onToggleSimulation={() => setIsSimulating(!isSimulating)}
            />
          )}

          {currentStep === 5 && (
            <Step5FailurePrediction
              activeBatch={activeBatch}
              onExecuteRecovery={handleExecuteRecovery}
              onProceedToStep6={() => setCurrentStep(6)}
            />
          )}

          {currentStep === 6 && (
            <Step6SustainabilityDashboard
              metrics={metrics}
              onOpenReport={() => setIsReportOpen(true)}
              onJumpToStep={(step) => setCurrentStep(step)}
            />
          )}
        </main>
      </div>

      {/* Printable / Downloadable SAP ESG Audit Report Modal */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        metrics={metrics}
        activeBatch={activeBatch}
      />
    </div>
  );
}
