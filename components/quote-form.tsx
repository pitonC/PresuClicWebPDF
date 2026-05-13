"use client"

import { useState, useCallback, useEffect } from "react"
import { Wrench, Package, Banknote, FileText, Send, Plus, Minus, User, Phone } from "lucide-react"
import { CountrySelector, defaultCountry, type Country } from "./country-selector"

interface QuoteData {
  nombreCliente: string
  codigoPais: string
  simboloMoneda: string
  telefonoCliente: string
  enviarCopiaPersonal: boolean
  concepto: string
  manoObra: number
  materiales: number
  anticipo: number
}

interface QuoteFormProps {
  onSubmit: (data: QuoteData) => void
  isLoading: boolean
  initialConcepto?: string
}

export function QuoteForm({ onSubmit, isLoading, initialConcepto = "" }: QuoteFormProps) {
  const [nombreCliente, setNombreCliente] = useState("")
  const [selectedCountry, setSelectedCountry] = useState<Country>(defaultCountry)
  const [telefonoCliente, setTelefonoCliente] = useState("")
  const [enviarCopiaPersonal, setEnviarCopiaPersonal] = useState(false)
  const [concepto, setConcepto] = useState(initialConcepto)
  const [manoObra, setManoObra] = useState(0)
  const [materiales, setMateriales] = useState(0)
  const [anticipo, setAnticipo] = useState(0)
  
  useEffect(() => {
    if (initialConcepto) {
      setConcepto(initialConcepto)
    }
  }, [initialConcepto])

  const total = manoObra + materiales
  const saldo = total - anticipo

  const incrementValue = useCallback((setter: React.Dispatch<React.SetStateAction<number>>) => {
    setter(prev => prev + 500)
  }, [])

  const decrementValue = useCallback((setter: React.Dispatch<React.SetStateAction<number>>) => {
    setter(prev => Math.max(0, prev - 500))
  }, [])

  const handleSubmit = () => {
    if (!concepto.trim()) return
    onSubmit({ 
      nombreCliente, 
      codigoPais: selectedCountry.dialCode.replace("+", ""),
      simboloMoneda: selectedCountry.currencySymbol,
      telefonoCliente,
      enviarCopiaPersonal,
      concepto, 
      manoObra, 
      materiales, 
      anticipo 
    })
  }

  // Format phone number as user types (only digits, max 15)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 15)
    setTelefonoCliente(value)
  }

  // Format number with commas (e.g., 1,000 or 10,000)
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('es-MX').format(value)
  }

  // Get currency symbol from selected country
  const currencySymbol = selectedCountry?.currencySymbol || "$"

  // Format currency with country's symbol
  const formatCurrency = (value: number) => {
    return `${currencySymbol}${formatNumber(value)}`
  }

  

  return (
    <div className="flex flex-col gap-4 px-3 pb-36 sm:px-4 sm:gap-5">
      {/* Datos del Cliente */}
      <div className="w-full bg-card border-2 border-border rounded-2xl p-4 sm:p-5">
        <h3 className="flex items-center gap-2 text-base font-bold text-foreground mb-4 sm:text-lg sm:gap-3">
          <User className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
          Datos del Cliente
        </h3>
        
        <div className="flex flex-col gap-4">
          {/* Nombre del Cliente */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-muted-foreground sm:text-base">
              Nombre del Cliente
            </label>
            <input
              type="text"
              value={nombreCliente}
              onChange={(e) => setNombreCliente(e.target.value)}
              placeholder="Ej: Juan Perez"
              className="w-full h-16 px-4 text-base bg-input border-2 border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all sm:h-18 sm:text-lg sm:px-5"
            />
          </div>

          {/* Telefono del Cliente */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-muted-foreground sm:text-base">
              <Phone className="h-4 w-4 sm:h-5 sm:w-5" />
              Telefono WhatsApp
            </label>
            <div className="flex">
              <CountrySelector 
                value={selectedCountry} 
                onChange={setSelectedCountry} 
              />
              <input
                type="tel"
                inputMode="numeric"
                value={telefonoCliente}
                onChange={handlePhoneChange}
                placeholder="Numero de telefono"
                maxLength={15}
                className="flex-1 min-w-0 h-16 px-4 text-base bg-input border-2 border-l-0 border-border rounded-r-2xl text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all sm:h-18 sm:text-lg sm:px-5"
              />
            </div>
            {telefonoCliente.length > 0 && telefonoCliente.length < 10 && (
              <p className="text-xs text-primary sm:text-sm">
                Ingresa al menos 10 digitos
              </p>
            )}
            {telefonoCliente.length >= 10 && (
              <p className="text-xs text-green-500 sm:text-sm">
                Se abrira WhatsApp con {selectedCountry.dialCode} {telefonoCliente}
              </p>
            )}
          </div>

          {/* Toggle para copia personal */}
          <button
            type="button"
            onClick={() => setEnviarCopiaPersonal(!enviarCopiaPersonal)}
            className={`flex items-center gap-3 w-full p-4 rounded-2xl border-2 transition-all touch-manipulation ${
              enviarCopiaPersonal 
                ? 'bg-primary/20 border-primary' 
                : 'bg-input border-border'
            }`}
          >
            <div className={`h-7 w-7 min-w-[28px] rounded-lg border-2 flex items-center justify-center transition-all ${
              enviarCopiaPersonal 
                ? 'bg-primary border-primary' 
                : 'bg-transparent border-muted-foreground'
            }`}>
              {enviarCopiaPersonal && (
                <svg className="h-4 w-4 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <div className="flex-1 text-left">
              <p className={`text-sm font-semibold sm:text-base ${enviarCopiaPersonal ? 'text-primary' : 'text-foreground'}`}>
                Guardar copia en mi WhatsApp
              </p>
              <p className="text-xs text-muted-foreground sm:text-sm">
                Recibe el presupuesto en tu propio telefono
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Concepto del trabajo */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-base font-bold text-foreground sm:text-lg sm:gap-3">
          <FileText className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
          ¿Qué trabajo vas a hacer?
        </label>
        <textarea
          value={concepto}
          onChange={(e) => setConcepto(e.target.value)}
          placeholder="Ej: Instalación de puerta de herrería..."
          className="w-full min-h-[120px] p-4 text-base bg-card border-2 border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none sm:text-lg sm:p-5"
        />
      </div>

      {/* Campos de costos - Apilados verticalmente */}
      <div className="flex flex-col gap-4">
        {/* Mano de Obra */}
        <div className="w-full bg-card border-2 border-border rounded-2xl p-4 sm:p-5">
          <label className="flex items-center gap-2 text-base font-bold text-foreground mb-3 sm:text-lg sm:gap-3 sm:mb-4">
            <Wrench className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
            Mano de Obra
          </label>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => decrementValue(setManoObra)}
              className="h-16 w-16 min-w-[64px] flex items-center justify-center bg-secondary hover:bg-secondary/80 active:scale-95 rounded-2xl transition-all touch-manipulation sm:h-18 sm:w-18"
              aria-label="Disminuir mano de obra"
            >
              <Minus className="h-8 w-8 text-foreground" />
            </button>
            <div className="flex-1 min-w-0 h-16 flex items-center bg-input border-2 border-border rounded-2xl focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30 transition-all sm:h-18">
              <span className="pl-3 text-lg font-bold text-primary sm:pl-4 sm:text-xl">{currencySymbol}</span>
              <input
                type="text"
                inputMode="numeric"
                value={manoObra ? formatNumber(manoObra) : ""}
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/\D/g, '')
                  setManoObra(Number(numericValue) || 0)
                }}
                placeholder="0"
                className="flex-1 h-full text-center text-xl font-bold bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none sm:text-2xl"
              />
            </div>
            <button
              type="button"
              onClick={() => incrementValue(setManoObra)}
              className="h-16 w-16 min-w-[64px] flex items-center justify-center bg-primary hover:bg-primary/90 active:scale-95 rounded-2xl transition-all touch-manipulation sm:h-18 sm:w-18"
              aria-label="Aumentar mano de obra"
            >
              <Plus className="h-8 w-8 text-primary-foreground" />
            </button>
          </div>
          <p className="text-center text-muted-foreground mt-2 text-xs sm:text-sm">Toca +/- para sumar o restar {currencySymbol}500</p>
        </div>

        {/* Materiales */}
        <div className="w-full bg-card border-2 border-border rounded-2xl p-4 sm:p-5">
          <label className="flex items-center gap-2 text-base font-bold text-foreground mb-3 sm:text-lg sm:gap-3 sm:mb-4">
            <Package className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
            Materiales
          </label>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => decrementValue(setMateriales)}
              className="h-16 w-16 min-w-[64px] flex items-center justify-center bg-secondary hover:bg-secondary/80 active:scale-95 rounded-2xl transition-all touch-manipulation sm:h-18 sm:w-18"
              aria-label="Disminuir materiales"
            >
              <Minus className="h-8 w-8 text-foreground" />
            </button>
            <div className="flex-1 min-w-0 h-16 flex items-center bg-input border-2 border-border rounded-2xl focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30 transition-all sm:h-18">
              <span className="pl-3 text-lg font-bold text-primary sm:pl-4 sm:text-xl">{currencySymbol}</span>
              <input
                type="text"
                inputMode="numeric"
                value={materiales ? formatNumber(materiales) : ""}
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/\D/g, '')
                  setMateriales(Number(numericValue) || 0)
                }}
                placeholder="0"
                className="flex-1 h-full text-center text-xl font-bold bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none sm:text-2xl"
              />
            </div>
            <button
              type="button"
              onClick={() => incrementValue(setMateriales)}
              className="h-16 w-16 min-w-[64px] flex items-center justify-center bg-primary hover:bg-primary/90 active:scale-95 rounded-2xl transition-all touch-manipulation sm:h-18 sm:w-18"
              aria-label="Aumentar materiales"
            >
              <Plus className="h-8 w-8 text-primary-foreground" />
            </button>
          </div>
          <p className="text-center text-muted-foreground mt-2 text-xs sm:text-sm">Toca +/- para sumar o restar {currencySymbol}500</p>
        </div>

        {/* Anticipo */}
        <div className="w-full bg-card border-2 border-border rounded-2xl p-4 sm:p-5">
          <label className="flex items-center gap-2 text-base font-bold text-foreground mb-3 sm:text-lg sm:gap-3 sm:mb-4">
            <Banknote className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
            Anticipo
          </label>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => decrementValue(setAnticipo)}
              className="h-16 w-16 min-w-[64px] flex items-center justify-center bg-secondary hover:bg-secondary/80 active:scale-95 rounded-2xl transition-all touch-manipulation sm:h-18 sm:w-18"
              aria-label="Disminuir anticipo"
            >
              <Minus className="h-8 w-8 text-foreground" />
            </button>
            <div className="flex-1 min-w-0 h-16 flex items-center bg-input border-2 border-border rounded-2xl focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30 transition-all sm:h-18">
              <span className="pl-3 text-lg font-bold text-primary sm:pl-4 sm:text-xl">{currencySymbol}</span>
              <input
                type="text"
                inputMode="numeric"
                value={anticipo ? formatNumber(anticipo) : ""}
                onChange={(e) => {
                  const numericValue = e.target.value.replace(/\D/g, '')
                  setAnticipo(Number(numericValue) || 0)
                }}
                placeholder="0"
                className="flex-1 h-full text-center text-xl font-bold bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none sm:text-2xl"
              />
            </div>
            <button
              type="button"
              onClick={() => incrementValue(setAnticipo)}
              className="h-16 w-16 min-w-[64px] flex items-center justify-center bg-primary hover:bg-primary/90 active:scale-95 rounded-2xl transition-all touch-manipulation sm:h-18 sm:w-18"
              aria-label="Aumentar anticipo"
            >
              <Plus className="h-8 w-8 text-primary-foreground" />
            </button>
          </div>
          <p className="text-center text-muted-foreground mt-2 text-xs sm:text-sm">Toca +/- para sumar o restar {currencySymbol}500</p>
        </div>
      </div>

      {/* Resumen */}
      <div className="w-full bg-primary/10 border-2 border-primary rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col gap-2 sm:gap-3">
          <div className="flex justify-between items-center">
            <span className="text-base text-muted-foreground sm:text-lg">Total:</span>
            <span className="text-xl font-bold text-foreground sm:text-2xl">{formatCurrency(total)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-base text-muted-foreground sm:text-lg">Anticipo:</span>
            <span className="text-lg text-foreground sm:text-xl">- {formatCurrency(anticipo)}</span>
          </div>
          <div className="h-px bg-border" />
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-primary sm:text-xl">Saldo:</span>
            <span className="text-2xl font-bold text-primary sm:text-3xl">{formatCurrency(saldo)}</span>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-background via-background to-transparent pt-8 sm:p-4 z-50">
        {!concepto.trim() && (
          <p className="text-center text-sm text-muted-foreground mb-2 sm:text-base">
            Describe el trabajo para continuar
          </p>
        )}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!concepto.trim() || isLoading}
          className="w-full h-20 flex items-center justify-center gap-3 bg-primary hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 rounded-2xl text-primary-foreground font-bold text-base shadow-lg shadow-primary/30 transition-all touch-manipulation sm:h-22 sm:text-xl sm:gap-4"
        >
          {isLoading ? (
            <div className="h-7 w-7 border-4 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin sm:h-8 sm:w-8" />
          ) : (
            <>
              <Send className="h-6 w-6 sm:h-7 sm:w-7" />
              <span className="text-center leading-tight">
                Generar PDF y Enviar<br className="sm:hidden" /> por WhatsApp
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
