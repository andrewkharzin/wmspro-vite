import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [
        react({
          // Оптимизация React
          babel: {
            plugins: [
              ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }]
            ]
          },
          // Включаем fast refresh
          fastRefresh: true,
        })
      ],
      build: {
        // Оптимизация сборки
        target: 'es2020',
        minify: 'terser',
        terserOptions: {
          compress: {
            drop_console: mode === 'production', // Убираем console.log в продакшене
            drop_debugger: mode === 'production',
            pure_funcs: mode === 'production' ? ['console.log', 'console.info', 'console.debug'] : [],
          },
          mangle: true,
        },
        // Разделение кода на чанки
        rollupOptions: {
          output: {
            manualChunks: {
              'react-vendor': ['react', 'react-dom'],
              'ui-vendor': ['lucide-react'],
              'supabase-vendor': ['@supabase/supabase-js'],
              'state-vendor': ['zustand'],
              'charts-vendor': ['recharts'],
              'qrcode-vendor': ['qrcode', 'jsbarcode'],
            },
            // Оптимизация имен файлов
            chunkFileNames: 'assets/js/[name]-[hash].js',
            entryFileNames: 'assets/js/[name]-[hash].js',
            assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
          },
        },
        // Увеличиваем лимит предупреждения о размере чанка
        chunkSizeWarningLimit: 1000,
        // Включаем sourcemap только в разработке
        sourcemap: mode === 'development',
        // Оптимизация CSS
        cssCodeSplit: true,
      },
      // Оптимизация зависимостей
      optimizeDeps: {
        include: [
          'react',
          'react-dom',
          'react-dom/client',
          'lucide-react',
          '@supabase/supabase-js',
          'zustand',
          'recharts',
          'qrcode',
          'jsbarcode'
        ],
        exclude: [],
        // Предзагрузка зависимостей
        esbuildOptions: {
          target: 'es2020',
        },
      },
      // Настройки CSS
      css: {
        devSourcemap: mode === 'development',
        modules: {
          localsConvention: 'camelCase',
        },
      },
      // Определение переменных окружения
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
          '@components': path.resolve(__dirname, 'src/components'),
          '@lib': path.resolve(__dirname, 'src/lib'),
          '@types': path.resolve(__dirname, 'src/types'),
          '@hooks': path.resolve(__dirname, 'src/hooks'),
          '@store': path.resolve(__dirname, 'src/store'),
        }
      },
      // Настройки ESBuild
      esbuild: {
        logOverride: { 'this-is-undefined-in-esm': 'silent' },
        target: 'es2020',
      },
      // Предзагрузка ресурсов
      preview: {
        port: 3000,
        host: '0.0.0.0',
      },
    };
});