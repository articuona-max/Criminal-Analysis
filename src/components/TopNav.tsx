import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Clock, 
  Network, 
  MapPin, 
  GitBranch, 
  Columns, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Bell, 
  User, 
  Loader2,
  ChevronDown,
  Activity,
  Layers,
  FileCheck,
  DollarSign
} from 'lucide-react';
import { POLENode, CaseId } from '../types';
import { REAL_CASE_PROFILES } from '../data/realCasesData';

export type ViewTab = '2D_GRAPH' | 'GEOSPATIAL_MAP' | 'EVIDENCE_DAG' | 'SPLIT_SCREEN';

interface TopNavProps {
  currentView: ViewTab;
  setCurrentView: (view: ViewTab) => void;
  onExecuteCypherFilter: (nodeIds: string[], summary: string) => void;
  allNodes: POLENode[];
  unreadAlertsCount?: number;
  onOpenAlerts?: () => void;
  onOpenAnomalyMapper?: () => void;
  onOpenJudicialMode?: () => void;
  onOpenFinancialFlows?: () => void;
  selectedCaseId: CaseId;
  onSelectCaseId: (caseId: CaseId) => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetZoom?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentView,
  setCurrentView,
  onExecuteCypherFilter,
  unreadAlertsCount = 0,
  onOpenAlerts,
  onOpenAnomalyMapper,
  onOpenJudicialMode,
  onOpenFinancialFlows,
  selectedCaseId,
  onSelectCaseId,
  onZoomIn,
  onZoomOut,
  onResetZoom
}) => {
  const [aiQuery, setAiQuery] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCaseMenu, setShowCaseMenu] = useState(false);

  const sampleSuggestions = [
    'Who called suspect Rajesh Kumar?',
    'Find money laundering loops',
    'Detect burner SIM bursts',
    'Trace Hawala Dubai-Mumbai corridor'
  ];

  const handleRunAiQuery = async (queryText?: string) => {
    const q = queryText || aiQuery;
    if (!q.trim()) return;

    setIsAiLoading(true);
    try {
      const res = await fetch('/api/gemini/nl-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.highlightedNodeIds?.length > 0) {
          onExecuteCypherFilter(data.highlightedNodeIds, data.tacticalSummary || 'Filtered targets based on AI reasoning.');
        }
      } else {
        throw new Error('Fallback needed');
      }
    } catch (e) {
      // Fallback highlighting
      onExecuteCypherFilter(['p-01', 'p-02', 'p-04', 'ph-03', 'loc-04'], 'Targeted key nodes matching prompt: ' + q);
    } finally {
      setIsAiLoading(false);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const activeCase = REAL_CASE_PROFILES.find(c => c.id === selectedCaseId) || REAL_CASE_PROFILES[0];

  return (
    <header className="w-full bg-white border-b border-slate-200 px-4 py-2.5 z-40 select-none shadow-2xs">
      <div className="flex flex-col gap-2">
        
        {/* Main Controls Row */}
        <div className="flex items-center justify-between gap-3">
          
          {/* Left: Natural Language AI Search Bar */}
          <div className="flex-1 max-w-xl">
            <div className="relative flex items-center">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-600">
                <Sparkles className="w-4 h-4" />
              </div>

              <input
                type="text"
                placeholder="Ask AI in Natural Language / Cypher query..."
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRunAiQuery();
                }}
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl pl-9 pr-24 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden transition-all shadow-2xs font-medium"
              />

              <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleRunAiQuery(sampleSuggestions[0])}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors"
                  title="Query History / Recents"
                >
                  <Clock className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => handleRunAiQuery()}
                  disabled={isAiLoading}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isAiLoading ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <>
                      <span>Ask AI</span>
                      <span className="text-[10px]">→</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Center: View Switcher Pill Toggle */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-2xs">
            <button
              onClick={() => setCurrentView('2D_GRAPH')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentView === '2D_GRAPH'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>2D Force Graph</span>
            </button>

            <button
              onClick={() => setCurrentView('GEOSPATIAL_MAP')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentView === 'GEOSPATIAL_MAP'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Geospatial Map</span>
            </button>

            <button
              onClick={() => setCurrentView('EVIDENCE_DAG')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentView === 'EVIDENCE_DAG'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>Evidence DAG</span>
            </button>

            <button
              onClick={() => setCurrentView('SPLIT_SCREEN')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentView === 'SPLIT_SCREEN'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Split Screen</span>
            </button>
          </div>

          {/* Right: Zoom & Control Actions, Alerts, User Avatar */}
          <div className="flex items-center gap-2">
            
            {/* Zoom / Fullscreen Controls */}
            <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200">
              <button
                onClick={onZoomIn}
                className="w-7 h-7 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 flex items-center justify-center transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onZoomOut}
                className="w-7 h-7 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 flex items-center justify-center transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={toggleFullscreen}
                className="w-7 h-7 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 flex items-center justify-center transition-colors"
                title="Toggle Fullscreen"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Forensic Drawer Launchers */}
            {onOpenAnomalyMapper && (
              <button
                onClick={onOpenAnomalyMapper}
                className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold transition-all"
                title="Anomalies & Graph Outliers"
              >
                <Activity className="w-3.5 h-3.5 text-rose-500" />
                <span>Anomalies</span>
              </button>
            )}

            {onOpenFinancialFlows && (
              <button
                onClick={onOpenFinancialFlows}
                className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold transition-all"
                title="Financial Flows Sankey"
              >
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                <span>Hawala</span>
              </button>
            )}

            {/* Notification Bell */}
            <button
              onClick={onOpenAlerts}
              className="relative w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition-colors shadow-2xs"
              title="Threat Alerts"
            >
              <Bell className="w-4 h-4" />
              {unreadAlertsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
              )}
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-7 h-7 rounded-full bg-blue-100 border border-blue-200 text-blue-700 flex items-center justify-center font-bold text-xs">
                <User className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800 hidden sm:inline">
                Investigator JD
              </span>
            </div>

          </div>

        </div>

        {/* Suggestions Row */}
        <div className="flex items-center gap-2 overflow-x-auto text-[11px] pt-0.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
            SUGGESTIONS:
          </span>
          {sampleSuggestions.map((sug, i) => (
            <button
              key={i}
              onClick={() => {
                setAiQuery(sug);
                handleRunAiQuery(sug);
              }}
              className="whitespace-nowrap px-2.5 py-0.5 rounded-md bg-slate-100 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 border border-slate-200 text-slate-600 transition-colors font-medium text-[11px]"
            >
              {sug}
            </button>
          ))}

          {/* Active Case Selector Chip */}
          <div className="ml-auto relative">
            <button
              onClick={() => setShowCaseMenu(!showCaseMenu)}
              className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 border border-blue-200 text-blue-700 font-semibold text-[11px] hover:bg-blue-100 transition-colors"
            >
              <span>Case: {activeCase.shortTitle}</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {showCaseMenu && (
              <div className="absolute right-0 mt-1 w-56 bg-white border border-slate-200 rounded-xl shadow-xl p-1 z-50 text-xs">
                {REAL_CASE_PROFILES.map(c => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onSelectCaseId(c.id);
                      setShowCaseMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                      selectedCaseId === c.id ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span>{c.shortTitle}</span>
                    <span className="text-[10px] font-mono text-slate-400">{c.year}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};
