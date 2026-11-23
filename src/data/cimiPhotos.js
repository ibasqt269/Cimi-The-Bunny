import autoPublicPhotos from 'virtual:cimi-public-photos';

export const CIMI_ALBUMS = [
  {
    id: 'baby-cimi',
    label: 'Baby Cimi',
    badge: 'JPG',
    accent: '#D97706',
    pillBg: '#FEF3C7',
    cardBg: '#FFFBEB',
  },
  {
    id: 'tidur-gemoy',
    label: 'Tidur Gemoy',
    badge: 'JPG',
    accent: '#0284C7',
    pillBg: '#E0F2FE',
    cardBg: '#F0F9FF',
  },
  {
    id: 'jam-makan',
    label: 'Jam Makan',
    badge: 'PNG',
    accent: '#E11D48',
    pillBg: '#FFE4E6',
    cardBg: '#FFF1F2',
  },
  {
    id: 'eksplor',
    label: 'Eksplor',
    badge: 'JPG',
    accent: '#059669',
    pillBg: '#D1FAE5',
    cardBg: '#ECFDF5',
  },
];

/**
 * Daftar foto Cimi yang mudah diedit secara manual.
 * Cukup taruh file foto di `public/cimi/` (otomatis terdeteksi),
 * atau tambahkan entry khusus di array ini untuk mengatur caption & tanggalnya.
 *
 * Contoh entri tambahan:
 * {
 *   id: 'cimi-makan-wortel',
 *   src: '/cimi/makan-wortel.jpg',
 *   album: 'jam-makan', // 'baby-cimi' | 'tidur-gemoy' | 'jam-makan' | 'eksplor'
 *   caption: 'Cimi lahap makan wortel segar',
 *   date: '14 Nov 2026',
 *   format: 'JPG',
 * },
 */
export const CIMI_STATIC_PHOTOS = [
  {
    id: 'cimi-default-portrait',
    src: '/kelinci-default.jpg',
    album: 'baby-cimi',
    caption: 'Cimi tampil gemas dengan pita biru pastel',
    date: '2026',
    format: 'JPG',
    source: 'static',
  },
];

export function getConfiguredCimiPhotos() {
  const manualSrcSet = new Set(CIMI_STATIC_PHOTOS.map((p) => p.src));
  const mergedAuto = (Array.isArray(autoPublicPhotos) ? autoPublicPhotos : []).filter(
    (item) => !manualSrcSet.has(item.src)
  );
  return [...CIMI_STATIC_PHOTOS, ...mergedAuto];
}
