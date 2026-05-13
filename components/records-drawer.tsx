'use client'

import { Clock3, MessageCircle, Phone, ReceiptText, User, Download, FileText } from 'lucide-react'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import type { QuoteRecord } from '@/lib/supabase/quote-records'

interface RecordsDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  records: QuoteRecord[]
  isLoading: boolean
  errorMessage?: string | null
  onDeleteRecord?: (id: string) => Promise<void>
}

function formatCurrency(symbol: string, value: number) {
  return `${symbol}${new Intl.NumberFormat('es-MX').format(value)}`
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

export function RecordsDrawer({ open, onOpenChange, records, isLoading, errorMessage, onDeleteRecord }: RecordsDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md border-border bg-background/98 backdrop-blur-sm">
        <SheetHeader className="border-b border-border bg-card/60 px-5 py-5 pr-12">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <ReceiptText className="h-5 w-5" />
            </div>
            <div>
              <SheetTitle className="text-xl font-bold text-foreground">Registros recientes</SheetTitle>
              <SheetDescription className="text-sm text-muted-foreground">
                Últimos 10 envíos guardados desde WhatsApp.
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="rounded-2xl border-2 border-border bg-card p-4">
                  <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                  <div className="mt-3 h-3 w-1/2 animate-pulse rounded bg-muted" />
                  <div className="mt-4 h-16 animate-pulse rounded-xl bg-muted/70" />
                </div>
              ))}
            </div>
          ) : errorMessage ? (
            <div className="rounded-2xl border-2 border-red-500/30 bg-red-500/10 p-4 text-sm text-red-500">
              {errorMessage}
            </div>
          ) : records.length === 0 ? (
            <div className="rounded-2xl border-2 border-border bg-card p-5 text-center">
              <ReceiptText className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-3 text-sm font-semibold text-foreground">Aún no hay registros guardados</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Cuando envíes un presupuesto, aparecerá aquí automáticamente.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {records.map((record) => (
                <article key={record.id} className="rounded-2xl border-2 border-border bg-card p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="flex items-center gap-2 text-sm font-bold text-foreground">
                        <User className="h-4 w-4 text-primary" />
                        {record.clientName || 'Cliente sin nombre'}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {record.concept || 'Sin concepto especificado'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary mr-2">
                        <Clock3 className="h-3 w-3" />
                        {formatDateTime(record.created_at)}
                      </span>
                      {/** Delete button */}
                      <button
                        onClick={() => onDeleteRecord?.(record.id)}
                        className="h-8 w-8 inline-flex items-center justify-center rounded-lg bg-red-600/10 text-red-500 hover:bg-red-600/20 transition-colors"
                        aria-label="Eliminar registro"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H3.5a.5.5 0 000 1H4v9a2 2 0 002 2h8a2 2 0 002-2V5h.5a.5.5 0 000-1H15V3a1 1 0 00-1-1H6zm3 5a.5.5 0 011 0v7a.5.5 0 01-1 0V7zm3 0a.5.5 0 011 0v7a.5.5 0 01-1 0V7z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs sm:text-sm">
                    <div className="rounded-xl bg-secondary/50 p-2.5">
                      <p className="text-muted-foreground">Total</p>
                      <p className="font-bold text-foreground">{formatCurrency(record.currencySymbol, record.totalAmount)}</p>
                    </div>
                    <div className="rounded-xl bg-secondary/50 p-2.5">
                      <p className="text-muted-foreground">Saldo</p>
                      <p className="font-bold text-foreground">{formatCurrency(record.currencySymbol, record.balanceAmount)}</p>
                    </div>
                    <div className="rounded-xl bg-secondary/50 p-2.5">
                      <p className="text-muted-foreground">Mano de obra</p>
                      <p className="font-bold text-foreground">{formatCurrency(record.currencySymbol, record.workAmount)}</p>
                    </div>
                    <div className="rounded-xl bg-secondary/50 p-2.5">
                      <p className="text-muted-foreground">Materiales</p>
                      <p className="font-bold text-foreground">{formatCurrency(record.currencySymbol, record.materialsAmount)}</p>
                    </div>
                  </div>

                  <div className="mt-3 space-y-2 rounded-xl border border-border/70 bg-background p-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5" />
                      <span>{record.countryCode || 'Sin código'} {record.clientPhone || 'Sin teléfono'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-3.5 w-3.5" />
                      <span className="truncate">{record.whatsappUrl}</span>
                    </div>
                    {record.pdfUrl && (
                      <div className="border-t border-border/50 pt-2">
                        <a
                          href={record.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-primary hover:bg-primary/20 transition-colors"
                        >
                          <FileText className="h-4 w-4" />
                          <span className="text-xs font-semibold">Ver PDF</span>
                          <Download className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}