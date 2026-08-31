import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import { 
  Flame, 
  Layers, 
  Search, 
  X, 
  Crosshair, 
  MapPin, 
  ShieldAlert, 
  Radio, 
  DollarSign, 
  ZoomIn, 
  ZoomOut, 
  Compass,
  Play,
  Pause,
  ChevronRight,
  Maximize2,
  Minimize2,
  Combine,
  Scale,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { POLENode, POLEEdge, CaseId } from '../types';
import { 
  REAL_4D_TRACKS, 
  REAL_FINANCIAL_FLOW_ARCS, 
  REAL_GEOFENCES, 
  REAL_ISOCHRONES, 
  TelemetryTrack 
} from '../data/intelligence4DEngine';
import { FinancialFlowSankeyDrawer } from './FinancialFlowSankeyDrawer';
import { CrossCaseNexusModal } from './CrossCaseNexusModal';
import { ManifestRiskScorerModal } from './ManifestRiskScorerModal';
import { JudicialCourtroomMode } from './JudicialCourtroomMode';

export interface GeoMapProps {
  nodes: POLENode[];
  edges: POLEEdge[];
  selectedNodeId: string | null;
  onSelectNode: (node: POLENode | null) => void;
  timelineStartDate?: string;
  timelineEndDate?: string;
  selectedCaseId?: CaseId;
  activeTelemetryTrack?: TelemetryTrack | null;
  currentTelemetryWaypointIndex?: number;
  onSelectTelemetryTrack?: (track: TelemetryTrack) => void;
  onTelemetryWaypointChange?: (index: number) => void;
}

// Action Category Colors and Metadata
export interface ActionCategoryMeta {
  key: string;
  label: string;
  shortLabel: string;
  color: string;
  haloColor: string;
  badgeBg: string;
  badgeText: string;
  description: string;
}

export const ACTION_CATEGORIES: Record<string, ActionCategoryMeta> = {
  INTERCEPT_SEIZURE: {
    key: 'INTERCEPT_SEIZURE',
    label: 'Customs Intercept & Physical Seizure',
    shortLabel: 'Seizure',
    color: '#DC2626',
    haloColor: 'rgba(220, 38, 38, 0.4)',
    badgeBg: 'bg-red-50',
    badgeText: 'text-red-700',
    description: 'Direct customs container interception, contraband raid, dockside bust'
  },
  SOURCE_PRODUCTION: {
    key: 'SOURCE_PRODUCTION',
    label: 'Source & Illicit Production',
    shortLabel: 'Source',
    color: '#059669',
    haloColor: 'rgba(5, 150, 105, 0.4)',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    description: 'Opium cultivation, diacetylmorphine chemical synthesis, raw diamond origin'
  },
  COMMAND_TELEMETRY: {
    key: 'COMMAND_TELEMETRY',
    label: 'Command Hub & FBI Telemetry',
    shortLabel: 'Command',
    color: '#2563EB',
    haloColor: 'rgba(37, 99, 235, 0.4)',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
    description: 'Syndicate command center, encrypted Trojan handset relay, SWIFT auth terminal'
  },
  OFFSHORE_HAWALA: {
    key: 'OFFSHORE_HAWALA',
    label: 'Offshore Sink & Hawala Laundering',
    shortLabel: 'Hawala',
    color: '#D97706',
    haloColor: 'rgba(217, 119, 6, 0.4)',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-700',
    description: 'Nostro clearing accounts, dummy shell companies, crypto mixing freezones'
  },
  TRANSIT_PORT: {
    key: 'TRANSIT_PORT',
    label: 'Maritime & Overland Transshipment',
    shortLabel: 'Transit Port',
    color: '#7C3AED',
    haloColor: 'rgba(124, 58, 237, 0.4)',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-700',
    description: 'Strait of Hormuz feeder port, cross-border overland truck route, transshipment dock'
  },
  EXTRADITION_TARGET: {
    key: 'EXTRADITION_TARGET',
    label: 'Extradition & Fugitive Warrant',
    shortLabel: 'Extradition',
    color: '#E11D48',
    haloColor: 'rgba(225, 29, 72, 0.4)',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-700',
    description: 'Interpol Red Notice subject, High Court appeal, CIP passport sanctuary'
  }
};

// Tactical Target Sites with GPS Coordinates
export interface RealTacticalPoint {
  id: string;
  name: string;
  code: string;
  lat: number;
  lng: number;
  city: string;
  country: string;
  jurisdiction: 'IND' | 'GBR' | 'ARE' | 'GLOBAL';
  actionType: keyof typeof ACTION_CATEGORIES;
  threatLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  heatIntensity: number;
  heatRadius: number;
  seizureMetric: string;
  status: string;
  operationalNotes: string;
  evidenceSummary: string;
  caseId: CaseId;
  relatedEntities: string[];
}

export const REAL_TACTICAL_SITES: RealTacticalPoint[] = [
  // GUJARAT & MUNDRA
  {
    id: 'site-mundra-port',
    name: 'Mundra Port Container Terminal 4',
    code: 'INMUN-T4-CUSTOMS',
    lat: 22.8395,
    lng: 69.7042,
    city: 'Mundra, Kutch, Gujarat',
    country: 'India',
    jurisdiction: 'IND',
    actionType: 'INTERCEPT_SEIZURE',
    threatLevel: 'CRITICAL',
    heatIntensity: 1.0,
    heatRadius: 35000,
    seizureMetric: '₹21,000 Cr (2,988.21 kg Heroin in Semi-cut Talc)',
    status: 'Physical Intercept / Seized by DRI',
    operationalNotes: 'Containers GSTU3294827 & GSTU3294832 offloaded from vessel MSC Algeciras via Bandar Abbas. Talc consignments concealed 99.4% pure diacetylmorphine.',
    evidenceSummary: 'CRCL Chemical Test Report 2021-TALC-992 confirmed diacetylmorphine base. Bill of Lading BL-BND-MUN-8819 issued by Hasan Husain Ltd.',
    caseId: 'CASE_MUNDRA_TALC',
    relatedEntities: ['Aashi Trading Company', 'Mohammad Hassan Dad', 'Machaavaram Sudhakar', 'MSC Stevedores']
  },
  {
    id: 'site-bhuj-depot',
    name: 'Gandhidham Inland Container Freight Station',
    code: 'IN-GIM-CFS-02',
    lat: 23.0753,
    lng: 70.1337,
    city: 'Gandhidham, Kutch',
    country: 'India',
    jurisdiction: 'IND',
    actionType: 'TRANSIT_PORT',
    threatLevel: 'HIGH',
    heatIntensity: 0.85,
    heatRadius: 25000,
    seizureMetric: '₹140 Cr Freight Transit Intercept',
    status: 'Inland Customs Bonded Holding',
    operationalNotes: 'Secondary transit check where fake E-way bills for Delhi delivery were forged under Aashi Trading GST identity.',
    evidenceSummary: 'FastTag logs and truck weighing discrepancy tickets matching 40-foot container MH-04-GP-9120.',
    caseId: 'CASE_MUNDRA_TALC',
    relatedEntities: ['Aashi Trading Company', 'Malhotra Freight Logistics']
  },
  {
    id: 'site-surat-bourse',
    name: 'Surat Diamond Bourse & Mahidharpura Bazaar',
    code: 'IN-STV-SDB-01',
    lat: 21.1702,
    lng: 72.8311,
    city: 'Surat, Gujarat',
    country: 'India',
    jurisdiction: 'IND',
    actionType: 'OFFSHORE_HAWALA',
    threatLevel: 'HIGH',
    heatIntensity: 0.82,
    heatRadius: 28000,
    seizureMetric: '₹1,200 Cr Circular Diamond Invoicing',
    status: 'Active ED Attachment',
    operationalNotes: 'Polished diamond valuation inflation network. Lab-grown diamonds certified as high-grade roughs for circular export-import.',
    evidenceSummary: 'GIA fake grade certificates and customs shipping bills seized under PMLA case ECIR/02/HIU/2018.',
    caseId: 'CASE_PNB_MODI',
    relatedEntities: ['Solar Exports', 'Stellar Diamond', 'Diamonds R Us', 'Nirav Modi']
  },

  // MUMBAI FINANCIAL & MARITIME SECTOR
  {
    id: 'site-pnb-brady-house',
    name: 'Punjab National Bank - Brady House Branch',
    code: 'IN-BOM-PNB-01',
    lat: 18.9322,
    lng: 72.8335,
    city: 'Fort, Mumbai',
    country: 'India',
    jurisdiction: 'IND',
    actionType: 'COMMAND_TELEMETRY',
    threatLevel: 'CRITICAL',
    heatIntensity: 0.98,
    heatRadius: 30000,
    seizureMetric: '₹14,356 Cr Unrecorded SWIFT LoU Issuances',
    status: 'CBI Special Court Jurisdiction',
    operationalNotes: 'SWIFT operator Gokulnath Shetty issued 1,214 fraudulent Letters of Undertaking (LoUs) using Level-1 SWIFT terminals without CBS mirroring.',
    evidenceSummary: 'CBI Chargesheet 1/2018; SWIFT FIN MT799 message logs; unmapped Nostro reconciliation ledgers.',
    caseId: 'CASE_PNB_MODI',
    relatedEntities: ['Nirav Modi', 'Mehul Choksi', 'Gokulnath Shetty', 'Solar Exports', 'PNB Nostro Hub']
  },
  {
    id: 'site-mumbai-bkc',
    name: 'Bandra-Kurla Complex (BKC) Financial Center',
    code: 'IN-BOM-BKC-09',
    lat: 19.0657,
    lng: 72.8687,
    city: 'BKC, Mumbai',
    country: 'India',
    jurisdiction: 'IND',
    actionType: 'OFFSHORE_HAWALA',
    threatLevel: 'CRITICAL',
    heatIntensity: 0.92,
    heatRadius: 26000,
    seizureMetric: '₹2,400 Cr Attached Corporate Real Estate',
    status: 'ED Zonal Office Attachment',
    operationalNotes: 'Corporate headquarters of Firestar Diamond International and diamond showroom properties attached by Enforcement Directorate.',
    evidenceSummary: 'PMLA Provisional Attachment Orders PAO-08/2018; Registrar of Companies filings.',
    caseId: 'CASE_PNB_MODI',
    relatedEntities: ['Firestar International', 'Nirav Modi', 'Enforcement Directorate']
  },
  {
    id: 'site-jnpt-port',
    name: 'JNPT Port Container Terminal 3 (Nhava Sheva)',
    code: 'IN-NSA-JNPT-03',
    lat: 18.9496,
    lng: 72.9510,
    city: 'Navi Mumbai',
    country: 'India',
    jurisdiction: 'IND',
    actionType: 'TRANSIT_PORT',
    threatLevel: 'HIGH',
    heatIntensity: 0.88,
    heatRadius: 24000,
    seizureMetric: '₹4,800 Cr Linked Container Inflows',
    status: 'Special Customs Surveillance Zone',
    operationalNotes: 'Transshipment point for secondary bonded cargo shipments linked to Dubai JLT trading companies.',
    evidenceSummary: 'Container movement manifests and gate-in records for Pacific Diamonds FZE.',
    caseId: 'CASE_PNB_MODI',
    relatedEntities: ['Firestar International', 'Pacific Diamonds FZE']
  },
  {
    id: 'site-bhiwandi-depot',
    name: 'Bhiwandi Storage & Freight Complex 14',
    code: 'IN-BHW-LOG-14',
    lat: 19.2968,
    lng: 73.0631,
    city: 'Bhiwandi, Thane, Maharashtra',
    country: 'India',
    jurisdiction: 'IND',
    actionType: 'COMMAND_TELEMETRY',
    threatLevel: 'HIGH',
    heatIntensity: 0.84,
    heatRadius: 22000,
    seizureMetric: '₹280 Cr Transshipment Staging Hub',
    status: 'Joint Police & DRI Raid Site',
    operationalNotes: 'Logistics consolidation point where contraband containers were staged before domestic distribution into Punjab and Delhi NCR.',
    evidenceSummary: 'Warehouse leases signed by shell transport contractors and forged GST e-invoices.',
    caseId: 'CASE_MUNDRA_TALC',
    relatedEntities: ['Malhotra Freight Logistics', 'Aashi Trading Company']
  },

  // DELHI NCR & NORTHERN CORRIDOR
  {
    id: 'site-delhi-lajpat',
    name: 'Lajpat Nagar & Alipur Distribution Hub',
    code: 'IN-DEL-LPN-04',
    lat: 28.5684,
    lng: 77.2433,
    city: 'New Delhi',
    country: 'India',
    jurisdiction: 'IND',
    actionType: 'INTERCEPT_SEIZURE',
    threatLevel: 'CRITICAL',
    heatIntensity: 0.94,
    heatRadius: 30000,
    seizureMetric: '₹1,400 Cr Heroin Wholesale Cash & Labs',
    status: 'NIA Charge-Sheeted Safehouse',
    operationalNotes: 'Afghan national cell processing base. Chemical purification of semi-processed talc extract into commercial street bricks.',
    evidenceSummary: 'Seized hydraulic compression presses, adulterant chemicals, and Anōm encrypted handsets.',
    caseId: 'CASE_MUNDRA_TALC',
    relatedEntities: ['Mohammad Hassan Dad', 'Aashi Trading Company']
  },
  {
    id: 'site-amritsar-attari',
    name: 'Attari Integrated Checkpost (ICP) Rail Cargo',
    code: 'IN-ATQ-ICP-01',
    lat: 31.6038,
    lng: 74.6042,
    city: 'Attari, Amritsar, Punjab',
    country: 'India',
    jurisdiction: 'IND',
    actionType: 'INTERCEPT_SEIZURE',
    threatLevel: 'HIGH',
    heatIntensity: 0.89,
    heatRadius: 28000,
    seizureMetric: '₹2,700 Cr Cross-Border Salt Cargo Seizure (532 kg)',
    status: 'Customs ICP Special Enforcement',
    operationalNotes: 'Parallel cross-border concealment route using bulk rock salt consignments from Pakistan.',
    evidenceSummary: 'Customs Seizure Memo ATQ-532/2019; Chemical forensic report.',
    caseId: 'CASE_MUNDRA_TALC',
    relatedEntities: ['Tariq Merchant', 'Mohammad Hassan Dad']
  },

  // LONDON & UK EXTRADITION SITES
  {
    id: 'site-london-westminster',
    name: 'Westminster Magistrates Court & High Court',
    code: 'GBR-LON-WMC-01',
    lat: 51.5205,
    lng: -0.1650,
    city: 'Marylebone, London',
    country: 'United Kingdom',
    jurisdiction: 'GBR',
    actionType: 'EXTRADITION_TARGET',
    threatLevel: 'CRITICAL',
    heatIntensity: 0.96,
    heatRadius: 32000,
    seizureMetric: 'UK High Court Extradition Order & Bail Refusal',
    status: 'Judicial Extradition Appeal Cleared',
    operationalNotes: 'Senior District Judge ruled prima facie case of conspiracy to defraud PNB and money laundering. Nirav Modi bail rejected 7 times.',
    evidenceSummary: 'UK High Court of Justice Judgment [2022] EWHC 2873 (Admin); CPS Extradition Dossier.',
    caseId: 'CASE_PNB_MODI',
    relatedEntities: ['Nirav Modi', 'Crown Prosecution Service (CPS)', 'Central Bureau of Investigation (CBI)']
  },
  {
    id: 'site-london-wandsworth',
    name: 'HMP Wandsworth Prison',
    code: 'GBR-LON-HMP-04',
    lat: 51.4485,
    lng: -0.1770,
    city: 'Wandsworth, London',
    country: 'United Kingdom',
    jurisdiction: 'GBR',
    actionType: 'EXTRADITION_TARGET',
    threatLevel: 'HIGH',
    heatIntensity: 0.88,
    heatRadius: 25000,
    seizureMetric: 'Fugitive Remand in Custody (Inmate #A9812DX)',
    status: 'Active Detention Facility',
    operationalNotes: 'Incarceration facility holding fugitive diamond merchant Nirav Modi pending UK Home Office extradition sign-off.',
    evidenceSummary: 'HM Prison Service Custody Record; UK Home Secretary Extradition Order.',
    caseId: 'CASE_PNB_MODI',
    relatedEntities: ['Nirav Modi']
  },
  {
    id: 'site-london-mayfair',
    name: 'Mayfair Old Bond Street Boutique & Centre Point',
    code: 'GBR-LON-OBS-31',
    lat: 51.5090,
    lng: -0.1440,
    city: 'Mayfair, London',
    country: 'United Kingdom',
    jurisdiction: 'GBR',
    actionType: 'OFFSHORE_HAWALA',
    threatLevel: 'HIGH',
    heatIntensity: 0.87,
    heatRadius: 24000,
    seizureMetric: '£95 Million Attached Luxury Properties',
    status: 'UK High Court Freezing Injunction',
    operationalNotes: 'Flagship Nirav Modi high-jewelry store on Old Bond Street and luxury residential penthouse in Centre Point tower purchased with diverted PNB funds.',
    evidenceSummary: 'HM Land Registry Title Deeds; ED Worldwide Freezing Order (WFO).',
    caseId: 'CASE_PNB_MODI',
    relatedEntities: ['Nirav Modi', 'Firestar Diamond International']
  },

  // DUBAI & UAE FREE ZONE CORRIDORS
  {
    id: 'site-dubai-deira',
    name: 'Deira Gold Souk & Al-Bahar Hawala Vault',
    code: 'ARE-DXB-DRA-01',
    lat: 25.2697,
    lng: 55.3015,
    city: 'Deira, Dubai',
    country: 'United Arab Emirates',
    jurisdiction: 'ARE',
    actionType: 'OFFSHORE_HAWALA',
    threatLevel: 'CRITICAL',
    heatIntensity: 0.95,
    heatRadius: 32000,
    seizureMetric: 'AED 3.8 Billion Hawala Clearing & Gold Invoicing',
    status: 'UAE FIU Special Regulatory Audit',
    operationalNotes: 'Apex offshore Hawala node and cash-to-gold settlement market. Front companies cleared payments for fictitious diamond imports.',
    evidenceSummary: 'UAE Central Bank FIU Suspicious Transaction Reports (STRs); dummy invoice packs from Al-Bahar General Trading LLC.',
    caseId: 'CASE_PNB_MODI',
    relatedEntities: ['Al-Bahar General Trading LLC', 'Tariq Merchant', 'Pacific Diamonds FZE']
  },
  {
    id: 'site-dubai-difc',
    name: 'DIFC Gate - Dubai International Financial Centre',
    code: 'ARE-DXB-DIFC-04',
    lat: 25.2048,
    lng: 55.2708,
    city: 'DIFC, Dubai',
    country: 'United Arab Emirates',
    jurisdiction: 'ARE',
    actionType: 'OFFSHORE_HAWALA',
    threatLevel: 'HIGH',
    heatIntensity: 0.87,
    heatRadius: 24000,
    seizureMetric: '$420M Nostro Clearing Accounts',
    status: 'DFSA Regulatory Injunction',
    operationalNotes: 'Offshore correspondent bank accounts receiving PNB Nostro wire transfers originating from Brady House LoUs.',
    evidenceSummary: 'Nostro bank statements from Union Bank of India (Hong Kong & Dubai branches).',
    caseId: 'CASE_PNB_MODI',
    relatedEntities: ['Nirav Modi', 'PNB Nostro Hub']
  },
  {
    id: 'site-dubai-dmcc',
    name: 'DMCC Almas Tower (Dubai Diamond Exchange)',
    code: 'ARE-DXB-DMCC-01',
    lat: 25.0690,
    lng: 55.1380,
    city: 'JLT, Dubai',
    country: 'United Arab Emirates',
    jurisdiction: 'ARE',
    actionType: 'OFFSHORE_HAWALA',
    threatLevel: 'HIGH',
    heatIntensity: 0.86,
    heatRadius: 25000,
    seizureMetric: '$890M Shell Diamond Trading Entities',
    status: 'DMCC License Freezing Orders',
    operationalNotes: 'Free zone trading entities registered under nominal dummy directors (former Firestar employees) with zero real commercial activity.',
    evidenceSummary: 'DMCC corporate registry certificates; ED Rogatory Letters (Letters of Request).',
    caseId: 'CASE_PNB_MODI',
    relatedEntities: ['Pacific Diamonds FZE', 'Tariq Merchant']
  },

  // GLOBAL ENFORCEMENT & ORIGIN CORRIDORS
  {
    id: 'site-bandar-abbas',
    name: 'Shahid Rajaee Port (Bandar Abbas)',
    code: 'IRN-BND-SRP-01',
    lat: 27.1832,
    lng: 56.2666,
    city: 'Bandar Abbas',
    country: 'Iran',
    jurisdiction: 'GLOBAL',
    actionType: 'TRANSIT_PORT',
    threatLevel: 'CRITICAL',
    heatIntensity: 0.95,
    heatRadius: 35000,
    seizureMetric: 'Apex Maritime Port of Loading (2,988 kg Origin)',
    status: 'International Maritime Intelligence Flag',
    operationalNotes: 'Port where containers GSTU3294827 were loaded onto feeder vessel MSC Algeciras after overland transit from Islam Qala, Afghanistan.',
    evidenceSummary: 'Iranian Customs Export Declaration; MSC bill of lading container tracking data.',
    caseId: 'CASE_MUNDRA_TALC',
    relatedEntities: ['Hasan Husain Ltd', 'Mohammad Hassan Dad']
  },
  {
    id: 'site-afghan-helmand',
    name: 'Helmand & Kandahar Processing Triangle',
    code: 'AFG-KDH-HLM-01',
    lat: 31.6289,
    lng: 65.7372,
    city: 'Kandahar / Helmand',
    country: 'Afghanistan',
    jurisdiction: 'GLOBAL',
    actionType: 'SOURCE_PRODUCTION',
    threatLevel: 'CRITICAL',
    heatIntensity: 0.99,
    heatRadius: 40000,
    seizureMetric: 'Illicit Opium Cultivation & Diacetylmorphine Base Labs',
    status: 'UNODC Monitored Cultivation Zone',
    operationalNotes: 'Source agricultural zone where raw opium was converted into 99.4% pure heroin base and mixed with semi-processed talc stone powder.',
    evidenceSummary: 'UNODC Afghanistan Opium Survey 2021; DEA intelligence dossiers.',
    caseId: 'CASE_MUNDRA_TALC',
    relatedEntities: ['Mohammad Hassan Dad', 'Hasan Husain Ltd']
  },
  {
    id: 'site-antwerp-bourse',
    name: 'Antwerp Diamond District (Hoveniersstraat)',
    code: 'BEL-ANR-ADD-01',
    lat: 51.2155,
    lng: 4.4172,
    city: 'Antwerp',
    country: 'Belgium',
    jurisdiction: 'GLOBAL',
    actionType: 'OFFSHORE_HAWALA',
    threatLevel: 'HIGH',
    heatIntensity: 0.89,
    heatRadius: 25000,
    seizureMetric: '€320M Circular Invoicing Flow',
    status: 'Belgian FIU Inspection',
    operationalNotes: 'European diamond hub where rough and polished lots were round-tripped with inflated valuations to trigger PNB LoU credit drawdowns.',
    evidenceSummary: 'Belgian Diamond Office export certificates; bank SWIFT clearing receipts.',
    caseId: 'CASE_PNB_MODI',
    relatedEntities: ['Nirav Modi', 'Firestar Diamond Belgium']
  },
  {
    id: 'site-new-york-sdny',
    name: 'SDNY Federal District Court & Boutiques',
    code: 'USA-NYC-SDNY-01',
    lat: 40.7138,
    lng: -74.0014,
    city: 'New York, NY',
    country: 'United States',
    jurisdiction: 'GLOBAL',
    actionType: 'COMMAND_TELEMETRY',
    threatLevel: 'HIGH',
    heatIntensity: 0.91,
    heatRadius: 28000,
    seizureMetric: '$260M Chapter 11 Bankruptcy Seizure',
    status: 'US Bankruptcy Court Trustee Injunction',
    operationalNotes: 'Chapter 11 proceedings of Firestar Diamond Inc (US). US Trustee Richard Levin uncovered extensive fraud and asset diversion.',
    evidenceSummary: 'Examiner Report of John J. Carney, US Bankruptcy Court SDNY (Case 18-10509).',
    caseId: 'CASE_PNB_MODI',
    relatedEntities: ['Firestar Diamond Inc (USA)', 'Nirav Modi']
  },
  {
    id: 'site-hong-kong-hub',
    name: 'Hong Kong Central & Tsim Sha Tsui Hub',
    code: 'HKG-HKG-TST-01',
    lat: 22.2819,
    lng: 114.1581,
    city: 'Hong Kong',
    country: 'Hong Kong SAR',
    jurisdiction: 'GLOBAL',
    actionType: 'OFFSHORE_HAWALA',
    threatLevel: 'HIGH',
    heatIntensity: 0.90,
    heatRadius: 28000,
    seizureMetric: '$1.4 Billion Front Entity Invoicing Nexus',
    status: 'HK Customs & Joint Financial Intelligence Unit',
    operationalNotes: 'Shell front companies (Sunlight Gems, Aurum Jewels, Fancy Creations) used to receive PNB discounted credit funds.',
    evidenceSummary: 'Hong Kong Companies Registry filings; UBI Hong Kong Nostro wire confirmation tickets.',
    caseId: 'CASE_PNB_MODI',
    relatedEntities: ['Nirav Modi', 'Sunlight Gems HK', 'PNB Nostro Hub']
  },
  {
    id: 'site-st-kitts-sanctuary',
    name: 'Basseterre CIP Sanctuary (St. Kitts)',
    code: 'KNA-BAS-CIP-01',
    lat: 17.3026,
    lng: -62.7261,
    city: 'Basseterre',
    country: 'St. Kitts and Nevis',
    jurisdiction: 'GLOBAL',
    actionType: 'EXTRADITION_TARGET',
    threatLevel: 'HIGH',
    heatIntensity: 0.84,
    heatRadius: 22000,
    seizureMetric: 'Citizenship by Investment Asset Haven',
    status: 'Interpol Red Notice Tracking',
    operationalNotes: 'Caribbean offshore citizenship bought for $150,000 to evade Indian passport revocation and Indian court warrants.',
    evidenceSummary: 'Interpol Red Notice A-6882/7-2018; Citizenship unit certificate.',
    caseId: 'CASE_PNB_MODI',
    relatedEntities: ['Mehul Choksi', 'Antigua & Barbuda / St. Kitts']
  }
];

// Open, 100% Free, and Stadia Maps HD Tile Providers
export interface OpenTileProvider {
  id: string;
  name: string;
  tagline: string;
  url: string;
  subdomains?: string;
  maxZoom: number;
  className: string;
  isRetina?: boolean;
}

// Map API Key (Stadia Maps / Stamen)
export const MAP_API_KEY = 
  (import.meta as any)?.env?.MAP_API_KEY || 
  (typeof process !== 'undefined' && (process as any)?.env?.MAP_API_KEY) || 
  'eyJhbGciOiJIUzI1NiJ9.eyJhIjoiYWNfNTk4aXIzYmsiLCJqdGkiOiIyZmFiYTcxNyIsImV4cCI6MTc5MDg0MzEwMH0.kVAz0pHRgT-lpMVwd3GMsLdWTU0fNKJ9CUEVgx-Z6eE';

export const OPEN_TILE_PROVIDERS: OpenTileProvider[] = [
  {
    id: 'stadia-smooth',
    name: 'Stadia Alidade Smooth',
    tagline: 'Ultra-crisp vector minimalist light',
    url: `https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=${MAP_API_KEY}`,
    maxZoom: 20,
    className: 'tiles-stadia-smooth',
    isRetina: true
  },
  {
    id: 'stadia-dark',
    name: 'Stadia Alidade Dark',
    tagline: 'Tactical midnight radar slate',
    url: `https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png?api_key=${MAP_API_KEY}`,
    maxZoom: 20,
    className: 'tiles-dark-slate',
    isRetina: true
  },
  {
    id: 'stadia-toner',
    name: 'Stadia Stamen Toner',
    tagline: 'High-contrast monochrome ink style',
    url: `https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}{r}.png?api_key=${MAP_API_KEY}`,
    maxZoom: 20,
    className: 'tiles-toner',
    isRetina: true
  },
  {
    id: 'stadia-terrain',
    name: 'Stadia Stamen Terrain',
    tagline: 'Topographic shaded relief contours',
    url: `https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.png?api_key=${MAP_API_KEY}`,
    maxZoom: 18,
    className: 'tiles-topo',
    isRetina: true
  },
  {
    id: 'stadia-outdoors',
    name: 'Stadia Outdoors',
    tagline: 'Rich geographic & coastal topology',
    url: `https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png?api_key=${MAP_API_KEY}`,
    maxZoom: 20,
    className: 'tiles-outdoors',
    isRetina: true
  },
  {
    id: 'carto-light',
    name: 'Minimal Positron',
    tagline: 'Clean grayscale without visual noise',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    subdomains: 'abcd',
    maxZoom: 19,
    className: 'tiles-minimal'
  },
  {
    id: 'osm-standard',
    name: 'OpenStreetMap Standard',
    tagline: 'Global public cartography',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    maxZoom: 19,
    className: 'tiles-osm'
  }
];

// Corridors
export interface RealCorridor {
  id: string;
  name: string;
  color: string;
  dashArray: string;
  points: [number, number][];
  description: string;
}

export const REAL_CORRIDORS: RealCorridor[] = [
  {
    id: 'corridor-heroin-talc',
    name: 'Opium / Talc Transit (Helmand → Bandar Abbas → Mundra → Delhi)',
    color: '#DC2626',
    dashArray: '6, 6',
    points: [
      [31.6289, 65.7372],
      [27.1832, 56.2666],
      [22.8395, 69.7042],
      [19.2968, 73.0631],
      [28.5684, 77.2433]
    ],
    description: '2,988 kg diacetylmorphine consignment route intercepted by DRI at Mundra Port Container Terminal 4.'
  },
  {
    id: 'corridor-pnb-swift-launder',
    name: 'PNB LoU Fraud Capital Flow (Mumbai → Dubai → Antwerp → London)',
    color: '#D97706',
    dashArray: '8, 4',
    points: [
      [18.9322, 72.8335],
      [25.2697, 55.3015],
      [51.2155, 4.4172],
      [51.5205, -0.1650]
    ],
    description: '₹14,356 Cr SWIFT credit diversion and luxury real estate acquisition pipeline.'
  },
  {
    id: 'corridor-diamond-roundtrip',
    name: 'Circular Diamond Invoicing (Surat → Dubai → HK → NYC)',
    color: '#2563EB',
    dashArray: '4, 4',
    points: [
      [21.1702, 72.8311],
      [25.0690, 55.1380],
      [22.2819, 114.1581],
      [40.7138, -74.0014]
    ],
    description: 'Over-invoiced diamond trade cycle used to trigger fraudulent foreign bank letters of credit.'
  }
];

// Presets for camera navigation
export interface GeoPreset {
  id: string;
  name: string;
  flag: string;
  center: [number, number];
  zoom: number;
  description: string;
  metric: string;
}

export const GEO_PRESETS: GeoPreset[] = [
  {
    id: 'IND',
    name: 'India Matrix',
    flag: '🇮🇳',
    center: [21.5, 76.5],
    zoom: 5,
    description: 'Mundra Port, Mumbai BKC, Delhi NCR, Surat & Amritsar',
    metric: '₹21,000 Cr Seizure Grid'
  },
  {
    id: 'GUJ',
    name: 'Mundra Port',
    flag: '⚓',
    center: [22.84, 69.70],
    zoom: 10,
    description: 'Mundra Port Container Terminal 4 & Gandhidham CFS',
    metric: '2,988 kg Heroin Intercept Site'
  },
  {
    id: 'BOM',
    name: 'Mumbai Financial',
    flag: '🏦',
    center: [18.98, 72.85],
    zoom: 12,
    description: 'PNB Brady House Branch, BKC & JNPT Port',
    metric: '₹14,356 Cr SWIFT Fraud Core'
  },
  {
    id: 'DXB',
    name: 'Dubai Offshore',
    flag: '🇦🇪',
    center: [25.20, 55.27],
    zoom: 11,
    description: 'Deira Gold Souk, DIFC & DMCC Almas Tower',
    metric: 'Hawala & Shell Entity Sink'
  },
  {
    id: 'LON',
    name: 'London Extradition',
    flag: '🇬🇧',
    center: [51.51, -0.14],
    zoom: 12,
    description: 'Westminster Magistrates Court, Mayfair & HMP Wandsworth',
    metric: 'UK High Court Extradition Front'
  },
  {
    id: 'GLOBAL',
    name: 'Global POLE',
    flag: '🌐',
    center: [30.0, 50.0],
    zoom: 3,
    description: 'Transnational network bridging Afghan Golden Crescent, Dubai & London',
    metric: 'Global Investigative Grid'
  }
];

export const GeoMap: React.FC<GeoMapProps> = ({
  nodes,
  edges,
  selectedNodeId,
  onSelectNode,
  timelineStartDate,
  timelineEndDate,
  selectedCaseId: propCaseId,
  activeTelemetryTrack,
  currentTelemetryWaypointIndex,
  onSelectTelemetryTrack,
  onTelemetryWaypointChange
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const activeTileLayerRef = useRef<L.TileLayer | null>(null);

  // Layer groups
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const heatmapLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const corridorsLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const fourDTrackLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const financialArcsLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const geofencesLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const isochronesLayerGroupRef = useRef<L.LayerGroup | null>(null);

  // Selected Tile Provider (Stadia Maps HD / Open)
  const [activeTileId, setActiveTileId] = useState<string>('stadia-smooth');
  const [activePresetId, setActivePresetId] = useState<string>('IND');

  // Minimalist Layer Toggles
  const [showHeatmap, setShowHeatmap] = useState<boolean>(false);
  const [showCorridors, setShowCorridors] = useState<boolean>(true);
  const [showFinancialArcs, setShowFinancialArcs] = useState<boolean>(true);
  const [showGeofences, setShowGeofences] = useState<boolean>(false);
  const [show4DTrack, setShow4DTrack] = useState<boolean>(true);

  // UI Drawer / Floating Panels
  const [selectedSite, setSelectedSite] = useState<RealTacticalPoint | null>(null);
  const [showLayerMenu, setShowLayerMenu] = useState<boolean>(false);
  const [showTileMenu, setShowTileMenu] = useState<boolean>(false);
  const [show4DPlayer, setShow4DPlayer] = useState<boolean>(false);
  const [is4DPlayerCollapsed, setIs4DPlayerCollapsed] = useState<boolean>(false);

  // Modals
  const [isSankeyDrawerOpen, setIsSankeyDrawerOpen] = useState<boolean>(false);
  const [isNexusModalOpen, setIsNexusModalOpen] = useState<boolean>(false);
  const [isManifestRiskModalOpen, setIsManifestRiskModalOpen] = useState<boolean>(false);
  const [isJudicialModeOpen, setIsJudicialModeOpen] = useState<boolean>(false);

  // 4D Motion Playback State (Unified or fallback local)
  const [localActiveTrack, setLocalActiveTrack] = useState<TelemetryTrack>(REAL_4D_TRACKS[0]);
  const [localWaypointIndex, setLocalWaypointIndex] = useState<number>(0);
  const [isPlaying4D, setIsPlaying4D] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  const activeTrack = activeTelemetryTrack || localActiveTrack;
  const currentWaypointIndex = typeof currentTelemetryWaypointIndex === 'number' 
    ? currentTelemetryWaypointIndex 
    : localWaypointIndex;

  const setCurrentWaypointIndex = (idx: number | ((prev: number) => number)) => {
    if (typeof idx === 'function') {
      const next = idx(currentWaypointIndex);
      if (onTelemetryWaypointChange) {
        onTelemetryWaypointChange(next);
      } else {
        setLocalWaypointIndex(next);
      }
    } else {
      if (onTelemetryWaypointChange) {
        onTelemetryWaypointChange(idx);
      } else {
        setLocalWaypointIndex(idx);
      }
    }
  };

  const setActiveTrack = (track: TelemetryTrack) => {
    if (onSelectTelemetryTrack) {
      onSelectTelemetryTrack(track);
    } else {
      setLocalActiveTrack(track);
    }
  };

  // Filter State
  const [selectedActionFilter, setSelectedActionFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCaseFilter, setActiveCaseFilter] = useState<string>(propCaseId || 'ALL');

  // Sync prop case
  useEffect(() => {
    if (propCaseId) {
      setActiveCaseFilter(propCaseId);
    }
  }, [propCaseId]);

  // 4D Playback Animation Loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isPlaying4D && activeTrack) {
      const delay = Math.max(700, 2200 / playbackSpeed);
      interval = setInterval(() => {
        setCurrentWaypointIndex(prev => {
          if (prev >= activeTrack.waypoints.length - 1) {
            setIsPlaying4D(false);
            return prev;
          }
          const next = prev + 1;
          const targetWp = activeTrack.waypoints[next];
          if (targetWp && leafletMapRef.current) {
            leafletMapRef.current.panTo([targetWp.lat, targetWp.lng], { animate: true, duration: 0.6 });
          }
          return next;
        });
      }, delay);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying4D, activeTrack, playbackSpeed]);

  // Filtered Tactical Sites
  const visibleSites = useMemo(() => {
    let list = REAL_TACTICAL_SITES;

    if (activeCaseFilter !== 'ALL') {
      list = list.filter(s => s.caseId === activeCaseFilter);
    }

    if (selectedActionFilter !== 'ALL') {
      list = list.filter(s => s.actionType === selectedActionFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(s => 
        s.name.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.country.toLowerCase().includes(q) ||
        s.seizureMetric.toLowerCase().includes(q) ||
        s.operationalNotes.toLowerCase().includes(q) ||
        s.relatedEntities.some(e => e.toLowerCase().includes(q))
      );
    }

    return list;
  }, [activeCaseFilter, selectedActionFilter, searchQuery]);

  // Filtered Corridors
  const visibleCorridors = useMemo(() => {
    if (activeCaseFilter === 'CASE_MUNDRA_TALC') {
      return REAL_CORRIDORS.filter(c => c.id === 'corridor-heroin-talc');
    }
    if (activeCaseFilter === 'CASE_PNB_MODI') {
      return REAL_CORRIDORS.filter(c => c.id !== 'corridor-heroin-talc');
    }
    return REAL_CORRIDORS;
  }, [activeCaseFilter]);

  // Initialize Minimalist Leaflet Map (100% Free Open Tiles, No API Key)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!leafletMapRef.current) {
      const initialPreset = GEO_PRESETS[0];
      const map = L.map(mapContainerRef.current, {
        center: initialPreset.center,
        zoom: initialPreset.zoom,
        zoomControl: false,
        attributionControl: false,
        minZoom: 2,
        maxZoom: 19
      });

      // Default Open Tile Layer (Carto Positron Light - Zero API Key)
      const currentProvider = OPEN_TILE_PROVIDERS.find(p => p.id === activeTileId) || OPEN_TILE_PROVIDERS[0];
      const tileLayer = L.tileLayer(currentProvider.url, {
        subdomains: currentProvider.subdomains || 'abc',
        maxZoom: currentProvider.maxZoom
      }).addTo(map);

      activeTileLayerRef.current = tileLayer;

      // Add Layer Groups
      const heatmapGroup = L.layerGroup().addTo(map);
      const isochronesGroup = L.layerGroup().addTo(map);
      const geofencesGroup = L.layerGroup().addTo(map);
      const financialArcsGroup = L.layerGroup().addTo(map);
      const corridorsGroup = L.layerGroup().addTo(map);
      const fourDTrackGroup = L.layerGroup().addTo(map);
      const markersGroup = L.layerGroup().addTo(map);

      heatmapLayerGroupRef.current = heatmapGroup;
      isochronesLayerGroupRef.current = isochronesGroup;
      geofencesLayerGroupRef.current = geofencesGroup;
      financialArcsLayerGroupRef.current = financialArcsGroup;
      corridorsLayerGroupRef.current = corridorsGroup;
      fourDTrackLayerGroupRef.current = fourDTrackGroup;
      markersLayerGroupRef.current = markersGroup;

      leafletMapRef.current = map;

      // Close popup when map is clicked
      map.on('click', (e) => {
        // If clicking on empty map space, deselect site
        if ((e.originalEvent.target as HTMLElement).tagName !== 'path' && !(e.originalEvent.target as HTMLElement).closest('.bullseye-marker-container')) {
          setSelectedSite(null);
        }
      });
    }

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Change Map Tile Provider without reloading (Zero API Key)
  useEffect(() => {
    if (!leafletMapRef.current) return;
    const provider = OPEN_TILE_PROVIDERS.find(p => p.id === activeTileId) || OPEN_TILE_PROVIDERS[0];

    if (activeTileLayerRef.current) {
      leafletMapRef.current.removeLayer(activeTileLayerRef.current);
    }

    const newTileLayer = L.tileLayer(provider.url, {
      subdomains: provider.subdomains || 'abc',
      maxZoom: provider.maxZoom
    }).addTo(leafletMapRef.current);

    activeTileLayerRef.current = newTileLayer;

    // Update container styling class
    if (mapContainerRef.current) {
      OPEN_TILE_PROVIDERS.forEach(p => mapContainerRef.current?.classList.remove(p.className));
      mapContainerRef.current.classList.add(provider.className);
    }
  }, [activeTileId]);

  // Render Map Vectors, Corridors, Heatmap, and Markers
  useEffect(() => {
    if (!leafletMapRef.current || !markersLayerGroupRef.current) return;

    const markersGroup = markersLayerGroupRef.current;
    const heatmapGroup = heatmapLayerGroupRef.current;
    const corridorsGroup = corridorsLayerGroupRef.current;
    const fourDGroup = fourDTrackLayerGroupRef.current;
    const financialGroup = financialArcsLayerGroupRef.current;
    const geofencesGroup = geofencesLayerGroupRef.current;

    markersGroup.clearLayers();
    if (heatmapGroup) heatmapGroup.clearLayers();
    if (corridorsGroup) corridorsGroup.clearLayers();
    if (fourDGroup) fourDGroup.clearLayers();
    if (financialGroup) financialGroup.clearLayers();
    if (geofencesGroup) geofencesGroup.clearLayers();

    // 1. Geofences
    if (showGeofences && geofencesGroup) {
      REAL_GEOFENCES.forEach(geo => {
        const poly = L.polygon(geo.polygonCoords, {
          color: geo.dangerLevel === 'CRITICAL' ? '#DC2626' : '#EA580C',
          weight: 1.5,
          fillColor: geo.dangerLevel === 'CRITICAL' ? '#DC2626' : '#EA580C',
          fillOpacity: 0.12,
          dashArray: '5, 4'
        });

        poly.bindTooltip(`
          <div class="px-2 py-1 bg-[#1F2937] text-white rounded text-xs font-sans">
            <span class="font-bold text-amber-300">🛡️ ${geo.name}</span>
          </div>
        `, { className: 'custom-leaflet-popup' });

        geofencesGroup.addLayer(poly);
      });
    }

    // 2. Multi-Jurisdiction Financial Flow Arcs
    if (showFinancialArcs && financialGroup) {
      REAL_FINANCIAL_FLOW_ARCS.forEach(arc => {
        const midLat = (arc.sourceCoords[0] + arc.targetCoords[0]) / 2 + 3.0;
        const midLng = (arc.sourceCoords[1] + arc.targetCoords[1]) / 2;
        const curvePoints: [number, number][] = [
          arc.sourceCoords,
          [midLat, midLng],
          arc.targetCoords
        ];

        const flowLine = L.polyline(curvePoints, {
          color: arc.color,
          weight: 2.5,
          dashArray: '6, 5',
          opacity: 0.85,
          lineCap: 'round',
          lineJoin: 'round'
        });

        flowLine.on('click', () => {
          setIsSankeyDrawerOpen(true);
        });

        flowLine.bindTooltip(`
          <div class="px-2.5 py-1.5 bg-[#182018] text-white rounded-lg text-xs font-sans shadow-lg">
            <div class="font-bold text-amber-300">💳 ${arc.sourceCity} → ${arc.targetCity}</div>
            <div class="text-white font-mono font-bold mt-0.5">${arc.amountINR}</div>
            <div class="text-[10px] text-emerald-300">${arc.transferType}</div>
          </div>
        `, { className: 'custom-leaflet-popup' });

        financialGroup.addLayer(flowLine);
      });
    }

    // 3. Trade Corridors
    if (showCorridors && corridorsGroup) {
      visibleCorridors.forEach(corridor => {
        const polyline = L.polyline(corridor.points, {
          color: corridor.color,
          weight: 2.5,
          dashArray: corridor.dashArray,
          opacity: 0.75,
          lineCap: 'round',
          lineJoin: 'round'
        });

        polyline.bindTooltip(`
          <div class="px-2 py-1 bg-white text-[#182018] border border-gray-200 rounded text-xs font-semibold shadow-sm">
            ${corridor.name}
          </div>
        `, { sticky: true, className: 'custom-leaflet-popup' });

        corridorsGroup.addLayer(polyline);
      });
    }

    // 4. 4D Spatio-Temporal Motion Track
    if (show4DTrack && fourDGroup && activeTrack) {
      const allPoints: [number, number][] = activeTrack.waypoints.map(wp => [wp.lat, wp.lng]);
      
      const fullRoute = L.polyline(allPoints, {
        color: activeTrack.color,
        weight: 2.5,
        opacity: 0.4,
        dashArray: '4, 4'
      });
      fourDGroup.addLayer(fullRoute);

      const traversedPoints = allPoints.slice(0, currentWaypointIndex + 1);
      if (traversedPoints.length > 1) {
        const traversedLine = L.polyline(traversedPoints, {
          color: activeTrack.color,
          weight: 3.5,
          opacity: 0.9
        });
        fourDGroup.addLayer(traversedLine);
      }

      // Waypoint Dots
      activeTrack.waypoints.forEach((wp, idx) => {
        const isCurrent = idx === currentWaypointIndex;
        const isPassed = idx < currentWaypointIndex;

        const wpMarker = L.circleMarker([wp.lat, wp.lng], {
          radius: isCurrent ? 7 : 4,
          color: isCurrent ? '#FFFFFF' : activeTrack.color,
          weight: isCurrent ? 2 : 1,
          fillColor: isCurrent ? '#DC2626' : (isPassed ? activeTrack.color : '#FFFFFF'),
          fillOpacity: 1
        });

        wpMarker.on('click', () => setCurrentWaypointIndex(idx));
        fourDGroup.addLayer(wpMarker);
      });

      // Active Radar Cursor Icon
      const currentWp = activeTrack.waypoints[currentWaypointIndex];
      if (currentWp) {
        const iconHtml = `
          <div class="relative flex items-center justify-center" style="width: 32px; height: 32px;">
            <div class="absolute inset-0 rounded-full bg-red-500/25 animate-ping"></div>
            <div class="relative flex items-center justify-center rounded-full shadow-lg bg-[#182018] border-2 border-white text-white text-xs" style="width: 26px; height: 26px;">
              ${activeTrack.assetType === 'VESSEL' ? '🚢' : '🚛'}
            </div>
          </div>
        `;

        const liveIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-4d-live-icon',
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const liveMarker = L.marker([currentWp.lat, currentWp.lng], { icon: liveIcon });
        liveMarker.bindTooltip(`
          <div class="px-2.5 py-1.5 bg-[#182018] text-white rounded-lg text-xs font-sans shadow-lg">
            <div class="font-bold text-amber-300">${activeTrack.assetName}</div>
            <div class="text-[11px] text-gray-300">${currentWp.locationName} (${currentWp.speedKts} kts)</div>
          </div>
        `, { className: 'custom-leaflet-popup' });

        fourDGroup.addLayer(liveMarker);
      }
    }

    // 5. Heatmap (Optional)
    if (showHeatmap && heatmapGroup) {
      visibleSites.forEach(site => {
        const circle = L.circle([site.lat, site.lng], {
          radius: site.heatRadius * 0.9,
          color: 'transparent',
          fillColor: site.threatLevel === 'CRITICAL' ? '#DC2626' : '#EA580C',
          fillOpacity: 0.35 * site.heatIntensity,
          interactive: false
        });
        heatmapGroup.addLayer(circle);
      });
    }

    // 6. Minimalist Tactical Bullseye Target Markers (⊙)
    visibleSites.forEach(site => {
      const isSelected = selectedSite?.id === site.id;
      const actionMeta = ACTION_CATEGORIES[site.actionType] || ACTION_CATEGORIES.INTERCEPT_SEIZURE;
      const isCritical = site.threatLevel === 'CRITICAL';

      const customHtml = `
        <div class="bullseye-marker-container relative flex items-center justify-center cursor-pointer" style="width: 28px; height: 28px;">
          ${isCritical ? `
            <div class="absolute inset-0 rounded-full animate-radar opacity-60" style="background-color: ${actionMeta.haloColor};"></div>
          ` : ''}
          <div class="relative flex items-center justify-center rounded-full transition-all shadow-md" style="
            width: ${isSelected ? '24px' : '18px'}; 
            height: ${isSelected ? '24px' : '18px'}; 
            background: ${isSelected ? '#182018' : '#FFFFFF'}; 
            border: 2px solid ${isSelected ? '#FFFFFF' : actionMeta.color};
          ">
            <div class="rounded-full" style="
              width: ${isSelected ? '8px' : '6px'}; 
              height: ${isSelected ? '8px' : '6px'}; 
              background: ${isSelected ? '#FFFFFF' : actionMeta.color};
            "></div>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: customHtml,
        className: 'custom-bullseye-div-icon',
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([site.lat, site.lng], { icon: customIcon });

      marker.on('click', () => {
        setSelectedSite(site);
        if (leafletMapRef.current) {
          leafletMapRef.current.panTo([site.lat, site.lng], { animate: true });
        }
      });

      marker.bindTooltip(`
        <div class="px-2.5 py-1.5 bg-[#182018] text-white rounded-lg shadow-xl text-xs font-sans">
          <div class="font-bold flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full" style="background-color: ${actionMeta.color}"></span>
            <span>${site.name}</span>
          </div>
          <div class="text-[11px] text-gray-300 mt-0.5">${site.city} • ${site.seizureMetric}</div>
        </div>
      `, {
        direction: 'top',
        offset: [0, -12],
        className: 'custom-leaflet-popup'
      });

      markersGroup.addLayer(marker);
    });

  }, [
    visibleSites, 
    visibleCorridors, 
    showHeatmap, 
    showCorridors, 
    selectedSite,
    showFinancialArcs,
    showGeofences,
    show4DTrack,
    activeTrack,
    currentWaypointIndex
  ]);

  // Handle Preset Fly-To
  const handleSelectPreset = (preset: GeoPreset) => {
    setActivePresetId(preset.id);
    if (leafletMapRef.current) {
      leafletMapRef.current.flyTo(preset.center, preset.zoom, {
        duration: 1.0,
        easeLinearity: 0.25
      });
    }
  };

  // Zoom controls
  const handleZoomIn = () => leafletMapRef.current?.zoomIn();
  const handleZoomOut = () => leafletMapRef.current?.zoomOut();
  const handleReset = () => {
    const defaultPreset = GEO_PRESETS.find(p => p.id === activePresetId) || GEO_PRESETS[0];
    leafletMapRef.current?.flyTo(defaultPreset.center, defaultPreset.zoom);
  };

  const currentTileProvider = OPEN_TILE_PROVIDERS.find(p => p.id === activeTileId) || OPEN_TILE_PROVIDERS[0];

  return (
    <div 
      id="minimal-geomap-container"
      className="relative w-full h-full bg-[#F9FAFB] select-none flex flex-col overflow-hidden font-sans"
    >
      {/* ================================================================
          TOP MINIMALIST FLOATING BAR
      ================================================================ */}
      <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between gap-2 pointer-events-none">
        
        {/* Left: Quick Region Camera Presets & Search */}
        <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-2 py-1.5 rounded-xl shadow-md border border-gray-200/80 pointer-events-auto">
          <div className="flex items-center gap-1">
            {GEO_PRESETS.map(preset => {
              const isActive = preset.id === activePresetId;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                    isActive 
                      ? 'bg-[#182018] text-white shadow-xs' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  title={preset.description}
                >
                  <span className="text-xs">{preset.flag}</span>
                  <span className="hidden sm:inline">{preset.name}</span>
                </button>
              );
            })}
          </div>

          <div className="h-4 w-px bg-gray-200 mx-1 hidden md:block" />

          {/* Quick Search */}
          <div className="relative hidden md:flex items-center">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search site, port, entity..."
              className="pl-7 pr-6 py-1 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 w-44"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Map Style, Layers & Investigation Tools */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          
          {/* Map Layer Controls Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowLayerMenu(prev => !prev);
                setShowTileMenu(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-xl text-xs font-semibold text-gray-700 shadow-md border border-gray-200/80 hover:bg-gray-50 transition-all"
              title="Toggle Map Data Layers"
            >
              <Layers className="w-3.5 h-3.5 text-gray-600" />
              <span className="hidden sm:inline">Layers</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {showLayerMenu && (
              <div className="absolute right-0 mt-1.5 w-56 bg-white rounded-xl shadow-xl border border-gray-200 p-2 z-50 text-xs font-medium space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-2 py-1">
                  Tactical Overlays
                </div>

                <label className="flex items-center justify-between px-2 py-1.5 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <span className="flex items-center gap-1.5 text-gray-700">
                    <Radio className="w-3.5 h-3.5 text-emerald-600" />
                    4D Motion Tracks
                  </span>
                  <input
                    type="checkbox"
                    checked={show4DTrack}
                    onChange={(e) => setShow4DTrack(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-0"
                  />
                </label>

                <label className="flex items-center justify-between px-2 py-1.5 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <span className="flex items-center gap-1.5 text-gray-700">
                    <DollarSign className="w-3.5 h-3.5 text-amber-600" />
                    Financial Flow Arcs
                  </span>
                  <input
                    type="checkbox"
                    checked={showFinancialArcs}
                    onChange={(e) => setShowFinancialArcs(e.target.checked)}
                    className="rounded text-amber-600 focus:ring-0"
                  />
                </label>

                <label className="flex items-center justify-between px-2 py-1.5 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <span className="flex items-center gap-1.5 text-gray-700">
                    <Compass className="w-3.5 h-3.5 text-blue-600" />
                    Trade Corridors
                  </span>
                  <input
                    type="checkbox"
                    checked={showCorridors}
                    onChange={(e) => setShowCorridors(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-0"
                  />
                </label>

                <label className="flex items-center justify-between px-2 py-1.5 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <span className="flex items-center gap-1.5 text-gray-700">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                    Geofences (12NM)
                  </span>
                  <input
                    type="checkbox"
                    checked={showGeofences}
                    onChange={(e) => setShowGeofences(e.target.checked)}
                    className="rounded text-rose-600 focus:ring-0"
                  />
                </label>

                <label className="flex items-center justify-between px-2 py-1.5 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <span className="flex items-center gap-1.5 text-gray-700">
                    <Flame className="w-3.5 h-3.5 text-red-600" />
                    Crime Density Heatmap
                  </span>
                  <input
                    type="checkbox"
                    checked={showHeatmap}
                    onChange={(e) => setShowHeatmap(e.target.checked)}
                    className="rounded text-red-600 focus:ring-0"
                  />
                </label>
              </div>
            )}
          </div>

          {/* Map Tile Style Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowTileMenu(prev => !prev);
                setShowLayerMenu(false);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-xl text-xs font-semibold text-gray-700 shadow-md border border-gray-200/80 hover:bg-gray-50 transition-all"
              title="Cartographic Map Tile Providers (Stadia Maps HD / Open)"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="hidden sm:inline">{currentTileProvider.name}</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {showTileMenu && (
              <div className="absolute right-0 mt-1.5 w-64 bg-white rounded-xl shadow-xl border border-gray-200 p-2 z-50 text-xs space-y-1">
                <div className="px-2 py-1 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Map Styles & Cartography</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">HD Enabled</span>
                </div>

                {OPEN_TILE_PROVIDERS.map(p => {
                  const isSelected = p.id === activeTileId;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        setActiveTileId(p.id);
                        setShowTileMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-2 rounded-lg transition-all flex flex-col ${
                        isSelected 
                          ? 'bg-gray-100 font-bold text-gray-900' 
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{p.name}</span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      </div>
                      <span className="text-[10px] text-gray-400 font-normal">{p.tagline}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Investigation Modules */}
          <button
            onClick={() => setIsSankeyDrawerOpen(true)}
            className="px-2.5 py-1.5 bg-white/95 backdrop-blur-md rounded-xl text-xs font-semibold text-amber-800 shadow-md border border-gray-200/80 hover:bg-amber-50 flex items-center gap-1 transition-all"
            title="Financial Flows & Hawala Engine"
          >
            <DollarSign className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden md:inline">Financials</span>
          </button>

          <button
            onClick={() => setIsJudicialModeOpen(true)}
            className="px-3 py-1.5 bg-[#182018] text-white rounded-xl text-xs font-bold shadow-md hover:bg-black flex items-center gap-1.5 transition-all"
            title="Judicial Evidence Presentation Mode"
          >
            <FileCheck className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Judicial</span>
          </button>

        </div>
      </div>

      {/* ================================================================
          MAP CANVAS CONTAINER (Leaflet with 100% Free Open Tiles)
      ================================================================ */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        <div 
          ref={mapContainerRef} 
          className="w-full h-full z-0"
          style={{ width: '100%', height: '100%' }}
        />

        {/* Floating Minimalist Zoom & Recenter Controls (Bottom Right) */}
        <div className="absolute bottom-6 right-4 z-20 flex flex-col gap-1.5 bg-white/95 backdrop-blur-md p-1 rounded-xl shadow-lg border border-gray-200">
          <button
            onClick={handleZoomIn}
            className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <div className="h-px bg-gray-200 mx-1" />
          <button
            onClick={handleReset}
            className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Reset to Active Region"
          >
            <Crosshair className="w-4 h-4 text-emerald-700" />
          </button>
        </div>

        {/* Floating Minimalist 4D Motion Player (Bottom Left) */}
        {show4DTrack && show4DPlayer && (
          <div className="absolute bottom-6 left-4 z-20 max-w-sm w-full bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-xl border border-gray-200/90 text-xs font-sans">
            
            {/* Header / Collapse */}
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-gray-800">4D Telemetry Track</span>
                <span className="text-[10px] text-gray-400 font-mono">({activeTrack.assetType})</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIs4DPlayerCollapsed(prev => !prev)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  {is4DPlayerCollapsed ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
                </button>
                <button
                  onClick={() => setShow4DPlayer(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>

            {!is4DPlayerCollapsed && (
              <div className="mt-2 space-y-2.5">
                {/* Track Selector */}
                <div className="flex items-center gap-1">
                  {REAL_4D_TRACKS.map(t => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setActiveTrack(t);
                        setCurrentWaypointIndex(0);
                        setIsPlaying4D(false);
                      }}
                      className={`flex-1 py-1 px-1.5 rounded-lg text-[11px] font-semibold truncate transition-all ${
                        activeTrack.id === t.id 
                          ? 'bg-[#182018] text-white shadow-xs' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {t.assetName.split(' ')[0]} {t.assetType === 'VESSEL' ? '🚢' : '🚛'}
                    </button>
                  ))}
                </div>

                {/* Waypoint Info */}
                {activeTrack.waypoints[currentWaypointIndex] && (
                  <div className="bg-gray-50 p-2 rounded-xl border border-gray-100">
                    <div className="font-bold text-gray-900 truncate">
                      {activeTrack.waypoints[currentWaypointIndex].locationName}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-gray-500 mt-1">
                      <span>Speed: <strong>{activeTrack.waypoints[currentWaypointIndex].speedKts} kts</strong></span>
                      <span>Heading: <strong>{activeTrack.waypoints[currentWaypointIndex].headingDeg}°</strong></span>
                      <span>Step {currentWaypointIndex + 1}/{activeTrack.waypoints.length}</span>
                    </div>
                  </div>
                )}

                {/* Progress Scrubber Slider */}
                <input
                  type="range"
                  min={0}
                  max={activeTrack.waypoints.length - 1}
                  value={currentWaypointIndex}
                  onChange={(e) => {
                    const idx = Number(e.target.value);
                    setCurrentWaypointIndex(idx);
                    const targetWp = activeTrack.waypoints[idx];
                    if (targetWp && leafletMapRef.current) {
                      leafletMapRef.current.panTo([targetWp.lat, targetWp.lng], { animate: true });
                    }
                  }}
                  className="w-full accent-emerald-600 cursor-pointer h-1.5 bg-gray-200 rounded-lg"
                />

                {/* Controls: Play/Pause & Speed */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setIsPlaying4D(prev => !prev)}
                      className="px-3 py-1 rounded-lg bg-[#182018] text-white font-bold flex items-center gap-1 hover:bg-black transition-colors"
                    >
                      {isPlaying4D ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                      <span>{isPlaying4D ? 'Pause' : 'Play'}</span>
                    </button>

                    <button
                      onClick={() => {
                        setCurrentWaypointIndex(0);
                        setIsPlaying4D(false);
                      }}
                      className="px-2 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 font-medium"
                    >
                      Reset
                    </button>
                  </div>

                  <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg text-[10px] font-bold">
                    {[1, 2, 4].map(s => (
                      <button
                        key={s}
                        onClick={() => setPlaybackSpeed(s)}
                        className={`px-1.5 py-0.5 rounded ${playbackSpeed === s ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-500'}`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Floating Minimalist Tactical Inspector Card (Right Side) */}
        {selectedSite && (
          <div className="absolute top-16 right-4 z-20 w-80 max-w-[calc(100vw-2rem)] bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-gray-200/90 text-xs font-sans animate-in fade-in slide-in-from-right-4 duration-200">
            
            {/* Header */}
            <div className="flex items-start justify-between gap-2 pb-2 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-1.5">
                  <span 
                    className="w-2.5 h-2.5 rounded-full" 
                    style={{ backgroundColor: ACTION_CATEGORIES[selectedSite.actionType]?.color || '#DC2626' }}
                  />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    {ACTION_CATEGORIES[selectedSite.actionType]?.shortLabel || 'Tactical Site'}
                  </span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                    selectedSite.threatLevel === 'CRITICAL' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {selectedSite.threatLevel}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-gray-900 mt-1 leading-snug">
                  {selectedSite.name}
                </h3>
              </div>

              <button
                onClick={() => setSelectedSite(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Details */}
            <div className="mt-3 space-y-2.5">
              <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                <div className="text-[10px] text-gray-400 font-semibold uppercase">Primary Metric / Seizure</div>
                <div className="text-xs font-bold text-gray-900 mt-0.5">{selectedSite.seizureMetric}</div>
                <div className="text-[10px] text-gray-500 mt-1">
                  📍 {selectedSite.city}, {selectedSite.country} ({selectedSite.lat.toFixed(4)}, {selectedSite.lng.toFixed(4)})
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold text-gray-500 uppercase">Operational Status</div>
                <p className="text-xs text-gray-700 mt-0.5 leading-relaxed font-medium">
                  {selectedSite.status}
                </p>
              </div>

              <div>
                <div className="text-[10px] font-bold text-gray-500 uppercase">Intelligence Summary</div>
                <p className="text-[11px] text-gray-600 mt-0.5 leading-relaxed">
                  {selectedSite.operationalNotes}
                </p>
              </div>

              {selectedSite.relatedEntities.length > 0 && (
                <div>
                  <div className="text-[10px] font-bold text-gray-500 uppercase mb-1">Related POLE Entities</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedSite.relatedEntities.map((ent, i) => (
                      <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md text-[10px] font-medium">
                        {ent}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-1.5 border-t border-gray-100">
                <button
                  onClick={() => {
                    const matchNode = nodes.find(n => n.name.toLowerCase().includes(selectedSite.name.toLowerCase()) || selectedSite.name.toLowerCase().includes(n.name.toLowerCase()));
                    if (matchNode) {
                      onSelectNode(matchNode);
                    }
                  }}
                  className="flex-1 py-1.5 px-2 bg-[#182018] text-white rounded-lg text-xs font-semibold hover:bg-black text-center transition-colors"
                >
                  Inspect POLE Node
                </button>
                <button
                  onClick={() => setIsJudicialModeOpen(true)}
                  className="py-1.5 px-2.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-200 transition-colors"
                  title="Evidence Dossier"
                >
                  Evidence
                </button>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ================================================================
          MODALS & DRAWERS (INTEGRATED & CLEAN)
      ================================================================ */}
      <FinancialFlowSankeyDrawer
        isOpen={isSankeyDrawerOpen}
        onClose={() => setIsSankeyDrawerOpen(false)}
        selectedCaseId={activeCaseFilter}
        onSelectArcOnMap={(arc) => {
          setIsSankeyDrawerOpen(false);
          if (leafletMapRef.current) {
            leafletMapRef.current.flyTo(arc.sourceCoords, 8);
          }
        }}
      />

      <CrossCaseNexusModal
        isOpen={isNexusModalOpen}
        onClose={() => setIsNexusModalOpen(false)}
      />

      <ManifestRiskScorerModal
        isOpen={isManifestRiskModalOpen}
        onClose={() => setIsManifestRiskModalOpen(false)}
      />

      <JudicialCourtroomMode
        isOpen={isJudicialModeOpen}
        onClose={() => setIsJudicialModeOpen(false)}
        selectedCaseId={activeCaseFilter}
      />

    </div>
  );
};
