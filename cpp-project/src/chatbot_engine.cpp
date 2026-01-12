#include "chatbot_engine.h"
#include <algorithm>
#include <cctype>
#include <iostream>

namespace telemedicine {

MedicalChatbot::MedicalChatbot() {
    initializeKnowledgeBase();
}

MedicalChatbot::~MedicalChatbot() {}

void MedicalChatbot::initializeKnowledgeBase() {
    initializeSymptomsDomain();
    initializeDiseasesDomain();
    initializePregnancyDomain();
    initializeNutritionDomain();
    initializeDiabetesDomain();
    initializeHypertensionDomain();
    initializeHIVDomain();
}

void MedicalChatbot::initializeSymptomsDomain() {
    DomainKnowledge symptoms;
    symptoms.name = "Symptoms";
    symptoms.keywords = {"fièvre", "fever", "maux de tête", "headache", "nausée", "nausea",
                         "toux", "cough", "douleur", "pain", "fatigue", "fatigue"};
    symptoms.qaPairs = {
        {"Qu'est-ce que la fièvre?", "La fièvre est une élévation temporaire de la température corporelle au-dessus de 37°C. "
                                      "Elle est souvent un signe que le corps combat une infection."},
        {"What is fever?", "Fever is a temporary elevation of body temperature above 37°C. "
                           "It is often a sign that the body is fighting an infection."},
        {"Comment traiter les maux de tête?", "Les maux de tête peuvent être traités avec du paracétamol, "
                                              "du repos, une bonne hydratation et la gestion du stress."},
        {"How to treat headaches?", "Headaches can be treated with paracetamol, rest, good hydration and stress management."}
    };
    knowledgeBase["Symptoms"] = symptoms;
}

void MedicalChatbot::initializeDiseasesDomain() {
    DomainKnowledge diseases;
    diseases.name = "Diseases";
    diseases.keywords = {"paludisme", "malaria", "dengue", "dengue", "vih", "hiv", "diabète", "diabetes"};
    diseases.qaPairs = {
        {"Qu'est-ce que le paludisme?", "Le paludisme est une infection parasitaire transmise par les moustiques Anophèles femelles. "
                                        "Symptômes: fièvre, frissons, maux de tête. Traitement: Artémisinine ou dérivés."},
        {"What is malaria?", "Malaria is a parasitic infection transmitted by female Anopheles mosquitoes. "
                             "Symptoms: fever, chills, headache. Treatment: Artemisinin or derivatives."},
        {"Comment prévenir le paludisme?", "Pour prévenir le paludisme: utilisez une moustiquaire imprégnée, "
                                           "portez des vêtements couvrants, et utilisez des répulsifs."},
        {"How to prevent malaria?", "To prevent malaria: use insecticide-treated bed nets, wear protective clothing, and use repellents."}
    };
    knowledgeBase["Diseases"] = diseases;
}

void MedicalChatbot::initializePregnancyDomain() {
    DomainKnowledge pregnancy;
    pregnancy.name = "Pregnancy";
    pregnancy.keywords = {"grossesse", "pregnancy", "prénatal", "prenatal", "accouchement", "delivery", "bébé", "baby"};
    pregnancy.qaPairs = {
        {"Quel est le suivi prénatal recommandé?", "Un suivi prénatal comprend des visites régulières, des échographies, "
                                                   "des analyses de sang et une supplémentation en acide folique et fer."},
        {"What is the recommended prenatal care?", "Prenatal care includes regular visits, ultrasounds, blood tests, "
                                                   "and supplementation with folic acid and iron."},
        {"Quelle est la durée d'une grossesse?", "Une grossesse dure environ 40 semaines (9 mois) à partir du dernier cycle menstruel."},
        {"How long is pregnancy?", "A pregnancy lasts approximately 40 weeks (9 months) from the last menstrual cycle."}
    };
    knowledgeBase["Pregnancy"] = pregnancy;
}

void MedicalChatbot::initializeNutritionDomain() {
    DomainKnowledge nutrition;
    nutrition.name = "Nutrition";
    nutrition.keywords = {"alimentation", "nutrition", "poids", "weight", "régime", "diet", "vitamines", "vitamins"};
    nutrition.qaPairs = {
        {"Quelle est une alimentation équilibrée?", "Une alimentation équilibrée comprend des fruits, des légumes, "
                                                    "des protéines, des grains entiers et des produits laitiers."},
        {"What is a balanced diet?", "A balanced diet includes fruits, vegetables, proteins, whole grains and dairy products."},
        {"Comment traiter la malnutrition?", "La malnutrition est traitée par une alimentation riche en nutriments, "
                                             "une supplémentation en vitamines et minéraux, et le traitement des causes sous-jacentes."},
        {"How to treat malnutrition?", "Malnutrition is treated with nutrient-rich diet, vitamin and mineral supplementation, "
                                       "and treatment of underlying causes."}
    };
    knowledgeBase["Nutrition"] = nutrition;
}

void MedicalChatbot::initializeDiabetesDomain() {
    DomainKnowledge diabetes;
    diabetes.name = "Diabetes";
    diabetes.keywords = {"diabète", "diabetes", "glycémie", "glucose", "insuline", "insulin", "sucre", "sugar"};
    diabetes.qaPairs = {
        {"Qu'est-ce que le diabète?", "Le diabète est une maladie métabolique caractérisée par une glycémie élevée. "
                                      "Deux types: diabète type 1 (auto-immun) et diabète type 2 (style de vie)."},
        {"What is diabetes?", "Diabetes is a metabolic disease characterized by high blood sugar. "
                              "Two types: type 1 (autoimmune) and type 2 (lifestyle-related)."},
        {"Comment gérer le diabète?", "Gestion du diabète: monitoring régulier, médicaments, exercice, "
                                      "alimentation saine et consultation médicale régulière."},
        {"How to manage diabetes?", "Diabetes management: regular monitoring, medications, exercise, healthy diet and regular medical consultation."}
    };
    knowledgeBase["Diabetes"] = diabetes;
}

void MedicalChatbot::initializeHypertensionDomain() {
    DomainKnowledge hypertension;
    hypertension.name = "Hypertension";
    hypertension.keywords = {"hypertension", "hypertension", "tension", "blood pressure", "pression artérielle", "artérielle"};
    hypertension.qaPairs = {
        {"Qu'est-ce que l'hypertension?", "L'hypertension est une élévation persistante de la pression artérielle au-dessus de 140/90 mmHg. "
                                          "Elle augmente le risque de maladies cardiovasculaires."},
        {"What is hypertension?", "Hypertension is a persistent elevation of blood pressure above 140/90 mmHg. "
                                  "It increases the risk of cardiovascular disease."},
        {"Comment traiter l'hypertension?", "Traitement: médicaments (ACE inhibiteurs, bêtabloquants), réduction du sodium, "
                                            "exercice régulier et gestion du stress."},
        {"How to treat hypertension?", "Treatment: medications (ACE inhibitors, beta-blockers), sodium reduction, regular exercise and stress management."}
    };
    knowledgeBase["Hypertension"] = hypertension;
}

void MedicalChatbot::initializeHIVDomain() {
    DomainKnowledge hiv;
    hiv.name = "HIV";
    hiv.keywords = {"vih", "hiv", "sida", "aids", "antirétroviral", "antiretroviral", "cd4", "viral"};
    hiv.qaPairs = {
        {"Qu'est-ce que le VIH?", "Le VIH est un virus qui affecte le système immunitaire. "
                                  "S'il n'est pas traité, il peut progresser vers le SIDA. Traitement: antirétroviraux (ARV)."},
        {"What is HIV?", "HIV is a virus that affects the immune system. If untreated, it can progress to AIDS. Treatment: antiretrovirals (ARVs)."},
        {"Comment se transmet le VIH?", "Le VIH se transmet par le sang, les relations sexuelles non protégées, et de la mère à l'enfant. "
                                        "La prévention: condoms, préparation, prophylaxie post-exposition."},
        {"How is HIV transmitted?", "HIV is transmitted through blood, unprotected sex, and mother-to-child. "
                                    "Prevention: condoms, PrEP, post-exposure prophylaxis."}
    };
    knowledgeBase["HIV"] = hiv;
}

ChatResponse MedicalChatbot::processQuery(const std::string& userQuery, const std::string& language) {
    std::string lowerQuery = toLowerCase(userQuery);
    std::string bestMatch = findBestMatch(lowerQuery);

    ChatResponse response;
    response.domain = bestMatch.empty() ? "General" : bestMatch;
    response.confidence = bestMatch.empty() ? 0.3f : 0.8f;

    if (!bestMatch.empty() && knowledgeBase.find(bestMatch) != knowledgeBase.end()) {
        const auto& domain = knowledgeBase[bestMatch];
        // Find best matching QA pair
        for (const auto& qa : domain.qaPairs) {
            if ((language == "fr" && qa.first.find("Qu'") != std::string::npos) ||
                (language == "en" && qa.first.find("What") != std::string::npos)) {
                response.response = qa.second;
                break;
            }
        }
        if (response.response.empty() && !domain.qaPairs.empty()) {
            response.response = domain.qaPairs[0].second;
        }
    } else {
        response.response = (language == "fr") ?
            "Je ne suis pas sûr de votre question. Pouvez-vous fournir plus de détails?" :
            "I'm not sure about your question. Can you provide more details?";
    }

    return response;
}

std::vector<std::string> MedicalChatbot::getSuggestedQuestions(const std::string& domain) const {
    std::vector<std::string> suggestions;
    auto it = knowledgeBase.find(domain);
    if (it != knowledgeBase.end()) {
        for (const auto& qa : it->second.qaPairs) {
            suggestions.push_back(qa.first);
        }
    }
    return suggestions;
}

std::vector<std::string> MedicalChatbot::getSupportedDomains() const {
    std::vector<std::string> domains;
    for (const auto& pair : knowledgeBase) {
        domains.push_back(pair.first);
    }
    return domains;
}

std::string MedicalChatbot::findBestMatch(const std::string& query) {
    std::string bestDomain;
    float bestScore = 0.0f;

    for (const auto& domainPair : knowledgeBase) {
        const auto& domain = domainPair.second;
        for (const auto& keyword : domain.keywords) {
            float similarity = calculateSimilarity(query, keyword);
            if (similarity > bestScore) {
                bestScore = similarity;
                bestDomain = domainPair.first;
            }
        }
    }

    return bestDomain;
}

float MedicalChatbot::calculateSimilarity(const std::string& s1, const std::string& s2) {
    if (s1.find(s2) != std::string::npos || s2.find(s1) != std::string::npos) {
        return 0.9f;
    }
    // Simple Levenshtein-like scoring
    int matches = 0;
    for (char c : s2) {
        if (s1.find(c) != std::string::npos) matches++;
    }
    return static_cast<float>(matches) / static_cast<float>(s2.length());
}

std::string MedicalChatbot::toLowerCase(const std::string& str) {
    std::string result = str;
    std::transform(result.begin(), result.end(), result.begin(),
                   [](unsigned char c) { return std::tolower(c); });
    return result;
}

}  // namespace telemedicine
