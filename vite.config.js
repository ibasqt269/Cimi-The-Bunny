import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IMAGE_EXT_RE = /\.(jpe?g|png|webp|gif|avif)$/i;

function inferAlbumFromPath(relSegments, fileName) {
  const folder = (relSegments.length > 1 ? relSegments[0] : '').toLowerCase();
  const combined = `${folder} ${fileName.toLowerCase()}`;

  if (combined.includes('tidur') || combined.includes('flop') || combined.includes('sleep')) {
    return 'tidur-gemoy';
  }
  if (
    combined.includes('makan') ||
    combined.includes('hay') ||
    combined.includes('wortel') ||
    combined.includes('snack') ||
    combined.includes('food')
  ) {
    return 'jam-makan';
  }
  if (
    combined.includes('eksplor') ||
    combined.includes('jalan') ||
    combined.includes('main') ||
    combined.includes('binky') ||
    combined.includes('explore')
  ) {
    return 'eksplor';
  }
  return 'baby-cimi';
}

function formatCaptionFromFilename(fileName) {
  const base = fileName.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ').trim();
  if (!base) return 'Momen Cimi';
  return base.replace(/\b\w/g, (ch) => ch.toUpperCase());
}

function scanCimiPublicFolder(cimiDir) {
  if (!fs.existsSync(cimiDir)) return [];

  const results = [];

  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    entries.sort((a, b) => a.name.localeCompare(b.name));

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && IMAGE_EXT_RE.test(entry.name)) {
        const rel = path.relative(cimiDir, fullPath).split(path.sep).filter(Boolean);
        const ext = path.extname(entry.name).replace('.', '').toUpperCase();
        const format = ext === 'JPEG' ? 'JPG' : ext;
        const src = '/cimi/' + rel.map((seg) => encodeURIComponent(seg)).join('/');

        results.push({
          id: `public-${rel.join('/')}`,
          src,
          album: inferAlbumFromPath(rel, entry.name),
          caption: formatCaptionFromFilename(entry.name),
          date: '2026',
          format,
          source: 'public',
        });
      }
    }
  }

  walk(cimiDir);
  return results;
}

function cimiPublicPhotosPlugin() {
  const virtualModuleId = 'virtual:cimi-public-photos';
  const resolvedVirtualModuleId = `\0${virtualModuleId}`;
  const cimiDir = path.resolve(__dirname, 'public/cimi');

  return {
    name: 'cimi-public-photos',
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
      return null;
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        const photos = scanCimiPublicFolder(cimiDir);
        return `export default ${JSON.stringify(photos)};`;
      }
      return null;
    },
    configureServer(server) {
      if (fs.existsSync(cimiDir)) {
        server.watcher.add(cimiDir);
      }
      const handleFsEvent = (changedPath) => {
        if (changedPath.startsWith(cimiDir) && IMAGE_EXT_RE.test(changedPath)) {
          const mod = server.moduleGraph.getModuleById(resolvedVirtualModuleId);
          if (mod) {
            server.moduleGraph.invalidateModule(mod);
          }
          server.ws.send({ type: 'full-reload' });
        }
      };
      server.watcher.on('add', handleFsEvent);
      server.watcher.on('unlink', handleFsEvent);
    },
  };
}

export default defineConfig({
  plugins: [react(), cimiPublicPhotosPlugin()],
  server: {
    port: 5173,
    strictPort: false,
  },
});
