import type { Metadata } from 'next'
import Link from 'next/link'
import { SidebarLayout } from '@/components/sidebar-layout'
import { RelatedCalculators, salaryCalculators } from '@/components/related-calculators'
import { IncomePercentileCalculator } from '@/components/income-percentile-calculator'
import { TAX_YEAR, formatCurrency } from '@/lib/us-tax-calculator'
import { HeaderAd, MobileHeaderAd, InContentAd, InArticleAd, FooterAd } from '@/components/ad-unit'

export const metadata: Metadata = {
  title: `UK Income Percentile Calculator ${TAX_YEAR} - Where Do You Rank?`,
  description: `Find out where your salary ranks in the UK. See if you're in the top 10%, top 1%, or where you fall in the income distribution. Compare your earnings to UK averages for ${TAX_YEAR}.`,
  keywords: [
    'uk income percentile',
    'salary percentile uk',
    'am i rich uk',
    'top 10 percent salary uk',
    'top 1 percent income uk',
    'uk salary ranking',
    'where does my salary rank uk',
    'income distribution uk',
    'uk wage percentile',
    TAX_YEAR,
  ],
  openGraph: {
    title: `UK Income Percentile Calculator ${TAX_YEAR} - Where Do You Rank?`,
    description: 'Find out where your salary ranks compared to all UK earners.',
    type: 'website',
    locale: 'en_GB',
  },
  alternates: {
    canonical: '/income-percentile',
  },
}

const percentileSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'UK Income Percentile Calculator',
  description: `Calculate your income percentile ranking in the UK for ${TAX_YEAR}`,
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'GBP',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What salary puts you in the top 10% in the UK?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'To be in the top 10% of UK earners, you need to earn approximately £60,000 or more per year. This puts you ahead of 90% of all UK taxpayers.',
      },
    },
    {
      '@type': 'Question',
      name: 'What salary is top 1% in the UK?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'To be in the top 1% of UK earners, you need to earn around £180,000 or more per year. The top 1% of taxpayers contribute about 30% of all income tax collected.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the median salary in the UK?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The median UK salary is approximately £35,000 per year (2024 data). This means half of all workers earn more than this, and half earn less.',
      },
    },
    {
      '@type': 'Question',
      name: 'Am I rich if I earn £100,000?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'At £100,000, you\'re in approximately the top 3-4% of UK earners. While this is well above average, perception of "rich" varies. You\'d have a comfortable lifestyle but may not feel wealthy, especially in London.',
      },
    },
  ],
}

// UK income percentile data (approximated from HMRC statistics)
const PERCENTILE_DATA = [
  { percentile: 10, salary: 15000 },
  { percentile: 20, salary: 20000 },
  { percentile: 25, salary: 23000 },
  { percentile: 30, salary: 25000 },
  { percentile: 40, salary: 28000 },
  { percentile: 50, salary: 35000 },
  { percentile: 60, salary: 40000 },
  { percentile: 70, salary: 47000 },
  { percentile: 75, salary: 52000 },
  { percentile: 80, salary: 55000 },
  { percentile: 90, salary: 60000 },
  { percentile: 95, salary: 80000 },
  { percentile: 99, salary: 180000 },
]

export default function IncomePercentilePage() {
  return (
    <SidebarLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(percentileSchema) }}
      />
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
                Based on HMRC Data
              </span>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground text-balance mb-4">
                UK Income Percentile Calculator
              </h1>
              <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
                Find out where your salary ranks compared to all UK earners. Are you in the top 10%?
                Top 1%? See exactly where you stand.
              </p>
            </div>
          </div>
        </section>

        {/* Calculator */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <IncomePercentileCalculator />
          </div>
        </section>

        <InContentAd />

        {/* Percentile Table */}
        <section className="py-12 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-4 text-center">
                UK Income Percentile Reference Table
              </h2>
              <p className="text-muted-foreground text-center mb-8">
                Approximate salary thresholds for each percentile band
              </p>

              <div className="rounded-2xl bg-card/60 dark:bg-card/40 overflow-hidden ring-1 ring-border/50">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Percentile</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Salary</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-foreground hidden sm:table-cell">Meaning</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {PERCENTILE_DATA.map((row) => (
                      <tr key={row.percentile} className="hover:bg-muted/30">
                        <td className="px-4 py-3 text-sm font-medium text-foreground">
                          Top {100 - row.percentile}%
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-accent font-semibold">
                          {formatCurrency(row.salary, 0)}+
                        </td>
                        <td className="px-4 py-3 text-sm text-right text-muted-foreground hidden sm:table-cell">
                          Earn more than {row.percentile}% of UK
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Data based on HMRC income statistics. Includes all UK taxpayers.
              </p>
            </div>
          </div>
        </section>

        {/* Key Thresholds */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
                Key Income Thresholds
              </h2>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50 text-center">
                  <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Threshold</div>
                  <div className="text-2xl font-bold text-foreground">Top 25%</div>
                  <div className="text-lg text-accent mt-1">£52,000+</div>
                  <p className="text-sm text-muted-foreground mt-3">
                    You earn more than three-quarters of UK workers
                  </p>
                </div>

                <div className="rounded-2xl bg-accent/5 p-6 ring-1 ring-accent/20 text-center">
                  <div className="text-xs text-accent uppercase tracking-wide mb-2">Popular Target</div>
                  <div className="text-2xl font-bold text-foreground">Top 10%</div>
                  <div className="text-lg text-accent mt-1">£60,000+</div>
                  <p className="text-sm text-muted-foreground mt-3">
                    You're in the top decile of UK earners
                  </p>
                </div>

                <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 p-6 ring-1 ring-emerald-200 dark:ring-emerald-800 text-center">
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-wide mb-2">Elite</div>
                  <div className="text-2xl font-bold text-foreground">Top 1%</div>
                  <div className="text-lg text-emerald-600 dark:text-emerald-400 mt-1">£180,000+</div>
                  <p className="text-sm text-muted-foreground mt-3">
                    Elite earners - pays ~30% of all UK income tax
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <InArticleAd />

        {/* FAQ */}
        <section className="py-12 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
                Frequently Asked Questions
              </h2>

              <div className="space-y-6">
                {faqSchema.mainEntity.map((faq, index) => (
                  <div key={index} className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                    <h3 className="font-semibold text-foreground mb-2">{faq.name}</h3>
                    <p className="text-muted-foreground text-sm">{faq.acceptedAnswer.text}</p>
                  </div>
                ))}
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
