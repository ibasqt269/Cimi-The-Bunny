import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  ShieldCheck,
  X,
} from 'lucide-react';
import { isSupabaseConfigured, supabase } from '../lib/supabase.js';

/**
 * Minimalist Pawrent Admin Login Modal (Email & Password ONLY — NO Sign Up / Register)
 */
export default function PawrentLoginModal({ isOpen, theme, onClose, onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!isOpen) return undefined;
    setErrorMsg('');
    setPassword('');
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSupabaseConfigured || !supabase) {
      setErrorMsg(
        'Supabase belum dikonfigurasi. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di file .env terlebih dahulu.'
      );
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMsg(
          error.message === 'Invalid login credentials'
            ? 'Email atau password Pawrent salah.'
            : error.message
        );
        return;
      }

      if (data?.session) {
        onSuccess?.(data.session);
        onClose();
      }
    } catch {
      setErrorMsg('Gagal terhubung ke server autentikasi. Coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="no-print print:hidden fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Login Mode Pawrent"
    >
      <div
        className="relative w-full max-w-[390px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-sm"
              style={{ backgroundColor: theme?.primary || '#1B4332' }}
            >
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display text-sm font-bold text-slate-900">
                Login Mode Pawrent
              </h2>
              <p className="text-[11px] text-slate-500">
                Akses khusus admin untuk edit akta &amp; kelola foto
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/70 flex items-center justify-center transition-colors"
            aria-label="Tutup modal login"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {!isSupabaseConfigured && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Mode Lokal (Supabase Belum Aktif)</p>
                <p className="mt-0.5 text-amber-800 leading-relaxed">
                  Tambahkan <code className="font-mono bg-amber-100 px-1 rounded">VITE_SUPABASE_URL</code> dan{' '}
                  <code className="font-mono bg-amber-100 px-1 rounded">VITE_SUPABASE_ANON_KEY</code> di file{' '}
                  <code className="font-mono bg-amber-100 px-1 rounded">.env</code> untuk mengaktifkan Login Pawrent.
                </p>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label
              htmlFor="pawrent-email"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Email Pawrent
            </label>
            <input
              id="pawrent-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting || !isSupabaseConfigured}
              placeholder="pawrent@email.com"
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none disabled:bg-slate-100 disabled:text-slate-400"
            />
          </div>

          <div>
            <label
              htmlFor="pawrent-password"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="pawrent-password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting || !isSupabaseConfigured}
                placeholder="••••••••"
                className="w-full pl-3.5 pr-10 py-2.5 text-sm rounded-xl border border-slate-300 focus:border-slate-500 focus:ring-2 focus:ring-slate-200 outline-none disabled:bg-slate-100 disabled:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700"
                tabIndex={-1}
                aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !isSupabaseConfigured}
            className="w-full py-2.5 px-4 rounded-xl text-sm font-bold text-white shadow-sm hover:opacity-95 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
            style={{ backgroundColor: theme?.primary || '#1B4332' }}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memverifikasi...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Masuk Mode Pawrent</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
