import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SidebarLayout } from '@/components/sidebar-layout'
import { MortgageAffordabilityCalculator } from '@/components/mortgage-affordability-calculator'
import { TAX_YEAR, formatCurrency } from '@/lib/us-tax-calculator'
import { generateBreadcrumbSchema, BREADCRUMB_ITEMS } from '@/lib/breadcrumb-schema'
import { HeaderAd, MobileHeaderAd, InContentAd, FooterAd } from '@/components/ad-unit'
import { RelatedCalculators, salaryCalculators } from '@/components/related-calculators'

const BASE_URL = 'https://calculatesalary.us'

interface PageProps {
  params: Promise<{ salary: string }>
}

// Common salary amounts for static generation
const MORTGAGE_SALARIES = [
  50000, 60000, 70000, 75000, 80000, 90000, 100000, 110000, 120000,
  125000, 150000, 175000, 200000, 250000
]

export const revalidate = false

export async function generateStaticParams() {
  return MORTGAGE_SALARIES.map((salary) => ({
    salary: salary.toString(),
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { salary: salaryParam } = await params
  const salary = parseInt(salaryParam, 10)

  if (isNaN(salary) || salary <= 0 || salary > 1000000) {
    return { title: 'Invalid Salary' }
  }

  const borrowing = salary * 3.5
  const formattedSalary = formatCurrency(salary, 0)
  const formattedBorrowing = formatCurrency(borrowing, 0)

  return {
    title: `How Much Mortgage Can I Get on ${formattedSalary} Salary? | ${TAX_YEAR}`,
    description: `On a ${formattedSalary} salary you could borrow up to ${formattedBorrowing} for a mortgage. Calculate your maximum borrowing, monthly payments and affordability.`,
    keywords: [
      `mortgage on ${salary} salary`,
      `how much can i borrow on ${salary}`,
      `${salary} salary mortgage usa`,
      'mortgage affordability calculator',
      'mortgage calculator usa',
      'home affordability calculator',
      TAX_YEAR,
    ],
    openGraph: {
      title: `Mortgage Affordability on ${formattedSalary} Salary`,
      description: `Calculate how much mortgage you can afford on a ${formattedSalary} salary in the USA.`,
      type: 'website',
      locale: 'en_US',
    },
    alternates: {
      canonical: `${BASE_URL}/mortgage-affordability/${salary}`,
    },
  }
}

function calculateClosingCosts(price: number): { lenderFees: number; titleInsurance: number; escrow: number; total: number } {
  // Average US closing costs are 2-5% of purchase price
  const lenderFees = Math.round(price * 0.01); // 1% - origination, processing
  const titleInsurance = Math.round(price * 0.005); // 0.5% - title insurance and search
  const escrow = Math.round(price * 0.015); // 1.5% - escrow, appraisal, inspection

  return {
    lenderFees,
    titleInsurance,
    escrow,
    total: lenderFees + titleInsurance + escrow
  };
}

function calculatePropertyTax(price: number): number {
  // Average US property tax rate is ~1.1% annually
  return Math.round(price * 0.011 / 12);
}

export default async function MortgageAffordabilitySalaryPage({ params }: PageProps) {
  const { salary: salaryParam } = await params
  const salary = parseInt(salaryParam, 10)

  if (isNaN(salary) || salary <= 0 || salary > 1000000) {
    notFound()
  }

  const formattedSalary = formatCurrency(salary, 0)
  const borrowing3x = salary * 3
  const borrowing35x = salary * 3.5
  const borrowing4x = salary * 4

  // Calculate monthly payment at 3.5x with 6.5% rate
  const monthlyRate = 6.5 / 100 / 12
  const numPayments = 30 * 12
  const monthlyPayment = borrowing35x * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
                        (Math.pow(1 + monthlyRate, numPayments) - 1)

  const breadcrumbSchema = generateBreadcrumbSchema([
    BREADCRUMB_ITEMS.home,
    BREADCRUMB_ITEMS.mortgageAffordability,
    { name: `${formattedSalary} Salary`, href: `/mortgage-affordability/${salary}` },
  ])

  // Estimate home price (assuming 20% down + 3.5x borrowing)
  const estimatedHomePrice = Math.round(borrowing35x / 0.8);
  const closingCosts = calculateClosingCosts(estimatedHomePrice);
  const monthlyPropertyTax = calculatePropertyTax(estimatedHomePrice);
  const monthlyHomeownersInsurance = Math.round(estimatedHomePrice * 0.003 / 12); // ~0.3% annually

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How much mortgage can I get on a ${formattedSalary} salary?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `On a ${formattedSalary} salary, you could typically borrow ${formatCurrency(borrowing3x, 0)} to ${formatCurrency(borrowing4x, 0)} depending on the lender and your debt-to-income ratio. Most lenders prefer a housing DTI under 28%.`,
        },
      },
      {
        '@type': 'Question',
        name: `What would monthly payments be on a ${formattedSalary} salary mortgage?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Borrowing ${formatCurrency(borrowing35x, 0)} at 6.5% over 30 years would cost approximately ${formatCurrency(monthlyPayment)} per month (principal and interest only). Your actual rate may be higher or lower.`,
        },
      },
      {
        '@type': 'Question',
        name: `How much down payment do I need on a ${formattedSalary} salary?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `A 20% down payment on a home affordable with this salary would be approximately ${formatCurrency(estimatedHomePrice * 0.2, 0)}. This allows you to buy a home worth ${formatCurrency(estimatedHomePrice, 0)} and avoid PMI.`,
        },
      },
      {
        '@type': 'Question',
        name: `What are closing costs on a ${formattedSalary} salary mortgage?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `For a home worth ${formatCurrency(estimatedHomePrice, 0)}, expect closing costs of approximately ${formatCurrency(closingCosts.total, 0)} (2-5% of purchase price), covering lender fees, title insurance, and escrow.`,
        },
      },
    ],
  }

  // Related salary links
  const relatedSalaries = MORTGAGE_SALARIES.filter(s => s !== salary).slice(0, 6)

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
                {TAX_YEAR}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground text-balance mb-4">
                Mortgage on {formattedSalary} Salary
              </h1>
              <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
                On a {formattedSalary} salary, you could borrow between{' '}
                <span className="font-semibold text-foreground">{formatCurrency(borrowing3x, 0)}</span> and{' '}
                <span className="font-semibold text-foreground">{formatCurrency(borrowing4x, 0)}</span> for a mortgage.
              </p>
            </div>
          </div>
        </section>

        {/* Quick Summary */}
        <section className="py-8 bg-muted/30 border-b border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-xl bg-card/60 p-4 text-center ring-1 ring-border/50">
                <div className="text-sm text-muted-foreground">Conservative (3x)</div>
                <div className="text-xl font-bold text-foreground">{formatCurrency(borrowing3x, 0)}</div>
              </div>
              <div className="rounded-xl bg-accent/10 p-4 text-center ring-1 ring-accent/20">
                <div className="text-sm text-muted-foreground">Standard (3.5x)</div>
                <div className="text-xl font-bold text-accent">{formatCurrency(borrowing35x, 0)}</div>
              </div>
              <div className="rounded-xl bg-card/60 p-4 text-center ring-1 ring-border/50">
                <div className="text-sm text-muted-foreground">Maximum (4x)</div>
                <div className="text-xl font-bold text-foreground">{formatCurrency(borrowing4x, 0)}</div>
              </div>
              <div className="rounded-xl bg-card/60 p-4 text-center ring-1 ring-border/50">
                <div className="text-sm text-muted-foreground">Monthly (6.5%)</div>
                <div className="text-xl font-bold text-foreground">{formatCurrency(monthlyPayment)}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Calculator */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <MortgageAffordabilityCalculator initialSalary={salary} />
          </div>
        </section>

        <InContentAd />

        {/* Info Cards */}
        <section className="py-12 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                <h3 className="font-semibold text-foreground mb-3">Borrowing on {formattedSalary}</h3>
                <p className="text-sm text-muted-foreground">
                  With a {formattedSalary} salary, US lenders typically approve 3 to 4 times your annual income,
                  depending on your credit score, debt-to-income ratio, and down payment.
                  This means you could borrow {formatCurrency(borrowing3x, 0)} to {formatCurrency(borrowing4x, 0)}.
                  Lenders focus on your DTI ratio - ideally under 28% for housing and 36% total.
                </p>
              </div>

              <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                <h3 className="font-semibold text-foreground mb-3">Down Payment Tips</h3>
                <p className="text-sm text-muted-foreground">
                  With a {formatCurrency(50000, 0)} down payment, you could afford a home worth{' '}
                  {formatCurrency(borrowing35x + 50000, 0)}. Putting 20% down avoids Private Mortgage Insurance (PMI)
                  and gets you better interest rates. FHA loans allow as little as 3.5% down with good credit.
                </p>
              </div>

              <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                <h3 className="font-semibold text-foreground mb-3">Joint Application</h3>
                <p className="text-sm text-muted-foreground">
                  Buying with a partner? If they also earn {formattedSalary}, your combined borrowing power
                  would be {formatCurrency(borrowing35x * 2, 0)} at 3.5x. This significantly increases
                  what you can afford.
                </p>
              </div>

              {/* Closing Costs Section - NEW */}
              <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                <h3 className="font-semibold text-foreground mb-3">Estimated Closing Costs</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Based on a home value of approx. {formatCurrency(estimatedHomePrice, 0)} (assuming 20% down payment).
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Lender Fees (origination, processing)</span>
                    <span className="font-medium text-foreground">{formatCurrency(closingCosts.lenderFees, 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Title Insurance & Search</span>
                    <span className="font-medium text-foreground">{formatCurrency(closingCosts.titleInsurance, 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Escrow, Appraisal & Inspection</span>
                    <span className="font-medium text-foreground">{formatCurrency(closingCosts.escrow, 0)}</span>
                  </div>
                  <div className="pt-2 border-t border-border/50 flex justify-between font-semibold">
                    <span>Total Estimated Closing Costs</span>
                    <span>{formatCurrency(closingCosts.total, 0)}</span>
                  </div>
                </div>
              </div>

              {/* Monthly Housing Costs - NEW */}
              <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                <h3 className="font-semibold text-foreground mb-3">Full Monthly Housing Costs</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Your true monthly housing cost includes more than just principal & interest.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Principal & Interest (P&I)</span>
                    <span className="font-medium text-foreground">{formatCurrency(monthlyPayment, 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Property Tax (est. 1.1%/year)</span>
                    <span className="font-medium text-foreground">{formatCurrency(monthlyPropertyTax, 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Homeowners Insurance</span>
                    <span className="font-medium text-foreground">{formatCurrency(monthlyHomeownersInsurance, 0)}</span>
                  </div>
                  <div className="pt-2 border-t border-border/50 flex justify-between font-semibold">
                    <span>Total Monthly (PITI)</span>
                    <span>{formatCurrency(Math.round(monthlyPayment + monthlyPropertyTax + monthlyHomeownersInsurance), 0)}</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  * PITI = Principal, Interest, Taxes, Insurance. HOA fees not included.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Related Salaries */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-xl font-bold text-foreground mb-6 text-center">
                Mortgage Affordability at Other Salaries
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {relatedSalaries.map((s) => (
                  <Link
                    key={s}
                    href={`/mortgage-affordability/${s}`}
                    className="rounded-xl bg-card/60 p-4 text-center ring-1 ring-border/50 hover:ring-accent/50 transition-all"
                  >
                    <div className="text-sm text-muted-foreground">Salary</div>
                    <div className="font-semibold text-foreground">{formatCurrency(s, 0)}</div>
                    <div className="text-xs text-accent mt-1">Borrow up to {formatCurrency(s * 3.5, 0)}</div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <RelatedCalculators calculators={salaryCalculators} />
        <FooterAd />
      </main>
    </SidebarLayout>
  )
}
