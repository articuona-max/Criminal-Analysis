import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { 
  POLENode, 
  POLEEdge, 
  POLEType 
} from '../types';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Download, 
  Sliders, 
  Activity, 
  ShieldAlert, 
  Layers, 
  Sparkles,
  Search,
  Maximize2
} from 'lucide-react';

export type GraphColorMode = 'POLE' | 'COMMUNITY' | 'RISK' | 'ANOMALY' | 'BROKER';

interface ForceGraphProps {
  nodes: POLENode[];
  edges: POLEEdge[];
  selectedNodeId: string | null;
  onSelectNode: (node: POLENode | null) => void;
  colorMode: GraphColorMode;
  setColorMode: (mode: GraphColorMode) => void;
  hoveredNodeId: string | null;
  setHoveredNodeId: (id: string | null) => void;
}

interface SimulationNode extends d3.SimulationNodeDatum {
  id: string;
  original: POLENode;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

interface SimulationLink extends d3.SimulationLinkDatum<SimulationNode> {
  id: string;
  source: string | SimulationNode;
  target: string | SimulationNode;
  original: POLEEdge;
}

export const ForceGraph: React.FC<ForceGraphProps> = ({
  nodes,
  edges,
  selectedNodeId,
  onSelectNode,
  colorMode,
  setColorMode,
  hoveredNodeId,
  setHoveredNodeId
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  const [repulsionForce, setRepulsionForce] = useState(-380);
  const [linkDistance, setLinkDistance] = useState(90);
  const [showPhysicsControls, setShowPhysicsControls] = useState(false);

  // Helper for node coloring based on active colorMode
  const getNodeColor = (node: POLENode): string => {
    if (colorMode === 'POLE') {
      switch (node.type) {
        case 'Person': return '#f43f5e'; // Rose / Red
        case 'Phone': return '#06b6d4'; // Cyan
        case 'Account': return '#10b981'; // Emerald
        case 'Vehicle': return '#f59e0b'; // Amber
        case 'Location': return '#a855f7'; // Purple
        case 'Organization': return '#6366f1'; // Indigo
        case 'Event': return '#ef4444'; // Red
        default: return '#94a3b8';
      }
    }

    if (colorMode === 'COMMUNITY') {
      const colors = ['#06b6d4', '#f59e0b', '#10b981', '#a855f7', '#ec4899', '#3b82f6'];
      return colors[node.community_id % colors.length] || '#94a3b8';
    }

    if (colorMode === 'RISK') {
      if (node.risk_score >= 85) return '#ef4444'; // Critical
      if (node.risk_score >= 70) return '#f97316'; // High
      if (node.risk_score >= 40) return '#eab308'; // Medium
      return '#10b981'; // Low
    }

    if (colorMode === 'ANOMALY') {
      if (node.gae_anomaly_score >= 0.7) return '#ec4899'; // High anomaly pink
      if (node.gae_anomaly_score >= 0.5) return '#f59e0b';
      return '#3b82f6';
    }

    if (colorMode === 'BROKER') {
      if (node.broker_score >= 0.25) return '#e11d48'; // High broker score
      if (node.broker_score >= 0.15) return '#f59e0b';
      return '#64748b';
    }

    return '#06b6d4';
  };

  // Build Adjacency lookup for fast 1-hop ego-network highlighting
  const connectedNodeIds = useMemo(() => {
    const activeId = hoveredNodeId || selectedNodeId;
    if (!activeId) return null;

    const set = new Set<string>([activeId]);
    edges.forEach(e => {
      if (e.source === activeId) set.add(e.target);
      if (e.target === activeId) set.add(e.source);
    });
    return set;
  }, [hoveredNodeId, selectedNodeId, edges]);

  // Main D3 simulation effect
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 800;
    const height = containerRef.current.clientHeight || 600;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Definitions (glow filters, markers, patterns)
    const defs = svg.append('defs');

    // Glow filter for high broker nodes
    const glowFilter = defs.append('filter')
      .attr('id', 'glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');
    
    glowFilter.append('feGaussianBlur')
      .attr('stdDeviation', '4')
      .attr('result', 'coloredBlur');

    const feMerge = glowFilter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Arrowhead marker for directed edges
    defs.append('marker')
      .attr('id', 'arrow')
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 22)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('d', 'M0,-5L10,0L0,5')
      .attr('fill', '#94a3b8');

    // Zoom container
    const g = svg.append('g').attr('class', 'graph-root');

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    zoomBehaviorRef.current = zoom;
    svg.call(zoom);

    // Initial center zoom
    svg.call(zoom.transform, d3.zoomIdentity.translate(width / 2, height / 2).scale(0.85));

    // Prepare simulation nodes & links
    const simNodes: SimulationNode[] = nodes.map(n => ({
      id: n.id,
      original: n,
    }));

    const simLinks: SimulationLink[] = edges.map(e => ({
      id: e.id,
      source: e.source,
      target: e.target,
      original: e,
    }));

    // Create D3 Force Simulation
    const simulation = d3.forceSimulation<SimulationNode>(simNodes)
      .force('link', d3.forceLink<SimulationNode, SimulationLink>(simLinks)
        .id(d => d.id)
        .distance(linkDistance)
      )
      .force('charge', d3.forceManyBody().strength(repulsionForce))
      .force('center', d3.forceCenter(0, 0))
      .force('collision', d3.forceCollide().radius(26));

    // Render Edges
    const linkGroup = g.append('g').attr('class', 'links');

    const link = linkGroup.selectAll<SVGLineElement, SimulationLink>('line')
      .data(simLinks)
      .enter()
      .append('line')
      .attr('stroke-width', d => d.original.type === 'PREDICTED_LINK' ? 2 : Math.max(1.2, d.original.weight * 2.5))
      .attr('stroke', d => {
        if (d.original.type === 'PREDICTED_LINK') return '#6366f1'; // Indigo dashed AI link
        if (d.original.type === 'TRANSACTED') return '#10b981'; // Emerald
        if (d.original.type === 'CALLED') return '#0ea5e9'; // Blue
        return '#94a3b8';
      })
      .attr('stroke-dasharray', d => d.original.type === 'PREDICTED_LINK' ? '5, 5' : 'none')
      .attr('marker-end', 'url(#arrow)')
      .attr('opacity', 0.65);

    // Render Edge Labels for Predicted links or Transactions
    const edgeLabel = linkGroup.selectAll<SVGTextElement, SimulationLink>('text')
      .data(simLinks.filter(l => l.original.type === 'PREDICTED_LINK' || (l.original.metadata?.amount_inr && l.original.metadata.amount_inr > 10000000)))
      .enter()
      .append('text')
      .text(d => {
        if (d.original.type === 'PREDICTED_LINK') return `AI: ${d.original.metadata?.confidence}%`;
        if (d.original.metadata?.amount_inr) return `₹${(d.original.metadata.amount_inr / 10000000).toFixed(1)}Cr`;
        return '';
      })
      .attr('font-size', '9px')
      .attr('fill', d => d.original.type === 'PREDICTED_LINK' ? '#4f46e5' : '#059669')
      .attr('text-anchor', 'middle')
      .attr('font-family', 'JetBrains Mono, monospace')
      .attr('font-weight', '600')
      .attr('opacity', 0.9);

    // Render Nodes
    const nodeGroup = g.append('g').attr('class', 'nodes');

    const node = nodeGroup.selectAll<SVGGElement, SimulationNode>('g')
      .data(simNodes)
      .enter()
      .append('g')
      .attr('class', 'node-item cursor-pointer')
      .call(
        d3.drag<SVGGElement, SimulationNode>()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    // Outer Aura / Energy Pulse for High Broker or Anomaly nodes
    node.each(function (d) {
      const gNode = d3.select(this);
      const isBroker = d.original.broker_score >= 0.2;
      const isAnomaly = d.original.gae_anomaly_score >= 0.65;

      if (isBroker || isAnomaly) {
        gNode.append('circle')
          .attr('r', 20)
          .attr('fill', 'none')
          .attr('stroke', isBroker ? '#f43f5e' : '#8b5cf6')
          .attr('stroke-width', 1.5)
          .attr('stroke-dasharray', '3, 3')
          .attr('class', 'animate-spin opacity-70');
      }
    });

    // Primary Node Circle
    node.append('circle')
      .attr('r', d => d.original.type === 'Person' && (d.original as any).role === 'Kingpin' ? 18 : 14)
      .attr('fill', d => getNodeColor(d.original))
      .attr('stroke', d => d.id === selectedNodeId ? '#4f46e5' : '#ffffff')
      .attr('stroke-width', d => d.id === selectedNodeId ? 3.5 : 2)
      .attr('filter', d => d.id === selectedNodeId || d.original.broker_score >= 0.2 ? 'url(#glow)' : null);

    // Node Type Icon Initial Letter
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .attr('fill', '#ffffff')
      .text(d => {
        switch (d.original.type) {
          case 'Person': return 'P';
          case 'Phone': return '☎';
          case 'Account': return '₹';
          case 'Vehicle': return 'V';
          case 'Location': return '⚲';
          case 'Organization': return 'O';
          case 'Event': return '⚡';
          default: return '•';
        }
      });

    // Node Label under the circle
    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', 26)
      .attr('font-size', '10px')
      .attr('font-family', 'Plus Jakarta Sans, sans-serif')
      .attr('font-weight', '600')
      .attr('fill', '#0f172a')
      .text(d => d.original.label.length > 20 ? d.original.label.slice(0, 18) + '…' : d.original.label)
      .attr('class', 'select-none pointer-events-none');

    // Risk indicator badge (top right of node)
    node.append('rect')
      .attr('x', 6)
      .attr('y', -16)
      .attr('width', 16)
      .attr('height', 10)
      .attr('rx', 3)
      .attr('fill', '#ffffff')
      .attr('stroke', d => getNodeColor(d.original))
      .attr('stroke-width', 1.2);

    node.append('text')
      .attr('x', 14)
      .attr('y', -8.5)
      .attr('text-anchor', 'middle')
      .attr('font-size', '7px')
      .attr('font-weight', 'bold')
      .attr('fill', d => getNodeColor(d.original))
      .text(d => d.original.risk_score);

    // Interactivity: Hover & Click
    node
      .on('mouseenter', (_, d) => {
        setHoveredNodeId(d.id);
      })
      .on('mouseleave', () => {
        setHoveredNodeId(null);
      })
      .on('click', (event, d) => {
        event.stopPropagation();
        onSelectNode(d.original);
      });

    svg.on('click', () => {
      onSelectNode(null);
    });

    // Tick update loop
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as SimulationNode).x || 0)
        .attr('y1', d => (d.source as SimulationNode).y || 0)
        .attr('x2', d => (d.target as SimulationNode).x || 0)
        .attr('y2', d => (d.target as SimulationNode).y || 0);

      edgeLabel
        .attr('x', d => (((d.source as SimulationNode).x || 0) + ((d.target as SimulationNode).x || 0)) / 2)
        .attr('y', d => (((d.source as SimulationNode).y || 0) + ((d.target as SimulationNode).y || 0)) / 2 - 4);

      node.attr('transform', d => `translate(${d.x || 0},${d.y || 0})`);
    });

    return () => {
      simulation.stop();
    };
  }, [nodes, edges, colorMode, repulsionForce, linkDistance, selectedNodeId]);

  // Handle ego-network opacity dimming on hover/selection
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);

    if (connectedNodeIds) {
      svg.selectAll<SVGGElement, SimulationNode>('.node-item')
        .transition()
        .duration(150)
        .style('opacity', d => connectedNodeIds.has(d.id) ? 1 : 0.15);

      svg.selectAll<SVGLineElement, SimulationLink>('.links line')
        .transition()
        .duration(150)
        .style('opacity', d => {
          const sId = typeof d.source === 'object' ? (d.source as SimulationNode).id : d.source;
          const tId = typeof d.target === 'object' ? (d.target as SimulationNode).id : d.target;
          return connectedNodeIds.has(sId) && connectedNodeIds.has(tId) ? 1 : 0.08;
        });
    } else {
      svg.selectAll('.node-item').transition().duration(150).style('opacity', 1);
      svg.selectAll('.links line').transition().duration(150).style('opacity', 0.65);
    }
  }, [connectedNodeIds]);

  // Controls
  const handleZoomIn = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      d3.select(svgRef.current).transition().duration(300).call(zoomBehaviorRef.current.scaleBy, 1.3);
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current && zoomBehaviorRef.current) {
      d3.select(svgRef.current).transition().duration(300).call(zoomBehaviorRef.current.scaleBy, 0.75);
    }
  };

  const handleResetZoom = () => {
    if (svgRef.current && zoomBehaviorRef.current && containerRef.current) {
      const width = containerRef.current.clientWidth || 800;
      const height = containerRef.current.clientHeight || 600;
      d3.select(svgRef.current).transition().duration(400).call(
        zoomBehaviorRef.current.transform,
        d3.zoomIdentity.translate(width / 2, height / 2).scale(0.85)
      );
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[600px] bg-[#FFFFFF] overflow-hidden flex flex-col select-none">
      
      {/* SVG Canvas with subtle background grid */}
      <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing bg-[#FFFFFF]">
        <defs>
          <pattern id="graph-grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="16" cy="16" r="0.9" fill="#E2E8F0" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#graph-grid)" />
      </svg>

      {/* Top Left: Live Knowledge Graph Badge */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-800 shadow-sm">
          <div className="w-4 h-4 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Layers className="w-3 h-3" />
          </div>
          <span className="font-bold text-slate-900">Live Knowledge Graph</span>
          <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
            {nodes.length} Active Nodes • {edges.length} Links
          </span>
        </div>

        {/* Physics Controls Toggle */}
        <button
          onClick={() => setShowPhysicsControls(!showPhysicsControls)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-medium transition-all shadow-2xs ${
            showPhysicsControls
              ? 'bg-blue-50 text-blue-700 border-blue-200 font-bold'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Physics</span>
        </button>
      </div>

      {/* Physics Sliders Drawer */}
      {showPhysicsControls && (
        <div className="absolute top-16 left-4 z-20 bg-white/95 backdrop-blur-md border border-slate-200 p-4 rounded-2xl text-xs shadow-xl w-64 text-slate-800 animate-in fade-in slide-in-from-top-2">
          <h4 className="font-bold text-slate-900 mb-3 uppercase text-[10px] tracking-wider">Force Dynamics</h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-[11px] mb-1 font-medium text-slate-700">
                <span>Charge Repulsion</span>
                <span className="font-mono text-indigo-600 font-bold">{repulsionForce}</span>
              </div>
              <input
                type="range"
                min="-800"
                max="-100"
                step="20"
                value={repulsionForce}
                onChange={(e) => setRepulsionForce(Number(e.target.value))}
                className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-[11px] mb-1 font-medium text-slate-700">
                <span>Link Distance</span>
                <span className="font-mono text-indigo-600 font-bold">{linkDistance}px</span>
              </div>
              <input
                type="range"
                min="40"
                max="200"
                step="5"
                value={linkDistance}
                onChange={(e) => setLinkDistance(Number(e.target.value))}
                className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* POLE Legend - Bottom Right */}
      <div className="absolute bottom-4 right-4 z-20 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-4 text-[11px] shadow-lg text-slate-700">
        <h4 className="font-bold text-slate-900 mb-2.5 uppercase text-[10px] tracking-wider">
          {colorMode === 'POLE' ? 'Ontology Legend' : `${colorMode} Spectrum`}
        </h4>
        {colorMode === 'POLE' && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-2xs"></span>
              <span>Person / Suspect</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 shadow-2xs"></span>
              <span>Phone / SIM</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-2xs"></span>
              <span>Bank Account</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-2xs"></span>
              <span>Vehicle / Hauler</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-2xs"></span>
              <span>Location / Port</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 shadow-2xs"></span>
              <span>Shell Entity</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-2xs"></span>
              <span>FIR / Seizure</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 border-b-2 border-dashed border-indigo-600"></span>
              <span>Predicted Link</span>
            </div>
          </div>
        )}
        {colorMode === 'COMMUNITY' && (
          <div className="space-y-1 font-medium">
            <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span><span>Cell 1: Apex Leadership (UAE-Mumbai)</span></div>
            <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span><span>Cell 2: Hawala Bullion Channel (Delhi)</span></div>
            <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span><span>Cell 3: Maritime Logistics & Offload</span></div>
          </div>
        )}
        {colorMode === 'BROKER' && (
          <div className="space-y-1 font-medium">
            <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span><span>Master Broker (Betweenness ≥ 0.25)</span></div>
            <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span><span>Secondary Bridge (Betweenness ≥ 0.15)</span></div>
            <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span><span>Peripheral / Leaf Node</span></div>
          </div>
        )}
      </div>

    </div>
  );
};
