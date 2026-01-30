'use client'

import React, { useState, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { calculateEmployerCost, formatCurrency, TAX_YEAR } from '@/lib/us-tax-calculator'
import { getAllStates } from '@/lib/us-tax-config'
import type { EmployerCostResult } from '@/lib/us-tax-calculator'

const QUICK_SALARIES = [50000, 75000, 100000, 125000, 150000]
const ALL_STATES = getAllStates()

interface EmployerCostCalculatorProps {
  initialSalary?: number
}

export function EmployerCostCalculator({ initialSalary = 75000 }: EmployerCostCalculatorProps) {
  const [grossSalary, setGrossSalary] = useState(initialSalary)
  const [retirement401kMatch, setRetirement401kMatch] = useState(4)
  const [state, setState] = useState('CA')

  const result: EmployerCostResult = calculateEmployerCost({
    grossSalary,
    employer401kMatch: retirement401kMatch,
    state,
  })

  const handleSalaryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0
    setGrossSalary(value)
  }, [])

  const overhead = grossSalary > 0 ? ((result.totalCost - grossSalary) / grossSalary * 100) : 0

  return (
    <div className="space-y-8">
      {/* Two Panel Calculator */}
      <div className="mx-auto max-w-lg grid grid-cols-1 items-center gap-y-6 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
        {/* Input Panel - Left */}
        <div className="rounded-3xl rounded-t-3xl sm:rounded-b-none lg:rounded-tr-none lg:rounded-bl-3xl bg-card/60 dark:bg-card/40 p-8 ring-1 ring-border/50 sm:p-10 sm:mx-8 lg:mx-0">
          <h3 className="text-base/7 font-semibold text-accent">
            Employee Salary
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter the gross salary for {TAX_YEAR}
          </p>

          <div className="mt-8 space-y-6">
            {/* Gross Salary */}
            <div className="space-y-2">
              <Label htmlFor="grossSalary" className="text-sm font-medium text-foreground">
                Annual Gross Salary
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-medium text-muted-foreground">$</span>
                <Input
                  id="grossSalary"
                  type="number"
                  value={grossSalary || ''}
                  onChange={handleSalaryChange}
                  className="pl-9 h-12 text-lg font-semibold bg-background border-border"
                  placeholder="75,000"
                />
              </div>
              {/* Quick Select */}
              <div className="flex flex-wrap gap-2 pt-1">
                {QUICK_SALARIES.map((salary) => (
                  <button
                    key={salary}
                    type="button"
                    onClick={() => setGrossSalary(salary)}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                      grossSalary === salary
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    ${(salary / 1000).toFixed(0)}k
                  </button>
                ))}
              </div>
            </div>

            {/* State Selection */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-foreground">State</Label>
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

            {/* 401(k) Match */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-foreground">
                  Employer 401(k) Match
                </Label>
                <span className="text-sm font-semibold text-accent">{retirement401kMatch}%</span>
              </div>
              <Slider
                value={[retirement401kMatch]}
                onValueChange={(value) => setRetirement401kMatch(value[0])}
                min={0}
                max={10}
                step={0.5}
                className="py-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>10%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel - Right (featured) */}
        <div className="rounded-3xl bg-accent/5 dark:bg-accent/10 p-8 ring-1 ring-accent/20 sm:p-10 sm:mx-8 lg:mx-0">
          <h3 className="text-base/7 font-semibold text-accent">
            Total Employer Cost
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            What it actually costs to employ someone
          </p>

          <div className="mt-8 space-y-6">
            {/* Total Cost */}
            <div className="text-center py-4">
              <div className="text-4xl font-bold text-foreground">
                {formatCurrency(result.totalCost, 0)}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                per year
              </div>
              <div className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent mt-3">
                +{overhead.toFixed(1)}% overhead
              </div>
            </div>

            {/* Breakdown */}
            <div className="space-y-3 pt-4 border-t border-border/50">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Gross Salary</span>
                <span className="text-sm font-medium text-foreground">{formatCurrency(result.grossSalary, 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Social Security (6.2%)</span>
                <span className="text-sm font-medium text-destructive">+{formatCurrency(result.employerSocialSecurity, 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Medicare (1.45%)</span>
                <span className="text-sm font-medium text-destructive">+{formatCurrency(result.employerMedicare, 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">FUTA (Federal Unemployment)</span>
                <span className="text-sm font-medium text-destructive">+{formatCurrency(result.employerFUTA, 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">SUTA (State Unemployment)</span>
                <span className="text-sm font-medium text-destructive">+{formatCurrency(result.employerSUTA, 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">401(k) Match ({retirement401kMatch}%)</span>
                <span className="text-sm font-medium text-destructive">+{formatCurrency(result.employer401kMatch, 0)}</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-border/50">
                <span className="text-sm font-semibold text-foreground">Total Cost</span>
                <span className="text-sm font-bold text-accent">{formatCurrency(result.totalCost, 0)}</span>
              </div>
            </div>

            {/* Monthly/Daily breakdown */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="rounded-xl bg-background/50 p-3 text-center">
                <div className="text-lg font-bold text-foreground">{formatCurrency(result.costPerMonth, 0)}</div>
                <div className="text-xs text-muted-foreground">per month</div>
              </div>
              <div className="rounded-xl bg-background/50 p-3 text-center">
                <div className="text-lg font-bold text-foreground">{formatCurrency(result.costPerDay, 0)}</div>
                <div className="text-xs text-muted-foreground">per working day</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
