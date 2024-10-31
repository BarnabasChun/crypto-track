import { timeDay, timeMonth, timeYear } from 'd3-time';
import { timeFormat } from 'd3-time-format';
import { format } from 'd3-format';

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

function getMarketDataFormatter(metric: number): (metric: number) => string {
  if (metric < 1) {
    return format('.3f');
  }

  if (metric < 100) {
    return format('.2f');
  }

  if (metric < 10000) {
    return () => metric.toString();
  }

  if (metric < 100000000) {
    return () => format('.3s')(metric).toUpperCase();
  }

  return () => format('.4s')(metric).toUpperCase();
}

export function marketDataFormatter(metric: number) {
  const f = getMarketDataFormatter(metric);
  return f(metric);
}
