# BusinessAI — Assistant IA Commercial & Marketing pour PME

BusinessAI est une plateforme complète et moderne permettant aux commerçants, PME et entrepreneurs de générer des contenus marketing percutants, des fiches produits optimisées pour la vente, des réponses clients professionnelles pour WhatsApp & SMS, et de piloter leur stratégie commerciale avec l'intelligence artificielle Gemini.

---

## 🌟 Fonctionnalités Incluses

1. **Tableau de Bord & Métriques Clés (`Dashboard.tsx`)**
   - Suivi des générations IA restantes et niveau de forfait.
   - Accès rapide en 1 clic aux 4 piliers d'automatisation.
   - Statistiques de conversion et aperçu des derniers contenus générés.

2. **Assistant IA d'Entreprise (`AIAssistant.tsx`)**
   - Chat interactif multi-tours alimenté par Gemini 3.7 Flash.
   - Injection automatique des directives de marque, devises et coordonnées de l'entreprise.

3. **Générateur de Réseaux Sociaux & Viralité (`SocialGenerator.tsx`, `ViralPostModal.tsx`)**
   - Posts Facebook, Instagram, statuts WhatsApp engageants et slogans.
   - Formules virales (offres flash, concours, avant/après).
   - Partage en 1 clic vers WhatsApp et copie rapide dans le presse-papiers.

4. **Catalogue & Fiches Produits Persuasives (`ProductCatalog.tsx`)**
   - Création de fiches produits avec titres accrocheurs, arguments de vente clés et appels à l'action.
   - Gestion des prix, catégories et devises locales (FCFA, EUR, USD, etc.).

5. **Gestionnaire de Réponses Clients (`CustomerResponses.tsx`)**
   - Modèles pré-configurés : demande de prix, gestion des objections, relances d'impayés, SAV, remerciements.
   - Adaptation instantanée au ton de l'entreprise.

6. **Outils Commerciaux & Rentabilité (`SalesTools.tsx`)**
   - Calculateur de marge commerciale, taux de marque, coefficient multiplicateur et TVA.
   - Simulateur de promotions et générateur de propositions commerciales.

7. **Guide & Intégration WhatsApp IA (`WhatsAppTutorialModal.tsx`)**
   - Générateur interactif de liens directs `wa.me` avec messages personnalisés.
   - Documentation et code complet pour les webhooks Meta Cloud API et Twilio.

8. **Profil d'Entreprise & Base de Connaissances (`CompanyProfileView.tsx`)**
   - Personnalisation de l'identité, numéro WhatsApp, adresse, horaires et ton de communication.
   - Modèles pré-configurés par secteur (Mode, Restaurant, E-commerce, Beauté, Artisanat).

9. **Forfaits & Monétisation (`PricingView.tsx`, `PricingModal.tsx`)**
   - Grille tarifaire moderne (Free, Starter 2 500 FCFA, Pro 5 500 FCFA, Business 15 000 FCFA).
   - Architecture prête pour Mobile Money (Wave, Orange Money, MTN, Moov) et Carte Bancaire.

10. **Système de Parrainage & Badges de Fidélité (`ReferralView.tsx`, `BadgesGrid.tsx`)**
    - Récompenses de crédits par partage et déblocage de succès.

---

## 🏗️ Architecture du Projet

Le projet respecte une séparation stricte entre le client et le serveur :

```
├── server.ts                  # Serveur backend Express + Proxy sécurisé Gemini API
├── .env.example               # Déclaration des variables d'environnement (SANS clés réelles)
├── .gitignore                 # Exclusion des fichiers sensibles, dépendances et builds
├── metadata.json              # Métadonnées et permissions de l'application
├── package.json               # Scripts de build, start et dépendances
├── vite.config.ts             # Configuration Vite & plugin Tailwind CSS
├── src/
│   ├── main.tsx               # Point d'entrée React 19
│   ├── App.tsx                # Routage des vues et navigation
│   ├── index.css              # Styles globaux Tailwind v4
│   ├── types.ts               # Définitions TypeScript strictes
│   ├── components/            # Composants UI modulaires
│   ├── config/
│   │   └── plans.ts           # Configuration centralisée des forfaits et fonctionnalités
│   ├── context/
│   │   └── AppContext.tsx     # État global et persistance locale
│   ├── services/
│   │   ├── geminiService.ts   # Service client d'appel aux routes d'API
│   │   └── growthEngine.ts    # Moteur de croissance et viralité
│   └── utils/
│       ├── defaultData.ts     # Données par défaut et modèles par secteur
│       └── idGenerator.ts     # Générateur d'identifiants
```

---

## 🔒 Sécurité des Clés API

- **Aucune clé API n'est écrite en dur dans le code source.**
- Les clés API (comme `GEMINI_API_KEY`) sont stockées exclusivement dans les variables d'environnement du serveur (`process.env.GEMINI_API_KEY`).
- Le serveur Express expose des routes protégées (`/api/gemini/generate`, `/api/gemini/chat`) qui proxifient les requêtes sans jamais exposer la clé secrète au navigateur.
- En l'absence de clé API, le serveur active automatiquement un moteur de secours intelligent afin que l'application reste utilisable.

---

## 🚀 Démarrage Rapide

### 1. Installation des dépendances
```bash
npm install
```

### 2. Configuration des variables d'environnement
Créez un fichier `.env` basé sur `.env.example` :
```bash
cp .env.example .env
```
Ajoutez votre clé Google Gemini dans `.env` :
```env
GEMINI_API_KEY="votre_cle_gemini_ici"
```

### 3. Lancer en mode Développement
```bash
npm run dev
```
L'application démarre sur `http://localhost:3000`.

### 4. Build de Production & Démarrage
```bash
npm run build
npm start
```

---

## 📦 Synchronisation GitHub

Pour synchroniser ce projet avec votre dépôt GitHub :

1. Initialisez git (si ce n'est pas déjà fait) :
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Complete BusinessAI platform"
   ```
2. Liez votre dépôt distant :
   ```bash
   git remote add origin https://github.com/VOTRE_UTILISATEUR/business-ai.git
   git branch -M main
   git push -u origin main
   ```
*(Le fichier `.gitignore` s'assure que vos secrets `.env` et le dossier `node_modules` ne seront jamais envoyés sur GitHub).*
