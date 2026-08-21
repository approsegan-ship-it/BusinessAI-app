import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { chatWithAI } from '../services/geminiService';
import { ChatMessage } from '../types';
import { generateUniqueId } from '../utils/idGenerator';
import {
  Send,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  Building2,
  FileText,
  Mail,
  Megaphone,
  Lightbulb,
  FileSignature,
  RefreshCw,
  Smartphone,
} from 'lucide-react';
import { ShareActionsBar } from './ShareActionsBar';

const PRESET_TOPICS = [
  {
    icon: Mail,
    label: 'Rédiger un message pro',
    prompt:
      "Rédige un message professionnel et courtois pour relancer un client qui n'a pas encore répondu à un devis envoyé il y a 4 jours.",
  },
  {
    icon: MessageSquareIcon,
    label: 'Répondre à un client',
    prompt:
      "Un client me demande s'il est possible d'avoir une réduction de 20% sur sa commande. Rédige une réponse diplomate et valorisante pour refuser poliment tout en lui proposant un avantage alternatif.",
  },
  {
    icon: Megaphone,
    label: 'Créer une annonce',
    prompt:
      'Crée une annonce percutante pour annoncer notre arrivage de nouveaux produits exclusifs cette semaine.',
  },
  {
    icon: Lightbulb,
    label: 'Idées marketing',
    prompt:
      'Donne-moi 4 idées originales d’animations commerciales et marketing pour doubler mes ventes au cours des 30 prochains jours.',
  },
  {
    icon: RefreshCw,
    label: 'Reformuler un texte',
    prompt:
      'Voici mon texte brut : "On a plein de trucs pas chers en stock, venez vite avant qu’il y en ait plus". Reformule-le de manière élégante, haut de gamme et captivante.',
  },
  {
    icon: FileSignature,
    label: 'Préparer une offre commerciale',
    prompt:
      'Aide-moi à structurer une proposition commerciale irrésistible pour un pack découverte de nos meilleurs produits/services.',
  },
];

function MessageSquareIcon(props: { className?: string }) {
  return <FileText className={props.className} />;
}

export const AIAssistant: React.FC = () => {
  const {
    company,
    consumeCredit,
    addHistory,
    addToast,
    activePresetPrompt,
    setActivePresetPrompt,
    openWhatsAppTutorialModal,
  } = useApp();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome',
      role: 'assistant',
      text: `Bonjour ! Je suis l'assistant BusinessAI de **${company.name || 'votre entreprise'}**.\n\nJe suis là pour vous aider à :\n- Rédiger des messages et devis professionnels\n- Répondre efficacement à vos clients\n- Concevoir des campagnes et annonces qui vendent\n- Trouver de nouvelles idées pour développer votre chiffre d'affaires\n\nQue souhaitez-vous préparer aujourd'hui ?`,
      timestamp: new Date().toISOString(),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // If a preset was selected from Dashboard, auto-fill it
  useEffect(() => {
    if (activePresetPrompt) {
      setInput(activePresetPrompt);
      setActivePresetPrompt(null);
    }
  }, [activePresetPrompt, setActivePresetPrompt]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || loading) return;

    if (!consumeCredit()) {
      return;
    }

    const userMessage: ChatMessage = {
      id: generateUniqueId('msg-user'),
      role: 'user',
      text: query,
      timestamp: new Date().toISOString(),
    };

    const newConversation = [...messages, userMessage];
    setMessages(newConversation);
    setInput('');
    setLoading(true);

    try {
      // Format history for backend
      const formatted = newConversation.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await chatWithAI(formatted, company);

      const botMessage: ChatMessage = {
        id: generateUniqueId('msg-bot'),
        role: 'assistant',
        text: res.text,
        timestamp: new Date().toISOString(),
        isFallback: res.isFallback,
      };

      setMessages((prev) => [...prev, botMessage]);

      // Save to global history
      addHistory({
        type: 'chat',
        title: query.slice(0, 50) + (query.length > 50 ? '...' : ''),
        inputSummary: query,
        output: res.text,
      });
    } catch (err: any) {
      console.error(err);
      addToast('error', 'Erreur de connexion', 'Veuillez réessayer dans un instant.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    addToast('success', 'Texte copié !', 'Le texte est prêt à être collé.');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: generateUniqueId('welcome'),
        role: 'assistant',
        text: `Nouvelle discussion initialisée pour **${company.name || 'votre entreprise'}**. En quoi puis-je vous aider ?`,
        timestamp: new Date().toISOString(),
      },
    ]);
    addToast('info', 'Discussion réinitialisée');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[550px] max-w-5xl mx-auto">
      {/* Assistant Header */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between gap-4 shrink-0 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-xs">
            <Bot className="w-5 h-5 text-indigo-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-slate-900 text-base">Assistant IA Business</h2>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md">
                Prêt
              </span>
            </div>
            <p className="text-xs text-slate-500 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>
                Contexte actif : {company.name} ({company.sector})
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openWhatsAppTutorialModal}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 text-emerald-900 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Guide d'intégration WhatsApp"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden md:inline">Intégration WhatsApp</span>
          </button>

          <button
            onClick={handleResetChat}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Effacer la discussion"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Nouveau sujet</span>
          </button>
        </div>
      </div>

      {/* Preset Topics Row */}
      <div className="shrink-0 mb-3 overflow-x-auto pb-1 flex gap-2 no-scrollbar">
        {PRESET_TOPICS.map((topic, idx) => {
          const Icon = topic.icon;
          return (
            <button
              key={idx}
              onClick={() => handleSendMessage(topic.prompt)}
              disabled={loading}
              className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-slate-900 text-xs font-semibold shrink-0 flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50 cursor-pointer shadow-2xs"
            >
              <Icon className="w-3.5 h-3.5 text-indigo-600" />
              <span>{topic.label}</span>
            </button>
          );
        })}
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 overflow-y-auto space-y-4 shadow-2xs">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  isUser
                    ? 'bg-slate-900 text-white rounded-tr-xs shadow-xs'
                    : 'bg-slate-50 text-slate-800 border border-slate-200/80 rounded-tl-xs'
                }`}
              >
                <div className="whitespace-pre-line break-words">{msg.text}</div>

                {!isUser && msg.id !== 'welcome' && (
                  <div className="mt-3 pt-2 border-t border-slate-200">
                    <ShareActionsBar
                      content={msg.text}
                      title="Conseil BusinessAI"
                      category="assistant"
                      phone={company.whatsapp || company.phone}
                      showViralPrompt={false}
                    />
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" />
              <span>BusinessAI réfléchit et rédige votre réponse...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="mt-3 flex items-center gap-2"
      >
        <div className="relative flex-1">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Posez votre question ou décrivez votre besoin (ex: Rédige un message pour féliciter nos clients fidèles)..."
            rows={2}
            className="w-full resize-none p-3.5 pr-12 rounded-2xl bg-white border border-slate-200 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 leading-normal shadow-2xs"
          />
        </div>

        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="h-[58px] px-5 rounded-2xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-slate-900 text-white font-bold text-xs sm:text-sm shadow-xs flex items-center justify-center gap-2 transition-all shrink-0 active:scale-95 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Envoyer</span>
        </button>
      </form>
    </div>
  );
};
