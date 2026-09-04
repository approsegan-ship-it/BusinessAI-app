import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  ImageAspectRatio,
  ImageStyle,
  ImageCategory,
  GeneratedImage,
} from '../types';
import { generateImageWithAI, generateAIContent } from '../services/geminiService';
import {
  Image as ImageIcon,
  Sparkles,
  Download,
  Share2,
  Copy,
  Check,
  RefreshCw,
  Sliders,
  Layers,
  ShoppingBag,
  Megaphone,
  Smartphone,
  Eye,
  Trash2,
  Palette,
  Camera,
  Maximize2,
  MessageCircle,
  Zap,
  Info,
} from 'lucide-react';
import { ShareActionsBar } from './ShareActionsBar';

interface PresetPrompt {
  title: string;
  category: ImageCategory;
  prompt: string;
  aspectRatio: ImageAspectRatio;
  style: ImageStyle;
  icon: string;
}

const CATEGORY_TABS: { id: ImageCategory; label: string; icon: any; desc: string }[] = [
  {
    id: 'product',
    label: 'Photo Produit Studio',
    icon: ShoppingBag,
    desc: 'Packshot professionnel, éclairage studio valorisant vos articles',
  },
  {
    id: 'poster',
    label: 'Affiche & Flyer Promo',
    icon: Megaphone,
    desc: 'Affiche percutante avec réduction, accroche et coordonnées',
  },
  {
    id: 'social',
    label: 'Visuel Réseaux Sociaux',
    icon: Smartphone,
    desc: 'Format optimisé pour publications Instagram, Facebook et WhatsApp',
  },
  {
    id: 'mockup',
    label: 'Mise en Situation 3D',
    icon: Layers,
    desc: 'Mockup réaliste et moderne pour valoriser vos offres',
  },
];

const ASPECT_RATIOS: { id: ImageAspectRatio; label: string; ratioDesc: string; iconLabel: string }[] = [
  { id: '1:1', label: 'Carré (1:1)', ratioDesc: 'Instagram, WhatsApp', iconLabel: '1:1' },
  { id: '9:16', label: 'Vertical (9:16)', ratioDesc: 'Story, Reels, TikTok', iconLabel: '9:16' },
  { id: '16:9', label: 'Paysage (16:9)', ratioDesc: 'Facebook, Web, Bannières', iconLabel: '16:9' },
  { id: '4:3', label: 'Catalogue (4:3)', ratioDesc: 'Fiches produits', iconLabel: '4:3' },
  { id: '3:4', label: 'Portrait (3:4)', ratioDesc: 'Lookbook & Affiches', iconLabel: '3:4' },
];

const IMAGE_STYLES: { id: ImageStyle; label: string; desc: string; badgeColor: string }[] = [
  {
    id: 'photorealistic',
    label: 'Photographie Réaliste HD',
    desc: 'Lumière naturelle, textures authentiques et détails nets',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    id: 'studio_minimalist',
    label: 'Studio Minimaliste Luxe',
    desc: 'Fond épuré, contraste doux et ambiance haut de gamme',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    id: 'commercial_3d',
    label: 'Rendu 3D Commercial',
    desc: 'Éclairage volumétrique moderne, reflets et perspectives',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  {
    id: 'vibrant_afrobeats',
    label: 'Chaud & Vibrant Afrobeats',
    desc: 'Tonalités dorées, ocres et énergiques pour captiver l’œil',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  {
    id: 'luxury_gold',
    label: 'Or & Noir Premium',
    desc: 'Élégance prestigieuse pour bijoux, parfums et VIP',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  {
    id: 'modern_graphic',
    label: 'Graphisme Moderne Épuré',
    desc: 'Typographie soignée et visuel d’impact marketing',
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
  },
];

export const ImageGenerator: React.FC = () => {
  const { company, addHistoryItem, showNotification } = useApp();

  const [category, setCategory] = useState<ImageCategory>('product');
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<ImageAspectRatio>('1:1');
  const [style, setStyle] = useState<ImageStyle>('photorealistic');
  const [includeBranding, setIncludeBranding] = useState<boolean>(true);

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isEnhancingPrompt, setIsEnhancingPrompt] = useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [historyImages, setHistoryImages] = useState<GeneratedImage[]>(() => {
    try {
      const saved = localStorage.getItem('businessai_generated_images');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [copied, setCopied] = useState<boolean>(false);
  const [previewModalOpen, setPreviewModalOpen] = useState<boolean>(false);

  // Generate suggested prompts based on company sector
  const getSectorPresets = (): PresetPrompt[] => {
    const s = company.sector;
    const name = company.name || 'Notre Boutique';

    if (s === 'Boutique & Prêt-à-porter') {
      return [
        {
          title: 'Robe de Soirée Luxe',
          category: 'product',
          prompt: `Sublime robe de soirée africaine brodée d'or sur mannequin élégant dans une boutique chic avec éclairage doux et fond marbre blanc pour ${name}`,
          aspectRatio: '3:4',
          style: 'luxury_gold',
          icon: '👗',
        },
        {
          title: 'Promo Flash -30% Mode',
          category: 'poster',
          prompt: `Affiche publicitaire vibrante annonçant -30% sur toute la collection de prêt-à-porter avec sac de shopping chic et logo doré ${name}`,
          aspectRatio: '1:1',
          style: 'vibrant_afrobeats',
          icon: '🏷️',
        },
        {
          title: 'Nouvelle Collection Chaussures',
          category: 'social',
          prompt: `Paire de chaussures escarpins de luxe en cuir posée sur un podium en marbre noir avec reflets dorés et éclairage studio photoréaliste`,
          aspectRatio: '9:16',
          style: 'studio_minimalist',
          icon: '👠',
        },
      ];
    }

    if (s === 'Restaurant & Alimentation') {
      return [
        {
          title: 'Plat Signature Gourmand',
          category: 'product',
          prompt: `Assiette gastronomique savoureuse garnie avec soins, vapeur fumante appétissante, éclairage chaleureux de restaurant par ${name}`,
          aspectRatio: '4:3',
          style: 'photorealistic',
          icon: '🍲',
        },
        {
          title: 'Menu Spécial Déjeuner',
          category: 'poster',
          prompt: `Affiche de restaurant élégante présentant le Menu Spécial du Jour avec boisson fraîche offerte et commande WhatsApp`,
          aspectRatio: '1:1',
          style: 'modern_graphic',
          icon: '🍔',
        },
        {
          title: 'Livraison Rapide Repas',
          category: 'social',
          prompt: `Boîte de repas gourmet soigneusement emballée prête pour livraison à domicile avec packaging éco-responsable moderne`,
          aspectRatio: '9:16',
          style: 'vibrant_afrobeats',
          icon: '🛵',
        },
      ];
    }

    if (s === 'Beauté, Coiffure & Bien-être') {
      return [
        {
          title: 'Flacon Sérum Beauté Naturel',
          category: 'product',
          prompt: `Flacon cosmétique en verre ambré avec sérum capillaire posé sur de l'eau claire avec feuilles tropicales et lumière du soleil dorée`,
          aspectRatio: '1:1',
          style: 'studio_minimalist',
          icon: '✨',
        },
        {
          title: 'Forfait Coiffure & Soin',
          category: 'poster',
          prompt: `Affiche salon de coiffure moderne mettant en valeur une coupe sublime avec texture de cheveux éclatante et offre bienvenue`,
          aspectRatio: '3:4',
          style: 'luxury_gold',
          icon: '💇‍♀️',
        },
      ];
    }

    // Default presets
    return [
      {
        title: 'Packshot Produit Vedette',
        category: 'product',
        prompt: `Photo de produit phare en studio professionnel sur fond blanc neutre avec ombres douces et mise en valeur des finitions haut de gamme`,
        aspectRatio: '1:1',
        style: 'photorealistic',
        icon: '📦',
      },
      {
        title: 'Affiche Promotionnelle WhatsApp',
        category: 'poster',
        prompt: `Affiche publicitaire moderne avec offre spéciale, badge de réduction et coordonnées WhatsApp visibles pour ${name}`,
        aspectRatio: '1:1',
        style: 'vibrant_afrobeats',
        icon: '📢',
      },
      {
        title: 'Visuel Story Plein Écran',
        category: 'social',
        prompt: `Visuel vertical captivant pour story TikTok et WhatsApp mettant en avant la qualité et la disponibilité immédiate du produit`,
        aspectRatio: '9:16',
        style: 'commercial_3d',
        icon: '📱',
      },
    ];
  };

  const presets = getSectorPresets();

  // Set default prompt if empty
  useEffect(() => {
    if (!prompt && presets.length > 0) {
      setPrompt(presets[0].prompt);
    }
  }, [company.sector]);

  // Save history to localStorage
  const saveImageToHistory = (image: GeneratedImage) => {
    const updated = [image, ...historyImages.filter((img) => img.id !== image.id)].slice(0, 20);
    setHistoryImages(updated);
    try {
      localStorage.setItem('businessai_generated_images', JSON.stringify(updated));
    } catch {
      // Ignore quota errors
    }
  };

  // Delete image from history
  const deleteImage = (id: string) => {
    const updated = historyImages.filter((img) => img.id !== id);
    setHistoryImages(updated);
    try {
      localStorage.setItem('businessai_generated_images', JSON.stringify(updated));
    } catch {
      // Ignore
    }
    if (currentImage?.id === id) {
      setCurrentImage(updated[0] || null);
    }
    showNotification('Image supprimée de l’historique', 'info');
  };

  // Enhance prompt with AI
  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) return;
    setIsEnhancingPrompt(true);

    try {
      const enrichPrompt = `Tu es un directeur artistique professionnel en photographie publicitaire et génération d'images IA.
Transforme cette idée en un prompt descriptif ultra-précis pour une image commerciale vendeur :
"${prompt}"

Consignes :
- Décris l'éclairage (lumière de studio, reflets doux, golden hour)
- Décris la composition et le cadrage (centré, gros plan, 45 degrés)
- Décris les matières et textures réalistes
- Reste concis (3 phrases max)
- Donne UNIQUEMENT le prompt amélioré en français, sans commentaire.`;

      const result = await generateAIContent(enrichPrompt, company);
      if (result.text) {
        setPrompt(result.text.trim().replace(/^["']|["']$/g, ''));
        showNotification('Prompt enrichi avec succès !', 'success');
      }
    } catch (err) {
      showNotification('Impossible d’enrichir le prompt pour le moment', 'error');
    } finally {
      setIsEnhancingPrompt(false);
    }
  };

  // Generate Image
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      showNotification('Veuillez décrire le visuel à générer', 'error');
      return;
    }

    setIsGenerating(true);

    try {
      // Prepend company branding if toggled
      let enrichedPrompt = prompt.trim();
      if (includeBranding && company.name) {
        enrichedPrompt += ` mettant en valeur la marque ${company.name} (${company.sector})`;
      }

      const result = await generateImageWithAI(
        enrichedPrompt,
        aspectRatio,
        style,
        company
      );

      const newImage: GeneratedImage = {
        id: 'img_' + Date.now(),
        title: prompt.slice(0, 40) + '...',
        prompt: enrichedPrompt,
        imageUrl: result.imageUrl,
        aspectRatio,
        style,
        category,
        createdAt: new Date().toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
        }),
        modelUsed: result.modelUsed,
        isFallback: result.isFallback,
      };

      setCurrentImage(newImage);
      saveImageToHistory(newImage);

      addHistoryItem({
        title: `Visuel IA : ${newImage.title}`,
        type: 'image',
        content: `Prompt : ${enrichedPrompt}\nStyle : ${style}\nFormat : ${aspectRatio}`,
      });

      if (result.warning) {
        showNotification(result.warning, 'info');
      } else {
        showNotification('Visuel généré avec succès !', 'success');
      }
    } catch (error: any) {
      console.error('Erreur génération image:', error);
      showNotification('Erreur lors de la génération. Veuillez réessayer.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  // Download Image
  const handleDownload = () => {
    if (!currentImage) return;

    const link = document.createElement('a');
    link.href = currentImage.imageUrl;
    link.download = `BusinessAI_${currentImage.id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotification('Téléchargement du visuel lancé !', 'success');
  };

  // Copy Image link or data
  const handleCopy = () => {
    if (!currentImage) return;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentImage.imageUrl);
      setCopied(true);
      showNotification('Lien de l’image copié dans le presse-papier !', 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Apply a preset
  const applyPreset = (p: PresetPrompt) => {
    setPrompt(p.prompt);
    setCategory(p.category);
    setAspectRatio(p.aspectRatio);
    setStyle(p.style);
    showNotification(`Modèle "${p.title}" appliqué !`, 'info');
  };

  // Format ratio class
  const getAspectRatioClass = (ratio: ImageAspectRatio) => {
    switch (ratio) {
      case '1:1':
        return 'aspect-square';
      case '9:16':
        return 'aspect-[9/16] max-w-[340px]';
      case '16:9':
        return 'aspect-video';
      case '4:3':
        return 'aspect-[4/3]';
      case '3:4':
        return 'aspect-[3/4] max-w-[400px]';
      default:
        return 'aspect-square';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-indigo-600 to-sky-500 rounded-xl text-white shadow-md shadow-indigo-100">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                Générateur d'Images &amp; Visuels IA
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                  Gemini Imagen 3
                </span>
              </h1>
              <p className="text-sm text-gray-600 mt-0.5">
                Créez des photos de produits en studio, affiches publicitaires et visuels promotionnels aux couleurs de{' '}
                <span className="font-semibold text-gray-800">{company.name || 'votre entreprise'}</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Quick info tag */}
        <div className="flex items-center gap-2 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <span>Rendu HD • Téléchargement PNG • Partage WhatsApp immédiat</span>
        </div>
      </div>

      {/* Preset Suggestions Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" /> Idées prêtes à l'emploi pour {company.sector}
          </span>
          <span className="text-gray-400 font-normal">Cliquez pour appliquer</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={() => applyPreset(p)}
              className="text-left p-3 rounded-xl border border-gray-200 bg-white hover:border-indigo-400 hover:shadow-sm transition-all group flex items-start gap-3"
            >
              <span className="text-2xl p-1 bg-gray-50 rounded-lg group-hover:scale-110 transition-transform">
                {p.icon}
              </span>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-xs text-gray-900 group-hover:text-indigo-600 truncate">
                  {p.title}
                </div>
                <div className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">{p.prompt}</div>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-400">
                  <span className="font-medium bg-gray-100 px-1.5 py-0.2 rounded">{p.aspectRatio}</span>
                  <span>•</span>
                  <span>{p.category}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Workspace: Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Generator Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-6 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          {/* Category Tabs */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              1. Type de visuel
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORY_TABS.map((tab) => {
                const Icon = tab.icon;
                const isSelected = category === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setCategory(tab.id)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl text-left border text-xs font-semibold transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 shadow-sm'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-indigo-600' : 'text-gray-500'}`} />
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Prompt Input & AI Enhancement */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                2. Description du visuel (Prompt)
              </label>
              <button
                type="button"
                onClick={handleEnhancePrompt}
                disabled={isEnhancingPrompt || !prompt.trim()}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 disabled:opacity-50 flex items-center gap-1 transition-colors"
                title="Enrichir avec l'IA pour un éclairage et des détails professionnels"
              >
                {isEnhancingPrompt ? (
                  <RefreshCw className="w-3 h-3 animate-spin" />
                ) : (
                  <Sparkles className="w-3 h-3 text-amber-500" />
                )}
                <span>Améliorer avec l'IA</span>
              </button>
            </div>
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                placeholder="Exemple : Flacon de parfum de luxe sur fond d'eau avec reflets dorés, éclairage studio doux, détails ultra-nets..."
                className="w-full text-sm rounded-xl border border-gray-300 p-3.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-gray-400"
              />
            </div>
            <p className="text-[11px] text-gray-500 mt-1">
              Astuce : précisez le produit, la couleur, le fond et l’ambiance lumineuse désirée.
            </p>
          </div>

          {/* Aspect Ratio Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              3. Format &amp; Ratio d'aspect
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {ASPECT_RATIOS.map((r) => {
                const isSelected = aspectRatio === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => setAspectRatio(r.id)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 font-bold shadow-sm'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-xs font-bold">{r.iconLabel}</div>
                    <div className="text-[10px] text-gray-500 truncate mt-0.5">{r.label.split(' ')[0]}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Visual Style Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              4. Ambiance &amp; Style Visuel
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {IMAGE_STYLES.map((st) => {
                const isSelected = style === st.id;
                return (
                  <button
                    key={st.id}
                    onClick={() => setStyle(st.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`text-xs font-semibold ${isSelected ? 'text-indigo-700' : 'text-gray-900'}`}>
                      {st.label}
                    </div>
                    <div className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">{st.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Branding Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200">
            <div>
              <div className="text-xs font-semibold text-gray-800">Personnalisation Entreprise</div>
              <div className="text-[11px] text-gray-500">
                Intégrer le nom de <span className="font-medium text-gray-700">{company.name || 'votre marque'}</span> et coordonnées
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={includeBranding}
                onChange={(e) => setIncludeBranding(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {/* Action Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-700 to-sky-600 hover:from-indigo-700 hover:to-sky-700 shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2.5 transition-all"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Génération du visuel en cours...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Générer le Visuel avec l'IA</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Preview & Output Canvas (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Visual Frame */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center">
            <div className="w-full flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Aperçu Rendu HD</span>
              </div>
              {currentImage && (
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <span className="bg-gray-100 px-2 py-0.5 rounded font-mono font-medium">{currentImage.aspectRatio}</span>
                  <span>•</span>
                  <span>{currentImage.modelUsed}</span>
                </div>
              )}
            </div>

            {/* Display Box */}
            <div className="w-full flex justify-center items-center py-4 bg-gray-950/5 rounded-2xl border border-dashed border-gray-300 min-h-[360px] overflow-hidden relative">
              {isGenerating ? (
                <div className="text-center p-8 space-y-4 max-w-sm animate-pulse">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 animate-spin" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">Composition du visuel en cours</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Calcul de l'éclairage, textures et mise en valeur de votre produit...
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full w-2/3 animate-[pulse_1s_ease-in-out_infinite]"></div>
                  </div>
                </div>
              ) : currentImage ? (
                <div className="relative group w-full flex justify-center">
                  <img
                    src={currentImage.imageUrl}
                    alt={currentImage.title}
                    referrerPolicy="no-referrer"
                    className={`rounded-xl shadow-lg object-contain transition-transform duration-300 group-hover:scale-[1.01] ${getAspectRatioClass(
                      currentImage.aspectRatio
                    )}`}
                  />

                  {/* Overlay Quick Action Bar on Hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-3">
                    <button
                      onClick={() => setPreviewModalOpen(true)}
                      className="p-3 bg-white/90 hover:bg-white text-gray-800 rounded-full shadow-lg transition-transform hover:scale-110"
                      title="Agrandir en plein écran"
                    >
                      <Maximize2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleDownload}
                      className="p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg transition-transform hover:scale-110"
                      title="Télécharger en PNG"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center p-8 space-y-3 max-w-sm">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Camera className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">Aucun visuel généré</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Sélectionnez un modèle ou saisissez votre description, puis cliquez sur "Générer le Visuel avec l'IA".
                    </p>
                  </div>
                  <button
                    onClick={handleGenerate}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Générer mon premier visuel
                  </button>
                </div>
              )}
            </div>

            {/* Actions for Current Image */}
            {currentImage && (
              <div className="w-full mt-6 space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <button
                    onClick={handleDownload}
                    className="py-2.5 px-4 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Télécharger HD</span>
                  </button>

                  <button
                    onClick={handleCopy}
                    className="py-2.5 px-4 rounded-xl font-semibold text-xs text-gray-700 bg-gray-100 hover:bg-gray-200 flex items-center justify-center gap-2 transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copied ? 'Copié !' : 'Copier Image'}</span>
                  </button>

                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                      `🔥 Découvrez notre visuel promotionnel pour ${company.name} : ${currentImage.title}\nContactez-nous au ${company.whatsapp || company.phone || '0163638893'}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="col-span-2 sm:col-span-1 py-2.5 px-4 rounded-xl font-semibold text-xs text-white bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Partager WhatsApp</span>
                  </a>
                </div>

                {/* Share actions bar */}
                <ShareActionsBar
                  title={currentImage.title}
                  text={`Visuel promotionnel créé avec l'IA pour ${company.name || 'notre entreprise'}`}
                  fileName={`Visuel_${company.name || 'BusinessAI'}.png`}
                />
              </div>
            )}
          </div>

          {/* History Gallery of Recent Generated Images */}
          {historyImages.length > 0 && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-indigo-600" />
                  Galerie de vos créations ({historyImages.length})
                </h3>
                <span className="text-xs text-gray-400">Sauvegardé localement</span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {historyImages.map((img) => {
                  const isCurrent = currentImage?.id === img.id;
                  return (
                    <div
                      key={img.id}
                      onClick={() => setCurrentImage(img)}
                      className={`relative group cursor-pointer rounded-xl overflow-hidden border transition-all ${
                        isCurrent
                          ? 'ring-2 ring-indigo-600 border-indigo-600'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <img
                        src={img.imageUrl}
                        alt={img.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-24 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteImage(img.id);
                          }}
                          className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-1">
                        <div className="text-[10px] text-white font-medium truncate">{img.title}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Preview Modal */}
      {previewModalOpen && currentImage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="font-bold text-sm text-gray-900 truncate pr-4">{currentImage.title}</div>
              <button
                onClick={() => setPreviewModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 font-bold p-1 text-lg leading-none"
              >
                ✕
              </button>
            </div>
            <div className="p-4 flex-1 flex items-center justify-center bg-gray-950 overflow-auto">
              <img
                src={currentImage.imageUrl}
                alt={currentImage.title}
                referrerPolicy="no-referrer"
                className="max-h-[75vh] object-contain rounded-lg"
              />
            </div>
            <div className="p-4 bg-gray-50 flex items-center justify-between">
              <span className="text-xs text-gray-500 font-mono">
                Format {currentImage.aspectRatio} • {currentImage.style}
              </span>
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                Télécharger
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
