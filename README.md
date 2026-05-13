# PresuClic
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
