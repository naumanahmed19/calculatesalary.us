// =============================================================================
// US TAX CONFIGURATION - CENTRALIZED TAX YEAR SETTINGS
// =============================================================================

export type FilingStatus = 'single' | 'married_jointly' | 'married_separately' | 'head_of_household'
export type USState = keyof typeof STATE_TAX_CONFIGS

export interface FederalTaxBracket {
  min: number
  max: number
  rate: number
}

export interface StateTaxConfig {
  name: string
  hasIncomeTax: boolean
  brackets?: FederalTaxBracket[]
  flatRate?: number
  standardDeduction?: number
  personalExemption?: number
  localTaxRate?: number
}

export interface TaxYearConfig {
  year: string
  label: string

  standardDeduction: {
    single: number
    married_jointly: number
    married_separately: number
    head_of_household: number
  }

  federalBrackets: {
    single: FederalTaxBracket[]
    married_jointly: FederalTaxBracket[]
    married_separately: FederalTaxBracket[]
    head_of_household: FederalTaxBracket[]
  }

  socialSecurity: {
    rate: number
    wageBase: number
  }

  medicare: {
    rate: number
    additionalRate: number
    additionalThreshold: {
      single: number
      married_jointly: number
      married_separately: number
      head_of_household: number
    }
  }

  selfEmployment: {
    socialSecurityRate: number
    medicareRate: number
    deductiblePortion: number
  }

  retirement401k: {
    employeeLimit: number
    catchUpLimit: number
    employerLimit: number
  }

  ira: {
    traditionalLimit: number
    rothLimit: number
    catchUpLimit: number
  }

  hsa: {
    selfOnly: number
    family: number
    catchUpLimit: number
  }

  childTaxCredit: {
    amountPerChild: number
    phaseOutThreshold: {
      single: number
      married_jointly: number
    }
  }

  eitc: {
    maxCredit: {
      noChildren: number
      oneChild: number
      twoChildren: number
      threeOrMore: number
    }
  }

  federalMinimumWage: number
}

// =============================================================================
// STATE TAX CONFIGURATIONS
// =============================================================================

export const STATE_TAX_CONFIGS: Record<string, StateTaxConfig> = {
  // No Income Tax States
  AK: { name: 'Alaska', hasIncomeTax: false },
  FL: { name: 'Florida', hasIncomeTax: false },
  NV: { name: 'Nevada', hasIncomeTax: false },
  NH: { name: 'New Hampshire', hasIncomeTax: false },
  SD: { name: 'South Dakota', hasIncomeTax: false },
  TN: { name: 'Tennessee', hasIncomeTax: false },
  TX: { name: 'Texas', hasIncomeTax: false },
  WA: { name: 'Washington', hasIncomeTax: false },
  WY: { name: 'Wyoming', hasIncomeTax: false },

  // Flat Tax States
  AZ: { name: 'Arizona', hasIncomeTax: true, flatRate: 0.025, standardDeduction: 14600 },
  CO: { name: 'Colorado', hasIncomeTax: true, flatRate: 0.044, standardDeduction: 14600 },
  ID: { name: 'Idaho', hasIncomeTax: true, flatRate: 0.058, standardDeduction: 14600 },
  IL: { name: 'Illinois', hasIncomeTax: true, flatRate: 0.0495, standardDeduction: 0 },
  IN: { name: 'Indiana', hasIncomeTax: true, flatRate: 0.0305, standardDeduction: 0 },
  KY: { name: 'Kentucky', hasIncomeTax: true, flatRate: 0.04, standardDeduction: 3160 },
  MA: { name: 'Massachusetts', hasIncomeTax: true, flatRate: 0.05, standardDeduction: 0 },
  MI: { name: 'Michigan', hasIncomeTax: true, flatRate: 0.0425, personalExemption: 5600 },
  MS: { name: 'Mississippi', hasIncomeTax: true, flatRate: 0.05, standardDeduction: 2300 },
  NC: { name: 'North Carolina', hasIncomeTax: true, flatRate: 0.0475, standardDeduction: 12750 },
  ND: { name: 'North Dakota', hasIncomeTax: true, flatRate: 0.0195, standardDeduction: 14600 },
  PA: { name: 'Pennsylvania', hasIncomeTax: true, flatRate: 0.0307, standardDeduction: 0 },
  UT: { name: 'Utah', hasIncomeTax: true, flatRate: 0.0465, standardDeduction: 0 },

  // Progressive Tax States
  AL: {
    name: 'Alabama', hasIncomeTax: true, standardDeduction: 3000,
    brackets: [
      { min: 0, max: 500, rate: 0.02 },
      { min: 500, max: 3000, rate: 0.04 },
      { min: 3000, max: Infinity, rate: 0.05 },
    ],
  },
  AR: {
    name: 'Arkansas', hasIncomeTax: true, standardDeduction: 2340,
    brackets: [
      { min: 0, max: 5099, rate: 0.0 },
      { min: 5099, max: 10299, rate: 0.02 },
      { min: 10299, max: 14699, rate: 0.03 },
      { min: 14699, max: 24299, rate: 0.034 },
      { min: 24299, max: 87000, rate: 0.039 },
      { min: 87000, max: Infinity, rate: 0.044 },
    ],
  },
  CA: {
    name: 'California', hasIncomeTax: true, standardDeduction: 5540,
    brackets: [
      { min: 0, max: 10412, rate: 0.01 },
      { min: 10412, max: 24684, rate: 0.02 },
      { min: 24684, max: 38959, rate: 0.04 },
      { min: 38959, max: 54081, rate: 0.06 },
      { min: 54081, max: 68350, rate: 0.08 },
      { min: 68350, max: 349137, rate: 0.093 },
      { min: 349137, max: 418961, rate: 0.103 },
      { min: 418961, max: 698271, rate: 0.113 },
      { min: 698271, max: 1000000, rate: 0.123 },
      { min: 1000000, max: Infinity, rate: 0.133 },
    ],
  },
  CT: {
    name: 'Connecticut', hasIncomeTax: true,
    brackets: [
      { min: 0, max: 10000, rate: 0.02 },
      { min: 10000, max: 50000, rate: 0.045 },
      { min: 50000, max: 100000, rate: 0.055 },
      { min: 100000, max: 200000, rate: 0.06 },
      { min: 200000, max: 250000, rate: 0.065 },
      { min: 250000, max: 500000, rate: 0.069 },
      { min: 500000, max: Infinity, rate: 0.0699 },
    ],
  },
  DE: {
    name: 'Delaware', hasIncomeTax: true, standardDeduction: 3250,
    brackets: [
      { min: 0, max: 2000, rate: 0.0 },
      { min: 2000, max: 5000, rate: 0.022 },
      { min: 5000, max: 10000, rate: 0.039 },
      { min: 10000, max: 20000, rate: 0.048 },
      { min: 20000, max: 25000, rate: 0.052 },
      { min: 25000, max: 60000, rate: 0.0555 },
      { min: 60000, max: Infinity, rate: 0.066 },
    ],
  },
  GA: {
    name: 'Georgia', hasIncomeTax: true, standardDeduction: 12000,
    brackets: [
      { min: 0, max: 7000, rate: 0.01 },
      { min: 7000, max: 10000, rate: 0.02 },
      { min: 10000, max: Infinity, rate: 0.055 },
    ],
  },
  HI: {
    name: 'Hawaii', hasIncomeTax: true, standardDeduction: 2200,
    brackets: [
      { min: 0, max: 2400, rate: 0.014 },
      { min: 2400, max: 4800, rate: 0.032 },
      { min: 4800, max: 9600, rate: 0.055 },
      { min: 9600, max: 14400, rate: 0.064 },
      { min: 14400, max: 19200, rate: 0.068 },
      { min: 19200, max: 24000, rate: 0.072 },
      { min: 24000, max: 36000, rate: 0.076 },
      { min: 36000, max: 48000, rate: 0.079 },
      { min: 48000, max: 150000, rate: 0.0825 },
      { min: 150000, max: 175000, rate: 0.09 },
      { min: 175000, max: 200000, rate: 0.10 },
      { min: 200000, max: Infinity, rate: 0.11 },
    ],
  },
  IA: {
    name: 'Iowa', hasIncomeTax: true, standardDeduction: 14600,
    brackets: [
      { min: 0, max: 6210, rate: 0.044 },
      { min: 6210, max: 31050, rate: 0.0482 },
      { min: 31050, max: Infinity, rate: 0.057 },
    ],
  },
  KS: {
    name: 'Kansas', hasIncomeTax: true, standardDeduction: 3500,
    brackets: [
      { min: 0, max: 15000, rate: 0.031 },
      { min: 15000, max: 30000, rate: 0.0525 },
      { min: 30000, max: Infinity, rate: 0.057 },
    ],
  },
  LA: {
    name: 'Louisiana', hasIncomeTax: true, standardDeduction: 4500,
    brackets: [
      { min: 0, max: 12500, rate: 0.0185 },
      { min: 12500, max: 50000, rate: 0.035 },
      { min: 50000, max: Infinity, rate: 0.0425 },
    ],
  },
  ME: {
    name: 'Maine', hasIncomeTax: true, standardDeduction: 14600,
    brackets: [
      { min: 0, max: 26050, rate: 0.058 },
      { min: 26050, max: 61600, rate: 0.0675 },
      { min: 61600, max: Infinity, rate: 0.0715 },
    ],
  },
  MD: {
    name: 'Maryland', hasIncomeTax: true, standardDeduction: 2550, localTaxRate: 0.032,
    brackets: [
      { min: 0, max: 1000, rate: 0.02 },
      { min: 1000, max: 2000, rate: 0.03 },
      { min: 2000, max: 3000, rate: 0.04 },
      { min: 3000, max: 100000, rate: 0.0475 },
      { min: 100000, max: 125000, rate: 0.05 },
      { min: 125000, max: 150000, rate: 0.0525 },
      { min: 150000, max: 250000, rate: 0.055 },
      { min: 250000, max: Infinity, rate: 0.0575 },
    ],
  },
  MN: {
    name: 'Minnesota', hasIncomeTax: true, standardDeduction: 14575,
    brackets: [
      { min: 0, max: 31690, rate: 0.0535 },
      { min: 31690, max: 104090, rate: 0.068 },
      { min: 104090, max: 193240, rate: 0.0785 },
      { min: 193240, max: Infinity, rate: 0.0985 },
    ],
  },
  MO: {
    name: 'Missouri', hasIncomeTax: true, standardDeduction: 14600,
    brackets: [
      { min: 0, max: 1207, rate: 0.0 },
      { min: 1207, max: 2414, rate: 0.02 },
      { min: 2414, max: 3621, rate: 0.025 },
      { min: 3621, max: 4828, rate: 0.03 },
      { min: 4828, max: 6035, rate: 0.035 },
      { min: 6035, max: 7242, rate: 0.04 },
      { min: 7242, max: 8449, rate: 0.045 },
      { min: 8449, max: Infinity, rate: 0.048 },
    ],
  },
  MT: {
    name: 'Montana', hasIncomeTax: true, standardDeduction: 14600,
    brackets: [
      { min: 0, max: 20500, rate: 0.047 },
      { min: 20500, max: Infinity, rate: 0.059 },
    ],
  },
  NE: {
    name: 'Nebraska', hasIncomeTax: true, standardDeduction: 8000,
    brackets: [
      { min: 0, max: 3700, rate: 0.0246 },
      { min: 3700, max: 22170, rate: 0.0351 },
      { min: 22170, max: 35730, rate: 0.0501 },
      { min: 35730, max: Infinity, rate: 0.0584 },
    ],
  },
  NJ: {
    name: 'New Jersey', hasIncomeTax: true,
    brackets: [
      { min: 0, max: 20000, rate: 0.014 },
      { min: 20000, max: 35000, rate: 0.0175 },
      { min: 35000, max: 40000, rate: 0.035 },
      { min: 40000, max: 75000, rate: 0.05525 },
      { min: 75000, max: 500000, rate: 0.0637 },
      { min: 500000, max: 1000000, rate: 0.0897 },
      { min: 1000000, max: Infinity, rate: 0.1075 },
    ],
  },
  NM: {
    name: 'New Mexico', hasIncomeTax: true, standardDeduction: 14600,
    brackets: [
      { min: 0, max: 5500, rate: 0.017 },
      { min: 5500, max: 11000, rate: 0.032 },
      { min: 11000, max: 16000, rate: 0.047 },
      { min: 16000, max: 210000, rate: 0.049 },
      { min: 210000, max: Infinity, rate: 0.059 },
    ],
  },
  NY: {
    name: 'New York', hasIncomeTax: true, standardDeduction: 8000, localTaxRate: 0.03876,
    brackets: [
      { min: 0, max: 8500, rate: 0.04 },
      { min: 8500, max: 11700, rate: 0.045 },
      { min: 11700, max: 13900, rate: 0.0525 },
      { min: 13900, max: 80650, rate: 0.0585 },
      { min: 80650, max: 215400, rate: 0.0625 },
      { min: 215400, max: 1077550, rate: 0.0685 },
      { min: 1077550, max: 5000000, rate: 0.0965 },
      { min: 5000000, max: 25000000, rate: 0.103 },
      { min: 25000000, max: Infinity, rate: 0.109 },
    ],
  },
  OH: {
    name: 'Ohio', hasIncomeTax: true,
    brackets: [
      { min: 0, max: 26050, rate: 0.0 },
      { min: 26050, max: 100000, rate: 0.02765 },
      { min: 100000, max: Infinity, rate: 0.035 },
    ],
  },
  OK: {
    name: 'Oklahoma', hasIncomeTax: true, standardDeduction: 6350,
    brackets: [
      { min: 0, max: 1000, rate: 0.0025 },
      { min: 1000, max: 2500, rate: 0.0075 },
      { min: 2500, max: 3750, rate: 0.0175 },
      { min: 3750, max: 4900, rate: 0.0275 },
      { min: 4900, max: 7200, rate: 0.0375 },
      { min: 7200, max: Infinity, rate: 0.0475 },
    ],
  },
  OR: {
    name: 'Oregon', hasIncomeTax: true, standardDeduction: 2745,
    brackets: [
      { min: 0, max: 4300, rate: 0.0475 },
      { min: 4300, max: 10750, rate: 0.0675 },
      { min: 10750, max: 125000, rate: 0.0875 },
      { min: 125000, max: Infinity, rate: 0.099 },
    ],
  },
  RI: {
    name: 'Rhode Island', hasIncomeTax: true, standardDeduction: 10550,
    brackets: [
      { min: 0, max: 77450, rate: 0.0375 },
      { min: 77450, max: 176050, rate: 0.0475 },
      { min: 176050, max: Infinity, rate: 0.0599 },
    ],
  },
  SC: {
    name: 'South Carolina', hasIncomeTax: true, standardDeduction: 14600,
    brackets: [
      { min: 0, max: 3460, rate: 0.0 },
      { min: 3460, max: 17330, rate: 0.03 },
      { min: 17330, max: Infinity, rate: 0.064 },
    ],
  },
  VT: {
    name: 'Vermont', hasIncomeTax: true, standardDeduction: 7000,
    brackets: [
      { min: 0, max: 45400, rate: 0.0335 },
      { min: 45400, max: 110050, rate: 0.066 },
      { min: 110050, max: 229550, rate: 0.076 },
      { min: 229550, max: Infinity, rate: 0.0875 },
    ],
  },
  VA: {
    name: 'Virginia', hasIncomeTax: true, standardDeduction: 8500,
    brackets: [
      { min: 0, max: 3000, rate: 0.02 },
      { min: 3000, max: 5000, rate: 0.03 },
      { min: 5000, max: 17000, rate: 0.05 },
      { min: 17000, max: Infinity, rate: 0.0575 },
    ],
  },
  WV: {
    name: 'West Virginia', hasIncomeTax: true,
    brackets: [
      { min: 0, max: 10000, rate: 0.0236 },
      { min: 10000, max: 25000, rate: 0.0315 },
      { min: 25000, max: 40000, rate: 0.0354 },
      { min: 40000, max: 60000, rate: 0.0472 },
      { min: 60000, max: Infinity, rate: 0.0512 },
    ],
  },
  WI: {
    name: 'Wisconsin', hasIncomeTax: true, standardDeduction: 13230,
    brackets: [
      { min: 0, max: 14320, rate: 0.0354 },
      { min: 14320, max: 28640, rate: 0.0465 },
      { min: 28640, max: 315310, rate: 0.053 },
      { min: 315310, max: Infinity, rate: 0.0765 },
    ],
  },
  DC: {
    name: 'District of Columbia', hasIncomeTax: true, standardDeduction: 14600,
    brackets: [
      { min: 0, max: 10000, rate: 0.04 },
      { min: 10000, max: 40000, rate: 0.06 },
      { min: 40000, max: 60000, rate: 0.065 },
      { min: 60000, max: 250000, rate: 0.085 },
      { min: 250000, max: 500000, rate: 0.0925 },
      { min: 500000, max: 1000000, rate: 0.0975 },
      { min: 1000000, max: Infinity, rate: 0.1075 },
    ],
  },
}

// =============================================================================
// TAX YEAR CONFIGURATIONS
// =============================================================================

export const TAX_YEARS: Record<string, TaxYearConfig> = {
  '2025': {
    year: '2025',
    label: '2025 Tax Year',

    standardDeduction: {
      single: 15000,
      married_jointly: 30000,
      married_separately: 15000,
      head_of_household: 22500,
    },

    federalBrackets: {
      single: [
        { min: 0, max: 11925, rate: 0.10 },
        { min: 11925, max: 48475, rate: 0.12 },
        { min: 48475, max: 103350, rate: 0.22 },
        { min: 103350, max: 197300, rate: 0.24 },
        { min: 197300, max: 250500, rate: 0.32 },
        { min: 250500, max: 626350, rate: 0.35 },
        { min: 626350, max: Infinity, rate: 0.37 },
      ],
      married_jointly: [
        { min: 0, max: 23850, rate: 0.10 },
        { min: 23850, max: 96950, rate: 0.12 },
        { min: 96950, max: 206700, rate: 0.22 },
        { min: 206700, max: 394600, rate: 0.24 },
        { min: 394600, max: 501050, rate: 0.32 },
        { min: 501050, max: 751600, rate: 0.35 },
        { min: 751600, max: Infinity, rate: 0.37 },
      ],
      married_separately: [
        { min: 0, max: 11925, rate: 0.10 },
        { min: 11925, max: 48475, rate: 0.12 },
        { min: 48475, max: 103350, rate: 0.22 },
        { min: 103350, max: 197300, rate: 0.24 },
        { min: 197300, max: 250500, rate: 0.32 },
        { min: 250500, max: 375800, rate: 0.35 },
        { min: 375800, max: Infinity, rate: 0.37 },
      ],
      head_of_household: [
        { min: 0, max: 17000, rate: 0.10 },
        { min: 17000, max: 64850, rate: 0.12 },
        { min: 64850, max: 103350, rate: 0.22 },
        { min: 103350, max: 197300, rate: 0.24 },
        { min: 197300, max: 250500, rate: 0.32 },
        { min: 250500, max: 626350, rate: 0.35 },
        { min: 626350, max: Infinity, rate: 0.37 },
      ],
    },

    socialSecurity: {
      rate: 0.062,
      wageBase: 176100,
    },

    medicare: {
      rate: 0.0145,
      additionalRate: 0.009,
      additionalThreshold: {
        single: 200000,
        married_jointly: 250000,
        married_separately: 125000,
        head_of_household: 200000,
      },
    },

    selfEmployment: {
      socialSecurityRate: 0.124,
      medicareRate: 0.029,
      deductiblePortion: 0.5,
    },

    retirement401k: {
      employeeLimit: 23500,
      catchUpLimit: 7500,
      employerLimit: 70000,
    },

    ira: {
      traditionalLimit: 7000,
      rothLimit: 7000,
      catchUpLimit: 1000,
    },

    hsa: {
      selfOnly: 4300,
      family: 8550,
      catchUpLimit: 1000,
    },

    childTaxCredit: {
      amountPerChild: 2000,
      phaseOutThreshold: {
        single: 200000,
        married_jointly: 400000,
      },
    },

    eitc: {
      maxCredit: {
        noChildren: 632,
        oneChild: 4213,
        twoChildren: 6960,
        threeOrMore: 7830,
      },
    },

    federalMinimumWage: 7.25,
  },

  '2024': {
    year: '2024',
    label: '2024 Tax Year',

    standardDeduction: {
      single: 14600,
      married_jointly: 29200,
      married_separately: 14600,
      head_of_household: 21900,
    },

    federalBrackets: {
      single: [
        { min: 0, max: 11600, rate: 0.10 },
        { min: 11600, max: 47150, rate: 0.12 },
        { min: 47150, max: 100525, rate: 0.22 },
        { min: 100525, max: 191950, rate: 0.24 },
        { min: 191950, max: 243725, rate: 0.32 },
        { min: 243725, max: 609350, rate: 0.35 },
        { min: 609350, max: Infinity, rate: 0.37 },
      ],
      married_jointly: [
        { min: 0, max: 23200, rate: 0.10 },
        { min: 23200, max: 94300, rate: 0.12 },
        { min: 94300, max: 201050, rate: 0.22 },
        { min: 201050, max: 383900, rate: 0.24 },
        { min: 383900, max: 487450, rate: 0.32 },
        { min: 487450, max: 731200, rate: 0.35 },
        { min: 731200, max: Infinity, rate: 0.37 },
      ],
      married_separately: [
        { min: 0, max: 11600, rate: 0.10 },
        { min: 11600, max: 47150, rate: 0.12 },
        { min: 47150, max: 100525, rate: 0.22 },
        { min: 100525, max: 191950, rate: 0.24 },
        { min: 191950, max: 243725, rate: 0.32 },
        { min: 243725, max: 365600, rate: 0.35 },
        { min: 365600, max: Infinity, rate: 0.37 },
      ],
      head_of_household: [
        { min: 0, max: 16550, rate: 0.10 },
        { min: 16550, max: 63100, rate: 0.12 },
        { min: 63100, max: 100500, rate: 0.22 },
        { min: 100500, max: 191950, rate: 0.24 },
        { min: 191950, max: 243700, rate: 0.32 },
        { min: 243700, max: 609350, rate: 0.35 },
        { min: 609350, max: Infinity, rate: 0.37 },
      ],
    },

    socialSecurity: {
      rate: 0.062,
      wageBase: 168600,
    },

    medicare: {
      rate: 0.0145,
      additionalRate: 0.009,
      additionalThreshold: {
        single: 200000,
        married_jointly: 250000,
        married_separately: 125000,
        head_of_household: 200000,
      },
    },

    selfEmployment: {
      socialSecurityRate: 0.124,
      medicareRate: 0.029,
      deductiblePortion: 0.5,
    },

    retirement401k: {
      employeeLimit: 23000,
      catchUpLimit: 7500,
      employerLimit: 69000,
    },

    ira: {
      traditionalLimit: 7000,
      rothLimit: 7000,
      catchUpLimit: 1000,
    },

    hsa: {
      selfOnly: 4150,
      family: 8300,
      catchUpLimit: 1000,
    },

    childTaxCredit: {
      amountPerChild: 2000,
      phaseOutThreshold: {
        single: 200000,
        married_jointly: 400000,
      },
    },

    eitc: {
      maxCredit: {
        noChildren: 600,
        oneChild: 3995,
        twoChildren: 6604,
        threeOrMore: 7430,
      },
    },

    federalMinimumWage: 7.25,
  },
}

// =============================================================================
// CURRENT TAX YEAR SETTING
// =============================================================================
export const CURRENT_TAX_YEAR = '2025'
export const currentTaxConfig = TAX_YEARS[CURRENT_TAX_YEAR]
export const AVAILABLE_TAX_YEARS = Object.keys(TAX_YEARS).sort().reverse()

// =============================================================================
// STATE MINIMUM WAGES
// =============================================================================
export const STATE_MINIMUM_WAGES: Record<string, { wage: number; tipped?: number }> = {
  AL: { wage: 7.25 },
  AK: { wage: 11.91 },
  AZ: { wage: 14.70, tipped: 11.70 },
  AR: { wage: 11.00, tipped: 2.63 },
  CA: { wage: 16.50 },
  CO: { wage: 14.81, tipped: 11.79 },
  CT: { wage: 16.35, tipped: 6.38 },
  DE: { wage: 15.00, tipped: 2.23 },
  DC: { wage: 17.50, tipped: 10.00 },
  FL: { wage: 14.00, tipped: 10.98 },
  GA: { wage: 7.25 },
  HI: { wage: 14.00, tipped: 12.75 },
  ID: { wage: 7.25 },
  IL: { wage: 15.00, tipped: 9.00 },
  IN: { wage: 7.25 },
  IA: { wage: 7.25 },
  KS: { wage: 7.25 },
  KY: { wage: 7.25 },
  LA: { wage: 7.25 },
  ME: { wage: 14.65, tipped: 7.33 },
  MD: { wage: 15.00, tipped: 3.63 },
  MA: { wage: 15.00, tipped: 6.75 },
  MI: { wage: 10.56, tipped: 4.01 },
  MN: { wage: 11.13 },
  MS: { wage: 7.25 },
  MO: { wage: 13.75, tipped: 6.88 },
  MT: { wage: 10.55 },
  NE: { wage: 13.50, tipped: 2.13 },
  NV: { wage: 12.00 },
  NH: { wage: 7.25 },
  NJ: { wage: 15.49, tipped: 5.62 },
  NM: { wage: 12.00, tipped: 3.00 },
  NY: { wage: 16.50, tipped: 11.00 },
  NC: { wage: 7.25 },
  ND: { wage: 7.25 },
  OH: { wage: 10.70, tipped: 5.35 },
  OK: { wage: 7.25 },
  OR: { wage: 15.95 },
  PA: { wage: 7.25 },
  RI: { wage: 15.00, tipped: 3.89 },
  SC: { wage: 7.25 },
  SD: { wage: 11.50, tipped: 5.75 },
  TN: { wage: 7.25 },
  TX: { wage: 7.25 },
  UT: { wage: 7.25 },
  VT: { wage: 14.01, tipped: 7.01 },
  VA: { wage: 12.41, tipped: 2.13 },
  WA: { wage: 16.66 },
  WV: { wage: 8.75, tipped: 2.63 },
  WI: { wage: 7.25 },
  WY: { wage: 7.25 },
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export function getStateName(stateCode: string): string {
  return STATE_TAX_CONFIGS[stateCode]?.name || stateCode
}

export function getStatesWithNoIncomeTax(): string[] {
  return Object.entries(STATE_TAX_CONFIGS)
    .filter(([, config]) => !config.hasIncomeTax)
    .map(([code]) => code)
}

export function getStatesWithFlatTax(): string[] {
  return Object.entries(STATE_TAX_CONFIGS)
    .filter(([, config]) => config.hasIncomeTax && config.flatRate !== undefined)
    .map(([code]) => code)
}

export function getAllStates(): { code: string; name: string }[] {
  return Object.entries(STATE_TAX_CONFIGS)
    .map(([code, config]) => ({ code, name: config.name }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

export function getFederalTaxBracketInfo(
  filingStatus: FilingStatus = 'single',
  config: TaxYearConfig = currentTaxConfig
) {
  const brackets = config.federalBrackets[filingStatus]
  return brackets.map((bracket) => ({
    rate: `${(bracket.rate * 100).toFixed(0)}%`,
    range:
      bracket.max === Infinity
        ? `Over $${bracket.min.toLocaleString()}`
        : `$${bracket.min.toLocaleString()} - $${bracket.max.toLocaleString()}`,
  }))
}
