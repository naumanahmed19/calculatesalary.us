'use client'

import { cn } from '@/lib/utils'

const ENABLE_ADS = process.env.NEXT_PUBLIC_ENABLE_ADS === 'true'

// High-converting AdSense sizes based on Google's recommendations
// 1. Leaderboard (728x90) - Best for header placement
// 2. Large Rectangle (336x280) - Highest click-through rate
// 3. Medium Rectangle (300x250) - Most popular, versatile
// 4. Wide Skyscraper (160x600) - Best for sidebars
// 5. Mobile Banner (320x100) - Optimized for mobile
// 6. In-Article (Responsive) - Native content ads

type AdSize = 
  | 'leaderboard'       // 728x90 - Header
  | 'large-rectangle'   // 336x280 - Best CTR
  | 'medium-rectangle'  // 300x250 - Most versatile
  | 'wide-skyscraper'   // 160x600 - Sidebar
  | 'mobile-banner'     // 320x100 - Mobile header
  | 'in-article'        // Responsive - Content
  | 'billboard'         // 970x250 - Premium

interface AdUnitProps {
  size: AdSize
  className?: string
  slot?: string // AdSense slot ID
}

const AD_SIZES = {
  'leaderboard': { width: 728, height: 90, label: 'Advertisement' },
  'large-rectangle': { width: 336, height: 280, label: 'Sponsored' },
  'medium-rectangle': { width: 300, height: 250, label: 'Sponsored' },
  'wide-skyscraper': { width: 160, height: 600, label: 'Ad' },
  'mobile-banner': { width: 320, height: 100, label: 'Advertisement' },
  'in-article': { width: 0, height: 0, label: 'Sponsored Content' },
  'billboard': { width: 970, height: 250, label: 'Advertisement' },
}

export function AdUnit({ size, className, slot }: AdUnitProps) {
  if (!ENABLE_ADS) return null

  const adConfig = AD_SIZES[size]
  const isResponsive = size === 'in-article'

  return (
    <div 
      className={cn(
        'flex flex-col items-center justify-center mx-auto',
        className
      )}
    >
      {/* AdSense placeholder - replace with actual ad code */}
      <div
        className={cn(
          'relative flex items-center justify-center',
          'bg-gradient-to-br from-muted/40 to-muted/60',
          'border border-dashed border-border/60 rounded-lg',
          'transition-all duration-300',
          isResponsive && 'w-full aspect-[4/1] max-h-[250px]'
        )}
        style={!isResponsive ? { 
          width: `${adConfig.width}px`, 
          height: `${adConfig.height}px`,
          maxWidth: '100%'
        } : undefined}
        data-ad-slot={slot}
        data-ad-size={size}
      >
        {/* Visual placeholder content */}
        <div className="text-center px-4">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-medium">
            {adConfig.label}
          </span>
        </div>
      </div>
    </div>
  )
}

// Pre-configured ad placements for common use cases

// Header ad - visible on desktop, high visibility
export function HeaderAd({ className }: { className?: string }) {
  if (!ENABLE_ADS) return null
  return (
    <div className={cn('hidden md:block py-4 bg-muted/20', className)}>
      <AdUnit size="leaderboard" />
    </div>
  )
}

// Mobile header ad - visible on mobile only
export function MobileHeaderAd({ className }: { className?: string }) {
  if (!ENABLE_ADS) return null
  return (
    <div className={cn('md:hidden py-3 bg-muted/20', className)}>
      <AdUnit size="mobile-banner" />
    </div>
  )
}

// In-content ad - placed between content sections
export function InContentAd({ className }: { className?: string }) {
  if (!ENABLE_ADS) return null
  return (
    <div className={cn('py-6', className)}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Desktop: Large rectangle for best CTR */}
          <div className="hidden md:block">
            <AdUnit size="large-rectangle" />
          </div>
          {/* Mobile: Medium rectangle */}
          <div className="md:hidden">
            <AdUnit size="medium-rectangle" />
          </div>
        </div>
      </div>
    </div>
  )
}

// In-article native ad - flows with content
export function InArticleAd({ className }: { className?: string }) {
  if (!ENABLE_ADS) return null
  return (
    <div className={cn('py-6 my-6 border-y border-border/30', className)}>
      <div className="max-w-2xl mx-auto px-4">
        <AdUnit size="in-article" />
      </div>
    </div>
  )
}

// Sidebar ad - for pages with sidebar layouts
export function SidebarAd({ className }: { className?: string }) {
  if (!ENABLE_ADS) return null
  return (
    <div className={cn('sticky top-4', className)}>
      <AdUnit size="medium-rectangle" />
    </div>
  )
}

// Footer/before-leaving ad - captures exiting users
export function FooterAd({ className }: { className?: string }) {
  if (!ENABLE_ADS) return null
  return (
    <div className={cn('py-8 bg-muted/30 border-t border-border/40', className)}>
      <div className="container mx-auto px-4">
        {/* Desktop: Billboard for maximum impact */}
        <div className="hidden lg:block">
          <AdUnit size="billboard" />
        </div>
        {/* Tablet: Leaderboard */}
        <div className="hidden md:block lg:hidden">
          <AdUnit size="leaderboard" />
        </div>
        {/* Mobile: Medium rectangle */}
        <div className="md:hidden">
          <AdUnit size="medium-rectangle" />
        </div>
      </div>
    </div>
  )
}
