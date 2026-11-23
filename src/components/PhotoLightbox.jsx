import React, { useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';

export default function PhotoLightbox({ item, items, onClose, onNavigate }) {
  useEffect(() => {
    if (!item) return undefined;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (items && items.length > 1) {
        if (e.key === 'ArrowLeft') onNavigate(-1);
        if (e.key === 'ArrowRight') onNavigate(1);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [item, items, onClose, onNavigate]);

  if (!item) return null;

  const hasMultiple = Array.isArray(items) && items.length > 1;

  return (
    <div
      className="no-print fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Pratinjau Foto"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors"
        aria-label="Tutup pratinjau"
      >
        <X className="w-5 h-5" />
      </button>

      {hasMultiple && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(-1);
          }}
          className="absolute left-3 sm:left-6 w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors"
          aria-label="Foto sebelumnya"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      <div
        className="relative max-w-3xl max-h-[88vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-2 bg-white rounded-lg shadow-2xl">
          <img
            src={item.src}
            alt={item.caption || 'Foto Kelinci'}
            className="max-h-[75vh] max-w-[85vw] object-contain rounded"
          />
        </div>
        {item.caption && (
          <div className="mt-3 px-4 py-1.5 rounded-full bg-white/15 text-white text-sm font-medium backdrop-blur-sm">
            {item.caption}
          </div>
        )}
      </div>

      {hasMultiple && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onNavigate(1);
          }}
          className="absolute right-3 sm:right-6 w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors"
          aria-label="Foto berikutnya"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
