'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export type Theme = 'dark' | 'light'
export type FontSize = 'small' | 'normal' | 'large'
export type FontFamily = 'inter' | 'system' | 'georgia'

interface SettingsContextType {
  theme: Theme
  fontSize: FontSize
  fontFamily: FontFamily
  setTheme: (theme: Theme) => void
  setFontSize: (size: FontSize) => void
  setFontFamily: (family: FontFamily) => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

const STORAGE_KEYS = {
  THEME: 'presu-clic-theme',
  FONT_SIZE: 'presu-clic-font-size',
  FONT_FAMILY: 'presu-clic-font-family',
}

/**
 * Proveedor de configuración global para tema, tamaño de fuente y familia de fuentes
 * Persiste las preferencias en localStorage y las aplica al DOM en tiempo real
 * Usa CSS custom properties para permitir que cambios reactivos afecten toda la aplicación
 */
export function SettingsProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark')
  const [fontSize, setFontSizeState] = useState<FontSize>('normal')
  const [fontFamily, setFontFamilyState] = useState<FontFamily>('inter')
  const [mounted, setMounted] = useState(false)

  // Carga configuración desde localStorage al montar
  useEffect(() => {
    const savedTheme = (localStorage.getItem(STORAGE_KEYS.THEME) as Theme) || 'dark'
    const savedFontSize = (localStorage.getItem(STORAGE_KEYS.FONT_SIZE) as FontSize) || 'normal'
    const savedFontFamily = (localStorage.getItem(STORAGE_KEYS.FONT_FAMILY) as FontFamily) || 'inter'

    setThemeState(savedTheme)
    setFontSizeState(savedFontSize)
    setFontFamilyState(savedFontFamily)
    setMounted(true)

    // Apply theme to DOM
    applyTheme(savedTheme)
    applyFontSettings(savedFontSize, savedFontFamily)
  }, [])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem(STORAGE_KEYS.THEME, newTheme)
    applyTheme(newTheme)
  }

  const setFontSize = (size: FontSize) => {
    setFontSizeState(size)
    localStorage.setItem(STORAGE_KEYS.FONT_SIZE, size)
    applyFontSettings(size, fontFamily)
  }

  const setFontFamily = (family: FontFamily) => {
    setFontFamilyState(family)
    localStorage.setItem(STORAGE_KEYS.FONT_FAMILY, family)
    applyFontSettings(fontSize, family)
  }

  // Reapply settings when state changes to ensure DOM is updated
  useEffect(() => {
    if (mounted) {
      applyTheme(theme)
      applyFontSettings(fontSize, fontFamily)
    }
  }, [theme, fontSize, fontFamily, mounted])

  return (
    <SettingsContext.Provider
      value={{
        theme,
        fontSize,
        fontFamily,
        setTheme,
        setFontSize,
        setFontFamily,
      }}
    >
      {mounted && children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider')
  }
  return context
}

function applyTheme(theme: Theme) {
  const html = document.documentElement
  if (theme === 'dark') {
    html.classList.add('dark')
  } else {
    html.classList.remove('dark')
  }
  // Force a reflow to apply CSS changes
  void html.offsetHeight
}

function applyFontSettings(fontSize: FontSize, fontFamily: FontFamily) {
  const html = document.documentElement

  // Apply font size scale
  const scaleMap = {
    small: 0.875, // 87.5% (smaller)
    normal: 1,
    large: 1.125, // 112.5% (larger)
  }

  html.style.fontSize = `${scaleMap[fontSize] * 16}px`

  // Apply font family using CSS custom property
  const fontMap = {
    inter: '"Inter", system-ui, -apple-system, sans-serif',
    system: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    georgia: '"Georgia", "Times New Roman", serif',
  }

  // Set CSS custom property for font family
  html.style.setProperty('--font-sans', fontMap[fontFamily])
  
  // Force font application on html and body with !important to override Tailwind classes
  html.style.setProperty('font-family', fontMap[fontFamily], 'important')
  if (document.body) {
    document.body.style.setProperty('font-family', fontMap[fontFamily], 'important')
  }
  
  // Force a reflow to apply font changes
  void html.offsetHeight
}
