import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { INITIAL_BOOKS } from '../../data/mockData';
import { Book, Search, Check, Clock, BookOpen, Baby, GraduationCap } from 'lucide-react';

export const LibraryTab: React.FC = () => {
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [books, setBooks] = useState(INITIAL_BOOKS);
  const [checkoutNotice, setCheckoutNotice] = useState<string | null>(null);

  const handleCheckout = (bookId: string, bookTitle: string) => {
    setBooks(prev =>
      prev.map(b => (b.id === bookId && b.availableCopies > 0 ? { ...b, availableCopies: b.availableCopies - 1 } : b))
    );
    setCheckoutNotice(`Successfully issued "${bookTitle}" to pupil. Record noted in lending register.`);
    setTimeout(() => setCheckoutNotice(null), 4000);
  };

  const filtered = books.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase()) ||
    b.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {t('dashLibrary')}
          </h2>
          <p className="text-xs text-slate-500">
            Pupils reading corner, REB textbooks, and Nursery storybooks at St. Silas Kibondo
          </p>
        </div>
      </div>

      {checkoutNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{checkoutNotice}</span>
        </div>
      )}

      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search pupil reader by title, level, or subject..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(book => (
          <div
            key={book.id}
            className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs hover:border-emerald-600 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  {book.category}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {book.targetLevel || 'All Levels'}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                {book.title}
              </h3>
              <p className="text-xs text-slate-500">
                Author: {book.author}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Available copies:</span>
                <span className="font-bold text-slate-900 dark:text-white font-mono">
                  {book.availableCopies} / {book.totalCopies}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Location:</span>
                <span className="font-medium text-slate-600 dark:text-slate-300">{book.location}</span>
              </div>

              <button
                type="button"
                onClick={() => handleCheckout(book.id, book.title)}
                disabled={book.availableCopies === 0}
                className={`w-full py-2 rounded-xl text-xs font-bold transition-all ${
                  book.availableCopies > 0
                    ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                }`}
              >
                {book.availableCopies > 0 ? 'Borrow Reader' : 'All Borrowed'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
