import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'api-server-middleware',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          const url = req.url || '';
          if (url.startsWith('/api/reviews')) {
            try {
              const apiModule = await server.ssrLoadModule('/api/reviews.ts');
              await apiModule.default(req, res);
              return;
            } catch (e: any) {
              console.error("Local API middleware error:", e);
              if (!res.headersSent) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: e.message }));
              }
              return;
            }
          }
          if (url.startsWith('/api/inquiries')) {
            try {
              const apiModule = await server.ssrLoadModule('/api/inquiries.ts');
              await apiModule.default(req, res);
              return;
            } catch (e: any) {
              console.error("Local API middleware error:", e);
              if (!res.headersSent) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: e.message }));
              }
              return;
            }
          }
          next();
        });
      },
    },
  ],

  assetsInclude: ['**/*.svg', '**/*.csv'],
})
