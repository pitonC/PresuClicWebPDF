# PresuClic

Proyecto "PresuClic" — interfaz móvil para generar presupuestos y enviarlos por WhatsApp.

Instrucciones rápidas:

1. Copia tus variables de entorno en `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://<tu-proyecto>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<tu_anon_key>
NEXT_PUBLIC_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
```

2. Instala dependencias:

```bash
pnpm install
```

3. Ejecuta en modo desarrollo:

```bash
pnpm dev
```

4. Abre `http://localhost:3000` y prueba el login con Google.

Subir a GitHub:

- He inicializado el repo localmente y añadido `origin` remoto. Para subir los commits al repositorio remoto ejecuta (desde este directorio):

```bash
# autentícate si hace falta (gh auth login) o configura tu git credential helper
git push -u origin main
```

Si prefieres que yo intente hacer el `push` desde aquí, necesito que inicies sesión en GitHub en este entorno (no compartas tokens por chat); lo normal es que lo hagas localmente y ejecutes el `push`.

## Decisiones Arquitectónicas

Este proyecto fue construido con decisiones técnicas específicas para garantizar robustez, seguridad y rendimiento:

### Generación de PDFs con jsPDF (Sin HTML Rendering)

Se eligió **jsPDF con drawing directo** en lugar de html2canvas porque:
- **html2canvas** no soporta funciones CSS modernas como `lab()` y `oklch()` que usamos en el tema
- Dibujar directamente con jsPDF es más predecible y controla mejor la salida
- Se eliminan dependencias de renderizado que pueden fallar con CSS complejo
- El resultado es un PDF más ligero y consistente

### Mapeo snake_case ↔ camelCase en Supabase

La base de datos usa **snake_case** (estándar SQL) pero el frontend usa **camelCase** (estándar JavaScript).
- La conversión ocurre en `lib/supabase/quote-records.ts` en ambas direcciones
- Previene errores de `NaN` o `undefined` causados por names mismatch
- Mantiene convenciones idiomáticas en cada capa

### Contexto Global para Tema y Tipografía

Se usa **React Context + localStorage** para persistencia de preferencias:
- El SettingsProvider aplica cambios al DOM en tiempo real usando CSS custom properties
- Los cambios son persistentes (localStorage) y no requieren backend
- Se fuerza un reflow (offsetHeight) después de cambios DOM para garantizar aplicación inmediata

### Autenticación RLS en Supabase

Todas las tablas y buckets usan **Row-Level Security** para aislamiento por usuario:
- Solo usuarios autenticados pueden acceder a sus propios registros
- Storage RLS asegura que solo el propietario pueda subir PDFs
- Las políticas están documentadas en las secciones de SQL abajo

## Registros de envíos

Para guardar y leer los últimos 10 envíos desde Supabase, crea la tabla `quote_records` con RLS activado. Puedes pegar este SQL en el editor SQL de Supabase:

```sql
create extension if not exists pgcrypto;

create table if not exists public.quote_records (
	id uuid primary key default gen_random_uuid(),
	user_id uuid not null references auth.users(id) on delete cascade,
	client_name text not null default '',
	client_phone text not null default '',
	country_code text not null default '',
	currency_symbol text not null default '$',
	concept text not null default '',
	work_amount integer not null default 0,
	materials_amount integer not null default 0,
	deposit_amount integer not null default 0,
	total_amount integer not null default 0,
	balance_amount integer not null default 0,
	copy_to_self boolean not null default false,
	whatsapp_url text not null default '',
	pdf_url text,
	created_at timestamptz not null default now()
);

alter table public.quote_records enable row level security;

drop policy if exists "Users can read their own records" on public.quote_records;
create policy "Users can read their own records"
on public.quote_records
for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert their own records" on public.quote_records;
create policy "Users can insert their own records"
on public.quote_records
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own records" on public.quote_records;
create policy "Users can delete their own records"
on public.quote_records
for delete
using (auth.uid() = user_id);
```

## Crear Storage Bucket para PDFs

En Supabase, crea un bucket llamado `quote-pdfs` con acceso público:

1. Ve a **Storage** en el panel de Supabase
2. Haz clic en **Create a new bucket**
3. Nombre: `quote-pdfs`
4. Selecciona **Public** (para que los clientes descarguen los PDFs)
5. Crea el bucket

También, configura una política de acceso en el bucket (Storage > quote-pdfs > Policies):
Pega estas policies en el SQL Editor de Supabase:

```sql
drop policy if exists "Allow authenticated uploads to quote-pdfs" on storage.objects;
create policy "Allow authenticated uploads to quote-pdfs"
on storage.objects
for insert
to authenticated
with check (
	bucket_id = 'quote-pdfs' and auth.uid() = owner
);

drop policy if exists "Allow public read access to quote-pdfs" on storage.objects;
create policy "Allow public read access to quote-pdfs"
on storage.objects
for select
using (bucket_id = 'quote-pdfs');
```
