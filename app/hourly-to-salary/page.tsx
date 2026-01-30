import type { Metadata } from 'next'
import Link from 'next/link'
import { SidebarLayout } from '@/components/sidebar-layout'
import { HourlyRateCalculator } from '@/components/hourly-rate-calculator'
import { TAX_YEAR, formatCurrency, calculateSalary } from '@/lib/us-tax-calculator'
import { HeaderAd, MobileHeaderAd, InContentAd, FooterAd } from '@/components/ad-unit'
import { RelatedCalculators, salaryCalculators } from '@/components/related-calculators'

export const metadata: Metadata = {
  title: `Hourly to Salary Calculator ${TAX_YEAR} | Convert Hourly Wage to Annual Pay`,
  description: `Convert hourly wage to annual salary and monthly take-home pay in the USA. Calculate what your hourly rate equals after federal tax and FICA for ${TAX_YEAR}.`,
  keywords: [
    'hourly to salary calculator',
    'hourly to annual salary usa',
    'convert hourly to yearly salary',
    'hourly wage to annual salary',
    'hourly rate to salary calculator',
    'what is my annual salary from hourly rate',
    'hourly to monthly salary calculator',
    TAX_YEAR,
  ],
  openGraph: {
    title: `Hourly to Salary Calculator ${TAX_YEAR} - Convert Hourly to Annual`,
    description: 'Calculate your annual salary and monthly take-home pay from your hourly rate.',
    type: 'website',
    locale: 'en_US',
  },
  alternates: {
    canonical: '/hourly-to-salary',
  },
}

const COMMON_HOURLY_RATES = [
  7.25, 10, 12, 15, 16.50, 18, 20, 22, 25, 28, 30, 35, 40, 45, 50, 60, 75, 100
]

function hourlyToAnnual(hourlyRate: number, hoursPerWeek: number = 40): number {
  return hourlyRate * hoursPerWeek * 52
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I convert hourly wage to annual salary?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Multiply your hourly rate by the number of hours you work per week, then multiply by 52 (weeks in a year). For example, $25 per hour x 40 hours x 52 weeks = $52,000 per year.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is $20 per hour as an annual salary?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'At $20 per hour working 40 hours per week, your annual salary would be $41,600 before tax. After federal tax and FICA, your take-home pay would be approximately $33,800 per year or $2,816 per month (in a no-tax state).',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I calculate monthly take-home pay from hourly rate?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'First convert hourly to annual (hourly x hours/week x 52), then subtract federal income tax (10-37% depending on bracket), Social Security (6.2%), Medicare (1.45%), and state tax if applicable. Divide the result by 12 for monthly take-home.',
      },
    },
  ],
}

export default function HourlyToSalaryPage() {
  return (
    <SidebarLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="flex-1">
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
                Hourly to Salary Calculator
              </h1>
              <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
                Convert your hourly wage to annual salary and see your monthly take-home pay
                after federal tax, state tax, and FICA deductions.
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

        <InContentAd />

        {/* Popular Hourly Rates */}
        <section className="py-12 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-4 text-center">
                Popular Hourly Rate Conversions
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
                      href={`/hourly-to-salary/${rate}`}
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
                            <Link href={`/hourly-to-salary/${rate}`} className="text-accent hover:underline">
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
                * Based on 40 hours per week, 52 weeks per year, single filer in a no-tax state. Actual take-home pay varies by state.
              </p>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-12 bg-muted/30 border-t border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                <h3 className="font-semibold text-foreground mb-3">How to Convert Hourly to Salary</h3>
                <p className="text-sm text-muted-foreground">
                  The formula is simple: <strong className="text-foreground">Hourly Rate × Hours per Week × 52 weeks = Annual Salary</strong>.
                  For example, $25/hour × 40 hours × 52 weeks = $52,000 per year. This calculator then deducts
                  federal income tax, Social Security (6.2%), Medicare (1.45%), and state tax to show your actual take-home pay.
                </p>
              </div>

              <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                <h3 className="font-semibold text-foreground mb-3">Federal Minimum Wage vs State Minimums</h3>
                <p className="text-sm text-muted-foreground">
                  The federal minimum wage is $7.25/hour ($15,080/year). However, many states have higher minimums:
                  California ($16.50), Washington ($16.28), Massachusetts ($15), and New York ($15-16 depending on location).
                  Always check your state's current minimum wage.
                </p>
              </div>

              <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                <h3 className="font-semibold text-foreground mb-3">State Income Tax Impact</h3>
                <p className="text-sm text-muted-foreground">
                  The default calculations assume no state income tax (like Texas, Florida, or Nevada).
                  If you live in a state with income tax (California up to 13.3%, New York up to 10.9%),
                  your take-home pay will be lower. Use the calculator above to select your state for accurate results.
                </p>
              </div>
            </div>
          </div>
        </section>

        <RelatedCalculators calculators={salaryCalculators} />
        <FooterAd />
      </main>
    </SidebarLayout>
  )
}
