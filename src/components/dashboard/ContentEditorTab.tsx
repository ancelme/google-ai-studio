import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { Language } from '../../types';
import {
  FileEdit,
  Save,
  RotateCcw,
  Search,
  CheckCircle2,
  Globe,
  Sliders,
  Type,
  Layout,
  Award,
  CreditCard,
  MapPin,
  Sparkles,
  BookOpen
} from 'lucide-react';

export const ContentEditorTab: React.FC = () => {
  const {
    language,
    updateTranslationWord,
    updateMultipleWords,
    resetTranslations,
    getCustomOverrides,
    getAllDictionaryKeys
  } = useLanguage();
  const { user } = useAuth();

  const [activeSubTab, setActiveSubTab] = useState<'words' | 'sections'>('words');
  const [selectedLang, setSelectedLang] = useState<Language>(language);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');
  const [savedToast, setSavedToast] = useState(false);

  // Security gate: only admin
  if (user?.role !== 'admin') {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-rose-200 dark:border-rose-900/50">
        <Sliders className="w-16 h-16 text-rose-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Access Restricted to Administrators
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Only the School Administrator has permission to update website page content, headings, and system-wide words.
        </p>
      </div>
    );
  }

  const allWords = getAllDictionaryKeys(selectedLang);
  const customOverrides = getCustomOverrides(selectedLang);

  // Filter words
  const wordEntries = Object.entries(allWords).filter(([key, val]) => {
    return (
      key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      val.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleStartEdit = (key: string, currentValue: string) => {
    setEditingKey(key);
    setEditingValue(currentValue);
  };

  const handleSaveWord = (key: string) => {
    updateTranslationWord(selectedLang, key, editingValue);
    setEditingKey(null);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const handleQuickSectionSave = (updates: Record<string, string>) => {
    updateMultipleWords(selectedLang, updates);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
            <FileEdit className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold">
                Website Content & Live Words Management
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Admin Live Editor
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Modify any heading, paragraph, button label, or word across all pages. Changes reflect immediately across the entire website.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Sub-tab Switcher */}
          <div className="inline-flex p-1 rounded-xl bg-slate-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveSubTab('words')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeSubTab === 'words'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Words ({wordEntries.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('sections')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeSubTab === 'sections'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Page Sections Editor
            </button>
          </div>
        </div>
      </div>

      {savedToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-xs text-emerald-900 dark:text-emerald-200 animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-bold">
            Content updated live! Changes have been committed to the public website and portal in real time.
          </span>
        </div>
      )}

      {/* Language Selection Header */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Target Editing Language:
          </span>
          <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setSelectedLang('en')}
              className={`px-3 py-1 rounded-lg transition-all ${
                selectedLang === 'en'
                  ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              🇬🇧 English (en)
            </button>
            <button
              type="button"
              onClick={() => setSelectedLang('fr')}
              className={`px-3 py-1 rounded-lg transition-all ${
                selectedLang === 'fr'
                  ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              🇫🇷 Français (fr)
            </button>
            <button
              type="button"
              onClick={() => setSelectedLang('rw')}
              className={`px-3 py-1 rounded-lg transition-all ${
                selectedLang === 'rw'
                  ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-300 shadow-xs font-bold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              🇷🇼 Ikinyarwanda (rw)
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (confirm('Are you sure you want to reset custom word overrides back to default translations?')) {
              resetTranslations();
            }
          }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-rose-200 dark:border-rose-900 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Overrides</span>
        </button>
      </div>

      {activeSubTab === 'words' ? (
        /* 1. All Words Live Editor */
        <div className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by key name (e.g. heroTitle, schoolName, navHome) or by text snippet..."
              className="w-full bg-transparent border-0 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 text-xs text-slate-500 flex items-center justify-between">
              <span>Showing {wordEntries.length} editable words in {selectedLang.toUpperCase()}</span>
              <span>{Object.keys(customOverrides).length} customized words</span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[600px] overflow-y-auto">
              {wordEntries.map(([key, val]) => {
                const isCustomized = customOverrides[key] !== undefined;
                const isEditing = editingKey === key;

                return (
                  <div key={key} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-850/60 transition-colors flex flex-col md:flex-row md:items-start justify-between gap-3 text-xs">
                    <div className="md:w-1/3 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200 truncate">
                          {key}
                        </span>
                        {isCustomized && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            Customized
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <div className="space-y-2">
                          <textarea
                            rows={3}
                            value={editingValue}
                            onChange={e => setEditingValue(e.target.value)}
                            className="w-full p-2.5 rounded-xl border border-emerald-500 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleSaveWord(key)}
                              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs"
                            >
                              Save Live (Bika)
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingKey(null)}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                          {val}
                        </p>
                      )}
                    </div>

                    {!isEditing && (
                      <div className="shrink-0 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleStartEdit(key, val)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 hover:bg-emerald-100 transition-colors"
                        >
                          Edit Word
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* 2. Structured Section-by-Section Editor */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Box 1: Core Brand & School Identity */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Layout className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                School Brand & Taglines
              </h3>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Official School Name (schoolName):
              </label>
              <input
                type="text"
                defaultValue={allWords['schoolName'] || ''}
                onBlur={e => updateTranslationWord(selectedLang, 'schoolName', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Tagline & Accreditation (schoolTagline):
              </label>
              <textarea
                rows={2}
                defaultValue={allWords['schoolTagline'] || ''}
                onBlur={e => updateTranslationWord(selectedLang, 'schoolTagline', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Physical Location (schoolLocation):
              </label>
              <input
                type="text"
                defaultValue={allWords['schoolLocation'] || ''}
                onBlur={e => updateTranslationWord(selectedLang, 'schoolLocation', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Box 2: Hero Section Copy */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Hero Section Copy & Proposition
              </h3>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Top Accent Badge (heroBadge):
              </label>
              <input
                type="text"
                defaultValue={allWords['heroBadge'] || ''}
                onBlur={e => updateTranslationWord(selectedLang, 'heroBadge', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Main Headline (heroTitle):
              </label>
              <input
                type="text"
                defaultValue={allWords['heroTitle'] || ''}
                onBlur={e => updateTranslationWord(selectedLang, 'heroTitle', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Hero Subtitle (heroSubtitle):
              </label>
              <textarea
                rows={3}
                defaultValue={allWords['heroSubtitle'] || ''}
                onBlur={e => updateTranslationWord(selectedLang, 'heroSubtitle', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Box 3: National Success Metrics */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Award className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                National Exam Success & PLE Results
              </h3>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Section Title (nationalSuccessTitle):
              </label>
              <input
                type="text"
                defaultValue={allWords['nationalSuccessTitle'] || ''}
                onBlur={e => updateTranslationWord(selectedLang, 'nationalSuccessTitle', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                PLE Pass Metric (metricPlePass):
              </label>
              <input
                type="text"
                defaultValue={allWords['metricPlePass'] || ''}
                onBlur={e => updateTranslationWord(selectedLang, 'metricPlePass', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Mean Score Metric (metricMeanScore):
              </label>
              <input
                type="text"
                defaultValue={allWords['metricMeanScore'] || ''}
                onBlur={e => updateTranslationWord(selectedLang, 'metricMeanScore', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

          {/* Box 4: Contact & Phone Numbers */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-xs">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Contact & Administration Details
              </h3>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Official Phone Numbers (contactPhone):
              </label>
              <input
                type="text"
                defaultValue={allWords['contactPhone'] || ''}
                onBlur={e => updateTranslationWord(selectedLang, 'contactPhone', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Official Email (contactEmail):
              </label>
              <input
                type="text"
                defaultValue={allWords['contactEmail'] || ''}
                onBlur={e => updateTranslationWord(selectedLang, 'contactEmail', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Office Hours (contactHours):
              </label>
              <input
                type="text"
                defaultValue={allWords['contactHours'] || ''}
                onBlur={e => updateTranslationWord(selectedLang, 'contactHours', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
