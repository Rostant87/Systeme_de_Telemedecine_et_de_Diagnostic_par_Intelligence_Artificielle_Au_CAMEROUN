# 🏥 Système de Télémédecine et Diagnostic par Intelligence Artificielle
## Platform de Santé Numérique pour les Zones Rurales du Cameroun

**Version:** 1.0.0  
**Dernière mise à jour:** Janvier 2026  
**License:** MIT

---

## 📋 Table des matières
- [Description](#description)
- [Caractéristiques](#caractéristiques)
- [Architecture](#architecture)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Composants](#composants)
- [Technologies](#technologies)
- [Structure du Projet](#structure-du-projet)
- [Contribuer](#contribuer)

---

## 📖 Description

**Système de Télémédecine et Diagnostic par IA** est une plateforme de santé numérique conçue pour les zones rurales du Cameroun. Elle combine:

- 🤖 **Diagnostic IA**: Analyse d'images médicales par MobileNet/TensorFlow.js
- 🏥 **DME (Dossier Médical Électronique)**: Gestion centralisée des patients
- 💬 **Assistant IA Médical**: Chatbot bilingue FR/EN pour conseils santé
- 📊 **Dashboard**: Suivi réseau et statistiques
- 🌐 **P2P Sync**: Synchronisation décentralisée via mesh network
- 📱 **Mode Hors-Ligne**: Fonctionne sans connexion Internet

### Objectif Principal
Fournir des services de santé de qualité à distance aux populations des zones rurales camerounaises, réduire les délais de diagnostic et améliorer l'accès aux soins.

---

## ✨ Caractéristiques

### 🔍 Diagnostic IA Avancé
```
✓ Analyse 10 catégories médicales majeures
✓ Codes ICD officiels pour chaque diagnostic
✓ Tests recommandés (8-10 tests par condition)
✓ Dosages médicamenteux précis
✓ Protocoles basés MINSANTE Cameroun
✓ Support bilingue Français/Anglais
✓ Niveau de confiance IA avec barre visuelle
✓ Sauvegarder les diagnostics en DME
```

**Maladies couvertes:**
- 🦟 Paludisme (ICD: B54)
- 🔴 Dengue (ICD: A90)
- 🩹 Affections cutanées (ICD: L98.9)
- 👁️ Affections ophtalmologiques (ICD: H53.9)
- 🫁 Maladies respiratoires (ICD: J98.9)
- 🤰 Suivi prénatal (ICD: Z32)
- 🔬 VIH/SIDA (ICD: B20)
- 📊 Malnutrition (ICD: E46)
- 🩺 Diabète (ICD: E11)
- 💓 Hypertension (ICD: I10)

### 📋 DME (Dossier Médical Électronique)
```
✓ Création automatique ID patient (DME001, DME002...)
✓ Profil patient complet (nom, âge, sexe, village, pathologie)
✓ Historique consultations
✓ Suivi statut (Nouveau, En traitement, Suivi, Suivi prénatal)
✓ Recherche par ID, nom ou localité
✓ Export JSON pour partage
✓ Ouvrir dossier patient
✓ Synchronisation P2P automatique
```

### 💬 Assistant Médical IA
```
✓ Chat bilingue Français/Anglais
✓ Questions sur 7 sujets médicaux majeurs
✓ Réponses contextuelles intelligentes
✓ Assistance 24/7
✓ Base de données de protocoles de santé
```

### 📊 Dashboard Réseau
```
✓ Simulation réseau mesh
✓ Visualisation des nœuds (Mobile, Clinic, Gateway)
✓ Statistiques temps réel:
  - Connexions actives
  - Taux de synchronisation
  - État réseau
✓ Animation des flux de données
```

### 🔐 Sécurité
```
✓ Chiffrement AES-256
✓ Pas d'envoi de données au serveur
✓ Traitement local 100% confidentiel
✓ RGPD/données sensantes protégées
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│         APPLICATION WEB (React + Vite)                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ DiagnosticAI │  │ DMESystem    │  │ MedicalChat  │  │
│  │ (MobileNet)  │  │ (Patients)   │  │ (Chatbot AI) │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐                    │
│  │  Dashboard   │  │ NetworkSim   │                    │
│  │  (Statut)    │  │  (P2P Mesh)  │                    │
│  └──────────────┘  └──────────────┘                    │
│                                                         │
├─────────────────────────────────────────────────────────┤
│         AI Models & Libraries                           │
│  ├─ TensorFlow.js (tfjs)                              │
│  ├─ MobileNet V2                                       │
│  └─ Recharts (Visualisation)                          │
├─────────────────────────────────────────────────────────┤
│         Storage                                         │
│  ├─ localStorage (DME local)                           │
│  └─ SessionStorage (cache)                            │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Installation

### Prérequis
```bash
- Node.js ≥ 18.x
- npm ou yarn
- Navigateur moderne (Chrome, Firefox, Safari, Edge)
```

### Étapes d'installation

1. **Cloner le repository**
```bash
git clone https://github.com/[username]/Systeme_de_Telemedecine_et_Diagnostic_par_Intelligence_Artificielle.git
cd asr-mesh-network
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Démarrer le serveur de développement**
```bash
npm run dev
```
Application disponible sur: `http://localhost:5173/`

4. **Build pour production**
```bash
npm run build
```

5. **Prévisualiser la build**
```bash
npm run preview
```

---

## 💻 Utilisation

### Interface Principale
```
┌─────────────────────────────────────────┐
│ DASHBOARD MÉDICAL - Accueil Principal    │
├─────────────────────────────────────────┤
│ 📊 Statistiques DME                      │
│ 🔄 Synchronisation P2P (100%)           │
│ 🔒 Sécurité AES-256                     │
├─────────────────────────────────────────┤
│ 🔍 Diagnostic IA                        │
│ 📋 DME System                           │
│ 💬 Assistant Médical                    │
│ 📡 Simulation Réseau                    │
└─────────────────────────────────────────┘
```

### Workflow Diagnostic IA
```
1. Cliquer sur "Module Diagnostic IA"
2. Upload image médicale (JPEG, PNG)
3. IA analyse (5-10 secondes)
4. Affichage:
   - Diagnostic en FR et EN
   - Niveau d'urgence (URGENT/MODÉRÉ/FAIBLE)
   - Tests recommandés
   - Traitements proposés
   - Prévention
5. Cliquer "Enregistrer dans DME"
6. Confirmation + ID enregistrement
```

### Workflow DME
```
1. Accéder "Dossier Médical Électronique"
2. Rechercher ou créer nouveau patient:
   - ID auto-généré (DME001, DME002...)
   - Remplir: Nom, Âge, Sexe, Village, Pathologie
3. Cliquer "Créer DME"
4. Voir dans tableau
5. Ouvrir dossier complet
6. Exporter JSON si besoin
```

### Chat Assistant Médical
```
1. Accéder "Assistant Médical IA"
2. Tapez question sur:
   - Symptômes (fièvre, toux, etc.)
   - Maladies (paludisme, VIH, etc.)
   - Grossesse, nutrition, diabète...
3. IA répond en FR et EN automatiquement
```

---

## 🧩 Composants

### 1. **DiagnosticAI.jsx**
- Analyse d'images médicales
- Modèle MobileNet préchargé
- Support 10 diagnostics majeurs
- Codes ICD et protocoles MINSANTE
- Export en DME

**Fichier:** `src/components/DiagnosticAI.jsx` (664 lignes)

### 2. **DMESystem.jsx**
- Gestion dossiers patients
- CRUD complet (Create, Read, Update, Delete)
- Recherche multi-critères
- Synchronisation P2P
- Export/Import JSON

**Fichier:** `src/components/DMESystem.jsx` (308 lignes)

### 3. **MedicalChatbot.jsx**
- Assistant IA bilingue
- 7 domaines médicaux couverts
- Base de données réponses
- Chat interactif temps réel
- Support FR/EN automatique

**Fichier:** `src/components/MedicalChatbot.jsx` (227 lignes)

### 4. **NetworkSimulation.jsx**
- Simulation réseau mesh P2P
- Visualisation nœuds (Mobile, Clinic, Gateway)
- Animation connexions
- Statistiques synchronisation
- Canvas 2D

**Fichier:** `src/components/NetworkSimulation.jsx` (319 lignes)

### 5. **Dashboard.jsx**
- Accueil principal
- Vue d'ensemble système
- Navigation composants
- Indicateurs statut

**Fichier:** `src/components/Dashboard.jsx`

---

## 🛠️ Technologies

### Frontend
```
React 18.3.1        - Framework UI
Vite 6.0.11         - Build tool ultra-rapide
Tailwind CSS 3.4.17 - Styling
PostCSS 8.5.6       - CSS processing
```

### Intelligence Artificielle
```
TensorFlow.js 4.22.0        - ML framework client-side
MobileNet 2.1.1             - Modèle vision pré-entrainé
```

### Visualisation & Data
```
Recharts 2.15.0    - Graphiques réactifs
Lucide React       - Icônes
Canvas 2D          - Simulation réseau
```

### Utilities
```
LocalStorage API    - Persistent storage
SessionStorage API  - Temporary cache
Web Workers        - Processing en arrière-plan (optionnel)
```

---

## 📁 Structure du Projet

```
asr-mesh-network/
├── src/
│   ├── components/
│   │   ├── App.jsx                    # Composant principal
│   │   ├── Dashboard.jsx              # Accueil
│   │   ├── DiagnosticAI.jsx           # Diagnostic par IA
│   │   ├── DMESystem.jsx              # Gestion patients
│   │   ├── MedicalChatbot.jsx         # Assistant IA
│   │   └── NetworkSimulation.jsx      # Réseau P2P
│   ├── utils/
│   │   ├── aiModels.js                # Configuration IA
│   │   └── storage.js                 # Gestion stockage
│   ├── assets/                        # Images/ressources
│   ├── App.css                        # Styles App
│   ├── index.css                      # Styles globaux
│   └── main.jsx                       # Entry point
├── public/                            # Static assets
├── package.json                       # Dépendances
├── vite.config.js                     # Config Vite
├── tailwind.config.js                 # Config Tailwind
├── postcss.config.js                  # Config PostCSS
├── eslint.config.js                   # Config ESLint
└── README.md                          # Documentation

```

---

## 📊 Diagnostics Supportés

| Code ICD | Diagnostic | Symptômes | Tests |
|----------|-----------|-----------|-------|
| B54 | Paludisme | Fièvre, frissons, céphalées | TDR, Goutte épaisse |
| A90 | Dengue | Fièvre 40°C, éruption | NS1, sérologie |
| L98.9 | Plaies/Lésions | Ulcère, rougeur | Culture, histologie |
| H53.9 | Ophtalmologie | Rougeur, douleur oculaire | Tonométrie, fond œil |
| J98.9 | Respiratoire | Toux, dyspnée | Radiographie, spirométrie |
| Z32 | Suivi prénatal | Enceinte, fatigue | Échographie, groupage |
| B20 | VIH/SIDA | Amaigrissement, fièvre | Test rapide, CD4 |
| E46 | Malnutrition | Amaigrissement, œdèmes | IMC, albuminémie |
| E11 | Diabète | Polydipsie, polyurie | Glycémie, HbA1c |
| I10 | Hypertension | Céphalées, vertiges | TA, ECG |

---

## 🔐 Sécurité & Confidentialité

```
✓ Chiffrement AES-256 des données sensibles
✓ Zéro transmission de données personnelles (mode local)
✓ Conforme RGPD/données sensantes
✓ Pas de cookies de tracking
✓ localStorage = stockage local uniquement
✓ Dossiers patients = données anonymisées
```

---

## 📱 Compatibilité

```
Navigateurs:
  ✓ Chrome 90+
  ✓ Firefox 88+
  ✓ Safari 14+
  ✓ Edge 90+

Appareils:
  ✓ Desktop
  ✓ Tablet
  ✓ Mobile (responsive design)

Mode:
  ✓ Hors-ligne (localStorage)
  ✓ Ligne (sync P2P si disponible)
```

---

## 🤝 Contribuer

### Signaler un bug
```bash
1. Ouvrir issue sur GitHub
2. Décrire le problème
3. Étapes à reproduire
4. Version navigateur/OS
```

### Soumettre une amélioration
```bash
1. Fork le repository
2. Créer branche: git checkout -b feature/amelioration
3. Commit: git commit -m "Add amelioration"
4. Push: git push origin feature/amelioration
5. Pull Request
```

### Standards de code
```
✓ ESLint configuration obligatoire
✓ Nommage en camelCase
✓ Commentaires en FR pour code métier
✓ Props destructurées React
✓ Hooks React moderne
```

---

## 📄 License

MIT License - Voir [LICENSE](LICENSE) pour détails

---

## 👥 Auteurs

- **Développeur Principal:** Papa ELAX
- **Année:** 2026
- **Pays:** Cameroun

---

## 📞 Support

Pour toute question ou problème:
- 📧 Email: support@telemedicine-cameroon.cm
- 💬 Issues GitHub: [GitHub Issues](https://github.com/[username]/Systeme_de_Telemedecine_et_Diagnostic_par_Intelligence_Artificielle/issues)
- 📖 Documentation: [Wiki](https://github.com/[username]/Systeme_de_Telemedecine_et_Diagnostic_par_Intelligence_Artificielle/wiki)

---

## 🎯 Feuille de Route (Roadmap)

### V1.1 (Q2 2026)
- [ ] Intégration SMS API Cameroun Telecom
- [ ] Synchronisation Cloud optionnelle
- [ ] Plus de diagnostics (50+ conditions)
- [ ] Historique complet patient

### V2.0 (Q4 2026)
- [ ] Backend Node.js
- [ ] Base de données PostgreSQL
- [ ] API REST complète
- [ ] Web services SOAP
- [ ] App mobile React Native
- [ ] Intégration WhatsApp

### V3.0 (2027)
- [ ] Blockchain pour authentification
- [ ] Telemedicine vidéo
- [ ] Prescription électronique
- [ ] Intégration pharmacie

---

## ✅ Checklist de Déploiement

```
- [ ] npm install (dépendances)
- [ ] npm run dev (tester local)
- [ ] npm run build (production)
- [ ] Déployer sur Vercel/Netlify
- [ ] Configurer domaine personnalisé
- [ ] SSL/TLS certificat
- [ ] CDN pour assets
- [ ] Analytics Google
- [ ] Monitoring erreurs (Sentry)
```

---

## 📝 Notes

- **Performance:** Optimisée pour connexions lentes (2G/3G)
- **Accessibilité:** WCAG 2.1 AA
- **SEO:** Optimisé pour recherche
- **Analytics:** Tracking utilisateurs pour amélioration UX

---

**Dernière mise à jour:** 10 Janvier 2026  
**Version:** 1.0.0  
**Status:** ✅ Production Ready

---

*Construit avec ❤️ pour la santé au Cameroun*
