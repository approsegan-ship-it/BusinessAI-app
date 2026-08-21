import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Share2,
  Copy,
  Check,
  Send,
  ExternalLink,
  MessageCircle,
  Linkedin,
  Facebook,
  Twitter,
  Gift,
  CheckCircle2,
} from 'lucide-react';
import { shareContentNativeOrWeb, buildWhatsAppShareUrl } from '../services/growthEngine';

export const ShareModal: React.FC = () => {
  const {
    isShareModalOpen,
    setIsShareModalOpen,
    shareModalData,
    referralState,
    addToast,
    trackGrowthEvent,
  } = useApp();

  const [copied, setCopied] = useState(false);
  const [includeReferralLink, setIncludeReferralLink] = useState(true);

  if (!isShareModalOpen || !shareModalData) return null;

  const getShareBody = () => {
    let text = shareModalData.text;
    if (includeReferralLink) {
      if (!text.includes(referralState.link)) {
        text += `\n\n👉 Testez BusinessAI gratuitement : ${referralState.link}`;
      }
    }
    return text;
  };

  const handleCopy = () => {
    const text = getShareBody();
    navigator.clipboard.writeText(text);
    setCopied(true);
    trackGrowthEvent('share');
    addToast('success', 'Contenu copié !', 'Le texte est dans votre presse-papiers.');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    const text = getShareBody();
    const url = buildWhatsAppShareUrl(text);
    trackGrowthEvent('whatsapp_share');
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleNativeShare = async () => {
    const text = getShareBody();
    const res = await shareContentNativeOrWeb({
      title: shareModalData.title || 'Contenu BusinessAI',
      text,
      url: includeReferralLink ? referralState.link : undefined,
    });

    if (res.success) {
      trackGrowthEvent('share');
      addToast('success', 'Partage effectué !');
      setIsShareModalOpen(false);
    } else {
      handleCopy();
    }
  };

  const handleTwitterShare = () => {
    const text = encodeURIComponent(getShareBody().slice(0, 260));
    const url = `https://twitter.com/intent/tweet?text=${text}`;
    trackGrowthEvent('share');
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleLinkedInShare = () => {
    const shareUrl = encodeURIComponent(referralState.link);
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;
    trackGrowthEvent('share');
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleFacebookShare = () => {
    const shareUrl = encodeURIComponent(referralState.link);
    const url = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
    trackGrowthEvent('share');
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
      onClick={() => setIsShareModalOpen(false)}
    >
      <div
        className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Partager ce contenu</h3>
              <p className="text-[11px] text-slate-500 truncate max-w-[280px]">
                {shareModalData.title}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsShareModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Preview Box */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Aperçu du texte à partager
            </label>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-mono max-h-36 overflow-y-auto whitespace-pre-line leading-relaxed select-text">
              {getShareBody()}
            </div>
          </div>

          {/* Referral link inclusion toggle */}
          <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Gift className="w-4 h-4 text-amber-600 shrink-0" />
              <div className="text-xs">
                <span className="font-bold text-amber-950">Attacher mon lien de parrainage</span>
                <p className="text-[10px] text-amber-800">
                  Gagnez +15 crédits pour chaque entrepreneur qui s'inscrit
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={includeReferralLink}
              onChange={(e) => setIncludeReferralLink(e.target.checked)}
              className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
            />
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {/* WhatsApp */}
            <button
              onClick={handleWhatsApp}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 transition-colors cursor-pointer"
            >
              <Send className="w-5 h-5 text-emerald-600 mb-1.5" />
              <span className="text-xs font-bold">WhatsApp</span>
              <span className="text-[10px] text-emerald-700">Message direct</span>
            </button>

            {/* Native Share */}
            <button
              onClick={handleNativeShare}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-900 transition-colors cursor-pointer"
            >
              <Share2 className="w-5 h-5 text-indigo-600 mb-1.5" />
              <span className="text-xs font-bold">Partage Téléphone</span>
              <span className="text-[10px] text-indigo-700">Menu natif OS</span>
            </button>

            {/* Copy */}
            <button
              onClick={handleCopy}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5 text-emerald-600 mb-1.5" />
                  <span className="text-xs font-bold text-emerald-700">Copié !</span>
                  <span className="text-[10px] text-emerald-600">Presse-papiers</span>
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5 text-slate-600 mb-1.5" />
                  <span className="text-xs font-bold">Copier tout</span>
                  <span className="text-[10px] text-slate-500">Texte brut</span>
                </>
              )}
            </button>

            {/* LinkedIn */}
            <button
              onClick={handleLinkedInShare}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Linkedin className="w-4 h-4 text-blue-700" />
              <span>LinkedIn</span>
            </button>

            {/* Twitter / X */}
            <button
              onClick={handleTwitterShare}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Twitter className="w-4 h-4 text-sky-500" />
              <span>X / Twitter</span>
            </button>

            {/* Facebook */}
            <button
              onClick={handleFacebookShare}
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Facebook className="w-4 h-4 text-blue-600" />
              <span>Facebook</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Aucun envoi automatique sans votre accord
          </span>
          <button
            onClick={() => setIsShareModalOpen(false)}
            className="font-semibold text-slate-700 hover:text-slate-900 cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
