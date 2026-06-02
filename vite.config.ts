import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';

  return {
    base: isProd ? '/ppi-wallet-admin/' : '/',
    plugins: [react(), tailwindcss()],
    server: { port: 5174, host: true },
    preview: { port: 4174 },
  };
});
