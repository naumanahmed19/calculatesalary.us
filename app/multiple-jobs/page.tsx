import type { Metadata } from 'next'
import { SidebarLayout } from '@/components/sidebar-layout'
import { MultipleJobsCalculator } from '@/components/multiple-jobs-calculator'
import { TAX_YEAR } from '@/lib/us-tax-calculator'
import { currentTaxConfig } from '@/lib/us-tax-config'
import { HeaderAd, MobileHeaderAd, InContentAd, FooterAd } from '@/components/ad-unit'
import { RelatedCalculators, salaryCalculators } from '@/components/related-calculators'
import Link from 'next/link'

export const metadata: Metadata = {
  title: `US Multiple Jobs Tax Calculator ${TAX_YEAR} - 2nd Job Tax Calculator`,
  description: `Calculate tax on 2 or more jobs in the US for ${TAX_YEAR}. See how your combined income affects your federal and state tax bill, FICA withholding, and potential underpayment.`,
  keywords: [
    '2 jobs calculator',
    '2 jobs salary calculator',
    '2nd job calculator',
    'second job tax calculator us',
    'multiple jobs tax calculator',
    'two jobs tax usa',
    'tax on second job',
    'W-4 multiple jobs',
    TAX_YEAR,
  ],
  openGraph: {
    title: `US Multiple Jobs Tax Calculator ${TAX_YEAR}`,
    description: 'Calculate your total tax when working 2 or more jobs in the US.',
    type: 'website',
    locale: 'en_US',
  },
  alternates: {
    canonical: '/multiple-jobs',
  },
}

// Structured data
const multipleJobsSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'US Multiple Jobs Tax Calculator',
  description: `Calculate tax on multiple jobs in the US for ${TAX_YEAR}`,
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
      name: 'How is tax calculated when you have 2 jobs in the US?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Each employer withholds federal and state income taxes based on your W-4 form as if that's your only job. Your total income from all jobs is combined when you file your tax return. If your combined income pushes you into a higher tax bracket, you may owe additional taxes. The standard deduction ($${currentTaxConfig.standardDeduction.single.toLocaleString()} single in ${TAX_YEAR}) is applied once to your total income.`,
      },
    },
    {
      '@type': 'Question',
      name: 'How should I fill out my W-4 with multiple jobs?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The IRS provides several options on the W-4 form: Use the IRS Tax Withholding Estimator for the most accurate withholding, complete the Multiple Jobs Worksheet (Step 2), or check the box in Step 2(c) if you have only two jobs with similar pay. Adjusting your W-4 helps avoid a large tax bill or penalty at filing time.',
      },
    },
    {
      '@type': 'Question',
      name: 'Will I pay more taxes with a second job?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: `You may pay a higher overall tax rate if your combined income moves you into a higher federal tax bracket. The US uses progressive tax brackets (10%, 12%, 22%, 24%, 32%, 35%, 37% for ${TAX_YEAR}). However, only the income above each bracket threshold is taxed at the higher rate, not your entire income.`,
      },
    },
    {
      '@type': 'Question',
      name: 'Do I pay Social Security and Medicare on both jobs?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: `Yes, FICA taxes are withheld from each job. Social Security tax (${(currentTaxConfig.socialSecurity.rate * 100).toFixed(1)}%) is withheld up to the wage base ($${currentTaxConfig.socialSecurity.wageBase.toLocaleString()}) per employer. Medicare tax (${(currentTaxConfig.medicare.rate * 100).toFixed(2)}%) has no wage cap. If you overpay Social Security due to multiple jobs, you can claim a credit on your tax return.`,
      },
    },
  ],
}

export default function MultipleJobsPage() {
  return (
    <SidebarLayout>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(multipleJobsSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="flex-1">
        {/* Top Ad */}
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
                US Multiple Jobs Tax Calculator
              </h1>
              <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
                Calculate your total tax when working 2 or more jobs. See how your combined income
                affects withholding, potential underpayment, and your actual take-home pay.
              </p>
            </div>
          </div>
        </section>

        {/* Calculator */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <MultipleJobsCalculator />
          </div>
        </section>

        {/* Ad after calculator */}
        <InContentAd />

        {/* How Tax Works */}
        <section className="py-12 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-8">
                How Tax Works with Multiple Jobs
              </h2>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                  <h3 className="font-semibold text-foreground mb-3">Federal Income Tax</h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Each employer withholds taxes based on your W-4</li>
                    <li>• Withholding assumes each job is your only income</li>
                    <li>• Combined income determines your actual tax bracket</li>
                    <li>• Standard deduction (${currentTaxConfig.standardDeduction.single.toLocaleString()} single) applies once</li>
                  </ul>
                </div>

                <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                  <h3 className="font-semibold text-foreground mb-3">FICA Taxes</h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Social Security: {(currentTaxConfig.socialSecurity.rate * 100).toFixed(1)}% up to ${currentTaxConfig.socialSecurity.wageBase.toLocaleString()}</li>
                    <li>• Medicare: {(currentTaxConfig.medicare.rate * 100).toFixed(2)}% on all wages (no cap)</li>
                    <li>• Each employer withholds FICA independently</li>
                    <li>• SS overpayment can be claimed as credit when filing</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* W-4 Tips */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-8">
                W-4 Options for Multiple Jobs
              </h2>

              <div className="rounded-2xl bg-card/60 dark:bg-card/40 overflow-hidden ring-1 ring-border/50">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Option</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Description</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground hidden sm:table-cell">Best For</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr>
                      <td className="px-4 py-3 text-sm font-semibold text-foreground">IRS Estimator</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">Use the IRS Tax Withholding Estimator online tool</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">Most accurate withholding</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-semibold text-foreground">Step 2(c) Checkbox</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">Check the box on both W-4s if only two jobs with similar pay</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">Two similar-paying jobs</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-semibold text-foreground">Multiple Jobs Worksheet</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">Complete the worksheet to calculate extra withholding</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">Different pay amounts</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-semibold text-foreground">Extra Withholding</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">Enter additional amount to withhold in Step 4(c)</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground hidden sm:table-cell">Fine-tuning withholding</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Tips Section */}
        <section className="py-12 bg-muted/30 border-t border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Tips for Managing Tax with Multiple Jobs
              </h2>

              <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                <h3 className="font-semibold text-foreground mb-3">Check Your Withholding</h3>
                <p className="text-sm text-muted-foreground">
                  Use the IRS Tax Withholding Estimator at least once a year, especially after starting
                  a new job. This tool helps you determine the right amount of withholding to avoid
                  owing a large amount or getting too big of a refund.
                </p>
              </div>

              <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                <h3 className="font-semibold text-foreground mb-3">Avoiding Underpayment Penalties</h3>
                <p className="text-sm text-muted-foreground">
                  If you owe more than $1,000 when you file, you may face an underpayment penalty.
                  To avoid this, ensure your withholding covers at least 90% of this year&apos;s tax
                  or 100% of last year&apos;s tax (110% if your AGI was over $150,000).
                </p>
              </div>

              <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                <h3 className="font-semibold text-foreground mb-3">Self-Employment as Second Income</h3>
                <p className="text-sm text-muted-foreground">
                  If your second job is self-employed (freelance, 1099 contractor), you&apos;ll need to
                  make quarterly estimated tax payments. Self-employment tax (15.3%) covers both
                  employee and employer portions of FICA. See our{' '}
                  <Link href="/self-employed" className="text-accent hover:underline">self-employed calculator</Link> for
                  more details.
                </p>
              </div>

              <div className="rounded-2xl bg-accent/10 p-6 ring-1 ring-accent/30">
                <h3 className="font-semibold text-foreground mb-3">Social Security Overpayment</h3>
                <p className="text-sm text-muted-foreground">
                  If your combined wages exceed the Social Security wage base (${currentTaxConfig.socialSecurity.wageBase.toLocaleString()} in {TAX_YEAR})
                  and each employer withheld Social Security tax, you may have overpaid. Claim the
                  excess as a credit on your Form 1040 when you file your tax return.
                </p>
              </div>
            </div>
          </div>
        </section>

        <RelatedCalculators calculators={salaryCalculators} />
        {/* Footer Ad */}
        <FooterAd />
      </main>
    </SidebarLayout>
  )
}
