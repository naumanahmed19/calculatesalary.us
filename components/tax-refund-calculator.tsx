'use client'

import { useState, useMemo } from 'react'
import { calculateSalary, formatCurrency, TAX_YEAR } from '@/lib/us-tax-calculator'
import { currentTaxConfig, type FilingStatus } from '@/lib/us-tax-config'
import { Receipt, DollarSign, AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  CalculatorLayout,
  CurrencyInput,
  InputPanel,
  ResultCard,
  ResultRow,
  ResultsPanel,
  ResultValue,
} from '@/components/ui/calculator-panel'

interface TaxRefundCalculatorProps {
  initialSalary?: number
}

export function TaxRefundCalculator({ initialSalary = 75000 }: TaxRefundCalculatorProps) {
  const [annualSalary, setAnnualSalary] = useState(initialSalary)
  const [filingStatus, setFilingStatus] = useState<FilingStatus>('single')
  const [state, setState] = useState('TX')
  const [federalWithheld, setFederalWithheld] = useState(0)
  const [stateWithheld, setStateWithheld] = useState(0)
  const [retirement401k, setRetirement401k] = useState(0)
  const [childrenUnder17, setChildrenUnder17] = useState(0)
  const [studentLoanInterest, setStudentLoanInterest] = useState(0)
  const [charitableDonations, setCharitableDonations] = useState(0)

  const calculation = useMemo(() => {
    // Calculate actual tax liability
    const result = calculateSalary({
      grossSalary: annualSalary,
      filingStatus,
      state,
      retirement401k,
    })

    // Child Tax Credit ($2,000 per child under 17, phases out at higher incomes)
    const ctcPhaseOutStart = filingStatus === 'married_jointly' ? 400000 : 200000
    let childTaxCredit = childrenUnder17 * 2000
    if (annualSalary > ctcPhaseOutStart) {
      const reduction = Math.floor((annualSalary - ctcPhaseOutStart) / 1000) * 50
      childTaxCredit = Math.max(0, childTaxCredit - reduction)
    }

    // Student loan interest deduction (up to $2,500, phases out)
    const studentLoanDeduction = Math.min(studentLoanInterest, 2500)
    const studentLoanTaxSavings = studentLoanDeduction * (result.yearly.marginalTaxRate / 100)

    // Charitable donations (if itemizing would be beneficial)
    const standardDeduction = currentTaxConfig.standardDeduction[filingStatus]
    const potentialItemized = charitableDonations // Simplified - just donations
    const itemizingBeneficial = potentialItemized > standardDeduction
    const charitableTaxSavings = itemizingBeneficial
      ? (potentialItemized - standardDeduction) * (result.yearly.marginalTaxRate / 100)
      : 0

    // Total credits and adjustments
    const totalCredits = childTaxCredit
    const totalAdjustments = studentLoanTaxSavings + charitableTaxSavings

    // Actual tax after credits
    const actualFederalTax = Math.max(0, result.yearly.federalTax - totalCredits - totalAdjustments)
    const actualStateTax = result.yearly.stateTax

    // Calculate refund or amount owed
    const federalRefund = federalWithheld - actualFederalTax
    const stateRefund = stateWithheld - actualStateTax
    const totalRefund = federalRefund + stateRefund

    // Estimated withholding if not provided
    const estimatedFederalWithholding = result.yearly.federalTax
    const estimatedStateWithholding = result.yearly.stateTax

    return {
      actualFederalTax,
      actualStateTax,
      federalRefund,
      stateRefund,
      totalRefund,
      childTaxCredit,
      studentLoanTaxSavings,
      charitableTaxSavings,
      totalCredits,
      totalAdjustments,
      estimatedFederalWithholding,
      estimatedStateWithholding,
      marginalRate: result.yearly.marginalTaxRate,
      effectiveRate: annualSalary > 0 ? (actualFederalTax / annualSalary) * 100 : 0,
    }
  }, [annualSalary, filingStatus, state, federalWithheld, stateWithheld, retirement401k, childrenUnder17, studentLoanInterest, charitableDonations])

  // Auto-estimate withholding if user hasn't entered it
  const displayFederalWithheld = federalWithheld || calculation.estimatedFederalWithholding
  const displayStateWithheld = stateWithheld || calculation.estimatedStateWithholding

  return (
    <CalculatorLayout>
      {/* Results Panel */}
      <ResultsPanel
        icon={Receipt}
        title="Your Tax Refund Estimate"
        description={`Based on ${calculation.marginalRate}% marginal rate`}
        position="left"
      >
        {/* Total Refund */}
        <ResultValue
          value={calculation.totalRefund >= 0 ? `+${formatCurrency(calculation.totalRefund, 0)}` : formatCurrency(calculation.totalRefund, 0)}
          label={calculation.totalRefund >= 0 ? "Estimated Refund" : "Estimated Amount Owed"}
          valueClassName={calculation.totalRefund >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}
        />

        {/* Breakdown */}
        <div className="space-y-1">
          <ResultRow
            label="Federal Refund"
            value={calculation.federalRefund >= 0 ? `+${formatCurrency(calculation.federalRefund, 0)}` : formatCurrency(calculation.federalRefund, 0)}
            valueClassName={calculation.federalRefund >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}
          />
          {calculation.stateRefund !== 0 && (
            <ResultRow
              label="State Refund"
              value={calculation.stateRefund >= 0 ? `+${formatCurrency(calculation.stateRefund, 0)}` : formatCurrency(calculation.stateRefund, 0)}
              valueClassName={calculation.stateRefund >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}
            />
          )}
        </div>

        {/* Credits Applied */}
        {(calculation.childTaxCredit > 0 || calculation.studentLoanTaxSavings > 0) && (
          <ResultCard variant="success">
            <div className="text-sm font-medium text-foreground mb-2">Credits & Deductions Applied</div>
            {calculation.childTaxCredit > 0 && (
              <div className="flex justify-between text-xs">
                <span>Child Tax Credit ({childrenUnder17} children)</span>
                <span className="font-semibold">{formatCurrency(calculation.childTaxCredit, 0)}</span>
              </div>
            )}
            {calculation.studentLoanTaxSavings > 0 && (
              <div className="flex justify-between text-xs mt-1">
                <span>Student Loan Interest Savings</span>
                <span className="font-semibold">{formatCurrency(calculation.studentLoanTaxSavings, 0)}</span>
              </div>
            )}
          </ResultCard>
        )}

        {/* Status Message */}
        <ResultCard variant={calculation.totalRefund >= 0 ? 'success' : 'accent'}>
          {calculation.totalRefund >= 0 ? (
            <div>
              <div className="text-sm font-medium text-foreground">You may get a refund!</div>
              <div className="text-xs text-muted-foreground mt-1">
                File your return to claim your refund from the IRS
              </div>
            </div>
          ) : (
            <div>
              <div className="text-sm font-medium text-foreground">You may owe additional taxes</div>
              <div className="text-xs text-muted-foreground mt-1">
                Consider adjusting your W-4 withholding to avoid owing next year
              </div>
            </div>
          )}
        </ResultCard>

        {/* Tax Summary */}
        <ResultCard variant="accent">
          <div className="text-sm font-medium text-foreground">Tax Summary</div>
          <div className="mt-2 space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Effective Federal Rate</span>
              <span className="font-semibold">{calculation.effectiveRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Marginal Rate</span>
              <span className="font-semibold">{calculation.marginalRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Federal Tax Owed</span>
              <span className="font-semibold">{formatCurrency(calculation.actualFederalTax, 0)}</span>
            </div>
          </div>
        </ResultCard>
      </ResultsPanel>

      {/* Input Panel */}
      <InputPanel
        icon={DollarSign}
        title="Your Tax Situation"
        description={`Estimate your ${TAX_YEAR} tax refund`}
        position="right"
      >
        {/* Annual Income */}
        <div className="space-y-2">
          <Label htmlFor="annualSalary">Annual W-2 Income</Label>
          <CurrencyInput
            id="annualSalary"
            value={annualSalary}
            onChange={setAnnualSalary}
            step={1000}
          />
        </div>

        {/* Filing Status */}
        <div className="space-y-2">
          <Label>Filing Status</Label>
          <Select value={filingStatus} onValueChange={(v) => setFilingStatus(v as FilingStatus)}>
            <SelectTrigger className="h-12 text-lg font-semibold bg-background border-border">
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

        {/* State */}
        <div className="space-y-2">
          <Label>State</Label>
          <Select value={state} onValueChange={setState}>
            <SelectTrigger className="h-12 text-lg font-semibold bg-background border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TX">Texas (no state tax)</SelectItem>
              <SelectItem value="FL">Florida (no state tax)</SelectItem>
              <SelectItem value="CA">California</SelectItem>
              <SelectItem value="NY">New York</SelectItem>
              <SelectItem value="WA">Washington (no state tax)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Federal Withheld */}
        <div className="space-y-2">
          <Label htmlFor="federalWithheld">Federal Tax Withheld (from W-2)</Label>
          <CurrencyInput
            id="federalWithheld"
            value={federalWithheld}
            onChange={setFederalWithheld}
            step={100}
          />
          <p className="text-xs text-muted-foreground">Box 2 on your W-2. Leave at 0 to estimate.</p>
        </div>

        {/* 401k Contributions */}
        <div className="space-y-2">
          <Label htmlFor="retirement401k">401(k) Contributions</Label>
          <CurrencyInput
            id="retirement401k"
            value={retirement401k}
            onChange={setRetirement401k}
            step={500}
          />
          <p className="text-xs text-muted-foreground">Pre-tax retirement contributions</p>
        </div>

        {/* Children */}
        <div className="space-y-2">
          <Label htmlFor="children">Children Under 17</Label>
          <Input
            id="children"
            type="number"
            value={childrenUnder17}
            onChange={(e) => setChildrenUnder17(parseInt(e.target.value) || 0)}
            min={0}
            max={10}
            className="h-12 text-lg font-semibold bg-background border-border"
          />
          <p className="text-xs text-muted-foreground">$2,000 Child Tax Credit per child</p>
        </div>

        {/* Student Loan Interest */}
        <div className="space-y-2">
          <Label htmlFor="studentLoan">Student Loan Interest Paid</Label>
          <CurrencyInput
            id="studentLoan"
            value={studentLoanInterest}
            onChange={setStudentLoanInterest}
            step={100}
          />
          <p className="text-xs text-muted-foreground">Deductible up to $2,500</p>
        </div>
      </InputPanel>
    </CalculatorLayout>
  )
}
