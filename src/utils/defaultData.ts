import { CompanyProfile, SavedProduct, HistoryItem } from '../types';

export const DEFAULT_COMPANY: CompanyProfile = {
  name: 'Boutique Éclat & Style',
  sector: 'Boutique & Prêt-à-porter',
  description: 'Vêtements tendance, prêt-à-porter masculin et féminin, chaussures chics et accessoires de mode avec un service client attentionné.',
  phone: '+221 77 123 45 67',
  whatsapp: '+221 77 123 45 67',
  address: 'Avenue Bourguiba, Dakar',
  hours: 'Lun - Sam : 09h00 - 20h00',
  currency: 'FCFA',
  defaultTone: 'Professionnel et Chaleureux',
  websiteOrSocial: '@eclat_style_dakar',
  knowledgeBase: 'Livraison gratuite à partir de 50 000 FCFA d’achat. Expédition partout en 24h/48h. Échange possible sous 7 jours sur présentation du reçu.',
  targetAudienceDefault: 'Jeunes professionnels, femmes actives et amateurs de mode soignée',
};

export const SECTOR_TEMPLATES: Record<string, Partial<CompanyProfile>> = {
  'Boutique de Mode': {
    name: 'Boutique Éclat & Style',
    sector: 'Boutique & Prêt-à-porter',
    description: 'Vêtements tendance, accessoires de mode et maroquinerie de qualité.',
    phone: '+221 77 123 45 67',
    whatsapp: '+221 77 123 45 67',
    address: 'Avenue Bourguiba, Dakar',
    hours: 'Lun - Sam : 09h - 20h',
    currency: 'FCFA',
    defaultTone: 'Élégant et Haut de Gamme',
    knowledgeBase: 'Livraison gratuite dès 50 000 FCFA. Possibilité d’essayer à la livraison sur Dakar.',
  },
  'Restaurant / Traiteur': {
    name: 'La Table Gourmande',
    sector: 'Restaurant & Alimentation',
    description: 'Cuisine traditionnelle et moderne, grillades, plats du jour frais, service sur place, à emporter et livraison.',
    phone: '+225 07 45 67 89',
    whatsapp: '+225 07 45 67 89',
    address: 'Boulevard de Marseille, Abidjan',
    hours: 'Mardi - Dimanche : 11h30 - 23h00',
    currency: 'FCFA',
    defaultTone: 'Familial et Accessible',
    knowledgeBase: 'Menu du jour renouvelé chaque matin. Commande WhatsApp avant 11h pour livraison garantie à 12h30.',
  },
  'E-commerce & Vente en ligne': {
    name: 'TechNova Express',
    sector: 'E-commerce & Vente en ligne',
    description: 'Accessoires high-tech, montres connectées, gadgets innovants et livraison rapide à domicile.',
    phone: '+221 78 001 22 33',
    whatsapp: '+221 78 001 22 33',
    address: 'Boutique 100% en ligne',
    hours: 'Service client WhatsApp : 24h/7j',
    currency: 'FCFA',
    defaultTone: 'Dynamique et Vendeur',
    knowledgeBase: 'Paiement à la livraison accepté (Wave / Orange Money / Cash). Garantie constructeur 6 mois.',
  },
  'Salon de Beauté & Bien-être': {
    name: 'Studio Douceur & Beauté',
    sector: 'Beauté, Coiffure & Bien-être',
    description: 'Soins du visage, tresses et coiffure, manucure et conseils beauté sur mesure.',
    phone: '+225 05 55 44 33',
    whatsapp: '+225 05 55 44 33',
    address: 'Cocody Angré, Abidjan',
    hours: 'Mar - Sam : 09h00 - 19h30 sur RDV',
    currency: 'FCFA',
    defaultTone: 'Professionnel et Chaleureux',
    knowledgeBase: 'Réservation conseillée 24h à l’avance par WhatsApp. Réduction de 10% pour toute première visite.',
  },
  'Artisan & Prestations B2B': {
    name: 'Atelier Rénov & Bâtiment',
    sector: 'Artisanat & Fait-main',
    description: 'Menuiserie sur-mesure, agencement d’intérieur, peinture et rénovation artisanale de qualité.',
    phone: '+221 76 887 66 55',
    whatsapp: '+221 76 887 66 55',
    address: 'Zone Industrielle, Dakar',
    hours: 'Lun - Ven : 08h00 - 18h00',
    currency: 'FCFA',
    defaultTone: 'Direct et Efficace',
    knowledgeBase: 'Devis détaillé gratuit sous 24h. Garantie décennale et matériaux certifiés.',
  },
};

export const INITIAL_PRODUCTS: SavedProduct[] = [
  {
    id: 'prod-1',
    name: 'Veste Blazer Tailleur Cintrée',
    price: 45000,
    category: 'Vêtements Femme',
    features: 'Tissu stretch respirant, boutons dorés gravés, coupe italienne ajustée.',
    benefits: 'Sublime la silhouette, convient au bureau comme aux sorties de soirée, infroissable.',
    targetAudience: 'Femmes actives et élégantes de 25 à 50 ans',
    generatedTitle: 'Veste Blazer Cintrée Élégance – Sublimez Votre Allure au Quotidien',
    generatedDescription:
      "Alliez prestance et confort absolu avec notre blazer cintrée coupe italienne. Fabriquée dans un tissu stretch haut de gamme infroissable, elle s'adapte avec souplesse à tous vos mouvements tout en soulignant votre silhouette avec élégance. Finitions soignées avec boutons dorés exclusifs.",
    keyBulletPoints: [
      'Coupe cintrée flatteuse adaptée à toutes les morphologies',
      'Matière infroissable et ultra confortable pour toute la journée',
      'Idéale pour le travail, réunions importantes et soirées',
    ],
    callToAction: 'Commandez la vôtre dès aujourd’hui et profitez de la livraison offerte !',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'prod-2',
    name: 'Sac à Main Cuir Minimaliste',
    price: 65000,
    category: 'Maroquinerie',
    features: 'Cuir véritable pleine fleur, bandoulière amovible, compartiment tablette.',
    benefits: 'Ultra résistant, intemporel et fonctionnel pour transporter tous vos essentiels.',
    targetAudience: 'Amateurs de design épuré et de maroquinerie durable',
    generatedTitle: 'Sac à Main en Cuir Pleine Fleur – L’Essentiel Chic & Durable',
    generatedDescription:
      "L'accessoire indispensable pour parfaire votre garde-robe. Confectionné à la main en cuir véritable pleine fleur, ce sac allie robustesse légendaire et esthétique minimaliste contemporaine. Doté d'une bandoulière modulable et de poches intelligentes.",
    keyBulletPoints: [
      '100% Cuir pleine fleur résistant aux intempéries',
      'Compartiment renforcé pour tablette et smartphone',
      'Fermeture éclair sécurisée et finitions laiton brossé',
    ],
    callToAction: 'Stock limité en boutique – Réservez le vôtre en un clic par WhatsApp !',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
];

export const INITIAL_HISTORY: HistoryItem[] = [
  {
    id: 'hist-1',
    type: 'social',
    title: 'Post Instagram - Lancement Nouvelle Collection',
    inputSummary: 'Veste Blazer et Sac Cuir - Nouvelle Collection Automne',
    output:
      '✨ Révélez votre élégance avec notre nouvelle collection automne ! 🍂\n\nDes pièces pensées pour vous sublimer au quotidien : confort absolu, finitions soignées et style intemporel.\n\n📍 Rendez-vous au 14 Rue du Commerce ou commandez par WhatsApp au +33 6 12 34 56 78.\n\n#ModeParis #NouvelleCollection #LookDuJour #StyleEtConfort',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'hist-2',
    type: 'client_reply',
    title: 'Réponse WhatsApp - Demande de disponibilité taille M',
    inputSummary: 'Client demande si la veste blazer est disponible en taille M',
    output:
      'Bonjour Sophie ! 👋 Oui, la Veste Blazer Cintrée est bien disponible en taille M dans notre boutique ! Souhaitez-vous que nous vous mettions une pièce de côté pour aujourd’hui, ou préférez-vous une livraison à domicile ? 😊',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
];
