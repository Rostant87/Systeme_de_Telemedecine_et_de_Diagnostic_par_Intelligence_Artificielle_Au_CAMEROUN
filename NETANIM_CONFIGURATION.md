# Configuration NetAnim - Visualisation Progressive des Paquets

## Problème

Par défaut, NetAnim affiche les paquets qui "sautent" d'un nœud à l'autre au lieu de montrer un déplacement progressif.

## Solution

Le code a été amélioré pour mieux afficher les paquets en mouvement. Voici comment optimiser la visualisation:

## Configuration dans NetAnim GUI

Après que NetAnim se lance, appliquez ces paramètres:

### 1. Ralentir l'animation

Menu: **Simulation → Pause on first packet**
- Permet de voir chaque paquet individuellement

### 2. Ajuster la vitesse de lecture

Menu: **View → Speed**
- Réduire à 0.5x ou 0.1x pour voir le mouvement progressif
- Permet d'observer le déplacement des paquets entre les nœuds

### 3. Mode de visualisation des paquets

Menu: **View → Show Metadata**
- Affiche les informations des paquets en transit
- Montre l'origine et la destination de chaque paquet

### 4. Couleurs et styles

Menu: **View → Packet Animation**
- Affiche les trajectoires des paquets
- Chaque région a une couleur distinctive

## Interprétation de l'animation

Après lancement:

1. **Paquets locaux (WiFi)** - Apparaissent en vert/couleur régionale
   - Se déplacent entre ASR et Centres de Santé
   - Mouvement visible dans chaque région

2. **Paquets régionaux (P2P)** - Apparaissent en bleu/orange
   - Se déplacent des Centres vers les Edge Servers
   - Trajet inter-régional

3. **Paquets nationaux (Backbone)** - Apparaissent en rouge
   - Se déplacent entre Edge Hubs et Cloud
   - Trajectoires longues (Yaoundé ↔ Douala ↔ Autres régions)

## Paramètres du Code Source

Les paramètres suivants contrôlent l'animation:

```cpp
// Limiter le nombre de paquets par trace (pour éviter surcharge)
anim.SetMaxPktsPerTraceFile(500000);

// Intervalles d'envoi (en secondes)
// Plus petit intervalle = plus de paquets visibles
// Plus grand intervalle = meilleure visibilité de chaque paquet

// ASR → Centres: 1.2s + offset
// Centres → Cloud: 1.5s + offset
// Direct: 0.8s
// Cloud → BD: 2.0s
// Descente: 1.8s
```

## Commandes rapides

Pour relancer la simulation avec output:

```bash
cd /home/rostant/Systeme_de_Telemedecine_et_de_Diagnostic_par_Intelligence_Artificielle
./lancer-simulation.sh run
```

Pour visualiser:

```bash
./lancer-simulation.sh visualize
```

Puis dans NetAnim:
1. Appuyez sur Play (bouton lecture)
2. Réduisez la vitesse à 0.1x
3. Observez les paquets se déplacer progressivement

## Observations attendues

- Vous devriez voir les paquets faire un chemin progressif
- Les paquets ne disparaissent/réapparaissent pas instantanément
- Le déplacement suit les liaisons réseau (WiFi local → P2P régional → Backbone national)
- Les couleurs différentes indiquent les types de flux:
  - Vert/Couleur régionale: Flux local
  - Bleu: Flux régional
  - Rouge: Flux national/backbone
  - Jaune: Flux critique direct (ASR → Cloud)
