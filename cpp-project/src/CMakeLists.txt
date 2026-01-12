cmake_minimum_required(VERSION 3.16)

set(SOURCES
    diagnostic_engine.cpp
    dme_system.cpp
    chatbot_engine.cpp
    network_sim.cpp
)

set(HEADERS
    diagnostic_engine.h
    dme_system.h
    chatbot_engine.h
    network_sim.h
)

# Create library for core modules
add_library(telemedicine_core STATIC ${SOURCES} ${HEADERS})

target_include_directories(telemedicine_core PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}
)

# Find nlohmann_json
find_package(nlohmann_json 3.11.0 REQUIRED)
target_link_libraries(telemedicine_core PUBLIC nlohmann_json::nlohmann_json)

# Find Qt6 for any GUI components
find_package(Qt6 COMPONENTS Core Gui Widgets REQUIRED)
target_link_libraries(telemedicine_core PUBLIC
    Qt6::Core
    Qt6::Gui
    Qt6::Widgets
)
