'use client'

import { useState, useMemo } from 'react'
import { formatCurrency, TAX_YEAR, calculateSalary } from '@/lib/us-tax-calculator'
import { currentTaxConfig, type FilingStatus } from '@/lib/us-tax-config'
import { TrendingUp, DollarSign, Home, LineChart, Calendar } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// US Long-Term Capital Gains Tax Rates (2025)
const LONG_TERM_CG_RATES = {
  single: [
    { threshold: 47025, rate: 0 },
    { threshold: 518900, rate: 0.15 },
    { threshold: Infinity, rate: 0.20 },
  ],
  married_jointly: [
    { threshold: 94050, rate: 0 },
    { threshold: 583750, rate: 0.15 },
    { threshold: Infinity, rate: 0.20 },
  ],
  married_separately: [
    { threshold: 47025, rate: 0 },
    { threshold: 291850, rate: 0.15 },
    { threshold: Infinity, rate: 0.20 },
  ],
  head_of_household: [
    { threshold: 63000, rate: 0 },
    { threshold: 551350, rate: 0.15 },
    { threshold: Infinity, rate: 0.20 },
  ],
}

// Net Investment Income Tax thresholds
const NIIT_THRESHOLD = {
  single: 200000,
  married_jointly: 250000,
  married_separately: 125000,
  head_of_household: 200000,
}
const NIIT_RATE = 0.038 // 3.8%

// Primary Residence Exclusion
const PRIMARY_RESIDENCE_EXCLUSION = {
  single: 250000,
  married_jointly: 500000,
  married_separately: 250000,
  head_of_household: 250000,
}

interface CapitalGainsTaxCalculatorProps {
  initialGain?: number
}

export function CapitalGainsTaxCalculator({ initialGain = 50000 }: CapitalGainsTaxCalculatorProps) {
  const [purchasePrice, setPurchasePrice] = useState(200000)
  const [salePrice, setSalePrice] = useState(250000)
  const [costs, setCosts] = useState(5000) // Broker fees, closing costs, improvements, etc.
  const [annualIncome, setAnnualIncome] = useState(75000)
  const [filingStatus, setFilingStatus] = useState<FilingStatus>('single')
  const [holdingPeriod, setHoldingPeriod] = useState<'short' | 'long'>('long')
  const [assetType, setAssetType] = useState<'property' | 'stocks' | 'other'>('stocks')
  const [isPrimaryResidence, setIsPrimaryResidence] = useState(false)

  const calculation = useMemo(() => {
    // Calculate gross gain
    const grossGain = salePrice - purchasePrice - costs

    // Apply primary residence exclusion if applicable
    let exclusionAmount = 0
    let taxableGain = grossGain

    if (isPrimaryResidence && assetType === 'property' && grossGain > 0) {
      const maxExclusion = PRIMARY_RESIDENCE_EXCLUSION[filingStatus]
      exclusionAmount = Math.min(grossGain, maxExclusion)
      taxableGain = Math.max(0, grossGain - exclusionAmount)
    }

    // If no taxable gain, no tax
    if (taxableGain <= 0) {
      return {
        grossGain,
        exclusionAmount,
        taxableGain: 0,
        federalTax: 0,
        niitTax: 0,
        totalTax: 0,
        netProceeds: salePrice - costs - purchasePrice,
        effectiveRate: 0,
        marginalRate: 0,
        isShortTerm: holdingPeriod === 'short',
      }
    }

    let federalTax = 0
    let marginalRate = 0

    if (holdingPeriod === 'short') {
      // Short-term gains taxed as ordinary income
      const withGain = calculateSalary({
        grossSalary: annualIncome + taxableGain,
        filingStatus,
        state: 'TX', // Use no-tax state for federal calculation
      })

      const withoutGain = calculateSalary({
        grossSalary: annualIncome,
        filingStatus,
        state: 'TX',
      })

      federalTax = withGain.yearly.federalTax - withoutGain.yearly.federalTax
      marginalRate = withGain.yearly.marginalTaxRate
    } else {
      // Long-term gains use preferential rates
      const brackets = LONG_TERM_CG_RATES[filingStatus]
      let remainingGain = taxableGain
      let currentIncome = annualIncome

      for (const bracket of brackets) {
        if (remainingGain <= 0) break

        const spaceInBracket = Math.max(0, bracket.threshold - currentIncome)
        const amountInBracket = Math.min(remainingGain, spaceInBracket)

        if (amountInBracket > 0) {
          federalTax += amountInBracket * bracket.rate
          remainingGain -= amountInBracket
          currentIncome += amountInBracket
        }
      }

      // Any remaining gain taxed at top rate
      if (remainingGain > 0) {
        federalTax += remainingGain * brackets[brackets.length - 1].rate
      }

      // Determine marginal rate
      const totalIncome = annualIncome + taxableGain
      for (let i = brackets.length - 1; i >= 0; i--) {
        if (totalIncome > brackets[i].threshold || i === 0) {
          marginalRate = brackets[Math.min(i + 1, brackets.length - 1)].rate * 100
          break
        }
      }
    }

    // Calculate NIIT (3.8% on investment income for high earners)
    const niitThreshold = NIIT_THRESHOLD[filingStatus]
    const totalIncome = annualIncome + taxableGain
    let niitTax = 0

    if (totalIncome > niitThreshold) {
      const niitableAmount = Math.min(taxableGain, totalIncome - niitThreshold)
      niitTax = niitableAmount * NIIT_RATE
    }

    const totalTax = federalTax + niitTax
    const netProceeds = salePrice - costs - totalTax - purchasePrice
    const effectiveRate = taxableGain > 0 ? (totalTax / taxableGain) * 100 : 0

    return {
      grossGain,
      exclusionAmount,
      taxableGain,
      federalTax,
      niitTax,
      totalTax,
      netProceeds,
      effectiveRate,
      marginalRate,
      isShortTerm: holdingPeriod === 'short',
    }
  }, [purchasePrice, salePrice, costs, annualIncome, filingStatus, holdingPeriod, assetType, isPrimaryResidence])

  const niitThreshold = NIIT_THRESHOLD[filingStatus]
  const totalIncome = annualIncome + Math.max(0, calculation.taxableGain)
  const isSubjectToNIIT = totalIncome > niitThreshold

  return (
    <div className="space-y-8">
      <div className="mx-auto max-w-lg grid grid-cols-1 items-start gap-y-6 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
        {/* Input Panel */}
        <div className="rounded-3xl rounded-t-3xl sm:rounded-b-none lg:rounded-tr-none lg:rounded-bl-3xl bg-card/60 dark:bg-card/40 p-8 ring-1 ring-border/50 sm:p-10 sm:mx-8 lg:mx-0">
          <h3 className="text-base/7 font-semibold text-accent flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Asset Sale Details
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Calculate capital gains tax for {TAX_YEAR}
          </p>

          <div className="mt-8 space-y-6">
            {/* Asset Type */}
            <div className="space-y-2">
              <Label>Asset Type</Label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => { setAssetType('stocks'); setIsPrimaryResidence(false); }}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl ring-1 transition-all ${
                    assetType === 'stocks'
                      ? 'bg-accent/10 ring-accent/50 text-accent'
                      : 'bg-card ring-border hover:ring-border/80'
                  }`}
                >
                  <LineChart className="h-4 w-4" />
                  <span className="text-sm font-medium">Stocks</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAssetType('property')}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl ring-1 transition-all ${
                    assetType === 'property'
                      ? 'bg-accent/10 ring-accent/50 text-accent'
                      : 'bg-card ring-border hover:ring-border/80'
                  }`}
                >
                  <Home className="h-4 w-4" />
                  <span className="text-sm font-medium">Property</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setAssetType('other'); setIsPrimaryResidence(false); }}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl ring-1 transition-all ${
                    assetType === 'other'
                      ? 'bg-accent/10 ring-accent/50 text-accent'
                      : 'bg-card ring-border hover:ring-border/80'
                  }`}
                >
                  <span className="text-sm font-medium">Other</span>
                </button>
              </div>
            </div>

            {/* Holding Period */}
            <div className="space-y-2">
              <Label>Holding Period</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setHoldingPeriod('long')}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl ring-1 transition-all ${
                    holdingPeriod === 'long'
                      ? 'bg-emerald-500/10 ring-emerald-500/50 text-emerald-600 dark:text-emerald-400'
                      : 'bg-card ring-border hover:ring-border/80'
                  }`}
                >
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-medium">Long-term (1+ year)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setHoldingPeriod('short')}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl ring-1 transition-all ${
                    holdingPeriod === 'short'
                      ? 'bg-amber-500/10 ring-amber-500/50 text-amber-600 dark:text-amber-400'
                      : 'bg-card ring-border hover:ring-border/80'
                  }`}
                >
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-medium">Short-term (&lt;1 year)</span>
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                {holdingPeriod === 'long'
                  ? 'Long-term gains taxed at preferential rates (0%, 15%, or 20%)'
                  : 'Short-term gains taxed as ordinary income (up to 37%)'
                }
              </p>
            </div>

            {/* Primary Residence Toggle */}
            {assetType === 'property' && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 ring-1 ring-border/50">
                <input
                  type="checkbox"
                  id="primaryResidence"
                  checked={isPrimaryResidence}
                  onChange={(e) => setIsPrimaryResidence(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-accent focus:ring-accent"
                />
                <Label htmlFor="primaryResidence" className="text-sm cursor-pointer">
                  This is my primary residence (lived 2+ of last 5 years)
                </Label>
              </div>
            )}

            {/* Purchase Price */}
            <div className="space-y-2">
              <Label htmlFor="purchase">Cost Basis (Purchase Price)</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-medium text-muted-foreground">$</span>
                <Input
                  id="purchase"
                  type="number"
                  value={purchasePrice || ''}
                  onChange={(e) => setPurchasePrice(parseFloat(e.target.value) || 0)}
                  className="pl-9 h-12 text-lg font-semibold"
                  step={1000}
                />
              </div>
            </div>

            {/* Sale Price */}
            <div className="space-y-2">
              <Label htmlFor="sale">Sale Price</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-medium text-muted-foreground">$</span>
                <Input
                  id="sale"
                  type="number"
                  value={salePrice || ''}
                  onChange={(e) => setSalePrice(parseFloat(e.target.value) || 0)}
                  className="pl-9 h-12 text-lg font-semibold"
                  step={1000}
                />
              </div>
            </div>

            {/* Costs */}
            <div className="space-y-2">
              <Label htmlFor="costs">Selling Costs (fees, commissions)</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-medium text-muted-foreground">$</span>
                <Input
                  id="costs"
                  type="number"
                  value={costs || ''}
                  onChange={(e) => setCosts(parseFloat(e.target.value) || 0)}
                  className="pl-9 h-10"
                  step={100}
                />
              </div>
            </div>

            {/* Annual Income */}
            <div className="space-y-2">
              <Label htmlFor="income">Your Other Annual Income</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-medium text-muted-foreground">$</span>
                <Input
                  id="income"
                  type="number"
                  value={annualIncome || ''}
                  onChange={(e) => setAnnualIncome(parseFloat(e.target.value) || 0)}
                  className="pl-9 h-10"
                  step={1000}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Determines your capital gains tax bracket
              </p>
            </div>

            {/* Filing Status */}
            <div className="space-y-2">
              <Label>Filing Status</Label>
              <Select value={filingStatus} onValueChange={(v) => setFilingStatus(v as FilingStatus)}>
                <SelectTrigger className="h-10">
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
          </div>
        </div>

        {/* Results Panel */}
        <div className="rounded-3xl bg-accent/5 dark:bg-accent/10 p-8 ring-1 ring-accent/20 sm:p-10 sm:mx-8 lg:mx-0">
          <h3 className="text-base/7 font-semibold text-accent flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Capital Gains Tax
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {calculation.isShortTerm ? 'Short-term' : 'Long-term'} • {calculation.effectiveRate.toFixed(1)}% effective rate
          </p>

          <div className="mt-6">
            {/* Main Result */}
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">
                {isPrimaryResidence && calculation.exclusionAmount > 0
                  ? 'Capital Gains Tax (after exclusion)'
                  : 'Capital Gains Tax Due'}
              </p>
              <p className={`text-4xl font-bold mt-2 ${calculation.totalTax === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground'}`}>
                {formatCurrency(calculation.totalTax, 0)}
              </p>
              {calculation.totalTax === 0 && calculation.grossGain > 0 && (
                <p className="text-sm mt-2 text-emerald-600 dark:text-emerald-400">
                  {isPrimaryResidence ? 'Primary residence exclusion applied!' : 'No tax due!'}
                </p>
              )}
            </div>

            {/* Breakdown */}
            <div className="mt-6 space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Sale Price</span>
                <span className="font-semibold text-foreground">{formatCurrency(salePrice, 0)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Cost Basis</span>
                <span className="font-semibold text-foreground">−{formatCurrency(purchasePrice, 0)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-sm text-muted-foreground">Selling Costs</span>
                <span className="font-semibold text-foreground">−{formatCurrency(costs, 0)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-sm font-medium text-foreground">Gross Gain</span>
                <span className={`font-semibold ${calculation.grossGain >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'}`}>
                  {formatCurrency(calculation.grossGain, 0)}
                </span>
              </div>

              {calculation.exclusionAmount > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">Primary Residence Exclusion</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    −{formatCurrency(calculation.exclusionAmount, 0)}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-sm font-medium text-foreground">Taxable Gain</span>
                <span className="font-semibold text-foreground">{formatCurrency(calculation.taxableGain, 0)}</span>
              </div>

              {calculation.taxableGain > 0 && (
                <>
                  <div className="flex justify-between items-center py-2 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">
                      Federal Tax ({calculation.isShortTerm ? 'ordinary rates' : `${calculation.marginalRate}%`})
                    </span>
                    <span className="font-semibold text-destructive">−{formatCurrency(calculation.federalTax, 0)}</span>
                  </div>

                  {calculation.niitTax > 0 && (
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-sm text-muted-foreground">NIIT (3.8%)</span>
                      <span className="font-semibold text-destructive">−{formatCurrency(calculation.niitTax, 0)}</span>
                    </div>
                  )}
                </>
              )}

              <div className="flex justify-between items-center py-2 pt-3">
                <span className="font-semibold text-foreground">Net Proceeds</span>
                <span className="font-bold text-lg text-accent">{formatCurrency(calculation.netProceeds, 0)}</span>
              </div>
            </div>
          </div>

          {/* NIIT Warning */}
          {isSubjectToNIIT && calculation.taxableGain > 0 && (
            <div className="mt-6 p-4 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400">
              <p className="text-sm">
                Your income exceeds ${niitThreshold.toLocaleString()}. The 3.8% Net Investment Income Tax applies to your capital gains.
              </p>
            </div>
          )}

          {/* Primary Residence Info */}
          {isPrimaryResidence && assetType === 'property' && (
            <div className="mt-6 p-4 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
              <p className="text-sm font-medium">Primary Residence Exclusion</p>
              <p className="text-xs mt-1">
                Up to ${PRIMARY_RESIDENCE_EXCLUSION[filingStatus].toLocaleString()} of gain excluded from tax if you've lived in the home 2+ years of the last 5 years.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tax Rates Reference */}
      <div className="mx-auto max-w-4xl rounded-2xl bg-muted/50 p-8">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          {TAX_YEAR} Capital Gains Tax Rates
        </h3>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Long-term rates */}
          <div>
            <h4 className="font-medium text-foreground mb-3">Long-Term Rates (held 1+ year)</h4>
            <div className="space-y-2">
              <div className="rounded-xl bg-background p-4 ring-1 ring-border/50">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">0% Rate</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">0%</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Up to ${LONG_TERM_CG_RATES.single[0].threshold.toLocaleString()} (single)
                </p>
              </div>
              <div className="rounded-xl bg-background p-4 ring-1 ring-border/50">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">15% Rate</span>
                  <span className="font-bold text-foreground">15%</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  ${LONG_TERM_CG_RATES.single[0].threshold.toLocaleString()} - ${LONG_TERM_CG_RATES.single[1].threshold.toLocaleString()} (single)
                </p>
              </div>
              <div className="rounded-xl bg-background p-4 ring-1 ring-border/50">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">20% Rate</span>
                  <span className="font-bold text-foreground">20%</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Over ${LONG_TERM_CG_RATES.single[1].threshold.toLocaleString()} (single)
                </p>
              </div>
            </div>
          </div>

          {/* Short-term & NIIT */}
          <div>
            <h4 className="font-medium text-foreground mb-3">Short-Term & Additional Taxes</h4>
            <div className="space-y-2">
              <div className="rounded-xl bg-background p-4 ring-1 ring-border/50">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Short-Term Rate</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">10-37%</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Taxed as ordinary income (your marginal tax rate)
                </p>
              </div>
              <div className="rounded-xl bg-background p-4 ring-1 ring-border/50">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">NIIT (high earners)</span>
                  <span className="font-bold text-foreground">+3.8%</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Income over ${NIIT_THRESHOLD.single.toLocaleString()} (single) / ${NIIT_THRESHOLD.married_jointly.toLocaleString()} (married)
                </p>
              </div>
              <div className="rounded-xl bg-background p-4 ring-1 ring-border/50">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Primary Home Exclusion</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">Up to $500k</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  ${PRIMARY_RESIDENCE_EXCLUSION.single.toLocaleString()} single / ${PRIMARY_RESIDENCE_EXCLUSION.married_jointly.toLocaleString()} married
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mt-4">
          Capital gains "stack" on top of ordinary income. Your tax rate depends on your total taxable income.
          State taxes may also apply depending on your state of residence.
        </p>
      </div>
    </div>
  )
}
