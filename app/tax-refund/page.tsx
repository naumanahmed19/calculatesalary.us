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
  name: 'UK Tax Refund Calculator',
  description: `Check if you're owed a tax refund from HMRC for ${TAX_YEAR}`,
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
      name: 'How do I know if I\'m owed a tax refund?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You may be owed a refund if: you were on the wrong tax code, you have unclaimed work expenses (uniforms, tools, professional fees), you worked from home, you paid into a pension without claiming higher rate relief, or you left a job part way through the year.',
      },
    },
    {
      '@type': 'Question',
      name: 'How far back can I claim a tax refund UK?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can claim tax refunds for the last 4 complete tax years. For example, in 2025/26 you can claim back to 2021/22. Claims older than 4 years are generally not accepted.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does HMRC take to process a tax refund?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'HMRC typically processes tax refunds within 5 days for online claims. Paper claims can take up to 6 weeks. Refunds are paid by cheque or directly to your bank account.',
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
                UK Tax Refund Calculator
              </h1>
              <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
                Check if HMRC owes you money. Many people overpay tax due to wrong tax codes,
                unclaimed expenses, or missed reliefs.
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
                  <h3 className="font-semibold text-foreground mb-2">Wrong Tax Code</h3>
                  <p className="text-sm text-muted-foreground">
                    If you&apos;re on an emergency tax code (like BR or 0T) instead of 1257L,
                    you could be overpaying by hundreds or thousands of pounds.
                  </p>
                </div>

                <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                  <h3 className="font-semibold text-foreground mb-2">Work From Home</h3>
                  <p className="text-sm text-muted-foreground">
                    If your employer required you to work from home, you can claim £6/week
                    (£312/year) tax relief, worth £62-£140 depending on your tax rate.
                  </p>
                </div>

                <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                  <h3 className="font-semibold text-foreground mb-2">Uniform & Tools</h3>
                  <p className="text-sm text-muted-foreground">
                    If you wash your own work uniform or buy tools for work, you can claim
                    a flat rate allowance of £60-£140 per year depending on your job.
                  </p>
                </div>

                <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                  <h3 className="font-semibold text-foreground mb-2">Professional Subscriptions</h3>
                  <p className="text-sm text-muted-foreground">
                    Subscriptions to HMRC-approved professional bodies (like CIMA, RICS, BMA)
                    are tax deductible if required for your job.
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
                <h3 className="font-semibold text-foreground mb-3">How to Claim Your Refund</h3>
                <p className="text-sm text-muted-foreground">
                  For PAYE employees, you can claim many refunds through HMRC&apos;s online portal
                  without needing a Self Assessment. For larger claims or multiple sources of income,
                  you may need to file a Self Assessment tax return.
                </p>
              </div>

              <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                <h3 className="font-semibold text-foreground mb-3">Avoid Tax Refund Companies</h3>
                <p className="text-sm text-muted-foreground">
                  Be cautious of companies offering to claim refunds for you. They often charge
                  20-50% of your refund as fees. You can claim directly from HMRC for free
                  using forms P87 (expenses) or P50 (overpaid tax).
                </p>
              </div>

              <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                <h3 className="font-semibold text-foreground mb-3">Check Your Tax Code</h3>
                <p className="text-sm text-muted-foreground">
                  Your tax code is shown on your payslip. The standard code 1257L means you get
                  £12,570 tax-free. If yours is different, use our{' '}
                  <Link href="/tax-code-checker" className="text-accent hover:underline">
                    tax code checker
                  </Link>{' '}
                  to see what it means.
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
