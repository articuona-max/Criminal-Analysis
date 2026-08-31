import { CaseId } from '../types';

// ============================================================================
// 1. 4D SPATIO-TEMPORAL VESSEL & FREIGHT TELEMETRY DATA
// ============================================================================

export interface TelemetryWaypoint {
  id: string;
  timestamp: string; // ISO date string or formatted
  lat: number;
  lng: number;
  locationName: string;
  speedKts: number;
  headingDeg: number;
  telemetryType: 'AIS_SATELLITE' | 'PORT_RADAR' | 'FASTTAG_TOLL' | 'CELL_TOWER_CDR' | 'CUSTOMS_SCANNER';
  sealStatus: 'SEAL_INTACT' | 'SEAL_TAMPERED' | 'SEAL_BROKEN' | 'CUSTOMS_SEIZED';
  notes: string;
  sensorMetadata?: {
    carrierSignal?: string;
    temperatureC?: number;
    weightMetricTons?: number;
    containerNumber?: string;
  };
}

export interface TelemetryTrack {
  id: string;
  caseId: CaseId;
  assetName: string;
  assetType: 'VESSEL' | 'CONTAINER_TRUCK' | 'DHOW_SPEEDBOAT' | 'COURIER_FLIGHT' | 'RAIL_FREIGHT';
  assetCode: string;
  imoOrReg: string;
  callsign: string;
  color: string;
  dangerLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  description: string;
  cargoManifest: string;
  totalDistanceKm: number;
  waypoints: TelemetryWaypoint[];
}

export const REAL_4D_TRACKS: TelemetryTrack[] = [
  {
    id: 'track-msc-algeciras',
    caseId: 'CASE_MUNDRA_TALC',
    assetName: 'Feeder Container Ship MSC Algeciras',
    assetType: 'VESSEL',
    assetCode: 'VESSEL-MSC-ALG-992',
    imoOrReg: 'IMO 9745120',
    callsign: '3FYE9 (Panama Flag)',
    color: '#DC2626',
    dangerLevel: 'CRITICAL',
    description: 'Carried 2x40ft containers GSTU3294827 & GSTU3294832 loaded with 2,988.21 kg heroin base under declared semi-cut talc stone.',
    cargoManifest: '40ft Dry High-Cube: Semi-cut Talc Stones (Declared Gross: 38,000 kg). Consignor: Hasan Husain Ltd (Kandahar). Consignee: Aashi Trading Co (Vijayawada).',
    totalDistanceKm: 1420,
    waypoints: [
      {
        id: 'wp-alg-1',
        timestamp: '2021-08-28T04:00:00Z',
        lat: 31.6289,
        lng: 65.7372,
        locationName: 'Helmand / Kandahar Chemical Lab Depot',
        speedKts: 0,
        headingDeg: 270,
        telemetryType: 'CUSTOMS_SCANNER',
        sealStatus: 'SEAL_INTACT',
        notes: 'Raw diacetylmorphine mixed with industrial talc powder and packed into 40-foot container sacks.',
        sensorMetadata: { weightMetricTons: 38.2, containerNumber: 'GSTU3294827' }
      },
      {
        id: 'wp-alg-2',
        timestamp: '2021-08-30T14:30:00Z',
        lat: 34.6644,
        lng: 61.0744,
        locationName: 'Islam Qala Border Cross-dock (Afghan-Iran)',
        speedKts: 35,
        headingDeg: 240,
        telemetryType: 'FASTTAG_TOLL',
        sealStatus: 'SEAL_INTACT',
        notes: 'Overland cross-border convoy transit without physical inspection under transit TIR carnet.',
        sensorMetadata: { weightMetricTons: 38.2, containerNumber: 'GSTU3294827' }
      },
      {
        id: 'wp-alg-3',
        timestamp: '2021-09-03T09:15:00Z',
        lat: 27.1832,
        lng: 56.2666,
        locationName: 'Shahid Rajaee Port Berth 4, Bandar Abbas',
        speedKts: 0,
        headingDeg: 160,
        telemetryType: 'PORT_RADAR',
        sealStatus: 'SEAL_INTACT',
        notes: 'Container loaded onto feeder vessel MSC Algeciras with false port manifest indicating pure commercial mineral shipment.',
        sensorMetadata: { carrierSignal: 'AIS Class A (MMSI 355912000)', weightMetricTons: 38.2, containerNumber: 'GSTU3294827' }
      },
      {
        id: 'wp-alg-4',
        timestamp: '2021-09-06T18:00:00Z',
        lat: 26.0500,
        lng: 56.5500,
        locationName: 'Strait of Hormuz International Outbound Lane',
        speedKts: 16.4,
        headingDeg: 145,
        telemetryType: 'AIS_SATELLITE',
        sealStatus: 'SEAL_INTACT',
        notes: 'AIS satellite telemetry confirms continuous cruising at 16.4 knots along the primary maritime transit corridor.',
        sensorMetadata: { carrierSignal: 'AIS-SAT-9908', containerNumber: 'GSTU3294827' }
      },
      {
        id: 'wp-alg-5',
        timestamp: '2021-09-09T08:20:00Z',
        lat: 23.8500,
        lng: 64.2000,
        locationName: 'Arabian Sea High-Seas Waypoint Alpha',
        speedKts: 17.1,
        headingDeg: 115,
        telemetryType: 'AIS_SATELLITE',
        sealStatus: 'SEAL_INTACT',
        notes: 'Encountered scheduled rendezvous with Iranian flag dhow Al-Noor 40nm south of Gwadar (rendezvous unconfirmed).',
        sensorMetadata: { carrierSignal: 'AIS-SAT-9908', containerNumber: 'GSTU3294827' }
      },
      {
        id: 'wp-alg-6',
        timestamp: '2021-09-12T23:45:00Z',
        lat: 22.8395,
        lng: 69.7042,
        locationName: 'Mundra Port Container Terminal 4 (Berth 2)',
        speedKts: 0,
        headingDeg: 90,
        telemetryType: 'PORT_RADAR',
        sealStatus: 'SEAL_INTACT',
        notes: 'Containers offloaded from vessel onto Mundra wharf staging yard under Customs Bill of Entry 5482910.',
        sensorMetadata: { carrierSignal: 'Mundra Port VTS Terminal 4', weightMetricTons: 38.2, containerNumber: 'GSTU3294827' }
      },
      {
        id: 'wp-alg-7',
        timestamp: '2021-09-14T11:00:00Z',
        lat: 22.8450,
        lng: 69.7120,
        locationName: 'Mundra Customs Drive-Through X-Ray Facility',
        speedKts: 5,
        headingDeg: 0,
        telemetryType: 'CUSTOMS_SCANNER',
        sealStatus: 'SEAL_TAMPERED',
        notes: 'Density scanner flags anomalous organic core within talc stone bags. DRI narcotics squad intercepts container for physical slit-test.',
        sensorMetadata: { carrierSignal: 'Smiths Heimann HCV-G Scanner', weightMetricTons: 38.2, containerNumber: 'GSTU3294827' }
      },
      {
        id: 'wp-alg-8',
        timestamp: '2021-09-16T16:30:00Z',
        lat: 22.8480,
        lng: 69.7150,
        locationName: 'DRI Kutch Zonal Seizure Warehouse',
        speedKts: 0,
        headingDeg: 0,
        telemetryType: 'CUSTOMS_SCANNER',
        sealStatus: 'CUSTOMS_SEIZED',
        notes: '2,988.21 kg heroin base seized under NDPS Act. Valued at ₹21,000 Crore ($2.7B). CRCL Chemical Assay confirms 99.4% purity.',
        sensorMetadata: { carrierSignal: 'DRI Seizure Memo RC-26/2021', weightMetricTons: 2.988, containerNumber: 'GSTU3294827' }
      }
    ]
  },
  {
    id: 'track-freight-truck-mh04',
    caseId: 'CASE_MUNDRA_TALC',
    assetName: 'Overland Semi-Trailer Truck MH-04-GP-9120',
    assetType: 'CONTAINER_TRUCK',
    assetCode: 'TRUCK-MH04-GP-9120',
    imoOrReg: 'MH-04-GP-9120 (Ashok Leyland 4018)',
    callsign: 'Malhotra Freight Logistics Fleet 14',
    color: '#D97706',
    dangerLevel: 'HIGH',
    description: 'Dispatched from Bhiwandi logistics hub to Mundra port to load cleared talc cargo for onward transit to Delhi NCR safehouse.',
    cargoManifest: 'Declared: 40ft Container Sacks Semi-processed Industrial Minerals. Destination: Alipur Warehouse Delhi NCR.',
    totalDistanceKm: 1180,
    waypoints: [
      {
        id: 'wp-truck-1',
        timestamp: '2021-09-10T06:00:00Z',
        lat: 19.2968,
        lng: 73.0631,
        locationName: 'Bhiwandi Storage & Freight Complex 14 (Thane)',
        speedKts: 0,
        headingDeg: 340,
        telemetryType: 'CELL_TOWER_CDR',
        sealStatus: 'SEAL_INTACT',
        notes: 'Truck driver Bunty Rao receives Anōm encrypted handset message with GPS coordinates of Mundra freight station.',
        sensorMetadata: { carrierSignal: 'Jio Tower THN-BHW-04', weightMetricTons: 14.5 }
      },
      {
        id: 'wp-truck-2',
        timestamp: '2021-09-11T02:15:00Z',
        lat: 21.1702,
        lng: 72.8311,
        locationName: 'Surat Kamrej Toll Plaza (NH-48)',
        speedKts: 52,
        headingDeg: 350,
        telemetryType: 'FASTTAG_TOLL',
        sealStatus: 'SEAL_INTACT',
        notes: 'FastTag toll transaction logged. Driver switched phone off between Bharuch and Vadodara.',
        sensorMetadata: { carrierSignal: 'FastTag Lane 04 (Toll ID ST-KMJ-992)' }
      },
      {
        id: 'wp-truck-3',
        timestamp: '2021-09-11T14:40:00Z',
        lat: 23.2500,
        lng: 70.5000,
        locationName: 'Samakhiali Junction Toll Plaza (Kutch Corridor)',
        speedKts: 48,
        headingDeg: 280,
        telemetryType: 'FASTTAG_TOLL',
        sealStatus: 'SEAL_INTACT',
        notes: 'Entering Kutch district via national highway corridor towards Gandhidham CFS.',
        sensorMetadata: { carrierSignal: 'FastTag Lane 02 (Toll ID KCH-SMK-01)' }
      },
      {
        id: 'wp-truck-4',
        timestamp: '2021-09-12T08:00:00Z',
        lat: 23.0753,
        lng: 70.1337,
        locationName: 'Gandhidham Inland Container Depot Staging Area',
        speedKts: 0,
        headingDeg: 240,
        telemetryType: 'PORT_RADAR',
        sealStatus: 'SEAL_INTACT',
        notes: 'Waiting for customs clearance release message before proceeding to Mundra dock gate 4.',
        sensorMetadata: { carrierSignal: 'Gandhidham Yard Telemetry' }
      },
      {
        id: 'wp-truck-5',
        timestamp: '2021-09-14T18:00:00Z',
        lat: 23.0753,
        lng: 70.1337,
        locationName: 'Gandhidham Yard Intercept & Driver Arrest',
        speedKts: 0,
        headingDeg: 0,
        telemetryType: 'CELL_TOWER_CDR',
        sealStatus: 'CUSTOMS_SEIZED',
        notes: 'Driver intercepted by DRI squad after Mundra seizure. Forged E-way bills and fake Delhi consignee papers recovered.',
        sensorMetadata: { carrierSignal: 'DRI Raiding Party Alpha' }
      }
    ]
  },
  {
    id: 'track-dhow-al-noor',
    caseId: 'CASE_MUNDRA_TALC',
    assetName: 'High-Speed Coastal Dhow Al-Noor',
    assetType: 'DHOW_SPEEDBOAT',
    assetCode: 'DHOW-AL-NOOR-07',
    imoOrReg: 'Unregistered Wooden Hull / Twin Yamaha 300HP',
    callsign: 'Shadow Dhow (AIS Transponder Disabled)',
    color: '#7C3AED',
    dangerLevel: 'CRITICAL',
    description: 'Suspected maritime diversion dhow operating off Gujarat and Maharashtra territorial waters for high-seas mid-voyage drop-offs.',
    cargoManifest: 'Contraband diacetylmorphine high-grade waterproof bricks packed in blue polymer containers.',
    totalDistanceKm: 680,
    waypoints: [
      {
        id: 'wp-dhow-1',
        timestamp: '2021-09-08T22:00:00Z',
        lat: 25.1000,
        lng: 62.3000,
        locationName: 'Gwadar Deep Offshore Anchorage',
        speedKts: 24,
        headingDeg: 130,
        telemetryType: 'PORT_RADAR',
        sealStatus: 'SEAL_INTACT',
        notes: 'Coast Guard radar detects fast-moving wooden dhow exiting Makran coast without transmitting AIS identification.',
        sensorMetadata: { carrierSignal: 'Coast Guard Coastal Radar Station Porbandar' }
      },
      {
        id: 'wp-dhow-2',
        timestamp: '2021-09-10T03:30:00Z',
        lat: 21.8000,
        lng: 68.9000,
        locationName: 'Dwarka / Okha Coastal 12NM Territorial Baseline',
        speedKts: 28,
        headingDeg: 155,
        telemetryType: 'PORT_RADAR',
        sealStatus: 'SEAL_INTACT',
        notes: 'Vessel hugging the 12 nautical mile boundary line in sea state 3 to avoid naval patrol interceptors.',
        sensorMetadata: { carrierSignal: 'Okha Radar Station Sweep' }
      },
      {
        id: 'wp-dhow-3',
        timestamp: '2021-09-11T01:45:00Z',
        lat: 18.7997,
        lng: 72.8710,
        locationName: 'Mandwa Jetty & Alibaug Coastal Inlet',
        speedKts: 8,
        headingDeg: 80,
        telemetryType: 'PORT_RADAR',
        sealStatus: 'CUSTOMS_SEIZED',
        notes: 'Intercepted by Indian Coast Guard Interceptor Boat C-404 during nighttime offloading attempt.',
        sensorMetadata: { carrierSignal: 'ICG Interceptor C-404 Log' }
      }
    ]
  }
];

// ============================================================================
// 2. MULTI-JURISDICTION FINANCIAL FLOW ARCS & SANKEY DATA
// ============================================================================

export interface FinancialFlowArc {
  id: string;
  sourceCity: string;
  sourceCoords: [number, number];
  targetCity: string;
  targetCoords: [number, number];
  sourceEntity: string;
  targetEntity: string;
  amountINR: string;
  amountUSD: string;
  transferType: 'SWIFT_LOU' | 'NOSTRO_WIRE' | 'HAWALA_TOKEN' | 'CRYPTO_SETTLEMENT' | 'CIRCULAR_INVOICE';
  swiftMessageTag?: string;
  hawalaTokenId?: string;
  timestamp: string;
  riskScore: number; // 0 - 100
  color: string;
  notes: string;
}

export const REAL_FINANCIAL_FLOW_ARCS: FinancialFlowArc[] = [
  {
    id: 'flow-1-brady-to-dubai',
    sourceCity: 'Fort, Mumbai',
    sourceCoords: [18.9322, 72.8335],
    targetCity: 'Deira, Dubai',
    targetCoords: [25.2697, 55.3015],
    sourceEntity: 'PNB Brady House (Gokulnath Shetty)',
    targetEntity: 'Al-Bahar General Trading LLC',
    amountINR: '₹4,850 Cr',
    amountUSD: '$650 Million',
    transferType: 'SWIFT_LOU',
    swiftMessageTag: 'FIN MT799 / MT742 (Ref: PNB/LOU/2017/8912)',
    timestamp: '2017-06-14',
    riskScore: 98,
    color: '#DC2626',
    notes: 'Fraudulent SWIFT LoU issued without approved credit limits or cash margin, bypassed CBS system.'
  },
  {
    id: 'flow-2-brady-to-hk',
    sourceCity: 'Fort, Mumbai',
    sourceCoords: [18.9322, 72.8335],
    targetCity: 'Central, Hong Kong',
    targetCoords: [22.2819, 114.1581],
    sourceEntity: 'PNB Brady House Branch',
    targetEntity: 'Sunlight Gems HK / Aurum Jewels Ltd',
    amountINR: '₹3,420 Cr',
    amountUSD: '$460 Million',
    transferType: 'NOSTRO_WIRE',
    swiftMessageTag: 'FIN MT103 (Nostro: UBI HK Acct 8829-192)',
    timestamp: '2017-08-22',
    riskScore: 96,
    color: '#EA580C',
    notes: 'Nostro clearing account drawdown to settle fictitious polished diamond invoices.'
  },
  {
    id: 'flow-3-dubai-to-antwerp',
    sourceCity: 'Deira, Dubai',
    sourceCoords: [25.2697, 55.3015],
    targetCity: 'Antwerp Diamond District',
    targetCoords: [51.2155, 4.4172],
    sourceEntity: 'Pacific Diamonds FZE (Dubai)',
    targetEntity: 'Firestar Diamond Belgium BVBA',
    amountINR: '₹1,850 Cr',
    amountUSD: '$250 Million',
    transferType: 'CIRCULAR_INVOICE',
    timestamp: '2017-10-05',
    riskScore: 91,
    color: '#D97706',
    notes: 'Round-tripping inflated diamond rough lots between JLT free zone and Antwerp bourse.'
  },
  {
    id: 'flow-4-dubai-to-london',
    sourceCity: 'Deira, Dubai',
    sourceCoords: [25.2697, 55.3015],
    targetCity: 'Mayfair, London',
    targetCoords: [51.5090, -0.1440],
    sourceEntity: 'Tariq Merchant Hawala Conduit',
    targetEntity: 'Old Bond Street High-Jewelry Flagship & Penthouse',
    amountINR: '₹890 Cr',
    amountUSD: '£95 Million',
    transferType: 'HAWALA_TOKEN',
    hawalaTokenId: 'TOKEN-USD1-SER-L9283710A',
    timestamp: '2017-11-19',
    riskScore: 94,
    color: '#7C3AED',
    notes: 'Hawala cash conversion to acquire 31 Old Bond St boutique inventory and Centre Point penthouse lease.'
  },
  {
    id: 'flow-5-antwerp-to-ny',
    sourceCity: 'Antwerp Diamond District',
    sourceCoords: [51.2155, 4.4172],
    targetCity: 'Manhattan, New York',
    targetCoords: [40.7138, -74.0014],
    sourceEntity: 'Firestar Diamond Belgium',
    targetEntity: 'Firestar Diamond Inc (US Bankruptcy SDNY)',
    amountINR: '₹1,200 Cr',
    amountUSD: '$160 Million',
    transferType: 'CIRCULAR_INVOICE',
    timestamp: '2017-12-10',
    riskScore: 89,
    color: '#2563EB',
    notes: 'Intercompany debt transfer subsequently unraveled by SDNY Bankruptcy Examiner John J. Carney.'
  },
  {
    id: 'flow-6-delhi-to-dubai-hawala',
    sourceCity: 'Chandni Chowk, Delhi',
    sourceCoords: [28.6562, 77.2315],
    targetCity: 'Deira Gold Souk, Dubai',
    targetCoords: [25.2697, 55.3015],
    sourceEntity: 'Soni Bullion Nexus (Kucha Mahajani)',
    targetEntity: 'Al-Bahar General Trading / Gold Bullion Vault',
    amountINR: '₹750 Cr',
    amountUSD: '$100 Million',
    transferType: 'HAWALA_TOKEN',
    hawalaTokenId: 'TOKEN-INR2000-SERIAL-99812A',
    timestamp: '2021-08-15',
    riskScore: 97,
    color: '#E11D48',
    notes: 'Domestic heroin sales proceeds consolidated in Chandni Chowk and cleared via Dubai gold bullion deliveries.'
  }
];

export interface SankeyNodeData {
  id: string;
  name: string;
  stage: 'ORIGIN' | 'CLEARING' | 'OFFSHORE_SHELL' | 'LUXURY_ASSET_SINK';
  category: string;
  amountFormatted: string;
  color: string;
}

export interface SankeyLinkData {
  source: string;
  target: string;
  value: number; // In Crores INR
  label: string;
  mechanism: string;
}

export const SANKEY_DATA = {
  nodes: [
    { id: 'origin_pnb', name: 'PNB Brady House (SWIFT Terminal)', stage: 'ORIGIN', category: 'Bank Branch', amountFormatted: '₹14,356 Cr', color: '#DC2626' },
    { id: 'origin_heroin', name: 'Mundra Contraband Consignment', stage: 'ORIGIN', category: 'Narcotics Base', amountFormatted: '₹21,000 Cr', color: '#B91C1C' },
    { id: 'clear_nostro_hk', name: 'UBI HK & Antwerp Nostro Accounts', stage: 'CLEARING', category: 'Correspondent Bank', amountFormatted: '₹6,400 Cr', color: '#EA580C' },
    { id: 'clear_hawala_delhi', name: 'Chandni Chowk Bullion Nexus', stage: 'CLEARING', category: 'Hawala Ledger', amountFormatted: '₹2,800 Cr', color: '#D97706' },
    { id: 'shell_dubai_albahar', name: 'Dubai Deira Shells (Al-Bahar & Pacific)', stage: 'OFFSHORE_SHELL', category: 'Freezone Front', amountFormatted: '₹5,800 Cr', color: '#7C3AED' },
    { id: 'shell_hk_sunlight', name: 'Hong Kong Dummy Importers (Sunlight Gems)', stage: 'OFFSHORE_SHELL', category: 'HK Shell', amountFormatted: '₹3,400 Cr', color: '#2563EB' },
    { id: 'sink_london_realestate', name: 'London Mayfair & Centre Point Real Estate', stage: 'LUXURY_ASSET_SINK', category: 'UK Property', amountFormatted: '₹1,200 Cr (£120M)', color: '#059669' },
    { id: 'sink_stkitts_cip', name: 'St. Kitts CIP Sanctuary & Caribbean Accounts', stage: 'LUXURY_ASSET_SINK', category: 'Passports & Havens', amountFormatted: '₹850 Cr', color: '#0D9488' },
    { id: 'sink_diamonds_ny', name: 'Manhattan 5th Ave Luxury Diamond Inventory', stage: 'LUXURY_ASSET_SINK', category: 'Diamonds & Stocks', amountFormatted: '₹2,100 Cr', color: '#4338CA' }
  ] as SankeyNodeData[],
  links: [
    { source: 'origin_pnb', target: 'clear_nostro_hk', value: 6400, label: 'SWIFT MT799 LoUs', mechanism: 'Discounted Foreign Buyer Credit' },
    { source: 'origin_pnb', target: 'shell_dubai_albahar', value: 4850, label: 'Direct Wire Diversion', mechanism: 'Fictitious Rough Invoices' },
    { source: 'origin_heroin', target: 'clear_hawala_delhi', value: 2800, label: 'Domestic Wholesale Cash', mechanism: 'Token Hawala Drops' },
    { source: 'clear_nostro_hk', target: 'shell_hk_sunlight', value: 3400, label: 'Nostro Wire Settlement', mechanism: 'Dummy Bill of Lading Discounting' },
    { source: 'clear_nostro_hk', target: 'sink_diamonds_ny', value: 2100, label: 'Chapter 11 Diverted Stock', mechanism: 'US Entity Intercompany Loans' },
    { source: 'clear_hawala_delhi', target: 'shell_dubai_albahar', value: 2400, label: 'Gold Bullion Offset', mechanism: 'Dubai Deira Souk Clearing' },
    { source: 'shell_dubai_albahar', target: 'sink_london_realestate', value: 1200, label: 'Offshore Acquisition', mechanism: 'Mayfair Boutique & High Court Bail Fund' },
    { source: 'shell_dubai_albahar', target: 'sink_stkitts_cip', value: 850, label: 'Passport Investment', mechanism: 'Citizenship by Investment Programme' }
  ] as SankeyLinkData[]
};

// ============================================================================
// 3. TACTICAL GEOFENCING & ISOCHRONE REACHABILITY DATA
// ============================================================================

export interface GeofenceZone {
  id: string;
  name: string;
  code: string;
  type: 'MARITIME_12NM' | 'CUSTOMS_QUARANTINE' | 'FUGITIVE_CURFEW' | 'NARCO_SAFEHOUSE_RING';
  dangerLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  centerLat: number;
  centerLng: number;
  polygonCoords: [number, number][];
  tripwireRules: string;
  activeBreaches: {
    timestamp: string;
    targetName: string;
    details: string;
    status: 'ACTIVE_INTERCEPT' | 'INVESTIGATING' | 'ESCAPED_ZONE';
  }[];
  description: string;
}

export const REAL_GEOFENCES: GeofenceZone[] = [
  {
    id: 'geofence-gujarat-12nm',
    name: 'Kutch-Kathiawar 12NM Maritime Intercept Geofence',
    code: 'GEO-GUJ-12NM',
    type: 'MARITIME_12NM',
    dangerLevel: 'CRITICAL',
    centerLat: 22.84,
    centerLng: 69.45,
    polygonCoords: [
      [23.40, 68.20],
      [23.10, 68.60],
      [22.60, 69.20],
      [22.30, 69.80],
      [22.10, 70.40],
      [22.60, 70.60],
      [23.00, 70.00],
      [23.50, 68.80]
    ],
    tripwireRules: 'Trigger alert on any AIS-dark vessel moving >20 knots crossing from Pakistani or International waters toward Gulf of Kutch.',
    activeBreaches: [
      {
        timestamp: '2021-09-10T03:15:00Z',
        targetName: 'Shadow Dhow Al-Noor',
        details: 'Speed 28 kts heading 155° crossed 12NM outer line near Dwarka radar sector.',
        status: 'ACTIVE_INTERCEPT'
      }
    ],
    description: 'High-surveillance maritime intercept zone monitored by Indian Navy and Coast Guard coastal radar stations.'
  },
  {
    id: 'geofence-mundra-cfs',
    name: 'Mundra Port Container Terminal 4 Customs Quarantine Ring',
    code: 'GEO-MUN-T4-RING',
    type: 'CUSTOMS_QUARANTINE',
    dangerLevel: 'CRITICAL',
    centerLat: 22.845,
    centerLng: 69.71,
    polygonCoords: [
      [22.860, 69.690],
      [22.860, 69.730],
      [22.825, 69.730],
      [22.825, 69.690]
    ],
    tripwireRules: 'Prevent exit of containers flagged with chemical assay discrepancies prior to CRCL laboratory clearance.',
    activeBreaches: [
      {
        timestamp: '2021-09-14T11:05:00Z',
        targetName: 'Container GSTU3294827 & GSTU3294832',
        details: 'Gate release pass revoked by DRI. Quarantine seal applied.',
        status: 'ACTIVE_INTERCEPT'
      }
    ],
    description: 'Customs bonded quarantine perimeter encompassing Berth 2, CFS yard, and vehicle drive-through scanners.'
  },
  {
    id: 'geofence-london-mayfair',
    name: 'London Mayfair & Westminster Fugitive Travel Curfew Zone',
    code: 'GEO-LON-MAYFAIR',
    type: 'FUGITIVE_CURFEW',
    dangerLevel: 'HIGH',
    centerLat: 51.515,
    centerLng: -0.14,
    polygonCoords: [
      [51.530, -0.180],
      [51.530, -0.100],
      [51.490, -0.100],
      [51.490, -0.180]
    ],
    tripwireRules: 'Immediate Metropolitan Police alert on any passport verification, Heathrow/Gatwick booking, or foreign wire trigger for Nirav Modi.',
    activeBreaches: [
      {
        timestamp: '2019-03-19T14:20:00Z',
        targetName: 'Nirav Modi (Fugitive)',
        details: 'Arrested by Met Police Extradition Unit at Metro Bank Holborn branch while attempting to open new account.',
        status: 'ACTIVE_INTERCEPT'
      }
    ],
    description: 'Judicial surveillance zone established under UK Westminster Magistrates Court bail refusal conditions.'
  }
];

export interface IsochroneContour {
  id: string;
  originName: string;
  originCoords: [number, number];
  contours: {
    hours: number;
    color: string;
    fillOpacity: number;
    radiusKm: number;
    description: string;
  }[];
}

export const REAL_ISOCHRONES: IsochroneContour[] = [
  {
    id: 'iso-mundra',
    originName: 'Mundra Port Freight Gate',
    originCoords: [22.8395, 69.7042],
    contours: [
      { hours: 1, color: '#DC2626', fillOpacity: 0.25, radiusKm: 65, description: '1h Transit: Gandhidham, Bhuj & Kandla Port' },
      { hours: 3, color: '#EA580C', fillOpacity: 0.18, radiusKm: 180, description: '3h Transit: Samakhiali, Morbi Ceramic Hub & Rajkot' },
      { hours: 6, color: '#F59E0B', fillOpacity: 0.12, radiusKm: 380, description: '6h Transit: Ahmedabad Ring Road, Vadodara & Palanpur Border' }
    ]
  },
  {
    id: 'iso-bhiwandi',
    originName: 'Bhiwandi Logistics Complex (Thane)',
    originCoords: [19.2968, 73.0631],
    contours: [
      { hours: 1, color: '#DC2626', fillOpacity: 0.25, radiusKm: 45, description: '1h Transit: Mumbai BKC, JNPT Port & Thane' },
      { hours: 3, color: '#EA580C', fillOpacity: 0.18, radiusKm: 150, description: '3h Transit: Pune MIDC, Nashik Highway & Alibaug Coastal' },
      { hours: 6, color: '#F59E0B', fillOpacity: 0.12, radiusKm: 340, description: '6h Transit: Surat Diamond Bourse & Aurangabad' }
    ]
  }
];

// ============================================================================
// 4. CROSS-CASE ENTITY RESOLUTION & SYNDICATE OVERLAP DATA
// ============================================================================

export interface CrossCaseOverlapNode {
  id: string;
  canonicalName: string;
  entityType: 'PERSON' | 'ORGANIZATION' | 'PHONE_TOKEN' | 'BANK_ACCOUNT' | 'FORWARDER';
  participatingCases: {
    caseId: CaseId;
    caseName: string;
    localRole: string;
  }[];
  overlapScore: number; // 0 - 100%
  sharedIndicators: string[];
  resolvedAliases: string[];
  investigativeSignificance: string;
}

export const REAL_CROSS_CASE_OVERLAPS: CrossCaseOverlapNode[] = [
  {
    id: 'overlap-tariq-merchant',
    canonicalName: 'Tariq Merchant (alias Tiger / Al-Dubai)',
    entityType: 'PERSON',
    participatingCases: [
      { caseId: 'CASE_PNB_MODI', caseName: 'PNB $2B LoU Fraud', localRole: 'Offshore Hawala Clearing Broker (Dubai Deira)' },
      { caseId: 'CASE_MUNDRA_TALC', caseName: 'Mundra 3,000kg Heroin', localRole: 'Customs Clearance Paymaster & Cash Consolidator' },
      { caseId: 'CASE_ANOM_TROJAN', caseName: 'Operation Trojan Shield', localRole: 'Anōm Device Distributor (Handle: @deira_vault)' }
    ],
    overlapScore: 98,
    sharedIndicators: [
      'Anōm Encrypted Handset Device ID: ANOM-9920-AFG',
      'Dubai NBD Bank Hawala Account: AE44-0330-9921-8812',
      'Shared WhatsApp Token: +971-50-8912-341',
      'Common Consignee Stamp: Hasan Husain & Al-Bahar Joint Ledger'
    ],
    resolvedAliases: ['Tariq Merchant', 'Tariq Al-Dubai', 'Tiger Merchant', 'T. M. Deira'],
    investigativeSignificance: 'Apex Hawala and encrypted communications broker bridging Indian bank fraud proceeds with Afghan narco-terror consignments.'
  },
  {
    id: 'overlap-malhotra-freight',
    canonicalName: 'Malhotra Freight Logistics & Stevedoring',
    entityType: 'FORWARDER',
    participatingCases: [
      { caseId: 'CASE_MUNDRA_TALC', caseName: 'Mundra 3,000kg Heroin', localRole: 'Customs Drayage & Transport Contractor' },
      { caseId: 'CASE_PNB_MODI', caseName: 'PNB $2B LoU Fraud', localRole: 'Surat-Mumbai Diamond Courier & Bonded Warehouse' }
    ],
    overlapScore: 92,
    sharedIndicators: [
      'Corporate PAN: AAFCM9921K (Shared Registered Office Bhiwandi)',
      'Truck Registration MH-04-GP-9120 logged in both case manifests',
      'GST Number mismatch flags across Gujarat & Maharashtra'
    ],
    resolvedAliases: ['Malhotra Logistics LLP', 'Malhotra Cargo Movers', 'MFL Stevedoring'],
    investigativeSignificance: 'Recurring overland logistics provider executing fraudulent bonded warehouse swaps and false E-way bill generations.'
  },
  {
    id: 'overlap-anom-handset-9920',
    canonicalName: 'Anōm Trojan Handset Token #ANOM-9920-AFG',
    entityType: 'PHONE_TOKEN',
    participatingCases: [
      { caseId: 'CASE_ANOM_TROJAN', caseName: 'Operation Trojan Shield', localRole: 'Intercepted FBI Telemetry Node' },
      { caseId: 'CASE_MUNDRA_TALC', caseName: 'Mundra 3,000kg Heroin', localRole: 'Dispatched delivery coordinates to Delhi safehouse' }
    ],
    overlapScore: 99,
    sharedIndicators: [
      'IMEI: 359128091238910',
      'BCC decryption key FBI Operation Trojan Shield Server #4',
      'GPS ping at Mundra Port Container Gate 4 on 2021-09-12T23:40Z'
    ],
    resolvedAliases: ['Trojan-9920', 'User @talc_master', 'Node-AFG-992'],
    investigativeSignificance: 'Conclusive electronic proof tying Mundra narco-shipment instructions directly to global FBI Operation Trojan Shield decrypted feeds.'
  },
  {
    id: 'overlap-pacific-diamonds',
    canonicalName: 'Pacific Diamonds FZE / Al-Bahar Joint Entity',
    entityType: 'ORGANIZATION',
    participatingCases: [
      { caseId: 'CASE_PNB_MODI', caseName: 'PNB $2B LoU Fraud', localRole: 'Shell recipient of $420M PNB discounted buyer credits' },
      { caseId: 'CASE_MUNDRA_TALC', caseName: 'Mundra 3,000kg Heroin', localRole: 'Financed charter freight charges for MSC Algeciras' }
    ],
    overlapScore: 89,
    sharedIndicators: [
      'DMCC License #DMCC-881920 (Dubai JLT)',
      'Nominee Director: Hemant Dahyabhai Bhatt (Firestar dummy)',
      'Bank of Baroda (Dubai) Account 990182-120'
    ],
    resolvedAliases: ['Pacific Diamonds FZE', 'Pacific Gems JLT', 'Al-Bahar Pacific Trading'],
    investigativeSignificance: 'Dual-use offshore front entity laundering bank fraud LoUs while capitalizing international narcotics freight contracts.'
  }
];

// ============================================================================
// 5. ALGORITHMIC MANIFEST ANOMALY SCORING & PORT VULNERABILITY DATA
// ============================================================================

export interface ManifestAnomalyRecord {
  id: string;
  billOfLading: string;
  vesselName: string;
  portOfLoading: string;
  portOfDischarge: string;
  declaredCommodity: string;
  declaredWeightKg: number;
  declaredValueUSD: number;
  freightInsuranceUSD: number;
  anomalyScore: number; // 0 - 100
  riskLevel: 'CRITICAL' | 'HIGH' | 'ELEVATED' | 'LOW';
  flags: {
    name: string;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
    description: string;
  }[];
  densityAnomaly: {
    expectedDensityGcm3: number;
    measuredDensityGcm3: number;
    deviationPct: number;
  };
  recommendedIntervention: string;
}

export const REAL_MANIFEST_ANOMALIES: ManifestAnomalyRecord[] = [
  {
    id: 'manifest-mundra-talc-01',
    billOfLading: 'BL-BND-MUN-8819',
    vesselName: 'MSC Algeciras (IMO 9745120)',
    portOfLoading: 'Bandar Abbas (Iran)',
    portOfDischarge: 'Mundra Port Container Terminal 4 (India)',
    declaredCommodity: 'Semi-cut Talc Stones (Industrial Grade)',
    declaredWeightKg: 38200,
    declaredValueUSD: 19500, // Low declared value
    freightInsuranceUSD: 145000, // Disproportionately high insurance!
    anomalyScore: 96,
    riskLevel: 'CRITICAL',
    flags: [
      {
        name: 'Insurance-to-Value Disparity',
        severity: 'CRITICAL',
        description: 'Freight insurance value ($145k) is 7.4x greater than the total declared commercial value of commodity ($19.5k).'
      },
      {
        name: 'High-Risk Origin Corridor Hop',
        severity: 'CRITICAL',
        description: 'Overland transshipment originating in Helmand/Kandahar (Opium golden crescent) routed via Iranian feeder port.'
      },
      {
        name: 'First-Time Consignee GST Shell',
        severity: 'HIGH',
        description: 'Consignee Aashi Trading Co (Vijayawada) has zero prior import history and operated from a residential address.'
      }
    ],
    densityAnomaly: {
      expectedDensityGcm3: 2.75, // Natural talc
      measuredDensityGcm3: 1.28, // Diacetylmorphine powder blend
      deviationPct: -53.4
    },
    recommendedIntervention: 'Immediate Physical De-stuffing, Customs Canine Sniff, and CRCL Chemical Spectroscopy Assay.'
  },
  {
    id: 'manifest-pnb-diamond-02',
    billOfLading: 'BL-BOM-DXB-9912',
    vesselName: 'Air Freight Cargo EK-501 (Emirates)',
    portOfLoading: 'Chhatrapati Shivaji Maharaj Int Airport (BOM)',
    portOfDischarge: 'Dubai International Airport (DXB)',
    declaredCommodity: 'Cut & Polished VVS1 Natural Diamonds',
    declaredWeightKg: 4.8,
    declaredValueUSD: 48500000, // $48.5M for 4.8kg
    freightInsuranceUSD: 52000000,
    anomalyScore: 91,
    riskLevel: 'CRITICAL',
    flags: [
      {
        name: 'Valuation Inflation >1,400%',
        severity: 'CRITICAL',
        description: 'Assay tests show lab-grown HPHT diamonds declared with fake GIA certificates as high-grade natural roughs.'
      },
      {
        name: 'Circular Round-Trip Nexus',
        severity: 'HIGH',
        description: 'Identical diamond lot serial numbers previously exported and re-imported 4 times within 90 days.'
      }
    ],
    densityAnomaly: {
      expectedDensityGcm3: 3.51,
      measuredDensityGcm3: 3.52,
      deviationPct: 0.2
    },
    recommendedIntervention: 'Enforcement Directorate PMLA Provisional Attachment and GIA Forensic Verification.'
  },
  {
    id: 'manifest-amritsar-salt-03',
    billOfLading: 'RR-ATQ-PAK-4412',
    vesselName: 'Goods Cargo Train Wagah-Attari ICP',
    portOfLoading: 'Lahore Inland Depot (Pakistan)',
    portOfDischarge: 'Attari Integrated Checkpost (India)',
    declaredCommodity: 'Crushed Rock Salt (Sodium Chloride Bulk)',
    declaredWeightKg: 62000,
    declaredValueUSD: 8200,
    freightInsuranceUSD: 85000,
    anomalyScore: 93,
    riskLevel: 'CRITICAL',
    flags: [
      {
        name: 'Contraband Concealment in Granular Cargo',
        severity: 'CRITICAL',
        description: 'X-ray inspection shows dense poly-packs buried beneath sodium chloride crystals (532 kg heroin recovered).'
      },
      {
        name: 'Unverified Shell Importer',
        severity: 'HIGH',
        description: 'Consignee firm registered under identity theft of a local Amritsar dry fruit trader.'
      }
    ],
    densityAnomaly: {
      expectedDensityGcm3: 2.16,
      measuredDensityGcm3: 1.34,
      deviationPct: -37.9
    },
    recommendedIntervention: 'NDPS Act Seizure, DRI Special Team Escort, and Joint BSF Interrogation.'
  }
];

export interface PortVulnerabilityIndex {
  portCode: string;
  portName: string;
  country: string;
  riskCategory: 'VERY_HIGH' | 'HIGH' | 'MODERATE';
  compositeScore: number; // 0 - 100
  annualContainerVolumeTEU: string;
  xrayScannerCoveragePct: number;
  historicalSeizuresCr: string;
  primaryRiskVulnerabilities: string[];
}

export const PORT_VULNERABILITY_INDEX: PortVulnerabilityIndex[] = [
  {
    portCode: 'INMUN',
    portName: 'Mundra Port Container Terminal',
    country: 'India',
    riskCategory: 'VERY_HIGH',
    compositeScore: 92,
    annualContainerVolumeTEU: '6.6 Million TEU',
    xrayScannerCoveragePct: 18,
    historicalSeizuresCr: '₹21,000 Cr',
    primaryRiskVulnerabilities: [
      'High volume of mineral and bulk raw cargo from Gulf feeder ports',
      'Low automated container scan percentage compared to throughput',
      'Proximity to Makran coastline and maritime dhow transit corridors'
    ]
  },
  {
    portCode: 'IRBND',
    portName: 'Shahid Rajaee Port (Bandar Abbas)',
    country: 'Iran',
    riskCategory: 'VERY_HIGH',
    compositeScore: 95,
    annualContainerVolumeTEU: '2.8 Million TEU',
    xrayScannerCoveragePct: 12,
    historicalSeizuresCr: 'Transnational Gateway',
    primaryRiskVulnerabilities: [
      'Primary maritime outlet for Afghan Opium Golden Crescent production',
      'Complex overland TIR carnet customs exemptions',
      'Frequent bill of lading rerouting and shell consignor masking'
    ]
  },
  {
    portCode: 'INNSA',
    portName: 'JNPT Port (Nhava Sheva)',
    country: 'India',
    riskCategory: 'HIGH',
    compositeScore: 84,
    annualContainerVolumeTEU: '5.1 Million TEU',
    xrayScannerCoveragePct: 35,
    historicalSeizuresCr: '₹4,800 Cr',
    primaryRiskVulnerabilities: [
      'Gateway to Mumbai and Bhiwandi logistics distribution hub',
      'High density of freight forwarders operating with sub-contracted drayage'
    ]
  },
  {
    portCode: 'AEDXB',
    portName: 'Jebel Ali Port / Deira Souk Gateway',
    country: 'UAE',
    riskCategory: 'HIGH',
    compositeScore: 86,
    annualContainerVolumeTEU: '14.0 Million TEU',
    xrayScannerCoveragePct: 62,
    historicalSeizuresCr: 'Hawala & Trade Clearing Hub',
    primaryRiskVulnerabilities: [
      'Free zone shell company registration with nominal nominee directors',
      'Cash-to-gold bullion settlement liquidity in adjacent souks'
    ]
  }
];

// ============================================================================
// 6. CRYPTOGRAPHIC JUDICIAL CHAIN-OF-CUSTODY & DOSSIER EXPORT DATA
// ============================================================================

export interface JudicialEvidenceItem {
  id: string;
  exhibitCode: string;
  caseId: CaseId;
  title: string;
  category: 'CHEMICAL_LAB_REPORT' | 'SWIFT_FIN_LOG' | 'SEIZED_PHYSICAL_ITEM' | 'COURT_WARRANT' | 'INTERPOL_NOTICE';
  custodyOfficer: string;
  seizureDate: string;
  seizureLocation: string;
  sha256Hash: string;
  courtAdmissibilityStatus: 'ADMITTED_EXHIBIT' | 'UNDER_JUDICIAL_REVIEW' | 'SEALED_CRIMINAL_RECORD';
  forensicSummary: string;
  judicialOrderReference: string;
  verificationSignature: string;
}

export const REAL_JUDICIAL_EVIDENCE: JudicialEvidenceItem[] = [
  {
    id: 'ev-crcl-report-992',
    exhibitCode: 'EXHIBIT-PW1/DRI-992',
    caseId: 'CASE_MUNDRA_TALC',
    title: 'Central Revenues Control Laboratory (CRCL) Chemical Assay',
    category: 'CHEMICAL_LAB_REPORT',
    custodyOfficer: 'Dr. V. K. Sharma (Chief Chemist, CRCL New Delhi)',
    seizureDate: '2021-09-17T10:00:00Z',
    seizureLocation: 'Mundra Port Container Terminal 4 Examination Staging Yard',
    sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    courtAdmissibilityStatus: 'ADMITTED_EXHIBIT',
    forensicSummary: 'Gas Chromatography-Mass Spectrometry (GC-MS) assay confirmed positive presence of diacetylmorphine (purity: 99.41% w/w) in sample packages marked TALC-A-01 to TALC-A-20.',
    judicialOrderReference: 'Special NIA Court Ahmedabad Criminal Case RC-26/2021/NIA/DLI',
    verificationSignature: 'VERIFIED_BY_CRCL_FORENSIC_DIRECTOR_SEAL_#8812'
  },
  {
    id: 'ev-swift-mt799-lou',
    exhibitCode: 'EXHIBIT-P-14/CBI-MUM',
    caseId: 'CASE_PNB_MODI',
    title: 'SWIFT Alliance Server Audit Trail FIN MT799/MT742 Logs',
    category: 'SWIFT_FIN_LOG',
    custodyOfficer: 'Inspector Alok Kumar (CBI BS&FC Zonal Unit Mumbai)',
    seizureDate: '2018-02-14T16:30:00Z',
    seizureLocation: 'PNB Brady House Branch SWIFT Operator Terminal Room',
    sha256Hash: '9f83c6051f6cd96124f0c763d63b2e666ca957657818a094e11971f01f5d19c3',
    courtAdmissibilityStatus: 'ADMITTED_EXHIBIT',
    forensicSummary: 'Forensic extraction of 1,214 unauthorized SWIFT messages issued by User ID L1_GKS between 2011 and 2017 without corresponding CBS FinnOne transaction ledger entries.',
    judicialOrderReference: 'CBI Special Court Mumbai Special Case 1/2018 (Chargesheet #1)',
    verificationSignature: 'VERIFIED_BY_CBI_CYBER_FORENSIC_UNIT_SEAL_#0192'
  },
  {
    id: 'ev-anom-handset-log',
    exhibitCode: 'EXHIBIT-FBI-RC-09',
    caseId: 'CASE_ANOM_TROJAN',
    title: 'FBI Operation Trojan Shield Decrypted Chat Log (BCC Feed)',
    category: 'SEIZED_PHYSICAL_ITEM',
    custodyOfficer: 'Special Agent Marcus Vance (FBI San Diego Field Office)',
    seizureDate: '2021-06-07T08:00:00Z',
    seizureLocation: 'International Law Enforcement Taskforce Cloud Server',
    sha256Hash: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
    courtAdmissibilityStatus: 'ADMITTED_EXHIBIT',
    forensicSummary: 'Decrypted communications detailing shipment dispatch schedules, fake consignee identities, and token drop verifications across 300 syndicates.',
    judicialOrderReference: 'US District Court Southern District of California (Case 21-CR-1892-LAB)',
    verificationSignature: 'VERIFIED_BY_US_DEPT_OF_JUSTICE_MUTUAL_LEGAL_ASSISTANCE'
  },
  {
    id: 'ev-uk-highcourt-extradition',
    exhibitCode: 'EXHIBIT-CPS-UK-01',
    caseId: 'CASE_PNB_MODI',
    title: 'UK High Court of Justice Extradition Order & Bail Refusal Judgment',
    category: 'COURT_WARRANT',
    custodyOfficer: 'Senior District Judge Samuel Goozee (Westminster Court)',
    seizureDate: '2021-02-25T11:00:00Z',
    seizureLocation: 'Royal Courts of Justice Strand London',
    sha256Hash: '4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce',
    courtAdmissibilityStatus: 'ADMITTED_EXHIBIT',
    forensicSummary: 'Extradition granted on grounds of prima facie case of conspiracy to defraud, destruction of evidence, and witness intimidation under PMLA and IPC sections.',
    judicialOrderReference: 'High Court of Justice Administrative Court [2022] EWHC 2873 (Admin)',
    verificationSignature: 'HER_MAJESTYS_COURTS_AND_TRIBUNALS_SERVICE_SEAL'
  }
];
