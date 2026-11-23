import React from 'react';
import { Check, Eraser, Stamp, Undo2, X } from 'lucide-react';

export const FUN_STAMP_PRESETS = [
  {
    id: 'gigit-kardus',
    label: 'Tukang Gigit Kardus',
    shortLabel: 'Gigit Kardus',
    color: '#DC2626',
    bgSoft: '#FEE2E2',
  },
  {
    id: 'rakus',
    label: 'Rakus 100%',
    shortLabel: 'Rakus 100%',
    color: '#C2410C',
    bgSoft: '#FFEDD5',
  },
  {
    id: 'certified-gemoy',
    label: 'Certified Gemoy',
    shortLabel: 'Certified Gemoy',
    color: '#0F766E',
    bgSoft: '#CCFBF1',
  },
  {
    id: 'jejak-kaki',
    label: 'Jejak Kaki Kelinci',
    shortLabel: 'Jejak Kaki',
    color: '#DB6B97',
    bgSoft: '#FCE7F3',
  },
];

export function FunStampSvg({ type, className = '', style }) {
  if (type === 'gigit-kardus') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 184 68"
        className={className || 'w-[164px] h-[60px]'}
        style={style}
        aria-label="Stempel Tukang Gigit Kardus"
      >
        <rect
          x="4"
          y="4"
          width="176"
          height="60"
          rx="8"
          fill="none"
          stroke="#DC2626"
          strokeWidth="3.5"
        />
        <rect
          x="9"
          y="9"
          width="166"
          height="50"
          rx="5"
          fill="none"
          stroke="#DC2626"
          strokeWidth="1.2"
          strokeDasharray="4 2.5"
        />
        {/* Playful cardboard nibble marks on top-right edge */}
        <circle cx="152" cy="4" r="3" fill="#DC2626" opacity="0.3" />
        <text
          x="92"
          y="30"
          textAnchor="middle"
          fill="#DC2626"
          fontSize="12.5"
          fontWeight="900"
          letterSpacing="1.3"
          fontFamily="system-ui, -apple-system, 'Segoe UI', Arial, sans-serif"
        >
          TUKANG GIGIT
        </text>
        <text
          x="92"
          y="48"
          textAnchor="middle"
          fill="#DC2626"
          fontSize="14.5"
          fontWeight="900"
          letterSpacing="2.2"
          fontFamily="system-ui, -apple-system, 'Segoe UI', Arial, sans-serif"
        >
          ★ KARDUS ★
        </text>
      </svg>
    );
  }

  if (type === 'rakus') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 164 68"
        className={className || 'w-[146px] h-[60px]'}
        style={style}
        aria-label="Stempel Rakus 100%"
      >
        <rect
          x="4"
          y="6"
          width="156"
          height="56"
          rx="28"
          fill="none"
          stroke="#C2410C"
          strokeWidth="3.4"
        />
        <rect
          x="9.5"
          y="11.5"
          width="145"
          height="45"
          rx="22.5"
          fill="none"
          stroke="#C2410C"
          strokeWidth="1.3"
        />
        {/* Tiny carrot icon inside stamp */}
        <g transform="translate(30, 34)">
          <path d="M-4 -4 L8 -1 L-4 4 Z" fill="#C2410C" />
          <path d="M-5 -2 L-9 -5 M-5 0 L-10 0 M-5 2 L-9 5" stroke="#C2410C" strokeWidth="1.5" strokeLinecap="round" />
        </g>
        <text
          x="92"
          y="31"
          textAnchor="middle"
          fill="#C2410C"
          fontSize="14"
          fontWeight="900"
          letterSpacing="1.8"
          fontFamily="system-ui, -apple-system, 'Segoe UI', Arial, sans-serif"
        >
          RAKUS
        </text>
        <text
          x="92"
          y="47"
          textAnchor="middle"
          fill="#C2410C"
          fontSize="12"
          fontWeight="800"
          letterSpacing="1.5"
          fontFamily="system-ui, -apple-system, 'Segoe UI', Arial, sans-serif"
        >
          100% VALID
        </text>
      </svg>
    );
  }

  if (type === 'certified-gemoy') {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 120 120"
        className={className || 'w-[104px] h-[104px]'}
        style={style}
        aria-label="Stempel Certified Gemoy"
      >
        <circle cx="60" cy="60" r="54" fill="none" stroke="#0F766E" strokeWidth="3.4" />
        <circle
          cx="60"
          cy="60"
          r="48"
          fill="none"
          stroke="#0F766E"
          strokeWidth="1.3"
          strokeDasharray="3.5 2.5"
        />
        <circle cx="60" cy="60" r="30" fill="none" stroke="#0F766E" strokeWidth="1.2" />
        <text
          x="60"
          y="25"
          textAnchor="middle"
          fill="#0F766E"
          fontSize="9"
          fontWeight="900"
          letterSpacing="1.5"
          fontFamily="system-ui, -apple-system, 'Segoe UI', Arial, sans-serif"
        >
          ★ CERTIFIED ★
        </text>
        <text
          x="60"
          y="63"
          textAnchor="middle"
          fill="#0F766E"
          fontSize="13"
          fontWeight="900"
          letterSpacing="1.3"
          fontFamily="system-ui, -apple-system, 'Segoe UI', Arial, sans-serif"
        >
          GEMOY
        </text>
        <text
          x="60"
          y="102"
          textAnchor="middle"
          fill="#0F766E"
          fontSize="8.5"
          fontWeight="800"
          letterSpacing="1.2"
          fontFamily="system-ui, -apple-system, 'Segoe UI', Arial, sans-serif"
        >
          RESMI &amp; SAH
        </text>
      </svg>
    );
  }

  // jejak-kaki
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 96 96"
      className={className || 'w-[80px] h-[80px]'}
      style={style}
      aria-label="Stempel Jejak Kaki Kelinci"
    >
      <g fill="#DB6B97">
        {/* Main paw */}
        <g transform="translate(44, 54) rotate(-14)">
          <ellipse cx="-14" cy="-14" rx="5" ry="7" transform="rotate(-16 -14 -14)" />
          <ellipse cx="-4" cy="-20" rx="4.8" ry="7.2" transform="rotate(-5 -4 -20)" />
          <ellipse cx="7" cy="-19" rx="4.8" ry="7.2" transform="rotate(8 7 -19)" />
          <ellipse cx="16" cy="-11" rx="5" ry="6.8" transform="rotate(20 16 -11)" />
          <path d="M-15 4 C-16 -4, -8 -9, 0 -9 C8 -9, 16 -4, 15 4 C14 11, 8 13, 0 11 C-8 13, -14 11, -15 4 Z" />
        </g>
        {/* Little trailing mini paw */}
        <g transform="translate(72, 26) rotate(12) scale(0.45)">
          <ellipse cx="-13" cy="-14" rx="5" ry="7" />
          <ellipse cx="0" cy="-20" rx="5" ry="7.2" />
          <ellipse cx="13" cy="-14" rx="5" ry="7" />
          <path d="M-14 4 C-15 -4, -7 -9, 0 -9 C7 -9, 15 -4, 14 4 C13 11, 7 12, 0 10 C-7 12, -13 11, -14 4 Z" />
        </g>
      </g>
    </svg>
  );
}

/**
 * Layer inside CertificateFront & CertificateBack displaying user-placed stamps.
 * Included in Download PNG and Print/PDF automatically.
 */
export function CustomStampsLayer({ stamps = [], latestStampId = null, isExport = false }) {
  if (!stamps || stamps.length === 0) return null;

  return (
    <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden">
      {stamps.map((stamp) => {
        const isNew = !isExport && stamp.id === latestStampId;
        return (
          <div
            key={stamp.id}
            style={{
              position: 'absolute',
              left: `${stamp.x}px`,
              top: `${stamp.y}px`,
              transform: `translate(-50%, -50%) rotate(${stamp.rotate}deg)`,
              opacity: 0.84,
            }}
          >
            <div className={isNew ? 'animate-stamp-slam' : ''}>
              <FunStampSvg type={stamp.type} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Floating Mini-Palette shown when "Mode Stempel" is active
 */
export function StampPalette({
  selectedType,
  onSelectType,
  onUndo,
  onClear,
  totalCount,
  sideCount,
  activeSideLabel,
  onClose,
  theme,
}) {
  return (
    <div className="no-print print:hidden w-full max-w-[920px] mb-3 px-3 sm:px-4 py-2.5 rounded-2xl bg-white/92 backdrop-blur-md border border-slate-200/90 shadow-lg flex flex-wrap items-center justify-between gap-2.5 z-30">
      <div className="flex items-center gap-2 min-w-0">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0"
          style={{ backgroundColor: theme.primary }}
        >
          <Stamp className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <span>Mode Stempel Bebas</span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
              {sideCount} di {activeSideLabel}
            </span>
          </p>
          <p className="text-[11px] text-slate-500 truncate">
            Klik titik mana saja di permukaan akta untuk mengecap!
          </p>
        </div>
      </div>

      {/* 4 Stamp Choices */}
      <div className="flex flex-wrap items-center gap-1.5">
        {FUN_STAMP_PRESETS.map((preset) => {
          const active = selectedType === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectType(preset.id)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                active
                  ? 'ring-2 ring-offset-1 shadow-sm scale-[1.02]'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
              style={
                active
                  ? {
                      backgroundColor: preset.bgSoft,
                      borderColor: preset.color,
                      color: preset.color,
                      '--tw-ring-color': preset.color,
                    }
                  : undefined
              }
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: preset.color }}
              />
              <span>{preset.shortLabel}</span>
              {active && <Check className="w-3 h-3 shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Undo / Clear / Close */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onUndo}
          disabled={sideCount === 0}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Batalkan stempel terakhir di sisi ini"
        >
          <Undo2 className="w-3.5 h-3.5" />
          <span>Undo</span>
        </button>

        <button
          type="button"
          onClick={onClear}
          disabled={totalCount === 0}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Hapus semua stempel bebas"
        >
          <Eraser className="w-3.5 h-3.5" />
          <span>Bersihkan Cap</span>
        </button>

        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-white shadow-sm hover:opacity-95"
          style={{ backgroundColor: theme.primary }}
        >
          <X className="w-3.5 h-3.5" />
          <span>Selesai</span>
        </button>
      </div>
    </div>
  );
}
