'use client'

import { useState } from 'react'
import { Copy, Check, Share2, Download, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { SalaryResult } from '@/lib/us-tax-calculator'
import { formatCurrency, TAX_YEAR } from '@/lib/us-tax-calculator'

interface ShareResultsProps {
  result: SalaryResult
  grossIncome: number
}

function generateResultsText(result: SalaryResult, grossIncome: number): string {
  const { yearly } = result

  return `US Salary Breakdown (${TAX_YEAR})
State: ${result.stateName}
Filing Status: ${result.filingStatus.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}

💰 Gross Income: ${formatCurrency(grossIncome)}
📊 Taxable Income: ${formatCurrency(yearly.taxableIncome)}

Deductions:
• Federal Tax: ${formatCurrency(yearly.federalTax)}
• State Tax: ${formatCurrency(yearly.stateTax)}${yearly.localTax > 0 ? `\n• Local Tax: ${formatCurrency(yearly.localTax)}` : ''}
• Social Security: ${formatCurrency(yearly.socialSecurity)}
• Medicare: ${formatCurrency(yearly.medicare)}
${yearly.retirement401k > 0 ? `• 401(k): ${formatCurrency(yearly.retirement401k)}\n` : ''}${yearly.hsaContribution > 0 ? `• HSA: ${formatCurrency(yearly.hsaContribution)}\n` : ''}
💵 Take Home Pay:
• Yearly: ${formatCurrency(yearly.takeHomePay)}
• Monthly: ${formatCurrency(result.monthly.takeHomePay)}
• Bi-weekly: ${formatCurrency(result.biweekly.takeHomePay)}

📈 Effective Tax Rate: ${yearly.effectiveTaxRate.toFixed(1)}%
📈 Marginal Tax Rate: ${yearly.marginalTaxRate}%

Calculated at ussalarycalculator.com`
}

function generateEmailBody(result: SalaryResult, grossIncome: number): string {
  const text = generateResultsText(result, grossIncome)
  return encodeURIComponent(text)
}

function generateEmailSubject(grossIncome: number): string {
  return encodeURIComponent(`US Salary Breakdown - ${formatCurrency(grossIncome)} (${TAX_YEAR})`)
}

export function ShareResults({ result, grossIncome }: ShareResultsProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const text = generateResultsText(result, grossIncome)
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleShare = async () => {
    const text = generateResultsText(result, grossIncome)
    const shareData = {
      title: `US Salary Breakdown - ${formatCurrency(grossIncome)}`,
      text: text,
      url: window.location.href,
    }

    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData)
      } catch {
        handleCopy()
      }
    } else {
      handleCopy()
    }
  }

  const handleEmail = () => {
    const subject = generateEmailSubject(grossIncome)
    const body = generateEmailBody(result, grossIncome)
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  const handleDownload = () => {
    const text = generateResultsText(result, grossIncome)
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `salary-breakdown-${formatCurrency(grossIncome, 0).replace(/[$,]/g, '')}-${TAX_YEAR}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-100 hover:text-white hover:bg-blue-700/50"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleCopy} className="cursor-pointer">
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2 text-blue-600" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              Copy to Clipboard
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleShare} className="cursor-pointer">
          <Share2 className="h-4 w-4 mr-2" />
          Share Results
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleEmail} className="cursor-pointer">
          <Mail className="h-4 w-4 mr-2" />
          Email Results
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDownload} className="cursor-pointer">
          <Download className="h-4 w-4 mr-2" />
          Download as Text
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
