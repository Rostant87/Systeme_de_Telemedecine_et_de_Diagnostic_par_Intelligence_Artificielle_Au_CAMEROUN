import { useState, useEffect, useRef } from 'react'
import { Send, AlertCircle } from 'lucide-react'

export default function MedicalChatbot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Bonjour 👋 Je suis votre assistant médical bilingue. Comment puis-je vous aider?',
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputText, setInputText] = useState('')
  const messagesEndRef = useRef(null)

  const medicalTopics = {
    'fievre': {
      keywords: ['fièvre', 'chaud', 'temperature', 'fever', 'hot'],
      response: {
        fr: 'La fièvre est une élévation de la température corporelle au-dessus de 37°C. Elle peut indiquer une infection. Hydratez-vous bien et consultez un médecin si elle persiste plus de 3 jours.',
        en: 'Fever is a body temperature elevation above 37°C. It may indicate an infection. Stay hydrated and consult a doctor if it persists for more than 3 days.'
      }
    },
    'toux': {
      keywords: ['toux', 'cough', 'tousse', 'toussez'],
      response: {
        fr: 'Une toux peut être sèche ou grasse. Elle peut être causée par un virus ou une bactérie. Consultez un médecin si elle dure plus d\'une semaine.',
        en: 'A cough can be dry or wet. It may be caused by a virus or bacteria. Consult a doctor if it lasts more than a week.'
      }
    },
    'paludisme': {
      keywords: ['paludisme', 'malaria', 'palu'],
      response: {
        fr: 'Le paludisme est transmis par les moustiques. Symptoms: fièvre, frissons, maux de tête. Faites un test RDT dès que possible. Utilisez des moustiquaires imprégnées.',
        en: 'Malaria is transmitted by mosquitoes. Symptoms: fever, chills, headache. Take an RDT test as soon as possible. Use insecticide-treated bed nets.'
      }
    },
    'grossesse': {
      keywords: ['grossesse', 'enceinte', 'pregnancy', 'pregnant', 'prenatal'],
      response: {
        fr: 'Pendant la grossesse: prenez l\'acide folique, des vitamines prénatales, et consultez régulièrement. Évitez l\'alcool et le tabac.',
        en: 'During pregnancy: take folic acid, prenatal vitamins, and have regular check-ups. Avoid alcohol and tobacco.'
      }
    },
    'vih': {
      keywords: ['vih', 'sida', 'hiv', 'aids'],
      response: {
        fr: 'Le VIH est diagnostiqué par test sanguin. Un traitement ARV permet une vie normale. Faites un test régulièrement et utilisez des préservatifs.',
        en: 'HIV is diagnosed by blood test. ARV treatment allows normal life. Get tested regularly and use condoms.'
      }
    },
    'nutrition': {
      keywords: ['nutrition', 'manger', 'nourriture', 'eat', 'food', 'diet'],
      response: {
        fr: 'Une bonne nutrition inclut: fruits, légumes, protéines, grains entiers. Buvez 2L d\'eau par jour. Évitez les aliments trop sucrés.',
        en: 'Good nutrition includes: fruits, vegetables, proteins, whole grains. Drink 2L of water per day. Avoid sugary foods.'
      }
    },
    'diabete': {
      keywords: ['diabète', 'diabetes', 'sucre', 'glucose'],
      response: {
        fr: 'Le diabète: contrôlez votre glycémie, prenez vos médicaments, faites de l\'exercice, mangez sainement. Consultez régulièrement votre médecin.',
        en: 'Diabetes: control your blood sugar, take your medication, exercise, eat healthy. Consult your doctor regularly.'
      }
    }
  }

  const generateResponse = (userText) => {
    const lowerText = userText.toLowerCase()
    
    for (const [topic, data] of Object.entries(medicalTopics)) {
      if (data.keywords.some(keyword => lowerText.includes(keyword))) {
        return data.response
      }
    }

    return {
      fr: 'Je n\'ai pas bien compris votre question. Parlez-moi de fièvre, toux, paludisme, grossesse, VIH, nutrition ou diabète.',
      en: 'I didn\'t understand well. Tell me about fever, cough, malaria, pregnancy, HIV, nutrition or diabetes.'
    }
  }

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!inputText.trim()) return

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages([...messages, userMessage])
    setInputText('')

    // Generate bot response
    setTimeout(() => {
      const response = generateResponse(inputText)
      const botMessage = {
        id: messages.length + 2,
        text: `🇫🇷 ${response.fr}\n\n🇬🇧 ${response.en}`,
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
    }, 500)
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="max-w-3xl mx-auto h-[70vh] flex flex-col">
      <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col h-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">💬 Assistant Médical</h2>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4 rounded flex items-start gap-2">
          <AlertCircle size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">
            <strong>Disclaimer:</strong> Cet assistant n'est pas un substitut à un médecin. Consultez toujours un professionnel de santé pour un diagnostic.
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 bg-gray-50 rounded p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-gray-300 text-gray-800 rounded-bl-none'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.sender === 'user' ? 'text-blue-100' : 'text-gray-600'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Tapez votre question..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  )
}
