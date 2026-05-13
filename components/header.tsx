"use client"

import { History, User, LogOut } from "lucide-react"
import { useState, useEffect } from "react"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface HeaderProps {
  onHistoryClick?: () => void
}

export function Header({ onHistoryClick }: HeaderProps) {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [showMenu, setShowMenu] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Skip auth if Supabase is not configured
    if (!isSupabaseConfigured()) {
      setIsLoading(false)
      return
    }
    
    let subscription: { unsubscribe: () => void } | null = null
    
    const initAuth = async () => {
      try {
        const supabase = createClient()
        
        // Get initial session
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        setIsLoading(false)

        // Listen for auth changes
        const { data } = supabase.auth.onAuthStateChange((_event, session) => {
          setUser(session?.user ?? null)
        })
        subscription = data.subscription
      } catch (error) {
        console.log("[v0] Supabase auth error (may be expected if not configured):", error)
        setIsLoading(false)
      }
    }
    
    initAuth()

    return () => {
      if (subscription) {
        subscription.unsubscribe()
      }
    }
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setShowMenu(false)
    router.refresh()
  }

  const handleLogin = () => {
    router.push('/auth/login')
  }

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b-2 border-border">
      <div className="flex items-center justify-between px-3 py-3 sm:px-4 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <img 
            src="/images/presuclic-logo.png" 
            alt="PresuClic Logo" 
            className="h-11 w-11 rounded-full object-cover sm:h-12 sm:w-12"
          />
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight sm:text-2xl">
              Presu<span className="text-primary">Clic</span>
            </h1>
            <p className="text-xs text-muted-foreground sm:text-sm">
              Profesionalizando el oficio, un clic a la vez.
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onHistoryClick}
            className="h-11 w-11 flex items-center justify-center bg-secondary hover:bg-secondary/80 active:scale-95 rounded-xl transition-all touch-manipulation sm:h-12 sm:w-12"
            aria-label="Ver historial"
          >
            <History className="h-5 w-5 text-foreground sm:h-6 sm:w-6" />
          </button>
          
          {/* User menu */}
          <div className="relative">
            {isLoading ? (
              <div className="h-11 w-11 flex items-center justify-center bg-secondary rounded-xl sm:h-12 sm:w-12">
                <div className="h-4 w-4 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" />
              </div>
            ) : user ? (
              <>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="h-11 w-11 flex items-center justify-center bg-primary hover:bg-primary/90 active:scale-95 rounded-xl transition-all touch-manipulation sm:h-12 sm:w-12 overflow-hidden"
                  aria-label="Menu de usuario"
                >
                  {user.user_metadata?.avatar_url ? (
                    <img 
                      src={user.user_metadata.avatar_url} 
                      alt="Avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-5 w-5 text-primary-foreground sm:h-6 sm:w-6" />
                  )}
                </button>
                
                {showMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowMenu(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-card border-2 border-border rounded-xl shadow-lg z-50 overflow-hidden">
                      <div className="p-3 border-b border-border">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {user.user_metadata?.full_name || user.email}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-3 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Cerrar sesion
                      </button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <button
                onClick={handleLogin}
                className="h-11 px-4 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 active:scale-95 rounded-xl text-primary-foreground font-semibold text-sm transition-all touch-manipulation sm:h-12"
              >
                <User className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Iniciar Sesion</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
