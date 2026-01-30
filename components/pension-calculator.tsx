'use client'

import { useState, useMemo } from 'react'
import { calculateSalary, formatCurrency, TAX_YEAR } from '@/lib/us-tax-calculator'
import { currentTaxConfig } from '@/lib/us-tax-config'
import { PiggyBank, Calculator, TrendingUp, Wallet, DollarSign, Percent } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { FilingStatus } from '@/lib/us-tax-config'

interface RetirementResult {
  grossSalary: number
  contribution401kAmount: number
  employerMatchAmount: number
  totalRetirementContribution: number
  federalTaxSavings: number
  ficaSavings: number
  totalSavings: number
  takeHomeWith401k: number
  takeHomeWithout401k: number
  effectiveCostOf401k: number
  effectiveCostPercentage: number
  yearlyRetirementGrowth: number
}

function calculateRetirementBenefits(
  salary: number,
  employeeContributionPercent: number,
  employerMatchPercent: number,
  filingStatus: FilingStatus,
  state: string
): RetirementResult {
  // Calculate 401k contribution amount (capped at IRS limit)
  const employeeContributionAmount = Math.min(
    (salary * employeeContributionPercent) / 100,
    currentTaxConfig.retirement401k.employeeLimit
  )

  const salaryWithout401k = calculateSalary({
    grossSalary: salary,
    filingStatus,
    state,
    retirement401k: 0,
  })

  const salaryWith401k = calculateSalary({
    grossSalary: salary,
    filingStatus,
    state,
    retirement401k: employeeContributionAmount,
  })

  const employerMatchAmount = (salary * employerMatchPercent) / 100
  const totalRetirementContribution = employeeContributionAmount + employerMatchAmount

  const federalTaxSavings = salaryWithout401k.yearly.federalTax - salaryWith401k.yearly.federalTax
  const stateTaxSavings = salaryWithout401k.yearly.stateTax - salaryWith401k.yearly.stateTax

  // Note: Traditional 401(k) reduces federal taxable income but doesn't reduce FICA taxes
  const ficaSavings = 0

  const totalSavings = federalTaxSavings + stateTaxSavings

  const takeHomeWith401k = salaryWith401k.yearly.takeHomePay
  const takeHomeWithout401k = salaryWithout401k.yearly.takeHomePay

  const effectiveCostOf401k = employeeContributionAmount - totalSavings
  const effectiveCostPercentage = salary > 0 ? (effectiveCostOf401k / salary) * 100 : 0

  const assumedGrowthRate = 0.07
  const yearlyRetirementGrowth = totalRetirementContribution * assumedGrowthRate

  return {
    grossSalary: salary,
    contribution401kAmount: employeeContributionAmount,
    employerMatchAmount,
    totalRetirementContribution,
    federalTaxSavings,
    ficaSavings,
    totalSavings,
    takeHomeWith401k,
    takeHomeWithout401k,
    effectiveCostOf401k,
    effectiveCostPercentage,
    yearlyRetirementGrowth,
  }
}

const QUICK_SALARIES = [50000, 75000, 100000, 125000, 150000]
const QUICK_CONTRIBUTIONS = [3, 6, 10, 15, 20]

interface PensionCalculatorProps {
  initialSalary?: number
  initialContribution?: number
}

export function PensionCalculator({
  initialSalary = 75000,
  initialContribution = 6,
}: PensionCalculatorProps) {
  const [salary, setSalary] = useState(initialSalary)
  const [employeeContribution, setEmployeeContribution] = useState(initialContribution)
  const [employerMatch, setEmployerMatch] = useState(3)
  const [filingStatus, setFilingStatus] = useState<FilingStatus>('single')
  const [state, setState] = useState('TX')

  const result = useMemo(
    () =>
      calculateRetirementBenefits(
        salary,
        employeeContribution,
        employerMatch,
        filingStatus,
        state
      ),
    [salary, employeeContribution, employerMatch, filingStatus, state]
  )

  const taxBracket = useMemo(() => {
    const taxableIncome = salary - currentTaxConfig.standardDeduction[filingStatus]
    const brackets = currentTaxConfig.federalBrackets[filingStatus]

    for (let i = brackets.length - 1; i >= 0; i--) {
      if (taxableIncome > brackets[i].min) {
        return `${brackets[i].rate}%`
      }
    }
    return '10%'
  }, [salary, filingStatus])

  const maxContribution = currentTaxConfig.retirement401k.employeeLimit
  const catchUpContribution = currentTaxConfig.retirement401k.catchUpLimit

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Calculator className="h-5 w-5 text-accent" />
              Your Details
            </h2>

            <div className="space-y-5">
              <div>
                <Label htmlFor="salary" className="mb-2">
                  Annual Salary
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    type="number"
                    id="salary"
                    value={salary}
                    onChange={(e) => setSalary(Number(e.target.value))}
                    className="pl-8 h-12"
                  />
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {QUICK_SALARIES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSalary(s)}
                      className={`px-3 py-1 text-xs rounded-full transition-colors ${
                        salary === s
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-accent/20'
                      }`}
                    >
                      ${s.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="employeeContribution" className="mb-2">
                  Your 401(k) Contribution (%)
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    id="employeeContribution"
                    value={employeeContribution}
                    onChange={(e) => setEmployeeContribution(Number(e.target.value))}
                    min={0}
                    max={100}
                    step={0.5}
                    className="pr-8 h-12"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    %
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {QUICK_CONTRIBUTIONS.map((c) => (
                    <button
                      key={c}
                      onClick={() => setEmployeeContribution(c)}
                      className={`px-3 py-1 text-xs rounded-full transition-colors ${
                        employeeContribution === c
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-accent/20'
                      }`}
                    >
                      {c}%
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="employerMatch" className="mb-2">
                  Employer Match (%)
                </Label>
                <div className="relative">
                  <Input
                    type="number"
                    id="employerMatch"
                    value={employerMatch}
                    onChange={(e) => setEmployerMatch(Number(e.target.value))}
                    min={0}
                    max={100}
                    step={0.5}
                    className="pr-8 h-12"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    %
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Common matches: 3%, 4%, 6% (often up to a limit like 50% of first 6%)
                </p>
              </div>

              <div>
                <Label htmlFor="filingStatus" className="mb-2">
                  Filing Status
                </Label>
                <Select
                  value={filingStatus}
                  onValueChange={(value) => setFilingStatus(value as FilingStatus)}
                >
                  <SelectTrigger className="w-full h-12">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married_jointly">Married Filing Jointly</SelectItem>
                    <SelectItem value="married_separately">Married Filing Separately</SelectItem>
                    <SelectItem value="head_of_household">Head of Household</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="state" className="mb-2">
                  State
                </Label>
                <Select value={state} onValueChange={setState}>
                  <SelectTrigger className="w-full h-12">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TX">Texas (no state tax)</SelectItem>
                    <SelectItem value="FL">Florida (no state tax)</SelectItem>
                    <SelectItem value="CA">California</SelectItem>
                    <SelectItem value="NY">New York</SelectItem>
                    <SelectItem value="WA">Washington (no state tax)</SelectItem>
                    <SelectItem value="NV">Nevada (no state tax)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 p-6 ring-1 ring-accent/20">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <PiggyBank className="h-5 w-5 text-accent" />
              401(k) Summary
            </h2>

            <div className="grid gap-4">
              <div className="flex justify-between items-center py-2 border-b border-border/30">
                <span className="text-muted-foreground">Your contribution</span>
                <span className="font-semibold text-foreground">
                  {formatCurrency(result.contribution401kAmount)}/year
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/30">
                <span className="text-muted-foreground">Employer match</span>
                <span className="font-semibold text-foreground">
                  {formatCurrency(result.employerMatchAmount)}/year
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/30">
                <span className="text-muted-foreground font-medium">Total to 401(k)</span>
                <span className="font-bold text-accent text-lg">
                  {formatCurrency(result.totalRetirementContribution)}/year
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Tax Benefits
            </h2>

            <div className="grid gap-4">
              <div className="flex justify-between items-center py-2 border-b border-border/30">
                <span className="text-muted-foreground">Federal tax savings</span>
                <span className="font-semibold text-green-600 dark:text-green-400">
                  +{formatCurrency(result.federalTaxSavings)}/year
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/30">
                <span className="text-muted-foreground font-medium">Total tax savings</span>
                <span className="font-bold text-green-600 dark:text-green-400">
                  {formatCurrency(result.totalSavings)}/year
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">Effective cost of 401(k)</span>
                <span className="font-semibold text-foreground">
                  {formatCurrency(result.effectiveCostOf401k)}/year
                </span>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900">
              <p className="text-sm text-green-800 dark:text-green-200">
                <strong>You're saving {formatCurrency(result.totalSavings)}</strong> in federal tax by
                contributing to your 401(k). Your {formatCurrency(result.contribution401kAmount)}
                contribution only costs you {formatCurrency(result.effectiveCostOf401k)} after the tax deduction.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Wallet className="h-5 w-5 text-accent" />
              Take-Home Pay Comparison
            </h2>

            <div className="grid gap-4">
              <div className="flex justify-between items-center py-2 border-b border-border/30">
                <span className="text-muted-foreground">Without 401(k)</span>
                <span className="font-semibold text-foreground">
                  {formatCurrency(result.takeHomeWithout401k)}/year
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/30">
                <span className="text-muted-foreground">With 401(k)</span>
                <span className="font-semibold text-foreground">
                  {formatCurrency(result.takeHomeWith401k)}/year
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">Monthly take-home with 401(k)</span>
                <span className="font-bold text-accent">
                  {formatCurrency(result.takeHomeWith401k / 12)}/month
                </span>
              </div>
            </div>

            <div className="mt-4 text-sm text-muted-foreground">
              <p>
                Your federal tax bracket: <span className="font-medium text-foreground">{taxBracket}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-accent/5 p-6 ring-1 ring-accent/20">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Percent className="h-5 w-5 text-accent" />
          Understanding 401(k) Tax Benefits
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="font-medium text-foreground mb-2">How Traditional 401(k) Works</h3>
            <p className="text-sm text-muted-foreground">
              Traditional 401(k) contributions reduce your taxable income. If you're in the 24% tax bracket,
              every $100 you contribute saves you $24 in federal taxes. Your money grows tax-deferred until
              you withdraw it in retirement.
            </p>
          </div>
          <div>
            <h3 className="font-medium text-foreground mb-2">{TAX_YEAR} Contribution Limits</h3>
            <p className="text-sm text-muted-foreground">
              You can contribute up to ${maxContribution.toLocaleString()} to your 401(k) in {TAX_YEAR}.
              If you're 50 or older, you can contribute an additional ${catchUpContribution.toLocaleString()}
              (catch-up contribution) for a total of ${(maxContribution + catchUpContribution).toLocaleString()}.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
