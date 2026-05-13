"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"

interface Country {
  code: string
  name: string
  dialCode: string
  flag: string
  currency: string
  currencySymbol: string
}

interface CountryGroup {
  continent: string
  countries: Country[]
}

const countryGroups: CountryGroup[] = [
  {
    continent: "America del Norte",
    countries: [
      { code: "MX", name: "Mexico", dialCode: "+52", flag: "🇲🇽", currency: "MXN", currencySymbol: "$" },
      { code: "US", name: "Estados Unidos", dialCode: "+1", flag: "🇺🇸", currency: "USD", currencySymbol: "US$" },
      { code: "CA", name: "Canada", dialCode: "+1", flag: "🇨🇦", currency: "CAD", currencySymbol: "CA$" },
    ]
  },
  {
    continent: "America Central y Caribe",
    countries: [
      { code: "GT", name: "Guatemala", dialCode: "+502", flag: "🇬🇹", currency: "GTQ", currencySymbol: "Q" },
      { code: "HN", name: "Honduras", dialCode: "+504", flag: "🇭🇳", currency: "HNL", currencySymbol: "L" },
      { code: "SV", name: "El Salvador", dialCode: "+503", flag: "🇸🇻", currency: "USD", currencySymbol: "US$" },
      { code: "NI", name: "Nicaragua", dialCode: "+505", flag: "🇳🇮", currency: "NIO", currencySymbol: "C$" },
      { code: "CR", name: "Costa Rica", dialCode: "+506", flag: "🇨🇷", currency: "CRC", currencySymbol: "₡" },
      { code: "PA", name: "Panama", dialCode: "+507", flag: "🇵🇦", currency: "PAB", currencySymbol: "B/." },
      { code: "CU", name: "Cuba", dialCode: "+53", flag: "🇨🇺", currency: "CUP", currencySymbol: "₱" },
      { code: "DO", name: "Rep. Dominicana", dialCode: "+1809", flag: "🇩🇴", currency: "DOP", currencySymbol: "RD$" },
      { code: "PR", name: "Puerto Rico", dialCode: "+1787", flag: "🇵🇷", currency: "USD", currencySymbol: "US$" },
    ]
  },
  {
    continent: "America del Sur",
    countries: [
      { code: "CO", name: "Colombia", dialCode: "+57", flag: "🇨🇴", currency: "COP", currencySymbol: "COL$" },
      { code: "VE", name: "Venezuela", dialCode: "+58", flag: "🇻🇪", currency: "VES", currencySymbol: "Bs." },
      { code: "EC", name: "Ecuador", dialCode: "+593", flag: "🇪🇨", currency: "USD", currencySymbol: "US$" },
      { code: "PE", name: "Peru", dialCode: "+51", flag: "🇵🇪", currency: "PEN", currencySymbol: "S/" },
      { code: "BO", name: "Bolivia", dialCode: "+591", flag: "🇧🇴", currency: "BOB", currencySymbol: "Bs" },
      { code: "CL", name: "Chile", dialCode: "+56", flag: "🇨🇱", currency: "CLP", currencySymbol: "CLP$" },
      { code: "AR", name: "Argentina", dialCode: "+54", flag: "🇦🇷", currency: "ARS", currencySymbol: "AR$" },
      { code: "UY", name: "Uruguay", dialCode: "+598", flag: "🇺🇾", currency: "UYU", currencySymbol: "$U" },
      { code: "PY", name: "Paraguay", dialCode: "+595", flag: "🇵🇾", currency: "PYG", currencySymbol: "₲" },
      { code: "BR", name: "Brasil", dialCode: "+55", flag: "🇧🇷", currency: "BRL", currencySymbol: "R$" },
    ]
  },
  {
    continent: "Europa",
    countries: [
      { code: "ES", name: "Espana", dialCode: "+34", flag: "🇪🇸", currency: "EUR", currencySymbol: "€" },
      { code: "FR", name: "Francia", dialCode: "+33", flag: "🇫🇷", currency: "EUR", currencySymbol: "€" },
      { code: "DE", name: "Alemania", dialCode: "+49", flag: "🇩🇪", currency: "EUR", currencySymbol: "€" },
      { code: "IT", name: "Italia", dialCode: "+39", flag: "🇮🇹", currency: "EUR", currencySymbol: "€" },
      { code: "GB", name: "Reino Unido", dialCode: "+44", flag: "🇬🇧", currency: "GBP", currencySymbol: "£" },
      { code: "PT", name: "Portugal", dialCode: "+351", flag: "🇵🇹", currency: "EUR", currencySymbol: "€" },
    ]
  },
]

// Flat list for easy lookup
const allCountries = countryGroups.flatMap(g => g.countries)
const defaultCountry = allCountries.find(c => c.code === "MX")!

interface CountrySelectorProps {
  value: Country
  onChange: (country: Country) => void
}

export function CountrySelector({ value, onChange }: CountrySelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="h-16 px-3 flex items-center gap-1 bg-secondary hover:bg-secondary/80 active:scale-[0.98] border-2 border-border rounded-l-2xl transition-all touch-manipulation sm:h-18 sm:px-4 sm:gap-2"
      >
        <div className="flex flex-col items-center">
          <span className="text-2xl leading-none sm:text-3xl">{value.flag}</span>
          <span className="text-xs font-semibold text-muted-foreground mt-0.5">{value.dialCode}</span>
        </div>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 max-h-80 overflow-y-auto bg-card border-2 border-border rounded-2xl shadow-xl z-50 sm:w-80">
          {countryGroups.map((group) => (
            <div key={group.continent}>
              <div className="sticky top-0 px-4 py-2 bg-secondary/80 backdrop-blur-sm border-b border-border">
                <span className="text-xs font-bold text-primary uppercase tracking-wide sm:text-sm">
                  {group.continent}
                </span>
              </div>
              {group.countries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => {
                    onChange(country)
                    setIsOpen(false)
                  }}
                  className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-secondary/50 active:bg-secondary transition-colors touch-manipulation sm:py-4 ${
                    value.code === country.code ? "bg-primary/10" : ""
                  }`}
                >
                  <span className="text-2xl sm:text-3xl">{country.flag}</span>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium text-foreground sm:text-base">{country.name}</span>
                    <span className="text-xs text-muted-foreground">{country.dialCode}</span>
                  </div>
                  {value.code === country.code && (
                    <span className="ml-auto text-primary text-lg">✓</span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export { defaultCountry, allCountries }
export type { Country }
