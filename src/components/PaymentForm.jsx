import {useEffect, useState} from 'react';
import {CURRENCIES} from "../data/currencies.data.js";
import {convertToGel} from "../helpers/nbgRates.js";

export default function PaymentForm({onAdd}) {

    const TODAY = new Date().toISOString().split('T')[0];

    const [isLoading, setIsLoading] = useState(false);

    const [form, setForm] = useState({
        amount: '',
        currency: CURRENCIES[0].code,
        date: TODAY,
    });

    const [error, setError] = useState(null);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [error])

    const validateForm = () => {
        if (!form.amount || !form.currency || !form.date) {
            throw new Error('Пожалуйста, заполните все поля.');
        }

        if (form.amount <= 0) {
            throw new Error('Сумма должна быть больше нуля.');
        }

        if (form.date > TODAY) {
            throw new Error('Дата не может быть в будущем.');
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            validateForm();
        } catch (e) {
            setIsLoading(false);
            setError(e.message);
            return;
        }

        try {
            const amountInGel = await convertToGel(form.amount, form.currency, form.date);
            onAdd({
                amount: Number(form.amount),
                currency: form.currency.toUpperCase(),
                date: form.date,
                amountInGel,
            });
            setForm(f => ({...f, amount: '', date: TODAY}));
        } catch (err) {
            console.error(err);
            setError('Не удалось получить курс валюты. Попробуйте позже.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className='space-y-3'>
            <h2 className='font-medium'>Добавить платеж</h2>
            <form onSubmit={handleSubmit} className='grid grid-cols-1 md:grid-cols-4 gap-3'>
                <input type='number' step='0.01' placeholder='Сумма'
                       className='bg-neutral-800 px-3 py-2 rounded outline-none'
                       value={form.amount}
                       onChange={e => setForm(f => ({...f, amount: e.target.value}))}/>
                <select placeholder='Валюта' className='bg-neutral-800 px-3 py-2 rounded outline-none'
                        value={form.currency}
                        onChange={e => setForm(f => ({...f, currency: e.target.value}))}>
                    {CURRENCIES.map(c => (<option key={c.code} value={c.code}>{c.name}</option>))}
                </select>
                <input type='date' className='bg-neutral-800 px-3 py-2 rounded outline-none'
                       value={form.date}
                       onChange={e => setForm(f => ({...f, date: e.target.value}))}/>
                <button className='bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded cursor-pointer'
                        type='submit'>
                    {isLoading ? 'Загрузка...' : 'Добавить'}
                </button>
            </form>
            {error && <div className='text-red-400 text-xs transition-all'>{error}</div>}
        </section>
    );
}

