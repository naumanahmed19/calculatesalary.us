import type { Metadata } from 'next'
import { SidebarLayout } from '@/components/sidebar-layout'
import { RelatedCalculators, salaryCalculators } from '@/components/related-calculators'
import { SalaryComparisonCalculator } from '@/components/salary-comparison-calculator'
import { TAX_YEAR } from '@/lib/us-tax-calculator'
import { HeaderAd, MobileHeaderAd, InContentAd, FooterAd } from '@/components/ad-unit'
import Link from 'next/link'

export const metadata: Metadata = {
  title: `US Salary Comparison Calculator ${TAX_YEAR} - Compare Take Home Pay`,
  description: `Compare multiple US salaries side by side. See take-home pay differences, tax deductions, and find out how much more you'd earn with a raise or new job offer for ${TAX_YEAR}.`,
  keywords: [
    'salary comparison us',
    'compare salaries',
    'us salary comparison tool',
    'take home pay comparison',
    'salary difference calculator',
    'compare job offers us',
    'salary raise calculator',
    'us tax comparison',
    TAX_YEAR,
  ],
  openGraph: {
    title: `US Salary Comparison Calculator ${TAX_YEAR}`,
    description: 'Compare multiple salaries and see the difference in take-home pay after tax.',
    type: 'website',
    locale: 'en_US',
  },
  alternates: {
    canonical: '/salary-comparison',
  },
}

const comparisonSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'UK Salary Comparison Calculator',
  description: `Compare multiple UK salaries and see take-home pay differences for ${TAX_YEAR}`,
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
      name: 'How do I compare two job offers with different salaries?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Enter both salaries in our comparison tool to see the actual take-home pay difference. A £5,000 salary increase doesn\'t mean £5,000 more in your pocket - after tax and NI, you\'ll typically see 60-70% of the difference depending on your tax band.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the take-home pay difference between £35,000 and £50,000?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'With a £35,000 salary, you\'d take home approximately £28,300/year. At £50,000, you\'d take home around £38,500/year. That\'s a £10,200 difference in take-home pay from a £15,000 gross salary increase.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much of a raise will I actually take home?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The percentage depends on your tax band. Basic rate taxpayers keep about 68% of a raise (32% to tax and NI). Higher rate taxpayers keep about 52% (48% to tax and NI). Additional rate taxpayers keep about 47%.',
      },
    },
    {
      '@type': 'Question',
      name: 'Should I accept a job with higher salary but longer commute?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Use our calculator to see the actual take-home difference, then factor in commute costs and time. A £3,000 raise might only net you £2,000 after tax - if your commute costs £150/month more, that\'s £1,800/year eating into your gain.',
      },
    },
  ],
}

export default function SalaryComparisonPage() {
  return (
    <SidebarLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(comparisonSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <main className="flex-1">
        <HeaderAd />
        <MobileHeaderAd />

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-flex items-center rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent mb-6">
                Updated for {TAX_YEAR} Tax Year
              </span>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground text-balance mb-4">
                UK Salary Comparison Calculator
              </h1>
              <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
                Compare multiple salaries side by side. Perfect for evaluating job offers, 
                understanding the impact of a raise, or comparing positions at different levels.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <SalaryComparisonCalculator />
          </div>
        </section>

        <InContentAd />

        <section className="py-12 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
                Understanding Salary Comparisons
              </h2>

              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    Why Take-Home Pay Matters More Than Gross
                  </h3>
                  <p className="text-muted-foreground">
                    A £10,000 salary increase doesn't mean £10,000 more in your pocket. 
                    After Income Tax and National Insurance, you'll typically receive 
                    52-68% of the increase depending on your tax band.
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Basic rate: Keep ~68% of raise</li>
                    <li>• Higher rate: Keep ~52% of raise</li>
                    <li>• Additional rate: Keep ~47% of raise</li>
                    <li>• £100k+ zone: Keep ~40% (60% marginal rate)</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    Comparing Job Offers Fairly
                  </h3>
                  <p className="text-muted-foreground">
                    When comparing job offers, consider the full package:
                  </p>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• <strong>Pension:</strong> Employer contributions are tax-free benefits</li>
                    <li>• <strong>Bonuses:</strong> Often taxed at your marginal rate</li>
                    <li>• <strong>Benefits:</strong> Health insurance, car allowance have cash value</li>
                    <li>• <strong>Location:</strong> Factor in commute costs and time</li>
                    <li>• <strong>Remote work:</strong> Can save £100s/month in travel</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
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
