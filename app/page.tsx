"use client"

import { useState, useCallback } from "react"
import { Header } from "@/components/header"
import { QuickActions } from "@/components/quick-actions"
import { QuoteForm } from "@/components/quote-form"
import { SuccessModal } from "@/components/success-modal"

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

export default function PresuClicApp() {
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState("")

  const handleTemplateSelect = useCallback((template: string) => {
    setSelectedTemplate(template)
    // Scroll to the form and focus textarea
    setTimeout(() => {
      const textarea = document.querySelector('textarea')
      if (textarea) {
        textarea.focus()
      }
    }, 100)
  }, [])

  const handleSubmit = useCallback(async (data: QuoteData) => {
    setIsLoading(true)
    
    // Simulate PDF generation and WhatsApp preparation
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Format the WhatsApp message
    const total = data.manoObra + data.materiales
    const saldo = total - data.anticipo
    
    const formatCurrency = (value: number) => {
      const formattedNumber = new Intl.NumberFormat('es-MX').format(value)
      return `${data.simboloMoneda}${formattedNumber}`
    }

    const clientName = data.nombreCliente.trim() || "Cliente"
    
    const message = `
*PRESUPUESTO - PresuClic*

*Cotizacion para:* ${clientName}

*Concepto:*
${data.concepto}

*Desglose:*
- Mano de obra: ${formatCurrency(data.manoObra)}
- Materiales: ${formatCurrency(data.materiales)}

*Total: ${formatCurrency(total)}*
- Anticipo: ${formatCurrency(data.anticipo)}
- *Saldo pendiente: ${formatCurrency(saldo)}*

_Gracias por su preferencia_
_Presupuesto generado con PresuClic_
`.trim()

    // Create WhatsApp URL - use client's phone with country code if provided
    const phoneNumber = data.telefonoCliente.length >= 10 
      ? `${data.codigoPais}${data.telefonoCliente}`
      : ""
    
    // URL for client (or general if no phone)
    const whatsappUrlCliente = phoneNumber 
      ? `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`
    
    // URL for personal copy (opens WhatsApp without a specific number so user can send to themselves or saved contacts)
    const whatsappUrlPersonal = `https://wa.me/?text=${encodeURIComponent(message)}`
    
    setIsLoading(false)
    setShowSuccess(true)
    
    // Open WhatsApp for client first
    window.open(whatsappUrlCliente, '_blank')
    
    // If user wants a personal copy, open another WhatsApp window after a short delay
    if (data.enviarCopiaPersonal) {
      setTimeout(() => {
        window.open(whatsappUrlPersonal, '_blank')
      }, 1000)
    }
  }, [])

  const handleNewQuote = useCallback(() => {
    setShowSuccess(false)
    setSelectedTemplate("")
    // Reset form by reloading (simple approach for demo)
    window.location.reload()
  }, [])

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <QuickActions onSelect={handleTemplateSelect} />
      
      <QuoteForm 
        onSubmit={handleSubmit} 
        isLoading={isLoading}
        initialConcepto={selectedTemplate}
      />
      
      <SuccessModal 
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        onNewQuote={handleNewQuote}
      />
    </main>
  )
}
