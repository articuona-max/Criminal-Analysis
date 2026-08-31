import React, { useState, useMemo, useEffect } from 'react';
import { Sidebar, SidebarTab } from './components/Sidebar';
import { TopNav, ViewTab } from './components/TopNav';
import { ForceGraph, GraphColorMode } from './components/ForceGraph';
import { GeoMap } from './components/GeoMap';
import { UnifiedTemporalTelemetry } from './components/UnifiedTemporalTelemetry';
import { EvidenceChain } from './components/EvidenceChain';
import { NodeFilter } from './components/NodeFilter';
import { NodeDetail } from './components/NodeDetail';
import { AlertPanel } from './components/AlertPanel';
import { IngestionStudio } from './components/IngestionStudio';
import { EntityResolutionModal } from './components/EntityResolutionModal';
import { MotifAndBurstModal } from './components/MotifAndBurstModal';
import { AnomalyMapperModal } from './components/AnomalyMapperModal';
import { FinancialFlowSankeyDrawer } from './components/FinancialFlowSankeyDrawer';
import { CrossCaseNexusModal } from './components/CrossCaseNexusModal';
import { ManifestRiskScorerModal } from './components/ManifestRiskScorerModal';
import { JudicialCourtroomMode } from './components/JudicialCourtroomMode';

import { POLENode, AlertItem, CaseId, POLEType } from './types';
import { MOCK_NODES, MOCK_EDGES, MOCK_ALERTS, TIMELINE_SNAPSHOTS } from './data/mockData';
import { IntelligenceEngine, GraphFilterCriteria } from './data/intelligenceEngine';
import { REAL_4D_TRACKS, TelemetryTrack } from './data/intelligence4DEngine';

export function App() {
  // Sidebar & View Navigation State
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>('GRAPH_ANALYTICS');
  const [currentView, setCurrentView] = useState<ViewTab>('2D_GRAPH');
  const [graphColorMode, setGraphColorMode] = useState<GraphColorMode>('POLE');

  // Real-World Case Switcher State
  const [selectedCaseId, setSelectedCaseId] = useState<CaseId>('CASE_ALL');

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCriteria, setFilterCriteria] = useState<GraphFilterCriteria>({
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

  // Selection & Hover State
  const [selectedNode, setSelectedNode] = useState<POLENode | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Timeline & 4D Telemetry Synchronized State
  const dateList = useMemo(() => TIMELINE_SNAPSHOTS.map(s => s.date), []);
  const [currentDateIndex, setCurrentDateIndex] = useState(dateList.length - 1);
  const [activeTelemetryTrack, setActiveTelemetryTrack] = useState<TelemetryTrack>(REAL_4D_TRACKS[0]);
  const [currentTelemetryWaypointIndex, setCurrentTelemetryWaypointIndex] = useState(0);

  // Auto-switch track when selected real-world case changes
  useEffect(() => {
    const matchingTracks = REAL_4D_TRACKS.filter(
      t => selectedCaseId === 'CASE_ALL' || t.caseId === selectedCaseId
    );
    if (matchingTracks.length > 0) {
      setActiveTelemetryTrack(matchingTracks[0]);
      setCurrentTelemetryWaypointIndex(0);
    }
  }, [selectedCaseId]);

  // Modals & Panels State
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isResolutionModalOpen, setIsResolutionModalOpen] = useState(false);
  const [isMotifsModalOpen, setIsMotifsModalOpen] = useState(false);
  const [isAnomalyMapperOpen, setIsAnomalyMapperOpen] = useState(false);
  const [isFinancialFlowsOpen, setIsFinancialFlowsOpen] = useState(false);
  const [isNexusModalOpen, setIsNexusModalOpen] = useState(false);
  const [isManifestRiskOpen, setIsManifestRiskOpen] = useState(false);
  const [isJudicialModeOpen, setIsJudicialModeOpen] = useState(false);
  const [alerts, setAlerts] = useState<AlertItem[]>(MOCK_ALERTS);

  // Keep search in sync with filterCriteria
  useEffect(() => {
    setFilterCriteria(prev => ({ ...prev, searchQuery }));
  }, [searchQuery]);

  // Keep selectedNode in sync with filterCriteria
  useEffect(() => {
    setFilterCriteria(prev => ({
      ...prev,
      selectedNodeId: selectedNode ? selectedNode.id : null
    }));
  }, [selectedNode]);

  // Scope base nodes/edges by selected real-world case if not 'CASE_ALL'
  const scopedBaseNodes = useMemo(() => {
    if (selectedCaseId === 'CASE_ALL') return MOCK_NODES;
    return MOCK_NODES.filter(n => {
      const customPropCase = (n as any).case_id;
      return customPropCase === selectedCaseId;
    });
  }, [selectedCaseId]);

  const scopedBaseEdges = useMemo(() => {
    if (selectedCaseId === 'CASE_ALL') return MOCK_EDGES;
    return MOCK_EDGES.filter(e => {
      return e.case_id === selectedCaseId;
    });
  }, [selectedCaseId]);

  // Dynamic entity counts by category
  const entityCounts = useMemo(() => {
    const counts: Record<POLEType, number> = {
      Person: 0,
      Phone: 0,
      Account: 0,
      Vehicle: 0,
      Location: 0,
      Organization: 0,
      Event: 0,
    };
    scopedBaseNodes.forEach(n => {
      if (counts[n.type] !== undefined) {
        counts[n.type]++;
      }
    });
    return counts;
  }, [scopedBaseNodes]);

  // Reset or adjust selected node if not part of active case
  useEffect(() => {
    if (selectedNode && selectedCaseId !== 'CASE_ALL') {
      const nodeCase = (selectedNode as any).case_id;
      if (nodeCase && nodeCase !== selectedCaseId) {
        setSelectedNode(null);
      }
    }
  }, [selectedCaseId, selectedNode]);

  // Filter alerts by selected real case
  const filteredAlerts = useMemo(() => {
    if (selectedCaseId === 'CASE_ALL') return alerts;
    return alerts.filter(a => a.case_id === selectedCaseId);
  }, [alerts, selectedCaseId]);

  // Execute Graph & Timeline Filtering via IntelligenceEngine
  const { filteredNodes, filteredEdges } = useMemo(() => {
    const activeDate = dateList[currentDateIndex];
    // Filter nodes active up to selected timeline date
    const timeScopedNodes = IntelligenceEngine.filterByTimeline(scopedBaseNodes, activeDate);
    const timeScopedNodeIds = new Set(timeScopedNodes.map(n => n.id));
    const timeScopedEdges = scopedBaseEdges.filter(e => timeScopedNodeIds.has(e.source) && timeScopedNodeIds.has(e.target));

    // Apply User Domain and Topology Filters
    return IntelligenceEngine.filterGraph(timeScopedNodes, timeScopedEdges, filterCriteria);
  }, [scopedBaseNodes, scopedBaseEdges, filterCriteria, currentDateIndex, dateList]);

  // Handle Cypher Query execution from AI Copilot
  const handleExecuteCypherFilter = (highlightedNodeIds: string[], summary: string) => {
    if (highlightedNodeIds.length > 0) {
      const matchNode = MOCK_NODES.find(n => n.id === highlightedNodeIds[0]);
      if (matchNode) setSelectedNode(matchNode);
    }
  };

  // Focus a specific location on the map
  const handleFocusMapLocation = (node: POLENode) => {
    setCurrentView('GEOSPATIAL_MAP');
    setSelectedNode(node);
  };

  // Handle Alert Click
  const handleSelectAlert = (alert: AlertItem) => {
    const targetId = alert.related_node_ids?.[0];
    const node = MOCK_NODES.find(n => n.id === targetId);
    if (node) {
      setSelectedNode(node);
      setIsAlertsOpen(false);
    }
  };

  // Handle Subgraph selection from Motif / Burst Engine
  const handleSelectSubgraph = (nodeIds: string[]) => {
    if (nodeIds.length > 0) {
      const first = MOCK_NODES.find(n => n.id === nodeIds[0]);
      if (first) setSelectedNode(first);
    }
    setCurrentView('2D_GRAPH');
  };

  const unreadAlertsCount = filteredAlerts.filter(a => a.status === 'UNRESOLVED').length;

  return (
    <div className="h-screen w-screen bg-[#F8FAFC] text-slate-900 flex overflow-hidden font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Left Sidebar */}
      <Sidebar
        activeTab={sidebarTab}
        setActiveTab={(tab) => {
          setSidebarTab(tab);
          if (tab === 'ALERTS_RISKS') {
            setIsAlertsOpen(true);
          } else if (tab === 'ENTITY_SEARCH') {
            setIsResolutionModalOpen(true);
          } else if (tab === 'DASHBOARD') {
            setCurrentView('2D_GRAPH');
          } else if (tab === 'GRAPH_ANALYTICS') {
            setCurrentView('2D_GRAPH');
          }
        }}
        unreadAlertsCount={unreadAlertsCount}
        onOpenSettings={() => setIsManifestRiskOpen(true)}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#FFFFFF]">
        
        {/* Top Navigation Bar */}
        <TopNav
          currentView={currentView}
          setCurrentView={setCurrentView}
          onExecuteCypherFilter={handleExecuteCypherFilter}
          allNodes={MOCK_NODES}
          unreadAlertsCount={unreadAlertsCount}
          onOpenAlerts={() => setIsAlertsOpen(true)}
          onOpenAnomalyMapper={() => setIsAnomalyMapperOpen(true)}
          onOpenJudicialMode={() => setIsJudicialModeOpen(true)}
          onOpenFinancialFlows={() => setIsFinancialFlowsOpen(true)}
          selectedCaseId={selectedCaseId}
          onSelectCaseId={setSelectedCaseId}
        />

        {/* Workspace Canvas (Left POLE panel + Central Visualizer) */}
        <div className="flex-1 flex overflow-hidden relative">
          
          {/* Left Column: POLE Domain Filters */}
          <aside className="w-80 shrink-0 hidden md:block h-full z-20 bg-white">
            <NodeFilter
              filterCriteria={filterCriteria}
              setFilterCriteria={setFilterCriteria}
              totalNodesCount={scopedBaseNodes.length}
              filteredNodesCount={filteredNodes.length}
              totalEdgesCount={scopedBaseEdges.length}
              filteredEdgesCount={filteredEdges.length}
              entityCounts={entityCounts}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          </aside>

          {/* Central Visualization Canvas */}
          <main className="flex-1 relative flex flex-col overflow-hidden bg-[#FFFFFF]">
            
            {currentView === '2D_GRAPH' && (
              <ForceGraph
                nodes={filteredNodes}
                edges={filteredEdges}
                selectedNodeId={selectedNode?.id || null}
                onSelectNode={setSelectedNode}
                colorMode={graphColorMode}
                setColorMode={setGraphColorMode}
                hoveredNodeId={hoveredNodeId}
                setHoveredNodeId={setHoveredNodeId}
              />
            )}

            {currentView === 'GEOSPATIAL_MAP' && (
              <GeoMap
                nodes={filteredNodes}
                edges={filteredEdges}
                selectedNodeId={selectedNode?.id || null}
                onSelectNode={setSelectedNode}
                timelineStartDate="2018-01-01"
                timelineEndDate={dateList[currentDateIndex]}
                selectedCaseId={selectedCaseId}
                activeTelemetryTrack={activeTelemetryTrack}
                currentTelemetryWaypointIndex={currentTelemetryWaypointIndex}
                onSelectTelemetryTrack={setActiveTelemetryTrack}
                onTelemetryWaypointChange={setCurrentTelemetryWaypointIndex}
              />
            )}

            {currentView === 'EVIDENCE_DAG' && (
              <EvidenceChain
                nodes={MOCK_NODES}
                onSelectNode={setSelectedNode}
                selectedCaseId={selectedCaseId}
              />
            )}

            {currentView === 'SPLIT_SCREEN' && (
              <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
                <div className="h-full relative border-r border-slate-200">
                  <ForceGraph
                    nodes={filteredNodes}
                    edges={filteredEdges}
                    selectedNodeId={selectedNode?.id || null}
                    onSelectNode={setSelectedNode}
                    colorMode={graphColorMode}
                    setColorMode={setGraphColorMode}
                    hoveredNodeId={hoveredNodeId}
                    setHoveredNodeId={setHoveredNodeId}
                  />
                </div>
                <div className="h-full relative">
                  <GeoMap
                    nodes={filteredNodes}
                    edges={filteredEdges}
                    selectedNodeId={selectedNode?.id || null}
                    onSelectNode={setSelectedNode}
                    timelineStartDate="2018-01-01"
                    timelineEndDate={dateList[currentDateIndex]}
                    selectedCaseId={selectedCaseId}
                    activeTelemetryTrack={activeTelemetryTrack}
                    currentTelemetryWaypointIndex={currentTelemetryWaypointIndex}
                    onSelectTelemetryTrack={setActiveTelemetryTrack}
                    onTelemetryWaypointChange={setCurrentTelemetryWaypointIndex}
                  />
                </div>
              </div>
            )}

            {/* Bottom Floating Unified Temporal Evolution & 4D Telemetry Player */}
            <UnifiedTemporalTelemetry
              currentDateIndex={currentDateIndex}
              setCurrentDateIndex={setCurrentDateIndex}
              dateList={dateList}
              selectedCaseId={selectedCaseId}
              activeTrack={activeTelemetryTrack}
              onSelectTrack={setActiveTelemetryTrack}
              currentWaypointIndex={currentTelemetryWaypointIndex}
              onWaypointChange={setCurrentTelemetryWaypointIndex}
              onFocusCoordinates={(lat, lng) => {
                if (currentView !== 'GEOSPATIAL_MAP' && currentView !== 'SPLIT_SCREEN') {
                  setCurrentView('GEOSPATIAL_MAP');
                }
              }}
            />

          </main>

          {/* Right Drawer: Suspect & Entity Dossier Inspector */}
          {selectedNode && (
            <aside className="shrink-0 z-40 shadow-2xl h-full">
              <NodeDetail
                node={selectedNode}
                onClose={() => setSelectedNode(null)}
                edges={MOCK_EDGES}
                allNodes={MOCK_NODES}
                onSelectNode={setSelectedNode}
                onFocusMapLocation={handleFocusMapLocation}
              />
            </aside>
          )}

        </div>

      </div>

      {/* Alerts Drawer */}
      <AlertPanel
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
        alerts={filteredAlerts}
        onSelectAlert={handleSelectAlert}
      />

      {/* Entity Resolution & Deduplication Modal */}
      <EntityResolutionModal
        isOpen={isResolutionModalOpen}
        onClose={() => setIsResolutionModalOpen(false)}
        allNodes={MOCK_NODES}
      />

      {/* Motif Detection & Burst Analysis Modal */}
      <MotifAndBurstModal
        isOpen={isMotifsModalOpen}
        onClose={() => setIsMotifsModalOpen(false)}
        nodes={MOCK_NODES}
        edges={MOCK_EDGES}
        onSelectSubgraph={handleSelectSubgraph}
      />

      {/* Real-World Case Anomaly & Evidence Mapper Modal */}
      <AnomalyMapperModal
        isOpen={isAnomalyMapperOpen}
        onClose={() => setIsAnomalyMapperOpen(false)}
        onFocusNodeOnGraph={(id) => {
          const n = MOCK_NODES.find(node => node.id === id);
          if (n) {
            setSelectedNode(n);
            setCurrentView('2D_GRAPH');
          }
        }}
        onFocusNodeOnMap={(id) => {
          const n = MOCK_NODES.find(node => node.id === id);
          if (n) {
            setSelectedNode(n);
            setCurrentView('GEOSPATIAL_MAP');
          }
        }}
        selectedCaseId={selectedCaseId}
      />

      {/* Financial Flow & Hawala Sankey Drawer */}
      <FinancialFlowSankeyDrawer
        isOpen={isFinancialFlowsOpen}
        onClose={() => setIsFinancialFlowsOpen(false)}
        selectedCaseId={selectedCaseId}
      />

      {/* Syndicate Nexus & Cross-Case Entity Resolution */}
      <CrossCaseNexusModal
        isOpen={isNexusModalOpen}
        onClose={() => setIsNexusModalOpen(false)}
        onSelectNode={(node) => {
          setSelectedNode(node);
          setCurrentView('2D_GRAPH');
        }}
      />

      {/* Algorithmic Manifest Risk Scorer */}
      <ManifestRiskScorerModal
        isOpen={isManifestRiskOpen}
        onClose={() => setIsManifestRiskOpen(false)}
      />

      {/* Judicial Courtroom Mode */}
      <JudicialCourtroomMode
        isOpen={isJudicialModeOpen}
        onClose={() => setIsJudicialModeOpen(false)}
        selectedCaseId={selectedCaseId}
      />

    </div>
  );
}

export default App;
