import React, { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CIMI_ALBUMS } from '../data/cimiPhotos.js';
import {
  AlbumCoverIllustration,
  CarrotSticker,
  CimiBabyBadgeSticker,
  StarSticker,
} from './CimiStickers.jsx';
import { playCardRustle } from '../utils/soundEffects.js';

const FAN_OFFSETS = [
  { x: -54, y: -90, rotate: -8.5 },
  { x: -18, y: -112, rotate: -2.6 },
  { x: 18, y: -108, rotate: 2.8 },
  { x: 54, y: -86, rotate: 8.2 },
];

const IDLE_OFFSETS = [
  { x: -24, y: 18, rotate: -4 },
  { x: -8, y: 12, rotate: -1.2 },
  { x: 8, y: 14, rotate: 1.5 },
  { x: 24, y: 20, rotate: 4 },
];

export default function CimiMemoriesFolder({ photos = [], theme, onOpenGallery }) {
  const [isHovered, setIsHovered] = useState(false);
  const [touchOpen, setTouchOpen] = useState(false);
  const [hoveredCardIdx, setHoveredCardIdx] = useState(null);
  const lastPointerTypeRef = useRef('mouse');

  const isExpanded = isHovered || touchOpen;

  const albumCards = useMemo(() => {
    return CIMI_ALBUMS.map((album) => {
      const matching = photos.filter((p) => p.album === album.id);
      const cover = matching[0] || null;
      return {
        ...album,
        count: matching.length,
        coverSrc: cover?.src || '',
        infoLabel:
          matching.length > 0 ? `${matching.length} foto` : album.badge,
      };
    });
  }, [photos]);

  const handleFolderClick = () => {
    if (lastPointerTypeRef.current === 'touch' && !touchOpen) {
      setTouchOpen(true);
      return;
    }
    setTouchOpen(false);
    onOpenGallery('all');
  };

  const handleAlbumCardClick = (e, albumId) => {
    e.stopPropagation();
    if (lastPointerTypeRef.current === 'touch' && !touchOpen) {
      setTouchOpen(true);
      return;
    }
    setTouchOpen(false);
    onOpenGallery(albumId);
  };

  return (
    <section
      className="no-print screen-only w-full max-w-[1220px] mx-auto px-4 pb-12 pt-4 flex flex-col items-center"
      aria-label="Galeri Foto Cimi's Memories"
    >
      {/* Subtle Section Divider */}
      <div className="w-full max-w-[520px] flex items-center gap-3 mb-2">
        <div
          className="flex-1 h-[1px]"
          style={{ backgroundColor: theme?.divider || 'rgba(15,23,42,0.12)' }}
        />
        <span
          className="font-mono text-[10.5px] font-semibold tracking-[0.2em] uppercase"
          style={{ color: theme?.textMuted || '#64748B' }}
        >
          KOLEKSI FOTO CIMI
        </span>
        <div
          className="flex-1 h-[1px]"
          style={{ backgroundColor: theme?.divider || 'rgba(15,23,42,0.12)' }}
        />
      </div>

      {/* Interactive Folder Stage (generous top headroom for fan-out cards) */}
      <div className="pt-28 pb-3 flex flex-col items-center">
        <div
          role="button"
          tabIndex={0}
          aria-label="Buka folder galeri Cimi's Memories"
          onPointerDown={(e) => {
            lastPointerTypeRef.current = e.pointerType || 'mouse';
          }}
          onMouseEnter={() => {
            lastPointerTypeRef.current = 'mouse';
            setIsHovered(true);
            playCardRustle();
          }}
          onMouseLeave={() => {
            setIsHovered(false);
            setHoveredCardIdx(null);
          }}
          onFocus={() => setIsHovered(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
              setIsHovered(false);
              setHoveredCardIdx(null);
            }
          }}
          onClick={handleFolderClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onOpenGallery('all');
            }
          }}
          className="relative w-[320px] sm:w-[368px] h-[238px] cursor-pointer select-none focus:outline-none group"
          style={{ perspective: '1200px' }}
        >
          {/* Ambient Soft Ground Shadow */}
          <motion.div
            className="absolute -bottom-3 left-6 right-6 h-7 rounded-full bg-slate-900/15 blur-xl pointer-events-none"
            animate={{
              scaleX: isExpanded ? 1.06 : 0.96,
              opacity: isExpanded ? 0.24 : 0.16,
            }}
            transition={{ type: 'spring', stiffness: 240, damping: 24 }}
          />

          {/* Folder Back Layer + Top-Right Tab (Warm Pastel Yellow) */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Top-Right Rounded Tab */}
            <div
              className="absolute -top-5 right-0 w-[134px] h-9 rounded-t-2xl border border-amber-300/80 shadow-sm"
              style={{
                background: 'linear-gradient(180deg, #FDE68A 0%, #FCD34D 100%)',
              }}
            />
            {/* Main Folder Back Pocket */}
            <div
              className="absolute inset-0 rounded-[24px] rounded-tr-lg border border-amber-300/90 shadow-[0_12px_28px_rgba(180,130,30,0.18)]"
              style={{
                background:
                  'linear-gradient(165deg, #FDE68A 0%, #FCD34D 55%, #F59E0B 160%)',
              }}
            />
            {/* Inner subtle shadow rim */}
            <div className="absolute inset-x-3 top-2 h-6 rounded-t-2xl bg-amber-900/10 blur-[2px]" />
          </div>

          {/* Stacked Album Cards Inside Pocket */}
          <div className="absolute inset-x-0 top-3 bottom-5 flex items-center justify-center pointer-events-none">
            {albumCards.map((card, idx) => {
              const target = isExpanded ? FAN_OFFSETS[idx] : IDLE_OFFSETS[idx];
              const isCardHovered = isExpanded && hoveredCardIdx === idx;

              return (
                <motion.div
                  key={card.id}
                  role="button"
                  tabIndex={isExpanded ? 0 : -1}
                  aria-label={`Buka album ${card.label} (${card.count} foto)`}
                  onMouseEnter={() => {
                    if (isExpanded) {
                      setHoveredCardIdx(idx);
                      playCardRustle();
                    }
                  }}
                  onMouseLeave={() => {
                    if (hoveredCardIdx === idx) setHoveredCardIdx(null);
                  }}
                  onClick={(e) => handleAlbumCardClick(e, card.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      onOpenGallery(card.id);
                    }
                  }}
                  animate={{
                    x: target.x,
                    y: isCardHovered ? target.y - 24 : target.y,
                    rotate: isCardHovered ? target.rotate * 0.45 : target.rotate,
                    scale: isCardHovered ? 1.06 : isExpanded ? 1 : 0.94,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 270,
                    damping: 20,
                    delay: isExpanded ? idx * 0.04 : (3 - idx) * 0.025,
                  }}
                  style={{
                    zIndex: isCardHovered ? 35 : 10 + idx,
                    backgroundColor: card.cardBg,
                  }}
                  className="pointer-events-auto absolute w-[156px] sm:w-[172px] h-[168px] rounded-2xl p-1.5 border-2 border-white shadow-[0_10px_22px_rgba(15,23,42,0.18)] overflow-hidden cursor-pointer"
                >
                  {/* Top Pill Labels (Left: Album Title, Right: Count / Format) */}
                  <div className="relative w-full h-full rounded-xl overflow-hidden bg-slate-100">
                    {card.coverSrc ? (
                      <img
                        src={card.coverSrc}
                        alt={card.label}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <AlbumCoverIllustration albumId={card.id} />
                    )}

                    {/* Top Gradient Scrim for Pill Readability */}
                    <div className="absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-slate-950/35 to-transparent pointer-events-none" />

                    {/* Top-Left Album Title Pill */}
                    <span
                      className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full text-[9.5px] font-bold shadow-sm border border-white/70"
                      style={{
                        backgroundColor: card.pillBg,
                        color: '#1E293B',
                      }}
                    >
                      {card.label}
                    </span>

                    {/* Top-Right Photo Count / Extension Badge */}
                    <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full bg-white/90 text-slate-700 font-mono text-[9px] font-bold shadow-sm">
                      {card.infoLabel}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Front Frosted-Glass Flap (3D Perspective Tilting Open on Hover) */}
          <motion.div
            animate={{
              rotateX: isExpanded ? -19 : 0,
              y: isExpanded ? 6 : 0,
            }}
            transition={{
              type: 'spring',
              stiffness: 250,
              damping: 22,
            }}
            style={{
              transformOrigin: 'bottom center',
              transformStyle: 'preserve-3d',
              zIndex: 40,
              background:
                'linear-gradient(155deg, rgba(255,255,255,0.68) 0%, rgba(255,255,255,0.44) 55%, rgba(255,255,255,0.58) 100%)',
            }}
            className="absolute inset-x-0 bottom-0 h-[176px] rounded-[24px] backdrop-blur-md border border-white/80 border-t-2 border-t-white shadow-[0_14px_34px_rgba(15,23,42,0.14),inset_0_1px_0_rgba(255,255,255,0.9)] px-5 py-4 flex items-end justify-between"
          >
            {/* Subtle Glass Specular Sheen */}
            <div
              className="absolute inset-0 rounded-[24px] pointer-events-none"
              style={{
                background:
                  'linear-gradient(120deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 42%)',
              }}
            />

            {/* Bottom-Left Handwritten Folder Title + Year/Count */}
            <div className="relative z-10 text-left">
              <h3 className="font-caveat text-[32px] sm:text-[35px] font-bold leading-none text-slate-800 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                Cimi&apos;s Memories
              </h3>
              <p className="mt-1 font-mono text-[11px] font-semibold text-slate-600 tracking-wide">
                2025–2026 • {photos.length} foto tersimpan
              </p>
            </div>

            {/* Bottom-Right Cluster of 3 Die-Cut SVG Stickers */}
            <div className="relative z-10 flex items-end shrink-0 w-[108px] h-[74px] pointer-events-none">
              <motion.div
                className="absolute right-11 bottom-6"
                animate={{
                  rotate: isExpanded ? -14 : -9,
                  y: isExpanded ? -3 : 0,
                }}
                transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              >
                <StarSticker className="w-10 h-10" />
              </motion.div>

              <motion.div
                className="absolute right-0 bottom-4"
                animate={{
                  rotate: isExpanded ? 14 : 9,
                  y: isExpanded ? -4 : 0,
                }}
                transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              >
                <CarrotSticker className="w-12 h-12" />
              </motion.div>

              <motion.div
                className="absolute right-1 -bottom-1"
                animate={{
                  rotate: isExpanded ? -6 : -3,
                  scale: isExpanded ? 1.04 : 1,
                }}
                transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              >
                <CimiBabyBadgeSticker className="w-[82px] h-10" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Helper Sub-Caption */}
      <p
        className="mt-2 px-3.5 py-1 rounded-full bg-white/70 border border-black/10 text-xs font-medium shadow-sm text-center"
        style={{ color: theme?.textMuted || '#475569' }}
      >
        Hover untuk intip, klik folder untuk lihat semua foto Cimi
      </p>
    </section>
  );
}
