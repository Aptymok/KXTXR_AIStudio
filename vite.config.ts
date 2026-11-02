import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'serve-root-static-and-api',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (!req.url) return next();
          const cleanUrl = req.url.split('?')[0];

          // Handle API mocks
          if (cleanUrl === '/api/kxtxr-control-state') {
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({
              ok: true,
              schema: 'KXTXR_CONTROL_STATE_V1',
              generatedAt: new Date().toISOString(),
              connectors: {
                metricool: {
                  serverApiConfigured: Boolean(process.env.METRICOOL_USER_TOKEN && process.env.METRICOOL_USER_ID),
                  schedulerEndpointReady: Boolean(process.env.METRICOOL_USER_TOKEN && process.env.METRICOOL_USER_ID),
                  blogId: process.env.METRICOOL_BLOG_ID || '7111220',
                  note: 'ChatGPT MCP connection is not the same as production server API configuration.'
                },
                sfi: {
                  structuredResultConfigured: Boolean(process.env.SFI_EXTERNAL_TOKEN),
                  endpoint: process.env.SFI_STRUCTURED_RESULT_URL || 'https://systemfriction.org/api/external/v1/result'
                },
                operator: {
                  tokenConfigured: Boolean(process.env.KXTXR_CONTROL_TOKEN)
                },
                ai: {
                  configured: Boolean(process.env.OPENAI_API_KEY),
                  model: process.env.OPENAI_MODEL || 'gpt-5.6-luna',
                  boundary: 'Server-side only; browser never receives OPENAI_API_KEY.'
                },
                githubMutation: {
                  configured: Boolean(process.env.GITHUB_KXTXR_TOKEN),
                  mode: 'JSON_MANIFEST_PR_ONLY'
                }
              }
            }));
          }

          if (cleanUrl.startsWith('/api/')) {
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({
              ok: true,
              status: 'PROCESSED_IN_APPLET',
              timestamp: new Date().toISOString()
            }));
          }

          // Static asset serving from project root
          const staticDirs = ['/assets/', '/data/', '/grimoire/', '/campaigns/', '/historical/', '/artist/'];
          if (staticDirs.some(dir => cleanUrl.startsWith(dir))) {
            const filePath = path.join(process.cwd(), cleanUrl);
            if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
              if (filePath.endsWith('.json')) res.setHeader('Content-Type', 'application/json');
              else if (filePath.endsWith('.svg')) res.setHeader('Content-Type', 'image/svg+xml');
              else if (filePath.endsWith('.webp')) res.setHeader('Content-Type', 'image/webp');
              else if (filePath.endsWith('.png')) res.setHeader('Content-Type', 'image/png');
              else if (filePath.endsWith('.mp4')) res.setHeader('Content-Type', 'video/mp4');
              else if (filePath.endsWith('.mpeg') || filePath.endsWith('.mp3')) res.setHeader('Content-Type', 'audio/mpeg');
              else if (filePath.endsWith('.wav')) res.setHeader('Content-Type', 'audio/wav');
              else if (filePath.endsWith('.css')) res.setHeader('Content-Type', 'text/css');
              else if (filePath.endsWith('.js')) res.setHeader('Content-Type', 'application/javascript');
              return fs.createReadStream(filePath).pipe(res);
            }
          }

          next();
        });
      },
      closeBundle() {
        // Copy assets, data, grimoire, campaigns to dist folder during build
        const distDir = path.join(process.cwd(), 'dist');
        if (fs.existsSync(distDir)) {
          const dirsToCopy = ['assets', 'data', 'grimoire', 'campaigns'];
          for (const d of dirsToCopy) {
            const srcPath = path.join(process.cwd(), d);
            const targetPath = path.join(distDir, d);
            if (fs.existsSync(srcPath)) {
              fs.cpSync(srcPath, targetPath, { recursive: true });
            }
          }
        }
      }
    }
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
  preview: {
    host: '0.0.0.0',
    port: 3000,
  },
});
