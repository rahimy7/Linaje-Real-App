# API Linaje Real — Guía de Conexión para Proyectos Externos

Documentación para conectar proyectos externos (apps móviles, sitios web, etc.) al backend de **Linaje Real App**.

---

## URLs base

| Entorno       | URL base                                   |
|---------------|--------------------------------------------|
| Desarrollo    | `http://localhost:5000`                    |
| Android (AVD) | `http://10.0.2.2:5000`                     |
| Producción    | `https://linajereal.up.railway.app`        |

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

## 2. Foros

### 2.1 Listar categorías
```
GET /api/forum/categories
```

### 2.2 Listar threads
```
GET /api/forum/threads?categoryId=1&subforumId=2
```

### 2.3 Crear thread
```
POST /api/forum/threads
```

---

## 3. Eventos

```
GET /api/eventos
POST /api/eventos
GET /api/eventos/:id
PUT /api/eventos/:id
DELETE /api/eventos/:id
```

---

## 4. Cursos

```
GET /api/cursos
POST /api/cursos
GET /api/cursos/:id
PUT /api/cursos/:id
DELETE /api/cursos/:id
```

---

## 5. Meditaciones

```
GET /api/meditaciones
POST /api/meditaciones
GET /api/meditaciones/:id
```

---

## 6. Donaciones

```
GET /api/donaciones
POST /api/donaciones
GET /api/donaciones/:id
```

---

## 7. Peticiones de Oración (Acceso Público)

Estos endpoints permiten registrar y consultar peticiones de oración **sin necesidad de autenticación**, pensados para integrar otras apps o sitios web.

### 7.1 Endpoint — Registrar petición de oración

```
POST /api/public/oraciones
```

**Headers:**
```
Content-Type: application/json
```

---

### 7.2 Campos del body

| Campo       | Tipo      | Requerido | Default      | Límite           | Descripción                                      |
|-------------|-----------|-----------|--------------|------------------|--------------------------------------------------|
| `peticion`  | `string`  | ✅ Sí     | —            | máx. 1000 chars  | Texto de la petición de oración                  |
| `autor`     | `string`  | ✅ Sí     | —            | máx. 100 chars   | Nombre de quien envía la petición                |
| `privada`   | `boolean` | ❌ No     | `false`      | —                | Si es `true`, solo admins la ven                 |
| `categoria` | `string`  | ❌ No     | `"general"`  | máx. 80 chars    | Categoría temática (salud, familia, trabajo, …)  |

> Los campos `estado` (default `"pendiente"`) y `contadorOraciones` (default `0`) son manejados automáticamente por el servidor.

---

### 7.3 Respuesta exitosa — `201 Created`

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

### 7.4 Respuestas de error

| Código | Mensaje                                               | Causa                                            |
|--------|-------------------------------------------------------|--------------------------------------------------|
| `400`  | `"El campo 'peticion' es requerido"`                  | `peticion` ausente o vacío                       |
| `400`  | `"El campo 'autor' es requerido"`                     | `autor` ausente o vacío                          |
| `400`  | `"El campo 'peticion' no puede superar los 1000 caracteres"` | Texto demasiado largo                   |
| `400`  | `"El campo 'autor' no puede superar los 100 caracteres"`     | Nombre demasiado largo                  |
| `500`  | `"Error al registrar la petición de oración"`         | Error interno del servidor                       |

---

### 7.5 Ejemplos de consumo

#### JavaScript / React (fetch)
```javascript
// Desarrollo
const BASE_URL = "http://localhost:5000";
// Producción
// const BASE_URL = "https://linajereal.up.railway.app";

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
// Para emulador Android usa 10.0.2.2 en lugar de localhost
const BASE_URL = "http://10.0.2.2:5000";        // Android AVD
// const BASE_URL = "http://localhost:5000";     // iOS Simulator
// const BASE_URL = "https://linajereal.up.railway.app"; // Producción

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

## 8. Endpoints de Oración (requieren autenticación interna)

```
GET    /api/oraciones              — Listar todas las peticiones
GET    /api/oraciones/:id          — Obtener una petición por ID
POST   /api/oraciones              — Crear petición (uso interno)
PUT    /api/oraciones/:id          — Actualizar petición
DELETE /api/oraciones/:id          — Eliminar petición
POST   /api/oraciones/:id/orar     — Incrementar contador de oraciones
```

---

## 9. Resumen de endpoints de oración

| Método   | Endpoint                        | Auth requerida | Descripción                                   |
|----------|---------------------------------|----------------|-----------------------------------------------|
| `POST`   | `/api/public/oraciones`         | ❌ No          | Registrar petición desde proyecto externo     |
| `GET`    | `/api/oraciones`                | ✅ Interna     | Listar todas las peticiones                   |
| `GET`    | `/api/oraciones/:id`            | ✅ Interna     | Obtener petición por ID                       |
| `POST`   | `/api/oraciones`                | ✅ Interna     | Crear petición (uso admin/dashboard)          |
| `PUT`    | `/api/oraciones/:id`            | ✅ Interna     | Actualizar estado o campos de la petición     |
| `DELETE` | `/api/oraciones/:id`            | ✅ Interna     | Eliminar petición                             |
| `POST`   | `/api/oraciones/:id/orar`       | ✅ Interna     | Incrementar el contador de oraciones          |

---

## Notas generales

- Todos los endpoints retornan `Content-Type: application/json`.
- Los errores siempre incluyen el campo `error` con una descripción legible.
- En producción, las peticiones deben hacerse sobre HTTPS.
- El endpoint `/api/public/oraciones` es el único habilitado para consumo externo sin token.
