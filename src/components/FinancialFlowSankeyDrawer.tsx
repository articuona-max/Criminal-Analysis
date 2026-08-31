import React, { useState } from 'react';
import { 
  DollarSign, 
  ArrowRight, 
  Layers, 
  ExternalLink, 
  FileText, 
  ShieldAlert, 
  X, 
  Sparkles, 
  CheckCircle2, 
  Building2, 
  Coins, 
  CreditCard,
  Globe2,
  TrendingDown,
  Info
} from 'lucide-react';
import { 
  REAL_FINANCIAL_FLOW_ARCS, 
  SANKEY_DATA, 
  FinancialFlowArc, 
  SankeyNodeData, 
  SankeyLinkData 
} from '../data/intelligence4DEngine';
import { CaseId } from '../types';

interface FinancialFlowSankeyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCaseId: CaseId;
  onSelectArcOnMap?: (arc: FinancialFlowArc) => void;
}

export const FinancialFlowSankeyDrawer: React.FC<FinancialFlowSankeyDrawerProps> = ({
  isOpen,
  onClose,
  selectedCaseId,
  onSelectArcOnMap
}) => {
  const [activeTab, setActiveTab] = useState<'SANKEY' | 'FLOW_LEDGER' | 'HAWALA_TOKENS'>('SANKEY');
  const [selectedNode, setSelectedNode] = useState<SankeyNodeData | null>(SANKEY_DATA.nodes[0]);
  const [selectedArc, setSelectedArc] = useState<FinancialFlowArc | null>(REAL_FINANCIAL_FLOW_ARCS[0]);

  if (!isOpen) return null;

  return (
    <div 
      id="financial-flow-sankey-drawer"
      className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-[#FAF7F2] border-l border-[#DDD4C0] shadow-2xl flex flex-col font-sans select-none animate-in slide-in-from-right duration-300"
    >
      {/* Top Header */}
      <div className="shrink-0 p-4 bg-[#F5EFE4] border-b border-[#DDD4C0] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#243324] text-white">
            <DollarSign className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-sm text-[#243324]">
                Multi-Jurisdiction Financial Flow & Hawala Engine
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300">
                ₹14,356 Cr Pipeline
              </span>
            </div>
            <p className="text-xs text-[#526452]">
              SWIFT FIN MT799 Traceability, Nostro Wire Laundering & Deira Hawala Token Drops
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
          onClick={() => setActiveTab('SANKEY')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'SANKEY' 
              ? 'bg-[#243324] text-white shadow-xs' 
              : 'text-[#4A5B4C] hover:bg-[#EFE8DC]'
          }`}
        >
          Sankey Capital Flow Stages
        </button>
        <button
          onClick={() => setActiveTab('FLOW_LEDGER')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'FLOW_LEDGER' 
              ? 'bg-[#243324] text-white shadow-xs' 
              : 'text-[#4A5B4C] hover:bg-[#EFE8DC]'
          }`}
        >
          SWIFT & Nostro Ledgers ({REAL_FINANCIAL_FLOW_ARCS.length})
        </button>
        <button
          onClick={() => setActiveTab('HAWALA_TOKENS')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'HAWALA_TOKENS' 
              ? 'bg-[#243324] text-white shadow-xs' 
              : 'text-[#4A5B4C] hover:bg-[#EFE8DC]'
          }`}
        >
          Hawala Token Verification
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* =========================================================================
            TAB 1: SANKEY STAGE PIPELINE
        ========================================================================= */}
        {activeTab === 'SANKEY' && (
          <div className="space-y-4">
            
            {/* Visual Stage Breakdown Columns */}
            <div className="bg-[#FFFFFF] border border-[#DDD4C0] rounded-2xl p-4 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#6B7D6C] mb-3 flex items-center justify-between">
                <span>Capital Conversion Pipeline (₹ Crores Flow)</span>
                <span className="font-mono text-[10px] text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                  Total Diversion: ₹14,356 Cr + ₹21,000 Cr Contraband
                </span>
              </h3>

              {/* Stage Cards Layout */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                
                {/* 1. Origin */}
                <div className="bg-red-50/70 border border-red-200 rounded-xl p-2.5 flex flex-col justify-between">
                  <div className="text-[10px] font-bold text-red-800 uppercase tracking-wider">1. Origin Hub</div>
                  <div className="my-2">
                    <div className="font-bold text-xs text-[#243324]">PNB Brady House</div>
                    <div className="text-[11px] text-red-700 font-mono font-bold">₹14,356 Cr LoUs</div>
                  </div>
                  <div className="text-[9px] text-[#6B7D6C]">Unapproved SWIFT Terminals</div>
                </div>

                {/* 2. Clearing */}
                <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-2.5 flex flex-col justify-between">
                  <div className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">2. Foreign Clearing</div>
                  <div className="my-2">
                    <div className="font-bold text-xs text-[#243324]">Nostro & Hawala</div>
                    <div className="text-[11px] text-amber-700 font-mono font-bold">₹9,200 Cr Credit</div>
                  </div>
                  <div className="text-[9px] text-[#6B7D6C]">UBI HK, Antwerp & Chandni Chowk</div>
                </div>

                {/* 3. Offshore Shells */}
                <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-2.5 flex flex-col justify-between">
                  <div className="text-[10px] font-bold text-purple-800 uppercase tracking-wider">3. Offshore Shells</div>
                  <div className="my-2">
                    <div className="font-bold text-xs text-[#243324]">Dubai & HK Fronts</div>
                    <div className="text-[11px] text-purple-700 font-mono font-bold">₹9,200 Cr Invoices</div>
                  </div>
                  <div className="text-[9px] text-[#6B7D6C]">Al-Bahar & Sunlight Gems</div>
                </div>

                {/* 4. Luxury Sinks */}
                <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-2.5 flex flex-col justify-between">
                  <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">4. Luxury Sinks</div>
                  <div className="my-2">
                    <div className="font-bold text-xs text-[#243324]">Real Estate & Havens</div>
                    <div className="text-[11px] text-emerald-700 font-mono font-bold">£120M Property</div>
                  </div>
                  <div className="text-[9px] text-[#6B7D6C]">Mayfair, St. Kitts CIP, NY</div>
                </div>

              </div>
            </div>

            {/* Interactive Sankey Node Selector */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B7D6C]">
                Interactive Flow Stages & Balances:
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {SANKEY_DATA.nodes.map(node => {
                  const isSelected = selectedNode?.id === node.id;
                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-[#243324] text-white border-[#243324] shadow-md' 
                          : 'bg-[#FFFFFF] text-[#243324] border-[#DDD4C0] hover:bg-[#F8F4EC]'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className={`text-[10px] font-mono uppercase font-bold px-1.5 py-0.2 rounded ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {node.stage} • {node.category}
                          </span>
                          <h4 className="font-bold text-xs mt-1">{node.name}</h4>
                        </div>
                        <span className={`font-mono text-xs font-bold ${isSelected ? 'text-amber-300' : 'text-red-700'}`}>
                          {node.amountFormatted}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Links associated with selected node */}
            {selectedNode && (
              <div className="bg-[#FFFFFF] border border-[#DDD4C0] rounded-xl p-3.5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#243324] pb-2 border-b border-[#EDE5D5]">
                  <ArrowRight className="w-4 h-4 text-emerald-600" />
                  <span>Direct Transfers Linked to: {selectedNode.name}</span>
                </div>

                <div className="space-y-1.5">
                  {SANKEY_DATA.links
                    .filter(l => l.source === selectedNode.id || l.target === selectedNode.id)
                    .map((link, idx) => (
                      <div key={idx} className="bg-[#FAF7F2] p-2 rounded-lg border border-[#E5DFD3] text-xs flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-[#243324]">{link.label}</span>
                          <span className="text-[11px] text-[#6B7D6C] block">Method: {link.mechanism}</span>
                        </div>
                        <span className="font-mono font-bold text-red-700">₹{link.value} Cr</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* =========================================================================
            TAB 2: SWIFT & NOSTRO LEDGERS
        ========================================================================= */}
        {activeTab === 'FLOW_LEDGER' && (
          <div className="space-y-3">
            <p className="text-xs text-[#526452]">
              Cryptographic transaction logs, SWIFT FIN MT799 message tickets, and cross-border bank wire transfers:
            </p>

            {REAL_FINANCIAL_FLOW_ARCS.map(arc => (
              <div 
                key={arc.id}
                onClick={() => {
                  setSelectedArc(arc);
                  if (onSelectArcOnMap) onSelectArcOnMap(arc);
                }}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  selectedArc?.id === arc.id
                    ? 'bg-[#243324] text-white border-[#243324] shadow-md'
                    : 'bg-[#FFFFFF] text-[#243324] border-[#DDD4C0] hover:bg-[#F8F4EC]'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs">{arc.sourceCity}</span>
                      <ArrowRight className={`w-3 h-3 ${selectedArc?.id === arc.id ? 'text-amber-300' : 'text-emerald-700'}`} />
                      <span className="font-bold text-xs">{arc.targetCity}</span>
                    </div>
                    <div className={`text-[11px] mt-0.5 ${selectedArc?.id === arc.id ? 'text-[#C5D6C5]' : 'text-[#6B7D6C]'}`}>
                      {arc.sourceEntity} → {arc.targetEntity}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`font-mono text-xs font-bold block ${selectedArc?.id === arc.id ? 'text-amber-300' : 'text-red-700'}`}>
                      {arc.amountINR} ({arc.amountUSD})
                    </span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                      selectedArc?.id === arc.id ? 'bg-white/20 text-white' : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      Risk Score: {arc.riskScore}/100
                    </span>
                  </div>
                </div>

                {arc.swiftMessageTag && (
                  <div className={`p-2 rounded-lg text-[11px] font-mono mb-2 ${
                    selectedArc?.id === arc.id ? 'bg-black/30 text-amber-200' : 'bg-[#F4EFE6] text-[#243324] border border-[#DDD4C0]'
                  }`}>
                    {arc.swiftMessageTag}
                  </div>
                )}

                <p className={`text-xs ${selectedArc?.id === arc.id ? 'text-[#E0EBE0]' : 'text-[#445544]'}`}>
                  {arc.notes}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* =========================================================================
            TAB 3: HAWALA TOKENS
        ========================================================================= */}
        {activeTab === 'HAWALA_TOKENS' && (
          <div className="space-y-3">
            <div className="bg-[#FFFFFF] border border-[#DDD4C0] rounded-xl p-3.5 text-xs text-[#243324] space-y-2">
              <div className="flex items-center gap-2 font-bold text-[#243324]">
                <Coins className="w-4 h-4 text-amber-600" />
                <span>What is a Hawala Currency Token?</span>
              </div>
              <p className="text-[#556755] leading-relaxed">
                In traditional Hawala informal value transfer systems, brokers use physical currency serial numbers (e.g. a specific $1 or ₹2,000 banknote photograph sent via encrypted messaging) as a bearer redeem token. The recipient presents the exact matching note or photo to claim bulk cash in Dubai or London.
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="bg-[#FFFFFF] border border-red-200 rounded-xl p-3.5 shadow-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-red-800">Token ID #TOKEN-USD1-SER-L9283710A</span>
                  <span className="text-[10px] font-mono bg-red-100 text-red-800 px-2 py-0.5 rounded font-bold">REDEEMED IN DUBAI SOUK</span>
                </div>
                <div className="text-xs text-[#243324] space-y-1">
                  <div><strong>Originator:</strong> Nirav Modi Conduit (Brady House LoU proceeds)</div>
                  <div><strong>Redeeming Vault:</strong> Al-Bahar General Trading LLC (Deira)</div>
                  <div><strong>Settlement:</strong> Delivered £95 Million physical gold and Mayfair lease fund</div>
                  <div><strong>Interception:</strong> Recovered from Tariq Merchant phone extraction</div>
                </div>
              </div>

              <div className="bg-[#FFFFFF] border border-amber-200 rounded-xl p-3.5 shadow-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-amber-800">Token ID #TOKEN-INR2000-SERIAL-99812A</span>
                  <span className="text-[10px] font-mono bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">SEIZED IN OLD DELHI</span>
                </div>
                <div className="text-xs text-[#243324] space-y-1">
                  <div><strong>Originator:</strong> Chandni Chowk Soni Bullion Nexus</div>
                  <div><strong>Redeeming Vault:</strong> Hasan Husain Afghan Narco-Clearing</div>
                  <div><strong>Settlement:</strong> ₹750 Cr domestic distribution proceeds</div>
                  <div><strong>Interception:</strong> Seized by ED during raid at Kucha Mahajani</div>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Footer */}
      <div className="shrink-0 p-3 bg-[#F5EFE4] border-t border-[#DDD4C0] text-center text-xs text-[#6B7D6C]">
        <span>Financial Intelligence Unit (FIU-IND) & ED Rogatory Letters Verification Active</span>
      </div>
    </div>
  );
};
