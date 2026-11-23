import React from 'react';
import { Carrot, Heart, Leaf, Sparkles } from 'lucide-react';

export default function PetCareDock({
  theme,
  petStats,
  onPet,
  onFeed,
}) {
  const handleDragStart = (e, foodType) => {
    e.dataTransfer.setData('text/plain', foodType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="no-print print:hidden mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-3.5 py-2 rounded-2xl bg-white/85 backdrop-blur-md border border-black/10 shadow-sm">
      <div className="flex items-center gap-1.5 pr-1 sm:pr-2 border-r border-slate-200">
        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        <span className="text-[11px] font-bold text-slate-700 hidden sm:inline">
          Rawat Cimi:
        </span>
      </div>

      {/* Elus Cimi */}
      <button
        type="button"
        onClick={onPet}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 shadow-sm transition-all active:scale-95"
        title="Atau klik / usap langsung di pas foto Cimi!"
      >
        <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
        <span>Elus Cimi</span>
      </button>

      {/* Kasih Wortel (Click or Drag onto Photo) */}
      <button
        type="button"
        draggable
        onDragStart={(e) => handleDragStart(e, 'carrot')}
        onClick={() => onFeed('carrot')}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200/80 shadow-sm transition-all active:scale-95 cursor-grab active:cursor-grabbing"
        title="Klik atau tarik ke pas foto Cimi untuk beri Wortel"
      >
        <Carrot className="w-3.5 h-3.5 text-orange-600" />
        <span>Wortel</span>
      </button>

      {/* Kasih Timothy Hay (Click or Drag onto Photo) */}
      <button
        type="button"
        draggable
        onDragStart={(e) => handleDragStart(e, 'hay')}
        onClick={() => onFeed('hay')}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80 shadow-sm transition-all active:scale-95 cursor-grab active:cursor-grabbing"
        title="Klik atau tarik ke pas foto Cimi untuk beri Timothy Hay"
      >
        <Leaf className="w-3.5 h-3.5 text-emerald-600" />
        <span>Timothy Hay</span>
      </button>

      {/* Live Counters */}
      <div className="flex items-center gap-1.5 pl-1 sm:pl-2 border-l border-slate-200">
        <span
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-mono text-[11px] font-bold border"
          style={{
            backgroundColor: theme?.badgeBg || '#F8FAFC',
            borderColor: theme?.divider || '#E2E8F0',
            color: theme?.primary || '#1E293B',
          }}
        >
          <span aria-hidden="true">❤️</span>
          <span>{petStats?.pets ?? 0}</span>
          <span className="hidden xs:inline">Elusan</span>
        </span>
        <span
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-mono text-[11px] font-bold border"
          style={{
            backgroundColor: theme?.badgeBg || '#F8FAFC',
            borderColor: theme?.divider || '#E2E8F0',
            color: theme?.primary || '#1E293B',
          }}
        >
          <span aria-hidden="true">🥕</span>
          <span>{petStats?.snacks ?? 0}</span>
          <span className="hidden xs:inline">Cemilan</span>
        </span>
      </div>
    </div>
  );
}
