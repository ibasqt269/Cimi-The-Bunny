import React from 'react';
import {
  Download,
  Loader2,
  Lock,
  LogOut,
  PencilLine,
  Printer,
  Rabbit,
  RotateCw,
  ShieldCheck,
  Stamp,
  Sticker,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { THEME_LIST } from '../data/themes.js';

export default function Toolbar({
  theme,
  themeId,
  onSelectTheme,
  isFlipped,
  onFlip,
  onCertify,
  stampMode,
  onToggleStampMode,
  sfxEnabled,
  onToggleSfx,
  showWalker,
  onToggleWalker,
  isAdmin = false,
  pawrentEmail = '',
  onOpenLogin,
  onLogout,
  onOpenEdit,
  onDownloadPng,
  isExporting,
  onPrint,
}) {
  return (
    <header className="no-print print:hidden sticky top-0 z-30 border-b border-black/10 bg-white/85 backdrop-blur-md shadow-sm">
      <div className="max-w-[1260px] mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2.5">
        {/* Brand & Active Side Pill */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shadow-sm shrink-0"
            style={{ backgroundColor: theme.primary, color: theme.paperBg }}
          >
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-display text-sm sm:text-base font-bold tracking-wide text-slate-900 truncate">
                Akta Kelinci
              </span>
              <span
                className="font-mono text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border"
                style={{
                  backgroundColor: theme.badgeBg,
                  borderColor: theme.divider,
                  color: theme.primary,
                }}
              >
                {isFlipped ? 'Sisi Belakang' : 'Sisi Depan'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Dinas Kependudukan &amp; Pencatatan Kelinci Gemoy
            </p>
          </div>
        </div>

        {/* 3 Preset Color Themes Switcher */}
        <div
          className="flex items-center gap-1 p-1 rounded-xl bg-slate-100/90 border border-slate-200/80"
          role="group"
          aria-label="Pilih Preset Tema Warna"
        >
          {THEME_LIST.map((preset) => {
            const active = preset.id === themeId;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onSelectTheme(preset.id)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  active
                    ? 'bg-white text-slate-900 shadow-sm ring-1 ring-black/10'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
                title={preset.description}
              >
                <span className="flex items-center -space-x-1 shrink-0">
                  <span
                    className="w-3 h-3 rounded-full border border-black/15"
                    style={{ backgroundColor: preset.swatches[0] }}
                  />
                  <span
                    className="w-3 h-3 rounded-full border border-black/15"
                    style={{ backgroundColor: preset.swatches[1] }}
                  />
                  <span
                    className="w-3 h-3 rounded-full border border-black/15"
                    style={{ backgroundColor: preset.swatches[2] }}
                  />
                </span>
                <span className="hidden md:inline">{preset.name}</span>
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={onFlip}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all active:scale-[0.98]"
          >
            <RotateCw
              className={`w-4 h-4 transition-transform duration-300 ${
                isFlipped ? 'rotate-180' : ''
              }`}
            />
            <span>Balik Akta</span>
          </button>

          <button
            type="button"
            onClick={onCertify}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold text-white shadow-sm hover:opacity-95 transition-all active:scale-[0.97]"
            style={{ backgroundColor: theme.primary }}
          >
            <Stamp className="w-4 h-4" />
            <span>Sahkan Akta</span>
          </button>

          <button
            type="button"
            onClick={onToggleStampMode}
            aria-pressed={stampMode}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold border shadow-sm transition-all active:scale-[0.98] ${
              stampMode
                ? 'bg-rose-50 border-rose-300 text-rose-700 ring-2 ring-rose-300/60'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
            }`}
            title="Mode Bebas Ngecap & Stempel Lucu"
          >
            <Sticker className="w-4 h-4" />
            <span className="hidden sm:inline">Mode Stempel</span>
            <span className="sm:hidden">Cap</span>
          </button>

          {isAdmin && (
            <button
              type="button"
              onClick={() => onOpenEdit('main')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all active:scale-[0.98]"
            >
              <PencilLine className="w-4 h-4" />
              <span>Edit Data</span>
            </button>
          )}

          <button
            type="button"
            onClick={onDownloadPng}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-wait"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">
              {isExporting ? 'Mengunduh...' : 'Download PNG'}
            </span>
            <span className="sm:hidden">PNG</span>
          </button>

          <button
            type="button"
            onClick={onPrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all active:scale-[0.98]"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Print / PDF</span>
            <span className="sm:hidden">PDF</span>
          </button>

          {/* Compact Utility Toggles: SFX & Cimi Walker */}
          <div className="flex items-center gap-1 pl-1 border-l border-slate-200">
            <button
              type="button"
              onClick={onToggleSfx}
              aria-pressed={sfxEnabled}
              className={`w-9 h-9 rounded-lg border flex items-center justify-center shadow-sm transition-all ${
                sfxEnabled
                  ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  : 'bg-slate-100 border-slate-200 text-slate-400 hover:text-slate-600'
              }`}
              title={sfxEnabled ? 'Suara SFX: Aktif (Klik untuk mute)' : 'Suara SFX: Mute (Klik untuk aktifkan)'}
              aria-label={sfxEnabled ? 'Matikan efek suara' : 'Aktifkan efek suara'}
            >
              {sfxEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={onToggleWalker}
              aria-pressed={showWalker}
              className={`w-9 h-9 rounded-lg border flex items-center justify-center shadow-sm transition-all ${
                showWalker
                  ? 'bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100'
                  : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50'
              }`}
              title={showWalker ? 'Sembunyikan Mini Cimi di bawah layar' : 'Tampilkan Mini Cimi di bawah layar'}
              aria-label={showWalker ? 'Sembunyikan Mini Cimi' : 'Tampilkan Mini Cimi'}
            >
              <Rabbit className="w-4 h-4" />
            </button>

            {isAdmin ? (
              <div className="flex items-center gap-1 pl-1 ml-0.5 border-l border-slate-200">
                <span
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold"
                  title={pawrentEmail ? `Login sebagai ${pawrentEmail}` : 'Mode Pawrent Aktif'}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="hidden lg:inline">Mode Pawrent</span>
                  <span className="lg:hidden">Pawrent</span>
                </span>
                <button
                  type="button"
                  onClick={onLogout}
                  className="inline-flex items-center gap-1 px-2.5 py-2 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200 shadow-sm transition-all"
                  title="Keluar dari Mode Pawrent"
                  aria-label="Logout Mode Pawrent"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenLogin}
                className="w-9 h-9 rounded-lg border border-transparent hover:border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 flex items-center justify-center transition-all"
                title="Login Mode Pawrent"
                aria-label="Login Mode Pawrent"
              >
                <Lock className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
