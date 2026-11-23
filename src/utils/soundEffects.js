const SFX_STORAGE_KEY = 'akta-kelinci-sfx-v1';

let sharedAudioCtx = null;
let lastRustleAt = 0;

export function getSfxEnabled() {
  try {
    const raw = localStorage.getItem(SFX_STORAGE_KEY);
    if (raw === null) return true;
    return raw !== 'false';
  } catch {
    return true;
  }
}

export function setSfxEnabled(enabled) {
  try {
    localStorage.setItem(SFX_STORAGE_KEY, enabled ? 'true' : 'false');
  } catch {
    // Ignore storage quota errors
  }
}

function getAudioContext() {
  if (typeof window === 'undefined' || !getSfxEnabled()) return null;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;

  try {
    if (!sharedAudioCtx) {
      sharedAudioCtx = new Ctx();
    }
    if (sharedAudioCtx.state === 'suspended') {
      sharedAudioCtx.resume().catch(() => {});
    }
    return sharedAudioCtx;
  } catch {
    return null;
  }
}

function createNoiseBuffer(ctx, durationSec) {
  const sampleRate = ctx.sampleRate;
  const length = Math.max(1, Math.floor(sampleRate * durationSec));
  const buffer = ctx.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

/**
 * Soft paper swoosh when flipping the Akta card
 */
export function playPaperFlip() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const duration = 0.2;
    const src = ctx.createBufferSource();
    src.buffer = createNoiseBuffer(ctx, duration);

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(850, now);
    filter.frequency.exponentialRampToValueAtTime(2400, now + duration);
    filter.Q.value = 1.4;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.11, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    src.start(now);
    src.stop(now + duration);
  } catch {
    // Ignore audio playback errors
  }
}

/**
 * Warm thud sound when slamming the official or custom rubber stamp
 */
export function playStampThud() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    // Low damped thud body
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(165, now);
    osc.frequency.exponentialRampToValueAtTime(42, now + 0.16);

    oscGain.gain.setValueAtTime(0.001, now);
    oscGain.gain.linearRampToValueAtTime(0.28, now + 0.012);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.17);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.18);

    // Subtle crisp paper slap transient
    const clickSrc = ctx.createBufferSource();
    clickSrc.buffer = createNoiseBuffer(ctx, 0.045);
    const clickFilter = ctx.createBiquadFilter();
    clickFilter.type = 'lowpass';
    clickFilter.frequency.setValueAtTime(1100, now);
    const clickGain = ctx.createGain();
    clickGain.gain.setValueAtTime(0.12, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

    clickSrc.connect(clickFilter);
    clickFilter.connect(clickGain);
    clickGain.connect(ctx.destination);
    clickSrc.start(now);
    clickSrc.stop(now + 0.05);
  } catch {
    // Ignore audio playback errors
  }
}

/**
 * Gentle card rustle when hovering folder or peeking album cards
 */
export function playCardRustle() {
  const nowMs = Date.now();
  if (nowMs - lastRustleAt < 85) return;
  lastRustleAt = nowMs;

  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const duration = 0.075;
    const src = ctx.createBufferSource();
    src.buffer = createNoiseBuffer(ctx, duration);

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1600, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.045, now + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    src.start(now);
    src.stop(now + duration);
  } catch {
    // Ignore audio playback errors
  }
}

/**
 * Playful munching crunch-crunch sound when feeding Cimi
 */
export function playCrunch() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const bursts = [0, 0.065, 0.135];

    bursts.forEach((offset, idx) => {
      const start = now + offset;
      const dur = 0.048;
      const src = ctx.createBufferSource();
      src.buffer = createNoiseBuffer(ctx, dur);

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2100 + idx * 350, start);
      filter.Q.value = 1.9;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(0.11, start + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

      src.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      src.start(start);
      src.stop(start + dur);
    });
  } catch {
    // Ignore audio playback errors
  }
}

/**
 * Soft cheerful chime/pop when petting or tapping Cimi
 */
export function playHappyPop() {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;
    const notes = [
      { freq: 540, start: 0, dur: 0.075, vol: 0.085 },
      { freq: 790, start: 0.055, dur: 0.11, vol: 0.095 },
    ];

    notes.forEach((n) => {
      const t = now + n.start;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.freq, t);
      osc.frequency.exponentialRampToValueAtTime(n.freq * 1.08, t + n.dur);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(n.vol, t + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.001, t + n.dur);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + n.dur + 0.01);
    });
  } catch {
    // Ignore audio playback errors
  }
}
