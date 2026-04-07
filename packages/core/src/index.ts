export type EthiopianDate = {
  year: number;
  month: number; // 1–13
  day: number; // 1–30 (Pagume: 1–5/6)
};

const MS_PER_DAY = 86_400_000;

function floorDiv(a: number, b: number): number {
  return Math.floor(a / b);
}

function mod(a: number, b: number): number {
  const r = a % b;
  return r < 0 ? r + b : r;
}

function assertInteger(name: string, value: number): void {
  if (!Number.isInteger(value)) {
    throw new RangeError(`${name} must be an integer`);
  }
}

function assertEthiopianDate(ethDate: EthiopianDate): void {
  assertInteger('year', ethDate.year);
  assertInteger('month', ethDate.month);
  assertInteger('day', ethDate.day);

  if (ethDate.year < 1) {
    throw new RangeError('year must be >= 1');
  }

  if (ethDate.month < 1 || ethDate.month > 13) {
    throw new RangeError('month must be between 1 and 13');
  }

  const maxDay = getMonthDays(ethDate.month, ethDate.year);
  if (ethDate.day < 1 || ethDate.day > maxDay) {
    throw new RangeError(`day must be between 1 and ${maxDay} for month ${ethDate.month}`);
  }
}

/**
 * Ethiopian leap year rule:
 * Every 4 years without exception: (year + 1) % 4 === 0
 */
export function isLeapYear(year: number): boolean {
  assertInteger('year', year);
  return (year + 1) % 4 === 0;
}

/**
 * Month lengths:
 * - Months 1–12: always 30 days
 * - Month 13 (Pagume): 5 days, or 6 days in leap years
 */
export function getMonthDays(month: number, year: number): number {
  assertInteger('month', month);
  assertInteger('year', year);

  if (month < 1 || month > 13) throw new RangeError('month must be between 1 and 13');
  if (month <= 12) return 30;
  return isLeapYear(year) ? 6 : 5;
}

/**
 * Convert an Ethiopian date to a serial day number (integer days since Ethiopian 0001-01-01).
 * This is an internal representation used for robust conversions.
 */
function ethToSerialDay(ethDate: EthiopianDate): number {
  assertEthiopianDate(ethDate);

  // Leap years are years where year % 4 === 3.
  // Number of leap years in years 1..(year-1) equals floor(year / 4).
  const daysBeforeYear = 365 * (ethDate.year - 1) + floorDiv(ethDate.year, 4);
  const daysBeforeMonth = 30 * (ethDate.month - 1);
  return daysBeforeYear + daysBeforeMonth + (ethDate.day - 1);
}

/**
 * Inverse of ethToSerialDay.
 */
function serialDayToEth(serial: number): EthiopianDate {
  if (!Number.isFinite(serial) || !Number.isInteger(serial)) {
    throw new RangeError('serial day must be a finite integer');
  }

  // Break into 4-year cycles (1461 days): 365,365,366,365.
  const cycleDays = 1461;
  const cycles = floorDiv(serial, cycleDays);
  let remainder = serial - cycles * cycleDays;

  // Handle negative serial values by normalizing remainder into [0,1460].
  if (remainder < 0) {
    remainder += cycleDays;
  }

  const yearBase = cycles * 4;

  let yearInCycle: number;
  let dayOfYear: number;

  if (remainder < 365) {
    yearInCycle = 1;
    dayOfYear = remainder;
  } else if (remainder < 730) {
    yearInCycle = 2;
    dayOfYear = remainder - 365;
  } else if (remainder < 1096) {
    yearInCycle = 3;
    dayOfYear = remainder - 730;
  } else {
    yearInCycle = 4;
    dayOfYear = remainder - 1096;
  }

  const year = yearBase + yearInCycle;
  const month = floorDiv(dayOfYear, 30) + 1;
  const day = mod(dayOfYear, 30) + 1;

  const ethDate: EthiopianDate = { year, month, day };
  assertEthiopianDate(ethDate);
  return ethDate;
}

/**
 * Proleptic Gregorian civil date -> days since 1970-01-01 (UTC), using a pure arithmetic algorithm.
 * Based on Howard Hinnant's "civil calendar" algorithms.
 */
function gregorianToUnixDays(year: number, month: number, day: number): number {
  assertInteger('year', year);
  assertInteger('month', month);
  assertInteger('day', day);
  if (month < 1 || month > 12) throw new RangeError('month must be between 1 and 12');
  if (day < 1 || day > 31) throw new RangeError('day must be between 1 and 31');

  let y = year;
  const m = month;
  const d = day;

  y -= m <= 2 ? 1 : 0;
  const era = floorDiv(y >= 0 ? y : y - 399, 400);
  const yoe = y - era * 400; // [0, 399]
  const mp = m + (m > 2 ? -3 : 9); // March=0, Feb=11
  const doy = floorDiv(153 * mp + 2, 5) + d - 1; // [0, 365]
  const doe = yoe * 365 + floorDiv(yoe, 4) - floorDiv(yoe, 100) + doy; // [0, 146096]
  return era * 146097 + doe - 719468;
}

function unixDaysToGregorian(unixDays: number): { year: number; month: number; day: number } {
  if (!Number.isFinite(unixDays) || !Number.isInteger(unixDays)) {
    throw new RangeError('unixDays must be a finite integer');
  }

  let z = unixDays + 719468;
  const era = floorDiv(z >= 0 ? z : z - 146096, 146097);
  const doe = z - era * 146097; // [0, 146096]
  const yoe = floorDiv(
    doe - floorDiv(doe, 1460) + floorDiv(doe, 36524) - floorDiv(doe, 146096),
    365,
  ); // [0, 399]
  let y = yoe + era * 400;
  const doy = doe - (yoe * 365 + floorDiv(yoe, 4) - floorDiv(yoe, 100)); // [0, 365]
  const mp = floorDiv(5 * doy + 2, 153); // [0, 11]
  const d = doy - floorDiv(153 * mp + 2, 5) + 1; // [1, 31]
  const m = mp + (mp < 10 ? 3 : -9); // [1, 12]
  y += m <= 2 ? 1 : 0;

  return { year: y, month: m, day: d };
}

/**
 * Anchor to derive the absolute epoch offset between Ethiopian serial days and Gregorian unixDays.
 *
 * Given reference (from project spec):
 * Ethiopian 2015-01-01 == Gregorian 2022-09-11
 */
const ETHIOPIAN_ANCHOR: EthiopianDate = { year: 2015, month: 1, day: 1 };
const GREGORIAN_ANCHOR = { year: 2022, month: 9, day: 11 };
const ETH_TO_UNIX_DAYS_OFFSET =
  gregorianToUnixDays(GREGORIAN_ANCHOR.year, GREGORIAN_ANCHOR.month, GREGORIAN_ANCHOR.day) -
  ethToSerialDay(ETHIOPIAN_ANCHOR);

/**
 * Convert Ethiopian -> Gregorian (UTC date at midnight).
 */
export function toGregorian(ethDate: EthiopianDate): Date {
  const ethSerial = ethToSerialDay(ethDate);
  const unixDays = ethSerial + ETH_TO_UNIX_DAYS_OFFSET;
  const { year, month, day } = unixDaysToGregorian(unixDays);
  return new Date(Date.UTC(year, month - 1, day));
}

/**
 * Convert Gregorian Date -> Ethiopian date.
 *
 * Interprets the input as a UTC calendar day using getUTC* components.
 */
export function toEthiopian(date: Date): EthiopianDate {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();

  const unixDays = gregorianToUnixDays(year, month, day);
  const ethSerial = unixDays - ETH_TO_UNIX_DAYS_OFFSET;
  return serialDayToEth(ethSerial);
}

/**
 * Convert Gregorian Date -> Ethiopian date using the *local* calendar day
 * of the runtime environment (getFullYear/getMonth/getDate).
 *
 * Use this for "today" in the user's timezone. Use `toEthiopian()` for a stable UTC-day conversion.
 */
export function toEthiopianLocal(date: Date): EthiopianDate {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const unixDays = gregorianToUnixDays(year, month, day);
  const ethSerial = unixDays - ETH_TO_UNIX_DAYS_OFFSET;
  return serialDayToEth(ethSerial);
}

/**
 * Day of week for an Ethiopian date: 0–6 (Sunday–Saturday).
 */
export function getDayOfWeek(ethDate: EthiopianDate): number {
  const ethSerial = ethToSerialDay(ethDate);
  const unixDays = ethSerial + ETH_TO_UNIX_DAYS_OFFSET;
  // 1970-01-01 was a Thursday (4 if Sunday=0).
  return mod(unixDays + 4, 7);
}

export function addDays(ethDate: EthiopianDate, days: number): EthiopianDate {
  assertEthiopianDate(ethDate);
  assertInteger('days', days);
  const ethSerial = ethToSerialDay(ethDate);
  return serialDayToEth(ethSerial + days);
}

export function subtractDays(ethDate: EthiopianDate, days: number): EthiopianDate {
  assertEthiopianDate(ethDate);
  assertInteger('days', days);
  const ethSerial = ethToSerialDay(ethDate);
  return serialDayToEth(ethSerial - days);
}

export function toISOString(ethDate: EthiopianDate): string {
  assertEthiopianDate(ethDate);
  const y = String(ethDate.year).padStart(4, '0');
  const m = String(ethDate.month).padStart(2, '0');
  const d = String(ethDate.day).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function isValid(ethDate: EthiopianDate): boolean {
  try {
    assertEthiopianDate(ethDate);
    return true;
  } catch {
    return false;
  }
}
