
import React, { useState, useMemo, useCallback, useRef } from 'react';
import { RefreshCw, MousePointer, ZoomIn, ZoomOut, Maximize2, Eye, EyeOff, Search, Filter, Map, Clock, Brain } from 'lucide-react';
import DetailsPanel from './DetailsPanel';
import { adjustBrightness, getNodeProgress } from '../utils/helpers';

export default React.memo(function MindmapView({ nodes, edges, problems, selected, setSelected, completedProblems, setCompletedProblems }) {
  console.log('MindmapView received problems:', problems?.length, 'problems');
  console.log('Selected node:', selected);
  console.log('Problems for selected node:', problems?.filter(p => p.nodeId === selected));

  const [viewTransform, setViewTransform] = useState({ scale: 0.8, x: 0, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredEdge, setHoveredEdge] = useState(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  
  // New working features
  const [searchTerm, setSearchTerm] = useState('');
  const [showNodeLabels, setShowNodeLabels] = useState(true);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  
  const svgRef = useRef(null);
  const nodeMap = useMemo(() => {
    if (!nodes || !Array.isArray(nodes)) return {};
    const map = {};
    nodes.forEach(node => {
      map[node.id] = node;
    });
    return map;
  }, [nodes]);

  // Working search filter
  const filteredNodes = useMemo(() => {
    if (!nodes || !Array.isArray(nodes)) return [];
    if (!searchTerm) return nodes;
    return nodes.filter(node => 
      node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (node.examples && node.examples.some(ex => ex.toLowerCase().includes(searchTerm.toLowerCase())))
    );
  }, [nodes, searchTerm]);

  // Working recommendations based on connections
  const getRecommendedNodes = useCallback(() => {
    if (!selected || !edges || !Array.isArray(edges)) return [];
    
    const connectedNodeIds = edges
      .filter(edge => edge.from === selected || edge.to === selected)
      .map(edge => edge.from === selected ? edge.to : edge.from);
    
    return connectedNodeIds
      .map(id => nodeMap[id])
      .filter(Boolean)
      .slice(0, 3);
  }, [selected, edges, nodeMap]);

  // Enhanced mouse wheel zoom
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    // Use smaller delta for smoother trackpad/mousewheel zooming
    const zoomSensitivity = 0.0005;
    const delta = Math.exp(-e.deltaY * zoomSensitivity);
    setViewTransform(prev => ({
      ...prev,
      // Restrict zoom limits to prevent map from being too tiny or absurdly huge
      scale: Math.max(0.4, Math.min(1.5, prev.scale * delta))
    }));
  }, []);

  // Working zoom controls
  const zoomIn = () => setViewTransform(prev => ({ ...prev, scale: Math.min(1.5, prev.scale * 1.2) }));
  const zoomOut = () => setViewTransform(prev => ({ ...prev, scale: Math.max(0.4, prev.scale / 1.2) }));

  // Working fit to view
  const fitToView = useCallback(() => {
    if (!filteredNodes || !Array.isArray(filteredNodes) || filteredNodes.length === 0) return;
    
    const margin = 100;
    const bounds = filteredNodes.reduce((acc, node) => ({
      minX: Math.min(acc.minX, node.x || 0),
      maxX: Math.max(acc.maxX, (node.x || 0) + (node.w || 100)),
      minY: Math.min(acc.minY, node.y || 0),
      maxY: Math.max(acc.maxY, (node.y || 0) + (node.h || 50))
    }), { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity });
    
    const width = bounds.maxX - bounds.minX + margin * 2;
    const height = bounds.maxY - bounds.minY + margin * 2;
    const centerX = (bounds.minX + bounds.maxX) / 2;
    const centerY = (bounds.minY + bounds.maxY) / 2;
    
    const scaleX = window.innerWidth / width;
    const scaleY = window.innerHeight / height;
    const scale = Math.min(scaleX, scaleY, 1);
    
    setViewTransform({
      scale,
      x: window.innerWidth / 2 - centerX * scale,
      y: window.innerHeight / 2 - centerY * scale
    });
  }, [filteredNodes]);

  const resetView = () => setViewTransform({ scale: 0.8, x: 0, y: 50 });

  // Enhanced drag functionality
  const handleMouseDown = useCallback((e) => {
    if (e.target.tagName === 'rect' || e.target.tagName === 'text') return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    e.preventDefault();
    e.stopPropagation();
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    setViewTransform(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
    setDragStart({ x: e.clientX, y: e.clientY });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  // Enhanced node selection with history
  const handleNodeClick = useCallback((nodeId, e) => {
    e.stopPropagation();
    e.preventDefault();
    
    setSelected(nodeId);
    
    // Track recently viewed (working feature)
    setRecentlyViewed(prev => {
      const updated = [nodeId, ...prev.filter(id => id !== nodeId)].slice(0, 5);
      return updated;
    });
    
    // Double-click to focus (working feature)
    if (e.detail === 2) {
      const node = nodeMap[nodeId];
      if (node) {
        setViewTransform({
          scale: 1.0, // Fixed safe zoom factor instead of 1.2
          x: window.innerWidth / 2 - (node.x + node.w / 2) * 1.0,
          y: window.innerHeight / 2 - (node.y + node.h / 2) * 1.0
        });
      }
    }
  }, [setSelected, nodeMap]);

  if (!nodes || nodes.length === 0) {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="aurora-bg"></div>
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-2xl font-semibold mb-2">Loading Knowledge Map</div>
          <div className="text-white/70 text-sm">Preparing your learning journey...</div>
        </div>
      </div>
    );
  }

  const recommendedNodes = getRecommendedNodes();

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="aurora-bg"></div>
      
      {/* Modern Search Bar */}
      <div className="absolute top-4 left-4 z-30">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="flex items-center p-3">
            <Search className="w-5 h-5 text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Search topics, algorithms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm w-64"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="ml-2 text-gray-400 hover:text-gray-600 text-lg"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Smart Recommendations Panel */}
      {selected && recommendedNodes.length > 0 && (
        <div className="absolute top-4 right-4 z-30 w-80">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-4">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-600" />
              Related Topics
            </h3>
            <div className="space-y-2">
              {recommendedNodes.map(node => (
                <button
                  key={node.id}
                  onClick={() => handleNodeClick(node.id, { stopPropagation: () => {}, detail: 1 })}
                  className="w-full text-left p-3 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full border-2 border-white shadow-sm" 
                      style={{ backgroundColor: node.color }}
                    ></div>
                    <span className="font-medium text-gray-800 group-hover:text-purple-700">
                      {node.label}
                    </span>
                  </div>
                  {node.examples[0] && (
                    <div className="text-xs text-gray-500 mt-1 ml-7">{node.examples[0]}</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recently Viewed Quick Access */}
      {recentlyViewed.length > 0 && (
        <div className="absolute top-20 left-4 z-30">
          <div className="bg-white/90 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-3">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Recent</span>
            </div>
            <div className="flex gap-2">
              {recentlyViewed.slice(0, 4).map(nodeId => {
                const node = nodeMap[nodeId];
                return node ? (
                  <button
                    key={nodeId}
                    onClick={() => handleNodeClick(nodeId, { stopPropagation: () => {}, detail: 1 })}
                    className="w-8 h-8 rounded-lg border-2 border-white shadow-sm hover:scale-110 transition-transform"
                    style={{ backgroundColor: node.color }}
                    title={node.label}
                  />
                ) : null;
              })}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Control Panel */}
      <div className="absolute bottom-4 left-4 z-30 flex gap-3">
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-2">
          <div className="flex gap-1">
            <button 
              onClick={zoomIn} 
              title="Zoom In" 
              className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
            >
              <ZoomIn className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
            </button>
            <button 
              onClick={zoomOut} 
              title="Zoom Out" 
              className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
            >
              <ZoomOut className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
            </button>
            <button 
              onClick={fitToView} 
              title="Fit to View" 
              className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
            >
              <Maximize2 className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
            </button>
            <button 
              onClick={resetView} 
              title="Reset View" 
              className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
            >
              <RefreshCw className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
            </button>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-2">
          <button
            onClick={() => setShowNodeLabels(!showNodeLabels)}
            title={showNodeLabels ? "Hide Labels" : "Show Labels"}
            className={`p-2 rounded-lg transition-colors ${
              showNodeLabels ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-600'
            }`}
          >
            {showNodeLabels ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Search Results Info */}
      {searchTerm && (
        <div className="absolute top-16 left-4 z-20">
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm">
            {filteredNodes.length} topic{filteredNodes.length !== 1 ? 's' : ''} found
          </div>
        </div>
      )}

      {/* Main SVG Canvas */}
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        className={`absolute left-0 top-0 ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <defs>
          {nodes.map(node => (
            <React.Fragment key={node.id}>
              <linearGradient id={`gradient-${node.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={adjustBrightness(node.color, 15)} />
                <stop offset="50%" stopColor={node.color} />
                <stop offset="100%" stopColor={adjustBrightness(node.color, -15)} />
              </linearGradient>
              <filter id={`glow-${node.id}`} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </React.Fragment>
          ))}
        </defs>

        <g transform={`translate(${viewTransform.x}, ${viewTransform.y}) scale(${viewTransform.scale})`}>
          {/* Enhanced Edges */}
          {edges && Array.isArray(edges) && edges.map((edge, i) => {
            const from = nodeMap[edge.from];
            const to = nodeMap[edge.to];
            if (!from || !to) return null;

            const isHovered = hoveredEdge === i;
            const shouldShow = filteredNodes.includes(from) && filteredNodes.includes(to);
            
            if (!shouldShow) return null;

            return (
              <line
                key={i}
                x1={from.x + from.w / 2}
                y1={from.y + from.h / 2}
                x2={to.x + to.w / 2}
                y2={to.y + to.h / 2}
                stroke={isHovered ? "#6366f1" : (edge.type === "mix" ? "#94a3b8" : "#64748b")}
                strokeWidth={edge.type === "parent" ? (isHovered ? 4 : 3) : (isHovered ? 3 : 2)}
                strokeDasharray={edge.type === "mix" ? "8 4" : ""}
                opacity={isHovered ? 0.9 : 0.6}
                onMouseEnter={() => setHoveredEdge(i)}
                onMouseLeave={() => setHoveredEdge(null)}
                className="transition-all duration-300 cursor-pointer"
                style={{ pointerEvents: 'stroke' }}
              />
            );
          })}

          {/* Enhanced Nodes */}
          {filteredNodes && Array.isArray(filteredNodes) && filteredNodes.map(node => {
            const nodeProblems = problems ? problems.filter(p => p.nodeId === node.id) : [];
            const nodeProgress = getNodeProgress(node.id, nodeProblems, completedProblems);
            const isSelected = selected === node.id;
            const isHovered = hoveredNode === node.id;
            const isFiltered = searchTerm && !nodes.includes(node);

            return (
              <g
                key={node.id}
                onClick={(e) => handleNodeClick(node.id, e)}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                className="cursor-pointer"
                style={{ opacity: isFiltered ? 0.3 : 1 }}
              >
                {/* Enhanced node glow */}
                {(isSelected || isHovered) && (
                  <rect
                    x={node.x - 3}
                    y={node.y - 3}
                    width={node.w + 6}
                    height={node.h + 6}
                    rx={19}
                    fill="#6366f1"
                    opacity="0.4"
                    filter={`url(#glow-${node.id})`}
                    className="animate-pulse"
                  />
                )}

                {/* Main node rectangle */}
                <rect
                  x={node.x}
                  y={node.y}
                  width={node.w}
                  height={node.h}
                  rx={16}
                  fill={`url(#gradient-${node.id})`}
                  stroke={isSelected ? "#6366f1" : "rgba(255,255,255,0.8)"}
                  strokeWidth={isSelected ? 4 : 2.5}
                  className="transition-all duration-300 hover:brightness-110"
                  style={{
                    transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                    transformOrigin: 'center',
                    pointerEvents: 'all'
                  }}
                />

                {/* Progress bar */}
                {nodeProgress.total > 0 && (
                  <>
                    <rect
                      x={node.x}
                      y={node.y + node.h - 6}
                      width={node.w}
                      height={6}
                      rx={3}
                      fill="rgba(255,255,255,0.2)"
                    />
                    <rect
                      x={node.x}
                      y={node.y + node.h - 6}
                      width={node.w * (nodeProgress.completed / nodeProgress.total)}
                      height={6}
                      rx={3}
                      fill="rgba(255,255,255,0.9)"
                      className="transition-all duration-500"
                    />
                  </>
                )}

                {/* Node labels */}
                {showNodeLabels && (
                  <>
                    <text
                      x={node.x + node.w / 2}
                      y={node.y + node.h / 2 - (node.examples && node.examples.length > 0 ? 6 : 0)}
                      textAnchor="middle"
                      alignmentBaseline="middle"
                      fontSize={node.level === 0 ? 20 : 14}
                      fontWeight="600"
                      fill="white"
                      className="select-none pointer-events-none"
                    style={{ userSelect: 'none' }}
                      // style={{ userSelect: 'none' }}
                    >
                      {node.label}
                    </text>
                    {node.examples && node.examples.length > 0 && (
                      <text
                        x={node.x + node.w / 2}
                        y={node.y + node.h / 2 + 12}
                        textAnchor="middle"
                        alignmentBaseline="middle"
                        fontSize={10}
                        fill="rgba(255,255,255,0.9)"
                        className="select-none pointer-events-none"
                        style={{ userSelect: 'none' }}
                      >
                        {node.examples[0]}
                      </text>
                    )}
                  </>
                )}

                {/* Progress percentage */}
                {nodeProgress.total > 0 && (
                  <text
                    x={node.x + node.w - 8}
                    y={node.y + 16}
                    textAnchor="end"
                    fontSize={10}
                    fill="rgba(255,255,255,0.9)"
                    fontWeight="600"
                    className="select-none pointer-events-none"
                  >
                    {Math.round((nodeProgress.completed / nodeProgress.total) * 100)}%
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Enhanced Help */}
      <div className="absolute bottom-4 right-4 z-20">
        <div className="bg-white/90 backdrop-blur-lg rounded-xl p-3 shadow-lg border border-white/20">
          <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
            <MousePointer className="w-4 h-4 text-indigo-500" />
            <span><strong>Click</strong> to explore • <strong>Drag</strong> to pan</span>
          </div>
          <div className="text-xs text-gray-500">
            <strong>Double-click</strong> to focus • <strong>Scroll</strong> to zoom
          </div>
        </div>
      </div>

      <DetailsPanel 
        selectedId={selected} 
        onClose={() => setSelected(null)} 
        onSelectNode={setSelected}
        {...{ nodes, edges, problems, completedProblems, setCompletedProblems }} 
      />
    </div>
  );
});