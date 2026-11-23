import React from 'react';

/**
 * Die-cut SVG Sticker 1: Cute Carrot with thick white vinyl outline
 */
export function CarrotSticker({ className = 'w-12 h-12' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 80 80"
      className={className}
      style={{ filter: 'drop-shadow(0 3px 4px rgba(15,23,42,0.22))' }}
      aria-hidden="true"
    >
      {/* White die-cut backing border */}
      <g
        stroke="#FFFFFF"
        strokeWidth="9"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="#FFFFFF"
      >
        <path d="M40 16 C35 7, 26 9, 30 19 C23 14, 19 21, 29 24 L40 26 L51 24 C61 21, 57 14, 50 19 C54 9, 45 7, 40 16 Z" />
        <path d="M26 28 C25 23, 55 23, 54 28 C53 45, 45 65, 40 68 C35 65, 27 45, 26 28 Z" />
      </g>

      {/* Leafy crown */}
      <path
        d="M40 24 C34 11, 26 11, 32 23 C25 18, 22 23, 33 26 Z"
        fill="#22C55E"
        stroke="#15803D"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M40 24 C46 11, 54 11, 48 23 C55 18, 58 23, 47 26 Z"
        fill="#4ADE80"
        stroke="#15803D"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M40 24 C38 10, 42 10, 40 24 Z"
        fill="#16A34A"
        stroke="#15803D"
        strokeWidth="1.6"
      />

      {/* Carrot body */}
      <path
        d="M26 28 C25 23, 55 23, 54 28 C53 45, 45 65, 40 68 C35 65, 27 45, 26 28 Z"
        fill="#FB923C"
        stroke="#C2410C"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Carrot ridge accents */}
      <path
        d="M31 35 H37 M44 43 H50 M33 51 H38"
        stroke="#EA580C"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Kawaii face */}
      <circle cx="35" cy="39" r="1.8" fill="#431407" />
      <circle cx="45" cy="39" r="1.8" fill="#431407" />
      <ellipse cx="32" cy="42" rx="2.3" ry="1.3" fill="#FDA4AF" />
      <ellipse cx="48" cy="42" rx="2.3" ry="1.3" fill="#FDA4AF" />
      <path
        d="M38 41.5 Q40 44 42 41.5"
        fill="none"
        stroke="#431407"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Die-cut SVG Sticker 2: Kawaii Pastel Yellow Star with thick white outline
 */
export function StarSticker({ className = 'w-11 h-11' }) {
  const starPath =
    'M40 12 L47.5 27.5 L64.5 29.8 L52 41.6 L55.2 58.6 L40 50.4 L24.8 58.6 L28 41.6 L15.5 29.8 L32.5 27.5 Z';
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 80 80"
      className={className}
      style={{ filter: 'drop-shadow(0 3px 4px rgba(15,23,42,0.22))' }}
      aria-hidden="true"
    >
      <path
        d={starPath}
        fill="#FFFFFF"
        stroke="#FFFFFF"
        strokeWidth="10"
        strokeLinejoin="round"
      />
      <path
        d={starPath}
        fill="#FDE047"
        stroke="#CA8A04"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Highlight */}
      <path
        d="M36 21 L40 16 L43 22"
        fill="none"
        stroke="#FEF9C3"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* Cute face */}
      <circle cx="34.5" cy="36.5" r="1.9" fill="#713F12" />
      <circle cx="45.5" cy="36.5" r="1.9" fill="#713F12" />
      <ellipse cx="31.5" cy="40" rx="2.4" ry="1.3" fill="#FCA5A5" />
      <ellipse cx="48.5" cy="40" rx="2.4" ry="1.3" fill="#FCA5A5" />
      <path
        d="M37.5 40.2 Q40 43.2 42.5 40.2"
        fill="none"
        stroke="#713F12"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Die-cut SVG Sticker 3: Retro "CIMI BABY" Badge Sticker
 */
export function CimiBabyBadgeSticker({ className = 'w-[78px] h-10' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 132 62"
      className={className}
      style={{ filter: 'drop-shadow(0 3px 5px rgba(15,23,42,0.24))' }}
      aria-hidden="true"
    >
      {/* Thick white vinyl die-cut edge */}
      <rect
        x="8"
        y="9"
        width="116"
        height="44"
        rx="22"
        fill="#FFFFFF"
        stroke="#FFFFFF"
        strokeWidth="8"
      />
      {/* Retro badge body */}
      <rect
        x="8"
        y="9"
        width="116"
        height="44"
        rx="22"
        fill="#FB7185"
        stroke="#9F1239"
        strokeWidth="2.2"
      />
      <rect
        x="12.5"
        y="13.5"
        width="107"
        height="35"
        rx="17.5"
        fill="none"
        stroke="#FFE4E6"
        strokeWidth="1.4"
        strokeDasharray="3.5 2.5"
      />
      {/* Tiny sparkles & heart */}
      <circle cx="24" cy="31" r="2.2" fill="#FEF08A" />
      <circle cx="108" cy="31" r="2.2" fill="#FEF08A" />
      <text
        x="66"
        y="35"
        textAnchor="middle"
        fill="#FFFFFF"
        fontSize="13.5"
        fontWeight="900"
        letterSpacing="1.1"
        fontFamily="system-ui, -apple-system, 'Segoe UI', Arial, sans-serif"
      >
        CIMI BABY
      </text>
    </svg>
  );
}

/**
 * Offline Pastel SVG Cover Artwork for empty album cards inside the folder
 */
export function AlbumCoverIllustration({ albumId }) {
  if (albumId === 'tidur-gemoy') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" className="w-full h-full">
        <rect width="160" height="120" fill="#E0F2FE" />
        <circle cx="128" cy="28" r="14" fill="#FEF08A" />
        <path d="M18 92 Q80 78 142 92 L142 120 L18 120 Z" fill="#BAE6FD" />
        <g transform="translate(80, 74)">
          <ellipse cx="0" cy="4" rx="34" ry="18" fill="#FFFFFF" stroke="#0369A1" strokeWidth="2.2" />
          <circle cx="-22" cy="-2" r="14" fill="#FFFFFF" stroke="#0369A1" strokeWidth="2.2" />
          <ellipse cx="-32" cy="-16" rx="5" ry="13" transform="rotate(-38 -32 -16)" fill="#FFFFFF" stroke="#0369A1" strokeWidth="2" />
          <circle cx="36" cy="2" r="6.5" fill="#FFFFFF" stroke="#0369A1" strokeWidth="2" />
          <path d="M-27 -2 Q-23 1 -19 -2" fill="none" stroke="#0369A1" strokeWidth="2" strokeLinecap="round" />
          <text x="14" y="-22" fill="#0284C7" fontSize="13" fontWeight="800" fontFamily="system-ui, sans-serif">
            Zzz
          </text>
        </g>
      </svg>
    );
  }

  if (albumId === 'jam-makan') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" className="w-full h-full">
        <rect width="160" height="120" fill="#FFE4E6" />
        <circle cx="80" cy="64" r="42" fill="#FFF1F2" />
        <g transform="translate(80, 62)">
          <path d="M-28 10 L28 10 L22 30 L-22 30 Z" fill="#FDA4AF" stroke="#BE123C" strokeWidth="2.2" strokeLinejoin="round" />
          <path d="M-12 6 C-16 -14, 14 -16, 12 6 Z" fill="#FB923C" stroke="#C2410C" strokeWidth="2" />
          <path d="M0 -10 Q-5 -24 -13 -20 M2 -10 Q8 -24 15 -19" fill="none" stroke="#16A34A" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="24" cy="-14" r="7" fill="#4ADE80" stroke="#15803D" strokeWidth="1.8" />
        </g>
      </svg>
    );
  }

  if (albumId === 'eksplor') {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" className="w-full h-full">
        <rect width="160" height="120" fill="#D1FAE5" />
        <path d="M0 86 Q50 70 95 84 T160 80 L160 120 L0 120 Z" fill="#6EE7B7" />
        <g transform="translate(80, 60) rotate(-8)">
          <ellipse cx="0" cy="8" rx="22" ry="14" fill="#FFFFFF" stroke="#047857" strokeWidth="2.2" />
          <circle cx="17" cy="-6" r="12" fill="#FFFFFF" stroke="#047857" strokeWidth="2.2" />
          <ellipse cx="12" cy="-23" rx="4" ry="11" transform="rotate(-12 12 -23)" fill="#FFFFFF" stroke="#047857" strokeWidth="2" />
          <ellipse cx="22" cy="-21" rx="4" ry="11" transform="rotate(14 22 -21)" fill="#FFFFFF" stroke="#047857" strokeWidth="2" />
          <circle cx="-23" cy="6" r="5.5" fill="#FFFFFF" stroke="#047857" strokeWidth="2" />
          <circle cx="21" cy="-8" r="1.8" fill="#047857" />
        </g>
      </svg>
    );
  }

  // baby-cimi fallback
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" className="w-full h-full">
      <rect width="160" height="120" fill="#FEF3C7" />
      <circle cx="80" cy="62" r="40" fill="#FFFBEB" />
      <g transform="translate(80, 64)">
        <ellipse cx="-16" cy="-16" rx="5.5" ry="15" transform="rotate(-16 -16 -16)" fill="#E5E7EB" stroke="#92400E" strokeWidth="2" />
        <ellipse cx="16" cy="-16" rx="5.5" ry="15" transform="rotate(16 16 -16)" fill="#E5E7EB" stroke="#92400E" strokeWidth="2" />
        <ellipse cx="0" cy="4" rx="22" ry="18" fill="#F3F4F6" stroke="#92400E" strokeWidth="2" />
        <circle cx="-8" cy="2" r="2" fill="#451A03" />
        <circle cx="8" cy="2" r="2" fill="#451A03" />
        <ellipse cx="0" cy="7" rx="2.5" ry="1.6" fill="#FB7185" />
      </g>
    </svg>
  );
}
