import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Copy,
  Check,
  Share2,
  Send,
  Sparkles,
  HeartHandshake,
  ExternalLink,
} from 'lucide-react';
import { VIRAL_FOOTER, buildWhatsAppShareUrl } from '../services/growthEngine';

interface ShareActionsBarProps {
  content: string;
  title: string;
  category?: string;
  phone?: string;
  includeWatermarkDefault?: boolean;
  showViralPrompt?: boolean;
}

export const ShareActionsBar: React.FC<ShareActionsBarProps> = ({
  content,
  title,
  category,
  phone,
  includeWatermarkDefault = true,
  showViralPrompt = true,
}) => {
  const { openShareModal, addToast, trackGrowthEvent, setIsViralPostModalOpen, setCurrentTab } =
    useApp();
  const [copied, setCopied] = useState(false);
  const [includeFooter, setIncludeFooter] = useState(includeWatermarkDefault);

  const getFinalText = () => {
    return includeFooter ? `${content}${VIRAL_FOOTER}` : content;
  };

  const handleCopy = () => {
    const textToCopy = getFinalText();
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    trackGrowthEvent('share');
    addToast('success', 'Copié dans le presse-papiers !', 'Prêt à être collé dans vos applications.');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const text = getFinalText();
    const waUrl = buildWhatsAppShareUrl(text, phone);
    trackGrowthEvent('whatsapp_share');
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleOpenShare = () => {
    openShareModal({
      title,
      text: getFinalText(),
      channelHint: 'social',
    });
  };

  return (
    <div className="space-y-3 pt-2">
      {/* Primary Action Buttons Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-2xl bg-slate-50 border border-slate-200">
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold flex items-center gap-1.5 border border-slate-200 shadow-2xs transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copié</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-600" />
                <span>Copier</span>
              </>
            )}
          </button>

          {/* WhatsApp Direct */}
          <button
            onClick={handleWhatsApp}
            title="Prépare le message pour l'envoyer via WhatsApp"
            className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1.5 border border-emerald-200 shadow-2xs transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 text-emerald-600" />
            <span>Envoyer sur WhatsApp</span>
          </button>

          {/* Share Modal */}
          <button
            onClick={handleOpenShare}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold flex items-center gap-1.5 border border-slate-200 shadow-2xs transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>Partager...</span>
          </button>
        </div>

        {/* Subtle Watermark Toggle */}
        <label className="flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-slate-700 cursor-pointer select-none px-2 py-1">
          <input
            type="checkbox"
            checked={includeFooter}
            onChange={(e) => setIncludeFooter(e.target.checked)}
            className="rounded text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5 cursor-pointer"
          />
          <span>Mention « Créé avec BusinessAI »</span>
        </label>
      </div>

      {/* Viral Loop Callout Banner */}
      {showViralPrompt && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
            <span className="font-medium text-slate-700">
              Vous aimez ce résultat ? Partagez BusinessAI avec un autre entrepreneur et gagnez des crédits.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <button
              onClick={() => setIsViralPostModalOpen(true)}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 border border-indigo-200 text-indigo-900 font-semibold text-[11px] flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
            >
              <HeartHandshake className="w-3 h-3 text-indigo-600" />
              <span>Créer un post retour</span>
            </button>
            <button
              onClick={() => setCurrentTab('referrals')}
              className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-[11px] flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
            >
              <span>Inviter & Gagner</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
