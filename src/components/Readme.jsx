export function Readme() {
    const URL = 'https://nbg.gov.ge/en/monetary-policy/currency';

    return (
        <section className='pt-1' aria-label='О приложении'>
            <h2 className='section-title mb-2'>О приложении</h2>
            <div className='space-y-1.5 text-[13px] leading-relaxed text-muted max-w-prose'>
                <p>
                    Конвертация входящих платежей в лари по курсу НБГ для налоговой отчётности.
                </p>
                <p>
                    Курсы:{' '}
                    <a target='_blank' rel='noopener noreferrer' href={URL} className='link'>
                        nbg.gov.ge
                    </a>
                    . Данные — локально в браузере.
                </p>
                <p>
                    Сделано с ❤️{' '}
                    <a
                        className='link text-[13px]'
                        target='_blank'
                        rel='noopener noreferrer'
                        href='https://github.com/Denobraz'
                    >
                        Denobraz
                    </a>
                </p>
            </div>
        </section>
    );
}
