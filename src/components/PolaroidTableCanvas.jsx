import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, Shuffle, ZoomIn } from 'lucide-react';
import { CIMI_ALBUMS } from '../data/cimiPhotos.js';

const WASHI_COLORS = [
  'rgba(253, 224, 71, 0.72)',
  'rgba(186, 230, 253, 0.75)',
  'rgba(254, 205, 211, 0.75)',
  'rgba(167, 243, 208, 0.75)',
];

function computeLayouts(photos, containerWidth, containerHeight, mode) {
  const cardW = containerWidth < 640 ? 174 : 206;
  const cardH = containerWidth < 640 ? 228 : 262;
  const safeW = Math.max(cardW + 40, containerWidth || 960);
  const safeH = Math.max(cardH + 60, containerHeight || 540);
  const padX = 24;
  const padTop = 58;
  const maxLeft = Math.max(padX + 10, safeW - cardW - padX);
  const maxTop = Math.max(padTop + 10, safeH - cardH - 28);

  const cols = Math.max(1, Math.floor((safeW - padX * 2) / (cardW + 22)));

  const next = {};
  photos.forEach((p, idx) => {
    if (mode === 'tidy') {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const gridTotalW = Math.min(photos.length, cols) * (cardW + 22) - 22;
      const startX = Math.max(padX, (safeW - gridTotalW) / 2);
      const x = Math.min(maxLeft, startX + col * (cardW + 22));
      const y = Math.min(maxTop, padTop + row * (cardH + 18));
      next[p.id] = {
        x: Math.round(x),
        y: Math.round(y),
        rotate: Number((((idx % 5) - 2) * 1.4).toFixed(1)),
        z: idx + 1,
      };
    } else {
      // Scatter loosely across available table surface while remaining accessible
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const cellW = (maxLeft - padX) / Math.max(1, cols - 1 || 1);
      const baseX = cols === 1 ? (safeW - cardW) / 2 : padX + col * cellW;
      const baseY = padTop + (row % 2) * 145;

      const jitterX = (Math.random() - 0.5) * 68;
      const jitterY = (Math.random() - 0.5) * 70;
      const x = Math.max(padX, Math.min(maxLeft, baseX + jitterX));
      const y = Math.max(padTop, Math.min(maxTop, baseY + jitterY));
      const rotate = Number(((Math.random() - 0.5) * 20).toFixed(1));

      next[p.id] = {
        x: Math.round(x),
        y: Math.round(y),
        rotate,
        z: idx + 1,
      };
    }
  });
  return next;
}

export default function PolaroidTableCanvas({
  photos = [],
  albumMap = {},
  onOpenLightbox,
}) {
  const tableRef = useRef(null);
  const topZRef = useRef(photos.length + 2);
  const [layouts, setLayouts] = useState({});
  const [layoutVersion, setLayoutVersion] = useState(0);
  const [layoutMode, setLayoutMode] = useState('scatter'); // 'scatter' | 'tidy'

  const regenerateLayout = (targetMode) => {
    const rect = tableRef.current?.getBoundingClientRect();
    const w = rect?.width || 960;
    const h = rect?.height || 540;
    const next = computeLayouts(photos, w, h, targetMode);
    topZRef.current = photos.length + 2;
    setLayoutMode(targetMode);
    setLayouts(next);
    setLayoutVersion((v) => v + 1);
  };

  useEffect(() => {
    regenerateLayout(layoutMode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photos.length, photos.map((p) => p.id).join('|')]);

  const bringToFront = (id) => {
    topZRef.current += 1;
    const nextZ = topZRef.current;
    setLayouts((prev) => {
      if (!prev[id]) return prev;
      return {
        ...prev,
        [id]: {
          ...prev[id],
          z: nextZ,
        },
      };
    });
  };

  return (
    <div
      ref={tableRef}
      className="relative w-full h-full min-h-[540px] rounded-2xl border border-amber-200/90 overflow-hidden select-none"
      style={{
        backgroundColor: '#EBDCCB',
        backgroundImage:
          'radial-gradient(circle at 22% 18%, rgba(255,255,255,0.45), transparent 55%), repeating-linear-gradient(90deg, rgba(160, 120, 80, 0.04) 0px, rgba(160, 120, 80, 0.04) 2px, transparent 2px, transparent 28px), repeating-linear-gradient(0deg, rgba(140, 100, 60, 0.03) 0px, rgba(140, 100, 60, 0.03) 1px, transparent 1px, transparent 14px)',
        boxShadow: 'inset 0 0 60px rgba(109, 76, 65, 0.16)',
      }}
    >
      {/* Top Tabletop Action Bar */}
      <div className="absolute top-3 left-3 right-3 z-[999] flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <span className="pointer-events-auto px-3 py-1 rounded-full bg-white/85 backdrop-blur-sm border border-amber-200/90 text-[11px] font-medium text-slate-700 shadow-sm">
          Seret foto bebas di atas meja • Klik ganda atau ikon zoom untuk perbesar
        </span>

        <div className="pointer-events-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => regenerateLayout('tidy')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/95 hover:bg-white text-slate-800 border border-slate-200 shadow-sm transition-all active:scale-95"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Rapikan</span>
          </button>
          <button
            type="button"
            onClick={() => regenerateLayout('scatter')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/95 hover:bg-white text-slate-800 border border-slate-200 shadow-sm transition-all active:scale-95"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Acak Ulang</span>
          </button>
        </div>
      </div>

      {/* Draggable Polaroid Cards */}
      {photos.map((photo, idx) => {
        const pos = layouts[photo.id] || {
          x: 30 + (idx % 4) * 190,
          y: 66 + Math.floor(idx / 4) * 160,
          rotate: ((idx % 5) - 2) * 3,
          z: idx + 1,
        };
        const alb = albumMap[photo.album] || CIMI_ALBUMS[0];
        const tapeColor = WASHI_COLORS[idx % WASHI_COLORS.length];

        return (
          <motion.div
            key={`${photo.id}-${layoutVersion}`}
            drag
            dragMomentum
            dragElastic={0.12}
            dragConstraints={tableRef}
            initial={{ opacity: 0, scale: 0.9, rotate: pos.rotate }}
            animate={{ opacity: 1, scale: 1, rotate: pos.rotate }}
            whileDrag={{ scale: 1.05, rotate: 0, cursor: 'grabbing' }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            onPointerDown={() => bringToFront(photo.id)}
            onDoubleClick={() => onOpenLightbox?.(idx)}
            style={{
              position: 'absolute',
              left: `${pos.x}px`,
              top: `${pos.y}px`,
              zIndex: pos.z,
            }}
            className="w-[174px] sm:w-[206px] bg-white p-2.5 pb-4 rounded-[4px] border border-slate-200/90 shadow-[0_12px_28px_rgba(15,23,42,0.2)] cursor-grab active:cursor-grabbing group"
          >
            {/* Washi Tape Accent */}
            <div
              className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-14 h-4 rounded-[2px] -rotate-2 shadow-sm pointer-events-none"
              style={{ backgroundColor: tapeColor }}
            />

            {/* Photo Surface */}
            <div className="relative w-full h-[146px] sm:h-[172px] bg-slate-100 overflow-hidden border border-slate-200/70">
              <img
                src={photo.src}
                alt={photo.caption || 'Foto Cimi'}
                draggable={false}
                className="w-full h-full object-cover"
              />

              {/* Top-left Album Mini Badge */}
              <span
                className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold shadow-sm border border-white/80"
                style={{ backgroundColor: alb.pillBg, color: '#1E293B' }}
              >
                {alb.label}
              </span>

              {/* Quick Lightbox Zoom Icon */}
              <button
                type="button"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenLightbox?.(idx);
                }}
                className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow flex items-center justify-center opacity-85 group-hover:opacity-100 transition-opacity"
                title="Perbesar Foto"
                aria-label="Perbesar Foto"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Handwritten Polaroid Caption Area */}
            <div className="pt-2.5 px-0.5 text-center">
              <p className="font-caveat text-[19px] font-bold leading-tight text-slate-800 line-clamp-2">
                {photo.caption || 'Momen Cimi'}
              </p>
              {photo.date && (
                <p className="mt-0.5 font-mono text-[9.5px] text-slate-400">
                  {photo.date}
                </p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
