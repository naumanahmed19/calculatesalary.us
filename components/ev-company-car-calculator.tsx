'use client'

import { useState } from 'react'
import { calculateSalary, formatCurrency, TAX_YEAR } from '@/lib/us-tax-calculator'
import { Car, Zap, Fuel, PoundSterling } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface EVCompanyCarCalculatorProps {
  initialSalary?: number
  initialP11D?: number
}

// BIK rates for 2025/26
const BIK_RATES = {
  // Electric vehicles
  ev_0: 3, // 0g/km CO2 (pure EV)
  // Hybrids
  hybrid_1_50_130: 5, // 1-50g/km, 130+ mile range
  hybrid_1_50_70: 8, // 1-50g/km, 70-129 mile range
  hybrid_1_50_40: 12, // 1-50g/km, 40-69 mile range
  hybrid_1_50_30: 14, // 1-50g/km, 30-39 mile range
  hybrid_1_50_under30: 15, // 1-50g/km, under 30 miles
  // Petrol/Diesel
  petrol_51_54: 16,
  petrol_55_59: 17,
  petrol_60_64: 18,
  petrol_65_69: 19,
  petrol_70_74: 20,
  petrol_75_79: 21,
  petrol_80_84: 22,
  petrol_85_89: 23,
  petrol_90_94: 24,
  petrol_95_99: 25,
  petrol_100_104: 26,
  petrol_105_109: 27,
  petrol_110_114: 28,
  petrol_115_119: 29,
  petrol_120_124: 30,
  petrol_125_129: 31,
  petrol_130_134: 32,
  petrol_135_139: 33,
  petrol_140_144: 34,
  petrol_145_149: 35,
  petrol_150_154: 36,
  petrol_155_plus: 37,
}

export function EVCompanyCarCalculator({ initialSalary = 50000, initialP11D = 40000 }: EVCompanyCarCalculatorProps) {
  const [annualSalary, setAnnualSalary] = useState(initialSalary)
  const [carValue, setCarValue] = useState(initialP11D)
  const [carType, setCarType] = useState<'ev' | 'hybrid' | 'petrol'>('ev')
  const [co2Emissions, setCo2Emissions] = useState(0)
  const [electricRange, setElectricRange] = useState(0)
  const [fuelType, setFuelType] = useState<'petrol' | 'diesel'>('petrol')

  // Determine BIK rate
  const getBIKRate = (): number => {
    if (carType === 'ev') {
      return BIK_RATES.ev_0
    }

    if (carType === 'hybrid') {
      if (co2Emissions <= 50) {
        if (electricRange >= 130) return BIK_RATES.hybrid_1_50_130
        if (electricRange >= 70) return BIK_RATES.hybrid_1_50_70
        if (electricRange >= 40) return BIK_RATES.hybrid_1_50_40
        if (electricRange >= 30) return BIK_RATES.hybrid_1_50_30
        return BIK_RATES.hybrid_1_50_under30
      }
    }

    // Petrol/Diesel rates based on CO2
    // Add 4% supplement for diesel (capped at 37%)
    let rate = 16 // Base rate for 51-54g/km
    if (co2Emissions >= 155) rate = 37
    else if (co2Emissions >= 150) rate = 36
    else if (co2Emissions >= 145) rate = 35
    else if (co2Emissions >= 140) rate = 34
    else if (co2Emissions >= 135) rate = 33
    else if (co2Emissions >= 130) rate = 32
    else if (co2Emissions >= 125) rate = 31
    else if (co2Emissions >= 120) rate = 30
    else if (co2Emissions >= 115) rate = 29
    else if (co2Emissions >= 110) rate = 28
    else if (co2Emissions >= 105) rate = 27
    else if (co2Emissions >= 100) rate = 26
    else if (co2Emissions >= 95) rate = 25
    else if (co2Emissions >= 90) rate = 24
    else if (co2Emissions >= 85) rate = 23
    else if (co2Emissions >= 80) rate = 22
    else if (co2Emissions >= 75) rate = 21
    else if (co2Emissions >= 70) rate = 20
    else if (co2Emissions >= 65) rate = 19
    else if (co2Emissions >= 60) rate = 18
    else if (co2Emissions >= 55) rate = 17
    else rate = 16

    // Diesel supplement (max 37%)
    if (fuelType === 'diesel') {
      rate = Math.min(37, rate + 4)
    }

    return rate
  }

  const bikRate = getBIKRate()
  const bikValue = (carValue * bikRate) / 100

  // Calculate tax on benefit
  const result = calculateSalary({
    baseSalary: annualSalary,
    bonus: 0,
    cashAllowances: 0,
    pensionContribution: 0,
    studentLoan: 'none',
  })

  // Determine tax rate
  const taxRate = annualSalary > 125140 ? 0.45 : annualSalary > 50270 ? 0.40 : 0.20
  const taxOnBenefit = bikValue * taxRate
  const monthlyTax = taxOnBenefit / 12

  // NI on company car (no employee NI on benefits, but for reference)
  const employerNI = bikValue * 0.138

  // Compare with EV if currently petrol
  const evBikValue = (carValue * BIK_RATES.ev_0) / 100
  const evTaxOnBenefit = evBikValue * taxRate
  const savingsVsEV = carType !== 'ev' ? taxOnBenefit - evTaxOnBenefit : 0

  return (
    <div className="space-y-8">
      {/* Two Panel Calculator */}
      <div className="mx-auto max-w-lg grid grid-cols-1 items-start gap-y-6 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
        {/* Input Panel - Left */}
        <div className="rounded-3xl rounded-t-3xl sm:rounded-b-none lg:rounded-tr-none lg:rounded-bl-3xl bg-card/60 dark:bg-card/40 p-8 ring-1 ring-border/50 sm:p-10 sm:mx-8 lg:mx-0">
          <h3 className="text-base/7 font-semibold text-accent flex items-center gap-2">
            <Car className="h-5 w-5" />
            Company Car Details
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Calculate Benefit in Kind tax for {TAX_YEAR}
          </p>

          <div className="mt-8 space-y-6">
            {/* Annual Salary */}
            <div className="space-y-2">
              <Label htmlFor="salary">Your Annual Salary</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-medium text-muted-foreground">£</span>
                <Input
                  id="salary"
                  type="number"
                  value={annualSalary}
                  onChange={(e) => setAnnualSalary(parseFloat(e.target.value) || 0)}
                  step={1000}
                  min={0}
                  className="pl-9 h-12 text-lg font-semibold bg-background border-border"
                />
              </div>
            </div>

            {/* Car List Price */}
            <div className="space-y-2">
              <Label htmlFor="carValue">Car List Price (P11D value)</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-medium text-muted-foreground">£</span>
                <Input
                  id="carValue"
                  type="number"
                  value={carValue}
                  onChange={(e) => setCarValue(parseFloat(e.target.value) || 0)}
                  step={1000}
                  min={0}
                  className="pl-9 h-12 text-lg font-semibold bg-background border-border"
                />
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {[30000, 40000, 50000, 60000, 80000].map((price) => (
                  <button
                    key={price}
                    type="button"
                    onClick={() => setCarValue(price)}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                      carValue === price
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    £{(price / 1000)}k
                  </button>
                ))}
              </div>
            </div>

            {/* Car Type */}
            <div className="space-y-2">
              <Label>Car Type</Label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => { setCarType('ev'); setCo2Emissions(0); }}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl ring-1 transition-all ${
                    carType === 'ev'
                      ? 'bg-emerald-600/10 ring-emerald-600/50 text-emerald-600 dark:text-emerald-400'
                      : 'bg-card ring-border hover:ring-border/80'
                  }`}
                >
                  <Zap className="h-4 w-4" />
                  <span className="text-sm font-medium">Electric</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCarType('hybrid')}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl ring-1 transition-all ${
                    carType === 'hybrid'
                      ? 'bg-accent/10 ring-accent/50 text-accent'
                      : 'bg-card ring-border hover:ring-border/80'
                  }`}
                >
                  <span className="text-sm font-medium">Hybrid</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCarType('petrol')}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl ring-1 transition-all ${
                    carType === 'petrol'
                      ? 'bg-amber-500/10 ring-amber-500/50 text-amber-600 dark:text-amber-400'
                      : 'bg-card ring-border hover:ring-border/80'
                  }`}
                >
                  <Fuel className="h-4 w-4" />
                  <span className="text-sm font-medium">Petrol/Diesel</span>
                </button>
              </div>
            </div>

            {/* CO2 Emissions (for hybrid/petrol) */}
            {carType !== 'ev' && (
              <div className="space-y-2">
                <Label htmlFor="co2">CO2 Emissions (g/km)</Label>
                <Input
                  id="co2"
                  type="number"
                  value={co2Emissions}
                  onChange={(e) => setCo2Emissions(parseInt(e.target.value) || 0)}
                  min={0}
                  max={300}
                  className="h-12 text-lg font-semibold bg-background border-border"
                />
              </div>
            )}

            {/* Electric Range (for hybrid) */}
            {carType === 'hybrid' && (
              <div className="space-y-2">
                <Label htmlFor="range">Electric Range (miles)</Label>
                <Input
                  id="range"
                  type="number"
                  value={electricRange}
                  onChange={(e) => setElectricRange(parseInt(e.target.value) || 0)}
                  min={0}
                  max={200}
                  className="h-12 text-lg font-semibold bg-background border-border"
                />
              </div>
            )}

            {/* Fuel Type (for petrol/diesel) */}
            {carType === 'petrol' && (
              <div className="space-y-2">
                <Label>Fuel Type</Label>
                <Select value={fuelType} onValueChange={(v) => setFuelType(v as 'petrol' | 'diesel')}>
                  <SelectTrigger className="h-12 text-lg font-semibold bg-background border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="petrol">Petrol</SelectItem>
                    <SelectItem value="diesel">Diesel (+4% supplement)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>

        {/* Results Panel - Right */}
        <div className="rounded-3xl bg-accent/5 dark:bg-accent/10 p-8 ring-1 ring-accent/20 sm:p-10 sm:mx-8 lg:mx-0">
          <h3 className="text-base/7 font-semibold text-accent flex items-center gap-2">
            <PoundSterling className="h-5 w-5" />
            Your BIK Tax
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {bikRate}% BIK rate • {taxRate * 100}% tax bracket
          </p>

          <div className="mt-8 space-y-6">
            {/* Annual Tax */}
            <div className="text-center py-4">
              <div className="text-4xl font-bold text-foreground">
                {formatCurrency(taxOnBenefit, 0)}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Annual Tax on Company Car
              </div>
            </div>

            {/* Monthly Breakdown */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-card/60 dark:bg-card/40 p-4 ring-1 ring-border/50">
                <div className="text-xs text-muted-foreground mb-1">Monthly Tax</div>
                <div className="text-xl font-bold text-foreground">
                  {formatCurrency(monthlyTax)}
                </div>
              </div>
              <div className="rounded-xl bg-card/60 dark:bg-card/40 p-4 ring-1 ring-border/50">
                <div className="text-xs text-muted-foreground mb-1">BIK Value</div>
                <div className="text-xl font-bold text-foreground">
                  {formatCurrency(bikValue, 0)}
                </div>
              </div>
            </div>

            {/* Calculation Details */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Car List Price</span>
                <span className="font-medium">{formatCurrency(carValue, 0)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">BIK Rate</span>
                <span className="font-medium">{bikRate}%</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Taxable Benefit</span>
                <span className="font-medium">{formatCurrency(bikValue, 0)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Your Tax Rate</span>
                <span className="font-medium">{taxRate * 100}%</span>
              </div>
            </div>

            {/* EV Comparison */}
            {carType !== 'ev' && (
              <div className="rounded-xl bg-emerald-600/10 dark:bg-emerald-500/10 p-4 ring-1 ring-emerald-600/20 dark:ring-emerald-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-sm font-medium text-foreground">Switch to Electric?</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  An equivalent EV would only cost {formatCurrency(evTaxOnBenefit, 0)}/year in tax.
                  You&apos;d save {formatCurrency(savingsVsEV, 0)} annually ({bikRate - BIK_RATES.ev_0}% lower BIK rate).
                </div>
              </div>
            )}

            {/* EV Benefit */}
            {carType === 'ev' && (
              <div className="rounded-xl bg-emerald-600/10 dark:bg-emerald-500/10 p-4 ring-1 ring-emerald-600/20 dark:ring-emerald-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-sm font-medium text-foreground">Great Choice!</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Electric vehicles have the lowest BIK rate at just {BIK_RATES.ev_0}%.
                  A petrol car of the same value could cost over {formatCurrency((carValue * 0.30) * taxRate, 0)}/year more in tax.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
