# 🚀 Inicio Rápido - Keni Web

## ⚡ Configuración en 5 minutos con Supabase

> 📖 **¿Primera vez con Supabase?** Lee la [Guía Completa de Supabase](SUPABASE_SETUP.md) con screenshots y explicaciones detalladas.

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar base de datos con Supabase (Gratis)

1. **Crear proyecto en Supabase**
   - Ve a [https://supabase.com](https://supabase.com)
   - Sign up con GitHub (gratis)
   - Clic en "New Project"
   - Nombre: `keni-web` (o el que prefieras)
   - Contraseña de base de datos: **guárdala bien** ⚠️
   - Región: elige la más cercana a ti
   - Plan: Free (suficiente para empezar)
   - Espera 2-3 minutos mientras se aprovisiona

2. **Obtener connection string**
   - En tu proyecto, ve a **Settings** (⚙️) > **Database**
   - Busca la sección **Connection string**
   - Selecciona **Transaction** mode (importante!)
   - Copia el string completo
   - Reemplaza `[YOUR-PASSWORD]` con tu contraseña

3. **Configurar .env**
```bash
# Windows
copy .env.example .env

# Linux/Mac
cp .env.example .env
```

4. **Pegar en .env**
```env
DATABASE_URL=postgresql://postgres.xxxxx:[TU-CONTRASEÑA]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

> 💡 **Tip**: Guarda también las API keys de Supabase (Settings > API) para usar funciones adicionales como autenticación y storage más adelante.

### 3. Inicializar base de datos
```bash
# Crear las tablas
npm run db:push

# Poblar con datos de ejemplo
npm run db:seed
```

### 4. Iniciar servidor
```bash
npm run dev
```

🎉 ¡Listo! Abre [http://localhost:5000](http://localhost:5000)

---

## 🚀 Resumen Completo (Copy & Paste)

Si prefieres ver todos los pasos juntos:

```bash
# 1. Instalar
npm install

# 2. Configurar .env
copy .env.example .env
# Edita .env y agrega tu DATABASE_URL de Supabase

# 3. Crear tablas y poblar
npm run db:push
npm run db:seed

# 4. Iniciar
npm run dev
```

---

## Usuarios de Ejemplo

Después de ejecutar `npm run db:seed`, puedes usar:

- **Admin**: `juan.perez` / `password123`
- **Usuario**: `maria.gonzalez` / `password123`

---

## Comandos Útiles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo

# Base de datos
npm run db:push          # Sincronizar esquema
npm run db:seed          # Poblar datos
npm run db:studio        # Abrir interfaz visual

# Producción
npm run build            # Construir para producción
npm start                # Iniciar en producción
```

---

## Solución de Problemas

### Error: "DATABASE_URL must be set"
- Verifica que el archivo `.env` existe
- Asegúrate de que `DATABASE_URL` está definido
- Reinicia el servidor después de cambiar `.env`

### Error de conexión a la base de datos
- Verifica que el connection string es correcto
- Asegúrate de que la base de datos está activa
- Verifica que tienes acceso a internet (si usas Neon)

### Puerto 5000 en uso
Cambia el puerto en `server/index.ts` o usando variable de entorno:
```bash
PORT=3000 npm run dev
```

---

## Próximos Pasos

1. ✅ Explora el dashboard en [http://localhost:5000](http://localhost:5000)
2. 📝 Revisa la documentación completa en [README.md](README.md)
3. 🔧 Personaliza los datos en `server/seed.ts`
4. 🎨 Modifica componentes en `client/src/components/`
5. 🚀 Despliega en Replit, Vercel, o Railway

---

## Estructura Rápida

```
📁 Keni_Web/
├── 📁 client/          # Frontend React
│   └── 📁 src/
│       ├── 📁 components/  # Componentes UI
│       ├── 📁 pages/       # Páginas de la app
│       └── 📁 hooks/       # Custom hooks
├── 📁 server/          # Backend Node.js
│   ├── 📄 index.ts     # Servidor Express
│   ├── 📄 routes.ts    # Rutas API
│   ├── 📄 storage.ts   # Lógica de datos
│   ├── 📄 db.ts        # Conexión DB
│   └── 📄 seed.ts      # Datos iniciales
├── 📁 shared/
│   └── 📄 schema.ts    # Esquemas Drizzle
└── 📄 .env             # Variables de entorno
```

---

## Recursos

- 📖 [Documentación completa](README.md)
- 🗄️ [Supabase Docs](https://supabase.com/docs)
- 🎓 [Drizzle ORM Docs](https://orm.drizzle.team/)
- 🎨 [Shadcn/UI](https://ui.shadcn.com/)

## 🎁 Bonus: Funciones Extra de Supabase

Supabase incluye servicios adicionales que puedes usar:

- 🔐 **Auth**: Sistema de autenticación completo
- 📦 **Storage**: Almacenamiento de archivos
- ⚡ **Realtime**: Actualizaciones en tiempo real
- 🔍 **Database**: PostgreSQL completo con interfaz visual
- 📊 **Dashboard**: Panel de administración integrado

Accede a todas estas funciones desde tu proyecto en [https://supabase.com/dashboard](https://supabase.com/dashboard)

---

¿Necesitas ayuda? Abre un issue en el repositorio.
