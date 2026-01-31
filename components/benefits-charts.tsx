'use client'

import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { US_BENEFITS, BENEFIT_CATEGORIES, BenefitCategory } from '@/lib/benefits/us-benefits-data'
import { AlertTriangle, DollarSign, Users } from 'lucide-react'

// Monthly benefit amounts data for bar chart
const benefitAmountsData = [
  { name: 'SS Retirement (max)', amount: 4873, fill: '#2563eb' },
  { name: 'SSDI (max)', amount: 3822, fill: '#7c3aed' },
  { name: 'VA Disability (100%)', amount: 3821, fill: '#059669' },
  { name: 'SSI (individual)', amount: 967, fill: '#dc2626' },
  { name: 'SNAP (couple max)', amount: 536, fill: '#ea580c' },
  { name: 'TANF (avg)', amount: 450, fill: '#0891b2' },
]

// Category distribution data for pie chart
const categoryData = Object.entries(BENEFIT_CATEGORIES).map(([key, value]) => ({
  name: value.label,
  value: US_BENEFITS.filter((b) => b.category === key).length,
  category: key,
}))

const COLORS = ['#2563eb', '#7c3aed', '#059669', '#dc2626', '#ea580c', '#0891b2', '#4f46e5', '#be185d', '#0d9488']

const chartConfig = {
  amount: {
    label: 'Monthly Amount',
  },
  'SS Retirement (max)': {
    label: 'SS Retirement',
    color: '#2563eb',
  },
  'SSDI (max)': {
    label: 'SSDI',
    color: '#7c3aed',
  },
  'VA Disability (100%)': {
    label: 'VA Disability',
    color: '#059669',
  },
  'SSI (individual)': {
    label: 'SSI',
    color: '#dc2626',
  },
  'SNAP (couple max)': {
    label: 'SNAP',
    color: '#ea580c',
  },
  'TANF (avg)': {
    label: 'TANF',
    color: '#0891b2',
  },
}

export function BenefitAmountsChart() {
  return (
    <Card className="rounded-2xl bg-card/60 dark:bg-card/40 ring-1 ring-border/50">
      <CardHeader>
        <CardTitle>Maximum Monthly Benefit Amounts (2025)</CardTitle>
        <CardDescription>Compare maximum monthly payments across major federal programs</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={benefitAmountsData} layout="vertical" margin={{ left: 20, right: 20 }}>
              <XAxis type="number" tickFormatter={(value) => `$${value.toLocaleString()}`} />
              <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12 }} />
              <ChartTooltip
                content={<ChartTooltipContent formatter={(value) => `$${Number(value).toLocaleString()}/month`} />}
              />
              <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                {benefitAmountsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function BenefitCategoryChart() {
  return (
    <Card className="rounded-2xl bg-card/60 dark:bg-card/40 ring-1 ring-border/50">
      <CardHeader>
        <CardTitle>Benefits by Category</CardTitle>
        <CardDescription>Distribution of federal benefit programs by type</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
                label={({ name, value }) => `${name}: ${value}`}
                labelLine={false}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export function UnclaimedBenefitsStats() {
  // Real statistics from various federal sources
  const stats = [
    {
      title: 'Unclaimed EITC',
      value: '$7 Billion',
      description: '1 in 5 eligible workers don\'t claim EITC annually',
      icon: DollarSign,
      color: 'text-green-600',
    },
    {
      title: 'SNAP Gap',
      value: '17%',
      description: 'Of eligible Americans not enrolled in SNAP',
      icon: Users,
      color: 'text-orange-600',
    },
    {
      title: 'SSI Underenrollment',
      value: '43%',
      description: 'Of eligible seniors don\'t receive SSI benefits',
      icon: AlertTriangle,
      color: 'text-red-600',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat, index) => (
        <Card key={index} className="rounded-2xl bg-card/60 dark:bg-card/40 ring-1 ring-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className={`rounded-full bg-muted p-3 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="font-medium">{stat.title}</p>
                <p className="text-sm text-muted-foreground">{stat.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Federal Poverty Level chart for reference
const fplData = [
  { size: '1 person', amount: 15060 },
  { size: '2 people', amount: 20440 },
  { size: '3 people', amount: 25820 },
  { size: '4 people', amount: 31200 },
  { size: '5 people', amount: 36580 },
  { size: '6 people', amount: 41960 },
]

export function FederalPovertyLevelChart() {
  return (
    <Card className="rounded-2xl bg-card/60 dark:bg-card/40 ring-1 ring-border/50">
      <CardHeader>
        <CardTitle>2025 Federal Poverty Level (FPL)</CardTitle>
        <CardDescription>Annual income thresholds used to determine eligibility for many programs</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={fplData} margin={{ left: 20, right: 20 }}>
              <XAxis dataKey="size" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
              <ChartTooltip
                content={<ChartTooltipContent formatter={(value) => `$${Number(value).toLocaleString()}/year`} />}
              />
              <Bar dataKey="amount" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
        <p className="mt-4 text-sm text-muted-foreground">
          Many programs use percentages of FPL (e.g., 130% FPL, 185% FPL) to determine eligibility. Alaska and Hawaii have higher FPL amounts.
        </p>
      </CardContent>
    </Card>
  )
}
