import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { generateAIContent } from '../services/geminiService';
import { SocialPostResults } from '../types';
import {
  Share2,
  Sparkles,
  Facebook,
  Instagram,
  Megaphone,
  Flame,
  RefreshCw,
  Send,
} from 'lucide-react';
import { ShareActionsBar } from './ShareActionsBar';

export const SocialGenerator: React.FC = () => {
  const { company, consumeCredit, addHistory, addToast } = useApp();

  const [productName, setProductName] = useState('');
  const [productDetails, setProductDetails] = useState('');
  const [goal, setGoal] = useState('Vente directe & Commande');
  const [targetAudience, setTargetAudience] = useState('');
  const [specialOffer, setSpecialOffer] = useState('');
  const [loading, setLoading] = useState(false);

  const [activeResultTab, setActiveResultTab] = useState<keyof SocialPostResults>('instagram');
  const [results, setResults] = useState<SocialPostResults | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productName.trim()) {
      addToast('warning', 'Champ manquant', 'Veuillez indiquer au moins le nom du produit ou service.');
      return;
    }

    if (!consumeCredit()) {
      return;
    }

    setLoading(true);

    const prompt = `Génère une suite complète de publications et textes promotionnels pour le produit/service suivant :
- Nom du produit ou service : "${productName}"
- Détails & atouts : ${productDetails || 'Non spécifié'}
- Objectif de la campagne : ${goal}
- Public cible : ${targetAudience || 'Clients réguliers et nouveaux prospects'}
- Offre spéciale / Promotion : ${specialOffer || 'Aucune offre particulière'}

Tu DOIS générer exactement les 5 formats demandés en respectant STRICTEMENT les balises suivantes :

[FACEBOOK]
(Rédige une publication Facebook engageante, avec un texte fluide, des puces aérées, un appel à l'action clair et 3-4 hashtags pertinents).
[/FACEBOOK]

[INSTAGRAM]
(Rédige une publication Instagram très esthétique, avec des émojis soignés, une accroche visuelle, les bénéfices clés, une invitation à commenter ou envoyer un MP, et une liste de 10 à 15 hashtags tendance).
[/INSTAGRAM]

[WHATSAPP]
(Rédige un message WhatsApp prêt à être envoyé à des clients ou dans un groupe de diffusion. Utilise la syntaxe WhatsApp avec des étoiles pour le *gras*, des émojis clairs et les coordonnées de l'entreprise).
[/WHATSAPP]

[ADS]
(Rédige un texte publicitaire ultra percutant pour Facebook Ads / Google Ads avec une accroche magnétique, la proposition de valeur unique et un bouton d'action persuasif).
[/ADS]

[SLOGAN]
(Propose 3 slogans ou phrases d'accroche mémorables et percutantes pour ce produit/service).
[/SLOGAN]`;

    try {
      const res = await generateAIContent(prompt, company, 0.75);
      const text = res.text;

      // Extract sections using regex or fallback parser
      const fbMatch = text.match(/\[FACEBOOK\]([\s\S]*?)\[\/FACEBOOK\]/i);
      const instaMatch = text.match(/\[INSTAGRAM\]([\s\S]*?)\[\/INSTAGRAM\]/i);
      const waMatch = text.match(/\[WHATSAPP\]([\s\S]*?)\[\/WHATSAPP\]/i);
      const adsMatch = text.match(/\[ADS\]([\s\S]*?)\[\/ADS\]/i);
      const sloganMatch = text.match(/\[SLOGAN\]([\s\S]*?)\[\/SLOGAN\]/i);

      const parsedResults: SocialPostResults = {
        facebook: fbMatch ? fbMatch[1].trim() : text.slice(0, 400),
        instagram: instaMatch ? instaMatch[1].trim() : text,
        whatsapp: waMatch
          ? waMatch[1].trim()
          : `Bonjour ! 🌟 Découvrez *${productName}* chez *${company.name}* ! Contactez-nous au ${company.whatsapp || company.phone} pour réserver.`,
        adCopy: adsMatch ? adsMatch[1].trim() : `🚀 *${productName}* : La solution idéale pour vous. Commandez maintenant !`,
        slogan: sloganMatch ? sloganMatch[1].trim() : `« ${productName} : Le choix de l'excellence chez ${company.name} »`,
      };

      setResults(parsedResults);

      // Add to history
      addHistory({
        type: 'social',
        title: `Pack Réseaux Sociaux - ${productName}`,
        inputSummary: `${productName} (${goal})`,
        output: `[Instagram]\n${parsedResults.instagram}\n\n[WhatsApp]\n${parsedResults.whatsapp}`,
      });

      addToast('success', 'Publications générées !', 'Vos 5 formats de publication sont prêts.');
    } catch (error) {
      console.error(error);
      addToast('error', 'Erreur de génération', 'Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const tabsConfig = [
    {
      key: 'instagram' as const,
      label: 'Instagram',
      icon: Instagram,
      color: 'text-pink-600',
      badge: 'Hashtags inclus',
    },
    {
      key: 'facebook' as const,
      label: 'Facebook',
      icon: Facebook,
      color: 'text-blue-600',
      badge: 'Post & Story',
    },
    {
      key: 'whatsapp' as const,
      label: 'WhatsApp',
      icon: Send,
      color: 'text-emerald-600',
      badge: 'Format *Gras*',
    },
    {
      key: 'adCopy' as const,
      label: 'Texte Publicitaire',
      icon: Megaphone,
      color: 'text-amber-700',
      badge: 'Ads Copy',
    },
    {
      key: 'slogan' as const,
      label: 'Slogans',
      icon: Flame,
      color: 'text-rose-600',
      badge: '3 Variantes',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 flex items-center justify-center">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Générateur de Publications & Réseaux Sociaux
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Renseignez votre produit ou service et obtenez simultanément 5 déclinaisons prêtes à
              publier.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Inputs */}
        <div className="lg:col-span-5 space-y-6">
          <form onSubmit={handleGenerate} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Détails du produit ou service</span>
            </h2>

            {/* Product Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nom du produit / service <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Ex: Robe d'été fleurie, Menu Dégustation, Massage Relaxant..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-2xs"
                required
              />
            </div>

            {/* Details */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Caractéristiques & Atouts clés
              </label>
              <textarea
                value={productDetails}
                onChange={(e) => setProductDetails(e.target.value)}
                placeholder="Ex: 100% coton bio, fabrication artisanale, disponible en 4 coloris, livraison sous 24h..."
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-2xs"
              />
            </div>

            {/* Campaign Goal */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Objectif de la publication
              </label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-indigo-600 shadow-2xs"
              >
                <option value="Vente directe & Commande">Vente directe & Commande immédiate</option>
                <option value="Promotion & Réduction spéciale">Promotion & Réduction spéciale</option>
                <option value="Nouveauté & Lancement officiel">Nouveauté & Lancement de produit</option>
                <option value="Notoriété & Visibilité de marque">Notoriété & Image de marque</option>
                <option value="Événement & Réservation">Événement & Réservation</option>
              </select>
            </div>

            {/* Offer / Promo */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Offre spéciale ou prix (optionnel)
              </label>
              <input
                type="text"
                value={specialOffer}
                onChange={(e) => setSpecialOffer(e.target.value)}
                placeholder="Ex: -20% ce weekend avec le code WEEKEND20, ou 49€ au lieu de 69€"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-2xs"
              />
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Public cible (optionnel)
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="Ex: Jeunes mamans, amateurs de cuisine bio, chefs d'entreprise..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 shadow-2xs"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !productName.trim()}
              className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-indigo-300" />
                  <span>Génération en cours...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Générer les 5 publications</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Output: Formats View */}
        <div className="lg:col-span-7 space-y-4">
          {/* Format Tabs */}
          <div className="flex flex-wrap gap-1.5 p-1.5 bg-slate-100 border border-slate-200 rounded-2xl">
            {tabsConfig.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeResultTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveResultTab(tab.key)}
                  className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-900' : tab.color}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Results Container */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs min-h-[420px] flex flex-col justify-between">
            {results ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      {tabsConfig.find((t) => t.key === activeResultTab)?.label}
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-md border border-slate-200">
                      {tabsConfig.find((t) => t.key === activeResultTab)?.badge}
                    </span>
                  </div>
                </div>

                {/* Display Output */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-sans select-text">
                  {results[activeResultTab]}
                </div>

                {/* Share Actions Bar */}
                <ShareActionsBar
                  content={results[activeResultTab]}
                  title={`Publication ${tabsConfig.find((t) => t.key === activeResultTab)?.label} - ${productName}`}
                  category={activeResultTab}
                  phone={company.whatsapp || company.phone}
                />

                {/* Useful tip based on tab */}
                <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 text-indigo-950 text-[11px] flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    {activeResultTab === 'instagram' &&
                      'Conseil : Ajoutez une photo lumineuse de haute qualité et taguez votre localisation géographique pour maximiser la portée locale.'}
                    {activeResultTab === 'facebook' &&
                      'Conseil : Posez une question engageante en fin de post pour inciter vos abonnés à commenter.'}
                    {activeResultTab === 'whatsapp' &&
                      'Conseil : Vous pouvez transférer ce message directement à vos listes de diffusion ou dans votre Statut WhatsApp.'}
                    {activeResultTab === 'adCopy' &&
                      'Conseil : Idéal pour tester en publicité sponsorisée avec un budget de 5€/jour pour cibler votre ville.'}
                    {activeResultTab === 'slogan' &&
                      'Conseil : Utilisez ces slogans sur vos affiches, bannières de site ou emballages produits.'}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-16 text-slate-400 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 shadow-2xs">
                  <Share2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Aucune publication générée</h3>
                  <p className="text-xs text-slate-500 max-w-sm mt-1">
                    Complétez le formulaire à gauche et cliquez sur « Générer les 5 publications »
                    pour voir apparaître vos contenus.
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
