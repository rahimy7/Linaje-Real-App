# ✅ Checklist de Configuración - Supabase + Keni Web

Sigue esta lista para configurar tu proyecto paso a paso.

## 📋 Pre-requisitos

- [ ] Node.js 18+ instalado ([Descargar](https://nodejs.org))
- [ ] Git instalado
- [ ] Editor de código (VS Code recomendado)
- [ ] Cuenta de GitHub (para Supabase)

## 🗄️ Configuración de Supabase

### Paso 1: Cuenta y Proyecto

- [ ] Ir a [https://supabase.com](https://supabase.com)
- [ ] Hacer clic en "Start your project"
- [ ] Sign up con GitHub
- [ ] Crear nueva organización (si es primera vez)
- [ ] Hacer clic en "New Project"
- [ ] Completar formulario:
  - [ ] Nombre del proyecto: `keni-web-db`
  - [ ] Contraseña de base de datos: _____________ (¡guárdala!)
  - [ ] Región: (elegir la más cercana)
  - [ ] Plan: Free
- [ ] Hacer clic en "Create new project"
- [ ] Esperar 2-3 minutos

### Paso 2: Connection String

- [ ] Ir a Settings (⚙️) > Database
- [ ] Buscar "Connection string"
- [ ] Seleccionar pestaña **Transaction** ⚠️
- [ ] Copiar el string completo
- [ ] Reemplazar `[YOUR-PASSWORD]` con tu contraseña real

**Tu connection string se verá así:**
```
postgresql://postgres.abcdefgh:TU_CONTRASEÑA@aws-0-region.pooler.supabase.com:6543/postgres
```

## 💻 Configuración del Proyecto

### Paso 3: Clonar e Instalar

- [ ] Abrir terminal
- [ ] Clonar repositorio:
```bash
git clone <tu-repositorio>
cd Keni_Web
```
- [ ] Instalar dependencias:
```bash
npm install
```
- [ ] Esperar a que termine la instalación

### Paso 4: Configurar .env

- [ ] Crear archivo .env:
```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```
- [ ] Abrir `.env` con tu editor
- [ ] Pegar tu connection string de Supabase
- [ ] Cambiar SESSION_SECRET por algo aleatorio
- [ ] Guardar el archivo

**Tu .env debe verse así:**
```env
DATABASE_URL=postgresql://postgres.abcdefgh:TU_PASS@aws-0-region.pooler.supabase.com:6543/postgres
SESSION_SECRET=tu-secreto-aleatorio-muy-largo-y-seguro
```

## 🏗️ Inicialización de Base de Datos

### Paso 5: Crear Tablas

- [ ] En la terminal, ejecutar:
```bash
npm run db:push
```
- [ ] Esperar mensaje: `✓ Done!`
- [ ] Verificar en Supabase > Table Editor que aparezcan las tablas

**Tablas que deberías ver:**
- [ ] users
- [ ] products
- [ ] orders
- [ ] activities
- [ ] categories
- [ ] threads
- [ ] posts
- [ ] jobs
- [ ] user_profiles
- [ ] job_applications
- [ ] reactions
- [ ] bookmarks
- [ ] subscriptions
- [ ] notifications
- [ ] private_messages

### Paso 6: Poblar con Datos

- [ ] En la terminal, ejecutar:
```bash
npm run db:seed
```
- [ ] Esperar los mensajes de progreso
- [ ] Ver mensaje final: `🎉 Seed completed!`
- [ ] Verificar en Supabase que las tablas tienen datos

## 🚀 Ejecutar la Aplicación

### Paso 7: Iniciar Servidor

- [ ] En la terminal, ejecutar:
```bash
npm run dev
```
- [ ] Esperar mensaje: `Server running on http://localhost:5000`
- [ ] Abrir navegador en [http://localhost:5000](http://localhost:5000)

## ✅ Verificación Final

### Frontend

- [ ] El dashboard carga correctamente
- [ ] Se muestran estadísticas
- [ ] Hay productos en la lista
- [ ] Hay usuarios en la tabla
- [ ] Las gráficas se visualizan
- [ ] Los foros muestran categorías

### Backend (API)

Probar estos endpoints en el navegador o Postman:

- [ ] http://localhost:5000/api/users
- [ ] http://localhost:5000/api/products
- [ ] http://localhost:5000/api/forum/categories
- [ ] http://localhost:5000/api/jobs

Todos deberían devolver JSON con datos.

### Supabase Dashboard

- [ ] Abrir [https://supabase.com/dashboard](https://supabase.com/dashboard)
- [ ] Ir a tu proyecto
- [ ] Table Editor muestra todas las tablas
- [ ] Las tablas tienen datos
- [ ] SQL Editor funciona
- [ ] Logs muestran queries recientes

## 🎓 Usuarios de Prueba

Una vez completada la configuración, puedes usar:

```
Usuario Administrador:
Username: juan.perez
Password: password123

Usuario Normal:
Username: maria.gonzalez
Password: password123
```

## 🐛 Solución de Problemas

### ❌ Error: "DATABASE_URL must be set"

**Solución:**
- [ ] Verifica que el archivo `.env` existe
- [ ] Asegúrate que `DATABASE_URL=` está en la primera línea
- [ ] No debe haber espacios antes de `DATABASE_URL`
- [ ] Reinicia el servidor (`Ctrl+C` y `npm run dev`)

### ❌ Error: "Connection refused" o "Failed to connect"

**Solución:**
- [ ] Verifica que copiaste el string completo (sin cortes)
- [ ] Revisa que reemplazaste `[YOUR-PASSWORD]`
- [ ] Asegúrate de usar modo **Transaction**, no Session
- [ ] Verifica tu conexión a internet

### ❌ Error: "Authentication failed for user"

**Solución:**
- [ ] La contraseña en el connection string es incorrecta
- [ ] Ve a Supabase > Settings > Database
- [ ] Haz clic en "Reset Database Password"
- [ ] Actualiza el `.env` con la nueva contraseña

### ❌ Error al ejecutar `npm run db:push`

**Solución:**
- [ ] Verifica que instalaste dependencias (`npm install`)
- [ ] Revisa que el `DATABASE_URL` es correcto
- [ ] Intenta conectarte a Supabase desde el navegador
- [ ] Revisa los mensajes de error específicos

### ❌ El frontend carga pero no hay datos

**Solución:**
- [ ] Ejecutaste `npm run db:seed`?
- [ ] Verifica en Supabase que las tablas tienen datos
- [ ] Revisa la consola del navegador (F12) para errores
- [ ] Revisa la terminal del servidor para errores

### ❌ Puerto 5000 ya en uso

**Solución:**
- [ ] Cierra otros servidores en el puerto 5000
- [ ] O cambia el puerto:
```bash
# Windows
set PORT=3000 && npm run dev

# Mac/Linux
PORT=3000 npm run dev
```

## 📚 Próximos Pasos

Una vez que todo funcione:

- [ ] Explorar el código en `client/src/`
- [ ] Revisar las rutas en `server/routes.ts`
- [ ] Experimentar con Supabase Table Editor
- [ ] Leer [SUPABASE_SETUP.md](SUPABASE_SETUP.md) para features avanzados
- [ ] Personalizar los datos en `server/seed.ts`
- [ ] Agregar tus propias funcionalidades

## 🎉 ¡Listo!

Si completaste todos los checkboxes, ¡felicidades! Tu aplicación está funcionando.

### Recursos Útiles

- 📖 [README.md](README.md) - Documentación completa
- 🚀 [QUICKSTART.md](QUICKSTART.md) - Guía rápida
- 🗄️ [SUPABASE_SETUP.md](SUPABASE_SETUP.md) - Guía detallada de Supabase
- 💬 [Discord Supabase](https://discord.supabase.com) - Comunidad y soporte
- 📚 [Supabase Docs](https://supabase.com/docs) - Documentación oficial

---

**¿Algo no funciona?** Abre un issue en el repositorio con:
1. ✅ Qué pasos completaste
2. ❌ En cuál paso te atascaste  
3. 📝 El mensaje de error completo
4. 💻 Tu sistema operativo y versión de Node.js

¡Buena suerte! 🚀
