import { contextualDateFormat, marketDataFormatter } from './formatting';

describe('contextualDateFormat', () => {
  it('formats date to 24h time when the day is after the start of the day', () => {
    const date = new Date(2024, 3, 2, 23);
    const result = contextualDateFormat(date);
    expect(result).toBe('23:00');
  });

  it('formats date to the the abbreviated month and day when it is the start of a new day but not the start of the month', () => {
    const date = new Date(2024, 3, 2);
    const result = contextualDateFormat(date);
    expect(result).toBe('Apr 02');
  });

  it('formats date to abbreviated month name when it is the first of the month but not the start of the year', () => {
    const date = new Date(2018, 1, 1);
    const result = contextualDateFormat(date);
    expect(result).toBe('Feb');
  });

  it('formats date to year when the date is the beginning of the year', () => {
    const date = new Date(2018, 0, 1);
    const result = contextualDateFormat(date);
    expect(result).toBe('2018');
  });
});

describe('marketDataFormatter', () => {
  it('formats to 3 decimal places if the value is less than 1', () => {
    expect(marketDataFormatter(0.552)).toBe('0.552');
    expect(marketDataFormatter(0.55)).toBe('0.550');
  });

  it('formats to 2 decimal places if the value is less than 100', () => {
    expect(marketDataFormatter(4.98)).toBe('4.98');
    expect(marketDataFormatter(4.9)).toBe('4.90');
    expect(marketDataFormatter(5)).toBe('5.00');

    expect(marketDataFormatter(25.6)).toBe('25.60');
    expect(marketDataFormatter(25)).toBe('25.00');
  });

  it('returns the value as is if it is less than 10000', () => {
    expect(marketDataFormatter(169)).toBe('169');
    expect(marketDataFormatter(2620)).toBe('2620');
  });

  it('formats the value to be appended with a K and 3 significant digits if less than 100000', () => {
    expect(marketDataFormatter(72200)).toBe('72.2K');
    expect(marketDataFormatter(72000)).toBe('72.0K');
  });
});
