import React from 'react';
import { 
  LayoutDashboard, 
  Network, 
  AlertTriangle, 
  Search, 
  Settings, 
  ShieldAlert,
  GitBranch
} from 'lucide-react';

export type SidebarTab = 'DASHBOARD' | 'GRAPH_ANALYTICS' | 'ALERTS_RISKS' | 'ENTITY_SEARCH' | 'SETTINGS';

interface SidebarProps {
  activeTab: SidebarTab;
  setActiveTab: (tab: SidebarTab) => void;
  unreadAlertsCount?: number;
  onOpenSettings?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  unreadAlertsCount = 0,
  onOpenSettings
}) => {
  return (
    <aside className="w-56 shrink-0 bg-white border-r border-slate-200 flex flex-col justify-between h-full select-none z-30">
      {/* Brand & Logo */}
      <div>
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs">
            <Network className="w-4 h-4" />
          </div>
          <span className="font-black text-sm tracking-wider text-slate-900 font-mono uppercase">
            AICRIMINAL
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          <button
            onClick={() => setActiveTab('DASHBOARD')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'DASHBOARD'
                ? 'bg-blue-50 text-blue-600 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-slate-500" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('GRAPH_ANALYTICS')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'GRAPH_ANALYTICS'
                ? 'bg-blue-50 text-blue-600 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Network className="w-4 h-4 text-blue-600" />
            <span>Graph Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('ALERTS_RISKS')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'ALERTS_RISKS'
                ? 'bg-blue-50 text-blue-600 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Alerts & Risks</span>
            </div>
            {unreadAlertsCount > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-rose-500 text-white">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('ENTITY_SEARCH')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'ENTITY_SEARCH'
                ? 'bg-blue-50 text-blue-600 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Search className="w-4 h-4 text-slate-500" />
            <span>Entity Search</span>
          </button>
        </nav>
      </div>

      {/* Bottom Settings Link */}
      <div className="p-3 border-t border-slate-100">
        <button
          onClick={() => {
            if (onOpenSettings) onOpenSettings();
            else setActiveTab('SETTINGS');
          }}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'SETTINGS'
              ? 'bg-blue-50 text-blue-600 font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Settings className="w-4 h-4 text-slate-500" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
};
