#!/bin/bash

# Script de lancement de la simulation télémédecine Cameroun
# Usage: ./lancer-simulation.sh [compile|run|visualize|all]

set -e

# Vérifier que ns-3 est accessible
NS3_PATH="/home/rostant/Desktop/ns-3-allinone/ns-3.46.1"

if [ ! -d "$NS3_PATH" ]; then
    echo "Erreur: ns-3 non trouvé à $NS3_PATH"
    exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SIMULATION_DIR="$SCRIPT_DIR/simulation"
OUTPUT_DIR="$SIMULATION_DIR/output"

mkdir -p "$OUTPUT_DIR"

# Fonction: Compiler
compile_simulation() {
    echo "Compilation de la simulation..."
    cd "$NS3_PATH"
    ./ns3 build scratch/telemed-cameroon-national
    echo "✓ Compilation réussie"
}

# Fonction: Exécuter
run_simulation() {
    echo "Exécution de la simulation..."
    cd "$NS3_PATH"
    ./ns3 run scratch/telemed-cameroon-national
    
    # Copier le fichier XML généré
    if [ -f "$NS3_PATH/build/telemed-cameroon-national.xml" ]; then
        cp "$NS3_PATH/build/telemed-cameroon-national.xml" "$OUTPUT_DIR/"
        echo "✓ Fichier animation copié dans: $OUTPUT_DIR/telemed-cameroon-national.xml"
    fi
}

# Fonction: Visualiser avec NetAnim
visualize_simulation() {
    XML_FILE="$OUTPUT_DIR/telemed-cameroon-national.xml"
    
    if [ ! -f "$XML_FILE" ]; then
        echo "Erreur: Fichier $XML_FILE non trouvé"
        echo "Exécutez d'abord: ./lancer-simulation.sh run"
        exit 1
    fi
    
    echo "Ouverture de NetAnim..."
    
    # Essayer plusieurs chemins possibles pour NetAnim
    if command -v NetAnim &> /dev/null; then
        NetAnim "$XML_FILE" &
    elif [ -f "$NS3_PATH/NetAnim" ]; then
        "$NS3_PATH/NetAnim" "$XML_FILE" &
    else
        NETANIM_PATH=$(find /usr -name "NetAnim" -type f 2>/dev/null | head -1)
        if [ -n "$NETANIM_PATH" ]; then
            "$NETANIM_PATH" "$XML_FILE" &
        else
            echo "NetAnim non trouvé"
            echo "Fichier disponible à: $XML_FILE"
            exit 1
        fi
    fi
    
    echo "✓ NetAnim lancé"
}

# Fonction: Tout faire
run_all() {
    compile_simulation
    echo ""
    run_simulation
    echo ""
    visualize_simulation
}

# Traiter les arguments
OPTION="${1:-all}"

case "$OPTION" in
    compile)
        compile_simulation
        ;;
    run)
        run_simulation
        ;;
    visualize)
        visualize_simulation
        ;;
    all)
        run_all
        ;;
    *)
        echo "Options: compile|run|visualize|all"
        ;;
esac
