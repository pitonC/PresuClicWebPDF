import { createClient } from '@/lib/supabase/client'

/**
 * Interfaz para los datos de entrada al guardar un presupuesto
 * Los valores están en camelCase para mantener consistencia con el frontend
 * Se convierten a snake_case automáticamente en la BD
 */
export interface QuoteRecordInput {
  clientName: string
  clientPhone: string
  countryCode: string
  currencySymbol: string
  concept: string
  workAmount: number
  materialsAmount: number
  depositAmount: number
  totalAmount: number
  balanceAmount: number
  copyToSelf: boolean
  whatsappUrl: string
  pdfUrl?: string
}

export interface QuoteRecord extends QuoteRecordInput {
  id: string
  user_id: string
  created_at: string
}

/**
 * Guarda un presupuesto en la BD de Supabase
 * Mapea automáticamente de camelCase (input) a snake_case (BD)
 * Las políticas RLS aseguran que solo el usuario autenticado pueda crear sus registros
 */
export async function saveQuoteRecord(input: QuoteRecordInput) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: new Error('User not authenticated') }
  }

  const { data, error } = await supabase
    .from('quote_records')
    .insert({
      user_id: user.id,
      client_name: input.clientName,
      client_phone: input.clientPhone,
      country_code: input.countryCode,
      currency_symbol: input.currencySymbol,
      concept: input.concept,
      work_amount: input.workAmount,
      materials_amount: input.materialsAmount,
      deposit_amount: input.depositAmount,
      total_amount: input.totalAmount,
      balance_amount: input.balanceAmount,
      copy_to_self: input.copyToSelf,
      whatsapp_url: input.whatsappUrl,
      pdf_url: input.pdfUrl || null,
    })
    .select('*')
    .single()

  if (error) return { data: null, error }

  // Map snake_case DB row to camelCase QuoteRecord
  const row = data as any
  const mapped: QuoteRecord = {
    id: row.id,
    user_id: row.user_id,
    clientName: row.client_name,
    clientPhone: row.client_phone,
    countryCode: row.country_code,
    currencySymbol: row.currency_symbol,
    concept: row.concept,
    workAmount: row.work_amount,
    materialsAmount: row.materials_amount,
    depositAmount: row.deposit_amount,
    totalAmount: row.total_amount,
    balanceAmount: row.balance_amount,
    copyToSelf: row.copy_to_self,
    whatsappUrl: row.whatsapp_url,
    pdfUrl: row.pdf_url,
    created_at: row.created_at,
/**
 * Obtiene los presupuestos recientes del usuario
 * Retorna los registros ordenados por fecha descendente (más recientes primero)
 * Mapea automáticamente de snake_case (BD) a camelCase (frontend)
 */
  }

  return { data: mapped, error: null }
}

export async function listRecentQuoteRecords(limit = 10) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { data: [] as QuoteRecord[], error: null }
  }

  const { data, error } = await supabase
    .from('quote_records')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) return { data: [] as QuoteRecord[], error }

  const mapped = (data ?? []).map((row: any) => ({
    id: row.id,
    user_id: row.user_id,
    clientName: row.client_name,
    clientPhone: row.client_phone,
    countryCode: row.country_code,
    currencySymbol: row.currency_symbol,
    concept: row.concept,
    workAmount: row.work_amount,
    materialsAmount: row.materials_amount,
    depositAmount: row.deposit_amount,
    totalAmount: row.total_amount,
    balanceAmount: row.balance_amount,
    copyToSelf: row.copy_to_self,
    whatsappUrl: row.whatsapp_url,
    pdfUrl: row.pdf_url,
    created_at: row.created_at,
  })) as QuoteRecord[]

  return { data: mapped, error: null }
}

export async function deleteQuoteRecord(id: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: new Error('User not authenticated') }
  }

  const { data, error } = await supabase
    .from('quote_records')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  return { data, error }
}