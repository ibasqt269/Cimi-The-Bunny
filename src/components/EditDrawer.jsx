import React, { useEffect, useState } from 'react';
import {
  Check,
  Cloud,
  Image as ImageIcon,
  Loader2,
  Palette,
  RotateCcw,
  Shuffle,
  Sliders,
  Sparkles,
  Stamp,
  Trash2,
  Upload,
  UserCheck,
  X,
} from 'lucide-react';
import {
  DEFAULT_PHOTO_PATH,
  generateRegistrationNo,
} from '../data/defaultData.js';
import { STAMP_INKS, THEME_LIST } from '../data/themes.js';
import { compressImageFile } from '../utils/imageHelper.js';

const TABS = [
  { id: 'main', label: 'Data Utama', icon: UserCheck },
  { id: 'back', label: 'Sisi Belakang', icon: Sliders },
  { id: 'photos', label: 'Foto & Galeri', icon: ImageIcon },
  { id: 'theme', label: 'Tema & Stempel', icon: Palette },
];

export default function EditDrawer({
  isOpen,
  initialTab = 'main',
  data,
  theme,
  isCloudMode = false,
  cloudSyncStatus = 'idle',
  onUploadCertImage,
  onChange,
  onReset,
  onClose,
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [confirmReset, setConfirmReset] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadingTarget, setUploadingTarget] = useState('');

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab || 'main');
      setConfirmReset(false);
      setUploadError('');
    }
  }, [isOpen, initialTab]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const updateField = (field, value) => {
    onChange((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateStat = (key, value) => {
    onChange((prev) => ({
      ...prev,
      stats: {
        ...prev.stats,
        [key]: Number(value),
      },
    }));
  };

  const updateGallerySlot = (idx, patch) => {
    onChange((prev) => ({
      ...prev,
      gallery: prev.gallery.map((slot, i) =>
        i === idx ? { ...slot, ...patch } : slot
      ),
    }));
  };

  const handlePhotoUpload = async (e, target) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setUploadError('');
    setUploadingTarget(target);
    try {
      const imageUrl =
        isCloudMode && onUploadCertImage
          ? await onUploadCertImage(file, target)
          : await compressImageFile(file, 960, 0.84);
      if (target === 'main') {
        updateField('photo', imageUrl);
      } else {
        const idx = Number(target.replace('slot-', ''));
        updateGallerySlot(idx, { image: imageUrl });
      }
    } catch (err) {
      setUploadError(err.message || 'Gagal memproses foto.');
    } finally {
      setUploadingTarget('');
    }
  };

  const statSliders = [
    { key: 'gemoy', label: 'Level Gemoy' },
    { key: 'nakal', label: 'Level Nakal (Tukang Gigit Kabel)' },
    { key: 'rakus', label: 'Level Rakus' },
    { key: 'manja', label: 'Level Manja' },
  ];

  return (
    <div className="no-print fixed inset-0 z-40 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/45 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-Over Panel */}
      <aside
        className="relative z-10 w-full max-w-[470px] h-full bg-white shadow-2xl border-l border-slate-200 flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-label="Edit Data Akta Kelinci"
      >
        {/* Drawer Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div>
            <h2 className="font-display text-base font-bold text-slate-900">
              Edit Data Akta Kelinci
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
              {isCloudMode ? (
                <>
                  {cloudSyncStatus === 'saving' ? (
                    <Loader2 className="w-3 h-3 animate-spin text-amber-600" />
                  ) : (
                    <Cloud className="w-3 h-3 text-emerald-600" />
                  )}
                  <span>
                    {cloudSyncStatus === 'saving'
                      ? 'Menyimpan ke Supabase Cloud...'
                      : cloudSyncStatus === 'error'
                      ? 'Gagal sinkronisasi ke cloud'
                      : 'Tersinkron otomatis ke Supabase Cloud'}
                  </span>
                </>
              ) : (
                <span>Perubahan langsung terlihat &amp; tersimpan otomatis.</span>
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-200/70 transition-colors"
            aria-label="Tutup panel edit"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-4 py-2.5 border-b border-slate-200 bg-white grid grid-cols-4 gap-1.5">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center gap-1 py-2 px-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                  active
                    ? 'text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
                style={active ? { backgroundColor: theme.primary } : undefined}
              >
                <Icon className="w-4 h-4" />
                <span className="truncate max-w-full">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {uploadError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
              {uploadError}
            </div>
          )}

          {/* TAB 1: DATA UTAMA */}
          {activeTab === 'main' && (
            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor Registrasi Akta
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={data.registrationNo}
                    onChange={(e) => updateField('registrationNo', e.target.value)}
                    className="flex-1 px-3 py-2 text-sm font-mono rounded-lg border border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none"
                    placeholder="No. 3173-BUN-2026-0001"
                  />
                  <button
                    type="button"
                    onClick={() => updateField('registrationNo', generateRegistrationNo())}
                    className="px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 shrink-0"
                    title="Buat nomor registrasi acak baru"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    Acak
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={data.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Panggilan
                  </label>
                  <input
                    type="text"
                    value={data.nickname}
                    onChange={(e) => updateField('nickname', e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jenis / Ras
                  </label>
                  <input
                    type="text"
                    value={data.breed}
                    onChange={(e) => updateField('breed', e.target.value)}
                    placeholder="Holland Lop / Fuzzy Lop / Anggora"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jenis Kelamin
                  </label>
                  <div className="flex gap-1.5">
                    {['Jantan', 'Betina'].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => updateField('gender', g)}
                        className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-all ${
                          data.gender === g
                            ? 'text-white border-transparent'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                        }`}
                        style={
                          data.gender === g
                            ? { backgroundColor: theme.primary }
                            : undefined
                        }
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tempat, Tanggal Lahir
                </label>
                <input
                  type="text"
                  value={data.birthPlaceDate}
                  onChange={(e) => updateField('birthPlaceDate', e.target.value)}
                  placeholder="Kota, DD Bulan YYYY"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Warna Bulu &amp; Mata
                </label>
                <input
                  type="text"
                  value={data.coatEyeColor}
                  onChange={(e) => updateField('coatEyeColor', e.target.value)}
                  placeholder="Misal: Broken Tort / Putih Mata Merah"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ciri Khusus
                </label>
                <textarea
                  rows={2}
                  value={data.specialMarks}
                  onChange={(e) => updateField('specialMarks', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Orang Tua (Pawrent)
                </label>
                <input
                  type="text"
                  value={data.pawrentName}
                  onChange={(e) => updateField('pawrentName', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none"
                />
              </div>

              <hr className="border-slate-200 my-2" />
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Pengesahan &amp; QR Verifikasi
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kota Penerbitan
                  </label>
                  <input
                    type="text"
                    value={data.issueCity}
                    onChange={(e) => updateField('issueCity', e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Penerbitan
                  </label>
                  <input
                    type="text"
                    value={data.issueDate}
                    onChange={(e) => updateField('issueDate', e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jabatan Penandatangan
                </label>
                <input
                  type="text"
                  value={data.officialTitle}
                  onChange={(e) => updateField('officialTitle', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Teks Tanda Tangan (Handwriting)
                </label>
                <input
                  type="text"
                  value={data.signatureName}
                  onChange={(e) => updateField('signatureName', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Isi QR Code (Link TikTok / Profil Kelinci)
                </label>
                <input
                  type="text"
                  value={data.qrText}
                  onChange={(e) => updateField('qrText', e.target.value)}
                  placeholder="https://tiktok.com/@..."
                  className="w-full px-3 py-2 text-sm font-mono rounded-lg border border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 2: SISI BELAKANG */}
          {activeTab === 'back' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Makanan Favorit
                </label>
                <textarea
                  rows={2}
                  value={data.favoriteFood}
                  onChange={(e) => updateField('favoriteFood', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hobi &amp; Kebiasaan Unik
                </label>
                <textarea
                  rows={2}
                  value={data.habits}
                  onChange={(e) => updateField('habits', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Status Adopsi
                </label>
                <input
                  type="text"
                  value={data.adoptionStatus}
                  onChange={(e) => updateField('adoptionStatus', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none"
                />
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {[
                    'Resmi Diadopsi & Dimanja Sepenuh Hati',
                    'Bos Besar Rumah',
                    'Anggota Keluarga Tetap',
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => updateField('adoptionStatus', preset)}
                      className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Catatan Petugas (Kutipan Bawah)
                </label>
                <textarea
                  rows={2}
                  value={data.officerNote}
                  onChange={(e) => updateField('officerNote', e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none resize-none"
                />
              </div>

              <hr className="border-slate-200" />

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Statistik Lucu (Skala 0–100%)
                </p>
                <div className="space-y-3.5">
                  {statSliders.map((s) => {
                    const val = data.stats?.[s.key] ?? 50;
                    return (
                      <div key={s.key} className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-semibold text-slate-800">
                            {s.label}
                          </label>
                          <span
                            className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-white border border-slate-200"
                            style={{ color: theme.primary }}
                          >
                            {val}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={val}
                          onChange={(e) => updateStat(s.key, e.target.value)}
                          className="bun-range w-full cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, ${theme.primary} ${val}%, #CBD5E1 ${val}%)`,
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FOTO & GALERI */}
          {activeTab === 'photos' && (
            <div className="space-y-5">
              {/* Pas Foto Utama */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">
                  Pas Foto Akta Utama (Rasio 3:4)
                </p>

                <div className="flex items-start gap-3.5">
                  <div className="w-[78px] h-[104px] rounded border border-slate-300 bg-white overflow-hidden shrink-0 flex items-center justify-center">
                    {data.photo ? (
                      <img
                        src={data.photo}
                        alt="Pratinjau Pas Foto"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] font-mono text-slate-400 text-center px-1">
                        Ilustrasi SVG
                      </span>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white cursor-pointer hover:opacity-95 transition-opacity"
                      style={{ backgroundColor: theme.primary }}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      {uploadingTarget === 'main' ? 'Memproses...' : 'Unggah Pas Foto'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handlePhotoUpload(e, 'main')}
                      />
                    </label>

                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => updateField('photo', DEFAULT_PHOTO_PATH)}
                        className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100"
                      >
                        Foto Default
                      </button>
                      <button
                        type="button"
                        onClick={() => updateField('photo', '')}
                        className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 inline-flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        Pakai Ilustrasi SVG
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3 Slot Mini Galeri */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">
                  Mini Galeri Sisi Belakang (3 Slot)
                </p>

                <div className="space-y-3">
                  {data.gallery.map((slot, idx) => (
                    <div
                      key={slot.id || idx}
                      className="p-3 rounded-xl border border-slate-200 bg-white space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-slate-700">
                          SLOT FOTO 0{idx + 1}
                        </span>
                        {slot.image && (
                          <button
                            type="button"
                            onClick={() => updateGallerySlot(idx, { image: '' })}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Hapus Foto
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-20 h-14 rounded border border-slate-200 bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                          {slot.image ? (
                            <img
                              src={slot.image}
                              alt={slot.caption || `Slot ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-slate-400" />
                          )}
                        </div>

                        <div className="flex-1 space-y-1.5">
                          <label className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 cursor-pointer transition-colors">
                            <Upload className="w-3.5 h-3.5" />
                            {uploadingTarget === `slot-${idx}`
                              ? 'Memproses...'
                              : slot.image
                              ? 'Ganti Foto'
                              : 'Pilih Foto'}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handlePhotoUpload(e, `slot-${idx}`)}
                            />
                          </label>

                          <input
                            type="text"
                            value={slot.caption}
                            onChange={(e) =>
                              updateGallerySlot(idx, { caption: e.target.value })
                            }
                            placeholder={`Keterangan foto ${idx + 1}`}
                            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:border-slate-500 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TEMA & STEMPEL */}
          {activeTab === 'theme' && (
            <div className="space-y-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">
                  Pilih Preset Tema Warna
                </p>
                <div className="space-y-2.5">
                  {THEME_LIST.map((preset) => {
                    const active = data.themeId === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => updateField('themeId', preset.id)}
                        className={`w-full p-3 rounded-xl border text-left flex items-center justify-between gap-3 transition-all ${
                          active
                            ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex items-center -space-x-1.5 shrink-0">
                            {preset.swatches.map((hex, i) => (
                              <span
                                key={i}
                                className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                                style={{ backgroundColor: hex }}
                              />
                            ))}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-900">
                              {preset.name}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                              {preset.description}
                            </p>
                          </div>
                        </div>
                        {active && (
                          <span
                            className="w-6 h-6 rounded-full flex items-center justify-center text-white shrink-0"
                            style={{ backgroundColor: preset.primary }}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <hr className="border-slate-200" />

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2.5">
                  Pengaturan Cap Stempel Basah
                </p>

                <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/70 cursor-pointer mb-3">
                  <div className="flex items-center gap-2.5">
                    <Stamp className="w-4 h-4 text-slate-700" />
                    <span className="text-xs font-semibold text-slate-800">
                      Tampilkan Stempel di Akta
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={Boolean(data.showStamp)}
                    onChange={(e) => updateField('showStamp', e.target.checked)}
                    className="w-4 h-4 rounded accent-slate-800"
                  />
                </label>

                <div className="grid grid-cols-2 gap-2.5">
                  {Object.values(STAMP_INKS).map((ink) => {
                    const active = data.stampInk === ink.id;
                    return (
                      <button
                        key={ink.id}
                        type="button"
                        onClick={() => updateField('stampInk', ink.id)}
                        className={`p-3 rounded-xl border flex items-center gap-2.5 text-left transition-all ${
                          active
                            ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <span
                          className="w-5 h-5 rounded-full shrink-0 border border-black/15"
                          style={{ backgroundColor: ink.color }}
                        />
                        <span className="text-xs font-semibold text-slate-800">
                          {ink.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="px-5 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-2">
          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Default
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  onReset();
                  setConfirmReset(false);
                }}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-red-600 text-white hover:bg-red-700"
              >
                Ya, Reset Semua
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="px-2 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200"
              >
                Batal
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-bold text-white shadow-sm hover:opacity-95"
            style={{ backgroundColor: theme.primary }}
          >
            Selesai
          </button>
        </div>
      </aside>
    </div>
  );
}
