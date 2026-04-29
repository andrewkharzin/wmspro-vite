
export type Language = 'en' | 'ru';

export const translations = {
  en: {
    dashboard: 'Dashboard',
    marketplace: 'Marketplace',
    inventory: 'Stock Management',
    batches: 'Batch Hub',
    locations: 'Locations',
    movements: 'Movements',
    contacts: 'Contacts',
    reports: 'Intelligence Reports',
    moderation: 'Compliance',
    users: 'Personnel',
    account: 'Profile & Settings',
    ask_assistant: 'Ask Assistant',
    search_placeholder: 'Matrix search...',
    network_secure: 'Network Secure',
    terminal: 'Terminal RU-HUB-01',
    hero_title_part1: 'Ultimate',
    hero_title_part2: 'Warehouse',
    hero_title_part3: 'Intelligence.',
    hero_desc: 'Synchronizing global assets across distribution hubs. Performance is currently optimized.',
    init_intake: 'Initialize Smart Intake',
    procure_surplus: 'Procure Surplus',
    grid_value: 'Grid Value',
    active_skus: 'Active SKUs',
    critical_zones: 'Critical Zones',
    sync_uptime: 'Sync Uptime',
    throughput: 'Warehouse Throughput',
    asset_stream: 'Live Asset Stream',
    manage_sku: 'Manage SKU',
    logout: 'Logout System',
    auth_tier: 'Enterprise Auth'
  },
  ru: {
    dashboard: 'Панель управления',
    marketplace: 'Маркетплейс',
    inventory: 'Управление запасами',
    batches: 'Центр партий',
    locations: 'Локации',
    movements: 'Движения',
    contacts: 'Контакты',
    reports: 'Интеллектуальные отчеты',
    moderation: 'Комплаенс',
    users: 'Персонал',
    account: 'Аккаунт и Настройки',
    ask_assistant: 'Спросить ИИ',
    search_placeholder: 'Поиск по матрице...',
    network_secure: 'Сеть защищена',
    terminal: 'Терминал RU-HUB-01',
    hero_title_part1: 'Ультимативный',
    hero_title_part2: 'Складской',
    hero_title_part3: 'Интеллект.',
    hero_desc: 'Синхронизация глобальных активов в распределительных центрах. Производительность оптимизирована.',
    init_intake: 'Начать умную приемку',
    procure_surplus: 'Закупка излишков',
    grid_value: 'Стоимость сети',
    active_skus: 'Активные SKU',
    critical_zones: 'Критические зоны',
    sync_uptime: 'Аптайм синхр.',
    throughput: 'Пропускная способность',
    asset_stream: 'Живой поток активов',
    manage_sku: 'Управление SKU',
    logout: 'Выйти из системы',
    auth_tier: 'Корпоративная аторизация'
  }
};

export const useTranslation = (lang: Language) => {
  return translations[lang];
};
