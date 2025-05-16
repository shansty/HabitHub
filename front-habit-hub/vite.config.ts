import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path';

export default defineConfig({
    plugins: [react(), tailwindcss()],
    preview: {
        port: 4173,
        host: true,
    },
    optimizeDeps: {
        include: ['yup'],
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    test: {
        globals: true,
        environment: 'happy-dom',
        setupFiles: './src/setupTests.ts',
        include: ['src/**/*.{test,spec}.{ts,tsx}'],
    }
})
