#pragma once

#include <string>
#include <vector>
#include <map>
#include <memory>

namespace telemedicine {

struct NetworkNode {
    int nodeId;
    std::string nodeName;
    double positionX;
    double positionY;
    std::string type;  // e.g., "clinic", "hospital", "router", "gateway"
    int dataPacketsSent;
    int dataPacketsReceived;
    float signalStrength;  // 0-100

    NetworkNode() : nodeId(0), positionX(0), positionY(0), dataPacketsSent(0),
                    dataPacketsReceived(0), signalStrength(100.0f) {}
    NetworkNode(int id, const std::string& name, double x, double y, const std::string& t)
        : nodeId(id), nodeName(name), positionX(x), positionY(y), type(t),
          dataPacketsSent(0), dataPacketsReceived(0), signalStrength(100.0f) {}
};

struct NetworkLink {
    int linkId;
    int sourceNodeId;
    int destNodeId;
    float bandwidth;  // Mbps
    float delay;      // milliseconds
    float loss;       // packet loss percentage
    bool isActive;

    NetworkLink() : linkId(0), sourceNodeId(0), destNodeId(0),
                    bandwidth(100.0f), delay(5.0f), loss(0.0f), isActive(true) {}
};

class NetworkSimulation {
public:
    NetworkSimulation();
    ~NetworkSimulation();

    // Node operations
    int addNode(const std::string& nodeName, double x, double y, const std::string& type);
    bool removeNode(int nodeId);
    NetworkNode* getNode(int nodeId);
    std::vector<NetworkNode> getAllNodes() const;

    // Link operations
    int addLink(int sourceId, int destId, float bandwidth = 100.0f, float delay = 5.0f);
    bool removeLink(int linkId);
    NetworkLink* getLink(int linkId);
    std::vector<NetworkLink> getAllLinks() const;

    // Simulation
    void simulateDataTransfer(int sourceId, int destId, int packetSize);
    void updateNetworkStats();
    void animateNetwork(float deltaTime);

    // Statistics
    float getAverageLatency() const;
    float getAveragePacketLoss() const;
    float getTotalDataTransferred() const;

    // Mesh topology
    void createMeshTopology(int numNodes);
    std::vector<std::pair<int, int>> getNetworkTopology() const;

    // JSON export for visualization
    std::string toJSON() const;

private:
    std::map<int, NetworkNode> nodes;
    std::map<int, NetworkLink> links;
    int nextNodeId;
    int nextLinkId;
    float totalDataTransferred;

    float calculateDistance(double x1, double y1, double x2, double y2) const;
};

}  // namespace telemedicine
