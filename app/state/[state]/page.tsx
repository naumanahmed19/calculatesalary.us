import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { SalaryCalculatorForm } from '@/components/salary-calculator-form'
import { SidebarLayout } from '@/components/sidebar-layout'
import { TAX_YEAR, formatCurrency } from '@/lib/us-tax-calculator'
import { STATE_TAX_CONFIGS, STATE_MINIMUM_WAGES } from '@/lib/us-tax-config'
import { HeaderAd, InContentAd, FooterAd } from '@/components/ad-unit'
import Link from 'next/link'

interface PageProps {
  params: Promise<{ state: string }>
}

// Generate static params for all states
export const revalidate = false

export async function generateStaticParams() {
  return Object.keys(STATE_TAX_CONFIGS).map((code) => ({
    state: code.toLowerCase(),
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state } = await params
  const stateCode = state.toUpperCase()
  const config = STATE_TAX_CONFIGS[stateCode]

  if (!config) {
    return { title: 'State Not Found' }
  }

  const taxType = !config.hasIncomeTax
    ? 'No State Income Tax'
    : config.flatRate
      ? `${(config.flatRate * 100).toFixed(2)}% Flat Tax`
      : 'Progressive Tax'

  return {
    title: `${config.name} Salary Calculator ${TAX_YEAR} - ${taxType}`,
    description: `Calculate your take-home pay in ${config.name} for ${TAX_YEAR}. ${config.name} has ${!config.hasIncomeTax ? 'no state income tax' : config.flatRate ? `a flat ${(config.flatRate * 100).toFixed(2)}% state income tax` : 'a progressive state income tax'}. See federal tax, state tax, and FICA deductions.`,
    keywords: [`${config.name} salary calculator`, `${config.name} income tax`, `${stateCode} tax rate`, `${config.name} take home pay`, `${TAX_YEAR} ${config.name} taxes`],
  }
}

export default async function StatePage({ params }: PageProps) {
  const { state } = await params
  const stateCode = state.toUpperCase()
  const config = STATE_TAX_CONFIGS[stateCode]

  if (!config) {
    notFound()
  }

  const minWage = STATE_MINIMUM_WAGES[stateCode]

  return (
    <SidebarLayout>
      <main id="main-content" className="flex-1">
        <HeaderAd />

        {/* Hero */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-flex items-center rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent mb-6">
                {!config.hasIncomeTax ? (
                  <span className="text-emerald-600 dark:text-emerald-400">No State Income Tax</span>
                ) : config.flatRate ? (
                  `${(config.flatRate * 100).toFixed(2)}% Flat Tax`
                ) : (
                  'Progressive Tax'
                )}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground text-balance mb-4">
                {config.name} Salary Calculator
              </h1>
              <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
                Calculate your take-home pay in {config.name} for {TAX_YEAR}.
                {!config.hasIncomeTax
                  ? ` ${config.name} has no state income tax, so you only pay federal taxes and FICA.`
                  : config.flatRate
                    ? ` ${config.name} has a flat ${(config.flatRate * 100).toFixed(2)}% state income tax rate.`
                    : ` ${config.name} has a progressive state income tax with multiple brackets.`
                }
              </p>
            </div>
          </div>
        </section>

        {/* Calculator */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <SalaryCalculatorForm initialState={stateCode} />
          </div>
        </section>

        <InContentAd />

        {/* State Tax Info */}
        <section className="py-12 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
                {config.name} Tax Information {TAX_YEAR}
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Tax Rate Info */}
                <div className="rounded-2xl bg-card/60 p-6 ring-1 ring-border/50">
                  <h3 className="font-semibold text-foreground mb-4">State Income Tax</h3>

                  {!config.hasIncomeTax ? (
                    <div className="text-center py-4">
                      <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">0%</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        {config.name} does not tax earned income
                      </p>
                    </div>
                  ) : config.flatRate ? (
                    <div className="text-center py-4">
                      <p className="text-3xl font-bold text-foreground">{(config.flatRate * 100).toFixed(2)}%</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Flat rate on all taxable income
                      </p>
                      {config.standardDeduction && (
                        <p className="text-sm text-muted-foreground">
                          Standard deduction: ${config.standardDeduction.toLocaleString()}
                        </p>
                      )}
                    </div>
                  ) : config.brackets ? (
                    <div className="space-y-2">
                      {config.brackets.map((bracket, index) => {
                        const prevMax = index === 0 ? 0 : config.brackets![index - 1].max
                        return (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              {bracket.max === Infinity
                                ? `Over $${prevMax.toLocaleString()}`
                                : `$${prevMax.toLocaleString()} - $${bracket.max.toLocaleString()}`
                              }
                            </span>
                            <span className="font-semibold">{(bracket.rate * 100).toFixed(2)}%</span>
                          </div>
                        )
                      })}
                      {config.standardDeduction && (
                        <p className="text-xs text-muted-foreground pt-2 border-t border-border/50">
                          Standard deduction: ${config.standardDeduction.toLocaleString()}
                        </p>
                      )}
                    </div>
                  ) : null}

                  {config.localTaxRate && (
                    <div className="mt-4 pt-4 border-t border-border/50">
                      <p className="text-sm text-muted-foreground">
                        Local/City Tax: <span className="font-semibold text-foreground">{(config.localTaxRate * 100).toFixed(2)}%</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Minimum Wage & Other Info */}
                <div className="rounded-2xl bg-card/60 p-6 ring-1 ring-border/50">
                  <h3 className="font-semibold text-foreground mb-4">Other Information</h3>

                  <div className="space-y-4">
                    {minWage && (
                      <div>
                        <p className="text-sm text-muted-foreground">Minimum Wage</p>
                        <p className="text-2xl font-bold text-foreground">${minWage.wage.toFixed(2)}/hr</p>
                        {minWage.tipped && (
                          <p className="text-xs text-muted-foreground">
                            Tipped: ${minWage.tipped.toFixed(2)}/hr
                          </p>
                        )}
                      </div>
                    )}

                    <div>
                      <p className="text-sm text-muted-foreground">Annual at Minimum Wage</p>
                      <p className="text-lg font-semibold text-foreground">
                        {minWage ? formatCurrency(minWage.wage * 2080, 0) : 'N/A'}
                      </p>
                      <p className="text-xs text-muted-foreground">Based on 40 hrs/week, 52 weeks</p>
                    </div>

                    {stateCode === 'NY' && (
                      <div className="pt-2 border-t border-border/50">
                        <p className="text-sm text-muted-foreground">
                          NYC residents pay additional city tax up to 3.876%
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related States */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl font-bold text-foreground mb-6 text-center">
                Compare With Other States
              </h2>

              <div className="flex flex-wrap justify-center gap-3">
                {['CA', 'TX', 'FL', 'NY', 'WA', 'IL', 'PA', 'OH', 'GA', 'NC']
                  .filter(code => code !== stateCode)
                  .slice(0, 8)
                  .map(code => (
                    <Link
                      key={code}
                      href={`/state/${code.toLowerCase()}`}
                      className="px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm font-medium transition-colors"
                    >
                      {STATE_TAX_CONFIGS[code].name}
                    </Link>
                  ))
                }
              </div>

              <div className="text-center mt-6">
                <Link href="/state-taxes" className="text-accent hover:underline text-sm">
                  View all 50 states →
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
