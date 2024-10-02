const createTransformToPercent = (numberOfDecimals: number) => (n: number) =>
  (n * 100).toFixed(numberOfDecimals) + '%';
export const transformToSingleDigitPercent = createTransformToPercent(1);
