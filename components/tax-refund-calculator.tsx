'use client'

import { useState } from 'react'
import { formatCurrency, TAX_YEAR } from '@/lib/us-tax-calculator'
import { Receipt, PoundSterling, AlertCircle } from 'lucide-react'
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

export function TaxRefundCalculator({ initialSalary = 35000 }: TaxRefundCalculatorProps) {
  const [annualSalary, setAnnualSalary] = useState(initialSalary)
  const [taxCode, setTaxCode] = useState('1257L')
  const [workFromHomeDays, setWorkFromHomeDays] = useState(0)
  const [uniformExpenses, setUniformExpenses] = useState(0)
  const [professionalFees, setProfessionalFees] = useState(0)
  const [mileageClaimable, setMileageClaimable] = useState(0)
  const [pensionNotClaimed, setPensionNotClaimed] = useState(0)
  const [giftAidDonations, setGiftAidDonations] = useState(0)

  // Standard personal allowance
  const PERSONAL_ALLOWANCE = 12570

  // Calculate tax code allowance
  const getTaxCodeAllowance = (code: string): number => {
    const numMatch = code.match(/\d+/)
    if (numMatch) {
      return parseInt(numMatch[0]) * 10
    }
    return PERSONAL_ALLOWANCE
  }

  const actualAllowance = getTaxCodeAllowance(taxCode)
  const expectedAllowance = PERSONAL_ALLOWANCE

  // Tax rate determination
  const getTaxRate = (salary: number): number => {
    if (salary <= 50270) return 0.20
    if (salary <= 125140) return 0.40
    return 0.45
  }

  const taxRate = getTaxRate(annualSalary)

  // Work from home relief (£6/week flat rate)
  const wfhRelief = workFromHomeDays > 0 ? 6 * 52 : 0
  const wfhTaxSaving = wfhRelief * taxRate

  // Uniform/tools allowance (flat rate varies by profession, using £60 as typical)
  const uniformTaxSaving = uniformExpenses * taxRate

  // Professional fees (subscriptions to professional bodies)
  const professionalFeesSaving = professionalFees * taxRate

  // Business mileage (45p per mile first 10,000, 25p after)
  const mileageTaxSaving = mileageClaimable * taxRate

  // Pension contributions (higher rate only)
  const pensionAdditionalRelief = taxRate > 0.20 ? pensionNotClaimed * (taxRate - 0.20) : 0

  // Gift Aid (higher rate relief)
  const giftAidRelief = taxRate > 0.20 ? giftAidDonations * 0.25 * (taxRate - 0.20) : 0

  // Wrong tax code refund
  const taxCodeDifference = expectedAllowance - actualAllowance
  const taxCodeRefund = taxCodeDifference > 0 ? taxCodeDifference * taxRate : 0

  // Total potential refund
  const totalRefund = wfhTaxSaving + uniformTaxSaving + professionalFeesSaving +
                      mileageTaxSaving + pensionAdditionalRelief + giftAidRelief + taxCodeRefund

  return (
    <CalculatorLayout>
      {/* Results Panel - Will appear on left due to reverse */}
      <ResultsPanel
        icon={Receipt}
        title="Your Potential Refund"
        description={`Based on ${taxRate * 100}% tax rate`}
        position="left"
      >
        {/* Total Refund */}
        <ResultValue
          value={formatCurrency(totalRefund, 0)}
          label="Estimated Tax Refund"
          valueClassName={totalRefund > 0 ? 'text-emerald-600 dark:text-emerald-400' : ''}
        />

        {/* Breakdown */}
        <div className="space-y-1">
          {taxCodeRefund > 0 && (
            <ResultRow
              label="Wrong Tax Code"
              value={`+${formatCurrency(taxCodeRefund)}`}
              valueClassName="text-emerald-600 dark:text-emerald-400"
            />
          )}
          {wfhTaxSaving > 0 && (
            <ResultRow
              label="Work From Home"
              value={`+${formatCurrency(wfhTaxSaving)}`}
              valueClassName="text-emerald-600 dark:text-emerald-400"
            />
          )}
          {uniformTaxSaving > 0 && (
            <ResultRow
              label="Uniform/Tools"
              value={`+${formatCurrency(uniformTaxSaving)}`}
              valueClassName="text-emerald-600 dark:text-emerald-400"
            />
          )}
          {professionalFeesSaving > 0 && (
            <ResultRow
              label="Professional Fees"
              value={`+${formatCurrency(professionalFeesSaving)}`}
              valueClassName="text-emerald-600 dark:text-emerald-400"
            />
          )}
          {mileageTaxSaving > 0 && (
            <ResultRow
              label="Mileage Claims"
              value={`+${formatCurrency(mileageTaxSaving)}`}
              valueClassName="text-emerald-600 dark:text-emerald-400"
              showBorder={false}
            />
          )}
        </div>

        {/* Status Message */}
        <ResultCard variant={totalRefund > 0 ? 'success' : 'accent'}>
          {totalRefund > 0 ? (
            <div>
              <div className="text-sm font-medium text-foreground">You may be owed a refund!</div>
              <div className="text-xs text-muted-foreground mt-1">
                Contact HMRC or complete a Self Assessment to claim
              </div>
            </div>
          ) : (
            <div>
              <div className="text-sm font-medium text-foreground">No refund identified</div>
              <div className="text-xs text-muted-foreground mt-1">
                Add expenses above to check for potential claims
              </div>
            </div>
          )}
        </ResultCard>

        {/* Claim Years */}
        <ResultCard variant="accent">
          <div className="text-sm font-medium text-foreground">Claim for Previous Years</div>
          <div className="text-xs text-muted-foreground mt-1">
            You can claim tax refunds for the last 4 tax years. If you&apos;ve been missing out,
            multiply your annual refund by up to 4.
          </div>
          {totalRefund > 0 && (
            <div className="mt-2 text-lg font-bold text-accent">
              Up to {formatCurrency(totalRefund * 4, 0)} over 4 years
            </div>
          )}
        </ResultCard>
      </ResultsPanel>

      {/* Input Panel - Will appear on right due to reverse */}
      <InputPanel
        icon={PoundSterling}
        title="Check Your Tax Situation"
        description={`See if you're owed a tax refund for ${TAX_YEAR}`}
        position="right"
      >
        {/* Annual Salary */}
        <div className="space-y-2">
          <Label htmlFor="annualSalary">Annual Salary</Label>
          <CurrencyInput
            id="annualSalary"
            value={annualSalary}
            onChange={setAnnualSalary}
            step={1000}
          />
        </div>

        {/* Tax Code */}
        <div className="space-y-2">
          <Label htmlFor="taxCode">Your Tax Code</Label>
          <Select value={taxCode} onValueChange={setTaxCode}>
            <SelectTrigger className="h-12 text-lg font-semibold bg-background border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1257L">1257L (Standard)</SelectItem>
              <SelectItem value="1100L">1100L (Emergency)</SelectItem>
              <SelectItem value="BR">BR (Basic Rate)</SelectItem>
              <SelectItem value="0T">0T (No Allowance)</SelectItem>
              <SelectItem value="K">K Code</SelectItem>
            </SelectContent>
          </Select>
          {taxCode !== '1257L' && (
            <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              You may be on the wrong tax code
            </p>
          )}
        </div>

        {/* Work from Home */}
        <div className="space-y-2">
          <Label htmlFor="wfhDays">Work From Home Days/Week</Label>
          <Input
            id="wfhDays"
            type="number"
            value={workFromHomeDays}
            onChange={(e) => setWorkFromHomeDays(parseInt(e.target.value) || 0)}
            min={0}
            max={5}
            className="h-12 text-lg font-semibold bg-background border-border"
          />
          <p className="text-xs text-muted-foreground">£6/week tax relief if required by employer</p>
        </div>

        {/* Uniform/Tools */}
        <div className="space-y-2">
          <Label htmlFor="uniform">Uniform/Tools Expenses</Label>
          <CurrencyInput
            id="uniform"
            value={uniformExpenses}
            onChange={setUniformExpenses}
            step={10}
          />
          <p className="text-xs text-muted-foreground">Cleaning/maintaining work uniform or tools</p>
        </div>

        {/* Professional Fees */}
        <div className="space-y-2">
          <Label htmlFor="profFees">Professional Body Fees</Label>
          <CurrencyInput
            id="profFees"
            value={professionalFees}
            onChange={setProfessionalFees}
            step={10}
          />
          <p className="text-xs text-muted-foreground">HMRC-approved professional subscriptions</p>
        </div>

        {/* Mileage */}
        <div className="space-y-2">
          <Label htmlFor="mileage">Business Mileage (£ value)</Label>
          <CurrencyInput
            id="mileage"
            value={mileageClaimable}
            onChange={setMileageClaimable}
            step={10}
          />
          <p className="text-xs text-muted-foreground">45p/mile for first 10,000, 25p/mile after</p>
        </div>
      </InputPanel>
    </CalculatorLayout>
  )
}
