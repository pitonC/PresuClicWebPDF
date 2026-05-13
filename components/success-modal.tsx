"use client"

import { CheckCircle, X, MessageCircle, FileText } from "lucide-react"

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  onNewQuote: () => void
}

export function SuccessModal({ isOpen, onClose, onNewQuote }: SuccessModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-background/80 backdrop-blur-sm">
      <div className="relative w-full max-w-sm bg-card border-2 border-border rounded-3xl p-5 sm:p-6 shadow-2xl animate-in slide-in-from-bottom-4 sm:zoom-in-95 fade-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 h-11 w-11 flex items-center justify-center bg-secondary hover:bg-secondary/80 active:scale-95 rounded-xl transition-all touch-manipulation"
          aria-label="Cerrar"
        >
          <X className="h-6 w-6 text-foreground" />
        </button>
        
        <div className="flex flex-col items-center text-center pt-2">
          <div className="h-16 w-16 sm:h-20 sm:w-20 flex items-center justify-center bg-primary/20 rounded-full mb-3 sm:mb-4">
            <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-primary" />
          </div>
          
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-1 sm:mb-2">
            ¡Listo!
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-5 sm:mb-6">
            Tu presupuesto ha sido generado exitosamente
          </p>

          <div className="flex flex-col gap-3 w-full">
            <a
              href="#"
              className="h-16 sm:h-18 flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#25D366]/90 active:scale-[0.98] rounded-2xl text-white font-bold text-base sm:text-lg transition-all touch-manipulation"
            >
              <MessageCircle className="h-6 w-6 sm:h-7 sm:w-7" />
              Abrir WhatsApp
            </a>
            
            <button
              onClick={onNewQuote}
              className="h-14 sm:h-16 flex items-center justify-center gap-3 bg-secondary hover:bg-secondary/80 active:scale-[0.98] rounded-2xl text-foreground font-medium text-base sm:text-lg transition-all touch-manipulation"
            >
              <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
              Nuevo Presupuesto
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
