import { TAX_YEAR } from '@/lib/us-tax-calculator'
import {
  ArrowRightLeft,
  ArrowUpDown,
  ArrowUpRight,
  BarChart3,
  Briefcase,
  Building2,
  Calculator,
  Clock,
  Coins,
  Flag,
  Gift,
  HandCoins,
  Home,
  type LucideIcon,
  MapPin,
  PiggyBank,
  Receipt,
  ReceiptText,
  Shield,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react'

export type NavItem = {
  title: string
  href: string
  icon: LucideIcon
  description: string
}

export type NavSection = {
  label: string
  items: NavItem[]
}

export const navSections: NavSection[] = [
  {
    label: 'Calculators',
    items: [
      {
        title: 'Salary Calculator',
        href: '/',
        icon: Calculator,
        description: 'Calculate take-home pay',
      },
      {
        title: 'Hourly to Salary',
        href: '/hourly',
        icon: Clock,
        description: 'Hourly to annual salary',
      },
      {
        title: 'Salary Comparison',
        href: '/salary-comparison',
        icon: ArrowRightLeft,
        description: 'Compare multiple salaries',
      },
      {
        title: 'Pay Raise',
        href: '/pay-rise',
        icon: ArrowUpRight,
        description: 'Calculate raise impact',
      },
      {
        title: 'Net to Gross',
        href: '/net-to-gross',
        icon: ArrowUpDown,
        description: 'Reverse tax calculator',
      },
      {
        title: 'Income Percentile',
        href: '/income-percentile',
        icon: BarChart3,
        description: 'Where do you rank?',
      },
      {
        title: 'Cost of Living',
        href: '/cost-of-living',
        icon: MapPin,
        description: 'US city comparisons',
      },
      {
        title: 'Mortgage Affordability',
        href: '/mortgage-affordability',
        icon: Home,
        description: 'How much can you borrow?',
      },
    ],
  },
  {
    label: 'State Taxes',
    items: [
      {
        title: 'California Tax',
        href: '/state/ca',
        icon: Flag,
        description: 'CA income tax calculator',
      },
      {
        title: 'New York Tax',
        href: '/state/ny',
        icon: Flag,
        description: 'NY state + NYC tax',
      },
      {
        title: 'Texas (No Tax)',
        href: '/state/tx',
        icon: Flag,
        description: 'TX salary calculator',
      },
      {
        title: 'Florida (No Tax)',
        href: '/state/fl',
        icon: Flag,
        description: 'FL salary calculator',
      },
      {
        title: 'All States',
        href: '/state-taxes',
        icon: MapPin,
        description: 'Compare all 50 states',
      },
    ],
  },
  {
    label: 'Retirement & Benefits',
    items: [
      {
        title: '401(k) Calculator',
        href: '/401k-calculator',
        icon: PiggyBank,
        description: 'Traditional 401(k) savings',
      },
      {
        title: 'Pension Calculator',
        href: '/pension-calculator',
        icon: PiggyBank,
        description: '401(k) contribution calculator',
      },
      {
        title: 'Savings Calculator',
        href: '/savings-calculator',
        icon: Wallet,
        description: 'Compound interest growth',
      },
      {
        title: 'US Benefits Guide',
        href: '/benefits',
        icon: HandCoins,
        description: 'Find benefits you\'re entitled to',
      },
    ],
  },
  {
    label: 'Employment',
    items: [
      {
        title: 'Multiple Jobs',
        href: '/multiple-jobs',
        icon: Users,
        description: 'Tax on 2nd job',
      },
      {
        title: 'Bonus Tax',
        href: '/bonus-tax',
        icon: Gift,
        description: '22% federal withholding',
      },
      {
        title: 'Employer Cost',
        href: '/employer-cost',
        icon: Building2,
        description: 'Total cost to hire',
      },
      {
        title: 'Job Salaries',
        href: '/salaries',
        icon: Briefcase,
        description: 'Salary by profession',
      },
    ],
  },
  {
    label: 'Self-Employed',
    items: [
      {
        title: 'Self-Employment Tax',
        href: '/self-employment-tax',
        icon: Receipt,
        description: '15.3% SE tax',
      },
    ],
  },
  {
    label: 'Tax Information',
    items: [
      {
        title: 'Federal Tax Brackets',
        href: '/tax-brackets',
        icon: Receipt,
        description: `${TAX_YEAR} tax rates`,
      },
      {
        title: 'FICA Taxes',
        href: '/fica-taxes',
        icon: Shield,
        description: 'SS & Medicare explained',
      },
      {
        title: 'Capital Gains Tax',
        href: '/capital-gains-tax',
        icon: TrendingUp,
        description: 'Short & long-term',
      },
      {
        title: 'Minimum Wage',
        href: '/minimum-wage',
        icon: Coins,
        description: 'Federal & state rates',
      },
      {
        title: 'Tax Refund Estimator',
        href: '/tax-refund',
        icon: ReceiptText,
        description: 'Estimate your refund',
      },
    ],
  },
]

export const navItems = navSections.flatMap((section) => section.items)
