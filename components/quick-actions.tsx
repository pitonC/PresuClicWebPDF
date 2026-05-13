"use client"

import { Wrench, Droplets, Flame, HardHat } from "lucide-react"

interface QuickAction {
  icon: React.ReactNode
  label: string
  template: string
}

interface QuickActionsProps {
  onSelect: (template: string) => void
}

export function QuickActions({ onSelect }: QuickActionsProps) {
  const actions: QuickAction[] = [
    {
      icon: <Wrench className="h-7 w-7 sm:h-8 sm:w-8" />,
      label: "Herrería",
      template: "Trabajo de herrería: ",
    },
    {
      icon: <Droplets className="h-7 w-7 sm:h-8 sm:w-8" />,
      label: "Plomería",
      template: "Trabajo de plomería: ",
    },
    {
      icon: <HardHat className="h-7 w-7 sm:h-8 sm:w-8" />,
      label: "Carpintería",
      template: "Trabajo de carpintería: ",
    },
    {
      icon: <Flame className="h-7 w-7 sm:h-8 sm:w-8" />,
      label: "Soldadura",
      template: "Trabajo de soldadura: ",
    },
  ]

  return (
    <div className="px-3 py-3 sm:px-4 sm:py-4">
      <p className="text-sm font-medium text-muted-foreground mb-2 sm:mb-3">Inicio rápido:</p>
      {/* Grid en móvil para mejor uso del espacio */}
      <div className="grid grid-cols-4 gap-2 sm:flex sm:gap-3 sm:overflow-x-auto sm:-mx-4 sm:px-4 scrollbar-hide">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={() => onSelect(action.template)}
            className="flex flex-col items-center justify-center gap-1 p-3 aspect-square bg-card border-2 border-border hover:border-primary active:scale-95 rounded-2xl transition-all touch-manipulation sm:min-w-[90px] sm:p-4 sm:aspect-auto sm:gap-2"
          >
            <div className="text-primary">{action.icon}</div>
            <span className="text-xs font-medium text-foreground text-center leading-tight sm:text-sm sm:whitespace-nowrap">
              {action.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
