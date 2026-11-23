import React from 'react';

/**
 * Shared 1122x794 (A4 Landscape) physical certificate shell:
 * paper texture, vignette, classic double SVG ornamental border, corner filigree,
 * centered rabbit silhouette watermark, foil shimmer, and optional stamp/interaction overlay.
 */
export default function CertificateFrame({ theme, isExport = false, overlay = null, children }) {
  return (
    <div
      className="relative w-[1122px] h-[794px] overflow-hidden select-none"
      style={{
        backgroundColor: theme.paperBg,
        color: theme.textMain,
      }}
    >
      {/* Subtle Paper Grain */}
      <div className="absolute inset-0 paper-grain pointer-events-none" />

      {/* Warm Soft Edge Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: `inset 0 0 70px ${theme.pageAccent}`,
        }}
      />

      {/* Centered Bunny Crest Watermark */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        aria-hidden="true"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 360 360"
          className="w-[340px] h-[340px]"
          style={{ opacity: theme.watermarkOpacity }}
        >
          <circle
            cx="180"
            cy="180"
            r="164"
            fill="none"
            stroke={theme.watermark}
            strokeWidth="3"
            strokeDasharray="8 6"
          />
          <circle
            cx="180"
            cy="180"
            r="148"
            fill="none"
            stroke={theme.watermark}
            strokeWidth="1.5"
          />
          {/* Bunny Silhouette */}
          <g fill={theme.watermark}>
            <ellipse cx="146" cy="112" rx="18" ry="52" transform="rotate(-12 146 112)" />
            <ellipse cx="214" cy="112" rx="18" ry="52" transform="rotate(12 214 112)" />
            <ellipse cx="180" cy="178" rx="54" ry="44" />
            <path d="M120 245 C120 208, 240 208, 240 245 C240 278, 214 294, 180 294 C146 294, 120 278, 120 245 Z" />
            <circle cx="242" cy="264" r="14" />
          </g>
        </svg>
      </div>

      {/* Double Ornamental SVG Certificate Frame */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1122 794"
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
      >
        {/* Outer Classic Frame */}
        <rect
          x="18"
          y="18"
          width="1086"
          height="758"
          rx="4"
          fill="none"
          stroke={theme.borderOuter}
          strokeWidth="3.2"
        />
        <rect
          x="25"
          y="25"
          width="1072"
          height="744"
          rx="2"
          fill="none"
          stroke={theme.borderInner}
          strokeWidth="1.2"
        />
        {/* Inner Ornamental Frame */}
        <rect
          x="33"
          y="33"
          width="1056"
          height="728"
          rx="2"
          fill="none"
          stroke={theme.borderInner}
          strokeWidth="2.1"
        />
        <rect
          x="39"
          y="39"
          width="1044"
          height="716"
          fill="none"
          stroke={theme.borderOuter}
          strokeWidth="0.9"
          strokeOpacity="0.45"
        />

        {/* Top & Bottom Center Medallion Diamonds */}
        <g fill={theme.paperBg} stroke={theme.borderInner} strokeWidth="1.6">
          <polygon points="561,13 571,25 561,37 551,25" />
          <polygon points="561,757 571,769 561,781 551,769" />
          <polygon points="13,397 25,407 37,397 25,387" />
          <polygon points="1085,397 1097,407 1109,397 1097,387" />
        </g>
        <g fill={theme.borderOuter}>
          <circle cx="561" cy="25" r="2.6" />
          <circle cx="561" cy="769" r="2.6" />
          <circle cx="25" cy="397" r="2.6" />
          <circle cx="1097" cy="397" r="2.6" />
        </g>

        {/* Four Scrolled Corner Flourishes */}
        {[
          'translate(33, 33)',
          'translate(1089, 33) scale(-1, 1)',
          'translate(33, 761) scale(1, -1)',
          'translate(1089, 761) scale(-1, -1)',
        ].map((transform, idx) => (
          <g key={idx} transform={transform}>
            <path
              d="M0 44 L0 0 L44 0"
              fill="none"
              stroke={theme.borderOuter}
              strokeWidth="3.5"
            />
            <path
              d="M6 34 C6 18, 18 6, 34 6"
              fill="none"
              stroke={theme.borderInner}
              strokeWidth="1.8"
            />
            <path
              d="M6 22 C15 22, 22 15, 22 6"
              fill="none"
              stroke={theme.borderOuter}
              strokeWidth="1.3"
            />
            <circle cx="11" cy="11" r="3" fill={theme.borderInner} />
            <circle cx="38" cy="6" r="1.8" fill={theme.borderOuter} />
            <circle cx="6" cy="38" r="1.8" fill={theme.borderOuter} />
          </g>
        ))}
      </svg>

      {/* Safe Interior Area */}
      <div className="relative z-10 w-full h-full px-[52px] py-[44px] flex flex-col">
        {children}
      </div>

      {/* Subtle Foil / Holo Shimmer Following Cursor (Hidden on Export & Print) */}
      {!isExport && (
        <>
          <div
            className="no-print print:hidden absolute inset-0 z-20 pointer-events-none transition-opacity duration-300"
            style={{
              opacity: 'var(--foil-op, 0)',
              background:
                'radial-gradient(460px circle at var(--foil-x, 50%) var(--foil-y, 50%), rgba(255, 245, 200, 0.36), rgba(255, 255, 255, 0.14) 38%, transparent 72%)',
              mixBlendMode: 'soft-light',
            }}
            aria-hidden="true"
          />
          <div
            className="no-print print:hidden absolute inset-0 z-20 pointer-events-none transition-opacity duration-300"
            style={{
              opacity: 'calc(var(--foil-op, 0) * 0.48)',
              background:
                'linear-gradient(118deg, transparent 22%, rgba(255, 232, 163, 0.24) 45%, rgba(224, 242, 254, 0.18) 54%, transparent 76%)',
              mixBlendMode: 'overlay',
            }}
            aria-hidden="true"
          />
        </>
      )}

      {/* Custom Stamps & Stamp Mode Click Catcher Overlay */}
      {overlay}
    </div>
  );
}
