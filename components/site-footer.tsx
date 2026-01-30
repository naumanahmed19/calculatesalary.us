import Link from 'next/link'
import { COMMON_SALARIES, formatCurrency, TAX_YEAR } from '@/lib/us-tax-calculator'

export function SiteFooter() {
  const popularSalaries = [40000, 50000, 60000, 75000, 85000, 100000, 120000, 150000]

  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">US Salary Calculator</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Calculate your take-home pay for the {TAX_YEAR} tax year. Our calculator includes Federal Tax,
              State Tax, Social Security, Medicare, and 401(k) contributions.
            </p>
          </div>

          {/* Popular Salaries */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Popular Salaries</h3>
            <ul className="grid grid-cols-2 gap-2">
              {popularSalaries.slice(0, 8).map((salary) => (
                <li key={salary}>
                  <Link
                    href={`/salary/${salary}`}
                    className="text-sm text-muted-foreground hover:text-accent transition-colors"
                  >
                    {formatCurrency(salary, 0)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/tax-brackets"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  Tax Brackets {TAX_YEAR}
                </Link>
              </li>
              <li>
                <Link
                  href="/fica-taxes"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  FICA Tax Rates
                </Link>
              </li>
              <li>
                <Link
                  href="/401k-calculator"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  401(k) Calculator
                </Link>
              </li>
              <li>
                <a
                  href="https://www.irs.gov/individuals/tax-withholding-estimator"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-accent transition-colors"
                >
                  IRS Withholding Estimator
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Disclaimer</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              This calculator provides estimates based on standard US tax rates for the {TAX_YEAR} tax year.
              Results are for guidance only. For accurate tax advice, consult the IRS or a qualified tax professional.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border/40">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} US Salary Calculator. Tax rates based on IRS {TAX_YEAR} guidelines.
            </p>
            <div className="flex gap-4">
              <Link href="/privacy-policy" className="text-xs text-muted-foreground hover:text-accent transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-xs text-muted-foreground hover:text-accent transition-colors">
                Terms of Service
              </Link>
              <Link href="/sitemap.xml" className="text-xs text-muted-foreground hover:text-accent transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
