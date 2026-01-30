'use client'

import { useState } from 'react'
import { calculateSalary, formatCurrency, TAX_YEAR } from '@/lib/us-tax-calculator'
import { UserX, Calculator, DollarSign, Calendar, AlertCircle, Info } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { FilingStatus } from '@/lib/us-tax-config'

// Common severance formulas in the US
const SEVERANCE_FORMULAS = {
  standard: 1, // 1 week per year
  generous: 2, // 2 weeks per year
  executive: 4, // 4 weeks per year (executive packages)
}

export function RedundancyCalculator() {
  const [annualSalary, setAnnualSalary] = useState(75000)
  const [yearsOfService, setYearsOfService] = useState(5)
  const [severanceWeeksPerYear, setSeveranceWeeksPerYear] = useState(2)
  const [additionalSeverance, setAdditionalSeverance] = useState(0)
  const [unusedPTO, setUnusedPTO] = useState(10)
  const [filingStatus, setFilingStatus] = useState<FilingStatus>('single')
  const [state, setState] = useState('TX')
  const [cobraCoverage, setCobraCoverage] = useState(0) // months of COBRA

  const weeklyPay = annualSalary / 52
  const dailyPay = annualSalary / 260 // 52 weeks * 5 days

  // Calculate severance based on formula
  const severanceWeeks = yearsOfService * severanceWeeksPerYear
  const baseSeverance = severanceWeeks * weeklyPay

  // Total severance including additional negotiated amount
  const totalSeverance = baseSeverance + additionalSeverance

  // PTO payout (most states require this)
  const ptoPayout = unusedPTO * dailyPay

  // Estimate COBRA subsidy value (if company pays)
  const monthlyCobraCost = 600 // Average monthly COBRA cost
  const cobraValue = cobraCoverage * monthlyCobraCost

  // Total gross compensation
  const totalGrossCompensation = totalSeverance + ptoPayout

  // Calculate taxes on severance (treated as supplemental wages)
  // Federal supplemental wage withholding is flat 22% (or 37% over $1M)
  const federalWithholding = totalGrossCompensation <= 1000000
    ? totalGrossCompensation * 0.22
    : 1000000 * 0.22 + (totalGrossCompensation - 1000000) * 0.37

  // Calculate FICA on severance
  const socialSecurityWageBase = 176100 // 2025 wage base
  const socialSecurityRate = 0.062
  const medicareRate = 0.0145
  const additionalMedicareRate = 0.009
  const additionalMedicareThreshold = filingStatus === 'married_jointly' ? 250000 : 200000

  // Simplified FICA calculation (assumes this is on top of regular salary)
  const ficaTax = Math.min(totalGrossCompensation, socialSecurityWageBase) * socialSecurityRate +
                  totalGrossCompensation * medicareRate

  // State tax estimate (use calculator for accuracy)
  const salaryResult = calculateSalary({
    grossSalary: totalGrossCompensation,
    filingStatus,
    state,
  })
  const stateTax = salaryResult.yearly.stateTax

  // Total deductions
  const totalDeductions = federalWithholding + ficaTax + stateTax

  // Net payment
  const netPayment = totalGrossCompensation - totalDeductions

  // Calculate what monthly income this represents
  const monthsOfSeverance = severanceWeeks / 4.33 // Average weeks per month

  return (
    <div className="space-y-8">
      <div className="mx-auto max-w-lg grid grid-cols-1 items-center gap-y-6 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
        <div className="rounded-3xl rounded-t-3xl sm:rounded-b-none lg:rounded-tr-none lg:rounded-bl-3xl bg-card/60 dark:bg-card/40 p-8 ring-1 ring-border/50 sm:p-10 sm:mx-8 lg:mx-0">
          <h3 className="text-base/7 font-semibold text-accent flex items-center gap-2">
            <UserX className="h-5 w-5" />
            Your Employment Details
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Estimate your severance package
          </p>

          <div className="mt-8 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="annualSalary" className="text-sm font-medium">
                Annual Salary
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-medium text-muted-foreground">$</span>
                <Input
                  id="annualSalary"
                  type="number"
                  value={annualSalary || ''}
                  onChange={(e) => setAnnualSalary(parseFloat(e.target.value) || 0)}
                  className="pl-9 h-12 text-lg font-semibold"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Weekly pay: {formatCurrency(weeklyPay)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="years" className="text-sm font-medium">
                  Years of Service
                </Label>
                <Input
                  id="years"
                  type="number"
                  value={yearsOfService || ''}
                  onChange={(e) => setYearsOfService(parseInt(e.target.value) || 0)}
                  className="h-10"
                  min={0}
                  max={50}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weeksPerYear" className="text-sm font-medium">
                  Weeks per Year
                </Label>
                <Select
                  value={severanceWeeksPerYear.toString()}
                  onValueChange={(v) => setSeveranceWeeksPerYear(parseInt(v))}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 week/year (Standard)</SelectItem>
                    <SelectItem value="2">2 weeks/year (Generous)</SelectItem>
                    <SelectItem value="3">3 weeks/year</SelectItem>
                    <SelectItem value="4">4 weeks/year (Executive)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalSeverance" className="text-sm font-medium">
                Additional Negotiated Severance
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                <Input
                  id="additionalSeverance"
                  type="number"
                  value={additionalSeverance || ''}
                  onChange={(e) => setAdditionalSeverance(parseFloat(e.target.value) || 0)}
                  className="pl-9 h-10"
                  placeholder="0"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Extra amount beyond standard formula
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pto" className="text-sm font-medium">
                  Unused PTO Days
                </Label>
                <Input
                  id="pto"
                  type="number"
                  value={unusedPTO || ''}
                  onChange={(e) => setUnusedPTO(parseInt(e.target.value) || 0)}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cobra" className="text-sm font-medium">
                  COBRA Months Covered
                </Label>
                <Input
                  id="cobra"
                  type="number"
                  value={cobraCoverage || ''}
                  onChange={(e) => setCobraCoverage(parseInt(e.target.value) || 0)}
                  className="h-10"
                  min={0}
                  max={18}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Filing Status</Label>
                <Select value={filingStatus} onValueChange={(v) => setFilingStatus(v as FilingStatus)}>
                  <SelectTrigger className="h-10">
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
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TX">Texas</SelectItem>
                    <SelectItem value="FL">Florida</SelectItem>
                    <SelectItem value="CA">California</SelectItem>
                    <SelectItem value="NY">New York</SelectItem>
                    <SelectItem value="WA">Washington</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl h-auto min-h-[700px] bg-accent/5 dark:bg-accent/10 p-8 ring-1 ring-accent/20 sm:p-10 sm:mx-8 lg:mx-0">
          <h3 className="text-base/7 font-semibold text-accent flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Your Severance Package
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Estimated total payment
          </p>

          <div className="mt-8">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold tracking-tight text-accent">
                {formatCurrency(netPayment)}
              </span>
              <span className="text-lg text-muted-foreground">net</span>
            </div>

            <div className="mt-2 text-sm text-muted-foreground">
              Gross: {formatCurrency(totalGrossCompensation)}
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-border/50">
              <div>
                <span className="text-sm text-muted-foreground">Base Severance ({severanceWeeks} weeks)</span>
              </div>
              <span className="font-semibold text-foreground">{formatCurrency(baseSeverance)}</span>
            </div>
            {additionalSeverance > 0 && (
              <div className="flex justify-between items-center py-3 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Additional Severance</span>
                <span className="font-semibold text-foreground">{formatCurrency(additionalSeverance)}</span>
              </div>
            )}
            <div className="flex justify-between items-center py-3 border-b border-border/50">
              <div>
                <span className="text-sm text-muted-foreground">PTO Payout ({unusedPTO} days)</span>
              </div>
              <span className="font-semibold text-foreground">{formatCurrency(ptoPayout)}</span>
            </div>
            {cobraCoverage > 0 && (
              <div className="flex justify-between items-center py-3 border-b border-border/50">
                <div>
                  <span className="text-sm text-muted-foreground">COBRA Coverage ({cobraCoverage} mo)</span>
                  <span className="ml-2 text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                    Benefit
                  </span>
                </div>
                <span className="font-semibold text-foreground">~{formatCurrency(cobraValue)}</span>
              </div>
            )}
            <div className="flex justify-between items-center py-3 border-b border-border/50">
              <span className="text-sm text-muted-foreground">Federal Withholding (22%)</span>
              <span className="font-semibold text-red-500">-{formatCurrency(federalWithholding)}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-border/50">
              <span className="text-sm text-muted-foreground">FICA (Social Security + Medicare)</span>
              <span className="font-semibold text-red-500">-{formatCurrency(ficaTax)}</span>
            </div>
            {stateTax > 0 && (
              <div className="flex justify-between items-center py-3 border-b border-border/50">
                <span className="text-sm text-muted-foreground">State Tax</span>
                <span className="font-semibold text-red-500">-{formatCurrency(stateTax)}</span>
              </div>
            )}
            <div className="flex justify-between items-center py-3">
              <span className="font-medium">Net Payment</span>
              <span className="font-bold text-xl text-accent">{formatCurrency(netPayment)}</span>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-accent/10">
            <p className="text-sm text-muted-foreground">
              This severance covers approximately <span className="font-semibold text-foreground">{monthsOfSeverance.toFixed(1)} months</span> of pay
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Calculator className="h-5 w-5 text-accent" />
            Common Severance Packages in the US
          </h3>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-muted/50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-accent">1 week</div>
              <div className="text-sm text-muted-foreground mt-1">per year of service</div>
              <div className="text-xs text-muted-foreground">Standard package</div>
            </div>
            <div className="bg-muted/50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-accent">2 weeks</div>
              <div className="text-sm text-muted-foreground mt-1">per year of service</div>
              <div className="text-xs text-muted-foreground">Generous package</div>
            </div>
            <div className="bg-muted/50 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-accent">4+ weeks</div>
              <div className="text-sm text-muted-foreground mt-1">per year of service</div>
              <div className="text-xs text-muted-foreground">Executive package</div>
            </div>
          </div>

          <div className="bg-accent/5 dark:bg-accent/10 border border-accent/20 rounded-xl p-4">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium mb-1 text-foreground">Key points for {TAX_YEAR}:</p>
                <ul className="space-y-1">
                  <li>• No federal law requires severance pay (it&apos;s voluntary)</li>
                  <li>• Supplemental wages taxed at flat 22% federal (37% over $1M)</li>
                  <li>• COBRA allows 18 months of health coverage continuation</li>
                  <li>• PTO payout laws vary by state</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-muted/50 border border-border rounded-xl p-4">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-foreground">Tax Treatment Summary</h4>
              <p className="text-sm text-muted-foreground mt-1">
                <strong>Fully Taxable:</strong> All severance pay is treated as ordinary income and subject to federal income tax, Social Security, Medicare, and state taxes.<br />
                <strong>Withholding:</strong> Employers typically withhold at the 22% supplemental wage rate for federal taxes.<br />
                <strong>Timing:</strong> Lump sum payments may push you into a higher tax bracket for the year.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
