import { FooterAd, HeaderAd, InArticleAd, InContentAd, MobileHeaderAd } from '@/components/ad-unit'
import { SalaryCalculatorForm } from '@/components/salary-calculator-form'
import { SidebarLayout } from '@/components/sidebar-layout'
import {
  calculateSalary,
  COMMON_SALARIES,
  formatCurrency,
  generateSalaryPageMeta,
  parseSalaryFromSlug,
  TAX_YEAR
} from '@/lib/us-tax-calculator'
import { currentTaxConfig } from '@/lib/us-tax-config'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const BASE_URL = 'https://ussalarycalculator.com'

interface PageProps {
  params: Promise<{ amount: string }>
}

// Generate static params for common salaries
export async function generateStaticParams() {
  return COMMON_SALARIES.map((salary) => ({
    amount: salary.toString(),
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { amount } = await params
  const salary = parseSalaryFromSlug(amount)

  if (!salary || salary <= 0 || salary > 10000000) {
    return {
      title: 'Salary Not Found',
    }
  }

  const meta = generateSalaryPageMeta(salary)

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: 'website',
      locale: 'en_US',
    },
    alternates: {
      canonical: `/salary/${salary}`,
    },
  }
}

// Generate BreadcrumbList schema
function generateBreadcrumbSchema(salary: number, formattedSalary: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: BASE_URL
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Salary Calculator',
        item: BASE_URL
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${formattedSalary} Salary`,
        item: `${BASE_URL}/salary/${salary}`
      }
    ]
  }
}

// Generate FAQ schema
function generateFaqSchema(salary: number, result: ReturnType<typeof calculateSalary>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is the take home pay on a $${salary.toLocaleString()} salary?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `On a $${salary.toLocaleString()} salary in the US, your take-home pay is approximately $${Math.round(result.yearly.takeHomePay).toLocaleString()} per year, $${Math.round(result.monthly.takeHomePay).toLocaleString()} per month, or $${Math.round(result.weekly.takeHomePay).toLocaleString()} per week after federal tax, state tax, and FICA.`,
        },
      },
      {
        '@type': 'Question',
        name: `How much federal tax do I pay on $${salary.toLocaleString()}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `On a $${salary.toLocaleString()} salary (single filer in a no-tax state), you pay approximately $${Math.round(result.yearly.federalTax).toLocaleString()} in federal income tax per year. Your effective tax rate is ${result.yearly.effectiveTaxRate.toFixed(1)}%.`,
        },
      },
    ],
  }
}

export default async function SalaryPage({ params }: PageProps) {
  const { amount } = await params
  const salary = parseSalaryFromSlug(amount)

  if (!salary || salary <= 0 || salary > 10000000) {
    notFound()
  }

  const result = calculateSalary({
    grossSalary: salary,
    filingStatus: 'single',
    state: 'TX', // Default to no state tax for general page
  })

  const formattedSalary = formatCurrency(salary, 0)

  // Get related salaries (nearby values)
  const relatedSalaries = COMMON_SALARIES
    .filter(s => Math.abs(s - salary) <= 25000 && s !== salary)
    .slice(0, 8)

  const breadcrumbSchema = generateBreadcrumbSchema(salary, formattedSalary)
  const faqSchema = generateFaqSchema(salary, result)

  return (
    <SidebarLayout>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main id="main-content" className="flex-1">
        <HeaderAd />
        <MobileHeaderAd />

        {/* Breadcrumb */}
        <nav className="container mx-auto px-4 py-4" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li className="inline-flex items-center">
              <Link href="/" className="hover:text-foreground transition-colors">
                Calculator
              </Link>
            </li>
            <li className="inline-flex items-center">/</li>
            <li className="inline-flex items-center">
              <Link href="/salaries" className="hover:text-foreground transition-colors">
                Salaries
              </Link>
            </li>
            <li className="inline-flex items-center">/</li>
            <li className="inline-flex items-center text-foreground font-medium">{formattedSalary}</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="py-8 md:py-12 border-b border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <span className="inline-flex items-center rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent mb-4">
                {TAX_YEAR} Tax Year
              </span>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
                {formattedSalary} Salary - US Take Home Pay
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                If you earn <strong className="text-foreground">{formattedSalary}</strong> per year in the US,
                you will take home approximately <strong className="text-foreground">{formatCurrency(result.yearly.takeHomePay, 0)}</strong> after
                federal tax and FICA. That's <strong className="text-foreground">{formatCurrency(result.monthly.takeHomePay)}</strong> per month.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                (Calculated for single filer in a state with no income tax)
              </p>
            </div>
          </div>
        </section>

        {/* Quick Summary Cards */}
        <section className="py-8 bg-muted/30 border-b border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
              <SummaryCard
                label="Gross Salary"
                value={formatCurrency(salary, 0)}
                subtext="per year"
              />
              <SummaryCard
                label="Take Home"
                value={formatCurrency(result.yearly.takeHomePay, 0)}
                subtext="per year"
                highlight
              />
              <SummaryCard
                label="Monthly Net"
                value={formatCurrency(result.monthly.takeHomePay)}
                subtext="per month"
              />
              <SummaryCard
                label="Effective Tax"
                value={`${result.yearly.effectiveTaxRate.toFixed(1)}%`}
                subtext="tax rate"
              />
            </div>
          </div>
        </section>

        <InContentAd />

        {/* Calculator Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-xl font-semibold text-foreground mb-6 text-center">
              Customize Your Calculation
            </h2>
            <SalaryCalculatorForm initialSalary={salary} />
          </div>
        </section>

        {/* Detailed Breakdown */}
        <section className="py-12 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-8">
                {formattedSalary} Salary Breakdown
              </h2>

              <div className="rounded-2xl bg-card/60 dark:bg-card/40 overflow-hidden ring-1 ring-border/50">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Description</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Yearly</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Monthly</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-foreground hidden sm:table-cell">Weekly</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <TableRow
                      label="Gross Salary"
                      yearly={salary}
                      monthly={salary / 12}
                      weekly={salary / 52}
                    />
                    <TableRow
                      label="Standard Deduction"
                      yearly={result.yearly.standardDeduction}
                      monthly={result.monthly.standardDeduction}
                      weekly={result.weekly.standardDeduction}
                      muted
                    />
                    <TableRow
                      label="Taxable Income"
                      yearly={result.yearly.taxableIncome}
                      monthly={result.monthly.taxableIncome}
                      weekly={result.weekly.taxableIncome}
                    />
                    <TableRow
                      label="Federal Tax"
                      yearly={-result.yearly.federalTax}
                      monthly={-result.monthly.federalTax}
                      weekly={-result.weekly.federalTax}
                      negative
                    />
                    <TableRow
                      label="Social Security"
                      yearly={-result.yearly.socialSecurity}
                      monthly={-result.monthly.socialSecurity}
                      weekly={-result.weekly.socialSecurity}
                      negative
                    />
                    <TableRow
                      label="Medicare"
                      yearly={-result.yearly.medicare}
                      monthly={-result.monthly.medicare}
                      weekly={-result.weekly.medicare}
                      negative
                    />
                    <TableRow
                      label="Total Deductions"
                      yearly={-result.yearly.totalDeductions}
                      monthly={-result.monthly.totalDeductions}
                      weekly={-result.weekly.totalDeductions}
                      negative
                      bold
                    />
                    <TableRow
                      label="Take Home Pay"
                      yearly={result.yearly.takeHomePay}
                      monthly={result.monthly.takeHomePay}
                      weekly={result.weekly.takeHomePay}
                      highlight
                      bold
                    />
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <InArticleAd />

        {/* Related Salaries */}
        {relatedSalaries.length > 0 && (
          <section className="py-12 bg-muted/30 border-t border-border/40">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-xl font-bold text-foreground mb-6">
                  Compare Similar Salaries
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {relatedSalaries.map((s) => {
                    const r = calculateSalary({
                      grossSalary: s,
                      filingStatus: 'single',
                      state: 'TX',
                    })
                    return (
                      <Link
                        key={s}
                        href={`/salary/${s}`}
                        className="rounded-2xl bg-card/60 dark:bg-card/40 p-4 ring-1 ring-border/50 hover:ring-accent/50 transition-all"
                      >
                        <div className="text-sm font-semibold text-foreground">
                          {formatCurrency(s, 0)}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Take home: {formatCurrency(r.yearly.takeHomePay, 0)}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SEO Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto prose prose-sm">
              <h2 className="text-xl font-bold text-foreground mb-4">
                Understanding Your {formattedSalary} Salary
              </h2>
              <div className="text-sm text-muted-foreground space-y-4 leading-relaxed">
                <p>
                  A {formattedSalary} salary in the US for the {TAX_YEAR} tax year will result in a take-home
                  pay of approximately {formatCurrency(result.yearly.takeHomePay)} per year, or {formatCurrency(result.monthly.takeHomePay)} per month
                  (assuming single filer in a state with no income tax). This calculation includes{' '}
                  <Link href="/tax-brackets" className="text-accent hover:underline">Federal Income Tax</Link> and{' '}
                  <Link href="/fica-taxes" className="text-accent hover:underline">FICA taxes</Link> (Social Security and Medicare).
                </p>
                <p>
                  Your effective tax rate is {result.yearly.effectiveTaxRate.toFixed(1)}%, meaning for every $1 you earn,
                  you keep approximately ${((1 - result.yearly.effectiveTaxRate / 100)).toFixed(2)}.
                  Your marginal tax rate (the rate on your next $1 earned) is {result.yearly.marginalTaxRate}%.
                </p>
                <p>
                  This calculation assumes single filing status and uses the standard deduction of ${currentTaxConfig.standardDeduction.single.toLocaleString()}.
                  State taxes vary significantly - use the calculator above to see results for your specific state.
                </p>
              </div>
            </div>
          </div>
        </section>

        <FooterAd />
      </main>
    </SidebarLayout>
  )
}

function SummaryCard({
  label,
  value,
  subtext,
  highlight = false
}: {
  label: string
  value: string
  subtext: string
  highlight?: boolean
}) {
  return (
    <div className={`rounded-2xl p-4 text-center ring-1 ${highlight ? 'bg-blue-50 dark:bg-blue-950/30 ring-blue-200 dark:ring-blue-800' : 'bg-card/60 dark:bg-card/40 ring-border/50'}`}>
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className={`text-xl font-bold ${highlight ? 'text-blue-600 dark:text-blue-400' : 'text-foreground'}`}>{value}</div>
      <div className="text-xs text-muted-foreground">{subtext}</div>
    </div>
  )
}

function TableRow({
  label,
  yearly,
  monthly,
  weekly,
  negative = false,
  highlight = false,
  bold = false,
  muted = false
}: {
  label: string
  yearly: number
  monthly: number
  weekly: number
  negative?: boolean
  highlight?: boolean
  bold?: boolean
  muted?: boolean
}) {
  const textClass = negative ? 'text-destructive' : highlight ? 'text-accent' : muted ? 'text-muted-foreground' : 'text-foreground'
  const fontClass = bold ? 'font-semibold' : ''

  return (
    <tr className={highlight ? 'bg-accent/5' : ''}>
      <td className={`px-4 py-3 text-sm ${fontClass} text-foreground`}>{label}</td>
      <td className={`px-4 py-3 text-sm text-right ${textClass} ${fontClass}`}>{formatCurrency(yearly)}</td>
      <td className={`px-4 py-3 text-sm text-right ${textClass} ${fontClass}`}>{formatCurrency(monthly)}</td>
      <td className={`px-4 py-3 text-sm text-right ${textClass} ${fontClass} hidden sm:table-cell`}>{formatCurrency(weekly)}</td>
    </tr>
  )
}
