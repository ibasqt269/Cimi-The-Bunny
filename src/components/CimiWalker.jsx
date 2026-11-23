import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { playHappyPop } from '../utils/soundEffects.js';

const WALKER_QUOTES = [
  'Halo! Mana wortelku? 🥕',
  'Kabelnya aman kok... untuk sekarang~',
  'Cimi siap patroli lantai!',
  'Jangan lupa kasih Timothy Hay ya~ 🌿',
  'Elus kepala Cimi dong! 💕',
];

function MiniCimiSvg({ mode }) {
  const isSleeping = mode === 'sleep';
  const isExcited = mode === 'excited' || mode === 'binky';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 96 80"
      className="w-[52px] h-[44px] sm:w-[78px] sm:h-[66px] drop-shadow-[0_4px_6px_rgba(15,23,42,0.22)]"
      aria-hidden="true"
    >
      {/* Subtle ground shadow */}
      <ellipse cx="48" cy="74" rx="25" ry="4" fill="rgba(15,23,42,0.16)" />

      {/* Fluffy Tail (left side, since Cimi faces right when scaleX=1) */}
      <circle cx="19" cy="56" r="7.5" fill="#F3F4F6" stroke="#4B5563" strokeWidth="1.8" />

      {/* Back & Hind Foot */}
      <ellipse cx="33" cy="69" rx="10" ry="4.8" fill="#E5E7EB" stroke="#4B5563" strokeWidth="1.8" />

      {/* Chubby Body */}
      <ellipse
        cx="42"
        cy="54"
        rx="22"
        ry="16.5"
        fill="#B8BCC4"
        stroke="#4B5563"
        strokeWidth="2"
      />
      <ellipse cx="47" cy="57" rx="12" ry="11" fill="#F3F4F6" />

      {/* Front Paw */}
      <ellipse cx="56" cy="69" rx="6.5" ry="4.5" fill="#F3F4F6" stroke="#4B5563" strokeWidth="1.8" />

      {/* Pastel Blue Ribbon Bow on Back/Collar */}
      <g transform="translate(46, 39) rotate(-14)">
        <path d="M-1 0 L-10 -5 L-8 5 Z" fill="#93C5FD" stroke="#1E3A5F" strokeWidth="1.3" />
        <path d="M1 0 L10 -5 L8 5 Z" fill="#93C5FD" stroke="#1E3A5F" strokeWidth="1.3" />
        <circle cx="0" cy="0" r="3" fill="#60A5FA" stroke="#1E3A5F" strokeWidth="1.2" />
      </g>

      {/* Head */}
      <ellipse
        cx="60"
        cy="38"
        rx="18.5"
        ry="15.5"
        fill="#C6CAD2"
        stroke="#4B5563"
        strokeWidth="2"
      />

      {/* Upright / Perked Left Ear */}
      <g transform="translate(55, 19) rotate(-12)">
        <ellipse cx="0" cy="-6" rx="5.2" ry="13.5" fill="#AEB3BC" stroke="#4B5563" strokeWidth="1.9" />
        <ellipse cx="0" cy="-5" rx="2.4" ry="8.5" fill="#FBCFE8" />
      </g>

      {/* Signature Lopped / Droopy Ear (satu telinga jatuh sebelah!) */}
      <g transform="translate(46, 30) rotate(24)">
        <ellipse cx="-2" cy="13" rx="5.6" ry="14" fill="#9CA1AB" stroke="#4B5563" strokeWidth="1.9" />
        <ellipse cx="-2" cy="14" rx="2.4" ry="8.5" fill="#F9A8D4" fillOpacity="0.65" />
      </g>

      {/* Muzzle & Cheeks */}
      <ellipse cx="67" cy="43" rx="8.5" ry="6.2" fill="#F8FAFC" />
      <ellipse cx="58" cy="42" rx="3.4" ry="2" fill="#FDA4AF" fillOpacity="0.7" />

      {/* Eyes */}
      {isSleeping ? (
        <path
          d="M61 35.5 Q64 38.5 67 35.5"
          fill="none"
          stroke="#1F2937"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ) : (
        <g>
          <circle cx="64.5" cy="35" r={isExcited ? 3 : 2.6} fill="#111827" />
          <circle cx="63.6" cy="34" r="1" fill="#FFFFFF" />
        </g>
      )}

      {/* Pink Nose & Whiskers */}
      <ellipse cx="74" cy="41.5" rx="2.3" ry="1.7" fill="#FB7185" />
      <path
        d="M71 45 Q73.5 47 75.5 44.8"
        fill="none"
        stroke="#374151"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <g stroke="#6B7280" strokeWidth="1" opacity="0.7">
        <line x1="72" y1="43" x2="82" y2="41" />
        <line x1="72" y1="45" x2="82" y2="46" />
      </g>
    </svg>
  );
}

export default function CimiWalker({ visible = true, feedSignal = 0, onHide }) {
  const [x, setX] = useState(80);
  const [dir, setDir] = useState(1); // 1 = right, -1 = left
  const [mode, setMode] = useState('walk'); // 'walk' | 'sleep' | 'binky' | 'excited'
  const [speech, setSpeech] = useState(null);
  const [hearts, setHearts] = useState([]);

  const stateRef = useRef({ x: 80, dir: 1, mode: 'walk' });
  const modeTimerRef = useRef(null);
  const speechTimerRef = useRef(null);
  const lastFeedRef = useRef(0);

  useEffect(() => {
    stateRef.current.mode = mode;
  }, [mode]);

  const showBubble = (text, duration = 2300) => {
    setSpeech({ id: Date.now(), text });
    if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
    speechTimerRef.current = setTimeout(() => setSpeech(null), duration);
  };

  const spawnHearts = () => {
    const now = Date.now();
    const list = [0, 1, 2].map((i) => ({
      id: `${now}-${i}`,
      dx: (i - 1) * 18 + (Math.random() - 0.5) * 8,
      dy: -34 - Math.random() * 18,
    }));
    setHearts((prev) => [...prev.slice(-6), ...list]);
    setTimeout(() => {
      const ids = new Set(list.map((h) => h.id));
      setHearts((prev) => prev.filter((h) => !ids.has(h.id)));
    }, 900);
  };

  // Autonomous Walk / Sleep / Binky Scheduler
  useEffect(() => {
    if (!visible) return undefined;

    let cancelled = false;
    const scheduleNextBehavior = () => {
      const delay = 5200 + Math.random() * 4800;
      modeTimerRef.current = setTimeout(() => {
        if (cancelled) return;
        if (stateRef.current.mode === 'walk') {
          const roll = Math.random();
          if (roll < 0.52) {
            setMode('sleep');
            setTimeout(() => {
              if (!cancelled && stateRef.current.mode === 'sleep') {
                setMode('walk');
              }
            }, 3400 + Math.random() * 2000);
          } else {
            setMode('binky');
            setTimeout(() => {
              if (!cancelled && stateRef.current.mode === 'binky') {
                setMode('walk');
              }
            }, 1250);
          }
        }
        scheduleNextBehavior();
      }, delay);
    };

    scheduleNextBehavior();
    return () => {
      cancelled = true;
      if (modeTimerRef.current) clearTimeout(modeTimerRef.current);
    };
  }, [visible]);

  // Smooth horizontal walk animation loop
  useEffect(() => {
    if (!visible) return undefined;

    let rafId = null;
    let lastTime = performance.now();

    const step = (now) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      const curMode = stateRef.current.mode;
      if (curMode === 'walk' || curMode === 'excited') {
        const speed = curMode === 'excited' ? 105 : 44;
        const marginRight = window.innerWidth < 640 ? 64 : 96;
        const maxBound = Math.max(96, window.innerWidth - marginRight);
        let nextX = stateRef.current.x + stateRef.current.dir * speed * dt;
        let nextDir = stateRef.current.dir;

        if (nextX >= maxBound) {
          nextX = maxBound;
          nextDir = -1;
        } else if (nextX <= 16) {
          nextX = 16;
          nextDir = 1;
        }

        if (nextDir !== stateRef.current.dir) {
          stateRef.current.dir = nextDir;
          setDir(nextDir);
        }
        stateRef.current.x = nextX;
        setX(nextX);
      }

      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [visible]);

  // React enthusiastically whenever user feeds Cimi!
  useEffect(() => {
    if (!visible || feedSignal <= 0 || feedSignal === lastFeedRef.current) return;
    lastFeedRef.current = feedSignal;

    setMode('excited');
    spawnHearts();
    showBubble('Kres kres! Makasih cemilannya! 🥕', 2400);

    const t = setTimeout(() => {
      setMode((cur) => (cur === 'excited' ? 'walk' : cur));
    }, 2600);
    return () => clearTimeout(t);
  }, [feedSignal, visible]);

  useEffect(
    () => () => {
      if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
    },
    []
  );

  if (!visible) return null;

  const handleClick = () => {
    playHappyPop();
    spawnHearts();
    setMode('binky');
    showBubble(WALKER_QUOTES[Math.floor(Math.random() * WALKER_QUOTES.length)], 2400);
    setTimeout(() => {
      setMode((cur) => (cur === 'binky' ? 'walk' : cur));
    }, 1150);
  };

  return (
    <div
      className="no-print print:hidden fixed bottom-0 inset-x-0 h-0 z-40 pointer-events-none"
      aria-label="Karakter mini Cimi berjalan di layar"
    >
      <div
        className="pointer-events-auto absolute bottom-0 group cursor-pointer select-none"
        style={{
          transform: `translate3d(${x}px, 0, 0)`,
        }}
        onClick={handleClick}
        title="Klik Cimi!"
      >
        {/* Tiny Hide Button on Hover */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onHide?.();
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-2 -right-1 z-20 w-5 h-5 rounded-full bg-slate-800/85 hover:bg-slate-900 text-white flex items-center justify-center shadow"
          title="Sembunyikan Cimi Walker"
          aria-label="Sembunyikan Cimi Walker"
        >
          <X className="w-3 h-3" />
        </button>

        {/* Speech Tooltip */}
        <AnimatePresence>
          {speech && (
            <motion.div
              key={speech.id}
              initial={{ opacity: 0, y: 8, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.92 }}
              className="absolute bottom-[50px] sm:bottom-[74px] left-1/2 -translate-x-1/2 whitespace-nowrap px-2.5 sm:px-3 py-1 rounded-full bg-white text-slate-800 text-[10px] sm:text-[11px] font-bold shadow-lg border border-slate-200 pointer-events-none"
            >
              {speech.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Hearts on Click / Feed */}
        <div className="absolute inset-x-0 bottom-8 sm:bottom-12 flex justify-center pointer-events-none">
          {hearts.map((h) => (
            <motion.span
              key={h.id}
              initial={{ x: 0, y: 0, opacity: 1, scale: 0.7 }}
              animate={{ x: h.dx, y: h.dy, opacity: 0, scale: 1.25 }}
              transition={{ duration: 0.85, ease: 'easeOut' }}
              className="absolute text-sm"
            >
              💖
            </motion.span>
          ))}
        </div>

        {/* Sleeping Floating Zzz Bubbles */}
        {mode === 'sleep' && (
          <div className="absolute -top-6 right-1 pointer-events-none">
            {[0, 1].map((i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 4, x: 0 }}
                animate={{
                  opacity: [0, 0.95, 0],
                  y: [-2, -20],
                  x: [0, 6 + i * 4],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  delay: i * 0.7,
                }}
                className="absolute font-mono text-[11px] font-extrabold text-sky-700"
              >
                Z
              </motion.span>
            ))}
          </div>
        )}

        {/* Animated Character Body */}
        <motion.div
          animate={
            mode === 'binky'
              ? {
                  y: [0, -28, 0],
                  rotate: [0, -14, 14, 0],
                  scale: [1, 1.08, 1],
                }
              : mode === 'excited'
              ? {
                  y: [0, -12, 0],
                  scaleY: [1, 1.06, 0.94, 1],
                }
              : mode === 'sleep'
              ? {
                  y: 3,
                  scaleY: [0.92, 0.95, 0.92],
                  scaleX: 1.05,
                }
              : {
                  y: [0, -5, 0],
                  rotate: [-1.5, 1.5, -1.5],
                }
          }
          transition={
            mode === 'binky'
              ? { duration: 0.65, repeat: 1 }
              : mode === 'excited'
              ? { duration: 0.34, repeat: Infinity }
              : mode === 'sleep'
              ? { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }
              : { duration: 0.55, repeat: Infinity, ease: 'easeInOut' }
          }
        >
          <div
            style={{
              transform: `scaleX(${dir})`,
              transition: 'transform 160ms ease',
            }}
          >
            <MiniCimiSvg mode={mode} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
