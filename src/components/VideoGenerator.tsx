import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  VideoFormat,
  VideoObjective,
  VideoDuration,
  GeneratedVideoScript,
  VideoScene,
} from '../types';
import { generateVideoScriptWithAI } from '../services/geminiService';
import {
  Video,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Smartphone,
  Copy,
  Check,
  Download,
  Share2,
  Music,
  Camera,
  Layers,
  FileText,
  Clock,
  Zap,
  Flame,
  MessageCircle,
  Film,
  Sliders,
  ChevronRight,
  ChevronLeft,
  Tv,
  Maximize2,
  Minimize2,
  Send,
  Eye,
  Hash,
} from 'lucide-react';
import { ShareActionsBar } from './ShareActionsBar';

const VIDEO_OBJECTIVES: { id: VideoObjective; label: string; icon: string; desc: string }[] = [
  {
    id: 'product_demo',
    label: 'Déballage & Démo Produit',
    icon: '📦',
    desc: 'Montrer la qualité, l’usage réel et séduire dès les premières secondes.',
  },
  {
    id: 'flash_promo',
    label: 'Promo Flash & Urgence',
    icon: '⚡',
    desc: 'Offre limitée, sentiment d’urgence et incitation à commander immédiatement.',
  },
  {
    id: 'customer_review',
    label: 'Témoignage & Preuve Sociale',
    icon: '⭐',
    desc: 'Mettre en valeur un client satisfait, avant/après et rassurer les acheteurs.',
  },
  {
    id: 'behind_scenes',
    label: 'Coulisses & Fabrication',
    icon: '🎬',
    desc: 'L’histoire de votre atelier ou boutique, authenticité et savoir-faire.',
  },
  {
    id: 'expert_tip',
    label: 'Conseil Pro & Hook Anti-Scroll',
    icon: '💡',
    desc: 'Résoudre un problème client en 30s puis proposer votre solution.',
  },
  {
    id: 'new_launch',
    label: 'Lancement de Nouveauté',
    icon: '🚀',
    desc: 'Créer de l’attente (hype), exclusivité et découverte en avant-première.',
  },
];

const VIDEO_FORMATS: { id: VideoFormat; label: string; ratio: string; platforms: string; icon: any }[] = [
  {
    id: 'tiktok_reels',
    label: 'TikTok, Reels & Shorts',
    ratio: '9:16',
    platforms: 'TikTok, Instagram Reels, YouTube Shorts',
    icon: Smartphone,
  },
  {
    id: 'whatsapp_status',
    label: 'Statut WhatsApp & Stories',
    ratio: '9:16',
    platforms: 'Statuts WhatsApp Business, Facebook Stories',
    icon: MessageCircle,
  },
  {
    id: 'feed_square',
    label: 'Feed Facebook & Insta (1:1)',
    ratio: '1:1',
    platforms: 'Feed Instagram, Posts Facebook, LinkedIn',
    icon: Tv,
  },
  {
    id: 'youtube_landscape',
    label: 'YouTube & Vidéo Présentation',
    ratio: '16:9',
    platforms: 'YouTube, Site Web, Télévision',
    icon: Film,
  },
];

const VIDEO_PRESETS = [
  {
    title: '👗 Vêtement / Robe Tendance',
    topic: 'Robe de soirée élégante en tissu satiné',
    objective: 'product_demo' as VideoObjective,
    duration: '30s' as VideoDuration,
    format: 'tiktok_reels' as VideoFormat,
    details: 'Coupe ajustée, disponible de la taille S à XXL. Prix promo 15 000 FCFA avec livraison gratuite à Abidjan.',
  },
  {
    title: '🍔 Fast-Food / Menu Spécial',
    topic: 'Nouveau Burger Gourmet & Frites Maison',
    objective: 'flash_promo' as VideoObjective,
    duration: '15s' as VideoDuration,
    format: 'whatsapp_status' as VideoFormat,
    details: 'Offre du weekend : 1 Menu acheté = 1 boisson offerte ! Commande WhatsApp avant 21h.',
  },
  {
    title: '💇 Coiffure & Soin Capillaire',
    topic: 'Lissage Brésilien & Soin Protecteur',
    objective: 'customer_review' as VideoObjective,
    duration: '30s' as VideoDuration,
    format: 'tiktok_reels' as VideoFormat,
    details: 'Brillance miroir garantie 3 mois. Prenez rendez-vous au salon ou à domicile.',
  },
  {
    title: '📱 Accessoire Tech / Écouteurs',
    topic: 'Écouteurs sans fil avec réduction de bruit',
    objective: 'product_demo' as VideoObjective,
    duration: '30s' as VideoDuration,
    format: 'tiktok_reels' as VideoFormat,
    details: 'Autonomie 24h, son stéréo haute définition, résistant à l’eau.',
  },
];

export const VideoGenerator: React.FC = () => {
  const { company, user, consumeCredit, addHistory, addToast, openPaymentModal, formatMoney } = useApp();

  // Form State
  const [productOrTopic, setProductOrTopic] = useState('');
  const [objective, setObjective] = useState<VideoObjective>('product_demo');
  const [format, setFormat] = useState<VideoFormat>('tiktok_reels');
  const [duration, setDuration] = useState<VideoDuration>('30s');
  const [toneStyle, setToneStyle] = useState('Dynamique, vendeur et percutant');
  const [details, setDetails] = useState('');
  const [includeCompanyDetails, setIncludeCompanyDetails] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Results State
  const [generatedScript, setGeneratedScript] = useState<GeneratedVideoScript | null>(null);
  const [activeTab, setActiveTab] = useState<'simulator' | 'scenes' | 'teleprompter' | 'srt' | 'music' | 'post'>('simulator');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Simulator Player State
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [isTTSActive, setIsTTSActive] = useState(false);
  const [isTeleprompterFullscreen, setIsTeleprompterFullscreen] = useState(false);
  const [teleprompterSpeed, setTeleprompterSpeed] = useState(2); // 1 = slow, 2 = normal, 3 = fast
  const teleprompterRef = useRef<HTMLDivElement>(null);

  // Apply a preset
  const handleApplyPreset = (preset: typeof VIDEO_PRESETS[0]) => {
    setProductOrTopic(preset.topic);
    setObjective(preset.objective);
    setDuration(preset.duration);
    setFormat(preset.format);
    setDetails(preset.details);
    addToast('info', 'Modèle appliqué', `Le modèle "${preset.title}" a été chargé.`);
  };

  // Generation Handler
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!productOrTopic.trim()) {
      addToast('error', 'Champ requis', 'Veuillez indiquer le produit ou le sujet de la vidéo.');
      return;
    }

    // Paywall verification: requires an active subscription
    if (user.plan === 'free') {
      addToast(
        'warning',
        'Abonnement requis',
        'Envoyez votre paiement au 0163638893 pour activer l’IA et générer vos vidéos marketing.'
      );
      openPaymentModal('starter');
      return;
    }

    // Check credits
    if (user.availableCredits <= 0) {
      addToast('warning', 'Crédits épuisés', 'Vous avez atteint la limite de générations pour ce cycle.');
      openPaymentModal('starter');
      return;
    }

    setIsLoading(true);
    setIsPlaying(false);
    setPlaybackTime(0);
    setCurrentSceneIndex(0);

    try {
      const result = await generateVideoScriptWithAI({
        productOrTopic: productOrTopic.trim(),
        objective,
        format,
        duration,
        toneStyle,
        details: includeCompanyDetails
          ? `${details ? details + ' - ' : ''}Entreprise : ${company.name || 'Notre Boutique'}, WhatsApp : ${company.whatsapp || 'Non renseigné'}, Devise : ${company.currency || 'FCFA'}, Adresse : ${company.address || 'Livraison partout'}`
          : details,
        company,
      });

      setGeneratedScript(result.script);
      consumeCredit(1);

      // Save to History
      addHistory({
        type: 'video',
        title: `Vidéo : ${result.script.title}`,
        inputSummary: `${productOrTopic} (${duration} - ${format})`,
        output: result.script.voiceoverFullScript,
        metadata: {
          format,
          objective,
          duration,
          scenesCount: result.script.scenes.length,
          hook: result.script.hook,
        },
      });

      addToast(
        'success',
        'Script vidéo généré !',
        `Votre storyboard vidéo (${result.script.scenes.length} scènes) est prêt avec voix-off et sous-titres.`
      );
    } catch (error) {
      console.error('Erreur génération vidéo:', error);
      addToast('error', 'Erreur de génération', 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  // Copy helper
  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    addToast('success', 'Copié !', 'Le texte a été copié dans votre presse-papiers.');
    setTimeout(() => setCopiedField(null), 2500);
  };

  // Download SRT file
  const handleDownloadSRT = () => {
    if (!generatedScript?.srtSubtitles) return;
    const blob = new Blob([generatedScript.srtSubtitles], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sous-titres-${(generatedScript.title || 'video').replace(/\s+/g, '_').toLowerCase()}.srt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addToast('success', 'Fichier téléchargé', 'Le fichier de sous-titres .SRT a été enregistré.');
  };

  // Download Full Script TXT
  const handleDownloadFullScript = () => {
    if (!generatedScript) return;
    const content = `🎬 STORYBOARD & SCRIPT VIDÉO - BUSINESSAI
==================================================
Titre : ${generatedScript.title}
Format : ${generatedScript.format} | Durée : ${generatedScript.duration}
Accroche (Hook) : ${generatedScript.hook}

--------------------------------------------------
SCÈNES DU STORYBOARD
--------------------------------------------------
${generatedScript.scenes
  .map(
    (s) => `
[Scène ${s.sceneNumber}] ${s.title} (${s.timeRange})
- Visuel : ${s.visualDescription}
- Caméra : ${s.cameraDirection}
- Voix-off : "${s.voiceoverText}"
- Texte écran : "${s.screenText}"
- Son : ${s.soundEffectOrMusic}
`
  )
  .join('\n')}

--------------------------------------------------
SCRIPT VOIX-OFF INTÉGRAL MOT À MOT
--------------------------------------------------
${generatedScript.voiceoverFullScript}

--------------------------------------------------
MUSIQUE & AUDIO CONSEILLÉ
--------------------------------------------------
Genre : ${generatedScript.recommendedMusic.genre}
Ambiance : ${generatedScript.recommendedMusic.mood}
BPM : ${generatedScript.recommendedMusic.bpm}
Recherche audio : ${generatedScript.recommendedMusic.searchKeywords}

--------------------------------------------------
PUBLICATION RÉSEAUX SOCIAUX
--------------------------------------------------
${generatedScript.captionAndHashtags.postCaption}

Hashtags : ${generatedScript.captionAndHashtags.hashtags.join(' ')}
`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `script-video-${(generatedScript.title || 'video').replace(/\s+/g, '_').toLowerCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    addToast('success', 'Script téléchargé', 'Le dossier de production complet a été téléchargé en .txt.');
  };

  // TTS Speech Player
  const speakSceneVoiceover = (text: string) => {
    if (!('speechSynthesis' in window)) {
      addToast('info', 'Non supporté', 'La synthèse vocale n’est pas disponible sur ce navigateur.');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      // Continue or handled by timer
    };

    window.speechSynthesis.speak(utterance);
  };

  // Simulator Timer Loop
  useEffect(() => {
    let interval: any = null;
    if (isPlaying && generatedScript && generatedScript.scenes.length > 0) {
      interval = setInterval(() => {
        setPlaybackTime((prev) => {
          const next = prev + 1;
          const totalSecs = generatedScript.totalDurationSeconds || 30;

          // Calculate current scene
          let accumulated = 0;
          let foundIndex = 0;
          for (let i = 0; i < generatedScript.scenes.length; i++) {
            accumulated += generatedScript.scenes[i].durationSeconds || 4;
            if (next <= accumulated) {
              foundIndex = i;
              break;
            }
          }

          if (foundIndex !== currentSceneIndex && foundIndex < generatedScript.scenes.length) {
            setCurrentSceneIndex(foundIndex);
            if (isTTSActive) {
              speakSceneVoiceover(generatedScript.scenes[foundIndex].voiceoverText);
            }
          }

          if (next >= totalSecs) {
            setIsPlaying(false);
            window.speechSynthesis?.cancel();
            return totalSecs;
          }

          return next;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isPlaying, currentSceneIndex, generatedScript, isTTSActive]);

  // Teleprompter Auto-scroll
  useEffect(() => {
    let scrollInterval: any = null;
    if (activeTab === 'teleprompter' && isPlaying && teleprompterRef.current) {
      scrollInterval = setInterval(() => {
        if (teleprompterRef.current) {
          teleprompterRef.current.scrollTop += teleprompterSpeed;
        }
      }, 50);
    }
    return () => clearInterval(scrollInterval);
  }, [activeTab, isPlaying, teleprompterSpeed]);

  const handleTogglePlay = () => {
    if (!generatedScript) return;
    if (!isPlaying) {
      if (playbackTime >= (generatedScript.totalDurationSeconds || 30)) {
        setPlaybackTime(0);
        setCurrentSceneIndex(0);
      }
      setIsPlaying(true);
      if (isTTSActive) {
        speakSceneVoiceover(generatedScript.scenes[currentSceneIndex]?.voiceoverText || '');
      }
    } else {
      setIsPlaying(false);
      window.speechSynthesis?.cancel();
    }
  };

  const handleResetPlayback = () => {
    setIsPlaying(false);
    setPlaybackTime(0);
    setCurrentSceneIndex(0);
    window.speechSynthesis?.cancel();
  };

  const handleSelectScene = (index: number) => {
    if (!generatedScript) return;
    setCurrentSceneIndex(index);
    let time = 0;
    for (let i = 0; i < index; i++) {
      time += generatedScript.scenes[i].durationSeconds || 4;
    }
    setPlaybackTime(time);
    if (isPlaying && isTTSActive) {
      speakSceneVoiceover(generatedScript.scenes[index]?.voiceoverText || '');
    }
  };

  const currentScene: VideoScene | undefined = generatedScript?.scenes[currentSceneIndex] || generatedScript?.scenes[0];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Studio IA Vidéo Vendeuse</span>
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
              <span className="text-pink-300 font-bold">TikTok • Reels • Shorts • WhatsApp</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Générateur Vidéo & Storyboard
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Scénarisez des vidéos à fort taux de conversion : accroches scroll-stopper, voix-off mot à mot,
              instructions de tournage smartphone et simulateur interactif avec lecture audio en direct.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 text-center">
              <div className="text-2xl font-black text-amber-300">x3.8</div>
              <div className="text-xs text-slate-300 font-medium">plus de ventes avec la vidéo</div>
            </div>
          </div>
        </div>
      </div>

      {/* Preset Quick Chips */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>Modèles de vidéos prêts à l’emploi (1-clic)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {VIDEO_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="text-left p-3.5 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors flex items-center justify-between">
                <span>{preset.title}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <div className="text-xs text-slate-500 mt-1 line-clamp-1">{preset.topic}</div>
              <div className="flex items-center gap-2 mt-2 text-[11px] font-medium text-slate-400">
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">{preset.duration}</span>
                <span>•</span>
                <span>{preset.format === 'tiktok_reels' ? 'TikTok/Reels' : 'WhatsApp'}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Form Left, Results Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Generator Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Film className="w-5 h-5 text-indigo-600" />
              <span>Paramètres de votre vidéo</span>
            </h2>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              1 Crédit / Vidéo
            </span>
          </div>

          <form onSubmit={handleGenerate} className="space-y-5">
            {/* Subject / Product Input */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Produit, Service ou Sujet de la vidéo *
              </label>
              <input
                type="text"
                value={productOrTopic}
                onChange={(e) => setProductOrTopic(e.target.value)}
                placeholder="Ex: Chaussures de sport respirantes, Soin visage éclat, Menu Tacos du chef..."
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-900 text-sm placeholder:text-slate-400 shadow-2xs"
                required
              />
            </div>

            {/* Video Objective */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Objectif de la vidéo
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {VIDEO_OBJECTIVES.map((obj) => (
                  <button
                    key={obj.id}
                    type="button"
                    onClick={() => setObjective(obj.id)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      objective === obj.id
                        ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-500 text-indigo-950'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{obj.icon}</span>
                      <span className="text-xs font-bold">{obj.label}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{obj.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Format & Duration Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Format */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Format de diffusion
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as VideoFormat)}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-white text-slate-900 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                >
                  {VIDEO_FORMATS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.label} ({f.ratio})
                    </option>
                  ))}
                </select>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Durée cible
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['15s', '30s', '60s'] as VideoDuration[]).map((dur) => (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => setDuration(dur)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        duration === dur
                          ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {dur}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tone / Style */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Ambiance & Style de Voix-off
              </label>
              <select
                value={toneStyle}
                onChange={(e) => setToneStyle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 bg-white text-slate-900 text-sm font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Dynamique, vendeur et percutant">🔥 Dynamique, vendeur et percutant (Recommandé)</option>
                <option value="Élégant, posé et haut de gamme">💎 Élégant, posé et haut de gamme</option>
                <option value="Chaleureux, amical et accessible">😊 Chaleureux, amical et accessible</option>
                <option value="Urgence promo et action immédiate">⚡ Urgence promo et action immédiate</option>
                <option value="Pédagogique, expert et rassurant">🧠 Pédagogique, expert et rassurant</option>
                <option value="Humoristique et décontracté">😄 Humoristique et décontracté</option>
              </select>
            </div>

            {/* Additional Details & Price */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center justify-between">
                <span>Détails clés, Prix ou Offre promo</span>
                <span className="text-slate-400 font-normal text-[11px]">Optionnel</span>
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                placeholder="Ex: Prix spécial 25 000 FCFA, 1 acheté = 1 offert, stock limité à 20 pièces, livraison offerte..."
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-900 text-sm placeholder:text-slate-400 shadow-2xs resize-none"
              />
            </div>

            {/* Include company details toggle */}
            <label className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80 cursor-pointer">
              <input
                type="checkbox"
                checked={includeCompanyDetails}
                onChange={(e) => setIncludeCompanyDetails(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded-md focus:ring-indigo-500"
              />
              <span className="text-xs text-slate-700 font-medium">
                Intégrer automatiquement mon WhatsApp (<strong>{company.whatsapp || 'Non défini'}</strong>) et ma devise (<strong>{company.currency || 'FCFA'}</strong>)
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-sm shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Scénarisation IA en cours...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Générer le Script Vidéo Complet</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Interactive Results & Storyboard Simulator */}
        <div className="lg:col-span-7 space-y-6">
          {!generatedScript && !isLoading && (
            <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto text-indigo-600">
                <Video className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-lg font-bold text-slate-900">Prêt à réaliser votre prochaine vidéo virale ?</h3>
                <p className="text-sm text-slate-500">
                  Remplissez les informations à gauche ou cliquez sur un modèle pour générer instantanément un storyboard complet, le script voix-off, les instructions caméra et les sous-titres .SRT.
                </p>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-5 shadow-sm">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-100 animate-pulse" />
                <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center text-indigo-600">
                  <Film className="w-8 h-8" />
                </div>
              </div>
              <div className="space-y-2 max-w-sm mx-auto">
                <h3 className="text-base font-bold text-slate-900">Scénarisation et découpage des scènes...</h3>
                <p className="text-xs text-slate-500">
                  L’IA conçoit l’accroche (hook), rédige la voix-off mot à mot, horodate les plans et prépare les sous-titres synchronisés.
                </p>
              </div>
            </div>
          )}

          {generatedScript && !isLoading && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-6 p-6 sm:p-7">
              {/* Script Title & Top Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[11px] font-bold">
                      {generatedScript.duration} ({generatedScript.totalDurationSeconds}s)
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-semibold">
                      {generatedScript.scenes.length} scènes
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700 text-[11px] font-semibold">
                      {generatedScript.format === 'tiktok_reels' ? '9:16 Vertical' : generatedScript.format}
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900 mt-1.5">{generatedScript.title}</h2>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDownloadFullScript}
                    title="Télécharger le script complet (.txt)"
                    className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Download className="w-4 h-4 text-slate-500" />
                    <span className="hidden sm:inline">Dossier .TXT</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadSRT}
                    title="Télécharger les sous-titres (.srt)"
                    className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <FileText className="w-4 h-4 text-indigo-600" />
                    <span className="hidden sm:inline">Sous-titres .SRT</span>
                  </button>
                </div>
              </div>

              {/* Hook Spotlight Card */}
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
                    <Flame className="w-4 h-4 text-amber-600" />
                    <span>Accroche Scroll-Stopper (0 - 3 secondes)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(generatedScript.hook, 'hook')}
                    className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedField === 'hook' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedField === 'hook' ? 'Copié' : 'Copier'}</span>
                  </button>
                </div>
                <p className="text-sm font-semibold text-amber-950 italic">"{generatedScript.hook}"</p>
              </div>

              {/* Navigation View Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-100">
                {[
                  { id: 'simulator', label: '🎬 Simulateur Vidéo & Audio', icon: Tv },
                  { id: 'scenes', label: '📋 Découpage des Scènes', icon: Layers },
                  { id: 'teleprompter', label: '🎙️ Voix-Off & Prompteur', icon: Volume2 },
                  { id: 'srt', label: '📑 Sous-Titres .SRT', icon: FileText },
                  { id: 'music', label: '🎵 Musique & Son', icon: Music },
                  { id: 'post', label: '📱 Publication & Hashtags', icon: Share2 },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* TAB 1: INTERACTIVE SIMULATOR */}
              {activeTab === 'simulator' && (
                <div className="space-y-6">
                  {/* Smartphone Simulator Preview Frame */}
                  <div className="flex flex-col md:flex-row items-center justify-center gap-6 bg-slate-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden">
                    {/* Simulated Smartphone Screen */}
                    <div
                      className={`relative w-full max-w-[280px] sm:max-w-[300px] aspect-[9/16] rounded-3xl border-4 border-slate-800 bg-gradient-to-br from-slate-900 to-indigo-950 overflow-hidden shadow-2xl flex flex-col justify-between p-4 transition-all`}
                    >
                      {/* Top Bar: Progress Bars (Stories Style) */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-1 w-full">
                          {generatedScript.scenes.map((scene, idx) => (
                            <div
                              key={idx}
                              className={`h-1 rounded-full flex-1 transition-all ${
                                idx < currentSceneIndex
                                  ? 'bg-white'
                                  : idx === currentSceneIndex
                                  ? 'bg-pink-500 animate-pulse'
                                  : 'bg-white/20'
                              }`}
                            />
                          ))}
                        </div>

                        {/* Top Info */}
                        <div className="flex items-center justify-between text-[11px] text-white/70">
                          <span className="font-bold text-white flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-400" />
                            {company.name || 'BusinessAI'}
                          </span>
                          <span className="font-mono text-pink-300">
                            {playbackTime}s / {generatedScript.totalDurationSeconds}s
                          </span>
                        </div>
                      </div>

                      {/* Middle: Dynamic Scene Graphic & Visual Action */}
                      <div className="text-center my-auto space-y-3 px-2">
                        <div className="inline-block px-3 py-1 rounded-full bg-pink-600/30 border border-pink-400/40 text-pink-200 text-[10px] font-bold uppercase tracking-wider">
                          Scène {currentScene?.sceneNumber || 1} • {currentScene?.timeRange}
                        </div>

                        {/* On Screen Big Caption (Text Overlay) */}
                        <div className="bg-black/60 backdrop-blur-md rounded-2xl p-3.5 border border-white/20 shadow-lg">
                          <p className="text-sm sm:text-base font-black text-amber-300 tracking-wide uppercase leading-tight drop-shadow-md">
                            {currentScene?.screenText || generatedScript.hook}
                          </p>
                        </div>

                        {/* Camera Direction Hint */}
                        <div className="text-[11px] text-slate-300 flex items-center justify-center gap-1 bg-white/10 rounded-xl py-1 px-2.5">
                          <Camera className="w-3 h-3 text-indigo-400" />
                          <span>{currentScene?.cameraDirection}</span>
                        </div>
                      </div>

                      {/* Bottom: Voiceover & Sound Effect Subtitle */}
                      <div className="space-y-2 text-left bg-black/70 backdrop-blur-md rounded-2xl p-3 border border-white/10">
                        <div className="text-[10px] text-pink-300 font-bold uppercase flex items-center justify-between">
                          <span>🎙️ Voix-Off :</span>
                          <span className="text-[9px] text-slate-400">{currentScene?.soundEffectOrMusic}</span>
                        </div>
                        <p className="text-xs text-white leading-relaxed font-medium">
                          "{currentScene?.voiceoverText}"
                        </p>
                      </div>
                    </div>

                    {/* Simulator Controls & Scene Selector Right Side */}
                    <div className="w-full md:w-80 space-y-5">
                      <div className="space-y-1">
                        <h4 className="text-base font-bold text-white flex items-center gap-2">
                          <Tv className="w-4 h-4 text-pink-400" />
                          <span>Commandes du Simulateur</span>
                        </h4>
                        <p className="text-xs text-slate-400">
                          Animez les scènes chronométrées et activez la synthèse vocale pour écouter la voix-off en direct.
                        </p>
                      </div>

                      {/* Playback Buttons */}
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={handleTogglePlay}
                          className={`flex-1 py-3 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all ${
                            isPlaying
                              ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                              : 'bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white'
                          }`}
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          <span>{isPlaying ? 'Pause' : 'Lire la vidéo'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleResetPlayback}
                          title="Recommencer depuis le début"
                          className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      </div>

                      {/* TTS Voice Toggle */}
                      <button
                        type="button"
                        onClick={() => {
                          const newState = !isTTSActive;
                          setIsTTSActive(newState);
                          if (newState && isPlaying) {
                            speakSceneVoiceover(currentScene?.voiceoverText || '');
                          } else {
                            window.speechSynthesis?.cancel();
                          }
                          addToast(
                            'info',
                            newState ? 'Voix activée' : 'Voix coupée',
                            newState ? 'La voix-off sera lue par synthèse vocale pendant la lecture.' : 'Synthèse vocale désactivée.'
                          );
                        }}
                        className={`w-full py-2.5 px-3.5 rounded-xl border text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors ${
                          isTTSActive
                            ? 'bg-pink-500/20 border-pink-400 text-pink-200'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {isTTSActive ? <Volume2 className="w-4 h-4 text-pink-400" /> : <VolumeX className="w-4 h-4" />}
                          <span>Synthèse vocale Voix-Off</span>
                        </div>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-white/10">
                          {isTTSActive ? 'ON' : 'OFF'}
                        </span>
                      </button>

                      {/* Scene Quick Switcher List */}
                      <div className="space-y-2">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Sauter directement à une scène :
                        </div>
                        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                          {generatedScript.scenes.map((scene, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleSelectScene(idx)}
                              className={`w-full text-left p-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-all cursor-pointer ${
                                currentSceneIndex === idx
                                  ? 'bg-pink-600 text-white font-bold'
                                  : 'bg-white/5 hover:bg-white/10 text-slate-300'
                              }`}
                            >
                              <span className="truncate max-w-[170px]">
                                {scene.sceneNumber}. {scene.title}
                              </span>
                              <span className="text-[10px] opacity-80">{scene.timeRange}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Filming Tips on Smartphone */}
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Camera className="w-4 h-4 text-indigo-600" />
                      <span>Conseils de tournage smartphone pour cette vidéo</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {generatedScript.filmingTips.map((tip, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-white border border-slate-200/80 text-xs text-slate-700 space-y-1">
                          <span className="font-bold text-indigo-600">Astuce #{idx + 1}</span>
                          <p>{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SCENES STORYBOARD BREAKDOWN */}
              {activeTab === 'scenes' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900">Découpage scène par scène ({generatedScript.scenes.length} plans)</h3>
                    <button
                      type="button"
                      onClick={() => handleCopy(
                        generatedScript.scenes.map(s => `[Scène ${s.sceneNumber}] ${s.title} (${s.timeRange})\n- Visuel: ${s.visualDescription}\n- Voix-off: "${s.voiceoverText}"\n- Texte écran: "${s.screenText}"`).join('\n\n'),
                        'all_scenes'
                      )}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedField === 'all_scenes' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copier tout le storyboard</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {generatedScript.scenes.map((scene, idx) => (
                      <div
                        key={idx}
                        className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-xs transition-all space-y-3"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                              {scene.sceneNumber}
                            </span>
                            <span className="font-bold text-slate-900 text-sm">{scene.title}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs font-semibold">
                            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {scene.timeRange} ({scene.durationSeconds}s)
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                              {scene.cameraDirection}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          {/* Visual & Camera */}
                          <div className="space-y-2 bg-slate-50 p-3 rounded-xl">
                            <div className="font-bold text-slate-700 flex items-center gap-1.5">
                              <Eye className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Ce qu'on voit à l'écran (Visuel)</span>
                            </div>
                            <p className="text-slate-600 leading-relaxed">{scene.visualDescription}</p>
                            <div className="pt-1 border-t border-slate-200/60 font-semibold text-pink-700">
                              🔤 Texte incrusté : <strong>"{scene.screenText}"</strong>
                            </div>
                          </div>

                          {/* Voiceover & Audio */}
                          <div className="space-y-2 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/60">
                            <div className="font-bold text-indigo-900 flex items-center justify-between">
                              <span className="flex items-center gap-1.5">
                                <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
                                <span>Voix-Off mot à mot</span>
                              </span>
                              <button
                                type="button"
                                onClick={() => speakSceneVoiceover(scene.voiceoverText)}
                                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 underline cursor-pointer"
                              >
                                Écouter
                              </button>
                            </div>
                            <p className="text-indigo-950 font-medium leading-relaxed italic">"{scene.voiceoverText}"</p>
                            <div className="pt-1 border-t border-indigo-100 text-slate-500 font-medium">
                              🔊 Bruitage : {scene.soundEffectOrMusic}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: TELEPROMPTER & CONTINUOUS VOICEOVER */}
              {activeTab === 'teleprompter' && (
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-100 p-3.5 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleTogglePlay}
                        className="py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        <span>{isPlaying ? 'Arrêter le défilement' : 'Démarrer le Prompteur'}</span>
                      </button>

                      {/* Speed Control */}
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                        <span>Vitesse :</span>
                        {[1, 2, 3].map((spd) => (
                          <button
                            key={spd}
                            type="button"
                            onClick={() => setTeleprompterSpeed(spd)}
                            className={`px-2 py-1 rounded-md text-[11px] font-bold cursor-pointer ${
                              teleprompterSpeed === spd
                                ? 'bg-indigo-600 text-white'
                                : 'bg-white text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {spd}x
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopy(generatedScript.voiceoverFullScript, 'full_voiceover')}
                      className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 cursor-pointer"
                    >
                      {copiedField === 'full_voiceover' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>Copier le texte intégral</span>
                    </button>
                  </div>

                  {/* Teleprompter Display Box */}
                  <div
                    ref={teleprompterRef}
                    className="h-80 overflow-y-auto p-8 rounded-3xl bg-slate-950 text-white border-2 border-slate-800 space-y-6 shadow-inner transition-all scroll-smooth"
                  >
                    <div className="text-center text-xs text-pink-400 font-bold uppercase tracking-widest">
                      — SCRIPT PROMPTEUR VIDÉO —
                    </div>
                    <p className="text-lg sm:text-2xl font-bold leading-relaxed tracking-wide text-slate-100 text-center select-text">
                      {generatedScript.voiceoverFullScript}
                    </p>
                    <div className="text-center text-xs text-slate-500 font-mono">
                      Fin du script • Durée estimée : {generatedScript.totalDurationSeconds} secondes
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: SRT SUBTITLES */}
              {activeTab === 'srt' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Fichier de sous-titres synchronisé (.SRT)</h3>
                      <p className="text-xs text-slate-500">Prêt à importer dans CapCut, InShot, VN Video Editor ou Premiere Pro.</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleDownloadSRT}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Télécharger .SRT</span>
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900 text-indigo-200 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                    <pre className="whitespace-pre-wrap">{generatedScript.srtSubtitles}</pre>
                  </div>
                </div>
              )}

              {/* TAB 5: MUSIC & SOUND SUGGESTIONS */}
              {activeTab === 'music' && (
                <div className="space-y-5">
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-pink-50 border border-indigo-100 space-y-4">
                    <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
                      <Music className="w-4 h-4 text-pink-600" />
                      <span>Bande-Son & Musique Recommandée</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-white border border-indigo-100 space-y-1">
                        <span className="text-slate-400 font-semibold">Style / Genre</span>
                        <div className="font-bold text-slate-900">{generatedScript.recommendedMusic.genre}</div>
                      </div>
                      <div className="p-3 rounded-xl bg-white border border-indigo-100 space-y-1">
                        <span className="text-slate-400 font-semibold">Ambiance (Mood)</span>
                        <div className="font-bold text-slate-900">{generatedScript.recommendedMusic.mood}</div>
                      </div>
                      <div className="p-3 rounded-xl bg-white border border-indigo-100 space-y-1">
                        <span className="text-slate-400 font-semibold">Tempo (BPM)</span>
                        <div className="font-bold text-slate-900">{generatedScript.recommendedMusic.bpm}</div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-indigo-100 space-y-1.5">
                      <span className="text-xs font-bold text-slate-700">Mots-clés de recherche dans TikTok / Instagram Audio :</span>
                      <div className="flex items-center justify-between gap-2">
                        <code className="text-xs font-mono font-bold text-pink-600 bg-pink-50 px-2.5 py-1 rounded-lg">
                          {generatedScript.recommendedMusic.searchKeywords}
                        </code>
                        <button
                          type="button"
                          onClick={() => handleCopy(generatedScript.recommendedMusic.searchKeywords, 'music_kw')}
                          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                        >
                          {copiedField === 'music_kw' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>Copier</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: POST CAPTION & HASHTAGS */}
              {activeTab === 'post' && (
                <div className="space-y-5">
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <Share2 className="w-4 h-4 text-indigo-600" />
                        <span>Texte de publication prêt à poster</span>
                      </h4>
                      <button
                        type="button"
                        onClick={() => handleCopy(
                          `${generatedScript.captionAndHashtags.postCaption}\n\n${generatedScript.captionAndHashtags.hashtags.join(' ')}`,
                          'post_caption'
                        )}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedField === 'post_caption' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Copier la publication</span>
                      </button>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                      {generatedScript.captionAndHashtags.postCaption}
                    </div>

                    {/* Hashtags Chips */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-700">Hashtags Stratégiques :</span>
                      <div className="flex flex-wrap gap-2">
                        {generatedScript.captionAndHashtags.hashtags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-semibold text-xs border border-indigo-100"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Share Bar */}
                    <div className="pt-3 border-t border-slate-100">
                      <ShareActionsBar
                        title={`Vidéo : ${generatedScript.title}`}
                        text={`${generatedScript.captionAndHashtags.postCaption}\n\n${generatedScript.captionAndHashtags.hashtags.join(' ')}`}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
