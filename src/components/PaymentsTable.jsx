import {CURRENCIES} from '../data/currencies.data.js';
import {MONTHS} from '../data/months.data.js';
import {formatAmount} from '../helpers/formatAmount.js';
import {isPaymentInMonth} from '../helpers/paymentPeriod.js';
import {useMemo} from 'react';

export default function PaymentsTable({payments, reportYear, reportMonth, onDelete}) {

    const formatCurrency = (code) => {
        const currency = CURRENCIES.find(c => c.code === code);
        return currency ? currency.name : 'Неизвестная валюта';
    }

    const formatDate = (date) => {
        const d = new Date(date);
        return d.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    }

    const reportMonthLabel = MONTHS.find(m => m.value === reportMonth)?.label ?? '';

    const filteredPayments = useMemo(() => {
        return payments.filter(p => isPaymentInMonth(p, reportYear, reportMonth));
    }, [payments, reportYear, reportMonth]);

    return (
        <section className='space-y-3 min-w-0'>
            <h2 className='font-medium'>Список платежей</h2>

            <div className='overflow-x-auto rounded-lg'>
                <table className='table-auto lg:table-fixed w-full text-left border-collapse'>
                    <thead>
                    <tr className='bg-neutral-800'>
                        <th className='px-3 py-2 font-medium whitespace-nowrap'>#</th>
                        <th className='px-3 py-2 font-medium whitespace-nowrap'>Сумма</th>
                        <th className='px-3 py-2 font-medium whitespace-nowrap'>Валюта</th>
                        <th className='px-3 py-2 font-medium whitespace-nowrap'>Дата</th>
                        <th className='px-3 py-2 font-medium whitespace-nowrap'>Сумма в лари</th>
                        <th className='px-3 py-2 font-medium whitespace-nowrap'></th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredPayments.map((p, i) => (
                        <tr key={p.id} className='odd:bg-neutral-900 even:bg-neutral-800'>
                            <td className='px-3 py-1 whitespace-nowrap'>{i + 1}</td>
                            <td className='px-3 py-1 whitespace-nowrap'>{formatAmount(p.amount)}</td>
                            <td className='px-3 py-1 whitespace-nowrap'>{formatCurrency(p.currency)}</td>
                            <td className='px-3 py-1 whitespace-nowrap'>{formatDate(p.date)}</td>
                            <td className='px-3 py-1 whitespace-nowrap'>{formatAmount(p.amountInGel)}</td>
                            <td className='px-3 py-1 whitespace-nowrap'>
                                <button onClick={() => onDelete(p.id)}
                                        className='text-red-400 hover:text-red-300 cursor-pointer'>Удалить
                                </button>
                            </td>
                        </tr>
                    ))}
                    {!filteredPayments.length && (
                        <tr>
                            <td colSpan={6} className='px-3 py-3 text-center text-neutral-400'>
                                Нет платежей за {reportMonthLabel.toLowerCase()} {reportYear}
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
