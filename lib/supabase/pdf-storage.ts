import { createClient } from '@/lib/supabase/client';

/**
 * Sube un PDF a Supabase Storage y retorna la URL pública
 * El cliente usa credenciales autenticadas para respetar las políticas RLS del bucket
 * El nombre del archivo incluye userID para organizar PDFs por usuario
 * Las políticas de Storage permiten lectura pública pero escritura solo para el propietario
 */
export async function uploadPDFToStorage(
  pdfBlob: Blob,
  userId: string,
  clientName: string
): Promise<string> {
  const supabase = createClient();

  // Generar nombre único para el archivo
  const timestamp = Date.now();
  const sanitizedName = clientName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const filename = `${userId}/${timestamp}_${sanitizedName}.pdf`;

  // Subir el archivo a Storage
  const { data, error } = await supabase.storage
    .from('quote-pdfs')
    .upload(filename, pdfBlob, {
      contentType: 'application/pdf',
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    console.error('Error uploading PDF to Storage:', error);
    throw new Error(`Failed to upload PDF: ${error.message}`);
  }

  // Obtener la URL pública del archivo
  const {
    data: { publicUrl },
  } = supabase.storage.from('quote-pdfs').getPublicUrl(filename);

  return publicUrl;
}
