import type { Metadata } from 'next'
import { Calculator401k } from '@/components/401k-calculator'
import { SidebarLayout } from '@/components/sidebar-layout'
import { TAX_YEAR } from '@/lib/us-tax-calculator'
import { HeaderAd, InContentAd, FooterAd } from '@/components/ad-unit'
import Link from 'next/link'

export const metadata: Metadata = {
  title: `401(k) Calculator ${TAX_YEAR} - Retirement Savings & Tax Benefits`,
  description: `Calculate your 401(k) contributions, employer match, and tax savings for ${TAX_YEAR}. See projected retirement balances with Traditional and Roth 401(k) options. New super catch-up limit of $11,250 for ages 60-63.`,
  keywords: ['401k calculator', '401k contribution calculator', 'retirement calculator', 'employer match calculator', 'roth 401k', 'traditional 401k', '401k tax savings', `${TAX_YEAR} 401k limits`],
}

const FAQ_DATA = [
  {
    question: "What is the 401(k) contribution limit for 2025?",
    answer: "For 2025, the employee contribution limit is $23,500. If you're 50-59 or 64+, you can contribute an additional $7,500 catch-up ($31,000 total). NEW for 2025: Ages 60-63 get a 'super catch-up' of $11,250 extra ($34,750 total). The total limit including employer contributions is $70,000."
  },
  {
    question: "What's the difference between Traditional and Roth 401(k)?",
    answer: "Traditional 401(k) contributions are pre-tax, reducing your current taxable income. You pay taxes when you withdraw in retirement. Roth 401(k) contributions are after-tax, so you don't get an immediate tax break, but withdrawals in retirement are tax-free. Choose Traditional if you expect to be in a lower tax bracket in retirement."
  },
  {
    question: "How does employer matching work?",
    answer: "Many employers match a percentage of your contributions up to a limit. For example, '50% match up to 6%' means if you contribute 6% of your salary, your employer adds 3%. This is free money - always contribute enough to get the full match!"
  },
  {
    question: "What is the new super catch-up contribution for 2025?",
    answer: "Starting in 2025, employees aged 60-63 can make a 'super catch-up' contribution of $11,250 (instead of the regular $7,500 catch-up). This allows a maximum contribution of $34,750 for those in this age range. This is part of the SECURE 2.0 Act changes."
  },
  {
    question: "Should I max out my 401(k)?",
    answer: "At minimum, contribute enough to get your full employer match. After that, consider maxing out if: you're in a high tax bracket (Traditional 401k saves more), you've maxed other tax-advantaged accounts (HSA, IRA), and you can afford to lock away the money until age 59½."
  }
]

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

export default function Page401k() {
  return (
    <SidebarLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main id="main-content" className="flex-1">
        <HeaderAd />

        {/* Hero */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-flex items-center rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent mb-6">
                Updated for {TAX_YEAR} • New Super Catch-up Limits
              </span>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground text-balance mb-4">
                401(k) Calculator
              </h1>
              <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
                Calculate your retirement contributions, employer match, and see how much you'll save on taxes.
                Plan your path to a secure retirement.
              </p>
            </div>
          </div>
        </section>

        {/* Calculator */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Calculator401k />
          </div>
        </section>

        <InContentAd />

        {/* Key Info */}
        <section className="py-12 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
                401(k) Benefits Explained
              </h2>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="rounded-2xl bg-card/60 p-6 ring-1 ring-border/50">
                  <h3 className="font-semibold text-foreground mb-2">Tax-Deferred Growth</h3>
                  <p className="text-sm text-muted-foreground">
                    Your investments grow without being taxed each year. This compound growth can
                    significantly boost your retirement savings compared to taxable accounts.
                  </p>
                </div>

                <div className="rounded-2xl bg-card/60 p-6 ring-1 ring-border/50">
                  <h3 className="font-semibold text-foreground mb-2">Free Money from Employer</h3>
                  <p className="text-sm text-muted-foreground">
                    Employer matching is an instant 50-100% return on your contribution.
                    Not taking the full match is leaving money on the table.
                  </p>
                </div>

                <div className="rounded-2xl bg-card/60 p-6 ring-1 ring-border/50">
                  <h3 className="font-semibold text-foreground mb-2">Lower Your Tax Bill</h3>
                  <p className="text-sm text-muted-foreground">
                    Traditional 401(k) contributions reduce your taxable income now. If you're in
                    the 22% bracket, a $10,000 contribution saves you $2,200 in federal taxes.
                  </p>
                </div>
              </div>

              <div className="text-center mt-8">
                <Link href="/roth-401k" className="text-accent hover:underline text-sm">
                  Compare Roth vs Traditional 401(k) →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                {FAQ_DATA.map((faq, index) => (
                  <div key={index} className="rounded-2xl bg-card/60 p-6 ring-1 ring-border/50">
                    <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <FooterAd />
      </main>
    </SidebarLayout>
  )
}
