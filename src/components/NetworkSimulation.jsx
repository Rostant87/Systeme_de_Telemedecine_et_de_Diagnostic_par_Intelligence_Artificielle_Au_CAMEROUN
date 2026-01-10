import { useState, useEffect } from 'react'

export default function NetworkSimulation() {
  const [nodes, setNodes] = useState([])
  const [stats, setStats] = useState({ connections: 0, syncRate: 0 })
  const canvasRef = null

  useEffect(() => {
    // Initialize nodes
    const initialNodes = [
      { id: 1, type: 'mobile', x: 100, y: 100, vx: 2, vy: 1.5 },
      { id: 2, type: 'mobile', x: 300, y: 150, vx: -1.5, vy: 2 },
      { id: 3, type: 'clinic', x: 500, y: 200, vx: 1, vy: -1 },
      { id: 4, type: 'mobile', x: 400, y: 400, vx: -1, vy: 1.5 },
      { id: 5, type: 'clinic', x: 200, y: 350, vx: 1.5, vy: -2 },
      { id: 6, type: 'gateway', x: 600, y: 300, vx: 0, vy: 0 }
    ]
    setNodes(initialNodes)

    // Simulation loop
    const interval = setInterval(() => {
      setNodes(prevNodes => {
        const updated = prevNodes.map(node => {
          let newX = node.x + node.vx
          let newY = node.y + node.vy
          let vx = node.vx
          let vy = node.vy

          if (newX < 50 || newX > 750) vx *= -1
          if (newY < 50 || newY > 450) vy *= -1

          newX = Math.max(50, Math.min(750, newX))
          newY = Math.max(50, Math.min(450, newY))

          return { ...node, x: newX, y: newY, vx, vy }
        })

        // Calculate connections
        let connections = 0
        for (let i = 0; i < updated.length; i++) {
          for (let j = i + 1; j < updated.length; j++) {
            const dx = updated[i].x - updated[j].x
            const dy = updated[i].y - updated[j].y
            const distance = Math.sqrt(dx * dx + dy * dy)
            if (distance < 200) connections++
          }
        }

        setStats({
          connections,
          syncRate: Math.round((connections / 15) * 100)
        })

        return updated
      })
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🌐 Réseau Mesh P2P</h2>

        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 mb-6 border border-purple-200">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-sm text-gray-600 mb-1">Connexions actives</p>
              <p className="text-3xl font-bold text-purple-600">{stats.connections}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Taux de synchronisation</p>
              <p className="text-3xl font-bold text-blue-600">{stats.syncRate}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Nœuds actifs</p>
              <p className="text-3xl font-bold text-green-600">{nodes.length}</p>
            </div>
          </div>
        </div>

        {/* Simple visualization without canvas */}
        <div className="bg-gray-900 rounded-lg p-4 mb-6 relative" style={{ height: '500px' }}>
          <svg width="100%" height="100%" viewBox="0 0 800 500" className="absolute inset-0">
            <defs>
              <linearGradient id="gridGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#1e3a8a', stopOpacity: 0.3 }} />
                <stop offset="100%" style={{ stopColor: '#7c3aed', stopOpacity: 0.3 }} />
              </linearGradient>
            </defs>

            {/* Grid background */}
            <rect width="800" height="500" fill="url(#gridGradient)" />

            {/* Draw connections */}
            {nodes.map((node1, i) =>
              nodes.map((node2, j) => {
                if (i >= j) return null
                const dx = node1.x - node2.x
                const dy = node1.y - node2.y
                const distance = Math.sqrt(dx * dx + dy * dy)
                if (distance < 200) {
                  return (
                    <line
                      key={`${i}-${j}`}
                      x1={node1.x}
                      y1={node1.y}
                      x2={node2.x}
                      y2={node2.y}
                      stroke="#4f46e5"
                      strokeWidth="1"
                      opacity="0.6"
                    />
                  )
                }
                return null
              })
            )}

            {/* Draw nodes */}
            {nodes.map((node) => {
              let color = '#3b82f6'
              let label = `A${node.id}`
              if (node.type === 'clinic') {
                color = '#10b981'
                label = `C${node.id}`
              } else if (node.type === 'gateway') {
                color = '#f59e0b'
                label = 'GW'
              }

              return (
                <g key={node.id}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="15"
                    fill={color}
                    opacity="0.8"
                  />
                  <text
                    x={node.x}
                    y={node.y}
                    textAnchor="middle"
                    dy="0.3em"
                    fill="white"
                    fontSize="12"
                    fontWeight="bold"
                  >
                    {label}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span className="text-sm text-gray-700">Appareil mobile</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span className="text-sm text-gray-700">Clinique</span>
          </div>
          <div className="flex items-center gap-2 p-3 bg-amber-50 rounded">
            <div className="w-4 h-4 rounded-full bg-amber-500"></div>
            <span className="text-sm text-gray-700">Passerelle</span>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
          <p className="text-sm text-blue-800">
            <strong>Simulation P2P:</strong> Cette simulation montre comment les appareils se synchronisent
            en réseau décentralisé. Les lignes bleues représentent les connexions actives entre les nœuds.
          </p>
        </div>
      </div>
    </div>
  )
}
