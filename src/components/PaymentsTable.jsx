import {CURRENCIES, CURRENCY_EMOJI} from '../data/currencies.data.js';
import {MONTHS} from '../data/months.data.js';
import {formatAmount} from '../helpers/formatAmount.js';
import {isPaymentInMonth} from '../helpers/paymentPeriod.js';
import {useMemo} from 'react';

export default function PaymentsTable({payments, reportYear, reportMonth, onDelete}) {

    const formatCurrency = (code) => {
        const currency = CURRENCIES.find(c => c.code === code);
        return currency ? currency.name : code;
    };

    const formatDate = (date) => {
        const d = new Date(date);
        return d.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    };

    const reportMonthLabel = MONTHS.find(m => m.value === reportMonth)?.label ?? '';

    const filteredPayments = useMemo(() => {
        return payments.filter(p => isPaymentInMonth(p, reportYear, reportMonth));
    }, [payments, reportYear, reportMonth]);

    const handleDelete = (payment) => {
        const confirmed = window.confirm(
            `Удалить платёж ${formatAmount(payment.amount)} ${payment.currency} от ${formatDate(payment.date)}?`
        );
        if (confirmed) {
            onDelete(payment.id);
        }
    };

    const countLabel = filteredPayments.length === 1 ? 'запись'
        : filteredPayments.length < 5 ? 'записи' : 'записей';

    return (
        <section className='card space-y-4 min-w-0' aria-labelledby='payments-heading'>
            <div>
                <h2 id='payments-heading' className='section-title'>📋 Платежи</h2>
                <p className='section-desc mt-1'>
                    {reportMonthLabel} {reportYear}
                    {filteredPayments.length > 0 && (
                        <> · {filteredPayments.length} {countLabel}</>
                    )}
                </p>
            </div>

            {filteredPayments.length === 0 ? (
                <p className='py-10 text-center text-[15px]' style={{ color: 'var(--label)' }}>
                    📭 Нет платежей за выбранный период
                </p>
            ) : (
                <div className='overflow-x-auto -mx-5 px-5'>
                    <table className='w-full min-w-[480px] text-left border-collapse'>
                        <thead>
                        <tr className='separator border-b'>
                            <th scope='col' className='table-head w-8'>№</th>
                            <th scope='col' className='table-head'>Сумма</th>
                            <th scope='col' className='table-head'>Валюта</th>
                            <th scope='col' className='table-head'>Дата</th>
                            <th scope='col' className='table-head text-right'>₾</th>
                            <th scope='col' className='table-head w-16'>
                                <span className='sr-only'>Действия</span>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredPayments.map((p, i) => (
                            <tr key={p.id} className='separator border-b last:border-0'>
                                <td className='table-cell text-[13px]' style={{ color: 'var(--label)' }}>{i + 1}</td>
                                <td className='table-cell font-medium'>{formatAmount(p.amount)}</td>
                                <td className='table-cell'>
                                    {CURRENCY_EMOJI[p.currency]}{' '}
                                    <span style={{ color: 'var(--label)' }}>{p.currency}</span>
                                    <span className='sr-only'>{formatCurrency(p.currency)}</span>
                                </td>
                                <td className='table-cell' style={{ color: 'var(--label)' }}>{formatDate(p.date)}</td>
                                <td className='table-cell font-semibold text-right'>{formatAmount(p.amountInGel)}</td>
                                <td className='table-cell text-right'>
                                    <button
                                        type='button'
                                        onClick={() => handleDelete(p)}
                                        className='btn-destructive'
                                        aria-label={`Удалить платёж ${formatAmount(p.amount)} ${p.currency}`}
                                    >
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}
