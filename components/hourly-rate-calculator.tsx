'use client'

import { useState } from 'react'
import { calculateSalary, formatCurrency, TAX_YEAR } from '@/lib/us-tax-calculator'
import { getAllStates, type FilingStatus } from '@/lib/us-tax-config'
import { Clock, Wallet } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const ALL_STATES = getAllStates()

interface HourlyRateCalculatorProps {
  initialRate?: number
  initialHours?: number
}

export function HourlyRateCalculator({ initialRate = 20, initialHours = 40 }: HourlyRateCalculatorProps) {
  const [hourlyRate, setHourlyRate] = useState(initialRate)
  const [hoursPerWeek, setHoursPerWeek] = useState(initialHours)
  const [weeksPerYear, setWeeksPerYear] = useState(52)
  const [state, setState] = useState('TX')
  const [filingStatus, setFilingStatus] = useState<FilingStatus>('single')

  // Calculate annual salary
  const annualSalary = hourlyRate * hoursPerWeek * weeksPerYear

  // Calculate tax breakdown
  const result = calculateSalary({
    grossSalary: annualSalary,
    filingStatus,
    state,
  })

  // Format hourly rate for display
  const formatRate = (rate: number) => {
    return rate % 1 === 0 ? `$${rate}` : `$${rate.toFixed(2)}`
  }

  return (
    <div className="space-y-8">
      {/* Two Panel Calculator */}
      <div className="mx-auto max-w-lg grid grid-cols-1 items-center gap-y-6 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
        {/* Input Panel - Left */}
        <div className="rounded-3xl rounded-t-3xl sm:rounded-b-none lg:rounded-tr-none lg:rounded-bl-3xl bg-card/60 dark:bg-card/40 p-8 ring-1 ring-border/50 sm:p-10 sm:mx-8 lg:mx-0">
          <h3 className="text-base/7 font-semibold text-accent flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Enter Your Hourly Rate
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Calculate your annual salary for {TAX_YEAR}
          </p>

          <div className="mt-8 space-y-6">
            {/* Hourly Rate Input */}
            <div className="space-y-2">
              <Label htmlFor="hourlyRate">
                Hourly Rate
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-medium text-muted-foreground">$</span>
                <Input
                  id="hourlyRate"
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
                  step={0.01}
                  min={0}
                  className="pl-9 pr-16 h-12 text-lg font-semibold bg-background border-border"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">/hour</span>
              </div>
              {/* Quick select buttons */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[7.25, 15, 20, 25, 35, 50].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setHourlyRate(rate)}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                      hourlyRate === rate
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    ${rate}
                  </button>
                ))}
              </div>
            </div>

            {/* Hours per Week */}
            <div className="space-y-2">
              <Label htmlFor="hoursPerWeek">
                Hours per Week
              </Label>
              <Input
                id="hoursPerWeek"
                type="number"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(parseFloat(e.target.value) || 0)}
                step={0.5}
                min={0}
                max={80}
                className="h-12 text-lg font-semibold bg-background border-border"
              />
              {/* Quick select buttons */}
              <div className="flex flex-wrap gap-2 pt-1">
                {[20, 25, 30, 35, 40, 50].map((hours) => (
                  <button
                    key={hours}
                    type="button"
                    onClick={() => setHoursPerWeek(hours)}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                      hoursPerWeek === hours
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {hours}hrs
                  </button>
                ))}
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
                    <SelectItem value="married_jointly">Married</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Weeks per Year */}
            <div className="space-y-2">
              <Label htmlFor="weeksPerYear">
                Weeks per Year
              </Label>
              <Input
                id="weeksPerYear"
                type="number"
                value={weeksPerYear}
                onChange={(e) => setWeeksPerYear(parseInt(e.target.value) || 0)}
                min={1}
                max={52}
                className="h-12 text-lg font-semibold bg-background border-border"
              />
              <p className="text-xs text-muted-foreground">
                Use 52 for full year (typical US calculation)
              </p>
            </div>
          </div>
        </div>

        {/* Results Panel - Right */}
        <div className="rounded-3xl bg-accent/5 dark:bg-accent/10 p-8 ring-1 ring-accent/20 sm:p-10 sm:mx-8 lg:mx-0">
          <h3 className="text-base/7 font-semibold text-accent flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Your Take-Home Pay
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {formatRate(hourlyRate)} x {hoursPerWeek}hrs x {weeksPerYear} weeks
          </p>

          <div className="mt-8 space-y-6">
            {/* Annual Salary */}
            <div className="text-center py-4">
              <div className="text-4xl font-bold text-foreground">
                {formatCurrency(annualSalary, 0)}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Annual Gross Salary
              </div>
            </div>

            {/* Take Home Breakdown */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-blue-600/10 dark:bg-blue-500/10 p-4 ring-1 ring-blue-600/20 dark:ring-blue-500/20">
                <div className="text-xs text-muted-foreground mb-1">Monthly Take-Home</div>
                <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(result.monthly.takeHomePay)}
                </div>
              </div>
              <div className="rounded-xl bg-blue-600/10 dark:bg-blue-500/10 p-4 ring-1 ring-blue-600/20 dark:ring-blue-500/20">
                <div className="text-xs text-muted-foreground mb-1">Yearly Take-Home</div>
                <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {formatCurrency(result.yearly.takeHomePay, 0)}
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Federal Tax</span>
                <span className="text-destructive font-medium">-{formatCurrency(result.yearly.federalTax, 0)}/yr</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">State Tax</span>
                <span className="text-destructive font-medium">-{formatCurrency(result.yearly.stateTax, 0)}/yr</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Social Security</span>
                <span className="text-destructive font-medium">-{formatCurrency(result.yearly.socialSecurity, 0)}/yr</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Medicare</span>
                <span className="text-destructive font-medium">-{formatCurrency(result.yearly.medicare, 0)}/yr</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-foreground font-medium">Total Deductions</span>
                <span className="text-destructive font-semibold">-{formatCurrency(result.yearly.totalDeductions, 0)}/yr</span>
              </div>
            </div>

            {/* Effective Rate */}
            <div className="rounded-xl bg-accent/10 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-foreground">Effective Hourly Rate</div>
                  <div className="text-xs text-muted-foreground">After all taxes</div>
                </div>
                <div className="text-xl font-bold text-accent">
                  ${(result.yearly.takeHomePay / (hoursPerWeek * weeksPerYear)).toFixed(2)}/hr
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
