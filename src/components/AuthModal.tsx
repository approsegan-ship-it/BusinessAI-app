import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Sparkles, User, Mail, Building2, ArrowRight, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, user, setUser, company, updateCompany, addToast } =
    useApp();

  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [businessName, setBusinessName] = useState(company.name || '');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !name.trim()) {
      addToast('warning', 'Champs obligatoires', 'Veuillez saisir votre nom et votre adresse email.');
      return;
    }

    setUser({
      name: name.trim(),
      email: email.trim(),
      isLoggedIn: true,
    });

    if (businessName.trim() && !company.name) {
      updateCompany({ name: businessName.trim() });
    }

    addToast(
      'success',
      mode === 'signup' ? 'Compte créé avec succès !' : 'Connexion réussie !',
      `Bienvenue sur BusinessAI, ${name}.`
    );

    setIsAuthModalOpen(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-900 overflow-hidden"
        >
          {/* Close */}
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-3 shadow-xs">
              <Sparkles className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              {mode === 'signup' ? 'Créer votre compte BusinessAI' : 'Se connecter à votre espace'}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {mode === 'signup'
                ? 'Sauvegardez vos générations et personnalisez votre profil entreprise.'
                : 'Accédez à votre historique et vos crédits de génération.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Votre Nom / Prénom
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Alexandre Dubois"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:border-indigo-600 shadow-2xs"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Adresse Email professionnelle
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alexandre@mon-entreprise.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:border-indigo-600 shadow-2xs"
                  required
                />
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nom de votre entreprise ou boutique
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Ex: Boutique Éclat, Le Comptoir Gourmand..."
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:border-indigo-600 shadow-2xs"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer mt-2"
            >
              <span>{mode === 'signup' ? 'Commencer Gratuitement' : 'Accéder à mon compte'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Toggle login / signup */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            {mode === 'signup' ? (
              <p>
                Vous avez déjà un compte ?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                >
                  Se connecter
                </button>
              </p>
            ) : (
              <p>
                Nouveau sur BusinessAI ?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                >
                  Créer un compte
                </button>
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
