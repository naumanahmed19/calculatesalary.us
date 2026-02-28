const BASE_URL = 'https://calculatesalary.us'

import { SidebarLayout } from "@/components/sidebar-layout"
import { RelatedCalculators, salaryCalculators } from "@/components/related-calculators"
import { HeaderAd, MobileHeaderAd, InContentAd, FooterAd } from "@/components/ad-unit"
import {
  US_BENEFITS,
  BENEFIT_CATEGORIES,
  getBenefitBySlug,
  getBenefitsByCategory,
} from "@/lib/benefits/us-benefits-data"
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  FileText,
  DollarSign,
  AlertCircle,
  Lightbulb,
  Calendar,
} from "lucide-react"
import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return US_BENEFITS.map((benefit) => ({
    slug: benefit.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const benefit = getBenefitBySlug(slug)

  if (!benefit) {
    return {
      title: "Benefit Not Found | US Benefits Guide",
    }
  }

  const catInfo = BENEFIT_CATEGORIES[benefit.category]
  const amountInfo = benefit.monthlyAmount || ""

  return {
    title: `${benefit.name} 2025 - Eligibility, Rates & How to Apply`,
    description: `${benefit.name}: ${benefit.shortDescription}. ${amountInfo ? `Current amount: ${amountInfo}. ` : ""}Check eligibility requirements and learn how to apply for this federal benefit.`,
    keywords: [
      benefit.name,
      ...benefit.keywords,
      "US federal benefits",
      "eligibility",
      "how to apply",
      catInfo.name,
      "2025",
    ],
    openGraph: {
      title: `${benefit.name} - US Benefits Guide 2025`,
      description: `${benefit.shortDescription}. Check eligibility and current rates.`,
      type: "article",
      locale: "en_US",
      siteName: "CalculateSalary.co",
    },
    twitter: {
      card: "summary",
      title: `${benefit.name} - US Benefits`,
      description: benefit.shortDescription,
    },
    alternates: {
      canonical: `${BASE_URL}/benefits/${slug}`,
    },
  }
}

export default async function BenefitDetailPage({ params }: Props) {
  const { slug } = await params
  const benefit = getBenefitBySlug(slug)

  if (!benefit) {
    notFound()
  }

  const catInfo = BENEFIT_CATEGORIES[benefit.category]
  const Icon = benefit.icon
  const relatedBenefits = getBenefitsByCategory(benefit.category)
    .filter(b => b.slug !== benefit.slug)
    .slice(0, 3)

  // Schema.org structured data
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${benefit.name} - US Benefits Guide 2025`,
    description: benefit.description,
    author: {
      "@type": "Organization",
      name: "CalculateSalary.co",
    },
    publisher: {
      "@type": "Organization",
      name: "CalculateSalary.co",
    },
    dateModified: new Date().toISOString(),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://calculatesalary.co/benefits/${slug}`,
    },
  }

  const governmentServiceSchema = {
    "@context": "https://schema.org",
    "@type": "GovernmentService",
    name: benefit.name,
    description: benefit.description,
    serviceType: catInfo.name,
    provider: {
      "@type": "GovernmentOrganization",
      name: "US Federal Government",
      url: "https://www.usa.gov",
    },
    ...(benefit.claimUrl && { url: benefit.claimUrl }),
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://calculatesalary.co",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "US Benefits",
        item: "https://calculatesalary.co/benefits",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: benefit.name,
        item: `https://calculatesalary.co/benefits/${slug}`,
      },
    ],
  }

  return (
    <SidebarLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(governmentServiceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <main id="main-content" className="flex-1">
        <HeaderAd />
        <MobileHeaderAd />

        {/* Breadcrumb */}
        <section className="py-4 border-b border-border/40">
          <div className="container mx-auto px-4">
            <nav className="max-w-4xl mx-auto">
              <ol className="flex items-center gap-2 text-sm">
                <li>
                  <Link href="/" className="text-muted-foreground hover:text-accent">
                    Home
                  </Link>
                </li>
                <li className="text-muted-foreground">/</li>
                <li>
                  <Link href="/benefits" className="text-muted-foreground hover:text-accent">
                    Benefits
                  </Link>
                </li>
                <li className="text-muted-foreground">/</li>
                <li className="text-foreground font-medium truncate">
                  {benefit.name}
                </li>
              </ol>
            </nav>
          </div>
        </section>

        {/* Hero Section */}
        <section className="py-12 md:py-16 border-b border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-start gap-4 mb-6">
                <div className={`rounded-2xl bg-muted p-4 ${catInfo.color}`}>
                  <Icon className="h-8 w-8" />
                </div>
                <div>
                  <span className="inline-flex items-center rounded-full border border-border/60 px-2.5 py-0.5 text-xs text-muted-foreground mb-2">
                    {catInfo.name}
                  </span>
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground text-balance">
                    {benefit.name}
                  </h1>
                </div>
              </div>
              <p className="text-lg text-muted-foreground text-pretty max-w-3xl">
                {benefit.description}
              </p>
            </div>
          </div>
        </section>

        {/* Amount Cards */}
        {benefit.monthlyAmount && (
          <section className="py-8 bg-muted/30 border-b border-border/40">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 p-6 ring-1 ring-emerald-200 dark:ring-emerald-700">
                    <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-300 mb-2">
                      <DollarSign className="h-4 w-4" />
                      Benefit Amount
                    </div>
                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      {benefit.monthlyAmount}
                    </div>
                  </div>
                  {benefit.annualAmount && (
                    <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 p-6 ring-1 ring-emerald-200 dark:ring-emerald-700">
                      <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-300 mb-2">
                        <DollarSign className="h-4 w-4" />
                        Annual Amount
                      </div>
                      <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {benefit.annualAmount}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        <InContentAd />

        {/* Main Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid gap-8 lg:grid-cols-3">
                {/* Left Column - Main Info */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Eligibility */}
                  <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-5 w-5 text-accent" />
                      <h2 className="text-lg font-semibold text-foreground">Eligibility Criteria</h2>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      You may be eligible for {benefit.name} if:
                    </p>
                    <ul className="space-y-3">
                      {benefit.eligibility.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span className="text-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* How to Claim */}
                  <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="h-5 w-5 text-accent" />
                      <h2 className="text-lg font-semibold text-foreground">How to Apply</h2>
                    </div>
                    <p className="text-foreground mb-4">{benefit.howToClaim}</p>
                    {benefit.claimUrl && (
                      <a
                        href={benefit.claimUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
                      >
                        Apply Now
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-6">
                  {/* Quick Info */}
                  <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-5 ring-1 ring-border/50">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Quick Info</h3>
                    <div className="space-y-4">
                      <div>
                        <span className="text-sm text-muted-foreground">Category</span>
                        <p className="font-medium flex items-center gap-2">
                          <catInfo.icon className={`h-4 w-4 ${catInfo.color}`} />
                          {catInfo.name}
                        </p>
                      </div>
                      {benefit.monthlyAmount && (
                        <div>
                          <span className="text-sm text-muted-foreground">Amount</span>
                          <p className="font-medium text-emerald-600 dark:text-emerald-400">
                            {benefit.monthlyAmount}
                          </p>
                        </div>
                      )}
                      {benefit.annualAmount && (
                        <div>
                          <span className="text-sm text-muted-foreground">Annual</span>
                          <p className="font-medium text-emerald-600 dark:text-emerald-400">
                            {benefit.annualAmount}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Related Benefits */}
                  {relatedBenefits.length > 0 && (
                    <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-5 ring-1 ring-border/50">
                      <h3 className="text-lg font-semibold text-foreground mb-1">Related Benefits</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Other {catInfo.name.toLowerCase()}
                      </p>
                      <div className="space-y-3">
                        {relatedBenefits.map((related) => (
                          <Link
                            key={related.slug}
                            href={`/benefits/${related.slug}`}
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                          >
                            <span className="font-medium text-sm group-hover:text-accent transition-colors">
                              {related.name}
                            </span>
                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Back to Benefits */}
                  <Link
                    href="/benefits"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-muted hover:bg-muted/80 rounded-lg text-foreground font-medium transition-colors"
                  >
                    View All Benefits
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Important Information */}
        <section className="py-12 bg-muted/30 border-t border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Key Facts */}
                <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="h-5 w-5 text-blue-500" />
                    <h3 className="text-lg font-semibold text-foreground">Key Facts About {benefit.name}</h3>
                  </div>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">
                        Rates shown are for 2025 and are subject to annual adjustments
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">
                        {benefit.category === 'tax-credits'
                          ? 'Tax credits are claimed when filing your annual tax return'
                          : benefit.category === 'veterans'
                            ? 'VA benefits are tax-free'
                            : 'Eligibility may depend on your income, assets, and circumstances'}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">
                        {benefit.monthlyAmount?.includes('N/A')
                          ? 'This is an annual tax credit, not a monthly payment'
                          : 'Payment frequency and amounts vary by program and individual circumstances'}
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Tips for Claiming */}
                <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb className="h-5 w-5 text-amber-500" />
                    <h3 className="text-lg font-semibold text-foreground">Tips for Applying</h3>
                  </div>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-accent font-bold">1.</span>
                      <span>Gather all required documents before starting (ID, Social Security numbers, proof of income)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent font-bold">2.</span>
                      <span>Keep copies of everything you submit and note reference numbers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent font-bold">3.</span>
                      <span>Apply as soon as you think you&apos;re eligible - processing takes time</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent font-bold">4.</span>
                      <span>If denied, you have the right to appeal - many initial denials are overturned</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEO Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                More About {benefit.name}
              </h2>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p>
                  {benefit.name} is a US federal benefit program designed to provide financial support
                  for {catInfo.name.toLowerCase()}. {benefit.description}
                </p>
                {benefit.monthlyAmount && !benefit.monthlyAmount.includes('N/A') && (
                  <p>
                    The current amount for {benefit.name} is <strong>{benefit.monthlyAmount}</strong>
                    {benefit.annualAmount && <> (approximately <strong>{benefit.annualAmount}</strong> annually)</>}.
                    Rates are typically reviewed annually and may change based on cost-of-living adjustments.
                  </p>
                )}
                {benefit.annualAmount && benefit.monthlyAmount?.includes('N/A') && (
                  <p>
                    The maximum {benefit.name} for 2025 is <strong>{benefit.annualAmount}</strong>.
                    This is an annual tax credit claimed when filing your federal income tax return.
                  </p>
                )}
                <h3>Who administers {benefit.name}?</h3>
                <p>
                  {benefit.category === 'retirement' || benefit.category === 'disability'
                    ? `${benefit.name} is administered by the Social Security Administration (SSA). You can apply online at ssa.gov or by calling 1-800-772-1213.`
                    : benefit.category === 'healthcare'
                      ? `${benefit.name} is administered by the Centers for Medicare & Medicaid Services (CMS). You can find more information at medicare.gov or healthcare.gov.`
                      : benefit.category === 'veterans'
                        ? `${benefit.name} is administered by the Department of Veterans Affairs (VA). You can apply online at va.gov or through a local VA office.`
                        : benefit.category === 'tax-credits'
                          ? `${benefit.name} is administered by the Internal Revenue Service (IRS). You claim this credit when filing your annual federal income tax return.`
                          : `${benefit.name} is a federal program. Check the official website for application information and local office locations.`
                  }
                </p>
                <h3>Can I receive {benefit.name} with other benefits?</h3>
                <p>
                  {benefit.category === 'tax-credits'
                    ? `Yes, ${benefit.name} can typically be claimed alongside other tax credits and benefits. For example, you may claim both EITC and the Child Tax Credit if you qualify for both.`
                    : benefit.category === 'veterans'
                      ? `Yes, VA benefits can often be received alongside Social Security and other federal benefits. VA disability compensation is not counted as income for most means-tested programs.`
                      : `Whether you can receive ${benefit.name} alongside other benefits depends on your circumstances. Some benefits may affect others - for example, receiving certain income may reduce means-tested benefits. Check with the administering agency for specific rules.`
                  }
                </p>
                <p>
                  Use our <Link href="/" className="text-accent hover:underline">salary calculator</Link> to
                  understand your overall income, including how benefits might supplement your earnings from employment.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 bg-muted/30 border-t border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Calculate Your Take-Home Pay
              </h2>
              <p className="text-muted-foreground mb-6">
                Use our salary calculator to see how benefits fit into your overall income picture.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors font-medium"
              >
                Salary Calculator
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <RelatedCalculators title="Related Tools" calculators={salaryCalculators} />

        <FooterAd />
      </main>
    </SidebarLayout>
  )
}
