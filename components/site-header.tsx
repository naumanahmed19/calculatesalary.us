'use client'

import Link from 'next/link'
import { Calculator, Menu, Briefcase, Search } from 'lucide-react'
import { useState, useEffect } from 'react'
import { TAX_YEAR } from '@/lib/us-tax-calculator'
import { CalculatorSearch } from '@/components/calculator-search'

interface SiteHeaderProps {
  onMenuClick?: () => void
}

export function SiteHeader({ onMenuClick }: SiteHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false)

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
