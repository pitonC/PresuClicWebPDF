import Link from 'next/link'
import Image from 'next/image'

export default function SignUpSuccessPage() {
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
        <div className="bg-card border-2 border-border rounded-2xl p-6 sm:p-8">
          <div className="h-16 w-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className="text-xl font-bold text-foreground mb-2">Revisa tu correo</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Te enviamos un enlace de confirmacion a tu correo electronico. 
            Haz clic en el enlace para activar tu cuenta.
          </p>

          <Link 
            href="/auth/login"
            className="inline-flex items-center justify-center w-full h-14 bg-primary hover:bg-primary/90 active:scale-[0.98] rounded-xl text-primary-foreground font-bold transition-all touch-manipulation"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
