# Lancer la Simulation Télémédecine Cameroun

## Prérequis

- Ubuntu ou Linux
- ns-3.46.1 installé à `/home/rostant/Desktop/ns-3-allinone/ns-3.46.1`
- NetAnim (inclus avec ns-3 - aucune installation nécessaire)

## Utilisation

### Option 1: Tout en une seule commande

Compile, exécute et ouvre NetAnim:

```bash
./lancer-simulation.sh
```

### Option 2: Commandes individuelles

**Seulement compiler:**
```bash
./lancer-simulation.sh compile
```

**Seulement exécuter:**
```bash
./lancer-simulation.sh run
```

**Seulement visualiser:**
```bash
./lancer-simulation.sh visualize
```

## Résultats

La simulation génère:

- `simulation/telemed-cameroon-national.cc` - Code source C++
- `simulation/output/telemed-cameroon-national.xml` - Animation NetAnim (8.0 MB)

La simulation montre:
- 36 nœuds réseau
- 8 régions du Cameroun (couleurs différentes)
- 40 secondes d'animation
- ~500,000 paquets traités

## Dépannage

**NetAnim ne se lance pas:**
```bash
# Lancer NetAnim manuellement
/home/rostant/Desktop/ns-3-allinone/netanim/build/netanim simulation/output/telemed-cameroon-national.xml
```

**Erreur de compilation:**
```bash
# Reconstruire
./lancer-simulation.sh compile

# Ou manuellement
cd /home/rostant/Desktop/ns-3-allinone/ns-3.46.1
./ns3 clean
./ns3 build scratch/telemed-cameroon-national
```

**Aucun fichier XML généré:**
```bash
# Vérifier que la simulation a bien s'exécutée
./lancer-simulation.sh run

# Vérifier le fichier
ls -lh simulation/output/telemed-cameroon-national.xml
```

## Fichier source

Le code source se trouve à:
```
simulation/telemed-cameroon-national.cc
```

C'est une simulation ns-3 complète de l'infrastructure télémédecine nationale du Cameroun avec:
- 8 régions
- Architecture multi-niveaux (WiFi + P2P + Backbone 1Gbps)
- 40+ flux de données
- 2700+ lignes de documentation

