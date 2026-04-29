import React from 'react';
import DashboardStats from '../components/DashboardStats';
import { Language } from '../lib/i18n';

interface DashboardPageProps {
  onNavigateMarketplace?: () => void;
  // Added lang prop to fix type error in index.tsx
  lang?: Language;
}

export default function DashboardPage({ onNavigateMarketplace, lang }: DashboardPageProps) {
  // Pass lang down to DashboardStats
  return <DashboardStats onNavigateMarketplace={onNavigateMarketplace} lang={lang} />;
}