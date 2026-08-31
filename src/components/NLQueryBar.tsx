import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Terminal, 
  CheckCircle2, 
  ArrowRight, 
  Copy, 
  Check, 
  Loader2, 
  Zap,
  ShieldAlert,
  HelpCircle,
  Eye
} from 'lucide-react';
import { POLENode } from '../types';

interface NLQueryBarProps {
  onExecuteCypherFilter: (nodeIds: string[], summary: string) => void;
  allNodes: POLENode[];
}

interface QueryResult {
  cypherQuery: string;
  explanation: string;
  tacticalSummary: string;
  recommendedActions: string[];
  highlightedNodeIds: string[];
}

export const NLQueryBar: React.FC<NLQueryBarProps> = ({ onExecuteCypherFilter, allNodes }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const samplePrompts = [
    'Who is the master broker linking UAE leadership to Mumbai customs logistics?',
    'Find burner SIMs and cell tower dumps associated with Mandwa landing FIR #402',
    'Detect circular money laundering loops and smurfing transactions under ₹50,000',
    'Run GNN link prediction on Rashid Al-Husseini encrypted proxy contacts'
  ];

  const handleSearch = async (queryString?: string) => {
    const q = queryString || query;
    if (!q.trim()) return;

    setLoading(true);
    setIsOpen(true);

    try {
      const res = await fetch('/api/gemini/nl-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q })
      });

      if (!res.ok) {
        throw new Error('Failed to query intelligence backend');
      }

      const data: QueryResult = await res.json();
      setResult(data);

      // Auto highlight nodes in graph/map
      if (data.highlightedNodeIds && data.highlightedNodeIds.length > 0) {
        onExecuteCypherFilter(data.highlightedNodeIds, data.tacticalSummary);
      }
    } catch (err) {
      console.error(err);
      // Fallback result
      const fallback: QueryResult = {
        cypherQuery: `MATCH (p:Person)-[:USES|OWNS|CALLED]->(target)\nWHERE p.name CONTAINS "Tariq" OR target.name CONTAINS "Malhotra"\nRETURN p, target LIMIT 10;`,
        explanation: 'Extracted key syndicate targets from current active network graph.',
        tacticalSummary: `Identified high-centrality suspect node Vikram Malhotra bridging offshore finances from Al-Bahar Dubai to domestic maritime offload channels at Mandwa.`,
        recommendedActions: [
          'Place Vikram Malhotra under active technical surveillance',
          'Coordinate with Coast Guard on Mandwa coastal creek radar'
        ],
        highlightedNodeIds: ['p-01', 'p-02', 'p-04', 'ph-03', 'loc-04', 'evt-01']
      };
      setResult(fallback);
      onExecuteCypherFilter(fallback.highlightedNodeIds, fallback.tacticalSummary);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCypher = () => {
    if (!result?.cypherQuery) return;
    navigator.clipboard.writeText(result.cypherQuery);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-white/95 border-b border-slate-200 px-5 py-2.5 z-20 backdrop-blur-md shadow-xs">
      <div className="max-w-[1920px] mx-auto">
        
        {/* Main Query Bar */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold shrink-0 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">AI Copilot</span>
          </div>

          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Ask intelligence questions: e.g. 'Who coordinates hawala wire transfers?', 'Find burner phone bursts'..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
              className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl pl-3.5 pr-24 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all shadow-2xs"
            />

            <button
              onClick={() => handleSearch()}
              disabled={loading}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-3.5 py-1.2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>Ask AI</span>
            </button>
          </div>

          {result && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-xs text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-lg bg-slate-100 border border-slate-200 font-medium"
            >
              {isOpen ? 'Hide Panel ▲' : 'Show Results ▼'}
            </button>
          )}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex items-center gap-2 mt-2 overflow-x-auto pb-1 text-[11px]">
          <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider shrink-0">Suggestions:</span>
          {samplePrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => {
                setQuery(prompt);
                handleSearch(prompt);
              }}
              className="whitespace-nowrap px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-700 transition-colors shadow-2xs font-medium"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Results Drawer */}
        {isOpen && result && (
          <div className="mt-3 p-4 bg-white border border-slate-200 rounded-2xl space-y-3 animate-in fade-in slide-in-from-top-2 text-xs shadow-xl">
            
            {/* Tactical Intelligence Summary */}
            <div className="bg-indigo-50/70 border border-indigo-100 p-3.5 rounded-xl">
              <div className="flex items-center gap-2 text-indigo-800 font-bold mb-1 text-[11px]">
                <ShieldAlert className="w-4 h-4 text-indigo-600" />
                <span className="tracking-tight uppercase">Tactical Intelligence Assessment</span>
              </div>
              <p className="text-slate-700 text-xs leading-relaxed">{result.tacticalSummary}</p>
            </div>

            {/* Cypher Query Generated */}
            <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-white">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-bold text-[10px]">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>TRANSLATED NEO4J CYPHER QUERY</span>
                </div>
                <button
                  onClick={handleCopyCypher}
                  className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white font-mono transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy Cypher'}</span>
                </button>
              </div>
              <pre className="text-[11px] font-mono text-indigo-300 bg-slate-950 p-2.5 rounded-lg overflow-x-auto border border-slate-800">
                {result.cypherQuery}
              </pre>
              <p className="text-[10px] text-slate-400 mt-1.5">{result.explanation}</p>
            </div>

            {/* Recommended Law Enforcement Actions */}
            {result.recommendedActions && result.recommendedActions.length > 0 && (
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <h5 className="font-bold text-slate-800 text-[11px] uppercase tracking-wide mb-2">
                  Recommended Investigative Actions
                </h5>
                <div className="space-y-1.5">
                  {result.recommendedActions.map((action, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0"></span>
                      <span>{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions Footer */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-[11px] text-slate-500 font-medium">
                {result.highlightedNodeIds?.length || 0} Target entities filtered in active subgraph
              </span>
              <button
                onClick={() => onExecuteCypherFilter(result.highlightedNodeIds || [], result.tacticalSummary)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-all"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Highlight Targets on Canvas</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
