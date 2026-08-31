import { CaseId } from '../types';

export interface GeoCity {
  id: string;
  name: string;
  state: string;
  country: string;
  lat: number;
  lng: number;
  case_ids: CaseId[];
  summary: string;
  risk_level: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  facility_count: number;
  facilities: GeoFacility[];
}

export interface GeoFacility {
  id: string;
  name: string;
  type: 'BANK' | 'PORT' | 'EXCHANGE' | 'WAREHOUSE' | 'SAFEHOUSE' | 'TELECOM_HUB' | 'COURT' | 'COMMAND_HUB';
  address: string;
  lat: number;
  lng: number;
  case_id: CaseId;
  case_title: string;
  risk_score: number;
  role: 'ORIGIN' | 'TRANSIT' | 'DESTINATION' | 'COMMAND_HUB' | 'OFFSHORE_SINK';
  seizure_metric: string;
  status: 'Intercepted' | 'Active Monitoring' | 'Seized' | 'Extradition Target';
  operational_notes: string;
  evidence_summary: string;
}

export interface GeoState {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  lat: number;
  lng: number;
  zoomLevel: number;
  case_ids: CaseId[];
  summary: string;
  cities: GeoCity[];
  boundaryPolygon?: [number, number][]; // [lng, lat]
}

export interface GeoCountry {
  id: string;
  name: string;
  code: string;
  lat: number;
  lng: number;
  zoomLevel: number;
  flag: string;
  case_ids: CaseId[];
  summary: string;
  jurisdiction_role: string;
  mlat_status: 'Active Cooperation' | 'Extradition Battle' | 'Interpol Red Notice' | 'Non-Extradition Haven' | 'MLAT Pending';
  states: GeoState[];
}

export const REAL_JURISDICTIONS: GeoCountry[] = [
  // --------------------------------------------------
  // 1. INDIA
  // --------------------------------------------------
  {
    id: 'country-ind',
    name: 'India',
    code: 'IND',
    flag: '🇮🇳',
    lat: 20.5937,
    lng: 78.9629,
    zoomLevel: 2.2,
    case_ids: ['CASE_PNB_MODI', 'CASE_MUNDRA_TALC'],
    summary: 'Primary sovereign jurisdiction for PNB LoU banking fraud investigation and Mundra Adani Port heroin interception.',
    jurisdiction_role: 'Primary Victim State & Customs Intercept Jurisdiction',
    mlat_status: 'Active Cooperation',
    states: [
      {
        id: 'state-ind-mh',
        name: 'Maharashtra',
        country: 'India',
        countryCode: 'IND',
        lat: 19.0760,
        lng: 72.8777,
        zoomLevel: 4.0,
        case_ids: ['CASE_PNB_MODI'],
        summary: 'Financial and maritime epicenter of the ₹14,356 Cr SWIFT LoU banking fraud originating at PNB Brady House Branch, Fort, Mumbai.',
        boundaryPolygon: [
          [72.6, 20.2], [74.5, 21.5], [78.5, 21.5], [80.5, 20.0], [78.0, 16.0], [73.5, 15.8], [72.8, 18.5], [72.6, 20.2]
        ],
        cities: [
          {
            id: 'city-mumbai',
            name: 'Mumbai',
            state: 'Maharashtra',
            country: 'India',
            lat: 18.9322,
            lng: 72.8335,
            case_ids: ['CASE_PNB_MODI'],
            summary: 'Financial capital of India housing PNB Brady House, Bharat Diamond Bourse, and JNPT port container gates.',
            risk_level: 'CRITICAL',
            facility_count: 4,
            facilities: [
              {
                id: 'fac-pnb-brady',
                name: 'PNB Brady House Branch',
                type: 'BANK',
                address: 'Brady House, 12/14 Veer Nariman Road, Fort, Mumbai 400001',
                lat: 18.9322,
                lng: 72.8335,
                case_id: 'CASE_PNB_MODI',
                case_title: 'PNB $2B LoU Fraud',
                risk_score: 99,
                role: 'COMMAND_HUB',
                seizure_metric: '₹14,356 Cr Disbursed (293 LoUs)',
                status: 'Seized',
                operational_notes: 'Terminal used for transmitting unauthorized SWIFT MT799/MT734 messages without Core Banking entries.',
                evidence_summary: 'Forensic audit confirmed Deputy Manager Gokulnath Shetty shared level-4 SWIFT authorization keys to bypass reconciliation.'
              },
              {
                id: 'fac-pnb-bdb',
                name: 'Bharat Diamond Bourse (BDB)',
                type: 'EXCHANGE',
                address: 'G Block, Bandra Kurla Complex (BKC), Bandra East, Mumbai 400051',
                lat: 19.0657,
                lng: 72.8682,
                case_id: 'CASE_PNB_MODI',
                case_title: 'PNB $2B LoU Fraud',
                risk_score: 92,
                role: 'ORIGIN',
                seizure_metric: '₹2,400 Cr Diamond Consignments Attached',
                status: 'Seized',
                operational_notes: 'Solar Exports, Stellar Diamonds & Firestar Diamond registered headquarters and customs booking office.',
                evidence_summary: 'Customs valuation discrepancies confirmed inflated diamond grading and circular paper invoicing between Dubai shells.'
              },
              {
                id: 'fac-pnb-jnpt',
                name: 'JNPT Nhava Sheva Customs Container Terminal',
                type: 'PORT',
                address: 'Nhava Sheva Port, Uran, Navi Mumbai 400707',
                lat: 18.9496,
                lng: 72.9515,
                case_id: 'CASE_PNB_MODI',
                case_title: 'PNB $2B LoU Fraud',
                risk_score: 88,
                role: 'TRANSIT',
                seizure_metric: '₹680 Cr Cut Diamond & Gold Attachments',
                status: 'Intercepted',
                operational_notes: 'Primary maritime container export gate used by Firestar Diamond and Gitanjali Gems for offshore round-tripping.',
                evidence_summary: 'Customs Special Intelligence and Investigation Branch (SIIB) intercepted round-tripped synthetic diamond parcels.'
              },
              {
                id: 'fac-pnb-court',
                name: 'Special PMLA Court / Arthur Road High Security Vault',
                type: 'COURT',
                address: 'NM Joshi Marg, Chinchpokli, Mumbai 400011',
                lat: 18.9877,
                lng: 72.8315,
                case_id: 'CASE_PNB_MODI',
                case_title: 'PNB $2B LoU Fraud',
                risk_score: 85,
                role: 'COMMAND_HUB',
                seizure_metric: 'Fugitive Economic Offender (FEO) Attachment Orders',
                status: 'Extradition Target',
                operational_notes: 'Designated Special Court under Prevention of Money Laundering Act issuing Non-Bailable Warrants and extradition requests.',
                evidence_summary: 'Fugitive Economic Offenders Act 2018 declaration against Nirav Modi authorizing global asset confiscation.'
              }
            ]
          },
          {
            id: 'city-pune',
            name: 'Pune',
            state: 'Maharashtra',
            country: 'India',
            lat: 18.5204,
            lng: 73.8567,
            case_ids: ['CASE_PNB_MODI'],
            summary: 'Regional Zonal Directorate investigating benami properties, solar power assets, and farmhouses attached under PMLA.',
            risk_level: 'MEDIUM',
            facility_count: 1,
            facilities: [
              {
                id: 'fac-pnb-pune-ed',
                name: 'ED Zonal Directorate & Karjat Asset Cluster',
                type: 'SAFEHOUSE',
                address: 'Koregaon Park & Alibaug Coastal Corridor, Pune/Raigad',
                lat: 18.5204,
                lng: 73.8567,
                case_id: 'CASE_PNB_MODI',
                case_title: 'PNB $2B LoU Fraud',
                risk_score: 82,
                role: 'OFFSHORE_SINK',
                seizure_metric: '₹147 Cr Luxury Farmhouse Demolition & Attachments',
                status: 'Seized',
                operational_notes: 'Luxury seaside bungalows, 52-acre solar power plant in Karjat, and high-end automotive fleet attached.',
                evidence_summary: 'ED forensic bank audit traced proceeds of crime directly into benami shell trusts acquiring land portfolios.'
              }
            ]
          }
        ]
      },
      {
        id: 'state-ind-gj',
        name: 'Gujarat',
        country: 'India',
        countryCode: 'IND',
        lat: 22.8390,
        lng: 69.7020,
        zoomLevel: 4.0,
        case_ids: ['CASE_MUNDRA_TALC', 'CASE_PNB_MODI'],
        summary: 'Site of the historic 2,988.21 kg heroin seizure at Mundra Adani International Container Terminal and Surat diamond cutting hubs.',
        boundaryPolygon: [
          [68.5, 23.8], [71.0, 24.6], [74.3, 22.2], [72.8, 20.1], [70.0, 20.6], [68.8, 22.5], [68.5, 23.8]
        ],
        cities: [
          {
            id: 'city-mundra',
            name: 'Mundra (Kutch)',
            state: 'Gujarat',
            country: 'India',
            lat: 22.8390,
            lng: 69.7020,
            case_ids: ['CASE_MUNDRA_TALC'],
            summary: 'Deep water seaport in Gulf of Kutch where DRI and Customs intercepted the consignment of Afghan diacetylmorphine.',
            risk_level: 'CRITICAL',
            facility_count: 2,
            facilities: [
              {
                id: 'fac-mun-terminal',
                name: 'Adani International Container Terminal (MICT Berth 2/3)',
                type: 'PORT',
                address: 'Container Berth 2 & 3, Mundra Port, Kutch, Gujarat 370421',
                lat: 22.8390,
                lng: 69.7020,
                case_id: 'CASE_MUNDRA_TALC',
                case_title: 'Mundra Port 3,000kg Heroin',
                risk_score: 99,
                role: 'DESTINATION',
                seizure_metric: '2,988.21 kg Heroin (₹21,000 Cr / $2.7B)',
                status: 'Seized',
                operational_notes: 'DRI intercepted Containers TGHU081920 & TIKU912048 declaring semi-processed talc stone from Bandar Abbas.',
                evidence_summary: 'CFSL Chemical analysis verified diacetylmorphine concealed in 40 tons of pulverized and slab-cut talc.'
              },
              {
                id: 'fac-mun-customs-scanner',
                name: 'Mundra SEZ Drive-Through Container Scanner Zone',
                type: 'PORT',
                address: 'APSEZ Security Ingate 4, Mundra Port, Gujarat 370421',
                lat: 22.8550,
                lng: 69.7210,
                case_id: 'CASE_MUNDRA_TALC',
                case_title: 'Mundra Port 3,000kg Heroin',
                risk_score: 96,
                role: 'TRANSIT',
                seizure_metric: 'High-Energy X-Ray Radiographic Discrepancy',
                status: 'Intercepted',
                operational_notes: 'Specialist imaging flagged anomalous organic density layers inside talc cargo bags that differed from mineral stone.',
                evidence_summary: 'Spectral density scans matched synthetic diacetylmorphine polymer binders used in Kandahar chemical laboratories.'
              }
            ]
          },
          {
            id: 'city-surat',
            name: 'Surat',
            state: 'Gujarat',
            country: 'India',
            lat: 21.1702,
            lng: 72.8311,
            case_ids: ['CASE_PNB_MODI'],
            summary: 'Global capital of diamond cutting and polishing where rough diamonds were over-invoiced and round-tripped.',
            risk_level: 'HIGH',
            facility_count: 2,
            facilities: [
              {
                id: 'fac-surat-sdb',
                name: 'Surat Diamond Bourse (SDB)',
                type: 'EXCHANGE',
                address: 'DREAM City, Khajod, Surat, Gujarat 395007',
                lat: 21.1215,
                lng: 72.7725,
                case_id: 'CASE_PNB_MODI',
                case_title: 'PNB $2B LoU Fraud',
                risk_score: 90,
                role: 'ORIGIN',
                seizure_metric: '₹1,200 Cr Polished Diamond Audit Trails',
                status: 'Seized',
                operational_notes: 'Polishing units linked to Firestar Diamond & Stellar Diamonds engaged in inflated invoice round-tripping.',
                evidence_summary: 'Customs Special Valuation Branch identified 400% inflated invoices on lab-grown and low-grade natural diamonds.'
              },
              {
                id: 'fac-surat-varachha',
                name: 'Varachha Road Polishing & Hawala Nexus',
                type: 'EXCHANGE',
                address: 'Varachha Main Road, Mini Bazar, Surat, Gujarat 395006',
                lat: 21.2185,
                lng: 72.8590,
                case_id: 'CASE_PNB_MODI',
                case_title: 'PNB $2B LoU Fraud',
                risk_score: 87,
                role: 'OFFSHORE_SINK',
                seizure_metric: '₹450 Cr Angadia Cash Settlement Trails',
                status: 'Active Monitoring',
                operational_notes: 'Angadia courier network utilized to settle offshore diamond commission differentials into domestic cash accounts.',
                evidence_summary: 'Seized ledgers indexed token-coded ledger accounts mapping to Dubai and Antwerp front trading entities.'
              }
            ]
          },
          {
            id: 'city-ahmedabad',
            name: 'Ahmedabad',
            state: 'Gujarat',
            country: 'India',
            lat: 23.0225,
            lng: 72.5714,
            case_ids: ['CASE_MUNDRA_TALC', 'CASE_PNB_MODI'],
            summary: 'Regional Zonal Headquarters for DRI, NIA Special Court, and Central Forensic Science Laboratory.',
            risk_level: 'HIGH',
            facility_count: 2,
            facilities: [
              {
                id: 'fac-ahm-dri',
                name: 'DRI Gujarat Zonal Unit (GZU HQ)',
                type: 'COMMAND_HUB',
                address: 'Magnet Corporate Park, S.G. Highway, Thaltej, Ahmedabad 380054',
                lat: 23.0515,
                lng: 72.5085,
                case_id: 'CASE_MUNDRA_TALC',
                case_title: 'Mundra Port 3,000kg Heroin',
                risk_score: 97,
                role: 'COMMAND_HUB',
                seizure_metric: 'National Intercept Command & Forensic Custody',
                status: 'Intercepted',
                operational_notes: 'Command nerve center that executed the covert dockside sting at Mundra and spearheaded forensic sampling.',
                evidence_summary: 'Controlled delivery operation logs and intercepted satellite phone communications between handlers.'
              },
              {
                id: 'fac-ahm-sabarmati',
                name: 'Sabarmati Special NIA Custody & Interrogation Cell',
                type: 'COURT',
                address: 'Subhash Bridge, Sabarmati, Ahmedabad, Gujarat 380027',
                lat: 23.0785,
                lng: 72.5840,
                case_id: 'CASE_MUNDRA_TALC',
                case_title: 'Mundra Port 3,000kg Heroin',
                risk_score: 92,
                role: 'COMMAND_HUB',
                seizure_metric: 'Chargesheet Filed Against 16 Foreign & Domestic Nationals',
                status: 'Seized',
                operational_notes: 'Custodial interrogation of Afghan coordinators and Indian importer proprietors under UAPA & NDPS Acts.',
                evidence_summary: 'Forensic digital extraction from encrypted messaging applications and hawala transaction registers.'
              }
            ]
          },
          {
            id: 'city-kandla',
            name: 'Kandla (Gandhidham)',
            state: 'Gujarat',
            country: 'India',
            lat: 23.0118,
            lng: 70.2195,
            case_ids: ['CASE_MUNDRA_TALC'],
            summary: 'Deendayal Port anchorage and secondary customs examination berths in Gulf of Kutch.',
            risk_level: 'MEDIUM',
            facility_count: 1,
            facilities: [
              {
                id: 'fac-kandla-port',
                name: 'Deendayal Port Trust Cargo Terminal',
                type: 'PORT',
                address: 'Kandla Port Trust, Gandhidham, Kutch, Gujarat 370210',
                lat: 23.0118,
                lng: 70.2195,
                case_id: 'CASE_MUNDRA_TALC',
                case_title: 'Mundra Port 3,000kg Heroin',
                risk_score: 83,
                role: 'TRANSIT',
                seizure_metric: 'Secondary Arabian Sea Feeder Surveillance',
                status: 'Active Monitoring',
                operational_notes: 'Surveillance zone for dhows and bulk container feeder vessels transiting from Iranian coastal harbors.',
                evidence_summary: 'Automated vessel tracking (AIS) cross-referenced against bill of lading origins.'
              }
            ]
          }
        ]
      },
      {
        id: 'state-ind-dl',
        name: 'National Capital Territory of Delhi',
        country: 'India',
        countryCode: 'IND',
        lat: 28.5677,
        lng: 77.2433,
        zoomLevel: 4.2,
        case_ids: ['CASE_MUNDRA_TALC', 'CASE_PNB_MODI'],
        summary: 'National capital housing federal investigative headquarters (NIA, CBI, ED) and cartel distribution safehouse cells.',
        boundaryPolygon: [
          [76.8, 28.9], [77.4, 28.9], [77.4, 28.4], [76.8, 28.4], [76.8, 28.9]
        ],
        cities: [
          {
            id: 'city-delhi',
            name: 'New Delhi',
            state: 'Delhi (NCT)',
            country: 'India',
            lat: 28.5677,
            lng: 77.2433,
            case_ids: ['CASE_MUNDRA_TALC', 'CASE_PNB_MODI'],
            summary: 'Afghan handler networks coordinating inland transit, packaging, and hawala collection.',
            risk_level: 'CRITICAL',
            facility_count: 3,
            facilities: [
              {
                id: 'fac-mun-delhi',
                name: 'Lajpat Nagar & Alipur Distribution Hub',
                type: 'SAFEHOUSE',
                address: 'Block 4, Lajpat Nagar IV & Alipur Cold Chain, New Delhi 110024',
                lat: 28.5677,
                lng: 77.2433,
                case_id: 'CASE_MUNDRA_TALC',
                case_title: 'Mundra Port 3,000kg Heroin',
                risk_score: 94,
                role: 'COMMAND_HUB',
                seizure_metric: 'Cartel Wholesale Safehouse Grid',
                status: 'Seized',
                operational_notes: 'Operated by Afghan nationals on medical visas coordinating road transport from Mundra.',
                evidence_summary: 'NIA seized cash, fake identification documents, packaging presses, and burner SIM cards.'
              },
              {
                id: 'fac-delhi-nia-hq',
                name: 'NIA National Headquarters & Forensic Cyber Wing',
                type: 'COMMAND_HUB',
                address: 'CGO Complex, Lodhi Road, New Delhi 110003',
                lat: 28.5895,
                lng: 77.2340,
                case_id: 'CASE_MUNDRA_TALC',
                case_title: 'Mundra Port 3,000kg Heroin',
                risk_score: 98,
                role: 'COMMAND_HUB',
                seizure_metric: 'Federal Counter-Terrorism Intelligence Command',
                status: 'Active Monitoring',
                operational_notes: 'Coordinating multi-state probe connecting Mundra talc container shipments to narco-terrorist funding networks.',
                evidence_summary: 'Decrypted voice intercepts connecting Kandahar-based drug lord Mohammad Hasan Dad to Delhi distribution nodes.'
              },
              {
                id: 'fac-delhi-cbi-hq',
                name: 'CBI & ED Central Financial Crimes Directorate',
                type: 'BANK',
                address: '5-B, CGO Complex, Lodhi Road, New Delhi 110003',
                lat: 28.5910,
                lng: 77.2370,
                case_id: 'CASE_PNB_MODI',
                case_title: 'PNB $2B LoU Fraud',
                risk_score: 95,
                role: 'COMMAND_HUB',
                seizure_metric: 'Global Red Notice & Mutual Legal Assistance Requests',
                status: 'Extradition Target',
                operational_notes: 'Lead prosecution agency coordinating MLAT requests across UK, USA, UAE, Hong Kong, and Switzerland.',
                evidence_summary: 'Central repository of 1,200 foreign bank account transaction records and SWIFT audit logs.'
              }
            ]
          }
        ]
      },
      {
        id: 'state-ind-ap',
        name: 'Andhra Pradesh',
        country: 'India',
        countryCode: 'IND',
        lat: 16.5062,
        lng: 80.6480,
        zoomLevel: 3.8,
        case_ids: ['CASE_MUNDRA_TALC'],
        summary: 'Registered shell company location for Aashi Trading Company used as dummy importer in the 3,000kg heroin shipment.',
        boundaryPolygon: [
          [77.0, 14.0], [80.5, 16.2], [84.0, 19.0], [82.5, 17.0], [80.0, 13.5], [78.0, 13.5], [77.0, 14.0]
        ],
        cities: [
          {
            id: 'city-vijayawada',
            name: 'Vijayawada',
            state: 'Andhra Pradesh',
            country: 'India',
            lat: 16.5062,
            lng: 80.6480,
            case_ids: ['CASE_MUNDRA_TALC'],
            summary: 'Location of zero-activity shell importer registered under GSTIN 37AAHFA8799G1ZP.',
            risk_level: 'HIGH',
            facility_count: 2,
            facilities: [
              {
                id: 'fac-mun-aashi',
                name: 'Aashi Trading Registered Shell Office',
                type: 'EXCHANGE',
                address: 'D.No 24-28/1-14, Satyanarayanapuram, Vijayawada, AP 520011',
                lat: 16.5062,
                lng: 80.6480,
                case_id: 'CASE_MUNDRA_TALC',
                case_title: 'Mundra Port 3,000kg Heroin',
                risk_score: 91,
                role: 'DESTINATION',
                seizure_metric: 'Zero Trade History / ₹10L Fee Contract',
                status: 'Seized',
                operational_notes: 'Proprietors Machavaram Sudhakar & Vaishali rented their import IEC license to Afghan handlers for commission.',
                evidence_summary: 'Phone records showed direct communications with cartel coordinators in Tehran and New Delhi.'
              },
              {
                id: 'fac-ap-gst-cell',
                name: 'Vijayawada GST & Commercial Tax Enforcement Cell',
                type: 'SAFEHOUSE',
                address: 'Bandar Road, Labbipet, Vijayawada, Andhra Pradesh 520010',
                lat: 16.5020,
                lng: 80.6550,
                case_id: 'CASE_MUNDRA_TALC',
                case_title: 'Mundra Port 3,000kg Heroin',
                risk_score: 84,
                role: 'DESTINATION',
                seizure_metric: 'Paper Entity Verification / Inactive Filings',
                status: 'Seized',
                operational_notes: 'Enforcement cell verified Aashi Trading possessed no warehouse, transport trucks, or legitimate commercial customers.',
                evidence_summary: 'Tax inspection confirmed shell entity formed solely to act as a front importer for international narcotic consignments.'
              }
            ]
          },
          {
            id: 'city-vizag',
            name: 'Visakhapatnam',
            state: 'Andhra Pradesh',
            country: 'India',
            lat: 17.6868,
            lng: 83.2185,
            case_ids: ['CASE_MUNDRA_TALC'],
            summary: 'Major east coast deepwater seaport with specialized customs dry bulk & container terminal.',
            risk_level: 'MEDIUM',
            facility_count: 1,
            facilities: [
              {
                id: 'fac-vizag-port',
                name: 'Visakhapatnam Port Container Terminal (VCTPL)',
                type: 'PORT',
                address: 'Port Area, Visakhapatnam, Andhra Pradesh 530035',
                lat: 17.6868,
                lng: 83.2185,
                case_id: 'CASE_MUNDRA_TALC',
                case_title: 'Mundra Port 3,000kg Heroin',
                risk_score: 81,
                role: 'TRANSIT',
                seizure_metric: 'East Coast Maritime Route Profiling',
                status: 'Active Monitoring',
                operational_notes: 'Monitored for potential diversion of maritime cargo transiting via Bay of Bengal and Andaman Sea feeder routes.',
                evidence_summary: 'Customs risk management systems flagged secondary transshipment shipping manifests.'
              }
            ]
          }
        ]
      },
      {
        id: 'state-ind-pb',
        name: 'Punjab',
        country: 'India',
        countryCode: 'IND',
        lat: 31.6340,
        lng: 74.8723,
        zoomLevel: 4.0,
        case_ids: ['CASE_MUNDRA_TALC'],
        summary: 'Cross-border drug trafficking corridor and secondary inland distribution terminal for Afghan heroin.',
        boundaryPolygon: [
          [73.8, 32.0], [75.8, 32.5], [76.8, 30.5], [74.5, 29.8], [73.8, 32.0]
        ],
        cities: [
          {
            id: 'city-amritsar',
            name: 'Amritsar',
            state: 'Punjab',
            country: 'India',
            lat: 31.6340,
            lng: 74.8723,
            case_ids: ['CASE_MUNDRA_TALC'],
            summary: 'Border city housing Attari Integrated Check Post and historic overland hawala networks.',
            risk_level: 'HIGH',
            facility_count: 2,
            facilities: [
              {
                id: 'fac-pb-attari',
                name: 'Attari-Wagah Integrated Check Post (ICP)',
                type: 'PORT',
                address: 'NH 3, Attari Border, Amritsar, Punjab 143108',
                lat: 31.6042,
                lng: 74.5714,
                case_id: 'CASE_MUNDRA_TALC',
                case_title: 'Mundra Port 3,000kg Heroin',
                risk_score: 93,
                role: 'TRANSIT',
                seizure_metric: 'Land Border Cross-Verification Terminal',
                status: 'Active Monitoring',
                operational_notes: 'Customs and BSF joint intelligence cell monitoring cross-border truck freight manifests.',
                evidence_summary: 'Intelligence reports corroborated shifting of Afghan heroin routes from Attari land routes to maritime Mundra containers.'
              },
              {
                id: 'fac-pb-amritsar-hawala',
                name: 'Amritsar Hall Gate Hawala Settlement Nexus',
                type: 'EXCHANGE',
                address: 'Hall Bazar & Katra Ahluwalia, Amritsar, Punjab 143001',
                lat: 31.6285,
                lng: 74.8765,
                case_id: 'CASE_MUNDRA_TALC',
                case_title: 'Mundra Port 3,000kg Heroin',
                risk_score: 89,
                role: 'OFFSHORE_SINK',
                seizure_metric: '₹22 Cr Hawala Token Transactions Seized',
                status: 'Seized',
                operational_notes: 'Secondary hawala cell facilitating drug proceed conversions into cross-border trade settlements.',
                evidence_summary: 'Seized ledger diaries matched telephone numbers of money exchangers operating in Dubai Deira.'
              }
            ]
          }
        ]
      },
      {
        id: 'state-ind-rj',
        name: 'Rajasthan',
        country: 'India',
        countryCode: 'IND',
        lat: 26.9124,
        lng: 75.7873,
        zoomLevel: 3.8,
        case_ids: ['CASE_PNB_MODI', 'CASE_MUNDRA_TALC'],
        summary: 'Desert transit corridors and traditional gem cutting and jewelry trading centers.',
        boundaryPolygon: [
          [70.0, 27.5], [73.5, 30.0], [77.5, 28.0], [76.5, 24.2], [71.0, 24.5], [70.0, 27.5]
        ],
        cities: [
          {
            id: 'city-jaipur',
            name: 'Jaipur',
            state: 'Rajasthan',
            country: 'India',
            lat: 26.9124,
            lng: 75.7873,
            case_ids: ['CASE_PNB_MODI'],
            summary: 'Precious gemstone cutting hub and trading center linked to Firestar Diamond procurement.',
            risk_level: 'HIGH',
            facility_count: 1,
            facilities: [
              {
                id: 'fac-rj-jaipur-johari',
                name: 'Johari Bazaar Gem Valuation & Trading Cell',
                type: 'EXCHANGE',
                address: 'Johari Bazar & MI Road, Jaipur, Rajasthan 302003',
                lat: 26.9195,
                lng: 75.8260,
                case_id: 'CASE_PNB_MODI',
                case_title: 'PNB $2B LoU Fraud',
                risk_score: 86,
                role: 'ORIGIN',
                seizure_metric: '₹310 Cr Attached Semi-Precious Inventories',
                status: 'Seized',
                operational_notes: 'Procurement center where lower-grade stones were packaged for export under inflated customs declarations.',
                evidence_summary: 'Customs export certificates revealed falsified weight and clarity grading standards.'
              }
            ]
          }
        ]
      },
      {
        id: 'state-ind-tn',
        name: 'Tamil Nadu',
        country: 'India',
        countryCode: 'IND',
        lat: 13.0827,
        lng: 80.2707,
        zoomLevel: 3.8,
        case_ids: ['CASE_PNB_MODI', 'CASE_MUNDRA_TALC'],
        summary: 'Major southern maritime gateway and air cargo customs clearing complex.',
        boundaryPolygon: [
          [77.0, 8.5], [80.3, 13.5], [79.8, 10.0], [77.5, 8.2], [77.0, 8.5]
        ],
        cities: [
          {
            id: 'city-chennai',
            name: 'Chennai',
            state: 'Tamil Nadu',
            country: 'India',
            lat: 13.0827,
            lng: 80.2707,
            case_ids: ['CASE_PNB_MODI', 'CASE_MUNDRA_TALC'],
            summary: 'Coromandel coast seaport and air cargo customs clearance complex.',
            risk_level: 'HIGH',
            facility_count: 1,
            facilities: [
              {
                id: 'fac-tn-chennai-port',
                name: 'Chennai Port Air & Sea Cargo Customs Complex',
                type: 'PORT',
                address: 'Rajaji Salai, Chennai Port, Chennai 600001',
                lat: 13.0827,
                lng: 80.2707,
                case_id: 'CASE_PNB_MODI',
                case_title: 'PNB $2B LoU Fraud',
                risk_score: 84,
                role: 'TRANSIT',
                seizure_metric: '₹185 Cr Attached Luxury Retail Inventories',
                status: 'Intercepted',
                operational_notes: 'Gitanjali Gems retail and export distribution center serving southern domestic jewelry showroom chain.',
                evidence_summary: 'Physical stock verification identified hypothecated gold assets already pledged to multiple public sector banks.'
              }
            ]
          }
        ]
      },
      {
        id: 'state-ind-wb',
        name: 'West Bengal',
        country: 'India',
        countryCode: 'IND',
        lat: 22.5726,
        lng: 88.3639,
        zoomLevel: 3.8,
        case_ids: ['CASE_PNB_MODI', 'CASE_MUNDRA_TALC'],
        summary: 'Eastern commercial capital and major riverine port connecting Bay of Bengal trade routes.',
        boundaryPolygon: [
          [87.0, 24.0], [88.5, 27.0], [89.8, 22.0], [87.5, 21.5], [87.0, 24.0]
        ],
        cities: [
          {
            id: 'city-kolkata',
            name: 'Kolkata',
            state: 'West Bengal',
            country: 'India',
            lat: 22.5726,
            lng: 88.3639,
            case_ids: ['CASE_PNB_MODI'],
            summary: 'Commercial hub housing regional branches of defrauded public sector lending banks.',
            risk_level: 'HIGH',
            facility_count: 1,
            facilities: [
              {
                id: 'fac-wb-kolkata-port',
                name: 'Syama Prasad Mookerjee Port & Custom House',
                type: 'PORT',
                address: '15 Strand Road, Custom House, Kolkata 700001',
                lat: 22.5726,
                lng: 88.3639,
                case_id: 'CASE_PNB_MODI',
                case_title: 'PNB $2B LoU Fraud',
                risk_score: 83,
                role: 'TRANSIT',
                seizure_metric: '₹140 Cr Attached Commercial Real Estate',
                status: 'Seized',
                operational_notes: 'Allahabad Bank headquarters and Kolkata foreign exchange nostro account clearing division.',
                evidence_summary: 'SWIFT MT799 message confirmations received at Hong Kong branch without domestic ledger synchronization.'
              }
            ]
          }
        ]
      },
      {
        id: 'state-ind-ka',
        name: 'Karnataka',
        country: 'India',
        countryCode: 'IND',
        lat: 12.9716,
        lng: 77.5946,
        zoomLevel: 3.8,
        case_ids: ['CASE_PNB_MODI'],
        summary: 'Technology capital housing federal cyber forensic labs and crypto intelligence cells.',
        boundaryPolygon: [
          [74.0, 15.0], [77.5, 18.0], [78.5, 13.0], [75.0, 12.0], [74.0, 15.0]
        ],
        cities: [
          {
            id: 'city-bengaluru',
            name: 'Bengaluru',
            state: 'Karnataka',
            country: 'India',
            lat: 12.9716,
            lng: 77.5946,
            case_ids: ['CASE_PNB_MODI'],
            summary: 'Cyber forensics center supporting digital extraction of encrypted communications and ledger archives.',
            risk_level: 'MEDIUM',
            facility_count: 1,
            facilities: [
              {
                id: 'fac-ka-bengaluru-cyber',
                name: 'CID Cyber Forensics & Financial Intelligence Lab',
                type: 'COMMAND_HUB',
                address: 'Palace Road, Vasanth Nagar, Bengaluru, Karnataka 560001',
                lat: 12.9716,
                lng: 77.5946,
                case_id: 'CASE_PNB_MODI',
                case_title: 'PNB $2B LoU Fraud',
                risk_score: 88,
                role: 'COMMAND_HUB',
                seizure_metric: 'SWIFT Server Log Cryptographic Forensic Analysis',
                status: 'Active Monitoring',
                operational_notes: 'Forensic reconstruction of bypassed Finacle core banking application user logs and audit trails.',
                evidence_summary: 'Reconstructed log files established unauthorized administrative access keys used to issue fake letters of undertaking.'
              }
            ]
          }
        ]
      },
      {
        id: 'state-ind-kl',
        name: 'Kerala',
        country: 'India',
        countryCode: 'IND',
        lat: 9.9312,
        lng: 76.2673,
        zoomLevel: 3.8,
        case_ids: ['CASE_MUNDRA_TALC'],
        summary: 'Arabian Sea coastline and international transshipment terminal on the east-west sea lanes.',
        boundaryPolygon: [
          [75.0, 12.5], [76.5, 10.0], [77.5, 8.3], [76.0, 9.0], [75.0, 12.5]
        ],
        cities: [
          {
            id: 'city-kochi',
            name: 'Kochi (Cochin)',
            state: 'Kerala',
            country: 'India',
            lat: 9.9312,
            lng: 76.2673,
            case_ids: ['CASE_MUNDRA_TALC'],
            summary: 'Deep-water transshipment hub monitoring maritime traffic from the Gulf of Oman.',
            risk_level: 'HIGH',
            facility_count: 1,
            facilities: [
              {
                id: 'fac-kl-kochi-ictt',
                name: 'Vallarpadam International Container Transshipment Terminal (DP World)',
                type: 'PORT',
                address: 'Vallarpadam, Kochi, Kerala 682504',
                lat: 9.9860,
                lng: 76.2420,
                case_id: 'CASE_MUNDRA_TALC',
                case_title: 'Mundra Port 3,000kg Heroin',
                risk_score: 87,
                role: 'TRANSIT',
                seizure_metric: 'High-Risk Vessel Container Intercept Zone',
                status: 'Active Monitoring',
                operational_notes: 'Customs marine wing patrols Arabian Sea approaches intercepting suspicious dhows from Makran coast.',
                evidence_summary: 'Coastal radar network and Indian Coast Guard boarding party intelligence data.'
              }
            ]
          }
        ]
      }
    ]
  },

  // --------------------------------------------------
  // 2. IRAN
  // --------------------------------------------------
  {
    id: 'country-irn',
    name: 'Iran',
    code: 'IRN',
    flag: '🇮🇷',
    lat: 32.4279,
    lng: 53.6880,
    zoomLevel: 2.3,
    case_ids: ['CASE_MUNDRA_TALC'],
    summary: 'Maritime transshipment gateway at Bandar Abbas connecting Afghan landlocked production to Indian Ocean routes.',
    jurisdiction_role: 'Transit Gateway & Transshipment Harbor',
    mlat_status: 'MLAT Pending',
    states: [
      {
        id: 'state-irn-hormozgan',
        name: 'Hormozgan Province',
        country: 'Iran',
        countryCode: 'IRN',
        lat: 27.1832,
        lng: 56.2666,
        zoomLevel: 3.5,
        case_ids: ['CASE_MUNDRA_TALC'],
        summary: 'Home of the Shahid Rajaee Port Complex on the Strait of Hormuz handling containerized feeder traffic.',
        cities: [
          {
            id: 'city-bandar-abbas',
            name: 'Bandar Abbas',
            state: 'Hormozgan',
            country: 'Iran',
            lat: 27.1832,
            lng: 56.2666,
            case_ids: ['CASE_MUNDRA_TALC'],
            summary: 'Strategic deep-water commercial port where Afghan talc trucks were transferred into marine shipping containers.',
            risk_level: 'CRITICAL',
            facility_count: 1,
            facilities: [
              {
                id: 'fac-mun-rajaee',
                name: 'Shahid Rajaee Port Complex',
                type: 'PORT',
                address: 'West Commercial Basin, Bandar Abbas, Hormozgan Province',
                lat: 27.1832,
                lng: 56.2666,
                case_id: 'CASE_MUNDRA_TALC',
                case_title: 'Mundra Port 3,000kg Heroin',
                risk_score: 96,
                role: 'TRANSIT',
                seizure_metric: '40-Ton Talc Transit Gateway',
                status: 'Intercepted',
                operational_notes: 'Containers loaded aboard feeder vessel MSC Steffi without breaking customs bonded locks.',
                evidence_summary: 'Bills of Lading verified origin of container dispatch as Hasan Husain Ltd with export documentation cleared via Dogharoun.'
              }
            ]
          }
        ]
      }
    ]
  },

  // --------------------------------------------------
  // 3. AFGHANISTAN
  // --------------------------------------------------
  {
    id: 'country-afg',
    name: 'Afghanistan',
    code: 'AFG',
    flag: '🇦🇫',
    lat: 33.9391,
    lng: 67.7100,
    zoomLevel: 2.4,
    case_ids: ['CASE_MUNDRA_TALC'],
    summary: 'Source cultivation and diacetylmorphine extraction origin in the Helmand and Kandahar river basins.',
    jurisdiction_role: 'Primary Origin & Chemical Processing Source',
    mlat_status: 'Non-Extradition Haven',
    states: [
      {
        id: 'state-afg-kandahar',
        name: 'Kandahar Province',
        country: 'Afghanistan',
        countryCode: 'AFG',
        lat: 31.6289,
        lng: 65.7372,
        zoomLevel: 3.5,
        case_ids: ['CASE_MUNDRA_TALC'],
        summary: 'Industrial base of Hasan Husain Ltd where opiate paste was processed into talc stone matrix.',
        cities: [
          {
            id: 'city-kandahar',
            name: 'Kandahar City',
            state: 'Kandahar',
            country: 'Afghanistan',
            lat: 31.6289,
            lng: 65.7372,
            case_ids: ['CASE_MUNDRA_TALC'],
            summary: 'Manufacturing and industrial packaging center for transnational contraband export.',
            risk_level: 'CRITICAL',
            facility_count: 1,
            facilities: [
              {
                id: 'fac-mun-hasan',
                name: 'Hasan Husain Ltd Processing Facility',
                type: 'WAREHOUSE',
                address: 'Shorandam Industrial Park, Kandahar City, Afghanistan',
                lat: 31.6289,
                lng: 65.7372,
                case_id: 'CASE_MUNDRA_TALC',
                case_title: 'Mundra Port 3,000kg Heroin',
                risk_score: 99,
                role: 'ORIGIN',
                seizure_metric: 'Helmand River Valley Diacetylmorphine Base',
                status: 'Active Monitoring',
                operational_notes: 'Factory procured raw opium, converted to high-purity diacetylmorphine, and compressed it into talc powder blocks.',
                evidence_summary: 'Brothers Mohammad Husain Dad and Mohammad Hasan Dad named as primary kingpins in Interpol and NIA files.'
              }
            ]
          }
        ]
      }
    ]
  },

  // --------------------------------------------------
  // 4. BELGIUM / EUROPE
  // --------------------------------------------------
  {
    id: 'country-bel',
    name: 'Belgium',
    code: 'BEL',
    flag: '🇧🇪',
    lat: 50.5039,
    lng: 4.4699,
    zoomLevel: 3.0,
    case_ids: ['CASE_ANOM_TROJAN'],
    summary: 'Key European maritime point of entry for containerized cocaine from South American Pacific ports.',
    jurisdiction_role: 'European Maritime Gateway & Tactical Intercept Point',
    mlat_status: 'Active Cooperation',
    states: [
      {
        id: 'state-bel-flanders',
        name: 'Flemish Region (Antwerp)',
        country: 'Belgium',
        countryCode: 'BEL',
        lat: 51.2858,
        lng: 4.3168,
        zoomLevel: 3.6,
        case_ids: ['CASE_ANOM_TROJAN'],
        summary: 'Port of Antwerp container terminals handling transatlantic reefer cargo.',
        cities: [
          {
            id: 'city-antwerp',
            name: 'Antwerp',
            state: 'Flanders',
            country: 'Belgium',
            lat: 51.2858,
            lng: 4.3168,
            case_ids: ['CASE_ANOM_TROJAN'],
            summary: 'Second largest port in Europe and primary tactical strike zone during Operation Trojan Shield.',
            risk_level: 'CRITICAL',
            facility_count: 1,
            facilities: [
              {
                id: 'fac-anom-antwerp',
                name: 'Port of Antwerp (Terminal 913 & Kaai 1742)',
                type: 'PORT',
                address: 'Deurganckdok, Haven van Antwerpen, 9130 Kallo, Belgium',
                lat: 51.2858,
                lng: 4.3168,
                case_id: 'CASE_ANOM_TROJAN',
                case_title: 'Operation Trojan Shield',
                risk_score: 97,
                role: 'TRANSIT',
                seizure_metric: '8,200 kg Cocaine Seized Dockside',
                status: 'Intercepted',
                operational_notes: 'Belgian Federal Judicial Police intercepted container extraction teams using live ANOM decrypted chat GPS pins.',
                evidence_summary: 'Corrupted dockworkers and stevedore access PINs recovered directly from decrypted handset threads.'
              }
            ]
          }
        ]
      }
    ]
  },

  // --------------------------------------------------
  // 5. UNITED ARAB EMIRATES
  // --------------------------------------------------
  {
    id: 'country-are',
    name: 'United Arab Emirates',
    code: 'ARE',
    flag: '🇦🇪',
    lat: 23.4241,
    lng: 53.8478,
    zoomLevel: 2.8,
    case_ids: ['CASE_PNB_MODI', 'CASE_ANOM_TROJAN'],
    summary: 'Global financial hub for hawala settlements, circular trade invoices, and cryptocurrency laundering.',
    jurisdiction_role: 'Financial Clearing Hub & Offshore Sink',
    mlat_status: 'Active Cooperation',
    states: [
      {
        id: 'state-are-dubai',
        name: 'Emirate of Dubai',
        country: 'United Arab Emirates',
        countryCode: 'ARE',
        lat: 25.2048,
        lng: 55.2708,
        zoomLevel: 3.6,
        case_ids: ['CASE_PNB_MODI', 'CASE_ANOM_TROJAN'],
        summary: 'Deira Gold Souk invoice clearing and DMCC/JLT crypto asset conversions.',
        cities: [
          {
            id: 'city-dubai',
            name: 'Dubai',
            state: 'Dubai Emirate',
            country: 'United Arab Emirates',
            lat: 25.2711,
            lng: 55.2981,
            case_ids: ['CASE_PNB_MODI', 'CASE_ANOM_TROJAN'],
            summary: 'Cross-case financial nexus facilitating both PNB buyer-credit laundering and cartel crypto conversions.',
            risk_level: 'CRITICAL',
            facility_count: 2,
            facilities: [
              {
                id: 'fac-pnb-deira',
                name: 'Deira Gold Souk & Al Ras Hub',
                type: 'EXCHANGE',
                address: 'Al Ras, Deira Commercial District, Dubai, UAE',
                lat: 25.2711,
                lng: 55.2981,
                case_id: 'CASE_PNB_MODI',
                case_title: 'PNB $2B LoU Fraud',
                risk_score: 95,
                role: 'TRANSIT',
                seizure_metric: '$850M Hawala & Gold Trade Invoices',
                status: 'Intercepted',
                operational_notes: 'Clearing house for circular export-import invoices between Tri-Color and Hong Kong dummy corporations.',
                evidence_summary: 'Nirav Modi shell companies routed funds through local exchange bureaus without underlying physical bullion shipment.'
              },
              {
                id: 'fac-anom-jlt',
                name: 'Jumeirah Lakes Towers (JLT) Crypto Enclave',
                type: 'BANK',
                address: 'Cluster X & DMCC Freezone, Jumeirah Lakes Towers, Dubai, UAE',
                lat: 25.0805,
                lng: 55.1403,
                case_id: 'CASE_ANOM_TROJAN',
                case_title: 'Operation Trojan Shield',
                risk_score: 93,
                role: 'OFFSHORE_SINK',
                seizure_metric: '€250M USDT & Luxury Assets Frozen',
                status: 'Active Monitoring',
                operational_notes: 'Super-cartel leaders negotiated cryptocurrency settlements and luxury real estate purchases.',
                evidence_summary: 'Decrypted ANOM messages documented large-scale cash-to-USDT conversion rates and transaction hashes.'
              }
            ]
          }
        ]
      }
    ]
  },

  // --------------------------------------------------
  // 6. AUSTRALIA
  // --------------------------------------------------
  {
    id: 'country-aus',
    name: 'Australia',
    code: 'AUS',
    flag: '🇦🇺',
    lat: -25.2744,
    lng: 133.7751,
    zoomLevel: 2.1,
    case_ids: ['CASE_ANOM_TROJAN'],
    summary: 'Operation Ironside tactical target zone executed jointly by the Australian Federal Police (AFP) and FBI.',
    jurisdiction_role: 'Primary Tactical Interception State',
    mlat_status: 'Active Cooperation',
    states: [
      {
        id: 'state-aus-nsw',
        name: 'New South Wales',
        country: 'Australia',
        countryCode: 'AUS',
        lat: -33.9740,
        lng: 151.2180,
        zoomLevel: 3.5,
        case_ids: ['CASE_ANOM_TROJAN'],
        summary: 'Port Botany maritime terminal and Sydney underworld distribution network.',
        cities: [
          {
            id: 'city-sydney',
            name: 'Sydney',
            state: 'New South Wales',
            country: 'Australia',
            lat: -33.9740,
            lng: 151.2180,
            case_ids: ['CASE_ANOM_TROJAN'],
            summary: 'Over 224 syndicate members charged across Sydney during coordinated AFP dawn raids.',
            risk_level: 'CRITICAL',
            facility_count: 1,
            facilities: [
              {
                id: 'fac-anom-botany',
                name: 'Port Botany Freight Terminal',
                type: 'PORT',
                address: 'Brotherson Dock, Port Botany, Sydney NSW 2036, Australia',
                lat: -33.9740,
                lng: 151.2180,
                case_id: 'CASE_ANOM_TROJAN',
                case_title: 'Operation Trojan Shield',
                risk_score: 94,
                role: 'DESTINATION',
                seizure_metric: '3.7 Tonnes Narcotics / $48M Cash',
                status: 'Seized',
                operational_notes: 'AFP intercepted containerized shipments hidden inside industrial machinery and heavy timber.',
                evidence_summary: 'Operation Ironside surveillance wire recorded precise container seal IDs communicated on ANOM handsets.'
              }
            ]
          }
        ]
      }
    ]
  },

  // --------------------------------------------------
  // 7. TURKEY
  // --------------------------------------------------
  {
    id: 'country-tur',
    name: 'Turkey',
    code: 'TUR',
    flag: '🇹🇷',
    lat: 38.9637,
    lng: 35.2433,
    zoomLevel: 2.8,
    case_ids: ['CASE_ANOM_TROJAN'],
    summary: 'Operational base of global cartel kingpin Hakan Ayik who unintentionally popularized the Trojan ANOM platform.',
    jurisdiction_role: 'Syndicate Command Base',
    mlat_status: 'Extradition Battle',
    states: [
      {
        id: 'state-tur-istanbul',
        name: 'Istanbul Province',
        country: 'Turkey',
        countryCode: 'TUR',
        lat: 41.0082,
        lng: 28.9784,
        zoomLevel: 3.5,
        case_ids: ['CASE_ANOM_TROJAN'],
        summary: 'Bosphorus command nexus coordinating transnational cocaine and precursor logistics.',
        cities: [
          {
            id: 'city-istanbul',
            name: 'Istanbul',
            state: 'Istanbul Province',
            country: 'Turkey',
            lat: 41.0082,
            lng: 28.9784,
            case_ids: ['CASE_ANOM_TROJAN'],
            summary: 'Underworld distributor hub where 12,000 encrypted devices were handed down the cartel chain.',
            risk_level: 'CRITICAL',
            facility_count: 1,
            facilities: [
              {
                id: 'fac-anom-ayik',
                name: 'Bosphorus Command & Sisli District Base',
                type: 'TELECOM_HUB',
                address: 'Sisli & Besiktas Enclave, Istanbul, Turkey',
                lat: 41.0082,
                lng: 28.9784,
                case_id: 'CASE_ANOM_TROJAN',
                case_title: 'Operation Trojan Shield',
                risk_score: 99,
                role: 'COMMAND_HUB',
                seizure_metric: '12,000 Trojan Handsets Seeded',
                status: 'Intercepted',
                operational_notes: 'Hakan Ayik vouched for ANOM security to senior mafia figures, propagating FBI telemetry globally.',
                evidence_summary: 'Undercover FBI telemetry servers intercepted live multi-ton shipping confirmations broadcast from Sisli.'
              }
            ]
          }
        ]
      }
    ]
  },

  // --------------------------------------------------
  // 8. UNITED STATES
  // --------------------------------------------------
  {
    id: 'country-usa',
    name: 'United States',
    code: 'USA',
    flag: '🇺🇸',
    lat: 37.0902,
    lng: -95.7129,
    zoomLevel: 2.1,
    case_ids: ['CASE_ANOM_TROJAN', 'CASE_PNB_MODI'],
    summary: 'Home of FBI Cyber Division cryptographic array and SDNY Bankruptcy recovery proceedings for Firestar Diamond.',
    jurisdiction_role: 'Lead Investigative & Judicial Authority',
    mlat_status: 'Active Cooperation',
    states: [
      {
        id: 'state-usa-ca',
        name: 'California',
        country: 'United States',
        countryCode: 'USA',
        lat: 32.7157,
        lng: -117.1611,
        zoomLevel: 3.4,
        case_ids: ['CASE_ANOM_TROJAN'],
        summary: 'San Diego FBI Cyber Division command center orchestrating Operation Trojan Shield.',
        cities: [
          {
            id: 'city-san-diego',
            name: 'San Diego',
            state: 'California',
            country: 'United States',
            lat: 32.7157,
            lng: -117.1611,
            case_ids: ['CASE_ANOM_TROJAN'],
            summary: 'Federal jurisdiction hosting the confidential human source master server decryption array.',
            risk_level: 'HIGH',
            facility_count: 1,
            facilities: [
              {
                id: 'fac-anom-fbi',
                name: 'FBI Cyber Operations & Decryption Array',
                type: 'TELECOM_HUB',
                address: '10385 Vista Sorrento Pkwy, San Diego, CA 92121',
                lat: 32.7157,
                lng: -117.1611,
                case_id: 'CASE_ANOM_TROJAN',
                case_title: 'Operation Trojan Shield',
                risk_score: 90,
                role: 'COMMAND_HUB',
                seizure_metric: '27 Million Messages Decrypted (800+ Arrests)',
                status: 'Active Monitoring',
                operational_notes: 'FBI operated mirror servers intercepting every sent message encrypted with secondary master key.',
                evidence_summary: 'Unsealed SDNY indictment verified 300+ syndicates in 100+ countries were compromised.'
              }
            ]
          }
        ]
      },
      {
        id: 'state-usa-ny',
        name: 'New York',
        country: 'United States',
        countryCode: 'USA',
        lat: 40.7128,
        lng: -74.0060,
        zoomLevel: 3.5,
        case_ids: ['CASE_PNB_MODI'],
        summary: 'Firestar Diamond Inc Chapter 11 bankruptcy liquidation and Manhattan asset tracing.',
        cities: [
          {
            id: 'city-new-york',
            name: 'New York City',
            state: 'New York',
            country: 'United States',
            lat: 40.7128,
            lng: -74.0060,
            case_ids: ['CASE_PNB_MODI'],
            summary: 'Manhattan retail presence and Southern District of New York bankruptcy court.',
            risk_level: 'HIGH',
            facility_count: 1,
            facilities: [
              {
                id: 'fac-pnb-ny',
                name: 'Madison Avenue Boutique & US SDNY Court',
                type: 'SAFEHOUSE',
                address: '745 Madison Ave & US Bankruptcy Court SDNY, New York 10065',
                lat: 40.7128,
                lng: -74.0060,
                case_id: 'CASE_PNB_MODI',
                case_title: 'PNB $2B LoU Fraud',
                risk_score: 86,
                role: 'DESTINATION',
                seizure_metric: '$260M Asset Recovery Pool',
                status: 'Seized',
                operational_notes: 'Chapter 11 trustee Richard Levin assigned asset recovery proceeds directly to PNB consortium.',
                evidence_summary: 'Forensic audits confirmed Indian bank buyer credits were funneled into US retail diamond inventory.'
              }
            ]
          }
        ]
      }
    ]
  },

  // --------------------------------------------------
  // 9. UNITED KINGDOM
  // --------------------------------------------------
  {
    id: 'country-gbr',
    name: 'United Kingdom',
    code: 'GBR',
    flag: '🇬🇧',
    lat: 55.3781,
    lng: -3.4360,
    zoomLevel: 3.0,
    case_ids: ['CASE_PNB_MODI'],
    summary: 'Site of Nirav Modi arrest in Holborn and high-profile extradition proceedings at Westminster Magistrates Court.',
    jurisdiction_role: 'Extradition Adjudication Jurisdiction',
    mlat_status: 'Extradition Battle',
    states: [
      {
        id: 'state-gbr-london',
        name: 'Greater London',
        country: 'United Kingdom',
        countryCode: 'GBR',
        lat: 51.5074,
        lng: -0.1278,
        zoomLevel: 3.6,
        case_ids: ['CASE_PNB_MODI'],
        summary: 'London judicial and detention facilities hosting fugitive extradition hearings.',
        cities: [
          {
            id: 'city-london',
            name: 'London',
            state: 'Greater London',
            country: 'United Kingdom',
            lat: 51.5074,
            lng: -0.1278,
            case_ids: ['CASE_PNB_MODI'],
            summary: 'Arrest location in Holborn; detained at HMP Wandsworth.',
            risk_level: 'HIGH',
            facility_count: 1,
            facilities: [
              {
                id: 'fac-pnb-uk',
                name: 'Wandsworth Prison & Westminster Court',
                type: 'COURT',
                address: '181 Marylebone Rd, Westminster, London NW1 5BR',
                lat: 51.5074,
                lng: -0.1278,
                case_id: 'CASE_PNB_MODI',
                case_title: 'PNB $2B LoU Fraud',
                risk_score: 88,
                role: 'COMMAND_HUB',
                seizure_metric: '£2.4M Bail Refused / UK High Court Appeal',
                status: 'Extradition Target',
                operational_notes: 'Fugitive Nirav Modi arrested on CBI/ED Interpol Red Notice warrant; UK Home Secretary cleared extradition to Arthur Road Jail.',
                evidence_summary: 'District Judge Sam Goozee ruled a prima facie case of fraud and money laundering exists.'
              }
            ]
          }
        ]
      }
    ]
  },

  // --------------------------------------------------
  // 10. HONG KONG SAR
  // --------------------------------------------------
  {
    id: 'country-hkg',
    name: 'Hong Kong SAR',
    code: 'HKG',
    flag: '🇭🇰',
    lat: 22.3193,
    lng: 114.1694,
    zoomLevel: 3.8,
    case_ids: ['CASE_PNB_MODI'],
    summary: 'Major offshore recipient for buyer credit remittances deposited directly into dummy supplier accounts.',
    jurisdiction_role: 'Nostro Banking Sinks & Shell Corridors',
    mlat_status: 'MLAT Pending',
    states: [
      {
        id: 'state-hkg-central',
        name: 'Central & Western District',
        country: 'Hong Kong SAR',
        countryCode: 'HKG',
        lat: 22.2819,
        lng: 114.1581,
        zoomLevel: 4.2,
        case_ids: ['CASE_PNB_MODI'],
        summary: 'Kowloon and Central financial district accounts crediting unauthorized PNB buyer credit loans.',
        cities: [
          {
            id: 'city-hongkong',
            name: 'Hong Kong',
            state: 'Central & Western',
            country: 'Hong Kong SAR',
            lat: 22.2819,
            lng: 114.1581,
            case_ids: ['CASE_PNB_MODI'],
            summary: 'Offshore Nostro destination for over $1.16 Billion in fraudulent LoU credits.',
            risk_level: 'CRITICAL',
            facility_count: 1,
            facilities: [
              {
                id: 'fac-pnb-hk',
                name: 'Central Financial District & Kowloon Hub',
                type: 'BANK',
                address: 'Two International Finance Centre, Central, Hong Kong',
                lat: 22.2819,
                lng: 114.1581,
                case_id: 'CASE_PNB_MODI',
                case_title: 'PNB $2B LoU Fraud',
                risk_score: 96,
                role: 'OFFSHORE_SINK',
                seizure_metric: '$1.16B Buyer Credit Inflow',
                status: 'Intercepted',
                operational_notes: 'Allahabad Bank & Axis Bank HK Nostro branches received MT799 SWIFT messages and paid dummy firms.',
                evidence_summary: 'Entities Auriel Gems, Sunshine Ltd & Sino Traders had shared directors and virtual office addresses.'
              }
            ]
          }
        ]
      }
    ]
  },

  // --------------------------------------------------
  // 11. ANTIGUA AND BARBUDA
  // --------------------------------------------------
  {
    id: 'country-atg',
    name: 'Antigua and Barbuda',
    code: 'ATG',
    flag: '🇦🇬',
    lat: 17.0608,
    lng: -61.7964,
    zoomLevel: 3.5,
    case_ids: ['CASE_PNB_MODI'],
    summary: 'Offshore sanctuary acquired via Citizenship by Investment program by Gitanjali Gems promoter Mehul Choksi.',
    jurisdiction_role: 'Safe Haven & Citizenship Haven',
    mlat_status: 'Extradition Battle',
    states: [
      {
        id: 'state-atg-stjohn',
        name: 'Saint John Parish',
        country: 'Antigua and Barbuda',
        countryCode: 'ATG',
        lat: 17.1172,
        lng: -61.8457,
        zoomLevel: 4.2,
        case_ids: ['CASE_PNB_MODI'],
        summary: 'Jolly Harbour resort and St. John\'s high court litigation arena.',
        cities: [
          {
            id: 'city-stjohns',
            name: 'St. John\'s',
            state: 'Saint John',
            country: 'Antigua and Barbuda',
            lat: 17.1172,
            lng: -61.8457,
            case_ids: ['CASE_PNB_MODI'],
            summary: 'Capital city where extradition hearings and constitutional claims are pending.',
            risk_level: 'CRITICAL',
            facility_count: 1,
            facilities: [
              {
                id: 'fac-pnb-antigua',
                name: 'Jolly Harbour Safe Haven & Legal Nexus',
                type: 'SAFEHOUSE',
                address: 'Jolly Harbour Marina, Saint Mary / St. John\'s, Antigua',
                lat: 17.1172,
                lng: -61.8457,
                case_id: 'CASE_PNB_MODI',
                case_title: 'PNB $2B LoU Fraud',
                risk_score: 95,
                role: 'OFFSHORE_SINK',
                seizure_metric: 'Citizenship by Investment (CIP) Sanctuary',
                status: 'Extradition Target',
                operational_notes: 'Mehul Choksi fled India before FIR registration; subject of ongoing Privy Council and local court extradition appeals.',
                evidence_summary: 'Indian Ministry of External Affairs and CBI submitted extradition dossiers detailing ₹6,098 Cr direct fraud liability.'
              }
            ]
          }
        ]
      }
    ]
  },

  // --------------------------------------------------
  // 12. ECUADOR
  // --------------------------------------------------
  {
    id: 'country-ecu',
    name: 'Ecuador',
    code: 'ECU',
    flag: '🇪🇨',
    lat: -1.8312,
    lng: -78.1834,
    zoomLevel: 2.8,
    case_ids: ['CASE_ANOM_TROJAN'],
    summary: 'Pacific maritime origin for bulk containerized cocaine dispatched through commercial fruit and seafood freight.',
    jurisdiction_role: 'Primary Maritime Narcotic Origin',
    mlat_status: 'Active Cooperation',
    states: [
      {
        id: 'state-ecu-guayas',
        name: 'Guayas Province',
        country: 'Ecuador',
        countryCode: 'ECU',
        lat: -2.1894,
        lng: -79.8891,
        zoomLevel: 3.6,
        case_ids: ['CASE_ANOM_TROJAN'],
        summary: 'Port of Guayaquil container terminals dispatching transatlantic vessels.',
        cities: [
          {
            id: 'city-guayaquil',
            name: 'Guayaquil',
            state: 'Guayas',
            country: 'Ecuador',
            lat: -2.1894,
            lng: -79.8891,
            case_ids: ['CASE_ANOM_TROJAN'],
            summary: 'Primary port where rip-on container loads were coordinated via encrypted ANOM messaging.',
            risk_level: 'CRITICAL',
            facility_count: 1,
            facilities: [
              {
                id: 'fac-anom-guayaquil',
                name: 'Port of Guayaquil & Contecon Terminal',
                type: 'PORT',
                address: 'Terminal Portuario de Guayaquil, Guayas, Ecuador',
                lat: -2.1894,
                lng: -79.8891,
                case_id: 'CASE_ANOM_TROJAN',
                case_title: 'Operation Trojan Shield',
                risk_score: 96,
                role: 'ORIGIN',
                seizure_metric: '15 Tonne Maritime Supply Line',
                status: 'Intercepted',
                operational_notes: 'Cartels packed diacetylmorphine and cocaine bricks inside false refrigeration ceiling panels.',
                evidence_summary: 'Decrypted ANOM photos showed container numbers, export stamps, and container seal serials.'
              }
            ]
          }
        ]
      }
    ]
  }
];
