// next.config.js
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'ui-avatars.com' },
      { protocol: 'https', hostname: 'www.transparenttextures.com' },
      { protocol: 'https', hostname: 'mockmind-api.uifaces.co' }, // Добавьте эту строку
      { protocol: 'https', hostname: 'jfxlfopxgmfcuitialwe.supabase.co' }, // Добавьте Supabase
      { protocol: 'https', hostname: 'via.placeholder.com' }, // Для плейсхолдеров
      { protocol: 'https', hostname: 'picsum.photos' }, // Если используете
    ],
  },
};

export default nextConfig;