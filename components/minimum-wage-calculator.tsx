'use client'

import { useState, useMemo } from 'react'
import { calculateSalary, formatCurrency, TAX_YEAR } from '@/lib/us-tax-calculator'
import { getAllStates, STATE_TAX_CONFIGS, type FilingStatus } from '@/lib/us-tax-config'
import { Calculator, Clock, TrendingUp, Wallet } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Federal minimum wage
const FEDERAL_MINIMUM_WAGE = 7.25

// State minimum wages for 2025 (many states have higher than federal)
const STATE_MINIMUM_WAGES: Record<string, number> = {
  AL: 7.25, // Federal
  AK: 11.91,
  AZ: 14.70,
  AR: 11.00,
  CA: 16.50,
  CO: 14.81,
  CT: 16.35,
  DE: 15.00,
  DC: 17.50,
  FL: 14.00,
  GA: 7.25, // Federal
  HI: 14.00,
  ID: 7.25, // Federal
  IL: 15.00,
  IN: 7.25, // Federal
  IA: 7.25, // Federal
  KS: 7.25, // Federal
  KY: 7.25, // Federal
  LA: 7.25, // Federal
  ME: 14.65,
  MD: 15.00,
  MA: 15.00,
  MI: 10.56,
  MN: 11.13,
  MS: 7.25, // Federal
  MO: 13.75,
  MT: 10.55,
  NE: 13.50,
  NV: 12.00,
  NH: 7.25, // Federal
  NJ: 15.49,
  NM: 12.00,
  NY: 16.50, // NYC is higher
  NC: 7.25, // Federal
  ND: 7.25, // Federal
  OH: 10.70,
  OK: 7.25, // Federal
  OR: 15.95,
  PA: 7.25, // Federal
  RI: 15.00,
  SC: 7.25, // Federal
  SD: 11.50,
  TN: 7.25, // Federal
  TX: 7.25, // Federal
  UT: 7.25, // Federal
  VT: 14.01,
  VA: 12.41,
  WA: 16.66,
  WV: 8.75,
  WI: 7.25, // Federal
  WY: 7.25, // Federal
}

const ALL_STATES = getAllStates()
const COMMON_HOURS = [20, 25, 30, 35, 40, 45]

interface MinimumWageResult {
  hourlyRate: number
  hoursPerWeek: number
  weeklyGross: number
  monthlyGross: number
  annualGross: number
  annualTakeHome: number
  monthlyTakeHome: number
  weeklyTakeHome: number
  federalTax: number
  stateTax: number
  socialSecurity: number
  medicare: number
  effectiveHourlyAfterTax: number
}

function calculateMinimumWageResult(
  state: string,
  hoursPerWeek: number,
  filingStatus: FilingStatus
): MinimumWageResult {
  const hourlyRate = STATE_MINIMUM_WAGES[state] || FEDERAL_MINIMUM_WAGE
  const weeklyGross = hourlyRate * hoursPerWeek
  const annualGross = weeklyGross * 52
  const monthlyGross = annualGross / 12

  const salaryResult = calculateSalary({
    grossSalary: annualGross,
    filingStatus,
    state,
  })

  const annualTakeHome = salaryResult.yearly.takeHomePay
  const monthlyTakeHome = annualTakeHome / 12
  const weeklyTakeHome = annualTakeHome / 52
  const effectiveHourlyAfterTax = weeklyTakeHome / hoursPerWeek

  return {
    hourlyRate,
    hoursPerWeek,
    weeklyGross,
    monthlyGross,
    annualGross,
    annualTakeHome,
    monthlyTakeHome,
    weeklyTakeHome,
    federalTax: salaryResult.yearly.federalTax,
    stateTax: salaryResult.yearly.stateTax,
    socialSecurity: salaryResult.yearly.socialSecurity,
    medicare: salaryResult.yearly.medicare,
    effectiveHourlyAfterTax,
  }
}

interface MinimumWageCalculatorProps {
  initialState?: string
  initialHours?: number
}

export function MinimumWageCalculator({
  initialState = 'CA',
  initialHours = 40,
}: MinimumWageCalculatorProps) {
  const [state, setState] = useState(initialState)
  const [hoursPerWeek, setHoursPerWeek] = useState(initialHours)
  const [filingStatus, setFilingStatus] = useState<FilingStatus>('single')

  const result = useMemo(
    () => calculateMinimumWageResult(state, hoursPerWeek, filingStatus),
    [state, hoursPerWeek, filingStatus]
  )

  const stateConfig = STATE_TAX_CONFIGS[state]
  const isFederalRate = result.hourlyRate === FEDERAL_MINIMUM_WAGE

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
                <Label className="mb-2">State</Label>
                <Select value={state} onValueChange={setState}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {ALL_STATES.map((s) => (
                      <SelectItem key={s.code} value={s.code}>
                        {s.name} - ${(STATE_MINIMUM_WAGES[s.code] || FEDERAL_MINIMUM_WAGE).toFixed(2)}/hr
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="mt-2 p-3 rounded-lg bg-muted/50">
                  <p className="text-sm font-medium text-foreground">
                    {stateConfig?.name} Minimum Wage: ${result.hourlyRate.toFixed(2)}/hr
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isFederalRate
                      ? 'Uses federal minimum wage'
                      : `State minimum wage (higher than federal $${FEDERAL_MINIMUM_WAGE.toFixed(2)})`
                    }
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="hoursPerWeek" className="mb-2">
                  Hours Per Week
                </Label>
                <Input
                  type="number"
                  id="hoursPerWeek"
                  value={hoursPerWeek}
                  onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                  min={1}
                  max={80}
                  step={0.5}
                  className="h-12"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {COMMON_HOURS.map((h) => (
                    <button
                      key={h}
                      onClick={() => setHoursPerWeek(h)}
                      className={`px-3 py-1 text-xs rounded-full transition-colors ${
                        hoursPerWeek === h
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-accent/20'
                      }`}
                    >
                      {h}h
                    </button>
                  ))}
                </div>
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
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 p-6 ring-1 ring-accent/20">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-accent" />
              Gross Earnings
            </h2>

            <div className="grid gap-4">
              <div className="flex justify-between items-center py-2 border-b border-border/30">
                <span className="text-muted-foreground">Hourly rate</span>
                <span className="font-semibold text-foreground">${result.hourlyRate.toFixed(2)}/hour</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/30">
                <span className="text-muted-foreground">Weekly ({hoursPerWeek} hours)</span>
                <span className="font-semibold text-foreground">{formatCurrency(result.weeklyGross)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/30">
                <span className="text-muted-foreground">Monthly</span>
                <span className="font-semibold text-foreground">{formatCurrency(result.monthlyGross)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground font-medium">Annual salary</span>
                <span className="font-bold text-accent text-lg">{formatCurrency(result.annualGross)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Wallet className="h-5 w-5 text-emerald-500" />
              Take-Home Pay
            </h2>

            <div className="grid gap-4">
              <div className="flex justify-between items-center py-2 border-b border-border/30">
                <span className="text-muted-foreground">Federal Tax</span>
                <span className="text-foreground">
                  {result.federalTax > 0 ? `-${formatCurrency(result.federalTax)}` : '$0'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/30">
                <span className="text-muted-foreground">State Tax</span>
                <span className="text-foreground">
                  {result.stateTax > 0 ? `-${formatCurrency(result.stateTax)}` : '$0'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/30">
                <span className="text-muted-foreground">Social Security (6.2%)</span>
                <span className="text-foreground">-{formatCurrency(result.socialSecurity)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/30">
                <span className="text-muted-foreground">Medicare (1.45%)</span>
                <span className="text-foreground">-{formatCurrency(result.medicare)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/30">
                <span className="text-muted-foreground">Weekly take-home</span>
                <span className="font-semibold text-foreground">{formatCurrency(result.weeklyTakeHome)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/30">
                <span className="text-muted-foreground">Monthly take-home</span>
                <span className="font-semibold text-foreground">{formatCurrency(result.monthlyTakeHome)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground font-medium">Annual take-home</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-lg">
                  {formatCurrency(result.annualTakeHome)}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-accent/5 p-6 ring-1 ring-accent/20">
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <Clock className="h-4 w-4 text-accent" />
              Effective Hourly Rate
            </h3>
            <p className="text-sm text-muted-foreground">
              After federal tax, state tax, and FICA, your effective hourly rate is{' '}
              <strong className="text-foreground">${result.effectiveHourlyAfterTax.toFixed(2)}/hour</strong>.
              This is what you actually take home per hour worked.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
