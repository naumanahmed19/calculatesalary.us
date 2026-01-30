import type { Metadata } from 'next'
import Link from 'next/link'
import { SidebarLayout } from '@/components/sidebar-layout'
import { MortgageAffordabilityCalculator } from '@/components/mortgage-affordability-calculator'
import { TAX_YEAR, formatCurrency, calculateSalary } from '@/lib/us-tax-calculator'
import { generateBreadcrumbSchema, BREADCRUMB_ITEMS } from '@/lib/breadcrumb-schema'
import { HeaderAd, MobileHeaderAd, InContentAd, FooterAd } from '@/components/ad-unit'
import { RelatedCalculators, salaryCalculators } from '@/components/related-calculators'

export const metadata: Metadata = {
  title: `UK Mortgage Affordability Calculator ${TAX_YEAR} - How Much Can I Borrow?`,
  description: `Calculate how much mortgage you can afford based on your salary. See maximum borrowing, monthly payments, and property prices for ${TAX_YEAR}.`,
  keywords: [
    'mortgage affordability calculator uk',
    'how much can i borrow mortgage uk',
    'mortgage calculator uk',
    'how much mortgage can i get',
    'mortgage based on salary uk',
    'house affordability calculator uk',
    TAX_YEAR,
  ],
  openGraph: {
    title: `UK Mortgage Affordability Calculator ${TAX_YEAR} - How Much Can I Borrow?`,
    description: 'Calculate how much mortgage you can afford based on your salary in the UK.',
    type: 'website',
    locale: 'en_GB',
  },
  alternates: {
    canonical: '/mortgage-affordability',
  },
}

// Common salary amounts for mortgage calculations
const COMMON_SALARIES = [30000, 40000, 50000, 60000, 75000, 100000]

// Structured data for SEO
const mortgageCalcSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'UK Mortgage Affordability Calculator',
  description: `Calculate how much mortgage you can afford based on your salary for ${TAX_YEAR}`,
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'GBP',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much can I borrow for a mortgage in the UK?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Most UK lenders will offer between 4 to 4.5 times your annual salary. Some may go up to 5x for high earners with good credit. For a £50,000 salary, you could typically borrow £200,000-£225,000.',
      },
    },
    {
      '@type': 'Question',
      name: 'What salary do I need for a £300,000 mortgage?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'At a 4.5x income multiple, you would need a salary of approximately £66,667 to borrow £300,000. With a partner, combined income of £66,667 would achieve this.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much deposit do I need for a mortgage UK?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'The minimum deposit is typically 5-10% of the property value. However, a 10-20% deposit will give you access to better interest rates. For a £250,000 home, you would need £12,500-£50,000.',
      },
    },
  ],
}

const breadcrumbSchema = generateBreadcrumbSchema([
  BREADCRUMB_ITEMS.home,
  { name: 'Mortgage Affordability', href: '/mortgage-affordability' },
])

export default function MortgageAffordabilityPage() {
  return (
    <SidebarLayout>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mortgageCalcSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="flex-1">
        {/* Top Ad */}
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
                UK Mortgage Affordability Calculator
              </h1>
              <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
                Find out how much you could borrow for a mortgage based on your salary,
                deposit, and current interest rates.
              </p>
            </div>
          </div>
        </section>

        {/* Calculator */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <MortgageAffordabilityCalculator />
          </div>
        </section>

        {/* Ad after calculator */}
        <InContentAd />

        {/* Quick Reference Table */}
        <section className="py-12 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-4 text-center">
                Mortgage Affordability by Salary
              </h2>
              <p className="text-muted-foreground text-center mb-8">
                How much you could borrow at different income levels
              </p>

              <div className="rounded-2xl bg-card/60 dark:bg-card/40 overflow-hidden ring-1 ring-border/50">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Annual Salary</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Can Borrow (4.5x)</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-foreground hidden sm:table-cell">With £25k Deposit</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-foreground hidden md:table-cell">Monthly Payment*</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {COMMON_SALARIES.map((salary) => {
                      const borrowing = salary * 4.5
                      const withDeposit = borrowing + 25000
                      const monthlyRate = 4.5 / 100 / 12
                      const numPayments = 25 * 12
                      const monthlyPayment = borrowing * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
                                            (Math.pow(1 + monthlyRate, numPayments) - 1)
                      return (
                        <tr key={salary} className="hover:bg-muted/30">
                          <td className="px-4 py-3 text-sm font-medium text-foreground">
                            <Link href={`/salary/${salary}`} className="text-accent hover:underline">
                              {formatCurrency(salary, 0)}
                            </Link>
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-semibold text-accent">
                            {formatCurrency(borrowing, 0)}
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-muted-foreground hidden sm:table-cell">
                            {formatCurrency(withDeposit, 0)}
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-muted-foreground hidden md:table-cell">
                            {formatCurrency(monthlyPayment)}/mo
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                * Monthly payment based on 4.5% interest rate over 25 years. Actual rates may vary.
              </p>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-12 bg-muted/30 border-t border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                <h3 className="font-semibold text-foreground mb-3">How Lenders Calculate Affordability</h3>
                <p className="text-sm text-muted-foreground">
                  UK mortgage lenders typically use income multiples of 4 to 4.5 times your annual salary.
                  They also perform affordability assessments based on your outgoings, credit history,
                  and ability to afford payments if interest rates rise. Higher earners may access 5x multiples.
                </p>
              </div>

              <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                <h3 className="font-semibold text-foreground mb-3">Stamp Duty Considerations</h3>
                <p className="text-sm text-muted-foreground">
                  Remember to factor in Stamp Duty Land Tax (SDLT) when budgeting. First-time buyers
                  pay no stamp duty on the first £425,000 of properties up to £625,000. Standard buyers
                  pay 0% up to £250,000, then increasing rates above this threshold.
                </p>
              </div>

              <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                <h3 className="font-semibold text-foreground mb-3">Improving Your Borrowing Power</h3>
                <p className="text-sm text-muted-foreground">
                  To maximise your borrowing: save a larger deposit (better rates at 10%, 15%, 20% LTV),
                  improve your credit score, reduce existing debts, and consider a longer mortgage term.
                  Joint applications with a partner combine both incomes.
                </p>
              </div>
            </div>
          </div>
        </section>

        <RelatedCalculators calculators={salaryCalculators} />
        {/* Footer Ad */}
        <FooterAd />
      </main>
    </SidebarLayout>
  )
}
