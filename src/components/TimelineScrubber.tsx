import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Calendar, Activity, Zap } from 'lucide-react';

interface TimelineScrubberProps {
  currentDateIndex: number;
  setCurrentDateIndex: (index: number) => void;
  dateList: string[];
  onFilterRangeChange?: (startDate: string, endDate: string) => void;
}

export const TimelineScrubber: React.FC<TimelineScrubberProps> = ({
  currentDateIndex,
  setCurrentDateIndex,
  dateList,
  onFilterRangeChange
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2 | 5>(1);

  // Playback animation loop
  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = 1200 / playbackSpeed;
    const timer = setInterval(() => {
      setCurrentDateIndex(prev => {
        if (prev >= dateList.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, dateList.length, setCurrentDateIndex]);

  const activeDate = dateList[currentDateIndex] || dateList[dateList.length - 1];

  // Activity distribution mock heights for histogram
  const activityHeights = [20, 35, 45, 60, 30, 85, 40, 95, 70, 100];

  return (
    <div className="bg-white/95 backdrop-blur-md border-t border-slate-200 px-5 py-3 text-slate-800 z-20 shadow-xs">
      <div className="max-w-[1920px] mx-auto flex flex-wrap items-center justify-between gap-4">
        
        {/* Playback Controls & Date Display */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                isPlaying
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'bg-indigo-600 text-white shadow-xs hover:bg-indigo-700'
              }`}
              title={isPlaying ? 'Pause Simulation' : 'Play Timeline Evolution'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentDateIndex(0);
              }}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 transition-colors"
              title="Reset Timeline to Start"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                Timeline Evolution
              </div>
              <div className="text-xs font-bold text-slate-900">
                {activeDate ? new Date(activeDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Live Active'}
              </div>
            </div>
          </div>
        </div>

        {/* Temporal Scrubber & Histogram Bar */}
        <div className="flex-1 max-w-2xl mx-4 flex flex-col justify-center">
          {/* Activity Spikes Histogram */}
          <div className="flex items-end gap-1.5 h-5 mb-1.5 px-1">
            {activityHeights.map((h, i) => {
              const isActive = i <= (currentDateIndex / (dateList.length - 1)) * (activityHeights.length - 1);
              return (
                <div
                  key={i}
                  className={`flex-1 rounded-t-sm transition-all duration-300 ${
                    isActive ? 'bg-indigo-600 opacity-90' : 'bg-slate-200 opacity-60'
                  }`}
                  style={{ height: `${h}%` }}
                />
              );
            })}
          </div>

          {/* Range Slider */}
          <input
            type="range"
            min={0}
            max={dateList.length - 1}
            value={currentDateIndex}
            onChange={(e) => {
              setIsPlaying(false);
              setCurrentDateIndex(Number(e.target.value));
            }}
            className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
          />

          <div className="flex justify-between text-[10px] text-slate-500 font-medium mt-1">
            <span>Jan 2024 (Syndicate Inception)</span>
            <span>Aug 2026 (Mandwa Intercept / Seizure)</span>
          </div>
        </div>

        {/* Speed Multiplier & Status */}
        <div className="flex items-center gap-2.5">
          <span className="text-[10px] text-slate-500 uppercase font-bold">Speed:</span>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            {([1, 2, 5] as const).map(speed => (
              <button
                key={speed}
                onClick={() => setPlaybackSpeed(speed)}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                  playbackSpeed === speed
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700 font-semibold">
            <Zap className="w-3.5 h-3.5 text-indigo-600" />
            <span>Temporal Sync Active</span>
          </div>
        </div>

      </div>
    </div>
  );
};
