export function isPaymentInMonth(payment, year, month) {
    const d = new Date(payment.date);
    return d.getFullYear() === year && d.getMonth() + 1 === month;
}

export function isPaymentInYearUpToMonth(payment, year, month) {
    const d = new Date(payment.date);
    return d.getFullYear() === year && d.getMonth() + 1 <= month;
}

export function sumAmountInGel(payments) {
    return payments.reduce((sum, p) => sum + p.amountInGel, 0);
}

export function getYearOptions(payments) {
    const currentYear = new Date().getFullYear();
    const years = new Set([currentYear - 1, currentYear, currentYear + 1]);

    for (const p of payments) {
        years.add(new Date(p.date).getFullYear());
    }

    return [...years].sort((a, b) => b - a);
}
