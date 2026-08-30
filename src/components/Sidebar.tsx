import React from 'react';
import { useApp } from '../context/AppContext';
import { AppTab } from '../types';
import {
  Home,
  LayoutDashboard,
  MessageSquareText,
  Share2,
  Video,
  Package,
  MessageCircleReply,
  TrendingUp,
  History,
  Building2,
  Crown,
  ChevronRight,
  Gift,
  Zap,
  Smartphone,
  Phone,
} from 'lucide-react';
import { OFFICIAL_PAYMENT_NUMBER } from './PaymentInstructionModal';

interface SidebarProps {
  onCloseMobile?: () => void;
}

interface NavItem {
  id: AppTab;
  labelKey: string;
  badge?: string;
  icon: React.ComponentType<{ className?: string }>;
  descriptionKey: string;
  highlight?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'home',
    labelKey: 'nav.home',
    icon: Home,
    descriptionKey: 'Présentation & démarrage',
  },
  {
    id: 'dashboard',
    labelKey: 'nav.dashboard',
    icon: LayoutDashboard,
    descriptionKey: 'Vue d’ensemble & métriques',
  },
  {
    id: 'assistant',
    labelKey: 'nav.assistant',
    badge: 'Gemini 3.7',
    icon: MessageSquareText,
    descriptionKey: 'Discussion libre & requêtes pro',
  },
  {
    id: 'social',
    labelKey: 'nav.social',
    badge: 'Multi-réseaux',
    icon: Share2,
    descriptionKey: 'Facebook, Insta, WhatsApp, Ads',
  },
  {
    id: 'video',
    labelKey: 'nav.video',
    badge: 'TikTok/Reels',
    icon: Video,
    descriptionKey: 'Storyboards, scripts & voix-off',
    highlight: true,
  },
  {
    id: 'products',
    labelKey: 'nav.products',
    icon: Package,
    descriptionKey: 'Descriptions persuasives & SEO',
  },
  {
    id: 'clients',
    labelKey: 'nav.clients',
    badge: '7 modèles',
    icon: MessageCircleReply,
    descriptionKey: 'Prix, livraisons, réclamations',
  },
  {
    id: 'sales',
    labelKey: 'nav.sales',
    icon: TrendingUp,
    descriptionKey: 'Calculateur marge & promotions',
  },
  {
    id: 'referrals',
    labelKey: 'nav.referrals',
    badge: '+15 cr.',
    icon: Gift,
    descriptionKey: 'Parrainez des entrepreneurs',
    highlight: true,
  },
  {
    id: 'earn_credits',
    labelKey: 'nav.generations',
    badge: 'Gratuit',
    icon: Zap,
    descriptionKey: 'Missions & recharges',
  },
  {
    id: 'history',
    labelKey: 'nav.history',
    icon: History,
    descriptionKey: 'Contenus sauvegardés',
  },
  {
    id: 'profile',
    labelKey: 'nav.profile',
    icon: Building2,
    descriptionKey: 'Entreprise & directives',
  },
  {
    id: 'pricing',
    labelKey: 'nav.pricing',
    badge: 'Multi-devises',
    icon: Crown,
    descriptionKey: 'STARTER, PRO, BUSINESS',
    highlight: true,
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const {
    currentTab,
    setCurrentTab,
    user,
    openPaymentModal,
    company,
    openWhatsAppTutorialModal,
    displayCurrency,
    t,
  } = useApp();

  const handleSelectTab = (tab: AppTab) => {
    setCurrentTab(tab);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const handleOpenWhatsAppGuide = () => {
    openWhatsAppTutorialModal();
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const planId = user.plan;
  const isStarter = planId === 'starter';
  const isFree = planId === 'free';
  const remaining = user.availableCredits;
  const percentUsed = user.maxCredits > 0 ? Math.min(100, Math.round((user.creditsUsed / user.maxCredits) * 100)) : 100;

  return (
    <aside className="w-full lg:w-72 bg-white border-r border-slate-200 flex flex-col h-full overflow-y-auto shadow-2xs">
      {/* Navigation List */}
      <div className="p-3.5 space-y-1 flex-1">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Navigation
        </div>
        {NAV_ITEMS.map((item) => {
          const isActive = currentTab === item.id;
          const Icon = item.icon;
          const label = t(item.labelKey);

          return (
            <button
              key={item.id}
              onClick={() => handleSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left font-medium text-xs sm:text-sm transition-all group cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : item.id === 'pricing'
                  ? 'text-slate-700 hover:text-indigo-900 hover:bg-indigo-50/60 border border-indigo-100/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive
                      ? 'text-indigo-300'
                      : item.id === 'pricing'
                      ? 'text-amber-500'
                      : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span className="truncate font-semibold">{label}</span>
              </div>

              {item.badge ? (
                <span
                  className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-md shrink-0 uppercase tracking-tight ${
                    isActive
                      ? 'bg-slate-800 text-slate-200'
                      : item.highlight
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.badge}
                </span>
              ) : (
                <ChevronRight
                  className={`w-3.5 h-3.5 shrink-0 transition-opacity ${
                    isActive ? 'opacity-100 text-slate-400' : 'opacity-0 group-hover:opacity-40'
                  }`}
                />
              )}
            </button>
          );
        })}

        {/* WhatsApp Integration Tutorial Link */}
        <div className="pt-2 space-y-2">
          <button
            onClick={handleOpenWhatsAppGuide}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-950 transition-all group cursor-pointer text-left shadow-2xs"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Smartphone className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-xs text-emerald-950 leading-tight">
                  {t('nav.whatsapp_guide')}
                </div>
                <div className="text-[10px] text-emerald-700 truncate">Meta Cloud & Twilio</div>
              </div>
            </div>
            <span className="text-[9px] font-bold bg-emerald-200/80 text-emerald-900 px-1.5 py-0.5 rounded-md">
              Tuto
            </span>
          </button>

          {/* Direct Pay 0163638893 Button */}
          <button
            onClick={() => openPaymentModal('starter')}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-950 transition-all group cursor-pointer text-left shadow-2xs"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-2xs font-bold">
                <Phone className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-xs text-amber-950 leading-tight">
                  Payer au {OFFICIAL_PAYMENT_NUMBER}
                </div>
                <div className="text-[10px] text-amber-800 truncate">Wave, Orange, MTN, Moov</div>
              </div>
            </div>
            <span className="text-[9px] font-extrabold bg-amber-300 text-amber-950 px-1.5 py-0.5 rounded-md">
              Activer
            </span>
          </button>
        </div>
      </div>

      {/* Profile & Plan Card at Bottom */}
      <div className="p-3.5 border-t border-slate-200 space-y-3 bg-slate-50/50">
        {/* Company Card summary */}
        <div
          onClick={() => handleSelectTab('profile')}
          className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-2xs cursor-pointer transition-all"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs">
              {company.name ? company.name.charAt(0).toUpperCase() : 'E'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate">
                {company.name || 'Mon Entreprise'}
              </p>
              <p className="text-[10px] text-slate-500 truncate">{displayCurrency} • {company.sector}</p>
            </div>
          </div>
        </div>

        {/* Plan Quota & Upgrade Box */}
        <div className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Crown className={`w-3.5 h-3.5 ${isStarter ? 'text-indigo-600' : planId === 'business' ? 'text-amber-600' : 'text-slate-700'}`} />
              <span className="text-xs font-extrabold uppercase text-slate-900 tracking-tight">
                Plan {planId.toUpperCase()}
              </span>
            </div>
            {isStarter && (
              <span className="text-[9px] font-bold bg-indigo-50 text-indigo-700 px-1.5 py-0.2 rounded border border-indigo-200">
                Recommandé
              </span>
            )}
            {planId === 'business' && (
              <span className="text-[9px] font-bold bg-amber-50 text-amber-900 px-1.5 py-0.2 rounded border border-amber-200">
                Équipe
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between text-[11px] text-slate-600 font-semibold mb-1">
              <span>{t('dash.quota_remaining')}</span>
              <span className="font-extrabold text-slate-900">
                {remaining} / {user.maxCredits}
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  percentUsed > 80
                    ? 'bg-rose-500'
                    : percentUsed > 50
                    ? 'bg-amber-500'
                    : 'bg-indigo-600'
                }`}
                style={{ width: `${percentUsed}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => openPaymentModal(isFree ? 'starter' : (planId as any))}
            className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
              isFree
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            <Phone className="w-3.5 h-3.5 text-amber-300" />
            <span>{isFree ? 'Payer au 0163638893' : 'Prolonger / Changer'}</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
