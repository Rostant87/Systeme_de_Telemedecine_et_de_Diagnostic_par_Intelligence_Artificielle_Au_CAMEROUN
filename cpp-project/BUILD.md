# Telemedicine C++ Project - Build & Deployment Guide

## Overview

This document provides detailed instructions for building, testing, and deploying the Telemedicine Diagnostic System C++ application.

## Development Environment Setup

### Linux (Ubuntu 20.04 / 22.04 LTS)

```bash
# Update package manager
sudo apt-get update

# Install build essentials
sudo apt-get install -y build-essential cmake ninja-build git

# Install Qt6
sudo apt-get install -y qt6-base-dev qt6-tools-dev

# Install dependencies
sudo apt-get install -y \
    nlohmann-json3-dev \
    libssl-dev \
    pkg-config

# Optional: Install IDE
sudo apt-get install -y qtcreator
```

### macOS

```bash
# Install Homebrew if not already installed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install dependencies
brew install cmake ninja qt@6 nlohmann-json

# Add to PATH if needed
export PATH="/usr/local/opt/qt@6/bin:$PATH"
```

### Windows (MSVC 2019+)

1. **Install Visual Studio Community** with C++ workload
2. **Install Qt Online Installer** from https://www.qt.io/download
   - Select Qt 6.x for MSVC 2019 (64-bit)
3. **Install CMake** from https://cmake.org/download/
4. **Install vcpkg** (optional, for dependency management):
   ```cmd
   git clone https://github.com/Microsoft/vcpkg.git
   cd vcpkg
   .\bootstrap-vcpkg.bat
   ```

## Building the Project

### Method 1: Command Line (All Platforms)

```bash
# Clone or navigate to project
cd cpp-project

# Create build directory
mkdir build
cd build

# Configure project
cmake -DCMAKE_BUILD_TYPE=Release ..

# Build
cmake --build . --config Release -j$(nproc)

# Run
./bin/telemedicine_app
```

### Method 2: Qt Creator IDE (Recommended for GUI development)

1. **Open Project**:
   - File → Open File or Project
   - Select `cpp-project/CMakeLists.txt`

2. **Configure Build Kit**:
   - Select Qt 6.x kit
   - Set build directory (e.g., `build-release`)

3. **Build & Run**:
   - Ctrl+B to build
   - Ctrl+R to run

### Method 3: Visual Studio (Windows)

```cmd
cd cpp-project
mkdir build
cd build
cmake -G "Visual Studio 16 2019" -DCMAKE_PREFIX_PATH="C:\Qt\6.x\msvc2019_64" ..
cmake --build . --config Release -j4
bin\Release\telemedicine_app.exe
```

## Build Configuration Options

### Standard Release Build
```bash
cmake -DCMAKE_BUILD_TYPE=Release -DCMAKE_INSTALL_PREFIX=/usr/local ..
```

### Debug Build with Symbols
```bash
cmake -DCMAKE_BUILD_TYPE=Debug ..
```

### Minimal Build (no tests)
```bash
cmake -DCMAKE_BUILD_TYPE=Release -DBUILD_TESTS=OFF ..
```

### With GPU Support (requires TensorFlow Lite)
```bash
cmake -DCMAKE_BUILD_TYPE=Release -DTFLITE_ENABLE_GPU=ON ..
```

## Compilation Flags

### Optimize for Performance
```bash
cmake -DCMAKE_BUILD_TYPE=Release \
      -DCMAKE_CXX_FLAGS="-O3 -march=native" \
      ..
```

### Enable All Warnings
```bash
cmake -DCMAKE_CXX_FLAGS="-Wall -Wextra -Wpedantic" ..
```

### Compile with Clang
```bash
cmake -DCMAKE_CXX_COMPILER=clang++ -DCMAKE_C_COMPILER=clang ..
```

## Dependency Management

### Using vcpkg (Windows/Linux)

```bash
# Install dependencies via vcpkg
vcpkg install nlohmann-json qt6

# Use in CMake
cmake -DCMAKE_TOOLCHAIN_FILE=/path/to/vcpkg/scripts/buildsystems/vcpkg.cmake ..
```

### Using Conda

```bash
# Create conda environment
conda create -n telemedicine-cpp -c conda-forge cmake ninja nlohmann_json

# Activate environment
conda activate telemedicine-cpp

# Build with conda environment active
mkdir build && cd build
cmake -DCMAKE_PREFIX_PATH=$CONDA_PREFIX ..
cmake --build .
```

## Building Individual Modules

### Build Core Library Only
```bash
cmake --build . --target telemedicine_core
```

### Build Server Only
```bash
cmake --build . --target telemedicine_server
```

### Build Tests Only
```bash
cmake --build . --target test
```

## Testing

### Run All Tests
```bash
cd build
ctest --output-on-failure
```

### Run Specific Test
```bash
ctest -R diagnostic_engine_test --output-on-failure
```

### Run Tests with Verbose Output
```bash
ctest -V --output-on-failure
```

### Generate Test Coverage Report
```bash
cmake -DCMAKE_BUILD_TYPE=Debug \
      -DENABLE_COVERAGE=ON ..
cmake --build .
ctest
gcovr -r . --print-summary
```

## Installation

### System-Wide Installation
```bash
sudo cmake --install build --config Release
```

### Custom Installation Directory
```bash
cmake --install build --config Release --prefix=/opt/telemedicine
```

### Create Portable Package
```bash
# Linux AppImage
cmake --build build --target package

# macOS DMG
cpack -G DragNDrop

# Windows NSIS Installer
cpack -G NSIS
```

## Runtime Configuration

### Setting Library Paths

**Linux/macOS:**
```bash
export LD_LIBRARY_PATH=/usr/local/lib:$LD_LIBRARY_PATH
export DYLD_LIBRARY_PATH=/usr/local/lib:$DYLD_LIBRARY_PATH
```

**Windows:**
```cmd
set PATH=C:\Qt\6.x\msvc2019_64\bin;%PATH%
```

### Crash Debugging

**Enable core dumps (Linux):**
```bash
ulimit -c unlimited
./bin/telemedicine_app
```

**Generate backtrace:**
```bash
gdb ./bin/telemedicine_app
(gdb) run
(gdb) bt
```

## Performance Profiling

### Using Linux Perf
```bash
perf record -g ./bin/telemedicine_app
perf report
```

### Using Valgrind
```bash
valgrind --leak-check=full \
         --show-leak-kinds=all \
         ./bin/telemedicine_app
```

### Using Qt Creator Profiler
1. Analyze → CPU Usage / Memory Analyzer
2. Start application from Qt Creator
3. Interact with application
4. View performance metrics

## Troubleshooting

### CMake Configuration Issues

**Qt6 not found:**
```bash
# Specify Qt path explicitly
cmake -DCMAKE_PREFIX_PATH=$(brew --prefix qt@6) ..
# or
cmake -DCMAKE_PREFIX_PATH=/usr/lib/cmake/Qt6 ..
```

**nlohmann/json not found:**
```bash
# Install json header-only library
sudo apt-get install nlohmann-json3-dev
# or
brew install nlohmann-json
```

### Compilation Errors

**Missing Qt headers:**
- Ensure Qt6 is fully installed
- Check Qt path matches CMake configuration

**Undefined references:**
- Rebuild clean: `cmake --build . --clean-first`
- Check all libraries are linked in CMakeLists.txt

**C++17 compatibility:**
- Ensure compiler supports C++17
- Update compiler if needed

### Runtime Issues

**Application won't start:**
```bash
# Check dependencies
ldd ./bin/telemedicine_app

# Run with verbose output
./bin/telemedicine_app --debug
```

**Memory issues:**
```bash
# Monitor memory usage
top -p $(pgrep telemedicine_app)

# Check for leaks
valgrind ./bin/telemedicine_app
```

## Docker Support

### Build Docker Image
```dockerfile
FROM ubuntu:22.04

# Install dependencies
RUN apt-get update && apt-get install -y \
    build-essential cmake \
    qt6-base-dev \
    nlohmann-json3-dev

# Copy source
COPY . /app
WORKDIR /app

# Build
RUN mkdir build && cd build && \
    cmake .. && \
    cmake --build . --config Release

# Run
ENTRYPOINT ["./build/bin/telemedicine_app"]
```

### Build and Run Docker
```bash
docker build -t telemedicine-cpp .
docker run --rm telemedicine-cpp
```

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Build & Test
on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-python@v2
      - name: Install dependencies
        run: |
          sudo apt-get update
          sudo apt-get install -y qt6-base-dev nlohmann-json3-dev
      - name: Build
        run: |
          mkdir build && cd build
          cmake .. && cmake --build .
      - name: Test
        run: cd build && ctest
```

## Performance Optimization

### Compiler Optimizations
```bash
# Maximum optimization
cmake -DCMAKE_BUILD_TYPE=Release \
      -DCMAKE_CXX_FLAGS="-O3 -march=native -flto" ..
```

### Link-Time Optimization (LTO)
```bash
cmake -DCMAKE_INTERPROCEDURAL_OPTIMIZATION=ON ..
```

### Static Linking
```bash
cmake -DBUILD_SHARED_LIBS=OFF \
      -DCMAKE_EXE_LINKER_FLAGS="-static" ..
```

## Deployment Checklist

- [ ] Build succeeds without warnings
- [ ] All tests pass
- [ ] Performance benchmarks acceptable
- [ ] Memory profiling shows no leaks
- [ ] Code coverage >80%
- [ ] Documentation updated
- [ ] Version number bumped
- [ ] Release notes prepared
- [ ] Binary tested on target platform
- [ ] Installation verified

## Useful Commands Reference

```bash
# Clean build
rm -rf build && mkdir build && cd build && cmake .. && cmake --build .

# Show build details
cmake --build . --verbose

# Package for distribution
cpack

# Generate documentation (if Doxygen installed)
doxygen Doxyfile
open html/index.html

# Format code (requires clang-format)
find src server -name "*.cpp" -o -name "*.h" | xargs clang-format -i

# Static analysis (requires cppcheck)
cppcheck --enable=all src server
```

## Support & Documentation

- **Qt Documentation**: https://doc.qt.io/qt-6/
- **CMake Guide**: https://cmake.org/cmake/help/latest/
- **Crow API**: https://crowcpp.org/
- **nlohmann/json**: https://nlohmann.github.io/json/
