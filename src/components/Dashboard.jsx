import { Activity, Brain, Users, Network, MessageSquare } from 'lucide-react'

export default function Dashboard({ onTabChange }) {
  const features = [
    {
      icon: Brain,
      title: 'Diagnostic par IA',
      description: 'Analyse d\'images médicales avec l\'intelligence artificielle',
      tab: 'diagnostic',
      color: 'bg-blue-500'
    },
    {
      icon: Users,
      title: 'DME - Dossier Médical Électronique',
      description: 'Gestion des patients et historique médical',
      tab: 'dme',
      color: 'bg-green-500'
    },
    {
      icon: MessageSquare,
      title: 'Assistant Médical',
      description: 'Chatbot bilingue pour questions médicales',
      tab: 'chatbot',
      color: 'bg-purple-500'
    },
    {
      icon: Network,
      title: 'Réseau Mesh P2P',
      description: 'Simulation de synchronisation décentralisée',
      tab: 'network',
      color: 'bg-orange-500'
    }
  ]

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Bienvenue</h2>
        <p className="text-gray-600 text-lg">
          Plateforme de télémédecine et diagnostic par intelligence artificielle pour les zones rurales du Cameroun.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <div
              key={index}
              onClick={() => onTabChange(feature.tab)}
              className="bg-white rounded-lg shadow hover:shadow-xl transition-shadow cursor-pointer overflow-hidden"
            >
              <div className={`${feature.color} h-20 flex items-center justify-center`}>
                <Icon size={40} className="text-white" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                  Accéder →
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded">
        <h3 className="text-lg font-bold text-blue-900 mb-2">À propos</h3>
        <p className="text-blue-800">
          Cette plateforme utilise des modèles d'IA TensorFlow.js pour l'analyse d'images médicales,
          avec stockage local des données pour fonctionner hors ligne.
        </p>
      </div>
    </div>
  )
}
