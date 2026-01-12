#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 path/to/sim.py"
  exit 2
fi

SIM="$1"

if [ ! -f "$SIM" ]; then
  echo "File not found: $SIM"
  exit 3
fi

echo "Running Python simulation: $SIM"
if python3 "$SIM"; then
  echo "Execution finished"
else
  echo "Execution failed. Ensure ns-3 Python bindings are installed and PYTHONPATH is configured." >&2
fi

if [ -f anim.xml ]; then
  if command -v netanim >/dev/null 2>&1; then
    echo "Opening NetAnim with anim.xml"
    netanim anim.xml &
  else
    echo "NetAnim (netanim) not found in PATH. Please install NetAnim or add it to PATH to open anim.xml"
  fi
else
  echo "anim.xml not found in current directory. The simulation may have placed it elsewhere (e.g., ns-3 root). Search for anim.xml and open it with NetAnim."
fi
