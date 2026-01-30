import type { Metadata } from 'next'
import Link from 'next/link'
import { SidebarLayout } from '@/components/sidebar-layout'
import { TaxRefundCalculator } from '@/components/tax-refund-calculator'
import { TAX_YEAR } from '@/lib/us-tax-calculator'
import { generateBreadcrumbSchema, BREADCRUMB_ITEMS } from '@/lib/breadcrumb-schema'
import { HeaderAd, MobileHeaderAd, InContentAd, FooterAd } from '@/components/ad-unit'
import { RelatedCalculators, taxCalculators } from '@/components/related-calculators'

export const metadata: Metadata = {
  title: `US Tax Refund Calculator ${TAX_YEAR} - Estimate Your IRS Refund`,
  description: `Find out if you're owed a tax refund from the IRS. Estimate your federal tax refund based on withholdings, deductions, and credits for ${TAX_YEAR}.`,
  keywords: [
    'tax refund calculator us',
    'am i owed a tax refund',
    'irs tax refund',
    'federal tax refund',
    'tax refund estimator us',
    'overpaid tax us',
    'w4 withholding refund',
    TAX_YEAR,
  ],
  openGraph: {
    title: `US Tax Refund Calculator ${TAX_YEAR} - Estimate Your IRS Refund`,
    description: 'Find out if you\'re owed a tax refund from the IRS.',
    type: 'website',
    locale: 'en_US',
  },
  alternates: {
    canonical: '/tax-refund',
  },
}

// Structured data for SEO
const taxRefundSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'US Tax Refund Calculator',
  description: `Check if you're owed a tax refund from the IRS for ${TAX_YEAR}`,
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
      name: 'How do I know if I\'m owed a tax refund?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You may be owed a refund if: you had too much withheld from your paycheck (check your W-4), you qualify for refundable credits like EITC or Child Tax Credit, you had significant deductions (mortgage interest, student loans, medical expenses), or you overpaid estimated taxes.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does the IRS take to process a tax refund?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The IRS typically processes e-filed returns in 21 days or less. Paper returns can take 6-8 weeks. You can check your refund status using the "Where\'s My Refund?" tool on IRS.gov or the IRS2Go mobile app.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the average tax refund in the US?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The average federal tax refund is approximately $3,000. However, this varies widely based on income, withholding elections, filing status, and eligible credits and deductions.',
      },
    },
  ],
}

const breadcrumbSchema = generateBreadcrumbSchema([
  BREADCRUMB_ITEMS.home,
  { name: 'Tax Refund Calculator', href: '/tax-refund' },
])

export default function TaxRefundPage() {
  return (
    <SidebarLayout>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(taxRefundSchema) }}
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
                US Tax Refund Calculator
              </h1>
              <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
                Check if the IRS owes you money. Many people overpay taxes due to incorrect W-4
                withholdings or unclaimed credits and deductions.
              </p>
            </div>
          </div>
        </section>

        {/* Calculator */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <TaxRefundCalculator />
          </div>
        </section>

        {/* Ad after calculator */}
        <InContentAd />

        {/* Common Refund Reasons */}
        <section className="py-12 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
                Common Reasons for Tax Refunds
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                  <h3 className="font-semibold text-foreground mb-2">Overwithholding</h3>
                  <p className="text-sm text-muted-foreground">
                    If your W-4 is set to withhold too much, you&apos;ll get a refund but you&apos;re
                    essentially giving the IRS an interest-free loan. Consider adjusting your W-4
                    for larger paychecks instead.
                  </p>
                </div>

                <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                  <h3 className="font-semibold text-foreground mb-2">Earned Income Tax Credit</h3>
                  <p className="text-sm text-muted-foreground">
                    The EITC is a refundable credit worth up to $7,430 for low-to-moderate income
                    workers. It&apos;s especially valuable for families with children and can result
                    in a significant refund.
                  </p>
                </div>

                <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                  <h3 className="font-semibold text-foreground mb-2">Child Tax Credit</h3>
                  <p className="text-sm text-muted-foreground">
                    The Child Tax Credit is worth up to $2,000 per qualifying child, with up to
                    $1,700 refundable as the Additional Child Tax Credit. This can significantly
                    increase your refund.
                  </p>
                </div>

                <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                  <h3 className="font-semibold text-foreground mb-2">Deductions & Adjustments</h3>
                  <p className="text-sm text-muted-foreground">
                    Student loan interest, retirement contributions (Traditional IRA/401k), HSA
                    contributions, and itemized deductions (mortgage interest, state taxes, charity)
                    can all reduce your tax bill.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-12 bg-muted/30 border-t border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                <h3 className="font-semibold text-foreground mb-3">How to Get Your Refund</h3>
                <p className="text-sm text-muted-foreground">
                  File your federal tax return (Form 1040) by April 15th to claim your refund.
                  E-file with direct deposit is the fastest way - most refunds arrive within 21 days.
                  You can file free through IRS Free File if your income is under $79,000.
                </p>
              </div>

              <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                <h3 className="font-semibold text-foreground mb-3">Check Your Refund Status</h3>
                <p className="text-sm text-muted-foreground">
                  Track your refund using the IRS "Where&apos;s My Refund?" tool at IRS.gov or the
                  IRS2Go mobile app. You&apos;ll need your Social Security number, filing status,
                  and exact refund amount.
                </p>
              </div>

              <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                <h3 className="font-semibold text-foreground mb-3">Optimize Your Withholding</h3>
                <p className="text-sm text-muted-foreground">
                  Use the IRS Tax Withholding Estimator to check if your W-4 is set correctly.
                  Ideally, you want minimal refund or tax owed - a large refund means you
                  could have had that money throughout the year instead.
                </p>
              </div>
            </div>
          </div>
        </section>

        <RelatedCalculators calculators={taxCalculators} />
        {/* Footer Ad */}
        <FooterAd />
      </main>
    </SidebarLayout>
  )
}
