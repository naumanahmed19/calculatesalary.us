'use client'

import { useState, useMemo } from 'react'
import { calculateSalary, formatCurrency, TAX_YEAR } from '@/lib/us-tax-calculator'
import { getAllStates, type FilingStatus } from '@/lib/us-tax-config'
import { ArrowUpDown, Wallet, Target } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const ALL_STATES = getAllStates()

// Binary search to find gross salary that produces target net
function findGrossForNet(
  targetNetYearly: number,
  state: string,
  filingStatus: FilingStatus,
  maxIterations = 100
): number {
  let low = targetNetYearly
  let high = targetNetYearly * 2 // Initial estimate - gross is at most 2x net

  // Expand high if needed
  while (calculateSalary({
    grossSalary: high,
    filingStatus,
    state,
  }).yearly.takeHomePay < targetNetYearly && high < 1000000) {
    high *= 1.5
  }

  for (let i = 0; i < maxIterations; i++) {
    const mid = (low + high) / 2
    const result = calculateSalary({
      grossSalary: mid,
      filingStatus,
      state,
    })

    const diff = result.yearly.takeHomePay - targetNetYearly

    if (Math.abs(diff) < 1) {
      return Math.round(mid)
    }

    if (diff > 0) {
      high = mid
    } else {
      low = mid
    }
  }

  return Math.round((low + high) / 2)
}

export function NetToGrossCalculator() {
  const [targetNetMonthly, setTargetNetMonthly] = useState(4000)
  const [inputMode, setInputMode] = useState<'monthly' | 'yearly'>('monthly')
  const [state, setState] = useState('TX')
  const [filingStatus, setFilingStatus] = useState<FilingStatus>('single')

  const targetNetYearly = inputMode === 'monthly' ? targetNetMonthly * 12 : targetNetMonthly

  const requiredGross = useMemo(() => {
    return findGrossForNet(targetNetYearly, state, filingStatus)
  }, [targetNetYearly, state, filingStatus])

  const result = calculateSalary({
    grossSalary: requiredGross,
    filingStatus,
    state,
  })

  return (
    <div className="space-y-8">
      <div className="mx-auto max-w-lg grid grid-cols-1 items-center gap-y-6 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
        {/* Input Panel */}
        <div className="rounded-3xl rounded-t-3xl sm:rounded-b-none lg:rounded-tr-none lg:rounded-bl-3xl bg-card/60 dark:bg-card/40 p-8 ring-1 ring-border/50 sm:p-10 sm:mx-8 lg:mx-0">
          <h3 className="text-base/7 font-semibold text-accent flex items-center gap-2">
            <Target className="h-5 w-5" />
            Target Take-Home Pay
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your desired net income for {TAX_YEAR}
          </p>

          <div className="mt-8 space-y-6">
            {/* Toggle Monthly/Yearly */}
            <div className="flex rounded-lg bg-muted p-1">
              <button
                type="button"
                onClick={() => setInputMode('monthly')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                  inputMode === 'monthly'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => {
                  setInputMode('yearly')
                  setTargetNetMonthly(targetNetMonthly * 12)
                }}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                  inputMode === 'yearly'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Yearly
              </button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetNet">
                Desired {inputMode === 'monthly' ? 'Monthly' : 'Yearly'} Net Pay
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-medium text-muted-foreground">$</span>
                <Input
                  id="targetNet"
                  type="number"
                  value={targetNetMonthly}
                  onChange={(e) => setTargetNetMonthly(parseFloat(e.target.value) || 0)}
                  step={inputMode === 'monthly' ? 100 : 1000}
                  min={0}
                  className="pl-9 h-12 text-lg font-semibold bg-background border-border"
                />
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {inputMode === 'monthly' ? (
                  [3000, 4000, 5000, 6000, 7500, 10000].map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setTargetNetMonthly(amount)}
                      className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                        targetNetMonthly === amount
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      ${amount.toLocaleString()}
                    </button>
                  ))
                ) : (
                  [40000, 50000, 60000, 75000, 100000, 120000].map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setTargetNetMonthly(amount)}
                      className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                        targetNetMonthly === amount
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      ${(amount / 1000)}k
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* State and Filing Status */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>State</Label>
                <Select value={state} onValueChange={setState}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {ALL_STATES.map((s) => (
                      <SelectItem key={s.code} value={s.code}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Filing Status</Label>
                <Select value={filingStatus} onValueChange={(v) => setFilingStatus(v as FilingStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married_jointly">Married Jointly</SelectItem>
                    <SelectItem value="married_separately">Married Separately</SelectItem>
                    <SelectItem value="head_of_household">Head of Household</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Conversion note */}
            <div className="rounded-xl bg-accent/10 p-4">
              <div className="text-sm text-foreground">
                <strong>Your Target:</strong>
                <p className="mt-1">
                  {formatCurrency(targetNetYearly / 12)}/month = {formatCurrency(targetNetYearly, 0)}/year
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="rounded-3xl bg-accent/5 p-8 ring-1 ring-accent/20 sm:p-10 sm:mx-8 lg:mx-0">
          <h3 className="text-base/7 font-semibold text-accent flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Required Gross Salary
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            To achieve {formatCurrency(targetNetYearly / 12)}/month take-home
          </p>

          <div className="mt-8 space-y-6">
            {/* Main Result */}
            <div className="text-center py-6 rounded-2xl bg-card/60 dark:bg-card/40 ring-1 ring-border/50">
              <div className="text-sm text-muted-foreground mb-2">You need to earn</div>
              <div className="text-4xl font-bold text-foreground">
                {formatCurrency(requiredGross, 0)}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                gross per year
              </div>
              <div className="mt-3 flex items-center justify-center gap-2 text-muted-foreground">
                <ArrowUpDown className="h-4 w-4" />
                <span className="text-sm">{formatCurrency(requiredGross / 12)}/month gross</span>
              </div>
            </div>

            {/* Verification */}
            <div className="space-y-2 text-sm">
              <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Verification</div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Gross Salary</span>
                <span className="font-medium text-foreground">{formatCurrency(requiredGross, 0)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Federal Tax</span>
                <span className="text-destructive">-{formatCurrency(result.yearly.federalTax, 0)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">State Tax</span>
                <span className="text-destructive">-{formatCurrency(result.yearly.stateTax, 0)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Social Security</span>
                <span className="text-destructive">-{formatCurrency(result.yearly.socialSecurity, 0)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Medicare</span>
                <span className="text-destructive">-{formatCurrency(result.yearly.medicare, 0)}</span>
              </div>
              <div className="flex justify-between py-2 font-semibold">
                <span className="text-foreground">Take-Home Pay</span>
                <span className="text-blue-600">{formatCurrency(result.yearly.takeHomePay, 0)}</span>
              </div>
            </div>

            {/* Monthly breakdown */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-blue-600/10 dark:bg-blue-500/10 p-4 ring-1 ring-blue-600/20 dark:ring-blue-500/20 text-center">
                <div className="text-xs text-muted-foreground mb-1">Monthly Net</div>
                <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(result.monthly.takeHomePay)}
                </div>
              </div>
              <div className="rounded-xl bg-muted/50 p-4 ring-1 ring-border/50 text-center">
                <div className="text-xs text-muted-foreground mb-1">Effective Rate</div>
                <div className="text-xl font-bold text-foreground">
                  {result.yearly.effectiveTaxRate.toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Accuracy note */}
            <div className="text-xs text-center text-muted-foreground">
              Accuracy: Net pay within $1 of target
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
