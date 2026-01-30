'use client'

import { useState, useMemo } from 'react'
import { calculateSalary, formatCurrency, TAX_YEAR } from '@/lib/us-tax-calculator'
import { currentTaxConfig } from '@/lib/us-tax-config'
import { Building2, Calculator, PieChart, TrendingUp, Wallet, DollarSign } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { FilingStatus } from '@/lib/us-tax-config'

// US Qualified Dividend & Capital Gains Tax Rates (2025)
const QUALIFIED_DIVIDEND_RATES = {
  single: [
    { threshold: 47025, rate: 0 },
    { threshold: 518900, rate: 0.15 },
    { threshold: Infinity, rate: 0.20 },
  ],
  married_jointly: [
    { threshold: 94050, rate: 0 },
    { threshold: 583750, rate: 0.15 },
    { threshold: Infinity, rate: 0.20 },
  ],
  married_separately: [
    { threshold: 47025, rate: 0 },
    { threshold: 291850, rate: 0.15 },
    { threshold: Infinity, rate: 0.20 },
  ],
  head_of_household: [
    { threshold: 63000, rate: 0 },
    { threshold: 551350, rate: 0.15 },
    { threshold: Infinity, rate: 0.20 },
  ],
}

// Net Investment Income Tax threshold
const NIIT_THRESHOLD = {
  single: 200000,
  married_jointly: 250000,
  married_separately: 125000,
  head_of_household: 200000,
}
const NIIT_RATE = 0.038 // 3.8%

interface DividendResult {
  qualifiedDividends: number
  ordinaryDividends: number
  qualifiedDividendTax: number
  ordinaryDividendTax: number
  niitTax: number
  totalDividendTax: number
  netDividend: number
  effectiveDividendTaxRate: number
  totalIncome: number
  combinedTakeHome: number
  qualifiedRate: number
}

function calculateDividendTax(
  otherIncome: number,
  qualifiedDividends: number,
  ordinaryDividends: number,
  filingStatus: FilingStatus,
  state: string
): DividendResult {
  const totalDividends = qualifiedDividends + ordinaryDividends
  const totalIncome = otherIncome + totalDividends

  // Calculate tax on qualified dividends using capital gains rates
  const brackets = QUALIFIED_DIVIDEND_RATES[filingStatus]
  let qualifiedDividendTax = 0
  let qualifiedRate = 0

  // Determine which bracket the qualified dividends fall into based on total income
  for (let i = brackets.length - 1; i >= 0; i--) {
    if (totalIncome > brackets[i].threshold || i === 0) {
      qualifiedRate = brackets[Math.min(i + 1, brackets.length - 1)].rate
      break
    }
  }

  // More accurate bracket calculation
  let remainingQualified = qualifiedDividends
  let currentIncome = otherIncome

  for (const bracket of brackets) {
    if (remainingQualified <= 0) break

    const spaceInBracket = Math.max(0, bracket.threshold - currentIncome)
    const amountInBracket = Math.min(remainingQualified, spaceInBracket)

    if (amountInBracket > 0) {
      qualifiedDividendTax += amountInBracket * bracket.rate
      remainingQualified -= amountInBracket
      currentIncome += amountInBracket
    }
  }

  // Any remaining qualified dividends are taxed at top rate
  if (remainingQualified > 0) {
    qualifiedDividendTax += remainingQualified * brackets[brackets.length - 1].rate
  }

  // Calculate tax on ordinary dividends (taxed as ordinary income)
  const salaryWithDividends = calculateSalary({
    grossSalary: otherIncome + ordinaryDividends,
    filingStatus,
    state,
  })

  const salaryWithoutDividends = calculateSalary({
    grossSalary: otherIncome,
    filingStatus,
    state,
  })

  const ordinaryDividendTax = salaryWithDividends.yearly.federalTax - salaryWithoutDividends.yearly.federalTax

  // Calculate Net Investment Income Tax (NIIT) - 3.8% on investment income for high earners
  const niitThreshold = NIIT_THRESHOLD[filingStatus]
  let niitTax = 0
  if (totalIncome > niitThreshold) {
    const niitableAmount = Math.min(totalDividends, totalIncome - niitThreshold)
    niitTax = niitableAmount * NIIT_RATE
  }

  const totalDividendTax = qualifiedDividendTax + ordinaryDividendTax + niitTax
  const netDividend = totalDividends - totalDividendTax
  const effectiveDividendTaxRate = totalDividends > 0 ? (totalDividendTax / totalDividends) * 100 : 0

  const salaryResult = calculateSalary({
    grossSalary: otherIncome,
    filingStatus,
    state,
  })

  const combinedTakeHome = salaryResult.yearly.takeHomePay + netDividend

  return {
    qualifiedDividends,
    ordinaryDividends,
    qualifiedDividendTax,
    ordinaryDividendTax,
    niitTax,
    totalDividendTax,
    netDividend,
    effectiveDividendTaxRate,
    totalIncome,
    combinedTakeHome,
    qualifiedRate,
  }
}

const QUICK_DIVIDENDS = [5000, 10000, 25000, 50000, 100000]
const QUICK_SALARIES = [50000, 75000, 100000, 150000, 200000]

interface DividendCalculatorProps {
  initialSalary?: number
  initialDividend?: number
}

export function DividendCalculator({
  initialSalary = 75000,
  initialDividend = 25000,
}: DividendCalculatorProps) {
  const [otherIncome, setOtherIncome] = useState(initialSalary)
  const [qualifiedDividends, setQualifiedDividends] = useState(initialDividend)
  const [ordinaryDividends, setOrdinaryDividends] = useState(0)
  const [filingStatus, setFilingStatus] = useState<FilingStatus>('single')
  const [state, setState] = useState('TX')

  const result = useMemo(
    () => calculateDividendTax(otherIncome, qualifiedDividends, ordinaryDividends, filingStatus, state),
    [otherIncome, qualifiedDividends, ordinaryDividends, filingStatus, state]
  )

  const salaryResult = useMemo(
    () =>
      calculateSalary({
        grossSalary: otherIncome,
        filingStatus,
        state,
      }),
    [otherIncome, filingStatus, state]
  )

  const taxStrategy = useMemo(() => {
    const niitThreshold = NIIT_THRESHOLD[filingStatus]

    if (result.totalIncome > niitThreshold) {
      return {
        status: 'warning',
        message: `Your income exceeds $${niitThreshold.toLocaleString()}. You're subject to the 3.8% Net Investment Income Tax on dividends.`,
      }
    }
    if (result.qualifiedRate === 0) {
      return {
        status: 'optimal',
        message: 'Your qualified dividends are taxed at 0%! Great for tax-efficient investing.',
      }
    }
    return null
  }, [result, filingStatus])

  return (
    <div className="space-y-8">
      <div className="mx-auto max-w-lg grid grid-cols-1 items-center gap-y-6 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
        <div className="rounded-3xl rounded-t-3xl sm:rounded-b-none lg:rounded-tr-none lg:rounded-bl-3xl bg-card/60 dark:bg-card/40 p-8 ring-1 ring-border/50 sm:p-10 sm:mx-8 lg:mx-0">
          <h3 className="text-base/7 font-semibold text-accent flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Income Details
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Calculate dividend tax for {TAX_YEAR}
          </p>

          <div className="mt-8 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="otherIncome">
                W-2 Income (Salary/Wages)
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-medium text-muted-foreground">
                  $
                </span>
                <Input
                  id="otherIncome"
                  type="number"
                  value={otherIncome || ''}
                  onChange={(e) => setOtherIncome(parseFloat(e.target.value) || 0)}
                  className="pl-9 h-12 text-lg font-semibold bg-background border-border"
                  placeholder="75,000"
                />
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {QUICK_SALARIES.map((salary) => (
                  <button
                    key={salary}
                    type="button"
                    onClick={() => setOtherIncome(salary)}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                      otherIncome === salary
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    ${salary >= 1000 ? `${(salary / 1000).toFixed(0)}k` : salary}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="qualifiedDividends">
                Qualified Dividends
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-medium text-muted-foreground">
                  $
                </span>
                <Input
                  id="qualifiedDividends"
                  type="number"
                  value={qualifiedDividends || ''}
                  onChange={(e) => setQualifiedDividends(parseFloat(e.target.value) || 0)}
                  className="pl-9 h-12 text-lg font-semibold bg-background border-border"
                  placeholder="25,000"
                />
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {QUICK_DIVIDENDS.map((dividend) => (
                  <button
                    key={dividend}
                    type="button"
                    onClick={() => setQualifiedDividends(dividend)}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                      qualifiedDividends === dividend
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    ${(dividend / 1000).toFixed(0)}k
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Dividends from US corporations held 60+ days (taxed at 0%, 15%, or 20%)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ordinaryDividends">
                Ordinary (Non-Qualified) Dividends
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-medium text-muted-foreground">
                  $
                </span>
                <Input
                  id="ordinaryDividends"
                  type="number"
                  value={ordinaryDividends || ''}
                  onChange={(e) => setOrdinaryDividends(parseFloat(e.target.value) || 0)}
                  className="pl-9 h-12 text-lg font-semibold bg-background border-border"
                  placeholder="0"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                REITs, money market funds, etc. (taxed as ordinary income)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Filing Status</Label>
                <Select value={filingStatus} onValueChange={(v) => setFilingStatus(v as FilingStatus)}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married_jointly">Married Filing Jointly</SelectItem>
                    <SelectItem value="married_separately">Married Separately</SelectItem>
                    <SelectItem value="head_of_household">Head of Household</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Select value={state} onValueChange={setState}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TX">Texas (no state tax)</SelectItem>
                    <SelectItem value="FL">Florida (no state tax)</SelectItem>
                    <SelectItem value="CA">California</SelectItem>
                    <SelectItem value="NY">New York</SelectItem>
                    <SelectItem value="WA">Washington</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {taxStrategy && (
            <div
              className={`mt-6 p-4 rounded-xl ${
                taxStrategy.status === 'optimal'
                  ? 'bg-green-500/10 text-green-700 dark:text-green-400'
                  : taxStrategy.status === 'warning'
                  ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                  : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
              }`}
            >
              <p className="text-sm">{taxStrategy.message}</p>
            </div>
          )}
        </div>

        <div className="rounded-3xl bg-accent/5 dark:bg-accent/10 p-8 ring-1 ring-accent/20 sm:p-10 sm:mx-8 lg:mx-0">
          <h3 className="text-base/7 font-semibold text-accent flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Combined Take-Home
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            After tax breakdown for {TAX_YEAR}
          </p>

          <div className="mt-6">
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">Total Take-Home Pay</p>
              <p className="text-4xl font-bold text-foreground mt-2">
                {formatCurrency(result.combinedTakeHome, 0)}
              </p>
              <p className="text-sm mt-2 text-muted-foreground">
                From {formatCurrency(result.totalIncome, 0)} total income
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <div className="pb-2 border-b border-border/50">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  W-2 Income
                </p>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-muted-foreground">Gross Salary</span>
                <span className="font-semibold text-foreground">{formatCurrency(otherIncome, 0)}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-muted-foreground">Federal Tax</span>
                <span className="font-semibold text-destructive">
                  −{formatCurrency(salaryResult.yearly.federalTax, 0)}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-muted-foreground">FICA (SS + Medicare)</span>
                <span className="font-semibold text-destructive">
                  −{formatCurrency(salaryResult.yearly.socialSecurity + salaryResult.yearly.medicare, 0)}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-border/50">
                <span className="text-sm font-medium text-foreground">Net Salary</span>
                <span className="font-semibold text-foreground">
                  {formatCurrency(salaryResult.yearly.takeHomePay, 0)}
                </span>
              </div>

              <div className="pt-2 pb-2 border-b border-border/50">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Dividends
                </p>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-muted-foreground">Qualified Dividends</span>
                <span className="font-semibold text-foreground">
                  {formatCurrency(result.qualifiedDividends, 0)}
                </span>
              </div>
              {result.ordinaryDividends > 0 && (
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-muted-foreground">Ordinary Dividends</span>
                  <span className="font-semibold text-foreground">
                    {formatCurrency(result.ordinaryDividends, 0)}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center py-1">
                <span className="text-sm text-muted-foreground">Qualified Dividend Tax</span>
                <span className="font-semibold text-destructive">
                  −{formatCurrency(result.qualifiedDividendTax, 0)}
                </span>
              </div>
              {result.ordinaryDividendTax > 0 && (
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-muted-foreground">Ordinary Dividend Tax</span>
                  <span className="font-semibold text-destructive">
                    −{formatCurrency(result.ordinaryDividendTax, 0)}
                  </span>
                </div>
              )}
              {result.niitTax > 0 && (
                <div className="flex justify-between items-center py-1">
                  <span className="text-sm text-muted-foreground">NIIT (3.8%)</span>
                  <span className="font-semibold text-destructive">
                    −{formatCurrency(result.niitTax, 0)}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center py-1 border-b border-border/50">
                <span className="text-sm font-medium text-foreground">Net Dividends</span>
                <span className="font-semibold text-foreground">{formatCurrency(result.netDividend, 0)}</span>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="font-semibold text-foreground">Total Take-Home</span>
                <span className="font-bold text-lg text-accent">
                  {formatCurrency(result.combinedTakeHome, 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl grid gap-6 md:grid-cols-4">
        <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-accent/10">
              <DollarSign className="h-5 w-5 text-accent" />
            </div>
            <h4 className="font-semibold text-foreground">Total Income</h4>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {formatCurrency(result.totalIncome, 0)}
          </p>
          <p className="text-sm text-muted-foreground mt-1">Salary + Dividends</p>
        </div>

        <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-accent/10">
              <PieChart className="h-5 w-5 text-accent" />
            </div>
            <h4 className="font-semibold text-foreground">Dividend Tax Rate</h4>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {result.effectiveDividendTaxRate.toFixed(1)}%
          </p>
          <p className="text-sm text-muted-foreground mt-1">Effective rate on dividends</p>
        </div>

        <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-accent/10">
              <Wallet className="h-5 w-5 text-accent" />
            </div>
            <h4 className="font-semibold text-foreground">You Keep</h4>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {((result.combinedTakeHome / result.totalIncome) * 100).toFixed(1)}%
          </p>
          <p className="text-sm text-muted-foreground mt-1">Of total income</p>
        </div>

        <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-accent/10">
              <TrendingUp className="h-5 w-5 text-accent" />
            </div>
            <h4 className="font-semibold text-foreground">Monthly</h4>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {formatCurrency(result.combinedTakeHome / 12, 0)}
          </p>
          <p className="text-sm text-muted-foreground mt-1">Take-home per month</p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl rounded-2xl bg-muted/50 p-8">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Dividend Tax Rates {TAX_YEAR}
        </h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-background p-4 ring-1 ring-border/50">
            <p className="text-sm text-muted-foreground">Qualified Rate (0%)</p>
            <p className="text-xl font-bold text-foreground mt-1">
              Up to ${QUALIFIED_DIVIDEND_RATES.single[0].threshold.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Single filer</p>
          </div>
          <div className="rounded-xl bg-background p-4 ring-1 ring-border/50">
            <p className="text-sm text-muted-foreground">Qualified Rate (15%)</p>
            <p className="text-xl font-bold text-foreground mt-1">
              Up to ${QUALIFIED_DIVIDEND_RATES.single[1].threshold.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Single filer</p>
          </div>
          <div className="rounded-xl bg-background p-4 ring-1 ring-border/50">
            <p className="text-sm text-muted-foreground">Qualified Rate (20%)</p>
            <p className="text-xl font-bold text-foreground mt-1">
              Over ${QUALIFIED_DIVIDEND_RATES.single[1].threshold.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Single filer</p>
          </div>
          <div className="rounded-xl bg-background p-4 ring-1 ring-border/50">
            <p className="text-sm text-muted-foreground">NIIT Threshold</p>
            <p className="text-xl font-bold text-foreground mt-1">
              ${NIIT_THRESHOLD.single.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">+3.8% on investment income</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Qualified dividends are from US corporations (or qualifying foreign corporations) held for at least 60 days.
          Ordinary dividends are taxed at your marginal income tax rate.
        </p>
      </div>
    </div>
  )
}
