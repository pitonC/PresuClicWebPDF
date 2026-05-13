// Re-exports API para uso simple como dependencia Git
export { generateQuotePDF } from './lib/pdf-generator'
export { uploadPDFToStorage } from './lib/supabase/pdf-storage'
export { saveQuoteRecord, listRecentQuoteRecords } from './lib/supabase/quote-records'
export { SettingsProvider, useSettings } from './lib/settings-context'

// Nota: Al importar desde otro proyecto usando la dependencia Git,
// asegúrate de tener las variables de entorno necesarias y de ejecutar
// `pnpm install` en el proyecto destino.
