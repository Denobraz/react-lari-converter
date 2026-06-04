export const CURRENCIES = [
    { code: 'USD', name: 'Доллар США', emoji: '🇺🇸' },
    { code: 'EUR', name: 'Евро', emoji: '🇪🇺' },
    { code: 'GBP', name: 'Британский фунт', emoji: '🇬🇧' },
    { code: 'GEL', name: 'Грузинский лари', emoji: '🇬🇪' },
];

export const CURRENCY_EMOJI = Object.fromEntries(
    CURRENCIES.map(c => [c.code, c.emoji])
);
