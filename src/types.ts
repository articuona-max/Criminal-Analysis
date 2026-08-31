/**
 * POLE (People, Objects, Locations, Events) Ontology & Intelligence Types
 */

export type POLEType = 'Person' | 'Phone' | 'Account' | 'Vehicle' | 'Location' | 'Organization' | 'Event';

export type RoleType = 'Kingpin' | 'Broker' | 'Mule' | 'Operative' | 'Informant' | 'Associate' | 'Target';

export type RiskLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'MINIMAL';

export type CaseId = 'CASE_ALL' | 'CASE_PNB_MODI' | 'CASE_ANOM_TROJAN' | 'CASE_MUNDRA_TALC';

export interface CaseProfile {
  id: CaseId;
  code: string;
  title: string;
  shortTitle: string;
  leadAgency: string;
  jurisdiction: string;
  year: string;
  summary: string;
  totalSeizureOrFraud: string;
  publicDocumentation: string[];
  courtFilings: string[];
  keyAnomaliesCount: number;
  evidenceItemsCount: number;
  badgeColor: string;
}

export interface AnomalyRecord {
  id: string;
  case_id: CaseId;
  case_name: string;
  title: string;
  type: 
    | 'RECONCILIATION_ZERO_FOOTPRINT' 
    | 'FINANCIAL_ROUNDTRIP' 
    | 'TELECOM_BURST' 
    | 'GAE_NETWORK_OUTLIER' 
    | 'CUSTOMS_VALUATION_WEIGHT' 
    | 'ZERO_HISTORY_SHELL' 
    | 'CROSS_BORDER_CORRIDOR';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  detected_mechanism: string;
  anomaly_score: number; // 0.0 - 1.0
  summary: string;
  evidentiary_proof: string;
  court_admissibility: string;
  related_node_ids: string[];
  related_edge_ids?: string[];
  map_coordinates?: {
    lat: number;
    lng: number;
    location_name: string;
  };
  key_metric_label: string;
  key_metric_value: string;
}

export interface BaseNode {
  id: string;
  label: string;
  type: POLEType;
  case_id?: CaseId;
  case_title?: string;
  risk_score: number; // 0 - 100
  risk_level: RiskLevel;
  community_id: number; // Louvain cluster
  betweenness_centrality: number; // 0.0 - 1.0
  broker_score: number; // betweenness / degree
  gae_anomaly_score: number; // Graph Auto-Encoder reconstruction anomaly 0.0 - 1.0
  created_at: string;
  last_active: string;
  notes?: string;
  tags: string[];
}

export interface PersonNode extends BaseNode {
  type: 'Person';
  canonical_id: string;
  name: string;
  aliases: string[];
  age: number;
  gender: 'M' | 'F' | 'Other';
  role: RoleType;
  nationality: string;
  fir_count: number;
  court_cases: number;
  nafis_biometric_id?: string;
  photo_url?: string;
  status: 'Wanted' | 'Under Surveillance' | 'In Custody' | 'Unidentified' | 'Active';
}

export interface PhoneNode extends BaseNode {
  type: 'Phone';
  msisdn: string;
  imei: string;
  operator: 'Airtel' | 'Jio' | 'Vodafone Idea' | 'Etisalat' | 'Satellite/Thuraya';
  burner_probability: number; // 0.0 - 1.0
  burst_count: number;
  total_calls: number;
  active_radius_km: number;
  tower_id: string;
}

export interface AccountNode extends BaseNode {
  type: 'Account';
  account_number: string;
  bank_name: string;
  ifsc_code: string;
  account_holder: string;
  total_inflow_inr: number;
  total_outflow_inr: number;
  structuring_flag: boolean; // Flagged for smurfing <50,000 INR
  swift_bic?: string;
  jurisdiction: string;
}

export interface VehicleNode extends BaseNode {
  type: 'Vehicle';
  license_plate: string;
  maker_model: string;
  vehicle_class: 'Sedan' | 'SUV' | 'Speedboat' | 'Cargo Truck' | 'Container Trailer';
  owner_name: string;
  rto_state: string;
  cctv_hits: number;
  chassis_number: string;
}

export interface LocationNode extends BaseNode {
  type: 'Location';
  name: string;
  lat: number;
  lng: number;
  location_type: 'Safehouse' | 'CellTower' | 'PortLanding' | 'HawalaHub' | 'MeetingPoint' | 'FinancialOffice' | 'RaidSite';
  city: string;
  country: string;
  incident_count: number;
  surveillance_level: 'High' | 'Medium' | 'Low';
}

export interface OrganizationNode extends BaseNode {
  type: 'Organization';
  org_name: string;
  org_type: 'CartelSyndicate' | 'ShellCompany' | 'HawalaRing' | 'SmugglingOps' | 'FrontNGO';
  registered_jurisdiction: string;
  shell_flag: boolean;
}

export interface EventNode extends BaseNode {
  type: 'Event';
  event_type: 'FIR_Case' | 'NarcoticSeizure' | 'HawalaDrop' | 'SurveillanceIntercept' | 'RaidOperation' | 'CDR_Spike';
  fir_number?: string;
  ipc_sections: string[];
  location_name: string;
  timestamp: string;
  description: string;
  severity: 'Critical' | 'Major' | 'Moderate' | 'Minor';
  amount_involved_inr?: number;
}

export type POLENode = PersonNode | PhoneNode | AccountNode | VehicleNode | LocationNode | OrganizationNode | EventNode;

export type EdgeType =
  | 'USES'
  | 'OWNS'
  | 'CALLED'
  | 'TRANSACTED'
  | 'ASSOCIATED_WITH'
  | 'INVOLVED_IN'
  | 'OCCURRED_AT'
  | 'FREQUENTS'
  | 'MEMBER_OF'
  | 'PREDICTED_LINK';

export interface POLEEdge {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
  weight: number;
  case_id?: CaseId;
  timestamp?: string;
  metadata?: {
    duration_sec?: number;
    amount_inr?: number;
    swift_mt103?: string;
    is_structuring?: boolean;
    burst_group_id?: string;
    confidence?: number; // for AI link prediction
    relation_strength?: string;
    description?: string;
  };
}

export interface GraphDataset {
  nodes: POLENode[];
  edges: POLEEdge[];
}

export interface AlertItem {
  id: string;
  case_id?: CaseId;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  category: 'BURST_COMM' | 'STRUCTURING' | 'ANOMALY_GAE' | 'CROSS_BORDER' | 'NEW_LEAD' | 'RAID_WINDOW';
  timestamp: string;
  description: string;
  source_pipeline: string;
  related_node_ids: string[];
  status: 'UNRESOLVED' | 'INVESTIGATING' | 'DISMISSED' | 'RESOLVED';
}

export interface EvidenceStep {
  id: string;
  case_id?: CaseId;
  order: number;
  title: string;
  timestamp: string;
  category: 'Surveillance' | 'Telecom' | 'Banking' | 'Logistics' | 'Seizure' | 'Legal_FIR';
  description: string;
  legal_admissibility: 'Admissible (Sec 65B)' | 'Pending Verification' | 'Intelligence Only';
  hash_checksum: string;
  source_entity_id: string;
  target_entity_id: string;
  documents: { name: string; size: string; type: string }[];
}

export interface MoneyMotif {
  id: string;
  case_id?: CaseId;
  type: 'CYCLE_ROUND_TRIP' | 'SMURFING_STAR' | 'RAPID_SUCCESSION';
  title: string;
  description: string;
  total_amount_inr: number;
  node_ids: string[];
  edge_ids: string[];
  detected_at: string;
  confidence: number;
}

export interface CDRBurst {
  id: string;
  case_id?: CaseId;
  burner_msisdn: string;
  suspect_name: string;
  burst_start: string;
  burst_end: string;
  call_count: number;
  duration_window_min: number;
  cell_tower_id: string;
  tower_name: string;
  variance_score: number;
  inter_event_avg_sec: number;
  burner_score: number;
}

export interface EntityResolutionPair {
  id: string;
  candidate_a: PersonNode;
  candidate_b: PersonNode;
  similarity_score: number; // 0 - 100
  matching_features: string[];
  status: 'PENDING' | 'MERGED' | 'REJECTED';
}

export interface IngestionPipelineStat {
  id: string;
  name: string;
  source_type: string;
  ingested_count: number;
  failed_count: number;
  dlq_count: number;
  throughput_per_sec: number;
  backpressure_pct: number;
  status: 'ACTIVE' | 'IDLE' | 'BACKPRESSURE' | 'ERROR';
  last_batch_time: string;
}
