'use client'

import React from "react"
import { useState, useCallback } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import type { SalaryInput, SalaryResult, FilingStatus } from '@/lib/us-tax-calculator'
import { calculateSalary, formatCurrency, TAX_YEAR } from '@/lib/us-tax-calculator'
import { getAllStates } from '@/lib/us-tax-config'
import { SalaryCharts } from '@/components/salary-charts'
import { ShareResults } from '@/components/share-results'

// Quick salary presets (US context)
const QUICK_SALARIES = [40000, 60000, 80000, 100000, 150000]

// Get all states for dropdown
const ALL_STATES = getAllStates()

interface SalaryCalculatorFormProps {
  initialSalary?: number
  initialState?: string
  initialFilingStatus?: FilingStatus
  onCalculate?: (result: SalaryResult) => void
}

export function SalaryCalculatorForm({
  initialSalary = 0,
  initialState = 'TX',
  initialFilingStatus = 'single',
  onCalculate
}: SalaryCalculatorFormProps) {
  const [input, setInput] = useState<SalaryInput>({
    grossSalary: initialSalary,
    bonus: 0,
    filingStatus: initialFilingStatus,
    state: initialState,
    retirement401k: 0,
    hsaContribution: 0,
    includeLocalTax: false,
  })

  const [result, setResult] = useState<SalaryResult>(() => calculateSalary({
    grossSalary: initialSalary,
    filingStatus: initialFilingStatus,
    state: initialState,
  }))

  const [activeTab, setActiveTab] = useState<'yearly' | 'monthly' | 'biweekly'>('yearly')

  const handleInputChange = useCallback((field: keyof SalaryInput, value: number | string | boolean) => {
    setInput(prev => {
      const newInput = { ...prev, [field]: value }
      const newResult = calculateSalary(newInput)
      setResult(newResult)
      onCalculate?.(newResult)
      return newInput
    })
  }, [onCalculate])

  const handleNumericInput = useCallback((field: keyof SalaryInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0
    handleInputChange(field, value)
  }, [handleInputChange])

  const currentBreakdown = result[activeTab]
  const grossIncome = input.grossSalary + (input.bonus || 0)

  // Check if state has local tax option (NY, MD, OH, etc.)
  const hasLocalTax = ['NY', 'MD', 'OH', 'PA', 'IN', 'KY'].includes(input.state)

  return (
    <div className="space-y-8">
      {/* Two Panel Calculator */}
      <div className="mx-auto max-w-lg grid grid-cols-1 gap-y-6 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
        {/* Input Panel - Left */}
        <div className="rounded-3xl rounded-t-3xl sm:rounded-b-none lg:rounded-tr-none lg:rounded-bl-3xl bg-card/60 dark:bg-card/40 p-8 ring-1 ring-border/50 sm:p-10 sm:mx-8 lg:mx-0 lg:my-8">
          <h3 className="text-base/7 font-semibold text-accent">
            Your Income
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your salary details for {TAX_YEAR}
          </p>

          <div className="mt-8 space-y-6">
            {/* Base Salary */}
            <div className="space-y-2">
              <Label htmlFor="grossSalary" className="text-sm font-medium text-foreground">
                Annual Gross Salary
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-medium text-muted-foreground">$</span>
                <Input
                  id="grossSalary"
                  type="number"
                  value={input.grossSalary || ''}
                  onChange={handleNumericInput('grossSalary')}
                  className="pl-9 h-12 text-lg font-semibold bg-background border-border"
                  placeholder="75,000"
                />
              </div>
              {/* Quick Select */}
              <div className="flex flex-wrap gap-2 pt-1">
                {QUICK_SALARIES.map((salary) => (
                  <button
                    key={salary}
                    type="button"
                    onClick={() => handleInputChange('grossSalary', salary)}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                      input.grossSalary === salary
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    ${(salary / 1000)}k
                  </button>
                ))}
              </div>
            </div>

            {/* Bonus */}
            <div className="space-y-2">
              <Label htmlFor="bonus" className="text-sm font-medium text-muted-foreground">
                Annual Bonus
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                <Input
                  id="bonus"
                  type="number"
                  value={input.bonus || ''}
                  onChange={handleNumericInput('bonus')}
                  className="pl-7 bg-background border-border"
                  placeholder="0"
                />
              </div>
            </div>

            {/* Filing Status */}
            <div className="space-y-2">
              <Label htmlFor="filingStatus" className="text-sm font-medium text-foreground">
                Filing Status
              </Label>
              <Select
                value={input.filingStatus}
                onValueChange={(value) => handleInputChange('filingStatus', value)}
              >
                <SelectTrigger id="filingStatus" className="bg-background border-border">
                  <SelectValue placeholder="Select status" />
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
              <Label htmlFor="state" className="text-sm font-medium text-foreground">
                State
              </Label>
              <Select
                value={input.state}
                onValueChange={(value) => handleInputChange('state', value)}
              >
                <SelectTrigger id="state" className="bg-background border-border">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {ALL_STATES.map((state) => (
                    <SelectItem key={state.code} value={state.code}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {['AK', 'FL', 'NV', 'NH', 'SD', 'TN', 'TX', 'WA', 'WY'].includes(input.state) && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                  ✓ No state income tax
                </p>
              )}
            </div>

            {/* Local Tax Toggle */}
            {hasLocalTax && (
              <div className="flex items-center justify-between">
                <Label htmlFor="localTax" className="text-sm font-medium text-foreground">
                  Include Local/City Tax
                </Label>
                <Switch
                  id="localTax"
                  checked={input.includeLocalTax}
                  onCheckedChange={(checked) => handleInputChange('includeLocalTax', checked)}
                />
              </div>
            )}

            {/* 401(k) Contribution */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="retirement401k" className="text-sm font-medium text-foreground">
                  401(k) Contribution
                </Label>
                <span className="text-sm font-bold text-accent">
                  {formatCurrency(input.retirement401k || 0, 0)}/yr
                </span>
              </div>
              <Slider
                id="retirement401k"
                value={[input.retirement401k || 0]}
                onValueChange={([value]) => handleInputChange('retirement401k', value)}
                max={23500}
                step={500}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Pre-tax contribution (max $23,500 in 2025)
              </p>
            </div>

            {/* HSA Contribution */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="hsaContribution" className="text-sm font-medium text-foreground">
                  HSA Contribution
                </Label>
                <span className="text-sm font-bold text-accent">
                  {formatCurrency(input.hsaContribution || 0, 0)}/yr
                </span>
              </div>
              <Slider
                id="hsaContribution"
                value={[input.hsaContribution || 0]}
                onValueChange={([value]) => handleInputChange('hsaContribution', value)}
                max={8550}
                step={100}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Pre-tax health savings (max $4,300 self / $8,550 family)
              </p>
            </div>
          </div>
        </div>

        {/* Results Panel - Right */}
        <div className="relative rounded-3xl bg-blue-600 dark:bg-blue-700 p-8 shadow-2xl sm:p-10 flex flex-col min-h-[600px]">
          <div className="flex items-center justify-between">
            <h3 className="text-base/7 font-semibold text-white">
              Take Home Pay
            </h3>
            <ShareResults
              result={result}
              grossIncome={grossIncome}
            />
          </div>

          {/* Period Tabs */}
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'yearly' | 'monthly' | 'biweekly')} className="mt-4">
            <TabsList className="grid w-full grid-cols-3 bg-blue-700/50">
              <TabsTrigger value="yearly" className="text-blue-100 data-[state=active]:bg-white data-[state=active]:text-blue-700 text-xs">Yearly</TabsTrigger>
              <TabsTrigger value="monthly" className="text-blue-100 data-[state=active]:bg-white data-[state=active]:text-blue-700 text-xs">Monthly</TabsTrigger>
              <TabsTrigger value="biweekly" className="text-blue-100 data-[state=active]:bg-white data-[state=active]:text-blue-700 text-xs">Bi-weekly</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Main Amount */}
          <p className="mt-6 flex items-baseline gap-x-2">
            <span className="text-5xl font-semibold tracking-tight text-white">
              {formatCurrency(currentBreakdown.takeHomePay)}
            </span>
            <span className="text-base text-blue-100">
              /{activeTab === 'yearly' ? 'year' : activeTab === 'monthly' ? 'month' : '2 weeks'}
            </span>
          </p>

          {grossIncome > 0 && (
            <p className="mt-2 text-sm text-blue-100">
              {((currentBreakdown.takeHomePay / (grossIncome / (activeTab === 'yearly' ? 1 : activeTab === 'monthly' ? 12 : 26))) * 100).toFixed(1)}% of gross income
            </p>
          )}

          {/* Breakdown List */}
          <ul role="list" className="mt-8 space-y-3 text-sm/6 text-blue-50 sm:mt-10 flex-1">
            <li className="flex justify-between gap-x-3">
              <span>Gross Income</span>
              <span className="font-medium text-white">{formatCurrency(grossIncome)}</span>
            </li>
            <li className="flex justify-between gap-x-3">
              <span>Taxable Income</span>
              <span className="font-medium text-white">{formatCurrency(result.yearly.taxableIncome)}</span>
            </li>
            <li className="flex justify-between gap-x-3 pt-3 border-t border-blue-500/40">
              <span>Federal Tax</span>
              <span className="font-medium text-amber-200">-{formatCurrency(result.yearly.federalTax)}</span>
            </li>
            <li className="flex justify-between gap-x-3">
              <span>State Tax ({result.state})</span>
              <span className="font-medium text-amber-200">-{formatCurrency(result.yearly.stateTax)}</span>
            </li>
            {result.yearly.localTax > 0 && (
              <li className="flex justify-between gap-x-3">
                <span>Local Tax</span>
                <span className="font-medium text-amber-200">-{formatCurrency(result.yearly.localTax)}</span>
              </li>
            )}
            <li className="flex justify-between gap-x-3">
              <span>Social Security</span>
              <span className="font-medium text-amber-200">-{formatCurrency(result.yearly.socialSecurity)}</span>
            </li>
            <li className="flex justify-between gap-x-3">
              <span>Medicare</span>
              <span className="font-medium text-amber-200">-{formatCurrency(result.yearly.medicare)}</span>
            </li>
            {result.yearly.retirement401k > 0 && (
              <li className="flex justify-between gap-x-3">
                <span>401(k)</span>
                <span className="font-medium text-amber-200">-{formatCurrency(result.yearly.retirement401k)}</span>
              </li>
            )}
            {result.yearly.hsaContribution > 0 && (
              <li className="flex justify-between gap-x-3">
                <span>HSA</span>
                <span className="font-medium text-amber-200">-{formatCurrency(result.yearly.hsaContribution)}</span>
              </li>
            )}
            <li className="flex justify-between gap-x-3 pt-3 border-t border-blue-500/40">
              <span>Total Deductions</span>
              <span className="font-medium text-amber-200">-{formatCurrency(result.yearly.totalDeductions)}</span>
            </li>
          </ul>

          {/* Tax Rates */}
          <div className="mt-8 pt-6 border-t border-blue-500/40 grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{result.yearly.effectiveTaxRate.toFixed(1)}%</p>
              <p className="text-xs text-blue-100 mt-1">Effective Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{result.yearly.marginalTaxRate}%</p>
              <p className="text-xs text-blue-100 mt-1">Marginal Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <SalaryCharts
        salary={grossIncome}
        result={result}
      />
    </div>
  )
}
