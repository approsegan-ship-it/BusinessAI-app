import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Phone,
  Copy,
  Check,
  Smartphone,
  ShieldCheck,
  Sparkles,
  X,
  CreditCard,
  Send,
  CheckCircle2,
  Lock,
  ArrowRight,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PlanId, PRICING_PLANS } from '../config/plans';
import { formatPriceWithCurrency } from '../config/currency';

interface PaymentInstructionModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedPlan?: PlanId;
}

export const OFFICIAL_PAYMENT_NUMBER = '0163638893';
export const OFFICIAL_PAYMENT_DISPLAY = '+225 01 63 63 88 93';

export const PaymentInstructionModal: React.FC<PaymentInstructionModalProps> = ({
  isOpen,
  onClose,
  preselectedPlan = 'starter',
}) => {
  const {
    user,
    displayCurrency,
    upgradePlan,
    openReceiptModal,
    addToast,
    addNotification,
    t,
  } = useApp();

  const [selectedPlan, setSelectedPlan] = useState<PlanId>(
    preselectedPlan === 'free' ? 'starter' : preselectedPlan
  );
  const [activeMethod, setActiveMethod] = useState<'wave' | 'orange' | 'mtn' | 'moov' | 'card'>('wave');
  const [senderName, setSenderName] = useState(user.name || '');
  const [senderPhone, setSenderPhone] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [copied, setCopied] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const currentPlan = PRICING_PLANS[selectedPlan] || PRICING_PLANS.starter;
  const formattedPrice = formatPriceWithCurrency(currentPlan.price, displayCurrency);

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(OFFICIAL_PAYMENT_NUMBER);
    setCopied(true);
    addToast('success', 'Numéro copié !', `Numéro ${OFFICIAL_PAYMENT_NUMBER} copié dans le presse-papier.`);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleConfirmTransfer = (e: React.FormEvent) => {
    e.preventDefault();

    if (!senderPhone.trim()) {
      addToast(
        'error',
        'Numéro émetteur obligatoire',
        'Veuillez saisir votre numéro de téléphone ou la référence du transfert vers le 0163638893 afin de valider votre achat.'
      );
      return;
    }

    setIsActivating(true);

    setTimeout(() => {
      upgradePlan(selectedPlan, {
        senderName: senderName.trim() || 'Client BusinessAI',
        senderPhone: senderPhone.trim(),
        transactionRef: transactionRef.trim() || `TRX-${OFFICIAL_PAYMENT_NUMBER}-${Date.now().toString().slice(-6)}`,
      });
      setIsActivating(false);
      setIsSuccess(true);

      addNotification(
        'credit',
        'Paiement validé avec succès !',
        `Votre forfait ${currentPlan.name} a été activé suite au transfert vers le ${OFFICIAL_PAYMENT_NUMBER}. Profitez de vos ${currentPlan.monthlyGenerations} générations IA !`,
        'dashboard'
      );

      addToast(
        'success',
        `Forfait ${currentPlan.name} activé !`,
        `Paiement au ${OFFICIAL_PAYMENT_NUMBER} confirmé. Vos générations IA sont maintenant débloquées.`
      );
    }, 800);
  };

  const handleCloseAfterSuccess = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-5 sm:p-8 shadow-2xl overflow-hidden text-slate-900 my-6 max-h-[92vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {!isSuccess ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center max-w-md mx-auto">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Transfert Mobile Money & Wave</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Envoyer l'argent au {OFFICIAL_PAYMENT_NUMBER}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Transférez le montant de votre forfait sur le numéro officiel pour débloquer votre IA instantanément.
                </p>

                {/* Price Lock Guaranteed Banner */}
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-bold">
                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Prix Garanti Bloqué à Vie : Aucune augmentation future</span>
                </div>
              </div>

              {/* Plan selector pills */}
              <div className="grid grid-cols-3 gap-2">
                {(['starter', 'pro', 'business'] as PlanId[]).map((pid) => {
                  const p = PRICING_PLANS[pid];
                  const isSelected = selectedPlan === pid;
                  return (
                    <button
                      key={pid}
                      type="button"
                      onClick={() => setSelectedPlan(pid)}
                      className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-600/30'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="text-xs font-extrabold uppercase text-slate-900">{p.name}</div>
                      <div className="text-xs font-bold text-indigo-600 mt-0.5">
                        {formatPriceWithCurrency(p.price, displayCurrency)}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{p.monthlyGenerations} gén.</div>
                    </button>
                  );
                })}
              </div>

              {/* Number Card to Send Money */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white border border-indigo-900 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider block">
                      Numéro de Réception Officiel :
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="w-5 h-5 text-amber-400" />
                      <span className="text-2xl sm:text-3xl font-black tracking-wider text-amber-300">
                        {OFFICIAL_PAYMENT_NUMBER}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-300 mt-1 block">
                      Nom du compte : <strong>BusinessAI / Approsegan</strong> ({OFFICIAL_PAYMENT_DISPLAY})
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyNumber}
                    className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer shrink-0"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Numéro Copié !' : 'Copier 0163638893'}</span>
                  </button>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-slate-300">Montant à envoyer pour {currentPlan.name} :</span>
                  <span className="font-extrabold text-amber-300 text-sm">{formattedPrice}</span>
                </div>
              </div>

              {/* Step by step guides per operator */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Moyen de transfert :
                  </span>
                  <div className="flex gap-1.5 overflow-x-auto">
                    {[
                      { id: 'wave', label: 'Wave' },
                      { id: 'orange', label: 'Orange Money' },
                      { id: 'mtn', label: 'MTN MoMo' },
                      { id: 'moov', label: 'Moov' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setActiveMethod(m.id as any)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          activeMethod === m.id
                            ? 'bg-indigo-600 text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1.5">
                  {activeMethod === 'wave' && (
                    <>
                      <p className="font-semibold text-slate-900">Transfert direct Wave (0% de frais) :</p>
                      <p>1. Ouvrez l'application <strong>Wave</strong> sur votre téléphone.</p>
                      <p>2. Cliquez sur <strong>« Transférer »</strong> et entrez le <strong>0163638893</strong>.</p>
                      <p>3. Entrez le montant : <strong>{formattedPrice}</strong> et validez.</p>
                    </>
                  )}
                  {activeMethod === 'orange' && (
                    <>
                      <p className="font-semibold text-slate-900">Transfert Orange Money :</p>
                      <p>1. Tapez <strong>#144#</strong> ou ouvrez l'application <strong>Orange Money</strong>.</p>
                      <p>2. Choisissez Transfert d'argent vers le numéro <strong>0163638893</strong>.</p>
                      <p>3. Saisissez le montant : <strong>{formattedPrice}</strong> et confirmez avec votre code secret.</p>
                    </>
                  )}
                  {activeMethod === 'mtn' && (
                    <>
                      <p className="font-semibold text-slate-900">Transfert MTN Mobile Money :</p>
                      <p>1. Tapez <strong>*133#</strong> ou ouvrez <strong>MoMo App</strong>.</p>
                      <p>2. Transférez le montant <strong>{formattedPrice}</strong> vers le <strong>0163638893</strong>.</p>
                    </>
                  )}
                  {activeMethod === 'moov' && (
                    <>
                      <p className="font-semibold text-slate-900">Transfert Moov Money :</p>
                      <p>1. Tapez <strong>*155#</strong> ou ouvrez l'application <strong>Moov Money</strong>.</p>
                      <p>2. Envoyez <strong>{formattedPrice}</strong> au <strong>0163638893</strong>.</p>
                    </>
                  )}
                </div>
              </div>

              {/* Confirmation Form */}
              <form onSubmit={handleConfirmTransfer} className="space-y-4 pt-2 border-t border-slate-100">
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold">Paiement obligatoire avant activation :</span> Veuillez vous assurer d'avoir déjà transféré <strong>{formattedPrice}</strong> vers le <strong>{OFFICIAL_PAYMENT_NUMBER}</strong> ({activeMethod.toUpperCase()}). Renseignez ci-dessous le numéro utilisé.
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Votre Nom ou Entreprise :
                    </label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="Ex: Kouamé Marc"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-900 mb-1 flex items-center justify-between">
                      <span>Numéro expéditeur ou Réf. * :</span>
                      <span className="text-rose-600 font-bold text-[11px]">Requis</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      placeholder="Ex: 0708091011 ou ID Wave"
                      className="w-full px-3.5 py-2.5 rounded-xl border-2 border-rose-300 bg-rose-50/20 text-xs font-medium focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                  <a
                    href={`https://wa.me/2250163638893?text=${encodeURIComponent(
                      `Bonjour, je souhaite activer mon forfait ${currentPlan.name} (${formattedPrice}) sur BusinessAI.\nNom / Société : ${senderName || 'Client'}\nNuméro expéditeur : ${senderPhone || 'À préciser'}\nMoyen de paiement : ${activeMethod.toUpperCase()}\nBénéficiaire : ${OFFICIAL_PAYMENT_NUMBER}\nVoici ma confirmation de transfert.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer text-center"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Envoyer la Preuve par WhatsApp</span>
                  </a>

                  <button
                    type="submit"
                    disabled={isActivating}
                    className="flex-1 py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-indigo-200 transition-all active:scale-98 cursor-pointer"
                  >
                    {isActivating ? (
                      <span>Vérification du transfert...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Valider mon Paiement au 0163638893</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 text-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Activation des {currentPlan.monthlyGenerations} générations IA après vérification</span>
                </div>
              </form>
            </div>
          ) : (
            /* Success State */
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-slate-900">Félicitations !</h3>
                <p className="text-sm font-semibold text-emerald-700 mt-1">
                  Forfait {currentPlan.name} activé avec succès !
                </p>
                <p className="text-xs text-slate-600 mt-2 max-w-md mx-auto">
                  Votre transfert vers le <strong>{OFFICIAL_PAYMENT_NUMBER}</strong> a été validé. Vous disposez désormais de <strong>{currentPlan.monthlyGenerations} générations IA</strong>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 max-w-md mx-auto space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-slate-500">Statut de la commande :</span>
                  <span className="font-extrabold text-emerald-700 uppercase">✓ Achat Confirmé & Payé</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Forfait :</span>
                  <span className="font-bold text-slate-900">{currentPlan.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Montant Réglé :</span>
                  <span className="font-bold text-indigo-600">{formattedPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Garantie Tarifaire :</span>
                  <span className="font-bold text-amber-700 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-amber-600" />
                    <span>Prix Bloqué à Vie (0% hausse)</span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Bénéficiaire :</span>
                  <span className="font-bold text-slate-900">{OFFICIAL_PAYMENT_NUMBER}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <button
                  type="button"
                  onClick={() => {
                    handleCloseAfterSuccess();
                    openReceiptModal();
                  }}
                  className="flex-1 py-3 px-4 rounded-2xl border border-indigo-300 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-bold text-xs transition-all cursor-pointer shadow-xs"
                >
                  Voir mon Reçu Officiel d'Achat
                </button>

                <button
                  type="button"
                  onClick={handleCloseAfterSuccess}
                  className="flex-1 py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
                >
                  Commencer à générer avec l'IA
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
