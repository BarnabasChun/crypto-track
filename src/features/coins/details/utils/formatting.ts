import { timeDay, timeMonth, timeYear } from 'd3-time';
import { timeFormat } from 'd3-time-format';

const formatHour = timeFormat('%H:%M');
const formatDay = timeFormat('%b %d');
const formatMonth = timeFormat('%b');
const formatYear = timeFormat('%Y');

function getDateFormatter(date: Date): (date: Date) => string {
  if (timeDay(date) < date) {
    return formatHour;
  }

  if (timeMonth(date) < date) {
    return formatDay;
  }

  if (timeYear(date) < date) {
    return formatMonth;
  }

  return formatYear;
}

export function contextualDateFormat(date: Date) {
  const dateFormatter = getDateFormatter(date);

  return dateFormatter(date);
}
