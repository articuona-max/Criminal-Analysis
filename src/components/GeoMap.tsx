import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import { 
  Flame, 
  Layers, 
  Sliders, 
  Activity, 
  Search, 
  X, 
  Compass, 
  Maximize2, 
  Crosshair, 
  MapPin, 
  ShieldAlert, 
  Anchor, 
  Ship, 
  Building2, 
  Globe2, 
  Eye, 
  ExternalLink, 
  ChevronRight, 
  RotateCcw,
  Sparkles,
  Info,
  DollarSign,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  Radio,
  Clock,
  Truck,
  Combine,
  Scale,
  FileCheck,
  Navigation
} from 'lucide-react';
import { POLENode, POLEEdge, CaseId } from '../types';
import { REAL_CASE_PROFILES } from '../data/realCasesData';
import { 
  REAL_4D_TRACKS, 
  REAL_FINANCIAL_FLOW_ARCS, 
  REAL_GEOFENCES, 
  REAL_ISOCHRONES, 
  TelemetryTrack, 
  FinancialFlowArc 
} from '../data/intelligence4DEngine';
import { SpatioTemporalPlayer } from './SpatioTemporalPlayer';
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
    shortLabel: 'Seizure & Intercept',
    color: '#DC2626',
    haloColor: 'rgba(220, 38, 38, 0.4)',
    badgeBg: 'bg-red-50',
    badgeText: 'text-red-700',
    description: 'Direct customs container interception, contraband raid, dockside bust'
  },
  SOURCE_PRODUCTION: {
    key: 'SOURCE_PRODUCTION',
    label: 'Source & Illicit Production',
    shortLabel: 'Source / Production',
    color: '#059669',
    haloColor: 'rgba(5, 150, 105, 0.4)',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    description: 'Opium cultivation, diacetylmorphine chemical synthesis, raw diamond origin'
  },
  COMMAND_TELEMETRY: {
    key: 'COMMAND_TELEMETRY',
    label: 'Command Hub & FBI Telemetry',
    shortLabel: 'Command & Telemetry',
    color: '#2563EB',
    haloColor: 'rgba(37, 99, 235, 0.4)',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
    description: 'Syndicate command center, encrypted Trojan handset relay, SWIFT auth terminal'
  },
  OFFSHORE_HAWALA: {
    key: 'OFFSHORE_HAWALA',
    label: 'Offshore Sink & Hawala Laundering',
    shortLabel: 'Offshore & Hawala',
    color: '#D97706',
    haloColor: 'rgba(217, 119, 6, 0.4)',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-700',
    description: 'Nostro clearing accounts, dummy shell companies, crypto mixing freezones'
  },
  TRANSIT_PORT: {
    key: 'TRANSIT_PORT',
    label: 'Maritime & Overland Transshipment',
    shortLabel: 'Transit & Transshipment',
    color: '#7C3AED',
    haloColor: 'rgba(124, 58, 237, 0.4)',
    badgeBg: 'bg-purple-50',
    badgeText: 'text-purple-700',
    description: 'Strait of Hormuz feeder port, cross-border overland truck route, transshipment dock'
  },
  EXTRADITION_TARGET: {
    key: 'EXTRADITION_TARGET',
    label: 'Extradition & Fugitive Warrant',
    shortLabel: 'Extradition Target',
    color: '#E11D48',
    haloColor: 'rgba(225, 29, 72, 0.4)',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-700',
    description: 'Interpol Red Notice subject, High Court appeal, CIP passport sanctuary'
  }
};

// Real World Tactical Target Sites with GPS Coordinates
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
  heatIntensity: number; // 0.1 - 1.0
  heatRadius: number; // in meters for circle
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
    name: 'Westminster Magistrates Court & High Court of Justice',
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
    name: 'Mayfair Old Bond Street Boutique & Centre Point Penthouse',
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
    name: 'SDNY Federal District Court & Manhattan Boutiques',
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
    name: 'Hong Kong Central & Tsim Sha Tsui Trading Hub',
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
    name: 'Basseterre CIP Sanctuary (St. Kitts & Nevis)',
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
    name: 'Opium / Talc Transit Route (Helmand → Bandar Abbas → Mundra → Delhi)',
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
    name: 'Circular Diamond Invoicing (Surat → Dubai → Hong Kong → New York)',
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
    name: 'Mundra & Gujarat',
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
    name: 'Global POLE Corridor',
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
  selectedCaseId: propCaseId
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const heatmapLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const corridorsLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const fourDTrackLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const financialArcsLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const geofencesLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const isochronesLayerGroupRef = useRef<L.LayerGroup | null>(null);

  // View & Layer Toggles
  const [activePresetId, setActivePresetId] = useState<string>('IND');
  const [tileStyle, setTileStyle] = useState<'parchment' | 'dark-slate' | 'voyager' | 'minimal'>('parchment');
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const [heatmapOpacity, setHeatmapOpacity] = useState<number>(0.75);
  const [heatmapRadiusMultiplier, setHeatmapRadiusMultiplier] = useState<number>(1.0);
  const [showCorridors, setShowCorridors] = useState<boolean>(true);
  const [showFinancialArcs, setShowFinancialArcs] = useState<boolean>(true);
  const [showGeofences, setShowGeofences] = useState<boolean>(true);
  const [showIsochrones, setShowIsochrones] = useState<boolean>(true);
  const [show4DTrack, setShow4DTrack] = useState<boolean>(true);

  // Floating Panels & Drawers
  const [showSettingsPanel, setShowSettingsPanel] = useState<boolean>(false);
  const [showHotspotDrawer, setShowHotspotDrawer] = useState<boolean>(false);
  const [show4DPlayer, setShow4DPlayer] = useState<boolean>(true);

  // 6 Major Enhancement Modals
  const [isSankeyDrawerOpen, setIsSankeyDrawerOpen] = useState<boolean>(false);
  const [isNexusModalOpen, setIsNexusModalOpen] = useState<boolean>(false);
  const [isManifestRiskModalOpen, setIsManifestRiskModalOpen] = useState<boolean>(false);
  const [isJudicialModeOpen, setIsJudicialModeOpen] = useState<boolean>(false);

  // 4D Motion State
  const [activeTrack, setActiveTrack] = useState<TelemetryTrack>(REAL_4D_TRACKS[0]);
  const [currentWaypointIndex, setCurrentWaypointIndex] = useState<number>(0);
  const [isPlaying4D, setIsPlaying4D] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  // Filters & Selected State
  const [selectedSite, setSelectedSite] = useState<RealTacticalPoint | null>(REAL_TACTICAL_SITES[0]);
  const [selectedActionFilter, setSelectedActionFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCaseFilter, setActiveCaseFilter] = useState<string>(propCaseId || 'ALL');

  // Sync prop case
  useEffect(() => {
    if (propCaseId) {
      setActiveCaseFilter(propCaseId);
    }
  }, [propCaseId]);

  // 4D Playback Animation Timer Loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isPlaying4D && activeTrack) {
      const delay = Math.max(800, 2500 / playbackSpeed);
      interval = setInterval(() => {
        setCurrentWaypointIndex(prev => {
          if (prev >= activeTrack.waypoints.length - 1) {
            setIsPlaying4D(false);
            return prev;
          }
          const next = prev + 1;
          const targetWp = activeTrack.waypoints[next];
          if (targetWp && leafletMapRef.current) {
            leafletMapRef.current.panTo([targetWp.lat, targetWp.lng], { animate: true, duration: 0.8 });
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

  // Initialize Real Leaflet Map
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
        maxZoom: 18
      });

      // CartoDB Positron / Voyager real world tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      // Layer groups for all tactical dimensions
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
      corridorsGroup.addTo(map);
      corridorsLayerGroupRef.current = corridorsGroup;
      fourDTrackLayerGroupRef.current = fourDTrackGroup;
      markersLayerGroupRef.current = markersGroup;
      leafletMapRef.current = map;
    }

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, []);

  // Update Tile Class when style changes
  useEffect(() => {
    if (!mapContainerRef.current) return;
    const container = mapContainerRef.current;
    container.classList.remove('tiles-parchment', 'tiles-dark-slate', 'tiles-voyager', 'tiles-minimal');
    container.classList.add(`tiles-${tileStyle}`);
  }, [tileStyle]);

  // Render Map Layers: Heatmap, Geofences, Isochrones, Financial Arcs, 4D Tracks, Markers
  useEffect(() => {
    if (!leafletMapRef.current || !markersLayerGroupRef.current || !heatmapLayerGroupRef.current) return;

    const markersGroup = markersLayerGroupRef.current;
    const heatmapGroup = heatmapLayerGroupRef.current;
    const corridorsGroup = corridorsLayerGroupRef.current;
    const fourDGroup = fourDTrackLayerGroupRef.current;
    const financialGroup = financialArcsLayerGroupRef.current;
    const geofencesGroup = geofencesLayerGroupRef.current;
    const isochronesGroup = isochronesLayerGroupRef.current;

    markersGroup.clearLayers();
    heatmapGroup.clearLayers();
    if (corridorsGroup) corridorsGroup.clearLayers();
    if (fourDGroup) fourDGroup.clearLayers();
    if (financialGroup) financialGroup.clearLayers();
    if (geofencesGroup) geofencesGroup.clearLayers();
    if (isochronesGroup) isochronesGroup.clearLayers();

    // 1. Draw Isochrone Reachability Contours
    if (showIsochrones && isochronesGroup) {
      REAL_ISOCHRONES.forEach(iso => {
        iso.contours.forEach(contour => {
          const circle = L.circle(iso.originCoords, {
            radius: contour.radiusKm * 1000,
            color: contour.color,
            weight: 1.5,
            dashArray: '4, 4',
            fillColor: contour.color,
            fillOpacity: contour.fillOpacity,
            interactive: true
          });

          circle.bindTooltip(`
            <div class="px-2 py-1 bg-[#243324] text-white rounded text-xs font-sans">
              <strong>${iso.originName}</strong>: ${contour.description}
            </div>
          `, { className: 'custom-leaflet-popup' });

          isochronesGroup.addLayer(circle);
        });
      });
    }

    // 2. Draw Geofence Polygons & Active Tripwires
    if (showGeofences && geofencesGroup) {
      REAL_GEOFENCES.forEach(geo => {
        const poly = L.polygon(geo.polygonCoords, {
          color: geo.dangerLevel === 'CRITICAL' ? '#DC2626' : '#EA580C',
          weight: 2,
          fillColor: geo.dangerLevel === 'CRITICAL' ? '#DC2626' : '#EA580C',
          fillOpacity: 0.15,
          dashArray: '6, 3'
        });

        poly.bindTooltip(`
          <div class="px-2 py-1.5 bg-[#243324] text-white rounded-lg text-xs font-sans shadow-lg">
            <div class="font-bold text-amber-300">🛡️ ${geo.name}</div>
            <div class="text-[11px] text-[#C5D6C5] mt-0.5">${geo.tripwireRules}</div>
            ${geo.activeBreaches.length > 0 ? `
              <div class="mt-1 text-[10px] text-red-300 font-mono font-bold">
                ⚠️ ACTIVE BREACH: ${geo.activeBreaches[0].targetName}
              </div>
            ` : ''}
          </div>
        `, { className: 'custom-leaflet-popup' });

        geofencesGroup.addLayer(poly);
      });
    }

    // 3. Draw Multi-Jurisdiction Financial Flow Arcs
    if (showFinancialArcs && financialGroup) {
      REAL_FINANCIAL_FLOW_ARCS.forEach(arc => {
        // Calculate curved path midpoint
        const midLat = (arc.sourceCoords[0] + arc.targetCoords[0]) / 2 + 3.5;
        const midLng = (arc.sourceCoords[1] + arc.targetCoords[1]) / 2;
        const curvePoints: [number, number][] = [
          arc.sourceCoords,
          [midLat, midLng],
          arc.targetCoords
        ];

        const flowLine = L.polyline(curvePoints, {
          color: arc.color,
          weight: 3,
          dashArray: '8, 6',
          opacity: 0.9,
          lineCap: 'round',
          lineJoin: 'round'
        });

        flowLine.on('click', () => {
          setIsSankeyDrawerOpen(true);
        });

        flowLine.bindTooltip(`
          <div class="px-3 py-2 bg-[#243324] text-white rounded-xl shadow-xl text-xs font-sans">
            <div class="font-bold text-amber-300 flex items-center gap-1">
              <span>💳 ${arc.sourceCity} → ${arc.targetCity}</span>
            </div>
            <div class="font-mono text-sm font-bold text-white mt-1">${arc.amountINR} (${arc.amountUSD})</div>
            <div class="text-[11px] text-[#C5D6C5] mt-0.5">${arc.sourceEntity} → ${arc.targetEntity}</div>
            <div class="text-[10px] text-amber-200 mt-1 font-mono">${arc.transferType}</div>
          </div>
        `, { className: 'custom-leaflet-popup' });

        financialGroup.addLayer(flowLine);
      });
    }

    // 4. Draw Corridors
    if (showCorridors && corridorsGroup) {
      visibleCorridors.forEach(corridor => {
        const polyline = L.polyline(corridor.points, {
          color: corridor.color,
          weight: 3,
          dashArray: corridor.dashArray,
          opacity: 0.85,
          lineCap: 'round',
          lineJoin: 'round'
        });

        polyline.bindTooltip(`
          <div class="px-2 py-1 bg-[#FAF7F2] text-[#243324] border border-[#DDD4C0] rounded-md text-xs font-semibold">
            ${corridor.name}
          </div>
        `, { sticky: true, className: 'custom-leaflet-popup' });

        corridorsGroup.addLayer(polyline);
      });
    }

    // 5. Draw 4D Spatio-Temporal Motion Track & Live Animated Cursor
    if (show4DTrack && fourDGroup && activeTrack) {
      const allPoints: [number, number][] = activeTrack.waypoints.map(wp => [wp.lat, wp.lng]);
      
      // Background full route line
      const fullRoute = L.polyline(allPoints, {
        color: activeTrack.color,
        weight: 3.5,
        opacity: 0.5,
        dashArray: '4, 4'
      });
      fourDGroup.addLayer(fullRoute);

      // Traversed path so far (solid color)
      const traversedPoints = allPoints.slice(0, currentWaypointIndex + 1);
      if (traversedPoints.length > 1) {
        const traversedLine = L.polyline(traversedPoints, {
          color: activeTrack.color,
          weight: 4.5,
          opacity: 0.95
        });
        fourDGroup.addLayer(traversedLine);
      }

      // Waypoint dots
      activeTrack.waypoints.forEach((wp, idx) => {
        const isCurrent = idx === currentWaypointIndex;
        const isPassed = idx < currentWaypointIndex;

        const wpMarker = L.circleMarker([wp.lat, wp.lng], {
          radius: isCurrent ? 8 : 4.5,
          color: isCurrent ? '#FFFFFF' : activeTrack.color,
          weight: isCurrent ? 2.5 : 1.5,
          fillColor: isCurrent ? '#DC2626' : (isPassed ? activeTrack.color : '#FFFFFF'),
          fillOpacity: 1
        });

        wpMarker.on('click', () => {
          setCurrentWaypointIndex(idx);
        });

        wpMarker.bindTooltip(`
          <div class="px-2 py-1 bg-[#243324] text-white rounded text-xs font-sans">
            <strong>Step ${idx + 1}:</strong> ${wp.locationName} (${wp.speedKts} kts)
          </div>
        `, { className: 'custom-leaflet-popup' });

        fourDGroup.addLayer(wpMarker);
      });

      // Active Vessel/Truck Radar Icon Marker
      const currentWp = activeTrack.waypoints[currentWaypointIndex];
      if (currentWp) {
        const iconHtml = `
          <div class="relative flex items-center justify-center cursor-pointer" style="width: 42px; height: 42px;">
            <div class="absolute inset-0 rounded-full bg-red-500/30 animate-ping"></div>
            <div class="relative flex items-center justify-center rounded-full shadow-2xl bg-[#243324] border-2 border-white text-white p-1.5" style="width: 32px; height: 32px;">
              ${activeTrack.assetType === 'VESSEL' ? '🚢' : '🚛'}
            </div>
            <!-- Heading Indicator Pointer -->
            <div class="absolute -top-1 w-1.5 h-1.5 bg-amber-400 rounded-full" style="transform: rotate(${currentWp.headingDeg}deg)"></div>
          </div>
        `;

        const liveIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-4d-live-icon',
          iconSize: [42, 42],
          iconAnchor: [21, 21]
        });

        const liveMarker = L.marker([currentWp.lat, currentWp.lng], { icon: liveIcon });
        liveMarker.bindTooltip(`
          <div class="px-3 py-2 bg-[#243324] text-white rounded-xl shadow-xl text-xs font-sans">
            <div class="font-bold text-amber-300">${activeTrack.assetName}</div>
            <div class="text-[11px] text-[#C5D6C5] mt-0.5">${currentWp.locationName}</div>
            <div class="font-mono text-[10px] mt-1 text-emerald-400">
              Speed: ${currentWp.speedKts} kts • Heading: ${currentWp.headingDeg}°
            </div>
          </div>
        `, { className: 'custom-leaflet-popup' });

        fourDGroup.addLayer(liveMarker);
      }
    }

    // 6. Draw Crime Density Heatmap Circles
    if (showHeatmap) {
      visibleSites.forEach(site => {
        const baseRadius = site.heatRadius * heatmapRadiusMultiplier;

        const outerCircle = L.circle([site.lat, site.lng], {
          radius: baseRadius * 1.5,
          color: 'transparent',
          fillColor: site.threatLevel === 'CRITICAL' ? '#DC2626' : '#EA580C',
          fillOpacity: heatmapOpacity * 0.18 * site.heatIntensity,
          interactive: false
        });

        const midCircle = L.circle([site.lat, site.lng], {
          radius: baseRadius * 0.85,
          color: 'transparent',
          fillColor: site.threatLevel === 'CRITICAL' ? '#DC2626' : '#F59E0B',
          fillOpacity: heatmapOpacity * 0.40 * site.heatIntensity,
          interactive: false
        });

        const coreCircle = L.circle([site.lat, site.lng], {
          radius: baseRadius * 0.4,
          color: 'transparent',
          fillColor: '#991B1B',
          fillOpacity: heatmapOpacity * 0.75 * site.heatIntensity,
          interactive: false
        });

        heatmapGroup.addLayer(outerCircle);
        heatmapGroup.addLayer(midCircle);
        heatmapGroup.addLayer(coreCircle);
      });
    }

    // 7. Draw Real Concentric Bullseye Markers (⊙)
    visibleSites.forEach(site => {
      const isSelected = selectedSite?.id === site.id;
      const actionMeta = ACTION_CATEGORIES[site.actionType] || ACTION_CATEGORIES.INTERCEPT_SEIZURE;
      const isCritical = site.threatLevel === 'CRITICAL';

      const customHtml = `
        <div class="bullseye-marker-container relative flex items-center justify-center cursor-pointer" style="width: 32px; height: 32px;">
          ${isCritical ? `
            <div class="absolute inset-0 rounded-full animate-radar" style="background-color: ${actionMeta.haloColor};"></div>
          ` : ''}
          <div class="relative flex items-center justify-center rounded-full transition-all shadow-md" style="
            width: ${isSelected ? '26px' : '20px'}; 
            height: ${isSelected ? '26px' : '20px'}; 
            background: ${isSelected ? '#243324' : '#FAF7F2'}; 
            border: 2px solid ${isSelected ? '#FBF9F5' : '#243324'};
          ">
            <div class="rounded-full" style="
              width: ${isSelected ? '8px' : '6px'}; 
              height: ${isSelected ? '8px' : '6px'}; 
              background: ${isSelected ? '#FBF9F5' : actionMeta.color};
            "></div>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: customHtml,
        className: 'custom-bullseye-div-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([site.lat, site.lng], { icon: customIcon });

      marker.on('click', () => {
        setSelectedSite(site);
      });

      marker.bindTooltip(`
        <div class="px-2.5 py-1.5 bg-[#243324] text-[#FBF9F5] rounded-lg shadow-xl text-xs font-sans">
          <div class="font-bold flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full" style="background-color: ${actionMeta.color}"></span>
            <span>${site.name}</span>
          </div>
          <div class="text-[11px] text-[#C8D6C9] mt-0.5">${site.city} • ${site.seizureMetric}</div>
        </div>
      `, {
        direction: 'top',
        offset: [0, -14],
        className: 'custom-leaflet-popup'
      });

      markersGroup.addLayer(marker);
    });
  }, [
    visibleSites, 
    visibleCorridors, 
    showHeatmap, 
    heatmapOpacity, 
    heatmapRadiusMultiplier, 
    showCorridors, 
    selectedSite,
    showFinancialArcs,
    showGeofences,
    showIsochrones,
    show4DTrack,
    activeTrack,
    currentWaypointIndex
  ]);

  // Handle Preset Fly-To
  const handleSelectPreset = (preset: GeoPreset) => {
    setActivePresetId(preset.id);
    if (leafletMapRef.current) {
      leafletMapRef.current.flyTo(preset.center, preset.zoom, {
        duration: 1.2,
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

  return (
    <div 
      id="real-geo-gis-container"
      className="relative w-full h-full bg-[#FAF7F2] select-none flex flex-col overflow-hidden font-sans border-t border-[#E8DFC9]"
    >
      {/* ================================================================
          TOP PRECISION CONTROLS HEADER BAR
      ================================================================ */}
      <div 
        id="gis-map-top-bar" 
        className="shrink-0 z-20 bg-[#FAF7F2]/95 backdrop-blur-md px-4 py-2.5 border-b border-[#E8DFC9] flex flex-wrap items-center justify-between gap-3 shadow-xs"
      >
        {/* Left: Quick Real-World Camera Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center gap-1 bg-[#EFE8DC] p-1 rounded-lg border border-[#DDD4C0]">
            {GEO_PRESETS.map(preset => {
              const isActive = preset.id === activePresetId;
              return (
                <button
                  key={preset.id}
                  id={`btn-preset-${preset.id}`}
                  onClick={() => handleSelectPreset(preset)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isActive 
                      ? 'bg-[#243324] text-[#FBF9F5] shadow-xs' 
                      : 'text-[#4A5B4C] hover:text-[#243324] hover:bg-[#E4DAC6]'
                  }`}
                  title={preset.description}
                >
                  <span className="text-sm">{preset.flag}</span>
                  <span className="hidden sm:inline">{preset.name}</span>
                </button>
              );
            })}
          </div>

          <div className="h-4 w-px bg-[#DDD4C0] mx-1 hidden sm:block" />

          {/* 4D MOTION PLAYBACK TOGGLE */}
          <button
            id="btn-toggle-4d-playback"
            onClick={() => setShow4DPlayer(prev => !prev)}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-all ${
              show4DPlayer
                ? 'bg-[#243324] text-[#FBF9F5] border-[#243324] shadow-xs'
                : 'bg-[#FFFFFF] text-[#4A5B4C] border-[#DDD4C0] hover:bg-[#EFE8DC]'
            }`}
            title="Toggle 4D Vessel & Overland Telemetry Playback"
          >
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>4D Motion {show4DPlayer ? 'ON' : 'OFF'}</span>
          </button>

          {/* FINANCIAL ARCS & SANKEY DRAWER TRIGGER */}
          <button
            id="btn-toggle-financial-arcs"
            onClick={() => setIsSankeyDrawerOpen(true)}
            className="px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 border bg-[#FFFFFF] text-[#243324] border-[#DDD4C0] hover:bg-[#EFE8DC] transition-all"
            title="Open Multi-Jurisdiction Financial Flow & Hawala Engine"
          >
            <DollarSign className="w-3.5 h-3.5 text-amber-600" />
            <span>Financial Arcs / Sankey</span>
          </button>

          {/* GEOFENCES & ISOCHRONES TOGGLE */}
          <button
            id="btn-toggle-geofences"
            onClick={() => {
              setShowGeofences(p => !p);
              setShowIsochrones(p => !p);
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 border transition-all ${
              showGeofences
                ? 'bg-[#EFE8DC] text-[#243324] border-[#C5BDAA]'
                : 'bg-[#FFFFFF] text-[#7A8C7A] border-[#DDD4C0]'
            }`}
            title="Toggle 12NM Maritime Geofencing & Isochrone Reachability"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-700" />
            <span>Geofence & Reachability</span>
          </button>

          {/* CRIME DENSITY HEAT MAP LAYER TOGGLE */}
          <button
            id="btn-toggle-real-heatmap"
            onClick={() => setShowHeatmap(prev => !prev)}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-all ${
              showHeatmap
                ? 'bg-gradient-to-r from-[#DC2626] to-[#EA580C] text-white border-transparent shadow-xs'
                : 'bg-[#FFFFFF] text-[#6B7D6C] border-[#DDD4C0] hover:bg-[#EFE8DC]'
            }`}
            title="Toggle Crime Density Heat Map Layer on Real Map"
          >
            <Flame className={`w-3.5 h-3.5 ${showHeatmap ? 'text-amber-200 fill-amber-200' : 'text-[#6B7D6C]'}`} />
            <span>Heatmap {showHeatmap ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        {/* Right: 6 Major Enhancement Quick Actions */}
        <div className="flex items-center gap-2">
          
          {/* Syndicate Nexus Studio */}
          <button
            onClick={() => setIsNexusModalOpen(true)}
            className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#DDD4C0] text-xs font-semibold text-[#243324] hover:bg-[#EFE8DC] flex items-center gap-1"
            title="Cross-Case Entity Resolution & Overlap Matrix"
          >
            <Combine className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden md:inline">Syndicate Nexus</span>
          </button>

          {/* Manifest Risk Scorer */}
          <button
            onClick={() => setIsManifestRiskModalOpen(true)}
            className="px-2.5 py-1 rounded-lg bg-[#FAF7F2] border border-[#DDD4C0] text-xs font-semibold text-[#243324] hover:bg-[#EFE8DC] flex items-center gap-1"
            title="Algorithmic Manifest Anomaly & Port Vulnerability Index"
          >
            <Scale className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden md:inline">Manifest Scorer</span>
          </button>

          {/* Judicial Courtroom Mode */}
          <button
            onClick={() => setIsJudicialModeOpen(true)}
            className="px-3 py-1 rounded-lg bg-[#243324] text-[#FBF9F5] text-xs font-bold hover:bg-[#182418] flex items-center gap-1.5 shadow-xs"
            title="Enter Courtroom-Ready Evidence Presentation & SHA-256 Verification"
          >
            <FileCheck className="w-3.5 h-3.5 text-amber-300" />
            <span>Judicial Mode</span>
          </button>

          {/* Map Style Selector */}
          <select
            value={tileStyle}
            onChange={(e) => setTileStyle(e.target.value as any)}
            className="bg-[#FFFFFF] border border-[#DDD4C0] rounded-lg px-2 py-1 text-xs text-[#243324] font-medium"
          >
            <option value="parchment">Parchment Style</option>
            <option value="dark-slate">Dark Slate Radar</option>
            <option value="voyager">Standard Voyager</option>
            <option value="minimal">Minimalist Gray</option>
          </select>
        </div>
      </div>

      {/* ================================================================
          REAL LEAFLET MAP CANVAS CONTAINER
      ================================================================ */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        <div 
          ref={mapContainerRef} 
          className={`w-full h-full z-0 tiles-${tileStyle}`}
          style={{ width: '100%', height: '100%' }}
        />

        {/* Floating 4D Spatio-Temporal Motion Player (Bottom Left) */}
        {show4DPlayer && (
          <div className="absolute bottom-4 left-4 z-20 max-w-md w-full">
            <SpatioTemporalPlayer
              selectedCaseId={activeCaseFilter as any}
              activeTrack={activeTrack}
              onSelectTrack={(t) => {
                setActiveTrack(t);
                setCurrentWaypointIndex(0);
                if (leafletMapRef.current && t.waypoints[0]) {
                  leafletMapRef.current.flyTo([t.waypoints[0].lat, t.waypoints[0].lng], 8);
                }
              }}
              currentWaypointIndex={currentWaypointIndex}
              onWaypointChange={(idx) => {
                setCurrentWaypointIndex(idx);
                const targetWp = activeTrack?.waypoints[idx];
                if (targetWp && leafletMapRef.current) {
                  leafletMapRef.current.panTo([targetWp.lat, targetWp.lng], { animate: true });
                }
              }}
              isPlaying={isPlaying4D}
              onTogglePlay={() => setIsPlaying4D(p => !p)}
              playbackSpeed={playbackSpeed}
              onChangeSpeed={setPlaybackSpeed}
              onClose={() => setShow4DPlayer(false)}
            />
          </div>
        )}

        {/* Floating Zoom & Reset Navigation Controls (Top Right) */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5 bg-[#FAF7F2]/95 backdrop-blur-md p-1.5 rounded-lg border border-[#DDD4C0] shadow-xs">
          <button
            id="btn-real-zoom-in"
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-1.5 rounded-md hover:bg-[#EFE8DC] text-[#243324] transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            id="btn-real-zoom-out"
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-1.5 rounded-md hover:bg-[#EFE8DC] text-[#243324] transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <div className="h-px w-full bg-[#DDD4C0]" />
          <button
            id="btn-real-reset-view"
            onClick={handleReset}
            title="Reset to Active Preset View"
            className="p-1.5 rounded-md hover:bg-[#EFE8DC] text-[#243324] transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ================================================================
          BOTTOM DETAIL DRAWER: TACTICAL TARGET DOSSIER
      ================================================================ */}
      {selectedSite && (
        <div 
          id="real-gis-dossier-panel"
          className="shrink-0 z-20 bg-[#FBF9F5] border-t border-[#DDD4C0] px-4 py-3 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 max-h-60 overflow-y-auto"
        >
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                ACTION_CATEGORIES[selectedSite.actionType]?.badgeBg || 'bg-red-50'
              } ${
                ACTION_CATEGORIES[selectedSite.actionType]?.badgeText || 'text-red-700'
              } border border-[#DDD4C0]`}>
                ⊙ {ACTION_CATEGORIES[selectedSite.actionType]?.shortLabel || 'Tactical Target'}
              </span>
              <h3 className="font-bold text-sm text-[#243324]">
                {selectedSite.name}
              </h3>
              <span className="text-xs text-[#DC2626] font-bold">
                • {selectedSite.seizureMetric}
              </span>
            </div>
            
            <p className="text-xs text-[#4A5B4C] leading-relaxed">
              {selectedSite.operationalNotes}
            </p>

            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="text-[11px] font-semibold text-[#6B7D6C]">Evidentiary Proof:</span>
              <span className="text-[11px] text-[#243324] bg-[#EFE8DC] px-2 py-0.5 rounded font-mono">
                {selectedSite.evidenceSummary}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
            <button
              onClick={() => {
                leafletMapRef.current?.flyTo([selectedSite.lat, selectedSite.lng], 16, { duration: 1.0 });
              }}
              className="px-3 py-1.5 rounded-md bg-[#243324] text-[#FBF9F5] text-xs font-semibold hover:bg-[#1A261A] flex items-center gap-1.5 shadow-xs"
            >
              <Crosshair className="w-3.5 h-3.5 text-amber-300" />
              <span>Street Level Zoom</span>
            </button>
            <button
              onClick={() => setSelectedSite(null)}
              className="px-3 py-1.5 rounded-md border border-[#DDD4C0] bg-white text-xs font-semibold text-[#4A5B4C] hover:bg-[#EFE8DC]"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ================================================================
          6 MAJOR ENHANCEMENT MODALS & DRAWERS
      ================================================================ */}
      
      {/* 1. Multi-Jurisdiction Financial Flow Sankey Drawer */}
      <FinancialFlowSankeyDrawer
        isOpen={isSankeyDrawerOpen}
        onClose={() => setIsSankeyDrawerOpen(false)}
        selectedCaseId={activeCaseFilter as any}
        onSelectArcOnMap={(arc) => {
          if (leafletMapRef.current) {
            leafletMapRef.current.flyTo(arc.sourceCoords, 7);
          }
        }}
      />

      {/* 2. Cross-Case Entity Resolution Studio */}
      <CrossCaseNexusModal
        isOpen={isNexusModalOpen}
        onClose={() => setIsNexusModalOpen(false)}
      />

      {/* 3. Algorithmic Manifest Anomaly & Port Vulnerability Index */}
      <ManifestRiskScorerModal
        isOpen={isManifestRiskModalOpen}
        onClose={() => setIsManifestRiskModalOpen(false)}
      />

      {/* 4. Judicial Courtroom Presentation Mode */}
      <JudicialCourtroomMode
        isOpen={isJudicialModeOpen}
        onClose={() => setIsJudicialModeOpen(false)}
        selectedCaseId={activeCaseFilter as any}
      />

    </div>
  );
};
