import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Activity, 
  DollarSign, 
  PhoneCall, 
  Clock, 
  ArrowRight, 
  ShieldAlert, 
  Zap, 
  Radio, 
  AlertTriangle 
} from 'lucide-react';
import { POLENode } from '../types';

interface MotifAndBurstModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSubgraph: (nodeIds: string[]) => void;
}

export const MotifAndBurstModal: React.FC<MotifAndBurstModalProps> = ({
  isOpen,
  onClose,
  onSelectSubgraph,
}) => {
  const [activeTab, setActiveTab] = useState<'MOTIFS' | 'BURSTS'>('MOTIFS');

  if (!isOpen) return null;

  const circularLoopNodes = [
    { name: 'Al-Bahar Shipping LLC (Dubai)', amount: '₹14.8 Cr Invoiced', role: 'Trade Over-Invoicing Origin' },
    { name: 'Horizon Bullion Traders (Delhi)', amount: '₹14.2 Cr Dispersed', role: 'Bullion Hawala Conversion' },
    { name: 'Delta Logistics (Mumbai)', amount: '₹13.9 Cr Layered', role: 'Domestic Shell Clearing' },
    { name: 'Al-Bahar Shipping LLC (Dubai)', amount: '₹13.5 Cr Repatriated', role: 'Capital Round-Trip Completed' },
  ];

  const smurfingMules = [
    { name: 'Mule Account #01 (Bhiwandi)', amount: '₹48,500', time: '14:02:11' },
    { name: 'Mule Account #02 (Kalyan)', amount: '₹49,200', time: '14:03:45' },
    { name: 'Mule Account #03 (Thane)', amount: '₹47,800', time: '14:05:10' },
    { name: 'Mule Account #04 (Dombivli)', amount: '₹49,900', time: '14:06:22' },
    { name: 'Mule Account #05 (Kurla)', amount: '₹48,100', time: '14:07:05' },
    { name: 'Mule Account #06 (Dharavi)', amount: '₹49,500', time: '14:08:40' },
  ];

  const cdrBurstCalls = [
    { from: 'Tariq "The Shadow" (+971-50-8492011)', to: 'Vikram Malhotra (+91-98201-44321)', duration: '184s', time: '22:15:00', tower: 'TWR-DXB-01 ➔ TWR-MUM-402' },
    { from: 'Vikram Malhotra (+91-98201-44321)', to: 'Farhan Azmi (+91-98201-88492)', duration: '92s', time: '22:19:12', tower: 'TWR-MUM-402 ➔ TWR-ALIBAUG-09' },
    { from: 'Farhan Azmi (+91-98201-88492)', to: 'Mandwa Offload Crew', duration: '45s', time: '22:24:05', tower: 'TWR-ALIBAUG-09 ➔ TWR-COAST-01' },
    { from: 'Vikram Malhotra (+91-98201-44321)', to: 'Tariq "The Shadow" (+971-50-8492011)', duration: '32s', time: '22:31:40', tower: 'TWR-MUM-402 ➔ TWR-DXB-01' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl text-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-slate-900">
                  Motif Detection & Telecom Burst Analyzer
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Graph Neural Network & Temporal Wavelet
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Identifies circular money laundering topologies, fan-out smurfing mules below statutory thresholds, and pre-operational CDR call bursts.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-2 mt-4 bg-slate-100 p-1 rounded-xl border border-slate-200/80 w-fit">
          <button
            onClick={() => setActiveTab('MOTIFS')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'MOTIFS'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Financial Motifs (Circular & Smurfing)</span>
          </button>

          <button
            onClick={() => setActiveTab('BURSTS')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'BURSTS'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>CDR Temporal Call Bursts</span>
          </button>
        </div>

        {/* Tab 1: Financial Motifs */}
        {activeTab === 'MOTIFS' && (
          <div className="py-4 space-y-6">
            
            {/* Circular Loop */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <h4 className="font-bold text-sm text-slate-900">
                    Motif #01: Circular Round-Trip Transaction Loop (₹14.8 Cr)
                  </h4>
                </div>
                <button
                  onClick={() => {
                    onSelectSubgraph(['acc-01', 'acc-02', 'acc-03']);
                    onClose();
                  }}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold hover:underline"
                >
                  Highlight in Force Graph →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                {circularLoopNodes.map((item, i) => (
                  <div key={i} className="p-3 bg-white rounded-xl border border-slate-200 space-y-1 shadow-2xs">
                    <span className="text-[10px] text-indigo-600 block font-bold">NODE {i + 1}</span>
                    <h5 className="font-bold text-xs text-slate-900">{item.name}</h5>
                    <span className="text-emerald-700 font-mono font-bold block">{item.amount}</span>
                    <span className="text-[10px] text-slate-500 block">{item.role}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Smurfing Fan-Out Star */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                  <h4 className="font-bold text-sm text-slate-900">
                    Motif #02: Fan-Out Smurfing Dispersal (Sub-₹50,000 RBI Threshold)
                  </h4>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                  Micro-Structuring Detected
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
                {smurfingMules.map((mule, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 flex justify-between items-center shadow-2xs">
                    <div>
                      <p className="font-semibold text-slate-900 text-xs">{mule.name}</p>
                      <span className="text-[10px] text-slate-500">Time: {mule.time}</span>
                    </div>
                    <span className="font-mono font-bold text-amber-700 text-xs">{mule.amount}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: CDR Bursts */}
        {activeTab === 'BURSTS' && (
          <div className="py-4 space-y-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    Pre-Operation Telecom Call Burst (Mandwa Ingress Window)
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    14 encrypted Voice/VoIP CDR events recorded across 4 burner SIMs within 22 minutes
                  </p>
                </div>
                <button
                  onClick={() => {
                    onSelectSubgraph(['ph-01', 'ph-02', 'ph-03']);
                    onClose();
                  }}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold hover:underline"
                >
                  Highlight Burner Cluster →
                </button>
              </div>

              <div className="space-y-2">
                {cdrBurstCalls.map((call, i) => (
                  <div key={i} className="p-3 bg-white rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs shadow-2xs">
                    <div className="flex items-center gap-2.5">
                      <PhoneCall className="w-4 h-4 text-indigo-600 shrink-0" />
                      <div>
                        <p className="font-semibold text-slate-900">{call.from} ➔ {call.to}</p>
                        <span className="text-[10px] text-slate-500">{call.tower}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-slate-500">Duration: <strong className="text-slate-900 font-semibold">{call.duration}</strong></span>
                      <span className="text-indigo-600 font-semibold">{call.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
          >
            Close Engine View
          </button>
        </div>

      </div>
    </div>
  );
};
