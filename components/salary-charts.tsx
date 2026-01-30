'use client'

import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Cell,
  ResponsiveContainer,
  PieChart,
  Pie,
  Legend,
} from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
} from '@/components/ui/chart'
import { formatCurrency, type SalaryResult } from '@/lib/us-tax-calculator'
import { currentTaxConfig } from '@/lib/us-tax-config'

// US Wage Statistics (approximate values based on BLS data)
const US_WAGE_DATA = {
  minimum: 15080, // Federal minimum wage annual ($7.25 x 2080)
  median: 59540, // US median household income
  mean: 74580, // US mean household income
  top10Percent: 130000,
  top5Percent: 175000,
  top1Percent: 400000,
}

interface SalaryChartsProps {
  salary: number
  result: SalaryResult
  formattedSalary?: string
}

export function USSalaryComparisonChart({ salary, formattedSalary }: { salary: number; formattedSalary?: string }) {
  const comparisonData = [
    { name: 'Minimum Wage', value: US_WAGE_DATA.minimum, fill: '#d1d5db' },
    { name: 'US Median', value: US_WAGE_DATA.median, fill: '#9ca3af' },
    { name: 'US Mean', value: US_WAGE_DATA.mean, fill: '#6b7280' },
    { name: 'Your Salary', value: salary, fill: '#2563eb' },
  ].sort((a, b) => a.value - b.value)

  const getPercentileText = (salary: number): string => {
    if (salary >= US_WAGE_DATA.top1Percent) return "Top 1% of US earners"
    if (salary >= US_WAGE_DATA.top5Percent) return "Top 5% of US earners"
    if (salary >= US_WAGE_DATA.top10Percent) return "Top 10% of US earners"
    if (salary >= US_WAGE_DATA.mean) return "Above US average"
    if (salary >= US_WAGE_DATA.median) return "Above US median"
    return "Below US median"
  }

  const percentileText = getPercentileText(salary)
  const percentageVsMedian = ((salary - US_WAGE_DATA.median) / US_WAGE_DATA.median * 100).toFixed(0)

  return (
    <div className="rounded-3xl bg-card/60 dark:bg-card/40 p-6 sm:p-8 ring-1 ring-border/50">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          {formattedSalary || formatCurrency(salary, 0)} vs US Wages
        </h3>
        <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mt-1">{percentileText}</p>
      </div>

      <ChartContainer
        config={{
          value: { label: 'Salary', color: '#2563eb' },
        }}
        className="h-[200px]"
      >
        <ResponsiveContainer key={`comparison-chart-${salary}`} width="100%" height="100%">
          <BarChart
            data={comparisonData}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 70, bottom: 5 }}
          >
            <XAxis
              type="number"
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              tick={{ fontSize: 11, fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={70}
              tick={{ fontSize: 11, fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <ChartTooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const data = payload[0]?.payload
                return (
                  <div className="rounded-xl border bg-background p-3 shadow-lg">
                    <p className="font-semibold text-foreground">{data?.name}</p>
                    <p className="text-blue-600 font-medium">{formatCurrency(data?.value, 0)}</p>
                  </div>
                )
              }}
            />
            <Bar dataKey="value" radius={[0, 6, 6, 0]}>
              {comparisonData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/30 rounded-2xl">
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {Number(percentageVsMedian) > 0 ? '+' : ''}{percentageVsMedian}%
          </p>
          <p className="text-xs text-muted-foreground mt-1">vs US Median</p>
        </div>
        <div className="text-center p-4 bg-muted/50 rounded-2xl">
          <p className="text-2xl font-bold text-foreground">
            {formatCurrency(Math.abs(salary - US_WAGE_DATA.median), 0)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {salary >= US_WAGE_DATA.median ? 'Above' : 'Below'} Median
          </p>
        </div>
      </div>
    </div>
  )
}

export function TaxBreakdownChart({ result, formattedSalary }: { result: SalaryResult; formattedSalary?: string }) {
  const { yearly } = result

  const taxBreakdownData = [
    {
      name: 'Take Home',
      value: yearly.takeHomePay,
      fill: '#2563eb',
      percentage: ((yearly.takeHomePay / yearly.grossIncome) * 100).toFixed(1)
    },
    {
      name: 'Federal Tax',
      value: yearly.federalTax,
      fill: '#ef4444',
      percentage: ((yearly.federalTax / yearly.grossIncome) * 100).toFixed(1)
    },
    {
      name: 'State Tax',
      value: yearly.stateTax,
      fill: '#f97316',
      percentage: ((yearly.stateTax / yearly.grossIncome) * 100).toFixed(1)
    },
    {
      name: 'Social Security',
      value: yearly.socialSecurity,
      fill: '#8b5cf6',
      percentage: ((yearly.socialSecurity / yearly.grossIncome) * 100).toFixed(1)
    },
    {
      name: 'Medicare',
      value: yearly.medicare,
      fill: '#ec4899',
      percentage: ((yearly.medicare / yearly.grossIncome) * 100).toFixed(1)
    },
    ...(yearly.retirement401k > 0 ? [{
      name: '401(k)',
      value: yearly.retirement401k,
      fill: '#10b981',
      percentage: ((yearly.retirement401k / yearly.grossIncome) * 100).toFixed(1)
    }] : []),
    ...(yearly.hsaContribution > 0 ? [{
      name: 'HSA',
      value: yearly.hsaContribution,
      fill: '#06b6d4',
      percentage: ((yearly.hsaContribution / yearly.grossIncome) * 100).toFixed(1)
    }] : []),
  ].filter(item => item.value > 0)

  const chartConfig = taxBreakdownData.reduce((acc, item) => {
    acc[item.name] = { label: item.name, color: item.fill }
    return acc
  }, {} as Record<string, { label: string; color: string }>)

  return (
    <div className="rounded-3xl bg-card/60 dark:bg-card/40 p-6 sm:p-8 ring-1 ring-border/50">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Where Your {formattedSalary || formatCurrency(result.yearly.grossIncome, 0)} Goes
        </h3>
        <p className="text-sm text-muted-foreground mt-1">Annual breakdown of your salary</p>
      </div>

      <ChartContainer
        config={chartConfig}
        className="h-[200px]"
      >
        <ResponsiveContainer key={`breakdown-chart-${yearly.grossIncome}`} width="100%" height="100%">
          <PieChart>
            <Pie
              data={taxBreakdownData}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={75}
              paddingAngle={3}
              dataKey="value"
              nameKey="name"
            >
              {taxBreakdownData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartTooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const data = payload[0]?.payload
                return (
                  <div className="rounded-xl border bg-background p-3 shadow-lg">
                    <p className="font-semibold text-foreground">{data?.name}</p>
                    <p className="text-muted-foreground">{formatCurrency(data?.value, 0)} ({data?.percentage}%)</p>
                  </div>
                )
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Legend below chart */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        {taxBreakdownData.map((item) => (
          <div key={item.name} className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }} />
            <span className="text-muted-foreground truncate">{item.name}</span>
            <span className="font-medium text-foreground ml-auto">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function RetirementBenefitsChart({ salary, retirement401k, formattedSalary }: { salary: number; retirement401k: number; formattedSalary?: string }) {
  const calculate401kSavings = (salary: number, contribution: number) => {
    // Simplified tax savings calculation
    // Assume marginal rates based on income
    let marginalRate = 0.22 // Default 22% bracket
    if (salary > 243725) marginalRate = 0.35
    else if (salary > 191950) marginalRate = 0.32
    else if (salary > 100525) marginalRate = 0.24
    else if (salary > 47150) marginalRate = 0.22
    else if (salary > 11600) marginalRate = 0.12
    else marginalRate = 0.10

    const federalSavings = contribution * marginalRate
    const ficaSavings = 0 // 401(k) doesn't reduce FICA

    return {
      contribution,
      federalSavings,
      ficaSavings,
      totalSavings: federalSavings,
      effectiveCost: contribution - federalSavings,
    }
  }

  const currentSavings = calculate401kSavings(salary, retirement401k)
  const maxContribution = currentTaxConfig.retirement401k.employeeLimit

  const contributionLevels = [0, 5000, 10000, 15000, 20000, 23500]
  const savingsData = contributionLevels.map(amount => {
    const savings = calculate401kSavings(salary, amount)
    return {
      contribution: `$${(amount / 1000).toFixed(0)}k`,
      federalSavings: Math.round(savings.federalSavings),
      amount: amount,
    }
  })

  return (
    <div className="rounded-3xl bg-card/60 dark:bg-card/40 p-6 sm:p-8 ring-1 ring-border/50">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          401(k) Tax Benefits on {formattedSalary || formatCurrency(salary, 0)}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">See how 401(k) contributions reduce your tax bill</p>
      </div>

      <ChartContainer
        config={{
          federalSavings: { label: 'Federal Tax Saved', color: '#2563eb' },
        }}
        className="h-[220px]"
      >
        <ResponsiveContainer key={`401k-chart-${salary}`} width="100%" height="100%">
          <BarChart
            data={savingsData}
            margin={{ top: 10, right: 20, left: 20, bottom: 5 }}
          >
            <XAxis
              dataKey="contribution"
              tick={{ fontSize: 11, fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis
              tickFormatter={(value) => value >= 1000 ? `$${(value / 1000).toFixed(0)}k` : `$${Math.round(value)}`}
              tick={{ fontSize: 11, fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
              domain={[0, (dataMax: number) => Math.max(dataMax, 1000)]}
            />
            <ChartTooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const data = payload[0]?.payload
                return (
                  <div className="rounded-xl border bg-background p-3 shadow-lg">
                    <p className="font-semibold text-foreground">{formatCurrency(data?.amount, 0)} Contribution</p>
                    <p className="text-blue-600">Tax Saved: {formatCurrency(data?.federalSavings, 0)}</p>
                  </div>
                )
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: 10 }}
              formatter={(value) => <span className="text-sm text-muted-foreground">{value}</span>}
            />
            <Bar dataKey="federalSavings" name="Tax Saved" fill="#2563eb" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      {retirement401k > 0 && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-2xl">
          <h4 className="font-semibold text-sm text-foreground mb-3">Your Current 401(k) Benefits</h4>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{formatCurrency(currentSavings.totalSavings, 0)}</p>
              <p className="text-xs text-muted-foreground mt-1">Tax Saved</p>
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{formatCurrency(currentSavings.contribution, 0)}</p>
              <p className="text-xs text-muted-foreground mt-1">Contribution</p>
            </div>
            <div>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(currentSavings.effectiveCost, 0)}</p>
              <p className="text-xs text-muted-foreground mt-1">Effective Cost</p>
            </div>
          </div>
        </div>
      )}

      {retirement401k === 0 && (
        <div className="mt-6 p-4 bg-muted/30 rounded-2xl">
          <p className="text-sm text-muted-foreground">
            Increase your 401(k) contribution to see potential tax savings. Max contribution for 2025 is {formatCurrency(maxContribution, 0)}.
          </p>
        </div>
      )}
    </div>
  )
}

export function SalaryCharts({ salary, result, formattedSalary }: SalaryChartsProps) {
  if (salary <= 0) return null

  const displaySalary = formattedSalary || formatCurrency(salary, 0)

  return (
    <div className="mx-auto max-w-4xl mt-12">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-foreground">{displaySalary} Salary Insights</h2>
        <p className="text-muted-foreground mt-2">Compare your salary and understand your tax breakdown</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <USSalaryComparisonChart salary={salary} formattedSalary={displaySalary} />
        <TaxBreakdownChart result={result} formattedSalary={displaySalary} />
        <div className="lg:col-span-2">
          <RetirementBenefitsChart
            salary={salary}
            retirement401k={result.yearly.retirement401k}
            formattedSalary={displaySalary}
          />
        </div>
      </div>
    </div>
  )
}
