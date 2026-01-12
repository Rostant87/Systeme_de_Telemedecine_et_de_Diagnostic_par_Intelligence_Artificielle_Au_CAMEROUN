#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 path/to/sim.cc"
  echo "Requires NS3_DIR environment variable pointing to your ns-3 installation (where ./waf lives)."
  exit 2
fi

SIM="$1"

if [ ! -f "$SIM" ]; then
  echo "File not found: $SIM"
  exit 3
fi

if [ -z "${NS3_DIR:-}" ]; then
  # Try to auto-detect NS3_DIR by looking for a waf file in common locations
  for candidate in "$HOME/ns-3-dev" "$HOME/ns-3-allinone" "$HOME/ns-allinone*" "$HOME/Downloads/ns-*" "$PWD/.."; do
    [ -z "$candidate" ] && continue
    if [ -f "$candidate/waf" ]; then
      NS3_DIR="$candidate"
      break
    fi
    # sometimes waf is located one level deeper
    if [ -f "$candidate/ns-3*/waf" ]; then
      NS3_DIR="$candidate"
      break
    fi
  done
  if [ -z "${NS3_DIR:-}" ]; then
    echo "Please set NS3_DIR to your ns-3 installation root (where ./waf is located). Tried auto-detection and failed." >&2
    exit 4
  else
    echo "Auto-detected NS3_DIR=$NS3_DIR"
  fi
fi

if [ ! -f "$NS3_DIR/waf" ]; then
  echo "waf not found in $NS3_DIR. Ensure NS3_DIR is correct and ns-3 is built."
  exit 5
fi

echo "Copying $SIM to $NS3_DIR/scratch/"
cp "$SIM" "$NS3_DIR/scratch/"

pushd "$NS3_DIR" >/dev/null
echo "Running: ./waf --run \"scratch/$(basename "$SIM")\""
./waf --run "scratch/$(basename "$SIM")"
popd >/dev/null

# After run, anim.xml is usually in ns-3 root
if [ -f "$NS3_DIR/anim.xml" ]; then
  if command -v netanim >/dev/null 2>&1; then
    echo "Opening NetAnim with $NS3_DIR/anim.xml"
    netanim "$NS3_DIR/anim.xml" &
  else
    echo "NetAnim not found in PATH. Please install or add it to PATH to open $NS3_DIR/anim.xml"
  fi
else
  echo "anim.xml not found in $NS3_DIR after running the simulation. Check simulation output for errors."
fi
