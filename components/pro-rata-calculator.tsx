'use client'

import { useState, useMemo } from 'react'
import { calculateSalary, formatCurrency, TAX_YEAR } from '@/lib/us-tax-calculator'
import { type FilingStatus } from '@/lib/us-tax-config'
import { Percent, Wallet } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface ProRataCalculatorProps {
  initialSalary?: number
  initialFteHours?: number
  initialYourHours?: number
}

export function ProRataCalculator({
  initialSalary = 75000,
  initialFteHours = 40,
  initialYourHours = 24,
}: ProRataCalculatorProps) {
  const [fteSalary, setFteSalary] = useState(initialSalary)
  const [fteHours, setFteHours] = useState(initialFteHours)
  const [yourHours, setYourHours] = useState(initialYourHours)
  const [inputMode, setInputMode] = useState<'hours' | 'days'>('days')
  const [filingStatus, setFilingStatus] = useState<FilingStatus>('single')
  const [state, setState] = useState('TX')

  const hoursPerDay = fteHours / 5
  const yourDays = yourHours / hoursPerDay

  const proRataSalary = (fteSalary / fteHours) * yourHours
  const percentageOfFte = (yourHours / fteHours) * 100

  const result = useMemo(() => calculateSalary({
    grossSalary: proRataSalary,
    filingStatus,
    state,
  }), [proRataSalary, filingStatus, state])

  const fteResult = useMemo(() => calculateSalary({
    grossSalary: fteSalary,
    filingStatus,
    state,
  }), [fteSalary, filingStatus, state])

  // US typical PTO is 10-15 days
  const ftePTO = 15
  const proRataPTO = ftePTO * (yourHours / fteHours)

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
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-medium text-muted-foreground">$</span>
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
                {[50000, 60000, 75000, 100000, 125000].map((salary) => (
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
                    ${(salary / 1000)}k
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
                onChange={(e) => setFteHours(parseFloat(e.target.value) || 40)}
                step={0.5}
                min={1}
                max={60}
                className="h-12 text-lg font-semibold bg-background border-border"
              />
              <div className="flex flex-wrap gap-2 pt-1">
                {[35, 37.5, 40, 45].map((hours) => (
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

            {/* Filing Status & State */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Filing Status</Label>
                <Select value={filingStatus} onValueChange={(v) => setFilingStatus(v as FilingStatus)}>
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married_jointly">Married Jointly</SelectItem>
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
                    <SelectItem value="TX">Texas</SelectItem>
                    <SelectItem value="FL">Florida</SelectItem>
                    <SelectItem value="CA">California</SelectItem>
                    <SelectItem value="NY">New York</SelectItem>
                  </SelectContent>
                </Select>
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
                    {[16, 20, 24, 30, 32].map((hours) => (
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
                <span className="text-muted-foreground">Federal Tax</span>
                <span className="text-destructive font-medium">-{formatCurrency(result.yearly.federalTax, 0)}/yr</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">FICA (SS + Medicare)</span>
                <span className="text-destructive font-medium">-{formatCurrency(result.yearly.socialSecurity + result.yearly.medicare, 0)}/yr</span>
              </div>
              {result.yearly.stateTax > 0 && (
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">State Tax</span>
                  <span className="text-destructive font-medium">-{formatCurrency(result.yearly.stateTax, 0)}/yr</span>
                </div>
              )}
              <div className="flex justify-between py-2">
                <span className="text-foreground font-medium">Total Deductions</span>
                <span className="text-destructive font-semibold">-{formatCurrency(result.yearly.totalDeductions, 0)}/yr</span>
              </div>
            </div>

            {/* PTO Entitlement */}
            <div className="rounded-xl bg-accent/10 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-foreground">Pro Rata PTO</div>
                  <div className="text-xs text-muted-foreground">Based on {ftePTO} days FTE</div>
                </div>
                <div className="text-xl font-bold text-accent">
                  {proRataPTO.toFixed(1)} days
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
                    ${(result.yearly.takeHomePay / (yourHours * 52)).toFixed(2)}/hr
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
