# BusinessAI — Plateforme IA Commerciale, Marketing & Vidéo pour PME

BusinessAI est une plateforme complète et moderne permettant aux commerçants, PME et entrepreneurs de générer des contenus marketing percutants, des storyboards vidéo TikTok & Reels, des fiches produits optimisées pour la vente, des réponses clients professionnelles pour WhatsApp & SMS, et de piloter leur stratégie commerciale avec l'intelligence artificielle Gemini 3.7.

---

## 🌟 Fonctionnalités Incluses

1. **Tableau de Bord & Métriques Clés (`src/components/Dashboard.tsx`)**
   - Suivi des crédits IA restants, état du forfait et raccourcis rapides.
   - Statistiques de conversion et aperçu des derniers contenus générés.

2. **Générateur de Devis & Factures Pro (`src/components/InvoiceGenerator.tsx`)**
   - Création de devis (proforma) et factures conformes en quelques clics.
   - Génération assistée par l'IA des postes de facturation et conditions de paiement.
   - Calcul automatique des sous-totaux, remises, TVA locale et montants nets.
   - Coordonnées de paiement Mobile Money intégrées (Wave, Orange Money, MTN MoMo).
   - Export et impression directe au format PDF haute fidélité (`window.print()`).
   - Partage instantané du récapitulatif par lien WhatsApp direct.

3. **Agent d'Appels Vocaux IA (`src/components/AICallingAgent.tsx`)**
   - L'IA téléphone à vos clients avec une voix humaine à la place de l'entrepreneur.
   - 4 voix IA personnalisées (Amélie, Thomas, Fatou, Jean) avec modulation de pitch et débit.
   - Scénarios métier : Relance facture impayée, confirmation de commande, planification de livraison, suivi devis, satisfaction client.
   - Synthèse vocale interactive (Web Speech API) avec dialogue tour par tour.
   - Réponses suggérées interactives pour tester les objections clients en direct.
   - Envoi automatique d'un message récapitulatif WhatsApp après chaque appel.

4. **Générateur Vidéo & Storyboard TikTok / Reels (`src/components/VideoGenerator.tsx`)**
   - Scénarisation minutée (15s, 30s, 60s) en formats 9:16 vertical, 1:1 carré ou 16:9 paysage.
   - Accroches anti-scroll (Hooks), scripts voix-off mot à mot, instructions de cadrage smartphone.
   - Simulateur smartphone interactif avec lecture de voix-off par synthèse vocale (TTS).
   - Prompteur plein écran et export automatique des sous-titres synchronisés `.SRT` et dossiers de tournage `.TXT`.

3. **Assistant IA Commercial & Stratégie (`src/components/AIAssistant.tsx`)**
   - Chat interactif multi-tours alimenté par Gemini 3.7 Flash.
   - Injection automatique des directives de marque, devises et coordonnées de l'entreprise.

4. **Générateur de Publications & Viralité (`src/components/SocialGenerator.tsx`, `src/components/ViralPostModal.tsx`)**
   - Posts Facebook, Instagram, statuts WhatsApp engageants et slogans publicitaires.
   - Formules virales (offres flash, concours, avant/après) avec partage direct WhatsApp.

5. **Catalogue & Fiches Produits Persuasives (`src/components/ProductCatalog.tsx`)**
   - Rédaction d'arguments de vente percutants, titres magnétiques et appels à l'action.
   - Gestion des prix, catégories et devises locales (FCFA, EUR, USD, etc.).

6. **Gestionnaire de Réponses Clients & SAV (`src/components/CustomerResponses.tsx`)**
   - Modèles pré-configurés : demande de prix, gestion des objections, relances d'impayés, SAV, remerciements.
   - Adaptation instantanée au ton de l'entreprise.

7. **Outils Commerciaux & Rentabilité (`src/components/SalesTools.tsx`)**
   - Calculateur de marge commerciale, taux de marque, coefficient multiplicateur et TVA.
   - Simulateur de promotions et générateur de propositions commerciales.

8. **Guide & Intégration WhatsApp Business (`src/components/WhatsAppTutorialModal.tsx`)**
   - Générateur interactif de liens directs `wa.me` avec messages pré-remplis.
   - Documentation et architecture pour les webhooks Meta Cloud API et Twilio.

9. **Profil d'Entreprise & Base de Connaissances (`src/components/CompanyProfileView.tsx`)**
   - Personnalisation de l'identité, numéro WhatsApp, adresse, horaires et ton de communication.
   - Modèles pré-configurés par secteur (Mode, Restaurant, E-commerce, Beauté, Artisanat).

10. **Grille Tarifaire & Paiements Sécurisés (`src/components/PricingView.tsx`, `src/components/PricingModal.tsx`)**
    - Forfaits adaptés aux PME : Free (0 FCFA), Starter (9 900 FCFA/mois), Pro (19 900 FCFA/mois), Business (49 000 FCFA/mois).
    - Validation des transferts Mobile Money (Wave, Orange Money, MTN, Moov) au numéro officiel `0163638893`.

---

## 🏗️ Architecture du Projet

Le projet respecte une séparation stricte entre le client et le serveur :

```
├── server.ts                  # Serveur backend Express + Proxy sécurisé Gemini API
├── .env.example               # Déclaration des variables d'environnement (SANS secrets)
├── .gitignore                 # Exclusion des fichiers sensibles, dépendances et builds
├── metadata.json              # Métadonnées et permissions de l'application
├── package.json               # Scripts de build, start et dépendances
├── vite.config.ts             # Configuration Vite & plugin Tailwind CSS
├── src/
│   ├── main.tsx               # Point d'entrée React 19
│   ├── App.tsx                # Routage des vues et navigation
│   ├── index.css              # Styles globaux Tailwind
│   ├── types.ts               # Définitions TypeScript strictes
│   ├── components/            # Composants UI modulaires
│   │   ├── VideoGenerator.tsx # Studio vidéo & storyboard
│   │   ├── Dashboard.tsx      # Tableau de bord principal
│   │   ├── AIAssistant.tsx    # Assistant chat intelligent
│   │   ├── SocialGenerator.tsx# Générateur de posts
│   │   ├── ProductCatalog.tsx # Fiches produits
│   │   ├── CustomerResponses.tsx # Réponses clients & SAV
│   │   ├── SalesTools.tsx     # Outils de calcul commercial
│   │   ├── PricingView.tsx    # Grille de forfaits & FAQ
│   │   ├── PricingModal.tsx   # Fenêtre d'abonnement & devises
│   │   └── PaymentInstructionModal.tsx # Validation Mobile Money
│   ├── config/
│   │   ├── plans.ts           # Configuration centralisée des forfaits
│   │   └── currency.ts        # Devises et taux de conversion
│   ├── context/
│   │   └── AppContext.tsx     # État global et persistance locale
│   ├── services/
│   │   ├── geminiService.ts   # Service client d'appel aux routes d'API
│   │   └── growthEngine.ts    # Moteur de croissance et viralité
│   └── utils/
│       ├── defaultData.ts     # Données par défaut et modèles sectoriels
│       └── idGenerator.ts     # Générateur d'identifiants
```

---

## 🔒 Sécurité des Clés API

- **Aucune clé API n'est exposée côté navigateur.**
- La clé `GEMINI_API_KEY` est stockée exclusivement dans les variables d'environnement du serveur (`process.env.GEMINI_API_KEY`).
- Le serveur Express expose des routes protégées (`/api/gemini/generate`, `/api/gemini/chat`) qui exécutent les requêtes en toute sécurité.
- En cas d'absence momentanée de clé API, un moteur de secours intelligent intégré prend le relais pour maintenir l'expérience utilisateur.

---

## 🚀 Démarrage Rapide en Local

### 1. Installation des dépendances
```bash
npm install
```

### 2. Configuration des variables d'environnement
Créez votre fichier `.env` basé sur `.env.example` :
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

## 🔗 Comment Connecter et Exporter vers GitHub

### Option A : Depuis l'interface Google AI Studio (En 1 Clic)
1. Cliquez sur le menu **Settings / Export** (ou l'icône GitHub en haut à droite).
2. Choisissez **"Export to GitHub"** (ou "Download ZIP").
3. Connectez votre compte GitHub et sélectionnez votre organisation ou créez un nouveau dépôt `business-ai`.
4. Vos fichiers sont automatiquement synchronisés avec votre dépôt distant.

### Option B : En Ligne de Commande (Git CLI)
1. Créez un nouveau dépôt vide sur votre compte GitHub (ex: `https://github.com/mon-compte/business-ai`).
2. Dans le terminal de votre projet :
   ```bash
   git init
   git add .
   git commit -m "feat: complete BusinessAI platform with video generator & pricing"
   git branch -M main
   git remote add origin https://github.com/mon-compte/business-ai.git
   git push -u origin main
   ```
*(Le fichier `.gitignore` protège automatiquement vos variables d'environnement privées `.env` et vos modules).*
