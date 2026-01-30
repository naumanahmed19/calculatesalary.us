import type { Metadata } from 'next'
import Link from 'next/link'
import { SidebarLayout } from '@/components/sidebar-layout'
import { MortgageAffordabilityCalculator } from '@/components/mortgage-affordability-calculator'
import { TAX_YEAR, formatCurrency, calculateSalary } from '@/lib/us-tax-calculator'
import { generateBreadcrumbSchema, BREADCRUMB_ITEMS } from '@/lib/breadcrumb-schema'
import { HeaderAd, MobileHeaderAd, InContentAd, FooterAd } from '@/components/ad-unit'
import { RelatedCalculators, salaryCalculators } from '@/components/related-calculators'

export const metadata: Metadata = {
  title: `US Mortgage Affordability Calculator ${TAX_YEAR} - How Much Can I Borrow?`,
  description: `Calculate how much mortgage you can afford based on your salary. See maximum borrowing, monthly payments, and home prices for ${TAX_YEAR}.`,
  keywords: [
    'mortgage affordability calculator us',
    'how much can i borrow mortgage',
    'mortgage calculator us',
    'how much mortgage can i get',
    'mortgage based on salary',
    'house affordability calculator',
    'dti calculator',
    TAX_YEAR,
  ],
  openGraph: {
    title: `US Mortgage Affordability Calculator ${TAX_YEAR} - How Much Can I Borrow?`,
    description: 'Calculate how much mortgage you can afford based on your salary.',
    type: 'website',
    locale: 'en_US',
  },
  alternates: {
    canonical: '/mortgage-affordability',
  },
}

// Common salary amounts for mortgage calculations
const COMMON_SALARIES = [50000, 75000, 100000, 125000, 150000, 200000]

// Structured data for SEO
const mortgageCalcSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'US Mortgage Affordability Calculator',
  description: `Calculate how much mortgage you can afford based on your salary for ${TAX_YEAR}`,
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How much mortgage can I afford in the US?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'US lenders typically use the 28/36 rule: your housing costs should not exceed 28% of gross monthly income, and total debt payments should not exceed 36%. For a $100,000 salary, you could typically afford a home around $350,000-$400,000 with 20% down.',
      },
    },
    {
      '@type': 'Question',
      name: 'What salary do I need for a $400,000 mortgage?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'To comfortably afford a $400,000 mortgage with current rates, you would need a household income of approximately $100,000-$120,000. This assumes a 20% down payment, good credit, and minimal other debts.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much down payment do I need for a house?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Conventional loans typically require 3-20% down. FHA loans require 3.5% with a 580+ credit score. VA loans and USDA loans offer 0% down for qualified buyers. A 20% down payment avoids PMI and gets better rates.',
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
                US Mortgage Affordability Calculator
              </h1>
              <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
                Find out how much home you can afford based on your salary,
                down payment, and current interest rates.
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
                Home Affordability by Salary
              </h2>
              <p className="text-muted-foreground text-center mb-8">
                How much home you could afford at different income levels
              </p>

              <div className="rounded-2xl bg-card/60 dark:bg-card/40 overflow-hidden ring-1 ring-border/50">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Annual Salary</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">Max Mortgage</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-foreground hidden sm:table-cell">With 20% Down</th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-foreground hidden md:table-cell">Monthly Payment*</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {COMMON_SALARIES.map((salary) => {
                      const maxMortgage = salary * 3.5 // Roughly 3.5x salary with 28% DTI
                      const homePrice = maxMortgage / 0.8 // Assumes 20% down
                      const monthlyRate = 6.5 / 100 / 12
                      const numPayments = 30 * 12
                      const monthlyPayment = maxMortgage * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
                                            (Math.pow(1 + monthlyRate, numPayments) - 1)
                      return (
                        <tr key={salary} className="hover:bg-muted/30">
                          <td className="px-4 py-3 text-sm font-medium text-foreground">
                            <Link href={`/salary/${salary}`} className="text-accent hover:underline">
                              {formatCurrency(salary, 0)}
                            </Link>
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-semibold text-accent">
                            {formatCurrency(maxMortgage, 0)}
                          </td>
                          <td className="px-4 py-3 text-sm text-right text-muted-foreground hidden sm:table-cell">
                            {formatCurrency(homePrice, 0)} home
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
                * Monthly payment based on 6.5% interest rate over 30 years. Actual rates and affordability vary.
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
                  US mortgage lenders use debt-to-income (DTI) ratios. The 28/36 rule means housing costs
                  (mortgage, taxes, insurance) should be under 28% of gross income, and total debt under 36%.
                  Some lenders allow up to 43% DTI for qualified mortgages, or even higher for FHA loans.
                </p>
              </div>

              <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                <h3 className="font-semibold text-foreground mb-3">Down Payment Options</h3>
                <p className="text-sm text-muted-foreground">
                  Conventional loans: 3-20% down (PMI required under 20%). FHA loans: 3.5% down with
                  580+ credit score. VA loans: 0% down for veterans. USDA loans: 0% down in rural areas.
                  A larger down payment means lower monthly payments and better rates.
                </p>
              </div>

              <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                <h3 className="font-semibold text-foreground mb-3">Additional Costs to Consider</h3>
                <p className="text-sm text-muted-foreground">
                  Beyond the mortgage payment, budget for property taxes (varies by state), homeowners
                  insurance, PMI (if under 20% down), HOA fees if applicable, and maintenance costs
                  (typically 1-2% of home value annually).
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
