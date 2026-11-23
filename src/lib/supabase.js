import { createClient } from '@supabase/supabase-js';

const rawUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const rawAnonKey = (
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  ''
).trim();

const hasValidUrl =
  /^https?:\/\//i.test(rawUrl) &&
  !rawUrl.includes('your-project-id') &&
  !rawUrl.includes('your-project');

const hasValidKey =
  rawAnonKey.length > 20 && !rawAnonKey.includes('your-supabase-anon-key');

export const isSupabaseConfigured = Boolean(hasValidUrl && hasValidKey);

export const supabase = isSupabaseConfigured
  ? createClient(rawUrl, rawAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    })
  : null;

export const CIMI_PHOTOS_BUCKET = 'cimi-photos';
export const CIMI_PHOTOS_TABLE = 'cimi_photos';
export const CIMI_CERTIFICATE_TABLE = 'cimi_certificate';
export const CERTIFICATE_ROW_ID = 'main';
