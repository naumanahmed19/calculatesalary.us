'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { currentTaxConfig, type FilingStatus } from '@/lib/us-tax-config'
import { formatCurrency, TAX_YEAR } from '@/lib/us-tax-calculator'
import { PiggyBank, TrendingUp, DollarSign, Percent } from 'lucide-react'

// 2025 Limits
const LIMITS_2025 = {
  employeeLimit: 23500,
  catchUpLimit: 7500, // Age 50-59, 64+
  superCatchUpLimit: 11250, // Age 60-63 (new for 2025)
  totalLimit: 70000, // Including employer contributions
}

interface Calculation401k {
  annualContribution: number
  monthlyContribution: number
  perPaycheckContribution: number
  federalTaxSavings: number
  stateTaxSavings: number
  totalTaxSavings: number
  effectiveCost: number
  projectedBalance5Years: number
  projectedBalance10Years: number
  projectedBalance20Years: number
  projectedBalance30Years: number
  employerMatch: number
  totalAnnualSavings: number
}

export function Calculator401k() {
  const [salary, setSalary] = useState(75000)
  const [contributionPercent, setContributionPercent] = useState(6)
  const [filingStatus, setFilingStatus] = useState<FilingStatus>('single')
  const [age, setAge] = useState(35)
  const [employerMatchPercent, setEmployerMatchPercent] = useState(3)
  const [employerMatchLimit, setEmployerMatchLimit] = useState(6) // Match up to 6% of salary
  const [isRoth, setIsRoth] = useState(false)
  const [expectedReturn, setExpectedReturn] = useState(7)

  const calculation = useMemo((): Calculation401k => {
    // Calculate contribution
    let maxContribution = LIMITS_2025.employeeLimit

    // Catch-up contributions
    if (age >= 50 && age <= 59) {
      maxContribution += LIMITS_2025.catchUpLimit
    } else if (age >= 60 && age <= 63) {
      maxContribution += LIMITS_2025.superCatchUpLimit // New super catch-up for 2025
    } else if (age >= 64) {
      maxContribution += LIMITS_2025.catchUpLimit
    }

    const desiredContribution = salary * (contributionPercent / 100)
    const annualContribution = Math.min(desiredContribution, maxContribution)
    const monthlyContribution = annualContribution / 12
    const perPaycheckContribution = annualContribution / 26 // Bi-weekly

    // Calculate employer match
    const matchableContribution = Math.min(contributionPercent, employerMatchLimit)
    const employerMatch = salary * (matchableContribution / 100) * (employerMatchPercent / 100) * (employerMatchLimit / matchableContribution || 0)
    const actualEmployerMatch = Math.min(
      salary * (Math.min(contributionPercent, employerMatchLimit) / 100) * (employerMatchPercent / 100),
      salary * (employerMatchLimit / 100) * (employerMatchPercent / 100)
    )

    // Calculate tax savings (only for Traditional 401k, not Roth)
    let federalTaxSavings = 0
    let stateTaxSavings = 0

    if (!isRoth) {
      // Estimate marginal federal tax rate
      const brackets = currentTaxConfig.federalBrackets[filingStatus]
      const standardDeduction = currentTaxConfig.standardDeduction[filingStatus]
      const taxableIncome = salary - standardDeduction

      let marginalRate = 0.22 // Default
      for (let i = brackets.length - 1; i >= 0; i--) {
        const prevMax = i === 0 ? 0 : brackets[i - 1].max
        if (taxableIncome > prevMax) {
          marginalRate = brackets[i].rate
          break
        }
      }

      federalTaxSavings = annualContribution * marginalRate

      // Estimate state tax savings (average ~5%)
      stateTaxSavings = annualContribution * 0.05
    }

    const totalTaxSavings = federalTaxSavings + stateTaxSavings
    const effectiveCost = annualContribution - totalTaxSavings

    // Calculate projected balances with compound interest
    const totalAnnualSavings = annualContribution + actualEmployerMatch
    const monthlyRate = expectedReturn / 100 / 12

    const futureValue = (years: number) => {
      const months = years * 12
      const monthlyContrib = totalAnnualSavings / 12
      // FV = PMT × (((1 + r)^n - 1) / r)
      return monthlyContrib * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)
    }

    return {
      annualContribution,
      monthlyContribution,
      perPaycheckContribution,
      federalTaxSavings,
      stateTaxSavings,
      totalTaxSavings,
      effectiveCost,
      projectedBalance5Years: futureValue(5),
      projectedBalance10Years: futureValue(10),
      projectedBalance20Years: futureValue(20),
      projectedBalance30Years: futureValue(30),
      employerMatch: actualEmployerMatch,
      totalAnnualSavings,
    }
  }, [salary, contributionPercent, filingStatus, age, employerMatchPercent, employerMatchLimit, isRoth, expectedReturn])

  // Calculate max contribution based on age
  const getMaxContribution = () => {
    let max = LIMITS_2025.employeeLimit
    if (age >= 50 && age <= 59) max += LIMITS_2025.catchUpLimit
    else if (age >= 60 && age <= 63) max += LIMITS_2025.superCatchUpLimit
    else if (age >= 64) max += LIMITS_2025.catchUpLimit
    return max
  }

  return (
    <div className="space-y-8">
      <div className="mx-auto max-w-lg grid grid-cols-1 gap-y-6 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
        {/* Input Panel */}
        <div className="rounded-3xl rounded-t-3xl sm:rounded-b-none lg:rounded-tr-none lg:rounded-bl-3xl bg-card/60 dark:bg-card/40 p-8 ring-1 ring-border/50 sm:p-10 sm:mx-8 lg:mx-0 lg:my-8">
          <h3 className="text-base/7 font-semibold text-accent">
            Your 401(k) Details
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Calculate your retirement savings for {TAX_YEAR}
          </p>

          <div className="mt-8 space-y-6">
            {/* Annual Salary */}
            <div className="space-y-2">
              <Label htmlFor="salary" className="text-sm font-medium">Annual Salary</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-medium text-muted-foreground">$</span>
                <Input
                  id="salary"
                  type="number"
                  value={salary || ''}
                  onChange={(e) => setSalary(parseFloat(e.target.value) || 0)}
                  className="pl-9 h-12 text-lg font-semibold"
                  placeholder="75,000"
                />
              </div>
            </div>

            {/* Age */}
            <div className="space-y-2">
              <Label htmlFor="age" className="text-sm font-medium">Your Age</Label>
              <Input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value) || 35)}
                min={18}
                max={80}
              />
              {age >= 50 && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                  ✓ Eligible for catch-up contributions (+${age >= 60 && age <= 63 ? LIMITS_2025.superCatchUpLimit.toLocaleString() : LIMITS_2025.catchUpLimit.toLocaleString()})
                </p>
              )}
            </div>

            {/* Contribution Percent */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Your Contribution</Label>
                <span className="text-sm font-bold text-accent">{contributionPercent}%</span>
              </div>
              <Slider
                value={[contributionPercent]}
                onValueChange={([value]) => setContributionPercent(value)}
                max={Math.min(100, Math.ceil((getMaxContribution() / salary) * 100))}
                step={1}
              />
              <p className="text-xs text-muted-foreground">
                {formatCurrency(calculation.annualContribution, 0)}/year • Max: {formatCurrency(getMaxContribution(), 0)}
              </p>
            </div>

            {/* Employer Match */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Employer Match</Label>
                <span className="text-sm font-bold text-accent">{employerMatchPercent}% up to {employerMatchLimit}%</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Match Rate</Label>
                  <Slider
                    value={[employerMatchPercent]}
                    onValueChange={([value]) => setEmployerMatchPercent(value)}
                    max={100}
                    step={1}
                  />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Up to % of salary</Label>
                  <Slider
                    value={[employerMatchLimit]}
                    onValueChange={([value]) => setEmployerMatchLimit(value)}
                    max={10}
                    step={1}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Employer contributes: {formatCurrency(calculation.employerMatch, 0)}/year
              </p>
            </div>

            {/* Filing Status */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Filing Status</Label>
              <Select value={filingStatus} onValueChange={(v) => setFilingStatus(v as FilingStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married_jointly">Married Filing Jointly</SelectItem>
                  <SelectItem value="married_separately">Married Filing Separately</SelectItem>
                  <SelectItem value="head_of_household">Head of Household</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Roth vs Traditional */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Roth 401(k)</Label>
                <p className="text-xs text-muted-foreground">After-tax contributions, tax-free growth</p>
              </div>
              <Switch checked={isRoth} onCheckedChange={setIsRoth} />
            </div>

            {/* Expected Return */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Expected Annual Return</Label>
                <span className="text-sm font-bold text-accent">{expectedReturn}%</span>
              </div>
              <Slider
                value={[expectedReturn]}
                onValueChange={([value]) => setExpectedReturn(value)}
                min={1}
                max={12}
                step={0.5}
              />
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="relative rounded-3xl bg-blue-600 dark:bg-blue-700 p-8 shadow-2xl sm:p-10 flex flex-col">
          <h3 className="text-base/7 font-semibold text-white">
            {isRoth ? 'Roth' : 'Traditional'} 401(k) Summary
          </h3>

          {/* Main Stats */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-blue-700/50 rounded-2xl p-4">
              <PiggyBank className="h-5 w-5 text-blue-200 mb-2" />
              <p className="text-2xl font-bold text-white">{formatCurrency(calculation.annualContribution, 0)}</p>
              <p className="text-xs text-blue-200">Your Annual Contribution</p>
            </div>
            <div className="bg-blue-700/50 rounded-2xl p-4">
              <DollarSign className="h-5 w-5 text-emerald-300 mb-2" />
              <p className="text-2xl font-bold text-emerald-300">{formatCurrency(calculation.employerMatch, 0)}</p>
              <p className="text-xs text-blue-200">Employer Match</p>
            </div>
          </div>

          {/* Tax Savings */}
          {!isRoth && (
            <div className="mt-6 bg-emerald-500/20 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Percent className="h-5 w-5 text-emerald-300" />
                <span className="font-semibold text-white">Tax Savings</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-blue-200">Federal Tax Saved</p>
                  <p className="text-lg font-bold text-emerald-300">{formatCurrency(calculation.federalTaxSavings, 0)}</p>
                </div>
                <div>
                  <p className="text-blue-200">State Tax Saved (est.)</p>
                  <p className="text-lg font-bold text-emerald-300">{formatCurrency(calculation.stateTaxSavings, 0)}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-emerald-500/30">
                <p className="text-blue-200">Effective Cost After Tax Savings</p>
                <p className="text-xl font-bold text-white">{formatCurrency(calculation.effectiveCost, 0)}/year</p>
              </div>
            </div>
          )}

          {/* Projected Growth */}
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5 text-blue-200" />
              <span className="font-semibold text-white">Projected Balance</span>
            </div>
            <div className="space-y-2">
              {[
                { years: 5, value: calculation.projectedBalance5Years },
                { years: 10, value: calculation.projectedBalance10Years },
                { years: 20, value: calculation.projectedBalance20Years },
                { years: 30, value: calculation.projectedBalance30Years },
              ].map(({ years, value }) => (
                <div key={years} className="flex justify-between items-center">
                  <span className="text-blue-200">{years} years</span>
                  <span className="font-bold text-white">{formatCurrency(value, 0)}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-blue-300 mt-3">
              Based on {expectedReturn}% annual return, {formatCurrency(calculation.totalAnnualSavings, 0)}/year total contributions
            </p>
          </div>

          {/* Per Paycheck */}
          <div className="mt-auto pt-6 border-t border-blue-500/40">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-white">{formatCurrency(calculation.monthlyContribution, 0)}</p>
                <p className="text-xs text-blue-200">Per Month</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{formatCurrency(calculation.perPaycheckContribution, 0)}</p>
                <p className="text-xs text-blue-200">Per Paycheck (bi-weekly)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2025 Limits Info */}
      <div className="max-w-4xl mx-auto">
        <div className="rounded-3xl bg-card/60 dark:bg-card/40 p-6 sm:p-8 ring-1 ring-border/50">
          <h3 className="text-lg font-semibold mb-4">401(k) Contribution Limits for {TAX_YEAR}</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-muted/50 rounded-2xl">
              <p className="text-2xl font-bold text-foreground">${LIMITS_2025.employeeLimit.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Employee Limit (under 50)</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-2xl">
              <p className="text-2xl font-bold text-foreground">${(LIMITS_2025.employeeLimit + LIMITS_2025.catchUpLimit).toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">With Catch-up (50-59, 64+)</p>
            </div>
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl">
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">${(LIMITS_2025.employeeLimit + LIMITS_2025.superCatchUpLimit).toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Super Catch-up (60-63) NEW!</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-2xl">
              <p className="text-2xl font-bold text-foreground">${LIMITS_2025.totalLimit.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Limit (incl. employer)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
