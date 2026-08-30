import { CompanyProfile } from '../types';

export function buildCompanySystemContext(company: CompanyProfile): string {
  return `Tu es BusinessAI, la plateforme et assistant IA d'élite en stratégie commerciale, marketing et communication d'entreprise.
Tu travailles spécifiquement pour l'entreprise suivante avec accès à ses informations autorisées :
- Nom de l'entreprise : "${company.name || 'Mon Entreprise'}"
- Secteur d'activité : ${company.sector}
- Description & Activité : ${company.description || 'Commerce et services'}
- Téléphone : ${company.phone || 'Non renseigné'}
- Numéro WhatsApp direct : ${company.whatsapp || 'Non renseigné'}
- Adresse physique / Localisation : ${company.address || 'Non renseignée'}
- Horaires d'ouverture : ${company.hours || 'Non renseignés'}
- Devise utilisée pour les tarifs : ${company.currency || 'FCFA'}
- Ton de communication de la marque : ${company.defaultTone}
${company.knowledgeBase ? `- Base de connaissances & directives autorisées : "${company.knowledgeBase}"` : ''}
${company.targetAudienceDefault ? `- Clientèle cible prioritaire : "${company.targetAudienceDefault}"` : ''}

Consignes impératives :
1. Rédige en français impeccable, professionnel, dynamique, percutant et directement prêt à l'emploi.
2. Utilise fidèlement le contexte de l'entreprise (nom, devise ${company.currency || 'FCFA'}, coordonnées WhatsApp, directives et ton) pour enrichir et personnaliser tes réponses de manière naturelle.
3. Mets toujours en valeur les bénéfices pour le client et termine par un appel à l'action clair et engageant.
4. Structure les textes longs avec des puces claires et des émojis pertinents si adapté aux réseaux sociaux ou messages clients.`;
}

export async function generateAIContent(
  prompt: string,
  company: CompanyProfile,
  temperature = 0.7
): Promise<{ text: string; isFallback: boolean }> {
  try {
    const systemInstruction = buildCompanySystemContext(company);

    const response = await fetch('/api/gemini/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        systemInstruction,
        temperature,
      }),
    });

    if (!response.ok) {
      throw new Error(`Erreur serveur HTTP ${response.status}`);
    }

    const data = await response.json();
    return {
      text: data.text || 'Aucune réponse générée.',
      isFallback: Boolean(data.isFallback),
    };
  } catch (error: any) {
    console.error('Erreur API Gemini Client:', error);
    // Fallback generation locally if backend is unreachable
    return {
      text: `[BusinessAI Mode Local] Voici une proposition pour ${company.name || 'votre entreprise'} :
${prompt.slice(0, 100)}...

👉 **Action recommandée :** Contactez-nous au ${company.phone || company.whatsapp || 'notre service client'} pour en savoir plus !`,
      isFallback: true,
    };
  }
}

export async function chatWithAI(
  messages: { role: 'user' | 'assistant'; text: string }[],
  company: CompanyProfile
): Promise<{ text: string; isFallback: boolean }> {
  try {
    const systemInstruction = buildCompanySystemContext(company);

    const response = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        systemInstruction,
      }),
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}`);
    }

    const data = await response.json();
    return {
      text: data.text || 'Je suis à votre écoute.',
      isFallback: Boolean(data.isFallback),
    };
  } catch (error: any) {
    console.error('Erreur Chat Client:', error);
    return {
      text: `Bonjour ! Je suis l'assistant BusinessAI de **${company.name || 'votre entreprise'}**. Comment puis-je vous aider aujourd'hui à développer vos ventes ou communiquer avec vos clients ?`,
      isFallback: true,
    };
  }
}

export async function streamAIContent(
  prompt: string,
  company: CompanyProfile,
  onChunk: (chunk: string) => void,
  temperature = 0.7
): Promise<{ fullText: string; isFallback: boolean }> {
  const systemInstruction = buildCompanySystemContext(company);
  let fullText = '';
  let isFallback = false;

  try {
    const response = await fetch('/api/gemini/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        systemInstruction,
        temperature,
      }),
    });

    if (!response.body) {
      throw new Error('ReadableStream non supporté par la réponse');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let done = false;

    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;

      if (value) {
        const decoded = decoder.decode(value, { stream: true });
        const lines = decoded.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.replace('data: ', '').trim();
            if (dataStr === '[DONE]') break;

            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.text) {
                fullText += parsed.text;
                onChunk(parsed.text);
              }
              if (parsed.isFallback) {
                isFallback = true;
              }
            } catch {
              // Ignore partial stream line chunks
            }
          }
        }
      }
    }

    return { fullText, isFallback };
  } catch (error) {
    console.error('Erreur Streaming Client:', error);
    const fallback = await generateAIContent(prompt, company, temperature);
    onChunk(fallback.text);
    return { fullText: fallback.text, isFallback: true };
  }
}

import {
  GeneratedVideoScript,
  VideoFormat,
  VideoObjective,
  VideoDuration,
  VideoScene,
} from '../types';

export async function generateVideoScriptWithAI(params: {
  productOrTopic: string;
  objective: VideoObjective;
  format: VideoFormat;
  duration: VideoDuration;
  toneStyle?: string;
  details?: string;
  company: CompanyProfile;
}): Promise<{ script: GeneratedVideoScript; isFallback: boolean }> {
  const { productOrTopic, objective, format, duration, toneStyle, details, company } = params;

  const formatLabels: Record<VideoFormat, string> = {
    tiktok_reels: 'TikTok, Instagram Reels & YouTube Shorts (Format 9:16 Vertical, dynamique, scroll-stopper)',
    whatsapp_status: 'Statuts WhatsApp & Stories (Format 9:16 Court, direct, conversationnel)',
    feed_square: 'Feed Facebook & Instagram (Format 1:1 Carré ou 4:5, visuel et informatif)',
    youtube_landscape: 'YouTube & Vidéo Présentation (Format 16:9 Paysage, détaillé et immersif)',
  };

  const objectiveLabels: Record<VideoObjective, string> = {
    product_demo: 'Démonstration produit & Déballage (Mettre en avant les fonctionnalités, la qualité et l’usage direct)',
    flash_promo: 'Promotion Flash & Urgence (Offre limitée, réduction immédiate, incitation à l’action urgente)',
    customer_review: 'Témoignage client & Preuve sociale (Mise en scène d’une cliente/client comblé, transformation avant/après)',
    behind_scenes: 'Coulisses & Fabrication (Storytelling de l’atelier/boutique, authenticité, passion du métier)',
    expert_tip: 'Conseil expert & Astuce vendeuse (Éduquer le client, résoudre un problème précis puis recommander l’entreprise)',
    new_launch: 'Lancement d’une nouveauté (Créer de la hype, susciter la curiosité et l’exclusivité)',
  };

  const durationTargetSeconds = duration === '15s' ? 15 : duration === '60s' ? 60 : 30;
  const scenesCount = duration === '15s' ? 3 : duration === '60s' ? 6 : 4;

  const prompt = `Génère un script vidéo marketing complet, ultra-percutant et prêt à être tourné avec un smartphone.

Détails de la demande vidéo :
- Sujet / Produit de la vidéo : "${productOrTopic}"
- Objectif : ${objectiveLabels[objective]}
- Format de diffusion : ${formatLabels[format]}
- Durée cible : ${duration} (${durationTargetSeconds} secondes)
- Ambiance / Ton souhaité : ${toneStyle || company.defaultTone}
- Précisions / Offre / Prix : ${details || 'Mettre en valeur le rapport qualité/prix exceptionnel et la satisfaction garantie'}
- Nombre de scènes recommandé : ${scenesCount} scènes

Informations de l'entreprise à intégrer naturellement :
- Nom : "${company.name || 'Notre Entreprise'}"
- WhatsApp : "${company.whatsapp || 'Lien en bio / Message privé'}"
- Devise : "${company.currency || 'FCFA'}"
- Localisation : "${company.address || 'Livraison rapide partout'}"

Renvoie UNIQUEMENT un objet JSON valide (sans texte introductif ni explications avant ou après) respectant EXACTEMENT la structure suivante :
{
  "title": "Titre accrocheur de la vidéo",
  "hook": "L'accroche scroll-stopper des 3 premières secondes (phrase choc ou question captivante)",
  "totalDurationSeconds": ${durationTargetSeconds},
  "scenes": [
    {
      "sceneNumber": 1,
      "timeRange": "00:00 - 00:04",
      "durationSeconds": 4,
      "title": "Titre court de la scène",
      "visualDescription": "Ce qu'on voit précisément à l'écran (décor, gestes, expressions)",
      "cameraDirection": "Instruction de cadrage smartphone (ex: Gros plan 45°, Selfie dynamique, Traveling avant)",
      "voiceoverText": "Texte exact mot pour mot que la voix-off ou le présentateur dit",
      "screenText": "Texte court en gros caractère incrusté à l'écran (pour ceux qui regardent sans son)",
      "soundEffectOrMusic": "Bruitage clé (ex: Ding, Woosh, Pop de notification, Clic de caisse)",
      "visualThemeColor": "#4F46E5"
    }
  ],
  "voiceoverFullScript": "Le texte complet et fluide de la voix-off du début à la fin sans interruption",
  "recommendedMusic": {
    "genre": "ex: Afrobeats énergique, Lo-Fi Chill, Trap moderne ou Pop acoustique",
    "mood": "ex: Motivant, Chaleureux, Haut de gamme, Festif",
    "bpm": "ex: 110-120 BPM",
    "searchKeywords": "ex: energetic afro beat trend reels"
  },
  "filmingTips": [
    "Conseil smartphone 1 (lumière, stabilisateur)",
    "Conseil smartphone 2 (son, micro)",
    "Conseil smartphone 3 (rythme et montage CapCut)"
  ],
  "captionAndHashtags": {
    "postCaption": "Texte prêt à copier/coller pour la publication sur TikTok/Instagram/Facebook",
    "hashtags": ["#Entreprise", "#Vente", "#Promo"],
    "callToAction": "L'appel à l'action précis (ex: Écris 'INFO' en commentaire ou clique sur le lien WhatsApp)"
  },
  "srtSubtitles": "1\\n00:00:00,000 --> 00:00:04,000\\nTexte du sous-titre 1\\n\\n2\\n00:00:04,000 --> 00:00:08,000\\nTexte du sous-titre 2"
}`;

  try {
    const rawResult = await generateAIContent(prompt, company, 0.7);

    // Extract JSON from response
    let cleanedJson = rawResult.text.trim();
    if (cleanedJson.includes('```json')) {
      cleanedJson = cleanedJson.split('```json')[1].split('```')[0].trim();
    } else if (cleanedJson.includes('```')) {
      cleanedJson = cleanedJson.split('```')[1].split('```')[0].trim();
    }

    // Try parsing
    const parsed = JSON.parse(cleanedJson);

    const completeScript: GeneratedVideoScript = {
      title: parsed.title || `Vidéo ${productOrTopic}`,
      hook: parsed.hook || `Découvrez ${productOrTopic} dès aujourd'hui !`,
      duration,
      format,
      objective,
      targetAudience: company.targetAudienceDefault || 'Clientèle active et acheteuse',
      scenes: Array.isArray(parsed.scenes) && parsed.scenes.length > 0 ? parsed.scenes : buildFallbackScenes(productOrTopic, company, durationTargetSeconds),
      totalDurationSeconds: parsed.totalDurationSeconds || durationTargetSeconds,
      voiceoverFullScript: parsed.voiceoverFullScript || parsed.scenes?.map((s: any) => s.voiceoverText).join(' ') || '',
      recommendedMusic: parsed.recommendedMusic || {
        genre: 'Afrobeats moderne & dynamique',
        mood: 'Enjoué et captivant',
        bpm: '115 BPM',
        searchKeywords: 'afro trend beat reels tiktok',
      },
      filmingTips: Array.isArray(parsed.filmingTips) && parsed.filmingTips.length > 0 ? parsed.filmingTips : [
        'Utilisez la lumière naturelle face à vous (face à une fenêtre) pour des couleurs éclatantes.',
        'Nettoyez l’objectif de votre caméra smartphone avant chaque prise.',
        'Parlez avec enthousiasme et faites des transitions dynamiques toutes les 3 secondes.',
      ],
      captionAndHashtags: parsed.captionAndHashtags || {
        postCaption: `🔥 Ne passez pas à côté de ${productOrTopic} ! Disponible dès maintenant chez ${company.name || 'nous'}.\n\n👉 Contactez-nous vite sur WhatsApp au ${company.whatsapp || company.phone || 'notre service client'} pour commander !`,
        hashtags: ['#BusinessAI', '#Nouveauté', '#Qualité', '#Shopping', '#OffreSpéciale'],
        callToAction: `Commandez directement sur WhatsApp au ${company.whatsapp || company.phone || 'notre numéro'}`
      },
      srtSubtitles: parsed.srtSubtitles || buildDefaultSrt(parsed.scenes || []),
    };

    return {
      script: completeScript,
      isFallback: rawResult.isFallback,
    };
  } catch (error) {
    console.warn('Fallback script generation triggered:', error);
    const fallbackScript = createIntelligentVideoFallback(params);
    return {
      script: fallbackScript,
      isFallback: true,
    };
  }
}

function buildDefaultSrt(scenes: VideoScene[]): string {
  let srt = '';
  let currentSecond = 0;
  scenes.forEach((scene, index) => {
    const startSec = currentSecond;
    const endSec = currentSecond + (scene.durationSeconds || 4);
    currentSecond = endSec;

    const formatTime = (sec: number) => {
      const mins = Math.floor(sec / 60).toString().padStart(2, '0');
      const secs = (sec % 60).toString().padStart(2, '0');
      return `00:${mins}:${secs},000`;
    };

    srt += `${index + 1}\n${formatTime(startSec)} --> ${formatTime(endSec)}\n${scene.screenText || scene.voiceoverText}\n\n`;
  });
  return srt.trim();
}

function buildFallbackScenes(productOrTopic: string, company: CompanyProfile, totalSeconds: number): VideoScene[] {
  const is15s = totalSeconds <= 15;
  const is60s = totalSeconds >= 60;

  if (is15s) {
    return [
      {
        sceneNumber: 1,
        timeRange: '00:00 - 00:04',
        durationSeconds: 4,
        title: 'Accroche Choc (Scroll Stopper)',
        visualDescription: `Présentateur souriant montrant ${productOrTopic} directement à la caméra avec un mouvement rapide vers l’avant.`,
        cameraDirection: 'Plan serré face caméra + Zoom rapide',
        voiceoverText: `Attends ! Si tu cherches le meilleur rapport qualité/prix pour ${productOrTopic}, regarde ça !`,
        screenText: `🔥 LE SECRET POUR ${productOrTopic.toUpperCase()}`,
        soundEffectOrMusic: 'Son Woosh d’impact + Beat dynamique',
        visualThemeColor: '#4F46E5',
      },
      {
        sceneNumber: 2,
        timeRange: '00:04 - 00:10',
        durationSeconds: 6,
        title: 'Démonstration & Bénéfice clé',
        visualDescription: `Gros plan détaillé sur les finitions et l’utilisation réelle de ${productOrTopic}.`,
        cameraDirection: 'Plan 45° en lumière naturelle, travelling fluide',
        voiceoverText: `Regardez cette qualité irréprochable et cette efficacité immédiate au quotidien. C'est testé et validé !`,
        screenText: `✨ Qualité 100% Garantie & Testée`,
        soundEffectOrMusic: 'Ding de confirmation',
        visualThemeColor: '#0EA5E9',
      },
      {
        sceneNumber: 3,
        timeRange: '00:10 - 00:15',
        durationSeconds: 5,
        title: 'Appel à l’Action Urgent (CTA)',
        visualDescription: `Affichage du numéro WhatsApp ${company.whatsapp || ''} et du packaging prêt à être expédié.`,
        cameraDirection: 'Plan selfie chaleureux avec pointage du doigt vers le bas',
        voiceoverText: `Quantités très limitées ! Écris-nous tout de suite sur WhatsApp pour réserver ton exemplaire !`,
        screenText: `👉 COMMANDE SUR WHATSAPP : ${company.whatsapp || 'CLIQUE ICI'}`,
        soundEffectOrMusic: 'Pop de message WhatsApp + Fin entraînante',
        visualThemeColor: '#10B981',
      },
    ];
  }

  return [
    {
      sceneNumber: 1,
      timeRange: '00:00 - 00:05',
      durationSeconds: 5,
      title: 'Accroche Scroll-Stopper',
      visualDescription: `Le présentateur interpelle l'audience avec un accessoire ou ${productOrTopic} en main, regard droit vers l'objectif.`,
      cameraDirection: 'Plan moyen dynamique avec légère avancée caméra',
      voiceoverText: `Arrête de scroller 5 secondes ! Tu as toujours voulu profiter de ${productOrTopic} sans te ruiner ?`,
      screenText: `⚡ ATTENTION : OFFRE SPÉCIALE !`,
      soundEffectOrMusic: 'Impact sonore percutant + Démarrage beat Afrobeats',
      visualThemeColor: '#6366F1',
    },
    {
      sceneNumber: 2,
      timeRange: '00:05 - 00:12',
      durationSeconds: 7,
      title: 'Le Problème & La Solution',
      visualDescription: `Transition rapide montrant la facilité d'utilisation et la réponse aux besoins habituels du client.`,
      cameraDirection: 'Gros plan macro sur les détails du produit',
      voiceoverText: `Fini les déceptions et les pertes de temps. Chez ${company.name || 'nous'}, on a sélectionné exactement ce qu'il vous faut.`,
      screenText: `❌ Fini les soucis | ✅ La vraie solution`,
      soundEffectOrMusic: 'Transition Whoosh rapide',
      visualThemeColor: '#0284C7',
    },
    {
      sceneNumber: 3,
      timeRange: '00:12 - 00:22',
      durationSeconds: 10,
      title: 'Bénéfices et Preuve concrète',
      visualDescription: `Montage rapide en 3 plans : utilisation, résultat immédiat et avis client satisfait.`,
      cameraDirection: 'Séquence 3 angles : face, profil, dessus',
      voiceoverText: `Chaque détail a été pensé pour vous offrir confort, durabilité et satisfaction totale dès la première utilisation.`,
      screenText: `⭐ Recommandé par plus de 500 clients ravis`,
      soundEffectOrMusic: 'Carillon doux / Caisse enregistreuse',
      visualThemeColor: '#10B981',
    },
    {
      sceneNumber: 4,
      timeRange: '00:22 - 00:30',
      durationSeconds: 8,
      title: 'Offre WhatsApp & Appel à l’Action (CTA)',
      visualDescription: `Présentateur souriant tenant le colis ou montrant l'écran de contact WhatsApp avec le prix en ${company.currency || 'FCFA'}.`,
      cameraDirection: 'Plan poitrine avec texte animé en bas d’écran',
      voiceoverText: `Livraison rapide disponible ! Cliquez sur le bouton sous la vidéo ou envoyez un message WhatsApp pour profiter du tarif exclusif.`,
      screenText: `📲 ÉCRIS-NOUS SUR WHATSAPP : ${company.whatsapp || company.phone || '0163638893'}`,
      soundEffectOrMusic: 'Notification WhatsApp + Cloche de fin',
      visualThemeColor: '#8B5CF6',
    },
  ];
}

function createIntelligentVideoFallback(params: {
  productOrTopic: string;
  objective: VideoObjective;
  format: VideoFormat;
  duration: VideoDuration;
  toneStyle?: string;
  details?: string;
  company: CompanyProfile;
}): GeneratedVideoScript {
  const { productOrTopic, objective, format, duration, company, details } = params;
  const durationSeconds = duration === '15s' ? 15 : duration === '60s' ? 60 : 30;
  const scenes = buildFallbackScenes(productOrTopic, company, durationSeconds);
  const voiceover = scenes.map((s) => s.voiceoverText).join(' ');

  return {
    title: `Vidéo Promotionnelle : ${productOrTopic}`,
    hook: `Pourquoi tout le monde s'arrache ${productOrTopic} chez ${company.name || 'nous'} ?`,
    duration,
    format,
    objective,
    targetAudience: company.targetAudienceDefault || 'Clients passionnés et acheteurs locaux',
    scenes,
    totalDurationSeconds: durationSeconds,
    voiceoverFullScript: voiceover,
    recommendedMusic: {
      genre: 'Afro-Pop & Beat Rhythmique Tendance',
      mood: 'Captivant, vendeur et énergique',
      bpm: '118 BPM',
      searchKeywords: 'afro trend upbeat tiktok audio reels',
    },
    filmingTips: [
      'Filmez en lumière du jour face à une fenêtre pour un rendu professionnel sans ombre.',
      'Soignez les 3 premières secondes : faites un mouvement dynamique pour retenir l’attention.',
      'Activez la grille 3x3 de votre smartphone pour centrer votre sujet.',
      'Enregistrez la voix dans une pièce calme sans écho.',
    ],
    captionAndHashtags: {
      postCaption: `🔥 Découvrez notre vidéo exclusive sur ${productOrTopic} ! Disponible chez ${company.name || 'notre boutique'}.\n\n💬 Commandez en direct sur WhatsApp au ${company.whatsapp || company.phone || '0163638893'} !`,
      hashtags: ['#TikTokBusiness', '#ReelsVente', '#BusinessAI', '#Promotion', '#Nouveaute', '#VenteEnLigne'],
      callToAction: `Écrivez 'INFO' ou contactez-nous sur WhatsApp au ${company.whatsapp || 'notre numéro'}`,
    },
    srtSubtitles: buildDefaultSrt(scenes),
  };
}

