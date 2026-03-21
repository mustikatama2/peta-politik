import { useEffect, useRef, useCallback, useState } from 'react'
import * as d3 from 'd3'
import { PARTY_MAP } from '../data/parties'
import { CONNECTION_TYPES } from '../data/connections'
import { PERSONS } from '../data/persons'

// Political bloc cluster definitions
const CLUSTERS = {
  kim_plus:     { label: 'KIM Plus',       color: '#ef4444', parties: ['ger','gol','nas','pan','dem','pks','pbb','pkb'] },
  pdip_oposisi: { label: 'PDIP / Oposisi', color: '#a855f7', parties: ['pdip'] },
  independent:  { label: 'Independen',     color: '#6b7280', parties: ['independent'] },
  historis:     { label: 'Historis',       color: '#92400e', parties: [] },
}

function getNodeCluster(node) {
  if (node.tier === 'historis') return 'historis'
  for (const [key, c] of Object.entries(CLUSTERS)) {
    if (c.parties.includes(node.party_id)) return key
  }
  return null
}

const LINK_COLORS = {
  koalisi:         '#3B82F6',
  keluarga:        '#EC4899',
  bisnis:          '#F59E0B',
  konflik:         '#EF4444',
  'mentor-murid':  '#8B5CF6',
  rekan:           '#6B7280',
  'mantan-koalisi':'#D97706',
}

function getPersonInfo(id) {
  const p = PERSONS.find(x => x.id === id)
  if (!p) return null
  const currentPos = p.positions?.find(pos => pos.is_current) || p.positions?.[0]
  return {
    name: p.name,
    party: PARTY_MAP[p.party_id]?.name || p.party_id || '–',
    position: currentPos?.title || '–',
  }
}

export default function NetworkGraph({
  nodes, edges, onNodeClick,
  filterType, filterParty,
  centerNodeId, highlightIds,
  visibleTypes, focusNodeId,
  showClusters,
}) {
  const svgRef      = useRef(null)
  const simulationRef = useRef(null)
  const zoomRef     = useRef(null)
  const [hoveredNode, setHoveredNode] = useState(null)
  const [tooltipPos, setTooltipPos]   = useState({ x: 0, y: 0 })

  const draw = useCallback(() => {
    const highlightSet = highlightIds ? new Set(highlightIds) : null
    if (!svgRef.current || !nodes?.length) return

    const container = svgRef.current.parentElement
    const width  = container.clientWidth  || 800
    const height = container.clientHeight || 600

    d3.select(svgRef.current).selectAll('*').remove()

    // --- Filter edges (legacy single-type filter + new visibleTypes multi-filter) ---
    let filteredEdges = edges || []
    if (filterType)    filteredEdges = filteredEdges.filter(e => e.type === filterType)
    if (visibleTypes?.length) filteredEdges = filteredEdges.filter(e => visibleTypes.includes(e.type))
    if (filterParty) {
      filteredEdges = filteredEdges.filter(e => {
        const fn = nodes.find(n => n.id === e.from)
        const tn = nodes.find(n => n.id === e.to)
        return fn?.party_id === filterParty || tn?.party_id === filterParty
      })
    }

    // --- Active node ids ---
    const activeIds = new Set()
    if (centerNodeId) {
      activeIds.add(centerNodeId)
      filteredEdges.forEach(e => {
        if (e.from === centerNodeId) activeIds.add(e.to)
        if (e.to   === centerNodeId) activeIds.add(e.from)
      })
    } else {
      nodes.forEach(n => activeIds.add(n.id))
    }

    const filteredNodes  = nodes.filter(n => activeIds.has(n.id))
    const filteredEdges2 = filteredEdges.filter(e => activeIds.has(e.from) && activeIds.has(e.to))

    // --- Pre-compute connection count per node (for sizing) ---
    const linksByNode = {}
    filteredEdges2.forEach(e => {
      linksByNode[e.from] = (linksByNode[e.from] || 0) + 1
      linksByNode[e.to]   = (linksByNode[e.to]   || 0) + 1
    })
    const radius = d => Math.max(8, Math.min(24, 8 + (linksByNode[d.id] || 0) * 1.5))

    // --- Nodes that have NO visible connections → dim ---
    const dimmedIds = new Set()
    if (visibleTypes?.length) {
      nodes.forEach(n => {
        const hasConn = filteredEdges2.some(e => e.from === n.id || e.to === n.id)
        if (!hasConn) dimmedIds.add(n.id)
      })
    }

    // --- SVG setup ---
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)

    const g = svg.append('g')

    // ── Hull layers (drawn first so they appear behind nodes/links) ──
    const hullLayer      = g.append('g').attr('class', 'hull-layer')
    const hullLabelLayer = g.append('g').attr('class', 'hull-label-layer')

    if (showClusters) {
      Object.entries(CLUSTERS).forEach(([key, clusterDef]) => {
        hullLayer.append('path')
          .attr('class', `hull-path hull-${key}`)
          .attr('fill', clusterDef.color)
          .attr('fill-opacity', 0.10)
          .attr('stroke', clusterDef.color)
          .attr('stroke-opacity', 0.45)
          .attr('stroke-width', 2)
          .attr('stroke-linejoin', 'round')
          .attr('d', '')

        hullLabelLayer.append('text')
          .attr('class', `hull-label hull-label-${key}`)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('fill', clusterDef.color)
          .attr('font-size', 13)
          .attr('font-weight', 'bold')
          .attr('opacity', 0.75)
          .style('pointer-events', 'none')
          .text(clusterDef.label)
      })
    }

    const zoom = d3.zoom()
      .scaleExtent([0.3, 3])
      .on('zoom', event => g.attr('transform', event.transform))
    svg.call(zoom)
    zoomRef.current = zoom

    // --- Arrow markers ---
    const defs = svg.append('defs')

    // Glow filter for highlighted nodes
    const glowFilter = defs.append('filter').attr('id', 'glow')
    glowFilter.append('feGaussianBlur').attr('stdDeviation', 4).attr('result', 'coloredBlur')
    const feMerge = glowFilter.append('feMerge')
    feMerge.append('feMergeNode').attr('in', 'coloredBlur')
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic')

    Object.entries(LINK_COLORS).forEach(([type, color]) => {
      defs.append('marker')
        .attr('id', `arrow-${type}`)
        .attr('viewBox', '0 -4 8 8')
        .attr('refX', 22)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-4L8,0L0,4')
        .attr('fill', color)
        .attr('opacity', 0.8)
    })

    // --- Simulation ---
    simulationRef.current = d3.forceSimulation(filteredNodes)
      .force('link', d3.forceLink(filteredEdges2).id(d => d.id).distance(d => 100 / (d.strength || 5) * 60))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide(d => radius(d) + 12))

    // --- Links ---
    const link = g.append('g').selectAll('line')
      .data(filteredEdges2)
      .join('line')
      .attr('stroke', d => LINK_COLORS[d.type] || '#6B7280')
      .attr('stroke-opacity', 0.65)
      .attr('stroke-width', d => Math.sqrt(d.strength || 3) * 0.8)
      .attr('marker-end', d => `url(#arrow-${d.type})`)

    // --- Link labels ---
    const linkLabel = g.append('g').selectAll('text')
      .data(filteredEdges2)
      .join('text')
      .attr('fill', '#9CA3AF')
      .attr('font-size', 9)
      .attr('text-anchor', 'middle')
      .attr('dy', -3)
      .text(d => d.label?.length > 25 ? d.label.slice(0, 25) + '…' : d.label)
      .style('pointer-events', 'none')
      .style('display', filteredNodes.length > 30 ? 'none' : 'block')

    // --- Nodes ---
    const node = g.append('g').selectAll('g')
      .data(filteredNodes)
      .join('g')
      .attr('cursor', 'pointer')
      .attr('opacity', d => dimmedIds.has(d.id) ? 0.2 : 1)
      .call(
        d3.drag()
          .on('start', (event, d) => {
            if (!event.active) simulationRef.current?.alphaTarget(0.3).restart()
            d.fx = d.x; d.fy = d.y
          })
          .on('drag', (event, d) => { d.fx = event.x; d.fy = event.y })
          .on('end', (event, d) => {
            if (!event.active) simulationRef.current?.alphaTarget(0)
            d.fx = null; d.fy = null
          })
      )
      .on('click', (event, d) => {
        event.stopPropagation()
        onNodeClick?.(d)
      })
      .on('mouseover', (event, d) => {
        setHoveredNode(d)
        setTooltipPos({ x: event.pageX, y: event.pageY })
      })
      .on('mousemove', event => {
        setTooltipPos({ x: event.pageX, y: event.pageY })
      })
      .on('mouseout', () => setHoveredNode(null))

    // Gold glow ring for highlighted path nodes
    node.filter(d => highlightSet?.has(d.id))
      .append('circle')
      .attr('r', d => radius(d) + 8)
      .attr('fill', 'none')
      .attr('stroke', '#F0C200')
      .attr('stroke-width', 4)
      .attr('opacity', 0.85)
      .attr('filter', 'url(#glow)')

    // Focus pulse ring
    node.filter(d => d.id === focusNodeId)
      .append('circle')
      .attr('r', d => radius(d) + 12)
      .attr('fill', 'none')
      .attr('stroke', '#60A5FA')
      .attr('stroke-width', 2.5)
      .attr('opacity', 0.7)
      .attr('class', 'focus-ring')

    // Main circle
    node.append('circle')
      .attr('r', d => d.id === centerNodeId ? radius(d) + 6 : radius(d))
      .attr('fill', d => {
        const party = d.party_id ? PARTY_MAP[d.party_id] : null
        return party?.color || '#374151'
      })
      .attr('stroke', d => {
        if (d.id === focusNodeId)        return '#60A5FA'
        if (highlightSet?.has(d.id))     return '#F0C200'
        if (d.id === centerNodeId)       return '#F59E0B'
        return '#1F2937'
      })
      .attr('stroke-width', d => {
        if (d.id === focusNodeId)        return 3
        if (highlightSet?.has(d.id))     return 3
        if (d.id === centerNodeId)       return 3
        return 1.5
      })
      .attr('fill-opacity', 0.9)

    // Node labels
    node.append('text')
      .attr('dy', d => (d.id === centerNodeId ? radius(d) + 6 : radius(d)) + 14)
      .attr('text-anchor', 'middle')
      .attr('fill', '#F9FAFB')
      .attr('font-size', 10)
      .attr('font-weight', '500')
      .text(d => {
        const parts = d.name?.split(' ') || ['?']
        return parts.length > 2 ? parts.slice(0, 2).join(' ') : d.name
      })
      .style('pointer-events', 'none')
      .style('text-shadow', '1px 1px 2px rgba(0,0,0,0.8)')

    // --- Tick ---
    simulationRef.current.on('tick', () => {
      // Update cluster hulls
      if (showClusters) {
        Object.entries(CLUSTERS).forEach(([key]) => {
          const clusterNodes = filteredNodes.filter(n => getNodeCluster(n) === key)
          if (clusterNodes.length < 2) {
            hullLayer.select(`.hull-${key}`).attr('d', '')
            hullLabelLayer.select(`.hull-label-${key}`).attr('x', -9999).attr('y', -9999)
            return
          }
          const pts = clusterNodes.map(n => [n.x, n.y])
          // Pad points outward slightly so hull doesn't hug nodes tightly
          const cx0 = pts.reduce((s, p) => s + p[0], 0) / pts.length
          const cy0 = pts.reduce((s, p) => s + p[1], 0) / pts.length
          const pad = 30
          const paddedPts = pts.map(([x, y]) => {
            const dx = x - cx0, dy = y - cy0
            const dist = Math.sqrt(dx * dx + dy * dy) || 1
            return [x + (dx / dist) * pad, y + (dy / dist) * pad]
          })
          const hull = pts.length === 2
            ? [pts[0], [pts[0][0] + 1, pts[0][1] + 1], pts[1]]
            : d3.polygonHull(paddedPts)
          if (hull) {
            hullLayer.select(`.hull-${key}`).attr('d', `M${hull.map(p => p.join(',')).join('L')}Z`)
            const cx = hull.reduce((s, p) => s + p[0], 0) / hull.length
            const cy = hull.reduce((s, p) => s + p[1], 0) / hull.length
            hullLabelLayer.select(`.hull-label-${key}`).attr('x', cx).attr('y', cy)
          }
        })
      }

      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)

      linkLabel
        .attr('x', d => (d.source.x + d.target.x) / 2)
        .attr('y', d => (d.source.y + d.target.y) / 2)

      node.attr('transform', d => `translate(${d.x},${d.y})`)
    })
  }, [nodes, edges, onNodeClick, filterType, filterParty, centerNodeId, highlightIds, visibleTypes, focusNodeId, showClusters])

  // Focus zoom effect — runs after draw settles
  useEffect(() => {
    if (!focusNodeId || !svgRef.current || !simulationRef.current || !zoomRef.current) return
    const wait = setTimeout(() => {
      const found = simulationRef.current?.nodes().find(n => n.id === focusNodeId)
      if (!found) return
      const container = svgRef.current.parentElement
      const w = container.clientWidth  || 800
      const h = container.clientHeight || 600
      const scale = 1.8
      const tx = w / 2 - found.x * scale
      const ty = h / 2 - found.y * scale
      d3.select(svgRef.current)
        .transition().duration(750)
        .call(zoomRef.current.transform, d3.zoomIdentity.translate(tx, ty).scale(scale))
    }, 600)
    return () => clearTimeout(wait)
  }, [focusNodeId])

  useEffect(() => {
    draw()
    return () => simulationRef.current?.stop()
  }, [draw])

  const info = hoveredNode ? getPersonInfo(hoveredNode.id) : null

  return (
    <div className="w-full h-full relative">
      <style>{`
        @keyframes focusPulse {
          0%, 100% { opacity: 0.7; r: calc(var(--r) + 12px); }
          50% { opacity: 0.2; r: calc(var(--r) + 20px); }
        }
        .focus-ring { animation: focusPulse 1.6s ease-in-out infinite; }
      `}</style>
      <svg ref={svgRef} className="w-full h-full" />
      {info && (
        <div
          className="fixed z-50 pointer-events-none rounded-xl border border-border bg-bg-card/95 backdrop-blur-sm shadow-xl p-3 text-xs space-y-1"
          style={{ left: tooltipPos.x + 14, top: tooltipPos.y - 14, minWidth: 180, maxWidth: 240 }}
        >
          <p className="font-semibold text-text-primary text-sm">{info.name}</p>
          <p className="text-text-secondary">🏛 {info.party}</p>
          <p className="text-text-secondary">📌 {info.position}</p>
        </div>
      )}
    </div>
  )
}
