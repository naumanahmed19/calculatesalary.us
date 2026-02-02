import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SidebarLayout } from '@/components/sidebar-layout'
import { CapitalGainsTaxCalculator } from '@/components/capital-gains-tax-calculator'
import { TAX_YEAR, formatCurrency } from '@/lib/us-tax-calculator'
import { generateBreadcrumbSchema, BREADCRUMB_ITEMS } from '@/lib/breadcrumb-schema'
import { HeaderAd, MobileHeaderAd, InContentAd, FooterAd } from '@/components/ad-unit'
import { RelatedCalculators, taxCalculators } from '@/components/related-calculators'

const BASE_URL = 'https://calculatesalary.us'

interface PageProps {
  params: Promise<{ gain: string }>
}

// Common capital gain amounts for static generation
const CAPITAL_GAINS = [
  10000, 15000, 20000, 25000, 30000, 40000, 50000, 75000, 100000,
  150000, 200000, 250000, 300000, 400000, 500000
]

// 2025 US Long-Term Capital Gains Tax brackets (single filer)
const LTCG_BRACKETS = [
  { threshold: 47025, rate: 0 },
  { threshold: 518900, rate: 0.15 },
  { threshold: Infinity, rate: 0.20 },
]

// NIIT threshold
const NIIT_THRESHOLD = 200000
const NIIT_RATE = 0.038

function calculateUSCGT(grossGain: number, income: number, isLongTerm: boolean) {
  if (!isLongTerm) {
    // Short-term gains taxed as ordinary income - estimate at 22% bracket
    const marginalRate = income > 103350 ? 0.24 : income > 48475 ? 0.22 : 0.12
    let totalTax = grossGain * marginalRate

    // Add NIIT if applicable
    if (income + grossGain > NIIT_THRESHOLD) {
      const niitableAmount = Math.min(grossGain, income + grossGain - NIIT_THRESHOLD)
      totalTax += niitableAmount * NIIT_RATE
    }

    return {
      grossGain,
      taxableGain: grossGain,
      totalTax,
      effectiveRate: grossGain > 0 ? (totalTax / grossGain) * 100 : 0,
    }
  }

  // Long-term capital gains
  let totalTax = 0
  let remainingGain = grossGain
  let currentIncome = income

  for (const bracket of LTCG_BRACKETS) {
    if (remainingGain <= 0) break
    const spaceInBracket = Math.max(0, bracket.threshold - currentIncome)
    const amountInBracket = Math.min(remainingGain, spaceInBracket)

    if (amountInBracket > 0) {
      totalTax += amountInBracket * bracket.rate
      remainingGain -= amountInBracket
      currentIncome += amountInBracket
    }
  }

  // Remaining at top rate
  if (remainingGain > 0) {
    totalTax += remainingGain * LTCG_BRACKETS[LTCG_BRACKETS.length - 1].rate
  }

  // Add NIIT if applicable
  if (income + grossGain > NIIT_THRESHOLD) {
    const niitableAmount = Math.min(grossGain, income + grossGain - NIIT_THRESHOLD)
    totalTax += niitableAmount * NIIT_RATE
  }

  return {
    grossGain,
    taxableGain: grossGain,
    totalTax,
    effectiveRate: grossGain > 0 ? (totalTax / grossGain) * 100 : 0,
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
  const longTermCalc = calculateUSCGT(gain, 75000, true)
  const shortTermCalc = calculateUSCGT(gain, 75000, false)

  return {
    title: `Capital Gains Tax on ${formattedGain} | CGT Calculator ${TAX_YEAR}`,
    description: `Calculate US capital gains tax on ${formattedGain} gain. Long-term: ${formatCurrency(longTermCalc.totalTax, 0)} tax. Short-term: ${formatCurrency(shortTermCalc.totalTax, 0)} tax. See rates and holding period effects.`,
    keywords: [
      `capital gains tax on ${gain}`,
      `cgt on ${gain}`,
      `capital gains tax calculator`,
      `us capital gains tax rates ${TAX_YEAR}`,
      'long term capital gains',
      'short term capital gains',
      TAX_YEAR,
    ],
    openGraph: {
      title: `Capital Gains Tax on ${formattedGain}`,
      description: `Calculate US Capital Gains Tax on a ${formattedGain} profit for property, stocks, and other assets.`,
      type: 'website',
      locale: 'en_US',
    },
    alternates: {
      canonical: `${BASE_URL}/capital-gains-tax/${gain}`,
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

  // Calculate for different scenarios
  const longTermLow = calculateUSCGT(gain, 40000, true)
  const longTermMid = calculateUSCGT(gain, 100000, true)
  const longTermHigh = calculateUSCGT(gain, 250000, true)
  const shortTerm = calculateUSCGT(gain, 100000, false)

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
          text: `On a ${formattedGain} long-term gain, US federal CGT depends on your income. At $40k income: ${formatCurrency(longTermLow.totalTax, 0)}. At $100k income: ${formatCurrency(longTermMid.totalTax, 0)}. At $250k income: ${formatCurrency(longTermHigh.totalTax, 0)} (includes 3.8% NIIT).`,
        },
      },
      {
        '@type': 'Question',
        name: `What is short-term vs long-term tax on ${formattedGain}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Long-term gains (held 1+ year) are taxed at 0%, 15%, or 20%. Short-term gains are taxed as ordinary income (up to 37%). On ${formattedGain}: Long-term ~${formatCurrency(longTermMid.totalTax, 0)} vs Short-term ~${formatCurrency(shortTerm.totalTax, 0)} at $100k income.`,
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
                Your tax depends on holding period and income. Long-term CGT ranges from{' '}
                <span className="font-semibold text-foreground">
                  {formatCurrency(longTermLow.totalTax, 0)}
                </span>{' '}
                to{' '}
                <span className="font-semibold text-foreground">
                  {formatCurrency(longTermHigh.totalTax, 0)}
                </span>{' '}
                depending on your income level.
              </p>
            </div>
          </div>
        </section>

        {/* Quick Summary */}
        <section className="py-8 bg-muted/30 border-b border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-lg font-semibold text-center mb-4">CGT on {formattedGain} by Holding Period & Income</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="rounded-xl bg-emerald-500/10 p-4 text-center ring-1 ring-emerald-500/20">
                  <div className="text-xs text-muted-foreground">Long-term (0% rate)</div>
                  <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(longTermLow.totalTax, 0)}</div>
                  <div className="text-xs text-muted-foreground">Income under $47k</div>
                </div>
                <div className="rounded-xl bg-card/60 p-4 text-center ring-1 ring-border/50">
                  <div className="text-xs text-muted-foreground">Long-term (15% rate)</div>
                  <div className="text-lg font-bold text-foreground">{formatCurrency(longTermMid.totalTax, 0)}</div>
                  <div className="text-xs text-muted-foreground">$100k income</div>
                </div>
                <div className="rounded-xl bg-accent/10 p-4 text-center ring-1 ring-accent/20">
                  <div className="text-xs text-muted-foreground">Long-term + NIIT</div>
                  <div className="text-lg font-bold text-accent">{formatCurrency(longTermHigh.totalTax, 0)}</div>
                  <div className="text-xs text-muted-foreground">$250k income</div>
                </div>
                <div className="rounded-xl bg-amber-500/10 p-4 text-center ring-1 ring-amber-500/20">
                  <div className="text-xs text-muted-foreground">Short-term</div>
                  <div className="text-lg font-bold text-amber-600 dark:text-amber-400">{formatCurrency(shortTerm.totalTax, 0)}</div>
                  <div className="text-xs text-muted-foreground">As ordinary income</div>
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
                <h3 className="font-semibold text-foreground mb-3">Long-Term CGT on {formattedGain}</h3>
                <p className="text-sm text-muted-foreground">
                  If you held the asset for more than one year, you qualify for preferential long-term rates.
                  On a {formattedGain} gain, you&apos;d pay {formatCurrency(longTermLow.totalTax, 0)} at 0% rate (low income),{' '}
                  {formatCurrency(longTermMid.totalTax, 0)} at 15% rate (middle income), or{' '}
                  {formatCurrency(longTermHigh.totalTax, 0)} at 20% + NIIT (high income).
                </p>
              </div>

              <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                <h3 className="font-semibold text-foreground mb-3">Short-Term CGT on {formattedGain}</h3>
                <p className="text-sm text-muted-foreground">
                  Assets held one year or less are taxed at ordinary income rates (10-37%). On {formattedGain},
                  you&apos;d pay approximately {formatCurrency(shortTerm.totalTax, 0)} at the 22% bracket.
                  Consider holding assets longer than one year to save on taxes.
                </p>
              </div>

              <div className="rounded-2xl bg-emerald-600/10 dark:bg-emerald-500/10 p-6 ring-1 ring-emerald-600/20">
                <h3 className="font-semibold text-emerald-700 dark:text-emerald-400 mb-3">
                  Reduce Your CGT Bill
                </h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Hold assets longer than one year for preferential rates</li>
                  <li>• Offset gains with capital losses from other investments</li>
                  <li>• Use primary residence exclusion ($250k single / $500k married)</li>
                  <li>• Contribute to tax-advantaged accounts (401k, IRA) to lower income</li>
                  <li>• Consider tax-loss harvesting at year-end</li>
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
                  const calc = calculateUSCGT(g, 100000, true)
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
