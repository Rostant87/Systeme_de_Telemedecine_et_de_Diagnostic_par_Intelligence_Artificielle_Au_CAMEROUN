cmake_minimum_required(VERSION 3.16)
project(TelemedicineDiagnosticsAI CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Find Qt components
find_package(Qt6 COMPONENTS Core Gui Widgets Network REQUIRED)

# Find TensorFlow Lite (optional, for AI diagnostics)
find_package(TensorFlowLite QUIET)

# Add subdirectories
add_subdirectory(src)
add_subdirectory(server)

# Main application
add_executable(telemedicine_app
    main.cpp
)

target_link_libraries(telemedicine_app
    PRIVATE
    telemedicine_ui
    telemedicine_server
    Qt6::Core
    Qt6::Gui
    Qt6::Widgets
    Qt6::Network
)

# Optional: link TensorFlow Lite if available
if(TensorFlowLite_FOUND)
    target_link_libraries(telemedicine_app PRIVATE TensorFlowLite::TensorFlowLite)
    target_compile_definitions(telemedicine_app PRIVATE USE_TFLITE)
endif()
