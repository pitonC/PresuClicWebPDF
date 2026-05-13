'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function ErrorContent() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message')

  return (
    <div className="bg-card border-2 border-border rounded-2xl p-6 sm:p-8">
      <div className="h-16 w-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      
      <h2 className="text-xl font-bold text-foreground mb-2">Error de autenticacion</h2>
      <p className="text-sm text-muted-foreground mb-4">
        {message || 'Ocurrio un problema al iniciar sesion. Por favor intenta de nuevo.'}
      </p>

      <Link 
        href="/auth/login"
        className="inline-flex items-center justify-center w-full h-14 bg-primary hover:bg-primary/90 active:scale-[0.98] rounded-xl text-primary-foreground font-bold transition-all touch-manipulation"
      >
        Intentar de nuevo
      </Link>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Image 
            src="/images/presuclic-logo.png" 
            alt="PresuClic Logo" 
            width={80} 
            height={80}
            className="rounded-full mb-4"
          />
        </div>

        {/* Card */}
        <Suspense fallback={<div className="bg-card border-2 border-border rounded-2xl p-6 sm:p-8 animate-pulse h-48" />}>
          <ErrorContent />
        </Suspense>
      </div>
    </div>
  )
}
