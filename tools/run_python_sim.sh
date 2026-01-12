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
  # First pass: look specifically for a proper ns package (ns/__init__.py)
  for base in "$HOME"/ns-* "$HOME"/ns-allinone* "$HOME"/Downloads/ns-* "$PWD"/ns-3; do
    [ -z "$base" ] && continue
    if [ -f "$base/build/bindings/python/ns/__init__.py" ]; then
      PYDIR="$base/build/bindings/python"
      break
    fi
    if [ -f "$base/bindings/python/ns/__init__.py" ]; then
      PYDIR="$base/bindings/python"
      break
    fi
  done
  # Second pass: fallbacks if no explicit ns package was found
  if [ -z "$PYDIR" ]; then
    for base in "$HOME"/ns-* "$HOME"/ns-allinone* "$HOME"/Downloads/ns-* "$PWD"/ns-3; do
      [ -z "$base" ] && continue
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

run_with_python(){
  PYEXEC="$1"
  "$PYEXEC" "$SIM"
}

# Check whether Cppyy is available; if not, try to create/use a local venv and install it there.
check_cppyy_and_run(){
  # quick import test
  if PYTHONPATH="$PYDIR" LD_LIBRARY_PATH="$LIBDIR" python3 -c "import cppyy" 2>/dev/null; then
    run_with_python python3 && return 0
  fi

  VENV_DIR="$PWD/.ns3-venv"
  if [ -x "$VENV_DIR/bin/python" ]; then
    echo "Using existing venv at $VENV_DIR"
  else
    echo "Creating venv at $VENV_DIR to install required Python packages (cppyy)"
    python3 -m venv "$VENV_DIR"
    if [ ! -x "$VENV_DIR/bin/python" ]; then
      echo "Failed to create venv. Please install cppyy in your environment or use system packaging." >&2
      return 2
    fi
    echo "Installing cppyy in the venv (this may take a while)..."
    "$VENV_DIR/bin/pip" install --upgrade pip setuptools wheel >/dev/null
    if ! "$VENV_DIR/bin/pip" install cppyy >/dev/null; then
      echo "Failed to install cppyy into venv. Inspect $VENV_DIR for details." >&2
      return 2
    fi
  fi

  # Run with venv python
  PYEXEC="$VENV_DIR/bin/python"
  PYTHONPATH="$PYDIR" LD_LIBRARY_PATH="$LIBDIR" "$PYEXEC" "$SIM"
  return $?
}

if check_cppyy_and_run; then
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
