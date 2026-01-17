#include "ns3/applications-module.h"
#include "ns3/core-module.h"
#include "ns3/internet-module.h"
#include "ns3/network-module.h"
#include "ns3/point-to-point-module.h"
#include "ns3/mobility-module.h"
#include "ns3/netanim-module.h"
#include "ns3/wifi-module.h"

using namespace ns3;

NS_LOG_COMPONENT_DEFINE("TelemedCameroonNational");

// Structure pour organiser les nœuds par région
struct RegionalInfrastructure {
    std::string regionName;
    NodeContainer asr;              // Agents de Santé Rurale
    NodeContainer healthCenter;     // Centres de Santé
    NodeContainer edgeServer;       // Edge Server local
    Ipv4InterfaceContainer asrIp;
    Ipv4InterfaceContainer healthIp;
    Ipv4InterfaceContainer edgeIp;
};

int main(int argc, char *argv[]) {
    // Paramètres de simulation
    CommandLine cmd;
    cmd.Parse(argc, argv);
    
    double simulationTime = 40.0;
    
    Time::SetResolution(Time::NS);
    LogComponentEnable("UdpEchoClientApplication", LOG_LEVEL_INFO);
    LogComponentEnable("UdpEchoServerApplication", LOG_LEVEL_INFO);

    // Création des nœuds pour l'architecture nationale
    std::map<std::string, RegionalInfrastructure> regions;
    NodeContainer allNodes;
    
    // Région Centre (Yaoundé) - 3 ASR + 2 Centres + 1 Edge Hub
    regions["Centre"].regionName = "Centre-Yaounde";
    regions["Centre"].asr.Create(3);
    regions["Centre"].healthCenter.Create(2);
    regions["Centre"].edgeServer.Create(1);
    
    // Région Littoral (Douala) - 3 ASR + 2 Centres + 1 Edge Hub
    regions["Littoral"].regionName = "Littoral-Douala";
    regions["Littoral"].asr.Create(3);
    regions["Littoral"].healthCenter.Create(2);
    regions["Littoral"].edgeServer.Create(1);
    
    // Région Ouest (Bafoussam) - 2 ASR + 1 Centre + 1 Edge Local
    regions["Ouest"].regionName = "Ouest-Bafoussam";
    regions["Ouest"].asr.Create(2);
    regions["Ouest"].healthCenter.Create(1);
    regions["Ouest"].edgeServer.Create(1);
    
    // Région Nord-Ouest (Bamenda) - 2 ASR + 1 Centre + 1 Edge Local
    regions["NordOuest"].regionName = "NordOuest-Bamenda";
    regions["NordOuest"].asr.Create(2);
    regions["NordOuest"].healthCenter.Create(1);
    regions["NordOuest"].edgeServer.Create(1);
    
    // Région Adamaoua (Ngaoundéré) - 2 ASR + 1 Centre + 1 Edge Local
    regions["Adamaoua"].regionName = "Adamaoua-Ngaounde";
    regions["Adamaoua"].asr.Create(2);
    regions["Adamaoua"].healthCenter.Create(1);
    regions["Adamaoua"].edgeServer.Create(1);
    
    // Région Nord (Garoua) - 2 ASR + 1 Centre + 1 Edge Local
    regions["Nord"].regionName = "Nord-Garoua";
    regions["Nord"].asr.Create(2);
    regions["Nord"].healthCenter.Create(1);
    regions["Nord"].edgeServer.Create(1);
    
    // Région Est (Bertoua) - 1 ASR + 1 Centre + 1 Edge Local
    regions["Est"].regionName = "Est-Bertoua";
    regions["Est"].asr.Create(1);
    regions["Est"].healthCenter.Create(1);
    regions["Est"].edgeServer.Create(1);
    
    // Région Sud (Ebolowa) - 1 ASR + 1 Centre + 1 Edge Local
    regions["Sud"].regionName = "Sud-Ebolowa";
    regions["Sud"].asr.Create(1);
    regions["Sud"].healthCenter.Create(1);
    regions["Sud"].edgeServer.Create(1);
    
    // Infrastructure cloud centralisée (Yaoundé)
    NodeContainer cloudAI;
    cloudAI.Create(1);
    
    NodeContainer database;
    database.Create(1);
    
    // Agrégation de tous les nœuds
    for (auto& regionPair : regions) {
        allNodes.Add(regionPair.second.asr);
        allNodes.Add(regionPair.second.healthCenter);
        allNodes.Add(regionPair.second.edgeServer);
    }
    allNodes.Add(cloudAI);
    allNodes.Add(database);
    
    std::cout << "✓ Nœuds créés: " << allNodes.GetN() << " nœuds totaux (16 ASR + 10 Centres + 8 Edge + 2 Centraux)" << std::endl;


    InternetStackHelper stack;
    stack.InstallAll();


    PointToPointHelper p2p;
    p2p.SetDeviceAttribute("DataRate", StringValue("100Mbps"));
    p2p.SetChannelAttribute("Delay", StringValue("2ms"));
    
    PointToPointHelper backbone;
    backbone.SetDeviceAttribute("DataRate", StringValue("1Gbps"));    // Backbone national haute capacité
    backbone.SetChannelAttribute("Delay", StringValue("5ms"));

    Ipv4AddressHelper address;
    uint16_t ipCounter = 1;  // Pour générer des sous-réseaux uniques


    uint8_t colorR = 0, colorG = 0, colorB = 0;
    std::map<std::string, Ipv4Address> regionHealthCenterIps;
    
    for (auto& regionPair : regions) {
        RegionalInfrastructure& region = regionPair.second;
        std::string regionKey = regionPair.first;
        
    
        YansWifiChannelHelper wifiChannel = YansWifiChannelHelper::Default();
        YansWifiPhyHelper wifiPhy;
        wifiPhy.SetChannel(wifiChannel.Create());
        WifiHelper wifi;
        wifi.SetStandard(WIFI_STANDARD_80211ac);
        
        WifiMacHelper wifiMac;
        std::string ssid_name = "telemed-" + region.regionName;
        Ssid ssid = Ssid(ssid_name);
        
        // ASR comme clients WiFi
        wifiMac.SetType("ns3::StaWifiMac", "Ssid", SsidValue(ssid));
        NetDeviceContainer asrWifiDev = wifi.Install(wifiPhy, wifiMac, region.asr);
        
        // Centre de Santé comme point d'accès WiFi
        wifiMac.SetType("ns3::ApWifiMac", "Ssid", SsidValue(ssid));
        NetDeviceContainer healthCenterWifiDev = wifi.Install(wifiPhy, wifiMac, region.healthCenter);
        
        // Attribution IP: 192.168.X.0/24 où X varie par région
        std::string baseLocalIp = "192.168." + std::to_string(ipCounter) + ".0";
        address.SetBase(baseLocalIp.c_str(), "255.255.255.0");
        region.asrIp = address.Assign(asrWifiDev);
        Ipv4InterfaceContainer healthIpContainer = address.Assign(healthCenterWifiDev);
        region.healthIp = healthIpContainer;
        // Stocker l'IP du premier centre de santé pour les communications
        if (region.healthCenter.GetN() > 0) {
            regionHealthCenterIps[regionKey] = healthIpContainer.GetAddress(0);
        }
        ipCounter++;
        
    
        std::string baseEdgeIp = "10.1." + std::to_string(ipCounter) + ".0";
        address.SetBase(baseEdgeIp.c_str(), "255.255.255.0");
        NetDeviceContainer healthEdgeLink = p2p.Install(region.healthCenter.Get(0), region.edgeServer.Get(0));
        region.edgeIp = address.Assign(healthEdgeLink);
        ipCounter++;
    }
    
    std::cout << "✓ Configuration régionale WiFi et P2P locale complétée" << std::endl;


    // Structure: Tous les Edge locaux --> Edge Hub Douala --> Edge Hub Yaoundé --> Cloud IA & BD
    
    NodeContainer edgeHubYaounde = regions["Centre"].edgeServer;
    NodeContainer edgeHubDouala = regions["Littoral"].edgeServer;
    
    NodeContainer otherEdges;
    otherEdges.Add(regions["Ouest"].edgeServer);
    otherEdges.Add(regions["NordOuest"].edgeServer);
    otherEdges.Add(regions["Adamaoua"].edgeServer);
    otherEdges.Add(regions["Nord"].edgeServer);
    otherEdges.Add(regions["Est"].edgeServer);
    otherEdges.Add(regions["Sud"].edgeServer);
    
    // Connexion Hub Douala <-> Hub Yaoundé (liaison principale)
    address.SetBase("10.2.1.0", "255.255.255.0");
    NetDeviceContainer doulAoYaoundeLinkDevices = backbone.Install(edgeHubDouala.Get(0), edgeHubYaounde.Get(0));
    address.Assign(doulAoYaoundeLinkDevices);
    
    // Connexion autres Edge régionaux vers Hub Douala (en chaîne géographique)
    uint16_t backdropIp = 2;
    for (uint32_t i = 0; i < otherEdges.GetN(); i++) {
        address.SetBase(("10.2." + std::to_string(backdropIp) + ".0").c_str(), "255.255.255.0");
        NetDeviceContainer regionalLink = backbone.Install(otherEdges.Get(i), edgeHubDouala.Get(0));
        address.Assign(regionalLink);
        backdropIp++;
    }
    
    // Hub Yaoundé <-> Cloud IA MINSANTE
    address.SetBase("10.3.1.0", "255.255.255.0");
    NetDeviceContainer yaoundeCloudLink = backbone.Install(edgeHubYaounde.Get(0), cloudAI.Get(0));
    address.Assign(yaoundeCloudLink);
    
    // Cloud IA <-> Base de Données (liaison ultra-rapide)
    address.SetBase("10.3.2.0", "255.255.255.0");
    NetDeviceContainer cloudDbLink = backbone.Install(cloudAI.Get(0), database.Get(0));
    address.Assign(cloudDbLink);
    
    std::cout << "✓ Backbone national interconnecté avec succès" << std::endl;


    Ipv4GlobalRoutingHelper::PopulateRoutingTables();


    

    std::map<uint16_t, ApplicationContainer> allServers;
    
    // Serveurs dans les centres de santé
    uint16_t port = 5001;
    for (auto& regionPair : regions) {
        RegionalInfrastructure& region = regionPair.second;
        UdpEchoServerHelper healthServer(port);
        ApplicationContainer healthServerApp = healthServer.Install(region.healthCenter.Get(0));
        healthServerApp.Start(Seconds(0.5));
        healthServerApp.Stop(Seconds(simulationTime));
        allServers[port] = healthServerApp;
        port++;
    }
    
    // Serveur Cloud IA (reçoit des Edge servers)
    UdpEchoServerHelper cloudMainServer(5020);
    ApplicationContainer cloudMainApp = cloudMainServer.Install(cloudAI.Get(0));
    cloudMainApp.Start(Seconds(1.0));
    cloudMainApp.Stop(Seconds(simulationTime));
    
    // Serveur Cloud IA (directs depuis ASR critiques)
    UdpEchoServerHelper cloudDirectServer(5021);
    ApplicationContainer cloudDirectApp = cloudDirectServer.Install(cloudAI.Get(0));
    cloudDirectApp.Start(Seconds(0.8));
    cloudDirectApp.Stop(Seconds(simulationTime));
    
    // Serveur Base de Données
    UdpEchoServerHelper dbServer(5022);
    ApplicationContainer dbServerApp = dbServer.Install(database.Get(0));
    dbServerApp.Start(Seconds(1.5));
    dbServerApp.Stop(Seconds(simulationTime));
    
    // Serveurs de retour dans chaque région (diagnostics du Cloud)
    port = 6001;
    std::map<std::string, uint16_t> regionReturnPorts;
    for (auto& regionPair : regions) {
        RegionalInfrastructure& region = regionPair.second;
        UdpEchoServerHelper regionReturnServer(port);
        ApplicationContainer returnApp = regionReturnServer.Install(region.healthCenter.Get(0));
        returnApp.Start(Seconds(1.5));
        returnApp.Stop(Seconds(simulationTime));
        regionReturnPorts[regionPair.first] = port;
        port++;
    }
    
    std::cout << "✓ Tous les serveurs configurés" << std::endl;


    

    uint16_t healthServerPort = 5001;
    for (auto& regionPair : regions) {
        RegionalInfrastructure& region = regionPair.second;
        
        // Chaque ASR envoie au centre de sa région
        for (uint32_t i = 0; i < region.asr.GetN(); i++) {
            if (region.healthCenter.GetN() > 0 && regionHealthCenterIps.count(regionPair.first) > 0) {
                Ipv4Address centerIp = regionHealthCenterIps[regionPair.first];
                UdpEchoClientHelper asrToHealthClient(centerIp, healthServerPort);
                asrToHealthClient.SetAttribute("MaxPackets", UintegerValue(10000));
                asrToHealthClient.SetAttribute("Interval", TimeValue(Seconds(1.2 + 0.2*i)));
                asrToHealthClient.SetAttribute("PacketSize", UintegerValue(256 + i*50));
                ApplicationContainer asrApp = asrToHealthClient.Install(region.asr.Get(i));
                asrApp.Start(Seconds(1.0 + 0.1*i));
                asrApp.Stop(Seconds(simulationTime));
            }
        }
        healthServerPort++;
    }
    

    uint16_t cloudHealthServerPort = 5001;
    for (auto& regionPair : regions) {
        RegionalInfrastructure& region = regionPair.second;
        
        for (uint32_t i = 0; i < region.healthCenter.GetN(); i++) {
            // Destination: Cloud IA via le routage (vers Edge puis backbone)
            UdpEchoClientHelper healthToCloudClient(Ipv4Address("10.3.1.2"), 5020);
            healthToCloudClient.SetAttribute("MaxPackets", UintegerValue(10000));
            healthToCloudClient.SetAttribute("Interval", TimeValue(Seconds(1.5 + 0.3*i)));
            healthToCloudClient.SetAttribute("PacketSize", UintegerValue(512 + i*100));
            ApplicationContainer healthApp = healthToCloudClient.Install(region.healthCenter.Get(i));
            healthApp.Start(Seconds(2.0 + 0.2*i));
            healthApp.Stop(Seconds(simulationTime));
        }
        cloudHealthServerPort++;
    }
    

    uint32_t asrIndex = 0;
    for (auto& regionPair : regions) {
        RegionalInfrastructure& region = regionPair.second;
        
        // Seulement le premier ASR de chaque région (cas critiques)
        if (region.asr.GetN() > 0) {
            UdpEchoClientHelper asrDirectClient(Ipv4Address("10.3.1.2"), 5021);
            asrDirectClient.SetAttribute("MaxPackets", UintegerValue(5000));
            asrDirectClient.SetAttribute("Interval", TimeValue(Seconds(0.8)));
            asrDirectClient.SetAttribute("PacketSize", UintegerValue(300));
            ApplicationContainer directApp = asrDirectClient.Install(region.asr.Get(0));
            directApp.Start(Seconds(1.2 + asrIndex*0.3));
            directApp.Stop(Seconds(simulationTime));
            asrIndex++;
        }
    }
    

    UdpEchoClientHelper cloudToDbClient(Ipv4Address("10.3.2.2"), 5022);
    cloudToDbClient.SetAttribute("MaxPackets", UintegerValue(10000));
    cloudToDbClient.SetAttribute("Interval", TimeValue(Seconds(2.0)));
    cloudToDbClient.SetAttribute("PacketSize", UintegerValue(1024));
    ApplicationContainer cloudToDbApp = cloudToDbClient.Install(cloudAI.Get(0));
    cloudToDbApp.Start(Seconds(2.5));
    cloudToDbApp.Stop(Seconds(simulationTime));
    

    uint16_t returnServerPort = 6001;
    for (auto& regionPair : regions) {
        RegionalInfrastructure& region = regionPair.second;
        
        if (region.healthCenter.GetN() > 0 && regionHealthCenterIps.count(regionPair.first) > 0) {
            Ipv4Address centerReturnIp = regionHealthCenterIps[regionPair.first];
            UdpEchoClientHelper cloudToHealthClient(centerReturnIp, returnServerPort);
            cloudToHealthClient.SetAttribute("MaxPackets", UintegerValue(8000));
            cloudToHealthClient.SetAttribute("Interval", TimeValue(Seconds(1.8)));
            cloudToHealthClient.SetAttribute("PacketSize", UintegerValue(400));
            ApplicationContainer cloudReturnApp = cloudToHealthClient.Install(cloudAI.Get(0));
            cloudReturnApp.Start(Seconds(3.5));
            cloudReturnApp.Stop(Seconds(simulationTime));
        }
        returnServerPort++;
    }
    
    std::cout << "✓ Tous les flux de données (montants & descendants) configurés" << std::endl;


    MobilityHelper mobility;
    mobility.SetMobilityModel("ns3::ConstantPositionMobilityModel");
    mobility.Install(allNodes);

    // Positionnement basé sur la géographie réelle du Cameroun (approximatif pour la visualisation)
    double xPos, yPos;
    
    // Centre (Yaoundé) - position centrale
    xPos = 300; yPos = 250;
    for (uint32_t i = 0; i < regions["Centre"].asr.GetN(); i++) {
        regions["Centre"].asr.Get(i)->GetObject<MobilityModel>()->SetPosition(Vector(xPos - 30 + i*20, yPos + 80, 0));
    }
    for (uint32_t i = 0; i < regions["Centre"].healthCenter.GetN(); i++) {
        regions["Centre"].healthCenter.Get(i)->GetObject<MobilityModel>()->SetPosition(Vector(xPos - 20 + i*40, yPos + 40, 0));
    }
    regions["Centre"].edgeServer.Get(0)->GetObject<MobilityModel>()->SetPosition(Vector(xPos, yPos, 0));
    
    // Littoral (Douala) - ouest du Centre
    xPos = 100; yPos = 200;
    for (uint32_t i = 0; i < regions["Littoral"].asr.GetN(); i++) {
        regions["Littoral"].asr.Get(i)->GetObject<MobilityModel>()->SetPosition(Vector(xPos - 30 + i*20, yPos + 80, 0));
    }
    for (uint32_t i = 0; i < regions["Littoral"].healthCenter.GetN(); i++) {
        regions["Littoral"].healthCenter.Get(i)->GetObject<MobilityModel>()->SetPosition(Vector(xPos - 20 + i*40, yPos + 40, 0));
    }
    regions["Littoral"].edgeServer.Get(0)->GetObject<MobilityModel>()->SetPosition(Vector(xPos, yPos, 0));
    
    // Ouest (Bafoussam) - nord-ouest
    xPos = 150; yPos = 380;
    for (uint32_t i = 0; i < regions["Ouest"].asr.GetN(); i++) {
        regions["Ouest"].asr.Get(i)->GetObject<MobilityModel>()->SetPosition(Vector(xPos - 15 + i*20, yPos + 60, 0));
    }
    regions["Ouest"].healthCenter.Get(0)->GetObject<MobilityModel>()->SetPosition(Vector(xPos, yPos + 20, 0));
    regions["Ouest"].edgeServer.Get(0)->GetObject<MobilityModel>()->SetPosition(Vector(xPos, yPos, 0));
    
    // Nord-Ouest (Bamenda) - nord-ouest très éloigné
    xPos = 100; yPos = 450;
    for (uint32_t i = 0; i < regions["NordOuest"].asr.GetN(); i++) {
        regions["NordOuest"].asr.Get(i)->GetObject<MobilityModel>()->SetPosition(Vector(xPos - 15 + i*20, yPos + 60, 0));
    }
    regions["NordOuest"].healthCenter.Get(0)->GetObject<MobilityModel>()->SetPosition(Vector(xPos, yPos + 20, 0));
    regions["NordOuest"].edgeServer.Get(0)->GetObject<MobilityModel>()->SetPosition(Vector(xPos, yPos, 0));
    
    // Adamaoua (Ngaoundéré) - nord du Centre
    xPos = 350; yPos = 400;
    for (uint32_t i = 0; i < regions["Adamaoua"].asr.GetN(); i++) {
        regions["Adamaoua"].asr.Get(i)->GetObject<MobilityModel>()->SetPosition(Vector(xPos - 15 + i*20, yPos + 60, 0));
    }
    regions["Adamaoua"].healthCenter.Get(0)->GetObject<MobilityModel>()->SetPosition(Vector(xPos, yPos + 20, 0));
    regions["Adamaoua"].edgeServer.Get(0)->GetObject<MobilityModel>()->SetPosition(Vector(xPos, yPos, 0));
    
    // Nord (Garoua) - très nord
    xPos = 350; yPos = 500;
    for (uint32_t i = 0; i < regions["Nord"].asr.GetN(); i++) {
        regions["Nord"].asr.Get(i)->GetObject<MobilityModel>()->SetPosition(Vector(xPos - 15 + i*20, yPos + 60, 0));
    }
    regions["Nord"].healthCenter.Get(0)->GetObject<MobilityModel>()->SetPosition(Vector(xPos, yPos + 20, 0));
    regions["Nord"].edgeServer.Get(0)->GetObject<MobilityModel>()->SetPosition(Vector(xPos, yPos, 0));
    
    // Est (Bertoua) - est du Centre
    xPos = 500; yPos = 280;
    regions["Est"].asr.Get(0)->GetObject<MobilityModel>()->SetPosition(Vector(xPos - 15, yPos + 60, 0));
    regions["Est"].healthCenter.Get(0)->GetObject<MobilityModel>()->SetPosition(Vector(xPos, yPos + 20, 0));
    regions["Est"].edgeServer.Get(0)->GetObject<MobilityModel>()->SetPosition(Vector(xPos, yPos, 0));
    
    // Sud (Ebolowa) - sud du Centre
    xPos = 350; yPos = 100;
    regions["Sud"].asr.Get(0)->GetObject<MobilityModel>()->SetPosition(Vector(xPos - 15, yPos + 60, 0));
    regions["Sud"].healthCenter.Get(0)->GetObject<MobilityModel>()->SetPosition(Vector(xPos, yPos + 20, 0));
    regions["Sud"].edgeServer.Get(0)->GetObject<MobilityModel>()->SetPosition(Vector(xPos, yPos, 0));
    
    // Infrastructure centralisée (Yaoundé)
    cloudAI.Get(0)->GetObject<MobilityModel>()->SetPosition(Vector(300, 0, 0));
    database.Get(0)->GetObject<MobilityModel>()->SetPosition(Vector(400, 0, 0));
    
    std::cout << "✓ Positionnement géographique configuré (8 régions)" << std::endl;


    AnimationInterface anim("/home/rostant/Desktop/ns-3-allinone/ns-3.46.1/build/telemed-cameroon-national.xml");
    anim.EnablePacketMetadata(true);
    
    // Configuration pour animation progressive des paquets
    anim.SetMaxPktsPerTraceFile(500000);
    
    std::string resourcePath = "/home/rostant/Desktop/ns-3-allinone/netanim/";
    
    // Chargement des images
    uint32_t asrImg = anim.AddResource(resourcePath + "homme-avec-telephone-portable.png");
    uint32_t healthImg = anim.AddResource(resourcePath + "batiment-de-lhopital.png");
    uint32_t edgeImg = anim.AddResource(resourcePath + "edge-computing.png");
    uint32_t aiImg = anim.AddResource(resourcePath + "intelligence-artificielle.png");
    uint32_t dbImg = anim.AddResource(resourcePath + "bases-de-donnees.png");


    
    for (auto& regionPair : regions) {
        RegionalInfrastructure& region = regionPair.second;
        std::string regionKey = regionPair.first;
        
        // Déterminer couleur par région
        if (regionKey == "Centre") {
            colorR = 255; colorG = 0; colorB = 0;  // Rouge
        } else if (regionKey == "Littoral") {
            colorR = 0; colorG = 100; colorB = 255;  // Bleu
        } else if (regionKey == "Ouest") {
            colorR = 255; colorG = 140; colorB = 0;  // Orange
        } else if (regionKey == "NordOuest") {
            colorR = 255; colorG = 215; colorB = 0;  // Jaune doré
        } else if (regionKey == "Adamaoua") {
            colorR = 255; colorG = 105; colorB = 180;  // Rose
        } else if (regionKey == "Nord") {
            colorR = 34; colorG = 139; colorB = 34;  // Vert forestier
        } else if (regionKey == "Est") {
            colorR = 0; colorG = 206; colorB = 209;  // Cyan
        } else if (regionKey == "Sud") {
            colorR = 128; colorG = 128; colorB = 128;  // Gris
        }
        
        // ASR - Agents de Santé Rurale
        for (uint32_t i = 0; i < region.asr.GetN(); i++) {
            std::string name = "ASR-" + regionKey + "-" + std::to_string(i+1);
            anim.UpdateNodeDescription(region.asr.Get(i), name);
            anim.UpdateNodeImage(region.asr.Get(i)->GetId(), asrImg);
            anim.UpdateNodeColor(region.asr.Get(i), colorR, colorG, colorB);
            anim.UpdateNodeSize(region.asr.Get(i)->GetId(), 35, 35);
        }
        
        // Centres de Santé Régionaux
        for (uint32_t i = 0; i < region.healthCenter.GetN(); i++) {
            std::string name = "CSR-" + regionKey + "-" + std::to_string(i+1);
            anim.UpdateNodeDescription(region.healthCenter.Get(i), name);
            anim.UpdateNodeImage(region.healthCenter.Get(i)->GetId(), healthImg);
            anim.UpdateNodeColor(region.healthCenter.Get(i), colorR-30, colorG+30, colorB);
            anim.UpdateNodeSize(region.healthCenter.Get(i)->GetId(), 45, 45);
        }
        
        // Edge Servers
        std::string edgeName = (regionKey == "Centre" || regionKey == "Littoral") ? 
                                "EDGE-HUB-" + regionKey : "EDGE-LOCAL-" + regionKey;
        anim.UpdateNodeDescription(region.edgeServer.Get(0), edgeName);
        anim.UpdateNodeImage(region.edgeServer.Get(0)->GetId(), edgeImg);
        anim.UpdateNodeColor(region.edgeServer.Get(0), colorR/2, colorG/2+128, colorB/2+128);
        anim.UpdateNodeSize(region.edgeServer.Get(0)->GetId(), 50, 50);
    }
    
    // Cloud IA Centralisé (MINSANTE)
    anim.UpdateNodeDescription(cloudAI.Get(0), "CLOUD-IA-MINSANTE");
    anim.UpdateNodeImage(cloudAI.Get(0)->GetId(), aiImg);
    anim.UpdateNodeColor(cloudAI.Get(0), 200, 0, 200);  // Violet intense
    anim.UpdateNodeSize(cloudAI.Get(0)->GetId(), 70, 70);
    
    // Base de Données Centralisée
    anim.UpdateNodeDescription(database.Get(0), "BASE-DONNEES-NATIONALE");
    anim.UpdateNodeImage(database.Get(0)->GetId(), dbImg);
    anim.UpdateNodeColor(database.Get(0), 100, 100, 100);  // Gris sombre
    anim.UpdateNodeSize(database.Get(0)->GetId(), 60, 60);
    
    std::cout << "✓ Visualisation NetAnim configurée avec 36 nœuds nommés" << std::endl;


    Simulator::Stop(Seconds(simulationTime));
    Simulator::Run();
    Simulator::Destroy();


    std::cout << "\n" << std::string(70, '=') << std::endl;
    std::cout << "║  SIMULATION TÉLÉMÉDECINE CAMEROUN NATIONALE - COMPLÈTE ║" << std::endl;
    std::cout << std::string(70, '=') << std::endl;
    
    std::cout << "\n📊 ARCHITECTURE NATIONALE DISTRIBUÉE:" << std::endl;
    std::cout << "┌─────────────────────────────────────────────────────────────┐" << std::endl;
    std::cout << "│  8 RÉGIONS × (ASR + Centres + Edge Servers) + Cloud + BD   │" << std::endl;
    std::cout << "├─────────────────────────────────────────────────────────────┤" << std::endl;
    
    uint32_t totalAsr = 0, totalHealth = 0;
    for (auto& regionPair : regions) {
        RegionalInfrastructure& region = regionPair.second;
        totalAsr += region.asr.GetN();
        totalHealth += region.healthCenter.GetN();
        std::cout << "│  ✓ " << std::setw(20) << std::left << regionPair.first 
                  << " | ASR: " << std::setw(2) << region.asr.GetN() 
                  << " | Centres: " << std::setw(2) << region.healthCenter.GetN() 
                  << " | Edge Local" << std::endl;
    }
    
    std::cout << "├─────────────────────────────────────────────────────────────┤" << std::endl;
    std::cout << "│  TOTAL: " << totalAsr << " ASR + " << totalHealth << " Centres + 2 Edge Hubs + Cloud + BD       │" << std::endl;
    std::cout << "│  TOTAL NŒUDS: " << allNodes.GetN() << std::endl;
    std::cout << "└─────────────────────────────────────────────────────────────┘" << std::endl;
    
    std::cout << "\n🌐 TOPOLOGIE RÉSEAU:" << std::endl;
    std::cout << "┌─ COUCHE LOCALE (WiFi 802.11ac dans chaque région)" << std::endl;
    std::cout << "│  • ASR ←→ Centre de Santé [192.168.X.0/24]" << std::endl;
    std::cout << "├─ COUCHE RÉGIONALE (P2P 100Mbps)" << std::endl;
    std::cout << "│  • Centre ←→ Edge Server Local [10.1.X.0/24]" << std::endl;
    std::cout << "├─ BACKBONE NATIONAL (1Gbps, 5ms latence)" << std::endl;
    std::cout << "│  • Edge Locaux ←→ Edge Hub Douala" << std::endl;
    std::cout << "│  • Edge Hub Douala ←→ Edge Hub Yaoundé" << std::endl;
    std::cout << "│  • Edge Hub Yaoundé ←→ Cloud IA + Base de Données" << std::endl;
    std::cout << "└─ INTERCONNEXION CLOUD (1Gbps)" << std::endl;
    
    std::cout << "\n📤 FLUX DE DONNÉES MONTANTS:" << std::endl;
    std::cout << "┌─ Niveau 1: Collecte Locale" << std::endl;
    std::cout << "│  " << totalAsr << " ASR → " << totalHealth << " Centres (intervalle: 0.8-1.5s)" << std::endl;
    std::cout << "├─ Niveau 2: Aggregation Régionale" << std::endl;
    std::cout << "│  Centres → Cloud IA via Edge (intervalle: 1.5-2.0s)" << std::endl;
    std::cout << "├─ Niveau 3: Chemins Critiques Directs" << std::endl;
    std::cout << "│  8 ASR prioritaires → Cloud IA DIRECT (intervalle: 0.8s)" << std::endl;
    std::cout << "└─ Niveau 4: Archivage" << std::endl;
    std::cout << "    Cloud IA → Base de Données (intervalle: 2.0s)" << std::endl;
    
    std::cout << "\n📥 FLUX DE DONNÉES DESCENDANTS (Diagnostics IA):" << std::endl;
    std::cout << "└─ Cloud IA → Tous les Centres Régionaux (intervalle: 1.8s)" << std::endl;
    
    std::cout << "\n⏱️  PARAMÈTRES DE SIMULATION:" << std::endl;
    std::cout << "│  • Durée: " << simulationTime << " secondes" << std::endl;
    std::cout << "│  • Trafic: UDP Echo (adapté telémédecine)" << std::endl;
    std::cout << "│  • Payload: 256-1024 octets par paquet" << std::endl;
    std::cout << "│  • Parallélisation: Communications simultanées régionales" << std::endl;
    
    std::cout << "\n📁 SORTIES:" << std::endl;
    std::cout << "│  Animation: /home/rostant/Desktop/ns-3-allinone/ns-3.46.1/build/telemed-cameroon-national.xml" << std::endl;
    std::cout << "│  Visualiser: ./NetAnim telemed-cameroon-national.xml" << std::endl;
    
    std::cout << "\n" << std::string(70, '=') << std::endl;
    std::cout << "✅ SIMULATION TERMINÉE AVEC SUCCÈS" << std::endl;
    std::cout << std::string(70, '=') << std::endl;

    return 0;
}
