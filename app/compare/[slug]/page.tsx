
import { FooterAd, HeaderAd, InContentAd, MobileHeaderAd } from '@/components/ad-unit'
import { RelatedCalculators, salaryCalculators } from '@/components/related-calculators'
import { ComparisonSalary, SalaryComparisonCalculator } from '@/components/salary-comparison-calculator'
import { SidebarLayout } from '@/components/sidebar-layout'
import { calculateSalary, formatCurrency, TAX_YEAR } from '@/lib/us-tax-calculator'
import { ArrowRight, Banknote, Briefcase, Calculator, CheckCircle, CreditCard, DollarSign, GraduationCap, Home, Lightbulb, PiggyBank, TrendingUp } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

const BASE_URL = 'https://calculatesalary.us'

interface PageProps {
  params: Promise<{ slug: string }>
}

// 2024 US Federal Tax Brackets (Single Filer)
const FEDERAL_BRACKETS = [
  { name: '10% Bracket', min: 0, max: 11600, rate: 10 },
  { name: '12% Bracket', min: 11601, max: 47150, rate: 12 },
  { name: '22% Bracket', min: 47151, max: 100525, rate: 22 },
  { name: '24% Bracket', min: 100526, max: 191950, rate: 24 },
  { name: '32% Bracket', min: 191951, max: 243725, rate: 32 },
  { name: '35% Bracket', min: 243726, max: 609350, rate: 35 },
  { name: '37% Bracket', min: 609351, max: Infinity, rate: 37 },
]

// Get the federal tax bracket a salary primarily falls into
function getFederalBracket(salary: number): { name: string; rate: number } {
  // Account for standard deduction ($14,600 for 2024)
  const taxableIncome = Math.max(0, salary - 14600)

  for (const bracket of FEDERAL_BRACKETS) {
    if (taxableIncome <= bracket.max) {
      return { name: bracket.name, rate: bracket.rate }
    }
  }
  return { name: '37% Bracket', rate: 37 }
}

// Get salary-range specific insights for US
function getSalaryInsights(s1: number, s2: number): {
  title: string
  description: string
  tips: string[]
  category: 'entry' | 'mid' | 'senior' | 'executive'
} {
  const avgSalary = (s1 + s2) / 2

  if (avgSalary <= 45000) {
    return {
      title: 'Entry-Level Career Move',
      description: `This comparison is typical for early career positions or first major raises. At this income level, you're in the 12% federal bracket after the standard deduction, meaning you keep most of your raise.`,
      tips: [
        'You keep ~75-80% of any raise at this level (after federal tax + FICA)',
        'Maximize any employer 401(k) match - it\'s free money',
        'Consider Roth IRA contributions while in a lower tax bracket',
        'Health insurance and other benefits can be worth $5-10k+ annually'
      ],
      category: 'entry'
    }
  } else if (avgSalary <= 75000) {
    return {
      title: 'Mid-Career Growth Phase',
      description: `This salary range represents solid mid-career positions. You're likely in the 12-22% federal bracket. State taxes vary significantly - from 0% (TX, FL) to 13%+ (CA).`,
      tips: [
        'Traditional 401(k) contributions reduce taxable income (up to $23,000/year)',
        'Consider your state\'s tax situation when comparing job offers',
        'HSA contributions are triple tax-advantaged if eligible',
        'This is a great time to build emergency savings and invest'
      ],
      category: 'mid'
    }
  } else if (avgSalary <= 120000) {
    return {
      title: '22% Federal Bracket Territory',
      description: `One or both salaries are in the 22% federal bracket. Above ~$47k taxable income, each additional dollar is taxed at 22% federal plus FICA (7.65%) plus any state tax.`,
      tips: [
        'Max out 401(k) to reduce taxable income ($23,000 limit for 2024)',
        'Backdoor Roth IRA is available at any income level',
        'Consider tax-loss harvesting in taxable investment accounts',
        'Equity compensation (RSUs, options) may offer better tax treatment'
      ],
      category: 'senior'
    }
  } else {
    return {
      title: '24%+ Federal Bracket Planning',
      description: `At this income level, you're in the 24% federal bracket or higher. Strategic tax planning becomes increasingly valuable as marginal rates climb.`,
      tips: [
        'Mega backdoor Roth (after-tax 401k) can shelter more income if available',
        'Consider charitable giving strategies (donor-advised funds)',
        'Review RSU vesting timing and Section 83(b) elections for options',
        'A fee-only financial advisor often pays for themselves at this level'
      ],
      category: 'executive'
    }
  }
}

// Calculate what the extra money could buy (US context)
function getSpendingContext(monthlyDiff: number): { item: string; description: string }[] {
  const items = []

  if (monthlyDiff >= 100) {
    items.push({ item: 'Streaming & Subscriptions', description: `Netflix, Spotify, gym membership - ${formatCurrency(Math.min(monthlyDiff, 150))}/mo` })
  }
  if (monthlyDiff >= 300) {
    items.push({ item: 'Car Payment', description: `Could cover a reliable used car or lease payment` })
  }
  if (monthlyDiff >= 500) {
    items.push({ item: 'Investment Growth', description: `${formatCurrency(monthlyDiff * 12)}/year invested could grow to ${formatCurrency(monthlyDiff * 12 * 10 * 1.07)} in 10 years` })
  }
  if (monthlyDiff >= 800) {
    items.push({ item: 'Rent Upgrade', description: `Could afford a better apartment or neighborhood` })
  }
  if (monthlyDiff >= 1200) {
    items.push({ item: 'Mortgage Capacity', description: `~${formatCurrency(monthlyDiff * 200)} extra home buying power` })
  }
  if (monthlyDiff >= 2000) {
    items.push({ item: 'Private School / Daycare', description: `Could cover childcare or private education costs` })
  }

  return items.slice(0, 4)
}

export const revalidate = false

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

  // Calculate results for static display (SEO text) - using Texas (no state tax) as baseline
  const r1 = calculateSalary({ grossSalary: s1, filingStatus: 'single', state: 'TX' })
  const r2 = calculateSalary({ grossSalary: s2, filingStatus: 'single', state: 'TX' })

  const diffYearly = r2.yearly.takeHomePay - r1.yearly.takeHomePay
  const diffMonthly = r2.monthly.takeHomePay - r1.monthly.takeHomePay
  const grossDiff = s2 - s1

  // Calculate marginal rate - how much of the raise you actually keep
  const marginalKeepRate = (diffYearly / grossDiff) * 100
  const marginalTaxRate = 100 - marginalKeepRate

  // Get federal tax brackets for each salary
  const bracket1 = getFederalBracket(s1)
  const bracket2 = getFederalBracket(s2)
  const crossesBracket = bracket1.name !== bracket2.name

  // Get insights based on salary range
  const insights = getSalaryInsights(s1, s2)

  // Get spending context
  const spendingItems = getSpendingContext(diffMonthly)

  const initialComparison: ComparisonSalary[] = [
    { id: '1', label: f1, salary: s1, filingStatus: 'single', state: 'TX' },
    { id: '2', label: f2, salary: s2, filingStatus: 'single', state: 'TX' },
  ]

  // Generate related comparisons
  const relatedComparisons = [
    { s1: s1 - 10000, s2: s1 },
    { s1: s2, s2: s2 + 10000 },
    { s1: s1, s2: s2 + 10000 },
    { s1: Math.round(s1 * 0.9), s2: Math.round(s2 * 0.9) },
    { s1: Math.round(s1 * 1.1), s2: Math.round(s2 * 1.1) },
  ].filter(c => c.s1 >= 20000 && c.s2 <= 300000 && c.s1 < c.s2)
   .slice(0, 4)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is the take-home pay difference between ${f1} and ${f2}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The difference in gross salary is ${formatCurrency(grossDiff, 0)}. After federal tax, FICA taxes, and state tax (varies by state), the actual take-home difference is ${formatCurrency(diffYearly, 0)} per year (${formatCurrency(diffMonthly)} per month) in a no-income-tax state. You keep ${marginalKeepRate.toFixed(0)}% of the raise.`
        }
      },
      {
        '@type': 'Question',
        name: `Is a ${formatCurrency(grossDiff, 0)} salary increase worth it?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `A ${formatCurrency(grossDiff, 0)} raise from ${f1} to ${f2} puts ${formatCurrency(diffMonthly)} extra in your pocket each month (before state tax). Over 5 years, that's ${formatCurrency(diffYearly * 5, 0)} extra take-home pay. Consider this against any changes in commute, stress, or work-life balance.`
        }
      },
      {
        '@type': 'Question',
        name: `What federal tax bracket is ${f2} in?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `A ${f2} salary puts you in the ${bracket2.name} (${bracket2.rate}% marginal rate) for single filers after the standard deduction. ${crossesBracket ? `Note: ${f1} is in the ${bracket1.name}, so this raise crosses a tax bracket.` : `Both salaries are in the same federal tax bracket.`}`
        }
      },
      {
        '@type': 'Question',
        name: `How much of a ${formatCurrency(grossDiff, 0)} raise do I actually keep?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Of a ${formatCurrency(grossDiff, 0)} raise from ${f1} to ${f2}, you keep ${formatCurrency(diffYearly, 0)} (${marginalKeepRate.toFixed(0)}%) in a no-state-tax state. Federal tax and FICA take ${marginalTaxRate.toFixed(0)}%. In high-tax states like California or New York, you may keep 5-10% less.`
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
              <Link href="/compare" className="hover:text-foreground">Comparison</Link>
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

        {/* Quick Summary Cards */}
        <section className="pb-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-xl bg-card/60 p-4 text-center ring-1 ring-border/50">
                <div className="text-xs text-muted-foreground mb-1">Gross Difference</div>
                <div className="text-lg font-bold text-foreground">+{formatCurrency(grossDiff, 0)}</div>
                <div className="text-xs text-muted-foreground">per year</div>
              </div>
              <div className="rounded-xl bg-emerald-500/10 p-4 text-center ring-1 ring-emerald-500/20">
                <div className="text-xs text-muted-foreground mb-1">Take Home Extra</div>
                <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">+{formatCurrency(diffMonthly)}</div>
                <div className="text-xs text-muted-foreground">per month</div>
              </div>
              <div className="rounded-xl bg-card/60 p-4 text-center ring-1 ring-border/50">
                <div className="text-xs text-muted-foreground mb-1">You Keep</div>
                <div className="text-lg font-bold text-foreground">{marginalKeepRate.toFixed(0)}%</div>
                <div className="text-xs text-muted-foreground">of the raise</div>
              </div>
              <div className="rounded-xl bg-accent/10 p-4 text-center ring-1 ring-accent/20">
                <div className="text-xs text-muted-foreground mb-1">5-Year Gain</div>
                <div className="text-lg font-bold text-accent">+{formatCurrency(diffYearly * 5, 0)}</div>
                <div className="text-xs text-muted-foreground">cumulative</div>
              </div>
            </div>
          </div>
        </section>

        {/* Salary-Specific Insights */}
        <section className="pb-8">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className={`rounded-2xl p-6 ring-1 ${
                insights.category === 'entry' ? 'bg-emerald-500/10 ring-emerald-500/20' :
                insights.category === 'mid' ? 'bg-blue-500/10 ring-blue-500/20' :
                insights.category === 'senior' ? 'bg-amber-500/10 ring-amber-500/20' :
                'bg-purple-500/10 ring-purple-500/20'
              }`}>
                <div className="flex items-start gap-4">
                  <div className={`rounded-full p-2 ${
                    insights.category === 'entry' ? 'bg-emerald-500/20' :
                    insights.category === 'mid' ? 'bg-blue-500/20' :
                    insights.category === 'senior' ? 'bg-amber-500/20' :
                    'bg-purple-500/20'
                  }`}>
                    {insights.category === 'entry' ? <GraduationCap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> :
                     insights.category === 'mid' ? <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" /> :
                     insights.category === 'senior' ? <TrendingUp className="w-5 h-5 text-amber-600 dark:text-amber-400" /> :
                     <DollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold mb-2 ${
                      insights.category === 'entry' ? 'text-emerald-700 dark:text-emerald-400' :
                      insights.category === 'mid' ? 'text-blue-700 dark:text-blue-400' :
                      insights.category === 'senior' ? 'text-amber-700 dark:text-amber-400' :
                      'text-purple-700 dark:text-purple-400'
                    }`}>
                      {insights.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {insights.description}
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {insights.tips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8">
          <div className="container mx-auto px-4">
            <SalaryComparisonCalculator initialSalaries={initialComparison} />
          </div>
        </section>

        <InContentAd />

        {/* Federal Tax Bracket Breakdown */}
        <section className="py-12 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="rounded-xl bg-accent/10 p-2">
                  <Calculator className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Federal Tax Breakdown</h2>
                  <p className="text-sm text-muted-foreground">Understanding where your money goes (single filer, no state tax)</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Salary 1 Breakdown */}
                <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                  <h3 className="text-lg font-bold mb-4 text-accent">{f1}</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-sm text-muted-foreground">Federal Bracket</span>
                      <span className="font-semibold">{bracket1.name}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-sm text-muted-foreground">Marginal Rate</span>
                      <span className="font-semibold">{bracket1.rate}%</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-sm text-muted-foreground">Federal Tax</span>
                      <span className="font-medium text-rose-600 dark:text-rose-400">{formatCurrency(r1.yearly.federalTax)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-sm text-muted-foreground">FICA (SS + Medicare)</span>
                      <span className="font-medium text-rose-600 dark:text-rose-400">{formatCurrency(r1.yearly.socialSecurity + r1.yearly.medicare)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm font-semibold text-foreground">Take Home (Monthly)</span>
                      <span className="font-bold text-lg text-emerald-600 dark:text-emerald-400">{formatCurrency(r1.monthly.takeHomePay)}</span>
                    </div>
                  </div>
                </div>

                {/* Salary 2 Breakdown */}
                <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                  <h3 className="text-lg font-bold mb-4 text-emerald-600 dark:text-emerald-400">{f2}</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-sm text-muted-foreground">Federal Bracket</span>
                      <span className="font-semibold">{bracket2.name}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-sm text-muted-foreground">Marginal Rate</span>
                      <span className="font-semibold">{bracket2.rate}%</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-sm text-muted-foreground">Federal Tax</span>
                      <span className="font-medium text-rose-600 dark:text-rose-400">{formatCurrency(r2.yearly.federalTax)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-sm text-muted-foreground">FICA (SS + Medicare)</span>
                      <span className="font-medium text-rose-600 dark:text-rose-400">{formatCurrency(r2.yearly.socialSecurity + r2.yearly.medicare)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm font-semibold text-foreground">Take Home (Monthly)</span>
                      <span className="font-bold text-lg text-emerald-600 dark:text-emerald-400">{formatCurrency(r2.monthly.takeHomePay)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {crossesBracket && (
                <div className="mt-6 rounded-xl bg-amber-500/10 p-4 ring-1 ring-amber-500/20">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-amber-700 dark:text-amber-400">Tax Bracket Change:</strong> This salary increase crosses from the {bracket1.name} into the {bracket2.name}.
                      Only the income above the threshold is taxed at the higher rate - you won&apos;t lose money by earning more.
                    </p>
                  </div>
                </div>
              )}

              <div className="mt-6 rounded-xl bg-blue-500/10 p-4 ring-1 ring-blue-500/20">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-blue-700 dark:text-blue-400">State Tax Varies:</strong> These calculations use Texas (0% state tax).
                    In California, you&apos;d pay an additional ~6-9% state tax. In New York, add ~5-8%.
                    Florida, Texas, Washington, and Nevada have no state income tax.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What Can You Do With the Extra Money */}
        {spendingItems.length > 0 && (
          <section className="py-12 border-b border-border/40">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-3 mb-6">
                  <div className="rounded-xl bg-accent/10 p-2">
                    <Banknote className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">What {formatCurrency(diffMonthly)} Extra Buys You</h2>
                    <p className="text-sm text-muted-foreground">Real-world value of the take-home difference</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {spendingItems.map((item, index) => (
                    <div key={index} className="rounded-xl bg-card/60 p-4 ring-1 ring-border/50 flex items-start gap-3">
                      {index === 0 && <CreditCard className="w-5 h-5 text-accent shrink-0 mt-0.5" />}
                      {index === 1 && <Home className="w-5 h-5 text-accent shrink-0 mt-0.5" />}
                      {index === 2 && <PiggyBank className="w-5 h-5 text-accent shrink-0 mt-0.5" />}
                      {index === 3 && <TrendingUp className="w-5 h-5 text-accent shrink-0 mt-0.5" />}
                      <div>
                        <div className="font-semibold text-foreground">{item.item}</div>
                        <div className="text-sm text-muted-foreground">{item.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Detailed Breakdown */}
        <section className="py-12 bg-muted/30 border-b border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto prose dark:prose-invert">
              <h2 className="text-2xl font-bold text-center mb-8">Full Comparison: {f1} vs {f2}</h2>

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

        {/* Related Comparisons */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl font-bold text-foreground mb-6 text-center">
                Related Salary Comparisons
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {relatedComparisons.map((comp, index) => (
                  <Link
                    key={index}
                    href={`/compare/${comp.s1}-vs-${comp.s2}`}
                    className="rounded-xl bg-card/60 p-4 text-center ring-1 ring-border/50 hover:ring-accent/50 transition-all"
                  >
                    <div className="flex items-center justify-center gap-1 text-sm font-medium text-foreground">
                      {formatCurrency(comp.s1, 0)}
                      <ArrowRight className="w-3 h-3 text-muted-foreground" />
                      {formatCurrency(comp.s2, 0)}
                    </div>
                  </Link>
                ))}
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
