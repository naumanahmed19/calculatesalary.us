'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartContainer } from '@/components/ui/chart'
import { formatCurrency } from '@/lib/us-tax-calculator'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from 'recharts'
import { ChartTooltip } from '@/components/ui/chart'

interface SalaryTrendData {
  year: number
  average: number
  entryLevel: number
  senior: number
}

interface SalaryTrendsChartProps {
  jobTitle: string
  trends: SalaryTrendData[]
}

export function SalaryTrendsChart({ jobTitle, trends }: SalaryTrendsChartProps) {
  const latestYear = trends[trends.length - 1]
  const oldestYear = trends[0]
  
  // Calculate growth rates
  const averageGrowth = ((latestYear.average - oldestYear.average) / oldestYear.average * 100).toFixed(1)
  const totalGrowth = latestYear.average - oldestYear.average
  const annualGrowthRate = (Math.pow(latestYear.average / oldestYear.average, 1 / (trends.length - 1)) - 1) * 100
  
  // Calculate inflation-adjusted (using approx US inflation averages)
  const inflationRates: Record<number, number> = {
    2021: 7.0,
    2022: 6.5,
    2023: 3.4,
    2024: 2.9,
    2025: 2.5,
  }
  
  const cumulativeInflation = Object.values(inflationRates).reduce((acc, rate) => acc * (1 + rate / 100), 1)
  const realGrowth = ((latestYear.average / oldestYear.average) / cumulativeInflation - 1) * 100

  const chartConfig = {
    average: { label: 'Average', color: '#059669' },
    entryLevel: { label: 'Entry Level', color: '#64748b' },
    senior: { label: 'Senior', color: '#3b82f6' },
  }

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">
          {jobTitle} Salary Trends (5 Years)
        </CardTitle>
        <CardDescription>
          Historical salary data from {oldestYear.year} to {latestYear.year}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="averageGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="seniorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="year" 
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                width={50}
              />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null
                  const data = payload[0]?.payload
                  return (
                    <div className="rounded-lg border bg-background p-3 shadow-md">
                      <p className="font-semibold text-foreground mb-2">{data?.year}</p>
                      <div className="space-y-1 text-sm">
                        <p className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-[#059669]" />
                          <span className="text-muted-foreground">Average:</span>
                          <span className="font-medium">{formatCurrency(data?.average, 0)}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-[#64748b]" />
                          <span className="text-muted-foreground">Entry Level:</span>
                          <span className="font-medium">{formatCurrency(data?.entryLevel, 0)}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-[#3b82f6]" />
                          <span className="text-muted-foreground">Senior:</span>
                          <span className="font-medium">{formatCurrency(data?.senior, 0)}</span>
                        </p>
                      </div>
                    </div>
                  )
                }}
              />
              <Area
                type="monotone"
                dataKey="senior"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#seniorGradient)"
                dot={{ fill: '#3b82f6', strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, strokeWidth: 0 }}
              />
              <Area
                type="monotone"
                dataKey="average"
                stroke="#059669"
                strokeWidth={2}
                fill="url(#averageGradient)"
                dot={{ fill: '#059669', strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, strokeWidth: 0 }}
              />
              <Line
                type="monotone"
                dataKey="entryLevel"
                stroke="#64748b"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#64748b', strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, strokeWidth: 0 }}
              />
              <Legend 
                verticalAlign="bottom"
                height={36}
                formatter={(value) => {
                  const labels: Record<string, string> = {
                    average: 'Average Salary',
                    entryLevel: 'Entry Level',
                    senior: 'Senior Level'
                  }
                  return labels[value] || value
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
        
        {/* Stats Summary */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-2xl font-bold text-emerald-600">
              +{averageGrowth}%
            </p>
            <p className="text-xs text-muted-foreground">Total Growth</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-2xl font-bold text-foreground">
              +{formatCurrency(totalGrowth, 0)}
            </p>
            <p className="text-xs text-muted-foreground">Salary Increase</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-2xl font-bold text-foreground">
              +{annualGrowthRate.toFixed(1)}%
            </p>
            <p className="text-xs text-muted-foreground">Annual Growth Rate</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className={`text-2xl font-bold ${Number(realGrowth) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {realGrowth >= 0 ? '+' : ''}{realGrowth.toFixed(1)}%
            </p>
            <p className="text-xs text-muted-foreground">Real Growth (Inflation Adj.)</p>
          </div>
        </div>
        
        {/* Year over Year breakdown */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-foreground mb-3">Year-over-Year Changes</h4>
          <div className="space-y-2">
            {trends.slice(1).map((yearData, index) => {
              const prevYear = trends[index]
              const change = yearData.average - prevYear.average
              const percentChange = ((change / prevYear.average) * 100).toFixed(1)
              
              return (
                <div key={yearData.year} className="flex items-center justify-between text-sm py-2 border-b border-border/30 last:border-0">
                  <span className="text-muted-foreground">
                    {prevYear.year} → {yearData.year}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-foreground">
                      {formatCurrency(prevYear.average, 0)} → {formatCurrency(yearData.average, 0)}
                    </span>
                    <span className={`font-medium ${Number(percentChange) >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {Number(percentChange) >= 0 ? '+' : ''}{percentChange}%
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
