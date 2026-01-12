#ifndef DIAGNOSTIC_ENGINE_H
#define DIAGNOSTIC_ENGINE_H

#include <string>
#include <map>
#include <vector>
#include <memory>

namespace telemedicine {

struct DiagnosisResult {
    std::string diseaseName;
    std::string icdCode;
    double confidence;
    std::string urgencyLevel;  // URGENT, MODÉRÉ, FAIBLE
    std::vector<std::string> recommendedTests;
    std::vector<std::string> treatments;
    std::vector<std::string> prevention;
};

class DiagnosticEngine {
public:
    DiagnosticEngine();
    ~DiagnosticEngine();

    // Load AI model (TensorFlow Lite or mock)
    bool loadModel(const std::string& modelPath);

    // Analyze image and return diagnosis
    DiagnosisResult analyzeImage(const std::string& imagePath);

    // Get list of supported diseases
    std::vector<std::string> getSupportedDiseases() const;

    // Get disease details by ICD code
    DiagnosisResult getDiseaseDetails(const std::string& icdCode) const;

private:
    struct Disease {
        std::string name;
        std::string icdCode;
        std::vector<std::string> tests;
        std::vector<std::string> treatments;
        std::vector<std::string> prevention;
    };

    std::map<std::string, Disease> diseaseDatabase;
    void initializeDiseaseDatabase();
    DiagnosisResult mockAnalyze(const std::string& imagePath);
};

}  // namespace telemedicine

#endif  // DIAGNOSTIC_ENGINE_H
