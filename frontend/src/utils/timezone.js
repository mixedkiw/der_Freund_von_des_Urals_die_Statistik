/**
 * Утилиты для работы с временем и часовыми поясами
 * 
 * Логика:
 * - Сохраняем время активации в формате ISO 8601 (UTC)
 * - На клиенте сравниваем с текущим UTC временем
 * - Не зависит от часового пояса пользователя или сервера
 */

/**
 * Конвертирует локальное время Yekaterinburg в UTC
 * Yekaterinburg = UTC+5 (круглый год, нет переходов на летнее время)
 * 
 * @param {string} dateTimeStr - Строка вида '2025-12-11 21:21:00' (Yekaterinburg time)
 * @returns {Date} - Дата в UTC
 */
export function convertYekaterinburgToUTC(dateTimeStr) {
  const [datePart, timePart] = dateTimeStr.split(' ');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hours, minutes, seconds] = timePart.split(':').map(Number);

  // Создаём дату в локальном времени (как если бы это было локальное время)
  const localTime = new Date(year, month - 1, day, hours, minutes, seconds);
  
  // Yekaterinburg всегда UTC+5 (нет переходов на летнее время)
  const yekaterinburgOffset = 5 * 60 * 60 * 1000;
  
  // Конвертируем в UTC: вычитаем смещение
  const utcTime = new Date(localTime.getTime() - yekaterinburgOffset);
  
  console.log(`🌍 Конвертация времени:`);
  console.log(`   Yekaterinburg (UTC+5): ${dateTimeStr}`);
  console.log(`   UTC: ${utcTime.toISOString()}`);
  
  return utcTime;
}

/**
 * Проверяет, наступило ли время активации
 * @param {string} activationDateTime - Время активации в Yekaterinburg (формат: 'YYYY-MM-DD HH:mm:ss')
 * @returns {boolean} - true если текущее время >= время активации
 */
export function isActivationTimeReached(activationDateTime) {
  try {
    const activationUTC = convertYekaterinburgToUTC(activationDateTime);
    const nowUTC = new Date();
    
    const isReached = nowUTC >= activationUTC;
    
    console.log(`⏰ Проверка активации:`);
    console.log(`   Текущее UTC: ${nowUTC.toISOString()}`);
    console.log(`   Активация UTC: ${activationUTC.toISOString()}`);
    console.log(`   Активировано: ${isReached ? '✅ ДА' : '⏳ НЕТ'}`);
    if (!isReached) {
      const minutesLeft = ((activationUTC - nowUTC) / 1000 / 60).toFixed(1);
      console.log(`   До активации: ${minutesLeft} минут`);
    }
    
    return isReached;
  } catch (error) {
    console.error('❌ Ошибка при проверке времени:', error);
    return false;
  }
}

/**
 * Получает информацию о текущем часовом поясе пользователя
 * @returns {object} - Информация о часовом поясе
 */
export function getUserTimezoneInfo() {
  const now = new Date();
  const offset = -now.getTimezoneOffset(); // в минутах
  const hours = Math.floor(Math.abs(offset) / 60);
  const minutes = Math.abs(offset) % 60;
  const sign = offset >= 0 ? '+' : '-';
  
  const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  return {
    offset: offset,
    hours: hours,
    minutes: minutes,
    display: `UTC${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`,
    browser: browserTz
  };
}

/**
 * Форматирует дату в читаемый вид
 * @param {Date} date - Дата
 * @param {string} timezone - Часовой пояс
 * @returns {string} - Форматированная дата
 */
export function formatDateTime(date, timezone = 'UTC') {
  if (timezone === 'Asia/Yekaterinburg') {
    // Конвертируем UTC дату в Yekaterinburg время
    const yekTime = new Date(date.getTime() + 5 * 60 * 60 * 1000);
    return yekTime.toISOString().slice(0, 19).replace('T', ' ') + ' (Yekaterinburg)';
  }
  
  // По умолчанию UTC
  return date.toISOString().slice(0, 19).replace('T', ' ') + ' (UTC)';
}
