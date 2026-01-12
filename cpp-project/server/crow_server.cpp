#include "crow_all.h"
#include "../src/diagnostic_engine.h"
#include "../src/dme_system.h"
#include "../src/chatbot_engine.h"
#include "../src/network_sim.h"
#include <iostream>
#include <memory>
#include <thread>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

namespace telemedicine {

class CrowServer {
private:
    crow::SimpleApp app;
    std::unique_ptr<DiagnosticEngine> diagnosticEngine;
    std::unique_ptr<DMESystem> dmeSystem;
    std::unique_ptr<MedicalChatbot> chatbot;
    std::unique_ptr<NetworkSimulation> networkSim;

public:
    CrowServer()
        : diagnosticEngine(std::make_unique<DiagnosticEngine>()),
          dmeSystem(std::make_unique<DMESystem>()),
          chatbot(std::make_unique<MedicalChatbot>()),
          networkSim(std::make_unique<NetworkSimulation>()) {
        setupRoutes();
    }

    void setupRoutes() {
        // Health check
        CROW_ROUTE(app, "/api/health").methods("GET"_method)
        ([this]() {
            json response;
            response["status"] = "ok";
            response["service"] = "Telemedicine Diagnostic System";
            response["version"] = "1.0.0";
            return crow::response{response.dump()};
        });

        // Diagnostic endpoint
        CROW_ROUTE(app, "/api/diagnostic")
            .methods("POST"_method)
        ([this](const crow::request& req) {
            auto body = crow::json::load(req.body);
            if (!body) {
                return crow::response(400, "Invalid JSON");
            }

            std::string imagePath = body["imagePath"].s();
            auto result = diagnosticEngine->analyzeImage(imagePath);

            json response;
            response["diseaseName"] = result.diseaseName;
            response["icdCode"] = result.icdCode;
            response["confidence"] = result.confidence;
            response["urgencyLevel"] = result.urgencyLevel;
            response["tests"] = result.recommendedTests;
            response["treatments"] = result.treatments;
            response["prevention"] = result.prevention;

            return crow::response{response.dump()};
        });

        // Get supported diseases
        CROW_ROUTE(app, "/api/diseases").methods("GET"_method)
        ([this]() {
            auto diseases = diagnosticEngine->getSupportedDiseases();
            json response;
            response["diseases"] = diseases;
            return crow::response{response.dump()};
        });

        // Patient CRUD endpoints
        CROW_ROUTE(app, "/api/patient").methods("POST"_method)
        ([this](const crow::request& req) {
            auto body = crow::json::load(req.body);
            if (!body) {
                return crow::response(400, "Invalid JSON");
            }

            PatientRecord patient(
                body["patientId"].s(),
                body["firstName"].s(),
                body["lastName"].s(),
                body["age"].i(),
                body["gender"].s(),
                body["village"].s(),
                body["pathology"].s()
            );

            bool success = dmeSystem->createPatient(patient);
            json response;
            response["success"] = success;
            response["patientId"] = patient.patientId;

            return crow::response{success ? 201 : 400, response.dump()};
        });

        CROW_ROUTE(app, "/api/patient/<string>").methods("GET"_method)
        ([this](const std::string& patientId) {
            auto patient = dmeSystem->getPatient(patientId);
            if (!patient) {
                return crow::response(404, "Patient not found");
            }

            json response;
            response["patientId"] = patient->patientId;
            response["firstName"] = patient->firstName;
            response["lastName"] = patient->lastName;
            response["age"] = patient->age;
            response["gender"] = patient->gender;
            response["village"] = patient->village;
            response["pathology"] = patient->pathology;

            return crow::response{response.dump()};
        });

        CROW_ROUTE(app, "/api/patients").methods("GET"_method)
        ([this]() {
            auto patients = dmeSystem->getAllPatients();
            json response;
            response["patients"] = json::array();
            for (const auto& patient : patients) {
                json p;
                p["patientId"] = patient.patientId;
                p["firstName"] = patient.firstName;
                p["lastName"] = patient.lastName;
                p["age"] = patient.age;
                response["patients"].push_back(p);
            }
            return crow::response{response.dump()};
        });

        // Chatbot endpoint
        CROW_ROUTE(app, "/api/chat").methods("POST"_method)
        ([this](const crow::request& req) {
            auto body = crow::json::load(req.body);
            if (!body) {
                return crow::response(400, "Invalid JSON");
            }

            std::string query = body["query"].s();
            std::string language = body["language"].s("fr");

            auto chatResponse = chatbot->processQuery(query, language);

            json response;
            response["response"] = chatResponse.response;
            response["domain"] = chatResponse.domain;
            response["confidence"] = chatResponse.confidence;

            return crow::response{response.dump()};
        });

        // Network simulation endpoint
        CROW_ROUTE(app, "/api/network").methods("GET"_method)
        ([this]() {
            return crow::response{networkSim->toJSON()};
        });

        CROW_ROUTE(app, "/api/network/create-mesh").methods("POST"_method)
        ([this](const crow::request& req) {
            auto body = crow::json::load(req.body);
            if (!body) {
                return crow::response(400, "Invalid JSON");
            }

            int numNodes = body["numNodes"].i();
            networkSim->createMeshTopology(numNodes);

            json response;
            response["success"] = true;
            response["nodesCreated"] = numNodes;

            return crow::response{response.dump()};
        });

        // NS3 script generation endpoint
        CROW_ROUTE(app, "/api/ns3").methods("POST"_method)
        ([this](const crow::request& req) {
            auto body = crow::json::load(req.body);
            if (!body) {
                return crow::response(400, "Invalid JSON");
            }

            std::string scriptType = body["scriptType"].s("python");
            std::string topologyType = body["topologyType"].s("wifi");

            // Generate NS3 script content
            std::string scriptContent = generateNS3Script(scriptType, topologyType);

            json response;
            response["success"] = true;
            response["scriptContent"] = scriptContent;
            response["filename"] = "simulation_" + scriptType + ".py";

            return crow::response{response.dump()};
        });

        // Download simulation package
        CROW_ROUTE(app, "/api/download").methods("GET"_method)
        ([](const crow::request&) {
            // In real implementation, create a ZIP with all scripts
            auto response = crow::response(200, "application/zip");
            response.add_header("Content-Disposition", "attachment; filename=ns3_simulation.zip");
            return response;
        });
    }

    std::string generateNS3Script(const std::string& scriptType, const std::string& topologyType) {
        if (scriptType == "python") {
            return generatePythonScript(topologyType);
        } else {
            return generateCppScript(topologyType);
        }
    }

    std::string generatePythonScript(const std::string& topologyType) {
        std::string script = R"(#!/usr/bin/env python3

import ns.core
import ns.network
import ns.internet
import ns.point_to_point
import ns.mobility
import ns.wifi
import ns.csma
import ns.netanim

# Create nodes
nodeContainer = ns.network.NodeContainer()
nodeContainer.Create()" + std::string(topologyType == "wifi" ? "10" : "5") + R"()

# Install internet stack
internetStackHelper = ns.internet.InternetStackHelper()
internetStackHelper.Install(nodeContainer)

# Configure topology
if "wifi" in ")" + topologyType + R"(":
    wifiHelper = ns.wifi.WifiHelper()
    phyHelper = ns.wifi.YansWifiPhyHelper.Default()
    channelHelper = ns.wifi.YansWifiChannelHelper.Default()
    phyHelper.SetChannel(channelHelper.Create())
else:
    p2pHelper = ns.point_to_point.PointToPointHelper()
    p2pHelper.SetDeviceAttribute("DataRate", ns.core.StringValue("5Mbps"))
    p2pHelper.SetChannelAttribute("Delay", ns.core.StringValue("2ms"))

# Assign IP addresses
addressHelper = ns.internet.Ipv4AddressHelper()
addressHelper.SetBase(ns.network.Ipv4Address("10.1.1.0"), ns.network.Ipv4Mask("255.255.255.0"))

# Run simulation
ns.core.Simulator.Stop(ns.core.Seconds(10.0))
ns.core.Simulator.Run()
ns.core.Simulator.Destroy()

print("Simulation completed")
)";
        return script;
    }

    std::string generateCppScript(const std::string& topologyType) {
        std::string script = R"(#include "ns3/core-module.h"
#include "ns3/network-module.h"
#include "ns3/internet-module.h"
#include "ns3/point-to-point-module.h"
#include "ns3/netanim-module.h"

using namespace ns3;

int main(int argc, char *argv[])
{
  // Create nodes
  NodeContainer nodes;
  nodes.Create()" + std::string(topologyType == "wifi" ? "10" : "5") + R"();

  // Install internet stack
  InternetStackHelper stack;
  stack.Install(nodes);

  // Configure point-to-point links
  PointToPointHelper pointToPoint;
  pointToPoint.SetDeviceAttribute("DataRate", StringValue("5Mbps"));
  pointToPoint.SetChannelAttribute("Delay", StringValue("2ms"));

  // Assign IP addresses
  Ipv4AddressHelper address;
  address.SetBase("10.1.1.0", "255.255.255.0");

  // Run simulation
  Simulator::Stop(Seconds(10.0));
  Simulator::Run();
  Simulator::Destroy();

  return 0;
}
)";
        return script;
    }

    void run(uint16_t port = 3001) {
        app.port(port)
           .multithreaded()
           .run();
    }

    void runAsync(uint16_t port = 3001) {
        std::thread serverThread([this, port]() {
            run(port);
        });
        serverThread.detach();
    }
};

}  // namespace telemedicine

int main(int argc, char* argv[]) {
    std::cout << "Starting Telemedicine Server..." << std::endl;

    auto server = std::make_unique<telemedicine::CrowServer>();
    server->run(3001);

    return 0;
}
