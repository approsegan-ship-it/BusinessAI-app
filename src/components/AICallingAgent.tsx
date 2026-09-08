import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import {
  CallScenario,
  VoicePersona,
  AICallSession,
  CallTurn,
} from '../types';
import { VOICE_PERSONAS } from '../utils/defaultData';
import { generateAICallScript } from '../services/geminiService';
import {
  PhoneCall,
  PhoneOff,
  PhoneForwarded,
  Volume2,
  VolumeX,
  Mic,
  Sparkles,
  Play,
  Square,
  Share2,
  CheckCircle2,
  Clock,
  User,
  Building2,
  Calendar,
  DollarSign,
  AlertTriangle,
  Send,
  RefreshCw,
  MessageSquare,
  FileText,
  Check,
  ChevronRight,
  ShieldCheck,
  Headphones,
  Radio,
  History,
  Trash2,
} from 'lucide-react';

export const AICallingAgent: React.FC = () => {
  const {
    company,
    invoices,
    callSessions,
    addCallSession,
    deleteCallSession,
    addToast,
    consumeCredit,
    user,
    openPaymentModal,
  } = useAppContext();

  // Selected persona & scenario
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>('amina');
  const [selectedScenario, setSelectedScenario] = useState<CallScenario>('payment_reminder');

  // Contact details
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactCompany, setContactCompany] = useState('');
  const [amountDue, setAmountDue] = useState<string>('');
  const [documentRef, setDocumentRef] = useState('');
  const [customGoal, setCustomGoal] = useState('');

  // Call simulation state
  const [callState, setCallState] = useState<'idle' | 'calling' | 'connected' | 'ended'>('idle');
  const [callDuration, setCallDuration] = useState(0);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [scriptTurns, setScriptTurns] = useState<CallTurn[]>([]);
  const [callObjective, setCallObjective] = useState('');
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [customCustomerInput, setCustomCustomerInput] = useState('');

  // Sound generator ref for ringtone
  const audioContextRef = useRef<AudioContext | null>(null);
  const ringtoneTimerRef = useRef<any>(null);
  const callTimerRef = useRef<any>(null);
  const transcriptBottomRef = useRef<HTMLDivElement>(null);

  // Read prefilled data from sessionStorage if launched from InvoiceGenerator
  useEffect(() => {
    try {
      const prefillRaw = sessionStorage.getItem('businessai_prefill_call');
      if (prefillRaw) {
        const prefill = JSON.parse(prefillRaw);
        if (prefill.contactName) setContactName(prefill.contactName);
        if (prefill.contactPhone) setContactPhone(prefill.contactPhone);
        if (prefill.contactCompany) setContactCompany(prefill.contactCompany);
        if (prefill.documentRef) setDocumentRef(prefill.documentRef);
        if (prefill.amountDue) setAmountDue(String(prefill.amountDue));
        if (prefill.scenario) setSelectedScenario(prefill.scenario);
        sessionStorage.removeItem('businessai_prefill_call');
        addToast('info', 'Données client importées', `Facture ${prefill.documentRef || ''}`);
      }
    } catch (e) {
      console.warn('Could not read call prefill', e);
    }
  }, [addToast]);

  const selectedPersona = useMemo(() => {
    return (
      VOICE_PERSONAS.find((p) => p.id === selectedPersonaId) || VOICE_PERSONAS[0]
    );
  }, [selectedPersonaId]);

  // Audio preview for voice personas using SpeechSynthesis
  const handlePreviewPersonaVoice = (persona: VoicePersona) => {
    if (!('speechSynthesis' in window)) {
      addToast('warning', 'Synthèse vocale non supportée par votre navigateur.');
      return;
    }

    window.speechSynthesis.cancel();
    const sampleTexts: Record<string, string> = {
      amina: `Bonjour ! Je suis la voix IA d'Amina. Je contacte vos clients avec bienveillance, politesse et professionnalisme pour vos relances et suivis.`,
      koffi: `Bonjour, ici Koffi. J'assure vos communications commerciales et confirmations de commande avec calme, assurance et clarté.`,
      fatou: `Salut ! C'est Fatou. Avec un ton dynamique et vendeur, je booste vos opportunités et prends vos rendez-vous clients avec le sourire !`,
      jean: `Bonjour. Je suis Jean. J'interviens sur vos dossiers financiers et le recouvrement de factures avec rigueur, respect et fermeté.`,
    };

    const text = sampleTexts[persona.id] || persona.sampleGreeting || `Bonjour, je suis la voix d'appel de votre entreprise.`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.pitch = persona.pitch;
    utterance.rate = persona.rate;

    // Pick a French voice if available
    const voices = window.speechSynthesis.getVoices();
    const frenchVoice = voices.find((v) => v.lang.startsWith('fr') && (persona.gender === 'female' ? /female|femme|amelie|hortense|thomas/i.test(v.name) : true));
    if (frenchVoice) utterance.voice = frenchVoice;

    window.speechSynthesis.speak(utterance);
    addToast('info', `Lecture audio : ${persona.name}`, persona.accentDesc);
  };

  // Ringtone synthesizer using Web Audio API
  const playRingtone = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const playBeep = () => {
        if (!audioContextRef.current || audioContextRef.current.state === 'closed') return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.2);
      };

      playBeep();
      ringtoneTimerRef.current = setInterval(playBeep, 2500);
    } catch (e) {
      console.warn('Audio ringtone error', e);
    }
  };

  const stopRingtone = () => {
    if (ringtoneTimerRef.current) {
      clearInterval(ringtoneTimerRef.current);
      ringtoneTimerRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
  };

  // Speak AI text using window.speechSynthesis
  const speakAIText = (text: string, onEnd?: () => void) => {
    if (isAudioMuted || !('speechSynthesis' in window)) {
      if (onEnd) setTimeout(onEnd, 2000);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.pitch = selectedPersona.pitch;
    utterance.rate = selectedPersona.rate;

    const voices = window.speechSynthesis.getVoices();
    const frVoice = voices.find((v) => v.lang.startsWith('fr'));
    if (frVoice) utterance.voice = frVoice;

    setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      if (onEnd) onEnd();
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  };

  // Handle Generate Script
  const handleGenerateScript = async () => {
    if (!contactName.trim()) {
      addToast('warning', 'Veuillez renseigner le nom du client à appeler');
      return;
    }

    const canProceed = consumeCredit(1);
    if (!canProceed) {
      addToast('warning', 'Crédits insuffisants', 'Veuillez recharger vos crédits ou passer au forfait Pro.');
      return;
    }

    setIsGeneratingScript(true);
    try {
      const result = await generateAICallScript({
        scenario: selectedScenario,
        contactName: contactName.trim(),
        contactCompany: contactCompany.trim() || undefined,
        contactPhone: contactPhone.trim() || undefined,
        amountDue: amountDue ? Number(amountDue) : undefined,
        documentRef: documentRef.trim() || undefined,
        customDetails: customGoal.trim() || undefined,
        voicePersona: selectedPersona,
        company,
      });

      setScriptTurns(result.turns);
      setCallObjective(result.objective);
      setCurrentTurnIndex(0);
      addToast('success', 'Script d’appel IA prêt !', `${result.turns.length} répliques générées.`);
    } catch (err) {
      console.error('Erreur génération script appel:', err);
      addToast('error', 'Erreur de génération', 'Veuillez vérifier votre connexion.');
    } finally {
      setIsGeneratingScript(false);
    }
  };

  // Start Call Simulation
  const handleStartCall = async () => {
    if (!user.isPurchased) {
      addToast(
        'error',
        'Paiement requis',
        'Les appels vocaux IA requièrent un forfait payé. Effectuez votre transfert au 0163638893.'
      );
      openPaymentModal('starter');
      return;
    }

    let turns = scriptTurns;
    if (turns.length === 0) {
      await handleGenerateScript();
      return;
    }

    setCallState('calling');
    setCallDuration(0);
    setCurrentTurnIndex(0);
    playRingtone();

    // Connect call after 3 seconds of ringing
    setTimeout(() => {
      stopRingtone();
      setCallState('connected');
      // Start duration timer
      callTimerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);

      // Play first AI greeting
      if (turns.length > 0 && turns[0].speaker === 'ai') {
        speakAIText(turns[0].text);
      }
    }, 3000);
  };

  // End Call
  const handleEndCall = () => {
    stopRingtone();
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setCallState('ended');

    // Save session to context
    const session: Omit<AICallSession, 'id' | 'createdAt'> = {
      scenario: selectedScenario,
      contactName: contactName || 'Client',
      contactPhone: contactPhone || 'Inconnu',
      contactCompany: contactCompany || undefined,
      voicePersonaId: selectedPersonaId,
      documentRef: documentRef || undefined,
      amountDue: amountDue ? Number(amountDue) : undefined,
      objective: callObjective || 'Appel IA réalisé avec succès.',
      customDetails: customGoal || undefined,
      turns: scriptTurns,
      fullScript: scriptTurns.map((t) => `[${t.speaker === 'ai' ? selectedPersona.name : 'Client'}] : ${t.text}`).join('\n'),
      whatsappFollowUpMessage: `Bonjour ${contactName}, suite à l'appel de notre assistant vocal chez ${company.name}, nous vous confirmons notre échange.`,
      status: 'completed',
      durationSeconds: callDuration,
      notes: callObjective || 'Appel IA réalisé avec succès.',
    };
    addCallSession(session);
    addToast('success', 'Appel terminé et enregistré', `Durée : ${Math.floor(callDuration / 60)}m ${callDuration % 60}s`);
  };

  // Customer responds (triggers next turn)
  const handleCustomerReply = (replyText: string) => {
    if (callState !== 'connected') return;

    // Advance to next AI turn
    let nextIdx = currentTurnIndex + 1;
    // If the next turn is a customer turn in the script, skip to the AI response after it
    if (nextIdx < scriptTurns.length && scriptTurns[nextIdx].speaker === 'customer') {
      nextIdx++;
    }

    if (nextIdx < scriptTurns.length) {
      setCurrentTurnIndex(nextIdx);
      setTimeout(() => {
        if (scriptTurns[nextIdx].speaker === 'ai') {
          speakAIText(scriptTurns[nextIdx].text);
        }
      }, 600);
    } else {
      // Last turn concluded
      speakAIText(
        `Parfait ! Merci infiniment pour votre disponibilité. Bonne journée de la part de ${company.name || 'notre équipe'} !`,
        () => {
          handleEndCall();
        }
      );
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRingtone();
      if (callTimerRef.current) clearInterval(callTimerRef.current);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentTurnIndex, callState]);

  // Format call duration MM:SS
  const formattedDuration = useMemo(() => {
    const mins = Math.floor(callDuration / 60);
    const secs = callDuration % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, [callDuration]);

  // Quick Select an existing invoice to populate contact details
  const handleSelectInvoice = (invoiceId: string) => {
    const doc = invoices.find((i) => i.id === invoiceId);
    if (!doc) return;
    setContactName(doc.clientName);
    setContactCompany(doc.clientCompany || '');
    setContactPhone(doc.clientPhone || '');
    setDocumentRef(doc.number);
    const sub = doc.items.reduce((acc, it) => acc + it.quantity * it.unitPrice, 0);
    const disc = doc.discountValue
      ? doc.discountType === 'fixed'
        ? doc.discountValue
        : (sub * doc.discountValue) / 100
      : 0;
    const ttc = sub - disc + (doc.taxRate ? ((sub - disc) * doc.taxRate) / 100 : 0);
    setAmountDue(String(ttc));
    setSelectedScenario(doc.type === 'quote' ? 'quote_followup' : 'payment_reminder');
    addToast('success', 'Document sélectionné', `Prêt pour ${doc.clientName} (${doc.number})`);
  };

  // WhatsApp post-call follow up message
  const handleSendPostCallWhatsApp = () => {
    const mobileMoneyInfo = company.whatsapp || company.phone || '0163638893';
    const message = `Bonjour ${contactName} ! 👋

Merci pour notre échange téléphonique de tout à l'heure avec notre service client (*${company.name || 'notre entreprise'}*).

${
  selectedScenario === 'payment_reminder'
    ? `Comme convenu ensemble, voici le rappel pour le règlement de la facture *${documentRef || 'en cours'}* d'un montant de *${Number(amountDue).toLocaleString()} ${company.currency || 'FCFA'}*.

📱 *Règlement Wave / Orange Money :* ${mobileMoneyInfo}`
    : selectedScenario === 'delivery_confirmation'
    ? `Votre commande a bien été validée et notre livreur est en route. Merci pour votre fidélité !`
    : `Nous restons à votre entière écoute pour toute question.`
}

Excellente journée ! 🌟`;

    const cleanPhone = (contactPhone || '').replace(/[^0-9]/g, '');
    const url = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    addToast('success', 'WhatsApp ouvert', 'Message récapitulatif post-appel préparé.');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
            <PhoneCall className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Appels Vocaux IA (Téléphone Intelligent)
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Déléguez vos appels à une voix IA naturelle et chaleureuse qui appelle vos clients à votre place.
            </p>
          </div>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Module Vocal Prêt (Audio Web API)
          </span>
        </div>
      </div>

      {/* MAIN TWO COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Configuration & Persona Picker (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Quick Document Picker */}
          {invoices.length > 0 && (
            <div className="p-4 rounded-xl border border-indigo-100 dark:border-indigo-950/60 bg-indigo-50/50 dark:bg-indigo-950/20">
              <label className="block text-xs font-semibold text-indigo-900 dark:text-indigo-300 mb-1.5">
                ⚡ Sélectionner un devis ou une facture existant(e) :
              </label>
              <select
                onChange={(e) => {
                  if (e.target.value) handleSelectInvoice(e.target.value);
                }}
                defaultValue=""
                className="w-full text-xs bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-800 rounded-lg px-3 py-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="" disabled>
                  Choisir un client / document à relancer...
                </option>
                {invoices.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.type === 'quote' ? 'Devis' : 'Facture'} {inv.number} - {inv.clientName}{' '}
                    ({inv.status === 'paid' ? 'Payé' : 'En attente'})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Scenario Selector */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              1. Objectif de l’appel vocal
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {[
                {
                  id: 'payment_reminder',
                  label: 'Relance Facture Impayée',
                  desc: 'Rappeler le montant et proposer Wave/OM',
                  icon: DollarSign,
                },
                {
                  id: 'delivery_confirmation',
                  label: 'Confirmation Commande',
                  desc: 'Valider adresse et heure de livraison',
                  icon: CheckCircle2,
                },
                {
                  id: 'quote_followup',
                  label: 'Suivi de Devis Envoyé',
                  desc: 'Répondre aux questions et négocier',
                  icon: FileText,
                },
                {
                  id: 'appointment',
                  label: 'Rappel Rendez-vous',
                  desc: 'Confirmer la présence du client',
                  icon: Calendar,
                },
                {
                  id: 'satisfaction',
                  label: 'Enquête Satisfaction',
                  desc: 'Avis client post-livraison',
                  icon: Sparkles,
                },
                {
                  id: 'custom',
                  label: 'Appel Personnalisé',
                  desc: 'Définissez votre propre consigne',
                  icon: MessageSquare,
                },
              ].map((sc) => {
                const Icon = sc.icon;
                const isSelected = selectedScenario === sc.id;
                return (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => setSelectedScenario(sc.id as CallScenario)}
                    className={`text-left p-3 rounded-xl border transition flex flex-col justify-between ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50/60 dark:bg-purple-950/40 text-purple-950 dark:text-purple-200 ring-1 ring-purple-600'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-semibold text-xs">{sc.label}</span>
                      <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-purple-600' : 'text-slate-400'}`} />
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                      {sc.desc}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Goal input if custom scenario selected */}
            {selectedScenario === 'custom' && (
              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Consignes spécifiques pour l’IA :
                </label>
                <textarea
                  rows={2}
                  placeholder="Ex: Proposer notre promotion -20% sur la collection de fin d'année et inviter à la boutique..."
                  value={customGoal}
                  onChange={(e) => setCustomGoal(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5"
                />
              </div>
            )}
          </div>

          {/* Voice Persona Selector */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                2. Choisir la Voix IA qui vous remplace
              </h3>
              <span className="text-[11px] text-purple-600 dark:text-purple-400 font-medium">
                Audio HD
              </span>
            </div>

            <div className="space-y-2">
              {VOICE_PERSONAS.map((persona) => {
                const isSelected = selectedPersonaId === persona.id;
                return (
                  <div
                    key={persona.id}
                    className={`p-3 rounded-xl border transition flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50/50 dark:bg-purple-950/30'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div
                      className="flex items-center gap-3 flex-1 cursor-pointer"
                      onClick={() => setSelectedPersonaId(persona.id)}
                    >
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                        {persona.name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                            {persona.name}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {persona.gender === 'female' ? 'Femme' : 'Homme'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {persona.role} — {persona.accentDesc}
                        </p>
                      </div>
                    </div>

                    {/* Audio Preview Button */}
                    <button
                      type="button"
                      onClick={() => handlePreviewPersonaVoice(persona)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-purple-50 dark:hover:bg-purple-950/50 text-purple-600 dark:text-purple-400 text-xs font-medium transition shadow-2xs"
                      title="Écouter un extrait de cette voix"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      Écouter
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact Details Form */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              3. Destinataire de l’appel
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Nom du client *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: M. Ousmane Diop"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Numéro de Téléphone
                </label>
                <input
                  type="tel"
                  placeholder="+221 77 000 00 00"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Montant concerné ({company.currency || 'FCFA'})
                </label>
                <input
                  type="number"
                  placeholder="Ex: 45000"
                  value={amountDue}
                  onChange={(e) => setAmountDue(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Réf. Facture ou Devis
                </label>
                <input
                  type="text"
                  placeholder="Ex: FAC-2026-004"
                  value={documentRef}
                  onChange={(e) => setDocumentRef(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 font-mono"
                />
              </div>
            </div>

            {/* Launch Action */}
            <div className="pt-2">
              <button
                id="btn-generate-call-script"
                type="button"
                disabled={isGeneratingScript || !contactName.trim() || callState === 'calling' || callState === 'connected'}
                onClick={handleGenerateScript}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-md flex items-center justify-center gap-2 transition active:scale-98 disabled:opacity-50"
              >
                {isGeneratingScript ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Préparation du script d’appel IA...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Générer le script d’appel avec l’IA
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Smartphone Dialing Interface (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Smartphone Simulator Card */}
          <div className="rounded-3xl border-4 border-slate-800 dark:border-slate-700 bg-slate-950 text-white shadow-2xl p-6 md:p-8 relative overflow-hidden">
            {/* Top Phone speaker notch */}
            <div className="w-24 h-4 bg-slate-900 rounded-full mx-auto mb-6 flex items-center justify-center">
              <div className="w-10 h-1.5 bg-slate-700 rounded-full" />
            </div>

            {/* Caller ID Card */}
            <div className="text-center space-y-2">
              <div className="relative inline-block">
                <div
                  className={`w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-2xl font-black shadow-lg mx-auto ${
                    callState === 'calling'
                      ? 'animate-pulse ring-4 ring-purple-500/40'
                      : callState === 'connected' && isSpeaking
                      ? 'ring-4 ring-emerald-500/60 animate-pulse'
                      : ''
                  }`}
                >
                  {selectedPersona.name[0]}
                </div>
                {callState === 'connected' && (
                  <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center text-[10px]">
                    ●
                  </span>
                )}
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-100">
                  {contactName || 'Client Entreprise'}
                </h2>
                <p className="text-xs text-slate-400">
                  {contactPhone || '+221 77 ••• •• ••'} {contactCompany ? `(${contactCompany})` : ''}
                </p>
                <p className="text-[11px] text-purple-400 mt-1">
                  Appel passé par la voix IA : <strong>{selectedPersona.name}</strong> ({selectedPersona.accentDesc})
                </p>
              </div>

              {/* Status & Timer */}
              <div className="py-2">
                {callState === 'idle' && (
                  <span className="text-xs text-slate-400">
                    Prêt pour le lancement. Cliquez sur "Lancer l’Appel Vocal"
                  </span>
                )}
                {callState === 'calling' && (
                  <div className="flex items-center justify-center gap-2 text-xs text-amber-400 font-medium">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    Sonnerie en cours... (Téléphone du client sonne)
                  </div>
                )}
                {callState === 'connected' && (
                  <div className="space-y-1">
                    <div className="text-sm font-mono text-emerald-400 font-bold">
                      {formattedDuration}
                    </div>
                    <div className="flex items-center justify-center gap-1.5 text-xs text-slate-300">
                      {isSpeaking ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400">
                          <Radio className="w-3.5 h-3.5 animate-pulse" />
                          L’IA parle actuellement au client...
                        </span>
                      ) : (
                        <span className="text-slate-400">En écoute du client...</span>
                      )}
                    </div>
                  </div>
                )}
                {callState === 'ended' && (
                  <span className="text-xs text-rose-400 font-medium">
                    Appel raccroché (Durée : {formattedDuration})
                  </span>
                )}
              </div>
            </div>

            {/* LIVE CONVERSATION TRANSCRIPT BUBBLE */}
            <div className="my-6 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 max-h-60 overflow-y-auto space-y-3">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-800 pb-1">
                Transcription en direct de l’échange
              </div>

              {scriptTurns.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-500 italic">
                  Aucun script généré pour l’instant. Cliquez sur "Générer le script" ou "Lancer l’Appel" pour préparer la conversation.
                </div>
              ) : (
                scriptTurns.slice(0, currentTurnIndex + 1).map((turn, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-2 text-xs ${turn.speaker === 'customer' ? 'justify-end' : ''}`}
                  >
                    {turn.speaker === 'ai' && (
                      <div className="w-6 h-6 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        IA
                      </div>
                    )}
                    <div
                      className={`p-3 rounded-2xl max-w-[85%] ${
                        turn.speaker === 'ai'
                          ? 'rounded-tl-none bg-purple-950/60 border border-purple-800/60 text-slate-100'
                          : 'rounded-tr-none bg-slate-800 text-slate-200'
                      }`}
                    >
                      <p className="leading-relaxed">{turn.text}</p>
                    </div>
                    {turn.speaker === 'customer' && (
                      <div className="w-6 h-6 rounded-full bg-slate-700 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {contactName[0] || 'C'}
                      </div>
                    )}
                  </div>
                ))
              )}
              <div ref={transcriptBottomRef} />
            </div>

            {/* INTERACTIVE CUSTOMER RESPONSE OPTIONS (When Connected) */}
            {callState === 'connected' && scriptTurns.length > 0 && currentTurnIndex < scriptTurns.length && (
              <div className="mb-6 p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <span className="text-[11px] text-slate-400 font-semibold block">
                  👉 Réponse du client à tester en direct :
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {scriptTurns[currentTurnIndex]?.suggestedCustomerReplies &&
                  scriptTurns[currentTurnIndex].suggestedCustomerReplies!.length > 0 ? (
                    scriptTurns[currentTurnIndex].suggestedCustomerReplies!.map((reply, rIdx) => (
                      <button
                        key={rIdx}
                        type="button"
                        onClick={() => handleCustomerReply(reply)}
                        className="text-left text-xs px-3 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/50 text-purple-200 transition"
                      >
                        💬 "{reply}"
                      </button>
                    ))
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => handleCustomerReply("Oui, parfaitement, je m'en occupe tout de suite.")}
                        className="text-left text-xs px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/40 text-emerald-200 transition"
                      >
                        ✅ "Oui, je m'en occupe tout de suite"
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCustomerReply("Pouvez-vous m'accorder un délai de 48 heures s'il vous plaît ?")}
                        className="text-left text-xs px-3 py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/40 border border-amber-500/40 text-amber-200 transition"
                      >
                        ⏳ "Accordez-moi 48h de délai"
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* DIALER / PHONE CONTROLS */}
            <div className="flex items-center justify-center gap-4 pt-2">
              {/* Audio mute toggle */}
              <button
                type="button"
                onClick={() => setIsAudioMuted(!isAudioMuted)}
                className={`p-3.5 rounded-full border transition ${
                  isAudioMuted
                    ? 'bg-rose-950/80 border-rose-700 text-rose-300'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                }`}
                title={isAudioMuted ? 'Activer le son' : 'Couper le son'}
              >
                {isAudioMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>

              {/* Main Call / Hangup Button */}
              {callState === 'idle' || callState === 'ended' ? (
                <button
                  id="btn-start-ai-call"
                  type="button"
                  onClick={handleStartCall}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-950 transition active:scale-95"
                >
                  <PhoneCall className="w-5 h-5" />
                  Lancer l’Appel Vocal IA
                </button>
              ) : (
                <button
                  id="btn-end-ai-call"
                  type="button"
                  onClick={handleEndCall}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-lg shadow-rose-950 transition active:scale-95 animate-pulse"
                >
                  <PhoneOff className="w-5 h-5" />
                  Raccrocher l’appel
                </button>
              )}

              {/* Replay voice line */}
              {callState === 'connected' && (
                <button
                  type="button"
                  onClick={() => {
                    if (scriptTurns[currentTurnIndex]) {
                      speakAIText(scriptTurns[currentTurnIndex].aiSpeech);
                    }
                  }}
                  className="p-3.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800 transition"
                  title="Répéter la réplique"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* POST-CALL ACTIONS & WHATSAPP FOLLOW UP */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Suivi Post-Appel & Confirmation Client
              </h3>
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Synchronisé avec vos factures
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              Envoyez immédiatement un récapitulatif par message WhatsApp au client suite à l’appel téléphonique (coordonnées de paiement Wave/Orange Money incluses).
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={handleSendPostCallWhatsApp}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition active:scale-95"
              >
                <Share2 className="w-4 h-4" />
                Envoyer le récapitulatif sur WhatsApp
              </button>
            </div>
          </div>

          {/* CALL SESSIONS HISTORY */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <History className="w-4 h-4 text-purple-600" />
                Historique des Appels IA Réalisés
              </h3>
              <span className="text-xs text-slate-400">
                {callSessions.length} appel{callSessions.length > 1 ? 's' : ''} enregistré{callSessions.length > 1 ? 's' : ''}
              </span>
            </div>

            {callSessions.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 italic">
                Aucun appel téléphonique enregistré pour le moment.
              </p>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {callSessions.map((s) => (
                  <div
                    key={s.id}
                    className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {s.contactName}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                          {s.scenario === 'payment_reminder'
                            ? 'Facture'
                            : s.scenario === 'quote_followup'
                            ? 'Devis'
                            : 'Client'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Tél : {s.contactPhone} • Durée : {Math.floor(s.durationSeconds / 60)}m {s.durationSeconds % 60}s
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => deleteCallSession(s.id)}
                        className="p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        title="Supprimer de l'historique"
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
