'use client'

import { useState, useMemo } from 'react'
import { formatCurrency, TAX_YEAR, calculateSalary } from '@/lib/us-tax-calculator'
import { currentTaxConfig, getAllStates, type FilingStatus } from '@/lib/us-tax-config'
import { Gift, Calculator, TrendingDown, Wallet, DollarSign, Info } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// US Bonus withholding rates
const BONUS_WITHHOLDING_RATE = 0.22 // 22% flat rate
const BONUS_WITHHOLDING_RATE_HIGH = 0.37 // 37% for amounts over $1M

const QUICK_BONUSES = [2500, 5000, 10000, 25000, 50000]
const QUICK_SALARIES = [50000, 75000, 100000, 125000, 150000]
const ALL_STATES = getAllStates()

interface BonusTaxCalculatorProps {
  initialSalary?: number
  initialBonus?: number
}

export function BonusTaxCalculator({
  initialSalary = 75000,
  initialBonus = 10000,
}: BonusTaxCalculatorProps) {
  const [baseSalary, setBaseSalary] = useState(initialSalary)
  const [bonusAmount, setBonusAmount] = useState(initialBonus)
  const [state, setState] = useState('CA')
  const [filingStatus, setFilingStatus] = useState<FilingStatus>('single')
  const [add401k, setAdd401k] = useState(false)
  const [contribution401k, setContribution401k] = useState(0)

  const calculation = useMemo(() => {
    // Calculate actual tax (using aggregate method)
    const withoutBonus = calculateSalary({
      grossSalary: baseSalary,
      filingStatus,
      state,
      retirement401k: add401k ? contribution401k : 0,
    })

    const withBonus = calculateSalary({
      grossSalary: baseSalary,
      bonus: bonusAmount,
      filingStatus,
      state,
      retirement401k: add401k ? contribution401k : 0,
    })

    // Actual tax on the bonus
    const actualFederalTax = withBonus.yearly.federalTax - withoutBonus.yearly.federalTax
    const actualStateTax = withBonus.yearly.stateTax - withoutBonus.yearly.stateTax
    const actualSocialSecurity = withBonus.yearly.socialSecurity - withoutBonus.yearly.socialSecurity
    const actualMedicare = withBonus.yearly.medicare - withoutBonus.yearly.medicare

    // Withholding calculation (what employer takes out)
    // Flat 22% federal (or 37% over $1M)
    const bonusUnderMillion = Math.min(bonusAmount, 1000000)
    const bonusOverMillion = Math.max(0, bonusAmount - 1000000)
    const federalWithholding = (bonusUnderMillion * BONUS_WITHHOLDING_RATE) + (bonusOverMillion * BONUS_WITHHOLDING_RATE_HIGH)

    // FICA on bonus
    const ssWageBase = currentTaxConfig.socialSecurity.wageBase
    const incomeBeforeBonus = baseSalary
    const ssOnBonus = incomeBeforeBonus >= ssWageBase
      ? 0
      : Math.min(bonusAmount, ssWageBase - incomeBeforeBonus) * currentTaxConfig.socialSecurity.rate
    const medicareOnBonus = bonusAmount * currentTaxConfig.medicare.rate

    // Estimate state withholding (varies, using actual rate)
    const stateWithholding = actualStateTax

    const totalWithholding = federalWithholding + stateWithholding + ssOnBonus + medicareOnBonus
    const netBonusWithholding = bonusAmount - totalWithholding

    const actualTotalTax = actualFederalTax + actualStateTax + actualSocialSecurity + actualMedicare
    const netBonusActual = bonusAmount - actualTotalTax

    // Difference (refund or owed)
    const withholdingVsActual = totalWithholding - actualTotalTax

    return {
      bonusAmount,
      // Withholding amounts
      federalWithholding,
      stateWithholding,
      ssWithholding: ssOnBonus,
      medicareWithholding: medicareOnBonus,
      totalWithholding,
      netBonusWithholding,
      // Actual tax amounts
      actualFederalTax,
      actualStateTax,
      actualSocialSecurity,
      actualMedicare,
      actualTotalTax,
      netBonusActual,
      // Comparison
      withholdingVsActual,
      effectiveBonusTaxRate: bonusAmount > 0 ? (actualTotalTax / bonusAmount) * 100 : 0,
      marginalRate: withBonus.yearly.marginalTaxRate,
    }
  }, [baseSalary, bonusAmount, state, filingStatus, add401k, contribution401k])

  const totalIncome = baseSalary + bonusAmount

  return (
    <div className="space-y-8">
      <div className="mx-auto max-w-lg grid grid-cols-1 items-start gap-y-6 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
        {/* Input Panel */}
        <div className="rounded-3xl rounded-t-3xl sm:rounded-b-none lg:rounded-tr-none lg:rounded-bl-3xl bg-card/60 dark:bg-card/40 p-8 ring-1 ring-border/50 sm:p-10 sm:mx-8 lg:mx-0">
          <h3 className="text-base/7 font-semibold text-accent flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Bonus Details
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Calculate tax on your bonus for {TAX_YEAR}
          </p>

          <div className="mt-8 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="baseSalary">Annual Base Salary</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-medium text-muted-foreground">$</span>
                <Input
                  id="baseSalary"
                  type="number"
                  value={baseSalary || ''}
                  onChange={(e) => setBaseSalary(parseFloat(e.target.value) || 0)}
                  className="pl-9 h-12 text-lg font-semibold"
                  placeholder="75,000"
                />
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {QUICK_SALARIES.map((salary) => (
                  <button
                    key={salary}
                    type="button"
                    onClick={() => setBaseSalary(salary)}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                      baseSalary === salary
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    ${(salary / 1000).toFixed(0)}k
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bonusAmount">Bonus Amount</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-medium text-muted-foreground">$</span>
                <Input
                  id="bonusAmount"
                  type="number"
                  value={bonusAmount || ''}
                  onChange={(e) => setBonusAmount(parseFloat(e.target.value) || 0)}
                  className="pl-9 h-12 text-lg font-semibold"
                  placeholder="10,000"
                />
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {QUICK_BONUSES.map((bonus) => (
                  <button
                    key={bonus}
                    type="button"
                    onClick={() => setBonusAmount(bonus)}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                      bonusAmount === bonus
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    ${bonus >= 1000 ? `${(bonus / 1000).toFixed(0)}k` : bonus}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Filing Status</Label>
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
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="rounded-3xl bg-emerald-600 dark:bg-emerald-700 p-8 ring-1 ring-emerald-500/20 sm:p-10 sm:mx-8 lg:mx-0 flex flex-col">
          <h3 className="text-base/7 font-semibold text-white flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Bonus After Tax
          </h3>
          <p className="mt-2 text-sm text-emerald-200">
            Your bonus breakdown for {TAX_YEAR}
          </p>

          <div className="mt-6">
            <div className="text-center py-4">
              <p className="text-sm text-emerald-200">Net Bonus (Actual Tax)</p>
              <p className="text-4xl font-bold text-white mt-2">
                {formatCurrency(calculation.netBonusActual, 0)}
              </p>
              <p className="text-sm mt-2 text-emerald-200">
                From {formatCurrency(calculation.bonusAmount, 0)} gross bonus
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-blue-500/40">
                <span className="text-sm text-emerald-200">Gross Bonus</span>
                <span className="font-semibold text-white">{formatCurrency(calculation.bonusAmount, 0)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-blue-500/40">
                <span className="text-sm text-emerald-200">Federal Tax</span>
                <span className="font-semibold text-amber-300">−{formatCurrency(calculation.actualFederalTax, 0)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-blue-500/40">
                <span className="text-sm text-emerald-200">State Tax</span>
                <span className="font-semibold text-amber-300">−{formatCurrency(calculation.actualStateTax, 0)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-blue-500/40">
                <span className="text-sm text-emerald-200">Social Security</span>
                <span className="font-semibold text-amber-300">−{formatCurrency(calculation.actualSocialSecurity, 0)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-blue-500/40">
                <span className="text-sm text-emerald-200">Medicare</span>
                <span className="font-semibold text-amber-300">−{formatCurrency(calculation.actualMedicare, 0)}</span>
              </div>
              <div className="flex justify-between items-center py-2 pt-3">
                <span className="font-medium text-white">Net Bonus</span>
                <span className="font-bold text-lg text-white">{formatCurrency(calculation.netBonusActual, 0)}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-blue-500/40">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-xs text-emerald-200">Effective Tax Rate</p>
                <p className="text-xl font-bold text-white">{calculation.effectiveBonusTaxRate.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-xs text-emerald-200">Marginal Rate</p>
                <p className="text-xl font-bold text-white">{calculation.marginalRate}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Withholding vs Actual */}
      <div className="mx-auto max-w-4xl rounded-2xl bg-card border border-border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Info className="h-5 w-5 text-accent" />
          <h3 className="font-semibold">Withholding vs Actual Tax</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Employer Withholding (Flat Rate)</h4>
            <div className="bg-muted/50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Federal (22% flat)</span>
                <span className="font-semibold">{formatCurrency(calculation.federalWithholding, 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>State</span>
                <span className="font-semibold">{formatCurrency(calculation.stateWithholding, 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Social Security</span>
                <span className="font-semibold">{formatCurrency(calculation.ssWithholding, 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Medicare</span>
                <span className="font-semibold">{formatCurrency(calculation.medicareWithholding, 0)}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-border font-semibold">
                <span>Total Withheld</span>
                <span>{formatCurrency(calculation.totalWithholding, 0)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">What You Actually Owe</h4>
            <div className="bg-muted/50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Federal (actual bracket)</span>
                <span className="font-semibold">{formatCurrency(calculation.actualFederalTax, 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>State</span>
                <span className="font-semibold">{formatCurrency(calculation.actualStateTax, 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Social Security</span>
                <span className="font-semibold">{formatCurrency(calculation.actualSocialSecurity, 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Medicare</span>
                <span className="font-semibold">{formatCurrency(calculation.actualMedicare, 0)}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-border font-semibold">
                <span>Actual Tax</span>
                <span>{formatCurrency(calculation.actualTotalTax, 0)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={`mt-4 p-4 rounded-xl ${calculation.withholdingVsActual > 0 ? 'bg-emerald-50 dark:bg-emerald-950/30' : 'bg-amber-50 dark:bg-amber-950/30'}`}>
          <div className="flex justify-between items-center">
            <span className="font-medium">
              {calculation.withholdingVsActual > 0 ? 'Refund at Tax Time' : 'May Owe at Tax Time'}
            </span>
            <span className={`font-bold text-lg ${calculation.withholdingVsActual > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
              {calculation.withholdingVsActual > 0 ? '+' : ''}{formatCurrency(calculation.withholdingVsActual, 0)}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {calculation.withholdingVsActual > 0
              ? 'Your employer withheld more than your actual tax liability. You\'ll get this back when you file.'
              : 'The flat 22% withholding is less than your actual tax rate. You may owe additional taxes when you file.'
            }
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="mx-auto max-w-4xl grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl bg-card/60 p-6 ring-1 ring-border/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-accent/10">
              <DollarSign className="h-5 w-5 text-accent" />
            </div>
            <h4 className="font-semibold">Total Income</h4>
          </div>
          <p className="text-2xl font-bold">{formatCurrency(totalIncome, 0)}</p>
          <p className="text-sm text-muted-foreground mt-1">Salary + Bonus</p>
        </div>

        <div className="rounded-2xl bg-card/60 p-6 ring-1 ring-border/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-accent/10">
              <Wallet className="h-5 w-5 text-accent" />
            </div>
            <h4 className="font-semibold">You Keep</h4>
          </div>
          <p className="text-2xl font-bold">
            {((calculation.netBonusActual / calculation.bonusAmount) * 100).toFixed(1)}%
          </p>
          <p className="text-sm text-muted-foreground mt-1">Of your bonus</p>
        </div>

        <div className="rounded-2xl bg-card/60 p-6 ring-1 ring-border/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-accent/10">
              <TrendingDown className="h-5 w-5 text-accent" />
            </div>
            <h4 className="font-semibold">Total Tax</h4>
          </div>
          <p className="text-2xl font-bold">{formatCurrency(calculation.actualTotalTax, 0)}</p>
          <p className="text-sm text-muted-foreground mt-1">Federal + State + FICA</p>
        </div>
      </div>
    </div>
  )
}
