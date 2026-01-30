'use client'

import { useState } from 'react'
import { formatCurrency } from '@/lib/us-tax-calculator'
import { TrendingUp, Users } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'

// US individual income percentile data (based on Census Bureau / IRS data 2023-2024)
const PERCENTILE_THRESHOLDS = [
  { percentile: 1, salary: 10000 },
  { percentile: 5, salary: 15000 },
  { percentile: 10, salary: 20000 },
  { percentile: 20, salary: 28000 },
  { percentile: 25, salary: 32000 },
  { percentile: 30, salary: 36000 },
  { percentile: 40, salary: 44000 },
  { percentile: 50, salary: 56000 }, // Median individual income
  { percentile: 60, salary: 68000 },
  { percentile: 70, salary: 85000 },
  { percentile: 75, salary: 95000 },
  { percentile: 80, salary: 110000 },
  { percentile: 85, salary: 130000 },
  { percentile: 90, salary: 160000 },
  { percentile: 95, salary: 220000 },
  { percentile: 97, salary: 300000 },
  { percentile: 99, salary: 480000 },
  { percentile: 99.5, salary: 750000 },
  { percentile: 99.9, salary: 1500000 },
]

function calculatePercentile(salary: number): number {
  if (salary <= PERCENTILE_THRESHOLDS[0].salary) {
    return PERCENTILE_THRESHOLDS[0].percentile
  }

  for (let i = 0; i < PERCENTILE_THRESHOLDS.length - 1; i++) {
    const current = PERCENTILE_THRESHOLDS[i]
    const next = PERCENTILE_THRESHOLDS[i + 1]

    if (salary >= current.salary && salary < next.salary) {
      const range = next.salary - current.salary
      const position = salary - current.salary
      const percentileRange = next.percentile - current.percentile
      return current.percentile + (position / range) * percentileRange
    }
  }

  return 99.9
}

function getPercentileMessage(percentile: number): string {
  if (percentile >= 99) return "You're in the top 1% of US earners"
  if (percentile >= 95) return "You're in the top 5% - very high earner"
  if (percentile >= 90) return "You're in the top 10% - well above average"
  if (percentile >= 75) return "You're in the top 25% - above average earner"
  if (percentile >= 50) return "You're in the top half of US earners"
  if (percentile >= 25) return "You earn more than 25% of US workers"
  return "Many US workers earn at similar levels"
}

export function IncomePercentileCalculator() {
  const [salary, setSalary] = useState(75000)

  const percentile = calculatePercentile(salary)
  const topPercent = 100 - percentile
  const message = getPercentileMessage(percentile)

  return (
    <div className="space-y-8">
      <div className="mx-auto max-w-lg grid grid-cols-1 items-center gap-y-6 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
        {/* Input Panel */}
        <div className="rounded-3xl rounded-t-3xl sm:rounded-b-none lg:rounded-tr-none lg:rounded-bl-3xl bg-card/60 dark:bg-card/40 p-8 ring-1 ring-border/50 sm:p-10 sm:mx-8 lg:mx-0">
          <h3 className="text-base/7 font-semibold text-accent flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Enter Your Salary
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Find out where you rank in the US
          </p>

          <div className="mt-8 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="salary">Annual Gross Salary</Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-medium text-muted-foreground">$</span>
                <Input
                  id="salary"
                  type="number"
                  value={salary}
                  onChange={(e) => setSalary(parseFloat(e.target.value) || 0)}
                  step={1000}
                  min={0}
                  className="pl-9 h-12 text-lg font-semibold bg-background border-border"
                />
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {[50000, 75000, 100000, 150000, 200000, 300000].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSalary(s)}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                      salary === s
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    ${(s / 1000)}k
                  </button>
                ))}
              </div>
            </div>

            {/* US Median reference */}
            <div className="rounded-xl bg-muted/50 p-4">
              <div className="text-sm text-foreground">
                <strong>US Median Individual Income:</strong> $56,000
                <p className="text-xs mt-1 text-muted-foreground">
                  Half of US workers earn more, half earn less
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="rounded-3xl bg-accent/5 p-8 ring-1 ring-accent/20 sm:p-10 sm:mx-8 lg:mx-0">
          <h3 className="text-base/7 font-semibold text-accent flex items-center gap-2">
            <Users className="h-5 w-5" />
            Your Ranking
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {formatCurrency(salary, 0)} annual salary
          </p>

          <div className="mt-8 space-y-6">
            {/* Main Result */}
            <div className="text-center py-6">
              <div className="text-6xl font-bold text-accent">
                Top {topPercent.toFixed(topPercent < 1 ? 1 : 0)}%
              </div>
              <div className="text-lg text-foreground mt-2">
                of US Earners
              </div>
            </div>

            {/* Visual Percentile Bar */}
            <div className="space-y-2">
              <Progress value={percentile} className="h-4" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Bottom</span>
                <span>Median</span>
                <span>Top</span>
              </div>
            </div>

            {/* Message */}
            <div className="rounded-xl bg-card/60 dark:bg-card/40 p-4 ring-1 ring-border/50">
              <p className="text-sm text-foreground font-medium">{message}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-muted/50 p-4 text-center">
                <div className="text-xs text-muted-foreground mb-1">You earn more than</div>
                <div className="text-xl font-bold text-foreground">{percentile.toFixed(0)}%</div>
                <div className="text-xs text-muted-foreground">of US workers</div>
              </div>
              <div className="rounded-xl bg-muted/50 p-4 text-center">
                <div className="text-xs text-muted-foreground mb-1">Approx. workers below</div>
                <div className="text-xl font-bold text-foreground">
                  {((percentile / 100) * 160).toFixed(0)}m
                </div>
                <div className="text-xs text-muted-foreground">of 160m workers</div>
              </div>
            </div>

            {/* Next threshold */}
            <div className="text-sm text-center text-muted-foreground">
              {topPercent > 10 && (
                <p>
                  Earn <span className="font-medium text-foreground">{formatCurrency(160000 - salary, 0)}</span> more to reach Top 10%
                </p>
              )}
              {topPercent <= 10 && topPercent > 1 && (
                <p>
                  Earn <span className="font-medium text-foreground">{formatCurrency(480000 - salary, 0)}</span> more to reach Top 1%
                </p>
              )}
              {topPercent <= 1 && (
                <p className="text-accent font-medium">You're in the elite Top 1%</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
