import type { Metadata } from 'next'
import Link from 'next/link'
import { SidebarLayout } from '@/components/sidebar-layout'
import { CapitalGainsTaxCalculator } from '@/components/capital-gains-tax-calculator'
import { TAX_YEAR, formatCurrency } from '@/lib/us-tax-calculator'
import { generateBreadcrumbSchema, BREADCRUMB_ITEMS } from '@/lib/breadcrumb-schema'
import { HeaderAd, MobileHeaderAd, InContentAd, FooterAd } from '@/components/ad-unit'
import { RelatedCalculators, taxCalculators } from '@/components/related-calculators'

export const metadata: Metadata = {
  title: `UK Capital Gains Tax Calculator ${TAX_YEAR} - Property, Shares & Assets`,
  description: `Calculate Capital Gains Tax on property, shares and other assets for ${TAX_YEAR}. See CGT rates, allowances and your tax bill.`,
  keywords: [
    'capital gains tax calculator uk',
    'cgt calculator',
    'property capital gains tax',
    'shares capital gains tax uk',
    'capital gains tax allowance',
    'capital gains tax rates 2025',
    TAX_YEAR,
  ],
  openGraph: {
    title: `UK Capital Gains Tax Calculator ${TAX_YEAR}`,
    description: 'Calculate Capital Gains Tax on property, shares and other assets.',
    type: 'website',
    locale: 'en_GB',
  },
  alternates: {
    canonical: '/capital-gains-tax',
  },
}

const cgtSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'UK Capital Gains Tax Calculator',
  description: `Calculate CGT on property and shares for ${TAX_YEAR}`,
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
      name: 'What is the Capital Gains Tax allowance for 2025/26?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The CGT annual exempt amount for 2025/26 is £3,000. This has been significantly reduced from £12,300 in 2022/23. Gains up to this amount are tax-free.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are the Capital Gains Tax rates UK?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'For 2025/26, CGT rates on residential property are 18% (basic rate) and 24% (higher rate). For other assets including shares, rates are 10% (basic rate) and 20% (higher rate).',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I pay Capital Gains Tax on my main home?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No, your main residence is exempt from CGT through Private Residence Relief. However, CGT applies to second homes and buy-to-let properties.',
      },
    },
  ],
}

const breadcrumbSchema = generateBreadcrumbSchema([
  BREADCRUMB_ITEMS.home,
  { name: 'Capital Gains Tax Calculator', href: '/capital-gains-tax' },
])

export default function CapitalGainsTaxPage() {
  return (
    <SidebarLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(cgtSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="flex-1">
        <HeaderAd />
        <MobileHeaderAd />

        <section className="py-12 md:py-16 border-b border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-flex items-center rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent mb-6">
                {TAX_YEAR} Tax Year
              </span>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground text-balance mb-4">
                UK Capital Gains Tax Calculator
              </h1>
              <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
                Calculate the CGT due on property, shares and other assets. See how your
                income affects which rate you pay.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <CapitalGainsTaxCalculator />
          </div>
        </section>

        <InContentAd />

        <section className="py-12 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-4 text-center">
                Capital Gains Tax Rates {TAX_YEAR}
              </h2>
              <p className="text-muted-foreground text-center mb-8">
                Rates depend on your total taxable income and asset type
              </p>

              <div className="rounded-2xl bg-card/60 dark:bg-card/40 overflow-hidden ring-1 ring-border/50">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Asset Type</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Basic Rate</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Higher Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr className="hover:bg-muted/30">
                      <td className="px-4 py-3 text-sm font-medium text-foreground">Residential Property</td>
                      <td className="px-4 py-3 text-sm text-right text-muted-foreground">18%</td>
                      <td className="px-4 py-3 text-sm text-right font-semibold text-accent">24%</td>
                    </tr>
                    <tr className="hover:bg-muted/30">
                      <td className="px-4 py-3 text-sm font-medium text-foreground">Shares & Investments</td>
                      <td className="px-4 py-3 text-sm text-right text-muted-foreground">10%</td>
                      <td className="px-4 py-3 text-sm text-right font-semibold text-accent">20%</td>
                    </tr>
                    <tr className="hover:bg-muted/30">
                      <td className="px-4 py-3 text-sm font-medium text-foreground">Other Assets</td>
                      <td className="px-4 py-3 text-sm text-right text-muted-foreground">10%</td>
                      <td className="px-4 py-3 text-sm text-right font-semibold text-accent">20%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-muted/30 border-t border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                <h3 className="font-semibold text-foreground mb-3">Allowable Costs</h3>
                <p className="text-sm text-muted-foreground">
                  You can deduct certain costs from your gain: purchase costs (legal fees, stamp duty),
                  selling costs (estate agent fees, conveyancing), and improvement costs (extensions,
                  renovations — not maintenance).
                </p>
              </div>

              <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                <h3 className="font-semibold text-foreground mb-3">Private Residence Relief</h3>
                <p className="text-sm text-muted-foreground">
                  Your main home is exempt from CGT. If you&apos;ve let out part of it or it wasn&apos;t
                  always your main home, you may get partial relief. The last 9 months of ownership
                  are always exempt.
                </p>
              </div>

              <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                <h3 className="font-semibold text-foreground mb-3">Reporting & Payment</h3>
                <p className="text-sm text-muted-foreground">
                  For UK property sales, you must report and pay CGT within 60 days of completion.
                  For other assets, report on your Self Assessment tax return.
                </p>
              </div>
            </div>
          </div>
        </section>

        <RelatedCalculators calculators={taxCalculators} />
        <FooterAd />
      </main>
    </SidebarLayout>
  )
}
