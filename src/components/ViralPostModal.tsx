import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Sparkles,
  Send,
  Copy,
  Check,
  Share2,
  HeartHandshake,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { generateViralPostTemplate, buildWhatsAppShareUrl } from '../services/growthEngine';

export const ViralPostModal: React.FC = () => {
  const {
    isViralPostModalOpen,
    setIsViralPostModalOpen,
    company,
    referralState,
    addToast,
    trackGrowthEvent,
    addHistory,
  } = useApp();

  const [customText, setCustomText] = useState(() => {
    return generateViralPostTemplate(company, referralState.link).postText;
  });
  const [copied, setCopied] = useState(false);

  if (!isViralPostModalOpen) return null;

  const handleReset = () => {
    const template = generateViralPostTemplate(company, referralState.link);
    setCustomText(template.postText);
    addToast('info', 'Texte réinitialisé', 'Le modèle authentique a été restauré.');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(customText);
    setCopied(true);
    trackGrowthEvent('share');
    addHistory({
      type: 'viral_post',
      title: 'Publication Partage BusinessAI',
      inputSummary: `Post d'expérience pour ${company.name}`,
      output: customText,
    });
    addToast('success', 'Publication copiée !', 'Prête à être publiée sur vos réseaux sociaux.');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const url = buildWhatsAppShareUrl(customText);
    trackGrowthEvent('whatsapp_share');
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
      onClick={() => setIsViralPostModalOpen(false)}
    >
      <div
        className="w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Créer une publication BusinessAI
              </h3>
              <p className="text-[11px] text-slate-500">
                Partagez votre retour d'expérience avec d'autres entrepreneurs
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsViralPostModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Structure note */}
          <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-950 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Structure de ce modèle authentique :</span>
            </div>
            <ul className="text-[11px] text-indigo-900 space-y-0.5 list-disc list-inside">
              <li>Le défi rencontré dans votre activité ({company.sector})</li>
              <li>La solution concrète apportée par BusinessAI</li>
              <li>Votre lien personnel pour faire gagner des crédits à vos confrères</li>
            </ul>
          </div>

          {/* Editable Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Texte du post (personnalisable)
              </label>
              <button
                onClick={handleReset}
                className="text-[11px] text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Modèle par défaut</span>
              </button>
            </div>
            <textarea
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              rows={9}
              className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-xs leading-relaxed focus:bg-white focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 font-sans shadow-2xs select-text"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
            <div className="flex items-center gap-2">
              <button
                onClick={handleWhatsApp}
                className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-emerald-600" />
                <span>Envoyer sur WhatsApp</span>
              </button>

              <button
                onClick={handleCopy}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Copié dans le presse-papiers !</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copier la publication</span>
                  </>
                )}
              </button>
            </div>

            <button
              onClick={() => setIsViralPostModalOpen(false)}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              Fermer
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-500">
          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          <span>
            Chaque entrepreneur s'inscrivant avec votre lien vous rapporte automatiquement 15 crédits.
          </span>
        </div>
      </div>
    </div>
  );
};
