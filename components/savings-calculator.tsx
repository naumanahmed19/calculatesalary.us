'use client'

import { useState, useMemo } from 'react'
import { PiggyBank, TrendingUp, Calculator, Coins, Wallet } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  CalculatorLayout,
  InputPanel,
  ResultsPanel,
  ResultValue,
  ResultRow,
  ResultCard,
  StatGrid,
  StatBox,
  QuickSelect,
  CurrencyInput,
  PercentInput,
} from '@/components/ui/calculator-panel'
import {
  calculateSavings,
  formatSavingsCurrency,
  COMMON_MONTHLY_AMOUNTS,
  COMMON_INTEREST_RATES,
  type SavingsInput,
} from '@/lib/savings-calculator'

interface SavingsCalculatorProps {
  initialDeposit?: number
  initialMonthlyContribution?: number
  initialInterestRate?: number
  initialYears?: number
  initialCompoundFrequency?: SavingsInput['compoundFrequency']
}

const QUICK_DEPOSITS = [0, 1000, 5000, 10000, 25000]
const QUICK_MONTHLY = [100, 200, 300, 500, 1000]
const QUICK_RATES = [3, 4, 5, 6, 7]

export function SavingsCalculator({
  initialDeposit = 1000,
  initialMonthlyContribution = 200,
  initialInterestRate = 5,
  initialYears = 10,
  initialCompoundFrequency = 'monthly',
}: SavingsCalculatorProps) {
  const [initialAmount, setInitialAmount] = useState(initialDeposit)
  const [monthlyContribution, setMonthlyContribution] = useState(initialMonthlyContribution)
  const [interestRate, setInterestRate] = useState(initialInterestRate)
  const [years, setYears] = useState(initialYears)
  const [compoundFrequency, setCompoundFrequency] = useState<SavingsInput['compoundFrequency']>(initialCompoundFrequency)

  const result = useMemo(
    () =>
      calculateSavings({
        initialDeposit: initialAmount,
        monthlyContribution,
        annualInterestRate: interestRate,
        years,
        compoundFrequency,
      }),
    [initialAmount, monthlyContribution, interestRate, years, compoundFrequency]
  )

  const interestPercentage = result.totalContributions > 0
    ? (result.totalInterestEarned / result.totalContributions * 100).toFixed(1)
    : '0'

  return (
    <CalculatorLayout align="stretch">
      <InputPanel
        icon={Calculator}
        title="Your Savings Plan"
        description="Enter your savings details to see how your money grows"
        position="left"
      >
        <div>
          <Label htmlFor="initialDeposit" className="mb-2 block">
            Initial Deposit
          </Label>
          <CurrencyInput
            id="initialDeposit"
            value={initialAmount}
            onChange={setInitialAmount}
            step={500}
            min={0}
          />
          <QuickSelect
            options={QUICK_DEPOSITS.map((v) => ({ value: v, label: `$${v.toLocaleString()}` }))}
            selected={initialAmount}
            onSelect={setInitialAmount}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="monthlyContribution" className="mb-2 block">
            Monthly Contribution
          </Label>
          <CurrencyInput
            id="monthlyContribution"
            value={monthlyContribution}
            onChange={setMonthlyContribution}
            step={50}
            min={0}
          />
          <QuickSelect
            options={QUICK_MONTHLY.map((v) => ({ value: v, label: `$${v}` }))}
            selected={monthlyContribution}
            onSelect={setMonthlyContribution}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="interestRate" className="mb-2 block">
            Annual Interest Rate: {interestRate}%
          </Label>
          <Slider
            id="interestRate"
            value={[interestRate]}
            onValueChange={([value]) => setInterestRate(value)}
            min={0}
            max={15}
            step={0.25}
            className="mt-2"
          />
          <QuickSelect
            options={QUICK_RATES.map((v) => ({ value: v, label: `${v}%` }))}
            selected={interestRate}
            onSelect={setInterestRate}
            className="mt-2"
          />
        </div>

        <div>
          <Label htmlFor="years" className="mb-2 block">
            Time Period: {years} {years === 1 ? 'year' : 'years'}
          </Label>
          <Slider
            id="years"
            value={[years]}
            onValueChange={([value]) => setYears(value)}
            min={1}
            max={40}
            step={1}
            className="mt-2"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {[5, 10, 15, 20, 30].map((y) => (
              <button
                key={y}
                onClick={() => setYears(y)}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                  years === y
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {y} years
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="compoundFrequency" className="mb-2 block">
            Compound Frequency
          </Label>
          <Select
            value={compoundFrequency}
            onValueChange={(value) => setCompoundFrequency(value as SavingsInput['compoundFrequency'])}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="annually">Annually</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </InputPanel>

      <ResultsPanel
        icon={TrendingUp}
        title="Your Savings Growth"
        description="See how your savings will grow over time"
        position="right"
      >
        <ResultValue
          value={formatSavingsCurrency(result.finalBalance)}
          label={`Total after ${years} ${years === 1 ? 'year' : 'years'}`}
          valueClassName="text-emerald-600 dark:text-emerald-400"
        />

        <StatGrid>
          <StatBox
            label="Total Contributions"
            value={formatSavingsCurrency(result.totalContributions)}
          />
          <StatBox
            label="Interest Earned"
            value={formatSavingsCurrency(result.totalInterestEarned)}
          />
        </StatGrid>

        <ResultCard variant="success">
          <div className="flex items-center gap-2 mb-2">
            <Coins className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-medium text-emerald-700 dark:text-emerald-300">Interest Bonus</span>
          </div>
          <p className="text-sm text-emerald-800 dark:text-emerald-200">
            You'll earn <strong>{formatSavingsCurrency(result.totalInterestEarned)}</strong> in interest,
            which is <strong>{interestPercentage}%</strong> on top of your contributions.
          </p>
        </ResultCard>

        <div className="space-y-1">
          <ResultRow
            label="Initial deposit"
            value={formatSavingsCurrency(initialAmount)}
          />
          <ResultRow
            label={`Monthly contributions (${years} years)`}
            value={formatSavingsCurrency(monthlyContribution * 12 * years)}
          />
          <ResultRow
            label="Total interest earned"
            value={formatSavingsCurrency(result.totalInterestEarned)}
            valueClassName="text-emerald-600 dark:text-emerald-400"
          />
          <ResultRow
            label="Effective annual rate (APY)"
            value={`${result.effectiveAnnualRate.toFixed(2)}%`}
          />
          <ResultRow
            label="Final balance"
            value={formatSavingsCurrency(result.finalBalance)}
            valueClassName="font-bold text-foreground"
            showBorder={false}
          />
        </div>

        <ResultCard variant="default">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="h-4 w-4 text-accent" />
            <span className="font-medium">Monthly Breakdown</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Monthly contribution</span>
              <div className="font-semibold">{formatSavingsCurrency(monthlyContribution)}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Avg. monthly interest</span>
              <div className="font-semibold text-emerald-600 dark:text-emerald-400">
                +{formatSavingsCurrency(result.totalInterestEarned / (years * 12))}
              </div>
            </div>
          </div>
        </ResultCard>
      </ResultsPanel>
    </CalculatorLayout>
  )
}

// Yearly breakdown table component
export function SavingsBreakdownTable({ result }: { result: ReturnType<typeof calculateSavings> }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 px-2 font-medium text-muted-foreground">Year</th>
            <th className="text-right py-3 px-2 font-medium text-muted-foreground">Start Balance</th>
            <th className="text-right py-3 px-2 font-medium text-muted-foreground">Contributions</th>
            <th className="text-right py-3 px-2 font-medium text-muted-foreground">Interest</th>
            <th className="text-right py-3 px-2 font-medium text-muted-foreground">End Balance</th>
          </tr>
        </thead>
        <tbody>
          {result.yearlyBreakdown.map((row) => (
            <tr key={row.year} className="border-b border-border/50 hover:bg-muted/30">
              <td className="py-3 px-2 font-medium">{row.year}</td>
              <td className="text-right py-3 px-2">{formatSavingsCurrency(row.startBalance)}</td>
              <td className="text-right py-3 px-2">{formatSavingsCurrency(row.contributions)}</td>
              <td className="text-right py-3 px-2 text-emerald-600 dark:text-emerald-400">
                +{formatSavingsCurrency(row.interestEarned)}
              </td>
              <td className="text-right py-3 px-2 font-semibold">{formatSavingsCurrency(row.endBalance)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
