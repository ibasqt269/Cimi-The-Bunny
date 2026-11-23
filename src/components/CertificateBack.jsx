import React from 'react';
import {
  Camera,
  Carrot,
  Heart,
  ImagePlus,
  Sparkles,
  Zap,
  ZoomIn,
} from 'lucide-react';
import CertificateFrame from './CertificateFrame.jsx';
import { GalleryPlaceholderSvg } from './CertificateArt.jsx';
import { CustomStampsLayer } from './FunStamps.jsx';

function getStatDescriptor(key, value) {
  if (key === 'gemoy') {
    if (value >= 90) return 'Super Gembul';
    if (value >= 70) return 'Gemas Maksimal';
    if (value >= 40) return 'Imut Alami';
    return 'Ramping Elegan';
  }
  if (key === 'nakal') {
    if (value >= 85) return 'Siaga Kabel!';
    if (value >= 60) return 'Inspektur Kabel';
    if (value >= 35) return 'Usil Ringan';
    return 'Anak Baik';
  }
  if (key === 'rakus') {
    if (value >= 85) return 'Penyedot Hay';
    if (value >= 60) return 'Pemburu Camilan';
    if (value >= 35) return 'Lahap Terjaga';
    return 'Makan Anggun';
  }
  if (value >= 85) return 'Nempel 24/7';
  if (value >= 60) return 'Wajib Elus';
  if (value >= 35) return 'Manja Terukur';
  return 'Mandiri Cool';
}

export default function CertificateBack({
  data,
  theme,
  isExport = false,
  isAdmin = false,
  onGalleryClick,
  onOpenGalleryEdit,
  customStamps = [],
  latestStampId = null,
  stampMode = false,
  onPlaceStamp,
}) {
  const statsList = [
    {
      key: 'gemoy',
      label: 'Level Gemoy',
      value: data.stats?.gemoy ?? 98,
      color: theme.barColors[0],
      icon: Sparkles,
    },
    {
      key: 'nakal',
      label: 'Level Nakal (Gigit Kabel)',
      value: data.stats?.nakal ?? 68,
      color: theme.barColors[1],
      icon: Zap,
    },
    {
      key: 'rakus',
      label: 'Level Rakus',
      value: data.stats?.rakus ?? 88,
      color: theme.barColors[2],
      icon: Carrot,
    },
    {
      key: 'manja',
      label: 'Level Manja',
      value: data.stats?.manja ?? 94,
      color: theme.barColors[3],
      icon: Heart,
    },
  ];

  const bioCards = [
    {
      title: 'Makanan Favorit',
      value: data.favoriteFood,
      icon: Carrot,
    },
    {
      title: 'Hobi & Kebiasaan Unik',
      value: data.habits,
      icon: Sparkles,
    },
    {
      title: 'Status Adopsi',
      value: data.adoptionStatus,
      icon: Heart,
    },
  ];

  const gallerySlots = Array.isArray(data.gallery) ? data.gallery.slice(0, 3) : [];

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
      {/* Back Header */}
      <header
        className="pb-2.5 border-b flex items-center justify-between gap-4"
        style={{ borderColor: theme.divider }}
      >
        <div>
          <p
            className="font-mono text-[10px] font-semibold tracking-[0.22em] uppercase"
            style={{ color: theme.secondaryDark || theme.secondary }}
          >
            HALAMAN BELAKANG • ARSIP KEPRIBADIAN
          </p>
          <h2
            className="font-display text-[21px] font-bold tracking-[0.09em] uppercase leading-tight mt-0.5"
            style={{ color: theme.primary }}
          >
            LAMPIRAN BIODATA, STATISTIK &amp; GALERI KELINCI
          </h2>
        </div>

        <div className="text-right shrink-0">
          <div
            className="inline-flex items-center px-3.5 py-1 rounded-full border font-mono text-[11px] font-semibold"
            style={{
              backgroundColor: theme.badgeBg,
              borderColor: theme.divider,
              color: theme.primary,
            }}
          >
            {data.registrationNo || 'No. 3173-BUN-2026-0001'}
          </div>
          <p
            className="mt-1 font-serif italic text-[11.5px]"
            style={{ color: theme.textMuted }}
          >
            Atas nama: <strong style={{ color: theme.primary }}>{data.fullName || 'Kelinci'}</strong>
          </p>
        </div>
      </header>

      {/* Upper 2 Columns: Biodata & Fun Facts + Cute Stats */}
      <section className="grid grid-cols-12 gap-6 mt-3.5">
        {/* Left: Biodata & Fun Facts */}
        <div
          className="col-span-6 rounded-sm border p-3.5 flex flex-col justify-between"
          style={{
            backgroundColor: theme.paperInner,
            borderColor: theme.divider,
          }}
        >
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3
                className="font-display text-[13px] font-bold tracking-[0.12em] uppercase"
                style={{ color: theme.primary }}
              >
                Biodata &amp; Fun Facts
              </h3>
              <span
                className="font-mono text-[9.5px] tracking-[0.12em] uppercase px-2 py-0.5 rounded"
                style={{ backgroundColor: theme.badgeBg, color: theme.labelColor }}
              >
                CATATAN PAWRENT
              </span>
            </div>

            <div className="space-y-2.5">
              {bioCards.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="flex items-start gap-2.5 p-2 rounded-sm border"
                    style={{
                      backgroundColor: theme.paperBg,
                      borderColor: theme.divider,
                    }}
                  >
                    <div
                      className="w-7 h-7 rounded-sm flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: theme.badgeBg, color: theme.primary }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p
                        className="font-mono text-[10px] font-bold tracking-[0.06em] uppercase"
                        style={{ color: theme.labelColor }}
                      >
                        {item.title}
                      </p>
                      <p
                        className="text-[12.5px] leading-snug mt-0.5"
                        style={{ color: theme.textMain }}
                      >
                        {item.value || '—'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <p
            className="mt-2.5 pt-2 border-t border-dotted font-serif italic text-[11px] leading-snug"
            style={{ borderColor: theme.divider, color: theme.textMuted }}
          >
            “{data.officerNote || 'Berhak penuh atas elusan kepala dan camilan rutin.'}”
          </p>
        </div>

        {/* Right: Statistik Lucu */}
        <div
          className="col-span-6 rounded-sm border p-3.5 flex flex-col justify-between"
          style={{
            backgroundColor: theme.paperInner,
            borderColor: theme.divider,
          }}
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3
                className="font-display text-[13px] font-bold tracking-[0.12em] uppercase"
                style={{ color: theme.primary }}
              >
                Indeks Perilaku Resmi
              </h3>
              <span
                className="font-mono text-[9.5px] tracking-[0.12em] uppercase px-2 py-0.5 rounded"
                style={{ backgroundColor: theme.badgeBg, color: theme.labelColor }}
              >
                SKALA 0–100%
              </span>
            </div>

            <div className="space-y-3.5">
              {statsList.map((stat) => {
                const Icon = stat.icon;
                const pct = Math.max(0, Math.min(100, Number(stat.value) || 0));
                return (
                  <div key={stat.key}>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: stat.color }} />
                        <span
                          className="text-[12.5px] font-semibold truncate"
                          style={{ color: theme.textMain }}
                        >
                          {stat.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className="font-mono text-[9.5px] px-1.5 py-0.5 rounded"
                          style={{ backgroundColor: theme.badgeBg, color: theme.labelColor }}
                        >
                          {getStatDescriptor(stat.key, pct)}
                        </span>
                        <span
                          className="font-mono text-[12px] font-bold w-10 text-right"
                          style={{ color: stat.color }}
                        >
                          {pct}%
                        </span>
                      </div>
                    </div>

                    <div
                      className="w-full h-3 rounded-full overflow-hidden border"
                      style={{
                        backgroundColor: theme.barTrack,
                        borderColor: theme.divider,
                      }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: stat.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            className="mt-3 pt-2 border-t border-dotted flex items-center justify-between font-mono text-[9.5px]"
            style={{ borderColor: theme.divider, color: theme.textMuted }}
          >
            <span>EVALUASI BERKALA DINAS PERKELINCIAN</span>
            <span className="font-semibold" style={{ color: theme.primary }}>
              VERIFIED GEMOY
            </span>
          </div>
        </div>
      </section>

      {/* Lower Section: Mini Galeri (3 Slot Foto) */}
      <section className="flex-1 flex flex-col justify-end mt-3.5 min-h-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4" style={{ color: theme.primary }} />
            <h3
              className="font-display text-[13px] font-bold tracking-[0.12em] uppercase"
              style={{ color: theme.primary }}
            >
              Arsip Dokumentasi Mini Galeri
            </h3>
          </div>
          {!isExport && isAdmin && (
            <button
              type="button"
              onClick={onOpenGalleryEdit}
              className="no-print print:hidden font-mono text-[10px] font-semibold underline-offset-2 hover:underline flex items-center gap-1"
              style={{ color: theme.secondaryDark || theme.primary }}
            >
              <ImagePlus className="w-3.5 h-3.5" />
              Kelola Foto Galeri
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-5">
          {gallerySlots.map((slot, idx) => {
            const hasImage = Boolean(slot.image);
            const canInteract = !isExport && (hasImage || isAdmin);
            return (
              <div
                key={slot.id || idx}
                className="rounded-sm border p-1.5 flex flex-col"
                style={{
                  backgroundColor: theme.paperInner,
                  borderColor: theme.borderInner,
                }}
              >
                <button
                  type="button"
                  disabled={!canInteract}
                  onClick={() => {
                    if (hasImage) {
                      onGalleryClick?.(idx);
                    } else if (isAdmin) {
                      onOpenGalleryEdit?.();
                    }
                  }}
                  className={`group relative w-full h-[168px] overflow-hidden border ${
                    canInteract ? 'cursor-pointer' : 'cursor-default'
                  }`}
                  style={{
                    backgroundColor: theme.photoBg,
                    borderColor: theme.divider,
                  }}
                  title={
                    hasImage
                      ? 'Klik untuk membuka full-screen lightbox'
                      : isAdmin
                      ? 'Klik untuk unggah foto galeri'
                      : undefined
                  }
                >
                  {hasImage ? (
                    <img
                      src={slot.image}
                      alt={slot.caption || `Foto galeri ${idx + 1}`}
                      crossOrigin={/^https?:\/\//i.test(slot.image) ? 'anonymous' : undefined}
                      className="w-full h-full object-cover object-center"
                    />
                  ) : (
                    <GalleryPlaceholderSvg index={idx} theme={theme} />
                  )}

                  {canInteract && (
                    <div className="no-print print:hidden absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 text-slate-900 text-[10.5px] font-semibold shadow">
                        {hasImage ? (
                          <>
                            <ZoomIn className="w-3.5 h-3.5" />
                            Lihat Foto
                          </>
                        ) : (
                          <>
                            <ImagePlus className="w-3.5 h-3.5" />
                            Unggah Slot {idx + 1}
                          </>
                        )}
                      </span>
                    </div>
                  )}
                </button>

                <div className="pt-1.5 px-1 flex items-center justify-between gap-2">
                  <span
                    className="font-mono text-[9px] font-bold uppercase shrink-0"
                    style={{ color: theme.secondaryDark || theme.secondary }}
                  >
                    FOTO 0{idx + 1}
                  </span>
                  <span
                    className="text-[11px] font-medium truncate"
                    style={{ color: theme.textMain }}
                  >
                    {slot.caption || `Dokumentasi ${idx + 1}`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Back Footer */}
      <footer
        className="mt-2.5 pt-2 border-t flex items-center justify-between font-mono text-[9px] tracking-[0.14em] uppercase"
        style={{ borderColor: theme.divider, color: theme.textMuted }}
      >
        <span>HALAMAN 2 DARI 2 • REPUBLIK PERKELINCIAN INDONESIA</span>
        <span>DOKUMEN INI SAH SEBAGAI BUKTI KEIMUTAN RESMI</span>
      </footer>
    </CertificateFrame>
  );
}
