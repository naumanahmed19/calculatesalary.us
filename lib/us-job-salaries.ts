// US Job Salary Data for SEO Pages
// Data sourced from Bureau of Labor Statistics and various US salary surveys

export interface SalaryTrendData {
  year: number
  average: number
  entryLevel: number
  senior: number
}

export interface JobSalaryData {
  slug: string
  title: string
  category: string
  averageSalary: number
  salaryRange: {
    min: number
    max: number
  }
  entryLevel: number
  experienced: number
  seniorLevel: number
  description: string
  responsibilities: string[]
  skills: string[]
  qualifications: string[]
  careerPath: string[]
  industries: string[]
  location: {
    newYork: number
    california: number
    texas: number
    national: number
  }
  salaryTrends?: SalaryTrendData[]
}

export const JOB_CATEGORIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'Engineering',
  'Education',
  'Marketing',
  'Legal',
  'Construction',
  'Retail',
  'Public Sector',
] as const

export const US_JOB_SALARIES: JobSalaryData[] = [
  // Technology
  {
    slug: 'software-developer',
    title: 'Software Developer',
    category: 'Technology',
    averageSalary: 110000,
    salaryRange: { min: 65000, max: 180000 },
    entryLevel: 65000,
    experienced: 110000,
    seniorLevel: 160000,
    description: 'Software developers design, build, and maintain software applications and systems. They write code in various programming languages, debug issues, and collaborate with teams to deliver technical solutions.',
    responsibilities: [
      'Writing clean, efficient, and maintainable code',
      'Debugging and fixing software defects',
      'Collaborating with product managers and designers',
      'Participating in code reviews',
      'Deploying and maintaining applications',
    ],
    skills: ['JavaScript', 'Python', 'Java', 'SQL', 'Git', 'Agile methodologies'],
    qualifications: ['Computer Science degree or equivalent', 'Relevant certifications', 'Portfolio of projects'],
    careerPath: ['Junior Developer', 'Mid-level Developer', 'Senior Developer', 'Tech Lead', 'Engineering Manager'],
    industries: ['Technology', 'Finance', 'Healthcare', 'E-commerce', 'Consulting'],
    location: { newYork: 135000, california: 145000, texas: 105000, national: 100000 },
  },
  {
    slug: 'data-scientist',
    title: 'Data Scientist',
    category: 'Technology',
    averageSalary: 125000,
    salaryRange: { min: 75000, max: 200000 },
    entryLevel: 75000,
    experienced: 125000,
    seniorLevel: 180000,
    description: 'Data scientists analyze complex datasets to extract insights and inform business decisions. They use statistical methods, machine learning, and data visualization to solve problems.',
    responsibilities: [
      'Collecting and cleaning large datasets',
      'Building predictive models and algorithms',
      'Creating data visualizations and reports',
      'Presenting findings to stakeholders',
      'Collaborating with engineering teams',
    ],
    skills: ['Python', 'R', 'SQL', 'Machine Learning', 'Statistics', 'Tableau', 'TensorFlow'],
    qualifications: ['Masters or PhD in related field', 'Statistics or Computer Science background', 'Strong mathematical skills'],
    careerPath: ['Junior Data Scientist', 'Data Scientist', 'Senior Data Scientist', 'Lead Data Scientist', 'Head of Data Science'],
    industries: ['Technology', 'Finance', 'Healthcare', 'Retail', 'Consulting'],
    location: { newYork: 150000, california: 160000, texas: 115000, national: 115000 },
  },
  {
    slug: 'devops-engineer',
    title: 'DevOps Engineer',
    category: 'Technology',
    averageSalary: 130000,
    salaryRange: { min: 80000, max: 190000 },
    entryLevel: 80000,
    experienced: 130000,
    seniorLevel: 175000,
    description: 'DevOps engineers bridge development and operations, implementing CI/CD pipelines, managing cloud infrastructure, and ensuring system reliability and scalability.',
    responsibilities: [
      'Building and maintaining CI/CD pipelines',
      'Managing cloud infrastructure (AWS, Azure, GCP)',
      'Automating deployment processes',
      'Monitoring system performance',
      'Implementing security best practices',
    ],
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'Linux', 'Python'],
    qualifications: ['Computer Science degree or equivalent', 'Cloud certifications (AWS, Azure)', 'Strong Linux administration skills'],
    careerPath: ['Junior DevOps Engineer', 'DevOps Engineer', 'Senior DevOps Engineer', 'Platform Engineer', 'Site Reliability Engineer'],
    industries: ['Technology', 'Finance', 'E-commerce', 'SaaS', 'Consulting'],
    location: { newYork: 155000, california: 165000, texas: 120000, national: 120000 },
  },
  {
    slug: 'product-manager',
    title: 'Product Manager',
    category: 'Technology',
    averageSalary: 135000,
    salaryRange: { min: 85000, max: 200000 },
    entryLevel: 85000,
    experienced: 135000,
    seniorLevel: 180000,
    description: 'Product managers define product strategy, prioritize features, and work with cross-functional teams to deliver products that meet customer needs and business goals.',
    responsibilities: [
      'Defining product vision and strategy',
      'Gathering and prioritizing requirements',
      'Working with engineering and design teams',
      'Analyzing market trends and competitors',
      'Measuring product success metrics',
    ],
    skills: ['Product Strategy', 'Agile', 'Data Analysis', 'User Research', 'Stakeholder Management', 'Roadmapping'],
    qualifications: ['Business or technical degree', 'Product management certification', 'Strong communication skills'],
    careerPath: ['Associate PM', 'Product Manager', 'Senior PM', 'Director of Product', 'VP of Product', 'CPO'],
    industries: ['Technology', 'Finance', 'E-commerce', 'Healthcare', 'Media'],
    location: { newYork: 160000, california: 170000, texas: 125000, national: 125000 },
  },
  {
    slug: 'cyber-security-analyst',
    title: 'Cyber Security Analyst',
    category: 'Technology',
    averageSalary: 105000,
    salaryRange: { min: 65000, max: 165000 },
    entryLevel: 65000,
    experienced: 105000,
    seniorLevel: 150000,
    description: 'Cyber security analysts protect organizations from digital threats by monitoring networks, investigating incidents, and implementing security measures.',
    responsibilities: [
      'Monitoring security systems and networks',
      'Investigating security incidents',
      'Conducting vulnerability assessments',
      'Implementing security policies',
      'Training staff on security awareness',
    ],
    skills: ['Network Security', 'SIEM', 'Penetration Testing', 'Risk Assessment', 'Incident Response', 'Firewalls'],
    qualifications: ['Computer Science or Cyber Security degree', 'CISSP, CEH, or CompTIA Security+', 'Strong analytical skills'],
    careerPath: ['Junior Analyst', 'Security Analyst', 'Senior Analyst', 'Security Engineer', 'CISO'],
    industries: ['Finance', 'Government', 'Healthcare', 'Technology', 'Defense'],
    location: { newYork: 125000, california: 130000, texas: 100000, national: 95000 },
  },
  // Healthcare
  {
    slug: 'registered-nurse',
    title: 'Registered Nurse',
    category: 'Healthcare',
    averageSalary: 82000,
    salaryRange: { min: 60000, max: 115000 },
    entryLevel: 60000,
    experienced: 82000,
    seniorLevel: 105000,
    description: 'Registered nurses provide patient care in hospitals, clinics, and community settings. They assess patient needs, administer medications, and support recovery.',
    responsibilities: [
      'Assessing and monitoring patient health',
      'Administering medications and treatments',
      'Educating patients and families',
      'Coordinating with healthcare teams',
      'Maintaining accurate medical records',
    ],
    skills: ['Patient Care', 'Clinical Skills', 'Communication', 'Critical Thinking', 'Empathy', 'Medical Knowledge'],
    qualifications: ['Nursing degree (BSN preferred)', 'NCLEX-RN license', 'BLS certification'],
    careerPath: ['Staff Nurse', 'Charge Nurse', 'Nurse Manager', 'Director of Nursing', 'Chief Nursing Officer'],
    industries: ['Hospitals', 'Clinics', 'Home Health', 'Long-term Care', 'Travel Nursing'],
    location: { newYork: 95000, california: 120000, texas: 75000, national: 77000 },
  },
  {
    slug: 'pharmacist',
    title: 'Pharmacist',
    category: 'Healthcare',
    averageSalary: 128000,
    salaryRange: { min: 100000, max: 160000 },
    entryLevel: 100000,
    experienced: 128000,
    seniorLevel: 150000,
    description: 'Pharmacists dispense medications, provide advice on drug interactions, and help patients manage their health. They work in community pharmacies, hospitals, and industry.',
    responsibilities: [
      'Dispensing prescription medications',
      'Advising patients on medication use',
      'Checking for drug interactions',
      'Managing pharmacy operations',
      'Providing health advice and immunizations',
    ],
    skills: ['Pharmaceutical Knowledge', 'Attention to Detail', 'Communication', 'Customer Service', 'Regulatory Compliance'],
    qualifications: ['PharmD degree', 'State licensure', 'NAPLEX and MPJE exams'],
    careerPath: ['Staff Pharmacist', 'Clinical Pharmacist', 'Pharmacy Manager', 'Director of Pharmacy', 'VP of Pharmacy'],
    industries: ['Retail Pharmacy', 'Hospital Pharmacy', 'Pharmaceutical Industry', 'PBMs'],
    location: { newYork: 135000, california: 145000, texas: 125000, national: 124000 },
  },
  {
    slug: 'physician',
    title: 'Physician (Primary Care)',
    category: 'Healthcare',
    averageSalary: 220000,
    salaryRange: { min: 180000, max: 280000 },
    entryLevel: 180000,
    experienced: 220000,
    seniorLevel: 260000,
    description: 'Primary care physicians diagnose and treat a wide range of conditions, refer patients to specialists, and provide preventive care.',
    responsibilities: [
      'Diagnosing and treating illnesses',
      'Prescribing medications',
      'Referring patients to specialists',
      'Managing chronic conditions',
      'Providing preventive health advice',
    ],
    skills: ['Clinical Diagnosis', 'Patient Communication', 'Medical Knowledge', 'Decision Making', 'Empathy'],
    qualifications: ['MD or DO degree', 'Residency completion', 'Board certification', 'State medical license'],
    careerPath: ['Resident', 'Attending Physician', 'Partner', 'Medical Director', 'Chief Medical Officer'],
    industries: ['Private Practice', 'Hospital Systems', 'Urgent Care', 'Telehealth'],
    location: { newYork: 245000, california: 250000, texas: 215000, national: 210000 },
  },
  {
    slug: 'physical-therapist',
    title: 'Physical Therapist',
    category: 'Healthcare',
    averageSalary: 95000,
    salaryRange: { min: 70000, max: 125000 },
    entryLevel: 70000,
    experienced: 95000,
    seniorLevel: 115000,
    description: 'Physical therapists help patients recover from injuries, surgeries, and chronic conditions through physical therapy, exercises, and rehabilitation programs.',
    responsibilities: [
      'Assessing patient mobility and function',
      'Developing treatment plans',
      'Providing hands-on therapy',
      'Teaching exercises and techniques',
      'Monitoring patient progress',
    ],
    skills: ['Manual Therapy', 'Exercise Prescription', 'Patient Assessment', 'Communication', 'Anatomy Knowledge'],
    qualifications: ['Doctor of Physical Therapy (DPT)', 'State licensure', 'NPTE exam'],
    careerPath: ['Staff PT', 'Senior PT', 'Clinical Specialist', 'Director of Rehab', 'Practice Owner'],
    industries: ['Hospitals', 'Outpatient Clinics', 'Sports Medicine', 'Home Health', 'Private Practice'],
    location: { newYork: 105000, california: 110000, texas: 90000, national: 90000 },
  },
  // Finance
  {
    slug: 'accountant',
    title: 'Accountant',
    category: 'Finance',
    averageSalary: 78000,
    salaryRange: { min: 52000, max: 120000 },
    entryLevel: 52000,
    experienced: 78000,
    seniorLevel: 105000,
    description: 'Accountants prepare financial statements, manage budgets, ensure regulatory compliance, and provide financial advice to organizations and individuals.',
    responsibilities: [
      'Preparing financial statements and reports',
      'Managing budgets and forecasts',
      'Ensuring tax compliance',
      'Conducting audits',
      'Advising on financial decisions',
    ],
    skills: ['Financial Analysis', 'Tax Knowledge', 'Excel', 'Accounting Software', 'Attention to Detail', 'Communication'],
    qualifications: ['Accounting degree', 'CPA license', 'Strong numerical skills'],
    careerPath: ['Staff Accountant', 'Senior Accountant', 'Accounting Manager', 'Controller', 'CFO'],
    industries: ['Public Accounting', 'Corporate Finance', 'Government', 'Banking', 'Consulting'],
    location: { newYork: 92000, california: 88000, texas: 75000, national: 73000 },
  },
  {
    slug: 'financial-analyst',
    title: 'Financial Analyst',
    category: 'Finance',
    averageSalary: 90000,
    salaryRange: { min: 60000, max: 140000 },
    entryLevel: 60000,
    experienced: 90000,
    seniorLevel: 125000,
    description: 'Financial analysts evaluate investment opportunities, analyze market trends, and provide recommendations to guide business and investment decisions.',
    responsibilities: [
      'Analyzing financial data and trends',
      'Building financial models',
      'Preparing investment reports',
      'Evaluating company performance',
      'Making investment recommendations',
    ],
    skills: ['Financial Modeling', 'Excel', 'Data Analysis', 'Valuation', 'Research', 'Presentation Skills'],
    qualifications: ['Finance or Economics degree', 'CFA certification (desirable)', 'Strong analytical skills'],
    careerPath: ['Junior Analyst', 'Financial Analyst', 'Senior Analyst', 'Associate', 'VP', 'Director'],
    industries: ['Investment Banking', 'Asset Management', 'Private Equity', 'Consulting', 'Corporate Finance'],
    location: { newYork: 115000, california: 105000, texas: 85000, national: 83000 },
  },
  {
    slug: 'investment-banker',
    title: 'Investment Banker',
    category: 'Finance',
    averageSalary: 175000,
    salaryRange: { min: 100000, max: 400000 },
    entryLevel: 100000,
    experienced: 175000,
    seniorLevel: 350000,
    description: 'Investment bankers advise companies on mergers, acquisitions, and capital raising. They structure deals, conduct due diligence, and manage client relationships.',
    responsibilities: [
      'Advising on M&A transactions',
      'Raising capital through debt and equity',
      'Building financial models',
      'Conducting due diligence',
      'Managing client relationships',
    ],
    skills: ['Financial Modeling', 'Valuation', 'Deal Structuring', 'Client Management', 'Negotiation', 'Presentation'],
    qualifications: ['Finance, Economics, or Business degree', 'Strong academics', 'CFA or MBA (beneficial)'],
    careerPath: ['Analyst', 'Associate', 'Vice President', 'Director', 'Managing Director'],
    industries: ['Bulge Bracket Banks', 'Boutique Banks', 'Middle Market Banks'],
    location: { newYork: 225000, california: 195000, texas: 150000, national: 145000 },
  },
  // Engineering
  {
    slug: 'mechanical-engineer',
    title: 'Mechanical Engineer',
    category: 'Engineering',
    averageSalary: 95000,
    salaryRange: { min: 65000, max: 135000 },
    entryLevel: 65000,
    experienced: 95000,
    seniorLevel: 125000,
    description: 'Mechanical engineers design, develop, and test mechanical systems and devices. They work across industries from automotive to aerospace to energy.',
    responsibilities: [
      'Designing mechanical components and systems',
      'Conducting stress and thermal analysis',
      'Overseeing prototype development',
      'Managing projects and budgets',
      'Ensuring safety and quality standards',
    ],
    skills: ['CAD Software', 'Thermodynamics', 'Materials Science', 'FEA', 'Project Management', 'Problem Solving'],
    qualifications: ['Mechanical Engineering degree', 'PE license (optional)', 'Relevant industry experience'],
    careerPath: ['Junior Engineer', 'Design Engineer', 'Senior Engineer', 'Principal Engineer', 'Engineering Manager'],
    industries: ['Automotive', 'Aerospace', 'Energy', 'Manufacturing', 'Consulting'],
    location: { newYork: 105000, california: 110000, texas: 95000, national: 90000 },
  },
  {
    slug: 'civil-engineer',
    title: 'Civil Engineer',
    category: 'Engineering',
    averageSalary: 90000,
    salaryRange: { min: 60000, max: 130000 },
    entryLevel: 60000,
    experienced: 90000,
    seniorLevel: 120000,
    description: 'Civil engineers design and oversee construction of infrastructure projects including roads, bridges, buildings, and water systems.',
    responsibilities: [
      'Designing infrastructure projects',
      'Managing construction projects',
      'Conducting site surveys and investigations',
      'Ensuring compliance with regulations',
      'Coordinating with contractors and stakeholders',
    ],
    skills: ['AutoCAD', 'Structural Analysis', 'Project Management', 'BIM', 'Geotechnical Knowledge', 'Communication'],
    qualifications: ['Civil Engineering degree', 'PE license', 'Site experience'],
    careerPath: ['Junior Engineer', 'Project Engineer', 'Senior Engineer', 'Project Manager', 'Director'],
    industries: ['Construction', 'Consulting', 'Government', 'Infrastructure', 'Real Estate'],
    location: { newYork: 100000, california: 105000, texas: 90000, national: 85000 },
  },
  {
    slug: 'electrical-engineer',
    title: 'Electrical Engineer',
    category: 'Engineering',
    averageSalary: 100000,
    salaryRange: { min: 68000, max: 145000 },
    entryLevel: 68000,
    experienced: 100000,
    seniorLevel: 135000,
    description: 'Electrical engineers design, develop, and maintain electrical systems and equipment. They work in power generation, electronics, telecommunications, and more.',
    responsibilities: [
      'Designing electrical systems and circuits',
      'Testing and troubleshooting equipment',
      'Managing installation projects',
      'Ensuring safety compliance',
      'Developing specifications and documentation',
    ],
    skills: ['Circuit Design', 'CAD Software', 'PLC Programming', 'Power Systems', 'Testing & Commissioning', 'Problem Solving'],
    qualifications: ['Electrical Engineering degree', 'PE license (optional)', 'Relevant certifications'],
    careerPath: ['Junior Engineer', 'Design Engineer', 'Senior Engineer', 'Lead Engineer', 'Engineering Manager'],
    industries: ['Power & Utilities', 'Manufacturing', 'Construction', 'Telecommunications', 'Renewables'],
    location: { newYork: 110000, california: 115000, texas: 98000, national: 95000 },
  },
  // Education
  {
    slug: 'teacher-high-school',
    title: 'High School Teacher',
    category: 'Education',
    averageSalary: 62000,
    salaryRange: { min: 45000, max: 85000 },
    entryLevel: 45000,
    experienced: 62000,
    seniorLevel: 80000,
    description: 'High school teachers educate students aged 14-18 in specific subjects. They plan lessons, assess student progress, and support student development.',
    responsibilities: [
      'Planning and delivering lessons',
      'Assessing student work and progress',
      'Managing classroom behavior',
      'Communicating with parents',
      'Participating in school activities',
    ],
    skills: ['Subject Knowledge', 'Communication', 'Classroom Management', 'Patience', 'Organization', 'Creativity'],
    qualifications: ['Bachelor\'s degree in education or subject area', 'State teaching certification', 'Background check'],
    careerPath: ['Teacher', 'Department Head', 'Assistant Principal', 'Principal', 'District Administrator'],
    industries: ['Public Schools', 'Private Schools', 'Charter Schools', 'Online Education'],
    location: { newYork: 75000, california: 80000, texas: 55000, national: 60000 },
  },
  {
    slug: 'university-professor',
    title: 'University Professor',
    category: 'Education',
    averageSalary: 105000,
    salaryRange: { min: 65000, max: 180000 },
    entryLevel: 65000,
    experienced: 105000,
    seniorLevel: 160000,
    description: 'University professors teach undergraduate and graduate students, conduct research, publish academic papers, and supervise student projects.',
    responsibilities: [
      'Delivering lectures and seminars',
      'Conducting academic research',
      'Publishing papers and books',
      'Supervising student dissertations',
      'Applying for research grants',
    ],
    skills: ['Subject Expertise', 'Research Skills', 'Public Speaking', 'Academic Writing', 'Student Mentoring'],
    qualifications: ['PhD in relevant field', 'Publication track record', 'Teaching experience'],
    careerPath: ['Assistant Professor', 'Associate Professor', 'Full Professor', 'Department Chair', 'Dean'],
    industries: ['Universities', 'Research Institutions', 'Think Tanks'],
    location: { newYork: 120000, california: 125000, texas: 95000, national: 100000 },
  },
  // Marketing
  {
    slug: 'marketing-manager',
    title: 'Marketing Manager',
    category: 'Marketing',
    averageSalary: 100000,
    salaryRange: { min: 65000, max: 150000 },
    entryLevel: 65000,
    experienced: 100000,
    seniorLevel: 140000,
    description: 'Marketing managers develop and execute marketing strategies to promote products and services. They manage campaigns, analyze results, and lead marketing teams.',
    responsibilities: [
      'Developing marketing strategies',
      'Managing marketing budgets',
      'Overseeing campaigns and content',
      'Analyzing campaign performance',
      'Leading and developing teams',
    ],
    skills: ['Digital Marketing', 'Campaign Management', 'Analytics', 'Content Strategy', 'Leadership', 'Budgeting'],
    qualifications: ['Marketing or Business degree', 'Marketing certifications', 'Proven marketing experience'],
    careerPath: ['Marketing Coordinator', 'Marketing Manager', 'Senior Manager', 'Director of Marketing', 'CMO'],
    industries: ['Consumer Goods', 'Technology', 'Retail', 'Financial Services', 'Agency'],
    location: { newYork: 120000, california: 115000, texas: 95000, national: 92000 },
  },
  {
    slug: 'digital-marketing-specialist',
    title: 'Digital Marketing Specialist',
    category: 'Marketing',
    averageSalary: 65000,
    salaryRange: { min: 45000, max: 95000 },
    entryLevel: 45000,
    experienced: 65000,
    seniorLevel: 88000,
    description: 'Digital marketing specialists manage online marketing campaigns including SEO, PPC, social media, and email marketing to drive traffic and conversions.',
    responsibilities: [
      'Managing SEO and PPC campaigns',
      'Creating social media content',
      'Analyzing website and campaign data',
      'Email marketing automation',
      'A/B testing and optimization',
    ],
    skills: ['SEO', 'Google Ads', 'Social Media', 'Google Analytics', 'Content Marketing', 'Email Marketing'],
    qualifications: ['Marketing degree (or equivalent)', 'Google certifications', 'Portfolio of campaigns'],
    careerPath: ['Digital Marketing Coordinator', 'Specialist', 'Senior Specialist', 'Digital Marketing Manager', 'Director of Digital'],
    industries: ['Agency', 'E-commerce', 'Technology', 'Retail', 'B2B Services'],
    location: { newYork: 78000, california: 75000, texas: 60000, national: 60000 },
  },
  // Legal
  {
    slug: 'lawyer',
    title: 'Lawyer',
    category: 'Legal',
    averageSalary: 135000,
    salaryRange: { min: 70000, max: 300000 },
    entryLevel: 70000,
    experienced: 135000,
    seniorLevel: 250000,
    description: 'Lawyers provide legal advice, draft documents, represent clients, and handle legal transactions. They specialize in areas like corporate, litigation, or real estate.',
    responsibilities: [
      'Providing legal advice to clients',
      'Drafting contracts and legal documents',
      'Conducting legal research',
      'Negotiating settlements',
      'Managing client relationships',
    ],
    skills: ['Legal Research', 'Drafting', 'Negotiation', 'Client Management', 'Attention to Detail', 'Commercial Awareness'],
    qualifications: ['Law degree (JD)', 'Bar admission', 'Strong writing skills'],
    careerPath: ['Associate', 'Senior Associate', 'Counsel', 'Partner', 'Managing Partner'],
    industries: ['Law Firms', 'In-house Legal', 'Government', 'Non-profits'],
    location: { newYork: 180000, california: 170000, texas: 120000, national: 120000 },
  },
  {
    slug: 'paralegal',
    title: 'Paralegal',
    category: 'Legal',
    averageSalary: 58000,
    salaryRange: { min: 40000, max: 85000 },
    entryLevel: 40000,
    experienced: 58000,
    seniorLevel: 78000,
    description: 'Paralegals assist lawyers by conducting legal research, drafting documents, organizing case files, and communicating with clients.',
    responsibilities: [
      'Conducting legal research',
      'Drafting legal documents',
      'Organizing case files',
      'Communicating with clients',
      'Assisting with court filings',
    ],
    skills: ['Legal Research', 'Document Drafting', 'Organization', 'Communication', 'Attention to Detail'],
    qualifications: ['Paralegal certificate or degree', 'Knowledge of legal procedures', 'Strong computer skills'],
    careerPath: ['Junior Paralegal', 'Paralegal', 'Senior Paralegal', 'Paralegal Manager', 'Legal Operations'],
    industries: ['Law Firms', 'Corporate Legal', 'Government', 'Insurance'],
    location: { newYork: 70000, california: 68000, texas: 55000, national: 55000 },
  },
  // Construction
  {
    slug: 'construction-manager',
    title: 'Construction Manager',
    category: 'Construction',
    averageSalary: 105000,
    salaryRange: { min: 70000, max: 160000 },
    entryLevel: 70000,
    experienced: 105000,
    seniorLevel: 145000,
    description: 'Construction managers oversee building projects from planning to completion. They coordinate teams, manage budgets, and ensure projects are delivered on time.',
    responsibilities: [
      'Planning and scheduling projects',
      'Managing budgets and resources',
      'Coordinating contractors and suppliers',
      'Ensuring safety compliance',
      'Reporting to clients and stakeholders',
    ],
    skills: ['Project Management', 'Budgeting', 'Scheduling', 'Stakeholder Management', 'Risk Management', 'Leadership'],
    qualifications: ['Construction Management or Engineering degree', 'PMP certification (beneficial)', 'Site experience'],
    careerPath: ['Assistant PM', 'Project Manager', 'Senior PM', 'Director of Construction', 'VP of Operations'],
    industries: ['General Contractors', 'Real Estate Development', 'Infrastructure', 'Commercial Construction'],
    location: { newYork: 125000, california: 130000, texas: 100000, national: 98000 },
  },
  {
    slug: 'electrician',
    title: 'Electrician',
    category: 'Construction',
    averageSalary: 62000,
    salaryRange: { min: 40000, max: 95000 },
    entryLevel: 40000,
    experienced: 62000,
    seniorLevel: 85000,
    description: 'Electricians install, maintain, and repair electrical systems in residential, commercial, and industrial settings.',
    responsibilities: [
      'Installing electrical wiring and systems',
      'Troubleshooting electrical problems',
      'Reading blueprints and schematics',
      'Ensuring code compliance',
      'Maintaining electrical equipment',
    ],
    skills: ['Electrical Systems', 'Troubleshooting', 'Blueprint Reading', 'Safety Compliance', 'Problem Solving'],
    qualifications: ['Apprenticeship completion', 'Electrician license', 'OSHA certification'],
    careerPath: ['Apprentice', 'Journeyman', 'Master Electrician', 'Electrical Contractor', 'Business Owner'],
    industries: ['Residential', 'Commercial', 'Industrial', 'Utilities'],
    location: { newYork: 80000, california: 85000, texas: 55000, national: 58000 },
  },
  // Retail
  {
    slug: 'retail-manager',
    title: 'Retail Store Manager',
    category: 'Retail',
    averageSalary: 52000,
    salaryRange: { min: 35000, max: 80000 },
    entryLevel: 35000,
    experienced: 52000,
    seniorLevel: 72000,
    description: 'Retail managers oversee store operations, manage staff, drive sales, and ensure excellent customer service. They handle inventory, budgets, and store presentation.',
    responsibilities: [
      'Managing day-to-day store operations',
      'Recruiting and training staff',
      'Driving sales and meeting targets',
      'Managing inventory',
      'Ensuring customer satisfaction',
    ],
    skills: ['Team Leadership', 'Sales', 'Customer Service', 'Inventory Management', 'Budgeting', 'Visual Merchandising'],
    qualifications: ['Retail experience', 'Management training', 'Strong commercial awareness'],
    careerPath: ['Sales Associate', 'Assistant Manager', 'Store Manager', 'District Manager', 'Regional Manager'],
    industries: ['Apparel', 'Electronics', 'Grocery', 'Department Stores', 'Specialty Retail'],
    location: { newYork: 62000, california: 60000, texas: 48000, national: 48000 },
  },
  // Public Sector
  {
    slug: 'police-officer',
    title: 'Police Officer',
    category: 'Public Sector',
    averageSalary: 68000,
    salaryRange: { min: 45000, max: 100000 },
    entryLevel: 45000,
    experienced: 68000,
    seniorLevel: 95000,
    description: 'Police officers protect communities, prevent crime, respond to emergencies, and investigate criminal activities. They work in various specialisms from patrol to detective work.',
    responsibilities: [
      'Patrolling communities',
      'Responding to emergency calls',
      'Investigating crimes',
      'Collecting evidence and statements',
      'Supporting victims',
    ],
    skills: ['Communication', 'Problem Solving', 'Physical Fitness', 'Observation', 'Decision Making', 'Resilience'],
    qualifications: ['High school diploma or GED', 'Police academy training', 'Background check'],
    careerPath: ['Officer', 'Detective', 'Sergeant', 'Lieutenant', 'Captain', 'Chief'],
    industries: ['Municipal Police', 'State Police', 'Federal Law Enforcement'],
    location: { newYork: 85000, california: 100000, texas: 60000, national: 65000 },
  },
  {
    slug: 'social-worker',
    title: 'Social Worker',
    category: 'Public Sector',
    averageSalary: 58000,
    salaryRange: { min: 42000, max: 80000 },
    entryLevel: 42000,
    experienced: 58000,
    seniorLevel: 75000,
    description: 'Social workers support vulnerable individuals and families, including children at risk, elderly people, and those with disabilities or mental health challenges.',
    responsibilities: [
      'Assessing client needs',
      'Developing support plans',
      'Advocating for clients',
      'Coordinating with other agencies',
      'Maintaining case records',
    ],
    skills: ['Empathy', 'Communication', 'Assessment', 'Case Management', 'Resilience', 'Crisis Intervention'],
    qualifications: ['Bachelor\'s or Master\'s in Social Work', 'State licensure (LCSW/LSW)', 'Background check'],
    careerPath: ['Case Worker', 'Social Worker', 'Senior Social Worker', 'Supervisor', 'Director'],
    industries: ['Government Agencies', 'Healthcare', 'Schools', 'Non-profits'],
    location: { newYork: 68000, california: 70000, texas: 52000, national: 55000 },
  },
]

// Get all unique slugs for sitemap/static generation
export function getAllJobSlugs(): string[] {
  return US_JOB_SALARIES.map(job => job.slug)
}

// Get job data by slug
export function getJobBySlug(slug: string): JobSalaryData | undefined {
  return US_JOB_SALARIES.find(job => job.slug === slug)
}

// Get jobs by category
export function getJobsByCategory(category: string): JobSalaryData[] {
  return US_JOB_SALARIES.filter(job => job.category === category)
}

// Get related jobs (same category, different job)
export function getRelatedJobs(slug: string, limit: number = 4): JobSalaryData[] {
  const currentJob = getJobBySlug(slug)
  if (!currentJob) return []

  return US_JOB_SALARIES
    .filter(job => job.category === currentJob.category && job.slug !== slug)
    .slice(0, limit)
}

// Get all categories with job counts
export function getCategoriesWithCounts(): { category: string; count: number; jobs: JobSalaryData[] }[] {
  return JOB_CATEGORIES.map(category => ({
    category,
    count: US_JOB_SALARIES.filter(job => job.category === category).length,
    jobs: US_JOB_SALARIES.filter(job => job.category === category),
  })).filter(c => c.count > 0)
}

// Historical growth rates by sector (based on BLS data patterns)
const SECTOR_GROWTH_RATES: Record<string, number[]> = {
  // [2020->2021, 2021->2022, 2022->2023, 2023->2024, 2024->2025]
  'Technology': [5.0, 9.0, 7.0, 6.0, 4.5],
  'Healthcare': [4.0, 5.5, 6.0, 5.0, 4.0],
  'Finance': [3.0, 6.0, 4.5, 4.0, 3.5],
  'Engineering': [2.0, 4.0, 5.0, 4.5, 4.0],
  'Education': [2.5, 3.0, 4.0, 4.5, 4.0],
  'Marketing': [1.0, 5.0, 5.5, 5.0, 4.5],
  'Legal': [2.5, 4.0, 4.5, 4.0, 3.5],
  'Construction': [1.5, 5.0, 6.5, 6.0, 5.0],
  'Retail': [-1.0, 4.0, 5.0, 4.5, 4.0],
  'Public Sector': [3.0, 3.5, 4.0, 5.5, 4.5],
}

const DEFAULT_GROWTH_RATES = [2.5, 4.5, 5.0, 4.5, 4.0]

export function getJobSalaryTrends(job: JobSalaryData): SalaryTrendData[] {
  const growthRates = SECTOR_GROWTH_RATES[job.category] || DEFAULT_GROWTH_RATES

  const current2025 = {
    average: job.averageSalary,
    entryLevel: job.entryLevel,
    senior: job.seniorLevel,
  }

  let avgSalary = current2025.average
  let entrySalary = current2025.entryLevel
  let seniorSalary = current2025.senior

  const historicalSalaries: SalaryTrendData[] = []

  historicalSalaries.unshift({
    year: 2025,
    average: Math.round(avgSalary),
    entryLevel: Math.round(entrySalary),
    senior: Math.round(seniorSalary),
  })

  for (let i = growthRates.length - 1; i >= 0; i--) {
    const growthRate = growthRates[i] / 100

    avgSalary = avgSalary / (1 + growthRate)
    entrySalary = entrySalary / (1 + growthRate * 0.85)
    seniorSalary = seniorSalary / (1 + growthRate * 1.1)

    historicalSalaries.unshift({
      year: 2024 - (growthRates.length - 1 - i),
      average: Math.round(avgSalary),
      entryLevel: Math.round(entrySalary),
      senior: Math.round(seniorSalary),
    })
  }

  return historicalSalaries
}

export function getSalaryTrendsSummary(trends: SalaryTrendData[]) {
  const firstYear = trends[0]
  const lastYear = trends[trends.length - 1]

  const totalGrowthPercent = ((lastYear.average - firstYear.average) / firstYear.average) * 100
  const totalGrowthAmount = lastYear.average - firstYear.average
  const annualGrowthRate = (Math.pow(lastYear.average / firstYear.average, 1 / (trends.length - 1)) - 1) * 100

  // US inflation rates 2020-2025 (approximate)
  const cumulativeInflation = 1.012 * 1.047 * 1.065 * 1.034 * 1.028 * 1.025 // ~21% cumulative
  const realGrowthPercent = ((lastYear.average / firstYear.average) / cumulativeInflation - 1) * 100

  return {
    totalGrowthPercent: totalGrowthPercent.toFixed(1),
    totalGrowthAmount,
    annualGrowthRate: annualGrowthRate.toFixed(1),
    realGrowthPercent: realGrowthPercent.toFixed(1),
    beatsInflation: realGrowthPercent > 0,
  }
}
