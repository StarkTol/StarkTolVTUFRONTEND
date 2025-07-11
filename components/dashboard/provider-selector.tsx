"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface Provider {
  id: string
  name: string
  logo: string
}

interface ProviderSelectorProps {
  providers: Provider[]
  selectedProvider: string | null
  onSelect: (providerId: string) => void
}

export function ProviderSelector({ providers, selectedProvider, onSelect }: ProviderSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredProviders = providers.filter((provider) =>
    provider.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search provider..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {filteredProviders.map((provider) => (
          <div
            key={provider.id}
            className={`flex cursor-pointer flex-col items-center gap-2 rounded-lg border p-4 transition-all hover:border-primary hover:shadow-md ${
              selectedProvider === provider.id ? "border-primary bg-primary/5" : ""
            }`}
            onClick={() => onSelect(provider.id)}
          >
            <div className="flex h-12 w-12 items-center justify-center">
              <img
                src={provider.logo || "/placeholder.svg"}
                alt={provider.name}
                className="h-full w-auto object-contain"
              />
            </div>
            <span className="text-center text-sm font-medium">{provider.name}</span>
          </div>
        ))}

        {filteredProviders.length === 0 && (
          <div className="col-span-full py-8 text-center text-muted-foreground">
            No providers found matching "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  )
}
