#include <QApplication>
#include <QMainWindow>
#include <QWidget>
#include <QVBoxLayout>
#include <QLabel>
#include <QPushButton>
#include <iostream>
#include <thread>
#include <memory>

// Forward declaration of the Crow server
namespace telemedicine {
    class CrowServer;
}

// Main window class (stub for now)
class MainWindow : public QMainWindow {
    Q_OBJECT
public:
    MainWindow(QWidget *parent = nullptr) : QMainWindow(parent) {
        setWindowTitle("Telemedicine Diagnostic System");
        setGeometry(100, 100, 1200, 800);

        // Create central widget
        QWidget *centralWidget = new QWidget(this);
        setCentralWidget(centralWidget);

        // Create layout
        QVBoxLayout *layout = new QVBoxLayout(centralWidget);

        // Add welcome label
        QLabel *welcomeLabel = new QLabel("Welcome to Telemedicine System v1.0", this);
        welcomeLabel->setStyleSheet("QLabel { font-size: 18px; font-weight: bold; }");
        layout->addWidget(welcomeLabel);

        // Add info label
        QLabel *infoLabel = new QLabel(
            "Features:\n"
            "• Diagnostic AI: Analyze medical images\n"
            "• DME System: Manage patient records\n"
            "• Medical Chatbot: Get medical advice\n"
            "• Network Simulation: Visualize mesh networks\n"
            "\nServer running on port 3001",
            this
        );
        layout->addWidget(infoLabel);

        // Add buttons for each module
        QPushButton *diagnosticBtn = new QPushButton("Diagnostic Module", this);
        QPushButton *dmeBtn = new QPushButton("DME System", this);
        QPushButton *chatbotBtn = new QPushButton("Medical Chatbot", this);
        QPushButton *networkBtn = new QPushButton("Network Simulation", this);

        layout->addWidget(diagnosticBtn);
        layout->addWidget(dmeBtn);
        layout->addWidget(chatbotBtn);
        layout->addWidget(networkBtn);

        layout->addStretch();
    }
};

int main(int argc, char *argv[]) {
    std::cout << "Starting Telemedicine System..." << std::endl;

    // Initialize Qt Application
    QApplication app(argc, argv);

    // Create and show main window
    MainWindow mainWindow;
    mainWindow.show();

    // TODO: Start Crow server in separate thread
    // std::thread serverThread([]() {
    //     auto server = std::make_unique<telemedicine::CrowServer>();
    //     server->run(3001);
    // });
    // serverThread.detach();

    std::cout << "Telemedicine System initialized" << std::endl;
    std::cout << "Server would be running on http://localhost:3001" << std::endl;

    return app.exec();
}
