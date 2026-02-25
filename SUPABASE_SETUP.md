# 🗄️ Guía Completa de Configuración con Supabase

Esta guía te llevará paso a paso para configurar Supabase como tu base de datos.

## 📋 ¿Por qué Supabase?

Supabase es una alternativa open-source a Firebase que incluye:

- ✅ **PostgreSQL completo** (sin limitaciones)
- ✅ **Plan gratuito generoso** (500 MB DB, 1 GB storage)
- ✅ **Autenticación integrada** (Google, GitHub, email, etc.)
- ✅ **Storage para archivos** (imágenes, documentos, etc.)
- ✅ **Realtime subscriptions** (actualizaciones en vivo)
- ✅ **Dashboard visual** (gestiona tu DB sin SQL)
- ✅ **API auto-generada** (REST y GraphQL)

## 🚀 Paso 1: Crear Cuenta en Supabase

### 1.1 Registrarse
1. Ve a [https://supabase.com](https://supabase.com)
2. Haz clic en **"Start your project"** o **"Sign In"**
3. **Recomendado**: Usa "Continue with GitHub" (más rápido y seguro)
4. Autoriza la aplicación de Supabase

### 1.2 Crear Organización (opcional)
- Si es tu primera vez, te pedirá crear una organización
- Nombre: `Keni Church` (o el que prefieras)
- Plan: **Free** (perfecto para empezar)

## 🏗️ Paso 2: Crear Proyecto

### 2.1 Nuevo Proyecto
1. Haz clic en **"New project"**
2. Completa el formulario:

```
Project name: keni-web-db
Database Password: [Elige una contraseña segura]
⚠️ IMPORTANTE: Guarda esta contraseña, la necesitarás después
Region: South America (sao-paulo) - elige la más cercana
Pricing Plan: Free
```

3. Haz clic en **"Create new project"**
4. Espera 2-3 minutos mientras Supabase aprovisiona tu base de datos

### 2.2 ¿Qué región elegir?

- **South America**: `sao-paulo` (Brasil)
- **North America**: `us-east-1` (Virginia)
- **Europe**: `eu-west-1` (Irlanda)

Elige la más cercana a tus usuarios para menor latencia.

## 🔌 Paso 3: Obtener Connection String

### 3.1 Navegar a la configuración
1. Una vez creado el proyecto, verás el dashboard
2. En el menú lateral izquierdo, haz clic en **⚙️ Settings**
3. Luego en **Database** (bajo Configuration)

### 3.2 Copiar el Connection String
1. Busca la sección **"Connection string"**
2. Verás varias pestañas: **URI**, **Transaction**, **Session**
3. **IMPORTANTE**: Selecciona **Transaction** (no URI ni Session)
4. Verás algo como:
```
postgresql://postgres.abcdefghijk:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```
5. Haz clic en **"Copy"** o selecciona todo el texto

### 3.3 Reemplazar la contraseña
El string copiado tiene `[YOUR-PASSWORD]` - necesitas reemplazarlo:
```
postgresql://postgres.abcdefghijk:TuContraseñaReal123@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

## 📝 Paso 4: Configurar .env en tu Proyecto

### 4.1 Crear archivo .env
```bash
# En Windows (PowerShell o CMD)
copy .env.example .env

# En Linux/Mac (Terminal)
cp .env.example .env
```

### 4.2 Editar .env
Abre el archivo `.env` con tu editor favorito y pega:

```env
DATABASE_URL=postgresql://postgres.abcdefghijk:TuContraseñaReal123@aws-0-us-east-1.pooler.supabase.com:6543/postgres
SESSION_SECRET=cambia-esto-por-un-string-aleatorio-largo
```

### 4.3 (Opcional) Agregar API Keys de Supabase
Si planeas usar Auth o Storage más adelante:

1. En Supabase, ve a **Settings** > **API**
2. Copia:
   - **Project URL**
   - **anon/public key**
   - **service_role key** (mantén esto secreto!)

Agrégalos a `.env`:
```env
SUPABASE_URL=https://abcdefghijk.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🗃️ Paso 5: Crear las Tablas

### 5.1 Sincronizar el esquema
Desde tu terminal, en la carpeta del proyecto:

```bash
npm run db:push
```

Este comando:
- Lee tu esquema de `shared/schema.ts`
- Crea todas las tablas en Supabase
- Configura las relaciones y constraints

**Salida esperada:**
```
✓ Pushing schema to database...
✓ Done!
```

### 5.2 Verificar en Supabase
1. Ve al dashboard de Supabase
2. Haz clic en **Table Editor** (icono de tabla en el menú)
3. Deberías ver todas tus tablas:
   - users
   - products
   - orders
   - categories
   - threads
   - posts
   - jobs
   - etc.

## 📊 Paso 6: Poblar con Datos de Ejemplo

### 6.1 Ejecutar seed
```bash
npm run db:seed
```

Este comando:
- Inserta usuarios de prueba
- Crea productos de ejemplo
- Agrega categorías de foro
- Crea hilos y posts
- Inserta trabajos y perfiles

**Salida esperada:**
```
🌱 Starting database seed...
🗑️  Clearing existing data...
👤 Seeding users...
📦 Seeding products...
📊 Seeding activities...
💼 Seeding professional areas...
💼 Seeding jobs...
👥 Seeding user profiles...
📝 Seeding job applications...
💬 Seeding forum categories...
📝 Seeding forum threads...
💬 Seeding forum posts...
✅ Database seeded successfully!
🎉 Seed completed!
```

### 6.2 Ver los datos en Supabase
1. En el dashboard, ve a **Table Editor**
2. Haz clic en cualquier tabla (ej: `users`)
3. Verás los registros insertados
4. Puedes editar, agregar o eliminar directamente desde aquí

## 🚀 Paso 7: Iniciar tu Aplicación

```bash
npm run dev
```

Tu app estará disponible en: [http://localhost:5000](http://localhost:5000)

## ✅ Verificación

### Credenciales de prueba
Después del seed, puedes iniciar sesión con:

- **Admin**: `juan.perez` / `password123`
- **Usuario**: `maria.gonzalez` / `password123`

### Probar la conexión
1. Abre [http://localhost:5000](http://localhost:5000)
2. El dashboard debería mostrar estadísticas
3. Ve a "Usuarios" - deberías ver los usuarios de prueba
4. Ve a "Foros" - deberías ver categorías y posts

## 🛠️ Comandos Útiles

```bash
# Ver la base de datos visualmente (desde el terminal)
npm run db:studio

# Generar migraciones cuando cambias el esquema
npm run db:generate

# Aplicar migraciones
npm run db:migrate

# Re-poblar la base de datos (limpia y vuelve a insertar)
npm run db:seed
```

## 🔍 Explorar Supabase Dashboard

### Table Editor
- Ver y editar datos directamente
- Agregar/eliminar columnas
- Crear nuevas tablas
- Ejecutar consultas SQL

### SQL Editor
- Ejecutar consultas personalizadas
- Crear vistas
- Agregar triggers
- Definir funciones

### Database
- Ver el esquema completo
- Gestionar roles y políticas
- Configurar replicación
- Ver logs de queries

### Logs
- Ver queries ejecutadas
- Monitorear performance
- Detectar errores
- Ver conexiones activas

## 🎁 Features Bonus de Supabase

### 1. Autenticación
```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

// Login con email/password
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})

// Login con OAuth (Google, GitHub, etc.)
await supabase.auth.signInWithOAuth({
  provider: 'github'
})
```

### 2. Storage (subir archivos)
```typescript
// Subir imagen
const { data, error } = await supabase.storage
  .from('avatars')
  .upload('public/avatar1.png', file)

// Obtener URL pública
const { data } = supabase.storage
  .from('avatars')
  .getPublicUrl('public/avatar1.png')
```

### 3. Realtime (actualizaciones en vivo)
```typescript
// Escuchar cambios en la tabla posts
supabase
  .channel('posts')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'posts' },
    (payload) => {
      console.log('Change received!', payload)
    }
  )
  .subscribe()
```

## 🐛 Solución de Problemas

### Error: "Failed to connect to database"
1. Verifica que copiaste el connection string completo
2. Asegúrate de reemplazar `[YOUR-PASSWORD]` con tu contraseña real
3. Verifica que no hay espacios extra al inicio/final del string
4. Comprueba que seleccionaste modo **Transaction** (no Session)

### Error: "Password authentication failed"
1. La contraseña en el connection string es incorrecta
2. Ve a Supabase > Settings > Database > Reset Database Password
3. Actualiza el connection string con la nueva contraseña

### Error: "Too many connections"
1. El plan gratuito tiene límite de conexiones
2. Asegúrate de cerrar conexiones después de usarlas
3. Usa connection pooling (ya configurado con el string Transaction)

### Las tablas no se crean
1. Verifica que `DATABASE_URL` está en `.env`
2. Reinicia el servidor después de cambiar `.env`
3. Ejecuta `npm run db:push` de nuevo
4. Revisa errores en la terminal

### Los datos del seed no aparecen
1. Verifica que `db:push` se ejecutó correctamente primero
2. Ejecuta `npm run db:seed` de nuevo
3. Revisa la consola para ver errores específicos
4. Verifica en Supabase Table Editor si los datos están ahí

## 📞 Soporte

- **Documentación Supabase**: [https://supabase.com/docs](https://supabase.com/docs)
- **Discord Supabase**: [https://discord.supabase.com](https://discord.supabase.com)
- **Issues del proyecto**: Abre un issue en el repositorio

## 🎯 Próximos Pasos

Ahora que tienes Supabase configurado:

1. ✅ Experimenta con el dashboard de Supabase
2. ✅ Prueba las diferentes secciones de tu app
3. ✅ Implementa autenticación con Supabase Auth
4. ✅ Agrega storage para imágenes de perfil
5. ✅ Configura realtime para actualizaciones en vivo del foro

¡Feliz desarrollo! 🚀
