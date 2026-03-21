import { useEffect, useRef, useCallback } from 'react'
import * as d3 from 'd3'
import { PARTY_MAP } from '../data/parties'
import { CONNECTION_TYPES } from '../data/connections'

export default function NetworkGraph({ nodes, edges, onNodeClick, filterType, filterParty, centerNodeId, highlightIds }) {
  const svgRef = useRef(null)
  const simulationRef = useRef(null)

  const draw = useCallback(() => {
    const highlightSet = highlightIds ? new Set(highlightIds) : null
    if (!svgRef.current || !nodes?.length) return

    const container = svgRef.current.parentElement
    const width = container.clientWidth || 800
    const height = container.clientHeight || 600

    // Clear
    d3.select(svgRef.current).selectAll('*').remove()

    // Filter edges
    let filteredEdges = edges || []
    if (filterType) filteredEdges = filteredEdges.filter(e => e.type === filterType)
    if (filterParty) filteredEdges = filteredEdges.filter(e => {
      const fn = nodes.find(n => n.id === e.from)
      const tn = nodes.find(n => n.id === e.to)
      return fn?.party_id === filterParty || tn?.party_id === filterParty
    })

    // Get active node ids
    const activeIds = new Set()
    if (centerNodeId) {
      activeIds.add(centerNodeId)
      filteredEdges.forEach(e => {
        if (e.from === centerNodeId) activeIds.add(e.to)
        if (e.to === centerNodeId) activeIds.add(e.from)
      })
    } else {
      nodes.forEach(n => activeIds.add(n.id))
    }

    const filteredNodes = nodes.filter(n => activeIds.has(n.id))
    const filteredEdges2 = filteredEdges.filter(e => activeIds.has(e.from) && activeIds.has(e.to))

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)

    const g = svg.append('g')

    // Zoom
    const zoom = d3.zoom()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => g.attr('transform', event.transform))
    svg.call(zoom)

    // Arrow markers
    const defs = svg.append('defs')
    Object.entries(CONNECTION_TYPES).forEach(([type, cfg]) => {
      defs.append('marker')
        .attr('id', `arrow-${type}`)
        .attr('viewBox', '0 -4 8 8')
        .attr('refX', 18)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-4L8,0L0,4')
        .attr('fill', cfg.color)
        .attr('opacity', 0.8)
    })

    // Simulation
    simulationRef.current = d3.forceSimulation(filteredNodes)
      .force('link', d3.forceLink(filteredEdges2).id(d => d.id).distance(d => 100 / (d.strength || 5) * 60))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide(35))

    // Links
    const link = g.append('g').selectAll('line')
      .data(filteredEdges2)
      .join('line')
      .attr('stroke', d => CONNECTION_TYPES[d.type]?.color || '#6B7280')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', d => Math.sqrt(d.strength || 3) * 0.8)
      .attr('marker-end', d => `url(#arrow-${d.type})`)

    // Link labels
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

    // Nodes
    const node = g.append('g').selectAll('g')
      .data(filteredNodes)
      .join('g')
      .attr('cursor', 'pointer')
      .call(d3.drag()
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

    // Highlight glow ring
    node.filter(d => highlightSet?.has(d.id))
      .append('circle')
      .attr('r', d => d.id === centerNodeId ? 26 : 20)
      .attr('fill', 'none')
      .attr('stroke', '#FBBF24')
      .attr('stroke-width', 3)
      .attr('opacity', 0.8)

    node.append('circle')
      .attr('r', d => d.id === centerNodeId ? 20 : 14)
      .attr('fill', d => {
        const party = d.party_id ? PARTY_MAP[d.party_id] : null
        return party?.color || '#374151'
      })
      .attr('stroke', d => highlightSet?.has(d.id) ? '#FBBF24' : (d.id === centerNodeId ? '#F59E0B' : '#1F2937'))
      .attr('stroke-width', d => highlightSet?.has(d.id) ? 3 : (d.id === centerNodeId ? 3 : 1.5))
      .attr('fill-opacity', 0.9)

    node.append('text')
      .attr('dy', 28)
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

    // Simulation tick
    simulationRef.current.on('tick', () => {
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
  }, [nodes, edges, onNodeClick, filterType, filterParty, centerNodeId, highlightIds])

  useEffect(() => {
    draw()
    return () => simulationRef.current?.stop()
  }, [draw])

  return <svg ref={svgRef} className="w-full h-full" />
}
