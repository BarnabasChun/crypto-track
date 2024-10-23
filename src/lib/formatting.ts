const createTransformToPercent = (numberOfDecimals: number) => (n: number) =>
  n.toFixed(numberOfDecimals) + '%';
export const transformToSingleDigitPercent = createTransformToPercent(1);
