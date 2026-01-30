import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { SidebarLayout } from '@/components/sidebar-layout'
import { SalaryCalculatorForm } from '@/components/salary-calculator-form'
import { calculateSalary, formatCurrency, TAX_YEAR } from '@/lib/us-tax-calculator'
import { getAllJobSlugs, getJobBySlug, getRelatedJobs, getJobSalaryTrends, type JobSalaryData } from '@/lib/us-job-salaries'
import { SalaryTrendsChart } from '@/components/salary-trends-chart'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { HeaderAd, MobileHeaderAd, InContentAd, InArticleAd, FooterAd } from '@/components/ad-unit'
import { RelatedCalculators, salaryCalculators } from '@/components/related-calculators'

const BASE_URL = 'https://calculatesalary.com'

interface PageProps {
  params: Promise<{ slug: string }>
}

// Generate static params for all jobs
export async function generateStaticParams() {
  return getAllJobSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const job = getJobBySlug(slug)

  if (!job) {
    return { title: 'Job Not Found' }
  }

  const title = `${job.title} Salary USA ${TAX_YEAR} - Average Pay & Take Home`
  const description = `${job.title} salary in the US: average ${formatCurrency(job.averageSalary, 0)}, range ${formatCurrency(job.salaryRange.min, 0)} - ${formatCurrency(job.salaryRange.max, 0)}. Calculate take-home pay, see regional salaries, career progression and required skills.`

  return {
    title,
    description,
    keywords: [
      `${job.title.toLowerCase()} salary usa`,
      `${job.title.toLowerCase()} salary`,
      `average ${job.title.toLowerCase()} salary`,
      `${job.title.toLowerCase()} pay`,
      `${job.title.toLowerCase()} earnings`,
      `${job.category.toLowerCase()} salaries usa`,
      `how much does a ${job.title.toLowerCase()} earn`,
      `${job.title.toLowerCase()} take home pay`,
      'us salary calculator',
      TAX_YEAR,
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_US',
    },
    alternates: {
      canonical: `/salaries/${slug}`,
    },
  }
}

// Enhanced Occupation Schema for SEO
function generateJobSchema(job: JobSalaryData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Occupation',
    '@id': `${BASE_URL}/salaries/${job.slug}#occupation`,
    name: job.title,
    description: job.description,
    occupationalCategory: job.category,
    estimatedSalary: [
      {
        '@type': 'MonetaryAmountDistribution',
        name: 'National Average',
        currency: 'USD',
        duration: 'P1Y',
        percentile10: job.entryLevel,
        median: job.averageSalary,
        percentile90: job.seniorLevel,
      },
      {
        '@type': 'MonetaryAmountDistribution',
        name: 'California',
        currency: 'USD',
        duration: 'P1Y',
        median: job.location.california,
      }
    ],
    skills: job.skills.join(', '),
    qualifications: job.qualifications.join(', '),
    responsibilities: job.responsibilities.join('. '),
    occupationLocation: {
      '@type': 'Country',
      name: 'United States',
    },
  }
}

// BreadcrumbList Schema
function generateBreadcrumbSchema(job: JobSalaryData) {
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
        name: 'Salaries',
        item: `${BASE_URL}/salaries`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `${job.title} Salary`,
        item: `${BASE_URL}/salaries/${job.slug}`
      }
    ]
  }
}

export default async function JobSalaryPage({ params }: PageProps) {
  const { slug } = await params
  const job = getJobBySlug(slug)

  if (!job) {
    notFound()
  }

  const result = calculateSalary({
    grossSalary: job.averageSalary,
    filingStatus: 'single',
    state: 'TX',
  })

  const relatedJobs = getRelatedJobs(slug, 4)
  const salaryTrends = getJobSalaryTrends(job)

  return (
    <SidebarLayout>
      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateJobSchema(job)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbSchema(job)) }}
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
              <Link href="/salaries" className="hover:text-foreground transition-colors">
                Salaries
              </Link>
            </li>
            <li className="inline-flex items-center">/</li>
            <li className="inline-flex items-center text-foreground font-medium">{job.title}</li>
          </ol>
        </nav>

        {/* Hero Section */}
        <section className="py-8 md:py-12 border-b border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge variant="secondary">{job.category}</Badge>
                <Badge variant="outline">{TAX_YEAR}</Badge>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
                {job.title} Salary in the USA
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                {job.description}
              </p>
            </div>
          </div>
        </section>

        {/* Salary Overview Cards */}
        <section className="py-8 bg-muted/30 border-b border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
              <SalaryCard
                label="Average Salary"
                value={formatCurrency(job.averageSalary, 0)}
                subtext="per year"
                highlight
              />
              <SalaryCard
                label="Entry Level"
                value={formatCurrency(job.entryLevel, 0)}
                subtext="starting salary"
              />
              <SalaryCard
                label="Experienced"
                value={formatCurrency(job.experienced, 0)}
                subtext="mid-career"
              />
              <SalaryCard
                label="Senior Level"
                value={formatCurrency(job.seniorLevel, 0)}
                subtext="top earners"
              />
            </div>
          </div>
        </section>

        {/* Take Home Pay Section */}
        <section className="py-12 border-b border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {job.title} Take Home Pay
              </h2>
              <p className="text-muted-foreground mb-6">
                On the average {job.title} salary of {formatCurrency(job.averageSalary, 0)},
                you would take home {formatCurrency(result.yearly.takeHomePay, 0)} per year
                ({formatCurrency(result.monthly.takeHomePay)} per month) after federal tax and FICA.
              </p>

              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <TakeHomeCard
                  period="Yearly"
                  gross={job.averageSalary}
                  net={result.yearly.takeHomePay}
                  federalTax={result.yearly.federalTax}
                  fica={result.yearly.socialSecurity + result.yearly.medicare}
                />
                <TakeHomeCard
                  period="Monthly"
                  gross={job.averageSalary / 12}
                  net={result.monthly.takeHomePay}
                  federalTax={result.monthly.federalTax}
                  fica={result.monthly.socialSecurity + result.monthly.medicare}
                />
                <TakeHomeCard
                  period="Weekly"
                  gross={job.averageSalary / 52}
                  net={result.weekly.takeHomePay}
                  federalTax={result.weekly.federalTax}
                  fica={result.weekly.socialSecurity + result.weekly.medicare}
                />
              </div>

              <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 p-4 ring-1 ring-emerald-200 dark:ring-emerald-800">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Effective tax rate:</strong> {result.yearly.effectiveTaxRate.toFixed(1)}%
                  <span className="mx-2">|</span>
                  <strong className="text-foreground">Marginal rate:</strong> {result.yearly.marginalTaxRate}%
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Ad after Take Home Pay - High engagement */}
        <InContentAd />

        {/* Regional Salaries */}
        <section className="py-12 bg-muted/30 border-b border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {job.title} Salary by Location
              </h2>
              <p className="text-muted-foreground mb-6">
                {job.title} salaries vary significantly by region. California and New York typically offer the highest salaries
                but also have higher costs of living and state income taxes.
              </p>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <RegionalSalaryCard
                  region="New York"
                  salary={job.location.newYork}
                  vsNational={((job.location.newYork - job.location.national) / job.location.national * 100).toFixed(0)}
                />
                <RegionalSalaryCard
                  region="California"
                  salary={job.location.california}
                  vsNational={((job.location.california - job.location.national) / job.location.national * 100).toFixed(0)}
                />
                <RegionalSalaryCard
                  region="Texas"
                  salary={job.location.texas}
                  vsNational={((job.location.texas - job.location.national) / job.location.national * 100).toFixed(0)}
                />
                <RegionalSalaryCard
                  region="National Average"
                  salary={job.location.national}
                  vsNational="0"
                  isBaseline
                />
              </div>
            </div>
          </div>
        </section>

        {/* Salary Trends Section */}
        <section className="py-12 border-b border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {job.title} Salary Growth (2020-2025)
              </h2>
              <p className="text-muted-foreground mb-6">
                See how {job.title} salaries have changed over the past 5 years, including inflation-adjusted real growth.
              </p>
              <SalaryTrendsChart jobTitle={job.title} trends={salaryTrends} />
            </div>
          </div>
        </section>

        {/* Ad after Salary Trends */}
        <InArticleAd />

        {/* Skills & Qualifications */}
        <section className="py-12 border-b border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Skills */}
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    Key Skills Required
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Qualifications */}
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    Typical Qualifications
                  </h2>
                  <ul className="space-y-2">
                    {job.qualifications.map((qual) => (
                      <li key={qual} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-accent mt-1">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                        {qual}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ad after Skills section */}
        <InContentAd />

        {/* Career Path */}
        <section className="py-12 bg-muted/30 border-b border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                {job.title} Career Progression
              </h2>
              <div className="flex flex-wrap items-center gap-2">
                {job.careerPath.map((step, index) => (
                  <div key={step} className="flex items-center gap-2">
                    <span className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      index === 0
                        ? 'bg-muted text-muted-foreground'
                        : index === job.careerPath.length - 1
                          ? 'bg-accent text-accent-foreground'
                          : 'bg-card border border-border text-foreground'
                    }`}>
                      {step}
                    </span>
                    {index < job.careerPath.length - 1 && (
                      <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Responsibilities */}
        <section className="py-12 border-b border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                What Does a {job.title} Do?
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {job.responsibilities.map((resp) => (
                  <div key={resp} className="flex items-start gap-3 p-4 rounded-2xl bg-card/60 dark:bg-card/40 ring-1 ring-border/50">
                    <span className="text-accent mt-0.5">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                    <span className="text-sm text-foreground">{resp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Industries */}
        <section className="py-12 bg-muted/30 border-b border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl font-bold text-foreground mb-4">
                Industries Hiring {job.title}s
              </h2>
              <div className="flex flex-wrap gap-2">
                {job.industries.map((industry) => (
                  <Badge key={industry} variant="outline" className="text-sm">
                    {industry}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Calculator */}
        <section className="py-12 border-b border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Calculate Your Take Home Pay
              </h2>
              <p className="text-muted-foreground mb-8">
                Adjust the salary and see your personalized take-home pay calculation.
              </p>
            </div>
            <SalaryCalculatorForm initialSalary={job.averageSalary} />
          </div>
        </section>

        {/* Related Jobs */}
        {relatedJobs.length > 0 && (
          <section className="py-12 bg-muted/30 border-b border-border/40">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-xl font-bold text-foreground mb-6">
                  Related {job.category} Salaries
                </h2>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {relatedJobs.map((related) => (
                    <Link
                      key={related.slug}
                      href={`/salaries/${related.slug}`}
                      className="group"
                    >
                      <Card className="h-full transition-all hover:shadow-md hover:border-accent/50">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base group-hover:text-accent transition-colors">
                            {related.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-lg font-bold text-foreground">
                            {formatCurrency(related.averageSalary, 0)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatCurrency(related.salaryRange.min, 0)} - {formatCurrency(related.salaryRange.max, 0)}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <Link
                    href="/salaries"
                    className="text-sm text-accent hover:underline"
                  >
                    View all US salaries by job title
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
                {job.title} Salary FAQ
              </h2>
              <div className="space-y-6 text-sm text-muted-foreground">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    What is the average {job.title} salary in the US?
                  </h3>
                  <p>
                    The average {job.title} salary in the US is {formatCurrency(job.averageSalary, 0)} per year.
                    Salaries typically range from {formatCurrency(job.salaryRange.min, 0)} for entry-level positions
                    to {formatCurrency(job.salaryRange.max, 0)} for senior roles.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    How much does a {job.title} earn in California?
                  </h3>
                  <p>
                    A {job.title} in California earns an average of {formatCurrency(job.location.california, 0)} per year,
                    which is {((job.location.california - job.location.national) / job.location.national * 100).toFixed(0)}%
                    higher than the national average.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    What is the take-home pay for a {job.title}?
                  </h3>
                  <p>
                    On the average {job.title} salary of {formatCurrency(job.averageSalary, 0)}, you would take home
                    approximately {formatCurrency(result.yearly.takeHomePay, 0)} per year
                    ({formatCurrency(result.monthly.takeHomePay)} per month) after federal income tax and FICA taxes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <RelatedCalculators calculators={salaryCalculators} />
        {/* Footer Ad - Exit intent */}
        <FooterAd />
      </main>
    </SidebarLayout>
  )
}

function SalaryCard({
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
    <div className={`rounded-2xl p-4 text-center ring-1 ${highlight ? 'bg-emerald-50 dark:bg-emerald-950/30 ring-emerald-200 dark:ring-emerald-800' : 'bg-card/60 dark:bg-card/40 ring-border/50'}`}>
      <div className="text-xs text-muted-foreground mb-1">{label}</div>
      <div className={`text-xl font-bold ${highlight ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground'}`}>{value}</div>
      <div className="text-xs text-muted-foreground">{subtext}</div>
    </div>
  )
}

function TakeHomeCard({
  period,
  gross,
  net,
  federalTax,
  fica
}: {
  period: string
  gross: number
  net: number
  federalTax: number
  fica: number
}) {
  return (
    <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-5 ring-1 ring-border/50">
      <div className="text-base font-semibold text-foreground">{period}</div>
      <div className="text-sm text-muted-foreground mb-3">Gross: {formatCurrency(gross)}</div>
      <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mb-3">
        {formatCurrency(net)}
      </div>
      <div className="text-xs text-muted-foreground space-y-1">
        <div className="flex justify-between">
          <span>Federal Tax:</span>
          <span className="text-red-500">-{formatCurrency(federalTax)}</span>
        </div>
        <div className="flex justify-between">
          <span>FICA (SS + Medicare):</span>
          <span className="text-red-500">-{formatCurrency(fica)}</span>
        </div>
      </div>
    </div>
  )
}

function RegionalSalaryCard({
  region,
  salary,
  vsNational,
  isBaseline = false
}: {
  region: string
  salary: number
  vsNational: string
  isBaseline?: boolean
}) {
  return (
    <div className={`rounded-2xl p-5 ring-1 ring-border/50 ${isBaseline ? 'bg-muted/30' : 'bg-card/60 dark:bg-card/40'}`}>
      <div className="text-base font-semibold text-foreground mb-3">{region}</div>
      <div className="text-2xl font-bold text-foreground">
        {formatCurrency(salary, 0)}
      </div>
      {!isBaseline && (
        <div className={`text-xs mt-1 ${Number(vsNational) > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
          {Number(vsNational) > 0 ? '+' : ''}{vsNational}% vs national
        </div>
      )}
      {isBaseline && (
        <div className="text-xs text-muted-foreground mt-1">baseline</div>
      )}
    </div>
  )
}
