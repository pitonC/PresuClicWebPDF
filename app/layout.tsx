import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SettingsProvider } from '@/lib/settings-context'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'PresuClic - Presupuestos Rápidos',
  description: 'Genera presupuestos profesionales en segundos y envíalos por WhatsApp',
  icons: {
    icon: '/icon.svg',
  },
}

export const viewport: Viewport = {
  themeColor: '#1a1a2e',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="bg-background">
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground`}>
        <SettingsProvider>
          {children}
        </SettingsProvider>
        <Analytics />
      </body>
    </html>
  )
}
