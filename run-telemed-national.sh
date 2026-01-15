#!/bin/bash

# =============================================================================
# SCRIPT DE LANCEMENT SIMULATION TÉLÉMÉDECINE CAMEROUN NATIONALE
# Version: 2.0 - Multi-régions (8 régions)
# Date: 15 janvier 2026
# =============================================================================

set -e

WORKSPACE="/home/rostant/Desktop/ns-3-allinone/ns-3.46.1"
SIMULATION_NAME="telemed-cameroon-national"
BUILD_DIR="$WORKSPACE/build"
XML_OUTPUT="$BUILD_DIR/$SIMULATION_NAME.xml"
NETANIM_PATH="/home/rostant/Desktop/ns-3-allinone/netanim/NetAnim"

echo "═════════════════════════════════════════════════════════════════════"
echo "   SIMULATION TÉLÉMÉDECINE CAMEROUN NATIONALE - LANCEMENT"
echo "═════════════════════════════════════════════════════════════════════"
echo ""
echo "📍 Workspace: $WORKSPACE"
echo "🎯 Simulation: $SIMULATION_NAME"
echo "📊 Regions: 8 (Centre, Littoral, Ouest, Nord-Ouest, Adamaoua, Nord, Est, Sud)"
echo "🖥️  Noeuds totaux: 36 (16 ASR + 10 Centres + 8 Edge + 2 Centraux)"
echo "⏱️  Durée: 40 secondes"
echo ""

# Demander si l'utilisateur veut compiler ou juste exécuter
echo "Options disponibles:"
echo "  1) Compiler et exécuter la simulation"
echo "  2) Exécuter sans recompiler"
echo "  3) Compiler seulement"
echo "  4) Afficher l'animation existante"
echo ""
read -p "Choisir une option (1-4): " option

case $option in
    1)
        echo ""
        echo "🔨 Compilation et exécution..."
        cd "$WORKSPACE"
        python3 ns3 run $SIMULATION_NAME
        echo ""
        echo "✅ Simulation terminée!"
        echo "📁 Fichier d'animation: $XML_OUTPUT"
        echo ""
        read -p "Voulez-vous visualiser l'animation? (y/n): " view_anim
        if [ "$view_anim" == "y" ] || [ "$view_anim" == "Y" ]; then
            if [ -f "$NETANIM_PATH" ]; then
                echo "🎬 Lancement NetAnim..."
                "$NETANIM_PATH" "$XML_OUTPUT" &
            else
                echo "⚠️  NetAnim non trouvé à: $NETANIM_PATH"
                echo "📂 Fichier d'animation disponible à: $XML_OUTPUT"
            fi
        fi
        ;;
    2)
        echo ""
        echo "▶️  Exécution..."
        cd "$WORKSPACE"
        python3 ns3 run $SIMULATION_NAME
        echo ""
        echo "✅ Simulation terminée!"
        echo "📁 Fichier d'animation: $XML_OUTPUT"
        ;;
    3)
        echo ""
        echo "🔨 Compilation seule..."
        cd "$WORKSPACE"
        python3 ns3 build $SIMULATION_NAME
        echo ""
        echo "✅ Compilation terminée!"
        ;;
    4)
        if [ -f "$XML_OUTPUT" ]; then
            if [ -f "$NETANIM_PATH" ]; then
                echo "🎬 Lancement NetAnim..."
                "$NETANIM_PATH" "$XML_OUTPUT" &
            else
                echo "⚠️  NetAnim non trouvé"
                echo "📂 Fichier disponible à: $XML_OUTPUT"
            fi
        else
            echo "❌ Aucune animation trouvée. Exécutez d'abord la simulation."
        fi
        ;;
    *)
        echo "❌ Option invalide!"
        exit 1
        ;;
esac

echo ""
echo "═════════════════════════════════════════════════════════════════════"
echo ""
echo "📖 DOCUMENTATION:"
echo "   • Audit technique: AUDIT_SIMULATION_NATIONAL.md"
echo "   • Code source: scratch/$SIMULATION_NAME.cc"
echo "   • Sortie animation: $XML_OUTPUT"
echo ""
echo "═════════════════════════════════════════════════════════════════════"
