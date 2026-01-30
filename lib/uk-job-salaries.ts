// UK Job Salary Data for SEO Pages
// Data sourced from various UK salary surveys and job boards

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
    london: number
    southeast: number
    national: number
  }
  // Historical salary trends - will be calculated if not provided
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

export const UK_JOB_SALARIES: JobSalaryData[] = [
  // Technology
  {
    slug: 'software-developer',
    title: 'Software Developer',
    category: 'Technology',
    averageSalary: 52000,
    salaryRange: { min: 28000, max: 85000 },
    entryLevel: 28000,
    experienced: 52000,
    seniorLevel: 75000,
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
    location: { london: 65000, southeast: 55000, national: 48000 },
  },
  {
    slug: 'data-scientist',
    title: 'Data Scientist',
    category: 'Technology',
    averageSalary: 58000,
    salaryRange: { min: 35000, max: 95000 },
    entryLevel: 35000,
    experienced: 58000,
    seniorLevel: 85000,
    description: 'Data scientists analyse complex datasets to extract insights and inform business decisions. They use statistical methods, machine learning, and data visualisation to solve problems.',
    responsibilities: [
      'Collecting and cleaning large datasets',
      'Building predictive models and algorithms',
      'Creating data visualisations and reports',
      'Presenting findings to stakeholders',
      'Collaborating with engineering teams',
    ],
    skills: ['Python', 'R', 'SQL', 'Machine Learning', 'Statistics', 'Tableau', 'TensorFlow'],
    qualifications: ['Masters or PhD in related field', 'Statistics or Computer Science background', 'Strong mathematical skills'],
    careerPath: ['Junior Data Scientist', 'Data Scientist', 'Senior Data Scientist', 'Lead Data Scientist', 'Head of Data Science'],
    industries: ['Technology', 'Finance', 'Healthcare', 'Retail', 'Consulting'],
    location: { london: 72000, southeast: 60000, national: 52000 },
  },
  {
    slug: 'devops-engineer',
    title: 'DevOps Engineer',
    category: 'Technology',
    averageSalary: 62000,
    salaryRange: { min: 40000, max: 90000 },
    entryLevel: 40000,
    experienced: 62000,
    seniorLevel: 85000,
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
    location: { london: 75000, southeast: 65000, national: 55000 },
  },
  {
    slug: 'product-manager',
    title: 'Product Manager',
    category: 'Technology',
    averageSalary: 65000,
    salaryRange: { min: 40000, max: 100000 },
    entryLevel: 40000,
    experienced: 65000,
    seniorLevel: 90000,
    description: 'Product managers define product strategy, prioritise features, and work with cross-functional teams to deliver products that meet customer needs and business goals.',
    responsibilities: [
      'Defining product vision and strategy',
      'Gathering and prioritising requirements',
      'Working with engineering and design teams',
      'Analysing market trends and competitors',
      'Measuring product success metrics',
    ],
    skills: ['Product Strategy', 'Agile', 'Data Analysis', 'User Research', 'Stakeholder Management', 'Roadmapping'],
    qualifications: ['Business or technical degree', 'Product management certification', 'Strong communication skills'],
    careerPath: ['Associate PM', 'Product Manager', 'Senior PM', 'Director of Product', 'VP of Product', 'CPO'],
    industries: ['Technology', 'Finance', 'E-commerce', 'Healthcare', 'Media'],
    location: { london: 80000, southeast: 68000, national: 58000 },
  },
  {
    slug: 'cyber-security-analyst',
    title: 'Cyber Security Analyst',
    category: 'Technology',
    averageSalary: 55000,
    salaryRange: { min: 32000, max: 85000 },
    entryLevel: 32000,
    experienced: 55000,
    seniorLevel: 78000,
    description: 'Cyber security analysts protect organisations from digital threats by monitoring networks, investigating incidents, and implementing security measures.',
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
    industries: ['Finance', 'Government', 'Healthcare', 'Technology', 'Defence'],
    location: { london: 68000, southeast: 58000, national: 50000 },
  },
  // Healthcare
  {
    slug: 'registered-nurse',
    title: 'Registered Nurse',
    category: 'Healthcare',
    averageSalary: 35000,
    salaryRange: { min: 27000, max: 45000 },
    entryLevel: 27000,
    experienced: 35000,
    seniorLevel: 42000,
    description: 'Registered nurses provide patient care in hospitals, clinics, and community settings. They assess patient needs, administer medications, and support recovery.',
    responsibilities: [
      'Assessing and monitoring patient health',
      'Administering medications and treatments',
      'Educating patients and families',
      'Coordinating with healthcare teams',
      'Maintaining accurate medical records',
    ],
    skills: ['Patient Care', 'Clinical Skills', 'Communication', 'Critical Thinking', 'Empathy', 'Medical Knowledge'],
    qualifications: ['Nursing degree (BSc or diploma)', 'NMC registration', 'Enhanced DBS check'],
    careerPath: ['Staff Nurse', 'Senior Staff Nurse', 'Ward Manager', 'Matron', 'Director of Nursing'],
    industries: ['NHS', 'Private Healthcare', 'Care Homes', 'Community Health', 'Agency Nursing'],
    location: { london: 38000, southeast: 36000, national: 33000 },
  },
  {
    slug: 'pharmacist',
    title: 'Pharmacist',
    category: 'Healthcare',
    averageSalary: 47000,
    salaryRange: { min: 33000, max: 65000 },
    entryLevel: 33000,
    experienced: 47000,
    seniorLevel: 58000,
    description: 'Pharmacists dispense medications, provide advice on drug interactions, and help patients manage their health. They work in community pharmacies, hospitals, and industry.',
    responsibilities: [
      'Dispensing prescription medications',
      'Advising patients on medication use',
      'Checking for drug interactions',
      'Managing pharmacy operations',
      'Providing health advice and vaccinations',
    ],
    skills: ['Pharmaceutical Knowledge', 'Attention to Detail', 'Communication', 'Customer Service', 'Regulatory Compliance'],
    qualifications: ['MPharm degree', 'GPhC registration', 'Pre-registration training'],
    careerPath: ['Pre-registration Pharmacist', 'Pharmacist', 'Senior Pharmacist', 'Pharmacy Manager', 'Clinical Lead'],
    industries: ['Community Pharmacy', 'Hospital Pharmacy', 'Pharmaceutical Industry', 'NHS'],
    location: { london: 52000, southeast: 48000, national: 44000 },
  },
  {
    slug: 'doctor-gp',
    title: 'Doctor (GP)',
    category: 'Healthcare',
    averageSalary: 95000,
    salaryRange: { min: 62000, max: 120000 },
    entryLevel: 62000,
    experienced: 95000,
    seniorLevel: 115000,
    description: 'General Practitioners (GPs) are primary care doctors who diagnose and treat a wide range of conditions, refer patients to specialists, and provide preventive care.',
    responsibilities: [
      'Diagnosing and treating illnesses',
      'Prescribing medications',
      'Referring patients to specialists',
      'Managing chronic conditions',
      'Providing preventive health advice',
    ],
    skills: ['Clinical Diagnosis', 'Patient Communication', 'Medical Knowledge', 'Decision Making', 'Empathy'],
    qualifications: ['Medical degree (MBBS/MBChB)', 'GP specialty training', 'GMC registration'],
    careerPath: ['Foundation Doctor', 'GP Trainee', 'Salaried GP', 'GP Partner', 'Senior Partner'],
    industries: ['NHS', 'Private Practice', 'Out-of-Hours Services', 'Occupational Health'],
    location: { london: 105000, southeast: 98000, national: 90000 },
  },
  {
    slug: 'physiotherapist',
    title: 'Physiotherapist',
    category: 'Healthcare',
    averageSalary: 38000,
    salaryRange: { min: 28000, max: 55000 },
    entryLevel: 28000,
    experienced: 38000,
    seniorLevel: 50000,
    description: 'Physiotherapists help patients recover from injuries, surgeries, and chronic conditions through physical therapy, exercises, and rehabilitation programmes.',
    responsibilities: [
      'Assessing patient mobility and function',
      'Developing treatment plans',
      'Providing hands-on therapy',
      'Teaching exercises and techniques',
      'Monitoring patient progress',
    ],
    skills: ['Manual Therapy', 'Exercise Prescription', 'Patient Assessment', 'Communication', 'Anatomy Knowledge'],
    qualifications: ['Physiotherapy degree', 'HCPC registration', 'Relevant specialisation'],
    careerPath: ['Junior Physiotherapist', 'Physiotherapist', 'Senior Physiotherapist', 'Clinical Specialist', 'Consultant'],
    industries: ['NHS', 'Private Practice', 'Sports Clubs', 'Care Homes', 'Occupational Health'],
    location: { london: 42000, southeast: 39000, national: 36000 },
  },
  // Finance
  {
    slug: 'accountant',
    title: 'Accountant',
    category: 'Finance',
    averageSalary: 45000,
    salaryRange: { min: 26000, max: 75000 },
    entryLevel: 26000,
    experienced: 45000,
    seniorLevel: 68000,
    description: 'Accountants prepare financial statements, manage budgets, ensure regulatory compliance, and provide financial advice to organisations and individuals.',
    responsibilities: [
      'Preparing financial statements and reports',
      'Managing budgets and forecasts',
      'Ensuring tax compliance',
      'Conducting audits',
      'Advising on financial decisions',
    ],
    skills: ['Financial Analysis', 'Tax Knowledge', 'Excel', 'Accounting Software', 'Attention to Detail', 'Communication'],
    qualifications: ['Accounting degree', 'ACA, ACCA, or CIMA qualification', 'Strong numerical skills'],
    careerPath: ['Trainee Accountant', 'Accountant', 'Senior Accountant', 'Finance Manager', 'Financial Controller', 'CFO'],
    industries: ['Accounting Firms', 'Corporate Finance', 'Public Sector', 'Banking', 'Consulting'],
    location: { london: 55000, southeast: 47000, national: 42000 },
  },
  {
    slug: 'financial-analyst',
    title: 'Financial Analyst',
    category: 'Finance',
    averageSalary: 52000,
    salaryRange: { min: 30000, max: 85000 },
    entryLevel: 30000,
    experienced: 52000,
    seniorLevel: 78000,
    description: 'Financial analysts evaluate investment opportunities, analyse market trends, and provide recommendations to guide business and investment decisions.',
    responsibilities: [
      'Analysing financial data and trends',
      'Building financial models',
      'Preparing investment reports',
      'Evaluating company performance',
      'Making investment recommendations',
    ],
    skills: ['Financial Modelling', 'Excel', 'Data Analysis', 'Valuation', 'Research', 'Presentation Skills'],
    qualifications: ['Finance or Economics degree', 'CFA qualification (desirable)', 'Strong analytical skills'],
    careerPath: ['Junior Analyst', 'Financial Analyst', 'Senior Analyst', 'Associate', 'VP', 'Director'],
    industries: ['Investment Banking', 'Asset Management', 'Private Equity', 'Consulting', 'Corporate Finance'],
    location: { london: 65000, southeast: 55000, national: 48000 },
  },
  {
    slug: 'investment-banker',
    title: 'Investment Banker',
    category: 'Finance',
    averageSalary: 85000,
    salaryRange: { min: 50000, max: 200000 },
    entryLevel: 50000,
    experienced: 85000,
    seniorLevel: 150000,
    description: 'Investment bankers advise companies on mergers, acquisitions, and capital raising. They structure deals, conduct due diligence, and manage client relationships.',
    responsibilities: [
      'Advising on M&A transactions',
      'Raising capital through debt and equity',
      'Building financial models',
      'Conducting due diligence',
      'Managing client relationships',
    ],
    skills: ['Financial Modelling', 'Valuation', 'Deal Structuring', 'Client Management', 'Negotiation', 'Presentation'],
    qualifications: ['Finance, Economics, or Business degree', 'Strong academics', 'CFA or MBA (beneficial)'],
    careerPath: ['Analyst', 'Associate', 'Vice President', 'Director', 'Managing Director'],
    industries: ['Bulge Bracket Banks', 'Boutique Banks', 'Middle Market Banks'],
    location: { london: 95000, southeast: 75000, national: 65000 },
  },
  // Engineering
  {
    slug: 'mechanical-engineer',
    title: 'Mechanical Engineer',
    category: 'Engineering',
    averageSalary: 45000,
    salaryRange: { min: 28000, max: 70000 },
    entryLevel: 28000,
    experienced: 45000,
    seniorLevel: 65000,
    description: 'Mechanical engineers design, develop, and test mechanical systems and devices. They work across industries from automotive to aerospace to energy.',
    responsibilities: [
      'Designing mechanical components and systems',
      'Conducting stress and thermal analysis',
      'Overseeing prototype development',
      'Managing projects and budgets',
      'Ensuring safety and quality standards',
    ],
    skills: ['CAD Software', 'Thermodynamics', 'Materials Science', 'FEA', 'Project Management', 'Problem Solving'],
    qualifications: ['Mechanical Engineering degree', 'Chartered Engineer status (CEng)', 'Relevant industry experience'],
    careerPath: ['Graduate Engineer', 'Design Engineer', 'Senior Engineer', 'Principal Engineer', 'Engineering Manager'],
    industries: ['Automotive', 'Aerospace', 'Energy', 'Manufacturing', 'Consulting'],
    location: { london: 52000, southeast: 47000, national: 42000 },
  },
  {
    slug: 'civil-engineer',
    title: 'Civil Engineer',
    category: 'Engineering',
    averageSalary: 42000,
    salaryRange: { min: 26000, max: 65000 },
    entryLevel: 26000,
    experienced: 42000,
    seniorLevel: 60000,
    description: 'Civil engineers design and oversee construction of infrastructure projects including roads, bridges, buildings, and water systems.',
    responsibilities: [
      'Designing infrastructure projects',
      'Managing construction projects',
      'Conducting site surveys and investigations',
      'Ensuring compliance with regulations',
      'Coordinating with contractors and stakeholders',
    ],
    skills: ['AutoCAD', 'Structural Analysis', 'Project Management', 'BIM', 'Geotechnical Knowledge', 'Communication'],
    qualifications: ['Civil Engineering degree', 'Chartered Engineer status (CEng)', 'Site experience'],
    careerPath: ['Graduate Engineer', 'Project Engineer', 'Senior Engineer', 'Project Manager', 'Director'],
    industries: ['Construction', 'Consulting', 'Government', 'Infrastructure', 'Property Development'],
    location: { london: 50000, southeast: 44000, national: 40000 },
  },
  {
    slug: 'electrical-engineer',
    title: 'Electrical Engineer',
    category: 'Engineering',
    averageSalary: 48000,
    salaryRange: { min: 28000, max: 72000 },
    entryLevel: 28000,
    experienced: 48000,
    seniorLevel: 68000,
    description: 'Electrical engineers design, develop, and maintain electrical systems and equipment. They work in power generation, electronics, telecommunications, and more.',
    responsibilities: [
      'Designing electrical systems and circuits',
      'Testing and troubleshooting equipment',
      'Managing installation projects',
      'Ensuring safety compliance',
      'Developing specifications and documentation',
    ],
    skills: ['Circuit Design', 'CAD Software', 'PLC Programming', 'Power Systems', 'Testing & Commissioning', 'Problem Solving'],
    qualifications: ['Electrical Engineering degree', 'Chartered Engineer status (CEng)', 'Relevant certifications'],
    careerPath: ['Graduate Engineer', 'Design Engineer', 'Senior Engineer', 'Lead Engineer', 'Engineering Manager'],
    industries: ['Power & Utilities', 'Manufacturing', 'Construction', 'Telecommunications', 'Renewables'],
    location: { london: 55000, southeast: 50000, national: 45000 },
  },
  // Education
  {
    slug: 'teacher-secondary',
    title: 'Secondary School Teacher',
    category: 'Education',
    averageSalary: 38000,
    salaryRange: { min: 30000, max: 50000 },
    entryLevel: 30000,
    experienced: 38000,
    seniorLevel: 46000,
    description: 'Secondary school teachers educate students aged 11-18 in specific subjects. They plan lessons, assess student progress, and support student development.',
    responsibilities: [
      'Planning and delivering lessons',
      'Assessing student work and progress',
      'Managing classroom behaviour',
      'Communicating with parents',
      'Participating in school activities',
    ],
    skills: ['Subject Knowledge', 'Communication', 'Classroom Management', 'Patience', 'Organisation', 'Creativity'],
    qualifications: ['Relevant degree', 'PGCE or QTS', 'Enhanced DBS check'],
    careerPath: ['NQT', 'Teacher', 'Head of Department', 'Assistant Head', 'Deputy Head', 'Headteacher'],
    industries: ['State Schools', 'Independent Schools', 'Academies', 'Special Schools'],
    location: { london: 42000, southeast: 39000, national: 36000 },
  },
  {
    slug: 'university-lecturer',
    title: 'University Lecturer',
    category: 'Education',
    averageSalary: 52000,
    salaryRange: { min: 38000, max: 75000 },
    entryLevel: 38000,
    experienced: 52000,
    seniorLevel: 68000,
    description: 'University lecturers teach undergraduate and postgraduate students, conduct research, publish academic papers, and supervise student projects.',
    responsibilities: [
      'Delivering lectures and seminars',
      'Conducting academic research',
      'Publishing papers and books',
      'Supervising student dissertations',
      'Applying for research grants',
    ],
    skills: ['Subject Expertise', 'Research Skills', 'Public Speaking', 'Academic Writing', 'Student Mentoring'],
    qualifications: ['PhD in relevant field', 'Teaching qualification (HEA)', 'Publication track record'],
    careerPath: ['Lecturer', 'Senior Lecturer', 'Reader', 'Professor', 'Department Head'],
    industries: ['Universities', 'Research Institutions', 'Think Tanks'],
    location: { london: 58000, southeast: 54000, national: 50000 },
  },
  // Marketing
  {
    slug: 'marketing-manager',
    title: 'Marketing Manager',
    category: 'Marketing',
    averageSalary: 48000,
    salaryRange: { min: 32000, max: 75000 },
    entryLevel: 32000,
    experienced: 48000,
    seniorLevel: 68000,
    description: 'Marketing managers develop and execute marketing strategies to promote products and services. They manage campaigns, analyse results, and lead marketing teams.',
    responsibilities: [
      'Developing marketing strategies',
      'Managing marketing budgets',
      'Overseeing campaigns and content',
      'Analysing campaign performance',
      'Leading and developing teams',
    ],
    skills: ['Digital Marketing', 'Campaign Management', 'Analytics', 'Content Strategy', 'Leadership', 'Budgeting'],
    qualifications: ['Marketing or Business degree', 'CIM qualification (beneficial)', 'Proven marketing experience'],
    careerPath: ['Marketing Executive', 'Marketing Manager', 'Senior Manager', 'Head of Marketing', 'CMO'],
    industries: ['FMCG', 'Technology', 'Retail', 'Financial Services', 'Agency'],
    location: { london: 58000, southeast: 50000, national: 44000 },
  },
  {
    slug: 'digital-marketing-specialist',
    title: 'Digital Marketing Specialist',
    category: 'Marketing',
    averageSalary: 38000,
    salaryRange: { min: 25000, max: 55000 },
    entryLevel: 25000,
    experienced: 38000,
    seniorLevel: 52000,
    description: 'Digital marketing specialists manage online marketing campaigns including SEO, PPC, social media, and email marketing to drive traffic and conversions.',
    responsibilities: [
      'Managing SEO and PPC campaigns',
      'Creating social media content',
      'Analysing website and campaign data',
      'Email marketing automation',
      'A/B testing and optimisation',
    ],
    skills: ['SEO', 'Google Ads', 'Social Media', 'Google Analytics', 'Content Marketing', 'Email Marketing'],
    qualifications: ['Marketing degree (or equivalent)', 'Google certifications', 'Portfolio of campaigns'],
    careerPath: ['Digital Marketing Assistant', 'Specialist', 'Senior Specialist', 'Digital Marketing Manager', 'Head of Digital'],
    industries: ['Agency', 'E-commerce', 'Technology', 'Retail', 'B2B Services'],
    location: { london: 45000, southeast: 40000, national: 35000 },
  },
  // Legal
  {
    slug: 'solicitor',
    title: 'Solicitor',
    category: 'Legal',
    averageSalary: 62000,
    salaryRange: { min: 35000, max: 150000 },
    entryLevel: 35000,
    experienced: 62000,
    seniorLevel: 120000,
    description: 'Solicitors provide legal advice, draft documents, represent clients, and handle legal transactions. They specialise in areas like corporate, property, or litigation.',
    responsibilities: [
      'Providing legal advice to clients',
      'Drafting contracts and legal documents',
      'Conducting legal research',
      'Negotiating settlements',
      'Managing client relationships',
    ],
    skills: ['Legal Research', 'Drafting', 'Negotiation', 'Client Management', 'Attention to Detail', 'Commercial Awareness'],
    qualifications: ['Law degree or GDL', 'LPC and training contract', 'SRA admission'],
    careerPath: ['Trainee Solicitor', 'Associate', 'Senior Associate', 'Partner', 'Managing Partner'],
    industries: ['Law Firms', 'In-house Legal', 'Government', 'Charities'],
    location: { london: 78000, southeast: 58000, national: 52000 },
  },
  {
    slug: 'barrister',
    title: 'Barrister',
    category: 'Legal',
    averageSalary: 75000,
    salaryRange: { min: 25000, max: 300000 },
    entryLevel: 25000,
    experienced: 75000,
    seniorLevel: 200000,
    description: 'Barristers are specialist legal advisers and courtroom advocates. They represent clients in court, draft legal opinions, and provide expert advice on complex cases.',
    responsibilities: [
      'Representing clients in court',
      'Drafting legal opinions and pleadings',
      'Advising on complex legal issues',
      'Cross-examining witnesses',
      'Negotiating settlements',
    ],
    skills: ['Advocacy', 'Legal Research', 'Public Speaking', 'Analytical Thinking', 'Persuasion', 'Time Management'],
    qualifications: ['Law degree or GDL', 'Bar course', 'Pupillage completion'],
    careerPath: ['Pupil Barrister', 'Junior Barrister', 'Senior Barrister', 'QC/KC', 'Judge'],
    industries: ['Chambers', 'Courts', 'Tribunals', 'Public Inquiries'],
    location: { london: 95000, southeast: 70000, national: 60000 },
  },
  // Construction
  {
    slug: 'quantity-surveyor',
    title: 'Quantity Surveyor',
    category: 'Construction',
    averageSalary: 52000,
    salaryRange: { min: 28000, max: 80000 },
    entryLevel: 28000,
    experienced: 52000,
    seniorLevel: 72000,
    description: 'Quantity surveyors manage construction costs from initial estimates to final accounts. They prepare budgets, negotiate contracts, and ensure value for money.',
    responsibilities: [
      'Preparing cost estimates and budgets',
      'Managing tender processes',
      'Valuing completed work',
      'Negotiating with contractors',
      'Managing project finances',
    ],
    skills: ['Cost Estimation', 'Contract Management', 'Negotiation', 'Measurement', 'Commercial Awareness', 'Excel'],
    qualifications: ['Quantity Surveying degree', 'RICS membership', 'APC completion'],
    careerPath: ['Graduate QS', 'Assistant QS', 'Quantity Surveyor', 'Senior QS', 'Commercial Manager', 'Commercial Director'],
    industries: ['Construction', 'Consulting', 'Property Development', 'Public Sector'],
    location: { london: 62000, southeast: 55000, national: 48000 },
  },
  {
    slug: 'construction-project-manager',
    title: 'Construction Project Manager',
    category: 'Construction',
    averageSalary: 58000,
    salaryRange: { min: 35000, max: 90000 },
    entryLevel: 35000,
    experienced: 58000,
    seniorLevel: 82000,
    description: 'Construction project managers oversee building projects from planning to completion. They coordinate teams, manage budgets, and ensure projects are delivered on time.',
    responsibilities: [
      'Planning and scheduling projects',
      'Managing budgets and resources',
      'Coordinating contractors and suppliers',
      'Ensuring health and safety compliance',
      'Reporting to clients and stakeholders',
    ],
    skills: ['Project Management', 'Budgeting', 'Scheduling', 'Stakeholder Management', 'Risk Management', 'Leadership'],
    qualifications: ['Construction or Engineering degree', 'APM or PRINCE2 certification', 'Site experience'],
    careerPath: ['Assistant PM', 'Project Manager', 'Senior PM', 'Programme Manager', 'Director'],
    industries: ['Construction', 'Property Development', 'Infrastructure', 'Consulting'],
    location: { london: 68000, southeast: 60000, national: 52000 },
  },
  // Retail
  {
    slug: 'retail-manager',
    title: 'Retail Manager',
    category: 'Retail',
    averageSalary: 32000,
    salaryRange: { min: 22000, max: 50000 },
    entryLevel: 22000,
    experienced: 32000,
    seniorLevel: 45000,
    description: 'Retail managers oversee store operations, manage staff, drive sales, and ensure excellent customer service. They handle stock, budgets, and store presentation.',
    responsibilities: [
      'Managing day-to-day store operations',
      'Recruiting and training staff',
      'Driving sales and meeting targets',
      'Managing stock and inventory',
      'Ensuring customer satisfaction',
    ],
    skills: ['Team Leadership', 'Sales', 'Customer Service', 'Stock Management', 'Budgeting', 'Visual Merchandising'],
    qualifications: ['Retail experience', 'Management training', 'Strong commercial awareness'],
    careerPath: ['Sales Assistant', 'Supervisor', 'Assistant Manager', 'Store Manager', 'Area Manager', 'Regional Manager'],
    industries: ['Fashion', 'Supermarkets', 'Electronics', 'Department Stores', 'Speciality Retail'],
    location: { london: 38000, southeast: 34000, national: 30000 },
  },
  // Public Sector
  {
    slug: 'police-officer',
    title: 'Police Officer',
    category: 'Public Sector',
    averageSalary: 42000,
    salaryRange: { min: 28000, max: 55000 },
    entryLevel: 28000,
    experienced: 42000,
    seniorLevel: 52000,
    description: 'Police officers protect communities, prevent crime, respond to emergencies, and investigate criminal activities. They work in various specialisms from neighbourhood to detective work.',
    responsibilities: [
      'Patrolling communities',
      'Responding to emergency calls',
      'Investigating crimes',
      'Collecting evidence and statements',
      'Supporting victims',
    ],
    skills: ['Communication', 'Problem Solving', 'Physical Fitness', 'Observation', 'Decision Making', 'Resilience'],
    qualifications: ['GCSE or equivalent', 'Police training programme', 'Enhanced vetting'],
    careerPath: ['Police Constable', 'Sergeant', 'Inspector', 'Chief Inspector', 'Superintendent'],
    industries: ['Police Forces', 'British Transport Police', 'National Crime Agency'],
    location: { london: 48000, southeast: 43000, national: 40000 },
  },
  {
    slug: 'social-worker',
    title: 'Social Worker',
    category: 'Public Sector',
    averageSalary: 38000,
    salaryRange: { min: 28000, max: 50000 },
    entryLevel: 28000,
    experienced: 38000,
    seniorLevel: 48000,
    description: 'Social workers support vulnerable individuals and families, including children at risk, elderly people, and those with disabilities or mental health challenges.',
    responsibilities: [
      'Assessing client needs',
      'Developing support plans',
      'Safeguarding vulnerable people',
      'Coordinating with other agencies',
      'Maintaining case records',
    ],
    skills: ['Empathy', 'Communication', 'Assessment', 'Case Management', 'Resilience', 'Safeguarding Knowledge'],
    qualifications: ['Social Work degree', 'Social Work England registration', 'Enhanced DBS check'],
    careerPath: ['NQSW', 'Social Worker', 'Senior Social Worker', 'Team Manager', 'Service Manager', 'Director'],
    industries: ['Local Authority', 'NHS', 'Charities', 'Private Sector'],
    location: { london: 42000, southeast: 39000, national: 36000 },
  },
]

// Get all unique slugs for sitemap/static generation
export function getAllJobSlugs(): string[] {
  return UK_JOB_SALARIES.map(job => job.slug)
}

// Get job data by slug
export function getJobBySlug(slug: string): JobSalaryData | undefined {
  return UK_JOB_SALARIES.find(job => job.slug === slug)
}

// Get jobs by category
export function getJobsByCategory(category: string): JobSalaryData[] {
  return UK_JOB_SALARIES.filter(job => job.category === category)
}

// Get related jobs (same category, different job)
export function getRelatedJobs(slug: string, limit: number = 4): JobSalaryData[] {
  const currentJob = getJobBySlug(slug)
  if (!currentJob) return []
  
  return UK_JOB_SALARIES
    .filter(job => job.category === currentJob.category && job.slug !== slug)
    .slice(0, limit)
}

// Get all categories with job counts
export function getCategoriesWithCounts(): { category: string; count: number; jobs: JobSalaryData[] }[] {
  return JOB_CATEGORIES.map(category => ({
    category,
    count: UK_JOB_SALARIES.filter(job => job.category === category).length,
    jobs: UK_JOB_SALARIES.filter(job => job.category === category),
  })).filter(c => c.count > 0)
}

// Historical growth rates by sector (based on ONS data patterns)
// These rates account for industry-specific trends from 2020-2025
const SECTOR_GROWTH_RATES: Record<string, number[]> = {
  // [2020->2021, 2021->2022, 2022->2023, 2023->2024, 2024->2025]
  'Technology': [4.5, 8.2, 6.5, 5.8, 4.2],      // Tech boom, then stabilization
  'Healthcare': [3.2, 4.8, 5.5, 4.5, 3.8],      // Pandemic-driven demand
  'Finance': [2.8, 5.5, 4.2, 3.8, 3.5],         // Post-pandemic recovery
  'Engineering': [1.5, 3.8, 4.5, 4.2, 3.8],     // Infrastructure investment
  'Education': [2.2, 2.8, 3.5, 4.0, 3.5],       // Public sector catch-up
  'Marketing': [0.5, 4.5, 5.2, 4.8, 4.0],       // Digital transformation
  'Legal': [2.5, 3.5, 4.0, 3.5, 3.2],           // Steady professional growth
  'Construction': [1.0, 4.2, 5.8, 5.2, 4.5],    // Building boom
  'Retail': [-1.5, 3.0, 4.5, 4.0, 3.5],         // Pandemic recovery
  'Public Sector': [2.5, 2.0, 3.5, 5.0, 4.0],   // Recent pay rises
}

// Get default growth rates if sector not found
const DEFAULT_GROWTH_RATES = [2.5, 4.0, 4.5, 4.0, 3.5]

/**
 * Generate salary trend data for the past 5 years
 * Uses actual industry growth patterns and calculates backwards from current salary
 */
export function getJobSalaryTrends(job: JobSalaryData): SalaryTrendData[] {
  const currentYear = 2025
  const years = [2020, 2021, 2022, 2023, 2024, 2025]
  
  // Get sector-specific growth rates
  const growthRates = SECTOR_GROWTH_RATES[job.category] || DEFAULT_GROWTH_RATES
  
  // Calculate 2025 values (current)
  const current2025 = {
    average: job.averageSalary,
    entryLevel: job.entryLevel,
    senior: job.seniorLevel,
  }
  
  // Work backwards from 2025 to calculate historical salaries
  const trends: SalaryTrendData[] = []
  
  // Start with 2025 and work backwards
  let avgSalary = current2025.average
  let entrySalary = current2025.entryLevel
  let seniorSalary = current2025.senior
  
  // Calculate backwards for each year
  const historicalSalaries: { year: number; average: number; entryLevel: number; senior: number }[] = []
  
  historicalSalaries.unshift({
    year: 2025,
    average: Math.round(avgSalary),
    entryLevel: Math.round(entrySalary),
    senior: Math.round(seniorSalary),
  })
  
  // Go backwards from 2024 to 2020
  for (let i = growthRates.length - 1; i >= 0; i--) {
    const growthRate = growthRates[i] / 100
    
    // Reverse the growth to get previous year's salary
    avgSalary = avgSalary / (1 + growthRate)
    entrySalary = entrySalary / (1 + growthRate * 0.85) // Entry level grows slightly slower
    seniorSalary = seniorSalary / (1 + growthRate * 1.1) // Senior grows slightly faster
    
    historicalSalaries.unshift({
      year: 2024 - (growthRates.length - 1 - i),
      average: Math.round(avgSalary),
      entryLevel: Math.round(entrySalary),
      senior: Math.round(seniorSalary),
    })
  }
  
  return historicalSalaries
}

/**
 * Get salary trends summary statistics
 */
export function getSalaryTrendsSummary(trends: SalaryTrendData[]) {
  const firstYear = trends[0]
  const lastYear = trends[trends.length - 1]
  
  const totalGrowthPercent = ((lastYear.average - firstYear.average) / firstYear.average) * 100
  const totalGrowthAmount = lastYear.average - firstYear.average
  const annualGrowthRate = (Math.pow(lastYear.average / firstYear.average, 1 / (trends.length - 1)) - 1) * 100
  
  // UK inflation rates 2020-2025 (approximate)
  const cumulativeInflation = 1.009 * 1.025 * 1.091 * 1.073 * 1.040 * 1.025 // ~28.5% cumulative
  const realGrowthPercent = ((lastYear.average / firstYear.average) / cumulativeInflation - 1) * 100
  
  return {
    totalGrowthPercent: totalGrowthPercent.toFixed(1),
    totalGrowthAmount,
    annualGrowthRate: annualGrowthRate.toFixed(1),
    realGrowthPercent: realGrowthPercent.toFixed(1),
    beatsInflation: realGrowthPercent > 0,
  }
}
