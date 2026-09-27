import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Sparkles,
  Bot,
  BrainCircuit,
  Search,
  Workflow,
  BarChart3,
  Layers,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Building2,
  Users,
  Briefcase,
  Copy,
  Check,
  MessageSquareText,
  Lightbulb,
  ExternalLink,
  ChevronRight,
  Compass,
  FileSpreadsheet,
  Zap,
} from 'lucide-react';

export const EnterpriseAIGuideModal: React.FC = () => {
  const {
    isEnterpriseGuideOpen,
    setIsEnterpriseGuideOpen,
    setCurrentTab,
    setActivePresetPrompt,
    company,
    addToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'guide' | 'diagnostic'>('guide');
  const [copiedPillar, setCopiedPillar] = useState<string | null>(null);

  // Diagnostic states
  const [goal, setGoal] = useState<string>('emails_docs');
  const [teamSize, setTeamSize] = useState<string>('small');
  const [tools, setTools] = useState<string[]>(['microsoft', 'slack']);

  if (!isEnterpriseGuideOpen) return null;

  const toggleTool = (toolId: string) => {
    setTools((prev) =>
      prev.includes(toolId) ? prev.filter((t) => t !== toolId) : [...prev, toolId]
    );
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPillar(id);
    addToast('success', 'Texte copié !', 'Le descriptif de la solution a été copié.');
    setTimeout(() => setCopiedPillar(null), 2000);
  };

  // Compute recommendation
  const getRecommendation = () => {
    const isMs = tools.includes('microsoft');
    const isGoogle = tools.includes('google');
    const isNotion = tools.includes('notion');
    const isSlack = tools.includes('slack');
    const isLarge = teamSize === 'large' || teamSize === 'enterprise';

    if (goal === 'daily_business') {
      return {
        title: 'BusinessAI (Moteur Opérationnel PME)',
        subtitle: 'Idéal pour le cycle commercial complet & la relation client',
        score: '99% de correspondance',
        color: 'from-indigo-600 to-violet-700',
        badge: 'Recommandation Prioritaire PME',
        why: 'Votre besoin se concentre sur l’action commerciale directe : devis professionnels, factures, appels téléphoniques vocaux automatisés avec voix humaine, et marketing WhatsApp/Réseaux.',
        keyFeatures: [
          'Création instantanée de devis proforma et factures avec calcul de marge',
          'Agent vocal IA capable d’appeler vos clients pour relances et prise de RDV',
          'Génération visuelle pour réseaux sociaux (Instagram, WhatsApp, TikTok)',
          'Réponses types personnalisées selon le profil de votre entreprise',
        ],
        complementary: isMs ? 'Microsoft 365 Copilot' : isGoogle ? 'Google Workspace Gemini' : 'Notion AI',
      };
    }

    if (goal === 'data_decision') {
      return {
        title: 'Tableau Pulse (Salesforce / Tableau)',
        subtitle: 'Business Intelligence conversationnelle & Insights poussés',
        score: '96% de correspondance',
        color: 'from-cyan-600 to-blue-700',
        badge: 'Analyse & Décision Stratégique',
        why: 'Idéal pour les dirigeants et décideurs qui souhaitent comprendre le "pourquoi" derrière les variations de chiffres sans passer par des requêtes SQL ou des tableaux croisés dynamiques complexes.',
        keyFeatures: [
          'Pousse des résumés automatisés de tendances directement aux décideurs',
          'Explique les écarts de performance en langage naturel clair',
          'Accessible sur mobile et messageries professionnelles',
          'Se connecte aux entrepôts de données et bases CRM existantes',
        ],
        complementary: 'BusinessAI pour exécuter les actions correctives sur le terrain',
      };
    }

    if (goal === 'automation_agents') {
      if (tools.includes('openai') || teamSize === 'small') {
        return {
          title: 'Custom GPTs (OpenAI Team / Enterprise) & Zapier Central',
          subtitle: 'Agents autonomes sans code & bots connectés à vos applications',
          score: '97% de correspondance',
          color: 'from-amber-600 to-orange-600',
          badge: 'Automatisation & No-Code',
          why: 'Vous souhaitez créer des agents autonomes personnalisés capables de surveiller des fichiers, exécuter des tâches répétitives et répondre selon vos directives internes.',
          keyFeatures: [
            'Zapier Central : bots IA déclenchés sur des milliers d’outils SaaS',
            'Custom GPTs : versions sur mesure formées sur vos documents internes',
            'Exécution de consignes complexes en arrière-plan',
            'Déploiement simple sans aucune ligne de code requise',
          ],
          complementary: 'BusinessAI pour les relances clients téléphoniques et devis',
        };
      }
      return {
        title: 'Zapier Central',
        subtitle: 'Orchestrateur d’agents autonomes connectés à votre écosystème',
        score: '95% de correspondance',
        color: 'from-orange-500 to-amber-600',
        badge: 'Multi-applications No-Code',
        why: 'Permet de lier vos applications (Google Sheets, CRM, emails, Slack) et de demander à l’agent : « Surveille ce fichier et envoie un résumé aux équipes si une modification a lieu ».',
        keyFeatures: [
          'Connexion native à plus de 6 000 services web',
          'Surveillance d’événements en continu',
          'Interface sans code intuitive pour toute l’équipe',
        ],
        complementary: 'Custom GPTs pour la base de connaissances documentaire',
      };
    }

    if (goal === 'knowledge_search') {
      if (isLarge || (tools.length >= 3 && isSlack)) {
        return {
          title: 'Glean',
          subtitle: 'Moteur de recherche unifié d’entreprise boosté par l’IA',
          score: '98% de correspondance',
          color: 'from-purple-600 to-indigo-700',
          badge: 'Recherche & Connaissances Avancées',
          why: 'Pour une organisation où le savoir est dispersé sur de multiples outils (Slack, Jira, Google Drive, Microsoft 365, Notion). Glean centralise tout et respecte strictement les permissions de chaque employé.',
          keyFeatures: [
            'Indexation globale de tous vos SaaS, documents et conversations',
            'Permissions strictes (respect scrupuleux des droits d’accès de chaque collaborateur)',
            'Réponses instantanées avec sources citées et vérifiables',
            'Moteur de recommandation des experts internes sur un sujet',
          ],
          complementary: 'Notion AI pour la documentation vivante des équipes produit/marketing',
        };
      }
      return {
        title: 'Notion AI',
        subtitle: 'Documentation unifiée, synthèses et gestion de projets IA',
        score: '94% de correspondance',
        color: 'from-slate-800 to-slate-950',
        badge: 'Connaissances & Wikis d’équipe',
        why: 'Idéal pour centraliser la documentation, générer des plans d’action, traduire des notes et résumer des réunions au sein d’un espace de travail visuel et collaboratif.',
        keyFeatures: [
          'Synthèse instantanée de pages et comptes-rendus de réunion',
          'Traduction et génération de plans d’action automatiques',
          'Interrogation directe de l’ensemble de vos bases Notion',
        ],
        complementary: 'BusinessAI pour transformer la stratégie Notion en devis et ventes',
      };
    }

    // Default: Office suite productivity
    if (isMs) {
      return {
        title: 'Microsoft 365 Copilot',
        subtitle: 'Automatisation complète de l’environnement Windows & Office',
        score: '99% de correspondance',
        color: 'from-blue-600 to-indigo-700',
        badge: 'Bureautique Augmentée Windows',
        why: 'Votre équipe est déjà ancrée dans Word, Excel, PowerPoint, Outlook et Teams. Copilot offre une intégration native inégalée sans changer de logiciel.',
        keyFeatures: [
          'Rédaction assistée dans Word et résumés d’e-mails Outlook',
          'Analyse de données complexes sur Excel en langage naturel',
          'Création automatique de présentations PowerPoint à partir d’un document',
          'Synthèse de réunions Microsoft Teams en temps réel avec liste des actions',
        ],
        complementary: 'BusinessAI pour vos devis clients, facturation proforma et marketing WhatsApp',
      };
    }

    return {
      title: 'Google Workspace Gemini',
      subtitle: 'Productivité cloud intégrée sur Gmail, Docs, Sheets & Meet',
      score: '98% de correspondance',
      color: 'from-emerald-600 to-teal-700',
      badge: 'Bureautique Cloud Collaborative',
      why: 'Idéal pour les entreprises travaillant en cloud natif sur Google Workspace. Gemini fluidifie la rédaction d’e-mails, la modélisation de données et les réunions à distance.',
      keyFeatures: [
        'Aide à la rédaction et réponses intelligentes dans Gmail',
        'Structuration automatique de données et tableaux dans Google Sheets',
        'Synthèse et prises de notes automatiques des réunions Google Meet',
        'Création de contenus et d’images de présentation dans Google Docs & Slides',
      ],
      complementary: 'BusinessAI pour la gestion commerciale locale, les appels vocaux IA et factures',
    };
  };

  const recommendation = getRecommendation();

  const handleLaunchAssistantWithRoadmap = () => {
    const selectedToolsLabels = tools.map((t) => {
      switch (t) {
        case 'microsoft':
          return 'Microsoft 365';
        case 'google':
          return 'Google Workspace';
        case 'notion':
          return 'Notion';
        case 'slack':
          return 'Slack / Messageries';
        case 'saas':
          return 'Multi-SaaS';
        default:
          return t;
      }
    }).join(', ');

    const promptText = `Voici les besoins IA pour mon entreprise **${company.name || 'notre société'}** (${company.sector || 'commerce/services'}) :
- **Objectif prioritaire** : ${goal === 'emails_docs' ? 'Gagner du temps sur les e-mails, réunions et documents' : goal === 'knowledge_search' ? 'Centraliser le savoir de l’entreprise et recherche interne instantanée' : goal === 'automation_agents' ? 'Création d’agents autonomes et automatisation sans code' : goal === 'data_decision' ? 'Analyse de données et décisions stratégiques (BI)' : 'Cycle commercial complet (devis, factures, appels clients, ventes)'}
- **Taille de l’équipe** : ${teamSize === 'solo' ? '1 personne (Indépendant)' : teamSize === 'small' ? '2 à 9 personnes' : teamSize === 'medium' ? '10 à 49 personnes' : '50+ collaborateurs'}
- **Outils existants** : ${selectedToolsLabels || 'Écosystème standard'}
- **Recommandation issue du Diagnostic** : ${recommendation.title} (${recommendation.score}).

Donne-moi un plan d'action d'adoption en 3 étapes concrètes pour déployer ces outils avec mon équipe, le budget estimatif à prévoir, et comment synchroniser cela avec BusinessAI pour maximiser notre chiffre d'affaires et notre productivité.`;

    setActivePresetPrompt(promptText);
    setIsEnterpriseGuideOpen(false);
    setCurrentTab('assistant');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-start justify-between gap-4 shrink-0 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-3 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shadow-inner">
              <Compass className="w-6 h-6 text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                  Guide & Conseiller Solutions IA Entreprise
                </h3>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-500/30 border border-indigo-400/40 text-indigo-200">
                  Benchmark 2026
                </span>
              </div>
              <p className="text-xs sm:text-sm text-indigo-200/80 mt-0.5">
                Bureautique augmentée, recherche interne, agents autonomes & Business Intelligence
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEnterpriseGuideOpen(false)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0 z-10"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 pt-3 pb-2 bg-slate-50 border-b border-slate-200 flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'guide'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Guide des 4 Piliers IA</span>
          </button>

          <button
            onClick={() => setActiveTab('diagnostic')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'diagnostic'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Compass className="w-4 h-4 text-amber-400" />
            <span>Diagnostic & Recommandation Personnalisée</span>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase">
              Interactif
            </span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
          {activeTab === 'guide' && (
            <div className="space-y-6">
              {/* Introduction Card */}
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-slate-800 text-xs sm:text-sm leading-relaxed flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-indigo-950 mb-1">
                    Panorama des technologies d’Intelligence Artificielle en entreprise :
                  </p>
                  <p className="text-slate-600">
                    Pour optimiser les performances de votre équipe, chaque solution d’IA répond à un cas d’usage précis. Voici les 4 grands piliers actuels du marché et leur complémentarité avec votre plateforme BusinessAI.
                  </p>
                </div>
              </div>

              {/* Pillar 1: Bureautique Augmentée */}
              <div className="rounded-2xl bg-white border border-slate-200 shadow-2xs overflow-hidden">
                <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-50 to-indigo-50/40 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      1
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                        <span>Générale & Bureautique Augmentée</span>
                      </h4>
                      <p className="text-xs text-slate-500">
                        Intégration directe au cœur des outils quotidiens (traitement de texte, tableurs, e-mails, présentations)
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      handleCopyText(
                        `1. Bureautique Augmentée : Microsoft 365 Copilot (automatisation Word/Excel/PowerPoint sous Windows) & Google Workspace Gemini (rédaction Gmail, Google Sheets, résumés Meet).`,
                        'p1'
                      )
                    }
                    className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    title="Copier le résumé"
                  >
                    {copiedPillar === 'p1' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Microsoft 365 Copilot */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">Microsoft 365 Copilot</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md">
                        Windows & Office
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      <strong>Usage idéal :</strong> Automatisation complète dans l'environnement Windows. Il rédige des documents Word, analyse des données complexes sur Excel en langage naturel et crée des présentations PowerPoint.
                    </p>
                    <p className="text-[11px] text-slate-500 bg-white p-2 rounded-lg border border-slate-100">
                      <strong>Intégration :</strong> Fusion totale avec l'écosystème Microsoft 365 (Teams, Outlook, OneDrive).
                    </p>
                  </div>

                  {/* Google Workspace Gemini */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">Google Workspace Gemini</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">
                        Cloud & Google
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      <strong>Usage idéal :</strong> Idéal pour les entreprises collaborant sur le cloud. Il aide à rédiger des e-mails sur Gmail, structure des données dans Google Sheets et synthétise les réunions Google Meet.
                    </p>
                    <p className="text-[11px] text-slate-500 bg-white p-2 rounded-lg border border-slate-100">
                      <strong>Intégration :</strong> Intégré directement dans Google Docs, Gmail, Sheets, Meet et Drive.
                    </p>
                  </div>
                </div>
              </div>

              {/* Pillar 2: Gestion des Connaissances et Recherche Interne */}
              <div className="rounded-2xl bg-white border border-slate-200 shadow-2xs overflow-hidden">
                <div className="p-4 sm:p-5 bg-gradient-to-r from-purple-50 to-indigo-50/40 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      2
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                        <span>🧠 Gestion des Connaissances & Recherche Interne</span>
                      </h4>
                      <p className="text-xs text-slate-500">
                        Centralisation de tout le savoir de votre entreprise (Wikis, drives, Slack, PDF) pour y répondre instantanément
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      handleCopyText(
                        `2. Gestion des Connaissances : Glean (moteur de recherche ultra-sécurisé multi-SaaS) & Notion AI (résumé de pages, plans d'action et notes de réunion).`,
                        'p2'
                      )
                    }
                    className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    title="Copier le résumé"
                  >
                    {copiedPillar === 'p2' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Glean */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">Glean</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 bg-purple-100 text-purple-800 rounded-md">
                        Recherche Entreprise
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      <strong>Usage idéal :</strong> Moteur de recherche d'entreprise ultra-puissant basé sur l'IA. Il se connecte à toutes vos applications (SaaS, Slack, Jira, Drive) pour trouver une information précise en une seconde sans violer les permissions de sécurité.
                    </p>
                    <p className="text-[11px] text-slate-500 bg-white p-2 rounded-lg border border-slate-100 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                      <span><strong>Sécurité :</strong> Respect strict des droits et accès de chaque employé.</span>
                    </p>
                  </div>

                  {/* Notion AI */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">Notion AI</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-200 text-slate-800 rounded-md">
                        Wikis & Projets
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      <strong>Usage idéal :</strong> Parfait pour les équipes qui centralisent déjà leur documentation sur Notion. Il résume les pages, génère des plans d'action et traduit les notes de réunion.
                    </p>
                    <p className="text-[11px] text-slate-500 bg-white p-2 rounded-lg border border-slate-100">
                      <strong>Intégration :</strong> Natif dans les bases de données et blocs Notion de toute l’équipe.
                    </p>
                  </div>
                </div>
              </div>

              {/* Pillar 3: Création d'Agents Autonomes sans Code */}
              <div className="rounded-2xl bg-white border border-slate-200 shadow-2xs overflow-hidden">
                <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-50 to-orange-50/40 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      3
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                        <span>🛠️ Création d'Agents Autonomes sans Code (No-Code AI Agents)</span>
                      </h4>
                      <p className="text-xs text-slate-500">
                        Pour les entreprises qui souhaitent concevoir leurs propres assistants virtuels personnalisés
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      handleCopyText(
                        `3. Agents Autonomes No-Code : Zapier Central (bots capables d'exécuter des tâches à travers des milliers d'apps) & Custom GPTs (versions ChatGPT entraînées sur directives et fichiers internes).`,
                        'p3'
                      )
                    }
                    className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    title="Copier le résumé"
                  >
                    {copiedPillar === 'p3' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Zapier Central */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">Zapier Central</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 bg-orange-100 text-orange-800 rounded-md">
                        Multi-Apps Workflow
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      <strong>Usage idéal :</strong> Création de bots IA capables d'exécuter des tâches à travers des milliers d'applications. Vous pouvez lui demander : « Surveille ce fichier et envoie un résumé aux équipes si une modification a lieu ».
                    </p>
                    <p className="text-[11px] text-slate-500 bg-white p-2 rounded-lg border border-slate-100">
                      <strong>Force :</strong> Connectivité universelle avec l'écosystème Zapier (Gmail, Trello, Sheets, Slack).
                    </p>
                  </div>

                  {/* Custom GPTs */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">Custom GPTs (OpenAI Team / Enterprise)</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">
                        ChatGPT Personnalisé
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      <strong>Usage idéal :</strong> Permet de créer des versions de ChatGPT entraînées exclusivement sur les directives et les fichiers de votre entreprise, utilisables uniquement en interne.
                    </p>
                    <p className="text-[11px] text-slate-500 bg-white p-2 rounded-lg border border-slate-100">
                      <strong>Sécurité :</strong> Les données soumises ne servent pas à entraîner les modèles publics.
                    </p>
                  </div>
                </div>
              </div>

              {/* Pillar 4: Analyse de Données et Décision Stratégique */}
              <div className="rounded-2xl bg-white border border-slate-200 shadow-2xs overflow-hidden">
                <div className="p-4 sm:p-5 bg-gradient-to-r from-cyan-50 to-blue-50/40 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-cyan-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      4
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                        <span>💼 Analyse de Données & Décision Stratégique</span>
                      </h4>
                      <p className="text-xs text-slate-500">
                        Insights automatiques et compréhension du « pourquoi » derrière vos chiffres
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      handleCopyText(
                        `4. Analyse de Données : Tableau Pulse (solution de BI augmentée poussant des insights automatiques et expliquant le "pourquoi" derrière les variations de chiffres).`,
                        'p4'
                      )
                    }
                    className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    title="Copier le résumé"
                  >
                    {copiedPillar === 'p4' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                <div className="p-4 sm:p-5">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">Tableau Pulse</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 bg-cyan-100 text-cyan-800 rounded-md">
                        Business Intelligence Augmentée
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      <strong>Usage idéal :</strong> Une solution de Business Intelligence augmentée par l'IA qui pousse des insights automatiques aux décideurs, expliquant le "pourquoi" derrière les variations de chiffres sans avoir besoin de manipuler des graphiques complexes.
                    </p>
                    <p className="text-[11px] text-slate-500 bg-white p-2 rounded-lg border border-slate-100">
                      <strong>Avantage :</strong> Réception directe de digests d'activité personnalisés sur Slack ou par e-mail avec des recommandations chiffrées claires.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bonus Synergy: BusinessAI */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white shadow-md relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center text-white shrink-0">
                      <Sparkles className="w-5 h-5 text-indigo-300" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-white">
                        Comment BusinessAI complète ces outils ?
                      </h4>
                      <p className="text-xs text-indigo-200">
                        Alors que ces solutions couvrent les grandes suites et wikis, BusinessAI est l'arme d'exécution commerciale pour les PME : devis conformes, factures, appels téléphoniques vocaux IA et marketing WhatsApp/Réseaux.
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('diagnostic')}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shrink-0 cursor-pointer active:scale-95"
                  >
                    <span>Lancer mon Diagnostic</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'diagnostic' && (
            <div className="space-y-6">
              {/* Questionnaire Section */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-6">
                <div>
                  <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                    <Compass className="w-4 h-4 text-indigo-600" />
                    <span>Répondez aux 3 questions pour identifier la solution idéale :</span>
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Le diagnostic calcule la combinaison d'IA la plus rentable et adaptée à votre organisation.
                  </p>
                </div>

                {/* Question 1: Goal */}
                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    1. Quel est votre objectif principal ?
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      {
                        id: 'emails_docs',
                        title: 'Gagner du temps sur les e-mails & documents',
                        desc: 'Rédaction Word/Docs, tri de mails, synthèses de réunions',
                        icon: FileSpreadsheet,
                      },
                      {
                        id: 'knowledge_search',
                        title: 'Centraliser le savoir & recherche interne',
                        desc: 'Trouver l’info instantanément dans tous les drives, PDF & wikis',
                        icon: BrainCircuit,
                      },
                      {
                        id: 'automation_agents',
                        title: 'Créer des agents autonomes & automatiser',
                        desc: 'Bots sans code surveillant des fichiers et exécutant des tâches',
                        icon: Workflow,
                      },
                      {
                        id: 'data_decision',
                        title: 'Analyser les données & décisions stratégiques',
                        desc: 'Comprendre les variations de chiffres sans manipuler des graphiques',
                        icon: BarChart3,
                      },
                      {
                        id: 'daily_business',
                        title: 'Ventes, devis/factures & appels clients IA',
                        desc: 'Exécution commerciale concrète pour PME & indépendants',
                        icon: Zap,
                      },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setGoal(opt.id)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                          goal === opt.id
                            ? 'bg-indigo-50/80 border-indigo-600 text-indigo-950 ring-2 ring-indigo-600/20 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <opt.icon
                          className={`w-5 h-5 shrink-0 mt-0.5 ${
                            goal === opt.id ? 'text-indigo-600' : 'text-slate-400'
                          }`}
                        />
                        <div>
                          <p className="font-bold text-xs sm:text-sm">{opt.title}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{opt.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question 2: Team Size */}
                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    2. Quelle est la taille de votre équipe ?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'solo', label: 'Solo / Indépendant', desc: '1 personne' },
                      { id: 'small', label: 'Petite équipe', desc: '2 à 9 personnes' },
                      { id: 'medium', label: 'PME en croissance', desc: '10 à 49 collaborateurs' },
                      { id: 'large', label: 'Grande entreprise', desc: '50+ collaborateurs' },
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setTeamSize(s.id)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          teamSize === s.id
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs font-bold'
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700 text-xs'
                        }`}
                      >
                        <div className="text-xs font-bold">{s.label}</div>
                        <div
                          className={`text-[10px] mt-0.5 ${
                            teamSize === s.id ? 'text-indigo-100' : 'text-slate-400'
                          }`}
                        >
                          {s.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question 3: Existing Tools */}
                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    3. Quels outils utilisez-vous déjà ? (Plusieurs choix possibles)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'microsoft', label: 'Microsoft 365 (Word, Excel, Outlook)' },
                      { id: 'google', label: 'Google Workspace (Gmail, Sheets, Drive)' },
                      { id: 'notion', label: 'Notion / Wikis' },
                      { id: 'slack', label: 'Slack / Discord' },
                      { id: 'openai', label: 'ChatGPT / OpenAI' },
                      { id: 'saas', label: 'Multiples SaaS (Jira, Salesforce, etc.)' },
                    ].map((t) => {
                      const selected = tools.includes(t.id);
                      return (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => toggleTool(t.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                            selected
                              ? 'bg-slate-900 text-white border-slate-900 shadow-2xs font-semibold'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {selected ? <Check className="w-3.5 h-3.5 text-indigo-400" /> : null}
                          <span>{t.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Dynamic Diagnostic Output Card */}
              <div className="rounded-3xl bg-white border border-slate-200 shadow-md overflow-hidden animate-fadeIn">
                <div
                  className={`p-5 sm:p-6 bg-gradient-to-r ${recommendation.color} text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/20 text-white backdrop-blur-xs">
                        {recommendation.badge}
                      </span>
                      <span className="text-xs text-white/90 font-bold">
                        {recommendation.score}
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black mt-1 text-white">
                      {recommendation.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/80 mt-0.5">
                      {recommendation.subtitle}
                    </p>
                  </div>

                  <button
                    onClick={handleLaunchAssistantWithRoadmap}
                    className="px-4 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs flex items-center gap-2 transition-all shadow-md shrink-0 cursor-pointer active:scale-95"
                  >
                    <Bot className="w-4 h-4 text-indigo-600" />
                    <span>Générer mon plan d’adoption IA</span>
                    <ArrowRight className="w-3.5 h-3.5 text-indigo-600" />
                  </button>
                </div>

                <div className="p-5 sm:p-6 space-y-4 bg-white">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                      Pourquoi ce choix pour votre entreprise ?
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {recommendation.why}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                      Fonctionnalités clés à activer en priorité :
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {recommendation.keyFeatures.map((feat, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2 text-xs text-slate-700"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-indigo-50/80 border border-indigo-100 flex items-center justify-between gap-3">
                    <div className="text-xs text-slate-700">
                      <strong>Synergie recommandée :</strong> Associez cette solution avec{' '}
                      <span className="font-bold text-indigo-900">{recommendation.complementary}</span> pour une couverture intégrale de vos processus métier.
                    </div>
                    <button
                      onClick={() =>
                        handleCopyText(
                          `Diagnostic IA pour ${company.name || 'notre entreprise'} :\nSolution recommandée : ${recommendation.title} (${recommendation.score})\nPourquoi : ${recommendation.why}\nComplémentarité : ${recommendation.complementary}`,
                          'rec'
                        )
                      }
                      className="px-3 py-1.5 rounded-lg bg-white border border-indigo-200 text-indigo-900 text-xs font-bold hover:bg-indigo-100/60 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      {copiedPillar === 'rec' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Copié</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Copier la synthèse</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 px-6 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Mise à jour en temps réel selon les outils et directives de votre profil</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEnterpriseGuideOpen(false)}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold transition-colors cursor-pointer"
            >
              Fermer
            </button>
            <button
              onClick={handleLaunchAssistantWithRoadmap}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              <span>Ouvrir dans l’Assistant IA</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
