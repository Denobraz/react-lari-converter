export function Readme() {
    const URL = 'https://nbg.gov.ge/en/monetary-policy/currency';

    return (
        <details className='group'>
            <summary className='cursor-pointer select-none list-none flex items-center justify-between gap-2 text-[15px] transition-opacity hover:opacity-70 [&::-webkit-details-marker]:hidden' style={{ color: 'var(--label)' }}>
                <span>ℹ️ О приложении</span>
                <span className='text-[13px] transition-transform group-open:rotate-180' aria-hidden='true'>⌄</span>
            </summary>
            <div className='mt-3 space-y-2 text-[15px] leading-relaxed max-w-prose' style={{ color: 'var(--label)' }}>
                <p>
                    Подсчёт входящих платежей в лари для отчётности перед грузинской налоговой.
                    Конвертация по официальному курсу НБГ на дату платежа.
                </p>
                <p>
                    Курсы —{' '}
                    <a target='_blank' rel='noopener noreferrer' href={URL} className='link'>
                        nbg.gov.ge
                    </a>.
                    Данные хранятся локально в браузере.
                </p>
            </div>
        </details>
    );
}
