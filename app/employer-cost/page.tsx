import type { Metadata } from 'next'
import Link from 'next/link'
import { SidebarLayout } from '@/components/sidebar-layout'
import { EmployerCostCalculator } from '@/components/employer-cost-calculator'
import { TAX_YEAR, formatCurrency, calculateEmployerCost, COMMON_SALARIES } from '@/lib/us-tax-calculator'
import { currentTaxConfig } from '@/lib/us-tax-config'
import { HeaderAd, MobileHeaderAd, InContentAd, FooterAd } from '@/components/ad-unit'
import { RelatedCalculators, salaryCalculators } from '@/components/related-calculators'

export const metadata: Metadata = {
  title: `US Employer Cost Calculator ${TAX_YEAR} - True Cost of Employment`,
  description: `Free US employer cost calculator for ${TAX_YEAR}. Calculate the true cost of hiring staff including employer FICA taxes (Social Security ${(currentTaxConfig.socialSecurity.rate * 100).toFixed(1)}% + Medicare ${(currentTaxConfig.medicare.rate * 100).toFixed(2)}%), FUTA, and 401(k) match. Essential for US businesses and HR.`,
  keywords: [
    'us employer cost calculator',
    'employer payroll tax calculator',
    'cost of employment usa',
    'employer fica calculator',
    'total employment cost calculator',
    'employer 401k match calculator',
    'hiring cost calculator usa',
    'employer social security tax',
    'how much does it cost to employ someone usa',
    'employer costs us',
    TAX_YEAR,
  ],
  openGraph: {
    title: `US Employer Cost Calculator ${TAX_YEAR} - Calculate True Hiring Costs`,
    description: `Free calculator to work out the true cost of employing someone in the US. Includes employer FICA, FUTA, and 401(k) match.`,
    type: 'website',
    locale: 'en_US',
  },
  alternates: {
    canonical: '/employer-cost',
  },
}

// Example salaries for the table
const exampleSalaries = [30000, 40000, 50000, 60000, 75000, 100000, 150000]

// Structured data for SEO
const employerCostSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'US Employer Cost Calculator',
  description: `Calculate the true cost of employing someone in the US for ${TAX_YEAR}`,
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
      name: 'How much does it cost to employ someone in the US?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: `The total cost of employing someone in the US includes their gross salary plus employer payroll taxes: Social Security (${(currentTaxConfig.socialSecurity.rate * 100).toFixed(1)}% up to $${currentTaxConfig.socialSecurity.wageBase.toLocaleString()}), Medicare (${(currentTaxConfig.medicare.rate * 100).toFixed(2)}%), FUTA (up to $420), state unemployment taxes, and optional 401(k) matching. For a $50,000 salary, the total employer cost is approximately $53,000-$56,000 depending on benefits.`,
      },
    },
    {
      '@type': 'Question',
      name: `What are employer FICA taxes for ${TAX_YEAR}?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `For the ${TAX_YEAR} tax year, employers pay ${(currentTaxConfig.socialSecurity.rate * 100).toFixed(1)}% Social Security tax on wages up to $${currentTaxConfig.socialSecurity.wageBase.toLocaleString()}, plus ${(currentTaxConfig.medicare.rate * 100).toFixed(2)}% Medicare tax on all wages. This totals 7.65% for most employees (matching what employees pay).`,
      },
    },
    {
      '@type': 'Question',
      name: 'What is FUTA tax?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'FUTA (Federal Unemployment Tax Act) is a federal payroll tax employers pay to fund unemployment benefits. The rate is 6% on the first $7,000 of each employee\'s wages, but most employers receive a credit of up to 5.4% for state unemployment taxes paid, reducing the effective FUTA rate to 0.6% (maximum $42 per employee per year).',
      },
    },
  ],
}

export default function EmployerCostPage() {
  return (
    <SidebarLayout>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(employerCostSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="flex-1">
        {/* Top Ad Placement */}
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
                US Employer Cost Calculator
              </h1>
              <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
                Calculate the true cost of employing someone in the US. See how employer
                FICA taxes, FUTA, state unemployment, and 401(k) matching add to salary costs.
              </p>
            </div>
          </div>
        </section>

        {/* Calculator */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <EmployerCostCalculator />
          </div>
        </section>

        {/* Ad after calculator */}
        <InContentAd />

        {/* Employer Payroll Tax Rates */}
        <section className="py-12 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-8">
                Employer Payroll Tax Rates {TAX_YEAR}
              </h2>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                  <div className="text-sm text-muted-foreground mb-1">Social Security</div>
                  <div className="text-3xl font-bold text-accent">
                    {(currentTaxConfig.socialSecurity.rate * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    Up to ${currentTaxConfig.socialSecurity.wageBase.toLocaleString()}
                  </div>
                </div>

                <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                  <div className="text-sm text-muted-foreground mb-1">Medicare</div>
                  <div className="text-3xl font-bold text-accent">
                    {(currentTaxConfig.medicare.rate * 100).toFixed(2)}%
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">All wages (no cap)</div>
                </div>

                <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                  <div className="text-sm text-muted-foreground mb-1">FUTA (Effective)</div>
                  <div className="text-3xl font-bold text-foreground">0.6%</div>
                  <div className="text-sm text-muted-foreground mt-2">First $7,000 only</div>
                </div>

                <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                  <div className="text-sm text-muted-foreground mb-1">Total FICA</div>
                  <div className="text-3xl font-bold text-foreground">7.65%</div>
                  <div className="text-sm text-muted-foreground mt-2">Employer matches employee</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Example Costs Table */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-8">
                Employer Cost Examples
              </h2>

              <div className="rounded-2xl bg-card/60 dark:bg-card/40 overflow-hidden ring-1 ring-border/50">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Gross Salary</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Employer FICA</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">FUTA/SUTA</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Total Cost</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-foreground hidden sm:table-cell">% Overhead</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {exampleSalaries.map((salary) => {
                      const result = calculateEmployerCost({
                        grossSalary: salary,
                        employer401kMatch: 0,
                        state: 'TX',
                      })
                      const overhead = ((result.totalCost - salary) / salary * 100).toFixed(1)
                      return (
                        <tr key={salary}>
                          <td className="px-4 py-3 text-sm font-medium text-foreground">
                            {formatCurrency(salary, 0)}
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-muted-foreground">
                            {formatCurrency(result.employerSocialSecurity + result.employerMedicare, 0)}
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-muted-foreground">
                            {formatCurrency(result.employerFUTA + result.employerSUTA, 0)}
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-semibold text-foreground">
                            {formatCurrency(result.totalCost, 0)}
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-accent hidden sm:table-cell">
                            +{overhead}%
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <p className="text-sm text-muted-foreground mt-4">
                Based on employer payroll taxes only. 401(k) matching and benefits would add to total cost.
              </p>
            </div>
          </div>
        </section>

        {/* Popular Employer Costs */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-4 text-center">
                Popular Employer Cost Calculations
              </h2>
              <p className="text-muted-foreground text-center mb-8">
                Quick access to employer costs for common US salaries
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {COMMON_SALARIES.slice(0, 20).map((salary) => {
                  const result = calculateEmployerCost({
                    grossSalary: salary,
                    employer401kMatch: 0,
                    state: 'TX',
                  })
                  return (
                    <Link
                      key={salary}
                      href={`/employer-cost/${salary}`}
                      className="rounded-2xl bg-card/60 dark:bg-card/40 p-4 text-center ring-1 ring-border/50 hover:ring-accent/50 transition-all"
                    >
                      <div className="text-sm font-semibold text-foreground">
                        {formatCurrency(salary, 0)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Cost: {formatCurrency(result.totalCost, 0)}
                      </div>
                    </Link>
                  )
                })}
              </div>

              <p className="text-sm text-muted-foreground mt-4 text-center">
                Click any salary to see the full employer cost breakdown
              </p>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-12 bg-muted/30 border-t border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Understanding Employer Costs
              </h2>

              <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
                <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                  <h3 className="font-semibold text-foreground mb-3">Employer FICA Taxes</h3>
                  <p>
                    Employers must match the FICA taxes paid by employees. This includes
                    {' '}{(currentTaxConfig.socialSecurity.rate * 100).toFixed(1)}% Social Security tax on wages
                    up to ${currentTaxConfig.socialSecurity.wageBase.toLocaleString()} and
                    {' '}{(currentTaxConfig.medicare.rate * 100).toFixed(2)}% Medicare tax on all wages.
                    Combined, employers pay 7.65% on most employee wages.
                  </p>
                </div>

                <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                  <h3 className="font-semibold text-foreground mb-3">FUTA Tax</h3>
                  <p>
                    The Federal Unemployment Tax Act (FUTA) tax is 6% on the first $7,000 of each
                    employee&apos;s wages. However, employers who pay state unemployment taxes on time
                    receive a credit of up to 5.4%, reducing the effective FUTA rate to just 0.6%
                    (maximum $42 per employee per year).
                  </p>
                </div>

                <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                  <h3 className="font-semibold text-foreground mb-3">State Unemployment Tax (SUTA)</h3>
                  <p>
                    State unemployment tax rates vary by state and employer experience rating.
                    New employers typically pay a standard rate (often 2-3%), while established
                    employers may pay more or less based on their layoff history. Rates and wage
                    bases differ significantly between states.
                  </p>
                </div>

                <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                  <h3 className="font-semibold text-foreground mb-3">401(k) Employer Match</h3>
                  <p>
                    While not mandatory, many employers offer 401(k) matching as a benefit.
                    Common matches include 50% of employee contributions up to 6% of salary,
                    or dollar-for-dollar up to 3-4%. This is an additional cost beyond payroll taxes.
                  </p>
                </div>
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
