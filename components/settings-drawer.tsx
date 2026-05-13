'use client'

import { Moon, Sun, Type, Settings as SettingsIcon } from 'lucide-react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useSettings, type Theme, type FontSize, type FontFamily } from '@/lib/settings-context'

interface SettingsDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SettingsDrawer({ open, onOpenChange }: SettingsDrawerProps) {
  const { theme, fontSize, fontFamily, setTheme, setFontSize, setFontFamily } = useSettings()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md border-border bg-background/98 backdrop-blur-sm">
        <SheetHeader className="border-b border-border bg-card/60 px-5 py-5 pr-12">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <SettingsIcon className="h-5 w-5" />
            </div>
            <div>
              <SheetTitle className="text-xl font-bold text-foreground">Configuración</SheetTitle>
              <SheetDescription className="text-sm text-muted-foreground">
                Personaliza tu experiencia
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {/* Tema Oscuro/Claro */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold text-foreground mb-3">
              <Moon className="h-4 w-4 text-primary" />
              Tema
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setTheme('dark')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  theme === 'dark'
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-card hover:bg-card/80'
                }`}
              >
                <Moon className="h-5 w-5 mx-auto mb-2 text-primary" />
                <p className="text-xs font-semibold text-foreground">Oscuro</p>
              </button>
              <button
                onClick={() => setTheme('light')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  theme === 'light'
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-card hover:bg-card/80'
                }`}
              >
                <Sun className="h-5 w-5 mx-auto mb-2 text-yellow-500" />
                <p className="text-xs font-semibold text-foreground">Claro</p>
              </button>
            </div>
          </div>

          {/* Tamaño de Letra */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold text-foreground mb-3">
              <Type className="h-4 w-4 text-primary" />
              Tamaño de Letra
            </h3>
            <div className="space-y-2">
              {[
                { value: 'small' as FontSize, label: 'Pequeño', preview: 'text-sm' },
                { value: 'normal' as FontSize, label: 'Normal', preview: 'text-base' },
                { value: 'large' as FontSize, label: 'Grande', preview: 'text-lg' },
              ].map(({ value, label, preview }) => (
                <button
                  key={value}
                  onClick={() => setFontSize(value)}
                  className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                    fontSize === value
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-card hover:bg-card/80'
                  }`}
                >
                  <p className={`font-semibold text-foreground ${preview}`}>{label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Tipo de Letra */}
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold text-foreground mb-3">
              <Type className="h-4 w-4 text-primary" />
              Tipo de Letra
            </h3>
            <div className="space-y-2">
              {[
                { value: 'inter' as FontFamily, label: 'Moderno (Inter)', family: 'font-sans' },
                { value: 'system' as FontFamily, label: 'Sistema', family: 'font-sans' },
                { value: 'georgia' as FontFamily, label: 'Clásico (Georgia)', family: 'font-serif' },
              ].map(({ value, label, family }) => (
                <button
                  key={value}
                  onClick={() => setFontFamily(value)}
                  className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                    fontFamily === value
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-card hover:bg-card/80'
                  }`}
                >
                  <p className={`font-semibold text-foreground ${family}`}>{label}</p>
                  {value === 'georgia' && <p className="text-xs text-muted-foreground font-serif">Lorem ipsum dolor</p>}
                  {value !== 'georgia' && <p className="text-xs text-muted-foreground">Lorem ipsum dolor</p>}
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 mt-6">
            <p className="text-xs text-muted-foreground">
              Tus preferencias se guardan automáticamente. Los cambios se aplican inmediatamente.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
