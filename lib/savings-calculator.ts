// Savings Calculator Utilities

export interface SavingsInput {
  initialDeposit: number
  monthlyContribution: number
  annualInterestRate: number // as percentage, e.g., 5 for 5%
  years: number
  compoundFrequency: 'daily' | 'monthly' | 'quarterly' | 'annually'
}

export interface SavingsResult {
  finalBalance: number
  totalContributions: number
  totalInterestEarned: number
  effectiveAnnualRate: number
  yearlyBreakdown: YearlyBreakdown[]
}

export interface YearlyBreakdown {
  year: number
  startBalance: number
  contributions: number
  interestEarned: number
  endBalance: number
}

// Compound frequency to periods per year
const COMPOUND_PERIODS: Record<SavingsInput['compoundFrequency'], number> = {
  daily: 365,
  monthly: 12,
  quarterly: 4,
  annually: 1,
}

/**
 * Calculate compound interest with regular contributions
 */
export function calculateSavings(input: SavingsInput): SavingsResult {
  const { initialDeposit, monthlyContribution, annualInterestRate, years, compoundFrequency } = input

  const periodsPerYear = COMPOUND_PERIODS[compoundFrequency]
  const ratePerPeriod = (annualInterestRate / 100) / periodsPerYear
  const contributionPerPeriod = (monthlyContribution * 12) / periodsPerYear

  let balance = initialDeposit
  const yearlyBreakdown: YearlyBreakdown[] = []
  let totalInterestEarned = 0

  for (let year = 1; year <= years; year++) {
    const startBalance = balance
    let yearInterest = 0
    const yearContributions = monthlyContribution * 12

    // Calculate for each period in the year
    for (let period = 0; period < periodsPerYear; period++) {
      const interestThisPeriod = balance * ratePerPeriod
      yearInterest += interestThisPeriod
      balance += interestThisPeriod + contributionPerPeriod
    }

    totalInterestEarned += yearInterest

    yearlyBreakdown.push({
      year,
      startBalance,
      contributions: yearContributions,
      interestEarned: yearInterest,
      endBalance: balance,
    })
  }

  const totalContributions = initialDeposit + (monthlyContribution * 12 * years)

  // Calculate effective annual rate (APY)
  const effectiveAnnualRate = (Math.pow(1 + ratePerPeriod, periodsPerYear) - 1) * 100

  return {
    finalBalance: balance,
    totalContributions,
    totalInterestEarned,
    effectiveAnnualRate,
    yearlyBreakdown,
  }
}

/**
 * Format currency for US
 */
export function formatSavingsCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format currency with decimals
 */
export function formatSavingsCurrencyPrecise(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

// Common monthly contribution amounts for quick select and SEO pages
export const COMMON_MONTHLY_AMOUNTS = [
  50, 100, 150, 200, 250, 300, 400, 500, 750, 1000, 1500, 2000
]

// Common interest rates
export const COMMON_INTEREST_RATES = [1, 2, 3, 4, 5, 6, 7, 8, 10]

// Common time periods
export const COMMON_TIME_PERIODS = [1, 2, 3, 5, 7, 10, 15, 20, 25, 30]

// Common savings goals
export const COMMON_SAVINGS_GOALS = [
  1000, 5000, 10000, 20000, 50000, 100000
]

/**
 * Parse slug for dynamic routes
 * Supports formats like: "200-a-month", "5-percent", "10-years", "10000-goal"
 */
export function parseSavingsSlug(slug: string): {
  type: 'monthly' | 'rate' | 'years' | 'goal'
  value: number
} | null {
  // Match "200-a-month" format (SEO friendly)
  const monthlyMatch = slug.match(/^(\d+)-a-month$/)
  if (monthlyMatch) {
    return { type: 'monthly', value: parseInt(monthlyMatch[1], 10) }
  }

  // Match "5-percent" or "5-percent-interest"
  const rateMatch = slug.match(/^(\d+(?:\.\d+)?)-percent(?:-interest)?$/)
  if (rateMatch) {
    return { type: 'rate', value: parseFloat(rateMatch[1]) }
  }

  // Match "10-years" or "10-year"
  const yearsMatch = slug.match(/^(\d+)-years?$/)
  if (yearsMatch) {
    return { type: 'years', value: parseInt(yearsMatch[1], 10) }
  }

  // Match "10000-goal" or "save-10000"
  const goalMatch = slug.match(/^(?:save-)?(\d+)-?goal?$/)
  if (goalMatch) {
    return { type: 'goal', value: parseInt(goalMatch[1], 10) }
  }

  return null
}

/**
 * Quick calculation for SEO content (10 years at 5%)
 */
function getQuickResult(monthly: number): { total: number; interest: number } {
  const result = calculateSavings({
    initialDeposit: 0,
    monthlyContribution: monthly,
    annualInterestRate: 5,
    years: 10,
    compoundFrequency: 'monthly',
  })
  return {
    total: Math.round(result.finalBalance),
    interest: Math.round(result.totalInterestEarned),
  }
}

/**
 * Generate SEO metadata for savings pages - OPTIMIZED FOR SEARCH INTENT
 */
export function generateSavingsPageMeta(slug: string): {
  title: string
  description: string
  keywords: string[]
  h1: string
  answer: string
} {
  const parsed = parseSavingsSlug(slug)

  if (!parsed) {
    return {
      title: 'Savings Calculator - Calculate Compound Interest',
      description: 'Free savings calculator. See how your money grows with compound interest over time.',
      keywords: ['savings calculator', 'compound interest', 'savings', 'interest calculator'],
      h1: 'Savings Calculator',
      answer: '',
    }
  }

  switch (parsed.type) {
    case 'monthly': {
      const quick = getQuickResult(parsed.value)
      return {
        title: `How Much If I Save $${parsed.value} a Month? | Calculator`,
        description: `Save $${parsed.value} a month for 10 years = $${quick.total.toLocaleString()} (with $${quick.interest.toLocaleString()} interest). Calculate exactly how much you'll have with our free savings calculator.`,
        keywords: [
          `how much if i save $${parsed.value} a month`,
          `save $${parsed.value} a month`,
          `$${parsed.value} a month savings`,
          `saving $${parsed.value} monthly`,
          `${parsed.value} dollars a month savings`,
        ],
        h1: `How Much Will I Have If I Save $${parsed.value} a Month?`,
        answer: `If you save $${parsed.value} a month for 10 years at 5% interest, you'll have approximately $${quick.total.toLocaleString()}. That's $${(parsed.value * 12 * 10).toLocaleString()} in contributions plus $${quick.interest.toLocaleString()} in compound interest.`,
      }
    }
    case 'rate':
      return {
        title: `${parsed.value}% APY Savings Calculator | How Much Will I Earn?`,
        description: `Calculate how much you'll earn with a ${parsed.value}% APY savings account. See your money grow with compound interest at ${parsed.value}% interest.`,
        keywords: [
          `${parsed.value}% apy savings account`,
          `${parsed.value} percent interest calculator`,
          `${parsed.value}% high yield savings`,
          `best ${parsed.value}% savings`,
        ],
        h1: `How Much Will I Earn at ${parsed.value}% Interest?`,
        answer: `At ${parsed.value}% annual interest, your savings will grow faster than standard accounts. Use our calculator to see exactly how much you'll earn.`,
      }
    case 'years':
      return {
        title: `${parsed.value} Year Savings Calculator | How Much Will I Have?`,
        description: `Calculate how much you'll have after saving for ${parsed.value} years. See the power of compound interest over ${parsed.value} years with our free calculator.`,
        keywords: [
          `${parsed.value} year savings plan`,
          `save for ${parsed.value} years`,
          `${parsed.value} year savings calculator`,
          `how much in ${parsed.value} years`,
        ],
        h1: `How Much Will I Have After ${parsed.value} Years of Saving?`,
        answer: `See how your money grows over ${parsed.value} years with compound interest. The longer you save, the more interest you earn on your interest.`,
      }
    case 'goal': {
      const monthlyNeeded = Math.round(parsed.value / (10 * 12 * 1.29))
      return {
        title: `How to Save $${parsed.value.toLocaleString()} | Monthly Savings Calculator`,
        description: `To save $${parsed.value.toLocaleString()} in 10 years, you need about $${monthlyNeeded}/month at 5% interest. Calculate your path to $${parsed.value.toLocaleString()} with our free calculator.`,
        keywords: [
          `how to save $${parsed.value.toLocaleString()}`,
          `save ${parsed.value.toLocaleString()} dollars`,
          `reach $${parsed.value.toLocaleString()} savings goal`,
          `${parsed.value.toLocaleString()} savings plan`,
        ],
        h1: `How Do I Save $${parsed.value.toLocaleString()}?`,
        answer: `To reach $${parsed.value.toLocaleString()} in 10 years at 5% interest, you'd need to save approximately $${monthlyNeeded} per month. Adjust the calculator to find your perfect savings plan.`,
      }
    }
    default:
      return {
        title: 'Savings Calculator - Calculate Compound Interest',
        description: 'Free savings calculator. See how your money grows with compound interest over time.',
        keywords: ['savings calculator', 'compound interest', 'savings'],
        h1: 'Savings Calculator',
        answer: '',
      }
  }
}

/**
 * Generate FAQ schema for a savings page
 */
export function generateSavingsFAQSchema(slug: string) {
  const parsed = parseSavingsSlug(slug)
  if (!parsed || parsed.type !== 'monthly') return null

  const quick = getQuickResult(parsed.value)
  const monthly = parsed.value

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How much will I have if I save $${monthly} a month?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `If you save $${monthly} a month for 10 years at 5% interest, you'll have approximately $${quick.total.toLocaleString()}. Your total contributions would be $${(monthly * 12 * 10).toLocaleString()}, plus $${quick.interest.toLocaleString()} earned in compound interest.`,
        },
      },
      {
        '@type': 'Question',
        name: `Is saving $${monthly} a month enough?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Saving $${monthly} a month is a solid start. After 10 years you'd have about $${quick.total.toLocaleString()}, and after 20 years approximately $${Math.round(quick.total * 2.6).toLocaleString()}. The key is consistency and starting early to maximize compound interest.`,
        },
      },
      {
        '@type': 'Question',
        name: `How much interest will I earn on $${monthly} a month?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `At 5% annual interest, saving $${monthly} a month earns you about $${quick.interest.toLocaleString()} in interest over 10 years. That's free money from compound interest - your interest earns interest over time.`,
        },
      },
    ],
  }
}

/**
 * Generate all slugs for sitemap - USING SEO-FRIENDLY FORMAT
 */
export function getAllSavingsSlugs(): string[] {
  const slugs: string[] = []

  // Monthly amounts - using "a-month" format
  COMMON_MONTHLY_AMOUNTS.forEach(amount => {
    slugs.push(`${amount}-a-month`)
  })

  // Interest rates
  COMMON_INTEREST_RATES.forEach(rate => {
    slugs.push(`${rate}-percent`)
  })

  // Time periods
  COMMON_TIME_PERIODS.forEach(years => {
    slugs.push(`${years}-years`)
  })

  // Savings goals
  COMMON_SAVINGS_GOALS.forEach(goal => {
    slugs.push(`${goal}-goal`)
  })

  return slugs
}
