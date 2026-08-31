import React, { useState } from 'react';
import { 
  Users, 
  CheckCircle2, 
  X, 
  GitMerge, 
  Layers, 
  Fingerprint, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight,
  Database
} from 'lucide-react';
import { POLENode } from '../types';

interface EntityResolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMergeComplete: (canonicalId: string, mergedCount: number) => void;
}

export const EntityResolutionModal: React.FC<EntityResolutionModalProps> = ({
  isOpen,
  onClose,
  onMergeComplete,
}) => {
  const [similarityThreshold, setSimilarityThreshold] = useState(0.85);
  const [isMerging, setIsMerging] = useState(false);
  const [merged, setMerged] = useState(false);

  if (!isOpen) return null;

  const candidateGroup = {
    canonicalName: 'Tariq "The Shadow" Qureshi',
    canonicalId: 'p-01',
    confidenceScore: 0.94,
    matches: [
      {
        source: 'CCTNS FIR Archive (Mumbai P.S.)',
        name: 'Tariq Mohammed Qureshi',
        alias: 'Tariq Bhai / The Shadow',
        phone: '+971-50-8492011',
        biometricNafis: 'NAFIS-IND-77821',
        similarity: 0.96,
      },
      {
        source: 'SWIFT Trade Invoicing KYC (Dubai NBD)',
        name: 'T. M. Qureshi',
        alias: 'Director, Al-Bahar Shipping LLC',
        phone: '+971-50-8492011',
        biometricNafis: 'Unverified KYC',
        similarity: 0.92,
      },
      {
        source: 'Telecom CDR Subscriber Registry (Airtel)',
        name: 'Tariq Q.',
        alias: 'Burner SIM Holder #01',
        phone: '+91-98201-88492',
        biometricNafis: 'NAFIS-IND-77821',
        similarity: 0.94,
      }
    ]
  };

  const handleMerge = () => {
    setIsMerging(true);
    setTimeout(() => {
      setIsMerging(false);
      setMerged(true);
      onMergeComplete(candidateGroup.canonicalId, candidateGroup.matches.length);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl text-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-slate-900">
                  Vector Entity Resolution Studio
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  ChromaDB + Complete Linkage Clustering
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Phase 2 Core: Resolves fragmented suspect records across CCTNS, Telecom, SWIFT and NAFIS Biometrics into Golden Canonical Records.
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

        {/* Content */}
        <div className="py-5 space-y-6">
          
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div>
              <span className="text-xs text-slate-500 block font-medium">Similarity Threshold (Cosine)</span>
              <span className="text-sm font-bold text-indigo-600">≥ {similarityThreshold}</span>
            </div>
            <div className="flex-1 max-w-xs mx-4">
              <input
                type="range"
                min="0.70"
                max="0.99"
                step="0.01"
                value={similarityThreshold}
                onChange={(e) => setSimilarityThreshold(Number(e.target.value))}
                className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>
            <div className="text-xs text-slate-500 font-medium">
              3 Duplicate Records Detected (Cluster #882)
            </div>
          </div>

          {/* Golden Record Candidate Banner */}
          <div className="bg-indigo-50/60 border border-indigo-100 p-4 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase text-indigo-700 font-bold block mb-1">
                Proposed Golden Canonical Record
              </span>
              <h4 className="text-sm font-bold text-slate-900">{candidateGroup.canonicalName}</h4>
              <p className="text-xs text-slate-500">ID: {candidateGroup.canonicalId} • Global High-Value Target</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 block font-medium">Vector Linkage Confidence</span>
              <span className="text-base font-bold text-emerald-600">{(candidateGroup.confidenceScore * 100).toFixed(0)}% Match</span>
            </div>
          </div>

          {/* Candidate Cluster Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {candidateGroup.matches.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl space-y-2.5 relative overflow-hidden"
              >
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 truncate max-w-[160px]">
                    {item.source.split(' ')[0]}
                  </span>
                  <span className="text-[11px] font-bold text-indigo-600">
                    {(item.similarity * 100).toFixed(0)}%
                  </span>
                </div>

                <div>
                  <h5 className="font-bold text-xs text-slate-900">{item.name}</h5>
                  <p className="text-[11px] text-slate-500">Alias: {item.alias}</p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 text-[11px] space-y-1 text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Phone:</span>
                    <span className="font-mono text-[10px]">{item.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Biometric:</span>
                    <span className="text-emerald-700 font-semibold">{item.biometricNafis}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Vector Features Explainer */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs text-slate-700 space-y-2">
            <h5 className="font-bold text-slate-900 uppercase text-[11px]">
              Evidentiary Merge Criteria
            </h5>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600">
              <li>Text Embeddings (OpenAI / Gemini text-embedding-004) Cosine Distance = 0.94</li>
              <li>NAFIS Fingerprint Pattern Deterministic Match: 100% (Pattern #NAFIS-IND-77821)</li>
              <li>Telecom IMEI Cell Tower Co-location Index = 0.91 within Mumbai Central jurisdiction</li>
            </ul>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleMerge}
            disabled={isMerging || merged}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold transition-colors shadow-sm"
          >
            <GitMerge className="w-4 h-4" />
            <span>{merged ? 'Golden Record Merged ✓' : isMerging ? 'Executing Merge...' : 'Merge into Golden Record'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
