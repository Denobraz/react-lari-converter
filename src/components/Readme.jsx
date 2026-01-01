export function Readme() {
  const URL = "https://nbg.gov.ge/en/monetary-policy/currency"

  return (
    <div className="text-sm lg:text-base bg-neutral-100 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 p-4 rounded-lg flex flex-col gap-1">
      <p>
        Форма для подсчета входящих платежей в лари для отчетности перед
        грузинской налоговой.
      </p>
      <p>
        Использует{" "}
        <a
          target="_blank"
          href={URL}
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          {URL}
        </a>{" "}
        для получения курсов валют.
      </p>
    </div>
  )
}
