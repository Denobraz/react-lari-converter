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

    return (
        <section className='card min-w-0' aria-labelledby='payments-heading'>
            <div className='mb-3'>
                <h2 id='payments-heading' className='section-title'>Платежи</h2>
                <p className='section-meta'>
                    {reportMonthLabel} {reportYear}
                    {filteredPayments.length > 0 && ` · ${filteredPayments.length}`}
                </p>
            </div>

            {filteredPayments.length === 0 ? (
                <p className='py-6 text-center text-[13px] text-muted'>
                    Нет платежей
                </p>
            ) : (
                <div className='overflow-x-auto -mx-4 px-4'>
                    <table className='w-full min-w-[440px] text-left border-collapse'>
                        <thead>
                        <tr className='separator border-b'>
                            <th scope='col' className='table-head w-7'>#</th>
                            <th scope='col' className='table-head'>Сумма</th>
                            <th scope='col' className='table-head'>Вал.</th>
                            <th scope='col' className='table-head'>Дата</th>
                            <th scope='col' className='table-head-accent text-right'>Сумма в лари</th>
                            <th scope='col' className='table-head w-14'>
                                <span className='sr-only'>Действия</span>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredPayments.map((p, i) => (
                            <tr key={p.id} className='separator border-b last:border-0'>
                                <td className='table-cell text-[13px] text-muted'>{i + 1}</td>
                                <td className='table-cell'>{formatAmount(p.amount)}</td>
                                <td className='table-cell text-muted'>
                                    {CURRENCY_EMOJI[p.currency]} {p.currency}
                                    <span className='sr-only'>{formatCurrency(p.currency)}</span>
                                </td>
                                <td className='table-cell text-muted'>{formatDate(p.date)}</td>
                                <td className='table-cell font-medium text-right'>{formatAmount(p.amountInGel)}</td>
                                <td className='table-cell text-right'>
                                    <button
                                        type='button'
                                        onClick={() => handleDelete(p)}
                                        className='btn-destructive'
                                        aria-label={`Удалить ${formatAmount(p.amount)} ${p.currency}`}
                                    >
                                        Удалить
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
