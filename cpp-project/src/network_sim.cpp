#include "network_sim.h"
#include <cmath>
#include <iostream>
#include <algorithm>

namespace telemedicine {

NetworkSimulation::NetworkSimulation()
    : nextNodeId(1), nextLinkId(1), totalDataTransferred(0.0f) {}

NetworkSimulation::~NetworkSimulation() {}

int NetworkSimulation::addNode(const std::string& nodeName, double x, double y, const std::string& type) {
    NetworkNode node(nextNodeId, nodeName, x, y, type);
    nodes[nextNodeId] = node;
    return nextNodeId++;
}

bool NetworkSimulation::removeNode(int nodeId) {
    auto it = nodes.find(nodeId);
    if (it == nodes.end()) {
        std::cerr << "Node " << nodeId << " not found." << std::endl;
        return false;
    }
    nodes.erase(it);

    // Remove all links connected to this node
    std::vector<int> linksToRemove;
    for (auto& linkPair : links) {
        if (linkPair.second.sourceNodeId == nodeId || linkPair.second.destNodeId == nodeId) {
            linksToRemove.push_back(linkPair.first);
        }
    }
    for (int linkId : linksToRemove) {
        removeLink(linkId);
    }

    return true;
}

NetworkNode* NetworkSimulation::getNode(int nodeId) {
    auto it = nodes.find(nodeId);
    if (it != nodes.end()) {
        return &it->second;
    }
    return nullptr;
}

std::vector<NetworkNode> NetworkSimulation::getAllNodes() const {
    std::vector<NetworkNode> allNodes;
    for (const auto& pair : nodes) {
        allNodes.push_back(pair.second);
    }
    return allNodes;
}

int NetworkSimulation::addLink(int sourceId, int destId, float bandwidth, float delay) {
    if (nodes.find(sourceId) == nodes.end() || nodes.find(destId) == nodes.end()) {
        std::cerr << "One or both nodes not found." << std::endl;
        return -1;
    }

    NetworkLink link;
    link.linkId = nextLinkId;
    link.sourceNodeId = sourceId;
    link.destNodeId = destId;
    link.bandwidth = bandwidth;
    link.delay = delay;
    link.loss = 0.0f;
    link.isActive = true;

    links[nextLinkId] = link;
    return nextLinkId++;
}

bool NetworkSimulation::removeLink(int linkId) {
    auto it = links.find(linkId);
    if (it == links.end()) {
        std::cerr << "Link " << linkId << " not found." << std::endl;
        return false;
    }
    links.erase(it);
    return true;
}

NetworkLink* NetworkSimulation::getLink(int linkId) {
    auto it = links.find(linkId);
    if (it != links.end()) {
        return &it->second;
    }
    return nullptr;
}

std::vector<NetworkLink> NetworkSimulation::getAllLinks() const {
    std::vector<NetworkLink> allLinks;
    for (const auto& pair : links) {
        allLinks.push_back(pair.second);
    }
    return allLinks;
}

void NetworkSimulation::simulateDataTransfer(int sourceId, int destId, int packetSize) {
    auto srcNode = getNode(sourceId);
    auto destNode = getNode(destId);

    if (!srcNode || !destNode) {
        std::cerr << "Invalid source or destination node." << std::endl;
        return;
    }

    // Find a link between source and destination
    for (auto& linkPair : links) {
        auto& link = linkPair.second;
        if (link.sourceNodeId == sourceId && link.destNodeId == destId && link.isActive) {
            // Calculate transfer time
            float transferTime = (static_cast<float>(packetSize) / link.bandwidth) * 1000.0f + link.delay;

            srcNode->dataPacketsSent++;
            destNode->dataPacketsReceived++;
            totalDataTransferred += packetSize;

            // Simulate packet loss
            if ((rand() % 100) < link.loss) {
                std::cout << "Packet loss on link " << link.linkId << std::endl;
            }

            return;
        }
    }

    std::cerr << "No active link found between nodes " << sourceId << " and " << destId << std::endl;
}

void NetworkSimulation::updateNetworkStats() {
    for (auto& nodePair : nodes) {
        auto& node = nodePair.second;
        // Update signal strength based on number of connections
        int connectionCount = 0;
        for (const auto& linkPair : links) {
            if ((linkPair.second.sourceNodeId == node.nodeId ||
                 linkPair.second.destNodeId == node.nodeId) && linkPair.second.isActive) {
                connectionCount++;
            }
        }
        // Signal strength decreases with more load
        node.signalStrength = std::max(20.0f, 100.0f - (connectionCount * 10.0f));
    }
}

void NetworkSimulation::animateNetwork(float deltaTime) {
    // Simulate network animation/visualization
    updateNetworkStats();

    // Update link loss rates
    for (auto& linkPair : links) {
        auto& link = linkPair.second;
        if (link.isActive) {
            // Simulate dynamic loss rate (0-5%)
            link.loss = (rand() % 5);
        }
    }
}

float NetworkSimulation::getAverageLatency() const {
    if (links.empty()) return 0.0f;
    float totalLatency = 0.0f;
    int count = 0;
    for (const auto& linkPair : links) {
        totalLatency += linkPair.second.delay;
        count++;
    }
    return totalLatency / count;
}

float NetworkSimulation::getAveragePacketLoss() const {
    if (links.empty()) return 0.0f;
    float totalLoss = 0.0f;
    int count = 0;
    for (const auto& linkPair : links) {
        totalLoss += linkPair.second.loss;
        count++;
    }
    return totalLoss / count;
}

float NetworkSimulation::getTotalDataTransferred() const {
    return totalDataTransferred;
}

void NetworkSimulation::createMeshTopology(int numNodes) {
    // Create a mesh network with nodes arranged in a grid
    int gridSize = static_cast<int>(std::sqrt(numNodes));
    for (int i = 0; i < numNodes; i++) {
        double x = (i % gridSize) * 100.0;
        double y = (i / gridSize) * 100.0;
        addNode("Node_" + std::to_string(i), x, y, "router");
    }

    // Connect nodes in a mesh pattern
    for (int i = 0; i < numNodes; i++) {
        for (int j = i + 1; j < numNodes; j++) {
            auto node1 = getNode(i + 1);
            auto node2 = getNode(j + 1);
            if (node1 && node2) {
                float distance = calculateDistance(node1->positionX, node1->positionY,
                                                   node2->positionX, node2->positionY);
                if (distance < 200.0f) {  // Only connect nearby nodes
                    addLink(i + 1, j + 1, 100.0f, distance / 100.0f);
                }
            }
        }
    }
}

std::vector<std::pair<int, int>> NetworkSimulation::getNetworkTopology() const {
    std::vector<std::pair<int, int>> topology;
    for (const auto& linkPair : links) {
        topology.push_back({linkPair.second.sourceNodeId, linkPair.second.destNodeId});
    }
    return topology;
}

std::string NetworkSimulation::toJSON() const {
    std::string json = "{\n  \"nodes\": [\n";
    bool firstNode = true;
    for (const auto& nodePair : nodes) {
        if (!firstNode) json += ",\n";
        const auto& node = nodePair.second;
        json += "    {\n"
                "      \"id\": " + std::to_string(node.nodeId) + ",\n"
                "      \"name\": \"" + node.nodeName + "\",\n"
                "      \"type\": \"" + node.type + "\",\n"
                "      \"x\": " + std::to_string(static_cast<int>(node.positionX)) + ",\n"
                "      \"y\": " + std::to_string(static_cast<int>(node.positionY)) + ",\n"
                "      \"signalStrength\": " + std::to_string(static_cast<int>(node.signalStrength)) + "\n"
                "    }";
        firstNode = false;
    }
    json += "\n  ],\n  \"links\": [\n";

    bool firstLink = true;
    for (const auto& linkPair : links) {
        if (!firstLink) json += ",\n";
        const auto& link = linkPair.second;
        json += "    {\n"
                "      \"id\": " + std::to_string(link.linkId) + ",\n"
                "      \"source\": " + std::to_string(link.sourceNodeId) + ",\n"
                "      \"dest\": " + std::to_string(link.destNodeId) + ",\n"
                "      \"bandwidth\": " + std::to_string(static_cast<int>(link.bandwidth)) + ",\n"
                "      \"delay\": " + std::to_string(static_cast<int>(link.delay)) + "\n"
                "    }";
        firstLink = false;
    }
    json += "\n  ]\n}";
    return json;
}

float NetworkSimulation::calculateDistance(double x1, double y1, double x2, double y2) const {
    return static_cast<float>(std::sqrt(std::pow(x2 - x1, 2) + std::pow(y2 - y1, 2)));
}

}  // namespace telemedicine
