import React, { useId, useMemo } from 'react';
import QRCode from 'qrcode';

/**
 * Custom Official Rabbit Heraldic Emblem (Shield + Laurel + Bunny Silhouette)
 */
export function OfficialRabbitEmblem({ theme, className = 'w-14 h-14' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 110"
      className={className}
      aria-hidden="true"
    >
      {/* Left laurel wreath */}
      <g fill="none" stroke={theme.secondary} strokeWidth="2" strokeLinecap="round">
        <path d="M28 84 C14 70, 12 45, 24 26" />
        <path d="M22 72 C14 68, 12 62, 18 60" fill={theme.secondary} fillOpacity="0.35" />
        <path d="M18 58 C10 52, 10 46, 16 45" fill={theme.secondary} fillOpacity="0.35" />
        <path d="M19 43 C13 36, 15 30, 21 31" fill={theme.secondary} fillOpacity="0.35" />
        <path d="M24 31 C21 24, 25 20, 29 24" fill={theme.secondary} fillOpacity="0.35" />
      </g>

      {/* Right laurel wreath */}
      <g fill="none" stroke={theme.secondary} strokeWidth="2" strokeLinecap="round">
        <path d="M92 84 C106 70, 108 45, 96 26" />
        <path d="M98 72 C106 68, 108 62, 102 60" fill={theme.secondary} fillOpacity="0.35" />
        <path d="M102 58 C110 52, 110 46, 104 45" fill={theme.secondary} fillOpacity="0.35" />
        <path d="M101 43 C107 36, 105 30, 99 31" fill={theme.secondary} fillOpacity="0.35" />
        <path d="M96 31 C99 24, 95 20, 91 24" fill={theme.secondary} fillOpacity="0.35" />
      </g>

      {/* Top 3 stars */}
      <g fill={theme.secondary}>
        <polygon points="60,5 62,10 67,10 63,13 64.5,18 60,15 55.5,18 57,13 53,10 58,10" />
        <circle cx="44" cy="13" r="2" />
        <circle cx="76" cy="13" r="2" />
      </g>

      {/* Heraldic Shield */}
      <path
        d="M32 24 L60 19 L88 24 L88 54 C88 73, 74 86, 60 93 C46 86, 32 73, 32 54 Z"
        fill={theme.primary}
        stroke={theme.secondary}
        strokeWidth="2.5"
      />
      <path
        d="M36 28 L60 23.5 L84 28 L84 53 C84 69, 72 81, 60 87.5 C48 81, 36 69, 36 53 Z"
        fill="none"
        stroke={theme.accentLight}
        strokeWidth="1"
        strokeOpacity="0.7"
      />

      {/* Minimalist Bunny Silhouette inside Shield */}
      <g fill={theme.paperBg}>
        {/* Left & Right Ears */}
        <ellipse cx="52.5" cy="40" rx="4.2" ry="12" transform="rotate(-11 52.5 40)" />
        <ellipse cx="67.5" cy="40" rx="4.2" ry="12" transform="rotate(11 67.5 40)" />
        {/* Head */}
        <ellipse cx="60" cy="54" rx="12" ry="9.8" />
        {/* Cheeks & Chest */}
        <path d="M47 68 C47 61, 73 61, 73 68 C73 75, 67 79, 60 79 C53 79, 47 75, 47 68 Z" />
        {/* Tiny Tail Puff */}
        <circle cx="73" cy="73" r="3.2" />
      </g>

      {/* Facial subtle accents inside silhouette */}
      <g fill={theme.primary}>
        <circle cx="55.5" cy="53" r="1.3" />
        <circle cx="64.5" cy="53" r="1.3" />
        <ellipse cx="60" cy="56" rx="1.6" ry="1.1" fill={theme.secondary} />
      </g>

      {/* Bottom Ribbon Scroll */}
      <path
        d="M27 88 L42 84 L46 93 L30 96 Z"
        fill={theme.secondary}
      />
      <path
        d="M93 88 L78 84 L74 93 L90 96 Z"
        fill={theme.secondary}
      />
      <path
        d="M39 85 Q60 95 81 85 L81 96 Q60 105 39 96 Z"
        fill={theme.primary}
        stroke={theme.secondary}
        strokeWidth="1.5"
      />
      <text
        x="60"
        y="94.5"
        textAnchor="middle"
        fill={theme.paperBg}
        fontSize="6.5"
        fontWeight="700"
        letterSpacing="1.1"
        fontFamily="system-ui, Arial, sans-serif"
      >
        PERKELINCIAN
      </text>
    </svg>
  );
}

/**
 * Cute Default Vector Rabbit Portrait (fallback when no photo uploaded / image cleared)
 */
export function DefaultRabbitIllustration({ theme }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 240 320"
      className="w-full h-full"
      aria-label="Ilustrasi Pas Foto Kelinci Default"
    >
      {/* Studio Backdrop */}
      <rect width="240" height="320" fill={theme.photoBg} />
      <circle cx="120" cy="145" r="95" fill={theme.paperBg} fillOpacity="0.65" />
      <rect
        x="10"
        y="10"
        width="220"
        height="300"
        fill="none"
        stroke={theme.divider}
        strokeWidth="1.5"
        strokeDasharray="4 4"
      />

      {/* Little background stars */}
      <g fill={theme.secondary} fillOpacity="0.45">
        <circle cx="42" cy="52" r="3" />
        <circle cx="198" cy="60" r="2.5" />
        <circle cx="52" cy="240" r="2" />
        <circle cx="192" cy="230" r="3" />
      </g>

      {/* Lop Ears */}
      <ellipse
        cx="64"
        cy="158"
        rx="20"
        ry="50"
        transform="rotate(18 64 158)"
        fill="#A6A8AC"
        stroke={theme.primary}
        strokeWidth="2.5"
      />
      <ellipse
        cx="66"
        cy="163"
        rx="10"
        ry="32"
        transform="rotate(18 66 163)"
        fill="#E9B8BE"
      />

      <ellipse
        cx="176"
        cy="158"
        rx="20"
        ry="50"
        transform="rotate(-18 176 158)"
        fill="#A6A8AC"
        stroke={theme.primary}
        strokeWidth="2.5"
      />
      <ellipse
        cx="174"
        cy="163"
        rx="10"
        ry="32"
        transform="rotate(-18 174 163)"
        fill="#E9B8BE"
      />

      {/* Fluffy Body */}
      <path
        d="M66 286 C66 226, 86 196, 120 196 C154 196, 174 226, 174 286 Z"
        fill="#C9CBCE"
        stroke={theme.primary}
        strokeWidth="2.5"
      />
      <ellipse cx="120" cy="252" rx="34" ry="34" fill="#F2F3F4" />

      {/* Head */}
      <ellipse
        cx="120"
        cy="144"
        rx="58"
        ry="49"
        fill="#D6D8DB"
        stroke={theme.primary}
        strokeWidth="2.5"
      />
      {/* Forehead tuft */}
      <path
        d="M108 98 Q116 84 123 96 Q131 85 135 99"
        fill="#D6D8DB"
        stroke={theme.primary}
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* Cheeks & Muzzle */}
      <ellipse cx="87" cy="156" rx="11" ry="6.5" fill="#F2A7B3" fillOpacity="0.6" />
      <ellipse cx="153" cy="156" rx="11" ry="6.5" fill="#F2A7B3" fillOpacity="0.6" />
      <ellipse cx="120" cy="158" rx="22" ry="15" fill="#F6F7F8" />

      {/* Eyes */}
      <circle cx="96" cy="138" r="6.5" fill="#1F2421" />
      <circle cx="94" cy="135.5" r="2.2" fill="#FFFFFF" />
      <circle cx="144" cy="138" r="6.5" fill="#1F2421" />
      <circle cx="142" cy="135.5" r="2.2" fill="#FFFFFF" />

      {/* Cute Nose & Mouth */}
      <ellipse cx="120" cy="151" rx="5.5" ry="3.8" fill="#E68B9C" />
      <path
        d="M120 155 L120 160 M112 162 Q116 166 120 160 Q124 166 128 162"
        fill="none"
        stroke={theme.primary}
        strokeWidth="2.2"
        strokeLinecap="round"
      />

      {/* Whiskers */}
      <g stroke={theme.textMuted} strokeWidth="1.4" strokeLinecap="round" opacity="0.65">
        <line x1="78" y1="150" x2="54" y2="146" />
        <line x1="78" y1="157" x2="52" y2="160" />
        <line x1="162" y1="150" x2="186" y2="146" />
        <line x1="162" y1="157" x2="188" y2="160" />
      </g>

      {/* Pastel Blue Bowtie */}
      <g transform="translate(120, 198)">
        <path
          d="M-3 0 L-26 -12 L-22 12 Z"
          fill="#93C5FD"
          stroke={theme.primary}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M3 0 L26 -12 L22 12 Z"
          fill="#93C5FD"
          stroke={theme.primary}
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <circle cx="0" cy="0" r="6.5" fill="#60A5FA" stroke={theme.primary} strokeWidth="2" />
      </g>

      {/* Paws */}
      <ellipse cx="95" cy="284" rx="14" ry="9" fill="#E9EAEC" stroke={theme.primary} strokeWidth="2.2" />
      <ellipse cx="145" cy="284" rx="14" ry="9" fill="#E9EAEC" stroke={theme.primary} strokeWidth="2.2" />
    </svg>
  );
}

/**
 * Circular Official Wet-Ink Stamp ("SAH • RESMI TERDAFTAR") with Paw & Carrot Center
 */
export function WetStampSvg({ inkColor, stampKey = 0, isExport = false }) {
  const uid = useId().replace(/:/g, '');
  const topArcId = `stamp-top-${uid}`;
  const bottomArcId = `stamp-bot-${uid}`;
  const animate = !isExport && stampKey > 0;

  return (
    <div
      key={animate ? `stamp-${stampKey}` : 'stamp-static'}
      className="relative w-[138px] h-[138px] select-none pointer-events-none"
    >
      {animate && (
        <div
          className="absolute inset-2 rounded-full border-2 animate-ink-ripple"
          style={{ borderColor: inkColor }}
        />
      )}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 160 160"
        className={`w-full h-full ${animate ? 'animate-stamp-slam' : ''}`}
        style={{
          transform: animate ? undefined : 'rotate(-14deg)',
          opacity: animate ? undefined : 0.86,
        }}
        aria-label="Stempel Resmi Sah Terdaftar"
      >
        <defs>
          <path id={topArcId} d="M 27.5,80 A 52.5,52.5 0 0,1 132.5,80" />
          <path id={bottomArcId} d="M 21,82 A 59,59 0 0,0 139,82" />
        </defs>

        {/* Outer double border rings */}
        <circle cx="80" cy="80" r="74" fill="none" stroke={inkColor} strokeWidth="3.6" />
        <circle cx="80" cy="80" r="68" fill="none" stroke={inkColor} strokeWidth="1.2" />

        {/* Inner dashed ring */}
        <circle
          cx="80"
          cy="80"
          r="43"
          fill="none"
          stroke={inkColor}
          strokeWidth="1.5"
          strokeDasharray="3.5 2.5"
        />
        <circle cx="80" cy="80" r="39" fill="none" stroke={inkColor} strokeWidth="0.9" />

        {/* Side separator stars */}
        <text x="19.5" y="83.5" fill={inkColor} fontSize="10" fontWeight="700" textAnchor="middle">
          ★
        </text>
        <text x="140.5" y="83.5" fill={inkColor} fontSize="10" fontWeight="700" textAnchor="middle">
          ★
        </text>

        {/* Curved Ring Text */}
        <text
          fill={inkColor}
          fontSize="10.4"
          fontWeight="800"
          letterSpacing="1.8"
          fontFamily="system-ui, -apple-system, 'Segoe UI', Arial, sans-serif"
        >
          <textPath href={`#${topArcId}`} startOffset="50%" textAnchor="middle">
            SAH • RESMI TERDAFTAR
          </textPath>
        </text>

        <text
          fill={inkColor}
          fontSize="9.2"
          fontWeight="800"
          letterSpacing="1.6"
          fontFamily="system-ui, -apple-system, 'Segoe UI', Arial, sans-serif"
        >
          <textPath href={`#${bottomArcId}`} startOffset="50%" textAnchor="middle">
            DINAS PERKELINCIAN RI
          </textPath>
        </text>

        {/* Center Bunny Paw Print + Mini Carrot */}
        <g transform="translate(80, 74)" fill={inkColor}>
          {/* Toe beans */}
          <ellipse cx="-12" cy="-12" rx="4.2" ry="5.6" transform="rotate(-18 -12 -12)" />
          <ellipse cx="-3.5" cy="-17" rx="4" ry="5.8" transform="rotate(-5 -3.5 -17)" />
          <ellipse cx="6" cy="-16.5" rx="4" ry="5.8" transform="rotate(8 6 -16.5)" />
          <ellipse cx="14" cy="-10" rx="4.2" ry="5.4" transform="rotate(22 14 -10)" />
          {/* Main paw pad */}
          <path d="M-13 2 C-14 -5, -7 -9, 0 -9 C7 -9, 14 -5, 13 2 C12 8, 7 10, 0 9 C-7 10, -12 8, -13 2 Z" />
        </g>

        {/* Tiny Carrot Accent + SAH ribbon text */}
        <g transform="translate(80, 99)">
          <rect
            x="-23"
            y="-7"
            width="46"
            height="14"
            rx="3"
            fill="none"
            stroke={inkColor}
            strokeWidth="1.2"
          />
          <text
            x="0"
            y="3.2"
            textAnchor="middle"
            fill={inkColor}
            fontSize="9.2"
            fontWeight="800"
            letterSpacing="2.4"
            fontFamily="system-ui, Arial, sans-serif"
          >
            SAH
          </text>
        </g>

        {/* Subtle ink distress speckles for authentic wet stamp feel */}
        <g fill={inkColor} opacity="0.28">
          <circle cx="34" cy="40" r="1.2" />
          <circle cx="122" cy="36" r="1" />
          <circle cx="131" cy="112" r="1.3" />
          <circle cx="42" cy="126" r="1.1" />
          <circle cx="96" cy="54" r="0.9" />
          <circle cx="60" cy="115" r="1" />
        </g>
      </svg>
    </div>
  );
}

/**
 * Genuine Live Scannable SVG QR Code powered by `qrcode`
 */
export function QrCodeSvg({ value, color = '#1E2923', bgColor = '#FFFFFF', size = 78 }) {
  const modules = useMemo(() => {
    try {
      const payload = (value || '').trim() || 'REPUBLIK PERKELINCIAN INDONESIA';
      const qr = QRCode.create(payload, { errorCorrectionLevel: 'M' });
      const count = qr.modules.size;
      const cells = [];
      for (let r = 0; r < count; r += 1) {
        for (let c = 0; c < count; c += 1) {
          const isDark =
            typeof qr.modules.get === 'function'
              ? qr.modules.get(r, c)
              : qr.modules.data[r * count + c];
          if (isDark) {
            cells.push({ r, c });
          }
        }
      }
      return { count, cells };
    } catch {
      return { count: 21, cells: [] };
    }
  }, [value]);

  const quietZone = 2;
  const viewSize = modules.count + quietZone * 2;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox={`0 0 ${viewSize} ${viewSize}`}
      shapeRendering="crispEdges"
      aria-label="QR Code Verifikasi Akta"
    >
      <rect x="0" y="0" width={viewSize} height={viewSize} fill={bgColor} />
      {modules.cells.map((cell) => (
        <rect
          key={`${cell.r}-${cell.c}`}
          x={cell.c + quietZone}
          y={cell.r + quietZone}
          width="1"
          height="1"
          fill={color}
        />
      ))}
    </svg>
  );
}

/**
 * Deterministic Official Document Barcode SVG derived from Registration Number
 */
export function BarcodeSvg({ code = '3173-BUN-2026-0001', color = '#1E2923' }) {
  const bars = useMemo(() => {
    const clean = (code || 'BUN-2026').replace(/\s+/g, '');
    const list = [
      { w: 2, gap: 1.5 },
      { w: 1, gap: 1.5 },
      { w: 3, gap: 2 },
    ];
    for (let i = 0; i < Math.min(clean.length, 22); i += 1) {
      const ch = clean.charCodeAt(i);
      const w1 = (ch % 3) + 1;
      const g1 = ((ch >> 2) % 2) + 1;
      const w2 = ((ch >> 4) % 2) + 1;
      const g2 = ((ch >> 1) % 3) + 1;
      list.push({ w: w1, gap: g1 });
      list.push({ w: w2, gap: g2 });
    }
    list.push({ w: 2, gap: 1.5 }, { w: 1, gap: 1 }, { w: 2.5, gap: 0 });

    let x = 0;
    return list.map((b, idx) => {
      const rect = { x, width: b.w, key: idx };
      x += b.w + b.gap;
      return rect;
    });
  }, [code]);

  const totalWidth = bars.length
    ? bars[bars.length - 1].x + bars[bars.length - 1].width
    : 120;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${totalWidth} 22`}
      className="w-[144px] h-[20px]"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {bars.map((b) => (
        <rect key={b.key} x={b.x} y="0" width={b.w} height="22" fill={color} />
      ))}
    </svg>
  );
}

/**
 * 3 Custom Minimalist SVG Placeholders for Empty Mini Gallery Slots
 */
export function GalleryPlaceholderSvg({ index = 0, theme }) {
  const stroke = theme.secondaryDark || theme.secondary;
  const soft = theme.accentLight || theme.secondary;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 180 120"
      className="w-full h-full"
      aria-hidden="true"
    >
      <rect width="180" height="120" fill={theme.photoBg} />
      <circle cx="90" cy="56" r="36" fill={theme.paperBg} fillOpacity="0.8" />

      {index === 0 && (
        <g transform="translate(90, 56)">
          {/* Carrot & Hay Bowl */}
          <path
            d="M-24 14 L24 14 L18 28 L-18 28 Z"
            fill={soft}
            fillOpacity="0.45"
            stroke={stroke}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M-12 10 Q-16 -12 4 -16 Q16 -10 10 10 Z"
            fill={theme.secondary}
            fillOpacity="0.5"
            stroke={stroke}
            strokeWidth="2"
          />
          <path
            d="M2 -16 Q-2 -26 -10 -24 M4 -16 Q8 -27 14 -22"
            fill="none"
            stroke={theme.primary}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
      )}

      {index === 1 && (
        <g transform="translate(90, 62)">
          {/* Sleeping Flopped Bunny */}
          <ellipse cx="0" cy="6" rx="26" ry="15" fill={soft} fillOpacity="0.45" stroke={stroke} strokeWidth="2" />
          <circle cx="-18" cy="0" r="12" fill={theme.paperBg} stroke={stroke} strokeWidth="2" />
          <ellipse cx="-26" cy="-12" rx="4" ry="11" transform="rotate(-35 -26 -12)" fill={theme.paperBg} stroke={stroke} strokeWidth="2" />
          <circle cx="28" cy="4" r="5" fill={theme.paperBg} stroke={stroke} strokeWidth="1.8" />
          <path d="M-22 -1 Q-19 2 -16 -1" fill="none" stroke={theme.primary} strokeWidth="1.8" strokeLinecap="round" />
          <text x="12" y="-16" fill={stroke} fontSize="11" fontWeight="700" fontFamily="system-ui, sans-serif">
            z z
          </text>
        </g>
      )}

      {index === 2 && (
        <g transform="translate(90, 58)">
          {/* Happy Binky Jumping Bunny */}
          <ellipse cx="0" cy="24" rx="22" ry="4" fill={stroke} fillOpacity="0.18" />
          <g transform="translate(0, -4) rotate(-10)">
            <ellipse cx="0" cy="6" rx="18" ry="12" fill={soft} fillOpacity="0.5" stroke={stroke} strokeWidth="2" />
            <circle cx="14" cy="-6" r="10" fill={theme.paperBg} stroke={stroke} strokeWidth="2" />
            <ellipse cx="10" cy="-21" rx="3.5" ry="9" transform="rotate(-12 10 -21)" fill={theme.paperBg} stroke={stroke} strokeWidth="1.8" />
            <ellipse cx="18" cy="-20" rx="3.5" ry="9" transform="rotate(14 18 -20)" fill={theme.paperBg} stroke={stroke} strokeWidth="1.8" />
            <circle cx="-19" cy="4" r="4.5" fill={theme.paperBg} stroke={stroke} strokeWidth="1.8" />
          </g>
        </g>
      )}
    </svg>
  );
}
