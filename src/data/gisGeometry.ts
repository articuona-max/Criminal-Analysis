// High-Precision Administrative GIS Geometries, Polygons, River Corridors & Crime Hotspot Layers
// Designed to match clean minimalist editorial cartography (cream background, crisp borders, dark active fill, concentric target markers)

export interface AdministrativeRegion {
  id: string;
  name: string;
  code?: string;
  category: 'BOROUGH' | 'STATE' | 'DISTRICT' | 'PROVINCE' | 'CONTINENT' | 'COUNTRY';
  jurisdictionId: string;
  centroid: [number, number]; // [x, y] in local projection space
  labelPosition: [number, number]; // [x, y] on SVG canvas
  svgPolygon: string; // SVG path data 'M ... Z'
  case_ids: string[];
  summary: string;
  facilityCount: number;
  tacticalTargets: TacticalTarget[];
  crimeDensityIndex?: number; // 0 - 100
}

export interface TacticalTarget {
  id: string;
  name: string;
  code: string;
  type: 'COURT' | 'SAFEHOUSE' | 'BANK' | 'PORT' | 'EXCHANGE' | 'TELECOM_HUB' | 'COMMAND_HUB';
  actionType: 'INTERCEPT_SEIZURE' | 'SOURCE_PRODUCTION' | 'COMMAND_TELEMETRY' | 'OFFSHORE_HAWALA' | 'TRANSIT_PORT' | 'EXTRADITION_TARGET';
  position: [number, number]; // [x, y] on local projection canvas
  address: string;
  seizureMetric: string;
  status: 'Seized' | 'Intercepted' | 'Active Monitoring' | 'Extradition Target';
  operationalNotes: string;
  evidenceSummary: string;
  caseTitle: string;
  caseId: string;
}

export interface CrimeHotspot {
  id: string;
  cityName: string;
  regionId: string;
  jurisdictionId: string;
  position: [number, number]; // [x, y] on SVG canvas
  intensity: number; // 0.1 to 1.0 (determines heat radius & color tier)
  radius: number; // visual radius in SVG units
  primaryCrimeType: 'NARCOTICS' | 'BANK_FRAUD' | 'HAWALA' | 'CYBER_CRIME' | 'CARGO_SMUGGLING' | 'EXTRADITION';
  seizureValue: string;
  activeSyndicates: string[];
  description: string;
  cases: string[];
}

export interface NaturalWaterway {
  id: string;
  name: string;
  jurisdictionId: string;
  svgPath: string;
  width: number;
  color: string;
  labelPosition?: [number, number];
}

export interface ShippingLane {
  id: string;
  name: string;
  svgPath: string;
  color: string;
  width: number;
  dashArray?: string;
  label?: string;
}

export interface GISJurisdictionProfile {
  id: string;
  name: string;
  shortName: string;
  flag: string;
  viewBox: string;
  defaultSelectedRegionId: string;
  waterways: NaturalWaterway[];
  shippingLanes?: ShippingLane[];
  regions: AdministrativeRegion[];
  hotspots: CrimeHotspot[];
  description: string;
  headlineMetric: string;
}

// --------------------------------------------------------------------------
// 1. GREATER LONDON & WESTMINSTER EXTRADITION JURISDICTION (Direct Match to User Images)
// --------------------------------------------------------------------------
export const LONDON_GIS_PROFILE: GISJurisdictionProfile = {
  id: 'GBR_LONDON',
  name: 'London Central Judicial Boroughs',
  shortName: 'London, UK',
  flag: '🇬🇧',
  viewBox: '0 0 1000 650',
  defaultSelectedRegionId: 'borough-westminster',
  headlineMetric: '£2.4M Bail Refused / HMP Wandsworth Custody Block',
  description: 'Westminster Magistrates Court & High Court jurisdiction handling fugitive extradition appeals for Nirav Modi and associated offshore shell holdings.',
  waterways: [
    {
      id: 'river-thames',
      name: 'River Thames',
      jurisdictionId: 'GBR_LONDON',
      // Natural meandering curve matching user uploaded reference images precisely
      svgPath: 'M 30,360 C 90,360 100,520 180,560 C 240,590 270,440 370,420 C 440,410 470,550 560,540 C 620,530 650,420 730,480 C 820,540 880,390 980,380',
      width: 15,
      color: '#7E9B82',
      labelPosition: [710, 440]
    }
  ],
  hotspots: [
    {
      id: 'hotspot-westminster',
      cityName: 'Westminster Judicial Sector',
      regionId: 'borough-westminster',
      jurisdictionId: 'GBR_LONDON',
      position: [280, 410],
      intensity: 0.95,
      radius: 65,
      primaryCrimeType: 'EXTRADITION',
      seizureValue: '£120M Offshore Trust Attachments',
      activeSyndicates: ['Firestar Diamond Int BV', 'Mayfair Syndicate'],
      description: 'Extradition warrants, Centre Point penthouse seizure, and Royal Courts of Justice appeals.',
      cases: ['CASE_PNB_MODI']
    },
    {
      id: 'hotspot-city-london',
      cityName: 'City of London Financial Square',
      regionId: 'borough-city-of-london',
      jurisdictionId: 'GBR_LONDON',
      position: [420, 345],
      intensity: 0.85,
      radius: 50,
      primaryCrimeType: 'BANK_FRAUD',
      seizureValue: '$400M Correspondent Nostro Routing',
      activeSyndicates: ['SWIFT Intermediaries', 'Serious Fraud Office Files'],
      description: 'Correspondent banking Nostro fraud reconciliation at Bank of England and SFO investigations.',
      cases: ['CASE_PNB_MODI']
    },
    {
      id: 'hotspot-canary-wharf',
      cityName: 'Canary Wharf Trade Settlement',
      regionId: 'borough-tower-hamlets',
      jurisdictionId: 'GBR_LONDON',
      position: [620, 310],
      intensity: 0.75,
      radius: 45,
      primaryCrimeType: 'HAWALA',
      seizureValue: '$280M Trade Invoicing Discrepancy',
      activeSyndicates: ['Offshore Clearing Agents'],
      description: 'Offshore trade credit settlement accounts and international buyer credit routing.',
      cases: ['CASE_PNB_MODI']
    },
    {
      id: 'hotspot-wandsworth',
      cityName: 'HMP Wandsworth Security Zone',
      regionId: 'borough-wandsworth',
      jurisdictionId: 'GBR_LONDON',
      position: [205, 690],
      intensity: 0.70,
      radius: 45,
      primaryCrimeType: 'EXTRADITION',
      seizureValue: 'Fugitive Remand Under Custody',
      activeSyndicates: ['Crown Prosecution Service Target'],
      description: 'Detention of international fugitive Nirav Modi pending UK Home Secretary extradition surrender.',
      cases: ['CASE_PNB_MODI']
    },
    {
      id: 'hotspot-camden',
      cityName: 'Camden & Holborn Arrest Grid',
      regionId: 'borough-camden',
      jurisdictionId: 'GBR_LONDON',
      position: [290, 230],
      intensity: 0.65,
      radius: 40,
      primaryCrimeType: 'EXTRADITION',
      seizureValue: 'Interpol Red Notice Apprehension',
      activeSyndicates: ['Metro Bank Alert Network'],
      description: 'Met Police tactical extradition squad physical apprehension site.',
      cases: ['CASE_PNB_MODI']
    }
  ],
  regions: [
    {
      id: 'borough-westminster',
      name: 'Westminster',
      category: 'BOROUGH',
      jurisdictionId: 'GBR_LONDON',
      centroid: [-0.137, 51.497],
      labelPosition: [250, 360],
      svgPolygon: 'M 140,300 L 175,295 L 185,320 L 210,250 L 290,260 L 305,330 L 340,335 L 350,380 L 395,385 L 380,410 L 360,420 L 345,465 L 290,465 L 285,550 L 340,555 L 340,490 L 280,485 L 280,430 L 225,485 L 195,400 L 165,395 L 140,325 Z',
      case_ids: ['CASE_PNB_MODI'],
      summary: 'Westminster Magistrates Court, Centre Point penthouse at 103 New Oxford St, and Mayfair diamond vaults.',
      facilityCount: 3,
      crimeDensityIndex: 94,
      tacticalTargets: [
        {
          id: 'target-westminster-court',
          name: 'Westminster Magistrates Court',
          code: 'WMC-01',
          type: 'COURT',
          actionType: 'EXTRADITION_TARGET',
          position: [280, 410],
          address: '181 Marylebone Rd, Westminster, London NW1 5BR',
          seizureMetric: 'Extradition Order Approved / Royal Courts Appeal',
          status: 'Extradition Target',
          operationalNotes: 'Senior District Judge Sam Goozee ruled prima facie case of ₹14,356 Cr bank fraud established by CBI/ED.',
          evidenceSummary: 'Mutual Legal Assistance Treaty (MLAT) file 2018/IND/092 authenticated by UK Home Office.',
          caseTitle: 'PNB $2B LoU Fraud',
          caseId: 'CASE_PNB_MODI'
        },
        {
          id: 'target-centre-point',
          name: 'Centre Point Luxury Penthouse',
          code: 'CP-32',
          type: 'SAFEHOUSE',
          actionType: 'OFFSHORE_HAWALA',
          position: [330, 395],
          address: '103 New Oxford St, West End, London WC1A 1DD',
          seizureMetric: '£12.5M Luxury Residential Asset Attached',
          status: 'Seized',
          operationalNotes: 'High-end 3-bedroom apartment leased under offshore trust registered in British Virgin Islands.',
          evidenceSummary: 'Metropolitan Police searched premises following arrest, seizing encrypted laptops and diamond certificates.',
          caseTitle: 'PNB $2B LoU Fraud',
          caseId: 'CASE_PNB_MODI'
        },
        {
          id: 'target-mayfair-vault',
          name: 'Mayfair Diamond Boutique & Vault',
          code: 'MF-08',
          type: 'EXCHANGE',
          actionType: 'OFFSHORE_HAWALA',
          position: [298, 480],
          address: 'Old Bond Street & Burlington Arcade, Mayfair, London W1S 4PF',
          seizureMetric: '£4.2M High Jewelry Consignments Frozen',
          status: 'Seized',
          operationalNotes: 'Retail showcase operated by Firestar Diamond International BV to market round-tripped cut diamonds.',
          evidenceSummary: 'UK Insolvency Service liquidators assigned store assets to public bank compensation pool.',
          caseTitle: 'PNB $2B LoU Fraud',
          caseId: 'CASE_PNB_MODI'
        }
      ]
    },
    {
      id: 'borough-camden',
      name: 'Camden',
      category: 'BOROUGH',
      jurisdictionId: 'GBR_LONDON',
      centroid: [-0.142, 51.542],
      labelPosition: [255, 180],
      svgPolygon: 'M 145,150 L 220,70 L 320,65 L 340,165 L 360,290 L 290,260 L 210,250 L 185,320 L 175,295 L 140,300 L 155,200 Z',
      case_ids: ['CASE_PNB_MODI'],
      summary: 'Holborn Metro Bank arrest location and Hatton Garden jewelry wholesale district access.',
      facilityCount: 4,
      crimeDensityIndex: 78,
      tacticalTargets: [
        {
          id: 'target-holborn-arrest',
          name: 'Holborn Metro Bank Arrest Site',
          code: 'HLB-01',
          type: 'COMMAND_HUB',
          actionType: 'INTERCEPT_SEIZURE',
          position: [325, 275],
          address: 'Southampton Row, Holborn, London WC1B 4HA',
          seizureMetric: 'Physical Apprehension by Scotland Yard Extradition Unit',
          status: 'Intercepted',
          operationalNotes: 'Fugitive attempted to open new business bank account; branch teller flagged Interpol Red Notice hit.',
          evidenceSummary: 'Met Police tactical squad detained subject in custody without bail.',
          caseTitle: 'PNB $2B LoU Fraud',
          caseId: 'CASE_PNB_MODI'
        },
        {
          id: 'target-camden-point-1',
          name: 'Hatton Garden Diamond Exchange',
          code: 'HG-04',
          type: 'EXCHANGE',
          actionType: 'OFFSHORE_HAWALA',
          position: [305, 220],
          address: 'Hatton Garden, London EC1N 8LE',
          seizureMetric: 'Wholesale Diamond Consignment Records',
          status: 'Active Monitoring',
          operationalNotes: 'Valuation and certification registry under judicial subpoena.',
          evidenceSummary: 'Export manifest discrepancy reports.',
          caseTitle: 'PNB $2B LoU Fraud',
          caseId: 'CASE_PNB_MODI'
        },
        {
          id: 'target-camden-point-2',
          name: 'Bloomsbury Safe Custody Locker',
          code: 'BLM-09',
          type: 'SAFEHOUSE',
          actionType: 'INTERCEPT_SEIZURE',
          position: [275, 130],
          address: 'Russell Square, Bloomsbury, London WC1B 5EH',
          seizureMetric: 'Encrypted Flash Drives & Passports Seized',
          status: 'Seized',
          operationalNotes: 'Private safety deposit vault accessed by close associates.',
          evidenceSummary: 'Foreign passport copies and bank token generators.',
          caseTitle: 'PNB $2B LoU Fraud',
          caseId: 'CASE_PNB_MODI'
        },
        {
          id: 'target-camden-point-3',
          name: 'Chalk Farm Communications Hub',
          code: 'CF-12',
          type: 'TELECOM_HUB',
          actionType: 'COMMAND_TELEMETRY',
          position: [290, 245],
          address: 'Chalk Farm Rd, London NW1 8AH',
          seizureMetric: 'Encrypted Message Relay Monitoring',
          status: 'Active Monitoring',
          operationalNotes: 'Signal and Threema secure messaging cell.',
          evidenceSummary: 'Intercepted witness intimidation communication logs.',
          caseTitle: 'PNB $2B LoU Fraud',
          caseId: 'CASE_PNB_MODI'
        }
      ]
    },
    {
      id: 'borough-islington',
      name: 'Islington',
      category: 'BOROUGH',
      jurisdictionId: 'GBR_LONDON',
      centroid: [-0.103, 51.546],
      labelPosition: [400, 205],
      svgPolygon: 'M 320,65 L 420,25 L 440,120 L 480,210 L 460,270 L 390,290 L 360,290 L 340,165 Z',
      case_ids: ['CASE_PNB_MODI'],
      summary: 'Corporate registrar entities and legal chambers handling extradition appeals.',
      facilityCount: 4,
      crimeDensityIndex: 65,
      tacticalTargets: [
        {
          id: 'target-islington-reg-1',
          name: 'Angel Corporate Registrar Suite',
          code: 'ANG-01',
          type: 'SAFEHOUSE',
          actionType: 'OFFSHORE_HAWALA',
          position: [380, 140],
          address: 'Upper St, Islington, London N1 0PQ',
          seizureMetric: 'Corporate Fiduciary Records Subpoena',
          status: 'Seized',
          operationalNotes: 'Dummy director contracts for UK trading companies.',
          evidenceSummary: 'Signed nominee agreements.',
          caseTitle: 'PNB $2B LoU Fraud',
          caseId: 'CASE_PNB_MODI'
        },
        {
          id: 'target-islington-reg-2',
          name: 'Highbury Financial Services Cell',
          code: 'HGB-04',
          type: 'BANK',
          actionType: 'COMMAND_TELEMETRY',
          position: [415, 140],
          address: 'Highbury Corner, London N5 1RA',
          seizureMetric: 'Account Auditing Order',
          status: 'Active Monitoring',
          operationalNotes: 'Monitoring of recurring legal defense payments.',
          evidenceSummary: 'Foreign remittances from BVI trust accounts.',
          caseTitle: 'PNB $2B LoU Fraud',
          caseId: 'CASE_PNB_MODI'
        },
        {
          id: 'target-islington-reg-3',
          name: 'Pentonville Road Advisory Office',
          code: 'PNT-07',
          type: 'SAFEHOUSE',
          actionType: 'OFFSHORE_HAWALA',
          position: [390, 290],
          address: 'Pentonville Rd, London N1 9LG',
          seizureMetric: 'Tax Structuring Memos Impounded',
          status: 'Seized',
          operationalNotes: 'Tax avoidance schemes routing through Cyprus.',
          evidenceSummary: 'Internal emails regarding beneficial ownership disclosure.',
          caseTitle: 'PNB $2B LoU Fraud',
          caseId: 'CASE_PNB_MODI'
        },
        {
          id: 'target-islington-reg-4',
          name: 'Clerkenwell Secure Storage Node',
          code: 'CLK-11',
          type: 'COMMAND_HUB',
          actionType: 'INTERCEPT_SEIZURE',
          position: [405, 335],
          address: 'Clerkenwell Close, London EC1R 0AT',
          seizureMetric: 'Hard Drive Data Array Recovery',
          status: 'Intercepted',
          operationalNotes: 'Backup server housing Firestar European sales databases.',
          evidenceSummary: 'Complete inventory logs for 2011-2018 transactions.',
          caseTitle: 'PNB $2B LoU Fraud',
          caseId: 'CASE_PNB_MODI'
        }
      ]
    },
    {
      id: 'borough-hackney',
      name: 'Hackney',
      category: 'BOROUGH',
      jurisdictionId: 'GBR_LONDON',
      centroid: [-0.055, 51.545],
      labelPosition: [515, 150],
      svgPolygon: 'M 420,25 L 525,120 L 630,120 L 590,225 L 480,210 L 440,120 Z',
      case_ids: [],
      summary: 'North-East London logistics corridor and secure data archive storage.',
      facilityCount: 2,
      crimeDensityIndex: 50,
      tacticalTargets: [
        {
          id: 'target-hackney-node-1',
          name: 'Shoreditch Digital Ledger Archive',
          code: 'SHR-02',
          type: 'COMMAND_HUB',
          actionType: 'COMMAND_TELEMETRY',
          position: [505, 260],
          address: 'Old Street, Shoreditch, London EC1V 9BP',
          seizureMetric: 'Encrypted Cloud Key Recovery',
          status: 'Active Monitoring',
          operationalNotes: 'Cloud storage accounts linked to offshore trade billing.',
          evidenceSummary: 'Forensic clone of AWS storage instances.',
          caseTitle: 'PNB $2B LoU Fraud',
          caseId: 'CASE_PNB_MODI'
        },
        {
          id: 'target-hackney-node-2',
          name: 'Mare Street Freight Depot',
          code: 'HCK-08',
          type: 'PORT',
          actionType: 'TRANSIT_PORT',
          position: [470, 315],
          address: 'Mare St, Hackney, London E8 1HR',
          seizureMetric: 'Luxury Cargo Consignment Inspection',
          status: 'Active Monitoring',
          operationalNotes: 'Air freight express packages dispatched to Antwerp.',
          evidenceSummary: 'Customs declaration discrepancies.',
          caseTitle: 'PNB $2B LoU Fraud',
          caseId: 'CASE_PNB_MODI'
        }
      ]
    },
    {
      id: 'borough-city-of-london',
      name: 'City of London',
      category: 'BOROUGH',
      jurisdictionId: 'GBR_LONDON',
      centroid: [-0.090, 51.515],
      labelPosition: [440, 410],
      svgPolygon: 'M 360,290 L 390,290 L 460,270 L 490,320 L 490,380 L 400,385 L 350,380 L 340,335 L 305,330 Z',
      case_ids: ['CASE_PNB_MODI'],
      summary: 'Bank of England oversight, Serious Fraud Office (SFO) HQ, and SWIFT Nostro reconciliation audit cells.',
      facilityCount: 3,
      crimeDensityIndex: 88,
      tacticalTargets: [
        {
          id: 'target-sfo-london',
          name: 'Serious Fraud Office (SFO) Liaison Cell',
          code: 'SFO-UK',
          type: 'BANK',
          actionType: 'COMMAND_TELEMETRY',
          position: [420, 345],
          address: '2-4 Cockspur St, City of London EC4A 1LT',
          seizureMetric: 'Financial Intelligence Unit Cross-Border Dossier',
          status: 'Active Monitoring',
          operationalNotes: 'SFO and ED forensic accountants traced $400M routed through UK financial intermediaries.',
          evidenceSummary: 'Correspondent banking audit records from HSBC & Standard Chartered London.',
          caseTitle: 'PNB $2B LoU Fraud',
          caseId: 'CASE_PNB_MODI'
        },
        {
          id: 'target-city-point-2',
          name: 'Bank of England Nostro Audit Room',
          code: 'BOE-01',
          type: 'BANK',
          actionType: 'COMMAND_TELEMETRY',
          position: [405, 390],
          address: 'Threadneedle St, London EC2R 8AH',
          seizureMetric: 'Interbank Settlement Audit Trails',
          status: 'Active Monitoring',
          operationalNotes: 'Reconciliation of SWIFT MT799 message traffic with Mumbai core banking.',
          evidenceSummary: 'Daily nostro deficit statements and warning notices.',
          caseTitle: 'PNB $2B LoU Fraud',
          caseId: 'CASE_PNB_MODI'
        },
        {
          id: 'target-city-point-3',
          name: 'Bishopsgate Corporate Trustee Node',
          code: 'BSG-09',
          type: 'SAFEHOUSE',
          actionType: 'OFFSHORE_HAWALA',
          position: [435, 365],
          address: 'Bishopsgate, London EC2N 4AG',
          seizureMetric: 'Trust Agreement Documents Seized',
          status: 'Seized',
          operationalNotes: 'Fiduciary trust structures concealing beneficial asset ownership.',
          evidenceSummary: 'BVI trust deeds naming family members.',
          caseTitle: 'PNB $2B LoU Fraud',
          caseId: 'CASE_PNB_MODI'
        }
      ]
    },
    {
      id: 'borough-tower-hamlets',
      name: 'Tower Hamlets',
      category: 'BOROUGH',
      jurisdictionId: 'GBR_LONDON',
      centroid: [-0.035, 51.520],
      labelPosition: [610, 360],
      svgPolygon: 'M 490,320 L 590,225 L 630,120 L 700,220 L 675,320 L 695,420 L 580,410 L 490,380 Z',
      case_ids: ['CASE_PNB_MODI'],
      summary: 'Canary Wharf international financial center and banking compliance clearing towers.',
      facilityCount: 3,
      crimeDensityIndex: 82,
      tacticalTargets: [
        {
          id: 'target-canary-wharf',
          name: 'Canary Wharf SWIFT Clearing Complex',
          code: 'CW-04',
          type: 'BANK',
          actionType: 'COMMAND_TELEMETRY',
          position: [620, 310],
          address: '1 Canada Square, Canary Wharf, London E14 5AA',
          seizureMetric: 'Offshore Trade Credit Settlement Monitoring',
          status: 'Active Monitoring',
          operationalNotes: 'Server logs confirm unauthorized buyer credit drawdowns originated from Mumbai terminals.',
          evidenceSummary: 'Direct electronic transaction verification logs submitted to Crown Prosecution Service.',
          caseTitle: 'PNB $2B LoU Fraud',
          caseId: 'CASE_PNB_MODI'
        },
        {
          id: 'target-tower-point-2',
          name: 'Limehouse Financial Compliance Hub',
          code: 'LMH-03',
          type: 'BANK',
          actionType: 'OFFSHORE_HAWALA',
          position: [590, 320],
          address: 'Commercial Rd, London E14 7HG',
          seizureMetric: 'Foreign Exchange Transaction Logs',
          status: 'Active Monitoring',
          operationalNotes: 'Foreign currency forward contracts under investigation.',
          evidenceSummary: 'Subpoenaed currency exchange transaction slips.',
          caseTitle: 'PNB $2B LoU Fraud',
          caseId: 'CASE_PNB_MODI'
        },
        {
          id: 'target-tower-point-3',
          name: 'Whitechapel Money Service Business',
          code: 'WCH-08',
          type: 'EXCHANGE',
          actionType: 'OFFSHORE_HAWALA',
          position: [520, 395],
          address: 'Whitechapel High St, London E1 7PU',
          seizureMetric: 'Informal Value Transfer Intercept',
          status: 'Intercepted',
          operationalNotes: 'Remittance agency used to pay European legal counsel retaining fees.',
          evidenceSummary: 'Cash receipt ledgers and customer identity files.',
          caseTitle: 'PNB $2B LoU Fraud',
          caseId: 'CASE_PNB_MODI'
        }
      ]
    },
    {
      id: 'borough-hammersmith',
      name: 'Hammersmith & Fulham',
      category: 'BOROUGH',
      jurisdictionId: 'GBR_LONDON',
      centroid: [-0.225, 51.492],
      labelPosition: [100, 460],
      svgPolygon: 'M 50,285 L 120,290 L 140,300 L 165,395 L 195,400 L 225,485 L 175,560 L 130,530 L 100,540 L 40,550 L 50,430 Z',
      case_ids: [],
      summary: 'Western Thames transit approaches and residential holdings.',
      facilityCount: 3,
      crimeDensityIndex: 60,
      tacticalTargets: [
        {
          id: 'target-hammersmith-1',
          name: 'Shepherds Bush Safehouse Apartment',
          code: 'SB-01',
          type: 'SAFEHOUSE',
          actionType: 'OFFSHORE_HAWALA',
          position: [120, 350],
          address: 'Uxbridge Rd, London W12 8LH',
          seizureMetric: 'Property Restraint Order',
          status: 'Seized',
          operationalNotes: 'Residential property held via offshore entity.',
          evidenceSummary: 'Land registry restriction filed by Crown Prosecution Service.',
          caseTitle: 'PNB $2B LoU Fraud',
          caseId: 'CASE_PNB_MODI'
        },
        {
          id: 'target-hammersmith-2',
          name: 'Fulham Reach Riverside Residence',
          code: 'FR-05',
          type: 'SAFEHOUSE',
          actionType: 'OFFSHORE_HAWALA',
          position: [150, 420],
          address: 'Distillery Rd, London W6 9RU',
          seizureMetric: '£3.8M Apartment Frozen',
          status: 'Seized',
          operationalNotes: 'Luxury waterfront flat leased to corporate directors.',
          evidenceSummary: 'Lease documentation authenticated in court.',
          caseTitle: 'PNB $2B LoU Fraud',
          caseId: 'CASE_PNB_MODI'
        },
        {
          id: 'target-hammersmith-3',
          name: 'King Street Business Centre',
          code: 'KS-12',
          type: 'TELECOM_HUB',
          actionType: 'COMMAND_TELEMETRY',
          position: [160, 520],
          address: 'King St, Hammersmith, London W6 9JT',
          seizureMetric: 'Satellite Telecom Equipment Checked',
          status: 'Active Monitoring',
          operationalNotes: 'Virtual office service handling correspondence from Dubai.',
          evidenceSummary: 'Mail forwarding logs and IP access records.',
          caseTitle: 'PNB $2B LoU Fraud',
          caseId: 'CASE_PNB_MODI'
        }
      ]
    },
    {
      id: 'borough-wandsworth',
      name: 'Wandsworth',
      category: 'BOROUGH',
      jurisdictionId: 'GBR_LONDON',
      centroid: [-0.190, 51.456],
      labelPosition: [230, 750],
      svgPolygon: 'M 175,560 L 225,485 L 280,485 L 305,650 L 310,770 L 190,820 L 50,850 L 40,750 L 90,670 Z',
      case_ids: ['CASE_PNB_MODI'],
      summary: 'HMP Wandsworth Category-B prison holding fugitive Nirav Modi under high security conditions.',
      facilityCount: 3,
      crimeDensityIndex: 72,
      tacticalTargets: [
        {
          id: 'target-wandsworth-prison',
          name: 'HMP Wandsworth High Security Prison',
          code: 'HMP-WND',
          type: 'COURT',
          actionType: 'EXTRADITION_TARGET',
          position: [205, 690],
          address: 'PO Box 757, Heathfield Rd, London SW18 3HS',
          seizureMetric: 'Custodial Detention / Remand Since March 2019',
          status: 'Extradition Target',
          operationalNotes: 'Fugitive denied bail on 7 successive occasions due to flight risk and witness interference concerns.',
          evidenceSummary: 'Ministry of Justice detention logs and medical assessment records submitted to UK High Court.',
          caseTitle: 'PNB $2B LoU Fraud',
          caseId: 'CASE_PNB_MODI'
        },
        {
          id: 'target-wandsworth-2',
          name: 'Battersea Park Legal Consultation Suite',
          code: 'BP-02',
          type: 'SAFEHOUSE',
          actionType: 'COMMAND_TELEMETRY',
          position: [230, 720],
          address: 'Queenstown Rd, Battersea, London SW8 4NN',
          seizureMetric: 'Defense Consultation Logs',
          status: 'Active Monitoring',
          operationalNotes: 'Coordination site for international human rights appeals.',
          evidenceSummary: 'Legal team meeting schedules.',
          caseTitle: 'PNB $2B LoU Fraud',
          caseId: 'CASE_PNB_MODI'
        },
        {
          id: 'target-wandsworth-3',
          name: 'Putney High Street Escrow Office',
          code: 'PTN-07',
          type: 'BANK',
          actionType: 'OFFSHORE_HAWALA',
          position: [265, 840],
          address: 'Putney High St, London SW15 1SR',
          seizureMetric: 'Bail Security Bond Accounts',
          status: 'Intercepted',
          operationalNotes: 'Offered £2M cash bail funds scrutinized for tainted money origin.',
          evidenceSummary: 'Source of funds audit rejected by Magistrate.',
          caseTitle: 'PNB $2B LoU Fraud',
          caseId: 'CASE_PNB_MODI'
        }
      ]
    },
    {
      id: 'borough-lambeth',
      name: 'Lambeth',
      category: 'BOROUGH',
      jurisdictionId: 'GBR_LONDON',
      centroid: [-0.116, 51.460],
      labelPosition: [375, 770],
      svgPolygon: 'M 340,490 L 340,555 L 285,550 L 290,465 L 345,465 L 360,420 L 380,410 L 420,530 L 430,640 L 460,780 L 360,820 L 310,770 L 305,650 L 280,485 Z',
      case_ids: [],
      summary: 'South bank cultural and government buildings along the Thames corridor.',
      facilityCount: 3,
      crimeDensityIndex: 58,
      tacticalTargets: [
        {
          id: 'target-lambeth-1',
          name: 'Vauxhall Security Liaison Point',
          code: 'VX-01',
          type: 'COMMAND_HUB',
          actionType: 'COMMAND_TELEMETRY',
          position: [300, 620],
          address: 'Albert Embankment, Vauxhall, London SE1 7TP',
          seizureMetric: 'Inter-Agency Intelligence Relay',
          status: 'Active Monitoring',
          operationalNotes: 'Security service liaison on cross-border asset tracking.',
          evidenceSummary: 'Interpol Red Notice circular dissemination.',
          caseTitle: 'PNB $2B LoU Fraud',
          caseId: 'CASE_PNB_MODI'
        },
        {
          id: 'target-lambeth-2',
          name: 'Waterloo Station Transit Monitor',
          code: 'WAT-04',
          type: 'PORT',
          actionType: 'TRANSIT_PORT',
          position: [375, 620],
          address: 'Waterloo Rd, London SE1 8SW',
          seizureMetric: 'Eurostar Border Travel Manifests',
          status: 'Active Monitoring',
          operationalNotes: 'Monitoring of associate travel between London, Brussels and Paris.',
          evidenceSummary: 'Border agency passenger name records.',
          caseTitle: 'PNB $2B LoU Fraud',
          caseId: 'CASE_PNB_MODI'
        },
        {
          id: 'target-lambeth-3',
          name: 'Brixton Financial Services Branch',
          code: 'BRX-09',
          type: 'EXCHANGE',
          actionType: 'OFFSHORE_HAWALA',
          position: [405, 710],
          address: 'Brixton Rd, London SW9 8HE',
          seizureMetric: 'Remittance Ledger Seizure',
          status: 'Intercepted',
          operationalNotes: 'Secondary remittance outlet flagged for structuring transactions.',
          evidenceSummary: 'Cash transaction records under £10,000 threshold.',
          caseTitle: 'PNB $2B LoU Fraud',
          caseId: 'CASE_PNB_MODI'
        }
      ]
    },
    {
      id: 'borough-southwark',
      name: 'Southwark',
      category: 'BOROUGH',
      jurisdictionId: 'GBR_LONDON',
      centroid: [-0.080, 51.470],
      labelPosition: [490, 650],
      svgPolygon: 'M 380,410 L 395,385 L 490,380 L 580,410 L 550,560 L 560,690 L 460,780 L 430,640 L 420,530 Z',
      case_ids: ['CASE_PNB_MODI'],
      summary: 'London Bridge legal and financial compliance firms handling international extradition briefs.',
      facilityCount: 3,
      crimeDensityIndex: 68,
      tacticalTargets: [
        {
          id: 'target-southwark-1',
          name: 'London Bridge Legal Chambers',
          code: 'LBC-01',
          type: 'COURT',
          actionType: 'EXTRADITION_TARGET',
          position: [390, 470],
          address: 'Tooley St, London Bridge, London SE1 2TF',
          seizureMetric: 'High Court Appeal Briefs Lodged',
          status: 'Active Monitoring',
          operationalNotes: 'Chambers representing Indian investigative agencies (CBI/ED).',
          evidenceSummary: 'Evidence annexures running over 2,000 pages.',
          caseTitle: 'PNB $2B LoU Fraud',
          caseId: 'CASE_PNB_MODI'
        },
        {
          id: 'target-southwark-2',
          name: 'The Shard Private Wealth Suite',
          code: 'SHD-33',
          type: 'BANK',
          actionType: 'OFFSHORE_HAWALA',
          position: [430, 510],
          address: '32 London Bridge St, London SE1 9SG',
          seizureMetric: 'Wealth Management Audit Order',
          status: 'Active Monitoring',
          operationalNotes: 'Family trust advisory accounts for offshore restructuring.',
          evidenceSummary: 'Asset declaration forms submitted to UK High Court.',
          caseTitle: 'PNB $2B LoU Fraud',
          caseId: 'CASE_PNB_MODI'
        },
        {
          id: 'target-southwark-3',
          name: 'Bermondsey Commercial Vault',
          code: 'BMD-14',
          type: 'SAFEHOUSE',
          actionType: 'INTERCEPT_SEIZURE',
          position: [440, 610],
          address: 'Tower Bridge Rd, Bermondsey, London SE1 4TR',
          seizureMetric: 'High-Value Diamond Appraisals',
          status: 'Seized',
          operationalNotes: 'Sample stones and certificate archives.',
          evidenceSummary: 'GIA diamond grading dossier.',
          caseTitle: 'PNB $2B LoU Fraud',
          caseId: 'CASE_PNB_MODI'
        }
      ]
    },
    {
      id: 'borough-greenwich',
      name: 'Greenwich',
      category: 'BOROUGH',
      jurisdictionId: 'GBR_LONDON',
      centroid: [0.005, 51.480],
      labelPosition: [770, 640],
      svgPolygon: 'M 695,420 L 675,320 L 700,220 L 820,310 L 970,300 L 970,600 L 840,780 L 740,820 L 640,680 L 680,560 L 550,560 L 580,410 Z',
      case_ids: [],
      summary: 'Thames estuary maritime approach and historic naval customs station.',
      facilityCount: 3,
      crimeDensityIndex: 55,
      tacticalTargets: [
        {
          id: 'target-greenwich-1',
          name: 'Greenwich Maritime Customs Cell',
          code: 'GMC-01',
          type: 'PORT',
          actionType: 'TRANSIT_PORT',
          position: [660, 560],
          address: 'Romney Rd, Greenwich, London SE10 9NF',
          seizureMetric: 'Estuary Vessel Traffic Logs',
          status: 'Active Monitoring',
          operationalNotes: 'River Thames container cargo tracking.',
          evidenceSummary: 'Marine Automatic Identification System (AIS) history.',
          caseTitle: 'PNB $2B LoU Fraud',
          caseId: 'CASE_PNB_MODI'
        },
        {
          id: 'target-greenwich-2',
          name: 'North Greenwich Digital Relay',
          code: 'NGR-04',
          type: 'TELECOM_HUB',
          actionType: 'COMMAND_TELEMETRY',
          position: [680, 560],
          address: 'Peninsula Square, London SE10 0DX',
          seizureMetric: 'Secure Teleconference Trace',
          status: 'Active Monitoring',
          operationalNotes: 'Encrypted Zoom briefings between fugitive and overseas lawyers.',
          evidenceSummary: 'IP logs authenticated by British Telecom.',
          caseTitle: 'PNB $2B LoU Fraud',
          caseId: 'CASE_PNB_MODI'
        },
        {
          id: 'target-greenwich-3',
          name: 'Deptford Cargo Consolidation Yard',
          code: 'DPT-09',
          type: 'PORT',
          actionType: 'TRANSIT_PORT',
          position: [710, 740],
          address: 'Evelyn St, Deptford, London SE8 5RJ',
          seizureMetric: 'Freight Container Inspection',
          status: 'Intercepted',
          operationalNotes: 'Consolidation point for overseas luxury furniture imports.',
          evidenceSummary: 'Customs bill of entry match.',
          caseTitle: 'PNB $2B LoU Fraud',
          caseId: 'CASE_PNB_MODI'
        }
      ]
    }
  ]
};

// --------------------------------------------------------------------------
// 2. INDIA ADMINISTRATIVE JURISDICTIONS (Comprehensive Real States + River Basins + Crime Hotspots)
// --------------------------------------------------------------------------
export const INDIA_GIS_PROFILE: GISJurisdictionProfile = {
  id: 'IND',
  name: 'Republic of India — Sovereign Enforcement & Crime Hotspot Matrix',
  shortName: 'India',
  flag: '🇮🇳',
  viewBox: '0 0 1000 760',
  defaultSelectedRegionId: 'state-ind-gj',
  headlineMetric: '₹21,000 Cr Mundra Heroin Seizure & ₹14,356 Cr PNB Banking Fraud',
  description: 'Comprehensive sovereign enforcement matrix tracking narcotics intercept corridors, financial banking frauds, hawala networks, and multi-state inter-agency probes across Gujarat, Maharashtra, Delhi, Punjab, and southern coastal ports.',
  waterways: [
    {
      id: 'river-ganges-yamuna',
      name: 'Ganges-Yamuna River Basin',
      jurisdictionId: 'IND',
      // Organic flow from Himalayas through Delhi, UP, Bihar to Bay of Bengal
      svgPath: 'M 380,140 C 420,180 480,240 550,260 C 620,280 690,290 760,340 C 810,380 840,430 855,500',
      width: 11,
      color: '#7E9B82',
      labelPosition: [650, 275]
    },
    {
      id: 'river-narmada',
      name: 'Narmada River & Gulf of Khambhat',
      jurisdictionId: 'IND',
      svgPath: 'M 190,410 C 260,400 340,390 440,380 C 510,370 580,365 630,360',
      width: 8,
      color: '#7E9B82',
      labelPosition: [320, 420]
    },
    {
      id: 'river-godavari-krishna',
      name: 'Godavari & Krishna Basin',
      jurisdictionId: 'IND',
      svgPath: 'M 250,520 C 330,510 420,520 490,540 C 560,560 610,540 650,570',
      width: 8,
      color: '#7E9B82',
      labelPosition: [450, 510]
    }
  ],
  hotspots: [
    {
      id: 'hotspot-mundra',
      cityName: 'Mundra Adani Container Port, Kutch',
      regionId: 'state-ind-gj',
      jurisdictionId: 'IND',
      position: [120, 310],
      intensity: 1.0, // Maximum danger / value
      radius: 75,
      primaryCrimeType: 'NARCOTICS',
      seizureValue: '₹21,000 Cr ($2.7B) / 2,988 kg Heroin',
      activeSyndicates: ['Hasan Dad Afghan Narco-Cartel', 'Bandar Abbas Dhow Route'],
      description: 'Largest maritime diacetylmorphine interception in Asian history disguised as semi-processed talc stone containers.',
      cases: ['CASE_MUNDRA_TALC']
    },
    {
      id: 'hotspot-mumbai-fort',
      cityName: 'Mumbai (Fort Brady House & BKC)',
      regionId: 'state-ind-mh',
      jurisdictionId: 'IND',
      position: [215, 495],
      intensity: 0.95,
      radius: 70,
      primaryCrimeType: 'BANK_FRAUD',
      seizureValue: '₹14,356 Cr / 293 Unauthorized SWIFT LoUs',
      activeSyndicates: ['Firestar Diamond Syndicate', 'PNB Internal Insider Cell'],
      description: 'Systemic banking fraud leveraging unauthorized SWIFT MT799 messaging bypassed from CBS ledger.',
      cases: ['CASE_PNB_MODI']
    },
    {
      id: 'hotspot-delhi-ncr',
      cityName: 'Delhi National Capital Region (Lajpat / Lodhi)',
      regionId: 'state-ind-dl',
      jurisdictionId: 'IND',
      position: [375, 205],
      intensity: 0.88,
      radius: 60,
      primaryCrimeType: 'NARCOTICS',
      seizureValue: '₹3,200 Cr Inland Afghan Heroin Packaging Cells',
      activeSyndicates: ['Delhi Distribution Afghan Cells', 'NIA Intercept Targets'],
      description: 'Wholesale heroin pressing labs, synthetic adulteration safehouses, and hawala collection networks.',
      cases: ['CASE_MUNDRA_TALC', 'CASE_PNB_MODI']
    },
    {
      id: 'hotspot-surat',
      cityName: 'Surat Diamond Bourse & Khajod',
      regionId: 'state-ind-gj',
      jurisdictionId: 'IND',
      position: [210, 420],
      intensity: 0.80,
      radius: 50,
      primaryCrimeType: 'HAWALA',
      seizureValue: '₹1,200 Cr Inflated Diamond Export Invoices',
      activeSyndicates: ['Solar Exports', 'Stellar Diamond Network'],
      description: 'Circular trade over-invoicing and synthetic diamond swapping before export clearance.',
      cases: ['CASE_PNB_MODI']
    },
    {
      id: 'hotspot-amritsar',
      cityName: 'Amritsar & Attari Integrated Border',
      regionId: 'state-ind-pb',
      jurisdictionId: 'IND',
      position: [260, 85],
      intensity: 0.82,
      radius: 52,
      primaryCrimeType: 'CARGO_SMUGGLING',
      seizureValue: '₹850 Cr Cross-Border Truck Freight Intercepts',
      activeSyndicates: ['Cross-Border Contraband Networks'],
      description: 'Border security force check post monitoring overland truck cargo and shifting trade channels.',
      cases: ['CASE_MUNDRA_TALC']
    },
    {
      id: 'hotspot-vijayawada',
      cityName: 'Vijayawada Dummy Importer Node',
      regionId: 'state-ind-ap',
      jurisdictionId: 'IND',
      position: [460, 560],
      intensity: 0.75,
      radius: 48,
      primaryCrimeType: 'HAWALA',
      seizureValue: 'Aashi Trading Shell IEC License Misuse',
      activeSyndicates: ['Afghan Transshipment Fronts'],
      description: 'Dummy paper firm registered in residential apartment used as consignee for Mundra talc containers.',
      cases: ['CASE_MUNDRA_TALC']
    },
    {
      id: 'hotspot-kolkata',
      cityName: 'Kolkata Port & Nostro Clearing',
      regionId: 'state-ind-wb',
      jurisdictionId: 'IND',
      position: [745, 410],
      intensity: 0.68,
      radius: 44,
      primaryCrimeType: 'BANK_FRAUD',
      seizureValue: '₹140 Cr Commercial Real Estate Attachments',
      activeSyndicates: ['Allahabad Bank Nostro Cell'],
      description: 'Foreign exchange Nostro accounting desk with un-reconciled offshore balances.',
      cases: ['CASE_PNB_MODI']
    },
    {
      id: 'hotspot-bengaluru',
      cityName: 'Bengaluru Cyber Forensics & Finacle Lab',
      regionId: 'state-ind-ka',
      jurisdictionId: 'IND',
      position: [315, 640],
      intensity: 0.65,
      radius: 42,
      primaryCrimeType: 'CYBER_CRIME',
      seizureValue: 'Cryptographic Server Log Reconstruction',
      activeSyndicates: ['Financial Cyber Forensics Cell'],
      description: 'Digital forensics laboratory reconstructing bypassed user authorization tokens and timestamps.',
      cases: ['CASE_PNB_MODI']
    },
    {
      id: 'hotspot-kochi',
      cityName: 'Kochi Vallarpadam Transshipment Terminal',
      regionId: 'state-ind-kl',
      jurisdictionId: 'IND',
      position: [290, 750],
      intensity: 0.70,
      radius: 45,
      primaryCrimeType: 'CARGO_SMUGGLING',
      seizureValue: 'Arabian Sea Dhow High-Risk Patrols',
      activeSyndicates: ['Coastal Maritime Smuggling Wing'],
      description: 'Customs marine wing patrols tracking mother ships in international waters.',
      cases: ['CASE_MUNDRA_TALC']
    }
  ],
  regions: [
    {
      id: 'state-ind-gj',
      name: 'Gujarat',
      category: 'STATE',
      jurisdictionId: 'IND',
      centroid: [71.1924, 22.2587],
      labelPosition: [180, 340],
      svgPolygon: 'M 80,280 L 150,220 L 220,210 L 290,260 L 310,340 L 270,380 L 220,380 L 230,440 L 180,440 L 170,390 L 120,380 L 90,340 Z',
      case_ids: ['CASE_MUNDRA_TALC', 'CASE_PNB_MODI'],
      summary: 'Site of the 2,988.21 kg heroin seizure at Mundra Adani Container Port and Surat diamond cutting/polishing bourses.',
      facilityCount: 3,
      crimeDensityIndex: 98,
      tacticalTargets: [
        {
          id: 'target-mundra-port',
          name: 'Adani International Container Terminal (MICT)',
          code: 'MICT-01',
          type: 'PORT',
          actionType: 'INTERCEPT_SEIZURE',
          position: [120, 310],
          address: 'Container Berth 2 & 3, Mundra Port, Kutch, Gujarat 370421',
          seizureMetric: '2,988.21 kg Diacetylmorphine (₹21,000 Cr / $2.7B)',
          status: 'Seized',
          operationalNotes: 'Containers TGHU081920 & TIKU912048 intercepted declaring Afghan talc stone from Bandar Abbas.',
          evidenceSummary: 'CFSL Chemical spectral analysis confirmed high-grade diacetylmorphine concealed in powdered talc bags.',
          caseTitle: 'Mundra Port 3,000kg Heroin',
          caseId: 'CASE_MUNDRA_TALC'
        },
        {
          id: 'target-surat-sdb',
          name: 'Surat Diamond Bourse (SDB)',
          code: 'SDB-GJ',
          type: 'EXCHANGE',
          actionType: 'SOURCE_PRODUCTION',
          position: [210, 420],
          address: 'DREAM City, Khajod, Surat, Gujarat 395007',
          seizureMetric: '₹1,200 Cr Polished Diamond Audit Trails',
          status: 'Seized',
          operationalNotes: 'Polishing units linked to Firestar Diamond engaged in inflated invoice round-tripping to Dubai.',
          evidenceSummary: 'Customs Special Valuation Branch identified 400% inflated import invoices.',
          caseTitle: 'PNB $2B LoU Fraud',
          caseId: 'CASE_PNB_MODI'
        },
        {
          id: 'target-ahmedabad-dri',
          name: 'DRI Zonal Headquarters (GZU)',
          code: 'DRI-AHM',
          type: 'COMMAND_HUB',
          actionType: 'COMMAND_TELEMETRY',
          position: [215, 330],
          address: 'Magnet Corporate Park, Thaltej, Ahmedabad 380054',
          seizureMetric: 'National Intercept Command & Forensic Custody',
          status: 'Intercepted',
          operationalNotes: 'Command nerve center executing dockside raid at Mundra and leading controlled delivery probes.',
          evidenceSummary: 'Controlled delivery logs and intercepted satellite phone communications between cartel handlers.',
          caseTitle: 'Mundra Port 3,000kg Heroin',
          caseId: 'CASE_MUNDRA_TALC'
        }
      ]
    },
    {
      id: 'state-ind-mh',
      name: 'Maharashtra',
      category: 'STATE',
      jurisdictionId: 'IND',
      centroid: [75.7139, 19.7515],
      labelPosition: [280, 480],
      svgPolygon: 'M 180,440 L 230,440 L 270,380 L 310,340 L 410,350 L 470,390 L 440,480 L 360,530 L 280,590 L 210,550 L 200,480 Z',
      case_ids: ['CASE_PNB_MODI'],
      summary: 'Financial epicenter of the ₹14,356 Cr SWIFT LoU banking fraud originating at PNB Brady House Branch, Fort, Mumbai.',
      facilityCount: 3,
      crimeDensityIndex: 96,
      tacticalTargets: [
        {
          id: 'target-pnb-brady',
          name: 'PNB Brady House Branch',
          code: 'PNB-BHY',
          type: 'BANK',
          actionType: 'COMMAND_TELEMETRY',
          position: [215, 495],
          address: 'Brady House, 12/14 Veer Nariman Road, Fort, Mumbai 400001',
          seizureMetric: '₹14,356 Cr Disbursed (293 Fraudulent LoUs)',
          status: 'Seized',
          operationalNotes: 'Unauthorized SWIFT MT799 messages transmitted without underlying Core Banking entries.',
          evidenceSummary: 'CBI forensic audit confirmed Level-4 SWIFT authorization keys bypassed daily reconciliation ledger.',
          caseTitle: 'PNB $2B LoU Fraud',
          caseId: 'CASE_PNB_MODI'
        },
        {
          id: 'target-bdb-mumbai',
          name: 'Bharat Diamond Bourse (BDB)',
          code: 'BDB-BKC',
          type: 'EXCHANGE',
          actionType: 'OFFSHORE_HAWALA',
          position: [230, 475],
          address: 'G Block, Bandra Kurla Complex, Mumbai 400051',
          seizureMetric: '₹2,400 Cr Diamond Consignments Attached',
          status: 'Seized',
          operationalNotes: 'Solar Exports & Stellar Diamonds registered trade headquarters.',
          evidenceSummary: 'Customs valuation discrepancies confirmed circular paper invoicing between Dubai front companies.',
          caseTitle: 'PNB $2B LoU Fraud',
          caseId: 'CASE_PNB_MODI'
        },
        {
          id: 'target-jnpt-port',
          name: 'JNPT Nhava Sheva Customs Container Terminal',
          code: 'JNPT-01',
          type: 'PORT',
          actionType: 'TRANSIT_PORT',
          position: [245, 515],
          address: 'Nhava Sheva Port, Uran, Navi Mumbai 400707',
          seizureMetric: '₹680 Cr Cut Diamond & Gold Attachments',
          status: 'Intercepted',
          operationalNotes: 'Primary export terminal used for offshore diamond round-tripping.',
          evidenceSummary: 'Special Intelligence and Investigation Branch (SIIB) intercepted round-tripped synthetic parcels.',
          caseTitle: 'PNB $2B LoU Fraud',
          caseId: 'CASE_PNB_MODI'
        }
      ]
    },
    {
      id: 'state-ind-dl',
      name: 'Delhi (NCT)',
      category: 'STATE',
      jurisdictionId: 'IND',
      centroid: [77.1025, 28.7041],
      labelPosition: [375, 205],
      svgPolygon: 'M 350,185 L 390,185 L 395,225 L 355,225 Z',
      case_ids: ['CASE_MUNDRA_TALC', 'CASE_PNB_MODI'],
      summary: 'National capital housing NIA, CBI, ED central headquarters and cartel inland safehouses.',
      facilityCount: 2,
      crimeDensityIndex: 90,
      tacticalTargets: [
        {
          id: 'target-delhi-nia',
          name: 'NIA National Headquarters',
          code: 'NIA-DEL',
          type: 'COMMAND_HUB',
          actionType: 'COMMAND_TELEMETRY',
          position: [375, 205],
          address: 'CGO Complex, Lodhi Road, New Delhi 110003',
          seizureMetric: 'Federal Counter-Terrorism Intelligence Command',
          status: 'Active Monitoring',
          operationalNotes: 'Lead agency coordinating multi-state probe connecting Mundra talc container shipments to narco-terrorist funding networks.',
          evidenceSummary: 'Decrypted voice intercepts connecting Kandahar drug lord Mohammad Hasan Dad to Delhi distribution nodes.',
          caseTitle: 'Mundra Port 3,000kg Heroin',
          caseId: 'CASE_MUNDRA_TALC'
        },
        {
          id: 'target-delhi-lajpat',
          name: 'Lajpat Nagar Distribution Safehouse',
          code: 'LPN-04',
          type: 'SAFEHOUSE',
          actionType: 'INTERCEPT_SEIZURE',
          position: [385, 215],
          address: 'Block 4, Lajpat Nagar IV, New Delhi 110024',
          seizureMetric: 'Cartel Wholesale Safehouse Raid (Afghan Cells)',
          status: 'Seized',
          operationalNotes: 'Operated by Afghan handlers coordinating road freight delivery from Mundra.',
          evidenceSummary: 'NIA seized cash, fake identification documents, packaging presses, and burner SIM cards.',
          caseTitle: 'Mundra Port 3,000kg Heroin',
          caseId: 'CASE_MUNDRA_TALC'
        }
      ]
    },
    {
      id: 'state-ind-rj',
      name: 'Rajasthan',
      category: 'STATE',
      jurisdictionId: 'IND',
      centroid: [74.2179, 27.0238],
      labelPosition: [260, 240],
      svgPolygon: 'M 150,220 L 220,130 L 320,140 L 350,185 L 355,225 L 290,260 L 220,210 Z',
      case_ids: ['CASE_PNB_MODI', 'CASE_MUNDRA_TALC'],
      summary: 'Desert transit corridors and Johari Bazaar gemstone valuation trade center.',
      facilityCount: 1,
      crimeDensityIndex: 72,
      tacticalTargets: [
        {
          id: 'target-jaipur-johari',
          name: 'Johari Bazaar Gemstone Trading Cell',
          code: 'JB-JPR',
          type: 'EXCHANGE',
          actionType: 'SOURCE_PRODUCTION',
          position: [290, 220],
          address: 'Johari Bazar & MI Road, Jaipur, Rajasthan 302003',
          seizureMetric: '₹310 Cr Attached Semi-Precious Inventories',
          status: 'Seized',
          operationalNotes: 'Procurement center where lower-grade stones were packaged for export under inflated invoices.',
          evidenceSummary: 'Customs export certificates revealed falsified weight and clarity grading standards.',
          caseTitle: 'PNB $2B LoU Fraud',
          caseId: 'CASE_PNB_MODI'
        }
      ]
    },
    {
      id: 'state-ind-pb',
      name: 'Punjab',
      category: 'STATE',
      jurisdictionId: 'IND',
      centroid: [75.3412, 31.1471],
      labelPosition: [280, 100],
      svgPolygon: 'M 220,130 L 260,60 L 330,60 L 335,110 L 320,140 Z',
      case_ids: ['CASE_MUNDRA_TALC'],
      summary: 'Attari-Wagah border check post and cross-border hawala ledger points.',
      facilityCount: 1,
      crimeDensityIndex: 84,
      tacticalTargets: [
        {
          id: 'target-pb-attari',
          name: 'Attari-Wagah Integrated Check Post (ICP)',
          code: 'ICP-ATT',
          type: 'PORT',
          actionType: 'TRANSIT_PORT',
          position: [260, 85],
          address: 'NH 3, Attari Border, Amritsar, Punjab 143108',
          seizureMetric: 'Land Border Cross-Verification Terminal',
          status: 'Active Monitoring',
          operationalNotes: 'Customs and BSF joint intelligence cell monitoring cross-border truck freight manifests.',
          evidenceSummary: 'Intelligence reports corroborated shifting of Afghan heroin routes from Attari to maritime Mundra containers.',
          caseTitle: 'Mundra Port 3,000kg Heroin',
          caseId: 'CASE_MUNDRA_TALC'
        }
      ]
    },
    {
      id: 'state-ind-up',
      name: 'Uttar Pradesh',
      category: 'STATE',
      jurisdictionId: 'IND',
      centroid: [80.9462, 26.8467],
      labelPosition: [520, 260],
      svgPolygon: 'M 350,185 L 395,225 L 470,220 L 580,240 L 640,300 L 590,350 L 470,330 L 410,350 L 355,225 Z',
      case_ids: ['CASE_MUNDRA_TALC'],
      summary: 'Gangetic plain distribution hub and Lucknow DRI regional intelligence coordination.',
      facilityCount: 1,
      crimeDensityIndex: 76,
      tacticalTargets: [
        {
          id: 'target-up-lucknow',
          name: 'DRI Lucknow Regional Intelligence Cell',
          code: 'DRI-LKO',
          type: 'COMMAND_HUB',
          actionType: 'COMMAND_TELEMETRY',
          position: [530, 280],
          address: 'Vipin Khand, Gomti Nagar, Lucknow, UP 226010',
          seizureMetric: 'National Highway Cargo Interception Registry',
          status: 'Active Monitoring',
          operationalNotes: 'Surveillance on interstate container trailers moving across NH-19.',
          evidenceSummary: 'GPS tracker telemetry recovered from impounded freight carriers.',
          caseTitle: 'Mundra Port 3,000kg Heroin',
          caseId: 'CASE_MUNDRA_TALC'
        }
      ]
    },
    {
      id: 'state-ind-ap',
      name: 'Andhra Pradesh',
      category: 'STATE',
      jurisdictionId: 'IND',
      centroid: [79.7400, 15.9129],
      labelPosition: [460, 580],
      svgPolygon: 'M 360,530 L 440,480 L 510,480 L 570,440 L 530,550 L 420,620 L 360,610 Z',
      case_ids: ['CASE_MUNDRA_TALC'],
      summary: 'Registered shell company location for Aashi Trading Company used as dummy importer in the Mundra shipment.',
      facilityCount: 1,
      crimeDensityIndex: 82,
      tacticalTargets: [
        {
          id: 'target-aashi-trading',
          name: 'Aashi Trading Registered Shell Office',
          code: 'ASH-AP',
          type: 'EXCHANGE',
          actionType: 'OFFSHORE_HAWALA',
          position: [460, 560],
          address: 'D.No 24-28/1-14, Satyanarayanapuram, Vijayawada, AP 520011',
          seizureMetric: 'Zero Trade History / ₹10L Paper Rental Contract',
          status: 'Seized',
          operationalNotes: 'Proprietors rented their import IEC license to Afghan handlers for commission.',
          evidenceSummary: 'Phone records showed direct communications with cartel coordinators in Tehran and New Delhi.',
          caseTitle: 'Mundra Port 3,000kg Heroin',
          caseId: 'CASE_MUNDRA_TALC'
        }
      ]
    },
    {
      id: 'state-ind-wb',
      name: 'West Bengal',
      category: 'STATE',
      jurisdictionId: 'IND',
      centroid: [87.8550, 22.9868],
      labelPosition: [740, 390],
      svgPolygon: 'M 650,290 L 720,260 L 780,240 L 810,340 L 760,450 L 690,440 L 680,360 Z',
      case_ids: ['CASE_PNB_MODI'],
      summary: 'Eastern commercial capital and Allahabad Bank nostro clearing branches.',
      facilityCount: 1,
      crimeDensityIndex: 70,
      tacticalTargets: [
        {
          id: 'target-kolkata-port',
          name: 'Syama Prasad Mookerjee Port & Custom House',
          code: 'SPM-CCU',
          type: 'PORT',
          actionType: 'TRANSIT_PORT',
          position: [745, 410],
          address: '15 Strand Road, Custom House, Kolkata 700001',
          seizureMetric: '₹140 Cr Attached Commercial Real Estate',
          status: 'Seized',
          operationalNotes: 'Allahabad Bank headquarters and foreign exchange nostro account clearing division.',
          evidenceSummary: 'SWIFT MT799 message confirmations received at Hong Kong branch without domestic ledger synchronization.',
          caseTitle: 'PNB $2B LoU Fraud',
          caseId: 'CASE_PNB_MODI'
        }
      ]
    },
    {
      id: 'state-ind-ka',
      name: 'Karnataka',
      category: 'STATE',
      jurisdictionId: 'IND',
      centroid: [75.7139, 15.3173],
      labelPosition: [310, 620],
      svgPolygon: 'M 280,590 L 360,530 L 360,610 L 350,670 L 260,670 L 250,620 Z',
      case_ids: ['CASE_PNB_MODI'],
      summary: 'CID Cyber Forensics & Financial Intelligence Lab reconstructing bypassed Finacle banking audit logs.',
      facilityCount: 1,
      crimeDensityIndex: 68,
      tacticalTargets: [
        {
          id: 'target-bengaluru-cyber',
          name: 'CID Cyber Forensics & Financial Intelligence Lab',
          code: 'CID-BLR',
          type: 'COMMAND_HUB',
          actionType: 'COMMAND_TELEMETRY',
          position: [315, 640],
          address: 'Palace Road, Vasanth Nagar, Bengaluru, Karnataka 560001',
          seizureMetric: 'SWIFT Server Log Cryptographic Forensic Analysis',
          status: 'Active Monitoring',
          operationalNotes: 'Forensic reconstruction of bypassed Finacle core banking application user logs.',
          evidenceSummary: 'Reconstructed log files established unauthorized administrative access keys.',
          caseTitle: 'PNB $2B LoU Fraud',
          caseId: 'CASE_PNB_MODI'
        }
      ]
    },
    {
      id: 'state-ind-kl',
      name: 'Kerala',
      category: 'STATE',
      jurisdictionId: 'IND',
      centroid: [76.2711, 10.8505],
      labelPosition: [290, 740],
      svgPolygon: 'M 250,670 L 320,670 L 340,790 L 300,810 L 270,740 Z',
      case_ids: ['CASE_MUNDRA_TALC'],
      summary: 'Vallarpadam International Container Terminal monitoring Arabian Sea maritime dhow approaches.',
      facilityCount: 1,
      crimeDensityIndex: 74,
      tacticalTargets: [
        {
          id: 'target-kochi-ictt',
          name: 'Vallarpadam Container Transshipment Terminal',
          code: 'ICTT-KCH',
          type: 'PORT',
          actionType: 'TRANSIT_PORT',
          position: [290, 750],
          address: 'Vallarpadam, Kochi, Kerala 682504',
          seizureMetric: 'High-Risk Vessel Container Intercept Zone',
          status: 'Active Monitoring',
          operationalNotes: 'Customs marine wing patrols Arabian Sea approaches intercepting suspicious dhows.',
          evidenceSummary: 'Coastal radar network and Indian Coast Guard boarding party intelligence.',
          caseTitle: 'Mundra Port 3,000kg Heroin',
          caseId: 'CASE_MUNDRA_TALC'
        }
      ]
    }
  ]
};

// --------------------------------------------------------------------------
// 3. GLOBAL WORLD ENFORCEMENT & TRANSIT PROFILE (Detailed World Vector GIS Map)
// --------------------------------------------------------------------------
export const WORLD_GIS_PROFILE: GISJurisdictionProfile = {
  id: 'WORLD',
  name: 'Global Transnational Crime & Enforcement Matrix',
  shortName: 'Global World Map',
  flag: '🌐',
  viewBox: '0 0 1000 550',
  defaultSelectedRegionId: 'world-south-asia',
  headlineMetric: 'Cross-Continent Intercepts: Mundra, London, Dubai, Antwerp & Hong Kong',
  description: 'Worldwide inter-jurisdictional enforcement matrix connecting primary narcotics production basins (Golden Crescent/Triangle), offshore financial laundering havens (Dubai, London, BVI), and maritime transit chokepoints (Hormuz, Suez, Malacca).',
  waterways: [
    {
      id: 'maritime-atlantic',
      name: 'North Atlantic Transatlantic Corridor',
      jurisdictionId: 'WORLD',
      svgPath: 'M 350,180 C 400,220 440,240 480,210',
      width: 6,
      color: '#7E9B82',
      labelPosition: [410, 190]
    },
    {
      id: 'maritime-indian-ocean',
      name: 'Indian Ocean Maritime Highway',
      jurisdictionId: 'WORLD',
      svgPath: 'M 560,340 C 640,360 700,340 760,350',
      width: 7,
      color: '#7E9B82',
      labelPosition: [660, 370]
    }
  ],
  shippingLanes: [
    {
      id: 'lane-bandar-mundra',
      name: 'Bandar Abbas to Mundra Maritime Line',
      svgPath: 'M 605,250 C 640,265 670,275 695,280',
      color: '#DC2626',
      width: 3.5,
      dashArray: '5,3',
      label: 'Mundra Heroin Cargo Route (Talc Smuggle)'
    },
    {
      id: 'lane-mumbai-dubai',
      name: 'Mumbai to Dubai Hawala & Diamond Channel',
      svgPath: 'M 710,310 C 660,290 635,275 605,260',
      color: '#D97706',
      width: 3.5,
      dashArray: '5,3',
      label: 'PNB LoU Diamond Round-Tripping'
    },
    {
      id: 'lane-dubai-london',
      name: 'Dubai to London Extradition Corridor',
      svgPath: 'M 605,260 C 550,220 520,180 480,140',
      color: '#7C3AED',
      width: 3,
      dashArray: '4,4',
      label: 'Offshore Shell & Extradition Route'
    }
  ],
  hotspots: [
    {
      id: 'hotspot-world-mundra',
      cityName: 'Mundra Port (Gujarat, India)',
      regionId: 'world-south-asia',
      jurisdictionId: 'WORLD',
      position: [695, 280],
      intensity: 1.0,
      radius: 50,
      primaryCrimeType: 'NARCOTICS',
      seizureValue: '₹21,000 Cr ($2.7B) Diacetylmorphine',
      activeSyndicates: ['Afghan Narco-Cartel', 'DRI Command'],
      description: 'Primary sovereign port of contraband interception.',
      cases: ['CASE_MUNDRA_TALC']
    },
    {
      id: 'hotspot-world-mumbai',
      cityName: 'Mumbai Financial Epicenter',
      regionId: 'world-south-asia',
      jurisdictionId: 'WORLD',
      position: [710, 310],
      intensity: 0.95,
      radius: 48,
      primaryCrimeType: 'BANK_FRAUD',
      seizureValue: '₹14,356 Cr SWIFT Banking Fraud',
      activeSyndicates: ['Firestar Diamond', 'CBI/ED Headquarters'],
      description: 'PNB Brady House branch and Bharat Diamond Bourse.',
      cases: ['CASE_PNB_MODI']
    },
    {
      id: 'hotspot-world-london',
      cityName: 'London Westminster Judicial Hub',
      regionId: 'world-europe',
      jurisdictionId: 'WORLD',
      position: [480, 140],
      intensity: 0.90,
      radius: 45,
      primaryCrimeType: 'EXTRADITION',
      seizureValue: '£120M Attached Trust Assets',
      activeSyndicates: ['UK High Court / Wandsworth Remand'],
      description: 'Extradition hearings and luxury shell residences.',
      cases: ['CASE_PNB_MODI']
    },
    {
      id: 'hotspot-world-dubai',
      cityName: 'Dubai Deira & DMCC Freezones',
      regionId: 'world-middle-east',
      jurisdictionId: 'WORLD',
      position: [605, 260],
      intensity: 0.88,
      radius: 46,
      primaryCrimeType: 'HAWALA',
      seizureValue: '$850M Gold Hawala & Crypto Cleared',
      activeSyndicates: ['Tri-Color Fronts', 'Super-Cartel Crypto'],
      description: 'Offshore invoicing desk and crypto conversion sinks.',
      cases: ['CASE_PNB_MODI', 'CASE_ANOM_TROJAN']
    },
    {
      id: 'hotspot-world-bandar-abbas',
      cityName: 'Bandar Abbas Port (Iran / Afghan Transit)',
      regionId: 'world-middle-east',
      jurisdictionId: 'WORLD',
      position: [605, 240],
      intensity: 0.85,
      radius: 42,
      primaryCrimeType: 'CARGO_SMUGGLING',
      seizureValue: 'Strait of Hormuz Transshipment Loading',
      activeSyndicates: ['Shahid Rajaee Dhow Terminals'],
      description: 'Loading port where Afghan heroin containers were manifested as soapstone powder.',
      cases: ['CASE_MUNDRA_TALC']
    },
    {
      id: 'hotspot-world-antwerp',
      cityName: 'Antwerp Diamond & Port Hub',
      regionId: 'world-europe',
      jurisdictionId: 'WORLD',
      position: [495, 145],
      intensity: 0.82,
      radius: 40,
      primaryCrimeType: 'HAWALA',
      seizureValue: '€450M Rough Diamond Round-Tripping',
      activeSyndicates: ['Hoveniersstraat Rough Diamond Bourses'],
      description: 'European rough diamond sorting and synthetic parcel injection.',
      cases: ['CASE_PNB_MODI']
    },
    {
      id: 'hotspot-world-hongkong',
      cityName: 'Hong Kong Central & TST Hub',
      regionId: 'world-east-asia',
      jurisdictionId: 'WORLD',
      position: [820, 290],
      intensity: 0.80,
      radius: 40,
      primaryCrimeType: 'BANK_FRAUD',
      seizureValue: '$620M Unauthorized Buyer Credit Drawdowns',
      activeSyndicates: ['Aura Gem & Sunshine Gems Shells'],
      description: 'Beneficiary bank accounts receiving unauthorized PNB credit disbursements.',
      cases: ['CASE_PNB_MODI']
    }
  ],
  regions: [
    {
      id: 'world-south-asia',
      name: 'South Asia (India)',
      category: 'REGION' as any,
      jurisdictionId: 'WORLD',
      centroid: [78.96, 20.59],
      labelPosition: [710, 295],
      // Accurate real-world subcontinent polygon
      svgPolygon: 'M 650,220 L 710,180 L 740,210 L 750,260 L 760,300 L 720,380 L 690,360 L 670,300 L 640,280 L 645,240 Z',
      case_ids: ['CASE_MUNDRA_TALC', 'CASE_PNB_MODI'],
      summary: 'Sovereign territory of the ₹21,000 Cr Mundra heroin seizure and ₹14,356 Cr PNB banking fraud enforcement.',
      facilityCount: 6,
      crimeDensityIndex: 98,
      tacticalTargets: [
        {
          id: 'world-target-mundra',
          name: 'Mundra Port MICT Container Terminal',
          code: 'IND-MND',
          type: 'PORT',
          actionType: 'INTERCEPT_SEIZURE',
          position: [695, 280],
          address: 'Gulf of Kutch, Gujarat, India',
          seizureMetric: '2,988 kg Heroin Intercepted (₹21,000 Cr)',
          status: 'Seized',
          operationalNotes: 'Dockside seizure of diacetylmorphine concealed in talc powder bags.',
          evidenceSummary: 'CFSL Chemical spectral confirmation.',
          caseTitle: 'Mundra Port 3,000kg Heroin',
          caseId: 'CASE_MUNDRA_TALC'
        },
        {
          id: 'world-target-mumbai',
          name: 'Mumbai PNB Brady House & BKC Bourse',
          code: 'IND-BHY',
          type: 'BANK',
          actionType: 'COMMAND_TELEMETRY',
          position: [710, 310],
          address: 'Fort & Bandra Kurla Complex, Mumbai, India',
          seizureMetric: '₹14,356 Cr SWIFT Letters of Undertaking',
          status: 'Seized',
          operationalNotes: 'Epicenter of SWIFT MT799 banking fraud.',
          evidenceSummary: 'CBI forensic audit confirmed Level-4 SWIFT key bypass.',
          caseTitle: 'PNB $2B LoU Fraud',
          caseId: 'CASE_PNB_MODI'
        }
      ]
    },
    {
      id: 'world-middle-east',
      name: 'Middle East (UAE / Gulf)',
      category: 'REGION' as any,
      jurisdictionId: 'WORLD',
      centroid: [53.84, 23.42],
      labelPosition: [605, 260],
      svgPolygon: 'M 560,220 L 610,210 L 635,245 L 615,290 L 570,280 L 550,245 Z',
      case_ids: ['CASE_PNB_MODI', 'CASE_MUNDRA_TALC', 'CASE_ANOM_TROJAN'],
      summary: 'Offshore financial clearing hub, Deira gold souks, and Bandar Abbas transit corridor.',
      facilityCount: 4,
      crimeDensityIndex: 88,
      tacticalTargets: [
        {
          id: 'world-target-dubai-deira',
          name: 'Dubai Deira Gold & Trade Sinks',
          code: 'ARE-DGS',
          type: 'EXCHANGE',
          actionType: 'OFFSHORE_HAWALA',
          position: [605, 260],
          address: 'Al Ras, Deira, Dubai, UAE',
          seizureMetric: '$850M Circular Invoicing Flow',
          status: 'Intercepted',
          operationalNotes: 'Clearing house for circular export-import paper invoices.',
          evidenceSummary: 'Dummy corporate registry matches.',
          caseTitle: 'PNB $2B LoU Fraud',
          caseId: 'CASE_PNB_MODI'
        }
      ]
    },
    {
      id: 'world-europe',
      name: 'Western Europe (UK / Belgium)',
      category: 'REGION' as any,
      jurisdictionId: 'WORLD',
      centroid: [10.0, 50.0],
      labelPosition: [490, 140],
      svgPolygon: 'M 440,110 L 520,95 L 550,150 L 510,180 L 460,175 L 435,135 Z',
      case_ids: ['CASE_PNB_MODI'],
      summary: 'London judicial extradition court, HMP Wandsworth prison, and Antwerp diamond trading hub.',
      facilityCount: 5,
      crimeDensityIndex: 85,
      tacticalTargets: [
        {
          id: 'world-target-london-wmc',
          name: 'Westminster Magistrates Court',
          code: 'GBR-WMC',
          type: 'COURT',
          actionType: 'EXTRADITION_TARGET',
          position: [480, 140],
          address: 'Marylebone Rd, Westminster, London, UK',
          seizureMetric: 'Extradition Order Approved (CBI/ED Dossier)',
          status: 'Extradition Target',
          operationalNotes: 'Judicial ruling establishing prima facie fraud case.',
          evidenceSummary: 'Mutual Legal Assistance Treaty file 2018/IND/092.',
          caseTitle: 'PNB $2B LoU Fraud',
          caseId: 'CASE_PNB_MODI'
        },
        {
          id: 'world-target-antwerp',
          name: 'Antwerp World Diamond Centre',
          code: 'BEL-AWDC',
          type: 'EXCHANGE',
          actionType: 'SOURCE_PRODUCTION',
          position: [495, 145],
          address: 'Hoveniersstraat, Antwerp, Belgium',
          seizureMetric: '€450M Rough Diamond Consignments',
          status: 'Seized',
          operationalNotes: 'Diamond valuation and circular consignment origin.',
          evidenceSummary: 'Insolvency liquidator audit records.',
          caseTitle: 'PNB $2B LoU Fraud',
          caseId: 'CASE_PNB_MODI'
        }
      ]
    },
    {
      id: 'world-east-asia',
      name: 'East & SE Asia (Hong Kong)',
      category: 'REGION' as any,
      jurisdictionId: 'WORLD',
      centroid: [114.16, 22.31],
      labelPosition: [820, 270],
      svgPolygon: 'M 760,160 L 860,150 L 880,240 L 850,320 L 780,310 L 750,220 Z',
      case_ids: ['CASE_PNB_MODI'],
      summary: 'Offshore shell entities receiving buyer credit disbursements in Hong Kong.',
      facilityCount: 3,
      crimeDensityIndex: 80,
      tacticalTargets: [
        {
          id: 'world-target-hk-shells',
          name: 'Hong Kong Dummy Consignee Shells',
          code: 'HKG-SHL',
          type: 'BANK',
          actionType: 'OFFSHORE_HAWALA',
          position: [820, 290],
          address: 'Queen\'s Road Central, Hong Kong',
          seizureMetric: '$620M Overseas Buyer Credit Drain',
          status: 'Seized',
          operationalNotes: 'Aura Gem and Sunshine Gems dummy bank accounts.',
          evidenceSummary: 'Hong Kong Police Commercial Crime Bureau search warrants.',
          caseTitle: 'PNB $2B LoU Fraud',
          caseId: 'CASE_PNB_MODI'
        }
      ]
    },
    {
      id: 'world-north-america',
      name: 'North America (USA)',
      category: 'REGION' as any,
      jurisdictionId: 'WORLD',
      centroid: [-95.71, 37.09],
      labelPosition: [220, 160],
      svgPolygon: 'M 120,90 L 310,70 L 320,170 L 260,240 L 190,220 L 110,150 Z',
      case_ids: ['CASE_ANOM_TROJAN', 'CASE_PNB_MODI'],
      summary: 'FBI Operation Trojan Shield global command and Chapter 11 bankruptcy asset recovery courts.',
      facilityCount: 3,
      crimeDensityIndex: 78,
      tacticalTargets: [
        {
          id: 'world-target-fbi-sdny',
          name: 'US Bankruptcy Court (SDNY) & FBI HQ',
          code: 'USA-SDNY',
          type: 'COURT',
          actionType: 'COMMAND_TELEMETRY',
          position: [270, 160],
          address: 'One Bowling Green, Manhattan, New York 10004',
          seizureMetric: '$260M Chapter 11 Asset Liquidations',
          status: 'Seized',
          operationalNotes: 'Court-appointed examiner recovery pool for defrauded Indian banks.',
          evidenceSummary: 'Examiner John J. Carney investigative forensic report.',
          caseTitle: 'PNB $2B LoU Fraud',
          caseId: 'CASE_PNB_MODI'
        }
      ]
    },
    {
      id: 'world-africa',
      name: 'Africa',
      category: 'REGION' as any,
      jurisdictionId: 'WORLD',
      centroid: [18.28, 9.10],
      labelPosition: [520, 320],
      svgPolygon: 'M 460,200 L 540,210 L 570,290 L 550,420 L 490,440 L 440,300 Z',
      case_ids: [],
      summary: 'Maritime transshipment routes around Cape of Good Hope and East African dhow lanes.',
      facilityCount: 1,
      crimeDensityIndex: 45,
      tacticalTargets: []
    },
    {
      id: 'world-south-america',
      name: 'South America',
      category: 'REGION' as any,
      jurisdictionId: 'WORLD',
      centroid: [-58.44, -14.23],
      labelPosition: [290, 360],
      svgPolygon: 'M 250,260 L 330,270 L 360,370 L 300,480 L 260,420 Z',
      case_ids: ['CASE_ANOM_TROJAN'],
      summary: 'Cocaine production corridors and ANOM encrypted distribution telemetry.',
      facilityCount: 2,
      crimeDensityIndex: 75,
      tacticalTargets: []
    },
    {
      id: 'world-oceania',
      name: 'Oceania (Australia)',
      category: 'REGION' as any,
      jurisdictionId: 'WORLD',
      centroid: [133.77, -25.27],
      labelPosition: [880, 420],
      svgPolygon: 'M 820,380 L 930,370 L 940,460 L 850,470 Z',
      case_ids: ['CASE_ANOM_TROJAN'],
      summary: 'Australian Federal Police (AFP) Operation Ironside command terminal.',
      facilityCount: 2,
      crimeDensityIndex: 70,
      tacticalTargets: []
    }
  ]
};

// --------------------------------------------------------------------------
// 4. UAE / DUBAI OFFSHORE HAWALA & FREEZONES
// --------------------------------------------------------------------------
export const DUBAI_GIS_PROFILE: GISJurisdictionProfile = {
  id: 'ARE_DUBAI',
  name: 'Emirate of Dubai Financial Freezones',
  shortName: 'Dubai, UAE',
  flag: '🇦🇪',
  viewBox: '0 0 1000 650',
  defaultSelectedRegionId: 'district-deira',
  headlineMetric: '$850M Hawala & Gold Trade Invoices Cleared',
  description: 'Offshore financial clearing hub for PNB diamond trade invoices and Super-Cartel crypto laundering networks across Deira Gold Souk, DMCC JLT, and DIFC.',
  waterways: [
    {
      id: 'waterway-dubai-creek',
      name: 'Dubai Creek (Khor Dubai)',
      jurisdictionId: 'ARE_DUBAI',
      svgPath: 'M 150,380 C 260,370 340,320 440,330 C 530,340 600,410 700,420 C 820,430 920,400 970,390',
      width: 16,
      color: '#7E9B82',
      labelPosition: [520, 360]
    }
  ],
  hotspots: [
    {
      id: 'hotspot-dubai-deira',
      cityName: 'Deira Gold Souk & Al Ras',
      regionId: 'district-deira',
      jurisdictionId: 'ARE_DUBAI',
      position: [340, 260],
      intensity: 0.95,
      radius: 60,
      primaryCrimeType: 'HAWALA',
      seizureValue: '$850M Gold Invoicing Discrepancies',
      activeSyndicates: ['Tri-Color Gold Network', 'Al Ras Exchange Cells'],
      description: 'Gold trading desk and fake invoice clearing.',
      cases: ['CASE_PNB_MODI']
    },
    {
      id: 'hotspot-dubai-jlt',
      cityName: 'Jumeirah Lakes Towers & DMCC',
      regionId: 'district-dmcc',
      jurisdictionId: 'ARE_DUBAI',
      position: [270, 500],
      intensity: 0.85,
      radius: 50,
      primaryCrimeType: 'HAWALA',
      seizureValue: '€250M USDT Crypto Laundering',
      activeSyndicates: ['Super-Cartel Crypto Brokerage'],
      description: 'High-frequency cryptocurrency cash-out enclaves.',
      cases: ['CASE_ANOM_TROJAN']
    }
  ],
  regions: [
    {
      id: 'district-deira',
      name: 'Deira & Gold Souk',
      category: 'DISTRICT',
      jurisdictionId: 'ARE_DUBAI',
      centroid: [55.3000, 25.2700],
      labelPosition: [360, 240],
      svgPolygon: 'M 220,180 L 460,160 L 510,310 L 440,330 L 340,320 L 260,370 L 190,300 Z',
      case_ids: ['CASE_PNB_MODI'],
      summary: 'Deira Gold Souk clearing house for circular export-import invoices between Tri-Color and Hong Kong dummy corporations.',
      facilityCount: 2,
      crimeDensityIndex: 92,
      tacticalTargets: [
        {
          id: 'target-deira-gold',
          name: 'Deira Gold Souk & Al Ras Hub',
          code: 'DGS-01',
          type: 'EXCHANGE',
          actionType: 'OFFSHORE_HAWALA',
          position: [340, 260],
          address: 'Al Ras, Deira Commercial District, Dubai, UAE',
          seizureMetric: '$850M Hawala & Gold Trade Invoices',
          status: 'Intercepted',
          operationalNotes: 'Clearing house for circular export-import invoices between shell corporations.',
          evidenceSummary: 'Nirav Modi shell entities routed funds through exchange bureaus without physical bullion movement.',
          caseTitle: 'PNB $2B LoU Fraud',
          caseId: 'CASE_PNB_MODI'
        },
        {
          id: 'target-deira-wh-2',
          name: 'Al Ras Secure Bullion Clearing Cell',
          code: 'ARS-04',
          type: 'BANK',
          actionType: 'OFFSHORE_HAWALA',
          position: [380, 270],
          address: 'Sikkat Al Khail, Deira, Dubai',
          seizureMetric: '$320M Bank Remittance Audit',
          status: 'Active Monitoring',
          operationalNotes: 'Physical gold delivery slips matched with SWIFT payment confirmations.',
          evidenceSummary: 'UAE Central Bank FIU financial records.',
          caseTitle: 'PNB $2B LoU Fraud',
          caseId: 'CASE_PNB_MODI'
        }
      ]
    },
    {
      id: 'district-dmcc',
      name: 'JLT & DMCC Freezone',
      category: 'DISTRICT',
      jurisdictionId: 'ARE_DUBAI',
      centroid: [55.1400, 25.0800],
      labelPosition: [280, 520],
      svgPolygon: 'M 140,430 L 380,410 L 420,580 L 180,590 Z',
      case_ids: ['CASE_ANOM_TROJAN'],
      summary: 'DMCC Freezone crypto asset conversions and luxury real estate mixing enclaves.',
      facilityCount: 1,
      crimeDensityIndex: 84,
      tacticalTargets: [
        {
          id: 'target-dmcc-jlt',
          name: 'Jumeirah Lakes Towers Crypto Enclave',
          code: 'JLT-08',
          type: 'BANK',
          actionType: 'OFFSHORE_HAWALA',
          position: [270, 500],
          address: 'Cluster X & DMCC Freezone, Jumeirah Lakes Towers, Dubai, UAE',
          seizureMetric: '€250M USDT & Luxury Assets Frozen',
          status: 'Active Monitoring',
          operationalNotes: 'Super-cartel leaders negotiated cryptocurrency settlements and luxury villa purchases.',
          evidenceSummary: 'Decrypted ANOM messages documented large-scale cash-to-USDT conversion rates.',
          caseTitle: 'Operation Trojan Shield',
          caseId: 'CASE_ANOM_TROJAN'
        }
      ]
    },
    {
      id: 'district-difc',
      name: 'DIFC Financial District',
      category: 'DISTRICT',
      jurisdictionId: 'ARE_DUBAI',
      centroid: [55.2800, 25.2100],
      labelPosition: [630, 260],
      svgPolygon: 'M 460,160 L 760,150 L 790,320 L 510,310 Z',
      case_ids: ['CASE_PNB_MODI'],
      summary: 'Dubai International Financial Centre private wealth offices and corporate trustee entities.',
      facilityCount: 1,
      crimeDensityIndex: 70,
      tacticalTargets: [
        {
          id: 'target-difc-gate',
          name: 'DIFC Gate Precinct Wealth Cell',
          code: 'DIFC-01',
          type: 'BANK',
          actionType: 'OFFSHORE_HAWALA',
          position: [630, 240],
          address: 'The Gate Building, DIFC, Dubai, UAE',
          seizureMetric: 'Corporate Fiduciary Inspection Orders',
          status: 'Active Monitoring',
          operationalNotes: 'Offshore wealth advisors managing BVI and Jersey trusts.',
          evidenceSummary: 'Subpoenaed trustee management accounts.',
          caseTitle: 'PNB $2B LoU Fraud',
          caseId: 'CASE_PNB_MODI'
        }
      ]
    }
  ]
};

export const ALL_GIS_PROFILES: Record<string, GISJurisdictionProfile> = {
  IND: INDIA_GIS_PROFILE,
  WORLD: WORLD_GIS_PROFILE,
  GBR_LONDON: LONDON_GIS_PROFILE,
  ARE_DUBAI: DUBAI_GIS_PROFILE
};
