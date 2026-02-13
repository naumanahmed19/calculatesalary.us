import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { SidebarLayout } from '@/components/sidebar-layout'
import { HourlyRateCalculator } from '@/components/hourly-rate-calculator'
import { calculateSalary, formatCurrency, TAX_YEAR } from '@/lib/us-tax-calculator'
import { HeaderAd, MobileHeaderAd, InContentAd, InArticleAd, FooterAd } from '@/components/ad-unit'
import { RelatedCalculators, salaryCalculators } from '@/components/related-calculators'
import { AlertTriangle, Briefcase, CheckCircle, Lightbulb, ShoppingCart, TrendingUp } from 'lucide-react'

const BASE_URL = 'https://calculatesalary.us'

// US wage benchmarks
const US_FEDERAL_MINIMUM_WAGE = 7.25
const US_MEDIAN_HOURLY = 22.00
const US_LIVING_WAGE_SINGLE = 17.00 // Approximate living wage for single adult
const US_POVERTY_WAGE = 15.00 // ~$31k/year poverty line for family of 4

// Common hourly rates to pre-generate
const COMMON_HOURLY_RATES = [
  7.25, 10, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 32, 35, 40, 45, 50, 60, 75, 100
]

interface PageProps {
  params: Promise<{ rate: string }>
}

function parseHourlyRate(rateStr: string): number | null {
  const rate = parseFloat(rateStr)
  if (isNaN(rate) || rate <= 0 || rate > 1000) {
    return null
  }
  return rate
}

function hourlyToAnnual(hourlyRate: number, hoursPerWeek: number = 40): number {
  return hourlyRate * hoursPerWeek * 52
}

function formatRate(rate: number): string {
  return rate % 1 === 0 ? `$${rate}` : `$${rate.toFixed(2)}`
}

// Get rate-specific insights for US
function getRateInsights(rate: number, annual: number): {
  title: string
  description: string
  tips: string[]
  icon: 'warning' | 'info' | 'success'
  category: string
} {
  if (rate <= US_FEDERAL_MINIMUM_WAGE) {
    return {
      title: 'Federal Minimum Wage Level',
      description: `$${rate.toFixed(2)}/hour is at or below the federal minimum wage of $${US_FEDERAL_MINIMUM_WAGE}. Many states have higher minimums - check your state's rate.`,
      tips: [
        'Many states have higher minimums ($15+ in CA, NY, WA)',
        'Check eligibility for SNAP and other assistance',
        'Earned Income Tax Credit (EITC) can provide significant refund',
        'Medicaid may be available depending on your state'
      ],
      icon: 'warning',
      category: 'Minimum wage'
    }
  } else if (rate < US_LIVING_WAGE_SINGLE) {
    return {
      title: 'Below Living Wage',
      description: `$${rate.toFixed(2)}/hour is above federal minimum but below the estimated living wage (~$17/hr for single adult). Budgeting is important at this level.`,
      tips: [
        'EITC can provide substantial tax refund',
        'ACA marketplace may offer subsidized health insurance',
        'Consider state/local assistance programs',
        'Building skills for higher-paying roles is valuable'
      ],
      icon: 'warning',
      category: 'Below living wage'
    }
  } else if (rate < US_MEDIAN_HOURLY) {
    return {
      title: 'Approaching Median Wage',
      description: `$${rate.toFixed(2)}/hour is below the US median hourly wage (~$22/hr). This provides basic stability in most areas outside major metros.`,
      tips: [
        'Employer 401(k) match is free money - contribute enough to get it',
        'HSA contributions are triple tax-advantaged if available',
        'Build emergency fund of 3-6 months expenses',
        'Consider Roth IRA while in lower tax brackets'
      ],
      icon: 'info',
      category: 'Below median'
    }
  } else if (rate <= 30) {
    return {
      title: 'Above Median Earnings',
      description: `$${rate.toFixed(2)}/hour is above the US median. This provides comfortable living in most regions and good savings potential.`,
      tips: [
        'Maximize 401(k) contributions ($23,000 limit for 2024)',
        'Roth IRA contributions while still eligible',
        'Review insurance coverage (life, disability)',
        'Consider taxable brokerage account after maxing retirement'
      ],
      icon: 'success',
      category: 'Above median'
    }
  } else if (rate <= 50) {
    return {
      title: 'High Earner',
      description: `$${rate.toFixed(2)}/hour (${formatCurrency(annual, 0)}/year) represents strong earning power. You're likely in the 22-24% federal tax bracket.`,
      tips: [
        'Max out 401(k) to reduce taxable income',
        'Backdoor Roth IRA if income exceeds limits',
        'Consider tax-loss harvesting in taxable accounts',
        'Review estate planning basics'
      ],
      icon: 'success',
      category: 'High earner'
    }
  } else {
    return {
      title: 'Senior Professional Rate',
      description: `$${rate.toFixed(2)}/hour represents senior professional, specialist, or consultant rates. Tax optimization becomes increasingly important.`,
      tips: [
        'Consider mega backdoor Roth if employer plan allows',
        'Review quarterly estimated tax payments',
        'Charitable giving strategies (donor-advised funds)',
        'Professional tax advice typically pays for itself'
      ],
      icon: 'success',
      category: 'Senior/specialist'
    }
  }
}

// Get typical jobs for this rate (US context)
function getTypicalJobs(rate: number): string[] {
  if (rate < 12) {
    return ['Fast food worker', 'Retail cashier', 'Farm worker', 'Entry-level service']
  } else if (rate < 18) {
    return ['Warehouse worker', 'CNA', 'Customer service rep', 'Office clerk']
  } else if (rate < 25) {
    return ['Skilled trades apprentice', 'Bank teller', 'Dental assistant', 'Paralegal']
  } else if (rate < 35) {
    return ['Registered nurse', 'Electrician', 'Junior developer', 'Accountant']
  } else if (rate < 50) {
    return ['Software engineer', 'Physical therapist', 'Senior accountant', 'Project manager']
  } else {
    return ['Senior engineer', 'Consultant', 'Attorney', 'Medical specialist']
  }
}

// Get what this rate affords (US context)
function getAffordabilityContext(monthlyTakeHome: number): { item: string; affordable: boolean; note: string }[] {
  return [
    { item: 'Average US rent (1-bed)', affordable: monthlyTakeHome >= 1800, note: '~$1,300-1,600/month nationally' },
    { item: 'NYC/SF rent (1-bed)', affordable: monthlyTakeHome >= 4000, note: '~$3,000-4,000/month' },
    { item: 'Car payment + insurance', affordable: monthlyTakeHome >= 1200, note: '~$500-700/month total' },
    { item: 'Saving 15% for retirement', affordable: monthlyTakeHome >= 1500, note: `~${formatCurrency(monthlyTakeHome * 0.15)}/month` },
    { item: 'Family with children', affordable: monthlyTakeHome >= 4000, note: 'Childcare adds $1,000-2,500/month' },
  ]
}

export const revalidate = false

export async function generateStaticParams() {
  return COMMON_HOURLY_RATES.map((rate) => ({
    rate: rate.toString(),
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { rate: rateStr } = await params
  const rate = parseHourlyRate(rateStr)

  if (!rate) {
    return { title: 'Hourly Rate Not Found' }
  }

  const annual = hourlyToAnnual(rate)
  const result = calculateSalary({ grossSalary: annual, filingStatus: 'single', state: 'TX' })

  const rateDisplay = formatRate(rate)
  const title = `${rateDisplay} Per Hour Salary US ${TAX_YEAR} - Annual & Monthly After Tax`
  const description = `${rateDisplay} per hour equals ${formatCurrency(annual, 0)} annual salary in the US. After tax you'll take home ${formatCurrency(result.monthly.takeHomePay)} per month (${formatCurrency(result.yearly.takeHomePay, 0)} per year). ${TAX_YEAR} tax calculator.`

  return {
    title,
    description,
    keywords: [
      `${rate} per hour annual salary`,
      `${rate} per hour monthly salary after tax`,
      `${rate} dollar an hour salary`,
      `${rate} hourly to yearly`,
      `what is ${rate} an hour annually`,
    ],
    openGraph: { title, description, type: 'website', locale: 'en_US' },
    alternates: { canonical: `${BASE_URL}/hourly/${rate}` },
  }
}

function generateBreadcrumbSchema(rate: number) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Hourly Rate Calculator', item: `${BASE_URL}/hourly` },
      { '@type': 'ListItem', position: 3, name: `${formatRate(rate)}/hour`, item: `${BASE_URL}/hourly/${rate}` },
    ],
  }
}

function generateFAQSchema(rate: number, annual: number, result: ReturnType<typeof calculateSalary>) {
  const rateDisplay = formatRate(rate)
  const vsMedian = rate >= US_MEDIAN_HOURLY ? 'above' : 'below'

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is ${rateDisplay} per hour as an annual salary?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${rateDisplay} per hour working 40 hours per week equals ${formatCurrency(annual, 0)} per year before tax. This is based on 52 weeks of full-time work.`,
        },
      },
      {
        '@type': 'Question',
        name: `How much is ${rateDisplay} per hour after tax?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `On ${rateDisplay} per hour (${formatCurrency(annual, 0)} annual), your take-home pay after federal taxes and FICA is approximately ${formatCurrency(result.monthly.takeHomePay)} per month or ${formatCurrency(result.yearly.takeHomePay, 0)} per year. State taxes vary - this example uses Texas (no state income tax).`,
        },
      },
      {
        '@type': 'Question',
        name: `Is ${rateDisplay} per hour a good wage?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${rateDisplay}/hour is ${vsMedian} the US median hourly wage of ~$22/hour. ${rate >= US_FEDERAL_MINIMUM_WAGE ? `It's above the federal minimum wage of $${US_FEDERAL_MINIMUM_WAGE}.` : ''} Your take-home of ${formatCurrency(result.monthly.takeHomePay)}/month ${result.monthly.takeHomePay >= 3500 ? 'provides comfortable living in most US regions' : result.monthly.takeHomePay >= 2500 ? 'covers essentials in most areas' : 'may require careful budgeting'}.`,
        },
      },
      {
        '@type': 'Question',
        name: `What jobs pay ${rateDisplay} per hour?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Jobs typically paying around ${rateDisplay}/hour include: ${getTypicalJobs(rate).join(', ')}. Actual pay varies by location, experience, and employer.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the monthly salary for ${rateDisplay} per hour?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `At ${rateDisplay} per hour (40 hours/week), your monthly gross salary is ${formatCurrency(annual / 12)}. After federal taxes and FICA, your monthly take-home pay is approximately ${formatCurrency(result.monthly.takeHomePay)} (varies by state).`,
        },
      },
    ],
  }
}

export default async function HourlyRatePage({ params }: PageProps) {
  const { rate: rateStr } = await params
  const rate = parseHourlyRate(rateStr)

  if (!rate) {
    notFound()
  }

  const annual = hourlyToAnnual(rate)
  const result = calculateSalary({ grossSalary: annual, filingStatus: 'single', state: 'TX' })

  const rateDisplay = formatRate(rate)
  const breadcrumbSchema = generateBreadcrumbSchema(rate)
  const faqSchema = generateFAQSchema(rate, annual, result)
  const insights = getRateInsights(rate, annual)
  const typicalJobs = getTypicalJobs(rate)
  const affordability = getAffordabilityContext(result.monthly.takeHomePay)

  const vsMinWage = ((rate / US_FEDERAL_MINIMUM_WAGE) * 100 - 100).toFixed(0)
  const vsMedian = ((rate / US_MEDIAN_HOURLY) * 100 - 100).toFixed(0)

  const relatedRates = COMMON_HOURLY_RATES.filter((r) => Math.abs(r - rate) <= 10 && r !== rate).slice(0, 8)
  const hoursVariations = [20, 30, 35, 40, 45]

  return (
    <SidebarLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <main id="main-content" className="flex-1">
        <HeaderAd />
        <MobileHeaderAd />

        <nav className="container mx-auto px-4 py-4" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-muted-foreground">
            <li><Link href="/" className="hover:text-foreground transition-colors">Calculator</Link></li>
            <li>/</li>
            <li><Link href="/hourly" className="hover:text-foreground transition-colors">Hourly Rates</Link></li>
            <li>/</li>
            <li className="text-foreground font-medium">{rateDisplay}/hour</li>
          </ol>
        </nav>

        <section className="py-8 md:py-12 border-b border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <span className="inline-flex items-center rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent mb-4">{TAX_YEAR} Tax Year</span>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">{rateDisplay} Per Hour - US Salary After Tax</h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                If you earn <strong className="text-foreground">{rateDisplay} per hour</strong> working 40 hours per week,
                your annual salary is <strong className="text-foreground">{formatCurrency(annual, 0)}</strong>.
                After tax, you&apos;ll take home approximately <strong className="text-foreground">{formatCurrency(result.monthly.takeHomePay)}</strong> per month.
              </p>
            </div>
          </div>
        </section>

        <section className="py-8 bg-muted/30 border-b border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
              <SummaryCard label="Hourly Rate" value={rateDisplay} subtext="per hour" />
              <SummaryCard label="Annual Salary" value={formatCurrency(annual, 0)} subtext="gross per year" />
              <SummaryCard label="Monthly Take-Home" value={formatCurrency(result.monthly.takeHomePay)} subtext="after tax" highlight />
              <SummaryCard label="Yearly Take-Home" value={formatCurrency(result.yearly.takeHomePay, 0)} subtext="after tax" highlight />
            </div>
          </div>
        </section>

        {/* Rate-Specific Insights */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className={`rounded-2xl p-6 ring-1 ${insights.icon === 'warning' ? 'bg-amber-500/10 ring-amber-500/20' : insights.icon === 'success' ? 'bg-emerald-500/10 ring-emerald-500/20' : 'bg-blue-500/10 ring-blue-500/20'}`}>
                <div className="flex items-start gap-4">
                  <div className={`rounded-full p-2 ${insights.icon === 'warning' ? 'bg-amber-500/20' : insights.icon === 'success' ? 'bg-emerald-500/20' : 'bg-blue-500/20'}`}>
                    {insights.icon === 'warning' ? <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" /> :
                     insights.icon === 'success' ? <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> :
                     <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold mb-2 ${insights.icon === 'warning' ? 'text-amber-700 dark:text-amber-400' : insights.icon === 'success' ? 'text-emerald-700 dark:text-emerald-400' : 'text-blue-700 dark:text-blue-400'}`}>{insights.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{insights.description}</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {insights.tips.map((tip, i) => (<li key={i} className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" />{tip}</li>))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Wage Comparison */}
        <section className="py-8 border-b border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="rounded-xl bg-accent/10 p-2"><TrendingUp className="h-5 w-5 text-accent" /></div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">How {rateDisplay}/Hour Compares</h2>
                  <p className="text-sm text-muted-foreground">US wage benchmarks for {TAX_YEAR}</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-xl bg-card/60 p-4 ring-1 ring-border/50">
                  <div className="text-sm text-muted-foreground">vs Federal Min</div>
                  <div className={`text-xl font-bold ${parseFloat(vsMinWage) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{parseFloat(vsMinWage) >= 0 ? '+' : ''}{vsMinWage}%</div>
                  <div className="text-xs text-muted-foreground">${US_FEDERAL_MINIMUM_WAGE}/hr federal</div>
                </div>
                <div className="rounded-xl bg-card/60 p-4 ring-1 ring-border/50">
                  <div className="text-sm text-muted-foreground">vs Living Wage</div>
                  <div className={`text-xl font-bold ${rate >= US_LIVING_WAGE_SINGLE ? 'text-emerald-600' : 'text-amber-600'}`}>{rate >= US_LIVING_WAGE_SINGLE ? '+' : ''}{((rate / US_LIVING_WAGE_SINGLE) * 100 - 100).toFixed(0)}%</div>
                  <div className="text-xs text-muted-foreground">~${US_LIVING_WAGE_SINGLE}/hr living wage</div>
                </div>
                <div className="rounded-xl bg-card/60 p-4 ring-1 ring-border/50">
                  <div className="text-sm text-muted-foreground">vs US Median</div>
                  <div className={`text-xl font-bold ${parseFloat(vsMedian) >= 0 ? 'text-emerald-600' : 'text-amber-600'}`}>{parseFloat(vsMedian) >= 0 ? '+' : ''}{vsMedian}%</div>
                  <div className="text-xs text-muted-foreground">~${US_MEDIAN_HOURLY}/hr median</div>
                </div>
                <div className="rounded-xl bg-card/60 p-4 ring-1 ring-border/50">
                  <div className="text-sm text-muted-foreground">Annual Salary</div>
                  <div className="text-xl font-bold text-foreground">{formatCurrency(annual, 0)}</div>
                  <div className="text-xs text-muted-foreground">at 40 hrs/week</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <InContentAd />

        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-xl font-semibold text-foreground mb-6 text-center">Customize Your Hours and State</h2>
            <HourlyRateCalculator initialRate={rate} initialHours={40} />
          </div>
        </section>

        {/* What This Rate Affords */}
        <section className="py-12 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="rounded-xl bg-accent/10 p-2"><ShoppingCart className="h-5 w-5 text-accent" /></div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">What {formatCurrency(result.monthly.takeHomePay)}/Month Affords</h2>
                  <p className="text-sm text-muted-foreground">Affordability based on your take-home pay</p>
                </div>
              </div>
              <div className="space-y-3">
                {affordability.map((item, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl bg-card/60 p-4 ring-1 ring-border/50">
                    <div className="flex items-center gap-3">
                      {item.affordable ? <CheckCircle className="w-5 h-5 text-emerald-600" /> : <AlertTriangle className="w-5 h-5 text-amber-600" />}
                      <div>
                        <div className="font-medium text-foreground">{item.item}</div>
                        <div className="text-sm text-muted-foreground">{item.note}</div>
                      </div>
                    </div>
                    <div className={`text-sm font-semibold ${item.affordable ? 'text-emerald-600' : 'text-amber-600'}`}>{item.affordable ? 'Affordable' : 'Challenging'}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Typical Jobs */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="rounded-xl bg-accent/10 p-2"><Briefcase className="h-5 w-5 text-accent" /></div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Jobs Around {rateDisplay}/Hour</h2>
                  <p className="text-sm text-muted-foreground">Typical roles at this pay level</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {typicalJobs.map((job, i) => (<div key={i} className="rounded-xl bg-card/60 p-4 ring-1 ring-border/50 text-center"><div className="font-medium text-foreground">{job}</div></div>))}
              </div>
            </div>
          </div>
        </section>

        <InArticleAd />

        {/* Detailed Breakdown */}
        <section className="py-12 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-8">{rateDisplay}/Hour Salary Breakdown</h2>
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
                    <tr><td className="px-4 py-3 text-sm text-foreground">Gross Salary</td><td className="px-4 py-3 text-sm text-right text-foreground">{formatCurrency(annual, 0)}</td><td className="px-4 py-3 text-sm text-right text-foreground">{formatCurrency(annual / 12)}</td><td className="px-4 py-3 text-sm text-right text-foreground hidden sm:table-cell">{formatCurrency(annual / 52)}</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-muted-foreground">Standard Deduction</td><td className="px-4 py-3 text-sm text-right text-muted-foreground">{formatCurrency(result.yearly.standardDeduction, 0)}</td><td className="px-4 py-3 text-sm text-right text-muted-foreground">{formatCurrency(result.monthly.standardDeduction)}</td><td className="px-4 py-3 text-sm text-right text-muted-foreground hidden sm:table-cell">{formatCurrency(result.weekly.standardDeduction)}</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-foreground">Federal Tax</td><td className="px-4 py-3 text-sm text-right text-destructive">-{formatCurrency(result.yearly.federalTax, 0)}</td><td className="px-4 py-3 text-sm text-right text-destructive">-{formatCurrency(result.monthly.federalTax)}</td><td className="px-4 py-3 text-sm text-right text-destructive hidden sm:table-cell">-{formatCurrency(result.weekly.federalTax)}</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-foreground">Social Security</td><td className="px-4 py-3 text-sm text-right text-destructive">-{formatCurrency(result.yearly.socialSecurity, 0)}</td><td className="px-4 py-3 text-sm text-right text-destructive">-{formatCurrency(result.monthly.socialSecurity)}</td><td className="px-4 py-3 text-sm text-right text-destructive hidden sm:table-cell">-{formatCurrency(result.weekly.socialSecurity)}</td></tr>
                    <tr><td className="px-4 py-3 text-sm text-foreground">Medicare</td><td className="px-4 py-3 text-sm text-right text-destructive">-{formatCurrency(result.yearly.medicare, 0)}</td><td className="px-4 py-3 text-sm text-right text-destructive">-{formatCurrency(result.monthly.medicare)}</td><td className="px-4 py-3 text-sm text-right text-destructive hidden sm:table-cell">-{formatCurrency(result.weekly.medicare)}</td></tr>
                    <tr className="bg-accent/5 font-bold"><td className="px-4 py-3 text-sm text-foreground">Take Home Pay</td><td className="px-4 py-3 text-sm text-right text-accent">{formatCurrency(result.yearly.takeHomePay, 0)}</td><td className="px-4 py-3 text-sm text-right text-accent">{formatCurrency(result.monthly.takeHomePay)}</td><td className="px-4 py-3 text-sm text-right text-accent hidden sm:table-cell">{formatCurrency(result.weekly.takeHomePay)}</td></tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground mt-4">* Based on 40 hours/week, single filer in Texas (no state tax). Tax rates for {TAX_YEAR}.</p>
            </div>
          </div>
        </section>

        {/* Hours Comparison */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-4">{rateDisplay}/Hour at Different Hours Per Week</h2>
              <p className="text-muted-foreground mb-8">See how your take-home pay changes based on hours worked</p>
              <div className="rounded-2xl bg-card/60 dark:bg-card/40 overflow-hidden ring-1 ring-border/50">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Hours/Week</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Annual Salary</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Monthly Net</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-foreground hidden sm:table-cell">Yearly Net</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {hoursVariations.map((hours) => {
                      const annualForHours = hourlyToAnnual(rate, hours)
                      const resultForHours = calculateSalary({ grossSalary: annualForHours, filingStatus: 'single', state: 'TX' })
                      const isStandard = hours === 40
                      return (
                        <tr key={hours} className={isStandard ? 'bg-accent/5' : ''}>
                          <td className="px-4 py-3 text-sm font-medium text-foreground">{hours} hours {isStandard && <span className="text-accent text-xs">(full-time)</span>}</td>
                          <td className="px-4 py-3 text-sm text-right text-muted-foreground">{formatCurrency(annualForHours, 0)}</td>
                          <td className="px-4 py-3 text-sm text-right font-semibold text-accent">{formatCurrency(resultForHours.monthly.takeHomePay)}</td>
                          <td className="px-4 py-3 text-sm text-right text-muted-foreground hidden sm:table-cell">{formatCurrency(resultForHours.yearly.takeHomePay, 0)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Related Rates */}
        {relatedRates.length > 0 && (
          <section className="py-12 bg-muted/30 border-t border-border/40">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-xl font-bold text-foreground mb-6">Compare Similar Hourly Rates</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {relatedRates.map((r) => {
                    const annualR = hourlyToAnnual(r)
                    const resultR = calculateSalary({ grossSalary: annualR, filingStatus: 'single', state: 'TX' })
                    return (
                      <Link key={r} href={`/hourly/${r}`} className="rounded-2xl bg-card/60 dark:bg-card/40 p-4 ring-1 ring-border/50 hover:ring-accent/50 transition-all">
                        <div className="text-lg font-bold text-foreground">{formatRate(r)}/hr</div>
                        <div className="text-xs text-muted-foreground mt-1">{formatCurrency(annualR, 0)}/yr</div>
                        <div className="text-sm text-accent mt-1">{formatCurrency(resultR.monthly.takeHomePay)}/mo</div>
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
              <h2 className="text-xl font-bold text-foreground mb-4">Understanding {rateDisplay} Per Hour Salary</h2>
              <div className="text-sm text-muted-foreground space-y-4 leading-relaxed">
                <p>
                  Earning {rateDisplay} per hour in the US translates to an annual salary of {formatCurrency(annual, 0)} when
                  working full-time (40 hours per week, 52 weeks per year). After federal income tax and FICA taxes
                  for the {TAX_YEAR} tax year, your take-home pay is approximately {formatCurrency(result.yearly.takeHomePay, 0)} per year
                  or {formatCurrency(result.monthly.takeHomePay)} per month.
                </p>
                <p>
                  This hourly rate is {rate >= US_MEDIAN_HOURLY ? 'above' : 'below'} the US median hourly wage of approximately ${US_MEDIAN_HOURLY}/hour.
                  Your effective tax rate at this income level is {result.yearly.effectiveTaxRate.toFixed(1)}%.
                  State taxes vary significantly - this example uses Texas which has no state income tax.
                </p>
                <p>
                  If you work part-time or different hours, use the calculator above to see your personalized take-home pay.
                  You can also select your state to see how state taxes affect your net income.
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

function SummaryCard({ label, value, subtext, highlight = false }: { label: string; value: string; subtext: string; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl p-4 text-center ring-1 ${highlight ? 'bg-emerald-50 dark:bg-emerald-950/30 ring-emerald-200 dark:ring-emerald-800' : 'bg-card/60 dark:bg-card/40 ring-border/50'}`}>
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className={`text-xl font-bold ${highlight ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground'}`}>{value}</div>
      <div className="text-xs text-muted-foreground">{subtext}</div>
    </div>
  )
}
