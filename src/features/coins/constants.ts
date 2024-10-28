export const DEFAULT_PER_PAGE_OPTION = 25;
export const PER_PAGE_OPTIONS = [
  DEFAULT_PER_PAGE_OPTION,
  50,
  100,
  250,
] as const;
export const DEFAULT_CURRENCY = 'usd';
export const CHART_RANGE_OPTIONS = [
  {
    label: '1d',
    value: 1,
    ariaLabel: 'View 1 day of data',
  },
  {
    label: '7d',
    value: 7,
    ariaLabel: 'View 7 days of data',
  },
  {
    label: '1m',
    value: 30,
    ariaLabel: 'View 1 month of data',
  },
  {
    label: '3m',
    value: 90,
    ariaLabel: 'View 3 months of data',
  },
  {
    label: '1y',
    value: 365,
    ariaLabel: 'View 1 year of data',
  },
] as const;
