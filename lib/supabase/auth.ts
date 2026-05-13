export function getSupabaseAuthRedirectUrl(pathname = '/auth/callback') {
  const configuredRedirect = process.env.NEXT_PUBLIC_SUPABASE_REDIRECT_URL

  if (configuredRedirect) {
    return configuredRedirect
  }

  if (typeof window !== 'undefined') {
    return `${window.location.origin}${pathname}`
  }

  return pathname
}