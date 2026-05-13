"use client"

import { useState, useCallback } from "react"
import { Header } from "@/components/header"
import { QuickActions } from "@/components/quick-actions"
import { QuoteForm } from "@/components/quote-form"
import { SuccessModal } from "@/components/success-modal"
import { RecordsDrawer } from "@/components/records-drawer"
import { SettingsDrawer } from "@/components/settings-drawer"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client"
import { listRecentQuoteRecords, saveQuoteRecord, deleteQuoteRecord, type QuoteRecord } from "@/lib/supabase/quote-records"
import { downloadPDF, generateQuotePDF } from "@/lib/pdf-generator"
import { uploadPDFToStorage } from "@/lib/supabase/pdf-storage"

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
  const [showRecords, setShowRecords] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [records, setRecords] = useState<QuoteRecord[]>([])
  const [recordsLoading, setRecordsLoading] = useState(false)
  const [recordsError, setRecordsError] = useState<string | null>(null)

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

  const refreshRecords = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setRecords([])
      setRecordsError('Configura Supabase para guardar y leer registros.')
      return
    }

    setRecordsLoading(true)
    setRecordsError(null)

    try {
      const { data, error } = await listRecentQuoteRecords(10)
      if (error) throw error
      setRecords(data)
    } catch (error: unknown) {
      setRecords([])
      setRecordsError(error instanceof Error ? error.message : 'No se pudieron cargar los registros')
    } finally {
      setRecordsLoading(false)
    }
  }, [])

  const handleOpenRecords = useCallback(async () => {
    setShowRecords(true)
    await refreshRecords()
  }, [refreshRecords])

  const handleDeleteRecord = useCallback(async (id: string) => {
    try {
      const { error } = await deleteQuoteRecord(id)
      if (error) {
        console.error('Failed to delete record:', error)
        throw error
      }
      await refreshRecords()
    } catch (err) {
      console.error('Failed to delete record:', err)
    }
  }, [refreshRecords])

  const handleSubmit = useCallback(async (data: QuoteData) => {
    setIsLoading(true)
    
    try {
      // Calculate totals
      const total = data.manoObra + data.materiales
      const saldo = total - data.anticipo
      
      const clientName = data.nombreCliente.trim() || "Cliente"
      const safeFileName = clientName.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'presupuesto'

      // Generate PDF
      const pdfBlob = await generateQuotePDF({
        clientName: clientName,
        clientPhone: data.telefonoCliente,
        countrCode: data.codigoPais,
        currencySymbol: data.simboloMoneda,
        concept: data.concepto,
        workAmount: data.manoObra,
        materialsAmount: data.materiales,
        depositAmount: data.anticipo,
        totalAmount: total,
        balanceAmount: saldo,
      })

      const pdfFile = new File([pdfBlob], `${safeFileName}_presupuesto.pdf`, {
        type: 'application/pdf',
      })

      // Get user ID from Supabase if configured
      let pdfUrl = ""
      
      if (isSupabaseConfigured()) {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          // Upload PDF to Supabase Storage
          try {
            pdfUrl = await uploadPDFToStorage(pdfBlob, user.id, clientName)
          } catch (uploadError) {
            console.error('Error uploading PDF:', uploadError)
            // Continue without PDF URL if upload fails
          }
        }
      }

      // Create WhatsApp message with PDF link
      const formatCurrency = (value: number) => {
        const formattedNumber = new Intl.NumberFormat('es-MX').format(value)
        return `${data.simboloMoneda}${formattedNumber}`
      }

      let message = `
*PRESUPUESTO - PresuClic*

*Cotización para:* ${clientName}

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

      // Add PDF link if available
      if (pdfUrl) {
        message += `\n\n📄 *Presupuesto en PDF:*\n${pdfUrl}`
      }

      const phoneDigits = `${data.codigoPais}${data.telefonoCliente}`.replace(/\D/g, '')
      const hasValidPhone = phoneDigits.length >= 10

      // Create WhatsApp URLs
      const whatsappUrlCliente = hasValidPhone
        ? `https://wa.me/${phoneDigits}?text=${encodeURIComponent(message)}`
        : `https://wa.me/?text=${encodeURIComponent(message)}`

      // Save to database if Supabase is configured
      if (isSupabaseConfigured()) {
        try {
          await saveQuoteRecord({
            clientName: clientName,
            clientPhone: data.telefonoCliente,
            countryCode: data.codigoPais,
            currencySymbol: data.simboloMoneda,
            concept: data.concepto,
            workAmount: data.manoObra,
            materialsAmount: data.materiales,
            depositAmount: data.anticipo,
            totalAmount: total,
            balanceAmount: saldo,
            copyToSelf: data.enviarCopiaPersonal,
            whatsappUrl: whatsappUrlCliente,
            pdfUrl: pdfUrl || undefined,
          })
        } catch (saveError) {
          console.error('Error saving quote record:', saveError)
          // Continue even if save fails
        }
      }

      setIsLoading(false)
      setShowSuccess(true)

      // Only download PDF if user checked the checkbox
      if (data.enviarCopiaPersonal) {
        downloadPDF(pdfBlob, `${safeFileName}_presupuesto.pdf`)
      }

      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(message)
        } catch (clipboardError) {
          console.error('No se pudo copiar el mensaje:', clipboardError)
        }
      }

      window.open(whatsappUrlCliente, '_blank')
    } catch (error) {
      console.error('Error in handleSubmit:', error)
      setIsLoading(false)
      // Still show success modal even if there's an error
      setShowSuccess(true)
      
      // Try to open WhatsApp anyway with a fallback message
      const fallbackMessage = `Presupuesto para ${data.nombreCliente}`
      window.open(`https://wa.me/?text=${encodeURIComponent(fallbackMessage)}`, '_blank')
    }
  }, [])

  const handleNewQuote = useCallback(() => {
    setShowSuccess(false)
    setSelectedTemplate("")
    // Reset form by reloading (simple approach for demo)
    window.location.reload()
  }, [])

  const handleOpenSettings = useCallback(() => {
    setShowSettings(true)
  }, [])

  return (
    <main className="min-h-screen bg-background">
      <Header onHistoryClick={handleOpenRecords} onSettingsClick={handleOpenSettings} />
      
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

      <RecordsDrawer
        open={showRecords}
        onOpenChange={setShowRecords}
        records={records}
        isLoading={recordsLoading}
        errorMessage={recordsError}
        onDeleteRecord={handleDeleteRecord}
      />

      <SettingsDrawer
        open={showSettings}
        onOpenChange={setShowSettings}
      />
    </main>
  )
}
