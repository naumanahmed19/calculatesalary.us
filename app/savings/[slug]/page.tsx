import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SidebarLayout } from '@/components/sidebar-layout'
import { SavingsCalculator, SavingsBreakdownTable } from '@/components/savings-calculator'
import { generateBreadcrumbSchema, BREADCRUMB_ITEMS } from '@/lib/breadcrumb-schema'
import { HeaderAd, InContentAd, FooterAd } from '@/components/ad-unit'
import { RelatedCalculators, salaryCalculators } from '@/components/related-calculators'
import {
  parseSavingsSlug,
  generateSavingsPageMeta,
  generateSavingsFAQSchema,
  getAllSavingsSlugs,
  calculateSavings,
  formatSavingsCurrency,
  COMMON_MONTHLY_AMOUNTS,
  COMMON_INTEREST_RATES,
  COMMON_TIME_PERIODS,
} from '@/lib/savings-calculator'

const BASE_URL = 'https://calculatesalary.us'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllSavingsSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const parsed = parseSavingsSlug(slug)

  if (!parsed) {
    return { title: 'Not Found' }
  }

  const meta = generateSavingsPageMeta(slug)

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: 'website',
      locale: 'en_US',
    },
    alternates: {
      canonical: `/savings/${slug}`,
    },
  }
}

function generateBreadcrumb(slug: string, displayName: string) {
  return generateBreadcrumbSchema([
    BREADCRUMB_ITEMS.home,
    { name: 'Savings Calculator', href: '/savings-calculator' },
    { name: displayName, href: `/savings/${slug}` },
  ])
}

export default async function SavingsSlugPage({ params }: PageProps) {
  const { slug } = await params
  const parsed = parseSavingsSlug(slug)

  if (!parsed) {
    notFound()
  }

  const meta = generateSavingsPageMeta(slug)
  const faqSchema = generateSavingsFAQSchema(slug)

  // Breadcrumb display name
  let breadcrumbName = ''
  switch (parsed.type) {
    case 'monthly':
      breadcrumbName = `$${parsed.value}/month`
      break
    case 'rate':
      breadcrumbName = `${parsed.value}% Interest`
      break
    case 'years':
      breadcrumbName = `${parsed.value} Years`
      break
    case 'goal':
      breadcrumbName = `$${parsed.value.toLocaleString()} Goal`
      break
  }

  const breadcrumbSchema = generateBreadcrumb(slug, breadcrumbName)

  // Default values
  let initialDeposit = 0
  let monthlyContribution = 200
  let interestRate = 5
  let years = 10

  // Override based on slug type
  switch (parsed.type) {
    case 'monthly':
      monthlyContribution = parsed.value
      break
    case 'rate':
      interestRate = parsed.value
      break
    case 'years':
      years = parsed.value
      break
    case 'goal':
      initialDeposit = 0
      monthlyContribution = Math.round(parsed.value / (years * 12 * 1.29))
      break
  }

  // Calculate example result for the page content
  const exampleResult = calculateSavings({
    initialDeposit,
    monthlyContribution,
    annualInterestRate: interestRate,
    years,
    compoundFrequency: 'monthly',
  })

  // Get related pages for internal linking
  const relatedMonthly = COMMON_MONTHLY_AMOUNTS.filter((a) => a !== monthlyContribution).slice(0, 4)
  const relatedRates = COMMON_INTEREST_RATES.filter((r) => r !== interestRate).slice(0, 4)
  const relatedYears = COMMON_TIME_PERIODS.filter((y) => y !== years).slice(0, 4)

  return (
    <SidebarLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <main className="flex-1">
        <HeaderAd />

        <section className="py-12 md:py-16 border-b border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Link
                href="/savings-calculator"
                className="inline-flex items-center rounded-full bg-emerald-600/10 px-4 py-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-6 hover:bg-emerald-600/20 transition-colors"
              >
                ← Savings Calculator
              </Link>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground text-balance mb-4">
                {meta.h1}
              </h1>
              {meta.answer && (
                <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
                  {meta.answer}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Quick Answer Box - Direct answer for search intent */}
        {parsed.type === 'monthly' && (
          <section className="py-8 bg-emerald-50 dark:bg-emerald-950/30 border-b border-emerald-200 dark:border-emerald-900">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto text-center">
                <div className="text-sm text-emerald-700 dark:text-emerald-300 mb-2">
                  Quick Answer
                </div>
                <div className="text-3xl md:text-4xl font-bold text-emerald-700 dark:text-emerald-300">
                  {formatSavingsCurrency(exampleResult.finalBalance)}
                </div>
                <div className="text-sm text-emerald-600 dark:text-emerald-400 mt-2">
                  after {years} years at {interestRate}% interest
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="py-12">
          <div className="container mx-auto px-4">
            <SavingsCalculator
              initialDeposit={initialDeposit}
              initialMonthlyContribution={monthlyContribution}
              initialInterestRate={interestRate}
              initialYears={years}
            />
          </div>
        </section>

        <InContentAd />

        {/* Summary Section */}
        <section className="py-12 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
                {parsed.type === 'monthly' && `$${parsed.value}/Month Savings Breakdown`}
                {parsed.type === 'rate' && `${parsed.value}% Interest Returns`}
                {parsed.type === 'years' && `${parsed.value} Year Savings Summary`}
                {parsed.type === 'goal' && `Path to $${parsed.value.toLocaleString()}`}
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-card rounded-xl p-6 ring-1 ring-border/50 text-center">
                  <div className="text-3xl font-bold text-foreground">
                    {formatSavingsCurrency(exampleResult.totalContributions)}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">Your Contributions</div>
                </div>
                <div className="bg-card rounded-xl p-6 ring-1 ring-border/50 text-center">
                  <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                    +{formatSavingsCurrency(exampleResult.totalInterestEarned)}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">Interest Earned</div>
                </div>
                <div className="bg-emerald-600 dark:bg-emerald-700 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-white">
                    {formatSavingsCurrency(exampleResult.finalBalance)}
                  </div>
                  <div className="text-sm text-emerald-100 mt-1">Total Balance</div>
                </div>
              </div>

              {parsed.type === 'monthly' && (
                <div className="mt-8 p-6 bg-card rounded-xl ring-1 ring-border/50">
                  <h3 className="font-semibold text-foreground mb-4">
                    What does saving ${parsed.value} a month get you?
                  </h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• <strong>5 years:</strong> ~{formatSavingsCurrency(parsed.value * 12 * 5 * 1.13)}</li>
                    <li>• <strong>10 years:</strong> ~{formatSavingsCurrency(exampleResult.finalBalance)}</li>
                    <li>• <strong>20 years:</strong> ~{formatSavingsCurrency(parsed.value * 12 * 20 * 1.65)}</li>
                    <li>• <strong>30 years:</strong> ~{formatSavingsCurrency(parsed.value * 12 * 30 * 2.2)}</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-4">
                    *Estimates at 5% annual interest, compounded monthly
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Yearly Breakdown */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-6">Year-by-Year Growth</h2>
              <div className="bg-card rounded-xl p-6 ring-1 ring-border/50">
                <SavingsBreakdownTable result={exampleResult} />
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section for monthly pages */}
        {faqSchema && (
          <section className="py-12 bg-muted/30 border-y border-border/40">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
                  Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                  {faqSchema.mainEntity.map((faq: { name: string; acceptedAnswer: { text: string } }, index: number) => (
                    <details
                      key={index}
                      className="group rounded-xl bg-card p-4 ring-1 ring-border/50"
                      open={index === 0}
                    >
                      <summary className="cursor-pointer font-medium text-foreground list-none flex justify-between items-center">
                        {faq.name}
                        <span className="text-muted-foreground group-open:rotate-180 transition-transform">
                          ▼
                        </span>
                      </summary>
                      <p className="mt-3 text-muted-foreground">
                        {faq.acceptedAnswer.text}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Related Links */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
                Compare Other Amounts
              </h2>

              <div className="space-y-6">
                {parsed.type !== 'monthly' && (
                  <div>
                    <h3 className="font-medium text-foreground mb-3">Different Monthly Amounts</h3>
                    <div className="flex flex-wrap gap-2">
                      {relatedMonthly.map((amount) => (
                        <Link
                          key={amount}
                          href={`/savings/${amount}-a-month`}
                          className="px-4 py-2 rounded-full bg-card ring-1 ring-border/50 text-sm hover:ring-accent/50 transition-all"
                        >
                          ${amount}/month
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {parsed.type === 'monthly' && (
                  <div>
                    <h3 className="font-medium text-foreground mb-3">Save More or Less?</h3>
                    <div className="flex flex-wrap gap-2">
                      {relatedMonthly.map((amount) => (
                        <Link
                          key={amount}
                          href={`/savings/${amount}-a-month`}
                          className="px-4 py-2 rounded-full bg-card ring-1 ring-border/50 text-sm hover:ring-accent/50 transition-all"
                        >
                          ${amount}/month
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {parsed.type !== 'rate' && (
                  <div>
                    <h3 className="font-medium text-foreground mb-3">Different Interest Rates</h3>
                    <div className="flex flex-wrap gap-2">
                      {relatedRates.map((rate) => (
                        <Link
                          key={rate}
                          href={`/savings/${rate}-percent`}
                          className="px-4 py-2 rounded-full bg-card ring-1 ring-border/50 text-sm hover:ring-accent/50 transition-all"
                        >
                          {rate}% interest
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {parsed.type !== 'years' && (
                  <div>
                    <h3 className="font-medium text-foreground mb-3">Different Time Periods</h3>
                    <div className="flex flex-wrap gap-2">
                      {relatedYears.map((y) => (
                        <Link
                          key={y}
                          href={`/savings/${y}-years`}
                          className="px-4 py-2 rounded-full bg-card ring-1 ring-border/50 text-sm hover:ring-accent/50 transition-all"
                        >
                          {y} years
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
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
