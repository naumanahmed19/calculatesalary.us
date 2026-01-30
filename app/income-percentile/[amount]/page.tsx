import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SidebarLayout } from '@/components/sidebar-layout'
import { calculateSalary, formatCurrency, TAX_YEAR } from '@/lib/us-tax-calculator'
import { HeaderAd, MobileHeaderAd, InContentAd, InArticleAd, FooterAd } from '@/components/ad-unit'
import { TrendingUp, Users, Target } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { RelatedCalculators, salaryCalculators } from '@/components/related-calculators'

const BASE_URL = 'https://calculatesalary.us'

// US income percentile data (approximated from Census Bureau and BLS statistics)
const PERCENTILE_THRESHOLDS = [
  { percentile: 1, salary: 15000 },
  { percentile: 5, salary: 20000 },
  { percentile: 10, salary: 25000 },
  { percentile: 20, salary: 32000 },
  { percentile: 25, salary: 38000 },
  { percentile: 30, salary: 42000 },
  { percentile: 40, salary: 50000 },
  { percentile: 50, salary: 56000 },
  { percentile: 60, salary: 65000 },
  { percentile: 70, salary: 78000 },
  { percentile: 75, salary: 90000 },
  { percentile: 80, salary: 100000 },
  { percentile: 85, salary: 120000 },
  { percentile: 90, salary: 150000 },
  { percentile: 95, salary: 200000 },
  { percentile: 97, salary: 280000 },
  { percentile: 99, salary: 450000 },
  { percentile: 99.5, salary: 600000 },
  { percentile: 99.9, salary: 1200000 },
]

// Common salaries for static generation
const COMMON_SALARIES = [
  30000, 40000, 50000, 60000, 70000, 75000, 80000, 90000, 100000,
  110000, 120000, 150000, 175000, 200000, 250000, 300000
]

interface PageProps {
  params: Promise<{ amount: string }>
}

export async function generateStaticParams() {
  return COMMON_SALARIES.map((salary) => ({
    amount: salary.toString(),
  }))
}

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

function getPercentileMessage(percentile: number): { message: string; detail: string } {
  if (percentile >= 99) return {
    message: "You're in the top 1% of US earners",
    detail: "Elite earner - you earn more than 99% of US workers"
  }
  if (percentile >= 95) return {
    message: "You're in the top 5% - very high earner",
    detail: "High earner - significant above-average income"
  }
  if (percentile >= 90) return {
    message: "You're in the top 10% - well above average",
    detail: "Top decile earner - comfortably above the US average"
  }
  if (percentile >= 75) return {
    message: "You're in the top 25% - above average earner",
    detail: "Above average - earning more than 3 in 4 US workers"
  }
  if (percentile >= 50) return {
    message: "You're in the top half of US earners",
    detail: "Above median - earning more than half the US workforce"
  }
  if (percentile >= 25) return {
    message: "You earn more than 25% of US workers",
    detail: "Below median but above the lower quartile"
  }
  return {
    message: "Many US workers earn at similar levels",
    detail: "Entry-level or part-time equivalent earnings"
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { amount } = await params
  const salary = parseInt(amount)

  if (isNaN(salary) || salary <= 0 || salary > 10000000) {
    return { title: 'Salary Not Found' }
  }

  const percentile = calculatePercentile(salary)
  const topPercent = 100 - percentile
  const formattedSalary = `$${salary.toLocaleString()}`

  return {
    title: `${formattedSalary} Salary - Top ${topPercent.toFixed(topPercent < 1 ? 1 : 0)}% US Income ${TAX_YEAR}`,
    description: `A ${formattedSalary} salary puts you in the top ${topPercent.toFixed(topPercent < 1 ? 1 : 0)}% of US earners. You earn more than ${percentile.toFixed(0)}% of US workers. See how your income compares to the US average.`,
    keywords: [
      `${salary} salary percentile us`,
      `is ${salary / 1000}k good salary usa`,
      `top ${Math.ceil(topPercent)}% us salary`,
      `${salary / 1000}k salary ranking`,
      'us income percentile',
      'salary ranking usa',
      TAX_YEAR,
    ],
    openGraph: {
      title: `${formattedSalary} = Top ${topPercent.toFixed(topPercent < 1 ? 1 : 0)}% of US Earners`,
      description: `A ${formattedSalary} salary means you earn more than ${percentile.toFixed(0)}% of US workers.`,
      type: 'website',
      locale: 'en_US',
    },
    alternates: {
      canonical: `/income-percentile/${salary}`,
    },
  }
}

function generateSchemas(salary: number, percentile: number) {
  const formattedSalary = `$${salary.toLocaleString()}`
  const topPercent = 100 - percentile

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Income Percentile', item: `${BASE_URL}/income-percentile` },
      { '@type': 'ListItem', position: 3, name: `${formattedSalary}`, item: `${BASE_URL}/income-percentile/${salary}` }
    ]
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What percentile is a ${formattedSalary} salary in the US?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `A ${formattedSalary} salary puts you in the top ${topPercent.toFixed(topPercent < 1 ? 1 : 0)}% of US earners. This means you earn more than ${percentile.toFixed(0)}% of all US workers.`
        }
      },
      {
        '@type': 'Question',
        name: `Is ${formattedSalary} a good salary in the US?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${salary >= 75000 ? `Yes, ${formattedSalary} is above the US median ($56,000) and puts you in the top ${Math.round(topPercent)}% of earners.` : salary >= 56000 ? `${formattedSalary} is around the US median salary, meaning half of workers earn more and half earn less.` : `${formattedSalary} is below the US median of $56,000, though many workers earn at similar levels.`}`
        }
      },
      {
        '@type': 'Question',
        name: `How many people in the US earn ${formattedSalary}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `With approximately 160 million US workers, earning ${formattedSalary} means you earn more than approximately ${Math.round((percentile / 100) * 160)} million workers.`
        }
      }
    ]
  }

  return { breadcrumbSchema, faqSchema }
}

export default async function IncomePercentileAmountPage({ params }: PageProps) {
  const { amount } = await params
  const salary = parseInt(amount)

  if (isNaN(salary) || salary <= 0 || salary > 10000000) {
    notFound()
  }

  const result = calculateSalary({
    grossSalary: salary,
    filingStatus: 'single',
    state: 'TX', // Texas - no state tax for cleaner example
  })

  const percentile = calculatePercentile(salary)
  const topPercent = 100 - percentile
  const messageData = getPercentileMessage(percentile)
  const formattedSalary = formatCurrency(salary, 0)
  const { breadcrumbSchema, faqSchema } = generateSchemas(salary, percentile)

  // Find next milestone
  const nextMilestone = PERCENTILE_THRESHOLDS.find(t => t.salary > salary)
  const prevMilestone = [...PERCENTILE_THRESHOLDS].reverse().find(t => t.salary < salary)

  // Related salaries
  const relatedSalaries = COMMON_SALARIES
    .filter(s => Math.abs(s - salary) <= 50000 && s !== salary)
    .slice(0, 6)

  // Key thresholds for reference
  const keyThresholds = [
    { label: 'Top 50%', salary: 56000 },
    { label: 'Top 25%', salary: 90000 },
    { label: 'Top 10%', salary: 150000 },
    { label: 'Top 5%', salary: 200000 },
    { label: 'Top 1%', salary: 450000 },
  ]

  return (
    <SidebarLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="flex-1">
        <HeaderAd />
        <MobileHeaderAd />

        {/* Breadcrumb */}
        <nav className="container mx-auto px-4 py-4" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-foreground transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link href="/income-percentile" className="hover:text-foreground transition-colors">Income Percentile</Link></li>
            <li>/</li>
            <li className="text-foreground font-medium">{formattedSalary}</li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="py-8 md:py-12 border-b border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <span className="inline-flex items-center rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent mb-4">
                <TrendingUp className="h-4 w-4 mr-2" />
                US Income Ranking {TAX_YEAR}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
                {formattedSalary} Salary - Where Do You Rank?
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                A {formattedSalary} salary puts you in the{' '}
                <strong className="text-foreground">top {topPercent.toFixed(topPercent < 1 ? 1 : 0)}%</strong> of US earners.
                You earn more than {percentile.toFixed(0)}% of all US workers.
              </p>
            </div>
          </div>
        </section>

        {/* Main Result */}
        <section className="py-12 bg-muted/30 border-b border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-8 ring-1 ring-border/50 text-center">
                <div className="text-sm text-muted-foreground mb-2">Your US Income Ranking</div>
                <div className="text-6xl font-bold text-accent mb-2">
                  Top {topPercent.toFixed(topPercent < 1 ? 1 : 0)}%
                </div>
                <div className="text-lg text-foreground mb-6">of US Earners</div>

                {/* Visual Percentile Bar */}
                <div className="max-w-md mx-auto mb-6">
                  <Progress value={percentile} className="h-4" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>Bottom</span>
                    <span>Median ($56k)</span>
                    <span>Top</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  {messageData.message}
                </p>
              </div>
            </div>
          </div>
        </section>

        <InContentAd />

        {/* Stats Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {formattedSalary} Salary Statistics
              </h2>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-5 ring-1 ring-border/50 text-center">
                  <div className="text-xs text-muted-foreground mb-1">You earn more than</div>
                  <div className="text-3xl font-bold text-foreground">{percentile.toFixed(0)}%</div>
                  <div className="text-xs text-muted-foreground">of US workers</div>
                </div>

                <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-5 ring-1 ring-border/50 text-center">
                  <div className="text-xs text-muted-foreground mb-1">Approx. workers below</div>
                  <div className="text-3xl font-bold text-foreground">
                    {((percentile / 100) * 160).toFixed(0)}m
                  </div>
                  <div className="text-xs text-muted-foreground">of 160m workers</div>
                </div>

                <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-5 ring-1 ring-border/50 text-center">
                  <div className="text-xs text-muted-foreground mb-1">Monthly Take-Home</div>
                  <div className="text-3xl font-bold text-emerald-600">{formatCurrency(result.monthly.takeHomePay)}</div>
                  <div className="text-xs text-muted-foreground">after tax</div>
                </div>

                <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-5 ring-1 ring-border/50 text-center">
                  <div className="text-xs text-muted-foreground mb-1">vs US Median</div>
                  <div className={`text-3xl font-bold ${salary >= 56000 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {salary >= 56000 ? '+' : ''}{formatCurrency(salary - 56000, 0)}
                  </div>
                  <div className="text-xs text-muted-foreground">{salary >= 56000 ? 'above' : 'below'} $56,000</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Thresholds */}
        <section className="py-12 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                US Income Thresholds
              </h2>

              <div className="rounded-2xl bg-card/60 dark:bg-card/40 overflow-hidden ring-1 ring-border/50">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Threshold</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Salary Required</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-foreground hidden sm:table-cell">Your Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {keyThresholds.map((threshold) => {
                      const achieved = salary >= threshold.salary
                      return (
                        <tr key={threshold.label} className={achieved ? 'bg-emerald-50/50 dark:bg-emerald-900/10' : ''}>
                          <td className="px-4 py-3 text-sm font-medium text-foreground">{threshold.label}</td>
                          <td className="px-4 py-3 text-sm text-right text-accent font-semibold">
                            {formatCurrency(threshold.salary, 0)}+
                          </td>
                          <td className="px-4 py-3 text-sm text-right hidden sm:table-cell">
                            {achieved ? (
                              <span className="text-emerald-600 font-medium">Achieved</span>
                            ) : (
                              <span className="text-muted-foreground">
                                Need {formatCurrency(threshold.salary - salary, 0)} more
                              </span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <InArticleAd />

        {/* Next Milestone */}
        {nextMilestone && topPercent > 1 && (
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                  <Target className="h-6 w-6 text-accent" />
                  Your Next Milestone
                </h2>

                <div className="rounded-2xl bg-accent/5 p-6 ring-1 ring-accent/20">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">To reach Top {(100 - nextMilestone.percentile).toFixed(0)}%</div>
                      <div className="text-2xl font-bold text-foreground">
                        Earn {formatCurrency(nextMilestone.salary - salary, 0)} more
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Target salary: {formatCurrency(nextMilestone.salary, 0)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground mb-1">That&apos;s an increase of</div>
                      <div className="text-2xl font-bold text-accent">
                        {(((nextMilestone.salary - salary) / salary) * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Related Salaries */}
        {relatedSalaries.length > 0 && (
          <section className="py-12 bg-muted/30 border-t border-border/40">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-xl font-bold text-foreground mb-6">
                  Compare Other Salaries
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {relatedSalaries.map((s) => {
                    const p = calculatePercentile(s)
                    const tp = 100 - p
                    return (
                      <Link
                        key={s}
                        href={`/income-percentile/${s}`}
                        className="rounded-2xl bg-card/60 dark:bg-card/40 p-4 ring-1 ring-border/50 hover:ring-accent/50 transition-all"
                      >
                        <div className="text-sm font-semibold text-foreground">
                          {formatCurrency(s, 0)}
                        </div>
                        <div className="text-lg font-bold text-accent mt-1">
                          Top {tp.toFixed(tp < 1 ? 1 : 0)}%
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        <RelatedCalculators calculators={salaryCalculators} />

        <FooterAd />
      </main>
    </SidebarLayout>
  )
}
