.PHONY: build clean run test help

help:
	@echo "╔════════════════════════════════════════════════════════╗"
	@echo "║    🔥 Telemedicine System - C++ ONLY                  ║"
	@echo "╚════════════════════════════════════════════════════════╝"
	@echo ""
	@echo "Commandes disponibles:"
	@echo "  make build     - Compiler l'application C++"
	@echo "  make run       - Exécuter l'application"
	@echo "  make test      - Tester l'application"
	@echo "  make clean     - Nettoyer les artefacts"
	@echo "  make help      - Afficher ce message"
	@echo ""
	@echo "Exemples:"
	@echo "  make build && make run"
	@echo "  make clean"

build:
	@echo "Compilation de l'application C++..."
	cd cpp-project && bash build.sh

run: build
	@echo "Exécution de l'application..."
	cpp-project/build/telemedicine_app

test: build
	@echo "Tests..."
	cpp-project/build/telemedicine_app | grep "All modules initialized"

clean:
	@echo "Nettoyage des artefacts..."
	rm -rf cpp-project/build
	@echo "✓ Nettoyage terminé"

.DEFAULT_GOAL := help
