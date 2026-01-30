import type { Metadata } from 'next'
import Link from 'next/link'
import { SidebarLayout } from '@/components/sidebar-layout'
import { MinimumWageCalculator } from '@/components/minimum-wage-calculator'
import { TAX_YEAR, formatCurrency } from '@/lib/us-tax-calculator'
import { generateBreadcrumbSchema, BREADCRUMB_ITEMS } from '@/lib/breadcrumb-schema'
import { HeaderAd, MobileHeaderAd, InContentAd, FooterAd } from '@/components/ad-unit'
import { RelatedCalculators, salaryCalculators } from '@/components/related-calculators'

export const metadata: Metadata = {
  title: `US Minimum Wage Calculator ${TAX_YEAR} - Federal & State Rates`,
  description: `Calculate earnings on US Federal Minimum Wage and state minimum wages for ${TAX_YEAR}. See annual salary and take-home pay for $7.25/hour federal rate and higher state rates.`,
  keywords: [
    'minimum wage calculator us',
    'federal minimum wage 2025',
    'state minimum wage calculator',
    'minimum wage us 2025',
    'living wage calculator',
    'minimum wage by state',
    'tipped minimum wage',
    'minimum wage salary calculator',
    TAX_YEAR,
  ],
  openGraph: {
    title: `US Minimum Wage Calculator ${TAX_YEAR}`,
    description: 'Calculate annual salary and take-home pay on Federal and State Minimum Wage.',
    type: 'website',
    locale: 'en_US',
  },
  alternates: {
    canonical: '/minimum-wage',
  },
}

const breadcrumbSchema = generateBreadcrumbSchema([
  BREADCRUMB_ITEMS.home,
  BREADCRUMB_ITEMS.minimumWage,
])

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'US Minimum Wage Calculator',
  description: `Calculate earnings on Federal and State Minimum Wage for ${TAX_YEAR}`,
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
      name: 'What is the Federal Minimum Wage for 2025?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The Federal Minimum Wage remains at $7.25 per hour, which has been the rate since 2009. However, many states have higher minimum wages, and some cities have even higher local minimums.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which states have the highest minimum wage?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Washington state has the highest statewide minimum wage at $16.66/hour. California is at $16.50/hour, and New York varies by region from $15.00 to $16.50/hour. Some cities like Seattle and San Francisco have even higher local minimums.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the tipped minimum wage?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The federal tipped minimum wage is $2.13/hour for employees who regularly receive more than $30/month in tips. Employers must ensure total earnings (wages + tips) equal at least the regular minimum wage. Many states require higher tipped wages or the full minimum wage for tipped workers.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the annual salary on federal minimum wage?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Working 40 hours per week at $7.25/hour (Federal Minimum Wage), your annual gross salary is $15,080. After federal and state taxes, take-home pay varies by state but is typically around $13,500-$14,500 per year.',
      },
    },
    {
      '@type': 'Question',
      name: 'When do minimum wage increases take effect?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The federal minimum wage requires an act of Congress to change. State minimum wages typically increase on January 1st of each year, with some states having automatic cost-of-living adjustments. Check your specific state for scheduled increases.',
      },
    },
  ],
}

export default function MinimumWagePage() {
  return (
    <SidebarLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
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
                US Minimum Wage Calculator
              </h1>
              <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
                Calculate your annual salary and take-home pay on Federal or State Minimum Wage.
                See earnings by state and hours worked.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <MinimumWageCalculator />
          </div>
        </section>

        <InContentAd />

        <section className="py-12 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
                Minimum Wage Rates by State {TAX_YEAR}
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-3 px-4 font-semibold text-foreground">State</th>
                      <th className="py-3 px-4 font-semibold text-foreground">Hourly Rate</th>
                      <th className="py-3 px-4 font-semibold text-foreground">Annual (40h/week)</th>
                      <th className="py-3 px-4 font-semibold text-foreground">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50 bg-muted/30">
                      <td className="py-3 px-4 text-foreground font-medium">Federal</td>
                      <td className="py-3 px-4 text-accent font-bold">$7.25</td>
                      <td className="py-3 px-4 text-foreground">$15,080</td>
                      <td className="py-3 px-4 text-muted-foreground text-sm">Applies if state has no higher rate</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4 text-foreground font-medium">Washington</td>
                      <td className="py-3 px-4 text-accent font-bold">$16.66</td>
                      <td className="py-3 px-4 text-foreground">$34,653</td>
                      <td className="py-3 px-4 text-muted-foreground text-sm">Highest statewide rate</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4 text-foreground font-medium">California</td>
                      <td className="py-3 px-4 text-accent font-bold">$16.50</td>
                      <td className="py-3 px-4 text-foreground">$34,320</td>
                      <td className="py-3 px-4 text-muted-foreground text-sm">Some cities higher</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4 text-foreground font-medium">New York</td>
                      <td className="py-3 px-4 text-accent font-bold">$15.00-$16.50</td>
                      <td className="py-3 px-4 text-foreground">$31,200-$34,320</td>
                      <td className="py-3 px-4 text-muted-foreground text-sm">Varies by region</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4 text-foreground font-medium">Massachusetts</td>
                      <td className="py-3 px-4 text-accent font-bold">$15.00</td>
                      <td className="py-3 px-4 text-foreground">$31,200</td>
                      <td className="py-3 px-4 text-muted-foreground text-sm">-</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4 text-foreground font-medium">Florida</td>
                      <td className="py-3 px-4 text-accent font-bold">$13.00</td>
                      <td className="py-3 px-4 text-foreground">$27,040</td>
                      <td className="py-3 px-4 text-muted-foreground text-sm">Increasing annually</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-foreground font-medium">Texas</td>
                      <td className="py-3 px-4 text-accent font-bold">$7.25</td>
                      <td className="py-3 px-4 text-foreground">$15,080</td>
                      <td className="py-3 px-4 text-muted-foreground text-sm">Federal rate applies</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Annual salary calculated at 40 hours per week, 52 weeks per year. Rates as of January 2025.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqSchema.mainEntity.map((faq, index) => (
                  <details
                    key={index}
                    className="group rounded-xl bg-card p-4 ring-1 ring-border/50"
                  >
                    <summary className="cursor-pointer font-medium text-foreground list-none flex justify-between items-center">
                      {faq['@type'] === 'Question' && faq.name}
                      <span className="text-muted-foreground group-open:rotate-180 transition-transform">
                        ▼
                      </span>
                    </summary>
                    <p className="mt-3 text-muted-foreground">
                      {faq['@type'] === 'Question' && faq.acceptedAnswer.text}
                    </p>
                  </details>
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
