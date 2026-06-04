export function formatAmount(amount) {
    return new Intl.NumberFormat('ru-RU', {
        style: 'decimal',
        maximumFractionDigits: 2,
    }).format(amount).replace(',', '.');
}
