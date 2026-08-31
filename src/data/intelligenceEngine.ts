import { POLENode, POLEEdge, GraphDataset, POLEType } from '../types';
import { INITIAL_GRAPH_DATA } from './mockData';

export interface GraphFilterCriteria {
  poleTypes: POLEType[];
  minRisk: number;
  communityId: number | 'ALL';
  startDate?: string;
  endDate?: string;
  searchQuery?: string;
  highBrokersOnly?: boolean;
  anomaliesOnly?: boolean;
  structuringOnly?: boolean;
  selectedNodeId?: string | null;
  egoRadius?: number; // 1-hop or 2-hop
}

export class IntelligenceEngine {
  private data: GraphDataset;

  constructor(initialData: GraphDataset = INITIAL_GRAPH_DATA) {
    this.data = JSON.parse(JSON.stringify(initialData));
  }

  public getDataset(): GraphDataset {
    return this.data;
  }

  /**
   * Filter graph by POLE domains, timeline bounds, ego-networks, and anomaly thresholds
   */
  public filterGraph(criteria: GraphFilterCriteria): GraphDataset {
    let nodes = this.data.nodes.filter(node => {
      // POLE domain filter
      if (!criteria.poleTypes.includes(node.type)) {
        return false;
      }
      // Risk filter
      if (node.risk_score < criteria.minRisk) {
        return false;
      }
      // Community filter
      if (criteria.communityId !== 'ALL' && node.community_id !== criteria.communityId) {
        return false;
      }
      // High broker filter
      if (criteria.highBrokersOnly && node.broker_score < 0.2) {
        return false;
      }
      // Anomaly filter
      if (criteria.anomaliesOnly && node.gae_anomaly_score < 0.6) {
        return false;
      }
      // Structuring filter
      if (criteria.structuringOnly) {
        if (node.type === 'Account') {
          const acc = node as any;
          if (!acc.structuring_flag) return false;
        } else if (!node.tags.some(t => t.toLowerCase().includes('structur') || t.toLowerCase().includes('smurf'))) {
          return false;
        }
      }
      // Search query
      if (criteria.searchQuery && criteria.searchQuery.trim() !== '') {
        const q = criteria.searchQuery.toLowerCase();
        const matchLabel = node.label.toLowerCase().includes(q);
        const matchNotes = node.notes?.toLowerCase().includes(q) || false;
        const matchTags = node.tags.some(t => t.toLowerCase().includes(q));
        const matchAlias = (node as any).aliases?.some((a: string) => a.toLowerCase().includes(q)) || false;
        if (!matchLabel && !matchNotes && !matchTags && !matchAlias) {
          return false;
        }
      }
      return true;
    });

    // If ego-network is selected
    if (criteria.selectedNodeId && criteria.egoRadius && criteria.egoRadius > 0) {
      const neighborIds = new Set<string>([criteria.selectedNodeId]);
      
      // Hop 1
      this.data.edges.forEach(e => {
        if (e.source === criteria.selectedNodeId) neighborIds.add(e.target);
        if (e.target === criteria.selectedNodeId) neighborIds.add(e.source);
      });

      // Hop 2
      if (criteria.egoRadius >= 2) {
        const hop1Array = Array.from(neighborIds);
        this.data.edges.forEach(e => {
          if (hop1Array.includes(e.source)) neighborIds.add(e.target);
          if (hop1Array.includes(e.target)) neighborIds.add(e.source);
        });
      }

      nodes = nodes.filter(n => neighborIds.has(n.id));
    }

    const nodeIds = new Set(nodes.map(n => n.id));

    // Filter edges
    let edges = this.data.edges.filter(edge => {
      if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) {
        return false;
      }
      // Timeline filter
      if (criteria.startDate && edge.timestamp && edge.timestamp < criteria.startDate) {
        return false;
      }
      if (criteria.endDate && edge.timestamp && edge.timestamp > criteria.endDate) {
        return false;
      }
      return true;
    });

    return { nodes, edges };
  }

  /**
   * Execute simulated or parsed Cypher queries for the dashboard
   */
  public executeCypher(query: string): { matchedNodes: POLENode[]; cypherSummary: string } {
    const qLower = query.toLowerCase();
    let matchedNodes: POLENode[] = [];
    let summary = '';

    if (qLower.includes('broker') || qLower.includes('centrality')) {
      matchedNodes = this.data.nodes.filter(n => n.broker_score >= 0.2);
      summary = `MATCH (p:Person) WHERE p.broker_score >= 0.2 RETURN p.name, p.broker_score ORDER BY p.broker_score DESC — Found ${matchedNodes.length} brokers.`;
    } else if (qLower.includes('burner') || qLower.includes('burst')) {
      matchedNodes = this.data.nodes.filter(n => n.type === 'Phone' && (n as any).burner_probability > 0.4);
      summary = `MATCH (ph:Phone) WHERE ph.burner_probability > 0.4 RETURN ph.msisdn, ph.burst_count — Found ${matchedNodes.length} burner devices.`;
    } else if (qLower.includes('structuring') || qLower.includes('smurf') || qLower.includes('50000') || qLower.includes('hawala')) {
      matchedNodes = this.data.nodes.filter(n => n.type === 'Account' && (n as any).structuring_flag);
      summary = `MATCH (a:Account)-[:TRANSACTED]->(b:Account) WHERE a.structuring_flag = true RETURN a, b — Found ${matchedNodes.length} accounts involved in structuring.`;
    } else if (qLower.includes('tariq') || qLower.includes('falcon')) {
      matchedNodes = this.data.nodes.filter(n => n.label.toLowerCase().includes('tariq'));
      summary = `MATCH (p:Person {name: "Tariq Merchant"})-[r*1..2]-(connected) RETURN p, r, connected — Identified apex cell.`;
    } else if (qLower.includes('port') || qLower.includes('mandwa') || qLower.includes('nhava')) {
      matchedNodes = this.data.nodes.filter(n => n.type === 'Location' || n.label.toLowerCase().includes('mandwa') || n.label.toLowerCase().includes('nhava'));
      summary = `MATCH (l:Location)<-[:OCCURRED_AT|FREQUENTS]-(entity) WHERE l.name CONTAINS "Port" OR l.name CONTAINS "Mandwa" RETURN l, entity.`;
    } else {
      matchedNodes = this.data.nodes.filter(n => n.risk_level === 'CRITICAL');
      summary = `MATCH (n) WHERE n.risk_score >= 85 RETURN n ORDER BY n.risk_score DESC LIMIT 10 — Retrieved top critical threats.`;
    }

    return { matchedNodes, cypherSummary: summary };
  }

  public static filterByTimeline(nodes: POLENode[], activeDate: string): POLENode[] {
    if (!activeDate) return nodes;
    return nodes.filter(n => {
      if (!n.created_at) return true;
      return n.created_at.slice(0, 10) <= activeDate;
    });
  }

  public static filterGraph(
    nodes: POLENode[],
    edges: POLEEdge[],
    criteria: GraphFilterCriteria
  ): { filteredNodes: POLENode[]; filteredEdges: POLEEdge[] } {
    let filteredNodes = nodes.filter(node => {
      // POLE domain filter
      if (!criteria.poleTypes.includes(node.type)) {
        return false;
      }
      // Risk filter
      if (node.risk_score < criteria.minRisk) {
        return false;
      }
      // Community filter
      if (criteria.communityId !== 'ALL' && node.community_id !== criteria.communityId) {
        return false;
      }
      // High broker filter
      if (criteria.highBrokersOnly && node.broker_score < 0.2) {
        return false;
      }
      // Anomaly filter
      if (criteria.anomaliesOnly && node.gae_anomaly_score < 0.6) {
        return false;
      }
      // Structuring filter
      if (criteria.structuringOnly) {
        if (node.type === 'Account') {
          const acc = node as any;
          if (!acc.structuring_flag) return false;
        } else if (!node.tags.some(t => t.toLowerCase().includes('structur') || t.toLowerCase().includes('smurf'))) {
          return false;
        }
      }
      // Search query
      if (criteria.searchQuery && criteria.searchQuery.trim() !== '') {
        const q = criteria.searchQuery.toLowerCase();
        const matchLabel = node.label.toLowerCase().includes(q);
        const matchNotes = node.notes?.toLowerCase().includes(q) || false;
        const matchTags = node.tags?.some(t => t.toLowerCase().includes(q)) || false;
        const matchAlias = (node as any).aliases?.some((a: string) => a.toLowerCase().includes(q)) || false;
        if (!matchLabel && !matchNotes && !matchTags && !matchAlias) {
          return false;
        }
      }
      return true;
    });

    // If ego-network is selected
    if (criteria.selectedNodeId && criteria.egoRadius && criteria.egoRadius > 0) {
      const neighborIds = new Set<string>([criteria.selectedNodeId]);
      
      // Hop 1
      edges.forEach(e => {
        if (e.source === criteria.selectedNodeId) neighborIds.add(e.target);
        if (e.target === criteria.selectedNodeId) neighborIds.add(e.source);
      });

      // Hop 2
      if (criteria.egoRadius >= 2) {
        const hop1Array = Array.from(neighborIds);
        edges.forEach(e => {
          if (hop1Array.includes(e.source)) neighborIds.add(e.target);
          if (hop1Array.includes(e.target)) neighborIds.add(e.source);
        });
      }

      filteredNodes = filteredNodes.filter(n => neighborIds.has(n.id));
    }

    const nodeIds = new Set(filteredNodes.map(n => n.id));

    // Filter edges
    const filteredEdges = edges.filter(edge => {
      if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) {
        return false;
      }
      if (criteria.startDate && edge.timestamp && edge.timestamp < criteria.startDate) {
        return false;
      }
      if (criteria.endDate && edge.timestamp && edge.timestamp > criteria.endDate) {
        return false;
      }
      return true;
    });

    return { filteredNodes, filteredEdges };
  }
}

export const globalIntelligence = new IntelligenceEngine();
