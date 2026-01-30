import type { Metadata } from 'next'
import Link from 'next/link'
import { SidebarLayout } from '@/components/sidebar-layout'
import { TAX_YEAR, formatCurrency, calculateSalary } from '@/lib/us-tax-calculator'
import { currentTaxConfig } from '@/lib/us-tax-config'
import { HeaderAd, InContentAd, FooterAd } from '@/components/ad-unit'

export const metadata: Metadata = {
  title: `US Tax Brackets ${TAX_YEAR} - Federal Income Tax Rates`,
  description: `Complete guide to US federal income tax brackets for ${TAX_YEAR}. See rates for single, married filing jointly, married filing separately, and head of household.`,
  keywords: ['us tax brackets', 'federal tax rates 2025', 'income tax brackets', 'tax rates by filing status'],
}

export default function TaxBandsPage() {
  const brackets = currentTaxConfig.federalBrackets.single

  const bandExamples = [
    { salary: 30000, bracket: '12%' },
    { salary: 50000, bracket: '22%' },
    { salary: 100000, bracket: '24%' },
    { salary: 200000, bracket: '32%' },
  ]

  return (
    <SidebarLayout>
      <main className="flex-1">
        <HeaderAd />

        {/* Hero */}
        <section className="py-12 md:py-16 border-b border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-flex items-center rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent mb-6">
                {TAX_YEAR} Tax Year
              </span>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground text-balance mb-4">
                Federal Income Tax Brackets
              </h1>
              <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
                Understanding how federal income tax works in the US. Learn about tax brackets,
                standard deductions, and how much tax you'll pay.
              </p>
            </div>
          </div>
        </section>

        {/* Tax Brackets Overview - Single */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Tax Brackets {TAX_YEAR} - Single Filers
              </h2>
              <p className="text-muted-foreground mb-8">
                Standard Deduction: ${currentTaxConfig.standardDeduction.single.toLocaleString()}
              </p>

              <div className="space-y-4">
                {brackets.map((bracket, index) => {
                  const prevMax = index === 0 ? 0 : brackets[index - 1].max
                  const threshold = bracket.max === Infinity
                    ? `Over $${prevMax.toLocaleString()}`
                    : `$${prevMax.toLocaleString()} - $${bracket.max.toLocaleString()}`

                  return (
                    <div
                      key={index}
                      className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                        <div>
                          <h3 className="text-xl font-semibold text-foreground">{(bracket.rate * 100).toFixed(0)}% Bracket</h3>
                          <p className="text-sm text-muted-foreground">{threshold}</p>
                        </div>
                        <div className="text-3xl font-bold text-accent">{(bracket.rate * 100).toFixed(0)}%</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <InContentAd />

        {/* Tax Brackets - Married Filing Jointly */}
        <section className="py-12 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Tax Brackets {TAX_YEAR} - Married Filing Jointly
              </h2>
              <p className="text-muted-foreground mb-8">
                Standard Deduction: ${currentTaxConfig.standardDeduction.married_jointly.toLocaleString()}
              </p>

              <div className="space-y-4">
                {currentTaxConfig.federalBrackets.married_jointly.map((bracket, index) => {
                  const prevMax = index === 0 ? 0 : currentTaxConfig.federalBrackets.married_jointly[index - 1].max
                  const threshold = bracket.max === Infinity
                    ? `Over $${prevMax.toLocaleString()}`
                    : `$${prevMax.toLocaleString()} - $${bracket.max.toLocaleString()}`

                  return (
                    <div
                      key={index}
                      className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{(bracket.rate * 100).toFixed(0)}% Bracket</h3>
                          <p className="text-sm text-muted-foreground">{threshold}</p>
                        </div>
                        <div className="text-2xl font-bold text-accent">{(bracket.rate * 100).toFixed(0)}%</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Examples */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-8">
                Tax Examples by Salary
              </h2>

              <div className="rounded-2xl bg-card/60 dark:bg-card/40 overflow-hidden ring-1 ring-border/50">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Salary</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Top Bracket</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Federal Tax</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Take Home</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {bandExamples.map(({ salary, bracket }) => {
                      const result = calculateSalary({
                        grossSalary: salary,
                        filingStatus: 'single',
                        state: 'TX', // No state tax for cleaner example
                      })
                      return (
                        <tr key={salary}>
                          <td className="px-4 py-3">
                            <Link
                              href={`/salary/${salary}`}
                              className="text-sm font-medium text-accent hover:underline"
                            >
                              {formatCurrency(salary, 0)}
                            </Link>
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">{bracket}</td>
                          <td className="px-4 py-3 text-sm text-right text-destructive">
                            {formatCurrency(result.yearly.federalTax, 0)}
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-medium text-foreground">
                            {formatCurrency(result.yearly.takeHomePay, 0)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 bg-muted/30 border-t border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Calculate Your Tax
              </h2>
              <p className="text-muted-foreground mb-6">
                Use our free calculator to see exactly how much tax you'll pay on your salary.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Open Calculator
                </Link>
                <Link
                  href="/fica-taxes"
                  className="inline-flex items-center justify-center rounded-lg border border-border px-6 py-3 text-sm font-medium hover:bg-muted transition-colors"
                >
                  FICA Taxes Explained
                </Link>
              </div>
            </div>
          </div>
        </section>

        <FooterAd />
      </main>
    </SidebarLayout>
  )
}
