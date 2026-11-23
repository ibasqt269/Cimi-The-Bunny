const MONTH_MAP = {
  januari: 0,
  january: 0,
  jan: 0,
  februari: 1,
  pebruari: 1,
  february: 1,
  feb: 1,
  maret: 2,
  march: 2,
  mar: 2,
  april: 3,
  apr: 3,
  mei: 4,
  may: 4,
  juni: 5,
  june: 5,
  jun: 5,
  juli: 6,
  july: 6,
  jul: 6,
  agustus: 7,
  august: 7,
  agu: 7,
  agt: 7,
  aug: 7,
  september: 8,
  sept: 8,
  sep: 8,
  oktober: 9,
  october: 9,
  okt: 9,
  oct: 9,
  november: 10,
  nopember: 10,
  nov: 10,
  nop: 10,
  desember: 11,
  december: 11,
  des: 11,
  dec: 11,
};

function makeValidLocalDate(year, monthIdx, day) {
  if (year < 1990 || year > 2100 || monthIdx < 0 || monthIdx > 11 || day < 1 || day > 31) {
    return null;
  }
  const d = new Date(year, monthIdx, day);
  if (d.getFullYear() !== year || d.getMonth() !== monthIdx || d.getDate() !== day) {
    return null;
  }
  return d;
}

/**
 * Parse birth date from Indonesian/English strings like:
 * - "Jakarta, 7 Januari 2026"
 * - "07 Feb 2026"
 * - "2026-01-07"
 * - "07/01/2026"
 */
export function parseIndonesianBirthDate(rawText) {
  if (!rawText || typeof rawText !== 'string') return null;
  const text = rawText.trim();

  // 1. Named month: "7 Januari 2026"
  const namedMatch = text.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
  if (namedMatch) {
    const day = Number(namedMatch[1]);
    const monthKey = namedMatch[2].toLowerCase();
    const year = Number(namedMatch[3]);
    if (Object.prototype.hasOwnProperty.call(MONTH_MAP, monthKey)) {
      return makeValidLocalDate(year, MONTH_MAP[monthKey], day);
    }
  }

  // 2. ISO format: "2026-01-07"
  const isoMatch = text.match(/(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (isoMatch) {
    return makeValidLocalDate(
      Number(isoMatch[1]),
      Number(isoMatch[2]) - 1,
      Number(isoMatch[3])
    );
  }

  // 3. DD/MM/YYYY or DD-MM-YYYY
  const dmyMatch = text.match(/(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
  if (dmyMatch) {
    return makeValidLocalDate(
      Number(dmyMatch[3]),
      Number(dmyMatch[2]) - 1,
      Number(dmyMatch[1])
    );
  }

  return null;
}

/**
 * Compute real-time age & upcoming birthday countdown
 */
export function computeBunnyAgeInfo(birthPlaceDate, nowInput = new Date()) {
  const birth = parseIndonesianBirthDate(birthPlaceDate);
  if (!birth) return null;

  const today = new Date(
    nowInput.getFullYear(),
    nowInput.getMonth(),
    nowInput.getDate()
  );

  if (today < birth) {
    const diffDays = Math.round((birth - today) / 86400000);
    return {
      ageText: 'Segera Hadir',
      countdownText: `Menunggu lahir dalam ${diffDays} hari lagi`,
      isBirthdayToday: false,
      daysUntilBirthday: diffDays,
      nextBirthdayNumber: 0,
    };
  }

  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  let days = today.getDate() - birth.getDate();

  if (days < 0) {
    const prevMonthLastDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      0
    ).getDate();
    days += prevMonthLastDay;
    months -= 1;
  }

  if (months < 0) {
    months += 12;
    years -= 1;
  }

  const ageParts = [];
  if (years > 0) ageParts.push(`${years} tahun`);
  if (months > 0) ageParts.push(`${months} bulan`);
  if (days > 0 || ageParts.length === 0) ageParts.push(`${days} hari`);
  const ageText = ageParts.join(' ');

  const isBirthdayToday =
    today.getMonth() === birth.getMonth() &&
    today.getDate() === birth.getDate() &&
    years >= 1;

  let nextYear = today.getFullYear();
  let nextBirthday = new Date(nextYear, birth.getMonth(), birth.getDate());
  // Handle Feb 29 safely
  if (birth.getMonth() === 1 && birth.getDate() === 29 && nextBirthday.getMonth() !== 1) {
    nextBirthday = new Date(nextYear, 1, 28);
  }

  if (nextBirthday <= today) {
    nextYear += 1;
    nextBirthday = new Date(nextYear, birth.getMonth(), birth.getDate());
    if (birth.getMonth() === 1 && birth.getDate() === 29 && nextBirthday.getMonth() !== 1) {
      nextBirthday = new Date(nextYear, 1, 28);
    }
  }

  const nextBirthdayNumber = nextYear - birth.getFullYear();
  const daysUntilBirthday = Math.round((nextBirthday - today) / 86400000);

  const countdownText = isBirthdayToday
    ? `Selamat Ultah ke-${years}! 🎂🎉`
    : `${daysUntilBirthday} hari lagi menuju Ultah ke-${nextBirthdayNumber} 🎂`;

  return {
    ageText,
    countdownText,
    isBirthdayToday,
    daysUntilBirthday,
    nextBirthdayNumber,
  };
}
