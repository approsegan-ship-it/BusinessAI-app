import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Smartphone,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Code2,
  Terminal,
  Layers,
  Zap,
  CheckCircle2,
  HelpCircle,
  Share2,
  Bot,
  Globe,
  Lock,
  ArrowRight,
  ChevronRight,
  BookOpen,
  MessageSquare,
  Send,
  Cpu,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type TutorialTab = 'quick' | 'meta' | 'twilio' | 'nocode' | 'prompt';

export const WhatsAppTutorialModal: React.FC = () => {
  const {
    isWhatsAppModalOpen,
    setIsWhatsAppModalOpen,
    company,
    products,
    addToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<TutorialTab>('quick');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Link generator tool state
  const [linkPhone, setLinkPhone] = useState(company.whatsapp || company.phone || '+229 90 00 00 00');
  const [linkMessage, setLinkMessage] = useState(
    `Bonjour ${company.name || 'BusinessAI'}, j'aimerais avoir plus d'informations sur vos produits et services !`
  );

  if (!isWhatsAppModalOpen) return null;

  const handleCopy = (text: string, id: string, label: string = 'Contenu copié !') => {
    navigator.clipboard.writeText(text);
    setCopiedCodeId(id);
    addToast('success', label, 'Prêt à être collé dans votre éditeur ou configuration.');
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  // Clean phone number for wa.me link
  const cleanPhone = linkPhone.replace(/[^\d]/g, '');
  const generatedWaLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(linkMessage)}`;

  // Dynamic system prompt tailored to user's company profile
  const dynamicSystemPrompt = `Tu es l'assistant WhatsApp officiel de l'entreprise "${company.name || 'Notre Entreprise'}" (Secteur : ${company.sector || 'Commerce'}).

🏢 INFORMATIONS ENTREPRISE :
- Description : ${company.description || 'Vente de produits et services de qualité.'}
- Adresse : ${company.address || 'Disponible sur demande'}
- Horaires : ${company.hours || 'Du Lundi au Samedi de 8h à 19h'}
- Téléphone / WhatsApp : ${company.whatsapp || company.phone || 'Non renseigné'}
- Devise : ${company.currency || 'FCFA'}
- Ton de communication : ${company.defaultTone || 'Professionnel et Chaleureux'}

📦 CATALOGUE PRODUITS & PRIX :
${
  products && products.length > 0
    ? products
        .map(
          (p, i) =>
            `${i + 1}. *${p.name}* - Prix : ${p.price} ${company.currency} | ${p.benefits || p.features || 'Produit vedette'}`
        )
        .join('\n')
    : `- Pack Découverte : Prix attractif\n- Prestation Principale : Devis rapide`
}

🎯 DIRECTIVES DE RÉPONSE SUR WHATSAPP :
1. Sois courtois, concis et dynamique (les messages WhatsApp doivent être faciles à lire sur mobile).
2. Utilise le gras (*mot*) et des émojis pertinents avec parcimonie.
3. Renseigne précisément sur les prix et modalités de livraison.
4. Termine toujours par une question engageante ou un appel à l'action clair (ex: "Souhaitez-vous réserver dès aujourd'hui ?").
5. Si tu ne connais pas une information confidentielle, invite cordialement le client à patienter pour qu'un conseiller humain prenne le relais.`;

  // Server Webhook Code Snippet for Meta Cloud API
  const metaWebhookSnippet = `// server-whatsapp-meta.js
import express from 'express';
import { GoogleGenAI } from '@google/genai';

const app = express();
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'mon_token_secret_businessai';
const ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;

// 1. Validation du Webhook par Meta
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('Webhook validé avec succès par Meta');
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

// 2. Réception des messages clients et réponse IA
app.post('/webhook', async (req, res) => {
  const body = req.body;
  res.sendStatus(200); // Acquitter immédiatement auprès de Meta

  try {
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (message && message.type === 'text') {
      const from = message.from; // Numéro WhatsApp de l'expéditeur
      const userText = message.text.body;

      // Appel de l'IA Gemini avec le profil d'entreprise
      const aiResponse = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: userText,
        config: {
          systemInstruction: \`${dynamicSystemPrompt.replace(/`/g, '\\`')}\`,
          temperature: 0.7,
        },
      });

      const replyText = aiResponse.text || "Merci pour votre message. Nous revenons vers vous très vite !";

      // Envoi de la réponse sur WhatsApp via l'API Graph Meta
      await fetch(\`https://graph.facebook.com/v21.0/\${PHONE_NUMBER_ID}/messages\`, {
        method: 'POST',
        headers: {
          'Authorization': \`Bearer \${ACCESS_TOKEN}\`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: from,
          type: 'text',
          text: { body: replyText },
        }),
      });
    }
  } catch (error) {
    console.error('Erreur traitement message WhatsApp:', error);
  }
});

app.listen(3000, () => console.log('Serveur WhatsApp Meta en écoute sur le port 3000'));`;

  // Server Webhook Code Snippet for Twilio API
  const twilioWebhookSnippet = `// server-whatsapp-twilio.js
import express from 'express';
import twilio from 'twilio';
import { GoogleGenAI } from '@google/genai';

const app = express();
app.use(express.urlencoded({ extended: false })); // Twilio envoie en urlencoded

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const { MessagingResponse } = twilio.twiml;

app.post('/api/whatsapp/incoming', async (req, res) => {
  const twiml = new MessagingResponse();
  const incomingMsg = req.body.Body || '';
  const from = req.body.From; // ex: whatsapp:+22990000000

  try {
    // Génération de la réponse via Gemini
    const aiResult = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: incomingMsg,
      config: {
        systemInstruction: \`${dynamicSystemPrompt.replace(/`/g, '\\`')}\`,
        temperature: 0.7,
      },
    });

    const reply = aiResult.text || "Merci pour votre message !";
    twiml.message(reply);
  } catch (err) {
    console.error('Erreur Twilio Gemini:', err);
    twiml.message("Désolé, nous rencontrons une forte affluence. Un agent humain vous répondra d'ici peu.");
  }

  res.type('text/xml').send(twiml.toString());
});

app.listen(3000, () => console.log('Bot Twilio WhatsApp prêt sur le port 3000'));`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden text-slate-900 my-4 max-h-[92vh] flex flex-col"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-5 sm:p-6 text-white relative shrink-0">
            <button
              onClick={() => setIsWhatsAppModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/30 border border-emerald-300/30 text-emerald-100 text-xs font-semibold w-fit mb-2">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Guide Officiel & Pratique</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              Connecter BusinessAI à WhatsApp
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Découvrez comment automatiser vos discussions clients, diffuser vos fiches produits et relier votre intelligence artificielle à WhatsApp via les méthodes simples ou les API officielles.
            </p>

            {/* Quick Navigation Tabs */}
            <div className="flex items-center gap-1.5 sm:gap-2 mt-4 overflow-x-auto pb-1 scrollbar-none text-xs">
              <button
                onClick={() => setActiveTab('quick')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'quick'
                    ? 'bg-white text-emerald-900 shadow-xs'
                    : 'bg-emerald-700/60 hover:bg-emerald-700 text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>1. Mode 1 Clic (Sans Code)</span>
              </button>

              <button
                onClick={() => setActiveTab('meta')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'meta'
                    ? 'bg-white text-emerald-900 shadow-xs'
                    : 'bg-emerald-700/60 hover:bg-emerald-700 text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>2. Meta Cloud API (Officiel)</span>
              </button>

              <button
                onClick={() => setActiveTab('twilio')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'twilio'
                    ? 'bg-white text-emerald-900 shadow-xs'
                    : 'bg-emerald-700/60 hover:bg-emerald-700 text-white'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>3. Twilio WhatsApp API</span>
              </button>

              <button
                onClick={() => setActiveTab('nocode')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'nocode'
                    ? 'bg-white text-emerald-900 shadow-xs'
                    : 'bg-emerald-700/60 hover:bg-emerald-700 text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>4. ManyChat / Make</span>
              </button>

              <button
                onClick={() => setActiveTab('prompt')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'prompt'
                    ? 'bg-white text-emerald-900 shadow-xs'
                    : 'bg-emerald-700/60 hover:bg-emerald-700 text-white'
                }`}
              >
                <Bot className="w-3.5 h-3.5" />
                <span>5. Prompt & Catalogue IA</span>
              </button>
            </div>
          </div>

          {/* Modal Body Content */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
            {/* TAB 1: QUICK 1-CLICK INTEGRATION */}
            {activeTab === 'quick' && (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        La méthode la plus rapide : Utiliser WhatsApp immédiatement sans serveur
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                        Vous pouvez dès aujourd'hui générer vos publications, fiches produits et réponses de négociation avec l'IA et les propulser en 1 clic dans WhatsApp (conversations directes, groupes de vente ou Statuts WhatsApp).
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3 Step Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                      1
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">Générez vos contenus</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Utilisez l'onglet <strong>Publications</strong>, <strong>Fiches Produits</strong> ou <strong>Réponses Clients</strong> pour créer des textes percutants avec les prix et arguments de vente.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                      2
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">Appuyez sur "WhatsApp"</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Chaque bloc dispose d'un bouton vert dédié qui ouvre automatiquement WhatsApp avec votre texte et vos émojis formatés.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                      3
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">Partagez à vos contacts</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Sélectionnez un client en négociation, diffusez dans votre <strong>Statut WhatsApp</strong> ou envoyez dans vos groupes de clients.
                    </p>
                  </div>
                </div>

                {/* Interactive Tool: WA.ME Link Generator */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-emerald-600" />
                      <h4 className="font-bold text-slate-900 text-sm">
                        Outil : Générateur de lien de discussion directe WhatsApp (`wa.me`)
                      </h4>
                    </div>
                    <span className="text-[11px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                      Pratique & Gratuit
                    </span>
                  </div>

                  <p className="text-xs text-slate-500">
                    Insérez ce lien dans vos bios Facebook, Instagram, TikTok ou vos publicités. Quand un client clique dessus, WhatsApp s'ouvre directement avec votre message pré-rempli !
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Votre Numéro WhatsApp (avec indicatif pays) :
                      </label>
                      <input
                        type="text"
                        value={linkPhone}
                        onChange={(e) => setLinkPhone(e.target.value)}
                        placeholder="ex: +22990000000"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-900 focus:outline-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Message d'accueil pré-rempli :
                      </label>
                      <input
                        type="text"
                        value={linkMessage}
                        onChange={(e) => setLinkMessage(e.target.value)}
                        placeholder="Message que le client va vous envoyer"
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs text-slate-900 focus:outline-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Result Box */}
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                        Lien WhatsApp généré :
                      </span>
                      <p className="text-xs font-mono text-emerald-800 truncate select-all">
                        {generatedWaLink}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                      <button
                        onClick={() => handleCopy(generatedWaLink, 'wa-link', 'Lien WhatsApp copié !')}
                        className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {copiedCodeId === 'wa-link' ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Copié !</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-600" />
                            <span>Copier le lien</span>
                          </>
                        )}
                      </button>

                      <a
                        href={generatedWaLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-none px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Tester le lien</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: META CLOUD API (OFFICIAL WHATSAPP BUSINESS) */}
            {activeTab === 'meta' && (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Intégration Officielle via Meta WhatsApp Cloud API
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                        L'API Cloud officielle de Meta permet à votre serveur de recevoir les messages entrants de n'importe quel client sur votre numéro WhatsApp professionnel et de répondre instantanément 24h/24 avec l'IA.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step-by-step checklist */}
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Les 4 étapes pour activer Meta Cloud API :</span>
                  </h4>

                  <div className="space-y-2.5">
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        1
                      </div>
                      <div className="flex-1">
                        <h5 className="font-bold text-xs sm:text-sm text-slate-900">
                          Créer un compte Meta for Developers & Créer une App Business
                        </h5>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Rendez-vous sur le portail développeur de Meta, connectez votre compte Facebook et créez une application de type <em>« Business »</em>.
                        </p>
                      </div>
                      <a
                        href="https://developers.facebook.com/apps/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold flex items-center gap-1 shrink-0 transition-colors"
                      >
                        <span>Portail Apps</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        2
                      </div>
                      <div className="flex-1">
                        <h5 className="font-bold text-xs sm:text-sm text-slate-900">
                          Ajouter le produit WhatsApp & Enregistrer votre numéro de téléphone
                        </h5>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Dans le tableau de bord de votre app, cliquez sur <strong>Ajouter WhatsApp</strong>. Meta vous fournit un numéro de test immédiat et vous permet d'enregistrer votre vrai numéro d'entreprise.
                        </p>
                      </div>
                      <a
                        href="https://business.facebook.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold flex items-center gap-1 shrink-0 transition-colors"
                      >
                        <span>Meta Business</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        3
                      </div>
                      <div className="flex-1">
                        <h5 className="font-bold text-xs sm:text-sm text-slate-900">
                          Configurer le Webhook (URL HTTPS & Token de vérification)
                        </h5>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Dans l'onglet <strong>WhatsApp &gt; Configuration &gt; Webhooks</strong>, renseignez l'URL de votre serveur (ex: <code>https://votre-domaine.com/webhook</code>) et abonnez-vous au champ <code>messages</code>.
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                        4
                      </div>
                      <div className="flex-1">
                        <h5 className="font-bold text-xs sm:text-sm text-slate-900">
                          Générer un Jeton d'accès permanent (System User Token)
                        </h5>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Dans Meta Business Manager, créez un utilisateur système avec les permissions <code>whatsapp_business_messaging</code> et <code>whatsapp_business_management</code> pour obtenir un token qui n'expire jamais.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Code Snippet */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs font-bold text-slate-900">
                        Code Serveur Node.js / Express complet (Webhook + Gemini AI)
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(metaWebhookSnippet, 'meta-code', 'Code Meta Webhook copié !')}
                      className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-indigo-200"
                    >
                      {copiedCodeId === 'meta-code' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copié !</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copier le script</span>
                        </>
                      )}
                    </button>
                  </div>

                  <pre className="p-4 rounded-2xl bg-slate-900 text-slate-100 text-[11px] font-mono overflow-x-auto leading-relaxed max-h-64 select-text">
                    {metaWebhookSnippet}
                  </pre>
                </div>

                {/* Official Documentation Links Box */}
                <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h5 className="font-bold text-xs sm:text-sm text-slate-900">Documentation Officielle Meta</h5>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Consultez les spécifications officielles de la Cloud API sur Meta for Developers.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <a
                      href="https://developers.facebook.com/docs/whatsapp/cloud-api/get-started"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 border border-slate-300 transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                      <span>Guide Débutant Meta</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                    <a
                      href="https://developers.facebook.com/docs/whatsapp/cloud-api/reference"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 border border-slate-300 transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Référence API Graph</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: TWILIO WHATSAPP API */}
            {activeTab === 'twilio' && (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Intégration via Twilio Programmable Messaging API
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                        Twilio simplifie drastiquement la mise en place d'un bot WhatsApp grâce à son environnement Sandbox instantané et son format de réponse TwiML ultra-rapide.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Steps */}
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Les étapes d'intégration Twilio :</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5">
                      <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-800 font-bold text-xs flex items-center justify-center">
                        1
                      </div>
                      <h5 className="font-bold text-xs text-slate-900">Activer le Sandbox</h5>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Créez un compte sur Twilio et rejoignez le Sandbox WhatsApp en envoyant le code fourni (ex: <code>join word-word</code>) au numéro Twilio.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5">
                      <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-800 font-bold text-xs flex items-center justify-center">
                        2
                      </div>
                      <h5 className="font-bold text-xs text-slate-900">Renseigner le Webhook</h5>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Dans les paramètres Sandbox Twilio, définissez l'URL "WHEN A MESSAGE COMES IN" vers votre route <code>https://votre-domaine.com/api/whatsapp/incoming</code>.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5">
                      <div className="w-6 h-6 rounded-full bg-rose-100 text-rose-800 font-bold text-xs flex items-center justify-center">
                        3
                      </div>
                      <h5 className="font-bold text-xs text-slate-900">Répondre avec Gemini</h5>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Votre serveur génère la réponse via le SDK Google GenAI et la renvoie à Twilio sous forme de balise TwiML standard.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Twilio Code */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-rose-600" />
                      <span className="text-xs font-bold text-slate-900">
                        Exemple de Route Twilio WhatsApp + Gemini (Node.js)
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(twilioWebhookSnippet, 'twilio-code', 'Code Twilio copié !')}
                      className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-rose-200"
                    >
                      {copiedCodeId === 'twilio-code' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copié !</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copier le script</span>
                        </>
                      )}
                    </button>
                  </div>

                  <pre className="p-4 rounded-2xl bg-slate-900 text-slate-100 text-[11px] font-mono overflow-x-auto leading-relaxed max-h-64 select-text">
                    {twilioWebhookSnippet}
                  </pre>
                </div>

                {/* Documentation links */}
                <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h5 className="font-bold text-xs sm:text-sm text-slate-900">Documentation Twilio WhatsApp</h5>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Guides officiels pour déployer en Node.js, Python ou PHP.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <a
                      href="https://www.twilio.com/docs/whatsapp/quickstart/node"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 border border-slate-300 transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-rose-600" />
                      <span>Quickstart Node.js</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                    <a
                      href="https://console.twilio.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 border border-slate-300 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
                      <span>Console Twilio</span>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: NO-CODE AUTOMATION (MANYCHAT / MAKE) */}
            {activeTab === 'nocode' && (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Automatisation 24/7 Sans Code (ManyChat & Make.com)
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                        Si vous ne souhaitez pas gérer de serveur technique, vous pouvez connecter votre numéro WhatsApp Business officiel à une plateforme visuelle no-code comme <strong>ManyChat</strong> ou <strong>Make.com</strong> reliée à l'intelligence artificielle.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Comparison Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* ManyChat Box */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                        <h4 className="font-bold text-slate-900 text-sm">Option A : ManyChat WhatsApp</h4>
                      </div>
                      <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                        Idéal E-commerce & Vente
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      ManyChat est le partenaire officiel numéro 1 de Meta pour WhatsApp. Il permet de construire des arbres de discussion visuels, des relances automatiques et d'intégrer l'IA pour répondre aux questions ouvertes.
                    </p>

                    <ol className="text-xs text-slate-600 space-y-1.5 list-decimal list-inside">
                      <li>Créez un compte sur ManyChat et liez votre compte WhatsApp.</li>
                      <li>Dans <em>Automations &gt; Default Reply</em>, activez le module <em>AI Step</em>.</li>
                      <li>Collez le <strong>Prompt Système</strong> fourni dans le 5ème onglet.</li>
                    </ol>

                    <a
                      href="https://manychat.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-purple-200"
                    >
                      <span>Découvrir ManyChat</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Make.com Box */}
                  <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                        <h4 className="font-bold text-slate-900 text-sm">Option B : Make.com (Scénario)</h4>
                      </div>
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        Ultra Flexible & Connecté
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      Make vous permet de créer un flux : <em>Réception Message WhatsApp</em> ➔ <em>Génération Gemini / OpenAI</em> ➔ <em>Envoi Réponse WhatsApp</em> ➔ <em>Enregistrement dans Google Sheets / CRM</em>.
                    </p>

                    <ol className="text-xs text-slate-600 space-y-1.5 list-decimal list-inside">
                      <li>Module 1 : <strong>WhatsApp Cloud API - Watch Messages</strong></li>
                      <li>Module 2 : <strong>HTTP Request</strong> vers votre API ou Gemini</li>
                      <li>Module 3 : <strong>WhatsApp Cloud API - Send a Message</strong></li>
                    </ol>

                    <a
                      href="https://www.make.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-blue-200"
                    >
                      <span>Découvrir Make.com</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: SYSTEM PROMPT & CATALOG */}
            {activeTab === 'prompt' && (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Prompt Système Personnalisé pour votre Entreprise
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                        Ce prompt est généré en temps réel avec vos vraies coordonnées, votre devise ({company.currency || 'FCFA'}) et vos <strong>{products.length} produit(s) enregistrés</strong>. Copiez-le directement dans votre bot Meta, Twilio ou ManyChat !
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span className="text-xs font-bold text-slate-900">
                        Instructions système formatées pour WhatsApp Bot
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopy(dynamicSystemPrompt, 'system-prompt', 'Prompt Système copié !')}
                      className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                    >
                      {copiedCodeId === 'system-prompt' ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copié !</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copier tout le prompt</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 text-xs font-mono whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto select-text border border-slate-800">
                    {dynamicSystemPrompt}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5">
                  <p className="font-bold text-slate-900">💡 Conseil d'expert pour maximiser vos ventes :</p>
                  <p>
                    Pour que votre bot soit encore plus précis, complétez vos fiches dans l'onglet <strong>Fiches Produits</strong> et renseignez vos informations dans <strong>Profil & Badges</strong>. Toute modification sera immédiatement répercutée ici !
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Bar */}
          <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/80 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Conforme aux règles de confidentialité WhatsApp & Meta Cloud</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setIsWhatsAppModalOpen(false)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                Fermer le guide
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
