import { Metadata } from 'next'
import { TAX_YEAR } from '@/lib/us-tax-calculator'

export const metadata: Metadata = {
  title: {
    template: '%s | US Benefits Guide | CalculateSalary.co',
    default: `US Federal Benefits Guide 2025 | Find Benefits You're Entitled To`,
  },
  description:
    'Comprehensive guide to US federal benefits including Social Security, Medicare, Medicaid, SNAP, TANF, SSI, EITC, housing assistance, and veterans benefits. Check your eligibility and learn how to apply.',
  keywords: [
    'US federal benefits',
    'Social Security benefits',
    'Medicare eligibility',
    'Medicaid application',
    'SNAP food stamps',
    'TANF cash assistance',
    'SSI benefits',
    'EITC tax credit',
    'Section 8 housing',
    'veterans benefits',
    'disability benefits',
    'government assistance programs',
    'benefits calculator',
    '2025 benefits',
  ],
  openGraph: {
    title: `US Federal Benefits Guide 2025 | Find Benefits You're Entitled To`,
    description:
      'Comprehensive guide to US federal benefits. Check eligibility for Social Security, Medicare, SNAP, housing assistance, tax credits, and more.',
    type: 'website',
    locale: 'en_US',
    siteName: 'CalculateSalary.co',
  },
  twitter: {
    card: 'summary_large_image',
    title: `US Federal Benefits Guide 2025`,
    description: 'Find federal benefits you may be entitled to. Check eligibility and learn how to apply.',
  },
  alternates: {
    canonical: 'https://calculatesalary.co/benefits',
  },
}

export default function BenefitsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
