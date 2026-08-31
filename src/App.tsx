import React, { useState, useMemo, useEffect } from 'react';
import { Header, ActiveTab } from './components/Header';
import { ForceGraph, GraphColorMode } from './components/ForceGraph';
import { GeoMap } from './components/GeoMap';
import { TimelineScrubber } from './components/TimelineScrubber';
import { EvidenceChain } from './components/EvidenceChain';
import { NLQueryBar } from './components/NLQueryBar';
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

import { POLENode, POLEEdge, AlertItem, CaseId } from './types';
import { MOCK_NODES, MOCK_EDGES, MOCK_ALERTS, TIMELINE_SNAPSHOTS } from './data/mockData';
import { IntelligenceEngine, GraphFilterCriteria } from './data/intelligenceEngine';

export function App() {
  // Navigation & View State
  const [activeTab, setActiveTab] = useState<ActiveTab>('GRAPH');
  const [graphColorMode, setGraphColorMode] = useState<GraphColorMode>('POLE');
  const [userRole, setUserRole] = useState('Investigator');

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

  // Timeline Scrubber State
  const dateList = useMemo(() => TIMELINE_SNAPSHOTS.map(s => s.date), []);
  const [currentDateIndex, setCurrentDateIndex] = useState(dateList.length - 1);

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
    setActiveTab('MAP');
    setSelectedNode(node);
  };

  // Focus node on graph from anomaly mapper
  const handleFocusNodeOnGraph = (nodeId: string) => {
    const node = MOCK_NODES.find(n => n.id === nodeId);
    if (node) {
      setSelectedNode(node);
      setActiveTab('GRAPH');
    }
  };

  // Focus node on map from anomaly mapper
  const handleFocusNodeOnMap = (nodeId: string) => {
    const node = MOCK_NODES.find(n => n.id === nodeId);
    if (node) {
      setSelectedNode(node);
      setActiveTab('MAP');
    }
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
    setActiveTab('GRAPH');
  };

  const unreadAlertsCount = filteredAlerts.filter(a => a.status === 'UNRESOLVED').length;

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#243324] flex flex-col font-sans selection:bg-[#E8DCC4] selection:text-[#1F2B1D] overflow-hidden">
      
      {/* Top Application Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'RESOLUTION') {
            setIsResolutionModalOpen(true);
          } else if (tab === 'ALERTS') {
            setIsAlertsOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        unreadAlertsCount={unreadAlertsCount}
        onOpenAlerts={() => setIsAlertsOpen(true)}
        onOpenMotifs={() => setIsMotifsModalOpen(true)}
        onOpenAnomalyMapper={() => setIsAnomalyMapperOpen(true)}
        onOpenFinancialFlows={() => setIsFinancialFlowsOpen(true)}
        onOpenNexusModal={() => setIsNexusModalOpen(true)}
        onOpenManifestScorer={() => setIsManifestRiskOpen(true)}
        onOpenJudicialMode={() => setIsJudicialModeOpen(true)}
        selectedCaseId={selectedCaseId}
        onSelectCaseId={setSelectedCaseId}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        userRole={userRole}
        setUserRole={setUserRole}
      />

      {/* AI Natural Language Query & Cypher Copilot Bar (Visible in Graph and Map views) */}
      {(activeTab === 'GRAPH' || activeTab === 'MAP') && (
        <NLQueryBar
          onExecuteCypherFilter={handleExecuteCypherFilter}
          allNodes={MOCK_NODES}
        />
      )}

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Side: POLE Filters Drawer (in Graph and Map views) */}
        {(activeTab === 'GRAPH' || activeTab === 'MAP') && (
          <aside className="w-72 shrink-0 hidden md:block z-20 shadow-xs border-r border-[#E5DFD3] bg-[#FBF9F5]">
            <NodeFilter
              filterCriteria={filterCriteria}
              setFilterCriteria={setFilterCriteria}
              totalNodesCount={scopedBaseNodes.length}
              filteredNodesCount={filteredNodes.length}
              totalEdgesCount={scopedBaseEdges.length}
              filteredEdgesCount={filteredEdges.length}
            />
          </aside>
        )}

        {/* Central Visualization Canvas */}
        <main className="flex-1 relative flex flex-col overflow-hidden bg-[#F6F3EC]">
          {activeTab === 'GRAPH' && (
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

          {activeTab === 'MAP' && (
            <GeoMap
              nodes={filteredNodes}
              edges={filteredEdges}
              selectedNodeId={selectedNode?.id || null}
              onSelectNode={setSelectedNode}
              timelineStartDate="2018-01-01"
              timelineEndDate={dateList[currentDateIndex]}
              selectedCaseId={selectedCaseId}
            />
          )}

          {activeTab === 'EVIDENCE' && (
            <EvidenceChain
              nodes={MOCK_NODES}
              onSelectNode={setSelectedNode}
              selectedCaseId={selectedCaseId}
            />
          )}

          {activeTab === 'INGESTION' && (
            <IngestionStudio />
          )}
        </main>

        {/* Right Side: Suspect & Entity Dossier Inspector */}
        {selectedNode && (
          <aside className="shrink-0 z-30 shadow-xl">
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

      {/* Bottom Timeline Scrubber (Synchronized in Graph & Map Views) */}
      {(activeTab === 'GRAPH' || activeTab === 'MAP') && (
        <TimelineScrubber
          currentDateIndex={currentDateIndex}
          setCurrentDateIndex={setCurrentDateIndex}
          dateList={dateList}
        />
      )}

      {/* Real-World Case Anomaly & Evidence Mapper Modal */}
      <AnomalyMapperModal
        isOpen={isAnomalyMapperOpen}
        onClose={() => setIsAnomalyMapperOpen(false)}
        selectedCaseId={selectedCaseId}
        onSelectCaseId={setSelectedCaseId}
        onFocusNodeOnGraph={handleFocusNodeOnGraph}
        onFocusNodeOnMap={handleFocusNodeOnMap}
        allNodes={MOCK_NODES}
      />

      {/* Priority Tactical Alerts Drawer */}
      <AlertPanel
        alerts={filteredAlerts}
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
        onSelectAlert={handleSelectAlert}
        allNodes={MOCK_NODES}
      />

      {/* Vector Entity Resolution Studio Modal */}
      <EntityResolutionModal
        isOpen={isResolutionModalOpen}
        onClose={() => setIsResolutionModalOpen(false)}
        onMergeComplete={(canonicalId, count) => {
          alert(`Successfully merged ${count} duplicate records into Golden Record: ${canonicalId}`);
        }}
      />

      {/* Motif Detection & CDR Burst Telemetry Modal */}
      <MotifAndBurstModal
        isOpen={isMotifsModalOpen}
        onClose={() => setIsMotifsModalOpen(false)}
        onSelectSubgraph={handleSelectSubgraph}
      />

      {/* Multi-Jurisdiction Financial Flow & Hawala Sankey Drawer */}
      <FinancialFlowSankeyDrawer
        isOpen={isFinancialFlowsOpen}
        onClose={() => setIsFinancialFlowsOpen(false)}
        selectedCaseId={selectedCaseId}
        onSelectArcOnMap={(arc) => {
          setIsFinancialFlowsOpen(false);
          setActiveTab('MAP');
        }}
      />

      {/* Cross-Case Entity Resolution & Syndicate Nexus Studio */}
      <CrossCaseNexusModal
        isOpen={isNexusModalOpen}
        onClose={() => setIsNexusModalOpen(false)}
      />

      {/* Algorithmic Manifest Anomaly & Port Vulnerability Index */}
      <ManifestRiskScorerModal
        isOpen={isManifestRiskOpen}
        onClose={() => setIsManifestRiskOpen(false)}
      />

      {/* Judicial Courtroom Presentation & Chain of Custody Verification */}
      <JudicialCourtroomMode
        isOpen={isJudicialModeOpen}
        onClose={() => setIsJudicialModeOpen(false)}
        selectedCaseId={selectedCaseId}
      />

    </div>
  );
}

export default App;

