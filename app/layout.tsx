import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { TAX_YEAR } from '@/lib/us-tax-calculator'
import { CookieConsent } from '@/components/cookie-consent'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

const BASE_URL = 'https://ussalarycalculator.com'

export const metadata: Metadata = {
  title: {
    default: `US Salary Calculator ${TAX_YEAR} - Take Home Pay Calculator`,
    template: '%s | US Salary Calculator',
  },
  description: `Free US salary calculator for ${TAX_YEAR} tax year. Calculate your take-home pay including Federal Tax, State Tax, Social Security, Medicare, and 401(k) deductions.`,
  keywords: ['us salary calculator', 'take home pay', 'federal tax calculator', 'state tax calculator', 'paycheck calculator', `${TAX_YEAR} tax year`, 'after tax calculator', 'net pay calculator'],
  authors: [{ name: 'US Salary Calculator' }],
  creator: 'US Salary Calculator',
  publisher: 'US Salary Calculator',
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'US Salary Calculator',
    title: `US Salary Calculator ${TAX_YEAR} - Take Home Pay Calculator`,
    description: `Free US salary calculator for ${TAX_YEAR}. Calculate take-home pay after Federal Tax, State Tax, Social Security, Medicare, and 401(k).`,
  },
  twitter: {
    card: 'summary_large_image',
    title: `US Salary Calculator ${TAX_YEAR}`,
    description: `Calculate your US take-home pay for ${TAX_YEAR} tax year`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your Google Search Console verification code here
    // google: 'your-verification-code',
  },
  generator: 'Next.js',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

// WebSite Schema for Google Search
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${BASE_URL}/#website`,
  url: BASE_URL,
  name: 'US Salary Calculator',
  description: `Free US salary calculator for ${TAX_YEAR} tax year`,
  publisher: {
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    name: 'US Salary Calculator',
    url: BASE_URL,
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${BASE_URL}/salary/{search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}

// Organization Schema
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${BASE_URL}/#organization`,
  name: 'US Salary Calculator',
  url: BASE_URL,
  logo: `${BASE_URL}/icon.svg`,
  sameAs: [],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en-US">
      <head>
        {/* Add Google Analytics when ready */}
        {/*
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=YOUR-GA-ID"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'YOUR-GA-ID');
          `}
        </Script>
        */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="US Salary Calc" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className={`font-sans antialiased`}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50">
          Skip to main content
        </a>
        {children}
        <CookieConsent />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
