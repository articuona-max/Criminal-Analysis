import React from 'react';
import { 
  ShieldAlert, 
  Network, 
  MapPin, 
  FileCheck, 
  Database, 
  Bell, 
  Sparkles, 
  Search, 
  Activity, 
  Briefcase,
  Layers,
  Combine,
  Lock,
  Compass
} from 'lucide-react';
import { CaseId } from '../types';
import { REAL_CASE_PROFILES, REAL_ANOMALIES } from '../data/realCasesData';

export type ActiveTab = 'GRAPH' | 'MAP' | 'EVIDENCE' | 'INGESTION' | 'RESOLUTION' | 'ALERTS';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  unreadAlertsCount: number;
  onOpenAlerts: () => void;
  onOpenMotifs: () => void;
  onOpenAnomalyMapper: () => void;
  selectedCaseId: CaseId;
  onSelectCaseId: (caseId: CaseId) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  userRole: string;
  setUserRole: (role: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  unreadAlertsCount,
  onOpenAlerts,
  onOpenMotifs,
  onOpenAnomalyMapper,
  selectedCaseId,
  onSelectCaseId,
  searchQuery,
  setSearchQuery,
  userRole,
  setUserRole,
}) => {
  const currentCase = REAL_CASE_PROFILES.find(c => c.id === selectedCaseId) || REAL_CASE_PROFILES[0];
  const activeAnomaliesCount = REAL_ANOMALIES.filter(a => selectedCaseId === 'CASE_ALL' || a.case_id === selectedCaseId).length;

  return (
    <header className="bg-[#FBF9F5] border-b border-[#E5DFD3] text-[#243324] z-30 sticky top-0 px-4 lg:px-6 py-2.5 shadow-xs">
      <div className="max-w-[1920px] mx-auto space-y-2.5">
        
        {/* Top Row: Brand, Global Search, Primary Views, and Tactical Engines */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Brand & System Status */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#243324] flex items-center justify-center text-[#FBF9F5] shadow-xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base tracking-tight text-[#243324] font-['Fraunces',serif]">
                  Astra Intelligence
                </h1>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#EAE5D9] border border-[#D5CEBF] text-[#243324] flex items-center gap-1.5 font-sans">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  POLE Matrix
                </span>
              </div>
              <p className="text-[11px] text-[#4F5E4F] font-sans font-medium">
                Judicial Forensic Case Analysis & Transnational Anomaly Engine
              </p>
            </div>
          </div>

          {/* Global Search Bar */}
          <div className="flex-1 max-w-md mx-2">
            <div className="relative">
              <Search className="w-4 h-4 text-[#7A8A7A] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search suspects, accounts, LoUs, containers, court FIRs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#F3EFE6] border border-[#DDD5C5] focus:border-[#243324] focus:bg-white rounded-xl pl-9 pr-8 py-1.5 text-xs text-[#243324] placeholder:text-[#889688] focus:outline-hidden transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7A8A7A] hover:text-[#243324] text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Primary Navigation Views */}
          <nav className="flex items-center gap-1 bg-[#F0ECE1] p-1 rounded-xl border border-[#DCD5C5]">
            <button
              onClick={() => setActiveTab('GRAPH')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'GRAPH'
                  ? 'bg-[#243324] text-[#FBF9F5] shadow-xs'
                  : 'text-[#415141] hover:text-[#243324] hover:bg-[#E5DFD1]'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>Knowledge Graph</span>
            </button>

            <button
              onClick={() => setActiveTab('MAP')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'MAP'
                  ? 'bg-[#243324] text-[#FBF9F5] shadow-xs'
                  : 'text-[#415141] hover:text-[#243324] hover:bg-[#E5DFD1]'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Geospatial Map</span>
            </button>

            <button
              onClick={() => setActiveTab('EVIDENCE')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'EVIDENCE'
                  ? 'bg-[#243324] text-[#FBF9F5] shadow-xs'
                  : 'text-[#415141] hover:text-[#243324] hover:bg-[#E5DFD1]'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Evidence DAG</span>
            </button>

            <button
              onClick={() => setActiveTab('INGESTION')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'INGESTION'
                  ? 'bg-[#243324] text-[#FBF9F5] shadow-xs'
                  : 'text-[#415141] hover:text-[#243324] hover:bg-[#E5DFD1]'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Ingestion</span>
            </button>
          </nav>

          {/* Intelligence Actions & Alerts */}
          <div className="flex items-center gap-2">
            
            {/* Anomaly & Evidence Mapper Launcher */}
            <button
              onClick={onOpenAnomalyMapper}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#243324] text-[#FBF9F5] text-xs font-semibold hover:bg-[#182318] transition-colors shadow-xs"
              title="Real-World Case Anomaly & Evidence Mapper"
            >
              <Activity className="w-3.5 h-3.5 text-amber-300" />
              <span>Anomaly Mapper</span>
              <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[#FBF9F5] text-[10px] font-bold">
                {activeAnomaliesCount}
              </span>
            </button>

            {/* Motifs & Burst Engine */}
            <button
              onClick={onOpenMotifs}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EBE5D8] border border-[#D5CEBF] text-[#243324] text-xs font-semibold hover:bg-[#E0D9C8] transition-colors shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-700" />
              <span className="hidden sm:inline">Motifs</span>
            </button>

            {/* Priority Alerts */}
            <button
              onClick={onOpenAlerts}
              className="relative p-2 rounded-xl bg-[#EBE5D8] border border-[#D5CEBF] text-[#243324] hover:bg-[#E0D9C8] transition-colors shadow-2xs"
              title="Priority Alerts"
            >
              <Bell className="w-4 h-4" />
              {unreadAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-[9px] font-bold text-white flex items-center justify-center animate-pulse">
                  {unreadAlertsCount}
                </span>
              )}
            </button>

            {/* RBAC Role */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-[#DCD5C5] hidden lg:flex">
              <Lock className="w-3 h-3 text-[#7A8A7A]" />
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                className="bg-[#F3EFE6] border border-[#DDD5C5] rounded-lg px-2 py-1 text-[11px] text-[#243324] font-medium focus:outline-hidden"
              >
                <option value="Investigator">Investigator</option>
                <option value="Analyst">Analyst</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

          </div>
        </div>

        {/* Bottom Row: Explicit 3-Case Single/Combined Switcher Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#EDE7DB]">
          <div className="flex items-center gap-2 overflow-x-auto py-0.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#5A6C5A] flex items-center gap-1 shrink-0 font-sans">
              <Briefcase className="w-3.5 h-3.5 text-[#243324]" />
              Case Scope (One Visible or Combined):
            </span>

            {/* 3 Real Cases Segmented Tabs */}
            <div className="inline-flex items-center p-0.5 bg-[#EFEBE0] rounded-xl border border-[#D8D0BF] gap-1">
              
              {/* Case 1: PNB */}
              <button
                onClick={() => onSelectCaseId('CASE_PNB_MODI')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  selectedCaseId === 'CASE_PNB_MODI'
                    ? 'bg-[#243324] text-[#FBF9F5] shadow-xs'
                    : 'text-[#3E4F3E] hover:text-[#243324] hover:bg-white/60'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>Case 1: PNB $2B LoU Fraud</span>
              </button>

              {/* Case 2: ANOM */}
              <button
                onClick={() => onSelectCaseId('CASE_ANOM_TROJAN')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  selectedCaseId === 'CASE_ANOM_TROJAN'
                    ? 'bg-[#243324] text-[#FBF9F5] shadow-xs'
                    : 'text-[#3E4F3E] hover:text-[#243324] hover:bg-white/60'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-sky-500"></span>
                <span>Case 2: Operation Trojan Shield</span>
              </button>

              {/* Case 3: Mundra Port */}
              <button
                onClick={() => onSelectCaseId('CASE_MUNDRA_TALC')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  selectedCaseId === 'CASE_MUNDRA_TALC'
                    ? 'bg-[#243324] text-[#FBF9F5] shadow-xs'
                    : 'text-[#3E4F3E] hover:text-[#243324] hover:bg-white/60'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Case 3: Mundra Port 3,000kg Heroin</span>
              </button>

              {/* Combined Option */}
              <button
                onClick={() => onSelectCaseId('CASE_ALL')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  selectedCaseId === 'CASE_ALL'
                    ? 'bg-[#243324] text-[#FBF9F5] shadow-xs ring-1 ring-[#243324]'
                    : 'text-[#3E4F3E] hover:text-[#243324] hover:bg-white/60'
                }`}
              >
                <Combine className="w-3.5 h-3.5 text-emerald-400" />
                <span>⚡ Combine All 3 Cases</span>
              </button>

            </div>
          </div>

          {/* Active Case Context Metadata Summary */}
          <div className="flex items-center gap-2 text-xs text-[#526352] font-medium">
            <span className="font-mono text-[#243324] font-bold bg-[#ECE7DC] px-2 py-0.5 rounded-md border border-[#D5CEBE]">
              {currentCase.code}
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">{currentCase.leadAgency}</span>
            <span className="hidden md:inline">•</span>
            <span className="font-semibold text-emerald-900 hidden md:inline">
              Seizure/Fraud: {currentCase.totalSeizureOrFraud}
            </span>
          </div>

        </div>

      </div>
    </header>
  );
};
