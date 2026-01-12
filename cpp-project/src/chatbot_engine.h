#pragma once

#include <string>
#include <vector>
#include <map>

namespace telemedicine {

struct ChatResponse {
    std::string response;
    std::string domain;  // e.g., "Pregnancy", "Nutrition", "Diabetes"
    float confidence;
    std::vector<std::string> relatedTests;
    std::vector<std::string> relatedTreatments;
};

class MedicalChatbot {
public:
    MedicalChatbot();
    ~MedicalChatbot();

    ChatResponse processQuery(const std::string& userQuery, const std::string& language = "fr");
    std::vector<std::string> getSuggestedQuestions(const std::string& domain) const;
    std::vector<std::string> getSupportedDomains() const;

private:
    struct DomainKnowledge {
        std::string name;
        std::vector<std::pair<std::string, std::string>> qaPairs;  // question, answer
        std::vector<std::string> keywords;
    };

    std::map<std::string, DomainKnowledge> knowledgeBase;

    void initializeKnowledgeBase();
    void initializeSymptomsDomain();
    void initializeDiseasesDomain();
    void initializePregnancyDomain();
    void initializeNutritionDomain();
    void initializeDiabetesDomain();
    void initializeHypertensionDomain();
    void initializeHIVDomain();

    std::string findBestMatch(const std::string& query);
    float calculateSimilarity(const std::string& s1, const std::string& s2);
    std::string toLowerCase(const std::string& str);
};

}  // namespace telemedicine
