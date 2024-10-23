import { transformToSingleDigitPercent } from './formatting';

describe('transformToSingleDigitPercent', () => {
  it('should convert a positive number to a percentage with one decimal', () => {
    expect(transformToSingleDigitPercent(0.25)).toBe('0.3%');
  });

  it('should convert a negative number to a percentage with one decimal', () => {
    expect(transformToSingleDigitPercent(-0.25)).toBe('-0.3%');
  });

  it('should convert 0 to "0.0%" with one decimal', () => {
    expect(transformToSingleDigitPercent(0)).toBe('0.0%');
  });
});
