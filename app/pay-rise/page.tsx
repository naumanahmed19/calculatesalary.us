import type { Metadata } from 'next'
import { SidebarLayout } from '@/components/sidebar-layout'
import { PayRiseCalculator } from '@/components/pay-rise-calculator'
import { TAX_YEAR } from '@/lib/us-tax-calculator'
import { currentTaxConfig } from '@/lib/us-tax-config'
import { HeaderAd, MobileHeaderAd, InContentAd, FooterAd } from '@/components/ad-unit'
import { RelatedCalculators, salaryCalculators } from '@/components/related-calculators'
import { generateBreadcrumbSchema, BREADCRUMB_ITEMS } from '@/lib/breadcrumb-schema'
import Link from 'next/link'

export const metadata: Metadata = {
  title: `Pay Raise Calculator ${TAX_YEAR} - How Much Extra Will I Take Home?`,
  description: `Calculate how much of your pay raise you'll actually take home after tax. See the real impact of a salary increase on your net pay for ${TAX_YEAR}, including federal tax, state tax, and FICA.`,
  keywords: [
    'pay raise calculator',
    'salary increase calculator',
    'how much extra will i take home',
    'pay raise after tax',
    'salary raise calculator',
    'wage increase calculator',
    'take home pay raise',
    'pay increase calculator',
    'real value of pay raise',
    TAX_YEAR,
  ],
  openGraph: {
    title: `Pay Raise Calculator ${TAX_YEAR} - Calculate Your Real Take-Home Increase`,
    description: 'Find out exactly how much extra you\'ll take home after a pay raise, after federal, state, and FICA taxes.',
    type: 'website',
    locale: 'en_US',
  },
  alternates: {
    canonical: '/pay-rise',
  },
}

const payRiseSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'US Pay Raise Calculator',
  description: `Calculate how much of your pay raise you'll take home after tax for ${TAX_YEAR}`,
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
}

const faqData = [
  {
    question: 'How much of my pay raise will I actually keep?',
    answer: `The amount you keep depends on your marginal tax bracket. In the 22% federal bracket ($${(48475).toLocaleString()}-$${(103350).toLocaleString()} for single filers), combined with FICA taxes (7.65%), you typically keep about 70% of your raise. In higher brackets (32%+), you may keep only 60% or less. State income tax further reduces take-home pay in most states.`,
  },
  {
    question: 'Does a pay raise affect my tax bracket?',
    answer: `Only the portion of your income above each bracket threshold is taxed at the higher rate - not your entire income. The US uses progressive tax brackets (10%, 12%, 22%, 24%, 32%, 35%, 37%). A raise that "pushes you into a higher bracket" only affects the additional income, not what you already earned.`,
  },
  {
    question: 'Is a percentage or fixed amount pay raise better?',
    answer: 'From a tax perspective, they work the same - only the final salary matters. A 5% raise on $50,000 ($2,500) is taxed identically to a flat $2,500 increase. However, percentage raises preserve your purchasing power better against inflation over time.',
  },
  {
    question: 'How can I maximize the value of my pay raise?',
    answer: `Increase your 401(k) contributions to reduce taxable income while boosting retirement savings. Traditional 401(k) contributions lower your federal and state tax bill. For ${TAX_YEAR}, you can contribute up to $23,500 ($31,000 if over 50). HSA contributions, if eligible, also reduce taxable income.`,
  },
  {
    question: 'Will my pay raise increase my FICA taxes?',
    answer: `Yes, Social Security tax (${(currentTaxConfig.socialSecurity.rate * 100).toFixed(1)}%) applies up to the wage base of $${currentTaxConfig.socialSecurity.wageBase.toLocaleString()}. If your new salary is below this limit, you'll pay more Social Security tax. Medicare tax (${(currentTaxConfig.medicare.rate * 100).toFixed(2)}%) has no cap and applies to all earnings.`,
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqData.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
}

const breadcrumbSchema = generateBreadcrumbSchema([BREADCRUMB_ITEMS.home, BREADCRUMB_ITEMS.payRise])

export default function PayRisePage() {
  return (
    <SidebarLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(payRiseSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="flex-1">
        <HeaderAd />
        <MobileHeaderAd />

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-flex items-center rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent mb-6">
                Updated for {TAX_YEAR}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
                Pay Raise Calculator
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Find out exactly how much extra you&apos;ll take home after a pay raise.
                See the real impact after federal tax, state tax, and FICA deductions.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <PayRiseCalculator />
          </div>
        </section>

        <InContentAd />

        <section className="py-12 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
                Understanding Your Pay Raise
              </h2>

              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="rounded-xl bg-card p-6 ring-1 ring-border/50">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">~70%</div>
                  <div className="font-medium text-foreground mb-1">22% Bracket</div>
                  <p className="text-sm text-muted-foreground">
                    Keep about 70 cents of every $1 raise (22% federal + 7.65% FICA)
                  </p>
                </div>
                <div className="rounded-xl bg-card p-6 ring-1 ring-border/50">
                  <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-2">~60%</div>
                  <div className="font-medium text-foreground mb-1">32% Bracket</div>
                  <p className="text-sm text-muted-foreground">
                    Keep about 60 cents of every $1 raise (32% federal + 7.65% FICA)
                  </p>
                </div>
                <div className="rounded-xl bg-card p-6 ring-1 ring-border/50">
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">~55%</div>
                  <div className="font-medium text-foreground mb-1">37% Bracket</div>
                  <p className="text-sm text-muted-foreground">
                    Keep about 55 cents of every $1 raise (37% federal + FICA)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Tips for Maximizing Your Pay Raise
              </h2>
              <div className="space-y-4">
                <div className="rounded-xl bg-card p-4 ring-1 ring-border/50">
                  <h4 className="font-medium text-foreground mb-2">Increase 401(k) Contributions</h4>
                  <p className="text-sm text-muted-foreground">
                    Traditional 401(k) contributions reduce your taxable income. If you get a $5,000 raise
                    and increase your 401(k) by $5,000, you boost retirement savings while reducing
                    your tax bill. Use our{' '}
                    <Link href="/401k-calculator" className="text-accent hover:underline">
                      401(k) Calculator
                    </Link>{' '}
                    to see the impact.
                  </p>
                </div>
                <div className="rounded-xl bg-card p-4 ring-1 ring-border/50">
                  <h4 className="font-medium text-foreground mb-2">Update Your W-4</h4>
                  <p className="text-sm text-muted-foreground">
                    After a pay raise, your withholding may need adjustment. Use the IRS Tax Withholding
                    Estimator to ensure you&apos;re not over or underpaying throughout the year.
                  </p>
                </div>
                <div className="rounded-xl bg-card p-4 ring-1 ring-border/50">
                  <h4 className="font-medium text-foreground mb-2">Consider HSA Contributions</h4>
                  <p className="text-sm text-muted-foreground">
                    If you have a high-deductible health plan, HSA contributions reduce both income tax
                    AND FICA taxes. This triple tax advantage (deductible, grows tax-free, tax-free
                    for medical expenses) makes HSAs one of the best tax-advantaged accounts.
                  </p>
                </div>
                <div className="rounded-xl bg-card p-4 ring-1 ring-border/50">
                  <h4 className="font-medium text-foreground mb-2">State Tax Matters</h4>
                  <p className="text-sm text-muted-foreground">
                    Remember that state income tax adds to your marginal rate. In high-tax states like
                    California (up to 13.3%) or New York (up to 10.9%), your combined marginal rate
                    can exceed 50%. Use our calculator to see your state&apos;s impact.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                {faqData.map((faq, index) => (
                  <div key={index} className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                    <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground text-sm">{faq.answer}</p>
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
