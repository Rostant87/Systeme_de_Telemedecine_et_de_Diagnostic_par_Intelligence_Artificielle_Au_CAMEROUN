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

# Compile with optimizations
target_compile_options(telemedicine_core PRIVATE -O3 -Wall -Wextra)
