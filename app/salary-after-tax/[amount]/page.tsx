import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { SidebarLayout } from '@/components/sidebar-layout'
import { SalaryCalculatorForm } from '@/components/salary-calculator-form'
import { calculateSalary, formatCurrency, TAX_YEAR } from '@/lib/us-tax-calculator'
import { currentTaxConfig } from '@/lib/us-tax-config'
import { HeaderAd, MobileHeaderAd, InContentAd, FooterAd } from '@/components/ad-unit'
import { RelatedCalculators, salaryCalculators } from '@/components/related-calculators'

const COMMON_SALARIES = [25000, 30000, 35000, 40000, 45000, 50000, 55000, 60000, 65000, 70000, 75000, 80000, 85000, 90000, 95000, 100000, 110000, 120000, 125000, 130000, 150000, 175000, 200000, 250000]

interface PageProps {
  params: Promise<{ amount: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { amount } = await params
  const salary = parseInt(amount, 10)

  if (isNaN(salary) || salary < 1000 || salary > 10000000) {
    return { title: 'Salary Not Found' }
  }

  const result = calculateSalary({
    grossSalary: salary,
    filingStatus: 'single',
    state: 'TX',
  })

  const formattedSalary = salary >= 1000 ? `$${(salary / 1000).toFixed(0)}k` : `$${salary}`

  return {
    title: `${formattedSalary} Salary After Tax ${TAX_YEAR} | Take Home Pay Calculator`,
    description: `$${salary.toLocaleString()} salary after tax = ${formatCurrency(result.yearly.takeHomePay, 0)} take home (${formatCurrency(result.monthly.takeHomePay, 0)}/month). See full tax breakdown including Federal Tax, State Tax, and FICA for ${TAX_YEAR}.`,
    keywords: [
      `${salary} salary after tax`,
      `$${salary.toLocaleString()} after tax`,
      `${(salary / 1000).toFixed(0)}k salary take home`,
      `${salary} salary usa`,
      `how much is ${salary} after tax`,
      `take home pay ${salary}`,
      'us salary calculator',
      'federal tax calculator',
    ],
    openGraph: {
      title: `$${salary.toLocaleString()} Salary After Tax - US Take Home Pay`,
      description: `Calculate take-home pay on a $${salary.toLocaleString()} salary in the US.`,
      type: 'website',
      locale: 'en_US',
    },
    alternates: {
      canonical: `/salary-after-tax/${salary}`,
    },
  }
}

export function generateStaticParams() {
  return COMMON_SALARIES.map((salary) => ({
    amount: salary.toString(),
  }))
}

export default async function SalaryAfterTaxPage({ params }: PageProps) {
  const { amount } = await params
  const salary = parseInt(amount, 10)

  if (isNaN(salary) || salary < 1000 || salary > 10000000) {
    notFound()
  }

  const result = calculateSalary({
    grossSalary: salary,
    filingStatus: 'single',
    state: 'TX',
  })

  const resultWith401k = calculateSalary({
    grossSalary: salary,
    filingStatus: 'single',
    state: 'TX',
    retirement401k: Math.min(salary * 0.06, 23500),
  })

  const resultMarried = calculateSalary({
    grossSalary: salary,
    filingStatus: 'married_jointly',
    state: 'TX',
  })

  const resultCalifornia = calculateSalary({
    grossSalary: salary,
    filingStatus: 'single',
    state: 'CA',
  })

  const nearbySalaries = COMMON_SALARIES.filter(s => Math.abs(s - salary) <= 20000 && s !== salary).slice(0, 6)

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is $${salary.toLocaleString()} after tax in the US?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `On a $${salary.toLocaleString()} salary in the US (${TAX_YEAR}), your take-home pay after tax is ${formatCurrency(result.yearly.takeHomePay, 0)} per year, or ${formatCurrency(result.monthly.takeHomePay, 0)} per month. You pay ${formatCurrency(result.yearly.federalTax, 0)} in federal tax and ${formatCurrency(result.yearly.socialSecurity + result.yearly.medicare, 0)} in FICA taxes.`,
        },
      },
      {
        '@type': 'Question',
        name: `How much federal tax do I pay on $${salary.toLocaleString()}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `On a $${salary.toLocaleString()} salary, you pay ${formatCurrency(result.yearly.federalTax, 0)} in federal income tax (${result.yearly.effectiveTaxRate.toFixed(1)}% effective rate). Your marginal federal tax rate is ${result.yearly.marginalTaxRate}%.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the monthly take home on $${salary.toLocaleString()}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The monthly take-home pay on a $${salary.toLocaleString()} salary is ${formatCurrency(result.monthly.takeHomePay, 0)} after federal tax and FICA. Weekly, this works out to ${formatCurrency(result.weekly.takeHomePay, 0)}.`,
        },
      },
    ],
  }

  return (
    <SidebarLayout>
      <main className="flex-1">
        <HeaderAd />
        <MobileHeaderAd />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />

        {/* Hero */}
        <section className="py-12 md:py-16 border-b border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-flex items-center rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent mb-6">
                {TAX_YEAR} Tax Year
              </span>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground text-balance mb-4">
                ${salary.toLocaleString()} Salary After Tax
              </h1>
              <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
                Calculate your take-home pay on a ${salary.toLocaleString()} salary including Federal Tax, FICA, and state taxes.
              </p>
            </div>
          </div>
        </section>

        {/* Quick Summary */}
        <section className="py-8 bg-muted/30 border-b border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <p className="text-center text-muted-foreground mb-4 text-sm">Single filer, no state income tax (Texas)</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="rounded-2xl bg-emerald-600 dark:bg-emerald-700 p-4 text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white">{formatCurrency(result.yearly.takeHomePay, 0)}</div>
                  <div className="text-xs text-emerald-100 mt-1">Annual Take-Home</div>
                </div>
                <div className="rounded-2xl bg-card p-4 text-center ring-1 ring-border">
                  <div className="text-2xl md:text-3xl font-bold text-foreground">{formatCurrency(result.monthly.takeHomePay, 0)}</div>
                  <div className="text-xs text-muted-foreground mt-1">Monthly</div>
                </div>
                <div className="rounded-2xl bg-card p-4 text-center ring-1 ring-border">
                  <div className="text-2xl md:text-3xl font-bold text-foreground">{formatCurrency(result.weekly.takeHomePay, 0)}</div>
                  <div className="text-xs text-muted-foreground mt-1">Weekly</div>
                </div>
                <div className="rounded-2xl bg-card p-4 text-center ring-1 ring-border">
                  <div className="text-2xl md:text-3xl font-bold text-foreground">{result.yearly.effectiveTaxRate.toFixed(1)}%</div>
                  <div className="text-xs text-muted-foreground mt-1">Effective Rate</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Breakdown */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Full Tax Breakdown
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="rounded-2xl bg-card/60 p-6 ring-1 ring-border/50">
                  <h3 className="font-semibold text-foreground mb-4">Income</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gross Salary</span>
                      <span className="font-semibold text-foreground">${salary.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Standard Deduction</span>
                      <span className="text-foreground">${currentTaxConfig.standardDeduction.single.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-border/50">
                      <span className="text-muted-foreground">Taxable Income</span>
                      <span className="font-semibold text-foreground">{formatCurrency(result.yearly.taxableIncome, 0)}</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-card/60 p-6 ring-1 ring-border/50">
                  <h3 className="font-semibold text-foreground mb-4">Deductions</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Federal Tax</span>
                      <span className="text-destructive font-medium">-{formatCurrency(result.yearly.federalTax, 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Social Security</span>
                      <span className="text-destructive font-medium">-{formatCurrency(result.yearly.socialSecurity, 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Medicare</span>
                      <span className="text-destructive font-medium">-{formatCurrency(result.yearly.medicare, 0)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-border/50">
                      <span className="text-foreground font-medium">Total Deductions</span>
                      <span className="text-destructive font-semibold">-{formatCurrency(result.yearly.totalDeductions, 0)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comparison Table */}
              <div className="mt-8">
                <h3 className="font-semibold text-foreground mb-4">Take Home by Period</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 text-foreground font-semibold">Period</th>
                        <th className="text-right py-3 px-4 text-foreground font-semibold">Gross</th>
                        <th className="text-right py-3 px-4 text-foreground font-semibold">Federal</th>
                        <th className="text-right py-3 px-4 text-foreground font-semibold">FICA</th>
                        <th className="text-right py-3 px-4 text-foreground font-semibold">Take Home</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/50">
                        <td className="py-3 px-4 text-foreground">Yearly</td>
                        <td className="py-3 px-4 text-right text-muted-foreground">${salary.toLocaleString()}</td>
                        <td className="py-3 px-4 text-right text-destructive">{formatCurrency(result.yearly.federalTax, 0)}</td>
                        <td className="py-3 px-4 text-right text-destructive">{formatCurrency(result.yearly.socialSecurity + result.yearly.medicare, 0)}</td>
                        <td className="py-3 px-4 text-right font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(result.yearly.takeHomePay, 0)}</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-3 px-4 text-foreground">Monthly</td>
                        <td className="py-3 px-4 text-right text-muted-foreground">{formatCurrency(salary / 12)}</td>
                        <td className="py-3 px-4 text-right text-destructive">{formatCurrency(result.monthly.federalTax)}</td>
                        <td className="py-3 px-4 text-right text-destructive">{formatCurrency(result.monthly.socialSecurity + result.monthly.medicare)}</td>
                        <td className="py-3 px-4 text-right font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(result.monthly.takeHomePay)}</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-3 px-4 text-foreground">Weekly</td>
                        <td className="py-3 px-4 text-right text-muted-foreground">{formatCurrency(salary / 52)}</td>
                        <td className="py-3 px-4 text-right text-destructive">{formatCurrency(result.weekly.federalTax)}</td>
                        <td className="py-3 px-4 text-right text-destructive">{formatCurrency(result.weekly.socialSecurity + result.weekly.medicare)}</td>
                        <td className="py-3 px-4 text-right font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(result.weekly.takeHomePay)}</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-foreground">Daily</td>
                        <td className="py-3 px-4 text-right text-muted-foreground">{formatCurrency(salary / 260)}</td>
                        <td className="py-3 px-4 text-right text-destructive">{formatCurrency(result.daily.federalTax)}</td>
                        <td className="py-3 px-4 text-right text-destructive">{formatCurrency(result.daily.socialSecurity + result.daily.medicare)}</td>
                        <td className="py-3 px-4 text-right font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(result.daily.takeHomePay)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </section>

        <InContentAd />

        {/* Comparison Scenarios */}
        <section className="py-12 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Different Scenarios
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="rounded-2xl bg-card/60 p-6 ring-1 ring-border/50">
                  <h3 className="font-semibold text-foreground mb-2">With 6% 401(k)</h3>
                  <p className="text-xs text-muted-foreground mb-4">Traditional 401(k) contribution</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Annual Take-Home</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(resultWith401k.yearly.takeHomePay, 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monthly Take-Home</span>
                      <span className="font-semibold text-foreground">{formatCurrency(resultWith401k.monthly.takeHomePay, 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">401(k) Contribution</span>
                      <span className="text-foreground">{formatCurrency(resultWith401k.yearly.retirement401k || 0, 0)}/yr</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-card/60 p-6 ring-1 ring-border/50">
                  <h3 className="font-semibold text-foreground mb-2">Married Filing Jointly</h3>
                  <p className="text-xs text-muted-foreground mb-4">Larger standard deduction</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Annual Take-Home</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(resultMarried.yearly.takeHomePay, 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monthly Take-Home</span>
                      <span className="font-semibold text-foreground">{formatCurrency(resultMarried.monthly.takeHomePay, 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Federal Tax</span>
                      <span className="text-foreground">{formatCurrency(resultMarried.yearly.federalTax, 0)}/yr</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-card/60 p-6 ring-1 ring-border/50">
                  <h3 className="font-semibold text-foreground mb-2">In California</h3>
                  <p className="text-xs text-muted-foreground mb-4">With state income tax</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Annual Take-Home</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(resultCalifornia.yearly.takeHomePay, 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monthly Take-Home</span>
                      <span className="font-semibold text-foreground">{formatCurrency(resultCalifornia.monthly.takeHomePay, 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">State Tax</span>
                      <span className="text-foreground">{formatCurrency(resultCalifornia.yearly.stateTax, 0)}/yr</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Calculator */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
              Customize Your Calculation
            </h2>
            <SalaryCalculatorForm initialSalary={salary} />
          </div>
        </section>

        {/* Nearby Salaries */}
        {nearbySalaries.length > 0 && (
          <section className="py-12 bg-muted/30 border-t border-border/40">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Compare Similar Salaries
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {nearbySalaries.map((nearbySalary) => {
                    const nearbyResult = calculateSalary({
                      grossSalary: nearbySalary,
                      filingStatus: 'single',
                      state: 'TX',
                    })
                    return (
                      <Link
                        key={nearbySalary}
                        href={`/salary-after-tax/${nearbySalary}`}
                        className="rounded-2xl bg-card/60 p-4 ring-1 ring-border/50 hover:ring-accent/50 transition-all"
                      >
                        <div className="text-lg font-bold text-foreground">${nearbySalary.toLocaleString()}</div>
                        <div className="text-sm text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                          {formatCurrency(nearbyResult.yearly.takeHomePay, 0)}/year
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {formatCurrency(nearbyResult.monthly.takeHomePay, 0)}/month
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* FAQ Section */}
        <section className="py-12 border-t border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-8">
                Frequently Asked Questions
              </h2>

              <div className="space-y-6">
                <div className="rounded-2xl bg-card/60 p-6 ring-1 ring-border/50">
                  <h3 className="font-semibold text-foreground mb-2">
                    What is ${salary.toLocaleString()} after tax in the US?
                  </h3>
                  <p className="text-muted-foreground">
                    On a ${salary.toLocaleString()} salary in the US ({TAX_YEAR}), your take-home pay after tax is
                    <strong className="text-foreground"> {formatCurrency(result.yearly.takeHomePay, 0)}</strong> per year, or
                    <strong className="text-foreground"> {formatCurrency(result.monthly.takeHomePay, 0)}</strong> per month.
                    You pay {formatCurrency(result.yearly.federalTax, 0)} in federal tax and {formatCurrency(result.yearly.socialSecurity + result.yearly.medicare, 0)} in FICA taxes.
                  </p>
                </div>

                <div className="rounded-2xl bg-card/60 p-6 ring-1 ring-border/50">
                  <h3 className="font-semibold text-foreground mb-2">
                    How much federal tax do I pay on ${salary.toLocaleString()}?
                  </h3>
                  <p className="text-muted-foreground">
                    On a ${salary.toLocaleString()} salary, you pay
                    <strong className="text-foreground"> {formatCurrency(result.yearly.federalTax, 0)}</strong> in federal income tax
                    ({result.yearly.effectiveTaxRate.toFixed(1)}% effective rate).
                    Your marginal federal tax rate is {result.yearly.marginalTaxRate}%.
                  </p>
                </div>

                <div className="rounded-2xl bg-card/60 p-6 ring-1 ring-border/50">
                  <h3 className="font-semibold text-foreground mb-2">
                    What federal tax bracket is ${salary.toLocaleString()} in?
                  </h3>
                  <p className="text-muted-foreground">
                    A ${salary.toLocaleString()} salary puts you in the
                    <strong className="text-foreground"> {result.yearly.marginalTaxRate}% federal tax bracket</strong>.
                    Your taxable income of {formatCurrency(result.yearly.taxableIncome, 0)} is taxed progressively across the brackets.
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
