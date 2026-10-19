export type ProductType = 'tomatoes' | 'milk' | 'meat' | 'pharma' | 'packaged';

export type QualityGrade = 'Grade A (Fresh)' | 'Grade B (Near Expiry)' | 'Rejected';

export type UrgencyTier = 'Green' | 'Yellow' | 'Red';

export type IncidentType = 'normal' | 'temp_excursion' | 'traffic_gridlock' | 'gps_drift';

export interface InspectionParameters {
  colorRipe: number; // 0-100%
  spotBlemish: number; // 0-100% (lower is better, or inverted)
  surfaceDamage: number; // 0-100% (lower is better)
  packagingIntegrity: number; // 0-100%
  // Specific physical checks
  firmnessShore: number; // For tomatoes/meat
  phOrBrix: number; // pH for milk/meat, Brix for tomatoes
  coreTempC: number;
}

export interface CandidateDestination {
  id: string;
  name: string;
  type: 'Central Mega DC' | 'Local Retail Outlets' | 'B2B Food Processor' | 'Quick Commerce Dark Store' | 'Cold Storage Buffer';
  location: string;
  distanceKm: number;
  travelTimeHours: number;
  transportCostInr: number;
  demandUrgency: 'High' | 'Medium' | 'Critical';
  purchasePricePerKg: number;
  freshnessMarginHours: number;
  feasibilityScore: number; // 0-100
  aiRationale: string;
  isRecommended: boolean;
}

export interface TelemetryPoint {
  timestamp: string;
  temperatureC: number;
  humidityPct: number;
  speedKmh: number;
  vibrationG: number;
  eventNote?: string;
}

export interface TruckTelemetry {
  truckId: string;
  driverName: string;
  licensePlate: string;
  reeferUnitModel: string;
  currentCoords: { lat: number; lng: number };
  currentLocationName: string;
  batteryPct: number;
  temperatureC: number;
  humidityPct: number;
  speedKmh: number;
  vibrationG: number;
  coolingStatus: 'Nominal' | 'Compressor Fault' | 'Auxiliary Power';
  gpsStatus: 'Locked' | 'Multipath Drift' | 'Dead Reckoning';
  trafficStatus: 'Clear' | 'Congestion (+1.5h)' | 'Heavy Gridlock (+4.5h)' | 'Clear (Rerouted)';
  currentEtaHours: number;
  history: TelemetryPoint[];
}

export interface RecoveryActionPlan {
  anomalyDetected: boolean;
  incidentType: IncidentType;
  diagnosticTitle: string;
  diagnosticDetails: string;
  thermalDecayVelocity: string; // e.g. "+1.8°C / hr"
  remainingShelfLifeHours: number;
  destinationEtaHours: number;
  freshnessMarginHours: number; // remaining - ETA
  isFailurePredicted: boolean;
  recoveryStep: 'idle' | 'analyzing' | 'rerouting' | 'dispatching_replacement' | 'completed';
  rerouteDestination: {
    hubName: string;
    hubType: string;
    distanceKm: number;
    travelTimeHours: number;
    offloadPricePerKg: number;
    salvagedValueInr: number;
    originalValueInr: number;
    wastePreventedKg: number;
  };
  replacementDispatch: {
    originWarehouse: string;
    poNumber: string;
    sapMaterialDoc: string;
    destinationBuyer: string;
    etaHours: number;
    status: string;
  };
}

export interface BatchItem {
  id: string;
  batchNumber: string;
  productName: string;
  productType: ProductType;
  categoryLabel: string;
  quantityKg: number;
  invoiceValueInr: number;
  originHub: string;
  originLocation: string;
  targetDestination: string;
  harvestOrPackDate: string;
  inspectionParams: InspectionParameters;
  qualityScore: number;
  grade: QualityGrade;
  targetTempC: number;
  currentStorageTempC: number;
  ambientHumidityPct: number;
  ethyleneSensitivity: 'Low' | 'Medium' | 'High';
  remainingHours: number;
  urgencyTier: UrgencyTier;
  shelfLifeDays: number;
  imagePath: string;
  candidateDestinations: CandidateDestination[];
  selectedDestinationId: string;
  truckTelemetry: TruckTelemetry;
  recoveryPlan: RecoveryActionPlan;
}

export interface SustainabilityMetrics {
  totalWastePreventedKg: number;
  scope3Co2AvoidedTons: number;
  financialSavedInr: number;
  resilienceScorePct: number;
  totalTripsMonitored: number;
  anomaliesAutoResolved: number;
  categoryWasteAvoided: {
    category: string;
    kg: number;
    co2eTons: number;
    inrSaved: number;
  }[];
  monthlyTrends: {
    month: string;
    wastePreventedKg: number;
    co2eTons: number;
    salvageValueInr: number;
  }[];
  recentSalvagedShipments: {
    batchId: string;
    product: string;
    recoveredAt: string;
    hubRerouted: string;
    kgSaved: number;
    co2eSavedTons: number;
    financialSalvagedInr: number;
    actionTaken: string;
  }[];
}
