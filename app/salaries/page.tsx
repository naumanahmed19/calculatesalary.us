import type { Metadata } from 'next'
import Link from 'next/link'
import { SidebarLayout } from '@/components/sidebar-layout'
import { formatCurrency, TAX_YEAR } from '@/lib/us-tax-calculator'
import { getCategoriesWithCounts, US_JOB_SALARIES } from '@/lib/us-job-salaries'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { HeaderAd, MobileHeaderAd, InContentAd, InArticleAd, FooterAd } from '@/components/ad-unit'
import { RelatedCalculators, salaryCalculators } from '@/components/related-calculators'

export const metadata: Metadata = {
  title: `US Average Salaries by Job ${TAX_YEAR} - Salary Guide & Comparison`,
  description: `Compare US salaries by job title for ${TAX_YEAR}. Average salaries, salary ranges, and take-home pay for ${US_JOB_SALARIES.length}+ professions. Technology, healthcare, finance and more.`,
  keywords: [
    'us average salary',
    'us salaries by job',
    'average salary us 2025',
    'salary by job title us',
    'us salary guide',
    'salary comparison us',
    'what is a good salary us',
    'us salary checker',
    'how much should i earn us',
    TAX_YEAR,
  ],
  openGraph: {
    title: `US Average Salaries by Job ${TAX_YEAR} - Complete Guide`,
    description: `Compare US salaries by job title. Find average salaries and take-home pay for ${US_JOB_SALARIES.length}+ professions.`,
    type: 'website',
    locale: 'en_US',
  },
  alternates: {
    canonical: '/salaries',
  },
}

export default function SalariesPage() {
  const categoriesWithJobs = getCategoriesWithCounts()
  
  // Sort jobs by average salary for "Top Paying" section
  const topPayingJobs = [...US_JOB_SALARIES]
    .sort((a, b) => b.averageSalary - a.averageSalary)
    .slice(0, 10)

  return (
    <SidebarLayout>
      <main className="flex-1">
        {/* Top Ad Placement */}
        <HeaderAd />
        <MobileHeaderAd />

        {/* Hero Section */}
        <section className="py-12 md:py-16 border-b border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="secondary" className="mb-4">
                {TAX_YEAR} Tax Year
              </Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4">
                US Salaries by Job Title
              </h1>
              <p className="text-lg text-muted-foreground">
                Explore average salaries, salary ranges, and take-home pay for {US_JOB_SALARIES.length}+ professions
                across the US. Data includes regional variations and career progression.
              </p>
            </div>
          </div>
        </section>

        {/* Top Paying Jobs */}
        <section className="py-12 bg-muted/30 border-b border-border/40">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Top 10 Highest Paying Jobs in the US
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              {topPayingJobs.map((job, index) => (
                <Link 
                  key={job.slug}
                  href={`/salaries/${job.slug}`}
                  className="group"
                >
                  <Card className="h-full transition-all hover:shadow-md hover:border-accent/50">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-accent bg-accent/10 rounded-full w-6 h-6 flex items-center justify-center">
                          {index + 1}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {job.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-base group-hover:text-accent transition-colors">
                        {job.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-foreground">
                        {formatCurrency(job.averageSalary, 0)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatCurrency(job.salaryRange.min, 0)} - {formatCurrency(job.salaryRange.max, 0)}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Ad after Top 10 Jobs */}
        <InArticleAd />

        {/* Jobs by Category */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-foreground mb-8">
              Browse Salaries by Industry
            </h2>
            
            <div className="space-y-12">
              {categoriesWithJobs.map(({ category, jobs }, index) => (
                <div key={category}>
                  {/* Ad between categories - every 3rd category */}
                  {index > 0 && index % 3 === 0 && <InContentAd className="mb-8" />}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-foreground">{category}</h3>
                    <Badge variant="secondary">{jobs.length} jobs</Badge>
                  </div>
                  
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {jobs.map((job) => (
                      <Link 
                        key={job.slug}
                        href={`/salaries/${job.slug}`}
                        className="group"
                      >
                        <Card className="h-full transition-all hover:shadow-md hover:border-accent/50">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base group-hover:text-accent transition-colors">
                              {job.title}
                            </CardTitle>
                            <CardDescription className="text-xs line-clamp-2">
                              {job.description.slice(0, 80)}...
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-baseline justify-between">
                              <div>
                                <div className="text-lg font-bold text-foreground">
                                  {formatCurrency(job.averageSalary, 0)}
                                </div>
                                <div className="text-xs text-muted-foreground">average</div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-muted-foreground">
                                  {formatCurrency(job.salaryRange.min, 0)} - {formatCurrency(job.salaryRange.max, 0)}
                                </div>
                                <div className="text-xs text-muted-foreground">range</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SEO Content */}
        <section className="py-12 bg-muted/30 border-t border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto prose prose-sm">
              <h2 className="text-xl font-bold text-foreground mb-4">
                About US Salary Data
              </h2>
              <div className="text-sm text-muted-foreground space-y-4 leading-relaxed">
                <p>
                  Our US salary data is compiled from multiple sources including the Bureau of Labor Statistics,
                  job boards, and industry surveys. Salaries are updated for the {TAX_YEAR} tax year and reflect
                  current market conditions across different regions of the United States.
                </p>
                <p>
                  Each job profile includes average salaries, entry-level and senior-level pay ranges,
                  regional variations (New York, California, Texas, and national averages), required skills,
                  qualifications, and typical career progression paths.
                </p>
                <p>
                  Use our salary calculator to see exactly how much you would take home after federal tax,
                  state tax, and FICA deductions at any salary level.
                </p>
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
