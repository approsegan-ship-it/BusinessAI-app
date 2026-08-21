import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Crown,
  Zap,
  Building2,
  Menu,
  X,
  User,
  Gift,
} from 'lucide-react';
import { NotificationCenter } from './NotificationCenter';

interface NavbarProps {
  onToggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleMobileMenu,
  isMobileMenuOpen,
}) => {
  const {
    currentTab,
    setCurrentTab,
    company,
    user,
    setIsPricingModalOpen,
    setIsAuthModalOpen,
  } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentTab('home')}
              className="flex items-center gap-3 text-left group focus:outline-none cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs group-hover:bg-indigo-600 transition-colors">
                <Sparkles className="w-5 h-5 text-indigo-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                    BusinessAI
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                    PME Assistant
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  L'intelligence artificielle pour développer vos ventes
                </p>
              </div>
            </button>
          </div>

          {/* Quick Context & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Active Company Pill */}
            <button
              onClick={() => setCurrentTab('profile')}
              title="Modifier le profil d'entreprise"
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="max-w-[140px] truncate font-semibold">
                {company.name || 'Mon Entreprise'}
              </span>
              <span className="text-[10px] text-slate-500 font-medium px-1.5 py-0.5 rounded bg-white border border-slate-200">
                {company.currency}
              </span>
            </button>

            {/* Quick Invite friends button */}
            <button
              onClick={() => setCurrentTab('referrals')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-900 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Gift className="w-3.5 h-3.5 text-indigo-600" />
              <span>Inviter</span>
              <span className="text-[10px] bg-indigo-600 text-white font-bold px-1.5 py-0.2 rounded-md">
                +15 cr.
              </span>
            </button>

            {/* Plan & Quota Pill */}
            <button
              onClick={() => setCurrentTab('pricing')}
              title="Gérer votre abonnement et voir les offres en FCFA"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer shadow-2xs ${
                user.plan === 'starter'
                  ? 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-900'
                  : user.plan === 'business'
                  ? 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-900'
                  : user.plan === 'pro'
                  ? 'bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-900'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
              }`}
            >
              <Crown
                className={`w-3.5 h-3.5 ${
                  user.plan === 'starter'
                    ? 'text-indigo-600'
                    : user.plan === 'business'
                    ? 'text-amber-600'
                    : user.plan === 'pro'
                    ? 'text-purple-600'
                    : 'text-slate-600'
                }`}
              />
              <span className="font-extrabold uppercase">{user.plan}</span>
              <span className="text-slate-300">•</span>
              <span className="font-bold">
                {user.availableCredits} <span className="hidden sm:inline font-normal text-slate-500">gén.</span>
              </span>
            </button>

            {/* Notification Center */}
            <NotificationCenter />

            {/* User Account / Login */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 text-xs transition-colors cursor-pointer shadow-2xs"
            >
              <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center justify-center font-bold text-xs">
                {user.name ? user.name.charAt(0).toUpperCase() : <User className="w-3.5 h-3.5" />}
              </div>
              <span className="hidden md:inline font-semibold">{user.name || 'Compte'}</span>
            </button>

            {/* Mobile menu hamburger */}
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200 focus:outline-none cursor-pointer"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

