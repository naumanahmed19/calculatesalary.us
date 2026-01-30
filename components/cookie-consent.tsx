'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X, Cookie } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

type ConsentState = 'pending' | 'accepted' | 'rejected' | 'custom'

interface CookiePreferences {
  essential: boolean
  analytics: boolean
  advertising: boolean
}

const CONSENT_COOKIE_NAME = 'cookie_consent'
const CONSENT_VERSION = '1'

function getStoredConsent(): { state: ConsentState; preferences: CookiePreferences } | null {
  if (typeof window === 'undefined') return null
  
  try {
    const stored = localStorage.getItem(CONSENT_COOKIE_NAME)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed.version === CONSENT_VERSION) {
        return parsed
      }
    }
  } catch {
    return null
  }
  return null
}

function setStoredConsent(state: ConsentState, preferences: CookiePreferences) {
  if (typeof window === 'undefined') return
  
  localStorage.setItem(CONSENT_COOKIE_NAME, JSON.stringify({
    version: CONSENT_VERSION,
    state,
    preferences,
    timestamp: new Date().toISOString(),
  }))
}

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: true,
    advertising: false,
  })

  useEffect(() => {
    const stored = getStoredConsent()
    if (!stored) {
      const timer = setTimeout(() => setIsVisible(true), 1000)
      return () => clearTimeout(timer)
    }
    setPreferences(stored.preferences)
  }, [])

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      essential: true,
      analytics: true,
      advertising: true,
    }
    setStoredConsent('accepted', allAccepted)
    setPreferences(allAccepted)
    setIsVisible(false)
  }

  const handleRejectAll = () => {
    const essentialOnly: CookiePreferences = {
      essential: true,
      analytics: false,
      advertising: false,
    }
    setStoredConsent('rejected', essentialOnly)
    setPreferences(essentialOnly)
    setIsVisible(false)
  }

  const handleSavePreferences = () => {
    setStoredConsent('custom', preferences)
    setIsVisible(false)
    setShowPreferences(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <div className="mx-auto max-w-4xl rounded-2xl bg-card border border-border shadow-2xl">
        {showPreferences ? (
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Cookie className="h-5 w-5 text-accent" />
                Cookie Preferences
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowPreferences(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="font-medium text-foreground">Essential Cookies</p>
                  <p className="text-sm text-muted-foreground">Required for the site to function properly</p>
                </div>
                <div className="text-sm text-muted-foreground">Always on</div>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-border">
                <div>
                  <p className="font-medium text-foreground">Analytics Cookies</p>
                  <p className="text-sm text-muted-foreground">Help us understand how visitors use our site</p>
                </div>
                <Switch
                  id="analytics"
                  checked={preferences.analytics}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, analytics: checked })}
                />
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-foreground">Advertising Cookies</p>
                  <p className="text-sm text-muted-foreground">Used to show relevant advertisements</p>
                </div>
                <Switch
                  id="advertising"
                  checked={preferences.advertising}
                  onCheckedChange={(checked) => setPreferences({ ...preferences, advertising: checked })}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleSavePreferences} className="flex-1">
                Save Preferences
              </Button>
              <Button onClick={handleAcceptAll} variant="outline" className="flex-1">
                Accept All
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <Cookie className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
              <div className="flex-1 space-y-3">
                <p className="text-sm text-foreground leading-relaxed">
                  We use cookies to enhance your experience, analyse site traffic, and serve relevant 
                  advertisements. By clicking &quot;Accept All&quot;, you consent to our use of cookies. 
                  Read our{' '}
                  <Link href="/privacy-policy" className="text-accent hover:underline">
                    Privacy Policy
                  </Link>
                  {' '}for more information.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={handleAcceptAll} size="sm">
                    Accept All
                  </Button>
                  <Button onClick={handleRejectAll} variant="outline" size="sm">
                    Reject All
                  </Button>
                  <Button 
                    onClick={() => setShowPreferences(true)} 
                    variant="ghost" 
                    size="sm"
                    className="text-muted-foreground"
                  >
                    Manage Preferences
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
