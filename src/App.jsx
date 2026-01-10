import { useState } from 'react'
import Dashboard from './components/Dashboard'
import DiagnosticAI from './components/DiagnosticAI'
import DMESystem from './components/DMESystem'
import MedicalChatbot from './components/MedicalChatbot'
import NetworkSimulation from './components/NetworkSimulation'
import './App.css'

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const renderComponent = () => {
    switch (activeTab) {
      case 'diagnostic':
        return <DiagnosticAI />
      case 'dme':
        return <DMESystem />
      case 'chatbot':
        return <MedicalChatbot />
      case 'network':
        return <NetworkSimulation />
      default:
        return <Dashboard onTabChange={setActiveTab} />
    }
  }

  return (
    <div className="app-container">
      <div className="app-content">
        <nav className="app-nav">
          <h1>🏥 Système de Télémédecine et Diagnostic par IA</h1>
          {activeTab !== 'dashboard' && (
            <button
              onClick={() => setActiveTab('dashboard')}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              ← Retour au tableau de bord
            </button>
          )}
        </nav>
        <div className="component-container">
          {renderComponent()}
        </div>
      </div>
    </div>
  )
}
