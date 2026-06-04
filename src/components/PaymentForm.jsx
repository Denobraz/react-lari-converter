import {useEffect, useId, useState} from 'react';
import {CURRENCIES} from "../data/currencies.data.js";
import {convertToGel} from "../helpers/nbgRates.js";

export default function PaymentForm({onAdd}) {

    const TODAY = new Date().toISOString().split('T')[0];
    const formId = useId();
    const errorId = `${formId}-error`;
    const successId = `${formId}-success`;

    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(null);

    const [form, setForm] = useState({
        amount: '',
        currency: CURRENCIES[0].code,
        date: TODAY,
    });

    const [error, setError] = useState(null);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    const validateForm = () => {
        if (!form.amount || !form.currency || !form.date) {
            throw new Error('Заполните все поля формы.');
        }

        if (Number(form.amount) <= 0) {
            throw new Error('Сумма должна быть больше нуля.');
        }

        if (form.date > TODAY) {
            throw new Error('Дата не может быть в будущем.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
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
            setSuccess('Платёж добавлен.');
        } catch (err) {
            console.error(err);
            setError('Не удалось получить курс валюты. Проверьте дату и попробуйте снова.');
        } finally {
            setIsLoading(false);
        }
    };

    const isSubmitDisabled = isLoading || !form.amount.trim();

    return (
        <section className='card space-y-4' aria-labelledby={`${formId}-heading`}>
            <div>
                <h2 id={`${formId}-heading`} className='section-title'>➕ Новый платёж</h2>
                <p className='section-desc mt-1'>
                    Конвертация по курсу НБГ на дату поступления
                </p>
            </div>

            <form onSubmit={handleSubmit} className='space-y-4' noValidate>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3'>
                    <label className='flex flex-col gap-1.5'>
                        <span className='field-label'>Сумма</span>
                        <input
                            type='number'
                            inputMode='decimal'
                            step='0.01'
                            min='0.01'
                            placeholder='0.00'
                            className='input-field'
                            value={form.amount}
                            autoComplete='off'
                            aria-invalid={Boolean(error)}
                            aria-describedby={error ? errorId : success ? successId : undefined}
                            disabled={isLoading}
                            onChange={e => setForm(f => ({...f, amount: e.target.value}))}
                        />
                    </label>

                    <label className='flex flex-col gap-1.5'>
                        <span className='field-label'>Валюта</span>
                        <select
                            className='input-field'
                            value={form.currency}
                            disabled={isLoading}
                            onChange={e => setForm(f => ({...f, currency: e.target.value}))}
                        >
                            {CURRENCIES.map(c => (
                                <option key={c.code} value={c.code}>
                                    {c.emoji} {c.name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className='flex flex-col gap-1.5'>
                        <span className='field-label'>Дата</span>
                        <input
                            type='date'
                            className='input-field'
                            value={form.date}
                            max={TODAY}
                            disabled={isLoading}
                            onChange={e => setForm(f => ({...f, date: e.target.value}))}
                        />
                    </label>

                    <div className='flex flex-col gap-1.5 sm:col-span-2 lg:col-span-1'>
                        <span className='field-label invisible hidden sm:block' aria-hidden='true'>&nbsp;</span>
                        <button
                            className='btn-primary w-full h-[44px]'
                            type='submit'
                            disabled={isSubmitDisabled}
                        >
                            {isLoading ? (
                                <>
                                    <span className='spinner' aria-hidden='true' />
                                    Загрузка…
                                </>
                            ) : (
                                'Добавить'
                            )}
                        </button>
                    </div>
                </div>

                <div aria-live='polite' className='min-h-[1.5rem]'>
                    {error && (
                        <div id={errorId} role='alert' className='alert-error'>
                            ⚠️ {error}
                        </div>
                    )}
                    {success && !error && (
                        <div id={successId} role='status' className='alert-success'>
                            ✅ {success}
                        </div>
                    )}
                </div>
            </form>
        </section>
    );
}
