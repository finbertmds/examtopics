import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'REACT_APP_');
  return {
    plugins: [react()],
    define: Object.fromEntries(Object.entries(env).map(([key, value]) => [`process.env.${key}`, JSON.stringify(value)]).concat([
      ['process.env.REACT_APP_BACKEND_URL', JSON.stringify(env.REACT_APP_BACKEND_URL || '')],
      ['process.env.REACT_APP_FRONTEND_URL', JSON.stringify(env.REACT_APP_FRONTEND_URL || '')],
    ])),
    build: { outDir: 'build' },
  };
});
