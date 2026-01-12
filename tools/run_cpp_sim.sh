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
  # Try to auto-detect NS3_DIR by looking for a waf file in common locations, prefer $HOME
  echo "NS3_DIR not set, scanning common locations under $HOME and Downloads..."
  wafpath=""
  # look for ns-3 or ns-allinone installations under $HOME first
  while IFS= read -r -d '' candidate; do
    wafpath=$(find "$candidate" -maxdepth 3 -type f -name waf 2>/dev/null | grep -E '/ns-3[^/]*' | head -n1 || true)
    [ -n "$wafpath" ] && break
    wafpath=$(find "$candidate" -maxdepth 3 -type f -name waf 2>/dev/null | head -n1 || true)
    [ -n "$wafpath" ] && break
  done < <(printf "%s\0" "$HOME" "$HOME/ns-*" "$HOME/ns-allinone*" "$HOME/Downloads/ns-*" 2>/dev/null)

  if [ -z "$wafpath" ]; then
    # last resort: try the parent project paths (repo sibling)
    wafpath=$(find "$PWD" -maxdepth 3 -type f -name waf 2>/dev/null | head -n1 || true)
  fi

  if [ -n "$wafpath" ]; then
    candidate_dir=$(dirname "$wafpath")
    # prefer the ns-3 root folder (waf may be inside a subdir); try parent
    if [ -d "$candidate_dir/scratch" ] || [ -f "$candidate_dir/wscript" ] || [ -d "$candidate_dir/src" ]; then
      NS3_DIR="$candidate_dir"
    else
      # try parent
      parent=$(dirname "$candidate_dir")
      if [ -d "$parent/scratch" ] || [ -f "$parent/wscript" ] || [ -d "$parent/src" ]; then
        NS3_DIR="$parent"
      else
        NS3_DIR="$candidate_dir"
      fi
    fi
    echo "Auto-detected NS3_DIR=$NS3_DIR"
  else
    echo "Please set NS3_DIR to your ns-3 installation root (where ./waf is located). Tried auto-detection under $HOME and Downloads and failed." >&2
    exit 4
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
