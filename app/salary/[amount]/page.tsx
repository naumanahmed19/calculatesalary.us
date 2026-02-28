import { FooterAd, HeaderAd, InArticleAd, InContentAd, MobileHeaderAd } from '@/components/ad-unit'
import { SalaryCalculatorForm } from '@/components/salary-calculator-form'
import { SidebarLayout } from '@/components/sidebar-layout'
import { calculateSalary, COMMON_SALARIES, formatCurrency, generateSalaryPageMeta, parseSalaryFromSlug, TAX_YEAR } from '@/lib/us-tax-calculator'
import { currentTaxConfig } from '@/lib/us-tax-config'
import { AlertTriangle, Briefcase, CheckCircle, Lightbulb, ShoppingCart, TrendingUp } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const BASE_URL = 'https://calculatesalary.us'

// US salary benchmarks
const US_MEDIAN_SALARY = 59000
const US_MEAN_SALARY = 65000
const US_POVERTY_LINE_SINGLE = 15060
const US_22_BRACKET_THRESHOLD = 47150 // After standard deduction

interface PageProps {
  params: Promise<{ amount: string }>
}

// Get salary-specific insights for US
function getSalaryInsights(salary: number): {
  title: string
  description: string
  tips: string[]
  icon: 'warning' | 'info' | 'success'
  category: string
} {
  if (salary < 30000) {
    return {
      title: 'Entry-Level Income',
      description: `${formatCurrency(salary, 0)} is below the US median. You may be eligible for tax credits and assistance programs that can significantly help.`,
      tips: [
        'Earned Income Tax Credit (EITC) can provide large refund',
        'Check eligibility for SNAP and Medicaid',
        'ACA marketplace subsidies may cover most insurance costs',
        'Roth IRA contributions are smart while in low tax bracket'
      ],
      icon: 'info',
      category: 'Entry level'
    }
  } else if (salary < 50000) {
    return {
      title: 'Below US Median',
      description: `${formatCurrency(salary, 0)} is below the US median salary of ~$59,000. You're in the 12% federal tax bracket, keeping most of your earnings.`,
      tips: [
        'You keep ~80% of gross after federal tax + FICA',
        'Contribute enough to 401(k) to get full employer match',
        'Consider Roth IRA - pay taxes now while in low bracket',
        'ACA subsidies may still be available'
      ],
      icon: 'info',
      category: 'Below median'
    }
  } else if (salary < 75000) {
    return {
      title: 'Around US Median',
      description: `${formatCurrency(salary, 0)} is around the US median. You're likely in the 22% federal bracket, providing comfortable living in most areas.`,
      tips: [
        'Traditional 401(k) reduces taxable income',
        'HSA contributions are triple tax-advantaged',
        'Build 3-6 month emergency fund',
        'Consider disability and life insurance'
      ],
      icon: 'success',
      category: 'Around median'
    }
  } else if (salary < 100000) {
    return {
      title: 'Above Average',
      description: `${formatCurrency(salary, 0)} is above the US median. You're in the 22% federal bracket with solid earning power.`,
      tips: [
        'Max 401(k) to reduce taxable income ($23,000 limit)',
        'Backdoor Roth IRA if income exceeds direct limits',
        'Consider tax-efficient investing in taxable accounts',
        'Review beneficiaries and estate basics'
      ],
      icon: 'success',
      category: 'Above average'
    }
  } else if (salary < 200000) {
    return {
      title: '24% Federal Bracket',
      description: `${formatCurrency(salary, 0)} puts you in the 24% federal bracket. Tax optimization strategies become increasingly valuable.`,
      tips: [
        '24% marginal rate means 401(k) contributions save significantly',
        'Mega backdoor Roth if employer plan allows',
        'Consider tax-loss harvesting in taxable accounts',
        'Review RSU/equity compensation tax implications'
      ],
      icon: 'success',
      category: '24% bracket'
    }
  } else {
    return {
      title: 'High Earner',
      description: `${formatCurrency(salary, 0)} puts you in the 32%+ federal bracket. Strategic tax planning can save tens of thousands annually.`,
      tips: [
        'Max all retirement accounts ($23k 401k + $7k IRA)',
        'Consider Qualified Opportunity Zone investments',
        'Donor-advised funds for charitable giving',
        'Professional tax and financial advice recommended'
      ],
      icon: 'success',
      category: 'High earner'
    }
  }
}

// Get typical jobs for this salary (US context)
function getTypicalJobs(salary: number): string[] {
  if (salary < 35000) {
    return ['Retail associate', 'Administrative assistant', 'Customer service', 'Entry-level trades']
  } else if (salary < 55000) {
    return ['Teacher', 'Paralegal', 'Marketing coordinator', 'Junior accountant']
  } else if (salary < 80000) {
    return ['Registered nurse', 'Software developer', 'Accountant', 'Project manager']
  } else if (salary < 120000) {
    return ['Senior developer', 'Physical therapist', 'Financial analyst', 'Engineering manager']
  } else if (salary < 200000) {
    return ['Senior engineer', 'Physician assistant', 'Director', 'Attorney']
  } else {
    return ['VP/Executive', 'Physician', 'Senior partner', 'Tech lead (FAANG)']
  }
}

// Get what this salary affords (US context)
function getAffordabilityContext(salary: number, monthlyTakeHome: number): { item: string; affordable: boolean; note: string }[] {
  const maxMortgage = salary * 4

  return [
    { item: 'Average US rent (1-bed)', affordable: monthlyTakeHome >= 1800, note: '~$1,300-1,600/month nationally' },
    { item: 'NYC/SF rent (1-bed)', affordable: monthlyTakeHome >= 4000, note: '~$3,000-4,000/month in major metros' },
    { item: 'Max mortgage (4x income)', affordable: true, note: `~${formatCurrency(maxMortgage, 0)} borrowing capacity` },
    { item: 'Car + insurance + gas', affordable: monthlyTakeHome >= 1200, note: '~$600-900/month total cost' },
    { item: 'Saving 15% for retirement', affordable: monthlyTakeHome >= 1500, note: `${formatCurrency(monthlyTakeHome * 0.15)}/month to 401(k)/IRA` },
    { item: 'Family with 2 children', affordable: monthlyTakeHome >= 5000, note: 'Childcare adds $1,500-3,000/month' },
  ]
}

export async function generateStaticParams() {
  return COMMON_SALARIES.map((salary) => ({ amount: salary.toString() }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { amount } = await params
  const salary = parseSalaryFromSlug(amount)

  if (!salary || salary <= 0 || salary > 10000000) {
    return { title: 'Salary Not Found' }
  }

  const meta = generateSalaryPageMeta(salary)
  const isExtreme = salary < 10000 || salary > 1000000

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    openGraph: { title: meta.title, description: meta.description, type: 'website', locale: 'en_US' },
    alternates: { canonical: `${BASE_URL}/salary/${salary}` },
    ...(isExtreme && { robots: { index: false, follow: true } }),
  }
}

function generateBreadcrumbSchema(salary: number, formattedSalary: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Salary Calculator', item: BASE_URL },
      { '@type': 'ListItem', position: 3, name: `${formattedSalary} Salary`, item: `${BASE_URL}/salary/${salary}` }
    ]
  }
}

function generateFaqSchema(salary: number, result: ReturnType<typeof calculateSalary>) {
  const vsMedian = salary >= US_MEDIAN_SALARY ? 'above' : 'below'
  const taxBracket = salary > 243725 ? '35%' : salary > 191950 ? '32%' : salary > 100525 ? '24%' : salary > 47150 ? '22%' : '12%'

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is the take home pay on a $${salary.toLocaleString()} salary?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `On a $${salary.toLocaleString()} salary in the US, your take-home pay is approximately $${Math.round(result.yearly.takeHomePay).toLocaleString()} per year, $${Math.round(result.monthly.takeHomePay).toLocaleString()} per month, or $${Math.round(result.weekly.takeHomePay).toLocaleString()} per week after federal tax and FICA. State taxes vary.`,
        },
      },
      {
        '@type': 'Question',
        name: `How much federal tax do I pay on $${salary.toLocaleString()}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `On a $${salary.toLocaleString()} salary (single filer), you pay approximately $${Math.round(result.yearly.federalTax).toLocaleString()} in federal income tax plus $${Math.round(result.yearly.socialSecurity + result.yearly.medicare).toLocaleString()} in FICA taxes per year. Your effective tax rate is ${result.yearly.effectiveTaxRate.toFixed(1)}%.`,
        },
      },
      {
        '@type': 'Question',
        name: `Is $${salary.toLocaleString()} a good salary in the US?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `$${salary.toLocaleString()} is ${vsMedian} the US median salary of ~$59,000. With take-home pay of $${Math.round(result.monthly.takeHomePay).toLocaleString()}/month (before state tax), this ${salary >= 80000 ? 'provides comfortable living in most US regions' : salary >= 50000 ? 'covers essentials in most areas outside major metros' : 'may require budgeting depending on location'}.`,
        },
      },
      {
        '@type': 'Question',
        name: `What federal tax bracket is $${salary.toLocaleString()} in?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `A $${salary.toLocaleString()} salary puts you in the ${taxBracket} federal tax bracket for single filers in ${TAX_YEAR}. Your marginal rate is ${result.yearly.marginalTaxRate}%.`,
        },
      },
      {
        '@type': 'Question',
        name: `What jobs pay $${salary.toLocaleString()} in the US?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Jobs typically paying around $${salary.toLocaleString()} include: ${getTypicalJobs(salary).join(', ')}. Actual salaries vary by location, experience, and employer.`,
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

  const result = calculateSalary({ grossSalary: salary, filingStatus: 'single', state: 'TX' })
  const formattedSalary = formatCurrency(salary, 0)
  const insights = getSalaryInsights(salary)
  const typicalJobs = getTypicalJobs(salary)
  const affordability = getAffordabilityContext(salary, result.monthly.takeHomePay)

  const vsMedian = ((salary / US_MEDIAN_SALARY) * 100 - 100).toFixed(0)
  const vsMean = ((salary / US_MEAN_SALARY) * 100 - 100).toFixed(0)

  const relatedSalaries = COMMON_SALARIES.filter(s => Math.abs(s - salary) <= 25000 && s !== salary).slice(0, 8)

  const breadcrumbSchema = generateBreadcrumbSchema(salary, formattedSalary)
  const faqSchema = generateFaqSchema(salary, result)

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
            <li><Link href="/salaries" className="hover:text-foreground transition-colors">Salaries</Link></li>
            <li>/</li>
            <li className="text-foreground font-medium">{formattedSalary}</li>
          </ol>
        </nav>

        <section className="py-8 md:py-12 border-b border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <span className="inline-flex items-center rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent mb-4">{TAX_YEAR} Tax Year</span>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">{formattedSalary} Salary - US Take Home Pay</h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                If you earn <strong className="text-foreground">{formattedSalary}</strong> per year in the US,
                you will take home approximately <strong className="text-foreground">{formatCurrency(result.yearly.takeHomePay, 0)}</strong> after
                federal tax and FICA. That&apos;s <strong className="text-foreground">{formatCurrency(result.monthly.takeHomePay)}</strong> per month.
              </p>
              <p className="text-sm text-muted-foreground mt-2">(Calculated for single filer in a state with no income tax)</p>
            </div>
          </div>
        </section>

        <section className="py-8 bg-muted/30 border-b border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
              <SummaryCard label="Gross Salary" value={formatCurrency(salary, 0)} subtext="per year" />
              <SummaryCard label="Take Home" value={formatCurrency(result.yearly.takeHomePay, 0)} subtext="per year" highlight />
              <SummaryCard label="Monthly Net" value={formatCurrency(result.monthly.takeHomePay)} subtext="per month" />
              <SummaryCard label="Effective Tax" value={`${result.yearly.effectiveTaxRate.toFixed(1)}%`} subtext="tax rate" />
            </div>
          </div>
        </section>

        {/* Salary-Specific Insights */}
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

        {/* How This Salary Compares */}
        <section className="py-8 border-b border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="rounded-xl bg-accent/10 p-2"><TrendingUp className="h-5 w-5 text-accent" /></div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">How {formattedSalary} Compares</h2>
                  <p className="text-sm text-muted-foreground">US salary benchmarks for {TAX_YEAR}</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-xl bg-card/60 p-4 ring-1 ring-border/50">
                  <div className="text-sm text-muted-foreground">vs US Median</div>
                  <div className={`text-xl font-bold ${parseFloat(vsMedian) >= 0 ? 'text-emerald-600' : 'text-amber-600'}`}>{parseFloat(vsMedian) >= 0 ? '+' : ''}{vsMedian}%</div>
                  <div className="text-xs text-muted-foreground">${US_MEDIAN_SALARY.toLocaleString()} median</div>
                </div>
                <div className="rounded-xl bg-card/60 p-4 ring-1 ring-border/50">
                  <div className="text-sm text-muted-foreground">vs US Mean</div>
                  <div className={`text-xl font-bold ${parseFloat(vsMean) >= 0 ? 'text-emerald-600' : 'text-amber-600'}`}>{parseFloat(vsMean) >= 0 ? '+' : ''}{vsMean}%</div>
                  <div className="text-xs text-muted-foreground">${US_MEAN_SALARY.toLocaleString()} mean</div>
                </div>
                <div className="rounded-xl bg-card/60 p-4 ring-1 ring-border/50">
                  <div className="text-sm text-muted-foreground">Federal Bracket</div>
                  <div className="text-lg font-bold text-foreground">{result.yearly.marginalTaxRate}%</div>
                  <div className="text-xs text-muted-foreground">Marginal rate</div>
                </div>
                <div className="rounded-xl bg-card/60 p-4 ring-1 ring-border/50">
                  <div className="text-sm text-muted-foreground">Hourly Rate</div>
                  <div className="text-xl font-bold text-foreground">{formatCurrency(salary / 52 / 40)}</div>
                  <div className="text-xs text-muted-foreground">at 40 hrs/week</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <InContentAd />

        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-xl font-semibold text-foreground mb-6 text-center">Customize Your Calculation</h2>
            <SalaryCalculatorForm initialSalary={salary} />
          </div>
        </section>

        {/* What This Salary Affords */}
        <section className="py-12 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="rounded-xl bg-accent/10 p-2"><ShoppingCart className="h-5 w-5 text-accent" /></div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">What {formattedSalary} Affords</h2>
                  <p className="text-sm text-muted-foreground">Based on {formatCurrency(result.monthly.takeHomePay)}/month take-home</p>
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
                  <h2 className="text-xl font-bold text-foreground">Jobs Around {formattedSalary}</h2>
                  <p className="text-sm text-muted-foreground">Typical roles at this salary level</p>
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
              <h2 className="text-2xl font-bold text-foreground mb-8">{formattedSalary} Salary Breakdown</h2>
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
                    <TableRow label="Gross Salary" yearly={salary} monthly={salary / 12} weekly={salary / 52} />
                    <TableRow label="Standard Deduction" yearly={result.yearly.standardDeduction} monthly={result.monthly.standardDeduction} weekly={result.weekly.standardDeduction} muted />
                    <TableRow label="Taxable Income" yearly={result.yearly.taxableIncome} monthly={result.monthly.taxableIncome} weekly={result.weekly.taxableIncome} />
                    <TableRow label="Federal Tax" yearly={-result.yearly.federalTax} monthly={-result.monthly.federalTax} weekly={-result.weekly.federalTax} negative />
                    <TableRow label="Social Security" yearly={-result.yearly.socialSecurity} monthly={-result.monthly.socialSecurity} weekly={-result.weekly.socialSecurity} negative />
                    <TableRow label="Medicare" yearly={-result.yearly.medicare} monthly={-result.monthly.medicare} weekly={-result.weekly.medicare} negative />
                    <TableRow label="Total Deductions" yearly={-result.yearly.totalDeductions} monthly={-result.monthly.totalDeductions} weekly={-result.weekly.totalDeductions} negative bold />
                    <TableRow label="Take Home Pay" yearly={result.yearly.takeHomePay} monthly={result.monthly.takeHomePay} weekly={result.weekly.takeHomePay} highlight bold />
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground mt-4">* Single filer in Texas (no state tax). State taxes vary significantly.</p>
            </div>
          </div>
        </section>

        {/* Related Salaries */}
        {relatedSalaries.length > 0 && (
          <section className="py-12 bg-muted/30 border-t border-border/40">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-xl font-bold text-foreground mb-6">Compare Similar Salaries</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {relatedSalaries.map((s) => {
                    const r = calculateSalary({ grossSalary: s, filingStatus: 'single', state: 'TX' })
                    return (
                      <Link key={s} href={`/salary/${s}`} className="rounded-2xl bg-card/60 dark:bg-card/40 p-4 ring-1 ring-border/50 hover:ring-accent/50 transition-all">
                        <div className="text-sm font-semibold text-foreground">{formatCurrency(s, 0)}</div>
                        <div className="text-xs text-muted-foreground mt-1">Take home: {formatCurrency(r.yearly.takeHomePay, 0)}</div>
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
              <h2 className="text-xl font-bold text-foreground mb-4">Understanding Your {formattedSalary} Salary</h2>
              <div className="text-sm text-muted-foreground space-y-4 leading-relaxed">
                <p>
                  A {formattedSalary} salary in the US for the {TAX_YEAR} tax year will result in a take-home
                  pay of approximately {formatCurrency(result.yearly.takeHomePay)} per year, or {formatCurrency(result.monthly.takeHomePay)} per month
                  (assuming single filer in a state with no income tax). This calculation includes federal income tax and FICA taxes.
                </p>
                <p>
                  Your effective tax rate is {result.yearly.effectiveTaxRate.toFixed(1)}%, meaning for every $1 you earn,
                  you keep approximately ${((1 - result.yearly.effectiveTaxRate / 100)).toFixed(2)}.
                  Your marginal tax rate is {result.yearly.marginalTaxRate}%.
                </p>
                <p>
                  State taxes vary significantly - from 0% in Texas, Florida, and Washington to over 13% in California.
                  Use the calculator above to see results for your specific state.
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

function SummaryCard({ label, value, subtext, highlight = false }: { label: string; value: string; subtext: string; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl p-4 text-center ring-1 ${highlight ? 'bg-emerald-50 dark:bg-emerald-950/30 ring-emerald-200 dark:ring-emerald-800' : 'bg-card/60 dark:bg-card/40 ring-border/50'}`}>
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className={`text-xl font-bold ${highlight ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground'}`}>{value}</div>
      <div className="text-xs text-muted-foreground">{subtext}</div>
    </div>
  )
}

function TableRow({ label, yearly, monthly, weekly, negative = false, highlight = false, bold = false, muted = false }: { label: string; yearly: number; monthly: number; weekly: number; negative?: boolean; highlight?: boolean; bold?: boolean; muted?: boolean }) {
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
