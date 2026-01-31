'use client'

import Link from 'next/link'
import {
  Calculator,
  Menu,
  Briefcase,
  Search,
  HandCoins,
  ChevronDown,
  Clock,
  Accessibility,
  Stethoscope,
  Utensils,
  Baby,
  Home,
  Receipt,
  Shield,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { TAX_YEAR } from '@/lib/us-tax-calculator'
import { CalculatorSearch } from '@/components/calculator-search'

interface SiteHeaderProps {
  onMenuClick?: () => void
}

const benefitCategories = [
  { name: 'Retirement Benefits', href: '/benefits?category=retirement', icon: Clock, color: 'text-orange-500' },
  { name: 'Disability Benefits', href: '/benefits?category=disability', icon: Accessibility, color: 'text-blue-500' },
  { name: 'Healthcare', href: '/benefits?category=healthcare', icon: Stethoscope, color: 'text-red-500' },
  { name: 'Food Assistance', href: '/benefits?category=food', icon: Utensils, color: 'text-green-500' },
  { name: 'Family Support', href: '/benefits?category=family', icon: Baby, color: 'text-pink-500' },
  { name: 'Housing Assistance', href: '/benefits?category=housing', icon: Home, color: 'text-amber-500' },
  { name: 'Tax Credits', href: '/benefits?category=tax-credits', icon: Receipt, color: 'text-emerald-500' },
  { name: 'Veterans Benefits', href: '/benefits?category=veterans', icon: Shield, color: 'text-indigo-500' },
]

export function SiteHeader({ onMenuClick }: SiteHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [benefitsOpen, setBenefitsOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-4">
          {/* Left section - Logo */}
          <div className="flex items-center gap-3 shrink-0">
            {onMenuClick && (
              <button
                onClick={onMenuClick}
                className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted md:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            )}
            <Link href="/" className="flex items-center gap-2">
              <Calculator className="h-6 w-6 text-accent" />
              <span className="hidden sm:inline font-semibold text-lg">US Salary Calculator</span>
            </Link>
          </div>

          {/* Center section - Search */}
          <div className="flex flex-1 justify-center px-4">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex w-full max-w-md items-center gap-2 rounded-lg border border-border/50 bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-accent/50 hover:bg-accent/10 hover:text-accent"
            >
              <Search className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left">Search calculators...</span>
              <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium sm:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>
          </div>

          {/* Right section - Links */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Benefits Dropdown */}
            <div
              className="relative hidden md:block"
              onMouseEnter={() => setBenefitsOpen(true)}
              onMouseLeave={() => setBenefitsOpen(false)}
            >
              <Link
                href="/benefits"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-accent transition-colors"
              >
                <HandCoins className="h-4 w-4" />
                Benefits
                <ChevronDown className={`h-3 w-3 transition-transform ${benefitsOpen ? 'rotate-180' : ''}`} />
              </Link>
              {benefitsOpen && (
                <div className="absolute right-0 top-full pt-2 z-50">
                  <div className="w-72 rounded-xl border border-border/50 bg-background/95 backdrop-blur-sm p-3 shadow-xl">
                    <div className="grid gap-1">
                      {benefitCategories.map((category) => {
                        const Icon = category.icon
                        return (
                          <Link
                            key={category.href}
                            href={category.href}
                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-muted transition-colors"
                          >
                            <Icon className={`h-4 w-4 ${category.color}`} />
                            <span className="font-medium text-foreground">{category.name}</span>
                          </Link>
                        )
                      })}
                    </div>
                    <div className="mt-2 pt-2 border-t border-border/50">
                      <Link
                        href="/benefits"
                        className="flex items-center justify-center gap-2 rounded-lg bg-accent/10 px-3 py-2 text-sm font-medium text-accent hover:bg-accent/20 transition-colors"
                      >
                        View All Benefits
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <Link
              href="/salaries"
              className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-accent transition-colors"
            >
              <Briefcase className="h-4 w-4" />
              Salaries by Job
            </Link>
            <span className="hidden lg:inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
              {TAX_YEAR} Tax Year
            </span>
          </div>
        </div>
      </header>

      <CalculatorSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  )
}
