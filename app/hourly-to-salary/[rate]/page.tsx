import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { SidebarLayout } from '@/components/sidebar-layout'
import { HourlyRateCalculator } from '@/components/hourly-rate-calculator'
import { calculateSalary, formatCurrency, TAX_YEAR } from '@/lib/us-tax-calculator'
import { HeaderAd, MobileHeaderAd, InContentAd, FooterAd } from '@/components/ad-unit'
import { RelatedCalculators, salaryCalculators } from '@/components/related-calculators'

const BASE_URL = 'https://calculatesalary.us'
const COMMON_HOURLY_RATES = [10, 12, 15, 18, 20, 22, 25, 28, 30, 35, 40, 45, 50, 60, 75, 100]

interface PageProps {
  params: Promise<{ rate: string }>
}

function calculateFromHourlyRate(hourlyRate: number, hoursPerWeek: number = 40) {
  const annualSalary = hourlyRate * hoursPerWeek * 52
  const result = calculateSalary({
    grossSalary: annualSalary,
    filingStatus: 'single',
    state: 'TX',
  })
  return { annualSalary, result }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { rate } = await params
  const hourlyRate = parseFloat(rate)

  if (isNaN(hourlyRate) || hourlyRate < 1 || hourlyRate > 1000) {
    return { title: 'Hourly Rate Not Found' }
  }

  const { annualSalary, result } = calculateFromHourlyRate(hourlyRate)

  return {
    title: `$${hourlyRate} Per Hour Salary ${TAX_YEAR} | Annual & Take Home Pay`,
    description: `$${hourlyRate}/hour = $${annualSalary.toLocaleString()} annual salary. Take-home pay: ${formatCurrency(result.yearly.takeHomePay, 0)}/year (${formatCurrency(result.monthly.takeHomePay, 0)}/month). Based on 40 hours/week.`,
    keywords: [
      `$${hourlyRate} per hour salary`,
      `${hourlyRate} an hour annually`,
      `${hourlyRate} per hour yearly`,
      `${hourlyRate} hourly to salary`,
      `how much is ${hourlyRate} an hour per year`,
      `${hourlyRate} dollar an hour annual salary`,
      'hourly to annual salary calculator',
      'hourly rate calculator usa',
    ],
    openGraph: {
      title: `$${hourlyRate}/Hour - Annual Salary & Take Home Pay`,
      description: `Calculate annual salary and take-home pay on $${hourlyRate} per hour.`,
      type: 'website',
      locale: 'en_US',
    },
    alternates: {
      canonical: `${BASE_URL}/hourly-to-salary/${rate}`,
    },
  }
}

export const revalidate = false

export function generateStaticParams() {
  return COMMON_HOURLY_RATES.map((rate) => ({
    rate: rate.toString(),
  }))
}

export default async function HourlyToSalaryPage({ params }: PageProps) {
  const { rate } = await params
  const hourlyRate = parseFloat(rate)

  if (isNaN(hourlyRate) || hourlyRate < 1 || hourlyRate > 1000) {
    notFound()
  }

  const hoursOptions = [
    { hours: 20, label: 'Part-time (20hrs)' },
    { hours: 30, label: 'Reduced (30hrs)' },
    { hours: 35, label: 'Standard (35hrs)' },
    { hours: 40, label: 'Full-time (40hrs)' },
    { hours: 45, label: 'Overtime (45hrs)' },
  ]

  const breakdowns = hoursOptions.map(opt => ({
    ...opt,
    ...calculateFromHourlyRate(hourlyRate, opt.hours),
  }))

  const mainBreakdown = breakdowns.find(b => b.hours === 40)!

  const nearbyRates = COMMON_HOURLY_RATES.filter(r => Math.abs(r - hourlyRate) <= 10 && r !== hourlyRate).slice(0, 4)

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How much is $${hourlyRate} per hour annually?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `$${hourlyRate} per hour equals $${mainBreakdown.annualSalary.toLocaleString()} per year (based on 40 hours per week, 52 weeks). After federal and state taxes, your take-home pay would be approximately ${formatCurrency(mainBreakdown.result.yearly.takeHomePay, 0)} per year or ${formatCurrency(mainBreakdown.result.monthly.takeHomePay, 0)} per month.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the take home pay on $${hourlyRate} an hour?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `On $${hourlyRate}/hour (40 hours/week), your take-home pay after federal tax, state tax, and FICA (Social Security + Medicare) is approximately ${formatCurrency(mainBreakdown.result.yearly.takeHomePay, 0)} per year, ${formatCurrency(mainBreakdown.result.monthly.takeHomePay, 0)} per month, or ${formatCurrency(mainBreakdown.result.weekly.takeHomePay, 0)} per week.`,
        },
      },
      {
        '@type': 'Question',
        name: `Is $${hourlyRate} per hour a good wage in the US?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `$${hourlyRate}/hour equates to an annual salary of $${mainBreakdown.annualSalary.toLocaleString()}. The federal minimum wage is $7.25/hour (many states have higher minimums). The median US hourly wage is around $23-25/hour. $${hourlyRate}/hour is ${hourlyRate >= 25 ? 'above' : hourlyRate >= 18 ? 'around' : 'below'} the US median.`,
        },
      },
    ],
  }

  return (
    <SidebarLayout>
      <main className="flex-1">
        <HeaderAd />
        <MobileHeaderAd />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />

        {/* Hero */}
        <section className="py-12 md:py-16 border-b border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-flex items-center rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent mb-6">
                {TAX_YEAR} Tax Year
              </span>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground text-balance mb-4">
                ${hourlyRate} Per Hour Salary
              </h1>
              <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
                Calculate your annual salary and take-home pay on ${hourlyRate} per hour.
              </p>
            </div>
          </div>
        </section>

        {/* Quick Summary */}
        <section className="py-8 bg-muted/30 border-b border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <p className="text-center text-muted-foreground mb-4">Based on 40 hours per week</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="rounded-2xl bg-card p-4 text-center ring-1 ring-border">
                  <div className="text-2xl md:text-3xl font-bold text-foreground">${mainBreakdown.annualSalary.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground mt-1">Annual Salary</div>
                </div>
                <div className="rounded-2xl bg-emerald-600 dark:bg-emerald-700 p-4 text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white">{formatCurrency(mainBreakdown.result.yearly.takeHomePay, 0)}</div>
                  <div className="text-xs text-emerald-100 mt-1">Annual Take-Home</div>
                </div>
                <div className="rounded-2xl bg-card p-4 text-center ring-1 ring-border">
                  <div className="text-2xl md:text-3xl font-bold text-foreground">{formatCurrency(mainBreakdown.result.monthly.takeHomePay, 0)}</div>
                  <div className="text-xs text-muted-foreground mt-1">Monthly Take-Home</div>
                </div>
                <div className="rounded-2xl bg-card p-4 text-center ring-1 ring-border">
                  <div className="text-2xl md:text-3xl font-bold text-foreground">{formatCurrency(mainBreakdown.result.weekly.takeHomePay, 0)}</div>
                  <div className="text-xs text-muted-foreground mt-1">Weekly Take-Home</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Hours Comparison */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                ${hourlyRate}/Hour by Working Hours
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-foreground font-semibold">Hours/Week</th>
                      <th className="text-right py-3 px-4 text-foreground font-semibold">Annual Salary</th>
                      <th className="text-right py-3 px-4 text-foreground font-semibold">Annual Take-Home</th>
                      <th className="text-right py-3 px-4 text-foreground font-semibold">Monthly</th>
                      <th className="text-right py-3 px-4 text-foreground font-semibold">Weekly</th>
                    </tr>
                  </thead>
                  <tbody>
                    {breakdowns.map((b, i) => (
                      <tr key={i} className="border-b border-border/50 hover:bg-muted/30">
                        <td className="py-3 px-4 text-foreground">{b.label}</td>
                        <td className="py-3 px-4 text-right text-muted-foreground">${b.annualSalary.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(b.result.yearly.takeHomePay, 0)}</td>
                        <td className="py-3 px-4 text-right text-foreground">{formatCurrency(b.result.monthly.takeHomePay, 0)}</td>
                        <td className="py-3 px-4 text-right text-foreground">{formatCurrency(b.result.weekly.takeHomePay, 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <InContentAd />

        {/* Interactive Calculator */}
        <section className="py-12 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
              Customize Your Calculation
            </h2>
            <HourlyRateCalculator initialRate={hourlyRate} />
          </div>
        </section>

        {/* Nearby Rates */}
        {nearbyRates.length > 0 && (
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Compare Similar Hourly Rates
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {nearbyRates.map((nearbyRate) => {
                    const { annualSalary, result } = calculateFromHourlyRate(nearbyRate)
                    return (
                      <Link
                        key={nearbyRate}
                        href={`/hourly-to-salary/${nearbyRate}`}
                        className="rounded-2xl bg-card/60 p-4 ring-1 ring-border/50 hover:ring-accent/50 transition-all"
                      >
                        <div className="text-lg font-bold text-foreground">${nearbyRate}/hour</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          ${annualSalary.toLocaleString()}/year
                        </div>
                        <div className="text-sm text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                          {formatCurrency(result.monthly.takeHomePay, 0)}/month
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* FAQ Section */}
        <section className="py-12 border-t border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-8">
                Frequently Asked Questions
              </h2>

              <div className="space-y-6">
                <div className="rounded-2xl bg-card/60 p-6 ring-1 ring-border/50">
                  <h3 className="font-semibold text-foreground mb-2">
                    How much is ${hourlyRate} per hour annually?
                  </h3>
                  <p className="text-muted-foreground">
                    ${hourlyRate} per hour equals <strong className="text-foreground">${mainBreakdown.annualSalary.toLocaleString()}</strong> per year
                    (based on 40 hours per week, 52 weeks). After federal and state taxes, your take-home pay would be approximately
                    <strong className="text-foreground"> {formatCurrency(mainBreakdown.result.yearly.takeHomePay, 0)}</strong> per year or
                    <strong className="text-foreground"> {formatCurrency(mainBreakdown.result.monthly.takeHomePay, 0)}</strong> per month.
                  </p>
                </div>

                <div className="rounded-2xl bg-card/60 p-6 ring-1 ring-border/50">
                  <h3 className="font-semibold text-foreground mb-2">
                    What is the take home pay on ${hourlyRate} an hour?
                  </h3>
                  <p className="text-muted-foreground">
                    On ${hourlyRate}/hour (40 hours/week), your take-home pay after federal tax, state tax, and FICA is approximately
                    <strong className="text-foreground"> {formatCurrency(mainBreakdown.result.yearly.takeHomePay, 0)}</strong> per year,
                    <strong className="text-foreground"> {formatCurrency(mainBreakdown.result.monthly.takeHomePay, 0)}</strong> per month, or
                    <strong className="text-foreground"> {formatCurrency(mainBreakdown.result.weekly.takeHomePay, 0)}</strong> per week.
                  </p>
                </div>

                <div className="rounded-2xl bg-card/60 p-6 ring-1 ring-border/50">
                  <h3 className="font-semibold text-foreground mb-2">
                    Is ${hourlyRate} per hour a good wage in the US?
                  </h3>
                  <p className="text-muted-foreground">
                    ${hourlyRate}/hour equates to an annual salary of <strong className="text-foreground">${mainBreakdown.annualSalary.toLocaleString()}</strong>.
                    The federal minimum wage is $7.25/hour (many states have higher minimums, like $16.50 in California). The median US hourly wage is around $23-25/hour.
                    ${hourlyRate}/hour is {hourlyRate >= 30 ? 'above average and considered a good wage' : hourlyRate >= 20 ? 'around the US median' : hourlyRate >= 15 ? 'above federal minimum but below the median' : 'close to minimum wage in most states'}.
                  </p>
                </div>
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
