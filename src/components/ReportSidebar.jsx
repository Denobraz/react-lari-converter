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
            className='btn-text mt-1'
            aria-label={copied ? `${label}: скопировано` : `${label}: скопировать`}
        >
            {copied ? 'Скопировано' : 'Копировать'}
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

    return (
        <aside
            className='lg:w-64 shrink-0 card lg:sticky lg:top-5 lg:self-start'
            aria-label='Отчётный период и итоги'
        >
            <h2 className='section-title mb-3'>Период</h2>

            <div className='grid grid-cols-2 gap-2 mb-4'>
                <label className='flex flex-col gap-1'>
                    <span className='field-label'>Год</span>
                    <select
                        className='input-field'
                        value={reportYear}
                        onChange={e => onReportYearChange(e.target.value)}
                    >
                        {yearOptions.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </label>
                <label className='flex flex-col gap-1'>
                    <span className='field-label'>Месяц</span>
                    <select
                        className='input-field'
                        value={reportMonth}
                        onChange={e => onReportMonthChange(e.target.value)}
                    >
                        {MONTHS.map(m => (
                            <option key={m.value} value={m.value}>{m.label}</option>
                        ))}
                    </select>
                </label>
            </div>

            <p className='section-meta mb-3'>
                {reportMonthLabel} {reportYear} · {filteredCount} шт.
            </p>

            <div className='separator border-t'>
                <div className='stat-row'>
                    <p className='stat-label'>За месяц</p>
                    <p className='stat-value'>
                        {formatAmount(monthTotalInGel)} ₾
                    </p>
                    <CopyButton
                        value={monthTotalInGel}
                        label='Итого за месяц'
                        copied={monthCopied}
                        onCopy={(v) => copyToClipboard(v, setMonthCopied)}
                    />
                </div>

                <div className='stat-row'>
                    <p className='stat-label'>
                        Нарастающий · янв—{reportMonthLabel.toLowerCase().slice(0, 3)}
                    </p>
                    <p className='stat-value'>
                        {formatAmount(cumulativeTotalInGel)} ₾
                    </p>
                    <CopyButton
                        value={cumulativeTotalInGel}
                        label='Нарастающий итог'
                        copied={cumulativeCopied}
                        onCopy={(v) => copyToClipboard(v, setCumulativeCopied)}
                    />
                </div>
            </div>

            <label className='flex flex-col gap-1 separator border-t pt-3 mt-1'>
                <span className='field-label'>Корректировка {reportYear}</span>
                <input
                    type='number'
                    inputMode='decimal'
                    step='0.01'
                    min='0'
                    placeholder='0.00'
                    className='input-field'
                    value={adjustmentInputValue}
                    onChange={e => onYearAdjustmentChange(e.target.value)}
                />
            </label>

            {(Number(yearAdjustment) || 0) > 0 && (
                <p className='field-hint mt-2'>
                    {formatAmount(yearAdjustment)} + {formatAmount(yearPaymentsTotal)}
                </p>
            )}
        </aside>
    );
}
