#pragma once

#include <string>
#include <vector>
#include <map>
#include <memory>
#include <chrono>

namespace telemedicine {

struct PatientRecord {
    std::string patientId;
    std::string firstName;
    std::string lastName;
    int age;
    std::string gender;  // "M", "F", "Other"
    std::string village;
    std::string pathology;  // Primary condition
    std::string createdAt;
    std::string lastModified;

    PatientRecord() = default;
    PatientRecord(const std::string& id, const std::string& fname, 
                  const std::string& lname, int a, const std::string& g,
                  const std::string& v, const std::string& p);
};

class DMESystem {
public:
    DMESystem();
    ~DMESystem();

    // Patient CRUD operations
    bool createPatient(const PatientRecord& patient);
    PatientRecord* getPatient(const std::string& patientId);
    std::vector<PatientRecord> getAllPatients() const;
    bool updatePatient(const PatientRecord& patient);
    bool deletePatient(const std::string& patientId);

    // Query operations
    std::vector<PatientRecord> getPatientsByVillage(const std::string& village) const;
    std::vector<PatientRecord> getPatientsByPathology(const std::string& pathology) const;

    // Persistence
    bool saveToFile(const std::string& filename);
    bool loadFromFile(const std::string& filename);

    // Statistics
    int getTotalPatients() const;
    std::map<std::string, int> getPatientsByVillageCount() const;
    std::map<std::string, int> getPatientsByPathologyCount() const;

    // JSON serialization (requires nlohmann/json or similar)
    std::string toJSON() const;
    bool fromJSON(const std::string& jsonString);

private:
    std::map<std::string, PatientRecord> patientDatabase;
    int patientIdCounter;

    std::string generatePatientId();
    std::string getCurrentTimestamp();
};

}  // namespace telemedicine
