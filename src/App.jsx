import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import { Cake, CheckCircle2, RotateCw } from 'lucide-react';
import CertificateBack from './components/CertificateBack.jsx';
import CertificateFront from './components/CertificateFront.jsx';
import CimiGalleryModal from './components/CimiGalleryModal.jsx';
import CimiMemoriesFolder from './components/CimiMemoriesFolder.jsx';
import CimiWalker from './components/CimiWalker.jsx';
import EditDrawer from './components/EditDrawer.jsx';
import { StampPalette } from './components/FunStamps.jsx';
import PawrentLoginModal from './components/PawrentLoginModal.jsx';
import PetCareDock from './components/PetCareDock.jsx';
import PhotoLightbox from './components/PhotoLightbox.jsx';
import Toolbar from './components/Toolbar.jsx';
import { getConfiguredCimiPhotos } from './data/cimiPhotos.js';
import {
  DEFAULT_DATA,
  loadCustomStamps,
  loadPetStats,
  loadSavedData,
  saveCustomStamps,
  saveData,
  savePetStats,
} from './data/defaultData.js';
import { STAMP_INKS, THEMES } from './data/themes.js';
import { isSupabaseConfigured, supabase } from './lib/supabase.js';
import { computeBunnyAgeInfo } from './utils/ageHelper.js';
import {
  deleteCloudPhoto,
  fetchCloudCertificate,
  fetchCloudPhotos,
  saveCloudCertificate,
  subscribeCloudUpdates,
  uploadCertificateImageToCloud,
  uploadCloudPhotos,
} from './utils/cimiCloud.js';
import {
  deleteIndexedDbPhoto,
  loadIndexedDbPhotos,
  saveIndexedDbPhotos,
} from './utils/cimiDb.js';
import {
  getSfxEnabled,
  playCrunch,
  playHappyPop,
  playPaperFlip,
  playStampThud,
  setSfxEnabled,
} from './utils/soundEffects.js';

const CARD_WIDTH = 1122;
const CARD_HEIGHT = 794;

export default function App() {
  const [data, setData] = useState(() => loadSavedData());
  const [isFlipped, setIsFlipped] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState('main');

  const [stampKey, setStampKey] = useState(0);
  const [isShaking, setIsShaking] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState('');

  const [lightboxState, setLightboxState] = useState(null);
  const [stageScale, setStageScale] = useState(1);

  const [cimiModalOpen, setCimiModalOpen] = useState(false);
  const [cimiInitialAlbum, setCimiInitialAlbum] = useState('all');
  const [uploadedCimiPhotos, setUploadedCimiPhotos] = useState([]);
  const [cloudCimiPhotos, setCloudCimiPhotos] = useState([]);

  // Supabase Auth (Public Read-Only vs Mode Pawrent)
  const [session, setSession] = useState(null);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [cloudSyncStatus, setCloudSyncStatus] = useState('idle'); // 'idle' | 'saving' | 'saved' | 'error'

  const isAdmin = Boolean(session?.user);
  const pawrentEmail = session?.user?.email || '';

  // Upgrade 2: SFX Mute State
  const [sfxEnabled, setSfxState] = useState(() => getSfxEnabled());

  // Upgrade 3: Mini Virtual Pet State
  const [petStats, setPetStats] = useState(() => loadPetStats());
  const [petEvent, setPetEvent] = useState(null);
  const [feedEvent, setFeedEvent] = useState(null);
  const [walkerFeedSignal, setWalkerFeedSignal] = useState(0);

  // Upgrade 4: Free Stamp Mode State
  const [stampMode, setStampMode] = useState(false);
  const [selectedStampType, setSelectedStampType] = useState('gigit-kardus');
  const [customStamps, setCustomStamps] = useState(() => loadCustomStamps());
  const [latestStampId, setLatestStampId] = useState(null);

  // Upgrade 5: Cimi Walker Visibility
  const [showWalker, setShowWalker] = useState(() => {
    try {
      return localStorage.getItem('akta-kelinci-walker-v1') !== 'false';
    } catch {
      return true;
    }
  });

  // Upgrade 6: Real-time Clock Tick for Age Pill
  const [nowTick, setNowTick] = useState(() => new Date());

  // Disable 3D cursor tilt on touch/mobile devices (< 768px or pointer: coarse)
  const [isMobileOrTouch, setIsMobileOrTouch] = useState(() => {
    if (typeof window === 'undefined') return false;
    return (
      window.innerWidth < 768 ||
      (typeof window.matchMedia === 'function' &&
        window.matchMedia('(pointer: coarse)').matches)
    );
  });

  const stageWrapRef = useRef(null);
  const tiltCardRef = useRef(null);
  const exportNodeRef = useRef(null);
  const toastTimerRef = useRef(null);
  const flipTimerRef = useRef(null);
  const cloudSaveTimerRef = useRef(null);
  const dirtyCloudRef = useRef(false);
  const cimiUrlCacheRef = useRef(new Map());

  // Upgrade 1: 3D Tilt Spring Motion Values
  const rawTiltX = useMotionValue(0);
  const rawTiltY = useMotionValue(0);
  const springTiltX = useSpring(rawTiltX, { stiffness: 220, damping: 24 });
  const springTiltY = useSpring(rawTiltY, { stiffness: 220, damping: 24 });

  const tiltEnabled =
    !isMobileOrTouch &&
    !isFlipping &&
    !stampMode &&
    !isExporting &&
    !drawerOpen &&
    !cimiModalOpen &&
    !loginModalOpen &&
    !lightboxState;

  const theme = THEMES[data.themeId] || THEMES['klasik-krem'];
  const stampInkColor =
    STAMP_INKS[data.stampInk]?.color || STAMP_INKS.red.color;

  const showToast = useCallback((message) => {
    setToast(message);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(''), 3200);
  }, []);

  // Persist changes to localStorage cache
  useEffect(() => {
    const ok = saveData(data);
    if (!ok) {
      showToast('Penyimpanan lokal penuh — kurangi ukuran foto.');
    }
  }, [data, showToast]);

  // Supabase Auth session listener
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return undefined;

    let mounted = true;
    supabase.auth
      .getSession()
      .then(({ data: sessionData }) => {
        if (mounted) setSession(sessionData?.session ?? null);
      })
      .catch(() => {});

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        if (!mounted) return;
        setSession(nextSession ?? null);
        if (!nextSession) {
          setDrawerOpen(false);
        }
      }
    );

    return () => {
      mounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Fetch initial Certificate + Gallery Photos from Supabase Cloud & subscribe to real-time updates
  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;

    let active = true;

    const refreshCloudCertificate = () => {
      fetchCloudCertificate()
        .then((cloudCert) => {
          if (active && cloudCert && !dirtyCloudRef.current) {
            setData(cloudCert);
          }
        })
        .catch(() => {});
    };

    const refreshCloudPhotos = () => {
      fetchCloudPhotos()
        .then((rows) => {
          if (active) setCloudCimiPhotos(rows);
        })
        .catch(() => {});
    };

    refreshCloudCertificate();
    refreshCloudPhotos();

    const unsubscribe = subscribeCloudUpdates({
      onPhotosChange: refreshCloudPhotos,
      onCertificateChange: refreshCloudCertificate,
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  // Debounced cloud save of certificate changes when Pawrent edits data
  useEffect(() => {
    if (!isSupabaseConfigured || !isAdmin || !dirtyCloudRef.current) {
      return undefined;
    }

    setCloudSyncStatus('saving');
    if (cloudSaveTimerRef.current) clearTimeout(cloudSaveTimerRef.current);

    cloudSaveTimerRef.current = setTimeout(() => {
      saveCloudCertificate(data)
        .then(() => {
          dirtyCloudRef.current = false;
          setCloudSyncStatus('saved');
        })
        .catch(() => {
          setCloudSyncStatus('error');
          showToast('Gagal menyimpan perubahan akta ke Supabase.');
        });
    }, 650);

    return () => {
      if (cloudSaveTimerRef.current) clearTimeout(cloudSaveTimerRef.current);
    };
  }, [data, isAdmin, showToast]);

  // Persist Pet Stats & Custom Stamps & Walker Visibility
  useEffect(() => {
    savePetStats(petStats);
  }, [petStats]);

  useEffect(() => {
    saveCustomStamps(customStamps);
  }, [customStamps]);

  useEffect(() => {
    try {
      localStorage.setItem('akta-kelinci-walker-v1', showWalker ? 'true' : 'false');
    } catch {
      // Ignore storage error
    }
  }, [showWalker]);

  // Update real-time clock every minute for Age & Birthday Countdown Pill
  useEffect(() => {
    const timer = setInterval(() => setNowTick(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Track mobile / coarse-pointer state for disabling 3D tilt on phones/tablets
  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const mq =
      typeof window.matchMedia === 'function'
        ? window.matchMedia('(pointer: coarse)')
        : null;

    const updateMobileFlag = () => {
      setIsMobileOrTouch(window.innerWidth < 768 || Boolean(mq?.matches));
    };

    updateMobileFlag();
    window.addEventListener('resize', updateMobileFlag);
    mq?.addEventListener?.('change', updateMobileFlag);
    return () => {
      window.removeEventListener('resize', updateMobileFlag);
      mq?.removeEventListener?.('change', updateMobileFlag);
    };
  }, []);

  // Flatten 3D Tilt & Foil Shimmer automatically during flip, stamp mode, export, or modals
  useEffect(() => {
    if (!tiltEnabled) {
      rawTiltX.set(0);
      rawTiltY.set(0);
      if (tiltCardRef.current) {
        tiltCardRef.current.style.setProperty('--foil-op', '0');
      }
    }
  }, [tiltEnabled, rawTiltX, rawTiltY]);

  // Responsive A4 scaling via ResizeObserver
  useEffect(() => {
    const el = stageWrapRef.current;
    if (!el) return undefined;

    const updateScale = () => {
      const availWidth = el.clientWidth;
      if (availWidth > 0) {
        const nextScale = Math.min(1, Math.max(0.24, availWidth / CARD_WIDTH));
        setStageScale(nextScale);
      }
    };

    updateScale();
    const ro = new ResizeObserver(updateScale);
    ro.observe(el);
    window.addEventListener('resize', updateScale);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, []);

  // Load Cimi's Memories photos from IndexedDB on mount (local fallback when Supabase is not configured)
  useEffect(() => {
    if (isSupabaseConfigured) return undefined;
    let active = true;
    const urlCache = cimiUrlCacheRef.current;

    loadIndexedDbPhotos()
      .then((records) => {
        if (!active) return;
        const mapped = records.map((rec) => {
          if (!urlCache.has(rec.id) && rec.blob) {
            urlCache.set(rec.id, URL.createObjectURL(rec.blob));
          }
          return {
            id: rec.id,
            src: urlCache.get(rec.id) || '',
            album: rec.album || 'baby-cimi',
            caption: rec.caption || 'Momen Cimi',
            date: rec.date || '',
            format: rec.format || 'JPG',
            createdAt: rec.createdAt || 0,
            source: 'indexeddb',
          };
        });
        setUploadedCimiPhotos(mapped);
      })
      .catch(() => {
        // Ignore IndexedDB unavailability gracefully; static & public/cimi photos still work
      });

    return () => {
      active = false;
      for (const url of urlCache.values()) {
        URL.revokeObjectURL(url);
      }
      urlCache.clear();
    };
  }, []);

  const configuredCimiPhotos = useMemo(() => getConfiguredCimiPhotos(), []);
  const allCimiPhotos = useMemo(() => {
    const dynamicPhotos = isSupabaseConfigured ? cloudCimiPhotos : uploadedCimiPhotos;
    const seenSrc = new Set(dynamicPhotos.map((p) => p.src));
    const filteredDefault = configuredCimiPhotos.filter((p) => !seenSrc.has(p.src));
    return [...dynamicPhotos, ...filteredDefault];
  }, [cloudCimiPhotos, uploadedCimiPhotos, configuredCimiPhotos]);

  const handleOpenCimiGallery = useCallback((albumId = 'all') => {
    setCimiInitialAlbum(albumId || 'all');
    setCimiModalOpen(true);
  }, []);

  const handleAddCimiPhotos = useCallback(
    async (records) => {
      if (!isAdmin) return;

      if (isSupabaseConfigured) {
        const uploaded = await uploadCloudPhotos(records);
        setCloudCimiPhotos((prev) => [...uploaded, ...prev]);
        showToast(`${uploaded.length} foto berhasil diunggah ke Supabase Cloud!`);
        return;
      }

      await saveIndexedDbPhotos(records);
      const urlCache = cimiUrlCacheRef.current;
      const mapped = records.map((rec) => {
        if (!urlCache.has(rec.id) && rec.blob) {
          urlCache.set(rec.id, URL.createObjectURL(rec.blob));
        }
        return {
          id: rec.id,
          src: urlCache.get(rec.id) || '',
          album: rec.album || 'baby-cimi',
          caption: rec.caption || 'Momen Cimi',
          date: rec.date || '',
          format: rec.format || 'JPG',
          createdAt: rec.createdAt || Date.now(),
          source: 'indexeddb',
        };
      });
      setUploadedCimiPhotos((prev) => [...mapped, ...prev]);
      showToast(`${records.length} foto berhasil disimpan ke Cimi's Memories!`);
    },
    [isAdmin, showToast]
  );

  const handleDeleteCimiPhoto = useCallback(
    async (photo) => {
      if (!isAdmin || !photo) return;

      if (photo.source === 'supabase' && isSupabaseConfigured) {
        try {
          await deleteCloudPhoto(photo);
          setCloudCimiPhotos((prev) => prev.filter((item) => item.id !== photo.id));
          showToast('Foto dihapus dari Supabase Storage & Database.');
        } catch (err) {
          showToast(err?.message || 'Gagal menghapus foto di cloud.');
        }
        return;
      }

      await deleteIndexedDbPhoto(photo.id);
      setUploadedCimiPhotos((prev) => prev.filter((item) => item.id !== photo.id));
      const url = cimiUrlCacheRef.current.get(photo.id);
      if (url) {
        URL.revokeObjectURL(url);
        cimiUrlCacheRef.current.delete(photo.id);
      }
      showToast('Foto dihapus dari Cimi\'s Memories.');
    },
    [isAdmin, showToast]
  );

  const handlePawrentDataChange = useCallback(
    (updater) => {
      if (isAdmin && isSupabaseConfigured) {
        dirtyCloudRef.current = true;
      }
      setData(updater);
    },
    [isAdmin]
  );

  const handleOpenEdit = (tab = 'main') => {
    if (!isAdmin) return;
    setDrawerTab(tab);
    setDrawerOpen(true);
  };

  const handleCloseEdit = () => {
    setDrawerOpen(false);
    if (isAdmin && isSupabaseConfigured && dirtyCloudRef.current) {
      if (cloudSaveTimerRef.current) clearTimeout(cloudSaveTimerRef.current);
      setCloudSyncStatus('saving');
      saveCloudCertificate(data)
        .then(() => {
          dirtyCloudRef.current = false;
          setCloudSyncStatus('saved');
        })
        .catch(() => {
          setCloudSyncStatus('error');
          showToast('Gagal menyimpan perubahan akta ke Supabase.');
        });
    }
  };

  const handleResetData = () => {
    if (!isAdmin) return;
    const fresh = structuredClone(DEFAULT_DATA);
    if (isSupabaseConfigured) {
      dirtyCloudRef.current = true;
    }
    setData(fresh);
    showToast('Data akta dikembalikan ke pengaturan default.');
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut().catch(() => {});
    }
    setSession(null);
    setDrawerOpen(false);
    showToast('Berhasil keluar dari Mode Pawrent.');
  };

  const fireConfetti = useCallback(() => {
    const colors = [
      theme.primary,
      theme.secondary,
      stampInkColor,
      '#F59E0B',
      '#FDE68A',
    ];
    confetti({
      particleCount: 55,
      spread: 68,
      angle: 60,
      origin: { x: 0.18, y: 0.65 },
      colors,
    });
    confetti({
      particleCount: 55,
      spread: 68,
      angle: 120,
      origin: { x: 0.82, y: 0.65 },
      colors,
    });
  }, [theme.primary, theme.secondary, stampInkColor]);

  const handleCertify = () => {
    const triggerStampEffect = () => {
      setData((prev) => ({ ...prev, showStamp: true }));
      setStampKey((k) => k + 1);

      setTimeout(() => {
        playStampThud();
        setIsShaking(true);
        fireConfetti();
        showToast(
          `Akta "${data.fullName || 'Kelinci'}" resmi disahkan & tercatat!`
        );
        setTimeout(() => setIsShaking(false), 380);
      }, 150);
    };

    if (isFlipped) {
      setIsFlipping(true);
      setIsFlipped(false);
      if (flipTimerRef.current) clearTimeout(flipTimerRef.current);
      flipTimerRef.current = setTimeout(() => setIsFlipping(false), 880);
      setTimeout(triggerStampEffect, 560);
    } else {
      triggerStampEffect();
    }
  };

  const handleFlip = () => {
    playPaperFlip();
    setIsFlipping(true);
    setIsFlipped((v) => !v);
    if (flipTimerRef.current) clearTimeout(flipTimerRef.current);
    flipTimerRef.current = setTimeout(() => setIsFlipping(false), 880);
  };

  const handleToggleSfx = () => {
    const next = !sfxEnabled;
    setSfxEnabled(next);
    setSfxState(next);
    if (next) {
      playHappyPop();
      showToast('Efek suara (SFX) diaktifkan.');
    } else {
      showToast('Efek suara (SFX) dimatikan.');
    }
  };

  const handlePetCimi = useCallback(() => {
    playHappyPop();
    setPetStats((prev) => ({ ...prev, pets: prev.pets + 1 }));
    setPetEvent({ id: Date.now() + Math.random() });
  }, []);

  const handleFeedCimi = useCallback(
    (food = 'carrot') => {
      playCrunch();
      setPetStats((prev) => ({ ...prev, snacks: prev.snacks + 1 }));
      setFeedEvent({ id: Date.now() + Math.random(), food });
      setWalkerFeedSignal((s) => s + 1);
      if (isFlipped) {
        showToast(
          food === 'hay'
            ? 'Cimi mengunyah Timothy Hay dengan lahap! 🌿'
            : 'Cimi melahap wortel segar! 🥕'
        );
      }
    },
    [isFlipped, showToast]
  );

  const handlePlaceStamp = useCallback(
    (e) => {
      if (!stampMode) return;
      const rect = e.currentTarget.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      const x = Math.round(((e.clientX - rect.left) / rect.width) * CARD_WIDTH);
      const y = Math.round(((e.clientY - rect.top) / rect.height) * CARD_HEIGHT);
      const rotate = Number(((Math.random() - 0.5) * 30).toFixed(1));
      const side = isFlipped ? 'back' : 'front';
      const id = `stamp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

      playStampThud();
      setLatestStampId(id);
      setCustomStamps((prev) => [
        ...prev,
        { id, type: selectedStampType, side, x, y, rotate },
      ]);
    },
    [stampMode, isFlipped, selectedStampType]
  );

  const handleUndoStamp = () => {
    const activeSide = isFlipped ? 'back' : 'front';
    setCustomStamps((prev) => {
      const idx = [...prev].reverse().findIndex((s) => s.side === activeSide);
      if (idx === -1) return prev;
      const realIdx = prev.length - 1 - idx;
      return [...prev.slice(0, realIdx), ...prev.slice(realIdx + 1)];
    });
  };

  const handleClearStamps = () => {
    setCustomStamps([]);
    setLatestStampId(null);
    showToast('Semua cap stempel bebas dibersihkan.');
  };

  const handleCardPointerMove = (e) => {
    if (!tiltEnabled || e.pointerType === 'touch' || !tiltCardRef.current) return;
    const rect = tiltCardRef.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const nx = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const ny = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));

    rawTiltY.set((nx - 0.5) * 11);
    rawTiltX.set((0.5 - ny) * 10);

    tiltCardRef.current.style.setProperty('--foil-x', `${(nx * 100).toFixed(1)}%`);
    tiltCardRef.current.style.setProperty('--foil-y', `${(ny * 100).toFixed(1)}%`);
    tiltCardRef.current.style.setProperty('--foil-op', '1');
  };

  const handleCardPointerLeave = () => {
    rawTiltX.set(0);
    rawTiltY.set(0);
    if (tiltCardRef.current) {
      tiltCardRef.current.style.setProperty('--foil-op', '0');
    }
  };

  const handleDownloadPng = async () => {
    if (isExporting || !exportNodeRef.current) return;
    setIsExporting(true);

    try {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      // Ensure all images in export container are decoded
      const imgs = Array.from(exportNodeRef.current.querySelectorAll('img'));
      await Promise.all(
        imgs.map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((res) => {
            img.onload = res;
            img.onerror = res;
          });
        })
      );

      await new Promise((r) =>
        requestAnimationFrame(() => requestAnimationFrame(r))
      );

      const canvas = await html2canvas(exportNodeRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: false,
        backgroundColor: theme.paperBg,
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        windowWidth: CARD_WIDTH,
        windowHeight: CARD_HEIGHT,
        logging: false,
      });

      const slug = (data.fullName || 'kelinci')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      const side = isFlipped ? 'belakang' : 'depan';
      const link = document.createElement('a');
      link.download = `akta-kelinci-${slug || 'resmi'}-${side}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      showToast(`PNG Sisi ${isFlipped ? 'Belakang' : 'Depan'} berhasil diunduh!`);
    } catch {
      showToast('Gagal mengunduh gambar PNG. Silakan coba lagi.');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Lightbox helpers
  const galleryItems = useMemo(
    () =>
      (data.gallery || [])
        .map((slot, idx) =>
          slot.image
            ? {
                index: idx,
                src: slot.image,
                caption: slot.caption || `Foto Galeri 0${idx + 1}`,
              }
            : null
        )
        .filter(Boolean),
    [data.gallery]
  );

  const openFrontPhotoLightbox = () => {
    if (!data.photo) return;
    setLightboxState({
      items: [
        {
          src: data.photo,
          caption: `Pas Foto Resmi — ${data.fullName || 'Kelinci'}`,
        },
      ],
      index: 0,
    });
  };

  const openGalleryLightbox = (slotIdx) => {
    const pos = galleryItems.findIndex((g) => g.index === slotIdx);
    if (pos >= 0) {
      setLightboxState({ items: galleryItems, index: pos });
    }
  };

  const navigateLightbox = (delta) => {
    setLightboxState((prev) => {
      if (!prev || prev.items.length <= 1) return prev;
      const next = (prev.index + delta + prev.items.length) % prev.items.length;
      return { ...prev, index: next };
    });
  };

  const scaledWidth = Math.round(CARD_WIDTH * stageScale);
  const scaledHeight = Math.round(CARD_HEIGHT * stageScale);

  const frontStamps = useMemo(
    () => customStamps.filter((s) => s.side === 'front'),
    [customStamps]
  );
  const backStamps = useMemo(
    () => customStamps.filter((s) => s.side === 'back'),
    [customStamps]
  );
  const ageInfo = useMemo(
    () => computeBunnyAgeInfo(data.birthPlaceDate, nowTick),
    [data.birthPlaceDate, nowTick]
  );
  const displayBunnyName = data.nickname
    ? data.nickname.split('/')[0].trim()
    : data.fullName || 'Cimi';

  return (
    <div
      className="min-h-screen transition-colors duration-300 flex flex-col"
      style={{ backgroundColor: theme.pageBg }}
    >
      {/* Top Interactive Toolbar */}
      <Toolbar
        theme={theme}
        themeId={data.themeId}
        onSelectTheme={(id) => {
          if (isAdmin && isSupabaseConfigured) {
            dirtyCloudRef.current = true;
          }
          setData((prev) => ({ ...prev, themeId: id }));
        }}
        isFlipped={isFlipped}
        onFlip={handleFlip}
        onCertify={handleCertify}
        stampMode={stampMode}
        onToggleStampMode={() => setStampMode((v) => !v)}
        sfxEnabled={sfxEnabled}
        onToggleSfx={handleToggleSfx}
        showWalker={showWalker}
        onToggleWalker={() => setShowWalker((v) => !v)}
        isAdmin={isAdmin}
        pawrentEmail={pawrentEmail}
        onOpenLogin={() => setLoginModalOpen(true)}
        onLogout={handleLogout}
        onOpenEdit={handleOpenEdit}
        onDownloadPng={handleDownloadPng}
        isExporting={isExporting}
        onPrint={handlePrint}
      />

      {/* Interactive Certificate Stage (Screen Only) */}
      <main className="screen-only print:hidden w-full max-w-[1220px] mx-auto px-3 sm:px-6 pt-4 sm:pt-6 pb-3 flex flex-col items-center">
        {/* Live Age & Birthday Countdown Pill Badge */}
        {ageInfo && (
          <div
            className="no-print print:hidden mb-3.5 inline-flex flex-wrap items-center justify-center gap-1.5 px-4 py-1.5 rounded-full bg-white/85 backdrop-blur-md border shadow-sm text-xs font-medium text-slate-700"
            style={{ borderColor: theme.divider }}
          >
            <Cake className="w-3.5 h-3.5 shrink-0" style={{ color: theme.primary }} />
            <span>
              Usia <strong style={{ color: theme.primary }}>{displayBunnyName}</strong>:{' '}
              <strong className="text-slate-900">{ageInfo.ageText}</strong>
            </span>
            <span className="text-slate-400">•</span>
            <span className="font-semibold" style={{ color: theme.secondaryDark || theme.primary }}>
              {ageInfo.countdownText}
            </span>
          </div>
        )}

        {/* Floating Stamp Mode Mini-Palette */}
        {stampMode && (
          <StampPalette
            selectedType={selectedStampType}
            onSelectType={setSelectedStampType}
            onUndo={handleUndoStamp}
            onClear={handleClearStamps}
            totalCount={customStamps.length}
            sideCount={isFlipped ? backStamps.length : frontStamps.length}
            activeSideLabel={isFlipped ? 'Belakang' : 'Depan'}
            onClose={() => setStampMode(false)}
            theme={theme}
          />
        )}

        <div ref={stageWrapRef} className="w-full flex justify-center">
          <div
            className={`relative ${isShaking ? 'animate-paper-thud' : ''}`}
            style={{
              width: `${scaledWidth}px`,
              height: `${scaledHeight}px`,
            }}
          >
            <div
              className="origin-top-left"
              style={{
                width: `${CARD_WIDTH}px`,
                height: `${CARD_HEIGHT}px`,
                transform: `scale(${stageScale})`,
              }}
            >
              <div className="flip-scene w-full h-full">
                <motion.div
                  ref={tiltCardRef}
                  onPointerMove={isMobileOrTouch ? undefined : handleCardPointerMove}
                  onPointerLeave={isMobileOrTouch ? undefined : handleCardPointerLeave}
                  style={
                    isMobileOrTouch
                      ? {
                          WebkitTransformStyle: 'preserve-3d',
                          transformStyle: 'preserve-3d',
                        }
                      : {
                          rotateX: springTiltX,
                          rotateY: springTiltY,
                          WebkitTransformStyle: 'preserve-3d',
                          transformStyle: 'preserve-3d',
                        }
                  }
                  className="flip-tilt-layer w-full h-full"
                >
                  <div
                    className={`flip-card rounded-sm shadow-[0_24px_60px_rgba(15,23,42,0.18)] ${
                      isFlipped ? 'is-flipped' : ''
                    }`}
                    style={{
                      WebkitTransformStyle: 'preserve-3d',
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    {/* Front Side */}
                    <div
                      className={`flip-face flip-face-front ${
                        isFlipped ? 'flip-face-hidden' : 'flip-face-visible'
                      }`}
                      style={{
                        WebkitBackfaceVisibility: 'hidden',
                        backfaceVisibility: 'hidden',
                      }}
                      aria-hidden={isFlipped}
                    >
                      <CertificateFront
                        data={data}
                        theme={theme}
                        stampInkColor={stampInkColor}
                        stampKey={stampKey}
                        onPhotoClick={openFrontPhotoLightbox}
                        customStamps={frontStamps}
                        latestStampId={latestStampId}
                        stampMode={stampMode}
                        onPlaceStamp={handlePlaceStamp}
                        petEvent={petEvent}
                        feedEvent={feedEvent}
                        onPet={handlePetCimi}
                        onFeed={handleFeedCimi}
                      />
                    </div>

                    {/* Back Side */}
                    <div
                      className={`flip-face flip-face-back ${
                        isFlipped ? 'flip-face-visible' : 'flip-face-hidden'
                      }`}
                      style={{
                        WebkitBackfaceVisibility: 'hidden',
                        backfaceVisibility: 'hidden',
                      }}
                      aria-hidden={!isFlipped}
                    >
                      <CertificateBack
                        data={data}
                        theme={theme}
                        isAdmin={isAdmin}
                        onGalleryClick={openGalleryLightbox}
                        onOpenGalleryEdit={() => handleOpenEdit('photos')}
                        customStamps={backStamps}
                        latestStampId={latestStampId}
                        stampMode={stampMode}
                        onPlaceStamp={handlePlaceStamp}
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Mini Virtual Pet Care Dock */}
        <PetCareDock
          theme={theme}
          petStats={petStats}
          onPet={() => {
            if (isFlipped) {
              handleFlip();
              setTimeout(() => handlePetCimi(), 520);
            } else {
              handlePetCimi();
            }
          }}
          onFeed={(food) => handleFeedCimi(food)}
        />

        {/* Bottom Subtle Stage Hint */}
        <div className="mt-3.5 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-600">
          <button
            type="button"
            onClick={handleFlip}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/75 hover:bg-white border border-black/10 shadow-sm font-medium transition-colors"
          >
            <RotateCw className="w-3.5 h-3.5" />
            {isFlipped
              ? 'Lihat Sisi Depan (Kutipan Akta)'
              : 'Lihat Sisi Belakang (Biodata, Statistik & Galeri)'}
          </button>
          <span className="hidden sm:inline text-slate-500">
            • Klik/usap pas foto untuk elus • Ukuran proporsional A4 Landscape
          </span>
        </div>
      </main>

      {/* Interactive Frosted-Glass Folder Gallery: Cimi's Memories (Screen Only, Hidden on Print/PNG) */}
      <CimiMemoriesFolder
        photos={allCimiPhotos}
        theme={theme}
        onOpenGallery={handleOpenCimiGallery}
      />

      {/* Dedicated Offscreen Flat Node for High-Res PNG Export (html2canvas) */}
      <div
        className="no-print print:hidden fixed pointer-events-none"
        style={{ left: '-12000px', top: 0, width: `${CARD_WIDTH}px`, height: `${CARD_HEIGHT}px` }}
        aria-hidden="true"
      >
        <div ref={exportNodeRef} style={{ width: `${CARD_WIDTH}px`, height: `${CARD_HEIGHT}px` }}>
          {isFlipped ? (
            <CertificateBack
              data={data}
              theme={theme}
              customStamps={backStamps}
              isExport
            />
          ) : (
            <CertificateFront
              data={data}
              theme={theme}
              stampInkColor={stampInkColor}
              stampKey={0}
              customStamps={frontStamps}
              isExport
            />
          )}
        </div>
      </div>

      {/* Dedicated Flat 1-Page A4 Landscape Print Container */}
      <div className="print-only">
        <div className="print-only-card">
          {isFlipped ? (
            <CertificateBack
              data={data}
              theme={theme}
              customStamps={backStamps}
              isExport
            />
          ) : (
            <CertificateFront
              data={data}
              theme={theme}
              stampInkColor={stampInkColor}
              stampKey={0}
              customStamps={frontStamps}
              isExport
            />
          )}
        </div>
      </div>

      {/* Slide-Over Edit Drawer (Mode Pawrent Only) */}
      <EditDrawer
        isOpen={isAdmin && drawerOpen}
        initialTab={drawerTab}
        data={data}
        theme={theme}
        isCloudMode={isSupabaseConfigured}
        cloudSyncStatus={cloudSyncStatus}
        onUploadCertImage={uploadCertificateImageToCloud}
        onChange={handlePawrentDataChange}
        onReset={handleResetData}
        onClose={handleCloseEdit}
      />

      {/* Pawrent Admin Login Modal */}
      <PawrentLoginModal
        isOpen={loginModalOpen}
        theme={theme}
        onClose={() => setLoginModalOpen(false)}
        onSuccess={(nextSession) => {
          setSession(nextSession);
          showToast('Selamat datang kembali, Mode Pawrent aktif!');
        }}
      />

      {/* Full-Screen Photo Lightbox */}
      <PhotoLightbox
        item={lightboxState ? lightboxState.items[lightboxState.index] : null}
        items={lightboxState?.items}
        onClose={() => setLightboxState(null)}
        onNavigate={navigateLightbox}
      />

      {/* Fullscreen Cimi's Memories Gallery Modal */}
      <CimiGalleryModal
        isOpen={cimiModalOpen}
        initialAlbum={cimiInitialAlbum}
        photos={allCimiPhotos}
        theme={theme}
        isAdmin={isAdmin}
        isCloudMode={isSupabaseConfigured}
        onClose={() => setCimiModalOpen(false)}
        onAddPhotos={handleAddCimiPhotos}
        onDeletePhoto={handleDeleteCimiPhoto}
      />

      {/* Mini Cimi Walker (Bottom Viewport Shimeji) */}
      <CimiWalker
        visible={showWalker}
        feedSignal={walkerFeedSignal}
        onHide={() => setShowWalker(false)}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="no-print print:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full bg-slate-900/95 text-white text-xs sm:text-sm font-medium shadow-xl flex items-center gap-2 backdrop-blur-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
