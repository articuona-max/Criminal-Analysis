import React, { useState } from 'react';
import { 
  Database, 
  Activity, 
  RefreshCw, 
  AlertOctagon, 
  CheckCircle2, 
  Play, 
  Pause, 
  ArrowUpRight, 
  Layers,
  FileCode,
  HardDrive,
  Cpu
} from 'lucide-react';
import { IngestionPipelineStat } from '../types';
import { INGESTION_PIPELINES } from '../data/mockData';

export const IngestionStudio: React.FC = () => {
  const [pipelines, setPipelines] = useState<IngestionPipelineStat[]>(INGESTION_PIPELINES);
  const [isSimulating, setIsSimulating] = useState(true);

  // Trigger simulated batch ingestion
  const handleTriggerBatch = (pipeId: string) => {
    setPipelines(prev => prev.map(pipe => {
      if (pipe.id === pipeId) {
        return {
          ...pipe,
          ingested_count: pipe.ingested_count + Math.floor(Math.random() * 50) + 10,
          last_batch_time: 'Just now',
          throughput_per_sec: +(pipe.throughput_per_sec + (Math.random() * 5 - 2)).toFixed(1)
        };
      }
      return pipe;
    }));
  };

  return (
    <div className="w-full h-[calc(100vh-140px)] min-h-[600px] bg-slate-50 p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Info */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
                Phase 1: Async Ingestion Engine
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-emerald-700 font-semibold">5 Active Worker Pools</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1.5">
              Data Ingestion, Backpressure & Dead Letter Queue (DLQ)
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Bounded queues (maxsize=1000) with micro-batching, exponential backoff retries, and schema normalization across CCTNS, Telecom, SWIFT, and SOCMINT.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setPipelines(prev => prev.map(p => ({
                  ...p,
                  ingested_count: p.ingested_count + Math.floor(Math.random() * 200) + 50,
                  last_batch_time: 'Just now'
                })));
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors shadow-xs"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Flush All Micro-Batches</span>
            </button>
          </div>
        </div>

        {/* Aggregate Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
            <span className="text-[11px] text-slate-500 font-semibold block mb-1">
              TOTAL RECORDS INGESTED
            </span>
            <div className="text-2xl font-bold text-indigo-600">
              {pipelines.reduce((sum, p) => sum + p.ingested_count, 0).toLocaleString()}
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">▲ +2,450/sec continuous</span>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
            <span className="text-[11px] text-slate-500 font-semibold block mb-1">
              FAILED RETRIES / BUFFER
            </span>
            <div className="text-2xl font-bold text-amber-600">
              {pipelines.reduce((sum, p) => sum + p.failed_count, 0)} Records
            </div>
            <span className="text-[10px] text-slate-500 font-medium mt-1 block">Full Jitter Exponential Backoff</span>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
            <span className="text-[11px] text-slate-500 font-semibold block mb-1">
              DEAD LETTER QUEUE (DLQ)
            </span>
            <div className="text-2xl font-bold text-rose-600">
              {pipelines.reduce((sum, p) => sum + p.dlq_count, 0)} Records
            </div>
            <span className="text-[10px] text-slate-500 font-medium mt-1 block">Permanent Schema Violations</span>
          </div>

          <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
            <span className="text-[11px] text-slate-500 font-semibold block mb-1">
              AVERAGE BACKPRESSURE
            </span>
            <div className="text-2xl font-bold text-purple-600">
              {(pipelines.reduce((sum, p) => sum + p.backpressure_pct, 0) / pipelines.length).toFixed(0)}% Capacity
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">Semaphore: Max 10 Concurrent</span>
          </div>
        </div>

        {/* Ingestion Pipelines Table */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 bg-slate-50/50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-xs tracking-tight">
              Active Data Connector Pipelines
            </h3>
            <span className="text-xs text-slate-500 font-medium">Worker Pool: asyncio.Queue(maxsize=1000)</span>
          </div>

          <div className="divide-y divide-slate-100">
            {pipelines.map((pipe) => (
              <div key={pipe.id} className="p-4 hover:bg-slate-50/80 transition-colors space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{pipe.name}</h4>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        pipe.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        pipe.status === 'BACKPRESSURE' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-rose-50 text-rose-700 border-rose-200'
                      }`}>
                        {pipe.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{pipe.source_type}</p>
                  </div>

                  <div className="flex items-center gap-5 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold">INGESTED</span>
                      <strong className="text-indigo-600 font-semibold">{pipe.ingested_count.toLocaleString()}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold">THROUGHPUT</span>
                      <strong className="text-slate-700 font-semibold">{pipe.throughput_per_sec}/s</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold">DLQ FAILS</span>
                      <strong className="text-rose-600 font-semibold">{pipe.dlq_count}</strong>
                    </div>
                    <button
                      onClick={() => handleTriggerBatch(pipe.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 border border-slate-200 text-xs font-semibold transition-colors"
                    >
                      Trigger Run
                    </button>
                  </div>
                </div>

                {/* Backpressure Progress Bar */}
                <div>
                  <div className="flex justify-between text-[10px] text-slate-500 font-medium mb-1">
                    <span>Queue Buffer Backpressure ({pipe.backpressure_pct}%)</span>
                    <span>Last Batch: {pipe.last_batch_time}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        pipe.backpressure_pct > 40 ? 'bg-amber-500' : 'bg-indigo-600'
                      }`}
                      style={{ width: `${pipe.backpressure_pct}%` }}
                    />
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
