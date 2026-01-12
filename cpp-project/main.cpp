#include <iostream>
#include <memory>
#include "src/diagnostic_engine.h"
#include "src/dme_system.h"
#include "src/chatbot_engine.h"
#include "src/network_sim.h"

int main(int argc, char *argv[]) {
    std::cout << "==================================" << std::endl;
    std::cout << "  Telemedicine Diagnostic System" << std::endl;
    std::cout << "  Version 1.0.0 (C++ Core)" << std::endl;
    std::cout << "==================================" << std::endl << std::endl;

    // Initialize core modules
    auto diagnostic = std::make_unique<telemedicine::DiagnosticEngine>();
    auto dme = std::make_unique<telemedicine::DMESystem>();
    auto chatbot = std::make_unique<telemedicine::MedicalChatbot>();
    auto network = std::make_unique<telemedicine::NetworkSimulation>();

    // Display supported diseases
    std::cout << "📋 Supported Diseases:" << std::endl;
    auto diseases = diagnostic->getSupportedDiseases();
    for (size_t i = 0; i < diseases.size(); ++i) {
        std::cout << "  " << (i + 1) << ". " << diseases[i] << std::endl;
    }
    std::cout << std::endl;

    // Test Diagnostic Engine
    std::cout << "🔬 Testing Diagnostic Engine..." << std::endl;
    auto result = diagnostic->analyzeImage("test_image.jpg");
    std::cout << "  Detected: " << result.diseaseName << std::endl;
    std::cout << "  ICD Code: " << result.icdCode << std::endl;
    std::cout << "  Confidence: " << (result.confidence * 100) << "%" << std::endl;
    std::cout << std::endl;

    // Test DME System
    std::cout << "👥 Testing Patient Management (DME)..." << std::endl;
    telemedicine::PatientRecord patient(
        "PAT001",
        "Jean",
        "Dupont",
        45,
        "M",
        "Kinshasa",
        "Diabète"
    );
    if (dme->createPatient(patient)) {
        std::cout << "  ✓ Patient PAT001 created successfully" << std::endl;
    }
    auto retrieved = dme->getPatient("PAT001");
    if (retrieved) {
        std::cout << "  ✓ Retrieved: " << retrieved->firstName << " "
                  << retrieved->lastName << " (Age: " << retrieved->age << ")" << std::endl;
    }
    std::cout << "  Total patients: " << dme->getTotalPatients() << std::endl;
    std::cout << std::endl;

    // Test Medical Chatbot
    std::cout << "💬 Testing Medical Chatbot..." << std::endl;
    auto response = chatbot->processQuery("Comment traiter la fièvre?", "fr");
    std::cout << "  Query: Comment traiter la fièvre?" << std::endl;
    std::cout << "  Domain: " << response.domain << std::endl;
    std::cout << "  Response: " << response.response << std::endl;
    std::cout << std::endl;

    // Test Network Simulation
    std::cout << "🌐 Testing Network Simulation..." << std::endl;
    network->createMeshTopology(5);
    std::cout << "  ✓ Mesh topology created with 5 nodes" << std::endl;
    std::cout << "  Average latency: " << network->getAverageLatency() << " ms" << std::endl;
    std::cout << "  Average packet loss: " << network->getAveragePacketLoss() << "%" << std::endl;
    std::cout << std::endl;

    // Display chatbot domains
    std::cout << "📚 Chatbot Knowledge Domains:" << std::endl;
    auto domains = chatbot->getSupportedDomains();
    for (const auto& domain : domains) {
        std::cout << "  • " << domain << std::endl;
    }
    std::cout << std::endl;

    std::cout << "==================================" << std::endl;
    std::cout << "✓ All modules initialized successfully!" << std::endl;
    std::cout << "==================================" << std::endl;
    std::cout << "\nNote: REST API server can be enabled with:" << std::endl;
    std::cout << "  cmake -DBUILD_SERVER=ON .." << std::endl;
    std::cout << "\nFor production GUI, install Qt6 and rebuild." << std::endl;

    return 0;
}
