import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { generateAIContent } from '../services/geminiService';
import {
  TrendingUp,
  Calculator,
  Percent,
  Sparkles,
  Copy,
  Check,
  Tag,
  FileText,
  Lightbulb,
  ArrowRight,
  RefreshCw,
  Zap,
} from 'lucide-react';

export const SalesTools: React.FC = () => {
  const { company, consumeCredit, addHistory, addToast } = useApp();

  const [activeTool, setActiveTool] = useState<'margin' | 'promo' | 'offer' | 'ideas'>('margin');

  // --- 1. Margin Calculator State ---
  const [costPrice, setCostPrice] = useState<number | string>('35');
  const [sellingPriceInput, setSellingPriceInput] = useState<number | string>('89');
  const [vatRate, setVatRate] = useState<number>(20);
  const [desiredMarginPercent, setDesiredMarginPercent] = useState<number | string>('');

  // --- 2. Promo Generator State ---
  const [promoType, setPromoType] = useState('Vente Flash 48h');
  const [promoProduct, setPromoProduct] = useState('');
  const [discountAmount, setDiscountAmount] = useState('-25% ou 1 acheté = 1 offert');
  const [promoOutput, setPromoOutput] = useState<string | null>(null);

  // --- 3. Commercial Offer State ---
  const [offerClient, setOfferClient] = useState('');
  const [offerService, setOfferService] = useState('');
  const [offerBudget, setOfferBudget] = useState('');
  const [offerOutput, setOfferOutput] = useState<string | null>(null);

  // --- 4. Growth Ideas State ---
  const [growthGoal, setGrowthGoal] = useState('Augmenter le panier moyen et attirer de nouveaux clients');
  const [ideasOutput, setIdeasOutput] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // --- Margin Calculations ---
  const numCost = parseFloat(String(costPrice)) || 0;
  const numSelling = parseFloat(String(sellingPriceInput)) || 0;
  const numVat = parseFloat(String(vatRate)) || 0;

  // Calculations
  const marginAmount = Math.max(0, numSelling - numCost);
  const markupPercent = numCost > 0 ? (marginAmount / numCost) * 100 : 0; // Taux de marge
  const marginRatePercent = numSelling > 0 ? (marginAmount / numSelling) * 100 : 0; // Taux de marque
  const priceWithVat = numSelling * (1 + numVat / 100);
  const multiplierCoeff = numCost > 0 ? priceWithVat / numCost : 0;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    addToast('success', 'Copié !', 'Le contenu est dans votre presse-papiers.');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Generate Promo Copy
  const handleGeneratePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consumeCredit()) return;

    setLoading(true);
    const prompt = `Crée un pack complet de promotion irrésistible :
- Type d'opération : ${promoType}
- Produit / Service concerné : ${promoProduct || 'Nos produits phares'}
- Avantage / Remise : ${discountAmount}

Rédige :
1. Une accroche explosive
2. Le texte d'annonce prêt pour les réseaux et WhatsApp
3. L'argument d'urgence (pourquoi agir maintenant)
4. Les conditions simples`;

    try {
      const res = await generateAIContent(prompt, company, 0.75);
      setPromoOutput(res.text);
      addHistory({
        type: 'sales_tool',
        title: `Promotion - ${promoType}`,
        inputSummary: `${promoProduct || 'Produit'} (${discountAmount})`,
        output: res.text,
      });
      addToast('success', 'Offre promotionnelle générée !');
    } catch (err) {
      console.error(err);
      addToast('error', 'Erreur de génération');
    } finally {
      setLoading(false);
    }
  };

  // Generate Commercial Offer
  const handleGenerateOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consumeCredit()) return;

    setLoading(true);
    const prompt = `Rédige une proposition commerciale / devis synthétique et très convaincant :
- Nom du client / prospect : ${offerClient || 'Client Privilégié'}
- Prestation ou Produit proposé : ${offerService || 'Offre complète sur mesure'}
- Budget / Tarif proposé : ${offerBudget ? `${offerBudget} ${company.currency}` : 'Sur estimation'}

Structure :
1. Rappel du besoin client
2. Solution sur mesure & bénéfices concrets
3. Détail des étapes et livrables
4. Tarif & Modalités
5. Prochaine étape pour valider`;

    try {
      const res = await generateAIContent(prompt, company, 0.7);
      setOfferOutput(res.text);
      addHistory({
        type: 'sales_tool',
        title: `Offre Commerciale - ${offerClient || 'Proposition'}`,
        inputSummary: `${offerService} (${offerBudget || 'Tarif personnalisé'})`,
        output: res.text,
      });
      addToast('success', 'Offre commerciale générée !');
    } catch (err) {
      console.error(err);
      addToast('error', 'Erreur de génération');
    } finally {
      setLoading(false);
    }
  };

  // Generate Sales Growth Ideas
  const handleGenerateIdeas = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consumeCredit()) return;

    setLoading(true);
    const prompt = `Génère 5 idées concrètes, originales et immédiatement applicables pour développer les ventes et le chiffre d'affaires :
- Secteur d'activité de l'entreprise : ${company.sector}
- Objectif spécifique : ${growthGoal}

Pour chaque idée, indique :
1. Le concept en 1 phrase
2. Comment le mettre en place en moins de 48h
3. Le résultat attendu sur le chiffre d'affaires`;

    try {
      const res = await generateAIContent(prompt, company, 0.8);
      setIdeasOutput(res.text);
      addHistory({
        type: 'sales_tool',
        title: `Idées Croissance des Ventes`,
        inputSummary: growthGoal,
        output: res.text,
      });
      addToast('success', 'Stratégies de vente générées !');
    } catch (err) {
      console.error(err);
      addToast('error', 'Erreur de génération');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Outils de Vente & Calculs Financiers
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Calculez vos marges de rentabilité, concevez des promotions percutantes et boostez
              votre chiffre d'affaires.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex flex-wrap gap-1.5 p-1.5 bg-slate-100 border border-slate-200 rounded-2xl">
        <button
          onClick={() => setActiveTool('margin')}
          className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTool === 'margin'
              ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Calculator className="w-4 h-4 text-amber-600" />
          <span>Calculateur de Marge</span>
        </button>

        <button
          onClick={() => setActiveTool('promo')}
          className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTool === 'promo'
              ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Tag className="w-4 h-4 text-amber-600" />
          <span>Créateur de Promotions</span>
        </button>

        <button
          onClick={() => setActiveTool('offer')}
          className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTool === 'offer'
              ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <FileText className="w-4 h-4 text-amber-600" />
          <span>Offre Commerciale</span>
        </button>

        <button
          onClick={() => setActiveTool('ideas')}
          className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTool === 'ideas'
              ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Lightbulb className="w-4 h-4 text-amber-600" />
          <span>Idées Booster Ventes</span>
        </button>
      </div>

      {/* TOOL 1: MARGIN CALCULATOR */}
      {activeTool === 'margin' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Inputs */}
          <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-5">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-amber-600" />
              <span>Paramètres de prix & coût</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Coût d'achat / Prix de revient HT ({company.currency})
              </label>
              <input
                type="number"
                step="0.01"
                value={costPrice}
                onChange={(e) => setCostPrice(e.target.value)}
                placeholder="Ex: 35"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-base font-bold focus:outline-none focus:bg-white focus:border-amber-600 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Prix de vente souhaité HT ({company.currency})
              </label>
              <input
                type="number"
                step="0.01"
                value={sellingPriceInput}
                onChange={(e) => setSellingPriceInput(e.target.value)}
                placeholder="Ex: 89"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-base font-bold focus:outline-none focus:bg-white focus:border-amber-600 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Taux de TVA (%)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[0, 5.5, 10, 20].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setVatRate(rate)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      vatRate === rate
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {rate}%
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Pricing Rule of Thumb */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
              <span className="font-bold text-amber-900">Formule de rentabilité :</span>
              <p className="leading-relaxed text-amber-800">
                Pour assurer la pérennité de votre entreprise, visez un coefficient multiplicateur
                d'au moins 2.0x à 3.0x selon votre secteur d'activité.
              </p>
            </div>
          </div>

          {/* Results Output */}
          <div className="lg:col-span-6 p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Percent className="w-4 h-4 text-emerald-600" />
              <span>Résultats de la simulation</span>
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {/* Marge brute */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 font-semibold">Marge brute HT</span>
                <div className="text-2xl font-extrabold text-emerald-600 mt-1">
                  +{marginAmount.toFixed(2)} {company.currency}
                </div>
                <span className="text-[10px] text-slate-400">Bénéfice brut par unité</span>
              </div>

              {/* Prix TTC */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 font-semibold">Prix client TTC</span>
                <div className="text-2xl font-extrabold text-slate-900 mt-1">
                  {priceWithVat.toFixed(2)} {company.currency}
                </div>
                <span className="text-[10px] text-slate-400">Avec TVA {vatRate}%</span>
              </div>

              {/* Taux de marque */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 font-semibold">Taux de marque</span>
                <div className="text-xl font-extrabold text-indigo-700 mt-1">
                  {marginRatePercent.toFixed(1)}%
                </div>
                <span className="text-[10px] text-slate-400">(Marge / Prix de vente)</span>
              </div>

              {/* Coefficient multiplicateur */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 font-semibold">Coeff Multiplicateur</span>
                <div className="text-xl font-extrabold text-amber-700 mt-1">
                  x{multiplierCoeff.toFixed(2)}
                </div>
                <span className="text-[10px] text-slate-400">Prix TTC / Coût d'achat</span>
              </div>
            </div>

            {/* Diagnostic Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
              <span className="font-bold text-slate-900">Diagnostic de marge :</span>
              <p className="text-slate-600 leading-relaxed">
                {multiplierCoeff >= 2.5
                  ? 'Excellente marge ! Ce niveau permet de couvrir largement vos charges fixes et de financer votre croissance.'
                  : multiplierCoeff >= 1.8
                  ? 'Marge correcte. Assurez-vous de maintenir un volume de vente suffisant pour rentabiliser vos frais généraux.'
                  : 'Marge serrée. Envisagez d’augmenter légèrement le prix de vente ou de négocier votre coût d’achat fournisseur.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TOOL 2: PROMO GENERATOR */}
      {activeTool === 'promo' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <form
            onSubmit={handleGeneratePromo}
            className="lg:col-span-5 p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4"
          >
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Tag className="w-4 h-4 text-amber-600" />
              <span>Concevoir une promotion</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Type de promotion
              </label>
              <select
                value={promoType}
                onChange={(e) => setPromoType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-amber-600 shadow-2xs"
              >
                <option value="Vente Flash 48h">Vente Flash Express (48h / Weekend)</option>
                <option value="Offre de Lancement">Offre de Lancement Nouveau Produit</option>
                <option value="Pack Duo / Trio">Pack Remisé (1 acheté = le 2ème à -50%)</option>
                <option value="Offre Fidélité">Offre Privilège pour Clients Fidèles</option>
                <option value="Déstockage / Fin de Saison">Déstockage Massif / Fin de Série</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Produit(s) concerné(s)
              </label>
              <input
                type="text"
                value={promoProduct}
                onChange={(e) => setPromoProduct(e.target.value)}
                placeholder="Ex: Collection d'été, Menu duo, Forfait détente..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-amber-600 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Remise ou Avantage offert
              </label>
              <input
                type="text"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(e.target.value)}
                placeholder="Ex: -30%, Livraison offerte, 1 cadeau offert..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-amber-600 shadow-2xs"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Génération de la promo...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Générer l'Offre Promotionnelle</span>
                </>
              )}
            </button>
          </form>

          {/* Result */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs min-h-[350px] flex flex-col justify-between">
            {promoOutput ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Texte Promotionnel Prêt à Diffuser
                  </span>
                  <button
                    onClick={() => handleCopy(promoOutput, 'promo')}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 border border-slate-200 cursor-pointer"
                  >
                    {copiedKey === 'promo' ? (
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
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-line select-text">
                  {promoOutput}
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-slate-400 space-y-2">
                <Tag className="w-10 h-10 mx-auto text-slate-400" />
                <p className="text-sm font-semibold text-slate-900">Aucune promotion générée</p>
                <p className="text-xs text-slate-500">
                  Renseignez les champs à gauche et cliquez sur « Générer ».
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TOOL 3: COMMERCIAL OFFER */}
      {activeTool === 'offer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <form
            onSubmit={handleGenerateOffer}
            className="lg:col-span-5 p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4"
          >
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-600" />
              <span>Détails de la proposition</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nom du client ou entreprise prospect
              </label>
              <input
                type="text"
                value={offerClient}
                onChange={(e) => setOfferClient(e.target.value)}
                placeholder="Ex: Société Alpha, M. Martin..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-amber-600 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Prestation / Pack proposé
              </label>
              <input
                type="text"
                value={offerService}
                onChange={(e) => setOfferService(e.target.value)}
                placeholder="Ex: Rénovation salle de bain, Pack communication 3 mois..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-amber-600 shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tarif proposé ({company.currency})
              </label>
              <input
                type="text"
                value={offerBudget}
                onChange={(e) => setOfferBudget(e.target.value)}
                placeholder="Ex: 1450"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-amber-600 shadow-2xs"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Rédaction du devis...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Rédiger l'Offre Commerciale</span>
                </>
              )}
            </button>
          </form>

          {/* Result */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs min-h-[350px] flex flex-col justify-between">
            {offerOutput ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Proposition Commerciale Structurée
                  </span>
                  <button
                    onClick={() => handleCopy(offerOutput, 'offer')}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 border border-slate-200 cursor-pointer"
                  >
                    {copiedKey === 'offer' ? (
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
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-line select-text">
                  {offerOutput}
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-slate-400 space-y-2">
                <FileText className="w-10 h-10 mx-auto text-slate-400" />
                <p className="text-sm font-semibold text-slate-900">Aucune offre rédigée</p>
                <p className="text-xs text-slate-500">
                  Complétez les informations pour générer une proposition commerciale complète.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TOOL 4: SALES GROWTH IDEAS */}
      {activeTool === 'ideas' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <form
            onSubmit={handleGenerateIdeas}
            className="lg:col-span-5 p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4"
          >
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              <span>Générateur d'idées de croissance</span>
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Objectif commercial prioritaire
              </label>
              <textarea
                value={growthGoal}
                onChange={(e) => setGrowthGoal(e.target.value)}
                placeholder="Ex: Vendre plus en semaine, écouler mon stock, lancer un programme de fidélité..."
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-amber-600 shadow-2xs"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Brainstorming IA...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Générer 5 Stratégies de Vente</span>
                </>
              )}
            </button>
          </form>

          {/* Result */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs min-h-[350px] flex flex-col justify-between">
            {ideasOutput ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Stratégies d'Augmentation du Chiffre d'Affaires
                  </span>
                  <button
                    onClick={() => handleCopy(ideasOutput, 'ideas')}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 border border-slate-200 cursor-pointer"
                  >
                    {copiedKey === 'ideas' ? (
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
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-line select-text">
                  {ideasOutput}
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-slate-400 space-y-2">
                <Lightbulb className="w-10 h-10 mx-auto text-slate-400" />
                <p className="text-sm font-semibold text-slate-900">Aucune idée générée</p>
                <p className="text-xs text-slate-500">
                  Cliquez sur « Générer » pour obtenir 5 stratégies personnalisées pour votre
                  secteur.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
