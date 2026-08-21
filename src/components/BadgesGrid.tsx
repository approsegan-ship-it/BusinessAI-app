import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Award,
  Sparkles,
  Share2,
  Users,
  Building2,
  Send,
  TrendingUp,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { BadgeId } from '../types';

export const BadgesGrid: React.FC = () => {
  const { badges } = useApp();

  const getBadgeIcon = (id: BadgeId) => {
    switch (id) {
      case 'first_content':
        return Sparkles;
      case 'first_share':
        return Share2;
      case 'first_referral':
        return Users;
      case 'three_referrals':
        return Users;
      case 'five_referrals':
        return Award;
      case 'profile_completed':
        return Building2;
      case 'whatsapp_master':
        return Send;
      case 'power_seller':
        return TrendingUp;
      default:
        return Award;
    }
  };

  const safeBadges = Array.isArray(badges) ? badges : [];
  const unlockedCount = safeBadges.filter((b) => b.unlocked).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-600" />
          <h3 className="text-sm font-bold text-slate-900">
            Badges de Réussite ({unlockedCount}/{safeBadges.length})
          </h3>
        </div>
        <span className="text-[11px] font-semibold text-slate-500">
          Chaque badge débloque des crédits
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {safeBadges.map((badge) => {
          const Icon = getBadgeIcon(badge.id);
          return (
            <div
              key={badge.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                badge.unlocked
                  ? 'bg-white border-amber-200/80 shadow-2xs'
                  : 'bg-slate-50/70 border-slate-200 opacity-60'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      badge.unlocked
                        ? 'bg-amber-50 text-amber-600 border border-amber-200'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    <Icon className="w-4.5 h-4.5" />
                  </div>

                  {badge.unlocked ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" />
                      Débloqué
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-200 text-slate-600">
                      <Lock className="w-3 h-3" />
                      Verrouillé
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="text-xs font-bold text-slate-900">{badge.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                    {badge.description}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                <span className="font-bold text-indigo-700">+{badge.rewardCredits} crédits</span>
                {badge.unlockedAt && (
                  <span className="text-slate-400">Obtenu le {badge.unlockedAt.slice(0, 10)}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
