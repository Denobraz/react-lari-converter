import {MONTHS} from '../data/months.data.js';
import {formatAmount} from '../helpers/formatAmount.js';
import {
    getYearOptions,
    isPaymentInMonth,
    isPaymentInYearUpToMonth,
    sumAmountInGel,
} from '../helpers/paymentPeriod.js';
import {useEffect, useMemo, useState} from 'react';

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
            const timer = setTimeout(() => setMonthCopied(false), 1000);
            return () => clearTimeout(timer);
        }
    }, [monthCopied]);

    useEffect(() => {
        if (cumulativeCopied) {
            const timer = setTimeout(() => setCumulativeCopied(false), 1000);
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
        navigator.clipboard.writeText(text).then(() => setCopied(true));
    };

    return (
        <aside className='lg:w-72 shrink-0 space-y-4 rounded-lg bg-neutral-900 p-4 lg:sticky lg:top-5 lg:self-start'>
            <h2 className='font-medium text-sm uppercase tracking-wide text-neutral-400'>
                Отчётный период
            </h2>

            <div className='space-y-3'>
                <label className='flex flex-col gap-1 text-sm'>
                    <span className='text-neutral-400'>Год</span>
                    <select
                        className='bg-neutral-800 px-3 py-2 rounded outline-none w-full'
                        value={reportYear}
                        onChange={e => onReportYearChange(e.target.value)}
                    >
                        {yearOptions.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </label>
                <label className='flex flex-col gap-1 text-sm'>
                    <span className='text-neutral-400'>Месяц</span>
                    <select
                        className='bg-neutral-800 px-3 py-2 rounded outline-none w-full'
                        value={reportMonth}
                        onChange={e => onReportMonthChange(e.target.value)}
                    >
                        {MONTHS.map(m => (
                            <option key={m.value} value={m.value}>{m.label}</option>
                        ))}
                    </select>
                </label>
            </div>

            <p className='text-sm text-neutral-400 border-t border-neutral-800 pt-3'>
                {reportMonthLabel} {reportYear} · {filteredCount} платежей
            </p>

            <div className='space-y-3 border-t border-neutral-800 pt-3'>
                <div>
                    <p className='text-xs text-neutral-400 mb-1'>Итого за месяц</p>
                    <p className='font-medium text-lg'>
                        <span
                            title='Скопировать'
                            onClick={() => copyToClipboard(monthTotalInGel, setMonthCopied)}
                            className='text-blue-400 hover:underline cursor-pointer'
                        >
                            {formatAmount(monthTotalInGel)}
                        </span>
                        <span className='text-neutral-400 text-sm font-normal ml-1'>₾</span>
                    </p>
                    {monthCopied && <p className='text-blue-400 text-xs mt-1'>Скопировано</p>}
                </div>

                <div>
                    <p className='text-xs text-neutral-400 mb-1'>
                        Нарастающий итог · янв — {reportMonthLabel.toLowerCase()}
                    </p>
                    <p className='font-medium text-lg'>
                        <span
                            title='Скопировать'
                            onClick={() => copyToClipboard(cumulativeTotalInGel, setCumulativeCopied)}
                            className='text-blue-400 hover:underline cursor-pointer'
                        >
                            {formatAmount(cumulativeTotalInGel)}
                        </span>
                        <span className='text-neutral-400 text-sm font-normal ml-1'>₾</span>
                    </p>
                    {cumulativeCopied && <p className='text-blue-400 text-xs mt-1'>Скопировано</p>}
                </div>
            </div>

            <label className='flex flex-col gap-1 text-sm border-t border-neutral-800 pt-3'>
                <span className='text-neutral-400'>
                    Корректировка за {reportYear}
                </span>
                <span className='text-xs text-neutral-500'>
                    Сумма в лари за месяцы до начала учёта
                </span>
                <input
                    type='number'
                    step='0.01'
                    min='0'
                    placeholder='0.00'
                    className='bg-neutral-800 px-3 py-2 rounded outline-none w-full'
                    value={adjustmentInputValue}
                    onChange={e => onYearAdjustmentChange(e.target.value)}
                />
            </label>

            {(Number(yearAdjustment) || 0) > 0 && (
                <p className='text-xs text-neutral-500'>
                    {formatAmount(yearAdjustment)} корр. + {formatAmount(yearPaymentsTotal)} платежи
                </p>
            )}
        </aside>
    );
}
