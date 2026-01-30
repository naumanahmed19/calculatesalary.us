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
  name: 'UK Minimum Wage Calculator',
  description: `Calculate earnings on National Minimum Wage for ${TAX_YEAR}`,
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
      name: 'What is the National Living Wage for 2025/26?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The National Living Wage from April 2025 is £12.21 per hour for workers aged 23 and over. This applies to the 2025/26 tax year. Workers aged 21-22 also receive £12.21 per hour.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the difference between National Minimum Wage and National Living Wage?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The National Living Wage (NLW) is the minimum rate for workers aged 23 and over (£12.21/hour). The National Minimum Wage (NMW) applies to younger workers: 21-22 (£12.21), 18-20 (£10.00), under 18 (£7.55), and apprentices (£7.55).',
      },
    },
    {
      '@type': 'Question',
      name: 'How much is the apprentice minimum wage?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The apprentice minimum wage is £7.55 per hour for 2025/26. This applies to apprentices under 19, or apprentices 19+ in their first year of apprenticeship. After the first year, apprentices 19+ move to the age-appropriate NMW rate.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the annual salary on National Living Wage?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Working 37.5 hours per week at £12.21/hour (National Living Wage), your annual gross salary is £23,809. After tax and National Insurance, take-home pay is approximately £20,800 per year or £1,733 per month.',
      },
    },
    {
      '@type': 'Question',
      name: 'When does the minimum wage increase?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'UK minimum wage rates are reviewed annually and typically increase each April. The Low Pay Commission recommends new rates to the government, who then confirm the increases. The April 2025 rates apply from 1 April 2025.',
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
                UK Minimum Wage Calculator
              </h1>
              <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
                Calculate your annual salary and take-home pay on National Minimum Wage or 
                National Living Wage. See earnings by age and hours worked.
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
                UK Minimum Wage Rates {TAX_YEAR}
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-3 px-4 font-semibold text-foreground">Age Group</th>
                      <th className="py-3 px-4 font-semibold text-foreground">Rate Type</th>
                      <th className="py-3 px-4 font-semibold text-foreground">Hourly Rate</th>
                      <th className="py-3 px-4 font-semibold text-foreground">Annual (37.5h/week)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4 text-foreground font-medium">23 and over</td>
                      <td className="py-3 px-4 text-muted-foreground">National Living Wage</td>
                      <td className="py-3 px-4 text-accent font-bold">£12.21</td>
                      <td className="py-3 px-4 text-foreground">£23,809</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4 text-foreground font-medium">21 to 22</td>
                      <td className="py-3 px-4 text-muted-foreground">National Minimum Wage</td>
                      <td className="py-3 px-4 text-accent font-bold">£12.21</td>
                      <td className="py-3 px-4 text-foreground">£23,809</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4 text-foreground font-medium">18 to 20</td>
                      <td className="py-3 px-4 text-muted-foreground">National Minimum Wage</td>
                      <td className="py-3 px-4 text-accent font-bold">£10.00</td>
                      <td className="py-3 px-4 text-foreground">£19,500</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4 text-foreground font-medium">Under 18</td>
                      <td className="py-3 px-4 text-muted-foreground">National Minimum Wage</td>
                      <td className="py-3 px-4 text-accent font-bold">£7.55</td>
                      <td className="py-3 px-4 text-foreground">£14,723</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-foreground font-medium">Apprentice</td>
                      <td className="py-3 px-4 text-muted-foreground">Apprentice Rate</td>
                      <td className="py-3 px-4 text-accent font-bold">£7.55</td>
                      <td className="py-3 px-4 text-foreground">£14,723</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Rates effective from April 2025. Annual salary calculated at 37.5 hours per week, 52 weeks per year.
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
