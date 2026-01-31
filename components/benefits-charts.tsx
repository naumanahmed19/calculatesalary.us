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
import { US_BENEFITS, BENEFIT_CATEGORIES, getAllCategories, getBenefitsByCategory } from '@/lib/benefits/us-benefits-data'

// Real US benefit statistics data (2025 rates)
const BENEFIT_AMOUNTS = [
  { name: 'SS Retirement', monthlyAmount: 4873, annualAmount: 58476, color: '#059669' },
  { name: 'SSDI (max)', monthlyAmount: 3822, annualAmount: 45864, color: '#10b981' },
  { name: 'VA Disability', monthlyAmount: 3821, annualAmount: 45852, color: '#6366f1' },
  { name: 'SSI', monthlyAmount: 967, annualAmount: 11604, color: '#8b5cf6' },
  { name: 'EITC (max)', monthlyAmount: 652, annualAmount: 7830, color: '#f59e0b' },
  { name: 'SNAP (single)', monthlyAmount: 292, annualAmount: 3504, color: '#ec4899' },
  { name: 'Child Tax Credit', monthlyAmount: 167, annualAmount: 2000, color: '#ef4444' },
]

// Benefits by category for pie chart
const BENEFITS_BY_CATEGORY = getAllCategories().map(cat => {
  const catInfo = BENEFIT_CATEGORIES[cat]
  return {
    name: catInfo.name.replace(' Benefits', '').replace(' Assistance', ''),
    value: getBenefitsByCategory(cat).length,
    color: cat === 'retirement' ? '#f97316' :
           cat === 'disability' ? '#3b82f6' :
           cat === 'healthcare' ? '#ef4444' :
           cat === 'food' ? '#22c55e' :
           cat === 'family' ? '#ec4899' :
           cat === 'housing' ? '#f59e0b' :
           cat === 'tax-credits' ? '#10b981' :
           cat === 'unemployment' ? '#8b5cf6' :
           cat === 'veterans' ? '#6366f1' : '#6b7280',
  }
})

// Unclaimed benefits statistics (real federal data estimates)
export const UNCLAIMED_STATS = {
  eitc: { unclaimed: '$7 Billion', eligible: '1 in 5 eligible workers' },
  snap: { unclaimed: '17% Gap', eligible: 'Of eligible Americans not enrolled' },
  ssi: { unclaimed: '43%', eligible: 'Of eligible seniors miss SSI' },
  medicaid: { unclaimed: '12 Million', eligible: 'Eligible but not enrolled' },
}

export function BenefitAmountsChart() {
  const chartData = BENEFIT_AMOUNTS.map(b => ({
    name: b.name,
    amount: b.monthlyAmount,
    annual: b.annualAmount,
    fill: b.color,
  }))

  return (
    <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Monthly Benefit Amounts 2025
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Comparison of major US benefit monthly rates (max amounts)
        </p>
      </div>

      <ChartContainer
        config={{
          amount: { label: 'Monthly Amount', color: '#059669' },
        }}
        className="h-[280px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <XAxis
              type="number"
              tickFormatter={(value) => `$${value.toLocaleString()}`}
              tick={{ fontSize: 11, fill: '#6b7280' }}
              axisLine={{ stroke: '#e5e7eb' }}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={95}
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
                    <p className="text-emerald-600 font-medium">${data?.amount?.toLocaleString()}/month</p>
                    <p className="text-sm text-muted-foreground">${data?.annual?.toLocaleString()}/year</p>
                  </div>
                )
              }}
            />
            <Bar dataKey="amount" radius={[0, 6, 6, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      <p className="text-xs text-muted-foreground mt-4 text-center">
        Rates shown are maximum amounts. Actual entitlement varies based on circumstances.
      </p>
    </div>
  )
}

export function BenefitCategoryChart() {
  const total = BENEFITS_BY_CATEGORY.reduce((sum, cat) => sum + cat.value, 0)

  return (
    <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Benefits by Category
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Distribution of {total} federal benefits across categories
        </p>
      </div>

      <ChartContainer
        config={{
          value: { label: 'Benefits', color: '#059669' },
        }}
        className="h-[250px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={BENEFITS_BY_CATEGORY}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {BENEFITS_BY_CATEGORY.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <ChartTooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const data = payload[0]?.payload
                return (
                  <div className="rounded-xl border bg-background p-3 shadow-lg">
                    <p className="font-semibold text-foreground">{data?.name}</p>
                    <p className="text-accent font-medium">{data?.value} benefits</p>
                  </div>
                )
              }}
            />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ fontSize: '11px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}

export function UnclaimedBenefitsStats() {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-6 ring-1 ring-amber-200 dark:ring-amber-700">
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Billions in Benefits Go Unclaimed
      </h3>
      <p className="text-sm text-muted-foreground mb-6">
        According to federal estimates, significant amounts of benefits go unclaimed each year.
        Check if you&apos;re missing out on support you&apos;re entitled to.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-white/60 dark:bg-background/40 p-4">
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {UNCLAIMED_STATS.eitc.unclaimed}
          </div>
          <div className="text-sm font-medium text-foreground">EITC Unclaimed</div>
          <div className="text-xs text-muted-foreground">
            {UNCLAIMED_STATS.eitc.eligible}
          </div>
        </div>
        <div className="rounded-xl bg-white/60 dark:bg-background/40 p-4">
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {UNCLAIMED_STATS.snap.unclaimed}
          </div>
          <div className="text-sm font-medium text-foreground">SNAP Enrollment</div>
          <div className="text-xs text-muted-foreground">
            {UNCLAIMED_STATS.snap.eligible}
          </div>
        </div>
        <div className="rounded-xl bg-white/60 dark:bg-background/40 p-4">
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {UNCLAIMED_STATS.ssi.unclaimed}
          </div>
          <div className="text-sm font-medium text-foreground">SSI Seniors</div>
          <div className="text-xs text-muted-foreground">
            {UNCLAIMED_STATS.ssi.eligible}
          </div>
        </div>
        <div className="rounded-xl bg-white/60 dark:bg-background/40 p-4">
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {UNCLAIMED_STATS.medicaid.unclaimed}
          </div>
          <div className="text-sm font-medium text-foreground">Medicaid Gap</div>
          <div className="text-xs text-muted-foreground">
            {UNCLAIMED_STATS.medicaid.eligible}
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-4">
        Source: Federal agency estimates including IRS, USDA, SSA, and CMS. Figures are approximate.
      </p>
    </div>
  )
}
