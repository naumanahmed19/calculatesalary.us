'use client'

import { useState } from 'react'
import { calculateSalary, formatCurrency, TAX_YEAR } from '@/lib/us-tax-calculator'
import { currentTaxConfig, getAllStates, type FilingStatus } from '@/lib/us-tax-config'
import { Users, Briefcase, Plus, Trash2, Wallet, AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Job {
  id: string
  name: string
  salary: number
}

const ALL_STATES = getAllStates()

export function MultipleJobsCalculator() {
  const [jobs, setJobs] = useState<Job[]>([
    { id: '1', name: 'Main Job', salary: 50000 },
    { id: '2', name: 'Second Job', salary: 20000 },
  ])
  const [state, setState] = useState('TX')
  const [filingStatus, setFilingStatus] = useState<FilingStatus>('single')

  // Add a new job
  const addJob = () => {
    const newId = (Math.max(...jobs.map(j => parseInt(j.id))) + 1).toString()
    setJobs([...jobs, {
      id: newId,
      name: `Job ${jobs.length + 1}`,
      salary: 15000,
    }])
  }

  // Remove a job
  const removeJob = (id: string) => {
    if (jobs.length > 1) {
      setJobs(jobs.filter(j => j.id !== id))
    }
  }

  // Update job salary
  const updateSalary = (id: string, salary: number) => {
    setJobs(jobs.map(j => j.id === id ? { ...j, salary } : j))
  }

  // Update job name
  const updateName = (id: string, name: string) => {
    setJobs(jobs.map(j => j.id === id ? { ...j, name } : j))
  }

  // Calculate totals
  const totalIncome = jobs.reduce((sum, job) => sum + job.salary, 0)

  // Calculate tax for combined income (what you will actually owe)
  const combinedResult = calculateSalary({
    grossSalary: totalIncome,
    filingStatus,
    state,
  })

  // Calculate FICA per job (both employers withhold FICA)
  const calculateFICAPerJob = (salary: number) => {
    const ssWageBase = currentTaxConfig.socialSecurity.wageBase
    const ssTax = Math.min(salary, ssWageBase) * currentTaxConfig.socialSecurity.rate
    const medicareTax = salary * currentTaxConfig.medicare.rate

    return { ssTax, medicareTax, total: ssTax + medicareTax }
  }

  // Calculate individual job results (withholding estimate)
  const jobResults = jobs.map(job => {
    const fica = calculateFICAPerJob(job.salary)

    // Each employer withholds as if this is your only income
    const singleJobResult = calculateSalary({
      grossSalary: job.salary,
      filingStatus,
      state,
    })

    return {
      ...job,
      federalTax: singleJobResult.yearly.federalTax,
      stateTax: singleJobResult.yearly.stateTax,
      fica: fica.total,
      totalWithheld: singleJobResult.yearly.federalTax + singleJobResult.yearly.stateTax + fica.total,
      takeHome: job.salary - singleJobResult.yearly.federalTax - singleJobResult.yearly.stateTax - fica.total,
    }
  })

  // Total withholding from all jobs (sum of individual job withholding)
  const totalWithheld = jobResults.reduce((sum, j) => sum + j.totalWithheld, 0)
  const totalFederalWithheld = jobResults.reduce((sum, j) => sum + j.federalTax, 0)
  const totalStateWithheld = jobResults.reduce((sum, j) => sum + j.stateTax, 0)
  const totalFICAWithheld = jobResults.reduce((sum, j) => sum + j.fica, 0)

  // Actual tax owed on combined income
  const actualFederalTax = combinedResult.yearly.federalTax
  const actualStateTax = combinedResult.yearly.stateTax
  const actualFICA = combinedResult.yearly.socialSecurity + combinedResult.yearly.medicare

  // Potential underpayment
  const federalDifference = actualFederalTax - totalFederalWithheld
  const stateDifference = actualStateTax - totalStateWithheld

  // Find highest paying job
  const highestPayingJob = jobs.reduce((max, job) => job.salary > max.salary ? job : max)

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Jobs Input Panel */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-accent" />
              Your Jobs
            </h2>
            {jobs.length < 4 && (
              <button
                onClick={addJob}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-sm font-medium hover:bg-accent/20 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Job
              </button>
            )}
          </div>

          {/* State and Filing Status */}
          <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-5 ring-1 ring-border/50">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className="text-xs text-muted-foreground mb-1">Filing Status</Label>
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
              <div>
                <Label className="text-xs text-muted-foreground mb-1">State</Label>
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
            </div>
          </div>

          {jobs.map((job) => {
            const isHighest = job.id === highestPayingJob.id
            const result = jobResults.find(r => r.id === job.id)!

            return (
              <div
                key={job.id}
                className={`rounded-2xl p-5 ring-1 transition-all ${
                  isHighest
                    ? 'bg-accent/5 ring-accent/30'
                    : 'bg-card/60 dark:bg-card/40 ring-border/50'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <Input
                      type="text"
                      value={job.name}
                      onChange={(e) => updateName(job.id, e.target.value)}
                      className="bg-transparent border-none font-semibold focus-visible:ring-0 p-0 h-auto"
                    />
                    {isHighest && (
                      <span className="text-xs text-accent ml-2">(Primary Income)</span>
                    )}
                  </div>
                  {jobs.length > 1 && (
                    <button
                      onClick={() => removeJob(job.id)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1">Annual Salary</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                      <Input
                        type="number"
                        value={job.salary}
                        onChange={(e) => updateSalary(job.id, parseFloat(e.target.value) || 0)}
                        step={1000}
                        min={0}
                        className="pl-7 font-semibold bg-background/50 border-border/50"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground mb-1">This Job Withholds</Label>
                    <div className="text-lg font-semibold text-destructive">
                      -{formatCurrency(result.totalWithheld, 0)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-border/50">
                  <div>
                    <div className="text-xs text-muted-foreground">Federal</div>
                    <div className="text-sm font-semibold text-destructive">-{formatCurrency(result.federalTax, 0)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">State</div>
                    <div className="text-sm font-semibold text-destructive">-{formatCurrency(result.stateTax, 0)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">FICA</div>
                    <div className="text-sm font-semibold text-destructive">-{formatCurrency(result.fica, 0)}</div>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Underpayment Warning */}
          {(federalDifference > 500 || stateDifference > 200) && (
            <div className="flex items-start gap-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 p-4 ring-1 ring-amber-200 dark:ring-amber-800">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Potential Underpayment:</strong> When you have multiple jobs, each employer withholds
                taxes as if that's your only income. You may owe additional taxes when you file.
                Consider adjusting your W-4 or making estimated tax payments.
              </div>
            </div>
          )}
        </div>

        {/* Summary Panel */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50 sticky top-20">
            <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <Wallet className="h-5 w-5 text-accent" />
              Combined Summary
            </h2>

            <div className="space-y-4">
              {/* Total Income */}
              <div className="rounded-xl bg-muted/30 p-4">
                <div className="text-sm text-muted-foreground mb-1">Total Annual Income</div>
                <div className="text-2xl font-bold text-foreground">
                  {formatCurrency(totalIncome, 0)}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  From {jobs.length} job{jobs.length > 1 ? 's' : ''}
                </div>
              </div>

              {/* Withholding vs Actual */}
              <div className="rounded-xl bg-muted/30 p-4">
                <div className="text-sm font-medium text-foreground mb-3">Withholding Analysis</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Withheld</span>
                    <span className="text-foreground font-medium">{formatCurrency(totalWithheld, 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Actual Tax Owed</span>
                    <span className="text-foreground font-medium">
                      {formatCurrency(actualFederalTax + actualStateTax + actualFICA, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-border/50">
                    <span className="text-foreground font-medium">Difference</span>
                    <span className={`font-semibold ${federalDifference + stateDifference > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      {federalDifference + stateDifference > 0 ? 'May Owe: ' : 'Refund: '}
                      {formatCurrency(Math.abs(federalDifference + stateDifference), 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actual Take Home */}
              <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 p-4 ring-1 ring-emerald-200 dark:ring-emerald-800">
                <div className="text-sm text-muted-foreground mb-1">Actual Take-Home Pay</div>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(combinedResult.yearly.takeHomePay, 0)}/year
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {formatCurrency(combinedResult.monthly.takeHomePay)}/month
                </div>
              </div>

              {/* Effective Rate */}
              <div className="rounded-xl bg-muted/30 p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Effective Tax Rate</span>
                  <span className="text-lg font-semibold text-foreground">
                    {combinedResult.yearly.effectiveTaxRate.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-muted-foreground">Marginal Rate</span>
                  <span className="text-lg font-semibold text-foreground">
                    {combinedResult.yearly.marginalTaxRate}%
                  </span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                {TAX_YEAR} tax year. Each employer withholds taxes independently.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
