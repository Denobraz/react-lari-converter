const PAYMENTS_KEY = 'payments';
const REPORT_KEY = 'paymentsReport';

function createPaymentId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function loadPayments() {
    const saved = localStorage.getItem(PAYMENTS_KEY);
    const payments = saved ? JSON.parse(saved) : [];

    return payments.map((p, i) => ({
        ...p,
        id: p.id ?? `legacy-${i}-${p.date}-${p.amount}`,
    }));
}

export function savePayments(payments) {
    localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments));
}

export function loadReportSettings() {
    const now = new Date();
    const defaults = {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        yearAdjustments: {},
    };

    const saved = localStorage.getItem(REPORT_KEY);
    if (!saved) return defaults;

    const parsed = JSON.parse(saved);
    return {
        year: parsed.year ?? defaults.year,
        month: parsed.month ?? defaults.month,
        yearAdjustments: parsed.yearAdjustments ?? {},
    };
}

export function saveReportSettings(settings) {
    localStorage.setItem(REPORT_KEY, JSON.stringify(settings));
}

export function createPaymentIdForNew() {
    return createPaymentId();
}
