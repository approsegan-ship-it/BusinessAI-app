import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { generateAIContent } from '../services/geminiService';
import { SavedProduct } from '../types';
import {
  Package,
  Sparkles,
  Plus,
  Trash2,
  Copy,
  Check,
  Search,
  Tag,
  ArrowRight,
  RefreshCw,
  ShoppingBag,
  ExternalLink,
  Layers,
} from 'lucide-react';
import { ShareActionsBar } from './ShareActionsBar';

export const ProductCatalog: React.FC = () => {
  const {
    company,
    products,
    user,
    addProduct,
    deleteProduct,
    consumeCredit,
    addHistory,
    addToast,
    setIsPricingModalOpen,
    openPaymentModal,
  } = useApp();

  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Général');
  const [features, setFeatures] = useState('');
  const [benefits, setBenefits] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [loading, setLoading] = useState(false);

  const isFreePlan = user.plan === 'free' || user.maxCredits <= 0;

  // Generated Preview before saving
  const [generatedResult, setGeneratedResult] = useState<{
    title: string;
    description: string;
    bulletPoints: string[];
    cta: string;
  } | null>(null);

  // Search filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [viewProduct, setViewProduct] = useState<SavedProduct | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFreePlan) {
      addToast(
        'warning',
        'Abonnement requis',
        'Envoyez votre paiement au 0163638893 pour activer l’IA et générer des fiches produits.'
      );
      openPaymentModal('starter');
      return;
    }

    if (!name.trim()) {
      addToast('warning', 'Nom requis', 'Veuillez saisir au moins le nom du produit.');
      return;
    }

    if (!consumeCredit()) {
      return;
    }

    setLoading(true);

    const prompt = `Génère une fiche produit complète, persuasive et professionnelle pour le produit suivant :
- Nom du produit : "${name}"
- Prix indicatif : ${price ? `${price} ${company.currency}` : 'Non spécifié'}
- Catégorie : ${category}
- Caractéristiques techniques / composition : ${features || 'Conception soignée de qualité supérieure'}
- Avantages pour l'acheteur : ${benefits || 'Gain de temps, confort et satisfaction garantie'}
- Public cible : ${targetAudience || 'Tous clients'}

Fournis la réponse en respectant STRICTEMENT les balises suivantes :

[TITLE]
(Un titre produit accrocheur, vendeur et optimisé SEO)
[/TITLE]

[DESCRIPTION]
(Un texte descriptif captivant de 2 à 3 paragraphes qui met en scène le produit, ses émotions, ses bénéfices et sa supériorité).
[/DESCRIPTION]

[BULLETS]
- (Point fort 1 concis et impactant)
- (Point fort 2 concis et impactant)
- (Point fort 3 concis et impactant)
- (Point fort 4 concis et impactant)
[/BULLETS]

[CTA]
(Une phrase d'appel à l'action percutante invitant à l'achat immédiat ou à la réservation)
[/CTA]`;

    try {
      const res = await generateAIContent(prompt, company, 0.7);
      const text = res.text;

      const titleMatch = text.match(/\[TITLE\]([\s\S]*?)\[\/TITLE\]/i);
      const descMatch = text.match(/\[DESCRIPTION\]([\s\S]*?)\[\/DESCRIPTION\]/i);
      const bulletsMatch = text.match(/\[BULLETS\]([\s\S]*?)\[\/BULLETS\]/i);
      const ctaMatch = text.match(/\[CTA\]([\s\S]*?)\[\/CTA\]/i);

      const parsedTitle = titleMatch ? titleMatch[1].trim() : `${name} – Qualité & Élégance`;
      const parsedDesc = descMatch
        ? descMatch[1].trim()
        : `Découvrez ${name}, le produit parfait pour répondre à toutes vos exigences. Fabriqué avec soin pour vous offrir une expérience d'exception.`;
      const parsedBullets = bulletsMatch
        ? bulletsMatch[1]
            .trim()
            .split('\n')
            .map((b) => b.replace(/^[-•*]\s*/, '').trim())
            .filter(Boolean)
        : [
            'Conception de haute qualité et finitions soignées',
            'Idéal pour un usage quotidien fiable et durable',
            'Excellent rapport qualité / prix garanti',
          ];
      const parsedCta = ctaMatch
        ? ctaMatch[1].trim()
        : `Commandez votre ${name} dès maintenant chez ${company.name} !`;

      const genData = {
        title: parsedTitle,
        description: parsedDesc,
        bulletPoints: parsedBullets,
        cta: parsedCta,
      };

      setGeneratedResult(genData);

      // Automatically save to product catalog
      const newSaved = addProduct({
        name,
        price: price || 'Sur devis',
        category,
        features,
        benefits,
        targetAudience,
        generatedTitle: parsedTitle,
        generatedDescription: parsedDesc,
        keyBulletPoints: parsedBullets,
        callToAction: parsedCta,
      });

      // Add to history
      addHistory({
        type: 'product',
        title: `Fiche Produit - ${name}`,
        inputSummary: `${name} (${price ? `${price} ${company.currency}` : 'Prix non fixé'})`,
        output: `${parsedTitle}\n\n${parsedDesc}\n\nPoints clés :\n${parsedBullets.map((b) => `• ${b}`).join('\n')}\n\n${parsedCta}`,
      });

      setViewProduct(newSaved);
      addToast('success', 'Fiche produit générée et enregistrée !');
    } catch (err) {
      console.error(err);
      addToast('error', 'Erreur de génération', 'Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    addToast('success', 'Copié !', 'Fiche produit copiée dans le presse-papiers.');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered products list
  const safeProducts = Array.isArray(products) ? products : [];

  const filteredProducts = safeProducts.filter((p) => {
    if (!p) return false;
    const pName = (p.name || '').toLowerCase();
    const pCat = (p.category || '').toLowerCase();
    const pDesc = (p.generatedDescription || '').toLowerCase();
    const query = searchTerm.toLowerCase();
    const matchesSearch = pName.includes(query) || pCat.includes(query) || pDesc.includes(query);
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const categories = Array.from(new Set(safeProducts.map((p) => p?.category || 'Général')));

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Générateur de Fiches Produits & Catalogue
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Transformez les caractéristiques brutes de vos articles en argumentaires de vente
              percutants.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            {safeProducts.length} produit{safeProducts.length > 1 ? 's' : ''} enregistré{safeProducts.length > 1 ? 's' : ''}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Product Inputs */}
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
                  Souscrivez à un forfait pour que l'IA rédige automatiquement le titre accrocheur, les arguments clés et l'appel à l'action.
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

            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Créer une fiche produit</span>
              </h2>
            </div>

            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Nom du produit <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Montre Chrono Sport, Panier Gourmand Terroir..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 shadow-2xs"
                required
              />
            </div>

            {/* Price & Category */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Prix ({company.currency})
                </label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Ex: 49.90"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-emerald-600 shadow-2xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Catégorie
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Ex: Accessoires, Plats, Soins..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-emerald-600 shadow-2xs"
                />
              </div>
            </div>

            {/* Features */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Caractéristiques (matière, taille, détails)
              </label>
              <textarea
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                placeholder="Ex: Étanche 50m, boîtier acier inoxydable, verre saphir anti-rayures, bracelet cuir véritable..."
                rows={2}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-emerald-600 shadow-2xs"
              />
            </div>

            {/* Benefits */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Avantages pour le client (bénéfices concrets)
              </label>
              <textarea
                value={benefits}
                onChange={(e) => setBenefits(e.target.value)}
                placeholder="Ex: Résistance extrême, look chic et sportif, lisibilité parfaite de jour comme de nuit..."
                rows={2}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-emerald-600 shadow-2xs"
              />
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Public cible
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="Ex: Hommes actifs de 25 à 45 ans, passionnés de sport et d'horlogerie"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-emerald-600 shadow-2xs"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-300" />
                  <span>Rédaction IA en cours...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                  <span>Générer et Enregistrer la Fiche</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Area: Active Product View & Saved Catalog */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Product Detailed View */}
          {viewProduct ? (
            <div className="p-6 rounded-3xl bg-white border border-emerald-300 shadow-2xs space-y-4">
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {viewProduct.category}
                    </span>
                    {viewProduct.price && (
                      <span className="text-sm font-extrabold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200">
                        {viewProduct.price} {company.currency}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    {viewProduct.generatedTitle || viewProduct.name}
                  </h3>
                </div>

                <button
                  onClick={() =>
                    handleCopy(
                      `${viewProduct.generatedTitle}\n\nPrix: ${viewProduct.price} ${company.currency}\n\n${viewProduct.generatedDescription}\n\nPoints clés:\n${viewProduct.keyBulletPoints?.map((b) => `• ${b}`).join('\n')}\n\n${viewProduct.callToAction}`,
                      viewProduct.id
                    )
                  }
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 border border-slate-200 shrink-0 cursor-pointer"
                >
                  {copiedId === viewProduct.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Fiche copiée !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-600" />
                      <span>Copier tout</span>
                    </>
                  )}
                </button>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Description persuasive</h4>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  {viewProduct.generatedDescription}
                </p>
              </div>

              {/* Bullet points */}
              {viewProduct.keyBulletPoints && viewProduct.keyBulletPoints.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Points forts & bénéfices</h4>
                  <ul className="space-y-1.5 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-800">
                    {viewProduct.keyBulletPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CTA */}
              {viewProduct.callToAction && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{viewProduct.callToAction}</span>
                </div>
              )}

              {/* Share & WhatsApp Bar */}
              <ShareActionsBar
                content={`*${viewProduct.generatedTitle || viewProduct.name}*\n${viewProduct.price ? `Prix : ${viewProduct.price} ${company.currency}\n\n` : ''}${viewProduct.generatedDescription}\n\n${viewProduct.keyBulletPoints?.map((b) => `• ${b}`).join('\n') || ''}\n\n${viewProduct.callToAction || ''}`}
                title={`Fiche Produit - ${viewProduct.name}`}
                category="product"
                phone={company.whatsapp || company.phone}
              />
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-white border border-slate-200 text-center py-12 text-slate-400 shadow-2xs">
              <Package className="w-10 h-10 mx-auto text-slate-400 mb-2" />
              <p className="text-sm font-semibold text-slate-900">Sélectionnez un produit ci-dessous</p>
              <p className="text-xs text-slate-500 mt-1">
                Ou utilisez le formulaire de gauche pour en générer un nouveau.
              </p>
            </div>
          )}

          {/* Saved Products List */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>Catalogue des produits ({filteredProducts.length})</span>
              </h3>

              {/* Search Bar */}
              <div className="relative w-full sm:w-56">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Rechercher..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:bg-white focus:border-emerald-600 shadow-2xs"
                />
              </div>
            </div>

            {/* List */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                Aucun produit ne correspond à votre recherche.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-1">
                {filteredProducts.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => setViewProduct(prod)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      viewProduct?.id === prod.id
                        ? 'bg-emerald-50/60 border-emerald-400 shadow-xs'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] uppercase font-bold text-slate-500 truncate">
                          {prod.category}
                        </span>
                        {prod.price && (
                          <span className="text-xs font-bold text-emerald-700">
                            {prod.price} {company.currency}
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{prod.name}</h4>
                      <p className="text-[11px] text-slate-600 line-clamp-2 mt-1">
                        {prod.generatedDescription}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-200">
                      <span className="text-[10px] text-indigo-600 font-semibold flex items-center gap-1">
                        <span>Voir la fiche</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteProduct(prod.id);
                          if (viewProduct?.id === prod.id) {
                            setViewProduct(null);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
