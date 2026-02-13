import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SidebarLayout } from '@/components/sidebar-layout'
import { CapitalGainsTaxCalculator } from '@/components/capital-gains-tax-calculator'
import { TAX_YEAR, formatCurrency } from '@/lib/us-tax-calculator'
import { generateBreadcrumbSchema, BREADCRUMB_ITEMS } from '@/lib/breadcrumb-schema'
import { HeaderAd, MobileHeaderAd, InContentAd, FooterAd } from '@/components/ad-unit'
import { RelatedCalculators, taxCalculators } from '@/components/related-calculators'
import { AlertTriangle, CheckCircle, DollarSign, Lightbulb, TrendingUp, Clock } from 'lucide-react'

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

// 0% bracket threshold for insights
const ZERO_BRACKET_THRESHOLD = 47025

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

// Get gain-specific insights based on the amount
function getGainInsights(gain: number): { title: string; description: string; tips: string[]; icon: 'success' | 'info' | 'warning' } {
  if (gain <= 3000) {
    return {
      title: 'Potential Tax-Loss Harvesting Opportunity',
      description: `A ${formatCurrency(gain, 0)} gain can easily be offset by harvesting losses from other investments. The IRS allows you to deduct up to $3,000 of net capital losses against ordinary income each year.`,
      tips: [
        'Review your portfolio for positions with unrealized losses',
        'Consider tax-loss harvesting before year-end',
        'Unused losses can be carried forward indefinitely',
        'Wait 31 days before repurchasing to avoid wash sale rules'
      ],
      icon: 'success'
    }
  } else if (gain <= ZERO_BRACKET_THRESHOLD) {
    return {
      title: '0% Tax Rate May Apply',
      description: `A ${formatCurrency(gain, 0)} gain may qualify for 0% long-term capital gains tax if your total taxable income stays under $47,025 (single) or $94,050 (married filing jointly). This is a significant tax planning opportunity.`,
      tips: [
        'Hold investments for at least one year to qualify for 0% rate',
        'Time your sale to a year with lower income if possible',
        'Maximize 401(k) and IRA contributions to reduce taxable income',
        'Married couples can double the 0% bracket threshold'
      ],
      icon: 'success'
    }
  } else if (gain <= 100000) {
    return {
      title: 'Strategic Tax Planning Recommended',
      description: `With a ${formatCurrency(gain, 0)} gain, tax planning becomes important. Most filers will pay 15% long-term CGT, but strategic timing and loss harvesting can significantly reduce your tax bill.`,
      tips: [
        'Consider spreading large gains across multiple tax years',
        'Harvest losses to offset a portion of your gains',
        'Contribute to retirement accounts to stay in lower brackets',
        'For real estate, explore 1031 exchange opportunities'
      ],
      icon: 'info'
    }
  } else if (gain <= 250000) {
    return {
      title: 'NIIT Threshold Consideration',
      description: `A ${formatCurrency(gain, 0)} gain may trigger the 3.8% Net Investment Income Tax (NIIT) if your modified AGI exceeds $200,000 (single) or $250,000 (married). Factor this into your planning.`,
      tips: [
        'Calculate if NIIT applies to your total investment income',
        'Consider tax-advantaged investments (municipal bonds, etc.)',
        'Qualified Opportunity Zone investments can defer/reduce CGT',
        'Charitable remainder trusts can help manage large gains'
      ],
      icon: 'warning'
    }
  } else {
    return {
      title: 'Professional Tax Advice Strongly Recommended',
      description: `A ${formatCurrency(gain, 0)} gain creates a significant tax liability. Professional advice can help you explore advanced strategies like installment sales, opportunity zone investments, or charitable planning.`,
      tips: [
        'Consult a CPA or tax attorney before selling',
        'Explore Qualified Opportunity Zone deferrals (up to 2047)',
        'Consider charitable giving strategies (donor-advised funds, CRTs)',
        'Installment sales can spread gains over multiple years'
      ],
      icon: 'warning'
    }
  }
}

export const revalidate = false

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
  const insights = getGainInsights(gain)

  // Calculate for different scenarios
  const longTermLow = calculateUSCGT(gain, 40000, true)
  const longTermMid = calculateUSCGT(gain, 100000, true)
  const longTermHigh = calculateUSCGT(gain, 250000, true)
  const shortTerm = calculateUSCGT(gain, 100000, false)

  // Calculate what you keep after tax
  const keepLongTermLow = gain - longTermLow.totalTax
  const keepLongTermMid = gain - longTermMid.totalTax
  const keepLongTermHigh = gain - longTermHigh.totalTax
  const keepShortTerm = gain - shortTerm.totalTax

  // Real-world example: stock investment
  const examplePurchasePrice = Math.round(gain * 2.5)
  const exampleSalePrice = examplePurchasePrice + gain
  const exampleTaxLongTerm = longTermMid.totalTax
  const exampleNetProfit = gain - exampleTaxLongTerm

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
      {
        '@type': 'Question',
        name: `How much do I keep from a ${formattedGain} capital gain?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `From a ${formattedGain} long-term gain, you keep: ${formatCurrency(keepLongTermLow, 0)} (0% bracket), ${formatCurrency(keepLongTermMid, 0)} (15% bracket), or ${formatCurrency(keepLongTermHigh, 0)} (20% + NIIT bracket). Short-term gains at $100k income leave you with approximately ${formatCurrency(keepShortTerm, 0)}.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the Net Investment Income Tax on ${formattedGain}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The 3.8% NIIT applies to the lesser of your net investment income or MAGI exceeding $200,000 (single). On a ${formattedGain} gain with $250k income, NIIT adds ${formatCurrency(gain * NIIT_RATE, 0)} to your federal tax bill.`,
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

        {/* Gain-Specific Insights */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className={`rounded-2xl p-6 ring-1 ${
                insights.icon === 'success'
                  ? 'bg-emerald-500/10 ring-emerald-500/20'
                  : insights.icon === 'warning'
                  ? 'bg-amber-500/10 ring-amber-500/20'
                  : 'bg-blue-500/10 ring-blue-500/20'
              }`}>
                <div className="flex items-start gap-4">
                  <div className={`rounded-full p-2 ${
                    insights.icon === 'success'
                      ? 'bg-emerald-500/20'
                      : insights.icon === 'warning'
                      ? 'bg-amber-500/20'
                      : 'bg-blue-500/20'
                  }`}>
                    {insights.icon === 'success' ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    ) : insights.icon === 'warning' ? (
                      <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    ) : (
                      <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold mb-2 ${
                      insights.icon === 'success'
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : insights.icon === 'warning'
                        ? 'text-amber-700 dark:text-amber-400'
                        : 'text-blue-700 dark:text-blue-400'
                    }`}>
                      {insights.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {insights.description}
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {insights.tips.map((tip, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-accent">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
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

        {/* What You Keep After CGT */}
        <section className="py-12 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl font-bold text-foreground mb-6 text-center">
                What You Keep from a {formattedGain} Gain
              </h2>
              <p className="text-sm text-muted-foreground text-center mb-6">
                After federal CGT, here&apos;s what stays in your pocket (excluding state taxes)
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Long-Term Gains */}
                <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="font-semibold text-foreground">Long-Term (1+ Year)</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <div>
                        <div className="text-sm font-medium">0% Bracket</div>
                        <div className="text-xs text-muted-foreground">Income under $47,025</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(keepLongTermLow, 0)}</div>
                        <div className="text-xs text-muted-foreground">Tax: {formatCurrency(longTermLow.totalTax, 0)}</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <div>
                        <div className="text-sm font-medium">15% Bracket</div>
                        <div className="text-xs text-muted-foreground">$47,025 - $518,900</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-foreground">{formatCurrency(keepLongTermMid, 0)}</div>
                        <div className="text-xs text-muted-foreground">Tax: {formatCurrency(longTermMid.totalTax, 0)}</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <div>
                        <div className="text-sm font-medium">20% + NIIT</div>
                        <div className="text-xs text-muted-foreground">$250k+ income</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-accent">{formatCurrency(keepLongTermHigh, 0)}</div>
                        <div className="text-xs text-muted-foreground">Tax: {formatCurrency(longTermHigh.totalTax, 0)}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Short-Term Gains */}
                <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    <h3 className="font-semibold text-foreground">Short-Term (&lt;1 Year)</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <div>
                        <div className="text-sm font-medium">Ordinary Income Rates</div>
                        <div className="text-xs text-muted-foreground">At $100k income (22% bracket)</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-amber-600 dark:text-amber-400">{formatCurrency(keepShortTerm, 0)}</div>
                        <div className="text-xs text-muted-foreground">Tax: {formatCurrency(shortTerm.totalTax, 0)}</div>
                      </div>
                    </div>
                    <div className="pt-2">
                      <div className="text-sm text-muted-foreground">
                        <strong className="text-foreground">Holding Period Matters:</strong> By holding for 1+ year,
                        you could save {formatCurrency(shortTerm.totalTax - longTermMid.totalTax, 0)} in federal taxes
                        on this {formattedGain} gain.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Real-World Example */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-xl font-bold text-foreground mb-6 text-center">
                Real-World Example: Stock Investment
              </h2>
              <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                <div className="flex items-start gap-4 mb-6">
                  <div className="rounded-full p-2 bg-accent/10">
                    <DollarSign className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">S&P 500 Index Fund Investment</h3>
                    <p className="text-sm text-muted-foreground">
                      Let&apos;s say you invested in an index fund and held it for 3 years
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">Original investment</span>
                    <span className="font-medium">{formatCurrency(examplePurchasePrice, 0)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">Sale price</span>
                    <span className="font-medium">{formatCurrency(exampleSalePrice, 0)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">Capital gain</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">+{formattedGain}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border/50">
                    <span className="text-sm text-muted-foreground">Federal CGT (15% bracket)</span>
                    <span className="font-medium text-destructive">-{formatCurrency(exampleTaxLongTerm, 0)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-sm font-semibold text-foreground">Net profit after tax</span>
                    <span className="font-bold text-lg text-foreground">{formatCurrency(exampleNetProfit, 0)}</span>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-xl p-4">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Note:</strong> This example assumes $100k annual income
                    (15% LTCG bracket) and doesn&apos;t include state taxes, which vary by state (0% in TX, FL, NV
                    vs up to 13.3% in CA). Some states have no capital gains tax while others tax it as
                    ordinary income.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

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
