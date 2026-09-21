import { Locale } from 'date-fns'

export const roLocale: Locale = {
  code: 'ro',
  formatDistance: () => '',
  formatRelative: () => '',
  localize: {
    ordinalNumber: (num) => `${num}`,
    era: () => '',
    quarter: () => '',
    month: (num) => {
      const months = [
        'Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie',
        'Iulie', 'August', 'Septembrie', 'Octombrie', 'Noiembrie', 'Decembrie'
      ]
      return months[num]
    },
    day: (num) => {
      const days = ['Duminică', 'Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri', 'Sâmbătă']
      return days[num]
    },
    dayPeriod: () => '',
  },
  match: {
    ordinalNumberPattern: /^\d+/i as any,
    era: /^(î|d)/i as any,
    quarter: /^[1234]/i as any,
    month: /^(0[1-9]|1[0-2])/i as any,
    day: /^(0[1-9]|[12]\d|3[01])/i as any,
    dayPeriod: /^(a\.m\.|p\.m\.)/i as any,
  },
  options: {
    weekStartsOn: 1,
    firstWeekContainsDate: 4,
  },
}
