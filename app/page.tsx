import type { Metadata } from 'next'
import { SalaryCalculatorForm } from '@/components/salary-calculator-form'
import { SidebarLayout } from '@/components/sidebar-layout'
import { TAX_YEAR, COMMON_SALARIES, formatCurrency } from '@/lib/us-tax-calculator'
import { currentTaxConfig, getStatesWithNoIncomeTax } from '@/lib/us-tax-config'
import { HeaderAd, MobileHeaderAd, InContentAd, InArticleAd, FooterAd } from '@/components/ad-unit'
import Link from 'next/link'

export const metadata: Metadata = {
  title: `US Salary Calculator ${TAX_YEAR} - Take Home Pay Calculator`,
  description: `Calculate your US take-home pay for ${TAX_YEAR}. Our free salary calculator shows Federal Tax, State Tax, Social Security, Medicare, and 401(k) deductions. See your yearly, monthly, and bi-weekly net pay.`,
  keywords: ['us salary calculator', 'take home pay calculator', `us tax calculator ${TAX_YEAR}`, 'federal tax calculator', 'state tax calculator', 'net salary usa', 'after tax salary calculator', 'paycheck calculator'],
  openGraph: {
    title: `US Salary Calculator ${TAX_YEAR} - Take Home Pay Calculator`,
    description: `Calculate your US take-home pay for ${TAX_YEAR}. See Federal Tax, State Tax, FICA, and all deductions.`,
    type: 'website',
    locale: 'en_US',
  },
  alternates: {
    canonical: '/',
  },
}

// Federal tax brackets for display
const FEDERAL_TAX_BRACKETS = [
  { rate: '10%', range: `$0 - $${currentTaxConfig.federalBrackets.single[0].max.toLocaleString()}`, description: 'First bracket - lowest rate on initial income' },
  { rate: '12%', range: `$${currentTaxConfig.federalBrackets.single[0].max.toLocaleString()} - $${currentTaxConfig.federalBrackets.single[1].max.toLocaleString()}`, description: 'Second bracket for moderate income' },
  { rate: '22%', range: `$${currentTaxConfig.federalBrackets.single[1].max.toLocaleString()} - $${currentTaxConfig.federalBrackets.single[2].max.toLocaleString()}`, description: 'Third bracket - common for professionals' },
  { rate: '24%', range: `$${currentTaxConfig.federalBrackets.single[2].max.toLocaleString()} - $${currentTaxConfig.federalBrackets.single[3].max.toLocaleString()}`, description: 'Fourth bracket for higher earners' },
]

// FAQ data for schema and display
const FAQ_DATA = [
  {
    question: `How is US federal income tax calculated in ${TAX_YEAR}?`,
    answer: `US federal income tax uses a progressive bracket system. For single filers in ${TAX_YEAR}: 10% on the first $${currentTaxConfig.federalBrackets.single[0].max.toLocaleString()}, 12% from $${currentTaxConfig.federalBrackets.single[0].max.toLocaleString()} to $${currentTaxConfig.federalBrackets.single[1].max.toLocaleString()}, 22% from $${currentTaxConfig.federalBrackets.single[1].max.toLocaleString()} to $${currentTaxConfig.federalBrackets.single[2].max.toLocaleString()}, and higher rates for income above that. The standard deduction is $${currentTaxConfig.standardDeduction.single.toLocaleString()} for single filers.`
  },
  {
    question: `What are Social Security and Medicare taxes?`,
    answer: `Social Security tax is ${(currentTaxConfig.socialSecurity.rate * 100).toFixed(1)}% on income up to $${currentTaxConfig.socialSecurity.wageBase.toLocaleString()} (the wage base limit). Medicare tax is ${(currentTaxConfig.medicare.rate * 100).toFixed(2)}% on all income, with an additional ${(currentTaxConfig.medicare.additionalRate * 100).toFixed(1)}% on income over $200,000 for single filers. These are known as FICA taxes.`
  },
  {
    question: "How does 401(k) contribution affect my take-home pay?",
    answer: `Traditional 401(k) contributions are made pre-tax, reducing your taxable income and current tax bill. In ${TAX_YEAR}, you can contribute up to $${currentTaxConfig.retirement401k.employeeLimit.toLocaleString()} ($${(currentTaxConfig.retirement401k.employeeLimit + currentTaxConfig.retirement401k.catchUpLimit).toLocaleString()} if 50+). A $10,000 contribution in the 22% bracket saves approximately $2,200 in federal taxes.`
  },
  {
    question: "Which states have no income tax?",
    answer: `Nine states have no state income tax: Alaska, Florida, Nevada, New Hampshire (dividends/interest only), South Dakota, Tennessee, Texas, Washington, and Wyoming. Living in these states means you keep more of your paycheck, though they may have higher property or sales taxes.`
  },
  {
    question: "What is the standard deduction for ${TAX_YEAR}?",
    answer: `For ${TAX_YEAR}, the standard deduction is $${currentTaxConfig.standardDeduction.single.toLocaleString()} for single filers, $${currentTaxConfig.standardDeduction.married_jointly.toLocaleString()} for married filing jointly, $${currentTaxConfig.standardDeduction.married_separately.toLocaleString()} for married filing separately, and $${currentTaxConfig.standardDeduction.head_of_household.toLocaleString()} for head of household. This amount is subtracted from your gross income before calculating taxes.`
  },
  {
    question: "How is my paycheck different from annual salary?",
    answer: "Your paycheck shows your gross pay minus all deductions for that pay period. Bi-weekly paychecks divide your annual salary by 26, while monthly divides by 12. Deductions include federal tax (withheld based on your W-4), state tax, Social Security, Medicare, and any pre-tax benefits like 401(k) or health insurance."
  }
]

// FAQPage Schema for rich snippets
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_DATA.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer
    }
  }))
}

export default function HomePage() {
  const noTaxStates = getStatesWithNoIncomeTax()

  return (
    <SidebarLayout>
      {/* FAQ Schema for rich snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main id="main-content" className="flex-1">
        {/* Top Ad Placement */}
        <HeaderAd />
        <MobileHeaderAd />

        {/* Hero Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-flex items-center rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent mb-6">
                Updated for {TAX_YEAR} Tax Year
              </span>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground text-balance mb-4">
                US Salary Calculator
              </h1>
              <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
                Calculate your take-home pay instantly. See exactly how much you'll earn after Federal Tax,
                State Tax, Social Security, Medicare, and 401(k) contributions.
              </p>
            </div>
          </div>
        </section>

        {/* Calculator Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <SalaryCalculatorForm />
          </div>
        </section>

        {/* Ad after calculator */}
        <InContentAd />

        {/* Federal Tax Brackets Section */}
        <section className="py-12 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-4 text-center">
                Federal Income Tax Brackets {TAX_YEAR}
              </h2>
              <p className="text-muted-foreground text-center mb-8">
                Single filer tax rates. See <Link href="/tax-brackets" className="text-accent hover:underline">all filing statuses</Link>
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                {FEDERAL_TAX_BRACKETS.map((bracket, index) => (
                  <Link
                    href="/tax-brackets"
                    key={index}
                    className="rounded-2xl bg-card/60 dark:bg-card/40 p-5 ring-1 ring-border/50 hover:ring-accent/50 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-foreground">Bracket {index + 1}</h3>
                      <span className="text-lg font-bold text-accent">{bracket.rate}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{bracket.range}</p>
                    <p className="text-xs text-muted-foreground">{bracket.description}</p>
                  </Link>
                ))}
              </div>

              <div className="text-center mt-6 space-x-4">
                <Link href="/tax-brackets" className="text-sm text-accent hover:underline">
                  View all tax brackets
                </Link>
                <span className="text-muted-foreground">|</span>
                <Link href="/fica-taxes" className="text-sm text-accent hover:underline">
                  FICA taxes explained
                </Link>
                <span className="text-muted-foreground">|</span>
                <Link href="/state-taxes" className="text-sm text-accent hover:underline">
                  State tax comparison
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Salaries Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-4 text-center">
                Popular Salary Calculations
              </h2>
              <p className="text-muted-foreground text-center mb-8">
                Quick access to common US salary calculations for {TAX_YEAR}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {COMMON_SALARIES.slice(0, 20).map((salary) => (
                  <Link
                    key={salary}
                    href={`/salary/${salary}`}
                    className="rounded-2xl bg-card/60 dark:bg-card/40 p-4 text-center ring-1 ring-border/50 hover:ring-accent/50 transition-all"
                  >
                    <span className="text-sm font-semibold text-foreground">
                      {formatCurrency(salary, 0)}
                    </span>
                  </Link>
                ))}
              </div>

              <div className="text-center mt-6 space-y-2">
                <p className="text-sm text-muted-foreground">
                  Or enter any salary amount in the calculator above
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* No-Tax States Section */}
        <section className="py-12 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-4 text-center">
                States With No Income Tax
              </h2>
              <p className="text-muted-foreground text-center mb-8">
                These 9 states don't have a state income tax
              </p>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {noTaxStates.map((stateCode) => (
                  <Link
                    key={stateCode}
                    href={`/state/${stateCode.toLowerCase()}`}
                    className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 p-4 text-center ring-1 ring-emerald-200 dark:ring-emerald-800 hover:ring-emerald-400 transition-all"
                  >
                    <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                      {stateCode}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Ad between sections */}
        <InArticleAd />

        {/* FAQ Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
                Frequently Asked Questions
              </h2>

              <div className="space-y-6">
                {FAQ_DATA.map((faq, index) => (
                  <FAQItem key={index} question={faq.question} answer={faq.answer} />
                ))}
              </div>

              <div className="text-center mt-8">
                <p className="text-sm text-muted-foreground">
                  Have more questions? Check out our guides on{' '}
                  <Link href="/tax-brackets" className="text-accent hover:underline">tax brackets</Link>,{' '}
                  <Link href="/fica-taxes" className="text-accent hover:underline">FICA taxes</Link>, and{' '}
                  <Link href="/401k-calculator" className="text-accent hover:underline">401(k) benefits</Link>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Ad */}
        <FooterAd />
      </main>
    </SidebarLayout>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
      <h3 className="font-semibold text-foreground mb-2">{question}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{answer}</p>
    </div>
  )
}
