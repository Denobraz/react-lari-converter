import {MONTHS} from '../data/months.data.js';
import {formatAmount} from '../helpers/formatAmount.js';
import {
    getYearOptions,
    isPaymentInMonth,
    isPaymentInYearUpToMonth,
    sumAmountInGel,
} from '../helpers/paymentPeriod.js';
import {useEffect, useMemo, useState} from 'react';

function CopyButton({value, label, copied, onCopy}) {
    return (
        <button
            type='button'
            onClick={() => onCopy(value)}
            className='btn-text mt-2 text-[15px]'
            aria-label={copied ? `${label}: скопировано` : `${label}: скопировать ${value}`}
        >
            {copied ? '✅ Скопировано' : '📋 Копировать'}
        </button>
    );
}

export default function ReportSidebar({
    payments,
    reportYear,
    reportMonth,
    yearAdjustment,
    onReportYearChange,
    onReportMonthChange,
    onYearAdjustmentChange,
}) {
    const [monthCopied, setMonthCopied] = useState(false);
    const [cumulativeCopied, setCumulativeCopied] = useState(false);

    useEffect(() => {
        if (monthCopied) {
            const timer = setTimeout(() => setMonthCopied(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [monthCopied]);

    useEffect(() => {
        if (cumulativeCopied) {
            const timer = setTimeout(() => setCumulativeCopied(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [cumulativeCopied]);

    const reportMonthLabel = MONTHS.find(m => m.value === reportMonth)?.label ?? '';

    const filteredCount = useMemo(() => {
        return payments.filter(p => isPaymentInMonth(p, reportYear, reportMonth)).length;
    }, [payments, reportYear, reportMonth]);

    const monthTotalInGel = useMemo(() => {
        const filtered = payments.filter(p => isPaymentInMonth(p, reportYear, reportMonth));
        return sumAmountInGel(filtered).toFixed(2);
    }, [payments, reportYear, reportMonth]);

    const yearPaymentsTotal = useMemo(() => {
        const yearPayments = payments.filter(p => isPaymentInYearUpToMonth(p, reportYear, reportMonth));
        return sumAmountInGel(yearPayments);
    }, [payments, reportYear, reportMonth]);

    const cumulativeTotalInGel = useMemo(() => {
        return (yearPaymentsTotal + (Number(yearAdjustment) || 0)).toFixed(2);
    }, [yearPaymentsTotal, yearAdjustment]);

    const yearOptions = useMemo(() => getYearOptions(payments), [payments]);

    const adjustmentInputValue = yearAdjustment === 0 ? '' : String(yearAdjustment);

    const copyToClipboard = (text, setCopied) => {
        navigator.clipboard.writeText(text).then(() => setCopied(true)).catch(() => {});
    };

    const countLabel = filteredCount === 1 ? 'платёж'
        : filteredCount < 5 ? 'платежа' : 'платежей';

    return (
        <aside
            className='lg:w-72 shrink-0 card lg:sticky lg:top-6 lg:self-start space-y-5'
            aria-label='Отчётный период и итоги'
        >
            <div>
                <h2 className='section-title'>📊 Период</h2>
                <p className='section-desc mt-1'>
                    {reportMonthLabel} {reportYear} · {filteredCount} {countLabel}
                </p>
            </div>

            <div className='grid grid-cols-2 gap-3'>
                <label className='flex flex-col gap-1.5'>
                    <span className='field-label'>Год</span>
                    <select
                        className='input-field text-[15px]'
                        value={reportYear}
                        onChange={e => onReportYearChange(e.target.value)}
                    >
                        {yearOptions.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </label>
                <label className='flex flex-col gap-1.5'>
                    <span className='field-label'>Месяц</span>
                    <select
                        className='input-field text-[15px]'
                        value={reportMonth}
                        onChange={e => onReportMonthChange(e.target.value)}
                    >
                        {MONTHS.map(m => (
                            <option key={m.value} value={m.value}>{m.label}</option>
                        ))}
                    </select>
                </label>
            </div>

            <div className='space-y-3 separator border-t pt-4'>
                <div className='stat-block'>
                    <p className='stat-label'>💰 Итого за месяц</p>
                    <p className='stat-value'>
                        {formatAmount(monthTotalInGel)}
                        <span className='text-[17px] font-normal ml-1' style={{ color: 'var(--label)' }}>₾</span>
                    </p>
                    <CopyButton
                        value={monthTotalInGel}
                        label='Итого за месяц'
                        copied={monthCopied}
                        onCopy={(v) => copyToClipboard(v, setMonthCopied)}
                    />
                </div>

                <div className='stat-block'>
                    <p className='stat-label'>
                        📈 Нарастающий итог · янв — {reportMonthLabel.toLowerCase()}
                    </p>
                    <p className='stat-value'>
                        {formatAmount(cumulativeTotalInGel)}
                        <span className='text-[17px] font-normal ml-1' style={{ color: 'var(--label)' }}>₾</span>
                    </p>
                    <CopyButton
                        value={cumulativeTotalInGel}
                        label='Нарастающий итог'
                        copied={cumulativeCopied}
                        onCopy={(v) => copyToClipboard(v, setCumulativeCopied)}
                    />
                </div>
            </div>

            <label className='flex flex-col gap-1.5 separator border-t pt-4'>
                <span className='field-label'>
                    ✏️ Корректировка · {reportYear}
                </span>
                <span className='field-hint'>
                    Лари за месяцы до начала учёта
                </span>
                <input
                    type='number'
                    inputMode='decimal'
                    step='0.01'
                    min='0'
                    placeholder='0.00'
                    className='input-field text-[15px]'
                    value={adjustmentInputValue}
                    onChange={e => onYearAdjustmentChange(e.target.value)}
                />
            </label>

            {(Number(yearAdjustment) || 0) > 0 && (
                <p className='field-hint'>
                    {formatAmount(yearAdjustment)} корр. + {formatAmount(yearPaymentsTotal)} платежи
                </p>
            )}
        </aside>
    );
}
