import { contextualDateFormat } from './formatting';

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
