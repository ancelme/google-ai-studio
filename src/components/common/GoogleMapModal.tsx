import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import {
  MapPin,
  X,
  ExternalLink,
  Navigation,
  Compass,
  Layers,
  Sparkles
} from 'lucide-react';

interface GoogleMapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleMapModal: React.FC<GoogleMapModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');

  // Exact coordinates for St. Silas EAR Kibondo, Simbwa, Kabarore, Gatsibo, Rwanda
  const lat = -1.6050;
  const lng = 30.3880;
  const zoom = 15;
  const mapTypeParam = mapType === 'satellite' ? '&t=k' : '&t=m';
  const embedUrl = `https://maps.google.com/maps?q=${lat},${lng}+(St.+Silas+Private+Primary+School,+Kibondo,+Simbwa,+Kabarore)&z=${zoom}${mapTypeParam}&ie=UTF8&iwloc=B&output=embed`;
  const directMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                  {t('viewMapModalTitle')}
                </h3>
                <span className="hidden sm:inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                  REB 530413
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {t('schoolLocation')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Map / Satellite Toggle */}
            <div className="inline-flex p-1 rounded-xl bg-slate-200/80 dark:bg-slate-800 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setMapType('roadmap')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  mapType === 'roadmap'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {t('mapTypeRoad')}
              </button>
              <button
                type="button"
                onClick={() => setMapType('satellite')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  mapType === 'satellite'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {t('mapTypeSatellite')}
              </button>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Map Frame */}
        <div className="relative w-full h-[360px] sm:h-[460px] bg-slate-100 dark:bg-slate-950">
          <iframe
            title="Interactive Google Map St. Silas Primary School Kibondo"
            src={embedUrl}
            className="w-full h-full border-0"
            loading="lazy"
            allowFullScreen
          />
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-mono text-[11px] sm:text-xs">
            <Compass className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{t('mapCoordinates')}</span>
            <span className="text-slate-400">·</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-sans font-semibold">
              {t('campusLandmark')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={directMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 transition-colors shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{t('openInGoogleMaps')}</span>
            </a>

            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-xs"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{t('getDirections')}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
