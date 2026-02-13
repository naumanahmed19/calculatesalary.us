import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SidebarLayout } from '@/components/sidebar-layout'
import { calculateSalary, formatCurrency, TAX_YEAR } from '@/lib/us-tax-calculator'
import { HeaderAd, MobileHeaderAd, InContentAd, InArticleAd, FooterAd } from '@/components/ad-unit'
import { ArrowUpDown, Wallet, Calculator } from 'lucide-react'
import { RelatedCalculators, salaryCalculators } from '@/components/related-calculators'

const BASE_URL = 'https://calculatesalary.us'

// Common monthly net targets for static generation
const COMMON_NET_AMOUNTS = [
  2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000, 6500,
  7000, 7500, 8000, 9000, 10000, 12000, 15000
]

interface PageProps {
  params: Promise<{ amount: string }>
}

export const revalidate = false

export async function generateStaticParams() {
  return COMMON_NET_AMOUNTS.map((amount) => ({
    amount: amount.toString(),
  }))
}

// Binary search to find gross salary that produces target net
function findGrossForNet(targetNetYearly: number, maxIterations = 100): number {
  let low = targetNetYearly
  let high = targetNetYearly * 2

  while (calculateSalary({
    grossSalary: high,
    filingStatus: 'single',
    state: 'TX',
  }).yearly.takeHomePay < targetNetYearly && high < 2000000) {
    high *= 1.5
  }

  for (let i = 0; i < maxIterations; i++) {
    const mid = (low + high) / 2
    const result = calculateSalary({
      grossSalary: mid,
      filingStatus: 'single',
      state: 'TX',
    })

    const diff = result.yearly.takeHomePay - targetNetYearly

    if (Math.abs(diff) < 1) {
      return Math.round(mid)
    }

    if (diff > 0) {
      high = mid
    } else {
      low = mid
    }
  }

  return Math.round((low + high) / 2)
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { amount } = await params
  const monthlyNet = parseInt(amount)

  if (isNaN(monthlyNet) || monthlyNet <= 0 || monthlyNet > 100000) {
    return { title: 'Amount Not Found' }
  }

  const yearlyNet = monthlyNet * 12
  const requiredGross = findGrossForNet(yearlyNet)
  const formattedMonthlyNet = `$${monthlyNet.toLocaleString()}`
  const formattedGross = `$${requiredGross.toLocaleString()}`

  return {
    title: `${formattedMonthlyNet}/Month Take Home - What Gross Salary USA ${TAX_YEAR}`,
    description: `To take home ${formattedMonthlyNet} per month ($${yearlyNet.toLocaleString()}/year), you need a gross salary of approximately ${formattedGross} in the USA. Reverse tax calculator for ${TAX_YEAR}.`,
    keywords: [
      `gross salary for ${monthlyNet} net`,
      `${monthlyNet} take home pay gross`,
      `what salary for ${monthlyNet} month`,
      'net to gross calculator usa',
      'reverse tax calculator',
      'gross from net salary usa',
      TAX_YEAR,
    ],
    openGraph: {
      title: `${formattedMonthlyNet}/Month Net = ${formattedGross} Gross Salary`,
      description: `To achieve ${formattedMonthlyNet} monthly take-home pay, you need to earn ${formattedGross} gross.`,
      type: 'website',
      locale: 'en_US',
    },
    alternates: {
      canonical: `${BASE_URL}/net-to-gross/${monthlyNet}`,
    },
  }
}

function generateSchemas(monthlyNet: number, requiredGross: number, result: ReturnType<typeof calculateSalary>) {
  const yearlyNet = monthlyNet * 12
  const formattedMonthlyNet = `$${monthlyNet.toLocaleString()}`
  const formattedGross = `$${requiredGross.toLocaleString()}`

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Net to Gross', item: `${BASE_URL}/net-to-gross` },
      { '@type': 'ListItem', position: 3, name: `${formattedMonthlyNet}/month`, item: `${BASE_URL}/net-to-gross/${monthlyNet}` }
    ]
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What gross salary do I need for ${formattedMonthlyNet} take-home pay?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `To take home ${formattedMonthlyNet} per month ($${yearlyNet.toLocaleString()} per year), you need a gross salary of approximately ${formattedGross} in the USA for ${TAX_YEAR}.`
        }
      },
      {
        '@type': 'Question',
        name: `How much tax will I pay on ${formattedGross} to get ${formattedMonthlyNet} net?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `On a ${formattedGross} salary, you'll pay approximately $${Math.round(result.yearly.federalTax).toLocaleString()} in federal tax and $${Math.round(result.yearly.socialSecurity + result.yearly.medicare).toLocaleString()} in FICA taxes, leaving you with ${formattedMonthlyNet} per month take-home.`
        }
      },
      {
        '@type': 'Question',
        name: `Is ${formattedMonthlyNet}/month a good salary in the USA?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `A take-home pay of ${formattedMonthlyNet} per month (requiring ${formattedGross} gross) is ${requiredGross >= 85000 ? 'above average for the USA' : requiredGross >= 56000 ? 'around the US median' : 'below the US median'}. The median US household income is approximately $75,000.`
        }
      }
    ]
  }

  return { breadcrumbSchema, faqSchema }
}

export default async function NetToGrossAmountPage({ params }: PageProps) {
  const { amount } = await params
  const monthlyNet = parseInt(amount)

  if (isNaN(monthlyNet) || monthlyNet <= 0 || monthlyNet > 100000) {
    notFound()
  }

  const yearlyNet = monthlyNet * 12
  const requiredGross = findGrossForNet(yearlyNet)

  const result = calculateSalary({
    grossSalary: requiredGross,
    filingStatus: 'single',
    state: 'TX',
  })

  const formattedMonthlyNet = formatCurrency(monthlyNet)
  const formattedGross = formatCurrency(requiredGross, 0)
  const { breadcrumbSchema, faqSchema } = generateSchemas(monthlyNet, requiredGross, result)

  // Related amounts
  const relatedAmounts = COMMON_NET_AMOUNTS
    .filter(a => Math.abs(a - monthlyNet) <= 3000 && a !== monthlyNet)
    .slice(0, 6)

  // Calculate some nearby comparisons
  const comparisons = [
    { net: monthlyNet - 500, label: '-$500' },
    { net: monthlyNet + 500, label: '+$500' },
    { net: monthlyNet + 1000, label: '+$1,000' },
  ].filter(c => c.net > 0 && c.net <= 100000)

  return (
    <SidebarLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="flex-1">
        <HeaderAd />
        <MobileHeaderAd />

        {/* Breadcrumb */}
        <nav className="container mx-auto px-4 py-4" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-foreground transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link href="/net-to-gross" className="hover:text-foreground transition-colors">Net to Gross</Link></li>
            <li>/</li>
            <li className="text-foreground font-medium">{formattedMonthlyNet}</li>
          </ol>
        </nav>

        {/* Hero */}
        <section className="py-8 md:py-12 border-b border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <span className="inline-flex items-center rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent mb-4">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Reverse Tax Calculator {TAX_YEAR}
              </span>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
                {formattedMonthlyNet}/Month Take-Home Pay
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                To take home {formattedMonthlyNet} per month, you need to earn{' '}
                <strong className="text-foreground">{formattedGross}</strong> gross salary per year.
                That&apos;s {formatCurrency(requiredGross / 12)} gross per month.
              </p>
            </div>
          </div>
        </section>

        {/* Main Result */}
        <section className="py-8 bg-muted/30 border-b border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Target */}
                <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50 text-center">
                  <div className="text-sm text-muted-foreground mb-2">Your Target Take-Home</div>
                  <div className="text-4xl font-bold text-foreground mb-1">{formattedMonthlyNet}</div>
                  <div className="text-sm text-muted-foreground">per month</div>
                  <div className="mt-3 pt-3 border-t border-border/50 text-sm text-muted-foreground">
                    = {formatCurrency(yearlyNet, 0)} per year
                  </div>
                </div>

                {/* Required Gross */}
                <div className="rounded-2xl bg-accent/5 p-6 ring-1 ring-accent/20 text-center">
                  <div className="text-sm text-muted-foreground mb-2">Required Gross Salary</div>
                  <div className="text-4xl font-bold text-accent mb-1">{formattedGross}</div>
                  <div className="text-sm text-muted-foreground">per year</div>
                  <div className="mt-3 pt-3 border-t border-accent/20 text-sm text-muted-foreground">
                    = {formatCurrency(requiredGross / 12)} per month gross
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <InContentAd />

        {/* Breakdown */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Calculator className="h-6 w-6 text-accent" />
                Tax Breakdown Verification
              </h2>

              <div className="rounded-2xl bg-card/60 dark:bg-card/40 overflow-hidden ring-1 ring-border/50">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Description</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Yearly</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Monthly</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr>
                      <td className="px-4 py-3 text-sm font-medium text-foreground">Gross Salary</td>
                      <td className="px-4 py-3 text-sm text-right text-foreground">{formattedGross}</td>
                      <td className="px-4 py-3 text-sm text-right text-foreground">{formatCurrency(requiredGross / 12)}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-muted-foreground">Standard Deduction</td>
                      <td className="px-4 py-3 text-sm text-right text-muted-foreground">{formatCurrency(result.yearly.standardDeduction, 0)}</td>
                      <td className="px-4 py-3 text-sm text-right text-muted-foreground">{formatCurrency(result.monthly.standardDeduction)}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-foreground">Federal Tax</td>
                      <td className="px-4 py-3 text-sm text-right text-red-600">-{formatCurrency(result.yearly.federalTax, 0)}</td>
                      <td className="px-4 py-3 text-sm text-right text-red-600">-{formatCurrency(result.monthly.federalTax)}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-foreground">Social Security</td>
                      <td className="px-4 py-3 text-sm text-right text-red-600">-{formatCurrency(result.yearly.socialSecurity, 0)}</td>
                      <td className="px-4 py-3 text-sm text-right text-red-600">-{formatCurrency(result.monthly.socialSecurity)}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm text-foreground">Medicare</td>
                      <td className="px-4 py-3 text-sm text-right text-red-600">-{formatCurrency(result.yearly.medicare, 0)}</td>
                      <td className="px-4 py-3 text-sm text-right text-red-600">-{formatCurrency(result.monthly.medicare)}</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 text-sm font-semibold text-foreground">Total Deductions</td>
                      <td className="px-4 py-3 text-sm text-right font-semibold text-red-600">-{formatCurrency(result.yearly.totalDeductions, 0)}</td>
                      <td className="px-4 py-3 text-sm text-right font-semibold text-red-600">-{formatCurrency(result.monthly.totalDeductions)}</td>
                    </tr>
                    <tr className="bg-emerald-50/50 dark:bg-emerald-900/10">
                      <td className="px-4 py-3 text-sm font-bold text-foreground">Take-Home Pay</td>
                      <td className="px-4 py-3 text-sm text-right font-bold text-emerald-600">{formatCurrency(result.yearly.takeHomePay, 0)}</td>
                      <td className="px-4 py-3 text-sm text-right font-bold text-emerald-600">{formatCurrency(result.monthly.takeHomePay)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-4 text-sm text-muted-foreground text-center">
                Effective tax rate: {result.yearly.effectiveTaxRate.toFixed(1)}% | Accuracy: within $1 of target | Based on single filer, no state tax
              </div>
            </div>
          </div>
        </section>

        {/* Comparisons */}
        {comparisons.length > 0 && (
          <section className="py-12 bg-muted/30 border-y border-border/40">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  What If You Wanted More (or Less)?
                </h2>

                <div className="grid gap-4 md:grid-cols-3">
                  {comparisons.map((c) => {
                    const cYearlyNet = c.net * 12
                    const cGross = findGrossForNet(cYearlyNet)
                    const grossDiff = cGross - requiredGross

                    return (
                      <Link
                        key={c.net}
                        href={`/net-to-gross/${c.net}`}
                        className="rounded-2xl bg-card/60 dark:bg-card/40 p-5 ring-1 ring-border/50 hover:ring-accent/50 transition-all"
                      >
                        <div className="text-sm text-muted-foreground mb-1">{c.label}/month net</div>
                        <div className="text-xl font-bold text-foreground mb-2">{formatCurrency(c.net)}/mo</div>
                        <div className="text-sm text-muted-foreground">
                          Needs: {formatCurrency(cGross, 0)} gross
                        </div>
                        <div className={`text-xs mt-2 ${grossDiff >= 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                          {grossDiff >= 0 ? '+' : ''}{formatCurrency(grossDiff, 0)} gross vs your target
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        <InArticleAd />

        {/* Related Amounts */}
        {relatedAmounts.length > 0 && (
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-xl font-bold text-foreground mb-6">
                  Common Take-Home Pay Targets
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {relatedAmounts.map((a) => {
                    const aYearlyNet = a * 12
                    const aGross = findGrossForNet(aYearlyNet)

                    return (
                      <Link
                        key={a}
                        href={`/net-to-gross/${a}`}
                        className="rounded-2xl bg-card/60 dark:bg-card/40 p-4 ring-1 ring-border/50 hover:ring-accent/50 transition-all"
                      >
                        <div className="text-sm font-semibold text-accent">
                          {formatCurrency(a)}/mo net
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Needs {formatCurrency(aGross, 0)} gross
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>
        )}

        <RelatedCalculators calculators={salaryCalculators} />

        <FooterAd />
      </main>
    </SidebarLayout>
  )
}
