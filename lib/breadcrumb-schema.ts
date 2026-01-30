const BASE_URL = 'https://calculatesalary.uk'

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
  salaries: { name: 'UK Salaries', href: '/salaries' },
  taxBands: { name: 'Tax Bands', href: '/tax-bands' },
  nationalInsurance: { name: 'National Insurance', href: '/national-insurance' },
  studentLoans: { name: 'Student Loans', href: '/student-loans' },
  hourly: { name: 'Hourly Rate Calculator', href: '/hourly' },
  umbrellaCalculator: { name: 'Umbrella Calculator', href: '/umbrella-calculator' },
  employerCost: { name: 'Employer Cost Calculator', href: '/employer-cost' },
  proRata: { name: 'Pro Rata Calculator', href: '/pro-rata' },
  multipleJobs: { name: 'Multiple Jobs', href: '/multiple-jobs' },
  salaryComparison: { name: 'Salary Comparison', href: '/salary-comparison' },
  bonusTax: { name: 'Bonus Tax', href: '/bonus-tax' },
  dividendCalculator: { name: 'Dividend Calculator', href: '/dividend-calculator' },
  pensionCalculator: { name: 'Pension Calculator', href: '/pension-calculator' },
  salarySacrifice: { name: 'Salary Sacrifice', href: '/salary-sacrifice' },
  selfEmployedTax: { name: 'Self-Employed Tax', href: '/self-employed-tax' },
  marriageAllowance: { name: 'Marriage Allowance', href: '/marriage-allowance' },
  taxCodeChecker: { name: 'Tax Code Checker', href: '/tax-code-checker' },
  minimumWage: { name: 'Minimum Wage', href: '/minimum-wage' },
  redundancyCalculator: { name: 'Redundancy Calculator', href: '/redundancy-calculator' },
  maternityPay: { name: 'Maternity Pay', href: '/maternity-pay' },
  inflationCalculator: { name: 'Inflation Calculator', href: '/inflation-calculator' },
  payRise: { name: 'Pay Rise Calculator', href: '/pay-rise' },
  scotland: { name: 'Scottish Tax Calculator', href: '/scotland' },
  londonSalary: { name: 'London Salary Calculator', href: '/london-salary' },
  incomePercentile: { name: 'Income Percentile', href: '/income-percentile' },
  averageSalaryUk: { name: 'Average UK Salary', href: '/average-salary-uk' },
  netToGross: { name: 'Net to Gross Calculator', href: '/net-to-gross' },
  mortgageAffordability: { name: 'Mortgage Affordability Calculator', href: '/mortgage-affordability' },
  taxRefund: { name: 'Tax Refund Calculator', href: '/tax-refund' },
  childBenefit: { name: 'Child Benefit Calculator', href: '/child-benefit' },
  companyCarTax: { name: 'Company Car Tax Calculator', href: '/company-car-tax' },
  workFromHomeTaxRelief: { name: 'Work From Home Tax Relief', href: '/work-from-home-tax-relief' },
  capitalGainsTax: { name: 'Capital Gains Tax Calculator', href: '/capital-gains-tax' },
}
