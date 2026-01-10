import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Activity, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalConsultations: 1247,
    aiDiagnostics: 856,
    activeSyncNodes: 23,
    criticalCases: 12
  });

  const consultationsData = [
    { mois: 'Jan', consultations: 120, diagnosticsIA: 85 },
    { mois: 'Fév', consultations: 180, diagnosticsIA: 125 },
    { mois: 'Mar', consultations: 240, diagnosticsIA: 180 },
    { mois: 'Avr', consultations: 210, diagnosticsIA: 150 },
    { mois: 'Mai', consultations: 280, diagnosticsIA: 200 },
    { mois: 'Juin', consultations: 217, diagnosticsIA: 116 },
  ];

  const maladiesData = [
    { name: 'Paludisme', value: 340, color: '#ef4444' },
    { name: 'Diarrhée', value: 215, color: '#f59e0b' },
    { name: 'IRA', value: 180, color: '#3b82f6' },
    { name: 'Malnutrition', value: 95, color: '#8b5cf6' },
    { name: 'Autres', value: 26, color: '#10b981' },
  ];

  const performanceData = [
    { region: 'Nord', precision: 87, consultations: 320 },
    { region: 'Extrême-Nord', precision: 82, consultations: 280 },
    { region: 'Adamaoua', precision: 90, consultations: 250 },
    { region: 'Est', precision: 85, consultations: 210 },
    { region: 'Centre', precision: 92, consultations: 187 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Consultations</p>
              <p className="text-3xl font-bold mt-1">{stats.totalConsultations}</p>
              <p className="text-blue-200 text-xs mt-2">+15% ce mois</p>
            </div>
            <Users size={40} className="text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Diagnostics IA</p>
              <p className="text-3xl font-bold mt-1">{stats.aiDiagnostics}</p>
              <p className="text-green-200 text-xs mt-2">68.6% du total</p>
            </div>
            <Activity size={40} className="text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Nœuds Actifs P2P</p>
              <p className="text-3xl font-bold mt-1">{stats.activeSyncNodes}</p>
              <p className="text-purple-200 text-xs mt-2">Réseau stable</p>
            </div>
            <TrendingUp size={40} className="text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Cas Critiques</p>
              <p className="text-3xl font-bold mt-1">{stats.criticalCases}</p>
              <p className="text-red-200 text-xs mt-2">Nécessite suivi</p>
            </div>
            <AlertTriangle size={40} className="text-red-200" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Évolution des Consultations</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={consultationsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mois" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="consultations" stroke="#3b82f6" strokeWidth={2} name="Total" />
              <Line type="monotone" dataKey="diagnosticsIA" stroke="#10b981" strokeWidth={2} name="Avec IA" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Répartition des Maladies</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={maladiesData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {maladiesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Performance par Région</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="region" />
            <YAxis yAxisId="left" orientation="left" stroke="#8b5cf6" />
            <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="precision" fill="#8b5cf6" name="Précision IA (%)" />
            <Bar yAxisId="right" dataKey="consultations" fill="#3b82f6" name="Consultations" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-500 rounded-lg p-6">
        <h4 className="font-bold text-slate-800 mb-2">📊 Impact du Projet ASR (Projection 3 ans)</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">-20%</p>
            <p className="text-sm text-slate-600">DALY zones pilotes</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">-30%</p>
            <p className="text-sm text-slate-600">Évacuations sanitaires</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">800</p>
            <p className="text-sm text-slate-600">ASR formés</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-amber-600">500K</p>
            <p className="text-sm text-slate-600">DME créés</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;