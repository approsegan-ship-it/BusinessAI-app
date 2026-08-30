export type Language = 'fr' | 'en' | 'es' | 'pt' | 'ar';

export interface LanguageConfig {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  dir?: 'ltr' | 'rtl';
}

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  { code: 'fr', name: 'Français', nativeName: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'es', name: 'Español', nativeName: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'pt', name: 'Português', nativeName: 'Português', flag: '🇵🇹', dir: 'ltr' },
  { code: 'ar', name: 'Arabe', nativeName: 'العربية', flag: '🇸🇦', dir: 'rtl' },
];

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.dashboard': 'Tableau de bord',
    'nav.assistant': 'Assistant IA',
    'nav.social': 'Publications Réseaux',
    'nav.video': 'Générateur Vidéo',
    'nav.products': 'Fiches Produits',
    'nav.clients': 'Réponses Clients',
    'nav.sales': 'Outils Vente & Marges',
    'nav.referrals': 'Parrainage & Crédits',
    'nav.history': 'Historique',
    'nav.profile': 'Mon Entreprise',
    'nav.pricing': 'Tarifs & Forfaits',
    'nav.activate_ai': 'Activer l’IA',
    'nav.generations': 'gén.',
    'nav.whatsapp_guide': 'Guide WhatsApp IA',
    'nav.send_money': 'Payer au 0163638893',

    // Paywall & Payment
    'paywall.title': 'Paiement requis pour utiliser l’IA',
    'paywall.desc': 'Souscrivez à un forfait pour converser avec l’IA et générer vos contenus en illimité ou selon vos quotas.',
    'paywall.button': 'Payer & Débloquer l’IA',
    'paywall.send_to_number': 'Envoyez votre paiement au numéro officiel :',
    'paywall.phone_number': '01 63 63 88 93',
    'paywall.copy_number': 'Copier le numéro',
    'paywall.number_copied': 'Numéro 0163638893 copié !',
    'paywall.confirm_sent': 'J’ai envoyé l’argent sur ce numéro',
    'paywall.supported_methods': 'Wave, Orange Money, MTN MoMo, Moov Money, Carte bancaire',
    'paywall.step1': '1. Ouvrez votre application Wave, Orange Money ou MTN',
    'paywall.step2': '2. Envoyez le montant de votre forfait au 0163638893',
    'paywall.step3': '3. Cliquez sur "Confirmer mon paiement" ci-dessous pour activer votre compte instantanément',
    'paywall.instant_activation': 'Activation Immédiate',

    // Dashboard
    'dash.welcome': 'Bonjour, développez vos ventes avec l’IA',
    'dash.quota_remaining': 'générations restantes ce mois-ci',
    'dash.plan_locked': 'Accès IA verrouillé (Paiement requis)',
    'dash.upgrade_btn': 'Payer & Activer l’IA',
    'dash.quick_actions': 'Actions Rapides',
    'dash.create_video': 'Créer une vidéo (TikTok / Reels)',
    'dash.create_post': 'Créer une publication',
    'dash.create_product': 'Rédiger une fiche produit',
    'dash.reply_client': 'Répondre à un client',
    'dash.calculate_margin': 'Calculer une marge',
    'dash.recent_generations': 'Dernières générations',

    // Assistant
    'assistant.title': 'Assistant IA d’Entreprise',
    'assistant.subtitle': 'Conseils stratégiques, rédaction publicitaire et conversion commerciale.',
    'assistant.placeholder': 'Posez une question sur votre business, vos prix, vos publications...',
    'assistant.send': 'Envoyer',
    'assistant.locked_hint': 'Forfait requis pour converser avec l’IA.',

    // Common
    'common.copy': 'Copier',
    'common.copied': 'Copié !',
    'common.share_whatsapp': 'Partager sur WhatsApp',
    'common.save': 'Enregistrer',
    'common.delete': 'Supprimer',
    'common.loading': 'Génération en cours...',
    'common.generate': 'Générer avec l’IA',
    'common.currency': 'Devise',
    'common.language': 'Langue',
  },

  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.dashboard': 'Dashboard',
    'nav.assistant': 'AI Assistant',
    'nav.social': 'Social Media Posts',
    'nav.video': 'Video Generator',
    'nav.products': 'Product Sheets',
    'nav.clients': 'Customer Replies',
    'nav.sales': 'Sales Tools & Margins',
    'nav.referrals': 'Referral & Credits',
    'nav.history': 'History',
    'nav.profile': 'My Business',
    'nav.pricing': 'Pricing & Plans',
    'nav.activate_ai': 'Unlock AI',
    'nav.generations': 'gen.',
    'nav.whatsapp_guide': 'WhatsApp AI Guide',
    'nav.send_money': 'Pay to 0163638893',

    // Paywall & Payment
    'paywall.title': 'Payment required to use AI',
    'paywall.desc': 'Subscribe to a plan to chat with AI and generate your business contents easily.',
    'paywall.button': 'Pay & Unlock AI',
    'paywall.send_to_number': 'Send your payment to the official number:',
    'paywall.phone_number': '01 63 63 88 93',
    'paywall.copy_number': 'Copy Number',
    'paywall.number_copied': 'Number 0163638893 copied!',
    'paywall.confirm_sent': 'I have sent the money to this number',
    'paywall.supported_methods': 'Wave, Orange Money, MTN MoMo, Moov Money, Credit Card',
    'paywall.step1': '1. Open your Wave, Orange Money or MTN mobile app',
    'paywall.step2': '2. Transfer the plan amount to 0163638893',
    'paywall.step3': '3. Click "Confirm my payment" below for instant activation',
    'paywall.instant_activation': 'Instant Activation',

    // Dashboard
    'dash.welcome': 'Hello, boost your sales with AI',
    'dash.quota_remaining': 'generations remaining this month',
    'dash.plan_locked': 'AI Access Locked (Payment required)',
    'dash.upgrade_btn': 'Pay & Activate AI',
    'dash.quick_actions': 'Quick Actions',
    'dash.create_video': 'Create a video (TikTok / Reels)',
    'dash.create_post': 'Create a social post',
    'dash.create_product': 'Write product pitch',
    'dash.reply_client': 'Reply to customer',
    'dash.calculate_margin': 'Calculate profit margin',
    'dash.recent_generations': 'Recent Generations',

    // Assistant
    'assistant.title': 'Business AI Assistant',
    'assistant.subtitle': 'Strategic advice, copywriting, customer service and sales optimization.',
    'assistant.placeholder': 'Ask any business question, pricing advice, marketing campaign...',
    'assistant.send': 'Send',
    'assistant.locked_hint': 'Subscription required to chat with the AI.',

    // Common
    'common.copy': 'Copy',
    'common.copied': 'Copied!',
    'common.share_whatsapp': 'Share on WhatsApp',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.loading': 'Generating with AI...',
    'common.generate': 'Generate with AI',
    'common.currency': 'Currency',
    'common.language': 'Language',
  },

  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.dashboard': 'Panel de Control',
    'nav.assistant': 'Asistente IA',
    'nav.social': 'Publicaciones Redes',
    'nav.video': 'Generador de Video',
    'nav.products': 'Fichas de Producto',
    'nav.clients': 'Respuestas a Clientes',
    'nav.sales': 'Herramientas de Venta',
    'nav.referrals': 'Referidos y Créditos',
    'nav.history': 'Historial',
    'nav.profile': 'Mi Empresa',
    'nav.pricing': 'Precios y Planes',
    'nav.activate_ai': 'Activar IA',
    'nav.generations': 'gen.',
    'nav.whatsapp_guide': 'Guía WhatsApp IA',
    'nav.send_money': 'Pagar al 0163638893',

    // Paywall & Payment
    'paywall.title': 'Pago requerido para usar la IA',
    'paywall.desc': 'Suscríbete a un plan para chatear con la IA y generar contenido ilimitado.',
    'paywall.button': 'Pagar y Desbloquear IA',
    'paywall.send_to_number': 'Envía tu pago al número oficial:',
    'paywall.phone_number': '01 63 63 88 93',
    'paywall.copy_number': 'Copiar Número',
    'paywall.number_copied': '¡Número 0163638893 copiado!',
    'paywall.confirm_sent': 'He enviado el dinero a este número',
    'paywall.supported_methods': 'Wave, Orange Money, MTN MoMo, Moov Money, Tarjeta',
    'paywall.step1': '1. Abre tu aplicación Wave, Orange Money o MTN',
    'paywall.step2': '2. Envía el monto del plan al 0163638893',
    'paywall.step3': '3. Haz clic en "Confirmar mi pago" para activación inmediata',
    'paywall.instant_activation': 'Activación Inmediata',

    // Dashboard
    'dash.welcome': 'Hola, impulsa tus ventas con IA',
    'dash.quota_remaining': 'generaciones restantes este mes',
    'dash.plan_locked': 'Acceso a IA bloqueado (Pago requerido)',
    'dash.upgrade_btn': 'Pagar y Activar IA',
    'dash.quick_actions': 'Acciones Rápidas',
    'dash.create_video': 'Crear un video (TikTok / Reels)',
    'dash.create_post': 'Crear publicación',
    'dash.create_product': 'Crear ficha de producto',
    'dash.reply_client': 'Responder a cliente',
    'dash.calculate_margin': 'Calcular margen',
    'dash.recent_generations': 'Generaciones Recientes',

    // Assistant
    'assistant.title': 'Asistente IA para Empresas',
    'assistant.subtitle': 'Consejos estratégicos, redacción y optimización de ventas.',
    'assistant.placeholder': 'Haz una pregunta sobre tu negocio, precios, marketing...',
    'assistant.send': 'Enviar',
    'assistant.locked_hint': 'Plan requerido para chatear con la IA.',

    // Common
    'common.copy': 'Copiar',
    'common.copied': '¡Copiado!',
    'common.share_whatsapp': 'Compartir en WhatsApp',
    'common.save': 'Guardar',
    'common.delete': 'Eliminar',
    'common.loading': 'Generando con IA...',
    'common.generate': 'Generar con IA',
    'common.currency': 'Moneda',
    'common.language': 'Idioma',
  },

  pt: {
    // Navigation
    'nav.home': 'Início',
    'nav.dashboard': 'Painel',
    'nav.assistant': 'Assistente IA',
    'nav.social': 'Publicações Redes',
    'nav.video': 'Gerador de Vídeo',
    'nav.products': 'Fichas de Produtos',
    'nav.clients': 'Respostas a Clientes',
    'nav.sales': 'Vendas & Margens',
    'nav.referrals': 'Indicações & Créditos',
    'nav.history': 'Histórico',
    'nav.profile': 'Minha Empresa',
    'nav.pricing': 'Preços & Planos',
    'nav.activate_ai': 'Ativar IA',
    'nav.generations': 'ger.',
    'nav.whatsapp_guide': 'Guia WhatsApp IA',
    'nav.send_money': 'Pagar para 0163638893',

    // Paywall & Payment
    'paywall.title': 'Pagamento necessário para usar a IA',
    'paywall.desc': 'Assine um plano para conversar com a IA e criar seus conteúdos de vendas.',
    'paywall.button': 'Pagar e Desbloquear IA',
    'paywall.send_to_number': 'Envie seu pagamento para o número oficial:',
    'paywall.phone_number': '01 63 63 88 93',
    'paywall.copy_number': 'Copiar Número',
    'paywall.number_copied': 'Número 0163638893 copiado!',
    'paywall.confirm_sent': 'Enviei o dinheiro para este número',
    'paywall.supported_methods': 'Wave, Orange Money, MTN MoMo, Moov Money, Cartão',
    'paywall.step1': '1. Abra seu app Wave, Orange Money ou MTN',
    'paywall.step2': '2. Transfira o valor do plano para 0163638893',
    'paywall.step3': '3. Clique em "Confirmar pagamento" para liberação instantânea',
    'paywall.instant_activation': 'Ativação Imediata',

    // Dashboard
    'dash.welcome': 'Olá, impulsione suas vendas com IA',
    'dash.quota_remaining': 'gerações restantes este mês',
    'dash.plan_locked': 'Acesso IA bloqueado (Pagamento necessário)',
    'dash.upgrade_btn': 'Pagar e Ativar IA',
    'dash.quick_actions': 'Ações Rápidas',
    'dash.create_video': 'Criar um vídeo (TikTok / Reels)',
    'dash.create_post': 'Criar postagem',
    'dash.create_product': 'Criar ficha de produto',
    'dash.reply_client': 'Responder cliente',
    'dash.calculate_margin': 'Calcular margem de lucro',
    'dash.recent_generations': 'Gerações Recentes',

    // Assistant
    'assistant.title': 'Assistente IA para Negócios',
    'assistant.subtitle': 'Conselhos estratégicos, redação e vendas.',
    'assistant.placeholder': 'Faça uma pergunta sobre seu negócio, preços, promoções...',
    'assistant.send': 'Enviar',
    'assistant.locked_hint': 'Plano necessário para conversar com a IA.',

    // Common
    'common.copy': 'Copiar',
    'common.copied': 'Copiado!',
    'common.share_whatsapp': 'Compartilhar no WhatsApp',
    'common.save': 'Salvar',
    'common.delete': 'Excluir',
    'common.loading': 'Gerando com IA...',
    'common.generate': 'Gerar com IA',
    'common.currency': 'Moeda',
    'common.language': 'Idioma',
  },

  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.dashboard': 'لوحة التحكم',
    'nav.assistant': 'مساعد الذكاء الاصطناعي',
    'nav.social': 'منشورات التواصل',
    'nav.video': 'مولّد الفيديو',
    'nav.products': 'بطاقات المنتجات',
    'nav.clients': 'الرد على الزبائن',
    'nav.sales': 'أدوات المبيعات والأرباح',
    'nav.referrals': 'برنامج الإحالة',
    'nav.history': 'السجل',
    'nav.profile': 'ملف الشركة',
    'nav.pricing': 'الأسعار والباقات',
    'nav.activate_ai': 'تفعيل الذكاء الاصطناعي',
    'nav.generations': 'توليد',
    'nav.whatsapp_guide': 'دليل واتساب',
    'nav.send_money': 'الدفع إلى 0163638893',

    // Paywall & Payment
    'paywall.title': 'يجب الدفع أولاً لاستخدام الذكاء الاصطناعي',
    'paywall.desc': 'اشترك في باقة للدردشة مع المساعد الذكي وتوليد المنشورات والعروض التجارية.',
    'paywall.button': 'الدفع وتفعيل الذكاء الاصطناعي',
    'paywall.send_to_number': 'أرسل المبلغ إلى الرقم الرسمي المعتمد:',
    'paywall.phone_number': '01 63 63 88 93',
    'paywall.copy_number': 'نسخ الرقم',
    'paywall.number_copied': 'تم نسخ الرقم 0163638893 بنجاح!',
    'paywall.confirm_sent': 'لقد أرسلت المبلغ إلى هذا الرقم',
    'paywall.supported_methods': 'Wave, Orange Money, MTN MoMo, Moov Money, البطاقات البنكية',
    'paywall.step1': '1. افتح تطبيق التحويل (Wave, Orange Money, MTN)',
    'paywall.step2': '2. أرسل مبلغ الباقة إلى الرقم 0163638893',
    'paywall.step3': '3. اضغط على "تأكيد الدفع" لتفعيل الحساب فورياً',
    'paywall.instant_activation': 'تفعيل فوري',

    // Dashboard
    'dash.welcome': 'مرحباً، طوّر مبيعاتك وأعمالك بالذكاء الاصطناعي',
    'dash.quota_remaining': 'توليدات متبقية هذا الشهر',
    'dash.plan_locked': 'الذكاء الاصطناعي مقفل (يتطلب الاشتراك)',
    'dash.upgrade_btn': 'الدفع وتفعيل الخدمة',
    'dash.quick_actions': 'إجراءات سريعة',
    'dash.create_video': 'إنشاء فيديو (تيك توك / ريلز)',
    'dash.create_post': 'إنشاء منشور إعلاني',
    'dash.create_product': 'كتابة وصف لمنتج',
    'dash.reply_client': 'الرد على زبون',
    'dash.calculate_margin': 'حساب هامش الربح',
    'dash.recent_generations': 'آخر الأعمال المنشأة',

    // Assistant
    'assistant.title': 'مساعد الأعمال الذكي',
    'assistant.subtitle': 'استشارات تسويقية، كتابة إعلانية، وإغلاق الصفقات.',
    'assistant.placeholder': 'اطرح أي سؤال حول مشروعك أو أسعارك أو حملاتك...',
    'assistant.send': 'إرسال',
    'assistant.locked_hint': 'يتطلب اشتراكاً للتحدث مع الذكاء الاصطناعي.',

    // Common
    'common.copy': 'نسخ',
    'common.copied': 'تم النسخ!',
    'common.share_whatsapp': 'مشاركة عبر واتساب',
    'common.save': 'حفظ',
    'common.delete': 'حذف',
    'common.loading': 'جارٍ التوليد بالذكاء الاصطناعي...',
    'common.generate': 'توليد بالذكاء الاصطناعي',
    'common.currency': 'العملة',
    'common.language': 'اللغة',
  },
};

export function getTranslation(lang: Language, key: string, params?: Record<string, any>): string {
  const dict = TRANSLATIONS[lang] || TRANSLATIONS.fr;
  let text = dict[key] || TRANSLATIONS.fr[key] || key;

  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      text = text.replace(new RegExp(`{${k}}`, 'g'), String(v));
    });
  }

  return text;
}
