'use client'

import { useState } from 'react'
import { calculateSalary, formatCurrency, TAX_YEAR } from '@/lib/us-tax-calculator'
import { Percent, Wallet } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'

interface ProRataCalculatorProps {
  initialSalary?: number
  initialFteHours?: number
  initialYourHours?: number
}

export function ProRataCalculator({
  initialSalary = 30000,
  initialFteHours = 37.5,
  initialYourHours = 22.5,
}: ProRataCalculatorProps) {
  const [fteSalary, setFteSalary] = useState(initialSalary)
  const [fteHours, setFteHours] = useState(initialFteHours)
  const [yourHours, setYourHours] = useState(initialYourHours)
  const [inputMode, setInputMode] = useState<'hours' | 'days'>('days')

  const hoursPerDay = fteHours / 5
  const yourDays = yourHours / hoursPerDay

  const proRataSalary = (fteSalary / fteHours) * yourHours
  const percentageOfFte = (yourHours / fteHours) * 100

  const result = calculateSalary({
    baseSalary: proRataSalary,
    bonus: 0,
    cashAllowances: 0,
    pensionContribution: 0,
    studentLoan: 'none',
  })

  const fteResult = calculateSalary({
    baseSalary: fteSalary,
    bonus: 0,
    cashAllowances: 0,
    pensionContribution: 0,
    studentLoan: 'none',
  })

  const fteHoliday = 25
  const proRataHoliday = fteHoliday * (yourHours / fteHours)

  const handleDaysChange = (days: number) => {
    const hours = days * hoursPerDay
    setYourHours(hours)
  }

  return (
    <div className="space-y-8">
      {/* Two Panel Calculator */}
      <div className="mx-auto max-w-lg grid grid-cols-1 items-center gap-y-6 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
        {/* Input Panel - Left */}
        <div className="rounded-3xl rounded-t-3xl sm:rounded-b-none lg:rounded-tr-none lg:rounded-bl-3xl bg-card/60 dark:bg-card/40 p-8 ring-1 ring-border/50 sm:p-10 sm:mx-8 lg:mx-0">
          <h3 className="text-base/7 font-semibold text-accent flex items-center gap-2">
            <Percent className="h-5 w-5" />
            Pro Rata Calculator
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Calculate part-time salary for {TAX_YEAR}
          </p>

          <div className="mt-8 space-y-6">
            {/* FTE Salary */}
            <div className="space-y-2">
              <Label htmlFor="fteSalary">
                Full-Time Equivalent (FTE) Salary
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-medium text-muted-foreground">£</span>
                <Input
                  id="fteSalary"
                  type="number"
                  value={fteSalary}
                  onChange={(e) => setFteSalary(parseFloat(e.target.value) || 0)}
                  step={1000}
                  min={0}
                  className="pl-9 pr-16 h-12 text-lg font-semibold bg-background border-border"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">/year</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {[26000, 28000, 30000, 35000, 40000].map((salary) => (
                  <button
                    key={salary}
                    type="button"
                    onClick={() => setFteSalary(salary)}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                      fteSalary === salary
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    £{(salary / 1000)}k
                  </button>
                ))}
              </div>
            </div>

            {/* FTE Hours */}
            <div className="space-y-2">
              <Label htmlFor="fteHours">
                Full-Time Hours Per Week
              </Label>
              <Input
                id="fteHours"
                type="number"
                value={fteHours}
                onChange={(e) => setFteHours(parseFloat(e.target.value) || 37.5)}
                step={0.5}
                min={1}
                max={60}
                className="h-12 text-lg font-semibold bg-background border-border"
              />
              <div className="flex flex-wrap gap-2 pt-1">
                {[35, 37.5, 40].map((hours) => (
                  <button
                    key={hours}
                    type="button"
                    onClick={() => setFteHours(hours)}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                      fteHours === hours
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {hours}hrs
                  </button>
                ))}
              </div>
            </div>

            {/* Input Mode Toggle */}
            <div className="space-y-2">
              <Label>
                Your Working Pattern
              </Label>
              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setInputMode('days')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    inputMode === 'days'
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  Days per Week
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode('hours')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                    inputMode === 'hours'
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  Hours per Week
                </button>
              </div>

              {inputMode === 'days' ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <Slider
                      min={1}
                      max={5}
                      step={0.5}
                      value={[yourDays]}
                      onValueChange={(value) => handleDaysChange(value[0])}
                      className="flex-1"
                    />
                    <span className="text-xl font-bold text-foreground w-20 text-center">
                      {yourDays.toFixed(1)} days
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground px-1">
                    <span>1 day</span>
                    <span>2 days</span>
                    <span>3 days</span>
                    <span>4 days</span>
                    <span>5 days</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Input
                    type="number"
                    value={yourHours}
                    onChange={(e) => setYourHours(parseFloat(e.target.value) || 0)}
                    step={0.5}
                    min={0}
                    max={fteHours}
                    className="h-12 text-lg font-semibold bg-background border-border"
                  />
                  <div className="flex flex-wrap gap-2 pt-1">
                    {[15, 20, 22.5, 25, 30].map((hours) => (
                      <button
                        key={hours}
                        type="button"
                        onClick={() => setYourHours(hours)}
                        className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                          yourHours === hours
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }`}
                      >
                        {hours}hrs
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Panel - Right */}
        <div className="rounded-3xl bg-accent/5 dark:bg-accent/10 p-8 ring-1 ring-accent/20 sm:p-10 sm:mx-8 lg:mx-0">
          <h3 className="text-base/7 font-semibold text-accent flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Your Pro Rata Salary
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {yourHours} hours ({yourDays.toFixed(1)} days) of {fteHours} hours
          </p>

          <div className="mt-8 space-y-6">
            {/* Pro Rata Percentage */}
            <div className="text-center py-4">
              <div className="text-4xl font-bold text-foreground">
                {formatCurrency(proRataSalary, 0)}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {percentageOfFte.toFixed(0)}% of {formatCurrency(fteSalary, 0)}
              </div>
            </div>

            {/* Take Home */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-emerald-600/10 dark:bg-emerald-500/10 p-4 ring-1 ring-emerald-600/20 dark:ring-emerald-500/20">
                <div className="text-xs text-muted-foreground mb-1">Monthly Take-Home</div>
                <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(result.monthly.takeHomePay)}
                </div>
              </div>
              <div className="rounded-xl bg-emerald-600/10 dark:bg-emerald-500/10 p-4 ring-1 ring-emerald-600/20 dark:ring-emerald-500/20">
                <div className="text-xs text-muted-foreground mb-1">Yearly Take-Home</div>
                <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(result.yearly.takeHomePay, 0)}
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Income Tax</span>
                <span className="text-destructive font-medium">-{formatCurrency(result.yearly.incomeTax, 0)}/yr</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">National Insurance</span>
                <span className="text-destructive font-medium">-{formatCurrency(result.yearly.nationalInsurance, 0)}/yr</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-foreground font-medium">Total Deductions</span>
                <span className="text-destructive font-semibold">-{formatCurrency(result.yearly.totalDeductions, 0)}/yr</span>
              </div>
            </div>

            {/* Holiday Entitlement */}
            <div className="rounded-xl bg-accent/10 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-foreground">Pro Rata Holiday</div>
                  <div className="text-xs text-muted-foreground">Based on {fteHoliday} days FTE</div>
                </div>
                <div className="text-xl font-bold text-accent">
                  {proRataHoliday.toFixed(1)} days
                </div>
              </div>
            </div>

            {/* Comparison with FTE */}
            <div className="space-y-3 text-sm">
              <div className="text-sm font-medium text-foreground">Comparison with Full-Time</div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Your Take-Home</div>
                  <div className="font-semibold text-foreground">{formatCurrency(result.monthly.takeHomePay)}/mo</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">FTE Take-Home</div>
                  <div className="font-semibold text-muted-foreground">{formatCurrency(fteResult.monthly.takeHomePay)}/mo</div>
                </div>
              </div>
              <div className="pt-3 border-t border-border/50">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Effective Hourly Rate</span>
                  <span className="font-semibold text-accent">
                    £{(result.yearly.takeHomePay / (yourHours * 52)).toFixed(2)}/hr
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
