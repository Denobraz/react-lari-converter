export function Readme() {
    const URL = 'https://nbg.gov.ge/en/monetary-policy/currency';

    return <div className='text-sm lg:text-base bg-neutral-900 text-neutral-200 p-4 rounded-lg flex flex-col gap-1'>
        <p>Форма для подсчета входящих платежей в лари для отчетности перед грузинской налоговой.</p>
        <p>Использует <a target='_blank' href={URL} className='text-blue-400 hover:underline'>{URL}</a> для получения курсов валют.</p>
    </div>
}