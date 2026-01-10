import React, { useState } from 'react';
import { Activity, Brain, MessageSquare, BarChart3, FileText, Network } from 'lucide-react';
import NetworkSimulation from './components/NetworkSimulation';
import DiagnosticAI from './components/DiagnosticAI';
import MedicalChatbot from './components/MedicalChatbot';
import Dashboard from './components/Dashboard';
import DMESystem from './components/DMESystem';

const App = () => {
  const [activeTab, setActiveTab] = useState('network');

  const tabs = [
    { id: 'network', label: 'Réseau P2P', icon: Network },
    { id: 'diagnostic', label: 'Diagnostic IA', icon: Brain },
    { id: 'chatbot', label: 'Assistant', icon: MessageSquare },
    { id: 'dashboard', label: 'Analytics', icon: BarChart3 },
    { id: 'dme', label: 'DME', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="text-green-600" size={32} />
              <div>
                <h1 className="text-2xl font-bold text-slate-800">
                  Système de Télémédecine et Diagnostic IA
                </h1>
                <p className="text-sm text-slate-600">
                  Agent de Santé Rural - Cameroun
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-green-600 border-b-2 border-green-600'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-6">
        {activeTab === 'network' && <NetworkSimulation />}
        {activeTab === 'diagnostic' && <DiagnosticAI />}
        {activeTab === 'chatbot' && <MedicalChatbot />}
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'dme' && <DMESystem />}
      </main>
    </div>
  );
};

export default App;