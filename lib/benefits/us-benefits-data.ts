// US Federal Benefits Data - 2025
// Sources: SSA.gov, IRS.gov, USDA FNS, HHS.gov, Benefits.gov

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

export type USBenefit = {
  slug: string
  name: string
  shortDescription: string
  description: string
  category: BenefitCategory
  monthlyAmount: string
  annualAmount?: string
  eligibility: string[]
  howToClaim: string[]
  officialLink: string
  relatedBenefits: string[]
  keyFacts: string[]
  tips: string[]
  moreInfo: string
}

export const BENEFIT_CATEGORIES: Record<BenefitCategory, { label: string; description: string }> = {
  retirement: {
    label: 'Retirement',
    description: 'Social Security retirement benefits and pension programs',
  },
  disability: {
    label: 'Disability',
    description: 'Benefits for individuals with disabilities',
  },
  healthcare: {
    label: 'Healthcare',
    description: 'Health insurance and medical assistance programs',
  },
  food: {
    label: 'Food Assistance',
    description: 'Nutrition assistance and food programs',
  },
  family: {
    label: 'Family Support',
    description: 'Benefits for families with children',
  },
  housing: {
    label: 'Housing',
    description: 'Housing assistance and rental support programs',
  },
  'tax-credits': {
    label: 'Tax Credits',
    description: 'Refundable and non-refundable tax credits',
  },
  unemployment: {
    label: 'Unemployment',
    description: 'Unemployment insurance and job assistance',
  },
  veterans: {
    label: 'Veterans',
    description: 'Benefits for military veterans and their families',
  },
}

export const US_BENEFITS: USBenefit[] = [
  {
    slug: 'social-security-retirement',
    name: 'Social Security Retirement',
    shortDescription: 'Monthly retirement benefits based on lifetime earnings',
    description:
      'Social Security retirement benefits provide monthly income to workers who have earned enough credits through employment. The amount depends on your lifetime earnings, age when you start receiving benefits, and work history. You can claim reduced benefits as early as age 62 or wait until 70 for maximum benefits.',
    category: 'retirement',
    monthlyAmount: 'Up to $4,873/month (2025 max at age 70)',
    annualAmount: 'Up to $58,476/year',
    eligibility: [
      'Earned at least 40 work credits (about 10 years of work)',
      'Age 62 or older for reduced benefits',
      'Full retirement age is 66-67 depending on birth year',
      'Maximum benefits at age 70',
      'U.S. citizen or legal resident',
    ],
    howToClaim: [
      'Apply online at ssa.gov up to 4 months before you want benefits to start',
      'Call Social Security at 1-800-772-1213',
      'Visit your local Social Security office in person',
      'Provide proof of age, citizenship, and work history',
      'Processing typically takes 3-5 months',
    ],
    officialLink: 'https://www.ssa.gov/benefits/retirement/',
    relatedBenefits: ['medicare', 'social-security-spousal', 'social-security-survivors'],
    keyFacts: [
      'Average retirement benefit in 2025 is $1,976/month',
      '2.5% cost-of-living adjustment (COLA) for 2025',
      'Benefits reduced by 30% if claimed at 62 vs full retirement age',
      'Delayed retirement credits add 8% per year after full retirement age',
      'Working while receiving benefits may temporarily reduce payments',
    ],
    tips: [
      'Create a my Social Security account to check your estimated benefits',
      'Delay claiming if possible - benefits increase 8% per year until age 70',
      'Consider spousal benefits if your spouse had higher earnings',
      'Report any changes in your situation to avoid overpayment issues',
    ],
    moreInfo:
      'Social Security is funded through payroll taxes (FICA). In 2025, employees and employers each pay 6.2% on earnings up to $176,100. Self-employed individuals pay 12.4%. The program provides benefits to over 67 million Americans.',
  },
  {
    slug: 'social-security-disability',
    name: 'Social Security Disability Insurance (SSDI)',
    shortDescription: 'Benefits for workers who become disabled',
    description:
      'SSDI provides monthly income to workers who become disabled and can no longer work. Benefits are based on your lifetime earnings before the disability began. You must have worked long enough and recently enough to qualify.',
    category: 'disability',
    monthlyAmount: 'Up to $3,822/month (2025 max)',
    annualAmount: 'Up to $45,864/year',
    eligibility: [
      'Have a medical condition expected to last at least 12 months or result in death',
      'Unable to work due to the disability',
      'Earned enough work credits based on age when disabled',
      'Generally need 20 credits in the last 10 years',
      'Not currently performing substantial gainful activity',
    ],
    howToClaim: [
      'Apply online at ssa.gov/disability',
      'Call 1-800-772-1213 to start your application',
      'Gather medical records and treatment history',
      'List all doctors, hospitals, and clinics that treated your condition',
      'Initial decision typically takes 3-5 months',
    ],
    officialLink: 'https://www.ssa.gov/benefits/disability/',
    relatedBenefits: ['ssi', 'medicare', 'medicaid'],
    keyFacts: [
      'Average SSDI payment in 2025 is $1,580/month',
      'Approval rate is about 30-40% at initial application',
      'Appeals process can take 1-2 years',
      'Medicare coverage begins 24 months after SSDI eligibility',
      'You can work part-time and still receive benefits under certain rules',
    ],
    tips: [
      'Apply as soon as you become disabled - there is a 5-month waiting period',
      'Get detailed documentation from all treating physicians',
      'Consider hiring a disability attorney if your initial claim is denied',
      'Keep records of all medications and how your condition affects daily activities',
    ],
    moreInfo:
      'SSDI has strict medical and work history requirements. The Social Security Administration uses a 5-step evaluation process to determine disability. About 8.5 million disabled workers receive SSDI benefits.',
  },
  {
    slug: 'ssi',
    name: 'Supplemental Security Income (SSI)',
    shortDescription: 'Cash assistance for aged, blind, and disabled individuals with limited income',
    description:
      'SSI is a federal program providing monthly cash assistance to people 65 or older, blind, or disabled who have limited income and resources. Unlike SSDI, SSI does not require work history - eligibility is based on financial need.',
    category: 'disability',
    monthlyAmount: '$967/month individual, $1,450/month couple (2025)',
    annualAmount: '$11,604/year individual, $17,400/year couple',
    eligibility: [
      'Age 65 or older, or blind, or disabled',
      'Limited income (varies by state and living situation)',
      'Resources under $2,000 individual or $3,000 couple',
      'U.S. citizen or qualifying non-citizen',
      'Resident of the United States',
    ],
    howToClaim: [
      'Apply in person at your local Social Security office',
      'Call 1-800-772-1213 to schedule an appointment',
      'Bring proof of age, citizenship, income, and resources',
      'Provide medical evidence if applying based on disability',
      'Processing time is typically 3-6 months',
    ],
    officialLink: 'https://www.ssa.gov/ssi/',
    relatedBenefits: ['social-security-disability', 'medicaid', 'snap'],
    keyFacts: [
      'Federal benefit rate increased 2.5% for 2025',
      'Many states add supplemental payments on top of federal SSI',
      'SSI recipients automatically qualify for Medicaid in most states',
      'Resources do not include your home or one vehicle',
      'About 7.5 million people receive SSI benefits',
    ],
    tips: [
      'Report all income and changes in living situation promptly',
      'Keep detailed records of your resources and income',
      'Check if your state provides additional SSI supplements',
      'Apply for other benefits you may qualify for like SNAP',
    ],
    moreInfo:
      'SSI is funded from general tax revenues, not Social Security taxes. The program serves as a safety net for the most vulnerable Americans. Many SSI recipients also receive Social Security benefits, but the SSI amount is reduced dollar-for-dollar.',
  },
  {
    slug: 'medicare',
    name: 'Medicare',
    shortDescription: 'Federal health insurance for seniors and disabled individuals',
    description:
      'Medicare is the federal health insurance program for people 65 and older, people under 65 with certain disabilities, and people with End-Stage Renal Disease. It covers hospital care, medical services, and prescription drugs.',
    category: 'healthcare',
    monthlyAmount: 'Part B premium: $185/month (2025 standard)',
    eligibility: [
      'Age 65 or older and U.S. citizen or permanent resident for 5+ years',
      'Under 65 with a qualifying disability (after 24 months on SSDI)',
      'Any age with End-Stage Renal Disease or ALS',
      'Eligible for Social Security or Railroad Retirement benefits',
    ],
    howToClaim: [
      'Automatically enrolled if receiving Social Security benefits at 65',
      'Otherwise, enroll during Initial Enrollment Period (3 months before to 3 months after turning 65)',
      'Apply online at medicare.gov or ssa.gov',
      'General Enrollment Period: January 1 - March 31 each year',
      'Call 1-800-MEDICARE (1-800-633-4227)',
    ],
    officialLink: 'https://www.medicare.gov/',
    relatedBenefits: ['social-security-retirement', 'medicaid', 'extra-help'],
    keyFacts: [
      'Part A (Hospital) is premium-free if you paid Medicare taxes for 10+ years',
      'Part B (Medical) standard premium is $185/month in 2025',
      'Part D (Prescription drugs) premiums vary by plan',
      'Medicare Advantage (Part C) is an alternative to Original Medicare',
      'Over 67 million Americans are enrolled in Medicare',
    ],
    tips: [
      'Sign up on time to avoid late enrollment penalties',
      'Compare Medicare Advantage and Original Medicare + Medigap options',
      'Review your coverage annually during Open Enrollment (Oct 15 - Dec 7)',
      'Check if you qualify for Extra Help with prescription drug costs',
    ],
    moreInfo:
      'Medicare has four parts: Part A covers hospital stays, Part B covers outpatient care and doctor visits, Part C (Medicare Advantage) combines A and B through private insurers, and Part D covers prescription drugs. Most people do not pay a premium for Part A.',
  },
  {
    slug: 'medicaid',
    name: 'Medicaid',
    shortDescription: 'Free or low-cost health coverage for low-income individuals and families',
    description:
      'Medicaid is a joint federal and state program providing free or low-cost health coverage to millions of Americans. Coverage varies by state but generally includes doctor visits, hospital care, nursing home care, and more.',
    category: 'healthcare',
    monthlyAmount: 'Free or very low-cost coverage',
    eligibility: [
      'Low income (varies by state, generally up to 138% FPL in expansion states)',
      'Pregnant women, children, parents, and caretakers',
      'Seniors and people with disabilities',
      'U.S. citizen or qualifying immigration status',
      'Eligibility rules vary significantly by state',
    ],
    howToClaim: [
      'Apply through your state Medicaid agency',
      'Apply through HealthCare.gov marketplace',
      'Many states have online applications',
      'Provide proof of income, identity, and residency',
      'Coverage can begin as early as 90 days before application',
    ],
    officialLink: 'https://www.medicaid.gov/',
    relatedBenefits: ['chip', 'medicare', 'snap'],
    keyFacts: [
      'Over 90 million Americans are enrolled in Medicaid',
      '40 states plus DC have expanded Medicaid under the ACA',
      'Medicaid is the largest source of long-term care funding',
      'Children account for about 40% of Medicaid enrollment',
      'No monthly premium in most states for eligible individuals',
    ],
    tips: [
      'Apply even if you are unsure of eligibility - let the state determine',
      'Report income and household changes promptly',
      'Check if your state has expanded Medicaid for more coverage options',
      'Medicaid can work alongside Medicare for dual-eligible individuals',
    ],
    moreInfo:
      'Medicaid eligibility and benefits vary by state. Some states have expanded Medicaid to cover all adults under 138% of the federal poverty level. Medicaid covers services that Medicare does not, including long-term nursing home care.',
  },
  {
    slug: 'snap',
    name: 'SNAP (Food Stamps)',
    shortDescription: 'Monthly benefits to buy food for low-income households',
    description:
      'The Supplemental Nutrition Assistance Program (SNAP), formerly known as Food Stamps, provides monthly benefits on an EBT card to help low-income individuals and families buy food. Benefits can be used at grocery stores, farmers markets, and some online retailers.',
    category: 'food',
    monthlyAmount: 'Up to $292/month single, $536/month couple (2025)',
    annualAmount: 'Up to $3,504/year single, $6,432/year couple',
    eligibility: [
      'Gross monthly income at or below 130% of poverty ($1,644/month single)',
      'Net monthly income at or below 100% of poverty',
      'Assets under $2,750 (or $4,250 if household includes elderly/disabled)',
      'U.S. citizen or qualifying immigrant',
      'Must meet work requirements if able-bodied adult without dependents',
    ],
    howToClaim: [
      'Apply through your state SNAP agency',
      'Many states allow online applications',
      'Complete an interview (phone or in-person)',
      'Provide proof of identity, income, and expenses',
      'Benefits typically begin within 30 days (7 days for emergency)',
    ],
    officialLink: 'https://www.fns.usda.gov/snap/supplemental-nutrition-assistance-program',
    relatedBenefits: ['wic', 'school-lunch', 'tanf'],
    keyFacts: [
      'Over 42 million Americans receive SNAP benefits',
      'Average benefit is about $234 per person per month',
      'Benefits are adjusted annually based on food costs',
      'SNAP has one of the lowest fraud rates of any federal program (under 1%)',
      'Working families make up the majority of SNAP households',
    ],
    tips: [
      'Deductions for housing, childcare, and medical expenses can increase your benefit',
      'Check if you qualify for expedited (emergency) benefits',
      'Use SNAP at participating farmers markets for fresh produce',
      'College students may qualify under certain conditions',
    ],
    moreInfo:
      'SNAP is the largest federal nutrition assistance program. Benefits are loaded monthly onto an Electronic Benefits Transfer (EBT) card. The program helps reduce food insecurity and stimulates local economies.',
  },
  {
    slug: 'wic',
    name: 'WIC (Women, Infants, and Children)',
    shortDescription: 'Nutrition assistance for pregnant women and young children',
    description:
      'WIC provides nutritious foods, nutrition education, breastfeeding support, and healthcare referrals to low-income pregnant, postpartum, and breastfeeding women, infants, and children up to age 5 who are at nutritional risk.',
    category: 'food',
    monthlyAmount: '$50-$75/month in food benefits (varies by category)',
    eligibility: [
      'Pregnant, postpartum (up to 6 months), or breastfeeding (up to 12 months) women',
      'Infants and children up to age 5',
      'Income at or below 185% of federal poverty level',
      'Determined to be at nutritional risk by a health professional',
      'Live in the state where applying',
    ],
    howToClaim: [
      'Contact your local WIC agency or clinic',
      'Schedule an appointment for certification',
      'Bring proof of identity, residency, and income',
      'Complete a nutrition assessment',
      'Receive WIC benefits card and food package information',
    ],
    officialLink: 'https://www.fns.usda.gov/wic',
    relatedBenefits: ['snap', 'medicaid', 'chip'],
    keyFacts: [
      'WIC serves about 6 million participants monthly',
      'About half of all infants in the U.S. receive WIC benefits',
      'WIC provides specific nutritious foods like milk, eggs, fruits, vegetables',
      'Breastfeeding mothers receive enhanced food packages',
      'WIC is linked to improved birth outcomes and child health',
    ],
    tips: [
      'Apply during pregnancy to receive full benefits',
      'Fathers and guardians can apply on behalf of children',
      'Many WIC offices offer telehealth appointments',
      'WIC benefits do not count against other federal programs',
    ],
    moreInfo:
      'WIC is a discretionary grant program, not an entitlement, meaning funding is set by Congress. The program serves as an adjunct to healthcare, providing nutrition education and referrals. Studies show WIC reduces low birth weight and improves childhood nutrition.',
  },
  {
    slug: 'tanf',
    name: 'TANF (Temporary Assistance for Needy Families)',
    shortDescription: 'Cash assistance and support services for low-income families with children',
    description:
      'TANF provides temporary financial assistance and support services to low-income families with children. Benefits include cash assistance, job preparation, work support, and childcare. The program has work requirements and time limits.',
    category: 'family',
    monthlyAmount: '$200-$900/month (varies greatly by state)',
    eligibility: [
      'Families with children under 18 (or 19 if in high school)',
      'Very low income (thresholds vary by state)',
      'Limited assets (varies by state)',
      'U.S. citizen or qualifying immigrant',
      'Must cooperate with child support enforcement',
    ],
    howToClaim: [
      'Apply through your state or county welfare office',
      'Many states offer online applications',
      'Complete an interview and provide documentation',
      'Develop an employment plan if required',
      'Benefits begin after eligibility determination',
    ],
    officialLink: 'https://www.acf.hhs.gov/ofa/programs/tanf',
    relatedBenefits: ['snap', 'medicaid', 'child-care-assistance'],
    keyFacts: [
      'About 1 million families receive TANF cash assistance',
      'Federal 5-year lifetime limit on benefits (states may set shorter limits)',
      'Work requirements apply to most adult recipients',
      'Benefit amounts vary dramatically by state',
      'Only about 21% of families in poverty receive TANF',
    ],
    tips: [
      'Apply even if unsure of eligibility - requirements vary by state',
      'Ask about emergency assistance for immediate needs',
      'Inquire about support services beyond cash (job training, childcare)',
      'Report changes in income and household composition promptly',
    ],
    moreInfo:
      'TANF replaced the former AFDC program in 1996. It is a block grant to states, giving them flexibility in program design. Benefits and eligibility vary significantly across states. The program emphasizes moving recipients to work.',
  },
  {
    slug: 'child-tax-credit',
    name: 'Child Tax Credit',
    shortDescription: 'Tax credit for families with qualifying children',
    description:
      'The Child Tax Credit reduces federal income tax for families with qualifying children under 17. Part of the credit is refundable through the Additional Child Tax Credit, meaning you can receive a refund even if you owe no tax.',
    category: 'tax-credits',
    monthlyAmount: 'N/A (annual tax credit)',
    annualAmount: 'Up to $2,000 per child',
    eligibility: [
      'Child under 17 at end of tax year',
      'Child is U.S. citizen, national, or resident alien',
      'Child lived with you for more than half the year',
      'You provided more than half of the child\'s support',
      'Income limits: $200,000 single, $400,000 married filing jointly',
    ],
    howToClaim: [
      'Claim when filing your federal income tax return',
      'Complete Schedule 8812 (Form 1040)',
      'Provide Social Security numbers for all qualifying children',
      'File even if you have no tax liability to receive refundable portion',
      'E-file for faster processing and refund',
    ],
    officialLink: 'https://www.irs.gov/credits-deductions/individuals/child-tax-credit',
    relatedBenefits: ['earned-income-tax-credit', 'child-and-dependent-care-credit'],
    keyFacts: [
      '$2,000 maximum credit per qualifying child in 2025',
      'Up to $1,700 is refundable as Additional Child Tax Credit',
      'Credit phases out above income thresholds',
      'About 48 million families claim the Child Tax Credit',
      '$500 credit available for other dependents',
    ],
    tips: [
      'Ensure each child has a valid Social Security number',
      'Claim even if you have little or no income tax liability',
      'Keep records showing the child lived with you',
      'Consider filing status that maximizes your credit',
    ],
    moreInfo:
      'The Child Tax Credit was significantly expanded during COVID but returned to pre-expansion levels. The refundable portion (Additional Child Tax Credit) helps families with lower incomes who may not owe enough tax to claim the full credit.',
  },
  {
    slug: 'earned-income-tax-credit',
    name: 'Earned Income Tax Credit (EITC)',
    shortDescription: 'Refundable tax credit for low-to-moderate income workers',
    description:
      'The Earned Income Tax Credit is a refundable tax credit for low-to-moderate income working individuals and families. The amount depends on income, filing status, and number of qualifying children. EITC can result in a significant tax refund.',
    category: 'tax-credits',
    monthlyAmount: 'N/A (annual tax credit)',
    annualAmount: 'Up to $7,830 with 3+ children (2025)',
    eligibility: [
      'Have earned income from employment or self-employment',
      'Meet income limits based on filing status and children',
      'Have a valid Social Security number',
      'Be a U.S. citizen or resident alien all year',
      'Not file as married filing separately',
      'Investment income must be $11,600 or less',
    ],
    howToClaim: [
      'Claim when filing your federal income tax return',
      'Complete Schedule EIC if you have qualifying children',
      'File electronically for faster processing',
      'Free tax preparation available through VITA program',
      'Keep records of earned income',
    ],
    officialLink: 'https://www.irs.gov/credits-deductions/individuals/earned-income-tax-credit-eitc',
    relatedBenefits: ['child-tax-credit', 'snap'],
    keyFacts: [
      'About 23 million workers and families receive EITC',
      'Average EITC is about $2,500',
      '1 in 5 eligible taxpayers don\'t claim EITC',
      'Credit increases with income up to a point, then phases out',
      'Workers without children can qualify for smaller credit',
    ],
    tips: [
      'File a tax return even if you don\'t owe taxes',
      'Check eligibility using IRS EITC Assistant tool online',
      'Use free tax preparation services (VITA) to ensure correct claim',
      'Keep records of all earned income and work expenses',
    ],
    moreInfo:
      'EITC is one of the most effective anti-poverty programs, lifting millions of families above the poverty line. The credit phases in with income, reaches a maximum, then phases out at higher incomes. Over $60 billion in EITC is distributed annually.',
  },
  {
    slug: 'section-8-housing',
    name: 'Section 8 Housing Choice Voucher',
    shortDescription: 'Rental assistance for low-income families',
    description:
      'The Housing Choice Voucher Program (Section 8) helps very low-income families, the elderly, and people with disabilities afford decent, safe housing in the private market. Participants choose their own housing and pay about 30% of their income toward rent.',
    category: 'housing',
    monthlyAmount: 'Covers difference between 30% of income and fair market rent',
    eligibility: [
      'Very low income (generally below 50% of area median income)',
      'Preference often given to extremely low income (below 30% AMI)',
      'U.S. citizen or eligible immigrant',
      'Pass background screening',
      'Eviction history and criminal background considered',
    ],
    howToClaim: [
      'Apply through your local Public Housing Agency (PHA)',
      'Applications often only accepted during limited periods',
      'Expect long waiting lists (often 2+ years)',
      'Provide income documentation and identification',
      'Complete eligibility interview when called from waitlist',
    ],
    officialLink: 'https://www.hud.gov/topics/housing_choice_voucher_program_section_8',
    relatedBenefits: ['public-housing', 'snap', 'tanf'],
    keyFacts: [
      'Over 2.3 million households receive vouchers',
      'Average wait time is 28 months, but varies greatly by area',
      'Tenants pay about 30% of their adjusted income for rent',
      'Vouchers are portable - can move to different areas',
      'Only about 1 in 4 eligible households receives assistance due to funding',
    ],
    tips: [
      'Apply at multiple PHAs if eligible in different areas',
      'Check when waiting lists are open (often brief periods)',
      'Keep your contact information updated on the waiting list',
      'Respond promptly to all correspondence from the PHA',
    ],
    moreInfo:
      'Section 8 is the largest federal rental assistance program. Due to high demand and limited funding, waiting lists are extremely long in most areas. Some PHAs have closed waiting lists. The program allows participants to choose where they live.',
  },
  {
    slug: 'unemployment-insurance',
    name: 'Unemployment Insurance',
    shortDescription: 'Temporary income for workers who lost their jobs',
    description:
      'Unemployment Insurance provides temporary income to workers who lose their jobs through no fault of their own. Benefits are based on previous earnings and duration varies by state. Recipients must actively search for work.',
    category: 'unemployment',
    monthlyAmount: 'Varies by state; typically $200-$800/week',
    annualAmount: 'Typically 26 weeks of benefits per year',
    eligibility: [
      'Lost job through no fault of your own (not fired for cause)',
      'Meet state earnings requirements during base period',
      'Able and available to work',
      'Actively searching for employment',
      'Meet any additional state requirements',
    ],
    howToClaim: [
      'File a claim with your state unemployment agency',
      'Most states allow online filing',
      'File within the first week of becoming unemployed',
      'Provide information about previous employer and earnings',
      'Complete weekly certifications to continue receiving benefits',
    ],
    officialLink: 'https://www.dol.gov/general/topic/unemployment-insurance',
    relatedBenefits: ['snap', 'medicaid', 'job-training'],
    keyFacts: [
      'About 6 million people receive unemployment benefits at any time',
      'Benefits replace about 40-50% of previous wages on average',
      'Most states provide up to 26 weeks of benefits',
      'Extended benefits may be available during high unemployment',
      'Benefits are taxable income',
    ],
    tips: [
      'File immediately upon losing your job',
      'Document your job search activities carefully',
      'Respond promptly to any requests from the unemployment office',
      'Consider opting for tax withholding to avoid a tax bill',
    ],
    moreInfo:
      'Unemployment Insurance is a federal-state partnership funded by employer taxes. Each state sets its own benefit amounts, duration, and eligibility criteria within federal guidelines. Benefits help stabilize the economy during downturns.',
  },
  {
    slug: 'va-disability-compensation',
    name: 'VA Disability Compensation',
    shortDescription: 'Monthly payments for veterans with service-connected disabilities',
    description:
      'VA Disability Compensation provides tax-free monthly payments to veterans who have disabilities that were caused or made worse by their military service. The amount depends on the severity of the disability rating.',
    category: 'veterans',
    monthlyAmount: '$171-$3,821/month based on rating (2025)',
    annualAmount: '$2,052-$45,852/year',
    eligibility: [
      'Served on active duty, active duty for training, or inactive duty training',
      'Have a disability rating from the VA',
      'Disability was caused or aggravated by military service',
      'Were discharged under other than dishonorable conditions',
    ],
    howToClaim: [
      'Apply online at va.gov',
      'Apply through a VA regional office',
      'Work with an accredited Veterans Service Organization (VSO)',
      'Submit DD-214 and medical evidence',
      'Attend Compensation & Pension (C&P) exam if required',
    ],
    officialLink: 'https://www.va.gov/disability/',
    relatedBenefits: ['va-health-care', 'va-pension', 'caregiver-support'],
    keyFacts: [
      'Over 5 million veterans receive disability compensation',
      'Ratings range from 0% to 100% in 10% increments',
      'Additional compensation for dependents at 30% or higher',
      'Benefits are tax-free',
      '2.5% cost-of-living increase for 2025',
    ],
    tips: [
      'File all conditions you believe are service-connected',
      'Get a copy of your service medical records',
      'Consider working with a VSO - their help is free',
      'File for increase if your condition worsens',
    ],
    moreInfo:
      'VA Disability ratings are based on average impairment in earning capacity. Veterans can have multiple conditions that combine for a total rating. Special monthly compensation is available for severe disabilities.',
  },
  {
    slug: 'va-health-care',
    name: 'VA Health Care',
    shortDescription: 'Comprehensive health care for eligible veterans',
    description:
      'VA Health Care provides comprehensive medical services to eligible veterans through the Veterans Health Administration. Services include preventive, primary, specialty, and mental health care, as well as prescription medications.',
    category: 'veterans',
    monthlyAmount: 'No premium; copays may apply based on priority group',
    eligibility: [
      'Served in active military service and discharged under other than dishonorable conditions',
      'Meet minimum service requirements (generally 24 months or full period called)',
      'Enlisted after September 7, 1980, or entered active duty after October 16, 1981',
      'Combat veterans get 5 years of enhanced enrollment',
    ],
    howToClaim: [
      'Apply online at va.gov/health-care/apply',
      'Apply in person at a VA health facility',
      'Apply by phone at 1-877-222-8387',
      'Submit DD-214 and proof of service',
      'Complete health benefits application (VA Form 10-10EZ)',
    ],
    officialLink: 'https://www.va.gov/health-care/',
    relatedBenefits: ['va-disability-compensation', 'va-dental', 'community-care'],
    keyFacts: [
      'Over 9 million veterans enrolled in VA health care',
      'VA operates 1,321 health care facilities',
      'Priority groups determine eligibility and copays',
      'Community Care allows care outside VA when eligible',
      'Mental health services available same-day in emergencies',
    ],
    tips: [
      'Apply even if you have other insurance - VA care can supplement',
      'Combat veterans should apply within 5 years of discharge',
      'Use the VA app to manage health care on your phone',
      'Ask about Community Care if VA appointments are unavailable',
    ],
    moreInfo:
      'VA health care eligibility is based on priority groups. Veterans with service-connected disabilities, lower incomes, or other special circumstances receive priority. Copays vary by priority group and type of care.',
  },
  {
    slug: 'chip',
    name: 'CHIP (Children\'s Health Insurance Program)',
    shortDescription: 'Low-cost health coverage for children in families that earn too much for Medicaid',
    description:
      'CHIP provides low-cost health coverage to children in families that earn too much to qualify for Medicaid but cannot afford private insurance. Benefits include doctor visits, immunizations, hospitalizations, and dental and vision care.',
    category: 'healthcare',
    monthlyAmount: 'Free or low-cost (premiums vary by state)',
    eligibility: [
      'Children under 19',
      'Family income too high for Medicaid',
      'Income generally up to 200-300% of federal poverty level (varies by state)',
      'U.S. citizen or qualifying immigrant',
      'Does not have access to affordable employer coverage',
    ],
    howToClaim: [
      'Apply through your state CHIP or Medicaid agency',
      'Apply through HealthCare.gov marketplace',
      'Call 1-877-KIDS-NOW (1-877-543-7669)',
      'Provide proof of income, identity, and residency',
      'Coverage can begin immediately upon approval',
    ],
    officialLink: 'https://www.medicaid.gov/chip/index.html',
    relatedBenefits: ['medicaid', 'wic'],
    keyFacts: [
      'Over 7 million children are enrolled in CHIP',
      'CHIP has helped reduce the uninsured rate for children to historic lows',
      'Benefits and costs vary by state',
      'No annual or lifetime coverage limits',
      'Routine dental and vision coverage included',
    ],
    tips: [
      'Apply if your income is above Medicaid limits - CHIP may still cover your children',
      'Keep coverage active by completing annual renewals',
      'Pregnant women may also qualify in some states',
      'Check your state\'s specific income limits and benefits',
    ],
    moreInfo:
      'CHIP is funded jointly by federal and state governments. Each state runs its own program within federal guidelines. Some states have combined Medicaid/CHIP programs while others operate separate CHIP programs.',
  },
  {
    slug: 'school-lunch',
    name: 'National School Lunch Program',
    shortDescription: 'Free or reduced-price meals for students from low-income families',
    description:
      'The National School Lunch Program provides nutritionally balanced, free or reduced-price lunches to children at participating schools. The program also includes the School Breakfast Program. Income-eligible students receive meals at no cost.',
    category: 'food',
    monthlyAmount: 'Free or $0.40/lunch reduced price',
    eligibility: [
      'Children in participating schools',
      'Free meals: household income at or below 130% of poverty',
      'Reduced-price meals: income between 130-185% of poverty',
      'Children in SNAP, TANF, or FDPIR households automatically qualify',
      'Foster children, homeless, migrant, and runaway children qualify automatically',
    ],
    howToClaim: [
      'Complete application through your child\'s school',
      'Some children are directly certified automatically',
      'Provide household income information',
      'One application covers all children in the household',
      'Apply at any time during the school year',
    ],
    officialLink: 'https://www.fns.usda.gov/nslp',
    relatedBenefits: ['snap', 'wic', 'summer-food-service'],
    keyFacts: [
      'About 30 million children receive school lunch daily',
      'Over 75% of lunches served are free or reduced-price',
      'Meals must meet federal nutrition standards',
      'School Breakfast Program serves 15 million children',
      'Community Eligibility Provision allows high-poverty schools to serve all meals free',
    ],
    tips: [
      'Apply even if you\'re unsure of eligibility - the school will determine',
      'Check if your school participates in Community Eligibility (all meals free)',
      'Summer meals programs continue food assistance when school is out',
      'Update your application if your income or household size changes',
    ],
    moreInfo:
      'The National School Lunch Program has operated since 1946. Schools are reimbursed by the federal government for each meal served. The program helps ensure children have access to nutritious food so they can learn and grow.',
  },
  {
    slug: 'pell-grant',
    name: 'Federal Pell Grant',
    shortDescription: 'Financial aid for undergraduate students with financial need',
    description:
      'Federal Pell Grants provide need-based financial aid to low-income undergraduate students to help pay for college. Unlike loans, grants do not have to be repaid. The amount depends on financial need, cost of attendance, and enrollment status.',
    category: 'family',
    monthlyAmount: 'N/A (academic year award)',
    annualAmount: 'Up to $7,395 for 2024-2025 academic year',
    eligibility: [
      'Demonstrate financial need (based on FAFSA)',
      'Be an undergraduate student without a bachelor\'s degree',
      'Be a U.S. citizen or eligible noncitizen',
      'Be enrolled in an eligible degree or certificate program',
      'Maintain satisfactory academic progress',
    ],
    howToClaim: [
      'Complete the Free Application for Federal Student Aid (FAFSA)',
      'FAFSA opens October 1 each year for the following academic year',
      'Submit FAFSA to studentaid.gov',
      'Review your Student Aid Report (SAR)',
      'Accept the grant through your school\'s financial aid office',
    ],
    officialLink: 'https://studentaid.gov/understand-aid/types/grants/pell',
    relatedBenefits: ['federal-student-loans', 'work-study'],
    keyFacts: [
      'About 7 million students receive Pell Grants annually',
      'Maximum award for 2024-25 is $7,395',
      'Amount depends on Expected Family Contribution (EFC)',
      'Lifetime limit of 12 semesters of Pell Grant eligibility',
      'Can be used for tuition, fees, room, board, books, and supplies',
    ],
    tips: [
      'File FAFSA as early as possible - some aid is first-come, first-served',
      'Update FAFSA if your financial situation changes significantly',
      'Pell can be combined with other grants, scholarships, and loans',
      'Summer enrollment may qualify for additional Pell funds',
    ],
    moreInfo:
      'Pell Grants are the foundation of federal student aid. The program was established in 1972 to help ensure access to higher education for students from low-income backgrounds. Over $30 billion in Pell Grants is awarded annually.',
  },
  {
    slug: 'liheap',
    name: 'LIHEAP (Low Income Home Energy Assistance)',
    shortDescription: 'Help with heating and cooling costs for low-income households',
    description:
      'The Low Income Home Energy Assistance Program helps low-income households pay their energy bills, weatherize their homes, and address energy-related emergencies. Benefits may include bill payment assistance, crisis assistance, and weatherization.',
    category: 'housing',
    monthlyAmount: 'Varies by state and need (average $500-$1,000/year)',
    eligibility: [
      'Low income (typically up to 150% of poverty or 60% of state median income)',
      'Priority given to households with elderly, disabled, or young children',
      'Must be responsible for home energy costs',
      'Eligibility and benefits vary by state',
    ],
    howToClaim: [
      'Contact your state or local LIHEAP agency',
      'Apply during your state\'s application period',
      'Provide proof of income and energy costs',
      'Crisis assistance may be available year-round',
      'Application processes vary by state',
    ],
    officialLink: 'https://www.acf.hhs.gov/ocs/low-income-home-energy-assistance-program-liheap',
    relatedBenefits: ['snap', 'weatherization-assistance', 'tanf'],
    keyFacts: [
      'About 6 million households receive LIHEAP annually',
      'Average heating benefit is about $500',
      'Crisis assistance available for utility shutoff emergencies',
      'Funds are limited and programs may close when exhausted',
      'Weatherization can provide long-term energy savings',
    ],
    tips: [
      'Apply early - funds often run out before the end of the heating/cooling season',
      'Ask about crisis assistance if facing utility shutoff',
      'Inquire about weatherization for long-term savings',
      'Keep copies of utility bills for your application',
    ],
    moreInfo:
      'LIHEAP is a block grant program, giving states flexibility in program design. Benefits and eligibility vary significantly by state and available funding. Many states have separate heating and cooling assistance programs.',
  },
  {
    slug: 'social-security-survivors',
    name: 'Social Security Survivors Benefits',
    shortDescription: 'Benefits for family members when a worker dies',
    description:
      'Social Security survivors benefits provide monthly payments to family members when a worker who paid into Social Security dies. Benefits may be available to widows/widowers, children, and dependent parents.',
    category: 'retirement',
    monthlyAmount: 'Up to $3,822/month for surviving spouse at full retirement age (2025)',
    eligibility: [
      'Surviving spouse age 60 or older (50 if disabled)',
      'Surviving spouse caring for child under 16 or disabled',
      'Unmarried children under 18 (or 19 if still in high school)',
      'Adult children disabled before age 22',
      'Dependent parents age 62 or older',
    ],
    howToClaim: [
      'Report the death to Social Security immediately',
      'Apply by phone at 1-800-772-1213 or in person',
      'Provide death certificate and marriage certificate if applicable',
      'Provide birth certificates for eligible children',
      'Funeral homes often report deaths, but benefits must be applied for separately',
    ],
    officialLink: 'https://www.ssa.gov/benefits/survivors/',
    relatedBenefits: ['social-security-retirement', 'social-security-spousal', 'medicare'],
    keyFacts: [
      'About 6 million people receive survivors benefits',
      'One-time death benefit of $255 may be payable',
      'Benefits based on deceased worker\'s earnings record',
      'Surviving spouses can switch to their own retirement benefit later if higher',
      'Remarriage before age 60 generally ends eligibility for surviving spouse',
    ],
    tips: [
      'Apply as soon as possible after a death - benefits may not be retroactive',
      'Young surviving spouses with children should apply even if they\'re working',
      'At full retirement age, surviving spouse receives 100% of deceased\'s benefit',
      'Check both your benefit and survivors benefit to maximize lifetime income',
    ],
    moreInfo:
      'Survivors benefits provide crucial income protection for families. A worker needs between 6-40 credits depending on age at death. Survivors benefits are particularly important for families with young children and for widows/widowers approaching retirement.',
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
  return US_BENEFITS.filter((b) => benefit.relatedBenefits.includes(b.slug))
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
      benefit.description.toLowerCase().includes(lowercaseQuery)
  )
}
