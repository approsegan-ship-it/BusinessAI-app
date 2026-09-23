import React, { useState, useEffect, useMemo } from 'react';
import { CompanyProfile } from '../types';
import {
  analyzeMarketingPostSEO,
  SeoAnalysisResult,
  SeoSuggestion,
} from '../utils/seoAnalyzer';
import { generateAIContent } from '../services/geminiService';
import {
  Sparkles,
  X,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Copy,
  Check,
  TrendingUp,
  Hash,
  MousePointerClick,
  Eye,
  FileText,
  Clock,
  Send,
  Zap,
  RotateCcw,
  Layers,
  Share2,
} from 'lucide-react';

interface SeoAnalysisDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialText: string;
  company: CompanyProfile;
  onApplyToChat?: (optimizedText: string) => void;
  isAiLocked?: boolean;
  onOpenPaymentModal?: () => void;
}

export const SeoAnalysisDrawer: React.FC<SeoAnalysisDrawerProps> = ({
  isOpen,
  onClose,
  initialText,
  company,
  onApplyToChat,
  isAiLocked = false,
  onOpenPaymentModal,
}) => {
  const [text, setText] = useState(initialText);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'keywords' | 'platforms' | 'editor'>('overview');

  // Sync when initialText changes
  useEffect(() => {
    if (initialText) {
      setText(initialText);
    }
  }, [initialText]);

  // Real-time analysis result
  const analysis: SeoAnalysisResult = useMemo(() => {
    return analyzeMarketingPostSEO(text, company);
  }, [text, company]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetToInitial = () => {
    setText(initialText);
  };

  // AI-powered SEO optimization
  const handleAIOptimize = async () => {
    if (isAiLocked) {
      onOpenPaymentModal?.();
      return;
    }
    if (!text.trim() || isOptimizing) return;

    setIsOptimizing(true);
    try {
      const prompt = `Voici une publication marketing pour l'entreprise "${company.name || 'notre marque'}" (${company.sector}) :
"""
${text}
"""

TA MISSION :
Réécris et sublime cette publication pour obtenir un score SEO & Marketing de 98/100 :
1. Une première phrase (Hook / Accroche) captivante qui stoppe le défilement (utilise une question stimulante, un chiffre ou un mot puissant).
2. Un corps de texte aéré en 2-3 courts paragraphes, mettant en valeur les bénéfices clés avec 2 à 4 puces et des émojis pertinents.
3. Des mots-clés stratégiques naturels pour le référencement du secteur.
4. Un appel à l'action (CTA) irrésistible invitant à commander ou contacter sur WhatsApp (${company.whatsapp || company.phone || 'directement'}).
5. Termine par 4 à 6 hashtags ultra-ciblés (#nomDeMarque #secteur #ville etc.).

Fournis directement le texte final optimisé, prêt à être copié et publié sur les réseaux sociaux.`;

      const result = await generateAIContent(prompt, company, 0.7);
      if (result.text && result.text.trim()) {
        setText(result.text.trim());
      }
    } catch (err: any) {
      console.error('Erreur lors de l’optimisation SEO IA:', err);
    } finally {
      setIsOptimizing(false);
    }
  };

  // Quick insertion of missing hashtags
  const handleAddSuggestedHashtags = () => {
    const defaultTags = [
      `#${(company.name || 'business').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}`,
      `#${(company.sector || 'commerce').split('&')[0].replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}`,
      '#promo',
      '#business',
      '#qualite',
    ];
    const newTags = defaultTags.filter((tag) => !text.toLowerCase().includes(tag.toLowerCase()));
    if (newTags.length > 0) {
      setText((prev) => `${prev.trim()}\n\n${newTags.join(' ')}`);
    }
  };

  // Quick insertion of CTA
  const handleAddQuickCta = () => {
    const contact = company.whatsapp || company.phone || '+229 01 63 63 88 93';
    const ctaText = `\n\n📲 Commandez dès maintenant en direct sur WhatsApp au ${contact} !`;
    setText((prev) => `${prev.trim()}${ctaText}`);
  };

  // Score color helper
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500 bg-emerald-50 border-emerald-200';
    if (score >= 65) return 'text-amber-500 bg-amber-50 border-amber-200';
    return 'text-rose-500 bg-rose-50 border-rose-200';
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 65) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl h-full bg-white shadow-2xl flex flex-col border-l border-slate-200 overflow-hidden">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-white">
                  Analyseur SEO & Qualité Marketing
                </h3>
                <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 px-2 py-0.5 rounded-full">
                  Temps Réel
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Évaluation instantanée de l'impact, du référencement et du taux de conversion
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Fermer l'analyseur"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Score Summary Bar */}
        <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div
              className={`w-14 h-14 rounded-2xl border-2 flex flex-col items-center justify-center shadow-xs ${getScoreColor(
                analysis.overallScore
              )}`}
            >
              <span className="text-xl font-black leading-none">{analysis.overallScore}</span>
              <span className="text-[9px] font-extrabold uppercase tracking-tight mt-0.5">/ 100</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wide">
                  Score SEO Global :
                </span>
                <span className="text-xs font-black px-2 py-0.5 rounded-md bg-slate-900 text-white">
                  Grade {analysis.grade}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-600 mt-0.5">{analysis.statusLabel}</p>
            </div>
          </div>

          {/* AI Optimizer Action */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleAIOptimize}
              disabled={isOptimizing || !text.trim()}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-extrabold text-xs shadow-xs flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              title="Réécrire avec l'IA pour viser un score de 95+"
            >
              {isOptimizing ? (
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Zap className="w-3.5 h-3.5 text-amber-300" />
              )}
              <span>{isOptimizing ? 'Optimisation IA...' : 'Booster le score (IA)'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 bg-white px-4 shrink-0 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-2.5 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Vue d'ensemble</span>
          </button>

          <button
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-2.5 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'editor'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Texte en direct ({analysis.wordCount} mots)</span>
          </button>

          <button
            onClick={() => setActiveTab('keywords')}
            className={`px-3 py-2.5 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'keywords'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Hash className="w-3.5 h-3.5" />
            <span>Mots-clés & Hashtags</span>
          </button>

          <button
            onClick={() => setActiveTab('platforms')}
            className={`px-3 py-2.5 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'platforms'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Compatibilité Réseaux</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              {/* Key Indicators Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center justify-between">
                    <span>Accroche (Hook)</span>
                    <Eye className="w-3.5 h-3.5 text-indigo-500" />
                  </div>
                  <div className="text-lg font-black text-slate-900 mt-1">
                    {analysis.hookScore} <span className="text-xs font-normal text-slate-400">/100</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${getScoreBarColor(analysis.hookScore)}`}
                      style={{ width: `${analysis.hookScore}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center justify-between">
                    <span>Appel à l'action</span>
                    <MousePointerClick className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <div className="text-lg font-black text-slate-900 mt-1">
                    {analysis.ctaScore} <span className="text-xs font-normal text-slate-400">/100</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${getScoreBarColor(analysis.ctaScore)}`}
                      style={{ width: `${analysis.ctaScore}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center justify-between">
                    <span>Lisibilité & Format</span>
                    <Layers className="w-3.5 h-3.5 text-purple-500" />
                  </div>
                  <div className="text-lg font-black text-slate-900 mt-1">
                    {analysis.readabilityScore} <span className="text-xs font-normal text-slate-400">/100</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${getScoreBarColor(analysis.readabilityScore)}`}
                      style={{ width: `${analysis.readabilityScore}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center justify-between">
                    <span>Mots-clés SEO</span>
                    <Hash className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                  <div className="text-lg font-black text-slate-900 mt-1">
                    {analysis.keywordsScore} <span className="text-xs font-normal text-slate-400">/100</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${getScoreBarColor(analysis.keywordsScore)}`}
                      style={{ width: `${analysis.keywordsScore}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center justify-between">
                    <span>Hashtags ({analysis.hashtags.length})</span>
                    <Hash className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                  <div className="text-lg font-black text-slate-900 mt-1">
                    {analysis.hashtagScore} <span className="text-xs font-normal text-slate-400">/100</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${getScoreBarColor(analysis.hashtagScore)}`}
                      style={{ width: `${analysis.hashtagScore}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-500 flex items-center justify-between">
                    <span>Longueur & Rétention</span>
                    <Clock className="w-3.5 h-3.5 text-rose-500" />
                  </div>
                  <div className="text-lg font-black text-slate-900 mt-1">
                    {analysis.lengthScore} <span className="text-xs font-normal text-slate-400">/100</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${getScoreBarColor(analysis.lengthScore)}`}
                      style={{ width: `${analysis.lengthScore}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Real-time Content Metrics Pill Bar */}
              <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-700 gap-2 font-medium">
                <span>📝 <strong>{analysis.wordCount}</strong> mots</span>
                <span>🔤 <strong>{analysis.charCount}</strong> caractères</span>
                <span>⏱ <strong>~{analysis.readingTimeSeconds}s</strong> de lecture</span>
                <span>📱 <strong>{analysis.paragraphCount}</strong> paragraphes</span>
                <span>✨ <strong>{analysis.emojiCount}</strong> émojis</span>
              </div>

              {/* Actionable Suggestions & Checklist */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                    <span>Recommandations d'optimisation :</span>
                  </h4>
                  <span className="text-[10px] text-slate-500 font-semibold">
                    {analysis.suggestions.filter((s) => s.type === 'good').length}/{analysis.suggestions.length} critères validés
                  </span>
                </div>

                <div className="space-y-2">
                  {analysis.suggestions.map((sug) => {
                    return (
                      <div
                        key={sug.id}
                        className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs transition-colors ${
                          sug.type === 'good'
                            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                            : sug.type === 'warning'
                            ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                            : 'bg-rose-50/70 border-rose-200 text-rose-950'
                        }`}
                      >
                        {sug.type === 'good' && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        )}
                        {sug.type === 'warning' && (
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        )}
                        {sug.type === 'critical' && (
                          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                        )}

                        <div className="flex-1">
                          <div className="font-bold">{sug.title}</div>
                          <p className="text-[11px] opacity-90 mt-0.5 leading-relaxed">{sug.detail}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick 1-Click Fix Buttons */}
              <div className="p-3.5 rounded-2xl bg-indigo-50/80 border border-indigo-200/80 space-y-2">
                <div className="text-xs font-black text-indigo-950 uppercase tracking-wide">
                  ⚡ Améliorations instantanées en 1 clic :
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis.hashtags.length < 3 && (
                    <button
                      onClick={handleAddSuggestedHashtags}
                      className="px-3 py-1.5 rounded-lg bg-white border border-indigo-300 text-indigo-900 text-xs font-bold hover:bg-indigo-100 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                    >
                      <Hash className="w-3 h-3 text-indigo-600" />
                      <span>Ajouter des hashtags ciblés</span>
                    </button>
                  )}

                  {analysis.detectedCtas.length === 0 && (
                    <button
                      onClick={handleAddQuickCta}
                      className="px-3 py-1.5 rounded-lg bg-white border border-indigo-300 text-indigo-900 text-xs font-bold hover:bg-indigo-100 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                    >
                      <MousePointerClick className="w-3 h-3 text-indigo-600" />
                      <span>Insérer un CTA WhatsApp</span>
                    </button>
                  )}

                  <button
                    onClick={() => setActiveTab('editor')}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                  >
                    <FileText className="w-3 h-3" />
                    <span>Modifier le texte manuellement</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LIVE TEXT EDITOR */}
          {activeTab === 'editor' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Éditeur en temps réel
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Modifiez le texte ci-dessous pour voir l'impact immédiat sur votre score SEO.
                  </p>
                </div>

                <button
                  onClick={handleResetToInitial}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                  title="Restaurer le texte d'origine"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Rétablir</span>
                </button>
              </div>

              <div className="relative">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={10}
                  placeholder="Collez ou rédigez votre publication marketing ici..."
                  className="w-full p-4 rounded-2xl border-2 border-slate-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 text-xs sm:text-sm font-sans leading-relaxed text-slate-900 placeholder:text-slate-400 bg-slate-50 focus:bg-white shadow-2xs resize-y"
                />

                {/* Floating quick live counters */}
                <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-white/90 border border-slate-200 text-[10px] font-bold text-slate-500 shadow-xs pointer-events-none">
                  {analysis.wordCount} mots • Score : {analysis.overallScore}/100
                </div>
              </div>

              {/* Actions row */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copié !' : 'Copier le texte'}</span>
                  </button>

                  {onApplyToChat && (
                    <button
                      onClick={() => {
                        onApplyToChat(text);
                        onClose();
                      }}
                      className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Insérer dans la discussion</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={handleAIOptimize}
                  disabled={isOptimizing}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Optimiser avec l'IA</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: KEYWORDS & HASHTAGS */}
          {activeTab === 'keywords' && (
            <div className="space-y-5">
              {/* Keywords Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <Hash className="w-4 h-4 text-indigo-600" />
                    <span>Mots-clés fréquents détectés :</span>
                  </h4>
                  <span className="text-[10px] text-slate-500">
                    Densité idéale : entre 1.5% et 4.0%
                  </span>
                </div>

                {analysis.topKeywords.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                    Aucun mot-clé distinctif trouvé. Rédigez un texte plus développé pour extraire les mots-clés.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {analysis.topKeywords.map((kw, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-bold text-xs text-slate-900 capitalize">{kw.word}</div>
                          <div className="text-[10px] text-slate-500">{kw.count} occurrence(s)</div>
                        </div>
                        <span
                          className={`text-xs font-black px-2 py-0.5 rounded-md ${
                            kw.density > 5
                              ? 'bg-rose-100 text-rose-700'
                              : kw.density >= 1.5
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {kw.density}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Hashtags Section */}
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <Hash className="w-4 h-4 text-blue-600" />
                    <span>Hashtags détectés ({analysis.hashtags.length}) :</span>
                  </h4>
                  <span className="text-[10px] text-slate-500">Idéal : 3 à 6 hashtags</span>
                </div>

                {analysis.hashtags.length === 0 ? (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-center justify-between gap-3">
                    <span>Aucun hashtag détecté. Ajoutez des hashtags pour doper le référencement.</span>
                    <button
                      onClick={handleAddSuggestedHashtags}
                      className="px-3 py-1.5 rounded-lg bg-amber-600 text-white font-bold text-xs hover:bg-amber-700 cursor-pointer shrink-0"
                    >
                      Ajouter automatiquement
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {analysis.hashtags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Detected CTA list */}
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <MousePointerClick className="w-4 h-4 text-emerald-600" />
                  <span>Déclencheurs d'action (CTA) trouvés :</span>
                </h4>

                {analysis.detectedCtas.length === 0 ? (
                  <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 text-xs flex items-center justify-between gap-3">
                    <span>Aucun appel à l'action identifié. Vos lecteurs ne sauront pas comment acheter.</span>
                    <button
                      onClick={handleAddQuickCta}
                      className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 cursor-pointer shrink-0"
                    >
                      Insérer CTA WhatsApp
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {analysis.detectedCtas.map((cta, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs capitalize flex items-center gap-1"
                      >
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>{cta}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: PLATFORMS FIT */}
          {activeTab === 'platforms' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Adéquation selon les canaux de diffusion :
                </h4>
                <p className="text-[11px] text-slate-500">
                  Découvrez comment votre publication performe sur chaque plateforme.
                </p>
              </div>

              <div className="space-y-3">
                {analysis.platforms.map((p) => {
                  return (
                    <div
                      key={p.platform}
                      className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-xs sm:text-sm text-slate-900">
                            {p.label}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              p.verdict === 'Idéal'
                                ? 'bg-emerald-100 text-emerald-800'
                                : p.verdict === 'Adapté'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {p.verdict}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-900">{p.score}/100</span>
                        </div>
                      </div>

                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${getScoreBarColor(p.score)}`}
                          style={{ width: `${p.score}%` }}
                        />
                      </div>

                      <p className="text-xs text-slate-600">{p.tip}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Mise à jour en direct à chaque frappe</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copié !' : 'Copier'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
