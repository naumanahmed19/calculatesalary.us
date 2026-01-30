import type { Metadata } from 'next'
import Link from 'next/link'
import { SidebarLayout } from '@/components/sidebar-layout'
import { HourlyRateCalculator } from '@/components/hourly-rate-calculator'
import { TAX_YEAR, formatCurrency, calculateSalary } from '@/lib/us-tax-calculator'
import { generateBreadcrumbSchema, BREADCRUMB_ITEMS } from '@/lib/breadcrumb-schema'
import { HeaderAd, MobileHeaderAd, InContentAd, FooterAd } from '@/components/ad-unit'
import { RelatedCalculators, salaryCalculators } from '@/components/related-calculators'

export const metadata: Metadata = {
  title: `US Hourly Rate Calculator ${TAX_YEAR} - Hourly to Annual Salary After Tax`,
  description: `Convert hourly wage to annual salary and monthly take-home pay in the USA. See what $X per hour equals after federal tax and FICA for ${TAX_YEAR}.`,
  keywords: [
    'hourly to annual salary usa',
    'hourly rate calculator usa',
    'hourly salary calculator usa',
    'per hour annual salary usa',
    'hourly to monthly salary usa after tax',
    'hourly wage calculator usa',
    'what is my annual salary from hourly rate',
    TAX_YEAR,
  ],
  openGraph: {
    title: `US Hourly Rate Calculator ${TAX_YEAR} - Convert Hourly to Annual Salary`,
    description: 'Calculate your annual salary and monthly take-home pay from your hourly rate.',
    type: 'website',
    locale: 'en_US',
  },
  alternates: {
    canonical: '/hourly',
  },
}

// Common hourly rates including federal minimum wage and common wages
const COMMON_HOURLY_RATES = [
  7.25, 10, 12, 15, 16.50, 18, 20, 22, 25, 28, 30, 35, 40, 45, 50, 60, 75, 100
]

// Calculate annual salary from hourly rate (standard 40 hours, 52 weeks)
function hourlyToAnnual(hourlyRate: number, hoursPerWeek: number = 40): number {
  return hourlyRate * hoursPerWeek * 52
}

// Structured data for SEO
const hourlyCalcSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'US Hourly Rate Calculator',
  description: `Convert hourly wage to annual salary and take-home pay for ${TAX_YEAR}`,
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I calculate my annual salary from hourly rate?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Multiply your hourly rate by the number of hours you work per week, then multiply by 52 (weeks in a year). For example, $25 per hour x 40 hours x 52 weeks = $52,000 per year.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is $25 per hour as an annual salary in the USA?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'At $25 per hour working 40 hours per week, your annual salary would be $52,000 before tax. After federal tax and FICA, your take-home pay would be approximately $41,500 per year or $3,458 per month (in a no-tax state).',
      },
    },
    {
      '@type': 'Question',
      name: 'How many hours is full-time in the USA?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Full-time work in the USA is typically 40 hours per week. The Fair Labor Standards Act (FLSA) requires overtime pay for hours worked over 40 in a workweek for non-exempt employees.',
      },
    },
  ],
}

const breadcrumbSchema = generateBreadcrumbSchema([
  BREADCRUMB_ITEMS.home,
  BREADCRUMB_ITEMS.hourly,
])

export default function HourlyRatePage() {
  return (
    <SidebarLayout>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hourlyCalcSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="flex-1">
        {/* Top Ad */}
        <HeaderAd />
        <MobileHeaderAd />

        {/* Hero */}
        <section className="py-12 md:py-16 border-b border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-flex items-center rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent mb-6">
                {TAX_YEAR} Tax Year
              </span>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground text-balance mb-4">
                US Hourly Rate Calculator
              </h1>
              <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
                Convert your hourly wage to annual salary and see your monthly take-home pay
                after federal tax and FICA.
              </p>
            </div>
          </div>
        </section>

        {/* Calculator */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <HourlyRateCalculator />
          </div>
        </section>

        {/* Ad after calculator */}
        <InContentAd />

        {/* Popular Hourly Rates */}
        <section className="py-12 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-4 text-center">
                Popular Hourly Rate Calculations
              </h2>
              <p className="text-muted-foreground text-center mb-8">
                See annual salary and take-home pay for common US hourly rates
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {COMMON_HOURLY_RATES.slice(0, 18).map((rate) => {
                  const annual = hourlyToAnnual(rate)
                  const result = calculateSalary({
                    grossSalary: annual,
                    filingStatus: 'single',
                    state: 'TX',
                  })
                  return (
                    <Link
                      key={rate}
                      href={`/hourly/${rate}`}
                      className="rounded-2xl bg-card/60 dark:bg-card/40 p-4 text-center ring-1 ring-border/50 hover:ring-accent/50 transition-all"
                    >
                      <div className="text-lg font-bold text-foreground">
                        ${rate}/hr
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatCurrency(annual, 0)}/yr
                      </div>
                      <div className="text-xs text-accent mt-1">
                        {formatCurrency(result.monthly.takeHomePay)}/mo
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Quick Reference Table */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-8">
                Hourly to Annual Salary Conversion Table
              </h2>

              <div className="rounded-2xl bg-card/60 dark:bg-card/40 overflow-hidden ring-1 ring-border/50">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Hourly Rate</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Annual Salary</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Monthly Take-Home</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-foreground hidden sm:table-cell">Yearly Take-Home</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {[7.25, 15, 20, 25, 30, 40, 50, 75].map((rate) => {
                      const annual = hourlyToAnnual(rate)
                      const result = calculateSalary({
                        grossSalary: annual,
                        filingStatus: 'single',
                        state: 'TX',
                      })
                      return (
                        <tr key={rate} className="hover:bg-muted/30">
                          <td className="px-4 py-3 text-sm font-medium text-foreground">
                            <Link href={`/hourly/${rate}`} className="text-accent hover:underline">
                              ${rate.toFixed(2)}/hour
                            </Link>
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-muted-foreground">
                            {formatCurrency(annual, 0)}
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-semibold text-accent">
                            {formatCurrency(result.monthly.takeHomePay)}
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-muted-foreground hidden sm:table-cell">
                            {formatCurrency(result.yearly.takeHomePay, 0)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                * Based on 40 hours per week, 52 weeks per year, single filer in a no-tax state. Actual take-home pay may vary.
              </p>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-12 bg-muted/30 border-t border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                <h3 className="font-semibold text-foreground mb-3">Federal Minimum Wage {TAX_YEAR}</h3>
                <p className="text-sm text-muted-foreground">
                  The federal minimum wage is $7.25 per hour since 2009. However, many states have higher minimum wages.
                  California's minimum wage is $16.50/hour, while Washington state's is $16.28/hour. At federal minimum wage
                  working 40 hours/week, annual salary is $15,080 with monthly take-home of approximately $1,203.
                </p>
              </div>

              <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                <h3 className="font-semibold text-foreground mb-3">How the Calculation Works</h3>
                <p className="text-sm text-muted-foreground">
                  Annual salary is calculated by multiplying your hourly rate by hours worked per week,
                  then by 52 weeks. For example: $25/hour x 40 hours x 52 weeks = $52,000 per year.
                  Take-home pay is then calculated after federal income tax, Social Security (6.2%),
                  and Medicare (1.45%) deductions.
                </p>
              </div>

              <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                <h3 className="font-semibold text-foreground mb-3">State Income Tax Impact</h3>
                <p className="text-sm text-muted-foreground">
                  The calculations above assume no state income tax (e.g., Texas, Florida, Nevada).
                  If you live in a state with income tax like California (up to 13.3%) or New York (up to 10.9%),
                  your take-home pay will be lower. Use the calculator above to select your state for accurate results.
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
