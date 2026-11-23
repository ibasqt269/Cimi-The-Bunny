import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn } from 'lucide-react';
import CertificateFrame from './CertificateFrame.jsx';
import {
  BarcodeSvg,
  DefaultRabbitIllustration,
  OfficialRabbitEmblem,
  QrCodeSvg,
  WetStampSvg,
} from './CertificateArt.jsx';
import { CustomStampsLayer } from './FunStamps.jsx';
import { DEFAULT_PHOTO_PATH } from '../data/defaultData.js';

const PET_PHRASES = [
  'Cimi kedut-kedut senang~',
  'Nyaman banget, jangan berhenti!',
  'Binky mode ON! ✨',
  'Gigi Cimi gemeretak happy~',
  'Elus terus di belakang telinga!',
];

const FEED_PHRASES = {
  carrot: [
    'Kres kres... kurang banyak!',
    'Wortelnya manis banget! 🥕',
    'Nyam nyam, nambah dong Pawrent!',
  ],
  hay: [
    'Kres kres... Timothy Hay terenak!',
    'Kunyah terus biar gemoy~ 🌿',
    'Nyam nyam! Masih kurang nih!',
  ],
};

export default function CertificateFront({
  data,
  theme,
  stampInkColor,
  stampKey = 0,
  isExport = false,
  onPhotoClick,
  customStamps = [],
  latestStampId = null,
  stampMode = false,
  onPlaceStamp,
  petEvent = null,
  feedEvent = null,
  onPet,
  onFeed,
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const [particles, setParticles] = useState([]);
  const [speech, setSpeech] = useState(null);
  const [petBounceKey, setPetBounceKey] = useState(0);
  const [feedMunchKey, setFeedMunchKey] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);

  const photoBoxRef = useRef(null);
  const lastRubRef = useRef({ time: 0, x: 0, y: 0 });
  const speechTimerRef = useRef(null);

  useEffect(() => {
    setImgFailed(false);
  }, [data.photo]);

  useEffect(
    () => () => {
      if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
    },
    []
  );

  const showBubble = useCallback((text) => {
    setSpeech({ id: Date.now(), text });
    if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
    speechTimerRef.current = setTimeout(() => setSpeech(null), 1900);
  }, []);

  const spawnBurst = useCallback((x, y, kinds) => {
    const now = Date.now();
    const created = kinds.map((kind, i) => ({
      id: `${now}-${i}-${Math.random().toString(36).slice(2, 6)}`,
      x: x + (Math.random() - 0.5) * 34,
      y: y + (Math.random() - 0.5) * 20,
      dx: (Math.random() - 0.5) * 38,
      dy: -38 - Math.random() * 28,
      kind,
    }));

    setParticles((prev) => [...prev.slice(-18), ...created]);
    setTimeout(() => {
      const ids = new Set(created.map((c) => c.id));
      setParticles((prev) => prev.filter((p) => !ids.has(p.id)));
    }, 850);
  }, []);

  // Trigger visual reaction when petEvent comes from PetCareDock
  useEffect(() => {
    if (!petEvent || isExport) return;
    setPetBounceKey((k) => k + 1);
    spawnBurst(105, 118, ['heart', 'star', 'heart']);
    showBubble(PET_PHRASES[Math.floor(Math.random() * PET_PHRASES.length)]);
  }, [petEvent, isExport, spawnBurst, showBubble]);

  // Trigger visual reaction when feedEvent comes from PetCareDock or drop
  useEffect(() => {
    if (!feedEvent || isExport) return;
    const food = feedEvent.food === 'hay' ? 'hay' : 'carrot';
    setFeedMunchKey((k) => k + 1);
    spawnBurst(105, 165, [food, food, 'crumb', 'heart']);
    const list = FEED_PHRASES[food];
    showBubble(list[Math.floor(Math.random() * list.length)]);
  }, [feedEvent, isExport, spawnBurst, showBubble]);

  const triggerLocalPet = (clientX, clientY) => {
    if (isExport || stampMode) return;
    const rect = photoBoxRef.current?.getBoundingClientRect();
    const lx = rect ? ((clientX - rect.left) / rect.width) * 210 : 105;
    const ly = rect ? ((clientY - rect.top) / rect.height) * 280 : 120;

    setPetBounceKey((k) => k + 1);
    spawnBurst(lx, ly, ['heart', 'star']);
    showBubble(PET_PHRASES[Math.floor(Math.random() * PET_PHRASES.length)]);
    onPet?.();
  };

  const handlePhotoPointerMove = (e) => {
    if (isExport || stampMode) return;
    const now = Date.now();
    const dx = e.clientX - lastRubRef.current.x;
    const dy = e.clientY - lastRubRef.current.y;
    const dist = Math.hypot(dx, dy);

    if (now - lastRubRef.current.time > 340 && dist > 20) {
      lastRubRef.current = { time: now, x: e.clientX, y: e.clientY };
      triggerLocalPet(e.clientX, e.clientY);
    }
  };

  const hasPhoto = Boolean(data.photo) && !imgFailed;
  const isDefaultPhoto = data.photo === DEFAULT_PHOTO_PATH;

  const detailRows = [
    { label: 'Nama Lengkap', value: data.fullName, bold: true },
    { label: 'Nama Panggilan', value: data.nickname },
    { label: 'Jenis / Ras', value: data.breed },
    { label: 'Jenis Kelamin', value: data.gender },
    { label: 'Tempat, Tanggal Lahir', value: data.birthPlaceDate },
    { label: 'Warna Bulu & Mata', value: data.coatEyeColor },
    { label: 'Ciri Khusus', value: data.specialMarks },
    { label: 'Nama Orang Tua (Pawrent)', value: data.pawrentName, bold: true },
  ];

  const stampOverlay = (
    <>
      <CustomStampsLayer
        stamps={customStamps}
        latestStampId={latestStampId}
        isExport={isExport}
      />
      {stampMode && !isExport && (
        <div
          onClick={onPlaceStamp}
          className="no-print print:hidden absolute inset-0 z-30 cursor-crosshair"
          aria-label="Klik di mana saja untuk menempelkan stempel"
        />
      )}
    </>
  );

  return (
    <CertificateFrame theme={theme} isExport={isExport} overlay={stampOverlay}>
      {/* Official Header */}
      <header className="flex flex-col items-center text-center">
        <div className="relative inline-flex items-center justify-center">
          {!isExport && (
            <div
              className="no-print print:hidden absolute -inset-2 rounded-full pointer-events-none"
              style={{
                opacity: 'calc(var(--foil-op, 0) * 0.85)',
                background:
                  'radial-gradient(circle, rgba(254, 240, 138, 0.55) 0%, transparent 70%)',
              }}
            />
          )}
          <OfficialRabbitEmblem theme={theme} className="relative z-10 w-[54px] h-[50px] -mt-1" />
        </div>

        <p
          className="mt-1 font-display text-[13px] font-bold tracking-[0.26em] uppercase"
          style={{ color: theme.primary }}
        >
          REPUBLIK PERKELINCIAN INDONESIA
        </p>
        <p
          className="mt-0.5 font-mono text-[10.5px] font-medium tracking-[0.18em] uppercase"
          style={{ color: theme.textMuted }}
        >
          DINAS KEPENDUDUKAN &amp; PENCATATAN KELINCI GEMOY
        </p>

        {/* Ornamental Divider */}
        <div className="w-[460px] flex items-center gap-3 my-1.5">
          <div className="flex-1 h-[1px]" style={{ backgroundColor: theme.divider }} />
          <span className="text-[10px]" style={{ color: theme.secondaryDark || theme.secondary }}>
            ◆
          </span>
          <div className="flex-1 h-[1px]" style={{ backgroundColor: theme.divider }} />
        </div>

        <h1
          className="font-display text-[27px] font-extrabold tracking-[0.14em] leading-none uppercase"
          style={{ color: theme.primary }}
        >
          KUTIPAN AKTA KELAHIRAN
        </h1>

        <div
          className="mt-2 inline-flex items-center gap-2 px-4 py-0.5 rounded-full border font-mono text-[12px] font-semibold tracking-[0.06em]"
          style={{
            backgroundColor: theme.badgeBg,
            borderColor: theme.divider,
            color: theme.primary,
          }}
        >
          <span>{data.registrationNo || 'No. 3173-BUN-2026-0001'}</span>
        </div>
      </header>

      {/* Main 2-Column Content */}
      <main className="flex-1 flex items-center gap-8 mt-3 min-h-0">
        {/* Left Column: 3:4 Classic Framed Pas Foto + Virtual Pet Interaction */}
        <div className="relative w-[244px] shrink-0 flex flex-col items-center">
          {/* Speech Bubble when petted/fed */}
          {!isExport && (
            <AnimatePresence>
              {speech && (
                <motion.div
                  key={speech.id}
                  initial={{ opacity: 0, y: 8, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.92 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 22 }}
                  className="no-print print:hidden absolute -top-9 left-1/2 -translate-x-1/2 z-30 whitespace-nowrap px-3 py-1 rounded-full bg-white text-slate-800 text-[11px] font-bold shadow-md border border-amber-200 pointer-events-none"
                >
                  {speech.text}
                </motion.div>
              )}
            </AnimatePresence>
          )}

          <motion.div
            key={`bounce-${petBounceKey}-${feedMunchKey}`}
            initial={false}
            animate={
              feedMunchKey > 0
                ? { scale: [1, 1.03, 0.98, 1.02, 1], rotate: [0, -1.6, 1.6, -1, 0] }
                : petBounceKey > 0
                ? { scale: [1, 1.045, 0.985, 1] }
                : { scale: 1, rotate: 0 }
            }
            transition={{ duration: 0.36 }}
            onDragOver={(e) => {
              if (isExport || stampMode) return;
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              if (isExport || stampMode) return;
              e.preventDefault();
              setIsDragOver(false);
              const food = e.dataTransfer.getData('text/plain');
              if (food === 'carrot' || food === 'hay') {
                onFeed?.(food);
              }
            }}
            onClick={(e) => {
              if (!isExport && !stampMode) {
                triggerLocalPet(e.clientX, e.clientY);
              }
            }}
            onPointerMove={handlePhotoPointerMove}
            className={`group relative p-[7px] rounded-sm border-2 transition-shadow ${
              !isExport && !stampMode ? 'cursor-pointer hover:shadow-lg' : 'cursor-default'
            } ${isDragOver ? 'ring-4 ring-orange-400/75' : ''}`}
            style={{
              backgroundColor: theme.paperInner,
              borderColor: theme.borderOuter,
              boxShadow: '0 6px 18px rgba(0, 0, 0, 0.08)',
            }}
            title={!isExport && !stampMode ? 'Klik atau usap foto untuk elus Cimi!' : undefined}
          >
            {/* Inner Gold / Accent Matting */}
            <div
              className="p-[4px] border"
              style={{ borderColor: theme.borderInner, backgroundColor: theme.paperBg }}
            >
              {/* Exact 3:4 Container (210 x 280) */}
              <div
                ref={photoBoxRef}
                className="relative w-[210px] h-[280px] overflow-hidden"
                style={{ backgroundColor: theme.photoBg }}
              >
                {hasPhoto ? (
                  <img
                    src={data.photo}
                    alt={`Pas foto ${data.fullName || 'Kelinci'}`}
                    crossOrigin={/^https?:\/\//i.test(data.photo) ? 'anonymous' : undefined}
                    onError={() => setImgFailed(true)}
                    draggable={false}
                    className={`w-full h-full object-cover ${
                      isDefaultPhoto ? 'object-[42%_54%]' : 'object-center'
                    }`}
                  />
                ) : (
                  <DefaultRabbitIllustration theme={theme} />
                )}

                {/* Drop Hint Overlay */}
                {!isExport && isDragOver && (
                  <div className="no-print print:hidden absolute inset-0 bg-amber-500/20 border-2 border-dashed border-amber-500 flex items-center justify-center pointer-events-none">
                    <span className="px-2.5 py-1 rounded-full bg-white/95 text-amber-800 text-[11px] font-bold shadow">
                      Lepas untuk suapin Cimi!
                    </span>
                  </div>
                )}

                {/* Floating Pet/Feed Particles */}
                {!isExport && (
                  <div className="no-print print:hidden absolute inset-0 pointer-events-none overflow-hidden">
                    {particles.map((pt) => (
                      <motion.span
                        key={pt.id}
                        initial={{ x: pt.x, y: pt.y, opacity: 1, scale: 0.6 }}
                        animate={{
                          x: pt.x + pt.dx,
                          y: pt.y + pt.dy,
                          opacity: 0,
                          scale: 1.2,
                        }}
                        transition={{ duration: 0.78, ease: 'easeOut' }}
                        className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2 text-base select-none"
                      >
                        {pt.kind === 'heart'
                          ? '💖'
                          : pt.kind === 'star'
                          ? '✨'
                          : pt.kind === 'carrot'
                          ? '🥕'
                          : pt.kind === 'hay'
                          ? '🌿'
                          : '✨'}
                      </motion.span>
                    ))}
                  </div>
                )}

                {/* Corner Zoom Lightbox Trigger (conflict-free with petting) */}
                {hasPhoto && !isExport && !stampMode && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onPhotoClick?.();
                    }}
                    className="no-print print:hidden absolute top-2 right-2 w-7 h-7 rounded-full bg-white/85 hover:bg-white text-slate-800 shadow flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity"
                    title="Perbesar Pas Foto"
                    aria-label="Perbesar Pas Foto"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                )}

                {!isExport && !stampMode && !isDragOver && (
                  <div className="no-print print:hidden absolute inset-x-0 bottom-1.5 flex justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="px-2.5 py-0.5 rounded-full bg-white/90 text-slate-800 text-[10px] font-bold shadow-sm">
                      Klik / usap untuk elus 💕
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <p
            className="mt-2 font-mono text-[9.5px] font-semibold tracking-[0.16em] uppercase"
            style={{ color: theme.textMuted }}
          >
            PAS FOTO RESMI • 3×4
          </p>
        </div>

        {/* Right Column: Formal Civil Registration Details */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <p
            className="font-serif italic text-[12.5px] mb-2.5 leading-snug"
            style={{ color: theme.textMuted }}
          >
            Berdasarkan catatan resmi Register Kelinci Gemoy, menerangkan bahwa telah lahir dan
            terdaftar dengan sah seekor kelinci dengan identitas sebagai berikut:
          </p>

          <div className="space-y-1.5">
            {detailRows.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-[206px_14px_1fr] items-baseline pb-1 border-b border-dotted"
                style={{ borderColor: theme.divider }}
              >
                <span
                  className="font-mono text-[11.5px] font-semibold tracking-[0.02em]"
                  style={{ color: theme.labelColor }}
                >
                  {row.label}
                </span>
                <span
                  className="font-mono text-[12px] font-bold text-center"
                  style={{ color: theme.labelColor }}
                >
                  :
                </span>
                <span
                  className={`text-[14px] leading-snug break-words ${
                    row.bold ? 'font-bold' : 'font-medium'
                  }`}
                  style={{ color: row.bold ? theme.primary : theme.textMain }}
                >
                  {row.value || '—'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer: QR Verification + Barcode & Signature + Wet Stamp */}
      <footer
        className="mt-2.5 pt-2.5 border-t flex items-end justify-between gap-6"
        style={{ borderColor: theme.divider }}
      >
        {/* Left: QR Code & Barcode */}
        <div className="flex items-end gap-3.5 max-w-[440px]">
          <div
            className="p-1.5 rounded-sm border shrink-0"
            style={{
              backgroundColor: '#FFFFFF',
              borderColor: theme.divider,
            }}
          >
            <QrCodeSvg value={data.qrText} color={theme.primary} bgColor="#FFFFFF" size={72} />
          </div>

          <div className="min-w-0 pb-0.5">
            <p
              className="font-mono text-[9.5px] font-bold tracking-[0.14em] uppercase"
              style={{ color: theme.primary }}
            >
              VERIFIKASI DOKUMEN DIGITAL
            </p>
            <p
              className="font-mono text-[9.5px] truncate max-w-[250px] mt-0.5 mb-1.5"
              style={{ color: theme.textMuted }}
            >
              {data.qrText || 'REPUBLIK PERKELINCIAN INDONESIA'}
            </p>
            <BarcodeSvg code={data.registrationNo} color={theme.primary} />
            <p
              className="font-mono text-[8.5px] tracking-[0.18em] mt-0.5"
              style={{ color: theme.textMuted }}
            >
              {(data.registrationNo || '3173-BUN-2026-0001').replace(/^No\.\s*/i, '')}
            </p>
          </div>
        </div>

        {/* Right: Issue Location, Signature & Overlapping Wet Stamp */}
        <div className="relative w-[360px] shrink-0 text-center flex flex-col items-center">
          <p className="text-[11.5px] font-medium" style={{ color: theme.textMain }}>
            Diterbitkan di{' '}
            <span className="font-semibold">{data.issueCity || 'Jakarta'}</span>,{' '}
            <span>{data.issueDate || '23 November 2026'}</span>
          </p>
          <p
            className="font-mono text-[10px] font-semibold tracking-[0.04em] mt-0.5"
            style={{ color: theme.labelColor }}
          >
            {data.officialTitle || 'Kepala Dinas Perkelincian / Pawrent'}
          </p>

          {/* Signature & Wet Stamp Overlap Zone */}
          <div className="relative w-full h-[64px] flex items-end justify-center mt-1">
            {data.showStamp && (
              <div className="absolute -left-2 -top-8 z-20">
                <WetStampSvg
                  inkColor={stampInkColor}
                  stampKey={stampKey}
                  isExport={isExport}
                />
              </div>
            )}

            <span
              className="relative z-10 font-handwriting text-[35px] leading-none pb-0.5 pl-10"
              style={{ color: theme.primary }}
            >
              {data.signatureName || 'Pawrent Kelinci'}
            </span>
          </div>

          <div
            className="w-[240px] h-[1.5px]"
            style={{ backgroundColor: theme.primary }}
          />
          <p
            className="mt-1 font-mono text-[8.5px] tracking-[0.16em] uppercase"
            style={{ color: theme.textMuted }}
          >
            PENGESAHAN SAH • ARSIP SIPIL KELINCI
          </p>
        </div>
      </footer>
    </CertificateFrame>
  );
}
