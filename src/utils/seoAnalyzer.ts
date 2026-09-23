import { CompanyProfile } from '../types';

export interface SeoKeywordMetric {
  word: string;
  count: number;
  density: number; // percentage (e.g., 2.5%)
}

export interface SeoSuggestion {
  id: string;
  type: 'good' | 'warning' | 'critical';
  title: string;
  detail: string;
  category: 'hook' | 'readability' | 'cta' | 'keywords' | 'hashtags' | 'brand';
}

export interface PlatformFit {
  platform: 'instagram' | 'whatsapp' | 'facebook' | 'tiktok' | 'linkedin' | 'google_my_business';
  label: string;
  score: number; // 0-100
  verdict: 'Idéal' | 'Adapté' | 'À ajuster';
  tip: string;
}

export interface SeoAnalysisResult {
  overallScore: number; // 0-100
  grade: 'A+' | 'A' | 'B' | 'C' | 'D';
  statusLabel: string;
  wordCount: number;
  charCount: number;
  charCountNoSpaces: number;
  readingTimeSeconds: number;
  paragraphCount: number;
  sentenceCount: number;
  emojiCount: number;
  
  // Sub-scores (0-100)
  hookScore: number;
  readabilityScore: number;
  ctaScore: number;
  keywordsScore: number;
  hashtagScore: number;
  lengthScore: number;

  // Detected elements
  hashtags: string[];
  detectedCtas: string[];
  topKeywords: SeoKeywordMetric[];
  hasBrandMention: boolean;
  hasContactMention: boolean;
  hasPricingOrOffer: boolean;
  hasQuestion: boolean;
  hasNumbers: boolean;

  // Recommendations
  suggestions: SeoSuggestion[];
  platforms: PlatformFit[];
}

const FRENCH_STOP_WORDS = new Set([
  'le', 'la', 'les', 'un', 'une', 'des', 'du', 'de', 'd', 'l', 'au', 'aux',
  'et', 'ou', 'mais', 'donc', 'or', 'ni', 'car', 'ce', 'cet', 'cette', 'ces',
  'mon', 'ton', 'son', 'notre', 'votre', 'leur', 'mes', 'tes', 'ses', 'nos', 'vos', 'leurs',
  'je', 'tu', 'il', 'elle', 'on', 'nous', 'vous', 'ils', 'elles',
  'me', 'te', 'se', 'y', 'en', 'moi', 'toi', 'lui', 'eux',
  'qui', 'que', 'quoi', 'dont', 'où', 'quand', 'comment', 'pourquoi',
  'pour', 'par', 'sur', 'sous', 'dans', 'avec', 'sans', 'chez', 'vers',
  'est', 'sont', 'a', 'ont', 'fait', 'être', 'avoir', 'plus', 'moins', 'très', 'trop',
  'bien', 'mal', 'aussi', 'tout', 'tous', 'toute', 'toutes', 'comme', 'si',
  'ne', 'pas', 'plus', 'rien', 'jamais', 'encore', 'déjà', 'ici', 'là',
  'votre', 'vos', 'notre', 'nos', 'faire', 'va', 'vont', 'aller'
]);

const CTA_PATTERNS = [
  /\b(command(ez|er|e)|réserv(ez|er|e)|achet(ez|er|e)|achet(ez|er))\b/i,
  /\b(contact(ez|er|e)|écriv(ez|ons)|appel(ez|er)|téléphon(ez|er))\b/i,
  /\b(whatsapp|dm|mp|message privé|inbox)\b/i,
  /\b(cliqu(ez|er)|découvr(ez|ir)|profit(ez|er)|visit(ez|er))\b/i,
  /\b(lien en bio|lien ci-dessous|lien ci-dessus|sur notre site)\b/i,
  /\b(rejoign(ez|ons)|inscriv(ez|er)|partag(ez|er)|abonn(ez|e))\b/i,
  /\b(envoy(ez|er)|écris-nous|passez commande|en stock)\b/i,
  /\b(\+?[0-9]{8,15})\b/, // Phone number pattern
];

const POWER_WORDS = [
  'nouveau', 'nouvelle', 'exclusif', 'exclusive', 'offert', 'gratuite', 'gratuit',
  'découvrez', 'secret', 'limité', 'promo', 'réduction', 'cadeau', 'révolution',
  'exceptionnel', 'garanti', 'boost', 'qualité', 'irrésistible', 'immédiat',
  'rapide', 'facile', 'solution', 'indispensable', 'urgent', 'offre', 'flash'
];

export function analyzeMarketingPostSEO(
  text: string,
  company?: CompanyProfile
): SeoAnalysisResult {
  const cleanText = (text || '').trim();
  
  if (!cleanText) {
    return {
      overallScore: 0,
      grade: 'D',
      statusLabel: 'Vide (En attente de texte)',
      wordCount: 0,
      charCount: 0,
      charCountNoSpaces: 0,
      readingTimeSeconds: 0,
      paragraphCount: 0,
      sentenceCount: 0,
      emojiCount: 0,
      hookScore: 0,
      readabilityScore: 0,
      ctaScore: 0,
      keywordsScore: 0,
      hashtagScore: 0,
      lengthScore: 0,
      hashtags: [],
      detectedCtas: [],
      topKeywords: [],
      hasBrandMention: false,
      hasContactMention: false,
      hasPricingOrOffer: false,
      hasQuestion: false,
      hasNumbers: false,
      suggestions: [
        {
          id: 'empty',
          type: 'critical',
          title: 'Aucun texte à analyser',
          detail: 'Générez une publication ou saisissez un texte pour obtenir une évaluation SEO et qualité en temps réel.',
          category: 'readability',
        },
      ],
      platforms: [],
    };
  }

  // Basic counters
  const charCount = cleanText.length;
  const charCountNoSpaces = cleanText.replace(/\s+/g, '').length;
  const words = cleanText.match(/[\p{L}\p{N}'-]+/gu) || [];
  const wordCount = words.length;
  const paragraphs = cleanText.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
  const paragraphCount = Math.max(1, paragraphs.length);
  const sentences = cleanText.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const sentenceCount = Math.max(1, sentences.length);
  
  // Reading time (approx 200 words per minute)
  const readingTimeSeconds = Math.max(3, Math.round((wordCount / 200) * 60));

  // Emoji count
  const emojiRegex = /(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu;
  const emojis = cleanText.match(emojiRegex) || [];
  const emojiCount = emojis.length;

  // Hashtags
  const hashtagRegex = /#([\p{L}\p{N}_-]+)/gu;
  const rawHashtags = cleanText.match(hashtagRegex) || [];
  const hashtags = Array.from(new Set(rawHashtags.map((h) => h.toLowerCase())));

  // First line / Hook extraction
  const lines = cleanText.split('\n').filter((l) => l.trim().length > 0);
  const firstLine = lines[0] || cleanText.slice(0, 140);
  const hookSlice = cleanText.slice(0, 160).toLowerCase();

  const hasQuestion = cleanText.includes('?') || firstLine.includes('?');
  const hasNumbers = /\b\d+(\s?%|\s?€|\s?\$|\s?fcfa|\s?f|\s?k)?\b/i.test(cleanText);
  const hasPricingOrOffer = /\b(\d+\s?(fcfa|f|€|\$|%|remise|promo|réduction|solde|prix|tarif|gratuit|offert))\b/i.test(cleanText);

  // Brand / Contact mentions
  const brandName = company?.name?.toLowerCase().trim();
  const phone = (company?.phone || '').replace(/[^0-9]/g, '');
  const whatsapp = (company?.whatsapp || '').replace(/[^0-9]/g, '');

  let hasBrandMention = false;
  if (brandName && brandName.length > 2 && cleanText.toLowerCase().includes(brandName)) {
    hasBrandMention = true;
  }

  const cleanNoSpaces = cleanText.replace(/[\s-]/g, '');
  const hasContactMention =
    (phone.length >= 8 && cleanNoSpaces.includes(phone)) ||
    (whatsapp.length >= 8 && cleanNoSpaces.includes(whatsapp)) ||
    /\b(whatsapp|téléphone|tel|contact|inbox|dm)\b/i.test(cleanText);

  // Detected CTAs
  const detectedCtas: string[] = [];
  CTA_PATTERNS.forEach((regex) => {
    const match = cleanText.match(regex);
    if (match && !detectedCtas.includes(match[0].toLowerCase())) {
      detectedCtas.push(match[0].toLowerCase());
    }
  });

  // Top Keywords Extraction
  const wordFrequency: Record<string, number> = {};
  words.forEach((w) => {
    const lower = w.toLowerCase();
    if (lower.length > 3 && !FRENCH_STOP_WORDS.has(lower) && !lower.startsWith('#')) {
      wordFrequency[lower] = (wordFrequency[lower] || 0) + 1;
    }
  });

  const sortedKeywords = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([word, count]) => ({
      word,
      count,
      density: wordCount > 0 ? parseFloat(((count / wordCount) * 100).toFixed(1)) : 0,
    }));

  // ==========================================
  // SUB-SCORE CALCULATIONS (0 to 100)
  // ==========================================

  // 1. Hook Score (20% of total)
  let hookScore = 40;
  if (firstLine.length >= 15 && firstLine.length <= 120) hookScore += 15;
  if (/[!?🔥⚡🚀💥👉✨🎯🚨💡]/.test(firstLine)) hookScore += 15;
  if (firstLine.includes('?')) hookScore += 10;
  if (/\b\d+\b/.test(firstLine)) hookScore += 10;
  const hasPowerWordInHook = POWER_WORDS.some((pw) => hookSlice.includes(pw));
  if (hasPowerWordInHook) hookScore += 15;
  hookScore = Math.min(100, hookScore);

  // 2. Readability & Structure Score (20% of total)
  let readabilityScore = 50;
  // Paragraphing
  if (paragraphCount >= 2) readabilityScore += 15;
  if (paragraphCount >= 3) readabilityScore += 10;
  // Bullet points or list formatting
  if (/[-•✓✔👉►*]/.test(cleanText)) readabilityScore += 15;
  // Emoji density (healthy balance: 1 emoji per 20-50 words)
  const emojiRatio = wordCount > 0 ? emojiCount / wordCount : 0;
  if (emojiCount >= 2 && emojiCount <= 12 && emojiRatio <= 0.12) {
    readabilityScore += 15;
  } else if (emojiCount === 0) {
    readabilityScore -= 5;
  } else if (emojiRatio > 0.20) {
    readabilityScore -= 15; // too spammy
  }
  readabilityScore = Math.min(100, Math.max(20, readabilityScore));

  // 3. CTA Score (25% of total)
  let ctaScore = 30;
  if (detectedCtas.length > 0) ctaScore += 30;
  if (detectedCtas.length >= 2) ctaScore += 15;
  if (hasContactMention) ctaScore += 15;
  // Check if CTA appears in the last 40% of the text
  const lastChunk = cleanText.slice(Math.floor(cleanText.length * 0.6)).toLowerCase();
  const ctaAtEnd = detectedCtas.some((cta) => lastChunk.includes(cta));
  if (ctaAtEnd) ctaScore += 10;
  ctaScore = Math.min(100, ctaScore);

  // 4. Keywords & Business SEO Score (15% of total)
  let keywordsScore = 45;
  if (sortedKeywords.length >= 3) keywordsScore += 20;
  if (hasBrandMention) keywordsScore += 15;
  if (hasPricingOrOffer) keywordsScore += 10;
  // Penalize extreme keyword stuffing (density > 7%)
  const hasOverstuffing = sortedKeywords.some((k) => k.density > 7.0);
  if (hasOverstuffing) keywordsScore -= 20;
  keywordsScore = Math.min(100, Math.max(20, keywordsScore));

  // 5. Hashtags & Social SEO Score (10% of total)
  let hashtagScore = 30;
  const hashCount = hashtags.length;
  if (hashCount >= 3 && hashCount <= 8) {
    hashtagScore = 100;
  } else if (hashCount === 1 || hashCount === 2) {
    hashtagScore = 70;
  } else if (hashCount > 8 && hashCount <= 14) {
    hashtagScore = 75;
  } else if (hashCount > 14) {
    hashtagScore = 45; // spam penalty
  } else {
    hashtagScore = 25; // 0 hashtags
  }

  // 6. Length Score (10% of total)
  let lengthScore = 50;
  if (wordCount >= 60 && wordCount <= 280) {
    lengthScore = 100;
  } else if (wordCount >= 30 && wordCount < 60) {
    lengthScore = 75;
  } else if (wordCount > 280 && wordCount <= 450) {
    lengthScore = 80;
  } else if (wordCount > 450) {
    lengthScore = 60; // a bit too long for social
  } else {
    lengthScore = 40; // too short
  }

  // Overall Weighted Score
  const overallScore = Math.round(
    hookScore * 0.20 +
    readabilityScore * 0.20 +
    ctaScore * 0.25 +
    keywordsScore * 0.15 +
    hashtagScore * 0.10 +
    lengthScore * 0.10
  );

  // Grade
  let grade: 'A+' | 'A' | 'B' | 'C' | 'D' = 'C';
  let statusLabel = 'À optimiser';
  if (overallScore >= 90) {
    grade = 'A+';
    statusLabel = 'Excellent • Fort potentiel viral & conversion';
  } else if (overallScore >= 80) {
    grade = 'A';
    statusLabel = 'Très bon • Publication performante';
  } else if (overallScore >= 68) {
    grade = 'B';
    statusLabel = 'Bon • Quelques détails à peaufiner';
  } else if (overallScore >= 50) {
    grade = 'C';
    statusLabel = 'Moyen • Optimisations recommandées';
  } else {
    grade = 'D';
    statusLabel = 'Insuffisant • À enrichir avant publication';
  }

  // ==========================================
  // SUGGESTIONS & CHECKLIST GENERATION
  // ==========================================
  const suggestions: SeoSuggestion[] = [];

  // Hook suggestions
  if (hookScore >= 85) {
    suggestions.push({
      id: 'hook-good',
      type: 'good',
      title: 'Accroche percutante détectée',
      detail: 'Votre début de texte capte l’attention avec des éléments stimulants et engageants.',
      category: 'hook',
    });
  } else {
    suggestions.push({
      id: 'hook-improve',
      type: 'warning',
      title: 'Renforcer la première phrase (Hook)',
      detail: 'Commencez par une question intrigante, une statistique forte ou une promesse client concrète pour stopper le scroll.',
      category: 'hook',
    });
  }

  // CTA suggestions
  if (ctaScore >= 80) {
    suggestions.push({
      id: 'cta-good',
      type: 'good',
      title: 'Appel à l’action clair et orienté résultat',
      detail: `Vos prospects savent exactement quoi faire (${detectedCtas.slice(0, 2).join(', ')}).`,
      category: 'cta',
    });
  } else if (detectedCtas.length === 0) {
    suggestions.push({
      id: 'cta-missing',
      type: 'critical',
      title: 'Appel à l’action (CTA) manquant',
      detail: 'Ajoutez une consigne claire à la fin : « Envoyez un message sur WhatsApp », « Commandez maintenant » ou « Réservez votre place ».',
      category: 'cta',
    });
  } else {
    suggestions.push({
      id: 'cta-improve',
      type: 'warning',
      title: 'Préciser les coordonnées de contact',
      detail: 'Facilitez le passage à l’acte en mentionnant un numéro WhatsApp direct ou un lien.',
      category: 'cta',
    });
  }

  // Hashtags suggestions
  if (hashtagScore === 100) {
    suggestions.push({
      id: 'hash-good',
      type: 'good',
      title: `Hashtags optimaux (${hashCount} détectés)`,
      detail: 'Parfait pour le référencement naturel sur Instagram, TikTok et LinkedIn sans saturer le texte.',
      category: 'hashtags',
    });
  } else if (hashCount === 0) {
    suggestions.push({
      id: 'hash-zero',
      type: 'warning',
      title: 'Aucun hashtag SEO détecté',
      detail: 'Ajoutez entre 3 et 6 hashtags ciblés (#secteur #nomProduit #ville) pour doper la découverte organique.',
      category: 'hashtags',
    });
  } else if (hashCount > 10) {
    suggestions.push({
      id: 'hash-too-many',
      type: 'warning',
      title: 'Trop de hashtags',
      detail: 'Les algorithmes actuels pénalisent les accumulations excessives. Limitez-vous à 4-6 hashtags ultra-pertinents.',
      category: 'hashtags',
    });
  }

  // Readability suggestions
  if (paragraphCount < 2 && wordCount > 40) {
    suggestions.push({
      id: 'read-spacing',
      type: 'warning',
      title: 'Aérer la mise en page',
      detail: 'Divisez votre texte en 2 à 3 petits paragraphes pour une lecture fluide sur smartphone.',
      category: 'readability',
    });
  } else if (readabilityScore >= 80) {
    suggestions.push({
      id: 'read-good',
      type: 'good',
      title: 'Structure et lisibilité mobile exemplaires',
      detail: 'Paragraphes aérés, bonne utilisation des puces et des émojis.',
      category: 'readability',
    });
  }

  // Brand / Contact suggestion
  if (!hasBrandMention && company?.name) {
    suggestions.push({
      id: 'brand-mention',
      type: 'warning',
      title: `Mentionnez votre marque (« ${company.name} »)`,
      detail: 'Citer votre entreprise ancre votre notoriété et améliore votre visibilité SEO locale.',
      category: 'brand',
    });
  }

  // ==========================================
  // PLATFORM FIT
  // ==========================================
  const platforms: PlatformFit[] = [
    {
      platform: 'instagram',
      label: 'Instagram',
      score: Math.min(100, Math.round(overallScore * 0.95 + (hashCount >= 3 ? 10 : 0))),
      verdict: wordCount >= 50 && wordCount <= 250 && hashCount >= 3 ? 'Idéal' : 'Adapté',
      tip: 'Idéal avec 3 à 5 hashtags et une invitation à commenter ou envoyer un DM.',
    },
    {
      platform: 'whatsapp',
      label: 'WhatsApp (Statut & Messages)',
      score: Math.min(100, Math.round(ctaScore * 0.4 + readabilityScore * 0.3 + hookScore * 0.3)),
      verdict: wordCount <= 180 && hasContactMention ? 'Idéal' : 'Adapté',
      tip: 'Court, percutant avec prix/bénéfice immédiat et numéro direct.',
    },
    {
      platform: 'facebook',
      label: 'Facebook',
      score: Math.min(100, Math.round(overallScore * 0.9 + (hasQuestion ? 8 : 0))),
      verdict: paragraphCount >= 2 && hasQuestion ? 'Idéal' : 'Adapté',
      tip: 'Poser une question en fin de texte stimule les partages et commentaires.',
    },
    {
      platform: 'tiktok',
      label: 'TikTok (Légende & Script)',
      score: Math.min(100, Math.round(hookScore * 0.5 + ctaScore * 0.3 + (hashCount >= 2 ? 20 : 0))),
      verdict: hookScore >= 75 && wordCount <= 120 ? 'Idéal' : 'À ajuster',
      tip: 'Les 3 premières secondes et la première ligne de légende font 80% du succès.',
    },
    {
      platform: 'google_my_business',
      label: 'Google Business Profile',
      score: Math.min(100, Math.round(keywordsScore * 0.4 + ctaScore * 0.3 + (hasBrandMention ? 20 : 10))),
      verdict: hasBrandMention && hasContactMention ? 'Idéal' : 'À ajuster',
      tip: 'Indispensable : nom du produit, localisation/ville et incitation à appeler.',
    },
  ];

  return {
    overallScore,
    grade,
    statusLabel,
    wordCount,
    charCount,
    charCountNoSpaces,
    readingTimeSeconds,
    paragraphCount,
    sentenceCount,
    emojiCount,
    hookScore,
    readabilityScore,
    ctaScore,
    keywordsScore,
    hashtagScore,
    lengthScore,
    hashtags,
    detectedCtas,
    topKeywords: sortedKeywords,
    hasBrandMention,
    hasContactMention,
    hasPricingOrOffer,
    hasQuestion,
    hasNumbers,
    suggestions,
    platforms,
  };
}
