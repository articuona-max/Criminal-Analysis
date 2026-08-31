import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import worldData from 'world-atlas/countries-110m.json';
import L from 'leaflet';
import { 
  Navigation, 
  Layers, 
  MapPin, 
  Radio, 
  ShieldAlert, 
  Compass, 
  Maximize2, 
  Crosshair, 
  Eye, 
  Zap, 
  AlertTriangle,
  FileText,
  DollarSign,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sliders,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Filter,
  CheckCircle2,
  Building2,
  Ship,
  Anchor,
  Plane,
  Truck,
  Activity,
  BarChart3,
  Globe2,
  LocateFixed,
  Search,
  ArrowRight,
  X,
  Share2,
  Copy,
  Info,
  Clock,
  Sparkles
} from 'lucide-react';
import { POLENode, POLEEdge, LocationNode, CaseId } from '../types';
import { REAL_CASE_PROFILES } from '../data/realCasesData';
import { 
  REAL_JURISDICTIONS, 
  GeoCountry, 
  GeoState, 
  GeoCity, 
  GeoFacility 
} from '../data/geoJurisdictions';

interface GeoMapProps {
  nodes: POLENode[];
  edges: POLEEdge[];
  selectedNodeId: string | null;
  onSelectNode: (node: POLENode | null) => void;
  timelineStartDate?: string;
  timelineEndDate?: string;
  selectedCaseId?: CaseId;
}

// Flat Geodesic Transnational Corridor Route
export interface RealWorldCorridor {
  id: string;
  name: string;
  case_id: CaseId;
  case_title: string;
  category: 'MARITIME_CARGO' | 'OVERLAND_SMUGGLING' | 'SWIFT_NOSTRO_FLOW' | 'ENCRYPTED_TELEMETRY' | 'FLIGHT_EXTRADITION';
  origin: { name: string; lat: number; lng: number };
  destination: { name: string; lat: number; lng: number };
  waypoints?: [number, number][]; // [lng, lat]
  volume_or_value: string;
  description: string;
}

// Action Classification Metadata
export interface ActionMeta {
  key: string;
  label: string;
  shortLabel: string;
  color: string;
  haloColor: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  description: string;
}

export const ACTION_CATEGORIES: Record<string, ActionMeta> = {
  INTERCEPT_SEIZURE: {
    key: 'INTERCEPT_SEIZURE',
    label: 'Customs Intercept & Physical Seizure',
    shortLabel: 'Seizure & Intercept',
    color: '#DC2626', // Bright Crimson
    haloColor: 'rgba(220, 38, 38, 0.35)',
    bgClass: 'bg-red-50',
    textClass: 'text-red-700',
    borderClass: 'border-red-200',
    description: 'Direct customs container interception, physical contraband raid, dockside bust'
  },
  SOURCE_PRODUCTION: {
    key: 'SOURCE_PRODUCTION',
    label: 'Source & Illicit Production',
    shortLabel: 'Source / Production',
    color: '#059669', // Emerald Green
    haloColor: 'rgba(5, 150, 105, 0.35)',
    bgClass: 'bg-emerald-50',
    textClass: 'text-emerald-700',
    borderClass: 'border-emerald-200',
    description: 'Opium cultivation, diacetylmorphine chemical processing, diamond bourse origin'
  },
  COMMAND_TELEMETRY: {
    key: 'COMMAND_TELEMETRY',
    label: 'Command Hub & FBI Telemetry',
    shortLabel: 'Command & Telemetry',
    color: '#2563EB', // Sapphire Blue
    haloColor: 'rgba(37, 99, 235, 0.35)',
    bgClass: 'bg-blue-50',
    textClass: 'text-blue-700',
    borderClass: 'border-blue-200',
    description: 'Syndicate command center, encrypted Trojan handset relay, SWIFT auth terminal'
  },
  OFFSHORE_HAWALA: {
    key: 'OFFSHORE_HAWALA',
    label: 'Offshore Sink & Hawala Laundering',
    shortLabel: 'Offshore & Hawala',
    color: '#D97706', // Amber Gold
    haloColor: 'rgba(217, 119, 6, 0.35)',
    bgClass: 'bg-amber-50',
    textClass: 'text-amber-700',
    borderClass: 'border-amber-200',
    description: 'Nostro clearing accounts, dummy shell companies, USDT crypto mixing freezones'
  },
  TRANSIT_PORT: {
    key: 'TRANSIT_PORT',
    label: 'Maritime & Overland Transshipment',
    shortLabel: 'Transit & Transshipment',
    color: '#7C3AED', // Deep Violet
    haloColor: 'rgba(124, 58, 237, 0.35)',
    bgClass: 'bg-purple-50',
    textClass: 'text-purple-700',
    borderClass: 'border-purple-200',
    description: 'Strait of Hormuz feeder port, cross-border overland truck route, transshipment dock'
  },
  EXTRADITION_TARGET: {
    key: 'EXTRADITION_TARGET',
    label: 'Extradition & Fugitive Warrant',
    shortLabel: 'Extradition Target',
    color: '#E11D48', // Vivid Rose
    haloColor: 'rgba(225, 29, 72, 0.35)',
    bgClass: 'bg-rose-50',
    textClass: 'text-rose-700',
    borderClass: 'border-rose-200',
    description: 'Interpol Red Notice subject, High Court appeal, CIP passport sanctuary'
  }
};

export function getFacilityActionMeta(fac: GeoFacility): ActionMeta {
  if (fac.status === 'Extradition Target') {
    return ACTION_CATEGORIES.EXTRADITION_TARGET;
  }
  if (fac.role === 'COMMAND_HUB') {
    return ACTION_CATEGORIES.COMMAND_TELEMETRY;
  }
  if (fac.role === 'OFFSHORE_SINK') {
    return ACTION_CATEGORIES.OFFSHORE_HAWALA;
  }
  if (fac.role === 'ORIGIN') {
    return ACTION_CATEGORIES.SOURCE_PRODUCTION;
  }
  if (fac.role === 'TRANSIT') {
    return ACTION_CATEGORIES.TRANSIT_PORT;
  }
  return ACTION_CATEGORIES.INTERCEPT_SEIZURE;
}

export const GeoMap: React.FC<GeoMapProps> = ({
  nodes,
  edges,
  selectedNodeId,
  onSelectNode,
  timelineStartDate,
  timelineEndDate,
  selectedCaseId = 'CASE_ALL'
}) => {
  // Top view tabs: 'MAP' or 'BREAKDOWN'
  const [activeViewTab, setActiveViewTab] = useState<'MAP' | 'BREAKDOWN'>('MAP');
  // Engine: 'VECTOR' (Flat Flat-Earth Projection) or 'SATELLITE' (Leaflet Tile Engine)
  const [mapEngine, setMapEngine] = useState<'VECTOR' | 'SATELLITE'>('VECTOR');

  const indiaDefaultCountry = REAL_JURISDICTIONS.find(c => c.code === 'IND') || null;

  // Hierarchical Drilldown state (Defaults directly to India so India fully covers the map on load)
  const [selectedCountry, setSelectedCountry] = useState<GeoCountry | null>(indiaDefaultCountry);
  const [selectedState, setSelectedState] = useState<GeoState | null>(null);
  const [selectedCity, setSelectedCity] = useState<GeoCity | null>(null);
  const [selectedFacility, setSelectedFacility] = useState<GeoFacility | null>(null);

  // Vector canvas zoom and pan (Calculated to center and fit India perfectly into view on load)
  // projection([78.9629, 21.8]) -> x ≈ 719, y ≈ 215. Target zoom ≈ 2.85
  const [zoomLevel, setZoomLevel] = useState(2.85);
  const [panOffset, setPanOffset] = useState({ x: 500 - 719 * 2.85, y: 275 - 215 * 2.85 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  // Hover states
  const [hoveredCountryName, setHoveredCountryName] = useState<string | null>(null);
  const [hoveredFacility, setHoveredFacility] = useState<GeoFacility | null>(null);
  const [hoveredCity, setHoveredCity] = useState<GeoCity | null>(null);
  const [hoveredStateId, setHoveredStateId] = useState<string | null>(null);

  // Action Filter
  const [selectedActionFilter, setSelectedActionFilter] = useState<string>('ALL');

  // Filters & Toggles
  const [searchQuery, setSearchQuery] = useState('');
  const [showCorridors, setShowCorridors] = useState(true);
  const [showGraticule, setShowGraticule] = useState(true);
  const [showPulse, setShowPulse] = useState(true);
  const [showFacilityDossier, setShowFacilityDossier] = useState(true);
  const [showLegend, setShowLegend] = useState(true);

  // Leaflet Map Refs
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const arcsGroupRef = useRef<L.LayerGroup | null>(null);

  const currentCase = REAL_CASE_PROFILES.find(c => c.id === selectedCaseId) || REAL_CASE_PROFILES[0];

  // 1. Filtered Jurisdictions by active case
  const scopedCountries = useMemo(() => {
    let list = REAL_JURISDICTIONS;
    if (selectedCaseId !== 'CASE_ALL') {
      list = list.filter(c => c.case_ids.includes(selectedCaseId as CaseId));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(c => 
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.states.some(s => 
          s.name.toLowerCase().includes(q) ||
          s.cities.some(ci => 
            ci.name.toLowerCase().includes(q) ||
            ci.facilities.some(f => f.name.toLowerCase().includes(q))
          )
        )
      );
    }
    return list;
  }, [selectedCaseId, searchQuery]);

  // Flatten all active facilities in the scope with Action Metadata
  const allScopedFacilities = useMemo(() => {
    const facilities: (GeoFacility & { country: string; state: string; city: string; actionMeta: ActionMeta })[] = [];
    scopedCountries.forEach(country => {
      country.states.forEach(state => {
        state.cities.forEach(city => {
          city.facilities.forEach(fac => {
            if (selectedCaseId === 'CASE_ALL' || fac.case_id === selectedCaseId) {
              const actionMeta = getFacilityActionMeta(fac);
              if (selectedActionFilter === 'ALL' || actionMeta.key === selectedActionFilter) {
                facilities.push({
                  ...fac,
                  country: country.name,
                  state: state.name,
                  city: city.name,
                  actionMeta
                });
              }
            }
          });
        });
      });
    });
    return facilities;
  }, [scopedCountries, selectedCaseId, selectedActionFilter]);

  // 2. Real-World Transnational Corridors
  const ALL_REAL_CORRIDORS: RealWorldCorridor[] = useMemo(() => [
    // PNB Corridors
    {
      id: 'cor-pnb-01',
      name: 'Mumbai ➔ Dubai ➔ Hong Kong Synthetic Invoice Pipeline',
      case_id: 'CASE_PNB_MODI',
      case_title: 'PNB $2B LoU Fraud',
      category: 'SWIFT_NOSTRO_FLOW',
      origin: { name: 'Mumbai Fort', lat: 18.9322, lng: 72.8335 },
      destination: { name: 'Hong Kong Central', lat: 22.2819, lng: 114.1581 },
      waypoints: [[55.2981, 25.2711]], // Dubai
      volume_or_value: '$2.01 Billion (₹14,356 Cr)',
      description: 'Unauthorized SWIFT MT799 messages triggered offshore buyer credit disbursals from Allahabad & Axis Bank HK.'
    },
    {
      id: 'cor-pnb-02',
      name: 'Mumbai ➔ London Holborn Flight Path',
      case_id: 'CASE_PNB_MODI',
      case_title: 'PNB $2B LoU Fraud',
      category: 'FLIGHT_EXTRADITION',
      origin: { name: 'Mumbai BDB', lat: 19.0657, lng: 72.8682 },
      destination: { name: 'London Westminster', lat: 51.5074, lng: -0.1278 },
      volume_or_value: 'Interpol Red Notice #A-6593/7-2018',
      description: 'Nirav Modi fled India via UAE and Hong Kong, settling in London before arrest in Holborn.'
    },
    {
      id: 'cor-pnb-03',
      name: 'Mumbai ➔ Antigua & Barbuda Offshore Haven',
      case_id: 'CASE_PNB_MODI',
      case_title: 'PNB $2B LoU Fraud',
      category: 'FLIGHT_EXTRADITION',
      origin: { name: 'Mumbai BDB', lat: 19.0657, lng: 72.8682 },
      destination: { name: 'St. John\'s Antigua', lat: 17.1172, lng: -61.8457 },
      volume_or_value: '$150M CIP Investment & Assets',
      description: 'Mehul Choksi fled to Antigua under Citizenship by Investment prior to registration of CBI FIR.'
    },
    {
      id: 'cor-pnb-04',
      name: 'Mumbai ➔ New York Madison Avenue Asset Route',
      case_id: 'CASE_PNB_MODI',
      case_title: 'PNB $2B LoU Fraud',
      category: 'SWIFT_NOSTRO_FLOW',
      origin: { name: 'Mumbai BDB', lat: 19.0657, lng: 72.8682 },
      destination: { name: 'New York SDNY', lat: 40.7128, lng: -74.0060 },
      volume_or_value: '$260M Chapter 11 Pool',
      description: 'Firestar Diamond US operations liquidation and asset disgorgement to Indian banking consortium.'
    },

    // ANOM Corridors
    {
      id: 'cor-anom-01',
      name: 'Pacific South America ➔ Port of Antwerp Maritime Line',
      case_id: 'CASE_ANOM_TROJAN',
      case_title: 'Operation Trojan Shield',
      category: 'MARITIME_CARGO',
      origin: { name: 'Port of Guayaquil', lat: -2.1894, lng: -79.8891 },
      destination: { name: 'Port of Antwerp', lat: 51.2858, lng: 4.3168 },
      volume_or_value: '8,200 kg Seized Cocaine',
      description: 'Refrigerated container vessels intercepted dockside in Antwerp via real-time decrypted ANOM messages.'
    },
    {
      id: 'cor-anom-02',
      name: 'San Diego FBI HQ ➔ Istanbul Telemetry Relay',
      case_id: 'CASE_ANOM_TROJAN',
      case_title: 'Operation Trojan Shield',
      category: 'ENCRYPTED_TELEMETRY',
      origin: { name: 'San Diego FBI Cyber', lat: 32.7157, lng: -117.1611 },
      destination: { name: 'Istanbul Bosphorus', lat: 41.0082, lng: 28.9784 },
      volume_or_value: '27 Million Decrypted Packets',
      description: 'Covert BCC packet routing of all ANOM handset messages to FBI decryption servers in third-country partner node.'
    },
    {
      id: 'cor-anom-03',
      name: 'Istanbul ➔ Port Botany Comanchero Pipeline',
      case_id: 'CASE_ANOM_TROJAN',
      case_title: 'Operation Trojan Shield',
      category: 'MARITIME_CARGO',
      origin: { name: 'Istanbul Command', lat: 41.0082, lng: 28.9784 },
      destination: { name: 'Sydney Port Botany', lat: -33.9740, lng: 151.2180 },
      volume_or_value: '3.7 Tonnes Narcotics / 224 Arrests',
      description: 'Australian Federal Police Operation Ironside tactical takedowns across Sydney and New South Wales.'
    },
    {
      id: 'cor-anom-04',
      name: 'Antwerp ➔ Dubai Money Laundering Bridge',
      case_id: 'CASE_ANOM_TROJAN',
      case_title: 'Operation Trojan Shield',
      category: 'SWIFT_NOSTRO_FLOW',
      origin: { name: 'Antwerp Logistics', lat: 51.2858, lng: 4.3168 },
      destination: { name: 'Dubai Crypto Hub', lat: 25.0805, lng: 55.1403 },
      volume_or_value: '€250M Crypto & Real Estate',
      description: 'European cartel proceeds converted to cryptocurrency and laundered into Gulf luxury assets.'
    },

    // Mundra Port Corridors
    {
      id: 'cor-mun-01',
      name: 'Kandahar ➔ Bandar Abbas Overland Smuggling Corridor',
      case_id: 'CASE_MUNDRA_TALC',
      case_title: 'Mundra Port 3,000kg Heroin',
      category: 'OVERLAND_SMUGGLING',
      origin: { name: 'Kandahar Lab', lat: 31.6289, lng: 65.7372 },
      destination: { name: 'Shahid Rajaee Port', lat: 27.1832, lng: 56.2666 },
      volume_or_value: '2,988.21 kg Heroin in 40T Talc',
      description: 'Heroin molded into semi-processed talc slabs transported by heavy truck convoy via Islam Qala/Zaranj to Iran.'
    },
    {
      id: 'cor-mun-02',
      name: 'Bandar Abbas ➔ Mundra Port Arabian Sea Maritime Route',
      case_id: 'CASE_MUNDRA_TALC',
      case_title: 'Mundra Port 3,000kg Heroin',
      category: 'MARITIME_CARGO',
      origin: { name: 'Shahid Rajaee Port', lat: 27.1832, lng: 56.2666 },
      destination: { name: 'Mundra Terminal', lat: 22.8390, lng: 69.7020 },
      volume_or_value: '₹21,000 Cr ($2.7 Billion)',
      description: 'Containers TGHU081920 & TIKU912048 shipped via feeder vessel across Arabian Sea and intercepted by DRI.'
    },
    {
      id: 'cor-mun-03',
      name: 'Mundra Port ➔ New Delhi National Distribution Grid',
      case_id: 'CASE_MUNDRA_TALC',
      case_title: 'Mundra Port 3,000kg Heroin',
      category: 'OVERLAND_SMUGGLING',
      origin: { name: 'Mundra Port Terminal', lat: 22.8390, lng: 69.7020 },
      destination: { name: 'New Delhi Safehouse', lat: 28.5677, lng: 77.2433 },
      volume_or_value: 'Northern India Wholesale Supply',
      description: 'Intended inland transit to cold storage in Alipur and Lajpat Nagar for cartel cut and packaging.'
    },
    {
      id: 'cor-mun-04',
      name: 'Mundra Port ➔ Vijayawada Aashi Trading Shell Nexus',
      case_id: 'CASE_MUNDRA_TALC',
      case_title: 'Mundra Port 3,000kg Heroin',
      category: 'SWIFT_NOSTRO_FLOW',
      origin: { name: 'Mundra Port Terminal', lat: 22.8390, lng: 69.7020 },
      destination: { name: 'Vijayawada Shell', lat: 16.5062, lng: 80.6480 },
      volume_or_value: 'Zero-History Shell Importer',
      description: 'Paperwork trail linking customs clearance at Mundra to fake import company in Andhra Pradesh.'
    }
  ], []);

  const scopedCorridors = useMemo(() => {
    if (selectedCaseId === 'CASE_ALL') return ALL_REAL_CORRIDORS;
    return ALL_REAL_CORRIDORS.filter(c => c.case_id === selectedCaseId);
  }, [ALL_REAL_CORRIDORS, selectedCaseId]);

  // ----------------------------------------------------
  // D3 100% FLAT EQUIRECTANGULAR 2D PROJECTION
  // ----------------------------------------------------
  const projection = useMemo(() => {
    return d3.geoEquirectangular()
      .scale(159)
      .translate([500, 275]);
  }, []);

  const pathGenerator = useMemo(() => {
    return d3.geoPath().projection(projection);
  }, [projection]);

  // Generate GeoJSON of world countries from TopoJSON
  const worldGeoJSON = useMemo(() => {
    try {
      const countries = topojson.feature(worldData as any, (worldData as any).objects.countries) as any;
      return countries.features || [];
    } catch (e) {
      console.error('Failed to parse TopoJSON world atlas', e);
      return [];
    }
  }, []);

  // Graticule for Flat Orthogonal Grid
  const graticulePath = useMemo(() => {
    try {
      const graticule = d3.geoGraticule10();
      return pathGenerator(graticule) || '';
    } catch (e) {
      return '';
    }
  }, [pathGenerator]);

  // ----------------------------------------------------
  // HIERARCHICAL MULTI-TIER MAP NODES ARCHITECTURE
  // Tier 1: World Level -> Exactly 1 unified bubble per country
  // Tier 2: Country Level -> State boundary polygons + 1 bubble per state
  // Tier 3: State/City Level -> City center pins + Individual tactical action points
  // ----------------------------------------------------

  // 1. Country-Level Master Beacons (World Tier)
  const countryMasterNodes = useMemo(() => {
    return scopedCountries.map(country => {
      const allCountryFacilities = allScopedFacilities.filter(f => f.country.toLowerCase() === country.name.toLowerCase());
      const proj = projection([country.lng, country.lat]);
      if (!proj || allCountryFacilities.length === 0) return null;

      const dominantAction = allCountryFacilities[0]?.actionMeta || ACTION_CATEGORIES.INTERCEPT_SEIZURE;

      return {
        country,
        id: `country-node-${country.id}`,
        name: country.name,
        code: country.code,
        flag: country.flag,
        count: allCountryFacilities.length,
        x: proj[0],
        y: proj[1],
        lng: country.lng,
        lat: country.lat,
        dominantAction,
        facilities: allCountryFacilities
      };
    }).filter(Boolean) as {
      country: GeoCountry;
      id: string;
      name: string;
      code: string;
      flag: string;
      count: number;
      x: number;
      y: number;
      lng: number;
      lat: number;
      dominantAction: ActionMeta;
      facilities: (GeoFacility & { country: string; state: string; city: string; actionMeta: ActionMeta })[];
    }[];
  }, [scopedCountries, allScopedFacilities, projection]);

  // 2. State-Level Centroid Nodes (Country Tier)
  const stateCentroidNodes = useMemo(() => {
    const activeCountries = selectedCountry ? [selectedCountry] : (zoomLevel >= 2.2 ? scopedCountries : []);
    const nodes: {
      state: GeoState;
      country: GeoCountry;
      id: string;
      name: string;
      count: number;
      x: number;
      y: number;
      lng: number;
      lat: number;
      dominantAction: ActionMeta;
      facilities: (GeoFacility & { country: string; state: string; city: string; actionMeta: ActionMeta })[];
    }[] = [];

    activeCountries.forEach(country => {
      country.states.forEach(state => {
        const stateFacilities = allScopedFacilities.filter(
          f => f.country.toLowerCase() === country.name.toLowerCase() && f.state.toLowerCase() === state.name.toLowerCase()
        );
        if (stateFacilities.length === 0) return;

        const proj = projection([state.lng, state.lat]);
        if (!proj) return;

        nodes.push({
          state,
          country,
          id: `state-node-${state.id}`,
          name: state.name,
          count: stateFacilities.length,
          x: proj[0],
          y: proj[1],
          lng: state.lng,
          lat: state.lat,
          dominantAction: stateFacilities[0]?.actionMeta || ACTION_CATEGORIES.INTERCEPT_SEIZURE,
          facilities: stateFacilities
        });
      });
    });

    return nodes;
  }, [selectedCountry, zoomLevel, scopedCountries, allScopedFacilities, projection]);

  // 3. Deep Dive Tactical Sites & City Pins (State/Facility Tier)
  const deepDiveFacilityPoints = useMemo(() => {
    if (!selectedState && zoomLevel < 3.8) return [];
    
    // Filter facilities belonging to selected state or active scoped area
    return allScopedFacilities.map(fac => {
      const proj = projection([fac.lng, fac.lat]);
      if (!proj) return null;
      return {
        ...fac,
        x: proj[0],
        y: proj[1]
      };
    }).filter(Boolean) as (GeoFacility & { country: string; state: string; city: string; actionMeta: ActionMeta; x: number; y: number })[];
  }, [selectedState, zoomLevel, allScopedFacilities, projection]);

  // Coordinate Pan & Zoom animation to specific [lng, lat]
  const zoomToCoordinate = useCallback((lng: number, lat: number, targetZoom: number) => {
    const coords = projection([lng, lat]);
    if (!coords) return;
    const [targetX, targetY] = coords;
    
    const newOffsetX = 500 - targetX * targetZoom;
    const newOffsetY = 275 - targetY * targetZoom;

    setZoomLevel(targetZoom);
    setPanOffset({ x: newOffsetX, y: newOffsetY });
  }, [projection]);

  // ----------------------------------------------------
  // HIERARCHICAL SELECTION & EXPANSION HANDLERS
  // ----------------------------------------------------
  const handleCountryClick = (country: GeoCountry) => {
    setSelectedCountry(country);
    setSelectedState(null);
    setSelectedCity(null);
    setSelectedFacility(null);
    zoomToCoordinate(country.lng, country.lat, country.zoomLevel);
  };

  const handleStateClick = (state: GeoState, country: GeoCountry) => {
    setSelectedCountry(country);
    setSelectedState(state);
    setSelectedCity(null);
    setSelectedFacility(null);
    zoomToCoordinate(state.lng, state.lat, state.zoomLevel);
  };

  const handleCityClick = (city: GeoCity, state: GeoState, country: GeoCountry) => {
    setSelectedCountry(country);
    setSelectedState(state);
    setSelectedCity(city);
    if (city.facilities.length > 0) {
      setSelectedFacility(city.facilities[0]);
    }
    zoomToCoordinate(city.lng, city.lat, 4.2);
  };

  const handleFacilityClick = (fac: GeoFacility, countryName?: string, stateName?: string, cityName?: string) => {
    setSelectedFacility(fac);
    setShowFacilityDossier(true);

    if (!selectedCountry) {
      const foundCountry = REAL_JURISDICTIONS.find(c => c.name === countryName || c.states.some(s => s.cities.some(ci => ci.facilities.some(f => f.id === fac.id))));
      if (foundCountry) {
        setSelectedCountry(foundCountry);
        const foundState = foundCountry.states.find(s => s.cities.some(ci => ci.facilities.some(f => f.id === fac.id)));
        if (foundState) {
          setSelectedState(foundState);
          const foundCity = foundState.cities.find(ci => ci.facilities.some(f => f.id === fac.id));
          if (foundCity) setSelectedCity(foundCity);
        }
      }
    }

    zoomToCoordinate(fac.lng, fac.lat, 4.5);

    // Link with Knowledge Graph
    const matchingNode = nodes.find(n => n.id === fac.id || n.label.toLowerCase().includes(fac.name.toLowerCase()));
    if (matchingNode) {
      onSelectNode(matchingNode);
    } else {
      const tempLocNode: LocationNode = {
        id: fac.id,
        label: fac.name,
        name: fac.name,
        type: 'Location',
        case_id: fac.case_id,
        risk_score: fac.risk_score,
        risk_level: fac.risk_score > 90 ? 'CRITICAL' : 'HIGH',
        community_id: 1,
        betweenness_centrality: 0.85,
        broker_score: 0.3,
        gae_anomaly_score: 0.88,
        lat: fac.lat,
        lng: fac.lng,
        location_type: fac.type === 'PORT' ? 'PortLanding' : fac.type === 'BANK' ? 'FinancialOffice' : fac.type === 'EXCHANGE' ? 'HawalaHub' : fac.type === 'TELECOM_HUB' ? 'CellTower' : 'Safehouse',
        city: cityName || 'City',
        country: countryName || 'Country',
        incident_count: 1,
        surveillance_level: 'High',
        created_at: new Date().toISOString(),
        last_active: new Date().toISOString(),
        notes: fac.operational_notes,
        tags: [fac.role, fac.status]
      };
      onSelectNode(tempLocNode);
    }
  };

  // Breadcrumb Reset Actions
  const handleResetToWorld = () => {
    setSelectedCountry(null);
    setSelectedState(null);
    setSelectedCity(null);
    setSelectedFacility(null);
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleResetToCountry = () => {
    if (!selectedCountry) return;
    setSelectedState(null);
    setSelectedCity(null);
    setSelectedFacility(null);
    zoomToCoordinate(selectedCountry.lng, selectedCountry.lat, selectedCountry.zoomLevel);
  };

  const handleResetToState = () => {
    if (!selectedState) return;
    setSelectedCity(null);
    setSelectedFacility(null);
    zoomToCoordinate(selectedState.lng, selectedState.lat, selectedState.zoomLevel);
  };

  // Dedicated India Fullscreen Zoom Focus
  const handleFocusIndia = useCallback(() => {
    const indCountry = REAL_JURISDICTIONS.find(c => c.code === 'IND');
    if (indCountry) {
      setSelectedCountry(indCountry);
      setSelectedState(null);
      setSelectedCity(null);
      setSelectedFacility(null);
      zoomToCoordinate(78.9629, 21.8, 2.9);
    }
  }, [zoomToCoordinate]);

  // Initial load auto-centering on India
  useEffect(() => {
    zoomToCoordinate(78.9629, 21.8, 2.9);
  }, [zoomToCoordinate]);

  // Mouse Drag Panning
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsPanning(true);
    setStartPan({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setPanOffset({
      x: e.clientX - startPan.x,
      y: e.clientY - startPan.y
    });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Wheel Zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomDelta = e.deltaY < 0 ? 0.2 : -0.2;
    setZoomLevel(prev => Math.min(Math.max(prev + zoomDelta, 0.7), 6.0));
  };

  // Zoom Button Controls
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.4, 6.0));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.4, 0.7));

  // ----------------------------------------------------
  // LEAFLET SATELLITE ENGINE SYNC
  // ----------------------------------------------------
  useEffect(() => {
    if (mapEngine !== 'SATELLITE') return;
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [25, 45],
        zoom: 3,
        zoomControl: false,
        attributionControl: false
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 18,
        subdomains: 'abcd',
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapInstanceRef.current = map;
      markersGroupRef.current = L.layerGroup().addTo(map);
      arcsGroupRef.current = L.layerGroup().addTo(map);
    }

    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;
    const arcsGroup = arcsGroupRef.current;

    if (!map || !markersGroup || !arcsGroup) return;

    markersGroup.clearLayers();
    arcsGroup.clearLayers();

    // Corridors on Leaflet
    scopedCorridors.forEach(cor => {
      const latlngs: [number, number][] = [
        [cor.origin.lat, cor.origin.lng],
        ...(cor.waypoints?.map(wp => [wp[1], wp[0]] as [number, number]) || []),
        [cor.destination.lat, cor.destination.lng]
      ];

      L.polyline(latlngs, {
        color: '#7E9B82',
        weight: 3.5,
        opacity: 0.85,
        dashArray: '8, 6'
      }).addTo(arcsGroup);
    });

    // Facilities on Leaflet colored strictly by action category
    allScopedFacilities.forEach(fac => {
      const marker = L.circleMarker([fac.lat, fac.lng], {
        radius: 7,
        fillColor: fac.actionMeta.color,
        color: '#243324',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.95
      }).addTo(markersGroup);

      marker.bindTooltip(`Action: ${fac.actionMeta.shortLabel}`, {
        permanent: false,
        direction: 'top'
      });

      marker.on('click', () => {
        handleFacilityClick(fac, fac.country, fac.state, fac.city);
      });
    });

  }, [mapEngine, scopedCorridors, allScopedFacilities]);

  return (
    <div className="w-full h-full flex flex-col bg-[#FBF9F5] text-[#243324] font-sans select-none overflow-hidden relative">
      
      {/* ----------------------------------------------------
          TOP FLOATING BREADCRUMB & REGIONAL EXPANSION BAR
      ---------------------------------------------------- */}
      <div className="absolute top-3 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Left: Interactive Hierarchical Breadcrumb Navigator */}
        <div className="flex items-center gap-1.5 pointer-events-auto bg-[#FBF9F5]/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#E5DFD3] shadow-xs text-xs font-semibold text-[#243324]">
          
          {/* Level 0: World Map */}
          <button
            onClick={handleResetToWorld}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all ${
              !selectedCountry
                ? 'bg-[#243324] text-[#FBF9F5] shadow-xs'
                : 'text-[#4A5D4E] hover:text-[#243324] hover:bg-[#EFECE4]'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>Flat 2D World Map</span>
          </button>

          {/* Level 1: Country */}
          {selectedCountry && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-[#A39B8B] shrink-0" />
              <button
                onClick={handleResetToCountry}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition-all ${
                  selectedCountry && !selectedState
                    ? 'bg-[#243324] text-[#FBF9F5] shadow-xs'
                    : 'text-[#4A5D4E] hover:text-[#243324] hover:bg-[#EFECE4]'
                }`}
              >
                <span>{selectedCountry.flag}</span>
                <span>{selectedCountry.name}</span>
              </button>
            </>
          )}

          {/* Level 2: State / Province */}
          {selectedState && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-[#A39B8B] shrink-0" />
              <button
                onClick={handleResetToState}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition-all ${
                  selectedState && !selectedCity
                    ? 'bg-[#243324] text-[#FBF9F5] shadow-xs'
                    : 'text-[#4A5D4E] hover:text-[#243324] hover:bg-[#EFECE4]'
                }`}
              >
                <MapPin className="w-3 h-3 text-[#7E9B82]" />
                <span>{selectedState.name}</span>
              </button>
            </>
          )}

          {/* Level 3: City / Facility */}
          {selectedCity && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-[#A39B8B] shrink-0" />
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E5DFD3] text-[#243324]">
                <Building2 className="w-3 h-3 text-[#243324]" />
                <span>{selectedCity.name}</span>
              </div>
            </>
          )}

        </div>

        {/* Center / Right: Quick Jurisdiction Expansion Pills + Engine Switcher */}
        <div className="flex items-center gap-2 pointer-events-auto">
          
          {/* Dedicated India Fullscreen Focus Button */}
          <button
            onClick={handleFocusIndia}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs ${
              selectedCountry?.code === 'IND'
                ? 'bg-[#7E9B82] text-[#FBF9F5] ring-2 ring-[#243324]'
                : 'bg-[#243324] text-[#FBF9F5] hover:bg-[#344834]'
            }`}
            title="Focus India Fullscreen: Explore States, Cities & Clustered Facilities"
          >
            <span>🇮🇳</span>
            <span>Focus India (Deep Dive)</span>
          </button>

          {/* Quick Country Expand Pills */}
          <div className="hidden xl:flex items-center gap-1 bg-[#FBF9F5]/95 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-[#E5DFD3] shadow-xs text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#7E9B82] mr-1">Expand:</span>
            {scopedCountries.slice(0, 6).map(country => (
              <button
                key={country.id}
                onClick={() => handleCountryClick(country)}
                className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                  selectedCountry?.id === country.id
                    ? 'bg-[#243324] text-[#FBF9F5]'
                    : 'hover:bg-[#EFECE4] text-[#243324]'
                }`}
              >
                {country.flag} {country.name}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="flex items-center bg-[#FBF9F5]/95 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-[#E5DFD3] shadow-xs">
            <Search className="w-3.5 h-3.5 text-[#7E9B82] mr-1.5 shrink-0" />
            <input
              type="text"
              placeholder="Search region or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-[#243324] placeholder-[#8A9A8C] focus:outline-none w-24 sm:w-36"
            />
          </div>

          {/* Engine Mode */}
          <div className="flex items-center bg-[#FBF9F5]/95 backdrop-blur-md p-1 rounded-full border border-[#E5DFD3] shadow-xs">
            <button
              onClick={() => setMapEngine('VECTOR')}
              className={`px-2 py-0.5 rounded-full text-[11px] font-semibold transition-all ${
                mapEngine === 'VECTOR' ? 'bg-[#243324] text-[#FBF9F5]' : 'text-[#64748B]'
              }`}
            >
              Flat 2D
            </button>
            <button
              onClick={() => setMapEngine('SATELLITE')}
              className={`px-2 py-0.5 rounded-full text-[11px] font-semibold transition-all ${
                mapEngine === 'SATELLITE' ? 'bg-[#243324] text-[#FBF9F5]' : 'text-[#64748B]'
              }`}
            >
              GIS
            </button>
          </div>

          {/* Zoom Buttons */}
          <div className="flex items-center bg-[#FBF9F5]/95 backdrop-blur-md p-1 rounded-full border border-[#E5DFD3] shadow-xs">
            <button
              onClick={handleZoomIn}
              title="Zoom In"
              className="p-1.5 text-[#243324] hover:bg-[#EFECE4] rounded-full transition-colors"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomOut}
              title="Zoom Out"
              className="p-1.5 text-[#243324] hover:bg-[#EFECE4] rounded-full transition-colors"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetToWorld}
              title="Reset to Full World View"
              className="p-1.5 text-[#243324] hover:bg-[#EFECE4] rounded-full transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* ----------------------------------------------------
          MAIN CANVAS CONTAINER
      ---------------------------------------------------- */}
      <div className="flex-1 w-full h-full relative overflow-hidden">
        
        {mapEngine === 'VECTOR' ? (
          <div 
            className="w-full h-full cursor-grab active:cursor-grabbing relative overflow-hidden bg-[#FBF9F5]"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          >
            <svg
              viewBox="0 0 1000 550"
              className="w-full h-full"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* Sage Green Corridor Linear Gradient */}
                <linearGradient id="flat-sage-corridor" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7E9B82" stopOpacity="0.85" />
                  <stop offset="50%" stopColor="#5D7E62" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#7E9B82" stopOpacity="0.85" />
                </linearGradient>

                {/* Flat Rectangular Map Oceanic Grid Pattern */}
                <pattern id="flat-ocean-grid" width="25" height="25" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="25" y2="0" stroke="#EFECE4" strokeWidth="0.5" />
                  <line x1="0" y1="0" x2="0" y2="25" stroke="#EFECE4" strokeWidth="0.5" />
                  <circle cx="12.5" cy="12.5" r="0.4" fill="#DCD5C5" opacity="0.6" />
                </pattern>
              </defs>

              {/* Pan & Zoom Master Group */}
              <g transform={`translate(${panOffset.x}, ${panOffset.y}) scale(${zoomLevel})`}>
                
                {/* 1. Flat Oceanic Coordinate Grid */}
                <rect x="-600" y="-300" width="2200" height="1200" fill="url(#flat-ocean-grid)" pointerEvents="none" />

                {/* Graticule Orthogonal Lat/Lon Lines */}
                {showGraticule && (
                  <path
                    d={graticulePath}
                    fill="none"
                    stroke="#E5DFD3"
                    strokeWidth="0.6"
                    strokeDasharray="2 3"
                    pointerEvents="none"
                  />
                )}

                {/* Flat Equator & Prime Meridian */}
                <line x1="-500" y1="275" x2="1500" y2="275" stroke="#D8D1C3" strokeWidth="0.8" strokeDasharray="5 5" />
                <line x1="500" y1="-300" x2="500" y2="900" stroke="#D8D1C3" strokeWidth="0.8" strokeDasharray="5 5" />

                {/* 2. FLAT RECTANGULAR WORLD COUNTRY LANDMASSES */}
                <g className="world-flat-countries">
                  {worldGeoJSON.map((feature: any, idx: number) => {
                    const pathString = pathGenerator(feature) || '';
                    const countryName = feature.properties?.name || 'Country';
                    const isMatchedCountry = scopedCountries.some(c => c.name.toLowerCase() === countryName.toLowerCase());
                    const isSelected = selectedCountry?.name.toLowerCase() === countryName.toLowerCase();
                    const isHovered = hoveredCountryName === countryName;

                    return (
                      <path
                        key={`country-${feature.id || idx}`}
                        d={pathString}
                        fill={
                          isSelected
                            ? '#E8DFC9'
                            : isMatchedCountry
                            ? isHovered
                              ? '#EFE7D8'
                              : '#F4EFE6'
                            : isHovered
                            ? '#EFEAE2'
                            : '#F9F7F2'
                        }
                        stroke={isMatchedCountry ? '#243324' : '#D1C9BC'}
                        strokeWidth={isSelected ? '1.5' : isMatchedCountry ? '0.95' : '0.45'}
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        className="transition-colors duration-150 cursor-pointer"
                        onMouseEnter={() => setHoveredCountryName(countryName)}
                        onMouseLeave={() => setHoveredCountryName(null)}
                        onClick={() => {
                          const matched = scopedCountries.find(c => c.name.toLowerCase() === countryName.toLowerCase());
                          if (matched) {
                            handleCountryClick(matched);
                          }
                        }}
                      >
                        <title>{`${countryName}${isMatchedCountry ? ' (Active Operational Jurisdiction - Click to Expand)' : ''}`}</title>
                      </path>
                    );
                  })}
                </g>

                {/* 3. STATE / PROVINCE BOUNDARY EXPANSION OVERLAYS & POLYGONS */}
                {(selectedCountry || zoomLevel >= 2.2) && (
                  <g className="state-expansion-polygons">
                    {(selectedCountry ? selectedCountry.states : scopedCountries.flatMap(c => c.states)).map(state => {
                      const stateCoord = projection([state.lng, state.lat]);
                      if (!stateCoord) return null;
                      const isStateSelected = selectedState?.id === state.id;
                      const parentCountry = selectedCountry || scopedCountries.find(c => c.states.some(s => s.id === state.id));

                      // Generate SVG polygon points from real coordinates
                      let pointsString = '';
                      if (state.boundaryPolygon && state.boundaryPolygon.length > 0) {
                        pointsString = state.boundaryPolygon
                          .map(pt => {
                            const p = projection(pt);
                            return p ? `${p[0]},${p[1]}` : '';
                          })
                          .filter(Boolean)
                          .join(' ');
                      }

                      return (
                        <g 
                          key={state.id} 
                          className="cursor-pointer group" 
                          onClick={() => {
                            if (parentCountry) {
                              handleStateClick(state, parentCountry);
                            }
                          }}
                        >
                          {pointsString ? (
                            <polygon
                              points={pointsString}
                              fill={isStateSelected ? '#7E9B82' : '#E8DFC9'}
                              fillOpacity={isStateSelected ? '0.35' : '0.12'}
                              stroke={isStateSelected ? '#243324' : '#7E9B82'}
                              strokeWidth={isStateSelected ? '1.8' : '0.75'}
                              strokeDasharray={isStateSelected ? '' : '3 2'}
                              className="transition-all duration-150 group-hover:fill-opacity-30 group-hover:stroke-[#243324]"
                            >
                              <title>{`${state.name} (${state.cities.length} Cities, ${state.cities.reduce((acc, c) => acc + c.facilities.length, 0)} Tactical Sites) - Click to Zoom & Expand`}</title>
                            </polygon>
                          ) : null}
                        </g>
                      );
                    })}
                  </g>
                )}

                {/* 4. TRANSNATIONAL GEODESIC CORRIDORS */}
                {showCorridors && (
                  <g className="flat-transnational-corridors">
                    {scopedCorridors.map(cor => {
                      const origCoord = projection([cor.origin.lng, cor.origin.lat]);
                      const destCoord = projection([cor.destination.lng, cor.destination.lat]);
                      if (!origCoord || !destCoord) return null;

                      const dx = destCoord[0] - origCoord[0];
                      const dy = destCoord[1] - origCoord[1];
                      const dist = Math.hypot(dx, dy);
                      
                      let midX = (origCoord[0] + destCoord[0]) / 2;
                      let midY = (origCoord[1] + destCoord[1]) / 2 - dist * 0.16;

                      if (cor.waypoints && cor.waypoints.length > 0) {
                        const wpProj = projection([cor.waypoints[0][0], cor.waypoints[0][1]]);
                        if (wpProj) {
                          midX = wpProj[0];
                          midY = wpProj[1];
                        }
                      }

                      const pathData = `M ${origCoord[0]},${origCoord[1]} Q ${midX},${midY} ${destCoord[0]},${destCoord[1]}`;

                      return (
                        <g key={cor.id} className="corridor-path group cursor-pointer">
                          {/* Translucent Buffer Ribbon */}
                          <path
                            d={pathData}
                            fill="none"
                            stroke="#7E9B82"
                            strokeWidth="4"
                            strokeOpacity="0.2"
                            strokeLinecap="round"
                          />

                          {/* Flat Striped Route */}
                          <path
                            d={pathData}
                            fill="none"
                            stroke="url(#flat-sage-corridor)"
                            strokeWidth="1.8"
                            strokeDasharray={cor.category === 'ENCRYPTED_TELEMETRY' ? '3, 3' : '6, 3'}
                            className={showPulse ? 'animate-pulse' : ''}
                            strokeLinecap="round"
                          />

                          {/* Route Waypoint Indicator */}
                          <circle
                            cx={midX}
                            cy={midY}
                            r="2"
                            fill="#7E9B82"
                            stroke="#243324"
                            strokeWidth="0.8"
                          />
                        </g>
                      );
                    })}
                  </g>
                )}

                {/* ============================================================
                    TIER 1: WORLD LEVEL COUNTRY MASTER NODES (zoomLevel < 2.2)
                    Exactly 1 unified circular beacon per country
                ============================================================ */}
                {!selectedCountry && zoomLevel < 2.2 && (
                  <g className="world-tier-country-nodes">
                    {countryMasterNodes.map(node => {
                      const isIndia = node.code === 'IND' || node.name === 'India';
                      return (
                        <g
                          key={node.id}
                          transform={`translate(${node.x}, ${node.y})`}
                          className="cursor-pointer group"
                          onClick={() => {
                            if (isIndia) {
                              handleFocusIndia();
                            } else {
                              handleCountryClick(node.country);
                            }
                          }}
                        >
                          <title>{`${node.flag} ${node.name} (${node.count} Tactical Sites) - Click to Zoom & Expand`}</title>

                          {/* Outer Action Halo */}
                          <circle
                            r="8"
                            fill={node.dominantAction.haloColor}
                            stroke={node.dominantAction.color}
                            strokeWidth="1.2"
                            className="transition-all group-hover:scale-125"
                          />

                          {/* Inner High Contrast Badge */}
                          <circle
                            r="5.5"
                            fill="#243324"
                            stroke="#FBF9F5"
                            strokeWidth="0.8"
                          />

                          {/* Count text */}
                          <text
                            x="0"
                            y="2"
                            textAnchor="middle"
                            fontSize="5.5"
                            fontWeight="800"
                            fill="#FBF9F5"
                            className="font-mono select-none pointer-events-none"
                          >
                            {node.count}
                          </text>

                          {/* Minimal Flag Tag */}
                          <g transform="translate(0, 10)" className="pointer-events-none">
                            <rect
                              x="-14"
                              y="-4"
                              width="28"
                              height="8"
                              rx="4"
                              fill="#243324"
                              fillOpacity="0.9"
                              stroke="#FBF9F5"
                              strokeWidth="0.5"
                            />
                            <text
                              x="0"
                              y="2"
                              textAnchor="middle"
                              fontSize="5"
                              fontWeight="700"
                              fill="#FBF9F5"
                              className="font-sans select-none"
                            >
                              {node.flag} {node.code}
                            </text>
                          </g>
                        </g>
                      );
                    })}
                  </g>
                )}

                {/* ============================================================
                    TIER 2: COUNTRY / STATE CENTROID NODES
                    (zoomLevel 2.2 - 3.8 OR when Country is selected)
                    Renders 1 clean compact micro-badge per State centroid
                ============================================================ */}
                {(selectedCountry || zoomLevel >= 2.2) && (!selectedState && zoomLevel < 3.8) && (
                  <g className="state-tier-centroid-nodes">
                    {stateCentroidNodes.map(node => {
                      const isSelected = selectedState?.id === node.state.id;
                      const isHovered = hoveredStateId === node.state.id;
                      return (
                        <g
                          key={node.id}
                          transform={`translate(${node.x}, ${node.y})`}
                          className="cursor-pointer group"
                          onMouseEnter={() => setHoveredStateId(node.state.id)}
                          onMouseLeave={() => setHoveredStateId(null)}
                          onClick={() => handleStateClick(node.state, node.country)}
                        >
                          <title>{`${node.name}, ${node.country.name} (${node.count} Tactical Sites) - Click to Zoom into State`}</title>

                          {/* Outer Action Halo */}
                          <circle
                            r={isHovered ? 7.5 : 5.5}
                            fill={node.dominantAction.haloColor}
                            stroke={isSelected ? '#243324' : node.dominantAction.color}
                            strokeWidth={isSelected ? '1.5' : '0.9'}
                            className="transition-all group-hover:scale-125"
                          />

                          {/* Inner Badge */}
                          <circle
                            r={isHovered ? 5.2 : 4.0}
                            fill={isSelected ? '#7E9B82' : '#243324'}
                            stroke="#FBF9F5"
                            strokeWidth="0.7"
                          />

                          {/* Count text */}
                          <text
                            x="0"
                            y="1.8"
                            textAnchor="middle"
                            fontSize={isHovered ? '5.5' : '4.8'}
                            fontWeight="800"
                            fill="#FBF9F5"
                            className="font-mono select-none pointer-events-none"
                          >
                            {node.count}
                          </text>

                          {/* Non-overlapping floating tooltip revealed ONLY on hover */}
                          {isHovered && (
                            <g transform="translate(0, -9)" className="pointer-events-none">
                              <rect
                                x="-24"
                                y="-5"
                                width="48"
                                height="10"
                                rx="5"
                                fill="#243324"
                                fillOpacity="0.96"
                                stroke="#FBF9F5"
                                strokeWidth="0.6"
                              />
                              <text
                                x="0"
                                y="2.2"
                                textAnchor="middle"
                                fontSize="5.5"
                                fontWeight="700"
                                fill="#FBF9F5"
                                className="font-sans select-none"
                              >
                                {node.name} ({node.count})
                              </text>
                            </g>
                          )}
                        </g>
                      );
                    })}
                  </g>
                )}

                {/* ============================================================
                    TIER 3: STATE / CITY & TACTICAL FACILITY DEEP DIVE
                    (zoomLevel >= 3.8 OR when State is selected)
                    Renders City Pins and Small Tactical Action-Coded Facility Points
                ============================================================ */}
                {(selectedState || zoomLevel >= 3.8) && (
                  <g className="deep-dive-cities-and-facilities">
                    
                    {/* A. Clickable City Pins */}
                    {(selectedState ? selectedState.cities : selectedCountry ? selectedCountry.states.flatMap(s => s.cities) : scopedCountries.flatMap(c => c.states.flatMap(s => s.cities))).map(city => {
                      const cityCoords = projection([city.lng, city.lat]);
                      if (!cityCoords) return null;
                      const [cx, cy] = cityCoords;
                      const isCitySelected = selectedCity?.id === city.id;
                      const isCityHovered = hoveredCity?.id === city.id;
                      const parentCountry = selectedCountry || scopedCountries.find(c => c.states.some(s => s.cities.some(ci => ci.id === city.id)));
                      const parentState = selectedState || parentCountry?.states.find(s => s.cities.some(ci => ci.id === city.id));

                      return (
                        <g
                          key={`city-${city.id}`}
                          transform={`translate(${cx}, ${cy})`}
                          className="cursor-pointer group"
                          onMouseEnter={() => setHoveredCity(city)}
                          onMouseLeave={() => setHoveredCity(null)}
                          onClick={() => {
                            if (parentState && parentCountry) {
                              handleCityClick(city, parentState, parentCountry);
                            }
                          }}
                        >
                          <title>{`${city.name}, ${city.state} (${city.facilities.length} Tactical Sites) - Click to Focus City`}</title>

                          {/* Tiny subtle city dot */}
                          <circle
                            r="1.6"
                            fill={isCitySelected ? '#243324' : '#FBF9F5'}
                            stroke="#243324"
                            strokeWidth="0.6"
                          />

                          {/* Compact City Label on hover or selection */}
                          {(isCitySelected || isCityHovered || zoomLevel >= 4.5) && (
                            <g transform="translate(0, -6)" className="pointer-events-none">
                              <rect
                                x="-16"
                                y="-3.5"
                                width="32"
                                height="7"
                                rx="3.5"
                                fill={isCitySelected ? '#243324' : '#FBF9F5'}
                                fillOpacity="0.94"
                                stroke={isCitySelected ? '#1A251A' : '#7E9B82'}
                                strokeWidth="0.5"
                              />
                              <text
                                x="0"
                                y="1.8"
                                textAnchor="middle"
                                fontSize="4.8"
                                fontWeight="700"
                                fill={isCitySelected ? '#FBF9F5' : '#243324'}
                                className="font-sans select-none"
                              >
                                {city.name}
                              </text>
                            </g>
                          )}
                        </g>
                      );
                    })}

                    {/* B. Individual Tactical Action-Colored Points (Small & Sharp) */}
                    {deepDiveFacilityPoints.map(fac => {
                      const isSelected = selectedFacility?.id === fac.id;
                      const isHovered = hoveredFacility?.id === fac.id;
                      const actionColor = fac.actionMeta.color;

                      return (
                        <g
                          key={`facility-point-${fac.id}`}
                          transform={`translate(${fac.x}, ${fac.y})`}
                          className="cursor-pointer group"
                          onMouseEnter={() => setHoveredFacility(fac)}
                          onMouseLeave={() => setHoveredFacility(null)}
                          onClick={() => handleFacilityClick(fac, fac.country, fac.state, fac.city)}
                        >
                          <title>{`[${fac.actionMeta.label}] ${fac.name} (${fac.city}, ${fac.state})`}</title>

                          {/* Radar Ping on Active / Selected Points */}
                          {(isSelected || isHovered) && (
                            <circle
                              r={isSelected ? 8 : 6.5}
                              fill="none"
                              stroke={actionColor}
                              strokeWidth="0.8"
                              opacity="0.5"
                              className="animate-ping"
                            />
                          )}

                          {/* Outer Halo Tint */}
                          <circle
                            r={isSelected ? 5.2 : isHovered ? 4.5 : 3.6}
                            fill={fac.actionMeta.haloColor}
                            stroke={actionColor}
                            strokeWidth={isSelected ? 1.4 : 0.8}
                            className="transition-all group-hover:scale-125"
                          />

                          {/* Inner High-Contrast Ring */}
                          <circle
                            r={isSelected ? 3.0 : isHovered ? 2.6 : 2.0}
                            fill="#FBF9F5"
                            stroke="#243324"
                            strokeWidth="0.6"
                          />

                          {/* Core Solid Action Color Dot */}
                          <circle
                            r={isSelected ? 1.8 : isHovered ? 1.5 : 1.2}
                            fill={actionColor}
                          />
                        </g>
                      );
                    })}
                  </g>
                )}

              </g>
            </svg>
          </div>
        ) : (
          <div ref={mapContainerRef} className="w-full h-full z-10" />
        )}

        {/* ----------------------------------------------------
            FLOATING ACTION CATEGORY COLOR LEGEND
        ---------------------------------------------------- */}
        {showLegend && (
          <div className="absolute bottom-4 left-4 z-20 bg-[#FBF9F5]/96 backdrop-blur-md p-3 rounded-xl border border-[#E5DFD3] shadow-md max-w-xs text-xs">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E5DFD3]">
              <div className="flex items-center gap-1.5 font-bold text-[#243324]">
                <Activity className="w-3.5 h-3.5 text-[#7E9B82]" />
                <span>Action Color Index</span>
              </div>
              <button
                onClick={() => setSelectedActionFilter('ALL')}
                className={`text-[10px] px-1.5 py-0.5 rounded font-semibold transition-colors ${
                  selectedActionFilter === 'ALL'
                    ? 'bg-[#243324] text-[#FBF9F5]'
                    : 'text-[#64748B] hover:text-[#243324]'
                }`}
              >
                All Actions
              </button>
            </div>

            <div className="space-y-1.5">
              {Object.values(ACTION_CATEGORIES).map(cat => {
                const isActive = selectedActionFilter === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedActionFilter(isActive ? 'ALL' : cat.key)}
                    className={`w-full flex items-center justify-between p-1.5 rounded-lg text-left transition-all ${
                      isActive
                        ? `${cat.bgClass} ${cat.borderClass} border font-semibold`
                        : 'hover:bg-[#EFECE4]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className={`text-[11px] ${isActive ? cat.textClass : 'text-[#243324]'}`}>
                        {cat.label}
                      </span>
                    </div>

                    {isActive && (
                      <CheckCircle2 className={`w-3.5 h-3.5 ${cat.textClass}`} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ----------------------------------------------------
            EXPANDED TACTICAL FACILITY DOSSIER DRAWER
        ---------------------------------------------------- */}
        {selectedFacility && showFacilityDossier && (
          <div className="absolute top-16 right-4 w-84 sm:w-96 max-h-[82%] z-30 bg-[#FBF9F5]/98 backdrop-blur-md rounded-xl border border-[#DCD5C5] shadow-lg flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-4 duration-200">
            
            {/* Header with Action Color Accent */}
            <div 
              className="p-3.5 text-[#FBF9F5] flex items-start justify-between"
              style={{ backgroundColor: '#243324' }}
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span 
                    className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-white shadow-xs"
                    style={{ backgroundColor: getFacilityActionMeta(selectedFacility).color }}
                  >
                    {getFacilityActionMeta(selectedFacility).shortLabel}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-[#FBF9F5]/15 rounded text-[#FBF9F5] font-mono">
                    {selectedFacility.type}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-sm leading-snug mt-1.5 text-[#FBF9F5]">
                  {selectedFacility.name}
                </h3>
                <p className="text-[11px] text-[#A3B8A6] mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {selectedFacility.address}
                </p>
              </div>

              <button
                onClick={() => setSelectedFacility(null)}
                className="p-1 text-[#A3B8A6] hover:text-[#FBF9F5] hover:bg-[#FBF9F5]/10 rounded-md transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-3.5 space-y-3 overflow-y-auto text-xs text-[#243324]">
              
              {/* Action Classification Banner */}
              <div 
                className="p-2.5 rounded-lg border flex items-center gap-2.5"
                style={{ 
                  backgroundColor: getFacilityActionMeta(selectedFacility).haloColor.replace('0.35', '0.12'),
                  borderColor: getFacilityActionMeta(selectedFacility).color 
                }}
              >
                <span 
                  className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                  style={{ backgroundColor: getFacilityActionMeta(selectedFacility).color }}
                />
                <div>
                  <div className="font-bold text-[11px] text-[#243324]">
                    {getFacilityActionMeta(selectedFacility).label}
                  </div>
                  <div className="text-[10px] text-[#4A5D4E]">
                    {getFacilityActionMeta(selectedFacility).description}
                  </div>
                </div>
              </div>

              {/* Risk & Role Pill Matrix */}
              <div className="grid grid-cols-3 gap-2 bg-[#EFECE4] p-2.5 rounded-lg border border-[#E5DFD3]">
                <div>
                  <span className="text-[9px] uppercase font-bold text-[#6B7E6F] block">Risk Score</span>
                  <span className={`text-sm font-mono font-bold ${
                    selectedFacility.risk_score >= 95 ? 'text-red-700' : 'text-[#243324]'
                  }`}>
                    {selectedFacility.risk_score}/100
                  </span>
                </div>

                <div>
                  <span className="text-[9px] uppercase font-bold text-[#6B7E6F] block">Role</span>
                  <span className="text-xs font-semibold text-[#243324] block truncate">
                    {selectedFacility.role}
                  </span>
                </div>

                <div>
                  <span className="text-[9px] uppercase font-bold text-[#6B7E6F] block">Status</span>
                  <span className="text-xs font-semibold text-emerald-800 block truncate">
                    {selectedFacility.status}
                  </span>
                </div>
              </div>

              {/* Seizure Metric */}
              <div className="bg-[#FAF3E0] p-2.5 rounded-lg border border-[#E8DCC4]">
                <div className="text-[10px] font-bold uppercase text-[#8A6D3B] flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  Primary Seizure & Forensic Metric
                </div>
                <div className="text-xs font-bold text-[#243324] mt-0.5">
                  {selectedFacility.seizure_metric}
                </div>
              </div>

              {/* Operational & Evidence Details */}
              <div>
                <div className="text-[10px] font-bold uppercase text-[#6B7E6F] mb-1">Operational Overview</div>
                <p className="text-[11px] text-[#3A4D3E] leading-relaxed bg-[#F6F3EC] p-2 rounded border border-[#E8E2D5]">
                  {selectedFacility.operational_notes}
                </p>
              </div>

              <div>
                <div className="text-[10px] font-bold uppercase text-[#6B7E6F] mb-1">Evidence & Intercept Findings</div>
                <p className="text-[11px] text-[#3A4D3E] leading-relaxed bg-[#F6F3EC] p-2 rounded border border-[#E8E2D5]">
                  {selectedFacility.evidence_summary}
                </p>
              </div>

              {/* Geographic Precision */}
              <div className="flex items-center justify-between text-[10px] text-[#7E9B82] pt-1 border-t border-[#E5DFD3] font-mono">
                <span>WGS84 Coordinates:</span>
                <span>{selectedFacility.lat.toFixed(4)}°N, {selectedFacility.lng.toFixed(4)}°E</span>
              </div>

            </div>

            {/* Footer Action */}
            <div className="p-2.5 bg-[#EFECE4] border-t border-[#E5DFD3] flex items-center justify-between">
              <button
                onClick={() => {
                  const node = nodes.find(n => n.id === selectedFacility.id || n.label.toLowerCase().includes(selectedFacility.name.toLowerCase()));
                  if (node) onSelectNode(node);
                }}
                className="w-full py-1.5 bg-[#243324] hover:bg-[#1A251A] text-[#FBF9F5] rounded-md font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>Inspect in Knowledge Graph</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        )}

      </div>

      {/* ----------------------------------------------------
          BOTTOM STATUS & JURISDICTION SUMMARY RIBBON
      ---------------------------------------------------- */}
      <div className="bg-[#243324] text-[#FBF9F5] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-[#1C281C] z-20">
        
        {/* Left: Active Territory & Case Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-semibold text-[13px] text-[#FBF9F5]">
              {selectedCountry ? `${selectedCountry.flag} ${selectedCountry.name}` : 'Transnational Global Grid'}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-[#A3B8A6]">
            <span>•</span>
            <span>{selectedCaseId === 'CASE_ALL' ? 'Combined Matrix (3 Cases)' : currentCase.title}</span>
            <span>•</span>
            <span>{allScopedFacilities.length} Points Filtered</span>
          </div>
        </div>

        {/* Center: Selected State / City if drilled down */}
        {selectedState && (
          <div className="hidden md:flex items-center gap-1.5 text-[11px] bg-[#314231] px-2.5 py-1 rounded-full text-[#E2ECE3]">
            <MapPin className="w-3 h-3 text-[#7E9B82]" />
            <span>State Level: <strong>{selectedState.name}</strong></span>
            {selectedCity && <span>➔ {selectedCity.name}</span>}
          </div>
        )}

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={() => setShowLegend(!showLegend)}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              showLegend ? 'bg-[#3A4D3A] text-emerald-300' : 'text-[#8A9A8C] hover:text-[#FBF9F5]'
            }`}
          >
            Legend: {showLegend ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={() => setShowCorridors(!showCorridors)}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              showCorridors ? 'bg-[#3A4D3A] text-emerald-300' : 'text-[#8A9A8C] hover:text-[#FBF9F5]'
            }`}
          >
            Corridors: {showCorridors ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={() => setShowGraticule(!showGraticule)}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              showGraticule ? 'bg-[#3A4D3A] text-emerald-300' : 'text-[#8A9A8C] hover:text-[#FBF9F5]'
            }`}
          >
            Grid: {showGraticule ? 'ON' : 'OFF'}
          </button>

          <div className="h-3.5 w-px bg-[#3A4D3A]" />

          <span className="font-mono text-[11px] text-[#A3B8A6]">
            Zoom: {zoomLevel.toFixed(1)}x
          </span>
        </div>

      </div>

    </div>
  );
};

