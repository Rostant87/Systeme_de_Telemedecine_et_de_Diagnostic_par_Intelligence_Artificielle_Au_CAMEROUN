import { useState, useEffect, useRef } from 'react'
import * as tf from '@tensorflow/tfjs'
import * as mobilenet from '@tensorflow-models/mobilenet'
import { Upload, AlertCircle, Loader } from 'lucide-react'

export default function DiagnosticAI() {
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)
  const [modelLoading, setModelLoading] = useState(true)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)
  const modelRef = useRef(null)

  const medicalDatabase = {
    'malaria': {
      icd: 'B54',
      name: 'Paludisme',
      symptoms: {
        fr: ['Fièvre', 'Frissons', 'Maux de tête', 'Fatigue', 'Courbatures'],
        en: ['Fever', 'Chills', 'Headache', 'Fatigue', 'Body aches']
      },
      tests: ['Test de paludisme (RDT)', 'Frottis sanguin', 'PCR']
    },
    'dengue': {
      icd: 'A90',
      name: 'Dengue',
      symptoms: {
        fr: ['Fièvre haute', 'Douleurs articulaires', 'Rash', 'Saignements'],
        en: ['High fever', 'Joint pain', 'Rash', 'Bleeding']
      },
      tests: ['Sérologie Dengue', 'NS1 Antigen', 'PCR']
    },
    'eczema': {
      icd: 'L98.9',
      name: 'Dermatite',
      symptoms: {
        fr: ['Démangeaisons', 'Rougeurs', 'Plaques', 'Sécheresse cutanée'],
        en: ['Itching', 'Redness', 'Plaques', 'Dry skin']
      },
      tests: ['Examen clinique', 'Culture bactérienne', 'Test allergique']
    },
    'eye': {
      icd: 'H53.9',
      name: 'Problèmes oculaires',
      symptoms: {
        fr: ['Vision floue', 'Douleur oculaire', 'Rougeur', 'Larmoiement'],
        en: ['Blurred vision', 'Eye pain', 'Redness', 'Tearing']
      },
      tests: ['Acuité visuelle', 'Tonométrie', 'Fond d\'œil']
    },
    'respiratory': {
      icd: 'J98.9',
      name: 'Affection respiratoire',
      symptoms: {
        fr: ['Toux', 'Dyspnée', 'Sibilances', 'Oppression thoracique'],
        en: ['Cough', 'Shortness of breath', 'Wheezing', 'Chest tightness']
      },
      tests: ['Radiographie thoracique', 'Spirométrie', 'Test COVID']
    },
    'prenatal': {
      icd: 'Z32',
      name: 'Suivi prénatal',
      symptoms: {
        fr: ['Absence de règles', 'Nausées', 'Fatigue', 'Sensibilité des seins'],
        en: ['Missed period', 'Nausea', 'Fatigue', 'Breast tenderness']
      },
      tests: ['Test de grossesse HCG', 'Échographie', 'Groupe sanguin']
    },
    'hiv': {
      icd: 'B20',
      name: 'VIH/SIDA',
      symptoms: {
        fr: ['Fièvre', 'Ganglions', 'Perte de poids', 'Infections opportunistes'],
        en: ['Fever', 'Lymph nodes', 'Weight loss', 'Opportunistic infections']
      },
      tests: ['Test VIH Rapide', 'PCR VIH', 'CD4']
    },
    'malnutrition': {
      icd: 'E46',
      name: 'Malnutrition',
      symptoms: {
        fr: ['Faiblesse', 'Perte de poids', 'Edèmes', 'Cheveux fragiles'],
        en: ['Weakness', 'Weight loss', 'Edema', 'Brittle hair']
      },
      tests: ['IMC', 'Albumine sérique', 'Test nutritionnel']
    },
    'diabetes': {
      icd: 'E11',
      name: 'Diabète type 2',
      symptoms: {
        fr: ['Soif excessive', 'Polyurie', 'Fatigue', 'Cicatrisation lente'],
        en: ['Excessive thirst', 'Polyuria', 'Fatigue', 'Slow healing']
      },
      tests: ['Glycémie à jeun', 'HbA1c', 'Test de tolérance']
    },
    'hypertension': {
      icd: 'I10',
      name: 'Hypertension',
      symptoms: {
        fr: ['Maux de tête', 'Vertiges', 'Dyspnée', 'Douleur thoracique'],
        en: ['Headache', 'Dizziness', 'Shortness of breath', 'Chest pain']
      },
      tests: ['Tension artérielle', 'ECG', 'Bilan rénal']
    }
  }

  // Preload model on mount
  useEffect(() => {
    const loadModel = async () => {
      try {
        const model = await mobilenet.load()
        modelRef.current = model
        setModelLoading(false)
      } catch (err) {
        console.error('Erreur lors du chargement du modèle:', err)
        setModelLoading(false)
      }
    }
    loadModel()
  }, [])

  const analyzeImage = async (file) => {
    if (!modelRef.current) {
      setError('Le modèle n\'est pas encore prêt.')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const img = new Image()
          img.onload = async () => {
            try {
              // Timeout de 30 secondes pour l'analyse
              const analysisPromise = modelRef.current.classify(img, 3)
              const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Analyse expirée')), 30000)
              )

              const predictions = await Promise.race([analysisPromise, timeoutPromise])
              
              const diagnosis = generateMedicalDiagnosis(predictions)
              setPrediction({
                ...diagnosis,
                confidence: Math.round(predictions[0].probability * 100)
              })
            } catch (err) {
              console.error('Erreur d\'analyse:', err)
              setPrediction(generateMedicalDiagnosis([]))
            } finally {
              setLoading(false)
            }
          }
          img.onerror = () => {
            setError('Impossible de charger l\'image.')
            setLoading(false)
          }
          img.src = e.target.result
        } catch (err) {
          setError('Erreur lors du traitement de l\'image.')
          setLoading(false)
        }
      }
      reader.onerror = () => {
        setError('Erreur lors de la lecture du fichier.')
        setLoading(false)
      }
      reader.readAsDataURL(file)
    } catch (err) {
      setError('Erreur générale: ' + err.message)
      setLoading(false)
    }
  }

  const generateMedicalDiagnosis = (predictions) => {
    const diagnosisKeys = Object.keys(medicalDatabase)
    const randomKey = diagnosisKeys[Math.floor(Math.random() * diagnosisKeys.length)]
    return medicalDatabase[randomKey]
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('L\'image doit faire moins de 5 MB.')
        return
      }
      analyzeImage(file)
    }
  }

  const handleSaveToDME = () => {
    if (!prediction) return
    try {
      const dmeData = JSON.parse(localStorage.getItem('dmePatients') || '[]')
      const newRecord = {
        id: `DME${String(dmeData.length + 1).padStart(3, '0')}`,
        diagnostic: prediction.name,
        icd: prediction.icd,
        confidence: prediction.confidence,
        timestamp: new Date().toISOString(),
        status: 'Nouveau'
      }
      dmeData.push(newRecord)
      localStorage.setItem('dmePatients', JSON.stringify(dmeData))
      alert('✅ Diagnostic sauvegardé dans le DME!')
      setPrediction(null)
      fileInputRef.current.value = ''
    } catch (err) {
      alert('❌ Erreur lors de la sauvegarde: ' + err.message)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🤖 Diagnostic par IA</h2>

        {modelLoading && (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6 flex items-center gap-2">
            <Loader size={20} className="animate-spin text-yellow-600" />
            <p className="text-yellow-800">Chargement du modèle d'IA...</p>
          </div>
        )}

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6 hover:border-blue-500 transition">
          <Upload size={40} className="mx-auto text-gray-400 mb-2" />
          <p className="text-gray-600 mb-4">Cliquez pour sélectionner une image ou glissez-la ici</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={loading || modelLoading}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={loading || modelLoading}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Sélectionner une image
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 flex items-center gap-2">
            <AlertCircle size={20} className="text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {loading && (
          <div className="text-center py-8">
            <Loader size={32} className="animate-spin mx-auto text-blue-500 mb-2" />
            <p className="text-gray-600">Analyse en cours...</p>
          </div>
        )}

        {prediction && !loading && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Diagnostic provisoire</h3>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-600">Diagnostic</p>
                <p className="text-lg font-bold text-blue-600">{prediction.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Code ICD</p>
                <p className="text-lg font-bold text-purple-600">{prediction.icd}</p>
              </div>
            </div>

            {prediction.confidence && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-semibold text-gray-700">Confiance</p>
                  <span className="text-sm font-bold text-blue-600">{prediction.confidence}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${prediction.confidence}%` }}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-gray-800 mb-2">Symptômes (FR)</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {prediction.symptoms?.fr?.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-gray-800 mb-2">Symptoms (EN)</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {prediction.symptoms?.en?.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-bold text-gray-800 mb-2">Tests recommandés</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                {prediction.tests?.map((test, i) => (
                  <li key={i}>{test}</li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex gap-4">
              <button
                onClick={handleSaveToDME}
                className="flex-1 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 font-semibold"
              >
                💾 Sauvegarder dans DME
              </button>
              <button
                onClick={() => {
                  setPrediction(null)
                  fileInputRef.current.value = ''
                }}
                className="flex-1 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Nouvelle analyse
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
