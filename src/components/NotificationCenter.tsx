import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  X,
  Zap,
  Award,
  Users,
  Sparkles,
  Lightbulb,
  CheckCheck,
  SlidersHorizontal,
  Check,
} from 'lucide-react';
import { InAppNotification } from '../types';

export const NotificationCenter: React.FC = () => {
  const {
    notifications,
    unreadNotifsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    notifPrefs,
    updateNotifPrefs,
    setCurrentTab,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const safeNotifications = Array.isArray(notifications) ? notifications : [];

  const getNotifIcon = (type: InAppNotification['type']) => {
    switch (type) {
      case 'credit':
        return <Zap className="w-4 h-4 text-amber-600" />;
      case 'reward':
        return <Award className="w-4 h-4 text-emerald-600" />;
      case 'referral':
        return <Users className="w-4 h-4 text-indigo-600" />;
      case 'feature':
        return <Sparkles className="w-4 h-4 text-sky-600" />;
      case 'tip':
        return <Lightbulb className="w-4 h-4 text-amber-500" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  const handleNotifClick = (notif: InAppNotification) => {
    markNotificationAsRead(notif.id);
    if (notif.actionTab) {
      setCurrentTab(notif.actionTab);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 transition-colors cursor-pointer shadow-2xs"
        aria-label="Notifications"
        title="Centre de notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadNotifsCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-rose-600 text-white text-[10px] font-extrabold flex items-center justify-center border-2 border-white shadow-xs animate-in zoom-in">
            {unreadNotifsCount}
          </span>
        )}
      </button>

      {/* Popover */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              setIsOpen(false);
              setShowSettings(false);
            }}
          />
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl border border-slate-200 shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900">Notifications</span>
                {unreadNotifsCount > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
                    {unreadNotifsCount} nouvelle{unreadNotifsCount > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowSettings((prev) => !prev)}
                  title="Préférences de notifications"
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    showSettings
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                </button>

                {unreadNotifsCount > 0 && (
                  <button
                    onClick={markAllNotificationsAsRead}
                    title="Tout marquer comme lu"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Notification Preferences Sub-panel */}
            {showSettings ? (
              <div className="p-4 space-y-3 bg-slate-50/70 border-b border-slate-200 text-xs">
                <div className="font-bold text-slate-900 flex items-center justify-between">
                  <span>Préférences de notifications</span>
                  <span className="text-[10px] text-slate-500 font-normal">Activez / désactivez</span>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 cursor-pointer">
                    <span className="text-slate-700">Crédits & recharges</span>
                    <input
                      type="checkbox"
                      checked={notifPrefs.credits}
                      onChange={(e) => updateNotifPrefs({ credits: e.target.checked })}
                      className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 cursor-pointer">
                    <span className="text-slate-700">Récompenses & Badges</span>
                    <input
                      type="checkbox"
                      checked={notifPrefs.rewards}
                      onChange={(e) => updateNotifPrefs({ rewards: e.target.checked })}
                      className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 cursor-pointer">
                    <span className="text-slate-700">Parrainages d'entrepreneurs</span>
                    <input
                      type="checkbox"
                      checked={notifPrefs.referrals}
                      onChange={(e) => updateNotifPrefs({ referrals: e.target.checked })}
                      className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200 cursor-pointer">
                    <span className="text-slate-700">Conseils & astuces de vente</span>
                    <input
                      type="checkbox"
                      checked={notifPrefs.tips}
                      onChange={(e) => updateNotifPrefs({ tips: e.target.checked })}
                      className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            ) : null}

            {/* List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
              {safeNotifications.length === 0 ? (
                <div className="py-8 text-center text-slate-400 space-y-1">
                  <Bell className="w-6 h-6 mx-auto text-slate-300" />
                  <p className="text-xs">Aucune notification pour le moment.</p>
                </div>
              ) : (
                safeNotifications.map((notif, idx) => (
                  <div
                    key={notif.id ? `${notif.id}-${idx}` : `notif-${idx}`}
                    onClick={() => handleNotifClick(notif)}
                    className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer hover:bg-slate-50 ${
                      !notif.read ? 'bg-indigo-50/30' : ''
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                      {getNotifIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p
                          className={`text-xs font-bold truncate ${
                            !notif.read ? 'text-slate-900' : 'text-slate-700'
                          }`}
                        >
                          {notif.title}
                        </p>
                        <span className="text-[10px] text-slate-400 shrink-0">{notif.date}</span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-snug line-clamp-2">
                        {notif.message}
                      </p>
                    </div>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0 mt-1.5" />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
