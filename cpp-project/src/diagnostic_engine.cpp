#include "diagnostic_engine.h"
#include <iostream>
#include <algorithm>

namespace telemedicine {

DiagnosticEngine::DiagnosticEngine() {
    initializeDiseaseDatabase();
}

DiagnosticEngine::~DiagnosticEngine() {}

bool DiagnosticEngine::loadModel(const std::string& modelPath) {
    // TODO: Load TensorFlow Lite model from modelPath
    std::cout << "Loading AI model from: " << modelPath << std::endl;
    return true;  // Mock success
}

void DiagnosticEngine::initializeDiseaseDatabase() {
    // Paludisme (ICD: B54)
    diseaseDatabase["B54"] = {
        "Paludisme",
        "B54",
        {"TDR", "Goutte épaisse", "PCR"},
        {"Artémisinine", "Quinine", "Chloroquine"},
        {"Utiliser moustiquaire imprégnée", "Prendre antipaludéens", "Nettoyer zones d'eau stagnante"}
    };

    // Dengue (ICD: A90)
    diseaseDatabase["A90"] = {
        "Dengue",
        "A90",
        {"NS1", "Sérologie", "PCR"},
        {"Paracétamol", "Hydratation", "Repos"},
        {"Éviter piqûres de moustiques", "Eliminer eau stagnante", "Utiliser répulsif"}
    };

    // Affections cutanées (ICD: L98.9)
    diseaseDatabase["L98.9"] = {
        "Affections cutanées",
        "L98.9",
        {"Culture", "Histologie", "Dermoscopie"},
        {"Antifongique", "Antibiotique topique", "Stéroïde"},
        {"Hygiène stricte", "Éviter macération", "Traiter infections rapidement"}
    };

    // Affections ophtalmologiques (ICD: H53.9)
    diseaseDatabase["H53.9"] = {
        "Affections ophtalmologiques",
        "H53.9",
        {"Tonométrie", "Fond d'œil", "OCT"},
        {"Gouttes ophtalmiques", "Intervention chirurgicale", "Correction optique"},
        {"Protéger les yeux", "Bonne hygiène", "Dépistage régulier"}
    };

    // Maladies respiratoires (ICD: J98.9)
    diseaseDatabase["J98.9"] = {
        "Maladies respiratoires",
        "J98.9",
        {"Radiographie", "Spirométrie", "Gaz du sang"},
        {"Bronchodilatateur", "Corticoïde inhalé", "Oxygénothérapie"},
        {"Arrêter tabac", "Éviter pollution", "Vaccin antigrippal"}
    };

    // Suivi prénatal (ICD: Z32)
    diseaseDatabase["Z32"] = {
        "Suivi prénatal",
        "Z32",
        {"Échographie", "Groupage sanguin", "Sérologie"},
        {"Acide folique", "Suppléments fer", "Consultation régulière"},
        {"Nutrition équilibrée", "Repos suffisant", "Éviter stress"}
    };

    // VIH/SIDA (ICD: B20)
    diseaseDatabase["B20"] = {
        "VIH/SIDA",
        "B20",
        {"Test VIH", "CD4", "Charge virale"},
        {"ARV trithérapie", "Prophylaxie OI", "Conseil nutritionnel"},
        {"Prévention transmission", "Dépistage partenaires", "Adhérence ARV"}
    };

    // Malnutrition (ICD: E46)
    diseaseDatabase["E46"] = {
        "Malnutrition",
        "E46",
        {"Albuminémie", "Poids/IMC", "Anthropométrie"},
        {"Suppléments nutritionnels", "Conseil diététique", "Traitement causes"},
        {"Diversifier alimentation", "Fortifier aliments", "Éducation nutritionnelle"}
    };

    // Diabète (ICD: E11)
    diseaseDatabase["E11"] = {
        "Diabète type 2",
        "E11",
        {"Glycémie", "HbA1c", "Lipidémie"},
        {"Metformine", "Insuline", "Hygiène de vie"},
        {"Exercice régulier", "Perte poids", "Alimentation saine"}
    };

    // Hypertension (ICD: I10)
    diseaseDatabase["I10"] = {
        "Hypertension",
        "I10",
        {"Tension artérielle", "ECG", "Créatininémie"},
        {"Inhibiteur ACE", "Bêtabloquant", "Diurétique"},
        {"Réduire sodium", "Exercice physique", "Gestion stress"}
    };
}

DiagnosisResult DiagnosticEngine::analyzeImage(const std::string& imagePath) {
    // TODO: Use actual TensorFlow Lite model
    return mockAnalyze(imagePath);
}

DiagnosisResult DiagnosticEngine::mockAnalyze(const std::string& imagePath) {
    // Mock analysis - in real implementation, use TensorFlow Lite
    DiagnosisResult result;
    result.diseaseName = "Paludisme";
    result.icdCode = "B54";
    result.confidence = 0.87;
    result.urgencyLevel = "URGENT";
    result.recommendedTests = {"TDR", "Goutte épaisse"};
    result.treatments = {"Artémisinine"};
    result.prevention = {"Moustiquaire imprégnée"};
    return result;
}

std::vector<std::string> DiagnosticEngine::getSupportedDiseases() const {
    std::vector<std::string> diseases;
    for (const auto& pair : diseaseDatabase) {
        diseases.push_back(pair.second.name);
    }
    return diseases;
}

DiagnosisResult DiagnosticEngine::getDiseaseDetails(const std::string& icdCode) const {
    auto it = diseaseDatabase.find(icdCode);
    if (it != diseaseDatabase.end()) {
        const auto& disease = it->second;
        return {
            disease.name,
            disease.icdCode,
            0.0,
            "",
            disease.tests,
            disease.treatments,
            disease.prevention
        };
    }
    return {};
}

}  // namespace telemedicine
