const BASE_URL = 'https://calculatesalary.us'

export interface BreadcrumbItem {
  name: string
  href: string
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.href}`,
    })),
  }
}

export const BREADCRUMB_ITEMS = {
  home: { name: 'Home', href: '/' },
  salaries: { name: 'US Salaries', href: '/salaries' },
  salaryAfterTax: { name: 'Salary After Tax', href: '/salary-after-tax' },
  compare: { name: 'Salary Comparison', href: '/compare' },
  taxBrackets: { name: 'Tax Brackets', href: '/tax-brackets' },
  taxBands: { name: 'Tax Bands', href: '/tax-bands' },
  stateTaxes: { name: 'State Taxes', href: '/state-taxes' },
  ficaTaxes: { name: 'FICA Taxes', href: '/fica-taxes' },
  calculator401k: { name: '401(k) Calculator', href: '/401k-calculator' },
  hourly: { name: 'Hourly Rate Calculator', href: '/hourly' },
  hourlyToSalary: { name: 'Hourly to Salary Calculator', href: '/hourly-to-salary' },
  employerCost: { name: 'Employer Cost Calculator', href: '/employer-cost' },
  multipleJobs: { name: 'Multiple Jobs', href: '/multiple-jobs' },
  salaryComparison: { name: 'Salary Comparison', href: '/salary-comparison' },
  bonusTax: { name: 'Bonus Tax', href: '/bonus-tax' },
  pensionCalculator: { name: 'Pension Calculator', href: '/pension-calculator' },
  selfEmploymentTax: { name: 'Self-Employment Tax', href: '/self-employment-tax' },
  minimumWage: { name: 'Minimum Wage', href: '/minimum-wage' },
  payRise: { name: 'Pay Rise Calculator', href: '/pay-rise' },
  incomePercentile: { name: 'Income Percentile', href: '/income-percentile' },
  netToGross: { name: 'Net to Gross Calculator', href: '/net-to-gross' },
  mortgageAffordability: { name: 'Mortgage Affordability Calculator', href: '/mortgage-affordability' },
  taxRefund: { name: 'Tax Refund Calculator', href: '/tax-refund' },
  capitalGainsTax: { name: 'Capital Gains Tax Calculator', href: '/capital-gains-tax' },
  costOfLiving: { name: 'Cost of Living', href: '/cost-of-living' },
}
