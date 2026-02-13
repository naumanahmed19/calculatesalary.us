import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { SidebarLayout } from '@/components/sidebar-layout'
import { EmployerCostCalculator } from '@/components/employer-cost-calculator'
import {
  calculateEmployerCost,
  calculateSalary,
  formatCurrency,
  parseSalaryFromSlug,
  TAX_YEAR,
  COMMON_SALARIES,
} from '@/lib/us-tax-calculator'
import { currentTaxConfig } from '@/lib/us-tax-config'
import { HeaderAd, MobileHeaderAd, InContentAd, InArticleAd, FooterAd } from '@/components/ad-unit'
import { RelatedCalculators, salaryCalculators } from '@/components/related-calculators'

const BASE_URL = 'https://calculatesalary.us'

interface PageProps {
  params: Promise<{ amount: string }>
}

// Generate static params for common salaries
export const revalidate = false

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

  const result = calculateEmployerCost({
    grossSalary: salary,
    employer401kMatch: 0,
    state: 'TX',
  })

  const formattedSalary = formatCurrency(salary, 0)
  const formattedTotal = formatCurrency(result.totalCost, 0)

  return {
    title: `${formattedSalary} Salary - US Employer Cost Calculator ${TAX_YEAR}`,
    description: `How much does it cost to employ someone on ${formattedSalary} in the US? Total employer cost is ${formattedTotal} including FICA taxes (7.65%), FUTA, and state unemployment. Calculate for ${TAX_YEAR}.`,
    keywords: [
      `${formattedSalary} employer cost`,
      `cost to employ ${formattedSalary}`,
      'employer payroll taxes',
      'us employer cost calculator',
      'total employment cost',
      TAX_YEAR,
    ],
    openGraph: {
      title: `${formattedSalary} Salary - US Employer Cost ${TAX_YEAR}`,
      description: `Total cost to employ someone on ${formattedSalary}: ${formattedTotal} including employer FICA and unemployment taxes.`,
      type: 'website',
      locale: 'en_US',
    },
    alternates: {
      canonical: `${BASE_URL}/employer-cost/${salary}`,
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
        item: BASE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Employer Cost Calculator',
        item: `${BASE_URL}/employer-cost`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${formattedSalary} Employer Cost`,
        item: `${BASE_URL}/employer-cost/${salary}`,
      },
    ],
  }
}

export default async function EmployerCostAmountPage({ params }: PageProps) {
  const { amount } = await params
  const salary = parseSalaryFromSlug(amount)

  if (!salary || salary <= 0 || salary > 10000000) {
    notFound()
  }

  const employerResult = calculateEmployerCost({
    grossSalary: salary,
    employer401kMatch: 0,
    state: 'TX',
  })

  const employeeResult = calculateSalary({
    grossSalary: salary,
    filingStatus: 'single',
    state: 'TX',
  })

  const formattedSalary = formatCurrency(salary, 0)
  const overhead = ((employerResult.totalCost - salary) / salary) * 100

  // Get related salaries (nearby values)
  const relatedSalaries = COMMON_SALARIES.filter(
    (s) => Math.abs(s - salary) <= 20000 && s !== salary
  ).slice(0, 8)

  const breadcrumbSchema = generateBreadcrumbSchema(salary, formattedSalary)

  return (
    <SidebarLayout>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main id="main-content" className="flex-1">
        {/* Top Ad Placement */}
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
              <Link href="/employer-cost" className="hover:text-foreground transition-colors">
                Employer Cost
              </Link>
            </li>
            <li className="inline-flex items-center">/</li>
            <li className="inline-flex items-center text-foreground font-medium">
              {formattedSalary}
            </li>
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
                {formattedSalary} Salary - US Employer Cost
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                To employ someone on a{' '}
                <strong className="text-foreground">{formattedSalary}</strong> salary in the US,
                the total cost to the employer is{' '}
                <strong className="text-foreground">
                  {formatCurrency(employerResult.totalCost, 0)}
                </strong>{' '}
                per year. That&apos;s{' '}
                <strong className="text-foreground">+{overhead.toFixed(1)}%</strong> on top of
                the gross salary.
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
                subtext="employee pay"
              />
              <SummaryCard
                label="Total Employer Cost"
                value={formatCurrency(employerResult.totalCost, 0)}
                subtext="per year"
                highlight
              />
              <SummaryCard
                label="Employer FICA"
                value={formatCurrency(employerResult.employerSocialSecurity + employerResult.employerMedicare, 0)}
                subtext="7.65% rate"
              />
              <SummaryCard
                label="Unemployment"
                value={formatCurrency(employerResult.employerFUTA + employerResult.employerSUTA, 0)}
                subtext="FUTA + SUTA"
              />
            </div>
          </div>
        </section>

        {/* Ad after Summary Cards */}
        <InContentAd />

        {/* Detailed Cost Breakdown */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-8">
                {formattedSalary} Employment Cost Breakdown
              </h2>

              <div className="rounded-2xl bg-card/60 dark:bg-card/40 overflow-hidden ring-1 ring-border/50">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                        Description
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                        Yearly
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                        Monthly
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-foreground hidden sm:table-cell">
                        Daily
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr>
                      <td className="px-4 py-3 text-sm text-foreground">Gross Salary</td>
                      <td className="px-4 py-3 text-sm text-right text-foreground">
                        {formatCurrency(salary)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-foreground">
                        {formatCurrency(salary / 12)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-foreground hidden sm:table-cell">
                        {formatCurrency(salary / 260)}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        Social Security ({(currentTaxConfig.socialSecurity.rate * 100).toFixed(1)}%)
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-destructive">
                        +{formatCurrency(employerResult.employerSocialSecurity)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-destructive">
                        +{formatCurrency(employerResult.employerSocialSecurity / 12)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-destructive hidden sm:table-cell">
                        +{formatCurrency(employerResult.employerSocialSecurity / 260)}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        Medicare ({(currentTaxConfig.medicare.rate * 100).toFixed(2)}%)
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-destructive">
                        +{formatCurrency(employerResult.employerMedicare)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-destructive">
                        +{formatCurrency(employerResult.employerMedicare / 12)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-destructive hidden sm:table-cell">
                        +{formatCurrency(employerResult.employerMedicare / 260)}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        FUTA (0.6%)
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-destructive">
                        +{formatCurrency(employerResult.employerFUTA)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-destructive">
                        +{formatCurrency(employerResult.employerFUTA / 12)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-destructive hidden sm:table-cell">
                        +{formatCurrency(employerResult.employerFUTA / 260)}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        SUTA (est. 2.7%)
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-destructive">
                        +{formatCurrency(employerResult.employerSUTA)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-destructive">
                        +{formatCurrency(employerResult.employerSUTA / 12)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right text-destructive hidden sm:table-cell">
                        +{formatCurrency(employerResult.employerSUTA / 260)}
                      </td>
                    </tr>
                    <tr className="bg-accent/5">
                      <td className="px-4 py-3 text-sm font-semibold text-foreground">
                        Total Employer Cost
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-bold text-accent">
                        {formatCurrency(employerResult.totalCost)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-bold text-accent">
                        {formatCurrency(employerResult.costPerMonth)}
                      </td>
                      <td className="px-4 py-3 text-sm text-right font-bold text-accent hidden sm:table-cell">
                        {formatCurrency(employerResult.costPerDay)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Employee vs Employer Comparison */}
        <section className="py-12 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-8">
                Employer Cost vs Employee Take Home
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    What the Employer Pays
                  </h3>
                  <div className="text-3xl font-bold text-foreground mb-2">
                    {formatCurrency(employerResult.totalCost, 0)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">total cost per year</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gross Salary</span>
                      <span className="text-foreground">{formatCurrency(salary, 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Employer FICA</span>
                      <span className="text-foreground">
                        {formatCurrency(employerResult.employerSocialSecurity + employerResult.employerMedicare, 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Unemployment Taxes</span>
                      <span className="text-foreground">
                        {formatCurrency(employerResult.employerFUTA + employerResult.employerSUTA, 0)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 p-6 ring-1 ring-emerald-200 dark:ring-emerald-800">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    What the Employee Gets
                  </h3>
                  <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                    {formatCurrency(employeeResult.yearly.takeHomePay, 0)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">take home pay per year</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Gross Salary</span>
                      <span className="text-foreground">{formatCurrency(salary, 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Federal Tax</span>
                      <span className="text-destructive">
                        -{formatCurrency(employeeResult.yearly.federalTax, 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Employee FICA</span>
                      <span className="text-destructive">
                        -{formatCurrency(employeeResult.yearly.socialSecurity + employeeResult.yearly.medicare, 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-background/50 p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  The employer pays{' '}
                  <strong className="text-foreground">
                    {formatCurrency(employerResult.totalCost - employeeResult.yearly.takeHomePay, 0)}
                  </strong>{' '}
                  more than what the employee takes home (
                  {(
                    ((employerResult.totalCost - employeeResult.yearly.takeHomePay) /
                      employeeResult.yearly.takeHomePay) *
                    100
                  ).toFixed(0)}
                  % difference)
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Ad after comparison */}
        <InArticleAd />

        {/* Calculator Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-xl font-semibold text-foreground mb-6 text-center">
              Adjust 401(k) Match and State
            </h2>
            <EmployerCostCalculator initialSalary={salary} />
          </div>
        </section>

        {/* Related Salaries */}
        {relatedSalaries.length > 0 && (
          <section className="py-12 bg-muted/30 border-t border-border/40">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-xl font-bold text-foreground mb-6">
                  Compare Employer Costs
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {relatedSalaries.map((s) => {
                    const r = calculateEmployerCost({
                      grossSalary: s,
                      employer401kMatch: 0,
                      state: 'TX',
                    })
                    return (
                      <Link
                        key={s}
                        href={`/employer-cost/${s}`}
                        className="rounded-2xl bg-card/60 dark:bg-card/40 p-4 ring-1 ring-border/50 hover:ring-accent/50 transition-all"
                      >
                        <div className="text-sm font-semibold text-foreground">
                          {formatCurrency(s, 0)}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Cost: {formatCurrency(r.totalCost, 0)}
                        </div>
                      </Link>
                    )
                  })}
                </div>

                <div className="mt-6 text-center">
                  <Link href="/employer-cost" className="text-sm text-accent hover:underline">
                    Use the full employer cost calculator
                  </Link>
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
                Understanding {formattedSalary} Employer Costs
              </h2>
              <div className="text-sm text-muted-foreground space-y-4 leading-relaxed">
                <p>
                  When hiring an employee on a {formattedSalary} salary in the US for {TAX_YEAR},
                  the total cost to the employer is {formatCurrency(employerResult.totalCost, 0)}.
                  This includes the gross salary plus employer payroll taxes including FICA
                  and unemployment insurance.
                </p>
                <p>
                  Employer FICA taxes include Social Security at{' '}
                  {(currentTaxConfig.socialSecurity.rate * 100).toFixed(1)}% (up to the wage base of{' '}
                  ${currentTaxConfig.socialSecurity.wageBase.toLocaleString()}) and Medicare at{' '}
                  {(currentTaxConfig.medicare.rate * 100).toFixed(2)}%.
                  For a {formattedSalary} salary, employer FICA amounts to{' '}
                  {formatCurrency(employerResult.employerSocialSecurity + employerResult.employerMedicare, 0)} per year.
                </p>
                <p>
                  Unemployment taxes include FUTA (Federal Unemployment Tax Act) and SUTA
                  (State Unemployment Tax Act). FUTA is effectively 0.6% on the first $7,000
                  of wages. SUTA rates vary by state and employer experience.
                </p>
                <p>
                  Compare this to the employee&apos;s perspective:{' '}
                  <Link href={`/salary/${salary}`} className="text-accent hover:underline">
                    see the {formattedSalary} take-home pay calculation
                  </Link>
                  .
                </p>
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

function SummaryCard({
  label,
  value,
  subtext,
  highlight = false,
}: {
  label: string
  value: string
  subtext: string
  highlight?: boolean
}) {
  return (
    <div
      className={`rounded-2xl p-4 text-center ring-1 ${
        highlight
          ? 'bg-emerald-50 dark:bg-emerald-950/30 ring-emerald-200 dark:ring-emerald-800'
          : 'bg-card/60 dark:bg-card/40 ring-border/50'
      }`}
    >
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div
        className={`text-xl font-bold ${
          highlight ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground'
        }`}
      >
        {value}
      </div>
      <div className="text-xs text-muted-foreground">{subtext}</div>
    </div>
  )
}
