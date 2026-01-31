import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Metadata } from 'next'
import {
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Info,
  FileText,
  Lightbulb,
  BookOpen,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SidebarLayout } from '@/components/sidebar-layout'
import { InArticleAd } from '@/components/ad-unit'
import {
  US_BENEFITS,
  BENEFIT_CATEGORIES,
  getBenefitBySlug,
  getRelatedBenefits,
} from '@/lib/benefits/us-benefits-data'

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
      title: 'Benefit Not Found',
    }
  }

  return {
    title: `${benefit.name} 2025 | Eligibility, How to Apply & Benefit Amounts`,
    description: `${benefit.description} Learn about eligibility requirements, current benefit amounts (${benefit.monthlyAmount}), and how to apply for ${benefit.name}.`,
    keywords: [
      benefit.name,
      `${benefit.name} eligibility`,
      `${benefit.name} application`,
      `how to apply for ${benefit.name}`,
      `${benefit.name} 2025`,
      `${benefit.name} requirements`,
      'federal benefits',
      'government assistance',
    ],
    openGraph: {
      title: `${benefit.name} 2025 | Complete Guide`,
      description: `${benefit.shortDescription}. Current amount: ${benefit.monthlyAmount}. Check eligibility and learn how to apply.`,
      type: 'article',
      locale: 'en_US',
      siteName: 'CalculateSalary.co',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${benefit.name} 2025`,
      description: `${benefit.shortDescription}. Amount: ${benefit.monthlyAmount}`,
    },
    alternates: {
      canonical: `https://calculatesalary.co/benefits/${benefit.slug}`,
    },
  }
}

export default async function BenefitPage({ params }: Props) {
  const { slug } = await params
  const benefit = getBenefitBySlug(slug)

  if (!benefit) {
    notFound()
  }

  const relatedBenefits = getRelatedBenefits(benefit)
  const category = BENEFIT_CATEGORIES[benefit.category]

  // Schema.org structured data
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${benefit.name} - US Benefits Guide 2025`,
    description: benefit.description,
    author: {
      '@type': 'Organization',
      name: 'CalculateSalary.co',
    },
    publisher: {
      '@type': 'Organization',
      name: 'CalculateSalary.co',
    },
    dateModified: new Date().toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://calculatesalary.co/benefits/${benefit.slug}`,
    },
  }

  const governmentServiceSchema = {
    '@context': 'https://schema.org',
    '@type': 'GovernmentService',
    name: benefit.name,
    description: benefit.description,
    serviceType: category.label,
    provider: {
      '@type': 'GovernmentOrganization',
      name: 'United States Federal Government',
    },
    areaServed: {
      '@type': 'Country',
      name: 'United States',
    },
    url: benefit.officialLink,
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://calculatesalary.co',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Benefits',
        item: 'https://calculatesalary.co/benefits',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: benefit.name,
        item: `https://calculatesalary.co/benefits/${benefit.slug}`,
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

      <main className="container max-w-4xl py-8 md:py-12">
        {/* Back Link */}
        <Link
          href="/benefits"
          className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Benefits Guide
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{category.label}</Badge>
            <Badge variant="outline">2025</Badge>
          </div>
          <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">{benefit.name}</h1>
          <p className="text-lg text-muted-foreground">{benefit.description}</p>
        </div>

        {/* Key Info Card */}
        <Card className="mb-8 rounded-2xl bg-primary/5 ring-1 ring-primary/20">
          <CardContent className="pt-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Amount</p>
                <p className="text-2xl font-bold text-primary">{benefit.monthlyAmount}</p>
              </div>
              {benefit.annualAmount && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Annual Amount</p>
                  <p className="text-2xl font-bold">{benefit.annualAmount}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Key Facts */}
        <Card className="mb-8 rounded-2xl bg-card/60 dark:bg-card/40 ring-1 ring-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              Key Facts for 2025
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {benefit.keyFacts.map((fact, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-blue-600 mt-0.5" />
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Eligibility */}
        <Card className="mb-8 rounded-2xl bg-card/60 dark:bg-card/40 ring-1 ring-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Eligibility Requirements
            </CardTitle>
            <CardDescription>You may qualify for {benefit.name} if you meet these criteria</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {benefit.eligibility.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-green-600 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <InArticleAd />

        {/* How to Claim */}
        <Card className="mb-8 rounded-2xl bg-card/60 dark:bg-card/40 ring-1 ring-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              How to Apply
            </CardTitle>
            <CardDescription>Steps to apply for {benefit.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              {benefit.howToClaim.map((step, index) => (
                <li key={index} className="flex items-start gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-purple-100 text-sm font-semibold text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                    {index + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
            <div className="mt-6">
              <Button asChild>
                <Link
                  href={benefit.officialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gap-2"
                >
                  Apply on Official Website
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tips for Success */}
        <Card className="mb-8 rounded-2xl bg-card/60 dark:bg-card/40 ring-1 ring-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
              Tips for Success
            </CardTitle>
            <CardDescription>Advice to help you successfully receive {benefit.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {benefit.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 shrink-0 text-yellow-600 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* More Information */}
        <Card className="mb-8 rounded-2xl bg-card/60 dark:bg-card/40 ring-1 ring-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-indigo-600" />
              More About {benefit.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">{benefit.moreInfo}</p>
          </CardContent>
        </Card>

        <InArticleAd />

        {/* Related Benefits */}
        {relatedBenefits.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">Related Benefits</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {relatedBenefits.map((related) => (
                <Link key={related.slug} href={`/benefits/${related.slug}`}>
                  <Card className="h-full rounded-2xl bg-card/60 dark:bg-card/40 ring-1 ring-border/50 transition-all hover:ring-primary/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{related.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {related.shortDescription}
                      </p>
                      <p className="mt-2 text-sm font-medium text-primary">{related.monthlyAmount}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Important Notice */}
        <Card className="mb-8 border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
          <CardContent className="flex items-start gap-4 pt-6">
            <AlertCircle className="h-6 w-6 shrink-0 text-amber-600" />
            <div>
              <h3 className="font-semibold text-amber-800 dark:text-amber-200">Important Notice</h3>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                This information is for general guidance only and is current as of 2025. Benefits rules,
                amounts, and eligibility change frequently. Always verify information with the official
                government agency and consult with a benefits counselor for personalized advice. State-administered
                programs may have different rules than federal guidelines.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Official Link */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t pt-6">
          <Link
            href="/benefits"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            View All Benefits
          </Link>
          <Button variant="outline" asChild>
            <Link
              href={benefit.officialLink}
              target="_blank"
              rel="noopener noreferrer"
              className="gap-2"
            >
              Official {benefit.name} Website
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </main>
    </SidebarLayout>
  )
}
