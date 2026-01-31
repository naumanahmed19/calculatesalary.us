import type { Metadata } from 'next'
import Link from 'next/link'
import { SidebarLayout } from '@/components/sidebar-layout'
import { SavingsCalculator } from '@/components/savings-calculator'
import { generateBreadcrumbSchema, BREADCRUMB_ITEMS } from '@/lib/breadcrumb-schema'
import { HeaderAd, InContentAd, FooterAd } from '@/components/ad-unit'
import { RelatedCalculators, salaryCalculators } from '@/components/related-calculators'
import { COMMON_MONTHLY_AMOUNTS, COMMON_INTEREST_RATES, formatSavingsCurrency } from '@/lib/savings-calculator'

export const metadata: Metadata = {
  title: 'Savings Calculator - Compound Interest Calculator 2025',
  description: 'Free savings calculator. Calculate how your savings grow with compound interest over time. See projections for high-yield savings accounts, CDs and regular deposits.',
  keywords: [
    'savings calculator',
    'compound interest calculator',
    'savings calculator usa',
    'hysa calculator',
    'savings account calculator',
    'interest calculator',
    'how much will my savings grow',
    'compound interest',
    'savings growth calculator',
    'monthly savings calculator',
  ],
  openGraph: {
    title: 'Savings Calculator - Compound Interest Calculator',
    description: 'Calculate how your savings grow with compound interest. Free savings and investment calculator.',
    type: 'website',
    locale: 'en_US',
  },
  alternates: {
    canonical: '/savings-calculator',
  },
}

const breadcrumbSchema = generateBreadcrumbSchema([
  BREADCRUMB_ITEMS.home,
  { name: 'Savings Calculator', href: '/savings-calculator' },
])

const savingsCalcSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Savings Calculator',
  description: 'Calculate compound interest and savings growth over time',
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
      name: 'How does compound interest work?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Compound interest means you earn interest on both your original deposit and on previously earned interest. For example, if you deposit $1,000 at 5% annual interest, after year one you have $1,050. In year two, you earn 5% on $1,050 (not just $1,000), giving you $1,102.50. This compounding effect accelerates your savings growth over time.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much should I save each month?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A common guideline is to save at least 20% of your income, following the 50/30/20 rule (50% needs, 30% wants, 20% savings). However, any amount is better than nothing. Start with what you can afford and increase gradually. Even $50-$100 per month can grow significantly over 10-20 years with compound interest.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is a good savings account interest rate?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'As of 2025, high-yield savings accounts (HYSAs) offer 4-5% APY, significantly higher than traditional bank accounts (0.01-0.5%). Online banks typically offer the best rates. CDs (Certificates of Deposit) may offer higher rates for locking money for a fixed term. Always compare current rates as they change with Federal Reserve policy.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is it better to save monthly or as a lump sum?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'If you have a lump sum available, investing it immediately typically performs better due to more time for compound interest. However, regular monthly savings (dollar-cost averaging) is more practical for most people and builds good habits. Our calculator shows results for both initial deposits and monthly contributions.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much will $200 a month grow to in 10 years?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Saving $200 per month for 10 years at 5% interest would give you approximately $31,000. Your total contributions would be $24,000, meaning you earn about $7,000 in compound interest. Use our calculator above to see exact figures for your situation.',
      },
    },
  ],
}

export default function SavingsCalculatorPage() {
  return (
    <SidebarLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(savingsCalcSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <main className="flex-1">
        <HeaderAd />

        <section className="py-12 md:py-16 border-b border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-flex items-center rounded-full bg-emerald-600/10 px-4 py-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400 mb-6">
                Compound Interest Calculator
              </span>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground text-balance mb-4">
                Savings Calculator
              </h1>
              <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
                See how your money grows with compound interest. Calculate savings for HYSAs,
                CDs, or any regular deposits over time.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <SavingsCalculator />
          </div>
        </section>

        <InContentAd />

        <section className="py-12 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
                Monthly Savings Examples
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-3 px-4 font-semibold text-foreground">Monthly Savings</th>
                      <th className="py-3 px-4 font-semibold text-foreground">5 Years</th>
                      <th className="py-3 px-4 font-semibold text-foreground">10 Years</th>
                      <th className="py-3 px-4 font-semibold text-foreground">20 Years</th>
                      <th className="py-3 px-4 font-semibold text-foreground">Calculator</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[100, 200, 300, 500, 1000].map((amount) => {
                      // Pre-calculated at 5% interest
                      const calc5 = amount * 12 * 5 * 1.13
                      const calc10 = amount * 12 * 10 * 1.29
                      const calc20 = amount * 12 * 20 * 1.65
                      return (
                        <tr key={amount} className="border-b border-border/50 hover:bg-muted/30">
                          <td className="py-3 px-4 font-medium text-foreground">${amount}/month</td>
                          <td className="py-3 px-4 text-muted-foreground">~${Math.round(calc5).toLocaleString()}</td>
                          <td className="py-3 px-4 text-muted-foreground">~${Math.round(calc10).toLocaleString()}</td>
                          <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-medium">~${Math.round(calc20).toLocaleString()}</td>
                          <td className="py-3 px-4">
                            <Link
                              href={`/savings/${amount}-a-month`}
                              className="text-accent hover:underline"
                            >
                              Calculate →
                            </Link>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground mt-4 text-center">
                *Estimates based on 5% annual interest rate, compounded monthly. Actual results vary.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Understanding Compound Interest
              </h2>
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p>
                  Compound interest is often called the eighth wonder of the world. Unlike simple interest
                  which only calculates on your original deposit, compound interest earns interest on your
                  interest, creating exponential growth over time.
                </p>

                <h3>The Power of Starting Early</h3>
                <p>
                  Time is the most important factor in compound growth. Someone who saves $200/month from
                  age 25 to 35 (10 years, $24,000 total) and then stops, will often have more at 65 than
                  someone who starts at 35 and saves until 65 (30 years, $72,000 total), thanks to the
                  extra years of compounding.
                </p>

                <h3>Compound Frequency Matters</h3>
                <p>
                  Interest can compound daily, monthly, quarterly, or annually. More frequent compounding
                  means slightly higher returns. A 5% rate compounded daily gives an effective annual rate
                  (APY) of about 5.13%, while annual compounding stays at exactly 5%.
                </p>

                <h3>High-Yield Savings Accounts</h3>
                <p>
                  Traditional bank savings accounts often pay near 0% interest. High-yield savings accounts
                  (HYSAs) from online banks can offer 4-5% APY in 2025. This difference is significant:
                  $10,000 at 0.1% earns $10/year, while at 5% it earns $500/year.
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

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
                Popular Savings Calculations
              </h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {COMMON_MONTHLY_AMOUNTS.slice(0, 6).map((amount) => (
                  <Link
                    key={amount}
                    href={`/savings/${amount}-a-month`}
                    className="block p-4 rounded-xl bg-card ring-1 ring-border/50 hover:ring-accent/50 transition-all"
                  >
                    <div className="font-semibold text-foreground">${amount}/month</div>
                    <div className="text-sm text-muted-foreground">How much will I have?</div>
                  </Link>
                ))}
              </div>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {COMMON_INTEREST_RATES.slice(2, 8).map((rate) => (
                  <Link
                    key={rate}
                    href={`/savings/${rate}-percent`}
                    className="block p-4 rounded-xl bg-card ring-1 ring-border/50 hover:ring-accent/50 transition-all"
                  >
                    <div className="font-semibold text-foreground">{rate}% Interest</div>
                    <div className="text-sm text-muted-foreground">Calculate returns</div>
                  </Link>
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
