import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  Gift,
  Share2,
  Copy,
  Check,
  Send,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  History,
  CheckCircle2,
  Clock,
  UserPlus,
  HeartHandshake,
} from 'lucide-react';
import { buildWhatsAppShareUrl, shareContentNativeOrWeb } from '../services/growthEngine';

export const ReferralView: React.FC = () => {
  const {
    referralState,
    addReferralInvite,
    simulateReferralActivation,
    redeemReferralCode,
    addToast,
    trackGrowthEvent,
    setIsViralPostModalOpen,
  } = useApp();

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [inviteeName, setInviteeName] = useState('');
  const [inviteeCompany, setInviteeCompany] = useState('');
  const [inputReferralCode, setInputReferralCode] = useState('');

  const defaultShareMessage = `Bonjour ! J'utilise BusinessAI pour automatiser la rédaction de mes publications, fiches produits et réponses clients. Découvre l'outil gratuitement avec mon lien de parrainage : ${referralState.link}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralState.link);
    setCopiedLink(true);
    trackGrowthEvent('share');
    addToast('success', 'Lien de parrainage copié !', 'Partagez-le avec vos confrères entrepreneurs.');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralState.code);
    setCopiedCode(true);
    trackGrowthEvent('share');
    addToast('success', 'Code de parrainage copié !', referralState.code);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleWhatsApp = () => {
    const url = buildWhatsAppShareUrl(defaultShareMessage);
    trackGrowthEvent('whatsapp_share');
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleNativeShare = async () => {
    const res = await shareContentNativeOrWeb({
      title: 'Invitation BusinessAI',
      text: defaultShareMessage,
      url: referralState.link,
    });
    if (res.success) {
      trackGrowthEvent('share');
      addToast('success', 'Invitation partagée avec succès !');
    }
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteeName.trim()) return;

    addReferralInvite(inviteeName.trim(), inviteeCompany.trim() || undefined);
    setInviteeName('');
    setInviteeCompany('');
  };

  const handleRedeemCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputReferralCode.trim()) return;

    const res = redeemReferralCode(inputReferralCode.trim());
    if (res.success) {
      setInputReferralCode('');
    } else {
      addToast('error', 'Erreur de parrainage', res.error || 'Code invalide.');
    }
  };

  // Milestone Calculations
  const activeCount = referralState.activeInvited;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-2xs relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-bold">
            <Gift className="w-3.5 h-3.5 text-indigo-600" />
            <span>Programme de Parrainage PME</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Développez votre entreprise avec BusinessAI
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Invitez un confrère ou un entrepreneur de votre réseau. Gagnez{' '}
            <strong className="text-slate-900 font-bold">15 crédits gratuits</strong> dès sa
            première inscription, et des bonus exclusifs à chaque étape.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsViralPostModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-transform active:scale-95 cursor-pointer"
            >
              <HeartHandshake className="w-4 h-4 text-indigo-300" />
              <span>Créer une publication BusinessAI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Referral Link & Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Link Box & Quick Sharing */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Card: Code & Link */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-5">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-indigo-600" />
              <span>Vos accès de parrainage exclusifs</span>
            </h2>

            {/* Code Box */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Votre Code Unique</label>
              <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="flex-1 font-mono font-bold text-sm sm:text-base text-slate-900 px-3 truncate">
                  {referralState.code}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-900 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Copié</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-600" />
                      <span>Copier</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Link Box */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Lien direct d'inscription</label>
              <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="flex-1 text-xs text-slate-600 px-3 truncate font-mono">
                  {referralState.link}
                </span>
                <button
                  onClick={handleCopyLink}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-900 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Copié</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-600" />
                      <span>Copier le lien</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Share Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleWhatsApp}
                className="py-3 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Send className="w-4 h-4 text-emerald-600" />
                <span>Inviter via WhatsApp</span>
              </button>

              <button
                onClick={handleNativeShare}
                className="py-3 px-4 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-900 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-indigo-600" />
                <span>Partager par SMS / Email</span>
              </button>
            </div>
          </div>

          {/* Direct Invite Form */}
          <form
            onSubmit={handleSendInvite}
            className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4"
          >
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-indigo-600" />
              <span>Enregistrer un entrepreneur invité</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nom ou Prénom <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={inviteeName}
                  onChange={(e) => setInviteeName(e.target.value)}
                  placeholder="Ex: Sophie Martin"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-indigo-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nom de son entreprise (optionnel)
                </label>
                <input
                  type="text"
                  value={inviteeCompany}
                  onChange={(e) => setInviteeCompany(e.target.value)}
                  placeholder="Ex: Atelier Floral"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:bg-white focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!inviteeName.trim()}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Ajouter à mon suivi d'invitations</span>
            </button>
          </form>
        </div>

        {/* Right Column: Milestones, Stats & Code Redemption */}
        <div className="lg:col-span-5 space-y-6">
          {/* Counters Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center shadow-2xs">
              <div className="text-xs text-slate-500 font-semibold mb-1">Invitations</div>
              <div className="text-2xl font-extrabold text-slate-900">
                {referralState.totalInvited}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center shadow-2xs">
              <div className="text-xs text-slate-500 font-semibold mb-1">Actifs</div>
              <div className="text-2xl font-extrabold text-emerald-700">
                {referralState.activeInvited}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center shadow-2xs">
              <div className="text-xs text-slate-500 font-semibold mb-1">Gagnés</div>
              <div className="text-2xl font-extrabold text-indigo-700">
                +{referralState.totalCreditsEarned}
              </div>
            </div>
          </div>

          {/* Program Milestones Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Paliers de Récompenses</span>
            </h3>

            <div className="space-y-3">
              {/* Level 1 */}
              <div
                className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
                  activeCount >= 1
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                      activeCount >= 1
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {activeCount >= 1 ? <Check className="w-4 h-4" /> : '1'}
                  </div>
                  <div>
                    <div className="font-bold text-xs">1 ami inscrit</div>
                    <div className="text-[10px] text-slate-500">Badge Premier Parrainage</div>
                  </div>
                </div>
                <span className="font-bold text-xs text-indigo-700 px-2 py-0.5 rounded bg-white border border-slate-200">
                  +15 crédits
                </span>
              </div>

              {/* Level 2 */}
              <div
                className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
                  activeCount >= 3
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                      activeCount >= 3
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {activeCount >= 3 ? <Check className="w-4 h-4" /> : '3'}
                  </div>
                  <div>
                    <div className="font-bold text-xs">3 amis actifs</div>
                    <div className="text-[10px] text-slate-500">Badge Ambassadeur PME</div>
                  </div>
                </div>
                <span className="font-bold text-xs text-indigo-700 px-2 py-0.5 rounded bg-white border border-slate-200">
                  +30 crédits bonus
                </span>
              </div>

              {/* Level 3 */}
              <div
                className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
                  activeCount >= 5
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                      activeCount >= 5
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {activeCount >= 5 ? <Check className="w-4 h-4" /> : '5'}
                  </div>
                  <div>
                    <div className="font-bold text-xs">5 amis actifs</div>
                    <div className="text-[10px] text-slate-500">Badge Leader Communauté</div>
                  </div>
                </div>
                <span className="font-bold text-xs text-indigo-700 px-2 py-0.5 rounded bg-white border border-slate-200">
                  +50 crédits bonus
                </span>
              </div>
            </div>
          </div>

          {/* Have a referral code from a friend? */}
          <form
            onSubmit={handleRedeemCode}
            className="p-5 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-3"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <h3 className="text-xs font-bold text-slate-900">
                Vous avez reçu un code de parrainage ?
              </h3>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputReferralCode}
                onChange={(e) => setInputReferralCode(e.target.value)}
                placeholder="Ex: BUSINESSAI-ABC123"
                className="flex-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-mono uppercase focus:bg-white focus:outline-none focus:border-indigo-600"
              />
              <button
                type="submit"
                disabled={!inputReferralCode.trim()}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-bold cursor-pointer transition-colors"
              >
                Activer
              </button>
            </div>
            <p className="text-[10px] text-slate-500">
              Protection anti-abus : l'auto-parrainage est automatiquement bloqué.
            </p>
          </form>
        </div>
      </div>

      {/* Referrals Follow-up & Simulation Tester */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tracked Referrals List */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              <span>Entrepreneurs invités ({referralState?.referrals?.length || 0})</span>
            </h3>
          </div>

          {(referralState?.referrals?.length || 0) === 0 ? (
            <div className="text-center py-8 text-slate-400 space-y-2">
              <UserPlus className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs">Aucune invitation en cours pour le moment.</p>
              <p className="text-[11px] text-slate-500">
                Copiez votre lien et envoyez-le sur WhatsApp pour commencer.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto space-y-1">
              {(referralState?.referrals || []).map((item) => (
                <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-xs text-slate-900">{item.referredName}</div>
                    <div className="text-[10px] text-slate-500">
                      {item.referredCompany || 'PME'} • Ajouté le {item.date}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.status === 'active' || item.status === 'rewarded' ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        Validé (+{item.creditsAwarded} cr.)
                      </span>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3 h-3" />
                          En attente
                        </span>
                        <button
                          onClick={() => simulateReferralActivation(item.id)}
                          title="Simuler l'inscription validée pour tester les crédits"
                          className="text-[10px] text-indigo-600 hover:underline px-1.5 py-0.5 rounded bg-indigo-50 border border-indigo-100 cursor-pointer"
                        >
                          Simuler validation
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reward History */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-600" />
            <span>Historique des crédits de parrainage</span>
          </h3>

          {(referralState?.history?.length || 0) === 0 ? (
            <div className="text-center py-8 text-slate-400 space-y-2">
              <Gift className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs">Aucune récompense de parrainage acquise pour l'instant.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto space-y-1">
              {(referralState?.history || []).map((hist) => (
                <div key={hist.id} className="py-3 flex items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-xs text-slate-900">{hist.action}</div>
                    <div className="text-[10px] text-slate-500">
                      {hist.description} • {hist.date}
                    </div>
                  </div>
                  <span className="font-bold text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    +{hist.credits} crédits
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
