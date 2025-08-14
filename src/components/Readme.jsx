export function Readme() {
    const URL = 'https://nbg.gov.ge/en/monetary-policy/currency';

    return <div className='bg-neutral-900 text-neutral-200 p-4 rounded-lg flex'>
        <div className='hidden md:block w-4 mr-4 shrink-0'>
            ℹ️
        </div>
        <div>
            <p>Форма для подсчета входящих платежей в лари для отчетности перед грузинской налоговой</p>
            <p>Использует <a target='_blank' href={URL} className='text-blue-400 hover:underline'>{URL}</a> для получения курсов валют.</p>
        </div>
    </div>
}