
import { FooterAd, HeaderAd, InContentAd, MobileHeaderAd } from '@/components/ad-unit'
import { RelatedCalculators, salaryCalculators } from '@/components/related-calculators'
import { ComparisonSalary, SalaryComparisonCalculator } from '@/components/salary-comparison-calculator'
import { SidebarLayout } from '@/components/sidebar-layout'
import { calculateSalary, formatCurrency, TAX_YEAR } from '@/lib/us-tax-calculator'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

const BASE_URL = 'https://calculatesalary.us'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const params: { slug: string }[] = []

  // Generate comparisons for common salaries
  // Compare X with X+5k and X+10k
  for (let salary = 30000; salary <= 150000; salary += 10000) {
    // Compare with +10k
    params.push({ slug: `${salary}-vs-${salary + 10000}` })

    // Compare with +20k
    if (salary + 20000 <= 200000) {
      params.push({ slug: `${salary}-vs-${salary + 20000}` })
    }
  }

  // Add specific high volume queries
  const commonComparisons = [
    '30000-vs-35000',
    '35000-vs-40000',
    '40000-vs-45000',
    '40000-vs-50000',
    '45000-vs-50000',
    '50000-vs-55000',
    '50000-vs-60000',
    '60000-vs-70000',
    '70000-vs-80000',
    '75000-vs-100000',
    '80000-vs-90000',
    '90000-vs-100000',
    '100000-vs-120000',
    '100000-vs-150000'
  ]

  commonComparisons.forEach(slug => params.push({ slug }))

  // Deduplicate
  return Array.from(new Set(params.map(p => p.slug))).map(slug => ({ slug }))
}

function parseSalariesFromSlug(slug: string): { s1: number; s2: number; needsRedirect: boolean; canonicalSlug: string } | null {
  const match = slug.match(/^(\d+)-vs-(\d+)$/)
  if (!match) return null

  const rawS1 = parseInt(match[1])
  const rawS2 = parseInt(match[2])

  if (isNaN(rawS1) || isNaN(rawS2)) return null
  // Basic validation to prevent abuse/weird numbers
  if (rawS1 < 1000 || rawS1 > 10000000 || rawS2 < 1000 || rawS2 > 10000000) return null

  // Normalize: always put lower value first
  const s1 = Math.min(rawS1, rawS2)
  const s2 = Math.max(rawS1, rawS2)
  const canonicalSlug = `${s1}-vs-${s2}`
  const needsRedirect = slug !== canonicalSlug

  return { s1, s2, needsRedirect, canonicalSlug }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const parsed = parseSalariesFromSlug(slug)

  if (!parsed) {
    return {
      title: 'Salary Comparison Not Found',
    }
  }

  const { s1, s2, canonicalSlug } = parsed
  const f1 = formatCurrency(s1, 0)
  const f2 = formatCurrency(s2, 0)

  // Don't index extreme salary comparisons
  const isExtreme = s1 < 10000 || s2 > 1000000

  return {
    title: `${f1} vs ${f2} - Take Home Pay Comparison US ${TAX_YEAR}`,
    description: `Compare a ${f1} salary against ${f2} in the US. See the exact difference in take-home pay, federal tax, state tax, and FICA for the ${TAX_YEAR} tax year.`,
    keywords: [`${s1} vs ${s2} salary`, `${f1} vs ${f2} us`, 'salary comparison', 'take home pay difference', TAX_YEAR],
    openGraph: {
      title: `${f1} vs ${f2} - US Salary Comparison`,
      description: `See the take-home pay difference between ${f1} and ${f2}. Detailed tax breakdown for ${TAX_YEAR}.`,
      type: 'article',
    },
    alternates: {
      canonical: `${BASE_URL}/compare/${canonicalSlug}`,
    },
    ...(isExtreme && { robots: { index: false, follow: true } }),
  }
}

export default async function ComparisonPage({ params }: PageProps) {
  const { slug } = await params
  const parsed = parseSalariesFromSlug(slug)

  if (!parsed) {
    notFound()
  }

  // Redirect to canonical URL if values are in wrong order
  if (parsed.needsRedirect) {
    redirect(`/compare/${parsed.canonicalSlug}`)
  }

  const { s1, s2 } = parsed
  const f1 = formatCurrency(s1, 0)
  const f2 = formatCurrency(s2, 0)

  // Calculate results for static display (SEO text)
  const r1 = calculateSalary({ grossSalary: s1, filingStatus: 'single', state: 'TX' })
  const r2 = calculateSalary({ grossSalary: s2, filingStatus: 'single', state: 'TX' })

  const diffYearly = r2.yearly.takeHomePay - r1.yearly.takeHomePay
  const diffMonthly = r2.monthly.takeHomePay - r1.monthly.takeHomePay

  const initialComparison: ComparisonSalary[] = [
    { id: '1', label: f1, salary: s1, filingStatus: 'single', state: 'TX' },
    { id: '2', label: f2, salary: s2, filingStatus: 'single', state: 'TX' },
  ]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is the difference between ${f1} and ${f2}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The difference in gross salary is ${formatCurrency(Math.abs(s2 - s1), 0)}. After federal tax, state tax, and FICA taxes, the difference in take-home pay is approximately ${formatCurrency(Math.abs(diffYearly), 0)} per year, or ${formatCurrency(Math.abs(diffMonthly), 0)} per month.`
        }
      },
      {
        '@type': 'Question',
        name: `Is a salary increase from ${f1} to ${f2} worth it?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Going from ${f1} to ${f2} means an extra ${formatCurrency(Math.abs(diffMonthly))} in your pocket every month. You should weigh this against any changes in commute, benefits, or work-life balance.`
        }
      }
    ]
  }

  return (
    <SidebarLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="flex-1">
        <HeaderAd />
        <MobileHeaderAd />

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <nav className="flex items-center text-sm text-muted-foreground mb-6">
              <Link href="/" className="hover:text-foreground">Home</Link>
              <span className="mx-2">/</span>
              <Link href="/salary-comparison" className="hover:text-foreground">Comparison</Link>
              <span className="mx-2">/</span>
              <span className="text-foreground font-medium">{f1} vs {f2}</span>
            </nav>

            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-flex items-center rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent mb-6">
                Updated for {TAX_YEAR}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground text-balance mb-6">
                {f1} vs {f2} Salary Comparison
              </h1>
              <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
                Compare a <strong>{f1}</strong> salary against <strong>{f2}</strong>.
                Find out exactly how much more (or less) you will take home after tax.
              </p>
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="container mx-auto px-4">
            <SalaryComparisonCalculator initialSalaries={initialComparison} />
          </div>
        </section>

        <InContentAd />

        <section className="py-12 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto prose dark:prose-invert">
              <h2 className="text-2xl font-bold text-center mb-8">Detailed Breakdown: {f1} vs {f2}</h2>

              <div className="grid md:grid-cols-2 gap-8 not-prose">
                <div className="bg-card p-6 rounded-2xl ring-1 ring-border/50">
                  <h3 className="text-xl font-bold mb-4 text-accent">{f1}</h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Gross Pay</span>
                      <span className="font-semibold">{formatCurrency(r1.yearly.grossIncome)}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Federal Tax</span>
                      <span className="text-destructive">-{formatCurrency(r1.yearly.federalTax)}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">FICA Taxes</span>
                      <span className="text-destructive">-{formatCurrency(r1.yearly.socialSecurity + r1.yearly.medicare)}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Take Home (Year)</span>
                      <span className="font-bold">{formatCurrency(r1.yearly.takeHomePay)}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Take Home (Month)</span>
                      <span className="font-bold">{formatCurrency(r1.monthly.takeHomePay)}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Effective Tax Rate</span>
                      <span>{r1.yearly.effectiveTaxRate.toFixed(1)}%</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-card p-6 rounded-2xl ring-1 ring-border/50">
                  <h3 className="text-xl font-bold mb-4 text-emerald-600 dark:text-emerald-400">{f2}</h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Gross Pay</span>
                      <span className="font-semibold">{formatCurrency(r2.yearly.grossIncome)}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Federal Tax</span>
                      <span className="text-destructive">-{formatCurrency(r2.yearly.federalTax)}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">FICA Taxes</span>
                      <span className="text-destructive">-{formatCurrency(r2.yearly.socialSecurity + r2.yearly.medicare)}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Take Home (Year)</span>
                      <span className="font-bold">{formatCurrency(r2.yearly.takeHomePay)}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Take Home (Month)</span>
                      <span className="font-bold">{formatCurrency(r2.monthly.takeHomePay)}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Effective Tax Rate</span>
                      <span>{r2.yearly.effectiveTaxRate.toFixed(1)}%</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-12 text-center">
                 <p className="text-lg">
                   The difference in take-home pay is <strong className="text-emerald-600 dark:text-emerald-400">{formatCurrency(Math.abs(diffYearly), 0)} per year</strong>,
                   which works out to <strong className="text-emerald-600 dark:text-emerald-400">{formatCurrency(Math.abs(diffMonthly))} per month</strong>.
                 </p>
                 <p className="text-sm text-muted-foreground mt-4">
                   * Based on single filing status in Texas (no state income tax). Results vary by state and filing status.
                 </p>
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
