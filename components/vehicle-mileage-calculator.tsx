'use client'

import { useState, useMemo } from 'react'
import { formatCurrency, TAX_YEAR } from '@/lib/us-tax-calculator'
import { type FilingStatus } from '@/lib/us-tax-config'
import { Car, DollarSign, Calculator, Fuel } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface VehicleMileageCalculatorProps {
  initialMiles?: number
}

// IRS Standard Mileage Rates for 2025
const MILEAGE_RATES = {
  business: 0.70, // 70 cents per mile for business
  medical: 0.21, // 21 cents per mile for medical/moving
  charity: 0.14, // 14 cents per mile for charity
}

export function VehicleMileageCalculator({ initialMiles = 10000 }: VehicleMileageCalculatorProps) {
  const [businessMiles, setBusinessMiles] = useState(initialMiles)
  const [medicalMiles, setMedicalMiles] = useState(0)
  const [charityMiles, setCharityMiles] = useState(0)
  const [filingStatus, setFilingStatus] = useState<FilingStatus>('single')
  const [annualIncome, setAnnualIncome] = useState(75000)
  const [calculationMethod, setCalculationMethod] = useState<'standard' | 'actual'>('standard')

  // Actual expense inputs
  const [gasExpenses, setGasExpenses] = useState(3000)
  const [insurance, setInsurance] = useState(1500)
  const [maintenance, setMaintenance] = useState(1000)
  const [depreciation, setDepreciation] = useState(3000)
  const [totalMiles, setTotalMiles] = useState(15000)

  const calculation = useMemo(() => {
    // Standard mileage method
    const businessDeduction = businessMiles * MILEAGE_RATES.business
    const medicalDeduction = medicalMiles * MILEAGE_RATES.medical
    const charityDeduction = charityMiles * MILEAGE_RATES.charity
    const totalStandardDeduction = businessDeduction + medicalDeduction + charityDeduction

    // Actual expense method
    const totalActualExpenses = gasExpenses + insurance + maintenance + depreciation
    const businessPercentage = totalMiles > 0 ? (businessMiles / totalMiles) * 100 : 0
    const actualBusinessDeduction = (totalActualExpenses * businessPercentage) / 100

    // Which method is better?
    const bestMethod = actualBusinessDeduction > businessDeduction ? 'actual' : 'standard'
    const bestDeduction = Math.max(businessDeduction, actualBusinessDeduction)

    // Tax savings estimate (assuming marginal rate)
    const marginalRate = annualIncome > 100525 ? 0.24 : annualIncome > 47150 ? 0.22 : annualIncome > 11600 ? 0.12 : 0.10
    const taxSavings = bestDeduction * marginalRate
    const selfEmploymentSavings = bestDeduction * 0.153 // SE tax reduction

    return {
      businessDeduction,
      medicalDeduction,
      charityDeduction,
      totalStandardDeduction,
      actualBusinessDeduction,
      businessPercentage,
      bestMethod,
      bestDeduction,
      taxSavings,
      selfEmploymentSavings,
      marginalRate,
      totalActualExpenses,
    }
  }, [businessMiles, medicalMiles, charityMiles, annualIncome, gasExpenses, insurance, maintenance, depreciation, totalMiles])

  return (
    <div className="space-y-8">
      {/* Two Panel Calculator */}
      <div className="mx-auto max-w-lg grid grid-cols-1 items-start gap-y-6 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
        {/* Input Panel - Left */}
        <div className="rounded-3xl rounded-t-3xl sm:rounded-b-none lg:rounded-tr-none lg:rounded-bl-3xl bg-card/60 dark:bg-card/40 p-8 ring-1 ring-border/50 sm:p-10 sm:mx-8 lg:mx-0">
          <h3 className="text-base/7 font-semibold text-accent flex items-center gap-2">
            <Car className="h-5 w-5" />
            Vehicle Mileage Deduction
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Calculate your {TAX_YEAR} mileage deduction
          </p>

          <div className="mt-8 space-y-6">
            {/* Method Selection */}
            <div className="space-y-2">
              <Label>Calculation Method</Label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCalculationMethod('standard')}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl ring-1 transition-all ${
                    calculationMethod === 'standard'
                      ? 'bg-accent/10 ring-accent/50 text-accent'
                      : 'bg-card ring-border hover:ring-border/80'
                  }`}
                >
                  <Calculator className="h-4 w-4" />
                  <span className="text-sm font-medium">Standard Rate</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCalculationMethod('actual')}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl ring-1 transition-all ${
                    calculationMethod === 'actual'
                      ? 'bg-accent/10 ring-accent/50 text-accent'
                      : 'bg-card ring-border hover:ring-border/80'
                  }`}
                >
                  <Fuel className="h-4 w-4" />
                  <span className="text-sm font-medium">Actual Expenses</span>
                </button>
              </div>
            </div>

            {/* Annual Income */}
            <div className="space-y-2">
              <Label htmlFor="income">Annual Income (for tax rate)</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-medium text-muted-foreground">$</span>
                <Input
                  id="income"
                  type="number"
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(parseFloat(e.target.value) || 0)}
                  step={1000}
                  min={0}
                  className="pl-9 h-12 text-lg font-semibold bg-background border-border"
                />
              </div>
            </div>

            {/* Business Miles */}
            <div className="space-y-2">
              <Label htmlFor="businessMiles">Business Miles Driven</Label>
              <Input
                id="businessMiles"
                type="number"
                value={businessMiles}
                onChange={(e) => setBusinessMiles(parseInt(e.target.value) || 0)}
                min={0}
                className="h-12 text-lg font-semibold bg-background border-border"
              />
              <div className="flex flex-wrap gap-2 pt-1">
                {[5000, 10000, 15000, 20000, 25000].map((miles) => (
                  <button
                    key={miles}
                    type="button"
                    onClick={() => setBusinessMiles(miles)}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                      businessMiles === miles
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {(miles / 1000)}k
                  </button>
                ))}
              </div>
            </div>

            {calculationMethod === 'standard' && (
              <>
                {/* Medical Miles */}
                <div className="space-y-2">
                  <Label htmlFor="medicalMiles">Medical/Moving Miles</Label>
                  <Input
                    id="medicalMiles"
                    type="number"
                    value={medicalMiles}
                    onChange={(e) => setMedicalMiles(parseInt(e.target.value) || 0)}
                    min={0}
                    className="h-10 bg-background border-border"
                  />
                  <p className="text-xs text-muted-foreground">Miles driven for medical care</p>
                </div>

                {/* Charity Miles */}
                <div className="space-y-2">
                  <Label htmlFor="charityMiles">Charity Miles</Label>
                  <Input
                    id="charityMiles"
                    type="number"
                    value={charityMiles}
                    onChange={(e) => setCharityMiles(parseInt(e.target.value) || 0)}
                    min={0}
                    className="h-10 bg-background border-border"
                  />
                  <p className="text-xs text-muted-foreground">Miles driven for charitable work</p>
                </div>
              </>
            )}

            {calculationMethod === 'actual' && (
              <>
                {/* Total Miles */}
                <div className="space-y-2">
                  <Label htmlFor="totalMiles">Total Miles Driven (All Purposes)</Label>
                  <Input
                    id="totalMiles"
                    type="number"
                    value={totalMiles}
                    onChange={(e) => setTotalMiles(parseInt(e.target.value) || 0)}
                    min={0}
                    className="h-10 bg-background border-border"
                  />
                </div>

                {/* Expenses */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gas">Gas & Oil</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                      <Input
                        id="gas"
                        type="number"
                        value={gasExpenses}
                        onChange={(e) => setGasExpenses(parseFloat(e.target.value) || 0)}
                        className="pl-7 h-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="insurance">Insurance</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                      <Input
                        id="insurance"
                        type="number"
                        value={insurance}
                        onChange={(e) => setInsurance(parseFloat(e.target.value) || 0)}
                        className="pl-7 h-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maintenance">Maintenance</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                      <Input
                        id="maintenance"
                        type="number"
                        value={maintenance}
                        onChange={(e) => setMaintenance(parseFloat(e.target.value) || 0)}
                        className="pl-7 h-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="depreciation">Depreciation</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                      <Input
                        id="depreciation"
                        type="number"
                        value={depreciation}
                        onChange={(e) => setDepreciation(parseFloat(e.target.value) || 0)}
                        className="pl-7 h-10"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Results Panel - Right */}
        <div className="rounded-3xl bg-accent/5 dark:bg-accent/10 p-8 ring-1 ring-accent/20 sm:p-10 sm:mx-8 lg:mx-0">
          <h3 className="text-base/7 font-semibold text-accent flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Your Deduction
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {calculation.marginalRate * 100}% marginal tax bracket
          </p>

          <div className="mt-8 space-y-6">
            {/* Total Deduction */}
            <div className="text-center py-4">
              <div className="text-4xl font-bold text-foreground">
                {formatCurrency(calculation.bestDeduction, 0)}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Total Business Deduction
              </div>
            </div>

            {/* Tax Savings */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-emerald-600/10 dark:bg-emerald-500/10 p-4 ring-1 ring-emerald-600/20 dark:ring-emerald-500/20">
                <div className="text-xs text-muted-foreground mb-1">Income Tax Savings</div>
                <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(calculation.taxSavings, 0)}
                </div>
              </div>
              <div className="rounded-xl bg-emerald-600/10 dark:bg-emerald-500/10 p-4 ring-1 ring-emerald-600/20 dark:ring-emerald-500/20">
                <div className="text-xs text-muted-foreground mb-1">SE Tax Savings</div>
                <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(calculation.selfEmploymentSavings, 0)}
                </div>
              </div>
            </div>

            {/* Breakdown by Method */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Standard Mileage ({MILEAGE_RATES.business * 100}¢/mi)</span>
                <span className={`font-medium ${calculation.bestMethod === 'standard' ? 'text-accent' : ''}`}>
                  {formatCurrency(calculation.businessDeduction, 0)}
                </span>
              </div>
              {calculationMethod === 'actual' && (
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">Actual Expenses ({calculation.businessPercentage.toFixed(0)}% business)</span>
                  <span className={`font-medium ${calculation.bestMethod === 'actual' ? 'text-accent' : ''}`}>
                    {formatCurrency(calculation.actualBusinessDeduction, 0)}
                  </span>
                </div>
              )}
              {calculation.medicalDeduction > 0 && (
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">Medical Mileage ({MILEAGE_RATES.medical * 100}¢/mi)</span>
                  <span className="font-medium">{formatCurrency(calculation.medicalDeduction, 0)}</span>
                </div>
              )}
              {calculation.charityDeduction > 0 && (
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground">Charity Mileage ({MILEAGE_RATES.charity * 100}¢/mi)</span>
                  <span className="font-medium">{formatCurrency(calculation.charityDeduction, 0)}</span>
                </div>
              )}
            </div>

            {/* Best Method Recommendation */}
            {calculationMethod === 'actual' && (
              <div className={`rounded-xl p-4 ${calculation.bestMethod === 'actual' ? 'bg-emerald-600/10 ring-1 ring-emerald-600/20' : 'bg-accent/10 ring-1 ring-accent/20'}`}>
                <div className="text-sm font-medium text-foreground mb-1">
                  Recommended: {calculation.bestMethod === 'actual' ? 'Actual Expenses' : 'Standard Mileage'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {calculation.bestMethod === 'actual'
                    ? `Actual expenses save you ${formatCurrency(calculation.actualBusinessDeduction - calculation.businessDeduction, 0)} more than standard mileage.`
                    : `Standard mileage is simpler and saves you ${formatCurrency(calculation.businessDeduction - calculation.actualBusinessDeduction, 0)} more.`
                  }
                </div>
              </div>
            )}

            {/* IRS Rates Info */}
            <div className="rounded-xl bg-card/60 dark:bg-card/40 p-4 ring-1 ring-border/50">
              <div className="text-sm font-medium text-foreground mb-2">{TAX_YEAR} IRS Mileage Rates</div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <div className="text-muted-foreground">Business</div>
                  <div className="font-semibold">{MILEAGE_RATES.business * 100}¢/mi</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Medical</div>
                  <div className="font-semibold">{MILEAGE_RATES.medical * 100}¢/mi</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Charity</div>
                  <div className="font-semibold">{MILEAGE_RATES.charity * 100}¢/mi</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
