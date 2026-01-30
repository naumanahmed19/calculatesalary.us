'use client'

import { ReactNode, useState } from 'react'
import { SiteHeader } from './site-header'
import { SiteFooter } from './site-footer'
import { Sidebar } from './sidebar'

interface SidebarLayoutProps {
  children: ReactNode
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader onMenuClick={() => setMobileOpen(true)} />
      <div className="flex flex-1">
        <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
        <div className="flex-1 md:ml-72 transition-all duration-300">
          {children}
          <SiteFooter />
        </div>
      </div>
    </div>
  )
}
