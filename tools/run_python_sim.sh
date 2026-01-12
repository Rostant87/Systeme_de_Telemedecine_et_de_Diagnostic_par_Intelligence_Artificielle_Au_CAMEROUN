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

# If the user provided NS3_PYTHON_PATH, prefer it. Otherwise try to find common ns-3 python bindings.
if [ -n "${NS3_PYTHON_PATH:-}" ]; then
  PYDIR="$NS3_PYTHON_PATH"
else
  PYDIR=""
  for base in "$HOME"/ns-* "$HOME"/ns-allinone* "$HOME"/Downloads/ns-* "$PWD"/ns-3; do
    [ -z "$base" ] && continue
    # Prefer explicit ns package dir with __init__.py
    if [ -f "$base/build/bindings/python/ns/__init__.py" ]; then
      PYDIR="$base/build/bindings/python"
      break
    fi
    if [ -f "$base/bindings/python/ns/__init__.py" ]; then
      PYDIR="$base/bindings/python"
      break
    fi
    if [ -d "$base/bindings/python" ]; then
      PYDIR="$base/bindings/python"
      break
    fi
    if [ -d "$base/build/bindings/python" ]; then
      PYDIR="$base/build/bindings/python"
      break
    fi
    if [ -d "$base/build-support/pip-wheel" ]; then
      # pip-wheel may contain a top-level 'ns' directory
      PYDIR="$base/build-support/pip-wheel"
      break
    fi
  done
fi

if [ -n "$PYDIR" ]; then
  echo "Using ns-3 python bindings path: $PYDIR"
  export PYTHONPATH="$PYDIR${PYTHONPATH:+":$PYTHONPATH"}"
else
  echo "Warning: ns-3 python bindings not automatically found. If you have an ns-3 installation, set NS3_PYTHON_PATH to its bindings/python directory or build ns-3 with Python bindings." >&2
fi

# Try to find the corresponding ns-3 build lib directory (contains compiled .so libs)
LIBDIR=""
if [ -n "$PYDIR" ]; then
  # e.g., /home/user/ns-3-dev/bindings/python -> build/lib at /home/user/ns-3-dev/build/lib
  base_dir=$(dirname "$PYDIR")
  candidate="$base_dir/build/lib"
  if [ -d "$candidate" ]; then
    LIBDIR="$candidate"
  else
    # try one level up in case bindings path is slightly different
    candidate2="$base_dir/../build/lib"
    if [ -d "$candidate2" ]; then
      LIBDIR="$candidate2"
    fi
  fi
fi
if [ -n "$LIBDIR" ]; then
  echo "Using ns-3 build lib directory: $LIBDIR"
  export LD_LIBRARY_PATH="$LIBDIR${LD_LIBRARY_PATH:+":$LD_LIBRARY_PATH"}"
fi

if python3 "$SIM"; then
  echo "Execution finished"
else
  echo "Execution failed. Ensure ns-3 Python bindings are installed and PYTHONPATH is configured (try: export NS3_PYTHON_PATH=/path/to/ns-3/bindings/python)." >&2
fi

found=""
if [ -f anim.xml ]; then
  found="anim.xml"
fi
# search common ns-3 roots for anim.xml
for root in "$HOME"/ns-* "$HOME"/ns-allinone* "$HOME"/Downloads/ns-* "$PWD"/ns-3; do
  [ -z "$root" ] && continue
  if [ -f "$root/anim.xml" ]; then
    found="$root/anim.xml"
    break
  fi
done

if [ -n "$found" ]; then
  if command -v netanim >/dev/null 2>&1; then
    echo "Opening NetAnim with $found"
    netanim "$found" &
  else
    echo "NetAnim (netanim) not found in PATH. Please install NetAnim or add it to PATH to open $found"
  fi
else
  echo "anim.xml not found. If the simulation produced an anim file in the ns-3 root, try searching for it (e.g., 'find $HOME -name anim.xml')."
fi
