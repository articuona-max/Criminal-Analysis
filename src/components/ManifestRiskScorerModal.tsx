import React, { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert, 
  Search, 
  CheckCircle2, 
  X, 
  Scale, 
  FileText, 
  Layers, 
  Anchor, 
  Ship, 
  Activity, 
  Eye, 
  Sliders,
  DollarSign
} from 'lucide-react';
import { 
  REAL_MANIFEST_ANOMALIES, 
  PORT_VULNERABILITY_INDEX, 
  ManifestAnomalyRecord, 
  PortVulnerabilityIndex 
} from '../data/intelligence4DEngine';

interface ManifestRiskScorerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManifestRiskScorerModal: React.FC<ManifestRiskScorerModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'MANIFEST_ANOMALIES' | 'PORT_INDEX' | 'LIVE_SIMULATOR'>('MANIFEST_ANOMALIES');
  const [selectedManifest, setSelectedManifest] = useState<ManifestAnomalyRecord>(REAL_MANIFEST_ANOMALIES[0]);

  // Live Simulator Inputs
  const [simWeight, setSimWeight] = useState<number>(38000);
  const [simValue, setSimValue] = useState<number>(20000);
  const [simInsurance, setSimInsurance] = useState<number>(150000);
  const [simOriginPort, setSimOriginPort] = useState<string>('IRBND');

  if (!isOpen) return null;

  // Compute live simulated anomaly score
  const insuranceRatio = simInsurance / Math.max(1, simValue);
  const originPenalty = simOriginPort === 'IRBND' || simOriginPort === 'AFG' ? 40 : 10;
  const insurancePenalty = insuranceRatio > 3 ? Math.min(50, Math.round(insuranceRatio * 8)) : 5;
  const calculatedSimScore = Math.min(99, originPenalty + insurancePenalty + 15);

  return (
    <div 
      id="manifest-risk-scorer-modal"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-200"
    >
      <div className="bg-[#FAF7F2] border border-[#DDD4C0] rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col font-sans overflow-hidden">
        
        {/* Top Header */}
        <div className="p-4 bg-[#F5EFE4] border-b border-[#DDD4C0] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#243324] text-white">
              <Scale className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-sm text-[#243324]">
                  Algorithmic Manifest Anomaly & Port Vulnerability Engine
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-100 text-red-800 border border-red-300">
                  Customs Risk Matrix
                </span>
              </div>
              <p className="text-xs text-[#526452]">
                Automated Discrepancy Scoring for Bills of Lading, Container X-Ray Densities & Port Fragility
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

        {/* Tabs */}
        <div className="flex items-center gap-2 px-4 pt-3 pb-2 border-b border-[#DDD4C0] bg-[#FAF7F2]">
          <button
            onClick={() => setActiveTab('MANIFEST_ANOMALIES')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'MANIFEST_ANOMALIES' 
                ? 'bg-[#243324] text-white shadow-xs' 
                : 'text-[#4A5B4C] hover:bg-[#EFE8DC]'
            }`}
          >
            Flagged Bills of Lading ({REAL_MANIFEST_ANOMALIES.length})
          </button>
          <button
            onClick={() => setActiveTab('PORT_INDEX')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'PORT_INDEX' 
                ? 'bg-[#243324] text-white shadow-xs' 
                : 'text-[#4A5B4C] hover:bg-[#EFE8DC]'
            }`}
          >
            Port Vulnerability Index (PVI)
          </button>
          <button
            onClick={() => setActiveTab('LIVE_SIMULATOR')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'LIVE_SIMULATOR' 
                ? 'bg-[#243324] text-white shadow-xs' 
                : 'text-[#4A5B4C] hover:bg-[#EFE8DC]'
            }`}
          >
            Live Shipment Risk Simulator
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* =========================================================================
              TAB 1: FLAGGED BILLS OF LADING
          ========================================================================= */}
          {activeTab === 'MANIFEST_ANOMALIES' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              
              {/* Manifests List */}
              <div className="md:col-span-5 space-y-2">
                {REAL_MANIFEST_ANOMALIES.map(man => {
                  const isSelected = selectedManifest?.id === man.id;
                  return (
                    <div
                      key={man.id}
                      onClick={() => setSelectedManifest(man)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-[#243324] text-white border-[#243324] shadow-md' 
                          : 'bg-[#FFFFFF] text-[#243324] border-[#DDD4C0] hover:bg-[#F8F4EC]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <span className="font-mono font-bold text-xs">{man.billOfLading}</span>
                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                          isSelected ? 'bg-red-500 text-white' : 'bg-red-100 text-red-800'
                        }`}>
                          Risk Score: {man.anomalyScore}/100
                        </span>
                      </div>

                      <div className={`text-xs font-medium ${isSelected ? 'text-[#DDEBDD]' : 'text-[#3E4F3E]'}`}>
                        {man.declaredCommodity}
                      </div>

                      <div className={`text-[11px] mt-1 ${isSelected ? 'text-[#B8C8B8]' : 'text-[#6B7D6C]'}`}>
                        {man.portOfLoading} → {man.portOfDischarge}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Manifest Details */}
              <div className="md:col-span-7 bg-[#FFFFFF] border border-[#DDD4C0] rounded-2xl p-4 space-y-3.5">
                {selectedManifest && (
                  <div className="space-y-3">
                    
                    <div className="flex items-start justify-between pb-2 border-b border-[#EDE5D5]">
                      <div>
                        <span className="font-mono text-xs font-bold text-[#243324]">{selectedManifest.billOfLading}</span>
                        <h4 className="font-bold text-sm text-[#243324] mt-0.5">{selectedManifest.declaredCommodity}</h4>
                        <div className="text-xs text-[#526452] mt-0.5">Carrier Vessel: {selectedManifest.vesselName}</div>
                      </div>

                      <div className="text-right">
                        <span className="text-lg font-mono font-extrabold text-red-700 block">
                          {selectedManifest.anomalyScore} / 100
                        </span>
                        <span className="text-[10px] uppercase font-bold text-red-800 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                          {selectedManifest.riskLevel} THREAT
                        </span>
                      </div>
                    </div>

                    {/* Financial & Weight Comparison */}
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="bg-[#FAF7F2] p-2 rounded-lg border border-[#E5DFD3]">
                        <span className="text-[#6B7D6C] text-[10px] uppercase block">Declared Value</span>
                        <span className="font-mono font-bold text-[#243324]">${selectedManifest.declaredValueUSD.toLocaleString()}</span>
                      </div>
                      <div className="bg-[#FAF7F2] p-2 rounded-lg border border-[#E5DFD3]">
                        <span className="text-[#6B7D6C] text-[10px] uppercase block">Freight Insurance</span>
                        <span className="font-mono font-bold text-red-700">${selectedManifest.freightInsuranceUSD.toLocaleString()}</span>
                      </div>
                      <div className="bg-[#FAF7F2] p-2 rounded-lg border border-[#E5DFD3]">
                        <span className="text-[#6B7D6C] text-[10px] uppercase block">Gross Weight</span>
                        <span className="font-mono font-bold text-[#243324]">{selectedManifest.declaredWeightKg.toLocaleString()} kg</span>
                      </div>
                    </div>

                    {/* Density Assay Discrepancy */}
                    <div className="bg-red-50/70 border border-red-200 p-3 rounded-xl text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-red-900">
                        <span>X-Ray Physical Density Discrepancy:</span>
                        <span className="font-mono">{selectedManifest.densityAnomaly.deviationPct}% Deviation</span>
                      </div>
                      <p className="text-[#4A5B4C]">
                        Expected Mineral Density: <strong>{selectedManifest.densityAnomaly.expectedDensityGcm3} g/cm³</strong> • 
                        Measured Scanner Core: <strong>{selectedManifest.densityAnomaly.measuredDensityGcm3} g/cm³</strong> (Consistent with Diacetylmorphine blend).
                      </p>
                    </div>

                    {/* Algorithmic Flags */}
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#6B7D6C] block mb-1.5">
                        Algorithmic Discrepancy Flags:
                      </span>
                      <div className="space-y-1.5">
                        {selectedManifest.flags.map((flag, idx) => (
                          <div key={idx} className="bg-[#FAF7F2] p-2 rounded-lg border border-[#E5DFD3] text-xs">
                            <div className="font-bold text-red-800 flex items-center gap-1.5">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              <span>{flag.name}</span>
                            </div>
                            <p className="text-[#4A5B4C] mt-0.5 text-[11px] leading-relaxed">
                              {flag.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recommended Intervention */}
                    <div className="bg-[#243324] text-white p-3 rounded-xl text-xs">
                      <strong className="text-amber-300 block mb-0.5">Mandatory Customs Intervention:</strong>
                      <span>{selectedManifest.recommendedIntervention}</span>
                    </div>

                  </div>
                )}
              </div>

            </div>
          )}

          {/* =========================================================================
              TAB 2: PORT VULNERABILITY INDEX
          ========================================================================= */}
          {activeTab === 'PORT_INDEX' && (
            <div className="space-y-3">
              <p className="text-xs text-[#526452]">
                Vulnerability ranking based on automated x-ray scanner penetration, historical seizure volume, and transit corridor topology:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {PORT_VULNERABILITY_INDEX.map(pvi => (
                  <div key={pvi.portCode} className="bg-[#FFFFFF] border border-[#DDD4C0] rounded-xl p-3.5 shadow-xs space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-mono text-[10px] font-bold text-[#6B7D6C]">{pvi.portCode} • {pvi.country}</span>
                        <h4 className="font-bold text-xs text-[#243324] mt-0.5">{pvi.portName}</h4>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-sm font-bold text-red-700 block">PVI {pvi.compositeScore}/100</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-red-100 text-red-800">
                          {pvi.riskCategory}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 text-[11px] pt-1 border-t border-[#EDE5D5]">
                      <div>
                        <span className="text-[9px] text-[#6B7D6C] block">Volume</span>
                        <span className="font-mono font-bold text-[#243324] text-[10px]">{pvi.annualContainerVolumeTEU}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-[#6B7D6C] block">X-Ray Scan %</span>
                        <span className="font-mono font-bold text-amber-700 text-[10px]">{pvi.xrayScannerCoveragePct}%</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-[#6B7D6C] block">Seizures</span>
                        <span className="font-mono font-bold text-red-700 text-[10px]">{pvi.historicalSeizuresCr}</span>
                      </div>
                    </div>

                    <div className="pt-1">
                      <span className="text-[10px] font-bold uppercase text-[#6B7D6C]">Key Fragilities:</span>
                      <ul className="text-[11px] text-[#4A5B4C] list-disc list-inside mt-0.5 space-y-0.5">
                        {pvi.primaryRiskVulnerabilities.map((v, i) => (
                          <li key={i}>{v}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB 3: LIVE SHIPMENT RISK SIMULATOR
          ========================================================================= */}
          {activeTab === 'LIVE_SIMULATOR' && (
            <div className="bg-[#FFFFFF] border border-[#DDD4C0] rounded-2xl p-4 space-y-4">
              <div>
                <h3 className="font-bold text-sm text-[#243324]">Customs Bill of Entry Risk Calculator</h3>
                <p className="text-xs text-[#526452] mt-0.5">
                  Adjust shipment parameters to observe automated targeting algorithms calculate anomaly scores.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Inputs */}
                <div className="space-y-3 bg-[#FAF7F2] p-3.5 rounded-xl border border-[#DDD4C0] text-xs">
                  <div>
                    <label className="font-bold text-[#243324] block mb-1">Declared Value (USD):</label>
                    <input
                      type="number"
                      value={simValue}
                      onChange={(e) => setSimValue(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white border border-[#DDD4C0] rounded-lg px-2.5 py-1.5 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#243324] block mb-1">Freight Insurance (USD):</label>
                    <input
                      type="number"
                      value={simInsurance}
                      onChange={(e) => setSimInsurance(parseFloat(e.target.value) || 0)}
                      className="w-full bg-white border border-[#DDD4C0] rounded-lg px-2.5 py-1.5 font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#243324] block mb-1">Origin Port of Loading:</label>
                    <select
                      value={simOriginPort}
                      onChange={(e) => setSimOriginPort(e.target.value)}
                      className="w-full bg-white border border-[#DDD4C0] rounded-lg px-2.5 py-1.5 text-xs font-semibold"
                    >
                      <option value="IRBND">Shahid Rajaee / Bandar Abbas (High Risk)</option>
                      <option value="AFG">Kandahar / Islam Qala Transit (Critical Risk)</option>
                      <option value="SGSIN">Singapore Jurong (Standard Risk)</option>
                      <option value="NLRTM">Rotterdam Port (Standard Risk)</option>
                    </select>
                  </div>
                </div>

                {/* Score Output */}
                <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#DDD4C0] flex flex-col justify-between items-center text-center">
                  <div>
                    <span className="text-xs uppercase font-bold text-[#6B7D6C] block">Automated Anomaly Score</span>
                    <div className="text-4xl font-mono font-extrabold text-red-700 my-2">
                      {calculatedSimScore} / 100
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      calculatedSimScore > 75 ? 'bg-red-100 text-red-800 border border-red-300' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {calculatedSimScore > 75 ? 'FLAGGED: MANDATORY X-RAY' : 'CLEAR: GREEN CHANNEL'}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#556755] mt-3">
                    Insurance-to-value ratio: <strong>{(simInsurance / Math.max(1, simValue)).toFixed(1)}x</strong>. Disproportionate coverage automatically triggers mandatory physical container de-stuffing.
                  </p>
                </div>

              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
