import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  SkipBack, 
  SkipForward, 
  Radio, 
  Compass, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Ship, 
  Truck, 
  ChevronDown, 
  ChevronUp, 
  Activity, 
  Navigation,
  Crosshair,
  Layers,
  Sparkles
} from 'lucide-react';
import { REAL_4D_TRACKS, TelemetryTrack, TelemetryWaypoint } from '../data/intelligence4DEngine';
import { CaseId } from '../types';

interface UnifiedTemporalTelemetryProps {
  currentDateIndex: number;
  setCurrentDateIndex: React.Dispatch<React.SetStateAction<number>>;
  dateList: string[];
  selectedCaseId: CaseId;
  activeTrack: TelemetryTrack | null;
  onSelectTrack: (track: TelemetryTrack) => void;
  currentWaypointIndex: number;
  onWaypointChange: (index: number) => void;
  onFocusCoordinates?: (lat: number, lng: number, zoom?: number) => void;
}

export const UnifiedTemporalTelemetry: React.FC<UnifiedTemporalTelemetryProps> = ({
  currentDateIndex,
  setCurrentDateIndex,
  dateList,
  selectedCaseId,
  activeTrack,
  onSelectTrack,
  currentWaypointIndex,
  onWaypointChange,
  onFocusCoordinates,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2 | 5 | 10>(1);
  const [timeWindow, setTimeWindow] = useState<'24H' | '7D' | '30D' | 'ALL'>('ALL');
  const [activeTab, setActiveTab] = useState<'TEMPORAL_GRAPH' | '4D_TELEMETRY'>('TEMPORAL_GRAPH');
  const [isExpanded, setIsExpanded] = useState(false);

  // Filter available 4D telemetry tracks based on active case
  const availableTracks = REAL_4D_TRACKS.filter(
    t => selectedCaseId === 'CASE_ALL' || t.caseId === selectedCaseId
  );
  const currentTrack = activeTrack || availableTracks[0] || REAL_4D_TRACKS[0];
  const currentWaypoint: TelemetryWaypoint | undefined = 
    currentTrack?.waypoints[currentWaypointIndex] || currentTrack?.waypoints[0];

  // Playback animation loop synchronized across Temporal Graph & Telemetry Waypoints
  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = 1200 / playbackSpeed;
    const timer = setInterval(() => {
      // 1. Advance Temporal Date Index
      setCurrentDateIndex(prev => {
        if (prev >= dateList.length - 1) {
          return prev;
        }
        return prev + 1;
      });

      // 2. Advance Telemetry Waypoint Index if in 4D telemetry mode
      if (currentTrack && currentTrack.waypoints.length > 0) {
        onWaypointChange(
          (currentWaypointIndex + 1) % currentTrack.waypoints.length
        );
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [
    isPlaying, 
    playbackSpeed, 
    dateList.length, 
    setCurrentDateIndex, 
    currentTrack, 
    currentWaypointIndex, 
    onWaypointChange
  ]);

  // Stop playing when the end of timeline is reached in temporal mode
  useEffect(() => {
    if (isPlaying && currentDateIndex >= dateList.length - 1 && activeTab === 'TEMPORAL_GRAPH') {
      setIsPlaying(false);
    }
  }, [currentDateIndex, isPlaying, dateList.length, activeTab]);

  const handleTogglePlay = () => {
    if (!isPlaying && currentDateIndex >= dateList.length - 1) {
      setCurrentDateIndex(0);
      onWaypointChange(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(prev => !prev);
    }
  };

  const handleSeek = (index: number) => {
    setIsPlaying(false);
    setCurrentDateIndex(index);
    // Proportionally sync telemetry waypoint
    if (currentTrack && currentTrack.waypoints.length > 0) {
      const ratio = index / Math.max(1, dateList.length - 1);
      const wpIdx = Math.min(
        currentTrack.waypoints.length - 1, 
        Math.floor(ratio * currentTrack.waypoints.length)
      );
      onWaypointChange(wpIdx);
    }
  };

  // Histogram distribution sample bar heights
  const histogramBars = [
    { height: 18, color: 'bg-blue-400' },
    { height: 28, color: 'bg-blue-500' },
    { height: 42, color: 'bg-blue-600' },
    { height: 22, color: 'bg-blue-400' },
    { height: 35, color: 'bg-blue-500' },
    { height: 48, color: 'bg-cyan-500' },
    { height: 15, color: 'bg-blue-400' },
    { height: 24, color: 'bg-blue-500' },
    { height: 38, color: 'bg-blue-600' },
    { height: 19, color: 'bg-blue-400' },
    { height: 26, color: 'bg-blue-500' },
    { height: 32, color: 'bg-blue-500' },
    { height: 45, color: 'bg-cyan-500' },
    { height: 60, color: 'bg-amber-500' },
    { height: 50, color: 'bg-amber-500' },
    { height: 75, color: 'bg-amber-600' },
    { height: 85, color: 'bg-orange-500' },
    { height: 65, color: 'bg-amber-500' },
    { height: 95, color: 'bg-rose-500' },
    { height: 100, color: 'bg-rose-600' }
  ];

  return (
    <div 
      id="unified-temporal-telemetry-engine"
      className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 w-[96%] max-w-3xl bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-xl p-3.5 text-slate-800 select-none transition-all"
    >
      {/* Top Combined Tab & Mode Bar */}
      <div className="flex items-center justify-between gap-2 mb-2">
        
        {/* Switcher: Temporal Network Evolution vs 4D Telemetry Track */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('TEMPORAL_GRAPH')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'TEMPORAL_GRAPH'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Temporal Evolution</span>
            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
              activeTab === 'TEMPORAL_GRAPH' ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              52d
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('4D_TELEMETRY');
              setIsExpanded(true);
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              activeTab === '4D_TELEMETRY'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span>4D Telemetry Track</span>
            {availableTracks.length > 0 && (
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                activeTab === '4D_TELEMETRY' ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {availableTracks.length} Assets
              </span>
            )}
          </button>
        </div>

        {/* Right Tools: Expand / Collapse Toggle & Window Filters */}
        <div className="flex items-center gap-2">
          {activeTab === 'TEMPORAL_GRAPH' && (
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[10px] font-bold">
              {(['24H', '7D', '30D', 'ALL'] as const).map(w => (
                <button
                  key={w}
                  onClick={() => setTimeWindow(w)}
                  className={`px-2 py-0.5 rounded-md transition-all ${
                    timeWindow === w
                      ? 'bg-white text-blue-600 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {w === 'ALL' ? 'All Time' : w}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title={isExpanded ? 'Collapse telemetry drawer' : 'Expand detailed telemetry readout'}
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* Mode 1: Temporal Network Evolution View */}
      {activeTab === 'TEMPORAL_GRAPH' && (
        <>
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mb-1.5">
            <span>2026-01-05 00:00 UTC &nbsp;→&nbsp; 2026-02-26 11:00 UTC</span>
            <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
              Active Snapshot: {dateList[currentDateIndex] || 'Latest'}
            </span>
          </div>

          {/* Histogram distribution of communication / financial bursts */}
          <div className="flex items-end gap-1 h-5 mb-1.5 px-0.5">
            {histogramBars.map((bar, i) => {
              const ratio = currentDateIndex / Math.max(1, dateList.length - 1);
              const isPassed = i / histogramBars.length <= ratio;
              return (
                <div
                  key={i}
                  className={`flex-1 rounded-xs transition-all duration-200 ${
                    isPassed ? bar.color : 'bg-slate-200 opacity-60'
                  }`}
                  style={{ height: `${bar.height}%` }}
                />
              );
            })}
          </div>

          {/* Slider Scrubber Track */}
          <div className="relative mb-2">
            <input
              type="range"
              min={0}
              max={dateList.length - 1}
              value={currentDateIndex}
              onChange={(e) => handleSeek(Number(e.target.value))}
              className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>
        </>
      )}

      {/* Mode 2: 4D Telemetry Track & Asset Route */}
      {activeTab === '4D_TELEMETRY' && (
        <div className="space-y-2 mb-2">
          {/* Asset Track Selector Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {availableTracks.map(t => {
              const isSelected = currentTrack?.id === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    onSelectTrack(t);
                    onWaypointChange(0);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 shrink-0 transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70 border border-slate-200'
                  }`}
                >
                  {t.assetType === 'VESSEL' ? (
                    <Ship className="w-3 h-3 text-cyan-200" />
                  ) : (
                    <Truck className="w-3 h-3 text-amber-300" />
                  )}
                  <span>{t.assetName}</span>
                </button>
              );
            })}
          </div>

          {/* Waypoint Scrubber Track */}
          {currentTrack && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                <div className="flex items-center gap-1 text-slate-700 font-bold">
                  <Navigation className="w-3 h-3 text-blue-600" />
                  <span>Waypoint {currentWaypointIndex + 1} of {currentTrack.waypoints.length}</span>
                </div>
                <span>{currentWaypoint?.timestamp ? new Date(currentWaypoint.timestamp).toUTCString() : ''}</span>
              </div>

              <input
                type="range"
                min={0}
                max={Math.max(0, currentTrack.waypoints.length - 1)}
                value={currentWaypointIndex}
                onChange={(e) => {
                  setIsPlaying(false);
                  const idx = Number(e.target.value);
                  onWaypointChange(idx);
                  const wp = currentTrack.waypoints[idx];
                  if (wp && onFocusCoordinates) {
                    onFocusCoordinates(wp.lat, wp.lng);
                  }
                }}
                className="w-full accent-rose-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>
          )}
        </div>
      )}

      {/* Expanded Live Telemetry Sensor Readout & Seal Inspection Card */}
      {isExpanded && currentWaypoint && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 mb-2 shadow-2xs animate-in fade-in duration-150">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
                <span>{currentWaypoint.locationName}</span>
                {onFocusCoordinates && (
                  <button
                    onClick={() => onFocusCoordinates(currentWaypoint.lat, currentWaypoint.lng, 12)}
                    className="p-0.5 text-blue-600 hover:text-blue-800 rounded transition-colors"
                    title="Center on Geospatial Map"
                  >
                    <Crosshair className="w-3 h-3" />
                  </button>
                )}
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                GPS: {currentWaypoint.lat.toFixed(4)}°N, {currentWaypoint.lng.toFixed(4)}°E • {currentWaypoint.telemetryType}
              </div>
            </div>

            {/* Seal Status Pill */}
            <div className="shrink-0">
              {currentWaypoint.sealStatus === 'SEAL_INTACT' && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  SEAL INTACT
                </span>
              )}
              {currentWaypoint.sealStatus === 'SEAL_TAMPERED' && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1 animate-pulse">
                  <AlertTriangle className="w-3 h-3" />
                  SEAL TAMPERED
                </span>
              )}
              {currentWaypoint.sealStatus === 'CUSTOMS_SEIZED' && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" />
                  CUSTOMS SEIZED
                </span>
              )}
            </div>
          </div>

          <p className="text-[11px] text-slate-700 leading-relaxed mb-2 bg-white p-2 rounded-lg border border-slate-200">
            {currentWaypoint.notes}
          </p>

          {/* Sensor Gauges */}
          <div className="grid grid-cols-3 gap-2 text-[10px]">
            <div className="bg-white p-1.5 rounded-md border border-slate-200">
              <span className="text-slate-400 block text-[9px] uppercase font-semibold">Speed Over Ground</span>
              <span className="font-mono font-bold text-slate-900 text-xs">{currentWaypoint.speedKts} kts</span>
            </div>
            <div className="bg-white p-1.5 rounded-md border border-slate-200">
              <span className="text-slate-400 block text-[9px] uppercase font-semibold">True Heading</span>
              <span className="font-mono font-bold text-slate-900 text-xs">{currentWaypoint.headingDeg}°</span>
            </div>
            <div className="bg-white p-1.5 rounded-md border border-slate-200">
              <span className="text-slate-400 block text-[9px] uppercase font-semibold">Sensor Link</span>
              <span className="font-mono font-bold text-blue-600 text-xs truncate block">
                {currentWaypoint.sensorMetadata?.carrierSignal || 'SAT-RADAR'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Controls Row: Playback Buttons & Speed */}
      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
        
        {/* Left Playback Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentDateIndex(0);
              onWaypointChange(0);
            }}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Skip to Inception"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleTogglePlay}
            className="flex items-center gap-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentDateIndex(dateList.length - 1);
              if (currentTrack) {
                onWaypointChange(currentTrack.waypoints.length - 1);
              }
            }}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Skip to Latest"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentDateIndex(0);
              onWaypointChange(0);
            }}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>

        {/* Right Speed Multipliers */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-semibold text-slate-400 uppercase">Speed:</span>
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[10px] font-bold">
            {([1, 2, 5, 10] as const).map(s => (
              <button
                key={s}
                onClick={() => setPlaybackSpeed(s)}
                className={`px-1.5 py-0.5 rounded-md transition-all ${
                  playbackSpeed === s
                    ? 'bg-white text-blue-600 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
