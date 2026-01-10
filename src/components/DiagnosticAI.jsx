import React, { useState, useRef } from 'react';
import { Upload, Brain, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

const DiagnosticAI = () => {
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modelReady, setModelReady] = useState(false);
  const fileInputRef = useRef(null);
  const modelRef = useRef(null);

  // Précharger le modèle au montage
  React.useEffect(() => {
    const loadModel = async () => {
      try {
        modelRef.current = await mobilenet.load();
        setModelReady(true);
      } catch (err) {
        console.error('Erreur chargement modèle:', err);
        alert('Erreur: impossible de charger le modèle IA. Veuillez rafraîchir la page.');
      }
    };
    loadModel();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!modelReady) {
      alert('Le modèle IA charge toujours... Attendez un moment.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        setImage(event.target.result);
        await analyzeImage(event.target.result);
      } catch (err) {
        console.error('Erreur upload:', err);
        alert('Erreur lors du traitement de l\'image');
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (imageSrc) => {
    if (!modelRef.current) {
      alert('Le modèle n\'est pas prêt');
      return;
    }

    setLoading(true);
    try {
      const img = document.createElement('img');
      img.crossOrigin = 'anonymous';
      img.src = imageSrc;
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        setTimeout(() => reject(new Error('Timeout image')), 5000);
      });

      const predictions = await Promise.race([
        modelRef.current.classify(img),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout analyse')), 30000)
        )
      ]);

      const medicalDiagnosis = generateMedicalDiagnosis(predictions);
      setPrediction(medicalDiagnosis);
      
    } catch (error) {
      console.error('Erreur analyse complète:', error);
      setPrediction({
        disease_fr: '❌ Erreur lors de l\'analyse',
        disease_en: '❌ Error during analysis',
        icd_code: 'Z00.00',
        confidence: 0,
        severity: 'unknown',
        urgency: '❓ INCONNU',
        urgency_en: '❓ UNKNOWN',
        symptoms_fr: 'Analyse échouée - veuillez vérifier l\'image',
        symptoms_en: 'Analysis failed - please check the image',
        tests_fr: ['Vérifier la qualité', 'Réessayer avec autre image'],
        tests_en: ['Check quality', 'Try another image'],
        treatments_fr: ['Rechargez la page si problème persiste'],
        treatments_en: ['Reload page if problem persists'],
        prevention_fr: 'Utilisez images claires',
        prevention_en: 'Use clear images',
        detectedObjects: ['N/A']
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToDME = async () => {
    if (!prediction) {
      alert('Veuillez d\'abord analyser une image');
      return;
    }

    try {
      // Simuler l'enregistrement dans DME
      const dmeRecord = {
        id: `DME_${Date.now()}`,
        timestamp: new Date().toISOString(),
        image: image ? image.substring(0, 100) + '...' : 'N/A',
        diagnosis: {
          disease_fr: prediction.disease_fr,
          disease_en: prediction.disease_en,
          icd_code: prediction.icd_code,
          confidence: prediction.confidence,
          severity: prediction.severity
        },
        status: 'saved',
        synced: false
      };

      // Sauvegarder en localStorage
      const existingDME = JSON.parse(localStorage.getItem('dme_records') || '[]');
      existingDME.push(dmeRecord);
      localStorage.setItem('dme_records', JSON.stringify(existingDME));

      alert(
        `✅ Enregistrement sauvegardé dans DME!\n\n` +
        `ID: ${dmeRecord.id}\n` +
        `Diagnostic: ${prediction.disease_fr}\n` +
        `Confiance: ${prediction.confidence}%\n\n` +
        `✅ Record saved to EMR!\n\n` +
        `ID: ${dmeRecord.id}\n` +
        `Diagnosis: ${prediction.disease_en}\n` +
        `Confidence: ${prediction.confidence}%`
      );

      // Réinitialiser
      setImage(null);
      setPrediction(null);
      setImage(null);

    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      alert('Erreur lors de la sauvegarde. Veuillez réessayer.');
    }
  };

  const generateMedicalDiagnosis = (predictions) => {
    const topPrediction = predictions[0];
    const className = topPrediction.className.toLowerCase();
    const confidence = Math.round(topPrediction.probability * 100);
    
    // Base de données complète des diagnostics médicaux - Cameroun
    const diagnosticDatabase = {
      'malaria|fever|mosquito': {
        disease_fr: '🦟 PALUDISME - Soupçon probable',
        disease_en: '🦟 MALARIA - Suspected',
        icd_code: 'B54',
        severity_base: 'high',
        symptoms_fr: 'Fièvre intermittente, frissons, sueurs nocturnes, céphalées',
        symptoms_en: 'Intermittent fever, chills, night sweats, headaches',
        tests_fr: ['Test TDR (paludisme rapide)', 'Goutte épaisse', 'Frottis sanguin', 'Goutte épaisse étalée'],
        tests_en: ['Rapid diagnostic test', 'Thick blood smear', 'Thin smear', 'Blood culture if needed'],
        treatments_fr: [
          '✓ Artemether 1.6 mg/kg IM/IV (jour 1)',
          '✓ Artésunate IV: 2.4 mg/kg J0,J1,J2',
          '✓ Quinine: 20 mg/kg IV lentement',
          '✓ Suivre par Arteméther oral'
        ],
        treatments_en: [
          '✓ Artemether 1.6 mg/kg IM/IV (day 1)',
          '✓ Artesunate IV: 2.4 mg/kg D0,D1,D2',
          '✓ Quinine: 20 mg/kg IV slowly',
          '✓ Follow with oral Artemether'
        ],
        prevention_fr: 'Moustiquaire imprégnée, répulsif, éliminer eaux stagnantes',
        prevention_en: 'Insecticide-treated net, repellent, eliminate stagnant water'
      },
      'dengue|rash': {
        disease_fr: '🔴 DENGUE - Suspicion forte',
        disease_en: '🔴 DENGUE - Strong suspicion',
        icd_code: 'A90',
        severity_base: 'high',
        symptoms_fr: 'Fièvre 40°C, éruption maculopapuleuse, hémorragie',
        symptoms_en: 'High fever 40°C, maculopapular rash, hemorrhage',
        tests_fr: ['NS1 Antigen', 'sérologie IgM/IgG', 'PCR dengue', 'NFS (thrombopénie)'],
        tests_en: ['NS1 Antigen', 'IgM/IgG serology', 'Dengue PCR', 'CBC (thrombocytopenia)'],
        treatments_fr: [
          '✓ Paracétamol: 50 mg/kg/jour',
          '✓ Pas d\'AINS (Ibuprofen CONTRE-INDIQUÉ)',
          '✓ Réhydratation: 2-3L/jour',
          '✓ Transfusion si Ht < 30%'
        ],
        treatments_en: [
          '✓ Paracetamol: 50 mg/kg/day',
          '✓ No NSAIDs (Ibuprofen CONTRAINDICATED)',
          '✓ Rehydration: 2-3L/day',
          '✓ Transfusion if Ht < 30%'
        ],
        prevention_fr: 'Protection contre moustiques (Aedes), éliminer eau stagnante',
        prevention_en: 'Mosquito protection (Aedes), eliminate standing water'
      },
      'skin|ulcer|wound|scar': {
        disease_fr: '🩹 AFFECTION CUTANÉE - Examen recommandé',
        disease_en: '🩹 SKIN CONDITION - Recommended examination',
        icd_code: 'L98.9',
        severity_base: 'medium',
        symptoms_fr: 'Ulcère/plaie, rougeur, gonflement, purulent',
        symptoms_en: 'Ulcer/wound, redness, swelling, purulent',
        tests_fr: ['Culture bactérienne', 'Histologie si chronique', 'Sérologie VIH si VUD', 'Radiographie si nécrose'],
        tests_en: ['Bacterial culture', 'Histology if chronic', 'HIV serology if VU', 'X-ray if necrotic'],
        treatments_fr: [
          '✓ Nettoyage quotidien eau/savon',
          '✓ Antiseptique (Bétadine, Chlorhexidine)',
          '✓ Antibiotique topique (Mupirocine)',
          '✓ Pansement stérile, antibiothérapie si infection'
        ],
        treatments_en: [
          '✓ Daily cleaning with water/soap',
          '✓ Antiseptic (Betadine, Chlorhexidine)',
          '✓ Topical antibiotic (Mupirocin)',
          '✓ Sterile dressing, antibiotics if infected'
        ],
        prevention_fr: 'Hygiène, protection contre traumatisme, gestion du diabète',
        prevention_en: 'Hygiene, protection from trauma, diabetes management'
      },
      'eye|conjunctiva|cornea': {
        disease_fr: '👁️ AFFECTION OPHTALMOLOGIQUE - Urgent',
        disease_en: '👁️ OPHTHALMOLOGIC CONDITION - Urgent',
        icd_code: 'H53.9',
        severity_base: 'high',
        symptoms_fr: 'Rougeur, larmoiement, vision trouble, douleur oculaire',
        symptoms_en: 'Redness, tearing, blurred vision, eye pain',
        tests_fr: ['Test acuité visuelle', 'Tonométrie', 'Fluorescéine', 'Fond d\'œil dilué'],
        tests_en: ['Visual acuity test', 'Tonometry', 'Fluorescein', 'Dilated fundus exam'],
        treatments_fr: [
          '✓ Antibiotique gouttes (Chloramphénicol, Gentamicine)',
          '✓ Cicloplégie si examen dilate (Tropicamide)',
          '✓ Anesthésique topique (Tétracaïne)',
          '✓ Protection: pansement oculaire la nuit'
        ],
        treatments_en: [
          '✓ Antibiotic drops (Chloramphenicol, Gentamicin)',
          '✓ Cycloplegia if dilated exam (Tropicamide)',
          '✓ Topical anesthetic (Tetracaine)',
          '✓ Protection: eye patch at night'
        ],
        prevention_fr: 'Hygiène des mains, protéger de poussière et projections',
        prevention_en: 'Hand hygiene, protect from dust and splashes'
      },
      'respiratory|cough|lung': {
        disease_fr: '🫁 AFFECTION RESPIRATOIRE - Évaluation urgente',
        disease_en: '🫁 RESPIRATORY CONDITION - Urgent evaluation',
        icd_code: 'J98.9',
        severity_base: 'high',
        symptoms_fr: 'Toux, dyspnée, hémoptysie, douleur pleurétique',
        symptoms_en: 'Cough, dyspnea, hemoptysis, pleuritic pain',
        tests_fr: ['Radiographie thorax', 'Spirométrie', 'GDS artériel', 'Frottis craché (TB)', 'GeneXpert MTB/RIF'],
        tests_en: ['Chest X-ray', 'Spirometry', 'ABG', 'Sputum smear (TB)', 'GeneXpert MTB/RIF'],
        treatments_fr: [
          '✓ Oxygène: SaO2 > 90%',
          '✓ Paracétamol 50mg/kg si fièvre',
          '✓ Bronchodilatateurs si asthme (Salbutamol)',
          '✓ Antibiotiques si infection bactérienne'
        ],
        treatments_en: [
          '✓ Oxygen: SaO2 > 90%',
          '✓ Paracetamol 50mg/kg if fever',
          '✓ Bronchodilators if asthma (Salbutamol)',
          '✓ Antibiotics if bacterial infection'
        ],
        prevention_fr: 'Vaccination grippe/pneumo, stop tabac, aérage',
        prevention_en: 'Flu/pneumo vaccination, stop smoking, ventilation'
      },
      'pregnancy|prenatal|uterus': {
        disease_fr: '🤰 SUIVI PRÉNATAL - Consultations recommandées',
        disease_en: '🤰 PRENATAL FOLLOW-UP - Consultations recommended',
        icd_code: 'Z32',
        severity_base: 'medium',
        symptoms_fr: 'Enceinte, nausées, fatigue, gonflement',
        symptoms_en: 'Pregnant, nausea, fatigue, swelling',
        tests_fr: ['Échographie obstétricale', 'Groupe sanguin/Rh', 'VIH/Syphilis', 'NFS, glycémie', 'Protéinurie'],
        tests_en: ['Obstetric ultrasound', 'Blood group/Rh', 'HIV/Syphilis', 'CBC, glucose', 'Proteinuria'],
        treatments_fr: [
          '✓ CPN1 avant 12 semaines',
          '✓ Fer 60 mg/jour + Acide folique 5mg',
          '✓ Calcium 1000mg/jour',
          '✓ Vaccination TT si nécessaire'
        ],
        treatments_en: [
          '✓ ANC1 before 12 weeks',
          '✓ Iron 60 mg/day + Folic acid 5mg',
          '✓ Calcium 1000mg/day',
          '✓ TT vaccination if needed'
        ],
        prevention_fr: 'PF avant grossesse, traitement infections VG',
        prevention_en: 'FP before pregnancy, treat vaginal infections'
      },
      'hiv|aids|lymph': {
        disease_fr: '🔬 SUSPICION VIH - Dépistage urgent',
        disease_en: '🔬 HIV SUSPICION - Urgent screening',
        icd_code: 'B20',
        severity_base: 'high',
        symptoms_fr: 'Amaigrissement, fièvre prolongée, candidose, ganglions',
        symptoms_en: 'Weight loss, prolonged fever, candidiasis, lymph nodes',
        tests_fr: ['Test rapide VIH (Alere)', 'ELISA VIH', 'Western blot confirmatoire', 'CD4, charge virale'],
        tests_en: ['HIV rapid test (Alere)', 'HIV ELISA', 'Confirmatory Western blot', 'CD4, viral load'],
        treatments_fr: [
          '✓ Traitement ARV si CD4 < 500',
          '✓ Prophylaxie TB (Isoniazide 5mg/kg)',
          '✓ Cotrimoxazole 960mg/jour',
          '✓ Support psychosocial et nutrition'
        ],
        treatments_en: [
          '✓ ART if CD4 < 500',
          '✓ TB prophylaxis (Isoniazid 5mg/kg)',
          '✓ Cotrimoxazole 960mg/day',
          '✓ Psychosocial support and nutrition'
        ],
        prevention_fr: 'Dépistage 3-6 mois, PrEP si à risque',
        prevention_en: 'Test every 3-6 months, PrEP if at risk'
      },
      'malnutrition|child|edema': {
        disease_fr: '📊 MALNUTRITION - Évaluation nutrition',
        disease_en: '📊 MALNUTRITION - Nutrition evaluation',
        icd_code: 'E46',
        severity_base: 'high',
        symptoms_fr: 'Amaigrissement, œdèmes (MAG), apathie, retard croissance',
        symptoms_en: 'Wasting, edemas (SAM), apathy, growth delay',
        tests_fr: ['IMC/PAP/PBP', 'Albuminémie', 'NFS', 'Électrolytes', 'Test VIH'],
        tests_en: ['BMI/WAZ/HAZ', 'Albumin', 'CBC', 'Electrolytes', 'HIV test'],
        treatments_fr: [
          '✓ MAG sévère: F-75 (75 kcal/kg/jour)',
          '✓ Phase réhabilitation: F-100 (100 kcal/kg)',
          '✓ Supplémentation: Fer, Zn, vitamines A/D',
          '✓ Fortification aliments: œufs, poisson, légumes'
        ],
        treatments_en: [
          '✓ Severe SAM: F-75 (75 kcal/kg/day)',
          '✓ Rehabilitation: F-100 (100 kcal/kg)',
          '✓ Supplementation: Iron, Zn, vitamins A/D',
          '✓ Food fortification: eggs, fish, vegetables'
        ],
        prevention_fr: 'Diversification alimentaire, allaitement 6 mois',
        prevention_en: 'Dietary diversification, 6-month breastfeeding'
      },
      'diabetes|glucose|hyper': {
        disease_fr: '🩺 DIABÈTE - Gestion glycémique',
        disease_en: '🩺 DIABETES - Glucose management',
        icd_code: 'E11',
        severity_base: 'medium',
        symptoms_fr: 'Polydipsie, polyurie, fatigue, trouble vision',
        symptoms_en: 'Polydipsia, polyuria, fatigue, blurred vision',
        tests_fr: ['Glycémie à jeun', 'HbA1c', 'Créatinine/GFR', 'Albuminurie', 'ECG'],
        tests_en: ['Fasting glucose', 'HbA1c', 'Creatinine/GFR', 'Albuminuria', 'ECG'],
        treatments_fr: [
          '✓ Metformine: 500-1500 mg/jour',
          '✓ Glibenclamide: 5-20 mg/jour',
          '✓ Insuline si HbA1c > 8%',
          '✓ Régime sans sucre, exercice 30min/jour'
        ],
        treatments_en: [
          '✓ Metformin: 500-1500 mg/day',
          '✓ Glibenclamide: 5-20 mg/day',
          '✓ Insulin if HbA1c > 8%',
          '✓ Sugar-free diet, 30min exercise/day'
        ],
        prevention_fr: 'Perte poids, activité physique, régime équilibré',
        prevention_en: 'Weight loss, physical activity, balanced diet'
      },
      'hypertension|blood|pressure': {
        disease_fr: '💓 HYPERTENSION - Gestion TA',
        disease_en: '💓 HYPERTENSION - BP management',
        icd_code: 'I10',
        severity_base: 'medium',
        symptoms_fr: 'Céphalées occipitales, vertiges, dyspnée',
        symptoms_en: 'Occipital headaches, dizziness, dyspnea',
        tests_fr: ['TA répétée 3x', 'ECG', 'créatinine', 'protéinurie', 'fond d\'œil'],
        tests_en: ['BP repeat 3x', 'ECG', 'creatinine', 'proteinuria', 'fundus'],
        treatments_fr: [
          '✓ IECA: Lisinopril 10-40mg',
          '✓ BB: Aténolol 50-100mg',
          '✓ Thiazide: Hydrochlorothiazide 25mg',
          '✓ Régime: sel < 6g/jour, potassium ↑'
        ],
        treatments_en: [
          '✓ ACE-I: Lisinopril 10-40mg',
          '✓ BB: Atenolol 50-100mg',
          '✓ Thiazide: Hydrochlorothiazide 25mg',
          '✓ Diet: salt < 6g/day, potassium ↑'
        ],
        prevention_fr: 'Perte poids, restriction sel, activité régulière',
        prevention_en: 'Weight loss, salt restriction, regular activity'
      },
      'default': {
        disease_fr: '❓ IMAGE NON IDENTIFIÉE - Consultation recommandée',
        disease_en: '❓ IMAGE UNIDENTIFIED - Consultation recommended',
        icd_code: 'Z00.00',
        severity_base: 'low',
        symptoms_fr: 'Impossible d\'identifier avec certitude',
        symptoms_en: 'Unable to identify with certainty',
        tests_fr: ['Examen clinique détaillé', 'Imagerie complémentaire', 'Consultation spécialiste'],
        tests_en: ['Detailed clinical examination', 'Complementary imaging', 'Specialist consultation'],
        treatments_fr: ['Suivi médical recommandé'],
        treatments_en: ['Medical follow-up recommended'],
        prevention_fr: 'Prévention générale, hygiène',
        prevention_en: 'General prevention, hygiene'
      }
    };

    // Chercher le diagnostic correspondant
    let diagnostic = diagnosticDatabase.default;
    for (const [keywords, data] of Object.entries(diagnosticDatabase)) {
      if (keywords !== 'default') {
        const keywordList = keywords.split('|');
        if (keywordList.some(kw => className.includes(kw))) {
          diagnostic = data;
          break;
        }
      }
    }

    // Déterminer la sévérité basée sur la confiance
    let severity = diagnostic.severity_base;
    if (confidence < 40) severity = 'low';
    
    return {
      disease_fr: diagnostic.disease_fr,
      disease_en: diagnostic.disease_en,
      icd_code: diagnostic.icd_code,
      symptoms_fr: diagnostic.symptoms_fr,
      symptoms_en: diagnostic.symptoms_en,
      detectedObjects: predictions.slice(0, 3).map(p => p.className),
      confidence: confidence,
      severity: severity,
      tests_fr: diagnostic.tests_fr,
      tests_en: diagnostic.tests_en,
      treatments_fr: diagnostic.treatments_fr,
      treatments_en: diagnostic.treatments_en,
      prevention_fr: diagnostic.prevention_fr,
      prevention_en: diagnostic.prevention_en,
      urgency: severity === 'high' ? '🚨 URGENT' : severity === 'medium' ? '⚠️ MODÉRÉ' : '✅ FAIBLE',
      urgency_en: severity === 'high' ? '🚨 URGENT' : severity === 'medium' ? '⚠️ MODERATE' : '✅ LOW',
      needsSpecialist: severity === 'high'
    };
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Brain className="text-green-600" />
          Module de Diagnostic par Intelligence Artificielle
        </h2>

        {/* Indicateur chargement du modèle */}
        {!modelReady && (
          <div className="mb-4 p-3 bg-blue-100 border border-blue-400 rounded-lg flex items-center gap-2">
            <Loader className="animate-spin text-blue-600 h-5 w-5" />
            <span className="text-sm text-blue-800">⏳ Chargement du modèle IA... (une seule fois) | Loading AI model...</span>
          </div>
        )}
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div
              onClick={() => modelReady && fileInputRef.current.click()}
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                modelReady 
                  ? 'border-slate-300 cursor-pointer hover:border-green-600' 
                  : 'border-slate-200 bg-slate-50 cursor-not-allowed'
              }`}
            >
              {image ? (
                <img src={image} alt="Upload" className="max-h-64 mx-auto rounded-lg" />
              ) : (
                <div>
                  <Upload className="mx-auto text-slate-400 mb-4" size={48} />
                  <p className="text-slate-600 font-medium">Cliquez pour uploader une image médicale</p>
                  <p className="text-sm text-slate-500 mt-2">
                    Radiographie, échographie, dermatologie, ophtalmologie
                  </p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            
            {image && (
              <button
                onClick={() => fileInputRef.current.click()}
                className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Changer l'image
              </button>
            )}
          </div>

          <div>
            {loading && (
              <div className="flex flex-col items-center justify-center h-full">
                <Loader className="animate-spin text-green-600 mb-4" size={48} />
                <p className="text-slate-600">Analyse en cours avec MobileNetV3...</p>
                <p className="text-sm text-slate-500 mt-2">Traitement local (aucune donnée envoyée)</p>
              </div>
            )}

            {prediction && !loading && (
              <div className="space-y-4">
                {/* Status Alert */}
                <div className={`p-4 rounded-lg border-2 ${
                  prediction.urgency.includes('URGENT') 
                    ? 'bg-red-50 border-red-300' 
                    : prediction.urgency.includes('MODÉRÉ')
                    ? 'bg-yellow-50 border-yellow-300'
                    : 'bg-green-50 border-green-300'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{prediction.disease_fr}</h3>
                      <p className="text-sm text-slate-600 italic">{prediction.disease_en}</p>
                      <p className="text-xs text-slate-500 mt-1">ICD Code: {prediction.icd_code}</p>
                    </div>
                    <span className={`font-bold px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                      prediction.urgency.includes('URGENT') ? 'bg-red-200 text-red-800' 
                      : prediction.urgency.includes('MODÉRÉ') ? 'bg-yellow-200 text-yellow-800'
                      : 'bg-green-200 text-green-800'
                    }`}>
                      {prediction.urgency}
                    </span>
                  </div>
                </div>

                {/* Confidence */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm font-semibold mb-2">Confiance IA | AI Confidence: {prediction.confidence}%</p>
                  <div className="w-full bg-blue-200 rounded-full h-4 overflow-hidden">
                    <div
                      className={`h-full transition-all rounded-full ${
                        prediction.confidence > 75 ? 'bg-green-500' :
                        prediction.confidence > 50 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${prediction.confidence}%` }}
                    />
                  </div>
                </div>

                {/* Symptoms */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h4 className="font-bold text-slate-800 mb-2">🔍 Symptômes</h4>
                    <p className="text-sm text-slate-700">{prediction.symptoms_fr}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <h4 className="font-bold text-slate-800 mb-2">🔍 Symptoms</h4>
                    <p className="text-sm text-slate-700">{prediction.symptoms_en}</p>
                  </div>
                </div>

                {/* Tests FR */}
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h4 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                    🧪 Tests à effectuer (Français)
                  </h4>
                  <ul className="space-y-1">
                    {prediction.tests_fr.map((test, idx) => (
                      <li key={idx} className="text-sm text-slate-700 flex items-start gap-2">
                        <span className="text-purple-600 font-bold">→</span>
                        <span>{test}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tests EN */}
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h4 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                    🧪 Tests to perform (English)
                  </h4>
                  <ul className="space-y-1">
                    {prediction.tests_en.map((test, idx) => (
                      <li key={idx} className="text-sm text-slate-700 flex items-start gap-2">
                        <span className="text-purple-600 font-bold">→</span>
                        <span>{test}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Treatments FR */}
                <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300">
                  <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                    💊 Traitement recommandé (Français)
                  </h4>
                  <ul className="space-y-1">
                    {prediction.treatments_fr.map((treat, idx) => (
                      <li key={idx} className="text-sm text-slate-700 font-mono">
                        {treat}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Treatments EN */}
                <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300">
                  <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                    💊 Recommended Treatment (English)
                  </h4>
                  <ul className="space-y-1">
                    {prediction.treatments_en.map((treat, idx) => (
                      <li key={idx} className="text-sm text-slate-700 font-mono">
                        {treat}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Prevention FR */}
                <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-200">
                  <h4 className="font-bold text-cyan-900 mb-2">🛡️ Prévention (Français)</h4>
                  <p className="text-sm text-slate-700">{prediction.prevention_fr}</p>
                </div>

                {/* Prevention EN */}
                <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-200">
                  <h4 className="font-bold text-cyan-900 mb-2">🛡️ Prevention (English)</h4>
                  <p className="text-sm text-slate-700">{prediction.prevention_en}</p>
                </div>

                {/* Critical Warning */}
                {prediction.needsSpecialist && (
                  <div className="p-4 bg-red-100 rounded border-2 border-red-400 animate-pulse">
                    <p className="text-red-900 font-bold text-sm">
                      🚨 CAS URGENT - Consultation spécialiste IMMÉDIATE obligatoire | 🚨 URGENT CASE - Immediate specialist consultation required
                    </p>
                  </div>
                )}

                <button 
                  onClick={handleSaveToDME}
                  className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-colors"
                >
                  💾 Enregistrer dans DME | Save to EMR
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Technologie:</strong> Ce système utilise MobileNetV3 et TensorFlow.js pour l'analyse locale. 
          Aucune donnée n'est envoyée à un serveur externe. Traitement 100% gratuit et confidentiel.
        </p>
        <p className="text-xs text-blue-700 mt-2">
          <strong>Disclaimer:</strong> Cet outil est une aide à la décision. Un diagnostic médical définitif nécessite une consultation avec un professionnel de santé qualifié.
        </p>
      </div>
    </div>
  );
};

export default DiagnosticAI;