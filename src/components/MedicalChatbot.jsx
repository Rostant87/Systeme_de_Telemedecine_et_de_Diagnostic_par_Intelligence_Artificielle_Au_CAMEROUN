import React, { useState, useRef } from 'react';
import { Send, MessageCircle, Loader, AlertCircle } from 'lucide-react';

const MedicalChatbot = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Bonjour! Je suis l\'assistant médical IA. Comment puis-je vous aider?', sender: 'bot', en: 'Hello! I\'m the medical AI assistant. How can I help?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = (userMessage) => {
    const lower = userMessage.toLowerCase();
    
    // Base de données de réponses médicales
    const responses = {
      'symptom|fever|fièvre': {
        fr: 'Vous avez de la fièvre? Cela peut indiquer plusieurs conditions: infection virale, paludisme, ou dengue. Mesurez votre température et consultez un professionnel si elle persiste plus de 48h.',
        en: 'Do you have a fever? This could indicate several conditions: viral infection, malaria, or dengue. Measure your temperature and consult a professional if it persists over 48 hours.'
      },
      'symptom|cough|toux': {
        fr: 'Toux détectée. Si elle persiste plus d\'une semaine, consultez. Tests TB recommandés si vous avez des facteurs de risque.',
        en: 'Cough detected. If it persists over a week, consult. TB tests recommended if you have risk factors.'
      },
      'malaria|palu': {
        fr: 'Paludisme: Symptômes incluent fièvre, frissons, maux de tête. Test rapide (TDR) recommandé. Traitement artemether disponible.',
        en: 'Malaria: Symptoms include fever, chills, headache. Rapid test (RDT) recommended. Artemether treatment available.'
      },
      'pregnancy|enceint': {
        fr: 'Suivi prénatal (CPN): 4 visites minimum recommandées. Mesure: poids, TA, albumine. Fer + acide folique essentiels.',
        en: 'Prenatal follow-up (ANC): Minimum 4 visits recommended. Measures: weight, BP, albumin. Iron + folic acid essential.'
      },
      'hiv|vih': {
        fr: 'Dépistage VIH disponible. Test gratuit et confidentiel. Traitement ARV efficace si positif.',
        en: 'HIV testing available. Free and confidential test. Effective ART treatment if positive.'
      },
      'nutrition|malnut': {
        fr: 'Malnutrition: Évaluation IMC, périmètre brachial. Régime riche en protéines et calories.',
        en: 'Malnutrition: BMI assessment, arm circumference. High protein and calorie diet.'
      },
      'diabete|diabetes': {
        fr: 'Diabète: Glycémie à jeun > 126 mg/dl diagnostic. Régime sans sucre, sport 30min/jour.',
        en: 'Diabetes: Fasting glucose > 126 mg/dl diagnostic. Sugar-free diet, 30min exercise daily.'
      },
      'default': {
        fr: 'Je suis un assistant médical IA. Posez des questions sur les symptômes, maladies courantes, suivi prénatal ou nutrition.',
        en: 'I\'m a medical AI assistant. Ask questions about symptoms, common diseases, prenatal follow-up or nutrition.'
      }
    };

    // Chercher une réponse correspondante
    for (const [keywords, response] of Object.entries(responses)) {
      if (keywords !== 'default') {
        const keywordList = keywords.split('|');
        if (keywordList.some(kw => lower.includes(kw))) {
          return response;
        }
      }
    }
    
    return responses.default;
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Ajouter le message utilisateur
    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: 'user'
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Simuler un délai de traitement
    setTimeout(() => {
      const response = generateResponse(input);
      const botMessage = {
        id: messages.length + 2,
        text: response.fr,
        sender: 'bot',
        en: response.en
      };
      setMessages(prev => [...prev, botMessage]);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <MessageCircle className="text-blue-600" />
          Assistant Médical IA | Medical AI Assistant
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {/* Chat Window */}
          <div className="md:col-span-2 flex flex-col border border-slate-200 rounded-lg bg-slate-50">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-96">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.sender === 'user' 
                      ? 'bg-blue-600 text-white rounded-br-none' 
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                  }`}>
                    <p className="text-sm">{msg.text}</p>
                    {msg.en && msg.sender === 'bot' && (
                      <p className="text-xs mt-1 opacity-75 italic">{msg.en}</p>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white text-slate-800 border border-slate-200 rounded-lg rounded-bl-none px-4 py-2">
                    <Loader className="animate-spin h-5 w-5 text-blue-600" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-slate-200 p-4 bg-white rounded-b-lg">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Décrivez vos symptômes... / Describe symptoms..."
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={loading || !input.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-400"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                <AlertCircle size={18} />
                Sujets disponibles
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Fièvre / Fever</li>
                <li>• Toux / Cough</li>
                <li>• Paludisme / Malaria</li>
                <li>• Grossesse / Pregnancy</li>
                <li>• VIH / HIV</li>
                <li>• Malnutrition</li>
                <li>• Diabète / Diabetes</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-bold text-green-900 mb-2">📱 Assistance 24/7</h3>
              <p className="text-sm text-green-800">
                Assistant IA entraîné sur les protocoles de santé au Cameroun. Réponses en français et anglais.
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-bold text-yellow-900 mb-2">⚠️ Important</h3>
              <p className="text-xs text-yellow-800">
                Cet assistant n'est qu'une aide. En cas d'urgence, consultez immédiatement un professionnel de santé.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalChatbot;