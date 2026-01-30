'use client'

import {
  CalculatorLayout,
  CurrencyInput,
  InputPanel,
  ResultRow,
  ResultsPanel,
} from '@/components/ui/calculator-panel'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { calculateEquivalentSalary, formatUSD, getAllCities } from '@/lib/cost-of-living'
import { ArrowRight, Calculator, Equal, MapPin, TrendingDown, TrendingUp, Wallet } from 'lucide-react'
import { useMemo, useState } from 'react'

export function CostOfLivingCalculator() {
  const [salary, setSalary] = useState<number>(75000)
  const [fromCity, setFromCity] = useState<string>('new-york')
  const [toCity, setToCity] = useState<string>('austin')

  const allCities = useMemo(() => getAllCities(), [])

  const fromCityData = useMemo(() =>
    allCities.find(c => c.slug === fromCity),
    [allCities, fromCity]
  )

  const toCityData = useMemo(() =>
    allCities.find(c => c.slug === toCity),
    [allCities, toCity]
  )

  const equivalentSalary = useMemo(() => {
    if (!fromCityData || !toCityData || !salary) return salary
    return calculateEquivalentSalary(salary, fromCity, toCity)
  }, [salary, fromCity, toCity, fromCityData, toCityData])

  const difference = equivalentSalary - salary
  const percentDiff = salary ? Math.round((difference / salary) * 100) : 0
  const costDiff = toCityData && fromCityData ? toCityData.costIndex - fromCityData.costIndex : 0

  // Group cities by country for better UX
  const citiesByCountry = useMemo(() => {
    const grouped: Record<string, typeof allCities> = {}
    allCities.forEach(city => {
      if (!grouped[city.country]) grouped[city.country] = []
      grouped[city.country].push(city)
    })
    return grouped
  }, [allCities])

  return (
    <div className="space-y-8">
      <CalculatorLayout>
        {/* Input Panel */}
        <InputPanel
          icon={MapPin}
          title="Compare Locations"
          description="Calculate your equivalent salary in another city"
        >
          {/* Salary Input */}
          <div className="space-y-2">
            <Label htmlFor="salary" className="text-sm font-medium">
              Your Annual Salary
            </Label>
            <CurrencyInput
              id="salary"
              value={salary}
              onChange={setSalary}
            />
          </div>

          {/* From City */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Current City</Label>
            <Select value={fromCity} onValueChange={setFromCity}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(citiesByCountry).map(([country, cities]) => (
                  <div key={country}>
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                      {country}
                    </div>
                    {cities.map(city => (
                      <SelectItem key={city.slug} value={city.slug}>
                        {city.name} ({city.costIndex})
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
            {fromCityData && (
              <p className="text-xs text-muted-foreground">
                Cost Index: {fromCityData.costIndex} • {fromCityData.country}
              </p>
            )}
          </div>

          {/* To City */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Target City</Label>
            <Select value={toCity} onValueChange={setToCity}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(citiesByCountry).map(([country, cities]) => (
                  <div key={country}>
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                      {country}
                    </div>
                    {cities.map(city => (
                      <SelectItem key={city.slug} value={city.slug}>
                        {city.name} ({city.costIndex})
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
            {toCityData && (
              <p className="text-xs text-muted-foreground">
                Cost Index: {toCityData.costIndex} • {toCityData.country}
              </p>
            )}
          </div>
        </InputPanel>

        {/* Results Panel */}
        <ResultsPanel
          icon={Wallet}
          title="Equivalent Salary"
          description="To maintain the same standard of living"
          minHeight='600px'
        >
          <div>
            <div className="flex items-baseline gap-2">
              <span className={`text-5xl font-bold tracking-tight ${
                difference < 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : difference > 0
                    ? 'text-accent'
                    : 'text-accent'
              }`}>
                {formatUSD(equivalentSalary)}
              </span>
              <span className="text-lg text-muted-foreground">/year</span>
            </div>

            <div className="mt-2 flex items-center gap-4 text-sm">
              <span className="text-muted-foreground">
                {formatUSD(Math.round(equivalentSalary / 12))}/month
              </span>
              <span className="text-muted-foreground">
                {formatUSD(Math.round(equivalentSalary / 52))}/week
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <ResultRow
              label="Current Salary"
              value={formatUSD(salary)}
            />
            <ResultRow
              label="Salary Difference"
              value={`${difference >= 0 ? '+' : ''}${formatUSD(difference)}`}
              valueClassName={
                difference < 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : difference > 0
                    ? 'text-rose-600 dark:text-rose-400'
                    : ''
              }
            />
            <ResultRow
              label="Percentage Change"
              value={`${percentDiff >= 0 ? '+' : ''}${percentDiff}%`}
              valueClassName={
                percentDiff < 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : percentDiff > 0
                    ? 'text-rose-600 dark:text-rose-400'
                    : ''
              }
            />
            <ResultRow
              label="Cost of Living"
              value={
                costDiff < 0
                  ? `${Math.abs(costDiff)}% cheaper`
                  : costDiff > 0
                    ? `${costDiff}% more expensive`
                    : 'Same cost'
              }
              valueClassName={
                costDiff < 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : costDiff > 0
                    ? 'text-rose-600 dark:text-rose-400'
                    : ''
              }
              showBorder={false}
            />
          </div>
        </ResultsPanel>
      </CalculatorLayout>

      {/* Comparison Visual */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <ArrowRight className="h-5 w-5 text-accent" />
            City Comparison
          </h3>

          <div className="grid md:grid-cols-3 gap-6 items-center">
            {/* From City Card */}
            <div className="space-y-4">
              <h4 className="font-medium text-muted-foreground uppercase text-xs tracking-wider">
                {fromCityData?.name || 'Current City'}
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Salary</span>
                  <span className="font-medium">{formatUSD(salary)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Cost Index</span>
                  <span className="font-medium">{fromCityData?.costIndex || 100}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Rent Index</span>
                  <span className="font-medium">{fromCityData?.rentIndex || 100}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Avg Salary</span>
                  <span className="font-medium">{formatUSD(fromCityData?.averageNetSalaryUSD || 0)}</span>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex justify-center items-center">
              <div className="rounded-full bg-accent/10 p-4">
                <ArrowRight className="h-8 w-8 text-accent" />
              </div>
            </div>

            {/* To City Card */}
            <div className="space-y-4">
              <h4 className="font-medium text-accent uppercase text-xs tracking-wider">
                {toCityData?.name || 'Target City'}
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Equivalent</span>
                  <div className="text-right">
                    <span className={`font-medium ${
                      difference < 0
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : difference > 0
                          ? 'text-rose-600 dark:text-rose-400'
                          : 'text-foreground'
                    }`}>{formatUSD(equivalentSalary)}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Cost Index</span>
                  <span className="font-medium">{toCityData?.costIndex || 100}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Rent Index</span>
                  <span className="font-medium">{toCityData?.rentIndex || 100}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Avg Salary</span>
                  <span className="font-medium">{formatUSD(toCityData?.averageNetSalaryUSD || 0)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Banner */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className={`rounded-xl p-4 ${
              difference < 0
                ? 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800'
                : difference > 0
                  ? 'bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800'
                  : 'bg-muted/50 border border-border'
            }`}>
              <div className="flex items-center gap-3">
                {difference < 0 ? (
                  <TrendingDown className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : difference > 0 ? (
                  <TrendingUp className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0" />
                ) : (
                  <Equal className="h-5 w-5 text-muted-foreground shrink-0" />
                )}
                <div>
                  {difference < 0 ? (
                    <p className="text-sm text-emerald-700 dark:text-emerald-300">
                      <strong>Good news!</strong> You&apos;d need <strong>{formatUSD(Math.abs(difference))} less</strong> ({Math.abs(percentDiff)}% lower) in {toCityData?.name} to maintain your lifestyle.
                    </p>
                  ) : difference > 0 ? (
                    <p className="text-sm text-rose-700 dark:text-rose-300">
                      You&apos;d need <strong>{formatUSD(difference)} more</strong> ({percentDiff}% higher) in {toCityData?.name} to maintain the same standard of living.
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Both cities have <strong>similar costs</strong> - your salary would remain about the same.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown Cards */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-card rounded-2xl border border-border p-6">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Calculator className="h-5 w-5 text-accent" />
            Salary Breakdown
          </h3>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-muted/50 rounded-xl p-4">
              <div className="text-sm text-muted-foreground mb-1">Yearly</div>
              <div className="font-semibold text-xl text-foreground">{formatUSD(equivalentSalary)}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {difference !== 0 && (
                  <span className={difference < 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                    {difference >= 0 ? '+' : ''}{formatUSD(difference)}
                  </span>
                )}
              </div>
            </div>
            <div className="bg-muted/50 rounded-xl p-4">
              <div className="text-sm text-muted-foreground mb-1">Monthly</div>
              <div className="font-semibold text-xl text-foreground">{formatUSD(Math.round(equivalentSalary / 12))}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {difference !== 0 && (
                  <span className={difference < 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                    {difference >= 0 ? '+' : ''}{formatUSD(Math.round(difference / 12))}
                  </span>
                )}
              </div>
            </div>
            <div className="bg-muted/50 rounded-xl p-4">
              <div className="text-sm text-muted-foreground mb-1">Weekly</div>
              <div className="font-semibold text-xl text-foreground">{formatUSD(Math.round(equivalentSalary / 52))}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {difference !== 0 && (
                  <span className={difference < 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                    {difference >= 0 ? '+' : ''}{formatUSD(Math.round(difference / 52))}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
