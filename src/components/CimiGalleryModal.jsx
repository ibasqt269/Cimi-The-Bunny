import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Calendar,
  Camera,
  ChevronLeft,
  ChevronRight,
  FolderOpen,
  ImagePlus,
  Layers,
  LayoutGrid,
  Loader2,
  Plus,
  Trash2,
  Upload,
  X,
  ZoomIn,
} from 'lucide-react';
import { CIMI_ALBUMS } from '../data/cimiPhotos.js';
import { optimizePhotoToBlob } from '../utils/cimiDb.js';
import PolaroidTableCanvas from './PolaroidTableCanvas.jsx';

function getTodayLabel() {
  try {
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date());
  } catch {
    return '2026';
  }
}

function captionFromFileName(name) {
  const clean = name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ').trim();
  if (!clean) return 'Momen Cimi';
  return clean.replace(/\b\w/g, (ch) => ch.toUpperCase());
}

export default function CimiGalleryModal({
  isOpen,
  initialAlbum = 'all',
  photos = [],
  theme,
  isAdmin = false,
  isCloudMode = false,
  onClose,
  onAddPhotos,
  onDeletePhoto,
}) {
  const [activeAlbum, setActiveAlbum] = useState(initialAlbum || 'all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'polaroid'
  const [uploadPanelOpen, setUploadPanelOpen] = useState(false);
  const [uploadAlbum, setUploadAlbum] = useState('baby-cimi');
  const [uploadCaption, setUploadCaption] = useState('');
  const [uploadDate, setUploadDate] = useState(() => getTodayLabel());
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [lightboxIdx, setLightboxIdx] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setActiveAlbum(initialAlbum || 'all');
      if (initialAlbum && initialAlbum !== 'all') {
        setUploadAlbum(initialAlbum);
      }
      if (!isAdmin) {
        setUploadPanelOpen(false);
      }
      setLightboxIdx(null);
      setUploadStatus('');
      setConfirmDeleteId(null);
    }
  }, [isOpen, initialAlbum, isAdmin]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (!isOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  const albumMap = useMemo(() => {
    const map = {};
    CIMI_ALBUMS.forEach((a) => {
      map[a.id] = a;
    });
    return map;
  }, []);

  const countsByAlbum = useMemo(() => {
    const counts = { all: photos.length };
    CIMI_ALBUMS.forEach((a) => {
      counts[a.id] = 0;
    });
    photos.forEach((p) => {
      if (counts[p.album] !== undefined) counts[p.album] += 1;
    });
    return counts;
  }, [photos]);

  const filteredPhotos = useMemo(() => {
    if (activeAlbum === 'all') return photos;
    return photos.filter((p) => p.album === activeAlbum);
  }, [photos, activeAlbum]);

  const navigateLightbox = useCallback(
    (delta) => {
      setLightboxIdx((prev) => {
        if (prev === null || filteredPhotos.length <= 1) return prev;
        return (prev + delta + filteredPhotos.length) % filteredPhotos.length;
      });
    },
    [filteredPhotos.length]
  );

  // Layered keyboard handler: Esc closes Lightbox first, then Modal
  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKey = (e) => {
      if (lightboxIdx !== null) {
        if (e.key === 'Escape') {
          e.stopPropagation();
          setLightboxIdx(null);
        } else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          navigateLightbox(-1);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          navigateLightbox(1);
        }
        return;
      }

      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, lightboxIdx, navigateLightbox, onClose]);

  const processUploadFiles = async (fileList) => {
    const files = Array.from(fileList || []).filter((f) => f.type.startsWith('image/'));
    if (files.length === 0) {
      setUploadStatus('Pilih minimal 1 file gambar (JPG, PNG, WebP, GIF).');
      return;
    }

    setIsProcessing(true);
    setUploadStatus('');
    try {
      const now = Date.now();
      const processed = await Promise.all(
        files.map(async (file, idx) => {
          const { blob, format } = await optimizePhotoToBlob(file);
          const fallbackCaption = captionFromFileName(file.name);
          const finalCaption = uploadCaption.trim()
            ? files.length > 1
              ? `${uploadCaption.trim()} (${idx + 1})`
              : uploadCaption.trim()
            : fallbackCaption;

          return {
            id: `cimi-idb-${now}-${idx}-${Math.random().toString(36).slice(2, 7)}`,
            blob,
            album: uploadAlbum,
            caption: finalCaption,
            date: uploadDate.trim() || getTodayLabel(),
            format,
            createdAt: now + (files.length - idx),
          };
        })
      );

      await onAddPhotos(processed);
      setUploadCaption('');
      setUploadPanelOpen(false);
      if (activeAlbum !== 'all' && activeAlbum !== uploadAlbum) {
        setActiveAlbum(uploadAlbum);
      }
      setUploadStatus(`${processed.length} foto berhasil ditambahkan ke galeri Cimi!`);
    } catch (err) {
      setUploadStatus(err?.message || 'Sebagian foto gagal diproses.');
    } finally {
      setIsProcessing(false);
    }
  };

  const tabs = [
    { id: 'all', label: 'Semua Foto' },
    ...CIMI_ALBUMS.map((a) => ({ id: a.id, label: a.label })),
  ];

  const activeLightboxPhoto =
    lightboxIdx !== null ? filteredPhotos[lightboxIdx] || null : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="cimi-gallery-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="no-print fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-md flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Galeri Foto Cimi's Memories"
        >
          <motion.div
            initial={{ y: 24, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            className="relative flex-1 w-full max-w-[1280px] mx-auto my-0 sm:my-5 bg-[#FAF8F5] sm:rounded-2xl shadow-2xl border border-white/20 flex flex-col overflow-hidden"
          >
            {/* Modal Top Header */}
            <header className="px-4 sm:px-6 py-4 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700 shrink-0">
                  <FolderOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="font-caveat text-3xl font-bold leading-none text-slate-900">
                      Cimi&apos;s Memories
                    </h2>
                    <span className="font-mono text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                      {photos.length} foto
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isCloudMode
                      ? 'Koleksi kenangan Cimi tersinkron secara real-time di Supabase Cloud'
                      : 'Koleksi kenangan kelinci tersimpan rapi di galeri Cimi'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => setUploadPanelOpen((v) => !v)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-white shadow-sm hover:opacity-95 transition-all active:scale-[0.98]"
                    style={{ backgroundColor: theme?.primary || '#1B4332' }}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Foto Cimi</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
                  aria-label="Tutup galeri Cimi"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </header>

            {/* Filter Tab Album + View Mode Switcher (Grid vs Meja Polaroid) */}
            <div className="px-4 sm:px-6 py-2.5 bg-white/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2 overflow-x-auto pb-0.5 sm:pb-0">
                {tabs.map((tab) => {
                  const active = activeAlbum === tab.id;
                  const count = countsByAlbum[tab.id] ?? 0;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        setActiveAlbum(tab.id);
                        if (tab.id !== 'all') setUploadAlbum(tab.id);
                      }}
                      className={`relative px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                        active ? 'text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="cimi-tab-pill"
                          transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                          className="absolute inset-0 rounded-full"
                          style={{ backgroundColor: theme?.primary || '#1B4332' }}
                        />
                      )}
                      <span className="relative z-10">{tab.label}</span>
                      <span
                        className={`relative z-10 font-mono text-[10px] px-1.5 py-0.5 rounded-full ${
                          active ? 'bg-white/20 text-white' : 'bg-slate-200/80 text-slate-700'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Grid vs Meja Polaroid Switcher */}
              <div
                className="flex items-center gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200 shrink-0"
                role="group"
                aria-label="Pilih mode tampilan galeri"
              >
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Grid</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('polaroid')}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    viewMode === 'polaroid'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Meja Polaroid</span>
                </button>
              </div>
            </div>

            {/* Collapsible Multi-Upload Panel (Mode Pawrent Only) */}
            <AnimatePresence initial={false}>
              {isAdmin && uploadPanelOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22 }}
                  className="overflow-hidden border-b border-slate-200 bg-amber-50/70 shrink-0"
                >
                  <div className="px-4 sm:px-6 py-4 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        {isCloudMode
                          ? 'Unggah Banyak Foto Cimi (Tersimpan di Supabase Storage & Database)'
                          : 'Unggah Banyak Foto Cimi (Tersimpan Otomatis di IndexedDB)'}
                      </p>
                      <button
                        type="button"
                        onClick={() => setUploadPanelOpen(false)}
                        className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                      >
                        Tutup Form
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Pilih Album
                        </label>
                        <div className="grid grid-cols-2 gap-1.5">
                          {CIMI_ALBUMS.map((alb) => {
                            const selected = uploadAlbum === alb.id;
                            return (
                              <button
                                key={alb.id}
                                type="button"
                                onClick={() => setUploadAlbum(alb.id)}
                                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all text-left truncate ${
                                  selected
                                    ? 'text-white border-transparent shadow-sm'
                                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                                }`}
                                style={
                                  selected
                                    ? { backgroundColor: theme?.primary || '#1B4332' }
                                    : undefined
                                }
                              >
                                {alb.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Caption Opsional
                        </label>
                        <input
                          type="text"
                          value={uploadCaption}
                          onChange={(e) => setUploadCaption(e.target.value)}
                          placeholder="Kosongkan untuk pakai nama file..."
                          className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-300 bg-white focus:border-slate-500 outline-none"
                        />
                        <label className="block text-xs font-semibold text-slate-700 mt-2 mb-1">
                          Tanggal (Opsional)
                        </label>
                        <input
                          type="text"
                          value={uploadDate}
                          onChange={(e) => setUploadDate(e.target.value)}
                          placeholder="Misal: 23 Nov 2026"
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:border-slate-500 outline-none"
                        />
                      </div>

                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDragging(false);
                          processUploadFiles(e.dataTransfer.files);
                        }}
                        className={`rounded-xl border-2 border-dashed p-3 flex flex-col items-center justify-center text-center transition-colors ${
                          isDragging
                            ? 'border-amber-500 bg-amber-100/70'
                            : 'border-slate-300 bg-white/80'
                        }`}
                      >
                        <label className="cursor-pointer flex flex-col items-center gap-1.5 w-full">
                          {isProcessing ? (
                            <Loader2 className="w-6 h-6 animate-spin text-slate-700" />
                          ) : (
                            <Upload className="w-6 h-6 text-slate-600" />
                          )}
                          <span className="text-xs font-bold text-slate-800">
                            {isProcessing
                              ? 'Menyimpan foto...'
                              : 'Klik atau Tarik Banyak Foto'}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            Mendukung multi-upload JPG, PNG, WebP, GIF
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            disabled={isProcessing}
                            className="hidden"
                            onChange={(e) => {
                              processUploadFiles(e.target.files);
                              e.target.value = '';
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Upload Feedback Banner */}
            {uploadStatus && (
              <div className="px-4 sm:px-6 py-2 bg-emerald-50 border-b border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center justify-between shrink-0">
                <span>{uploadStatus}</span>
                <button
                  type="button"
                  onClick={() => setUploadStatus('')}
                  className="text-emerald-700 hover:text-emerald-950"
                >
                  Tutup
                </button>
              </div>
            )}

            {/* Masonry Grid Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {filteredPhotos.length === 0 ? (
                <div className="h-full min-h-[280px] flex flex-col items-center justify-center text-center px-4">
                  <div className="w-16 h-16 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 mb-3">
                    <Camera className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-bold text-slate-800">
                    Belum ada foto di album ini
                  </h3>
                  {isAdmin ? (
                    <>
                      <p className="text-xs sm:text-sm text-slate-500 max-w-md mt-1">
                        Klik <strong>+ Tambah Foto Cimi</strong> untuk mengunggah banyak foto langsung
                        {isCloudMode ? ' ke Supabase Cloud.' : '.'}
                      </p>
                      <button
                        type="button"
                        onClick={() => setUploadPanelOpen(true)}
                        className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm"
                        style={{ backgroundColor: theme?.primary || '#1B4332' }}
                      >
                        <ImagePlus className="w-4 h-4" />
                        Tambah Foto ke Album Ini
                      </button>
                    </>
                  ) : (
                    <p className="text-xs sm:text-sm text-slate-500 max-w-md mt-1">
                      Nantikan koleksi foto terbaru dari Pawrent Cimi di album ini ya!
                    </p>
                  )}
                </div>
              ) : viewMode === 'polaroid' ? (
                <PolaroidTableCanvas
                  photos={filteredPhotos}
                  albumMap={albumMap}
                  onOpenLightbox={(idx) => setLightboxIdx(idx)}
                />
              ) : (
                <div className="columns-2 sm:columns-3 lg:columns-4 gap-4">
                  {filteredPhotos.map((photo, idx) => {
                    const alb = albumMap[photo.album] || CIMI_ALBUMS[0];
                    const canDelete =
                      isAdmin && (photo.source === 'supabase' || photo.source === 'indexeddb');
                    const isConfirming = confirmDeleteId === photo.id;

                    return (
                      <motion.article
                        key={photo.id}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.22 }}
                        className="break-inside-avoid mb-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
                      >
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => setLightboxIdx(idx)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setLightboxIdx(idx);
                            }
                          }}
                          className="relative w-full overflow-hidden bg-slate-100 cursor-zoom-in"
                        >
                          <img
                            src={photo.src}
                            alt={photo.caption || 'Foto Cimi'}
                            className="w-full h-auto block object-cover group-hover:scale-[1.03] transition-transform duration-300"
                            loading="lazy"
                          />

                          {/* Album Badge Top-Left */}
                          <span
                            className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-sm border border-white/80"
                            style={{ backgroundColor: alb.pillBg, color: '#1E293B' }}
                          >
                            {alb.label}
                          </span>

                          {/* Format Badge Top-Right */}
                          {photo.format && (
                            <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-slate-900/65 text-white font-mono text-[9.5px] font-semibold backdrop-blur-sm">
                              {photo.format}
                            </span>
                          )}

                          {/* Hover Zoom Overlay */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center pointer-events-none">
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/95 text-slate-900 text-[11px] font-semibold shadow">
                              <ZoomIn className="w-3.5 h-3.5" />
                              Preview
                            </span>
                          </div>
                        </div>

                        <div className="p-3">
                          <p className="text-xs sm:text-[13px] font-semibold text-slate-800 leading-snug">
                            {photo.caption || 'Momen Cimi'}
                          </p>

                          <div className="mt-2 flex items-center justify-between gap-2">
                            {photo.date ? (
                              <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                                <Calendar className="w-3 h-3" />
                                {photo.date}
                              </span>
                            ) : (
                              <span />
                            )}

                            {canDelete && (
                              <div className="flex items-center gap-1">
                                {!isConfirming ? (
                                  <button
                                    type="button"
                                    onClick={() => setConfirmDeleteId(photo.id)}
                                    className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                    title="Hapus foto ini"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                ) : (
                                  <div className="flex items-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        onDeletePhoto(photo);
                                        setConfirmDeleteId(null);
                                      }}
                                      className="px-2 py-0.5 rounded bg-red-600 text-white text-[10px] font-bold"
                                    >
                                      Hapus
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setConfirmDeleteId(null)}
                                      className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-700 text-[10px] font-semibold"
                                    >
                                      Batal
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.article>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>

          {/* Fullscreen Lightbox Preview inside Modal */}
          <AnimatePresence>
            {activeLightboxPhoto && (
              <motion.div
                key="cimi-lightbox"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setLightboxIdx(null)}
                className="fixed inset-0 z-[60] bg-slate-950/92 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
                role="dialog"
                aria-modal="true"
                aria-label="Preview Foto Ukuran Penuh"
              >
                <button
                  type="button"
                  onClick={() => setLightboxIdx(null)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors"
                  aria-label="Tutup lightbox"
                >
                  <X className="w-5 h-5" />
                </button>

                {filteredPhotos.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateLightbox(-1);
                    }}
                    className="absolute left-3 sm:left-6 w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors"
                    aria-label="Foto sebelumnya"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                )}

                <motion.div
                  key={activeLightboxPhoto.id}
                  initial={{ scale: 0.94, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative max-w-4xl max-h-[90vh] flex flex-col items-center"
                >
                  <div className="p-2 bg-white rounded-xl shadow-2xl">
                    <img
                      src={activeLightboxPhoto.src}
                      alt={activeLightboxPhoto.caption || 'Foto Cimi'}
                      className="max-h-[75vh] max-w-[86vw] object-contain rounded-lg"
                    />
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-center">
                    <span
                      className="px-2.5 py-1 rounded-full text-xs font-bold"
                      style={{
                        backgroundColor:
                          albumMap[activeLightboxPhoto.album]?.pillBg || '#FEF3C7',
                        color: '#1E293B',
                      }}
                    >
                      {albumMap[activeLightboxPhoto.album]?.label || 'Baby Cimi'}
                    </span>
                    <span className="px-3.5 py-1 rounded-full bg-white/15 text-white text-xs sm:text-sm font-medium">
                      {activeLightboxPhoto.caption}
                    </span>
                    {activeLightboxPhoto.date && (
                      <span className="px-2.5 py-1 rounded-full bg-white/10 text-slate-200 font-mono text-xs">
                        {activeLightboxPhoto.date}
                      </span>
                    )}
                    <span className="px-2.5 py-1 rounded-full bg-white/10 text-slate-300 font-mono text-xs">
                      {lightboxIdx + 1} / {filteredPhotos.length}
                    </span>
                  </div>
                </motion.div>

                {filteredPhotos.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateLightbox(1);
                    }}
                    className="absolute right-3 sm:right-6 w-11 h-11 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors"
                    aria-label="Foto berikutnya"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
