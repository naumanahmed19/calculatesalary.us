import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { SidebarLayout } from '@/components/sidebar-layout'
import { HourlyRateCalculator } from '@/components/hourly-rate-calculator'
import { calculateSalary, formatCurrency, TAX_YEAR } from '@/lib/us-tax-calculator'
import { currentTaxConfig } from '@/lib/us-tax-config'
import { HeaderAd, MobileHeaderAd, InContentAd, InArticleAd, FooterAd } from '@/components/ad-unit'
import { RelatedCalculators, salaryCalculators } from '@/components/related-calculators'

const BASE_URL = 'https://calculatesalary.us'

// Common hourly rates to pre-generate
const COMMON_HOURLY_RATES = [
  7.25, 10, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 32, 35, 40, 45, 50, 60, 75, 100
]

interface PageProps {
  params: Promise<{ rate: string }>
}

function parseHourlyRate(rateStr: string): number | null {
  // Support formats: "15", "15.50", "11.44"
  const rate = parseFloat(rateStr)
  if (isNaN(rate) || rate <= 0 || rate > 1000) {
    return null
  }
  return rate
}

function hourlyToAnnual(hourlyRate: number, hoursPerWeek: number = 40): number {
  return hourlyRate * hoursPerWeek * 52
}

function formatRate(rate: number): string {
  return rate % 1 === 0 ? `$${rate}` : `$${rate.toFixed(2)}`
}

export async function generateStaticParams() {
  return COMMON_HOURLY_RATES.map((rate) => ({
    rate: rate.toString(),
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { rate: rateStr } = await params
  const rate = parseHourlyRate(rateStr)

  if (!rate) {
    return { title: 'Hourly Rate Not Found' }
  }

  const annual = hourlyToAnnual(rate)
  const result = calculateSalary({
    grossSalary: annual,
    filingStatus: 'single',
    state: 'TX',
  })

  const rateDisplay = formatRate(rate)
  const title = `${rateDisplay} Per Hour Salary US ${TAX_YEAR} - Annual & Monthly After Tax`
  const description = `${rateDisplay} per hour equals ${formatCurrency(annual, 0)} annual salary in the US. After tax you'll take home ${formatCurrency(result.monthly.takeHomePay)} per month (${formatCurrency(result.yearly.takeHomePay, 0)} per year). ${TAX_YEAR} tax year calculator.`

  return {
    title,
    description,
    keywords: [
      `${rate} per hour annual salary`,
      `${rate} per hour monthly salary after tax`,
      `${rate} dollar an hour salary`,
      `${rate}ph annual salary`,
      `${rate} per hour annual salary after tax`,
      `what is ${rate} an hour annually`,
      `${rate} hourly to yearly`,
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_US',
    },
    alternates: {
      canonical: `${BASE_URL}/hourly/${rate}`,
    },
  }
}

// Breadcrumb schema
function generateBreadcrumbSchema(rate: number) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: BASE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Hourly Rate Calculator',
        item: `${BASE_URL}/hourly`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${formatRate(rate)}/hour`,
        item: `${BASE_URL}/hourly/${rate}`,
      },
    ],
  }
}

// FAQ schema for the specific rate
function generateFAQSchema(rate: number, annual: number, result: ReturnType<typeof calculateSalary>) {
  const rateDisplay = formatRate(rate)
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is ${rateDisplay} per hour as an annual salary?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${rateDisplay} per hour working 40 hours per week equals ${formatCurrency(annual, 0)} per year before tax. This is based on 52 weeks of full-time work.`,
        },
      },
      {
        '@type': 'Question',
        name: `How much is ${rateDisplay} per hour after tax?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `On ${rateDisplay} per hour (${formatCurrency(annual, 0)} annual), your take-home pay after federal, state, and FICA taxes is approximately ${formatCurrency(result.monthly.takeHomePay)} per month or ${formatCurrency(result.yearly.takeHomePay, 0)} per year in the ${TAX_YEAR} tax year. Actual amount varies by state.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the monthly salary for ${rateDisplay} per hour?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `At ${rateDisplay} per hour (40 hours/week), your monthly gross salary is ${formatCurrency(annual / 12)}. After taxes, your monthly take-home pay is approximately ${formatCurrency(result.monthly.takeHomePay)}, though this varies by state and filing status.`,
        },
      },
    ],
  }
}

export default async function HourlyRatePage({ params }: PageProps) {
  const { rate: rateStr } = await params
  const rate = parseHourlyRate(rateStr)

  if (!rate) {
    notFound()
  }

  const annual = hourlyToAnnual(rate)
  const result = calculateSalary({
    grossSalary: annual,
    filingStatus: 'single',
    state: 'TX', // Texas - no state tax for cleaner example
  })

  const rateDisplay = formatRate(rate)
  const breadcrumbSchema = generateBreadcrumbSchema(rate)
  const faqSchema = generateFAQSchema(rate, annual, result)

  // Get related hourly rates
  const relatedRates = COMMON_HOURLY_RATES.filter(
    (r) => Math.abs(r - rate) <= 10 && r !== rate
  ).slice(0, 8)

  // Calculate for different hours
  const hoursVariations = [20, 30, 35, 40, 45]

  return (
    <SidebarLayout>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main id="main-content" className="flex-1">
        {/* Top Ad */}
        <HeaderAd />
        <MobileHeaderAd />

        {/* Breadcrumb */}
        <nav className="container mx-auto px-4 py-4" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li className="inline-flex items-center">
              <Link href="/" className="hover:text-foreground transition-colors">
                Calculator
              </Link>
            </li>
            <li className="inline-flex items-center">/</li>
            <li className="inline-flex items-center">
              <Link href="/hourly" className="hover:text-foreground transition-colors">
                Hourly Rates
              </Link>
            </li>
            <li className="inline-flex items-center">/</li>
            <li className="inline-flex items-center text-foreground font-medium">{rateDisplay}/hour</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="py-8 md:py-12 border-b border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <span className="inline-flex items-center rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent mb-4">
                {TAX_YEAR} Tax Year
              </span>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
                {rateDisplay} Per Hour - US Salary After Tax
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                If you earn <strong className="text-foreground">{rateDisplay} per hour</strong> working 40 hours per week,
                your annual salary is <strong className="text-foreground">{formatCurrency(annual, 0)}</strong>.
                After tax, you&apos;ll take home approximately <strong className="text-foreground">{formatCurrency(result.monthly.takeHomePay)}</strong> per month.
              </p>
            </div>
          </div>
        </section>

        {/* Quick Summary Cards */}
        <section className="py-8 bg-muted/30 border-b border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
              <SummaryCard
                label="Hourly Rate"
                value={rateDisplay}
                subtext="per hour"
              />
              <SummaryCard
                label="Annual Salary"
                value={formatCurrency(annual, 0)}
                subtext="gross per year"
              />
              <SummaryCard
                label="Monthly Take-Home"
                value={formatCurrency(result.monthly.takeHomePay)}
                subtext="after tax"
                highlight
              />
              <SummaryCard
                label="Yearly Take-Home"
                value={formatCurrency(result.yearly.takeHomePay, 0)}
                subtext="after tax"
                highlight
              />
            </div>
          </div>
        </section>

        {/* Ad after summary */}
        <InContentAd />

        {/* Calculator Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-xl font-semibold text-foreground mb-6 text-center">
              Customize Your Hours and State
            </h2>
            <HourlyRateCalculator initialRate={rate} initialHours={40} />
          </div>
        </section>

        {/* Detailed Breakdown */}
        <section className="py-12 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-8">
                {rateDisplay}/Hour Salary Breakdown
              </h2>

              <div className="rounded-2xl bg-card/60 dark:bg-card/40 overflow-hidden ring-1 ring-border/50">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Description</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Yearly</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Monthly</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-foreground hidden sm:table-cell">Weekly</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr>
                      <td className="px-4 py-3 text-sm text-foreground">Gross Salary</td>
                      <td className="px-4 py-3 text-sm text-right text-foreground">{formatCurrency(annual, 0)}</td>
                      <td className="px-4 py-3 text-sm text-right text-foreground">{formatCurrency(annual / 12)}</td>
                      <td className="px-4 py-3 text-sm text-right text-foreground hidden sm:table-cell">{formatCurrency(annual / 52)}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-muted-foreground">Standard Deduction</td>
                      <td className="px-4 py-3 text-sm text-right text-muted-foreground">{formatCurrency(result.yearly.standardDeduction, 0)}</td>
                      <td className="px-4 py-3 text-sm text-right text-muted-foreground">{formatCurrency(result.monthly.standardDeduction)}</td>
                      <td className="px-4 py-3 text-sm text-right text-muted-foreground hidden sm:table-cell">{formatCurrency(result.weekly.standardDeduction)}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-foreground">Taxable Income</td>
                      <td className="px-4 py-3 text-sm text-right text-foreground">{formatCurrency(result.yearly.taxableIncome, 0)}</td>
                      <td className="px-4 py-3 text-sm text-right text-foreground">{formatCurrency(result.monthly.taxableIncome)}</td>
                      <td className="px-4 py-3 text-sm text-right text-foreground hidden sm:table-cell">{formatCurrency(result.weekly.taxableIncome)}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-foreground">Federal Tax</td>
                      <td className="px-4 py-3 text-sm text-right text-destructive">-{formatCurrency(result.yearly.federalTax, 0)}</td>
                      <td className="px-4 py-3 text-sm text-right text-destructive">-{formatCurrency(result.monthly.federalTax)}</td>
                      <td className="px-4 py-3 text-sm text-right text-destructive hidden sm:table-cell">-{formatCurrency(result.weekly.federalTax)}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-foreground">Social Security</td>
                      <td className="px-4 py-3 text-sm text-right text-destructive">-{formatCurrency(result.yearly.socialSecurity, 0)}</td>
                      <td className="px-4 py-3 text-sm text-right text-destructive">-{formatCurrency(result.monthly.socialSecurity)}</td>
                      <td className="px-4 py-3 text-sm text-right text-destructive hidden sm:table-cell">-{formatCurrency(result.weekly.socialSecurity)}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-foreground">Medicare</td>
                      <td className="px-4 py-3 text-sm text-right text-destructive">-{formatCurrency(result.yearly.medicare, 0)}</td>
                      <td className="px-4 py-3 text-sm text-right text-destructive">-{formatCurrency(result.monthly.medicare)}</td>
                      <td className="px-4 py-3 text-sm text-right text-destructive hidden sm:table-cell">-{formatCurrency(result.weekly.medicare)}</td>
                    </tr>
                    <tr className="font-semibold">
                      <td className="px-4 py-3 text-sm text-foreground">Total Deductions</td>
                      <td className="px-4 py-3 text-sm text-right text-destructive">-{formatCurrency(result.yearly.totalDeductions, 0)}</td>
                      <td className="px-4 py-3 text-sm text-right text-destructive">-{formatCurrency(result.monthly.totalDeductions)}</td>
                      <td className="px-4 py-3 text-sm text-right text-destructive hidden sm:table-cell">-{formatCurrency(result.weekly.totalDeductions)}</td>
                    </tr>
                    <tr className="bg-accent/5 font-bold">
                      <td className="px-4 py-3 text-sm text-foreground">Take Home Pay</td>
                      <td className="px-4 py-3 text-sm text-right text-accent">{formatCurrency(result.yearly.takeHomePay, 0)}</td>
                      <td className="px-4 py-3 text-sm text-right text-accent">{formatCurrency(result.monthly.takeHomePay)}</td>
                      <td className="px-4 py-3 text-sm text-right text-accent hidden sm:table-cell">{formatCurrency(result.weekly.takeHomePay)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                * Based on 40 hours per week, 52 weeks per year, single filer in Texas (no state tax). Tax rates for {TAX_YEAR}.
              </p>
            </div>
          </div>
        </section>

        {/* Ad */}
        <InArticleAd />

        {/* Hours Comparison */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {rateDisplay}/Hour at Different Hours Per Week
              </h2>
              <p className="text-muted-foreground mb-8">
                See how your take-home pay changes based on hours worked
              </p>

              <div className="rounded-2xl bg-card/60 dark:bg-card/40 overflow-hidden ring-1 ring-border/50">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Hours/Week</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Annual Salary</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Monthly Net</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-foreground hidden sm:table-cell">Yearly Net</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {hoursVariations.map((hours) => {
                      const annualForHours = hourlyToAnnual(rate, hours)
                      const resultForHours = calculateSalary({
                        grossSalary: annualForHours,
                        filingStatus: 'single',
                        state: 'TX',
                      })
                      const isStandard = hours === 40
                      return (
                        <tr key={hours} className={isStandard ? 'bg-accent/5' : ''}>
                          <td className="px-4 py-3 text-sm font-medium text-foreground">
                            {hours} hours {isStandard && <span className="text-accent text-xs">(full-time)</span>}
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-muted-foreground">
                            {formatCurrency(annualForHours, 0)}
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-semibold text-accent">
                            {formatCurrency(resultForHours.monthly.takeHomePay)}
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-muted-foreground hidden sm:table-cell">
                            {formatCurrency(resultForHours.yearly.takeHomePay, 0)}
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

        {/* Related Hourly Rates */}
        {relatedRates.length > 0 && (
          <section className="py-12 bg-muted/30 border-t border-border/40">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-xl font-bold text-foreground mb-6">
                  Compare Similar Hourly Rates
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {relatedRates.map((r) => {
                    const annualR = hourlyToAnnual(r)
                    const resultR = calculateSalary({
                      grossSalary: annualR,
                      filingStatus: 'single',
                      state: 'TX',
                    })
                    return (
                      <Link
                        key={r}
                        href={`/hourly/${r}`}
                        className="rounded-2xl bg-card/60 dark:bg-card/40 p-4 ring-1 ring-border/50 hover:ring-accent/50 transition-all"
                      >
                        <div className="text-lg font-bold text-foreground">
                          {formatRate(r)}/hr
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {formatCurrency(annualR, 0)}/yr
                        </div>
                        <div className="text-sm text-accent mt-1">
                          {formatCurrency(resultR.monthly.takeHomePay)}/mo
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SEO Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto prose prose-sm">
              <h2 className="text-xl font-bold text-foreground mb-4">
                Understanding {rateDisplay} Per Hour Salary
              </h2>
              <div className="text-sm text-muted-foreground space-y-4 leading-relaxed">
                <p>
                  Earning {rateDisplay} per hour in the US translates to an annual salary of {formatCurrency(annual, 0)} when
                  working full-time (40 hours per week, 52 weeks per year). After federal income tax and FICA taxes
                  (Social Security and Medicare) for the {TAX_YEAR} tax year, your take-home pay is approximately
                  {' '}{formatCurrency(result.yearly.takeHomePay, 0)} per year or {formatCurrency(result.monthly.takeHomePay)} per month.
                </p>
                <p>
                  Your effective tax rate at this income level is {result.yearly.effectiveTaxRate.toFixed(1)}%, meaning you keep
                  approximately ${((1 - result.yearly.effectiveTaxRate / 100) * 100).toFixed(0)} cents for every $1 earned.
                  This example assumes single filing status in a state with no income tax (like Texas).
                </p>
                <p>
                  If you work part-time or different hours, use the calculator above to see your personalized take-home pay.
                  You can also explore our <Link href="/" className="text-accent hover:underline">salary calculator</Link> for
                  more detailed breakdowns including state taxes, 401(k) contributions, and different filing statuses.
                </p>
              </div>
            </div>
          </div>
        </section>

        <RelatedCalculators calculators={salaryCalculators} />
        {/* Footer Ad */}
        <FooterAd />
      </main>
    </SidebarLayout>
  )
}

function SummaryCard({
  label,
  value,
  subtext,
  highlight = false,
}: {
  label: string
  value: string
  subtext: string
  highlight?: boolean
}) {
  return (
    <div
      className={`rounded-2xl p-4 text-center ring-1 ${
        highlight
          ? 'bg-emerald-50 dark:bg-emerald-950/30 ring-emerald-200 dark:ring-emerald-800'
          : 'bg-card/60 dark:bg-card/40 ring-border/50'
      }`}
    >
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className={`text-xl font-bold ${highlight ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground'}`}>
        {value}
      </div>
      <div className="text-xs text-muted-foreground">{subtext}</div>
    </div>
  )
}
