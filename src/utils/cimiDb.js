const DB_NAME = 'cimi-memories-db';
const DB_VERSION = 1;
const STORE_NAME = 'photos';

function openCimiDb() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB tidak tersedia di browser ini.'));
      return;
    }

    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error('Gagal membuka IndexedDB.'));
  });
}

export function optimizePhotoToBlob(file, maxDimension = 1800, quality = 0.88) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error(`File "${file?.name || ''}" bukan format gambar yang didukung.`));
      return;
    }

    const rawExt = file.name.split('.').pop()?.toUpperCase() || '';
    const format =
      rawExt === 'PNG'
        ? 'PNG'
        : rawExt === 'WEBP'
        ? 'WEBP'
        : rawExt === 'GIF'
        ? 'GIF'
        : 'JPG';

    // Preserve animated GIFs directly as Blob
    if (file.type === 'image/gif') {
      resolve({ blob: file, format: 'GIF' });
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Gagal memuat gambar "${file.name}".`));
    };
    img.onload = () => {
      try {
        const { width, height } = img;
        const scale = Math.min(1, maxDimension / Math.max(width, height));
        const targetW = Math.max(1, Math.round(width * scale));
        const targetH = Math.max(1, Math.round(height * scale));

        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(objectUrl);
          resolve({ blob: file, format });
          return;
        }

        const keepPng = file.type === 'image/png';
        if (!keepPng) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, targetW, targetH);
        }
        ctx.drawImage(img, 0, 0, targetW, targetH);

        const mime = keepPng ? 'image/png' : 'image/jpeg';
        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(objectUrl);
            resolve({
              blob: blob || file,
              format: keepPng ? 'PNG' : 'JPG',
            });
          },
          mime,
          quality
        );
      } catch {
        URL.revokeObjectURL(objectUrl);
        resolve({ blob: file, format });
      }
    };
    img.src = objectUrl;
  });
}

export async function loadIndexedDbPhotos() {
  const db = await openCimiDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAll();
    req.onsuccess = () => {
      const rows = Array.isArray(req.result) ? req.result : [];
      rows.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      resolve(rows);
    };
    req.onerror = () => reject(req.error || new Error('Gagal membaca foto dari IndexedDB.'));
    tx.oncomplete = () => db.close();
  });
}

export async function saveIndexedDbPhotos(records) {
  if (!records || records.length === 0) return;
  const db = await openCimiDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    records.forEach((rec) => store.put(rec));
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error || new Error('Gagal menyimpan foto ke IndexedDB.'));
    };
  });
}

export async function deleteIndexedDbPhoto(id) {
  const db = await openCimiDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.delete(id);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error || new Error('Gagal menghapus foto dari IndexedDB.'));
    };
  });
}
