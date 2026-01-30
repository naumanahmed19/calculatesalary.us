'use client'

import {
  CalculatorLayout,
  CurrencyInput,
  InputPanel,
  PercentInput,
  QuickSelect,
  ResultCard,
  ResultRow,
  ResultsPanel,
  ResultValue,
} from '@/components/ui/calculator-panel'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { calculateSalary, formatCurrency, TAX_YEAR } from '@/lib/us-tax-calculator'
import { Home, DollarSign } from 'lucide-react'
import { useState } from 'react'

interface MortgageAffordabilityCalculatorProps {
  initialSalary?: number
}

export function MortgageAffordabilityCalculator({ initialSalary = 75000 }: MortgageAffordabilityCalculatorProps) {
  const [annualSalary, setAnnualSalary] = useState(initialSalary)
  const [partnerSalary, setPartnerSalary] = useState(0)
  const [deposit, setDeposit] = useState(50000)
  const [interestRate, setInterestRate] = useState(6.5)
  const [mortgageTerm, setMortgageTerm] = useState(30)

  // Calculate combined income
  const combinedIncome = annualSalary + partnerSalary

  // Standard mortgage multipliers (US lenders typically use 3-4x income, but DTI ratios matter more)
  const conservativeMultiple = 3
  const standardMultiple = 3.5
  const maxMultiple = 4

  // Maximum borrowing amounts
  const conservativeBorrowing = combinedIncome * conservativeMultiple
  const standardBorrowing = combinedIncome * standardMultiple
  const maxBorrowing = combinedIncome * maxMultiple

  // Maximum property prices (borrowing + deposit)
  const conservativeProperty = conservativeBorrowing + deposit
  const standardProperty = standardBorrowing + deposit
  const maxProperty = maxBorrowing + deposit

  // Calculate monthly mortgage payment
  const calculateMonthlyPayment = (principal: number, rate: number, years: number) => {
    const monthlyRate = rate / 100 / 12
    const numPayments = years * 12
    if (monthlyRate === 0) return principal / numPayments
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
           (Math.pow(1 + monthlyRate, numPayments) - 1)
  }

  const monthlyPaymentStandard = calculateMonthlyPayment(standardBorrowing, interestRate, mortgageTerm)

  // Calculate take-home pay
  const result = calculateSalary({
    grossSalary: annualSalary,
    filingStatus: 'single',
    state: 'TX',
  })

  // Monthly affordability check
  const monthlyTakeHome = result.monthly.takeHomePay
  const affordabilityRatioStandard = (monthlyPaymentStandard / monthlyTakeHome) * 100

  // LTV calculation
  const ltv = (standardBorrowing / standardProperty) * 100

  // DTI calculation (debt-to-income)
  const monthlyGrossIncome = annualSalary / 12
  const dti = (monthlyPaymentStandard / monthlyGrossIncome) * 100

  // Quick select options
  const salaryOptions = [50000, 75000, 100000, 125000, 150000, 200000].map(v => ({ value: v, label: `$${v/1000}k` }))
  const depositOptions = [25000, 50000, 75000, 100000, 150000].map(v => ({ value: v, label: `$${v/1000}k` }))
  const termOptions = [15, 20, 25, 30].map(v => ({ value: v, label: `${v} yrs` }))

  return (
    <CalculatorLayout>
      {/* Input Panel */}
      <InputPanel
        icon={DollarSign}
        title="Your Income Details"
        description={`Calculate how much you can borrow for ${TAX_YEAR}`}
      >
        {/* Annual Salary Input */}
        <div className="space-y-2">
          <Label htmlFor="annualSalary">Your Annual Salary</Label>
          <CurrencyInput
            id="annualSalary"
            value={annualSalary}
            onChange={setAnnualSalary}
          />
          <QuickSelect
            options={salaryOptions}
            selected={annualSalary}
            onSelect={setAnnualSalary}
          />
        </div>

        {/* Partner Salary */}
        <div className="space-y-2">
          <Label htmlFor="partnerSalary">Partner&apos;s Annual Salary (optional)</Label>
          <CurrencyInput
            id="partnerSalary"
            value={partnerSalary}
            onChange={setPartnerSalary}
          />
        </div>

        {/* Deposit */}
        <div className="space-y-2">
          <Label htmlFor="deposit">Down Payment Available</Label>
          <CurrencyInput
            id="deposit"
            value={deposit}
            onChange={setDeposit}
            step={5000}
          />
          <QuickSelect
            options={depositOptions}
            selected={deposit}
            onSelect={setDeposit}
          />
        </div>

        {/* Interest Rate */}
        <div className="space-y-2">
          <Label htmlFor="interestRate">Interest Rate (%)</Label>
          <PercentInput
            id="interestRate"
            value={interestRate}
            onChange={setInterestRate}
            step={0.1}
            max={15}
          />
        </div>

        {/* Mortgage Term */}
        <div className="space-y-2">
          <Label htmlFor="mortgageTerm">Mortgage Term (years)</Label>
          <Input
            id="mortgageTerm"
            type="number"
            value={mortgageTerm}
            onChange={(e) => setMortgageTerm(parseInt(e.target.value) || 30)}
            min={5}
            max={40}
            className="h-12 text-lg font-semibold bg-background border-border"
          />
          <QuickSelect
            options={termOptions}
            selected={mortgageTerm}
            onSelect={setMortgageTerm}
          />
        </div>
      </InputPanel>

      {/* Results Panel */}
      <ResultsPanel
        icon={Home}
        minHeight='900px'
        title="What You Could Afford"
        description={`Based on ${formatCurrency(combinedIncome, 0)} combined income`}
      >
        {/* Maximum Property Value */}
        <ResultValue
          value={formatCurrency(standardProperty, 0)}
          label="Maximum Home Price (3.5x)"
        />

        {/* Borrowing Breakdown */}
        <ResultCard variant="success">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-xs text-muted-foreground mb-1">You Could Borrow</div>
              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(standardBorrowing, 0)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-muted-foreground mb-1">Monthly Payment</div>
              <div className="text-lg font-semibold text-foreground">
                {formatCurrency(monthlyPaymentStandard)}
              </div>
            </div>
          </div>
        </ResultCard>

        {/* Range of Estimates */}
        <div className="space-y-2 text-sm">
          <ResultRow label="Conservative (3x)" value={formatCurrency(conservativeProperty, 0)} />
          <ResultRow label="Standard (3.5x)" value={formatCurrency(standardProperty, 0)} valueClassName="text-accent" />
          <ResultRow label="Maximum (4x)" value={formatCurrency(maxProperty, 0)} />
          <ResultRow label="Down Payment" value={formatCurrency(deposit, 0)} valueClassName="text-emerald-600 dark:text-emerald-400" showBorder={false} />
        </div>

        {/* Affordability Check */}
        <ResultCard variant="accent">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-sm font-medium text-foreground">Loan-to-Value (LTV)</div>
              <div className="text-xs text-muted-foreground">20% down avoids PMI</div>
            </div>
            <div className="text-xl font-bold text-accent">
              {ltv.toFixed(0)}%
            </div>
          </div>
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-sm font-medium text-foreground">DTI Ratio</div>
              <div className="text-xs text-muted-foreground">Debt-to-income (housing)</div>
            </div>
            <div className={`text-xl font-bold ${dti <= 28 ? 'text-emerald-600 dark:text-emerald-400' : dti <= 36 ? 'text-amber-600 dark:text-amber-400' : 'text-destructive'}`}>
              {dti.toFixed(0)}%
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-foreground">% of Take-Home</div>
              <div className="text-xs text-muted-foreground">Mortgage vs net income</div>
            </div>
            <div className={`text-xl font-bold ${affordabilityRatioStandard <= 30 ? 'text-emerald-600 dark:text-emerald-400' : affordabilityRatioStandard <= 40 ? 'text-amber-600 dark:text-amber-400' : 'text-destructive'}`}>
              {affordabilityRatioStandard.toFixed(0)}%
            </div>
          </div>
        </ResultCard>

        {dti > 28 && (
          <p className="text-xs text-muted-foreground">
            US lenders typically prefer a housing DTI under 28% and total DTI under 36%. Qualified mortgages allow up to 43%.
          </p>
        )}
      </ResultsPanel>
    </CalculatorLayout>
  )
}
