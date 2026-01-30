import type { Metadata } from 'next'
import Link from 'next/link'
import { SidebarLayout } from '@/components/sidebar-layout'
import { NetToGrossCalculator } from '@/components/net-to-gross-calculator'
import { TAX_YEAR, formatCurrency } from '@/lib/us-tax-calculator'
import { HeaderAd, MobileHeaderAd, InContentAd, InArticleAd, FooterAd } from '@/components/ad-unit'
import { RelatedCalculators, salaryCalculators } from '@/components/related-calculators'

export const metadata: Metadata = {
  title: `Net to Gross Salary Calculator UK ${TAX_YEAR} - Reverse Tax Calculator`,
  description: `Calculate the gross salary needed to achieve your desired take-home pay in the UK. Reverse tax calculator for ${TAX_YEAR}. Enter your target net income and find the required gross salary.`,
  keywords: [
    'net to gross calculator uk',
    'reverse tax calculator uk',
    'gross from net calculator',
    'what gross salary for net',
    'calculate gross from take home pay',
    'uk salary reverse calculator',
    'net to gross salary converter',
    'take home pay to gross uk',
    TAX_YEAR,
  ],
  openGraph: {
    title: `Net to Gross Salary Calculator UK ${TAX_YEAR}`,
    description: 'Calculate the gross salary needed to achieve your desired take-home pay.',
    type: 'website',
    locale: 'en_GB',
  },
  alternates: {
    canonical: '/net-to-gross',
  },
}

const calcSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Net to Gross Calculator UK',
  description: `Reverse tax calculator - find gross salary from desired net pay for ${TAX_YEAR}`,
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
      name: 'How do I calculate gross salary from net pay?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'To calculate gross from net, you need to work backwards through the tax system. Our calculator uses an iterative approach to find the exact gross salary that, after Income Tax and National Insurance deductions, equals your desired take-home pay.',
      },
    },
    {
      '@type': 'Question',
      name: 'What gross salary do I need for £2,500 net per month?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'To take home £2,500 per month (£30,000 per year), you need a gross salary of approximately £38,000-£39,000 depending on your tax situation. This accounts for Income Tax and National Insurance deductions.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why is there no simple formula for net to gross?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The UK tax system has multiple thresholds (Personal Allowance, Basic Rate, Higher Rate, Additional Rate) and the Personal Allowance tapers above £100k. National Insurance also has different rates at different levels. This makes a simple formula impossible - iterative calculation is required.',
      },
    },
    {
      '@type': 'Question',
      name: 'What gross salary gives £40,000 take-home pay?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'To achieve £40,000 annual take-home pay in the UK, you need a gross salary of approximately £53,000-£54,000. At this level, you\'re in the Higher Rate tax band (40%) for some of your income.',
      },
    },
  ],
}

// Common net salary targets with their approximate gross
const COMMON_TARGETS = [
  { net: 2000, label: '£2,000/mo', gross: 29500 },
  { net: 2500, label: '£2,500/mo', gross: 38500 },
  { net: 3000, label: '£3,000/mo', gross: 47500 },
  { net: 3500, label: '£3,500/mo', gross: 58000 },
  { net: 4000, label: '£4,000/mo', gross: 70000 },
  { net: 5000, label: '£5,000/mo', gross: 95000 },
]

export default function NetToGrossPage() {
  return (
    <SidebarLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(calcSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="flex-1">
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
                Net to Gross Calculator
              </h1>
              <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
                What gross salary do you need for your desired take-home pay? Enter your target net
                income and we'll calculate the required gross salary.
              </p>
            </div>
          </div>
        </section>

        {/* Calculator */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <NetToGrossCalculator />
          </div>
        </section>

        <InContentAd />

        {/* Quick Reference */}
        <section className="py-12 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-4 text-center">
                Common Take-Home Pay Targets
              </h2>
              <p className="text-muted-foreground text-center mb-8">
                Quick reference for popular monthly take-home amounts
              </p>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {COMMON_TARGETS.map((target) => (
                  <div key={target.net} className="rounded-2xl bg-card/60 dark:bg-card/40 p-5 ring-1 ring-border/50">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm text-muted-foreground">Target Net</div>
                        <div className="text-xl font-bold text-accent">{target.label}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Need Gross</div>
                        <div className="text-xl font-bold text-foreground">~{formatCurrency(target.gross, 0)}</div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-3">
                      {formatCurrency(target.net * 12, 0)}/year net from {formatCurrency(target.gross, 0)}/year gross
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-6 text-center">
                Values are approximate. Actual amounts depend on pension contributions, student loans, and other deductions.
              </p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
                How Net to Gross Calculation Works
              </h2>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                  <h3 className="font-semibold text-foreground mb-3">Why It's Complex</h3>
                  <p className="text-sm text-muted-foreground">
                    Unlike gross-to-net which is straightforward, net-to-gross requires reverse
                    engineering multiple tax thresholds:
                  </p>
                  <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                    <li>• Personal Allowance (£12,570)</li>
                    <li>• Basic Rate band (20%)</li>
                    <li>• Higher Rate band (40%)</li>
                    <li>• Additional Rate (45%)</li>
                    <li>• National Insurance thresholds</li>
                    <li>• Personal Allowance taper above £100k</li>
                  </ul>
                </div>

                <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                  <h3 className="font-semibold text-foreground mb-3">Our Approach</h3>
                  <p className="text-sm text-muted-foreground">
                    Our calculator uses an iterative method:
                  </p>
                  <ol className="mt-3 space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                    <li>Start with an estimate based on your target</li>
                    <li>Calculate the resulting net pay</li>
                    <li>Adjust the gross up or down</li>
                    <li>Repeat until we find the exact match</li>
                  </ol>
                  <p className="mt-3 text-sm text-muted-foreground">
                    This ensures accuracy across all tax bands, including the complex
                    60% effective rate zone between £100k-£125k.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <InArticleAd />

        {/* FAQ */}
        <section className="py-12 bg-muted/30 border-y border-border/40">
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

        {/* Use Cases */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
                When to Use This Calculator
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl bg-card/60 dark:bg-card/40 p-5 ring-1 ring-border/50">
                  <div className="font-medium text-foreground mb-2">Salary Negotiations</div>
                  <p className="text-sm text-muted-foreground">
                    Know exactly what gross salary to ask for to achieve your target monthly income.
                  </p>
                </div>
                <div className="rounded-xl bg-card/60 dark:bg-card/40 p-5 ring-1 ring-border/50">
                  <div className="font-medium text-foreground mb-2">Budgeting</div>
                  <p className="text-sm text-muted-foreground">
                    If you need a specific amount each month, work backwards to find the salary needed.
                  </p>
                </div>
                <div className="rounded-xl bg-card/60 dark:bg-card/40 p-5 ring-1 ring-border/50">
                  <div className="font-medium text-foreground mb-2">Contract Rates</div>
                  <p className="text-sm text-muted-foreground">
                    Calculate equivalent day rates for contractors vs permanent salary equivalents.
                  </p>
                </div>
                <div className="rounded-xl bg-card/60 dark:bg-card/40 p-5 ring-1 ring-border/50">
                  <div className="font-medium text-foreground mb-2">Comparing Offers</div>
                  <p className="text-sm text-muted-foreground">
                    When offers quote different bases, compare what gross you need for equal take-home.
                  </p>
                </div>
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
