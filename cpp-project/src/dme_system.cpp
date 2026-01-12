#include "dme_system.h"
#include <algorithm>
#include <fstream>
#include <ctime>
#include <iostream>
#include <sstream>

namespace telemedicine {

PatientRecord::PatientRecord(const std::string& id, const std::string& fname,
                             const std::string& lname, int a, const std::string& g,
                             const std::string& v, const std::string& p)
    : patientId(id), firstName(fname), lastName(lname), age(a), gender(g),
      village(v), pathology(p) {
    auto now = std::chrono::system_clock::now();
    auto time = std::chrono::system_clock::to_time_t(now);
    createdAt = std::ctime(&time);
    lastModified = createdAt;
}

DMESystem::DMESystem() : patientIdCounter(1000) {}

DMESystem::~DMESystem() {}

bool DMESystem::createPatient(const PatientRecord& patient) {
    if (patientDatabase.find(patient.patientId) != patientDatabase.end()) {
        std::cerr << "Patient " << patient.patientId << " already exists." << std::endl;
        return false;
    }
    PatientRecord newPatient = patient;
    newPatient.createdAt = getCurrentTimestamp();
    newPatient.lastModified = newPatient.createdAt;
    patientDatabase[newPatient.patientId] = newPatient;
    return true;
}

PatientRecord* DMESystem::getPatient(const std::string& patientId) {
    auto it = patientDatabase.find(patientId);
    if (it != patientDatabase.end()) {
        return &it->second;
    }
    return nullptr;
}

std::vector<PatientRecord> DMESystem::getAllPatients() const {
    std::vector<PatientRecord> patients;
    for (const auto& pair : patientDatabase) {
        patients.push_back(pair.second);
    }
    return patients;
}

bool DMESystem::updatePatient(const PatientRecord& patient) {
    auto it = patientDatabase.find(patient.patientId);
    if (it == patientDatabase.end()) {
        std::cerr << "Patient " << patient.patientId << " not found." << std::endl;
        return false;
    }
    PatientRecord updated = patient;
    updated.lastModified = getCurrentTimestamp();
    patientDatabase[patient.patientId] = updated;
    return true;
}

bool DMESystem::deletePatient(const std::string& patientId) {
    auto it = patientDatabase.find(patientId);
    if (it == patientDatabase.end()) {
        std::cerr << "Patient " << patientId << " not found." << std::endl;
        return false;
    }
    patientDatabase.erase(it);
    return true;
}

std::vector<PatientRecord> DMESystem::getPatientsByVillage(const std::string& village) const {
    std::vector<PatientRecord> results;
    for (const auto& pair : patientDatabase) {
        if (pair.second.village == village) {
            results.push_back(pair.second);
        }
    }
    return results;
}

std::vector<PatientRecord> DMESystem::getPatientsByPathology(const std::string& pathology) const {
    std::vector<PatientRecord> results;
    for (const auto& pair : patientDatabase) {
        if (pair.second.pathology == pathology) {
            results.push_back(pair.second);
        }
    }
    return results;
}

bool DMESystem::saveToFile(const std::string& filename) {
    std::ofstream file(filename);
    if (!file.is_open()) {
        std::cerr << "Could not open file: " << filename << std::endl;
        return false;
    }

    for (const auto& pair : patientDatabase) {
        const auto& patient = pair.second;
        file << patient.patientId << "|"
             << patient.firstName << "|"
             << patient.lastName << "|"
             << patient.age << "|"
             << patient.gender << "|"
             << patient.village << "|"
             << patient.pathology << "|"
             << patient.createdAt << "|"
             << patient.lastModified << "\n";
    }

    file.close();
    return true;
}

bool DMESystem::loadFromFile(const std::string& filename) {
    std::ifstream file(filename);
    if (!file.is_open()) {
        std::cerr << "Could not open file: " << filename << std::endl;
        return false;
    }

    std::string line;
    while (std::getline(file, line)) {
        std::stringstream ss(line);
        std::string patientId, firstName, lastName, ageStr, gender, village, pathology, createdAt, lastModified;

        std::getline(ss, patientId, '|');
        std::getline(ss, firstName, '|');
        std::getline(ss, lastName, '|');
        std::getline(ss, ageStr, '|');
        std::getline(ss, gender, '|');
        std::getline(ss, village, '|');
        std::getline(ss, pathology, '|');
        std::getline(ss, createdAt, '|');
        std::getline(ss, lastModified);

        int age = std::stoi(ageStr);
        PatientRecord patient(patientId, firstName, lastName, age, gender, village, pathology);
        patient.createdAt = createdAt;
        patient.lastModified = lastModified;
        patientDatabase[patientId] = patient;
    }

    file.close();
    return true;
}

int DMESystem::getTotalPatients() const {
    return patientDatabase.size();
}

std::map<std::string, int> DMESystem::getPatientsByVillageCount() const {
    std::map<std::string, int> counts;
    for (const auto& pair : patientDatabase) {
        counts[pair.second.village]++;
    }
    return counts;
}

std::map<std::string, int> DMESystem::getPatientsByPathologyCount() const {
    std::map<std::string, int> counts;
    for (const auto& pair : patientDatabase) {
        counts[pair.second.pathology]++;
    }
    return counts;
}

std::string DMESystem::toJSON() const {
    // Simple JSON serialization (requires nlohmann/json or manual JSON building)
    std::string json = "{\n  \"patients\": [\n";
    bool first = true;
    for (const auto& pair : patientDatabase) {
        if (!first) json += ",\n";
        const auto& patient = pair.second;
        json += "    {\n"
                "      \"patientId\": \"" + patient.patientId + "\",\n"
                "      \"firstName\": \"" + patient.firstName + "\",\n"
                "      \"lastName\": \"" + patient.lastName + "\",\n"
                "      \"age\": " + std::to_string(patient.age) + ",\n"
                "      \"gender\": \"" + patient.gender + "\",\n"
                "      \"village\": \"" + patient.village + "\",\n"
                "      \"pathology\": \"" + patient.pathology + "\"\n"
                "    }";
        first = false;
    }
    json += "\n  ]\n}";
    return json;
}

bool DMESystem::fromJSON(const std::string& jsonString) {
    // Simple JSON parsing (in production, use nlohmann/json)
    // This is a stub implementation
    std::cerr << "fromJSON not fully implemented yet." << std::endl;
    return false;
}

std::string DMESystem::generatePatientId() {
    return "PAT" + std::to_string(patientIdCounter++);
}

std::string DMESystem::getCurrentTimestamp() {
    auto now = std::chrono::system_clock::now();
    auto time = std::chrono::system_clock::to_time_t(now);
    std::string timeStr = std::ctime(&time);
    timeStr.pop_back();  // Remove trailing newline
    return timeStr;
}

}  // namespace telemedicine
