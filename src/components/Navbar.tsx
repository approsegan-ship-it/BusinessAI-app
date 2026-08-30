import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Crown,
  Menu,
  X,
  User,
  Gift,
  ChevronDown,
  Phone,
} from 'lucide-react';
import { NotificationCenter } from './NotificationCenter';
import { SUPPORTED_LANGUAGES } from '../i18n/translations';
import { SUPPORTED_CURRENCIES, CurrencyCode } from '../config/currency';
import { OFFICIAL_PAYMENT_NUMBER } from './PaymentInstructionModal';

interface NavbarProps {
  onToggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleMobileMenu,
  isMobileMenuOpen,
}) => {
  const {
    setCurrentTab,
    user,
    setIsAuthModalOpen,
    openPaymentModal,
    language,
    setLanguage,
    displayCurrency,
    setDisplayCurrency,
  } = useApp();

  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);

  const currentLangConfig =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];
  const currentCurrencyConfig =
    SUPPORTED_CURRENCIES[displayCurrency] || SUPPORTED_CURRENCIES.FCFA;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentTab('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-none cursor-pointer"
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
                <p className="text-[11px] text-slate-500 font-medium hidden md:block">
                  L'intelligence artificielle pour développer vos ventes
                </p>
              </div>
            </button>
          </div>

          {/* Right Area: Payment + Language + Currency + Plan + Notifications + Account */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Quick Send Money to 0163638893 button */}
            <button
              onClick={() => openPaymentModal('starter')}
              title={`Payer et transférer sur le numéro officiel ${OFFICIAL_PAYMENT_NUMBER}`}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold transition-all shadow-2xs cursor-pointer active:scale-95"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Payer : <strong>{OFFICIAL_PAYMENT_NUMBER}</strong></span>
            </button>

            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsLangDropdownOpen((prev) => !prev);
                  setIsCurrencyDropdownOpen(false);
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                title="Changer la langue / Change Language"
              >
                <span>{currentLangConfig.flag}</span>
                <span className="hidden sm:inline uppercase text-[11px]">
                  {currentLangConfig.code}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isLangDropdownOpen && (
                <>
                  <div
                    onClick={() => setIsLangDropdownOpen(false)}
                    className="fixed inset-0 z-40"
                  />
                  <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-1.5 py-2 space-y-1">
                    <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Langue / Language
                    </div>
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setIsLangDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                          language === lang.code
                            ? 'bg-indigo-50 text-indigo-700 font-bold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          <span>{lang.nativeName}</span>
                        </span>
                        {language === lang.code && (
                          <span className="text-indigo-600 text-xs">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Currency Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsCurrencyDropdownOpen((prev) => !prev);
                  setIsLangDropdownOpen(false);
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                title="Changer la devise d'affichage"
              >
                <span>{currentCurrencyConfig.flag}</span>
                <span className="font-extrabold text-[11px]">{displayCurrency}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isCurrencyDropdownOpen && (
                <>
                  <div
                    onClick={() => setIsCurrencyDropdownOpen(false)}
                    className="fixed inset-0 z-40"
                  />
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-1.5 py-2 space-y-1">
                    <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Devise / Currency
                    </div>
                    {(Object.keys(SUPPORTED_CURRENCIES) as CurrencyCode[]).map((cCode) => {
                      const cur = SUPPORTED_CURRENCIES[cCode];
                      return (
                        <button
                          key={cCode}
                          onClick={() => {
                            setDisplayCurrency(cCode);
                            setIsCurrencyDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                            displayCurrency === cCode
                              ? 'bg-indigo-50 text-indigo-700 font-bold'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span>{cur.flag}</span>
                            <span>{cur.name}</span>
                          </span>
                          {displayCurrency === cCode && (
                            <span className="text-indigo-600 text-xs">✓</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            {/* Plan & Quota Pill */}
            <button
              onClick={() => openPaymentModal(user.plan === 'free' ? 'starter' : (user.plan as any))}
              title="Abonnement et paiement direct"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer shadow-2xs ${
                user.plan === 'starter'
                  ? 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-900'
                  : user.plan === 'business'
                  ? 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-900'
                  : user.plan === 'pro'
                  ? 'bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-900'
                  : 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-900 ring-1 ring-amber-300/30'
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
                    : 'text-amber-600'
                }`}
              />
              <span className="font-extrabold uppercase">
                {user.plan === 'free' ? 'Sans IA' : user.plan}
              </span>
              <span className="text-slate-300">•</span>
              <span className="font-bold">
                {user.plan === 'free' ? (
                  <span className="text-amber-800 font-extrabold">Payer l’IA</span>
                ) : (
                  <>
                    {user.availableCredits} <span className="hidden sm:inline font-normal text-slate-500">gén.</span>
                  </>
                )}
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
