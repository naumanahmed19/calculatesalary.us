"use client"

import { useState, useMemo, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { SidebarLayout } from "@/components/sidebar-layout"
import { RelatedCalculators, salaryCalculators } from "@/components/related-calculators"
import { HeaderAd, MobileHeaderAd, InContentAd, InArticleAd, FooterAd } from "@/components/ad-unit"
import { Input } from "@/components/ui/input"
import {
  US_BENEFITS,
  BENEFIT_CATEGORIES,
  getBenefitsByCategory,
  searchBenefits,
  getAllCategories,
  type BenefitCategory,
} from "@/lib/benefits/us-benefits-data"
import {
  BenefitAmountsChart,
  BenefitCategoryChart,
  UnclaimedBenefitsStats,
} from "@/components/benefits-charts"
import {
  ArrowRight,
  HandCoins,
  Search,
  X,
  HelpCircle,
  AlertTriangle,
  Calendar,
} from "lucide-react"
import Link from "next/link"

const validCategories: BenefitCategory[] = ['retirement', 'disability', 'healthcare', 'food', 'family', 'housing', 'tax-credits', 'unemployment', 'veterans']

// Schema.org structured data for SEO
const collectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "US Federal Benefits Guide 2025",
  description: "Complete guide to US federal benefits including Social Security, Medicare, Medicaid, SNAP, and more.",
  url: "https://calculatesalary.co/benefits",
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: US_BENEFITS.length,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Social Security Retirement", url: "https://calculatesalary.co/benefits/social-security-retirement" },
      { "@type": "ListItem", position: 2, name: "Medicare", url: "https://calculatesalary.co/benefits/medicare" },
      { "@type": "ListItem", position: 3, name: "SNAP (Food Stamps)", url: "https://calculatesalary.co/benefits/snap" },
      { "@type": "ListItem", position: 4, name: "Medicaid", url: "https://calculatesalary.co/benefits/medicaid" },
      { "@type": "ListItem", position: 5, name: "Earned Income Tax Credit", url: "https://calculatesalary.co/benefits/earned-income-tax-credit" },
    ],
  },
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What federal benefits can I claim in the US?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Major US federal benefits include Social Security (retirement, disability, survivors), Medicare and Medicaid for healthcare, SNAP (food stamps) for nutrition assistance, housing vouchers, TANF for families, and tax credits like EITC and Child Tax Credit. Eligibility depends on your age, income, disability status, and family situation.",
      },
    },
    {
      "@type": "Question",
      name: "How much is Social Security in 2025?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The maximum Social Security retirement benefit in 2025 is $4,873 per month for someone claiming at age 70. The average retirement benefit is about $1,976 per month. Benefits received a 2.5% cost-of-living adjustment (COLA) for 2025.",
      },
    },
    {
      "@type": "Question",
      name: "What is the federal poverty level for 2025?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The 2025 federal poverty level (FPL) is $15,060 per year for a single person and $31,200 for a family of four in the 48 contiguous states. Many benefit programs use percentages of FPL (like 130% or 185%) to determine eligibility.",
      },
    },
    {
      "@type": "Question",
      name: "How do I apply for federal benefits?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most federal benefits can be applied for online. Social Security benefits are applied for at ssa.gov. Healthcare coverage can be found at HealthCare.gov. SNAP applications go through your state agency. Benefits.gov provides a screening tool to help identify programs you may qualify for.",
      },
    },
  ],
}

// Inner component that uses useSearchParams
function BenefitsContent() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<BenefitCategory | null>(null)

  // Handle category from URL query parameter
  useEffect(() => {
    const categoryParam = searchParams.get('category')
    if (categoryParam && validCategories.includes(categoryParam as BenefitCategory)) {
      setSelectedCategory(categoryParam as BenefitCategory)
    }
  }, [searchParams])

  const filteredBenefits = useMemo(() => {
    let results = searchQuery ? searchBenefits(searchQuery) : US_BENEFITS
    if (selectedCategory) {
      results = results.filter(b => b.category === selectedCategory)
    }
    return results
  }, [searchQuery, selectedCategory])

  const categories = getAllCategories()

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory(null)
  }

  const hasActiveFilters = searchQuery || selectedCategory

  return (
    <main id="main-content" className="flex-1">
      <HeaderAd />
      <MobileHeaderAd />

        {/* Hero Section */}
        <section className="py-12 md:py-16 border-b border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-flex items-center rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent mb-6">
                <HandCoins className="h-3 w-3 mr-1" />
                {US_BENEFITS.length} US Federal Benefits & Programs
              </span>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground text-balance mb-4">
                US Benefits Guide
              </h1>
              <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto mb-8">
                Find out what federal benefits you could be entitled to. Search from {US_BENEFITS.length} government
                programs including Social Security, Medicare, SNAP, and more.
              </p>

              {/* Search Bar */}
              <div className="max-w-xl mx-auto relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search benefits... (e.g., 'Medicare', 'disability', 'food')"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-10 py-6 text-lg rounded-xl bg-background border-border/60 focus:ring-2 focus:ring-accent/50"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-6 bg-muted/30 border-b border-border/40">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  !selectedCategory
                    ? "bg-accent text-accent-foreground"
                    : "bg-background hover:bg-muted border border-border/60"
                }`}
              >
                All Benefits
              </button>
              {categories.map((cat) => {
                const catInfo = BENEFIT_CATEGORIES[cat]
                const Icon = catInfo.icon
                const count = getBenefitsByCategory(cat).length
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === cat
                        ? "bg-accent text-accent-foreground"
                        : "bg-background hover:bg-muted border border-border/60"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${selectedCategory !== cat ? catInfo.color : ""}`} />
                    {catInfo.name.replace(' Benefits', '').replace(' Assistance', '')}
                    <span className="text-xs opacity-70">({count})</span>
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {/* Results Info */}
        {hasActiveFilters && (
          <section className="py-4 border-b border-border/40">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between max-w-5xl mx-auto">
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-medium text-foreground">{filteredBenefits.length}</span> of{" "}
                  {US_BENEFITS.length} benefits
                  {searchQuery && <span> for &quot;{searchQuery}&quot;</span>}
                  {selectedCategory && (
                    <span> in {BENEFIT_CATEGORIES[selectedCategory].name}</span>
                  )}
                </p>
                <button
                  onClick={clearFilters}
                  className="text-sm text-accent hover:underline"
                >
                  Clear filters
                </button>
              </div>
            </div>
          </section>
        )}

        <InContentAd />

        {/* Benefits Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              {filteredBenefits.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground mb-4">
                    No benefits found matching your search.
                  </p>
                  <button
                    onClick={clearFilters}
                    className="text-accent hover:underline"
                  >
                    Clear filters and show all benefits
                  </button>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredBenefits.map((benefit) => {
                    const catInfo = BENEFIT_CATEGORIES[benefit.category]
                    const Icon = benefit.icon
                    return (
                      <Link
                        key={benefit.slug}
                        href={`/benefits/${benefit.slug}`}
                        className="group"
                      >
                        <div className="h-full rounded-2xl bg-card/60 dark:bg-card/40 p-5 ring-1 ring-border/50 transition-all hover:ring-accent/50">
                          <div className="flex items-start justify-between gap-2 mb-3">
                            <div className="flex items-start gap-3">
                              <div className={`rounded-xl bg-muted p-2 ${catInfo.color}`}>
                                <Icon className="h-5 w-5" />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-base font-semibold text-foreground group-hover:text-accent transition-colors leading-tight">
                                  {benefit.name}
                                </h3>
                                <span className="inline-flex items-center rounded-full border border-border/60 px-2 py-0.5 text-xs text-muted-foreground mt-1.5">
                                  {catInfo.name.replace(' Benefits', '').replace(' Assistance', '')}
                                </span>
                              </div>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {benefit.shortDescription}
                          </p>
                          {benefit.monthlyAmount && (
                            <div className="text-sm">
                              <span className="text-muted-foreground">Amount: </span>
                              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                                {benefit.monthlyAmount}
                              </span>
                            </div>
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="py-8 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
              <div className="rounded-xl bg-card/60 dark:bg-card/40 p-4 ring-1 ring-border/50">
                <div className="text-sm text-muted-foreground">Total Benefits</div>
                <div className="text-3xl font-bold text-foreground">{US_BENEFITS.length}</div>
              </div>
              <div className="rounded-xl bg-card/60 dark:bg-card/40 p-4 ring-1 ring-border/50">
                <div className="text-sm text-muted-foreground">Categories</div>
                <div className="text-3xl font-bold text-foreground">{categories.length}</div>
              </div>
              <div className="rounded-xl bg-card/60 dark:bg-card/40 p-4 ring-1 ring-border/50">
                <div className="text-sm text-muted-foreground">Healthcare Programs</div>
                <div className="text-3xl font-bold text-foreground">{getBenefitsByCategory('healthcare').length}</div>
              </div>
              <div className="rounded-xl bg-card/60 dark:bg-card/40 p-4 ring-1 ring-border/50">
                <div className="text-sm text-muted-foreground">Food Assistance</div>
                <div className="text-3xl font-bold text-foreground">{getBenefitsByCategory('food').length}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Category Overview */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-6">Browse by Category</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((cat) => {
                  const catInfo = BENEFIT_CATEGORIES[cat]
                  const Icon = catInfo.icon
                  const benefits = getBenefitsByCategory(cat)
                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat)
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }}
                      className="text-left group"
                    >
                      <div className="h-full rounded-2xl bg-card/60 dark:bg-card/40 p-5 ring-1 ring-border/50 transition-all hover:ring-accent/50">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`rounded-xl bg-muted p-2.5 ${catInfo.color}`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
                              {catInfo.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {benefits.length} program{benefits.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {catInfo.description}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Benefit Statistics Charts */}
        <section className="py-12 bg-muted/30 border-t border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-2 text-center">
                US Benefit Rates 2025
              </h2>
              <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
                Compare current benefit amounts and see how they&apos;re distributed across categories.
                All rates are for 2025.
              </p>
              <div className="grid gap-6 lg:grid-cols-2">
                <BenefitAmountsChart />
                <BenefitCategoryChart />
              </div>
            </div>
          </div>
        </section>

        {/* Unclaimed Benefits Alert */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-2 mb-6">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <h2 className="text-2xl font-bold text-foreground">
                  Are You Missing Out?
                </h2>
              </div>
              <UnclaimedBenefitsStats />
            </div>
          </div>
        </section>

        <InArticleAd />

        {/* Important Notice */}
        <section className="py-8 bg-blue-50 dark:bg-blue-900/10 border-y border-blue-200 dark:border-blue-800">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-start gap-4">
                <Calendar className="h-6 w-6 text-blue-500 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Important: 2025 Benefit Updates
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Many federal benefits received a <strong>2.5% cost-of-living adjustment (COLA)</strong> for 2025.
                    This includes Social Security, SSI, SNAP, and VA benefits. Key changes for 2025:
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {['Social Security COLA: 2.5%', 'Medicare Part B: $185/month', 'SSI max: $967/month', 'SNAP max (single): $292', 'EITC max: $7,830', 'Child Tax Credit: $2,000'].map((item) => (
                      <div key={item} className="text-sm bg-white/60 dark:bg-background/40 rounded-lg px-3 py-2 text-foreground">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-2 mb-8">
                <HelpCircle className="h-5 w-5 text-accent" />
                <h2 className="text-2xl font-bold text-foreground">
                  Frequently Asked Questions
                </h2>
              </div>
              <div className="space-y-4">
                {faqSchema.mainEntity.map((faq, index) => (
                  <div key={index} className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                    <h3 className="font-semibold text-foreground mb-3">{faq.name}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {faq.acceptedAnswer.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Detailed SEO Content */}
        <section className="py-12 bg-muted/30 border-t border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Complete Guide to US Federal Benefits 2025
              </h2>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p>
                  The US federal government operates dozens of benefit programs designed to help Americans
                  with retirement, healthcare, disability, food security, housing, and more. These programs
                  form the social safety net that supports over 100 million Americans.
                </p>

                <h3>How the US Benefits System Works</h3>
                <p>
                  Federal benefits are administered by various agencies including the Social Security Administration (SSA),
                  Centers for Medicare & Medicaid Services (CMS), Department of Agriculture (USDA), and Department of
                  Housing and Urban Development (HUD). <strong>Social Security</strong> is the largest program, providing
                  retirement, disability, and survivor benefits to over 70 million Americans.
                </p>
                <p>
                  Benefits are either <strong>means-tested</strong> (based on your income and assets) or
                  <strong> non-means-tested</strong> (based on age, disability, or work history). Programs like
                  Social Security retirement and Medicare are earned through work and payroll taxes.
                </p>

                <h3>Key Benefit Amounts for 2025</h3>
                <ul>
                  <li><strong>Social Security (max at 70):</strong> $4,873/month ($58,476/year)</li>
                  <li><strong>Medicare Part B premium:</strong> $185/month standard</li>
                  <li><strong>SSI (individual):</strong> $967/month ($11,604/year)</li>
                  <li><strong>SNAP (single person max):</strong> $292/month</li>
                  <li><strong>EITC (3+ children max):</strong> $7,830/year</li>
                  <li><strong>Child Tax Credit:</strong> Up to $2,000 per child</li>
                </ul>

                <h3>Who Can Claim Benefits?</h3>
                <p>
                  Benefits eligibility depends on various factors including your age, health,
                  employment status, family situation, and finances. Common eligibility requirements include:
                </p>
                <ul>
                  <li>Being a US citizen or qualified immigrant</li>
                  <li>Meeting income and asset limits for means-tested programs</li>
                  <li>Having sufficient work credits for Social Security and Medicare</li>
                  <li>Meeting specific criteria for disability, family, or veteran benefits</li>
                </ul>

                <h3>How to Claim Benefits</h3>
                <p>
                  Most benefits can now be applied for online:
                </p>
                <ol>
                  <li>Check your eligibility at Benefits.gov or the program&apos;s official website</li>
                  <li>Gather required documents (ID, proof of income, Social Security numbers)</li>
                  <li>Complete the online application or visit a local office</li>
                  <li>Attend any required interviews or assessments</li>
                  <li>Provide additional documentation if requested</li>
                </ol>

                <h3>Using Benefits Calculator Tools</h3>
                <p>
                  Use our <Link href="/" className="text-accent hover:underline">salary calculator</Link> to
                  understand your overall income, including how benefits might supplement your earnings from employment.
                  Many working families qualify for programs like EITC, SNAP, and Medicaid even with employment income.
                </p>
              </div>
            </div>
          </div>
        </section>

        <RelatedCalculators title="Related Tools" calculators={salaryCalculators} />

        <FooterAd />
    </main>
  )
}

// Main page component with Suspense boundary
export default function BenefitsPage() {
  return (
    <SidebarLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Suspense fallback={
        <main id="main-content" className="flex-1">
          <div className="py-12 md:py-16 border-b border-border/40">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <div className="h-8 w-48 bg-muted animate-pulse rounded-full mx-auto mb-6" />
                <div className="h-12 w-96 bg-muted animate-pulse rounded mx-auto mb-4" />
                <div className="h-6 w-80 bg-muted animate-pulse rounded mx-auto" />
              </div>
            </div>
          </div>
        </main>
      }>
        <BenefitsContent />
      </Suspense>
    </SidebarLayout>
  )
}
