import type { Metadata } from 'next'
import { SidebarLayout } from '@/components/sidebar-layout'
import { BonusTaxCalculator } from '@/components/bonus-tax-calculator'
import { TAX_YEAR } from '@/lib/us-tax-calculator'
import { HeaderAd, InContentAd, FooterAd } from '@/components/ad-unit'
import Link from 'next/link'

export const metadata: Metadata = {
  title: `Bonus Tax Calculator ${TAX_YEAR} - How Much Tax Will I Pay On My Bonus?`,
  description: `Calculate how much tax you'll pay on your bonus in the US. See federal withholding (22%), FICA taxes, and state taxes on bonuses for ${TAX_YEAR}. Understand your bonus after tax.`,
  keywords: [
    'bonus tax calculator',
    'tax on bonus',
    'bonus after tax',
    'how much tax on bonus',
    'bonus withholding rate',
    'supplemental wages tax',
    '22 percent bonus tax',
    'bonus tax rate 2025',
    TAX_YEAR,
  ],
}

const faqData = [
  {
    question: 'How are bonuses taxed in the United States?',
    answer: 'The IRS considers bonuses "supplemental wages." Employers typically withhold at a flat 22% rate for federal taxes (37% for amounts over $1 million). FICA taxes (Social Security 6.2% + Medicare 1.45%) are also deducted. Your actual tax liability is determined when you file your return.',
  },
  {
    question: 'Why does my bonus seem more heavily taxed than my salary?',
    answer: 'Your regular paycheck withholding accounts for your standard deduction spread across the year. Bonuses are often withheld at the flat 22% supplemental rate regardless of your actual bracket. If you\'re in a lower bracket, you\'ll get a refund. If you\'re in a higher bracket (32% or more), you may owe additional tax.',
  },
  {
    question: 'What is the 22% bonus withholding rate?',
    answer: 'The IRS allows employers to use a flat 22% withholding rate for supplemental wages (bonuses, commissions, overtime) up to $1 million per year. This simplifies payroll but may not match your actual tax bracket. For bonuses over $1 million, the rate increases to 37%.',
  },
  {
    question: 'Can I reduce tax on my bonus?',
    answer: 'Yes! Contribute more to your 401(k) - traditional 401(k) contributions reduce taxable income. You can also contribute to an HSA if eligible, or time your bonus to a year when your income is lower. Some employers allow you to direct part of your bonus to retirement accounts.',
  },
  {
    question: 'Will I get a refund if my bonus was over-withheld?',
    answer: 'Yes. If the 22% withholding rate is higher than your actual marginal tax rate, you\'ll receive a refund when you file your tax return. For example, if you\'re in the 12% bracket but had 22% withheld, you\'ll get the 10% difference back.',
  },
]

export default function BonusTaxPage() {
  return (
    <SidebarLayout>
      <main id="main-content" className="flex-1">
        <HeaderAd />

        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-flex items-center rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent mb-6">
                {TAX_YEAR} Tax Year
              </span>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground text-balance mb-4">
                Bonus Tax Calculator
              </h1>
              <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
                Calculate how much of your bonus you'll take home after federal withholding,
                FICA taxes, and state taxes. See the difference between withholding and actual tax owed.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <BonusTaxCalculator />
          </div>
        </section>

        <InContentAd />

        <section className="py-12 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
                Understanding Bonus Tax in the US
              </h2>

              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    How Bonuses Are Taxed
                  </h3>
                  <p className="text-muted-foreground">
                    Bonuses are classified as "supplemental wages" by the IRS. Employers can
                    either withhold at a flat rate or use the aggregate method (adding bonus
                    to regular wages and calculating tax on the total).
                  </p>
                  <div className="rounded-xl bg-card p-4 ring-1 ring-border/50 space-y-2">
                    <p className="text-sm font-medium text-foreground">Bonus Tax Rates {TAX_YEAR}:</p>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Federal withholding: <strong>22%</strong> flat rate</li>
                      <li>• Bonuses over $1M: <strong>37%</strong> flat rate</li>
                      <li>• Social Security: <strong>6.2%</strong> (up to wage base)</li>
                      <li>• Medicare: <strong>1.45%</strong> (+ 0.9% over $200k)</li>
                      <li>• State taxes: <strong>varies by state</strong></li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    Tips to Reduce Bonus Tax
                  </h3>
                  <div className="space-y-3">
                    <div className="rounded-xl bg-card p-4 ring-1 ring-border/50">
                      <p className="font-medium text-foreground mb-1">401(k) Contributions</p>
                      <p className="text-sm text-muted-foreground">
                        Increase your 401(k) contribution to reduce taxable income. Some
                        employers let you direct bonus amounts directly to retirement accounts.
                      </p>
                    </div>
                    <div className="rounded-xl bg-card p-4 ring-1 ring-border/50">
                      <p className="font-medium text-foreground mb-1">HSA Contributions</p>
                      <p className="text-sm text-muted-foreground">
                        If you have a high-deductible health plan, HSA contributions reduce
                        both income tax AND FICA taxes, unlike 401(k).
                      </p>
                    </div>
                    <div className="rounded-xl bg-card p-4 ring-1 ring-border/50">
                      <p className="font-medium text-foreground mb-1">Defer to Next Year</p>
                      <p className="text-sm text-muted-foreground">
                        If possible, request your bonus be paid in January if you expect
                        lower income next year.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
                Frequently Asked Questions
              </h2>

              <div className="space-y-6">
                {faqData.map((faq, index) => (
                  <div key={index} className="rounded-2xl bg-card/60 dark:bg-card/40 p-6 ring-1 ring-border/50">
                    <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground text-sm">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Related Links */}
        <section className="py-12 bg-muted/30 border-t border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-xl font-bold text-foreground mb-6">Related Calculators</h2>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/" className="text-accent hover:underline">Salary Calculator</Link>
                <span className="text-muted-foreground">•</span>
                <Link href="/tax-brackets" className="text-accent hover:underline">Tax Brackets</Link>
                <span className="text-muted-foreground">•</span>
                <Link href="/fica-taxes" className="text-accent hover:underline">FICA Taxes</Link>
                <span className="text-muted-foreground">•</span>
                <Link href="/401k-calculator" className="text-accent hover:underline">401(k) Calculator</Link>
              </div>
            </div>
          </div>
        </section>

        <FooterAd />
      </main>
    </SidebarLayout>
  )
}
