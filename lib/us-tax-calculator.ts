// US Tax Calculator
// Uses centralized configuration from us-tax-config.ts

import {
  currentTaxConfig,
  type TaxYearConfig,
  type FilingStatus,
  CURRENT_TAX_YEAR,
  TAX_YEARS,
  STATE_TAX_CONFIGS,
  type FederalTaxBracket,
} from './us-tax-config'

export interface SalaryInput {
  grossSalary: number
  bonus?: number
  filingStatus: FilingStatus
  state: string // State code (e.g., 'CA', 'TX')
  retirement401k?: number // Annual 401(k) contribution
  hsaContribution?: number // Annual HSA contribution
  includeLocalTax?: boolean // For states like NY, MD
  taxYear?: string
}

export interface TaxBreakdown {
  grossIncome: number
  adjustedGrossIncome: number // After pre-tax deductions
  standardDeduction: number
  taxableIncome: number
  federalTax: number
  stateTax: number
  localTax: number
  socialSecurity: number
  medicare: number
  retirement401k: number
  hsaContribution: number
  totalFederalDeductions: number
  totalStateDeductions: number
  totalDeductions: number
  takeHomePay: number
  effectiveTaxRate: number
  marginalTaxRate: number
}

export interface SalaryResult {
  yearly: TaxBreakdown
  monthly: TaxBreakdown
  biweekly: TaxBreakdown
  weekly: TaxBreakdown
  daily: TaxBreakdown
  hourly: TaxBreakdown
  taxYear: string
  filingStatus: FilingStatus
  state: string
  stateName: string
}

// Re-exports for convenience
export const TAX_YEAR = CURRENT_TAX_YEAR
export const AVAILABLE_TAX_YEARS = Object.keys(TAX_YEARS).sort().reverse()
export { currentTaxConfig }
export type { FilingStatus }

function getConfig(taxYear?: string): TaxYearConfig {
  if (taxYear && TAX_YEARS[taxYear]) {
    return TAX_YEARS[taxYear]
  }
  return currentTaxConfig
}

function calculateFederalTax(
  taxableIncome: number,
  filingStatus: FilingStatus,
  config: TaxYearConfig
): number {
  if (taxableIncome <= 0) return 0

  const brackets = config.federalBrackets[filingStatus]
  let tax = 0
  let remainingIncome = taxableIncome

  for (let i = 0; i < brackets.length; i++) {
    const bracket = brackets[i]
    const prevMax = i === 0 ? 0 : brackets[i - 1].max
    const bracketSize = bracket.max === Infinity ? remainingIncome : bracket.max - prevMax

    if (remainingIncome <= 0) break

    const taxableInBracket = Math.min(remainingIncome, bracketSize)
    tax += taxableInBracket * bracket.rate
    remainingIncome -= taxableInBracket
  }

  return Math.max(0, tax)
}

function calculateStateTax(
  taxableIncome: number,
  stateCode: string
): { stateTax: number; localTax: number } {
  const stateConfig = STATE_TAX_CONFIGS[stateCode]

  if (!stateConfig || !stateConfig.hasIncomeTax) {
    return { stateTax: 0, localTax: 0 }
  }

  let stateTax = 0
  const stateDeduction = stateConfig.standardDeduction || 0
  const personalExemption = stateConfig.personalExemption || 0
  const stateTaxableIncome = Math.max(0, taxableIncome - stateDeduction - personalExemption)

  // Flat tax states
  if (stateConfig.flatRate !== undefined) {
    stateTax = stateTaxableIncome * stateConfig.flatRate
  }
  // Progressive tax states
  else if (stateConfig.brackets) {
    let remainingIncome = stateTaxableIncome

    for (let i = 0; i < stateConfig.brackets.length; i++) {
      const bracket = stateConfig.brackets[i]
      const prevMax = i === 0 ? 0 : stateConfig.brackets[i - 1].max
      const bracketSize = bracket.max === Infinity ? remainingIncome : bracket.max - prevMax

      if (remainingIncome <= 0) break

      const taxableInBracket = Math.min(remainingIncome, bracketSize)
      stateTax += taxableInBracket * bracket.rate
      remainingIncome -= taxableInBracket
    }
  }

  // Local tax (NYC, MD counties, etc.)
  const localTax = stateConfig.localTaxRate
    ? stateTaxableIncome * stateConfig.localTaxRate
    : 0

  return { stateTax: Math.max(0, stateTax), localTax: Math.max(0, localTax) }
}

function calculateSocialSecurity(grossIncome: number, config: TaxYearConfig): number {
  const taxableWages = Math.min(grossIncome, config.socialSecurity.wageBase)
  return taxableWages * config.socialSecurity.rate
}

function calculateMedicare(
  grossIncome: number,
  filingStatus: FilingStatus,
  config: TaxYearConfig
): number {
  const baseMedicare = grossIncome * config.medicare.rate
  const threshold = config.medicare.additionalThreshold[filingStatus]

  if (grossIncome > threshold) {
    const additionalMedicare = (grossIncome - threshold) * config.medicare.additionalRate
    return baseMedicare + additionalMedicare
  }

  return baseMedicare
}

function getMarginalTaxRate(
  taxableIncome: number,
  filingStatus: FilingStatus,
  config: TaxYearConfig
): number {
  const brackets = config.federalBrackets[filingStatus]

  for (let i = brackets.length - 1; i >= 0; i--) {
    if (taxableIncome > (i === 0 ? 0 : brackets[i - 1].max)) {
      return brackets[i].rate * 100
    }
  }

  return brackets[0].rate * 100
}

function scaleBreakdown(yearly: TaxBreakdown, divisor: number): TaxBreakdown {
  return {
    grossIncome: yearly.grossIncome / divisor,
    adjustedGrossIncome: yearly.adjustedGrossIncome / divisor,
    standardDeduction: yearly.standardDeduction / divisor,
    taxableIncome: yearly.taxableIncome / divisor,
    federalTax: yearly.federalTax / divisor,
    stateTax: yearly.stateTax / divisor,
    localTax: yearly.localTax / divisor,
    socialSecurity: yearly.socialSecurity / divisor,
    medicare: yearly.medicare / divisor,
    retirement401k: yearly.retirement401k / divisor,
    hsaContribution: yearly.hsaContribution / divisor,
    totalFederalDeductions: yearly.totalFederalDeductions / divisor,
    totalStateDeductions: yearly.totalStateDeductions / divisor,
    totalDeductions: yearly.totalDeductions / divisor,
    takeHomePay: yearly.takeHomePay / divisor,
    effectiveTaxRate: yearly.effectiveTaxRate,
    marginalTaxRate: yearly.marginalTaxRate,
  }
}

export function calculateSalary(input: SalaryInput): SalaryResult {
  const config = getConfig(input.taxYear)
  const grossIncome = input.grossSalary + (input.bonus || 0)
  const retirement401k = input.retirement401k || 0
  const hsaContribution = input.hsaContribution || 0

  // Pre-tax deductions (reduce AGI)
  const adjustedGrossIncome = Math.max(0, grossIncome - retirement401k - hsaContribution)

  // Standard deduction
  const standardDeduction = config.standardDeduction[input.filingStatus]
  const taxableIncome = Math.max(0, adjustedGrossIncome - standardDeduction)

  // Calculate taxes
  const federalTax = calculateFederalTax(taxableIncome, input.filingStatus, config)
  const { stateTax, localTax } = input.includeLocalTax
    ? calculateStateTax(adjustedGrossIncome, input.state)
    : { stateTax: calculateStateTax(adjustedGrossIncome, input.state).stateTax, localTax: 0 }

  // FICA taxes (based on gross, not AGI)
  const socialSecurity = calculateSocialSecurity(grossIncome, config)
  const medicare = calculateMedicare(grossIncome, input.filingStatus, config)

  // Total deductions
  const totalFederalDeductions = federalTax + socialSecurity + medicare
  const totalStateDeductions = stateTax + localTax
  const totalDeductions = totalFederalDeductions + totalStateDeductions + retirement401k + hsaContribution

  const takeHomePay = grossIncome - totalDeductions

  // Effective tax rate (taxes only, not including retirement contributions)
  const taxesOnly = federalTax + stateTax + localTax + socialSecurity + medicare
  const effectiveTaxRate = grossIncome > 0 ? (taxesOnly / grossIncome) * 100 : 0

  const marginalTaxRate = getMarginalTaxRate(taxableIncome, input.filingStatus, config)

  const yearly: TaxBreakdown = {
    grossIncome,
    adjustedGrossIncome,
    standardDeduction,
    taxableIncome,
    federalTax,
    stateTax,
    localTax,
    socialSecurity,
    medicare,
    retirement401k,
    hsaContribution,
    totalFederalDeductions,
    totalStateDeductions,
    totalDeductions,
    takeHomePay,
    effectiveTaxRate,
    marginalTaxRate,
  }

  const stateConfig = STATE_TAX_CONFIGS[input.state]

  return {
    yearly,
    monthly: scaleBreakdown(yearly, 12),
    biweekly: scaleBreakdown(yearly, 26),
    weekly: scaleBreakdown(yearly, 52),
    daily: scaleBreakdown(yearly, 260),
    hourly: scaleBreakdown(yearly, 2080),
    taxYear: config.year,
    filingStatus: input.filingStatus,
    state: input.state,
    stateName: stateConfig?.name || input.state,
  }
}

// Format currency for display (USD)
export function formatCurrency(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

// Parse salary from URL slug
export function parseSalaryFromSlug(slug: string): number | null {
  const cleaned = slug.toLowerCase().replace(/[^0-9k.]/g, '')

  if (cleaned.includes('k')) {
    const num = parseFloat(cleaned.replace('k', ''))
    return isNaN(num) ? null : num * 1000
  }

  const num = parseFloat(cleaned)
  return isNaN(num) ? null : num
}

// Generate SEO-friendly slug from salary
export function generateSalarySlug(salary: number): string {
  if (salary >= 1000) {
    const k = salary / 1000
    if (Number.isInteger(k)) {
      return `${k}k-salary`
    }
  }
  return `${salary}-salary`
}

// Common salary ranges for sitemap generation (US context)
export const COMMON_SALARIES = [
  // Entry level
  25000, 30000, 32000, 35000, 37500, 40000,
  // Mid level
  42000, 45000, 47500, 50000, 52500, 55000, 57500,
  // Professional
  60000, 62500, 65000, 67500, 70000, 72500, 75000, 77500,
  // Senior
  80000, 82500, 85000, 87500, 90000, 92500, 95000, 97500,
  // Management
  100000, 105000, 110000, 115000, 120000, 125000,
  // Senior Management
  130000, 140000, 150000, 160000, 170000, 175000,
  // Director level
  180000, 190000, 200000, 225000, 250000,
  // Executive
  275000, 300000, 350000, 400000, 450000, 500000,
]

// Employer Cost Calculator
export interface EmployerCostInput {
  grossSalary: number
  state?: string
  employer401kMatch?: number // Percentage (e.g., 4 for 4%)
  taxYear?: string
}

export interface EmployerCostResult {
  grossSalary: number
  employerSocialSecurity: number
  employerMedicare: number
  employerFUTA: number // Federal Unemployment
  employerSUTA: number // State Unemployment (estimated)
  employer401kMatch: number
  totalCost: number
  costPerMonth: number
  costPerDay: number
  taxYear: string
}

export function calculateEmployerCost(input: EmployerCostInput): EmployerCostResult {
  const config = getConfig(input.taxYear)
  const { grossSalary, employer401kMatch = 0 } = input

  // Employer Social Security (same as employee - 6.2%)
  const employerSocialSecurity = Math.min(grossSalary, config.socialSecurity.wageBase) * config.socialSecurity.rate

  // Employer Medicare (same as employee - 1.45%, no additional tax)
  const employerMedicare = grossSalary * config.medicare.rate

  // FUTA (Federal Unemployment Tax) - 6% on first $7,000, but usually 0.6% after state credit
  const futaWageBase = 7000
  const futaRate = 0.006 // After state credit
  const employerFUTA = Math.min(grossSalary, futaWageBase) * futaRate

  // SUTA (State Unemployment Tax) - varies by state, using average estimate
  const sutaWageBase = 10000 // Varies by state
  const sutaRate = 0.027 // Average rate, varies significantly
  const employerSUTA = Math.min(grossSalary, sutaWageBase) * sutaRate

  // 401(k) employer match
  const match401k = grossSalary * (employer401kMatch / 100)

  const totalCost = grossSalary + employerSocialSecurity + employerMedicare + employerFUTA + employerSUTA + match401k

  return {
    grossSalary,
    employerSocialSecurity,
    employerMedicare,
    employerFUTA,
    employerSUTA,
    employer401kMatch: match401k,
    totalCost,
    costPerMonth: totalCost / 12,
    costPerDay: totalCost / 260,
    taxYear: config.year,
  }
}

// Self-Employment Tax Calculator
export interface SelfEmploymentInput {
  netEarnings: number
  filingStatus: FilingStatus
  taxYear?: string
}

export interface SelfEmploymentResult {
  netEarnings: number
  selfEmploymentTaxBase: number // 92.35% of net earnings
  socialSecurityTax: number
  medicareTax: number
  totalSelfEmploymentTax: number
  deductiblePortion: number // 50% of SE tax
  taxYear: string
}

export function calculateSelfEmploymentTax(input: SelfEmploymentInput): SelfEmploymentResult {
  const config = getConfig(input.taxYear)
  const { netEarnings } = input

  // SE tax is calculated on 92.35% of net earnings
  const selfEmploymentTaxBase = netEarnings * 0.9235

  // Social Security portion (12.4% up to wage base)
  const socialSecurityTax = Math.min(selfEmploymentTaxBase, config.socialSecurity.wageBase) * config.selfEmployment.socialSecurityRate

  // Medicare portion (2.9% on all earnings)
  let medicareTax = selfEmploymentTaxBase * config.selfEmployment.medicareRate

  // Additional Medicare tax for high earners
  const threshold = config.medicare.additionalThreshold[input.filingStatus]
  if (selfEmploymentTaxBase > threshold) {
    medicareTax += (selfEmploymentTaxBase - threshold) * config.medicare.additionalRate
  }

  const totalSelfEmploymentTax = socialSecurityTax + medicareTax
  const deductiblePortion = totalSelfEmploymentTax * config.selfEmployment.deductiblePortion

  return {
    netEarnings,
    selfEmploymentTaxBase,
    socialSecurityTax,
    medicareTax,
    totalSelfEmploymentTax,
    deductiblePortion,
    taxYear: config.year,
  }
}

// SEO metadata generators
export function generateSalaryPageMeta(salary: number, state?: string, taxYear?: string) {
  const config = getConfig(taxYear)
  const result = calculateSalary({
    grossSalary: salary,
    filingStatus: 'single',
    state: state || 'TX', // Default to no state tax for generic
    taxYear,
  })

  const formattedSalary = formatCurrency(salary, 0)
  const formattedTakeHome = formatCurrency(result.yearly.takeHomePay, 0)
  const formattedMonthly = formatCurrency(result.monthly.takeHomePay, 0)
  const stateText = state ? ` in ${result.stateName}` : ''

  return {
    title: `${formattedSalary} Salary - US Take Home Pay Calculator ${config.year}`,
    description: `Calculate your ${formattedSalary} salary take home pay${stateText} for ${config.year}. After federal tax, state tax, Social Security, and Medicare, you'll take home ${formattedTakeHome} per year (${formattedMonthly} per month).`,
    keywords: [
      `${formattedSalary} salary`,
      `${formattedSalary} take home pay`,
      `${formattedSalary} after taxes`,
      'us salary calculator',
      `${config.year} tax calculator`,
      'take home pay calculator',
      'federal tax calculator',
    ],
  }
}
