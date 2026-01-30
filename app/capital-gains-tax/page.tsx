import type { Metadata } from 'next'
import Link from 'next/link'
import { SidebarLayout } from '@/components/sidebar-layout'
import { CapitalGainsTaxCalculator } from '@/components/capital-gains-tax-calculator'
import { TAX_YEAR, formatCurrency } from '@/lib/us-tax-calculator'
import { generateBreadcrumbSchema, BREADCRUMB_ITEMS } from '@/lib/breadcrumb-schema'
import { HeaderAd, MobileHeaderAd, InContentAd, FooterAd } from '@/components/ad-unit'
import { RelatedCalculators, taxCalculators } from '@/components/related-calculators'

export const metadata: Metadata = {
  title: `US Capital Gains Tax Calculator ${TAX_YEAR} - Property, Stocks & Assets`,
  description: `Calculate Capital Gains Tax on property, stocks and other assets for ${TAX_YEAR}. See short-term and long-term CGT rates, NIIT, and your tax bill.`,
  keywords: [
    'capital gains tax calculator us',
    'cgt calculator',
    'property capital gains tax',
    'stock capital gains tax us',
    'capital gains tax rates',
    'capital gains tax rates 2025',
    'long term capital gains',
    'short term capital gains',
    TAX_YEAR,
  ],
  openGraph: {
    title: `US Capital Gains Tax Calculator ${TAX_YEAR}`,
    description: 'Calculate Capital Gains Tax on property, stocks and other assets.',
    type: 'website',
    locale: 'en_US',
  },
  alternates: {
    canonical: '/capital-gains-tax',
  },
}

const cgtSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'US Capital Gains Tax Calculator',
  description: `Calculate CGT on property and stocks for ${TAX_YEAR}`,
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
      name: 'What are the long-term capital gains tax rates for 2025?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Long-term capital gains (assets held over 1 year) are taxed at 0%, 15%, or 20% depending on your income. For single filers: 0% up to $47,025; 15% from $47,025 to $518,900; 20% above $518,900.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between short-term and long-term capital gains?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Short-term capital gains (assets held 1 year or less) are taxed as ordinary income at rates up to 37%. Long-term gains (held over 1 year) receive preferential rates of 0%, 15%, or 20%.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I pay capital gains tax when I sell my primary home?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'You can exclude up to $250,000 of gain ($500,000 for married couples) when selling your primary residence if you lived there at least 2 of the last 5 years. Gains above this exclusion are taxable.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the Net Investment Income Tax (NIIT)?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The NIIT is an additional 3.8% tax on investment income (including capital gains) for individuals with income over $200,000 (single) or $250,000 (married filing jointly).',
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
                US Capital Gains Tax Calculator
              </h1>
              <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
                Calculate the capital gains tax due on property, stocks and other assets. See how your
                income and holding period affect your tax rate.
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
                Rates depend on your holding period and total taxable income
              </p>

              <div className="rounded-2xl bg-card/60 dark:bg-card/40 overflow-hidden ring-1 ring-border/50">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Holding Period</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Tax Rate</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Income Threshold (Single)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr className="hover:bg-muted/30">
                      <td className="px-4 py-3 text-sm font-medium text-foreground">Long-term (1+ year)</td>
                      <td className="px-4 py-3 text-sm text-right font-semibold text-emerald-600 dark:text-emerald-400">0%</td>
                      <td className="px-4 py-3 text-sm text-right text-muted-foreground">Up to $47,025</td>
                    </tr>
                    <tr className="hover:bg-muted/30">
                      <td className="px-4 py-3 text-sm font-medium text-foreground">Long-term (1+ year)</td>
                      <td className="px-4 py-3 text-sm text-right font-semibold text-foreground">15%</td>
                      <td className="px-4 py-3 text-sm text-right text-muted-foreground">$47,025 - $518,900</td>
                    </tr>
                    <tr className="hover:bg-muted/30">
                      <td className="px-4 py-3 text-sm font-medium text-foreground">Long-term (1+ year)</td>
                      <td className="px-4 py-3 text-sm text-right font-semibold text-accent">20%</td>
                      <td className="px-4 py-3 text-sm text-right text-muted-foreground">Over $518,900</td>
                    </tr>
                    <tr className="hover:bg-muted/30">
                      <td className="px-4 py-3 text-sm font-medium text-foreground">Short-term (&lt;1 year)</td>
                      <td className="px-4 py-3 text-sm text-right font-semibold text-amber-600 dark:text-amber-400">10-37%</td>
                      <td className="px-4 py-3 text-sm text-right text-muted-foreground">Taxed as ordinary income</td>
                    </tr>
                    <tr className="hover:bg-muted/30 bg-rose-50/50 dark:bg-rose-900/10">
                      <td className="px-4 py-3 text-sm font-medium text-foreground">NIIT (high earners)</td>
                      <td className="px-4 py-3 text-sm text-right font-semibold text-rose-600 dark:text-rose-400">+3.8%</td>
                      <td className="px-4 py-3 text-sm text-right text-muted-foreground">Income over $200,000</td>
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
                <h3 className="font-semibold text-foreground mb-3">Cost Basis</h3>
                <p className="text-sm text-muted-foreground">
                  Your cost basis includes the original purchase price plus certain costs: broker commissions,
                  transfer fees, and for real estate, closing costs and capital improvements (not repairs or maintenance).
                </p>
              </div>

              <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                <h3 className="font-semibold text-foreground mb-3">Primary Residence Exclusion</h3>
                <p className="text-sm text-muted-foreground">
                  When selling your primary home, you can exclude up to $250,000 of gain ($500,000 for married
                  couples filing jointly) if you owned and lived in the home for at least 2 of the 5 years
                  before the sale. Gains above this exclusion are taxable.
                </p>
              </div>

              <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                <h3 className="font-semibold text-foreground mb-3">Reporting & Payment</h3>
                <p className="text-sm text-muted-foreground">
                  Report capital gains on Schedule D of your federal tax return. You may need to make
                  estimated tax payments if you expect to owe $1,000 or more in taxes for the year.
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
