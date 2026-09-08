import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { generateAIContent } from '../services/geminiService';
import { ShareActionsBar } from './ShareActionsBar';
import {
  MessageCircleReply,
  Sparkles,
  Copy,
  Check,
  Send,
  ExternalLink,
  DollarSign,
  Boxes,
  Truck,
  AlertTriangle,
  HelpCircle,
  Heart,
  PackageCheck,
  RefreshCw,
  Smartphone,
} from 'lucide-react';

const SCENARIOS = [
  {
    id: 'price',
    label: 'Demande de prix',
    icon: DollarSign,
    desc: 'Annoncer un tarif ou justifier la valeur avec diplomatie',
    defaultDetails: 'Le client demande le prix pour notre prestation phare / produit vedette.',
  },
  {
    id: 'availability',
    label: 'Disponibilité en stock',
    icon: Boxes,
    desc: 'Confirmer la disponibilité ou proposer une alternative',
    defaultDetails: 'Le client demande si le produit est en stock et s’il peut être réservé.',
  },
  {
    id: 'shipping',
    label: 'Délais & Livraison',
    icon: Truck,
    desc: 'Rassurer sur les modes d’envoi, tarifs et délais',
    defaultDetails: 'Le client demande les délais de livraison et le coût d’expédition.',
  },
  {
    id: 'complaint',
    label: 'Réclamation / Insatisfaction',
    icon: AlertTriangle,
    desc: 'Désamorcer le conflit avec empathie et proposer une solution',
    defaultDetails: 'Le client signale un problème avec sa commande et exprime son mécontentement.',
  },
  {
    id: 'info',
    label: "Demande d'informations",
    icon: HelpCircle,
    desc: 'Répondre avec clarté aux questions sur les horaires ou services',
    defaultDetails: 'Le client souhaite connaître nos horaires et notre fonctionnement général.',
  },
  {
    id: 'thanks',
    label: 'Remerciement & Avis',
    icon: Heart,
    desc: 'Remercier après un achat et solliciter un avis positif',
    defaultDetails: 'Le client vient de finaliser un achat et nous souhaitons le remercier chaleureusement.',
  },
  {
    id: 'tracking',
    label: "Suivi d'une commande",
    icon: PackageCheck,
    desc: 'Donner l’état d’avancement de la commande ou de la réservation',
    defaultDetails: 'Le client demande où en est sa commande passée récemment.',
  },
];

export const CustomerResponses: React.FC = () => {
  const { company, user, consumeCredit, addHistory, addToast, openWhatsAppTutorialModal, setIsPricingModalOpen, openPaymentModal } = useApp();

  const [selectedScenarioId, setSelectedScenarioId] = useState('price');
  const [clientName, setClientName] = useState('');
  const [specificContext, setSpecificContext] = useState('');
  const [tone, setTone] = useState('Chaleureux & Bienveillant');
  const [loading, setLoading] = useState(false);

  const isFreePlan = user.plan === 'free' || !user.isPurchased || user.maxCredits <= 0;

  const [generatedResponse, setGeneratedResponse] = useState<string | null>(null);
  const [salesTip, setSalesTip] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const activeScenario = SCENARIOS.find((s) => s.id === selectedScenarioId) || SCENARIOS[0];

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (isFreePlan) {
      addToast(
        'warning',
        'Abonnement requis',
        'Envoyez votre paiement au 0163638893 pour activer l’IA et générer vos réponses clients.'
      );
      openPaymentModal('starter');
      return;
    }

    if (!consumeCredit()) {
      return;
    }

    setLoading(true);

    const prompt = `Rédige une réponse professionnelle et personnalisée pour un client :
- Scénario : ${activeScenario.label} (${activeScenario.desc})
- Nom du client : ${clientName || 'Non spécifié (utiliser un bonjour chaleureux)'}
- Contexte particulier / Demande spécifique : ${specificContext || activeScenario.defaultDetails}
- Ton souhaité : ${tone}

Fournis la réponse en respectant STRICTEMENT les balises :

[RESPONSE]
(Rédige le message complet prêt à être envoyé par WhatsApp, SMS ou Email. Sois clair, poli, rassurant et termine par une invitation à échanger ou une étape suivante concrète).
[/RESPONSE]

[TIP]
(Donne 1 conseil tactique de vente ou de relation client pour fidéliser ce client lors de cet échange).
[/TIP]`;

    try {
      const res = await generateAIContent(prompt, company, 0.7);
      const text = res.text;

      const responseMatch = text.match(/\[RESPONSE\]([\s\S]*?)\[\/RESPONSE\]/i);
      const tipMatch = text.match(/\[TIP\]([\s\S]*?)\[\/TIP\]/i);

      const parsedResponse = responseMatch ? responseMatch[1].trim() : text;
      const parsedTip = tipMatch
        ? tipMatch[1].trim()
        : 'Conseil : Répondez rapidement et proposez toujours une solution proactive pour renforcer la confiance.';

      setGeneratedResponse(parsedResponse);
      setSalesTip(parsedTip);

      addHistory({
        type: 'client_reply',
        title: `Réponse Client - ${activeScenario.label}`,
        inputSummary: `${clientName ? `Client : ${clientName} | ` : ''}${activeScenario.label}`,
        output: parsedResponse,
      });

      addToast('success', 'Réponse prête !', 'Vous pouvez la copier ou l’envoyer sur WhatsApp.');
    } catch (err) {
      console.error(err);
      addToast('error', 'Erreur de génération', 'Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedResponse) return;
    navigator.clipboard.writeText(generatedResponse);
    setCopied(true);
    addToast('success', 'Réponse copiée !');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    if (!generatedResponse) return;
    const encoded = encodeURIComponent(generatedResponse);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-200 text-violet-700 flex items-center justify-center">
            <MessageCircleReply className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Générateur de Réponses aux Clients
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Répondez avec professionnalisme et rapidité à tous les messages de vos clients.
            </p>
          </div>
        </div>

        <button
          onClick={openWhatsAppTutorialModal}
          className="px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-2xs shrink-0"
        >
          <Smartphone className="w-4 h-4 text-emerald-600" />
          <span>Tutoriel WhatsApp IA</span>
        </button>
      </div>

      {/* Scenarios Horizontal Selector */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          1. Sélectionnez la situation client
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {SCENARIOS.map((scenario) => {
            const Icon = scenario.icon;
            const isSelected = selectedScenarioId === scenario.id;
            return (
              <button
                key={scenario.id}
                onClick={() => {
                  setSelectedScenarioId(scenario.id);
                  setGeneratedResponse(null);
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                  isSelected
                    ? 'bg-violet-50/80 border-violet-300 text-slate-900 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-violet-600 text-white shadow-2xs' : 'bg-violet-50 border border-violet-200 text-violet-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-xs leading-snug text-slate-900">{scenario.label}</div>
                  <div className="text-[10px] text-slate-500 truncate mt-0.5">{scenario.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Options and Generated Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Specific Context & Tone */}
        <div className="lg:col-span-5 space-y-6">
          <form
            onSubmit={handleGenerate}
            className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4"
          >
            {isFreePlan && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">🔒</span>
                  <p className="text-xs font-bold text-slate-900">Abonnement requis pour l’IA</p>
                </div>
                <p className="text-[11px] text-slate-600">
                  Souscrivez à un forfait pour que l'IA génère instantanément des réponses diplomates, commerciales et persuasives.
                </p>
                <button
                  type="button"
                  onClick={() => setIsPricingModalOpen(true)}
                  className="mt-1 w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs transition-all active:scale-95 cursor-pointer text-center"
                >
                  Payer & Débloquer l'IA (dès 4 900 FCFA)
                </button>
              </div>
            )}

            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-600" />
              <span>Personnaliser la réponse</span>
            </h3>

            {/* Client Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Prénom / Nom du client (optionnel)
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Ex: Sophie, M. Dupont, Julie..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-violet-600 focus:ring-1 focus:ring-violet-600 shadow-2xs"
              />
            </div>

            {/* Tone Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Ton de communication
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-violet-600 shadow-2xs"
              >
                <option value="Chaleureux & Bienveillant">Chaleureux & Bienveillant (Recommandé)</option>
                <option value="Professionnel & Formel">Professionnel & Formel</option>
                <option value="Direct & Efficace">Direct & Efficace (Précis et concis)</option>
                <option value="Commercial & Incitatif">Commercial & Vendeur</option>
                <option value="Empathique & Apaisant">Empathique & Apaisant (Pour réclamations)</option>
              </select>
            </div>

            {/* Specific details */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Détails complémentaires de la demande
              </label>
              <textarea
                value={specificContext}
                onChange={(e) => setSpecificContext(e.target.value)}
                placeholder={`Ex: ${activeScenario.defaultDetails}`}
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-violet-600 focus:ring-1 focus:ring-violet-600 shadow-2xs"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-violet-300" />
                  <span>Rédaction de la réponse...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-violet-300" />
                  <span>Générer la Réponse Idéale</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Generated Output Card */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs min-h-[400px] flex flex-col justify-between">
            {generatedResponse ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Réponse Prête à l'Emploi
                    </span>
                    <span className="text-[10px] bg-violet-50 text-violet-700 font-semibold px-2 py-0.5 rounded-md border border-violet-200">
                      {activeScenario.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleOpenWhatsApp}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </button>

                    <button
                      onClick={handleCopy}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 border border-slate-200 transition-colors cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-bold">Copié !</span>
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

                {/* Response Text Box */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-line select-text">
                  {generatedResponse}
                </div>

                {/* Share Actions Bar */}
                <ShareActionsBar
                  content={generatedResponse}
                  title={`Réponse Client - ${activeScenario.label}`}
                  category="client_reply"
                  phone={company.whatsapp || company.phone}
                />

                {/* Sales Tip */}
                {salesTip && (
                  <div className="p-3.5 rounded-xl bg-violet-50 border border-violet-200 text-violet-950 text-xs flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-violet-900">Conseil relation client : </span>
                      <span>{salesTip}</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-16 text-slate-400 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 shadow-2xs">
                  <MessageCircleReply className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Aucune réponse générée</h3>
                  <p className="text-xs text-slate-500 max-w-sm mt-1">
                    Sélectionnez une situation, ajustez les informations à gauche puis cliquez sur
                    « Générer la Réponse Idéale ».
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
