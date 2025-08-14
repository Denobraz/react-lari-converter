import {CURRENCIES} from '../data/currencies.data.js';
import {useEffect, useMemo, useState} from "react";

export default function PaymentsTable({payments, onDelete}) {

    const [totalInGelCopied, setTotalInGelCopied] = useState(false);

    useEffect(() => {

        if (totalInGelCopied) {
            const timer = setTimeout(() => setTotalInGelCopied(false), 1000);
            return () => clearTimeout(timer);
        }

    }, [totalInGelCopied])

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('ru-RU', {
            style: 'decimal',
            maximumFractionDigits: 2
        }).format(amount).replace(',', '.');
    }

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

    const totalInGel = useMemo(() => {
        return payments.reduce((sum, p) => sum + p.amountInGel, 0).toFixed(2);
    }, [payments]);

    const copyTotalInGel = () => {
        navigator.clipboard.writeText(totalInGel)
            .then(() => setTotalInGelCopied(true));
    }

    return (
        <section className='space-y-3'>
            <h2 className='font-medium'>Список платежей ({payments.length})</h2>
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
                    {payments.map((p, i) => (
                        <tr key={i} className='odd:bg-neutral-900 even:bg-neutral-800'>
                            <td className='px-3 py-1 whitespace-nowrap'>{i + 1}</td>
                            <td className='px-3 py-1 whitespace-nowrap'>{formatAmount(p.amount)}</td>
                            <td className='px-3 py-1 whitespace-nowrap'>{formatCurrency(p.currency)}</td>
                            <td className='px-3 py-1 whitespace-nowrap'>{formatDate(p.date)}</td>
                            <td className='px-3 py-1 whitespace-nowrap'>{formatAmount(p.amountInGel)}</td>
                            <td className='px-3 py-1 whitespace-nowrap'>
                                <button onClick={() => onDelete(i)}
                                        className='text-red-400 hover:text-red-300 cursor-pointer'>Удалить
                                </button>
                            </td>
                        </tr>
                    ))}
                    {!payments.length && (
                        <tr>
                            <td colSpan={6} className='px-3 py-3 text-center text-neutral-400'>Нет данных</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
            <div className='mt-3'>
                <div className='font-medium'>
                    💸 Итого в лари: <span title='Скопировать' onClick={copyTotalInGel} className='text-blue-400 hover:underline cursor-pointer'>{formatAmount(totalInGel)}</span>
                    {totalInGelCopied && <span className='text-blue-400 text-sm ml-2'>(скопировано)</span>}
                </div>
            </div>
        </section>
    );
}

