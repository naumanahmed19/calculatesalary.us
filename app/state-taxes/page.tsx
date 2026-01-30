import type { Metadata } from 'next'
import { SidebarLayout } from '@/components/sidebar-layout'
import { TAX_YEAR } from '@/lib/us-tax-calculator'
import { STATE_TAX_CONFIGS, getStatesWithNoIncomeTax, getStatesWithFlatTax } from '@/lib/us-tax-config'
import { HeaderAd, InContentAd, FooterAd } from '@/components/ad-unit'
import Link from 'next/link'

export const metadata: Metadata = {
  title: `State Income Tax Rates ${TAX_YEAR} - All 50 States Compared`,
  description: `Compare state income tax rates across all 50 states for ${TAX_YEAR}. See which states have no income tax, flat tax rates, and progressive brackets. Find the best state for your tax situation.`,
  keywords: ['state income tax', 'state tax rates', 'no income tax states', 'state tax comparison', 'lowest state taxes', 'highest state taxes', `${TAX_YEAR} state tax`],
}

// Get all states sorted by type then name
const noTaxStates = getStatesWithNoIncomeTax()
const flatTaxStates = getStatesWithFlatTax()
const progressiveStates = Object.entries(STATE_TAX_CONFIGS)
  .filter(([code, config]) => config.hasIncomeTax && !config.flatRate)
  .sort((a, b) => a[1].name.localeCompare(b[1].name))

export default function StateTaxesPage() {
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
                State Income Tax Rates
              </h1>
              <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
                Compare income tax rates across all 50 states. Nine states have no income tax,
                while others range from flat rates to highly progressive systems.
              </p>
            </div>
          </div>
        </section>

        {/* No Tax States */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
                States With No Income Tax
              </h2>
              <p className="text-muted-foreground text-center mb-8">
                These 9 states don't tax your earned income
              </p>

              <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-3">
                {noTaxStates.map((code) => (
                  <Link
                    key={code}
                    href={`/state/${code.toLowerCase()}`}
                    className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 p-4 text-center ring-1 ring-emerald-200 dark:ring-emerald-800 hover:ring-emerald-400 transition-all"
                  >
                    <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                      {code}
                    </span>
                    <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-1">
                      {STATE_TAX_CONFIGS[code].name}
                    </p>
                  </Link>
                ))}
              </div>

              <p className="text-sm text-muted-foreground text-center mt-6">
                Note: New Hampshire only taxes interest and dividend income, not wages.
              </p>
            </div>
          </div>
        </section>

        <InContentAd />

        {/* Flat Tax States */}
        <section className="py-12 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
                Flat Tax States
              </h2>
              <p className="text-muted-foreground text-center mb-8">
                These states have a single tax rate for all income levels
              </p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {flatTaxStates.map((code) => {
                  const config = STATE_TAX_CONFIGS[code]
                  return (
                    <Link
                      key={code}
                      href={`/state/${code.toLowerCase()}`}
                      className="rounded-2xl bg-card/60 p-5 ring-1 ring-border/50 hover:ring-accent/50 transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-foreground">{config.name}</span>
                        <span className="text-lg font-bold text-accent">
                          {((config.flatRate || 0) * 100).toFixed(2)}%
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {config.standardDeduction
                          ? `Standard deduction: $${config.standardDeduction.toLocaleString()}`
                          : 'No standard deduction'
                        }
                      </p>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Progressive Tax States */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
                Progressive Tax States
              </h2>
              <p className="text-muted-foreground text-center mb-8">
                These states have multiple tax brackets like the federal system
              </p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {progressiveStates.map(([code, config]) => {
                  const brackets = config.brackets || []
                  const topRate = brackets.length > 0 ? brackets[brackets.length - 1].rate : 0

                  return (
                    <Link
                      key={code}
                      href={`/state/${code.toLowerCase()}`}
                      className="rounded-2xl bg-card/60 p-5 ring-1 ring-border/50 hover:ring-accent/50 transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-foreground">{config.name}</span>
                        <span className="text-sm text-muted-foreground">
                          Up to <span className="font-bold text-foreground">{(topRate * 100).toFixed(1)}%</span>
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {brackets.length} tax brackets
                        {config.localTaxRate && ` • Local tax: ${(config.localTaxRate * 100).toFixed(1)}%`}
                      </p>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Highest & Lowest */}
        <section className="py-12 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
                Highest & Lowest State Tax Rates
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="rounded-2xl bg-card/60 p-6 ring-1 ring-border/50">
                  <h3 className="font-semibold text-foreground mb-4 text-red-600 dark:text-red-400">
                    Highest Tax States
                  </h3>
                  <ol className="space-y-2">
                    <li className="flex justify-between text-sm">
                      <span>1. California</span>
                      <span className="font-semibold">13.30%</span>
                    </li>
                    <li className="flex justify-between text-sm">
                      <span>2. Hawaii</span>
                      <span className="font-semibold">11.00%</span>
                    </li>
                    <li className="flex justify-between text-sm">
                      <span>3. New Jersey</span>
                      <span className="font-semibold">10.75%</span>
                    </li>
                    <li className="flex justify-between text-sm">
                      <span>4. Oregon</span>
                      <span className="font-semibold">9.90%</span>
                    </li>
                    <li className="flex justify-between text-sm">
                      <span>5. Minnesota</span>
                      <span className="font-semibold">9.85%</span>
                    </li>
                  </ol>
                </div>

                <div className="rounded-2xl bg-card/60 p-6 ring-1 ring-border/50">
                  <h3 className="font-semibold text-foreground mb-4 text-emerald-600 dark:text-emerald-400">
                    Lowest Tax States (with income tax)
                  </h3>
                  <ol className="space-y-2">
                    <li className="flex justify-between text-sm">
                      <span>1. North Dakota</span>
                      <span className="font-semibold">1.95%</span>
                    </li>
                    <li className="flex justify-between text-sm">
                      <span>2. Arizona</span>
                      <span className="font-semibold">2.50%</span>
                    </li>
                    <li className="flex justify-between text-sm">
                      <span>3. Indiana</span>
                      <span className="font-semibold">3.05%</span>
                    </li>
                    <li className="flex justify-between text-sm">
                      <span>4. Pennsylvania</span>
                      <span className="font-semibold">3.07%</span>
                    </li>
                    <li className="flex justify-between text-sm">
                      <span>5. Kentucky</span>
                      <span className="font-semibold">4.00%</span>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-xl font-bold text-foreground mb-4">
                Calculate Your State Taxes
              </h2>
              <p className="text-muted-foreground mb-6">
                Use our salary calculator to see your exact tax breakdown by state
              </p>
              <Link
                href="/"
                className="inline-flex items-center px-6 py-3 rounded-full bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-colors"
              >
                Try the Calculator →
              </Link>
            </div>
          </div>
        </section>

        <FooterAd />
      </main>
    </SidebarLayout>
  )
}
