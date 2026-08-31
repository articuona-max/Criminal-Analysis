import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  SkipBack, 
  SkipForward 
} from 'lucide-react';

interface TimelineScrubberProps {
  currentDateIndex: number;
  setCurrentDateIndex: React.Dispatch<React.SetStateAction<number>>;
  dateList: string[];
  onFilterRangeChange?: (startDate: string, endDate: string) => void;
}

export const TimelineScrubber: React.FC<TimelineScrubberProps> = ({
  currentDateIndex,
  setCurrentDateIndex,
  dateList,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2 | 5 | 10>(1);
  const [timeWindow, setTimeWindow] = useState<'24H' | '7D' | '30D' | 'ALL'>('ALL');

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

  // Histogram distribution sample bar heights
  const histogramBars = [
    { height: 18, active: true, color: 'bg-blue-400' },
    { height: 28, active: true, color: 'bg-blue-500' },
    { height: 42, active: true, color: 'bg-blue-600' },
    { height: 22, active: true, color: 'bg-blue-400' },
    { height: 35, active: true, color: 'bg-blue-500' },
    { height: 48, active: true, color: 'bg-cyan-500' },
    { height: 15, active: true, color: 'bg-blue-400' },
    { height: 24, active: true, color: 'bg-blue-500' },
    { height: 38, active: true, color: 'bg-blue-600' },
    { height: 19, active: true, color: 'bg-blue-400' },
    { height: 26, active: true, color: 'bg-blue-500' },
    { height: 32, active: true, color: 'bg-blue-500' },
    { height: 45, active: true, color: 'bg-cyan-500' },
    { height: 60, active: true, color: 'bg-amber-500' },
    { height: 50, active: true, color: 'bg-amber-500' },
    { height: 75, active: true, color: 'bg-amber-600' },
    { height: 85, active: true, color: 'bg-orange-500' },
    { height: 65, active: true, color: 'bg-amber-500' },
    { height: 95, active: true, color: 'bg-rose-500' },
    { height: 100, active: true, color: 'bg-rose-600' }
  ];

  return (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 w-[94%] max-w-3xl bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-xl p-4 text-slate-800 select-none">
      
      {/* Top Header: Title, Active Window, Range Buttons */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Clock className="w-3 h-3" />
          </div>
          <h4 className="font-bold text-xs text-slate-900">
            Temporal Network Evolution
          </h4>
          <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100 font-mono">
            52 days active window
          </span>
        </div>

        {/* Range Buttons */}
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
      </div>

      {/* Date Span Subtitle */}
      <div className="text-[10px] font-mono text-slate-500 mb-2">
        2026-01-05 00:00 UTC &nbsp;→&nbsp; 2026-02-26 11:00 UTC
      </div>

      {/* Histogram Distribution Bars */}
      <div className="flex items-end gap-1 h-6 mb-1.5 px-0.5">
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
      <div className="relative mb-3">
        <input
          type="range"
          min={0}
          max={dateList.length - 1}
          value={currentDateIndex}
          onChange={(e) => {
            setIsPlaying(false);
            setCurrentDateIndex(Number(e.target.value));
          }}
          className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
        />
      </div>

      {/* Bottom Controls Row: Playback Buttons & Speed */}
      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
        
        {/* Left Playback Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentDateIndex(0);
            }}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            title="Skip to Inception"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-1.5 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-all"
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
