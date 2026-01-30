import type { Metadata } from 'next'
import Link from 'next/link'
import { SidebarLayout } from '@/components/sidebar-layout'
import { PensionCalculator } from '@/components/pension-calculator'
import { TAX_YEAR, formatCurrency } from '@/lib/us-tax-calculator'
import { currentTaxConfig } from '@/lib/us-tax-config'
import { generateBreadcrumbSchema, BREADCRUMB_ITEMS } from '@/lib/breadcrumb-schema'
import { HeaderAd, MobileHeaderAd, InContentAd, FooterAd } from '@/components/ad-unit'
import { RelatedCalculators, salaryCalculators } from '@/components/related-calculators'

export const metadata: Metadata = {
  title: `UK Pension Calculator ${TAX_YEAR} - Tax Relief & Contribution Calculator`,
  description: `Calculate pension contributions and tax relief for ${TAX_YEAR}. See how much tax you save with salary sacrifice, employer contributions, and understand your pension benefits.`,
  keywords: [
    'uk pension calculator',
    'pension tax relief calculator',
    'salary sacrifice pension',
    'pension contribution calculator uk',
    'pension tax savings',
    'workplace pension calculator',
    'employer pension contribution',
    'pension allowance calculator',
    `pension calculator ${TAX_YEAR.split('/')[0]}`,
    'how much pension should i contribute',
  ],
  openGraph: {
    title: `UK Pension Calculator ${TAX_YEAR} - Tax Relief & Contributions`,
    description: 'Calculate pension tax relief and see the real cost of your pension contributions after tax savings.',
    type: 'website',
    locale: 'en_GB',
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
  name: 'UK Pension Calculator',
  description: `Calculate pension contributions and tax relief for ${TAX_YEAR}`,
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
      name: 'How much tax relief do I get on pension contributions?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: `You get tax relief at your marginal rate. Basic rate taxpayers (20%) get £20 relief for every £80 contributed. Higher rate taxpayers (40%) can claim an additional 20% through self-assessment. Additional rate taxpayers (45%) can claim 25% more. With salary sacrifice, you also save on National Insurance (${currentTaxConfig.niMainRate * 100}%).`,
      },
    },
    {
      '@type': 'Question',
      name: 'What is the pension annual allowance for 2025/26?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The standard pension annual allowance is £60,000 for 2025/26 (or 100% of your earnings, whichever is lower). This includes both your contributions and employer contributions. If you earn over £260,000, your allowance may be reduced to as low as £10,000.',
      },
    },
    {
      '@type': 'Question',
      name: 'Should I use salary sacrifice for pension contributions?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Salary sacrifice is usually beneficial because you save National Insurance (${currentTaxConfig.niMainRate * 100}%) as well as income tax. However, it reduces your gross salary which may affect mortgage applications, statutory pay calculations, and contribution-based benefits. Consider your circumstances carefully.`,
      },
    },
    {
      '@type': 'Question',
      name: 'How much should I contribute to my pension?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A common guideline is to contribute half your age as a percentage of salary (e.g., if you start at 30, contribute 15%). The minimum auto-enrolment contribution is 8% total (5% employee, 3% employer). Higher contributions mean more tax relief and a larger retirement pot.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the minimum employer pension contribution?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Under auto-enrolment, employers must contribute at least 3% of qualifying earnings to your pension. Many employers offer more generous schemes, with some matching your contributions up to a certain percentage.',
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
                UK Pension Calculator
              </h1>
              <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
                Calculate how much tax you save on pension contributions. See the real cost after 
                tax relief and understand the benefits of salary sacrifice.
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
                Pension Tax Relief Rates {TAX_YEAR}
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-3 px-4 font-semibold text-foreground">Tax Band</th>
                      <th className="py-3 px-4 font-semibold text-foreground">Income Range</th>
                      <th className="py-3 px-4 font-semibold text-foreground">Tax Relief</th>
                      <th className="py-3 px-4 font-semibold text-foreground">£100 costs you</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4 text-foreground">Basic Rate</td>
                      <td className="py-3 px-4 text-muted-foreground">£12,571 - £50,270</td>
                      <td className="py-3 px-4 text-green-600 dark:text-green-400">20%</td>
                      <td className="py-3 px-4 text-foreground font-medium">£80</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4 text-foreground">Higher Rate</td>
                      <td className="py-3 px-4 text-muted-foreground">£50,271 - £125,140</td>
                      <td className="py-3 px-4 text-green-600 dark:text-green-400">40%</td>
                      <td className="py-3 px-4 text-foreground font-medium">£60</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4 text-foreground">Additional Rate</td>
                      <td className="py-3 px-4 text-muted-foreground">Over £125,140</td>
                      <td className="py-3 px-4 text-green-600 dark:text-green-400">45%</td>
                      <td className="py-3 px-4 text-foreground font-medium">£55</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 text-foreground">+ Salary Sacrifice</td>
                      <td className="py-3 px-4 text-muted-foreground">Any band</td>
                      <td className="py-3 px-4 text-green-600 dark:text-green-400">+{currentTaxConfig.niMainRate * 100}% NI</td>
                      <td className="py-3 px-4 text-foreground font-medium">Even less</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                How Pension Tax Relief Works
              </h2>
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p>
                  Pension contributions receive tax relief, making them one of the most tax-efficient 
                  ways to save for retirement. When you contribute to a pension, you get relief at 
                  your marginal income tax rate.
                </p>
                
                <h3>Relief at Source vs Net Pay</h3>
                <p>
                  Most workplace pensions use "net pay" arrangements where contributions come from 
                  your salary before tax is calculated. Personal pensions often use "relief at source" 
                  where the pension provider claims basic rate relief automatically, and you claim 
                  higher/additional rate relief through your tax return.
                </p>

                <h3>Salary Sacrifice Pensions</h3>
                <p>
                  With salary sacrifice, you agree to reduce your salary in exchange for employer 
                  pension contributions. This means you also save on National Insurance ({currentTaxConfig.niMainRate * 100}%), 
                  making it even more tax-efficient. Use our calculator above to see the difference.
                </p>

                <h3>Annual Allowance</h3>
                <p>
                  You can contribute up to £60,000 per year (or 100% of your earnings) to pensions 
                  with full tax relief. This includes employer contributions. You can also carry 
                  forward unused allowance from the previous 3 years.
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
