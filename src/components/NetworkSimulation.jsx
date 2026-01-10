import React, { useState, useEffect, useRef } from 'react';
import { Wifi, WifiOff, Smartphone, Building2, Satellite, Play, Pause, RotateCcw } from 'lucide-react';

const NetworkSimulation = () => {
  const canvasRef = useRef(null);
  const [isRunning, setIsRunning] = useState(true);
  const [gatewayDown, setGatewayDown] = useState(false);
  const [stats, setStats] = useState({
    activeConnections: 0,
    syncRate: 0,
    onlineNodes: 0,
    totalNodes: 0
  });
  
  const WIFI_RANGE = 120;
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;
  const DATA_PACKET_SPEED = 2;

  const nodesRef = useRef([]);
  const dataPacketsRef = useRef([]);
  const draggedNodeRef = useRef(null);

  useEffect(() => {
    const initialNodes = [
      { id: 1, type: 'mobile', x: 100, y: 100, vx: 1, vy: 0.5, data: true, synced: false, color: '#3b82f6' },
      { id: 2, type: 'mobile', x: 200, y: 300, vx: -0.5, vy: 1, data: true, synced: false, color: '#3b82f6' },
      { id: 3, type: 'mobile', x: 400, y: 150, vx: 0.8, vy: -0.6, data: false, synced: true, color: '#10b981' },
      { id: 4, type: 'mobile', x: 600, y: 400, vx: -1, vy: -0.5, data: true, synced: false, color: '#3b82f6' },
      { id: 5, type: 'mobile', x: 300, y: 500, vx: 0.6, vy: -0.8, data: false, synced: true, color: '#10b981' },
      { id: 6, type: 'clinic', x: 150, y: 450, vx: 0, vy: 0, data: false, synced: true, color: '#8b5cf6' },
      { id: 7, type: 'clinic', x: 650, y: 150, vx: 0, vy: 0, data: false, synced: true, color: '#8b5cf6' },
      { id: 8, type: 'gateway', x: 400, y: 300, vx: 0, vy: 0, data: false, synced: true, color: '#f59e0b' }
    ];
    
    nodesRef.current = initialNodes;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationFrame;

    const getDistance = (node1, node2) => {
      const dx = node1.x - node2.x;
      const dy = node1.y - node2.y;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const findConnections = () => {
      const connections = [];
      const nodes = nodesRef.current;
      
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dist = getDistance(nodes[i], nodes[j]);
          if (dist < WIFI_RANGE) {
            connections.push({ from: nodes[i], to: nodes[j], distance: dist });
          }
        }
      }
      return connections;
    };

    const syncData = (connections) => {
      connections.forEach(conn => {
        if (conn.from.data && !conn.to.data) {
          dataPacketsRef.current.push({
            from: { x: conn.from.x, y: conn.from.y },
            to: { x: conn.to.x, y: conn.to.y },
            progress: 0,
            fromNode: conn.from,
            toNode: conn.to
          });
        } else if (conn.to.data && !conn.from.data) {
          dataPacketsRef.current.push({
            from: { x: conn.to.x, y: conn.to.y },
            to: { x: conn.from.x, y: conn.from.y },
            progress: 0,
            fromNode: conn.to,
            toNode: conn.from
          });
        }
      });
    };

    const updateDataPackets = () => {
      dataPacketsRef.current = dataPacketsRef.current.filter(packet => {
        packet.progress += DATA_PACKET_SPEED;
        
        if (packet.progress >= 100) {
          packet.toNode.data = true;
          packet.fromNode.synced = true;
          packet.toNode.color = '#3b82f6';
          
          if (packet.toNode.type === 'gateway' || packet.toNode.type === 'clinic') {
            packet.fromNode.synced = true;
            packet.fromNode.color = '#10b981';
            packet.fromNode.data = false;
          }
          
          return false;
        }
        return true;
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      for (let i = 0; i < CANVAS_WIDTH; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, CANVAS_HEIGHT);
        ctx.stroke();
      }
      for (let i = 0; i < CANVAS_HEIGHT; i += 50) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(CANVAS_WIDTH, i);
        ctx.stroke();
      }

      const connections = findConnections();

      connections.forEach(conn => {
        ctx.beginPath();
        ctx.moveTo(conn.from.x, conn.from.y);
        ctx.lineTo(conn.to.x, conn.to.y);
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      dataPacketsRef.current.forEach(packet => {
        const x = packet.from.x + (packet.to.x - packet.from.x) * (packet.progress / 100);
        const y = packet.from.y + (packet.to.y - packet.from.y) * (packet.progress / 100);
        
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#ef4444';
        ctx.fill();
      });

      nodesRef.current.forEach(node => {
        ctx.beginPath();
        ctx.arc(node.x + 2, node.y + 2, node.type === 'mobile' ? 12 : 16, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fill();

        ctx.beginPath();
        if (node.type === 'gateway') {
          ctx.moveTo(node.x, node.y - 16);
          ctx.lineTo(node.x - 14, node.y + 12);
          ctx.lineTo(node.x + 14, node.y + 12);
          ctx.closePath();
        } else if (node.type === 'clinic') {
          ctx.rect(node.x - 14, node.y - 14, 28, 28);
        } else {
          ctx.arc(node.x, node.y, 12, 0, Math.PI * 2);
        }
        
        ctx.fillStyle = node.type === 'gateway' && gatewayDown ? '#ef4444' : node.color;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.stroke();

        if (node.data) {
          ctx.beginPath();
          ctx.arc(node.x + 8, node.y - 8, 5, 0, Math.PI * 2);
          ctx.fillStyle = '#ef4444';
          ctx.fill();
        }

        ctx.fillStyle = '#1f2937';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        const label = node.type === 'mobile' ? `A${node.id}` : 
                     node.type === 'clinic' ? `C${node.id}` : 'GW';
        ctx.fillText(label, node.x, node.y + 28);
      });

      let activeConn = connections.length;
      let syncedNodes = nodesRef.current.filter(n => n.synced).length;
      
      setStats({
        activeConnections: activeConn,
        syncRate: Math.round((syncedNodes / nodesRef.current.length) * 100),
        onlineNodes: gatewayDown ? 0 : 3,
        totalNodes: nodesRef.current.length
      });
    };

    const update = () => {
      if (!isRunning) return;

      nodesRef.current.forEach(node => {
        if (node.type === 'mobile' && !draggedNodeRef.current) {
          node.x += node.vx;
          node.y += node.vy;

          if (node.x < 20 || node.x > CANVAS_WIDTH - 20) node.vx *= -1;
          if (node.y < 20 || node.y > CANVAS_HEIGHT - 20) node.vy *= -1;
        }
      });

      const connections = findConnections();
      syncData(connections);
      updateDataPackets();

      if (Math.random() < 0.02) {
        const mobileNodes = nodesRef.current.filter(n => n.type === 'mobile');
        if (mobileNodes.length > 0) {
          const randomNode = mobileNodes[Math.floor(Math.random() * mobileNodes.length)];
          randomNode.data = true;
          randomNode.synced = false;
          randomNode.color = '#3b82f6';
        }
      }

      draw();
      animationFrame = requestAnimationFrame(update);
    };

    update();
    return () => cancelAnimationFrame(animationFrame);
  }, [isRunning, gatewayDown]);

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clickedNode = nodesRef.current.find(node => {
      const dx = node.x - x;
      const dy = node.y - y;
      return Math.sqrt(dx * dx + dy * dy) < 20;
    });

    if (clickedNode) draggedNodeRef.current = clickedNode;
  };

  const handleMouseMove = (e) => {
    if (!draggedNodeRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    draggedNodeRef.current.x = e.clientX - rect.left;
    draggedNodeRef.current.y = e.clientY - rect.top;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Réseau Maillé P2P</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            {isRunning ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button
            onClick={() => setGatewayDown(!gatewayDown)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              gatewayDown ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
            }`}
          >
            {gatewayDown ? <WifiOff size={18} /> : <Wifi size={18} />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-700">Connexions</p>
          <p className="text-2xl font-bold text-blue-600">{stats.activeConnections}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-green-700">Taux Sync</p>
          <p className="text-2xl font-bold text-green-600">{stats.syncRate}%</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <p className="text-sm text-purple-700">Statut</p>
          <p className="text-xl font-bold text-purple-600">
            {gatewayDown ? 'Offline' : 'Online'}
          </p>
        </div>
        <div className="bg-amber-50 p-4 rounded-lg">
          <p className="text-sm text-amber-700">Nœuds</p>
          <p className="text-2xl font-bold text-amber-600">
            {stats.onlineNodes}/{stats.totalNodes}
          </p>
        </div>
      </div>

      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border-2 border-slate-200 rounded-lg cursor-move bg-white w-full"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={() => draggedNodeRef.current = null}
        onMouseLeave={() => draggedNodeRef.current = null}
      />
    </div>
  );
};

export default NetworkSimulation;
