import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SidebarLayout } from '@/components/sidebar-layout'
import { CapitalGainsTaxCalculator } from '@/components/capital-gains-tax-calculator'
import { TAX_YEAR, formatCurrency } from '@/lib/us-tax-calculator'
import { generateBreadcrumbSchema, BREADCRUMB_ITEMS } from '@/lib/breadcrumb-schema'
import { HeaderAd, MobileHeaderAd, InContentAd, FooterAd } from '@/components/ad-unit'
import { RelatedCalculators, taxCalculators } from '@/components/related-calculators'

interface PageProps {
  params: Promise<{ gain: string }>
}

// Common capital gain amounts for static generation
const CAPITAL_GAINS = [
  10000, 15000, 20000, 25000, 30000, 40000, 50000, 75000, 100000,
  150000, 200000, 250000, 300000, 400000, 500000
]

// 2025/26 CGT rates and allowances
const ANNUAL_EXEMPTION = 3000
const BASIC_RATE_THRESHOLD = 50270
const PROPERTY_BASIC_RATE = 0.18
const PROPERTY_HIGHER_RATE = 0.24
const SHARES_BASIC_RATE = 0.10
const SHARES_HIGHER_RATE = 0.20

function calculateCGT(grossGain: number, income: number, assetType: 'property' | 'shares') {
  const taxableGain = Math.max(0, grossGain - ANNUAL_EXEMPTION)
  const basicRateBandRemaining = Math.max(0, BASIC_RATE_THRESHOLD - income)

  const basicRate = assetType === 'property' ? PROPERTY_BASIC_RATE : SHARES_BASIC_RATE
  const higherRate = assetType === 'property' ? PROPERTY_HIGHER_RATE : SHARES_HIGHER_RATE

  let taxAtBasicRate = 0
  let taxAtHigherRate = 0

  if (taxableGain > 0) {
    if (basicRateBandRemaining >= taxableGain) {
      taxAtBasicRate = taxableGain * basicRate
    } else if (basicRateBandRemaining > 0) {
      taxAtBasicRate = basicRateBandRemaining * basicRate
      taxAtHigherRate = (taxableGain - basicRateBandRemaining) * higherRate
    } else {
      taxAtHigherRate = taxableGain * higherRate
    }
  }

  return {
    grossGain,
    taxableGain,
    totalTax: taxAtBasicRate + taxAtHigherRate,
    effectiveRate: taxableGain > 0 ? ((taxAtBasicRate + taxAtHigherRate) / grossGain) * 100 : 0,
  }
}

export async function generateStaticParams() {
  return CAPITAL_GAINS.map((gain) => ({
    gain: gain.toString(),
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { gain: gainParam } = await params
  const gain = parseInt(gainParam, 10)

  if (isNaN(gain) || gain <= 0 || gain > 10000000) {
    return { title: 'Invalid Gain' }
  }

  const formattedGain = formatCurrency(gain, 0)
  const propertyCalc = calculateCGT(gain, 50000, 'property')
  const sharesCalc = calculateCGT(gain, 50000, 'shares')

  return {
    title: `Capital Gains Tax on ${formattedGain} Profit | CGT Calculator ${TAX_YEAR}`,
    description: `Calculate CGT on ${formattedGain} gain. Property: ${formatCurrency(propertyCalc.totalTax, 0)} tax. Shares: ${formatCurrency(sharesCalc.totalTax, 0)} tax. See rates and annual exemption.`,
    keywords: [
      `capital gains tax on ${gain}`,
      `cgt on ${gain}`,
      `capital gains tax calculator`,
      `cgt rates ${TAX_YEAR}`,
      'capital gains tax property',
      'capital gains tax shares',
      TAX_YEAR,
    ],
    openGraph: {
      title: `Capital Gains Tax on ${formattedGain}`,
      description: `Calculate Capital Gains Tax on a ${formattedGain} profit for property, shares, and other assets.`,
      type: 'website',
      locale: 'en_GB',
    },
    alternates: {
      canonical: `/capital-gains-tax/${gain}`,
    },
  }
}

export default async function CapitalGainsTaxGainPage({ params }: PageProps) {
  const { gain: gainParam } = await params
  const gain = parseInt(gainParam, 10)

  if (isNaN(gain) || gain <= 0 || gain > 10000000) {
    notFound()
  }

  const formattedGain = formatCurrency(gain, 0)

  // Calculate for different scenarios (assuming £50k income)
  const propertyBasic = calculateCGT(gain, 30000, 'property')
  const propertyHigher = calculateCGT(gain, 60000, 'property')
  const sharesBasic = calculateCGT(gain, 30000, 'shares')
  const sharesHigher = calculateCGT(gain, 60000, 'shares')

  const breadcrumbSchema = generateBreadcrumbSchema([
    BREADCRUMB_ITEMS.home,
    BREADCRUMB_ITEMS.capitalGainsTax,
    { name: `${formattedGain} Gain`, href: `/capital-gains-tax/${gain}` },
  ])

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How much Capital Gains Tax on ${formattedGain}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `On a ${formattedGain} gain, after the £3,000 annual exemption, CGT depends on your income and asset type. For property: ${formatCurrency(propertyBasic.totalTax, 0)} (basic rate) to ${formatCurrency(propertyHigher.totalTax, 0)} (higher rate). For shares: ${formatCurrency(sharesBasic.totalTax, 0)} to ${formatCurrency(sharesHigher.totalTax, 0)}.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the taxable gain on ${formattedGain}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `After the £3,000 annual exemption, your taxable gain would be ${formatCurrency(Math.max(0, gain - ANNUAL_EXEMPTION), 0)}.`,
        },
      },
    ],
  }

  const relatedGains = CAPITAL_GAINS.filter(g => g !== gain).slice(0, 6)

  return (
    <SidebarLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="flex-1">
        <HeaderAd />
        <MobileHeaderAd />

        {/* Hero */}
        <section className="py-12 md:py-16 border-b border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-flex items-center rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent mb-6">
                {TAX_YEAR} Tax Year
              </span>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground text-balance mb-4">
                Capital Gains Tax on {formattedGain}
              </h1>
              <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
                After the £3,000 annual exemption, your taxable gain is{' '}
                <span className="font-semibold text-foreground">
                  {formatCurrency(Math.max(0, gain - ANNUAL_EXEMPTION), 0)}
                </span>.
                CGT ranges from {formatCurrency(sharesBasic.totalTax, 0)} to {formatCurrency(propertyHigher.totalTax, 0)} depending on asset type and income.
              </p>
            </div>
          </div>
        </section>

        {/* Quick Summary */}
        <section className="py-8 bg-muted/30 border-b border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-lg font-semibold text-center mb-4">CGT on {formattedGain} by Asset Type & Tax Band</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="rounded-xl bg-card/60 p-4 text-center ring-1 ring-border/50">
                  <div className="text-xs text-muted-foreground">Property (Basic)</div>
                  <div className="text-lg font-bold text-foreground">{formatCurrency(propertyBasic.totalTax, 0)}</div>
                  <div className="text-xs text-muted-foreground">18% rate</div>
                </div>
                <div className="rounded-xl bg-accent/10 p-4 text-center ring-1 ring-accent/20">
                  <div className="text-xs text-muted-foreground">Property (Higher)</div>
                  <div className="text-lg font-bold text-accent">{formatCurrency(propertyHigher.totalTax, 0)}</div>
                  <div className="text-xs text-muted-foreground">24% rate</div>
                </div>
                <div className="rounded-xl bg-card/60 p-4 text-center ring-1 ring-border/50">
                  <div className="text-xs text-muted-foreground">Shares (Basic)</div>
                  <div className="text-lg font-bold text-foreground">{formatCurrency(sharesBasic.totalTax, 0)}</div>
                  <div className="text-xs text-muted-foreground">10% rate</div>
                </div>
                <div className="rounded-xl bg-card/60 p-4 text-center ring-1 ring-border/50">
                  <div className="text-xs text-muted-foreground">Shares (Higher)</div>
                  <div className="text-lg font-bold text-foreground">{formatCurrency(sharesHigher.totalTax, 0)}</div>
                  <div className="text-xs text-muted-foreground">20% rate</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Calculator */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <CapitalGainsTaxCalculator initialGain={gain} />
          </div>
        </section>

        <InContentAd />

        {/* Info Cards */}
        <section className="py-12 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                <h3 className="font-semibold text-foreground mb-3">CGT on {formattedGain} Property Gain</h3>
                <p className="text-sm text-muted-foreground">
                  For a {formattedGain} gain on a second home or buy-to-let property, you&apos;ll pay{' '}
                  {formatCurrency(propertyBasic.totalTax, 0)} (basic rate taxpayer) or{' '}
                  {formatCurrency(propertyHigher.totalTax, 0)} (higher rate taxpayer).
                  Remember to report and pay within 60 days of completion.
                </p>
              </div>

              <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                <h3 className="font-semibold text-foreground mb-3">CGT on {formattedGain} Share Profit</h3>
                <p className="text-sm text-muted-foreground">
                  For {formattedGain} profit on shares or investments, CGT is lower:{' '}
                  {formatCurrency(sharesBasic.totalTax, 0)} (basic rate) or{' '}
                  {formatCurrency(sharesHigher.totalTax, 0)} (higher rate).
                  Gains within ISAs are completely tax-free.
                </p>
              </div>

              <div className="rounded-2xl bg-emerald-600/10 dark:bg-emerald-500/10 p-6 ring-1 ring-emerald-600/20">
                <h3 className="font-semibold text-emerald-700 dark:text-emerald-400 mb-3">
                  💡 Reduce Your CGT Bill
                </h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Use your £3,000 annual exemption (already applied above)</li>
                  <li>• Transfer assets to your spouse to use their exemption too</li>
                  <li>• Offset losses from other disposals against gains</li>
                  <li>• Deduct allowable costs: legal fees, agent fees, improvements</li>
                  <li>• Time sales across tax years to maximise exemptions</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Related Gains */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl font-bold text-foreground mb-6 text-center">
                CGT on Other Gain Amounts
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {relatedGains.map((g) => {
                  const calc = calculateCGT(g, 50000, 'property')
                  return (
                    <Link
                      key={g}
                      href={`/capital-gains-tax/${g}`}
                      className="rounded-xl bg-card/60 p-4 text-center ring-1 ring-border/50 hover:ring-accent/50 transition-all"
                    >
                      <div className="text-sm text-muted-foreground">Gain</div>
                      <div className="font-semibold text-foreground">{formatCurrency(g, 0)}</div>
                      <div className="text-xs text-accent mt-1">CGT from {formatCurrency(calc.totalTax, 0)}</div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        <RelatedCalculators calculators={taxCalculators} />
        <FooterAd />
      </main>
    </SidebarLayout>
  )
}
