// NBG currency rate helper
// Документация эндпоинта (пример):
// https://nbg.gov.ge/gw/api/ct/monetarypolicy/currencies/?currencies=USD&date=2025-08-15
// Для GEL возвращаем 1 (базовая валюта)

const _cache = new Map(); // key = CODE_YYYY-MM-DD

/**
 * Приводит дату к формату YYYY-MM-DD
 * @param {string|Date} date
 * @returns {string}
 */
export function normalizeDate(date) {
  if (!date) return new Date().toISOString().slice(0,10);
  if (date instanceof Date) return date.toISOString().slice(0,10);
  // Уже в нужном формате
  return date.split('T')[0];
}

/**
 * Формирует URL для запроса курса.
 * @param {string} code
 * @param {string} date
 */
function buildUrl(code, date) {
  const d = normalizeDate(date);
  return `https://nbg.gov.ge/gw/api/ct/monetarypolicy/currencies/?currencies=${encodeURIComponent(code)}&date=${d}`;
}

/**
 * Парсер ответа NBG. Ставит акцент на поле rate.
 * @param {any} data
 * @param {string} code
 * @returns {number|null}
 */
function extractRate(data) {
  if (!data) return null;

  console.log(data);
  console.log(data[0]?.currencies);
  console.log(data[0]?.currencies[0]?.rate);

  return data[0]?.currencies[0]?.rate || null;
}

/**
 * Получить курс валюты к GEL на указанную дату (без fallback).
 * Кэширует результаты в памяти.
 * @param {string} currencyCode (например 'USD')
 * @param {string|Date} date (YYYY-MM-DD)
 * @param {AbortSignal} [signal]
 * @returns {Promise<number>} Курс (для GEL всегда 1)
 */
export async function getNbgRate(currencyCode, date, signal) {
  const code = currencyCode.toUpperCase();
  const d = normalizeDate(date);
  if (code === 'GEL') return 1;
  const key = `${code}_${d}`;
  if (_cache.has(key)) return _cache.get(key);

  const url = buildUrl(code, d);
  const res = await fetch(url, { signal, headers: { 'Accept': 'application/json' } });
  if (!res.ok) {
    throw new Error(`NBG error ${res.status}`);
  }
  const json = await res.json();
  const rate = extractRate(json);
  if (rate == null) {
    throw new Error('Курс не найден в ответе NBG');
  }
  _cache.set(key, rate);
  return rate;
}

/**
 * Конвертация суммы из произвольной валюты в GEL.
 * @param {number} amount
 * @param {string} currencyCode
 * @param {string|Date} date
 * @returns {Promise<number>}
 */
export async function convertToGel(amount, currencyCode, date) {
  const rate = await getNbgRate(currencyCode, date);
  return amount * rate; // предполагаем, что rate = сколько GEL за 1 единицу валюты
}
