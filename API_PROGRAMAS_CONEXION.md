# API Linaje Real — Guía de Conexión para Proyectos Externos

Documentación para conectar proyectos externos (apps móviles, sitios web, etc.) al backend de **Linaje Real App**.

---

## URLs base

| Entorno                  | URL base                                   |
|--------------------------|--------------------------------------------|
| Desarrollo local         | `http://localhost:5000`                    |
| LAN / emulador Android   | `http://10.0.2.2:5000`                     |
| Producción               | `https://linajereal.up.railway.app`        |

> El servidor corre en el puerto **5000** por defecto (`process.env.PORT || 5000`).
> CORS está configurado con `origin: true`, por lo que acepta peticiones desde cualquier origen.

---

## 1. Autenticación

### 1.1 Login
```
POST /api/auth/login
```
**Body:**
```json
{
  "username": "usuario",
  "password": "contraseña"
}
```
**Respuesta exitosa (200):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "usuario",
    "email": "usuario@email.com",
    "role": "user"
  }
}
```

### 1.2 Registro
```
POST /api/auth/register
```
**Body:**
```json
{
  "username": "nuevo_usuario",
  "password": "contraseña",
  "email": "correo@email.com"
}
```

---

## 2. Programas / Cursos

### 2.1 Listar programas publicados
```
GET /api/programas
```
Solo devuelve programas con `publicado = true`.
Para obtener **todos** (incluidos borradores) agrega el query param:
```
GET /api/programas?all=true
```

**Respuesta de ejemplo:**
```json
[
  {
    "id": 1,
    "slug": "40-dias-oracion",
    "nombre": "40 Días de Oración",
    "descripcion": "Un programa devocional de 40 días",
    "icono": "🙏",
    "imagenUrl": null,
    "color": "#EC4899",
    "categoria": "oracion",
    "version": "1.0.0",
    "totalDias": 40,
    "duracion": "40 días",
    "nivel": "Básico",
    "publicado": true,
    "creadoEn": "2025-01-01T00:00:00.000Z",
    "actualizadoEn": "2025-01-01T00:00:00.000Z"
  }
]
```

### 2.2 Obtener un programa por ID
```
GET /api/programas/:id
```

### 2.3 Obtener los días de un programa
```
GET /api/programas/:programaId/dias
```
Devuelve los días **ordenados por `numero`**.

**Campos de cada día:**

| Campo                  | Tipo             | Descripción                              |
|------------------------|------------------|------------------------------------------|
| `id`                   | number           | ID único del día                         |
| `programaId`           | number           | ID del programa al que pertenece         |
| `numero`               | number           | Número secuencial (1, 2, 3…)             |
| `titulo`               | string           | Título del día                           |
| `descripcion`          | string \| null   | Resumen breve                            |
| `versiculoRef`         | string \| null   | Referencia bíblica (ej. "Juan 3:16")     |
| `versiculoTexto`       | string \| null   | Texto completo del versículo             |
| `reflexion`            | string \| null   | Reflexión del día                        |
| `actividadTitulo`      | string \| null   | Título de la actividad práctica          |
| `actividadDescripcion` | string \| null   | Descripción de la actividad              |
| `audioUrl`             | string \| null   | URL de audio (opcional)                  |
| `videoUrl`             | string \| null   | URL de video (opcional)                  |
| `ayunoDescripcion`     | string \| null   | Indicaciones de ayuno (opcional)         |
| `lecturas`             | string[] \| null | Lista de lecturas adicionales            |
| `creadoEn`             | string (ISO)     | Fecha de creación                        |

---

## 3. Foros

### 3.1 Listar categorías
```
GET /api/forum/categories
```

### 3.2 Listar threads
```
GET /api/forum/threads?categoryId=1&subforumId=2
```

### 3.3 Crear thread
```
POST /api/forum/threads
```

---

## 4. Eventos

```
GET    /api/eventos
POST   /api/eventos
GET    /api/eventos/:id
PUT    /api/eventos/:id
DELETE /api/eventos/:id
```

---

## 5. Cursos

```
GET    /api/cursos
POST   /api/cursos
GET    /api/cursos/:id
PUT    /api/cursos/:id
DELETE /api/cursos/:id
```

---

## 6. Meditaciones

```
GET  /api/meditaciones
POST /api/meditaciones
GET  /api/meditaciones/:id
```

---

## 7. Donaciones

```
GET  /api/donaciones
POST /api/donaciones
GET  /api/donaciones/:id
```

---

## 8. Generación de PDF (programas)

La lógica de PDF usa **jsPDF** y está implementada en `client/src/lib/generateProgramaPdf.ts`.

### 8.1 Instalar dependencia
```bash
npm install jspdf
```

### 8.2 Funciones exportadas

#### PDF completo del programa (portada + todos los días)
```ts
import { generateProgramaPdf } from "./generateProgramaPdf";
await generateProgramaPdf(programa, dias);
// → descarga automáticamente "<nombre-del-programa>.pdf"
```

#### PDF de un solo día
```ts
import { generateDiaPdf } from "./generateProgramaPdf";
await generateDiaPdf(programa, dia);
// → descarga automáticamente "Dia-1-<titulo>.pdf"
```

### 8.3 Flujo completo en React
```tsx
const BASE_URL = "http://localhost:5000";

async function descargarPdfCompleto(programaId: number) {
  const [programa, dias] = await Promise.all([
    fetch(`${BASE_URL}/api/programas/${programaId}`).then(r => r.json()),
    fetch(`${BASE_URL}/api/programas/${programaId}/dias`).then(r => r.json()),
  ]);
  await generateProgramaPdf(programa, dias);
}
```

---

## 9. Notas de CORS y seguridad

- El servidor ya tiene `cors({ origin: true })` → acepta cualquier origen en desarrollo.
- En **producción** cambia `origin: true` por la lista explícita de dominios permitidos:
  ```ts
  app.use(cors({
    origin: ["https://tu-app.com", "https://tu-otro-proyecto.com"],
    credentials: true,
  }));
  ```
- Los endpoints de lectura (`GET`) no requieren autenticación actualmente.

---

## 10. Peticiones de Oración (Acceso Público)

Estos endpoints permiten registrar y consultar peticiones de oración **sin necesidad de autenticación**, pensados para integrar otras apps o sitios web.

### 10.1 Endpoint — Registrar petición de oración

```
POST /api/public/oraciones
```

**Headers:**
```
Content-Type: application/json
```

---

### 10.2 Campos del body

| Campo       | Tipo      | Requerido | Default      | Límite           | Descripción                                       |
|-------------|-----------|-----------|--------------|------------------|---------------------------------------------------|
| `peticion`  | `string`  | ✅ Sí     | —            | máx. 1000 chars  | Texto de la petición de oración                   |
| `autor`     | `string`  | ✅ Sí     | —            | máx. 100 chars   | Nombre de quien envía la petición                 |
| `privada`   | `boolean` | ❌ No     | `false`      | —                | Si es `true`, solo admins la ven                  |
| `categoria` | `string`  | ❌ No     | `"general"`  | máx. 80 chars    | Categoría temática (salud, familia, trabajo, …)   |

> Los campos `estado` (default `"pendiente"`) y `contadorOraciones` (default `0`) son manejados automáticamente por el servidor.

---

### 10.3 Respuesta exitosa — `201 Created`

```json
{
  "id": 42,
  "peticion": "Por la sanidad de mi familia",
  "autor": "Juan Pérez",
  "estado": "pendiente",
  "contadorOraciones": 0,
  "privada": false,
  "categoria": "salud",
  "creadoEn": "2026-04-05T14:30:00.000Z",
  "actualizadoEn": "2026-04-05T14:30:00.000Z"
}
```

---

### 10.4 Respuestas de error

| Código | Mensaje                                                       | Causa                     |
|--------|---------------------------------------------------------------|---------------------------|
| `400`  | `"El campo 'peticion' es requerido"`                          | `peticion` ausente o vacío |
| `400`  | `"El campo 'autor' es requerido"`                             | `autor` ausente o vacío   |
| `400`  | `"El campo 'peticion' no puede superar los 1000 caracteres"`  | Texto demasiado largo     |
| `400`  | `"El campo 'autor' no puede superar los 100 caracteres"`      | Nombre demasiado largo    |
| `500`  | `"Error al registrar la petición de oración"`                 | Error interno del servidor |

---

### 10.5 Ejemplos de consumo

#### JavaScript / React (fetch)
```javascript
const BASE_URL = "http://localhost:5000";
// const BASE_URL = "https://linajereal.up.railway.app"; // producción

async function enviarPeticionOracion({ peticion, autor, privada = false, categoria = "general" }) {
  const response = await fetch(`${BASE_URL}/api/public/oraciones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ peticion, autor, privada, categoria }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || "Error al enviar petición");
  }
  return response.json();
}

// Uso
enviarPeticionOracion({
  peticion: "Por la sanidad de mi familia",
  autor: "Juan Pérez",
  categoria: "salud",
})
  .then((data) => console.log("Registrada:", data))
  .catch((err) => console.error(err.message));
```

---

#### React Native
```javascript
import { Platform } from "react-native";

const BASE_URL = __DEV__
  ? Platform.OS === "android"
    ? "http://10.0.2.2:5000"
    : "http://localhost:5000"
  : "https://linajereal.up.railway.app";

async function enviarPeticionOracion(datos) {
  const response = await fetch(`${BASE_URL}/api/public/oraciones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });
  const json = await response.json();
  if (!response.ok) throw new Error(json.error);
  return json;
}
```

---

#### cURL

**Desarrollo:**
```bash
curl -X POST http://localhost:5000/api/public/oraciones \
  -H "Content-Type: application/json" \
  -d '{
    "peticion": "Por la sanidad de mi familia",
    "autor": "Juan Pérez",
    "privada": false,
    "categoria": "salud"
  }'
```

**Producción:**
```bash
curl -X POST https://linajereal.up.railway.app/api/public/oraciones \
  -H "Content-Type: application/json" \
  -d '{
    "peticion": "Por la sanidad de mi familia",
    "autor": "Juan Pérez",
    "privada": false,
    "categoria": "salud"
  }'
```

---

## 11. Endpoints internos de oración (requieren acceso interno)

```
GET    /api/oraciones              — Listar todas las peticiones
GET    /api/oraciones/:id          — Obtener una petición por ID
POST   /api/oraciones              — Crear petición (uso admin/dashboard)
PUT    /api/oraciones/:id          — Actualizar petición
DELETE /api/oraciones/:id          — Eliminar petición
POST   /api/oraciones/:id/orar     — Incrementar contador de oraciones
```

---

## 12. Resumen de endpoints

### Programas / Cursos

| Método | Endpoint                            | Descripción                               |
|--------|-------------------------------------|-------------------------------------------|
| GET    | `/api/programas`                    | Listar publicados (`?all=true` = todos)   |
| GET    | `/api/programas/:id`                | Detalle de un programa                    |
| GET    | `/api/programas/:programaId/dias`   | Días del programa (ordenados por número)  |

### Oración

| Método   | Endpoint                      | Auth requerida | Descripción                                  |
|----------|-------------------------------|----------------|----------------------------------------------|
| `POST`   | `/api/public/oraciones`       | ❌ No          | Registrar petición desde proyecto externo    |
| `GET`    | `/api/oraciones`              | ✅ Interna     | Listar todas las peticiones                  |
| `GET`    | `/api/oraciones/:id`          | ✅ Interna     | Obtener petición por ID                      |
| `POST`   | `/api/oraciones`              | ✅ Interna     | Crear petición (uso admin/dashboard)         |
| `PUT`    | `/api/oraciones/:id`          | ✅ Interna     | Actualizar estado o campos de la petición    |
| `DELETE` | `/api/oraciones/:id`          | ✅ Interna     | Eliminar petición                            |
| `POST`   | `/api/oraciones/:id/orar`     | ✅ Interna     | Incrementar el contador de oraciones         |

---

## Notas generales

- Todos los endpoints retornan `Content-Type: application/json`.
- Los errores siempre incluyen el campo `error` con una descripción legible.
- En producción, las peticiones deben hacerse sobre HTTPS.
- El endpoint `/api/public/oraciones` es el único habilitado para consumo externo sin token.
