import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Navigation, 
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
  Filter,
  CheckCircle2,
  Building2,
  Ship,
  Anchor,
  Globe2,
  LocateFixed,
  Search,
  ArrowRight,
  X,
  Info,
  Clock,
  Sparkles,
  Flame,
  Layers,
  Activity
} from 'lucide-react';
import { POLENode, POLEEdge, LocationNode, CaseId } from '../types';
import { REAL_CASE_PROFILES } from '../data/realCasesData';
import { 
  ALL_GIS_PROFILES, 
  GISJurisdictionProfile, 
  AdministrativeRegion, 
  TacticalTarget, 
  CrimeHotspot,
  NaturalWaterway 
} from '../data/gisGeometry';

interface GeoMapProps {
  nodes: POLENode[];
  edges: POLEEdge[];
  selectedNodeId: string | null;
  onSelectNode: (node: POLENode | null) => void;
  timelineStartDate?: string;
  timelineEndDate?: string;
  selectedCaseId?: CaseId;
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

export const CRIME_TYPE_META: Record<string, { label: string; color: string; bg: string }> = {
  ALL: { label: 'All Crime Types', color: '#DC2626', bg: 'bg-red-100' },
  NARCOTICS: { label: 'Narcotics & Contraband', color: '#DC2626', bg: 'bg-red-100' },
  BANK_FRAUD: { label: 'Financial / SWIFT Fraud', color: '#2563EB', bg: 'bg-blue-100' },
  HAWALA: { label: 'Hawala & Shell Invoicing', color: '#D97706', bg: 'bg-amber-100' },
  CARGO_SMUGGLING: { label: 'Border Cargo Smuggling', color: '#7C3AED', bg: 'bg-purple-100' },
  EXTRADITION: { label: 'Extradition & Fugitive Target', color: '#E11D48', bg: 'bg-rose-100' },
  CYBER_CRIME: { label: 'Cyber Forensics & Bypasses', color: '#0891B2', bg: 'bg-cyan-100' }
};

export const GeoMap: React.FC<GeoMapProps> = ({
  nodes,
  edges,
  selectedNodeId,
  onSelectNode,
  timelineStartDate,
  timelineEndDate,
  selectedCaseId: propCaseId
}) => {
  // Jurisdiction Selector: defaults to GBR_LONDON (as in user reference image) with easy 1-click switch to India (IND), Global World (WORLD), Dubai (ARE_DUBAI)
  const [activeJurisdictionKey, setActiveJurisdictionKey] = useState<string>('IND');
  
  const currentProfile: GISJurisdictionProfile = useMemo(() => {
    return ALL_GIS_PROFILES[activeJurisdictionKey] || ALL_GIS_PROFILES['IND'];
  }, [activeJurisdictionKey]);

  // Selected administrative region (e.g. Westminster, Gujarat, Maharashtra, Deira)
  const [selectedRegionId, setSelectedRegionId] = useState<string>(currentProfile.defaultSelectedRegionId);
  const [hoveredRegionId, setHoveredRegionId] = useState<string | null>(null);

  // Selected tactical target point
  const [selectedTarget, setSelectedTarget] = useState<TacticalTarget | null>(null);
  const [hoveredTarget, setHoveredTarget] = useState<TacticalTarget | null>(null);

  // Heat Map Layer State
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);
  const [heatmapOpacity, setHeatmapOpacity] = useState<number>(0.78);
  const [heatmapBlur, setHeatmapBlur] = useState<number>(18);
  const [selectedCrimeType, setSelectedCrimeType] = useState<string>('ALL');
  const [selectedHotspot, setSelectedHotspot] = useState<CrimeHotspot | null>(null);
  const [hoveredHotspot, setHoveredHotspot] = useState<CrimeHotspot | null>(null);
  const [showHotspotListDrawer, setShowHotspotListDrawer] = useState<boolean>(false);
  const [showHeatmapSettings, setShowHeatmapSettings] = useState<boolean>(false);

  // Filter state
  const [selectedActionFilter, setSelectedActionFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCaseFilter, setActiveCaseFilter] = useState<string>(propCaseId || 'ALL');

  // Zoom and Pan transform
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Update selection when jurisdiction changes
  useEffect(() => {
    setSelectedRegionId(currentProfile.defaultSelectedRegionId);
    setSelectedTarget(null);
    setSelectedHotspot(null);
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  }, [currentProfile]);

  // Sync prop case filter
  useEffect(() => {
    if (propCaseId) {
      setActiveCaseFilter(propCaseId);
    }
  }, [propCaseId]);

  // Current active region object
  const selectedRegion = useMemo(() => {
    return currentProfile.regions.find(r => r.id === selectedRegionId) || null;
  }, [currentProfile, selectedRegionId]);

  // Filtered tactical targets across the active jurisdiction
  const visibleTargets = useMemo(() => {
    let targets: (TacticalTarget & { regionName: string })[] = [];
    currentProfile.regions.forEach(region => {
      region.tacticalTargets.forEach(target => {
        targets.push({ ...target, regionName: region.name });
      });
    });

    if (activeCaseFilter !== 'ALL') {
      targets = targets.filter(t => t.caseId === activeCaseFilter);
    }

    if (selectedActionFilter !== 'ALL') {
      targets = targets.filter(t => t.actionType === selectedActionFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      targets = targets.filter(t => 
        t.name.toLowerCase().includes(q) ||
        t.address.toLowerCase().includes(q) ||
        t.seizureMetric.toLowerCase().includes(q) ||
        t.regionName.toLowerCase().includes(q)
      );
    }

    return targets;
  }, [currentProfile, activeCaseFilter, selectedActionFilter, searchQuery]);

  // Filtered Crime Hotspots for Heat Map Layer
  const visibleHotspots = useMemo(() => {
    let list = currentProfile.hotspots || [];

    if (selectedCrimeType !== 'ALL') {
      list = list.filter(h => h.primaryCrimeType === selectedCrimeType);
    }

    if (activeCaseFilter !== 'ALL') {
      list = list.filter(h => h.cases.includes(activeCaseFilter));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(h =>
        h.cityName.toLowerCase().includes(q) ||
        h.seizureValue.toLowerCase().includes(q) ||
        h.description.toLowerCase().includes(q) ||
        h.activeSyndicates.some(s => s.toLowerCase().includes(q))
      );
    }

    return list;
  }, [currentProfile, selectedCrimeType, activeCaseFilter, searchQuery]);

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.35, 3.8));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.35, 0.65));
  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleFocusHotspot = (hotspot: CrimeHotspot) => {
    setSelectedHotspot(hotspot);
    setSelectedRegionId(hotspot.regionId);
    setSelectedTarget(null);
  };

  return (
    <div 
      id="geo-gis-map-container"
      ref={containerRef}
      className="relative w-full h-full bg-[#FAF7F2] select-none flex flex-col overflow-hidden font-sans border-t border-[#E8DFC9]"
    >
      {/* ================================================================
          TOP PRECISION CONTROLS HEADER BAR
      ================================================================ */}
      <div 
        id="gis-map-top-bar" 
        className="shrink-0 z-20 bg-[#FAF7F2]/95 backdrop-blur-md px-4 py-2.5 border-b border-[#E8DFC9] flex flex-wrap items-center justify-between gap-3 shadow-xs"
      >
        {/* Left: Jurisdiction Switcher (India / Global World / London / Dubai) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-[#EFE8DC] p-1 rounded-lg border border-[#DDD4C0]">
            {Object.values(ALL_GIS_PROFILES).map(profile => {
              const isActive = profile.id === activeJurisdictionKey;
              return (
                <button
                  key={profile.id}
                  id={`btn-jurisdiction-${profile.id}`}
                  onClick={() => setActiveJurisdictionKey(profile.id)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isActive 
                      ? 'bg-[#243324] text-[#FBF9F5] shadow-xs' 
                      : 'text-[#4A5B4C] hover:text-[#243324] hover:bg-[#E4DAC6]'
                  }`}
                >
                  <span className="text-sm">{profile.flag}</span>
                  <span>{profile.shortName}</span>
                </button>
              );
            })}
          </div>

          <div className="h-4 w-px bg-[#DDD4C0] mx-1 hidden sm:block" />

          {/* HEAT MAP LAYER TOGGLE BUTTON (Prominent & High-Tech) */}
          <div className="flex items-center gap-1">
            <button
              id="btn-toggle-crime-heatmap"
              onClick={() => setShowHeatmap(prev => !prev)}
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-all ${
                showHeatmap
                  ? 'bg-gradient-to-r from-[#DC2626] to-[#EA580C] text-white border-transparent shadow-xs animate-pulse-subtle'
                  : 'bg-[#FFFFFF] text-[#6B7D6C] border-[#DDD4C0] hover:bg-[#EFE8DC]'
              }`}
              title="Toggle Crime Density Heat Map Layer"
            >
              <Flame className={`w-3.5 h-3.5 ${showHeatmap ? 'text-amber-200 fill-amber-200' : 'text-[#6B7D6C]'}`} />
              <span>Crime Heatmap {showHeatmap ? 'ON' : 'OFF'}</span>
              <span className={`text-[10px] px-1 py-0.2 rounded font-mono ${showHeatmap ? 'bg-black/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
                {visibleHotspots.length}
              </span>
            </button>

            {/* Quick Heatmap Settings Popup Button */}
            {showHeatmap && (
              <button
                id="btn-heatmap-settings-toggle"
                onClick={() => setShowHeatmapSettings(prev => !prev)}
                className={`p-1.5 rounded-lg border text-xs transition-colors ${
                  showHeatmapSettings 
                    ? 'bg-[#243324] text-white border-[#243324]' 
                    : 'bg-[#FFFFFF] text-[#4A5B4C] border-[#DDD4C0] hover:bg-[#EFE8DC]'
                }`}
                title="Heatmap Layer Intensity & Density Controls"
              >
                <Sliders className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Hotspot City Drawer Button */}
            <button
              id="btn-hotspot-drawer-toggle"
              onClick={() => setShowHotspotListDrawer(prev => !prev)}
              className={`px-2 py-1 rounded-lg border text-xs font-medium flex items-center gap-1 transition-colors ${
                showHotspotListDrawer
                  ? 'bg-[#243324] text-white border-[#243324]'
                  : 'bg-[#FFFFFF] text-[#4A5B4C] border-[#DDD4C0] hover:bg-[#EFE8DC]'
              }`}
              title="View Ranked Crime Hotspots"
            >
              <Activity className="w-3.5 h-3.5 text-[#DC2626]" />
              <span className="hidden md:inline">Hotspot Ranking</span>
            </button>
          </div>
        </div>

        {/* Center: Search & Case Filter */}
        <div className="flex items-center gap-2 grow max-w-sm">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#7E9B82]" />
            <input
              type="text"
              placeholder="Search state, port, court, or city hotspot..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FFFFFF] border border-[#DDD4C0] rounded-md pl-8 pr-7 py-1 text-xs text-[#243324] placeholder-[#8E9F8E] focus:outline-none focus:border-[#243324]"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[#7E9B82] hover:text-[#243324]"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Case Filter Selector */}
          <select
            id="gis-case-selector"
            value={activeCaseFilter}
            onChange={(e) => setActiveCaseFilter(e.target.value)}
            className="bg-[#FFFFFF] border border-[#DDD4C0] rounded-md px-2 py-1 text-xs font-medium text-[#243324] focus:outline-none focus:border-[#243324]"
          >
            <option value="ALL">All Cases</option>
            {REAL_CASE_PROFILES.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>

        {/* Right: Crime Category Filter Pills */}
        <div className="flex items-center gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7D6C] mr-1 hidden xl:inline">
            Heat Category:
          </span>
          <div className="flex items-center gap-1 overflow-x-auto max-w-xs sm:max-w-none">
            {Object.entries(CRIME_TYPE_META).slice(0, 5).map(([key, meta]) => {
              const isSelected = selectedCrimeType === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedCrimeType(key)}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold whitespace-nowrap transition-all border ${
                    isSelected
                      ? 'bg-[#243324] text-[#FBF9F5] border-[#243324]'
                      : 'bg-[#FFFFFF] text-[#4A5B4C] border-[#DDD4C0] hover:bg-[#F5EFE4]'
                  }`}
                >
                  <span className="inline-block w-1.5 h-1.5 rounded-full mr-1" style={{ backgroundColor: meta.color }} />
                  {meta.label.split(' ')[0]}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================================================================
          FLOATING HEATMAP SETTINGS OVERLAY
      ================================================================ */}
      {showHeatmap && showHeatmapSettings && (
        <div 
          id="heatmap-settings-panel"
          className="absolute top-14 left-4 z-30 bg-[#FAF7F2]/98 backdrop-blur-md p-3.5 rounded-xl border border-[#DDD4C0] shadow-xl max-w-xs w-full text-xs animate-in fade-in slide-in-from-top-2"
        >
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#DDD4C0]">
            <div className="flex items-center gap-1.5 font-bold text-[#243324]">
              <Flame className="w-4 h-4 text-[#DC2626]" />
              <span>Hotspot Density Engine</span>
            </div>
            <button 
              onClick={() => setShowHeatmapSettings(false)}
              className="text-[#7E9B82] hover:text-[#243324]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {/* Opacity Slider */}
            <div>
              <div className="flex items-center justify-between text-[11px] mb-1 font-medium text-[#4A5B4C]">
                <span>Heat Layer Opacity</span>
                <span className="font-mono font-bold text-[#243324]">{Math.round(heatmapOpacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="1.0"
                step="0.05"
                value={heatmapOpacity}
                onChange={(e) => setHeatmapOpacity(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-[#E4DAC6] rounded-lg appearance-none cursor-pointer accent-[#DC2626]"
              />
            </div>

            {/* Gaussian Blur / Diffusion Slider */}
            <div>
              <div className="flex items-center justify-between text-[11px] mb-1 font-medium text-[#4A5B4C]">
                <span>Diffusion Radius (Blur)</span>
                <span className="font-mono font-bold text-[#243324]">{heatmapBlur}px</span>
              </div>
              <input
                type="range"
                min="8"
                max="32"
                step="2"
                value={heatmapBlur}
                onChange={(e) => setHeatmapBlur(parseInt(e.target.value))}
                className="w-full h-1.5 bg-[#E4DAC6] rounded-lg appearance-none cursor-pointer accent-[#EA580C]"
              />
            </div>

            {/* Density Palette Legend */}
            <div className="pt-2 border-t border-[#DDD4C0]/70">
              <span className="text-[10px] uppercase font-bold text-[#6B7D6C] block mb-1.5">
                Density Intensity Spectrum
              </span>
              <div className="h-2.5 rounded-full w-full bg-gradient-to-r from-[#0284C7] via-[#F59E0B] via-[#EA580C] to-[#DC2626] shadow-inner mb-1" />
              <div className="flex justify-between text-[10px] text-[#6B7D6C] font-mono">
                <span>Low (&lt;0.4)</span>
                <span>Medium</span>
                <span>High</span>
                <span className="text-[#DC2626] font-bold">Hotspot (1.0)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================
          SLIDE-OUT CRIME HOTSPOT RANKING DRAWER
      ================================================================ */}
      {showHotspotListDrawer && (
        <div 
          id="hotspot-ranking-drawer"
          className="absolute top-14 right-4 z-30 bg-[#FAF7F2]/98 backdrop-blur-md p-3.5 rounded-xl border border-[#DDD4C0] shadow-xl max-w-sm w-full text-xs max-h-[75vh] flex flex-col animate-in fade-in slide-in-from-right-2"
        >
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#DDD4C0] shrink-0">
            <div className="flex items-center gap-1.5 font-bold text-[#243324]">
              <Activity className="w-4 h-4 text-[#DC2626]" />
              <span>City Hotspots: {currentProfile.shortName}</span>
            </div>
            <button 
              onClick={() => setShowHotspotListDrawer(false)}
              className="text-[#7E9B82] hover:text-[#243324]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-y-auto space-y-2 pr-1">
            {visibleHotspots.length === 0 ? (
              <p className="text-xs text-[#7E9B82] italic py-3 text-center">No matching hotspots in this view</p>
            ) : (
              visibleHotspots
                .sort((a, b) => b.intensity - a.intensity)
                .map((hotspot, idx) => {
                  const isSelected = selectedHotspot?.id === hotspot.id;
                  const crimeMeta = CRIME_TYPE_META[hotspot.primaryCrimeType] || CRIME_TYPE_META.ALL;

                  return (
                    <div
                      key={hotspot.id}
                      onClick={() => handleFocusHotspot(hotspot)}
                      className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#243324] text-[#FBF9F5] border-[#243324] shadow-xs'
                          : 'bg-[#FFFFFF] text-[#243324] border-[#DDD4C0] hover:bg-[#EFE8DC]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <div className="flex items-center gap-1.5 font-bold">
                          <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-mono ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-red-100 text-red-700'
                          }`}>
                            #{idx + 1}
                          </span>
                          <span className="truncate">{hotspot.cityName}</span>
                        </div>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                          isSelected ? 'bg-red-500/30 text-red-200' : 'bg-red-50 text-red-600'
                        }`}>
                          {Math.round(hotspot.intensity * 100)}% Heat
                        </span>
                      </div>

                      <div className={`text-[11px] font-semibold mb-0.5 ${isSelected ? 'text-amber-300' : 'text-[#DC2626]'}`}>
                        {hotspot.seizureValue}
                      </div>

                      <div className={`text-[10px] line-clamp-1 ${isSelected ? 'text-[#C8D6C9]' : 'text-[#6B7D6C]'}`}>
                        {hotspot.description}
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      )}

      {/* ================================================================
          MAIN GIS VECTOR CARTOGRAPHIC CANVAS
      ================================================================ */}
      <div 
        className="relative flex-1 w-full h-full overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          id="gis-interactive-canvas-svg"
          ref={svgRef}
          viewBox={currentProfile.viewBox}
          className="w-full h-full transition-transform duration-75"
          style={{
            transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
            transformOrigin: '50% 50%'
          }}
        >
          <defs>
            {/* Soft background paper texture gradient */}
            <radialGradient id="cartographic-vignette" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#FAF7F2" />
              <stop offset="100%" stopColor="#F2EDE2" />
            </radialGradient>

            {/* ============================================================
                CRIME HEATMAP DENSITY RADIAL GRADIENTS & GAUSSIAN BLURS
            ============================================================ */}
            <filter id="heatmap-gaussian-blur" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation={heatmapBlur} />
            </filter>

            {/* Critical Red-Hotspot Radial Flare */}
            <radialGradient id="heat-grad-critical" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#991B1B" stopOpacity="0.95" />
              <stop offset="25%" stopColor="#DC2626" stopOpacity="0.85" />
              <stop offset="55%" stopColor="#EA580C" stopOpacity="0.65" />
              <stop offset="80%" stopColor="#F59E0B" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#FBBF24" stopOpacity="0.0" />
            </radialGradient>

            {/* High Orange-Amber Flare */}
            <radialGradient id="heat-grad-high" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#EA580C" stopOpacity="0.90" />
              <stop offset="35%" stopColor="#F59E0B" stopOpacity="0.70" />
              <stop offset="70%" stopColor="#84CC16" stopOpacity="0.30" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
            </radialGradient>

            {/* Moderate Amber-Emerald Flare */}
            <radialGradient id="heat-grad-moderate" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#D97706" stopOpacity="0.85" />
              <stop offset="40%" stopColor="#059669" stopOpacity="0.55" />
              <stop offset="75%" stopColor="#0284C7" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.0" />
            </radialGradient>

            {/* Standard Cool Flare */}
            <radialGradient id="heat-grad-standard" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0284C7" stopOpacity="0.80" />
              <stop offset="45%" stopColor="#059669" stopOpacity="0.45" />
              <stop offset="85%" stopColor="#7E9B82" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#FAF7F2" stopOpacity="0.0" />
            </radialGradient>
          </defs>

          {/* Background Map Surface */}
          <rect width="1000" height="760" fill="url(#cartographic-vignette)" />

          {/* ============================================================
              LAYER 1: NATURAL WATERWAYS & RIVER CURVES
              (Like River Thames in London, Ganges in India, Dubai Creek in UAE)
          ============================================================ */}
          <g id="layer-natural-waterways">
            {currentProfile.waterways.map(waterway => (
              <g key={waterway.id} className="waterway-group">
                {/* Smooth organic river ribbon matching reference images */}
                <path
                  d={waterway.svgPath}
                  fill="none"
                  stroke={waterway.color}
                  strokeWidth={waterway.width}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.95"
                />
                {/* Subtle soft edge highlight */}
                <path
                  d={waterway.svgPath}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  opacity="0.4"
                />
                {/* Waterway Label if defined */}
                {waterway.labelPosition && (
                  <text
                    x={waterway.labelPosition[0]}
                    y={waterway.labelPosition[1]}
                    fill="#4F6851"
                    fontSize="11"
                    fontStyle="italic"
                    fontWeight="600"
                    textAnchor="middle"
                    className="select-none pointer-events-none tracking-wider"
                  >
                    {waterway.name}
                  </text>
                )}
              </g>
            ))}
          </g>

          {/* Global Shipping Lanes / Transit Corridors (For World View) */}
          {currentProfile.shippingLanes && (
            <g id="layer-shipping-lanes">
              {currentProfile.shippingLanes.map(lane => (
                <g key={lane.id}>
                  <path
                    d={lane.svgPath}
                    fill="none"
                    stroke={lane.color}
                    strokeWidth={lane.width}
                    strokeDasharray={lane.dashArray}
                    strokeLinecap="round"
                    opacity="0.85"
                  />
                  {lane.label && (
                    <text
                      fill={lane.color}
                      fontSize="9"
                      fontWeight="700"
                      className="select-none"
                    >
                      <textPath href={`#${lane.id}`} startOffset="50%" textAnchor="middle">
                        {lane.label}
                      </textPath>
                    </text>
                  )}
                </g>
              ))}
            </g>
          )}

          {/* ============================================================
              LAYER 2: ADMINISTRATIVE REGION POLYGONS & BOUNDARIES
              (Boroughs in London / States in India / Districts in Dubai)
          ============================================================ */}
          <g id="layer-administrative-regions">
            {currentProfile.regions.map(region => {
              const isSelected = region.id === selectedRegionId;
              const isHovered = region.id === hoveredRegionId;

              // Fill styling matching the exact user image:
              // Selected: Deep forest dark-charcoal (#243324)
              // Hovered: Warm tinted cream (#E8DFC9)
              // Unselected: Clean crisp off-white (#FAF8F4)
              const fillColor = isSelected 
                ? '#243324' 
                : isHovered 
                  ? '#E8DFC9' 
                  : '#FAF8F4';

              const strokeColor = '#243324';
              const strokeWidth = isSelected ? '2.0' : '1.2';

              return (
                <g 
                  key={region.id} 
                  id={`gis-region-${region.id}`}
                  className="region-group cursor-pointer transition-all"
                  onClick={() => {
                    setSelectedRegionId(region.id);
                    setSelectedTarget(null);
                    setSelectedHotspot(null);
                  }}
                  onMouseEnter={() => setHoveredRegionId(region.id)}
                  onMouseLeave={() => setHoveredRegionId(null)}
                >
                  <path
                    d={region.svgPolygon}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    className="transition-colors duration-150"
                  />
                  <title>{`${region.name} - ${region.summary}`}</title>
                </g>
              );
            })}
          </g>

          {/* ============================================================
              LAYER 3: CRIME DENSITY HEAT MAP LAYER (OVERLAY)
              (Visualizes crime density hotspots across Indian cities & Global hubs)
          ============================================================ */}
          {showHeatmap && (
            <g 
              id="layer-crime-density-heatmap" 
              filter="url(#heatmap-gaussian-blur)"
              opacity={heatmapOpacity}
              className="pointer-events-none transition-opacity duration-300"
            >
              {visibleHotspots.map(hotspot => {
                const [hx, hy] = hotspot.position;
                const radius = hotspot.radius || 50;

                // Select appropriate gradient based on density intensity
                let gradId = 'url(#heat-grad-standard)';
                if (hotspot.intensity >= 0.90) gradId = 'url(#heat-grad-critical)';
                else if (hotspot.intensity >= 0.75) gradId = 'url(#heat-grad-high)';
                else if (hotspot.intensity >= 0.60) gradId = 'url(#heat-grad-moderate)';

                return (
                  <circle
                    key={`heatmap-blob-${hotspot.id}`}
                    cx={hx}
                    cy={hy}
                    r={radius * (1 + hotspot.intensity * 0.4)}
                    fill={gradId}
                  />
                );
              })}
            </g>
          )}

          {/* ============================================================
              LAYER 4: REGION NAME LABELS
              (Crisp typography: dark text on unselected, pure white on selected)
          ============================================================ */}
          <g id="layer-region-labels" className="pointer-events-none select-none">
            {currentProfile.regions.map(region => {
              const isSelected = region.id === selectedRegionId;
              const [lx, ly] = region.labelPosition;

              return (
                <text
                  key={`label-${region.id}`}
                  x={lx}
                  y={ly}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={isSelected ? '#FFFFFF' : '#243324'}
                  fontSize={isSelected ? '14' : '12'}
                  fontWeight={isSelected ? '700' : '600'}
                  letterSpacing={isSelected ? '0.02em' : '0.01em'}
                  className="font-sans transition-colors duration-150"
                >
                  {region.name}
                </text>
              );
            })}
          </g>

          {/* ============================================================
              LAYER 5: CONCENTRIC BULLSEYE TARGET POINTS ⊙
              (Rendered across all boroughs / states to match the reference pictures)
          ============================================================ */}
          <g id="layer-tactical-bullseyes">
            {currentProfile.regions.map(region => {
              const isRegionSelected = region.id === selectedRegionId;
              
              return region.tacticalTargets.map(target => {
                const isTargetSelected = selectedTarget?.id === target.id;
                const isTargetHovered = hoveredTarget?.id === target.id;
                const actionMeta = ACTION_CATEGORIES[target.actionType] || ACTION_CATEGORIES.INTERCEPT_SEIZURE;
                const [tx, ty] = target.position;

                // When inside a dark selected region (e.g. Westminster or Gujarat), render in high-contrast crisp white ⊙!
                // When in an unselected region, render in dark slate-green or action accent
                const ringColor = isRegionSelected ? '#FFFFFF' : '#243324';
                const dotColor = isRegionSelected ? '#FFFFFF' : '#243324';

                return (
                  <g
                    key={target.id}
                    id={`target-bullseye-${target.id}`}
                    transform={`translate(${tx}, ${ty})`}
                    className="cursor-pointer group"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRegionId(region.id);
                      setSelectedTarget(target);
                      setSelectedHotspot(null);
                    }}
                    onMouseEnter={() => setHoveredTarget(target)}
                    onMouseLeave={() => setHoveredTarget(null)}
                  >
                    <title>{`${target.name} (${target.code}) - Click to inspect tactical dossier`}</title>

                    {/* Subtle outer hover ring / radar ripple */}
                    {(isTargetSelected || isTargetHovered) && (
                      <circle
                        r="14"
                        fill="none"
                        stroke={actionMeta.color}
                        strokeWidth="1.5"
                        opacity="0.75"
                        className="animate-ping"
                      />
                    )}

                    {/* Outer Target Ring (⊙) */}
                    <circle
                      r={isTargetHovered ? '7.5' : '5.5'}
                      fill="none"
                      stroke={ringColor}
                      strokeWidth={isTargetSelected ? '2.2' : '1.5'}
                      className="transition-all duration-150"
                    />

                    {/* Center Pinpoint Solid Dot (⊙) */}
                    <circle
                      r={isTargetHovered ? '2.8' : '2.0'}
                      fill={dotColor}
                      className="transition-all duration-150"
                    />

                    {/* Floating Minimal Tooltip on Hover */}
                    {isTargetHovered && (
                      <g transform="translate(0, -14)" className="pointer-events-none">
                        <rect
                          x="-70"
                          y="-11"
                          width="140"
                          height="22"
                          rx="4"
                          fill="#243324"
                          fillOpacity="0.96"
                          stroke="#FBF9F5"
                          strokeWidth="0.8"
                        />
                        <text
                          x="0"
                          y="4"
                          textAnchor="middle"
                          fontSize="9.5"
                          fontWeight="700"
                          fill="#FBF9F5"
                          className="font-sans select-none"
                        >
                          {target.name.length > 22 ? target.name.slice(0, 21) + '…' : target.name}
                        </text>
                      </g>
                    )}
                  </g>
                );
              });
            })}
          </g>

          {/* ============================================================
              LAYER 6: HOTSPOT RADAR BEACONS & INTERACTIVE PINS
          ============================================================ */}
          {showHeatmap && (
            <g id="layer-hotspot-interactive-beacons">
              {visibleHotspots.map(hotspot => {
                const [hx, hy] = hotspot.position;
                const isSelected = selectedHotspot?.id === hotspot.id;
                const isHovered = hoveredHotspot?.id === hotspot.id;
                const isHighThreat = hotspot.intensity >= 0.85;

                return (
                  <g
                    key={`hotspot-pin-${hotspot.id}`}
                    transform={`translate(${hx}, ${hy})`}
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFocusHotspot(hotspot);
                    }}
                    onMouseEnter={() => setHoveredHotspot(hotspot)}
                    onMouseLeave={() => setHoveredHotspot(null)}
                  >
                    {/* Animated Pulsing Beacon for Top Hotspots */}
                    {isHighThreat && (
                      <circle
                        r="18"
                        fill="none"
                        stroke="#DC2626"
                        strokeWidth="1.8"
                        opacity="0.7"
                        className="animate-ping"
                      />
                    )}

                    {/* Hotspot Center Core Reticle */}
                    <circle
                      r={isSelected ? '9' : isHovered ? '8' : '6.5'}
                      fill="#DC2626"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      className="shadow-md transition-all duration-150"
                    />

                    <circle
                      r="2.5"
                      fill="#FFFFFF"
                    />

                    {/* Hover Floating Forensic Intelligence Tooltip */}
                    {isHovered && (
                      <g transform="translate(0, -22)" className="pointer-events-none z-50">
                        <rect
                          x="-100"
                          y="-24"
                          width="200"
                          height="44"
                          rx="6"
                          fill="#182218"
                          fillOpacity="0.98"
                          stroke="#DC2626"
                          strokeWidth="1.2"
                          className="shadow-2xl"
                        />
                        <text
                          x="0"
                          y="-9"
                          textAnchor="middle"
                          fontSize="10"
                          fontWeight="700"
                          fill="#FBF9F5"
                        >
                          🔥 {hotspot.cityName}
                        </text>
                        <text
                          x="0"
                          y="6"
                          textAnchor="middle"
                          fontSize="9"
                          fontWeight="600"
                          fill="#FCA5A5"
                        >
                          {hotspot.seizureValue}
                        </text>
                        <text
                          x="0"
                          y="15"
                          textAnchor="middle"
                          fontSize="8"
                          fontWeight="500"
                          fill="#9CA3AF"
                        >
                          Heat Index: {Math.round(hotspot.intensity * 100)}% • Click for Dossier
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </g>
          )}
        </svg>

        {/* Map Corner Watermark & Jurisdiction Badge */}
        <div className="absolute bottom-4 left-4 z-10 bg-[#FAF7F2]/92 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-[#DDD4C0] shadow-sm text-xs max-w-sm">
          <div className="flex items-start gap-2.5">
            <span className="text-xl mt-0.5">{currentProfile.flag}</span>
            <div>
              <div className="font-bold text-[#243324] leading-tight flex items-center gap-1.5">
                <span>{currentProfile.name}</span>
                {showHeatmap && (
                  <span className="bg-red-100 text-red-700 text-[10px] font-bold px-1.5 py-0.2 rounded">
                    Heat Layer Active
                  </span>
                )}
              </div>
              <div className="text-[11px] text-[#526453] mt-0.5 font-medium">
                {currentProfile.headlineMetric}
              </div>
            </div>
          </div>
        </div>

        {/* Floating Zoom and Navigation Controls (Top Right) */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5 bg-[#FAF7F2]/90 backdrop-blur-md p-1.5 rounded-lg border border-[#DDD4C0] shadow-xs">
          <button
            id="btn-gis-zoom-in"
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-1.5 rounded-md hover:bg-[#EFE8DC] text-[#243324] transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            id="btn-gis-zoom-out"
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-1.5 rounded-md hover:bg-[#EFE8DC] text-[#243324] transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <div className="h-px w-full bg-[#DDD4C0]" />
          <button
            id="btn-gis-reset-view"
            onClick={handleResetZoom}
            title="Reset View"
            className="p-1.5 rounded-md hover:bg-[#EFE8DC] text-[#243324] transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ================================================================
          BOTTOM / RIGHT DETAIL DRAWER: TACTICAL REGION & SITE DOSSIER
      ================================================================ */}
      {(selectedHotspot || selectedRegion) && (
        <div 
          id="gis-tactical-dossier-panel"
          className="shrink-0 z-20 bg-[#FBF9F5] border-t border-[#DDD4C0] px-4 py-3 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 max-h-60 overflow-y-auto"
        >
          {/* If a Crime Hotspot is selected, show deep hotspot intelligence card */}
          {selectedHotspot ? (
            <div className="flex-1 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-[#DC2626] text-white text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <Flame className="w-3 h-3 fill-white" /> Crime Hotspot ({Math.round(selectedHotspot.intensity * 100)}% Density)
                  </span>
                  <h3 className="font-bold text-sm text-[#243324]">
                    {selectedHotspot.cityName}
                  </h3>
                  <span className="text-xs text-[#DC2626] font-bold">
                    • {selectedHotspot.seizureValue}
                  </span>
                </div>
                <p className="text-xs text-[#4A5B4C] leading-relaxed">
                  {selectedHotspot.description}
                </p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[11px] font-semibold text-[#6B7D6C]">Active Syndicates:</span>
                  <div className="flex items-center gap-1 flex-wrap">
                    {selectedHotspot.activeSyndicates.map((syn, idx) => (
                      <span key={idx} className="bg-[#EFE8DC] text-[#243324] px-1.5 py-0.2 rounded text-[10px] font-mono font-medium">
                        {syn}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setSelectedHotspot(null)}
                  className="px-3 py-1.5 rounded-md border border-[#DDD4C0] bg-white text-xs font-semibold text-[#4A5B4C] hover:bg-[#EFE8DC]"
                >
                  Close Hotspot
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Left: Selected Region Summary */}
              <div className="max-w-xl">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-[#243324] text-[#FBF9F5] text-[11px] font-bold uppercase tracking-wider">
                    Active Region
                  </span>
                  <h3 className="font-bold text-sm text-[#243324]">
                    {selectedRegion?.name} ({currentProfile.shortName})
                  </h3>
                  <span className="text-xs text-[#526453]">
                    • {selectedRegion?.tacticalTargets.length} Key Tactical Target(s)
                  </span>
                  {selectedRegion?.crimeDensityIndex && (
                    <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">
                      Density: {selectedRegion.crimeDensityIndex}/100
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#4A5B4C] leading-relaxed">
                  {selectedRegion?.summary}
                </p>
              </div>

              {/* Center/Right: Target Sites in Selected Region */}
              <div className="flex items-center gap-2 flex-wrap">
                {selectedRegion?.tacticalTargets.length === 0 ? (
                  <span className="text-xs text-[#7E9B82] italic">No active tactical targets in this sector</span>
                ) : (
                  selectedRegion?.tacticalTargets.map(target => {
                    const actionMeta = ACTION_CATEGORIES[target.actionType] || ACTION_CATEGORIES.INTERCEPT_SEIZURE;
                    const isSelected = selectedTarget?.id === target.id;
                    
                    return (
                      <button
                        key={target.id}
                        onClick={() => setSelectedTarget(target)}
                        className={`px-3 py-1.5 rounded-md border text-xs font-semibold flex items-center gap-2 transition-all ${
                          isSelected 
                            ? 'bg-[#243324] text-[#FBF9F5] border-[#243324] shadow-xs'
                            : 'bg-[#FFFFFF] text-[#243324] border-[#DDD4C0] hover:bg-[#EFE8DC]'
                        }`}
                      >
                        <span 
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: actionMeta.color }}
                        />
                        <div className="text-left">
                          <div className="leading-tight">{target.name}</div>
                          <div className={`text-[10px] ${isSelected ? 'text-[#C8D6C9]' : 'text-[#6B7D6C]'}`}>
                            {target.code} • {actionMeta.shortLabel}
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>

              {/* If a target is clicked, display quick action metric badge */}
              {selectedTarget && (
                <div className="p-2.5 rounded-lg bg-[#EFE8DC] border border-[#DDD4C0] max-w-sm shrink-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[11px] font-bold text-[#243324]">{selectedTarget.name}</span>
                    <button 
                      onClick={() => setSelectedTarget(null)}
                      className="text-[#6B7D6C] hover:text-[#243324]"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="text-[11px] font-semibold text-[#DC2626] mb-1">
                    {selectedTarget.seizureMetric}
                  </div>
                  <div className="text-[11px] text-[#4A5B4C] line-clamp-2">
                    {selectedTarget.operationalNotes}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
