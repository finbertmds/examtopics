import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.mts';

export default mergeConfig(viteConfig({ mode: 'test', command: 'serve' }), defineConfig({
  test: { globals: true, environment: 'jsdom', setupFiles: ['./src/setupTests.ts'] },
}));
