cmake_minimum_required(VERSION 3.16)

set(SOURCES
    crow_server.cpp
)

# Create library for server
add_library(telemedicine_server STATIC ${SOURCES})

target_include_directories(telemedicine_server PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}
    ${CMAKE_CURRENT_SOURCE_DIR}/../src
)

# Find required packages
find_package(nlohmann_json 3.11.0 REQUIRED)

# Include Crow
set(CROW_INCLUDE_DIR "${CMAKE_SOURCE_DIR}/include")
target_include_directories(telemedicine_server PUBLIC ${CROW_INCLUDE_DIR})

# Link libraries
target_link_libraries(telemedicine_server
    PUBLIC
    telemedicine_core
    nlohmann_json::nlohmann_json
)
