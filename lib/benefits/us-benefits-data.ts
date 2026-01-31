// US Federal Benefits Data - 2025
// Sources: SSA.gov, IRS.gov, USDA FNS, HHS.gov, Benefits.gov

import {
  Baby,
  Briefcase,
  Building2,
  Clock,
  Coins,
  DollarSign,
  GraduationCap,
  Heart,
  Home,
  type LucideIcon,
  Shield,
  ShieldCheck,
  Stethoscope,
  Users,
  Utensils,
  Wallet,
  Accessibility,
  Banknote,
  Receipt,
  FileText,
} from 'lucide-react'

export type BenefitCategory =
  | 'retirement'
  | 'disability'
  | 'healthcare'
  | 'food'
  | 'family'
  | 'housing'
  | 'tax-credits'
  | 'unemployment'
  | 'veterans'

export type CategoryInfo = {
  name: string
  icon: LucideIcon
  description: string
  color: string
}

export type USBenefit = {
  slug: string
  name: string
  shortDescription: string
  description: string
  category: BenefitCategory
  icon: LucideIcon
  monthlyAmount: string
  annualAmount?: string
  eligibility: string[]
  howToClaim: string
  claimUrl?: string
  keywords: string[]
}

export const BENEFIT_CATEGORIES: Record<BenefitCategory, CategoryInfo> = {
  retirement: {
    name: 'Retirement Benefits',
    icon: Clock,
    description: 'Social Security retirement benefits and pension programs',
    color: 'text-orange-500',
  },
  disability: {
    name: 'Disability Benefits',
    icon: Accessibility,
    description: 'Benefits for individuals with disabilities',
    color: 'text-blue-500',
  },
  healthcare: {
    name: 'Healthcare Benefits',
    icon: Stethoscope,
    description: 'Health insurance and medical assistance programs',
    color: 'text-red-500',
  },
  food: {
    name: 'Food Assistance',
    icon: Utensils,
    description: 'Nutrition assistance and food programs',
    color: 'text-green-500',
  },
  family: {
    name: 'Family Support',
    icon: Baby,
    description: 'Benefits for families with children',
    color: 'text-pink-500',
  },
  housing: {
    name: 'Housing Assistance',
    icon: Home,
    description: 'Housing assistance and rental support programs',
    color: 'text-amber-500',
  },
  'tax-credits': {
    name: 'Tax Credits',
    icon: Receipt,
    description: 'Refundable and non-refundable tax credits',
    color: 'text-emerald-500',
  },
  unemployment: {
    name: 'Unemployment Benefits',
    icon: Briefcase,
    description: 'Unemployment insurance and job assistance',
    color: 'text-purple-500',
  },
  veterans: {
    name: 'Veterans Benefits',
    icon: Shield,
    description: 'Benefits for military veterans and their families',
    color: 'text-indigo-500',
  },
}

export const US_BENEFITS: USBenefit[] = [
  {
    slug: 'social-security-retirement',
    name: 'Social Security Retirement',
    shortDescription: 'Monthly retirement benefits based on lifetime earnings',
    description:
      'Social Security retirement benefits provide monthly income to workers who have earned enough credits through employment. The amount depends on your lifetime earnings, age when you start receiving benefits, and work history.',
    category: 'retirement',
    icon: Clock,
    monthlyAmount: 'Up to $4,873/month',
    annualAmount: 'Up to $58,476/year',
    eligibility: [
      'Earned at least 40 work credits (about 10 years of work)',
      'Age 62 or older for reduced benefits',
      'Full retirement age is 66-67 depending on birth year',
      'Maximum benefits at age 70',
      'U.S. citizen or legal resident',
    ],
    howToClaim: 'Apply online at ssa.gov up to 4 months before you want benefits to start. You can also call Social Security at 1-800-772-1213 or visit your local Social Security office in person.',
    claimUrl: 'https://www.ssa.gov/benefits/retirement/',
    keywords: ['social security', 'retirement', 'pension', 'FICA', 'SSA'],
  },
  {
    slug: 'social-security-disability',
    name: 'Social Security Disability (SSDI)',
    shortDescription: 'Benefits for workers who become disabled',
    description:
      'SSDI provides monthly income to workers who become disabled and can no longer work. Benefits are based on your lifetime earnings before the disability began. You must have worked long enough and recently enough to qualify.',
    category: 'disability',
    icon: Accessibility,
    monthlyAmount: 'Up to $3,822/month',
    annualAmount: 'Up to $45,864/year',
    eligibility: [
      'Have a medical condition expected to last at least 12 months or result in death',
      'Unable to work due to the disability',
      'Earned enough work credits based on age when disabled',
      'Generally need 20 credits in the last 10 years',
      'Not currently performing substantial gainful activity',
    ],
    howToClaim: 'Apply online at ssa.gov/disability or call 1-800-772-1213 to start your application. Gather medical records and treatment history before applying.',
    claimUrl: 'https://www.ssa.gov/benefits/disability/',
    keywords: ['SSDI', 'disability', 'disabled', 'SSA', 'disability insurance'],
  },
  {
    slug: 'ssi',
    name: 'Supplemental Security Income (SSI)',
    shortDescription: 'Cash assistance for aged, blind, and disabled with limited income',
    description:
      'SSI is a federal program providing monthly cash assistance to people 65 or older, blind, or disabled who have limited income and resources. Unlike SSDI, SSI does not require work history - eligibility is based on financial need.',
    category: 'disability',
    icon: Coins,
    monthlyAmount: '$967/month individual',
    annualAmount: '$11,604/year individual',
    eligibility: [
      'Age 65 or older, or blind, or disabled',
      'Limited income (varies by state and living situation)',
      'Resources under $2,000 individual or $3,000 couple',
      'U.S. citizen or qualifying non-citizen',
      'Resident of the United States',
    ],
    howToClaim: 'Apply in person at your local Social Security office or call 1-800-772-1213 to schedule an appointment. Bring proof of age, citizenship, income, and resources.',
    claimUrl: 'https://www.ssa.gov/ssi/',
    keywords: ['SSI', 'supplemental security income', 'disability', 'aged', 'blind'],
  },
  {
    slug: 'medicare',
    name: 'Medicare',
    shortDescription: 'Federal health insurance for seniors and disabled individuals',
    description:
      'Medicare is the federal health insurance program for people 65 and older, people under 65 with certain disabilities, and people with End-Stage Renal Disease. It covers hospital care, medical services, and prescription drugs.',
    category: 'healthcare',
    icon: Stethoscope,
    monthlyAmount: 'Part B: $185/month premium',
    eligibility: [
      'Age 65 or older and U.S. citizen or permanent resident for 5+ years',
      'Under 65 with a qualifying disability (after 24 months on SSDI)',
      'Any age with End-Stage Renal Disease or ALS',
      'Eligible for Social Security or Railroad Retirement benefits',
    ],
    howToClaim: 'If you receive Social Security benefits, you will be automatically enrolled at 65. Otherwise, enroll during your Initial Enrollment Period at medicare.gov or by calling 1-800-MEDICARE.',
    claimUrl: 'https://www.medicare.gov/',
    keywords: ['Medicare', 'health insurance', 'Part A', 'Part B', 'Part D', 'seniors'],
  },
  {
    slug: 'medicaid',
    name: 'Medicaid',
    shortDescription: 'Free or low-cost health coverage for low-income individuals',
    description:
      'Medicaid is a joint federal and state program providing free or low-cost health coverage to millions of Americans. Coverage varies by state but generally includes doctor visits, hospital care, nursing home care, and more.',
    category: 'healthcare',
    icon: Heart,
    monthlyAmount: 'Free or very low-cost',
    eligibility: [
      'Low income (varies by state, generally up to 138% FPL in expansion states)',
      'Pregnant women, children, parents, and caretakers',
      'Seniors and people with disabilities',
      'U.S. citizen or qualifying immigration status',
      'Eligibility rules vary significantly by state',
    ],
    howToClaim: 'Apply through your state Medicaid agency or through HealthCare.gov marketplace. Many states have online applications available.',
    claimUrl: 'https://www.medicaid.gov/',
    keywords: ['Medicaid', 'health coverage', 'low income', 'ACA', 'expansion'],
  },
  {
    slug: 'snap',
    name: 'SNAP (Food Stamps)',
    shortDescription: 'Monthly benefits to buy food for low-income households',
    description:
      'The Supplemental Nutrition Assistance Program (SNAP), formerly known as Food Stamps, provides monthly benefits on an EBT card to help low-income individuals and families buy food.',
    category: 'food',
    icon: Utensils,
    monthlyAmount: 'Up to $292/month single',
    annualAmount: 'Up to $3,504/year single',
    eligibility: [
      'Gross monthly income at or below 130% of poverty ($1,644/month single)',
      'Net monthly income at or below 100% of poverty',
      'Assets under $2,750 (or $4,250 if household includes elderly/disabled)',
      'U.S. citizen or qualifying immigrant',
      'Must meet work requirements if able-bodied adult without dependents',
    ],
    howToClaim: 'Apply through your state SNAP agency. Many states allow online applications. You will need to complete an interview and provide proof of identity, income, and expenses.',
    claimUrl: 'https://www.fns.usda.gov/snap/supplemental-nutrition-assistance-program',
    keywords: ['SNAP', 'food stamps', 'EBT', 'food assistance', 'nutrition'],
  },
  {
    slug: 'wic',
    name: 'WIC',
    shortDescription: 'Nutrition assistance for pregnant women and young children',
    description:
      'WIC provides nutritious foods, nutrition education, breastfeeding support, and healthcare referrals to low-income pregnant, postpartum, and breastfeeding women, infants, and children up to age 5.',
    category: 'food',
    icon: Baby,
    monthlyAmount: '$50-$75/month in food',
    eligibility: [
      'Pregnant, postpartum (up to 6 months), or breastfeeding (up to 12 months) women',
      'Infants and children up to age 5',
      'Income at or below 185% of federal poverty level',
      'Determined to be at nutritional risk by a health professional',
      'Live in the state where applying',
    ],
    howToClaim: 'Contact your local WIC agency or clinic to schedule an appointment for certification. Bring proof of identity, residency, and income.',
    claimUrl: 'https://www.fns.usda.gov/wic',
    keywords: ['WIC', 'women infants children', 'pregnancy', 'nutrition', 'infant'],
  },
  {
    slug: 'tanf',
    name: 'TANF',
    shortDescription: 'Cash assistance for low-income families with children',
    description:
      'TANF provides temporary financial assistance and support services to low-income families with children. Benefits include cash assistance, job preparation, work support, and childcare.',
    category: 'family',
    icon: Users,
    monthlyAmount: '$200-$900/month (varies by state)',
    eligibility: [
      'Families with children under 18 (or 19 if in high school)',
      'Very low income (thresholds vary by state)',
      'Limited assets (varies by state)',
      'U.S. citizen or qualifying immigrant',
      'Must cooperate with child support enforcement',
    ],
    howToClaim: 'Apply through your state or county welfare office. Many states offer online applications. You will need to complete an interview and develop an employment plan if required.',
    claimUrl: 'https://www.acf.hhs.gov/ofa/programs/tanf',
    keywords: ['TANF', 'welfare', 'cash assistance', 'families', 'children'],
  },
  {
    slug: 'child-tax-credit',
    name: 'Child Tax Credit',
    shortDescription: 'Tax credit for families with qualifying children',
    description:
      'The Child Tax Credit reduces federal income tax for families with qualifying children under 17. Part of the credit is refundable through the Additional Child Tax Credit.',
    category: 'tax-credits',
    icon: Receipt,
    monthlyAmount: 'N/A (annual tax credit)',
    annualAmount: 'Up to $2,000 per child',
    eligibility: [
      'Child under 17 at end of tax year',
      'Child is U.S. citizen, national, or resident alien',
      'Child lived with you for more than half the year',
      'You provided more than half of the child\'s support',
      'Income limits: $200,000 single, $400,000 married filing jointly',
    ],
    howToClaim: 'Claim when filing your federal income tax return. Complete Schedule 8812 (Form 1040) and provide Social Security numbers for all qualifying children.',
    claimUrl: 'https://www.irs.gov/credits-deductions/individuals/child-tax-credit',
    keywords: ['child tax credit', 'CTC', 'tax credit', 'children', 'refundable'],
  },
  {
    slug: 'earned-income-tax-credit',
    name: 'Earned Income Tax Credit (EITC)',
    shortDescription: 'Refundable tax credit for low-to-moderate income workers',
    description:
      'The Earned Income Tax Credit is a refundable tax credit for low-to-moderate income working individuals and families. EITC can result in a significant tax refund.',
    category: 'tax-credits',
    icon: DollarSign,
    monthlyAmount: 'N/A (annual tax credit)',
    annualAmount: 'Up to $7,830 with 3+ children',
    eligibility: [
      'Have earned income from employment or self-employment',
      'Meet income limits based on filing status and children',
      'Have a valid Social Security number',
      'Be a U.S. citizen or resident alien all year',
      'Not file as married filing separately',
    ],
    howToClaim: 'Claim when filing your federal income tax return. Complete Schedule EIC if you have qualifying children. Free tax preparation is available through VITA program.',
    claimUrl: 'https://www.irs.gov/credits-deductions/individuals/earned-income-tax-credit-eitc',
    keywords: ['EITC', 'earned income', 'tax credit', 'refundable', 'working families'],
  },
  {
    slug: 'section-8-housing',
    name: 'Section 8 Housing Voucher',
    shortDescription: 'Rental assistance for low-income families',
    description:
      'The Housing Choice Voucher Program (Section 8) helps very low-income families, the elderly, and people with disabilities afford decent, safe housing in the private market.',
    category: 'housing',
    icon: Home,
    monthlyAmount: 'Covers rent above 30% of income',
    eligibility: [
      'Very low income (generally below 50% of area median income)',
      'Preference often given to extremely low income (below 30% AMI)',
      'U.S. citizen or eligible immigrant',
      'Pass background screening',
      'Eviction history and criminal background considered',
    ],
    howToClaim: 'Apply through your local Public Housing Agency (PHA). Applications are often only accepted during limited periods. Expect long waiting lists (often 2+ years).',
    claimUrl: 'https://www.hud.gov/topics/housing_choice_voucher_program_section_8',
    keywords: ['Section 8', 'housing voucher', 'rental assistance', 'HUD', 'PHA'],
  },
  {
    slug: 'unemployment-insurance',
    name: 'Unemployment Insurance',
    shortDescription: 'Temporary income for workers who lost their jobs',
    description:
      'Unemployment Insurance provides temporary income to workers who lose their jobs through no fault of their own. Benefits are based on previous earnings and duration varies by state.',
    category: 'unemployment',
    icon: Briefcase,
    monthlyAmount: 'Varies by state ($200-$800/week)',
    annualAmount: 'Typically 26 weeks of benefits',
    eligibility: [
      'Lost job through no fault of your own (not fired for cause)',
      'Meet state earnings requirements during base period',
      'Able and available to work',
      'Actively searching for employment',
      'Meet any additional state requirements',
    ],
    howToClaim: 'File a claim with your state unemployment agency. Most states allow online filing. File within the first week of becoming unemployed.',
    claimUrl: 'https://www.dol.gov/general/topic/unemployment-insurance',
    keywords: ['unemployment', 'UI', 'jobless', 'laid off', 'benefits'],
  },
  {
    slug: 'va-disability-compensation',
    name: 'VA Disability Compensation',
    shortDescription: 'Monthly payments for veterans with service-connected disabilities',
    description:
      'VA Disability Compensation provides tax-free monthly payments to veterans who have disabilities that were caused or made worse by their military service.',
    category: 'veterans',
    icon: Shield,
    monthlyAmount: '$171-$3,821/month',
    annualAmount: '$2,052-$45,852/year',
    eligibility: [
      'Served on active duty, active duty for training, or inactive duty training',
      'Have a disability rating from the VA',
      'Disability was caused or aggravated by military service',
      'Were discharged under other than dishonorable conditions',
    ],
    howToClaim: 'Apply online at va.gov, through a VA regional office, or work with an accredited Veterans Service Organization (VSO). Submit DD-214 and medical evidence.',
    claimUrl: 'https://www.va.gov/disability/',
    keywords: ['VA', 'veterans', 'disability', 'compensation', 'service-connected'],
  },
  {
    slug: 'va-health-care',
    name: 'VA Health Care',
    shortDescription: 'Comprehensive health care for eligible veterans',
    description:
      'VA Health Care provides comprehensive medical services to eligible veterans through the Veterans Health Administration. Services include preventive, primary, specialty, and mental health care.',
    category: 'veterans',
    icon: ShieldCheck,
    monthlyAmount: 'No premium; copays may apply',
    eligibility: [
      'Served in active military service and discharged under other than dishonorable conditions',
      'Meet minimum service requirements (generally 24 months or full period called)',
      'Enlisted after September 7, 1980, or entered active duty after October 16, 1981',
      'Combat veterans get 5 years of enhanced enrollment',
    ],
    howToClaim: 'Apply online at va.gov/health-care/apply, in person at a VA health facility, or by phone at 1-877-222-8387.',
    claimUrl: 'https://www.va.gov/health-care/',
    keywords: ['VA health', 'veterans health', 'VHA', 'military', 'health care'],
  },
  {
    slug: 'chip',
    name: 'CHIP',
    shortDescription: 'Low-cost health coverage for children',
    description:
      'CHIP provides low-cost health coverage to children in families that earn too much to qualify for Medicaid but cannot afford private insurance.',
    category: 'healthcare',
    icon: Baby,
    monthlyAmount: 'Free or low-cost',
    eligibility: [
      'Children under 19',
      'Family income too high for Medicaid',
      'Income generally up to 200-300% of federal poverty level (varies by state)',
      'U.S. citizen or qualifying immigrant',
      'Does not have access to affordable employer coverage',
    ],
    howToClaim: 'Apply through your state CHIP or Medicaid agency, or through HealthCare.gov marketplace. Call 1-877-KIDS-NOW (1-877-543-7669).',
    claimUrl: 'https://www.medicaid.gov/chip/index.html',
    keywords: ['CHIP', 'children health', 'kids insurance', 'Medicaid', 'health coverage'],
  },
  {
    slug: 'school-lunch',
    name: 'National School Lunch Program',
    shortDescription: 'Free or reduced-price meals for students',
    description:
      'The National School Lunch Program provides nutritionally balanced, free or reduced-price lunches to children at participating schools.',
    category: 'food',
    icon: GraduationCap,
    monthlyAmount: 'Free or $0.40/lunch',
    eligibility: [
      'Children in participating schools',
      'Free meals: household income at or below 130% of poverty',
      'Reduced-price meals: income between 130-185% of poverty',
      'Children in SNAP, TANF, or FDPIR households automatically qualify',
      'Foster children, homeless, migrant, and runaway children qualify automatically',
    ],
    howToClaim: 'Complete application through your child\'s school. Some children are directly certified automatically. One application covers all children in the household.',
    claimUrl: 'https://www.fns.usda.gov/nslp',
    keywords: ['school lunch', 'free lunch', 'reduced lunch', 'school meals', 'NSLP'],
  },
  {
    slug: 'pell-grant',
    name: 'Federal Pell Grant',
    shortDescription: 'Financial aid for undergraduate students',
    description:
      'Federal Pell Grants provide need-based financial aid to low-income undergraduate students to help pay for college. Unlike loans, grants do not have to be repaid.',
    category: 'family',
    icon: GraduationCap,
    monthlyAmount: 'N/A (academic year award)',
    annualAmount: 'Up to $7,395 per year',
    eligibility: [
      'Demonstrate financial need (based on FAFSA)',
      'Be an undergraduate student without a bachelor\'s degree',
      'Be a U.S. citizen or eligible noncitizen',
      'Be enrolled in an eligible degree or certificate program',
      'Maintain satisfactory academic progress',
    ],
    howToClaim: 'Complete the Free Application for Federal Student Aid (FAFSA) at studentaid.gov. FAFSA opens October 1 each year for the following academic year.',
    claimUrl: 'https://studentaid.gov/understand-aid/types/grants/pell',
    keywords: ['Pell Grant', 'FAFSA', 'college aid', 'financial aid', 'student aid'],
  },
  {
    slug: 'liheap',
    name: 'LIHEAP',
    shortDescription: 'Help with heating and cooling costs',
    description:
      'The Low Income Home Energy Assistance Program helps low-income households pay their energy bills, weatherize their homes, and address energy-related emergencies.',
    category: 'housing',
    icon: Building2,
    monthlyAmount: 'Varies ($500-$1,000/year avg)',
    eligibility: [
      'Low income (typically up to 150% of poverty or 60% of state median income)',
      'Priority given to households with elderly, disabled, or young children',
      'Must be responsible for home energy costs',
      'Eligibility and benefits vary by state',
    ],
    howToClaim: 'Contact your state or local LIHEAP agency. Apply during your state\'s application period. Crisis assistance may be available year-round.',
    claimUrl: 'https://www.acf.hhs.gov/ocs/low-income-home-energy-assistance-program-liheap',
    keywords: ['LIHEAP', 'energy assistance', 'heating', 'cooling', 'utility bills'],
  },
  {
    slug: 'social-security-survivors',
    name: 'Social Security Survivors Benefits',
    shortDescription: 'Benefits for family members when a worker dies',
    description:
      'Social Security survivors benefits provide monthly payments to family members when a worker who paid into Social Security dies.',
    category: 'retirement',
    icon: Heart,
    monthlyAmount: 'Up to $3,822/month',
    eligibility: [
      'Surviving spouse age 60 or older (50 if disabled)',
      'Surviving spouse caring for child under 16 or disabled',
      'Unmarried children under 18 (or 19 if still in high school)',
      'Adult children disabled before age 22',
      'Dependent parents age 62 or older',
    ],
    howToClaim: 'Report the death to Social Security immediately. Apply by phone at 1-800-772-1213 or in person. Provide death certificate and marriage certificate if applicable.',
    claimUrl: 'https://www.ssa.gov/benefits/survivors/',
    keywords: ['survivors benefits', 'widow', 'widower', 'death benefits', 'SSA'],
  },
]

// Helper functions
export function getBenefitBySlug(slug: string): USBenefit | undefined {
  return US_BENEFITS.find((benefit) => benefit.slug === slug)
}

export function getBenefitsByCategory(category: BenefitCategory): USBenefit[] {
  return US_BENEFITS.filter((benefit) => benefit.category === category)
}

export function getRelatedBenefits(benefit: USBenefit): USBenefit[] {
  return US_BENEFITS.filter((b) => b.category === benefit.category && b.slug !== benefit.slug).slice(0, 3)
}

export function getAllCategories(): BenefitCategory[] {
  return Object.keys(BENEFIT_CATEGORIES) as BenefitCategory[]
}

export function searchBenefits(query: string): USBenefit[] {
  const lowercaseQuery = query.toLowerCase()
  return US_BENEFITS.filter(
    (benefit) =>
      benefit.name.toLowerCase().includes(lowercaseQuery) ||
      benefit.shortDescription.toLowerCase().includes(lowercaseQuery) ||
      benefit.description.toLowerCase().includes(lowercaseQuery) ||
      benefit.keywords.some(k => k.toLowerCase().includes(lowercaseQuery))
  )
}
