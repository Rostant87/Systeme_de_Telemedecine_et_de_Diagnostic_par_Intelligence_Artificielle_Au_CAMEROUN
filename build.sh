#!/bin/bash

# Telemedicine C++ Project - Build Script
# Supports: Linux, macOS, Windows (Git Bash)

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BUILD_DIR="${PROJECT_ROOT}/cpp-project/build"
BUILD_TYPE="${1:-Release}"

echo "=========================================="
echo "  Telemedicine C++ Project Build"
echo "=========================================="
echo ""
echo "Build Type: $BUILD_TYPE"
echo "Project Root: $PROJECT_ROOT"
echo ""

# Check for required tools
echo "Checking dependencies..."
for tool in cmake g++ make; do
    if ! command -v $tool &> /dev/null; then
        echo "❌ Error: $tool is not installed"
        exit 1
    fi
done
echo "✓ All dependencies found"
echo ""

# Create build directory
mkdir -p "$BUILD_DIR"
cd "$BUILD_DIR"

# Configure with CMake
echo "Configuring CMake..."
cmake -DCMAKE_BUILD_TYPE="$BUILD_TYPE" \
       -DBUILD_SERVER=OFF \
       ..

echo ""
echo "Building project..."
cmake --build . --config "$BUILD_TYPE" -j$(nproc 2>/dev/null || echo 4)

echo ""
echo "=========================================="
echo "✓ Build completed successfully!"
echo "=========================================="
echo ""
echo "Run the application:"
echo "  $BUILD_DIR/telemedicine_app"
echo ""
echo "Build server with REST API:"
echo "  cd $BUILD_DIR"
echo "  cmake -DBUILD_SERVER=ON .."
echo "  cmake --build ."
echo ""
