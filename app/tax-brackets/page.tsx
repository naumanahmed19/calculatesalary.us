import type { Metadata } from 'next'
import { SidebarLayout } from '@/components/sidebar-layout'
import { TAX_YEAR, formatCurrency } from '@/lib/us-tax-calculator'
import { currentTaxConfig } from '@/lib/us-tax-config'
import { HeaderAd, InContentAd, FooterAd } from '@/components/ad-unit'
import Link from 'next/link'

export const metadata: Metadata = {
  title: `Federal Tax Brackets ${TAX_YEAR} - Income Tax Rates by Filing Status`,
  description: `See all ${TAX_YEAR} federal income tax brackets for Single, Married Filing Jointly, Head of Household, and Married Filing Separately. Calculate which tax bracket you're in and understand marginal vs effective tax rates.`,
  keywords: ['federal tax brackets', `${TAX_YEAR} tax brackets`, 'income tax rates', 'marginal tax rate', 'tax brackets single', 'tax brackets married', 'federal income tax'],
}

const FILING_STATUSES = [
  { key: 'single', label: 'Single' },
  { key: 'married_jointly', label: 'Married Filing Jointly' },
  { key: 'head_of_household', label: 'Head of Household' },
  { key: 'married_separately', label: 'Married Filing Separately' },
] as const

export default function TaxBracketsPage() {
  const config = currentTaxConfig

  return (
    <SidebarLayout>
      <main id="main-content" className="flex-1">
        <HeaderAd />

        {/* Hero */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-flex items-center rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent mb-6">
                {TAX_YEAR} Tax Year
              </span>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground text-balance mb-4">
                Federal Income Tax Brackets
              </h1>
              <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
                The US uses a progressive tax system with 7 tax brackets. See the rates for all filing statuses
                and understand how marginal tax rates work.
              </p>
            </div>
          </div>
        </section>

        {/* Tax Brackets Tables */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto space-y-12">
              {FILING_STATUSES.map(({ key, label }) => {
                const brackets = config.federalBrackets[key as keyof typeof config.federalBrackets]
                const standardDeduction = config.standardDeduction[key as keyof typeof config.standardDeduction]

                return (
                  <div key={key} className="rounded-3xl bg-card/60 dark:bg-card/40 p-6 sm:p-8 ring-1 ring-border/50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                      <h2 className="text-xl font-bold text-foreground">{label}</h2>
                      <p className="text-sm text-muted-foreground mt-1 sm:mt-0">
                        Standard Deduction: <span className="font-semibold text-foreground">{formatCurrency(standardDeduction, 0)}</span>
                      </p>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-4 font-semibold text-foreground">Tax Rate</th>
                            <th className="text-left py-3 px-4 font-semibold text-foreground">Taxable Income Range</th>
                            <th className="text-right py-3 px-4 font-semibold text-foreground">Tax Owed</th>
                          </tr>
                        </thead>
                        <tbody>
                          {brackets.map((bracket, index) => {
                            const prevMax = index === 0 ? 0 : brackets[index - 1].max
                            const taxOnPrevBrackets = brackets
                              .slice(0, index)
                              .reduce((sum, b, i) => {
                                const bPrevMax = i === 0 ? 0 : brackets[i - 1].max
                                return sum + (b.max - bPrevMax) * b.rate
                              }, 0)

                            return (
                              <tr key={index} className="border-b border-border/50 hover:bg-muted/30">
                                <td className="py-3 px-4">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent">
                                    {(bracket.rate * 100).toFixed(0)}%
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-muted-foreground">
                                  {bracket.max === Infinity
                                    ? `Over ${formatCurrency(prevMax, 0)}`
                                    : `${formatCurrency(prevMax, 0)} – ${formatCurrency(bracket.max, 0)}`
                                  }
                                </td>
                                <td className="py-3 px-4 text-right text-muted-foreground">
                                  {index === 0
                                    ? `${(bracket.rate * 100).toFixed(0)}% of income`
                                    : `${formatCurrency(taxOnPrevBrackets, 0)} + ${(bracket.rate * 100).toFixed(0)}% over ${formatCurrency(prevMax, 0)}`
                                  }
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <InContentAd />

        {/* How Tax Brackets Work */}
        <section className="py-12 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
                How Tax Brackets Work
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="rounded-2xl bg-card/60 p-6 ring-1 ring-border/50">
                  <h3 className="font-semibold text-foreground mb-3">Marginal Tax Rate</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your marginal rate is the tax rate on your last dollar of income. If you earn $50,000 as a
                    single filer, your marginal rate is 22%, but you don't pay 22% on all your income.
                  </p>
                  <div className="bg-muted/50 rounded-xl p-4">
                    <p className="text-xs text-muted-foreground mb-2">Example: $50,000 single filer</p>
                    <ul className="text-sm space-y-1">
                      <li>First ${currentTaxConfig.federalBrackets.single[0].max.toLocaleString()}: 10%</li>
                      <li>${currentTaxConfig.federalBrackets.single[0].max.toLocaleString()} - ${currentTaxConfig.federalBrackets.single[1].max.toLocaleString()}: 12%</li>
                      <li>${currentTaxConfig.federalBrackets.single[1].max.toLocaleString()} - $50,000: 22%</li>
                    </ul>
                  </div>
                </div>

                <div className="rounded-2xl bg-card/60 p-6 ring-1 ring-border/50">
                  <h3 className="font-semibold text-foreground mb-3">Effective Tax Rate</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your effective rate is the actual percentage of your total income that goes to taxes.
                    It's always lower than your marginal rate because of the progressive system.
                  </p>
                  <div className="bg-muted/50 rounded-xl p-4">
                    <p className="text-xs text-muted-foreground mb-2">Same $50,000 example:</p>
                    <ul className="text-sm space-y-1">
                      <li>Total Tax: ~$6,307</li>
                      <li>Effective Rate: ~12.6%</li>
                      <li>Marginal Rate: 22%</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Use our calculator to see your exact tax breakdown
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center px-6 py-3 rounded-full bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-colors"
                >
                  Calculate Your Taxes →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Standard Deductions */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
                {TAX_YEAR} Standard Deductions
              </h2>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {FILING_STATUSES.map(({ key, label }) => (
                  <div key={key} className="rounded-2xl bg-card/60 p-5 ring-1 ring-border/50 text-center">
                    <p className="text-2xl font-bold text-foreground">
                      {formatCurrency(config.standardDeduction[key as keyof typeof config.standardDeduction], 0)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">{label}</p>
                  </div>
                ))}
              </div>

              <p className="text-sm text-muted-foreground text-center mt-6">
                The standard deduction is subtracted from your gross income before tax brackets are applied.
                Most taxpayers take the standard deduction instead of itemizing.
              </p>
            </div>
          </div>
        </section>

        {/* Related Links */}
        <section className="py-12 bg-muted/30 border-t border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-xl font-bold text-foreground mb-6">Related Calculators</h2>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/" className="text-accent hover:underline">Salary Calculator</Link>
                <span className="text-muted-foreground">•</span>
                <Link href="/fica-taxes" className="text-accent hover:underline">FICA Taxes</Link>
                <span className="text-muted-foreground">•</span>
                <Link href="/state-taxes" className="text-accent hover:underline">State Tax Rates</Link>
                <span className="text-muted-foreground">•</span>
                <Link href="/401k-calculator" className="text-accent hover:underline">401(k) Calculator</Link>
              </div>
            </div>
          </div>
        </section>

        <FooterAd />
      </main>
    </SidebarLayout>
  )
}
