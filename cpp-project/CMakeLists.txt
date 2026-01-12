cmake_minimum_required(VERSION 3.16)
project(TelemedicineDiagnosticsAI CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Optional: Find Qt components (for GUI)
find_package(Qt6 COMPONENTS Core Gui Widgets Network QUIET)

# Optional: Find TensorFlow Lite (for AI diagnostics)
find_package(TensorFlowLite QUIET)

# Add subdirectories
add_subdirectory(src)

# Only add server if building
option(BUILD_SERVER "Build REST API server with Crow" OFF)
if(BUILD_SERVER)
    add_subdirectory(server)
endif()

# Main application (console version without Qt)
add_executable(telemedicine_app
    main.cpp
)

target_link_libraries(telemedicine_app
    PRIVATE
    telemedicine_core
)

# Compile with optimizations
target_compile_options(telemedicine_app PRIVATE -O3 -Wall -Wextra)

# Optional: link TensorFlow Lite if available
if(TensorFlowLite_FOUND)
    target_link_libraries(telemedicine_app PRIVATE TensorFlowLite::TensorFlowLite)
    target_compile_definitions(telemedicine_app PRIVATE USE_TFLITE)
endif()
