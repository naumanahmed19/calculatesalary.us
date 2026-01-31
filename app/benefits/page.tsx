'use client'

import { useState, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Search, Filter, ExternalLink, ChevronRight, HelpCircle, AlertTriangle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { SidebarLayout } from '@/components/sidebar-layout'
import { InArticleAd } from '@/components/ad-unit'
import {
  US_BENEFITS,
  BENEFIT_CATEGORIES,
  BenefitCategory,
  searchBenefits,
} from '@/lib/benefits/us-benefits-data'
import {
  BenefitAmountsChart,
  BenefitCategoryChart,
  UnclaimedBenefitsStats,
  FederalPovertyLevelChart,
} from '@/components/benefits-charts'

const faqItems = [
  {
    question: 'How do I know which benefits I qualify for?',
    answer:
      'Each benefit has specific eligibility criteria based on factors like income, age, disability status, work history, and family situation. Use our individual benefit pages to check detailed requirements, or visit Benefits.gov for a comprehensive eligibility screening tool.',
  },
  {
    question: 'Can I receive multiple benefits at the same time?',
    answer:
      'Yes, many benefits can be combined. For example, you might receive SNAP while also getting Medicaid and EITC. However, some benefits may affect others - SSI payments may be reduced if you receive other income. Each benefit page explains interactions with related programs.',
  },
  {
    question: 'What is the Federal Poverty Level (FPL) and why does it matter?',
    answer:
      'The FPL is an income measure issued annually by HHS. Many programs use percentages of FPL to determine eligibility. For 2025, 100% FPL for a single person is $15,060/year. Programs may use 130%, 185%, 200% or higher thresholds.',
  },
  {
    question: 'How long does it take to get approved for benefits?',
    answer:
      'Processing times vary by program. SNAP typically takes 30 days (7 days for emergency). Medicaid can be immediate or take a few weeks. Social Security disability (SSDI) often takes 3-5 months initially. Section 8 housing has multi-year waiting lists in most areas.',
  },
  {
    question: 'Do I need to be a US citizen to receive benefits?',
    answer:
      'Requirements vary by program. Some programs like emergency Medicaid are available regardless of immigration status. Others require US citizenship or specific immigration statuses. "Qualified immigrants" (including green card holders) may have waiting periods for certain benefits.',
  },
  {
    question: 'What happens if my income or situation changes?',
    answer:
      'You must report changes to the administering agency, usually within 10-30 days. Changes in income, household size, address, or employment status can affect eligibility and benefit amounts. Failure to report changes can result in overpayments you must repay.',
  },
]

// Schema.org structured data
const pageSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'US Federal Benefits Guide 2025',
  description:
    'Comprehensive guide to US federal benefits including Social Security, Medicare, Medicaid, SNAP, TANF, SSI, and more.',
  url: 'https://calculatesalary.co/benefits',
  mainEntity: {
    '@type': 'ItemList',
    numberOfItems: US_BENEFITS.length,
    itemListElement: US_BENEFITS.map((benefit, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'GovernmentService',
        name: benefit.name,
        description: benefit.shortDescription,
        url: `https://calculatesalary.co/benefits/${benefit.slug}`,
      },
    })),
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
}

function BenefitsContent() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category') as BenefitCategory | null

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<BenefitCategory | 'all'>(
    categoryParam || 'all'
  )

  const filteredBenefits = useMemo(() => {
    let results = US_BENEFITS

    if (searchQuery) {
      results = searchBenefits(searchQuery)
    }

    if (selectedCategory !== 'all') {
      results = results.filter((benefit) => benefit.category === selectedCategory)
    }

    return results
  }, [searchQuery, selectedCategory])

  const categories = Object.entries(BENEFIT_CATEGORIES) as [BenefitCategory, { label: string; description: string }][]

  return (
    <main className="container max-w-6xl py-8 md:py-12">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <Badge variant="secondary" className="mb-4">
          2025 Federal Benefits Guide
        </Badge>
        <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
          US Federal Benefits Guide
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Find federal benefits you may be entitled to. Over $600 billion in benefits go unclaimed each year.
          Use our comprehensive guide to check eligibility and learn how to apply.
        </p>
      </div>

      {/* Unclaimed Benefits Alert */}
      <Card className="mb-8 border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
        <CardContent className="flex items-start gap-4 pt-6">
          <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-800 dark:text-amber-200">
              Billions in Benefits Go Unclaimed
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              According to federal data, approximately 1 in 5 eligible workers don&apos;t claim the Earned Income Tax Credit,
              43% of eligible seniors miss out on SSI, and millions don&apos;t receive SNAP benefits they qualify for.
              Check below to see what you might be missing.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="mb-8">
        <UnclaimedBenefitsStats />
      </div>

      {/* Search and Filter */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search benefits (e.g., 'Medicare', 'food assistance', 'disability')"
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
          >
            All
          </Button>
          {categories.map(([key, { label }]) => (
            <Button
              key={key}
              variant={selectedCategory === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(key)}
              className="whitespace-nowrap"
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredBenefits.map((benefit) => (
          <Link key={benefit.slug} href={`/benefits/${benefit.slug}`}>
            <Card className="h-full rounded-2xl bg-card/60 dark:bg-card/40 ring-1 ring-border/50 transition-all hover:ring-primary/50 hover:shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg leading-tight">{benefit.name}</CardTitle>
                  <Badge variant="secondary" className="shrink-0 text-xs">
                    {BENEFIT_CATEGORIES[benefit.category].label}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {benefit.shortDescription}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-primary">{benefit.monthlyAmount}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {filteredBenefits.length === 0 && (
        <div className="mb-12 text-center py-12">
          <p className="text-muted-foreground">No benefits found matching your search.</p>
          <Button variant="link" onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>
            Clear filters
          </Button>
        </div>
      )}

      <InArticleAd />

      {/* Charts Section */}
      <div className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">Benefits Overview</h2>
        <div className="grid gap-6 lg:grid-cols-2">
          <BenefitAmountsChart />
          <BenefitCategoryChart />
        </div>
      </div>

      <div className="mb-12">
        <FederalPovertyLevelChart />
      </div>

      {/* Legacy/Outdated Benefits Warning */}
      <Card className="mb-12 rounded-2xl bg-card/60 dark:bg-card/40 ring-1 ring-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Important Notes About Benefits
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            <strong>COVID-era expansions have ended:</strong> Many benefits were temporarily expanded during the pandemic,
            including enhanced unemployment, expanded Child Tax Credit payments, and emergency SNAP increases. Most of
            these have returned to pre-pandemic levels.
          </p>
          <p>
            <strong>State variations:</strong> Many programs like Medicaid, TANF, and unemployment insurance are
            administered by states with significant variations in benefits and eligibility. The information here reflects
            federal guidelines - check your state&apos;s specific programs.
          </p>
          <p>
            <strong>Benefit amounts change annually:</strong> Social Security, SSI, SNAP, and many other programs adjust
            annually for cost of living. The amounts shown are for 2025 and will change in future years.
          </p>
        </CardContent>
      </Card>

      <InArticleAd />

      {/* FAQ Section */}
      <div className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">{item.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* SEO Content Section */}
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <h2>Understanding US Federal Benefits in 2025</h2>
        <p>
          The United States federal government operates dozens of benefit programs designed to help Americans
          with retirement, healthcare, disability, food security, housing, and more. These programs form the
          social safety net that supports over 100 million Americans.
        </p>

        <h3>Major Federal Benefit Categories</h3>
        <p>
          <strong>Social Security Programs</strong> - Social Security is the largest federal program, providing
          retirement benefits to over 50 million Americans, disability benefits through SSDI, and survivor benefits
          to families. The Social Security Administration also administers SSI for those with limited income and
          resources.
        </p>
        <p>
          <strong>Healthcare Programs</strong> - Medicare provides health insurance for 67 million seniors and
          disabled individuals, while Medicaid and CHIP cover over 90 million low-income Americans including
          children, pregnant women, seniors, and people with disabilities.
        </p>
        <p>
          <strong>Nutrition Programs</strong> - SNAP (formerly food stamps) serves over 42 million Americans,
          while WIC helps about 6 million pregnant women, infants, and young children. School meal programs
          feed 30 million children daily.
        </p>
        <p>
          <strong>Housing Assistance</strong> - Section 8 vouchers help 2.3 million households afford rent,
          though waiting lists are extremely long. LIHEAP helps with energy costs for about 6 million households.
        </p>
        <p>
          <strong>Tax Credits</strong> - The Earned Income Tax Credit and Child Tax Credit together provide
          over $100 billion annually to working families, making them among the most effective anti-poverty
          programs.
        </p>

        <h3>How to Apply for Benefits</h3>
        <p>
          Each program has its own application process. Social Security benefits are applied for through the
          Social Security Administration (ssa.gov). Healthcare coverage can be found through HealthCare.gov
          or your state&apos;s marketplace. SNAP and TANF applications go through your local human services office.
          Benefits.gov provides a comprehensive screening tool to help identify programs you may qualify for.
        </p>

        <h3>Why Benefits Go Unclaimed</h3>
        <p>
          Despite billions in available assistance, many eligible Americans don&apos;t receive benefits due to:
          lack of awareness about programs, complex application processes, stigma about receiving government
          assistance, and confusing eligibility rules. Our guide aims to simplify the process and help you
          understand what you may be entitled to receive.
        </p>
      </div>

      {/* Official Resources */}
      <Card className="mt-8 rounded-2xl bg-card/60 dark:bg-card/40 ring-1 ring-border/50">
        <CardHeader>
          <CardTitle>Official Government Resources</CardTitle>
          <CardDescription>
            Use these official websites for applications and detailed information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="https://www.benefits.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              Benefits.gov - Benefit Finder
            </Link>
            <Link
              href="https://www.ssa.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              Social Security Administration
            </Link>
            <Link
              href="https://www.healthcare.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              HealthCare.gov
            </Link>
            <Link
              href="https://www.fns.usda.gov/snap"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              USDA SNAP Information
            </Link>
            <Link
              href="https://www.va.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              VA Benefits
            </Link>
            <Link
              href="https://www.irs.gov/credits-deductions"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <ExternalLink className="h-4 w-4" />
              IRS Tax Credits
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

function BenefitsPageLoading() {
  return (
    <main className="container max-w-6xl py-8 md:py-12">
      <div className="mb-12 text-center">
        <div className="mx-auto mb-4 h-6 w-48 animate-pulse rounded bg-muted" />
        <div className="mx-auto mb-4 h-12 w-96 animate-pulse rounded bg-muted" />
        <div className="mx-auto h-6 w-80 animate-pulse rounded bg-muted" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-40 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
    </main>
  )
}

export default function BenefitsPage() {
  return (
    <SidebarLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Suspense fallback={<BenefitsPageLoading />}>
        <BenefitsContent />
      </Suspense>
    </SidebarLayout>
  )
}
