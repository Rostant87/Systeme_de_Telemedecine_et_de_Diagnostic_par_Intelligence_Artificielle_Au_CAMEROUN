#!/bin/bash

echo "═══════════════════════════════════════════════════════════════════"
echo "  VÉRIFICATION AVANT PUSH - SIMULATION TÉLÉMÉDECINE CAMEROUN"
echo "═══════════════════════════════════════════════════════════════════"
echo ""

CHECKS_PASSED=0
CHECKS_TOTAL=0

check() {
    CHECKS_TOTAL=$((CHECKS_TOTAL + 1))
    if eval "$1"; then
        echo "✅ $2"
        CHECKS_PASSED=$((CHECKS_PASSED + 1))
    else
        echo "❌ $2"
    fi
}

echo "📋 VÉRIFICATIONS EN COURS..."
echo ""

check "[ -d '.git' ]" "Repository Git initialisé"
check "[ -f 'scratch/telemed-cameroon-national.cc' ]" "Code source présent"
check "[ -f 'README.md' ]" "README principal présent"
check "[ -f 'AUDIT_SIMULATION_NATIONAL.md' ]" "Audit technique présent"
check "[ -f 'CHECKLIST_PERFECTION.md' ]" "Checklist de perfection présente"
check "[ -f 'run-telemed-national.sh' ]" "Script de lancement présent"
check "[ -d 'build' ]" "Répertoire build présent"
check "[ -f 'build/telemed-cameroon-national.xml' ]" "Fichier animation présent"

echo ""
echo "📊 STATISTIQUES FICHIERS"
echo "─────────────────────────────────────────────────────────────────"

FILE_COUNT=$(find . -type f | grep -E "\.(cc|md|sh|txt)$" | wc -l)
DIR_COUNT=$(find . -type d | wc -l)
TOTAL_SIZE=$(du -sh . | awk '{print $1}')

echo "Fichiers importants: $FILE_COUNT"
echo "Répertoires: $DIR_COUNT"
echo "Taille totale: $TOTAL_SIZE"

echo ""
echo "🔗 VÉRIFICATION GIT"
echo "─────────────────────────────────────────────────────────────────"

git log --oneline -n 1
git remote -v | head -2

echo ""
echo "📈 RÉSULTAT VÉRIFICATION"
echo "─────────────────────────────────────────────────────────────────"

if [ $CHECKS_PASSED -eq $CHECKS_TOTAL ]; then
    echo "✅ TOUS LES TESTS PASSÉS ($CHECKS_PASSED/$CHECKS_TOTAL)"
    echo ""
    echo "🚀 PRÊT POUR PUSH!"
    echo ""
    echo "Commande: git push origin master --force-with-lease"
    exit 0
else
    echo "❌ CERTAINS TESTS ONT ÉCHOUÉ ($CHECKS_PASSED/$CHECKS_TOTAL)"
    echo ""
    echo "Veuillez vérifier les fichiers manquants."
    exit 1
fi
