import React, { useState } from 'react';
import { 
  Network, 
  Combine, 
  CheckCircle2, 
  X, 
  ShieldAlert, 
  Sparkles, 
  ArrowRight, 
  Smartphone, 
  Building2, 
  UserCheck, 
  Layers, 
  Share2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { REAL_CROSS_CASE_OVERLAPS, CrossCaseOverlapNode } from '../data/intelligence4DEngine';
import { CaseId } from '../types';

interface CrossCaseNexusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNodeOnGraph?: (nodeId: string) => void;
}

export const CrossCaseNexusModal: React.FC<CrossCaseNexusModalProps> = ({
  isOpen,
  onClose,
  onSelectNodeOnGraph
}) => {
  const [selectedOverlap, setSelectedOverlap] = useState<CrossCaseOverlapNode>(REAL_CROSS_CASE_OVERLAPS[0]);
  const [mergedNodes, setMergedNodes] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const handleMergeToGoldenRecord = (id: string) => {
    setMergedNodes(prev => ({ ...prev, [id]: true }));
  };

  return (
    <div 
      id="cross-case-nexus-modal"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-200"
    >
      <div className="bg-[#FAF7F2] border border-[#DDD4C0] rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col font-sans overflow-hidden">
        
        {/* Top Header */}
        <div className="p-4 bg-[#F5EFE4] border-b border-[#DDD4C0] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#243324] text-white">
              <Combine className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-sm text-[#243324]">
                  Cross-Case Entity Resolution & Syndicate Overlap Engine
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Nexus Intelligence
                </span>
              </div>
              <p className="text-xs text-[#526452]">
                Automated Graph Intersection across PNB Fraud, Mundra Narco-Terror & Operation Trojan Shield
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7A8C7A] hover:text-[#243324] hover:bg-[#EAE2D2]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body 2-Column Workspace */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-0">
          
          {/* Left Column: Overlapping Entities List */}
          <div className="md:col-span-5 border-r border-[#DDD4C0] overflow-y-auto p-3 space-y-2 bg-[#FAF7F2]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B7D6C] px-1 block mb-2">
              Detected Shared Syndicate Entities ({REAL_CROSS_CASE_OVERLAPS.length}):
            </span>

            {REAL_CROSS_CASE_OVERLAPS.map(overlap => {
              const isSelected = selectedOverlap?.id === overlap.id;
              const isMerged = mergedNodes[overlap.id];

              return (
                <div
                  key={overlap.id}
                  onClick={() => setSelectedOverlap(overlap)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-[#243324] text-white border-[#243324] shadow-md' 
                      : 'bg-[#FFFFFF] text-[#243324] border-[#DDD4C0] hover:bg-[#F8F4EC]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <div className="font-bold text-xs">
                      {overlap.canonicalName}
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded shrink-0 ${
                      isSelected ? 'bg-amber-400 text-black' : 'bg-red-100 text-red-800'
                    }`}>
                      {overlap.overlapScore}% Match
                    </span>
                  </div>

                  {/* Badges of Participating Cases */}
                  <div className="flex items-center gap-1 flex-wrap my-1.5">
                    {overlap.participatingCases.map((c, i) => (
                      <span 
                        key={i} 
                        className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-[#4A5B4C] border border-gray-200'
                        }`}
                      >
                        {c.caseName.split(' ')[0]}
                      </span>
                    ))}
                  </div>

                  {isMerged && (
                    <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 mt-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Synthesized into Golden Record</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Detailed Resolution Dossier */}
          <div className="md:col-span-7 overflow-y-auto p-4 space-y-4 bg-[#FFFFFF]">
            {selectedOverlap && (
              <div className="space-y-4">
                
                {/* Entity Identity Header */}
                <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#DDD4C0]">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase font-bold text-[#6B7D6C]">
                        Canonical Identity Profile
                      </span>
                      <h3 className="font-bold text-base text-[#243324] mt-0.5">
                        {selectedOverlap.canonicalName}
                      </h3>
                      <div className="text-xs text-[#526452] mt-1">
                        Aliases: {selectedOverlap.resolvedAliases.join(' • ')}
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-red-100 text-red-800 border border-red-300">
                      Nexus Score: {selectedOverlap.overlapScore}%
                    </span>
                  </div>
                </div>

                {/* Roles Across Multiple Active Investigations */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B7D6C] mb-2">
                    Investigative Roles Across Cases:
                  </h4>
                  <div className="space-y-2">
                    {selectedOverlap.participatingCases.map((c, idx) => (
                      <div key={idx} className="bg-[#FBF9F5] p-2.5 rounded-lg border border-[#DDD4C0] text-xs">
                        <div className="font-bold text-[#243324] flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-red-600"></span>
                          <span>{c.caseName}</span>
                        </div>
                        <div className="text-[#556755] mt-1 pl-3.5">
                          Role: <strong>{c.localRole}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Common Cryptographic & Physical Indicators */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B7D6C] mb-2">
                    Confirmed Shared Indicators & Tokens:
                  </h4>
                  <div className="space-y-1.5">
                    {selectedOverlap.sharedIndicators.map((ind, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs bg-[#FAF7F2] p-2 rounded-lg border border-[#E5DFD3]">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-mono text-[#243324]">{ind}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Investigative Significance */}
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-950">
                  <strong>Investigative Significance:</strong>
                  <p className="mt-1 leading-relaxed">{selectedOverlap.investigativeSignificance}</p>
                </div>

                {/* Action Bar */}
                <div className="pt-2 flex items-center justify-between border-t border-[#DDD4C0]">
                  <button
                    onClick={() => handleMergeToGoldenRecord(selectedOverlap.id)}
                    disabled={mergedNodes[selectedOverlap.id]}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                      mergedNodes[selectedOverlap.id]
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-[#243324] text-white hover:bg-[#182318] shadow-xs'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>{mergedNodes[selectedOverlap.id] ? 'Golden Record Synthesized ✓' : 'Synthesize Golden Master Entity'}</span>
                  </button>

                  <button
                    onClick={onClose}
                    className="px-3 py-2 rounded-xl text-xs font-semibold bg-[#EFE8DC] text-[#4A5B4C] hover:bg-[#E4DAC6]"
                  >
                    Close Studio
                  </button>
                </div>

              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
