import {
  CERTIFICATE_ROW_ID,
  CIMI_CERTIFICATE_TABLE,
  CIMI_PHOTOS_BUCKET,
  CIMI_PHOTOS_TABLE,
  isSupabaseConfigured,
  supabase,
} from '../lib/supabase.js';
import { DEFAULT_DATA } from '../data/defaultData.js';
import { optimizePhotoToBlob } from './cimiDb.js';

function normalizeCertificatePayload(raw) {
  if (!raw || typeof raw !== 'object') return structuredClone(DEFAULT_DATA);

  const gallery =
    Array.isArray(raw.gallery) && raw.gallery.length === 3
      ? raw.gallery.map((item, idx) => ({
          id: item?.id || `slot-${idx + 1}`,
          image: typeof item?.image === 'string' ? item.image : '',
          caption:
            typeof item?.caption === 'string'
              ? item.caption
              : DEFAULT_DATA.gallery[idx].caption,
        }))
      : structuredClone(DEFAULT_DATA.gallery);

  const clampStat = (val, fallback) => {
    const n = Number(val);
    if (Number.isNaN(n)) return fallback;
    return Math.max(0, Math.min(100, Math.round(n)));
  };

  return {
    ...DEFAULT_DATA,
    ...raw,
    stats: {
      gemoy: clampStat(raw.stats?.gemoy, DEFAULT_DATA.stats.gemoy),
      nakal: clampStat(raw.stats?.nakal, DEFAULT_DATA.stats.nakal),
      rakus: clampStat(raw.stats?.rakus, DEFAULT_DATA.stats.rakus),
      manja: clampStat(raw.stats?.manja, DEFAULT_DATA.stats.manja),
    },
    gallery,
  };
}

function mapCloudPhotoRow(row) {
  return {
    id: row.id,
    src: row.url,
    storagePath: row.storage_path || '',
    album: row.album || 'baby-cimi',
    caption: row.caption || 'Momen Cimi',
    date: row.taken_date || '',
    format: row.format || 'JPG',
    createdAt: row.created_at ? new Date(row.created_at).getTime() : Date.now(),
    source: 'supabase',
  };
}

function getExtFromFormat(format, mimeType) {
  const f = (format || '').toUpperCase();
  if (f === 'PNG' || mimeType === 'image/png') return 'png';
  if (f === 'WEBP' || mimeType === 'image/webp') return 'webp';
  if (f === 'GIF' || mimeType === 'image/gif') return 'gif';
  return 'jpg';
}

/**
 * Fetch the single main certificate row from Supabase (`cimi_certificate`)
 */
export async function fetchCloudCertificate() {
  if (!isSupabaseConfigured || !supabase) return null;

  const { data, error } = await supabase
    .from(CIMI_CERTIFICATE_TABLE)
    .select('data, updated_at')
    .eq('id', CERTIFICATE_ROW_ID)
    .maybeSingle();

  if (error) throw error;
  if (!data || !data.data) return null;

  return normalizeCertificatePayload(data.data);
}

/**
 * Upsert the certificate JSON payload to Supabase (`cimi_certificate`)
 * Requires authenticated Pawrent session via RLS.
 */
export async function saveCloudCertificate(certData) {
  if (!isSupabaseConfigured || !supabase) return false;

  const { data: sessionRes } = await supabase.auth.getSession();
  if (!sessionRes?.session) {
    throw new Error('Sesi Mode Pawrent belum aktif atau sudah berakhir. Silakan login ulang.');
  }

  const { error } = await supabase.from(CIMI_CERTIFICATE_TABLE).upsert(
    {
      id: CERTIFICATE_ROW_ID,
      data: certData,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' }
  );

  if (error) {
    throw new Error(`Gagal menyimpan ke tabel cimi_certificate: ${error.message}`);
  }
  return true;
}

/**
 * Upload a certificate image (Pas Foto or Back Mini Gallery slot) to Supabase Storage
 * inside `cimi-photos/certificate/...` and return its public URL.
 */
export async function uploadCertificateImageToCloud(file, slotKey = 'pas-foto') {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase belum dikonfigurasi (.env belum diisi).');
  }

  const { data: sessionRes } = await supabase.auth.getSession();
  if (!sessionRes?.session) {
    throw new Error('Sesi Mode Pawrent belum aktif atau sudah berakhir. Silakan login ulang.');
  }

  const { blob, format } = await optimizePhotoToBlob(file, 1400, 0.88);
  const ext = getExtFromFormat(format, blob.type);
  const cleanKey =
    slotKey === 'main'
      ? 'pas-foto'
      : String(slotKey).replace(/[^a-z0-9-_]/gi, '-').toLowerCase();
  const storagePath = `certificate/${cleanKey}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 7)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(CIMI_PHOTOS_BUCKET)
    .upload(storagePath, blob, {
      contentType: blob.type || 'image/jpeg',
      cacheControl: '31536000',
      upsert: false,
    });

  if (uploadError) {
    throw new Error(
      `Gagal upload ke Supabase Storage (${CIMI_PHOTOS_BUCKET}): ${uploadError.message}`
    );
  }

  const { data: urlData } = supabase.storage
    .from(CIMI_PHOTOS_BUCKET)
    .getPublicUrl(storagePath);

  if (!urlData?.publicUrl) {
    throw new Error('Gagal mendapatkan Public URL dari Supabase Storage.');
  }

  return urlData.publicUrl;
}

/**
 * Fetch all gallery photos from Supabase (`cimi_photos`) newest first
 */
export async function fetchCloudPhotos() {
  if (!isSupabaseConfigured || !supabase) return [];

  const { data, error } = await supabase
    .from(CIMI_PHOTOS_TABLE)
    .select('id, url, storage_path, album, caption, taken_date, format, created_at')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(mapCloudPhotoRow);
}

/**
 * Upload multiple gallery photos to Supabase Storage (`cimi-photos`)
 * and insert metadata rows into `cimi_photos`.
 */
export async function uploadCloudPhotos(records) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase belum dikonfigurasi.');
  }
  if (!Array.isArray(records) || records.length === 0) return [];

  const uploadedItems = [];

  for (const rec of records) {
    const album = rec.album || 'baby-cimi';
    const ext = getExtFromFormat(rec.format, rec.blob?.type);
    const storagePath = `gallery/${album}/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}.${ext}`;

    const { error: uploadErr } = await supabase.storage
      .from(CIMI_PHOTOS_BUCKET)
      .upload(storagePath, rec.blob, {
        contentType: rec.blob?.type || 'image/jpeg',
        cacheControl: '31536000',
        upsert: false,
      });

    if (uploadErr) {
      throw new Error(`Gagal upload ke Storage: ${uploadErr.message}`);
    }

    const { data: pubData } = supabase.storage
      .from(CIMI_PHOTOS_BUCKET)
      .getPublicUrl(storagePath);

    const { data: insertedRow, error: insertErr } = await supabase
      .from(CIMI_PHOTOS_TABLE)
      .insert({
        url: pubData.publicUrl,
        storage_path: storagePath,
        album,
        caption: rec.caption || 'Momen Cimi',
        taken_date: rec.date || '',
        format: rec.format || 'JPG',
      })
      .select('id, url, storage_path, album, caption, taken_date, format, created_at')
      .single();

    if (insertErr) {
      // Clean up orphaned Storage object if DB insert fails
      await supabase.storage.from(CIMI_PHOTOS_BUCKET).remove([storagePath]).catch(() => {});
      throw new Error(`Gagal menyimpan metadata foto: ${insertErr.message}`);
    }

    uploadedItems.push(mapCloudPhotoRow(insertedRow));
  }

  return uploadedItems;
}

/**
 * Delete a photo from Supabase Storage (`cimi-photos`) and its row in `cimi_photos`.
 */
export async function deleteCloudPhoto(photo) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Supabase belum dikonfigurasi.');
  }

  if (photo?.storagePath) {
    const { error: storageErr } = await supabase.storage
      .from(CIMI_PHOTOS_BUCKET)
      .remove([photo.storagePath]);
    if (storageErr) {
      throw new Error(`Gagal menghapus file Storage: ${storageErr.message}`);
    }
  }

  const { error: dbErr } = await supabase
    .from(CIMI_PHOTOS_TABLE)
    .delete()
    .eq('id', photo.id);

  if (dbErr) {
    throw new Error(`Gagal menghapus data foto: ${dbErr.message}`);
  }

  return true;
}

/**
 * Optional real-time listener for live cloud updates across devices
 */
export function subscribeCloudUpdates({ onPhotosChange, onCertificateChange }) {
  if (!isSupabaseConfigured || !supabase) return () => {};

  try {
    const channel = supabase
      .channel('cimi-cloud-sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: CIMI_PHOTOS_TABLE },
        () => {
          onPhotosChange?.();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: CIMI_CERTIFICATE_TABLE },
        () => {
          onCertificateChange?.();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch {
    return () => {};
  }
}
