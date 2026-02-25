# Panel de Administración Web - Keni Church

Este proyecto es una plataforma web completa que incluye un sistema de gestión de contenido, foros, bolsa de trabajo y más para iglesias.

## � Guías de Inicio

¿Primera vez aquí? Elige tu guía:

- 🚀 **[QUICKSTART.md](QUICKSTART.md)** - Configuración rápida en 5 minutos
- ✅ **[CHECKLIST.md](CHECKLIST.md)** - Lista paso a paso (recomendado para principiantes)
- 🗄️ **[SUPABASE_SETUP.md](SUPABASE_SETUP.md)** - Guía completa de Supabase con detalles

## �🚀 Características Principales

### Sistema de Gestión
- **Dashboard administrativo**: Estadísticas, gráficos y actividad reciente
- **Gestión de Usuarios**: CRUD completo de usuarios con roles
- **Gestión de Pedidos**: Sistema de administración de pedidos
- **Catálogo de Productos**: Productos con categorías y detalles

### Sistema de Foros
- **Categorías y Subforos**: Organización jerárquica de temas
- **Hilos de Discusión**: Creación y participación en conversaciones
- **Posts y Respuestas**: Sistema de comentarios anidados
- **Reacciones**: Like, heart, support, etc.
- **Bookmarks**: Guardar hilos favoritos
- **Suscripciones**: Notificaciones de nuevos posts
- **Mensajes Privados**: Chat entre usuarios
- **Notificaciones**: Sistema de alertas en tiempo real

### Bolsa de Trabajo
- **Áreas Profesionales**: Clasificación por industrias
- **Publicación de Empleos**: Sistema completo de gestión de vacantes
- **Perfiles Profesionales**: CVs de candidatos
- **Aplicaciones**: Sistema de postulación y seguimiento
- **Panel Administrativo**: Gestión de aplicaciones y estadísticas

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** con TypeScript
- **TailwindCSS** para estilos
- **Shadcn/UI** para componentes
- **Recharts** para gráficos
- **React Query** para gestión de estado
- **Wouter** para routing

### Backend
- **Node.js** con Express
- **TypeScript** para type safety
- **Drizzle ORM** para base de datos
- **PostgreSQL** como base de datos
- **Neon Database** (serverless PostgreSQL)

## 📦 Instalación

### Prerrequisitos

- Node.js 18 o superior
- npm o yarn
- Una cuenta en Supabase (gratuita) o cualquier PostgreSQL

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <tu-repositorio>
cd Keni_Web
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar base de datos con Supabase**

📖 **Guía detallada**: Ver [SUPABASE_SETUP.md](SUPABASE_SETUP.md) para instrucciones paso a paso con imágenes.

**Resumen rápido**:
- Ve a [https://supabase.com](https://supabase.com)
- Crea cuenta gratuita con GitHub
- Crea nuevo proyecto
- Copia el connection string (modo **Transaction**)
- Crea archivo `.env`:

```bash
# Windows
copy .env.example .env

# Linux/Mac
cp .env.example .env

# Editar .env y agregar tu DATABASE_URL
```

4. **Configurar connection string en .env**
   - Ve a **Settings** > **Database** > **Connection string**
   - Selecciona **Transaction** mode (no Session)
   - Copia el connection string:
     ```
     postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
     ```
   - Reemplaza `[YOUR-PASSWORD]` con la contraseña que elegiste al crear el proyecto
   - Pégalo en `.env` como `DATABASE_URL`

5. **Crear las tablas en la base de datos**
```bash
npm run db:push
```

6. **Poblar la base de datos con datos de ejemplo**
```bash
npm run db:seed
```

7. **Iniciar el servidor de desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5000`

## 📝 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm start` - Inicia la aplicación en modo producción
- `npm run check` - Verifica tipos de TypeScript
- `npm run db:push` - Sincroniza el esquema con la base de datos
- `npm run db:generate` - Genera migraciones
- `npm run db:migrate` - Ejecuta migraciones pendientes
- `npm run db:studio` - Abre Drizzle Studio (interfaz visual para DB)
- `npm run db:seed` - Puebla la base de datos con datos de ejemplo

## 🗄️ Estructura de la Base de Datos

### Tablas Principales

#### Sistema Base
- `users` - Usuarios del sistema
- `products` - Catálogo de productos
- `orders` - Pedidos realizados
- `activities` - Log de actividades

#### Sistema de Foros
- `categories` - Categorías principales del foro
- `subforums` - Subforos dentro de categorías
- `threads` - Hilos de discusión
- `posts` - Mensajes en los hilos
- `reactions` - Reacciones a posts
- `bookmarks` - Hilos guardados por usuarios
- `subscriptions` - Suscripciones a categorías/hilos
- `private_messages` - Mensajes privados entre usuarios
- `notifications` - Notificaciones del sistema

#### Sistema de Empleos
- `professional_areas` - Áreas profesionales
- `jobs` - Ofertas de empleo
- `user_profiles` - Perfiles profesionales de usuarios
- `job_applications` - Aplicaciones a empleos

## 🔌 API Endpoints

### Dashboard
- `GET /api/dashboard/stats` - Estadísticas del dashboard
- `GET /api/activities/recent` - Actividades recientes

### Usuarios
- `GET /api/users` - Listar usuarios
- `POST /api/users` - Crear usuario

### Productos
- `GET /api/products` - Listar productos
- `GET /api/products/top-selling` - Productos más vendidos

### Órdenes
- `GET /api/orders` - Listar órdenes
- `GET /api/orders/recent` - Órdenes recientes

### Foros
- `GET /api/forum/categories` - Listar categorías
- `GET /api/forum/threads` - Listar hilos
- `POST /api/forum/threads` - Crear hilo
- `GET /api/forum/threads/:id/posts` - Posts de un hilo
- `POST /api/forum/posts` - Crear post
- `POST /api/forum/reactions` - Agregar reacción
- `GET /api/forum/bookmarks` - Bookmarks del usuario
- `GET /api/forum/notifications` - Notificaciones del usuario

### Empleos
- `GET /api/professional-areas` - Áreas profesionales
- `GET /api/jobs` - Listar empleos
- `POST /api/jobs` - Crear empleo
- `GET /api/user-profiles` - Perfiles de usuarios
- `POST /api/job-applications` - Aplicar a empleo
- `GET /api/admin/job-applications` - (Admin) Ver aplicaciones
- `GET /api/admin/job-stats` - (Admin) Estadísticas

## 🎨 Estructura del Proyecto

```
Keni_Web/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes reutilizables
│   │   ├── pages/         # Páginas de la aplicación
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/           # Utilidades
├── server/                # Backend Node.js
│   ├── index.ts          # Punto de entrada
│   ├── routes.ts         # Definición de rutas
│   ├── storage.ts        # Capa de almacenamiento
│   ├── db.ts             # Conexión a base de datos
│   └── seed.ts           # Script de población
├── shared/               # Código compartido
│   └── schema.ts         # Esquemas de Drizzle ORM
└── migrations/           # Migraciones de base de datos
```

## 🔐 Autenticación

Actualmente el sistema usa almacenamiento en memoria para desarrollo. Para producción se recomienda:
- Implementar JWT o sessions con Passport.js
- Hashear contraseñas con bcrypt
- Agregar proceso de recuperación de contraseña
- Implementar 2FA (autenticación de dos factores)

## 🚀 Despliegue

### Opción 1: Replit
1. Importa el proyecto en Replit
2. Configura la variable `DATABASE_URL` en Secrets
3. Ejecuta `npm run db:push` y `npm run db:seed`
4. La app se desplegará automáticamente

### Opción 2: Vercel (Frontend) + Railway (Backend)
1. **Frontend en Vercel:**
   - Conecta tu repositorio
   - Configura build command: `npm run build`
   - Configura output directory: `dist`

2. **Backend en Railway:**
   - Crea un nuevo proyecto
   - Conecta tu repositorio
   - Agrega una base de datos PostgreSQL
   - Railway proveerá automáticamente `DATABASE_URL`

### Opción 3: Render
1. Crea un Web Service
2. Conecta tu repositorio
3. Agrega una base de datos PostgreSQL
4. Configura las variables de entorno
5. Deploy automático

## 🔧 Configuración de Producción

Para producción, asegúrate de:

1. **Cambiar SESSION_SECRET** en `.env`
2. **Usar HTTPS** para todas las conexiones
3. **Implementar rate limiting** para las APIs
4. **Configurar CORS** apropiadamente
5. **Hashear contraseñas** (no guardar en texto plano)
6. **Implementar logging** apropiado
7. **Configurar monitoreo** de errores (ej: Sentry)
Supabase](https://supabase.com/docs)
- [Supabase Database](https://supabase.com/docs/guides/database)

## 📚 Recursos Adicionales

- 📖 [Guía Completa de Supabase](SUPABASE_SETUP.md) - Tutorial paso a paso
- 📖 [Inicio Rápido](QUICKSTART.md) - Configuración en 5 minutos
- [Documentación de Drizzle ORM](https://orm.drizzle.team/)
- [Guía de Supabase](https://supabase.com/docs)
- [Supabase Database](https://supabase.com/docs/guides/database)
- [React Query Docs](https://tanstack.com/query/latest)
- [Shadcn/UI Components](https://ui.shadcn.com/)

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 💬 Soporte

Si tienes preguntas o problemas, por favor abre un issue en el repositorio.
