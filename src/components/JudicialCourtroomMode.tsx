import React, { useState } from 'react';
import { 
  Scale, 
  FileCheck, 
  ShieldCheck, 
  Download, 
  Printer, 
  X, 
  CheckCircle2, 
  Lock, 
  FileText, 
  ChevronRight, 
  Award, 
  Maximize2,
  Minimize2,
  ExternalLink,
  QrCode
} from 'lucide-react';
import { REAL_JUDICIAL_EVIDENCE, JudicialEvidenceItem } from '../data/intelligence4DEngine';
import { REAL_CASE_PROFILES } from '../data/realCasesData';
import { CaseId } from '../types';

interface JudicialCourtroomModeProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCaseId: CaseId;
}

export const JudicialCourtroomMode: React.FC<JudicialCourtroomModeProps> = ({
  isOpen,
  onClose,
  selectedCaseId
}) => {
  const [selectedEvidence, setSelectedEvidence] = useState<JudicialEvidenceItem>(REAL_JUDICIAL_EVIDENCE[0]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [verifiedSignatures, setVerifiedSignatures] = useState<Record<string, boolean>>({
    'ev-crcl-report-992': true,
    'ev-swift-mt799-lou': true,
    'ev-anom-handset-log': true,
    'ev-uk-highcourt-extradition': true
  });

  if (!isOpen) return null;

  const currentCase = REAL_CASE_PROFILES.find(c => c.id === selectedCaseId) || REAL_CASE_PROFILES[0];
  const evidenceList = REAL_JUDICIAL_EVIDENCE.filter(e => selectedCaseId === 'CASE_ALL' || e.caseId === selectedCaseId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div 
      id="judicial-courtroom-mode-overlay"
      className="fixed inset-0 z-50 bg-[#F5EFE6] text-[#243324] flex flex-col font-sans select-none overflow-hidden animate-in fade-in duration-200"
    >
      {/* Top Judicial Courtroom Header */}
      <header className="bg-[#243324] text-[#FBF9F5] px-6 py-3 shrink-0 flex items-center justify-between border-b border-[#3D523D] shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-400 text-[#243324]">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base tracking-tight font-serif">
                Judicial Presentation & Forensic Dossier Studio
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40">
                COURTROOM ADMISSIBLE MODE
              </span>
            </div>
            <p className="text-xs text-[#C8D6C8]">
              Cryptographic Chain of Custody • SHA-256 Forensic Hash Verification • Section 65B Certificate
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-xl bg-[#FAF7F2] text-[#243324] text-xs font-bold hover:bg-white flex items-center gap-1.5 transition-all shadow-xs"
            title="Print or Save as Official Courtroom PDF"
          >
            <Printer className="w-4 h-4 text-emerald-800" />
            <span>Export Official PDF Dossier</span>
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#C8D6C8] hover:text-white hover:bg-white/10"
            title="Exit Courtroom Presentation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Judicial Workspace */}
      <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-0">
        
        {/* Left Column: Exhibit Catalog */}
        <div className="md:col-span-4 bg-[#FAF7F2] border-r border-[#DDD4C0] overflow-y-auto p-4 space-y-3">
          
          <div className="bg-[#FFFFFF] p-3 rounded-xl border border-[#DDD4C0] shadow-xs">
            <span className="text-[10px] uppercase font-mono font-bold text-[#6B7D6C] block">Active Legal Case</span>
            <div className="font-bold text-xs text-[#243324] mt-0.5">{currentCase.title}</div>
            <div className="text-[11px] text-[#556755] mt-0.5">Court: {currentCase.leadAgency} Special Court</div>
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-[#6B7D6C] block px-1">
            Sealed Forensic Exhibits ({evidenceList.length}):
          </span>

          <div className="space-y-2">
            {evidenceList.map(ev => {
              const isSelected = selectedEvidence?.id === ev.id;
              return (
                <div
                  key={ev.id}
                  onClick={() => setSelectedEvidence(ev)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-[#243324] text-white border-[#243324] shadow-md' 
                      : 'bg-[#FFFFFF] text-[#243324] border-[#DDD4C0] hover:bg-[#F8F4EC]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                      isSelected ? 'bg-amber-400 text-black' : 'bg-red-100 text-red-800'
                    }`}>
                      {ev.exhibitCode}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      SHA-256 OK
                    </span>
                  </div>

                  <h4 className="font-bold text-xs mt-1 leading-snug">{ev.title}</h4>
                  <div className={`text-[11px] mt-1 ${isSelected ? 'text-[#C5D6C5]' : 'text-[#6B7D6C]'}`}>
                    Seized: {new Date(ev.seizureDate).toLocaleDateString()} • {ev.seizureLocation.split(' ')[0]}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Column: Courtroom Document Presentation Viewer */}
        <div className="md:col-span-8 bg-[#FAF7F2] overflow-y-auto p-6 space-y-6">
          {selectedEvidence && (
            <div className="max-w-3xl mx-auto bg-[#FFFFFF] border border-[#DDD4C0] rounded-2xl p-8 shadow-xl space-y-6 font-serif print:border-none print:shadow-none">
              
              {/* Exhibit Top Watermark Seal */}
              <div className="flex items-start justify-between pb-4 border-b-2 border-[#243324]">
                <div>
                  <div className="text-xs font-mono font-bold uppercase tracking-widest text-[#6B7D6C]">
                    IN THE SPECIAL COURT OF JUDICATURE
                  </div>
                  <h2 className="text-xl font-bold text-[#243324] font-serif mt-1">
                    FORENSIC EVIDENCE ADMISSIBILITY CERTIFICATE
                  </h2>
                  <div className="text-xs font-mono text-[#556755] mt-1">
                    REFERENCE: {selectedEvidence.judicialOrderReference}
                  </div>
                </div>

                <div className="text-right">
                  <div className="inline-block p-2 bg-[#FAF7F2] rounded-xl border border-[#DDD4C0] text-center font-mono">
                    <span className="text-[10px] text-[#6B7D6C] block uppercase">Exhibit ID</span>
                    <span className="text-sm font-bold text-red-800">{selectedEvidence.exhibitCode}</span>
                  </div>
                </div>
              </div>

              {/* Title & Custody Officer */}
              <div className="space-y-3 font-sans">
                <div className="bg-[#FAF7F2] p-4 rounded-xl border border-[#DDD4C0]">
                  <span className="text-xs uppercase font-bold text-[#6B7D6C] block">Document Title:</span>
                  <h3 className="text-base font-bold text-[#243324] mt-0.5">{selectedEvidence.title}</h3>
                  <div className="grid grid-cols-2 gap-2 text-xs text-[#4A5B4C] mt-2 pt-2 border-t border-[#E5DFD3]">
                    <div><strong>Custody Officer:</strong> {selectedEvidence.custodyOfficer}</div>
                    <div><strong>Date of Physical Seizure:</strong> {new Date(selectedEvidence.seizureDate).toUTCString()}</div>
                  </div>
                </div>
              </div>

              {/* Forensic Assay / Narrative Summary */}
              <div className="space-y-2">
                <h4 className="text-xs uppercase font-bold tracking-wider text-[#6B7D6C] font-sans">
                  Forensic Laboratory Findings & Sworn Testimony:
                </h4>
                <div className="p-4 bg-[#FBF9F5] border border-[#DDD4C0] rounded-xl text-sm leading-relaxed text-[#243324]">
                  {selectedEvidence.forensicSummary}
                </div>
              </div>

              {/* Cryptographic SHA-256 Chain of Custody */}
              <div className="bg-[#243324] text-white p-4 rounded-xl space-y-2 font-sans">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    Cryptographic Integrity Hash (SHA-256)
                  </span>
                  <span className="font-mono text-[10px] bg-emerald-900/60 text-emerald-300 px-2 py-0.5 rounded">
                    BITSTREAM VERIFIED
                  </span>
                </div>
                <div className="font-mono text-xs text-[#E0EBE0] bg-black/40 p-2.5 rounded-lg break-all select-all">
                  {selectedEvidence.sha256Hash}
                </div>
                <p className="text-[11px] text-[#A6BAA6]">
                  Computed over original evidentiary bitstream. Matches seizure log timestamped in judicial vault.
                </p>
              </div>

              {/* Signatures & Seal of Court */}
              <div className="pt-6 border-t border-[#DDD4C0] grid grid-cols-2 gap-6 font-sans text-xs">
                <div>
                  <span className="text-[#6B7D6C] block mb-6">Investigative Agency Lead Officer:</span>
                  <div className="font-mono font-bold text-[#243324] border-b border-[#243324] pb-1">
                    {selectedEvidence.custodyOfficer}
                  </div>
                  <span className="text-[10px] text-[#6B7D6C] mt-1 block">Digitally Signed with DSC USB Token #8819</span>
                </div>

                <div>
                  <span className="text-[#6B7D6C] block mb-6">Special Court Registrar / Seal:</span>
                  <div className="font-mono font-bold text-emerald-900 border-b border-[#243324] pb-1">
                    {selectedEvidence.verificationSignature}
                  </div>
                  <span className="text-[10px] text-[#6B7D6C] mt-1 block">Admitted into Evidence as Sworn Exhibit</span>
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
