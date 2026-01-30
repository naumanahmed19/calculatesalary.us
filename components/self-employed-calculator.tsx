'use client'

import { useState, useMemo } from 'react'
import { formatCurrency, TAX_YEAR, calculateSelfEmploymentTax } from '@/lib/us-tax-calculator'
import { currentTaxConfig, type FilingStatus } from '@/lib/us-tax-config'
import { Briefcase, Calculator, DollarSign, TrendingUp, AlertCircle, Wallet, Calendar, PiggyBank } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'

export function SelfEmployedCalculator() {
  const [annualRevenue, setAnnualRevenue] = useState(100000)
  const [expenses, setExpenses] = useState(20000)
  const [filingStatus, setFilingStatus] = useState<FilingStatus>('single')
  const [sepIraContribution, setSepIraContribution] = useState(0)
  const [healthInsurance, setHealthInsurance] = useState(0)
  const [homeOfficeDeduction, setHomeOfficeDeduction] = useState(0)

  const calculation = useMemo(() => {
    // Net profit before adjustments
    const netProfit = Math.max(0, annualRevenue - expenses - homeOfficeDeduction)

    // Self-employment tax calculation
    const seResult = calculateSelfEmploymentTax({
      netEarnings: netProfit,
      filingStatus,
    })

    // Adjusted Gross Income for federal tax
    // Can deduct: half of SE tax, SEP-IRA, health insurance premium
    const halfSETax = seResult.deductiblePortion
    const agi = netProfit - halfSETax - sepIraContribution - healthInsurance

    // Federal income tax
    const standardDeduction = currentTaxConfig.standardDeduction[filingStatus]
    const taxableIncome = Math.max(0, agi - standardDeduction)

    const brackets = currentTaxConfig.federalBrackets[filingStatus]
    let federalTax = 0
    let remainingIncome = taxableIncome

    for (let i = 0; i < brackets.length; i++) {
      const bracket = brackets[i]
      const prevMax = i === 0 ? 0 : brackets[i - 1].max
      const bracketSize = bracket.max === Infinity ? remainingIncome : bracket.max - prevMax

      if (remainingIncome <= 0) break

      const taxableInBracket = Math.min(remainingIncome, bracketSize)
      federalTax += taxableInBracket * bracket.rate
      remainingIncome -= taxableInBracket
    }

    // Total taxes
    const totalTaxes = federalTax + seResult.totalSelfEmploymentTax

    // Take-home pay
    const takeHome = netProfit - totalTaxes - sepIraContribution

    // Quarterly estimated payments
    const quarterlyPayment = totalTaxes / 4

    // Marginal rate
    let marginalRate = 10
    for (let i = brackets.length - 1; i >= 0; i--) {
      const prevMax = i === 0 ? 0 : brackets[i - 1].max
      if (taxableIncome > prevMax) {
        marginalRate = brackets[i].rate * 100
        break
      }
    }

    // SEP-IRA max (25% of net SE income - half of SE tax, up to $70,000 for 2025)
    const sepIraMax = Math.min((netProfit - halfSETax) * 0.25, 70000)

    return {
      netProfit,
      ...seResult,
      agi,
      standardDeduction,
      taxableIncome,
      federalTax,
      totalTaxes,
      takeHome,
      quarterlyPayment,
      effectiveRate: netProfit > 0 ? (totalTaxes / netProfit) * 100 : 0,
      marginalRate,
      sepIraMax,
    }
  }, [annualRevenue, expenses, filingStatus, sepIraContribution, healthInsurance, homeOfficeDeduction])

  return (
    <div className="space-y-8">
      <div className="mx-auto max-w-lg grid grid-cols-1 items-start gap-y-6 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
        {/* Input Panel */}
        <div className="rounded-3xl rounded-t-3xl sm:rounded-b-none lg:rounded-tr-none lg:rounded-bl-3xl bg-card/60 dark:bg-card/40 p-8 ring-1 ring-border/50 sm:p-10 sm:mx-8 lg:mx-0">
          <h3 className="text-base/7 font-semibold text-accent flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Your Business Income
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your self-employment income for {TAX_YEAR}
          </p>

          <div className="mt-8 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="revenue" className="text-sm font-medium">
                Annual Revenue (Gross Income)
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-medium text-muted-foreground">$</span>
                <Input
                  id="revenue"
                  type="number"
                  value={annualRevenue || ''}
                  onChange={(e) => setAnnualRevenue(parseFloat(e.target.value) || 0)}
                  className="pl-9 h-12 text-lg font-semibold"
                  placeholder="100,000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expenses" className="text-sm font-medium">
                Business Expenses
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-medium text-muted-foreground">$</span>
                <Input
                  id="expenses"
                  type="number"
                  value={expenses || ''}
                  onChange={(e) => setExpenses(parseFloat(e.target.value) || 0)}
                  className="pl-9 h-12 text-lg font-semibold"
                  placeholder="20,000"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Office supplies, software, equipment, travel, etc.
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Filing Status</Label>
              <Select value={filingStatus} onValueChange={(v) => setFilingStatus(v as FilingStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="married_jointly">Married Filing Jointly</SelectItem>
                  <SelectItem value="married_separately">Married Filing Separately</SelectItem>
                  <SelectItem value="head_of_household">Head of Household</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="homeOffice" className="text-sm font-medium">
                Home Office Deduction
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-medium text-muted-foreground">$</span>
                <Input
                  id="homeOffice"
                  type="number"
                  value={homeOfficeDeduction || ''}
                  onChange={(e) => setHomeOfficeDeduction(parseFloat(e.target.value) || 0)}
                  className="pl-9 h-10"
                  placeholder="0"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Simplified: $5/sq ft up to 300 sq ft ($1,500 max)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="healthInsurance" className="text-sm font-medium">
                Self-Employed Health Insurance
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-medium text-muted-foreground">$</span>
                <Input
                  id="healthInsurance"
                  type="number"
                  value={healthInsurance || ''}
                  onChange={(e) => setHealthInsurance(parseFloat(e.target.value) || 0)}
                  className="pl-9 h-10"
                  placeholder="0"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                100% deductible above-the-line
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">SEP-IRA Contribution</Label>
                <span className="text-sm font-bold text-accent">{formatCurrency(sepIraContribution, 0)}</span>
              </div>
              <Slider
                value={[sepIraContribution]}
                onValueChange={([value]) => setSepIraContribution(value)}
                max={Math.min(69000, calculation.sepIraMax)}
                step={1000}
              />
              <p className="text-xs text-muted-foreground">
                Max: {formatCurrency(calculation.sepIraMax, 0)} (25% of net SE earnings)
              </p>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="rounded-3xl bg-blue-600 dark:bg-blue-700 p-8 ring-1 ring-blue-500/20 sm:p-10 sm:mx-8 lg:mx-0 flex flex-col">
          <h3 className="text-base/7 font-semibold text-white flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Your Take-Home
          </h3>
          <p className="mt-2 text-sm text-blue-200">
            After taxes and deductions
          </p>

          <div className="mt-8">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold tracking-tight text-white">
                {formatCurrency(calculation.takeHome)}
              </span>
              <span className="text-lg text-blue-200">/year</span>
            </div>

            <div className="mt-2 flex items-center gap-4 text-sm">
              <span className="text-blue-200">
                {formatCurrency(calculation.takeHome / 12)}/month
              </span>
              <span className="text-blue-200">
                Effective rate: {calculation.effectiveRate.toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="mt-8 space-y-3 flex-1">
            <div className="flex justify-between items-center py-2 border-b border-blue-500/40">
              <span className="text-sm text-blue-200">Net Profit</span>
              <span className="font-semibold text-white">{formatCurrency(calculation.netProfit)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-blue-500/40">
              <span className="text-sm text-blue-200">Self-Employment Tax</span>
              <span className="font-semibold text-amber-300">-{formatCurrency(calculation.totalSelfEmploymentTax)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-blue-500/40 pl-4">
              <span className="text-xs text-blue-300">↳ Social Security ({(currentTaxConfig.selfEmployment.socialSecurityRate * 100).toFixed(1)}%)</span>
              <span className="text-sm text-blue-200">{formatCurrency(calculation.socialSecurityTax)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-blue-500/40 pl-4">
              <span className="text-xs text-blue-300">↳ Medicare ({(currentTaxConfig.selfEmployment.medicareRate * 100).toFixed(1)}%)</span>
              <span className="text-sm text-blue-200">{formatCurrency(calculation.medicareTax)}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-blue-500/40">
              <span className="text-sm text-blue-200">Federal Income Tax</span>
              <span className="font-semibold text-amber-300">-{formatCurrency(calculation.federalTax)}</span>
            </div>
            {sepIraContribution > 0 && (
              <div className="flex justify-between items-center py-2 border-b border-blue-500/40">
                <span className="text-sm text-blue-200">SEP-IRA Contribution</span>
                <span className="font-semibold text-emerald-300">-{formatCurrency(sepIraContribution)}</span>
              </div>
            )}
            <div className="flex justify-between items-center py-2 pt-3">
              <span className="font-medium text-white">Total Taxes</span>
              <span className="font-bold text-lg text-amber-300">-{formatCurrency(calculation.totalTaxes)}</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-blue-500/40">
            <div className="text-center">
              <p className="text-sm text-blue-200">SE Tax Deduction (50%)</p>
              <p className="text-lg font-semibold text-emerald-300">{formatCurrency(calculation.deductiblePortion)}</p>
              <p className="text-xs text-blue-300">Reduces your taxable income</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quarterly Taxes Section */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-accent" />
            Estimated Quarterly Tax Payments
          </h3>

          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  Self-employed individuals must pay estimated taxes quarterly if you expect to owe $1,000 or more.
                  Use Form 1040-ES to make payments.
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {[
              { deadline: 'April 15', quarter: 'Q1' },
              { deadline: 'June 15', quarter: 'Q2' },
              { deadline: 'September 15', quarter: 'Q3' },
              { deadline: 'January 15', quarter: 'Q4' },
            ].map(({ deadline, quarter }) => (
              <div key={quarter} className="bg-muted/50 rounded-xl p-4 text-center">
                <div className="text-sm text-muted-foreground mb-1">{deadline}</div>
                <div className="font-bold text-xl text-foreground">{formatCurrency(calculation.quarterlyPayment)}</div>
                <div className="text-xs text-muted-foreground">{quarter} Payment</div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-4 bg-accent/5 rounded-xl">
            <div className="flex justify-between items-center">
              <span className="font-medium">Total Annual Estimated Taxes</span>
              <span className="font-bold text-xl text-accent">{formatCurrency(calculation.totalTaxes)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* SE Tax Breakdown */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Calculator className="h-5 w-5 text-accent" />
            Self-Employment Tax Breakdown ({TAX_YEAR})
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">How SE Tax is Calculated</h4>
              <div className="text-sm text-muted-foreground space-y-3">
                <p>
                  1. Net earnings × 92.35% = <span className="font-semibold text-foreground">{formatCurrency(calculation.selfEmploymentTaxBase)}</span>
                </p>
                <p>
                  2. Social Security: 12.4% on first ${currentTaxConfig.socialSecurity.wageBase.toLocaleString()}
                </p>
                <p>
                  3. Medicare: 2.9% on all earnings (+ 0.9% above $200k)
                </p>
                <p>
                  4. Deduct 50% of SE tax from income
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Your SE Tax Summary</h4>
              <div className="bg-muted/50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">SE Tax Base (92.35%)</span>
                  <span className="font-semibold">{formatCurrency(calculation.selfEmploymentTaxBase)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Social Security (12.4%)</span>
                  <span className="font-semibold">{formatCurrency(calculation.socialSecurityTax)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Medicare (2.9%+)</span>
                  <span className="font-semibold">{formatCurrency(calculation.medicareTax)}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-border">
                  <span className="font-medium">Total SE Tax</span>
                  <span className="font-bold text-accent">{formatCurrency(calculation.totalSelfEmploymentTax)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Retirement Options */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <PiggyBank className="h-5 w-5 text-accent" />
            Self-Employed Retirement Options
          </h3>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-muted/50 rounded-xl p-4">
              <h4 className="font-semibold mb-2">SEP-IRA</h4>
              <p className="text-2xl font-bold text-foreground">Up to $70,000</p>
              <p className="text-sm text-muted-foreground mt-1">
                25% of net SE earnings. Easy to set up, no employee contributions.
              </p>
            </div>
            <div className="bg-muted/50 rounded-xl p-4">
              <h4 className="font-semibold mb-2">Solo 401(k)</h4>
              <p className="text-2xl font-bold text-foreground">Up to $70,000</p>
              <p className="text-sm text-muted-foreground mt-1">
                $23,000 employee + 25% employer. Roth option available.
              </p>
            </div>
            <div className="bg-muted/50 rounded-xl p-4">
              <h4 className="font-semibold mb-2">SIMPLE IRA</h4>
              <p className="text-2xl font-bold text-foreground">Up to $16,000</p>
              <p className="text-sm text-muted-foreground mt-1">
                Good for businesses with employees. 3% match or 2% contribution.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
