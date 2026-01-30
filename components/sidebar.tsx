'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ChevronLeft } from 'lucide-react'
import { useState } from 'react'
import { TAX_YEAR } from '@/lib/us-tax-calculator'
import { navSections } from '@/lib/nav-config'

interface SidebarProps {
  mobileOpen: boolean
  onMobileClose: () => void
}

export function Sidebar({ mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] border-r border-border/40 bg-background transition-all duration-300',
          collapsed ? 'w-16' : 'w-72',
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Collapse button - desktop only */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3 top-6 z-50 hidden h-6 w-6 items-center justify-center rounded-full border border-border bg-background shadow-sm hover:bg-muted md:flex"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft
              className={cn(
                'h-4 w-4 transition-transform',
                collapsed && 'rotate-180'
              )}
            />
          </button>

          {/* Navigation */}
          <nav className="flex-1 space-y-4 p-3 overflow-y-auto">
            {navSections.map((section) => (
              <div key={section.label} className="mb-2">
                {!collapsed && (
                  <div className="px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    {section.label}
                  </div>
                )}
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      (item.href !== '/' && pathname.startsWith(item.href))
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onMobileClose}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-accent/10 text-accent'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        )}
                      >
                        <item.icon className={cn('h-5 w-5 shrink-0', isActive && 'text-accent')} />
                        {!collapsed && (
                          <div className="flex flex-col">
                            <span>{item.title}</span>
                            <span className="text-xs text-muted-foreground font-normal">
                              {item.description}
                            </span>
                          </div>
                        )}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Footer */}
          {!collapsed && (
            <div className="border-t border-border/40 p-4">
              <div className="rounded-lg bg-accent/10 p-3">
                <p className="text-xs text-muted-foreground">
                  Tax calculations based on IRS rates for the {TAX_YEAR} tax year.
                </p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
