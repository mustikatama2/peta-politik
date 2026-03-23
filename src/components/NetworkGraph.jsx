import { useEffect, useRef, useCallback, useState, useMemo } from 'react'
import * as d3 from 'd3'
import { PARTY_MAP } from '../data/parties'
import { CONNECTIONS } from '../data/connections'
import { PERSONS } from '../data/persons'
import { scoreOnePerson } from '../lib/scoring'

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
  koalisi:           '#3B82F6',
  keluarga:          '#EC4899',
  bisnis:            '#F59E0B',
  konflik:           '#EF4444',
  rival:             '#DC2626',
  'mentor-murid':    '#8B5CF6',
  kolega:            '#64748B',
  rekan:             '#6B7280',
  'mantan-koalisi':  '#D97706',
  'atasan-bawahan':  '#14B8A6',
  ideologi:          '#10B981',
  oposisi:           '#F43F5E',
}

// Mini-map dimensions
const MM_W = 160
const MM_H = 110

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
  focusPerson,
  showClusters,
}) {
  const svgRef        = useRef(null)
  const simulationRef = useRef(null)
  const zoomRef       = useRef(null)
  const minimapRef    = useRef(null)
  const mmStateRef    = useRef(null) // { scale, offX, offY, minX, minY, w, h }
  const [hoveredNode, setHoveredNode] = useState(null)
  const [tooltipPos, setTooltipPos]   = useState({ x: 0, y: 0 })

  const handleZoomIn = useCallback(() => {
    if (!svgRef.current || !zoomRef.current) return
    d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy, 1.35)
  }, [])

  const handleZoomOut = useCallback(() => {
    if (!svgRef.current || !zoomRef.current) return
    d3.select(svgRef.current).transition().duration(300).call(zoomRef.current.scaleBy, 0.75)
  }, [])

  // ── Pre-compute influence scores for all persons ──────────────────────────
  const scoreMap = useMemo(() => {
    const map = {}
    ;(nodes || []).forEach(n => {
      try {
        const result = scoreOnePerson(n, CONNECTIONS)
        map[n.id] = result.total
      } catch {
        map[n.id] = 0
      }
    })
    return map
  }, [nodes])

  // ── Score → radius (4–20 px) ─────────────────────────────────────────────
  const scoreToRadius = useCallback((nodeId) => {
    const score = scoreMap[nodeId] || 0
    return 4 + (score / 100) * 16  // score 0→4px, score 100→20px
  }, [scoreMap])

  // ── Mini-map draw function (stored in ref so it can be called from tick) ─
  const drawMinimap = useCallback((filteredNodes2, filteredEdges2, width, height) => {
    const canvas = minimapRef.current
    if (!canvas || !filteredNodes2?.length) return

    const xs = filteredNodes2.map(n => n.x).filter(Number.isFinite)
    const ys = filteredNodes2.map(n => n.y).filter(Number.isFinite)
    if (!xs.length) return

    const minX = Math.min(...xs), maxX = Math.max(...xs)
    const minY = Math.min(...ys), maxY = Math.max(...ys)
    const rangeX = maxX - minX || 1
    const rangeY = maxY - minY || 1

    const scaleX = (MM_W * 0.88) / rangeX
    const scaleY = (MM_H * 0.88) / rangeY
    const scale  = Math.min(scaleX, scaleY)

    const offX = (MM_W - rangeX * scale) / 2 - minX * scale
    const offY = (MM_H - rangeY * scale) / 2 - minY * scale

    // Store for click-to-navigate
    mmStateRef.current = { scale, offX, offY, width, height }

    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, MM_W, MM_H)
    ctx.fillStyle = 'rgba(15, 20, 30, 0.96)'
    ctx.fillRect(0, 0, MM_W, MM_H)

    // Thin border
    ctx.strokeStyle = 'rgba(100,100,100,0.5)'
    ctx.lineWidth = 0.5
    ctx.strokeRect(0, 0, MM_W, MM_H)

    // Edges
    filteredEdges2.forEach(e => {
      const src = e.source, tgt = e.target
      if (!src || !tgt || !Number.isFinite(src.x)) return
      ctx.beginPath()
      ctx.moveTo(src.x * scale + offX, src.y * scale + offY)
      ctx.lineTo(tgt.x * scale + offX, tgt.y * scale + offY)
      ctx.strokeStyle = 'rgba(100,100,100,0.25)'
      ctx.lineWidth = 0.4
      ctx.stroke()
    })

    // Nodes
    filteredNodes2.forEach(n => {
      if (!Number.isFinite(n.x)) return
      const x = n.x * scale + offX
      const y = n.y * scale + offY
      const r = Math.max(1, (scoreToRadius(n.id) / 20) * 3.5)
      const party = n.party_id ? PARTY_MAP[n.party_id] : null
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fillStyle = party?.color || '#374151'
      ctx.fill()
    })

    // Viewport rectangle
    if (svgRef.current && zoomRef.current) {
      try {
        const t = d3.zoomTransform(svgRef.current)
        const vx0 = (-t.x / t.k) * scale + offX
        const vy0 = (-t.y / t.k) * scale + offY
        const vw  = (width  / t.k) * scale
        const vh  = (height / t.k) * scale
        ctx.strokeStyle = 'rgba(239,68,68,0.9)'
        ctx.lineWidth = 1.5
        ctx.strokeRect(vx0, vy0, vw, vh)
      } catch (_) { /* ignore */ }
    }
  }, [scoreToRadius])

  const draw = useCallback(() => {
    const highlightSet = highlightIds ? new Set(highlightIds) : null
    if (!svgRef.current || !nodes?.length) return

    const container = svgRef.current.parentElement
    const width  = container.clientWidth  || 800
    const height = container.clientHeight || 600

    d3.select(svgRef.current).selectAll('*').remove()

    // --- Filter edges ---
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

    // --- Nodes with no visible connections → dim ---
    const dimmedIds = new Set()
    if (visibleTypes?.length) {
      nodes.forEach(n => {
        const hasConn = filteredEdges2.some(e => e.from === n.id || e.to === n.id)
        if (!hasConn) dimmedIds.add(n.id)
      })
    }

    // --- Focus person: compute 1-hop neighbourhood ---
    let focusNeighbourhood = null
    if (focusPerson) {
      focusNeighbourhood = new Set([focusPerson])
      filteredEdges2.forEach(e => {
        if (e.from === focusPerson) focusNeighbourhood.add(e.to)
        if (e.to   === focusPerson) focusNeighbourhood.add(e.from)
      })
    }

    // --- Score-based radius (4–20 px) ---
    const radius = d => {
      const r = scoreToRadius(d.id)
      return d.id === centerNodeId ? r + 4 : r
    }

    // --- SVG setup ---
    const svg = d3.select(svgRef.current)
      .attr('width',  width)
      .attr('height', height)

    const g = svg.append('g')

    // ── Hull layers ──
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
      .scaleExtent([0.15, 4])
      .on('zoom', event => {
        g.attr('transform', event.transform)
        // Refresh minimap viewport rect on zoom/pan
        drawMinimap(filteredNodes, d3Edges, width, height)
      })
    svg.call(zoom)
    zoomRef.current = zoom

    // --- Defs: glow + arrows ---
    const defs = svg.append('defs')

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

    // --- D3 edges: must have source/target (not from/to) for forceLink ---
    const d3Edges = filteredEdges2.map(e => ({ ...e, source: e.from, target: e.to }))

    // --- Simulation ---
    simulationRef.current = d3.forceSimulation(filteredNodes)
      .force('link', d3.forceLink(d3Edges).id(d => d.id).distance(d => 100 / (d.strength || 5) * 60))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide(d => radius(d) + 10))

    // --- Links ---
    const link = g.append('g').selectAll('line')
      .data(d3Edges)
      .join('line')
      .attr('stroke', d => {
        if (highlightSet) {
          // Path edges: thick red; others: dimmed
          const onPath = highlightSet.has(d.source?.id || d.from) && highlightSet.has(d.target?.id || d.to)
          if (onPath) return '#EF4444'
        }
        return LINK_COLORS[d.type] || '#6B7280'
      })
      .attr('stroke-opacity', d => {
        if (highlightSet) {
          const onPath = highlightSet.has(d.source?.id || d.from) && highlightSet.has(d.target?.id || d.to)
          return onPath ? 1 : 0.12
        }
        if (focusNeighbourhood) {
          const srcId = d.source?.id || d.from
          const tgtId = d.target?.id || d.to
          const inFocus = focusNeighbourhood.has(srcId) && focusNeighbourhood.has(tgtId)
          return inFocus ? 0.85 : 0.05
        }
        return 0.65
      })
      .attr('stroke-width', d => {
        if (highlightSet) {
          const onPath = highlightSet.has(d.source?.id || d.from) && highlightSet.has(d.target?.id || d.to)
          return onPath ? 4 : Math.sqrt(d.strength || 3) * 0.5
        }
        return Math.sqrt(d.strength || 3) * 0.8
      })
      .attr('marker-end', d => `url(#arrow-${d.type})`)

    // --- Link labels (only when few nodes) ---
    const linkLabel = g.append('g').selectAll('text')
      .data(d3Edges)
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
      .attr('opacity', d => {
        if (highlightSet && !highlightSet.has(d.id)) return 0.15
        if (focusNeighbourhood && !focusNeighbourhood.has(d.id)) return 0.07
        if (dimmedIds.has(d.id)) return 0.2
        return 1
      })
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
        // Show label on hover for low-influence nodes
        if ((scoreMap[d.id] || 0) <= 70) {
          d3.select(event.currentTarget).select('.node-label').attr('opacity', 1)
        }
      })
      .on('mousemove', event => setTooltipPos({ x: event.pageX, y: event.pageY }))
      .on('mouseout', (event, d) => {
        setHoveredNode(null)
        // Hide label again for low-influence nodes
        if ((scoreMap[d.id] || 0) <= 70) {
          d3.select(event.currentTarget).select('.node-label').attr('opacity', 0)
        }
      })

    // Gold glow ring for path nodes
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
      .attr('r', d => radius(d))
      .attr('fill', d => {
        const party = d.party_id ? PARTY_MAP[d.party_id] : null
        return party?.color || '#374151'
      })
      .attr('stroke', d => {
        if (d.id === focusNodeId)    return '#60A5FA'
        if (highlightSet?.has(d.id)) return '#F0C200'
        if (d.id === centerNodeId)   return '#F59E0B'
        return '#1F2937'
      })
      .attr('stroke-width', d => {
        if (d.id === focusNodeId)    return 3
        if (highlightSet?.has(d.id)) return 3
        if (d.id === centerNodeId)   return 3
        return 1.5
      })
      .attr('fill-opacity', 0.9)

    // Node labels — always visible for high influence (score > 70), hover-only for others
    node.append('text')
      .attr('class', 'node-label')
      .attr('dy', d => radius(d) + 14)
      .attr('text-anchor', 'middle')
      .attr('fill', '#F9FAFB')
      .attr('font-size', 10)
      .attr('font-weight', '500')
      .attr('opacity', d => (scoreMap[d.id] || 0) > 70 ? 1 : 0)
      .text(d => {
        const parts = d.name?.split(' ') || ['?']
        return parts.length > 2 ? parts.slice(0, 2).join(' ') : d.name
      })
      .style('pointer-events', 'none')
      .style('text-shadow', '1px 1px 2px rgba(0,0,0,0.8)')

    // --- Tick ---
    let tickCount = 0
    simulationRef.current.on('tick', () => {
      // Hull updates
      if (showClusters) {
        Object.entries(CLUSTERS).forEach(([key]) => {
          const clusterNodes = filteredNodes.filter(n => getNodeCluster(n) === key)
          if (clusterNodes.length < 2) {
            hullLayer.select(`.hull-${key}`).attr('d', '')
            hullLabelLayer.select(`.hull-label-${key}`).attr('x', -9999).attr('y', -9999)
            return
          }
          const pts = clusterNodes.map(n => [n.x, n.y])
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
        .attr('x1', d => d.source.x).attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x).attr('y2', d => d.target.y)

      linkLabel
        .attr('x', d => (d.source.x + d.target.x) / 2)
        .attr('y', d => (d.source.y + d.target.y) / 2)

      node.attr('transform', d => `translate(${d.x},${d.y})`)

      // Update minimap every 5 ticks to avoid thrashing
      tickCount++
      if (tickCount % 5 === 0) {
        drawMinimap(filteredNodes, d3Edges, width, height)
      }
    })

    // Final minimap draw when simulation ends
    simulationRef.current.on('end', () => {
      drawMinimap(filteredNodes, d3Edges, width, height)
    })

    // Store refs for minimap click handler
    minimapRef.current._filteredNodes  = filteredNodes
    minimapRef.current._filteredEdges2 = d3Edges
    minimapRef.current._width          = width
    minimapRef.current._height         = height
  }, [nodes, edges, onNodeClick, filterType, filterParty, centerNodeId, highlightIds, visibleTypes, focusNodeId, focusPerson, showClusters, scoreToRadius, drawMinimap])

  // Focus zoom effect
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

  // Mini-map click → navigate viewport
  const handleMinimapClick = useCallback((e) => {
    const canvas = minimapRef.current
    const state  = mmStateRef.current
    if (!canvas || !state || !svgRef.current || !zoomRef.current) return

    const rect = canvas.getBoundingClientRect()
    const mx = e.clientX - rect.left
    const my = e.clientY - rect.top

    // Minimap px → graph coords
    const gx = (mx - state.offX) / state.scale
    const gy = (my - state.offY) / state.scale

    const currentT = d3.zoomTransform(svgRef.current)
    const k = currentT.k
    const tx = state.width  / 2 - gx * k
    const ty = state.height / 2 - gy * k

    d3.select(svgRef.current)
      .transition().duration(300)
      .call(zoomRef.current.transform, d3.zoomIdentity.translate(tx, ty).scale(k))
  }, [])

  const info = hoveredNode ? getPersonInfo(hoveredNode.id) : null
  const hoveredScore = hoveredNode ? (scoreMap[hoveredNode.id] ?? null) : null

  return (
    <div className="w-full h-full relative">
      <style>{`
        @keyframes focusPulse {
          0%, 100% { opacity: 0.7; }
          50%       { opacity: 0.2; }
        }
        .focus-ring { animation: focusPulse 1.6s ease-in-out infinite; }
      `}</style>

      <svg ref={svgRef} className="w-full h-full" />

      {/* Tooltip */}
      {info && (
        <div
          className="fixed z-50 pointer-events-none rounded-xl border border-border bg-bg-card/95 backdrop-blur-sm shadow-xl p-3 text-xs space-y-1"
          style={{ left: tooltipPos.x + 14, top: tooltipPos.y - 14, minWidth: 180, maxWidth: 240 }}
        >
          <p className="font-semibold text-text-primary text-sm">{info.name}</p>
          <p className="text-text-secondary">🏛 {info.party}</p>
          <p className="text-text-secondary">📌 {info.position}</p>
          {hoveredScore !== null && (
            <div className="flex items-center gap-2 pt-1 border-t border-border">
              <span className="text-text-secondary">⚡ Skor Pengaruh:</span>
              <span className="font-bold text-yellow-400">{hoveredScore.toFixed(1)}</span>
            </div>
          )}
        </div>
      )}

      {/* Zoom Controls */}
      <div className="absolute flex flex-col gap-1 z-10" style={{ bottom: MM_H + 20, right: 12 }}>
        <button
          onClick={handleZoomIn}
          title="Zoom In"
          className="w-8 h-8 bg-bg-card/90 border border-border rounded text-text-primary hover:bg-bg-elevated hover:border-accent/50 flex items-center justify-center font-bold text-base transition-colors shadow"
        >+</button>
        <button
          onClick={handleZoomOut}
          title="Zoom Out"
          className="w-8 h-8 bg-bg-card/90 border border-border rounded text-text-primary hover:bg-bg-elevated hover:border-accent/50 flex items-center justify-center font-bold text-base transition-colors shadow"
        >−</button>
      </div>

      {/* Mini-map */}
      <div
        className="absolute bottom-3 right-3 rounded-lg overflow-hidden border border-border/60 shadow-lg"
        style={{ width: MM_W, height: MM_H }}
        title="Klik untuk navigasi"
      >
        <canvas
          ref={minimapRef}
          width={MM_W}
          height={MM_H}
          onClick={handleMinimapClick}
          style={{ cursor: 'crosshair', display: 'block' }}
        />
        <div className="absolute top-1 left-1.5 text-[9px] text-gray-500 pointer-events-none select-none font-medium tracking-wide">
          MINI-MAP
        </div>
      </div>
    </div>
  )
}
