import { TAX_YEAR } from '@/lib/us-tax-calculator'
import {
  ArrowRightLeft,
  ArrowUpDown,
  ArrowUpRight,
  Baby,
  BarChart3,
  Briefcase,
  Building2,
  Calculator,
  Car,
  Clock,
  Coins,
  CreditCard,
  DollarSign,
  FileText,
  Flag,
  Gift,
  GraduationCap,
  Heart,
  Home,
  Laptop,
  type LucideIcon,
  MapPin,
  Percent,
  PiggyBank,
  Receipt,
  ReceiptText,
  Shield,
  Stethoscope,
  TrendingUp,
  Umbrella,
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
        href: '/hourly-to-salary',
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
        href: '/pay-raise',
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
        href: '/state/california',
        icon: Flag,
        description: 'CA income tax calculator',
      },
      {
        title: 'New York Tax',
        href: '/state/new-york',
        icon: Flag,
        description: 'NY state + NYC tax',
      },
      {
        title: 'Texas (No Tax)',
        href: '/state/texas',
        icon: Flag,
        description: 'TX salary calculator',
      },
      {
        title: 'Florida (No Tax)',
        href: '/state/florida',
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
        title: 'Roth 401(k)',
        href: '/roth-401k',
        icon: PiggyBank,
        description: 'After-tax retirement',
      },
      {
        title: 'IRA Calculator',
        href: '/ira-calculator',
        icon: Wallet,
        description: 'Traditional IRA deductions',
      },
      {
        title: 'Roth IRA',
        href: '/roth-ira',
        icon: Wallet,
        description: 'Roth contribution limits',
      },
      {
        title: 'HSA Calculator',
        href: '/hsa-calculator',
        icon: Stethoscope,
        description: 'Health Savings Account',
      },
      {
        title: 'Social Security',
        href: '/social-security',
        icon: Shield,
        description: 'Estimate SS benefits',
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
        title: 'Overtime Calculator',
        href: '/overtime-calculator',
        icon: Clock,
        description: '1.5x pay calculations',
      },
      {
        title: 'W-4 Calculator',
        href: '/w4-calculator',
        icon: FileText,
        description: 'Optimize withholding',
      },
      {
        title: 'Employer Cost',
        href: '/employer-cost',
        icon: Building2,
        description: 'Total cost to hire',
      },
    ],
  },
  {
    label: 'Self-Employed & Business',
    items: [
      {
        title: '1099 Calculator',
        href: '/1099-calculator',
        icon: Briefcase,
        description: 'Freelancer taxes',
      },
      {
        title: 'Self-Employment Tax',
        href: '/self-employment-tax',
        icon: Receipt,
        description: '15.3% SE tax',
      },
      {
        title: 'Quarterly Taxes',
        href: '/quarterly-taxes',
        icon: ReceiptText,
        description: 'Estimated payments',
      },
      {
        title: 'S-Corp Calculator',
        href: '/s-corp-calculator',
        icon: Building2,
        description: 'Reasonable salary',
      },
      {
        title: 'QBI Deduction',
        href: '/qbi-deduction',
        icon: Percent,
        description: '20% pass-through',
      },
      {
        title: 'Home Office',
        href: '/home-office-deduction',
        icon: Laptop,
        description: 'Deduction calculator',
      },
    ],
  },
  {
    label: 'Tax Credits & Deductions',
    items: [
      {
        title: 'Child Tax Credit',
        href: '/child-tax-credit',
        icon: Baby,
        description: '$2,000 per child',
      },
      {
        title: 'EITC Calculator',
        href: '/eitc-calculator',
        icon: DollarSign,
        description: 'Earned Income Credit',
      },
      {
        title: 'Education Credits',
        href: '/education-credits',
        icon: GraduationCap,
        description: 'AOC & Lifetime Learning',
      },
      {
        title: 'Student Loan Interest',
        href: '/student-loan-interest',
        icon: GraduationCap,
        description: 'Up to $2,500 deduction',
      },
      {
        title: 'Marriage Calculator',
        href: '/marriage-calculator',
        icon: Heart,
        description: 'Penalty or bonus?',
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
        title: 'Average US Salary',
        href: '/average-salary',
        icon: BarChart3,
        description: 'US salary statistics',
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
