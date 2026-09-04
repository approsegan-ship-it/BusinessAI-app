import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import {
  InvoiceDocument,
  InvoiceItem,
  InvoiceType,
  InvoiceStatus,
} from '../types';
import { generateInvoiceWithAI } from '../services/geminiService';
import {
  FileText,
  Receipt,
  Plus,
  Search,
  Filter,
  Printer,
  Share2,
  PhoneCall,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  Copy,
  Trash2,
  Edit,
  Sparkles,
  Send,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Download,
  Check,
  X,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export const InvoiceGenerator: React.FC = () => {
  const {
    invoices,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    duplicateInvoice,
    convertQuoteToInvoice,
    products,
    company,
    addToast,
    consumeCredit,
    user,
    setCurrentTab,
  } = useAppContext();

  // Filter & Search states
  const [activeTypeFilter, setActiveTypeFilter] = useState<'all' | 'quote' | 'invoice'>('all');
  const [activeStatusFilter, setActiveStatusFilter] = useState<'all' | InvoiceStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // View / Edit / Create modals
  const [selectedDocForPreview, setSelectedDocForPreview] = useState<InvoiceDocument | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDocId, setEditingDocId] = useState<string | null>(null);

  // Form State
  const [formType, setFormType] = useState<InvoiceType>('invoice');
  const [formNumber, setFormNumber] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().slice(0, 10));
  const [formDueDate, setFormDueDate] = useState(
    new Date(Date.now() + 86400000 * 14).toISOString().slice(0, 10)
  );
  const [formClientName, setFormClientName] = useState('');
  const [formClientCompany, setFormClientCompany] = useState('');
  const [formClientPhone, setFormClientPhone] = useState('');
  const [formClientEmail, setFormClientEmail] = useState('');
  const [formClientAddress, setFormClientAddress] = useState('');
  const [formItems, setFormItems] = useState<InvoiceItem[]>([
    {
      id: 'item-1',
      description: 'Prestation de service ou produit',
      quantity: 1,
      unitPrice: 25000,
      taxRate: 0,
      total: 25000,
    },
  ]);
  const [formDiscountType, setFormDiscountType] = useState<'percent' | 'fixed'>('percent');
  const [formDiscountValue, setFormDiscountValue] = useState<number>(0);
  const [formTaxRate, setFormTaxRate] = useState<number>(0);
  const [formStatus, setFormStatus] = useState<InvoiceStatus>('pending');
  const [formNotes, setFormNotes] = useState('');
  const [formPaymentTerms, setFormPaymentTerms] = useState('');
  const [formMobileMoneyNumber, setFormMobileMoneyNumber] = useState(company.whatsapp || company.phone || '');
  const [formMobileMoneyProvider, setFormMobileMoneyProvider] = useState('Wave / Orange Money');
  const [formBankName, setFormBankName] = useState('');
  const [formIbanOrRib, setFormIbanOrRib] = useState('');

  // AI Prompt Modal
  const [isAIGenerating, setIsAIGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  // Open Create Modal
  const handleOpenCreate = (type: InvoiceType = 'invoice') => {
    setEditingDocId(null);
    setFormType(type);
    const prefix = type === 'quote' ? 'DEV' : 'FAC';
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    setFormNumber(`${prefix}-${new Date().getFullYear()}-${randomSuffix}`);
    setFormDate(new Date().toISOString().slice(0, 10));
    setFormDueDate(new Date(Date.now() + 86400000 * 14).toISOString().slice(0, 10));
    setFormClientName('');
    setFormClientCompany('');
    setFormClientPhone('');
    setFormClientEmail('');
    setFormClientAddress('');
    setFormItems([
      {
        id: 'item-1',
        description: 'Prestation principale ou produit',
        quantity: 1,
        unitPrice: 25000,
        taxRate: 0,
        total: 25000,
      },
    ]);
    setFormDiscountType('percent');
    setFormDiscountValue(0);
    setFormTaxRate(0);
    setFormStatus(type === 'quote' ? 'sent' : 'pending');
    setFormNotes(
      type === 'quote'
        ? 'Devis valable 15 jours ouvrés. Acompte de 50% à la commande.'
        : 'Merci pour votre confiance. Paiement à réception par Mobile Money ou virement bancaire.'
    );
    setFormPaymentTerms(
      type === 'quote'
        ? '50% à la commande, solde à la livraison'
        : 'Paiement comptant à réception de facture'
    );
    setFormMobileMoneyNumber(company.whatsapp || company.phone || '');
    setFormMobileMoneyProvider('Wave / Orange Money');
    setFormBankName('');
    setFormIbanOrRib('');
    setIsEditModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (doc: InvoiceDocument) => {
    setEditingDocId(doc.id);
    setFormType(doc.type);
    setFormNumber(doc.number);
    setFormDate(doc.date);
    setFormDueDate(doc.dueDate);
    setFormClientName(doc.clientName);
    setFormClientCompany(doc.clientCompany || '');
    setFormClientPhone(doc.clientPhone || '');
    setFormClientEmail(doc.clientEmail || '');
    setFormClientAddress(doc.clientAddress || '');
    setFormItems(doc.items && doc.items.length > 0 ? doc.items : [
      {
        id: 'item-1',
        description: 'Article',
        quantity: 1,
        unitPrice: 10000,
        taxRate: 0,
        total: 10000,
      },
    ]);
    setFormDiscountType(doc.discountType || 'percent');
    setFormDiscountValue(doc.discountValue || 0);
    setFormTaxRate(doc.taxRate || 0);
    setFormStatus(doc.status);
    setFormNotes(doc.notes || '');
    setFormPaymentTerms(doc.paymentTerms || '');
    setFormMobileMoneyNumber(doc.paymentDetails?.mobileMoneyNumber || company.whatsapp || '');
    setFormMobileMoneyProvider(doc.paymentDetails?.mobileMoneyProvider || 'Wave / Orange Money');
    setFormBankName(doc.paymentDetails?.bankName || '');
    setFormIbanOrRib(doc.paymentDetails?.ibanOrRib || '');
    setIsEditModalOpen(true);
  };

  // Form Item Row Handlers
  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      description: 'Nouvelle ligne de prestation ou produit',
      quantity: 1,
      unitPrice: 10000,
      taxRate: formTaxRate,
      total: 10000,
    };
    setFormItems([...formItems, newItem]);
  };

  const handleUpdateItem = (id: string, field: keyof InvoiceItem, val: any) => {
    setFormItems(
      formItems.map((it) => {
        if (it.id !== id) return it;
        const updated = { ...it, [field]: val };
        if (field === 'quantity' || field === 'unitPrice') {
          const qty = field === 'quantity' ? Number(val) || 0 : it.quantity;
          const up = field === 'unitPrice' ? Number(val) || 0 : it.unitPrice;
          updated.total = qty * up;
        }
        return updated;
      })
    );
  };

  const handleRemoveItem = (id: string) => {
    if (formItems.length <= 1) {
      addToast('warning', 'Au moins un article est requis');
      return;
    }
    setFormItems(formItems.filter((it) => it.id !== id));
  };

  const handleImportProduct = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;
    const newItem: InvoiceItem = {
      id: `item-${Date.now()}`,
      description: prod.name + (prod.category ? ` (${prod.category})` : ''),
      quantity: 1,
      unitPrice: prod.price || 10000,
      taxRate: formTaxRate,
      total: prod.price || 10000,
    };
    setFormItems([...formItems, newItem]);
    addToast('success', 'Article importé', `"${prod.name}" a été ajouté.`);
  };

  // Calculate totals for Form
  const subTotalHT = useMemo(() => {
    return formItems.reduce((acc, it) => acc + (it.quantity * it.unitPrice), 0);
  }, [formItems]);

  const discountAmount = useMemo(() => {
    if (!formDiscountValue || formDiscountValue <= 0) return 0;
    if (formDiscountType === 'percent') {
      return (subTotalHT * formDiscountValue) / 100;
    }
    return Math.min(formDiscountValue, subTotalHT);
  }, [subTotalHT, formDiscountType, formDiscountValue]);

  const totalAfterDiscount = Math.max(0, subTotalHT - discountAmount);

  const vatAmount = useMemo(() => {
    if (!formTaxRate || formTaxRate <= 0) return 0;
    return (totalAfterDiscount * formTaxRate) / 100;
  }, [totalAfterDiscount, formTaxRate]);

  const totalTTC = totalAfterDiscount + vatAmount;

  // Save Document
  const handleSaveDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formClientName.trim()) {
      addToast('error', 'Le nom du client est obligatoire');
      return;
    }

    const payload = {
      type: formType,
      number: formNumber || `${formType === 'quote' ? 'DEV' : 'FAC'}-${Date.now().toString().slice(-6)}`,
      date: formDate,
      dueDate: formDueDate,
      clientName: formClientName.trim(),
      clientCompany: formClientCompany.trim() || undefined,
      clientPhone: formClientPhone.trim() || undefined,
      clientEmail: formClientEmail.trim() || undefined,
      clientAddress: formClientAddress.trim() || undefined,
      items: formItems,
      discountType: formDiscountType,
      discountValue: formDiscountValue,
      taxRate: formTaxRate,
      status: formStatus,
      notes: formNotes.trim() || undefined,
      paymentTerms: formPaymentTerms.trim() || undefined,
      paymentDetails: {
        mobileMoneyNumber: formMobileMoneyNumber || undefined,
        mobileMoneyProvider: formMobileMoneyProvider || undefined,
        bankName: formBankName || undefined,
        ibanOrRib: formIbanOrRib || undefined,
      },
    };

    if (editingDocId) {
      updateInvoice(editingDocId, payload);
      // Update selected doc if open
      if (selectedDocForPreview && selectedDocForPreview.id === editingDocId) {
        setSelectedDocForPreview({
          ...selectedDocForPreview,
          ...payload,
          updatedAt: new Date().toISOString(),
        });
      }
    } else {
      const created = addInvoice(payload);
      setSelectedDocForPreview(created);
    }

    setIsEditModalOpen(false);
  };

  // AI Generation
  const handleGenerateWithAI = async () => {
    if (!aiPrompt.trim()) {
      addToast('warning', 'Veuillez décrire le devis ou la facture à générer');
      return;
    }

    const canProceed = consumeCredit(1);
    if (!canProceed) {
      addToast('warning', 'Crédits insuffisants', 'Passez à un forfait supérieur pour utiliser l’IA.');
      return;
    }

    setIsAIGenerating(true);
    try {
      const result = await generateInvoiceWithAI({
        type: formType,
        clientName: formClientName || 'Client Entreprise',
        clientCompany: formClientCompany,
        clientPhone: formClientPhone,
        descriptionOrNeeds: aiPrompt,
        company,
        taxRate: formTaxRate,
      });

      const newItems: InvoiceItem[] = result.items.map((it, idx) => ({
        id: `ai-item-${Date.now()}-${idx}`,
        description: it.description,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        taxRate: it.taxRate,
        total: it.quantity * it.unitPrice,
      }));

      setFormItems(newItems);
      if (result.notes) setFormNotes(result.notes);
      if (result.paymentTerms) setFormPaymentTerms(result.paymentTerms);
      if (typeof result.discountValue === 'number') {
        setFormDiscountValue(result.discountValue);
        setFormDiscountType(result.discountType || 'percent');
      }

      setIsAIModalOpen(false);
      setAiPrompt('');
      addToast('success', 'Articles générés par l’IA !', `${newItems.length} lignes ajoutées avec tarifs réalistes.`);
    } catch (err) {
      console.error('Erreur génération IA:', err);
      addToast('error', 'Échec de génération IA', 'Veuillez réessayer.');
    } finally {
      setIsAIGenerating(false);
    }
  };

  // Quick Preset Prompts for AI
  const aiPresetPrompts = [
    'Confection sur mesure de 4 costumes tailleurs avec doublure soie et livraison Dakar',
    'Prestation de shooting photo produit e-commerce + retouche de 20 visuels HD',
    'Organisation buffet cocktail traiteur 30 personnes avec serveurs et boissons fraîches',
    'Rénovation peinture salon et 2 chambres avec ponçage et finitions soignées',
    'Création de site internet vitrine 5 pages + logo professionnel + formation 2h',
  ];

  // Filtered List
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      // Type filter
      if (activeTypeFilter !== 'all' && inv.type !== activeTypeFilter) return false;
      // Status filter
      if (activeStatusFilter !== 'all' && inv.status !== activeStatusFilter) return false;
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = inv.clientName.toLowerCase().includes(q);
        const matchCompany = inv.clientCompany?.toLowerCase().includes(q);
        const matchNum = inv.number.toLowerCase().includes(q);
        const matchItem = inv.items.some((it) => it.description.toLowerCase().includes(q));
        return matchName || matchCompany || matchNum || matchItem;
      }
      return true;
    });
  }, [invoices, activeTypeFilter, activeStatusFilter, searchQuery]);

  // Overall Statistics
  const stats = useMemo(() => {
    let totalInvoiced = 0;
    let totalPaid = 0;
    let totalPendingInvoices = 0;
    let totalPendingQuotes = 0;
    let unpaidCount = 0;

    invoices.forEach((inv) => {
      const sub = inv.items.reduce((acc, it) => acc + it.quantity * it.unitPrice, 0);
      const disc = inv.discountValue
        ? inv.discountType === 'fixed'
          ? inv.discountValue
          : (sub * inv.discountValue) / 100
        : 0;
      const net = Math.max(0, sub - disc);
      const tax = inv.taxRate ? (net * inv.taxRate) / 100 : 0;
      const ttc = net + tax;

      if (inv.type === 'invoice') {
        totalInvoiced += ttc;
        if (inv.status === 'paid') {
          totalPaid += ttc;
        } else if (inv.status === 'pending' || inv.status === 'sent') {
          totalPendingInvoices += ttc;
          unpaidCount++;
        }
      } else if (inv.type === 'quote') {
        if (inv.status === 'sent' || inv.status === 'draft' || inv.status === 'pending') {
          totalPendingQuotes += ttc;
        }
      }
    });

    return {
      totalInvoiced,
      totalPaid,
      totalPendingInvoices,
      totalPendingQuotes,
      unpaidCount,
    };
  }, [invoices]);

  // Helper to calculate doc total
  const computeDocTotal = (doc: InvoiceDocument) => {
    const sub = doc.items.reduce((acc, it) => acc + it.quantity * it.unitPrice, 0);
    const disc = doc.discountValue
      ? doc.discountType === 'fixed'
        ? doc.discountValue
        : (sub * doc.discountValue) / 100
      : 0;
    const net = Math.max(0, sub - disc);
    const tax = doc.taxRate ? (net * doc.taxRate) / 100 : 0;
    return {
      subTotal: sub,
      discount: disc,
      vat: tax,
      totalTTC: net + tax,
    };
  };

  // Status Badge Helper
  const getStatusBadge = (status: InvoiceStatus, type: InvoiceType) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Payée
          </span>
        );
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Devis Accepté
          </span>
        );
      case 'sent':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
            <Send className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            Envoyé
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            En attente
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            Brouillon
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            Annulé
          </span>
        );
    }
  };

  // WhatsApp Share Helper
  const handleShareWhatsApp = (doc: InvoiceDocument) => {
    const totals = computeDocTotal(doc);
    const currency = company.currency || 'FCFA';
    const docLabel = doc.type === 'quote' ? 'DEVIS' : 'FACTURE';
    const message = `Bonjour ${doc.clientName} ! 👋

Veuillez trouver ci-joint les détails de votre ${docLabel} émis par *${company.name || 'notre entreprise'}* :

📄 *Numéro :* ${doc.number}
📅 *Date :* ${doc.date}
⏰ *Échéance / Validité :* ${doc.dueDate}

💰 *Montant Total :* ${totals.totalTTC.toLocaleString()} ${currency}

${doc.paymentDetails?.mobileMoneyNumber ? `💳 *Règlement Mobile Money :* ${doc.paymentDetails.mobileMoneyNumber} (${doc.paymentDetails.mobileMoneyProvider || 'Wave / OM'})` : ''}
${doc.paymentDetails?.bankName ? `🏦 *Banque :* ${doc.paymentDetails.bankName} - RIB: ${doc.paymentDetails.ibanOrRib}` : ''}

${doc.notes ? `📝 *Note :* ${doc.notes}` : ''}

Restant à votre entière disposition pour tout renseignement.
Excellente journée ! ✨`;

    const cleanPhone = (doc.clientPhone || '').replace(/[^0-9]/g, '');
    const url = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;

    window.open(url, '_blank');
    addToast('success', 'WhatsApp ouvert', 'Message pré-rempli avec les montants.');
  };

  // Trigger AI Voice Call for this document
  const handleLaunchVoiceCall = (doc: InvoiceDocument) => {
    const totals = computeDocTotal(doc);
    // Switch to ai_calls tab and store temporary prefill
    sessionStorage.setItem(
      'businessai_prefill_call',
      JSON.stringify({
        contactName: doc.clientName,
        contactPhone: doc.clientPhone || '',
        contactCompany: doc.clientCompany || '',
        documentRef: doc.number,
        amountDue: totals.totalTTC,
        scenario: doc.type === 'quote' ? 'quote_followup' : 'payment_reminder',
      })
    );
    setCurrentTab('ai_calls');
    addToast(
      'info',
      'Appel Vocal IA initialisé',
      `Pré-rempli pour ${doc.clientName} (${doc.number}).`
    );
  };

  return (
    <div className="space-y-6 pb-12 print:p-0 print:m-0">
      {/* HEADER SECTION (Hidden when printing) */}
      <div className="print:hidden flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Générateur de Devis & Factures
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Créez, personnalisez, calculez automatiquement la TVA et partagez vos documents en PDF ou sur WhatsApp.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="btn-generate-ai-invoice"
            type="button"
            onClick={() => {
              setAiPrompt('');
              setIsAIModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-medium shadow-sm transition active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            Générer avec l’IA
          </button>

          <button
            id="btn-create-quote"
            type="button"
            onClick={() => handleOpenCreate('quote')}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium shadow-sm transition active:scale-95"
          >
            <Plus className="w-4 h-4 text-slate-400" />
            Nouveau Devis
          </button>

          <button
            id="btn-create-invoice"
            type="button"
            onClick={() => handleOpenCreate('invoice')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium shadow-sm transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Nouvelle Facture
          </button>
        </div>
      </div>

      {/* METRICS / STATS OVERVIEW (Hidden when printing) */}
      <div className="print:hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Facturé
            </span>
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {stats.totalInvoiced.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 font-medium">{company.currency || 'FCFA'}</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">Factures émises</p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Encaissé
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {stats.totalPaid.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 font-medium">{company.currency || 'FCFA'}</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">Règlements reçus</p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              En Attente Règlement
            </span>
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {stats.totalPendingInvoices.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 font-medium">{company.currency || 'FCFA'}</span>
          </div>
          <p className="mt-1 text-xs text-amber-600 dark:text-amber-400 font-medium">
            {stats.unpaidCount} facture{stats.unpaidCount > 1 ? 's' : ''} à relancer
          </p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Devis en Négociation
            </span>
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {stats.totalPendingQuotes.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 font-medium">{company.currency || 'FCFA'}</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">Propositions transmises</p>
        </div>
      </div>

      {/* FILTER TABS & SEARCH BAR (Hidden when printing) */}
      <div className="print:hidden flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setActiveTypeFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
              activeTypeFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Tous ({invoices.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTypeFilter('quote')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
              activeTypeFilter === 'quote'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Devis ({invoices.filter((i) => i.type === 'quote').length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTypeFilter('invoice')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
              activeTypeFilter === 'invoice'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Factures ({invoices.filter((i) => i.type === 'invoice').length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Filter */}
          <select
            value={activeStatusFilter}
            onChange={(e) => setActiveStatusFilter(e.target.value as any)}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="all">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="paid">Payée</option>
            <option value="sent">Envoyé</option>
            <option value="accepted">Accepté</option>
            <option value="draft">Brouillon</option>
          </select>

          {/* Search input */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher client, réf..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* DOCUMENT TABLE LIST (Hidden when printing) */}
      <div className="print:hidden bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {filteredInvoices.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Receipt className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
              Aucun document trouvé
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
              Créez votre premier devis ou facture professionnelle en quelques secondes ou utilisez l’assistant IA.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => handleOpenCreate('quote')}
                className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              >
                Créer un Devis
              </button>
              <button
                type="button"
                onClick={() => handleOpenCreate('invoice')}
                className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
              >
                Créer une Facture
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="py-3 px-4">Document</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Date & Échéance</th>
                  <th className="py-3 px-4">Montant TTC</th>
                  <th className="py-3 px-4">Statut</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredInvoices.map((doc) => {
                  const totals = computeDocTotal(doc);
                  const isQuote = doc.type === 'quote';

                  return (
                    <tr
                      key={doc.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition group cursor-pointer"
                      onClick={() => setSelectedDocForPreview(doc)}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isQuote ? 'bg-blue-500' : 'bg-indigo-600'
                            }`}
                          />
                          <div>
                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                              {doc.number}
                            </span>
                            <span className="block text-[11px] text-slate-400">
                              {isQuote ? 'Devis commercial' : 'Facture client'}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800 dark:text-slate-200">
                          {doc.clientName}
                        </div>
                        {doc.clientCompany && (
                          <div className="text-[11px] text-slate-400">{doc.clientCompany}</div>
                        )}
                        {doc.clientPhone && (
                          <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Phone className="w-2.5 h-2.5" />
                            {doc.clientPhone}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="text-slate-700 dark:text-slate-300">{doc.date}</div>
                        <div className="text-[11px] text-slate-400">Échéance : {doc.dueDate}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                          {totals.totalTTC.toLocaleString()} {company.currency || 'FCFA'}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {doc.items.length} article{doc.items.length > 1 ? 's' : ''}
                        </div>
                      </td>

                      <td className="py-3 px-4">{getStatusBadge(doc.status, doc.type)}</td>

                      <td
                        className="py-3 px-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1">
                          {/* Quick WhatsApp Send */}
                          <button
                            type="button"
                            title="Partager sur WhatsApp"
                            onClick={() => handleShareWhatsApp(doc)}
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>

                          {/* Trigger AI Call (relance) */}
                          <button
                            type="button"
                            title="Faire relancer par l'appel vocal IA"
                            onClick={() => handleLaunchVoiceCall(doc)}
                            className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition"
                          >
                            <PhoneCall className="w-4 h-4" />
                          </button>

                          {/* Preview / View */}
                          <button
                            type="button"
                            title="Aperçu & Impression"
                            onClick={() => setSelectedDocForPreview(doc)}
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          >
                            <Printer className="w-4 h-4" />
                          </button>

                          {/* Edit */}
                          <button
                            type="button"
                            title="Modifier"
                            onClick={() => handleOpenEdit(doc)}
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          >
                            <Edit className="w-4 h-4" />
                          </button>

                          {/* Duplicate */}
                          <button
                            type="button"
                            title="Dupliquer"
                            onClick={() => duplicateInvoice(doc.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            title="Supprimer"
                            onClick={() => {
                              if (window.confirm(`Supprimer le document ${doc.number} ?`)) {
                                deleteInvoice(doc.id);
                                if (selectedDocForPreview?.id === doc.id) {
                                  setSelectedDocForPreview(null);
                                }
                              }
                            }}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DOCUMENT PREVIEW MODAL / PRINTABLE VIEW */}
      {selectedDocForPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto print:static print:p-0 print:bg-white print:backdrop-blur-none">
          <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 my-auto print:border-none print:shadow-none print:rounded-none print:max-w-none">
            {/* Top Toolbar (Hidden on print) */}
            <div className="print:hidden flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 rounded-t-2xl">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                  {selectedDocForPreview.type === 'quote' ? 'Devis' : 'Facture'} :{' '}
                  {selectedDocForPreview.number}
                </span>
                {getStatusBadge(selectedDocForPreview.status, selectedDocForPreview.type)}
              </div>

              <div className="flex items-center gap-2">
                {/* Print button */}
                <button
                  id="btn-print-doc"
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium shadow-sm transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Imprimer / PDF
                </button>

                {/* WhatsApp button */}
                <button
                  type="button"
                  onClick={() => handleShareWhatsApp(selectedDocForPreview)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium shadow-sm transition"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  WhatsApp
                </button>

                {/* Launch AI Voice Call */}
                <button
                  type="button"
                  onClick={() => handleLaunchVoiceCall(selectedDocForPreview)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium shadow-sm transition"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  Appel Vocal IA
                </button>

                {/* Convert to Invoice if Quote */}
                {selectedDocForPreview.type === 'quote' && (
                  <button
                    type="button"
                    onClick={() => {
                      const inv = convertQuoteToInvoice(selectedDocForPreview.id);
                      if (inv) setSelectedDocForPreview(inv);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 text-slate-700 dark:text-slate-200 text-xs font-medium transition"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    Convertir en Facture
                  </button>
                )}

                {/* Edit */}
                <button
                  type="button"
                  onClick={() => {
                    handleOpenEdit(selectedDocForPreview);
                  }}
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                  title="Modifier"
                >
                  <Edit className="w-4 h-4" />
                </button>

                {/* Close */}
                <button
                  type="button"
                  onClick={() => setSelectedDocForPreview(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* PRINTABLE INVOICE SHEET (A4 Look) */}
            <div className="p-8 md:p-12 text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 print:text-black print:bg-white">
              {/* Header: Company info & Document Title */}
              <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-slate-200 dark:border-slate-800 pb-8">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-base">
                      {(company.name || 'B')[0].toUpperCase()}
                    </div>
                    <span className="text-xl font-bold text-slate-900 dark:text-slate-100 print:text-black tracking-tight">
                      {company.name || 'Mon Entreprise'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{company.sector}</p>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mt-3 space-y-1">
                    {company.address && (
                      <p className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {company.address}
                      </p>
                    )}
                    {company.phone && (
                      <p className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        Tél : {company.phone}
                      </p>
                    )}
                    {company.whatsapp && (
                      <p className="flex items-center gap-1.5">
                        <Share2 className="w-3.5 h-3.5 text-emerald-500" />
                        WhatsApp : {company.whatsapp}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-left md:text-right">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-md ${
                      selectedDocForPreview.type === 'quote'
                        ? 'bg-blue-100 text-blue-800 print:border print:border-blue-300'
                        : 'bg-indigo-100 text-indigo-800 print:border print:border-indigo-300'
                    }`}
                  >
                    {selectedDocForPreview.type === 'quote' ? 'DEVIS COMMERCIAL' : 'FACTURE OFFICIELLE'}
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 print:text-black mt-2">
                    N° {selectedDocForPreview.number}
                  </h2>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-2 space-y-1">
                    <p>
                      Date d’émission :{' '}
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {selectedDocForPreview.date}
                      </span>
                    </p>
                    <p>
                      Date d’échéance :{' '}
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {selectedDocForPreview.dueDate}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Client Details Section */}
              <div className="my-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Destinataire / Facturé à :
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                      {selectedDocForPreview.clientName}
                    </p>
                    {selectedDocForPreview.clientCompany && (
                      <p className="text-slate-600 dark:text-slate-400 font-medium">
                        {selectedDocForPreview.clientCompany}
                      </p>
                    )}
                    {selectedDocForPreview.clientAddress && (
                      <p className="text-slate-500 mt-1">{selectedDocForPreview.clientAddress}</p>
                    )}
                  </div>
                  <div className="space-y-1 text-slate-600 dark:text-slate-400 sm:text-right">
                    {selectedDocForPreview.clientPhone && (
                      <p>Téléphone : {selectedDocForPreview.clientPhone}</p>
                    )}
                    {selectedDocForPreview.clientEmail && (
                      <p>Email : {selectedDocForPreview.clientEmail}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="py-2.5 px-4">Désignation</th>
                      <th className="py-2.5 px-3 text-center">Qté</th>
                      <th className="py-2.5 px-3 text-right">Prix Unitaire</th>
                      {selectedDocForPreview.taxRate ? (
                        <th className="py-2.5 px-3 text-right">TVA</th>
                      ) : null}
                      <th className="py-2.5 px-4 text-right">Total HT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {selectedDocForPreview.items.map((it, idx) => (
                      <tr key={it.id || idx}>
                        <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                          {it.description}
                        </td>
                        <td className="py-3 px-3 text-center text-slate-600 dark:text-slate-300">
                          {it.quantity}
                        </td>
                        <td className="py-3 px-3 text-right text-slate-600 dark:text-slate-300">
                          {it.unitPrice.toLocaleString()} {company.currency || 'FCFA'}
                        </td>
                        {selectedDocForPreview.taxRate ? (
                          <td className="py-3 px-3 text-right text-slate-500">
                            {it.taxRate ?? selectedDocForPreview.taxRate}%
                          </td>
                        ) : null}
                        <td className="py-3 px-4 text-right font-semibold text-slate-900 dark:text-slate-100">
                          {(it.quantity * it.unitPrice).toLocaleString()}{' '}
                          {company.currency || 'FCFA'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals Breakdown */}
              {(() => {
                const totals = computeDocTotal(selectedDocForPreview);
                const currency = company.currency || 'FCFA';

                return (
                  <div className="mt-6 flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="w-full md:w-1/2 space-y-3">
                      {/* Payment details box */}
                      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/30 text-xs">
                        <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                          Modalités & Coordonnées de règlement :
                        </span>
                        {selectedDocForPreview.paymentDetails?.mobileMoneyNumber && (
                          <p className="text-slate-600 dark:text-slate-400">
                            📱 <strong>Mobile Money ({selectedDocForPreview.paymentDetails.mobileMoneyProvider || 'Wave / OM'}) :</strong>{' '}
                            <span className="font-mono font-bold text-slate-900 dark:text-slate-100">
                              {selectedDocForPreview.paymentDetails.mobileMoneyNumber}
                            </span>
                          </p>
                        )}
                        {selectedDocForPreview.paymentDetails?.bankName && (
                          <p className="text-slate-600 dark:text-slate-400 mt-1">
                            🏦 <strong>Banque :</strong> {selectedDocForPreview.paymentDetails.bankName}{' '}
                            - RIB :{' '}
                            <span className="font-mono">
                              {selectedDocForPreview.paymentDetails.ibanOrRib}
                            </span>
                          </p>
                        )}
                        {selectedDocForPreview.paymentTerms && (
                          <p className="text-slate-500 mt-2 italic">
                            Conditions : {selectedDocForPreview.paymentTerms}
                          </p>
                        )}
                      </div>

                      {/* Notes */}
                      {selectedDocForPreview.notes && (
                        <div className="text-xs text-slate-500 dark:text-slate-400 italic">
                          <strong>Note :</strong> {selectedDocForPreview.notes}
                        </div>
                      )}
                    </div>

                    <div className="w-full md:w-5/12 space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                        <span>Sous-total HT</span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          {totals.subTotal.toLocaleString()} {currency}
                        </span>
                      </div>

                      {totals.discount > 0 && (
                        <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800 text-emerald-600">
                          <span>
                            Remise (
                            {selectedDocForPreview.discountType === 'percent'
                              ? `${selectedDocForPreview.discountValue}%`
                              : 'Fixe'}
                            )
                          </span>
                          <span className="font-medium">
                            - {totals.discount.toLocaleString()} {currency}
                          </span>
                        </div>
                      )}

                      {totals.vat > 0 && (
                        <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                          <span>TVA ({selectedDocForPreview.taxRate}%)</span>
                          <span className="font-medium text-slate-800 dark:text-slate-200">
                            + {totals.vat.toLocaleString()} {currency}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between py-2.5 text-base font-extrabold text-slate-900 dark:text-slate-100 border-t-2 border-slate-800 dark:border-slate-200">
                        <span>Total Net à Payer (TTC)</span>
                        <span className="text-indigo-600 dark:text-indigo-400">
                          {totals.totalTTC.toLocaleString()} {currency}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Signature & Stamp area */}
              <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex justify-between items-end text-xs text-slate-500">
                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-300">
                    Pour l’entreprise ({company.name || 'La Direction'})
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Signature et cachet officiel</p>
                  <div className="mt-8 border-b border-dashed border-slate-300 dark:border-slate-700 w-44"></div>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-slate-700 dark:text-slate-300">
                    Bon pour accord (Le Client)
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Date et signature précédées de "Bon pour accord"</p>
                  <div className="mt-8 border-b border-dashed border-slate-300 dark:border-slate-700 w-44 ml-auto"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT MODAL (Hidden when printing) */}
      {isEditModalOpen && (
        <div className="print:hidden fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 my-8 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                  {editingDocId ? 'Modifier le document' : 'Créer un nouveau document'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSaveDocument} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              {/* Type Switch & Number */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Type de document
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setFormType('invoice')}
                      className={`py-1.5 text-xs font-medium rounded-md transition ${
                        formType === 'invoice'
                          ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Facture
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormType('quote')}
                      className={`py-1.5 text-xs font-medium rounded-md transition ${
                        formType === 'quote'
                          ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Devis
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Numéro de référence
                  </label>
                  <input
                    type="text"
                    required
                    value={formNumber}
                    onChange={(e) => setFormNumber(e.target.value)}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 font-mono"
                    placeholder="FAC-2026-001"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Statut actuel
                  </label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2"
                  >
                    <option value="pending">En attente de paiement</option>
                    <option value="paid">Payée / Encaissée</option>
                    <option value="sent">Envoyé au client</option>
                    <option value="accepted">Devis Accepté</option>
                    <option value="draft">Brouillon</option>
                    <option value="cancelled">Annulé</option>
                  </select>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Date d’émission
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Date d’échéance / Validité
                  </label>
                  <input
                    type="date"
                    required
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              {/* Client Information */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-3">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
                  Informations Client
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Nom du client *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Aïssatou Traoré"
                      value={formClientName}
                      onChange={(e) => setFormClientName(e.target.value)}
                      className="w-full text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Société / Entreprise (facultatif)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Horizon SARL"
                      value={formClientCompany}
                      onChange={(e) => setFormClientCompany(e.target.value)}
                      className="w-full text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Téléphone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      placeholder="+221 77 000 00 00"
                      value={formClientPhone}
                      onChange={(e) => setFormClientPhone(e.target.value)}
                      className="w-full text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="client@domaine.com"
                      value={formClientEmail}
                      onChange={(e) => setFormClientEmail(e.target.value)}
                      className="w-full text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Adresse géographique
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Cocody Angré, Abidjan"
                      value={formClientAddress}
                      onChange={(e) => setFormClientAddress(e.target.value)}
                      className="w-full text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>
              </div>

              {/* Items Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Lignes de Prestations & Produits
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Import from product catalog */}
                    {products.length > 0 && (
                      <select
                        onChange={(e) => {
                          if (e.target.value) {
                            handleImportProduct(e.target.value);
                            e.target.value = '';
                          }
                        }}
                        className="text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-700 dark:text-slate-300"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          + Importer du catalogue...
                        </option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.price?.toLocaleString()} {company.currency || 'FCFA'})
                          </option>
                        ))}
                      </select>
                    )}

                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 font-medium"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Ajouter une ligne
                    </button>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {formItems.map((item, index) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 grid grid-cols-12 gap-2 items-center"
                    >
                      <div className="col-span-6 sm:col-span-5">
                        <input
                          type="text"
                          required
                          placeholder="Description ou article"
                          value={item.description}
                          onChange={(e) =>
                            handleUpdateItem(item.id, 'description', e.target.value)
                          }
                          className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5"
                        />
                      </div>
                      <div className="col-span-2 sm:col-span-2">
                        <input
                          type="number"
                          min="1"
                          required
                          title="Quantité"
                          value={item.quantity}
                          onChange={(e) =>
                            handleUpdateItem(item.id, 'quantity', Number(e.target.value))
                          }
                          className="w-full text-xs text-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5"
                        />
                      </div>
                      <div className="col-span-3 sm:col-span-3">
                        <input
                          type="number"
                          min="0"
                          step="100"
                          required
                          title="Prix unitaire"
                          value={item.unitPrice}
                          onChange={(e) =>
                            handleUpdateItem(item.id, 'unitPrice', Number(e.target.value))
                          }
                          className="w-full text-xs text-right bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1.5"
                        />
                      </div>
                      <div className="col-span-1 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Discounts & Taxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Remise accordée
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={formDiscountType}
                      onChange={(e) => setFormDiscountType(e.target.value as any)}
                      className="text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5"
                    >
                      <option value="percent">En %</option>
                      <option value="fixed">Montant fixe</option>
                    </select>
                    <input
                      type="number"
                      min="0"
                      value={formDiscountValue}
                      onChange={(e) => setFormDiscountValue(Number(e.target.value))}
                      className="flex-1 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Taux de TVA
                  </label>
                  <select
                    value={formTaxRate}
                    onChange={(e) => setFormTaxRate(Number(e.target.value))}
                    className="w-full text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5"
                  >
                    <option value="0">0% (Exonéré / Sans TVA)</option>
                    <option value="18">18% (Taux standard UEMOA / OHADA)</option>
                    <option value="20">20% (Standard international)</option>
                    <option value="10">10% (Taux réduit)</option>
                  </select>
                </div>
              </div>

              {/* Payment Details & Terms */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
                  Paiement & Coordonnées Bancaires / Mobile Money
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Numéro Mobile Money (Wave, Orange, MTN...)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: +221 77 123 45 67"
                      value={formMobileMoneyNumber}
                      onChange={(e) => setFormMobileMoneyNumber(e.target.value)}
                      className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Opérateur Mobile Money
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Wave / Orange Money"
                      value={formMobileMoneyProvider}
                      onChange={(e) => setFormMobileMoneyProvider(e.target.value)}
                      className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Banque (facultatif)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Société Générale, Ecobank..."
                      value={formBankName}
                      onChange={(e) => setFormBankName(e.target.value)}
                      className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                      IBAN / RIB bancaire
                    </label>
                    <input
                      type="text"
                      placeholder="SN012 01001 00000000000 00"
                      value={formIbanOrRib}
                      onChange={(e) => setFormIbanOrRib(e.target.value)}
                      className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Notes & Mentions légales affichées sur le document
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Remerciement, conditions de garantie, délais de livraison..."
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5"
                  />
                </div>
              </div>

              {/* Total summary in form */}
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500 block">Total Net TTC à payer</span>
                  <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">
                    {totalTTC.toLocaleString()} {company.currency || 'FCFA'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                  >
                    Enregistrer le document
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI INVOICE GENERATOR MODAL */}
      {isAIModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                    Générateur de Facture / Devis IA
                  </h3>
                  <p className="text-xs text-slate-500">
                    Décrivez ce que vous souhaitez facturer et l’IA génère automatiquement les lignes et tarifs.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAIModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Décrivez la commande ou la prestation :
                </label>
                <textarea
                  rows={3}
                  placeholder="Ex: Confection de 3 robes de soirée avec broderie main pour un mariage, comprenant les essayages et livraison à Cocody..."
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              {/* Presets */}
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Exemples d’inspirations rapides :
                </span>
                <div className="flex flex-col gap-1.5 max-h-36 overflow-y-auto">
                  {aiPresetPrompts.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAiPrompt(preset)}
                      className="text-left text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800 transition"
                    >
                      💡 {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAIModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  disabled={isAIGenerating || !aiPrompt.trim()}
                  onClick={() => {
                    handleOpenCreate(formType);
                    handleGenerateWithAI();
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50"
                >
                  {isAIGenerating ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      Générer le document
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
