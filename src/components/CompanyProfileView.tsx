import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BusinessSector, CompanyProfile, ToneStyle } from '../types';
import { SECTOR_TEMPLATES } from '../utils/defaultData';
import { BadgesGrid } from './BadgesGrid';
import {
  Building2,
  Save,
  Sparkles,
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  Coins,
  Palette,
  CheckCircle2,
  HelpCircle,
  Smartphone,
} from 'lucide-react';

const SECTORS: BusinessSector[] = [
  'Boutique & Prêt-à-porter',
  'Restaurant & Alimentation',
  'E-commerce & Vente en ligne',
  'Artisanat & Fait-main',
  'Prestation de Services & B2B',
  'Beauté, Coiffure & Bien-être',
  'Immobilier & Travaux',
  'Autre Entreprise',
];

const TONES: ToneStyle[] = [
  'Professionnel et Chaleureux',
  'Dynamique et Vendeur',
  'Direct et Efficace',
  'Élégant et Haut de Gamme',
  'Familial et Accessible',
  'Humoristique et Décontracté',
];

const CURRENCIES = [
  { code: '€', label: 'Euro (€)' },
  { code: '$', label: 'Dollar US ($)' },
  { code: 'FCFA', label: 'Franc CFA (FCFA)' },
  { code: 'MAD', label: 'Dirham Marocain (MAD)' },
  { code: 'TND', label: 'Dinar Tunisien (TND)' },
  { code: 'CHF', label: 'Franc Suisse (CHF)' },
  { code: 'CAD $', label: 'Dollar Canadien (CAD $)' },
];

export const CompanyProfileView: React.FC = () => {
  const { company, updateCompany, addToast, openWhatsAppTutorialModal } = useApp();

  const [formData, setFormData] = useState<CompanyProfile>({ ...company });
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompany(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleApplyTemplate = (templateKey: string) => {
    const template = SECTOR_TEMPLATES[templateKey];
    if (template) {
      setFormData((prev) => ({
        ...prev,
        ...template,
      }));
      addToast('info', `Modèle appliqué`, `Pré-rempli avec les données de "${templateKey}".`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Profil & Identité de l'Entreprise
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              L'IA utilise automatiquement ces informations pour signer vos messages et adapter son
              vocabulaire.
            </p>
          </div>
        </div>

        {isSaved && (
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold animate-pulse">
            <CheckCircle2 className="w-4 h-4" />
            <span>Enregistré</span>
          </div>
        )}
      </div>

      {/* Quick Templates Row */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
        <div className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Pré-remplir avec un exemple de secteur :</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.keys(SECTOR_TEMPLATES).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => handleApplyTemplate(key)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:border-indigo-200 border border-slate-200 text-xs text-slate-700 hover:text-indigo-900 transition-colors cursor-pointer"
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-2xs space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nom de l'entreprise */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Nom de l'entreprise <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Boutique Éclat, Café Gourmand..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:border-indigo-600 shadow-2xs"
                required
              />
            </div>
          </div>

          {/* Secteur d'activité */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Secteur d'activité
            </label>
            <select
              value={formData.sector}
              onChange={(e) => setFormData({ ...formData, sector: e.target.value as BusinessSector })}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:bg-white focus:border-indigo-600 shadow-2xs"
            >
              {SECTORS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Description de l'activité */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Description de l'activité & Spécialités
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Ex: Nous vendons des vêtements haut de gamme et des accessoires de mode faits main. Service client réactif et conseils personnalisés."
              rows={3}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:border-indigo-600 shadow-2xs"
            />
          </div>

          {/* Téléphone & WhatsApp */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-indigo-600" />
              <span>Numéro de Téléphone</span>
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Ex: +33 6 12 34 56 78"
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:border-indigo-600 shadow-2xs"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>Numéro WhatsApp Business</span>
              </label>
              <button
                type="button"
                onClick={openWhatsAppTutorialModal}
                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
              >
                <Smartphone className="w-3 h-3" />
                <span>Guide d'intégration</span>
              </button>
            </div>
            <input
              type="text"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              placeholder="Ex: +33 6 12 34 56 78"
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:border-indigo-600 shadow-2xs"
            />
          </div>

          {/* Adresse & Horaires */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-600" />
              <span>Adresse / Ville / En ligne</span>
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Ex: 14 Rue du Commerce, Paris ou Boutique en ligne"
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:border-indigo-600 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Horaires d'ouverture</span>
            </label>
            <input
              type="text"
              value={formData.hours}
              onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
              placeholder="Ex: Lun - Sam : 10h00 - 19h30"
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:border-indigo-600 shadow-2xs"
            />
          </div>

          {/* Devise & Ton par défaut */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-amber-600" />
              <span>Devise Monétaire</span>
            </label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:bg-white focus:border-indigo-600 shadow-2xs"
            >
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-indigo-600" />
              <span>Ton de communication par défaut</span>
            </label>
            <select
              value={formData.defaultTone}
              onChange={(e) => setFormData({ ...formData, defaultTone: e.target.value as ToneStyle })}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:bg-white focus:border-indigo-600 shadow-2xs"
            >
              {TONES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Base de connaissances & directives mémorisées de l'entreprise */}
        <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-indigo-950 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Informations autorisées & directives mémorisées (Mémoire IA)</span>
            </span>
            <span className="text-[10px] text-indigo-700 font-semibold bg-white px-2 py-0.5 rounded border border-indigo-200">
              Consulté par tous les agents
            </span>
          </label>
          <p className="text-[11px] text-slate-600">
            Indiquez ici vos politiques clés (délais et frais de livraison, conditions de retours/échanges, garanties, offres promotionnelles en cours, consignes particulières). L'IA les mémorisera et les appliquera fidèlement.
          </p>
          <textarea
            value={formData.knowledgeBase || ''}
            onChange={(e) => setFormData({ ...formData, knowledgeBase: e.target.value })}
            rows={3}
            placeholder="Ex: Livraison offerte à partir de 30 000 FCFA. Possibilité d'essayer avant de payer sur Dakar. Garantie 6 mois sur les articles électroniques..."
            className="w-full px-4 py-3 rounded-xl bg-white border border-indigo-200 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-indigo-600 shadow-2xs leading-relaxed"
          />
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
          <button
            type="submit"
            className="px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-xs flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Enregistrer le profil de l'entreprise</span>
          </button>
        </div>
      </form>

      {/* Badges Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-2xs">
        <BadgesGrid />
      </div>
    </div>
  );
};
