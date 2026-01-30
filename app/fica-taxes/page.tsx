import type { Metadata } from 'next'
import { SidebarLayout } from '@/components/sidebar-layout'
import { TAX_YEAR, formatCurrency } from '@/lib/us-tax-calculator'
import { currentTaxConfig } from '@/lib/us-tax-config'
import { HeaderAd, InContentAd, FooterAd } from '@/components/ad-unit'
import Link from 'next/link'

export const metadata: Metadata = {
  title: `FICA Taxes ${TAX_YEAR} - Social Security & Medicare Rates Explained`,
  description: `Understand FICA taxes for ${TAX_YEAR}: Social Security (6.2% up to $${currentTaxConfig.socialSecurity.wageBase.toLocaleString()}) and Medicare (1.45% + 0.9% additional). Learn how payroll taxes work and calculate your FICA contributions.`,
  keywords: ['FICA taxes', 'social security tax', 'medicare tax', 'payroll taxes', `${TAX_YEAR} FICA rates`, 'social security wage base', 'self employment tax'],
}

const config = currentTaxConfig

export default function FICATaxesPage() {
  const ssMax = config.socialSecurity.wageBase * config.socialSecurity.rate
  const medicareExample = 100000 * config.medicare.rate
  const additionalMedicare = (300000 - 200000) * config.medicare.additionalRate

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
                FICA Taxes Explained
              </h1>
              <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
                FICA stands for Federal Insurance Contributions Act. These payroll taxes fund
                Social Security and Medicare programs. Both employees and employers pay FICA taxes.
              </p>
            </div>
          </div>
        </section>

        {/* Main Rates */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Social Security */}
                <div className="rounded-3xl bg-blue-50 dark:bg-blue-950/30 p-8 ring-1 ring-blue-200 dark:ring-blue-800">
                  <h2 className="text-xl font-bold text-foreground mb-4">Social Security (OASDI)</h2>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Employee Rate</p>
                      <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                        {(config.socialSecurity.rate * 100).toFixed(1)}%
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">{TAX_YEAR} Wage Base Limit</p>
                      <p className="text-2xl font-semibold text-foreground">
                        {formatCurrency(config.socialSecurity.wageBase, 0)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        No Social Security tax on earnings above this amount
                      </p>
                    </div>

                    <div className="pt-4 border-t border-blue-200 dark:border-blue-800">
                      <p className="text-sm text-muted-foreground">Maximum Employee SS Tax</p>
                      <p className="text-xl font-semibold text-foreground">
                        {formatCurrency(ssMax, 0)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Employer Also Pays</p>
                      <p className="text-lg font-semibold text-foreground">
                        {(config.socialSecurity.rate * 100).toFixed(1)}% (matching)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Medicare */}
                <div className="rounded-3xl bg-purple-50 dark:bg-purple-950/30 p-8 ring-1 ring-purple-200 dark:ring-purple-800">
                  <h2 className="text-xl font-bold text-foreground mb-4">Medicare (HI)</h2>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Employee Rate</p>
                      <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                        {(config.medicare.rate * 100).toFixed(2)}%
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Wage Base Limit</p>
                      <p className="text-2xl font-semibold text-foreground">
                        No Limit
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Medicare tax applies to all earnings
                      </p>
                    </div>

                    <div className="pt-4 border-t border-purple-200 dark:border-purple-800">
                      <p className="text-sm text-muted-foreground">Additional Medicare Tax</p>
                      <p className="text-xl font-semibold text-foreground">
                        +{(config.medicare.additionalRate * 100).toFixed(1)}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        On wages over ${config.medicare.additionalThreshold.single.toLocaleString()} (single)
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Employer Also Pays</p>
                      <p className="text-lg font-semibold text-foreground">
                        {(config.medicare.rate * 100).toFixed(2)}% (matching)
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Note: Employers don't pay the additional 0.9%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <InContentAd />

        {/* Combined FICA */}
        <section className="py-12 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
                Total FICA Tax Rates {TAX_YEAR}
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold">Tax Type</th>
                      <th className="text-right py-3 px-4 font-semibold">Employee</th>
                      <th className="text-right py-3 px-4 font-semibold">Employer</th>
                      <th className="text-right py-3 px-4 font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4">Social Security</td>
                      <td className="py-3 px-4 text-right">{(config.socialSecurity.rate * 100).toFixed(1)}%</td>
                      <td className="py-3 px-4 text-right">{(config.socialSecurity.rate * 100).toFixed(1)}%</td>
                      <td className="py-3 px-4 text-right font-semibold">{(config.socialSecurity.rate * 200).toFixed(1)}%</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <td className="py-3 px-4">Medicare</td>
                      <td className="py-3 px-4 text-right">{(config.medicare.rate * 100).toFixed(2)}%</td>
                      <td className="py-3 px-4 text-right">{(config.medicare.rate * 100).toFixed(2)}%</td>
                      <td className="py-3 px-4 text-right font-semibold">{(config.medicare.rate * 200).toFixed(1)}%</td>
                    </tr>
                    <tr className="bg-muted/50">
                      <td className="py-3 px-4 font-semibold">Total FICA</td>
                      <td className="py-3 px-4 text-right font-semibold">7.65%</td>
                      <td className="py-3 px-4 text-right font-semibold">7.65%</td>
                      <td className="py-3 px-4 text-right font-bold text-accent">15.30%</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-sm text-muted-foreground text-center mt-6">
                Self-employed individuals pay both portions (15.3%) but can deduct half as an adjustment to income.
              </p>
            </div>
          </div>
        </section>

        {/* Examples */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
                FICA Tax Examples
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="rounded-2xl bg-card/60 p-6 ring-1 ring-border/50">
                  <h3 className="font-semibold text-foreground mb-4">$50,000 Salary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Social Security</span>
                      <span className="font-semibold">{formatCurrency(50000 * 0.062, 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Medicare</span>
                      <span className="font-semibold">{formatCurrency(50000 * 0.0145, 0)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-border/50">
                      <span className="font-semibold">Total FICA</span>
                      <span className="font-bold text-accent">{formatCurrency(50000 * 0.0765, 0)}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-card/60 p-6 ring-1 ring-border/50">
                  <h3 className="font-semibold text-foreground mb-4">$100,000 Salary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Social Security</span>
                      <span className="font-semibold">{formatCurrency(100000 * 0.062, 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Medicare</span>
                      <span className="font-semibold">{formatCurrency(100000 * 0.0145, 0)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-border/50">
                      <span className="font-semibold">Total FICA</span>
                      <span className="font-bold text-accent">{formatCurrency(100000 * 0.0765, 0)}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-card/60 p-6 ring-1 ring-border/50">
                  <h3 className="font-semibold text-foreground mb-4">$250,000 Salary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Social Security</span>
                      <span className="font-semibold">{formatCurrency(ssMax, 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Medicare (base)</span>
                      <span className="font-semibold">{formatCurrency(250000 * 0.0145, 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Additional Medicare</span>
                      <span className="font-semibold">{formatCurrency((250000 - 200000) * 0.009, 0)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-border/50">
                      <span className="font-semibold">Total FICA</span>
                      <span className="font-bold text-accent">{formatCurrency(ssMax + (250000 * 0.0145) + ((250000 - 200000) * 0.009), 0)}</span>
                    </div>
                  </div>
                </div>
              </div>
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
                <Link href="/self-employment-tax" className="text-accent hover:underline">Self-Employment Tax</Link>
                <span className="text-muted-foreground">•</span>
                <Link href="/tax-brackets" className="text-accent hover:underline">Tax Brackets</Link>
                <span className="text-muted-foreground">•</span>
                <Link href="/employer-cost" className="text-accent hover:underline">Employer Cost</Link>
              </div>
            </div>
          </div>
        </section>

        <FooterAd />
      </main>
    </SidebarLayout>
  )
}
