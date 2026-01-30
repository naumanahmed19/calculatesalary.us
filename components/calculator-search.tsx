'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { navSections } from '@/lib/nav-config'

interface CalculatorSearchProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CalculatorSearch({ open, onOpenChange }: CalculatorSearchProps) {
  const router = useRouter()

  const handleSelect = (href: string) => {
    onOpenChange(false)
    router.push(href)
  }

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search Calculators"
      description="Search for a calculator to use"
      showCloseButton={false}
    >
      <CommandInput placeholder="Search calculators..." />
      <CommandList>
        <CommandEmpty>No calculator found.</CommandEmpty>
        {navSections.map((section) => (
          <CommandGroup key={section.label} heading={section.label}>
            {section.items.map((item) => (
              <CommandItem
                key={item.href}
                value={`${item.title} ${item.description}`}
                onSelect={() => handleSelect(item.href)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                <div className="flex flex-col">
                  <span>{item.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {item.description}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  )
}
