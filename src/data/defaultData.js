export const STORAGE_KEY = 'akta-kelinci-data-v1';
export const DEFAULT_PHOTO_PATH = '/kelinci-default.jpg';

export const DEFAULT_DATA = {
  themeId: 'klasik-krem',
  stampInk: 'red',
  showStamp: true,
  registrationNo: 'No. 3173-BUN-2026-0001',
  photo: DEFAULT_PHOTO_PATH,
  fullName: 'Mochi Gemoy',
  nickname: 'Mochi / Si Gembul',
  breed: 'Holland Lop',
  gender: 'Betina',
  birthPlaceDate: 'Jakarta, 7 Januari 2026',
  coatEyeColor: 'Abu-Abu Chinchilla, Mata Hitam Bulat',
  specialMarks: 'Telinga jatuh gemas, suka pita biru, hobi menghentakkan kaki',
  pawrentName: 'Bunda & Ayah Mochi',
  issueCity: 'Jakarta',
  issueDate: '23 November 2026',
  officialTitle: 'Kepala Dinas Perkelincian / Pawrent',
  signatureName: 'Pawrent Mochi',
  qrText: 'https://tiktok.com/@cimi.hollandlop',

  // Sisi Belakang
  favoriteFood: 'Timothy Hay segar, daun ketumbar, wortel renyah, dan potongan apel',
  habits: 'Binky lompat heboh tiap pagi, flop miring mendadak, dan inspeksi kabel charger',
  adoptionStatus: 'Resmi Diadopsi & Dimanja Sepenuh Hati',
  officerNote:
    'Pemegang akta ini berhak penuh atas elusan kepala tak terbatas, camilan rutin, dan pengawasan kabel.',
  stats: {
    gemoy: 98,
    nakal: 68,
    rakus: 88,
    manja: 94,
  },
  gallery: [
    {
      id: 'slot-1',
      image: '',
      caption: 'Momen Makan Favorit',
    },
    {
      id: 'slot-2',
      image: '',
      caption: 'Pose Tidur Flop',
    },
    {
      id: 'slot-3',
      image: '',
      caption: 'Aksi Binky Bahagia',
    },
  ],
};

export function generateRegistrationNo() {
  const region = Math.floor(3100 + Math.random() * 899);
  const year = new Date().getFullYear();
  const seq = String(Math.floor(1 + Math.random() * 9999)).padStart(4, '0');
  return `No. ${region}-BUN-${year}-${seq}`;
}

export function loadSavedData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_DATA);
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return structuredClone(DEFAULT_DATA);

    const gallery = Array.isArray(parsed.gallery) && parsed.gallery.length === 3
      ? parsed.gallery.map((item, idx) => ({
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

    const migratedQrText =
      parsed.qrText === 'https://instagram.com/mochi.hollandlop'
        ? DEFAULT_DATA.qrText
        : parsed.qrText;

    const migratedBirthDate =
      parsed.birthPlaceDate === 'Jakarta, 14 Februari 2026'
        ? DEFAULT_DATA.birthPlaceDate
        : parsed.birthPlaceDate;

    return {
      ...DEFAULT_DATA,
      ...parsed,
      ...(typeof migratedQrText === 'string' ? { qrText: migratedQrText } : {}),
      ...(typeof migratedBirthDate === 'string'
        ? { birthPlaceDate: migratedBirthDate }
        : {}),
      stats: {
        gemoy: clampStat(parsed.stats?.gemoy, DEFAULT_DATA.stats.gemoy),
        nakal: clampStat(parsed.stats?.nakal, DEFAULT_DATA.stats.nakal),
        rakus: clampStat(parsed.stats?.rakus, DEFAULT_DATA.stats.rakus),
        manja: clampStat(parsed.stats?.manja, DEFAULT_DATA.stats.manja),
      },
      gallery,
    };
  } catch {
    return structuredClone(DEFAULT_DATA);
  }
}

export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export const PET_STATS_KEY = 'akta-kelinci-pet-v1';
export const CUSTOM_STAMPS_KEY = 'akta-kelinci-stamps-v1';

export function loadPetStats() {
  try {
    const raw = localStorage.getItem(PET_STATS_KEY);
    if (!raw) return { pets: 0, snacks: 0 };
    const parsed = JSON.parse(raw);
    return {
      pets: Math.max(0, Math.floor(Number(parsed?.pets) || 0)),
      snacks: Math.max(0, Math.floor(Number(parsed?.snacks) || 0)),
    };
  } catch {
    return { pets: 0, snacks: 0 };
  }
}

export function savePetStats(stats) {
  try {
    localStorage.setItem(PET_STATS_KEY, JSON.stringify(stats));
  } catch {
    // Ignore storage quota errors
  }
}

export function loadCustomStamps() {
  try {
    const raw = localStorage.getItem(CUSTOM_STAMPS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCustomStamps(stamps) {
  try {
    localStorage.setItem(CUSTOM_STAMPS_KEY, JSON.stringify(stamps));
  } catch {
    // Ignore storage quota errors
  }
}
