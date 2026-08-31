import React, { useState } from 'react';
import { 
  Filter, 
  RotateCcw, 
  Search, 
  Layers, 
  Users, 
  Flame, 
  Activity, 
  Network
} from 'lucide-react';
import { POLEType } from '../types';
import { GraphFilterCriteria } from '../data/intelligenceEngine';

interface NodeFilterProps {
  filterCriteria: GraphFilterCriteria;
  setFilterCriteria: React.Dispatch<React.SetStateAction<GraphFilterCriteria>>;
  totalNodesCount: number;
  filteredNodesCount: number;
  totalEdgesCount: number;
  filteredEdgesCount: number;
  entityCounts?: Record<POLEType, number>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const NodeFilter: React.FC<NodeFilterProps> = ({
  filterCriteria,
  setFilterCriteria,
  totalNodesCount,
  filteredNodesCount,
  entityCounts,
  searchQuery,
  setSearchQuery,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'POLE' | 'SYNDICATE'>('POLE');

  const defaultCounts: Record<POLEType, number> = {
    Person: entityCounts?.Person ?? 10,
    Phone: entityCounts?.Phone ?? 7,
    Account: entityCounts?.Account ?? 6,
    Vehicle: entityCounts?.Vehicle ?? 3,
    Location: entityCounts?.Location ?? 6,
    Organization: entityCounts?.Organization ?? 3,
    Event: entityCounts?.Event ?? 4,
  };

  const poleCategories: { type: POLEType; label: string; dotColor: string }[] = [
    { type: 'Person', label: 'Person', dotColor: 'bg-rose-500' },
    { type: 'Phone', label: 'Phone', dotColor: 'bg-blue-500' },
    { type: 'Account', label: 'Account', dotColor: 'bg-emerald-500' },
    { type: 'Vehicle', label: 'Vehicle', dotColor: 'bg-amber-500' },
    { type: 'Location', label: 'Location', dotColor: 'bg-purple-500' },
    { type: 'Organization', label: 'Organization', dotColor: 'bg-yellow-500' },
    { type: 'Event', label: 'Event', dotColor: 'bg-slate-500' },
  ];

  const handleTogglePoleType = (type: POLEType) => {
    setFilterCriteria(prev => {
      const exists = prev.poleTypes.includes(type);
      const updated = exists
        ? prev.poleTypes.filter(t => t !== type)
        : [...prev.poleTypes, type];
      return { ...prev, poleTypes: updated };
    });
  };

  const handleSelectAll = () => {
    setFilterCriteria(prev => ({
      ...prev,
      poleTypes: ['Person', 'Phone', 'Account', 'Vehicle', 'Location', 'Organization', 'Event']
    }));
  };

  const handleSelectNone = () => {
    setFilterCriteria(prev => ({
      ...prev,
      poleTypes: []
    }));
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterCriteria({
      poleTypes: ['Person', 'Phone', 'Account', 'Vehicle', 'Location', 'Organization', 'Event'],
      minRisk: 0,
      communityId: 'ALL',
      highBrokersOnly: false,
      anomaliesOnly: false,
      structuringOnly: false,
      selectedNodeId: null,
      egoRadius: 0,
      searchQuery: '',
    });
  };

  return (
    <div className="w-full bg-white text-slate-800 p-4 text-xs overflow-y-auto space-y-4 h-full border-r border-slate-200 shadow-2xs select-none">
      
      {/* Sub Tabs: POLE Filters | Syndicate Cells */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
        <button
          onClick={() => setActiveSubTab('POLE')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            activeSubTab === 'POLE'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          <span>POLE Filters</span>
        </button>

        <button
          onClick={() => setActiveSubTab('SYNDICATE')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            activeSubTab === 'SYNDICATE'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <Network className="w-3.5 h-3.5" />
          <span>Syndicate Cells</span>
        </button>
      </div>

      {activeSubTab === 'POLE' ? (
        <>
          {/* Header Title & Reset */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <Filter className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-xs">
                  POLE Domain Filters
                </h3>
                <p className="text-[10px] text-slate-500 font-medium">
                  Showing {filteredNodesCount} of {totalNodesCount} Entities
                </p>
              </div>
            </div>

            <button
              onClick={handleResetFilters}
              className="text-[11px] text-slate-500 hover:text-blue-600 flex items-center gap-1 font-semibold transition-colors px-2 py-1 rounded-md hover:bg-slate-100"
              title="Reset all filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Quick Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by name, MSISDN, account, place..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden transition-all"
            />
          </div>

          {/* Entity Categories Grid */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                ENTITY CATEGORIES
              </span>
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-blue-600">
                <button onClick={handleSelectAll} className="hover:underline">All</button>
                <span className="text-slate-300">•</span>
                <button onClick={handleSelectNone} className="hover:underline">None</button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {poleCategories.map(({ type, label, dotColor }) => {
                const isSelected = filterCriteria.poleTypes.includes(type);
                const count = defaultCounts[type] || 0;
                return (
                  <button
                    key={type}
                    onClick={() => handleTogglePoleType(type)}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-slate-50 border-slate-300 text-slate-900 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-400 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`} />
                      <span>{label}</span>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${isSelected ? 'bg-slate-200/70 text-slate-700 font-mono font-bold' : 'text-slate-400 font-mono'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Min Risk Score Slider */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-slate-800 font-semibold text-xs">
                <Flame className="w-3.5 h-3.5 text-rose-500" />
                <span>Min Risk Score:</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                ≥ {(filterCriteria.minRisk / 100).toFixed(2)}
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="95"
              step="5"
              value={filterCriteria.minRisk}
              onChange={(e) => setFilterCriteria(prev => ({ ...prev, minRisk: Number(e.target.value) }))}
              className="w-full accent-rose-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />

            <div className="flex justify-between text-[9px] text-slate-400 font-medium">
              <span>0.0 (All)</span>
              <span>0.60 (High)</span>
              <span>0.85 (Critical)</span>
            </div>
          </div>

          {/* Min Broker Centrality Slider */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-slate-800 font-semibold text-xs">
                <Activity className="w-3.5 h-3.5 text-blue-600" />
                <span>Min Broker Centrality:</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                ≥ {filterCriteria.highBrokersOnly ? '0.20' : '0.00'}
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="1"
              step="1"
              value={filterCriteria.highBrokersOnly ? 1 : 0}
              onChange={(e) => setFilterCriteria(prev => ({ ...prev, highBrokersOnly: e.target.value === '1' }))}
              className="w-full accent-blue-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
          </div>

          {/* Syndicate Cell (Louvain Partition) Dropdown */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1 text-slate-800 font-semibold text-xs">
              <Layers className="w-3.5 h-3.5 text-purple-600" />
              <span>Syndicate Cell (Louvain Partition):</span>
            </div>

            <select
              value={filterCriteria.communityId}
              onChange={(e) => {
                const val = e.target.value === 'ALL' ? 'ALL' : Number(e.target.value);
                setFilterCriteria(prev => ({ ...prev, communityId: val }));
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 font-medium focus:outline-hidden focus:border-blue-500"
            >
              <option value="ALL">All Communities & Syndicates</option>
              <option value="1">Cell 1: Apex Leadership (Dubai-Mumbai)</option>
              <option value="2">Cell 2: Hawala Bullion Channel (Delhi)</option>
              <option value="3">Cell 3: Maritime Logistics & Offload</option>
            </select>
          </div>

          {/* Quick Filters */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              QUICK FILTERS
            </span>

            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filterCriteria.anomaliesOnly}
                onChange={(e) => setFilterCriteria(prev => ({ ...prev, anomaliesOnly: e.target.checked }))}
                className="w-4 h-4 rounded text-blue-600 accent-blue-600 cursor-pointer"
              />
              <span>Flagged / Suspicious Only</span>
            </label>
          </div>
        </>
      ) : (
        /* Syndicate Cells Tab View */
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-xs">
              Louvain Syndicate Clusters
            </h4>
            <span className="text-[10px] font-mono text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200 font-bold">
              3 Active Cells
            </span>
          </div>

          <div className="space-y-2">
            {[
              { id: '1', name: 'Cell 1: Apex Leadership', nodes: '14 Entities', tag: 'High Risk', color: 'border-l-4 border-l-rose-500' },
              { id: '2', name: 'Cell 2: Hawala Bullion Channel', nodes: '12 Entities', tag: 'Financial', color: 'border-l-4 border-l-amber-500' },
              { id: '3', name: 'Cell 3: Maritime Logistics & Offload', nodes: '13 Entities', tag: 'Logistics', color: 'border-l-4 border-l-blue-500' },
            ].map(cell => (
              <div
                key={cell.id}
                onClick={() => setFilterCriteria(prev => ({ ...prev, communityId: Number(cell.id) }))}
                className={`p-2.5 rounded-xl border bg-slate-50 hover:bg-white cursor-pointer transition-all ${cell.color} ${
                  filterCriteria.communityId === Number(cell.id) ? 'ring-2 ring-blue-500 shadow-xs' : 'border-slate-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-bold text-slate-900 text-xs">{cell.name}</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">{cell.tag}</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">{cell.nodes}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setFilterCriteria(prev => ({ ...prev, communityId: 'ALL' }))}
            className="w-full py-1.5 text-xs text-blue-600 font-semibold bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors"
          >
            Show All Clusters
          </button>
        </div>
      )}

    </div>
  );
};
