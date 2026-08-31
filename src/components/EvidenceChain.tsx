import React, { useState } from 'react';
import { 
  GitCommit, 
  CheckCircle2, 
  FileText, 
  Lock, 
  ArrowRight, 
  ShieldCheck, 
  Download, 
  FileCheck, 
  ExternalLink,
  Clock,
  Hash,
  Layers,
  Scale
} from 'lucide-react';
import { CaseId, EvidenceStep, POLENode } from '../types';
import { ALL_EVIDENCE_CHAIN } from '../data/mockData';
import { REAL_CASE_PROFILES } from '../data/realCasesData';

interface EvidenceChainProps {
  nodes: POLENode[];
  onSelectNode: (node: POLENode | null) => void;
  selectedCaseId?: CaseId;
}

export const EvidenceChain: React.FC<EvidenceChainProps> = ({ 
  nodes, 
  onSelectNode,
  selectedCaseId = 'CASE_ALL'
}) => {
  const currentCase = REAL_CASE_PROFILES.find(c => c.id === selectedCaseId) || REAL_CASE_PROFILES[0];
  
  const caseEvidence = ALL_EVIDENCE_CHAIN.filter(e => {
    if (selectedCaseId === 'CASE_ALL') return true;
    return e.case_id === selectedCaseId;
  });

  const [selectedStep, setSelectedStep] = useState<EvidenceStep>(caseEvidence[0] || ALL_EVIDENCE_CHAIN[0]);

  // Keep selected step in sync with case changes
  React.useEffect(() => {
    if (caseEvidence.length > 0) {
      setSelectedStep(caseEvidence[0]);
    }
  }, [selectedCaseId]);

  const getNode = (id: string) => nodes.find(n => n.id === id);

  return (
    <div className="w-full h-[calc(100vh-140px)] min-h-[600px] bg-slate-50 p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Info */}
        <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
                SEC 65B Certified Evidence DAG
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-medium font-mono">{currentCase.code}</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Hash Chain: Blockchain Integrity Verified
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1.5">
              {currentCase.title}
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              {currentCase.summary}
            </p>
          </div>

          <button
            onClick={() => alert(`Exporting certified Section 65B Electronic Evidence Dossier for ${currentCase.title} with SHA-256 digital seals...`)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-all shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export Court Dossier (PDF)</span>
          </button>
        </div>

        {/* DAG Flow Step Indicator */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {caseEvidence.map((step, idx) => {
            const isSelected = selectedStep.id === step.id;
            return (
              <button
                key={step.id}
                onClick={() => setSelectedStep(step)}
                className={`relative p-4 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-white border-indigo-600 shadow-md ring-2 ring-indigo-500/20'
                    : 'bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
                    {step.category}
                  </span>
                </div>

                <h3 className="font-bold text-xs text-slate-900 line-clamp-1 mb-1">{step.title}</h3>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span className="truncate">{step.timestamp}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Step Detail Panel */}
        {selectedStep && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-indigo-600">EXHIBIT #{selectedStep.order}</span>
                  <span className="text-slate-300">•</span>
                  <span className="flex items-center gap-1 text-xs text-emerald-700 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {selectedStep.legal_admissibility}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{selectedStep.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{selectedStep.timestamp}</p>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Digital Forensic Checksum</span>
                <span className="text-[11px] font-mono text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 block mt-1 font-semibold">
                  {selectedStep.hash_checksum}
                </span>
              </div>
            </div>

            {/* Narrative description */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <h4 className="text-xs font-bold uppercase text-slate-500 mb-1">Evidentiary Narrative & Court Panchnama</h4>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">{selectedStep.description}</p>
            </div>

            {/* Source & Target Connected POLE Entities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Source */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Originating Subject / Asset</span>
                {(() => {
                  const srcNode = getNode(selectedStep.source_entity_id);
                  if (!srcNode) return <span className="text-xs text-slate-500 font-mono">{selectedStep.source_entity_id}</span>;
                  return (
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-xs font-bold text-slate-900">{srcNode.label}</h5>
                        <span className="text-[11px] text-indigo-600 font-medium">POLE Type: {srcNode.type}</span>
                      </div>
                      <button
                        onClick={() => onSelectNode(srcNode)}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold hover:underline"
                      >
                        View Dossier →
                      </button>
                    </div>
                  );
                })()}
              </div>

              {/* Target */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Target Institution / Seizure Target</span>
                {(() => {
                  const tgtNode = getNode(selectedStep.target_entity_id);
                  if (!tgtNode) return <span className="text-xs text-slate-500 font-mono">{selectedStep.target_entity_id}</span>;
                  return (
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-xs font-bold text-slate-900">{tgtNode.label}</h5>
                        <span className="text-[11px] text-indigo-600 font-medium">POLE Type: {tgtNode.type}</span>
                      </div>
                      <button
                        onClick={() => onSelectNode(tgtNode)}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold hover:underline"
                      >
                        View Dossier →
                      </button>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Attached Documents */}
            <div>
              <h4 className="text-xs font-bold uppercase text-slate-500 mb-2.5">
                Attached Court-Admissible Exhibits ({selectedStep.documents.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {selectedStep.documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-800 truncate">{doc.name}</p>
                        <p className="text-[10px] text-slate-500">{doc.type} • {doc.size}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => alert(`Downloading court exhibit: ${doc.name}`)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-white"
                      title="Download Evidence Exhibit"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

