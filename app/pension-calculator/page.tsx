import type { Metadata } from 'next'
import Link from 'next/link'
import { SidebarLayout } from '@/components/sidebar-layout'
import { PensionCalculator } from '@/components/pension-calculator'
import { TAX_YEAR, formatCurrency } from '@/lib/us-tax-calculator'
import { generateBreadcrumbSchema, BREADCRUMB_ITEMS } from '@/lib/breadcrumb-schema'
import { HeaderAd, MobileHeaderAd, InContentAd, FooterAd } from '@/components/ad-unit'
import { RelatedCalculators, salaryCalculators } from '@/components/related-calculators'

export const metadata: Metadata = {
  title: `401(k) Contribution Calculator ${TAX_YEAR} - Tax Savings & Retirement`,
  description: `Calculate 401(k) contributions and tax savings for ${TAX_YEAR}. See how much tax you save with pre-tax contributions, employer matching, and understand your retirement benefits.`,
  keywords: [
    'us 401k calculator',
    '401k tax savings calculator',
    '401k contribution calculator',
    'retirement contribution calculator',
    '401k tax savings',
    'workplace retirement calculator',
    'employer 401k contribution',
    '401k allowance calculator',
    `401k calculator ${TAX_YEAR.split('/')[0]}`,
    'how much 401k should i contribute',
  ],
  openGraph: {
    title: `401(k) Contribution Calculator ${TAX_YEAR} - Tax Savings & Retirement`,
    description: 'Calculate 401(k) tax savings and see the real cost of your retirement contributions after tax deferral.',
    type: 'website',
    locale: 'en_US',
  },
  alternates: {
    canonical: '/pension-calculator',
  },
}

const breadcrumbSchema = generateBreadcrumbSchema([
  BREADCRUMB_ITEMS.home,
  BREADCRUMB_ITEMS.pensionCalculator,
])

const pensionCalcSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '401(k) Calculator',
  description: `Calculate 401(k) contributions and tax savings for ${TAX_YEAR}`,
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
      name: 'How much tax do I save on 401(k) contributions?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Traditional 401(k) contributions are made pre-tax, reducing your taxable income. You save at your marginal tax rate. For example, if you're in the 22% bracket, a $1,000 contribution saves you $220 in federal taxes. You also save on state income taxes in most states.`,
      },
    },
    {
      '@type': 'Question',
      name: 'What is the 401(k) contribution limit for 2025?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The 401(k) employee contribution limit for 2025 is $23,500. If you are 50 or older, you can make an additional catch-up contribution of $7,500, for a total of $31,000. The total limit including employer contributions is $70,000 (or $77,500 with catch-up).',
      },
    },
    {
      '@type': 'Question',
      name: 'Should I choose Traditional or Roth 401(k)?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Traditional 401(k) contributions reduce your taxable income now, and you pay taxes when you withdraw in retirement. Roth 401(k) contributions are made after-tax, but withdrawals in retirement are tax-free. Choose Traditional if you expect to be in a lower tax bracket in retirement, or Roth if you expect higher taxes later.`,
      },
    },
    {
      '@type': 'Question',
      name: 'How much should I contribute to my 401(k)?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Financial advisors often recommend contributing at least enough to get your full employer match (free money). Beyond that, aim for 10-15% of your salary including employer contributions. If you can afford it, maximizing your contribution ($23,500 in 2025) provides the greatest tax benefit.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is employer 401(k) matching?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Many employers match a portion of your 401(k) contributions, such as 50% of contributions up to 6% of salary, or dollar-for-dollar up to 3%. This is essentially free money. For example, if you earn $75,000 and your employer matches 50% up to 6%, contributing $4,500 gets you $2,250 in matching.',
      },
    },
  ],
}

export default function PensionCalculatorPage() {
  return (
    <SidebarLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pensionCalcSchema) }}
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
                401(k) Calculator
              </h1>
              <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
                Calculate how much tax you save on 401(k) contributions. See the real cost after
                tax deferral and understand the benefits of employer matching.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <PensionCalculator />
          </div>
        </section>

        <InContentAd />

        <section className="py-12 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
                401(k) Tax Savings by Tax Bracket {TAX_YEAR}
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-3 px-4 font-semibold text-foreground">Tax Bracket</th>
                      <th className="py-3 px-4 font-semibold text-foreground">Income Range (Single)</th>
                      <th className="py-3 px-4 font-semibold text-foreground">Tax Savings</th>
                      <th className="py-3 px-4 font-semibold text-foreground">$1,000 costs you</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4 text-foreground">10%</td>
                      <td className="py-3 px-4 text-muted-foreground">$0 - $11,925</td>
                      <td className="py-3 px-4 text-green-600 dark:text-green-400">$100</td>
                      <td className="py-3 px-4 text-foreground font-medium">$900</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4 text-foreground">12%</td>
                      <td className="py-3 px-4 text-muted-foreground">$11,926 - $48,475</td>
                      <td className="py-3 px-4 text-green-600 dark:text-green-400">$120</td>
                      <td className="py-3 px-4 text-foreground font-medium">$880</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4 text-foreground">22%</td>
                      <td className="py-3 px-4 text-muted-foreground">$48,476 - $103,350</td>
                      <td className="py-3 px-4 text-green-600 dark:text-green-400">$220</td>
                      <td className="py-3 px-4 text-foreground font-medium">$780</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4 text-foreground">24%</td>
                      <td className="py-3 px-4 text-muted-foreground">$103,351 - $197,300</td>
                      <td className="py-3 px-4 text-green-600 dark:text-green-400">$240</td>
                      <td className="py-3 px-4 text-foreground font-medium">$760</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4 text-foreground">32%</td>
                      <td className="py-3 px-4 text-muted-foreground">$197,301 - $250,525</td>
                      <td className="py-3 px-4 text-green-600 dark:text-green-400">$320</td>
                      <td className="py-3 px-4 text-foreground font-medium">$680</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4 text-foreground">35%</td>
                      <td className="py-3 px-4 text-muted-foreground">$250,526 - $626,350</td>
                      <td className="py-3 px-4 text-green-600 dark:text-green-400">$350</td>
                      <td className="py-3 px-4 text-foreground font-medium">$650</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-foreground">37%</td>
                      <td className="py-3 px-4 text-muted-foreground">Over $626,350</td>
                      <td className="py-3 px-4 text-green-600 dark:text-green-400">$370</td>
                      <td className="py-3 px-4 text-foreground font-medium">$630</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Tax savings shown are federal only. State income tax savings vary by state.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                How 401(k) Tax Savings Work
              </h2>
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p>
                  Traditional 401(k) contributions are made with pre-tax dollars, reducing your
                  taxable income. This means you pay less in federal and state income taxes now,
                  while your money grows tax-deferred until retirement.
                </p>

                <h3>Traditional vs Roth 401(k)</h3>
                <p>
                  With a Traditional 401(k), you defer taxes until withdrawal in retirement.
                  With a Roth 401(k), you contribute after-tax dollars, but qualified withdrawals
                  in retirement are completely tax-free. Many employers offer both options, and
                  you can split your contributions between them.
                </p>

                <h3>Employer Matching</h3>
                <p>
                  Many employers match a portion of your 401(k) contributions. Common matching
                  formulas include 50% up to 6% of salary, or dollar-for-dollar up to 3%. Always
                  contribute at least enough to get your full employer match - it's free money
                  that can significantly boost your retirement savings.
                </p>

                <h3>Contribution Limits</h3>
                <p>
                  For 2025, the employee contribution limit is $23,500. If you're 50 or older,
                  you can contribute an additional $7,500 as a catch-up contribution. The total
                  limit including employer contributions is $70,000 ($77,500 with catch-up).
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-muted/30 border-y border-border/40">
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
