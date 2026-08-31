import { GraphDataset, AlertItem, EvidenceStep, MoneyMotif, CDRBurst, EntityResolutionPair, IngestionPipelineStat } from '../types';

export const INITIAL_GRAPH_DATA: GraphDataset = {
  nodes: [
    // PEOPLE
    {
      id: 'p-01',
      canonical_id: 'CAN-PER-0881',
      label: 'Tariq "Falcon" Merchant',
      name: 'Tariq Merchant',
      aliases: ['Falcon', 'Tariq Bhai', 'T.M. Dubai', 'Al-Falaki'],
      type: 'Person',
      age: 52,
      gender: 'M',
      role: 'Kingpin',
      nationality: 'Indian (UAE Residency)',
      risk_score: 96,
      risk_level: 'CRITICAL',
      community_id: 1,
      betweenness_centrality: 0.88,
      broker_score: 0.22,
      gae_anomaly_score: 0.35,
      fir_count: 14,
      court_cases: 6,
      nafis_biometric_id: 'NAFIS-IN-MH-99412',
      status: 'Wanted',
      created_at: '2024-01-15T08:00:00Z',
      last_active: '2026-08-28T19:42:00Z',
      photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces',
      notes: 'Primary apex coordinator operating out of Deira, Dubai. Oversees contraband logistics and high-value Hawala routing.',
      tags: ['Apex Target', 'Red Corner Notice', 'Hawala Financier', 'Cross-Border']
    },
    {
      id: 'p-02',
      canonical_id: 'CAN-PER-0882',
      label: 'Vikram "Vicky" Malhotra',
      name: 'Vikram Malhotra',
      aliases: ['Vicky Dubai', 'V. Malhotra', 'Vicky Seth'],
      type: 'Person',
      age: 46,
      gender: 'M',
      role: 'Broker',
      nationality: 'Indian',
      risk_score: 91,
      risk_level: 'CRITICAL',
      community_id: 1,
      betweenness_centrality: 0.94,
      broker_score: 0.31,
      gae_anomaly_score: 0.42,
      fir_count: 9,
      court_cases: 4,
      nafis_biometric_id: 'NAFIS-IN-DL-44120',
      status: 'Under Surveillance',
      created_at: '2024-02-10T11:00:00Z',
      last_active: '2026-08-30T14:15:00Z',
      photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces',
      notes: 'Crucial bridge node connecting apex leadership in UAE to domestic maritime logistics and customs clearing agents in Mumbai.',
      tags: ['Bridge Node', 'High Betweenness', 'Customs Clearing', 'Money Mule Network']
    },
    {
      id: 'p-03',
      canonical_id: 'CAN-PER-0883',
      label: 'Ramesh "Hawala" Soni',
      name: 'Ramesh Soni',
      aliases: ['Soni Bullion', 'R.K. Jewellers Delhi', 'Chacha Soni'],
      type: 'Person',
      age: 58,
      gender: 'M',
      role: 'Broker',
      nationality: 'Indian',
      risk_score: 87,
      risk_level: 'CRITICAL',
      community_id: 2,
      betweenness_centrality: 0.91,
      broker_score: 0.28,
      gae_anomaly_score: 0.38,
      fir_count: 7,
      court_cases: 3,
      nafis_biometric_id: 'NAFIS-IN-DL-88194',
      status: 'Under Surveillance',
      created_at: '2024-03-01T09:30:00Z',
      last_active: '2026-08-29T18:20:00Z',
      photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces',
      notes: 'Master Hawala operator based in Chandni Chowk, Delhi. Channels illicit funds through token notes and synthetic bullion trade invoices.',
      tags: ['Hawala Master', 'Bullion Front', 'Structuring Ring', 'High Centrality']
    },
    {
      id: 'p-04',
      canonical_id: 'CAN-PER-0884',
      label: 'Farooq "Captain" Qureshi',
      name: 'Farooq Qureshi',
      aliases: ['Captain', 'F. Qureshi', 'Sagar Man'],
      type: 'Person',
      age: 41,
      gender: 'M',
      role: 'Operative',
      nationality: 'Indian',
      risk_score: 84,
      risk_level: 'HIGH',
      community_id: 3,
      betweenness_centrality: 0.72,
      broker_score: 0.18,
      gae_anomaly_score: 0.55,
      fir_count: 8,
      court_cases: 2,
      nafis_biometric_id: 'NAFIS-IN-MH-11209',
      status: 'Wanted',
      created_at: '2024-04-12T14:00:00Z',
      last_active: '2026-08-30T02:10:00Z',
      photo_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=faces',
      notes: 'Maritime smuggling handler controlling offloading speedboats near Mandwa and Nhava Sheva coastal creeks.',
      tags: ['Maritime Logistics', 'Speedboat Operator', 'Narcotics Carrier']
    },
    {
      id: 'p-05',
      canonical_id: 'CAN-PER-0885',
      label: 'Deepak "Bunty" Rao',
      name: 'Deepak Rao',
      aliases: ['Bunty', 'D-Rao', 'Speedy'],
      type: 'Person',
      age: 33,
      gender: 'M',
      role: 'Mule',
      nationality: 'Indian',
      risk_score: 74,
      risk_level: 'HIGH',
      community_id: 3,
      betweenness_centrality: 0.45,
      broker_score: 0.09,
      gae_anomaly_score: 0.71,
      fir_count: 4,
      court_cases: 1,
      nafis_biometric_id: 'NAFIS-IN-MH-77312',
      status: 'In Custody',
      created_at: '2024-05-20T10:00:00Z',
      last_active: '2026-08-25T11:45:00Z',
      photo_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=faces',
      notes: 'Local distribution courier and driver for sealed cargo trailers moving from JNPT to Bhiwandi warehouses.',
      tags: ['Ground Courier', 'Cargo Transport', 'Arrested']
    },
    {
      id: 'p-06',
      canonical_id: 'CAN-PER-0886',
      label: 'Sunita "Madam" Sharma',
      name: 'Sunita Sharma',
      aliases: ['Madam Sunita', 'S. Sharma Export', 'The Accountant'],
      type: 'Person',
      age: 39,
      gender: 'F',
      role: 'Broker',
      nationality: 'Indian',
      risk_score: 82,
      risk_level: 'HIGH',
      community_id: 2,
      betweenness_centrality: 0.81,
      broker_score: 0.24,
      gae_anomaly_score: 0.48,
      fir_count: 3,
      court_cases: 2,
      nafis_biometric_id: 'NAFIS-IN-DL-39912',
      status: 'Under Surveillance',
      created_at: '2024-06-05T16:20:00Z',
      last_active: '2026-08-30T10:11:00Z',
      photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=faces',
      notes: 'Manages shell company directorships and coordinates micro-structuring deposits across Tier-2 bank branches.',
      tags: ['Shell Entity Director', 'Smurfing Coordinator', 'Financial Logistics']
    },
    {
      id: 'p-07',
      canonical_id: 'CAN-PER-0887',
      label: 'Imran "Chhota" Sheikh',
      name: 'Imran Sheikh',
      aliases: ['Chhota Imran', 'I.K. Sheikh', 'Shooter Imran'],
      type: 'Person',
      age: 29,
      gender: 'M',
      role: 'Operative',
      nationality: 'Indian',
      risk_score: 79,
      risk_level: 'HIGH',
      community_id: 3,
      betweenness_centrality: 0.38,
      broker_score: 0.08,
      gae_anomaly_score: 0.62,
      fir_count: 6,
      court_cases: 3,
      nafis_biometric_id: 'NAFIS-IN-MH-55201',
      status: 'Under Surveillance',
      created_at: '2024-07-15T12:00:00Z',
      last_active: '2026-08-30T21:05:00Z',
      photo_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&h=150&fit=crop&crop=faces',
      notes: 'Enforcer and safehouse security head. Operates burner phone SIM packs rotated every 72 hours.',
      tags: ['Enforcer', 'Burner SIM User', 'Safehouse Guard']
    },
    {
      id: 'p-08',
      canonical_id: 'CAN-PER-0888',
      label: 'Rashid "Tech" Al-Husseini',
      name: 'Rashid Al-Husseini',
      aliases: ['Abu Rashid', 'Cipher', 'Tech-R'],
      type: 'Person',
      age: 36,
      gender: 'M',
      role: 'Operative',
      nationality: 'Emirati',
      risk_score: 88,
      risk_level: 'CRITICAL',
      community_id: 1,
      betweenness_centrality: 0.65,
      broker_score: 0.16,
      gae_anomaly_score: 0.79,
      fir_count: 2,
      court_cases: 0,
      nafis_biometric_id: 'NAFIS-EXT-UAE-0081',
      status: 'Wanted',
      created_at: '2024-08-01T09:00:00Z',
      last_active: '2026-08-27T23:14:00Z',
      photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces',
      notes: 'Encrypted communication provider configuring PGP keys, VoIP proxies, and satellite phone bridges for syndicate bosses.',
      tags: ['Encrypted Comms', 'High Anomaly GAE', 'Cyber Specialist', 'Offshore']
    },

    // PHONES (OBJECTS)
    {
      id: 'ph-01',
      label: '+971 50 882 1940',
      type: 'Phone',
      msisdn: '+971508821940',
      imei: '864291040819231',
      operator: 'Etisalat',
      burner_probability: 0.15,
      burst_count: 3,
      total_calls: 412,
      active_radius_km: 18.5,
      tower_id: 'TWR-DXB-091',
      risk_score: 92,
      risk_level: 'CRITICAL',
      community_id: 1,
      betweenness_centrality: 0.85,
      broker_score: 0.21,
      gae_anomaly_score: 0.22,
      created_at: '2024-01-15T08:00:00Z',
      last_active: '2026-08-30T16:00:00Z',
      notes: 'Primary executive phone linked to Tariq Merchant. Geolocation centered around Business Bay & Deira.',
      tags: ['Executive Comms', 'International Call Hub']
    },
    {
      id: 'ph-02',
      label: '+91 98200 41182',
      type: 'Phone',
      msisdn: '+919820041182',
      imei: '359182049102834',
      operator: 'Airtel',
      burner_probability: 0.32,
      burst_count: 8,
      total_calls: 640,
      active_radius_km: 42.0,
      tower_id: 'TWR-MUM-402',
      risk_score: 88,
      risk_level: 'CRITICAL',
      community_id: 1,
      betweenness_centrality: 0.92,
      broker_score: 0.29,
      gae_anomaly_score: 0.31,
      created_at: '2024-02-12T10:00:00Z',
      last_active: '2026-08-30T18:40:00Z',
      notes: 'Main coordination line used by Vikram Malhotra. Heavy traffic to customs officers and Delhi bullion contacts.',
      tags: ['Coordination Line', 'High Call Volume']
    },
    {
      id: 'ph-03',
      label: '+91 98110 99201 (Burner A)',
      type: 'Phone',
      msisdn: '+919811099201',
      imei: '862019481920391',
      operator: 'Vodafone Idea',
      burner_probability: 0.94,
      burst_count: 14,
      total_calls: 38,
      active_radius_km: 3.2,
      tower_id: 'TWR-MUM-402',
      risk_score: 89,
      risk_level: 'CRITICAL',
      community_id: 3,
      betweenness_centrality: 0.44,
      broker_score: 0.11,
      gae_anomaly_score: 0.88,
      created_at: '2026-08-20T00:00:00Z',
      last_active: '2026-08-30T03:15:00Z',
      notes: 'Burner phone flagged by CDR Burst Engine. 9 calls made in 4 minutes right before the Mandwa landing intercept.',
      tags: ['Burner SIM', 'Burst Communication', 'High Anomaly']
    },
    {
      id: 'ph-04',
      label: '+91 98710 33491 (Hawala Wire)',
      type: 'Phone',
      msisdn: '+919871033491',
      imei: '351940291049281',
      operator: 'Jio',
      burner_probability: 0.45,
      burst_count: 6,
      total_calls: 512,
      active_radius_km: 12.0,
      tower_id: 'TWR-DEL-108',
      risk_score: 85,
      risk_level: 'HIGH',
      community_id: 2,
      betweenness_centrality: 0.78,
      broker_score: 0.22,
      gae_anomaly_score: 0.35,
      created_at: '2024-03-05T12:00:00Z',
      last_active: '2026-08-29T20:10:00Z',
      notes: 'Soni Bullion official coordination line. Exchanging code tokens and remittance confirmations.',
      tags: ['Hawala Line', 'Token Confirmation']
    },

    // ACCOUNTS (OBJECTS)
    {
      id: 'acc-01',
      label: 'Emirates NBD #882049102',
      type: 'Account',
      account_number: '882049102001',
      bank_name: 'Emirates NBD Dubai',
      ifsc_code: 'EBILAEADXXX',
      account_holder: 'Al-Bahar General Trading LLC',
      total_inflow_inr: 452000000,
      total_outflow_inr: 448000000,
      structuring_flag: false,
      swift_bic: 'EBILAEAD',
      jurisdiction: 'United Arab Emirates',
      risk_score: 95,
      risk_level: 'CRITICAL',
      community_id: 1,
      betweenness_centrality: 0.89,
      broker_score: 0.25,
      gae_anomaly_score: 0.32,
      created_at: '2024-01-10T00:00:00Z',
      last_active: '2026-08-28T14:30:00Z',
      notes: 'Foreign clearing hub account. SWIFT MT103 logs show regular outward transfers disguised as textile imports.',
      tags: ['Primary Inflow Hub', 'SWIFT MT103', 'Shell Company Account']
    },
    {
      id: 'acc-02',
      label: 'HDFC Bank #50200091823',
      type: 'Account',
      account_number: '50200091823901',
      bank_name: 'HDFC Bank Fort Branch Mumbai',
      ifsc_code: 'HDFC0000060',
      account_holder: 'Malhotra Freight Logistics PVT LTD',
      total_inflow_inr: 124000000,
      total_outflow_inr: 119500000,
      structuring_flag: true,
      swift_bic: 'HDFCINBB',
      jurisdiction: 'India (Domestic)',
      risk_score: 90,
      risk_level: 'CRITICAL',
      community_id: 1,
      betweenness_centrality: 0.86,
      broker_score: 0.26,
      gae_anomaly_score: 0.44,
      created_at: '2024-02-15T00:00:00Z',
      last_active: '2026-08-30T11:00:00Z',
      notes: 'Domestic freight entity receiving international trade remittances and distributing to smurfing accounts.',
      tags: ['Logistics Front', 'Structuring Flagged', 'Major Hub']
    },
    {
      id: 'acc-03',
      label: 'SBI Chandni Chowk #310492810',
      type: 'Account',
      account_number: '3104928102948',
      bank_name: 'State Bank of India',
      ifsc_code: 'SBIN0000631',
      account_holder: 'Soni Bullion & Gems Traders',
      total_inflow_inr: 286000000,
      total_outflow_inr: 284500000,
      structuring_flag: true,
      swift_bic: 'SBININBB',
      jurisdiction: 'India (Domestic)',
      risk_score: 88,
      risk_level: 'CRITICAL',
      community_id: 2,
      betweenness_centrality: 0.82,
      broker_score: 0.23,
      gae_anomaly_score: 0.39,
      created_at: '2024-03-10T00:00:00Z',
      last_active: '2026-08-29T16:20:00Z',
      notes: 'Gold trading account utilized for settling Hawala discrepancies through fake jewelry sales vouchers.',
      tags: ['Bullion Settlement', 'Structuring Flagged', 'Hawala Link']
    },
    {
      id: 'acc-04',
      label: 'Axis Bank Smurf #919020491',
      type: 'Account',
      account_number: '9190204910291',
      bank_name: 'Axis Bank Karol Bagh',
      ifsc_code: 'UTIB0000120',
      account_holder: 'Shree Sai Enterprises (Mule)',
      total_inflow_inr: 18400000,
      total_outflow_inr: 18350000,
      structuring_flag: true,
      jurisdiction: 'India (Domestic)',
      risk_score: 79,
      risk_level: 'HIGH',
      community_id: 2,
      betweenness_centrality: 0.42,
      broker_score: 0.12,
      gae_anomaly_score: 0.68,
      created_at: '2025-01-08T00:00:00Z',
      last_active: '2026-08-30T09:15:00Z',
      notes: 'Smurfing node: Received 38 deposits of ₹48,500 - ₹49,900 within 48 hours to evade FIU CTR thresholds.',
      tags: ['Smurfing Mule', 'Micro-Structuring', 'High Turnover']
    },

    // VEHICLES (OBJECTS)
    {
      id: 'veh-01',
      label: 'Speedboat "Sea Falcon" (REG-MUM-88)',
      type: 'Vehicle',
      license_plate: 'MH-06-SF-8819',
      maker_model: 'Yamaha 300HP Twin Outboard Speedboat',
      vehicle_class: 'Speedboat',
      owner_name: 'Mandwa Marine Charters (Farooq Qureshi)',
      rto_state: 'Maharashtra',
      cctv_hits: 12,
      chassis_number: 'YMH-OB-2023-881920',
      risk_score: 86,
      risk_level: 'HIGH',
      community_id: 3,
      betweenness_centrality: 0.51,
      broker_score: 0.14,
      gae_anomaly_score: 0.65,
      created_at: '2024-04-15T00:00:00Z',
      last_active: '2026-08-30T02:30:00Z',
      notes: 'High-speed coastal vessel used for night offloading from mother dhows 12 nautical miles off Alibaug coast.',
      tags: ['Contraband Carrier', 'Coastal Smuggling', 'High Speed']
    },
    {
      id: 'veh-02',
      label: 'Cargo Container Truck (MH-04-GP-9120)',
      type: 'Vehicle',
      license_plate: 'MH-04-GP-9120',
      maker_model: 'Tata Prima 40-Ton Heavy Hauler',
      vehicle_class: 'Cargo Truck',
      owner_name: 'Malhotra Freight Logistics',
      rto_state: 'Maharashtra',
      cctv_hits: 34,
      chassis_number: 'TAT-PR-2022-912041',
      risk_score: 83,
      risk_level: 'HIGH',
      community_id: 3,
      betweenness_centrality: 0.62,
      broker_score: 0.17,
      gae_anomaly_score: 0.58,
      created_at: '2024-05-01T00:00:00Z',
      last_active: '2026-08-29T22:15:00Z',
      notes: 'Tracked on Mumbai-Pune Expressway and NH48 moving sealed import containers from JNPT Nhava Sheva.',
      tags: ['Port Hauler', 'FASTag Monitored', 'Sealed Container']
    },

    // LOCATIONS (LOCATIONS)
    {
      id: 'loc-01',
      label: 'Dubai Deira Gold Souk Hub',
      type: 'Location',
      name: 'Deira Gold Souk Financial Center',
      lat: 25.2697,
      lng: 55.3015,
      location_type: 'HawalaHub',
      city: 'Dubai',
      country: 'United Arab Emirates',
      incident_count: 18,
      surveillance_level: 'High',
      risk_score: 94,
      risk_level: 'CRITICAL',
      community_id: 1,
      betweenness_centrality: 0.95,
      broker_score: 0.28,
      gae_anomaly_score: 0.25,
      created_at: '2024-01-01T00:00:00Z',
      last_active: '2026-08-30T17:00:00Z',
      notes: 'International mastermind base and Hawala clearing node. Tariq Merchant operates front trade offices here.',
      tags: ['Apex Origin', 'Hawala Nexus', 'International Hub']
    },
    {
      id: 'loc-02',
      label: 'Nhava Sheva Port (JNPT) Terminal 3',
      type: 'Location',
      name: 'JNPT Port Container Terminal 3',
      lat: 18.9496,
      lng: 72.9510,
      location_type: 'PortLanding',
      city: 'Navi Mumbai',
      country: 'India',
      incident_count: 24,
      surveillance_level: 'High',
      risk_score: 92,
      risk_level: 'CRITICAL',
      community_id: 3,
      betweenness_centrality: 0.88,
      broker_score: 0.24,
      gae_anomaly_score: 0.38,
      created_at: '2024-01-10T00:00:00Z',
      last_active: '2026-08-30T04:00:00Z',
      notes: 'Major maritime cargo entry point for hidden narcotic caches mixed into gypsum and chemical consignments.',
      tags: ['Maritime Entry', 'Customs Scanners', 'Interception Site']
    },
    {
      id: 'loc-03',
      label: 'Chandni Chowk Hawala Center',
      type: 'Location',
      name: 'Kucha Mahajani Bullion Market',
      lat: 28.6562,
      lng: 77.2315,
      location_type: 'HawalaHub',
      city: 'New Delhi',
      country: 'India',
      incident_count: 15,
      surveillance_level: 'High',
      risk_score: 89,
      risk_level: 'CRITICAL',
      community_id: 2,
      betweenness_centrality: 0.86,
      broker_score: 0.25,
      gae_anomaly_score: 0.34,
      created_at: '2024-02-01T00:00:00Z',
      last_active: '2026-08-29T19:30:00Z',
      notes: 'Dense bullion trading district acting as the domestic cash dispersal and token exchange clearinghouse.',
      tags: ['Domestic Hawala Hub', 'Token Handover Point', 'Cash Dispersal']
    },
    {
      id: 'loc-04',
      label: 'Mandwa Coastal Landing Point',
      type: 'Location',
      name: 'Mandwa Jetty Creek Inlet',
      lat: 18.7997,
      lng: 72.8710,
      location_type: 'Safehouse',
      city: 'Alibaug',
      country: 'India',
      incident_count: 11,
      surveillance_level: 'Medium',
      risk_score: 85,
      risk_level: 'HIGH',
      community_id: 3,
      betweenness_centrality: 0.68,
      broker_score: 0.19,
      gae_anomaly_score: 0.61,
      created_at: '2024-04-10T00:00:00Z',
      last_active: '2026-08-30T02:45:00Z',
      notes: 'Unmanned coastal creek landing point for speedboats delivering contraband packages under dark hours.',
      tags: ['Creek Landing', 'Night Offload', 'Coastal Radar Tracked']
    },
    {
      id: 'loc-05',
      label: 'Bhiwandi Logistic Warehouse #14',
      type: 'Location',
      name: 'Bhiwandi Storage & Freight Complex',
      lat: 19.2968,
      lng: 73.0631,
      location_type: 'Safehouse',
      city: 'Thane / Bhiwandi',
      country: 'India',
      incident_count: 9,
      surveillance_level: 'Medium',
      risk_score: 81,
      risk_level: 'HIGH',
      community_id: 3,
      betweenness_centrality: 0.58,
      broker_score: 0.15,
      gae_anomaly_score: 0.52,
      created_at: '2024-05-15T00:00:00Z',
      last_active: '2026-08-28T21:00:00Z',
      notes: 'Transit depot for splitting bulk narcotics packages into domestic distribution batches.',
      tags: ['Transit Depot', 'Repackaging Unit', 'Warehouse']
    },
    {
      id: 'loc-06',
      label: 'Goa Anjuna Safehouse',
      type: 'Location',
      name: 'Anjuna Coastal Villa 4',
      lat: 15.5800,
      lng: 73.7400,
      location_type: 'Safehouse',
      city: 'Goa',
      country: 'India',
      incident_count: 6,
      surveillance_level: 'Medium',
      risk_score: 76,
      risk_level: 'HIGH',
      community_id: 3,
      betweenness_centrality: 0.46,
      broker_score: 0.11,
      gae_anomaly_score: 0.59,
      created_at: '2024-06-20T00:00:00Z',
      last_active: '2026-08-29T23:00:00Z',
      notes: 'Hospitality and tourist corridor distribution base coordinated by syndicate mules during peak season.',
      tags: ['Distribution Hub', 'Tourist Corridor', 'Safehouse']
    },

    // ORGANIZATIONS (ORGANIZATIONS)
    {
      id: 'org-01',
      label: 'Al-Bahar General Trading LLC',
      type: 'Organization',
      org_name: 'Al-Bahar General Trading LLC',
      org_type: 'ShellCompany',
      registered_jurisdiction: 'Dubai, UAE',
      shell_flag: true,
      risk_score: 93,
      risk_level: 'CRITICAL',
      community_id: 1,
      betweenness_centrality: 0.88,
      broker_score: 0.25,
      gae_anomaly_score: 0.36,
      created_at: '2024-01-05T00:00:00Z',
      last_active: '2026-08-28T15:00:00Z',
      notes: 'Apex offshore shell entity registered with nominal capital. Issues commercial invoices covering contraband shipping freight.',
      tags: ['Offshore Shell', 'Commercial Cover', 'Trade Invoicing']
    },
    {
      id: 'org-02',
      label: 'Malhotra Freight Logistics PVT LTD',
      type: 'Organization',
      org_name: 'Malhotra Freight Logistics PVT LTD',
      org_type: 'ShellCompany',
      registered_jurisdiction: 'Mumbai, India',
      shell_flag: true,
      risk_score: 90,
      risk_level: 'CRITICAL',
      community_id: 1,
      betweenness_centrality: 0.89,
      broker_score: 0.27,
      gae_anomaly_score: 0.41,
      created_at: '2024-02-01T00:00:00Z',
      last_active: '2026-08-30T12:00:00Z',
      notes: 'Domestic freight clearing entity with customs broker licenses utilized to bypass green-channel physical inspections.',
      tags: ['Domestic Front', 'Customs Clearing Entity', 'Freight Operator']
    },
    {
      id: 'org-03',
      label: 'Soni Bullion & Jewellers Network',
      type: 'Organization',
      org_name: 'Soni Bullion & Jewellers Network',
      org_type: 'HawalaRing',
      registered_jurisdiction: 'New Delhi, India',
      shell_flag: false,
      risk_score: 87,
      risk_level: 'CRITICAL',
      community_id: 2,
      betweenness_centrality: 0.83,
      broker_score: 0.24,
      gae_anomaly_score: 0.37,
      created_at: '2024-03-01T00:00:00Z',
      last_active: '2026-08-29T18:00:00Z',
      notes: 'Informal value transfer network operating across 14 state capitals with gold token settlements.',
      tags: ['Hawala Syndicate', 'Cash Layering Ring']
    },

    // EVENTS (EVENTS)
    {
      id: 'evt-01',
      label: 'FIR #402/2026: Mandwa Coast Intercept',
      type: 'Event',
      event_type: 'NarcoticSeizure',
      fir_number: 'FIR-MH-ALB-402/2026',
      ipc_sections: ['IPC 120B (Conspiracy)', 'NDPS Act Sec 8/21/29', 'Customs Act Sec 135'],
      location_name: 'Mandwa Jetty Creek Inlet',
      timestamp: '2026-08-24T03:15:00Z',
      description: 'Naval Intelligence & NCB joint interception of 85kg high-purity contraband from Speedboat Sea Falcon.',
      severity: 'Critical',
      amount_involved_inr: 170000000,
      risk_score: 95,
      risk_level: 'CRITICAL',
      community_id: 3,
      betweenness_centrality: 0.79,
      broker_score: 0.22,
      gae_anomaly_score: 0.29,
      created_at: '2026-08-24T03:15:00Z',
      last_active: '2026-08-24T06:00:00Z',
      notes: 'Arrest of Deepak Rao on site. Recovery of 2 encrypted satellite burners and GPS waypoints leading to Dubai dhows.',
      tags: ['Major FIR', 'Narcotic Seizure', 'Physical Evidence']
    },
    {
      id: 'evt-02',
      label: 'FIU Alert #991: ₹14.8 Cr Wire Loop',
      type: 'Event',
      event_type: 'HawalaDrop',
      fir_number: 'FIU-STR-2026-08819',
      ipc_sections: ['PMLA 2002 Sec 3/4 (Money Laundering)', 'FEMA Sec 13'],
      location_name: 'Chandni Chowk Hawala Center',
      timestamp: '2026-08-18T11:45:00Z',
      description: 'Circular Hawala round-tripping detected between Dubai Al-Bahar, Mumbai Freight, and Delhi Bullion accounts.',
      severity: 'Critical',
      amount_involved_inr: 148000000,
      risk_score: 92,
      risk_level: 'CRITICAL',
      community_id: 2,
      betweenness_centrality: 0.84,
      broker_score: 0.26,
      gae_anomaly_score: 0.35,
      created_at: '2026-08-18T11:45:00Z',
      last_active: '2026-08-19T17:00:00Z',
      notes: 'Suspicious Transaction Report generated. Multi-layer smurfing detected across 40+ proxy mule accounts.',
      tags: ['Money Laundering Loop', 'FIU Flag', 'Smurfing Detected']
    },
    {
      id: 'evt-03',
      label: 'CDR Anomaly: Burner Burst Pre-Landing',
      type: 'Event',
      event_type: 'CDR_Spike',
      ipc_sections: ['Telegraph Act Sec 25'],
      location_name: 'Nhava Sheva Port (JNPT) Terminal 3',
      timestamp: '2026-08-24T02:40:00Z',
      description: 'Automated burst detector flagged 18 rapid calls between IMEI 862019481920391 and Alibaug cell towers within 6 minutes.',
      severity: 'Major',
      risk_score: 87,
      risk_level: 'CRITICAL',
      community_id: 3,
      betweenness_centrality: 0.64,
      broker_score: 0.18,
      gae_anomaly_score: 0.82,
      created_at: '2026-08-24T02:40:00Z',
      last_active: '2026-08-24T03:10:00Z',
      notes: 'Pre-operational signal signature matching burner phone disposable behavior.',
      tags: ['CDR Spike', 'Burst Intercept', 'Burner SIM']
    }
  ],

  edges: [
    // Person -> Person Associations
    {
      id: 'e-01',
      source: 'p-01',
      target: 'p-02',
      type: 'ASSOCIATED_WITH',
      weight: 0.95,
      timestamp: '2024-01-20T10:00:00Z',
      metadata: {
        relation_strength: 'Master-Broker Syndicate Alliance',
        description: 'Tariq Merchant provides capital & directives; Vikram Malhotra executes domestic logistics and clears port shipments.'
      }
    },
    {
      id: 'e-02',
      source: 'p-01',
      target: 'p-03',
      type: 'ASSOCIATED_WITH',
      weight: 0.88,
      timestamp: '2024-02-15T12:00:00Z',
      metadata: {
        relation_strength: 'Hawala Settlement Counterpart',
        description: 'Tariq transfers trade surpluses in Dubai; Ramesh Soni disburses domestic cash in Delhi and Mumbai.'
      }
    },
    {
      id: 'e-03',
      source: 'p-02',
      target: 'p-04',
      type: 'ASSOCIATED_WITH',
      weight: 0.92,
      timestamp: '2024-04-10T14:30:00Z',
      metadata: {
        relation_strength: 'Operations Handler to Maritime Captain',
        description: 'Direct tasking of boat dispatch schedules, waypoint coordinates, and offload timings.'
      }
    },
    {
      id: 'e-04',
      source: 'p-04',
      target: 'p-05',
      type: 'ASSOCIATED_WITH',
      weight: 0.85,
      timestamp: '2024-05-18T16:00:00Z',
      metadata: {
        relation_strength: 'Landing Handler to Ground Courier',
        description: 'Handover of sealed waterproof packages into Tata heavy hauler container.'
      }
    },
    {
      id: 'e-05',
      source: 'p-02',
      target: 'p-06',
      type: 'ASSOCIATED_WITH',
      weight: 0.81,
      timestamp: '2024-06-01T11:00:00Z',
      metadata: {
        relation_strength: 'Logistics Lead to Smurfing Structurer',
        description: 'Directs invoice fabrication and accounts smurfing allocations under ₹50,000.'
      }
    },
    {
      id: 'e-06',
      source: 'p-04',
      target: 'p-07',
      type: 'ASSOCIATED_WITH',
      weight: 0.78,
      timestamp: '2024-07-10T19:00:00Z',
      metadata: {
        relation_strength: 'Safehouse Protection & Security Coordination',
        description: 'Enforcement and armed security cover at Alibaug coastal safehouse.'
      }
    },
    {
      id: 'e-07',
      source: 'p-01',
      target: 'p-08',
      type: 'ASSOCIATED_WITH',
      weight: 0.90,
      timestamp: '2024-08-05T08:00:00Z',
      metadata: {
        relation_strength: 'Apex Boss to Cyber/Encryption Specialist',
        description: 'Procurement of customized secure VoIP firmware and burner SIM bulk packs.'
      }
    },

    // Person -> Phone (USES)
    { id: 'e-08', source: 'p-01', target: 'ph-01', type: 'USES', weight: 1.0, timestamp: '2024-01-15T08:00:00Z' },
    { id: 'e-09', source: 'p-02', target: 'ph-02', type: 'USES', weight: 1.0, timestamp: '2024-02-12T10:00:00Z' },
    { id: 'e-10', source: 'p-07', target: 'ph-03', type: 'USES', weight: 0.95, timestamp: '2026-08-20T00:00:00Z' },
    { id: 'e-11', source: 'p-03', target: 'ph-04', type: 'USES', weight: 1.0, timestamp: '2024-03-05T12:00:00Z' },

    // Phone -> Phone (CALLED)
    {
      id: 'e-12',
      source: 'ph-01',
      target: 'ph-02',
      type: 'CALLED',
      weight: 0.94,
      timestamp: '2026-08-23T22:14:00Z',
      metadata: {
        duration_sec: 420,
        description: 'Direct call from Dubai to Mumbai coordination phone 4 hours before Mandwa offload.'
      }
    },
    {
      id: 'e-13',
      source: 'ph-02',
      target: 'ph-03',
      type: 'CALLED',
      weight: 0.91,
      timestamp: '2026-08-24T02:38:00Z',
      metadata: {
        duration_sec: 48,
        burst_group_id: 'BURST-MUM-402',
        description: 'Burst group call activating the burner SIM at Mandwa coastal cell tower.'
      }
    },
    {
      id: 'e-14',
      source: 'ph-02',
      target: 'ph-04',
      type: 'CALLED',
      weight: 0.88,
      timestamp: '2026-08-24T05:10:00Z',
      metadata: {
        duration_sec: 180,
        description: 'Settlement confirmation call to Soni Bullion regarding payments dispatch.'
      }
    },

    // Person -> Account (OWNS)
    { id: 'e-15', source: 'p-01', target: 'acc-01', type: 'OWNS', weight: 1.0, timestamp: '2024-01-10T00:00:00Z' },
    { id: 'e-16', source: 'p-02', target: 'acc-02', type: 'OWNS', weight: 1.0, timestamp: '2024-02-15T00:00:00Z' },
    { id: 'e-17', source: 'p-03', target: 'acc-03', type: 'OWNS', weight: 1.0, timestamp: '2024-03-10T00:00:00Z' },
    { id: 'e-18', source: 'p-06', target: 'acc-04', type: 'OWNS', weight: 0.9, timestamp: '2025-01-08T00:00:00Z' },

    // Account -> Account (TRANSACTED)
    {
      id: 'e-19',
      source: 'acc-01',
      target: 'acc-02',
      type: 'TRANSACTED',
      weight: 0.96,
      timestamp: '2026-08-16T10:00:00Z',
      metadata: {
        amount_inr: 58000000,
        swift_mt103: 'SWIFT-EBIL-HDFC-99120',
        is_structuring: false,
        description: 'SWIFT MT103 wire transfer masked as commercial freight advance.'
      }
    },
    {
      id: 'e-20',
      source: 'acc-02',
      target: 'acc-04',
      type: 'TRANSACTED',
      weight: 0.92,
      timestamp: '2026-08-17T14:30:00Z',
      metadata: {
        amount_inr: 18400000,
        is_structuring: true,
        description: 'Layering: Broken into 38 sub-transactions to micro-mule accounts under ₹50,000.'
      }
    },
    {
      id: 'e-21',
      source: 'acc-04',
      target: 'acc-03',
      type: 'TRANSACTED',
      weight: 0.90,
      timestamp: '2026-08-18T16:00:00Z',
      metadata: {
        amount_inr: 18200000,
        is_structuring: true,
        description: 'Consolidated transfer to Soni Bullion for Hawala cash conversion.'
      }
    },
    {
      id: 'e-22',
      source: 'acc-03',
      target: 'acc-01',
      type: 'TRANSACTED',
      weight: 0.93,
      timestamp: '2026-08-19T11:00:00Z',
      metadata: {
        amount_inr: 17500000,
        swift_mt103: 'SWIFT-SBIN-EBIL-44129',
        is_structuring: false,
        description: 'Circular round-tripping wire back to Dubai Al-Bahar completing laundering cycle.'
      }
    },

    // Person / Vehicle (OWNS / USES)
    { id: 'e-23', source: 'p-04', target: 'veh-01', type: 'USES', weight: 1.0, timestamp: '2024-04-15T00:00:00Z' },
    { id: 'e-24', source: 'p-05', target: 'veh-02', type: 'USES', weight: 1.0, timestamp: '2024-05-01T00:00:00Z' },

    // Person -> Location (FREQUENTS)
    { id: 'e-25', source: 'p-01', target: 'loc-01', type: 'FREQUENTS', weight: 0.95, timestamp: '2024-01-01T00:00:00Z' },
    { id: 'e-26', source: 'p-02', target: 'loc-02', type: 'FREQUENTS', weight: 0.92, timestamp: '2024-02-01T00:00:00Z' },
    { id: 'e-27', source: 'p-03', target: 'loc-03', type: 'FREQUENTS', weight: 0.96, timestamp: '2024-03-01T00:00:00Z' },
    { id: 'e-28', source: 'p-04', target: 'loc-04', type: 'FREQUENTS', weight: 0.89, timestamp: '2024-04-10T00:00:00Z' },
    { id: 'e-29', source: 'p-05', target: 'loc-05', type: 'FREQUENTS', weight: 0.85, timestamp: '2024-05-15T00:00:00Z' },

    // Person -> Organization (MEMBER_OF)
    { id: 'e-30', source: 'p-01', target: 'org-01', type: 'MEMBER_OF', weight: 1.0, timestamp: '2024-01-05T00:00:00Z' },
    { id: 'e-31', source: 'p-02', target: 'org-02', type: 'MEMBER_OF', weight: 1.0, timestamp: '2024-02-01T00:00:00Z' },
    { id: 'e-32', source: 'p-03', target: 'org-03', type: 'MEMBER_OF', weight: 1.0, timestamp: '2024-03-01T00:00:00Z' },

    // Person -> Event (INVOLVED_IN)
    { id: 'e-33', source: 'p-04', target: 'evt-01', type: 'INVOLVED_IN', weight: 1.0, timestamp: '2026-08-24T03:15:00Z' },
    { id: 'e-34', source: 'p-05', target: 'evt-01', type: 'INVOLVED_IN', weight: 1.0, timestamp: '2026-08-24T03:15:00Z' },
    { id: 'e-35', source: 'p-02', target: 'evt-01', type: 'INVOLVED_IN', weight: 0.85, timestamp: '2026-08-24T03:15:00Z' },
    { id: 'e-36', source: 'p-03', target: 'evt-02', type: 'INVOLVED_IN', weight: 0.95, timestamp: '2026-08-18T11:45:00Z' },
    { id: 'e-37', source: 'p-06', target: 'evt-02', type: 'INVOLVED_IN', weight: 0.90, timestamp: '2026-08-18T11:45:00Z' },
    { id: 'e-38', source: 'p-07', target: 'evt-03', type: 'INVOLVED_IN', weight: 0.95, timestamp: '2026-08-24T02:40:00Z' },

    // Event -> Location (OCCURRED_AT)
    { id: 'e-39', source: 'evt-01', target: 'loc-04', type: 'OCCURRED_AT', weight: 1.0, timestamp: '2026-08-24T03:15:00Z' },
    { id: 'e-40', source: 'evt-02', target: 'loc-03', type: 'OCCURRED_AT', weight: 1.0, timestamp: '2026-08-18T11:45:00Z' },
    { id: 'e-41', source: 'evt-03', target: 'loc-02', type: 'OCCURRED_AT', weight: 1.0, timestamp: '2026-08-24T02:40:00Z' },

    // GNN PREDICTED LINK (Hidden Relationship)
    {
      id: 'e-gnn-01',
      source: 'p-08',
      target: 'p-02',
      type: 'PREDICTED_LINK',
      weight: 0.89,
      timestamp: '2026-08-29T00:00:00Z',
      metadata: {
        confidence: 89,
        relation_strength: 'GNN Link Prediction (Heterogeneous Graph Transformer)',
        description: 'AI Predicted Hidden Link: Shared encrypted VPN relay logs and matching burner IMEI patterns indicate Rashid Al-Husseini directly coordinates encrypted firmware for Vikram Malhotra.'
      }
    },
    {
      id: 'e-gnn-02',
      source: 'p-03',
      target: 'loc-06',
      type: 'PREDICTED_LINK',
      weight: 0.82,
      timestamp: '2026-08-29T00:00:00Z',
      metadata: {
        confidence: 82,
        relation_strength: 'GNN Link Prediction (Real Estate / Hawala Proxy)',
        description: 'AI Predicted Link: Soni Bullion bank transactions match property token purchases in North Goa Anjuna sector.'
      }
    }
  ]
};

export const ALERTS_DATA: AlertItem[] = [
  {
    id: 'alt-01',
    title: 'CDR Burst Anomaly on Burner Phone (+91 98110 99201)',
    severity: 'CRITICAL',
    category: 'BURST_COMM',
    timestamp: '2026-08-30T03:15:00Z',
    description: '14 rapid communications within 4.5 minutes detected near Mandwa cell tower. Inter-event time variance is 0.08, characteristic of disposable burner protocol.',
    source_pipeline: 'Telecom CDR Parser (Stream)',
    related_node_ids: ['ph-03', 'p-07', 'loc-04'],
    status: 'INVESTIGATING'
  },
  {
    id: 'alt-02',
    title: 'Smurfing & Structuring Detected: 38 Deposits < ₹50,000',
    severity: 'CRITICAL',
    category: 'STRUCTURING',
    timestamp: '2026-08-30T09:30:00Z',
    description: 'Axis Bank Karol Bagh account received structured transfers totaling ₹1.84 Cr from Malhotra Freight Logistics within 48h to avoid FIU CTR triggers.',
    source_pipeline: 'FIU & Bank Ledger Ingestion',
    related_node_ids: ['acc-04', 'acc-02', 'p-06'],
    status: 'UNRESOLVED'
  },
  {
    id: 'alt-03',
    title: 'Graph Auto-Encoder Anomaly Flagged (GAE Error: 0.79)',
    severity: 'HIGH',
    category: 'ANOMALY_GAE',
    timestamp: '2026-08-29T23:30:00Z',
    description: 'Rashid "Tech" Al-Husseini flagged with abnormally high reconstruction error due to sparse direct edges but heavy encrypted traffic bridge positions.',
    source_pipeline: 'GAE Neural Anomaly Model',
    related_node_ids: ['p-08', 'p-01', 'p-02'],
    status: 'UNRESOLVED'
  },
  {
    id: 'alt-04',
    title: 'Round-Trip Hawala Loop: Dubai → Mumbai → Delhi → Dubai',
    severity: 'CRITICAL',
    category: 'CROSS_BORDER',
    timestamp: '2026-08-29T18:00:00Z',
    description: 'Topological motif detector confirmed a closed 4-node circular financial loop settling ₹1.75 Cr back into Al-Bahar General Trading LLC Dubai.',
    source_pipeline: 'Financial Motif Engine',
    related_node_ids: ['acc-01', 'acc-02', 'acc-04', 'acc-03'],
    status: 'INVESTIGATING'
  },
  {
    id: 'alt-05',
    title: 'GNN Link Prediction: Stealth Link between Tech-R and Vicky',
    severity: 'MEDIUM',
    category: 'NEW_LEAD',
    timestamp: '2026-08-29T12:00:00Z',
    description: 'Heterogeneous Graph Transformer (HGT) model outputted an 89% link probability between Rashid Al-Husseini and Vikram Malhotra.',
    source_pipeline: 'PyG Heterogeneous Graph Transformer',
    related_node_ids: ['p-08', 'p-02'],
    status: 'UNRESOLVED'
  }
];

export const EVIDENCE_CHAIN: EvidenceStep[] = [
  {
    id: 'ev-step-1',
    order: 1,
    title: 'Dubai Trade Invoicing & SWIFT Wire',
    timestamp: '2026-08-16 10:00 UTC',
    category: 'Banking',
    description: 'Al-Bahar Trading initiates ₹5.8 Cr SWIFT MT103 wire to Malhotra Freight Logistics under invoice #DXB-EXP-8812.',
    legal_admissibility: 'Admissible (Sec 65B)',
    hash_checksum: 'SHA256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    source_entity_id: 'acc-01',
    target_entity_id: 'acc-02',
    documents: [
      { name: 'SWIFT_MT103_EBILAEAD_HDFCINBB.pdf', size: '1.2 MB', type: 'Banking Wire Record' },
      { name: 'Invoice_DXB_EXP_8812_AlBahar.pdf', size: '840 KB', type: 'Commercial Invoice' }
    ]
  },
  {
    id: 'ev-step-2',
    order: 2,
    title: 'Micro-Structuring & Layering Deposits',
    timestamp: '2026-08-17 14:30 UTC',
    category: 'Banking',
    description: '₹1.84 Cr broken down into 38 sub-50k transactions transferred to Axis Bank Karol Bagh mule account.',
    legal_admissibility: 'Admissible (Sec 65B)',
    hash_checksum: 'SHA256: 9e107d9d372bb6826bd81d3542a419d6ec4332ee132d00f93d42c300436d501c',
    source_entity_id: 'acc-02',
    target_entity_id: 'acc-04',
    documents: [
      { name: 'Axis_Bank_Ledger_Extract_Aug26.csv', size: '3.4 MB', type: 'Bank Statement' },
      { name: 'FIU_Structuring_CTR_Alert_Report.pdf', size: '2.1 MB', type: 'Regulatory Flag' }
    ]
  },
  {
    id: 'ev-step-3',
    order: 3,
    title: 'Burner SIM Activation & CDR Burst Call',
    timestamp: '2026-08-24 02:38 UTC',
    category: 'Telecom',
    description: 'Vikram Malhotra coordinates with Imran Sheikh burner SIM (+91 98110 99201) pinging Mandwa Cell Tower #402.',
    legal_admissibility: 'Admissible (Sec 65B)',
    hash_checksum: 'SHA256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    source_entity_id: 'ph-02',
    target_entity_id: 'ph-03',
    documents: [
      { name: 'Vodafone_CDR_Tower_Dump_Mandwa_402.csv', size: '14.8 MB', type: 'Telecom CDR Log' },
      { name: 'Cell_Tower_Triangulation_Heatmap.png', size: '4.2 MB', type: 'GIS Analysis' }
    ]
  },
  {
    id: 'ev-step-4',
    order: 4,
    title: 'Speedboat Interception & Physical Seizure',
    timestamp: '2026-08-24 03:15 UTC',
    category: 'Seizure',
    description: 'Coast Guard & NCB raid Speedboat "Sea Falcon". 85kg contraband recovered, Deepak Rao arrested on site.',
    legal_admissibility: 'Admissible (Sec 65B)',
    hash_checksum: 'SHA256: a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e',
    source_entity_id: 'veh-01',
    target_entity_id: 'evt-01',
    documents: [
      { name: 'FIR_MH_ALB_402_2026_Certified.pdf', size: '5.6 MB', type: 'Police First Information Report' },
      { name: 'Panchnama_Seizure_Memo_85KG.pdf', size: '3.9 MB', type: 'Legal Panchnama Memo' },
      { name: 'Forensic_Lab_Purity_Report_CFSL.pdf', size: '1.8 MB', type: 'Forensic Chemical Assay' }
    ]
  }
];

export const MONEY_MOTIFS: MoneyMotif[] = [
  {
    id: 'motif-01',
    type: 'CYCLE_ROUND_TRIP',
    title: 'Circular Hawala Round-Trip (4 Nodes)',
    description: 'Funds originate from Dubai (Al-Bahar), flow through Mumbai freight logistics, get layered in Delhi mule accounts, and return via bullion settlements.',
    total_amount_inr: 17500000,
    node_ids: ['acc-01', 'acc-02', 'acc-04', 'acc-03'],
    edge_ids: ['e-19', 'e-20', 'e-21', 'e-22'],
    detected_at: '2026-08-29T18:00:00Z',
    confidence: 0.98
  },
  {
    id: 'motif-02',
    type: 'SMURFING_STAR',
    title: 'Smurfing Star Distribution Hub',
    description: 'Malhotra Freight Logistics account distributes high volumes into 38 sub-accounts in transactions capped under ₹50,000 threshold.',
    total_amount_inr: 18400000,
    node_ids: ['acc-02', 'acc-04'],
    edge_ids: ['e-20'],
    detected_at: '2026-08-30T09:30:00Z',
    confidence: 0.94
  }
];

export const CDR_BURSTS: CDRBurst[] = [
  {
    id: 'burst-01',
    burner_msisdn: '+91 98110 99201',
    suspect_name: 'Imran "Chhota" Sheikh / Farooq Qureshi',
    burst_start: '2026-08-24T02:35:10Z',
    burst_end: '2026-08-24T02:39:45Z',
    call_count: 14,
    duration_window_min: 4.5,
    cell_tower_id: 'TWR-MUM-402',
    tower_name: 'Mandwa Jetty Creek Coastal Tower #402',
    variance_score: 0.08,
    inter_event_avg_sec: 18.2,
    burner_score: 0.94
  },
  {
    id: 'burst-02',
    burner_msisdn: '+91 98200 41182',
    suspect_name: 'Vikram "Vicky" Malhotra',
    burst_start: '2026-08-23T22:10:00Z',
    burst_end: '2026-08-23T22:25:00Z',
    call_count: 9,
    duration_window_min: 15.0,
    cell_tower_id: 'TWR-MUM-110',
    tower_name: 'South Mumbai Nariman Point Tower #110',
    variance_score: 0.22,
    inter_event_avg_sec: 94.0,
    burner_score: 0.42
  }
];

export const ENTITY_RESOLUTION_PAIRS: EntityResolutionPair[] = [
  {
    id: 'er-01',
    candidate_a: INITIAL_GRAPH_DATA.nodes.find(n => n.id === 'p-02') as any,
    candidate_b: {
      ...INITIAL_GRAPH_DATA.nodes.find(n => n.id === 'p-02'),
      id: 'cand-p-02-b',
      canonical_id: 'UNRESOLVED-FIR-DL',
      name: 'V. K. Malhotra',
      aliases: ['Vicky Delhi', 'Vikram Kumar'],
      notes: 'Extracted from CCTNS FIR #109/2025 Karol Bagh police record.',
      risk_score: 85
    } as any,
    similarity_score: 93,
    matching_features: ['ChromaDB Vector Cosine (0.94)', 'Phone +91 98200 41182 overlap', 'NAFIS Biometric Fingerprint Hash match', 'Co-accused overlap with Ramesh Soni'],
    status: 'PENDING'
  },
  {
    id: 'er-02',
    candidate_a: INITIAL_GRAPH_DATA.nodes.find(n => n.id === 'p-01') as any,
    candidate_b: {
      ...INITIAL_GRAPH_DATA.nodes.find(n => n.id === 'p-01'),
      id: 'cand-p-01-b',
      canonical_id: 'UNRESOLVED-OSINT-TG',
      name: 'Al-Falaki Dubai',
      aliases: ['Falcon DXB', 'Merchant T.'],
      notes: 'Scraped from SOCMINT Telegram Channel @GulfTradeDesk.',
      risk_score: 91
    } as any,
    similarity_score: 89,
    matching_features: ['Vector Cosine (0.91)', 'Etisalat Phone prefix match', 'Dubai Al-Bahar corporate registry overlap'],
    status: 'PENDING'
  }
];

export const INGESTION_PIPELINES: IngestionPipelineStat[] = [
  {
    id: 'pipe-01',
    name: 'CCTNS National FIR Connector',
    source_type: 'XML / JSON API (Police FIRs)',
    ingested_count: 14820,
    failed_count: 12,
    dlq_count: 3,
    throughput_per_sec: 42.5,
    backpressure_pct: 14,
    status: 'ACTIVE',
    last_batch_time: '2 seconds ago'
  },
  {
    id: 'pipe-02',
    name: 'Telecom CDR Stream Parser',
    source_type: 'CSV Stream (Call Detail Records)',
    ingested_count: 892400,
    failed_count: 84,
    dlq_count: 15,
    throughput_per_sec: 2450.0,
    backpressure_pct: 28,
    status: 'ACTIVE',
    last_batch_time: '1 second ago'
  },
  {
    id: 'pipe-03',
    name: 'Financial Ledger & SWIFT MT103 Ingestion',
    source_type: 'SWIFT MT103 / FIU Suspicious Reports',
    ingested_count: 31200,
    failed_count: 8,
    dlq_count: 1,
    throughput_per_sec: 88.0,
    backpressure_pct: 8,
    status: 'ACTIVE',
    last_batch_time: '4 seconds ago'
  },
  {
    id: 'pipe-04',
    name: 'RTO Vahan Vehicle Registry Scraper',
    source_type: 'Playwright Scraper (Vahan / FASTag)',
    ingested_count: 5410,
    failed_count: 22,
    dlq_count: 7,
    throughput_per_sec: 12.0,
    backpressure_pct: 45,
    status: 'BACKPRESSURE',
    last_batch_time: '12 seconds ago'
  },
  {
    id: 'pipe-05',
    name: 'SOCMINT & Surveillance NLP Pipeline',
    source_type: 'Telegram / X / Audio Transcripts',
    ingested_count: 9840,
    failed_count: 5,
    dlq_count: 0,
    throughput_per_sec: 34.0,
    backpressure_pct: 12,
    status: 'ACTIVE',
    last_batch_time: '3 seconds ago'
  }
];

import { REAL_GRAPH_DATA, REAL_EVIDENCE_CHAIN, REAL_ALERTS } from './realCasesData';

export const MOCK_NODES = REAL_GRAPH_DATA.nodes;
export const MOCK_EDGES = REAL_GRAPH_DATA.edges;
export const MOCK_ALERTS = REAL_ALERTS;
export const ALL_EVIDENCE_CHAIN = REAL_EVIDENCE_CHAIN;

export const TIMELINE_SNAPSHOTS = [
  { date: '2018-01-31', label: 'CBI FIR Registered: PNB $2B LoU Fraud (RC 0682018E0004)' },
  { date: '2019-10-01', label: 'Operation Trojan Shield: ANOM Encrypted Phone Infiltration' },
  { date: '2021-06-08', label: 'Global ANOM Take-down: 800+ Arrests & Port Antwerp Seizures' },
  { date: '2021-09-16', label: 'DRI Mundra Port Interception: 2,988.21 kg Heroin Seizure' },
  { date: '2022-11-15', label: 'UK High Court Nirav Modi Extradition Judgment' },
  { date: '2023-08-20', label: 'NIA Mundra Supplementary Chargesheet Filed (Special Court)' },
  { date: '2026-08-30', label: 'Cross-Jurisdictional Real Cases Matrix (Present)' }
];


