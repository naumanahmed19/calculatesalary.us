'use client'

import { useState } from 'react'
import { calculateSalary, formatCurrency, TAX_YEAR } from '@/lib/us-tax-calculator'
import { getAllStates, type FilingStatus } from '@/lib/us-tax-config'
import { ArrowRightLeft, Plus, X, TrendingUp, TrendingDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const ALL_STATES = getAllStates()

export interface ComparisonSalary {
  id: string
  label: string
  salary: number
  filingStatus: FilingStatus
  state: string
}

const PRESET_COMPARISONS = [
  { label: 'Junior vs Mid-Level', salaries: [40000, 55000] },
  { label: 'Mid-Level vs Senior', salaries: [55000, 80000] },
  { label: 'Senior vs Lead', salaries: [80000, 120000] },
  { label: 'Before vs After Raise', salaries: [60000, 70000] },
]

interface SalaryComparisonCalculatorProps {
  initialSalaries?: ComparisonSalary[]
}

export function SalaryComparisonCalculator({ initialSalaries }: SalaryComparisonCalculatorProps) {
  const [salaries, setSalaries] = useState<ComparisonSalary[]>(initialSalaries || [
    { id: '1', label: 'Salary A', salary: 50000, filingStatus: 'single', state: 'TX' },
    { id: '2', label: 'Salary B', salary: 75000, filingStatus: 'single', state: 'TX' },
  ])

  const addSalary = () => {
    if (salaries.length >= 4) return
    const newId = Date.now().toString()
    const labels = ['Salary A', 'Salary B', 'Salary C', 'Salary D']
    setSalaries([
      ...salaries,
      {
        id: newId,
        label: labels[salaries.length],
        salary: 60000,
        filingStatus: 'single',
        state: 'TX',
      },
    ])
  }

  const removeSalary = (id: string) => {
    if (salaries.length <= 2) return
    setSalaries(salaries.filter((s) => s.id !== id))
  }

  const updateSalary = (id: string, field: keyof ComparisonSalary, value: string | number) => {
    setSalaries(
      salaries.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    )
  }

  const applyPreset = (preset: { salaries: number[] }) => {
    const labels = ['Salary A', 'Salary B', 'Salary C', 'Salary D']
    setSalaries(
      preset.salaries.map((salary, index) => ({
        id: (index + 1).toString(),
        label: labels[index],
        salary,
        filingStatus: 'single' as FilingStatus,
        state: 'TX',
      }))
    )
  }

  const results = salaries.map((s) =>
    calculateSalary({
      grossSalary: s.salary,
      filingStatus: s.filingStatus,
      state: s.state,
    })
  )

  const maxTakeHome = Math.max(...results.map((r) => r.yearly.takeHomePay))
  const minTakeHome = Math.min(...results.map((r) => r.yearly.takeHomePay))

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-card/60 dark:bg-card/40 p-8 ring-1 ring-border/50">
        <h3 className="text-base/7 font-semibold text-accent flex items-center gap-2">
          <ArrowRightLeft className="h-5 w-5" />
          Compare Salaries
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter multiple salaries to compare take-home pay for {TAX_YEAR}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {PRESET_COMPARISONS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => applyPreset(preset)}
              className="px-3 py-1.5 text-xs font-medium rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {salaries.map((s, index) => (
            <div
              key={s.id}
              className="relative rounded-2xl bg-background p-6 ring-1 ring-border/50"
            >
              {salaries.length > 2 && (
                <button
                  onClick={() => removeSalary(s.id)}
                  className="absolute right-3 top-3 p-1 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>
                    Label
                  </Label>
                  <Input
                    type="text"
                    value={s.label}
                    onChange={(e) => updateSalary(s.id, 'label', e.target.value)}
                    className="h-10 bg-muted border-0"
                    placeholder="e.g., Current Job"
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    Annual Salary
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      $
                    </span>
                    <Input
                      type="number"
                      value={s.salary || ''}
                      onChange={(e) =>
                        updateSalary(s.id, 'salary', parseFloat(e.target.value) || 0)
                      }
                      className="pl-8 h-12 text-lg font-semibold bg-muted border-0"
                      placeholder="50,000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>
                    Filing Status
                  </Label>
                  <Select
                    value={s.filingStatus}
                    onValueChange={(value) =>
                      updateSalary(s.id, 'filingStatus', value)
                    }
                  >
                    <SelectTrigger className="w-full h-10 bg-muted border-0">
                      <SelectValue placeholder="Select status" />
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
                  <Label>
                    State
                  </Label>
                  <Select
                    value={s.state}
                    onValueChange={(value) =>
                      updateSalary(s.id, 'state', value)
                    }
                  >
                    <SelectTrigger className="w-full h-10 bg-muted border-0">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {ALL_STATES.map((state) => (
                        <SelectItem key={state.code} value={state.code}>{state.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}
        </div>

        {salaries.length < 4 && (
          <button
            onClick={addSalary}
            className="mt-6 flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-colors text-sm font-medium"
          >
            <Plus className="h-4 w-4" />
            Add Salary to Compare
          </button>
        )}
      </div>

      <div className="rounded-3xl bg-accent/5 dark:bg-accent/10 p-8 ring-1 ring-accent/20">
        <h3 className="text-lg font-semibold text-accent mb-6">Comparison Results</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left py-3 pr-4 font-medium text-foreground">Metric</th>
                {salaries.map((s) => (
                  <th key={s.id} className="text-right py-3 px-4 font-medium text-foreground">
                    {s.label}
                  </th>
                ))}
                <th className="text-right py-3 pl-4 font-medium text-foreground">Difference</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="py-3 pr-4 text-muted-foreground">Gross Salary</td>
                {salaries.map((s, i) => (
                  <td key={s.id} className="text-right py-3 px-4 font-semibold text-foreground">
                    {formatCurrency(results[i].yearly.grossIncome, 0)}
                  </td>
                ))}
                <td className="text-right py-3 pl-4 font-semibold text-foreground">
                  {formatCurrency(
                    Math.max(...salaries.map((s) => s.salary)) -
                      Math.min(...salaries.map((s) => s.salary)),
                    0
                  )}
                </td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 pr-4 text-muted-foreground">Federal Tax</td>
                {salaries.map((s, i) => (
                  <td key={s.id} className="text-right py-3 px-4 text-foreground">
                    {formatCurrency(results[i].yearly.federalTax, 0)}
                  </td>
                ))}
                <td className="text-right py-3 pl-4 text-foreground">
                  {formatCurrency(
                    Math.max(...results.map((r) => r.yearly.federalTax)) -
                      Math.min(...results.map((r) => r.yearly.federalTax)),
                    0
                  )}
                </td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 pr-4 text-muted-foreground">State Tax</td>
                {salaries.map((s, i) => (
                  <td key={s.id} className="text-right py-3 px-4 text-foreground">
                    {formatCurrency(results[i].yearly.stateTax, 0)}
                  </td>
                ))}
                <td className="text-right py-3 pl-4 text-foreground">
                  {formatCurrency(
                    Math.max(...results.map((r) => r.yearly.stateTax)) -
                      Math.min(...results.map((r) => r.yearly.stateTax)),
                    0
                  )}
                </td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 pr-4 text-muted-foreground">FICA (SS + Medicare)</td>
                {salaries.map((s, i) => (
                  <td key={s.id} className="text-right py-3 px-4 text-foreground">
                    {formatCurrency(results[i].yearly.socialSecurity + results[i].yearly.medicare, 0)}
                  </td>
                ))}
                <td className="text-right py-3 pl-4 text-foreground">
                  {formatCurrency(
                    Math.max(...results.map((r) => r.yearly.socialSecurity + r.yearly.medicare)) -
                      Math.min(...results.map((r) => r.yearly.socialSecurity + r.yearly.medicare)),
                    0
                  )}
                </td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 pr-4 font-semibold text-foreground">Take-Home Pay (Yearly)</td>
                {salaries.map((s, i) => (
                  <td key={s.id} className="text-right py-3 px-4">
                    <div className="flex items-center justify-end gap-2">
                      {results[i].yearly.takeHomePay === maxTakeHome && (
                        <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      )}
                      {results[i].yearly.takeHomePay === minTakeHome &&
                        salaries.length > 1 && (
                          <TrendingDown className="h-4 w-4 text-destructive" />
                        )}
                      <span className="font-bold text-lg text-accent">
                        {formatCurrency(results[i].yearly.takeHomePay, 0)}
                      </span>
                    </div>
                  </td>
                ))}
                <td className="text-right py-3 pl-4 font-bold text-lg text-accent">
                  {formatCurrency(maxTakeHome - minTakeHome, 0)}
                </td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 pr-4 text-muted-foreground">Take-Home (Monthly)</td>
                {salaries.map((s, i) => (
                  <td key={s.id} className="text-right py-3 px-4 font-semibold text-foreground">
                    {formatCurrency(results[i].monthly.takeHomePay, 0)}
                  </td>
                ))}
                <td className="text-right py-3 pl-4 font-semibold text-foreground">
                  {formatCurrency((maxTakeHome - minTakeHome) / 12, 0)}
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 text-muted-foreground">Effective Tax Rate</td>
                {salaries.map((s, i) => (
                  <td key={s.id} className="text-right py-3 px-4 text-foreground">
                    {results[i].yearly.effectiveTaxRate.toFixed(1)}%
                  </td>
                ))}
                <td className="text-right py-3 pl-4 text-foreground">
                  {(
                    Math.max(...results.map((r) => r.yearly.effectiveTaxRate)) -
                    Math.min(...results.map((r) => r.yearly.effectiveTaxRate))
                  ).toFixed(1)}
                  %
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {salaries.map((s, i) => {
          const result = results[i]
          const percentOfGross = (result.yearly.takeHomePay / result.yearly.grossIncome) * 100

          return (
            <div
              key={s.id}
              className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50"
            >
              <h4 className="font-semibold text-foreground mb-4">{s.label}</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Gross</span>
                  <span className="font-semibold">
                    {formatCurrency(result.yearly.grossIncome, 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Take-Home</span>
                  <span className="font-bold text-accent">
                    {formatCurrency(result.yearly.takeHomePay, 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">You Keep</span>
                  <span className="font-medium">{percentOfGross.toFixed(1)}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full"
                    style={{ width: `${percentOfGross}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
