import type { Metadata } from 'next'
import { SelfEmployedCalculator } from '@/components/self-employed-calculator'
import { SidebarLayout } from '@/components/sidebar-layout'
import { TAX_YEAR } from '@/lib/us-tax-calculator'
import { currentTaxConfig } from '@/lib/us-tax-config'
import { HeaderAd, InContentAd, FooterAd } from '@/components/ad-unit'
import Link from 'next/link'

export const metadata: Metadata = {
  title: `Self-Employment Tax Calculator ${TAX_YEAR} - 1099 & Freelancer Taxes`,
  description: `Calculate your self-employment tax for ${TAX_YEAR}. See Social Security (12.4%), Medicare (2.9%), federal income tax, and quarterly estimated payments. Includes SEP-IRA and Solo 401(k) retirement options.`,
  keywords: ['self employment tax', '1099 tax calculator', 'freelancer taxes', 'self employed calculator', 'quarterly taxes', 'SE tax', 'independent contractor taxes', `${TAX_YEAR} self employment`],
}

export default function SelfEmploymentTaxPage() {
  return (
    <SidebarLayout>
      <main id="main-content" className="flex-1">
        <HeaderAd />

        {/* Hero */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-flex items-center rounded-full bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent mb-6">
                {TAX_YEAR} Tax Year
              </span>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground text-balance mb-4">
                Self-Employment Tax Calculator
              </h1>
              <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
                Calculate your taxes as a freelancer, 1099 contractor, or small business owner.
                See your SE tax, income tax, and estimated quarterly payments.
              </p>
            </div>
          </div>
        </section>

        {/* Calculator */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <SelfEmployedCalculator />
          </div>
        </section>

        <InContentAd />

        {/* Key Info */}
        <section className="py-12 bg-muted/30 border-y border-border/40">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
                Self-Employment Tax Explained
              </h2>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="rounded-2xl bg-card/60 p-6 ring-1 ring-border/50">
                    <h3 className="font-semibold text-foreground mb-3">What is Self-Employment Tax?</h3>
                    <p className="text-sm text-muted-foreground">
                      SE tax is how self-employed individuals pay into Social Security and Medicare.
                      Employees split these taxes with their employer, but self-employed people pay
                      both portions - a total of 15.3%.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-card/60 p-6 ring-1 ring-border/50">
                    <h3 className="font-semibold text-foreground mb-3">SE Tax Rates for {TAX_YEAR}</h3>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• Social Security: <span className="font-semibold text-foreground">12.4%</span> (up to ${currentTaxConfig.socialSecurity.wageBase.toLocaleString()})</li>
                      <li>• Medicare: <span className="font-semibold text-foreground">2.9%</span> (no limit)</li>
                      <li>• Additional Medicare: <span className="font-semibold text-foreground">0.9%</span> (over $200k single)</li>
                      <li>• Total: <span className="font-semibold text-foreground">15.3%</span> (on 92.35% of net earnings)</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-2xl bg-card/60 p-6 ring-1 ring-border/50">
                    <h3 className="font-semibold text-foreground mb-3">The 50% Deduction</h3>
                    <p className="text-sm text-muted-foreground">
                      You can deduct half of your self-employment tax when calculating your adjusted
                      gross income. This reduces your income tax, partially offsetting the higher
                      SE tax rate compared to employees.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-card/60 p-6 ring-1 ring-border/50">
                    <h3 className="font-semibold text-foreground mb-3">Who Pays SE Tax?</h3>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>• Freelancers and 1099 contractors</li>
                      <li>• Sole proprietors</li>
                      <li>• Partners in a partnership</li>
                      <li>• Single-member LLC owners</li>
                      <li>• Anyone with net SE earnings of $400+</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="text-center mt-8">
                <Link href="/fica-taxes" className="text-accent hover:underline text-sm">
                  Learn more about FICA taxes →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Deductions Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
                Common Self-Employed Deductions
              </h2>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { title: 'Home Office', desc: '$5/sq ft simplified method, up to 300 sq ft' },
                  { title: 'Health Insurance', desc: '100% deductible for self, spouse, dependents' },
                  { title: 'Retirement (SEP/Solo 401k)', desc: 'Up to $69,000 for 2025' },
                  { title: 'Business Equipment', desc: 'Section 179 deduction up to $1.22M' },
                  { title: 'Vehicle Expenses', desc: '$0.67/mile for 2024, $0.70/mile for 2025' },
                  { title: 'Professional Services', desc: 'Accounting, legal, consulting fees' },
                ].map((item) => (
                  <div key={item.title} className="rounded-xl bg-card/60 p-4 ring-1 ring-border/50">
                    <h3 className="font-semibold text-foreground text-sm">{item.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
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
                <Link href="/fica-taxes" className="text-accent hover:underline">FICA Taxes</Link>
                <span className="text-muted-foreground">•</span>
                <Link href="/quarterly-taxes" className="text-accent hover:underline">Quarterly Taxes</Link>
                <span className="text-muted-foreground">•</span>
                <Link href="/401k-calculator" className="text-accent hover:underline">Solo 401(k)</Link>
              </div>
            </div>
          </div>
        </section>

        <FooterAd />
      </main>
    </SidebarLayout>
  )
}
