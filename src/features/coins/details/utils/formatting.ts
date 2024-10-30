import { timeDay, timeMonth, timeYear } from 'd3-time';
import { timeFormat } from 'd3-time-format';

const formatHour = timeFormat('%H:%M');
const formatDay = timeFormat('%b %d');
const formatMonth = timeFormat('%b');
const formatYear = timeFormat('%Y');

function getDateFormatter(date: Date): (date: Date) => string {
  const isAfterDayStart = timeDay(date) < date;

  if (isAfterDayStart) {
    return formatHour;
  }

  const isAfterMonthStart = timeMonth(date) < date;

  if (isAfterMonthStart) {
    return formatDay;
  }

  const isAfterYearStart = timeYear(date) < date;

  if (isAfterYearStart) {
    return formatMonth;
  }

  return formatYear;
}

export function contextualDateFormat(date: Date) {
  const dateFormatter = getDateFormatter(date);

  return dateFormatter(date);
}
