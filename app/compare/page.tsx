import type { Metadata } from 'next'
import Link from 'next/link'
import { SidebarLayout } from '@/components/sidebar-layout'
import { SalaryComparisonCalculator, ComparisonSalary } from '@/components/salary-comparison-calculator'
import { TAX_YEAR, formatCurrency, calculateSalary } from '@/lib/us-tax-calculator'
import { HeaderAd, MobileHeaderAd, InContentAd, FooterAd } from '@/components/ad-unit'
import { RelatedCalculators, salaryCalculators } from '@/components/related-calculators'

export const metadata: Metadata = {
  title: `Salary Comparison Calculator ${TAX_YEAR} | Compare Take Home Pay`,
  description: `Compare two or more US salaries side by side. See the difference in take-home pay, federal tax, state tax, and FICA for ${TAX_YEAR}.`,
  keywords: [
    'salary comparison calculator',
    'compare salaries',
    'take home pay comparison',
    'salary difference calculator',
    'wage comparison tool',
    'us salary comparison',
    TAX_YEAR,
  ],
  openGraph: {
    title: `Salary Comparison Calculator ${TAX_YEAR} - Compare US Salaries`,
    description: 'Compare multiple US salaries and see the exact difference in take-home pay after taxes.',
    type: 'website',
    locale: 'en_US',
  },
  alternates: {
    canonical: '/compare',
  },
}

const POPULAR_COMPARISONS = [
  { s1: 40000, s2: 50000 },
  { s1: 50000, s2: 60000 },
  { s1: 60000, s2: 75000 },
  { s1: 75000, s2: 100000 },
  { s1: 100000, s2: 120000 },
  { s1: 100000, s2: 150000 },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I compare two salaries after tax?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'To compare salaries after tax, calculate the take-home pay for each salary by subtracting federal income tax, state tax (if applicable), Social Security, and Medicare. Then compare the net amounts to see the actual difference in your pocket.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is a $10,000 raise worth it after taxes?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A $10,000 raise typically results in about $6,500-$7,500 extra take-home pay per year, depending on your tax bracket. In higher brackets (22-24%), you keep less of each additional dollar. Use our calculator to see the exact impact.',
      },
    },
    {
      '@type': 'Question',
      name: 'Why is the salary difference different from the take-home difference?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Due to progressive taxation, each additional dollar earned may be taxed at a higher rate. A $20,000 salary difference might only result in a $13,000-$15,000 take-home difference because the extra income is taxed at your marginal rate.',
      },
    },
  ],
}

const initialComparison: ComparisonSalary[] = [
  { id: '1', label: '$60,000', salary: 60000, filingStatus: 'single', state: 'TX' },
  { id: '2', label: '$80,000', salary: 80000, filingStatus: 'single', state: 'TX' },
]

export default function ComparePage() {
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
                Salary Comparison Calculator
              </h1>
              <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
                Compare two or more US salaries side by side. See the exact difference in take-home pay after federal tax, state tax, and FICA.
              </p>
            </div>
          </div>
        </section>

        {/* Calculator */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <SalaryComparisonCalculator initialSalaries={initialComparison} />
          </div>
        </section>

        <InContentAd />

        {/* Popular Comparisons */}
        <section className="py-12 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-4 text-center">
                Popular Salary Comparisons
              </h2>
              <p className="text-muted-foreground text-center mb-8">
                Quick comparisons for common salary jumps
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {POPULAR_COMPARISONS.map(({ s1, s2 }) => {
                  const r1 = calculateSalary({ grossSalary: s1, filingStatus: 'single', state: 'TX' })
                  const r2 = calculateSalary({ grossSalary: s2, filingStatus: 'single', state: 'TX' })
                  const diff = r2.yearly.takeHomePay - r1.yearly.takeHomePay
                  return (
                    <Link
                      key={`${s1}-${s2}`}
                      href={`/compare/${s1}-vs-${s2}`}
                      className="rounded-2xl bg-card/60 dark:bg-card/40 p-5 ring-1 ring-border/50 hover:ring-accent/50 transition-all"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-lg font-bold text-foreground">${(s1 / 1000).toFixed(0)}k</span>
                        <span className="text-muted-foreground">vs</span>
                        <span className="text-lg font-bold text-foreground">${(s2 / 1000).toFixed(0)}k</span>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-muted-foreground">Take-home difference</div>
                        <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                          +{formatCurrency(diff, 0)}/yr
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          +{formatCurrency(diff / 12, 0)}/month
                        </div>
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
                Salary Jump Take-Home Impact
              </h2>

              <div className="rounded-2xl bg-card/60 dark:bg-card/40 overflow-hidden ring-1 ring-border/50">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Salary Jump</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Gross Diff</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Take-Home Diff</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-foreground hidden sm:table-cell">Monthly Extra</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-foreground hidden md:table-cell">% Kept</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {[
                      { s1: 40000, s2: 50000 },
                      { s1: 50000, s2: 65000 },
                      { s1: 65000, s2: 80000 },
                      { s1: 80000, s2: 100000 },
                      { s1: 100000, s2: 130000 },
                      { s1: 130000, s2: 175000 },
                    ].map(({ s1, s2 }) => {
                      const r1 = calculateSalary({ grossSalary: s1, filingStatus: 'single', state: 'TX' })
                      const r2 = calculateSalary({ grossSalary: s2, filingStatus: 'single', state: 'TX' })
                      const grossDiff = s2 - s1
                      const takeHomeDiff = r2.yearly.takeHomePay - r1.yearly.takeHomePay
                      const pctKept = (takeHomeDiff / grossDiff) * 100
                      return (
                        <tr key={`${s1}-${s2}`} className="hover:bg-muted/30">
                          <td className="px-4 py-3 text-sm font-medium text-foreground">
                            <Link href={`/compare/${s1}-vs-${s2}`} className="text-accent hover:underline">
                              ${(s1 / 1000).toFixed(0)}k → ${(s2 / 1000).toFixed(0)}k
                            </Link>
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-muted-foreground">
                            +${grossDiff.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-semibold text-emerald-600 dark:text-emerald-400">
                            +{formatCurrency(takeHomeDiff, 0)}
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-muted-foreground hidden sm:table-cell">
                            +{formatCurrency(takeHomeDiff / 12, 0)}
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-muted-foreground hidden md:table-cell">
                            {pctKept.toFixed(0)}%
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                * Based on single filer in a no-tax state (Texas). The "% Kept" shows how much of your raise you actually take home.
              </p>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-12 bg-muted/30 border-t border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                <h3 className="font-semibold text-foreground mb-3">Why Take-Home Differs From Gross</h3>
                <p className="text-sm text-muted-foreground">
                  Due to progressive taxation in the US, each dollar you earn may be taxed at a different rate.
                  A $20,000 raise doesn't mean $20,000 more in your pocket. If you're in the 22% tax bracket,
                  you'll keep about 70-75% of that raise after federal tax and FICA.
                </p>
              </div>

              <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                <h3 className="font-semibold text-foreground mb-3">Marginal vs Effective Tax Rate</h3>
                <p className="text-sm text-muted-foreground">
                  Your <strong className="text-foreground">marginal rate</strong> is what you pay on your next dollar earned.
                  Your <strong className="text-foreground">effective rate</strong> is your total tax divided by total income.
                  When comparing salary offers, use the marginal rate to estimate how much of a raise you'll keep.
                </p>
              </div>

              <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                <h3 className="font-semibold text-foreground mb-3">Consider Total Compensation</h3>
                <p className="text-sm text-muted-foreground">
                  When comparing job offers, don't just look at salary. Consider 401(k) matching, health insurance premiums,
                  stock options, bonuses, and other benefits. A lower salary with great benefits might have higher total value.
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
