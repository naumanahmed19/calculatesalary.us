import type { Metadata } from 'next'
import Link from 'next/link'
import { SidebarLayout } from '@/components/sidebar-layout'
import { SalaryCalculatorForm } from '@/components/salary-calculator-form'
import { TAX_YEAR, formatCurrency, calculateSalary } from '@/lib/us-tax-calculator'
import { HeaderAd, MobileHeaderAd, InContentAd, FooterAd } from '@/components/ad-unit'
import { RelatedCalculators, salaryCalculators } from '@/components/related-calculators'

export const metadata: Metadata = {
  title: `Salary After Tax Calculator ${TAX_YEAR} | US Take Home Pay`,
  description: `Calculate your US salary after tax for ${TAX_YEAR}. See your take-home pay after Federal Tax, State Tax, Social Security, and Medicare deductions.`,
  keywords: [
    'salary after tax calculator',
    'take home pay calculator',
    'us salary calculator',
    'after tax income calculator',
    'net pay calculator',
    'federal tax calculator',
    'paycheck calculator',
    TAX_YEAR,
  ],
  openGraph: {
    title: `Salary After Tax Calculator ${TAX_YEAR} - US Take Home Pay`,
    description: 'Calculate your take-home pay after all US federal and state tax deductions.',
    type: 'website',
    locale: 'en_US',
  },
  alternates: {
    canonical: '/salary-after-tax',
  },
}

const COMMON_SALARIES = [
  30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000, 120000, 150000
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I calculate salary after tax in the US?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'To calculate your salary after tax, subtract federal income tax (based on tax brackets), Social Security (6.2% up to $168,600), Medicare (1.45%), and any state income tax from your gross salary. The standard deduction ($14,600 for single filers in 2024) reduces your taxable income.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the take home pay on $75,000 salary?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'On a $75,000 salary in the US, your approximate take-home pay is $58,500 per year ($4,875/month) in a no-tax state like Texas. In California, it would be around $54,800/year due to state income tax.',
      },
    },
    {
      '@type': 'Question',
      name: 'Which US states have no income tax?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Nine US states have no state income tax: Alaska, Florida, Nevada, New Hampshire (dividends/interest only), South Dakota, Tennessee, Texas, Washington, and Wyoming. Living in these states means higher take-home pay.',
      },
    },
  ],
}

export default function SalaryAfterTaxPage() {
  return (
    <SidebarLayout>
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
                Salary After Tax Calculator
              </h1>
              <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
                Calculate your US take-home pay after Federal Tax, State Tax, Social Security, and Medicare deductions.
              </p>
            </div>
          </div>
        </section>

        {/* Calculator */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <SalaryCalculatorForm />
          </div>
        </section>

        <InContentAd />

        {/* Popular Salaries */}
        <section className="py-12 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-4 text-center">
                Popular Salary Calculations
              </h2>
              <p className="text-muted-foreground text-center mb-8">
                See take-home pay for common US salaries
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {COMMON_SALARIES.map((salary) => {
                  const result = calculateSalary({
                    grossSalary: salary,
                    filingStatus: 'single',
                    state: 'TX',
                  })
                  return (
                    <Link
                      key={salary}
                      href={`/salary-after-tax/${salary}`}
                      className="rounded-2xl bg-card/60 dark:bg-card/40 p-4 text-center ring-1 ring-border/50 hover:ring-accent/50 transition-all"
                    >
                      <div className="text-lg font-bold text-foreground">
                        ${(salary / 1000).toFixed(0)}k
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatCurrency(result.yearly.takeHomePay, 0)}/yr
                      </div>
                      <div className="text-xs text-accent mt-1">
                        {formatCurrency(result.monthly.takeHomePay, 0)}/mo
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Quick Reference Table */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-8">
                Salary After Tax Quick Reference
              </h2>

              <div className="rounded-2xl bg-card/60 dark:bg-card/40 overflow-hidden ring-1 ring-border/50">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Gross Salary</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Federal Tax</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">FICA</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Take Home</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-foreground hidden sm:table-cell">Monthly</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {[40000, 50000, 60000, 75000, 100000, 150000].map((salary) => {
                      const result = calculateSalary({
                        grossSalary: salary,
                        filingStatus: 'single',
                        state: 'TX',
                      })
                      return (
                        <tr key={salary} className="hover:bg-muted/30">
                          <td className="px-4 py-3 text-sm font-medium text-foreground">
                            <Link href={`/salary-after-tax/${salary}`} className="text-accent hover:underline">
                              ${salary.toLocaleString()}
                            </Link>
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-destructive">
                            {formatCurrency(result.yearly.federalTax, 0)}
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-muted-foreground">
                            {formatCurrency(result.yearly.socialSecurity + result.yearly.medicare, 0)}
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-semibold text-accent">
                            {formatCurrency(result.yearly.takeHomePay, 0)}
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-muted-foreground hidden sm:table-cell">
                            {formatCurrency(result.monthly.takeHomePay, 0)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                * Based on single filer in a no-tax state (Texas). Your results will vary by state and filing status.
              </p>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-12 bg-muted/30 border-t border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                <h3 className="font-semibold text-foreground mb-3">Understanding US Tax Deductions</h3>
                <p className="text-sm text-muted-foreground">
                  Your salary after tax is calculated by deducting: <strong className="text-foreground">Federal Income Tax</strong> (10-37% depending on bracket),
                  <strong className="text-foreground"> Social Security</strong> (6.2% up to $168,600),
                  <strong className="text-foreground"> Medicare</strong> (1.45%, plus 0.9% additional for high earners), and
                  <strong className="text-foreground"> State Income Tax</strong> (0-13.3% depending on state).
                </p>
              </div>

              <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                <h3 className="font-semibold text-foreground mb-3">Federal Tax Brackets {TAX_YEAR}</h3>
                <p className="text-sm text-muted-foreground">
                  US federal income tax uses a progressive bracket system: 10% (up to $11,600), 12% ($11,601-$47,150),
                  22% ($47,151-$100,525), 24% ($100,526-$191,950), 32% ($191,951-$243,725), 35% ($243,726-$609,350),
                  and 37% (over $609,350). These are for single filers after the standard deduction.
                </p>
              </div>

              <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                <h3 className="font-semibold text-foreground mb-3">No State Income Tax States</h3>
                <p className="text-sm text-muted-foreground">
                  Nine states have no state income tax: Alaska, Florida, Nevada, New Hampshire, South Dakota, Tennessee,
                  Texas, Washington, and Wyoming. Living in these states can significantly increase your take-home pay,
                  especially at higher income levels.
                </p>
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
