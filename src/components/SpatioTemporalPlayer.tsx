import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  Compass, 
  Activity, 
  Radio, 
  ShieldAlert, 
  ShieldCheck, 
  Truck, 
  Ship, 
  Clock, 
  Layers, 
  AlertTriangle,
  ChevronRight,
  Maximize2,
  X
} from 'lucide-react';
import { REAL_4D_TRACKS, TelemetryTrack, TelemetryWaypoint } from '../data/intelligence4DEngine';
import { CaseId } from '../types';

interface SpatioTemporalPlayerProps {
  selectedCaseId: CaseId;
  activeTrack: TelemetryTrack | null;
  onSelectTrack: (track: TelemetryTrack) => void;
  currentWaypointIndex: number;
  onWaypointChange: (index: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  playbackSpeed: number;
  onChangeSpeed: (speed: number) => void;
  onClose?: () => void;
}

export const SpatioTemporalPlayer: React.FC<SpatioTemporalPlayerProps> = ({
  selectedCaseId,
  activeTrack,
  onSelectTrack,
  currentWaypointIndex,
  onWaypointChange,
  isPlaying,
  onTogglePlay,
  playbackSpeed,
  onChangeSpeed,
  onClose
}) => {
  const tracks = REAL_4D_TRACKS.filter(t => selectedCaseId === 'CASE_ALL' || t.caseId === selectedCaseId);
  const track = activeTrack || tracks[0] || REAL_4D_TRACKS[0];
  const currentWp: TelemetryWaypoint | undefined = track?.waypoints[currentWaypointIndex] || track?.waypoints[0];

  const totalWaypoints = track?.waypoints.length || 0;
  const progressPct = totalWaypoints > 1 ? (currentWaypointIndex / (totalWaypoints - 1)) * 100 : 0;

  return (
    <div 
      id="spatio-temporal-4d-player"
      className="bg-[#FAF7F2]/95 backdrop-blur-md rounded-2xl border border-[#DDD4C0] shadow-2xl p-4 text-[#243324] font-sans max-w-xl w-full select-none"
    >
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#DDD4C0]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#243324] text-white">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs uppercase tracking-wider text-[#243324]">
                4D Spatio-Temporal Playback
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-red-100 text-red-800 border border-red-200">
                AIS & SATELLITE TELEMETRY
              </span>
            </div>
            <p className="text-[11px] text-[#556755]">
              Real-world GPS Waypoint Sequence & Cargo Seal Verification
            </p>
          </div>
        </div>

        {onClose && (
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-[#7E9B82] hover:text-[#243324] hover:bg-[#EFE8DC]"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Asset Track Selector Tabs */}
      <div className="flex items-center gap-1.5 mb-3 overflow-x-auto pb-1">
        {tracks.map(t => {
          const isSelected = track?.id === t.id;
          return (
            <button
              key={t.id}
              onClick={() => {
                onSelectTrack(t);
                onWaypointChange(0);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all ${
                isSelected 
                  ? 'bg-[#243324] text-white shadow-xs' 
                  : 'bg-[#EFE8DC] text-[#4A5B4C] hover:bg-[#E4DAC6]'
              }`}
            >
              {t.assetType === 'VESSEL' ? <Ship className="w-3 h-3 text-sky-400" /> : <Truck className="w-3 h-3 text-amber-400" />}
              <span>{t.assetName.split(' ')[0]} {t.assetName.split(' ')[1]}</span>
            </button>
          );
        })}
      </div>

      {/* Active Waypoint Live Telemetry Card */}
      {currentWp && (
        <div className="bg-[#FFFFFF] border border-[#DDD4C0] rounded-xl p-3 mb-3 shadow-xs">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#243324]">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                <span>{currentWp.locationName}</span>
              </div>
              <div className="text-[11px] text-[#5B6D5C] font-mono mt-0.5">
                GPS: {currentWp.lat.toFixed(4)}°N, {currentWp.lng.toFixed(4)}°E • {new Date(currentWp.timestamp).toUTCString()}
              </div>
            </div>

            {/* Seal Status Pill */}
            <div className="shrink-0">
              {currentWp.sealStatus === 'SEAL_INTACT' && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  SEAL INTACT
                </span>
              )}
              {currentWp.sealStatus === 'SEAL_TAMPERED' && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1 animate-pulse">
                  <AlertTriangle className="w-3 h-3" />
                  SEAL TAMPERED
                </span>
              )}
              {currentWp.sealStatus === 'CUSTOMS_SEIZED' && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-300 flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" />
                  CUSTOMS SEIZED
                </span>
              )}
            </div>
          </div>

          <p className="text-xs text-[#384838] leading-relaxed mb-2 bg-[#FBF9F5] p-2 rounded-lg border border-[#EDE5D5]">
            {currentWp.notes}
          </p>

          {/* Sensor Gauge Badges */}
          <div className="grid grid-cols-3 gap-2 text-[11px]">
            <div className="bg-[#FAF7F2] p-1.5 rounded-md border border-[#E5DFD3]">
              <span className="text-[#6E806E] block text-[9px] uppercase font-semibold">Speed Over Ground</span>
              <span className="font-mono font-bold text-[#243324]">{currentWp.speedKts} kts / {Math.round(currentWp.speedKts * 1.852)} km/h</span>
            </div>
            <div className="bg-[#FAF7F2] p-1.5 rounded-md border border-[#E5DFD3]">
              <span className="text-[#6E806E] block text-[9px] uppercase font-semibold">Heading / Course</span>
              <span className="font-mono font-bold text-[#243324] flex items-center gap-1">
                <Compass className="w-3 h-3 text-[#5A6D5A]" />
                {currentWp.headingDeg}° True
              </span>
            </div>
            <div className="bg-[#FAF7F2] p-1.5 rounded-md border border-[#E5DFD3]">
              <span className="text-[#6E806E] block text-[9px] uppercase font-semibold">Telemetry Sensor</span>
              <span className="font-mono font-bold text-[#243324] truncate">{currentWp.telemetryType.replace('_', ' ')}</span>
            </div>
          </div>
        </div>
      )}

      {/* Scrubbing Bar & Controls */}
      <div className="space-y-2">
        {/* Scrubber Slider */}
        <div className="relative">
          <input
            type="range"
            min={0}
            max={totalWaypoints - 1}
            value={currentWaypointIndex}
            onChange={(e) => onWaypointChange(parseInt(e.target.value))}
            className="w-full h-2 bg-[#E4DAC6] rounded-lg appearance-none cursor-pointer accent-[#243324]"
          />
          <div className="flex justify-between text-[10px] text-[#6E806E] font-mono mt-1">
            <span>Waypoint 1 of {totalWaypoints}</span>
            <span>Step {currentWaypointIndex + 1}: {currentWp?.locationName.split(' ')[0]}</span>
            <span>{Math.round(progressPct)}% Complete</span>
          </div>
        </div>

        {/* Playback Buttons Bar */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            {/* Play/Pause Button */}
            <button
              onClick={onTogglePlay}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all ${
                isPlaying 
                  ? 'bg-amber-600 text-white shadow-xs' 
                  : 'bg-[#243324] text-white hover:bg-[#182418] shadow-xs'
              }`}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? 'Pause 4D' : 'Play Motion'}</span>
            </button>

            {/* Reset to Start */}
            <button
              onClick={() => onWaypointChange(0)}
              className="p-1.5 rounded-lg bg-[#EFE8DC] text-[#4A5B4C] hover:text-[#243324] hover:bg-[#E4DAC6] border border-[#DDD4C0]"
              title="Rewind to Departure Point"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Step Next */}
            <button
              onClick={() => onWaypointChange(Math.min(totalWaypoints - 1, currentWaypointIndex + 1))}
              disabled={currentWaypointIndex >= totalWaypoints - 1}
              className="p-1.5 rounded-lg bg-[#EFE8DC] text-[#4A5B4C] hover:text-[#243324] hover:bg-[#E4DAC6] border border-[#DDD4C0] disabled:opacity-40"
              title="Next Waypoint"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Playback Speed Multipliers */}
          <div className="flex items-center gap-1 bg-[#EFE8DC] p-0.5 rounded-lg border border-[#DDD4C0] text-[11px] font-mono font-bold">
            {[1, 2, 5].map(spd => (
              <button
                key={spd}
                onClick={() => onChangeSpeed(spd)}
                className={`px-2 py-0.5 rounded transition-all ${
                  playbackSpeed === spd 
                    ? 'bg-[#243324] text-white shadow-2xs' 
                    : 'text-[#5B6D5C] hover:bg-[#E4DAC6]'
                }`}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
