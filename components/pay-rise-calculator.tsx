'use client'

import { useState } from 'react'
import { calculateSalary, formatCurrency, TAX_YEAR } from '@/lib/us-tax-calculator'
import { getAllStates, type FilingStatus } from '@/lib/us-tax-config'
import { TrendingUp, ArrowRight, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

type RiseType = 'percentage' | 'amount' | 'newSalary'

const ALL_STATES = getAllStates()

export function PayRiseCalculator() {
  const [currentSalary, setCurrentSalary] = useState(50000)
  const [riseType, setRiseType] = useState<RiseType>('percentage')
  const [riseValue, setRiseValue] = useState(5)
  const [retirement401k, setRetirement401k] = useState(6)
  const [state, setState] = useState('TX')
  const [filingStatus, setFilingStatus] = useState<FilingStatus>('single')

  const calculateNewSalary = (): number => {
    switch (riseType) {
      case 'percentage':
        return currentSalary * (1 + riseValue / 100)
      case 'amount':
        return currentSalary + riseValue
      case 'newSalary':
        return riseValue
      default:
        return currentSalary
    }
  }

  const newSalary = calculateNewSalary()
  const salaryIncrease = newSalary - currentSalary
  const percentageIncrease = ((newSalary - currentSalary) / currentSalary) * 100

  const currentResult = calculateSalary({
    grossSalary: currentSalary,
    filingStatus,
    state,
    retirement401k,
  })

  const newResult = calculateSalary({
    grossSalary: newSalary,
    filingStatus,
    state,
    retirement401k,
  })

  const takeHomeIncrease = newResult.yearly.takeHomePay - currentResult.yearly.takeHomePay
  const monthlyIncrease = newResult.monthly.takeHomePay - currentResult.monthly.takeHomePay
  const weeklyIncrease = newResult.weekly.takeHomePay - currentResult.weekly.takeHomePay

  const federalTaxIncrease = newResult.yearly.federalTax - currentResult.yearly.federalTax
  const stateTaxIncrease = newResult.yearly.stateTax - currentResult.yearly.stateTax
  const ficaIncrease = (newResult.yearly.socialSecurity + newResult.yearly.medicare) -
                       (currentResult.yearly.socialSecurity + currentResult.yearly.medicare)
  const retirement401kIncrease = newResult.yearly.retirement401k - currentResult.yearly.retirement401k

  const retentionRate = salaryIncrease > 0 ? (takeHomeIncrease / salaryIncrease) * 100 : 0

  return (
    <div className="space-y-8">
      <div className="mx-auto max-w-lg grid grid-cols-1 items-center gap-y-6 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
        <div className="rounded-3xl rounded-t-3xl sm:rounded-b-none lg:rounded-tr-none lg:rounded-bl-3xl bg-card/60 dark:bg-card/40 p-8 ring-1 ring-border/50 sm:p-10 sm:mx-8 lg:mx-0">
          <h3 className="text-base/7 font-semibold text-accent flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Your Pay Raise
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Calculate how much extra you&apos;ll take home
          </p>

          <div className="mt-8 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="currentSalary" className="text-sm font-medium">
                Current Annual Salary
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-medium text-muted-foreground">$</span>
                <Input
                  id="currentSalary"
                  type="number"
                  value={currentSalary || ''}
                  onChange={(e) => setCurrentSalary(parseFloat(e.target.value) || 0)}
                  className="pl-9 h-12 text-lg font-semibold"
                  placeholder="50,000"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Raise Type</Label>
                <Select value={riseType} onValueChange={(v) => setRiseType(v as RiseType)}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="amount">Fixed ($)</SelectItem>
                    <SelectItem value="newSalary">New Salary</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="riseValue" className="text-sm font-medium">
                  {riseType === 'percentage' ? 'Percentage' : riseType === 'amount' ? 'Amount' : 'New Salary'}
                </Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-medium text-muted-foreground">
                    {riseType === 'percentage' ? '%' : '$'}
                  </span>
                  <Input
                    id="riseValue"
                    type="number"
                    value={riseValue || ''}
                    onChange={(e) => setRiseValue(parseFloat(e.target.value) || 0)}
                    className="pl-9 h-12 text-lg font-semibold"
                    step={riseType === 'percentage' ? '0.5' : '1000'}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Filing Status</Label>
                <Select value={filingStatus} onValueChange={(v) => setFilingStatus(v as FilingStatus)}>
                  <SelectTrigger className="h-12">
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

              <div className="space-y-2">
                <Label className="text-sm font-medium">State</Label>
                <Select value={state} onValueChange={setState}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {ALL_STATES.map((s) => (
                      <SelectItem key={s.code} value={s.code}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">401(k) Contribution</Label>
              <Select value={retirement401k.toString()} onValueChange={(v) => setRetirement401k(parseInt(v))}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[0, 3, 5, 6, 8, 10, 12, 15, 20].map((p) => (
                    <SelectItem key={p} value={p.toString()}>{p}%</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-accent/5 dark:bg-accent/10 p-8 ring-1 ring-accent/20 sm:p-10 sm:mx-8 lg:mx-0">
          <h3 className="text-base/7 font-semibold text-accent flex items-center gap-2">
            <ArrowUpRight className="h-5 w-5" />
            Your Increase
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Extra take-home after tax ({TAX_YEAR})
          </p>

          <div className="mt-8">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold tracking-tight text-accent">
                +{formatCurrency(takeHomeIncrease)}
              </span>
              <span className="text-lg text-muted-foreground">/year</span>
            </div>

            <div className="mt-2 flex items-center gap-4 text-sm">
              <span className="text-muted-foreground">
                +{formatCurrency(monthlyIncrease)}/month
              </span>
              <span className="text-muted-foreground">
                +{formatCurrency(weeklyIncrease)}/week
              </span>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-border/50">
              <span className="text-sm text-muted-foreground">Gross Salary Increase</span>
              <span className="font-semibold text-foreground">+{formatCurrency(salaryIncrease)}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-border/50">
              <span className="text-sm text-muted-foreground">Percentage Raise</span>
              <span className="font-semibold text-foreground">+{percentageIncrease.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-border/50">
              <span className="text-sm text-muted-foreground">New Gross Salary</span>
              <span className="font-semibold text-foreground">{formatCurrency(newSalary)}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-border/50">
              <span className="text-sm text-muted-foreground">You Keep</span>
              <span className="font-semibold text-accent">{retentionRate.toFixed(0)}% of raise</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <ArrowRight className="h-5 w-5 text-accent" />
            Before vs After Comparison
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-muted-foreground uppercase text-xs tracking-wider">Current Salary</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Gross</span>
                  <span className="font-medium">{formatCurrency(currentSalary)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Federal Tax</span>
                  <span className="font-medium text-red-500">-{formatCurrency(currentResult.yearly.federalTax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">State Tax</span>
                  <span className="font-medium text-red-500">-{formatCurrency(currentResult.yearly.stateTax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Social Security</span>
                  <span className="font-medium text-red-500">-{formatCurrency(currentResult.yearly.socialSecurity)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Medicare</span>
                  <span className="font-medium text-red-500">-{formatCurrency(currentResult.yearly.medicare)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">401(k)</span>
                  <span className="font-medium text-orange-500">-{formatCurrency(currentResult.yearly.retirement401k)}</span>
                </div>
                <div className="flex justify-between pt-3 border-t border-border">
                  <span className="font-medium">Take Home</span>
                  <span className="font-bold text-lg">{formatCurrency(currentResult.yearly.takeHomePay)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-accent uppercase text-xs tracking-wider">After Pay Raise</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Gross</span>
                  <span className="font-medium">{formatCurrency(newSalary)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Federal Tax</span>
                  <div className="text-right">
                    <span className="font-medium text-red-500">-{formatCurrency(newResult.yearly.federalTax)}</span>
                    {federalTaxIncrease !== 0 && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({federalTaxIncrease > 0 ? '+' : ''}{formatCurrency(federalTaxIncrease)})
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">State Tax</span>
                  <div className="text-right">
                    <span className="font-medium text-red-500">-{formatCurrency(newResult.yearly.stateTax)}</span>
                    {stateTaxIncrease !== 0 && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({stateTaxIncrease > 0 ? '+' : ''}{formatCurrency(stateTaxIncrease)})
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">FICA (SS + Medicare)</span>
                  <div className="text-right">
                    <span className="font-medium text-red-500">-{formatCurrency(newResult.yearly.socialSecurity + newResult.yearly.medicare)}</span>
                    {ficaIncrease !== 0 && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({ficaIncrease > 0 ? '+' : ''}{formatCurrency(ficaIncrease)})
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">401(k)</span>
                  <div className="text-right">
                    <span className="font-medium text-orange-500">-{formatCurrency(newResult.yearly.retirement401k)}</span>
                    {retirement401kIncrease !== 0 && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({retirement401kIncrease > 0 ? '+' : ''}{formatCurrency(retirement401kIncrease)})
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between pt-3 border-t border-accent/30">
                  <span className="font-medium">Take Home</span>
                  <div className="text-right">
                    <span className="font-bold text-lg text-accent">{formatCurrency(newResult.yearly.takeHomePay)}</span>
                    <span className="ml-2 text-sm text-green-600 dark:text-green-400">
                      (+{formatCurrency(takeHomeIncrease)})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {salaryIncrease > 0 && retentionRate < 60 && (
        <div className="max-w-4xl mx-auto">
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
            <div className="flex gap-3">
              <ArrowDownRight className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800 dark:text-amber-200">High Marginal Rate</h4>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                  You&apos;re only keeping {retentionRate.toFixed(0)}% of your raise due to your marginal tax rate.
                  Consider increasing your 401(k) contribution to reduce taxable income and boost
                  retirement savings while lowering your current tax bill.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
