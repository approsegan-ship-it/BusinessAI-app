import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HistoryCategory } from '../types';
import {
  History,
  Search,
  Trash2,
  Copy,
  Check,
  Filter,
  MessageSquareText,
  Share2,
  Package,
  MessageCircleReply,
  TrendingUp,
} from 'lucide-react';

export const HistoryView: React.FC = () => {
  const { history, deleteHistory, clearHistory, addToast } = useApp();

  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    addToast('success', 'Texte copié !');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const safeHistory = history || [];

  const filteredHistory = safeHistory.filter((item) => {
    if (!item) return false;
    const matchesFilter = filterType === 'all' || item.type === filterType;
    const title = (item.title || '').toLowerCase();
    const inputSummary = (item.inputSummary || '').toLowerCase();
    const output = (item.output || '').toLowerCase();
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      title.includes(query) ||
      inputSummary.includes(query) ||
      output.includes(query);
    return matchesFilter && matchesSearch;
  });

  const getCategoryBadge = (type: HistoryCategory) => {
    switch (type) {
      case 'chat':
        return { label: 'Assistant IA', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'social':
        return { label: 'Publications', color: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'product':
        return { label: 'Fiche Produit', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'client_reply':
        return { label: 'Réponse Client', color: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'sales_tool':
        return { label: 'Outil de Vente', color: 'bg-amber-50 text-amber-800 border-amber-200' };
      default:
        return { label: type, color: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Historique des Générations
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Retrouvez l’ensemble de vos textes, publications et réponses créés avec BusinessAI.
            </p>
          </div>
        </div>

        {safeHistory.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm('Voulez-vous vraiment effacer tout votre historique ?')) {
                clearHistory();
              }
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 hover:border-rose-200 text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Tout effacer</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {[
            { id: 'all', label: 'Tout' },
            { id: 'chat', label: 'Assistant' },
            { id: 'social', label: 'Publications' },
            { id: 'product', label: 'Produits' },
            { id: 'client_reply', label: 'Clients' },
            { id: 'sales_tool', label: 'Vente' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterType(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                filterType === cat.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher dans l'historique..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:bg-white focus:border-indigo-600 shadow-2xs"
          />
        </div>
      </div>

      {/* List */}
      {filteredHistory.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white border border-slate-200 shadow-2xs text-center text-slate-400 space-y-2">
          <History className="w-10 h-10 mx-auto text-slate-400" />
          <p className="text-sm font-semibold text-slate-900">Aucun élément dans l'historique</p>
          <p className="text-xs text-slate-500">
            Vos prochaines créations apparaîtront automatiquement ici.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHistory.map((item) => {
            const badge = getCategoryBadge(item.type);
            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg border ${badge.color}`}
                    >
                      {badge.label}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm truncate">{item.title}</h3>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span>
                      {new Date(item.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <button
                      onClick={() => handleCopy(item.output, item.id)}
                      className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 border border-slate-200 transition-colors cursor-pointer"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700 font-bold">Copié</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-600" />
                          <span>Copier</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => deleteHistory(item.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-line select-text">
                  {item.output}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
